import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { WorkspaceFiles: W } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const result = { passed: false, inputMethod: "Frame-synchronized browser keyboard events use the actual key handlers and read-only snapshots. Trusted Playwright keyboard and real CDP multitouch are tested separately in qa.mjs. No state mutation, time skipping or fake mission completion.", tests: [], errors: [], resourcesClosed: false };
let browser;
let server;
let page;
const held = new Set();
function pass(name, evidence = {})
{
    result.tests.push({ name, passed: true, ...evidence });
    process.stdout.write(`${name}: PASS\n`);
}
async function state()
{
    return page.evaluate(() => window.club.snapshot());
}
async function keys(wanted)
{
    for (const key of [...held])
    {
        if (!wanted.includes(key))
        {
            await page.keyboard.up(key);
            held.delete(key);
        }
    }
    for (const key of wanted)
    {
        if (!held.has(key))
        {
            await page.keyboard.down(key);
            held.add(key);
        }
    }
}
function angle(value)
{
    return Math.atan2(Math.sin(value), Math.cos(value));
}
async function walk(x, z)
{
    await navigate(x, z, 2, false);
}
async function drive(x, z, tolerance = 7)
{
    await navigate(x, z, tolerance, true);
}
async function navigate(x, z, tolerance, driving)
{
    const navigation = await page.evaluate(async ({ x, z, tolerance, driving }) =>
    {
        const down = new Set();
        function setKeys(wanted)
        {
            for (const code of [...down])
            {
                if (!wanted.includes(code))
                {
                    window.dispatchEvent(new KeyboardEvent("keyup", { code, bubbles: true, cancelable: true }));
                    down.delete(code);
                }
            }
            for (const code of wanted)
            {
                if (!down.has(code))
                {
                    window.dispatchEvent(new KeyboardEvent("keydown", { code, bubbles: true, cancelable: true }));
                    down.add(code);
                }
            }
        }
        let closest = Infinity;
        const deadline = performance.now() + 60000;
        try
        {
            while (performance.now() < deadline)
            {
                const s = window.club.snapshot();
                const distance = Math.hypot(x - s.player.x, z - s.player.z);
                closest = Math.min(closest, distance);
                if (distance < tolerance) return { passed: true, closest, state: s };
                const difference = Math.atan2(x - s.player.x, z - s.player.z) - s.player.yaw;
                const error = Math.atan2(Math.sin(difference), Math.cos(difference));
                const wanted = [];
                if (Math.abs(error) > (driving ? .055 : .2)) wanted.push(error > 0 ? "KeyD" : "KeyA");
                if (driving)
                {
                    const desired = Math.abs(error) > .65 ? 4 : Math.abs(error) > .2 ? 6.5 : 11;
                    if (s.player.speed < desired - .6) wanted.push("KeyW");
                    else if (s.player.speed > desired + .6) wanted.push("KeyS");
                }
                else if (Math.abs(error) < (distance < 5 ? .3 : .65)) wanted.push("KeyW");
                setKeys(wanted);
                await new Promise(requestAnimationFrame);
            }
            return { passed: false, closest, state: window.club.snapshot() };
        }
        finally
        {
            setKeys([]);
        }
    }, { x, z, tolerance, driving });
    assert.ok(navigation.passed, `Route to ${x},${z}: ${JSON.stringify(navigation)}`);
}
try
{
    server = await startPreviewServer(path.join(job.output, "out"), { workspace: root });
    assert.equal((await fetch(server.url)).status, 200);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    page = await context.newPage();
    page.on("pageerror", (e) => result.errors.push(`Page: ${e.message}`));
    page.on("console", (e) => { if (e.type() === "error") result.errors.push(`Console: ${e.text()}`); });
    page.on("requestfailed", (r) => result.errors.push(`Request: ${r.url()}`));
    page.on("response", (r) => { if (r.status() >= 400) result.errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    await page.goto(server.url, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.club?.snapshot().ready);
    await page.locator("#play").click();
    await page.locator("#race").click();
    assert.equal((await state()).mission.type, null);
    pass("Time trial refuses to start while on foot");
    await page.locator("#errand").click();
    await page.keyboard.press("KeyE");
    assert.equal((await state()).mission.stage, 1);
    assert.equal((await state()).mission.delivered, 0);
    await page.keyboard.press("KeyE");
    assert.equal((await state()).mission.delivered, 0);
    if ((await state()).player.car) await page.keyboard.press("KeyE");
    pass("Real bakery pickup; action away from a door cannot fake a delivery");
    for (const point of [[-8, -44], [-24, -42]]) await walk(...point);
    await page.keyboard.press("KeyE");
    assert.equal((await state()).mission.delivered, 1);
    pass("First physical porch reached on foot and delivered");
    for (const point of [[-6, -42], [-6, 0], [24, 0], [24, 8]]) await walk(...point);
    await page.keyboard.press("KeyE");
    assert.equal((await state()).mission.delivered, 2);
    pass("Second physical porch reached on foot and delivered");
    for (const point of [[24, 0], [54, 0], [54, 48], [72, 48], [72, 56]]) await walk(...point);
    await page.keyboard.press("KeyE");
    const completedPorch = await state();
    assert.equal(completedPorch.mission.type, null);
    assert.ok(completedPorch.bests.porch >= 100);
    assert.equal(completedPorch.mission.completed, 1);
    pass("All three real deliveries award score and persist porch best", { evidence: completedPorch });
    await page.screenshot({ path: path.join(job.output, ".checks", "porch-complete.png") });
    await page.keyboard.press("KeyR");
    assert.equal((await state()).player.x, -9);
    assert.equal((await state()).player.z, -88);
    assert.equal((await state()).bests.porch, completedPorch.bests.porch);
    pass("Reset restores world, cancels progress and preserves best");
    await page.keyboard.press("KeyE");
    assert.ok((await state()).player.car);
    await page.locator("#race").click();
    await page.waitForTimeout(350);
    assert.equal((await state()).mission.started, false);
    pass("Race clock does not start from selecting the activity");
    await drive(-3, -53, 3.5);
    await drive(0, -46, 3.5);
    assert.equal((await state()).mission.stage, 1);
    pass("Physically entering gate one starts the real lap clock");
    for (const point of [[40, -45], [51, -45], [51, -30], [51, 40], [51, 51], [0, 51], [-38, 51], [-45, 51], [-45, 30], [-45, -40], [-45, -45], [0, -45, 3]])
    {
        await drive(...point);
        process.stdout.write(`Waypoint ${point}: stage ${(await state()).mission.stage}\n`);
    }
    await keys([]);
    const completedLap = await state();
    assert.equal(completedLap.mission.type, null);
    assert.ok(completedLap.bests.lap > 10);
    pass("Six ordered physical gates plus return-to-start complete lap and save best", { evidence: completedLap });
    await page.screenshot({ path: path.join(job.output, ".checks", "lap-complete.png") });
    await page.keyboard.press("KeyR");
    await page.keyboard.press("KeyE");
    await keys(["KeyW", "KeyA"]);
    await page.waitForTimeout(2700);
    await keys([]);
    const collision = await state();
    assert.ok(collision.player.collisions > 0);
    pass("Real steering into solid block produces collision without tunneling", { player: collision.player });
    await page.keyboard.press("KeyR");
    await page.locator("#sound").click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("amber-row-club-evening")));
    assert.deepEqual(Object.keys(saved).sort(), ["lap", "mute", "porch"]);
    assert.equal(saved.mute, false);
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => window.club?.snapshot().ready);
    const restored = await state();
    assert.equal(restored.bests.porch, completedPorch.bests.porch);
    assert.equal(restored.bests.lap, completedLap.bests.lap);
    assert.equal(restored.bests.mute, false);
    pass("Only porch/lap/mute persist; real reload restores both earned bests", { saved });
    assert.deepEqual(result.errors, []);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    if (page)
    {
        result.lastState = await state().catch(() => null);
        await page.screenshot({ path: path.join(job.output, ".checks", "gameplay-diagnostic.png") }).catch(() => {});
    }
    process.exitCode = 1;
}
finally
{
    if (page) await keys([]).catch(() => {});
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    await W.saveJson(path.join(job.output, ".checks", "gameplay.json"), result);
    process.stdout.write(JSON.stringify({ passed: result.passed, tests: result.tests.length, errors: result.errors, resourcesClosed: result.resourcesClosed }) + "\n");
}
