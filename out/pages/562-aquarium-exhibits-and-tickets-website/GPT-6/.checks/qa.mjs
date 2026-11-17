import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const workspace = process.cwd();
const prompt = "562-aquarium-exhibits-and-tickets-website";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const exported = path.join(folder, "out");
const { WorkspaceFiles: W, StaticHomepage } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(workspace, "src", "workflows", "script", "generate-preview.mjs")));
const result =
{
    prompt,
    modelId: "gpt-6.1-sol",
    passed: false,
    staticPassed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: [],
    resourcesClosed: false
};
let browser;
let service;

function check(name, condition, evidence)
{
    result.assertions.push({ name, passed: Boolean(condition), evidence });
    assert.ok(condition, name);
}

async function noOverflow(page, name)
{
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
    check(name, sizes.document <= sizes.viewport && sizes.body <= sizes.viewport, sizes);
}

async function settled(page)
{
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () =>
    {
        await document.fonts.ready;
        await Promise.all([...document.images].filter((image) => image.loading !== "lazy").map((image) => image.decode()));
    });
}

function observe(page)
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
    const digest = await StaticHomepage.validateStaticOutput(exported, "aquarium-exhibits-and-tickets-website", "GPT-6");
    check("Independent static output and final-subpath references", /^[0-9a-f]{64}$/.test(digest), digest);
    result.staticPassed = true;
    result.staticDigest = digest;
    service = await startPreviewServer(exported, { workspace });
    check("Preview serves only the actual final static subpath", service.url.endsWith("/pages/aquarium-exhibits-and-tickets-website/GPT-6/index.html"), service.url);
    const readiness = await fetch(service.url);
    check("Owned preview server is responsive", readiness.status === 200, readiness.status);
    check("Repository root is not served", (await fetch(new URL("/", service.url))).status === 404);
    browser = await chromium.launch({ headless: true });

    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const label = viewport.width === 1200 ? "desktop" : "mobile";
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        observe(page);
        result.viewports.push({ ...viewport, deviceScaleFactor: 1 });
        const response = await page.goto(service.url);
        await settled(page);
        await page.waitForTimeout(1000);
        check(`${label}: homepage HTTP 200`, response.status() === 200);
        check(`${label}: meaningful visible hero`, await page.locator("h1").isVisible() && (await page.locator("h1").innerText()).includes("Aurelia"));
        check(`${label}: all six specified local animal photographs`, await page.locator('img[src^="./images/"]').count() === 6);
        check(`${label}: five zones, four residents and three informational membership tiers`,
            await page.locator(".zone-card").count() === 5 && await page.locator(".resident-card").count() === 4 && await page.locator(".membership-card").count() === 3);
        await noOverflow(page, `${label}: no initial horizontal overflow`);
        await page.screenshot({ path: path.join(folder, ".checks", `${label}.png`) });
        result.screenshots.push(`.checks\\${label}.png`);
        await page.emulateMedia({ reducedMotion: "reduce" });
        const reduced = await page.locator(".hero-portrait").evaluate((element) => getComputedStyle(element).animationName);
        check(`${label}: reduced motion stops portrait animation`, reduced === "none", reduced);
        const causticStopped = await page.locator(".caustic-mesh").first().evaluate((element) => getComputedStyle(element).animationName);
        check(`${label}: reduced motion stops caustic drift`, causticStopped === "none");

        if (label === "mobile")
        {
            const menu = page.locator(".menu-button");
            await menu.focus();
            await page.keyboard.press("Enter");
            check("mobile: keyboard opens navigation", await menu.getAttribute("aria-expanded") === "true" && await page.locator("#mobile-nav").isVisible());
            await page.keyboard.press("Escape");
            check("mobile: Escape closes navigation and returns focus", await menu.getAttribute("aria-expanded") === "false" && await menu.evaluate((element) => document.activeElement === element));
            await menu.click();
            check("mobile: pointer click keeps the drawer open after icon replacement", await menu.getAttribute("aria-expanded") === "true" && await page.locator("#mobile-nav").isVisible());
            await page.locator("#mobile-nav").getByRole("link", { name: "Tickets", exact: true }).click();
            check("mobile: drawer link navigates and closes", page.url().endsWith("#tickets") && !await page.locator("#mobile-nav").isVisible());
        }
        else
        {
            await page.keyboard.press("Tab");
            check("desktop: skip link is keyboard reachable", await page.getByRole("link", { name: "Skip to content" }).evaluate((element) => document.activeElement === element));
            await page.keyboard.press("Enter");
            check("desktop: keyboard skip reaches main content", page.url().endsWith("#main"));
        }

        await page.locator('[data-map="4"]').focus();
        await page.keyboard.press("Enter");
        check(`${label}: keyboard floor map reaches Twilight Depths`, page.url().endsWith("#zone-4") && await page.locator("#zone-4").evaluate((element) => document.activeElement === element));
        await page.waitForTimeout(100);
        check(`${label}: map follows active zone`, await page.locator('[data-map="4"]').evaluate((element) => element.classList.contains("active")));
        check(`${label}: Saturday sample has six events`, await page.locator("#events li").count() === 6);
        await page.locator('[data-group="schedule"][data-day="MON"]').click();
        check(`${label}: weekday filter has four events`, await page.locator("#events li").count() === 4);
        const friday = page.locator('[data-group="schedule"][data-day="FRI"]');
        await friday.focus();
        await page.keyboard.press("ArrowRight");
        check(`${label}: arrow-key day filter selects weekend`, await page.locator("#events li").count() === 6 && await page.locator('[data-group="schedule"][data-day="SAT"]').getAttribute("aria-pressed") === "true");
        await page.locator('[data-group="schedule"][data-day="MON"]').focus();
        await page.keyboard.press("End");
        check(`${label}: End key selects Sunday`, await page.locator('[data-group="schedule"][data-day="SUN"]').getAttribute("aria-pressed") === "true");
        check(`${label}: sample schedule disclaimer`, (await page.locator("#schedule").innerText()).includes("Sample week — a planning pattern, not a live calendar."));

        await page.locator("#tickets").scrollIntoViewIfNeeded();
        await page.evaluate(() => window.scrollTo(0, document.querySelector("#tickets").offsetTop - 72));
        await page.screenshot({ path: path.join(folder, ".checks", `tickets-${label}.png`) });
        result.screenshots.push(`.checks\\tickets-${label}.png`);
        if (label === "mobile")
        {
            await page.evaluate(() => window.scrollTo(0, document.querySelector(".picker-card").getBoundingClientRect().top + scrollY - 104));
            await page.screenshot({ path: path.join(folder, ".checks", "picker-mobile.png") });
            result.screenshots.push(".checks\\picker-mobile.png");
        }
        check(`${label}: initial ticket total is $48`, await page.locator("#total").innerText() === "$48");
        check(`${label}: sold-out 13:30 slot is disabled`, await page.locator('[data-slot="13:30"]').isDisabled());
        await page.locator('[data-slot="15:15"]').focus();
        await page.keyboard.press("Enter");
        check(`${label}: keyboard can select a valid slot`, await page.locator('[data-slot="15:15"]').getAttribute("aria-pressed") === "true");
        await page.getByRole("button", { name: "Increase youth count", exact: true }).click();
        await page.getByRole("button", { name: "Increase senior count", exact: true }).click();
        check(`${label}: all guest prices affect total`, await page.locator("#total").innerText() === "$76");
        await page.locator('[data-group="visit"][data-day="SUN"]').click();
        await page.locator("#save-visit").focus();
        await page.keyboard.press("Enter");
        check(`${label}: save confirms only device storage`, await page.locator("#confirmation").isVisible() && (await page.locator("#confirmation").innerText()).includes("nothing reserved"));
        const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("lumen-bay-aquarium-visit")));
        check(`${label}: exact saved visit`, stored.day === "SUN" && stored.slot === "15:15" && stored.adult === 2 && stored.youth === 1 && stored.senior === 1, stored);
        await noOverflow(page, `${label}: no overflow after saved confirmation`);
        await page.reload();
        await settled(page);
        check(`${label}: persisted pick rehydrates after reload`, await page.locator("#total").innerText() === "$76" && await page.locator("#confirmation").isVisible() && await page.locator('[data-group="visit"][data-day="SUN"]').getAttribute("aria-pressed") === "true");
        await page.locator("#edit-visit").click();
        check(`${label}: saved pick can be edited`, await page.locator("#save-visit").isVisible() && !await page.locator("#confirmation").isVisible());

        for (const [id, count] of [["adult", 2], ["youth", 1], ["senior", 1]])
        {
            for (let index = 0; index < count; index++)
            {
                await page.getByRole("button", { name: `Decrease ${id} count`, exact: true }).click();
            }
            check(`${label}: ${id} cannot go below zero`, await page.getByRole("button", { name: `Decrease ${id} count`, exact: true }).isDisabled());
        }
        await page.locator("#save-visit").click();
        check(`${label}: zero-guest pick rejected with useful message`, (await page.locator("#ticket-message").innerText()).includes("at least one guest") && !await page.locator("#confirmation").isVisible());
        for (let index = 0; index < 12; index++)
        {
            await page.getByRole("button", { name: "Increase adult count", exact: true }).click();
        }
        check(`${label}: guest count is capped at twelve`, await page.getByRole("button", { name: "Increase adult count", exact: true }).isDisabled() && await page.locator("#count-adult").innerText() === "12" && await page.locator("#total").innerText() === "$288");
        await page.locator('[data-slot="11:00"]').click();
        check(`${label}: few-left slot remains selectable`, await page.locator('[data-slot="11:00"]').getAttribute("aria-pressed") === "true");
        await noOverflow(page, `${label}: no overflow after all ticket interactions`);

        await page.evaluate(() => localStorage.setItem("lumen-bay-aquarium-visit", "{not-json"));
        await page.reload();
        await settled(page);
        check(`${label}: corrupt storage safely falls back`, await page.locator("#total").innerText() === "$48" && (await page.locator("#ticket-message").innerText()).includes("could not be read"));
        await page.evaluate(() => localStorage.setItem("lumen-bay-aquarium-visit", JSON.stringify({ day: "SAT", slot: "13:30", adult: 2, youth: 0, senior: 0 })));
        await page.reload();
        await settled(page);
        check(`${label}: sold-out saved state is rejected`, await page.locator('[data-slot="09:30"]').getAttribute("aria-pressed") === "true" && !await page.locator("#confirmation").isVisible());
        await page.evaluate(() =>
        {
            Storage.prototype.setItem = function ()
            {
                throw new DOMException("Storage denied", "SecurityError");
            };
        });
        await page.locator("#save-visit").click();
        check(`${label}: storage denial never claims a save`, !await page.locator("#confirmation").isVisible() && (await page.locator("#ticket-message").innerText()).includes("could not save"));
        await page.reload();
        await settled(page);
        for (const image of await page.locator("img").all())
        {
            await image.scrollIntoViewIfNeeded();
        }
        await settled(page);
        const images = await page.locator("img").evaluateAll((elements) => elements.map((image) => ({ path: image.getAttribute("src"), loaded: image.complete && image.naturalWidth > 0 })));
        check(`${label}: every local photo decodes`, images.every((image) => image.loaded), images);
        check(`${label}: all six local font weights load`, await page.evaluate(() => [...document.fonts].length === 6 && [...document.fonts].every((font) => font.status === "loaded")));
        await noOverflow(page, `${label}: no final horizontal overflow`);
        const externalRequests = await page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => new URL(entry.name).origin !== location.origin).map((entry) => entry.name));
        check(`${label}: no external runtime dependencies`, externalRequests.length === 0, externalRequests);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(folder, ".checks", `full-${label}.png`), fullPage: true });
        result.screenshots.push(`.checks\\full-${label}.png`);
        await context.close();
    }

    const responsiveContext = await browser.newContext({ reducedMotion: "reduce" });
    const responsive = await responsiveContext.newPage();
    observe(responsive);
    for (const width of [320, 768, 1024])
    {
        await responsive.setViewportSize({ width, height: 900 });
        await responsive.goto(service.url);
        await settled(responsive);
        await noOverflow(responsive, `responsive ${width}px: no initial overflow`);
        await responsive.locator("#tickets").scrollIntoViewIfNeeded();
        await responsive.locator('[data-slot="11:00"]').click();
        await responsive.locator("#save-visit").click();
        await noOverflow(responsive, `responsive ${width}px: no interaction overflow`);
        await responsive.evaluate(() => localStorage.clear());
    }
    await responsiveContext.close();
    check("No HTTP, request, console or page errors across all browser checks", result.errors.length === 0, result.errors);
    result.passed = true;
}
catch (error)
{
    result.errors.push(error.stack || String(error));
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (service) await service.close();
    result.resourcesClosed = true;
    await W.saveJson(path.join(folder, ".checks", "qa.json"), result);
    console.log(JSON.stringify({ passed: result.passed, assertions: result.assertions.length, errors: result.errors, resourcesClosed: result.resourcesClosed }));
}
