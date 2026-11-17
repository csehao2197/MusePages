import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(folder, "..", "..", "..", "..");
const exported = path.join(folder, "out");
const qa =
{
    prompt: "534-zedian-uxui-design-portfolio",
    modelId: "gpt-6.1-sol",
    timestamp: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    resourcesClosed: false,
    staticDigest: null,
    viewports: [],
    tests: [],
    errors: [],
    screenshots: {}
};
let server;
let browser;
function check(name, condition)
{
    assert.ok(condition, name);
    qa.tests.push({ name, passed: true });
}
async function noOverflow(page, label)
{
    const measure = await page.evaluate(() =>
    ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth
    }));
    check(`${label}: no horizontal overflow (${measure.scroll}/${measure.client})`, measure.scroll <= measure.client + 1);
}
async function settle(page)
{
    await page.waitForTimeout(750);
}
try
{
    check("Source check recognizes actual HTML homepage", await StaticHomepage.checkSource(folder) === "html");
    qa.staticDigest = await StaticHomepage.validateStaticOutput(exported, "zedian-uxui-design-portfolio", "GPT-6");
    check("Independent static resources pass final subpath validation", Boolean(qa.staticDigest));
    server = await startPreviewServer(exported, { workspace });
    qa.url = server.url;
    check("Preview mounted at exact final public subpath", new URL(server.url).pathname === "/pages/zedian-uxui-design-portfolio/GPT-6/index.html");
    check("Owned preview server responds successfully", (await fetch(server.url)).status === 200);
    check("Preview does not expose repository root", (await fetch(new URL("/README.md", server.url))).status === 404);
    browser = await chromium.launch({ headless: true });
    for (const device of
    [
        { name: "desktop", viewport: { width: 1200, height: 900 }, isMobile: false, hasTouch: false },
        { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
    ])
    {
        const context = await browser.newContext({ viewport: device.viewport, deviceScaleFactor: 1, isMobile: device.isMobile, hasTouch: device.hasTouch, permissions: ["clipboard-read", "clipboard-write"] });
        try
        {
            const page = await context.newPage();
            const errors = [];
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
            const response = await page.goto(server.url, { waitUntil: "networkidle" });
            check(`${device.name}: homepage HTTP 200`, response.status() === 200);
            await page.evaluate(() => document.fonts.ready);
            await settle(page);
            check(`${device.name}: meaningful nonblank hero visible`, await page.locator("h1").isVisible() && (await page.locator("h1").innerText()).includes("EXPERIENCES"));
            check(`${device.name}: all photographic assets loaded`, await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)));
            check(`${device.name}: Motion browser runtime loaded`, await page.evaluate(() => typeof window.Motion?.animate === "function"));
            check(`${device.name}: website language is English`, await page.locator("html").getAttribute("lang") === "en" && !/[\u3400-\u9fff]/u.test(await page.locator("body").innerText()));
            await noOverflow(page, `${device.name} before interaction`);
            const screenshot = path.join(folder, ".checks", `${device.name}.png`);
            await page.screenshot({ path: screenshot });
            qa.screenshots[device.name] = screenshot;

            if (device.isMobile)
            {
                await page.locator(".menu-toggle").tap();
                check("mobile: navigation opens by touch", await page.locator("#navigation").isVisible());
                await page.locator("#navigation a[href='#about']").tap();
                await settle(page);
                check("mobile: anchor navigates and closes menu", await page.locator(".menu-toggle").getAttribute("aria-expanded") === "false" && new URL(page.url()).hash === "#about");
                await page.locator(".menu-toggle").click();
                await page.keyboard.press("Escape");
                check("mobile: Escape closes navigation and restores toggle focus", await page.locator(".menu-toggle").getAttribute("aria-expanded") === "false" && await page.locator(".menu-toggle").evaluate((button) => button === document.activeElement));
            }
            else
            {
                await page.locator("#navigation a[href='#about']").click();
                await settle(page);
                check("desktop: About navigation reaches actual section", new URL(page.url()).hash === "#about");
            }

            await page.locator(".logo").click();
            await settle(page);
            const badge = page.locator("#badge");
            await badge.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
            await settle(page);
            await badge.focus();
            await page.keyboard.press("ArrowRight");
            check(`${device.name}: badge responds to keyboard physics control`, await badge.getAttribute("data-offset-x") === "10");
            await page.keyboard.press("Escape");
            await settle(page);
            check(`${device.name}: badge springs back after keyboard reset`, await badge.getAttribute("data-offset-x") === "0");
            const rect = await badge.boundingBox();
            const x = rect.x + rect.width / 2;
            const y = rect.y + rect.height / 2;
            if (device.isMobile)
            {
                const cdp = await context.newCDPSession(page);
                await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] });
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 60, y: y + 25, id: 1 }] });
                check("mobile: real touch drag moves badge with elastic boundary", Number(await badge.getAttribute("data-offset-x")) > 30 && Number(await badge.getAttribute("data-offset-x")) <= 40);
                await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
                await cdp.detach();
            }
            else
            {
                await page.mouse.move(x, y);
                await page.mouse.down();
                await page.mouse.move(x + 105, y + 35, { steps: 5 });
                check("desktop: pointer drag uses 0.2 edge elasticity", Math.abs(Number(await badge.getAttribute("data-offset-x")) - 73) < 2);
                await page.mouse.up();
            }
            await settle(page);
            check(`${device.name}: released badge returns to origin`, await badge.getAttribute("data-offset-x") === "0");
            await noOverflow(page, `${device.name} after badge drag`);

            await page.locator("#work").scrollIntoViewIfNeeded();
            await settle(page);
            await page.locator("[data-project='0']").click({ position: { x: 80, y: 100 } });
            await settle(page);
            check(`${device.name}: front card cycles and description stays synchronized`, (await page.locator("#project-title").innerText()) === "Offgrid." && await page.locator("[data-select='1']").getAttribute("aria-pressed") === "true");
            const back = page.locator("[data-project='2']");
            const backRect = await back.boundingBox();
            await page.mouse.click(backRect.x + backRect.width / 2, backRect.y + backRect.height - 7);
            await settle(page);
            check(`${device.name}: exposed back card comes to front`, (await page.locator("#project-title").innerText()) === "Index.");
            await page.locator("[data-select='0']").focus();
            await page.keyboard.press("Enter");
            await settle(page);
            check(`${device.name}: keyboard project selector updates details`, (await page.locator("#project-title").innerText()) === "Forma.");
            await page.locator("#all-projects").click();
            check(`${device.name}: project index opens`, await page.locator("#index-dialog").isVisible());
            await page.locator("[data-index='2']").click();
            await settle(page);
            check(`${device.name}: index selection changes actual deck`, (await page.locator("#project-title").innerText()) === "Index." && !await page.locator("#index-dialog").isVisible());
            await page.locator("#explore-project").click();
            check(`${device.name}: project opens matching full case study`, (await page.locator("#case-title").innerText()).includes("Index.") && (await page.locator("#case-content").innerText()).includes("The challenge"));
            await noOverflow(page, `${device.name} with case-study dialog`);
            await page.keyboard.press("Escape");
            check(`${device.name}: Escape closes modal and restores trigger focus`, !await page.locator("#project-dialog").isVisible() && await page.locator("#explore-project").evaluate((button) => button === document.activeElement));
            await page.locator("[data-select='0']").click();
            await settle(page);
            await page.locator("#work").scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(folder, ".checks", `${device.name}-work.png`) });

            const stages = page.locator(".stage h3 button");
            await stages.nth(0).click();
            await settle(page);
            check(`${device.name}: briefing accordion reveals actual content`, await page.locator("#stage-1").isVisible() && await stages.nth(0).getAttribute("aria-expanded") === "true");
            await stages.nth(1).focus();
            await page.keyboard.press("Enter");
            await settle(page);
            check(`${device.name}: keyboard opens analytics and closes briefing`, await page.locator("#stage-2").isVisible() && !await page.locator("#stage-1").isVisible());
            await stages.nth(1).click();
            await settle(page);
            check(`${device.name}: accordion collapses`, !await page.locator("#stage-2").isVisible());

            await page.locator("footer [data-contact]").click();
            await page.locator("#brief-form button[type='submit']").click();
            check(`${device.name}: empty brief form is not submitted`, !await page.locator("#brief-result").isVisible());
            await page.locator("input[name='name']").fill("Alex Morgan");
            await page.locator("input[name='email']").fill("alex@example.com");
            await page.locator("textarea[name='message']").fill("A thoughtful editorial website for an independent design studio.");
            await page.locator("#brief-form button[type='submit']").click();
            check(`${device.name}: valid brief created locally with truthful feedback`, await page.locator("#brief-result").isVisible() && (await page.locator("#brief-text").inputValue()).includes("Alex Morgan") && (await page.locator("#form-feedback").innerText()).includes("Nothing has been sent"));
            check(`${device.name}: email draft contains actual brief and demo recipient`, (await page.locator("#email-brief").getAttribute("href")).startsWith("mailto:hello@zedian.example?") && decodeURIComponent(await page.locator("#email-brief").getAttribute("href")).includes("Alex Morgan"));
            await page.locator("#copy-brief").click();
            check(`${device.name}: copy action writes real brief to clipboard`, (await page.evaluate(() => navigator.clipboard.readText())).includes("Alex Morgan"));
            await noOverflow(page, `${device.name} with completed brief dialog`);
            await page.keyboard.press("Escape");
            await page.locator("[data-social='Behance']").click();
            check(`${device.name}: social action discloses fictional identity and offers real platform`, (await page.locator("#info-content").innerText()).includes("fictional") && await page.locator("#info-content a").getAttribute("href") === "https://www.behance.net/");
            await page.keyboard.press("Escape");
            await page.locator("#privacy").click();
            check(`${device.name}: privacy disclosure and license link available`, (await page.locator("#info-content").innerText()).includes("no analytics") && await page.locator("#info-content a").getAttribute("href") === "credits.html");
            const credits = await context.request.get(new URL("credits.html", server.url).href);
            check(`${device.name}: credits resource serves full source notices`, credits.status() === 200 && (await credits.text()).includes("Nomaan Khan"));
            await page.keyboard.press("Escape");
            await noOverflow(page, `${device.name} after all interactions`);
            await page.locator(".logo").click();
            await settle(page);
            check(`${device.name}: no HTTP/resource/request/console/page errors`, errors.length === 0);
            qa.viewports.push({ ...device, deviceScaleFactor: 1, passed: true, errors });
        }
        finally
        {
            await context.close();
        }
    }
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    try
    {
        const page = await context.newPage();
        await page.goto(server.url, { waitUntil: "networkidle" });
        check("Reduced motion: floating animation disabled", await page.locator(".badge-float").evaluate((element) => getComputedStyle(element).animationName === "none"));
        await page.locator("[data-select='1']").click();
        check("Reduced motion: project selection remains functional", (await page.locator("#project-title").innerText()) === "Offgrid.");
        await noOverflow(page, "reduced-motion mobile");
    }
    finally
    {
        await context.close();
    }
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack ?? String(error));
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.tests.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed, screenshots: qa.screenshots }, null, 2));
}
