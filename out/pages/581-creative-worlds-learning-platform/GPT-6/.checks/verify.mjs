import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium, expect } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = process.cwd();
const checks = path.join(folder, ".checks");
const qa = {
    prompt: "581-creative-worlds-learning-platform",
    modelId: "gpt-6.1-sol",
    startedAt: new Date().toISOString(),
    passed: false,
    visualReviewed: false,
    viewports: [],
    assertions: [],
    errors: [],
    resourcesClosed: false
};
let service;
let browser;
const record = (name) => qa.assertions.push({ name, passed: true });

async function noOverflow(page, label)
{
    const sizes = await page.evaluate(() =>
    {
        const dialog = document.querySelector("dialog[open]");
        return {
            document: document.documentElement.scrollWidth,
            viewport: innerWidth,
            dialogScroll: dialog?.scrollWidth || 0,
            dialogClient: dialog?.clientWidth || 0
        };
    });
    expect(sizes.document, `${label}: document overflow`).toBeLessThanOrEqual(sizes.viewport);
    expect(sizes.dialogScroll, `${label}: dialog overflow`).toBeLessThanOrEqual(sizes.dialogClient + 1);
    record(`${label}: no horizontal overflow`);
}

function monitor(page)
{
    page.on("pageerror", (error) => qa.errors.push(`Page: ${error.message}`));
    page.on("console", (message) =>
    {
        if (message.type() === "error")
        {
            qa.errors.push(`Console: ${message.text()}`);
        }
    });
    page.on("requestfailed", (request) => qa.errors.push(`Request: ${request.url()} ${request.failure()?.errorText}`));
    page.on("response", (response) =>
    {
        if (response.status() >= 400)
        {
            qa.errors.push(`HTTP ${response.status()}: ${response.url()}`);
        }
    });
    page.on("request", (request) =>
    {
        if (!request.url().startsWith(new URL(service.url).origin))
        {
            qa.errors.push(`Unexpected external request: ${request.url()}`);
        }
    });
}

async function saved(page)
{
    await page.locator("#save-world").click();
    await expect(page.locator("#studio-status")).toContainText("World and reflection saved");
    return page.evaluate(() => JSON.parse(localStorage.getItem("little-worlds-projects"))[0]);
}

function projected(width, height, object)
{
    const unit = Math.min(width / 8.6, height / 6.7);
    const a = -.48;
    const rx = object.x * Math.cos(a) - object.z * Math.sin(a);
    const rz = object.x * Math.sin(a) + object.z * Math.cos(a);
    return { x: width * .5 + rx * unit, y: height * .64 + rz * unit * .45 - .6 * object.size * unit };
}

try
{
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "creative-worlds-learning-platform", "GPT-6");
    qa.staticDigest = digest;
    record("Repository static validation: standalone local resources at final model subpath");
    service = await startPreviewServer(path.join(folder, "out"), { workspace });
    qa.publicPath = new URL(service.url).pathname;
    expect(qa.publicPath).toBe("/pages/creative-worlds-learning-platform/GPT-6/index.html");
    expect((await fetch(service.url)).status).toBe(200);
    expect((await fetch(new URL("/README.md", service.url))).status).toBe(404);
    expect((await fetch(new URL("metadata.json", service.url))).status).toBe(404);
    record("Live loopback server responds with 200 and refuses source/private paths");
    browser = await chromium.launch({ headless: true });
    const desktop = await browser.newContext({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    qa.viewports.push({ name: "desktop", width: 1200, height: 900, deviceScaleFactor: 1 });
    const page = await desktop.newPage();
    monitor(page);
    const response = await page.goto(service.url, { waitUntil: "networkidle" });
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(/A little world/);
    await expect(page.locator("#hero-world")).toBeVisible();
    expect(await page.locator("#hero-world").evaluate((canvas) =>
    {
        const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
        let painted = 0;
        for (let i = 3; i < pixels.length; i += 4)
        {
            if (pixels[i])
            {
                painted++;
            }
        }
        return painted / (pixels.length / 4);
    })).toBeGreaterThan(.1);
    await noOverflow(page, "Desktop initial homepage");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    record("Desktop visible nonblank homepage and actual 1200×900 screenshot");
    await page.locator('a[href="#sparks"]').click();
    await expect(page.locator("#sparks-title")).toBeInViewport();
    await page.locator('[data-start="blank"]').click();
    await expect(page.locator("#builder")).toBeVisible();
    await expect(page.locator("#selected-object option")).toHaveCount(1);
    await page.locator('[data-piece="tree"]').click();
    await page.locator("#studio-world").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#selected-object option")).toHaveCount(2);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await page.locator("#rotate-piece").click();
    await page.locator("#grow-piece").click();
    await page.locator("#piece-color").fill("#79b5a2");
    await page.locator("#piece-color").dispatchEvent("change");
    await page.locator("#world-name").fill("A forest for shy stars");
    await page.locator("#reflection").fill("I made a tree bigger so a shy friend could find shelter.");
    let world = await saved(page);
    expect(world.objects).toHaveLength(1);
    expect(world.objects[0].x).toBe(.25);
    expect(world.objects[0].z).toBe(.75);
    expect(world.objects[0].rotation).toBeCloseTo(Math.PI / 4);
    expect(world.objects[0].size).toBeCloseTo(1.15);
    expect(world.objects[0].color).toBe("#79b5a2");
    record("Keyboard creates and moves real 3D geometry; rotate, scale, color, name, and reflection persist");
    const bounds = await page.locator("#studio-world").boundingBox();
    const point = projected(bounds.width, bounds.height, world.objects[0]);
    await page.mouse.move(bounds.x + point.x, bounds.y + point.y);
    await page.mouse.down();
    await page.mouse.move(bounds.x + point.x + 30, bounds.y + point.y + 10, { steps: 6 });
    await page.mouse.up();
    world = await saved(page);
    expect(world.objects[0].x).not.toBe(.25);
    const draggedX = world.objects[0].x;
    await page.locator("#undo").click();
    expect((await saved(page)).objects[0].x).toBeCloseTo(.25);
    await page.locator("#redo").click();
    expect((await saved(page)).objects[0].x).toBeCloseTo(draggedX);
    record("Pointer drag moves a selected object; undo/redo restore actual scene coordinates");
    await page.locator('[data-theme="night"]').click();
    await expect(page.locator('[data-theme="night"]')).toHaveAttribute("aria-pressed", "true");
    expect((await saved(page)).theme).toBe("night");
    const question = await page.locator("#guide-question").textContent();
    await page.locator("#new-idea").click();
    expect(await page.locator("#guide-question").textContent()).not.toBe(question);
    await page.locator("#play-world").click();
    await expect(page.locator("#mode-label")).toHaveText("EXPLORING YOUR WORLD");
    await page.locator("#studio-world").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#studio-status")).toContainText("Rustle, rustle");
    await page.keyboard.press("ArrowRight");
    await page.locator("#orbit-left").click();
    await noOverflow(page, "Desktop after creation and exploration");
    await page.locator("#play-world").click();
    await page.locator("#selected-object").selectOption("0");
    await page.locator("#delete-piece").click();
    await expect(page.locator("#selected-object option")).toHaveCount(1);
    await page.locator("#undo").click();
    await expect(page.locator("#selected-object option")).toHaveCount(2);
    await saved(page);
    record("Environment changes, creative guidance, exploration reactions, camera rotation, deletion and undo work");
    await page.keyboard.press("Escape");
    await expect(page.locator("#builder")).not.toBeVisible();
    await page.reload({ waitUntil: "networkidle" });
    await page.locator('[data-action="gallery"]').click();
    await page.getByRole("button", { name: /A forest for shy stars.*Open your world/ }).click();
    await expect(page.locator("#world-name")).toHaveValue("A forest for shy stars");
    await expect(page.locator("#reflection")).toHaveValue("I made a tree bigger so a shy friend could find shelter.");
    await expect(page.locator("#selected-object option")).toHaveCount(2);
    record("Saved gallery reopens the actual world and reflection after a full page reload");
    await page.evaluate(() =>
    {
        window.originalStorageSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = () => { throw new Error("Storage unavailable in QA"); };
    });
    await page.locator("#save-world").click();
    await expect(page.locator("#studio-status")).toContainText("cannot save right now");
    await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
    record("Unavailable local storage is disclosed without falsely reporting a save");
    await page.keyboard.press("Escape");
    await page.locator('[data-action="grownups"]').first().click();
    await page.locator("#teacher-prompt").fill("Build a home where a cloud and a tiny fox can be friends.");
    await page.locator("#assign-challenge").click();
    await expect(page.locator("#mission")).toHaveText("Build a home where a cloud and a tiny fox can be friends.");
    await expect(page.locator("#selected-object option")).toHaveCount(1);
    const dropBounds = await page.locator("#studio-world").boundingBox();
    await page.locator('[data-piece="house"]').dragTo(page.locator("#studio-world"),
    {
        targetPosition: { x: dropBounds.width * .55, y: dropBounds.height * .65 }
    });
    await expect(page.locator("#selected-object option")).toHaveCount(2);
    record("Actual palette-to-island drag and drop creates a new 3D object");
    await page.locator("#builder").getByRole("button", { name: "Close studio" }).focus();
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.activeElement.closest("#builder") !== null)).toBe(true);
    record("Native modal contains keyboard tab focus");
    await page.keyboard.press("Escape");
    await page.locator('[data-start="story"]').click();
    await noOverflow(page, "Desktop story studio");
    await page.screenshot({ path: path.join(checks, "desktop-studio.png") });
    record("Grown-up custom challenge is applied to an actual blank world; studio screenshot captured");
    await page.keyboard.press("Escape");
    await page.locator('[data-action="privacy"]').click();
    await expect(page.locator("#info")).toContainText("Nothing is sent to an AI service");
    await page.keyboard.press("Escape");
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    qa.viewports.push({ name: "mobile", width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const phone = await mobile.newPage();
    monitor(phone);
    await phone.goto(service.url, { waitUntil: "networkidle" });
    await noOverflow(phone, "Mobile initial homepage");
    await phone.screenshot({ path: path.join(checks, "mobile.png") });
    await phone.locator('.hero [data-start="dream"]').tap();
    await expect(phone.locator("#builder")).toBeVisible();
    const before = await phone.locator("#selected-object option").count();
    await phone.locator('[data-piece="friend"]').tap();
    const mobileBounds = await phone.locator("#studio-world").boundingBox();
    await phone.locator("#studio-world").tap({ position: { x: mobileBounds.width * .7, y: mobileBounds.height * .61 } });
    await expect(phone.locator("#selected-object option")).toHaveCount(before + 1);
    await phone.locator("#move-left").tap();
    await phone.locator("#shrink-piece").tap();
    await phone.locator('[data-theme="ocean"]').tap();
    const mobileWorld = await saved(phone);
    expect(mobileWorld.objects).toHaveLength(before);
    expect(mobileWorld.theme).toBe("ocean");
    expect(mobileWorld.objects.at(-1).type).toBe("friend");
    expect(mobileWorld.objects.at(-1).size).toBe(.85);
    await phone.locator("#new-idea").tap();
    await noOverflow(phone, "Mobile studio after tap creation, transforms, weather and save");
    await phone.locator("#play-world").tap();
    await phone.locator("#studio-world").focus();
    await phone.keyboard.press("Enter");
    await expect(phone.locator("#studio-status")).toContainText("waves hello");
    await phone.locator("#orbit-right").tap();
    await noOverflow(phone, "Mobile exploring");
    await phone.locator("#play-world").tap();
    await phone.locator("#builder").evaluate((element) => { element.scrollTop = 0; });
    await phone.screenshot({ path: path.join(checks, "mobile-studio.png") });
    await phone.locator('[data-close="builder"]').tap();
    await phone.locator('[data-action="gallery"]').tap();
    await expect(phone.locator(".saved-item")).toHaveCount(1);
    await phone.locator(".saved-item button").first().tap();
    await expect(phone.locator("#selected-object option")).toHaveCount(before + 1);
    await noOverflow(phone, "Mobile saved world reopened");
    await phone.locator('[data-close="builder"]').tap();
    await phone.locator('[data-action="gallery"]').tap();
    await phone.locator(".saved-item .icon-button").tap();
    await expect(phone.locator(".saved-list")).toContainText("Your shelf is empty");
    await phone.locator('[data-remix="habitat"]').tap();
    await expect(phone.locator("#world-name")).toHaveValue("Our tiny habitat");
    await expect(phone.locator("#mission")).toContainText("shelter, water");
    await phone.locator('[data-close="builder"]').tap();
    await noOverflow(phone, "Mobile final homepage");
    record("Mobile actual touch placement, transformations, environment, guide, save/load, explore, delete, remix and closing dialogs pass");
    await mobile.close();
    for (const viewport of [{ width: 820, height: 1180 }, { width: 320, height: 720 }])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const responsive = await context.newPage();
        monitor(responsive);
        await responsive.goto(service.url, { waitUntil: "networkidle" });
        await noOverflow(responsive, `${viewport.width}px responsive homepage`);
        await responsive.locator('.hero [data-start="dream"]').click();
        await noOverflow(responsive, `${viewport.width}px responsive studio`);
        await context.close();
        qa.viewports.push({ name: viewport.width === 820 ? "tablet smoke" : "compact smoke", ...viewport, deviceScaleFactor: 1 });
    }
    expect(qa.errors).toEqual([]);
    record("No HTTP, failed request, external request, console or page errors on desktop/mobile");
    qa.passed = true;
    qa.screenshots = {};
    for (const name of ["desktop", "mobile", "desktop-studio", "mobile-studio"])
    {
        const file = path.join(checks, `${name}.png`);
        const png = await readFile(file);
        qa.screenshots[name] = {
            file,
            sha256: createHash("sha256").update(png).digest("hex"),
            width: png.readUInt32BE(16),
            height: png.readUInt32BE(20)
        };
    }
}
catch (error)
{
    qa.passed = false;
    qa.errors.push(error.stack || String(error));
    process.exitCode = 1;
}
finally
{
    if (browser)
    {
        await browser.close();
    }
    if (service)
    {
        await service.close();
    }
    qa.resourcesClosed = true;
    qa.completedAt = new Date().toISOString();
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify({ passed: qa.passed, assertions: qa.assertions.length, errors: qa.errors, resourcesClosed: qa.resourcesClosed }));
}
