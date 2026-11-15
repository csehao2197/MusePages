import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("291-boxing-gym", async (page, check, width) =>
    {
        await page.locator("#day").selectOption("Sun");
        await page.locator("#discipline").selectOption("Boxing");
        check(await page.locator("#empty").isVisible(), `${width}: empty timetable`);
        await page.locator("#reset").click();
        check(await page.locator("#sessions tr").count() === 17, `${width}: complete week restored`);
        check(await page.locator("#sessions button:disabled").count() === 2, `${width}: full sessions disabled`);
        await page.locator("#available").check();
        check(await page.locator("#sessions tr").count() === 15, `${width}: availability filter`);
        await page.locator("[data-discipline='Muay Thai']").click();
        check(await page.locator("#sessions tr").count() === 1, `${width}: combined discipline filter`);
        await page.locator("#sessions button").click();
        check((await page.locator("#trial-session").inputValue()).length > 0, `${width}: class preselected`);
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("name"), `${width}: name required`);
        await page.locator("#name").fill("Alex Morgan");
        await page.locator("#email").fill("invalid");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("acknowledge"), `${width}: consent required`);
        await page.locator("#consent").check();
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("Muay Thai, Sun 11:00"), `${width}: selected class in summary`);
        check((await page.locator("#trial-status").textContent()).includes("Nothing sent or reserved"), `${width}: honest trial state`);
        await page.locator("#frequency").fill("2");
        await page.locator("#frequency").dispatchEvent("input");
        check((await page.locator("#comparison").textContent()).includes("Drop-in saves £35"), `${width}: low frequency comparison`);
        await page.locator("#frequency").fill("8");
        await page.locator("#frequency").dispatchEvent("input");
        check((await page.locator("#comparison").textContent()).includes("Monthly saves £55"), `${width}: high frequency comparison`);
        await page.locator("#juniors summary").click();
        check(await page.locator("#juniors p").isVisible(), `${width}: junior FAQ`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "boxing mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "boxing mobile closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
