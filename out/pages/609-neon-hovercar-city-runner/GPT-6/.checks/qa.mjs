import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { course, track } from "../src/track.js";
import { createRun, step } from "../src/sim.js";
import { bestKey } from "../src/content.js";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/script/generate-preview.mjs")));
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(root, "src/workflows/script/render-prompt-page.mjs")));
const job = await W.json(path.join(root, "src/workflows/script/.ai-gpt6-current-job.json"));
const results = { prompt: job.prompt, modelId: job.modelId, passed: false, visualReviewed: false, tests: [], browsers: [], errors: [], resourcesClosed: false };
function test(name, fn)
{
    fn();
    results.tests.push({ name, passed: true });
}
const neutral = { left: false, right: false, boost: false, pace: false };
test("Ready and paused simulations stay fixed", () =>
{
    const run = createRun();
    step(run, neutral, 1);
    assert.equal(run.distance, 0);
    run.phase = "paused";
    step(run, { ...neutral, boost: true, right: true }, 1);
    assert.equal(run.surge, 100);
    assert.equal(run.x, 0);
});
test("Surge spends energy and pace increases velocity", () =>
{
    const run = createRun();
    run.phase = "running";
    step(run, neutral, track.tick);
    const cruise = run.speed;
    step(run, { ...neutral, pace: true }, track.tick);
    assert.ok(run.speed > cruise);
    const pace = run.speed;
    step(run, { ...neutral, boost: true }, track.tick);
    assert.ok(run.speed > pace && run.surge < 100);
});
test("Real course triggers crystal, recharge arch and drone impact", () =>
{
    const run = createRun();
    run.phase = "running";
    for (const kind of ["crystal", "arch", "drone"])
    {
        const item = course.find((value) => value.kind === kind);
        run.distance = item.distance - 0.1;
        run.x = item.x;
        run.surge = 25;
        const old = { frame: run.frame, haul: run.haul };
        step(run, neutral, track.tick);
        if (kind === "crystal") assert.equal(run.haul, old.haul + track.pickupScore);
        if (kind === "arch") assert.ok(run.surge > 50 && run.haul === old.haul + track.archScore);
        if (kind === "drone") assert.ok(run.frame < old.frame - 23);
        const after = run.haul;
        step(run, neutral, track.tick);
        assert.equal(run.haul, after);
    }
});
test("Wall scrapes deplete the frame and stop the run", () =>
{
    const run = createRun();
    run.phase = "running";
    for (let tick = 0; tick < 600 && run.phase === "running"; tick++) step(run, { ...neutral, left: true }, track.tick);
    assert.equal(run.phase, "failed");
    assert.equal(run.frame, 0);
    assert.ok(run.scrapes > 0);
});
test("Finish adds one bonus, difficulty increases, reset is clean", () =>
{
    const run = createRun();
    run.phase = "running";
    run.distance = track.length - 0.1;
    step(run, neutral, track.tick);
    assert.equal(run.phase, "reached");
    assert.equal(run.haul, track.finishScore);
    assert.ok(run.difficulty > 1);
    step(run, neutral, track.tick);
    assert.equal(run.haul, track.finishScore);
    assert.equal(createRun().passed.size, 0);
});

const server = await startPreviewServer(path.join(job.output, "out"), { workspace: root });
let browser;
try
{
    browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader", "--disable-gpu-driver-bug-workarounds"] });
    for (const [name, viewport] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]].filter(([name]) => !process.env.LANE_VIEW || process.env.LANE_VIEW === name))
    {
        const phone = name === "mobile";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: phone, isMobile: phone });
        const page = await context.newPage();
        const warnings = [];
        const errors = [];
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
            else warnings.push(`${message.type()}: ${message.text()}`);
        });
        page.on("response", (response) => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        await page.clock.install({ time: new Date("2026-11-16T00:00:00Z") });
        const response = await page.goto(server.url);
        assert.equal(response.status(), 200);
        await page.waitForFunction(() => window.laneTelemetry);
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.locator("body").innerText().then((text) => text.includes("Lumenlane") && text.includes("Launch run")));
        const overflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await overflow();
        const telemetry = () => page.evaluate(() => window.laneTelemetry);
        await page.clock.pauseAt(new Date(await page.evaluate(() => Date.now()) + 60000));
        const tick = async (ms = 100) => page.clock.fastForward(ms);
        const click = async (selector) =>
        {
            if (phone) await page.locator(selector).tap();
            else await page.locator(selector).click();
            await tick();
        };
        await click("#help");
        await page.locator("#motion").check();
        await tick();
        assert.equal((await telemetry()).reducedMotion, true);
        await click("#close-help");
        await click("#sound");
        assert.equal(await page.locator("#sound").getAttribute("aria-label"), "Sound off");
        await click("#sound");
        const screenshot = path.join(job.output, ".checks", `${name === "desktop" ? "desktop-1440" : "mobile"}.png`);
        await page.screenshot({ path: screenshot });
        const client = phone ? await context.newCDPSession(page) : null;
        const held = { left: false, right: false, pace: false, boost: false };
        async function controls(next)
        {
            const changed = Object.keys(held).some((key) => held[key] !== next[key]);
            if (!changed) return;
            if (phone)
            {
                const points = [];
                for (const [key, active] of Object.entries(next))
                {
                    if (!active) continue;
                    const box = await page.locator(`[data-control="${key}"]`).boundingBox();
                    points.push({ x: box.x + box.width / 2, y: box.y + box.height / 2, id: Object.keys(held).indexOf(key) + 1 });
                }
                if (Object.values(held).some(Boolean)) await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
                if (points.length) await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: points });
            }
            else
            {
                const mapping = { left: "ArrowLeft", right: "ArrowRight", pace: "ArrowUp", boost: "Space" };
                for (const key of Object.keys(held))
                {
                    if (held[key] === next[key]) continue;
                    await page.keyboard[next[key] ? "down" : "up"](mapping[key]);
                }
            }
            Object.assign(held, next);
        }
        await click("#action");
        assert.equal((await telemetry()).phase, "running");
        await controls({ left: false, right: true, pace: true, boost: true });
        const initial = await telemetry();
        for (let count = 0; count < 4; count++) await tick();
        const moved = await telemetry();
        assert.ok(moved.distance > initial.distance && moved.x > initial.x && moved.surge < initial.surge);
        assert.ok(moved.speed > track.pace);
        await controls(neutral);
        if (phone) await click("#pause");
        else
        {
            await page.keyboard.press("p");
            await tick();
        }
        const paused = await telemetry();
        assert.equal(paused.phase, "paused");
        await tick(1200);
        assert.equal((await telemetry()).distance, paused.distance);
        await click("#action");
        let run = await telemetry();
        while (run.scrapes === 0 && run.phase === "running")
        {
            await controls({ ...neutral, left: true });
            await tick();
            run = await telemetry();
        }
        assert.ok(run.scrapes > 0 && run.frame < 100);
        let iterations = 0;
        while (run.phase === "running" && iterations++ < 950)
        {
            const next = course.find((item) => item.distance > run.distance + 1 && (run.hits === 0 || item.kind === "drone"));
            const target = !next ? 0 : run.hits === 0 ? next.x : next.x === 0 ? 3.4 : 0;
            const error = target - run.x;
            await controls({ left: error < -0.3, right: error > 0.3, pace: true, boost: run.collected > 0 && run.elapsed < 8 });
            await tick();
            run = await telemetry();
            if (phone && iterations % 15 === 0)
            {
                results.touchTrace ??= [];
                results.touchTrace.push({ distance: run.distance, target, x: run.x, input: run.input, held: { ...held } });
            }
        }
        await controls(neutral);
        assert.equal(run.phase, "reached", JSON.stringify(run));
        assert.ok(run.collected > 0 && run.arches > 0 && run.hits > 0 && run.scrapes > 0);
        assert.ok(run.difficulty > 1 && run.haul >= 650);
        assert.ok(await page.locator("#card-title").innerText().then((text) => text.includes("Delivered")));
        const winning = { elapsed: run.elapsed, distance: run.distance, haul: run.haul, frame: run.frame, crystals: run.collected, arches: run.arches, droneHits: run.hits, wallScrapes: run.scrapes, difficulty: run.difficulty };
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), bestKey), String(run.haul));
        await page.screenshot({ path: path.join(job.output, ".checks", `${name}-reached.png`) });
        await click("#action");
        run = await telemetry();
        assert.equal(run.haul, 0);
        assert.equal(run.hits, 0);
        await controls({ ...neutral, right: true });
        for (let count = 0; count < 150 && run.phase === "running"; count++)
        {
            await tick();
            run = await telemetry();
        }
        await controls(neutral);
        assert.equal(run.phase, "failed");
        assert.equal(run.frame, 0);
        assert.match(await page.locator("#card-title").innerText(), /End of the line/);
        await overflow();
        await page.screenshot({ path: path.join(job.output, ".checks", `${name}-failed.png`) });
        await click("#action");
        assert.equal((await telemetry()).phase, "running");
        await page.evaluate(() =>
        {
            Object.defineProperty(document, "hidden", { configurable: true, value: true });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        assert.equal((await telemetry()).phase, "paused");
        await page.evaluate(() =>
        {
            Object.defineProperty(document, "hidden", { configurable: true, value: false });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        await tick();
        assert.equal((await telemetry()).phase, "paused");
        await overflow();
        results.browsers.push({ name, viewport, deviceScaleFactor: 1, status: response.status(), meaningfulVisibleHomepage: true, beforeAfterNoOverflow: true, controls: phone ? "Native CDP touch press/hold, multi-touch pace/surge and taps" : "Actual keyboard arrows, Space, P and pointer buttons", winningRun: winning, frameDepletedOnSecondRun: true, reset: true, pauseFreezesSimulation: true, visibilityPauseRequiresResume: true, reducedMotion: true, audioToggle: true, localBestHaul: true, screenshot, warnings, errors });
        assert.deepEqual(errors, []);
        await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const previewErrors = [];
    page.on("pageerror", (error) => previewErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") previewErrors.push(message.text()); });
    page.on("requestfailed", (request) => previewErrors.push(request.url()));
    page.on("response", (response) => { if (response.status() >= 400) previewErrors.push(`${response.status()} ${response.url()}`); });
    await page.goto(server.url);
    await page.waitForFunction(() => window.laneTelemetry);
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(job.output, ".checks/desktop.png") });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator("#action").click();
    await page.keyboard.down("ArrowRight");
    await page.keyboard.down("Space");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.up("Space");
    const smoke = await page.evaluate(() => window.laneTelemetry);
    assert.ok(smoke.distance > 0 && smoke.x > 0 && smoke.surge < 100);
    await page.keyboard.press("p");
    await page.waitForFunction(() => window.laneTelemetry.phase === "paused");
    const stopped = await page.evaluate(() => window.laneTelemetry.distance);
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => window.laneTelemetry.distance), stopped);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(previewErrors, []);
    results.previewViewportSmoke = { viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, realTimeKeyboardSteerSurgePause: true, noOverflowBeforeAfter: true, errors: previewErrors };
    await context.close();
    results.staticDigest = await S.validateStaticOutput(path.join(job.output, "out"), "neon-hovercar-city-runner", "GPT-6");
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
    await server.close();
    results.resourcesClosed = true;
    await W.saveJson(path.join(job.output, ".checks/qa.json"), results);
}
console.log(JSON.stringify(results));
