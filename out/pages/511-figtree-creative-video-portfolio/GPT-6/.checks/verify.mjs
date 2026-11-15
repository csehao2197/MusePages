import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserQA } from "../../../../../src/tools/serial-batch-507-516.mjs";

export async function run()
{
    return browserQA(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "figtree-creative-video-portfolio", async (page, assert, viewport) =>
    {
        await page.locator('[data-scene="1"]').click();
        assert(await page.locator("#grid").evaluate((canvas) => canvas.classList.contains("active")) && await page.locator('[data-scene="1"]').getAttribute("aria-pressed") === "true", "Gridwave changes visual scene and selected state");
        await page.locator('[data-scene="2"]').click();
        assert((await page.locator("#study-name").textContent()).includes("LIGHT TUNNEL"), "Light tunnel updates scene caption");
        await page.locator('[data-scene="0"]').click();
        assert(await page.locator("#water").evaluate((canvas) => canvas.width > 0 && canvas.classList.contains("active")), "Water wave restores genuinely rendered original art");
        const before = await page.locator("#clock").textContent();
        await page.waitForTimeout(1100);
        assert(await page.locator("#clock").textContent() !== before, "Live Cupertino clock advances");
        await page.locator("#pause").click();
        assert(await page.locator("#pause").getAttribute("aria-pressed") === "true", "Pause control changes animation state");
        if (viewport === "mobile")
        {
            await page.locator(".menu-toggle").click();
            assert(await page.locator(".menu-toggle").getAttribute("aria-expanded") === "true", "Mobile menu expands");
            await page.locator("#mobile-menu [data-panel='Services']").click();
            assert(await page.locator(".menu-toggle").getAttribute("aria-expanded") === "false", "Menu selection collapses panel");
        }
        else await page.locator(".desktop-nav [data-panel='Services']").click();
        assert((await page.locator("#panel-content").textContent()).includes("Brand strategy"), "Services opens meaningful service details");
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog").open);
        await page.locator(".start").click();
        await page.locator(".send").click();
        assert(await page.locator("#status").textContent() === "", "Empty brief is rejected");
        await page.locator("#name").fill("Alex");
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#message").fill("A new identity for our independent studio.");
        await page.locator(".send").click();
        assert((await page.locator("#status").textContent()).includes("Nothing has been sent"), "Valid brief truthfully acknowledges local-only action");
        await page.locator(".close").click();
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await run()));
