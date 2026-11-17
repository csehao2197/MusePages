import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const results = [];
const errors = [];
const contexts = [];
let browser;
let server;
let failure;
let resourcesClosed = false;

function record(name, evidence)
{
    results.push({ name, passed: true, evidence });
    console.log(`PASS ${name}`);
}

function observe(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (entry) =>
    {
        if (entry.type() === "error") errors.push(`console: ${entry.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
}

async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() =>
    ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${label}: ${JSON.stringify(dimensions)}`);
    record(`No horizontal overflow: ${label}`, dimensions);
}

async function activeMission(page)
{
    return page.evaluate(() => JSON.parse(JSON.stringify(missions[mode][level])));
}

// Breadth-first planning includes direction, stars and supplies; only UI actions execute the plan.
function solve(current, robot)
{
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    const fullMask = (1 << current.stars.length) - 1;
    const initial = { x: current.start[0], y: current.start[1], f: 0, mask: 0, supply: !current.supply, route: [] };
    const queue = [initial];
    const visited = new Set();
    for (let cursor = 0; cursor < queue.length; cursor++)
    {
        const state = queue[cursor];
        const key = [state.x, state.y, state.f, state.mask, state.supply].join();
        if (visited.has(key)) continue;
        visited.add(key);
        if (state.x === current.goal[0] && state.y === current.goal[1] && state.mask === fullMask && state.supply)
        {
            return state.route;
        }
        if (robot && state.route.length >= 24) continue;
        const choices = robot ? ["F", "L", "R"] : ["up", "right", "down", "left"];
        for (const command of choices)
        {
            const next = { ...state, route: [...state.route, command] };
            if (robot && command !== "F")
            {
                next.f = (state.f + (command === "L" ? 3 : 1)) % 4;
            }
            else
            {
                const direction = robot ? state.f : choices.indexOf(command);
                next.x += directions[direction][0];
                next.y += directions[direction][1];
                if (next.x < 0 || next.x > 5 || next.y < 0 || next.y > 5 ||
                    current.blocks.some(([x, y]) => next.x === x && next.y === y)) continue;
                current.stars.forEach(([x, y], index) =>
                {
                    if (next.x === x && next.y === y) next.mask |= 1 << index;
                });
                if (current.supply && next.x === current.supply[0] && next.y === current.supply[1]) next.supply = true;
            }
            queue.push(next);
        }
    }
    throw Error(`Mission is not solvable within its execution bound: ${current.name}`);
}

async function program(page, route)
{
    for (const command of route)
    {
        await page.locator(`[data-command="${command}"]`).click();
    }
    await page.locator("#run").click();
    await page.waitForFunction(() => !running, { timeout: 12000 });
}

try
{
    assert.equal(await StaticHomepage.checkSource(folder), "html");
    const digest = await StaticHomepage.validateStaticOutput(exported, "drone-and-robot-coding-lessons", "GPT-6");
    record("Source and independent static resource validation", { digest, finalSubpath: "/pages/drone-and-robot-coding-lessons/GPT-6/index.html" });
    server = await startPreviewServer(exported, { workspace });
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    contexts.push(desktop);
    const page = await desktop.newPage();
    observe(page);
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.locator(".player img").waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.locator("body").innerText().then((text) => text.length > 1000));
    assert.equal(await page.locator(".cell").count(), 36);
    assert.equal(await page.locator(".star").count(), 3);
    assert.equal(await page.locator(".obstacle").count(), 4);
    record("HTTP 200 and meaningful visible simulator", { cells: 36, stars: 3, obstacles: 4, title: await page.title() });
    await noOverflow(page, "desktop initial 1200×900 DPR1");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.locator("#arena").focus();
    await page.keyboard.press("ArrowLeft");
    assert.match(await page.locator("#feedback").innerText(), /Boundary/);
    assert.equal(await page.locator("#position").innerText(), "01 : 06");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    assert.equal(await page.locator("#star-count").innerText(), "1 / 3");
    await page.keyboard.press("ArrowRight");
    assert.match(await page.locator("#feedback").innerText(), /Obstacle/);
    assert.equal(await page.locator("#position").innerText(), "02 : 05");
    record("Keyboard drone movement, boundary, collection and collision", { position: "02 : 05", collected: 1, blockedPositionUnchanged: true });
    await page.locator("#craft").selectOption("vector");
    assert.equal(await page.locator(".player.vector").count(), 1);
    await page.locator("#reset").click();
    assert.equal(await page.locator("#star-count").innerText(), "0 / 3");
    assert.equal(await page.locator("#moves").innerText(), "00");
    record("Craft choice and reset restore real game state", "Vector changes appearance; reset clears stars, moves and position.");
    for (const command of ["up", "up", "up", "up", "up", "right", "right", "right", "right", "right"])
    {
        await page.locator(`[data-move="${command}"]`).click();
    }
    assert.match(await page.locator("#feedback").innerText(), /Collect every star/);
    assert.equal(await page.locator(".feedback.success").count(), 0);
    record("Landing without all stars is rejected", "Visited goal; completion did not trigger.");
    for (let index = 0; index < 6; index++)
    {
        await page.locator(`[data-level="${index}"]`).click();
        const current = await activeMission(page);
        const route = solve(current, false);
        for (const command of route)
        {
            await page.locator(`[data-move="${command}"]`).click();
        }
        assert.match(await page.locator("#feedback").innerText(), /Mission complete/);
        assert.equal(await page.locator("#star-count").innerText(), "3 / 3");
        record(`Drone mission ${index + 1} actually completed`, { commands: route.length, collected: 3 });
    }
    assert.equal(await page.locator("#progress-count").innerText(), "6 of 6 completed");
    await page.locator("#drone-tab").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#robot-tab").getAttribute("aria-selected"), "true");
    assert.equal(await page.locator("#run").isDisabled(), true);
    await page.locator('[data-command="L"]').click();
    await page.locator('[data-command="R"]').click();
    await page.locator("#undo").click();
    assert.equal(await page.locator("#command-count").innerText(), "1 / 24");
    await page.locator("#run").click();
    await page.waitForFunction(() => !running);
    assert.match(await page.locator(".cell:has(.player)").getAttribute("aria-label"), /west/);
    assert.equal(await page.locator("#position").innerText(), "01 : 06");
    assert.equal(await page.locator("#moves").innerText(), "00");
    await page.locator("#clear").click();
    assert.equal(await page.locator("#run").isDisabled(), true);
    record("Keyboard tabs, real orientation, Undo, Clear and empty-program gate", "Left rotates to west without translating.");
    for (let index = 0; index < 24; index++) await page.locator('[data-command="R"]').click();
    assert.equal(await page.locator('[data-command="F"]').isDisabled(), true);
    assert.equal(await page.locator("#command-count").innerText(), "24 / 24");
    await page.locator("#clear").click();
    await program(page, ["L", "F"]);
    assert.match(await page.locator("#feedback").innerText(), /stopped at step 2/);
    assert.equal(await page.locator("#position").innerText(), "01 : 06");
    record("24-command bound and robot boundary stop", "No unbounded code or movement; a blocked Forward ends playback.");
    await page.locator("#clear").click();
    await program(page, ["R", "F", "F", "L", "F"]);
    assert.match(await page.locator("#feedback").innerText(), /stopped at step 5/);
    assert.equal(await page.locator("#position").innerText(), "03 : 06");
    record("Robot obstacle collision stops the actual program", "Attempted forward into block at column 3, row 5.");
    await page.locator("#clear").click();
    for (let index = 0; index < 10; index++) await page.locator('[data-command="R"]').click();
    await page.locator("#run").click();
    assert.equal(await page.locator('[data-command="F"]').isDisabled(), true);
    await page.locator("#reset").click();
    await page.waitForTimeout(500);
    assert.equal(await page.locator("#position").innerText(), "01 : 06");
    assert.match(await page.locator(".cell:has(.player)").getAttribute("aria-label"), /north/);
    assert.equal(await page.locator("#run").isEnabled(), true);
    record("Reset cancels in-flight program without stale callbacks", "North facing and start position persist after an execution delay.");
    await page.locator('[data-level="5"]').click();
    await program(page, ["R", "F", "F", "F"]);
    assert.match(await page.locator("#feedback").innerText(), /Collect every star/);
    assert.equal(await page.locator(".feedback.success").count(), 0);
    await page.locator("#clear").click();
    const noSupply = ["F", "F", "R", "F", "L", "F", "R", "F", "F", "F", "R", "F", "F", "R", "F", "L", "F"];
    // End at the pad with both stars, deliberately bypassing the supply at x=4,y=5.
    await program(page, noSupply);
    assert.equal(await page.locator("#star-count").innerText(), "2 / 2");
    assert.match(await page.locator("#feedback").innerText(), /supply crate comes first/i);
    assert.equal(await page.locator(".feedback.success").count(), 0);
    record("Mission 6 enforces supplies before completion", { stars: 2, supplies: false, completionRejected: true });
    for (let index = 0; index < 6; index++)
    {
        await page.locator(`[data-level="${index}"]`).click();
        const current = await activeMission(page);
        const route = solve(current, true);
        assert.ok(route.length <= 24);
        await program(page, route);
        assert.match(await page.locator("#feedback").innerText(), /Mission complete/);
        if (index === 5)
        {
            assert.equal(await page.locator("#obstacle-objective").innerText(), "Supply crate collected");
        }
        record(`Robot mission ${index + 1} actually programmed and completed`, { commands: route.length, stars: current.stars.length, supplies: Boolean(current.supply) });
    }
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("#progress-count").innerText(), "6 of 6 completed");
    await page.locator("#robot-tab").click();
    assert.equal(await page.locator("#progress-count").innerText(), "6 of 6 completed");
    record("All 12 completions persist across reload", "Actual localStorage progress is reflected in both mission libraries.");
    await page.getByRole("button", { name: "Open field guide", exact: true }).click();
    assert.equal(await page.locator("#guide").isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#guide").isVisible(), false);
    record("Accessible guide opens and closes with Escape", "Native dialog with real instructions and sandbox disclosure.");
    await noOverflow(page, "desktop after all mission interactions");

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    contexts.push(mobile);
    const phone = await mobile.newPage();
    observe(phone);
    assert.equal((await phone.goto(server.url, { waitUntil: "networkidle" })).status(), 200);
    await noOverflow(phone, "mobile initial 390×844 DPR1");
    assert.equal(await phone.locator("#mobile-controls .controls").count(), 1);
    await phone.locator(".arena-wrap").evaluate((element) => element.scrollIntoView({ block: "start" }));
    const boardAndControl = await phone.evaluate(() =>
    ({
        boardTop: document.querySelector("#arena").getBoundingClientRect().top,
        controlBottom: document.querySelector('[data-move="down"]').getBoundingClientRect().bottom
    }));
    assert.ok(boardAndControl.boardTop >= 0 && boardAndControl.controlBottom <= 844);
    record("Mobile grid and flight controls visible together", boardAndControl);
    await phone.evaluate(() => window.scrollTo(0, 0));
    await phone.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    await phone.locator('[data-move="right"]').tap();
    await phone.locator('[data-move="up"]').tap();
    assert.equal(await phone.locator("#star-count").innerText(), "1 / 3");
    await phone.locator("#robot-tab").tap();
    for (const command of solve(await activeMission(phone), true))
    {
        await phone.locator(`[data-command="${command}"]`).tap();
    }
    await phone.locator("#run").tap();
    await phone.waitForFunction(() => !running);
    assert.match(await phone.locator("#feedback").innerText(), /Mission complete/);
    await noOverflow(phone, "mobile after touch drone and programmed robot");
    record("Mobile actual touch controls and full robot mission", { viewport: { width: 390, height: 844 }, droneCollected: 1, robotCompleted: true });
    await phone.getByRole("button", { name: "Open field guide", exact: true }).tap();
    assert.equal(await phone.locator("#guide").isVisible(), true);
    await noOverflow(phone, "mobile with field guide");
    await phone.locator("#start-learning").tap();
    await phone.locator("#switch-path").tap();
    assert.equal(await phone.locator("#drone-tab").getAttribute("aria-selected"), "true");
    record("Mobile field guide and cross-path navigation", "Touch input works without hover.");
    for (const width of [320, 768, 1440])
    {
        await phone.setViewportSize({ width, height: 900 });
        await noOverflow(phone, `responsive width ${width}`);
    }
    const restricted = await browser.newContext({ viewport: { width: 390, height: 844 } });
    contexts.push(restricted);
    await restricted.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage unavailable"); } });
    });
    const noStorage = await restricted.newPage();
    observe(noStorage);
    await noStorage.goto(server.url, { waitUntil: "networkidle" });
    await noStorage.locator('[data-move="right"]').click();
    assert.equal(await noStorage.locator("#moves").innerText(), "01");
    assert.equal(await noStorage.locator("#save-label").innerText(), "Progress available this session only");
    record("Unavailable storage degrades safely", "Simulation works; UI truthfully says session-only progress.");
    assert.deepEqual(errors, []);
    record("No HTTP, request, console or page errors", { errors: [] });
}
catch (error)
{
    failure = error.stack;
    console.error(failure);
}
finally
{
    for (const context of contexts) await context.close();
    if (browser) await browser.close();
    if (server) await server.close();
    resourcesClosed = true;
    const digest = await StaticHomepage.validateStaticOutput(exported, "drone-and-robot-coding-lessons", "GPT-6");
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
    {
        passed: !failure && errors.length === 0,
        timestamp: new Date().toISOString(),
        modelId: "gpt-6.1-sol",
        staticDigest: digest,
        results,
        errors,
        failure: failure || null,
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1, hasTouch: true }],
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
        visualReviewed: false,
        resourcesClosed
    });
}
if (failure) process.exitCode = 1;
