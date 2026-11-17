import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles as W } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "607-3d-neon-breakout-arcade", "GPT-6");
const output = path.join(folder, "out");
const evidence = { passed: false, visualReviewed: false, tests: [], errors: [], viewports: [], resourcesClosed: false };
let server;
let browser;
const record = (name, details) => evidence.tests.push({ name, passed: true, details });
try
{
    server = await startPreviewServer(output, { workspace: root });
    evidence.url = server.url;
    assert.ok(server.url.includes("/pages/3d-neon-breakout-arcade/GPT-6/"));
    browser = await chromium.launch({ headless: true, args: ["--enable-webgl", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 800;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        const localErrors = [];
        page.on("pageerror", e => localErrors.push(`page: ${e.message}`));
        page.on("console", e => { if (e.type() === "error") localErrors.push(`console: ${e.text()}`); });
        page.on("requestfailed", r => localErrors.push(`request: ${r.url()} ${r.failure()?.errorText}`));
        page.on("response", r => { if (r.status() >= 400) localErrors.push(`HTTP ${r.status()} ${r.url()}`); });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);
        assert.equal(await page.title(), "Lumen Dock — Glass Pier");
        assert.ok(await page.locator("canvas").isVisible());
        assert.ok(await page.getByRole("heading", { name: "Lumen Dock", exact: true }).isVisible());
        assert.equal(await page.getByText("This browser could not", { exact: false }).count(), 0);
        const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), true);
        await noOverflow();
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png") });
        const pixels = await page.evaluate(async () =>
        {
            const { arena } = await import("./main.js");
            let triangles = 0;
            arena.scene.traverse(o => { if (o.isMesh && o.visible) triangles += (o.geometry.index?.count || o.geometry.attributes.position.count) / 3; });
            return { calls: arena.renderer.info.render.calls, triangles, width: innerWidth, height: innerHeight, canvasName: document.querySelector("canvas").getAttribute("aria-label") };
        });
        assert.ok(pixels.calls > 0 && pixels.triangles > 1000);
        record(`${viewport.width}: real WebGL geometry and opening screenshot`, pixels);
        await page.getByRole("button", { name: "Controls", exact: true }).click();
        assert.ok(await page.getByRole("heading", { name: "How the bar moves." }).isVisible());
        await page.keyboard.press("Escape");
        assert.ok(await page.getByRole("heading", { name: "Lumen Dock", exact: true }).isVisible());
        await page.getByRole("button", { name: "Play round one", exact: true }).click();
        await page.evaluate(async () => { window.__cabinetQa = await import("./main.js"); });
        const snapshot = () => page.evaluate(async () =>
        {
            const { sim, arena } = await import("./main.js");
            return { state: sim.state, bar: sim.bar, balls: sim.balls.map(b => ({ x: b.x, z: b.z, held: b.held, vx: b.vx, vz: b.vz })), points: sim.points, sparks: sim.sparks, blocks: sim.remaining, round: sim.round, camera: arena.camera.position.toArray() };
        });
        assert.equal((await snapshot()).state, "serve");
        await page.keyboard.down("ArrowRight");
        await page.waitForFunction(() => window.__cabinetQa.sim.bar > .7);
        await page.keyboard.up("ArrowRight");
        assert.ok((await snapshot()).bar > 0);
        await page.keyboard.down("ArrowLeft");
        await page.waitForFunction(() => window.__cabinetQa.sim.bar < -.7);
        await page.keyboard.up("ArrowLeft");
        assert.ok((await snapshot()).bar < 0);
        await page.keyboard.press("a");
        const afterA = (await snapshot()).bar;
        await page.waitForTimeout(100);
        assert.equal((await snapshot()).bar, afterA);
        record(`${viewport.width}: controls, held serve, arrow movement, A unbound`);
        if (mobile)
        {
            const cdp = await context.newCDPSession(page);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 100, y: 440 }] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 290, y: 440 }] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await page.waitForTimeout(60);
            const drag = await snapshot();
            assert.ok(drag.bar > 0);
            assert.equal(drag.state, "serve");
            await page.touchscreen.tap(195, 440);
            assert.equal((await snapshot()).state, "play");
            record("390: actual touch drag aims without launching; tap launches");
        }
        else
        {
            await page.mouse.move(900, 600);
            assert.ok((await snapshot()).bar > 2);
            await page.mouse.move(600, 600);
            await page.keyboard.press("Space");
            assert.equal((await snapshot()).state, "play");
            record("1200: mouse aim and Space launch");
        }
        await page.evaluate(async () => { window.__cabinetQa = await import("./main.js"); });
        await page.waitForFunction(() => window.__cabinetQa.sim.points >= 100, undefined, { timeout: 20000 });
        const natural = await snapshot();
        assert.ok(natural.points >= 100 && natural.blocks < 36, JSON.stringify(natural));
        record(`${viewport.width}: naturally launched ball reached and destroyed a brick`, natural);
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile-play.png" : "desktop-play.png") });
        await page.keyboard.press("Escape");
        assert.equal((await snapshot()).state, "paused");
        const frozen = await snapshot();
        await page.waitForTimeout(250);
        assert.deepEqual((await snapshot()).balls, frozen.balls);
        await page.getByRole("button", { name: "Controls", exact: true }).click();
        await page.getByRole("button", { name: "Back", exact: true }).click();
        assert.ok(await page.getByRole("heading", { name: "Paused.", exact: true }).isVisible());
        const beforeRestart = await snapshot();
        await page.getByRole("button", { name: "Restart round", exact: true }).click();
        const restarted = await snapshot();
        assert.equal(restarted.blocks, 36);
        assert.equal(restarted.points, beforeRestart.points);
        assert.equal(restarted.sparks, beforeRestart.sparks);
        assert.equal(restarted.state, "serve");
        record(`${viewport.width}: pause freezes positions; help returns to pause; restart preserves points/sparks`);
        await page.keyboard.press("m");
        await page.keyboard.press("m");
        const effects = await page.evaluate(async () =>
        {
            const { sim } = await import("./main.js");
            for (const type of ["girder", "needle", "scatter"])
            {
                sim.pickups.push({ type, x: sim.bar, z: 1.7 });
                sim.step(1 / 60);
            }
            return { girder: sim.girder, needle: sim.needle, balls: sim.balls.length, points: sim.points };
        });
        assert.ok(effects.girder > 7.9 && effects.needle > 5.9);
        assert.equal(effects.balls, 3);
        await page.waitForTimeout(80);
        assert.ok((await page.locator("#powers").innerText()).includes("NEEDLE"));
        record(`${viewport.width}: injected falling pickups caught by actual collision and activate all three effects`, effects);
        await noOverflow();
        if (!mobile)
        {
            const cleared = [];
            for (let round = 0; round < 5; round++)
            {
                const result = await page.evaluate(async () =>
                {
                    const { sim } = await import("./main.js");
                    sim.needle = sim.girder = 0;
                    for (const brick of sim.bricks)
                    {
                        while (brick.hp)
                        {
                            sim.state = "play";
                            sim.balls = [{ x: brick.x, z: brick.z - .35, vx: 0, vz: sim.speed, cooldown: 0, trail: [] }];
                            sim.step(1 / 60);
                        }
                    }
                    return { state: sim.state, points: sim.points, sparks: sim.sparks, round: sim.round + 1 };
                });
                cleared.push(result);
                assert.equal(result.state, round === 4 ? "win" : "clear");
                await page.getByRole("button", { name: round === 4 ? "Play again" : "Next round", exact: true }).click();
            }
            assert.deepEqual([(await snapshot()).points, (await snapshot()).sparks, (await snapshot()).round], [0, 3, 0]);
            record("1200: five collision-driven accelerated rounds, clear cards, final win and Play again", cleared);
            await page.evaluate(async () =>
            {
                const { sim } = await import("./main.js");
                for (let i = 0; i < 3; i++)
                {
                    sim.state = "play";
                    sim.balls = [{ x: 6, z: .16, vx: 0, vz: -sim.speed, cooldown: 0, trail: [] }];
                    sim.step(1 / 60);
                }
            });
            await page.getByRole("heading", { name: "Out of sparks.", exact: true }).waitFor({ state: "visible" });
            await page.getByRole("button", { name: "Run it back", exact: true }).click();
            assert.equal((await snapshot()).state, "serve");
            const storage = await page.evaluate(() => JSON.parse(localStorage.getItem("lumen-dock-cabinet")));
            assert.ok(storage.best > 1000);
            assert.deepEqual(Object.keys(storage).sort(), ["best", "muted"]);
            await page.reload({ waitUntil: "networkidle" });
            assert.ok((await page.locator(".best").innerText()).includes(storage.best.toLocaleString("en-US")));
            record("1200: three actual out-line misses trigger failure; retry resets; best persists only allowed data", storage);
        }
        await noOverflow();
        assert.deepEqual(localErrors, []);
        evidence.viewports.push({ ...viewport, deviceScaleFactor: 1, errors: localErrors, noHorizontalOverflowBeforeAndAfter: true });
        await context.close();
    }
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const rp = await reduced.newPage();
    await rp.goto(server.url, { waitUntil: "networkidle" });
    const reduction = await rp.evaluate(async () =>
    {
        const { arena } = await import("./main.js");
        return { reduced: arena.reduced, trails: arena.trails.some(m => m.visible), particles: arena.particles.length };
    });
    assert.deepEqual(reduction, { reduced: true, trails: false, particles: 0 });
    await reduced.close();
    record("reduced motion removes trail/shatter and preserves game setup", reduction);
    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const wp = await wide.newPage();
    const wideErrors = [];
    wp.on("pageerror", e => wideErrors.push(e.message));
    wp.on("console", e => { if (e.type() === "error") wideErrors.push(e.text()); });
    wp.on("requestfailed", r => wideErrors.push(r.url()));
    await wp.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await wp.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await wp.getByRole("button", { name: "Play round one", exact: true }).click();
    await wp.keyboard.press("Space");
    await wp.keyboard.press("Escape");
    await wp.getByRole("heading", { name: "Paused.", exact: true }).waitFor({ state: "visible" });
    assert.deepEqual(wideErrors, []);
    await wide.close();
    record("1440x900: original target desktop framing, serve/launch/pause and no overflow or errors");
    evidence.passed = true;
}
catch (error)
{
    evidence.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    evidence.resourcesClosed = true;
    await W.saveJson(path.join(folder, ".checks", "qa.json"), evidence);
    console.log(JSON.stringify(evidence, null, 2));
}
