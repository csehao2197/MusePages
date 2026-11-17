import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "../../../..");
const checks = path.join(folder, ".checks");
const result =
{
    passed: false,
    startedAt: new Date().toISOString(),
    tests: [],
    errors: [],
    viewports: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
const contexts = [];
function record(name, evidence)
{
    result.tests.push({ name, passed: true, evidence });
}
async function open(name, options = {}, initializer)
{
    const context = await browser.newContext({ deviceScaleFactor: 1, ...options });
    contexts.push(context);
    if (initializer) await context.addInitScript(initializer);
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    const remote = [];
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(new URL(server.url).origin)) remote.push(request.url());
    });
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.__globe);
    assert.equal(await page.locator("h1").innerText(), "Shake up a little wonder.");
    await noOverflow(page);
    result.viewports.push({ name, ...options, http: response.status(), renderer: await page.evaluate(() => window.__globe.stats().renderer) });
    return { page, context, errors, remote, name };
}
async function noOverflow(page)
{
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(dimensions.scroll <= dimensions.viewport, `Horizontal overflow: ${JSON.stringify(dimensions)}`);
}
async function healthy(session)
{
    await noOverflow(session.page);
    assert.deepEqual(session.errors, [], `${session.name} runtime errors`);
    assert.deepEqual(session.remote, [], `${session.name} remote requests`);
    record(`${session.name}: HTTP, local resources, no console/page/request errors or horizontal overflow`, { errors: session.errors, remoteRequests: session.remote });
}
async function physics(page)
{
    return page.evaluate(() => window.__globe.stats());
}
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    result.url = server.url;
    browser = await chromium.launch({ headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    const desktop = await open("desktop", { viewport: { width: 1200, height: 900 } });
    const page = desktop.page;
    assert.equal((await physics(page)).renderer, "WebGL");
    assert.equal((await physics(page)).count, 720);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.waitForFunction(() => window.__globe.stats().active <= 18, { timeout: 16000 });
    const initial = await physics(page);
    assert.equal(initial.outside, 0);
    record("Initial deterministic flurry reaches rest inside the sphere", initial);
    await page.locator("#shake").click();
    await page.waitForFunction(() => window.__globe.stats().shaking);
    await page.waitForFunction(() => window.__globe.stats().maxHeight > 2.1);
    const lifted = await physics(page);
    assert.ok(lifted.active > 680 && lifted.maxHeight > 2.1, JSON.stringify(lifted));
    assert.equal(lifted.outside, 0);
    await page.waitForFunction(() => !window.__globe.stats().shaking && window.__globe.stats().sinceImpulse > 7.6, { timeout: 20000 });
    const settled = await physics(page);
    assert.ok(settled.active <= 36, `Snow did not settle: ${JSON.stringify(settled)}`);
    assert.equal(settled.outside, 0);
    record("Shake lifts settled snow; three impulses finish; at least 95% settle within 8 fixed-step simulation seconds of last impulse", { lifted, settled });
    await page.locator('[data-scene="1"]').click();
    await page.waitForFunction(() => !window.__globe.stats().transitioning);
    assert.equal((await physics(page)).selected, 1);
    assert.equal(await page.locator("#scene-title").innerText(), "Beacon Point");
    await page.screenshot({ path: path.join(checks, "lighthouse.png") });
    await page.locator('[data-scene="2"]').click();
    await page.waitForFunction(() => !window.__globe.stats().transitioning);
    assert.equal((await physics(page)).selected, 2);
    await page.screenshot({ path: path.join(checks, "city.png") });
    assert.equal(await page.locator('[aria-pressed="true"]').count(), 1);
    record("All three distinct procedural worlds selectable with non-color selected indicators", { selected: await page.locator('[aria-pressed="true"]').innerText() });
    const input = page.locator("#message");
    await input.fill("  A winter for you  ");
    assert.equal((await physics(page)).message, "A winter for you");
    assert.equal(await page.locator("#message-count").innerText(), "20/28");
    await input.fill("ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789");
    assert.equal((await input.inputValue()).length, 28);
    assert.equal((await physics(page)).message.length, 28);
    await input.fill("");
    assert.equal((await physics(page)).message, "");
    assert.equal(await page.locator("#message-helper").innerText(), "Add a message when you are ready.");
    await input.fill("<winter> & snow");
    assert.equal(await page.locator("#message").inputValue(), "<winter> & snow");
    assert.equal((await physics(page)).message, "<winter> & snow");
    record("Live physical plaque updates, whitespace trim, 28 UTF-16 limit, empty and literal markup text", { message: (await physics(page)).message });
    await input.fill("S");
    await input.press("s");
    assert.equal((await physics(page)).shaking, false);
    await page.locator("canvas").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal((await physics(page)).selected, 0);
    await page.keyboard.press("s");
    await page.waitForFunction(() => window.__globe.stats().shaking);
    await page.keyboard.press("r");
    assert.equal((await physics(page)).shaking, false);
    record("Canvas-only S/R/arrow keyboard controls do not intercept editing", await physics(page));
    await page.locator("#settle").click();
    await page.waitForFunction(() => window.__globe.stats().active <= 18, { timeout: 16000 });
    const bounds = await page.locator("canvas").boundingBox();
    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.click(x, y);
    await page.waitForTimeout(100);
    assert.ok((await physics(page)).active <= 18, "Click caused a strong shake");
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 95, y - 45, { steps: 4 });
    const drag = await physics(page);
    assert.ok(drag.active > 650);
    assert.ok(Math.abs(drag.tiltZ) <= .1601 && Math.abs(drag.tiltX) <= .1601);
    assert.ok(Math.abs(drag.tiltZ) > .05);
    await page.mouse.up();
    await page.waitForTimeout(850);
    const upright = await physics(page);
    assert.ok(Math.abs(upright.tiltZ) < .02 && Math.abs(upright.tiltX) < .02, JSON.stringify(upright));
    assert.equal(upright.outside, 0);
    record("Real pointer velocity lifts snow, tilt clamps, simple click does not shake, spring returns upright", { drag, upright });
    await page.locator("#help-open").click();
    assert.equal(await page.locator("dialog").evaluate((node) => node.open), true);
    assert.ok(await page.locator("dialog").evaluate((node) => node.contains(document.activeElement)));
    await page.keyboard.press("Shift+Tab");
    assert.ok(await page.locator("dialog").evaluate((node) => node.contains(document.activeElement)));
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("dialog").evaluate((node) => node.open), false);
    assert.equal(await page.evaluate(() => document.activeElement.id), "help-open");
    record("Native modal focus containment, Escape close and focus return", true);
    await healthy(desktop);
    await desktop.context.close();

    const wide = await open("wide-desktop", { viewport: { width: 1440, height: 900 } });
    assert.equal((await physics(wide.page)).count, 720);
    await healthy(wide);
    await wide.context.close();

    const mobile = await open("mobile", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    assert.equal((await physics(mobile.page)).count, 420);
    await mobile.page.waitForTimeout(700);
    await mobile.page.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    await mobile.page.locator('[data-scene="1"]').tap();
    assert.equal((await physics(mobile.page)).selected, 1);
    await mobile.page.locator("#message").fill("A pocket of winter");
    assert.equal((await physics(mobile.page)).message, "A pocket of winter");
    await mobile.page.locator("#shake").tap();
    await mobile.page.waitForTimeout(100);
    assert.ok((await physics(mobile.page)).active > 390);
    await mobile.page.locator("#settle").tap();
    assert.equal((await physics(mobile.page)).shaking, false);
    const canvasBounds = await mobile.page.locator("canvas").boundingBox();
    const touch = await mobile.context.newCDPSession(mobile.page);
    await mobile.page.locator("canvas").scrollIntoViewIfNeeded();
    const touchBounds = await mobile.page.locator("canvas").boundingBox();
    const tx = touchBounds.x + touchBounds.width / 2;
    const ty = touchBounds.y + touchBounds.height / 2;
    await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: tx, y: ty }] });
    await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: tx + 65, y: ty - 35 }] });
    const touchDrag = await physics(mobile.page);
    await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    assert.ok(touchDrag.active > 390 && Math.abs(touchDrag.tiltZ) > .05);
    await mobile.page.locator("#help-open").tap();
    await mobile.page.locator("#help-close").tap();
    assert.equal(await mobile.page.locator("dialog").evaluate((node) => node.open), false);
    record("Mobile scene, message, shake, settle, physical touch drag and help work", { stageHeight: canvasBounds.height, touchDrag });
    await healthy(mobile);
    await mobile.context.close();

    const reduced = await open("reduced-motion", { viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    assert.equal((await physics(reduced.page)).active, 0);
    await reduced.page.locator("#shake").click();
    await reduced.page.waitForTimeout(1000);
    await reduced.page.waitForFunction(() => !window.__globe.stats().shaking);
    const reducedRest = await physics(reduced.page);
    assert.equal(reducedRest.active, 0, JSON.stringify(reducedRest));
    assert.equal(reducedRest.outside, 0);
    await reduced.page.locator('[data-scene="2"]').click();
    assert.equal((await physics(reduced.page)).active, 0);
    await reduced.page.locator("#message").fill("Still winter");
    assert.equal((await physics(reduced.page)).message, "Still winter");
    await reduced.page.emulateMedia({ reducedMotion: "no-preference" });
    await reduced.page.locator("#shake").click();
    await reduced.page.waitForTimeout(200);
    assert.ok((await physics(reduced.page)).active > 0);
    await reduced.page.emulateMedia({ reducedMotion: "reduce" });
    await reduced.page.waitForTimeout(100);
    assert.equal((await physics(reduced.page)).active, 0);
    record("Reduced-motion rest, restrained 600ms shake, immediate scene swap and live preference changes", true);
    await healthy(reduced);
    await reduced.context.close();

    const fallback = await open("webgl-fallback", { viewport: { width: 390, height: 844 } }, () =>
    {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args)
        {
            if (type === "webgl2" || type === "webgl") return null;
            return getContext.call(this, type, ...args);
        };
    });
    assert.equal((await physics(fallback.page)).renderer, "SVG");
    await fallback.page.locator('[data-scene="2"]').click();
    await fallback.page.locator("#message").fill("Safe <winter>");
    assert.equal(await fallback.page.locator(".fallback text").textContent(), "Safe <winter>");
    await fallback.page.locator("#shake").click();
    assert.ok(await fallback.page.locator(".fallback").evaluate((node) => node.classList.contains("burst")));
    await fallback.page.locator("#settle").click();
    assert.equal(await fallback.page.locator(".fallback").evaluate((node) => node.classList.contains("burst")), false);
    record("WebGL failure preserves original SVG scenes, safely escaped plaque and real CSS burst", await physics(fallback.page));
    await healthy(fallback);
    await fallback.context.close();

    const denied = await open("tilt-denied", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, () =>
    {
        window.__permissionRequests = 0;
        window.DeviceOrientationEvent = class
        {
            static async requestPermission()
            {
                window.__permissionRequests++;
                return "denied";
            }
        };
    });
    assert.equal(await denied.page.evaluate(() => window.__permissionRequests), 0);
    await denied.page.locator(".tilt-button").tap();
    assert.equal(await denied.page.evaluate(() => window.__permissionRequests), 1);
    assert.match(await denied.page.locator(".sensor-status").innerText(), /not granted/);
    await denied.page.locator("#shake").tap();
    await denied.page.waitForTimeout(100);
    assert.ok((await physics(denied.page)).active > 390);
    record("Sensor permission requested only on gesture; denied sensor retains ordinary play", true);
    await healthy(denied);
    await denied.context.close();

    const allowed = await open("tilt-granted", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, () =>
    {
        window.DeviceOrientationEvent = class
        {
            static async requestPermission() { return "granted"; }
        };
    });
    await allowed.page.locator(".tilt-button").tap();
    assert.equal((await physics(allowed.page)).sensorEnabled, true);
    await allowed.page.evaluate(() =>
    {
        for (const [beta, gamma] of [[0, 0], [25, 30]])
        {
            const event = new Event("deviceorientation");
            Object.defineProperties(event, { beta: { value: beta }, gamma: { value: gamma } });
            window.dispatchEvent(event);
        }
    });
    await allowed.page.waitForFunction(() =>
    {
        const state = window.__globe.stats();
        return Math.abs(state.tiltX) > .03 && Math.abs(state.tiltZ) > .03;
    });
    const sensor = await physics(allowed.page);
    assert.ok(Math.abs(sensor.tiltX) > .03 && Math.abs(sensor.tiltZ) > .03);
    await allowed.page.locator(".tilt-button").tap();
    assert.equal((await physics(allowed.page)).sensorEnabled, false);
    record("Granted tilt maps bounded orientation changes and disables cleanly (synthetic sensor, not physical hardware)", sensor);
    await healthy(allowed);
    await allowed.context.close();
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    console.error(error.stack);
}
finally
{
    for (const context of contexts) await context.close().catch(() => {});
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    result.completedAt = new Date().toISOString();
    await W.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, tests: result.tests.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
if (!result.passed) process.exitCode = 1;
