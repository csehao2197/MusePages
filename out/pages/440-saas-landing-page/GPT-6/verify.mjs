import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("440-saas-landing-page", async (page, check, width) =>
    {
        check(await page.locator(".product-frame img").count() === 1 && await page.locator(".feature").count() === 3, `${width}: static product image and feature details`);
        check(await page.locator("[data-billing], [data-price]").count() === 0, `${width}: no pricing calculator`);
        await page.locator("#tour").click();
        check(await page.locator("#previous").isDisabled() && (await page.locator("#tour-copy").textContent()).includes("not that retention is zero"), `${width}: tour first step`);
        await page.locator("#next").click();
        check((await page.locator("#tour-copy").textContent()).includes("not proof"), `${width}: tour risk context`);
        await page.locator("#previous").click();
        check((await page.locator("#modal-label").textContent()).includes("1 OF 3"), `${width}: tour previous`);
        await page.locator("#next").click();
        await page.locator("#next").click();
        check((await page.locator("#tour-copy").textContent()).includes("no message is sent"), `${width}: tour report disclosure`);
        await page.locator("#next").click();
        check(!await page.locator("dialog").isVisible(), `${width}: tour completes`);
        await page.locator('.plans [data-start="Growth"]').click();
        await page.locator("#plan button").click();
        check(await page.locator("#plan-status").textContent() === "", `${width}: empty provider blocked`);
        await page.locator('[name="provider"]').selectOption("Chargebee");
        await page.locator('[name="ack"]').check();
        await page.locator("#plan button").click();
        check((await page.locator("#plan-status").textContent()).includes("beta concept"), `${width}: beta provider state`);
        await page.locator('[name="provider"]').selectOption("Stripe");
        await page.locator("#plan button").click();
        check((await page.locator("#plan-status").textContent()).includes("No connection, workspace"), `${width}: local checklist not connected`);
        await page.keyboard.press("Escape");
        const download = page.waitForEvent("download");
        await page.locator("#download").click();
        check((await download).suggestedFilename() === "pace-sample-metrics.csv", `${width}: semantic CSV export`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: native FAQ`);
        await page.locator('[data-info="Security"]').click();
        check((await page.locator("#modal-body").textContent()).includes("no verified certification"), `${width}: security claims disclosed`);
        await page.locator(".close").click();
        check(await page.locator('[type="password"], [type="email"]').count() === 0, `${width}: no auth or email collection`);
        if (width < 750)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#pricing"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
