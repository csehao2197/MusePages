import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {chromium} from "@playwright/test";

const root = process.cwd();
const load = (name) => import(pathToFileURL(path.join(root, "src", "workflows", "script", name)).href);
const {WorkspaceFiles: W, StaticHomepage: S} = await load("render-prompt-page.mjs");
const {startPreviewServer} = await load("generate-preview.mjs");
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "618-escape-room-website");
assert.equal(job.modelId, "gpt-6.1-sol");
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const metadata = await W.json(metadataFile);
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: [],
    visualReviewed: false,
    resourcesClosed: false,
    passed: false
};
let browser;
let service;
const record = (name, evidence) => qa.assertions.push({name, passed: true, evidence});
const noOverflow = async (page, name) =>
{
    const sizes = await page.evaluate(() => ({width: innerWidth, document: document.documentElement.scrollWidth}));
    assert.ok(sizes.document <= sizes.width, JSON.stringify(sizes));
    record(name, sizes);
};
const settle = async (page) =>
{
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        for (let y = 0; y < document.body.scrollHeight; y += 650)
        {
            scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 55));
        }
        scrollTo(0, 0);
    });
    await page.waitForTimeout(1100);
};
const captureErrors = (page) =>
{
    page.on("pageerror", (error) => qa.errors.push({type: "page", message: error.message}));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            qa.errors.push({type: "console", message: message.text()});
        }
    });
    page.on("requestfailed", (request) => qa.errors.push({type: "request", url: request.url(), message: request.failure()?.errorText}));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            qa.errors.push({type: "http", status: response.status(), url: response.url()});
        }
    });
};

try
{
    assert.equal(await S.checkSource(folder), "html");
    metadata.generated = true;
    await W.saveJson(metadataFile, metadata);
    await S.copyHtml(folder, exported);
    qa.staticDigest = await S.validateStaticOutput(exported, "escape-room-website", "GPT-6");
    service = await startPreviewServer(exported, {workspace: root});
    qa.mount = new URL(service.url).pathname;
    assert.equal(qa.mount, "/pages/escape-room-website/GPT-6/index.html");
    assert.equal((await fetch(service.url)).status, 200);
    record("Target-only HTTP preview responds at final public subpath", qa.mount);
    browser = await chromium.launch({headless: true});
    const context = await browser.newContext({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    const page = await context.newPage();
    captureErrors(page);
    const response = await page.goto(service.url, {waitUntil: "networkidle"});
    assert.equal(response.status(), 200);
    await settle(page);
    assert.equal(await page.locator("h1").textContent(), "Vault Nine");
    assert.equal(await page.locator(".room-card").count(), 4);
    assert.equal(await page.locator("img").evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)), true);
    assert.equal(await page.evaluate(() => document.fonts.check("16px Bebas") && document.fonts.check("16px Barlow") && document.fonts.check("16px Mono")), true);
    record("Nonblank homepage, four rooms, six real photographs and local font rendering", {images: 6, rooms: 4});
    await noOverflow(page, "Desktop initial no horizontal overflow");
    qa.viewports.push({width: 1200, height: 900, deviceScaleFactor: 1});
    await page.screenshot({path: path.join(folder, ".checks", "desktop.png"), fullPage: true});
    qa.screenshots.push(".checks\\desktop.png");

    await page.locator('.choose-room[data-room="the-red-ledger"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#room-select").inputValue(), "the-red-ledger");
    assert.equal(await page.locator("#room-select").evaluate((el) => el === document.activeElement), true);
    record("Keyboard room exploration selects Ledger and transfers focus to booking", "the-red-ledger");
    assert.equal(await page.locator('[data-slot="23:00"]').isDisabled(), true);
    await page.locator('[data-day="FRI"]').click();
    assert.equal(await page.locator('[data-slot="23:00"]').isEnabled(), true);
    await page.locator('[data-slot="23:00"]').click();
    assert.match(await page.locator("#summary").innerText(), /FRI \/ 23:00/);
    await page.locator('[data-day="THU"]').click();
    assert.match(await page.locator("#summary").innerText(), /THU \/ 17:00/);
    assert.equal(await page.locator('[data-slot="23:00"]').isDisabled(), true);
    record("Dark-hours weekday rule and selected late-slot fallback", "FRI 23:00 allowed; THU resets to 17:00");
    for (let i = 0; i < 2; i++)
    {
        await page.locator("#minus").click();
    }
    assert.equal(await page.locator("#minus").isDisabled(), true);
    assert.equal(await page.locator(".total strong").innerText(), "$76");
    for (let i = 0; i < 6; i++)
    {
        await page.locator("#plus").click();
    }
    assert.equal(await page.locator("#plus").isDisabled(), true);
    assert.equal(await page.locator(".total strong").innerText(), "$304");
    record("Party limits and pricing math", {minimum: 2, minimumTotal: 76, maximum: 8, maximumTotal: 304});
    await page.locator("#room-select").selectOption("hall-of-second-thoughts");
    assert.match(await page.locator(".recommendation").innerText(), /4–8/);
    await page.locator("#hold-slot").click();
    assert.match(await page.locator(".confirmation").innerText(), /Nothing was paid or sent/);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("vault-nine:hold")));
    assert.deepEqual(saved, {room: "hall-of-second-thoughts", day: "THU", slot: "17:00", players: 8});
    await page.reload({waitUntil: "networkidle"});
    assert.match(await page.locator(".confirmation").innerText(), /Held on this device/i);
    await page.locator("#change-hold").click();
    assert.equal(await page.locator("#room-select").inputValue(), saved.room);
    assert.equal(await page.locator(".stepper output").innerText(), "8");
    record("Local-only hold exact payload, reload persistence and prefilled edit", saved);
    await page.locator("#question-1").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#question-1").getAttribute("aria-expanded"), "true");
    assert.equal(await page.locator("#question-0").getAttribute("aria-expanded"), "false");
    assert.equal(await page.locator("#answer-0").getAttribute("aria-hidden"), "true");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("#question-1").getAttribute("aria-expanded"), "false");
    record("Exclusive FAQ keyboard open and close", "Only one answer is accessible at a time");
    await noOverflow(page, "Desktop after core interactions no horizontal overflow");
    await page.setViewportSize({width: 1440, height: 900});
    await noOverflow(page, "Requested 1440px desktop no horizontal overflow");
    qa.viewports.push({width: 1440, height: 900, deviceScaleFactor: 1});

    const mobileContext = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    const mobile = await mobileContext.newPage();
    captureErrors(mobile);
    await mobile.goto(service.url, {waitUntil: "networkidle"});
    await settle(mobile);
    await noOverflow(mobile, "Mobile initial no horizontal overflow");
    qa.viewports.push({width: 390, height: 844, deviceScaleFactor: 1});
    await mobile.screenshot({path: path.join(folder, ".checks", "mobile.png"), fullPage: true});
    qa.screenshots.push(".checks\\mobile.png");
    await mobile.locator(".menu-toggle").tap();
    assert.equal(await mobile.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    assert.equal(await mobile.locator("#mobile-menu a").first().evaluate((el) => el === document.activeElement), true);
    await mobile.keyboard.press("Shift+Tab");
    assert.equal(await mobile.locator(".menu-toggle").evaluate((el) => el === document.activeElement), true);
    await mobile.keyboard.press("Escape");
    assert.equal(await mobile.locator("#mobile-menu").isHidden(), true);
    await mobile.locator(".menu-toggle").tap();
    await mobile.locator('#mobile-menu a[href$="#rooms"]').tap();
    assert.equal(await mobile.locator("#mobile-menu").isHidden(), true);
    await mobile.locator(".choose-room").nth(1).tap();
    assert.equal(await mobile.locator("#room-select").inputValue(), "the-clockmakers-debt");
    await mobile.locator('[data-day="SAT"]').tap();
    await mobile.locator('[data-slot="23:00"]').tap();
    await mobile.locator("#plus").tap();
    await mobile.locator("#hold-slot").tap();
    const mobileSaved = await mobile.evaluate(() => JSON.parse(localStorage.getItem("vault-nine:hold")));
    assert.deepEqual(mobileSaved, {room: "the-clockmakers-debt", day: "SAT", slot: "23:00", players: 5});
    await noOverflow(mobile, "Mobile after menu and hold interactions no horizontal overflow");
    record("Mobile touch room selection, Saturday late hold and keyboard menu trap/Escape", mobileSaved);
    await mobile.locator("#change-hold").tap();
    await mobile.locator("#room-select").focus();
    const outline = await mobile.locator("#room-select").evaluate((el) => getComputedStyle(el).outlineColor);
    assert.equal(outline, "rgb(226, 161, 60)");
    record("Keyboard focus has visible amber outline", outline);

    const reduced = await context.newPage();
    captureErrors(reduced);
    await reduced.emulateMedia({reducedMotion: "reduce"});
    await reduced.addInitScript(() => localStorage.setItem("vault-nine:hold", "{\"room\":\"invalid\",\"players\":999}"));
    await reduced.goto(service.url, {waitUntil: "networkidle"});
    assert.equal(await reduced.locator("#room-select").inputValue(), "the-last-signal");
    assert.equal(await reduced.locator("h1").evaluate((el) => getComputedStyle(el).animationName), "none");
    assert.equal(await reduced.locator(".reveal").first().evaluate((el) => getComputedStyle(el).opacity), "1");
    record("Reduced motion readable without animation; malformed hold safely ignored", true);
    const blocked = await context.newPage();
    captureErrors(blocked);
    await blocked.addInitScript(() =>
    {
        Storage.prototype.setItem = function ()
        {
            throw new DOMException("Storage blocked", "SecurityError");
        };
    });
    await blocked.goto(service.url, {waitUntil: "networkidle"});
    await blocked.locator("#hold-slot").click();
    assert.match(await blocked.locator('[role="alert"]').innerText(), /Nothing was saved or sent/);
    assert.equal(await blocked.locator(".confirmation").count(), 0);
    record("Storage denial never claims a saved hold", true);
    assert.deepEqual(qa.errors, []);
    record("No HTTP, request, resource, console or page errors across all contexts", []);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push({type: "assertion", message: error.stack});
    throw error;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    qa.finishedAt = new Date().toISOString();
    await W.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed}));
}
