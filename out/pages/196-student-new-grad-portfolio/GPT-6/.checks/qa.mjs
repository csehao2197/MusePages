import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

export async function verify(folder, checks)
{
    const errors = [];
    let assertions = 0;
    const check = (condition, message) =>
    {
        assert.ok(condition, message);
        assertions++;
    };
    const server = createServer(async (request, response) =>
    {
        try
        {
            const name = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
            const file = path.resolve(folder, "out", "." + (name === "/" ? "/index.html" : name));
            assert.ok(file.startsWith(path.resolve(folder, "out") + path.sep));
            response.setHeader("Content-Type", ({ ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".webm": "video/webm", ".svg": "image/svg+xml", ".png": "image/png", ".txt": "text/plain" })[path.extname(file)] || "application/octet-stream");
            response.end(await readFile(file));
        }
        catch
        {
            response.writeHead(404);
            response.end("Not found");
        }
    });
    await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
    const browser = await chromium.launch({ headless: true });
    try
    {
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
        page.on("pageerror", error => errors.push(error.message));
        page.on("console", message =>
        {
            if (message.type() === "error") errors.push(message.text());
        });
        page.on("response", response =>
        {
            if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        page.on("requestfailed", request => errors.push(request.url()));
        const url = `http://127.0.0.1:${server.address().port}/`;
        await page.goto(url);
        check(await page.locator("h1").count() === 1, "One meaningful page heading");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Desktop fits viewport");
        await checks(page, check);
        await page.goto(url);
        await page.screenshot({ path: path.join(folder, ".checks", "desktop.png") });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(url);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile fits viewport");
        const menu = page.locator("[data-menu]");
        if (await menu.count())
        {
            await menu.click();
            check(await menu.getAttribute("aria-expanded") === "true", "Mobile navigation expands");
            await menu.click();
            check(await menu.getAttribute("aria-expanded") === "false", "Mobile navigation closes");
        }
        await page.screenshot({ path: path.join(folder, ".checks", "mobile.png"), fullPage: true });
        check(errors.length === 0, `No browser, console or resource errors: ${errors.join("; ")}`);
        const result = { time: new Date().toISOString(), assertions, viewports: ["1200x900", "390x844"], errors, screenshots: ["desktop.png", "mobile.png"] };
        await writeFile(path.join(folder, ".checks", "results.json"), JSON.stringify(result, null, 4) + "\n");
        console.log(JSON.stringify(result));
        return result;
    }
    finally
    {
        await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
}
