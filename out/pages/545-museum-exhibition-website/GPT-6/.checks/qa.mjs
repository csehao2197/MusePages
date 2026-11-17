import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await W.json(job.stateFile);
const lockPid = Number((await W.text(job.promptLock)).trim());
process.kill(lockPid, 0);
if (job.prompt !== "545-museum-exhibition-website" || state.runId !== job.runId || state.ownedLock.prompt !== job.prompt || state.ownedLock.pid !== lockPid) throw Error("Coordinator lock mismatch");
const digest = await StaticHomepage.validateStaticOutput(exported, "museum-exhibition-website", "GPT-6");
const results =
{
    prompt: job.prompt,
    modelId: job.modelId,
    staticDigest: digest,
    status: "running",
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    fullPageScreenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
function passed(name, details = {})
{
    results.assertions.push({ name, passed: true, ...details });
}
async function overflow(page, name)
{
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
    expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
    passed(name, dimensions);
}
async function loaded(page, name)
{
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    expect(response.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveText("Measureof Days");
    await expect(page.locator(".hero-image")).toBeVisible();
    const hero = await page.locator(".hero-image").evaluate((image) => ({ complete: image.complete, width: image.naturalWidth }));
    expect(hero.complete).toBe(true);
    expect(hero.width).toBeGreaterThan(1000);
    const geometry = await page.locator(".hero-image").boundingBox();
    expect(Math.abs(geometry.width / geometry.height - 4 / 3)).toBeLessThan(.01);
    expect(await page.locator("body").innerText()).not.toMatch(/[\u3400-\u9fff]/);
    passed(name, { status: response.status(), hero, geometry });
}
function track(page, name)
{
    page.on("pageerror", (error) => results.errors.push({ viewport: name, type: "page", message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") results.errors.push({ viewport: name, type: "console", message: message.text() });
    });
    page.on("requestfailed", (request) => results.errors.push({ viewport: name, type: "request", url: request.url(), message: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) results.errors.push({ viewport: name, type: "http", url: response.url(), status: response.status() });
    });
}
async function inspectObjects(page, mobile)
{
    const frames = page.locator(".object-frame");
    await expect(frames).toHaveCount(6);
    for (let i = 0; i < 6; i++)
    {
        const frame = frames.nth(i);
        await frame.scrollIntoViewIfNeeded();
        await frame.locator(".inspect-trigger").click();
        await expect(frame).toHaveAttribute("data-scale", "2.4");
        await frame.getByRole("button", { name: "Zoom in", exact: true }).click();
        await expect(frame).toHaveAttribute("data-scale", "2.6");
        await frame.getByRole("button", { name: "Reset inspection" }).click();
        await expect(frame).toHaveAttribute("data-scale", "1");
        const image = await frame.locator("img").evaluate((element) => ({ loaded: element.complete, width: element.naturalWidth }));
        expect(image.loaded).toBe(true);
        expect(image.width).toBeGreaterThan(500);
    }
    passed(`${mobile ? "Mobile" : "Desktop"}: all six real images inspect, zoom and reset`);
    const frame = frames.first();
    await frame.scrollIntoViewIfNeeded();
    await frame.locator(".inspect-trigger").focus();
    await page.keyboard.press("Enter");
    await expect(frame).toHaveAttribute("data-scale", "2.4");
    await page.keyboard.press("+");
    await expect(frame).toHaveAttribute("data-scale", "2.6");
    await page.keyboard.press("ArrowRight");
    expect(await frame.locator("img").evaluate((img) => img.style.transform)).toContain("translate(25px");
    await page.keyboard.press("Escape");
    await expect(frame).toHaveAttribute("data-scale", "1");
    passed(`${mobile ? "Mobile" : "Desktop"}: keyboard entry, zoom, pan, Escape`);
    await frame.locator(".inspect-trigger").click();
    const box = await frame.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 35, { steps: 5 });
    await page.mouse.up();
    const pan = await frame.locator("img").evaluate((img) => img.style.transform);
    expect(pan).not.toContain("translate(0px, 0px)");
    await page.mouse.wheel(0, -300);
    await expect(frame).toHaveAttribute("data-scale", "2.5");
    for (let i = 0; i < 3; i++) await frame.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect(frame).toHaveAttribute("data-scale", "3");
    await expect(frame.getByRole("button", { name: "Zoom in", exact: true })).toBeDisabled();
    for (let i = 0; i < 10; i++) await frame.getByRole("button", { name: "Zoom out", exact: true }).click();
    await expect(frame).toHaveAttribute("data-scale", "1");
    await expect(frame.getByRole("button", { name: "Zoom out", exact: true })).toBeDisabled();
    await frame.getByRole("button", { name: "Reset inspection" }).click();
    passed(`${mobile ? "Mobile" : "Desktop"}: real pointer drag, wheel zoom, bounds 1–3`);
    if (mobile)
    {
        const client = await page.context().newCDPSession(page);
        await frame.locator(".inspect-trigger").tap();
        const position = await frame.boundingBox();
        const start = { x: position.x + position.width / 2, y: position.y + position.height / 2 };
        await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
        await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + 45, y: start.y + 25 }] });
        await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        expect(await frame.locator("img").evaluate((img) => img.style.transform)).not.toContain("translate(0px, 0px)");
        await frame.getByRole("button", { name: "Reset inspection" }).tap();
        await client.detach();
        passed("Mobile: real touch inspector entry and drag");
    }
}
async function tickets(page, name)
{
    const form = page.locator("#ticket-form");
    await form.scrollIntoViewIfNeeded();
    await expect(page.locator("#ticket-total")).toHaveText("$36");
    await page.getByRole("button", { name: "Increase Adults", exact: true }).click();
    await page.getByRole("button", { name: "Increase Reduced", exact: true }).click();
    await page.getByRole("button", { name: "Increase Under 18", exact: true }).click();
    await expect(page.locator("#ticket-total")).toHaveText("$66");
    await form.locator('[data-day="SUN"]').click();
    await expect(form.locator('[data-time="10:00"]')).toBeDisabled();
    await expect(form.locator('[data-time="11:30"]')).toHaveAttribute("aria-pressed", "true");
    await expect(form.locator('[data-day="MON"]')).toBeDisabled();
    await expect(form.locator('[data-time="13:00"]')).toBeDisabled();
    await form.locator('[data-time="14:30"]').click();
    await form.locator(".reserve").click();
    await expect(form.locator(".saved-panel")).toBeVisible();
    await expect(form.locator(".saved-panel")).toContainText("nothing was charged; tickets are not held.");
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("the-meridian-house-slot")))).toEqual({ day: "SUN", time: "14:30", adults: 3, children: 1, reduced: 1 });
    await page.reload({ waitUntil: "networkidle" });
    await expect(form.locator(".saved-panel")).toBeVisible();
    await expect(page.locator("#count-adults")).toHaveText("3");
    await expect(form.locator('[data-day="SUN"]')).toHaveAttribute("aria-pressed", "true");
    await form.locator(".edit-pick").click();
    await form.locator('[data-time="16:00"]').click();
    await expect(page.locator("#ticket-total")).toHaveText("Pay what you wish");
    await expect(form.locator(".ticket-status")).toContainText("contribution at admission");
    await form.locator('[data-time="14:30"]').click();
    for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Decrease Adults", exact: true }).click();
    await page.getByRole("button", { name: "Decrease Reduced", exact: true }).click();
    await page.getByRole("button", { name: "Decrease Under 18", exact: true }).click();
    await form.locator(".reserve").click();
    await expect(form.locator(".ticket-status")).toHaveText("Add at least one visitor.");
    await expect(form.locator(".saved-panel")).toBeHidden();
    await expect(page.getByRole("button", { name: "Decrease Adults", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Increase Adults", exact: true }).click();
    await form.locator(".reserve").focus();
    await page.keyboard.press("Enter");
    await expect(form.locator(".saved-panel")).toBeVisible();
    passed(`${name}: pricing, free admission, closed/sold-out availability, local persistence, reload, edit, donation, empty-party prevention, keyboard save`);
}
async function events(page, name)
{
    const button = page.locator(".event-plan").first();
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#event-status")).toContainText("sample event plan");
    await page.reload({ waitUntil: "networkidle" });
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("the-meridian-house-events")))).toEqual([]);
    passed(`${name}: event selection saves, reloads and removes`);
}
async function capture(page, name)
{
    // Reveal each section through actual scrolling before recording a complete page.
    for (const element of await page.locator(".reveal").all()) await element.scrollIntoViewIfNeeded();
    await page.evaluate(async () =>
    {
        await Promise.all([...document.images].map((image) => image.decode()));
        await document.fonts.ready;
        window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(800);
    const file = path.join(checks, `${name}.png`);
    await page.screenshot({ path: file });
    const full = path.join(checks, `${name}-full.png`);
    await page.screenshot({ path: full, fullPage: true });
    results.screenshots[name] = file;
    results.fullPageScreenshots[name] = full;
    passed(`${name}: real first-screen and full-page screenshots`);
}
try
{
    server = await startPreviewServer(exported, { workspace });
    const ready = await fetch(server.url);
    expect(ready.status).toBe(200);
    results.url = server.url;
    browser = await chromium.launch({ headless: true });
    for (const [name, viewport, mobile] of [["desktop", { width: 1200, height: 900 }, false], ["mobile", { width: 390, height: 844 }, true]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        track(page, name);
        results.viewports.push({ name, ...viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        await loaded(page, `${name}: HTTP, visible exhibition, actual hero photo and English-only page`);
        await overflow(page, `${name}: initial horizontal overflow`);
        if (mobile)
        {
            const menu = page.locator(".menu-toggle");
            await menu.tap();
            await expect(menu).toHaveAttribute("aria-expanded", "true");
            await page.keyboard.press("Escape");
            await expect(menu).toHaveAttribute("aria-expanded", "false");
            await menu.tap();
            await page.locator("#mobile-navigation").getByRole("link", { name: "Objects", exact: true }).tap();
            await expect(page.locator("#mobile-navigation")).toBeHidden();
            expect(new URL(page.url()).hash).toBe("#objects");
            passed("Mobile: drawer tap, Escape, anchor navigation and close");
        }
        await inspectObjects(page, mobile);
        await tickets(page, name);
        await events(page, name);
        await overflow(page, `${name}: horizontal overflow after all interactions`);
        await page.evaluate(() => localStorage.clear());
        await page.goto(server.url, { waitUntil: "networkidle" });
        await capture(page, name);
        await context.close();
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    track(page, "resilience");
    await loaded(page, "Reduced-motion homepage");
    const transition = await page.locator(".object-frame img").first().evaluate((img) => getComputedStyle(img).transitionDuration);
    expect(transition).toBe("0s");
    await page.evaluate(() =>
    {
        localStorage.setItem("the-meridian-house-slot", JSON.stringify({ day: "MON", time: "13:00", adults: -10 }));
        localStorage.setItem("the-meridian-house-events", "not-json");
    });
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("#ticket-total")).toHaveText("$36");
    await expect(page.locator(".saved-panel")).toBeHidden();
    await page.evaluate(() =>
    {
        Storage.prototype.setItem = () => { throw new DOMException("Denied", "SecurityError"); };
    });
    await page.locator(".reserve").click();
    await expect(page.locator(".ticket-status").first()).toContainText("could not save");
    await expect(page.locator(".saved-panel")).toBeHidden();
    await page.locator(".event-plan").first().click();
    await expect(page.locator("#event-status")).toContainText("could not save");
    await expect(page.locator(".event-plan").first()).toHaveAttribute("aria-pressed", "false");
    passed("Reduced motion, invalid saved data recovery and denied ticket/event storage without false success");
    await overflow(page, "Resilience: no horizontal overflow");
    await context.close();
    expect(results.errors).toEqual([]);
    passed("No HTTP/resource/request/console/page errors across all browser tests");
    results.status = "passed";
}
catch (error)
{
    results.status = "failed";
    results.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    results.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), results);
    console.log(JSON.stringify({ status: results.status, assertions: results.assertions.length, errors: results.errors, failure: results.failure, resourcesClosed: results.resourcesClosed }, null, 2));
}
