import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserQA } from "../../../../../src/tools/serial-batch-507-516.mjs";

export async function run()
{
    return browserQA(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "monochrome-editorial-creative-studio", async (page, assert) =>
    {
        await page.getByRole("button", { name: "Open menu" }).click();
        assert(await page.locator("#menu").isVisible(), "Menu opens as accessible modal");
        await page.getByRole("link", { name: "Selected work" }).click();
        assert(!await page.locator("#menu").isVisible() && await page.evaluate(() => location.hash === "#work"), "Menu selection navigates and closes");
        await page.getByRole("button", { name: "Identity", exact: true }).click();
        assert(await page.locator("[data-category]:visible").count() === 2, "Identity filter shows two matching projects");
        await page.getByRole("button", { name: "Digital", exact: true }).click();
        assert(await page.locator("[data-category]:visible").count() === 2 && !await page.getByRole("button", { name: "View Matter project" }).isVisible(), "Digital filter replaces identity projects");
        await page.getByRole("button", { name: "All", exact: true }).click();
        assert(await page.locator("[data-category]:visible").count() === 4, "All filter restores every project");
        await page.getByRole("button", { name: "View Matter project" }).click();
        assert(await page.locator("#detail-title").textContent() === "Matter", "Project reveals individual concept notes");
        await page.keyboard.press("Escape");
        assert(!await page.locator("#project-dialog").isVisible(), "Escape closes case study");
        await page.locator("#motion").click();
        assert(await page.locator("#motion").getAttribute("aria-pressed") === "true", "Marquee pause control persists selected state");
        await page.locator("#motion").click();
        assert(await page.locator("#motion").getAttribute("aria-pressed") === "false", "Marquee resume restores motion state");
        await page.getByRole("button", { name: "Open menu" }).click();
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => document.querySelector(".menu-button").getAttribute("aria-expanded") === "false");
        assert(await page.locator(".menu-button").getAttribute("aria-expanded") === "false", "Escape resets menu accessibility state");
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await run()));
