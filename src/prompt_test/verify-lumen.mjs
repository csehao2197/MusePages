import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer, generatePreview } from "../workflows/script/generate-preview.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "out", "pages", "photo_equipment", "gpt-6.1-sol", "out");
const evidence = path.join(root, "src", "prompt_test", "lumen-checks");
await mkdir(evidence, { recursive: true });
const server = await startPreviewServer(output);
let browser;
const errors = [];
const checks = [];
function checked(name)
{
    checks.push(name);
    console.log(`PASS ${name}`);
}
try
{
    assert.equal((await fetch(server.url)).status, 200);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            errors.push(`${response.status()} ${response.url()}`);
        }
    });
    page.on("requestfailed", (request) => errors.push(request.failure()?.errorText || request.url()));
    await page.goto(server.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), "LUMEN — Capture Beyond Imagination");
    assert.equal(await page.locator(".feature").count(), 6);
    assert.equal(await page.locator(".lens-card").count(), 3);
    await page.evaluate(async () =>
    {
        for (const image of document.images)
        {
            image.loading = "eager";
        }
        await Promise.all([...document.images].map((image) => image.decode()));
    });
    assert.equal(await page.evaluate(() => [...document.images].filter((image) => !image.naturalWidth).length), 0);
    const brokenAnchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map((link) => link.getAttribute("href")).filter((href) => !document.getElementById(href.slice(1))));
    assert.deepEqual(brokenAnchors, []);
    checked("All 6 features, 3 lenses, local images, and navigation anchors load");
    await page.evaluate(async () =>
    {
        for (let position = 0; position < document.body.scrollHeight; position += 600)
        {
            window.scrollTo(0, position);
            await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidence, "desktop.png"), fullPage: true });
    checked("Desktop full-page rendering captured");

    await page.getByRole("button", { name: "Explore the control dials", exact: true }).click();
    assert.equal(await page.locator("#component-title").textContent(), "Keep your eyes on the moment.");
    await page.getByRole("button", { name: "Lens detail", exact: true }).click();
    assert.equal(await page.locator(".camera-stage").getAttribute("data-view"), "lens");
    assert.equal(await page.locator("#component-number").textContent(), "03 / THE LENS MOUNT");
    await page.getByRole("button", { name: "Full specifications" }).click();
    assert.equal(await page.locator("#info-dialog").evaluate((dialog) => dialog.open), true);
    assert.match(await page.locator("#info-content").textContent(), /High-resolution electronic viewfinder/);
    await page.keyboard.press("Escape");
    checked("Camera hotspots, detail views, specification dialog, and Escape dismissal");

    await page.getByRole("button", { name: "Portrait", exact: true }).click();
    assert.equal(await page.locator(".gallery-item:visible").count(), 1);
    await page.locator('[data-gallery="portrait"]').click();
    assert.equal(await page.locator("#lightbox-image").getAttribute("alt"), "Studio portrait of a woman with soft blue directional lighting");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "All perspectives", exact: true }).click();
    assert.equal(await page.locator(".gallery-item:visible").count(), 6);
    checked("Gallery filtering, lightbox, and restoring all 6 categories");

    await page.locator('input[value="kit"]').check();
    assert.equal(await page.locator("#purchase-price").textContent(), "$5,398");
    assert.match(await page.locator("#finance-price").textContent(), /449\.83/);
    await page.locator("#add-camera").click();
    await page.locator('.add-product[data-product="prime"]').click();
    await page.locator(".cart-toggle").click();
    assert.equal(await page.locator("#bag-count").textContent(), "2");
    assert.equal(await page.locator("#cart-subtotal").textContent(), "$6,897");
    await page.locator('[data-id="prime"][data-change="1"]').click();
    assert.equal(await page.locator("#cart-subtotal").textContent(), "$8,396");
    await page.locator('[data-id="prime"][data-change="-1"]').click();
    await page.locator('[data-remove="prime"]').click();
    assert.equal(await page.locator("#cart-subtotal").textContent(), "$5,398");
    await page.locator("#checkout").click();
    assert.match(await page.locator("#info-content").textContent(), /Subtotal: \$5,398/);
    assert.match(await page.locator("#info-content").textContent(), /No purchase is placed/);
    await page.locator("#back-to-bag").click();
    await page.keyboard.press("Escape");
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".cart-toggle").click();
    assert.equal(await page.locator("#cart-subtotal").textContent(), "$5,398");
    await page.locator('[data-remove="kit"]').click();
    assert.equal(await page.locator("#cart-summary").isVisible(), false);
    await page.locator("#continue-shopping").click();
    checked("Kit pricing, add/increase/decrease/remove, exact subtotal, demo order, persistence, and empty bag");

    await page.locator('.lens-card [data-explore][data-product="zoom"]').click();
    assert.match(await page.locator("#info-content").textContent(), /24–70mm focal range/);
    await page.locator("#add-explored").click();
    assert.equal(await page.locator(".cart-count").textContent(), "1");
    await page.evaluate(() => localStorage.setItem("lumen-cart-v1", '{"kit":-3,"zoom":1.2,"prime":100,"evil":5}'));
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".cart-count").isVisible(), false);
    await page.evaluate(() => localStorage.setItem("lumen-cart-v1", "malformed"));
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".cart-count").isVisible(), false);
    checked("Lens exploration and invalid saved-cart recovery");

    await page.locator("#watch-film").click();
    assert.equal(await page.locator("#film-play").textContent(), "Pause film");
    await page.waitForFunction(() => document.querySelector("#film-progress").textContent === "02 / 03", { timeout: 7000 });
    await page.locator("#film-play").click();
    const frame = await page.locator("#film-progress").textContent();
    await page.waitForTimeout(500);
    assert.equal(await page.locator("#film-progress").textContent(), frame);
    await page.keyboard.press("Escape");
    checked("Photographic film playback, pause, and close");

    for (const topic of ["connectivity", "engineering", "journal", "contact", "warranty", "downloads", "social", "privacy", "terms", "credits"])
    {
        await page.locator(`[data-info="${topic}"]`).first().click();
        assert.equal(await page.locator("#info-dialog").evaluate((dialog) => dialog.open), true);
        assert.ok((await page.locator("#info-content").textContent()).length > 80);
        if (topic === "downloads")
        {
            const download = page.waitForEvent("download");
            await page.locator("#info-content [download]").click();
            assert.equal((await download).suggestedFilename(), "lumen-x1-specifications.txt");
        }
        await page.keyboard.press("Escape");
    }
    checked("All support/editorial/legal panels and actual specification download");

    for (const width of [320, 390, 768, 1200, 1440])
    {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Horizontal overflow at ${width}px`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(server.url, { waitUntil: "networkidle" });
    await page.locator(".menu-toggle").click();
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
    await page.locator("#main-nav a").filter({ hasText: "Lenses" }).click();
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    await page.locator(".menu-toggle").click();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    await page.locator("#add-camera").click();
    await page.locator(".cart-toggle").click();
    assert.equal(await page.locator("#cart-subtotal").textContent(), "$3,499");
    await page.screenshot({ path: path.join(evidence, "mobile-cart.png") });
    await page.keyboard.press("Escape");
    await page.evaluate(async () =>
    {
        for (let position = 0; position < document.body.scrollHeight; position += 600)
        {
            window.scrollTo(0, position);
            await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidence, "mobile.png"), fullPage: true });
    checked("No overflow at 320/390/768/1200/1440px; mobile menu, cart, and full-page screenshots");

    const accessibleContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const accessiblePage = await accessibleContext.newPage();
    await accessiblePage.addInitScript(() =>
    {
        Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage blocked"); } });
    });
    await accessiblePage.goto(server.url, { waitUntil: "networkidle" });
    await accessiblePage.locator("#add-camera").click();
    await accessiblePage.locator(".cart-toggle").click();
    assert.equal(await accessiblePage.locator("#cart-subtotal").textContent(), "$3,499");
    await accessiblePage.keyboard.press("Escape");
    await accessiblePage.locator("#watch-film").click();
    assert.equal(await accessiblePage.locator("#film-play").textContent(), "Play film");
    assert.equal(await accessiblePage.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), "auto");
    await accessiblePage.keyboard.press("Escape");
    assert.equal(await accessiblePage.locator("#watch-film").evaluate((button) => document.activeElement === button), true);
    await accessibleContext.close();
    checked("Storage-blocked cart fallback, reduced-motion film, and modal focus restoration");
    assert.deepEqual(errors, []);
    checked("No JavaScript exceptions, failed network requests, or HTTP resource errors");
}
finally
{
    await browser?.close();
    await server.close();
}
const preview = await generatePreview(output);
console.log(JSON.stringify(preview));
checked("Repository preview generator produced actual 1200 × 900 homepage preview");
await writeFile(path.join(evidence, "report.json"), JSON.stringify({ modelId: "gpt-6.1-sol", timestamp: new Date().toISOString(), checks, errors, built: false, published: false }, null, 4) + "\n");
console.log(`${checks.length} verification groups passed. Browser and loopback server closed.`);
