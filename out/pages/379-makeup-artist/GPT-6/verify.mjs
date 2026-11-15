import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("379-makeup-artist", async (page, check, width) =>
    {
        check(await page.locator(".study").count() === 6, `${width}: complete concept gallery`);
        await page.locator("[data-filter='Bridal']").click();
        check(await page.locator(".study").count() === 2, `${width}: bridal filter`);
        await page.locator(".study").first().click();
        check(await page.locator("#viewer").isVisible() && (await page.locator("#viewer-copy").textContent()).includes("illustrated face"), `${width}: honest detailed study viewer`);
        await page.locator("#viewer-choose").click();
        check(await page.locator("#service").inputValue() === "Bridal" && (await page.locator("[name='message']").inputValue()).includes("Quiet luminosity"), `${width}: study handoff to project brief`);
        await page.locator("[data-filter='Film']").click();
        check(await page.locator(".study").count() === 1, `${width}: single film study`);
        await page.locator(".study").click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#viewer").isVisible(), `${width}: keyboard viewer close`);
        await page.locator("[data-service='Special Occasions']").click();
        check(await page.locator("#service").inputValue() === "Special Occasions", `${width}: service row handoff`);
        await page.locator("#enquiry [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty enquiry guard`);
        await page.locator("[name='name']").fill("Example");
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#enquiry [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("future proposed date"), `${width}: past date error`);
        await page.locator("[name='date']").fill("2099-06-01");
        await page.locator("#enquiry [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Confirm"), `${width}: local-only acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#enquiry [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Special Occasions on 2099-06-01") && (await page.locator("#result").textContent()).includes("No enquiry sent"), `${width}: meaningful honest project preview`);
        await page.locator("[type='reset']").click();
        check(await page.locator("[name='name']").inputValue() === "", `${width}: private input reset`);
        await page.locator(".faq summary").nth(2).click();
        check((await page.locator(".faq details").nth(2).textContent()).includes("sensitivities") && await page.locator(".faq details").nth(2).getAttribute("open") !== null, `${width}: meaningful bridal trial FAQ`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile menu closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
