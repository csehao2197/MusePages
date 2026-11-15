import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("362-hvac", async (page, check, width) =>
    {
        check(await page.locator(".service").count() === 6, `${width}: six service choices`);
        await page.locator(".service [data-quote]").nth(0).click();
        check(await page.locator("#service").inputValue() === "AC Installation & Replacement", `${width}: service preselection`);
        check((await page.locator("#estimate").textContent()).includes("2,400"), `${width}: installation starting price`);
        await page.locator("#service").selectOption("Tune-Up & Maintenance");
        check((await page.locator("#estimate").textContent()).includes("$89"), `${width}: service estimate updates`);
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-result").textContent()).includes("valid email"), `${width}: empty request rejected`);
        await page.locator("[name='name']").fill("Example Owner");
        await page.locator("[name='email']").fill("invalid");
        await page.locator("[name='zip']").fill("60614");
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-result").textContent()).includes("valid email"), `${width}: malformed request rejected`);
        await page.locator("[name='email']").fill("owner@example.test");
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-result").textContent()).includes("Tune-Up & Maintenance for Example Owner") && (await page.locator("#quote-result").textContent()).includes("Nothing sent"), `${width}: honest local selected-service summary`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#quote").isVisible(), `${width}: keyboard dismiss`);
        await page.locator("#area-form button").click();
        check((await page.locator("#area-result").textContent()).includes("five-digit"), `${width}: area error`);
        await page.locator("#zip").fill("60614");
        await page.locator("#area-form button").click();
        check((await page.locator("#area-result").textContent()).includes("Inside"), `${width}: area match`);
        await page.locator("#zip").fill("99999");
        await page.locator("#area-form button").click();
        check((await page.locator("#area-result").textContent()).includes("Outside"), `${width}: area unavailable state`);
        await page.locator("#faq summary").first().click();
        check(await page.locator("#faq details").first().getAttribute("open") !== null, `${width}: FAQ expands`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: menu opens`);
            await page.locator("#navigation a").first().click();
            check(!await page.locator("#navigation").isVisible(), `${width}: menu selection closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
