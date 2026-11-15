import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("411-pest-control", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 6 && await page.locator(".process li").count() === 4, `${width}: complete treatments and process`);
        await page.locator('[data-pest="wasps"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("leave the nest undisturbed"), `${width}: safe nest detail`);
        await page.locator("#discuss").click();
        check(await page.locator("#pest").inputValue() === "wasps", `${width}: concern handoff`);
        await page.locator("#terms").click();
        check((await page.locator("#detail-copy").textContent()).includes("Do not rely on this as a contract"), `${width}: honest sample guarantee`);
        await page.keyboard.press("Escape");
        await page.locator("#postcode-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("full UK postcode"), `${width}: empty postcode guard`);
        await page.locator("#postcode").fill("12345");
        await page.locator("#postcode-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("full UK postcode"), `${width}: invalid postcode guard`);
        await page.locator("#postcode").fill("sw1a1aa");
        await page.locator("#postcode-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("sample zone only") && await page.locator("#quote-postcode").inputValue() === "SW1A1AA", `${width}: normalized sample postcode and handoff`);
        await page.locator("#postcode").fill("EH1 1AA");
        await page.locator("#postcode-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("does not mean"), `${width}: unknown postcode no false rejection`);
        await page.locator("#quote-postcode").fill("");
        await page.locator("#quote-form .button").click();
        check((await page.locator("#result").textContent()).includes("full UK postcode"), `${width}: quote postcode guard`);
        await page.locator("#quote-postcode").fill("SW1A 1AA");
        await page.locator("#email").fill("bad");
        await page.locator("#quote-form .button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: malformed contact guard`);
        await page.locator("#email").fill("resident@example.com");
        await page.locator("#quote-form .button").click();
        check((await page.locator("#result").textContent()).includes("Acknowledge"), `${width}: demo acknowledgement`);
        await page.locator("#ack").check();
        await page.locator("#quote-form .button").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent or booked") && (await page.locator("#result").textContent()).includes("Wasps"), `${width}: honest contextual local request`);
        await page.locator("#quote-form [type=reset]").click();
        check(await page.locator("#email").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: local data cleared`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: navigation escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
