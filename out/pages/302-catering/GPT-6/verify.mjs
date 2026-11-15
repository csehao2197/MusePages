import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("302-catering", async (page, check, width) =>
    {
        await page.locator("#tab-2").click();
        check((await page.locator("#dishes").textContent()).includes("Salt-marsh lamb"), `${width}: mains tab`);
        await page.locator("#tab-2").press("ArrowRight");
        check(await page.locator("#tab-3").getAttribute("aria-selected") === "true", `${width}: keyboard tabs`);
        check((await page.locator("#dishes").textContent()).includes("rhubarb"), `${width}: dessert content`);
        await page.locator("#tab-4").click();
        check(await page.locator(".dish").count() === 4, `${width}: four-glass pairing`);
        await page.locator("[data-plan='Celebrate']").click();
        check((await page.locator("#estimate").textContent()).includes("£7,400"), `${width}: package estimate`);
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("full name"), `${width}: empty form`);
        await page.locator("#name").fill("Sam Green");
        await page.locator("#email").fill("bad");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("sam@example.com");
        await page.locator("#guests").fill("8");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("40–400"), `${width}: package guest minimum`);
        await page.locator("#guests").fill("50");
        check((await page.locator("#estimate").textContent()).includes("£9,250"), `${width}: guest recalculation`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past date`);
        await page.locator("#date").fill("2027-10-10");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("location"), `${width}: location required`);
        await page.locator("#location").fill("London");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: draft acknowledgement`);
        await page.locator("#accept").check();
        await page.locator("input[value='Feast']").check();
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent, charged or reserved"), `${width}: honest confirmation`);
        check((await page.locator("#status").textContent()).includes("Feast"), `${width}: selected serving style`);
        await page.locator("[data-plan='Grand']").click();
        check((await page.locator("#estimate").textContent()).includes("Bespoke"), `${width}: POA no invented price`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "catering mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
