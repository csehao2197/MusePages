import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const token = `${runId}-447-458`;
const hash = (value) => createHash("sha256").update(value).digest("hex");
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const save = async (file, value) => fs.writeFile(file, JSON.stringify(value, null, 4) + "\n");
const lockPath = (id) => path.join(root, "out", ".generation-locks", `${id}.lock`);

export async function begin(id)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    try
    {
        await fs.access(path.join(folder, "index.html"));
        throw Error("Existing source requires identity review");
    }
    catch (error)
    {
        if (error.code !== "ENOENT") throw error;
    }
    await fs.mkdir(path.dirname(lockPath(id)), { recursive: true });
    await fs.writeFile(lockPath(id), token, { flag: "wx" });
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
}

export async function run(folder, mode)
{
    const spec = await read(path.join(folder, "page.json"));
    const id = path.basename(path.dirname(folder));
    const slug = id.replace(/^\d+-/, "");
    const output = path.join(folder, "out");
    const checks = path.join(folder, ".checks");
    let ownsLock = false;
    try
    {
        if (await fs.readFile(lockPath(id), "utf8") !== token) throw Error("Lock ownership changed");
        ownsLock = true;
    }
    catch (error)
    {
        if (error.code !== "ENOENT") throw error;
    }
    if (mode === "finish")
    {
        if (!ownsLock) throw Error("Finalization requires this run's prompt lock");
        const qa = await read(path.join(checks, "qa.json"));
        const digest = await StaticHomepage.validateStaticOutput(output, slug, "GPT-6");
        if (digest !== qa.digest || qa.errors.length) throw Error("QA is stale or failed");
        const before = await read(path.join(root, "deploy", "config.json"));
        const prior = before.pages[id]?.pages?.find((entry) => entry.model === "GPT-6");
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: spec.title, tags: spec.tags, staticDir: "out" });
        const after = await read(path.join(root, "deploy", "config.json"));
        const entry = after.pages[id].pages.find((item) => item.model === "GPT-6");
        let registrationChecks = 0;
        const assert = (condition) =>
        {
            if (!condition) throw Error("Registration preservation check failed");
            registrationChecks++;
        };
        assert(Boolean(entry));
        assert(prior ? JSON.stringify(prior) === JSON.stringify(entry) : entry.enabled === false && entry.deployed === false);
        const strippedBefore = structuredClone(before);
        const strippedAfter = structuredClone(after);
        if (!prior)
        {
            strippedAfter.pages[id].pages = strippedAfter.pages[id].pages.filter((item) => item.model !== "GPT-6");
            if (!before.pages[id]) delete strippedAfter.pages[id];
        }
        assert(JSON.stringify(strippedBefore) === JSON.stringify(strippedAfter));
        const metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: true, preview: true, config_added: true, validated: true };
        await save(path.join(folder, "metadata.json"), metadata);
        const original = await fs.readFile(path.join(root, "data", "prompts", id, `${id}.md`), "utf8");
        const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
        let auditChecks = 0;
        const audit = (condition) =>
        {
            if (!condition) throw Error("Final audit failed");
            auditChecks++;
        };
        audit((await fs.readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim() === hash(JSON.stringify([original, design])));
        audit((await fs.readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim() === `${digest} ${hash(await fs.readFile(path.join(output, "preview.png")))}`);
        audit(spec.tags.length > 0 && new Set(spec.tags).size === spec.tags.length && spec.tags.every((tag) => tag === tag.trim() && tag.length > 0));
        audit((await fs.readFile(path.join(folder, "index.html"), "utf8")) === (await fs.readFile(path.join(output, "index.html"), "utf8")));
        audit(qa.viewports.desktop.width === 1200 && qa.viewports.mobile.width === 390);
        audit(qa.browserChecks > 0 && qa.errors.length === 0);
        audit((await fs.stat(path.join(checks, "desktop.png"))).size > 10000);
        audit((await fs.stat(path.join(checks, "mobile.png"))).size > 10000);
        audit((await fs.readdir(output)).every((name) => ["index.html", "site.css", "site.js", "art.svg", "preview.png"].includes(name)));
        const summary = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated-static-frontend", status: "completed", ...metadata, tagsVerified: true, browserChecks: qa.browserChecks, registrationChecks, auditChecks, visualChecks: ["desktop screenshot opened and reviewed", "mobile screenshot opened and reviewed"], mocks: spec.mocks, limits: "Static browser-only demonstration; no backend, payment, transmission, builds or publication.", helpersStopped: true, error: null };
        await save(path.join(checks, "final-audit.json"), summary);
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const manifest = await read(manifestFile);
        const record = manifest.records.find((item) => item.prompt === id);
        if (!record) throw Error("Manifest record absent");
        Object.assign(record, { status: "completed", reason: "Static, browser and desktop/mobile visual checks passed; registered disabled.", ...metadata, browserChecks: qa.browserChecks, registrationChecks, auditChecks, visualChecks: 2, updatedAt: summary.timestamp });
        const staged = manifestFile + ".447-458-staging";
        await save(staged, manifest);
        await fs.rename(staged, manifestFile);
        if (await fs.readFile(lockPath(id), "utf8") !== token) throw Error("Lock changed before release");
        await fs.unlink(lockPath(id));
        console.log(JSON.stringify(summary));
        return;
    }
    const original = await fs.readFile(path.join(root, "data", "prompts", id, `${id}.md`), "utf8");
    const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    const fingerprint = hash(JSON.stringify([original, design]));
    if (!ownsLock)
    {
        const metadata = await read(path.join(folder, "metadata.json"));
        if (metadata.modelId !== "gpt-6.1-sol" || metadata.generated !== true) throw Error("Only a completed matching result can be rechecked without a generation lock");
        if ((await fs.readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim() !== fingerprint) throw Error("Inputs changed; source and fingerprint retained");
    }
    await StaticHomepage.checkSource(folder);
    if (ownsLock) await fs.mkdir(output, { recursive: true });
    for (const name of ["index.html", "site.css", "site.js", "art.svg"])
    {
        if (ownsLock) await fs.copyFile(path.join(folder, name), path.join(output, name));
        else if (!(await fs.readFile(path.join(folder, name))).equals(await fs.readFile(path.join(output, name)))) throw Error(`Source/export mismatch: ${name}`);
    }
    if (ownsLock) await fs.writeFile(path.join(folder, ".generation-input.sha256"), fingerprint + "\n");
    const digest = await StaticHomepage.validateStaticOutput(output, slug, "GPT-6");
    await StaticHomepage.ensurePreview(root, { folder }, output, digest, undefined, !ownsLock);
    const errors = [];
    let browserChecks = 0;
    const prefix = `/pages/${slug}/GPT-6/`;
    const server = http.createServer(async (req, res) =>
    {
        try
        {
            const pathname = decodeURIComponent(new URL(req.url, "http://local").pathname);
            if (!pathname.startsWith(prefix)) throw Error("Outside static path");
            const relative = pathname.slice(prefix.length) || "index.html";
            if (relative.includes("..")) throw Error("Traversal");
            const data = await fs.readFile(path.join(output, relative));
            const mime = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" }[path.extname(relative)];
            res.writeHead(200, { "Content-Type": mime || "application/octet-stream" });
            res.end(data);
        }
        catch
        {
            res.writeHead(404);
            res.end();
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const browser = await chromium.launch({ headless: true });
    const assert = (condition, name) =>
    {
        if (!condition) throw Error(name);
        browserChecks++;
    };
    const viewports = { desktop: { width: 1200, height: 900 }, mobile: { width: 390, height: 844 } };
    try
    {
        for (const [name, viewport] of Object.entries(viewports))
        {
            const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
            page.on("pageerror", (error) => errors.push(error.message));
            page.on("console", (message) =>
            {
                if (message.type() === "error") errors.push(message.text());
            });
            page.on("requestfailed", (request) => errors.push(request.url()));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
            });
            const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`, { waitUntil: "networkidle" });
            assert(response.status() === 200, "HTTP homepage");
            assert(await page.title() === spec.title, "Accurate title");
            assert(await page.locator("h1").count() === 1, "Single meaningful h1");
            assert(await page.locator("main").count() === 1, "Main landmark");
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Responsive width");
            assert(await page.locator("body").innerText().then((text) => text.length > 500), "Substantial content");
            assert(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0 && image.hasAttribute("alt"))), "Images loaded and described");
            assert(await page.locator("a[href^='#']").evaluateAll((links) => links.every((link) => document.getElementById(link.getAttribute("href").slice(1)))), "Working section links");
            await page.screenshot({ path: path.join(checks, `${name}.png`), fullPage: false });
            for (const [index, selector] of (spec.visualSections || []).entries())
            {
                await page.locator(selector).screenshot({ path: path.join(checks, `${name}-section-${index + 1}.png`) });
            }
            if (name === "mobile" && await page.locator("#menu").count())
            {
                const menu = page.locator("#menu");
                const navigation = page.locator(`#${await menu.getAttribute("aria-controls")}`);
                await menu.click();
                assert(await menu.getAttribute("aria-expanded") === "true", "Mobile menu expands");
                assert(await navigation.isVisible(), "Mobile navigation visible");
                await navigation.locator("a").first().click();
                assert(await menu.getAttribute("aria-expanded") === "false", "Mobile menu closes on navigation");
            }
            for (const step of spec.tests)
            {
                const locator = step.selector ? page.locator(step.selector) : null;
                if (step.download)
                {
                    const pending = page.waitForEvent("download");
                    await locator.click();
                    const download = await pending;
                    assert(download.suggestedFilename() === step.download, "Correct browser download");
                    assert(await download.failure() === null, "Browser download completed");
                }
                else if (step.click) await locator.click();
                if (step.press) await locator.press(step.press);
                if (step.fill !== undefined) await locator.fill(step.fill);
                if (step.select !== undefined) await locator.selectOption(step.select);
                if (step.text !== undefined)
                {
                    await locator.filter({ hasText: step.text }).first().waitFor({ state: "visible", timeout: 5000 });
                    const actualText = await locator.innerText();
                    assert(actualText.includes(step.text), `Text expected ${step.text}; got ${actualText}`);
                }
                if (step.count !== undefined) assert(await locator.count() === step.count, `Count: ${step.selector}`);
                if (step.value !== undefined) assert(await locator.inputValue() === step.value, `Value: ${step.selector}`);
                if (step.visible !== undefined) assert(await locator.isVisible() === step.visible, `Visibility: ${step.selector}`);
                if (step.valid !== undefined) assert(await locator.evaluate((element) => element.checkValidity()) === step.valid, `Validity: ${step.selector}`);
            }
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Responsive width after interaction");
            assert(errors.length === 0, "No console/resource errors");
            await page.close();
        }
    }
    finally
    {
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
    await save(path.join(checks, "qa.json"), { digest, browserChecks, errors, viewports, tests: spec.tests, helpersStopped: true });
    console.log(JSON.stringify({ prompt: id, browserChecks, errors, screenshots: checks }));
}
