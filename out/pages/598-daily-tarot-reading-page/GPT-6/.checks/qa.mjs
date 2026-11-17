import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { chromium, expect } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles: W } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const checks = path.join(job.output, ".checks");
const evidence =
{
    prompt: job.prompt,
    modelId: job.modelId,
    timestamp: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: [],
    resourcesClosed: false
};
let browser;
let server;

function passed(name, details)
{
    evidence.assertions.push({ name, passed: true, details });
}

function watch(page, label)
{
    page.on("pageerror", (error) => evidence.errors.push(`${label}: pageerror: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            evidence.errors.push(`${label}: console: ${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => evidence.errors.push(`${label}: request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            evidence.errors.push(`${label}: HTTP ${response.status()} ${response.url()}`);
        }
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(new URL(server.url).origin) && !request.url().startsWith("data:"))
        {
            evidence.errors.push(`${label}: unexpected external request ${request.url()}`);
        }
    });
}

async function overflow(page, label)
{
    const dimensions = await page.evaluate(() => (
    {
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${label} overflow: ${JSON.stringify(dimensions)}`);
    passed(`${label}: no horizontal overflow`, dimensions);
}

async function snapshot(page, name, fullPage = false)
{
    const file = path.join(checks, name);
    await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {}))));
    await page.screenshot({ path: file, fullPage });
    evidence.screenshots.push(file);
}

async function ready(page)
{
    const response = await page.goto(server.url);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("#table")).toHaveAttribute("data-state", "idle");
    await expect(page.locator(".fan-card")).toHaveCount(6);
    await expect(page.locator("#download")).toBeDisabled();
}

async function draw(page, keyboard = false)
{
    const primary = page.locator("#primary");
    if (keyboard)
    {
        await primary.focus();
        await page.keyboard.press("Enter");
    }
    else
    {
        await primary.click();
    }
    await expect(page.locator("#table")).toHaveAttribute("data-state", "ready");
    if (keyboard)
    {
        await primary.focus();
        await page.keyboard.press("Enter");
    }
    else
    {
        await primary.click();
    }
    await expect(page.locator("#table")).toHaveAttribute("data-state", "revealed");
    await expect(page.locator("#download")).toBeEnabled();
    await expect(page.locator("#reading-heading")).toBeFocused();
}

async function signature(page)
{
    return page.locator("[data-result-id]").evaluateAll((nodes) => nodes.map((node) => (
    {
        id: node.dataset.resultId,
        orientation: node.dataset.orientation
    })));
}

async function download(page, filename)
{
    const waiting = page.waitForEvent("download");
    await page.locator("#download").click();
    const file = await waiting;
    assert.match(file.suggestedFilename(), /^asterhollow-\d{4}-\d{2}-\d{2}\.png$/);
    const destination = path.join(checks, filename);
    await file.saveAs(destination);
    const png = await fs.readFile(destination);
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1080);
    assert.equal(png.readUInt32BE(20), 1350);
    assert.ok(png.length > 20000);
    passed(`Actual ${filename} download`, { filename: file.suggestedFilename(), width: 1080, height: 1350, bytes: png.length });
}

try
{
    const lockPid = Number((await W.text(job.promptLock)).trim());
    const state = await W.json(job.stateFile);
    process.kill(lockPid, 0);
    assert.equal(state.ownedLock.pid, lockPid);
    assert.equal(state.ownedLock.prompt, job.prompt);
    server = await startPreviewServer(path.join(job.output, "out"), { workspace: root });
    assert.match(new URL(server.url).pathname, /^\/pages\/daily-tarot-reading-page\/GPT-6\/index\.html$/);
    assert.equal((await fetch(server.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
    passed("Live attached prompt lock and isolated final-subpath HTTP server", { pid: lockPid, url: server.url });
    browser = await chromium.launch({ headless: true });

    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, acceptDownloads: true });
    const page = await desktop.newPage();
    watch(page, "desktop");
    evidence.viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1, reducedMotion: false });
    await ready(page);
    await overflow(page, "Desktop initial");
    await snapshot(page, "desktop.png");
    passed("English visible homepage, six actual fan backs, initial disabled download and self-hosted fonts", await page.evaluate(() => (
    {
        language: document.documentElement.lang,
        displayFont: document.fonts.check("500 30px Cormorant"),
        bodyFont: document.fonts.check("400 14px Manrope"),
        visibleTextCharacters: document.body.innerText.length
    })));

    await page.locator("#primary").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#table")).toHaveAttribute("data-state", "shuffling");
    await expect(page.locator("#primary")).toBeDisabled();
    await expect(page.locator('[data-mode="three"]')).toBeDisabled();
    await page.locator("#primary").evaluate((button) =>
    {
        for (let index = 0; index < 12; index++)
        {
            button.click();
        }
    });
    await expect(page.locator("#table")).toHaveAttribute("data-state", "ready");
    await page.locator("#primary").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("#table")).toHaveAttribute("data-state", "revealed");
    await expect(page.locator("#reading-heading")).toBeFocused();
    await expect(page.locator("#download")).toBeEnabled();
    const daily = await signature(page);
    assert.equal(daily.length, 1);
    assert.ok(["upright", "reversed"].includes(daily[0].orientation));
    await overflow(page, "Desktop daily revealed");
    await snapshot(page, "desktop-reading.png");
    passed("Keyboard shuffle/reveal, transition lockout, rapid-click guard, one stable oriented card and focus handoff", daily);
    await download(page, "daily-download.png");

    await page.locator("#reflection").fill("A small idea deserves my care. <not html>");
    await page.getByRole("button", { name: "Save reflection", exact: true }).click();
    await expect(page.locator("#journal-status")).toHaveText("Saved in this browser.");
    await page.reload();
    await expect(page.locator("#table")).toHaveAttribute("data-state", "revealed");
    assert.deepEqual(await signature(page), daily);
    await expect(page.locator("#reflection")).toHaveValue("A small idea deserves my care. <not html>");
    const storage = await page.evaluate(() => Object.entries(localStorage).map(([key, value]) => ({ key, value: JSON.parse(value) })));
    const savedReading = storage.find((entry) => entry.key.includes(":reading:"));
    assert.equal(savedReading.value.version, 1);
    assert.equal(savedReading.value.mode, "daily");
    assert.equal(savedReading.value.id, daily[0].id);
    assert.match(savedReading.key, /^asterhollow:reading:\d{4}-\d{2}-\d{2}$/);
    passed("Daily id/orientation and private journal persist across reload; versioned date-namespaced local storage", storage);
    await page.getByRole("button", { name: "Clear note", exact: true }).click();
    await expect(page.locator("#reflection")).toHaveValue("");
    await page.reload();
    await expect(page.locator("#reflection")).toHaveValue("");
    passed("Journal clear persists and user text is never injected as markup");

    await page.locator('[data-mode="three"]').click();
    await expect(page.locator("#table")).toHaveAttribute("data-state", "idle");
    await draw(page, true);
    const spread = await signature(page);
    assert.equal(new Set(spread.map((item) => item.id)).size, 3);
    assert.ok(spread.every((item) => ["upright", "reversed"].includes(item.orientation)));
    await expect(page.locator(".card-position")).toHaveText(["Past", "Present", "Future"]);
    await overflow(page, "Desktop three-card revealed");
    await download(page, "three-download.png");
    await page.locator("#primary").click();
    await expect(page.locator("#table")).toHaveAttribute("data-state", "ready");
    await page.locator("#primary").click();
    await expect(page.locator("#table")).toHaveAttribute("data-state", "revealed");
    assert.equal(new Set((await signature(page)).map((item) => item.id)).size, 3);
    await page.locator('[data-mode="daily"]').click();
    assert.deepEqual(await signature(page), daily);
    passed("Distinct three-card Fisher–Yates spread, freely repeatable reset, named positions and preserved daily reading", spread);

    for (const id of ["ember", "current", "threshold", "garden", "mirror", "orbit"])
    {
        const card = page.locator(`[data-card="${id}"]`);
        await card.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#card-dialog")).toBeVisible();
        await expect(page.locator("#dialog-content")).toContainText("Upright");
        await expect(page.locator("#dialog-content")).toContainText("Reversed");
        const close = page.getByRole("button", { name: "Close card meaning", exact: true });
        await close.focus();
        await page.keyboard.press("Tab");
        assert.ok(await page.evaluate(() => document.activeElement === document.body || Boolean(document.activeElement.closest("#card-dialog"))));
        await page.keyboard.press("Escape");
        await expect(page.locator("#card-dialog")).not.toBeVisible();
        await expect(card).toBeFocused();
    }
    await page.locator("#deck").scrollIntoViewIfNeeded();
    await snapshot(page, "desktop-deck.png");
    passed("All six real illustrated card dialogs; native modal keyboard containment, Escape and focus return");
    const firstFaq = page.locator(".faq summary").first();
    await firstFaq.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq details").first()).toHaveAttribute("open", "");
    await expect(page.locator(".faq details").first()).toContainText("They do not predict events");
    passed("Keyboard FAQ and explicit entertainment / no-professional-advice disclosure");

    await page.setViewportSize({ width: 1440, height: 900 });
    evidence.viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await overflow(page, "1440px desktop");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, acceptDownloads: true });
    const phone = await mobile.newPage();
    watch(phone, "mobile");
    evidence.viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    await ready(phone);
    await overflow(phone, "Mobile initial");
    await snapshot(phone, "mobile-top.png");
    await phone.locator("#table").scrollIntoViewIfNeeded();
    await snapshot(phone, "mobile.png");
    await draw(phone);
    await expect(phone.locator("#journal")).toBeVisible();
    await overflow(phone, "Mobile daily revealed");
    await phone.locator("#table").scrollIntoViewIfNeeded();
    await snapshot(phone, "mobile-reading.png");
    await phone.locator('[data-mode="three"]').tap();
    await draw(phone);
    assert.equal(new Set((await signature(phone)).map((item) => item.id)).size, 3);
    assert.equal(await phone.locator(".interpretations details[open]").count(), 1);
    await phone.locator(".interpretations summary").nth(1).tap();
    await expect(phone.locator(".interpretations details").nth(1)).toHaveAttribute("open", "");
    await overflow(phone, "Mobile three-card after expandable interpretation");
    await download(phone, "mobile-download.png");
    await phone.locator('[data-card="mirror"]').tap();
    await expect(phone.locator("#card-dialog")).toBeVisible();
    const dialogSize = await phone.locator("#card-dialog").boundingBox();
    assert.ok(dialogSize.width <= 390 && dialogSize.height <= 844 * .9 + 1);
    await phone.getByRole("button", { name: "Close card meaning", exact: true }).tap();
    await overflow(phone, "Mobile after dialog");
    passed("Mobile touch daily/three-card flow, stacked expandable meanings, actual download and 90svh native dialog", { dialogSize });
    await mobile.close();

    const recovery = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const recoveryPage = await recovery.newPage();
    watch(recoveryPage, "storage-recovery");
    await recovery.addInitScript(() =>
    {
        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        localStorage.setItem(`asterhollow:reading:${date}`, '{"version":1,"id":"not-a-card","orientation":"sideways"}');
    });
    await ready(recoveryPage);
    await draw(recoveryPage);
    const recovered = await signature(recoveryPage);
    assert.equal(recovered.length, 1);
    await overflow(recoveryPage, "Reduced-motion malformed-storage recovery");
    passed("Malformed stored card silently rejected; full reduced-motion reading flow works", recovered);
    await recovery.close();

    const timezone = await browser.newContext({ viewport: { width: 1200, height: 900 }, timezoneId: "America/Los_Angeles", reducedMotion: "reduce" });
    const datedPage = await timezone.newPage();
    watch(datedPage, "local-date");
    await datedPage.clock.install({ time: new Date("2026-11-16T07:59:50Z") });
    await ready(datedPage);
    await draw(datedPage);
    const localStorageKeys = await datedPage.evaluate(() => Object.keys(localStorage));
    assert.ok(localStorageKeys.includes("asterhollow:reading:2026-11-15"));
    assert.ok(!localStorageKeys.includes("asterhollow:reading:2026-11-16"));
    await datedPage.clock.setSystemTime(new Date("2026-11-16T08:01:00Z"));
    await datedPage.locator('[data-mode="three"]').click();
    await datedPage.locator('[data-mode="daily"]').click();
    await expect(datedPage.locator("#table")).toHaveAttribute("data-state", "idle");
    await draw(datedPage);
    assert.ok((await datedPage.evaluate(() => Object.keys(localStorage))).includes("asterhollow:reading:2026-11-16"));
    passed("Local calendar date differs correctly from UTC; midnight mode switch resets prior-day reading");
    await timezone.close();

    const reversed = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    await reversed.addInitScript(() =>
    {
        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        localStorage.setItem(`asterhollow:reading:${date}`, JSON.stringify({ version: 1, date, mode: "daily", id: "mirror", orientation: "reversed" }));
    });
    const reversedPage = await reversed.newPage();
    watch(reversedPage, "reversed");
    await reversedPage.goto(server.url);
    await expect(reversedPage.locator("#table")).toHaveAttribute("data-state", "revealed");
    await expect(reversedPage.locator(".orientation")).toHaveText("Reversed");
    await expect(reversedPage.locator(".meaning")).toContainText("Avoid using self-reflection as self-judgment.");
    const transforms = await reversedPage.evaluate(() => (
    {
        art: getComputedStyle(document.querySelector(".art-reversed")).transform,
        label: getComputedStyle(document.querySelector(".meaning h3")).transform
    }));
    assert.equal(transforms.art, "matrix(-1, 0, 0, -1, 0, 0)");
    assert.equal(transforms.label, "none");
    await overflow(reversedPage, "Reversed restored reading");
    await reversedPage.locator("#table").scrollIntoViewIfNeeded();
    await snapshot(reversedPage, "desktop-reversed.png");
    passed("Validated reversed reading restores exact card/meaning; only illustration rotates while labels stay upright", transforms);
    await reversed.close();

    const blocked = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    await blocked.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage",
        {
            get()
            {
                throw new DOMException("Storage unavailable", "SecurityError");
            }
        });
    });
    const privatePage = await blocked.newPage();
    watch(privatePage, "blocked-storage");
    await ready(privatePage);
    await draw(privatePage);
    const blockedDaily = await signature(privatePage);
    await privatePage.locator("#reflection").fill("A note without persistent storage.");
    await privatePage.getByRole("button", { name: "Save reflection", exact: true }).click();
    await expect(privatePage.locator("#journal-status")).toContainText("storage is unavailable");
    await privatePage.reload();
    await draw(privatePage);
    assert.deepEqual(await signature(privatePage), blockedDaily);
    passed("Blocked-storage graceful journal feedback and deterministic daily id/orientation after reload", blockedDaily);
    await blocked.close();

    assert.deepEqual(evidence.errors, []);
    passed("Zero browser console/page/request/HTTP errors and zero external runtime requests");
    evidence.passed = true;
}
catch (error)
{
    evidence.failure = error.stack;
    console.error(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (server)
    {
        await server.close();
    }
    evidence.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), evidence);
    console.log(JSON.stringify({ passed: evidence.passed, assertions: evidence.assertions.length, errors: evidence.errors, failure: evidence.failure, resourcesClosed: evidence.resourcesClosed }));
}
