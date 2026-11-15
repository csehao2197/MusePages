import { promises as fs } from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

export async function verifyStandalone(moduleURL, run)
{
    const folder = path.dirname(fileURLToPath(moduleURL));
    const prompt = path.basename(path.dirname(folder));
    const root = path.resolve(folder, "..", "..", "..", "..");
    const config = JSON.parse(await fs.readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const slug = config.pages[prompt]?.pages?.[0]?.slug || prompt.replace(/^\d+-/, "");
    const prefix = `/pages/${slug}/GPT-6/`;
    const exported = path.join(folder, "out");
    await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    const server = http.createServer(async (req, res) =>
    {
        const url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
        const filename = url.startsWith(prefix) ? url.slice(prefix.length) || "index.html" : "";
        if (!/^(index\.html|style\.css|app\.js|assets\/[\w.-]+\.(jpg|png|svg|webp))$/.test(filename))
        {
            res.writeHead(404).end();
            return;
        }
        try
        {
            const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".webp": "image/webp" };
            res.setHeader("Content-Type", types[path.extname(filename)]);
            res.end(await fs.readFile(path.join(exported, filename)));
        }
        catch
        {
            res.writeHead(404).end();
        }
    });
    let browser;
    let assertions = 0;
    const errors = [];
    const assert = (value, message) =>
    {
        if (!value) throw Error(message);
        assertions++;
    };
    try
    {
        await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
        browser = await chromium.launch({ headless: true });
        for (const viewport of [{ width: 1200, height: 900 }, { width: 390, height: 844 }])
        {
            const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
            page.on("pageerror", (e) => errors.push(e.message));
            page.on("console", (e) => { if (e.type() === "error") errors.push(e.text()); });
            page.on("requestfailed", (e) => errors.push(e.url()));
            page.on("response", (e) => { if (e.status() >= 400) errors.push(`${e.status()} ${e.url()}`); });
            await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`, { waitUntil: "networkidle" });
            assert((await page.title()).length > 0, "Page title");
            assert(await page.locator("h1").count() === 1, "Single primary heading");
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Initial overflow");
            await run(page, assert, viewport.width === 1200 ? "desktop" : "mobile");
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Interaction overflow");
            await page.close();
        }
        assert(errors.length === 0, errors.join("; "));
        console.log(JSON.stringify({ prompt, assertions, browserErrors: errors, staticValid: true, serverStoppedOnExit: true }));
    }
    finally
    {
        if (browser) await browser.close();
        await new Promise((resolve) => server.close(resolve));
    }
}
