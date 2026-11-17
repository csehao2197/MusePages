import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const model = path.join(root, "out", "pages", "606-island-postal-route-game", "GPT-6");
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const { WorkspaceFiles } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { walkable } = await import(pathToFileURL(path.join(model, "terrain.js")));
const report =
{
    passed: false,
    viewports: [],
    assertions: [],
    errors: [],
    visualReviewed: false,
    resourcesClosed: false
};
let server;
let browser;
function checked(name, condition)
{
    assert.ok(condition, name);
    report.assertions.push(name);
}
async function noOverflow(page, name)
{
    checked(name, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
}
try
{
    checked("Locked gate blocks walking; collected stamps open threshold", !walkable(1, -21, false) && walkable(1, -21, true));
    checked("River banks block walking; bridge route permits crossing", !walkable(8, 15, true) && walkable(8, 7, true));
    checked("Ocean boundary keeps courier on island", !walkable(40, 20, true));
    server = await startPreviewServer(path.join(model, "out"), { workspace: root });
    const health = await fetch(server.url);
    checked("Actual final-subpath preview responds HTTP 200", health.status === 200 && server.url.includes("/pages/island-postal-route-game/GPT-6/"));
    browser = await chromium.launch({ headless: true });
    for (const [name, viewport, order] of [["desktop", { width: 1200, height: 900 }, ["river", "mountain", "wind"]], ["mobile", { width: 390, height: 844 }, ["wind", "river", "mountain"]]])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: name === "mobile", isMobile: name === "mobile" });
        const page = await context.newPage();
        page.on("pageerror", e => report.errors.push(`${name}: pageerror ${e.message}`));
        page.on("console", msg =>
        {
            if (msg.type() === "error") report.errors.push(`${name}: console ${msg.text()}`);
        });
        page.on("requestfailed", request => report.errors.push(`${name}: request ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", response =>
        {
            if (response.status() >= 400) report.errors.push(`${name}: HTTP ${response.status()} ${response.url()}`);
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle" });
        checked(`${name}: homepage HTTP 200`, response.status() === 200);
        await page.waitForSelector("#world[data-ready='true']");
        checked(`${name}: visible live WebGL canvas and meaningful page`, await page.locator("#world canvas").isVisible() && (await page.locator("body").innerText()).includes("A special delivery."));
        await noOverflow(page, `${name}: no initial horizontal overflow`);
        await page.screenshot({ path: path.join(model, ".checks", `${name}.png`), fullPage: name === "mobile" });
        report.viewports.push({ name, ...viewport, deviceScaleFactor: 1, screenshot: `.checks\\${name}.png` });
        await page.locator("#trail-wind").click();
        checked(`${name}: letter pickup is required before assisted walking`, await page.locator("#toast").innerText() === "Your letter is waiting at the Post House. Pick it up first.");
        await page.locator("#help").click();
        checked(`${name}: field guide opens`, await page.locator("#guide-dialog").isVisible());
        await page.locator(".close-guide").click();
        const before = await page.locator("#world").getAttribute("data-position");
        if (name === "desktop")
        {
            await page.keyboard.down("ArrowUp");
            await page.waitForTimeout(240);
            await page.keyboard.up("ArrowUp");
        }
        else
        {
            const button = page.locator("[data-dir='up']");
            await button.scrollIntoViewIfNeeded();
            const bounds = await button.boundingBox();
            const session = await context.newCDPSession(page);
            await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 }] });
            await page.waitForTimeout(240);
            await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await session.detach();
        }
        await page.waitForTimeout(100);
        checked(`${name}: actual ${name === "desktop" ? "keyboard" : "touch"} movement changes world position`, before !== await page.locator("#world").getAttribute("data-position"));
        if (name === "desktop") await page.keyboard.press("e");
        else await page.locator("#interact").tap();
        await page.waitForTimeout(100);
        checked(`${name}: actual parcel pickup updates satchel`, await page.locator("#satchel").innerText() === "One letter for the North Temple");
        await page.locator("#temple-trail").click();
        checked(`${name}: locked temple refuses premature delivery route`, (await page.locator("#toast").innerText()).includes("three shrine stamps"));
        await page.locator("#sound").click();
        await page.waitForTimeout(60);
        checked(`${name}: sound preference toggles`, await page.locator("#sound").getAttribute("aria-pressed") === "true");
        await page.locator("#zoom-in").click();
        await page.locator("#zoom-out").click();
        for (let i = 0; i < order.length; i++)
        {
            const id = order[i];
            await page.locator(`#trail-${id}`).click();
            await page.waitForFunction(() => document.querySelector("#world").dataset.following === "true");
            await page.waitForFunction(() => document.querySelector("#world").dataset.following === "false", { timeout: 30000 });
            checked(`${name}: courier actually reaches ${id} shrine by walking`, (await page.locator("#place").innerText()).toLowerCase().includes(id));
            await page.locator("#interact").click();
            await page.waitForTimeout(100);
            checked(`${name}: ${id} stamp changes quest and score`, await page.locator("#count").innerText() === `${i + 1} / 3` && (await page.locator(`#stamp-${id}`).getAttribute("class")).includes("collected"));
            if (i === 0)
            {
                await page.reload({ waitUntil: "networkidle" });
                await page.waitForSelector("#world[data-ready='true']");
                checked(`${name}: reload preserves collected stamp and returns home`, await page.locator("#count").innerText() === "1 / 3" && await page.locator("#place").innerText() === "Post House" && await page.locator("#world").getAttribute("data-position") === "0.00,16.00");
                checked(`${name}: reload preserves sound preference`, await page.locator("#sound").getAttribute("aria-pressed") === "true");
                await page.locator("#interact").click();
            }
        }
        checked(`${name}: all stamps open gate`, (await page.locator("#gate-note").innerText()).includes("gate is open"));
        await noOverflow(page, `${name}: no horizontal overflow after shrine interactions`);
        await page.locator("#temple-trail").click();
        await page.waitForSelector("#complete-dialog[open]", { timeout: 30000 });
        checked(`${name}: walking across north threshold wins and scores 4/4`, await page.locator(".score b").innerText() === "4 / 4");
        if (name === "mobile")
        {
            await page.locator("#replay").tap();
            await page.waitForTimeout(100);
            checked("mobile: visible replay button starts a fresh playable journey", await page.locator("#count").innerText() === "0 / 3" && await page.locator("#place").innerText() === "Post House" && !await page.locator("#complete-dialog").isVisible());
            await noOverflow(page, "mobile: no overflow after winning and replay");
            await context.close();
            continue;
        }
        await page.locator("#wander").click();
        await page.reload({ waitUntil: "networkidle" });
        await page.waitForSelector("#world[data-ready='true']");
        checked(`${name}: completion and open gate survive reload`, await page.locator("#gate-note").innerText() === "Special delivery complete." && await page.locator("#count").innerText() === "3 / 3");
        await page.locator("#reset").click();
        await page.locator("#cancel-reset").click();
        checked(`${name}: cancelling reset preserves progress`, await page.locator("#count").innerText() === "3 / 3");
        await page.locator("#reset").click();
        await page.locator("#confirm-reset").click();
        await page.waitForTimeout(100);
        checked(`${name}: confirmed reset clears stamps and returns home`, await page.locator("#count").innerText() === "0 / 3" && await page.locator("#place").innerText() === "Post House");
        await noOverflow(page, `${name}: no overflow after completion and reset`);
        await context.close();
    }
    checked("Zero HTTP, request, console, or page errors", report.errors.length === 0);
    report.passed = true;
}
catch (error)
{
    report.errors.push(error.stack);
    console.error(error);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await server?.close();
    report.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(model, ".checks", "qa.json"), report);
    console.log(JSON.stringify({ passed: report.passed, assertions: report.assertions.length, errors: report.errors, resourcesClosed: report.resourcesClosed }));
}
