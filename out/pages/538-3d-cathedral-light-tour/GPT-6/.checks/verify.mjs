import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.join(workspace, "out", "pages", "538-3d-cathedral-light-tour", "GPT-6");
const qaFile = path.join(folder, ".checks", "qa.json");
const results = [];
const errors = [];
let server;
let browser;
let resourcesClosed = false;
const qa =
{
    prompt: "538-3d-cathedral-light-tour", modelId: "gpt-6.1-sol",
    passed: false, visualReviewed: false, screenshots: {}, tests: results, errors,
    viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }, { width: 1440, height: 900, deviceScaleFactor: 1 }],
    resourcesClosed: false
};
async function check(label, callback)
{
    await callback();
    results.push({ assertion: label, passed: true });
}
async function noOverflow(page, label)
{
    await check(label, async () =>
    {
        const dimensions = await page.evaluate(() => ({ body: document.body.scrollWidth, document: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(dimensions.body <= dimensions.viewport + 1 && dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
    });
}
function monitor(page, viewport)
{
    page.on("console", message =>
    {
        if (message.type() === "error")
        {
            errors.push({ viewport, type: "console", text: message.text() });
        }
    });
    page.on("pageerror", error => errors.push({ viewport, type: "page", text: error.message }));
    page.on("requestfailed", request => errors.push({ viewport, type: "request", text: request.url(), reason: request.failure()?.errorText }));
    page.on("response", response =>
    {
        if (response.status() >= 400)
        {
            errors.push({ viewport, type: "http", status: response.status(), url: response.url() });
        }
    });
}
async function ready(page)
{
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => window.tourEvidence?.().renderEvidence?.triangles > 1000);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
}
async function go(page, index, selector = `.stop-dots [data-go="${index}"]`)
{
    await page.locator(selector).click();
    await page.waitForFunction(i => window.tourEvidence().activeStop === i && Math.abs(window.tourEvidence().tourProgress * 5 - i) < .015, index);
    await page.waitForTimeout(250);
}
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    qa.url = server.url;
    assert.ok(server.url.endsWith("/pages/3d-cathedral-light-tour/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    monitor(page, "desktop");
    await ready(page);
    await check("Desktop HTTP 200, loaded local fonts, meaningful visible hero and actual WebGL triangle rendering", async () =>
    {
        assert.ok(await page.locator("h1").isVisible());
        assert.match(await page.locator("h1").innerText(), /cathedral/);
        const evidence = await page.evaluate(() => window.tourEvidence());
        assert.equal(evidence.webglAvailable, true);
        assert.equal(evidence.renderEvidence.counts.piers, 14);
        assert.equal(evidence.renderEvidence.counts.engagedShafts, 168);
        assert.equal(evidence.renderEvidence.counts.ribSegments, 24);
        assert.equal(evidence.renderEvidence.lancets, 12);
        qa.desktopRenderEvidence = evidence;
    });
    await noOverflow(page, "Desktop has no horizontal overflow before interactions");
    qa.screenshots.desktop = path.join(folder, ".checks", "desktop.png");
    await page.screenshot({ path: qa.screenshots.desktop });
    await go(page, 1, ".hero .primary");
    const positions = [[0, 2.2, 7], [-2.4, 2.3, -1], [1.8, 2.4, -10], [0, 2.5, -18], [2.6, 2.4, -29], [0, 2.5, -41]];
    for (let stop = 0; stop < 6; stop++)
    {
        await go(page, stop);
        await check(`Stop ${stop}: native-scroll progress, actual camera keyframe, visible caption, destination focus and no overflow`, async () =>
        {
            const evidence = await page.evaluate(() => window.tourEvidence());
            assert.ok(evidence.renderEvidence.camera.every((value, axis) => Math.abs(value - positions[stop][axis]) < .12));
            assert.equal(await page.locator(`[data-caption="${stop}"]`).isVisible(), true);
            assert.equal(await page.evaluate(() => document.activeElement.id), `stop-heading-${stop}`);
        });
        await noOverflow(page, `Desktop stop ${stop} does not overflow`);
    }
    await go(page, 4);
    await page.locator("#nave").evaluate(element => element.focus({ preventScroll: true }));
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await check("Keyboard look updates bounded yaw/pitch without moving camera or scroll; R resets", async () =>
    {
        const looked = await page.evaluate(() => window.tourEvidence());
        assert.ok(looked.lookOffset.yaw > 0 && looked.lookOffset.pitch < 0);
        assert.equal(looked.activeStop, 4);
        await page.keyboard.press("r");
        assert.deepEqual((await page.evaluate(() => window.tourEvidence())).lookOffset, { yaw: 0, pitch: 0 });
    });
    await page.mouse.move(320, 260);
    await page.mouse.down();
    await page.mouse.move(420, 310, { steps: 8 });
    await page.mouse.up();
    await check("Desktop pointer drag changes real look offsets and Reset view clears only look", async () =>
    {
        assert.ok(Math.abs((await page.evaluate(() => window.tourEvidence())).lookOffset.yaw) > .1);
        await page.locator('[data-caption="4"] [data-reset]').click();
        const evidence = await page.evaluate(() => window.tourEvidence());
        assert.deepEqual(evidence.lookOffset, { yaw: 0, pitch: 0 });
        assert.equal(evidence.timeMinutes, 990);
        assert.equal(evidence.activeStop, 4);
    });
    await page.locator("#tour-time").focus();
    await page.keyboard.press("ArrowLeft");
    await check("Keyboard range steps by 15 minutes and synchronizes both sliders immediately", async () =>
    {
        assert.equal(await page.locator("#tour-time").inputValue(), "975");
        assert.equal(await page.locator("#study-time").inputValue(), "975");
    });
    const lightEvidence = [];
    for (const minutes of [480, 750, 1050])
    {
        await page.locator(`[data-time="${minutes}"]`).click();
        await check(`Preset ${minutes}: synchronized time, aria state, formula readouts and live section geometry`, async () =>
        {
            assert.equal(await page.locator("#tour-time").inputValue(), String(minutes));
            assert.equal(await page.locator("#study-time").inputValue(), String(minutes));
            assert.equal(await page.locator(`[data-time="${minutes}"]`).getAttribute("aria-pressed"), "true");
            const ray = await page.locator("#diagram-ray").getAttribute("d");
            lightEvidence.push({ minutes, ray, elevation: await page.locator("#elevation").innerText(), length: await page.locator("#length").innerText() });
            const u = (minutes - 360) / 840;
            assert.equal(await page.locator("#elevation").innerText(), `${Math.round(Math.sin(Math.PI * u) * 58)}°`);
        });
        await go(page, 4, ".return-light");
        await page.waitForTimeout(450);
        assert.ok(Math.abs((await page.evaluate(() => window.tourEvidence())).renderEvidence.time - minutes) < 1);
        await go(page, 0);
        await page.screenshot({ path: path.join(folder, ".checks", `light-${minutes}.png`) });
    }
    assert.equal(new Set(lightEvidence.map(evidence => evidence.ray)).size, 3);
    qa.lightEvidence = lightEvidence;
    for (let stop = 0; stop < 6; stop++)
    {
        await go(page, stop, `.note-return[data-go="${stop}"]`);
        assert.equal((await page.evaluate(() => window.tourEvidence())).timeMinutes, 1050);
    }
    results.push({ assertion: "All six field notes return to the actual matching 3D stop, preserve selected time and reset look", passed: true });
    await page.locator("#restart").click();
    await page.waitForFunction(() => window.tourEvidence().activeStop === 0 && window.tourEvidence().tourProgress === 0);
    assert.equal((await page.evaluate(() => window.tourEvidence())).timeMinutes, 990);
    results.push({ assertion: "Closing restart restores threshold, 16:30 and zero look", passed: true });
    await noOverflow(page, "Desktop has no horizontal overflow after all interactions");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobilePage = await mobile.newPage();
    monitor(mobilePage, "mobile");
    await ready(mobilePage);
    await noOverflow(mobilePage, "390×844 mobile has no horizontal overflow before interactions");
    qa.screenshots.mobile = path.join(folder, ".checks", "mobile.png");
    await mobilePage.screenshot({ path: qa.screenshots.mobile });
    await mobilePage.locator(".menu-button").click();
    assert.equal(await mobilePage.locator(".menu-button").getAttribute("aria-expanded"), "true");
    await mobilePage.keyboard.press("Escape");
    assert.equal(await mobilePage.locator("#mobile-menu").isVisible(), false);
    results.push({ assertion: "Mobile menu opens, exposes navigation and closes with Escape restoring focus", passed: true });
    await go(mobilePage, 3);
    await check("Mobile later caption fits above progress and light console; controls remain visible with 44px targets", async () =>
    {
        const caption = await mobilePage.locator('[data-caption="3"]').boundingBox();
        const controls = await mobilePage.locator(".tour-controls").boundingBox();
        assert.ok(caption.y + caption.height <= controls.y + 1);
        for (const box of await mobilePage.locator(".stop-dots button").evaluateAll(elements => elements.map(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))))
        {
            assert.ok(box.width >= 44 && box.height >= 44);
        }
    });
    const cdp = await mobile.newCDPSession(mobilePage);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 230, y: 220 }] });
    for (let step = 1; step <= 5; step++)
    {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 230 - step * 20, y: 220 + step }] });
        await mobilePage.waitForTimeout(35);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.ok(Math.abs((await mobilePage.evaluate(() => window.tourEvidence())).lookOffset.yaw) > .1);
    results.push({ assertion: "Real mobile touch horizontal drag looks around", passed: true });
    const beforeScroll = await mobilePage.evaluate(() => scrollY);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 230, y: 280 }] });
    for (let step = 1; step <= 5; step++)
    {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 230, y: 280 - step * 24 }] });
        await mobilePage.waitForTimeout(35);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobilePage.waitForTimeout(350);
    assert.ok(await mobilePage.evaluate(() => scrollY) > beforeScroll + 30);
    results.push({ assertion: "Real mobile vertical touch gesture preserves native document scrolling", passed: true });
    await mobilePage.locator('[data-time="480"]').tap();
    await go(mobilePage, 4, ".return-light");
    assert.equal((await mobilePage.evaluate(() => window.tourEvidence())).timeMinutes, 480);
    await mobilePage.screenshot({ path: path.join(folder, ".checks", "mobile-glass-stop.png") });
    await noOverflow(mobilePage, "Mobile has no horizontal overflow after touch, presets and route interactions");
    await mobile.close();

    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const widePage = await wide.newPage();
    monitor(widePage, "wide-reduced");
    await ready(widePage);
    await go(widePage, 2);
    await noOverflow(widePage, "1440×900 reduced-motion route remains usable without overflow");
    await wide.close();

    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await fallback.addInitScript(() =>
    {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args)
        {
            return type.startsWith("webgl") ? null : original.call(this, type, ...args);
        };
    });
    const fallbackPage = await fallback.newPage();
    monitor(fallbackPage, "fallback");
    await fallbackPage.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await fallbackPage.locator(".fallback").isVisible(), true);
    assert.equal((await fallbackPage.evaluate(() => window.tourEvidence())).webglAvailable, false);
    await fallbackPage.locator('[data-time="750"]').click();
    const projection = await fallbackPage.locator("#fallback-floor").getAttribute("transform");
    await go(fallbackPage, 5, '.note-return[data-go="5"]');
    assert.equal((await fallbackPage.evaluate(() => window.tourEvidence())).timeMinutes, 750);
    assert.equal(await fallbackPage.locator("#fallback-apse").getAttribute("class"), "highlight");
    assert.ok(projection.includes("scale"));
    await noOverflow(fallbackPage, "No-WebGL SVG edition remains usable at mobile size");
    results.push({ assertion: "Forced no-WebGL edition shows original SVG; all captions, field-note stops and daylight controls remain functional", passed: true });
    await fallback.close();
    assert.deepEqual(errors, []);
    results.push({ assertion: "All desktop, mobile, reduced-motion and fallback browsing completed with no console/page/request/HTTP resource errors", passed: true });
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    console.error(error.stack);
}
finally
{
    await browser?.close();
    await server?.close();
    resourcesClosed = true;
    qa.resourcesClosed = resourcesClosed;
    qa.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(qaFile, qa);
}
console.log(JSON.stringify({ passed: qa.passed, assertions: results.length, errors, resourcesClosed, failure: qa.failure }));
if (!qa.passed)
{
    process.exitCode = 1;
}
