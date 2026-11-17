import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { WorkspaceFiles: W, StaticHomepage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "575-classroom-random-name-picker");
const folder = job.output;
const checks = path.join(folder, ".checks");
const exported = path.join(folder, "out");
const results = [];
const errors = [];
const requests = [];
const storageKey = "classroom-shuffle-v1";
let browser;
let service;
let closed = false;
const mark = (name) => results.push({ name, passed: true });
const getState = (page) => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
const noOverflow = async (page, label) =>
{
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no page overflow`);
    assert.ok(await page.locator("main").isVisible());
    mark(label);
};
const watch = (page) =>
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
    page.on("request", (request) => requests.push({ method: request.method(), url: request.url() }));
};
const draw = async (page, keyboard = false) =>
{
    if (keyboard) await page.keyboard.press("Space");
    else await page.locator("#start").click();
    assert.equal(await page.locator("#stop").isVisible(), true);
    await page.waitForTimeout(140);
    if (keyboard) await page.keyboard.press("Space");
    else await page.locator("#stop").click();
    await page.waitForFunction(() => document.querySelector("#stop").hidden, null, { timeout: 5000 });
};
const reset = async (page) =>
{
    await page.locator("#reset").click();
    await page.locator("#confirm-accept").click();
};

try
{
    const digest = await StaticHomepage.validateStaticOutput(exported, "classroom-random-name-picker", "GPT-6");
    mark("Independent static output and final public subpath");
    service = await startPreviewServer(exported, { workspace: root });
    const context = await chromium.launch({ headless: true });
    browser = context;
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    watch(page);
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(new URL(service.url).pathname, "/pages/classroom-random-name-picker/GPT-6/index.html");
    assert.ok((await page.locator("body").innerText()).length > 500);
    assert.equal(await page.locator("#roster-total").innerText(), "24");
    assert.equal(await page.locator(".local-status").innerText(), "Local mode · KV offline");
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    assert.equal(/[\u3400-\u9fff]/u.test(await page.locator("body").innerText()), false);
    await noOverflow(page, "Desktop 1200×900 initial meaningful English homepage");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    mark("Real desktop screenshot captured");

    await page.locator("#edit-event").click();
    await page.locator("#event-input").fill("Friday discovery");
    await page.locator("#event-input").press("Space");
    assert.equal(await page.locator("#stop").isVisible(), false);
    await page.locator("#event-input").fill("Friday discovery");
    await page.locator("#event-form button[type='submit']").click();
    assert.equal(await page.locator("#event-title").innerText(), "Friday discovery");
    await page.locator("[data-speed='fast']").click();
    assert.equal(await page.locator("[data-speed='fast']").getAttribute("aria-pressed"), "true");
    await draw(page, true);
    let data = await getState(page);
    assert.equal(data.drawn.length, 1);
    assert.equal(data.records[0].event, "Friday discovery");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal((await getState(page)).drawn.length, 1);
    assert.equal(await page.locator(".winner-card").count(), 1);
    mark("Editable activity, input-safe Space, speed, keyboard draw and persisted round");

    await page.keyboard.press("f");
    await page.waitForFunction(() => Boolean(document.fullscreenElement));
    await page.keyboard.press("f");
    await page.waitForFunction(() => !document.fullscreenElement);
    await page.locator("#sound").click();
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "true");
    await draw(page);
    await page.locator("#sound").click();
    assert.equal(await page.locator("#sound").getAttribute("aria-pressed"), "false");
    mark("Actual fullscreen keyboard roundtrip, optional sound and reveal");

    await page.evaluate((key) =>
    {
        const roster = ["Alex", "Blair", "Casey", "Drew", "Eden"].map((name, index) => ({ id: `test-${index}`, name, paused: index === 4 }));
        localStorage.setItem(key, JSON.stringify({ event: "Small class", roster, drawn: [], winners: [], records: [], sequence: 0 }));
    }, storageKey);
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#draw-count").selectOption("3");
    await draw(page);
    data = await getState(page);
    assert.equal(data.drawn.length, 3);
    assert.equal(new Set(data.drawn).size, 3);
    assert.ok(!data.drawn.includes("test-4"));
    const hiddenId = data.winners[0].id;
    await page.locator(".winner-card .icon-button").first().click();
    assert.equal((await getState(page)).drawn.length, 3);
    await draw(page);
    data = await getState(page);
    assert.equal(data.drawn.length, 4);
    assert.equal(new Set(data.drawn).size, 4);
    assert.ok(data.drawn.includes(hiddenId));
    assert.equal(data.winners.length, 3);
    assert.equal(data.records[0].names.length, 1);
    assert.ok(await page.locator("#start").isDisabled());
    assert.equal(await page.locator("#remaining-stat").innerText(), "0");
    mark("Real 3+1 multi-draw: no repeats, paused exclusion, hidden winner stays excluded, pool clamp and exhaustion");

    await reset(page);
    data = await getState(page);
    assert.equal(data.drawn.length, 0);
    assert.equal(data.sequence, 0);
    assert.equal(data.roster[4].paused, true);
    assert.equal(data.records.length, 2);
    assert.equal(await page.locator("#remaining-stat").innerText(), "4");
    await page.locator("#draw-count").selectOption("10");
    await draw(page);
    assert.equal((await getState(page)).winners.length, 4);
    assert.equal((await getState(page)).winners[0].order, 1);
    mark("Reset restores eligibility and numbering, preserves pauses/history, handles requested count above pool");

    await page.locator(".history-shortcut").click();
    assert.equal(await page.locator(".history-record").count(), 3);
    await page.locator("#history-filter").fill("no matching activity");
    assert.equal(await page.locator(".history-record").count(), 0);
    await page.locator("#history-filter").fill("small");
    assert.equal(await page.locator(".history-record").count(), 3);
    await page.locator("#clear-history").click();
    await page.locator("#confirm-cancel").click();
    assert.equal((await getState(page)).records.length, 3);
    await page.locator("#clear-history").click();
    await page.locator("#confirm-accept").click();
    data = await getState(page);
    assert.equal(data.records.length, 0);
    assert.equal(data.drawn.length, 4);
    await noOverflow(page, "Desktop after gameplay and history dialog");
    await page.keyboard.press("Escape");
    mark("Local history filter, clear cancellation and confirmed deletion independent of round");

    await page.locator(".view-roster").click();
    await page.locator("#new-name").fill("Frank");
    await page.locator("#new-name").press("Enter");
    assert.equal((await getState(page)).roster.length, 6);
    await page.locator(".import-section summary").click();
    await page.locator("#paste-names").fill("  Frank  \nFRANK\nGale\n<img src=x onerror=alert(1)>");
    await page.locator("#paste-add").click();
    data = await getState(page);
    assert.equal(data.roster.length, 8);
    assert.equal(await page.locator("#roster-list img").count(), 0);
    assert.ok((await page.locator("#roster-message").innerText()).includes("2 duplicate"));
    await page.getByRole("checkbox", { name: "Include Gale", exact: true }).uncheck();
    assert.equal((await getState(page)).roster.find((student) => student.name === "Gale").paused, true);
    await page.getByRole("button", { name: "Remove Frank from roster", exact: true }).click();
    assert.equal((await getState(page)).roster.length, 7);
    mark("Real manual/paste roster edits, deduplication, safe text, pause and remove");
    await page.locator("#file-import").setInputFiles({ name: "class.txt", mimeType: "text/plain", buffer: Buffer.from("Harley\nIndigo\nAlex") });
    await page.waitForFunction((key) => JSON.parse(localStorage.getItem(key)).roster.length === 9, storageKey);
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#export").click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "classroom-roster.txt");
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const exportedNames = Buffer.concat(chunks).toString("utf8").split("\n");
    assert.equal(exportedNames.length, 9);
    assert.ok(exportedNames.includes("Harley"));
    await page.locator("#file-import").setInputFiles({ name: "wrong.csv", mimeType: "text/plain", buffer: Buffer.from("Wrong") });
    await page.waitForFunction(() => document.querySelector("#roster-message").textContent.includes(".txt"));
    assert.equal((await getState(page)).roster.length, 9);
    await page.locator("#paste-names").fill(Array.from({ length: 510 }, (_, index) => `Test Student ${index + 1}`).join("\n"));
    await page.locator("#paste-add").click();
    data = await getState(page);
    assert.equal(data.roster.length, 500);
    assert.ok((await page.locator("#roster-message").innerText()).includes("500-student limit"));
    await page.keyboard.press("Escape");
    await reset(page);
    await page.locator("#draw-count").selectOption("10");
    await draw(page);
    assert.equal((await getState(page)).drawn.length, 10);
    await noOverflow(page, "Desktop after 500-name capacity and ten-person draw");
    mark("TXT import/export bytes, invalid file handling, 500-name cap and real ten-person draw");

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    watch(phone);
    assert.equal((await phone.goto(service.url, { waitUntil: "networkidle" })).status(), 200);
    await noOverflow(phone, "Mobile 390×844 initial homepage");
    await phone.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    await phone.locator("#draw-count").selectOption("2");
    await draw(phone);
    assert.equal((await getState(phone)).drawn.length, 2);
    await phone.locator(".view-roster").tap();
    await phone.locator("#new-name").fill("Mobile Student");
    await phone.locator("#add-form button").tap();
    assert.equal((await getState(phone)).roster.length, 25);
    await noOverflow(phone, "Mobile after draw and roster modal interactions");
    await phone.locator("[aria-label='Close roster']").tap();
    await phone.getByRole("button", { name: "Open draw history", exact: true }).tap();
    assert.equal(await phone.locator(".history-record").count(), 1);
    await phone.locator("#history-filter").fill("no mobile match");
    assert.equal(await phone.locator(".history-record").count(), 0);
    await phone.locator("[aria-label='Close history']").tap();
    await phone.reload({ waitUntil: "networkidle" });
    assert.equal((await getState(phone)).roster.length, 25);
    assert.equal((await getState(phone)).drawn.length, 2);
    await noOverflow(phone, "Mobile persisted roster and picked students");
    await phone.setViewportSize({ width: 320, height: 740 });
    await noOverflow(phone, "Narrow 320px layout");
    mark("Real mobile touch draw/add/close, persistence and responsive 320px edge");

    const fallback = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await fallback.addInitScript(() =>
    {
        Storage.prototype.setItem = () => { throw new DOMException("Storage blocked", "QuotaExceededError"); };
        Storage.prototype.getItem = () => { throw new DOMException("Storage blocked", "SecurityError"); };
    });
    const fallbackPage = await fallback.newPage();
    watch(fallbackPage);
    await fallbackPage.goto(service.url, { waitUntil: "networkidle" });
    assert.ok((await fallbackPage.locator(".roster-footer").innerText()).includes("Session only"));
    await draw(fallbackPage);
    assert.equal(await fallbackPage.locator(".winner-card").count(), 1);
    assert.equal(await fallbackPage.locator(".confetti").count(), 0);
    await noOverflow(fallbackPage, "Storage-denied reduced-motion browser remains functional");
    mark("Graceful storage failure and reduced motion");

    const one = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    const last = await one.newPage();
    watch(last);
    await last.goto(service.url);
    await last.evaluate((key) => localStorage.setItem(key, JSON.stringify({ roster: [], event: "Empty class" })), storageKey);
    await last.reload();
    assert.ok(await last.locator("#start").isDisabled());
    assert.equal(await last.locator("#name-display").innerText(), "Room for your class");
    await last.locator(".view-roster").click();
    await last.locator("#new-name").fill("Only Student");
    await last.locator("#add-form button").click();
    await last.keyboard.press("Escape");
    await last.locator("#draw-count").selectOption("10");
    await draw(last);
    assert.equal((await getState(last)).drawn.length, 1);
    assert.ok(await last.locator("#start").isDisabled());
    await reset(last);
    assert.ok(await last.locator("#start").isEnabled());
    mark("Empty and one-person rosters: start guard, exhaustion and reset");
    assert.deepEqual(errors, []);
    assert.ok(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(service.url).origin));
    assert.ok(requests.every((request) => !request.url.includes("/api/")));
    mark("Zero console/page/request/HTTP errors; no external or API requests throughout");
    assert.equal(await StaticHomepage.validateStaticOutput(exported, "classroom-random-name-picker", "GPT-6"), digest);
}
catch (error)
{
    errors.push(error.stack || String(error));
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    closed = true;
    await W.saveJson(path.join(checks, "qa.json"),
    {
        passed: errors.length === 0,
        timestamp: new Date().toISOString(),
        modelId: job.modelId,
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }, { width: 320, height: 740 }],
        results,
        errors,
        requests: { total: requests.length, external: requests.filter((request) => service && new URL(request.url).origin !== new URL(service.url).origin).length },
        screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
        visualReviewed: false,
        resourcesClosed: closed
    });
    console.log(JSON.stringify({ passed: errors.length === 0, groups: results.length, errors, resourcesClosed: closed }, null, 2));
}
