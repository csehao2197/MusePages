import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const slug = path.basename(path.dirname(folder)).replace(/^\d+-/, "");
const prefix = `/pages/${slug}/GPT-6/`;
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
        const url = new URL(request.url, "http://localhost");
        if (!url.pathname.startsWith(prefix)) throw Error("Outside public subpath");
        const relative = decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html";
        const file = path.resolve(folder, "out", relative);
        if (!file.startsWith(path.join(folder, "out") + path.sep)) throw Error("Traversal");
        const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".txt": "text/plain", ".png": "image/png" }[path.extname(file)] ?? "application/octet-stream";
        response.writeHead(200, { "Content-Type": type });
        response.end(await readFile(file));
    }
    catch
    {
        response.writeHead(404);
        response.end("Not found");
    }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browser = await chromium.launch({ headless: true });
try
{
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: "reduce" });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) =>
    {
        if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    page.on("requestfailed", (request) => errors.push(request.url()));
    const response = await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
    check(response.status() === 200, "Homepage served at eventual public subpath");
    check(await page.title() === "Alex Morgan — Developer & builder", "Public browser title");
    check(await page.locator("h1").innerText().then((text) => text.includes("Hi, I’m Alex.")), "Hero visible");
    check(await page.locator(".project:visible").count() === 3, "Three original projects");
    check(await page.locator(".skill-grid article").count() === 4, "Categorized skill grid");
    check(await page.locator("#contributions i").count() === 182, "Contribution graph renders");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Desktop fits viewport");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    for (const [command, expected] of [["help", "Commands:"], ["stack", "PostgreSQL"], ["status", "Available for select projects"], ["missing", "Command not found"]])
    {
        await page.locator("#command").fill(command);
        await page.locator("#command").press("Enter");
        check((await page.locator("#terminal-output").innerText()).includes(expected), `Terminal ${command}`);
    }
    await page.locator("#command").fill("clear");
    await page.locator("#command").press("Enter");
    check(await page.locator("#terminal-output").innerText() === "", "Terminal clear");
    await page.getByRole("button", { name: "Open source", exact: true }).click();
    check(await page.locator(".project:visible").count() === 2, "Open source filter");
    await page.getByRole("button", { name: "All work", exact: true }).click();
    check(await page.locator(".project:visible").count() === 3, "All filter restores");
    await page.locator('[data-project="Orbit"]').click();
    check(await page.locator("#detail").isVisible(), "Project modal");
    await page.locator("#note").fill("<b>Ship a thoughtful tool</b>");
    await page.getByRole("button", { name: "Save idea" }).click();
    check(await page.locator("#notes p").count() === 2, "Orbit creates note");
    check(await page.locator("#notes p").first().innerText() === "<b>Ship a thoughtful tool</b>", "Note treated as text");
    await page.keyboard.press("Escape");
    check(!await page.locator("#detail").isVisible(), "Keyboard dismisses modal");
    await page.locator('[data-project="Pulse Analytics"]').click();
    await page.locator("#window").selectOption("week");
    check((await page.locator("#metric").innerText()).includes("84,300"), "Analytics date range updates");
    await page.locator("#close").click();
    await page.locator('[data-project="Sprout UI"]').click();
    await page.locator("summary").click();
    check(await page.locator("details").getAttribute("open") !== null, "Accessible accordion opens");
    await page.locator("#toggle").check();
    check((await page.locator("#toggle-status").innerText()).includes("Compact"), "Component demo toggle");
    await page.locator("#close").click();
    await page.locator("[data-article]").first().click();
    check((await page.locator("#detail-copy").innerText()).includes("actionable errors"), "Readable local writing excerpt");
    await page.locator("#close").click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Download Resume" }).click();
    const download = await downloadPromise;
    check(download.suggestedFilename() === "alex-morgan-resume.txt", "Number-free resume download");
    check(!(await page.locator("#contact-form").evaluate((form) => form.checkValidity())), "Empty form invalid");
    await page.locator('[name="name"]').fill("Jamie");
    await page.locator('[name="email"]').fill("not-an-email");
    await page.locator('[name="message"]').fill("A thoughtful new project");
    check(!(await page.locator("#contact-form").evaluate((form) => form.checkValidity())), "Invalid email rejected");
    await page.locator('[name="email"]').fill("jamie@example.com");
    await page.getByRole("button", { name: "Preview message" }).click();
    check((await page.locator("#detail-copy").innerText()).includes("jamie@example.com"), "Contact preview includes supplied details");
    check((await page.locator("#contact-status").innerText()).includes("Nothing has been sent"), "Contact truthfully stays local");
    await page.locator("#close").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`http://127.0.0.1:${server.address().port}${prefix}index.html`);
    check(await page.locator("#menu").isVisible(), "Mobile menu available");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile fits viewport");
    await page.screenshot({ path: path.join(checks, "mobile.png"), fullPage: true });
    await page.locator("#menu").click();
    check(await page.locator("#menu").getAttribute("aria-expanded") === "true", "Mobile navigation expands");
    await page.locator("nav a[href='#projects']").click();
    check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Mobile anchor closes navigation");
    check(await page.evaluate(() => location.hash === "#projects"), "Mobile navigates to projects");
    check(errors.length === 0, `No browser/resource errors: ${errors.join("; ")}`);
    await writeFile(path.join(checks, "results.json"), JSON.stringify({ assertions, desktop: "1200x900", mobile: "390x844", publicPath: `${prefix}index.html`, browserErrors: errors, testedAt: new Date().toISOString(), serverClosedAfterRun: true }, null, 4));
    console.log(`PASS ${assertions} assertions`);
}
finally
{
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
}
