import path from "node:path";
import { fileURLToPath } from "node:url";
import { browserQA } from "../../../../../src/tools/serial-batch-507-516.mjs";

export async function run()
{
    return browserQA(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), "ashley-avant-garde-design-portfolio", async (page, assert) =>
    {
        await page.getByRole("link", { name: "Projects", exact: true }).click();
        assert(await page.evaluate(() => location.hash === "#projects"), "Navigation reaches 3D projects");
        await page.getByRole("button", { name: "Previous project" }).click();
        assert(await page.locator("#project-title").textContent() === "Sonder", "Carousel wraps backwards to fifth project");
        await page.getByRole("button", { name: "Next project" }).click();
        assert(await page.locator("#project-title").textContent() === "Orbit Finance", "Carousel wraps forwards");
        await page.getByRole("button", { name: "Next project" }).click();
        assert(await page.locator("#project-title").textContent() === "Forma Studio", "Carousel updates active artwork and notes");
        await page.locator("#visit").click();
        assert((await page.locator("#modal-title").textContent()) === "Forma Studio" && await page.locator("dialog").isVisible(), "Active project opens matching concept details");
        await page.keyboard.press("Escape");
        await page.waitForFunction(() => !document.querySelector("dialog").open);
        await page.getByRole("button", { name: "Send message" }).click();
        assert(await page.locator("#form-status").textContent() === "", "Empty contact form rejects submission");
        await page.locator("#name").fill("Taylor");
        await page.locator("#email").fill("not-an-email");
        await page.locator("#message").fill("A thoughtful design project.");
        await page.getByRole("button", { name: "Send message" }).click();
        assert(await page.locator("#email").evaluate((input) => !input.validity.valid), "Invalid email is rejected");
        await page.locator("#email").fill("taylor@example.com");
        await page.getByRole("button", { name: "Send message" }).click();
        assert((await page.locator("#form-status").textContent()).includes("nothing has been sent"), "Valid form gives honest local-only acknowledgement");
        assert(await page.locator("#fluid").evaluate((canvas) => canvas.width > 0 && canvas.height > 0), "Procedural background is genuinely rendered");
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await run()));
