import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("420-pizzeria", async (page, check, width) =>
    {
        check(await page.locator(".pizza").count() === 12, `${width}: complete twelve pizza menu`);
        await page.locator('[data-filter="vegan"]').click();
        check(await page.locator(".pizza").count() === 2, `${width}: vegan filter`);
        await page.locator(".pizza button").first().click();
        check((await page.locator("#total").textContent()).includes("£8.10"), `${width}: collection discount calculation`);
        await page.locator('[data-filter="vegetarian"]').click();
        check(await page.locator(".pizza").count() === 8, `${width}: vegetarian includes vegan`);
        await page.locator('[data-filter="gluten"]').click();
        check(await page.locator(".pizza").count() === 12 && (await page.locator(".pizza-head b").first().textContent()) === "£11", `${width}: GF supplement per pizza`);
        await page.locator(".pizza button").first().click();
        check((await page.locator("#total").textContent()).includes("£18.00") && (await page.locator("#basket-list").textContent()).includes("GF base"), `${width}: mixed base estimate`);
        check((await page.locator(".allergen").textContent()).includes("cross-contamination"), `${width}: allergy warning retained`);
        await page.locator("#clear-basket").click();
        check((await page.locator("#basket-list").textContent()).includes("No pizzas") && (await page.locator("#total").textContent()).includes("£0.00"), `${width}: empty basket restored`);
        await page.locator("#table .button").click();
        check((await page.locator("#table-result").textContent()).includes("future"), `${width}: missing date`);
        await page.locator("#party").selectOption("7");
        await page.locator("#table .button").click();
        check((await page.locator("#table-result").textContent()).includes("please call"), `${width}: large group call route`);
        await page.locator("#party").selectOption("2");
        await page.locator("#date").fill("2030-07-08");
        await page.locator("#table .button").click();
        check((await page.locator("#table-result").textContent()).includes("Mondays"), `${width}: closed day`);
        await page.locator("#date").fill("2030-07-09");
        await page.locator("#table .button").click();
        check((await page.locator("#table-result").textContent()).includes("valid phone"), `${width}: missing contact guard`);
        await page.locator("#name").fill("Alex");
        await page.locator("#phone").fill("0117 555 0123");
        await page.locator("#table .button").click();
        check((await page.locator("#table-result").textContent()).includes("Nothing sent and no table held"), `${width}: honest local enquiry`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#phone").inputValue() === "" && await page.locator("#table-result").textContent() === "", `${width}: private fields cleared`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
