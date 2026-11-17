import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exported = path.join(folder, "out");
const workspace = path.resolve(folder, "../../../..");
const report =
{
    startedAt: new Date().toISOString(),
    passed: false,
    viewports: [],
    assertions: [],
    errors: [],
    visualReviewed: false,
    resourcesClosed: false
};
let browser;
let server;
const record = (name) => report.assertions.push({ name, passed: true });

async function noOverflow(page, label)
{
    const dimensions = await page.evaluate(() => ({ viewport: innerWidth, body: document.body.scrollWidth, html: document.documentElement.scrollWidth }));
    assert.ok(dimensions.body <= dimensions.viewport + 1 && dimensions.html <= dimensions.viewport + 1, `${label}: ${JSON.stringify(dimensions)}`);
    record(`${label}: no horizontal overflow`);
}

async function close(page)
{
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "hidden" });
    assert.equal(await page.locator("#site").evaluate((element) => element.inert), false);
}

try
{
    await StaticHomepage.validateStaticOutput(exported, "esports-team-website", "GPT-6");
    record("Repository static resource and final subpath validation");
    server = await startPreviewServer(exported, { workspace });
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const mobile = viewport.width < 700;
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce", acceptDownloads: true });
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => errors.push(`request: ${request.url()} / ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        assert.ok(await page.locator("h1").isVisible());
        assert.ok((await page.locator("main").innerText()).length > 1500);
        assert.equal(await page.locator(".hero-image img").evaluate((image) => image.complete && image.naturalWidth > 100), true);
        await noOverflow(page, `${viewport.width} home before interaction`);
        record(`${viewport.width}: HTTP 200, meaningful homepage, real local group image and local fonts`);
        if (mobile)
        {
            await page.getByRole("button", { name: "Menu", exact: true }).click();
            await page.keyboard.press("Escape");
            assert.equal(await page.locator(".mobile-nav").isHidden(), true);
            await page.getByRole("button", { name: "Menu", exact: true }).click();
            await page.locator(".mobile-nav").getByRole("link", { name: "Roster", exact: true }).click();
            record("Mobile navigation opens, Escape closes and route selection closes");
        }
        else await page.locator(".desktop-nav").getByRole("link", { name: "Roster", exact: true }).click();
        await page.waitForURL(/#\/roster$/);
        await expect(page.locator("h1")).toHaveText("Different instincts. One read.");
        assert.equal(await page.locator(".player-card").count(), 5);
        await page.getByRole("button", { name: "Support 1", exact: true }).click();
        assert.equal(await page.locator(".player-card").count(), 1);
        assert.match(await page.locator(".result-count").innerText(), /1 results/);
        await page.locator(".player-card").focus();
        await page.keyboard.press("Enter");
        await page.locator("dialog").waitFor({ state: "visible" });
        assert.match(await page.locator("dialog").innerText(), /Tinker/);
        assert.equal(await page.locator(".stat-track").count(), 4);
        assert.equal(await page.locator("#site").evaluate((element) => element.inert), true);
        for (let index = 0; index < 10; index++) await page.keyboard.press("Tab");
        assert.equal(await page.locator("dialog").evaluate((element) => element.contains(document.activeElement)), true);
        await page.getByRole("button", { name: "Next player", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /Vexa/);
        await close(page);
        assert.equal(await page.locator(".player-card").evaluate((element) => element === document.activeElement), true);
        await noOverflow(page, `${viewport.width} roster after role filter and keyboard player dialog`);
        record(`${viewport.width}: roster filter count, keyboard opening, four stat bars, next player, focus trap/Escape/restoration`);

        await page.goto(`${server.url}#/matches`, { waitUntil: "networkidle" });
        assert.equal(await page.locator(".match-row").count(), 6);
        await page.getByRole("button", { name: "Results 4", exact: true }).click();
        assert.equal(await page.locator(".match-row").count(), 4);
        const firstMatch = page.locator(".match-row").first();
        await firstMatch.locator("summary").focus();
        await page.keyboard.press("Enter");
        assert.equal(await firstMatch.getAttribute("open"), "");
        assert.match(await firstMatch.innerText(), /Foundry 13–7/);
        const downloadPromise = page.waitForEvent("download");
        await firstMatch.getByRole("button", { name: "Download match card", exact: true }).click();
        const download = await downloadPromise;
        let text = "";
        for await (const chunk of await download.createReadStream()) text += chunk.toString();
        assert.match(text, /STV 2–1 Ochre Labs/);
        assert.match(text, /Mako 1.42/);
        await noOverflow(page, `${viewport.width} matches expanded and downloaded`);
        record(`${viewport.width}: six fixtures, results filtering, keyboard accordion, exact map scores and real text download contents`);

        await page.goto(`${server.url}#/shop`, { waitUntil: "networkidle" });
        assert.equal(await page.locator(".product-card").count(), 6);
        await page.getByRole("button", { name: "Accessories 3", exact: true }).click();
        assert.equal(await page.locator(".product-card").count(), 3);
        await page.getByRole("button", { name: "All 6", exact: true }).click();
        await page.locator(".product-card").first().getByRole("button", { name: "Quick view", exact: true }).click();
        await page.locator("#size").selectOption("L");
        await page.getByRole("button", { name: "Increase quantity", exact: true }).click();
        assert.equal(await page.locator("#quantity").inputValue(), "2");
        await page.getByRole("button", { name: "Add to cart", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /L \/ €64.00/);
        assert.match(await page.locator(".cart-total").innerText(), /€128.00/);
        await page.getByRole("button", { name: "Decrease Home Jersey quantity", exact: true }).click();
        assert.match(await page.locator(".cart-total").innerText(), /€64.00/);
        await close(page);
        await page.reload({ waitUntil: "networkidle" });
        assert.equal(await page.locator("#cart-count").innerText(), "1");
        await page.getByRole("button", { name: "Kit bag", exact: true }).click();
        await page.getByRole("button", { name: "Local demo checkout", exact: true }).click();
        await page.getByRole("button", { name: "Review demo order", exact: true }).click();
        assert.equal(await page.locator("#email").evaluate((element) => element.validity.valueMissing), true);
        await page.locator("#email").fill("fan@example.com");
        await page.locator("#country").fill("Netherlands");
        await page.getByRole("button", { name: "Review demo order", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /Order review \/ no payment/);
        await page.getByRole("button", { name: "Place demo order", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /No payment was taken and no email was sent/);
        assert.match(await page.locator("dialog").innerText(), /STV-DEMO-/);
        const saved = await page.evaluate(() => localStorage.getItem("static-vale-order"));
        assert.ok(saved && !saved.includes("fan@example.com"));
        await page.getByRole("button", { name: "Clear demo order", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /Your kit bag is empty/);
        await close(page);
        await page.locator(".product-card").last().getByRole("button", { name: "Add", exact: true }).click();
        await page.getByRole("button", { name: "Remove", exact: true }).click();
        assert.match(await page.locator("dialog").innerText(), /Your kit bag is empty/);
        await close(page);
        await noOverflow(page, `${viewport.width} shop after variants, quantities, persistence, checkout and removal`);
        record(`${viewport.width}: six distinct products, category filter, variant and stepper, accurate totals, persistent bag, required contact validation, local two-step order and clear/remove`);

        await page.goto(`${server.url}#/news`, { waitUntil: "networkidle" });
        assert.equal(await page.locator(".story-card").count(), 4);
        assert.match(await page.locator("#reader").innerText(), /Five maps, one calm finish/);
        await page.getByRole("button", { name: "Culture 1", exact: true }).click();
        assert.equal(await page.locator(".story-card").count(), 1);
        await page.getByRole("button", { name: "Read story", exact: true }).click();
        assert.match(await page.locator("#article-title").innerText(), /40-minute reset/);
        assert.equal(await page.locator("#article-title").evaluate((element) => element === document.activeElement), true);
        await page.getByRole("button", { name: "Next story", exact: true }).click();
        assert.match(await page.locator("#article-title").innerText(), /home kit/);
        await page.getByRole("button", { name: "Previous story", exact: true }).click();
        assert.match(await page.locator("#article-title").innerText(), /40-minute reset/);
        await noOverflow(page, `${viewport.width} news filtered and reader navigated`);
        record(`${viewport.width}: four complete articles, category filter, default reader, selected story/focused heading and previous/next`);
        await page.goto(`${server.url}#/not-a-route`, { waitUntil: "networkidle" });
        assert.equal(await page.locator(".hero").count(), 1);
        assert.equal(new URL(page.url()).hash, "");
        await page.getByRole("button", { name: "Kestrel, IGL", exact: true }).click();
        await close(page);
        await page.locator(".preview-products .product-card").first().getByRole("button", { name: "Quick view", exact: true }).click();
        await close(page);
        if (mobile)
        {
            await page.getByRole("button", { name: "Next players", exact: true }).click();
            assert.ok(await page.locator(".featured").evaluate((element) => element.scrollLeft > 0));
            await page.getByRole("button", { name: "Previous players", exact: true }).click();
        }
        await noOverflow(page, `${viewport.width} home after interactions and unknown route recovery`);
        await page.goto(server.url, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png") });
        await page.screenshot({ path: path.join(folder, ".checks", mobile ? "mobile-full.png" : "desktop-full.png"), fullPage: true });
        assert.deepEqual(errors, []);
        record(`${viewport.width}: zero HTTP/resource/request/console/page errors; actual screenshots saved`);
        report.viewports.push({ ...viewport, deviceScaleFactor: 1, reducedMotion: "reduce", errors });
        await context.close();
    }
    const normal = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const normalPage = await normal.newPage();
    await normalPage.goto(server.url, { waitUntil: "networkidle" });
    await normalPage.waitForTimeout(1000);
    await noOverflow(normalPage, "1440 normal-motion home");
    assert.equal(await normalPage.locator(".partner-track").evaluate((element) => getComputedStyle(element).animationName), "partners");
    await normalPage.locator(".partners").hover();
    assert.equal(await normalPage.locator(".partner-track").evaluate((element) => getComputedStyle(element).animationPlayState), "paused");
    record("1440×900 normal motion: visible final hero, sponsor animation pauses on hover");
    await normal.close();
    report.passed = true;
}
catch (error)
{
    report.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    report.resourcesClosed = true;
    report.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), report);
    console.log(JSON.stringify(report, null, 2));
}
