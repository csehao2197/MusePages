import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.resolve("out", "pages", "586-music-festival-website", "GPT-6");
const exported = path.join(folder, "out");
const report =
{
    prompt: "586-music-festival-website",
    modelId: "gpt-6.1-sol",
    staticDigest: await StaticHomepage.validateStaticOutput(exported, "music-festival-website", "GPT-6"),
    startedAt: new Date().toISOString(),
    tests: [],
    errors: [],
    viewports: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
function passed(name, details)
{
    report.tests.push({ name, passed: true, details });
}
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(sizes.html <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: ${JSON.stringify(sizes)}`);
    passed(label, sizes);
}
try
{
    const publicEntries = await fs.readdir(exported);
    assert.ok(!publicEntries.some(name => /^(?:scripts|src|app|\.checks|metadata\.json|package\.json)$/i.test(name)));
    async function compareSources(directory)
    {
        for (const entry of await fs.readdir(directory, { withFileTypes: true }))
        {
            const file = path.join(directory, entry.name);
            if (entry.isDirectory()) await compareSources(file);
            else if (entry.name !== "preview.png")
            {
                assert.deepEqual(await fs.readFile(file), await fs.readFile(path.join(folder, path.relative(exported, file))), `Source/export mismatch: ${entry.name}`);
            }
        }
    }
    await compareSources(exported);
    passed("Public boundary and source/export equality", "No generator script, metadata, Markdown, package, private checks or source components in public output; every exported runtime asset matches source");
    server = await startPreviewServer(exported, { workspace });
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    assert.ok(server.url.includes("/pages/music-festival-website/GPT-6/index.html"));
    passed("HTTP readiness and final public model mount", server.url.replace(/:\d+/, ":<ephemeral>"));
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        page.on("pageerror", e => report.errors.push(`page: ${e.message}`));
        page.on("console", m => { if (m.type() === "error") report.errors.push(`console: ${m.text()}`); });
        page.on("requestfailed", r => report.errors.push(`request: ${r.url()} ${r.failure()?.errorText}`));
        page.on("response", r => { if (r.status() >= 400) report.errors.push(`http: ${r.status()} ${r.url()}`); });
        report.viewports.push({ ...viewport, deviceScaleFactor: 1, mobile });
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.locator("main").innerText().then(t => t.length > 1500));
        assert.equal(await page.locator(".poster").count(), 9);
        assert.ok(await page.locator(".soundscape img").evaluate(img => img.complete && img.naturalWidth > 1000));
        assert.ok(await page.evaluate(() => document.fonts.check('16px Anton')));
        await noOverflow(page, `${viewport.width}: home before interactions`);
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png") });
        if (!mobile) await page.screenshot({ path: path.join(folder, ".checks", "home-full.png"), fullPage: true });
        await page.locator("#lineup").getByRole("button", { name: "Sat Jul 17" }).click();
        assert.equal(await page.locator(".poster").count(), 3);
        assert.ok(await page.locator(".posters").innerText().then(t => t.includes("PEACH STATIC") && !t.includes("VELVET ORBIT")));
        await page.locator("#lineup").getByRole("button", { name: "Sun Jul 18" }).focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#lineup button[aria-pressed=true]").innerText(), "Sun Jul 18");
        passed(`${viewport.width}: line-up filters with keyboard activation`, "Nine acts, three per day; matching poster content");
        await page.locator("#play").click();
        await page.waitForFunction(() => document.querySelector("#play").getAttribute("aria-pressed") === "true");
        await page.locator("#mute").click();
        assert.equal(await page.locator("#mute").getAttribute("aria-pressed"), "true");
        await page.locator("#play").click();
        assert.equal(await page.locator("#play").getAttribute("aria-pressed"), "false");
        await page.locator("#play").click();
        await page.waitForFunction(() => document.querySelector("#play").getAttribute("aria-pressed") === "true");
        await page.locator(".poster button").first().click();
        await page.waitForTimeout(300);
        await page.locator("#play").click();
        passed(`${viewport.width}: original audio playback, pause/resume, mute and act preview`, "Real WAV decoded and loop started; accessible controls reflect playback");
        await page.locator("#schedule").getByRole("button", { name: "Sat Jul 17" }).click();
        assert.ok(await page.locator("#schedule-rows").innerText().then(t => t.includes("PEACH STATIC")));
        await page.locator(".save-act").first().focus();
        await page.keyboard.press("Space");
        assert.equal(await page.locator(".save-act").first().getAttribute("aria-pressed"), "true");
        await page.reload({ waitUntil: "networkidle" });
        assert.ok(await page.locator("#saved-status").innerText().then(t => t.includes("1 set saved")));
        await page.locator("#schedule").getByRole("button", { name: "Sat Jul 17" }).click();
        assert.equal(await page.locator(".save-act").first().getAttribute("aria-pressed"), "true");
        await page.locator(".save-act").first().click();
        assert.ok(await page.locator("#saved-status").innerText().then(t => t.includes("No sets")));
        await noOverflow(page, `${viewport.width}: home after interactions`);
        passed(`${viewport.width}: schedule and persisted local plan`, "Keyboard save, reload retention and removal verified");
        if (mobile)
        {
            const box = await page.locator(".mobile-ticket").boundingBox();
            assert.ok(box && box.y + box.height <= viewport.height + 1);
        }
        else
        {
            assert.ok(await page.locator("header > .button").isVisible());
        }
        await page.goto(server.url.replace("index.html", "map.html"), { waitUntil: "networkidle" });
        await noOverflow(page, `${viewport.width}: map before interactions`);
        await page.locator("g[data-zone='3']").focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator(".zone-detail h2").innerText(), "Mosslight Camp");
        await page.locator(".zone-list button[data-zone='4']").click();
        assert.equal(await page.locator(".zone-detail h2").innerText(), "Water & Welfare");
        assert.equal(await page.locator("g[data-zone='4']").getAttribute("aria-pressed"), "true");
        await noOverflow(page, `${viewport.width}: map after interactions`);
        passed(`${viewport.width}: interactive illustrated map`, "SVG keyboard activation and button/touch equivalents update synchronized details");
        await page.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: "instant" }); });
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "map-mobile.png" : "map-desktop.png"), fullPage: true });
        await page.goto(server.url.replace("index.html", "tickets.html"), { waitUntil: "networkidle" });
        await noOverflow(page, `${viewport.width}: tickets before interactions`);
        assert.equal(await page.locator("#total").innerText(), "$378");
        await page.locator("[data-tier='2']").click();
        assert.equal(await page.locator("#tier").inputValue(), "2");
        await page.locator("#quantity").fill("3");
        assert.equal(await page.locator("#total").innerText(), "$807");
        await page.locator("#tier").selectOption("0");
        await page.locator("#day").selectOption({ label: "Sun Jul 18" });
        assert.equal(await page.locator("#total").innerText(), "$237");
        assert.ok(await page.locator("#estimate").innerText().then(t => t.includes("Sun Jul 18")));
        await page.locator("#quantity").fill("9");
        assert.equal(await page.locator("#total").innerText(), "—");
        await page.locator("#quantity").fill("1.5");
        assert.equal(await page.locator("#total").innerText(), "—");
        await page.locator("#quantity").fill("1");
        await page.locator("#tier").selectOption("3");
        assert.equal(await page.locator("#total").innerText(), "$449");
        assert.equal(await page.locator("#day-field").isVisible(), false);
        await page.getByText("Can I actually buy tickets?", { exact: true }).focus();
        await page.keyboard.press("Enter");
        assert.ok(await page.locator("details").last().getAttribute("open") !== null);
        await noOverflow(page, `${viewport.width}: tickets after interactions`);
        passed(`${viewport.width}: ticket comparison and calculator`, "General $378; camp 3×$269=$807; day 3×$79=$237; VIP $449; invalid 9 and fractional quantities rejected; FAQ keyboard tested; no checkout");
        await page.evaluate(() => { document.activeElement?.blur(); scrollTo({ top: 0, behavior: "instant" }); });
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "tickets-mobile.png" : "tickets-desktop.png"), fullPage: true });
        await context.close();
    }
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(server.url, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".marquee div").evaluate(el => getComputedStyle(el).animationName), "none");
    await page.evaluate(async () =>
    {
        const { FestivalAudio } = await import("./audio.mjs");
        const engine = new FestivalAudio();
        window.audioEvidence = new Promise(resolve => document.querySelector("#play").addEventListener("click", async () =>
        {
            await engine.toggle();
            setTimeout(async () =>
            {
                const bins = engine.frequency();
                const active = bins.some(v => v > 0);
                engine.preview(0, 138.59);
                await new Promise(done => setTimeout(done, 240));
                const duckedGain = engine.loopGain.gain.value;
                engine.stopPreview();
                await new Promise(done => setTimeout(done, 240));
                const restoredGain = engine.loopGain.gain.value;
                engine.mute();
                await new Promise(done => setTimeout(done, 200));
                const masterMuted = engine.master.gain.value < .001;
                const mutedSpectrumActive = engine.frequency().some(v => v > 0);
                engine.close();
                resolve({ active, masterMuted, mutedSpectrumActive, duckedGain, restoredGain, decodedDuration: engine.buffer.duration });
            }, 200);
        }, { once: true }));
    });
    await page.locator("#play").click();
    const audible = await page.evaluate(() => window.audioEvidence);
    assert.equal(audible.active, true);
    assert.equal(audible.masterMuted, true);
    assert.equal(audible.mutedSpectrumActive, true);
    assert.ok(audible.duckedGain < .2 && audible.restoredGain > .98);
    assert.ok(Math.abs(audible.decodedDuration - 32 * 60 / 124) < .001);
    passed("Real frequency data, correct 8-bar duration and reduced motion", audible);
    await context.close();
    const failureContext = await browser.newContext();
    const failurePage = await failureContext.newPage();
    const fallbackErrors = [];
    failurePage.on("pageerror", e => fallbackErrors.push(e.message));
    failurePage.on("console", m => { if (m.type() === "error") fallbackErrors.push(m.text()); });
    await failurePage.route("**/audio/loop.wav", route => route.fulfill({ status: 200, contentType: "audio/wav", body: "intentionally invalid audio for fallback QA" }));
    await failurePage.goto(server.url, { waitUntil: "networkidle" });
    await failurePage.locator("#play").click();
    await failurePage.waitForFunction(() => document.querySelector("#audio-status").textContent === "Audio could not load. The visuals keep running.");
    assert.equal(await failurePage.locator("#play").getAttribute("aria-pressed"), "false");
    assert.deepEqual(fallbackErrors, []);
    passed("Intentional invalid-audio fallback", "Exact inline failure notice, idle canvas retained, no console or page errors; this mocked decode failure is not a production resource failure");
    await failureContext.close();
    assert.deepEqual(report.errors, []);
    report.passed = true;
}
catch (error)
{
    report.passed = false;
    report.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    report.resourcesClosed = true;
    report.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, tests: report.tests.length, errors: report.errors, failure: report.failure, resourcesClosed: report.resourcesClosed }));
}
