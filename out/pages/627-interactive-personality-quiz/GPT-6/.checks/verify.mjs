import assert from "node:assert/strict";
import path from "node:path";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { WorkspaceFiles, StaticHomepage } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await WorkspaceFiles.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const checks = path.join(folder, ".checks");
const assertions = [];
const errors = [];
const viewports = [];
const screenshots = [];
let browser;
let server;
let resourcesClosed = false;
let failure = null;

function record(name, evidence)
{
    assertions.push({ name, passed: true, evidence });
}

async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() =>
    ({
        width: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.width && dimensions.body <= dimensions.width, label + ": " + JSON.stringify(dimensions));
    record("No horizontal overflow: " + label, dimensions);
}

function listen(page, label)
{
    page.on("pageerror", (error) => errors.push({ label, type: "page", message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            errors.push({ label, type: "console", message: message.text() });
        }
    });
    page.on("requestfailed", (request) => errors.push({ label, type: "request", url: request.url(), message: request.failure().errorText }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            errors.push({ label, type: "http", url: response.url(), status: response.status() });
        }
    });
}

async function screenshot(page, name)
{
    await page.screenshot({ path: path.join(checks, name), fullPage: false, animations: "disabled" });
    screenshots.push(path.join(checks, name));
}

async function answer(page, value, number)
{
    await page.locator("#quiz .quiz-topline").filter({ hasText: number + " / 12" }).waitFor();
    await page.locator('#quiz .option[data-value="' + value + '"]').click();
}

try
{
    const scope = { window: {} };
    vm.runInNewContext(await readFile(path.join(folder, "js", "data.js"), "utf8"), scope);
    const data = scope.window.OffscriptData;
    assert.equal(data.dimensions.length, 4);
    assert.equal(data.questions.length, 12);
    assert.equal(data.profiles.length, 16);
    for (const key of ["code", "name", "emoji"])
    {
        assert.equal(new Set(data.profiles.map((profile) => profile[key])).size, 16);
    }
    for (const profile of data.profiles)
    {
        assert.equal(profile.code.length, 4);
        assert.equal(profile.paragraphs.length, 3);
        assert.ok(profile.paragraphs.every((paragraph) => paragraph.length > 100));
        assert.ok(profile.quote.length > 70);
        const answers = data.questions.map((question) => profile.tiers[question.dimension] ? 3 : 0);
        assert.equal(data.calculateResult(answers).profile.code, profile.code);
        const partners = data.findPartners(profile);
        assert.equal(partners.length, 3);
        assert.ok(partners.every((partner) => partner.profile.code !== profile.code));
        assert.equal(new Set(partners.map((partner) => partner.profile.code)).size, 3);
    }
    const low = data.calculateResult(Array(12).fill(0));
    const high = data.calculateResult(Array(12).fill(3));
    assert.equal(low.profile.code, "ASID");
    assert.equal(low.index, 0);
    assert.equal(high.profile.code, "VFTB");
    assert.equal(high.index, 100);
    const mixed = Array(12).fill(0);
    mixed[4] = 3;
    assert.equal(data.calculateResult(mixed).scores[0], 50);
    assert.equal(data.calculateResult(mixed).profile.code[0], "V");
    const weighted = Array(12).fill(0);
    weighted[0] = 3;
    assert.equal(data.calculateResult(weighted).scores[0], 25);
    assert.throws(() => data.calculateResult([0]), /twelve/);
    assert.throws(() => data.calculateResult(Array(12).fill(4)), /invalid/);
    assert.throws(() => data.calculateResult(Array(12).fill(null)), /invalid/);
    const shuffled = data.shuffledOptions(data.questions[0]);
    assert.equal(new Set(shuffled.map((option) => option.value)).size, 4);
    assert.ok(shuffled.every((option) => option.text === data.questions[0].options[option.value]));
    record("Deterministic scoring and complete data", "All 16 reachable profiles; unique names/codes/object emoji; 3 paragraphs each; weighted midpoint and boundary tests; invalid inputs rejected; shuffled values preserved.");
    record("Complement ranking", "Top three are distinct and never self; all 16 profiles checked.");
    const browserSource = await readFile(path.join(folder, "js", "app.js"), "utf8") + await readFile(path.join(folder, "js", "data.js"), "utf8");
    assert.ok(!browserSource.includes("?.") && !browserSource.includes("??") && !/\bawait\b/.test(browserSource));
    record("Browser syntax baseline", "No optional chaining, nullish coalescing, or await in browser scripts.");
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "interactive-personality-quiz", "GPT-6");
    record("Independent final-subpath static validation", digest);
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    const origin = new URL(server.url).origin;
    assert.equal((await fetch(origin + "/")).status, 404);
    assert.equal((await fetch(origin + "/deploy/config.json")).status, 404);
    record("Preview server isolation and readiness", "Actual export responds 200; server root and repository config respond 404.");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, permissions: ["clipboard-read", "clipboard-write"] });
    const page = await desktop.newPage();
    listen(page, "desktop");
    await page.goto(server.url, { waitUntil: "networkidle" });
    await page.locator("#entry h1").waitFor();
    assert.ok((await page.locator("body").innerText()).length > 400);
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    const loadedRequests = await page.evaluate(() => performance.getEntriesByType("resource").map((entry) => entry.name));
    assert.ok(loadedRequests.every((url) => new URL(url).origin === origin));
    await noOverflow(page, "desktop home 1200");
    await screenshot(page, "desktop.png");
    viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1 });
    record("Visible homepage and local resources", { textLength: (await page.locator("body").innerText()).length, allResourcesLocal: true });
    await page.locator("#theme-toggle").focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.locator("#theme-toggle").click();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "light");
    record("Theme", "Keyboard toggle, local preference survives reload, light restored.");
    await page.locator("#about-open").focus();
    await page.keyboard.press("Enter");
    await page.locator("#about-overlay").waitFor({ state: "visible" });
    assert.ok((await page.locator("#about-overlay").innerText()).includes("not an established personality scale"));
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => document.activeElement.id), "about-close");
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.id), "about-close");
    await page.keyboard.press("Escape");
    assert.equal(await page.evaluate(() => document.activeElement.id), "about-open");
    record("Accessible about dialog", "Method, references and disclaimer visible; Tab/Shift+Tab trapped; Escape closes and restores trigger focus.");
    await page.locator("#start").focus();
    await page.keyboard.press("Enter");
    await page.locator('#quiz .option[data-value="3"]').focus();
    await page.keyboard.press("Space");
    await page.locator("#quiz .quiz-topline").filter({ hasText: "2 / 12" }).waitFor();
    await page.locator("#back").click();
    assert.equal(await page.locator("#quiz .option.selected").getAttribute("data-value"), "3");
    await page.locator('#quiz .option[data-value="0"]').focus();
    await page.keyboard.press("Enter");
    for (let question = 2; question <= 12; question++)
    {
        await answer(page, 0, question);
        if (question === 6)
        {
            await noOverflow(page, "desktop mid-quiz");
        }
    }
    await page.locator("#processing").waitFor({ state: "visible" });
    const processingAt = Date.now();
    await page.locator("#result").waitFor({ state: "visible" });
    assert.ok(Date.now() - processingAt >= 1450);
    assert.equal(await page.locator(".result-code").innerText(), "ASID");
    assert.equal(await page.locator(".result-stat strong").innerText(), "0%");
    assert.equal(await page.locator(".dimension-row").count(), 4);
    assert.equal(await page.locator(".partner").count(), 3);
    assert.equal(await page.locator(".interpretation p").count(), 3);
    assert.equal(await page.locator(".result .radar").count(), 1);
    await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === "rgb(13, 13, 13)");
    assert.equal(await page.locator("#theme-toggle").isVisible(), false);
    await noOverflow(page, "desktop results");
    await screenshot(page, "desktop-result.png");
    record("Desktop real quiz flow and keyboard", "12 actual answers; Space/Enter; previous-answer edit changes outcome; visible processing >=1.45s; ASID 0%; radar, four dimensions, three interpretation paragraphs and three counterparts; forced-dark result.");
    await page.locator("#copy-result").click();
    await page.locator("#share-status").filter({ hasText: "Copied." }).waitFor();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    assert.ok(clipboard.includes("Compass & Cloud") && clipboard.includes("ASID") && clipboard.includes(server.url));
    assert.ok(clipboard.includes("not validated compatibility"));
    const downloadPromise = page.waitForEvent("download");
    await page.locator("#save-result").click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "offscript-asid.txt");
    await download.saveAs(path.join(checks, download.suggestedFilename()));
    const saved = await readFile(path.join(checks, download.suggestedFilename()), "utf8");
    assert.ok(saved.replace(/\r\n/g, "\n").includes(clipboard.replace(/\r\n/g, "\n")) && saved.includes("Your reflection") && saved.includes("not a rule about who you are"));
    record("Real clipboard and local save", { clipboardIncludesResultAndUrl: true, file: download.suggestedFilename(), bytes: Buffer.byteLength(saved) });
    await page.locator("#result-method").click();
    await page.locator("#about-overlay").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    await page.locator("#restart").click();
    await page.locator("#entry").waitFor({ state: "visible" });
    await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === "rgb(245, 245, 245)");
    await page.locator("#start").click();
    assert.equal(await page.locator("#quiz .option.selected").count(), 0);
    await noOverflow(page, "desktop after restart");
    record("Restart isolation", "Fresh entry restores selected light theme; new quiz has no previous selected answer.");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const phone = await mobile.newPage();
    listen(phone, "mobile");
    await phone.goto(server.url, { waitUntil: "networkidle" });
    await noOverflow(phone, "mobile home 390");
    await screenshot(phone, "mobile.png");
    viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, touch: true, reducedMotion: true });
    const reducedAnimation = await phone.locator(".sphere-two").evaluate((element) => getComputedStyle(element).animationName);
    assert.equal(reducedAnimation, "none");
    await phone.locator("#start").tap();
    for (let question = 1; question <= 12; question++)
    {
        await answer(phone, 3, question);
        if (question === 5)
        {
            await noOverflow(phone, "mobile mid-quiz");
        }
    }
    await phone.locator("#result").waitFor({ state: "visible" });
    assert.equal(await phone.locator(".result-code").innerText(), "VFTB");
    assert.equal(await phone.locator(".result-stat strong").innerText(), "100%");
    await noOverflow(phone, "mobile results");
    await screenshot(phone, "mobile-result.png");
    await phone.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined }));
    await phone.locator("#copy-result").tap();
    await phone.locator("#copy-overlay").waitFor({ state: "visible" });
    assert.ok((await phone.locator("#share-fallback").inputValue()).includes("Lighthouse & Sparrow"));
    await phone.locator("#copy-close").tap();
    assert.equal(await phone.locator("#copy-overlay").isVisible(), false);
    await phone.locator("#restart").tap();
    await phone.locator("#entry").waitFor({ state: "visible" });
    await noOverflow(phone, "mobile after restart");
    record("Mobile actual quiz and share fallback", "390×844 touch context; all 12 high-pole answers yield VFTB 100%; reduced motion disables orbit; clipboard-denied fallback has correct selectable result; restart works.");
    for (const width of [375, 414, 1024, 1440])
    {
        await phone.setViewportSize({ width, height: 900 });
        await noOverflow(phone, "home width " + width);
        const box = await phone.locator(".page-shell").boundingBox();
        assert.ok(box.width <= (width <= 480 ? 480 : 640));
        assert.ok(Math.abs((box.x + box.width / 2) - width / 2) < 1);
        await phone.locator("#start").click();
        await noOverflow(phone, "quiz width " + width);
        await phone.reload({ waitUntil: "networkidle" });
        viewports.push({ width, height: 900, centered: true });
    }
    record("Responsive boundaries", "375, 390, 414, 1024, 1200 and 1440 widths; centered shell; no horizontal overflow on home, quiz, results, or restart.");
    await phone.setViewportSize({ width: 375, height: 844 });
    await phone.locator("#start").click();
    for (let question = 1; question <= 12; question++)
    {
        await answer(phone, question % 2, question);
    }
    await phone.locator("#result").waitFor({ state: "visible" });
    await noOverflow(phone, "375 full result");
    await phone.locator("#restart").scrollIntoViewIfNeeded();
    assert.ok(await phone.locator("#restart").isVisible());
    assert.ok((await phone.locator(".result").innerText()).includes("Your answers are not uploaded or saved."));
    record("375px full result accessibility", "Entire result is scrollable; restart and disclosure visible; no clipping/overflow.");
    await mobile.close();

    const wechat = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 MicroMessenger/8.0.45" });
    const embedded = await wechat.newPage();
    listen(embedded, "wechat-user-agent-emulation");
    await embedded.goto(server.url, { waitUntil: "networkidle" });
    await embedded.locator("#start").click();
    await answer(embedded, 1, 1);
    await embedded.locator("#quiz .quiz-topline").filter({ hasText: "2 / 12" }).waitFor();
    await noOverflow(embedded, "WeChat UA emulation");
    record("Limited WeChat user-agent emulation", "Chromium with MicroMessenger UA: home and answer transition pass. Not real WeChat-engine or hardware certification.");
    await wechat.close();
    assert.deepEqual(errors, []);
    record("Browser error audit", "Zero console errors, page exceptions, HTTP >=400 resources, or failed requests across all actual browser checks.");
}
catch (error)
{
    failure = { message: error.message, stack: error.stack };
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
    resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
    {
        prompt: job.prompt,
        modelId: job.modelId,
        timestamp: new Date().toISOString(),
        passed: !failure && errors.length === 0,
        assertions,
        viewports,
        screenshots,
        errors,
        failure,
        visualReviewed: false,
        visualReview: "Awaiting actual opening of desktop and mobile PNGs.",
        resourcesClosed,
        limitations: ["Real WeChat engine/hardware untested; only user-agent emulation.", "No throttled 3G timing assertion.", "Entertainment questionnaire: no psychometric validation.", "No deployment, KV, API, global statistics, or production backend."]
    });
    console.log(JSON.stringify({ passed: !failure && errors.length === 0, assertions: assertions.length, errors, failure, resourcesClosed, screenshots }, null, 2));
}
