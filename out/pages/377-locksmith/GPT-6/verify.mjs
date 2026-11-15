import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("377-locksmith", async (page, check, width) =>
    {
        check(await page.locator("form, input, button").count() === 0, `${width}: no forms/calculators or dead button CTAs`);
        check(await page.locator(".services details").count() === 6 && await page.locator(".areas li").count() === 14, `${width}: complete service and area coverage`);
        await page.locator(".services summary").first().click();
        check((await page.locator(".services details").first().textContent()).includes("proof you are authorised"), `${width}: useful lockout call preparation`);
        await page.locator(".services summary").nth(4).click();
        check((await page.locator(".services details").nth(4).textContent()).includes("No product or installation automatically guarantees"), `${width}: honest insurer suitability`);
        await page.locator(".price-note summary").click();
        check(await page.locator(".price-note").getAttribute("open") !== null, `${width}: price inclusion disclosure`);
        check(await page.locator("dl > div").count() === 5 && (await page.locator("dl").textContent()).includes("£119"), `${width}: full price board`);
        check(await page.locator("a[href^='tel:']").count() === 11 && await page.locator("a[href^='tel:']").evaluateAll((links) => links.every((link) => link.getAttribute("href") === "tel:08000467788")), `${width}: all eleven call actions use exact phone`);
        await page.locator("footer summary").click();
        check((await page.locator("footer details").textContent()).includes("do not automatically place"), `${width}: phone application privacy explanation`);
        if (width < 768)
        {
            check(await page.locator(".mobile-call").isVisible() && await page.locator(".mobile-call").evaluate((el) => getComputedStyle(el).position === "fixed"), `${width}: visible fixed emergency phone action`);
            check(await page.locator(".mobile-call").evaluate((el) => el.getBoundingClientRect().bottom === innerHeight), `${width}: call bar remains inside viewport`);
        }
        else
        {
            await page.locator("nav a[href='#areas']").click();
            check(await page.evaluate(() => location.hash === "#areas"), `${width}: service area navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
