import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = path.resolve(".");
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";

export async function begin(id)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const lock = path.join(root, "out", ".generation-locks", `${id}.lock`);
    const files = await fs.readdir(folder).catch(() => []);
    if (files.length) throw Error(`Protected existing output: ${id}`);
    const handle = await fs.open(lock, "wx");
    await handle.writeFile(JSON.stringify({ owner: "serial-206-215", modelId: "gpt-6.1-sol" }));
    await handle.close();
    await fs.mkdir(folder, { recursive: true });
}

export async function verify(url, settings, interactions)
{
    const folder = path.dirname(fileURLToPath(url));
    const id = path.basename(path.dirname(folder));
    const slug = id.replace(/^\d+-/, "");
    const tags = settings.tags;
    if (!tags.length || tags.some((tag) => !tag.trim()) || new Set(tags).size !== tags.length) throw Error("Invalid tags");
    const metadata = { modelId: "gpt-6.1-sol", tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
    const saveMetadata = () => fs.writeFile(path.join(folder, "metadata.json"), JSON.stringify(metadata, null, 4) + "\n");
    await saveMetadata();
    await StaticHomepage.checkSource(folder);
    await fs.mkdir(path.join(folder, "out"), { recursive: true });
    for (const name of ["index.html", "style.css", "app.js", ...(settings.assets || [])])
    {
        await fs.copyFile(path.join(folder, name), path.join(folder, "out", name));
    }
    const exported = path.join(folder, "out");
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    metadata.generated = true;
    await saveMetadata();
    const prefix = `/pages/${slug}/GPT-6/`;
    const errors = [];
    let assertions = 0;
    const check = (condition, message) =>
    {
        assertions++;
        if (!condition) throw Error(message);
    };
    const server = http.createServer(async (req, res) =>
    {
        try
        {
            const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
            if (!pathname.startsWith(prefix)) throw Error("Outside static path");
            const name = pathname.slice(prefix.length) || "index.html";
            if (name.includes("..")) throw Error("Invalid path");
            const content = await fs.readFile(path.join(exported, name));
            const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".png": "image/png" };
            res.writeHead(200, { "Content-Type": types[path.extname(name)] || "application/octet-stream" });
            res.end(content);
        }
        catch
        {
            res.writeHead(404);
            res.end("Not found");
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const browser = await chromium.launch({ headless: true });
    try
    {
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        page.on("requestfailed", (request) => errors.push(request.url()));
        const address = `http://127.0.0.1:${server.address().port}${prefix}index.html`;
        await page.goto(address, { waitUntil: "networkidle" });
        check(await page.title() === settings.title, "Page title");
        check(await page.locator("h1").count() === 1, "One main heading");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Desktop overflow");
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        await page.screenshot({ path: path.join(folder, ".checks", "desktop.png") });
        await interactions(page, check);
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(address, { waitUntil: "networkidle" });
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile overflow");
        check(await page.locator("h1").isVisible(), "Mobile heading visible");
        await page.screenshot({ path: path.join(folder, ".checks", "mobile.png"), fullPage: true });
        if (settings.mobile) await settings.mobile(page, check);
        check(errors.length === 0, `Browser/resource errors: ${errors.join(", ")}`);
    }
    finally
    {
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
    await StaticHomepage.ensurePreview(root, { folder }, exported, digest, undefined, false);
    metadata.preview = true;
    metadata.validated = true;
    const prompt = await fs.readFile(path.join(root, "data", "prompts", id, `${id}.md`), "utf8");
    const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await fs.writeFile(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex") + "\n");
    await saveMetadata();
    const evidence = { time: new Date().toISOString(), assertions, viewports: ["1200x900", "390x844"], errors, screenshots: ["desktop.png", "mobile.png"], mocks: settings.mocks };
    await fs.writeFile(path.join(folder, ".checks", "qa.json"), JSON.stringify(evidence, null, 4) + "\n");
    console.log(JSON.stringify({ id, assertions, browser: "passed", visual: "pending" }));
}

export async function finish(id, review)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const metadata = JSON.parse(await fs.readFile(path.join(folder, "metadata.json"), "utf8"));
    const verification = JSON.parse(await fs.readFile(path.join(folder, ".checks", "qa.json"), "utf8"));
    if (!metadata.validated || !metadata.preview || !review) throw Error("Validation/review incomplete");
    const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const group = config.pages[id];
    const existing = (Array.isArray(group) ? group : group?.pages)?.[0];
    const slug = existing?.slug || id.replace(/^\d+-/, "");
    const title = existing?.title || (await fs.readFile(path.join(folder, "index.html"), "utf8")).match(/<title>(.*?)<\/title>/)[1];
    await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title, tags: metadata.tags, staticDir: "out" });
    const savedConfig = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const option = savedConfig.pages[id].pages.find((entry) => entry.model === "GPT-6");
    if (!option || option.staticDir !== "out") throw Error("Registration missing");
    metadata.config_added = true;
    await fs.writeFile(path.join(folder, "metadata.json"), JSON.stringify(metadata, null, 4) + "\n");
    verification.visualReview = review;
    await fs.writeFile(path.join(folder, ".checks", "qa.json"), JSON.stringify(verification, null, 4) + "\n");
    const record = { time: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated-validated-registered", status: "success", tags: metadata.tags, tagsNonempty: true, ...metadata, deployed: option.deployed, verification, limitations: "Browser-only demonstration; no backend, builds, installations, dist or publication.", error: null };
    await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(record) + "\n", "utf8");
    const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
    const target = manifest.records.find((entry) => entry.prompt === id);
    if (!target || target.number < 206 || target.number > 215) throw Error("Outside batch");
    Object.assign(target, { status: "success", reason: "Static, browser and visual validation passed; registered disabled", metadata, verification, handledAt: record.time });
    const candidate = `${manifestFile}.serial-206-215`;
    await fs.writeFile(candidate, JSON.stringify(manifest, null, 4) + "\n");
    await fs.rename(candidate, manifestFile);
    const lock = path.join(root, "out", ".generation-locks", `${id}.lock`);
    if (JSON.parse(await fs.readFile(lock, "utf8")).owner !== "serial-206-215") throw Error("Lock changed");
    await fs.unlink(lock);
    console.log(JSON.stringify({ id, status: "success", assertions: verification.assertions, lock: "released" }));
}

if (process.argv[2] === "begin") await begin(process.argv[3]);
if (process.argv[2] === "finish") await finish(process.argv[3], process.argv[4]);
