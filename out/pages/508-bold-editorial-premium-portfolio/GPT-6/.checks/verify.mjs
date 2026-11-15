import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserQA } from "../../../../../src/tools/serial-batch-507-516.mjs";

export async function run()
{
    const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    return browserQA(folder, "bold-editorial-premium-portfolio", async (page, assert) =>
    {
        await page.getByRole("link", { name: "Work", exact: true }).click();
        assert(await page.evaluate(() => location.hash === "#work"), "Work navigation reaches selected projects");
        await page.getByRole("button", { name: "View Aural project", exact: true }).click();
        assert(await page.locator("dialog").isVisible() && await page.locator("#dialog-title").textContent() === "Aural", "Project opens its own case-study details");
        await page.keyboard.press("Escape");
        assert(!await page.locator("dialog").isVisible(), "Escape closes modal");
        await page.getByRole("button", { name: "Previous testimonial" }).click();
        assert(await page.locator("#counter").textContent() === "03 / 03", "Carousel wraps backwards");
        await page.getByRole("button", { name: "Next testimonial" }).click();
        assert(await page.locator("#counter").textContent() === "01 / 03", "Carousel wraps forwards");
        await page.getByRole("button", { name: "Next testimonial" }).click();
        assert((await page.locator("#quote").textContent()).includes("RARE BALANCE"), "Carousel updates quote and speaker");
        await page.getByRole("button", { name: "Privacy", exact: true }).click();
        assert((await page.locator("#dialog-copy").textContent()).includes("no analytics"), "Privacy shows truthful local-only behavior");
        await page.locator(".dialog-done").click();
        assert(!await page.locator("dialog").isVisible(), "Dialog action restores page");
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await run()));
