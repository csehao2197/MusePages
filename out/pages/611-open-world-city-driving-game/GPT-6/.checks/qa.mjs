import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const exported = path.join(job.output, "out");
const results = { prompt: job.prompt, modelId: job.modelId, passed: false, visualReviewed: false, tests: [], errors: [], viewports: [], resourcesClosed: false };
let browser;
let server;
function pass(name, evidence = {})
{
    results.tests.push({ name, passed: true, ...evidence });
    process.stdout.write(`${name}: PASS\n`);
}
async function snapshot(page)
{
    return page.evaluate(() => window.club.snapshot());
}
async function clean(page, name)
{
    const dimensions = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth, height: innerHeight, body: document.body.scrollWidth }));
    assert.ok(dimensions.scroll <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${name}: horizontal overflow ${JSON.stringify(dimensions)}`);
    pass(name, dimensions);
}
try
{
    results.sourceType = await S.checkSource(job.output);
    results.staticDigest = await S.validateStaticOutput(exported, "open-world-city-driving-game", "GPT-6");
    pass("Independent static output and final subpath validation");
    server = await startPreviewServer(exported, { workspace: root });
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    pass("Owned static-only preview server responsive", { path: new URL(server.url).pathname, status: response.status });
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 600;
        const label = mobile ? "mobile" : "desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        page.on("pageerror", (error) => results.errors.push(`${label} page: ${error.message}`));
        page.on("console", (message) => { if (message.type() === "error") results.errors.push(`${label} console: ${message.text()}`); });
        page.on("requestfailed", (request) => results.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) results.errors.push(`${label} HTTP ${response.status()}: ${response.url()}`); });
        const loaded = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(loaded.status(), 200);
        await page.waitForFunction(() => window.club?.snapshot().ready);
        await page.waitForTimeout(700);
        assert.ok(await page.locator("h1").isVisible());
        assert.ok(await page.locator("#world").isVisible());
        const image = await page.locator("#world").screenshot();
        assert.ok(image.length > 20000, "Rendered canvas must be nonblank");
        results.viewports.push({ ...viewport, deviceScaleFactor: 1, isMobile: mobile, canvasBytes: image.length });
        await clean(page, `${label} initial overflow`);
        await page.screenshot({ path: path.join(job.output, ".checks", `${label}.png`) });
        const ambientBefore = await snapshot(page);
        await page.waitForTimeout(600);
        const ambientAfter = await snapshot(page);
        assert.equal(ambientAfter.traffic.length, 8);
        assert.notEqual(ambientBefore.traffic[0].x, ambientAfter.traffic[0].x);
        assert.equal(ambientAfter.poolCars.length, 4);
        assert.equal(ambientAfter.poolCars[0].yaw, 0);
        pass(`${label} full world, four north-correct pool cars and eight moving neighbors`);
        await page.locator("#play").click();
        await page.waitForTimeout(700);
        assert.equal((await snapshot(page)).started, true);
        await page.locator("#help").click();
        const pausePosition = await snapshot(page);
        await page.waitForTimeout(350);
        assert.equal((await snapshot(page)).elapsed, pausePosition.elapsed);
        await page.getByRole("button", { name: "Close help", exact: true }).click();
        pass(`${label} help freezes simulation and closes`);
        await page.locator("#action").click();
        assert.ok((await snapshot(page)).player.car);
        const beforeDrive = await snapshot(page);
        if (mobile)
        {
            const go = await page.locator('[data-control="forward"]').boundingBox();
            const touch = await context.newCDPSession(page);
            await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: go.x + go.width / 2, y: go.y + go.height / 2, id: 1 }] });
            await page.waitForTimeout(1500);
            await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await touch.detach();
        }
        else
        {
            await page.keyboard.down("ArrowUp");
            await page.waitForTimeout(1500);
            await page.keyboard.up("ArrowUp");
        }
        const afterDrive = await snapshot(page);
        assert.ok(afterDrive.player.distance > beforeDrive.player.distance + .8, JSON.stringify({ beforeDrive, afterDrive }));
        assert.ok(afterDrive.player.z > beforeDrive.player.z);
        pass(`${label} ${mobile ? "touch pedal" : "keyboard"} moves real north-facing vehicle`, { before: beforeDrive.player, after: afterDrive.player });
        if (mobile)
        {
            const touch = await context.newCDPSession(page);
            const right = await page.locator('[data-control="right"]').boundingBox();
            const go = await page.locator('[data-control="forward"]').boundingBox();
            const brake = await page.locator('[data-control="brake"]').boundingBox();
            const point = (rect, id) => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, id });
            await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(right, 1), point(go, 2)] });
            await page.waitForTimeout(600);
            await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            const turned = await snapshot(page);
            assert.ok(turned.player.yaw > afterDrive.player.yaw + .1);
            await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point(brake, 3)] });
            await page.waitForTimeout(1700);
            await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            const reversed = await snapshot(page);
            assert.ok(reversed.player.speed < 0);
            await touch.detach();
            pass("mobile simultaneous multitouch steering/accelerator and genuine brake-to-reverse", { turned: turned.player, reversed: reversed.player });
        }
        await page.locator("#pause").click();
        const held = await snapshot(page);
        await page.waitForTimeout(300);
        assert.equal((await snapshot(page)).player.z, held.player.z);
        await page.locator("#resume").click();
        await page.locator("#action").click();
        assert.equal((await snapshot(page)).player.car, null);
        await page.locator("#errand").click();
        assert.equal((await snapshot(page)).mission.type, "porch");
        assert.equal((await snapshot(page)).mission.delivered, 0);
        await page.locator("#cancel-mission").click();
        assert.equal((await snapshot(page)).mission.type, null);
        await page.locator("#pause").click();
        await page.locator("#reset").click();
        assert.equal((await snapshot(page)).player.z, -88);
        assert.equal((await snapshot(page)).mission.type, null);
        await clean(page, `${label} post-gameplay overflow`);
        await page.screenshot({ path: path.join(job.output, ".checks", `${label}-game.png`) });
        pass(`${label} enter/exit, pause/resume, activity selection/cancel and reset`);
        await context.close();
    }
    assert.deepEqual(results.errors, []);
    results.passed = true;
}
catch (error)
{
    results.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    results.resourcesClosed = true;
    await W.saveJson(path.join(job.output, ".checks", "qa.json"), results);
    process.stdout.write(JSON.stringify({ passed: results.passed, tests: results.tests.length, errors: results.errors, resourcesClosed: results.resourcesClosed }) + "\n");
}
