import path from "node:path";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";
import { startPreviewServer } from "./generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.join(workspace, "out", "pages", "546-surf-school-website", "GPT-6");
const exported = path.join(folder, "out");
const checks = await WorkspaceFiles.ensureDirectory(folder, ".checks");
const result =
{
    prompt: "546-surf-school-website",
    modelId: "gpt-6.1-sol",
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: {},
    resourcesClosed: false
};
let browser;
let service;

function passed(name, evidence)
{
    result.assertions.push({ name, passed: true, evidence });
}

function monitor(page, label)
{
    page.on("console", (message) =>
    {
        if (message.type() === "error") result.errors.push({ label, type: "console", message: message.text() });
    });
    page.on("pageerror", (error) => result.errors.push({ label, type: "pageerror", message: error.message }));
    page.on("requestfailed", (request) => result.errors.push({ label, type: "request", url: request.url(), message: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.errors.push({ label, type: "http", url: response.url(), status: response.status() });
    });
    page.on("request", (request) =>
    {
        if (new URL(request.url()).origin !== new URL(service.url).origin) result.errors.push({ label, type: "external-network", url: request.url() });
        if (!["GET", "HEAD"].includes(request.method())) result.errors.push({ label, type: "submission", method: request.method(), url: request.url() });
    });
}

async function overflow(page, name)
{
    const evidence = await page.evaluate(() =>
    ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(evidence.document <= evidence.viewport && evidence.body <= evidence.viewport, JSON.stringify(evidence));
    passed(name, evidence);
}

async function ready(page)
{
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The ocean sets the schedule.");
    await expect(page.locator(".hero-image img")).toBeVisible();
}

async function screenshot(page, name, fullPage = false)
{
    const filename = path.join(checks, `${name}.png`);
    await page.waitForTimeout(450);
    await page.screenshot({ path: filename, fullPage });
    result.screenshots[name] = filename;
}

async function inspectSections(page, label)
{
    for (const section of ["lessons", "camps", "coaches", "book", "find-us"])
    {
        await page.locator(`#${section}`).scrollIntoViewIfNeeded();
        await page.waitForTimeout(850);
        await expect(page.locator(`#${section} h2`)).toBeVisible();
        await overflow(page, `${label}: ${section} no overflow before interactions`);
    }
    const assets = await page.evaluate(() =>
    ({
        images: [...document.images].map((image) => ({ source: image.getAttribute("src"), complete: image.complete && image.naturalWidth > 0 })),
        fonts: [
            document.fonts.check('700 20px "Bricolage Grotesque"'),
            document.fonts.check('400 16px "Archivo"'),
            document.fonts.check('400 12px "Space Mono"')
        ]
    }));
    assert.ok(assets.images.length === 6 && assets.images.every((image) => image.complete));
    assert.ok(assets.fonts.every(Boolean));
    passed(`${label}: all six exact local photos and three fonts loaded`, assets);
    await page.locator(".forecast").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await expect(page.getByText("SAMPLE FORECAST", { exact: true })).toBeVisible();
    assert.equal(await page.locator(".forecast-cell").count(), 5);
    const waves = await page.locator(".wave-arc path").evaluateAll((paths) => paths.map((element) => element.getAttribute("d")));
    assert.ok(new Set(waves).size === 3);
    passed(`${label}: five labeled static forecast cells and height-scaled SVG arcs`, { cells: 5, distinctWavePaths: 3 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(3300);
}

async function bookingTests(page, label)
{
    const form = page.locator("#booking-form");
    await page.locator('[data-level="1"]').click();
    await expect(page.getByRole("radio", { name: "Improver", exact: true })).toBeChecked();
    assert.equal(new URL(page.url()).hash, "#book");
    await expect(page.locator("#header")).toHaveClass(/scrolled/);
    passed(`${label}: lesson link preselects Improver and opens booking below scrolled header`, { hash: "#book", level: "Improver" });

    await page.getByRole("button", { name: "Save my request", exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem("bookingRequest")), null);
    assert.equal(await page.locator("#name").evaluate((input) => input.validity.valueMissing), true);
    passed(`${label}: blank request rejected, nothing stored`, { storage: null });
    await page.getByLabel("Your name", { exact: true }).fill("Taylor Reef");
    await page.getByLabel("Email", { exact: true }).fill("not-an-email");
    await page.getByRole("button", { name: "Save my request", exact: true }).click();
    assert.equal(await page.locator("#email").evaluate((input) => input.validity.typeMismatch), true);
    assert.equal(await page.evaluate(() => localStorage.getItem("bookingRequest")), null);
    passed(`${label}: invalid email rejected`, { storage: null });

    await page.getByLabel("Email", { exact: true }).fill("taylor@example.com");
    await page.getByLabel("Your name", { exact: true }).fill("   ");
    await page.getByRole("button", { name: "Save my request", exact: true }).click();
    assert.equal(await page.evaluate(() => localStorage.getItem("bookingRequest")), null);
    passed(`${label}: whitespace-only name rejected`, { storage: null });
    await page.getByLabel("Your name", { exact: true }).fill("Taylor Reef");

    const dawn = page.getByRole("radio", { name: "Weekday dawn", exact: true });
    await dawn.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Weekday mid-morning", exact: true })).toBeChecked();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Weekend mornings", exact: true })).toBeChecked();
    passed(`${label}: native chip radio group works with keyboard arrows`, { when: "Weekend mornings" });

    await expect(page.getByRole("button", { name: "Fewer surfers" })).toBeDisabled();
    for (let index = 0; index < 5; index++) await page.getByRole("button", { name: "More surfers" }).click();
    await expect(page.locator("#surfers")).toHaveText("6");
    await expect(page.getByRole("button", { name: "More surfers" })).toBeDisabled();
    await page.getByRole("button", { name: "Fewer surfers" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#surfers")).toHaveText("5");
    passed(`${label}: surfers bounded 1–6; keyboard decrement works`, { max: 6, afterDecrement: 5 });

    await page.locator('[data-package="0"]').click();
    await expect(page.locator("#package-name")).toHaveText("Weekend Camp");
    await page.getByRole("button", { name: "Save my request", exact: true }).click();
    await expect(page.locator(".save-status")).toContainText("Saved on this device only — this demo form sends nothing.");
    const request = await page.evaluate(() => JSON.parse(localStorage.getItem("bookingRequest")));
    assert.deepEqual(request, { name: "Taylor Reef", email: "taylor@example.com", level: "Improver", when: "Weekend mornings", surfers: 5, package: "Weekend Camp" });
    passed(`${label}: complete request persisted locally, no submission`, request);
    await overflow(page, `${label}: no overflow after booking interactions`);
    await page.locator(".save-status").scrollIntoViewIfNeeded();
    await screenshot(page, `${label}-booking`);

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("Taylor Reef");
    await expect(page.getByRole("radio", { name: "Improver", exact: true })).toBeChecked();
    await expect(page.getByRole("radio", { name: "Weekend mornings", exact: true })).toBeChecked();
    await expect(page.locator("#surfers")).toHaveText("5");
    await expect(page.locator("#package-name")).toHaveText("Weekend Camp");
    await expect(page.locator(".save-status")).toContainText("Your saved request is back.");
    passed(`${label}: reload restores all saved fields and package`, { restored: true });
    await page.getByRole("button", { name: "Remove package" }).click();
    await expect(page.locator(".selected-package")).toBeHidden();
    await expect(page.locator(".save-status")).toContainText("You’ve made changes.");
    await page.getByRole("button", { name: "Save my request", exact: true }).click();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("bookingRequest")).package), "");
    passed(`${label}: removing package updates saved request`, { package: "" });
    await overflow(page, `${label}: no overflow after restore and changes`);
    assert.equal(await form.locator('input[name="level"]:checked').count(), 1);
    assert.equal(await form.locator('input[name="when"]:checked').count(), 1);
}

try
{
    result.staticDigest = await StaticHomepage.validateStaticOutput(exported, "surf-school-website", "GPT-6");
    passed("StaticHomepage.validateStaticOutput passes at final subpath", result.staticDigest);
    service = await startPreviewServer(exported, { workspace });
    assert.ok(service.url.includes("/pages/surf-school-website/GPT-6/index.html"));
    const probe = await fetch(service.url);
    assert.equal(probe.status, 200);
    const outside = await fetch(new URL("/README.md", service.url));
    assert.equal(outside.status, 404);
    passed("owned preview server responsive; serves only static target mount", { http: 200, outside: 404, url: service.url });
    browser = await chromium.launch({ headless: true });
    for (const [label, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: label === "mobile", hasTouch: label === "mobile" });
        try
        {
            const page = await context.newPage();
            monitor(page, label);
            result.viewports.push({ label, ...viewport, deviceScaleFactor: 1 });
            await ready(page);
            await overflow(page, `${label}: homepage no overflow before interactions`);
            await inspectSections(page, label);
            await screenshot(page, label);
            if (label === "mobile")
            {
                const menu = page.getByRole("button", { name: "Open navigation" });
                await menu.click();
                await expect(page.locator("#mobile-nav")).toBeVisible();
                await overflow(page, "mobile: menu open no overflow");
                await page.keyboard.press("Escape");
                await expect(page.locator("#mobile-nav")).toBeHidden();
                await expect(menu).toBeFocused();
                await menu.click();
                await page.locator("#mobile-nav").getByRole("link", { name: "Lessons", exact: true }).click();
                await expect(page.locator("#mobile-nav")).toBeHidden();
                assert.equal(new URL(page.url()).hash, "#lessons");
                passed("mobile: menu open/Escape focus return/anchor close", { hash: "#lessons" });
            }
            else
            {
                await page.getByRole("link", { name: "See the levels", exact: true }).click();
                await expect(page.locator("#lessons h2")).toBeVisible();
                passed("desktop: hero CTA navigates to lessons", { hash: new URL(page.url()).hash });
            }
            await bookingTests(page, label);
            for (const section of ["lessons", "camps", "coaches", "find-us"])
            {
                await page.locator(`#${section} h2`).evaluate((element) =>
                {
                    window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 140, behavior: "instant" });
                });
                await page.waitForTimeout(1000);
                await screenshot(page, `${label}-${section}`);
            }
            await page.locator(".forecast").evaluate((element) =>
            {
                window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 92, behavior: "instant" });
            });
            await screenshot(page, `${label}-forecast`);
            await overflow(page, `${label}: final page no overflow after interactions`);
        }
        finally
        {
            await context.close();
        }
    }

    const wide = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    try
    {
        const page = await wide.newPage();
        monitor(page, "wide");
        await ready(page);
        await inspectSections(page, "wide");
        await overflow(page, "wide: requested 1440×900 clean render");
        result.viewports.push({ label: "wide", width: 1440, height: 900, deviceScaleFactor: 1 });
        await screenshot(page, "wide");
    }
    finally
    {
        await wide.close();
    }

    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    try
    {
        const page = await reduced.newPage();
        monitor(page, "reduced-motion");
        await ready(page);
        await page.locator("#find-us").scrollIntoViewIfNeeded();
        const motion = await page.evaluate(() =>
        ({
            heroAnimation: getComputedStyle(document.querySelector(".hero-image")).animationName,
            waveAnimation: getComputedStyle(document.querySelector(".wave-arc")).animationName,
            heroTranslate: document.querySelector(".hero-image").style.translate,
            revealTransform: getComputedStyle(document.querySelector("#find-us .section-heading")).transform,
            pinScale: getComputedStyle(document.querySelector(".map-pin")).scale
        }));
        assert.equal(motion.heroAnimation, "none");
        assert.equal(motion.waveAnimation, "none");
        assert.equal(motion.heroTranslate, "none");
        assert.equal(motion.revealTransform, "none");
        assert.equal(motion.pinScale, "1");
        passed("reduced motion: no zoom, loops, parallax or transform reveals; map pin visible", motion);
        await page.evaluate(() => localStorage.setItem("bookingRequest", "{malformed"));
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.getByLabel("Your name", { exact: true })).toHaveValue("");
        passed("malformed saved data does not break homepage", { usable: true });
        await page.evaluate(() =>
        {
            Storage.prototype.setItem = () =>
            {
                throw new DOMException("Storage disabled", "SecurityError");
            };
        });
        await page.getByLabel("Your name", { exact: true }).fill("Alex Bay");
        await page.getByLabel("Email", { exact: true }).fill("alex@example.com");
        await page.getByRole("button", { name: "Save my request", exact: true }).click();
        await expect(page.locator(".save-status")).toContainText("This browser couldn’t save your request.");
        passed("storage denied: honest inline failure, no exception or transmission", { inlineFailure: true });
        await overflow(page, "reduced-motion/storage failure: no overflow after interactions");
        await screenshot(page, "mobile-storage-failure");
    }
    finally
    {
        await reduced.close();
    }
    assert.equal(result.errors.length, 0, JSON.stringify(result.errors));
    passed("all contexts: zero HTTP/resource/request/console/page/external-network/submission errors", { errors: 0 });
    result.passed = true;
}
catch (error)
{
    result.errors.push({ type: "assertion", message: error.stack });
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
