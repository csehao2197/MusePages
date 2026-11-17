import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "551-carbon-cycle-scroll-explainer", "GPT-6");
const checks = path.join(folder, ".checks");
const results = [];
const errors = [];
const viewports = [];
let browser;
let server;
let resourcesClosed = false;
let failed = null;

async function check(name, work)
{
    await work();
    results.push({name, passed: true});
}

async function noOverflow(page, name)
{
    await check(name, async () =>
    {
        const size = await page.evaluate(() => ({width: innerWidth, scroll: document.documentElement.scrollWidth}));
        assert.ok(size.scroll <= size.width + 1, JSON.stringify(size));
    });
}

function monitor(page, label)
{
    page.on("pageerror", (error) => errors.push({label, type: "pageerror", message: error.message}));
    page.on("console", (message) =>
    {
        if (message.type() === "error" || message.type() === "warning") errors.push({label, type: "console", message: message.text()});
    });
    page.on("requestfailed", (request) => errors.push({label, type: "requestfailed", url: request.url(), message: request.failure()?.errorText}));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push({label, type: "http", url: response.url(), status: response.status()});
    });
}

async function open(context, label)
{
    const page = await context.newPage();
    monitor(page, label);
    const response = await page.goto(server.url, {waitUntil: "networkidle"});
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
    await check(`${label}: meaningful homepage and local fonts`, async () =>
    {
        assert.match(await page.locator("h1").innerText(), /Where the\s+carbon goes/);
        assert.ok(await page.locator("#scene-svg").isVisible());
        assert.equal(await page.locator(".step-panel").count(), 6);
        assert.ok(await page.evaluate(() => document.fonts.check("800 48px Bricolage") && document.fonts.check("400 18px Atkinson") && document.fonts.check("500 14px JetBrains")));
    });
    await noOverflow(page, `${label}: initial no horizontal overflow`);
    return page;
}

async function scrollToStep(page, number, fraction = .45)
{
    await page.evaluate(({number, fraction}) =>
    {
        const element = document.querySelector(`[data-step="${number}"]`);
        const box = element.getBoundingClientRect();
        scrollTo({top: scrollY + box.top + box.height * fraction - innerHeight * .6, behavior: "instant"});
    }, {number, fraction});
    await page.waitForTimeout(700);
}

async function choose(page, stop, endpoint)
{
    await page.locator(`[data-stop="${stop}"]`).click();
    await page.waitForTimeout(650);
    assert.equal(await page.locator("#warming").getAttribute("data-value"), endpoint.toFixed(3));
    assert.equal(await page.locator("#scenario").inputValue(), String(stop));
    const pathData = await page.locator("#projection").getAttribute("d");
    assert.ok(pathData.endsWith(`760 ${340 - endpoint / 5 * 288}`), pathData.slice(-80));
}

try
{
    await W.ensureDirectory(root, "out", "pages", "551-carbon-cycle-scroll-explainer", "GPT-6", ".checks");
    server = await startPreviewServer(path.join(folder, "out"), {workspace: root});
    assert.equal((await fetch(server.url)).status, 200);
    assert.ok(server.url.endsWith("/pages/carbon-cycle-scroll-explainer/GPT-6/index.html"));
    assert.equal((await fetch(new URL("/index.html", server.url))).status, 404);
    results.push({name: "Preview responsive at final subpath and does not serve repository root", passed: true});
    browser = await chromium.launch({headless: true});
    const desktop = await browser.newContext({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    viewports.push({name: "desktop", width: 1200, height: 900, deviceScaleFactor: 1});
    const page = await open(desktop, "desktop");
    await page.screenshot({path: path.join(checks, "desktop.png")});
    await check("Desktop: code-drawn scene, paths and moving particles", async () =>
    {
        assert.equal(await page.locator(".flow-guides path").count(), 5);
        const point = await page.locator("#particles circle").first().getAttribute("cx");
        await page.waitForTimeout(180);
        assert.notEqual(await page.locator("#particles circle").first().getAttribute("cx"), point);
        assert.equal(await page.locator("#path-photosynthesis").getAttribute("data-count"), "40");
        assert.equal(await page.locator("#path-ocean-in").getAttribute("data-count"), "30");
        assert.equal(await page.locator("#path-fossil").getAttribute("data-count"), "3");
    });
    await check("Desktop: motion pause and resume", async () =>
    {
        await page.locator("#motion-toggle").click();
        const paused = await page.locator("#particles circle").first().getAttribute("cx");
        await page.waitForTimeout(180);
        assert.equal(await page.locator("#particles circle").first().getAttribute("cx"), paused);
        await page.locator("#motion-toggle").click();
        await page.waitForTimeout(180);
        assert.notEqual(await page.locator("#particles circle").first().getAttribute("cx"), paused);
    });
    const cameras = [];
    for (let step = 1; step <= 4; step++)
    {
        await scrollToStep(page, step);
        await check(`Desktop: step ${step} camera, active stock and pinned scene`, async () =>
        {
            assert.equal(await page.locator("#scene-svg").getAttribute("data-active-step"), String(step));
            assert.equal(await page.locator(".gauge-row.active").getAttribute("data-reservoir"), String(step - 1));
            const camera = await page.locator("#scene-svg").getAttribute("viewBox");
            cameras.push(camera);
            assert.ok(camera !== "0 0 1600 1000");
            const box = await page.locator(".scene-sticky").boundingBox();
            assert.ok(Math.abs(box.y) < 2);
        });
        await noOverflow(page, `Desktop: no overflow after step ${step}`);
    }
    assert.equal(new Set(cameras).size, 4);
    await check("Desktop: industrial era actually increases fossil density, speed, width and year", async () =>
    {
        await scrollToStep(page, 5, .1);
        const firstCount = Number(await page.locator("#path-fossil").getAttribute("data-count"));
        const firstSpeed = Number(await page.locator("#path-fossil").getAttribute("data-speed"));
        const firstYear = Number(await page.locator("#counter-5").innerText());
        await scrollToStep(page, 5, .9);
        assert.ok(Number(await page.locator("#path-fossil").getAttribute("data-count")) > firstCount);
        assert.ok(Number(await page.locator("#path-fossil").getAttribute("data-speed")) > firstSpeed);
        assert.equal(await page.locator("#path-fossil").getAttribute("stroke-width"), "7");
        assert.ok(Number(await page.locator("#counter-5").innerText()) > firstYear);
        assert.equal(await page.locator("#counter-5").innerText(), "2025");
    });
    await check("Desktop: airborne stock grows from 600 to 900", async () =>
    {
        await scrollToStep(page, 6, .1);
        const first = Number(await page.locator("#counter-6").innerText());
        await scrollToStep(page, 6, .9);
        assert.ok(Number(await page.locator("#counter-6").innerText()) > first);
        assert.equal(await page.locator("#counter-6").innerText(), "900");
    });
    await check("Desktop: yearly ledger real proportional bars", async () =>
    {
        await page.locator("#ledger").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1500);
        const widths = await page.locator(".ledger-row .bar").evaluateAll((bars) => bars.map((bar) => bar.getBoundingClientRect().width));
        assert.ok(Math.abs(widths[1] / widths[0] - 1) < .02);
        assert.ok(Math.abs(widths[2] / widths[0] - .75) < .02);
        assert.ok(Math.abs(widths[3] / widths[0] - 10 / 120) < .02);
        assert.ok(Math.abs(widths[4] / widths[0] - 5 / 120) < .02);
    });
    await noOverflow(page, "Desktop: no overflow after story and ledger");
    await check("Desktop: all three futures alter actual curve endpoint and readout", async () =>
    {
        await choose(page, 0, 1.5);
        await choose(page, 100, 4);
        await choose(page, 50, 2.5);
    });
    await check("Desktop: continuous midpoint interpolation and release snap", async () =>
    {
        await page.locator("#scenario").evaluate((input) =>
        {
            input.value = "25";
            input.dispatchEvent(new Event("input", {bubbles: true}));
        });
        assert.equal(await page.locator("#warming").getAttribute("data-value"), "2.000");
        const heat = await page.locator("#scenarios").evaluate((element) => element.style.getPropertyValue("--heat"));
        assert.equal(Number(heat), .225);
        await page.locator("#scenario").dispatchEvent("change");
        await page.waitForTimeout(650);
        assert.equal(await page.locator("#scenario").inputValue(), "50");
        assert.equal(await page.locator("#warming").getAttribute("data-value"), "2.500");
    });
    await check("Desktop: arrow keys, Page Down/Up, focus and accessible future description", async () =>
    {
        const range = page.locator("#scenario");
        await range.focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await range.inputValue(), "51");
        assert.ok(Number(await page.locator("#warming").getAttribute("data-value")) > 2.5);
        await page.keyboard.press("PageDown");
        await page.waitForTimeout(650);
        assert.equal(await range.inputValue(), "0");
        assert.match(await range.getAttribute("aria-valuetext"), /Rapid cuts, about 1.5/);
        await page.keyboard.press("PageUp");
        await page.waitForTimeout(650);
        assert.equal(await range.inputValue(), "50");
        await page.keyboard.press("End");
        assert.equal(await range.inputValue(), "100");
        await page.keyboard.press("Home");
        assert.equal(await range.inputValue(), "0");
        await page.keyboard.press("PageUp");
        await page.waitForTimeout(650);
    });
    await page.evaluate(() => scrollTo({top: document.querySelector("#scenarios").offsetTop - 80, behavior: "instant"}));
    await page.waitForTimeout(500);
    await page.screenshot({path: path.join(checks, "desktop-scenarios.png")});
    await check("Desktop: keyboard accordion, single open answer, collapse", async () =>
    {
        const first = page.locator("#faq-button-0");
        await first.focus();
        await page.keyboard.press("Enter");
        assert.equal(await first.getAttribute("aria-expanded"), "true");
        assert.ok(await page.locator("#faq-answer-0").isVisible());
        await page.locator("#faq-button-1").click();
        assert.equal(await first.getAttribute("aria-expanded"), "false");
        assert.ok(await page.locator("#faq-answer-1").isVisible());
        await page.locator("#faq-button-1").click();
        assert.ok(await page.locator("#faq-answer-1").isHidden());
    });
    await check("Desktop: print action invoked and genuine print layout includes all curves/steps", async () =>
    {
        await page.evaluate(() => { window.print = () => { document.body.dataset.printCalled = "true"; }; });
        await page.locator("#print").click();
        assert.equal(await page.locator("body").getAttribute("data-print-called"), "true");
        await page.emulateMedia({media: "print"});
        assert.equal(await page.locator(".print-curve:visible").count(), 3);
        assert.equal(await page.locator(".step-panel:visible").count(), 6);
        assert.ok(await page.locator("header").isHidden());
        assert.ok(await page.locator("#scenario").isHidden());
        assert.equal(await page.locator(".step-panel").first().evaluate((el) => getComputedStyle(el).opacity), "1");
        await page.emulateMedia({media: "screen"});
    });
    await noOverflow(page, "Desktop: no overflow after scenario, FAQ and print interactions");
    await desktop.close();

    const mobile = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    viewports.push({name: "mobile", width: 390, height: 844, deviceScaleFactor: 1, hasTouch: true});
    const phone = await open(mobile, "mobile");
    await phone.screenshot({path: path.join(checks, "mobile.png")});
    await check("Mobile: story CTA, pinned smaller scene and readable panel", async () =>
    {
        await phone.locator(".hero-actions .primary").tap();
        await phone.waitForTimeout(650);
        assert.ok(await phone.locator("#step-1 .step-panel").isVisible());
        const scene = await phone.locator(".scene-sticky").boundingBox();
        assert.ok(Math.abs(scene.height - 844 * .58) < 2);
        assert.ok(Math.abs(scene.y - 64) < 2);
        assert.ok(await phone.locator("#gauge").isHidden());
    });
    await noOverflow(phone, "Mobile: no overflow after story CTA");
    await check("Mobile: touch future buttons and native range drag", async () =>
    {
        await phone.locator('[data-stop="100"]').tap();
        await phone.waitForTimeout(650);
        assert.equal(await phone.locator("#warming").getAttribute("data-value"), "4.000");
        await phone.locator('[data-stop="0"]').tap();
        await phone.waitForTimeout(650);
        assert.equal(await phone.locator("#warming").getAttribute("data-value"), "1.500");
        const range = phone.locator("#scenario");
        await range.scrollIntoViewIfNeeded();
        const box = await range.boundingBox();
        const session = await mobile.newCDPSession(phone);
        const cy = box.y + box.height / 2;
        await session.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x: box.x + 16, y: cy}]});
        await session.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x: box.x + box.width * .55, y: cy}]});
        await session.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
        await phone.waitForTimeout(650);
        assert.equal(await range.inputValue(), "50");
        assert.equal(await phone.locator("#warming").getAttribute("data-value"), "2.500");
        await session.detach();
    });
    await phone.evaluate(() => scrollTo({top: document.querySelector("#scenarios").offsetTop - 80, behavior: "instant"}));
    await phone.waitForTimeout(400);
    await phone.screenshot({path: path.join(checks, "mobile-scenarios.png")});
    await check("Mobile: FAQ touch expands and replaces answer", async () =>
    {
        await phone.locator("#faq-button-2").tap();
        assert.ok(await phone.locator("#faq-answer-2").isVisible());
        await phone.locator("#faq-button-3").tap();
        assert.ok(await phone.locator("#faq-answer-2").isHidden());
        assert.ok(await phone.locator("#faq-answer-3").isVisible());
    });
    await noOverflow(phone, "Mobile: no overflow after slider/touch/FAQ");
    await mobile.close();

    const wide = await browser.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1});
    viewports.push({name: "wide", width: 1440, height: 900, deviceScaleFactor: 1});
    const widePage = await open(wide, "wide");
    await choose(widePage, 100, 4);
    await noOverflow(widePage, "1440 desktop: no overflow after future interaction");
    await wide.close();

    const reduced = await browser.newContext({viewport: {width: 1200, height: 900}, reducedMotion: "reduce", deviceScaleFactor: 1});
    viewports.push({name: "reduced-motion", width: 1200, height: 900, reducedMotion: "reduce"});
    const calm = await open(reduced, "reduced-motion");
    await check("Reduced motion: no particles; static arrows and end counters", async () =>
    {
        assert.equal(await calm.locator("#particles circle:visible").count(), 0);
        assert.equal(await calm.locator("#counter-5").innerText(), "2025");
        assert.equal(await calm.locator("#counter-6").innerText(), "900");
        assert.match(await calm.locator("#path-photosynthesis").getAttribute("marker-end"), /arrow-lime/);
        await scrollToStep(calm, 3);
        assert.equal(await calm.locator("#scene-svg").getAttribute("viewBox"), "760 300 840 525");
    });
    await check("Reduced motion: future changes synchronously without tween", async () =>
    {
        await calm.locator('[data-stop="100"]').click();
        assert.equal(await calm.locator("#warming").getAttribute("data-value"), "4.000");
    });
    await noOverflow(calm, "Reduced motion: no overflow after interactions");
    await reduced.close();
    assert.deepEqual(errors, []);
    results.push({name: "All contexts: zero console warnings/errors, page errors, failed requests or HTTP resource errors", passed: true});
}
catch (error)
{
    failed = error.stack;
    results.push({name: "Execution failure", passed: false, error: error.message});
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    resourcesClosed = true;
    const report =
    {
        prompt: "551-carbon-cycle-scroll-explainer",
        date: new Date().toISOString(),
        passed: !failed,
        results,
        errors,
        viewports,
        screenshots: ["desktop.png", "mobile.png", "desktop-scenarios.png", "mobile-scenarios.png"].map((name) => path.join(checks, name)),
        visualReviewed: false,
        resourcesClosed,
        failure: failed,
        printMethod: "window.print invocation observed with a test stub; print CSS exercised in Chromium, not an OS printer",
        buildsExecuted: false
    };
    await W.saveJson(path.join(checks, "qa.json"), report);
    console.log(JSON.stringify({passed: report.passed, assertions: results.length, errors, failure: failed, resourcesClosed}));
    if (failed) process.exitCode = 1;
}
