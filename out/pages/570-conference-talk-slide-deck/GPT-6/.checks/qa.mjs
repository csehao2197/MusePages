import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const exported = path.join(folder, "out");
const workspace = path.resolve(folder, "../../../..");
const result =
{
    passed: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;

function record(name, details)
{
    result.assertions.push({ name, passed: true, details });
}

async function expectSlide(page, number)
{
    await page.waitForFunction((index) =>
    {
        const visible = [...document.querySelectorAll("main > .slide")].filter((node) => !node.hidden);
        return visible.length === 1 && visible[0].getAttribute("aria-label").startsWith(`Slide ${index}:`);
    }, number);
    assert.equal(new URL(page.url()).hash, `#/${number}`);
    assert.equal(await page.locator(".counter").innerText(), `${number} / 9`);
    assert.equal(await page.locator(".progress").getAttribute("aria-valuenow"), String(number));
}

async function geometry(page, label)
{
    await page.waitForTimeout(360);
    const box = await page.evaluate(() =>
    {
        const inner = document.querySelector("main > .slide:not([hidden]) .slide-inner").getBoundingClientRect();
        const chrome = document.querySelector(".chrome").getBoundingClientRect();
        const masthead = document.querySelector(".masthead").getBoundingClientRect();
        const code = document.querySelector("main > .code:not([hidden]) .code-lines");
        return {
            width: window.innerWidth,
            scrollWidth: document.documentElement.scrollWidth,
            top: inner.top,
            bottom: inner.bottom,
            chromeTop: chrome.top,
            headerBottom: masthead.bottom,
            scrollY,
            codeOverflow: code ? code.scrollWidth > code.clientWidth + 1 : false
        };
    });
    assert.ok(box.scrollWidth <= box.width, `${label} horizontal overflow: ${JSON.stringify(box)}`);
    assert.ok(box.top >= box.headerBottom + 9, `${label} collides with header: ${JSON.stringify(box)}`);
    assert.ok(box.bottom <= box.chromeTop - 9, `${label} collides with controls: ${JSON.stringify(box)}`);
    assert.equal(box.codeOverflow, false, `${label} code has horizontal overflow`);
    record(`${label}: layout remains readable without horizontal overflow or chrome collision`, box);
}

try
{
    result.staticDigest = await StaticHomepage.validateStaticOutput(exported, "conference-talk-slide-deck", "GPT-6");
    record("Independent static output and final public subpath validation", result.staticDigest);
    server = await startPreviewServer(exported, { workspace });
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
    record("Preview responds at final model path and does not expose repository", server.url);
    browser = await chromium.launch({ headless: true });

    for (const viewport of [
        { name: "desktop", width: 1200, height: 900, isMobile: false, hasTouch: false },
        { name: "wide", width: 1440, height: 900, isMobile: false, hasTouch: false },
        { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true }
    ])
    {
        result.viewports.push({ ...viewport, deviceScaleFactor: 1 });
        const context = await browser.newContext({
            viewport: { width: viewport.width, height: viewport.height },
            deviceScaleFactor: 1,
            isMobile: viewport.isMobile,
            hasTouch: viewport.hasTouch
        });
        try
        {
            const page = await context.newPage();
            page.on("pageerror", (error) => result.errors.push({ viewport: viewport.name, type: "page", message: error.message }));
            page.on("console", (message) =>
            {
                if (message.type() === "error") result.errors.push({ viewport: viewport.name, type: "console", message: message.text() });
            });
            page.on("requestfailed", (request) => result.errors.push({ viewport: viewport.name, type: "request", url: request.url(), message: request.failure()?.errorText }));
            page.on("response", (response) =>
            {
                if (response.status() >= 400) result.errors.push({ viewport: viewport.name, type: "http", url: response.url(), status: response.status() });
            });
            await page.addInitScript(() =>
            {
                window.printCalls = 0;
                window.print = () => window.printCalls++;
            });
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            assert.equal(response.status(), 200);
            await page.evaluate(() => document.fonts.ready);
            await expectSlide(page, 1);
            assert.ok(await page.locator("main h1").isVisible());
            assert.equal(await page.evaluate(() => document.fonts.check('600 40px "Bricolage Grotesque"') && document.fonts.check('400 15px Inter')), true);
            await geometry(page, `${viewport.name} initial`);
            if (viewport.name !== "wide")
            {
                const file = path.join(checks, `${viewport.name}.png`);
                await page.screenshot({ path: file, fullPage: false });
                result.screenshots.push(file);
            }
            for (let i = 1; i <= 9; i++)
            {
                await page.keyboard.press(String(i));
                await expectSlide(page, i);
                await geometry(page, `${viewport.name} slide ${i}`);
            }
            record(`${viewport.name}: digits 1–9, all nine actual slide regions, hash, counter and progress agree`);
            await page.keyboard.press("Home");
            await expectSlide(page, 1);
            assert.equal(await page.getByRole("button", { name: "Previous slide (←)", exact: true }).first().isDisabled(), true);
            await page.locator("main").focus();
            await page.keyboard.press("Space");
            await expectSlide(page, 2);
            assert.equal(await page.evaluate(() => scrollY), 0);
            await page.keyboard.press("Backspace");
            await expectSlide(page, 1);
            await page.keyboard.press("ArrowRight");
            await expectSlide(page, 2);
            await page.keyboard.press("ArrowLeft");
            await expectSlide(page, 1);
            await page.keyboard.press("End");
            await expectSlide(page, 9);
            await page.keyboard.press("ArrowRight");
            await expectSlide(page, 9);
            assert.equal(await page.getByRole("button", { name: "Next slide (→)", exact: true }).first().isDisabled(), true);
            record(`${viewport.name}: arrows, Home/End, bounded edges, Space/Backspace without scrolling`);

            await page.keyboard.press("g");
            await page.getByRole("dialog", { name: "Slide overview" }).waitFor({ state: "visible" });
            assert.equal(await page.locator(".mini").count(), 9);
            await page.keyboard.press("ArrowUp");
            await page.keyboard.press("ArrowLeft");
            assert.equal(await page.locator(".mini.selected").getAttribute("aria-label"), "Slide 5: The whole check, honestly");
            await page.keyboard.press("Enter");
            await expectSlide(page, 5);
            assert.equal(await page.locator(".overlay").first().isVisible(), false);
            await page.keyboard.press("ArrowDown");
            await page.keyboard.press("ArrowDown");
            assert.equal(await page.locator("main .code-line.focused").getAttribute("data-line"), "2");
            await page.keyboard.press("ArrowUp");
            assert.equal(await page.locator("main .code-line.focused").getAttribute("data-line"), "1");
            assert.equal(await page.locator("main .code-line").count(), 12);
            assert.ok((await page.locator("main .token-string").count()) >= 3);
            await geometry(page, `${viewport.name} after code focus`);
            if (viewport.name === "desktop") await page.screenshot({ path: path.join(checks, "code.png") });
            record(`${viewport.name}: overview arrow ring/Enter jump and 12-line safe tokenizer/code focus stepping`);

            await page.keyboard.press("s");
            const drawer = page.getByRole("dialog", { name: "Speaker notes" });
            await drawer.waitFor({ state: "visible" });
            assert.match(await page.locator(".notes-content").innerText(), /decision gate/);
            await drawer.getByRole("button", { name: "Next slide (→)", exact: true }).click();
            await expectSlide(page, 6);
            assert.match(await page.locator(".notes-content").innerText(), /invented sample content/);
            await drawer.getByRole("button", { name: "Previous slide (←)", exact: true }).click();
            await expectSlide(page, 5);
            if (viewport.name === "mobile") await page.screenshot({ path: path.join(checks, "mobile-notes.png") });
            await page.keyboard.press("Escape");
            assert.equal(await drawer.isVisible(), false);
            record(`${viewport.name}: notes content, navigation mirrors, live updates and Escape`);

            await page.getByRole("button", { name: "Grid (G)", exact: true }).click();
            const overview = page.getByRole("dialog", { name: "Slide overview" });
            await overview.waitFor({ state: "visible" });
            await page.waitForTimeout(550);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            assert.equal(await page.locator(".mini").evaluateAll((nodes) => nodes.every((node) => getComputedStyle(node).opacity === "1")), true);
            assert.ok(await page.locator(".overview-grid").evaluate((node) => node.getBoundingClientRect().bottom <= innerHeight));
            if (viewport.name !== "wide") await page.screenshot({ path: path.join(checks, `${viewport.name}-overview.png`) });
            await overview.getByRole("button", { name: "Slide 8: Monday, at your desk", exact: true }).click();
            await expectSlide(page, 8);
            await page.keyboard.press("g");
            await page.keyboard.press("g");
            assert.equal(await overview.isVisible(), false);
            await page.keyboard.press("s");
            await page.keyboard.press("s");
            assert.equal(await drawer.isVisible(), false);
            record(`${viewport.name}: clickable/touch overview jump and G/S toggle paths`);

            await page.evaluate(() => { location.hash = "#/3"; });
            await expectSlide(page, 3);
            await page.reload({ waitUntil: "networkidle" });
            await expectSlide(page, 3);
            await page.evaluate(() => { location.hash = "#/99"; });
            await expectSlide(page, 1);
            await page.evaluate(() => { location.hash = "#/0"; });
            await expectSlide(page, 1);
            await page.keyboard.press("9");
            await page.locator("main .closing-link").click();
            await expectSlide(page, 1);
            record(`${viewport.name}: external hash changes, reload deep links, malformed hash normalization and explicit index link`);

            await page.getByRole("button", { name: "Print handout", exact: true }).click();
            assert.equal(await page.evaluate(() => window.printCalls), 1);
            if (viewport.name === "desktop")
            {
                await page.emulateMedia({ media: "print" });
                assert.equal(await page.locator("main > .slide:visible").count(), 9);
                assert.equal(await page.locator(".chrome").isVisible(), false);
                assert.equal(await page.locator(".progress").isVisible(), false);
                const pdf = await page.pdf({ path: path.join(checks, "handout.pdf"), printBackground: true, preferCSSPageSize: true });
                const pages = [...pdf.toString("latin1").matchAll(/\/Type\s*\/Page\b/g)].length;
                assert.equal(pages, 9);
                record("Actual Chromium print handout is exactly nine PDF pages", { pages, bytes: pdf.length });
                await page.emulateMedia({ media: "screen" });
            }
            record(`${viewport.name}: Print handout invokes native print`);
            await page.locator("main").focus();
            await page.keyboard.press("Tab");
            assert.equal(await page.evaluate(() =>
            {
                const style = getComputedStyle(document.activeElement);
                return style.outlineStyle === "solid" && style.outlineWidth === "2px";
            }), true);
            record(`${viewport.name}: visible keyboard focus ring on chrome`);

            if (viewport.isMobile)
            {
                await page.locator("main").focus();
                await page.keyboard.press("Home");
                await page.touchscreen.tap(310, 340);
                await expectSlide(page, 2);
                await page.touchscreen.tap(60, 340);
                await expectSlide(page, 1);
                await geometry(page, "mobile after actual touch navigation");
                record("Mobile actual touch: right advances, left returns without page scroll");
            }
            await page.emulateMedia({ reducedMotion: "reduce" });
            await page.keyboard.press("3");
            assert.equal(await page.locator("main > .slide:not([hidden]) .slide-inner").evaluate((node) => getComputedStyle(node).animationName), "none");
            await geometry(page, `${viewport.name} reduced motion after interactions`);
            record(`${viewport.name}: reduced motion disables all slide animations`);
        }
        finally
        {
            await context.close();
        }
    }
    assert.deepEqual(result.errors, []);
    record("All browser sessions: no console, page, request, resource or HTTP errors");
    result.passed = true;
}
catch (error)
{
    result.failure = { message: error.message, stack: error.stack };
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, failure: result.failure, resourcesClosed: result.resourcesClosed }));
}
