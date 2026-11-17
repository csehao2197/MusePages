import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "..", "..", "..", "..");
const checks = path.join(folder, ".checks");
const result = {
    prompt: "578-ar-learning-lab-platform",
    modelId: "gpt-6.1-sol",
    publicModel: "GPT-6",
    startedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: {},
    resourcesClosed: false
};
let browser;
let service;

function record(name)
{
    result.assertions.push(name);
}

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() =>
    {
        const dialog = document.querySelector("dialog[open]");
        return {
            width: innerWidth,
            document: document.documentElement.scrollWidth,
            body: document.body.scrollWidth,
            dialog: dialog ? [dialog.scrollWidth, dialog.clientWidth] : null
        };
    });
    assert(sizes.document <= sizes.width + 1 && sizes.body <= sizes.width + 1, JSON.stringify(sizes));
    if (sizes.dialog) assert(sizes.dialog[0] <= sizes.dialog[1] + 1, JSON.stringify(sizes));
    record(`${label}: no horizontal overflow`);
}

async function closeDialog(page)
{
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector("dialog").open);
}

try
{
    result.staticDigest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "ar-learning-lab-platform", "GPT-6");
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    assert(service.url.includes("/pages/ar-learning-lab-platform/GPT-6/index.html"));
    browser = await chromium.launch({ headless: true });
    for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: name === "mobile", hasTouch: name === "mobile" });
        const page = await context.newPage();
        const activate = (locator) => name === "mobile" ? locator.tap() : locator.click();
        const errors = [];
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
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator("h1").innerText(), "Hey, explorer. What if…");
        assert.equal(await page.locator(".lesson-card").count(), 6);
        assert((await page.locator("main").innerText()).length > 1500);
        assert(await page.locator("#hero-space").evaluate((canvas) => canvas.width > 200 && canvas.height > 100));
        await noOverflow(page, `${name} initial`);
        await page.screenshot({ path: path.join(checks, `${name}.png`), fullPage: false, animations: "disabled" });
        result.screenshots[name] = path.join(checks, `${name}.png`);
        result.viewports.push({ name, ...viewport, deviceScaleFactor: 1, homepageStatus: response.status() });
        record(`${name}: visible meaningful homepage, six lessons, real rendered canvas and screenshot`);

        await page.locator('[data-subject="Science"]').click();
        assert.equal(await page.locator(".lesson-card").count(), 2);
        await page.locator("#grade").selectOption("6–8");
        await page.locator("#search").fill("swing");
        assert.equal(await page.locator(".lesson-card").count(), 1);
        assert.match(await page.locator(".lesson-card h3").innerText(), /swing/);
        await page.locator("#search").fill("not-a-lesson");
        assert(await page.locator("#empty").isVisible());
        await page.locator("#search").fill("");
        await page.locator("#grade").selectOption("All");
        await page.locator('[data-subject="All"]').click();
        assert.equal(await page.locator(".lesson-card").count(), 6);
        record(`${name}: combined subject/grade/title filters, empty state and reset`);

        const solarTrigger = page.locator('.hero [data-open="solar"]');
        await solarTrigger.focus();
        await page.keyboard.press("Enter");
        await page.locator("#solar-canvas").waitFor();
        await activate(page.locator('[data-planet="Mars"]'));
        assert.match(await page.locator("#planet-fact").innerText(), /687/);
        assert.equal(await page.locator('[data-planet="Mars"]').getAttribute("aria-pressed"), "true");
        await page.locator("#tilt").focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#tilt").inputValue(), "44");
        await page.locator("#pause-solar").click();
        assert.equal(await page.locator("#pause-solar").innerText(), "Play orbits");
        const before = await page.locator("#solar-canvas").evaluate((canvas) => canvas.toDataURL());
        await page.locator("#tilt").fill("85");
        await page.waitForTimeout(100);
        assert.notEqual(await page.locator("#solar-canvas").evaluate((canvas) => canvas.toDataURL()), before);
        await page.locator('[data-answer="Earth"]').click();
        assert.match(await page.locator("#solar-feedback").innerText(), /another look/);
        await page.locator('[data-answer="Mars"]').click();
        assert.equal(await page.locator("#xp").innerText(), "40 XP");
        await page.locator('[data-answer="Mars"]').click();
        assert.equal(await page.locator("#xp").innerText(), "40 XP");
        await noOverflow(page, `${name} solar controls`);
        await closeDialog(page);
        assert(await solarTrigger.evaluate((button) => button === document.activeElement));
        record(`${name}: keyboard dialog/focus return; planet selection, live 3D angle, pause, wrong/correct challenge and no duplicate XP`);

        await activate(page.locator('.scan-button'));
        assert.match(await page.locator("#dialog-content").innerText(), /no camera access/i);
        await activate(page.locator("#scan-sample"));
        assert.match(await page.locator("#scan-result").innerText(), /Lesson unlocked/);
        await activate(page.locator("#open-unlocked"));
        assert.match(await page.locator("#dialog-title").innerText(), /connections/);
        await page.locator('[data-reading-answer="Three"]').click();
        assert.equal(await page.locator("#xp").innerText(), "60 XP");
        await noOverflow(page, `${name} unlocked molecular lesson`);
        await closeDialog(page);
        record(`${name}: sample scan unlock and actual molecular lesson challenge`);

        await page.locator('#labs [data-open="pendulum"]').click();
        await page.locator('[data-lab-answer="moon"]').click();
        assert.match(await page.locator("#lab-feedback").innerText(), /First record/);
        assert.equal(await page.locator("#period").innerText(), "2.01 s");
        await page.locator("#run-lab").click();
        await page.locator("#record:not([disabled])").waitFor({ timeout: 5000 });
        await page.locator("#record").click();
        assert.match(await page.locator("#observations").innerText(), /Earth · 1.0 m · 2.01 s/);
        await page.locator("#gravity").selectOption("1.62");
        assert.equal(await page.locator("#period").innerText(), "4.94 s");
        await page.locator("#run-lab").click();
        await page.locator("#record:not([disabled])").waitFor({ timeout: 8500 });
        await page.locator("#record").click();
        assert.match(await page.locator("#observations").innerText(), /Moon · 1.0 m · 4.94 s/);
        await page.locator('[data-lab-answer="earth"]').click();
        assert.match(await page.locator("#lab-feedback").innerText(), /Compare/);
        await page.locator('[data-lab-answer="moon"]').click();
        assert.equal(await page.locator("#xp").innerText(), "120 XP");
        assert.equal(await page.locator("#badge").getAttribute("hidden"), null);
        await page.locator("#length").fill("200");
        assert.equal(await page.locator("#length-value").innerText(), "2.0 m");
        assert.equal(await page.locator("#period").innerText(), "6.98 s");
        assert.equal(await page.locator("#run-lab").innerText(), "Run experiment");
        await noOverflow(page, `${name} lab after experiment`);
        const closeControl = await page.locator("#close-dialog").boundingBox();
        assert(closeControl.y >= 0 && closeControl.y + closeControl.height <= viewport.height);
        await page.screenshot({ path: path.join(checks, `${name}-lab.png`), fullPage: false, animations: "disabled" });
        result.screenshots[`${name}Lab`] = path.join(checks, `${name}-lab.png`);
        await closeDialog(page);
        assert.equal(await page.locator("#badge").getAttribute("hidden"), null);
        record(`${name}: live ideal-pendulum motion, complete-cycle records, physical periods, fair-comparison gate, length reset, quest and badge`);

        await page.locator('[data-open="explorer"]').click();
        await page.locator('[data-landmark="khufu"]').click();
        assert.match(await page.locator("#landmark-fact").innerText(), /146.6/);
        await page.locator('[data-landmark="sphinx"]').focus();
        await page.keyboard.press("Enter");
        assert.match(await page.locator("#landmark-fact").innerText(), /limestone/);
        await noOverflow(page, `${name} explorer`);
        await closeDialog(page);
        record(`${name}: landmark overlays by pointer/touch and keyboard`);

        for (const id of ["plant", "earth", "water"])
        {
            await page.locator(`[data-lesson="${id}"]`).click();
            await page.locator(".answer").first().click();
            assert((await page.locator("#reading-feedback").innerText()).length > 10);
            await closeDialog(page);
        }
        await page.reload({ waitUntil: "networkidle" });
        assert((await page.locator("#xp").innerText()).includes("XP"));
        assert(await page.locator("#xp").innerText() !== "0 XP");
        assert.equal(await page.locator("#streak").innerText(), "1");
        await noOverflow(page, `${name} after interactions/reload`);
        await page.screenshot({ path: path.join(checks, `${name}-full.png`), fullPage: true, animations: "disabled" });
        result.screenshots[`${name}Full`] = path.join(checks, `${name}-full.png`);
        await page.locator('[data-open="about"]').click();
        assert.match(await page.locator("#dialog-content").innerText(), /not implemented/);
        const licenseUrl = new URL(await page.locator('#dialog-content a').getAttribute("href"), service.url).href;
        assert.equal((await context.request.get(licenseUrl)).status(), 200);
        await closeDialog(page);
        await page.locator(".profile").click();
        await page.locator("#clear-progress").click();
        await closeDialog(page);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#xp").innerText(), "0 XP");
        record(`${name}: guided lessons, persistent actual progress/streak, license HTTP, honest limitations, local progress deletion`);
        assert.deepEqual(errors, []);
        result.errors.push(...errors);
        await context.close();
    }

    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const page = await reduced.newPage();
    await page.goto(service.url, { waitUntil: "networkidle" });
    const staticHero = await page.locator("#hero-space").evaluate((canvas) => canvas.toDataURL());
    await page.waitForTimeout(150);
    assert.equal(await page.locator("#hero-space").evaluate((canvas) => canvas.toDataURL()), staticHero);
    await page.locator('.hero [data-open="solar"]').click();
    assert.equal(await page.locator("#pause-solar").innerText(), "Play orbits");
    await noOverflow(page, "reduced-motion mobile");
    await reduced.close();
    record("Reduced-motion: hero stationary, interactive orbits start paused, mobile layout valid");
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    result.resourcesClosed = true;
    result.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
