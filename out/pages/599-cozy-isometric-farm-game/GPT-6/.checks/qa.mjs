import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { initial, transact } from "../engine.js";
import { valid } from "../storage.js";
import { C } from "../content.js";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checks = path.join(folder, ".checks");
const results = [];
const errors = [];
let browser;
let server;
let passed = false;
let resourcesClosed = false;
const record = (name, evidence) => results.push({ name, passed: true, evidence });
const getState = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), C.key);
async function noOverflow(page, name)
{
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(sizes.scroll <= sizes.viewport, JSON.stringify(sizes));
    record(name, sizes);
}
async function tile(page, index, touch = false)
{
    const target = page.locator(`[data-tile="${index}"] .diamond`);
    const box = await target.boundingBox();
    assert.ok(box);
    if (touch) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    else await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
function listen(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP: ${response.status()} ${response.url()}`);
    });
}
try
{
    const baseline = initial();
    assert.ok(valid(baseline));
    assert.equal(baseline.tiles.length, 36);
    for (const bad of [null, {}, { ...baseline, coins: -1 }, { ...baseline, inventory: [1, -2, 0] }, { ...baseline, phase: "Night" }, { ...baseline, tiles: [] }])
    {
        assert.ok(!valid(bad));
    }
    for (let cropIndex = 0; cropIndex < 3; cropIndex++)
    {
        let s = initial();
        s.coins = 0;
        const rejected = transact(s, { type: "buy", value: cropIndex });
        assert.equal(rejected.ok, false);
        assert.deepEqual(rejected.state, s);
        s.coins = C.crops[cropIndex].buy;
        s = transact(s, { type: "buy", value: cropIndex }).state;
        assert.equal(s.coins, 0);
        s = transact(s, { type: "seed", value: cropIndex }).state;
        s = transact(s, { type: "tile", value: 20 }).state;
        for (let day = 0; day < C.crops[cropIndex].days; day++)
        {
            s = transact(s, { type: "tool", value: 2 }).state;
            s = transact(s, { type: "tile", value: 20 }).state;
            s = transact(s, { type: "day" }).state;
        }
        assert.equal(s.tiles[20].progress, C.crops[cropIndex].days);
        s = transact(s, { type: "tool", value: 3 }).state;
        s = transact(s, { type: "tile", value: 20 }).state;
        assert.equal(s.coins, C.crops[cropIndex].sell);
        assert.equal(s.tiles[20].crop, null);
        assert.equal(s.tiles[20].soil, true);
        assert.ok(valid(s));
    }
    record("Engine: all three exact-price crop lifecycles and invalid saves", "2/3/4 watered days; 9/14/22 harvest; insufficient funds immutable");
    const staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "cozy-isometric-farm-game", "GPT-6");
    record("Static export independent subpath validation", staticDigest);
    server = await startPreviewServer(path.join(folder, "out"), { workspace: process.cwd() });
    const readiness = await fetch(server.url);
    assert.equal(readiness.status, 200);
    record("Actual isolated preview server ready", server.url);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    listen(page);
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => document.querySelectorAll("[data-tile]").length === 36);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), C.brand);
    assert.equal(await page.locator("[data-tile]").count(), 36);
    assert.deepEqual(await getState(page), initial());
    await noOverflow(page, "Desktop 1200×900 initial no overflow");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page, "Desktop 1440×900 no overflow");
    for (const selector of ["#field", ".toolbelt", "#end-day", "#desktop-shop .shop"])
    {
        const bounds = await page.locator(selector).boundingBox();
        assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= 900, selector);
    }
    await page.screenshot({ path: path.join(checks, "desktop-wide.png") });
    record("1440 desktop composition", "Complete board, tools, day action and shop in 900px height");
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.locator('[data-tool="3"]').click();
    await tile(page, 7);
    assert.equal((await getState(page)).coins, 39);
    await tile(page, 13);
    assert.equal((await getState(page)).coins, 39);
    await page.locator('#desktop-shop [data-buy="0"]').click();
    assert.equal((await getState(page)).coins, 35);
    assert.equal((await getState(page)).inventory[0], 3);
    await page.locator('[data-tool="0"]').click();
    await page.locator('[data-tile="0"]').focus();
    await page.keyboard.press("Enter");
    assert.equal((await getState(page)).tiles[0].soil, true);
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.evaluate(() => document.activeElement.dataset.tile), "1");
    await page.locator('#desktop-shop [data-seed="0"]').click();
    await page.locator('[data-tile="0"]').focus();
    await page.keyboard.press("Space");
    assert.equal((await getState(page)).tiles[0].crop, 0);
    assert.equal((await getState(page)).inventory[0], 2);
    await page.locator('[data-tool="2"]').click();
    await tile(page, 0);
    const watered = await getState(page);
    await tile(page, 0);
    assert.deepEqual(await getState(page), watered);
    await page.locator("#end-day").click();
    await page.locator("#end-day").dispatchEvent("click");
    await page.waitForFunction(() => !document.querySelector("#app").inert);
    let s = await getState(page);
    assert.equal(s.day, 2);
    assert.equal(s.tiles[0].progress, 1);
    assert.equal(s.tiles[8].progress, 2);
    assert.equal(s.tiles[13].progress, 1);
    assert.equal(s.tiles[14].progress, 3);
    assert.ok(s.tiles.every((item) => !item.watered));
    await page.locator("#end-day").click();
    await page.waitForFunction(() => !document.querySelector("#app").inert);
    assert.equal((await getState(page)).tiles[0].progress, 1);
    await tile(page, 0);
    await page.locator("#end-day").click();
    await page.waitForFunction(() => !document.querySelector("#app").inert);
    assert.equal((await getState(page)).tiles[0].progress, 2);
    await page.locator('[data-tool="3"]').click();
    await tile(page, 0);
    assert.equal((await getState(page)).coins, 44);
    const harvested = await getState(page);
    await tile(page, 0);
    assert.deepEqual(await getState(page), harvested);
    record("Desktop real gameplay and keyboard", "Till Enter; Plant Space; arrows; watering; double-day guard; no dry growth; exact inventory and +9 harvest");
    const saved = await getState(page);
    await page.reload();
    await page.waitForSelector("#field");
    assert.deepEqual(await getState(page), saved);
    assert.equal(await page.locator('[data-tool="3"]').getAttribute("aria-pressed"), "true");
    record("Full state persists after reload", "Day, coins, tool, seed, inventory and all tiles unchanged");
    await page.getByRole("button", { name: C.copy.help, exact: true }).click();
    assert.ok(await page.locator("#dialog").evaluate((el) => el.open));
    await page.locator('#dialog [data-close]:not(.dialog-close)').focus();
    await page.keyboard.press("Tab");
    assert.ok(await page.locator("#dialog .dialog-close").evaluate((el) => el === document.activeElement));
    await page.keyboard.press("Escape");
    assert.ok(await page.getByRole("button", { name: C.copy.help, exact: true }).evaluate((el) => el === document.activeElement));
    await page.getByRole("button", { name: C.copy.reset, exact: true }).click();
    await page.getByRole("button", { name: C.copy.keep, exact: true }).click();
    assert.deepEqual(await getState(page), saved);
    await page.evaluate(() => localStorage.setItem("unrelated-test-key", "preserve"));
    await page.getByRole("button", { name: C.copy.reset, exact: true }).click();
    await page.locator("#confirm-reset").click();
    assert.deepEqual(await getState(page), initial());
    assert.equal(await page.evaluate(() => localStorage.getItem("unrelated-test-key")), "preserve");
    record("Help/reset accessible dialog and scoped reset", "Focus trap; Escape; trigger focus restoration; cancel preserves; confirm resets only game data");
    await noOverflow(page, "Desktop post-interaction no overflow");
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    listen(mobile);
    await mobile.goto(server.url);
    await mobile.waitForSelector("#field");
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile, "Mobile 390×844 initial no overflow");
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    assert.equal(await mobile.locator("[data-tile]").count(), 36);
    for (const selector of ["#field", ".toolbelt"])
    {
        const bounds = await mobile.locator(selector).boundingBox();
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y + bounds.height <= 844, selector);
    }
    await mobile.locator('[data-tool="3"]').tap();
    await tile(mobile, 7, true);
    assert.equal((await getState(mobile)).coins, 39);
    await mobile.locator(".mobile-shop").tap();
    await mobile.locator('#dialog [data-buy="2"]').tap();
    assert.equal((await getState(mobile)).coins, 30);
    assert.equal((await getState(mobile)).inventory[2], 1);
    await mobile.locator('#dialog [data-seed="2"]').tap();
    assert.equal((await getState(mobile)).tool, 1);
    assert.equal((await getState(mobile)).seed, 2);
    await noOverflow(mobile, "Mobile open shop no overflow");
    await mobile.locator("#dialog .dialog-close").tap();
    await mobile.locator("#field").scrollIntoViewIfNeeded();
    await tile(mobile, 20, true);
    assert.equal((await getState(mobile)).tiles[20].crop, 2);
    await mobile.locator('[data-tool="2"]').tap();
    await tile(mobile, 20, true);
    assert.equal((await getState(mobile)).tiles[20].watered, true);
    await mobile.emulateMedia({ reducedMotion: "reduce" });
    await mobile.locator("#end-day").tap();
    assert.equal((await getState(mobile)).day, 2);
    assert.equal((await getState(mobile)).tiles[20].progress, 1);
    await mobile.locator(".mobile-shop").tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    await mobile.locator('#dialog [data-buy="0"]').tap();
    assert.equal((await getState(mobile)).coins, 2);
    assert.ok(await mobile.locator('#dialog [data-buy="0"]').isDisabled());
    assert.ok(await mobile.getByText(C.copy.poor, { exact: true }).last().isVisible());
    await mobile.keyboard.press("Escape");
    assert.ok(await mobile.locator(".mobile-shop").evaluate((el) => el === document.activeElement));
    await noOverflow(mobile, "Mobile post-interaction no overflow");
    record("Real touch/mobile core and shop", "Touch harvest +9; strawberry purchase −9; seed select/plant/water; reduced-motion day +1; disabled insufficient purchases; Escape restore");
    await mobileContext.setOffline(true);
    await mobile.locator('[data-tool="0"]').tap();
    await mobile.locator("#field").scrollIntoViewIfNeeded();
    await tile(mobile, 35, true);
    assert.equal((await getState(mobile)).tiles[35].soil, true);
    await mobileContext.setOffline(false);
    record("Offline gameplay after load", "Successful till while browser network offline; no remote state");
    await mobile.evaluate((key) => localStorage.setItem(key, "{bad-json"), C.key);
    await mobile.reload();
    await mobile.waitForSelector("#field");
    assert.deepEqual(await getState(mobile), initial());
    assert.equal(await mobile.locator("#toast").textContent(), C.copy.fresh);
    await mobile.evaluate((key) =>
    {
        const s = JSON.parse(localStorage.getItem(key));
        s.tiles[7].progress = 999;
        localStorage.setItem(key, JSON.stringify(s));
    }, C.key);
    await mobile.reload();
    await mobile.waitForSelector("#field");
    assert.deepEqual(await getState(mobile), initial());
    record("Corrupt and illegal local saves", "Bad JSON and impossible crop progress reset safely to exact initial state");
    const blockedContext = await browser.newContext();
    await blockedContext.addInitScript(() =>
    {
        Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "QuotaExceededError"); };
    });
    const blocked = await blockedContext.newPage();
    listen(blocked);
    await blocked.goto(server.url);
    await blocked.waitForSelector("#field");
    assert.equal(await blocked.locator("#save-status").textContent(), C.copy.unsaved);
    await blocked.locator('[data-tool="0"]').click();
    await tile(blocked, 35);
    assert.equal(await blocked.locator('[data-tile="35"]').getAttribute("aria-label"), "Row 6, column 6 · Tilled soil");
    record("Unavailable storage remains playable and truthful", "Quota failure reports local saving unavailable without runtime error");
    assert.deepEqual(errors, []);
    record("Browser resource and runtime monitoring", "No page/console/request/HTTP errors across desktop, mobile, reloads and storage denial");
    passed = true;
}
catch (error)
{
    errors.push(error.stack);
    throw error;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
    {
        prompt: "599-cozy-isometric-farm-game", modelId: "gpt-6.1-sol", passed, generatedAt: new Date().toISOString(),
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 1440, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1, touch: true }],
        results, errors, screenshots: ["desktop.png", "desktop-wide.png", "mobile.png"], visualReviewed: false, resourcesClosed
    });
    console.log(JSON.stringify({ passed, assertions: results.length, errors, resourcesClosed }));
}
