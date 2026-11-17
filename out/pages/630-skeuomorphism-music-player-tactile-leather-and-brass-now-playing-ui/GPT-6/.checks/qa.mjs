import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = path.dirname(import.meta.dirname);
assert.equal(folder, job.output);
const exported = path.join(folder, "out");
const results = [];
const errors = [];
const viewports = [{ width: 1200, height: 900 }, { width: 390, height: 844 }];
let browser;
let service;
let failure;
let browsersClosed = false;
let serversClosed = false;

function record(name, evidence)
{
    results.push({ name, passed: true, evidence });
}

async function noOverflow(page, stage)
{
    const sizes = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth
    }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, JSON.stringify(sizes));
    record(stage, sizes);
}

async function loaded(page)
{
    await page.waitForFunction(() => document.querySelector("#audio").readyState >= 2 && document.querySelector("#audio").duration === 36);
}

async function setRange(page, selector, value)
{
    await page.locator(selector).evaluate((element, next) =>
    {
        element.value = next;
        element.dispatchEvent(new Event("input", { bubbles: true }));
    }, String(value));
}

try
{
    const digest = await StaticHomepage.validateStaticOutput(exported, job.prompt.replace(/^\d+-/, ""), "GPT-6");
    record("Independent static export and final public subpath", { digest });
    service = await startPreviewServer(exported, { workspace });
    const readiness = await fetch(service.url);
    assert.equal(readiness.status, 200);
    assert.ok(service.url.includes("/pages/skeuomorphism-music-player-tactile-leather-and-brass-now-playing-ui/GPT-6/index.html"));
    record("Isolated preview server is responsive at final mount", { url: service.url, status: readiness.status });
    const rootResponse = await fetch(new URL("/", service.url));
    assert.equal(rootResponse.status, 404);
    record("Preview server does not expose repository root", { status: 404 });
    browser = await chromium.launch({ headless: true });
    for (const viewport of viewports)
    {
        const mobile = viewport.width < 500;
        const label = mobile ? "Mobile" : "Desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        page.on("pageerror", (error) => errors.push({ viewport, type: "pageerror", message: error.message }));
        page.on("console", (message) =>
        {
            if (message.type() === "error")
            {
                errors.push({ viewport, type: "console", message: message.text() });
            }
        });
        page.on("requestfailed", (request) => errors.push({ viewport, type: "requestfailed", url: request.url(), message: request.failure()?.errorText }));
        page.on("response", (response) =>
        {
            if (response.status() >= 400)
            {
                errors.push({ viewport, type: "http", url: response.url(), status: response.status() });
            }
        });
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await loaded(page);
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.evaluate(() => [...document.fonts].every((font) => font.status !== "error")));
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.ok(await page.locator(".player").isVisible());
        assert.equal(await page.locator("#track-title").textContent(), "The Last Light");
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.paused && audio.currentTime === 0));
        record(`${label}: visible English player, no failed fonts, user-initiated audio only`, viewport);
        await noOverflow(page, `${label}: no horizontal overflow before interactions`);
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png"), fullPage: false });
        record(`${label}: actual first-screen PNG captured`, { width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
        const decoded = await page.evaluate(async () =>
        {
            const context = new AudioContext();
            try
            {
                const evidence = [];
                for (const filename of ["last-light.wav", "velvet-hours.wav", "quiet-return.wav"])
                {
                    const response = await fetch(`assets/${filename}`);
                    if (!response.ok)
                    {
                        throw new Error(`Audio HTTP ${response.status}`);
                    }
                    const audio = await context.decodeAudioData(await response.arrayBuffer());
                    const data = audio.getChannelData(0);
                    let square = 0;
                    let peak = 0;
                    for (const value of data)
                    {
                        square += value * value;
                        peak = Math.max(peak, Math.abs(value));
                    }
                    evidence.push({ filename, duration: audio.duration, sampleRate: audio.sampleRate, rms: Math.sqrt(square / data.length), peak });
                }
                return evidence;
            }
            finally
            {
                await context.close();
            }
        });
        assert.equal(decoded.length, 3);
        assert.ok(decoded.every((entry) => entry.duration === 36 && entry.rms > .05 && entry.peak < 1));
        record(`${label}: all three real local audio files decode with non-silent unclipped signal`, decoded);
        await page.locator("#play").click();
        await page.waitForFunction(() => !document.querySelector("#audio").paused && document.querySelector("#audio").currentTime > .4);
        assert.equal(await page.locator("#play").getAttribute("aria-label"), "Pause");
        record(`${label}: real audio plays and native time advances`, await page.locator("#audio").evaluate((audio) => ({ paused: audio.paused, time: audio.currentTime })));
        await page.locator("#play").click();
        const pausedTime = await page.locator("#audio").evaluate((audio) => audio.currentTime);
        await page.waitForTimeout(200);
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.paused));
        assert.ok(Math.abs((await page.locator("#audio").evaluate((audio) => audio.currentTime)) - pausedTime) < .05);
        record(`${label}: pause stops actual media clock`, pausedTime);
        await setRange(page, "#seek", 14.5);
        await page.waitForFunction(() => Math.abs(document.querySelector("#audio").currentTime - 14.5) < .2);
        assert.equal(await page.locator("#elapsed").textContent(), "0:14");
        await page.locator("#seek").focus();
        await page.keyboard.press("ArrowRight");
        await page.waitForFunction(() => document.querySelector("#audio").currentTime > 14.5);
        record(`${label}: actual native seek and keyboard slider input`, await page.locator("#audio").evaluate((audio) => audio.currentTime));
        await setRange(page, "#volume", 35);
        assert.ok(Math.abs(await page.locator("#audio").evaluate((audio) => audio.volume) - .35) < .001);
        await page.locator("#mute").click();
        assert.equal(await page.locator("#audio").evaluate((audio) => audio.volume), 0);
        await page.locator("#mute").click();
        assert.ok(Math.abs(await page.locator("#audio").evaluate((audio) => audio.volume) - .35) < .001);
        await page.locator("#volume-up").click();
        assert.ok(Math.abs(await page.locator("#audio").evaluate((audio) => audio.volume) - .45) < .001);
        record(`${label}: volume, mute restore and increase affect native audio`, { volume: .45 });
        await page.locator("#favorite").click();
        assert.equal(await page.locator("#favorite").getAttribute("aria-pressed"), "true");
        await page.reload({ waitUntil: "networkidle" });
        await loaded(page);
        assert.equal(await page.locator("#favorite").getAttribute("aria-pressed"), "true");
        record(`${label}: favorite survives reload for the correct track`, { localStorage: true });
        await page.locator("#queue-open").click();
        assert.equal(await page.locator(".queue-track").count(), 3);
        assert.ok(await page.locator("#panel").evaluate((element) => element.open));
        await page.locator('[data-track="1"]').click();
        await loaded(page);
        await page.waitForFunction(() => document.querySelector("#audio").currentTime > .1);
        assert.equal(await page.locator("#track-title").textContent(), "Velvet Hours");
        assert.equal(await page.locator("#favorite").getAttribute("aria-pressed"), "false");
        assert.ok((await page.locator("#audio").getAttribute("data-original-src")).endsWith("velvet-hours.wav"));
        record(`${label}: queue chooses and actually plays a different local recording`, "Velvet Hours");
        await page.locator("#next").click();
        await loaded(page);
        assert.equal(await page.locator("#track-title").textContent(), "A Quiet Return");
        assert.equal(await page.locator("#play").getAttribute("aria-label"), "Pause");
        await page.locator("#previous").click();
        await loaded(page);
        assert.equal(await page.locator("#track-title").textContent(), "Velvet Hours");
        await setRange(page, "#seek", 8);
        await page.locator("#previous").click();
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.currentTime < 1));
        record(`${label}: previous/next preserve playback and previous restarts after 3s`, { title: "Velvet Hours" });
        await page.locator("#shuffle").click();
        assert.equal(await page.locator("#shuffle").getAttribute("aria-pressed"), "true");
        await page.locator("#next").click();
        await loaded(page);
        assert.notEqual(await page.locator("#track-title").textContent(), "Velvet Hours");
        await page.locator("#shuffle").click();
        record(`${label}: shuffle changes actual track without immediate repeat`, { activeToggle: true });
        await page.locator("#repeat").click();
        const titleBefore = await page.locator("#track-title").textContent();
        await setRange(page, "#seek", 35.8);
        await page.waitForFunction(() => document.querySelector("#audio").currentTime < 2 && !document.querySelector("#audio").paused);
        assert.equal(await page.locator("#track-title").textContent(), titleBefore);
        await page.locator("#repeat").click();
        await setRange(page, "#seek", 35.8);
        await page.waitForFunction((title) => document.querySelector("#track-title").textContent !== title, titleBefore);
        await loaded(page);
        assert.equal(await page.locator("#play").getAttribute("aria-label"), "Pause");
        record(`${label}: real ended event repeats or advances the queue`, { repeatAndAdvance: true });
        await page.locator("#play").click();
        await page.locator("#options-open").click();
        assert.equal(await page.locator("#options-open").getAttribute("aria-expanded"), "true");
        await page.locator("#restart").click();
        assert.equal(await page.locator("#audio").evaluate((audio) => audio.currentTime), 0);
        await page.locator("#options-open").click();
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        assert.match(download.suggestedFilename(), /^resonant-.*\.wav$/);
        assert.equal(await download.failure(), null);
        record(`${label}: options restart and real original WAV download`, { filename: download.suggestedFilename() });
        await page.locator("#lyrics").click();
        assert.match(await page.locator("#panel-body").textContent(), /There are no lyrics/);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#panel").evaluate((element) => element.open), false);
        assert.equal(await page.evaluate(() => document.activeElement.id), "lyrics");
        await page.locator("#devices").click();
        assert.match(await page.locator("#panel-body").textContent(), /does not discover or simulate/);
        await page.locator("#panel-close").click();
        await page.locator("#airplay").click();
        assert.match(await page.locator("#panel-body").textContent(), /AirPlay is not available in this browser/);
        await page.keyboard.press("Escape");
        record(`${label}: truthful liner notes, devices and unsupported AirPlay; Escape and focus restoration`, { nativeDialog: true });
        await page.locator("#library-open").click();
        assert.equal(await page.locator("#panel-title").textContent(), "The listening library");
        await page.locator("#panel-close").click();
        await page.locator("#about-open").click();
        assert.match(await page.locator("#panel-body").textContent(), /fictional/);
        await page.keyboard.press("Tab");
        assert.ok(await page.locator("#panel").evaluate((element) => element.contains(document.activeElement)));
        await page.keyboard.press("Escape");
        await page.locator("#options-open").click();
        await page.locator("#shortcuts-open").click();
        assert.equal(await page.locator("#panel-title").textContent(), "At your fingertips");
        await page.keyboard.press("Escape");
        record(`${label}: library, disclosure, keyboard help, modal focus containment`, { keyboard: true });
        await page.locator(".player-signature").click();
        await page.keyboard.press("Space");
        await page.waitForFunction(() => !document.querySelector("#audio").paused);
        await page.keyboard.press("Space");
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.paused));
        await page.keyboard.press("ArrowRight");
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.currentTime >= 5));
        await page.keyboard.press("m");
        assert.equal(await page.locator("#audio").evaluate((audio) => audio.volume), 0);
        await page.keyboard.press("m");
        assert.ok(await page.locator("#audio").evaluate((audio) => audio.volume > 0));
        record(`${label}: global keyboard playback, seek and mute shortcuts`, { space: true, arrows: true, mute: true });
        await noOverflow(page, `${label}: no horizontal overflow after interactions`);
        await context.close();
    }
    const narrow = await browser.newPage({ viewport: { width: 320, height: 700 }, deviceScaleFactor: 1 });
    await narrow.goto(service.url, { waitUntil: "networkidle" });
    await noOverflow(narrow, "Narrow 320px: no horizontal overflow");
    assert.ok(await narrow.locator("#play").isVisible());
    await narrow.close();
    assert.deepEqual(errors, []);
    record("All tested views: zero console, page, request, resource or HTTP errors", { errors: [] });
}
catch (error)
{
    failure = error;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    browsersClosed = true;
    if (service)
    {
        await service.close();
    }
    serversClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), {
        status: failure ? "failed" : "passed",
        date: new Date().toISOString(),
        modelId: job.modelId,
        viewports,
        results,
        errors,
        failure: failure ? { message: failure.message, stack: failure.stack } : null,
        screenshots: { desktop: ".checks\\desktop.png", mobile: ".checks\\mobile.png" },
        visualReviewed: false,
        resourcesClosed: { browsers: browsersClosed, servers: serversClosed }
    });
}
if (failure)
{
    throw failure;
}
console.log(JSON.stringify({ status: "passed", assertionGroups: results.length, errors, resourcesClosed: browsersClosed && serversClosed }));
