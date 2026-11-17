import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const folder = path.join(root, "out", "pages", "585-indie-game-launch-page", "GPT-6");
const evidence = path.join(folder, ".checks");
const report =
{
    prompt: "585-indie-game-launch-page",
    modelId: "gpt-6.1-sol",
    executedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    assertions: [],
    errors: [],
    viewports: [],
    screenshots: {},
    resourcesClosed: false
};
let server;
let browser;
function passed(name)
{
    report.assertions.push(name);
}
async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
    assert.ok(sizes.content <= sizes.viewport, `${label}: overflow ${JSON.stringify(sizes)}`);
    passed(`${label}: no horizontal overflow`);
}
async function visibleAll(page)
{
    await page.evaluate(() =>
    {
        document.documentElement.style.scrollBehavior = "auto";
    });
    for (const section of await page.locator("main > section").all())
    {
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(70);
    }
    await page.waitForTimeout(1100);
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        await Promise.all([...document.images].map((image) => image.decode()));
    });
}
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    assert.ok(server.url.endsWith("/pages/indie-game-launch-page/GPT-6/index.html"));
    const response = await fetch(server.url);
    assert.equal(response.status, 200);
    assert.equal((await fetch(new URL("/", server.url))).status, 404);
    assert.equal((await fetch(new URL("metadata.json", server.url))).status, 404);
    passed("Static server responsive, final public subpath correct, repository/source inaccessible");
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 600;
        const label = mobile ? "mobile" : "desktop";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
        const page = await context.newPage();
        const errors = [];
        const requests = [];
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        page.on("request", (request) => requests.push({ url: request.url(), method: request.method() }));
        const navigation = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(navigation.status(), 200);
        assert.equal(await page.title(), "Emberveil — a hand-painted adventure by Hollowmoor Games");
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.equal(await page.locator("h1").textContent(), "Emberveil");
        assert.ok(await page.locator("h1").isVisible());
        assert.ok((await page.locator("body").innerText()).length > 2500);
        assert.equal(await page.locator(".motes i").count(), 12);
        await page.evaluate(() => document.fonts.ready);
        await noOverflow(page, `${label} initial`);
        passed(`${label}: visible meaningful English homepage and 12 ember motes`);

        if (mobile)
        {
            await page.locator(".menu-toggle").tap();
            assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
            await page.keyboard.press("Escape");
            assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
            await page.locator(".menu-toggle").tap();
            await page.locator('#navigation a[href="#world"]').tap();
            assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
            assert.equal(new URL(page.url()).hash, "#world");
            passed("mobile: touch navigation, Escape close, anchor navigation");
        }
        else
        {
            await page.keyboard.press("Tab");
            assert.equal(await page.locator(":focus").innerText(), "Skip to the story");
            await page.keyboard.press("Enter");
            assert.equal(new URL(page.url()).hash, "#story");
            passed("desktop: keyboard skip navigation");
        }

        await visibleAll(page);
        for (const image of await page.locator("img").all())
        {
            assert.ok(await image.evaluate((element) => element.complete && element.naturalWidth > 0));
        }
        for (const anchor of await page.locator('a[href^="#"]').all())
        {
            const href = await anchor.getAttribute("href");
            assert.equal(await page.locator(href).count(), 1);
        }
        assert.equal(await page.locator(".scene").count(), 3);
        passed(`${label}: all paintings/fonts load, three feature beats, every internal anchor resolves`);
        await page.locator('[data-location="1"]').click();
        assert.equal(await page.locator(".location-name").innerText(), "The Quiet Spire");
        assert.equal(await page.locator('[data-location="1"]').getAttribute("aria-pressed"), "true");
        await page.locator('[data-location="1"]').focus();
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator(".location-name").innerText(), "Mothlight Mere");
        await page.keyboard.press("Home");
        assert.equal(await page.locator(".location-name").innerText(), "Briar Hollow");
        await page.keyboard.press("End");
        assert.equal(await page.locator(".location-name").innerText(), "Mothlight Mere");
        await page.keyboard.press("ArrowRight");
        assert.equal(await page.locator(".location-name").innerText(), "Briar Hollow");
        passed(`${label}: all three lore locations and arrow/Home/End keyboard loop`);

        await page.locator(".play-button").click();
        assert.equal(await page.locator("video, iframe, dialog").count(), 0);
        assert.ok(await page.locator(".play-button").evaluate((element) => element.classList.contains("nudged")));
        assert.ok((await page.locator(".trailer-disclosure").innerText()).includes("no video"));
        passed(`${label}: honest trailer nudge only; no video, embed, or modal`);

        for (const store of await page.locator(".store-button").all())
        {
            await store.click();
            assert.equal(new URL(page.url()).hash, "#wishlist");
        }
        assert.equal(await page.locator(".store-button").count(), 3);
        passed(`${label}: all three generic store buttons lead only to local wishlist`);
        await page.locator(".wishlist-toggle").click();
        assert.equal(await page.locator(".wishlist-toggle").getAttribute("aria-pressed"), "true");
        assert.equal(await page.evaluate(() => localStorage.getItem("emberveil-wishlist")), "saved");
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator(".wishlist-toggle").getAttribute("aria-pressed"), "true");
        await page.locator(".wishlist-toggle").click();
        assert.equal(await page.locator(".wishlist-toggle").getAttribute("aria-pressed"), "false");
        assert.equal(await page.evaluate(() => localStorage.getItem("emberveil-wishlist")), null);
        passed(`${label}: local wishlist add, persistence across reload, removal`);
        await page.locator('#newsletter [type="submit"]').click();
        assert.equal(await page.locator("#email").getAttribute("aria-invalid"), "true");
        await page.locator("#email").fill("not-an-email");
        await page.locator('#newsletter [type="submit"]').click();
        assert.ok((await page.locator("#form-status").innerText()).includes("valid email"));
        await page.locator("#email").fill("wanderer@example.com");
        await page.locator('#newsletter [type="submit"]').click();
        assert.ok((await page.locator("#form-status").innerText()).includes("acknowledge"));
        await page.locator("#consent").check();
        const beforeSubmit = requests.length;
        await page.locator('#newsletter [type="submit"]').click();
        assert.ok((await page.locator("#form-status").innerText()).includes("was not sent or saved"));
        assert.equal(await page.locator("#email").inputValue(), "");
        assert.equal(await page.locator("#email").isDisabled(), true);
        await page.waitForTimeout(150);
        assert.equal(requests.length, beforeSubmit);
        assert.ok(!(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).includes("wanderer"));
        await page.locator(".reset-form").click();
        assert.equal(await page.locator("#email").isDisabled(), false);
        assert.equal(await page.locator("#consent").isChecked(), false);
        passed(`${label}: empty/invalid email, consent, valid local form, no request or email storage, reset`);
        await noOverflow(page, `${label} after interactions`);

        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(await page.locator(".motes").evaluate((element) => getComputedStyle(element).display), "none");
        assert.equal(await page.locator(".scene img").first().evaluate((element) => getComputedStyle(element).transform), "matrix(1.02, 0, 0, 1.02, 0, 0)");
        await page.emulateMedia({ reducedMotion: "no-preference" });
        if (!mobile)
        {
            await page.locator(".scene").first().scrollIntoViewIfNeeded();
            const bounds = await page.locator(".scene").first().boundingBox();
            await page.mouse.move(bounds.x + bounds.width * .9, bounds.y + bounds.height * .6);
            await page.waitForTimeout(200);
            const pointer = await page.locator(".scene").first().evaluate((element) => Number.parseFloat(element.style.getPropertyValue("--px")));
            assert.ok(pointer > .5 && pointer <= 2.5);
            passed("desktop: fine-pointer lerped parallax produces bounded movement");
        }
        passed(`${label}: reduced-motion disables motes and uses static scale 1.02`);
        await visibleAll(page);
        await page.locator("#world").scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await page.screenshot({ path: path.join(evidence, `${label}-world.png`) });
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        await noOverflow(page, `${label} fresh screenshot`);
        const screenshot = path.join(evidence, `${label}.png`);
        await page.screenshot({ path: screenshot });
        report.screenshots[label] = screenshot;
        assert.deepEqual(errors, []);
        assert.ok(requests.every((request) => request.method === "GET" && new URL(request.url).origin === new URL(server.url).origin));
        passed(`${label}: zero HTTP/resource/request/console/page errors; all requests local GET`);
        report.viewports.push({ ...viewport, deviceScaleFactor: 1, touch: mobile, errors, requestCount: requests.length });
        await context.close();
    }
    const deniedContext = await browser.newContext();
    await deniedContext.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage unavailable", "SecurityError"); } });
    });
    const deniedPage = await deniedContext.newPage();
    await deniedPage.goto(server.url, { waitUntil: "networkidle" });
    await deniedPage.locator(".wishlist-toggle").click();
    assert.ok((await deniedPage.locator(".wishlist-status").innerText()).includes("this visit only"));
    assert.equal(await deniedPage.locator(".wishlist-toggle").getAttribute("aria-pressed"), "true");
    await deniedContext.close();
    passed("Storage denied: wishlist remains functional with truthful visit-only disclosure");
    report.passed = true;
}
catch (error)
{
    report.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    report.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(evidence, "qa.json"), report);
    console.log(JSON.stringify(report, null, 2));
}
