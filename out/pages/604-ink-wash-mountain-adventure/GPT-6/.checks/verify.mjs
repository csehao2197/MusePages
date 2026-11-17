import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const checks = path.join(folder, ".checks");
const results = [];
const errors = [];
let browser;
let server;
const qa = { prompt: job.prompt, modelId: job.modelId, passed: false, visualReviewed: false, viewports: [], results, errors, resourcesClosed: false };
function pass(name, evidence)
{
    results.push({ name, passed: true, evidence });
    console.log("PASS", name);
}
async function snapshot(page)
{
    return page.evaluate(() => window.__RAINVEIL__);
}
async function overflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), true);
}
function monitor(page, label)
{
    page.on("pageerror", (e) => errors.push(`${label}: ${e.message}`));
    page.on("console", (e) =>
    {
        if (e.type() === "error") errors.push(`${label}: ${e.text()}`);
    });
    page.on("requestfailed", (r) => errors.push(`${label}: ${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) =>
    {
        if (r.status() >= 400) errors.push(`${label}: HTTP ${r.status()} ${r.url()}`);
    });
}
async function keyMove(page, key, predicate, arg)
{
    await page.keyboard.down(key);
    try { await page.waitForFunction(predicate, arg, { timeout: 14000, polling: 25 }); }
    finally { await page.keyboard.up(key); }
}
async function positionAt(page, z, x)
{
    let s = await snapshot(page);
    if (Math.abs(s.player.z - z) > .25)
    {
        const key = s.player.z > z ? "w" : "s";
        await keyMove(page, key, ({ z, direction }) => direction < 0 ? window.__RAINVEIL__.player.z <= z : window.__RAINVEIL__.player.z >= z, { z, direction: key === "w" ? -1 : 1 });
    }
    s = await snapshot(page);
    if (Math.abs(s.player.x - x) > .2)
    {
        const key = s.player.x > x ? "a" : "d";
        await keyMove(page, key, ({ x, direction }) => direction < 0 ? window.__RAINVEIL__.player.x <= x : window.__RAINVEIL__.player.x >= x, { x, direction: key === "a" ? -1 : 1 });
    }
}
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/", server.url))).status, 404);
    assert.equal((await fetch(new URL("metadata.json", server.url))).status, 404);
    pass("Final-subpath static server isolation", { url: server.url, index: 200, repositoryRoot: 404, metadata: 404 });
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    monitor(page, "desktop");
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => !!window.__RAINVEIL__);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    assert.equal(await page.title(), "Rainveil — Three guardians. One quiet summit.");
    await overflow(page);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    assert.ok((await fs.stat(path.join(checks, "desktop.png"))).size > 50000);
    qa.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1, screenshot: ".checks\\desktop.png" });
    pass("Desktop nonblank 3D first screen and no overflow", { canvas: await page.locator("canvas").boundingBox(), screenshotBytes: (await fs.stat(path.join(checks, "desktop.png"))).size });
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    monitor(phone, "mobile");
    await phone.goto(server.url, { waitUntil: "networkidle" });
    await phone.waitForFunction(() => !!window.__RAINVEIL__);
    await phone.evaluate(() => document.fonts.ready);
    await phone.waitForTimeout(600);
    await overflow(phone);
    await phone.screenshot({ path: path.join(checks, "mobile.png") });
    qa.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, touch: true, screenshot: ".checks\\mobile.png" });
    pass("Mobile nonblank 3D first screen and no overflow", { screenshotBytes: (await fs.stat(path.join(checks, "mobile.png"))).size });
    if (!process.argv.includes("--visual-only"))
    {
        await page.bringToFront();
        await page.getByRole("button", { name: "How to play", exact: true }).click();
        await page.getByRole("heading", { name: "A little less force. A little more timing." }).waitFor();
        await page.getByRole("button", { name: "Return to the rain" }).click();
        await page.getByRole("button", { name: "Enter the trail" }).click();
        await page.keyboard.press("j");
        assert.ok((await snapshot(page)).player.breath < 100);
        assert.equal((await snapshot(page)).hits, 0);
        pass("Help, start, range check, and real Breath consumption", await snapshot(page));
        for (let index = 0; index < 3; index++)
        {
            const s = await snapshot(page);
            const g = s.guardians[index];
            const gx = Math.sin(g.z * .065) * 2.7;
            await positionAt(page, g.z + 2.7, gx);
            await page.waitForFunction((i) =>
            {
                const g = window.__RAINVEIL__.guardians[i];
                return g.phase === "telegraph" && g.phaseTime > g.windup - .24;
            }, index, { timeout: 14000, polling: 16 });
            await page.keyboard.press("Space");
            await page.waitForFunction((i) => ["sweep", "recovery"].includes(window.__RAINVEIL__.guardians[i].phase), index);
            assert.ok((await snapshot(page)).cleanDodges >= index + 1);
            await positionAt(page, g.z + 2.2, gx);
            for (let hit = 0; hit < 14; hit++)
            {
                const current = await snapshot(page);
                if (current.guardians[index].resolved) break;
                const phase = current.guardians[index];
                if (phase.phase === "telegraph")
                {
                    await page.waitForFunction((i) =>
                    {
                        const g = window.__RAINVEIL__.guardians[i];
                        return g.phase === "telegraph" && g.phaseTime >= g.windup - .23;
                    }, index, { timeout: 5000, polling: 16 });
                    await page.keyboard.press("Space");
                    await page.waitForTimeout(550);
                    await positionAt(page, g.z + 2.2, gx);
                }
                await page.waitForFunction(() => window.__RAINVEIL__.player.cooldown === 0 && window.__RAINVEIL__.player.dodge === 0);
                await page.keyboard.press("j");
                await page.waitForFunction(() => window.__RAINVEIL__.player.cooldown === 0);
                if ((await snapshot(page)).mode === "fallen") throw Error(`Unexpected failure during guardian ${index}`);
            }
            assert.equal((await snapshot(page)).guardians[index].resolved, true);
            pass(`Real keyboard calibration and dodge: ${g.name}`, { state: await snapshot(page) });
            await overflow(page);
            if (index === 0)
            {
                await page.getByRole("button", { name: "Retry this lesson" }).click();
                const retried = await snapshot(page);
                assert.equal(retried.guardians[0].resolved, true);
                assert.equal(retried.guardians[1].health, retried.guardians[1].maxHealth);
                assert.equal(retried.retries, 1);
                pass("Checkpoint retry retains previously learned form", retried);
            }
        }
        await keyMove(page, "w", () => window.__RAINVEIL__.mode === "won", null);
        await page.getByRole("heading", { name: "A quiet summit. A clearer mind." }).waitFor();
        assert.equal((await snapshot(page)).mode, "won");
        await page.screenshot({ path: path.join(checks, "summit.png") });
        const stored = await page.evaluate(() => ({ ...localStorage }));
        assert.ok(Object.keys(stored).some((key) => key.endsWith("-best")));
        pass("Actual summit traversal, win summary, and local personal best", { final: await snapshot(page), stored });
        await page.getByRole("button", { name: "Walk the trail again" }).click();
        assert.equal((await snapshot(page)).resolved, 0);
        assert.equal((await snapshot(page)).mode, "playing");
        await page.getByRole("button", { name: "Pause practice", exact: true }).click();
        const pausedTime = (await snapshot(page)).elapsed;
        await page.waitForTimeout(500);
        assert.equal((await snapshot(page)).elapsed, pausedTime);
        await page.getByRole("button", { name: "Continue practice" }).click();
        await page.getByRole("button", { name: "Turn sound on" }).click();
        await page.getByRole("button", { name: "Turn sound off" }).click();
        await page.mouse.click(660, 540);
        const old = (await snapshot(page)).player.z;
        await page.waitForTimeout(600);
        assert.notEqual((await snapshot(page)).player.z, old);
        await overflow(page);
        pass("Full restart, frozen pause timer, sound preference, mouse navigation", { state: await snapshot(page) });
        await desktop.close();
        await phone.bringToFront();
        await phone.getByRole("button", { name: "Enter the trail" }).tap();
        const forward = await phone.getByRole("button", { name: "Move forward", exact: true }).boundingBox();
        await phone.touchscreen.tap(forward.x + forward.width / 2, forward.y + forward.height / 2);
        const before = (await snapshot(phone)).player.z;
        const cdp = await mobile.newCDPSession(phone);
        const touchBoxes = {};
        for (const direction of ["up", "down", "left", "right"])
        {
            touchBoxes[direction] = await phone.locator(`[data-move="${direction}"]`).boundingBox();
        }
        for (const action of ["strike", "dodge"])
        {
            touchBoxes[action] = await phone.locator(`#touch-${action}`).boundingBox();
        }
        async function fastTap(action)
        {
            const box = touchBoxes[action];
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        }
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: forward.x + forward.width / 2, y: forward.y + forward.height / 2 }] });
        await phone.waitForTimeout(1100);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        assert.ok((await snapshot(phone)).player.z < before - 2);
        await phone.getByRole("button", { name: "Dodge BREATH 24" }).tap();
        await phone.waitForTimeout(100);
        assert.ok((await snapshot(phone)).dodges > 0);
        await phone.waitForFunction(() => window.__RAINVEIL__.player.dodge === 0 && window.__RAINVEIL__.player.cooldown === 0);
        const strikes = (await snapshot(phone)).strikes;
        await phone.getByRole("button", { name: "Strike BREATH 12" }).tap();
        await phone.waitForFunction((previous) => window.__RAINVEIL__.strikes > previous, strikes);
        await phone.getByRole("button", { name: "How to play", exact: true }).tap();
        await phone.getByRole("button", { name: "Return to the rain" }).tap();
        await overflow(phone);
        pass("Mobile held movement, real dodge, strike, help, no post-interaction overflow", await snapshot(phone));
        async function touchMove(direction, predicate, arg)
        {
            const box = touchBoxes[direction];
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
            try { await phone.waitForFunction(predicate, arg, { timeout: 14000, polling: 25 }); }
            finally { await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); }
        }
        async function touchPosition(z, x)
        {
            let s = await snapshot(phone);
            if (Math.abs(s.player.z - z) > .2)
            {
                const up = s.player.z > z;
                await touchMove(up ? "up" : "down", ({ z, up }) => up ? window.__RAINVEIL__.player.z <= z : window.__RAINVEIL__.player.z >= z, { z, up });
            }
            s = await snapshot(phone);
            if (Math.abs(s.player.x - x) > .2)
            {
                const left = s.player.x > x;
                await touchMove(left ? "left" : "right", ({ x, left }) => left ? window.__RAINVEIL__.player.x <= x : window.__RAINVEIL__.player.x >= x, { x, left });
            }
        }
        await phone.locator("#retry").tap();
        await touchPosition(-5.6, Math.sin(-8 * .065) * 2.7);
        for (let i = 0; i < 16; i++)
        {
            let s = await snapshot(phone);
            if (s.guardians[0].resolved) break;
            if (s.guardians[0].phase === "telegraph")
            {
                await phone.waitForFunction(() =>
                {
                    const g = window.__RAINVEIL__.guardians[0];
                    return g.phase === "telegraph" && g.phaseTime > g.windup - .22;
                }, null, { polling: 16 });
                await fastTap("dodge");
                await phone.waitForFunction(() => window.__RAINVEIL__.player.dodge === 0);
                await touchPosition(-5.6, Math.sin(-8 * .065) * 2.7);
            }
            await phone.waitForFunction(() => window.__RAINVEIL__.player.cooldown === 0 && window.__RAINVEIL__.player.dodge === 0);
            await fastTap("strike");
            await phone.waitForTimeout(400);
        }
        assert.equal((await snapshot(phone)).guardians[0].resolved, true);
        pass("Actual touch-only first-guardian calibration", await snapshot(phone));
        await touchPosition(-34.5, Math.sin(-37 * .065) * 2.7);
        await phone.waitForFunction(() => window.__RAINVEIL__.mode === "fallen", null, { timeout: 35000 });
        await phone.locator("#result-action").filter({ hasText: "Retry this lesson" }).tap();
        assert.equal((await snapshot(phone)).guardians[0].resolved, true);
        assert.equal((await snapshot(phone)).player.hp, 3);
        assert.equal((await snapshot(phone)).guardians[1].health, 10);
        await overflow(phone);
        pass("Real sweep failure and mobile checkpoint recovery with first form retained", await snapshot(phone));
        await mobile.close();
    }
    assert.deepEqual(errors, []);
    qa.passed = true;
    pass("No console, page, request, or HTTP/resource errors", { errors: [] });
}
catch (error)
{
    qa.browserStates = await Promise.all((browser?.contexts() || []).flatMap((context) => context.pages()).map(async (page) =>
    {
        try { return await snapshot(page); } catch { return null; }
    }));
    errors.push(error.stack);
    console.error(error);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, process.argv.includes("--visual-only") ? "initial-visual-check.json" : "qa.json"), qa);
}
