import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "605-neon-snake-3d-game");
const state = await W.json(job.stateFile);
assert.equal(state.runId, job.runId);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal((await W.text(job.promptLock)).trim(), String(state.ownedLock.pid));
process.kill(state.ownedLock.pid, 0);
const exported = path.join(job.output, "out");
const checks = path.join(job.output, ".checks");
const result =
{
    prompt: job.prompt,
    modelId: job.modelId,
    staticDir: exported,
    publicPath: "/pages/neon-snake-3d-game/GPT-6/index.html",
    browser: "Installed Playwright Chromium with local SwiftShader WebGL",
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false,
    passed: false
};
let server;
let browser;
const contexts = [];

function track(page, label)
{
    page.on("pageerror", (error) => result.errors.push(`${label}: pageerror: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") result.errors.push(`${label}: console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => result.errors.push(`${label}: requestfailed: ${request.url()}: ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.errors.push(`${label}: HTTP ${response.status()}: ${response.url()}`);
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(new URL(server.url).origin)) result.errors.push(`${label}: unexpected remote request ${request.url()}`);
    });
}

async function check(name, run)
{
    await run();
    result.assertions.push({ name, passed: true });
    console.log(`PASS ${name}`);
}

async function appState(page)
{
    return page.evaluate(async () =>
    {
        const { app } = await import("./main.js");
        return { state: app.game.state, body: app.game.body, score: app.game.score, step: app.game.step,
            offset: app.game.offset, direction: app.game.direction, queued: app.game.queued, food: app.game.food,
            reason: app.game.reason, muted: app.runs.muted, contextState: app.audio.context?.state };
    });
}

async function noOverflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight && document.body.scrollWidth <= innerWidth), true);
}

async function ready(page)
{
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.locator("#start").waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { window.__qaApp = (await import("./main.js")).app; });
    assert.equal(await page.locator("#fallback").isVisible(), false);
    assert.equal(await page.locator("canvas").getAttribute("aria-label"), "Glowing grid snake game");
}

async function waitHeadChange(page, original)
{
    await page.waitForFunction((value) => window.__qaApp.game.body[0].join(",") !== value,
        original.join(","), { timeout: 15000 });
    return (await appState(page)).body[0];
}

async function queueAndCross(page, key)
{
    const before = (await appState(page)).body[0];
    await page.keyboard.press(key);
    return waitHeadChange(page, before);
}

async function scenePositions(page)
{
    return page.evaluate(async () =>
    {
        const { app } = await import("./main.js");
        const points = [...app.scene.meshes, app.scene.food].map((mesh) =>
        {
            const point = mesh.position.clone().project(app.scene.camera);
            return { x: (point.x + 1) * innerWidth / 2, y: (1 - point.y) * innerHeight / 2 };
        });
        const card = document.querySelector(".start-card").getBoundingClientRect();
        return { points, card: { right: card.right, top: card.top } };
    });
}

try
{
    result.staticDigest = await S.validateStaticOutput(exported, "neon-snake-3d-game", "GPT-6");
    server = await startPreviewServer(exported, { workspace: root });
    browser = await chromium.launch(
    {
        headless: true,
        args: ["--enable-webgl", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"]
    });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    contexts.push(desktop);
    const page = await desktop.newPage();
    track(page, "desktop");
    await ready(page);
    result.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
    await noOverflow(page);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    result.screenshots.desktop = path.join(checks, "desktop.png");
    await check("Desktop actual 3D first frame, local fonts, four capsules and bead clear of start card", async () =>
    {
        const positions = await scenePositions(page);
        result.desktopScene = positions;
        assert.equal(positions.points.length, 5);
        assert(positions.points.every((point) => point.x > positions.card.right + 12 && point.x < 1180 && point.y > 70 && point.y < 870));
        assert.equal(await page.evaluate(() => document.fonts.check("800 44px Syne") && document.fonts.check("500 15px Outfit") && document.fonts.check('500 13px "IBM Plex Mono"')), true);
        assert.equal(await page.locator("#start").evaluate((element) => element === document.activeElement), true);
    });
    await check("1440×900 desktop floor also fits without hiding the posed line", async () =>
    {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(120);
        const positions = await scenePositions(page);
        assert(positions.points.every((point) => point.x > positions.card.right + 12 && point.x < 1420));
        await noOverflow(page);
        result.viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1 });
        await page.setViewportSize({ width: 1200, height: 900 });
    });
    await check("How to steer and both rule radios work without starting; rails update immediately", async () =>
    {
        await page.locator("summary").click();
        assert.equal(await page.locator("details").getAttribute("open"), "");
        assert.equal((await appState(page)).state, "title");
        await page.getByRole("radio", { name: "Walls", exact: true }).check();
        assert.equal(await page.evaluate(async () => (await import("./main.js")).app.scene.rails.visible), true);
        assert.match(await page.locator("#rule-hint").innerText(), /low rail/);
        await page.locator("summary").click();
        await noOverflow(page);
    });
    await check("Real timed Walls run moves, collects the opening bead, grows, scores, and ends on the rail", async () =>
    {
        await page.getByRole("button", { name: "Start run", exact: true }).click();
        await page.waitForFunction(() => window.__qaApp.game.score === 10, null, { timeout: 15000 });
        let current = await appState(page);
        assert.equal(current.body.length, 5);
        assert.equal(current.step, 1);
        assert.equal(current.contextState, "running");
        await page.locator("#over-dialog").waitFor({ state: "visible", timeout: 15000 });
        current = await appState(page);
        assert.equal(current.reason, "rail");
        assert.equal(current.score, 10);
        assert.equal(await page.locator("#new-best").innerText(), "New best for Walls.");
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("lumen-coil-runs")).walls.best), 10);
        await noOverflow(page);
        await page.screenshot({ path: path.join(checks, "desktop-gameover.png") });
        result.screenshots.gameover = path.join(checks, "desktop-gameover.png");
    });
    await check("Game-over dialog traps focus, filters initials and saves a ranked browser-local run", async () =>
    {
        await page.locator("#initials").focus();
        await page.keyboard.insertText("a1bc");
        assert.match(await page.locator("#initials").inputValue(), /^[A-Z]{1,3}$/);
        await page.locator("#initials").fill("ABC");
        await page.locator("#save").click();
        assert.equal(await page.locator("#save").innerText(), "Saved");
        assert.match(await page.locator("#over-board").innerText(), /ABC/);
        await page.locator("#change").focus();
        await page.keyboard.press("Tab");
        assert.equal(await page.locator("#again").evaluate((element) => element === document.activeElement), true);
        await page.keyboard.press("Escape");
        assert.equal((await appState(page)).state, "over");
    });
    await check("Restart preserves rule but resets opening cells, food and score; pause freezes offset and audio", async () =>
    {
        await page.locator("#again").click();
        await page.keyboard.press("p");
        const before = await appState(page);
        assert.equal(before.state, "paused");
        assert.equal(before.score, 0);
        assert.deepEqual(before.body, [[11, 8], [10, 8], [9, 8], [8, 8]]);
        assert.deepEqual(before.food, [14, 8]);
        await page.waitForTimeout(350);
        const after = await appState(page);
        assert.equal(after.offset, before.offset);
        assert.equal(after.contextState, "suspended");
        assert.equal(await page.locator(".pad").isVisible(), false);
        await page.locator("#end").focus();
        await page.keyboard.press("Tab");
        assert.equal(await page.locator("#resume").evaluate((element) => element === document.activeElement), true);
        await page.keyboard.press("Escape");
        assert.equal((await appState(page)).state, "playing");
        await page.keyboard.press("p");
        await page.locator("#end").click();
        assert.equal((await appState(page)).reason, "ended");
        await page.locator("#change").click();
        assert.match(await page.locator("#recent").innerText(), /ABC/);
        await page.getByRole("radio", { name: "Wrap", exact: true }).check();
        assert.match(await page.locator("#recent").innerText(), /No runs/);
    });
    await check("Wrap actually crosses the edge; keyboard turns produce real self-collision", async () =>
    {
        await page.locator("#start").click();
        await page.waitForFunction(() =>
        {
            const game = window.__qaApp.game;
            return game.score === 10 && game.body[0][0] <= 1;
        }, null, { timeout: 15000 });
        assert.equal((await appState(page)).state, "playing");
        await page.keyboard.press("p");
        await page.locator("#end").click();
        await page.locator("#again").click();
        await page.waitForFunction(() => window.__qaApp.game.score === 10, null, { timeout: 15000 });
        await queueAndCross(page, "w");
        await queueAndCross(page, "ArrowLeft");
        await page.keyboard.press("ArrowDown");
        await page.locator("#over-dialog").waitFor({ state: "visible", timeout: 15000 });
        assert.equal((await appState(page)).reason, "cross");
        await noOverflow(page);
    });
    await check("Mute persists across reload; hidden-tab event pauses and never auto-resumes", async () =>
    {
        await page.locator("#change").click();
        await page.locator("#sound").click();
        assert.equal(await page.locator("#sound").getAttribute("aria-label"), "Sound off");
        await ready(page);
        assert.equal((await appState(page)).muted, true);
        await page.locator("#start").click();
        await page.evaluate(() =>
        {
            Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        assert.equal((await appState(page)).state, "paused");
        await page.evaluate(() =>
        {
            Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
            document.dispatchEvent(new Event("visibilitychange"));
        });
        assert.equal((await appState(page)).state, "paused");
        await page.locator("#end").click();
    });

    const phone = await browser.newContext(
    {
        viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true
    });
    contexts.push(phone);
    const mobile = await phone.newPage();
    track(mobile, "mobile");
    await ready(mobile);
    result.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, touch: true });
    await noOverflow(mobile);
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    result.screenshots.mobile = path.join(checks, "mobile.png");
    await check("390×844 mobile first frame shows the line and bead above the scrollable sheet", async () =>
    {
        const positions = await scenePositions(mobile);
        result.mobileScene = positions;
        assert(positions.points.every((point) => point.y > 65 && point.y < positions.card.top - 10 && point.x > 10 && point.x < 380));
        assert.equal(await mobile.locator(".start-card").evaluate((element) => element.scrollHeight > element.clientHeight), true);
    });
    await check("Mobile 64px pad, swipe directions and pause operate the actual simulation", async () =>
    {
        await mobile.locator("#start").tap();
        assert.equal(await mobile.locator(".pad").isVisible(), true);
        const box = await mobile.getByRole("button", { name: "Turn up", exact: true }).boundingBox();
        assert.equal(box.width, 64);
        assert.equal(box.height, 64);
        const head = (await appState(mobile)).body[0];
        await mobile.getByRole("button", { name: "Turn up", exact: true }).tap();
        const up = await waitHeadChange(mobile, head);
        assert.equal(up[1], head[1] - 1);
        const before = (await appState(mobile)).body[0];
        const touch = await phone.newCDPSession(mobile);
        await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 260, y: 260 }] });
        await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 170, y: 260 }] });
        await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await touch.detach();
        await mobile.waitForFunction((x) => window.__qaApp.game.direction[0] === -1 &&
            window.__qaApp.game.body[0][0] !== x, before[0], { timeout: 15000 });
        const west = await appState(mobile);
        assert.deepEqual(west.direction, [-1, 0]);
        assert.notEqual(west.body[0][0], before[0]);
        await noOverflow(mobile);
        await mobile.screenshot({ path: path.join(checks, "mobile-gameplay.png") });
        result.screenshots.mobileGameplay = path.join(checks, "mobile-gameplay.png");
        await mobile.locator("#pause").tap();
        assert.equal((await appState(mobile)).state, "paused");
        assert.equal(await mobile.locator(".pad").isVisible(), false);
        await mobile.locator("#resume").tap();
        assert.equal((await appState(mobile)).state, "playing");
        await mobile.locator("#pause").tap();
        await mobile.locator("#end").tap();
        await mobile.locator("#save").tap();
        assert.match(await mobile.locator("#over-board").innerText(), /YOU/);
        await noOverflow(mobile);
    });
    await check("Reduced-motion preference changes freeze bead scale, halo, title drift and grid breathe", async () =>
    {
        await mobile.locator("#change").tap();
        await mobile.emulateMedia({ reducedMotion: "reduce" });
        await mobile.waitForFunction(() => window.__qaApp.scene.reduced &&
            window.__qaApp.scene.uniforms.breathe.value === 0 && window.__qaApp.scene.food.scale.x === 1);
        const before = await mobile.evaluate(async () =>
        {
            const { app } = await import("./main.js");
            return { bead: app.scene.food.scale.x, opacity: app.scene.halo.material.opacity,
                camera: app.scene.camera.position.toArray(), breathe: app.scene.uniforms.breathe.value };
        });
        await mobile.waitForTimeout(250);
        const after = await mobile.evaluate(async () =>
        {
            const { app } = await import("./main.js");
            return { bead: app.scene.food.scale.x, opacity: app.scene.halo.material.opacity,
                camera: app.scene.camera.position.toArray(), breathe: app.scene.uniforms.breathe.value };
        });
        assert.deepEqual(after, before);
        assert.equal(after.bead, 1);
        assert.equal(after.opacity, 0.32);
        assert.equal(after.breathe, 0);
    });
    await check("Unavailable WebGL presents the readable steering fallback without uncaught or console errors", async () =>
    {
        const fallback = await desktop.newPage();
        track(fallback, "fallback");
        await fallback.addInitScript(() =>
        {
            const original = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, ...options)
            {
                if (type.startsWith("webgl")) return null;
                return original.call(this, type, ...options);
            };
        });
        await fallback.goto(server.url);
        await fallback.locator("#fallback").waitFor({ state: "visible" });
        assert.equal(await fallback.locator("canvas").isVisible(), false);
        await fallback.locator("summary").click();
        assert.equal(await fallback.locator(".instructions").isVisible(), true);
        await noOverflow(fallback);
        await fallback.close();
    });
    await check("Owned page teardown disposes renderer, listeners and AudioContext", async () =>
    {
        await mobile.evaluate(async () => (await import("./main.js")).app.dispose());
        assert.equal(await mobile.evaluate(async () => (await import("./main.js")).app.audio.context.state), "closed");
    });
    assert.deepEqual(result.errors, []);
    result.passed = true;
}
catch (error)
{
    result.failure = error.stack;
    for (const [index, context] of contexts.entries())
    {
        for (const page of context.pages())
        {
            if (page.isClosed()) continue;
            await page.screenshot({ path: path.join(checks, `failure-${index}.png`) }).catch(() => {});
            result.failureState = await page.evaluate(async () =>
            {
                const { app } = await import("./main.js");
                return { state: app.game.state, failed: app.failed, reason: app.failureReason,
                    startHidden: app.ui.$("start").hidden, cardHidden: app.ui.startCard.hidden,
                    body: app.game.body, score: app.game.score };
            }).catch(() => null);
        }
    }
    console.error(error);
    process.exitCode = 1;
}
finally
{
    for (const context of contexts) await context.close();
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: true }));
}
