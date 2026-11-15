import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { createHash, randomUUID } from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { PromptPageWorkflow, WorkspaceFiles, StaticHomepage } from "../workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-resume-2026-11-15.json";
const model = { directory: "GPT-6", id: "gpt-6.1-sol", modelId: "gpt-6.1-sol" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function context(number)
{
    if (number < 507 || number > 516) throw Error("Outside authorized batch");
    const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
    const record = manifest.records.find((item) => Number(item.prompt.slice(0, 3)) === number);
    if (!record) throw Error("Missing execution record");
    const source = JSON.parse(await fs.readFile(path.join(root, "src", "manifest.json"), "utf8")).find((item) => item.id === number);
    const prompt = { id: record.prompt, content: await fs.readFile(path.join(root, "data", "prompts", source.filename), "utf8") };
    const current = await PromptPageWorkflow.inspect(root, prompt, model);
    return { manifest, record, source, prompt, current };
}

async function outcome(ctx, status, reason, qa = null)
{
    const metadata = await fs.readFile(ctx.current.file, "utf8").then(JSON.parse).catch(() => null);
    const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const option = config.pages[ctx.prompt.id]?.pages.find((item) => item.model === model.directory) ?? null;
    const latest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
    const record = latest.records.find((item) => item.prompt === ctx.prompt.id);
    if (record.status !== "pending-generation" && !(ctx.continuingValidation && record.status === "failed")) throw Error("Unexpected execution status");
    if (ctx.continuingValidation)
    {
        record.validationCorrection = { previousStatus: record.status, previousReason: record.reason, correctedAt: new Date().toISOString(), sourceRegenerated: false };
    }
    Object.assign(record, { status, completedAt: new Date().toISOString(), reason, metadata, registration: option, qa });
    await WorkspaceFiles.saveJson(manifestFile, latest);
    await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(
    {
        timestamp: new Date().toISOString(),
        runId: latest.runId,
        prompt: ctx.prompt.id,
        display_model_name: model.directory,
        modelId: model.id,
        output: ctx.current.folder,
        action: status === "generated" ? "serial-static-generation" : "serial-requirement-review",
        status,
        tags: metadata?.tags ?? [],
        tagsNonempty: Boolean(metadata?.tags?.length),
        generated: metadata?.generated ?? null,
        preview: metadata?.preview ?? null,
        validated: metadata?.validated ?? null,
        config_added: metadata?.config_added ?? null,
        deployed: option?.deployed ?? null,
        qa: qa ?? { executed: false, reason: "Blocked before implementation; browser and static checks not run." },
        reason
    }) + "\n", "utf8");
}

async function category(ctx)
{
    const lock = path.join(root, "deploy", ".publish.lock");
    const owner = JSON.stringify({ pid: process.pid, token: randomUUID(), prompt: ctx.prompt.id });
    const until = Date.now() + 5000;
    let handle;
    while (!handle)
    {
        try { handle = await fs.open(lock, "wx"); }
        catch (error)
        {
            if (error.code !== "EEXIST" || Date.now() > until) throw error;
            await sleep(100);
        }
    }
    try
    {
        await handle.writeFile(owner);
        const file = path.join(root, "deploy", "config.json");
        const before = await fs.readFile(file, "utf8");
        const config = JSON.parse(before);
        const group = config.pages[ctx.prompt.id];
        if (group.category && group.category !== ctx.source.category) throw Error("Existing category differs");
        group.category = ctx.source.category;
        if (await fs.readFile(file, "utf8") !== before) throw Error("Concurrent config edit");
        await WorkspaceFiles.saveJson(file, config);
    }
    finally
    {
        await handle.close();
        if (await fs.readFile(lock, "utf8") === owner) await fs.unlink(lock);
    }
}

export async function browserQA(folder, slug, test)
{
    const prefix = `/pages/${slug}/GPT-6/`;
    const errors = [];
    const assertions = [];
    const server = http.createServer(async (request, response) =>
    {
        try
        {
            const url = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
            if (!url.startsWith(prefix)) throw Error("Unexpected public path");
            const relative = url.slice(prefix.length) || "index.html";
            if (relative.split("/").includes("..")) throw Error("Invalid path");
            const data = await fs.readFile(path.join(folder, "out", ...relative.split("/")));
            response.setHeader("Content-Type", ({ ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" })[path.extname(relative)] ?? "application/octet-stream");
            response.end(data);
        }
        catch
        {
            response.writeHead(404);
            response.end("Not found");
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    let browser;
    try
    {
        browser = await chromium.launch({ headless: true });
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
        {
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
            page.on("pageerror", (error) => errors.push(`${name}: ${error.message}`));
            page.on("console", (message) => { if (message.type() === "error") errors.push(`${name}: ${message.text()}`); });
            page.on("requestfailed", (request) => errors.push(`${name}: ${request.url()} ${request.failure()?.errorText}`));
            page.on("response", (response) => { if (response.status() >= 400) errors.push(`${name}: HTTP ${response.status()} ${response.url()}`); });
            await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`, { waitUntil: "networkidle" });
            if (!await page.locator("h1").isVisible()) throw Error("Blank heading");
            if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) throw Error(`${name}: horizontal overflow`);
            await page.screenshot({ path: path.join(folder, ".checks", `${name}.png`), fullPage: true });
            const assert = (condition, message) =>
            {
                if (!condition) throw Error(`${name}: ${message}`);
                assertions.push(`${name}: ${message}`);
            };
            await test(page, assert, name);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "No overflow after interactions");
            await page.close();
        }
        if (errors.length) throw Error(errors.join("\n"));
        const report = { passed: true, checkedAt: new Date().toISOString(), publicPath: `${prefix}index.html`, assertions, errors, viewports: ["1200x900", "390x844"], screenshots: [".checks/desktop.png", ".checks/mobile.png"], visualReviewed: false };
        await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), report);
        return report;
    }
    finally
    {
        await browser?.close();
        await new Promise((resolve) => server.close(resolve));
    }
}

async function main()
{
    const [command, numberValue, ...rest] = process.argv.slice(2);
    const ctx = await context(Number(numberValue));
    if (command === "read")
    {
        console.log(JSON.stringify({ record: { prompt: ctx.record.prompt, status: ctx.record.status, category: ctx.record.category }, inspection: ctx.current, source: ctx.source }, null, 2));
        console.log("\nFULL PROMPT\n" + ctx.prompt.content);
        console.log("\nSOURCE LICENSE\n" + await fs.readFile(path.join(root, ctx.source.license_file), "utf8"));
        console.log("LOCK", await fs.readFile(path.join(root, "out", ".generation-locks", `${ctx.prompt.id}.lock`), "utf8").catch(() => "none"));
        return;
    }
    if (command === "continue-validation" && ctx.record.status === "failed" && ctx.current.metadata?.generated === false)
    {
        ctx.continuingValidation = true;
    }
    else if (ctx.record.status !== "pending-generation") throw Error("Unexpected execution status");
    if (command === "resume")
    {
        const ownerFile = path.join(ctx.current.folder, ".serial-owner.json");
        const old = JSON.parse(await fs.readFile(ownerFile, "utf8"));
        if (old.prompt !== ctx.prompt.id || ctx.current.metadata?.generated) throw Error("Not an interrupted owned attempt");
        try
        {
            process.kill(old.pid, 0);
            throw Error("Previous owner remains active");
        }
        catch (error)
        {
            if (error.code !== "ESRCH") throw error;
        }
        const oldLock = path.join(root, "out", ".generation-locks", `${ctx.prompt.id}.lock`);
        if (await fs.readFile(oldLock, "utf8") !== `${old.pid}\n`) throw Error("Lock owner differs");
        await fs.unlink(oldLock);
        await fs.unlink(ownerFile);
    }
    else if (ctx.current.metadata && !ctx.continuingValidation) throw Error("Unexpected existing state; explicit retry required");
    if (command === "block")
    {
        await PromptPageWorkflow.withPromptLock(root, ctx.prompt.id, async () => outcome(ctx, "blocked", rest.join(" ")));
        console.log("Recorded blocked:", ctx.prompt.id);
        return;
    }
    if (!["hold", "resume", "continue-validation"].includes(command)) throw Error("Unknown command");
    await PromptPageWorkflow.withPromptLock(root, ctx.prompt.id, async () =>
    {
        const current = await PromptPageWorkflow.inspect(root, ctx.prompt, model);
        if (current.metadata && command !== "resume" && !ctx.continuingValidation) throw Error("Unexpected metadata");
        await fs.mkdir(current.folder, { recursive: true });
        const owner = { pid: process.pid, prompt: ctx.prompt.id, token: randomUUID(), startedAt: new Date().toISOString() };
        await WorkspaceFiles.saveJson(path.join(current.folder, ".serial-owner.json"), owner);
        console.log("LOCKED", JSON.stringify(owner));
        const control = path.join(current.folder, ".serial-command");
        const deadline = Date.now() + 25 * 60 * 1000;
        let qa;
        try
        {
            while (Date.now() < deadline)
            {
                const action = await fs.readFile(control, "utf8").catch(() => "");
                if (!action) { await sleep(500); continue; }
                await fs.unlink(control);
                if (action.trim() === "check")
                {
                    try
                    {
                        await StaticHomepage.checkSource(current.folder);
                        await StaticHomepage.copyHtml(current.folder, path.join(current.folder, "out"));
                        const slug = ctx.prompt.id.replace(/^\d+-/, "");
                        await StaticHomepage.validateStaticOutput(path.join(current.folder, "out"), slug, model.directory);
                        const verify = await import(pathToFileURL(path.join(current.folder, ".checks", "verify.mjs")).href + `?v=${Date.now()}`);
                        qa = await verify.run();
                        console.log("QA_READY", JSON.stringify(qa));
                    }
                    catch (error)
                    {
                        qa = null;
                        await WorkspaceFiles.saveJson(path.join(current.folder, ".checks", "last-error.json"), { at: new Date().toISOString(), error: error.stack });
                        console.error("QA_NEEDS_CORRECTION", error.stack);
                    }
                }
                else if (action.trim() === "approve")
                {
                    if (!qa?.passed) throw Error("QA not passed");
                    qa.visualReviewed = true;
                    qa.visualReview = "Both actual desktop and mobile PNGs opened with image tooling; composition, readability, alignment and responsive layout reviewed.";
                    await WorkspaceFiles.saveJson(path.join(current.folder, ".checks", "qa.json"), qa);
                    const metadata = JSON.parse(await fs.readFile(current.file, "utf8"));
                    const slug = ctx.prompt.id.replace(/^\d+-/, "");
                    const digest = await StaticHomepage.validateStaticOutput(path.join(current.folder, "out"), slug, model.directory);
                    await StaticHomepage.ensurePreview(root, current, path.join(current.folder, "out"), digest, undefined, false);
                    metadata.generated = true;
                    metadata.preview = true;
                    metadata.validated = true;
                    await WorkspaceFiles.saveJson(current.file, metadata);
                    const prompt = (await PromptPageWorkflow.prompts(root, [numberValue]))[0];
                    const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
                    const inputDigest = createHash("sha256").update(JSON.stringify([prompt.content, design])).digest("hex");
                    if (inputDigest !== ctx.record.expectedInputDigest) throw Error("Input digest mismatch");
                    await WorkspaceFiles.saveText(path.join(current.folder, ".generation-input.sha256"), inputDigest + "\n");
                    const title = JSON.parse(await fs.readFile(path.join(current.folder, ".page-info.json"), "utf8")).title;
                    await registerGeneratedPage(root, { prompt: ctx.prompt.id, model: model.directory, slug, title, tags: metadata.tags, staticDir: "out" });
                    await category(ctx);
                    const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
                    const option = config.pages[ctx.prompt.id].pages.find((item) => item.model === model.directory);
                    if (!option || option.enabled !== false || option.deployed !== false || config.pages[ctx.prompt.id].category !== ctx.source.category) throw Error("Registration verification failed");
                    metadata.config_added = true;
                    await WorkspaceFiles.saveJson(current.file, metadata);
                    await outcome(ctx, "generated", `Original local artwork; standalone HTML/CSS/JS adaptation. Browser-only demo interactions; no backend. Source ${ctx.source.license} license retained. Desktop/mobile screenshots visually reviewed. Registered disabled, not deployed.`, qa);
                    console.log("COMPLETE", ctx.prompt.id);
                    return;
                }
                else throw Error("Unknown control command");
            }
            throw Error("Serial generation deadline exceeded");
        }
        catch (error)
        {
            await outcome(ctx, "failed", error.stack, qa);
            throw error;
        }
        finally
        {
            const actual = JSON.parse(await fs.readFile(path.join(current.folder, ".serial-owner.json"), "utf8"));
            if (actual.token === owner.token && actual.pid === process.pid)
            {
                await fs.unlink(path.join(current.folder, ".serial-owner.json"));
            }
        }
    });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i, "$1")))
{
    main().catch((error) =>
    {
        console.error(error);
        process.exitCode = 1;
    });
}
