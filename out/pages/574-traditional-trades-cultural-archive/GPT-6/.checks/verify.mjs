import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const job = JSON.parse(await fs.readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
assert.equal(job.prompt, "574-traditional-trades-cultural-archive");
const folder = job.output;
const checks = path.join(folder, ".checks");
const exported = path.join(folder, "out");
const errors = [];
const tests = [];
const report = { prompt: job.prompt, modelId: job.modelId, startedAt: new Date().toISOString(), passed: false, visualReviewed: false, viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }], tests, errors, resourcesClosed: false };
let service;
let browser;
async function check(name, run)
{
    await run();
    tests.push({ name, passed: true });
}
async function noOverflow(page)
{
    const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
    assert.ok(sizes.scroll <= sizes.viewport, JSON.stringify(sizes));
}
function monitor(page)
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
        if (response.status() >= 400)
        {
            errors.push(`HTTP ${response.status()}: ${response.url()}`);
        }
    });
}
try
{
    report.sourceType = await StaticHomepage.checkSource(folder);
    report.staticDigest = await StaticHomepage.validateStaticOutput(exported, "traditional-trades-cultural-archive", "GPT-6");
    tests.push({ name: "Repository source and final-subpath independent static checks", passed: true });
    service = await startPreviewServer(exported, { workspace: root });
    report.publicPath = new URL(service.url).pathname;
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    monitor(page);
    await check("Desktop HTTP 200, meaningful English-only homepage and all original SVG assets", async () =>
    {
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator("h1").innerText(), "Vanishing\nTrades.");
        assert.equal(await page.locator(".trade-card").count(), 12);
        assert.ok((await page.locator("body").innerText()).length > 3000);
        assert.equal(await page.evaluate(() => /[\u3400-\u9fff]/u.test(document.body.innerText)), false);
        const images = await page.locator("img").evaluateAll((items) => items.map((image) => ({ src: image.getAttribute("src"), loaded: image.complete && image.naturalWidth > 0 })));
        for (const image of images)
        {
            assert.equal((await context.request.get(new URL(image.src, service.url).href)).status(), 200, image.src);
        }
        await noOverflow(page);
        await page.screenshot({ path: path.join(checks, "desktop.png") });
    });
    await check("Craft category filters, city search and empty-state recovery", async () =>
    {
        await page.locator('[data-filter="Making"]').click();
        assert.equal(await page.locator(".trade-card").count(), 4);
        await page.locator('[data-filter="Repair"]').click();
        assert.equal(await page.locator(".trade-card").count(), 6);
        await page.locator('[data-filter="Performance"]').click();
        assert.equal(await page.locator(".trade-card").count(), 2);
        await page.locator('[data-filter="All"]').click();
        await page.locator("#search").fill("Suzhou");
        assert.equal(await page.locator(".trade-card").count(), 1);
        assert.match(await page.locator(".trade-card").innerText(), /Seal engraver/);
        await page.locator("#search").fill("not-a-real-trade");
        assert.equal(await page.locator("#empty").isVisible(), true);
        await page.locator("#search").fill("");
        assert.equal(await page.locator(".trade-card").count(), 12);
        await noOverflow(page);
        await page.locator("#archive").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(checks, "archive.png") });
    });
    await check("All twelve unique trade profiles, explicit fiction, proper focus trap and Escape return", async () =>
    {
        const titles = [];
        for (let index = 0; index < 12; index++)
        {
            const card = page.locator(".trade-card").nth(index);
            await card.focus();
            await page.keyboard.press("Enter");
            assert.equal(await page.locator("#trade-dialog").isVisible(), true);
            titles.push(await page.locator("#detail-title").innerText());
            const words = (await page.locator("#detail-story").innerText()).split(/\s+/).length;
            assert.ok(words >= 200 && words <= 300, `Story ${index + 1}: ${words} words`);
            assert.equal(await page.locator(".fiction-label").innerText(), "AN IMAGINED WORKSHOP VIGNETTE");
            assert.equal(await page.locator("#detail-image").evaluate((image) => image.complete && image.naturalWidth > 0), true);
            if (index === 0)
            {
                await page.keyboard.press("Shift+Tab");
                assert.equal(await page.evaluate(() => document.querySelector("#trade-dialog").contains(document.activeElement)), true);
                await page.screenshot({ path: path.join(checks, "story.png") });
            }
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("#trade-dialog").isVisible(), false);
            assert.equal(await card.evaluate((element) => element === document.activeElement), true);
        }
        assert.equal(new Set(titles).size, 12);
        await noOverflow(page);
    });
    await check("Twelve trade-specific Web Audio node chains, automatic stop and opt-in hover sound", async () =>
    {
        for (let index = 0; index < 12; index++)
        {
            await page.locator(".trade-card").nth(index).click();
            await page.locator("#play-sound").click();
            await page.waitForFunction(() => document.querySelector("#play-sound").getAttribute("aria-busy") === "true");
            assert.match(await page.locator("#sound-status").innerText(), /Playing synthesized/);
            if (index === 0)
            {
                await page.waitForFunction(() => document.querySelector("#sound-status").textContent.startsWith("Sound finished"));
            }
            await page.locator("#close-dialog").click();
        }
        await page.locator("#sound-toggle").click();
        assert.equal(await page.locator("#sound-toggle").getAttribute("aria-pressed"), "true");
        await page.locator(".trade-card").nth(2).hover();
        await page.waitForFunction(() => document.querySelector("#sound-status").textContent.includes("cotton fluffer"));
        await page.locator("#sound-toggle").click();
        assert.equal(await page.locator("#sound-toggle").getAttribute("aria-pressed"), "false");
    });
    await check("All fifteen keyboard-operable atlas stops; featured city filters archive", async () =>
    {
        assert.equal(await page.locator(".city-point").count(), 15);
        for (let index = 0; index < 15; index++)
        {
            const point = page.locator(".city-point").nth(index);
            const name = await point.innerText();
            await point.focus();
            await page.keyboard.press("Enter");
            assert.equal(await page.locator("#city-note h3").innerText(), name);
        }
        await page.getByRole("button", { name: "Beijing: Pen repairer", exact: true }).click();
        await page.locator("#city-link").click();
        assert.equal(await page.locator(".trade-card").count(), 1);
        assert.match(await page.locator(".trade-card").innerText(), /Pen repairer/);
        await page.locator("#search").fill("");
        await noOverflow(page);
    });
    await check("Twelve comparison contexts, wrapping controls and keyboard range changes", async () =>
    {
        const names = new Set();
        for (let index = 0; index < 12; index++)
        {
            names.add(await page.locator("#timeline-name").innerText());
            assert.ok((await page.locator("#old-note").innerText()).length > 35);
            assert.ok((await page.locator("#now-note").innerText()).length > 35);
            await page.locator("#next").click();
        }
        assert.equal(names.size, 12);
        assert.match(await page.locator("#timeline-name").innerText(), /01 \/ Pen repairer/);
        await page.locator("#previous").click();
        assert.match(await page.locator("#timeline-name").innerText(), /12 \/ Sugar painter/);
        await page.locator("#compare-range").focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#compare-range").inputValue(), "51");
        assert.equal(await page.locator("#compare-divider").evaluate((item) => item.style.left), "51%");
        await page.keyboard.press("End");
        assert.equal(await page.locator("#compare-range").inputValue(), "95");
        await noOverflow(page);
    });
    await check("Required and invalid form values blocked; successful local-only submission clears inputs", async () =>
    {
        let sent = 0;
        const countPost = (request) =>
        {
            if (request.method() === "POST")
            {
                sent++;
            }
        };
        page.on("request", countPost);
        assert.equal(await page.locator("#heritage-form").evaluate((form) => form.checkValidity()), false);
        await page.locator("#interest-trade").selectOption("piying");
        await page.locator('[name="name"]').fill("Test Visitor");
        await page.locator('[name="phone"]').fill("invalid");
        assert.equal(await page.locator("#heritage-form").evaluate((form) => form.checkValidity()), false);
        await page.locator('[name="phone"]').fill("+1 555 010 0200");
        await page.locator('#heritage-form [type="submit"]').click();
        assert.match(await page.locator("#form-status").innerText(), /nothing was sent or saved/);
        assert.equal(await page.locator('[name="name"]').inputValue(), "");
        assert.equal(await page.locator('[name="phone"]').inputValue(), "");
        assert.equal(sent, 0);
        assert.equal(await page.evaluate(() => JSON.stringify(localStorage).includes("Test Visitor")), false);
        page.off("request", countPost);
        await noOverflow(page);
    });
    await check("Original field-notes download and local-only visit counter persistence", async () =>
    {
        const promise = page.waitForEvent("download");
        await page.locator(".download").click();
        const download = await promise;
        assert.equal(download.suggestedFilename(), "vanishing-trades-field-notes.svg");
        assert.equal(await download.failure(), null);
        await page.reload({ waitUntil: "networkidle" });
        assert.match(await page.locator("#visits").innerText(), /Visits on this browser: 2/);
        await noOverflow(page);
    });
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    const mobile = await mobileContext.newPage();
    monitor(mobile);
    await check("390px mobile homepage, two-column archive and touch/keyboard core", async () =>
    {
        const response = await mobile.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await noOverflow(mobile);
        await mobile.screenshot({ path: path.join(checks, "mobile.png") });
        await mobile.getByRole("link", { name: "Step into the archive" }).tap();
        assert.equal(await mobile.locator(".trade-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length), 2);
        await mobile.locator("#search").fill("shadow");
        assert.equal(await mobile.locator(".trade-card").count(), 1);
        await mobile.locator(".trade-card").tap();
        assert.equal(await mobile.locator("#detail-title").innerText(), "Shadow puppeteer");
        await noOverflow(mobile);
        await mobile.screenshot({ path: path.join(checks, "mobile-story.png") });
        await mobile.locator("#play-sound").tap();
        await mobile.waitForFunction(() => document.querySelector("#sound-status").textContent.includes("Playing synthesized"));
        await mobile.keyboard.press("Escape");
        assert.equal(await mobile.locator("#trade-dialog").isVisible(), false);
        await mobile.locator("#search").fill("");
        await mobile.getByRole("button", { name: "Beijing: Pen repairer", exact: true }).tap();
        assert.equal(await mobile.locator("#city-note h3").innerText(), "Beijing");
        await mobile.locator("#compare-range").focus();
        await mobile.keyboard.press("ArrowLeft");
        assert.equal(await mobile.locator("#compare-range").inputValue(), "49");
        await mobile.locator("#interest-trade").selectOption("xiuxie");
        await mobile.locator('[name="name"]').fill("Mobile Visitor");
        await mobile.locator('[name="phone"]').fill("1234567890");
        await mobile.locator('#heritage-form [type="submit"]').tap();
        assert.match(await mobile.locator("#form-status").innerText(), /cobbler/);
        await noOverflow(mobile);
    });
    await check("Additional 320px and 768px widths remain within viewport", async () =>
    {
        for (const width of [320, 768])
        {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(service.url, { waitUntil: "networkidle" });
            await noOverflow(page);
            await page.locator("#heritage").scrollIntoViewIfNeeded();
            await noOverflow(page);
        }
    });
    await check("No browser, console, HTTP or resource-request errors across desktop and mobile", async () =>
    {
        assert.deepEqual(errors, []);
    });
    report.passed = true;
    report.screenshots = ["desktop.png", "mobile.png", "archive.png", "story.png", "mobile-story.png"].map((name) => path.join(checks, name));
}
catch (error)
{
    report.failure = error.stack;
    console.error(error);
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
    report.resourcesClosed = true;
    report.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, tests: tests.length, errors, resourcesClosed: report.resourcesClosed }));
}
