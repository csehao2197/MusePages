import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const workspace = process.cwd();
const prompt = "532-alwayzz-subscription-design-agency";
const folder = path.join(workspace, "out", "pages", prompt, "GPT-6");
const checks = await WorkspaceFiles.ensureDirectory(workspace, "out", "pages", prompt, "GPT-6", ".checks");
const qa =
{
    prompt,
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    resourcesClosed: false,
    viewports: [],
    errors: []
};
let server;
let browser;
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace });
    qa.url = server.url;
    assert.ok(server.url.includes("/pages/alwayzz-subscription-design-agency/GPT-6/"));
    const readiness = await fetch(server.url);
    assert.equal(readiness.status, 200);
    browser = await chromium.launch({ headless: true });
    for (const [name, width, height] of [["desktop", 1200, 900], ["mobile", 390, 844]])
    {
        const context = await browser.newContext(
        {
            viewport: { width, height },
            deviceScaleFactor: 1,
            isMobile: name === "mobile",
            hasTouch: name === "mobile"
        });
        const page = await context.newPage();
        const result =
        {
            name,
            width,
            height,
            deviceScaleFactor: 1,
            assertions: [],
            errors: []
        };
        qa.viewports.push(result);
        page.on("pageerror", error => result.errors.push(`page: ${error.message}`));
        page.on("console", message =>
        {
            if (message.type() === "error")
            {
                result.errors.push(`console: ${message.text()}`);
            }
        });
        page.on("requestfailed", request => result.errors.push(`request: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response =>
        {
            if (response.status() >= 400)
            {
                result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
            }
        });
        async function checkOverflow(stage)
        {
            const dimensions = await page.evaluate(() =>
            {
                const root = document.documentElement;
                const dialog = document.querySelector("dialog[open]");
                return {
                    client: root.clientWidth,
                    scroll: root.scrollWidth,
                    dialogClient: dialog?.clientWidth,
                    dialogScroll: dialog?.scrollWidth
                };
            });
            assert.ok(dimensions.scroll <= dimensions.client, `${stage}: horizontal document overflow`);
            if (dimensions.dialogClient)
            {
                assert.ok(dimensions.dialogScroll <= dimensions.dialogClient + 1, `${stage}: horizontal dialog overflow`);
            }
            result.assertions.push(`${stage}: no horizontal document or dialog overflow`);
        }
        const response = await page.goto(server.url, { waitUntil: "networkidle", timeout: 90000 });
        assert.equal(response.status(), 200);
        await page.evaluate(async () =>
        {
            await document.fonts.ready;
            await Promise.all(Array.from(document.images).map(image =>
            {
                if (image.complete)
                {
                    if (!image.naturalWidth)
                    {
                        throw new Error(`Broken image: ${image.src}`);
                    }
                    return Promise.resolve();
                }
                return image.decode();
            }));
            const url = getComputedStyle(document.querySelector(".hero"), "::before").backgroundImage.slice(5, -2);
            const image = new Image();
            image.src = url;
            await image.decode();
            if (!image.naturalWidth)
            {
                throw new Error("Hero background failed to decode");
            }
        });
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.ok(await page.getByRole("heading", { level: 1 }).isVisible());
        assert.match(await page.locator("#headline").innerText(), /Premium creative[\s\S]*on demand/);
        const bounds = await page.locator("#headline").boundingBox();
        assert.ok(bounds.width > 200 && bounds.height > 90 && bounds.y > 70 && bounds.y < height);
        assert.ok(await page.getByRole("button", { name: "View Plans" }).isVisible());
        assert.equal(await page.locator(".left-lines .curve").count(), 20);
        assert.equal(await page.locator(".right-lines .curve").count(), 20);
        assert.equal(await page.locator(".top-lines .curve").count(), 20);
        assert.equal(await page.locator(".ticker-group").count(), 4);
        result.assertions.push("HTTP 200; English meaningful homepage; exact hero and avatar decoded; fonts ready; 20 left/right/top curves and four service groups");
        await checkOverflow("homepage before interactions");
        const screenshot = path.join(checks, `${name}.png`);
        await page.screenshot({ path: screenshot, fullPage: false, animations: "disabled" });
        result.screenshot = screenshot;

        await page.locator("#menu-button").focus();
        await page.keyboard.press("Enter");
        await page.locator("#menu").waitFor({ state: "visible" });
        assert.equal(await page.locator("#menu-button").getAttribute("aria-expanded"), "true");
        await checkOverflow("keyboard-opened full-screen menu");
        await page.getByRole("link", { name: "Projects" }).click();
        await page.getByRole("heading", { name: /Small details/ }).waitFor();
        await page.getByRole("button", { name: "Digital", exact: true }).click();
        assert.equal(await page.getByRole("button", { name: "Digital", exact: true }).getAttribute("aria-pressed"), "true");
        assert.equal(await page.locator(".discipline-sample h3").innerText(), "App Development");
        assert.match(await page.locator("#discipline-description").innerText(), /responsive experiences/);
        await page.getByRole("button", { name: "Motion", exact: true }).click();
        assert.equal(await page.locator(".discipline-sample h3").innerText(), "Creative Video");
        await checkOverflow("discipline switching");
        await page.keyboard.press("Escape");
        await page.locator("#detail").waitFor({ state: "hidden" });
        await page.waitForFunction(() => document.activeElement.id === "menu-button");
        result.assertions.push("Menu opens by keyboard; project discipline selection updates actual content; Escape closes and restores focus");

        await page.getByRole("button", { name: "View Plans" }).click();
        await page.getByRole("button", { name: /02 \/ Studio/ }).click();
        assert.equal(await page.getByRole("button", { name: /02 \/ Studio/ }).getAttribute("aria-pressed"), "true");
        assert.match(await page.locator(".plan-summary").innerText(), /Studio selected/);
        await page.getByRole("button", { name: "Discuss Studio" }).click();
        assert.match(await page.locator("#contact-intro").innerText(), /Studio/);
        await checkOverflow("selected-plan consultation");
        await page.getByRole("button", { name: "Preview my booking" }).click();
        assert.equal(await page.locator(".booking-result").isVisible(), false);
        await page.locator("#booking-name").fill("Demo Visitor");
        await page.locator("#booking-email").fill("visitor@example.com");
        await page.getByLabel("1:30 PM").check();
        await page.getByRole("button", { name: "Preview my booking" }).click();
        await page.locator(".booking-result").waitFor({ state: "visible" });
        assert.match(await page.locator(".booking-result").innerText(), /Demo Visitor[\s\S]*13:30[\s\S]*Studio[\s\S]*Nothing has been booked or sent/);
        const resultDate = await page.locator("#booking-day").inputValue();
        assert.ok(resultDate >= await page.locator("#booking-day").getAttribute("min"));
        await checkOverflow("booking preview");
        await page.keyboard.press("Tab");
        assert.equal(await page.evaluate(() => document.querySelector("#detail").contains(document.activeElement)), true);
        await page.keyboard.press("Escape");
        await page.locator("#detail").waitFor({ state: "hidden" });
        await page.waitForFunction(() => document.activeElement.textContent.includes("View Plans"));
        result.assertions.push("Plan selection carried into consultation; required-field validation rejects empty form; date/time/name/email preview works; focus trapped and restored");

        await page.getByRole("button", { name: "Chat for 15 minutes" }).click();
        assert.equal(await page.locator("#booking-name").inputValue(), "");
        assert.equal(await page.locator("#booking-email").inputValue(), "");
        assert.equal(await page.locator(".booking-result").isVisible(), false);
        await page.getByRole("button", { name: "Close detail" }).click();
        result.assertions.push("Closing and reopening booking discards entered personal details");

        await page.locator("#menu-button").click();
        await page.getByRole("link", { name: "FAQs" }).click();
        await page.getByText("Can I book a real call here?", { exact: true }).click();
        assert.equal(await page.locator("details").nth(2).getAttribute("open"), "");
        assert.ok(await page.getByText(/Not in this static demo/).isVisible());
        await checkOverflow("expanded FAQ");
        await page.getByRole("button", { name: "Close detail" }).click();
        await page.locator("#menu-button").click();
        await page.getByRole("link", { name: "Team" }).click();
        assert.ok(await page.getByText("Creative direction", { exact: true }).isVisible());
        await page.getByRole("button", { name: "Meet through a conversation" }).click();
        assert.ok(await page.locator("#booking-form").isVisible());
        await page.keyboard.press("Escape");
        await page.locator("#detail").waitFor({ state: "hidden" });
        await checkOverflow("homepage after interactions");
        result.assertions.push("FAQ expands real answer; studio roles and contact navigation work on this viewport");
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(await page.locator(".ticker-track").evaluate(element => getComputedStyle(element).animationName), "none");
        result.assertions.push("Reduced-motion preference disables marquee animations");
        await page.waitForTimeout(200);
        assert.deepEqual(result.errors, []);
        result.assertions.push("Zero HTTP/resource/request/console/page errors across homepage and interactions");
        result.passed = true;
        await context.close();
    }
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack || String(error));
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (server)
    {
        await server.close();
    }
    qa.resourcesClosed = true;
    qa.finishedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
