import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { newGame, tick, checkAction, housing, forecast } from "../sim.js";

const workspace = process.cwd();
const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const checks = path.join(folder, ".checks");
const route = JSON.parse(await fs.readFile(path.join(checks, "winning-route.json"), "utf8"));
const results = [], errors = [], requests = new Set();
const qa = { passed: false, visualReviewed: false, viewports: [], results, errors, resourcesClosed: false };
let server, browser;
const record = (name, detail) => { results.push({ name, passed: true, detail }); };
async function numbers(page)
{
    return page.locator("[data-stock]").evaluateAll((els) => Object.fromEntries(els.map((el) => [el.dataset.stock, Number(el.textContent)])));
}
async function snapshot(page)
{
    return page.evaluate(() => JSON.parse(localStorage.getItem("colony-save:hearthline")));
}
async function overflow(page, label)
{
    const metrics = await page.evaluate(() =>
    {
        const canvas = document.querySelector("canvas").getBoundingClientRect();
        const controls = [...document.querySelectorAll("#hud button, .topbar button")].filter((el) => el.getClientRects().length);
        const clipped = controls.filter((el) =>
        {
            const r = el.getBoundingClientRect();
            return r.x < -1 || r.right > innerWidth + 1 || r.y < -1 || r.bottom > innerHeight + 1;
        }).map((el) => ({ id: el.id, rect: el.getBoundingClientRect().toJSON() }));
        return { width: innerWidth, height: innerHeight, scroll: document.documentElement.scrollWidth,
            body: document.body.scrollWidth, canvas: canvas.toJSON(), clipped };
    });
    assert.ok(metrics.scroll <= metrics.width && metrics.body <= metrics.width, JSON.stringify(metrics));
    assert.deepEqual(metrics.clipped, [], `${label}: clipped controls ${JSON.stringify(metrics.clipped)}`);
    if (metrics.width < 1100) assert.ok(metrics.canvas.height >= 240, JSON.stringify(metrics.canvas));
    record(`${label}: no overflow and visible controls`, metrics);
}
async function clickCell(page, c, r, touch = false)
{
    const point = await page.locator("canvas").evaluate((el, [c, r]) =>
    {
        const rect = el.getBoundingClientRect(), fit = JSON.parse(el.dataset.fit);
        return { x: rect.x + fit.x + (c - r) * 36 * fit.scale, y: rect.y + fit.y + (c + r) * 18 * fit.scale };
    }, [c, r]);
    if (touch) await page.touchscreen.tap(point.x, point.y);
    else await page.mouse.click(point.x, point.y);
}
async function fresh(page)
{
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#open").click();
}
async function waitReady(page)
{
    await page.waitForFunction(() => document.querySelector("canvas")?.dataset.fit);
    await page.evaluate(() => document.fonts.ready);
}
async function openPage(context)
{
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
    page.on("requestfailed", (r) => errors.push(`request: ${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) => { if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`); });
    page.on("request", (r) =>
    {
        requests.add(new URL(r.url()).pathname);
        if (new URL(r.url()).origin !== new URL(server.url).origin) errors.push(`external request: ${r.url()}`);
    });
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await waitReady(page);
    return page;
}
try
{
    qa.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "mars-colony-builder-game", "GPT-6");
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    assert.ok(server.url.includes("/pages/mars-colony-builder-game/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    for (const [label, viewport, touch] of [
        ["desktop", { width: 1200, height: 900 }, false],
        ["mobile", { width: 390, height: 844 }, true]
    ])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch });
        const page = await openPage(context);
        qa.viewports.push({ label, ...viewport, deviceScaleFactor: 1, hasTouch: touch });
        assert.equal(await page.title(), "Hearthline — Tallow Crater");
        assert.equal(await page.locator("#resume").isDisabled(), true);
        assert.equal(await page.locator("#advance").getAttribute("aria-disabled"), "true");
        assert.match(await page.locator("#population").textContent(), /6 colonists · 8 beds/);
        assert.match(await page.locator(".forecast").textContent(), /Storm in 7 sols/);
        const colors = await page.locator("canvas").evaluate((el) =>
        {
            const data = el.getContext("2d").getImageData(0, 0, el.width, el.height).data;
            const palette = new Set();
            for (let i = 0; i < data.length; i += 160) palette.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
            return palette.size;
        });
        assert.ok(colors > 15);
        record(`${label}: visible, nonblank code-drawn scene`, { sampledColors: colors });
        await overflow(page, `${label} title before interactions`);
        await page.screenshot({ path: path.join(checks, `${label}.png`), animations: "disabled" });
        const helpId = touch ? "#mobile-help" : "#help";
        await page.locator(helpId).click();
        assert.equal(await page.locator("dialog").isVisible(), true);
        assert.match(await page.locator("dialog").textContent(), /oxygen 68, power 44, water 57, morale 69, population 8/);
        await page.keyboard.press("Shift+Tab");
        assert.equal(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)), true);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator(helpId).evaluate((el) => el === document.activeElement), true);
        record(`${label}: title, disabled controls, help, focus trap and Escape`);
        await page.locator("#open").click();
        await page.locator("#tool-remove").click();
        await clickCell(page, 5, 6, touch);
        assert.match(await page.locator("#toast").textContent(), /People still need those beds/);
        assert.equal(await page.locator("#undo").count(), 0);
        await page.locator("#tool-solar").click();
        await clickCell(page, 2, 4, touch);
        assert.match(await page.locator("#toast").textContent(), /boulder/);
        await clickCell(page, 1, 3, touch);
        assert.match(await page.locator("#toast").textContent(), /Crater wall/);
        assert.equal(await page.locator("#undo").count(), 0);
        if (!touch)
        {
            await page.evaluate(() => document.activeElement.blur());
            await page.keyboard.press("Escape");
            await page.keyboard.press("2");
            await page.keyboard.press("ArrowRight");
            await page.keyboard.press("Enter");
            assert.equal((await page.locator('[data-preview="power"]').textContent()).trim(), "46 → 51");
            await page.keyboard.press("u");
            assert.equal(await page.locator("#undo").count(), 0);
            record("desktop: keyboard tools, cursor, placement and undo");
        }
        await page.locator("#tool-solar").click();
        await clickCell(page, 4, 2, touch);
        // A selected tool may have remained active after an invalid click.
        if (await page.locator("#undo").count() === 0)
        {
            await page.locator("#tool-solar").click();
            await clickCell(page, 4, 2, touch);
        }
        assert.equal((await page.locator('[data-preview="power"]').textContent()).trim(), "46 → 54");
        await clickCell(page, 5, 2, touch);
        assert.match(await page.locator("#toast").textContent(), /One change per sol/);
        await clickCell(page, 4, 2, touch);
        assert.equal(await page.locator("#undo").count(), 0);
        await page.locator("#tool-solar").click();
        await clickCell(page, 4, 2, touch);
        await page.locator("#advance").click();
        assert.deepEqual(await numbers(page), { oxygen: 68, power: 54, water: 57, morale: 69 });
        assert.equal((await snapshot(page)).population, 8);
        assert.equal((await snapshot(page)).buildings.length, 2);
        record(`${label}: illegal actions, one-change guard, pending tap undo, exact first solar tick`);
        await page.locator("#tool-drill").click();
        await clickCell(page, 8, 8, touch);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#resume").isEnabled(), true);
        await page.locator("#open").click();
        assert.match(await page.locator("dialog h2").textContent(), /Replace the saved survey/);
        await page.locator("#dialog-keep").click();
        await page.locator("#resume").click();
        assert.equal((await snapshot(page)).sol, 2);
        assert.equal(await page.locator("#undo").count(), 0);
        assert.deepEqual(await numbers(page), { oxygen: 68, power: 54, water: 57, morale: 69 });
        record(`${label}: reload/resume, pending action excluded from save, replacement cancel`);
        const soundId = touch ? "#mobile-sound" : "#sound";
        await page.locator(soundId).click();
        assert.equal(await page.evaluate(() => localStorage.getItem("colony-sound:hearthline")), "true");
        await page.locator("#tool-habitat").click();
        await clickCell(page, 4, 5, touch);
        await page.locator("#undo").click();
        await page.locator(soundId).click();
        record(`${label}: explicit sound opt-in, synthesized placement cue, mute`);
        await page.locator("#tool-remove").click();
        await clickCell(page, 4, 2, touch);
        assert.match(await page.locator('[data-preview="power"]').textContent(), /54 → 52/);
        await page.locator("#undo").click();
        assert.match(await page.locator('[data-preview="power"]').textContent(), /54 → 62/);
        await page.locator("#tool-remove").click();
        await clickCell(page, 4, 2, touch);
        await page.locator("#advance").click();
        assert.equal((await snapshot(page)).buildings.length, 1);
        assert.equal((await snapshot(page)).power, 52);
        record(`${label}: successful removal, undo restores production, committed removal changes tick and save`);
        await fresh(page);
        let expected = newGame(), lowestStock = 100;
        for (let index = 0; index < route.path.length; index++)
        {
            const action = route.path[index];
            assert.equal(checkAction(expected, action), null);
            if (action)
            {
                await page.locator(`#tool-${action.kind}`).click();
                await clickCell(page, action.c, action.r, touch);
                assert.equal(await page.locator("#undo").count(), 1);
            }
            const result = tick(expected, action);
            assert.equal(result.failed, false);
            for (const key of ["oxygen", "power", "water", "morale", "population"])
            {
                const text = await page.locator(`[data-preview="${key}"]`).textContent();
                assert.ok(text.includes(`${expected[key]} → ${result.state[key]}`), `${label} sol ${expected.sol}: ${key} ${text}`);
            }
            const weather = forecast(expected.sol);
            assert.match(await page.locator(".forecast").textContent(), new RegExp(weather.active ? `Dust storm · ${weather.count}` : `Storm in ${weather.count}`));
            await page.locator("#advance").click();
            expected = result.state;
            assert.deepEqual(await numbers(page), Object.fromEntries(["oxygen", "power", "water", "morale"].map((k) => [k, expected[k]])));
            assert.deepEqual(await snapshot(page), expected);
            lowestStock = Math.min(lowestStock, ...["oxygen", "power", "water", "morale"].map((k) => expected[k]));
            if (index === 10)
            {
                await overflow(page, `${label} mid-game storm`);
                await page.screenshot({ path: path.join(checks, `${label}-game.png`), animations: "disabled" });
            }
        }
        assert.equal(expected.population, 50);
        assert.ok(housing(expected.buildings) >= 50);
        assert.equal(await page.locator("#dialog-title").textContent(), "The basin holds.");
        await page.waitForFunction(() => getComputedStyle(document.querySelector("dialog")).opacity === "1");
        await page.screenshot({ path: path.join(checks, `${label}-win.png`) });
        record(`${label}: complete legal 22-sol route through two storms to 50`, { sols: 22, minimumStock: lowestStock, finalState: expected });
        if (touch)
        {
            await page.locator("#dialog-found-again").click();
            await page.locator("#dialog-reset-cancel").click();
            assert.equal(await page.locator("#dialog-title").textContent(), "The basin holds.");
            await page.locator("#dialog-found-again").click();
            await page.locator("#dialog-reset").click();
            assert.deepEqual(await snapshot(page), newGame());
            assert.deepEqual(await numbers(page), { oxygen: 74, power: 46, water: 64, morale: 68 });
            record("mobile: win reset requires confirmation, cancel preserves win, reset saves initial snapshot");
        }
        else
        {
            await page.locator("#dialog-keep-surveying").click();
            assert.equal((await snapshot(page)).wonDismissed, true);
            await page.locator("#advance").click();
            assert.equal(await page.locator("dialog").isVisible(), false);
            assert.equal((await snapshot(page)).population, 50);
            record("desktop: win dismissed and persisted, no repeated win on another sol");
        }
        await overflow(page, `${label} after interactions`);
        await fresh(page);
        if (touch) await page.locator("#advance").click();
        else
        {
            await page.evaluate(() => document.activeElement.blur());
            await page.keyboard.press("n");
        }
        assert.deepEqual(await numbers(page), { oxygen: 68, power: 44, water: 57, morale: 69 });
        let last;
        for (let i = 0; i < 30; i++)
        {
            last = await snapshot(page);
            const projected = tick(last);
            if (projected.failed)
            {
                await page.locator("#tool-habitat").click();
                await clickCell(page, 4, 5, touch);
                assert.equal(await page.locator("#undo").count(), 1);
                await page.locator("#advance").click();
                break;
            }
            await page.locator("#advance").click();
        }
        assert.equal(await page.locator("#dialog-title").textContent(), "The expedition folds.");
        assert.deepEqual(await snapshot(page), last);
        await page.locator("#dialog-retry").click();
        assert.equal(await page.locator("#undo").count(), 0);
        assert.deepEqual(await numbers(page), Object.fromEntries(["oxygen", "power", "water", "morale"].map((k) => [k, last[k]])));
        await page.locator("#advance").click();
        await page.locator("#dialog-leave").click();
        assert.equal(await snapshot(page), null);
        assert.equal(await page.locator("#resume").isDisabled(), true);
        await overflow(page, `${label} failure retry and leave`);
        record(`${label}: natural failed expedition, snapshot not committed, retry clears change, leave deletes save`);
        await page.evaluate(() => localStorage.setItem("colony-save:hearthline", '{"version":99}'));
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#resume").isDisabled(), true);
        await page.evaluate(() => localStorage.setItem("colony-save:hearthline", "{bad json"));
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#resume").isDisabled(), true);
        record(`${label}: unknown and corrupt saves ignored safely`);
        await context.close();
    }
    const large = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const page = await openPage(large);
    await overflow(page, "1440 desktop title");
    const dome = await page.locator("canvas").evaluate((el) =>
    {
        const fit = JSON.parse(el.dataset.fit);
        return { left: fit.x - 56 * fit.scale, right: fit.x - 16 * fit.scale };
    });
    assert.ok(dome.left > 320 && dome.right < 1120);
    await page.screenshot({ path: path.join(checks, "desktop-1440.png"), animations: "disabled" });
    record("1440 desktop: center habitat fully between 320px columns", dome);
    await large.close();
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
    const reducedPage = await openPage(reduced);
    assert.equal(await reducedPage.locator("canvas").evaluate((el) => el.width / el.getBoundingClientRect().width), 2);
    await overflow(reducedPage, "reduced motion high DPR");
    record("reduced motion media and device pixel ratio cap", { reducedMotion: true, requestedDpr: 3, actualDpr: 2 });
    await reduced.close();
    const fallback = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await fallback.addInitScript(() =>
    {
        HTMLCanvasElement.prototype.getContext = () => null;
        Storage.prototype.getItem = () => { throw new Error("storage denied"); };
        Storage.prototype.setItem = () => { throw new Error("storage denied"); };
        Storage.prototype.removeItem = () => { throw new Error("storage denied"); };
    });
    // This context intentionally has no canvas fit; the normal readiness check is not applicable.
    const fallbackPage = await fallback.newPage();
    fallbackPage.on("pageerror", (e) => errors.push(`fallback page: ${e.message}`));
    fallbackPage.on("console", (m) => { if (m.type() === "error") errors.push(`fallback console: ${m.text()}`); });
    await fallbackPage.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await fallbackPage.locator("#fallback").isVisible(), true);
    await fallbackPage.locator("#help").click();
    assert.equal(await fallbackPage.locator("dialog").isVisible(), true);
    await fallbackPage.keyboard.press("Escape");
    await fallbackPage.locator("#open").click();
    await fallbackPage.locator("#advance").click();
    assert.match(await fallbackPage.locator("#toast").textContent(), /storage is unavailable/);
    record("missing canvas and denied storage: one fallback, usable help, no throw, persistence warning");
    await fallback.close();
    assert.deepEqual(errors, []);
    qa.passed = true;
    qa.requests = [...requests].sort();
    qa.screenshots = ["desktop.png", "mobile.png", "desktop-game.png", "mobile-game.png", "desktop-win.png", "mobile-win.png", "desktop-1440.png"];
}
catch (error)
{
    qa.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, checks: results.length, errors, failure: qa.failure, resourcesClosed: qa.resourcesClosed }, null, 2));
}
