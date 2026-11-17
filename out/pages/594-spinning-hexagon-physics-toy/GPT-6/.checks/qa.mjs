import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { createWorld, step, edges, setCount, shake, queueShake, reset, pairContact, wallContact, R, BASE_STEP } from "../out/physics.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = process.cwd();
const report = { passed: false, visualReviewed: false, assertions: [], errors: [], viewports: [],
    screenshots: [path.join(root, ".checks", "desktop.png"), path.join(root, ".checks", "mobile.png")],
    resourcesClosed: false };
let browser;
let service;
function check(name, condition)
{
    assert.ok(condition, name);
    report.assertions.push(name);
}
function invariant(world)
{
    let minWall = Infinity;
    let maxOverlap = 0;
    const boundary = edges(world.angle);
    for (let i = 0; i < world.balls.length; i++)
    {
        const b = world.balls[i];
        assert.ok([b.x, b.y, b.vx, b.vy, b.angle, b.omega].every(Number.isFinite));
        assert.ok(Math.hypot(b.vx, b.vy) <= 1800.00001 && Math.abs(b.omega) <= 24.00001);
        for (const e of boundary) minWall = Math.min(minWall, (b.x - e.x) * e.nx + (b.y - e.y) * e.ny - R);
        for (let j = i + 1; j < world.balls.length; j++)
        {
            maxOverlap = Math.max(maxOverlap, 2 * R - Math.hypot(b.x - world.balls[j].x, b.y - world.balls[j].y));
        }
    }
    assert.ok(minWall > -0.0001, `Disk escaped: ${minWall}`);
    assert.ok(world.particles.length <= 120);
    return { minWall, maxOverlap };
}
async function noOverflow(page, name)
{
    check(name, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}
async function input(page, name, value)
{
    await page.locator(`#${name}`).evaluate((element, next) =>
    {
        element.value = String(next);
        element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
}
async function state(page)
{
    return page.evaluate(() =>
    ({
        running: window.__toy.running,
        angle: window.__toy.world.angle,
        balls: window.__toy.world.balls.map(b => ({ ...b })),
        pending: window.__toy.world.pendingShake.length,
        gravity: window.__toy.world.gravity,
        spin: window.__toy.world.spin,
        friction: window.__toy.world.friction,
        slow: window.__toy.world.slow,
        particles: window.__toy.world.particles.map(p => ({ ...p })),
        count: window.__toy.world.count
    }));
}
try
{
    const original = createWorld(true);
    check("Initial deterministic, nonoverlapping 20 numbered disks", original.balls.length === 20 &&
        original.balls.every((b, i) => b.id === i + 1) && invariant(original).maxOverlap === 0 &&
        JSON.stringify(original.balls) === JSON.stringify(createWorld(true).balls));
    const free = createWorld(true);
    free.gravity = 0;
    free.spin = 0;
    free.friction = 0;
    const freeBefore = { ...free.balls[0] };
    step(free);
    check("Zero gravity/spin preserve free motion with exponential air damping",
        free.angle === -Math.PI / 6 && Math.abs(free.balls[0].vx - freeBefore.vx * Math.exp(-0.1 * BASE_STEP)) < 1e-8 &&
        Math.abs(free.balls[0].vy - freeBefore.vy * Math.exp(-0.1 * BASE_STEP)) < 1e-8);
    const gravity = createWorld(true);
    gravity.balls = [{ ...gravity.balls[0], x: 500, y: 400, vx: 0, vy: 0, omega: 0 }];
    gravity.count = 1;
    step(gravity);
    check("Gravity produces real downward acceleration", gravity.balls[0].vy > 3.7 && gravity.balls[0].y > 400);
    const contactWorld = createWorld(true);
    contactWorld.friction = 0.4;
    const a = { ...original.balls[0], x: 450, y: 500, vx: 120, vy: 50, omega: 0 };
    const b = { ...original.balls[1], x: 503, y: 500, vx: -120, vy: -30, omega: 0 };
    const momentum = [a.vx + b.vx, a.vy + b.vy];
    pairContact(contactWorld, a, b);
    check("Glancing disk collision conserves linear momentum and transfers angular impulse",
        Math.abs(a.vx + b.vx - momentum[0]) < 1e-8 && Math.abs(a.vy + b.vy - momentum[1]) < 1e-8 &&
        Math.abs(a.omega) > 0.01 && Math.abs(b.omega) > 0.01);
    a.vx = -50;
    b.vx = 50;
    const separating = [a.vx, b.vx];
    pairContact(contactWorld, a, b);
    check("Separating disks receive no attractive normal impulse", a.vx === separating[0] && b.vx === separating[1]);
    const wall = edges(-Math.PI / 6)[0];
    const makeContact = () => ({ ...original.balls[0], x: wall.x + 150 * (-wall.ny) + 26 * wall.nx,
        y: wall.y + 150 * wall.nx + 26 * wall.ny, vx: -200 * wall.nx, vy: -200 * wall.ny, omega: 0 });
    const staticBall = makeContact();
    const movingBall = makeContact();
    contactWorld.spin = 0;
    wallContact(contactWorld, staticBall, wall, 0, BASE_STEP);
    contactWorld.spin = 120;
    wallContact(contactWorld, movingBall, wall, 0, BASE_STEP);
    check("Rotating-wall contact velocity changes real collision outcome",
        Math.hypot(movingBall.vx - staticBall.vx, movingBall.vy - staticBall.vy) > 1);
    const frictionless = makeContact();
    frictionless.vy += 100;
    contactWorld.friction = 0;
    wallContact(contactWorld, frictionless, wall, 0, BASE_STEP);
    check("Zero friction applies no wall spin impulse", frictionless.omega === 0);
    const garnish = createWorld(false);
    garnish.spin = 0;
    wallContact(garnish, makeContact(), wall, 0, BASE_STEP);
    const firstParticleCount = garnish.particles.length;
    wallContact(garnish, makeContact(), wall, 0, BASE_STEP);
    check("Energetic contact emits three short-lived particles with per-contact cooldown",
        firstParticleCount === 3 && garnish.particles.length === 3 &&
        garnish.particles.every(p => p.life >= 0.18 && p.life < 0.38));
    const reducedContact = createWorld(true);
    wallContact(reducedContact, makeContact(), wall, 0, BASE_STEP);
    check("Reduced-motion preference disables confetti even on energetic contact", reducedContact.particles.length === 0);
    const coincidentA = { ...original.balls[0], x: 500, y: 500 };
    const coincidentB = { ...original.balls[1], x: 500, y: 500 };
    pairContact(contactWorld, coincidentA, coincidentB);
    check("Coincident disk centers resolve using a finite deterministic normal",
        [coincidentA.x, coincidentA.y, coincidentB.x, coincidentB.y].every(Number.isFinite) &&
        Math.hypot(coincidentA.x - coincidentB.x, coincidentA.y - coincidentB.y) > 53.9);
    const counted = createWorld(true);
    const lowIDs = JSON.stringify(counted.balls.slice(0, 4));
    setCount(counted, 40);
    check("40 disks spawn inside the current polygon without overlap", counted.balls.length === 40 && invariant(counted).maxOverlap === 0);
    setCount(counted, 4);
    check("Count changes retain exact low-ID body states", JSON.stringify(counted.balls) === lowIDs);
    reset(counted);
    check("Reset restores deterministic cluster", JSON.stringify(counted.balls) === JSON.stringify(original.balls));
    queueShake(counted);
    const queuedVelocities = counted.pendingShake;
    check("Queued shake stores the specified independent impulse ranges", queuedVelocities.length === 20 &&
        queuedVelocities.every(p => p.vx >= -500 && p.vx <= 500 && p.vy <= -350 && p.vy >= -750 &&
            p.omega >= -8 && p.omega <= 8) &&
        new Set(queuedVelocities.map(p => p.vx)).size === 20);
    setCount(counted, 4);
    setCount(counted, 20);
    check("Removed disks do not pass queued impulses to newly spawned replacement IDs", counted.pendingShake.length === 4);
    const stress = createWorld(false);
    setCount(stress, 40);
    const scenarios =
    [
        { gravity: 2, friction: 0, spin: 120 },
        { gravity: 2, friction: 0.8, spin: -120 },
        { gravity: 0, friction: 0, spin: -120 },
        { gravity: 2, friction: 0.8, spin: 0 }
    ];
    const stability = [];
    for (const scenario of scenarios)
    {
        Object.assign(stress, scenario);
        let minWall = Infinity;
        let maxOverlap = 0;
        for (let tick = 0; tick < 7200; tick++)
        {
            if (tick % 1200 === 0) shake(stress);
            step(stress);
            const result = invariant(stress);
            minWall = Math.min(minWall, result.minWall);
            maxOverlap = Math.max(maxOverlap, result.maxOverlap);
        }
        stability.push({ ...scenario, seconds: 30, minWall, maxOverlap, finalOverlap: invariant(stress).maxOverlap });
    }
    report.stability = { scenarios: stability, simulatedSeconds: 120, maxMicrosteps: stress.maxMicrosteps,
        maximumAnticipatedTranslation: stress.maxTranslation, invalidStates: stress.invalidStates,
        contacts: stress.collisionCount, particleCount: stress.particles.length };
    check("120 simulated seconds, 40 balls, extreme spin/friction/gravity: finite, capped and contained",
        stress.invalidStates === 0 && stress.maxMicrosteps <= 16 && stress.maxTranslation <= 0.35 * R &&
        stability.every(s => s.finalOverlap < 0.5 && s.maxOverlap < 3));
    const settle = createWorld(true);
    settle.spin = 0;
    for (let tick = 0; tick < 7200; tick++) step(settle);
    const meanSpeed = settle.balls.reduce((sum, ball) => sum + Math.hypot(ball.vx, ball.vy), 0) / 20;
    report.settling = { simulatedSeconds: 30, meanSpeed, ...invariant(settle) };
    check("Stationary-wall pile settles without perpetual energetic jitter", meanSpeed < 8 && invariant(settle).maxOverlap < 1);
    report.sourceType = await StaticHomepage.checkSource(root);
    report.staticDigest = await StaticHomepage.validateStaticOutput(path.join(root, "out"), "spinning-hexagon-physics-toy", "GPT-6");
    check("Independent static output and final public model subpath pass repository validation", Boolean(report.staticDigest));
    service = await startPreviewServer(path.join(root, "out"), { workspace });
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    function attach(page)
    {
        page.on("pageerror", error => report.errors.push(`page: ${error.message}`));
        page.on("console", message => { if (message.type() === "error") report.errors.push(`console: ${message.text()}`); });
        page.on("requestfailed", request => report.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response => { if (response.status() >= 400) report.errors.push(`http: ${response.status()} ${response.url()}`); });
    }
    const page = await desktop.newPage();
    attach(page);
    const response = await page.goto(`${service.url}?qa`, { waitUntil: "networkidle" });
    check("Homepage HTTP succeeds and renders meaningful visible content", response.status() === 200 &&
        await page.locator("canvas").isVisible() &&
        (await page.locator("h1").innerText()).replace(/\s+/g, " ").trim() === "Give chaos a little spin.");
    await noOverflow(page, "Desktop has no initial horizontal overflow");
    check("All tuning ranges, count buttons, presets and transport meet 44px target height",
        await page.locator('.control input, .count-actions button, .presets button, .transport button').evaluateAll(elements =>
            elements.every(element => element.getBoundingClientRect().height >= 44)));
    check("Tuning controls remain inside the fixed-height card without clipping",
        await page.locator("#reset").evaluate(element => element.getBoundingClientRect().bottom <=
            document.querySelector("#tuning").getBoundingClientRect().bottom));
    await page.locator("#pause").click();
    const frozen = await state(page);
    await page.waitForTimeout(200);
    check("Pause freezes every disk and wall", JSON.stringify(frozen) === JSON.stringify(await state(page)));
    await page.locator("#shake").click();
    const queued = await state(page);
    check("Paused shake stores per-disk impulses without moving bodies", queued.pending === 20 &&
        JSON.stringify(queued.balls) === JSON.stringify(frozen.balls) &&
        (await page.locator("#announcement").innerText()).includes("resume") &&
        (await page.locator("#feedback").innerText()).includes("resume"));
    await page.locator("#pause").click();
    await page.waitForTimeout(100);
    check("Resume releases the stored shake", (await state(page)).pending === 0 &&
        JSON.stringify((await state(page)).balls) !== JSON.stringify(queued.balls));
    await page.locator("#pause").click();
    const preserved = (await state(page)).balls.slice(0, 4);
    for (const [name, extremes] of [["gravity", [0, 2]], ["friction", [0, 0.8]], ["spin", [-120, 0, 120]], ["count", [4, 40]]])
    {
        for (const value of extremes)
        {
            await input(page, name, value);
            check(`Native ${name} range applies ${value}`, (await state(page))[name] === value);
        }
    }
    check("All ranges preserve retained body positions while paused",
        JSON.stringify((await state(page)).balls.slice(0, 4)) === JSON.stringify(preserved));
    check("Maximum count reports the actual 40 disks", (await state(page)).balls.length === 40 &&
        await page.locator("#count-value").innerText() === "40");
    await page.locator("#fewer").click();
    check("Count minus is functional", (await state(page)).count === 39);
    await page.locator("#more").click();
    check("Count plus clamps at 40", (await state(page)).count === 40 && await page.locator("#more").isDisabled());
    await input(page, "count", 4);
    check("Count minus clamps at 4", await page.locator("#fewer").isDisabled());
    await page.locator("#slow").click();
    for (let i = 0; i < 3; i++)
    {
        await page.locator(`[data-preset="${i}"]`).click();
        const actual = await state(page);
        const expected = [[1, 0.18, 30, 20], [0.2, 0.06, 45, 20], [0.7, 0.55, -55, 28]][i];
        check(`Preset ${i + 1} applies exact recipe without leaving slow motion`, actual.slow &&
            [actual.gravity, actual.friction, actual.spin, actual.count].every((v, j) => v === expected[j]) &&
            await page.locator(`[data-preset="${i}"]`).getAttribute("aria-pressed") === "true");
    }
    await input(page, "gravity", 1.15);
    check("Custom values clear the selected preset", await page.locator('[data-preset][aria-pressed="true"]').count() === 0);
    await page.locator("#reset").click();
    const resetState = await state(page);
    check("Reset restores exact defaults and preserves pause", !resetState.running && resetState.count === 20 &&
        resetState.gravity === 1 && resetState.friction === 0.18 && resetState.spin === 30 &&
        !resetState.slow && resetState.angle === -Math.PI / 6);
    await page.locator("#pause").click();
    const timeNormal = await page.evaluate(() => window.__toy.world.time);
    await page.waitForTimeout(500);
    const normalDuration = await page.evaluate(() => window.__toy.world.time) - timeNormal;
    await page.locator("#slow").click();
    const timeSlow = await page.evaluate(() => window.__toy.world.time);
    await page.waitForTimeout(500);
    const slowDuration = await page.evaluate(() => window.__toy.world.time) - timeSlow;
    report.timeFactor = { normalDuration, slowDuration, observedRatio: slowDuration / normalDuration };
    check("Slow motion advances actual solver time at approximately one quarter speed",
        slowDuration / normalDuration > 0.18 && slowDuration / normalDuration < 0.35);
    await page.locator("#pause").click();
    await page.locator("#reset").click();
    await page.locator("#gravity").focus();
    await page.keyboard.press("ArrowRight");
    check("Focused native range retains arrow-key behavior", (await state(page)).gravity === 1.05);
    await page.keyboard.press("s");
    check("Global shortcuts ignore focused ranges", (await state(page)).pending === 0);
    await page.locator("h1").click();
    await page.evaluate(() => document.activeElement.blur());
    await page.keyboard.press("Control+m");
    check("Modified keyboard combinations are not intercepted", !(await state(page)).slow);
    await page.keyboard.press("s");
    check("S shortcut queues a shake", (await state(page)).pending === 20);
    await page.keyboard.press("m");
    check("M shortcut toggles slow motion", (await state(page)).slow);
    await page.keyboard.press("r");
    check("R shortcut resets toy", !(await state(page)).slow && (await state(page)).pending === 0);
    await page.keyboard.press("Space");
    check("Space shortcut resumes simulation", (await state(page)).running);
    await page.keyboard.press("Space");
    check("Space shortcut pauses simulation", !(await state(page)).running);
    await page.locator("#how-button").click();
    check("Header explanation action opens disclosure and transfers focus", await page.locator("#how").evaluate(element => element.open) &&
        await page.evaluate(() => document.activeElement === document.querySelector("#how > summary")));
    await page.locator(".keyboard summary").click();
    check("Keyboard disclosure opens", await page.locator(".keyboard").evaluate(element => element.open));
    await page.locator(".keyboard summary").click();
    await page.locator("#how > summary").click();
    await noOverflow(page, "Desktop has no overflow after all control interactions");
    await page.locator("#reset").click();
    await page.locator("#pause").click();
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(160);
    await page.screenshot({ path: report.screenshots[0] });
    report.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page, "1440px required desktop viewport has no overflow");
    check("1440x900 workbench fits first screen", await page.locator(".arena").evaluate(element => element.getBoundingClientRect().bottom <= 900));
    await page.setViewportSize({ width: 900, height: 900 });
    await noOverflow(page, "Tablet has no overflow and canvas survives resize");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobilePage = await mobileContext.newPage();
    attach(mobilePage);
    await mobilePage.goto(`${service.url}?qa`, { waitUntil: "networkidle" });
    await noOverflow(mobilePage, "Mobile has no initial horizontal overflow");
    check("Mobile whole arena and transport fit first viewport", await mobilePage.locator(".arena").evaluate(element => element.getBoundingClientRect().bottom < 844));
    check("Mobile tuning starts collapsed", !await mobilePage.locator("#tuning").evaluate(element => element.open));
    await mobilePage.screenshot({ path: report.screenshots[1] });
    report.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, touch: true });
    await mobilePage.locator("#tuning > summary").tap();
    check("Mobile tuning expands in normal flow", await mobilePage.locator("#tuning").evaluate(element => element.open));
    await mobilePage.locator("#pause").tap();
    await input(mobilePage, "count", 40);
    await mobilePage.locator("#shake").tap();
    await mobilePage.locator("#slow").tap();
    check("Mobile touch transport and actual count work", (await state(mobilePage)).count === 40 &&
        (await state(mobilePage)).slow && (await state(mobilePage)).pending === 40);
    await noOverflow(mobilePage, "Expanded mobile tuning has no horizontal overflow");
    await mobilePage.locator("#reset").tap();
    await mobilePage.locator("#pause").tap();
    await input(mobilePage, "count", 40);
    await input(mobilePage, "spin", -120);
    await input(mobilePage, "gravity", 2);
    for (let i = 0; i < 5; i++) await mobilePage.locator("#shake").tap();
    await mobilePage.waitForTimeout(5000);
    check("Live mobile worst-case simulation continues with finite contained bodies", await mobilePage.evaluate(() =>
    {
        const w = window.__toy.world;
        const boundary = Array.from({ length: 6 }, (_, i) =>
        {
            const a = w.angle + i * Math.PI / 3;
            const b = a + Math.PI / 3;
            const x = 500 + 420 * Math.cos(a);
            const y = 500 + 420 * Math.sin(a);
            return { x, y, nx: -(Math.sin(b) - Math.sin(a)), ny: Math.cos(b) - Math.cos(a) };
        });
        return w.balls.length === 40 && !w.invalidStates && w.balls.every(b =>
            [b.x, b.y, b.vx, b.vy, b.angle, b.omega].every(Number.isFinite) &&
            boundary.every(e => (b.x - e.x) * e.nx + (b.y - e.y) * e.ny >= 26.999));
    }));
    await mobilePage.setViewportSize({ width: 320, height: 750 });
    await noOverflow(mobilePage, "Narrow 320px mobile remains within viewport");
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    attach(reducedPage);
    await reducedPage.goto(`${service.url}?qa`, { waitUntil: "networkidle" });
    const still = await state(reducedPage);
    await reducedPage.waitForTimeout(200);
    check("Reduced motion initially pauses with explicit Start motion and an unchanged scene",
        !still.running && JSON.stringify(still) === JSON.stringify(await state(reducedPage)) &&
        await reducedPage.locator("#pause").innerText() === "Start motion" &&
        await reducedPage.locator("#status").innerText() === "Reduced motion");
    await reducedPage.locator("#pause").click();
    await reducedPage.locator("#shake").click();
    await reducedPage.waitForTimeout(300);
    check("Reduced motion starts only intentionally and never emits confetti", (await state(reducedPage)).running &&
        await reducedPage.evaluate(() => window.__toy.world.particles.length === 0));
    await reducedPage.locator("#pause").click();
    const beforeResize = await state(reducedPage);
    await reducedPage.setViewportSize({ width: 1200, height: 900 });
    check("Resizing preserves every physical body and wall angle", JSON.stringify(beforeResize) === JSON.stringify(await state(reducedPage)));
    await reducedPage.locator("#reset").click();
    check("Reset does not override reduced-motion pause", !(await state(reducedPage)).running);
    await noOverflow(reducedPage, "Reduced-motion resized page has no overflow");
    check("No browser, request, resource, HTTP or console errors", report.errors.length === 0);
    report.passed = true;
}
catch (error)
{
    report.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    report.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(root, ".checks", "qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, assertions: report.assertions.length,
        errors: report.errors, stability: report.stability, settling: report.settling, resourcesClosed: report.resourcesClosed }, null, 2));
}
