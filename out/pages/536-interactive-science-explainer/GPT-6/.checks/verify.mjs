import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const folder = path.join(workspace, "out", "pages", "536-interactive-science-explainer", "GPT-6");
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const evidence = [];
const errors = [];
const resources = [];
let browser;
let server;
let success = false;
let failure = null;

function record(name, detail)
{
    evidence.push({ name, passed: true, detail });
}

async function noOverflow(page, name)
{
    const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1, JSON.stringify(dimensions));
    record(name, dimensions);
}

async function selectPhase(page, degrees)
{
    await page.locator("#phase-slider").evaluate((slider, value) =>
    {
        slider.value = String(value);
        slider.dispatchEvent(new Event("input", { bubbles: true }));
    }, degrees);
}

async function currentPhase(page)
{
    return page.locator("#phase-panel").evaluate((panel) => ({
        phase: Number(panel.dataset.phase),
        amplitude: Number(panel.dataset.amplitude),
        db: Number(panel.dataset.db),
        state: panel.dataset.state
    }));
}

try
{
    const digest = await StaticHomepage.validateStaticOutput(exported, "interactive-science-explainer", "GPT-6");
    record("Independent static validation at final subpath", { digest });
    server = await startPreviewServer(exported, { workspace });
    assert.ok(server.url.endsWith("/pages/interactive-science-explainer/GPT-6/index.html"));
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /<main>/);
    assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
    record("Responsive target-only preview server", { url: server.url, sourceOutsideMount: 404 });
    browser = await chromium.launch({ headless: true });
    for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: name === "mobile", hasTouch: name === "mobile" });
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push({ viewport: name, type: "page", message: error.message }));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push({ viewport: name, type: "console", message: message.text() });
        });
        page.on("requestfailed", (request) => errors.push({ viewport: name, type: "request", url: request.url(), message: request.failure()?.errorText }));
        page.on("response", (response) =>
        {
            resources.push({ viewport: name, url: response.url(), status: response.status() });
            if (response.status() >= 400) errors.push({ viewport: name, type: "http", status: response.status(), url: response.url() });
        });
        const navigation = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(navigation.status(), 200);
        await page.locator("#hero-title").waitFor();
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.locator("main").innerText().then((text) => text.length > 2000));
        assert.equal(await page.locator("main > section").count(), 6);
        assert.equal(await page.locator("img,audio,video").count(), 0);
        await noOverflow(page, `${name}: no initial horizontal overflow`);
        const screenshot = path.join(checks, `${name}.png`);
        await page.screenshot({ path: screenshot, fullPage: false });
        record(`${name}: actual homepage screenshot`, { path: screenshot, viewport, deviceScaleFactor: 1 });

        await page.locator("#chapter-1").scrollIntoViewIfNeeded();
        const pressure = page.locator("#pressure-figure");
        const stepButtons = pressure.locator("button");
        await stepButtons.nth(0).click();
        assert.equal(await pressure.getAttribute("data-step"), "0");
        await page.waitForTimeout(120);
        assert.equal(Number(await pressure.getAttribute("data-particle-offset")), 0);
        await stepButtons.nth(2).focus();
        await page.keyboard.press("Enter");
        assert.equal(await pressure.getAttribute("data-step"), "2");
        await page.waitForTimeout(180);
        const offset = Number(await pressure.getAttribute("data-particle-offset"));
        assert.ok(Math.abs(offset) <= 7);
        assert.match(await page.locator("#pressure-caption").innerText(), /only moves back and forth/);
        if (name === "desktop")
        {
            const third = page.locator("#chapter-1 .step").nth(2);
            await third.evaluate((step) => step.scrollIntoView({ block: "center", behavior: "instant" }));
            await page.waitForTimeout(200);
            assert.equal(await pressure.getAttribute("data-step"), "2");
            const first = page.locator("#chapter-1 .step").nth(0);
            await first.evaluate((step) => step.scrollIntoView({ block: "center", behavior: "instant" }));
            await page.waitForTimeout(200);
            assert.equal(await pressure.getAttribute("data-step"), "0");
        }
        record(`${name}: pressure particles, explicit keyboard steps and scrolly state`, { offset, bound: 7 });
        const physics = await page.evaluate(async () =>
        {
            const { displacementAt, pressureAt } = await import("./assets/figures/pressure.js");
            const { phaseResult, sampleWaves } = await import("./assets/figures/phaseLab.js");
            const x = 0.31;
            const t = 0.77;
            const epsilon = 0.00001;
            const negativeDerivative = -(displacementAt(x + epsilon, t) - displacementAt(x - epsilon, t)) / (2 * epsilon * Math.PI * 4);
            return {
                pressure: pressureAt(x, t),
                negativeDerivative,
                cancellation: [0, 0.5, 1, 2, 3.7, 5.9].map((x) => sampleWaves(x, 180).sum),
                reinforcement: phaseResult(0),
                quarter: phaseResult(90)
            };
        });
        assert.ok(Math.abs(physics.pressure - physics.negativeDerivative) < 1e-8);
        assert.ok(physics.cancellation.every((value) => Math.abs(value) < 1e-12));
        assert.equal(physics.reinforcement.amplitude, 2);
        assert.ok(Math.abs(physics.reinforcement.db - 6.0206) < 0.0001);
        assert.ok(Math.abs(physics.quarter.db - 3.0103) < 0.0001);
        record(`${name}: actual scientific core equations`, physics);

        const slider = page.locator("#phase-slider");
        await slider.scrollIntoViewIfNeeded();
        await slider.focus();
        await page.keyboard.press("Home");
        let result = await currentPhase(page);
        assert.equal(result.phase, 0);
        assert.equal(result.amplitude, 2);
        assert.match(await page.locator("#phase-level").innerText(), /\+6.0 dB/);
        await page.locator("button[data-phase='180']").click();
        result = await currentPhase(page);
        assert.equal(result.amplitude, 0);
        assert.equal(result.state, "silent");
        assert.match(await page.locator("#phase-feedback").innerText(), /flat/);
        assert.equal(await page.locator("#phase-level").innerText(), "−∞ dB");
        await slider.focus();
        await page.keyboard.press("ArrowLeft");
        result = await currentPhase(page);
        assert.equal(result.phase, 179);
        assert.ok(result.amplitude > 0 && result.amplitude < 0.018);
        assert.ok(result.db < -35);
        await page.keyboard.press("End");
        assert.equal((await currentPhase(page)).phase, 360);
        assert.equal((await currentPhase(page)).amplitude, 2);
        record(`${name}: slider keyboard, 0/180/179/360 degree states`, result);

        await selectPhase(page, 90);
        await page.locator("#phase-canvas").scrollIntoViewIfNeeded();
        const canvas = await page.locator("#phase-canvas").boundingBox();
        if (name === "mobile")
        {
            const cdp = await context.newCDPSession(page);
            const start = { x: canvas.x + canvas.width * 0.3, y: canvas.y + canvas.height * 0.3 };
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: start.x + canvas.width / 4, y: start.y }] });
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await cdp.detach();
        }
        else
        {
            await page.mouse.move(canvas.x + canvas.width * 0.3, canvas.y + canvas.height * 0.3);
            await page.mouse.down();
            await page.mouse.move(canvas.x + canvas.width * 0.55, canvas.y + canvas.height * 0.3, { steps: 8 });
            await page.mouse.up();
        }
        result = await currentPhase(page);
        assert.ok(Math.abs(result.phase - 180) <= 1);
        if (name === "mobile")
        {
            await selectPhase(page, 0);
            await slider.scrollIntoViewIfNeeded();
            const bounds = await slider.boundingBox();
            await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
            assert.ok(Math.abs((await currentPhase(page)).phase - 180) <= 2);
        }
        record(`${name}: genuine ${name === "mobile" ? "touch drag and native range tap" : "pointer wave drag"}`, result);
        await selectPhase(page, 180);
        await noOverflow(page, `${name}: no overflow after phase interactions`);
        await page.locator("#phase-panel").screenshot({ path: path.join(checks, `${name}-lab.png`) });

        const earcup = page.locator("#earcup-figure");
        await earcup.scrollIntoViewIfNeeded();
        await earcup.locator("button").nth(0).click();
        assert.equal(await earcup.locator("[data-part][data-active='true']").count(), 1);
        await earcup.locator("button").nth(3).focus();
        await page.keyboard.press("Space");
        assert.equal(await earcup.locator("[data-part][data-active='true']").count(), 4);
        assert.equal(await earcup.locator("[data-current='true']").getAttribute("data-part"), "3");
        if (name === "desktop")
        {
            await page.locator("#chapter-3 .step").nth(1).evaluate((step) => step.scrollIntoView({ block: "center", behavior: "instant" }));
            await page.waitForTimeout(200);
            assert.equal(await earcup.getAttribute("data-step"), "1");
            await earcup.locator("button").nth(3).click();
        }
        await page.waitForTimeout(400);
        await earcup.screenshot({ path: path.join(checks, `${name}-earcup.png`) });
        record(`${name}: cumulative earcup cut-away and keyboard controls`, { revealedParts: 4 });

        const bands = page.locator("#chapter-4");
        await bands.locator(".bands-svg").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector(".bands-svg").dataset.state === "visible");
        await bands.locator("[data-select-band='4']").click();
        assert.match(await page.locator("#band-explanation").innerText(), /4,000 Hz.*Sharp sounds/);
        assert.match(await page.locator("#band-stats").innerText(), /2 dB reduction.*27 dB reduction/);
        assert.equal(await bands.locator("[data-band][data-active='true']").count(), 1);
        assert.equal(await bands.locator(".bands-svg").getAttribute("data-state"), "visible");
        await bands.locator("[data-select-band='0']").focus();
        await page.keyboard.press("Enter");
        assert.match(await page.locator("#band-stats").innerText(), /24 dB reduction.*3 dB reduction/);
        const rects = await bands.locator("[data-band]").evaluateAll((groups) => groups.map((group) => [...group.querySelectorAll("rect")].map((rect) => Number(rect.getAttribute("height")))));
        assert.deepEqual(rects, [[168, 21], [147, 42], [105, 70], [56, 119], [14, 189]]);
        await page.waitForTimeout(900);
        await bands.locator(".bands-panel").screenshot({ path: path.join(checks, `${name}-bands.png`) });
        record(`${name}: frequency-dependent active/passive explanation and chart`, { low: [24, 3], high: [2, 27] });

        await page.locator("input[name='question-0']").nth(0).check();
        assert.equal(await page.locator("#feedback-0").getAttribute("data-state"), "incorrect");
        await page.locator("input[name='question-0']").nth(0).focus();
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#feedback-0").getAttribute("data-state"), "correct");
        const answers = [2, 0, 2, 1];
        for (let q = 1; q < answers.length; q++)
        {
            const radio = page.locator(`input[name='question-${q}']`).nth(answers[q]);
            if (name === "mobile") await radio.locator("..").tap();
            else await radio.check();
            assert.equal(await page.locator(`#feedback-${q}`).getAttribute("data-state"), "correct");
        }
        assert.equal(await page.locator("#quiz").getAttribute("data-score"), "4");
        assert.equal(await page.locator("#quiz").getAttribute("data-answered"), "4");
        assert.match(await page.locator("#quiz-completion").innerText(), /full circle/);
        await page.locator("#quiz-reset").click();
        assert.equal(await page.locator("#quiz").getAttribute("data-score"), "0");
        assert.equal(await page.locator("#quiz input:checked").count(), 0);
        assert.equal(await page.locator(".quiz-feedback[data-state='unanswered']").count(), 4);
        assert.equal(await page.locator("input[name='question-0']").nth(0).evaluate((node) => node === document.activeElement), true);
        record(`${name}: four-question quiz, instant learning feedback, keyboard/touch and reset`, { correctBeforeReset: 4, afterReset: 0 });
        await noOverflow(page, `${name}: no final horizontal overflow`);
        await page.waitForTimeout(150);
        const time = await pressure.getAttribute("data-wave-time");
        await page.waitForTimeout(180);
        assert.equal(await pressure.getAttribute("data-wave-time"), time);
        assert.equal(await page.locator("#pressure-canvas").getAttribute("data-active"), "false");
        record(`${name}: offscreen animation stops`, { waveTime: time });
        await context.close();
    }
    const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const page = await reduced.newPage();
    page.on("pageerror", (error) => errors.push({ viewport: "reduced-motion", type: "page", message: error.message }));
    await page.goto(server.url, { waitUntil: "networkidle" });
    const dimensions = await page.locator("#hero-canvas").evaluate((canvas) => ({ css: canvas.clientWidth, backing: canvas.width }));
    assert.ok(Math.abs(dimensions.backing - dimensions.css * 2) <= 2);
    await page.waitForTimeout(100);
    const before = await page.locator("#hero-canvas").evaluate((canvas) => canvas.toDataURL());
    await page.waitForTimeout(180);
    assert.equal(await page.locator("#hero-canvas").evaluate((canvas) => canvas.toDataURL()), before);
    await page.locator("button[data-phase='180']").click();
    assert.equal((await currentPhase(page)).amplitude, 0);
    await noOverflow(page, "Reduced-motion DPR2: no horizontal overflow");
    record("Reduced-motion static canvas, DPR2 and functional phase lab", dimensions);
    await reduced.close();
    assert.deepEqual(errors, []);
    assert.ok(resources.every((entry) => entry.status === 200 && new URL(entry.url).origin === new URL(server.url).origin));
    record("No HTTP/resource/request/console/page errors or third-party resources", { errors, successfulResponses: resources.length });
    success = true;
}
catch (error)
{
    failure = { message: error.message, stack: error.stack };
    console.error(error);
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"),
    {
        prompt: "536-interactive-science-explainer",
        modelId: "gpt-6.1-sol",
        passed: success,
        timestamp: new Date().toISOString(),
        viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
        assertions: evidence,
        errors,
        failure,
        resourcesClosed: true,
        visualReviewed: false,
        screenshots: ["desktop.png", "mobile.png", "desktop-lab.png", "mobile-lab.png", "desktop-earcup.png", "mobile-earcup.png", "desktop-bands.png", "mobile-bands.png"].map((file) => path.join(checks, file))
    });
}
if (!success) process.exitCode = 1;
else console.log(JSON.stringify({ passed: success, assertions: evidence.length, resourcesClosed: true }));
