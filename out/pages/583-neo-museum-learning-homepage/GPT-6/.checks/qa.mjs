import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const workspace = path.resolve(folder, "..", "..", "..", "..");
const results = [];
const errors = [];
let browser;
let server;
const qa =
{
    passed: false,
    visualReviewed: false,
    viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
    results,
    errors,
    resourcesClosed: false
};
function passed(name)
{
    results.push({ name, passed: true });
}
async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
    assert.ok(dimensions.content <= dimensions.viewport, `${label}: ${JSON.stringify(dimensions)}`);
    passed(label);
}
function watch(page)
{
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
}
try
{
    qa.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "neo-museum-learning-homepage", "GPT-6");
    passed("StaticHomepage independent export and final subpath validation");
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    qa.url = server.url;
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
    assert.equal((await fetch(new URL("metadata.json", server.url))).status, 404);
    passed("Actual static HTTP 200; source and metadata outside public mount");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    watch(page);
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("#chapter-counter").innerText(), "03 / 05");
    await page.waitForTimeout(2900);
    assert.equal(await page.locator("h2").first().innerText(), "TIMELESS\nWONDERS");
    assert.ok(await page.locator(".hero-specimen img").evaluate((image) => image.complete && image.naturalWidth > 0));
    assert.ok((await page.locator("body").innerText()).length > 1500);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await noOverflow(page, "Desktop homepage no horizontal overflow");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    passed("1200×900 DPR1 actual desktop screenshot and meaningful visible homepage");
    await page.locator("#autoplay").click();
    assert.equal(await page.locator("#autoplay").getAttribute("aria-pressed"), "false");
    const pausedChapter = await page.locator("#chapter-counter").innerText();
    await page.locator("#collection").evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(checks, "collection.png") });
    await page.waitForTimeout(3650);
    assert.equal(await page.locator("#chapter-counter").innerText(), pausedChapter);
    passed("Tour initially selects chapter 3; pause prevents automatic cycling");
    await page.locator("#autoplay").click();
    await page.locator(".hero h2").hover();
    await page.waitForTimeout(3600);
    assert.notEqual(await page.locator("#chapter-counter").innerText(), pausedChapter);
    await page.locator("[data-chapter='0']").click();
    assert.equal(await page.locator("#learn-title").innerText(), "A giant predator, pieced together.");
    assert.equal(await page.locator("#autoplay").getAttribute("aria-pressed"), "false");
    passed("Tour cycles; manual chapter synchronizes text and pauses");
    await page.locator("#tab-0").focus();
    await page.keyboard.press("ArrowDown");
    assert.equal(await page.locator("#tab-1").getAttribute("aria-selected"), "true");
    assert.equal(await page.locator("#chapter-image").getAttribute("src"), "ammonite.svg");
    await page.keyboard.press("End");
    assert.equal(await page.locator("#tab-4").getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    assert.equal(await page.locator("#tab-0").getAttribute("aria-selected"), "true");
    passed("Keyboard arrow/Home/End chapter navigation, image and ARIA state");
    await page.locator("#investigate").click();
    assert.equal(await page.locator("dialog").evaluate((element) => element.open), true);
    await page.locator("[data-answer='0']").click();
    assert.match(await page.locator(".feedback").innerText(), /Look again/);
    assert.equal(await page.locator("#save-note").isDisabled(), true);
    await page.locator("[data-answer='1']").click();
    assert.match(await page.locator(".feedback").innerText(), /Correct/);
    await page.locator("#save-note").click();
    assert.match(await page.locator("#save-note").innerText(), /Saved on this device/);
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.activeElement.id), "investigate");
    assert.match(await page.locator("#trail-status").innerText(), /1 \/ 5/);
    await noOverflow(page, "Desktop after evidence interaction no horizontal overflow");
    passed("Evidence quiz rejects wrong answer, explains right answer, saves note, Escape restores focus");
    await page.reload({ waitUntil: "networkidle" });
    assert.match(await page.locator("#trail-status").innerText(), /1 \/ 5/);
    passed("Field notes persist across real reload");
    await page.locator("[data-topic='2']").click();
    assert.equal(await page.locator("#dialog-title").innerText(), "From water to stone.");
    await page.locator("#mineral-chapter").click();
    assert.equal(await page.locator("#tab-1").getAttribute("aria-selected"), "true");
    await page.locator("[data-guide]").first().click();
    assert.match(await page.locator("#dialog-title").innerText(), /field guide/);
    await page.locator("#begin-guide").click();
    assert.equal(await page.locator("dialog").evaluate((element) => element.open), false);
    passed("Minerals learning dialog and field guide navigate to relevant chapters");
    await page.locator("#reset-notes").click();
    assert.match(await page.locator("#trail-status").innerText(), /0 \/ 5/);
    await page.reload({ waitUntil: "networkidle" });
    assert.match(await page.locator("#trail-status").innerText(), /0 \/ 5/);
    passed("Reset clears persistent field notes");
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    watch(phone);
    await phone.goto(server.url, { waitUntil: "networkidle" });
    await phone.waitForTimeout(2900);
    await noOverflow(phone, "Mobile homepage no horizontal overflow");
    await phone.screenshot({ path: path.join(checks, "mobile.png") });
    passed("390×844 DPR1 actual mobile screenshot");
    await phone.locator(".menu-button").click();
    assert.equal(await phone.locator(".menu-button").getAttribute("aria-expanded"), "true");
    await noOverflow(phone, "Mobile open menu no horizontal overflow");
    await phone.locator("#mobile-menu a[href='#collection']").click();
    assert.equal(await phone.locator(".menu-button").getAttribute("aria-expanded"), "false");
    await phone.locator("#tab-3").tap();
    assert.equal(await phone.locator("#chapter-counter").innerText(), "04 / 05");
    await phone.locator(".exhibit-grid").evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
    await phone.waitForTimeout(800);
    await phone.screenshot({ path: path.join(checks, "mobile-collection.png") });
    await phone.locator("#investigate").tap();
    await phone.locator("[data-answer='2']").tap();
    assert.match(await phone.locator(".feedback").innerText(), /Correct/);
    await phone.locator("#save-note").tap();
    await noOverflow(phone, "Mobile evidence dialog no horizontal overflow");
    await phone.locator(".close-dialog").tap();
    assert.match(await phone.locator("#trail-status").innerText(), /1 \/ 5/);
    await phone.locator("[data-topic='0']").tap();
    assert.equal(await phone.locator("#tab-0").getAttribute("aria-selected"), "true");
    await noOverflow(phone, "Mobile after topic/chapter/quiz interactions no horizontal overflow");
    passed("Mobile menu, topic selection, marine quiz and local note interactions");
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const still = await reduced.newPage();
    watch(still);
    await still.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await still.locator("#autoplay").getAttribute("aria-pressed"), "false");
    assert.equal(await still.locator(".hero-specimen").evaluate((element) => getComputedStyle(element).animationName), "none");
    passed("Reduced motion disables intro animation and autoplay");
    for (let index = 0; index < 5; index++)
    {
        await page.locator(`[data-chapter='${index}']`).click();
        await page.locator("#investigate").click();
        await page.locator(`[data-answer='${[1, 0, 1, 2, 0][index]}']`).click();
        assert.match(await page.locator(".feedback").innerText(), /Correct/);
        await page.locator("#save-note").click();
        await page.keyboard.press("Escape");
    }
    assert.match(await page.locator("#trail-status").innerText(), /5 \/ 5/);
    passed("All five chapters provide working evidence questions and complete field-note trail");
    for (const current of [page, phone])
    {
        assert.equal(await current.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
        const external = await current.evaluate(() => performance.getEntriesByType("resource").filter((entry) => new URL(entry.name).origin !== location.origin).map((entry) => entry.name));
        assert.deepEqual(external, []);
    }
    passed("All images loaded; no external runtime dependencies");
    assert.deepEqual(errors, []);
    passed("No console, JavaScript, failed request or HTTP resource errors");
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    qa.resourcesClosed = true;
    qa.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
