import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const exported = path.join(folder, "out");
const results = [];
const errors = [];
const requests = new Set();
const evidence = {
    status: "running",
    modelId: "gpt-6.1-sol",
    viewports: { desktop: { width: 1200, height: 900, deviceScaleFactor: 1 }, mobile: { width: 390, height: 844, deviceScaleFactor: 1 } },
    tests: results,
    errors,
    visualReviewed: false,
    resourcesClosed: false
};
let service;
let browser;

function track(page)
{
    page.on("pageerror", (error) => errors.push(`Page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            errors.push(`Console: ${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => errors.push(`Request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        requests.add(response.url());
        if (response.status() >= 400)
        {
            errors.push(`HTTP ${response.status()}: ${response.url()}`);
        }
    });
}

async function check(name, run)
{
    await run();
    results.push({ name, passed: true });
}

async function overflow(page, label)
{
    const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        dialogs: [...document.querySelectorAll("dialog[open]")].map((dialog) => ({ width: dialog.clientWidth, scroll: dialog.scrollWidth }))
    }));
    assert.ok(dimensions.document <= dimensions.viewport && dimensions.body <= dimensions.viewport, `${label}: ${JSON.stringify(dimensions)}`);
    assert.ok(dimensions.dialogs.every((dialog) => dialog.scroll <= dialog.width), `${label}: dialog overflow`);
    return dimensions;
}

async function finishLesson(page, id, answers, wrongFirst = false)
{
    await page.locator(`#path-steps [data-lesson="${id}"], #lesson-grid [data-lesson="${id}"]`).first().click();
    await page.locator("#lesson-dialog").waitFor({ state: "visible" });
    assert.equal(await page.locator("#check-answer").isDisabled(), true);
    for (let index = 0; index < answers.length; index++)
    {
        const answer = wrongFirst && index === 0 ? (answers[index] + 1) % 3 : answers[index];
        await page.locator(`[data-answer="${answer}"]`).focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator(`[data-answer="${answer}"]`).getAttribute("aria-pressed"), "true");
        await page.locator("#check-answer").click();
        assert.ok((await page.locator(".quiz-feedback").innerText()).includes(index === 0 && wrongFirst ? "learning moment" : "That's it"));
        assert.equal(await page.locator(`.answer-option[data-answer="${answers[index]}"]`).getAttribute("class").then((value) => value.includes("correct")), true);
        assert.equal(await page.locator("[data-answer]").first().isDisabled(), true);
        await page.locator("#check-answer").click();
    }
    assert.match(await page.locator(".completion").innerText(), new RegExp(`${wrongFirst ? 2 : 3} of 3`));
    await page.locator("#finish-lesson").click();
}

try
{
    service = await startPreviewServer(exported, { workspace: root });
    evidence.url = service.url;
    assert.ok(service.url.endsWith("/pages/personalized-language-learning-platform/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await desktop.newPage();
    track(page);
    await check("Static HTTP, final mount, independent resources, initial English homepage", async () =>
    {
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.match(await page.locator("h1").innerText(), /Your world, a little bigger/);
        assert.ok((await page.locator("main").innerText()).length > 1500);
        assert.equal(await page.locator("#completed-count").innerText(), "0");
        assert.equal(await page.locator("#accuracy").innerText(), "—");
        assert.equal(await page.locator("#lesson-grid .lesson-card").count(), 6);
        assert.ok(!/[\u3400-\u9fff\u3040-\u30ff\u0400-\u04ff]/u.test(await page.locator("body").innerText()));
        await overflow(page, "desktop before interactions");
        const outside = await desktop.request.get(new URL("/README.md", service.url).href);
        assert.equal(outside.status(), 404);
        await page.screenshot({ path: path.join(checks, "desktop.png") });
    });
    await check("Keyboard profile, Escape focus restoration, deterministic personalization and persistence", async () =>
    {
        const profile = page.locator(".language-switch");
        await profile.focus();
        await page.keyboard.press("Enter");
        await page.locator("#profile-dialog").waitFor({ state: "visible" });
        await page.keyboard.press("Escape");
        assert.equal(await profile.evaluate((element) => element === document.activeElement), true);
        await profile.click();
        await page.locator('#profile-form [name="name"]').fill("Jamie");
        await page.locator('#profile-form [name="level"]').selectOption("intermediate");
        await page.locator('#profile-form [name="focus"]').selectOption("grammar");
        await page.locator('#profile-form [name="goal"]').selectOption("work");
        await overflow(page, "desktop profile dialog");
        await page.locator('#profile-form [type="submit"]').click();
        assert.equal(await page.locator("#learner-name").innerText(), "Jamie");
        assert.equal(await page.locator("#path-steps .path-step").first().getAttribute("data-lesson"), "requests");
        assert.match(await page.locator("#path-summary").innerText(), /intermediate.*English at work/);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#learner-name").innerText(), "Jamie");
        assert.equal(await page.locator("#path-steps .path-step").first().getAttribute("data-lesson"), "requests");
    });
    await check("Combined skill and difficulty lesson filtering", async () =>
    {
        await page.locator('[data-skill="grammar"]').click();
        assert.equal(await page.locator("#lesson-grid .lesson-card").count(), 2);
        await page.locator("#difficulty").selectOption("intermediate");
        assert.equal(await page.locator("#lesson-grid .lesson-card").count(), 1);
        assert.match(await page.locator("#lesson-grid").innerText(), /A kinder way to ask/);
        await page.locator('[data-skill="all"]').click();
        await page.locator("#difficulty").selectOption("all");
    });
    await check("Actual lesson gameplay, disabled submission, incorrect correction, keyboard answers and real scoring", async () =>
    {
        await finishLesson(page, "requests", [1, 0, 2], true);
        assert.equal(await page.locator("#completed-count").innerText(), "1");
        assert.equal(await page.locator("#accuracy").innerText(), "67%");
        assert.equal(await page.locator("#streak").innerText(), "1");
        assert.match(await page.locator("#daily-count").innerText(), /1/);
    });
    await check("All eighteen lesson questions, actual weekly challenge and aggregate outcomes", async () =>
    {
        await finishLesson(page, "connection", [1, 0, 2]);
        await finishLesson(page, "routines", [2, 0, 1]);
        assert.match(await page.locator("#badge-status").innerText(), /badge earned/);
        await finishLesson(page, "cafe", [1, 2, 0]);
        await finishLesson(page, "discovery", [0, 1, 2]);
        await finishLesson(page, "email", [2, 0, 1]);
        assert.equal(await page.locator("#completed-count").innerText(), "6");
        assert.equal(await page.locator("#accuracy").innerText(), "94%");
        assert.match(await page.locator("#challenge-progress").innerText(), /3 of 3/);
    });
    await check("Optional local-only speech playback or honest transcript fallback", async () =>
    {
        await page.locator("#continue-lesson").click();
        if (await page.locator("#listen").isEnabled())
        {
            await page.locator("#listen").click();
            assert.match(await page.locator("#audio-status").innerText(), /local English voice|written passage|transcript/);
        }
        assert.ok((await page.locator(".lesson-reading").innerText()).length > 100);
        await page.keyboard.press("Escape");
    });
    await check("Vocabulary recall gate, six actual ratings, one-minute retry and due scheduling", async () =>
    {
        await page.locator('.sidebar [data-action="vocabulary"]').click();
        assert.equal(await page.locator("#rate-known").isDisabled(), true);
        await page.locator("#reveal-word").focus();
        await page.keyboard.press("Enter");
        assert.match(await page.locator("#reveal-word").innerText(), /Something that could happen/);
        await page.locator("#rate-again").click();
        for (let index = 0; index < 5; index++)
        {
            await page.locator("#reveal-word").click();
            await page.locator("#rate-known").click();
        }
        assert.match(await page.locator("#flashcard-content").innerText(), /caught up/);
        const words = await page.evaluate(() => JSON.parse(localStorage.getItem("fluent-learning-space-v1")).words);
        assert.equal(Object.keys(words).length, 6);
        assert.equal(words.possibility.interval, 0);
        assert.ok(words.possibility.due > Date.now() && words.possibility.due <= Date.now() + 60000);
        assert.equal(words.confident.interval, 1);
        assert.ok(words.confident.due > Date.now() + 86000000);
        await page.locator("#review-all").click();
        await page.locator("#reveal-word").click();
        await page.locator("#rate-known").click();
        await page.locator("#reveal-word").click();
        assert.match(await page.locator("#rate-known").innerText(), /2 days/);
        await page.locator("#rate-known").click();
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#mastered-count").innerText(), "6");
    });
    await check("Journal, on-page reminder, article and FAQ work without backend", async () =>
    {
        await page.locator("#reflection").fill("I want to introduce my work clearly.");
        await page.locator("#save-journal").click();
        assert.match(await page.locator("#journal-status").innerText(), /saved on this device/);
        await page.locator(".notification-button").click();
        await page.locator('#reminder-form [name="time"]').fill("23:59");
        await page.locator('#reminder-form [name="enabled"]').check();
        await page.locator('#reminder-form [type="submit"]').click();
        assert.equal(await page.locator(".notification-dot").isVisible(), true);
        await page.locator('[data-guide="habit"]').click();
        assert.match(await page.locator("#guide-content").innerText(), /Attach it to something familiar/);
        await page.keyboard.press("Escape");
        await page.locator("summary").first().click();
        assert.match(await page.locator("details").first().innerText(), /deterministic assistance/);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#reflection").inputValue(), "I want to introduce my work clearly.");
        assert.equal(await page.locator("#completed-count").innerText(), "6");
        assert.equal(await page.locator(".notification-dot").isVisible(), true);
        await overflow(page, "desktop after all interactions");
    });
    await check("Confirmed data reset is cancel-safe and restores fresh state", async () =>
    {
        page.once("dialog", (dialog) => dialog.dismiss());
        await page.locator("#reset-data").click();
        assert.equal(await page.locator("#completed-count").innerText(), "6");
        page.once("dialog", (dialog) => dialog.accept());
        await page.locator("#reset-data").click();
        assert.equal(await page.locator("#completed-count").innerText(), "0");
        assert.equal(await page.locator("#reflection").inputValue(), "");
        assert.equal(await page.locator("#learner-name").innerText(), "Alex");
        assert.equal(await page.locator(".notification-dot").isVisible(), false);
    });
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const mobile = await mobileContext.newPage();
    track(mobile);
    await check("Mobile fresh homepage, real screenshot and initial overflow", async () =>
    {
        assert.equal((await mobile.goto(service.url, { waitUntil: "networkidle" })).status(), 200);
        await overflow(mobile, "mobile before interactions");
        await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    });
    await check("Mobile personalization, keyboard quiz, local vocabulary, filters, journal and responsive dialogs", async () =>
    {
        await mobile.locator(".language-switch").tap();
        await mobile.locator('#profile-form [name="name"]').fill("Morgan");
        await mobile.locator('#profile-form [name="focus"]').selectOption("reading");
        await mobile.locator('#profile-form [name="goal"]').selectOption("travel");
        await overflow(mobile, "mobile profile");
        await mobile.locator('#profile-form [type="submit"]').tap();
        assert.equal(await mobile.locator("#path-steps .path-step").first().getAttribute("data-lesson"), "cafe");
        await finishLesson(mobile, "cafe", [1, 2, 0]);
        await mobile.locator('.sidebar [data-action="vocabulary"]').tap();
        await mobile.locator("#reveal-word").tap();
        await overflow(mobile, "mobile flashcard");
        await mobile.locator("#rate-known").tap();
        await mobile.locator('#vocab-dialog .close-dialog').tap();
        await mobile.locator('[data-skill="reading"]').tap();
        await mobile.locator("#difficulty").selectOption("beginner");
        assert.equal(await mobile.locator("#lesson-grid .lesson-card").count(), 1);
        await mobile.locator("#reflection").fill("One small step, every day.");
        await mobile.locator("#save-journal").tap();
        await mobile.locator('[data-guide="words"]').tap();
        assert.match(await mobile.locator("#guide-content").innerText(), /Recall before you reveal/);
        await overflow(mobile, "mobile article");
        await mobile.locator('#guide-dialog .close-dialog').tap();
        await overflow(mobile, "mobile after interactions");
        assert.equal(await mobile.locator(".skip").evaluate((element) => element === document.activeElement), false);
        await mobile.screenshot({ path: path.join(checks, "mobile-interacted.png"), fullPage: true });
        await mobile.reload({ waitUntil: "networkidle" });
        assert.equal(await mobile.locator("#learner-name").innerText(), "Morgan");
        assert.equal(await mobile.locator("#completed-count").innerText(), "1");
        assert.equal(await mobile.locator("#mastered-count").innerText(), "1");
    });
    await check("Blocked local storage has explicit unsaved feedback and no crash", async () =>
    {
        const isolated = await browser.newContext({ viewport: { width: 1200, height: 900 } });
        await isolated.addInitScript(() =>
        {
            Storage.prototype.setItem = () =>
            {
                throw new Error("Storage deliberately unavailable for QA");
            };
        });
        const blocked = await isolated.newPage();
        track(blocked);
        await blocked.goto(service.url, { waitUntil: "networkidle" });
        await blocked.locator("#reflection").fill("This should not claim to be saved.");
        await blocked.locator("#save-journal").click();
        assert.match(await blocked.locator("#journal-status").innerText(), /Not saved/);
        assert.match(await blocked.locator("#toast").innerText(), /storage is unavailable/);
        await isolated.close();
    });
    await check("Static validator, public file boundary, only target-local browser requests and no browser errors", async () =>
    {
        evidence.staticDigest = await StaticHomepage.validateStaticOutput(exported, "personalized-language-learning-platform", "GPT-6");
        assert.ok([...requests].every((url) => url.startsWith(new URL(service.url).origin)));
        assert.deepEqual(errors, []);
        evidence.resourcesRequested = [...requests].map((url) => new URL(url).pathname).sort();
    });
    await desktop.close();
    await mobileContext.close();
    evidence.status = "passed";
}
catch (error)
{
    evidence.status = "failed";
    evidence.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (service)
    {
        await service.close();
    }
    evidence.resourcesClosed = true;
    evidence.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), evidence);
    console.log(JSON.stringify({ status: evidence.status, passed: results.length, errors, failure: evidence.failure, resourcesClosed: evidence.resourcesClosed }, null, 2));
}
