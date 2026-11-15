import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("403-padel-club", async (page, check, width) =>
    {
        check(await page.locator(".rules li").count() === 6 && await page.locator("tbody tr").count() === 4 && await page.locator(".league").count() === 4, `${width}: complete rules coaching and leagues`);
        await page.locator("[data-answer=wrong]").click();
        check((await page.locator("#rules-result").textContent()).includes("Not quite"), `${width}: rules incorrect feedback`);
        await page.locator("[data-answer=right]").click();
        check((await page.locator("#rules-result").textContent()).includes("Correct"), `${width}: correct serve feedback`);
        await page.locator("#players").fill("");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("Choose 1 to 4"), `${width}: empty split validation`);
        await page.locator("#players").fill("4");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("£8.00 each"), `${width}: off peak four-way price`);
        await page.locator("#plan").selectOption("rally");
        await page.locator("#peak").selectOption("44");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("£39.60") && (await page.locator("#cost-result").textContent()).includes("£9.90 each"), `${width}: Rally percentage discount`);
        await page.locator("#plan").selectOption("smash");
        await page.locator("#peak").selectOption("32");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("£0.00") && (await page.locator("#cost-result").textContent()).includes("hypothetical"), `${width}: eligible sample free credit`);
        await page.locator("#credits").selectOption("0");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("£32.00") && (await page.locator("#cost-result").textContent()).includes("No eligible"), `${width}: exhausted credit guard`);
        await page.locator("#credits").selectOption("2");
        await page.locator("#peak").selectOption("44");
        await page.locator("#cost-form button").first().click();
        check((await page.locator("#cost-result").textContent()).includes("£44.00") && (await page.locator("#cost-result").textContent()).includes("No eligible"), `${width}: peak credit excluded`);
        await page.locator("#cost-form [type=reset]").click();
        check(await page.locator("#plan").inputValue() === "none" && await page.locator("#cost-result").textContent() === "", `${width}: cost reset`);
        await page.locator("#level").selectOption("intermediate");
        check(await page.locator(".league").count() === 2, `${width}: league level filter`);
        await page.locator("#level").selectOption("advanced");
        check(await page.locator("#league-empty").isVisible() && await page.locator(".league").count() === 0, `${width}: honest empty league filter`);
        check((await page.locator("#booking").textContent()).includes("did not supply a verified booking URL") && await page.locator("input[type=date]").count() === 0, `${width}: honest absent booking integration`);
        if (width < 767)
        {
            check(await page.locator(".mobile-book").isVisible(), `${width}: mobile booking info bar`);
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
