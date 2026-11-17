import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = path.resolve(fileURLToPath(new URL("../../../../../", import.meta.url)));
const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const qa = {
    prompt: "537-3d-colosseum-history-explorer",
    modelId: "gpt-6.1-sol",
    publicModel: "GPT-6",
    timestamp: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    screenshots: [],
    resourcesClosed: false
};
let service;
let browser;

function check(name, condition, evidence)
{
    assert.ok(condition, name);
    qa.assertions.push({ name, passed: true, evidence });
}

async function noOverflow(page, label)
{
    const result = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: innerWidth
    }));
    check(label + ": no horizontal overflow", result.scroll <= result.viewport, result);
}

async function snapshot(page)
{
    return page.evaluate(() => structuredClone(window.exhibitDiagnostics));
}

async function stable(page)
{
    await page.waitForTimeout(1300);
}

async function verifyViewport(size, mobile)
{
    const context = await browser.newContext({
        viewport: size,
        deviceScaleFactor: 1,
        isMobile: mobile,
        hasTouch: mobile,
        reducedMotion: mobile ? "reduce" : "no-preference"
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push("page: " + error.message));
    page.on("console", (message) =>
    {
        if (message.type() === "error") errors.push("console: " + message.text());
    });
    page.on("requestfailed", (request) => errors.push("request: " + request.url() + " " + request.failure()?.errorText));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push("HTTP " + response.status() + ": " + response.url());
    });
    try
    {
        const response = await page.goto(service.url, { waitUntil: "networkidle", timeout: 60000 });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => window.exhibitDiagnostics?.ready && window.exhibitDiagnostics.frames > 3, { timeout: 60000 });
        const label = mobile ? "Mobile" : "Desktop";
        qa.viewports.push({ ...size, deviceScaleFactor: 1, touch: mobile });
        check(label + ": HTTP success at final subpath", response.status() === 200 && /\/pages\/3d-colosseum-history-explorer\/GPT-6\/index.html$/.test(page.url()), page.url());
        check(label + ": nonblank procedural 3D homepage", await page.locator("h1").innerText() === "An amphitheater, unbuilt." && (await snapshot(page)).proceduralMeshes > 1000, await snapshot(page));
        check(label + ": local fonts loaded", await page.evaluate(() => document.fonts.check('16px "Newsreader"') && document.fonts.check('16px "DM Sans"')), "Newsreader + DM Sans");
        await noOverflow(page, label + " before interactions");
        await stable(page);
        const shot = path.join(folder, ".checks", mobile ? "mobile.png" : "desktop.png");
        await page.screenshot({ path: shot, fullPage: mobile });
        qa.screenshots.push({ path: shot, viewport: size, fullPage: mobile });

        await page.locator('[data-time="0"]').click();
        await stable(page);
        const foundation = await snapshot(page);
        check(label + ": foundation state removes facade and seating", foundation.time === 0 && foundation.visibleFacadeBays === 0 && foundation.visibleSeatSections === 0 && !foundation.undergroundVisible, foundation);
        await page.locator('[data-time="33"]').click();
        const construction = await snapshot(page);
        check(label + ": construction reveals lower arcades", construction.visibleFacadeBays > 0 && construction.visibleFacadeBays < 192 && !construction.undergroundVisible, construction);
        await page.locator('[data-time="66"]').click();
        const complete = await snapshot(page);
        check(label + ": complete state has all three arcade tiers", complete.visibleFacadeBays === 192 && complete.undergroundVisible && complete.visibleArenaSections === 64, complete);
        await page.locator('[data-time="100"]').click();
        const weathered = await snapshot(page);
        check(label + ": weathering removes real facade geometry", weathered.visibleFacadeBays < complete.visibleFacadeBays && weathered.visibleFacadeBays > 64, weathered);
        await page.locator("#cutaway").click();
        const cut = await snapshot(page);
        check(label + ": cutaway removes quarter shell and half floor", cut.cutaway && cut.visibleFacadeBays < weathered.visibleFacadeBays && cut.visibleSeatSections < weathered.visibleSeatSections && cut.visibleArenaSections === 32, cut);
        check(label + ": underground marker is visible in cutaway", await page.getByRole("button", { name: "Beneath the arena", exact: true }).isVisible(), "Projected service-space hotspot");
        for (const id of ["facade", "seating", "arena", "service"])
        {
            const before = await snapshot(page);
            await page.locator(`[data-hotspot="${id}"]`).click();
            await stable(page);
            const after = await snapshot(page);
            check(label + ": " + id + " hotspot changes content and camera", after.selected === id && await page.locator(`[data-hotspot="${id}"]`).getAttribute("aria-pressed") === "true" && after.camera.some((value, i) => Math.abs(value - before.camera[i]) > 0.1), { title: await page.locator("#detail-title").innerText(), camera: after.camera, cutaway: after.cutaway });
        }
        if (!mobile)
        {
            await page.locator("#model").scrollIntoViewIfNeeded();
            const cutawayShot = path.join(folder, ".checks", "cutaway.png");
            await page.screenshot({ path: cutawayShot, fullPage: false });
            qa.screenshots.push({ path: cutawayShot, viewport: size, state: "service hotspot / quarter shell and half arena cutaway" });
        }
        await page.locator("#reset").click();
        await stable(page);
        check(label + ": reset restores overview and closed cutaway", !(await snapshot(page)).cutaway && (await snapshot(page)).selected === null, await snapshot(page));
        const beforeZoom = (await snapshot(page)).camera;
        await page.locator("#zoom-in").click();
        await stable(page);
        const zoomed = (await snapshot(page)).camera;
        check(label + ": zoom controls change camera distance", Math.hypot(...zoomed) < Math.hypot(...beforeZoom), { beforeZoom, zoomed });
        await page.locator("#zoom-out").click();
        await stable(page);
        const beforeOrbit = (await snapshot(page)).camera;
        await page.locator("#model").scrollIntoViewIfNeeded();
        const box = await page.locator("#model").boundingBox();
        if (mobile)
        {
            const cdp = await context.newCDPSession(page);
            const x = box.x + box.width * 0.45;
            const y = box.y + box.height * 0.55;
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
            for (let step = 1; step <= 5; step += 1)
            {
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + step * 12, y }] });
            }
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
            await cdp.detach();
        }
        else
        {
            await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.62);
            await page.mouse.down();
            await page.mouse.move(box.x + box.width * 0.66, box.y + box.height * 0.65, { steps: 6 });
            await page.mouse.up();
        }
        await stable(page);
        check(label + ": " + (mobile ? "touch" : "mouse") + " orbit changes camera", (await snapshot(page)).camera.some((v, i) => Math.abs(v - beforeOrbit[i]) > 0.2), { before: beforeOrbit, after: (await snapshot(page)).camera });
        if (!mobile)
        {
            const beforeWheel = (await snapshot(page)).camera;
            await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.6);
            await page.mouse.wheel(0, -180);
            await stable(page);
            check(label + ": scroll wheel zoom changes camera distance", Math.hypot(...(await snapshot(page)).camera) < Math.hypot(...beforeWheel), { before: beforeWheel, after: (await snapshot(page)).camera });
        }
        await page.locator("#model").focus();
        const beforeKey = (await snapshot(page)).camera;
        await page.keyboard.press("ArrowLeft");
        await stable(page);
        check(label + ": keyboard orbit works", (await snapshot(page)).camera.some((v, i) => Math.abs(v - beforeKey[i]) > 0.1), (await snapshot(page)).camera);
        await page.keyboard.press("+");
        await stable(page);
        check(label + ": keyboard zoom works", Math.hypot(...(await snapshot(page)).camera) < Math.hypot(...beforeKey), (await snapshot(page)).camera);
        await page.keyboard.press("Home");
        await page.locator("#time").focus();
        await page.keyboard.press("Home");
        check(label + ": keyboard timeline reaches foundations", (await snapshot(page)).time === 0, await page.locator("#time").getAttribute("aria-valuetext"));
        await page.keyboard.press("End");
        check(label + ": keyboard timeline reaches present", (await snapshot(page)).time === 100, await page.locator("#time").getAttribute("aria-valuetext"));
        await page.locator("#tour").click();
        await stable(page);
        check(label + ": guided camera tour starts at facade", (await snapshot(page)).selected === "facade" && (await page.locator("#tour-status").innerText()).includes("Stop 1 of 4"), await page.locator("#tour-status").innerText());
        await page.locator("#tour").click();
        check(label + ": tour pauses", (await page.locator("#tour-status").innerText()).includes("Tour paused"), await page.locator("#tour-status").innerText());
        await page.locator("#tour").click();
        await stable(page);
        check(label + ": tour resumes at next architectural stop", (await snapshot(page)).selected === "seating", await snapshot(page));
        if (!mobile)
        {
            await page.waitForFunction(() => document.querySelector("#tour-status").textContent.startsWith("Tour complete"), { timeout: 30000 });
            check(label + ": all four tour stops complete", (await snapshot(page)).selected === "service", await page.locator("#tour-status").innerText());
        }
        else
        {
            await page.locator("#tour").click();
        }
        await noOverflow(page, label + " after interactions");
        check(label + ": no browser, request or HTTP errors", errors.length === 0, errors);
    }
    finally
    {
        qa.errors.push(...errors);
        await context.close();
    }
}

try
{
    service = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    const response = await fetch(service.url);
    check("Owned preview server responsive", response.status === 200, service.url);
    browser = await chromium.launch({ headless: true });
    await verifyViewport({ width: 1200, height: 900 }, false);
    await verifyViewport({ width: 390, height: 844 }, true);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack);
    process.exitCode = 1;
}
finally
{
    await browser?.close();
    await service?.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
