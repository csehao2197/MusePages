import assert from "node:assert/strict";
import path from "node:path";
import { cp, copyFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage as S } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "601-sci-fi-arena-wave-survival-game");
const state = await W.json(job.stateFile);
const pid = Number((await W.text(job.promptLock)).trim());
process.kill(pid, 0);
assert.equal(state.runId, job.runId);
assert.equal(state.activePrompt, job.prompt);
assert.equal(state.ownedLock.pid, pid);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
await mkdir(checks, { recursive: true });
const previous = await W.info(path.join(checks, "qa.json")) ? await W.json(path.join(checks, "qa.json")) : null;
for (const name of ["index.html", "style.css", "favicon.svg", "LICENSE", "NOTICE"])
{
    await copyFile(path.join(folder, name), path.join(exported, name));
}
for (const name of ["game", "fonts", "vendor"])
{
    await cp(path.join(folder, name), path.join(exported, name), { recursive: true });
}
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    startedAt: new Date().toISOString(),
    passed: false,
    sourceCheck: await S.checkSource(folder),
    staticDigest: await S.validateStaticOutput(exported, "sci-fi-arena-wave-survival-game", "GPT-6"),
    assertions: [],
    errors: [],
    consoleWarnings: [],
    viewports: [],
    visualReviewed: false,
    resourcesClosed: false,
    previousExecutions: previous ? [...(previous.previousExecutions || []),
    {
        startedAt: previous.startedAt,
        passed: previous.passed,
        assertionsPassed: previous.assertions?.length,
        failure: previous.failure?.message,
        note: "Retained earlier QA execution evidence; current assertions and outcome are authoritative. Test harness polling and single-shot cadence were made deterministic."
    }] : [],
    testMethod: "Actual Chromium keyboard, mouse, touch and gameplay, plus explicitly controlled in-memory fixtures for rule/occlusion/timer edge cases. No rule constants or game code are patched.",
    screenshots: {}
};
let server;
let browser;
const record = (name, evidence = true) => qa.assertions.push({ name, passed: true, evidence });
const get = (page, fn) => page.evaluate(async (source) =>
{
    const { game } = await import("./game/main.js");
    return new Function("g", `return (${source})(g)`)(game);
}, fn.toString());
const wait = async (page, fn, timeout = 12000) =>
{
    await page.evaluate(async () =>
    {
        window.__yardQA = (await import("./game/main.js")).game;
    });
    return page.waitForFunction((source) => new Function("g", `return (${source})(g)`)(window.__yardQA), fn.toString(), { timeout });
};
const noOverflow = async (page, name) =>
{
    const metrics = await page.evaluate(() => ({
        width: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        height: innerHeight
    }));
    assert.ok(metrics.document <= metrics.width && metrics.body <= metrics.width, JSON.stringify(metrics));
    record(name, metrics);
};
const watch = (page, label) =>
{
    page.on("pageerror", (error) => qa.errors.push({ viewport: label, type: "pageerror", text: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") qa.errors.push({ viewport: label, type: "console", text: message.text() });
        if (message.type() === "warning") qa.consoleWarnings.push({ viewport: label, text: message.text() });
    });
    page.on("requestfailed", (request) => qa.errors.push({ viewport: label, type: "requestfailed", url: request.url(), text: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) qa.errors.push({ viewport: label, type: "http", status: response.status(), url: response.url() });
    });
};
const shot = async (page, name) =>
{
    const file = path.join(checks, `${name}.png`);
    await page.screenshot({ path: file });
    qa.screenshots[name] = file;
};
const open = async (options, label, denyLock = false) =>
{
    const context = await browser.newContext({ deviceScaleFactor: 1, ...options });
    if (denyLock)
    {
        await context.addInitScript(() =>
        {
            HTMLCanvasElement.prototype.requestPointerLock = () => Promise.reject(new DOMException("Test fixture: pointer lock denied", "NotAllowedError"));
        });
    }
    const page = await context.newPage();
    watch(page, label);
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await wait(page, (g) => !!g.input || !!g.failed);
    assert.equal(await get(page, (g) => !!g.failed), false);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    qa.viewports.push({ label, ...options, status: response.status() });
    return { context, page };
};

try
{
    server = await startPreviewServer(exported, { workspace: root });
    qa.url = server.url;
    browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader"] });
    const { context: desktop, page } = await open({ viewport: { width: 1200, height: 900 } }, "desktop", true);
    assert.equal(await page.locator("canvas").count(), 1);
    assert.equal(await page.locator("h1").innerText(), "Lampwright");
    assert.equal(await get(page, (g) => g.drones.live.length), 1);
    record("Desktop live WebGL title, one hovering drone, fonts and English title");
    await noOverflow(page, "Desktop title has no horizontal overflow");
    await shot(page, "desktop");
    await page.getByRole("button", { name: "Sound on", exact: true }).click();
    assert.equal(await get(page, (g) => g.audio.enabled), false);
    await page.getByRole("button", { name: "Sound off", exact: true }).click();
    assert.equal(await get(page, (g) => g.audio.enabled), true);
    await page.mouse.click(10, 10);
    assert.equal(await get(page, (g) => g.state), "title");
    record("Sound toggle works; clicking outside title card does not start");
    await page.getByRole("button", { name: "Enter the yard", exact: true }).click();
    await wait(page, (g) => g.input.mode === "drag" && g.state === "playing");
    assert.equal(await page.locator("#fire").isVisible(), true);
    assert.equal(await page.locator("#move-stick").isVisible(), false);
    assert.equal(await page.locator(".hint").isVisible(), true);
    record("Rejected pointer-lock promise safely activates drag mode, hint and Fire/Reload");
    const zBefore = await get(page, (g) => g.player.position.z);
    await page.keyboard.down("w");
    await page.waitForTimeout(450);
    await page.keyboard.up("w");
    assert.ok(await get(page, (g) => g.player.position.z) < zBefore - 0.3);
    const yawBefore = await get(page, (g) => g.player.yaw);
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(250);
    await page.keyboard.up("ArrowRight");
    assert.ok(await get(page, (g) => g.player.yaw) < yawBefore - 0.05);
    record("Actual WASD movement and arrow-key looking");
    const dragBefore = await get(page, (g) => ({ yaw: g.player.yaw, ammo: g.weapon.ammo }));
    await page.mouse.move(900, 400);
    await page.mouse.down();
    await page.mouse.move(960, 420, { steps: 4 });
    await page.mouse.up();
    const dragAfter = await get(page, (g) => ({ yaw: g.player.yaw, ammo: g.weapon.ammo }));
    assert.ok(dragAfter.yaw < dragBefore.yaw - 0.08);
    assert.equal(dragAfter.ammo, dragBefore.ammo);
    record("Actual drag look changes camera without firing");
    await wait(page, (g) => g.drones.live.length === 3);
    const enemy = await get(page, (g) => ({
        position: g.drones.live[0].group.position.toArray(),
        shield: g.player.shield
    }));
    await page.waitForTimeout(400);
    const enemyAfter = await get(page, (g) => ({
        position: g.drones.live[0].group.position.toArray(),
        shield: g.player.shield
    }));
    assert.notDeepEqual(enemyAfter.position, enemy.position);
    record("Wave 1 actually spawns three drones and drones move", { before: enemy, after: enemyAfter });
    await wait(page, (g) => g.player.shield < 100);
    record("Actual enemy-fired projectiles hit and reduce shield", await get(page, (g) => ({ shield: g.player.shield, health: g.player.health })));
    await get(page, (g) => { g.player.pitch = -0.8; g.player.camera(); });
    await page.keyboard.down("f");
    await wait(page, (g) => g.weapon.ammo === 0);
    await page.keyboard.up("f");
    assert.equal(await page.locator("#ammo-number").innerText(), "0");
    assert.ok(await page.locator("#ammo-number").evaluate((element) => element.classList.contains("empty")));
    const dryEffects = await get(page, (g) =>
    {
        g.yard.clearEffects();
        g.weapon.cooldown = 0;
        g.weapon.shoot(g.drones);
        return { effects: g.yard.effects.length, cooldown: g.weapon.cooldown };
    });
    assert.equal(dryEffects.effects, 0);
    assert.equal(dryEffects.cooldown, 0.18);
    record("Actual held F empties 12-round magazine; dry fire produces no tracer", dryEffects);
    await page.keyboard.press("r");
    await wait(page, (g) => g.weapon.reloadRemaining > 0);
    assert.equal(await page.locator("#weapon-label").innerText(), "RELOADING");
    await page.keyboard.press("Escape");
    assert.equal(await get(page, (g) => g.state), "paused");
    const frozen = await get(page, (g) => ({
        clock: g.drones.clock, reload: g.weapon.reloadRemaining, health: g.player.health,
        bolts: g.drones.bolts.map((bolt) => bolt.mesh.position.toArray()),
        cells: g.pickups.cells.map((cell) => cell.timer), wave: g.waves.delay
    }));
    await page.waitForTimeout(400);
    assert.deepEqual(await get(page, (g) => ({
        clock: g.drones.clock, reload: g.weapon.reloadRemaining, health: g.player.health,
        bolts: g.drones.bolts.map((bolt) => bolt.mesh.position.toArray()),
        cells: g.pickups.cells.map((cell) => cell.timer), wave: g.waves.delay
    })), frozen);
    assert.equal(await page.locator(".hud").isVisible(), false);
    await noOverflow(page, "Desktop pause has no horizontal overflow");
    record("Esc pause freezes drone/bolt/reload/wave/cell clocks and hides HUD", frozen);
    await page.keyboard.press("Escape");
    await wait(page, (g) => g.weapon.ammo === 12 && g.weapon.reloadRemaining === 0);
    record("Esc resumes frozen round; reload completes to 12");
    await get(page, (g) =>
    {
        g.player.reset();
        g.weapon.reset();
        g.drones.reset();
        g.waves.start(1);
        for (const drone of g.drones.live) drone.fire = 100;
    });
    const healthSteps = [];
    for (let index = 0; index < 3; index++)
    {
        await get(page, (g) =>
        {
            const target = g.drones.live[0];
            const dx = target.group.position.x - g.player.position.x;
            const dy = target.group.position.y - g.player.position.y;
            const dz = target.group.position.z - g.player.position.z;
            g.player.yaw = Math.atan2(-dx, -dz);
            g.player.pitch = Math.atan2(dy, Math.hypot(dx, dz));
            g.player.kick = 0;
            g.player.camera();
            g.weapon.cooldown = 0;
        });
        await page.evaluate(() => new Promise((resolve) =>
        {
            requestAnimationFrame(() =>
            {
                window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyF" }));
                requestAnimationFrame(() =>
                {
                    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyF" }));
                    resolve();
                });
            });
        }));
        healthSteps.push(await get(page, (g) => ({ health: g.drones.live[0]?.health, dropped: g.drones.dropped, ammo: g.weapon.ammo })));
    }
    assert.deepEqual(healthSteps.map((step) => step.dropped), [0, 0, 1]);
    assert.equal(healthSteps[0].health, 66);
    assert.equal(healthSteps[1].health, 32);
    record("Controlled aim and single-frame browser F events raycast drone: 100 → 66 → 32 → destroyed, score +1", healthSteps);
    await shot(page, "desktop-gameplay");

    await page.keyboard.press("Escape");
    const fixtures = await get(page, (g) =>
    {
        const result = {};
        g.player.reset();
        g.player.shield = 10;
        g.player.damage();
        result.overflow = [g.player.shield, g.player.health];
        g.player.damage();
        result.invulnerable = [g.player.shield, g.player.health];
        g.player.reset();
        g.player.position.set(13.5, 1.65, 0);
        g.player.yaw = -Math.PI / 2;
        for (let index = 0; index < 20; index++) g.player.update(0.05, { move: { x: 0, y: -1 }, look: { x: 0, y: 0 } });
        result.perimeter = g.player.position.x;
        g.player.position.set(1.8, 1.65, 3.2);
        g.player.yaw = 0;
        for (let index = 0; index < 10; index++) g.player.update(0.05, { move: { x: 0, y: -1 }, look: { x: 0, y: 0 } });
        result.crate = g.player.position.toArray();
        for (let index = 0; index < 10; index++) g.player.update(0.05, { move: { x: 1, y: -1 }, look: { x: 0, y: 0 } });
        result.slide = g.player.position.toArray();
        const cell = g.pickups.cells[0];
        g.player.position.set(cell.mesh.position.x, 1.65, cell.mesh.position.z);
        g.pickups.reset();
        g.pickups.update(0, true);
        result.fullCell = [cell.mesh.visible, cell.timer];
        g.player.health = 30;
        g.pickups.update(0, true);
        result.pickup = [g.player.health, cell.mesh.visible, cell.timer];
        g.player.position.set(0, 1.65, 7.4);
        g.pickups.update(13.9, true);
        result.waitingCell = cell.mesh.visible;
        g.pickups.update(0.11, true);
        result.respawn = cell.mesh.visible;
        g.player.position.set(cell.mesh.position.x, 1.65, cell.mesh.position.z);
        g.player.health = 98;
        g.pickups.update(0, true);
        result.clamp = g.player.health;
        g.weapon.reset();
        g.weapon.reload();
        result.fullReload = g.weapon.reloadRemaining;
        g.weapon.ammo = 2;
        g.weapon.reload();
        const ammo = g.weapon.ammo;
        g.weapon.shoot(g.drones);
        result.fireDuringReload = [ammo, g.weapon.ammo];
        g.weapon.reset();
        const target = g.drones.live[0];
        g.player.position.set(7.2, 1.65, 7);
        target.group.position.set(7.2, 2.15, -1);
        target.health = 100;
        g.player.yaw = 0;
        g.player.pitch = Math.atan2(0.5, 8);
        g.player.kick = 0;
        g.player.camera();
        g.weapon.shoot(g.drones);
        result.occludedHealth = target.health;
        g.yard.clearEffects();
        return result;
    });
    assert.deepEqual(fixtures.overflow, [0, 92]);
    assert.deepEqual(fixtures.invulnerable, [0, 92]);
    assert.ok(fixtures.perimeter <= 13.64);
    assert.ok(fixtures.crate[2] >= 2.585);
    assert.ok(fixtures.slide[0] > fixtures.crate[0] + 1);
    assert.deepEqual(fixtures.fullCell, [true, 0]);
    assert.deepEqual(fixtures.pickup, [70, false, 14]);
    assert.equal(fixtures.waitingCell, false);
    assert.equal(fixtures.respawn, true);
    assert.equal(fixtures.clamp, 100);
    assert.equal(fixtures.fullReload, 0);
    assert.deepEqual(fixtures.fireDuringReload, [2, 2]);
    assert.equal(fixtures.occludedHealth, 100);
    record("Controlled actual mechanics: shield overflow/invulnerability, perimeter/crate sliding, full/pickup/14-second respawn/clamp, reload gates, crate-occluded shot", fixtures);

    const queue = await get(page, (g) =>
    {
        for (const drone of [...g.drones.live])
        {
            drone.title = false;
            for (let hit = 0; hit < 3; hit++) g.drones.damage(drone);
        }
        g.waves.start(5);
        for (let index = 0; index < 20; index++) g.waves.update(0.45);
        const result = { total: g.waves.total, live: g.drones.live.length, spawned: g.waves.spawned };
        const first = g.drones.live[0];
        for (let hit = 0; hit < 3; hit++) g.drones.damage(first);
        g.waves.update(0.44);
        result.beforeSlotDelay = g.waves.spawned;
        g.waves.update(0.02);
        result.afterSlotDelay = g.waves.spawned;
        for (let step = 0; step < 20 && !g.waves.clear; step++)
        {
            for (const drone of [...g.drones.live])
            {
                for (let hit = 0; hit < 3; hit++) g.drones.damage(drone);
            }
            g.waves.update(0.45);
        }
        result.clear = g.waves.clear;
        result.allSpawned = g.waves.spawned;
        g.waves.update(4.49);
        result.beforeBreather = g.waves.number;
        g.waves.update(0.02);
        result.nextWave = g.waves.number;
        result.nextTotal = g.waves.total;
        return result;
    });
    assert.deepEqual(queue, { total: 11, live: 8, spawned: 8, beforeSlotDelay: 8, afterSlotDelay: 9, clear: true, allSpawned: 11, beforeBreather: 5, nextWave: 6, nextTotal: 13 });
    record("Controlled wave 5/6: exact size, desktop live cap 8, queued spawn retained, 450ms slot delay, 4.5s breather, next wave", queue);
    await page.getByRole("button", { name: "Retry", exact: true }).click();
    await wait(page, (g) => g.state === "playing" && g.input.mode === "drag");
    const reset = await get(page, (g) => ({
        health: g.player.health, shield: g.player.shield, ammo: g.weapon.ammo,
        reload: g.weapon.reloadRemaining, wave: g.waves.number, dropped: g.drones.dropped,
        cells: g.pickups.cells.every((cell) => cell.mesh.visible && cell.timer === 0)
    }));
    assert.deepEqual(reset, { health: 100, shield: 100, ammo: 12, reload: 0, wave: 1, dropped: 0, cells: true });
    record("Pause Retry resets all round state and immediately starts wave 1", reset);
    await get(page, (g) =>
    {
        g.player.shield = 0;
        g.player.health = 18;
        g.player.invulnerable = 0;
        const drone = g.drones.live[0];
        drone.group.position.copy(g.player.position).add({ x: 0, y: 0, z: -1 });
        drone.fire = 100;
        g.drones.fire(drone);
    });
    await wait(page, (g) => g.state === "gameover");
    assert.equal(await page.getByRole("heading", { name: "Yard lost" }).isVisible(), true);
    assert.equal(await page.locator(".hud").isVisible(), false);
    assert.equal(await page.locator("#fire").isVisible(), false);
    assert.equal(await get(page, (g) => g.player.health), 0);
    await page.keyboard.press("Escape");
    assert.equal(await get(page, (g) => g.state), "gameover");
    record("Real moving bolt collision at 18 health causes game over; controls hide and Esc cannot resume");
    const lostClock = await get(page, (g) => g.drones.clock);
    await page.waitForTimeout(250);
    assert.equal(await get(page, (g) => g.drones.clock), lostClock);
    record("Game-over simulation clock remains frozen");
    await page.getByRole("button", { name: "Retry", exact: true }).click();
    await wait(page, (g) => g.state === "playing" && g.player.health === 100);
    await noOverflow(page, "Desktop after gameplay/gameover/retry has no horizontal overflow");
    record("Game-over Retry actually restarts playable round");
    await desktop.close();

    const { context: mobile, page: phone } = await open({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }, "mobile");
    await noOverflow(phone, "Mobile title has no horizontal overflow");
    await shot(phone, "mobile");
    await phone.getByRole("button", { name: "Enter the yard", exact: true }).tap();
    await wait(phone, (g) => g.state === "playing" && g.input.mode === "touch");
    for (const id of ["move-stick", "look-stick", "fire", "reload"])
    {
        assert.equal(await phone.locator(`#${id}`).isVisible(), true);
    }
    assert.equal(await phone.evaluate(() => document.pointerLockElement === null), true);
    const touchBefore = await get(phone, (g) => ({ z: g.player.position.z, yaw: g.player.yaw, ammo: g.weapon.ammo }));
    const cdp = await mobile.newCDPSession(phone);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 72, y: 772, id: 1 }, { x: 318, y: 772, id: 2 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 72, y: 738, id: 1 }, { x: 352, y: 772, id: 2 }] });
    await phone.waitForTimeout(400);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 72, y: 738, id: 1 }, { x: 352, y: 772, id: 2 }, { x: 318, y: 594, id: 3 }] });
    await wait(phone, (g) => g.weapon.ammo <= 9);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    const touchAfter = await get(phone, (g) => ({ z: g.player.position.z, yaw: g.player.yaw, ammo: g.weapon.ammo }));
    assert.ok(touchAfter.z < touchBefore.z - 0.1);
    assert.ok(touchAfter.yaw < touchBefore.yaw - 0.1);
    assert.ok(touchAfter.ammo <= 9);
    record("Actual Chromium simultaneous multi-touch: left movement, right aiming and held Fire", { before: touchBefore, after: touchAfter });
    await phone.getByRole("button", { name: "Reload", exact: true }).tap();
    await wait(phone, (g) => g.weapon.reloadRemaining > 0);
    await wait(phone, (g) => g.weapon.reloadRemaining === 0 && g.weapon.ammo === 12);
    await shot(phone, "mobile-gameplay");
    await phone.getByRole("button", { name: "Pause", exact: true }).tap();
    assert.equal(await get(phone, (g) => g.state), "paused");
    const mobileCap = await get(phone, (g) =>
    {
        for (const drone of [...g.drones.live])
        {
            drone.title = false;
            for (let hit = 0; hit < 3; hit++) g.drones.damage(drone);
        }
        g.waves.start(3);
        for (let index = 0; index < 20; index++) g.waves.update(0.45);
        return { total: g.waves.total, live: g.drones.live.length, spawned: g.waves.spawned };
    });
    assert.deepEqual(mobileCap, { total: 7, live: 4, spawned: 4 });
    await phone.getByRole("button", { name: "Resume", exact: true }).tap();
    assert.equal(await get(phone, (g) => g.state), "playing");
    record("Mobile actual Reload/Pause/Resume; controlled wave-3 live cap 4 with queue retained", mobileCap);
    await noOverflow(phone, "Mobile after multi-touch/reload/pause/resume has no horizontal overflow");
    await mobile.close();

    const { context: reducedContext, page: calm } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }, "desktop-1440-reduced", true);
    const stillBefore = await get(calm, (g) => ({ y: g.drones.live[0].group.position.y, cells: g.pickups.cells.map((cell) => cell.mesh.rotation.y) }));
    await calm.waitForTimeout(400);
    assert.deepEqual(await get(calm, (g) => ({ y: g.drones.live[0].group.position.y, cells: g.pickups.cells.map((cell) => cell.mesh.rotation.y) })), stillBefore);
    await calm.getByRole("button", { name: "Enter the yard", exact: true }).click();
    await wait(calm, (g) => g.state === "playing");
    const reducedEvidence = await get(calm, (g) =>
    {
        g.player.update(0.05, { move: { x: 0, y: -1 }, look: { x: 0, y: 0 } });
        g.weapon.shoot(g.drones);
        g.weapon.update(0.01, false, g.drones);
        return { cameraY: g.yard.camera.position.y, roll: g.yard.camera.rotation.z, weaponZ: g.weapon.mesh.position.z, muzzle: g.weapon.muzzle.intensity };
    });
    assert.deepEqual(reducedEvidence, { cameraY: 1.65, roll: 0, weaponZ: -0.52, muzzle: 0 });
    record("Reduced-motion actual rendering: no title/cell bob/spin, camera bob/roll, weapon kick or muzzle light", reducedEvidence);
    await noOverflow(calm, "1440px reduced-motion gameplay has no horizontal overflow");
    await reducedContext.close();

    const { context: normalContext, page: normal } = await open({ viewport: { width: 1200, height: 900 } }, "native-pointer-lock");
    await normal.getByRole("button", { name: "Enter the yard", exact: true }).click();
    await normal.waitForTimeout(500);
    const actualLock = await get(normal, (g) => ({ mode: g.input.mode, locked: document.pointerLockElement === g.yard.canvas }));
    assert.ok(actualLock.locked || actualLock.mode === "drag");
    record("Unmodified native pointer-lock start works or safely falls back in headless browser", actualLock);
    await normal.keyboard.press("Escape");
    await wait(normal, (g) => g.state === "paused");
    await normalContext.close();

    const { context: embedContext, page: host } = await open({ viewport: { width: 1200, height: 900 } }, "sandbox-host");
    await embedContext.route(`${new URL(server.url).origin}/**`, async (route) =>
    {
        const response = await route.fetch();
        await route.fulfill({ response, headers: { ...response.headers(), "access-control-allow-origin": "*" } });
    });
    await host.evaluate((url) =>
    {
        const iframe = document.createElement("iframe");
        iframe.sandbox = "allow-scripts";
        iframe.src = url;
        iframe.id = "sandbox-test";
        Object.assign(iframe.style, { position: "fixed", inset: "0", width: "100%", height: "100%", border: "0", zIndex: "100" });
        document.body.append(iframe);
    }, server.url);
    const handle = await host.locator("#sandbox-test").elementHandle();
    const frame = await handle.contentFrame();
    await frame.getByRole("button", { name: "Enter the yard", exact: true }).click();
    await wait(frame, (g) => g.state === "playing" && g.input.mode === "drag");
    assert.equal(await frame.locator("#fire").isVisible(), true);
    assert.equal(await frame.evaluate(() => document.pointerLockElement === null), true);
    await host.keyboard.down("f");
    await wait(frame, (g) => g.weapon.ammo < 12);
    await host.keyboard.up("f");
    record("Actual allow-scripts-only opaque sandbox plays with drag/Fire fallback; QA emulates required CORS asset-host headers");
    const hiddenClock = await get(frame, (g) => g.drones.clock);
    await frame.evaluate(() =>
    {
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
    });
    const hiddenStart = await get(frame, (g) => g.drones.clock);
    await host.waitForTimeout(300);
    assert.equal(await get(frame, (g) => g.drones.clock), hiddenStart);
    await frame.evaluate(() =>
    {
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
    });
    record("Controlled document.hidden visibility fixture freezes simulation clocks", { before: hiddenClock, hidden: hiddenStart });
    await embedContext.close();
    assert.deepEqual(qa.errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.failure = { message: error.message, stack: error.stack };
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    qa.resourcesClosed = true;
    qa.completedAt = new Date().toISOString();
    await W.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, failure: qa.failure, warnings: qa.consoleWarnings.length, resourcesClosed: qa.resourcesClosed }, null, 2));
}
