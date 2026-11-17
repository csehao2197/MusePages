import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles as W } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..", "..", "..", "..");
const qa = {
    passed: false,
    modelId: "gpt-6.1-sol",
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
const record = (name) => qa.assertions.push({ name, passed: true });
const getState = (page) => page.evaluate(async () =>
{
    const { main, race } = await import("./app.js");
    const player = (p) => ({ position: p.position, total: p.total, array: p.array, metrics: p.metrics, sorted: [...p.sorted] });
    return {
        main: { id: main.id, n: main.n, seed: main.seed, pattern: main.pattern, playing: main.playing, input: main.input, ...player(main.player) },
        race: { tick: race.tick, playing: race.playing, input: race.input, ids: race.ids, seed: race.seed, players: race.players.map(player) }
    };
});
const range = async (page, selector, value) =>
{
    await page.locator(selector).evaluate((element, value) =>
    {
        element.value = String(value);
        element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
};
async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: innerWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${label}: ${JSON.stringify(dimensions)}`);
    record(`${label}: no horizontal overflow`);
}

try
{
    server = await startPreviewServer(path.join(root, "out"), { workspace });
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("../../../../README.md", server.url))).status, 404);
    record("Final public subpath responds 200; repository paths are not served");
    qa.url = server.url;
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    function monitor(page)
    {
        page.on("pageerror", (e) => qa.errors.push({ kind: "page", message: e.message }));
        page.on("console", (e) =>
        {
            if (e.type() === "error") qa.errors.push({ kind: "console", message: e.text() });
        });
        page.on("requestfailed", (r) => qa.errors.push({ kind: "request", url: r.url(), message: r.failure()?.errorText }));
        page.on("response", (r) =>
        {
            if (r.status() >= 400) qa.errors.push({ kind: "http", status: r.status(), url: r.url() });
        });
    }
    monitor(page);
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveText("See every compare, swap, and write.");
    await page.waitForTimeout(650);
    let state = await getState(page);
    assert.ok(state.main.playing && state.main.position > 0);
    await page.locator('.transport [data-action="play"]').click();
    const paused = (await getState(page)).main.position;
    await page.waitForTimeout(150);
    assert.equal((await getState(page)).main.position, paused);
    record("Default quick sort autoplays after 400ms; real Pause freezes clock");
    await noOverflow(page, "1200x900 initial");
    qa.viewports.push({ width: 1200, height: 900, dpr: 1, reducedMotion: false });
    qa.screenshots.desktop = path.join(root, ".checks", "desktop.png");
    await page.screenshot({ path: qa.screenshots.desktop });

    await page.locator('.transport [data-action="reset"]').click();
    assert.equal((await getState(page)).main.position, 0);
    await expect(page.locator("#narration")).toHaveText("Ready. Press play or step forward.");
    await page.locator('.transport [data-action="next"]').click();
    assert.equal((await getState(page)).main.position, 1);
    await expect(page.locator("#metric-0")).toHaveText("1");
    await page.locator('.transport [data-action="back"]').click();
    assert.deepEqual((await getState(page)).main.metrics, [0, 0, 0]);
    record("Main Reset, single forward, backward and prefix counters");
    await page.evaluate(() => document.activeElement.blur());
    await page.keyboard.press("ArrowRight");
    assert.equal((await getState(page)).main.position, 1);
    await page.keyboard.press("ArrowLeft");
    assert.equal((await getState(page)).main.position, 0);
    await page.keyboard.press("Space");
    await page.waitForTimeout(100);
    await page.keyboard.press("Space");
    assert.ok((await getState(page)).main.position > 0);
    await page.keyboard.press("r");
    assert.equal((await getState(page)).main.position, 0);
    const seedBefore = (await getState(page)).main.seed;
    await page.keyboard.press("s");
    await page.waitForTimeout(170);
    assert.equal((await getState(page)).main.seed, seedBefore + 1);
    record("Keyboard Space / Left / Right / R / S operate real transport");

    const beforeTab = (await getState(page)).main.input;
    await page.locator("#tab-merge").click();
    assert.deepEqual((await getState(page)).main.input, beforeTab);
    assert.equal((await getState(page)).main.position, 0);
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#tab-quick")).toBeFocused();
    await expect(page.locator("#tab-quick")).toHaveAttribute("aria-selected", "true");
    await page.locator("#tab-merge").click();
    const total = (await getState(page)).main.total;
    await range(page, "#scrubber", total);
    state = await getState(page);
    assert.deepEqual(state.main.array, [...state.main.input].sort((a, b) => a - b));
    assert.equal(state.main.metrics[1], 0);
    assert.ok(state.main.metrics[2] > 0);
    assert.equal(state.main.sorted.length, state.main.n);
    await expect(page.locator("#narration")).toHaveText(`Sorted in ${total.toLocaleString("en-US")} steps.`);
    await expect(page.locator('.transport [data-action="play"]')).toHaveAttribute("aria-label", "Replay");
    await range(page, "#scrubber", 257);
    const at257 = (await getState(page)).main;
    await range(page, "#scrubber", 0);
    await range(page, "#scrubber", 257);
    assert.deepEqual((await getState(page)).main.array, at257.array);
    assert.deepEqual((await getState(page)).main.metrics, at257.metrics);
    record("Algorithm switching preserves array; ARIA arrow tabs; merge completion, buffer writes and reversible scrub past 256 snapshot");
    const canvas = await page.locator("#main-canvas").boundingBox();
    await page.mouse.move(canvas.x + 70, canvas.y + 100);
    await expect(page.locator("#hover")).toContainText("position");
    record("Actual canvas pointer hover reports position and value");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await range(page, "#size", 8);
    await page.waitForTimeout(180);
    for (const pattern of ["random", "nearly", "reversed", "few"])
    {
        await page.locator(`[data-pattern="${pattern}"]`).click();
        await page.waitForTimeout(170);
        for (const id of ["bubble", "insertion", "merge", "quick", "heap"])
        {
            await page.locator(`#tab-${id}`).click();
            const s = await getState(page);
            await range(page, "#scrubber", s.main.total);
            const done = (await getState(page)).main;
            assert.deepEqual(done.array, [...done.input].sort((a, b) => a - b));
            const text = await page.locator(`[data-cell-algorithm="${id}"][data-cell-pattern="${pattern}"]`).textContent();
            assert.equal(text, done.total.toLocaleString("en-US"));
        }
    }
    record("All five algorithms sort all four UI patterns; each heat-table total matches actual trace");
    await range(page, "#size", 128);
    await page.waitForTimeout(170);
    await expect(page.locator("#size-value")).toHaveText("128");
    assert.equal((await getState(page)).main.input.length, 128);
    await range(page, "#size", 8);
    await page.waitForTimeout(170);
    await page.locator("#size").evaluate((element) =>
    {
        element.value = "16";
        element.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector("#tab-bubble").click();
    });
    state = await getState(page);
    assert.equal(state.main.n, 16);
    assert.equal(state.main.input.length, 16);
    await page.locator("#size").evaluate((element) =>
    {
        element.value = "8";
        element.dispatchEvent(new Event("input", { bubbles: true }));
        document.querySelector('.transport [data-action="reset"]').click();
    });
    await page.waitForTimeout(150);
    state = await getState(page);
    assert.equal(state.main.input.length, 8);
    assert.equal(state.main.position, 0);
    assert.equal(state.main.playing, false);
    record("Pending debounced data changes flush before tab selection or Reset without stale arrays/restarting playback");
    await page.locator('[data-load="insertion"]').click();
    assert.equal((await getState(page)).main.id, "insertion");
    assert.equal((await getState(page)).main.position, 0);
    assert.equal((await getState(page)).main.playing, false);
    await page.locator('[data-cell-algorithm="quick"][data-cell-pattern="reversed"]').click();
    state = await getState(page);
    assert.equal(state.main.id, "quick");
    assert.equal(state.main.pattern, "reversed");
    assert.equal(state.main.position, 0);
    record("Size extremes 8/128, live cards and pattern-cell selection with reduced-motion paused state");

    await page.locator("#race").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    assert.equal((await getState(page)).race.tick, 0);
    assert.equal(await page.locator('#lane-a option[value="quick"]').evaluate((o) => o.disabled), true);
    assert.equal(await page.locator('#lane-b option[value="bubble"]').evaluate((o) => o.disabled), true);
    await range(page, "#race-size", 16);
    await page.locator('.race-actions [data-race="step"]').click();
    state = await getState(page);
    assert.equal(state.race.tick, 1);
    assert.ok(state.race.players.every((p) => p.position === 1));
    await page.locator('.race-actions [data-race="play"]').click();
    await page.waitForTimeout(150);
    await page.locator('.race-actions [data-race="play"]').click();
    const tick = (await getState(page)).race.tick;
    assert.ok(tick > 1);
    await page.waitForTimeout(150);
    assert.equal((await getState(page)).race.tick, tick);
    await range(page, "#race-speed", 500);
    assert.equal((await getState(page)).race.tick, 0);
    await page.locator('.race-actions [data-race="play"]').click();
    await expect.poll(async () => (await getState(page)).race.playing).toBe(false);
    state = await getState(page);
    assert.ok(state.race.players.every((p) => p.position === p.total));
    assert.deepEqual(state.race.players[0].array, [...state.race.input].sort((a, b) => a - b));
    assert.deepEqual(state.race.players[1].array, state.race.players[0].array);
    await expect(page.locator("#race-result")).toContainText("won by");
    await expect(page.locator(".lane-status").filter({ hasText: "Finished first" })).toHaveCount(1);
    await page.locator('.race-actions [data-race="reset"]').click();
    assert.equal((await getState(page)).race.tick, 0);
    const oldInput = (await getState(page)).race.input;
    await page.locator('.race-actions [data-race="new"]').click();
    assert.notDeepEqual((await getState(page)).race.input, oldInput);
    await page.locator("#lane-a").selectOption("merge");
    assert.deepEqual((await getState(page)).race.ids, ["merge", "quick"]);
    record("Race identical data, same tick, duplicate prevention, pause, complete winner, reset, new array and changed lane");
    await page.locator("#race").screenshot({ path: path.join(root, ".checks", "race.png") });
    await noOverflow(page, "1200x900 after all interactions");

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.locator("#visualizer").scrollIntoViewIfNeeded();
    await noOverflow(page, "1440x900");
    const settings = await page.locator(".transport").boundingBox();
    assert.ok(settings.y + settings.height < 900);
    qa.viewports.push({ width: 1440, height: 900, dpr: 1, reducedMotion: true });
    record("1440x900 controls fit the first viewport");
    await page.locator("#algorithms").screenshot({ path: path.join(root, ".checks", "algorithms.png") });

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const mobile = await mobileContext.newPage();
    monitor(mobile);
    await mobile.goto(server.url);
    await mobile.evaluate(() => document.fonts.ready);
    await mobile.waitForTimeout(600);
    assert.equal((await getState(mobile)).main.position, 0);
    assert.equal((await getState(mobile)).race.tick, 0);
    await expect(mobile.locator(".reduced-note")).toBeVisible();
    await noOverflow(mobile, "390x844 initial");
    await mobile.locator('#mobile-main [data-action="next"]').tap();
    assert.equal((await getState(mobile)).main.position, 1);
    qa.viewports.push({ width: 390, height: 844, dpr: 1, reducedMotion: true });
    qa.screenshots.mobile = path.join(root, ".checks", "mobile.png");
    await mobile.screenshot({ path: qa.screenshots.mobile });
    await mobile.locator('#mobile-main [data-action="back"]').tap();
    assert.equal((await getState(mobile)).main.position, 0);
    await mobile.locator('#mobile-main [data-action="play"]').tap();
    await mobile.waitForTimeout(160);
    await mobile.locator('#mobile-main [data-action="play"]').tap();
    assert.ok((await getState(mobile)).main.position > 0);
    await mobile.locator('#mobile-main [data-action="reset"]').tap();
    const mobileSeed = (await getState(mobile)).main.seed;
    await mobile.locator('#mobile-main [data-action="shuffle"]').tap();
    await mobile.waitForTimeout(200);
    assert.equal((await getState(mobile)).main.seed, mobileSeed + 1);
    await mobile.locator('[data-pattern="few"]').tap();
    await mobile.waitForTimeout(200);
    assert.ok((await getState(mobile)).main.input.every((n) => [20, 40, 60, 80, 100].includes(n)));
    await mobile.locator("#tab-heap").tap();
    assert.equal((await getState(mobile)).main.id, "heap");
    await range(mobile, "#speed", 0);
    await expect(mobile.locator("#speed-value")).toHaveText("1 steps/s");
    await range(mobile, "#speed", 1000);
    await expect(mobile.locator("#speed-value")).toHaveText("500 steps/s");
    record("Mobile actual taps: fixed transport, stepping, playback, reset, seeded shuffle, pattern, tabs; logarithmic speed 1–500");
    await mobile.locator("#pattern-body").scrollIntoViewIfNeeded();
    await noOverflow(mobile, "390x844 pattern table");
    await mobile.locator('[data-cell-algorithm="merge"][data-cell-pattern="nearly"]').tap();
    assert.equal((await getState(mobile)).main.id, "merge");
    assert.equal((await getState(mobile)).main.pattern, "nearly");
    await mobile.locator("#race").scrollIntoViewIfNeeded();
    await expect(mobile.locator("#mobile-race")).toBeVisible();
    await expect(mobile.locator("#mobile-main")).toBeHidden();
    await mobile.locator('#mobile-race [data-race="step"]').tap();
    assert.equal((await getState(mobile)).race.tick, 1);
    await mobile.locator('#mobile-race [data-race="play"]').tap();
    await mobile.waitForTimeout(140);
    await mobile.locator('#mobile-race [data-race="play"]').tap();
    assert.ok((await getState(mobile)).race.tick > 1);
    await mobile.locator('#mobile-race [data-race="reset"]').tap();
    assert.equal((await getState(mobile)).race.tick, 0);
    await noOverflow(mobile, "390x844 after all interactions");
    record("Mobile heat-table navigation; fixed bar correctly switches to real Race Start/Pause, Step and Reset");
    const retinaContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const retina = await retinaContext.newPage();
    monitor(retina);
    await retina.goto(server.url);
    await expect.poll(() => retina.locator("#main-canvas").evaluate((canvas) => canvas.width)).toBeGreaterThan(600);
    const canvasSize = await retina.locator("#main-canvas").evaluate((canvas) => ({ bitmap: canvas.width, css: canvas.getBoundingClientRect().width }));
    assert.equal(canvasSize.bitmap, Math.round(canvasSize.css * 2));
    record("Canvas backing store honors devicePixelRatio 2");

    const autoplayPage = await context.newPage();
    monitor(autoplayPage);
    await autoplayPage.goto(server.url);
    await autoplayPage.locator("#race").scrollIntoViewIfNeeded();
    await autoplayPage.waitForTimeout(200);
    assert.ok((await getState(autoplayPage)).race.tick > 0);
    record("Race auto-starts once at 40% visibility without reduced motion");
    assert.deepEqual(qa.errors, []);
    record("No HTTP, request, console or page errors across desktop and mobile");
    qa.passed = true;
}
catch (error)
{
    qa.failure = { message: error.message, stack: error.stack };
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(root, ".checks", "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
