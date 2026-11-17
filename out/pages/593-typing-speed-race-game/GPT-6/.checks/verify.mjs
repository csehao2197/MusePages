import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { content as C } from "../content.js";
import { score, matchingPrefix, parseRecords } from "../scoring.js";

const folder = path.resolve("out", "pages", "593-typing-speed-race-game", "GPT-6");
const checks = path.join(folder, ".checks");
const qa =
{
    prompt: "593-typing-speed-race-game",
    modelId: "gpt-6.1-sol",
    passed: false,
    visualReviewed: false,
    viewports: [{ width: 1200, height: 900, dpr: 1 }, { width: 1440, height: 900, dpr: 1 }, { width: 390, height: 844, dpr: 1 }],
    assertions: [],
    errors: [],
    evidence: {},
    screenshots: [path.join(checks, "desktop.png"), path.join(checks, "mobile.png")],
    resourcesClosed: false
};
let browser;
let service;

function passed(name, evidence)
{
    qa.assertions.push({ name, passed: true, ...(evidence ? { evidence } : {}) });
}

function observe(page)
{
    page.on("pageerror", (error) => qa.errors.push({ kind: "page", message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            qa.errors.push({ kind: "console", message: message.text() });
        }
    });
    page.on("requestfailed", (request) => qa.errors.push({ kind: "request", url: request.url(), message: request.failure()?.errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            qa.errors.push({ kind: "http", url: response.url(), status: response.status() });
        }
    });
}

async function load(page)
{
    observe(page);
    const response = await page.goto(service.url);
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForSelector("#difficulties button");
    assert.equal(await page.locator("h1").textContent(), "Outtype the echo.");
    assert.equal(await page.locator("#race").getAttribute("data-state"), "idle");
}

async function noOverflow(page, label)
{
    const size = await page.evaluate(() => ({ viewport: innerWidth, actual: document.documentElement.scrollWidth }));
    assert.ok(size.actual <= size.viewport, `${label}: ${JSON.stringify(size)}`);
    passed(label, size);
}

async function start(page, controlled = false)
{
    await page.locator("#primary").click();
    assert.equal(await page.locator("#race").getAttribute("data-state"), "countdown");
    assert.equal(await page.locator("#typing").isDisabled(), true);
    assert.equal(await page.locator("#next").isDisabled(), true);
    if (controlled)
    {
        await page.clock.runFor(2700);
    }
    else
    {
        await page.waitForFunction(() => document.getElementById("race").dataset.state === "racing");
    }
    assert.equal(await page.locator("#typing").isDisabled(), false);
}

async function race(page, difficulty, index = 0)
{
    const before = JSON.parse(await page.evaluate((key) => localStorage.getItem(key), C.storageKey));
    await page.locator(`[data-level="${difficulty}"]`).click();
    if (index === 1)
    {
        await page.locator("#next").click();
    }
    await start(page, true);
    const passage = Array.from(C.passages[difficulty][index]);
    await page.keyboard.type(passage[0]);
    await page.clock.runFor(10000);
    const ghost = Number(await page.locator("#track").getAttribute("data-ghost"));
    assert.ok(Math.abs(ghost - 10 * C.levels[difficulty].pace * 5 / 60 / passage.length) < .001);
    await page.keyboard.type(passage.slice(1).join(""));
    await page.waitForFunction(() => document.getElementById("race").dataset.state === "finished");
    await page.waitForFunction(() => document.activeElement.id === "result-title");
    assert.equal(await page.locator("#results").isVisible(), true);
    assert.equal(Number(await page.locator("#track").getAttribute("data-player")), 1);
    assert.equal(await page.locator("#passage .wrong").count(), 0);
    assert.equal(await page.locator("#passage .correct").count(), passage.length);
    const after = JSON.parse(await page.evaluate((key) => localStorage.getItem(key), C.storageKey));
    const run = after.runs[0];
    assert.equal(run.personalBest, !before?.bests[difficulty] || run.wpm > before.bests[difficulty].wpm);
    assert.equal(after.bests[difficulty].wpm, Math.max(before?.bests[difficulty]?.wpm || 0, run.wpm));
    assert.equal(after.bests[difficulty].lastElapsed, run.elapsed);
    return run;
}

try
{
    assert.equal(score(5, 6, 5, 1000, 100, 30).wpm, 60);
    assert.equal(score(5, 6, 5, 1000, 100, 30).accuracy, 100 * 5 / 6);
    assert.equal(score(0, 0, 0, 0, 100, 30).accuracy, 100);
    assert.equal(score(5, 6, 5, 60000, 100, 30).ghost, 1);
    assert.equal(matchingPrefix(["a", "→", "x"], ["a", "→", "b"]), 2);
    for (const raw of ["null", "{", '{"version":1,"runs":[{}],"bests":{},"sequence":1}'])
    {
        assert.deepEqual(parseRecords(raw, C.levels, C.passages), { runs: [], bests: {}, sequence: 0 });
    }
    passed("Pure scoring, entry-denominator accuracy, Unicode prefix and malformed storage");
    qa.evidence.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "typing-speed-race-game", "GPT-6");
    service = await startPreviewServer(path.join(folder, "out"));
    qa.evidence.finalSubpath = new URL(service.url).pathname;
    assert.equal(qa.evidence.finalSubpath, "/pages/typing-speed-race-game/GPT-6/index.html");
    assert.equal((await fetch(new URL("/", service.url))).status, 404);
    passed("Only target static directory served at the final public subpath");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await context.newPage();
    await load(page);
    await noOverflow(page, "Desktop initial no horizontal overflow");
    assert.equal(await page.locator("#recent li").count(), 1);
    assert.equal(await page.locator("#clear").isDisabled(), true);
    assert.equal(await page.locator('[data-level="Medium"]').getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator('[data-level="Medium"]').isDisabled(), false);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page, "1440px no horizontal overflow");
    assert.ok((await page.locator(".track-panel").boundingBox()).height >= 430);
    await page.screenshot({ path: path.join(checks, "desktop-wide.png") });
    await page.setViewportSize({ width: 1200, height: 900 });
    passed("Default Medium, honest empty records and desktop cockpit");

    await start(page);
    await page.waitForTimeout(300);
    assert.equal(Number(await page.locator("#race").getAttribute("data-elapsed")), 0);
    assert.equal(Number(await page.locator("#track").getAttribute("data-ghost")), 0);
    await page.keyboard.type("A", { delay: 50 });
    await page.waitForTimeout(300);
    assert.ok(Number(await page.locator("#race").getAttribute("data-elapsed")) >= 250);
    await page.keyboard.type("x");
    assert.equal(await page.locator("#passage .wrong").count(), 1);
    const value = await page.locator("#typing").inputValue();
    await page.keyboard.type("zzzz");
    assert.equal(await page.locator("#typing").inputValue(), value);
    assert.equal(Number(await page.locator("#race").getAttribute("data-entries")), 2);
    await page.keyboard.press("Backspace");
    assert.equal(await page.locator("#passage .wrong").count(), 0);
    await page.keyboard.type("t");
    assert.equal((await page.locator("#accuracy").textContent()).trim(), "66.7%");
    assert.equal(Number(await page.locator("#race").getAttribute("data-entries")), 3);
    const expectedWpm = await page.evaluate(() => Math.round((2 / 5) / (Number(document.getElementById("race").dataset.elapsed) / 60000)));
    assert.ok(Math.abs(Number(await page.locator("#wpm").textContent()) - expectedWpm) <= 1);
    passed("Real wall-clock starts on first printable key; mismatch lock, Backspace and lasting 66.7% accuracy");

    await page.locator("#primary").click();
    const frozen = Number(await page.locator("#race").getAttribute("data-elapsed"));
    const frozenGhost = Number(await page.locator("#track").getAttribute("data-ghost"));
    await page.waitForTimeout(400);
    assert.equal(Number(await page.locator("#race").getAttribute("data-elapsed")), frozen);
    assert.equal(Number(await page.locator("#track").getAttribute("data-ghost")), frozenGhost);
    await page.locator("#primary").click();
    await page.waitForTimeout(150);
    const resumed = Number(await page.locator("#race").getAttribute("data-elapsed"));
    assert.ok(resumed > frozen && resumed < frozen + 350);
    await page.evaluate(() =>
    {
        Object.defineProperty(document, "hidden", { configurable: true, value: true });
        document.dispatchEvent(new Event("visibilitychange"));
        delete document.hidden;
    });
    assert.equal(await page.locator("#race").getAttribute("data-state"), "paused");
    const hiddenTime = Number(await page.locator("#race").getAttribute("data-elapsed"));
    await page.waitForTimeout(250);
    assert.equal(Number(await page.locator("#race").getAttribute("data-elapsed")), hiddenTime);
    await page.locator("#primary").click();
    passed("Manual pause/resume and simulated visibility-loss event exclude elapsed time and ghost motion", { frozen, resumed, hiddenTime });

    await page.locator("#typing").evaluate((input) =>
    {
        const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: new DataTransfer() });
        event.clipboardData.setData("text/plain", "hacked");
        input.dispatchEvent(event);
        if (!event.defaultPrevented)
        {
            throw new Error("Paste was not prevented");
        }
        const drop = new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() });
        input.dispatchEvent(drop);
        if (!drop.defaultPrevented)
        {
            throw new Error("Drop was not prevented");
        }
    });
    assert.equal(await page.locator("#typing").inputValue(), "At");
    await page.locator("#restart").click();
    assert.match(await page.locator("#restart").textContent(), /Confirm restart/);
    assert.equal(await page.locator("#typing").inputValue(), "At");
    await page.locator("#restart").click();
    assert.equal(await page.locator("#race").getAttribute("data-state"), "countdown");
    assert.equal(await page.locator("#typing").inputValue(), "");
    await page.waitForFunction(() => document.getElementById("race").dataset.state === "racing");
    passed("Paste/drop rejected; destructive restart requires confirmation and resets all metrics");
    await noOverflow(page, "Desktop after gameplay no horizontal overflow");
    await context.close();

    const clockContext = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"], reducedMotion: "reduce" });
    const controlled = await clockContext.newPage();
    await load(controlled);
    await controlled.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await controlled.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
    await start(controlled, true);
    await controlled.keyboard.type("A");
    await controlled.clock.runFor(10000);
    assert.equal(Number(await controlled.locator("#wpm").textContent()), 1);
    const ghostAtTen = Number(await controlled.locator("#track").getAttribute("data-ghost"));
    assert.ok(Math.abs(ghostAtTen - 10 * 45 * 5 / 60 / 330) < .001);
    await controlled.clock.runFor(100000);
    assert.equal(Number(await controlled.locator("#track").getAttribute("data-ghost")), 1);
    assert.equal(await controlled.locator("#race").getAttribute("data-state"), "racing");
    assert.match(await controlled.locator("#position").textContent(), /keep typing/);
    await controlled.keyboard.type(C.passages.Medium[0].slice(1));
    await controlled.waitForFunction(() => document.getElementById("race").dataset.state === "finished");
    const slow = JSON.parse(await controlled.evaluate((key) => localStorage.getItem(key), C.storageKey)).runs[0];
    assert.equal(slow.wpm, 36);
    assert.match(await controlled.locator("#winner").textContent(), /Echo reached/);
    assert.ok(slow.elapsed >= 110000 && slow.elapsed < 110100);
    passed("Controlled browser-clock ghost formula, ghost-first continuation and exact full-passage finish", { ghostAtTen, finalWpm: slow.wpm, elapsed: slow.elapsed });

    const completed = [];
    for (const level of ["Easy", "Medium", "Hard"])
    {
        for (const index of [0, 1])
        {
            const run = await race(controlled, level, index);
            assert.equal(run.accuracy, 100);
            assert.equal(run.difficulty, level);
            assert.equal(run.passage, index);
            assert.equal(run.wpm, Math.round(Array.from(C.passages[level][index]).length / 5 / (run.elapsed / 60000)));
            completed.push({ difficulty: level, passage: index + 1, wpm: run.wpm, accuracy: run.accuracy, elapsed: run.elapsed });
        }
    }
    passed("All six full original passages complete via native keyboard, including Hard numbers, punctuation and Unicode arrows", completed);
    await noOverflow(controlled, "Desktop finished results no horizontal overflow");
    await controlled.screenshot({ path: path.join(checks, "results.png"), fullPage: true });
    assert.equal(await controlled.locator("#result-title").evaluate((element) => document.activeElement === element), true);
    await controlled.locator("#copy").click();
    const clipboard = await controlled.evaluate(() => navigator.clipboard.readText());
    assert.match(clipboard, /Keyway Circuit/);
    assert.match(clipboard, new RegExp(String(completed.at(-1).wpm)));
    passed("Result heading receives focus and copy contains actual metrics");
    await controlled.evaluate(() =>
    {
        Object.defineProperty(navigator, "clipboard",
        {
            configurable: true,
            value: { writeText: async () => { throw new Error("QA clipboard denied"); } }
        });
    });
    await controlled.locator("#copy").click();
    assert.equal(await controlled.locator("#copy-fallback").isVisible(), true);
    assert.match(await controlled.locator("#copy-fallback").inputValue(), /Hard/);
    assert.equal(await controlled.locator("#copy-fallback").evaluate((element) => element.selectionEnd > element.selectionStart), true);
    passed("Denied clipboard provides selected visible manual-copy field without false sharing success");
    const downloadPromise = controlled.waitForEvent("download");
    await controlled.locator("#download").click();
    const download = await downloadPromise;
    assert.match(download.suggestedFilename(), /^keyway-circuit-hard-\d+wpm.png$/);
    await download.saveAs(path.join(checks, "actual-result-download.png"));
    const png = await fs.readFile(path.join(checks, "actual-result-download.png"));
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    passed("Actual result PNG download is 1200×630 with a brand/difficulty/WPM filename");

    await controlled.locator("#again").click();
    await controlled.clock.runFor(2700);
    assert.equal(await controlled.locator("#passage").textContent(), C.passages.Hard[1]);
    await controlled.locator("#restart").click();
    await controlled.clock.runFor(2700);
    await controlled.locator("#primary").click();
    assert.equal(await controlled.locator("#race").getAttribute("data-state"), "paused");
    await controlled.locator("#restart").click();
    await controlled.clock.runFor(2700);
    await controlled.keyboard.type(Array.from(C.passages.Hard[1])[0]);
    await controlled.clock.runFor(1000);
    await controlled.keyboard.type(Array.from(C.passages.Hard[1]).slice(1).join(""));
    await controlled.waitForFunction(() => document.getElementById("race").dataset.state === "finished");
    await controlled.locator("#result-next").click();
    assert.equal(await controlled.locator("#passage").textContent(), C.passages.Hard[0]);
    passed("Race again repeats the passage; result Next passage cycles it; restart also works while paused");
    for (let index = 0; index < 4; index++)
    {
        await race(controlled, "Easy", index % 2);
    }
    let data = JSON.parse(await controlled.evaluate((key) => localStorage.getItem(key), C.storageKey));
    assert.equal(data.runs.length, 10);
    assert.equal(data.sequence, 12);
    assert.equal((await controlled.locator("#recent li").count()), 10);
    assert.equal(Object.keys(data.bests).length, 3);
    for (let i = 1; i < data.runs.length; i++)
    {
        assert.ok(data.runs[i - 1].sequence > data.runs[i].sequence);
    }
    await controlled.reload();
    await controlled.waitForSelector("#recent li");
    assert.equal(await controlled.locator("#recent li").count(), 10);
    assert.equal((await controlled.locator("#best-rows tr").count()), 3);
    passed("Twelve real completed test runs retain ten newest with per-difficulty bests, sequence labels and reload persistence");
    await controlled.locator("#clear").click();
    assert.match(await controlled.locator("#clear").textContent(), /Confirm clear/);
    assert.equal(await controlled.locator("#recent li").count(), 10);
    await controlled.locator("#clear").click();
    assert.match(await controlled.locator("#empty").textContent(), /No finishes/);
    assert.equal(await controlled.evaluate((key) => localStorage.getItem(key), C.storageKey), null);
    passed("Confirmed history clear removes records and bests; first click preserves them");
    await clockContext.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    await load(mobile);
    await noOverflow(mobile, "Mobile initial no horizontal overflow");
    const touchTargets = await mobile.locator("a, button, #passage").evaluateAll((elements) => elements.map((element) =>
    {
        const box = element.getBoundingClientRect();
        return { label: element.textContent.trim().slice(0, 40), width: box.width, height: box.height };
    }).filter((target) => target.width > 0 && target.height > 0));
    assert.ok(touchTargets.every((target) => target.width >= 44 && target.height >= 44), JSON.stringify(touchTargets));
    passed("Every visible mobile link, button and passage focus target is at least 44×44", touchTargets);
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    const startBox = await mobile.locator("#primary").boundingBox();
    assert.ok(startBox.y + startBox.height <= 844, `Mobile Start race must fit the first screen: ${JSON.stringify(startBox)}`);
    const passageBox = await mobile.locator("#passage").boundingBox();
    assert.ok(passageBox.y < 844);
    await start(mobile);
    await mobile.locator("#tap").tap();
    assert.equal(await mobile.locator("#typing").evaluate((element) => document.activeElement === element), true);
    await mobile.keyboard.insertText("At");
    await mobile.waitForTimeout(150);
    assert.equal(await mobile.locator("#typing").inputValue(), "At");
    await mobile.keyboard.insertText("x");
    await mobile.keyboard.insertText("z");
    assert.equal(await mobile.locator("#typing").inputValue(), "Atx");
    await mobile.keyboard.press("Backspace");
    await mobile.keyboard.insertText(" ");
    assert.equal(await mobile.locator("#typing").inputValue(), "At ");
    await mobile.keyboard.insertText(C.passages.Medium[0].slice(3));
    await mobile.waitForFunction(() => document.getElementById("race").dataset.state === "finished");
    await mobile.waitForTimeout(500);
    assert.equal(await mobile.locator("#results").isVisible(), true);
    assert.equal(await mobile.locator("#countdown").textContent(), "");
    await noOverflow(mobile, "Mobile finished results and history no horizontal overflow");
    await mobile.screenshot({ path: path.join(checks, "mobile-results.png"), fullPage: true });
    const mobileButtons = await mobile.locator("#results button").evaluateAll((buttons) => buttons.map((button) => ({ text: button.textContent, height: button.getBoundingClientRect().height })));
    assert.ok(mobileButtons.every((button) => button.height >= 44));
    passed("390×844 touch-native typing, mismatch repair, actual completed result and 44px result controls", { startBox, mobileButtons, note: "Touch emulation; physical OS keyboard appearance is not claimed." });
    await mobileContext.close();

    const storageContext = await browser.newContext();
    await storageContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("QA storage denied", "SecurityError"); } });
    });
    const noStorage = await storageContext.newPage();
    await load(noStorage);
    assert.match(await noStorage.locator("#storage-note").textContent(), /only for this visit/);
    await noStorage.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
    await noStorage.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
    await start(noStorage, true);
    await noStorage.keyboard.type("A");
    await noStorage.clock.runFor(2000);
    await noStorage.keyboard.type(C.passages.Medium[0].slice(1));
    await noStorage.waitForFunction(() => document.getElementById("race").dataset.state === "finished");
    assert.match(await noStorage.locator("#recent").textContent(), /Run 01/);
    passed("Unavailable localStorage keeps completed scores for the current page session");
    await storageContext.close();

    const malformedContext = await browser.newContext();
    const malformed = await malformedContext.newPage();
    await load(malformed);
    await malformed.evaluate((key) => localStorage.setItem(key, '{"version":1,"runs":[{"difficulty":"bad"}],"bests":{},"sequence":1}'), C.storageKey);
    await malformed.reload();
    await malformed.waitForSelector("#empty");
    assert.match(await malformed.locator("#empty").textContent(), /No finishes/);
    assert.equal(await malformed.locator("#clear").isDisabled(), true);
    passed("Malformed persisted data safely recovers to honest empty records");
    await malformedContext.close();
    assert.deepEqual(qa.errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push({ kind: "assertion", message: error.message, stack: error.stack });
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
