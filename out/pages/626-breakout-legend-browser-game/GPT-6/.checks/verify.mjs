import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { createGame, loadLevel, step, bounceBrick, movePaddle, RADIUS, PADDLE_Y } from "../engine.js";
import { levels, speeds } from "../levels.js";
import { formatTime, readEntries, submitEntry } from "../leaderboard.js";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "..", "..", "..", "..");
const results = [];
const errors = [];
const viewports = [];
let browser;
let service;
const check = (name, fn) =>
{
    fn();
    results.push({ name, passed: true });
};
const make = () =>
{
    const game = createGame();
    game.phase = "playing";
    game.launchDelay = 0;
    return game;
};
const safe = (game) =>
{
    game.bricks = [{ x: 700, y: 80, w: 60, h: 20, type: "N", alive: true }];
};
function track(page)
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
}
async function noOverflow(page, label)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${label}: horizontal overflow`);
    const canvas = await page.locator("canvas").boundingBox();
    assert.ok(canvas.width > 200 && canvas.height > 150);
    results.push({ name: label, passed: true });
}
try
{
    check("All ten authored levels: exact indestructible/splitter counts, grid and speed progression", () =>
    {
        const iron = [0, 0, 4, 6, 8, 12, 10, 14, 16, 20];
        const split = [0, 2, 2, 4, 4, 6, 6, 8, 8, 10];
        levels.forEach((grid, index) =>
        {
            assert.ok(grid.length <= 8 && grid.every((row) => row.length === 12));
            const cells = grid.flat();
            assert.equal(cells.filter((cell) => cell === "I").length, iron[index], `iron level ${index + 1}`);
            assert.equal(cells.filter((cell) => cell === "S").length, split[index], `split level ${index + 1}`);
            const game = make();
            loadLevel(game, index + 1);
            assert.equal(game.paddle.w, Math.max(60, 100 - Math.max(0, index - 1) * 5));
            assert.equal(Math.abs(game.balls[0].vx), 180 * speeds[index]);
            assert.equal(game.balls[0].vy, -180 * speeds[index]);
        });
    });
    check("Brick AABB collision resolves top, bottom, left and right faces", () =>
    {
        const brick = { x: 100, y: 100, w: 60, h: 20 };
        const fixtures =
        [
            [{ x: 125, y: 95, vx: 10, vy: 100 }, { x: 125, y: 90 }, "vy", -1, "y", 94],
            [{ x: 125, y: 125, vx: 10, vy: -100 }, { x: 125, y: 130 }, "vy", 1, "y", 126],
            [{ x: 95, y: 110, vx: 100, vy: 10 }, { x: 90, y: 110 }, "vx", -1, "x", 94],
            [{ x: 165, y: 110, vx: -100, vy: 10 }, { x: 170, y: 110 }, "vx", 1, "x", 166]
        ];
        fixtures.forEach(([ball, previous, component, sign, axis, position]) =>
        {
            assert.equal(bounceBrick(ball, brick, previous), true);
            assert.equal(Math.sign(ball[component]), sign);
            assert.equal(ball[axis], position);
        });
    });
    check("Wall bounces, top-face paddle angles, speed conservation, downward miss and last-ball game over", () =>
    {
        const game = make();
        safe(game);
        for (const [x, vx, expected] of [[5, -180, 1], [795, 180, -1]])
        {
            game.balls = [{ x, y: 300, vx, vy: 0, trail: [] }];
            step(game, .01);
            assert.equal(Math.sign(game.balls[0].vx), expected);
        }
        game.balls = [{ x: 300, y: 5, vx: 0, vy: -180, trail: [] }];
        step(game, .01);
        assert.ok(game.balls[0].vy > 0);
        for (const offset of [-40, 0, 40])
        {
            game.balls = [{ x: 400 + offset, y: PADDLE_Y - RADIUS - 1, vx: 0, vy: 250, trail: [] }];
            step(game, .01);
            assert.ok(game.balls[0].vy < 0);
            assert.equal(Math.sign(game.balls[0].vx), Math.sign(offset));
            assert.ok(Math.abs(Math.hypot(game.balls[0].vx, game.balls[0].vy) - 250) < .001);
        }
        game.balls = [{ x: 20, y: 599, vx: 0, vy: 250, trail: [] }, { x: 400, y: 300, vx: 0, vy: -180, trail: [] }];
        step(game, .05);
        assert.equal(game.balls.length, 1);
        assert.equal(game.phase, "playing");
        game.balls[0].y = 609;
        game.balls[0].vy = 250;
        step(game, .01);
        assert.equal(game.phase, "gameover");
        assert.equal(game.balls.length, 0);
    });
    check("Normal bricks destroy once; indestructible bricks deflect without destruction; splitters spawn two up to cap eight", () =>
    {
        for (const [type, initialCount, expectedCount] of [["N", 1, 1], ["I", 1, 1], ["S", 1, 3], ["S", 7, 8], ["S", 8, 8]])
        {
            const game = make();
            game.bricks = [{ x: 300, y: 100, w: 60, h: 20, type, alive: true },
                { x: 700, y: 70, w: 60, h: 20, type: "N", alive: true }];
            game.balls = [{ x: 330, y: 128, vx: 0, vy: -180, trail: [] },
                ...Array.from({ length: initialCount - 1 }, () => ({ x: 500, y: 400, vx: 180, vy: -180, trail: [] }))];
            step(game, .025);
            assert.equal(game.bricks[0].alive, type === "I");
            assert.ok(game.balls[0].vy > 0);
            assert.equal(game.balls.length, expectedCount);
            if (type === "S" && initialCount === 1)
            {
                assert.ok(game.balls[1].vx * game.balls[2].vx < 0);
                assert.ok(game.balls.every((ball) => Math.abs(Math.hypot(ball.vx, ball.vy) - 180) < .01));
            }
        }
    });
    check("Every level transitions by real last-brick collision; final victory; pause freezes timer; paddle clamps", () =>
    {
        const game = make();
        for (let level = 1; level <= 10; level++)
        {
            assert.equal(game.level, level);
            game.launchDelay = 0;
            game.bricks.forEach((brick) => { brick.alive = brick.type === "I"; });
            const lastBrick = game.bricks.find((brick) => brick.type === "N");
            lastBrick.alive = true;
            game.balls = [{ x: lastBrick.x + 30, y: lastBrick.y + 28, vx: 0, vy: -180, trail: [] }];
            step(game, .025);
            assert.equal(game.phase, level === 10 ? "victory" : "playing");
        }
        const paused = make();
        paused.phase = "paused";
        const before = JSON.stringify(paused);
        step(paused, .04, 1);
        assert.equal(JSON.stringify(paused), before);
        movePaddle(paused, -100);
        assert.equal(paused.paddle.x, 0);
        movePaddle(paused, 1000);
        assert.equal(paused.paddle.x, 700);
    });
    check("Local ranking validates names/times, strips HTML, persists sorted top 50, top ten and unique duplicate identity", () =>
    {
        let value;
        const storage = { getItem: () => value, setItem: (key, data) => { value = data; } };
        assert.equal(readEntries(storage).length, 0);
        assert.throws(() => submitEntry("", 10, storage));
        assert.throws(() => submitEntry("x".repeat(21), 10, storage));
        for (const time of [0, -1, 1.5, NaN]) assert.throws(() => submitEntry("Pilot", time, storage));
        const first = submitEntry("<b>Pilot</b>", 87, storage);
        const second = submitEntry("Pilot", 87, storage);
        assert.equal(first.entry.name, "Pilot");
        assert.notEqual(first.entry.id, second.entry.id);
        for (let i = 1; i <= 55; i++) submitEntry(`Pilot ${i}`, i + 100, storage);
        assert.equal(readEntries(storage).length, 50);
        assert.equal(readEntries(storage)[0].time, 87);
        assert.equal(readEntries(storage).slice(0, 10).length, 10);
        assert.equal(formatTime(145), "02:25");
        value = "{bad";
        assert.throws(() => readEntries(storage));
    });

    const exported = path.join(folder, "out");
    await StaticHomepage.validateStaticOutput(exported, "breakout-legend-browser-game", "GPT-6");
    service = await startPreviewServer(exported, { workspace });
    assert.equal((await fetch(service.url)).status, 200);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    track(page);
    assert.equal((await page.goto(service.url)).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#dialog-title").filter({ hasText: "READY, PLAYER ONE?" }).waitFor();
    assert.ok(await page.locator("h1").isVisible());
    await noOverflow(page, "Desktop 1200×900 initial meaningful homepage, resources and overflow");
    await page.screenshot({ path: path.join(folder, ".checks", "desktop.png") });
    await page.keyboard.press("Enter");
    await page.locator("#screen[hidden]").waitFor({ state: "attached" });
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowRight");
    await page.keyboard.press("p");
    await page.getByRole("heading", { name: "FLIGHT ON HOLD" }).waitFor();
    const frozen = await page.locator("#timer-value").textContent();
    await page.waitForTimeout(1100);
    assert.equal(await page.locator("#timer-value").textContent(), frozen);
    await page.keyboard.press("r");
    assert.equal(await page.locator("#timer-value").textContent(), "00:00");
    await page.getByRole("button", { name: "Pause game", exact: true }).click();
    await page.locator('[data-action="resume"]').click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "VIEW LEADERBOARD", exact: true }).click();
    await page.getByText("No legends yet.", { exact: false }).waitFor();
    await page.getByRole("button", { name: "CLOSE", exact: true }).click();
    await page.getByRole("button", { name: "Enable sound" }).click();
    assert.equal(await page.getByRole("button", { name: "Mute sound" }).getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: "Mute sound" }).click();
    await page.getByRole("button", { name: "START GAME" }).click();
    await page.keyboard.down("ArrowLeft");
    await page.waitForTimeout(900);
    await page.keyboard.up("ArrowLeft");
    await page.getByRole("heading", { name: "ALL BALLS LOST" }).waitFor({ timeout: 20000 });
    await page.getByRole("button", { name: "TRY AGAIN" }).click();
    await noOverflow(page, "Desktop real keyboard movement, pause/resume/restart, natural loss/retry and no overflow after interactions");
    results.push({ name: "Unmodified browser: natural ball flight and missed-paddle game over, menu and empty leaderboard, sound toggle", passed: true });
    await page.keyboard.press("Escape");
    for (const width of [768, 1280])
    {
        await page.setViewportSize({ width, height: 900 });
        await noOverflow(page, `Responsive ${width}px before interactions`);
        await page.getByRole("button", { name: "START GAME" }).click();
        await page.keyboard.press("p");
        await noOverflow(page, `Responsive ${width}px after play and pause`);
        await page.keyboard.press("Escape");
        viewports.push({ width, height: 900 });
    }

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    track(mobile);
    await mobile.goto(service.url);
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile, "Mobile 390×844 initial visible homepage and no overflow");
    await mobile.screenshot({ path: path.join(folder, ".checks", "mobile.png"), fullPage: true });
    await mobile.getByRole("button", { name: "START GAME" }).tap();
    const box = await mobile.locator("canvas").boundingBox();
    const cdp = await mobileContext.newCDPSession(mobile);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + 80, y: box.y + box.height * .8 }] });
    await mobile.waitForTimeout(100);
    for (let point = 1; point <= 5; point++)
    {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + 80 + (box.width - 105) * point / 5, y: box.y + box.height * .8 }] });
        await mobile.waitForTimeout(80);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobile.waitForTimeout(600);
    const paddleCenter = await mobile.evaluate(() =>
    {
        const pixels = document.querySelector("canvas").getContext("2d").getImageData(0, 554, 800, 1).data;
        const positions = [];
        for (let x = 0; x < 800; x++)
        {
            if (pixels[x * 4] > 80 && pixels[x * 4 + 2] > 160 && pixels[x * 4 + 1] < 180) positions.push(x);
        }
        return positions.reduce((sum, value) => sum + value, 0) / positions.length;
    });
    assert.ok(paddleCenter > 650, `Real touch drag must move the rendered paddle: ${paddleCenter}`);
    await mobile.getByRole("button", { name: "Pause game", exact: true }).tap();
    await mobile.getByRole("heading", { name: "FLIGHT ON HOLD" }).waitFor();
    await mobile.locator('[data-action="resume"]').tap();
    await mobile.getByRole("button", { name: "Pause game", exact: true }).tap();
    await mobile.getByRole("button", { name: "QUIT TO MENU" }).tap();
    await mobile.getByRole("button", { name: "VIEW LEADERBOARD", exact: true }).tap();
    await mobile.getByRole("heading", { name: "TOP 10 SURVIVORS" }).waitFor();
    await mobile.getByRole("button", { name: "CLOSE", exact: true }).tap();
    await noOverflow(mobile, "Mobile real touch drag, pause/resume, quit and leaderboard; no overflow after interactions");

    // Expose an otherwise unchanged engine state only in this isolated test context.
    // Controlled fixtures verify UI terminal states without pretending to be a manual ten-level run.
    const fixtureContext = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await fixtureContext.route("**/engine.js", async (route) =>
    {
        const source = await readFile(path.join(exported, "engine.js"), "utf8");
        await route.fulfill({ contentType: "text/javascript", body: source.replace("    return game;", "    globalThis.__fixtureGame = game;\n    return game;") });
    });
    const fixture = await fixtureContext.newPage();
    track(fixture);
    await fixture.goto(service.url);
    await fixture.getByRole("button", { name: "START GAME" }).click();
    const before = await fixture.evaluate(() => globalThis.__fixtureGame.paddle.x);
    await fixture.keyboard.down("ArrowRight");
    await fixture.waitForTimeout(250);
    await fixture.keyboard.up("ArrowRight");
    assert.ok(await fixture.evaluate(() => globalThis.__fixtureGame.paddle.x) > before);
    const field = await fixture.locator("canvas").boundingBox();
    await fixture.mouse.move(field.x + 25, field.y + field.height - 70);
    assert.ok(await fixture.evaluate(() => globalThis.__fixtureGame.paddle.x) < 30);
    for (let level = 1; level <= 10; level++)
    {
        await fixture.evaluate(() =>
        {
            const game = globalThis.__fixtureGame;
            game.launchDelay = 0;
            game.bricks.forEach((brick) => { brick.alive = brick.type === "I"; });
            const brick = game.bricks.find((item) => item.type === "N");
            brick.alive = true;
            game.balls = [{ x: brick.x + 30, y: brick.y + 27, vx: 0, vy: -180, trail: [] }];
        });
        if (level < 10)
        {
            await fixture.waitForFunction((value) => globalThis.__fixtureGame.level === value, level + 1);
            assert.equal(await fixture.locator("#level-value").textContent(), String(level + 1).padStart(2, "0"));
        }
    }
    await fixture.getByRole("heading", { name: "BREAKOUT COMPLETE" }).waitFor();
    await fixture.getByLabel("Enter your name").fill("<b>Pilot</b>");
    await fixture.getByRole("button", { name: "SAVE MY RUN" }).click();
    await fixture.locator(".board-table .current").waitFor();
    assert.equal(await fixture.locator(".board-table .current td").nth(1).textContent(), "Pilot");
    await fixture.getByRole("button", { name: "CLOSE", exact: true }).click();
    await fixture.reload();
    await fixture.getByRole("button", { name: "VIEW LEADERBOARD", exact: true }).click();
    await fixture.getByRole("cell", { name: "Pilot", exact: true }).waitFor();
    await noOverflow(fixture, "Controlled fixture: ten collision-driven levels, victory/name submission, local persisted rank and no overflow");
    await fixture.evaluate(() => localStorage.setItem("breakout-legend-local-v1", "{invalid"));
    await fixture.getByRole("button", { name: "CLOSE", exact: true }).click();
    await fixture.getByRole("button", { name: "VIEW LEADERBOARD", exact: true }).click();
    await fixture.getByText("Local storage is unavailable or contains invalid data.", { exact: false }).waitFor();
    results.push({ name: "Leaderboard corrupt-storage error is visible without crashing", passed: true });
    assert.deepEqual(errors, [], "Browser errors");
    viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, touch: true, deviceScaleFactor: 1 });
}
catch (error)
{
    errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"),
    {
        passed: errors.length === 0,
        checkedAt: new Date().toISOString(),
        results, errors, viewports,
        visualReviewed: false,
        screenshots: { desktop: ".checks\\desktop.png", mobile: ".checks\\mobile.png" },
        method: "Actual unmodified static pages, real keyboard/touch and natural loss; engine unit fixtures and isolated browser state-exposure route for deterministic ten-level victory. No manual ten-level playthrough or backend API tests claimed.",
        resourcesClosed: true
    });
    console.log(JSON.stringify({ passed: errors.length === 0, assertions: results.length, errors, resourcesClosed: true }, null, 2));
}
