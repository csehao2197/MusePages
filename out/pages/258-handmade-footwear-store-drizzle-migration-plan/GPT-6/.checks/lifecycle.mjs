import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { PromptPageWorkflow, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const id = process.argv[2];
const folder = path.join(root, "out", "pages", id, "GPT-6");
const checks = path.join(folder, ".checks");
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const waitFor = async (name) =>
{
    const until = Date.now() + 1200000;
    while (Date.now() < until)
    {
        try
        {
            return await fs.readFile(path.join(checks, name), "utf8");
        }
        catch (error)
        {
            if (error.code !== "ENOENT") throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw Error(`Timed out awaiting ${name}`);
};
await fs.mkdir(checks, { recursive: true });
await PromptPageWorkflow.withPromptLock(root, id, async () =>
{
    const original = await fs.readFile(path.join(root, "data", "prompts", id, `${id}.md`), "utf8");
    const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    const entries = await fs.readdir(folder);
    if (entries.some((entry) => entry !== ".checks"))
    {
        const existing = JSON.parse(await fs.readFile(path.join(folder, "metadata.json"), "utf8"));
        const fingerprint = (await fs.readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim();
        if (process.argv[3] !== "--resume-qa" || !existing.generated || existing.modelId !== "gpt-6.1-sol" ||
            fingerprint !== createHash("sha256").update(JSON.stringify([original, design])).digest("hex"))
        {
            throw Error("Existing source requires preservation / explicit recovery");
        }
    }
    console.log(`LOCKED ${id}; awaiting ready`);
    await waitFor("ready");
    const spec = JSON.parse(await fs.readFile(path.join(checks, "spec.json"), "utf8"));
    const metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
    const saveMetadata = () => fs.writeFile(path.join(folder, "metadata.json"), `${JSON.stringify(metadata, null, 4)}\n`);
    let server;
    let browser;
    let count = 0;
    let error = null;
    try
    {
        if (!metadata.tags.length || new Set(metadata.tags).size !== metadata.tags.length || metadata.tags.some((tag) => !tag.trim())) throw Error("Invalid tags");
        await StaticHomepage.checkSource(folder);
        const exported = path.join(folder, "out");
        await fs.mkdir(exported, { recursive: true });
        for (const name of ["index.html", "style.css", "app.js"])
        {
            await fs.copyFile(path.join(folder, name), path.join(exported, name));
        }
        try
        {
            await fs.access(path.join(folder, "assets"));
            await StaticHomepage.copyHtml(path.join(folder, "assets"), path.join(exported, "assets"));
        }
        catch (failure)
        {
            if (failure.code !== "ENOENT") throw failure;
        }
        const configBefore = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
        const prior = configBefore.pages[id]?.pages;
        const slug = prior?.[0]?.slug || id.replace(/^\d+-/, "");
        const prefix = `/pages/${slug}/GPT-6/`;
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
        metadata.generated = true;
        await fs.writeFile(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([original, design])).digest("hex") + "\n");
        await saveMetadata();
        server = http.createServer(async (req, res) =>
        {
            try
            {
                const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
                const name = url.startsWith(prefix) ? url.slice(prefix.length) || "index.html" : "";
                if (!["index.html", "style.css", "app.js", "preview.png"].includes(name) && !/^assets\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|svg|webp)$/.test(name))
                {
                    res.writeHead(404).end();
                    return;
                }
                const content = await fs.readFile(path.join(exported, name));
                res.setHeader("Content-Type", name.endsWith(".css") ? "text/css" : name.endsWith(".js") ? "text/javascript" : name.endsWith(".png") ? "image/png" : name.endsWith(".jpg") ? "image/jpeg" : name.endsWith(".svg") ? "image/svg+xml" : name.endsWith(".webp") ? "image/webp" : "text/html");
                res.end(content);
            }
            catch
            {
                res.writeHead(404).end();
            }
        });
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
        const url = `http://127.0.0.1:${server.address().port}${prefix}index.html`;
        browser = await chromium.launch({ headless: true });
        const issues = [];
        const { run } = await import(pathToFileURL(path.join(folder, "verify.mjs")));
        const assert = (value, message) =>
        {
            if (!value) throw Error(message);
            count++;
        };
        for (const [label, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
        {
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
            page.on("pageerror", (e) => issues.push(e.message));
            page.on("console", (e) => { if (e.type() === "error") issues.push(e.text()); });
            page.on("requestfailed", (e) => issues.push(e.url()));
            page.on("response", (e) => { if (e.status() >= 400) issues.push(`${e.status()} ${e.url()}`); });
            await page.goto(url, { waitUntil: "networkidle" });
            assert(await page.title() !== "", `${label} title`);
            assert(await page.locator("h1").count() === 1, `${label} heading`);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} overflow`);
            await page.screenshot({ path: path.join(checks, `${label}.png`), fullPage: false });
            await run(page, assert, label);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label} interaction overflow`);
            await page.close();
        }
        assert(issues.length === 0, `Browser errors: ${issues.join("; ")}`);
        await browser.close();
        browser = null;
        await new Promise((resolve) => server.close(resolve));
        server = null;
        await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, false);
        metadata.preview = true;
        await saveMetadata();
        await fs.writeFile(path.join(checks, "evidence.json"), JSON.stringify({ assertions: count, viewports: ["1200x900", "390x844"], errors: issues, publicPath: prefix, visualQA: "awaiting actual image inspection" }, null, 4));
        console.log(`QA_READY ${id}: ${count} assertions. View .checks desktop.png and mobile.png; approve afterward.`);
        const visual = await waitFor("approved");
        if (!visual.trim()) throw Error("Missing visual observations");
        metadata.validated = true;
        await saveMetadata();
        const latest = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
        const options = latest.pages[id]?.pages;
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug: options?.[0]?.slug || slug, title: options?.[0]?.title || spec.title, tags: metadata.tags, staticDir: "out" });
        const registered = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8")).pages[id].pages.find((entry) => entry.model === "GPT-6");
        if (!registered || registered.staticDir !== "out") throw Error("Registration missing");
        metadata.config_added = true;
        await saveMetadata();
        await fs.writeFile(path.join(checks, "evidence.json"), JSON.stringify({ assertions: count, viewports: ["1200x900", "390x844"], errors: issues, publicPath: prefix, visualQA: visual.trim(), mocked: spec.mocks, builds: false, publication: false }, null, 4));
    }
    catch (failure)
    {
        error = failure.message;
        metadata.validated = false;
        await saveMetadata();
    }
    finally
    {
        if (browser) await browser.close();
        if (server) await new Promise((resolve) => server.close(resolve));
    }
    const summary = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generate-static-frontend", status: error ? "failed" : "completed", tags: metadata.tags, tags_nonempty: metadata.tags.length > 0, ...metadata, assertions: count, desktop: !error, mobile: !error, visualQA: !error, evidence: path.relative(root, path.join(checks, "evidence.json")), mocks: spec.mocks, limits: "Standalone browser-only demonstration; no backend, builds, installations, dist or publication.", error };
    await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
    const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
    const record = manifest.records.find((entry) => entry.prompt === id);
    if (!record) throw Error("Assigned manifest record missing");
    Object.assign(record, summary);
    const staging = manifestFile + `.${process.pid}.new`;
    await fs.writeFile(staging, JSON.stringify(manifest, null, 2) + "\n");
    await fs.rename(staging, manifestFile);
    console.log(JSON.stringify({ prompt: id, status: summary.status, assertions: count, error }));
    if (error) process.exitCode = 1;
});
