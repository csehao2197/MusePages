
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const folder = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(folder, "out");
const prefix = "/pages/atelier-design-agency-landing/GPT-6/";
const cases = JSON.parse(await fs.readFile(path.join(folder, ".cases.json"), "utf8"));
const checks = [];
const errors = [];
const server = http.createServer(async (req, res) =>
{
    try
    {
        const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        if (!url.startsWith(prefix)) throw Error("Outside public path");
        const file = path.resolve(out, url.slice(prefix.length) || "index.html");
        if (!file.startsWith(out + path.sep)) throw Error("Unsafe path");
        const data = await fs.readFile(file);
        const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
        res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain" });
        res.end(data);
    }
    catch
    {
        res.writeHead(404);
        res.end("Not found");
    }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
try
{
    for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
        page.on("requestfailed", (request) => errors.push(request.url() + ": " + request.failure().errorText));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(response.url() + ": " + response.status()); });
        const response = await page.goto("http://127.0.0.1:" + server.address().port + prefix + "index.html", { waitUntil: "networkidle" });
        assert.equal(response.status(), 200);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(150);
        assert.ok(await page.locator("h1").isVisible(), "Visible heading");
        assert.ok((await page.locator("body").innerText()).length > 120, "Nonblank content");
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + " overflow");
        await page.screenshot({ path: path.join(folder, ".checks", name + ".png"), fullPage: false });
        for (const item of cases)
        {
            if (item.viewport && item.viewport !== name) continue;
            if (item.click) await page.locator(item.click).click();
            if (item.fill) await page.locator(item.fill).fill(item.value);
            if (item.key) await page.keyboard.press(item.key);
            if (item.visible) await page.locator(item.visible).waitFor({ state: "visible" });
            if (item.hidden) await page.locator(item.hidden).waitFor({ state: "hidden" });
            if (item.text) assert.ok((await page.locator(item.selector).innerText()).includes(item.text), item.label);
            if (item.attribute) assert.equal(await page.locator(item.selector).getAttribute(item.attribute), item.value);
            checks.push(name + ": " + item.label);
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + " post-interaction overflow");
        await page.close();
    }
    assert.deepEqual(errors, [], "Resource and console errors");
    await fs.writeFile(path.join(folder, ".checks", "qa.json"), JSON.stringify({ passed: true, checkedAt: new Date().toISOString(), publicPath: prefix, viewports: ["1200x900", "390x844"], assertions: ["HTTP 200", "Visible nonblank homepage", "No horizontal overflow before/after interactions", "No resource/HTTP/console errors", ...checks], ownedResourcesClosed: true }, null, 4));
    console.log(JSON.stringify({ passed: true, checks: checks.length }));
}
finally
{
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
}
