import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserQA } from "../../../../../src/tools/serial-batch-507-516.mjs";

export async function run()
{
    return browserQA(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "crafted-digital-experiences-agency", async (page, assert, viewport) =>
    {
        assert(await page.locator("main > section").count() === 2, "Exactly two primary full-screen sections");
        if (viewport === "mobile")
        {
            await page.locator(".mobile-toggle").click();
            await page.locator("#mobile-nav").getByRole("link", { name: "Services" }).click();
            assert(!await page.locator("#mobile-nav").isVisible(), "Mobile navigation closes after selection");
        }
        else await page.locator("header").getByRole("link", { name: "Services" }).click();
        assert(await page.evaluate(() => location.hash === "#capabilities"), "Services navigates to capabilities");
        const scope = page.locator(".scope").first();
        await scope.click();
        assert(await scope.getAttribute("aria-expanded") === "true" && await page.locator(".scope-detail").first().isVisible(), "Capability scope reveals specific deliverables");
        await scope.click();
        assert(!await page.locator(".scope-detail").first().isVisible(), "Capability scope collapses");
        await page.locator("#showreel").click();
        assert(await page.locator("#reel").isVisible() && await page.locator("#reel-canvas").evaluate((canvas) => canvas.getContext("2d").getImageData(320, 180, 1, 1).data[3] > 0), "Showreel opens real rendered original motion artwork");
        await page.locator("#reel-pause").click();
        assert(await page.locator("#reel-pause").getAttribute("aria-pressed") === "true", "Showreel pause changes playback state");
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("#info-dialog").open);
        await page.locator(".hero-actions [data-contact]").click();
        await page.locator(".send").click();
        assert(await page.locator("#brief-status").textContent() === "", "Empty brief is rejected");
        await page.locator("#name").fill("Morgan");
        await page.locator("#email").fill("morgan@example.com");
        await page.locator("#vision").fill("A considered website for an independent brand.");
        await page.locator(".send").click();
        assert((await page.locator("#brief-status").textContent()).includes("Nothing has been sent"), "Valid brief truthfully remains browser-only");
        await page.locator(".close").click();
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await run()));
