import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.join(workspace, "out", "pages", "563-martial-arts-dojo-website", "GPT-6");
const checks = path.join(folder, ".checks");
const result =
{
    prompt: "563-martial-arts-dojo-website",
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
    assertions: [],
    errors: [],
    screenshots: [],
    resourcesClosed: false
};
let service;
let browser;
const check = (condition, name) =>
{
    assert.ok(condition, name);
    result.assertions.push(name);
};
const observe = (page) =>
{
    page.on("pageerror", (error) => result.errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") result.errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => result.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.errors.push(`http: ${response.status()} ${response.url()}`);
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(service.url.split("/pages/")[0])) result.errors.push(`external request: ${request.url()}`);
        if (!["GET", "HEAD"].includes(request.method())) result.errors.push(`unexpected submission: ${request.method()}`);
    });
};
const overflow = async (page, name) =>
{
    const sizes = await page.evaluate(() => ({ width: innerWidth, actual: document.documentElement.scrollWidth }));
    check(sizes.actual <= sizes.width, `${name}: no document horizontal overflow (${sizes.actual}/${sizes.width})`);
};
const capture = async (page, name, locator) =>
{
    const file = path.join(checks, name);
    await page.waitForTimeout(600);
    if (locator) await locator.evaluate((element) => scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + scrollY - 85), behavior: "instant" }));
    await page.waitForTimeout(650);
    await page.screenshot({ path: file, animations: "disabled" });
    result.screenshots.push(file);
};
const settle = async (page) =>
{
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) => image.decode()));
    });
    await page.waitForTimeout(900);
};
try
{
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    result.url = service.url;
    check(service.url.includes("/pages/martial-arts-dojo-website/GPT-6/index.html"), "Actual final public subpath");
    const readiness = await fetch(service.url);
    check(readiness.status === 200, "Static-only server is running and responsive");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    observe(page);
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    check(response.status() === 200, "Desktop homepage HTTP 200");
    await settle(page);
    check(await page.title() === "Blackpine Martial Academy", "Plain school title");
    check(await page.locator("h1").isVisible() && (await page.locator("body").innerText()).length > 5000, "Meaningful visible nonblank homepage");
    check(await page.locator("main > section").count() === 9, "All nine homepage sections");
    check(await page.locator("img").count() === 7, "Six exact photos used; kids photograph intentionally reused for teens");
    check(await page.evaluate(() => document.fonts.check('700 48px "Big Shoulders Display"') && document.fonts.check('400 16px Figtree')), "Local display/body fonts loaded");
    await overflow(page, "Desktop initial");
    await page.keyboard.press("Tab");
    check(await page.locator(".skip").evaluate((element) => element === document.activeElement), "Keyboard skip link receives first focus");
    await page.keyboard.press("Enter");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await capture(page, "desktop.png");

    await page.locator("#schedule").scrollIntoViewIfNeeded();
    await page.locator('[data-day="Tue"]').click();
    await page.locator('[data-program="Adults"]').focus();
    await page.keyboard.press("Enter");
    check(await page.locator(".class-cell.matched").count() === 1, "Combined Tuesday + Adults filter finds one class");
    check(await page.locator(".class-cell").count() === 14 && await page.locator(".class-cell.dimmed").count() === 13, "Schedule retains all 14 classes and dims nonmatches");
    await page.waitForTimeout(200);
    check(await page.locator(".class-cell.dimmed").first().evaluate((element) => getComputedStyle(element).opacity) === "0.4", "Nonmatching class opacity is 40%");
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator('[data-day="Tue"]').getAttribute("aria-pressed") === "true" && await page.locator('[data-program="Adults"]').getAttribute("aria-pressed") === "true", "Combined schedule filter persists after reload");
    await page.locator('[data-day="Mon"]').click();
    await page.locator('[data-program="Family"]').click();
    check(await page.locator(".class-cell.matched").count() === 0 && (await page.locator("#schedule-status").innerText()).startsWith("No classes"), "Empty combined filter has helpful feedback without hiding classes");
    await page.locator('[data-day="All"]').click();
    await page.locator('[data-program="All"]').click();
    await overflow(page, "Desktop filtered");
    await capture(page, "schedule.png", page.locator("#schedule"));
    await capture(page, "programs.png", page.locator("#programs"));
    await capture(page, "instructors.png", page.locator("#instructors"));
    await capture(page, "pricing.png", page.locator("#pricing"));

    await page.locator("#path").scrollIntoViewIfNeeded();
    const before = await page.locator(".progress-line").evaluate((element) => Number(element.style.strokeDashoffset));
    await page.evaluate(() => scrollBy({ top: 250, behavior: "instant" }));
    await page.waitForTimeout(100);
    const after = await page.locator(".progress-line").evaluate((element) => Number(element.style.strokeDashoffset));
    check(after < before || after === 0, "Belt path stroke advances with actual scrolling");
    await page.locator('[data-rank="4"]').focus();
    await page.keyboard.press("Enter");
    check((await page.locator(".rank-detail").innerText()).includes("Brown · 24–30 months"), "Belt milestones respond to keyboard selection");
    await capture(page, "path.png", page.locator("#path"));

    await page.locator('.program-card [data-track="Teens"]').click();
    check(await page.locator("#track").inputValue() === "Teens 10–15", "Program CTA preselects actual trial track");
    await page.locator("#trial-form").evaluate((form) => form.requestSubmit());
    check(await page.locator('[aria-invalid="true"]').count() === 4 && await page.locator("#trial-form").isVisible(), "Empty booking displays four inline errors without native popups");
    await page.locator("#student").fill("Alex Sample");
    await page.locator("#age").fill("8");
    await page.locator("#guardian").fill("Taylor Sample");
    await page.locator("#contactPhone").fill("(555) 234-5678");
    await page.locator(".submit").click();
    check((await page.locator("#age-error").innerText()).includes("matches"), "Age/track mismatch is rejected");
    await page.locator("#age").fill("13");
    await page.locator('input[name="start"][value="Next week"]').check({ force: true });
    await page.locator(".submit").click();
    check(await page.locator("#success").isVisible() && await page.locator("#student-welcome").innerText() === "Alex Sample", "Valid booking shows personalized local-only success");
    check((await page.locator("#success").innerText()).includes("no text will be sent"), "Confirmation explicitly discloses no real SMS or reservation");
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("blackpine-martial-academy:trial")));
    check(stored.age === 13 && stored.start === "Next week" && stored.track === "Teens 10–15", "Booking includes chosen track, valid age and preferred start");
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#success").isVisible(), "Valid booking restores after reload");
    await page.locator("#book-another").click();
    check(await page.locator("#trial-form").isVisible() && await page.evaluate(() => localStorage.getItem("blackpine-martial-academy:trial")) === null, "Book another removes saved sample and restores form");
    await page.locator('.class-book[data-slot-day="Sat"][data-track="Family"]').click();
    check(await page.locator("#track").inputValue() === "Family" && (await page.locator("#selected-class").innerText()).includes("Sat · 9:00 a.m. · Family"), "Actual timetable class transfers the exact weekly session to booking");
    await page.locator("#student").fill("Family Sample");
    await page.locator("#age").fill("7");
    await page.locator("#guardian").fill("Taylor Sample");
    await page.locator("#contactPhone").fill("5552345678");
    await page.locator(".submit").click();
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator("#success-class").innerText()).includes("Sat · 9:00 a.m. · Family"), "Chosen class persists and restores with the sample booking");
    await page.locator("#book-another").click();
    await page.locator('.class-book[data-slot-day="Mon"][data-track="Kids"]').click();
    await page.locator("#track").selectOption("Adults 16+");
    check(!await page.locator("#selected-class").isVisible(), "Changing track clears incompatible session preference");
    await overflow(page, "Desktop after booking");

    await page.evaluate(() =>
    {
        localStorage.setItem("blackpine-martial-academy:schedule", "{broken");
        localStorage.setItem("blackpine-martial-academy:trial", JSON.stringify({ student: "<img src=x onerror=alert(1)>", age: -1 }));
    });
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator('[data-day="All"]').getAttribute("aria-pressed") === "true" && await page.locator("#trial-form").isVisible(), "Malformed filter JSON and invalid restored booking recover silently");
    await page.evaluate(() => localStorage.setItem("blackpine-martial-academy:trial", "{broken"));
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#trial-form").isVisible(), "Malformed booking JSON recovers silently");
    await page.evaluate(() => localStorage.setItem("blackpine-martial-academy:trial", JSON.stringify({ student: "<img src=x onerror=alert(1)>", age: 20, guardian: "Sample Contact", contactPhone: "5552345678", track: "Adults 16+", start: "This week" })));
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator("#student-welcome img").count() === 0 && (await page.locator("#student-welcome").innerText()).includes("<img"), "Restored names are rendered as text, never executable HTML");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(100);
    check(await page.locator(".progress-line").evaluate((element) => element.style.strokeDashoffset) === "0", "Reduced motion renders complete belt stroke immediately");
    check(await page.locator(".rank.reached").count() === 6, "Reduced motion exposes all six belt milestones");
    check(await page.locator(".hero-photo").evaluate((element) => getComputedStyle(element).animationName) === "none", "Reduced motion disables hero animation");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mp = await mobile.newPage();
    observe(mp);
    check((await mp.goto(service.url, { waitUntil: "networkidle" })).status() === 200, "Mobile homepage HTTP 200");
    await settle(mp);
    await overflow(mp, "Mobile initial");
    const header = await mp.locator(".header-inner").boundingBox();
    const brand = await mp.locator(".header .brand").boundingBox();
    const menu = await mp.locator("#menu-toggle").boundingBox();
    check(brand.y >= header.y && menu.y >= header.y && brand.y + brand.height <= header.y + header.height && menu.y + menu.height <= header.y + header.height, "390px header controls stay on one line");
    const heroBottom = await mp.locator(".hero-bottom").boundingBox();
    const hero = await mp.locator(".hero").boundingBox();
    check(heroBottom.y + heroBottom.height <= hero.y + hero.height + 1, "Mobile hero content remains inside the hero");
    await capture(mp, "mobile.png");
    await mp.locator("#menu-toggle").click();
    check(await mp.locator("#mobile-nav").isVisible(), "Mobile navigation opens");
    await mp.keyboard.press("Escape");
    check(!await mp.locator("#mobile-nav").isVisible() && await mp.locator("#menu-toggle").getAttribute("aria-expanded") === "false", "Escape closes mobile menu and restores accessible state");
    await mp.locator("#menu-toggle").click();
    await mp.locator('#mobile-nav a[href="#schedule"]').click();
    check(!await mp.locator("#mobile-nav").isVisible(), "Mobile navigation anchor closes dropdown");
    await mp.locator('[data-day="Sat"]').click();
    await mp.locator('[data-program="Family"]').click();
    check(await mp.locator(".class-cell.matched").count() === 1, "Mobile Saturday family filter");
    await mp.locator(".table-scroll").evaluate((element) => element.scrollLeft = element.scrollWidth);
    check(await mp.locator(".table-scroll").evaluate((element) => element.scrollLeft > 0), "Mobile timetable scrolls inside its own region");
    await overflow(mp, "Mobile schedule interactions");
    await mp.locator('.mobile-bar a[href="#trial"]').click();
    await mp.locator("#track").selectOption("Adults 16+");
    await mp.locator("#student").fill("Jordan Sample");
    await mp.locator("#age").fill("44");
    await mp.locator("#guardian").fill("Jordan Sample");
    await mp.locator("#contactPhone").fill("invalid");
    await mp.locator(".submit").click();
    check((await mp.locator("#contactPhone-error").innerText()).includes("7–15"), "Mobile invalid phone displays inline validation");
    await mp.locator("#contactPhone").fill("555 234 6789");
    check(await mp.locator("#contactPhone-error").innerText() === "" && await mp.locator("#contactPhone").getAttribute("aria-invalid") === null, "Editing a field clears stale inline validation feedback");
    await mp.locator(".submit").scrollIntoViewIfNeeded();
    await mp.waitForTimeout(400);
    const submit = await mp.locator(".submit").boundingBox();
    const bar = await mp.locator(".mobile-bar").boundingBox();
    check(submit.y + submit.height <= bar.y, "Mobile sticky bar does not cover the visible submit control");
    await capture(mp, "trial-mobile.png");
    await mp.locator(".submit").click();
    check(await mp.locator("#success").isVisible(), "Mobile adult booking succeeds locally");
    await overflow(mp, "Mobile after booking");
    await mp.locator("#book-another").click();
    await mp.evaluate(() =>
    {
        Object.defineProperty(Storage.prototype, "setItem", { configurable: true, value() { throw new DOMException("Blocked", "SecurityError"); } });
    });
    await mp.locator("#track").selectOption("Family");
    await mp.locator("#student").fill("Casey Sample");
    await mp.locator("#age").fill("7");
    await mp.locator("#guardian").fill("Taylor Sample");
    await mp.locator("#contactPhone").fill("5552346789");
    await mp.locator(".submit").click();
    check(await mp.locator("#storage-note").innerText() === "Browser storage is unavailable. This sample is kept for this visit only.", "Blocked localStorage keeps booking functional with honest fallback");
    await mp.setViewportSize({ width: 320, height: 740 });
    await overflow(mp, "320px compact phone");
    await mobile.close();
    check(result.errors.length === 0, "No console, page, HTTP, failed resource, external request or submission errors");
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    result.resourcesClosed = true;
    result.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
