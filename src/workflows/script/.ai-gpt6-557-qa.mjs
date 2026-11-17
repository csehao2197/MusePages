import path from "node:path";
import { createHash } from "node:crypto";
import { copyFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "557-solar-system-3d-explainer");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await WorkspaceFiles.json(job.stateFile);
const pid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, pid);
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
await mkdir(checks, { recursive: true });
await mkdir(exported, { recursive: true });
const metadataFile = path.join(folder, "metadata.json");
let metadata;
if (await WorkspaceFiles.info(metadataFile))
{
    metadata = await WorkspaceFiles.json(metadataFile);
    assert.equal(metadata.modelId, job.modelId);
}
else
{
    metadata = { modelId: job.modelId, tags: ["Astronomy", "Interactive 3D"], staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
}
const original = await WorkspaceFiles.text(job.file);
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const inputDigest = createHash("sha256").update(JSON.stringify([original, design])).digest("hex");
await StaticHomepage.checkSource(folder);
await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), inputDigest + "\n");
metadata.generated = true;
await WorkspaceFiles.saveJson(metadataFile, metadata);
for (const name of ["index.html", "styles.css", "main.js", "content.js", "scene.js", "LICENSE"])
{
    await copyFile(path.join(folder, name), path.join(exported, name));
}
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const shared = config.pages[job.prompt]?.pages?.[0] ?? { slug: "solar-system-3d-explainer", title: "Solar System 3D Explainer" };
const digest = await StaticHomepage.validateStaticOutput(exported, shared.slug, "GPT-6");
const result =
{
    prompt: job.prompt,
    modelId: job.modelId,
    passed: false,
    visualReviewed: false,
    staticDigest: digest,
    inputDigest,
    viewports: { desktop: { width: 1200, height: 900, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 1 } },
    tests: [],
    errors: [],
    screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
    resourcesClosed: false
};
let server;
let browser;
const test = async (name, action) =>
{
    await action();
    result.tests.push({ name, passed: true });
};
const errors = [];
function observe(page)
{
    page.on("pageerror", error => errors.push(`page: ${error.message}`));
    page.on("console", message =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", request => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", response =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
}
async function noOverflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}
try
{
    server = await startPreviewServer(exported, { workspace });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: result.viewports.desktop, deviceScaleFactor: 1 });
    observe(page);
    await test("Desktop final-subpath HTTP, nonblank UI and real WebGL 2", async () =>
    {
        const response = await page.goto(server.url);
        assert.equal(response.status(), 200);
        await page.locator("#universe[data-renderer='webgl2']").waitFor();
        await page.waitForTimeout(1400);
        assert.equal(await page.locator("h1").isVisible(), true);
        assert.equal(await page.locator("#body-name").textContent(), "Earth");
        assert.equal(await page.locator(".body-selector button").count(), 9);
        await noOverflow(page);
    });
    await page.screenshot({ path: result.screenshots.desktop });
    await test("Picking a rendered sphere selects it; pointer dragging orbits real geometry", async () =>
    {
        const sun = await page.locator(".body-label").first().evaluate(label => ({ x: parseFloat(label.style.left), y: parseFloat(label.style.top) - 25 }));
        await page.mouse.click(sun.x, sun.y);
        assert.equal(await page.locator("#body-name").textContent(), "Sun");
        await page.locator("#overview").click();
        await page.waitForTimeout(1400);
        const azimuth = await page.locator("#universe").getAttribute("data-azimuth");
        await page.mouse.move(750, 220);
        await page.mouse.down();
        await page.mouse.move(800, 230, { steps: 8 });
        await page.mouse.up();
        await page.waitForTimeout(100);
        assert.notEqual(await page.locator("#universe").getAttribute("data-azimuth"), azimuth);
        await page.locator("#overview").click();
        await page.waitForTimeout(1400);
    });
    await test("True scale diminishes Earth, returns to readable scale", async () =>
    {
        const initial = Number(await page.locator("#pixel").getAttribute("data-value"));
        assert.ok(initial > 1);
        await page.locator("#true-scale").click();
        await page.waitForTimeout(3800);
        assert.equal(await page.locator("#true-scale").getAttribute("aria-pressed"), "true");
        assert.ok(Number(await page.locator("#universe").getAttribute("data-scale")) > .999);
        const tiny = Number(await page.locator("#pixel").getAttribute("data-value"));
        assert.ok(tiny > 0 && tiny < .01, `True-scale Earth: ${tiny}`);
        assert.ok(tiny < initial / 1000);
        await noOverflow(page);
        await page.locator("#readable").click();
        await page.waitForTimeout(3000);
        assert.ok(Number(await page.locator("#pixel").getAttribute("data-value")) > 1);
    });
    await test("Body selection changes facts and flies to real sphere", async () =>
    {
        await page.getByRole("button", { name: "Explore Saturn", exact: true }).click();
        await page.waitForTimeout(1800);
        assert.equal(await page.locator("#body-name").textContent(), "Saturn");
        assert.match(await page.locator("#facts").textContent(), /72,367 mi/);
        assert.equal(await page.getByRole("button", { name: "Explore Saturn", exact: true }).getAttribute("aria-pressed"), "true");
        await page.locator("#overview").click();
        await page.waitForTimeout(2000);
    });
    await test("Canvas keyboard orbit and zoom", async () =>
    {
        await page.locator("#universe").focus();
        const previous = await page.locator("#universe").getAttribute("data-azimuth");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("+");
        await page.waitForTimeout(100);
        assert.notEqual(await page.locator("#universe").getAttribute("data-azimuth"), previous);
        assert.ok(Number(await page.locator("#universe").getAttribute("data-zoom")) < 1);
    });
    await test("Time scrub, playback, speed and pause actually change model time", async () =>
    {
        const beforeOrbit = await page.locator("#universe").screenshot();
        await page.locator("#time").fill("365");
        assert.equal(await page.locator("#time").inputValue(), "365");
        await page.waitForTimeout(100);
        assert.equal(await page.locator("#day-count").textContent(), "DAY 0365");
        const afterOrbit = await page.locator("#universe").screenshot();
        assert.notEqual(createHash("sha256").update(beforeOrbit).digest("hex"), createHash("sha256").update(afterOrbit).digest("hex"));
        await page.locator("#speed").selectOption("365");
        await page.locator("#play").click();
        await page.waitForTimeout(400);
        await page.locator("#play").click();
        const stopped = await page.locator("#day-count").textContent();
        assert.notEqual(stopped, "DAY 0365");
        await page.waitForTimeout(200);
        assert.equal(await page.locator("#day-count").textContent(), stopped);
        await noOverflow(page);
    });
    await test("Nine-stop tour, body flights and final true-scale reveal", async () =>
    {
        await page.locator("#tour").click();
        assert.equal(await page.locator(".tour-stop").count(), 9);
        await page.locator("#stop-jupiter").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        assert.equal(await page.locator("#stop-jupiter h2").isVisible(), true);
        await page.locator("#stop-neptune").scrollIntoViewIfNeeded();
        await page.locator("#tour-reveal").click();
        await page.waitForTimeout(3200);
        assert.ok(Number(await page.locator("#universe").getAttribute("data-scale")) > .999);
        await noOverflow(page);
        await page.locator("#explore").click();
        assert.equal(await page.locator("#explorer").isVisible(), true);
    });
    await test("Street table uses one physical ratio; validation and recalculation", async () =>
    {
        await page.locator("#walk").scrollIntoViewIfNeeded();
        assert.equal(await page.locator("#street-table tr").count(), 9);
        assert.match(await page.locator("#walk-summary").textContent(), /0.61 miles/);
        const first = await page.locator("#street-table tr").nth(3).textContent();
        assert.match(first, /0.11 in/);
        assert.match(first, /107.4 ft/);
        await page.locator("#sun-size").fill("24");
        assert.match(await page.locator("#walk-summary").textContent(), /1.22 miles/);
        assert.match(await page.locator("#street-table tr").nth(3).textContent(), /214.8 ft/);
        await page.locator("#sun-size").fill("0");
        assert.equal(await page.locator("#sun-size").evaluate(input => input.checkValidity()), false);
        await page.locator("#sun-size").fill("12");
        await page.locator("summary").click();
        assert.equal(await page.locator("details").getAttribute("open"), "");
        await noOverflow(page);
    });
    const mobile = await browser.newPage({ viewport: result.viewports.mobile, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    observe(mobile);
    await test("Mobile actual homepage, readable responsive layout and no overflow", async () =>
    {
        assert.equal((await mobile.goto(server.url)).status(), 200);
        await mobile.locator("#universe[data-renderer='webgl2']").waitFor();
        await mobile.waitForTimeout(1800);
        assert.equal(await mobile.locator("h1").isVisible(), true);
        await noOverflow(mobile);
        await mobile.screenshot({ path: result.screenshots.mobile });
    });
    await test("Mobile touch drag moves the three-dimensional camera", async () =>
    {
        const azimuth = await mobile.locator("#universe").getAttribute("data-azimuth");
        const cdp = await mobile.context().newCDPSession(mobile);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 170, y: 380 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 210, y: 390 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await mobile.waitForTimeout(100);
        assert.notEqual(await mobile.locator("#universe").getAttribute("data-azimuth"), azimuth);
        await cdp.detach();
    });
    await test("Mobile true scale, touch body selection and keyboard-operable controls", async () =>
    {
        await mobile.locator("#true-scale").tap();
        await mobile.waitForTimeout(3500);
        assert.ok(Number(await mobile.locator("#pixel").getAttribute("data-value")) < .01);
        await mobile.locator("#readable").tap();
        await mobile.getByRole("button", { name: "Explore Mars", exact: true }).tap();
        assert.equal(await mobile.locator("#body-name").textContent(), "Mars");
        await noOverflow(mobile);
        await mobile.locator("#sun-size").fill("36");
        assert.match(await mobile.locator("#walk-summary").textContent(), /1.83 miles/);
        await noOverflow(mobile);
    });
    await test("Mobile tour works and returns to Explore", async () =>
    {
        await mobile.evaluate(() => window.scrollTo(0, 0));
        await mobile.locator("#tour").tap();
        await mobile.locator("#stop-earth").scrollIntoViewIfNeeded();
        assert.equal(await mobile.locator("#stop-earth h2").isVisible(), true);
        await noOverflow(mobile);
        await mobile.locator("#explore").tap();
    });
    await test("Reduced motion has immediate scale and camera transition", async () =>
    {
        const reduced = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
        observe(reduced);
        await reduced.goto(server.url);
        await reduced.locator("#true-scale").click();
        await reduced.waitForTimeout(100);
        assert.equal(await reduced.locator("#universe").getAttribute("data-scale"), "1.00000");
        await reduced.close();
    });
    await test("No-WebGL fallback retains accessible educational facts and street model", async () =>
    {
        const fallback = await browser.newPage({ viewport: { width: 1200, height: 900 } });
        observe(fallback);
        await fallback.addInitScript(() =>
        {
            const original = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, ...rest)
            {
                return type === "webgl2" ? null : original.call(this, type, ...rest);
            };
        });
        await fallback.goto(server.url);
        assert.equal(await fallback.locator("#fallback").isVisible(), true);
        await fallback.getByRole("button", { name: "Explore Jupiter", exact: true }).click();
        assert.equal(await fallback.locator("#body-name").textContent(), "Jupiter");
        assert.equal(await fallback.locator("#street-table tr").count(), 9);
        await fallback.close();
    });
    assert.deepEqual(errors, []);
    result.tests.push({ name: "No console/page/request/HTTP errors across all contexts", passed: true });
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    result.resourcesClosed = true;
    result.errors.push(...errors);
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify(result, null, 2));
}
