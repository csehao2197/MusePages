import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const workspace = path.resolve(folder, "../../../..");
const exported = path.join(folder, "out");
const qa = { status: "running", assertions: [], viewports: [], errors: [], visualReviewed: false, resourcesClosed: false };
const pass = (name, evidence) => qa.assertions.push({ name, passed: true, evidence });
let browser;
let service;

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: ${JSON.stringify(sizes)}`);
    pass(label, sizes);
}

async function settle(page)
{
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) => image.decode()));
    });
    await page.waitForTimeout(3000);
}

try
{
    const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
    assert.equal(job.prompt, "625-musician-website");
    const lockPid = Number((await W.text(job.promptLock)).trim());
    const manifest = await W.json(job.stateFile);
    assert.equal(manifest.runId, job.runId);
    assert.equal(manifest.ownedLock.prompt, job.prompt);
    assert.equal(manifest.ownedLock.pid, lockPid);
    process.kill(lockPid, 0);
    pass("live coordinator lock and run identity", { pid: lockPid, runId: job.runId });
    qa.staticDigest = await S.validateStaticOutput(exported, "musician-website", "GPT-6");
    const wav = await readFile(path.join(exported, "audio", "sample-loop.wav"));
    assert.equal(wav.toString("ascii", 0, 4), "RIFF");
    assert.equal(wav.readUInt32LE(24), 44100);
    assert.equal(wav.readUInt16LE(22), 1);
    assert.equal(wav.readUInt16LE(34), 16);
    assert.equal((wav.length - 44) / 88200, 12);
    let power = 0;
    let peak = 0;
    for (let i = 44; i < wav.length; i += 2)
    {
        const value = wav.readInt16LE(i);
        power += value * value;
        peak = Math.max(peak, Math.abs(value));
    }
    const rms = Math.sqrt(power / ((wav.length - 44) / 2)) / 32768;
    assert.ok(rms > .01 && peak < 32767);
    assert.equal(wav.readInt16LE(44), wav.readInt16LE(wav.length - 2));
    pass("original WAV format, audible signal, no clipping and matching seam endpoints", { seconds: 12, sampleRate: 44100, channels: 1, bitDepth: 16, bytes: wav.length, rms, peak });
    service = await startPreviewServer(exported, { workspace });
    assert.equal((await fetch(service.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    pass("owned preview responds and serves only final static subpath", { path: new URL(service.url).pathname, rootSourceStatus: 404 });
    browser = await chromium.launch({ headless: true });

    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 600;
        const label = mobile ? "mobile" : "desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        await context.addInitScript(() =>
        {
            window.__audioAudit = { sources: [], analysers: [], starts: 0 };
            const createSource = AudioContext.prototype.createBufferSource;
            const createAnalyser = AudioContext.prototype.createAnalyser;
            AudioContext.prototype.createBufferSource = function(...args)
            {
                const source = createSource.apply(this, args);
                const start = source.start.bind(source);
                source.start = (...startArgs) =>
                {
                    window.__audioAudit.starts++;
                    return start(...startArgs);
                };
                window.__audioAudit.sources.push(source);
                return source;
            };
            AudioContext.prototype.createAnalyser = function(...args)
            {
                const analyser = createAnalyser.apply(this, args);
                window.__audioAudit.analysers.push(analyser);
                return analyser;
            };
        });
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push(`${label} page: ${error.message}`));
        page.on("console", (message) => { if (message.type() === "error") qa.errors.push(`${label} console: ${message.text()}`); });
        page.on("requestfailed", (request) => qa.errors.push(`${label} request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) qa.errors.push(`${label} HTTP ${response.status()}: ${response.url()}`); });
        const requests = [];
        page.on("request", (request) => requests.push(request.url()));
        const response = await page.goto(service.url);
        assert.equal(response.status(), 200);
        await settle(page);
        assert.equal(await page.locator("h1").innerText(), "MARISOL\nWAVE");
        assert.ok(await page.locator(".hero-play").isVisible());
        const buttonBox = await page.locator(".hero-play").boundingBox();
        assert.ok(buttonBox.y + buttonBox.height < viewport.height);
        assert.equal(await page.evaluate(() => window.__audioAudit.starts), 0);
        assert.equal(await page.locator(".track-row").count(), 6);
        assert.equal(await page.locator(".tour-row").count(), 5);
        assert.equal(await page.locator(".merch-card").count(), 4);
        assert.equal(await page.locator(".press-asset").count(), 5);
        assert.equal(await page.locator("blockquote").count(), 3);
        const visibleText = await page.locator("body").innerText();
        assert.ok(!/[\u3400-\u9fff]/u.test(visibleText));
        assert.ok(!/\b(?:19|20)\d{2}\b/.test(visibleText));
        assert.ok(!requests.some((url) => new URL(url).origin !== new URL(service.url).origin));
        pass(`${label}: meaningful English homepage, content counts, play visible, no autoplay/external requests/calendar years`, { viewport, playButton: buttonBox });
        await noOverflow(page, `${label}: no horizontal overflow before interactions`);
        await page.screenshot({ path: path.join(checks, `${label}.png`) });

        await page.locator(".hero-play").click();
        await page.waitForFunction(() => document.body.classList.contains("is-playing"));
        await page.waitForTimeout(700);
        const audio = await page.evaluate(() =>
        {
            const audit = window.__audioAudit;
            const source = audit.sources.at(-1);
            const analyser = audit.analysers[0];
            const bins = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(bins);
            return { starts: audit.starts, duration: source.buffer.duration, loop: source.loop, context: source.context.state, nonzeroBins: [...bins].filter(Boolean).length, max: Math.max(...bins) };
        });
        assert.equal(audio.duration, 12);
        assert.equal(audio.loop, true);
        assert.equal(audio.context, "running");
        assert.ok(audio.starts >= 1 && audio.nonzeroBins > 0 && audio.max > 0);
        pass(`${label}: user-initiated local Web Audio produces real analyser signal`, audio);
        await page.locator("#player").focus();
        await page.keyboard.press("Space");
        await page.waitForFunction(() => !document.body.classList.contains("is-playing"));
        await page.keyboard.press("ArrowRight");
        const sought = Number(await page.locator("#seek").inputValue());
        assert.ok(sought >= 1);
        await page.keyboard.press("ArrowLeft");
        assert.ok(Number(await page.locator("#seek").inputValue()) < sought);
        await page.locator("#seek").focus();
        await page.keyboard.press("End");
        assert.ok(Number(await page.locator("#seek").inputValue()) > 11);
        await page.locator("#player").focus();
        await page.keyboard.press("Space");
        await page.waitForTimeout(850);
        assert.ok(Number(await page.locator("#seek").inputValue()) < 2);
        await page.keyboard.press("Space");
        await page.locator("#volume").focus();
        await page.keyboard.press("Home");
        assert.equal(await page.locator("#volume-value").textContent(), "0%");
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator("#volume-value").textContent(), "1%");
        await page.locator("#mute").click();
        assert.equal(await page.locator("#volume").inputValue(), "0");
        await page.locator("#mute").click();
        assert.equal(await page.locator("#volume").inputValue(), "1");
        pass(`${label}: keyboard play/pause, bidirectional seeking, real loop wrap, volume and mute`, { soughtSeconds: sought, loopWrappedBelowSeconds: 2 });
        await page.locator(".album-caption").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await page.locator("#player").scrollIntoViewIfNeeded();
        await page.locator("#music").screenshot({ path: path.join(checks, `${label}-music.png`) });

        await page.locator('[data-show="0"]').click();
        await page.locator("#info-dialog").waitFor({ state: "visible" });
        assert.equal(await page.locator("#info-title").textContent(), "New Orleans");
        assert.match(await page.locator("#info-copy").textContent(), /No tickets are sold/);
        await page.keyboard.press("Escape");
        assert.ok(await page.locator('[data-show="2"]').isDisabled());
        await page.locator('[data-show="4"]').click();
        assert.match(await page.locator("#info-copy").textContent(), /imaginary invitation/);
        await page.locator("#info-dialog [data-close]").first().click();
        pass(`${label}: tour information, sold-out state and truthful invitation dialog`, "No booking submission");

        await page.locator('[data-add="slow-static-lp"]').click();
        await page.locator('[data-add="slow-static-lp"]').click();
        await page.locator('[data-add="cassette-digital"]').click();
        assert.equal(await page.locator("#bag-count").textContent(), "3");
        await page.locator("#open-bag").click();
        assert.equal(await page.locator("#bag-total").textContent(), "$70.00");
        await page.locator('[data-slug="slow-static-lp"][data-quantity="-1"]').click();
        assert.equal(await page.locator("#bag-total").textContent(), "$42.00");
        await page.locator('[data-slug="slow-static-lp"][data-quantity="1"]').click();
        assert.equal(await page.locator("#bag-total").textContent(), "$70.00");
        await page.locator('[data-remove="cassette-digital"]').click();
        assert.equal(await page.locator("#bag-total").textContent(), "$56.00");
        await page.keyboard.press("Tab");
        assert.ok(await page.evaluate(() => document.activeElement.closest("#bag-dialog") !== null));
        await page.locator("#bag-dialog").screenshot({ path: path.join(checks, `${label}-bag.png`) });
        await page.keyboard.press("Escape");
        assert.ok(await page.locator("#open-bag").evaluate((element) => element === document.activeElement));
        pass(`${label}: bag addition, quantity, totals, removal, focus containment and Escape return`, { additions: 3, initialTotal: 70, afterRemoval: 56 });

        for (let i = 0; i < 5; i++)
        {
            await page.locator(`[data-press="${i}"]`).click();
            assert.ok(await page.locator("#info-copy").isVisible());
            assert.ok((await page.locator("#info-copy").textContent()).length > 70);
            await page.keyboard.press("Escape");
        }
        pass(`${label}: all five press placeholders open truthful local previews`, { count: 5, downloadsClaimed: false });
        await page.locator("#email").fill("not-an-email");
        await page.locator("#join-form button").click();
        assert.equal(await page.locator("#email").getAttribute("aria-invalid"), "true");
        assert.match(await page.locator("#join-error").textContent(), /valid email/);
        await page.locator("#email").fill("listener@example.test");
        await page.locator("#email").press("Enter");
        assert.ok(await page.locator("#join-success").isVisible());
        const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("marisol-wave:listener")));
        assert.deepEqual(saved, { email: "listener@example.test", joined: true, bag: ["slow-static-lp", "slow-static-lp"] });
        await page.reload();
        await page.waitForSelector("#join-success", { state: "visible" });
        assert.equal(await page.locator("#bag-count").textContent(), "2");
        assert.equal(await page.evaluate(() => window.__audioAudit.starts), 0);
        await page.locator("#forget-email").click();
        assert.equal(await page.locator("#email").inputValue(), "");
        assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem("marisol-wave:listener")).email), "");
        pass(`${label}: invalid/valid keyboard join, local persistence, bag reload, forgotten email and no reload autoplay`, saved);

        if (mobile)
        {
            await page.locator("#open-menu").click();
            await page.locator('#menu-dialog a[href="#tour"]').click();
            assert.equal(await page.locator("#menu-dialog").evaluate((element) => element.open), false);
            assert.equal(new URL(page.url()).hash, "#tour");
            pass("mobile: modal menu navigates and closes", { target: "#tour" });
        }
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.locator("#music").scrollIntoViewIfNeeded();
        const motion = await page.evaluate(() =>
        {
            const bars = [...document.querySelectorAll(".visualizer i")];
            return { heights: bars.map((bar) => bar.getBoundingClientRect().height), animation: getComputedStyle(document.querySelector(".marquee-track")).animationName };
        });
        assert.equal(new Set(motion.heights).size, 1);
        assert.equal(motion.animation, "none");
        pass(`${label}: reduced motion static equal-height visualizer and ticker`, motion);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.evaluate(async () =>
        {
            for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .7)
            {
                scrollTo(0, y);
                await new Promise((resolve) => setTimeout(resolve, 70));
            }
        });
        await page.waitForTimeout(1000);
        assert.ok(await page.locator("img").evaluateAll((images) => images.filter((image) => image.getClientRects().length > 0).every((image) => image.complete && image.naturalWidth > 0)));
        assert.ok(await page.evaluate(() => document.fonts.check('600 20px Oswald') && document.fonts.check('400 20px "Work Sans"')));
        await noOverflow(page, `${label}: no horizontal overflow after interactions`);
        await page.evaluate(() =>
        {
            document.activeElement?.blur();
            scrollTo({ top: 0, behavior: "instant" });
        });
        await page.waitForTimeout(100);
        await page.screenshot({ path: path.join(checks, `${label}-full.png`), fullPage: true });
        assert.ok(!requests.some((url) => new URL(url).origin !== new URL(service.url).origin));
        const audioRequests = requests.filter((url) => url.endsWith(".wav"));
        assert.ok(audioRequests.length > 0 && audioRequests.every((url) => url.endsWith("/audio/sample-loop.wav")));
        pass(`${label}: all displayed local images/fonts load and only bundled WAV requested`, { audioRequests: audioRequests.length, externalRequests: 0, hiddenMobileKeysPhotoExcluded: mobile });
        qa.viewports.push({ ...viewport, deviceScaleFactor: 1, tested: true, screenshot: `${label}.png`, fullPage: `${label}-full.png` });
        await context.close();
    }

    const wide = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await wide.goto(service.url);
    await settle(wide);
    await noOverflow(wide, "wide desktop 1440: no horizontal overflow");
    await wide.screenshot({ path: path.join(checks, "wide-desktop.png") });
    qa.viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1, tested: true, screenshot: "wide-desktop.png" });
    await wide.close();

    const unavailableStorage = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await unavailableStorage.addInitScript(() =>
    {
        Storage.prototype.getItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
        Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "QuotaExceededError"); };
    });
    const fallback = await unavailableStorage.newPage();
    await fallback.goto(service.url);
    await fallback.locator('[data-add="slow-static-lp"]').click();
    assert.equal(await fallback.locator("#bag-count").textContent(), "1");
    await fallback.locator("#email").fill("fallback@example.test");
    await fallback.locator("#email").press("Enter");
    assert.ok(await fallback.locator("#join-success").isVisible());
    assert.match(await fallback.locator("#storage-warning").textContent(), /unavailable/);
    pass("denied localStorage gracefully falls back with truthful visible warning", { bag: 1, localJoinWorks: true });
    await unavailableStorage.close();
    assert.deepEqual(qa.errors, []);
    qa.status = "passed";
}
catch (error)
{
    qa.status = "failed";
    qa.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ status: qa.status, assertions: qa.assertions.length, errors: qa.errors, failure: qa.failure, resourcesClosed: qa.resourcesClosed }));
}
