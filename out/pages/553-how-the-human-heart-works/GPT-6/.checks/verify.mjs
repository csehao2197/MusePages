import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { model, timing, phaseTime, signal } from "../model.js";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "553-how-the-human-heart-works");
assert.equal(job.modelId, "gpt-6.1-sol");
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
process.kill(lockPid, 0);
assert.equal(state.ownedLock.pid, lockPid);
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.runId, job.runId);
const output = path.join(job.output, "out");
const checks = path.join(job.output, ".checks");
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    startedAt: new Date().toISOString(),
    staticDigest: null,
    passed: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: [],
    visualReviewed: false,
    resourcesClosed: false
};
let browser, server;
function record(test, evidence)
{
    qa.assertions.push({ test, passed: true, evidence });
}
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    assert.ok(sizes.scroll <= sizes.width + 1, `${label}: overflow ${JSON.stringify(sizes)}`);
    record(label, sizes);
}
function watch(page, label)
{
    page.on("pageerror", (error) => qa.errors.push({ viewport: label, type: "page", message: error.message }));
    page.on("console", (message) =>
    {
        if (message.type() === "error") qa.errors.push({ viewport: label, type: "console", message: message.text() });
    });
    page.on("requestfailed", (request) => qa.errors.push({ viewport: label, type: "request", message: request.url() }));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) qa.errors.push({ viewport: label, type: "http", status: response.status(), message: response.url() });
    });
}
async function home(page, label)
{
    watch(page, label);
    const response = await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.locator("#phase-name").waitFor({ state: "visible" });
    assert.equal(await page.title(), "Cutaway Lab | How the human heart works");
    assert.equal(await page.locator("h1").innerText(), "How the human heart works");
    const plate = await page.locator("#hero-diagram").boundingBox();
    assert.ok(plate.width > 300 && plate.height > 200);
    assert.equal(await page.locator("#hero-diagram").getAttribute("viewBox"), "0 0 1000 900");
    assert.equal(await page.locator("#hero-diagram [data-part=particles] circle").count(), 90);
    assert.ok(Number(await page.locator("#hero-trace").getAttribute("data-sample-count")) > 1000);
    assert.ok(server.url.endsWith("/pages/how-the-human-heart-works/GPT-6/index.html"));
    const outside = await page.request.get(new URL("/README.md", server.url).href);
    assert.equal(outside.status(), 404);
    record(`${label}: successful isolated static subpath, visible anatomy and synthesized trace`, { url: server.url, plate, particleCount: 90 });
    await noOverflow(page, `${label}: initial no page overflow`);
}
async function scrollStop(page, index)
{
    await page.evaluate((i) =>
    {
        const card = document.querySelectorAll(".path-step")[i];
        const top = card.getBoundingClientRect().top + scrollY + card.offsetHeight / 2 - innerHeight * 0.6;
        window.scrollTo({ top, behavior: "instant" });
        window.ScrollTrigger.update();
    }, index);
    await page.waitForTimeout(70);
    assert.equal(await page.locator("#path").getAttribute("data-active-step"), String(index));
    assert.equal(await page.locator(".path-dot[aria-current=step]").count(), 1);
    const targets = await page.locator("#path-diagram").getAttribute("data-spotlight");
    assert.ok(targets.length > 0);
    const drop = page.locator("#path-diagram .spot-overlay circle");
    assert.equal(await drop.getAttribute("visibility"), "visible");
    assert.ok(Number.isFinite(Number(await drop.getAttribute("cx"))));
    record(`Blood path stop ${index + 1}`, { targets, dropX: await drop.getAttribute("cx"), fill: await drop.getAttribute("fill") });
}
try
{
    const times = [[40, 0.34, 1.16], [60, 0.28, 0.72], [90, 0.24, 0.43], [120, 0.22, 0.28], [150, 0.21, 0.19], [180, 0.20, 0.13]];
    for (const [rate, systole, diastole] of times)
    {
        const values = timing(rate);
        assert.equal(values.Ts.toFixed(2), systole.toFixed(2));
        assert.equal(values.Td.toFixed(2), diastole.toFixed(2));
        assert.ok(values.Tf > 0);
        for (let phase = 0; phase < 5; phase++)
        {
            const m = model(phaseTime(phase, rate), rate);
            assert.equal(m.phase, phase);
            if (phase !== 3) assert.equal(m.inlet > 0.5, phase === 4);
            else
            {
                const nearEnd = model(values.bounds[4] - values.Tf * 0.01, rate);
                assert.ok(nearEnd.inlet > 0.5);
                assert.ok(m.inlet >= 0 && m.inlet <= 1);
            }
            assert.equal(m.outlet > 0.5, phase === 1);
            assert.ok(m.v >= 0.74 && m.v <= 1 && m.a >= 0.88 && m.a <= 1);
        }
    }
    assert.ok(model(phaseTime(4, 180), 180).v < model(phaseTime(4, 40), 40).v - 0.1);
    assert.ok(signal(0, 72) > 0.9);
    assert.ok(Math.abs(signal(0, 72) - signal(timing(72).RR, 72)) < 1e-10);
    record("Pure model: six table rates, five phases at every rate, valve sequencing, reduced high-rate filling, periodic Gaussian ECG", { cases: 30, rates: times });
    const source = await readFile(path.join(job.output, "main.js"), "utf8");
    assert.equal((source.match(/function frame\(/g) || []).length, 1);
    assert.ok(!source.includes("setInterval"));
    record("One application RAF loop and no independent beat timer", "GSAP is confined to scroll/reveals; model has no DOM.");
    qa.staticDigest = await StaticHomepage.validateStaticOutput(output, "how-the-human-heart-works", "GPT-6");
    server = await startPreviewServer(output, { workspace });
    browser = await chromium.launch({ headless: true });
    const desktopContext = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const desktop = await desktopContext.newPage();
    qa.viewports.push({ name: "desktop", width: 1200, height: 900, deviceScaleFactor: 1 });
    await home(desktop, "desktop");
    const bounds = await desktop.locator("#hero-trace").boundingBox();
    const slider = await desktop.locator("#hero-rate").boundingBox();
    const diagramBounds = await desktop.locator("#hero-diagram").boundingBox();
    assert.ok(bounds.y + bounds.height <= 900);
    assert.ok(slider.y + slider.height <= 900);
    assert.ok(diagramBounds.y >= 64 && diagramBounds.y + diagramBounds.height < bounds.y);
    const eyebrow = await desktop.locator(".hero-title .eyebrow").boundingBox();
    const actions = await desktop.locator(".hero-actions").boundingBox();
    assert.ok(eyebrow.y >= 64 && actions.y + actions.height <= bounds.y);
    record("Desktop: complete diagram, native slider and live trace visible before scrolling", { trace: bounds, slider, diagram: diagramBounds });
    await desktop.screenshot({ path: path.join(checks, "desktop.png") });
    qa.screenshots.push(path.join(checks, "desktop.png"));
    await desktop.locator("#pause").click();
    const stopped = await desktop.locator("#beat").getAttribute("data-time");
    await desktop.waitForTimeout(160);
    assert.equal(await desktop.locator("#beat").getAttribute("data-time"), stopped);
    await desktop.locator("#hero-rate").fill("180");
    const fraction = await desktop.evaluate(async () =>
    {
        const module = await import("./model.js");
        return Number(document.querySelector("#beat").dataset.time) / module.timing(180).RR;
    });
    assert.ok(Math.abs(fraction - Number(stopped) / timing(72).RR) < 0.00001);
    assert.equal(await desktop.locator("#table-rate").inputValue(), "180");
    await desktop.locator("#hero-rate").focus();
    await desktop.keyboard.press("ArrowLeft");
    assert.equal(await desktop.locator(".bpm").innerText(), "179");
    assert.equal(await desktop.locator("#table-rate").inputValue(), "179");
    record("Pause holds all clocks; rate preserves cycle fraction and native arrows synchronize sliders", { fraction });
    await desktop.locator("#hero-rate").fill("72");
    for (let phase = 0; phase < 5; phase++)
    {
        await desktop.locator(`.moment-card[data-phase="${phase}"]`).click();
        assert.equal(await desktop.locator("#phase-name").getAttribute("data-phase"), String(phase));
        assert.equal(await desktop.locator("#beat").getAttribute("data-running"), "false");
        for (const id of ["hero-diagram", "path-diagram", "trace-diagram"])
        {
            assert.equal(await desktop.locator(`#${id}`).getAttribute("data-phase"), String(phase));
        }
        const valveStates = await desktop.locator(".valve-card output").allTextContents();
        assert.deepEqual(valveStates, [phase >= 3 ? "Open" : "Closed", phase === 1 ? "Open" : "Closed", phase >= 3 ? "Open" : "Closed", phase === 1 ? "Open" : "Closed"]);
        record(`All live plates/valves hold phase ${phase + 1}`, { valveStates });
    }
    await desktop.locator("#moments [data-step='1']").click();
    assert.equal(await desktop.locator("#phase-name").getAttribute("data-phase"), "0");
    await desktop.locator("#moments [data-step='-1']").click();
    assert.equal(await desktop.locator("#phase-name").getAttribute("data-phase"), "4");
    await desktop.locator("#moments .back-live").click();
    await desktop.waitForTimeout(90);
    assert.equal(await desktop.locator("#beat").getAttribute("data-running"), "true");
    await desktop.locator("h2").first().evaluate((element) => { element.setAttribute("tabindex", "-1"); element.focus(); });
    await desktop.keyboard.press("Space");
    assert.equal(await desktop.locator("#beat").getAttribute("data-running"), "false");
    await desktop.keyboard.press("Space");
    await desktop.waitForTimeout(70);
    assert.equal(await desktop.locator("#beat").getAttribute("data-running"), "true");
    record("Previous/Next wrap, Back to live and non-control Space toggle work", true);
    for (let i = 0; i < 10; i++) await scrollStop(desktop, i);
    await desktop.locator("[data-trace='1']").focus();
    assert.ok((await desktop.locator("#trace-diagram").getAttribute("data-spotlight")).includes("septal"));
    await desktop.keyboard.press("Enter");
    assert.equal(await desktop.locator("[data-trace='1']").getAttribute("aria-pressed"), "true");
    await desktop.locator("details").nth(1).locator("summary").focus();
    await desktop.keyboard.press("Enter");
    assert.equal(await desktop.locator("details").nth(1).getAttribute("open"), "");
    assert.ok((await desktop.locator("details").nth(1).innerText()).includes("not a recording"));
    record("Keyboard trace highlighting and classroom disclosure are functional", true);
    await noOverflow(desktop, "desktop: no overflow after all interactions");
    await desktop.setViewportSize({ width: 1440, height: 900 });
    await desktop.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await desktop.waitForTimeout(150);
    const fullTrace = await desktop.locator("#hero-trace").boundingBox();
    assert.ok(fullTrace.y + fullTrace.height <= 900);
    await noOverflow(desktop, "1440 desktop: no overflow and trace before fold");
    qa.viewports.push({ name: "wide desktop", width: 1440, height: 900, deviceScaleFactor: 1 });
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    qa.viewports.push({ name: "mobile", width: 390, height: 844, deviceScaleFactor: 1 });
    await home(mobile, "mobile");
    const mobileTrace = await mobile.locator(".hero-trace").boundingBox();
    assert.ok(mobileTrace.y + mobileTrace.height <= 844, "Mobile live trace should be fully visible before the fold");
    record("Mobile: diagram, rate slider and complete trace visible without scrolling", mobileTrace);
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    qa.screenshots.push(path.join(checks, "mobile.png"));
    await mobile.locator("#pause").tap();
    await mobile.locator("#hero-rate").fill("40");
    assert.equal(await mobile.locator("#table-rate").inputValue(), "40");
    await mobile.locator("#moments").scrollIntoViewIfNeeded();
    await mobile.locator(".moment-card[data-phase='1']").tap();
    assert.equal(await mobile.locator("#valve-state-1").innerText(), "Open");
    await mobile.locator("#moments [data-step='1']").tap();
    assert.equal(await mobile.locator("#phase-name").getAttribute("data-phase"), "2");
    await mobile.locator("#moments .back-live").tap();
    await mobile.waitForTimeout(70);
    assert.equal(await mobile.locator("#beat").getAttribute("data-running"), "true");
    await mobile.locator("#table-rate").fill("180");
    assert.equal(await mobile.locator("#hero-rate").inputValue(), "180");
    const snap = await mobile.locator(".moment-grid").evaluate((row) =>
    {
        const before = row.scrollLeft;
        row.scrollLeft = row.scrollWidth;
        return { before, after: row.scrollLeft, width: row.clientWidth, scroll: row.scrollWidth };
    });
    assert.ok(snap.after > snap.before && snap.scroll > snap.width);
    await scrollStop(mobile, 4);
    await scrollStop(mobile, 9);
    await mobile.locator("[data-trace='0']").tap();
    assert.ok((await mobile.locator("#trace-diagram").getAttribute("data-spotlight")).includes("atrial"));
    await mobile.locator("details").last().locator("summary").tap();
    assert.ok((await mobile.locator("details").last().innerText()).includes("clinician"));
    await noOverflow(mobile, "mobile: no overflow after touch interactions");
    record("Mobile: tap phases, synchronized rates, horizontal phase rail, path stops, trace and disclosure", snap);
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const reducedPage = await reducedContext.newPage();
    await home(reducedPage, "reduced-motion");
    qa.viewports.push({ name: "reduced-motion mobile", width: 390, height: 844, deviceScaleFactor: 1 });
    assert.equal(await reducedPage.locator("#phase-name").getAttribute("data-phase"), "1");
    const staticTime = await reducedPage.locator("#beat").getAttribute("data-time");
    await reducedPage.waitForTimeout(160);
    assert.equal(await reducedPage.locator("#beat").getAttribute("data-time"), staticTime);
    assert.equal(await reducedPage.locator("#pause").isDisabled(), true);
    assert.equal(await reducedPage.locator("#hero-diagram [data-part=particles]").evaluate((g) => getComputedStyle(g).visibility), "hidden");
    await reducedPage.locator(".reduced-controls [data-step='1']").focus();
    await reducedPage.keyboard.press("Enter");
    assert.equal(await reducedPage.locator("#phase-name").getAttribute("data-phase"), "2");
    assert.equal(await reducedPage.locator(".reduced-controls .back-live").isDisabled(), true);
    await scrollStop(reducedPage, 4);
    const fixedDrop = await reducedPage.locator("#path-diagram .spot-overlay circle").getAttribute("cx");
    assert.equal(fixedDrop, "880");
    await noOverflow(reducedPage, "reduced motion: no page overflow");
    record("Reduced motion: no running clock, static ECG, hidden particles, keyboard hero steps, exact stop drop", { staticTime, fixedDrop });
    assert.deepEqual(qa.errors, []);
    record("All browser contexts: no HTTP/resource/request/console/page errors", []);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push({ type: "assertion", message: error.stack });
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    qa.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }, null, 2));
}
