import path from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "620-theme-park-website", "GPT-6");
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const results = [];
const errors = [];
let browser;
let service;
let resourcesClosed = false;
let failure;
const check = (name, data = {}) => results.push({ name, passed: true, ...data });

async function noOverflow(page, phase)
{
    const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${phase}: overflow ${JSON.stringify(dimensions)}`);
    check(`No horizontal overflow: ${phase}`, dimensions);
}

function monitor(page, viewport)
{
    page.on("pageerror", (error) => errors.push({ type: "pageerror", viewport, message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push({ type: "console", viewport, message: message.text() });
    });
    page.on("requestfailed", (request) => errors.push({ type: "requestfailed", viewport, url: request.url(), message: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push({ type: "http", viewport, status: response.status(), url: response.url() });
    });
}

async function visit(page)
{
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").innerText(), "Pick your thrill.");
    assert.equal(await page.locator(".map-dot").count(), 14);
    assert.equal(await page.locator(".ride-card").count(), 9);
    assert.ok(await page.locator("main").isVisible());
    assert.ok(await page.locator("body").innerText().then((text) => text.length > 1500));
}

try
{
    const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
    const state = await WorkspaceFiles.json(job.stateFile);
    const pid = Number((await readFile(job.promptLock, "utf8")).trim());
    assert.equal(state.runId, job.runId);
    assert.equal(state.ownedLock.prompt, "620-theme-park-website");
    assert.equal(state.ownedLock.pid, pid);
    process.kill(pid, 0);
    service = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.ok(service.url.endsWith("/pages/theme-park-website/GPT-6/index.html"));
    const response = await fetch(service.url);
    assert.equal(response.status, 200);
    const outside = await fetch(new URL("/", service.url));
    assert.equal(outside.status, 404);
    check("Owned helper responsive, final public subpath served, repository root inaccessible", { url: service.url, lockPid: pid });
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    monitor(page, "1200x900");
    await visit(page);
    await noOverflow(page, "desktop before interactions");
    await page.screenshot({ path: path.join(folder, ".checks", "desktop.png"), animations: "disabled" });
    check("Desktop 1200×900 DPR1 real first-screen screenshot, local fonts loaded", {
        fonts: await page.evaluate(() => ["500 20px Fredoka", '400 15px "DM Sans"'].map((font) => ({ font, loaded: document.fonts.check(font) })))
    });
    const dot = page.locator('[data-ride="gumdrop"]');
    await dot.focus();
    await page.keyboard.press("Enter");
    assert.ok(await page.locator("#ride-details").isVisible());
    assert.equal(await page.locator("#detail-title").innerText(), "Gumdrop Coaster");
    assert.equal(await dot.getAttribute("aria-expanded"), "true");
    await page.keyboard.press("Escape");
    assert.ok(await page.locator("#ride-details").isHidden());
    assert.ok(await dot.evaluate((element) => element === document.activeElement));
    await page.keyboard.press("Enter");
    await page.locator('#ride-details [data-add="gumdrop"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".plan-row").count(), 1);
    assert.equal(await page.locator('#ride-details [data-add="gumdrop"]').getAttribute("aria-disabled"), "true");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".plan-row").count(), 1);
    await page.locator("#ride-details .close").click();
    assert.ok(await dot.evaluate((element) => element === document.activeElement));
    await dot.click();
    await page.locator("h1").click();
    assert.ok(await page.locator("#ride-details").isHidden());
    check("Keyboard ride popover, Escape/focus return, X and outside-click close; add is unique");

    await page.locator('.filter-bar [data-filter="thrill"][data-value="wild"]').click();
    assert.equal(await page.locator(".map-dot:not(.dimmed)").count(), 6);
    assert.equal(await page.locator(".ride-card:not(.dimmed)").count(), 4);
    assert.equal(await page.locator('.ride-filters [data-filter="thrill"][data-value="wild"]').getAttribute("aria-pressed"), "true");
    await page.locator('.ride-filters [data-filter="height"][data-value="102"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".map-dot:not(.dimmed)").count(), 5);
    assert.equal(await page.locator(".ride-card:not(.dimmed)").count(), 3);
    await page.locator('.filter-bar [data-filter="height"][data-value="any"]').click();
    assert.equal(await page.locator(".map-dot:not(.dimmed)").count(), 0);
    await page.locator('.filter-bar [data-filter="thrill"][data-value="all"]').click();
    assert.equal(await page.locator(".map-dot:not(.dimmed)").count(), 7);
    await page.locator('.filter-bar [data-filter="height"][data-value="all"]').click();
    check("Shared map/list thrill and cumulative height filters, keyboard filter and zero-match case");
    await page.locator("#rides").screenshot({ path: path.join(folder, ".checks", "rides.png"), animations: "disabled" });
    await page.locator('.ride-card [data-add="taffy"]').click();
    await page.locator('[data-add="parade"]').click();
    await page.locator('[data-add="dive"]').click();
    assert.equal(await page.locator(".plan-row").count(), 4);
    assert.match(await page.locator(".summary").innerText(), /4 stops · 2 rides · 1 shows · 1 parade/);
    await page.locator('[data-move="parade"][data-direction="-1"]').click();
    let order = await page.locator("[data-plan]").evaluateAll((rows) => rows.map((row) => row.dataset.plan));
    assert.deepEqual(order, ["gumdrop", "parade", "taffy", "dive"]);
    await page.locator('[data-move="gumdrop"][data-direction="1"]').focus();
    await page.keyboard.press("Enter");
    order = await page.locator("[data-plan]").evaluateAll((rows) => rows.map((row) => row.dataset.plan));
    assert.deepEqual(order, ["parade", "gumdrop", "taffy", "dive"]);
    await page.locator('[data-complete="gumdrop"]').check();
    assert.match(await page.locator(".summary").innerText(), /1 completed/);
    await page.reload({ waitUntil: "networkidle" });
    assert.deepEqual(await page.locator("[data-plan]").evaluateAll((rows) => rows.map((row) => row.dataset.plan)), order);
    assert.ok(await page.locator('[data-complete="gumdrop"]').isChecked());
    await page.locator('[data-remove="taffy"]').click();
    assert.equal(await page.locator(".plan-row").count(), 3);
    check("Ride/show/parade plan, correct categorized summary, keyboard reorder, completion, reload persistence, remove");
    for (let i = 0; i < 3; i++)
    {
        await page.locator(`[data-ticket="${i}"]`).click();
        assert.ok(await page.locator(".demo-note").isVisible());
        assert.match(await page.locator(".demo-note").innerText(), /no ticketing is connected; nothing is charged/);
    }
    await noOverflow(page, "desktop after filters, popovers, ticket note and itinerary");
    await page.locator("#tickets").screenshot({ path: path.join(folder, ".checks", "tickets.png"), animations: "disabled" });
    check("All three ticket demo controls disclose no connected ticketing or charge");
    await page.locator(".clear").click();
    assert.equal(await page.locator(".plan-row").count(), 0);
    assert.ok(await page.locator(".empty").isVisible());
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("dayPlan"))), []);
    check("Clear plan updates empty state and persisted ids");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(service.url, { waitUntil: "networkidle" });
    await noOverflow(page, "requested 1440x900");
    assert.ok(await page.locator(".map-panel").isVisible());
    check("Additional requested 1440×900 desktop viewport");

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    monitor(mobile, "390x844");
    await visit(mobile);
    await noOverflow(mobile, "mobile before interactions");
    await mobile.screenshot({ path: path.join(folder, ".checks", "mobile.png"), animations: "disabled" });
    await mobile.locator(".menu").tap();
    assert.ok(await mobile.locator(".mobile-nav").isVisible());
    await mobile.locator('.mobile-nav a[href="#rides"]').tap();
    assert.ok(await mobile.locator(".mobile-nav").isHidden());
    await mobile.locator(".menu").focus();
    await mobile.keyboard.press("Enter");
    assert.ok(await mobile.locator(".mobile-nav").isVisible());
    await mobile.keyboard.press("Escape");
    assert.ok(await mobile.locator(".mobile-nav").isHidden());
    assert.ok(await mobile.locator(".menu").evaluate((element) => element === document.activeElement));
    await mobile.locator(".map-scroll").evaluate((element) => { element.scrollLeft = element.scrollWidth; });
    const mobileDot = mobile.locator('[data-ride="wheel"]');
    await mobileDot.focus();
    await mobile.keyboard.press("Enter");
    assert.equal(await mobile.locator("#detail-title").innerText(), "Big Wheel");
    await noOverflow(mobile, "mobile with ride details open");
    await mobile.locator('#ride-details [data-add="wheel"]').tap();
    await mobile.keyboard.press("Escape");
    await mobile.locator('[data-add="glow"]').tap();
    await mobile.locator('[data-move="glow"][data-direction="-1"]').tap();
    assert.equal(await mobile.locator(".plan-row").first().getAttribute("data-plan"), "glow");
    await mobile.locator('[data-complete="wheel"]').check();
    await mobile.locator("#plan").screenshot({ path: path.join(folder, ".checks", "mobile-plan.png"), animations: "disabled" });
    await mobile.locator('[data-ticket="1"]').tap();
    assert.match(await mobile.locator(".demo-note").innerText(), /no ticketing is connected/);
    await mobile.locator('.ride-filters [data-filter="thrill"][data-value="max"]').tap();
    assert.equal(await mobile.locator(".ride-card:not(.dimmed)").count(), 1);
    await noOverflow(mobile, "mobile after menu, map scroll, popover, tickets, filters and itinerary");
    const targetSizes = await mobile.locator(".map-dot, .row-actions button").evaluateAll((buttons) => buttons.every((button) =>
    {
        const rect = button.getBoundingClientRect();
        return rect.width >= 44 && rect.height >= 44;
    }));
    assert.ok(targetSizes);
    check("Mobile 390×844: real screenshot, menu touch/keyboard/Escape, internal map scroll, keyboard ride, itinerary, tickets, shared filters and 44px controls");

    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reduced = await reducedContext.newPage();
    monitor(reduced, "reduced-motion");
    await visit(reduced);
    assert.equal(await reduced.locator(".map-dot").first().evaluate((element) => getComputedStyle(element).animationName), "none");
    await reduced.locator('.ride-card [data-add="gumdrop"]').click();
    assert.equal(await reduced.locator(".confetti").count(), 0);
    check("Reduced-motion preference disables map pops and add confetti");
    await reduced.evaluate(() => localStorage.setItem("dayPlan", "{corrupt"));
    await reduced.reload({ waitUntil: "networkidle" });
    assert.equal(await reduced.locator(".plan-row").count(), 0);
    await reduced.locator('.ride-card [data-add="taffy"]').click();
    assert.equal(await reduced.locator(".plan-row").count(), 1);
    check("Corrupt stored plan recovers safely and remains usable");
    const blockedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await blockedContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage blocked", "SecurityError"); } });
    });
    const blocked = await blockedContext.newPage();
    monitor(blocked, "blocked-storage");
    await visit(blocked);
    await blocked.locator('.ride-card [data-add="gumdrop"]').click();
    assert.equal(await blocked.locator(".plan-row").count(), 1);
    assert.match(await blocked.locator(".plan-note").innerText(), /storage is unavailable/);
    check("Unavailable storage falls back to in-memory plan with honest warning");
    const external = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name).filter((url) => new URL(url).origin !== location.origin));
    assert.deepEqual(external, []);
    check("No external runtime requests");
    const staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "theme-park-website", "GPT-6");
    check("Independent static export and final model-subpath validation", { staticDigest });
    assert.deepEqual(errors, [], "Browser console/page/request/HTTP errors");
    check("Zero browser console, page, request and HTTP errors in all contexts");
}
catch (error)
{
    failure = error.stack || String(error);
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    resourcesClosed = true;
    const qa = {
        prompt: "620-theme-park-website",
        modelId: "gpt-6.1-sol",
        timestamp: new Date().toISOString(),
        passed: !failure,
        assertions: results,
        errors,
        failure: failure || null,
        screenshots: { desktop: ".checks\\desktop.png", mobile: ".checks\\mobile.png" },
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 1440, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        visualReviewed: false,
        resourcesClosed
    };
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: results.length, errors, failure: qa.failure, resourcesClosed }));
}
if (failure) process.exitCode = 1;
