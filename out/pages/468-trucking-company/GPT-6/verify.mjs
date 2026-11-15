import path from "node:path";
import fs from "node:fs/promises";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { run } from "../../447-skincare-brand/GPT-6/.checks/harness.mjs";

const folder = path.dirname(fileURLToPath(import.meta.url));
if (process.argv[2] === "finish")
{
    await run(folder, "finish");
}
else
{
    await run(folder);
    const errors = [];
    const server = http.createServer(async (request, response) =>
    {
        try
        {
            const name = new URL(request.url, "http://local").pathname.split("/").pop() || "index.html";
            if (!["index.html", "site.css", "site.js", "art.svg"].includes(name)) throw Error("Unknown asset");
            const content = await fs.readFile(path.join(folder, "out", name));
            response.setHeader("Content-Type", name.endsWith(".js") ? "text/javascript" : name.endsWith(".css") ? "text/css" : name.endsWith(".svg") ? "image/svg+xml" : "text/html");
            response.end(content);
        }
        catch
        {
            response.writeHead(404);
            response.end();
        }
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const browser = await chromium.launch();
    let extra = 0;
    function assert(condition, message)
    {
        if (!condition) throw Error(message);
        extra++;
    }
    try
    {
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "no-preference" });
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) =>
        {
            if (message.type() === "error") errors.push(message.text());
        });
        await page.goto(`http://127.0.0.1:${server.address().port}/pages/trucking-company/GPT-6/index.html`, { waitUntil: "networkidle" });
        assert(await page.locator("#mileage").innerText() === "0", "Route waits for entry");
        await page.locator("#route-map").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector("#route-map").dataset.complete === "true");
        assert(await page.locator("#mileage").innerText() === "212", "Animated final mileage");
        assert(await page.locator("#route-line").evaluate((element) => getComputedStyle(element).strokeDashoffset === "0px"), "Route fully drawn");
        assert(await page.locator(".marker").evaluateAll((markers) => markers.every((marker) => getComputedStyle(marker).opacity === "1")), "All three desktop markers appear");
        await page.locator("#home").scrollIntoViewIfNeeded();
        await page.locator("#route-map").scrollIntoViewIfNeeded();
        assert(await page.locator("#mileage").innerText() === "212", "Route does not restart");
        assert(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.children.length === 0 && element.textContent.trim() && Number.parseFloat(getComputedStyle(element).fontSize) < 14).length) === 0, "Text is at least 14 px");
        assert(errors.length === 0, "Animation has no browser errors");
        await page.setViewportSize({ width: 390, height: 844 });
        assert(!await page.locator(".marker.overnight").isVisible(), "Mobile has two route markers");
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Non-reduced mobile has no overflow");
    }
    finally
    {
        await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
    const file = path.join(folder, ".checks", "qa.json");
    const qa = JSON.parse(await fs.readFile(file, "utf8"));
    qa.browserChecks += extra;
    qa.extraChecks = extra;
    await fs.writeFile(file, JSON.stringify(qa, null, 4) + "\n");
    console.log(JSON.stringify({ additionalBrowserChecks: extra, total: qa.browserChecks, errors, helpersStopped: true }));
}
