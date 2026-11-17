import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const folder = path.join(workspace, "out", "pages", "628-video-streaming-platform", "GPT-6");
const checks = path.join(folder, ".checks");
const exported = path.join(folder, "out");
const results = [];
const errors = [];
let browser;
let service;
const record = (name, evidence) => results.push({ name, passed: true, evidence });
const noOverflow = async (page, stage) =>
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${stage}: ${JSON.stringify(sizes)}`);
    return sizes;
};
async function open(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.locator(".hero-art").evaluate((image) => image.decode());
    assert.equal(await page.title(), "FRAME — A little further from ordinary");
    assert.ok((await page.locator("main").innerText()).length > 500);
}
try
{
    const digest = await StaticHomepage.validateStaticOutput(exported, "video-streaming-platform", "GPT-6");
    record("Independent static output and final public subpath", { digest, subpath: "/pages/video-streaming-platform/GPT-6/index.html" });
    service = await startPreviewServer(exported, { workspace });
    const response = await fetch(service.url);
    assert.equal(response.status, 200);
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    record("Target-only HTTP service running and responsive", { status: 200, sourceOutsideMount: 404 });
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    await open(page);
    record("Desktop initial no overflow", await noOverflow(page, "desktop initial"));
    assert.equal(await page.locator("#film-grid .film-card").count(), 6);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    for (const id of ["quiet", "tidal", "night", "higher", "orbit", "rain"])
    {
        await page.locator(`[data-play="${id}"]`).first().click();
        await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
        const media = await page.locator("video").evaluate((video) => ({ duration: video.duration, width: video.videoWidth, height: video.videoHeight, error: video.error?.message }));
        assert.ok(media.duration >= 7.8 && media.duration <= 8.3, `${id} duration: ${media.duration}`);
        assert.equal(media.width, 640);
        assert.equal(media.height, 360);
        assert.equal(media.error, undefined);
        await page.locator("#big-play").click();
        await page.waitForFunction(() => document.querySelector("video").currentTime > .4);
        await page.locator("#play-pause").click();
        assert.equal(await page.locator("video").evaluate((video) => video.paused), true);
        await page.locator("#seek").fill("4");
        await page.waitForFunction(() => Math.abs(document.querySelector("video").currentTime - 4) < .15);
        record(`Real local playback, pause and seeking: ${id}`, media);
        await page.locator("#player-close").click();
    }
    await page.locator("#hero-play").click();
    await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
    await page.locator("video").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector("video").currentTime >= 5.8);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Space");
    await page.waitForFunction(() => !document.querySelector("video").paused);
    await page.keyboard.press("Space");
    assert.equal(await page.locator("video").evaluate((video) => video.paused), true);
    await page.locator("#speed").selectOption("1.5");
    assert.equal(await page.locator("video").evaluate((video) => video.playbackRate), 1.5);
    await page.locator("#rating").selectOption("5");
    await page.locator("#player-save").click();
    assert.equal(await page.locator("#player-save").getAttribute("aria-pressed"), "true");
    await page.keyboard.press("Escape");
    await page.reload({ waitUntil: "networkidle" });
    assert.ok(await page.locator("#continue-section").isVisible());
    assert.equal(await page.locator("#hero-save").getAttribute("aria-pressed"), "true");
    await page.locator("#hero-play").click();
    await page.waitForFunction(() => document.querySelector("video").currentTime > 3);
    assert.equal(await page.locator("#rating").inputValue(), "5");
    await page.locator("#next-film").click();
    assert.equal(await page.locator("#player-title").innerText(), "Tidal Hours");
    await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
    await page.locator("#player-close").click();
    record("Keyboard, speed, rating, next-film, persisted watchlist and resume", { keys: ["Space", "ArrowRight", "ArrowLeft", "Escape"], persistedAfterReload: true });
    await page.locator('[data-view="watchlist"]').click();
    assert.equal(await page.locator("#film-grid .film-card").count(), 1);
    await page.locator('#film-grid [data-save="quiet"]').click();
    assert.ok(await page.locator("#empty").isVisible());
    await page.locator("#reset").click();
    await page.locator('[data-genre="Nature"]').click();
    assert.equal(await page.locator("#film-grid .film-card").count(), 2);
    await page.locator('[data-genre="All"]').click();
    await page.locator("#search-toggle").click();
    await page.locator("#search").fill("tid");
    assert.equal(await page.locator("#film-grid .film-card").count(), 1);
    assert.equal(await page.locator(".suggestion").innerText(), "Tidal Hours");
    await page.locator("#search").press("ArrowDown");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#player-title").innerText(), "Tidal Hours");
    await page.waitForFunction(() => document.querySelector("video").readyState >= 2);
    await page.locator("#player-close").click();
    await page.locator("#search").fill("<script>not-a-film");
    assert.equal(await page.locator("#film-grid .film-card").count(), 0);
    assert.ok(await page.locator("#empty").isVisible());
    await page.locator("#search-close").click();
    record("Watchlist empty state, genre filters, autocomplete keyboard selection and safe unmatched query", { nature: 2, autocomplete: "Tidal Hours", unmatched: 0 });
    await page.locator("#profile").click();
    await page.locator("#family-mode").check();
    await page.locator("#info-close").click();
    assert.equal(await page.locator("#film-grid .film-card").count(), 5);
    assert.equal(await page.locator('#film-grid [data-play="night"]').count(), 0);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#film-grid .film-card").count(), 5);
    await page.locator("#notifications").click();
    assert.ok((await page.locator("#info-body").innerText()).includes("not live notifications"));
    await page.keyboard.press("Escape");
    await page.locator("#credits").click();
    assert.ok((await page.locator("#info-body").innerText()).includes("fictional"));
    await page.keyboard.press("Escape");
    record("Persistent all-ages filtering and honest credits/notification dialogs", { pgHidden: true, filteredCount: 5 });
    record("Desktop after interactions no overflow", await noOverflow(page, "desktop after"));
    await context.close();
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const mobile = await mobileContext.newPage();
    await open(mobile);
    record("Mobile initial no overflow", await noOverflow(mobile, "mobile initial"));
    await mobile.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    await mobile.locator("#hero-play").tap();
    await mobile.waitForFunction(() => document.querySelector("video").readyState >= 2);
    await mobile.locator("#big-play").tap();
    await mobile.waitForFunction(() => document.querySelector("video").currentTime > .5);
    await mobile.locator("#play-pause").tap();
    await mobile.locator("#seek").fill("3");
    await mobile.waitForFunction(() => Math.abs(document.querySelector("video").currentTime - 3) < .2);
    await mobile.locator("#player-save").tap();
    await mobile.locator("#player-close").tap();
    await mobile.locator('[data-view="watchlist"]').tap();
    assert.equal(await mobile.locator("#film-grid .film-card").count(), 1);
    await mobile.locator('[data-view="home"]').tap();
    await mobile.locator("#search-toggle").tap();
    await mobile.locator("#search").fill("orbit");
    assert.equal(await mobile.locator("#film-grid .film-card").count(), 1);
    await mobile.locator("#search-close").tap();
    record("Mobile real playback/seek, touch watchlist, navigation and search", { viewport: "390x844", saved: 1 });
    record("Mobile after interactions no overflow", await noOverflow(mobile, "mobile after"));
    const playerOverflow = await mobile.locator("#hero-play").tap().then(async () =>
    {
        await mobile.waitForFunction(() => document.querySelector("video").readyState >= 2);
        return mobile.locator("#player-dialog").evaluate((dialog) => ({ client: dialog.clientWidth, scroll: dialog.scrollWidth }));
    });
    assert.ok(playerOverflow.scroll <= playerOverflow.client);
    record("Mobile player controls fit within dialog", playerOverflow);
    await mobile.locator("#player-close").tap();
    await mobileContext.close();
    assert.deepEqual(errors, []);
    record("No HTTP, request, resource, console or page errors", { errors });
}
catch (error)
{
    results.push({ name: "QA failure", passed: false, error: error.stack });
    throw error;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
    {
        prompt: "628-video-streaming-platform",
        modelId: "gpt-6.1-sol",
        passed: results.length > 0 && results.every((result) => result.passed) && errors.length === 0,
        timestamp: new Date().toISOString(),
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        tests: results,
        errors,
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
        visualReviewed: false,
        resourcesClosed: true
    });
}
console.log(`${results.length} QA groups passed; browser and target-only server closed.`);
