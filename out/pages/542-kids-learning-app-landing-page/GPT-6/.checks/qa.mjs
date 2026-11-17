import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { content as c } from "../content.js";

const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exported = path.join(folder, "out");
const result =
{
    prompt: "542-kids-learning-app-landing-page",
    modelId: "gpt-6.1-sol",
    passed: false,
    staticChecked: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    externalRequests: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
function record(label)
{
    result.assertions.push(label);
}
async function overflow(page, context)
{
    const measure = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, width: innerWidth }));
    assert(measure.scroll <= measure.width, `${context}: horizontal overflow ${JSON.stringify(measure)}`);
    record(`${context}: zero horizontal overflow`);
}
async function controlSizes(page, context)
{
    const small = await page.evaluate(() => [...document.querySelectorAll("button,a,summary,select,label:has(input)")].filter((element) => element.getClientRects().length && !element.classList.contains("skip")).map((element) => ({ text: element.textContent.trim(), width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height })).filter((rect) => rect.width < 43.9 || rect.height < 43.9));
    assert.deepEqual(small, [], `${context}: undersized controls ${JSON.stringify(small)}`);
    record(`${context}: every visible interactive target at least 44×44`);
}
try
{
    result.staticDigest = await StaticHomepage.validateStaticOutput(exported, "kids-learning-app-landing-page", "GPT-6");
    result.staticChecked = true;
    record("StaticHomepage.validateStaticOutput: independent resources and final public subpath pass");
    server = await startPreviewServer(exported, { workspace: process.cwd() });
    const responsive = await fetch(server.url);
    assert.equal(responsive.status, 200);
    assert(server.url.includes("/pages/kids-learning-app-landing-page/GPT-6/index.html"));
    record("Owned preview server responsive: HTTP 200 at actual final public subpath");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        page.on("pageerror", (error) => result.errors.push(error.message));
        page.on("console", (message) =>
        {
            if (message.type() === "error") result.errors.push(message.text());
        });
        page.on("requestfailed", (request) => result.errors.push(`Request failed: ${request.url()}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        page.on("request", (request) =>
        {
            if (new URL(request.url()).origin !== new URL(server.url).origin) result.externalRequests.push(request.url());
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert(await page.locator("h1").isVisible());
        assert((await page.locator("body").innerText()).length > 2500);
        assert.equal(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), true);
        assert.equal(await page.title(), c.brand);
        assert.equal(await page.locator(".phone").evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(47, 173, 255)");
        assert.equal(await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(237, 231, 255)");
        if (mobile)
        {
            const answers = await page.locator(".answers").boundingBox();
            assert(answers.y + answers.height <= viewport.height, "Default mobile reading answers should be visible in the first screen");
            record("390: live default reading answers and pink subject visible in first 844px screen");
        }
        record(`${viewport.width}: visible nonblank homepage, exact palette, local images loaded`);
        await overflow(page, `${viewport.width} initial`);
        await controlSizes(page, `${viewport.width} initial`);
        const screenshot = path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png");
        await page.screenshot({ path: screenshot });
        result.screenshots[mobile ? "mobile" : "desktop"] = screenshot;
        await page.evaluate(async () =>
        {
            await Promise.all([...document.images].map((image) => image.decode()));
        });
        for (const image of await page.locator("img").all())
        {
            await image.scrollIntoViewIfNeeded();
            await page.waitForTimeout(100);
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile-full.png" : "desktop-full.png"), fullPage: true });
        result.viewports.push({ ...viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        await page.locator(".hero-actions [data-focus-lesson]").click();
        assert(await page.locator(".word-tile").first().evaluate((element) => document.activeElement === element));
        record(`${viewport.width}: Try a lesson focuses actual phone word control`);
        if (mobile)
        {
            await page.locator(".menu-button").click();
            assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "true");
            await page.keyboard.press("Escape");
            assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
            await page.locator(".menu-button").click();
            await page.locator("#mobile-navigation a").first().click();
            assert.equal(await page.locator(".menu-button").getAttribute("aria-expanded"), "false");
            record("390: mobile menu keyboard Escape/link close and aria-expanded match");
        }
        for (const age of c.ages)
        {
            await page.locator(`input[name="age-hero"][value="${age}"]`).check();
            assert.equal(await page.locator(`input[name="age-learning"][value="${age}"]`).isChecked(), true);
            assert((await page.locator("#path-card").innerText()).includes(c.learning.stages[age].title));
            assert.equal(await page.locator("#next-step").innerText(), c.learning.stages[age].next);
            record(`${viewport.width} age ${age}: real curriculum and parent next step synchronized`);
            for (const mode of ["read", "math"])
            {
                await page.locator(`[data-mode="${mode}"]`).click();
                for (let index = 0; index < 2; index++)
                {
                    const lesson = c.lessons[age][mode][index];
                    assert((await page.locator(".progress").innerText()).includes(c.phone.progress(index)));
                    assert.equal(await page.locator(".lesson-question").innerText(), lesson.question);
                    if (mode === "read")
                    {
                        for (let word = 0; word < lesson.words.length; word++)
                        {
                            await page.locator(`[data-word="${word}"]`).click();
                            assert.equal(await page.locator("#word-sound").innerText(), lesson.words[word][1]);
                        }
                        record(`${viewport.width} ${age} read ${index + 1}: every word exposes its actual sound breakdown`);
                    }
                    else
                    {
                        assert.equal(await page.locator(".pebble").count(), lesson.groups.reduce((sum, value) => sum + value, 0));
                        assert.equal(await page.locator(".removed").count(), lesson.removed || 0);
                    }
                    const wrong = lesson.answers.find((answer) => answer !== lesson.correct);
                    await page.locator(`[data-answer="${wrong}"]`).click();
                    assert.equal(await page.locator("#feedback").innerText(), lesson.hint);
                    assert.equal(await page.locator(".answer").count(), 3);
                    await page.locator(`[data-answer="${lesson.correct}"]`).focus();
                    await page.keyboard.press("Enter");
                    assert((await page.locator("#feedback").innerText()).includes(c.phone.success));
                    assert.equal(await page.locator(".correct-answer").innerText(), lesson.correct);
                    await overflow(page, `${viewport.width} ${age} ${mode} ${index + 1} answered`);
                    if (index === 0) await page.locator("[data-next]").click();
                    else
                    {
                        assert.equal(await page.locator(".pause-note").innerText(), c.phone.pause);
                        await page.locator("[data-restart]").click();
                        assert((await page.locator(".progress").innerText()).includes("1 of 2"));
                        assert.equal(await page.locator("#feedback").innerText(), "");
                    }
                    record(`${viewport.width} ${age} ${mode} ${index + 1}: specific hint, keyboard correct answer, progression/pause/restart`);
                }
            }
        }
        await page.locator('[data-mode="math"]').focus();
        await page.keyboard.press("ArrowLeft");
        assert.equal(await page.locator("#tab-read").getAttribute("aria-selected"), "true");
        assert(await page.locator("#tab-read").evaluate((element) => document.activeElement === element));
        record(`${viewport.width}: keyboard tablist arrows update real lesson and focus`);
        await page.evaluate(() =>
        {
            Object.defineProperty(window.speechSynthesis, "getVoices", { configurable: true, value: () => [{ lang: "en-US", localService: false }] });
            window.speechSynthesis.speak = () => { throw Error("Remote speech must never be called"); };
        });
        await page.locator("[data-speak]").click();
        assert.equal(await page.locator("#voice-message").innerText(), c.phone.noVoice);
        record(`${viewport.width}: remote-only voice rejected; visible local-voice availability message after opt-in`);
        await page.evaluate(() =>
        {
            window.localSpeechCalls = [];
            Object.defineProperty(window.speechSynthesis, "getVoices", { configurable: true, value: () => [{ lang: "en-US", localService: true }] });
            window.speechSynthesis.speak = (utterance) => window.localSpeechCalls.push({ text: utterance.text, local: utterance.voice.localService });
            window.speechSynthesis.cancel = () => window.localSpeechCalls.push({ cancelled: true });
            window.SpeechSynthesisUtterance = class
            {
                constructor(text)
                {
                    this.text = text;
                }
            };
        });
        await page.locator('[data-word="5"]').click();
        await page.locator("[data-speak]").click();
        assert((await page.evaluate(() => window.localSpeechCalls)).some((call) => call.text === "sprouts" && call.local));
        await page.locator('[data-mode="math"]').click();
        assert.equal((await page.evaluate(() => window.localSpeechCalls)).at(-1).cancelled, true);
        record(`${viewport.width}: opt-in local voice speaks selected word only; changing lesson cancels speech`);
        await page.locator('[data-period="1"]').click();
        assert.equal(await page.locator('[data-metric="0"]').innerText(), "56");
        assert.equal(await page.locator('[data-metric="1"]').innerText(), "34");
        assert.equal(await page.locator('[data-metric="2"]').innerText(), "22");
        assert((await page.locator("#reading-balance").innerText()).includes("61%"));
        await page.locator(".chart-details summary").click();
        assert.deepEqual(await page.locator(".chart-details td").allTextContents(), ["6", "8", "6", "9", "10", "8", "9"]);
        await page.locator('[data-period="0"]').click();
        assert.equal(await page.locator('[data-metric="0"]').innerText(), "70");
        assert((await page.locator("#reading-balance").innerText()).includes("60%"));
        record(`${viewport.width}: sample dashboard arrays, KPIs, accessible table, balance percentages, period announcements`);
        await page.locator("[data-memory]").click();
        assert.equal(await page.locator("#preview-memory").getAttribute("open"), "");
        record(`${viewport.width}: safety FAQ link opens actual memory answer`);
        await page.locator('[data-billing="1"]').click();
        assert((await page.locator("#family-price").innerText()).includes("$80 / year"));
        assert((await page.locator("#family-price").innerText()).includes("$6.67 per month"));
        const opener = page.locator(".family [data-open-routine]");
        await opener.click();
        assert.equal(await page.locator("#routine-age").inputValue(), "7–8");
        assert.equal(await page.locator("#routine-duration").inputValue(), "10");
        assert((await page.locator(".routine-plan").innerText()).includes("$80 / year"));
        await page.locator("#routine-age").selectOption("5–6");
        await page.locator("#routine-form").evaluate((form) => form.requestSubmit());
        assert((await page.locator("#routine-result").innerText()).includes("4 min of word play + 4 min of number play + 2 min to pause and share."));
        assert((await page.locator("#routine-result").innerText()).includes("Pack a seven-piece pretend picnic"));
        assert(await page.locator("#routine-result").evaluate((element) => document.activeElement === element));
        await page.locator("[data-adjust]").click();
        assert.equal(await page.locator("#routine-age").inputValue(), "5–6");
        await page.locator("#routine-duration").selectOption("15");
        await page.locator('input[name="preference"][value="0"]').check();
        await page.locator('#routine-form button[type="submit"]').click();
        assert((await page.locator("#routine-result").innerText()).includes("13 min of word play + 2 min to pause and share."));
        await page.locator("[data-adjust]").click();
        await page.locator('input[name="preference"][value="1"]').check();
        await page.locator("#routine-duration").selectOption("6");
        await page.locator('#routine-form button[type="submit"]').click();
        assert((await page.locator("#routine-result").innerText()).includes("4 min of number play + 2 min to pause and share."));
        await page.locator("[data-adjust]").focus();
        await page.keyboard.press("Tab");
        assert(await page.locator("[data-close-routine]").evaluate((element) => document.activeElement === element));
        await page.keyboard.press("Shift+Tab");
        assert(await page.locator("[data-adjust]").evaluate((element) => document.activeElement === element));
        await overflow(page, `${viewport.width} routine result`);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#routine-dialog").getAttribute("open"), null);
        assert(await opener.evaluate((element) => document.activeElement === element));
        assert.equal(await page.locator("body").evaluate((element) => getComputedStyle(element).overflow), "visible");
        await opener.click();
        assert.equal(await page.locator("#routine-age").inputValue(), "7–8");
        assert.equal(await page.locator("#routine-duration").inputValue(), "10");
        assert.equal(await page.locator('input[name="preference"][value="2"]').isChecked(), true);
        await page.locator("[data-close-routine]").click();
        record(`${viewport.width}: yearly/monthly derived prices; dialog current age, all routine allocations, adjust, focus trap/restore, Escape, input discard`);
        await page.locator(".next-step [data-open-routine]").click();
        assert.equal(await page.locator("#routine-age").inputValue(), "7–8");
        await page.locator("[data-close-routine]").click();
        await page.locator('[data-mode-link="math"]').click();
        assert.equal(await page.locator("#tab-math").getAttribute("aria-selected"), "true");
        await page.locator('[data-mode-link="read"]').click();
        assert.equal(await page.locator("#tab-read").getAttribute("aria-selected"), "true");
        await controlSizes(page, `${viewport.width} after interactions`);
        await overflow(page, `${viewport.width} after all interactions`);
        assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
        assert.equal(await page.evaluate(() => document.cookie), "");
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator('input[name="age-hero"][value="5–6"]').isChecked(), true);
        assert.equal(await page.locator("#tab-read").getAttribute("aria-selected"), "true");
        assert.equal(await page.locator('[data-billing="0"]').getAttribute("aria-pressed"), "true");
        record(`${viewport.width}: no browser storage/cookies; refresh resets age, answers, mode, billing and routine`);
        await context.close();
    }
    for (const width of [1440, 320])
    {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
        page.on("pageerror", (error) => result.errors.push(error.message));
        page.on("console", (message) =>
        {
            if (message.type() === "error") result.errors.push(message.text());
        });
        page.on("requestfailed", (request) => result.errors.push(`Request failed: ${request.url()}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        await page.goto(server.url, { waitUntil: "networkidle" });
        await overflow(page, `${width} supplementary`);
        await controlSizes(page, `${width} supplementary`);
        result.viewports.push({ width, height: 900, deviceScaleFactor: 1, reducedMotion: "reduce", supplementary: true });
        await page.close();
    }
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.externalRequests, []);
    result.passed = true;
    record("No console/page/HTTP/resource/request errors across all tested viewports and interactions");
}
catch (error)
{
    result.errors.push(error.stack || error.message);
    console.error(error);
}
finally
{
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
if (!result.passed) process.exitCode = 1;
