import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { pathToFileURL, fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};

export async function audit(id, interaction)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const spec = await json(path.join(folder, "page.json"));
    const config = await json(path.join(root, "deploy", "config.json"));
    const option = config.pages[id]?.pages?.[0];
    const slug = option?.slug || id.replace(/^\d+-/, "");
    const prefix = `/pages/${slug}/GPT-6/`;
    const evidence = { prompt: id, assertions: 0, checks: [], errors: [], viewports: [] };
    const check = (condition, name) =>
    {
        if (!condition) throw Error(`Assertion failed: ${name}`);
        evidence.assertions++;
        evidence.checks.push(name);
    };
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    const server = http.createServer(async (req, res) =>
    {
        try
        {
            const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            if (!url.startsWith(prefix)) throw Error("Outside public subpath");
            const relative = url.slice(prefix.length) || "index.html";
            const file = path.resolve(out, relative);
            if (!file.startsWith(`${out}${path.sep}`)) throw Error("Outside export");
            const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
            const body = await fs.readFile(file);
            res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
            res.end(body);
        }
        catch
        {
            res.writeHead(404);
            res.end("Not found");
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    let browser;
    try
    {
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
            page.on("pageerror", (e) => evidence.errors.push(e.message));
            page.on("requestfailed", (r) => evidence.errors.push(r.url()));
            page.on("response", (r) =>
            {
                if (r.status() >= 400) evidence.errors.push(`${r.status()} ${r.url()}`);
            });
            const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
            await page.waitForLoadState("networkidle");
            check(response.status() === 200, `${viewport.width}: public subpath served`);
            check(await page.locator("h1").count() === 1, `${viewport.width}: one meaningful headline`);
            check((await page.title()).length > 5, `${viewport.width}: browser title`);
            check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${viewport.width}: no horizontal overflow`);
            await interaction(page, check, viewport.width);
            await page.reload();
            await page.waitForLoadState("networkidle");
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(100);
            await page.screenshot({ path: path.join(folder, ".checks", `${viewport.width === 1200 ? "desktop" : "mobile"}.png`), fullPage: true });
            evidence.viewports.push(viewport);
            await page.close();
        }
        check(evidence.errors.length === 0, `no JavaScript, network or HTTP errors${evidence.errors.length ? `: ${evidence.errors.join("; ")}` : ""}`);
        const exported = await fs.readdir(out);
        check(exported.every((name) => ["index.html", "style.css", "app.js", "art.svg", "preview.png"].includes(name) || name.endsWith(".svg")), "static export allowlist");
        await save(path.join(folder, ".checks", "qa.json"), evidence);
        return evidence;
    }
    finally
    {
        await save(path.join(folder, ".checks", "qa.json"), evidence);
        await browser?.close();
        await new Promise((resolve) => server.close(resolve));
    }
}

export async function run(id)
{
    if (!/^(29[0-9])-[a-z-]+$/.test(id)) throw Error("Outside assigned range");
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    await PromptPageWorkflow.withPromptLock(root, id, async () =>
    {
        const metadataFile = path.join(folder, "metadata.json");
        const resume = process.argv.includes("--resume");
        if (await exists(metadataFile) && !resume) throw Error("Existing metadata requires explicit preservation review");
        if (await exists(path.join(folder, "index.html")) && !resume) throw Error("Existing source requires preservation review");
        if (resume)
        {
            const existing = await json(metadataFile);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            const fingerprint = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
            if (existing.modelId !== "gpt-6.1-sol" || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== fingerprint) throw Error("Resume identity/input mismatch");
        }
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        console.log(`LOCKED ${id} pid=${process.pid}; waiting for source-ready`);
        const waitFor = async (name) =>
        {
            const started = Date.now();
            while (!await exists(path.join(folder, ".checks", name)))
            {
                if (Date.now() - started > 1200000) throw Error(`Timed out waiting for ${name}`);
                await sleep(700);
            }
        };
        let metadata;
        try
        {
            await waitFor("source-ready");
            const spec = await json(path.join(folder, "page.json"));
            if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Meaningful unique tags required");
            metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
            await save(metadataFile, metadata);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex")}\n`);
            await StaticHomepage.checkSource(folder);
            await fs.mkdir(path.join(folder, "out"), { recursive: true });
            for (const file of await fs.readdir(folder))
            {
                if (["index.html", "style.css", "app.js"].includes(file) || file.endsWith(".svg"))
                {
                    await fs.copyFile(path.join(folder, file), path.join(folder, "out", file));
                }
            }
            const config = await json(path.join(root, "deploy", "config.json"));
            const previous = config.pages[id]?.pages?.[0];
            const slug = previous?.slug || id.replace(/^\d+-/, "");
            const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
            metadata.generated = true;
            await save(metadataFile, metadata);
            const verify = await import(pathToFileURL(path.join(folder, "verify.mjs")));
            const qa = await verify.verify();
            await StaticHomepage.ensurePreview(root, { folder }, path.join(folder, "out"), digest, undefined, false);
            metadata.preview = true;
            await save(metadataFile, metadata);
            console.log(`QA_READY ${id}: ${qa.assertions} assertions; inspect .checks desktop.png/mobile.png then write visual-approved`);
            await waitFor("visual-approved");
            const visual = await read(path.join(folder, ".checks", "visual-approved"));
            if (visual.trim().length < 30) throw Error("Actual visual inspection description required");
            metadata.validated = true;
            await save(metadataFile, metadata);
            const before = await json(path.join(root, "deploy", "config.json"));
            await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
            const after = await json(path.join(root, "deploy", "config.json"));
            const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!registered || registered.staticDir !== "out") throw Error("Registration missing");
            const existed = before.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!existed && (registered.enabled || registered.deployed)) throw Error("New result must remain disabled and undeployed");
            for (const [key, value] of Object.entries(before.pages))
            {
                if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Unrelated config changed: ${key}`);
            }
            if (before.pages[id])
            {
                for (let i = 0; i < before.pages[id].pages.length; i++)
                {
                    if (JSON.stringify(before.pages[id].pages[i]) !== JSON.stringify(after.pages[id].pages[i])) throw Error("Existing option changed");
                }
            }
            metadata.config_added = true;
            await save(metadataFile, metadata);
            await fs.appendFile(path.join(folder, "README.md"), `\nActual QA: ${qa.assertions} browser/export assertions plus registration/preservation checks. Desktop 1200×900 and mobile 390×844 full-page screenshots were opened and inspected: ${visual.trim()} Evidence: \`.checks\\qa.json\`, desktop/mobile PNGs. Registered disabled/undeployed; no build, install, dist or publication.\n`);
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", tags: spec.tags, tags_nonempty: true, ...metadata, assertions: qa.assertions, visualQA: true, visualNotes: visual.trim(), registrationChecks: 3, mocks: spec.mocks, limits: "Static browser-only demonstration; no backend, payment or real reservation; no publication" };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            const entry = manifest.records.find((item) => item.prompt === id);
            if (!entry) throw Error("Manifest record absent");
            Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
            await save(manifestFile, manifest);
            console.log(`COMPLETE ${id}: ${qa.assertions} browser checks + 3 registration/preservation checks; lock released on exit`);
        }
        catch (error)
        {
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...(metadata || {}) };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...(metadata || {}) });
            await save(manifestFile, manifest);
            throw error;
        }
    });
}

