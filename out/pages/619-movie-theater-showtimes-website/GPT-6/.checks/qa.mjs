import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium, expect } from "@playwright/test";

const model = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { content } = await import(pathToFileURL(path.join(model, "content.js")));
const checks = [];
const errors = [];
const viewports = [];
let browser;
let service;
let failure;
let resourcesClosed = false;
let resourceResponses = 0;
const screenshot = (file) => path.join(model, ".checks", file);

function track(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        resourceResponses++;
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
}

async function goto(page, relative = "index.html")
{
    const response = await page.goto(new URL(relative, service.url).href, { waitUntil: "networkidle" });
    expect(response.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("main")).toBeVisible();
    expect((await page.locator("body").innerText()).trim().length).toBeGreaterThan(300);
    expect(new URL(page.url()).pathname).toContain("/pages/movie-theater-showtimes-website/GPT-6/");
}

async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    expect(dimensions.scroll, label).toBeLessThanOrEqual(dimensions.client);
    expect(dimensions.body, label).toBeLessThanOrEqual(dimensions.client);
    checks.push({ assertion: `${label}: no horizontal overflow`, ...dimensions, passed: true });
}

async function check(name, run)
{
    await run();
    checks.push({ assertion: name, passed: true });
}

try
{
    const metadata = await W.json(path.join(model, "metadata.json"));
    expect(metadata.modelId).toBe("gpt-6.1-sol");
    const staticDigest = await S.validateStaticOutput(path.join(model, "out"), "movie-theater-showtimes-website", "GPT-6");
    checks.push({ assertion: "StaticHomepage independent export validation", passed: true, staticDigest });
    service = await startPreviewServer(path.join(model, "out"), { workspace });
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    viewports.push({ name: "desktop", width: 1200, height: 900, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    track(page);
    await goto(page);
    await check("Homepage: six code-drawn posters, 18 bulbs per row, local fonts and Friday default", async () =>
    {
        await expect(page.locator(".film-card")).toHaveCount(6);
        await expect(page.locator(".poster")).toHaveCount(6);
        await expect(page.locator(".bulbs")).toHaveCount(2);
        for (const row of await page.locator(".bulbs").all()) await expect(row.locator("i")).toHaveCount(18);
        await expect(page.locator('[data-day="Fri"]')).toHaveAttribute("aria-pressed", "true");
        await expect(page.locator(".weekend-note")).toHaveText("Weekend screenings only");
        expect(await page.evaluate(() => document.fonts.check('16px "Bungee"') && document.fonts.check('16px "Karla"') && document.fonts.check('16px "Courier Prime"'))).toBe(true);
        expect(await page.locator(".poster text").count()).toBe(0);
    });
    await noOverflow(page, "Desktop homepage before interaction");
    await page.waitForTimeout(700);
    await page.screenshot({ path: screenshot("desktop.png") });
    await page.locator("#now-showing").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: screenshot("desktop-program.png") });
    await check("Membership and visit show three informative tiers, prices, address and house hours", async () =>
    {
        await page.locator("#membership").scrollIntoViewIfNeeded();
        await page.waitForTimeout(650);
        await expect(page.locator(".tier")).toHaveCount(3);
        await expect(page.locator(".tier").nth(1)).toContainText("$17");
        await expect(page.locator("#membership")).toContainText("no signup flow");
        await page.screenshot({ path: screenshot("desktop-membership.png") });
        await expect(page.locator("#visit")).toContainText("14 Marquee Lane, Old Milltown");
        await expect(page.locator(".hours > div")).toHaveCount(3);
    });
    await check("Desktop keyboard navigation and Saturday screening pattern", async () =>
    {
        const saturday = page.locator('#showtimes [data-day="Sat"]');
        await saturday.focus();
        await page.keyboard.press("Enter");
        await expect(saturday).toHaveAttribute("aria-pressed", "true");
        const rows = page.locator(".showtime-row");
        await expect(rows.nth(1).locator(".time-pill")).toHaveCount(4);
        await expect(rows.nth(1)).toContainText("23:00");
        await expect(rows.nth(2).locator(".time-pill")).toHaveCount(2);
        await expect(rows.nth(2)).toContainText("11:00");
        await page.locator('#showtimes [data-day="Tue"]').click();
        await expect(rows.nth(2).locator(".time-pill")).toHaveCount(0);
        await expect(rows.nth(0).locator(".time-pill")).toHaveCount(3);
        await expect(page.locator(".cheap")).toContainText("$7 at the door");
    });
    await check("Ticker pause and resume controls change the real animation state", async () =>
    {
        await page.locator("#ticker-toggle").click();
        await expect(page.locator(".ticker-track")).toHaveClass(/paused/);
        await expect(page.locator("#ticker-toggle")).toHaveAttribute("aria-label", "Resume ticker");
        await page.locator("#ticker-toggle").click();
        await expect(page.locator(".ticker-track")).not.toHaveClass(/paused/);
    });
    await noOverflow(page, "Desktop homepage after day/ticker interactions");
    await check("Showtime link opens actual film and preserves selected day/time", async () =>
    {
        await page.locator(".showtime-row").first().getByRole("link", { name: "Midnight Orchard, Tue 16:15", exact: true }).click();
        await expect(page.locator("h1")).toHaveText("Midnight Orchard");
        await expect(page.locator("#screening-heading")).toHaveText("SCREEN ONE · TUE · 16:15");
        await expect(page.locator("#discount-note")).toBeVisible();
    });
    await noOverflow(page, "Desktop film before selection");
    await check("96-seat map, 25 fixed taken seats, 71 available seats, initial disabled hold", async () =>
    {
        await expect(page.locator("[data-seat]")).toHaveCount(96);
        await expect(page.locator(".seat.taken")).toHaveCount(25);
        await expect(page.locator(".seat:not(.taken)")).toHaveCount(71);
        await expect(page.locator('[data-seat="A2"]')).toBeDisabled();
        await expect(page.locator("#hold-seats")).toBeDisabled();
    });
    await check("Keyboard selects and deselects seats; arrow key skips taken seats; live pricing", async () =>
    {
        await page.locator('[data-seat="A1"]').focus();
        await page.keyboard.press("Space");
        await expect(page.locator("#seat-total")).toHaveText("1 SEATS · $11");
        await page.keyboard.press("ArrowRight");
        await expect(page.locator('[data-seat="A4"]')).toBeFocused();
        await page.keyboard.press("Enter");
        await page.locator('[data-seat="H12"]').click();
        await expect(page.locator("#seat-total")).toHaveText("3 SEATS · $33");
        await page.locator('[data-seat="H12"]').click();
        await expect(page.locator("#seat-total")).toHaveText("2 SEATS · $22");
    });
    await check("Local hold is real device persistence, explicit no charge, reload restoration and clearing", async () =>
    {
        await page.locator("#hold-seats").click();
        await expect(page.locator("#hold-panel")).toContainText("No booking was made and nothing was charged.");
        const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("the-ruby-lantern-hold")));
        expect(stored).toEqual({ film: "midnight-orchard", day: "Tue", time: "16:15", seats: ["A1", "A4"] });
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("#seat-total")).toHaveText("2 SEATS · $22");
        await expect(page.locator("#hold-panel")).toContainText("restored");
        await page.locator("#clear-hold").click();
        expect(await page.evaluate(() => localStorage.getItem("the-ruby-lantern-hold"))).toBeNull();
        await expect(page.locator("#seat-total")).toHaveText("0 SEATS · $0");
    });
    await check("Day/time changes clear selection, update headings and canonical query context", async () =>
    {
        await page.locator('[data-seat="A1"]').click();
        await page.locator('[data-time="19:00"]').click();
        await expect(page.locator("#seat-total")).toHaveText("0 SEATS · $0");
        await expect(page.locator("#screening-heading")).toHaveText("SCREEN ONE · TUE · 19:00");
        await page.locator('[data-seat="C1"]').click();
        await page.locator('[data-day="Fri"]').click();
        await expect(page.locator("#seat-total")).toHaveText("0 SEATS · $0");
        await expect(page.locator("#screening-heading")).toHaveText("SCREEN ONE · FRI · 19:00");
        expect(new URL(page.url()).searchParams.get("day")).toBe("Fri");
        await expect(page.locator("#discount-note")).toBeHidden();
        await page.locator('[data-seat="H1"]').click();
        await page.locator('[data-seat="H12"]').click();
        await page.locator("#hold-seats").click();
    });
    await noOverflow(page, "Desktop film after selections and local hold");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(700);
    await expect(page.locator(".detail-copy")).toHaveCSS("opacity", "1");
    await page.locator("#seat-picker").scrollIntoViewIfNeeded();
    await page.screenshot({ path: screenshot("desktop-seats.png"), fullPage: true });
    await check("All six real film pages contain the matching poster and both program notes", async () =>
    {
        for (const film of content.films)
        {
            await goto(page, `film.html?film=${film.slug}`);
            await expect(page.locator("h1")).toHaveText(film.title);
            await expect(page.locator(".program-notes p")).toHaveCount(2);
            for (const paragraph of film.notes) await expect(page.locator(".program-notes")).toContainText(paragraph);
            await expect(page.locator(".poster")).toHaveCount(1);
            await noOverflow(page, `Desktop ${film.slug}`);
        }
    });
    await check("Family film has no fake weekday booking, weekend enables correct screening and seats", async () =>
    {
        await goto(page, "film.html?film=fox-of-fetter-lane&day=Mon&time=19:00");
        await expect(page.locator("#detail-times")).toContainText("No screenings on this day");
        await expect(page.locator("#hold-seats")).toBeDisabled();
        await expect(page.locator(".seat:disabled")).toHaveCount(96);
        await page.locator('[data-day="Sun"]').click();
        await expect(page.locator("#detail-times button")).toHaveCount(2);
        await expect(page.locator("#screening-heading")).toHaveText("SCREEN ONE · SUN · 11:00");
        await expect(page.locator('[data-seat="A1"]')).toBeEnabled();
    });
    await check("Unknown and missing film queries both fall back to first film / Friday 19:00", async () =>
    {
        for (const url of ["film.html", "film.html?film=unknown&day=Sun&time=garbage"])
        {
            await goto(page, url);
            await expect(page.locator("h1")).toHaveText("Midnight Orchard");
            await expect(page.locator("#screening-heading")).toHaveText("SCREEN ONE · FRI · 19:00");
        }
    });
    await check("Malformed local data cannot select taken/nonexistent seats", async () =>
    {
        await page.evaluate(() => localStorage.setItem("the-ruby-lantern-hold", JSON.stringify({ film: "midnight-orchard", day: "Fri", time: "19:00", seats: ["A2", "Z99"] })));
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("#seat-total")).toHaveText("0 SEATS · $0");
        await expect(page.locator('[data-seat="A2"]')).toBeDisabled();
    });
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    viewports.push({ name: "mobile", width: 390, height: 844, deviceScaleFactor: 1 });
    const phone = await mobile.newPage();
    track(phone);
    await goto(phone);
    await noOverflow(phone, "Mobile homepage before interactions");
    await phone.waitForTimeout(650);
    await phone.screenshot({ path: screenshot("mobile.png") });
    await phone.locator("#now-showing").scrollIntoViewIfNeeded();
    await phone.waitForTimeout(800);
    await phone.screenshot({ path: screenshot("mobile-program.png") });
    await phone.locator("#membership").scrollIntoViewIfNeeded();
    await phone.waitForTimeout(650);
    await noOverflow(phone, "Mobile membership and visit");
    await phone.screenshot({ path: screenshot("mobile-membership.png") });
    await phone.evaluate(() => window.scrollTo(0, 0));
    await check("Mobile drawer opens, keyboard Escape returns focus, section link navigates and closes", async () =>
    {
        const button = phone.locator(".menu-button");
        await button.click();
        await expect(phone.locator("#mobile-nav")).toBeVisible();
        await expect(button).toHaveAttribute("aria-expanded", "true");
        await phone.keyboard.press("Escape");
        await expect(button).toBeFocused();
        await expect(phone.locator("#mobile-nav")).toBeHidden();
        await button.click();
        await phone.locator("#mobile-nav").getByRole("link", { name: "Showtimes", exact: true }).click();
        await expect(phone.locator("#mobile-nav")).toBeHidden();
        await expect(phone).toHaveURL(/#showtimes$/);
        await phone.locator('#showtimes [data-day="Sun"]').click();
        await expect(phone.locator(".showtime-row").nth(1)).toContainText("23:00");
    });
    await noOverflow(phone, "Mobile homepage after drawer/day interaction");
    await check("Mobile film selection, seat tap, pricing, hold and reset all work", async () =>
    {
        await phone.locator(".showtime-row").nth(2).getByRole("link", { name: "The Fox of Fetter Lane, Sun 14:00", exact: true }).click();
        await expect(phone.locator("h1")).toHaveText("The Fox of Fetter Lane");
        await expect(phone.locator("#screening-heading")).toHaveText("SCREEN ONE · SUN · 14:00");
        await noOverflow(phone, "Mobile film before interaction");
        await phone.locator('[data-seat="H1"]').tap();
        await phone.locator('[data-seat="H12"]').tap();
        await expect(phone.locator("#seat-total")).toHaveText("2 SEATS · $22");
        await phone.locator("#hold-seats").tap();
        await expect(phone.locator("#hold-panel")).toContainText("Held on this device");
        await phone.locator('[data-time="11:00"]').tap();
        await expect(phone.locator("#seat-total")).toHaveText("0 SEATS · $0");
        await phone.locator('[data-seat="B1"]').tap();
        await phone.locator("#hold-seats").tap();
        await phone.waitForTimeout(500);
        await phone.screenshot({ path: screenshot("mobile-seats.png"), fullPage: true });
    });
    await noOverflow(phone, "Mobile film after selection/hold/reset");
    await check("Small 320px screen also fits the 96-seat auditorium and navigation", async () =>
    {
        await phone.setViewportSize({ width: 320, height: 760 });
        await noOverflow(phone, "320px film");
        await goto(phone);
        await noOverflow(phone, "320px homepage");
    });
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const quiet = await reduced.newPage();
    track(quiet);
    await goto(quiet);
    await check("Reduced motion: static bulbs, wrapped ticker, immediate reveals, responsive layout", async () =>
    {
        const styles = await quiet.evaluate(() => ({
            bulbs: getComputedStyle(document.querySelector(".bulbs i")).animationName,
            ticker: getComputedStyle(document.querySelector(".ticker-track")).animationName,
            revealOpacity: getComputedStyle(document.querySelector(".reveal")).opacity,
            duplicate: getComputedStyle(document.querySelector(".ticker-track > div + div")).display
        }));
        expect(styles).toEqual({ bulbs: "none", ticker: "none", revealOpacity: "1", duplicate: "none" });
        await noOverflow(quiet, "Mobile reduced-motion homepage");
    });
    const unavailable = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await unavailable.addInitScript(() =>
    {
        Object.defineProperty(Storage.prototype, "setItem", { value() { throw new DOMException("Unavailable", "SecurityError"); } });
    });
    const blocked = await unavailable.newPage();
    track(blocked);
    await check("Unavailable storage shows a truthful warning without booking or uncaught errors", async () =>
    {
        await goto(blocked, "film.html");
        await blocked.locator('[data-seat="A1"]').click();
        await blocked.locator("#hold-seats").click();
        await expect(blocked.locator("#hold-panel")).toContainText("no hold was saved and nothing was charged");
    });
    await check("All local links stay at real .html files/sections; public export excludes private source", async () =>
    {
        await goto(page);
        const links = await page.locator('a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
        expect(links.filter((href) => !href.startsWith("#") && !href.startsWith("https:")).every((href) => /^\.\/(?:index|film)\.html/.test(href))).toBe(true);
        expect(await page.locator('script[src^="http"], link[href^="http"], img').count()).toBe(0);
        expect(errors).toEqual([]);
    });
}
catch (error)
{
    failure = error.stack || String(error);
}
finally
{
    await browser?.close();
    await service?.close();
    resourcesClosed = true;
    await W.saveJson(path.join(model, ".checks", "qa.json"),
    {
        status: failure || errors.length ? "failed" : "passed",
        modelId: "gpt-6.1-sol",
        staticMount: "/pages/movie-theater-showtimes-website/GPT-6/",
        viewports,
        checks,
        errors,
        failure: failure || null,
        successfulResourceResponses: resourceResponses,
        screenshots: ["desktop.png", "mobile.png", "desktop-program.png", "mobile-program.png", "desktop-membership.png", "mobile-membership.png", "desktop-seats.png", "mobile-seats.png"],
        visualReviewed: false,
        resourcesClosed
    });
}
console.log(JSON.stringify({ status: failure || errors.length ? "failed" : "passed", assertions: checks.length, errors, failure, resourcesClosed }));
if (failure || errors.length) process.exitCode = 1;
