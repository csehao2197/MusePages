import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { StaticHomepage, WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const checksFolder = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checksFolder);
const workspace = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const results = [];
const errors = [];
const viewports = [];
const key = "lumaire-lantern-wishes-v1";
const text = "  May a small kindness find a place to grow.\nAnd a friend to share it.  ";
let browser;
let service;
let resourcesClosed = false;

async function check(name, action)
{
    await action();
    results.push({ name, passed: true });
}

async function noOverflow(page)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
}

async function setup(options = {}, seed)
{
    const context = await browser.newContext(options);
    if (seed)
    {
        await context.addInitScript(({ key, data }) => localStorage.setItem(key, JSON.stringify(data)), { key, data: seed });
    }
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(new URL(service.url).origin)) errors.push(`Nonlocal runtime request: ${request.url()}`);
    });
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").innerText(), "A small wish. A little more light.");
    await noOverflow(page);
    return { context, page };
}

async function fold(page, value, keyboard = false)
{
    await page.locator("#wish").fill(value);
    const button = page.locator("#fold");
    if (keyboard)
    {
        await button.focus();
        await page.keyboard.press("Enter");
    }
    else await button.click();
    await page.locator("#release:enabled").waitFor();
}

async function release(page, keyboard = false)
{
    if (keyboard)
    {
        await page.locator("#release").focus();
        await page.keyboard.press("Enter");
    }
    else await page.locator("#release").click();
    await page.locator("#success").waitFor();
}

try
{
    const digest = await StaticHomepage.validateStaticOutput(exported, "paper-lantern-festival-page", "GPT-6");
    results.push({ name: "Independent static export and final public subpath", passed: true, digest });
    service = await startPreviewServer(exported, { workspace });
    assert.ok(service.url.includes("/pages/paper-lantern-festival-page/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    const desktop = await setup({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = desktop.page;
    viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1, screenshot: "desktop.png" });
    await check("Desktop first screen: meaningful canvas pixels, local fonts, no overflow", async () =>
    {
        assert.ok(await page.locator("#river").evaluate((canvas) =>
        {
            const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
            let warm = 0;
            let bright = 0;
            for (let index = 0; index < data.length; index += 16)
            {
                if (data[index] > 170 && data[index + 1] > 90) warm++;
                if (data[index] + data[index + 1] + data[index + 2] > 140) bright++;
            }
            return warm > 100 && bright > 1000;
        }));
        assert.equal(await page.evaluate(() => document.fonts.check("400 16px Fraunces")), true);
        assert.equal(await page.evaluate(() => document.fonts.check("400 16px Manrope")), true);
        assert.equal(await page.evaluate(() => document.fonts.check('400 16px "IBM Plex Mono"')), true);
        await page.screenshot({ path: path.join(checksFolder, "desktop.png") });
    });
    await check("Minimum length, keyboard suggestion, fold back preserves exact draft", async () =>
    {
        assert.equal(await page.locator("#fold").isDisabled(), true);
        await page.locator("#wish").fill("  a  ");
        assert.equal(await page.locator("#fold").isDisabled(), true);
        await page.getByRole("button", { name: "A kinder tomorrow" }).focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#wish").inputValue(), "May I leave a little kindness wherever tomorrow takes me.");
        await fold(page, text, true);
        assert.equal(await page.locator(".wish-excerpt").textContent(), text.trim());
        assert.equal(await page.locator('[aria-current="step"]').innerText(), "02\nFold");
        await page.screenshot({ path: path.join(checksFolder, "desktop-folded.png") });
        await page.locator("#back").press("Enter");
        assert.equal(await page.locator("#wish").inputValue(), text);
        assert.equal(await page.locator("#wish").evaluate((node) => node === document.activeElement), true);
        assert.equal(await page.locator(".wish-card").count(), 0);
    });
    await check("Single release saves one minimal record and completes 1.4-second feedback", async () =>
    {
        await fold(page, text, true);
        await page.locator("#release").focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Enter");
        await page.locator("#success").waitFor();
        assert.equal(await page.locator(".wish-card").count(), 1);
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
        assert.equal(stored.version, 1);
        assert.equal(stored.wishes.length, 1);
        assert.deepEqual(Object.keys(stored.wishes[0]).sort(), ["id", "ordinal", "paperTone", "text"]);
        assert.equal(stored.wishes[0].text, text.trim());
        assert.ok((await page.locator("#status").textContent()).includes("Your wish is drifting"));
        await noOverflow(page);
    });
    await check("Relaunch does not duplicate or reorder; reset preserves gallery and new draft", async () =>
    {
        const before = await page.evaluate((key) => localStorage.getItem(key), key);
        await page.getByRole("button", { name: "Release again" }).press("Enter");
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), before);
        assert.equal(await page.locator("#status").textContent(), "This wish is drifting again.");
        await page.locator("#another").click();
        assert.equal(await page.locator("#wish").inputValue(), "");
        await page.locator("#wish").fill("Keep this draft through wind and reset.");
        await page.locator("#wind").focus();
        await page.keyboard.press("End");
        assert.equal(await page.locator("#wind-label").textContent(), "Brisk");
        await page.locator("#reset").click();
        assert.equal(await page.locator("#wind").inputValue(), "1");
        assert.equal(await page.locator("#wish").inputValue(), "Keep this draft through wind and reset.");
        assert.equal(await page.locator(".wish-card").count(), 1);
        await noOverflow(page);
    });
    await check("Pause freezes scene pixels; resume restores motion", async () =>
    {
        await page.waitForTimeout(1600);
        await page.locator("#pause").click();
        await page.waitForTimeout(120);
        const paused = await page.locator("#river").evaluate((canvas) => canvas.toDataURL());
        await page.waitForTimeout(170);
        assert.equal(await page.locator("#river").evaluate((canvas) => canvas.toDataURL()), paused);
        await page.locator("#pause").click();
        await page.waitForTimeout(170);
        assert.notEqual(await page.locator("#river").evaluate((canvas) => canvas.toDataURL()), paused);
    });
    await check("Reload restores exact wish and inline keep/remove keyboard confirmation", async () =>
    {
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator(".card-wish").textContent(), text.trim());
        await page.getByRole("button", { name: "Remove", exact: true }).press("Enter");
        assert.equal(await page.getByRole("button", { name: "Keep it" }).evaluate((node) => node === document.activeElement), true);
        await page.keyboard.press("Enter");
        assert.equal(await page.locator(".wish-card").count(), 1);
        await page.getByRole("button", { name: "Remove", exact: true }).press("Enter");
        await page.getByRole("button", { name: "Remove", exact: true }).press("Enter");
        assert.equal(await page.locator(".wish-card").count(), 0);
        assert.equal(await page.locator("#empty-write").evaluate((node) => node === document.activeElement), true);
    });
    await check("Desktop 120-character wide-letter fold keeps scene controls clear", async () =>
    {
        await fold(page, "W".repeat(120));
        const composer = await page.locator("#composer").boundingBox();
        const reset = await page.locator(".reset-wrap").boundingBox();
        assert.ok(composer.y + composer.height <= reset.y - 8, "Folded composer must not overlap scene controls");
        await noOverflow(page);
        await page.screenshot({ path: path.join(checksFolder, "desktop-folded-long.png") });
    });
    await desktop.context.close();

    const mobile = await setup({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = mobile.page;
    viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, screenshot: "mobile.png" });
    await check("Mobile 390×844: 430px scene, normal-flow composer, visible gallery navigation", async () =>
    {
        assert.equal(Math.round((await phone.locator(".landscape").boundingBox()).height), 430);
        assert.equal(await phone.locator("#composer").evaluate((node) => getComputedStyle(node).position), "relative");
        assert.equal(await phone.getByRole("link", { name: "Your lanterns", exact: true }).isVisible(), true);
        await phone.screenshot({ path: path.join(checksFolder, "mobile.png") });
    });
    await check("Touch write–fold–release, 120-character unbroken wish, wrapping and no injection", async () =>
    {
        const long = "<img onerror=alert(1)>".padEnd(120, "q");
        await phone.locator("#wish").fill(long);
        await phone.locator("#fold").tap();
        await phone.locator("#release:enabled").waitFor();
        await noOverflow(phone);
        await phone.locator("#release").tap();
        await phone.locator("#success").waitFor();
        assert.equal(await phone.locator(".card-wish").textContent(), long);
        assert.equal(await phone.locator(".wish-card img").count(), 0);
        await noOverflow(phone);
        await phone.locator(".wish-card").screenshot({ path: path.join(checksFolder, "mobile-long-wish.png") });
        await phone.screenshot({ path: path.join(checksFolder, "mobile-full.png"), fullPage: true });
        await phone.getByRole("button", { name: "Release again" }).tap();
        await phone.getByRole("button", { name: "Remove", exact: true }).tap();
        await phone.getByRole("button", { name: "Keep it" }).tap();
        assert.equal(await phone.locator(".wish-card").count(), 1);
        await noOverflow(phone);
    });
    await check("Mobile interactive hit targets are at least 44×44px", async () =>
    {
        const small = await phone.locator("button:visible, a:visible:not(.skip-link), textarea:visible, input:visible").evaluateAll((nodes) =>
            nodes.filter((node) => node.getBoundingClientRect().height < 43.9 || node.getBoundingClientRect().width < 43.9).map((node) => node.outerHTML.slice(0, 100)));
        assert.deepEqual(small, []);
    });
    await mobile.context.close();

    const reduced = await setup({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const quiet = reduced.page;
    viewports.push({ width: 1440, height: 900, reducedMotion: "reduce" });
    await check("Reduced motion: static tableau, immediate fold/release, no draft or saved-state loss on change", async () =>
    {
        const first = await quiet.locator("#river").evaluate((canvas) => canvas.toDataURL());
        await quiet.waitForTimeout(180);
        assert.equal(await quiet.locator("#river").evaluate((canvas) => canvas.toDataURL()), first);
        await fold(quiet, "May everyone find a place to belong.");
        await release(quiet);
        assert.equal(await quiet.locator(".wish-card").count(), 1);
        const released = await quiet.locator("#river").evaluate((canvas) => canvas.toDataURL());
        await quiet.waitForTimeout(180);
        assert.equal(await quiet.locator("#river").evaluate((canvas) => canvas.toDataURL()), released);
        await quiet.locator("#another").click();
        await quiet.locator("#wish").fill("Keep this quiet thought.");
        await quiet.emulateMedia({ reducedMotion: "no-preference" });
        await quiet.waitForTimeout(100);
        await quiet.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(await quiet.locator("#wish").inputValue(), "Keep this quiet thought.");
        assert.equal(await quiet.locator(".wish-card").count(), 1);
        await noOverflow(quiet);
    });
    await reduced.context.close();

    const records = Array.from({ length: 24 }, (_, index) =>
    ({
        id: `test-wish-${index + 1}`,
        ordinal: index + 1,
        paperTone: ["cream", "honey", "apricot"][index % 3],
        text: `A quiet possibility number ${index + 1}.`
    }));
    const capped = await setup({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" }, { version: 1, wishes: records });
    await check("24-wish cap blocks new release; relaunch works; removal renumbers and unblocks", async () =>
    {
        assert.equal(await capped.page.locator(".wish-card").count(), 24);
        await capped.page.locator("#wish").fill("One more possibility.");
        await capped.page.locator("#fold").click();
        assert.equal(await capped.page.locator("#release").isDisabled(), true);
        assert.equal(await capped.page.locator("#capacity").isVisible(), true);
        await capped.page.locator("[data-again]").first().click();
        assert.equal(await capped.page.locator(".wish-card").count(), 24);
        await capped.page.locator("[data-remove]").first().click();
        await capped.page.locator("[data-confirm]").click();
        assert.equal(await capped.page.locator(".wish-card").count(), 23);
        assert.equal(await capped.page.locator("[data-again]").first().evaluate((node) => node === document.activeElement), true);
        assert.equal(await capped.page.locator("#release").isEnabled(), true);
        const stored = await capped.page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
        assert.deepEqual(stored.wishes.map((wish) => wish.ordinal), Array.from({ length: 23 }, (_, index) => index + 1));
        await release(capped.page);
        assert.equal(await capped.page.locator(".wish-card").count(), 24);
        await noOverflow(capped.page);
    });
    await capped.context.close();

    const malformed = await setup({ reducedMotion: "reduce" },
    {
        version: 1,
        wishes: [null, { ...records[0], text: "a" }, { ...records[0], paperTone: "pink" }, records[0], records[0], { ...records[1], location: "discard me", timestamp: "not retained" }]
    });
    await check("Malformed records and duplicates discarded; undeclared restored fields stripped on save", async () =>
    {
        assert.equal(await malformed.page.locator(".wish-card").count(), 2);
        await malformed.page.locator("[data-remove]").first().click();
        await malformed.page.locator("[data-confirm]").click();
        const stored = await malformed.page.evaluate((key) => JSON.parse(localStorage.getItem(key)), key);
        assert.deepEqual(Object.keys(stored.wishes[0]).sort(), ["id", "ordinal", "paperTone", "text"]);
    });
    await malformed.context.close();

    const failedStorage = await browser.newContext({ reducedMotion: "reduce" });
    await failedStorage.addInitScript(() =>
    {
        Object.defineProperty(Storage.prototype, "getItem", { value() { throw new DOMException("Unavailable", "SecurityError"); } });
        Object.defineProperty(Storage.prototype, "setItem", { value() { throw new DOMException("Full", "QuotaExceededError"); } });
    });
    const fallback = await failedStorage.newPage();
    fallback.on("pageerror", (error) => errors.push(error.message));
    await fallback.goto(service.url, { waitUntil: "networkidle" });
    await check("Unavailable storage: truthful inline warning and functional session-only release", async () =>
    {
        assert.equal(await fallback.locator("#storage-error").isVisible(), true);
        await fold(fallback, "This session can still hold a little light.");
        await release(fallback);
        assert.equal(await fallback.locator(".wish-card").count(), 1);
        assert.ok((await fallback.locator("#status").textContent()).includes("could not save"));
    });
    await failedStorage.close();
    await check("No HTTP, request, resource, console, page, or external runtime errors", async () => assert.deepEqual(errors, []));
}
catch (error)
{
    errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    resourcesClosed = true;
    const qa =
    {
        prompt: "595-paper-lantern-festival-page",
        modelId: "gpt-6.1-sol",
        status: errors.length ? "failed" : "passed",
        checkedAt: new Date().toISOString(),
        results,
        errors,
        viewports,
        screenshots: { desktop: path.join(checksFolder, "desktop.png"), mobile: path.join(checksFolder, "mobile.png") },
        visualReviewed: false,
        resourcesClosed
    };
    await WorkspaceFiles.saveJson(path.join(checksFolder, "qa.json"), qa);
    console.log(JSON.stringify({ status: qa.status, passed: results.length, errors, resourcesClosed }));
}
