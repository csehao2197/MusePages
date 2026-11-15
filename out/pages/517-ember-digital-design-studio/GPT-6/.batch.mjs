import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PromptPageWorkflow as P, WorkspaceFiles as W, StaticHomepage as S } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-resume-2026-11-15.json";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const [mode, id, note = ""] = process.argv.slice(2);
const folder = path.join(root, "out", "pages", id, "GPT-6");
const slug = id.replace(/^\d+-/, "");
const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
const record = manifest.records.find((entry) => entry.prompt === id);
if (!record || Number(id.slice(0, 3)) < 517 || Number(id.slice(0, 3)) > 526) throw Error("Outside batch");
const metadataFile = path.join(folder, "metadata.json");
const readMeta = async () => JSON.parse(await fs.readFile(metadataFile, "utf8"));
const sourceManifest = JSON.parse(await fs.readFile(path.join(root, "src", "manifest.json"), "utf8"));
const source = (Array.isArray(sourceManifest) ? sourceManifest : sourceManifest.prompts || sourceManifest.entries).find((entry) => entry.id === Number(id.slice(0, 3)));
if (!source || source.sha256.toLowerCase() !== record.inputSha256.toLowerCase()) throw Error("Provenance mismatch");

if (mode === "prepare")
{
    const [prompt] = await P.prompts(root, [id]);
    const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    const digest = hash(JSON.stringify([prompt.content, design]));
    if (digest !== record.expectedInputDigest) throw Error("Input digest mismatch");
    await W.saveText(path.join(folder, ".generation-input.sha256"), digest + "\n");
    await W.saveText(path.join(folder, "LICENSE"), await fs.readFile(path.join(root, source.license_file), "utf8"));
    await W.saveText(path.join(folder, "README.md"), `# ${source.title}

- Input: \`data\\prompts\\${source.filename}\`, with \`src\\workflows\\AI Agent\\DESIGN.md\`.
- Actual generator: **gpt-6.1-sol**; public label/directory: **GPT-6**.
- Standalone HTML/CSS/JavaScript adaptation; no framework build, install or runtime backend. System fonts and original local artwork replace externally hosted media/fonts; this is an adaptation, not an exact reproduction.
- Source: \`out\\pages\\${id}\\GPT-6\`. Export: its \`out\` subdirectory. Eventual public path: \`pages/${slug}/GPT-6/index.html\`.
- ${note}
- Browser-only demonstration; contact actions and project content are local previews, with no email delivery, booking, authentication or external integrations. No environment variables.
- Verification from repository root: \`node out\\pages\\${id}\\GPT-6\\verify.mjs\`; preview: \`node src\\workflows\\script\\generate-preview.mjs out\\pages\\${id}\\GPT-6\\out\`.
- Durable QA: \`.checks/qa.json\`, desktop/mobile screenshots; these are outside the export. Visual review is recorded separately in \`.checks/visual.json\`.
- Provenance: ${source.source_url}. Prompt MIT, Copyright (c) 2026 Nomaan Khan; complete source license retained in source and export. Original adaptation artwork is local. No third-party media is redistributed.
- Registration is disabled/undeployed. Collection assembly and publication are outside this batch.
`);
    await S.checkSource(folder);
    await S.copyHtml(folder, path.join(folder, "out"));
    const staticDigest = await S.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
    const metadata = await readMeta();
    metadata.generated = true;
    await W.saveJson(metadataFile, metadata);
    await W.saveText(path.join(folder, "verify.mjs"), verifier().replaceAll("__SLUG__", slug));
    console.log(JSON.stringify({ id, staticDigest, generated: true }));
}
else if (mode === "finish")
{
    const qa = JSON.parse(await fs.readFile(path.join(folder, ".checks", "qa.json"), "utf8"));
    const visual = JSON.parse(await fs.readFile(path.join(folder, ".checks", "visual.json"), "utf8"));
    if (!qa.passed || !visual.desktop || !visual.mobile) throw Error("QA incomplete");
    const metadata = await readMeta();
    const digest = await S.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
    await S.ensurePreview(root, { folder }, path.join(folder, "out"), digest, undefined, false);
    metadata.preview = true;
    metadata.validated = true;
    await W.saveJson(metadataFile, metadata);
    const before = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const existed = !!before.pages[id];
    await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: source.title, tags: metadata.tags, staticDir: "out" });
    if (!existed)
    {
        const lock = path.join(root, "deploy", ".publish.lock");
        const owner = `${process.pid}\n`;
        let handle;
        const deadline = Date.now() + 5000;
        while (!handle)
        {
            try { handle = await fs.open(lock, "wx"); }
            catch (error)
            {
                if (error.code !== "EEXIST" || Date.now() > deadline) throw error;
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
        try
        {
            await handle.writeFile(owner);
            const configFile = path.join(root, "deploy", "config.json");
            const bytes = await fs.readFile(configFile, "utf8");
            const config = JSON.parse(bytes);
            if (config.pages[id].category && config.pages[id].category !== source.category) throw Error("Category changed concurrently");
            config.pages[id].category = source.category;
            if (await fs.readFile(configFile, "utf8") !== bytes) throw Error("Concurrent config edit");
            await W.saveJson(configFile, config);
        }
        finally
        {
            await handle.close();
            if (await fs.readFile(lock, "utf8") === owner) await fs.unlink(lock);
        }
    }
    const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const option = config.pages[id].pages.find((entry) => entry.model === "GPT-6");
    if (!option || option.enabled || option.deployed || config.pages[id].category !== source.category) throw Error("Registration verification failed");
    metadata.config_added = true;
    await W.saveJson(metadataFile, metadata);
    await outcome("generated", { qa, visual, registration: option, note });
}
else if (mode === "blocked" || mode === "failed")
{
    await outcome(mode, { reason: note, qa: "Not completed; see reason", retainedArtifacts: folder });
}

async function outcome(status, evidence)
{
    let metadata = null;
    try { metadata = await readMeta(); } catch {}
    const timestamp = new Date().toISOString();
    const entry = { timestamp, runId: manifest.runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: folder, action: status, status, tags: metadata?.tags || [], tags_nonempty: !!metadata?.tags?.length, generated: metadata?.generated || false, preview: metadata?.preview || false, validated: metadata?.validated || false, config_added: metadata?.config_added || false, deployed: false, ...evidence };
    await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(entry) + "\n", "utf8");
    const currentBytes = await fs.readFile(manifestFile, "utf8");
    const current = JSON.parse(currentBytes);
    const target = current.records.find((item) => item.prompt === id);
    if (target.status !== "pending-generation") throw Error("Manifest record changed");
    Object.assign(target, { status, metadata, completedAt: timestamp, evidence, registration: evidence.registration || null });
    if (await fs.readFile(manifestFile, "utf8") !== currentBytes) throw Error("Concurrent manifest edit");
    await W.saveJson(manifestFile, current);
    console.log(JSON.stringify({ prompt: id, status, metadata }));
}

function verifier()
{
    return `
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const folder = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(folder, "out");
const prefix = "/pages/__SLUG__/GPT-6/";
const cases = JSON.parse(await fs.readFile(path.join(folder, ".cases.json"), "utf8"));
const checks = [];
const errors = [];
const server = http.createServer(async (req, res) =>
{
    try
    {
        const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        if (!url.startsWith(prefix)) throw Error("Outside public path");
        const file = path.resolve(out, url.slice(prefix.length) || "index.html");
        if (!file.startsWith(out + path.sep)) throw Error("Unsafe path");
        const data = await fs.readFile(file);
        const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
        res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain" });
        res.end(data);
    }
    catch
    {
        res.writeHead(404);
        res.end("Not found");
    }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
try
{
    for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
        page.on("requestfailed", (request) => errors.push(request.url() + ": " + request.failure().errorText));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(response.url() + ": " + response.status()); });
        const response = await page.goto("http://127.0.0.1:" + server.address().port + prefix + "index.html", { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(150);
        assert.ok(await page.locator("h1").isVisible(), "Visible heading");
        assert.ok((await page.locator("body").innerText()).length > 120, "Nonblank content");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + " overflow");
        await page.screenshot({ path: path.join(folder, ".checks", name + ".png"), fullPage: false });
        for (const item of cases)
        {
            if (item.viewport && item.viewport !== name) continue;
            if (item.click) await page.locator(item.click).click();
            if (item.fill) await page.locator(item.fill).fill(item.value);
            if (item.select) await page.locator(item.select).selectOption(item.value);
            if (item.clock)
            {
                const expected = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
                assert.ok((await page.locator(item.clock).innerText()).includes(expected), "Actual London timezone time");
            }
            if (item.key) await page.keyboard.press(item.key);
            if (item.visible) await page.locator(item.visible).waitFor({ state: "visible" });
            if (item.hidden) await page.locator(item.hidden).waitFor({ state: "hidden" });
            if (item.text) assert.ok((await page.locator(item.selector).innerText()).includes(item.text), item.label);
            if (item.attribute) assert.equal(await page.locator(item.selector).getAttribute(item.attribute), item.value);
            checks.push(name + ": " + item.label);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + " post-interaction overflow");
        await page.close();
    }
    assert.deepEqual(errors, [], "Resource and console errors");
    await fs.writeFile(path.join(folder, ".checks", "qa.json"), JSON.stringify({ passed: true, checkedAt: new Date().toISOString(), publicPath: prefix, viewports: ["1200x900", "390x844"], assertions: ["HTTP 200", "Visible nonblank homepage", "No horizontal overflow before/after interactions", "No resource/HTTP/console errors", ...checks], ownedResourcesClosed: true }, null, 4));
    console.log(JSON.stringify({ passed: true, checks: checks.length }));
}
finally
{
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
}
`;
}
