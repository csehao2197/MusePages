import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("425-print-shop", async (page, check, width) =>
    {
        check(await page.locator(".product").count() === 6 && await page.locator(".work-grid figure").count() === 8, `${width}: complete print and work catalogue`);
        check(await page.locator(".swatch").count() === 8, `${width}: all eight inks`);
        await page.locator(".swatch").nth(0).click();
        await page.locator(".swatch").nth(1).click();
        check((await page.locator("#ink-result").textContent()).includes("Fluoro Pink + Medium Blue"), `${width}: two ink selection`);
        await page.locator(".swatch").nth(2).click();
        check(await page.locator('.swatch[aria-pressed="true"]').count() === 2, `${width}: sample capped at two`);
        await page.locator("#clear-inks").click();
        check(await page.locator('.swatch[aria-pressed="true"]').count() === 0, `${width}: empty sample reset`);
        await page.locator(".product .print-art").first().click();
        check(await page.locator(".product .print-art").first().evaluate((element) => element.classList.contains("active")), `${width}: tap artwork colour`);
        await page.locator("[data-workshop]").first().click();
        check(await page.locator("dialog").isVisible() && (await page.locator("#dialog-body").textContent()).includes("No place has been reserved"), `${width}: truthful workshop enquiry`);
        check((await page.locator("#dialog-body a").getAttribute("href")).startsWith("mailto:"), `${width}: email handoff`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: escape dismisses`);
        await page.locator("#guide").click();
        check((await page.locator("#dialog-body").textContent()).includes("3mm bleed"), `${width}: actionable file guide`);
        await page.locator(".close").click();
        check(await page.locator('input[type="file"], input[type="range"]').count() === 0, `${width}: faithful no upload or calculator`);
        if (width < 768)
        {
            await page.evaluate(() => scrollTo(0, 0));
            await page.locator(".menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile navigation opens`);
            await page.locator('#navigation a[href="#colours"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
