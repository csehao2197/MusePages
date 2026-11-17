import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const checks = fileURLToPath(new URL(".", import.meta.url));
const folder = path.dirname(checks);
const root = path.resolve(folder, "../../../..");
const results = [];
const errors = [];
const viewports = [];
let browser;
let server;
const outcome =
{
    passed: false,
    visualReviewed: false,
    modelId: "gpt-6.1-sol",
    results,
    errors,
    viewports,
    resourcesClosed: false
};

function record(name, details)
{
    results.push({ name, passed: true, details });
}

async function state(page)
{
    return page.evaluate(async () =>
    {
        const { state, garden } = await import("./main.js");
        return {
            count: state.clumps.length * 6,
            selected: state.selectedFlower,
            wind: state.wind,
            camera: state.camera,
            clumps: JSON.stringify(state.clumps),
            types: state.clumps.map((c) => c.type),
            ring: garden.ring.visible,
            cursor: { ...garden.cursor },
            ratio: garden.renderer.getPixelRatio(),
            reduced: garden.reduced
        };
    });
}

async function noOverflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), true);
}

async function openPoint(page)
{
    return page.evaluate(async () =>
    {
        const { garden } = await import("./main.js");
        const { Vector3 } = await import("three");
        const { heightAt } = await import("./garden/geometry.js");
        for (let z = 2.4; z > -3.5; z -= .64)
        {
            for (let x = 1.0; x < 5; x += .64)
            {
                if (!garden.valid(x, z)) continue;
                const p = new Vector3(x, heightAt(x, z), z).project(garden.camera);
                const sx = (p.x + 1) / 2 * innerWidth;
                const sy = (1 - p.y) / 2 * innerHeight;
                if (document.elementFromPoint(sx, sy) === garden.renderer.domElement) return { x: sx, y: sy, worldX: x, worldZ: z };
            }
        }
        throw new Error("No visible open point");
    });
}

async function plantAtOpenPoint(page, touch = false)
{
    const point = await openPoint(page);
    if (touch) await page.touchscreen.tap(point.x, point.y);
    else await page.mouse.click(point.x, point.y);
    return point;
}

async function reset(page)
{
    await page.locator("#reset-open").click();
    await page.locator("#reset-confirm").click();
    await page.waitForTimeout(100);
    assert.equal((await state(page)).count, 108);
}

async function monitor(context, viewport)
{
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push({ viewport, type: "page", message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push({ viewport, type: "console", message: message.text() });
    });
    page.on("requestfailed", (request) => errors.push({ viewport, type: "request", url: request.url(), message: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push({ viewport, type: "http", status: response.status(), url: response.url() });
    });
    const response = await page.goto(server.url, { waitUntil: "networkidle", timeout: 60000 });
    assert.equal(response.status(), 200);
    await page.locator("canvas").waitFor();
    await page.waitForFunction(async () => Boolean((await import("./main.js")).garden));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(750);
    await noOverflow(page);
    assert.equal(await page.locator("h1").textContent(), "Plant a little joy.");
    assert.equal(await page.locator("#count").textContent(), "108 blooms");
    assert.equal(await page.evaluate(() => /[\u3400-\u9FFF]/u.test(document.body.innerText)), false);
    const framing = await page.evaluate(async () =>
    {
        const { garden } = await import("./main.js");
        const { Vector3 } = await import("three");
        const positions = garden.ground.geometry.attributes.position;
        const bounds = { minX: innerWidth, maxX: 0, minY: innerHeight, maxY: 0 };
        const vector = new Vector3();
        for (let i = 0; i < positions.count; i++)
        {
            vector.fromBufferAttribute(positions, i).project(garden.camera);
            const x = (vector.x + 1) / 2 * innerWidth;
            const y = (1 - vector.y) / 2 * innerHeight;
            bounds.minX = Math.min(bounds.minX, x);
            bounds.maxX = Math.max(bounds.maxX, x);
            bounds.minY = Math.min(bounds.minY, y);
            bounds.maxY = Math.max(bounds.maxY, y);
        }
        return bounds;
    });
    assert.equal(framing.minX >= 8 && framing.maxX <= viewport.width - 8, true);
    viewports.push({ ...viewport, http: 200, initialOverflow: false, initialBlooms: 108, completeIsland: true, framing });
    return page;
}

try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.match(server.url, /\/pages\/3d-flower-garden-toy\/GPT-6\/index\.html$/);
    browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader"] });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, acceptDownloads: true });
    const page = await monitor(desktop, { width: 1200, height: 900, dpr: 1 });
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    const initial = await state(page);
    record("Desktop initial render", "Actual 1200×900 DPR1 WebGL meadow; 18 clumps, 108 flowers, local fonts, English UI, final public subpath.");
    const geometry = await page.evaluate(async () =>
    {
        const { garden } = await import("./main.js");
        return {
            counts: garden.pools.types.map((pool) => pool.count),
            parts: garden.pools.types.map((pool) => pool.parts.length),
            grass: garden.grass.instanceMatrix.count,
            geometries: garden.pools.types.map((pool) => pool.parts[2].geometry.attributes.position.count),
            births: garden.pools.types.every((pool) => pool.parts.every((mesh) => Boolean(mesh.geometry.attributes.aBirth && mesh.geometry.attributes.aPhase && mesh.geometry.attributes.aHeight && mesh.geometry.attributes.aGrowth))),
            webgl: Boolean(garden.renderer.getContext()),
            drawCalls: garden.renderer.info.render.calls
        };
    });
    assert.equal(geometry.webgl, true);
    assert.equal(geometry.counts.reduce((a, b) => a + b), 108);
    assert.deepEqual(geometry.parts, [4, 4, 4, 4]);
    assert.equal(geometry.births, true);
    assert.equal(geometry.grass, 1800);
    assert.equal(new Set(geometry.geometries).size >= 3, true);
    record("Real procedural instancing", geometry);

    for (let i = 0; i < 4; i++)
    {
        await page.locator(`[data-flower="${i}"]`).click();
        const before = await state(page);
        const point = await plantAtOpenPoint(page);
        const after = await state(page);
        assert.equal(after.count, before.count + 6);
        assert.equal(after.types.at(-1), i);
        assert.deepEqual(after.types.slice(0, -1), before.types);
        assert.equal(await page.locator(`[data-flower="${i}"]`).getAttribute("aria-pressed"), "true");
        await page.mouse.click(point.x, point.y);
        assert.equal((await state(page)).count, after.count);
        assert.equal(await page.locator("#toast").textContent(), "Plant on an open patch of grass.");
    }
    await page.waitForTimeout(1200);
    record("Four botanical choices and six-flower raycast planting", "Actual clicks planted exactly six of the chosen type each; existing types preserved; occupied patch rejected; two-phase GPU growth attributes populated.");

    await page.locator("canvas").focus();
    await page.keyboard.press("2");
    assert.equal((await state(page)).selected, 1);
    const keyboardBefore = await state(page);
    await page.keyboard.press("ArrowRight");
    assert.notDeepEqual((await state(page)).cursor, keyboardBefore.cursor);
    assert.equal((await state(page)).ring, true);
    await page.keyboard.press("Enter");
    assert.equal((await state(page)).count, keyboardBefore.count + 6);
    const plantedCursor = (await state(page)).cursor;
    for (const key of ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"])
    {
        await page.keyboard.press(key);
        if (JSON.stringify((await state(page)).cursor) !== JSON.stringify(plantedCursor)) break;
    }
    await page.keyboard.press("Space");
    assert.equal((await state(page)).count, keyboardBefore.count + 12);
    await page.locator("#wind").focus();
    await page.locator("#wind").fill("0");
    await page.locator("#wind").dispatchEvent("input");
    assert.equal((await state(page)).wind, 0);
    assert.equal(await page.locator("#wind-value").textContent(), "Still · 0%");
    await page.keyboard.press("ArrowRight");
    assert.equal((await state(page)).wind, 1);
    await page.keyboard.press("4");
    assert.equal((await state(page)).selected, 1);
    await page.locator("#wind").fill("100");
    await page.locator("#wind").dispatchEvent("input");
    assert.equal(await page.locator("#wind-value").textContent(), "Gusty · 100%");
    record("Keyboard and wind", "Canvas 1–4 selection, arrow ring movement, Enter/Space planting; focused slider retains arrow/number behavior; Still/Light/Gusty states and GPU shared wind updated.");

    await page.locator("#help-open").click();
    assert.equal(await page.locator("#help-dialog").evaluate((d) => d.open), true);
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.querySelector("#help-dialog").contains(document.activeElement)), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#help-dialog").evaluate((d) => d.open), false);
    assert.equal(await page.locator("#help-open").evaluate((el) => el === document.activeElement), true);
    await page.locator("#help-open").click();
    await page.mouse.click(5, 400);
    assert.equal(await page.locator("#help-dialog").evaluate((d) => d.open), false);
    await page.locator("#reset-open").click();
    await page.mouse.click(5, 400);
    assert.equal(await page.locator("#reset-dialog").evaluate((d) => d.open), true);
    const beforeCancel = (await state(page)).count;
    await page.locator("#reset-cancel").click();
    assert.equal((await state(page)).count, beforeCancel);
    record("Help/reset accessible dialogs", "Native modal focus trap and Escape/return focus tested; help scrim dismisses; reset scrim does not; cancel preserves plants.");

    const beforeOrbit = await state(page);
    await page.mouse.move(820, 450);
    await page.mouse.down();
    await page.mouse.move(935, 485, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    const afterOrbit = await state(page);
    assert.equal(afterOrbit.count, beforeOrbit.count);
    assert.notDeepEqual(afterOrbit.camera.position, beforeOrbit.camera.position);
    await page.mouse.wheel(0, -200);
    await page.waitForTimeout(400);
    assert.notDeepEqual((await state(page)).camera.position, afterOrbit.camera.position);
    record("Orbit and wheel", "Actual mouse drag and wheel changed camera without planting.");

    await reset(page);
    const restored = await state(page);
    assert.equal(restored.clumps, initial.clumps);
    assert.equal(restored.selected, 0);
    assert.equal(restored.wind, 35);
    assert.deepEqual(restored.camera, initial.camera);
    record("Deterministic reset", "All seeded positions/heights/rotations exactly equal original state; camera, first flower and wind restored.");

    const beforeSnapshot = await state(page);
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#snapshot").click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "meadowmint-garden.png");
    await download.saveAs(path.join(checks, "postcard.png"));
    const png = await readFile(path.join(checks, "postcard.png"));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 900);
    assert.equal(png.length > 20000, true);
    assert.equal((await state(page)).clumps, beforeSnapshot.clumps);
    assert.deepEqual((await state(page)).camera, beforeSnapshot.camera);
    assert.equal((await state(page)).ratio, beforeSnapshot.ratio);
    assert.equal(await page.locator("#toast").textContent(), "Garden saved as a PNG.");
    await page.evaluate(() =>
    {
        const canvas = document.querySelector("canvas");
        canvas._oldToBlob = canvas.toBlob;
        canvas.toBlob = (callback) => callback(null);
    });
    await page.locator("#snapshot").click();
    assert.equal(await page.locator("#toast").textContent(), "The snapshot could not be saved. Try again.");
    await page.evaluate(() =>
    {
        const canvas = document.querySelector("canvas");
        canvas.toBlob = canvas._oldToBlob;
        delete canvas._oldToBlob;
    });
    record("Actual PNG download and failure handling", { filename: download.suggestedFilename(), width: 1200, height: 900, bytes: png.length, stateAndSizeRestored: true, nullBlobFailureHandled: true });

    const capacity = await page.evaluate(async () =>
    {
        const { garden, state } = await import("./main.js");
        const render = garden.render;
        garden.render = () => {};
        for (let z = -3.8; z < 4; z += .5)
        {
            for (let x = -6; x < 6; x += .5)
            {
                if (state.clumps.length === 120) break;
                if (garden.valid(x, z)) garden.plant(x, z);
            }
        }
        let open;
        for (let z = -3; z < 3 && !open; z += .3)
        {
            for (let x = -5; x < 5; x += .3)
            {
                if (garden.valid(x, z))
                {
                    open = { x, z };
                    break;
                }
            }
        }
        const rejected = open ? garden.plant(open.x, open.z) === false : false;
        garden.render = render;
        garden.render();
        return { count: state.clumps.length * 6, rejected, toast: state.toast, instances: garden.pools.types.map((p) => p.count) };
    });
    assert.equal(capacity.count, 720);
    assert.equal(capacity.rejected, true);
    assert.equal(capacity.toast, "Your meadow is full. Reset to begin again.");
    assert.equal(capacity.instances.reduce((a, b) => a + b), 720);
    record("720-bloom capacity", { ...capacity, method: "Actual plant validation/state/pools, batched into one render to avoid software-GPU command backlog; not a hardware performance benchmark." });
    await reset(page);

    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal((await state(page)).reduced, true);
    const reducedBefore = (await state(page)).count;
    await plantAtOpenPoint(page);
    assert.equal((await state(page)).count, reducedBefore + 6);
    assert.equal(await page.evaluate(async () =>
    {
        const { garden } = await import("./main.js");
        return garden.uniforms.uReduced.value === 1 && !garden.controls.enableDamping &&
            garden.pools.types[0].parts[0].geometry.attributes.aBirth.getX(30) < 0;
    }), true);
    record("Reduced-motion live preference", "Preference change freezes shader field, disables camera damping, plants immediately without growth stagger.");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await noOverflow(page);
    record("Desktop after-interaction layout", "No horizontal overflow after all interactions.");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, acceptDownloads: true });
    const mobilePage = await monitor(mobile, { width: 390, height: 844, dpr: 1, touch: true });
    await mobilePage.screenshot({ path: path.join(checks, "mobile.png") });
    await mobilePage.locator('[data-flower="2"]').tap();
    await plantAtOpenPoint(mobilePage, true);
    assert.equal((await state(mobilePage)).count, 114);
    assert.equal((await state(mobilePage)).types.at(-1), 2);
    const session = await mobile.newCDPSession(mobilePage);
    const beforeTouch = await state(mobilePage);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 220, y: 440, id: 1 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 280, y: 460, id: 1 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobilePage.waitForTimeout(300);
    const afterTouch = await state(mobilePage);
    assert.equal(afterTouch.count, beforeTouch.count);
    assert.notDeepEqual(afterTouch.camera.position, beforeTouch.camera.position);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 150, y: 430, id: 1 }, { x: 240, y: 430, id: 2 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 120, y: 430, id: 1 }, { x: 270, y: 430, id: 2 }] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobilePage.waitForTimeout(300);
    assert.equal((await state(mobilePage)).count, afterTouch.count);
    assert.notDeepEqual((await state(mobilePage)).camera.position, afterTouch.camera.position);
    await mobilePage.locator("#wind").fill("80");
    await mobilePage.locator("#wind").dispatchEvent("input");
    assert.equal((await state(mobilePage)).wind, 80);
    await mobilePage.locator("#help-open").tap();
    assert.equal(await mobilePage.locator(".dialog-credit").isVisible(), true);
    await mobilePage.locator("#help-close").tap();
    await reset(mobilePage);
    await noOverflow(mobilePage);
    const targets = await mobilePage.locator(".dock button, .utilities button").evaluateAll((buttons) => buttons.every((button) =>
    {
        const r = button.getBoundingClientRect();
        return r.width >= 44 && r.height >= 44;
    }));
    assert.equal(targets, true);
    record("Mobile actual touch controls", "390×844: selected bluebell and tapped six blooms; one-finger orbit and two-finger pinch change camera with no accidental planting; wind, help, reset, 44px targets, no overflow.");
    await session.detach();
    await mobile.close();

    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const widePage = await monitor(wide, { width: 1440, height: 900, dpr: 1 });
    await noOverflow(widePage);
    await wide.close();
    assert.deepEqual(errors, []);
    record("Resources and errors", "All homepage/resource requests successful; zero request, HTTP, console or page errors in all viewports.");
    outcome.passed = true;
}
catch (error)
{
    outcome.failure = { message: error.message, stack: error.stack };
    console.error(error);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    outcome.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), outcome);
    console.log(JSON.stringify({ passed: outcome.passed, checks: results.length, errors, failure: outcome.failure, resourcesClosed: true }));
}
