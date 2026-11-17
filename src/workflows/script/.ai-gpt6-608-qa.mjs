import assert from "node:assert/strict";
import { readFile, cp, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage as S } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "608-music-streaming-app-with-lyrics");
const manifest = await W.json(job.stateFile);
const lock = Number((await W.text(job.promptLock)).trim());
assert.equal(manifest.ownedLock.pid, lock);
assert.equal(manifest.ownedLock.prompt, job.prompt);
assert.equal(manifest.activePrompt, job.prompt);
process.kill(lock, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const checks = path.join(folder, ".checks");
await mkdir(checks, { recursive: true });
const metadataFile = path.join(folder, "metadata.json");
const metadata = await W.json(metadataFile);
assert.equal(metadata.modelId, "gpt-6.1-sol");
const source = await S.checkSource(folder);
assert.equal(source, "html");
metadata.generated = true;
await W.saveJson(metadataFile, metadata);
await mkdir(exported, { recursive: true });
for (const name of ["index.html", "styles.css", "app.js", "content.js", "icons.js", "LICENSE"])
{
    await cp(path.join(folder, name), path.join(exported, name));
}
await cp(path.join(folder, "public"), path.join(exported, "public"), { recursive: true });
const digest = await S.validateStaticOutput(exported, "music-streaming-app-with-lyrics", "GPT-6");
const tests = [];
const errors = [];
const qa =
{
    prompt: job.prompt, modelId: job.modelId, passed: false, visualReviewed: false,
    sourceCheck: source, staticDigest: digest, tests, errors,
    viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 1440, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
    screenshots: { desktop: path.join(checks, "desktop.png"), mobile: path.join(checks, "mobile.png") },
    resourcesClosed: false, generatedAt: new Date().toISOString()
};
const { tracks } = await import(new URL(`../../../out/pages/${job.prompt}/GPT-6/content.js`, import.meta.url));
const hash = data => createHash("sha256").update(data).digest("hex");
let server;
let browser;
try
{
    const audioRecords = [];
    for (const track of tracks)
    {
        const wav = await readFile(path.join(folder, "public", "audio", `${track.file}.wav`));
        assert.equal(wav.subarray(0, 4).toString(), "RIFF");
        assert.equal(wav.subarray(8, 12).toString(), "WAVE");
        assert.equal(wav.readUInt32LE(24), 22050);
        assert.equal(wav.readUInt16LE(22), 1);
        assert.equal(wav.readUInt16LE(34), 16);
        assert.equal(wav.readUInt32LE(40), 22050 * 18 * 2);
        let peak = 0;
        let sum = 0;
        for (let i = 44; i < wav.length; i += 2)
        {
            const value = wav.readInt16LE(i) / 32768;
            peak = Math.max(peak, Math.abs(value));
            sum += value * value;
        }
        assert.ok(peak <= 0.78 && peak > 0.1);
        assert.ok(Math.sqrt(sum / (22050 * 18)) > 0.02);
        assert.equal(wav.readInt16LE(44), 0);
        assert.equal(wav.readInt16LE(wav.length - 2), 0);
        audioRecords.push({ title: track.title, file: `${track.file}.wav`, bytes: wav.length, sha256: hash(wav), peak, rms: Math.sqrt(sum / (22050 * 18)) });
    }
    assert.equal(new Set(audioRecords.map(r => r.sha256)).size, 6);
    assert.ok(audioRecords.reduce((sum, r) => sum + r.bytes, 0) < 5000000);
    execFileSync(process.execPath, [path.join(folder, "scripts", "generate-audio.mjs")], { stdio: "pipe" });
    for (const record of audioRecords) assert.equal(hash(await readFile(path.join(folder, "public", "audio", record.file))), record.sha256);
    qa.audio = audioRecords;
    tests.push("Six unique non-silent valid PCM WAVs: 18 seconds, 22050 Hz mono 16-bit, peaks below 0.78, edge fades, total below 5 MB; repeated synthesis byte-identical.");
    async function total(directory)
    {
        let size = 0;
        for (const entry of await readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            size += entry.isDirectory() ? await total(file) : (await stat(file)).size;
        }
        return size;
    }
    qa.staticBytes = await total(exported);
    assert.ok(qa.staticBytes < 20000000);
    server = await startPreviewServer(exported, { workspace: root });
    const readiness = await fetch(server.url);
    assert.equal(readiness.status, 200);
    assert.match(server.url, /\/pages\/music-streaming-app-with-lyrics\/GPT-6\/index\.html$/);
    qa.mount = new URL(server.url).pathname;
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    function monitor(page)
    {
        page.on("pageerror", error => errors.push(`page: ${error.message}`));
        page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
        page.on("requestfailed", request => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response => { if (response.status() >= 400) errors.push(`http: ${response.status()} ${response.url()}`); });
        page.on("request", request =>
        {
            if (!request.url().startsWith("blob:") && new URL(request.url()).origin !== new URL(server.url).origin) errors.push(`external: ${request.url()}`);
        });
    }
    monitor(page);
    const click = async selector =>
    {
        await page.locator(selector).first().click();
        await page.waitForTimeout(70);
    };
    const overflow = async label =>
    {
        const value = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(value.scroll <= value.viewport + 1, `${label} horizontal overflow ${JSON.stringify(value)}`);
        tests.push(`${label}: no page-level horizontal overflow.`);
    };
    const waitAudio = async () => { await page.waitForFunction(() => document.querySelector("audio").readyState >= 2); };
    assert.equal((await page.goto(server.url, { waitUntil: "networkidle" })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveText("Paper After Dark");
    await expect(page.locator(".featured .cover")).toHaveCount(4);
    assert.ok(await page.locator("main").innerText().then(text => text.length > 700));
    assert.equal(await page.locator("audio").evaluate(a => a.paused && a.currentTime === 0), true);
    assert.equal(await page.locator("audio").count(), 1);
    await overflow("Desktop Library initial");
    await page.screenshot({ path: qa.screenshots.desktop });
    tests.push("Successful final-subpath HTTP; meaningful Library first paint, local fonts/covers, one paused audio element, no autoplay; desktop screenshot captured.");

    await page.evaluate(() =>
    {
        const audio = document.querySelector("audio");
        const context = new AudioContext();
        const source = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();
        source.connect(analyser);
        analyser.connect(context.destination);
        window.qaAudio = { context, analyser };
    });
    await click('.featured [data-action="playlist"]');
    await page.evaluate(() => window.qaAudio.context.resume());
    await page.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime > 0.3);
    await page.waitForFunction(() =>
    {
        const buffer = new Uint8Array(window.qaAudio.analyser.fftSize);
        window.qaAudio.analyser.getByteTimeDomainData(buffer);
        return buffer.some(value => Math.abs(value - 128) > 2);
    });
    tests.push("User-initiated playlist Play controls real HTML audio; decoded nonzero Web Audio analyser samples and advancing currentTime verified (not a synthetic player state).");
    const before = await page.locator("audio").evaluate(a => a.currentTime);
    await page.locator("#sidebar a[href='#/charts']").click();
    await expect(page.locator("h1")).toHaveText("Six songs. One very subjective chart.");
    assert.equal(await page.locator("audio").evaluate(a => a.paused), false);
    assert.ok(await page.locator("audio").evaluate(a => a.currentTime) >= before);
    await overflow("Desktop Charts during playback");
    await page.locator("#sidebar a[href='#/now-playing']").click();
    await expect(page.locator("h1")).toHaveText("Window Weather");
    assert.equal(await page.locator("audio").evaluate(a => a.paused), false);
    await click('.stage-controls [data-action="toggle"]');
    assert.equal(await page.locator("audio").evaluate(a => a.paused), true);
    await click('.lyric[data-index="4"]');
    assert.ok(Math.abs(await page.locator("audio").evaluate(a => a.currentTime) - 12) < 0.15);
    await expect(page.locator('.lyric[data-index="4"]')).toHaveClass(/active/);
    const scrollBefore = await page.evaluate(() => scrollY);
    await click('.lyric[data-index="1"]');
    assert.equal(await page.evaluate(() => scrollY), scrollBefore);
    await page.locator(".stage-seek input").focus();
    const seekBefore = await page.locator("audio").evaluate(a => a.currentTime);
    await page.keyboard.press("ArrowRight");
    assert.ok(await page.locator("audio").evaluate(a => a.currentTime) > seekBefore);
    await page.locator(".stage-seek input").evaluate(node =>
    {
        node.value = "2.8";
        node.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await click('.stage-controls [data-action="toggle"]');
    await page.waitForFunction(() => document.querySelector('.lyric[data-index="1"]').classList.contains("active"));
    await click('.stage-controls [data-action="toggle"]');
    await click('[data-action="toggle-lyrics"]');
    await expect(page.locator(".lyrics-off")).toBeVisible();
    await click('.lyrics-off [data-action="toggle-lyrics"]');
    await expect(page.locator(".lyrics")).toBeVisible();
    await click(".sound summary");
    await page.locator(".sound [data-volume]").fill("0.3");
    assert.ok(Math.abs(await page.locator("audio").evaluate(a => a.volume) - 0.3) < 0.001);
    await click(".sound [data-action='mute']");
    assert.equal(await page.locator("audio").evaluate(a => a.muted), true);
    await click(".sound [data-action='mute']");
    assert.equal(await page.locator("audio").evaluate(a => a.muted), false);
    await overflow("Desktop Now Playing after lyrics, keyboard seek and sound controls");
    await click(".sound summary");
    await page.waitForTimeout(1850);
    await page.screenshot({ path: path.join(checks, "now-playing-desktop.png") });
    tests.push("Continuous playback across all three hash routes; lyric seek to exact 12s, currentTime-derived line activation, natural 3s line boundary, no page scroll on lyric click, keyboard range seek, lyrics replacement, real mute and volume verified.");

    await page.locator("#comment-body").fill("A folded paper moon beside this local window.");
    await page.locator("#comment-form button[type='submit']").click();
    await expect(page.locator(".comment").filter({ hasText: "A folded paper moon beside this local window." })).toBeVisible();
    await expect(page.locator(".local-post")).toHaveText("Posted on this device");
    const firstLike = page.locator('[data-action="like"]').first();
    const likes = Number(await firstLike.locator("span").innerText());
    await firstLike.click();
    assert.equal(Number(await page.locator('[data-action="like"]').first().locator("span").innerText()), likes + 1);
    await expect(page.locator('[data-action="like"]').first()).toHaveAttribute("aria-pressed", "true");
    await page.locator("#sort").selectOption("likes");
    await page.locator("#comment-body").fill(" ".repeat(10));
    await page.locator("#comment-form button").click();
    await expect(page.locator("#comment-error")).toHaveText(/1–240/);
    await page.locator("#comment-body").fill("x".repeat(240));
    await expect(page.locator("#character-count")).toHaveText("240");
    await page.locator("#comment-body").fill("");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(".local-post")).toHaveCount(1);
    await expect(page.locator('[data-action="like"]').first()).toHaveAttribute("aria-pressed", "true");
    assert.equal(await page.locator("audio").evaluate(a => a.paused && a.currentTime === 0), true);
    await click('[data-action="delete-comment"]');
    await expect(page.locator(".local-post")).toHaveCount(0);
    tests.push("Local comment publication, count, 240-character limit, whitespace validation, like +1/persistence, sorting, deletion, and reload paused at zero verified.");

    await click('#topbar [data-action="queue"]');
    await expect(page.locator("#queue-dialog")).toBeVisible();
    assert.equal(await page.locator(".queue-row").count(), 5);
    await click('[data-action="queue-next"][data-id="the-last-lantern"]');
    await expect(page.locator(".queue-row").first()).toContainText("The Last Lantern");
    await click('[data-action="queue-down"][data-id="the-last-lantern"]');
    await expect(page.locator(".queue-row").first()).toContainText("Apricot Receiver");
    await click('[data-action="queue-up"][data-id="the-last-lantern"]');
    await expect(page.locator(".queue-row").first()).toContainText("The Last Lantern");
    await click('[data-action="queue-remove"][data-id="small-orbits"]');
    await expect(page.locator(".queue-row")).toHaveCount(4);
    await click('[data-action="restore"]');
    await expect(page.locator(".queue-row")).toHaveCount(5);
    await click('[data-action="restore"]');
    await expect(page.locator(".queue-row")).toHaveCount(5);
    for (let i = 0; i < 28; i++) await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.querySelector("#queue-dialog").contains(document.activeElement)), true);
    await page.keyboard.press("Escape");
    await expect(page.locator("#queue-dialog")).not.toBeVisible();
    await expect(page.locator('#topbar [data-action="queue"]')).toBeFocused();
    await click('#topbar [data-action="queue"]');
    await click('#queue-dialog [data-action="clear"]');
    await click('[data-action="cancel-confirm"]');
    await expect(page.locator(".queue-row")).toHaveCount(5);
    await click('#queue-dialog [data-action="clear"]');
    await click('[data-action="confirm"]');
    await expect(page.locator(".queue-empty")).toBeVisible();
    await click('[data-action="restore"]');
    await click('[data-action="close-queue"]');
    tests.push("Actual queue Play next/reorder/up/down/remove/restore and duplicate prevention; confirmed clear/cancel; native modal focus trap, Escape dismissal and opener focus return verified.");

    await page.locator("#search").fill("aDa");
    await expect(page.locator("#search-results button")).toHaveCount(1);
    await page.locator("#search").press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.locator("h1")).toHaveText("Harbor in Blue");
    assert.equal(await page.locator("audio").evaluate(a => a.paused), true);
    await waitAudio();
    assert.ok((await page.locator("audio").evaluate(a => a.dataset.source)).endsWith("blue-hour-radio.wav"));
    await page.locator("#search").fill("quiet orbit");
    await expect(page.locator("#search-results")).toContainText("The Quiet Orbit");
    await page.locator("#search").press("Escape");
    await expect(page.locator("#search-results")).not.toBeVisible();
    await page.locator("#sidebar nav a[href='#/']").click();
    await click('.featured [data-action="save"]');
    await expect(page.locator('.featured [data-action="save"]')).toHaveAttribute("aria-pressed", "true");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator('.featured [data-action="save"]')).toHaveAttribute("aria-pressed", "true");
    assert.equal(await page.locator("audio").evaluate(a => a.paused && a.currentTime === 0), true);
    await page.evaluate(() => { location.hash = "/unknown"; });
    await expect(page).toHaveURL(/#\/$/);
    await page.locator("#sidebar a[href='#/charts']").click();
    await click('[data-action="chart-info"]');
    await expect(page.locator("#confirm-dialog")).toContainText("fixed sample data");
    await page.keyboard.press("Escape");
    await page.goBack();
    await expect(page.locator("h1")).toHaveText("Paper After Dark");
    await page.goForward();
    await expect(page.locator("h1")).toHaveText("Six songs. One very subjective chart.");
    tests.push("Case-insensitive artist and playlist search, keyboard result selection, exact matching WAV, saved collection persistence, unknown hash fallback, back/forward and chart disclosure verified.");

    await click('[data-action="chart-play"]');
    await waitAudio();
    await page.locator("audio").evaluate(a => { a.currentTime = 17.65; });
    await page.waitForFunction(() => document.querySelector("[data-player-title]").textContent === "Harbor in Blue" && !document.querySelector("audio").paused);
    await page.locator("#sidebar a[href='#/now-playing']").click();
    await click('.stage-controls [data-action="toggle"]');
    await click('.lyric[data-index="3"]');
    await click('.stage-controls [data-action="previous"]');
    assert.ok(await page.locator("audio").evaluate(a => a.currentTime) < 0.1);
    await click('.stage-controls [data-action="previous"]');
    await expect(page.locator("h1")).toHaveText("Window Weather");
    await click('.stage-controls [data-action="next"]');
    await expect(page.locator("h1")).toHaveText("Harbor in Blue");
    assert.equal(await page.locator("audio").evaluate(a => a.paused), true);
    await page.locator("audio").evaluate(a => a.dispatchEvent(new Event("ended")));
    await expect(page.locator("h1")).toHaveText("Harbor in Blue");
    await click('#topbar [data-action="queue"]');
    await click('[data-action="queue-select"][data-id="the-last-lantern"]');
    await click('[data-action="close-queue"]');
    await waitAudio();
    await click('.stage-controls [data-action="toggle"]');
    await page.locator("audio").evaluate(a => { a.currentTime = 17.65; });
    await page.waitForFunction(() => document.querySelector("audio").ended);
    await expect(page.locator("h1")).toHaveText("The Last Lantern");
    assert.equal(await page.locator("audio").evaluate(a => a.paused), true);
    await expect(page.locator('.stage-controls [data-toggle]')).toHaveAttribute("aria-label", "Replay");
    await click('.stage-controls [data-action="toggle"]');
    await page.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime < 3);
    await click('.stage-controls [data-action="toggle"]');
    tests.push("Natural audio ended advances in the real chart queue; previous restarts above 2s then selects preceding item; Next selects correct queue item paused; paused ended does not advance; final item stops at 18s with working Replay.");

    for (const track of tracks)
    {
        await page.locator("#search").fill(track.title);
        await page.locator(`#search-results [data-id="${track.id}"]`).click();
        await expect(page.locator("h1")).toHaveText(track.title);
        await waitAudio();
        assert.ok((await page.locator("audio").evaluate(a => a.dataset.source)).endsWith(`${track.file}.wav`));
        await expect(page.locator(".lyric")).toHaveCount(6);
        await expect(page.locator(".comment")).toHaveCount(track.comments.length);
        await click('.stage-controls [data-action="toggle"]');
        await page.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime > 0.1);
        await click('.stage-controls [data-action="toggle"]');
    }
    tests.push("All six tracks individually selected and actually played in Chromium: matching unique WAV, title, six timed lyrics, and per-track listener notes verified.");

    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [hash, heading] of [["/", "Paper After Dark"], ["/charts", "Six songs. One very subjective chart."], ["/now-playing", "The Last Lantern"]])
    {
        await page.evaluate(hash => { location.hash = hash; }, hash);
        await expect(page.locator("h1")).toHaveText(heading);
        await overflow(`1440px ${hash}`);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await page.locator(".vinyl").evaluate(node => getComputedStyle(node).animationName), "none");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    tests.push("1440×900 layout across all views and reduced-motion vinyl override verified.");

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    monitor(mobile);
    await mobile.goto(server.url, { waitUntil: "networkidle" });
    await mobile.evaluate(() => document.fonts.ready);
    assert.equal(await mobile.locator("audio").evaluate(a => a.paused), true);
    await mobile.screenshot({ path: qa.screenshots.mobile });
    async function mobileOverflow(label)
    {
        assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: mobile overflow`);
        tests.push(`390×844 ${label}: no horizontal overflow.`);
    }
    await mobileOverflow("Library initial");
    await mobile.locator('.featured [data-action="playlist"]').tap();
    await mobile.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime > 0.1);
    await mobile.locator('#mobile-nav a[href="#/now-playing"]').tap();
    await expect(mobile.locator("h1")).toHaveText("Window Weather");
    assert.equal(await mobile.locator("audio").evaluate(a => a.paused), false);
    await mobile.locator('.mobile-player-actions [data-toggle]').tap();
    await mobile.locator('.lyric[data-index="2"]').tap();
    assert.ok(Math.abs(await mobile.locator("audio").evaluate(a => a.currentTime) - 6) < 0.15);
    await mobileOverflow("Now Playing after tap/lyric seek");
    await mobile.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await mobile.waitForTimeout(250);
    await mobile.screenshot({ path: path.join(checks, "now-playing-mobile.png") });
    await mobile.locator('#topbar [data-action="queue"]').tap();
    await expect(mobile.locator("#queue-dialog")).toBeVisible();
    await mobile.locator('[data-action="queue-next"][data-id="the-last-lantern"]').tap();
    await expect(mobile.locator(".queue-row").first()).toContainText("The Last Lantern");
    await mobile.locator('[data-action="queue-remove"][data-id="apricot-receiver"]').tap();
    await expect(mobile.locator(".queue-row")).toHaveCount(4);
    await mobile.locator('[data-action="close-queue"]').tap();
    await mobile.locator('#comment-body').fill("A small note from a small screen.");
    await mobile.locator("#comment-form button").tap();
    await expect(mobile.locator(".local-post")).toBeVisible();
    await mobile.locator('#mobile-nav a[href="#/charts"]').tap();
    await expect(mobile.locator("h1")).toHaveText("Six songs. One very subjective chart.");
    await mobileOverflow("Charts after queue and comments");
    await mobile.locator('main [data-action="reset"]').first().tap();
    await mobile.locator('[data-action="confirm"]').tap();
    assert.equal(await mobile.locator("audio").evaluate(a => a.paused && a.currentTime === 0), true);
    const mobileStored = await mobile.evaluate(() => JSON.parse(localStorage.getItem("stillform:v1")));
    assert.equal(mobileStored.comments.length, 0);
    assert.equal(mobileStored.likes.length, 0);
    assert.equal(mobileStored.saved.length, 0);
    assert.equal(mobileStored.queue.length, 6);
    await mobileOverflow("after confirmed reset");
    await mobileContext.close();
    tests.push("Mobile touch: actual Play/Pause, persistent audio on navigation, lyric seek, queue play-next/removal, local comment, chart navigation and confirmed scoped reset verified. Mobile screenshot captured.");

    const blockedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await blockedContext.addInitScript(() =>
    {
        Storage.prototype.getItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
        Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "SecurityError"); };
    });
    const blocked = await blockedContext.newPage();
    monitor(blocked);
    await blocked.goto(server.url, { waitUntil: "networkidle" });
    await blocked.locator('.featured [data-action="save"]').click();
    await expect(blocked.locator('.featured [data-action="save"]')).toHaveAttribute("aria-pressed", "true");
    await blockedContext.close();
    await page.evaluate(() => localStorage.setItem("stillform:v1", JSON.stringify({ current: "bad", queue: ["bad", "window-weather", "window-weather"], saved: ["invalid"], comments: [{ id: "x", track: "bad", body: "<script>" }] })));
    await page.reload({ waitUntil: "networkidle" });
    await click('#topbar [data-action="queue"]');
    await expect(page.locator(".current-queue")).toContainText("Window Weather");
    await expect(page.locator(".queue-empty")).toBeVisible();
    await click('[data-action="close-queue"]');
    tests.push("Unavailable storage safely degrades to in-memory interactions; corrupt/unknown stored IDs and duplicate queue entries are validated away without playback or browser errors.");
    await context.close();
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
    if (server) await server.close();
    qa.resourcesClosed = true;
    await W.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, tests: tests.length, errors, resourcesClosed: qa.resourcesClosed, screenshots: qa.screenshots, failure: qa.failure }));
}
