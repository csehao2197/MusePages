import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { StaticHomepage as Static, WorkspaceFiles as Files } from "../workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../workflows/script/generate-preview.mjs";

const root = process.cwd();
const folder = path.resolve(process.argv[2]);
const details = await Files.json(path.join(folder, ".details.json"));
await Static.checkSource(folder);
await Static.copyHtml(folder, path.join(folder, "out"));
const digest = await Static.validateStaticOutput(path.join(folder, "out"), details.slug, "GPT-6");
const { verify } = await import(pathToFileURL(path.join(folder, ".checks", "verify.mjs")));
const server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
const browser = await chromium.launch({ headless: true });
const results = [];
try
{
    for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
    {
        const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
        page.on("requestfailed", (request) => errors.push(`Failed: ${request.url()}`));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
        await page.goto(server.url, { waitUntil: "networkidle" });
        assert.equal(await page.locator("html").getAttribute("lang"), "en");
        assert.equal(await page.evaluate(() => document.body.scrollWidth <= innerWidth), true, "Body horizontal overflow");
        const screenshot = path.join(folder, ".checks", viewport.width > 600 ? "desktop.png" : "mobile.png");
        await page.screenshot({ path: screenshot, fullPage: false });
        const assertions = await verify(page, assert, viewport);
        assert.equal(await page.evaluate(() => document.body.scrollWidth <= innerWidth), true, "Post-interaction overflow");
        assert.deepEqual(errors, [], "Browser errors");
        results.push({ ...viewport, assertions, errors, screenshot });
        await page.close();
    }
    await Files.saveJson(path.join(folder, ".checks", "qa.json"), { passed: true, visualReviewed: false, publicPath: `pages/${details.slug}/GPT-6/index.html`, staticDigest: digest, viewports: results });
    console.log(JSON.stringify({ passed: true, results }));
}
finally
{
    await browser.close();
    await server.close();
}
