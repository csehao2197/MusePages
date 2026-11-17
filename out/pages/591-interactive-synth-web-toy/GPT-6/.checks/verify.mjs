import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const exported = path.join(folder, "out");
const workspace = process.cwd();
const results = [];
const errors = [];
const measurements = [];
let server;
let browser;
const qa = { passed: false, visualReviewed: false, viewports: [], results, errors, measurements, resourcesClosed: false };
const check = (name, value, details) =>
{
    assert.ok(value, `${name}: ${JSON.stringify(details)}`);
    results.push({ name, passed: true, ...(details ? { details } : {}) });
};
const app = async (page, expression) => page.evaluate(async (source) =>
{
    const app = await import("./main.js");
    return new Function("app", `return (${source})`)(app);
}, expression);
const noOverflow = async (page, label) =>
{
    const sizes = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
    check(label, sizes.document <= sizes.viewport, sizes);
};
const watch = (page) =>
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`http: ${response.status()} ${response.url()}`); });
};
async function rms(page)
{
    return page.evaluate(async () =>
    {
        const { synth } = await import("./main.js");
        const data = new Float32Array(synth.analyser.fftSize);
        let maximum = 0;
        for (let iteration = 0; iteration < 8; iteration++)
        {
            synth.analyser.getFloatTimeDomainData(data);
            maximum = Math.max(maximum, Math.sqrt(data.reduce((sum, value) => sum + value * value, 0) / data.length));
            await new Promise((resolve) => setTimeout(resolve, 25));
        }
        return maximum;
    });
}
try
{
    const staticDigest = await StaticHomepage.validateStaticOutput(exported, "interactive-synth-web-toy", "GPT-6");
    qa.staticDigest = staticDigest;
    server = await startPreviewServer(exported, { workspace });
    check("Actual final public subpath", new URL(server.url).pathname === "/pages/interactive-synth-web-toy/GPT-6/index.html", { url: server.url });
    check("Preview server responds", (await fetch(server.url)).status === 200);
    check("Preview server does not serve repository", (await fetch(new URL("/README.md", server.url))).status === 404);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    watch(page);
    const response = await page.goto(server.url);
    await page.evaluate(() => document.fonts.ready);
    check("Desktop HTTP 200", response.status() === 200);
    check("Meaningful instrument", await page.locator(".pad").count() === 128 && await page.locator(".key").count() === 25);
    check("No unsolicited AudioContext", await app(page, "app.synth.context === null"));
    check("First visit preserves empty hash", await page.evaluate(() => location.hash === ""));
    check("Desktop instrument fits first screen", await page.locator(".instrument").evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight));
    check("All desktop pads contained within sequencer panel", await page.locator(".sequencer").evaluate((element) =>
    {
        const bounds = element.getBoundingClientRect();
        return [...element.querySelectorAll(".pad")].every((pad) =>
        {
            const box = pad.getBoundingClientRect();
            return box.bottom <= bounds.bottom - 8 && box.top >= bounds.top;
        });
    }));
    await noOverflow(page, "Desktop initial no horizontal overflow");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    qa.viewports.push({ width: 1200, height: 900, dpr: 1, screenshot: ".checks\\desktop.png" });

    await page.getByRole("button", { name: "Start sound", exact: true }).click();
    check("First Start sound gesture starts actual audio", await app(page, "app.synth.context.state === 'running'"));
    await page.waitForFunction(async () => (await import("./main.js")).synth.context.currentTime > 0.06);
    const firstRms = await rms(page);
    check("First gesture note reaches destination analyser", firstRms > 0.0001, { rms: firstRms });
    check("Audio status is truthful", await page.locator("#audio-status").textContent() === "AUDIO ON");
    check("Master and compressor constants", await app(page, "Math.abs(app.synth.master.gain.value - 0.441) < 0.00001 && app.synth.compressor.threshold.value === -14 && app.synth.compressor.ratio.value === 6 && app.synth.analyser.fftSize === 2048"));
    check("Delay feedback, wet and tempo sync", await app(page, "Math.abs(app.synth.delay.delayTime.value - 3*60/112/4) < 0.0001 && Math.abs(app.synth.feedback.gain.value-.28) < .00001 && Math.abs(app.synth.wet.gain.value-.16) < .00001"));
    await page.waitForTimeout(1400);
    const shortNote = await page.evaluate(async () =>
    {
        const { Synth } = await import("./audio.js");
        const engine = new Synth();
        engine.context = new OfflineAudioContext(1, 44100, 44100);
        engine.bus = engine.context.createGain();
        engine.bus.connect(engine.context.destination);
        const voice = engine.note(69, 0, 60, 0.01);
        voice.release(0.06);
        const rendered = await engine.context.startRendering();
        const data = rendered.getChannelData(0);
        const energy = (start, end) =>
        {
            const slice = data.subarray(Math.floor(start * 44100), Math.floor(end * 44100));
            return Math.sqrt(slice.reduce((sum, value) => sum + value * value, 0) / slice.length);
        };
        return { beforeRelease: energy(0.03, 0.05), afterRelease: energy(0.07, 0.1), lateTail: energy(0.95, 1) };
    });
    check("Short scheduled release preserves audible attack before note-off", shortNote.beforeRelease > 0.001 && shortNote.afterRelease > 0.001, shortNote);
    measurements.push({ offlineShortPad: shortNote });
    await page.evaluate(async () => { const { synth } = await import("./main.js"); await synth.context.suspend(); });
    await page.keyboard.down("a");
    await page.waitForTimeout(160);
    check("Triggering key resumes suspended audio and still sounds", await app(page, "app.synth.context.state==='running' && app.synth.live.some(v=>!v.released)") && await rms(page) > 0.0001);
    await page.keyboard.up("a");
    await page.waitForTimeout(300);

    for (let voiceIndex = 0; voiceIndex < 3; voiceIndex++)
    {
        await page.locator(`[data-voice="${voiceIndex}"]`).click();
        await page.keyboard.down("a");
        await page.waitForTimeout(230);
        const signal = await rms(page);
        const properties = await app(page, `(() => { const v=app.synth.live.findLast(v=>!v.released); return {live:app.synth.live.length, types:v.oscillators.map(o=>o.oscillator.type), frequency:v.oscillators[0].oscillator.frequency.value, detunes:v.oscillators.map(o=>o.oscillator.detune.value), q:v.filter.Q.value, cutoff:v.filter.frequency.value}; })()`);
        check(`Voice ${voiceIndex} actual audible signal`, signal > 0.0001, { rms: signal, ...properties });
        check(`Voice ${voiceIndex} oscillator types`, JSON.stringify(properties.types) === JSON.stringify([["triangle", "sine"], ["square", "square"], ["sawtooth", "sine"]][voiceIndex]));
        const expected = 440 * 2 ** (((voiceIndex === 2 ? 36 : 60) - 69) / 12);
        check(`Voice ${voiceIndex} exact note / transpose frequency`, Math.abs(properties.frequency - expected) < 0.001);
        check(`Voice ${voiceIndex} key lights`, await page.locator('[data-midi="60"]').evaluate((key) => key.classList.contains("lit")));
        await page.keyboard.up("a");
        await page.waitForTimeout(1150);
        check(`Voice ${voiceIndex} oscillators stop and disconnect`, await app(page, "app.synth.live.length === 0"));
        measurements.push({ voice: voiceIndex, rms: signal, properties });
    }
    await page.locator("#tone").focus();
    await page.keyboard.press("Home");
    await page.keyboard.down("a");
    await page.waitForTimeout(250);
    const lowCutoff = await app(page, "app.synth.live.findLast(v=>!v.released).filter.frequency.value");
    check("Tone actually changes filter cutoff", Math.abs(lowCutoff - 175) < 1, { lowCutoff });
    await page.keyboard.up("a");
    await page.locator("#tone").dblclick();
    check("Double-click knob reset", await app(page, "app.state.tone === 60"));
    await page.locator("#volume").focus();
    await page.keyboard.press("Home");
    await page.waitForFunction(async () => (await import("./main.js")).synth.master.gain.value === 0);
    check("Master volume can safely mute", await app(page, "app.synth.master.gain.value === 0"));
    await page.keyboard.down("s");
    await page.waitForTimeout(350);
    check("Actual mute produces zero signal", await rms(page) === 0);
    await page.keyboard.up("s");
    const volumeHash = await page.evaluate(() => location.hash);
    await page.keyboard.press("End");
    await page.waitForFunction(async () => Math.abs((await import("./main.js")).synth.master.gain.value - .9) < .00001);
    check("Full volume matches quadratic gain", await app(page, "Math.abs(app.synth.master.gain.value - .9) < .00001"));
    check("Volume stays out of URL", await page.evaluate((hash) => location.hash === hash, volumeHash));
    await page.locator("#volume").dblclick();
    const knobBox = await page.locator("#tempo").boundingBox();
    await page.mouse.move(knobBox.x + 20, knobBox.y + 20);
    await page.mouse.down();
    await page.mouse.move(knobBox.x + 20, knobBox.y - 5);
    await page.mouse.up();
    check("Pointer knob drag changes tempo", await app(page, "app.state.bpm === 142"));
    await page.locator("#tempo").focus();
    await page.keyboard.press("PageDown");
    check("Knob keyboard PageDown", await app(page, "app.state.bpm === 132"));

    const cap = await app(page, `(() => { app.synth.releaseAll(); const first=app.synth.note(60,1,60); for(let i=0;i<12;i++) app.synth.note(61+i,1,60); const result={count:app.synth.live.length,oldestStolen:!app.synth.live.includes(first)}; app.synth.releaseAll(); return result; })()`);
    check("Twelve-voice cap steals oldest", cap.count === 12 && cap.oldestStolen, cap);
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    check("Clear wipes all bytes", await app(page, "app.state.grid.every(byte=>byte===0)"));
    const firstPad = page.getByRole("button", { name: "Step 1, note F5", exact: true });
    await firstPad.click();
    check("Pad toggles bit 7 and updates hash", await app(page, "app.state.grid[0] === 128") && (await page.evaluate(() => new URLSearchParams(location.hash.slice(1)).get("g"))).startsWith("80"));
    const pad2 = page.getByRole("button", { name: "Step 2, note F5", exact: true });
    const pad4 = page.getByRole("button", { name: "Step 4, note F5", exact: true });
    const p2 = await pad2.boundingBox();
    const p4 = await pad4.boundingBox();
    await page.mouse.move(p2.x + p2.width / 2, p2.y + p2.height / 2);
    await page.mouse.down();
    await page.mouse.move(p4.x + p4.width / 2, p4.y + p4.height / 2, { steps: 15 });
    await page.mouse.up();
    check("Mouse drag paints entered pads", await app(page, "app.state.grid.slice(0,4).every(byte=>byte===128)"));
    await pad4.focus();
    await page.keyboard.press("Space");
    check("Accessible focused pad Space toggles without playing", await app(page, "app.state.grid[3]===0 && !app.sequencer.playing"));
    await page.locator('[data-starter="0"]').click();
    check("Starter zero exact bytes / voice / BPM", await app(page, "app.state.bpm===112 && app.state.voice===1 && app.state.grid.map(b=>b.toString(16).padStart(2,'0')).join('')==='09002000100800201200402000081000'"));
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForTimeout(430);
    check("Sequencer schedules real notes and visual step", await app(page, "app.sequencer.playing && app.sequencer.scheduled>=3") && await page.locator(".step.current").count() === 1);
    check("Sequencer sends real audio", await rms(page) > 0.0001);
    await page.locator('[data-starter="1"]').click();
    check("Starter load preserves running transport", await app(page, "app.sequencer.playing && app.state.bpm===138 && app.state.voice===2"));
    const recovery = await app(page, `(() => { app.sequencer.nextTime=app.synth.context.currentTime-5; const before=app.sequencer.scheduled; app.sequencer.schedule(); return {scheduled:app.sequencer.scheduled-before,next:app.sequencer.nextTime-app.synth.context.currentTime}; })()`);
    check("Lag recovery avoids catch-up burst", recovery.scheduled <= 2 && recovery.next > 0, recovery);
    await page.getByRole("button", { name: "Stop", exact: true }).click();
    check("Stop clears scheduled visual queue", await app(page, "!app.sequencer.playing && app.sequencer.queue.length===0"));
    await page.evaluate(() => document.activeElement.blur());
    await page.keyboard.press("Space");
    check("Space shortcut starts", await app(page, "app.sequencer.playing"));
    await page.keyboard.press("Space");
    check("Space shortcut stops", await app(page, "!app.sequencer.playing"));
    await page.keyboard.press("x");
    check("Octave X redraws C5", await page.locator('.key[data-offset="0"]').getAttribute("data-midi") === "72");
    await page.keyboard.press("z");
    for (const event of ["blur", "pointercancel", "visibilitychange"])
    {
        await page.keyboard.down("a");
        await page.waitForTimeout(80);
        await page.evaluate((name) => (name === "visibilitychange" ? document : window).dispatchEvent(new Event(name)), event);
        await page.keyboard.up("a");
        check(`${event} releases held notes`, await app(page, "app.synth.live.every(v=>v.released) && !app.sequencer.playing"));
    }
    await page.waitForTimeout(3200);
    const silentRms = await rms(page);
    check("Released notes and delay decay to silence", silentRms < 0.0001 && await app(page, "app.synth.live.length===0"), { rms: silentRms });

    await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("QA denial"); } } }));
    await page.getByRole("button", { name: "Copy link", exact: true }).click();
    check("Denied clipboard shows selected, read-only exact link", await page.locator("#share-url").evaluate((input) => input.readOnly && input.value === location.href && input.selectionStart === 0 && input.selectionEnd === input.value.length));
    await page.locator("#share-url").focus();
    await page.keyboard.press("a");
    check("Typing in fallback input does not hold a note", await app(page, "app.synth.live.length===0"));
    await page.locator("#close-copy").click();
    await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (url) => { window.copiedURL = url; } } }));
    await page.getByRole("button", { name: "Copy link", exact: true }).click();
    check("Successful clipboard branch announces Copied with exact URL", await page.locator("#copy").textContent() === "Copied" && await page.evaluate(() => window.copiedURL === location.href));
    await noOverflow(page, "Desktop after interactions no horizontal overflow");
    const linkedURL = await page.evaluate(() => location.href);
    await page.goto(linkedURL);
    await page.reload();
    check("Shared link restores stopped and without audio", await app(page, "app.state.linked && !app.sequencer.playing && app.synth.context===null"));
    check("Shared-link introduction", await page.locator("#start-message").textContent() === "This link holds a pattern.");
    await page.getByRole("button", { name: "Play it", exact: true }).click();
    check("Shared link first gesture starts sequencer", await app(page, "app.sequencer.playing && app.synth.context.state==='running'"));
    await page.getByRole("button", { name: "Stop", exact: true }).click();
    await page.evaluate(() => { location.hash = "v=1&p=99&b=999&n=-20&g=290000008000400052000000a4002000"; });
    await page.waitForTimeout(60);
    check("Hashchange reads and clamps numbers", await app(page, "app.state.voice===2 && app.state.bpm===180 && app.state.tone===0"));
    await page.goto(`${server.url}#v=1&p=nope&b=nan&n=nan&g=nothex`);
    check("Malformed hash falls back without rewriting it", await app(page, "app.state.voice===1 && app.state.bpm===112 && !app.state.linked") && await page.evaluate(() => location.hash.includes("nothex")));
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page, "1440px target no horizontal overflow");
    check("1440px entire instrument in first screen", await page.locator(".keyboard-panel").evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight));
    qa.viewports.push({ width: 1440, height: 900, dpr: 1 });
    await page.setViewportSize({ width: 820, height: 1000 });
    await noOverflow(page, "Tablet no horizontal overflow");
    qa.viewports.push({ width: 820, height: 1000, dpr: 1 });
    await context.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    watch(mobile);
    await mobile.goto(server.url);
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile, "Mobile initial no horizontal overflow");
    check("Mobile keyboard above sequencer", await mobile.evaluate(() => document.querySelector(".keyboard-panel").getBoundingClientRect().top < document.querySelector(".sequencer").getBoundingClientRect().top));
    await mobile.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    qa.viewports.push({ width: 390, height: 844, dpr: 1, touch: true, screenshot: ".checks\\mobile.png" });
    await mobile.getByRole("button", { name: "Start sound", exact: true }).tap();
    await mobile.locator('[data-voice="0"]').tap();
    const key = mobile.locator('.key[data-offset="0"]');
    await key.scrollIntoViewIfNeeded();
    const keyBox = await key.boundingBox();
    const secondBox = await mobile.locator('.key[data-offset="4"]').boundingBox();
    const cdp = await mobileContext.newCDPSession(mobile);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: keyBox.x + 15, y: keyBox.y + 125, id: 1 }, { x: secondBox.x + 15, y: secondBox.y + 125, id: 2 }] });
    await mobile.waitForTimeout(250);
    check("Mobile actual multi-pointer chord", await app(mobile, "app.synth.live.filter(v=>!v.released).length===2") && await mobile.locator(".key.lit").count() >= 2);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await mobile.waitForTimeout(1100);
    check("Mobile touch release leaves no stuck voices", await app(mobile, "app.synth.live.length===0"));
    await cdp.detach();
    const mobilePad = mobile.getByRole("button", { name: "Step 16, note C4", exact: true });
    await mobilePad.tap();
    check("Mobile pad tap changes state", await mobilePad.getAttribute("aria-pressed") === "true");
    await mobile.locator(".key-scroll").evaluate((element) => { element.scrollLeft = 400; });
    check("Mobile keyboard scrolls internally", await mobile.locator(".key-scroll").evaluate((element) => element.scrollLeft > 0));
    await mobile.getByRole("button", { name: "Play", exact: true }).tap();
    await mobile.waitForTimeout(250);
    check("Mobile transport works", await app(mobile, "app.sequencer.playing"));
    await mobile.getByRole("button", { name: "Stop", exact: true }).tap();
    await noOverflow(mobile, "Mobile after interactions no horizontal overflow");
    await mobileContext.close();

    const reducedContext = await browser.newContext({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    const reduced = await reducedContext.newPage();
    watch(reduced);
    await reduced.goto(server.url);
    await reduced.waitForTimeout(100);
    const trace = await reduced.locator("#scope").evaluate((canvas) => canvas.toDataURL());
    await reduced.waitForTimeout(200);
    check("Reduced-motion scope remains static", await reduced.locator("#scope").evaluate((canvas, before) => canvas.toDataURL() === before, trace));
    await reduced.locator('[data-voice="2"]').click();
    check("Reduced-motion scope redraws actual voice shape", await reduced.locator("#scope").evaluate((canvas, before) => canvas.toDataURL() !== before, trace));
    await reducedContext.close();

    const unsupportedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await unsupportedContext.addInitScript(() =>
    {
        window.AudioContext = undefined;
        window.webkitAudioContext = undefined;
    });
    const unsupported = await unsupportedContext.newPage();
    watch(unsupported);
    await unsupported.goto(server.url);
    check("No-Web-Audio message", await unsupported.locator("#start-message").textContent() === "This browser has no Web Audio.");
    const unsupportedPad = unsupported.getByRole("button", { name: "Step 16, note C4", exact: true });
    await unsupportedPad.click();
    check("Grid remains editable without Web Audio", await unsupportedPad.getAttribute("aria-pressed") === "true");
    await unsupportedContext.close();
    check("Zero HTTP, request, console and page errors", errors.length === 0, { errors });
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    process.exitCode = 1;
    console.error(error.stack);
}
finally
{
    await browser?.close();
    await server?.close();
    qa.resourcesClosed = true;
    qa.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: results.length, errors, failure: qa.failure, resourcesClosed: qa.resourcesClosed }));
}
