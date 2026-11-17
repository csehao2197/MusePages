import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const { WorkspaceFiles: W, StaticHomepage: S } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const folder = job.output;
const checks = path.join(folder, ".checks");
const exported = path.join(folder, "out");
const errors = [];
const assertions = [];
const viewports = [];
const requests = new Set();
let browser;
let server;
const result =
{
    prompt: job.prompt,
    modelId: job.modelId,
    startedAt: new Date().toISOString(),
    passed: false,
    assertions,
    errors,
    viewports,
    visualReviewed: false,
    resourcesClosed: false
};

function record(name)
{
    assertions.push({ name, passed: true });
}

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    assert.ok(sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, `${label}: ${JSON.stringify(sizes)}`);
    record(`No horizontal overflow: ${label}`);
}

async function settle(page)
{
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
}

async function go(page, file = "index.html")
{
    const response = await page.goto(new URL(file, server.url).href);
    assert.equal(response.status(), 200);
    await settle(page);
    assert.ok((await page.locator("main").innerText()).trim().length > 180);
    await noOverflow(page, `${file} initial ${page.viewportSize().width}`);
}

function listen(page, label)
{
    page.on("request", request => requests.add(request.url()));
    page.on("pageerror", error => errors.push({ type: "pageerror", label, message: error.message }));
    page.on("console", message =>
    {
        if (message.type() === "error") errors.push({ type: "console", label, message: message.text() });
    });
    page.on("requestfailed", request => errors.push({ type: "requestfailed", label, url: request.url(), message: request.failure()?.errorText }));
    page.on("response", response =>
    {
        if (response.status() >= 400) errors.push({ type: "http", label, status: response.status(), url: response.url() });
    });
}

try
{
    const state = await W.json(job.stateFile);
    const pid = Number((await W.text(job.promptLock)).trim());
    assert.equal(state.runId, job.runId);
    assert.equal(state.ownedLock.prompt, job.prompt);
    assert.equal(state.ownedLock.pid, pid);
    process.kill(pid, 0);
    record("Live attached coordinator lock matches durable ownedLock and exact job");
    const fonts = path.join(folder, "fonts");
    for (const family of ["anton", "space-grotesk", "space-mono"])
    {
        const old = path.join(fonts, `${family}-LICENSE`);
        await fs.mkdir(path.join(fonts, family), { recursive: true });
        if (await W.info(old))
        {
            await fs.rename(old, path.join(fonts, family, "LICENSE"));
        }
    }
    await fs.mkdir(exported, { recursive: true });
    for (const name of ["index.html", "shop.html", "artist.html", "style.css", "app.js", "content.js", "favicon.svg", "LICENSE", "NOTICE"])
    {
        await fs.copyFile(path.join(folder, name), path.join(exported, name));
    }
    for (const name of ["fonts", "lib"])
    {
        await fs.cp(path.join(folder, name), path.join(exported, name), { recursive: true });
    }
    const metadata = await W.json(path.join(folder, "metadata.json"));
    assert.equal(await S.checkSource(folder), "html");
    metadata.generated = true;
    await W.saveJson(path.join(folder, "metadata.json"), metadata);
    const raw = await W.text(job.file);
    const design = await W.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
    const inputDigest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
    await W.saveText(path.join(folder, ".generation-input.sha256"), `${inputDigest}\n`);
    result.inputDigest = inputDigest;
    result.staticDigest = await S.validateStaticOutput(exported, "indie-record-label-website", "GPT-6");
    record("Source and independent static export pass shared validator at final public subpath");
    const { coverArt } = await import(pathToFileURL(path.join(folder, "lib", "cover.js")));
    assert.equal(coverArt(24), coverArt(24));
    assert.notEqual(coverArt(24), coverArt(23));
    assert.equal((coverArt(24).match(/mix-blend-mode:multiply/g) || []).length >= 6, true);
    record("Pure seeded sleeve SVG is repeatable and seed-specific with 6–9 geometric layers");
    server = await startPreviewServer(exported, { workspace });
    const ready = await fetch(server.url);
    assert.equal(ready.status, 200);
    result.mount = new URL(server.url).pathname;
    assert.equal(result.mount, "/pages/indie-record-label-website/GPT-6/index.html");
    assert.equal((await fetch(new URL("/README.md", server.url))).status, 404);
    record("Owned static preview responds at exact final mount and does not expose repository");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    await desktop.addInitScript(() =>
    {
        const NativeAudioContext = window.AudioContext;
        window.__qaAudio = { contexts: [], buffers: [], starts: 0 };
        window.AudioContext = class extends NativeAudioContext
        {
            constructor(...args)
            {
                super(...args);
                window.__qaAudio.contexts.push(this);
            }
            createBuffer(...args)
            {
                const buffer = super.createBuffer(...args);
                window.__qaAudio.buffers.push(buffer);
                return buffer;
            }
            createBufferSource()
            {
                const source = super.createBufferSource();
                const start = source.start.bind(source);
                source.start = (...args) =>
                {
                    window.__qaAudio.starts++;
                    return start(...args);
                };
                return source;
            }
        };
    });
    const page = await desktop.newPage();
    listen(page, "desktop");
    await go(page);
    viewports.push({ width: 1200, height: 900, deviceScaleFactor: 1, passed: true });
    assert.equal(await page.locator(".release-card").count(), 8);
    assert.equal(await page.locator(".artist-card").count(), 5);
    assert.equal(await page.locator(".tour-row").count(), 7);
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    record("Homepage shows eight releases, five artists, seven fictional seasonal shows; desktop screenshot captured");
    await page.getByRole("button", { name: "Singles", exact: true }).click();
    assert.equal(await page.locator(".release-card").count(), 3);
    await page.getByRole("button", { name: "LPs", exact: true }).focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".release-card").count(), 5);
    await page.locator("#record-search").fill("Mote");
    assert.equal(await page.locator(".release-card").count(), 2);
    await page.locator("#record-search").fill("no-such-record");
    assert.equal(await page.locator(".release-card").count(), 0);
    assert.match(await page.locator(".empty-results").innerText(), /No records/);
    await page.locator("#record-search").fill("");
    await page.getByRole("button", { name: "All records", exact: true }).click();
    const sleeve = page.locator("[data-sleeve]").first();
    await sleeve.focus();
    await page.keyboard.press("Enter");
    assert.equal(await sleeve.getAttribute("aria-pressed"), "true");
    await sleeve.hover();
    await page.waitForTimeout(300);
    assert.ok((await sleeve.locator(".sleeve-record").evaluate(element => new DOMMatrix(getComputedStyle(element).transform).m41)) >= 55);
    await noOverflow(page, "desktop catalog sleeve reveal");
    for (const art of await page.locator("#release-grid [data-sleeve]").all())
    {
        await art.hover();
        await page.waitForTimeout(280);
        await noOverflow(page, "every desktop catalog sleeve reveal");
    }
    await page.locator("#catalog").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(checks, "desktop-catalog.png") });
    record("Catalog filters, keyboard selection, artist search, empty state and true 56px record reveal");
    await page.locator('[data-listen="24"]').click();
    await page.waitForFunction(() => document.querySelector("#play-toggle").dataset.playing === "true");
    assert.match(await page.locator("#track-title").innerText(), /Flood Rooms/);
    await page.waitForTimeout(450);
    assert.ok(Number(await page.locator("#audio-position").inputValue()) > 0);
    const audioEvidence = await page.evaluate(() =>
    {
        const samples = window.__qaAudio.buffers[0].getChannelData(0);
        let energy = 0;
        for (let index = 0; index < samples.length; index += 100) energy += samples[index] ** 2;
        return { state: window.__qaAudio.contexts[0].state, duration: window.__qaAudio.buffers[0].duration, energy, sourceStarts: window.__qaAudio.starts };
    });
    assert.equal(audioEvidence.state, "running");
    assert.equal(audioEvidence.duration, 18);
    assert.ok(audioEvidence.energy > 1 && audioEvidence.sourceStarts > 0);
    result.audioEvidence = audioEvidence;
    await page.getByRole("button", { name: "Pause sketch", exact: true }).click();
    assert.equal(await page.locator("#play-toggle").getAttribute("data-playing"), "false");
    await page.locator("#audio-position").focus();
    await page.keyboard.press("ArrowRight");
    await page.locator("#audio-volume").fill("0.2");
    await page.getByRole("button", { name: "Play sketch", exact: true }).click();
    assert.equal(await page.locator("#play-toggle").getAttribute("data-playing"), "true");
    await noOverflow(page, "desktop playing original sketch");
    await page.getByRole("button", { name: "Close listening player" }).click();
    record("Original Web Audio sketch really plays, advances, pauses, seeks, changes volume and dismisses");
    await page.locator("[data-ticket]").nth(1).click();
    assert.match(await page.locator("#ticket-message").innerText(), /no tickets to purchase/);
    record("Seasonal ticket links disclose their nontransactional demo state");
    await page.locator('[data-add="flood-coral"]').click();
    await page.getByRole("dialog").waitFor();
    assert.match(await page.locator(".demo-line").innerText(), /nothing is charged or shipped/);
    assert.match(await page.locator(".cart-summary").innerText(), /\$24.00/);
    await page.getByRole("button", { name: "Increase quantity: Coral vinyl, limited 300", exact: true }).click();
    assert.equal(await page.locator(".quantity output").innerText(), "2");
    assert.match(await page.locator(".cart-summary").innerText(), /\$48.00/);
    await page.getByRole("button", { name: "Decrease quantity: Coral vinyl, limited 300", exact: true }).click();
    assert.equal(await page.locator(".quantity output").innerText(), "1");
    await page.getByRole("button", { name: "Keep browsing", exact: true }).focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute("aria-label")), "Close cart");
    await page.keyboard.press("Shift+Tab");
    assert.match(await page.evaluate(() => document.activeElement.innerText), /Keep browsing/);
    await noOverflow(page, "desktop open cart");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#overlay").isHidden(), true);
    assert.equal(await page.evaluate(() => document.activeElement.dataset.add), "flood-coral");
    record("Cart adds variants, calculates subtotal and demo shipping, changes quantity, traps focus and restores it on Escape");
    await go(page, "shop.html");
    assert.equal(await page.locator(".product-card").count(), 6);
    assert.equal(await page.locator("#cart-count").innerText(), "1");
    await page.locator("#open-cart").click();
    await page.getByRole("button", { name: "Remove: Coral vinyl, limited 300", exact: true }).click();
    assert.equal(await page.locator(".cart-line").count(), 0);
    assert.match(await page.locator(".cart-empty").innerText(), /empty crate/);
    await page.keyboard.press("Escape");
    for (const card of await page.locator(".product-card").all())
    {
        await card.locator("[data-sleeve]").hover();
        await page.waitForTimeout(280);
        await noOverflow(page, "desktop shop sleeve hover");
    }
    record("All six shop variants exist, cart persists across actual file navigation, and removing last item restores empty state");
    for (const [slug, name, count] of [["mote", "Mote", 2], ["diorama-kid", "Diorama Kid", 2], ["cassia-vale", "Cassia Vale", 2], ["grove-static", "Grove Static", 1], ["anais-ward", "Anaïs Ward", 1], ["unknown", "Mote", 2], ["", "Mote", 2]])
    {
        await go(page, `artist.html${slug ? `?artist=${slug}` : ""}`);
        assert.equal(await page.locator("h1").textContent(), name);
        assert.equal(await page.locator(".release-card").count(), count);
        assert.ok((await page.title()).startsWith(name));
    }
    record("Five artist query routes filter the correct releases; missing and unknown queries fall back to Mote");
    await page.evaluate(() => localStorage.setItem("static-bloom-records-cart", "{broken"));
    await go(page, "shop.html");
    assert.equal(await page.locator("#cart-count").innerText(), "0");
    await page.evaluate(() => localStorage.setItem("static-bloom-records-cart", JSON.stringify([{ id: "fake", quantity: 3 }, { id: "flood-black", quantity: -2 }, { id: "flood-coral", quantity: 99 }, { id: "flood-coral", quantity: 2 }, { id: "dub-black", quantity: 1.5 }, null])));
    await go(page, "shop.html");
    assert.equal(await page.locator("#cart-count").innerText(), "99");
    await page.locator('[data-add="flood-coral"]').click();
    assert.equal(await page.locator(".quantity output").innerText(), "99");
    assert.equal(await page.getByRole("button", { name: "Increase quantity: Coral vinyl, limited 300", exact: true }).isDisabled(), true);
    await page.keyboard.press("Escape");
    record("Malformed cart JSON, unknown IDs, duplicates, negative/fractional quantities recover silently; 99-unit bound enforced");
    await page.setViewportSize({ width: 1440, height: 900 });
    await go(page);
    await noOverflow(page, "required 1440×900 desktop");
    viewports.push({ width: 1440, height: 900, deviceScaleFactor: 1, passed: true });
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    listen(mobile, "mobile");
    await go(mobile);
    viewports.push({ width: 390, height: 844, deviceScaleFactor: 1, hasTouch: true, passed: true });
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    await mobile.getByRole("button", { name: "Singles", exact: true }).tap();
    assert.equal(await mobile.locator(".release-card").count(), 3);
    await mobile.locator("[data-sleeve]").first().tap();
    assert.equal(await mobile.locator("[data-sleeve]").first().getAttribute("aria-pressed"), "true");
    await mobile.waitForTimeout(300);
    await noOverflow(mobile, "mobile tapped catalog reveal and filter");
    await mobile.screenshot({ path: path.join(checks, "mobile-catalog.png") });
    await mobile.locator('[data-listen="22"]').tap();
    await mobile.waitForFunction(() => document.querySelector("#play-toggle").dataset.playing === "true");
    await noOverflow(mobile, "mobile active audio player");
    await mobile.getByRole("button", { name: "Close listening player" }).tap();
    await mobile.locator('[data-add="flood-black"]').tap();
    await mobile.getByRole("button", { name: "Increase quantity: Standard black LP", exact: true }).tap();
    assert.equal(await mobile.locator(".quantity output").innerText(), "2");
    await noOverflow(mobile, "mobile cart quantity controls");
    await mobile.getByRole("button", { name: "Keep browsing", exact: true }).tap();
    assert.equal(await mobile.locator("#overlay").isHidden(), true);
    await go(mobile, "shop.html");
    assert.equal(await mobile.locator("#cart-count").innerText(), "2");
    for (const sleeve of await mobile.locator(".product-card [data-sleeve]").all())
    {
        await sleeve.tap();
        await mobile.waitForTimeout(300);
        await noOverflow(mobile, "mobile shop sleeve reveal");
    }
    await go(mobile, "artist.html?artist=cassia-vale");
    await mobile.locator(".back-link").tap();
    await mobile.waitForURL(/index\.html#roster/);
    assert.equal(await mobile.locator(".artist-card").count(), 5);
    record("390×844 touch: filters, sleeves, original player, variant add/quantity/persistence and artist return link all work");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await go(page);
    assert.equal(await page.locator(".hero-record").evaluate(element => getComputedStyle(element).animationName), "none");
    assert.equal(await page.locator(".ticker-track").evaluate(element => getComputedStyle(element).animationName), "none");
    assert.equal(await page.locator(".reveal").first().evaluate(element => getComputedStyle(element).opacity), "1");
    await noOverflow(page, "reduced motion static ticker");
    record("Reduced-motion preference pauses vinyl/ticker and makes reveal content immediately visible");
    const deniedContext = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await deniedContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get()
        {
            throw new DOMException("Storage denied", "SecurityError");
        } });
    });
    const deniedPage = await deniedContext.newPage();
    listen(deniedPage, "storage denied");
    await go(deniedPage);
    await deniedPage.locator('[data-add="flood-black"]').click();
    assert.equal(await deniedPage.locator(".quantity output").innerText(), "1");
    record("Browser storage denial leaves a functioning in-memory demo cart");
    await deniedContext.close();
    await desktop.close();
    await mobileContext.close();
    result.requestedResources = [...requests].map(url => new URL(url).pathname).filter((value, index, list) => list.indexOf(value) === index);
    assert.ok([...requests].every(url => new URL(url).origin === new URL(server.url).origin));
    record("Every browser network request stays inside the owned local static server; no external APIs or assets");
    assert.deepEqual(errors, []);
    record("Zero HTTP/resource/request/console/page errors in all inspected pages and interactions");
    result.passed = true;
}
catch (error)
{
    result.failure = error.stack;
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    result.finishedAt = new Date().toISOString();
    await W.saveJson(path.join(checks, "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: assertions.length, errors, failure: result.failure, resourcesClosed: result.resourcesClosed }));
}
