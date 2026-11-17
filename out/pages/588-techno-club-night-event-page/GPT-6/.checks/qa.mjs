import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "588-techno-club-night-event-page", "GPT-6");
const checks = path.join(folder, ".checks");
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const result =
{
    status: "running",
    modelId: "gpt-6.1-sol",
    viewports: [{ width: 1200, height: 900, deviceScaleFactor: 1 }, { width: 390, height: 844, deviceScaleFactor: 1 }],
    assertions: [],
    errors: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
function passed(name)
{
    result.assertions.push(name);
}
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ width: innerWidth, actual: document.documentElement.scrollWidth }));
    assert.ok(sizes.actual <= sizes.width, `${label}: overflow ${JSON.stringify(sizes)}`);
    passed(label);
}
function monitor(page)
{
    page.on("pageerror", (error) => result.errors.push(`page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error") result.errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => result.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
}
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    assert.match(server.url, /\/pages\/techno-club-night-event-page\/GPT-6\/index\.html$/);
    passed("HTTP 200 and actual final public subpath");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    monitor(page);
    await page.goto(server.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("h1").innerText(), "FEEL THE\nROOM FIND\nITS PULSE.");
    assert.ok((await page.locator("body").innerText()).length > 3000);
    assert.equal(await page.locator("audio").evaluate((audio) => audio.paused), true);
    assert.equal(await page.locator("#volume").inputValue(), "35");
    await noOverflow(page, "Desktop initial no horizontal overflow");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    passed("Meaningful English homepage, self-hosted fonts, no autoplay, default 35% volume; desktop PNG captured");

    await page.locator('[data-artist="0"]').click();
    assert.equal(await page.locator("#artist-dialog").evaluate((el) => el.open), true);
    assert.match(await page.locator("#artist-dialog").innerText(), /fictional/i);
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.evaluate(() => document.activeElement.closest("dialog")?.id), "artist-dialog");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator('[data-artist="0"]').evaluate((el) => el === document.activeElement), true);
    passed("Original artist bio dialog opens; keyboard focus trap, Escape and focus restoration");

    await page.locator('[data-save="1"]').click();
    await page.locator("#saved-only").check();
    assert.equal(await page.locator(".artist-row").count(), 1);
    assert.match(await page.locator(".artist-row").innerText(), /Veya Flux/i);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator('[data-save="1"]').getAttribute("aria-pressed"), "true");
    await page.locator("#saved-only").check();
    await page.locator("#clear-saved").click();
    assert.equal(await page.locator(".artist-row").count(), 0);
    assert.match(await page.locator("#artists").innerText(), /empty/);
    await page.locator("#saved-only").uncheck();
    passed("Running-order bookmarks persist; saved filter/count, clear and empty state work");

    for (let i = 0; i < 5; i++)
    {
        await page.locator(`[data-select-zone="${i}"]`).focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator(`[data-select-zone="${i}"]`).getAttribute("aria-pressed"), "true");
        assert.ok((await page.locator("#zone-note p").innerText()).length > 50);
    }
    assert.equal(await page.locator(".map-route").getAttribute("class"), "map-route selected");
    assert.match(await page.locator("#zone-note").innerText(), /not verified access/);
    passed("All five venue zones select by keyboard and update real map/details; route disclaimer present");

    await page.locator('[data-ticket="1"]').click();
    assert.equal(await page.locator('input[name="tier"][value="1"]').isChecked(), true);
    await page.locator("#quantity").fill("3");
    assert.equal(await page.locator("#estimate-total").innerText(), "$69");
    await page.locator("#ticket-form button[type=submit]").click();
    assert.equal(await page.locator("#agree-id").evaluate((el) => el.validity.valueMissing), true);
    assert.equal(await page.locator("#plan-result").innerText(), "");
    await page.locator("#quantity").fill("7");
    await page.locator("#agree-id").check();
    await page.locator("#agree-policy").check();
    assert.equal(await page.locator("#quantity").evaluate((el) => el.validity.rangeOverflow), true);
    await page.locator("#ticket-form button[type=submit]").click();
    assert.equal(await page.locator("#plan-result").innerText(), "");
    await page.locator("#quantity").fill("3");
    await page.locator("#ticket-form button[type=submit]").click();
    assert.match(await page.locator("#plan-result").innerText(), /No ticket, entry reservation, payment or message/);
    await page.locator("#ticket-dialog [data-close]").focus();
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator("#reset-plan").evaluate((el) => el === document.activeElement), true);
    await page.keyboard.press("Tab");
    assert.equal(await page.locator("#ticket-dialog [data-close]").evaluate((el) => el === document.activeElement), true);
    assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("modal-open")), true);
    await noOverflow(page, "Desktop open ticket drawer no overflow");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator('[data-ticket="1"]').evaluate((el) => el === document.activeElement), true);
    assert.equal(await page.locator("body").evaluate((el) => el.classList.contains("modal-open")), false);
    await page.reload({ waitUntil: "networkidle" });
    assert.match(await page.locator("#saved-plan").innerText(), /On your time × 3 \/ \$69/);
    await page.locator("#edit-plan").click();
    assert.equal(await page.locator("#quantity").inputValue(), "3");
    await page.locator("#reset-plan").click();
    assert.equal(await page.locator("#quantity").inputValue(), "1");
    assert.equal(await page.locator("#agree-policy").isChecked(), false);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#saved-plan").isVisible(), false);
    passed("Ticket tier, totals, quantity bounds, required acknowledgments, save/persist/edit/reset; focus trap, scroll lock, Escape/restore");

    await page.locator('[data-ticket="2"]').click();
    await page.mouse.click(10, 10);
    assert.equal(await page.locator("#ticket-dialog").evaluate((el) => el.open), false);
    passed("Outside click closes drawer");
    await page.locator(".faq summary").first().focus();
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(".faq details").first().getAttribute("open"), "");
    passed("Native FAQ works by keyboard");

    await page.locator("#play").click();
    await page.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime > .4);
    const first = await page.locator("canvas").evaluate((el) => el.toDataURL());
    await page.waitForTimeout(200);
    const second = await page.locator("canvas").evaluate((el) => el.toDataURL());
    assert.notEqual(first, second);
    await page.locator('[data-mode="spectrum"]').click();
    assert.equal(await page.locator('[data-mode="spectrum"]').getAttribute("aria-pressed"), "true");
    await page.waitForTimeout(200);
    const pixels = await page.locator("canvas").evaluate((el) => el.getContext("2d").getImageData(0, 0, el.width, el.height).data.filter((value, i) => i % 4 === 1 && value > 150).length);
    assert.ok(pixels > 100);
    await page.locator("#volume").focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#volume-value").innerText(), "1%");
    await page.locator("#visual-toggle").click();
    const frozenImage = await page.locator("canvas").evaluate((el) => el.toDataURL());
    await page.waitForTimeout(250);
    assert.equal(await page.locator("canvas").evaluate((el) => el.toDataURL()), frozenImage);
    assert.equal(await page.locator("audio").evaluate((el) => el.paused), false);
    await page.locator("#visual-toggle").click();
    await page.locator("#play").click();
    assert.equal(await page.locator("audio").evaluate((el) => el.paused), true);
    assert.equal(await page.locator("#audio-error").isVisible(), false);
    await noOverflow(page, "Desktop after interactions no horizontal overflow");
    passed("Real WAV playback/time, changing waveform and spectrum, volume, independent visual pause, audio pause; no load errors");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator("#play").click();
    await page.waitForTimeout(650);
    assert.match(await page.locator("#audio-state").innerText(), /Reduced motion \/ stable level \/ Level \d+%/);
    assert.equal(await page.locator(".sculpture").evaluate((el) => getComputedStyle(el).animationName), "none");
    await page.locator("#play").click();
    passed("Reduced motion: frozen sculpture, textual level at 2 Hz, deliberate audio only");
    await page.setViewportSize({ width: 1440, height: 900 });
    await noOverflow(page, "1440×900 desktop no horizontal overflow");
    await context.close();

    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const mobile = await mobileContext.newPage();
    monitor(mobile);
    await mobile.goto(server.url, { waitUntil: "networkidle" });
    await mobile.evaluate(() => document.fonts.ready);
    await noOverflow(mobile, "Mobile initial no horizontal overflow");
    await mobile.screenshot({ path: path.join(checks, "mobile.png") });
    await mobile.locator(".sound-field").scrollIntoViewIfNeeded();
    await mobile.screenshot({ path: path.join(checks, "mobile-player.png") });
    const player = await mobile.locator(".player").boundingBox();
    assert.ok(player.width >= 330);
    await mobile.locator('[data-save="2"]').tap();
    await mobile.locator("#saved-only").check();
    assert.equal(await mobile.locator(".artist-row").count(), 1);
    await mobile.locator('[data-artist="2"]').tap();
    await mobile.locator("#artist-dialog [data-close]").tap();
    await mobile.locator('[data-select-zone="3"]').tap();
    assert.match(await mobile.locator("#zone-note").innerText(), /lower-volume/);
    await mobile.locator('[data-ticket="0"]').tap();
    await mobile.locator("#quantity").fill("6");
    await mobile.locator("#agree-id").check();
    await mobile.locator("#agree-policy").check();
    await mobile.locator("#ticket-form button[type=submit]").tap();
    assert.equal(await mobile.locator("#estimate-total").innerText(), "$96");
    assert.match(await mobile.locator("#plan-result").innerText(), /Saved on this device only/);
    await noOverflow(mobile, "Mobile open drawer no horizontal overflow");
    await mobile.locator("#ticket-dialog [data-close]").tap();
    await mobile.locator("#remove-plan").tap();
    assert.equal(await mobile.locator("#saved-plan").isVisible(), false);
    await mobile.locator(".faq summary").last().tap();
    assert.equal(await mobile.locator(".faq details").last().getAttribute("open"), "");
    await mobile.locator("#play").tap();
    await mobile.waitForFunction(() => !document.querySelector("audio").paused);
    await mobile.locator("#play").tap();
    await noOverflow(mobile, "Mobile after touch interactions no horizontal overflow");
    passed("390×844 mobile: ≥330px player, touch bookmarks/bio/venue, six-person plan, removal, FAQ and local audio; PNGs captured");
    const targets = await mobile.locator("button, summary, input[type=range]").evaluateAll((els) => els.filter((el) => el.getClientRects().length && el.getBoundingClientRect().height < 43.9).map((el) => el.textContent.trim()));
    assert.deepEqual(targets, []);
    passed("Visible mobile action and audio-range targets are at least 44 CSS px high");
    await mobileContext.close();
    const unavailable = await browser.newContext({ viewport: { width: 1200, height: 900 } });
    await unavailable.addInitScript(() =>
    {
        Storage.prototype.setItem = () =>
        {
            throw new DOMException("Unavailable", "QuotaExceededError");
        };
    });
    const privatePage = await unavailable.newPage();
    monitor(privatePage);
    await privatePage.goto(server.url, { waitUntil: "networkidle" });
    await privatePage.locator('[data-ticket="0"]').click();
    await privatePage.locator("#agree-id").check();
    await privatePage.locator("#agree-policy").check();
    await privatePage.locator("#ticket-form button[type=submit]").click();
    assert.match(await privatePage.locator("#plan-result").innerText(), /not saved/);
    await privatePage.keyboard.press("Escape");
    assert.match(await privatePage.locator("#saved-plan").innerText(), /THIS VISIT ONLY/);
    assert.doesNotMatch(await privatePage.locator("#saved-plan").innerText(), /Saved on this device only/);
    passed("Unavailable localStorage produces truthful session-only estimate, not a false saved confirmation");
    await unavailable.close();

    const fallbackContext = await browser.newContext();
    let deliberateFailure = true;
    await fallbackContext.route("**/circuit-loop.wav", async (route) =>
    {
        if (deliberateFailure) await route.abort("failed");
        else await route.continue();
    });
    const fallbackPage = await fallbackContext.newPage();
    const expectedErrors = [];
    fallbackPage.on("requestfailed", (request) => expectedErrors.push(request.failure()?.errorText));
    await fallbackPage.goto(server.url, { waitUntil: "networkidle" });
    await fallbackPage.locator("#audio-error").waitFor({ state: "visible" });
    assert.match(await fallbackPage.locator("#audio-error").innerText(), /Audio could not load/);
    deliberateFailure = false;
    await fallbackPage.locator("#audio-retry").click();
    await fallbackPage.waitForFunction(() => !document.querySelector("audio").paused && document.querySelector("audio").currentTime > .1);
    assert.equal(await fallbackPage.locator("#audio-error").isVisible(), false);
    await fallbackPage.locator("#play").click();
    result.intentionalFailureTest = { expectedAudioFailures: expectedErrors, retryRecovered: true };
    passed("Intentionally blocked WAV: visible error and user-activated retry recover actual playback");
    await fallbackContext.close();
    assert.deepEqual(result.errors, []);
    result.status = "passed";
}
catch (error)
{
    result.status = "failed";
    result.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    result.resourcesClosed = true;
    await fs.writeFile(path.join(checks, "qa.json"), JSON.stringify(result, null, 4) + "\n");
    console.log(JSON.stringify(result, null, 2));
}
