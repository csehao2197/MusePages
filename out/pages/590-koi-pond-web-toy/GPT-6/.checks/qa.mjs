import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, readdir } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { StaticHomepage, WorkspaceFiles as W } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const workspace = process.cwd();
const output = path.join(folder, "out");
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const result =
{
    prompt: "590-koi-pond-web-toy",
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    cases: [],
    errors: [],
    screenshots: {},
    resourcesClosed: false
};
let service;
let browser;
async function check(name, run)
{
    const evidence = await run();
    result.cases.push({ name, passed: true, evidence: evidence ?? true });
}
async function snapshot(page)
{
    return page.evaluate(async () =>
    {
        const { state, koi, ripples, flora, audio, ui } = await import("./main.js");
        return {
            state: { time: state.time, season: state.season, night: state.night, rain: state.rain, reduced: state.reduced, renderer: state.renderer, webglCompiled: state.webglCompiled ?? false, tier: state.tier, fps: state.fps },
            fish: koi.fish.filter((f) => f.visible).map((f) => ({ x: f.x, y: f.y, heading: f.heading, beat: f.beat, speed: f.speed })),
            stats: { ...ripples.stats },
            rings: ripples.rings.filter((r) => r.active).length,
            food: ripples.food.filter((f) => f.active).length,
            currents: ripples.currents.filter((c) => c.active).map((c) => ({ count: c.count, age: c.age })),
            ice: flora.ice.map((p) => ({ x: p.nx * state.w, y: p.ny * state.h })),
            sound: { enabled: audio.enabled, running: audio.running },
            focus: { ...ui.focus },
            firstFrameMs: window.__pond.firstFrameMs
        };
    });
}
async function overflow(page, name)
{
    const sizes = await page.evaluate(() => ({
        width: innerWidth, height: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        dock: (() => { const r = document.querySelector(".dock").getBoundingClientRect(); return { left: r.left, right: r.right, bottom: r.bottom }; })()
    }));
    assert.ok(sizes.scrollWidth <= sizes.width, `${name}: horizontal overflow`);
    assert.ok(sizes.scrollHeight <= sizes.height, `${name}: vertical overflow`);
    assert.ok(sizes.dock.left >= 0 && sizes.dock.right <= sizes.width && sizes.dock.bottom <= sizes.height);
    return sizes;
}
function monitor(page, name)
{
    page.on("console", (message) => result.errors.push({ name, type: `console.${message.type()}`, message: message.text() }));
    page.on("pageerror", (error) => result.errors.push({ name, type: "pageerror", message: error.message }));
    page.on("requestfailed", (request) => result.errors.push({ name, type: "requestfailed", message: request.url(), failure: request.failure() }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.errors.push({ name, type: "http", status: response.status(), message: response.url() });
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(service.url.split("/pages/")[0]) && !request.url().startsWith("data:")) result.errors.push({ name, type: "external-request", message: request.url() });
    });
}
async function open(context, name, query = "")
{
    const page = await context.newPage();
    monitor(page, name);
    const response = await page.goto(service.url + query, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => window.__pond?.firstFrameMs > 0);
    await page.evaluate(() => document.fonts.ready);
    return page;
}
async function gestures(page, name)
{
    const viewport = page.viewportSize();
    const first = await snapshot(page);
    const target = first.fish.find((f) => f.x > 0.2 * viewport.width && f.x < 0.85 * viewport.width && f.y > 0.35 * viewport.height && f.y < 0.8 * viewport.height) || first.fish[0];
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(100);
    let after = await snapshot(page);
    assert.equal(after.stats.taps, first.stats.taps + 1);
    assert.ok(after.rings >= 1);
    assert.ok(await page.locator("body").evaluate((body) => body.classList.contains("touched")));
    const feedingTarget = after.fish.find((f) => f.x > 60 && f.x < viewport.width - 60 && f.y > viewport.height * 0.3 && f.y < viewport.height * 0.8) || target;
    await page.mouse.move(feedingTarget.x, feedingTarget.y);
    await page.mouse.down();
    await page.waitForTimeout(2100);
    await page.mouse.up();
    after = await snapshot(page);
    assert.ok(after.stats.fed >= 7, `${name}: pellets really spawned`);
    for (let i = 0; i < 30 && !(await snapshot(page)).stats.eaten; i++) await page.waitForTimeout(500);
    assert.ok((await snapshot(page)).stats.eaten > 0, `${name}: fish actually ate food`);
    const sx = viewport.width * 0.4;
    const sy = viewport.height * 0.55;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(viewport.width * 0.75, viewport.height * 0.65, { steps: 12 });
    await page.mouse.up();
    after = await snapshot(page);
    assert.ok(after.stats.currents > 0 && after.currents.some((c) => c.count >= 4), `${name}: sampled current`);
    const flow = await page.evaluate(async ({ x, y }) =>
    {
        const { ripples } = await import("./main.js");
        return { ...ripples.flow(x, y) };
    }, { x: viewport.width * 0.55, y: viewport.height * 0.59 });
    assert.ok(flow.weight > 0.6 && flow.x > 0.5, `${name}: current has physical velocity`);
    await page.locator("#surface").focus();
    const keyBefore = (await snapshot(page)).stats;
    await page.keyboard.press("Enter");
    await page.keyboard.down("Space");
    await page.waitForTimeout(500);
    await page.keyboard.up("Space");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    after = await snapshot(page);
    assert.ok(after.stats.taps > keyBefore.taps && after.stats.fed > keyBefore.fed && after.stats.currents > keyBefore.currents);
    return { stats: after.stats, force: flow, overflow: await overflow(page, name) };
}
try
{
    assert.equal(job.prompt, result.prompt);
    const owner = await W.json(job.stateFile);
    const pid = Number((await W.text(job.promptLock)).trim());
    assert.equal(owner.ownedLock.prompt, job.prompt);
    assert.equal(owner.ownedLock.pid, pid);
    process.kill(pid, 0);
    await check("source and independent static path", async () =>
    {
        assert.equal(await StaticHomepage.checkSource(folder), "html");
        const digest = await StaticHomepage.validateStaticOutput(output, "koi-pond-web-toy", "GPT-6");
        const sourceFiles = ["index.html", "styles.css", "favicon.svg", "content.js", "icons.js", "quality.js", "audio.js", "ui.js", "input.js", "main.js", "LICENSE.txt", "NOTICE.txt"];
        for (const file of sourceFiles) assert.deepEqual(await readFile(path.join(folder, file)), await readFile(path.join(output, file)));
        for (const file of await readdir(path.join(folder, "scene"))) assert.deepEqual(await readFile(path.join(folder, "scene", file)), await readFile(path.join(output, "scene", file)));
        return { digest, sourceAndExportEqual: true };
    });
    service = await startPreviewServer(output, { workspace });
    assert.equal((await fetch(service.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    assert.equal((await fetch(new URL("./metadata.json", service.url))).status, 404);
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await open(desktop, "desktop");
    await check("desktop finished first frame, local fonts and live koi", async () =>
    {
        const first = await snapshot(page);
        assert.ok(first.firstFrameMs < 2000, `first frame ${first.firstFrameMs}ms`);
        assert.ok(first.fish.length >= 4 && first.fish.length <= 9);
        assert.equal(first.sound.enabled, false);
        assert.ok(await page.evaluate(() => document.fonts.check('500 40px "Shippori Mincho B1"') && document.fonts.check('400 14px "Instrument Sans Variable"')));
        const pixels = await page.evaluate(() =>
        {
            const canvas = document.querySelector("#life");
            const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
            let colored = 0;
            for (let i = 3; i < data.length; i += 64) if (data[i] > 50) colored++;
            return colored;
        });
        assert.ok(pixels > 500, "fish are actually painted");
        await page.screenshot({ path: path.join(folder, ".checks", "desktop.png") });
        result.screenshots.desktop = ".checks\\desktop.png";
        await page.waitForTimeout(600);
        const second = await snapshot(page);
        assert.ok(Math.hypot(second.fish[0].x - first.fish[0].x, second.fish[0].y - first.fish[0].y) > 2);
        assert.notEqual(second.fish[0].beat, first.fish[0].beat);
        assert.ok(await page.evaluate(() => Object.isFrozen(window.__pond)));
        return { firstFrameMs: first.firstFrameMs, fishCount: first.fish.length, paintedSamples: pixels, renderer: first.state.renderer, fps: second.state.fps, overflow: await overflow(page, "desktop-before") };
    });
    await check("real tap, feeding consumption, current and keyboard gestures", () => gestures(page, "desktop-after"));
    await check("all seasons, winter ice, blended night/rain and link state", async () =>
    {
        for (let i = 0; i < 4; i++)
        {
            await page.keyboard.press(String(i + 1));
            await page.waitForTimeout(80);
            assert.equal((await snapshot(page)).state.season, i);
            assert.equal(await page.getByRole("button", { name: ["Spring", "Summer", "Autumn", "Winter"][i], exact: true }).getAttribute("aria-pressed"), "true");
        }
        await page.waitForTimeout(2500);
        assert.equal(await page.getByRole("button", { name: "Snow", exact: true }).count(), 1);
        const winter = await snapshot(page);
        await page.mouse.click(winter.ice[1].x, winter.ice[1].y);
        assert.ok((await snapshot(page)).stats.cracks > 0);
        await page.keyboard.press("n");
        await page.keyboard.press("r");
        await page.waitForTimeout(700);
        const blending = await snapshot(page);
        assert.ok(blending.state.night > 0.1 && blending.state.night < 1);
        assert.ok(blending.state.rain > 0.1 && blending.state.rain < 1);
        assert.ok(page.url().includes("season=winter") && page.url().includes("night=1") && page.url().includes("rain=1"));
        await page.waitForTimeout(1300);
        await page.screenshot({ path: path.join(folder, ".checks", "winter-night.png") });
        return { transition: blending.state, iceCracks: (await snapshot(page)).stats.cracks, overflow: await overflow(page, "season-after") };
    });
    await check("user-activated synthesized sound", async () =>
    {
        await page.keyboard.press("m");
        await page.waitForTimeout(250);
        let sound = (await snapshot(page)).sound;
        assert.ok(sound.enabled && sound.running);
        await page.keyboard.press("m");
        await page.waitForTimeout(100);
        sound = (await snapshot(page)).sound;
        assert.equal(sound.enabled, false);
        return { enabledFromGesture: true, audioContextRunning: sound.running, mutedAfterSecondGesture: true };
    });
    await check("focus timer, pause/resume, wall-clock completion and restart", async () =>
    {
        await page.clock.install();
        await page.keyboard.press("f");
        assert.ok((await snapshot(page)).focus.active);
        assert.equal(await page.locator(".dock").evaluate((e) => e.inert), true);
        await page.keyboard.press("Space");
        const paused = (await snapshot(page)).focus;
        assert.equal(paused.paused, true);
        await page.clock.setSystemTime(new Date(Date.now() + 10000));
        await page.waitForTimeout(350);
        assert.equal((await snapshot(page)).focus.remaining, paused.remaining);
        await page.keyboard.press("Space");
        assert.equal((await snapshot(page)).focus.paused, false);
        await page.keyboard.press("Escape");
        assert.equal((await snapshot(page)).focus.active, false);
        await page.keyboard.press("f");
        const active = (await snapshot(page)).focus;
        await page.clock.setSystemTime(new Date(active.deadline + 1000));
        await page.waitForTimeout(1600);
        await page.getByRole("heading", { name: "Session complete" }).waitFor({ state: "visible", timeout: 5000 });
        assert.equal((await snapshot(page)).focus.completed, true);
        await page.getByRole("button", { name: "Another round", exact: true }).click();
        assert.ok((await snapshot(page)).focus.active);
        await page.keyboard.press("Escape");
        assert.equal((await snapshot(page)).focus.active, false);
        await page.clock.resume();
        return { pausedRemainingMs: paused.remaining, wallClockDeadline: active.deadline, completionCardVerified: true, restartVerified: true };
    });
    await check("resize and rotation preserve valid viewport composition", async () =>
    {
        const evidence = [];
        for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1200, height: 900 }])
        {
            await page.setViewportSize(viewport);
            await page.waitForTimeout(300);
            evidence.push(await overflow(page, `resized-${viewport.width}`));
            const inside = await page.evaluate(async () =>
            {
                const { koi, state } = await import("./main.js");
                return koi.fish.filter((f) => f.visible && !f.leaving).every((f) => f.x >= 0 && f.x <= state.w && f.y >= 0 && f.y <= state.h);
            });
            assert.ok(inside);
        }
        return evidence;
    });
    await desktop.close();
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await open(mobile, "mobile");
    await check("mobile first frame, touch and responsive dock", async () =>
    {
        const first = await snapshot(phone);
        assert.equal(first.state.tier, "low");
        assert.equal(first.fish.length, 5);
        assert.ok(first.firstFrameMs < 2000);
        await phone.screenshot({ path: path.join(folder, ".checks", "mobile.png") });
        result.screenshots.mobile = ".checks\\mobile.png";
        const before = await overflow(phone, "mobile-before");
        const buttons = await phone.locator(".dock button").evaluateAll((buttons) => buttons.map((b) => ({ width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height, label: b.getAttribute("aria-label") })));
        assert.equal(buttons.length, 8);
        assert.ok(buttons.every((b) => b.width >= 36 && b.height >= 44 && b.label));
        await phone.touchscreen.tap(200, 400);
        assert.equal((await snapshot(phone)).stats.taps, 1);
        const client = await mobile.newCDPSession(phone);
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 220, y: 460 }] });
        await phone.waitForTimeout(1100);
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.ok((await snapshot(phone)).stats.fed >= 3);
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 130, y: 430 }] });
        for (let i = 1; i <= 6; i++) await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 130 + i * 22, y: 430 + i * 12 }] });
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.ok((await snapshot(phone)).stats.currents > 0);
        await phone.getByRole("button", { name: "Summer", exact: true }).tap();
        await phone.waitForTimeout(400);
        assert.equal((await snapshot(phone)).state.season, 1);
        await phone.getByRole("button", { name: "Night", exact: true }).tap();
        await phone.getByRole("button", { name: "Focus 25:00", exact: true }).tap();
        assert.ok((await snapshot(phone)).focus.active);
        await phone.touchscreen.tap(200, 400);
        await phone.getByRole("button", { name: "Pause", exact: true }).tap();
        assert.ok((await snapshot(phone)).focus.paused);
        await phone.getByRole("button", { name: "Exit focus", exact: true }).tap();
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ id: 11, x: 100, y: 380 }, { id: 12, x: 180, y: 420 }, { id: 13, x: 260, y: 460 }] });
        await phone.waitForTimeout(700);
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.ok((await snapshot(phone)).stats.fed >= 14);
        await client.detach();
        return { firstFrameMs: first.firstFrameMs, fishCount: first.fish.length, before, buttons, stats: (await snapshot(phone)).stats, after: await overflow(phone, "mobile-after") };
    });
    await mobile.close();
    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const quiet = await open(wide, "reduced", "?season=summer&night=1&rain=1");
    await check("1440px query state and live reduced-motion preference", async () =>
    {
        const first = await snapshot(quiet);
        assert.equal(first.state.reduced, true);
        assert.equal(first.state.season, 1);
        assert.equal(first.state.night, 1);
        assert.equal(first.state.rain, 1);
        await quiet.mouse.click(700, 500);
        const rings = await snapshot(quiet);
        assert.equal(rings.rings, 1);
        await quiet.emulateMedia({ reducedMotion: "no-preference" });
        await quiet.waitForTimeout(100);
        assert.equal((await snapshot(quiet)).state.reduced, false);
        return { queryApplied: true, singleReducedMotionRing: true, preferenceChange: true, overflow: await overflow(quiet, "wide-reduced") };
    });
    await wide.close();
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }])
    {
        const fallback = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        await fallback.addInitScript(() =>
        {
            const original = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, ...args)
            {
                if (type === "webgl" || type === "webgl2") return null;
                return original.call(this, type, ...args);
            };
        });
        const fallbackPage = await open(fallback, `fallback-${viewport.width}`);
        await check(`2D fallback ${viewport.width}px real drawing and gestures`, async () =>
        {
            const first = await snapshot(fallbackPage);
            assert.equal(first.state.renderer, "canvas2d");
            assert.ok(first.firstFrameMs < 2000);
            await fallbackPage.mouse.click(viewport.width * 0.5, viewport.height * 0.55);
            assert.equal((await snapshot(fallbackPage)).stats.taps, 1);
            await fallbackPage.keyboard.press("n");
            await fallbackPage.keyboard.press("r");
            await fallbackPage.keyboard.press("1");
            await fallbackPage.waitForTimeout(250);
            assert.equal((await snapshot(fallbackPage)).state.season, 0);
            return { firstFrameMs: first.firstFrameMs, fishCount: first.fish.length, fps: (await snapshot(fallbackPage)).state.fps, overflow: await overflow(fallbackPage, "fallback-after") };
        });
        await fallback.close();
    }
    await check("compact browser modules and public resource boundary", async () =>
    {
        const scripts = [];
        let publicBytes = 0;
        const walk = async (directory) =>
        {
            for (const entry of await readdir(directory, { withFileTypes: true }))
            {
                const file = path.join(directory, entry.name);
                if (entry.isDirectory()) await walk(file);
                else
                {
                    const bytes = await readFile(file);
                    publicBytes += bytes.length;
                    if (entry.name.endsWith(".js")) scripts.push(bytes);
                    assert.ok(!/\.(?:map|md|ts|tsx)$/.test(entry.name));
                    assert.ok(!["package.json", "metadata.json", "qa.json"].includes(entry.name));
                }
            }
        };
        await walk(output);
        const javascriptGzipBytes = gzipSync(Buffer.concat(scripts)).length;
        assert.ok(javascriptGzipBytes < 150000);
        assert.ok(publicBytes < 1000000);
        return { javascriptGzipBytes, publicBytesAtTest: publicBytes };
    });
    assert.deepEqual(result.errors, [], "No browser console, page, network or HTTP errors");
    result.passed = true;
}
catch (error)
{
    result.failure = { message: error.message, stack: error.stack };
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    result.resourcesClosed = true;
    result.finishedAt = new Date().toISOString();
    await W.saveJson(path.join(folder, ".checks", "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, cases: result.cases.length, errors: result.errors, failure: result.failure?.message, resourcesClosed: true }));
}
