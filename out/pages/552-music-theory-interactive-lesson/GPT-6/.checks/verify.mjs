import path from "node:path";
import {fileURLToPath} from "node:url";
import assert from "node:assert/strict";
import {readFile, readdir} from "node:fs/promises";
import {chromium} from "@playwright/test";
import {startPreviewServer} from "../../../../../src/workflows/script/generate-preview.mjs";
import {WorkspaceFiles, StaticHomepage} from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(folder, "out");
const checks = path.join(folder, ".checks");
const results = [];
const errors = [];
let browser;
let service;
const qa = {passed: false, visualReviewed: false, viewports: [], assertions: results, errors, resourcesClosed: false};
async function test(name, callback)
{
    await callback();
    results.push({name, passed: true});
    console.log(`PASS ${name}`);
}
async function noOverflow(page)
{
    const measure = await page.evaluate(() => ({width: innerWidth, scroll: document.documentElement.scrollWidth}));
    assert.ok(measure.scroll <= measure.width, JSON.stringify(measure));
}
async function ready(page)
{
    await page.goto(service.url, {waitUntil: "networkidle"});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(650);
    assert.equal(await page.locator("h1").innerText(), "Press a key.\nHear why\nit works.");
    await noOverflow(page);
}
function watch(page)
{
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (["error", "warning"].includes(message.type())) errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`);
    });
}
try
{
    const digest = await StaticHomepage.validateStaticOutput(output, "music-theory-interactive-lesson", "GPT-6");
    qa.staticDigest = digest;
    service = await startPreviewServer(output, {workspace});
    assert.equal((await fetch(service.url)).status, 200);
    browser = await chromium.launch({headless: true});
    const desktop = await browser.newContext({viewport: {width: 1200, height: 900}, deviceScaleFactor: 1});
    await desktop.addInitScript(() =>
    {
        const Native = window.AudioContext;
        window.audioProbe = {created: 0, starts: [], nodeTypes: []};
        window.audioNodes = {gains: [], filters: []};
        window.AudioContext = class extends Native
        {
            constructor(...args)
            {
                super(...args);
                window.audioProbe.created++;
            }
            createOscillator()
            {
                const oscillator = super.createOscillator();
                const start = oscillator.start.bind(oscillator);
                oscillator.start = (...args) =>
                {
                    window.audioProbe.starts.push({frequency: oscillator.frequency.value, type: oscillator.type});
                    return start(...args);
                };
                return oscillator;
            }
            createGain()
            {
                const gain = super.createGain();
                window.audioNodes.gains.push(gain);
                return gain;
            }
            createBiquadFilter()
            {
                const filter = super.createBiquadFilter();
                window.audioNodes.filters.push(filter);
                return filter;
            }
            createDynamicsCompressor()
            {
                const compressor = super.createDynamicsCompressor();
                const analyser = super.createAnalyser();
                const silent = super.createGain();
                silent.gain.value = 0;
                compressor.connect(analyser).connect(silent).connect(this.destination);
                window.audioAnalyser = analyser;
                return compressor;
            }
        };
    });
    const page = await desktop.newPage();
    watch(page);
    await test("Desktop final-subpath HTTP, self-hosted resources, nonblank and zero initial overflow", async () =>
    {
        await ready(page);
        qa.viewports.push({width: 1200, height: 900, dpr: 1, overflowBefore: false});
        assert.equal(await page.evaluate(() => window.audioProbe.created), 0);
        assert.equal(await page.locator(".piano").count(), 5);
        assert.equal(await page.locator('[data-piano="hero"]').count(), 24);
        assert.ok(await page.locator(".hero .piano").evaluate((el) => el.getBoundingClientRect().bottom <= 900));
        const fonts = await page.evaluate(() => ["Unbounded", "Figtree", "JetBrains Mono"].map((name) => document.fonts.check(`16px "${name}"`)));
        assert.deepEqual(fonts, [true, true, true]);
        await page.screenshot({path: path.join(checks, "desktop.png")});
    });
    await test("Keyboard A4 genuinely synthesizes 440/880 Hz, nonzero waveform, lazy audio and release", async () =>
    {
        await page.keyboard.down("h");
        await page.waitForTimeout(350);
        const actual = await page.evaluate(() =>
        {
            const samples = new Float32Array(window.audioAnalyser.fftSize);
            window.audioAnalyser.getFloatTimeDomainData(samples);
            return {audio: window.lesson.snapshot().audio, starts: window.audioProbe.starts, max: Math.max(...samples.map(Math.abs)), active: window.lesson.snapshot().activeNotes};
        });
        assert.equal(actual.audio.created, true);
        assert.equal(actual.audio.state, "running");
        assert.ok(actual.starts.some((v) => v.type === "triangle" && Math.abs(v.frequency - 440) < 0.01));
        assert.ok(actual.starts.some((v) => v.type === "sine" && Math.abs(v.frequency - 880) < 0.01));
        assert.ok(actual.max > 0.0001, JSON.stringify(actual));
        const graph = await page.evaluate(() => ({filters: window.audioNodes.filters.map((f) => ({type: f.type, frequency: f.frequency.value, q: f.Q.value})), gains: window.audioNodes.gains.map((g) => g.gain.value)}));
        assert.deepEqual(graph.filters, [{type: "lowpass", frequency: 3200, q: Math.fround(0.6)}]);
        assert.ok(graph.gains.some((gain) => Math.abs(gain - 0.7) < 0.001));
        qa.audioEvidence = {sampleRate: actual.audio.sampleRate, waveformPeak: actual.max, oscillatorFrequencies: actual.starts, graph};
        assert.deepEqual(actual.active, [69]);
        await page.keyboard.up("h");
        assert.deepEqual(await page.evaluate(() => window.lesson.snapshot().activeNotes), []);
        assert.equal(await page.locator("#hero-readout").innerText(), "A4. Now press another key.");
    });
    await test("Hero intervals, keyboard octave switches, repeated notes and focused Enter", async () =>
    {
        await page.keyboard.press("a");
        await page.keyboard.press("g");
        assert.equal(await page.locator("#hero-readout").innerText(), "C4 to G4: perfect fifth, 7 half steps.");
        await page.keyboard.press("g");
        assert.equal(await page.locator("#hero-readout").innerText(), "G4 again: same note.");
        await page.keyboard.press("x");
        await page.keyboard.press("a");
        assert.match(await page.locator("#hero-readout").innerText(), /C5/);
        await page.keyboard.press("z");
        const e = page.locator('[data-piano="hero"][data-midi="64"]');
        await e.focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.evaluate(() => window.lesson.snapshot().selectedKey), 4);
        const text = await page.evaluate(() => window.lesson.theory.intervalDescription(60, 79));
        assert.match(text, /perfect fifth plus an octave, 19 half steps/);
    });
    await test("Real mouse glissando updates notes and releases cleanly", async () =>
    {
        const first = await page.locator('[data-piano="hero"][data-midi="60"]').boundingBox();
        const second = await page.locator('[data-piano="hero"][data-midi="62"]').boundingBox();
        await page.mouse.move(first.x + first.width / 2, first.y + first.height - 35);
        await page.mouse.down();
        assert.ok((await page.evaluate(() => window.lesson.snapshot().activeNotes)).includes(60));
        await page.mouse.move(second.x + second.width / 2, second.y + second.height - 35);
        const active = await page.evaluate(() => window.lesson.snapshot().activeNotes);
        assert.ok(active.includes(62) && !active.includes(60));
        await page.mouse.up();
        await page.waitForTimeout(1000);
        assert.deepEqual(await page.evaluate(() => window.lesson.snapshot().activeNotes), []);
    });
    await test("Ten-voice polyphony cap steals the oldest and multi-pointer cancellation leaves no stuck sound", async () =>
    {
        await page.evaluate(() =>
        {
            for (let i = 0; i < 12; i++)
            {
                document.querySelector(`[data-piano="hero"][data-midi="${60 + i}"]`).dispatchEvent(new PointerEvent("pointerdown", {pointerId: 500 + i, bubbles: true, button: 0}));
            }
        });
        assert.equal(await page.evaluate(() => window.lesson.snapshot().audio.voices), 10);
        const notes = await page.evaluate(() => window.lesson.snapshot().activeNotes);
        assert.equal(notes.length, 10);
        assert.ok(!notes.includes(60) && !notes.includes(61));
        await page.evaluate(() =>
        {
            for (let i = 0; i < 12; i++) document.dispatchEvent(new PointerEvent("pointercancel", {pointerId: 500 + i, bubbles: true}));
        });
        assert.deepEqual(await page.evaluate(() => window.lesson.snapshot().activeNotes), []);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().audio.voices), 0);
    });
    await test("Interval selection plays actual pair, chapter piano changes root without rotating key, win earned only by fifth", async () =>
    {
        await page.locator('[data-action="interval"][data-steps="4"]').click();
        assert.equal(await page.evaluate(() => window.lesson.snapshot().interval.semitones), 4);
        await page.waitForTimeout(2000);
        const keyBefore = await page.evaluate(() => window.lesson.snapshot().selectedKey);
        const c = page.locator('[data-piano="intervals"][data-midi="60"]');
        await c.scrollIntoViewIfNeeded();
        await c.click({position: {x: 10, y: 120}});
        await page.locator('[data-piano="intervals"][data-midi="67"]').click({position: {x: 10, y: 120}});
        assert.equal(await page.evaluate(() => window.lesson.snapshot().selectedKey), keyBefore);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().interval.rootMidi), 67);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().wins[0]), true);
        assert.match(await page.locator('[data-win="0"]').innerText(), /C4 up to G4/);
        await noOverflow(page);
    });
    await test("Circle keyboard rotation, exact A signature, spelled scale and earned win", async () =>
    {
        const circle = page.locator('[data-circle-control="chapter"]');
        await circle.scrollIntoViewIfNeeded();
        await circle.focus();
        const selected = await page.evaluate(() => window.lesson.snapshot().selectedKey);
        for (let i = 0; i < (3 - selected + 12) % 12; i++) await page.keyboard.press("ArrowRight");
        assert.equal(await circle.getAttribute("aria-valuetext"), "A major, 3 sharps");
        assert.match(await page.locator("#circle-info").innerText(), /F# C# G#/);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().wins[1]), true);
        await page.locator('#circle-info [data-action="scale"]').click();
        await page.waitForTimeout(250);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().lastEvent.label), "A major scale");
        await page.waitForTimeout(1800);
    });
    await test("Circle drag and wedge tap keep keyboard and theory linked", async () =>
    {
        const circle = page.locator('[data-circle-control="chapter"]');
        const box = await circle.boundingBox();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.06);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.94, box.y + box.height / 2, {steps: 8});
        await page.mouse.up();
        assert.notEqual(await page.evaluate(() => window.lesson.snapshot().selectedKey), 3);
        await page.locator('[data-circle="chapter"] [data-wedge="0"] .major-wedge').click({force: true});
        await page.waitForTimeout(700);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().selectedKey), 0);
    });
    await test("Chord quality/root linkage, real major-to-minor win and enharmonic degree spelling", async () =>
    {
        await page.locator('[data-action="root"][data-note="C"]').click();
        await page.locator('[data-action="quality"][data-quality="major"]').click();
        await page.locator('[data-action="quality"][data-quality="minor"]').click();
        assert.equal(await page.evaluate(() => window.lesson.snapshot().wins[2]), true);
        assert.deepEqual(await page.evaluate(() => window.lesson.theory.chord("C", "minor").names), ["C", "Eb", "G"]);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().selectedKey), 9);
        await page.locator('[data-action="root"][data-note="Eb"]').click();
        await page.locator('[data-action="quality"][data-quality="diminished"]').click();
        assert.deepEqual(await page.evaluate(() => window.lesson.theory.chord("Eb", "diminished").names), ["Eb", "Gb", "Bbb"]);
        assert.match(await page.locator("#chord-result").innerText(), /Bbb/);
        assert.deepEqual(await page.evaluate(() => window.lesson.theory.chord("F#", "major7").names), ["F#", "A#", "C#", "E#"]);
        await noOverflow(page);
    });
    await test("All nine chord qualities, diatonic chips preserve selected key and progression finishes correctly", async () =>
    {
        for (const id of await page.evaluate(() => window.lesson.content.qualities.map((q) => q.id)))
        {
            await page.locator(`[data-action="quality"][data-quality="${id}"]`).click();
            assert.equal(await page.evaluate(() => window.lesson.snapshot().chord.quality), id);
        }
        await page.locator('#circle-info [data-action="diatonic"][data-degree="4"]').click();
        const key = await page.evaluate(() => window.lesson.snapshot().selectedKey);
        const expected = await page.evaluate(() =>
        {
            const snapshot = window.lesson.snapshot();
            return window.lesson.content;
        });
        assert.ok(expected.qualities.length === 9);
        await page.locator('[data-action="progression"][data-progression="0"]').click();
        await page.waitForTimeout(3300);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().selectedKey), key);
        const snapshot = await page.evaluate(() => window.lesson.snapshot());
        assert.equal(snapshot.chord.quality, "major");
        assert.match(snapshot.lastEvent.label, /major chord/);
    });
    await test("Quiz silent reporting, mute control, no answer leakage and exactly eight rounds scored", async () =>
    {
        await page.locator('[data-action="start-quiz"]').click();
        assert.equal(await page.locator("#quiz-piano").isVisible(), false);
        await page.locator('[data-action="quiz-play"]').click();
        await page.waitForTimeout(200);
        assert.equal(await page.locator("#dock-readout").innerText(), "Quiz: listen and answer");
        assert.equal(await page.locator(".mini-piano .lit").count(), 0);
        assert.deepEqual(await page.evaluate(() => window.lesson.snapshot().activeNotes), []);
        await page.locator('.topbar [data-action="mute"]').click();
        await page.waitForTimeout(30);
        const mutedGain = await page.evaluate(() => window.audioNodes.gains[0].gain.value);
        assert.ok(mutedGain < 0.001);
        assert.equal(await page.locator('[data-action="quiz-play"]').count(), 0);
        assert.ok(await page.getByRole("button", {name: "Turn sound on", exact: true}).isVisible());
        await page.getByRole("button", {name: "Turn sound on", exact: true}).click();
        await page.waitForTimeout(30);
        assert.ok(Math.abs(await page.evaluate(() => window.audioNodes.gains[0].gain.value) - 0.7) < 0.001);
        for (let i = 0; i < 8; i++)
        {
            const round = await page.evaluate(() =>
            {
                const q = window.lesson.snapshot().quiz;
                return q.rounds[q.index];
            });
            const correct = round.options.indexOf(round.answer);
            const chosen = i === 0 ? (correct + 1) % 4 : correct;
            await page.locator(`[data-action="answer"][data-answer="${chosen}"]`).click();
            assert.equal(await page.locator("#quiz-piano").isVisible(), true);
            assert.ok(await page.locator(".answer-grid .correct").isVisible());
            if (i === 0) assert.ok(await page.locator(".answer-grid .wrong").isVisible());
            const score = await page.evaluate(() => window.lesson.snapshot().quiz.score);
            assert.equal(score, Math.max(0, i));
            await page.locator('[data-action="next-quiz"]').click();
        }
        const q = await page.evaluate(() => window.lesson.snapshot().quiz);
        assert.equal(q.finished, true);
        assert.equal(q.score, 7);
        assert.equal(q.answers.length, 8);
        assert.equal(await page.locator(".missed-rounds button").count(), 1);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().wins[3]), true);
        assert.equal(await page.locator("#wins-count").innerText(), "4/4 wins");
        await page.locator('[data-action="missed"]').click();
        await page.locator('[data-action="start-quiz"]').click();
        assert.equal(await page.evaluate(() => window.lesson.snapshot().quiz.score), 0);
        assert.equal(await page.evaluate(() => window.lesson.snapshot().quiz.index), 0);
        await noOverflow(page);
    });
    await test("Quiz zero/perfect score boundaries, replay/reset, random roots and single scoring per answer", async () =>
    {
        for (const target of [0, 8])
        {
            const rounds = await page.evaluate(() => window.lesson.snapshot().quiz.rounds);
            assert.equal(new Set(rounds.map((r) => r.answer)).size, 8);
            assert.ok(rounds.every((r) => r.root >= 60 && r.root <= 67));
            for (let i = 0; i < 8; i++)
            {
                const round = await page.evaluate(() =>
                {
                    const q = window.lesson.snapshot().quiz;
                    return q.rounds[q.index];
                });
                const correct = round.options.indexOf(round.answer);
                await page.locator(`[data-action="answer"][data-answer="${target === 8 ? correct : (correct + 1) % 4}"]`).click();
                assert.equal(await page.locator('.answer-grid button:not([disabled])').count(), 0);
                await page.locator('[data-action="next-quiz"]').click();
            }
            assert.equal(await page.evaluate(() => window.lesson.snapshot().quiz.score), target);
            assert.equal(await page.locator(".quiz-panel h3").innerText(), target === 0 ? "Warming up" : "Sharp ears");
            assert.equal(await page.locator(".missed-rounds button").count(), 8 - target);
            await page.locator('[data-action="start-quiz"]').click();
        }
    });
    await test("FAQ native disclosure, anchored navigation and no desktop overflow after exercise", async () =>
    {
        await page.locator("details").nth(1).locator("summary").click();
        assert.ok(await page.locator("details").nth(1).getAttribute("open") !== null);
        await page.locator(".footer nav a").first().click();
        assert.ok(page.url().endsWith("#intervals"));
        await noOverflow(page);
        qa.viewports[0].overflowAfter = false;
    });
    const mobileContext = await browser.newContext({viewport: {width: 390, height: 844}, deviceScaleFactor: 1, isMobile: true, hasTouch: true});
    const mobile = await mobileContext.newPage();
    watch(mobile);
    await test("Mobile 390x844 genuine first screen, 24 touch keys in two rows, readable and overflow-free", async () =>
    {
        await ready(mobile);
        qa.viewports.push({width: 390, height: 844, dpr: 1, overflowBefore: false});
        assert.ok(await mobile.locator(".hero .piano").evaluate((el) => el.getBoundingClientRect().bottom <= 844));
        await mobile.screenshot({path: path.join(checks, "mobile.png")});
        const key = await mobile.locator('[data-piano="hero"][data-midi="60"]').boundingBox();
        await mobile.touchscreen.tap(key.x + key.width / 2, key.y + key.height - 25);
        assert.equal(await mobile.evaluate(() => window.lesson.snapshot().selectedKey), 0);
        assert.match(await mobile.locator("#hero-readout").innerText(), /C4/);
    });
    await test("Mobile multi-pointer chord, release/cancel, circle arrows, interval/chord/quiz actions", async () =>
    {
        await mobile.evaluate(() =>
        {
            for (const [id, midi] of [[101, 60], [102, 64]])
            {
                const key = document.querySelector(`[data-piano="hero"][data-midi="${midi}"]`);
                key.dispatchEvent(new PointerEvent("pointerdown", {pointerId: id, pointerType: "touch", bubbles: true, button: 0}));
            }
        });
        const active = await mobile.evaluate(() => window.lesson.snapshot().activeNotes);
        assert.ok(active.includes(60) && active.includes(64));
        await mobile.evaluate(() =>
        {
            document.dispatchEvent(new PointerEvent("pointerup", {pointerId: 101, bubbles: true}));
            document.dispatchEvent(new PointerEvent("pointercancel", {pointerId: 102, bubbles: true}));
        });
        assert.deepEqual(await mobile.evaluate(() => window.lesson.snapshot().activeNotes), []);
        const mobileCircle = mobile.locator('[data-circle-control="chapter"]');
        await mobileCircle.scrollIntoViewIfNeeded();
        await mobileCircle.focus();
        const mobileKeyBefore = await mobile.evaluate(() => window.lesson.snapshot().selectedKey);
        await mobile.keyboard.press("ArrowRight");
        assert.equal(await mobile.evaluate(() => window.lesson.snapshot().selectedKey), (mobileKeyBefore + 1) % 12);
        await mobile.locator('[data-action="interval"][data-steps="7"]').tap();
        assert.equal(await mobile.evaluate(() => window.lesson.snapshot().interval.semitones), 7);
        await mobile.locator('[data-action="root"][data-note="Db"]').tap();
        await mobile.locator('[data-action="quality"][data-quality="major7"]').tap();
        assert.match(await mobile.locator("#chord-result").innerText(), /Db major 7th/);
        await mobile.locator('[data-action="start-quiz"]').tap();
        await mobile.locator('[data-action="quiz-play"]').tap();
        await mobile.locator('[data-action="answer"][data-answer="0"]').tap();
        assert.ok(await mobile.locator("#quiz-piano").isVisible());
        await noOverflow(mobile);
        qa.viewports[1].overflowAfter = false;
        await mobile.screenshot({path: path.join(checks, "mobile-exercise.png"), fullPage: false});
    });
    await test("1440x900 and narrow/tablet widths, reduced-motion support, loaded images and no public private files", async () =>
    {
        const responsive = await browser.newPage({viewport: {width: 1440, height: 900}, reducedMotion: "reduce"});
        watch(responsive);
        await ready(responsive);
        qa.viewports.push({width: 1440, height: 900, dpr: 1, overflowBefore: false, reducedMotion: true});
        assert.equal(await responsive.locator(".rotor").first().evaluate((el) => getComputedStyle(el).transitionDuration), "0s");
        for (const width of [320, 768])
        {
            await responsive.setViewportSize({width, height: 900});
            await noOverflow(responsive);
            qa.viewports.push({width, height: 900, dpr: 1, overflowBefore: false});
        }
        for (const image of await responsive.locator("img").all())
        {
            await image.scrollIntoViewIfNeeded();
            await image.evaluate((img) => img.decode());
        }
        const images = await responsive.locator("img").evaluateAll((imgs) => imgs.map((img) => ({src: img.src, loaded: img.complete && img.naturalWidth > 0})));
        assert.ok(images.every((img) => img.loaded), JSON.stringify(images));
        const files = await readdir(output, {recursive: true});
        assert.ok(!files.some((file) => /(?:metadata|package|README|ASSETS|checks|config|\.map)/i.test(file)));
        let bytes = 0;
        for (const file of files)
        {
            if (/\.[a-z0-9]+$/i.test(file) || /LICENSE$/.test(file)) bytes += (await readFile(path.join(output, file))).length;
        }
        assert.ok(bytes < 20 * 1024 * 1024);
        qa.staticBytes = bytes;
    });
    assert.deepEqual(errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    qa.resourcesClosed = true;
    qa.recordedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
}
