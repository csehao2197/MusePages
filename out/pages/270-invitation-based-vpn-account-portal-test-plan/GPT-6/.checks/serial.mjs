import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { PromptPageWorkflow, StaticHomepage, WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const prompt = process.argv[2];
if (!/^27[0-9]-/.test(prompt)) throw Error("Outside batch");
const folder = path.join(root, "out", "pages", prompt, "GPT-6");
const checks = path.join(folder, ".checks");
const manifest = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const wait = async (file) =>
{
    const start = Date.now();
    while (!await exists(file))
    {
        if (Date.now() - start > 2400000) throw Error(`Timed out awaiting ${path.basename(file)}`);
        await new Promise((resolve) => setTimeout(resolve, 600));
    }
};

await PromptPageWorkflow.withPromptLock(root, prompt, async () =>
{
    await fs.mkdir(checks, { recursive: true });
    if (await exists(path.join(folder, "metadata.json"))) throw Error("Existing metadata requires separate inspection");
    console.log(`LOCKED ${prompt}: awaiting source.ready`);
    await wait(path.join(checks, "source.ready"));
    let evidence;
    let metadata;
    try
    {
        const spec = JSON.parse(await fs.readFile(path.join(checks, "spec.json"), "utf8"));
        const input = await fs.readFile(path.join(root, "data", "prompts", prompt, `${prompt}.md`), "utf8");
        const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
        await fs.writeFile(path.join(folder, "README.md"), `# ${spec.title}\n\nStandalone HTML by gpt-6.1-sol; label GPT-6. Original prompt and full DESIGN applied. ${spec.features}\n\n${spec.limits}\n\nValidation in progress. Static export: out. No environment variables. No builds, installs or publication.\n`);
        await fs.writeFile(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([input, design])).digest("hex") + "\n");
        await StaticHomepage.checkSource(folder);
        const exported = path.join(folder, "out");
        await StaticHomepage.copyHtml(folder, exported);
        await fs.rm(path.join(exported, "verify.mjs"), { force: true });
        const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
        const slug = config.pages[prompt]?.pages?.[0]?.slug || prompt.replace(/^\d+-/, "");
        const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
        await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, false);
        const prefix = `/pages/${slug}/GPT-6/`;
        const server = http.createServer(async (req, res) =>
        {
            const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            const file = url.startsWith(prefix) ? url.slice(prefix.length) || "index.html" : "";
            if (!/^(index\.html|style\.css|app\.js|preview\.png|assets\/[\w.-]+\.(svg|png|jpg|webp))$/.test(file))
            {
                res.writeHead(404).end();
                return;
            }
            try
            {
                res.setHeader("Content-Type", { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" }[path.extname(file)] || "application/octet-stream");
                res.end(await fs.readFile(path.join(exported, file)));
            }
            catch
            {
                res.writeHead(404).end();
            }
        });
        let browser;
        const errors = [];
        let assertions = 0;
        const assert = (condition, label) =>
        {
            if (!condition) throw Error(label);
            assertions++;
        };
        try
        {
            await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
            const url = `http://127.0.0.1:${server.address().port}${prefix}index.html`;
            assert((await fetch(url)).ok, "HTTP readiness");
            browser = await chromium.launch({ headless: true });
            const { run } = await import(pathToFileURL(path.join(folder, "verify.mjs")));
            for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
            {
                const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
                page.on("pageerror", (e) => errors.push(e.message));
                page.on("requestfailed", (e) => errors.push(e.url()));
                page.on("response", (e) => { if (e.status() >= 400) errors.push(`${e.status()} ${e.url()}`); });
                await page.goto(url, { waitUntil: "networkidle" });
                assert(await page.locator("h1").count() === 1, "Single h1");
                assert((await page.title()).length > 4, "Title");
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Initial responsive overflow");
                await page.screenshot({ path: path.join(checks, viewport.width === 1200 ? "desktop.png" : "mobile.png"), fullPage: true });
                await run(page, assert, viewport.width);
                assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Interactive responsive overflow");
                await page.close();
            }
            assert(errors.length === 0, `Browser errors: ${errors.join("; ")}`);
        }
        finally
        {
            if (browser) await browser.close();
            await new Promise((resolve) => server.close(resolve));
        }
        evidence = { assertions, browserAssertions: assertions, browserErrors: errors, desktop: "1200x900", mobile: "390x844", staticDigest: digest, serverStopped: true, visualQA: "awaiting actual image inspection" };
        await WorkspaceFiles.saveJson(path.join(checks, "evidence.json"), evidence);
        console.log(`QA_READY ${prompt} ${assertions} assertions; helpers stopped. Inspect both screenshots then write visual.json.`);
        await wait(path.join(checks, "visual.json"));
        const visual = JSON.parse(await fs.readFile(path.join(checks, "visual.json"), "utf8"));
        if (!visual.desktop || !visual.mobile || !visual.notes) throw Error("Visual inspection incomplete");
        evidence.visualQA = visual;
        metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: true, preview: true, validated: true, config_added: false };
        if (!metadata.tags.length || metadata.tags.some((t) => !t.trim()) || new Set(metadata.tags).size !== metadata.tags.length) throw Error("Invalid tags");
        await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
        await registerGeneratedPage(root, { prompt, model: "GPT-6", slug, title: config.pages[prompt]?.pages?.[0]?.title || spec.title, tags: spec.tags, staticDir: "out" });
        const after = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
        const option = after.pages[prompt].pages.find((p) => p.model === "GPT-6");
        assert(Boolean(option) && !option.enabled && !option.deployed, "Disabled registration persisted");
        for (const [key, value] of Object.entries(config.pages))
        {
            const actual = structuredClone(after.pages[key]);
            if (key === prompt) actual.pages = actual.pages.filter((p) => p.model !== "GPT-6");
            if (JSON.stringify(actual) !== JSON.stringify(value)) throw Error(`Preservation failed for existing config ${key}`);
        }
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
        evidence.registrationPreservation = "All existing config groups, titles, order, options and flags unchanged";
        evidence.assertions = assertions;
        await WorkspaceFiles.saveJson(path.join(checks, "evidence.json"), evidence);
        await fs.writeFile(path.join(folder, "README.md"), `# ${spec.title}\n\nOriginal: \`data\\prompts\\${prompt}\\${prompt}.md\`, used in full with \`src\\workflows\\AI Agent\\DESIGN.md\`.\n\nStandalone HTML/CSS/JavaScript by actual model **gpt-6.1-sol**, public label **GPT-6**. Source: this directory; static export: \`out\\\`. ${spec.features}\n\nBrowser-only demonstration: ${spec.limits} No environment variables or backend. Original CSS/inline SVG artwork; system fonts. Source rights remain with their authors.\n\nVerification: \`node out\\pages\\${prompt}\\GPT-6\\verify.mjs\` (existing Playwright, temporary loopback HTTP). ${evidence.assertions} executed assertions including desktop/mobile interactions, static subpath/resources, overflow, disabled registration and preservation. Evidence/captures: \`.checks\\\`. Actual desktop/mobile image-view inspection: ${visual.notes}\n\nPublic path: \`pages\\${slug}\\GPT-6\\index.html\`. Preview is a current 1200×900 browser capture with matching digest. Registered disabled/undeployed. No builds, installs, dist or publication performed.\n`);
        const summary = { timestamp: new Date().toISOString(), runId, prompt, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "implemented-browser-tested-visually-inspected-registered", status: "generated", tags: spec.tags, tags_valid: true, ...metadata, deployed: false, verification: evidence, limits: spec.limits };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const state = JSON.parse(await fs.readFile(manifest, "utf8"));
        const record = state.records.find((r) => r.prompt === prompt);
        if (!record) throw Error("Manifest record absent");
        Object.assign(record, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", generated: true, preview: true, validated: true, config_added: true, assertions: evidence.assertions, visualQA: true, tags: spec.tags });
        await WorkspaceFiles.saveJson(manifest, state);
        for (const marker of ["source.ready", "visual.json"]) await fs.unlink(path.join(checks, marker));
        console.log(`COMPLETE ${prompt}: browser=${evidence.browserAssertions}, total=${evidence.assertions}; registered disabled, manifest/log persisted.`);
    }
    catch (error)
    {
        const summary = { timestamp: new Date().toISOString(), runId, prompt, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), status: "failed", error: error.message, verification: evidence || "Checks interrupted; artifacts retained" };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const state = JSON.parse(await fs.readFile(manifest, "utf8"));
        Object.assign(state.records.find((r) => r.prompt === prompt), { status: "failed", reason: error.message });
        await WorkspaceFiles.saveJson(manifest, state);
        throw error;
    }
});
