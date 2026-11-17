import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const job = JSON.parse(await fs.readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "580-environmental-learning-resource-platform");
const folder = job.output;
const checks = path.join(folder, ".checks");
const results = {
    prompt: job.prompt,
    modelId: job.modelId,
    timestamp: new Date().toISOString(),
    passed: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    visualReviewed: false,
    resourcesClosed: false
};
let browser;
let service;

function record(name)
{
    results.assertions.push({ name, passed: true });
}

function track(page)
{
    page.on("pageerror", (error) => results.errors.push(`Page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") results.errors.push(`Console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => results.errors.push(`Request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) results.errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
}

async function noOverflow(page, name)
{
    const sizes = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(sizes.scroll <= sizes.client && sizes.body <= sizes.client, JSON.stringify(sizes));
    record(`${name}: no horizontal overflow`);
}

try
{
    service = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.ok(service.url.includes("/pages/environmental-learning-resource-platform/GPT-6/"));
    browser = await chromium.launch();
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await desktop.newPage();
    track(page);
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").innerText(), "A better future\nstarts with\nunderstanding.");
    assert.equal(await page.locator(".resource-card").count(), 6);
    assert.ok(await page.locator("body").innerText().then((text) => text.length > 2000));
    await page.evaluate(() => document.fonts.ready);
    await noOverflow(page, "Desktop initial");
    results.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
    results.screenshots.desktop = path.join(checks, "desktop.png");
    await page.screenshot({ path: results.screenshots.desktop });
    record("Desktop final-subpath HTTP 200, meaningful English homepage and six resources");

    await page.locator('[data-filter="Energy"]').click();
    assert.equal(await page.locator(".resource-card").count(), 2);
    await page.locator("#format").selectOption("Toolkit");
    assert.equal(await page.locator(".resource-card").count(), 1);
    await page.locator("#resource-search").fill("no-such-resource-zz");
    assert.equal(await page.locator(".resource-card").count(), 0);
    assert.ok(await page.locator("#empty").isVisible());
    await page.locator('[data-filter="All"]').click();
    await page.locator("#resource-search").fill("watershed");
    assert.equal(await page.locator(".resource-card").count(), 1);
    await page.locator("#resource-search").fill("");
    record("Combined topic, format, full-text search and empty-state filters");

    await page.locator('[data-save="climate"]').click();
    assert.equal(await page.locator("#saved-count").innerText(), "1");
    await page.locator(".saved-filter").click();
    assert.equal(await page.locator(".resource-card").count(), 1);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('[data-save="climate"]').getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator("#saved-count").innerText(), "1");
    record("Bookmark persistence across reload and saved-list filtering");

    await page.locator('h3 [data-open-resource="climate"]').click();
    assert.ok(await page.locator("#reader").isVisible());
    assert.ok((await page.locator(".reader-body").innerText()).includes("Greenhouse gases"));
    await page.locator('input[name="answer"][value="0"]').check();
    await page.locator("#quiz-form button").click();
    assert.ok((await page.locator("#quiz-feedback").innerText()).startsWith("Not quite"));
    await page.locator('input[name="answer"][value="1"]').check();
    await page.locator("#quiz-form button").click();
    assert.ok((await page.locator("#quiz-feedback").innerText()).startsWith("Well understood"));
    await page.locator("#share-resource").click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal(copied, service.url + "#resource-climate");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#reader").isVisible(), false);
    assert.ok((await page.locator(".resource-card").first().innerText()).includes("Knowledge check complete"));
    await page.reload({ waitUntil: "networkidle" });
    assert.ok((await page.locator(".resource-card").first().innerText()).includes("Knowledge check complete"));
    await page.goto(service.url + "#resource-climate", { waitUntil: "networkidle" });
    assert.ok(await page.locator("#reader").isVisible());
    await page.keyboard.press("Escape");
    record("Substantive lesson, incorrect/correct knowledge check, durable completion, clipboard link, deep link and Escape");

    await page.locator('h3 [data-open-resource="waste"]').click();
    const toolkitPromise = page.waitForEvent("download");
    await page.locator("#download-toolkit").click();
    const toolkit = await toolkitPromise;
    assert.equal(toolkit.suggestedFilename(), "rooted-waste-checklist.txt");
    const stream = await toolkit.createReadStream();
    let toolkitText = "";
    for await (const chunk of stream) toolkitText += chunk.toString();
    assert.ok(toolkitText.includes("Check local collection guidance"));
    assert.ok(toolkitText.includes("https://www.epa.gov/"));
    await page.keyboard.press("Escape");
    record("Toolkit downloads a meaningful original checklist with source attribution");

    await page.locator("#distance").focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#distance-label").innerText(), "4 km");
    await page.locator("#days").selectOption("5");
    await page.locator("#travel-mode").selectOption("0.04");
    assert.equal(await page.locator("#impact-value").innerText(), "3.2");
    await page.locator("#impact-form summary").click();
    assert.ok((await page.locator("#impact-form details").innerText()).includes("Fixed teaching factors"));
    record("Keyboard-operated commute scenario: 4 km × 5 days × (0.20 − 0.04) = 3.2 kg CO₂e");

    await page.locator('[data-place="recycling"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#place-title").innerText(), "A recycling hub, imagined");
    const calendarPromise = page.waitForEvent("download");
    await page.locator("#calendar-download").click();
    const calendar = await calendarPromise;
    assert.equal(calendar.suggestedFilename(), "rooted-nature-walk.ics");
    const calendarStream = await calendar.createReadStream();
    let calendarText = "";
    for await (const chunk of calendarStream) calendarText += chunk.toString();
    assert.ok(calendarText.includes("BEGIN:VEVENT"));
    assert.ok(calendarText.includes("Not an organized event"));
    await page.locator(".faq summary").nth(1).click();
    assert.ok((await page.locator(".faq details").nth(1).innerText()).includes("Nothing here measures"));
    record("Keyboard map exploration, actual personal ICS download and honest-data FAQ");

    await page.locator(".join").click();
    await page.locator('[data-path="Nature"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".resource-card").count(), 2);
    assert.equal(await page.locator("#onboarding").isVisible(), false);
    assert.equal(await page.locator('[data-filter="Nature"]').evaluate((node) => node === document.activeElement), true);
    await noOverflow(page, "Desktop after interactions");
    record("Keyboard onboarding selects a learning path and restores meaningful focus");
    assert.equal((await page.request.get(service.url.replace(/index.html$/, "metadata.json"))).status(), 404);
    record("Preview server does not expose private metadata");
    const creditsResponse = await page.request.get(service.url.replace(/index.html$/, "LICENSE.txt"));
    assert.equal(creditsResponse.status(), 200);
    assert.ok((await creditsResponse.text()).includes("Copyright (c) 2025 KingLeoJr"));
    record("Public license and attribution link returns complete MIT notices");
    await page.goto(service.url, { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo({ top: document.getElementById("library").offsetTop, behavior: "instant" }));
    results.screenshots.desktopLibrary = path.join(checks, "desktop-library.png");
    await page.screenshot({ path: results.screenshots.desktopLibrary });

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    track(phone);
    const phoneResponse = await phone.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(phoneResponse.status(), 200);
    await noOverflow(phone, "Mobile initial");
    results.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    results.screenshots.mobile = path.join(checks, "mobile.png");
    await phone.screenshot({ path: results.screenshots.mobile });
    await phone.locator(".menu-toggle").tap();
    assert.equal(await phone.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    await phone.locator('nav a[href="#library"]').tap();
    assert.equal(await phone.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    await phone.locator('[data-filter="Waste"]').tap();
    assert.equal(await phone.locator(".resource-card").count(), 1);
    await phone.locator('h3 [data-open-resource="waste"]').tap();
    assert.ok(await phone.locator("#reader").isVisible());
    await phone.locator('input[name="answer"][value="1"]').check();
    await phone.locator("#quiz-form button").tap();
    assert.ok((await phone.locator("#quiz-feedback").innerText()).startsWith("Well understood"));
    await phone.locator("#reader .dialog-close").tap();
    await phone.locator('[data-save="waste"]').tap();
    assert.equal(await phone.locator("#saved-count").innerText(), "1");
    await phone.locator('[data-place="garden"]').tap();
    assert.equal(await phone.locator("#place-title").innerText(), "A community garden, imagined");
    await phone.locator("#travel-mode").selectOption("0.08");
    assert.equal(await phone.locator("#impact-value").innerText(), "3.6");
    await noOverflow(phone, "Mobile after interactions");
    record("Mobile touch navigation, topic filtering, learning/quiz, modal close, bookmark, map and calculator");
    await phone.evaluate(() => window.scrollTo({ top: document.getElementById("action").offsetTop, behavior: "instant" }));
    results.screenshots.mobileAction = path.join(checks, "mobile-action.png");
    await phone.screenshot({ path: results.screenshots.mobileAction });
    assert.deepEqual(results.errors, []);
    record("No browser console/page/request/resource errors on desktop or mobile");
    results.passed = true;
}
catch (error)
{
    results.errors.push(error.stack || String(error));
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    results.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), results);
    console.log(JSON.stringify(results, null, 2));
}
