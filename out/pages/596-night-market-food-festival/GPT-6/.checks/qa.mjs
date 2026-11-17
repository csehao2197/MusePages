import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const folder = path.resolve("out", "pages", "596-night-market-food-festival", "GPT-6");
const checks = path.join(folder, ".checks");
const storageKey = "lantern-row-night-market-vendor-application";
const report =
{
    prompt: "596-night-market-food-festival",
    modelId: "gpt-6.1-sol",
    executedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    requestMethods: {},
    externalRequests: [],
    errors: [],
    resourcesClosed: false
};
let server;
let browser;
let failure;
const check = (condition, name) =>
{
    assert.ok(condition, name);
    report.assertions.push(name);
};
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ layout: innerWidth, document: document.documentElement.scrollWidth, offset: visualViewport?.offsetLeft || 0 }));
    const viewport = page.viewportSize().width;
    check(sizes.document <= viewport && sizes.layout <= viewport && sizes.offset === 0, `${label}: no page horizontal overflow or viewport panning (${sizes.document}/${viewport})`);
}
async function settle(page)
{
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
}
function track(page, label)
{
    page.on("request", (request) =>
    {
        const method = request.method();
        report.requestMethods[method] = (report.requestMethods[method] || 0) + 1;
        if (new URL(request.url()).origin !== new URL(server.url).origin)
        {
            report.externalRequests.push(request.url());
        }
    });
    page.on("pageerror", (error) => report.errors.push(`${label} page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            report.errors.push(`${label} console: ${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => report.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            report.errors.push(`${label} HTTP ${response.status()}: ${response.url()}`);
        }
    });
}
async function visit(page, label)
{
    track(page, label);
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    check(response.status() === 200, `${label}: homepage HTTP 200`);
    await settle(page);
    check(await page.locator("h1").isVisible(), `${label}: meaningful visible hero`);
    check((await page.locator("main").textContent()).length > 5000 && await page.locator("h2").count() === 5, `${label}: full nonblank homepage with map, schedule, tickets, application and FAQ`);
    await noOverflow(page, `${label} initial`);
}
try
{
    const exported = path.join(folder, "out");
    const digest = await StaticHomepage.validateStaticOutput(exported, "night-market-food-festival", "GPT-6");
    report.staticDigest = digest;
    server = await startPreviewServer(exported, { workspace: root });
    check(new URL(server.url).pathname === "/pages/night-market-food-festival/GPT-6/index.html", "Only actual final public subpath is served");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    report.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    await visit(page, "desktop");
    check((await page.request.get(new URL("/README.md", server.url).href)).status() === 404, "Preview server does not expose repository source");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    check(await page.locator(".vendor-pin").count() === 18, "Map contains all eighteen vendor pins");
    check(await page.locator(".map-utility rect").count() === 2, "Map has separate tokens and first-aid utility stalls");
    check(await page.locator(".map-stages rect").count() === 2, "Map has two stage blocks");
    check(await page.locator(".stage li").count() === 11, "Both stages contain all eleven weekday-pattern performances");
    check(await page.locator(".tier").count() === 3, "All three pass tiers exist");
    await page.getByRole("button", { name: "Taiwanese", exact: true }).click();
    check(await page.locator(".vendor-pin.dimmed").count() === 15, "Cuisine filter dims exactly fifteen nonmatching stalls");
    check(await page.getByRole("button", { name: "Taiwanese", exact: true }).getAttribute("aria-pressed") === "true", "Cuisine chip exposes active pressed state");
    const pin = page.locator('.vendor-pin[data-vendor="0"]');
    await pin.focus();
    await page.keyboard.press("Enter");
    check(await page.locator(".vendor-card h3").innerText() === "Ah-Ma’s Table", "Keyboard Enter opens the correct vendor");
    check((await page.locator(".signature").innerText()).includes("pork belly bao"), "Vendor card shows the actual signature dish");
    check((await page.locator(".vendor-price").innerText()).includes("$5.00"), "Vendor token price corresponds to its dollar estimate");
    await noOverflow(page, "desktop vendor open");
    await page.locator("#map").scrollIntoViewIfNeeded();
    await settle(page);
    await page.screenshot({ path: path.join(checks, "desktop-map.png") });
    await page.keyboard.press("Escape");
    check(await pin.evaluate((element) => element === document.activeElement), "Escape closes vendor card and returns focus to original pin");
    await page.keyboard.press("Space");
    check(await page.locator(".vendor-card").evaluate((element) => element.classList.contains("is-open")), "Keyboard Space opens vendor details");
    await page.getByRole("button", { name: "Close vendor details" }).click();
    await page.getByRole("button", { name: "All", exact: true }).click();
    check(await page.locator(".vendor-pin.dimmed").count() === 0, "All filter restores every vendor");
    await page.locator(".vendor-directory summary").click();
    check(await page.locator("[data-directory-vendor]").count() === 18, "Text alternative lists all eighteen vendors");
    await page.locator('[data-directory-vendor="10"]').click();
    check(await page.locator(".vendor-card h3").innerText() === "Copper Kebab", "Text directory opens the matching map vendor");
    await page.keyboard.press("Escape");
    await page.locator(".vendor-directory summary").click();
    await page.locator('[data-pass="1"]').click();
    check((await page.locator("#pass-selection").innerText()).includes("10 tokens"), "Feast Pass selection includes ten tokens");
    await page.locator("#extra").selectOption("2");
    check(await page.locator("#plan-total").innerText() === "$40.00", "Token estimator calculates $35 plus two $2.50 tokens");
    await noOverflow(page, "desktop ticket plan open");
    await page.locator("#tickets").scrollIntoViewIfNeeded();
    await settle(page);
    await page.screenshot({ path: path.join(checks, "desktop-tickets.png") });
    await page.locator("#clear-pass").click();
    check(await page.locator(".pass-plan").isHidden(), "Local ticket plan clears without a checkout");
    await page.locator("#vendor-form button[type=submit]").click();
    check(await page.locator("#name-error").innerText() === "Please add your contact name.", "Application rejects missing contact name inline");
    check(await page.locator("#dish-error").innerText() === "Tell us your signature dish.", "Application rejects missing signature dish inline");
    check(await page.locator("#email-error").innerText() === "Please enter a valid email address.", "Application rejects missing email inline");
    await page.locator("#name").fill("Morgan Reed");
    await page.locator("#dish").fill("Charred mushroom skewers");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#vendor-form button[type=submit]").click();
    check(await page.locator("#email").getAttribute("aria-invalid") === "true", "Invalid email stays in local form with accessible error");
    await page.locator("#email").fill("morgan@example.com");
    await page.locator("#business").fill("Fable Grill");
    await page.locator("#cuisine").selectOption("Vegan");
    await page.getByLabel("Saturdays", { exact: true }).check();
    await page.locator("#message").fill("One smoky signature dish for a long night.");
    await page.locator("#vendor-form button[type=submit]").click();
    check(await page.locator(".application-success").isVisible(), "Valid application displays local-only success");
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
    check(stored.name === "Morgan Reed" && stored.cuisine === "Vegan" && stored.day === "Saturdays", "Application saves exact local fields and weekday choice");
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator(".application-success").isVisible(), "Valid application restores success after reload");
    await page.evaluate(() =>
    {
        window.originalRemoveItem = Storage.prototype.removeItem;
        Storage.prototype.removeItem = function ()
        {
            throw new DOMException("Storage unavailable", "SecurityError");
        };
    });
    await page.locator("#start-over").click();
    check(await page.locator("#reset-error").isVisible() && await page.locator(".application-success").isVisible(), "Blocked storage removal reports failure and preserves the saved state");
    await page.evaluate(() => Storage.prototype.removeItem = window.originalRemoveItem);
    await page.locator("#start-over").click();
    check(await page.evaluate((key) => localStorage.getItem(key), storageKey) === null, "Start over deletes the saved local application");
    check(await page.locator("#name").inputValue() === "", "Start over clears the form");
    await page.evaluate((key) => localStorage.setItem(key, "{broken"), storageKey);
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#vendor-form").isVisible(), "Corrupt saved JSON recovers silently to the editable form");
    await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ name: "<script>", email: 123 })), storageKey);
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#vendor-form").isVisible(), "Wrong-shaped saved application is rejected safely");
    await page.locator("#faq summary").first().focus();
    await page.keyboard.press("Enter");
    check(await page.locator("#faq details").first().getAttribute("open") !== null, "FAQ opens with keyboard Enter");
    await page.keyboard.press("Space");
    check(await page.locator("#faq details").first().getAttribute("open") === null, "FAQ closes with keyboard Space");
    for (const id of ["schedule", "tickets", "vendors", "faq"])
    {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        await settle(page);
        if (id === "schedule")
        {
            await page.locator("#schedule").screenshot({ path: path.join(checks, "desktop-schedule.png") });
        }
    }
    check(await page.locator("img").evaluateAll((images) => images.length === 6 && images.every((img) => img.complete && img.naturalWidth > 0)), "All six exact template photographs load locally");
    await noOverflow(page, "desktop after all interactions");
    await page.locator("#vendors").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(checks, "desktop-application.png") });
    await page.locator(".moments").scrollIntoViewIfNeeded();
    await settle(page);
    await page.locator(".moments").screenshot({ path: path.join(checks, "desktop-moments.png") });
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    report.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const small = await mobile.newPage();
    await visit(small, "mobile");
    await small.screenshot({ path: path.join(checks, "mobile.png") });
    await small.getByRole("button", { name: "Explore", exact: true }).click();
    check(await small.locator("#mobile-nav").isVisible(), "Mobile navigation expands");
    await small.locator('#mobile-nav a[href="#map"]').click();
    check(await small.locator("#mobile-nav").isHidden(), "Mobile navigation closes after choosing map");
    await small.getByRole("button", { name: "Vegan", exact: true }).click();
    check(await small.locator(".vendor-pin.dimmed").count() === 16, "Mobile Vegan filter leaves exactly two matching vendors");
    const mobilePin = small.locator('.vendor-pin[data-vendor="14"]');
    await mobilePin.scrollIntoViewIfNeeded();
    await mobilePin.click();
    check(await small.locator(".vendor-card").getAttribute("aria-modal") === "true", "Mobile vendor opens as a true modal bottom sheet");
    check(await small.locator(".vendor-card h3").innerText() === "Green Griddle", "Mobile sheet shows the tapped vendor, not a generic card");
    check(await small.locator(".header").evaluate((element) => element.inert), "Mobile modal makes background navigation inert");
    await small.keyboard.press("Shift+Tab");
    check(await small.locator(".legend-link").evaluate((element) => element === document.activeElement), "Mobile dialog traps reverse Tab inside the sheet");
    await small.keyboard.press("Tab");
    check(await small.locator(".close-card").evaluate((element) => element === document.activeElement), "Mobile dialog traps forward Tab inside the sheet");
    await noOverflow(small, "mobile sheet open");
    await settle(small);
    await small.screenshot({ path: path.join(checks, "mobile-map-sheet.png") });
    await small.keyboard.press("Escape");
    check(await small.locator(".vendor-card").isHidden(), "Mobile Escape dismisses the sheet");
    check(!(await small.locator(".header").evaluate((element) => element.inert)), "Mobile sheet restores background interactivity");
    await small.getByRole("button", { name: "All", exact: true }).click();
    await small.locator('[data-pass="2"]').click();
    await small.locator("#extra").selectOption("4");
    check(await small.locator("#plan-total").innerText() === "$38.00", "Mobile Family Pack estimator calculates extra tokens");
    await noOverflow(small, "mobile ticket selection");
    await small.locator("#vendor-form button[type=submit]").click();
    check(await small.locator("#name-error").isVisible(), "Mobile application displays inline validation");
    await small.locator("#name").fill("Rowan");
    await small.locator("#dish").fill("Crispy tofu");
    await small.locator("#email").fill("rowan@example.com");
    await small.locator("#vendor-form button[type=submit]").click();
    check(await small.locator(".application-success").isVisible(), "Mobile application saves successfully without a network submission");
    await small.locator("#start-over").click();
    await small.locator(".application-card").screenshot({ path: path.join(checks, "mobile-application.png") });
    await small.locator("#faq summary").nth(4).click();
    check(await small.locator("#faq details").nth(4).getAttribute("open") !== null, "Mobile allergen FAQ expands");
    await noOverflow(small, "mobile after all interactions");
    const reduced = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    const quiet = await reduced.newPage();
    await visit(quiet, "reduced-motion");
    check(await quiet.locator(".lantern-string").evaluate((element) => getComputedStyle(element).animationName) === "none", "Reduced motion disables lantern animation");
    await quiet.getByRole("button", { name: "Korean", exact: true }).click();
    check(await quiet.locator(".vendor-pin").first().evaluate((element) => getComputedStyle(element).transitionDuration) === "0s", "Reduced motion makes map changes instant");
    const quietPin = quiet.locator('.vendor-pin[data-vendor="2"]');
    await quietPin.focus();
    await quiet.keyboard.press("Enter");
    check(await quiet.locator(".vendor-card h3").innerText() === "Two Suns BBQ", "Reduced-motion map interactions remain functional");
    await quiet.keyboard.press("Escape");
    await quiet.evaluate(() => Object.defineProperty(Storage.prototype, "setItem", { value() { throw new DOMException("Storage unavailable", "SecurityError"); }, configurable: true }));
    await quiet.locator("#name").fill("Taylor");
    await quiet.locator("#dish").fill("Night noodles");
    await quiet.locator("#email").fill("taylor@example.com");
    await quiet.locator("#vendor-form button[type=submit]").click();
    check(await quiet.locator("#storage-error").isVisible(), "Blocked localStorage shows an honest unsaved error");
    check(await quiet.locator(".application-success").isHidden(), "Blocked storage never claims a successful application");
    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    report.viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1 });
    const large = await wide.newPage();
    await visit(large, "wide-desktop");
    await large.locator("#map").scrollIntoViewIfNeeded();
    await noOverflow(large, "wide-desktop map");
    check(report.errors.length === 0, "No console, page, request, resource, or HTTP errors in actual page browsing");
    check(Object.keys(report.requestMethods).every((method) => method === "GET") && report.externalRequests.length === 0, "All browser requests are local GET assets; no submissions, APIs, analytics, external fonts or checkout");
    report.passed = true;
}
catch (error)
{
    failure = error;
    report.failure = error.stack;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (server)
    {
        await server.close();
    }
    report.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), report);
}
console.log(JSON.stringify({ passed: report.passed, assertions: report.assertions.length, errors: report.errors, resourcesClosed: report.resourcesClosed, failure: report.failure }));
if (failure)
{
    process.exitCode = 1;
}
