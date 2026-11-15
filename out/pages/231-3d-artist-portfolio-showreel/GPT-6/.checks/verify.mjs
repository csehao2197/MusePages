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
        const data = await readFile(file);
        const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webm": "video/webm", ".png": "image/png" }[path.extname(file)] ?? "application/octet-stream";
        response.writeHead(200, { "Content-Type": type, "Content-Length": data.length });
        response.end(data);
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
    page.on("requestfailed", (request) =>
    {
        if (!request.failure()?.errorText.includes("ERR_ABORTED")) errors.push(request.url());
    });
    const url = `http://127.0.0.1:${server.address().port}${prefix}index.html`;
    const response = await page.goto(url);
    await page.locator(".project img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
    check(response.status() === 200, "Homepage served under eventual public path");
    check((await page.title()).includes("Noah Vale"), "Number-free public title");
    check(await page.locator(".project:visible").count() === 6, "Six project studies");
    check(await page.locator(".hero-visual img").evaluate((image) => image.naturalWidth === 1400), "High-quality original hero image loaded");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Desktop fits viewport");
    await page.screenshot({ path: path.join(checks, "desktop.png") });
    await page.screenshot({ path: path.join(checks, "desktop-full.png"), fullPage: true });
    for (const [category, expected] of [["character", 1], ["environment", 1], ["product", 1], ["motion", 1], ["personal", 2]])
    {
        await page.locator(`[data-filter="${category}"]`).click();
        check(await page.locator(".project:visible").count() === expected, `${category} filter result count`);
        check(await page.locator(`[data-filter="${category}"]`).getAttribute("aria-pressed") === "true", `${category} filter accessible state`);
    }
    await page.locator('[data-filter="all"]').click();
    check(await page.locator(".project:visible").count() === 6, "All filter restores six projects");
    await page.locator('[data-project="milo"]').click();
    check(await page.locator("#project-dialog").isVisible(), "Project modal opens");
    check(await page.locator("#project-title").innerText() === "Milo, the wanderer", "Selected project title");
    check((await page.locator("#project-overview").innerText()).includes("copper"), "Project-specific overview");
    await page.locator('[data-stage="clay"]').click();
    check((await page.locator("#project-image").getAttribute("style")).includes("grayscale"), "Clay view changes material display");
    check((await page.locator("#stage-caption").innerText()).includes("Clay study"), "Clay caption");
    await page.locator('[data-stage="structure"]').click();
    check(await page.locator("#construction-overlay").isVisible(), "Construction overlay visible");
    check((await page.locator("#stage-caption").innerText()).includes("not an exported polygon"), "Breakdown scope truthful");
    await page.locator('[data-stage="light"]').click();
    check((await page.locator("#project-image").getAttribute("style")).includes("contrast(1.65)"), "Lighting view changes");
    await page.locator('[data-stage="final"]').click();
    check(!await page.locator("#construction-overlay").isVisible(), "Final clears construction overlay");
    await page.locator('[data-angle="study"]').click();
    check((await page.locator("#project-image").getAttribute("src")).includes("study.png"), "Gallery switches camera image");
    check((await page.locator("#angle-caption").innerText()).includes("second linked-form angle"), "Gallery labels related view");
    await page.keyboard.press("Escape");
    check(!await page.locator("#project-dialog").isVisible(), "Escape closes project");
    for (const project of ["kinetic", "monolith", "forma", "tension", "soft"])
    {
        await page.locator(`[data-project="${project}"]`).click();
        check((await page.locator("#project-overview").innerText()).length > 100, `${project} has specific meaningful detail`);
        await page.locator('#project-dialog .close').click();
    }
    await page.locator("#play-reel").click();
    await page.waitForFunction(() => document.querySelector("#reel").currentTime > .1);
    check(await page.locator("#reel-dialog").isVisible(), "Showreel modal opens");
    check(await page.locator("#reel").evaluate((video) => !video.paused && video.videoWidth > 0), "Real local WebM autoplays and decodes");
    await page.screenshot({ path: path.join(checks, "reel.png") });
    await page.locator("#reel-dialog .close").click();
    await page.waitForFunction(() => document.querySelector("#reel").paused);
    check(await page.locator("#reel").evaluate((video) => video.paused), "Closing pauses reel");
    await page.locator('[data-project="kinetic"]').click();
    await page.locator("#project-reel").click();
    check(await page.locator("#reel-dialog").isVisible() && !await page.locator("#project-dialog").isVisible(), "Project turntable opens player without stacked project modal");
    await page.locator("#reel-dialog .close").click();
    await page.locator("#inquiry").click();
    check(!await page.locator("#inquiry-form").evaluate((form) => form.checkValidity()), "Empty inquiry rejected");
    await page.locator('[name="email"]').fill("studio@example.com");
    await page.locator('[name="type"]').selectOption("Character design");
    await page.locator('[name="idea"]').fill("A friendly robot for our short film.");
    await page.getByRole("button", { name: "Create inquiry preview" }).click();
    check((await page.locator("#inquiry-status").innerText()).includes("Character design inquiry from studio@example.com"), "Inquiry summary uses selected category and email");
    check((await page.locator("#inquiry-status").innerText()).includes("Nothing has been sent or saved"), "Inquiry mock clearly disclosed");
    await page.locator("#contact-dialog .close").click();
    await page.locator("#discord").click();
    check((await page.locator("#inquiry-status").innerText()).includes("no live Discord"), "Community button explains fictional availability");
    await page.locator("#contact-dialog .close").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile fits viewport");
    await page.screenshot({ path: path.join(checks, "mobile.png") });
    await page.screenshot({ path: path.join(checks, "mobile-full.png"), fullPage: true });
    await page.locator("#menu").click();
    check(await page.locator("#menu").getAttribute("aria-expanded") === "true", "Mobile navigation expands");
    await page.locator('nav a[href="#work"]').click();
    check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Mobile navigation collapses on link");
    check(await page.evaluate(() => location.hash === "#work"), "Mobile navigates to work");
    await page.locator('[data-filter="product"]').click();
    check(await page.locator(".project:visible").count() === 1, "Mobile filtering works");
    await page.locator('[data-project="forma"]').click();
    check(await page.locator("#project-dialog").evaluate((dialog) => dialog.scrollWidth <= dialog.clientWidth), "Mobile project dialog fits");
    check(errors.length === 0, `Browser and resource errors: ${errors.join("; ")}`);
    await writeFile(path.join(checks, "results.json"), JSON.stringify({ assertions, desktop: "1200x900", mobile: "390x844", publicPath: `${prefix}index.html`, browserErrors: errors, testedAt: new Date().toISOString(), serverClosedAfterRun: true, originalArtwork: "Six procedural WebGL renders and a real local WebM; playback tested" }, null, 4));
    console.log(`PASS ${assertions} assertions`);
}
finally
{
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
}
