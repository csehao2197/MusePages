import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { writeFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "612-jelly-squish-physics-toy", "GPT-6");
const checks = path.join(folder, ".checks");
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { StaticHomepage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const results = [];
const errors = [];
const evidence = {};
let browser;
let service;
let failed;
const test = (name, condition, data = undefined) =>
{
    assert.ok(condition, `${name}: ${JSON.stringify(data)}`);
    results.push({ name, passed: true, ...(data === undefined ? {} : { data }) });
};
const snapshot = (page) => page.evaluate(() => window.jellyDiagnostics);
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
async function observe(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`http: ${response.status()} ${response.url()}`);
    });
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    test("HTTP 200 at final public subpath", response.status() === 200 && service.url.includes("/pages/jelly-squish-physics-toy/GPT-6/"));
    await page.waitForFunction(() => window.jellyDiagnostics?.stepCount > 100);
    await page.evaluate(() => document.fonts.ready);
    test("Visible English homepage and real WebGL canvas", await page.locator("h1").innerText() === "A little less serious." && await page.locator("canvas").count() === 1);
    test("No initial horizontal overflow", await noOverflow(page));
}
async function reset(page)
{
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.waitForTimeout(1000);
}
async function sample(page, milliseconds = 650)
{
    const samples = [];
    for (let i = 0; i < Math.ceil(milliseconds / 65); i++)
    {
        await page.waitForTimeout(65);
        const state = await snapshot(page);
        samples.push({ height: state.height, speed: state.speed, error: state.shapeError, minY: state.minY, maxY: state.maxY });
    }
    return samples;
}
try
{
    await mkdir(checks, { recursive: true });
    evidence.sourceType = await StaticHomepage.checkSource(folder);
    evidence.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "jelly-squish-physics-toy", "GPT-6");
    service = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await observe(page);
    const initial = await snapshot(page);
    evidence.initial = { count: initial.count, constraints: initial.constraints, height: initial.height, speed: initial.speed, shapeError: initial.shapeError };
    test("Closed detailed deformable mesh and connected neighbor constraints", initial.count >= 900 && initial.constraints > 3500, evidence.initial);
    test("Initial plate contact and recognizable jelly height", initial.minY >= 0.144 && initial.height > 1.1 && initial.height < 1.8);
    test("Audio is not initialized or autoplaying", initial.audioState === "not-created");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.getByRole("button", { name: "Grape", exact: true }).click();
    await page.waitForTimeout(300);
    let state = await snapshot(page);
    test("Flavor changes actual material color and selected button", state.flavor === "Grape" && state.color === "#a69cda" && await page.getByRole("button", { name: "Grape", exact: true }).getAttribute("aria-pressed") === "true", { color: state.color });
    const slider = page.getByRole("slider");
    await slider.focus();
    await page.keyboard.press("Home");
    test("Keyboard slider reaches soft endpoint", (await snapshot(page)).stiffness === 0);
    await reset(page);
    await page.getByRole("button", { name: "Squish", exact: false }).click();
    const soft = await sample(page);
    await slider.focus();
    await page.keyboard.press("End");
    test("Keyboard slider reaches firm endpoint", (await snapshot(page)).stiffness === 1);
    await page.keyboard.press("ArrowLeft");
    test("Native keyboard fine adjustment", (await snapshot(page)).stiffness === 0.99);
    await page.keyboard.press("End");
    await reset(page);
    await page.getByRole("button", { name: "Squish", exact: false }).click();
    const firm = await sample(page);
    evidence.stiffness = { softPeak: Math.max(...soft.map((s) => s.error)), firmPeak: Math.max(...firm.map((s) => s.error)), soft, firm };
    test("Soft and firm have measurably different physical deformation", evidence.stiffness.softPeak > evidence.stiffness.firmPeak * 1.15, evidence.stiffness);
    await slider.fill("45");
    await reset(page);
    const before = await snapshot(page);
    await page.mouse.move(before.anchor.x, before.anchor.y);
    await page.mouse.down();
    test("Raycast grabs a local mesh vertex cluster", (await snapshot(page)).grabbing && (await snapshot(page)).clusterSize > 8);
    await page.mouse.move(before.anchor.x + 75, before.anchor.y - 65, { steps: 18 });
    await page.waitForTimeout(450);
    const dragged = await snapshot(page);
    const maxLocal = Math.max(...dragged.positions.map((value, i) => Math.abs(value - before.positions[i])));
    evidence.drag = { maxLocal, shapeError: dragged.shapeError, clusterSize: dragged.clusterSize };
    test("Dragging physically deforms vertices rather than a rigid transform", maxLocal > 0.14 && dragged.shapeError > before.shapeError + 0.025 && dragged.status === "Stretching", evidence.drag);
    await page.mouse.up();
    await page.waitForTimeout(5500);
    const recovered = await snapshot(page);
    evidence.recovery = { shapeError: recovered.shapeError, speed: recovered.speed, minY: recovered.minY };
    test("Release recovers the jelly and respects plate collision", !recovered.grabbing && recovered.shapeError < dragged.shapeError * 0.7 && recovered.minY >= 0.144, evidence.recovery);
    await reset(page);
    const tapBefore = await snapshot(page);
    await page.mouse.click(tapBefore.anchor.x, tapBefore.anchor.y);
    const pokeSamples = await sample(page, 350);
    test("Quick real mesh click applies a physical inward impulse", (await snapshot(page)).impulseCount === tapBefore.impulseCount + 1 && Math.max(...pokeSamples.map((s) => s.speed)) > 0.1);
    const dropsBefore = (await snapshot(page)).dropCount;
    await page.getByRole("button", { name: "Drop it", exact: true }).focus();
    await page.keyboard.press("Space");
    const raised = await snapshot(page);
    test("Space triggers exactly one physical drop", raised.dropCount === dropsBefore + 1 && raised.maxY > 2.8);
    const impact = await sample(page, 1700);
    evidence.drop = impact;
    test("Gravity, floor collision, compression and rebound", Math.min(...impact.map((s) => s.minY)) >= 0.144 &&
        Math.min(...impact.map((s) => s.minY)) < 0.17 && Math.min(...impact.map((s) => s.height)) < 1.45 &&
        Math.max(...impact.map((s) => s.speed)) > 1, impact);
    const compressedIndex = impact.findIndex((s) => s.height === Math.min(...impact.map((item) => item.height)));
    test("Surface rebounds after measured impact compression", Math.max(...impact.slice(compressedIndex).map((s) => s.height)) > impact[compressedIndex].height + 0.12);
    await page.getByRole("button", { name: "Drop it", exact: true }).click();
    test("Drop can be repeated", (await snapshot(page)).dropCount === dropsBefore + 2 && (await snapshot(page)).maxY > 2.8);
    await page.getByRole("button", { name: "Sound off", exact: true }).click();
    test("Explicit sound toggle starts Web Audio", (await snapshot(page)).audioState === "running" && await page.getByRole("button", { name: "Sound on", exact: true }).getAttribute("aria-pressed") === "true");
    await page.getByRole("button", { name: "Squish", exact: false }).click();
    await page.getByRole("button", { name: "Sound on", exact: true }).click();
    test("Sound off suspends Web Audio", (await snapshot(page)).audioState === "suspended");
    for (let i = 0; i < 6; i++) await page.getByRole("button", { name: "Drop it", exact: true }).click();
    await page.waitForTimeout(2500);
    state = await snapshot(page);
    test("Rapid repeated impulses remain finite and bounded", state.positions.every(Number.isFinite) && state.height > 0.8 && state.height < 2.2 && state.minY >= 0.144);
    test("Desktop no horizontal overflow after interactions", await noOverflow(page));
    const pausedAt = await page.evaluate(() =>
    {
        Object.defineProperty(document, "hidden", { configurable: true, value: true });
        document.dispatchEvent(new Event("visibilitychange"));
        return window.jellyDiagnostics.stepCount;
    });
    await page.waitForTimeout(300);
    test("Visibility handler pauses actual physical steps", (await snapshot(page)).stepCount === pausedAt);
    await page.evaluate(() =>
    {
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(300);
    test("Visibility handler resumes without large catch-up timestep", (await snapshot(page)).stepCount > pausedAt &&
        (await snapshot(page)).positions.every(Number.isFinite));
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    test("Wide desktop remains responsive without overflow", await noOverflow(page) && (await page.locator("#stage").boundingBox()).width > 650);
    await context.close();
    const mobileContext = await browser.newContext(
    {
        viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true
    });
    const mobile = await mobileContext.newPage();
    await observe(mobile);
    test("Mobile first screen includes object and complete Drop control", (await mobile.locator("#stage").boundingBox()).y < 300 &&
        (await mobile.locator("#drop").boundingBox()).y + (await mobile.locator("#drop").boundingBox()).height <= 844);
    const targetSizes = await mobile.locator("button").evaluateAll((buttons) => buttons.map((b) => ({ text: b.textContent.trim(), height: b.getBoundingClientRect().height })));
    test("All mobile buttons have at least 44px touch height", targetSizes.every((s) => s.height >= 44), targetSizes);
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    const mobileBefore = await snapshot(mobile);
    await mobile.touchscreen.tap(mobileBefore.anchor.x, mobileBefore.anchor.y);
    await mobile.waitForTimeout(150);
    test("Real mobile tap applies mesh impulse", (await snapshot(mobile)).impulseCount === mobileBefore.impulseCount + 1);
    const session = await mobileContext.newCDPSession(mobile);
    const anchor = (await snapshot(mobile)).anchor;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: anchor.x, y: anchor.y }] });
    for (let i = 1; i <= 12; i++)
    {
        await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: anchor.x + i * 3, y: anchor.y - i * 4 }] });
        await mobile.waitForTimeout(18);
    }
    test("Touch drag grabs and deforms mesh", (await snapshot(mobile)).grabbing && (await snapshot(mobile)).shapeError > 0.05);
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobile.getByRole("button", { name: "Mint", exact: true }).tap();
    await mobile.getByRole("button", { name: "Drop it", exact: true }).tap();
    test("Mobile flavor and drop controls work", (await snapshot(mobile)).flavor === "Mint" && (await snapshot(mobile)).dropCount === 1);
    await mobile.waitForTimeout(1300);
    test("Mobile remains contained after touch interactions", await noOverflow(mobile));
    test("Touch scrolling is captured only by the stage", await mobile.evaluate(() => getComputedStyle(document.querySelector("#stage")).touchAction === "none" && getComputedStyle(document.body).touchAction === "auto"));
    await mobileContext.close();
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    await observe(reducedPage);
    await reducedPage.getByRole("button", { name: "Drop it", exact: true }).click();
    const reducedDrop = await snapshot(reducedPage);
    test("Reduced motion lowers deliberate drop height", reducedDrop.reducedMotion && reducedDrop.maxY < 2.5 && reducedDrop.maxY > 2);
    await reducedPage.getByRole("button", { name: "Squish", exact: false }).focus();
    const countBefore = (await snapshot(reducedPage)).impulseCount;
    await reducedPage.keyboard.press("Enter");
    test("Reduced-motion keyboard squish remains functional", (await snapshot(reducedPage)).impulseCount === countBefore + 1);
    await reducedContext.close();
    test("No browser, console, request or HTTP errors across viewports", errors.length === 0, errors);
}
catch (error)
{
    failed = error;
}
finally
{
    await browser?.close();
    await service?.close();
    await writeFile(path.join(checks, "qa.json"), JSON.stringify(
    {
        passed: !failed,
        timestamp: new Date().toISOString(),
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        tests: results, errors, evidence,
        visualReviewed: false,
        resourcesClosed: true,
        ...(failed ? { failure: failed.stack } : {})
    }, null, 2));
}
if (failed) throw failed;
console.log(JSON.stringify({ passed: true, assertions: results.length, resourcesClosed: true }));
