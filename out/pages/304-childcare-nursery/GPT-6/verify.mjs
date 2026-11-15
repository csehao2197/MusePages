import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("304-childcare-nursery", async (page, check, width) =>
    {
        await page.locator("[data-stage='1']").click();
        check((await page.locator("#stage-title").textContent()).includes("Toddler"), `${width}: toddler activity`);
        check((await page.locator("#age").inputValue()).includes("Toddlers"), `${width}: contextual visit age`);
        await page.locator("[data-stage='2']").click();
        check((await page.locator("#stage-copy").textContent()).includes("early sounds"), `${width}: pre-school curriculum`);
        check(await page.locator("[data-stage='2']").getAttribute("aria-pressed") === "true", `${width}: active stage state`);
        await page.locator("#session").selectOption("46");
        check((await page.locator("#estimate").textContent()).includes("£138"), `${width}: half-day weekly estimate`);
        await page.locator("#days").fill("0");
        check((await page.locator("#estimate").textContent()).includes("1–5"), `${width}: zero sessions rejected`);
        await page.locator("#days").fill("6");
        check((await page.locator("#estimate").textContent()).includes("1–5"), `${width}: excess sessions rejected`);
        await page.locator("#days").fill("5");
        check((await page.locator("#estimate").textContent()).includes("£230"), `${width}: five sessions total`);
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("carer name"), `${width}: empty visit form`);
        await page.locator("#name").fill("Jordan");
        await page.locator("#email").fill("bad");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("jordan@example.com");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past visit date`);
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("Monday to Friday"), `${width}: weekend visit rejected`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: consent state`);
        await page.locator("#accept").check();
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or scheduled"), `${width}: honest visit plan`);
        check(await page.locator("a[href*='gov.uk']").count() === 1, `${width}: official funding guidance`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "nursery mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
