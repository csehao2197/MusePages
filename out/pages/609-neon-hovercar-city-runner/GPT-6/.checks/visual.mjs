import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src/workflows/script/generate-preview.mjs")));
const { WorkspaceFiles: W } = await import(pathToFileURL(path.join(root, "src/workflows/script/render-prompt-page.mjs")));
const job = await W.json(path.join(root, "src/workflows/script/.ai-gpt6-current-job.json"));
const server = await startPreviewServer(path.join(job.output, "out"), { workspace: root });
let browser;
const results = [];
try
{
    browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader"] });
    for (const [name, viewport] of [["desktop", { width: 1200, height: 900 }], ["mobile", { width: 390, height: 844 }]])
    {
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1, isMobile: name === "mobile", hasTouch: name === "mobile" });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => errors.push(`${message.type()}: ${message.text()}`));
        page.on("requestfailed", (request) => errors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
        page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
        const response = await page.goto(server.url);
        await page.waitForFunction(() => window.laneTelemetry);
        await page.waitForTimeout(1400);
        await page.screenshot({ path: path.join(job.output, ".checks", `${name}.png`) });
        results.push({ name, viewport, status: response.status(), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors, title: await page.title() });
        await page.close();
    }
}
finally
{
    await browser?.close();
    await server.close();
}
await W.saveJson(path.join(job.output, ".checks/initial-visual.json"), results);
console.log(JSON.stringify(results));
