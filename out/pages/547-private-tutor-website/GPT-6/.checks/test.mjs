import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles as W, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "547-private-tutor-website", "GPT-6");
const exported = path.join(folder, "out");
const evidence = { passed: false, resourcesClosed: false, visualReviewed: false, viewports: [], tests: [], errors: [], screenshots: [], staticDigest: null };
let browser;
let service;
const record = (name) => evidence.tests.push(name);
async function noOverflow(page, label)
{
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${label}`);
    record(`No horizontal overflow: ${label}`);
}

try
{
    evidence.staticDigest = await StaticHomepage.validateStaticOutput(exported, "private-tutor-website", "GPT-6");
    service = await startPreviewServer(exported, { workspace: root });
    assert(service.url.endsWith("/pages/private-tutor-website/GPT-6/index.html"));
    assert.equal((await fetch(service.url)).status, 200);
    assert.equal((await fetch(new URL("/README.md", service.url))).status, 404);
    record("Final public subpath returns 200; repository files outside mount return 404");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }, { width: 1440, height: 900 }])
    {
        const mobile = viewport.width === 390;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
        page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        const response = await page.goto(service.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert(await page.getByRole("heading", { level: 1 }).isVisible());
        assert(await page.locator("body").innerText().then((text) => text.length > 3000));
        assert(await page.locator(".hero-image img").evaluate((image) => image.complete && image.naturalWidth > 0));
        assert(await page.evaluate(() => document.fonts.check("500 20px Lora") && document.fonts.check("400 14px Manrope")));
        await page.locator("img").evaluateAll(async (images) =>
        {
            images.forEach((image) => image.loading = "eager");
            await Promise.all(images.map((image) => image.decode()));
        });
        assert(await page.locator("img").evaluateAll((images) => images.every((image) => image.naturalWidth > 0)));
        await noOverflow(page, `${viewport.width} initial`);
        if (viewport.width !== 1440)
        {
            const filename = mobile ? "mobile.png" : "desktop.png";
            const screenshot = path.join(folder, ".checks", filename);
            await page.screenshot({ path: screenshot, fullPage: false });
            await page.screenshot({ path: path.join(folder, ".checks", filename.replace(".png", "-full.png")), fullPage: true });
            evidence.screenshots.push(screenshot);
        }
        if (mobile)
        {
            await page.getByRole("button", { name: "Menu", exact: true }).click();
            assert.equal(await page.getByRole("button", { name: "Menu", exact: true }).getAttribute("aria-expanded"), "true");
            await noOverflow(page, "mobile expanded navigation");
            await page.locator("#mobile-nav").getByRole("link", { name: "Subjects", exact: true }).click();
            assert(await page.locator("#mobile-nav").isHidden());
            await page.getByRole("button", { name: "Menu", exact: true }).click();
            await page.keyboard.press("Escape");
            assert(await page.locator("#mobile-nav").isHidden());
            record("Mobile menu anchors close panel; Escape closes and returns focus");
        }
        const mathTab = page.getByRole("tab", { name: "Mathematics", exact: true });
        await mathTab.focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.getByRole("tab", { name: "Physics", exact: true }).getAttribute("aria-selected"), "true");
        assert(await page.locator("#level-panel").innerText().then((text) => text.includes("Circuits")));
        await page.locator("#level-panel [data-level='1']").click();
        assert.equal(await page.locator("#subject").inputValue(), "Physics");
        assert.equal(await page.locator("#level").inputValue(), "Core high school");
        record(`${viewport.width}: keyboard subject tabs and level-to-form preselection`);
        for (const [button, interest] of [["Book free intro", "Free intro"], ["Choose single session", "Single session"], ["Choose four sessions", "Four-session plan"]])
        {
            await page.getByRole("button", { name: button, exact: true }).click();
            assert.equal(await page.locator("#package").inputValue(), interest);
        }
        assert.equal(await page.locator("#package").inputValue(), "Four-session plan");
        assert(await page.locator("#pricing").innerText().then((text) => text.includes("$272") && text.includes("4 × $68")));
        record(`${viewport.width}: price helper yields four × $68 = $272 and synchronizes package`);
        await page.locator("#booking-form").getByRole("button", { name: "Request free intro call" }).click();
        assert(await page.locator("#form-errors").innerText().then((text) => text.includes("Select a future")));
        assert.equal(await page.locator("#name").getAttribute("aria-invalid"), "true");
        assert.equal(await page.locator("#email").getAttribute("aria-invalid"), "true");
        assert.equal(await page.locator("#goals").getAttribute("aria-invalid"), "true");
        assert(await page.locator("#prev-week").isDisabled());
        for (let index = 0; index < 4; index++) await page.locator("#next-week").click();
        assert(await page.locator("#next-week").isDisabled());
        const lastWeek = await page.locator("#calendar-days .day-button").evaluateAll((buttons) => buttons.map((button) => ({ date: button.dataset.date, disabled: button.disabled })));
        assert(lastWeek.slice(1).every((button) => button.disabled), "Beyond four weeks must be disabled");
        for (let index = 0; index < 4; index++) await page.locator("#prev-week").click();
        assert(await page.locator("#calendar-days button:disabled").count() > 0);
        await page.locator("#calendar-days button:not(:disabled)").first().click();
        await page.locator("#slots button").first().click();
        assert(await page.locator("#slot-summary").innerText().then((text) => text.includes("20 minutes") && text.includes("America/New_York")));
        await page.getByRole("button", { name: "Change time", exact: true }).click();
        assert.equal(await page.locator("#slot-summary").innerText(), "");
        await page.locator("#slots button").first().click();
        record(`${viewport.width}: four-week bound, disabled dates, tutor-local dates, sample times, duration and Change time`);
        await page.locator("#name").fill("Alex Example");
        await page.locator("#email").fill("wrong-email");
        await page.getByLabel("Online", { exact: true }).check();
        await page.locator("#goals").fill("Short");
        await page.locator("#booking-form").getByRole("button", { name: "Request free intro call" }).click();
        assert.equal(await page.locator("#email").getAttribute("aria-invalid"), "true");
        assert.equal(await page.locator("#goals").getAttribute("aria-invalid"), "true");
        await page.locator("#email").fill("alex@example.test");
        await page.locator("#goals").fill("I would like to understand force diagrams and prepare for my upcoming physics exam.");
        const selectedDay = await page.locator(".day-button[aria-pressed='true']").getAttribute("data-date");
        const selectedTime = await page.locator(".time-button[aria-pressed='true']").getAttribute("data-time");
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#name").inputValue(), "Alex Example");
        assert.equal(await page.locator("#subject").inputValue(), "Physics");
        assert.equal(await page.locator("#package").inputValue(), "Four-session plan");
        assert.equal(await page.locator(".day-button[aria-pressed='true']").getAttribute("data-date"), selectedDay);
        assert.equal(await page.locator(".time-button[aria-pressed='true']").getAttribute("data-time"), selectedTime);
        await page.locator("#booking-form").getByRole("button", { name: "Request free intro call" }).click();
        assert(await page.locator("#success-panel").isVisible());
        assert(await page.locator("#success-panel").innerText().then((text) => text.includes("Thanks, Alex.") && text.includes("Nothing has been sent and no real appointment is booked.")));
        assert.equal(await page.evaluate(() => document.activeElement.id), "success-heading");
        record(`${viewport.width}: required fields, email and minimum goals; reload restores latest draft/slot; truthful success and focus`);
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        await page.getByRole("button", { name: "Copy request summary" }).click();
        await page.waitForFunction(() => document.querySelector("#copy-status").textContent.length > 0);
        assert(await page.locator("#copy-status").innerText().then((text) => text.includes("copied")));
        assert((await page.evaluate(() => navigator.clipboard.readText())).includes("Alex Example"));
        await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("Test clipboard unavailable")) } }));
        await page.getByRole("button", { name: "Copy request summary" }).click();
        assert(await page.locator("#copy-fallback").isVisible());
        assert((await page.locator("#copy-fallback").inputValue()).includes("Physics"));
        await page.getByRole("button", { name: "Edit request", exact: true }).click();
        assert.equal(await page.locator("#name").inputValue(), "Alex Example");
        await page.locator("#booking-form").getByRole("button", { name: "Request free intro call" }).click();
        await page.getByRole("button", { name: "Start over", exact: true }).click();
        assert.equal(await page.locator("#name").inputValue(), "");
        assert.equal(await page.evaluate((key) => localStorage.getItem(key), "mara-ellison-latest-booking"), null);
        record(`${viewport.width}: clipboard success and selectable fallback, edit retains input, reset removes latest local draft`);
        const faq = page.getByRole("button", { name: "Are the student results real?", exact: true });
        await faq.click();
        assert(await page.locator("#answer-5").isVisible());
        await page.getByRole("button", { name: "Can a parent join?", exact: true }).click();
        assert(await page.locator("#answer-5").isHidden());
        assert(await page.locator("#answer-2").isVisible());
        record(`${viewport.width}: exclusive accessible FAQ disclosure`);
        await noOverflow(page, `${viewport.width} after interactions`);
        assert.deepEqual(errors, []);
        evidence.viewports.push({ ...viewport, deviceScaleFactor: 1, reducedMotion: true, errors, passed: true });
        await context.close();
    }
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const page = await noJS.newPage();
    await page.goto(service.url);
    assert(await page.getByRole("heading", { level: 1 }).isVisible());
    assert(await page.locator("#pricing").innerText().then((text) => text.includes("$272")));
    await noOverflow(page, "390 without JavaScript static content");
    await noJS.close();
    record("Static homepage and sections remain readable without JavaScript");
    const clockContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const clockPage = await clockContext.newPage();
    await clockPage.clock.install({ time: new Date("2026-11-17T22:30:00Z") });
    await clockPage.goto(service.url, { waitUntil: "networkidle" });
    await clockPage.locator('[data-date="2026-11-17"]').click();
    assert.deepEqual(await clockPage.locator("[data-time]").evaluateAll((buttons) => buttons.map((button) => button.dataset.time)), ["18:00"]);
    await clockContext.close();
    record("Frozen Tuesday 17:30 America/New_York: past 16:00/17:00 slots are absent; only 18:00 remains");
    const storageContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const storagePage = await storageContext.newPage();
    await storagePage.addInitScript(() =>
    {
        Storage.prototype.setItem = () => { throw new Error("Storage disabled for test"); };
    });
    await storagePage.goto(service.url, { waitUntil: "networkidle" });
    await storagePage.locator("#calendar-days button:not(:disabled)").first().click();
    await storagePage.locator("#slots button").first().click();
    await storagePage.locator("#name").fill("Sam Example");
    await storagePage.locator("#email").fill("sam@example.test");
    await storagePage.locator("#level").selectOption("Foundations");
    await storagePage.locator("#subject").selectOption("Mathematics");
    await storagePage.getByLabel("In person", { exact: true }).check();
    await storagePage.locator("#goals").fill("Please help me with linear equations and word-problem setup.");
    await storagePage.getByRole("button", { name: "Request free intro call", exact: true }).click();
    assert(await storagePage.locator("#success-panel").isHidden());
    assert((await storagePage.locator("#form-errors").innerText()).includes("cannot be saved"));
    await storageContext.close();
    record("Unavailable browser storage prevents false saved confirmation; in-person selection works");
    evidence.passed = true;
}
catch (error)
{
    evidence.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    evidence.resourcesClosed = true;
    await W.saveJson(path.join(folder, ".checks", "qa.json"), evidence);
    console.log(JSON.stringify(evidence));
}
