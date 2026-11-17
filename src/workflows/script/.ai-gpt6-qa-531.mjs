import path from "node:path";
import { copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "./render-prompt-page.mjs";
import { startPreviewServer } from "./generate-preview.mjs";

const workspace = process.cwd();
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
assert.equal(job.prompt, "531-speakup-creative-agency");
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await WorkspaceFiles.text(job.promptLock)).trim());
assert.equal(state.ownedLock.prompt, job.prompt);
assert.equal(state.ownedLock.pid, lockPid);
process.kill(lockPid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
const metadataFile = path.join(folder, "metadata.json");
const checks = await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, folder), ".checks");
const fingerprint = createHash("sha256").update(JSON.stringify([
    await WorkspaceFiles.text(job.file),
    await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"))
])).digest("hex");
let metadata;
if (await WorkspaceFiles.info(metadataFile))
{
    metadata = await WorkspaceFiles.json(metadataFile);
    assert.equal(metadata.modelId, job.modelId);
    assert.equal(metadata.generated, true, "No unauthorized retry of generated=false");
    assert.equal((await WorkspaceFiles.text(path.join(folder, ".generation-input.sha256"))).trim(), fingerprint);
}
else
{
    metadata =
    {
        modelId: job.modelId,
        tags: ["Agency", "Video Hero"],
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
    await StaticHomepage.checkSource(folder);
    metadata.generated = true;
    await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
    await WorkspaceFiles.saveJson(metadataFile, metadata);
}
await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, folder), "out");
for (const file of ["index.html", "style.css", "script.js", "LICENSE"])
{
    await copyFile(path.join(folder, file), path.join(exported, file));
}
const config = await WorkspaceFiles.json(path.join(workspace, "deploy", "config.json"));
const shared = config.pages[job.prompt]?.pages?.[0];
const slug = shared?.slug ?? "speakup-creative-agency";
const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
let browser;
let server;
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    staticDigest: digest,
    publicPath: `/pages/${slug}/GPT-6/index.html`,
    viewports: [],
    assertions: [],
    errors: [],
    passed: false,
    visualReviewed: false,
    resourcesClosed: false,
    timestamp: new Date().toISOString()
};
async function checkOverflow(page, label)
{
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${label}`);
    qa.assertions.push(`No horizontal overflow: ${label}`);
}
try
{
    server = await startPreviewServer(exported, { workspace });
    assert.equal((await fetch(server.url)).status, 200);
    browser = await chromium.launch({ headless: true });
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push(`pageerror: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push(`console: ${message.text()}`);
        });
        page.on("requestfailed", (request) => qa.errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) qa.errors.push(`HTTP ${response.status()}: ${response.url()}`);
        });
        const response = await page.goto(server.url, { waitUntil: "networkidle", timeout: 60000 });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForFunction(() => document.querySelector("video").readyState >= 3, null, { timeout: 45000 });
        await page.waitForFunction(() => document.fonts.check('56px "Recoleta Regular"') && document.fonts.check("16px Inter"));
        assert.equal(await page.title(), "Speakup");
        assert.ok(await page.locator("h1").isVisible());
        assert.equal(await page.locator("h1").innerText(), "Crafting the\nimprobable");
        assert.ok(await page.locator("h1").evaluate((element) => element.getBoundingClientRect().width > 200));
        assert.ok(await page.locator("video").evaluate((element) => element.videoWidth > 0 && element.muted && element.loop));
        await checkOverflow(page, `${viewport.width} initial`);
        await page.locator("video").evaluate((element) =>
        {
            element.pause();
            element.currentTime = 1;
        });
        await page.waitForFunction(() => Math.abs(document.querySelector("video").currentTime - 1) < 0.1 && document.querySelector("video").readyState >= 3);
        await page.screenshot({ path: path.join(checks, viewport.width === 1200 ? "desktop.png" : "mobile.png") });
        await page.getByRole("button", { name: "Play background video" }).click();
        await page.waitForFunction(() => !document.querySelector("video").paused);
        await page.getByRole("button", { name: "Pause background video" }).click();
        assert.ok(await page.locator("video").evaluate((element) => element.paused));
        if (viewport.width < 1024)
        {
            await page.getByRole("button", { name: "Open menu" }).click();
            assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "true");
            await checkOverflow(page, "mobile menu open");
            await page.keyboard.press("Escape");
            await page.waitForFunction(() => document.querySelector(".menu-toggle").getAttribute("aria-expanded") === "false");
            assert.equal(await page.getByRole("button", { name: "Open menu" }).getAttribute("aria-expanded"), "false");
            assert.ok(await page.getByRole("button", { name: "Open menu" }).evaluate((element) => element === document.activeElement));
            await page.keyboard.press("Enter");
            assert.ok(await page.locator("#mobile-menu").isVisible());
            await page.getByRole("button", { name: "Close menu" }).click();
        }
        for (const section of ["Projects", "The Team", "Products", "Our Story"])
        {
            if (viewport.width < 1024) await page.getByRole("button", { name: "Open menu" }).click();
            await page.getByRole("button", { name: section, exact: true }).click();
            assert.equal(await page.locator("#detail-title").innerText(), section);
            assert.ok((await page.locator("#detail-content").innerText()).length > 100);
            await checkOverflow(page, `${viewport.width} ${section}`);
            await page.keyboard.press("Escape");
            await page.waitForFunction(() => !document.querySelector("#details").open && !document.querySelector("#detail-content").childElementCount);
        }
        await page.locator(".hero-cta").click();
        await page.getByRole("button", { name: "Create my brief" }).click();
        assert.ok(await page.locator("input[name=name]").evaluate((element) => !element.validity.valid));
        await page.getByLabel("Your name").fill("   ");
        await page.getByLabel("Email address").fill("alex@example.com");
        await page.getByLabel("Your bold idea").fill("A digital studio");
        await page.getByRole("button", { name: "Create my brief" }).click();
        assert.ok(await page.getByLabel("Your name").evaluate((element) => element.validity.customError));
        await page.getByLabel("Your name").fill("Alex Example");
        await page.getByLabel("Email address").fill("alex@example.com");
        await page.getByLabel("What are you exploring?").selectOption("A website experience");
        await page.getByLabel("Your bold idea").fill("A bold, accessible digital home for a creative studio.");
        await page.getByRole("button", { name: "Create my brief" }).click();
        assert.match(await page.getByRole("status").innerText(), /not submitted/);
        assert.equal(await page.locator("#brief-type").innerText(), "A website experience");
        assert.match(await page.locator("#brief-idea").innerText(), /accessible digital home/);
        await checkOverflow(page, `${viewport.width} brief created`);
        await page.getByRole("button", { name: "Start another brief" }).click();
        assert.equal(await page.getByLabel("Your name").inputValue(), "");
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("#detail-content").childElementCount);
        await checkOverflow(page, `${viewport.width} final`);
        qa.viewports.push({ ...viewport, deviceScaleFactor: 1, passed: true });
        qa.assertions.push(`${viewport.width}: exact hero, remote video decoded, fonts loaded, pause/play, four navigation dialogs, brief validation/result/reset, Escape close${viewport.width < 1024 ? ", mobile menu keyboard toggle and focus restoration" : ""}`);
        await context.close();
    }
    assert.deepEqual(qa.errors, []);
    qa.passed = true;
}
catch (error)
{
    qa.errors.push(error.stack ?? error.message);
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    await WorkspaceFiles.saveJson(path.join(checks, "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
