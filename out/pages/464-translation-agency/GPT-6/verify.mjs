import fs from "node:fs/promises";
import path from "node:path";
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
    const server = http.createServer(async (request, response) =>
    {
        try
        {
            const name = new URL(request.url, "http://local").pathname.split("/").pop() || "index.html";
            if (!["index.html", "site.css", "site.js", "art.svg"].includes(name)) throw Error("Unknown asset");
            const data = await fs.readFile(path.join(folder, "out", name));
            response.setHeader("Content-Type", name.endsWith(".js") ? "text/javascript" : name.endsWith(".css") ? "text/css" : name.endsWith(".svg") ? "image/svg+xml" : "text/html");
            response.end(data);
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
        const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
        await page.goto(`http://127.0.0.1:${server.address().port}/pages/translation-agency/GPT-6/index.html`);
        await page.locator("#motion").click();
        assert(await page.locator("#motion").textContent() === "Resume sentence", "Motion pause");
        await page.locator("#motion").click();
        await page.locator(".send-file").first().click();
        await page.locator("#document").setInputFiles({ name: "script.exe", mimeType: "application/octet-stream", buffer: Buffer.from("x") });
        assert(await page.locator("#document").evaluate((element) => !element.checkValidity()), "Invalid file rejected");
        await page.locator("#document").setInputFiles({ name: "empty.txt", mimeType: "text/plain", buffer: Buffer.from("") });
        assert(await page.locator("#document").evaluate((element) => !element.checkValidity()), "Empty document rejected");
        await page.locator("#document").setInputFiles({ name: "brief.txt", mimeType: "text/plain", buffer: Buffer.from("Translation brief.") });
        assert(await page.locator("#document").evaluate((element) => element.checkValidity()), "Valid file accepted");
        await page.locator("#email").fill("reader@example.test");
        await page.locator("#consent").check();
        await page.locator("#file-form button[type='submit'], #file-form .button").click();
        assert((await page.locator("#enquiry-status").innerText()).includes("Nothing sent or stored"), "Truthful enquiry result");
        await page.locator("#reset").click();
        assert(await page.locator("#document").evaluate((element) => element.files.length === 0), "Reset clears file");
        await page.locator("#close").click();
        await page.waitForFunction(() => document.querySelector("#motion").disabled, undefined, { timeout: 45000 });
        const finalSentence = await page.locator("#sentence span").allTextContents();
        assert(finalSentence.map((word) => word.trim()).join(" ") === "The lease runs until the end of March and cannot be broken early.", `Animation returns to English and stops: ${JSON.stringify(finalSentence)}`);
        const tooSmall = await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.children.length === 0 && element.textContent.trim() && getComputedStyle(element).display !== "none" && Number.parseFloat(getComputedStyle(element).fontSize) < 14).length);
        assert(tooSmall === 0, "Minimum text size");
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
    console.log(JSON.stringify({ additionalBrowserChecks: extra, total: qa.browserChecks, helpersStopped: true }));
}
