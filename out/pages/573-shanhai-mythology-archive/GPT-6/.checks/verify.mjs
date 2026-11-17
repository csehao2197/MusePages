import { chromium, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const { WorkspaceFiles: W } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "render-prompt-page.mjs")));
const { startPreviewServer } = await import(pathToFileURL(path.join(root, "src", "workflows", "script", "generate-preview.mjs")));
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const qa =
{
    prompt: job.prompt,
    modelId: job.modelId,
    startedAt: new Date().toISOString(),
    mount: "/pages/shanhai-mythology-archive/GPT-6/",
    assertions: [],
    errors: [],
    viewports: [],
    visualReviewed: false,
    resourcesClosed: false,
    passed: false,
    screenshots:
    {
        desktop: path.join(job.output, ".checks", "desktop.png"),
        mobile: path.join(job.output, ".checks", "mobile.png")
    },
    remediation: "Initial keyboard test caught a native modal Tab-cycle escape. Explicit Tab/Shift+Tab wrap was added before this verification."
};
let server;
let browser;
const check = (text) => qa.assertions.push(text);
try
{
    server = await startPreviewServer(path.join(job.output, "out"));
    browser = await chromium.launch({ headless: true });
    expect((await fetch(server.url)).status).toBe(200);
    check("Responsive target-only static preview serves the final public subpath with HTTP 200");
    for (const [name, width, height] of [["desktop", 1200, 900], ["mobile", 390, 844]])
    {
        qa.viewports.push({ name, width, height, deviceScaleFactor: 1 });
        const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
        const page = await context.newPage();
        page.on("pageerror", (error) => qa.errors.push(`${name}: ${error.message}`));
        page.on("console", (message) =>
        {
            if (message.type() === "error") qa.errors.push(`${name}: console ${message.text()}`);
        });
        page.on("requestfailed", (request) => qa.errors.push(`${name}: ${request.url()} ${request.failure()?.errorText}`));
        page.on("response", (response) =>
        {
            if (response.status() >= 400) qa.errors.push(`${name}: HTTP ${response.status()} ${response.url()}`);
        });
        const overflow = async (stage) =>
        {
            const dimensions = await page.evaluate(() =>
            ({
                scroll: document.documentElement.scrollWidth,
                width: innerWidth,
                dialogs: [...document.querySelectorAll("dialog[open]")].map((dialog) => ({ w: dialog.scrollWidth, c: dialog.clientWidth }))
            }));
            expect(dimensions.scroll, `${name} ${stage} document overflow`).toBeLessThanOrEqual(dimensions.width);
            expect(dimensions.dialogs.every((dialog) => dialog.w <= dialog.c + 1), `${name} ${stage} dialog overflow`).toBe(true);
        };
        expect((await page.goto(server.url, { waitUntil: "networkidle" })).status()).toBe(200);
        await expect(page.locator("h1")).toBeVisible();
        expect(await page.locator("main").innerText()).toContain("Before the world was mapped");
        await expect(page.locator(".specimen-card")).toHaveCount(9);
        expect(await page.locator("body").innerText()).not.toMatch(/[\u3400-\u9fff]/u);
        await overflow("initial");
        await page.screenshot({ path: qa.screenshots[name] });
        await page.locator("#archive").screenshot({ path: path.join(job.output, ".checks", `${name}-archive.png`) });
        await page.locator("#ticket").screenshot({ path: path.join(job.output, ".checks", `${name}-ticket.png`) });
        await page.evaluate(() => window.scrollTo(0, 0));
        check(`${name}: visible English homepage, nine specimens, no initial overflow; actual DPR1 screenshot captured`);
        if (name === "mobile")
        {
            await page.locator(".menu-toggle").click();
            await expect(page.locator("#navigation")).toBeVisible();
            const title = await page.locator("h1").boundingBox();
            const header = await page.locator(".masthead").boundingBox();
            expect(title.y).toBeGreaterThanOrEqual(header.y + header.height);
            await page.locator("#navigation").getByRole("link", { name: "The archive", exact: true }).click();
            await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
            await expect(page.locator("#navigation")).not.toBeVisible();
            check("Mobile menu pushes hero content and closes on navigation without covering titles");
        }
        await page.locator('[data-region="North"]').click();
        await expect(page.locator(".specimen-card")).toHaveCount(2);
        await page.locator("#search").fill("water");
        await expect(page.locator(".specimen-card")).toHaveCount(1);
        await expect(page.locator(".specimen-card")).toContainText("Xuangui");
        await page.locator("#search").fill("unfindable");
        await expect(page.locator(".specimen-card")).toHaveCount(0);
        await expect(page.locator("#no-results")).toBeVisible();
        await page.locator("#search").fill("");
        await page.locator('[data-region="All"]').click();
        await expect(page.locator(".specimen-card")).toHaveCount(9);
        check(`${name}: combined regional and element search, empty search state, complete archive reset`);
        const card = page.locator('[data-record="zhulong"]').first();
        await card.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#record-dialog")).toBeVisible();
        await expect(page.locator("#record-name")).toHaveText("Zhulong");
        await expect(page.locator("#record-dialog")).toContainText("Time / Light");
        await overflow("record open");
        await page.locator("#collect-record").click();
        await expect(page.locator("#collect-record")).toHaveAttribute("aria-pressed", "true");
        for (const key of ["Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"])
        {
            await page.keyboard.press(key);
            expect(await page.evaluate(() => document.activeElement.closest("dialog")?.id)).toBe("record-dialog");
        }
        await page.keyboard.press("Escape");
        await expect(page.locator("#record-dialog")).not.toBeVisible();
        await expect(card).toBeFocused();
        check(`${name}: keyboard opens full record, Tab/Shift+Tab stay in modal, Escape closes and restores focus`);
        await page.locator('[data-feature="dijiang"]').click();
        await expect(page.locator("#feature-name")).toHaveText("Dijiang");
        await expect(page.locator("#featured-image use")).toHaveAttribute("href", "specimens.svg#dijiang");
        await expect(page.locator("#feature-facts")).toContainText("Sound / Space");
        await page.locator('[data-feature="jiuweihu"]').click();
        await expect(page.locator("#feature-name")).toHaveText("Nine-tailed fox");
        await expect(page.locator("#feature-note")).toContainText("nine jade-colored tails");
        check(`${name}: featured switcher updates artwork, name, facts and curatorial copy`);
        for (const [region, count] of [["North", 2], ["East", 2], ["South", 2], ["West", 2], ["Central", 1]])
        {
            await page.locator(`[data-atlas="${region}"]`).click();
            await expect(page.locator("#atlas-name")).toContainText(region === "Central" ? region : `${region}ern`);
            await expect(page.locator(".atlas-record")).toHaveCount(count);
        }
        await page.locator("#atlas-filter").click();
        await expect(page.locator(".specimen-card")).toHaveCount(1);
        await expect(page.locator(".specimen-card")).toContainText("Yingzhao");
        check(`${name}: all five regions produce correct specimen sets; atlas action filters archive`);
        await page.locator("#seal-button").click();
        await expect(page.locator("#seal-button")).toBeDisabled();
        await expect(page.locator("#seal-message")).toContainText("Return tomorrow");
        const dailyName = await page.locator("#daily-name").innerText();
        await page.locator("#daily-open").click();
        await expect(page.locator("#record-name")).toHaveText(dailyName);
        await page.keyboard.press("Escape");
        await page.locator("#notebook-button").click();
        await expect(page.locator(".notebook-record")).toHaveCount(1);
        await expect(page.locator(".notebook-record")).toContainText("Zhulong");
        await page.locator(".notebook-record").click();
        await expect(page.locator("#record-dialog")).toBeVisible();
        await expect(page.locator("#record-name")).toHaveText("Zhulong");
        await page.locator("#collect-record").click();
        await expect(page.locator("#collect-record")).toHaveAttribute("aria-pressed", "false");
        await page.keyboard.press("Escape");
        await page.locator("#notebook-button").click();
        await expect(page.locator("#notebook-list")).toContainText("Your cabinet is waiting");
        await page.keyboard.press("Escape");
        await overflow("after interactions");
        await page.reload({ waitUntil: "networkidle" });
        await expect(page.locator("#seal-button")).toBeDisabled();
        await expect(page.locator("#visit-count")).toHaveText("02");
        await expect(page.locator("#collection-count")).toHaveText("0 / 9 COLLECTED");
        check(`${name}: daily seal persists once per date; visits persist; notebook add/open/remove/empty-state works`);
        for (const file of ["poster-day.svg", "poster-echo.svg", "poster-sound.svg"])
        {
            const asset = await page.request.get(new URL(file, server.url).href);
            expect(asset.status()).toBe(200);
            expect(await asset.text()).toContain('<title id="title">');
        }
        const downloading = page.waitForEvent("download");
        await page.locator(".poster").first().click();
        const download = await downloading;
        expect(download.suggestedFilename()).toBe("shanhai-day.svg");
        await download.delete();
        await overflow("final");
        check(`${name}: three standalone SVG poster resources return 200; real download has public filename`);
        await context.close();
    }
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const width of [768, 1024, 1440])
    {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(server.url, { waitUntil: "networkidle" });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await page.locator(".archive-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(width < 1024 ? 2 : 3);
    }
    check("768/1024/1440px: no horizontal overflow; two-column tablet and three-column desktop cabinet");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() =>
    {
        Storage.prototype.getItem = () => { throw new Error("storage unavailable"); };
        Storage.prototype.setItem = () => { throw new Error("storage unavailable"); };
    });
    await page.goto(server.url, { waitUntil: "networkidle" });
    await expect(page.locator(".specimen-card")).toHaveCount(9);
    await page.locator("#seal-button").click();
    await expect(page.locator("#seal-message")).toContainText("for this visit");
    check("Unavailable browser storage retains working archive and visit-only seal");
    await context.close();
    expect(qa.errors).toEqual([]);
    qa.passed = true;
}
catch (error)
{
    qa.failure = error.stack;
    process.exitCode = 1;
}
finally
{
    if (browser) await browser.close();
    if (server) await server.close();
    qa.resourcesClosed = true;
    qa.completedAt = new Date().toISOString();
    await W.saveJson(path.join(job.output, ".checks", "qa.json"), qa);
    console.log(JSON.stringify(qa, null, 2));
}
