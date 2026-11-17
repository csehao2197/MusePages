import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import assert from "node:assert/strict";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "554-flower-anatomy-3d-explainer", "GPT-6");
const checks = path.join(folder, ".checks");
await mkdir(checks, { recursive: true });
const results = { passed: false, visualReviewed: false, assertions: [], errors: [], viewports: [], screenshots: {}, resourcesClosed: false };
let service;
let browser;
const verify = (condition, name) =>
{
    assert.ok(condition, name);
    results.assertions.push(name);
};
const pause = (page, ms = 750) => page.waitForTimeout(ms);
async function noOverflow(page, label)
{
    verify(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.body.scrollWidth <= innerWidth), `${label}: no horizontal overflow`);
}
async function canvasHash(page)
{
    return createHash("sha256").update(await page.locator("canvas").screenshot()).digest("hex");
}
function captureErrors(page, errors)
{
    page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
    page.on("console", (e) =>
    {
        if (e.type() === "error") errors.push(`console: ${e.text()}`);
    });
    page.on("requestfailed", (r) => errors.push(`request: ${r.url()} ${r.failure()?.errorText}`));
    page.on("response", (r) =>
    {
        if (r.status() >= 400) errors.push(`HTTP ${r.status()}: ${r.url()}`);
    });
}
try
{
    service = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    verify((await fetch(service.url)).status === 200, "Target-only preview server responsive at final model subpath");
    verify((await fetch(new URL("/", service.url))).status === 404, "Repository root is not served");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }, { width: 1440, height: 900 }])
    {
        const mobile = viewport.width === 390;
        const label = mobile ? "mobile" : viewport.width === 1200 ? "desktop" : "wide-desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        const errors = [];
        captureErrors(page, errors);
        const response = await page.goto(service.url);
        verify(response.status() === 200, `${label}: HTTP 200`);
        await page.locator("canvas").waitFor();
        await page.evaluate(() => document.fonts.ready);
        await pause(page, 1000);
        verify(await page.locator("h1").innerText() === "Inside a flower.", `${label}: nonblank correct homepage`);
        verify(await page.locator("#model").getAttribute("data-renderer") === "webgl", `${label}: real WebGL renderer mounted`);
        await noOverflow(page, `${label} initial`);
        verify(await page.locator(".projected:visible").count() === (mobile ? 3 : 6), `${label}: hidden labels do not collide with specimen heading`);
        const labelBoxes = await page.locator(".projected:visible").evaluateAll((buttons) => buttons.map((button) =>
        {
            const r = button.getBoundingClientRect();
            return { x: r.x, y: r.y, bottom: r.bottom, width: r.width, height: r.height };
        }));
        verify(labelBoxes.every((a, i) => a.height >= 44 && labelBoxes.every((b, j) => i === j || Math.abs(a.x - b.x) > 20 || Math.max(a.y - b.bottom, b.y - a.bottom) >= 12)), `${label}: label touch targets and vertical separation`);
        if (viewport.width !== 1440)
        {
            const screenshot = path.join(checks, `${label}.png`);
            await page.screenshot({ path: screenshot, fullPage: mobile });
            results.screenshots[label] = screenshot;
        }
        const original = await canvasHash(page);
        await page.locator("#model").focus();
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowUp");
        await pause(page);
        verify(await canvasHash(page) !== original, `${label}: keyboard changes actual 3D camera pixels`);
        await page.keyboard.press("+");
        await page.keyboard.press("-");
        await page.keyboard.press("0");
        if (mobile)
        {
            const bounds = await page.locator("#model").boundingBox();
            const session = await context.newCDPSession(page);
            const x = bounds.x + bounds.width / 2;
            const y = bounds.y + bounds.height / 2;
            await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x - 30, y }, { x: x + 30, y }] });
            await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - 65, y: y + 20 }, { x: x + 65, y: y + 20 }] });
            await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await pause(page);
            verify(await canvasHash(page) !== original, "mobile: real two-finger pinch changes model camera");
        }
        else
        {
            const box = await page.locator("#model").boundingBox();
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width / 2 + 95, box.y + box.height / 2 + 35, { steps: 10 });
            await page.mouse.up();
            await page.mouse.wheel(0, -180);
            await pause(page);
            verify(await canvasHash(page) !== original, `${label}: pointer orbit and wheel zoom affect geometry`);
        }
        await page.locator("#reset-view").click();
        await page.locator("[data-action='start']").click();
        verify(await page.locator("[data-step='1']").getAttribute("aria-pressed") === "true", `${label}: start dissection advances`);
        await page.locator("[data-action='next']").click();
        verify(await page.locator("[data-step='2']").getAttribute("aria-pressed") === "true", `${label}: next parts stamens`);
        await page.locator(".part-list [data-part='ovule']").click();
        await pause(page);
        verify(await page.locator("[data-step='3']").getAttribute("aria-pressed") === "true", `${label}: selecting ovule opens real cutaway state`);
        verify(await page.locator("#inspector h2").innerText() === "Ovule", `${label}: linked inspector explains selected part`);
        if (viewport.width === 1200) await page.screenshot({ path: path.join(checks, "cutaway.png") });
        await page.locator("[data-action='focus']").click();
        await page.locator("#reset-view").click();
        verify(await page.locator("[data-step='3']").getAttribute("aria-pressed") === "true", `${label}: camera reset preserves dissection`);
        const cut = await canvasHash(page);
        await page.locator("[data-action='previous']").click();
        await page.locator("[data-step='0']").click();
        await pause(page);
        verify(await canvasHash(page) !== cut, `${label}: whole/cutaway render different geometry`);
        for (const part of ["tepals", "stamen", "stigma", "style", "ovary", "ovule"])
        {
            await page.locator(`.part-list [data-part='${part}']`).click();
            verify(await page.locator(`.part-list [data-part='${part}']`).getAttribute("aria-pressed") === "true", `${label}: selectable ${part}`);
        }
        if (mobile) await page.locator("#labels-toggle").click();
        await page.locator("#labels-toggle").click();
        verify(await page.locator("#labels").isHidden(), `${label}: labels can be hidden`);
        await page.locator("#labels-toggle").click();
        await noOverflow(page, `${label} after dissection`);
        const canvas = await page.locator("canvas").elementHandle();
        await page.locator("nav a[href='#/pollination']").click();
        verify(await canvas.evaluate((el) => el.isConnected), `${label}: canvas persists between routes`);
        verify(await page.locator(".poll-progress").getAttribute("value") === "0", `${label}: no pollination autoplay`);
        await page.locator("#model").focus();
        await page.keyboard.press("]");
        verify(await page.locator("#inspector h2").innerText() === "Pollen transfer", `${label}: keyboard stage navigation`);
        await page.keyboard.press("[");
        await page.locator("#speed").selectOption("0.5");
        await page.locator("#model").focus();
        await page.keyboard.press("Space");
        await pause(page, 1100);
        await page.keyboard.press("Space");
        const halfProgress = await page.locator(".poll-progress").evaluate((el) => el.value);
        verify(halfProgress > .2 && halfProgress < 1.5, `${label}: half-speed playback advances real progress`);
        await pause(page, 350);
        verify(await page.locator(".poll-progress").evaluate((el) => el.value) === halfProgress, `${label}: pause freezes exact progress`);
        for (let i = 0; i < 4; i++)
        {
            await page.locator(`[data-poll-stage='${i}']`).click();
            verify(await page.locator(`[data-poll-stage='${i}']`).getAttribute("aria-pressed") === "true", `${label}: deterministic pollination stage ${i + 1}`);
            if (viewport.width === 1200 && i === 3)
            {
                await pause(page);
                await page.screenshot({ path: path.join(checks, "fertilization.png") });
            }
        }
        await page.locator("#speed").selectOption("1");
        await page.locator("[data-action='replay']").click();
        if (!mobile && viewport.width === 1200)
        {
            await pause(page, 12300);
            verify(await page.locator(".poll-progress").evaluate((el) => el.value) === 12, "desktop: complete deterministic 12-second sequence stops");
            verify(await page.locator("#inspector h2").innerText() === "Fertilization", "desktop: final event correctly distinguished");
            const done = await page.locator(".poll-progress").evaluate((el) => el.value);
            await pause(page, 200);
            verify(await page.locator(".poll-progress").evaluate((el) => el.value) === done, "desktop: playback does not loop");
        }
        else
        {
            await pause(page, 200);
            await page.locator("[data-action='play']").click();
        }
        await noOverflow(page, `${label} pollination`);
        await page.locator("nav a[href='#/quiz']").click();
        verify(await page.locator("#labels").isHidden(), `${label}: quiz begins without projected labels`);
        for (let q = 0; q < 5; q++)
        {
            const answer = [0, 1, 2, 3, 0][q];
            await page.locator(`[data-answer='${answer}']`).focus();
            await page.keyboard.press("Enter");
            verify(await page.locator(".answer:disabled").count() === 4, `${label}: question ${q + 1} locks answers`);
            verify(await page.locator(".feedback").isVisible(), `${label}: question ${q + 1} explains answer`);
            await page.locator("[data-action='next-question']").click();
        }
        verify((await page.locator(".score").innerText()).replaceAll(/\s/g, "") === "5/5", `${label}: five-question scoring`);
        verify(await page.locator(".review li").count() === 5, `${label}: complete five-row review`);
        verify(await page.evaluate(() => localStorage.getItem("petal-atlas-best")) === "5", `${label}: only numeric best score persisted`);
        await page.locator("[data-action='try-again']").click();
        await page.locator("[data-answer='1']").click();
        verify(await page.locator(".wrong").count() === 1 && await page.locator(".correct").count() === 1, `${label}: incorrect choice shows both selected and correct answers`);
        await noOverflow(page, `${label} quiz after answer`);
        await page.reload();
        verify((await page.locator(".quiz-count").innerText()).includes("BEST 5 / 5"), `${label}: score survives reload`);
        verify(errors.length === 0, `${label}: no HTTP, resource, console, request or page errors`);
        results.errors.push(...errors);
        results.viewports.push({ ...viewport, deviceScaleFactor: 1, touch: mobile, passed: true });
        await context.close();
    }
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const rp = await reducedContext.newPage();
    const reducedErrors = [];
    captureErrors(rp, reducedErrors);
    await rp.goto(`${service.url}#/pollination`);
    await rp.locator("[data-action='play']").click();
    verify(await rp.locator("#inspector h2").innerText() === "Pollen transfer", "Reduced motion: Play advances static storyboard");
    const time = await rp.locator(".poll-progress").evaluate((el) => el.value);
    await pause(rp, 400);
    verify(await rp.locator(".poll-progress").evaluate((el) => el.value) === time, "Reduced motion: no timed particle travel or autoplay");
    verify(reducedErrors.length === 0, "Reduced motion: no runtime errors");
    await reducedContext.close();
    const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const fp = await fallbackContext.newPage();
    await fp.addInitScript(() =>
    {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args)
        {
            if (type.startsWith("webgl")) return null;
            return getContext.call(this, type, ...args);
        };
    });
    const fallbackErrors = [];
    fp.on("pageerror", (e) => fallbackErrors.push(e.message));
    await fp.goto(service.url);
    verify(await fp.locator("#model").getAttribute("data-renderer") === "svg-fallback", "WebGL failure: actual inline-SVG fallback mounts");
    await fp.locator(".part-list [data-part='ovule']").click();
    verify(await fp.locator("#fallback-cut").isVisible(), "WebGL fallback: ovule selection exposes cross-section");
    await fp.locator("nav a[href='#/quiz']").click();
    await fp.locator("[data-answer='0']").click();
    verify(await fp.locator(".feedback").isVisible(), "WebGL fallback: quiz remains functional");
    verify(fallbackErrors.length === 0, "WebGL fallback: no uncaught errors");
    await fallbackContext.close();
    results.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "flower-anatomy-3d-explainer", "GPT-6");
    results.passed = true;
}
catch (error)
{
    results.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    results.resourcesClosed = true;
    results.checkedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), results);
    console.log(JSON.stringify({ passed: results.passed, assertions: results.assertions.length, errors: results.errors, screenshots: results.screenshots, resourcesClosed: results.resourcesClosed }));
}
