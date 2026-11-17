import path from "node:path";
import { readFile, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
if (job.prompt !== "535-marcus-bennet-editorial-portfolio" || job.modelId !== "gpt-6.1-sol" ||
    state.ownedLock.prompt !== job.prompt || state.ownedLock.pid !== lockPid) throw Error("Lock/job mismatch");
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const existing = config.pages[job.prompt]?.pages?.[0];
const slug = existing?.slug || "marcus-bennet-editorial-portfolio";
const title = existing?.title || "Marcus Bennet editorial portfolio";
const tags = ["Editorial", "Portfolio", "Marquee"];
const metadataFile = path.join(folder, "metadata.json");
const exists = await WorkspaceFiles.info(metadataFile);
const metadata = exists ? await WorkspaceFiles.json(metadataFile) :
    { modelId: job.modelId, tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
if (exists && (metadata.modelId !== job.modelId || metadata.generated !== true)) throw Error("Existing result is not an authorized generated continuation");
if (!exists) await WorkspaceFiles.saveJson(metadataFile, metadata);
await copyFile(path.join(workspace, job.provenance.license_file), path.join(folder, "LICENSE"));
await StaticHomepage.checkSource(folder);
metadata.generated = true;
await WorkspaceFiles.saveJson(metadataFile, metadata);
const raw = await WorkspaceFiles.text(job.file);
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const inputDigest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
const fingerprintFile = path.join(folder, ".generation-input.sha256");
if (exists && (await WorkspaceFiles.text(fingerprintFile)).trim() !== inputDigest) throw Error("Input fingerprint mismatch");
if (!exists) await WorkspaceFiles.saveText(fingerprintFile, inputDigest + "\n");
await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, exported));
for (const name of ["index.html", "style.css", "app.js", "LICENSE", "NOTICE"])
{
    await copyFile(path.join(folder, name), path.join(exported, name));
}
const qa = { prompt: job.prompt, modelId: job.modelId, slug, title, tags, startedAt: new Date().toISOString(), passed: false, staticDigest: null, visualReviewed: false, errors: [], results: [], resourcesClosed: false };
let service;
let browser;
function assert(value, message)
{
    if (!value) throw Error(message);
    qa.results.push(message);
}
async function overflow(page, phase)
{
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth &&
        document.body.scrollWidth <= innerWidth && document.documentElement.scrollHeight <= innerHeight), `${phase}: no horizontal overflow or hero scrolling`);
}
try
{
    qa.staticDigest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    service = await startPreviewServer(exported, { workspace });
    assert(service.url.endsWith(`/pages/${slug}/GPT-6/index.html`), "Server mounts actual final public subpath");
    assert((await fetch(service.url)).status === 200, "Owned preview server is responsive");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        const failures = [];
        page.on("pageerror", error => failures.push(`page: ${error.message}`));
        page.on("console", message =>
        {
            if (message.type() === "error") failures.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", request => failures.push(`request: ${request.url()}: ${request.failure()?.errorText}`));
        page.on("response", response =>
        {
            if (response.status() >= 400) failures.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        const response = await page.goto(service.url, { waitUntil: "networkidle", timeout: 60000 });
        assert(response.status() === 200, `${viewport.width}: homepage HTTP 200`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2800);
        assert(await page.title() === "Marcus — Bennet", `${viewport.width}: exact document title`);
        assert(await page.locator(".brand").isVisible(), `${viewport.width}: meaningful visible brand`);
        assert(await page.locator(".portrait").evaluate(image => image.complete && image.naturalWidth > 0), `${viewport.width}: real portrait loaded`);
        assert(await page.locator(".background").evaluate(image => image.complete && image.naturalWidth > 0), `${viewport.width}: exact remote background loaded`);
        assert(await page.evaluate(() => document.fonts.check('18px "Helvetica Neue ME"')), `${viewport.width}: requested font available`);
        await overflow(page, `${viewport.width} before interaction`);
        await page.screenshot({ path: path.join(checks, mobile ? "mobile.png" : "desktop.png") });
        if (mobile)
        {
            const toggle = page.locator(".menu-toggle");
            const panel = page.locator(".panel");
            await toggle.tap();
            await page.waitForTimeout(900);
            assert(await toggle.getAttribute("aria-expanded") === "true", "Mobile touch opens drawer");
            assert(await page.evaluate(() => document.body.style.overflow === "hidden"), "Mobile drawer locks body");
            assert(await panel.getAttribute("aria-hidden") === "false", "Open drawer is exposed accessibly");
            assert(await panel.locator("a").first().evaluate(link => link === document.activeElement), "Drawer focuses Story");
            await overflow(page, "Mobile drawer open");
            await page.keyboard.press("Escape");
            await page.waitForTimeout(650);
            assert(await toggle.getAttribute("aria-expanded") === "false", "Escape closes drawer");
            assert(await toggle.evaluate(button => button === document.activeElement), "Escape returns focus");
            await toggle.focus();
            await page.keyboard.press("Enter");
            await page.waitForTimeout(900);
            assert(await toggle.getAttribute("aria-expanded") === "true", "Keyboard Enter opens drawer");
            await panel.locator("a").last().focus();
            await page.keyboard.press("Tab");
            assert(await toggle.evaluate(button => button === document.activeElement), "Forward focus trap wraps");
            await page.keyboard.press("Shift+Tab");
            assert(await panel.locator("a").last().evaluate(link => link === document.activeElement), "Reverse focus trap wraps");
            await page.locator(".backdrop").tap({ position: { x: 20, y: 500 } });
            await page.waitForTimeout(650);
            assert(await toggle.getAttribute("aria-expanded") === "false", "Backdrop touch dismisses");
            await toggle.tap();
            await page.waitForTimeout(900);
            await panel.getByRole("link", { name: "Jobs", exact: true }).tap();
            await page.waitForTimeout(650);
            assert(await toggle.getAttribute("aria-expanded") === "false", "Requested placeholder navigation dismisses drawer");
            await toggle.tap();
            await page.waitForTimeout(900);
            await panel.getByRole("button", { name: "Close menu", exact: true }).tap();
            await page.waitForTimeout(650);
            assert(await toggle.getAttribute("aria-expanded") === "false", "Lucide close control closes drawer");
            await toggle.tap();
            await page.waitForTimeout(900);
            await page.setViewportSize({ width: 1200, height: 900 });
            await page.waitForFunction(() => document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false");
            assert(await toggle.getAttribute("aria-expanded") === "false", "Desktop resize closes drawer");
            assert(await page.evaluate(() => document.body.style.overflow !== "hidden"), "Body lock restored after resize");
            await page.setViewportSize(viewport);
        }
        else
        {
            assert(!(await page.locator(".menu-toggle").isVisible()), "Desktop hides mobile controls");
            const story = page.locator(".desktop-chrome").getByRole("link", { name: "Story", exact: true });
            await story.hover();
            await page.waitForTimeout(400);
            assert(await story.evaluate(link => Number(getComputedStyle(link).opacity) < .65), "Desktop navigation hover opacity");
            await story.focus();
            await page.keyboard.press("Enter");
            assert(new URL(page.url()).pathname.endsWith(`/pages/${slug}/GPT-6/index.html`), "Placeholder link preserves final page");
        }
        await overflow(page, `${viewport.width} after interactions`);
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.waitForTimeout(50);
        assert(await page.locator(".marquee").evaluate(track => getComputedStyle(track).animationDuration === "1e-05s" ||
            parseFloat(getComputedStyle(track).animationDuration) < .001), `${viewport.width}: reduced motion collapses marquee`);
        qa.errors.push(...failures);
        assert(failures.length === 0, `${viewport.width}: zero console/page/request/HTTP errors`);
        await context.close();
    }
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    qa.resourcesClosed = true;
    qa.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
}
console.log(JSON.stringify(qa, null, 2));
