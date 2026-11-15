import { audit } from "./serial-qa.mjs";
export async function verify()
{
    return audit("290-bowling-alley", async (page, check, width) =>
    {
        await page.locator("#reserve").click();
        check((await page.locator("#status").textContent()).includes("at least one"), `${width}: empty lanes rejected`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#date").dispatchEvent("change");
        check(await page.locator("[data-lane]").count() === 12, `${width}: twelve lanes`);
        check(await page.locator("[data-lane]:disabled").count() === 3, `${width}: taken lanes disabled`);
        await page.locator("[data-lane]:not(:disabled)").first().click();
        check(await page.locator("#total").textContent() === "$30", `${width}: off peak plus shoes`);
        await page.locator("#people").fill("7");
        await page.locator("#reserve").click();
        check((await page.locator("#status").textContent()).includes("1–6"), `${width}: lane capacity enforced`);
        await page.locator("#people").fill("6");
        await page.locator("#shoes").uncheck();
        check(await page.locator("#total").textContent() === "$24", `${width}: own shoes excluded`);
        await page.locator("#reserve").click();
        check((await page.locator("#status").textContent()).includes("Nothing reserved"), `${width}: honest mock review`);
        await page.locator("[data-time='18']").click();
        check(await page.locator("#total").textContent() === "$0", `${width}: slot clears lanes`);
        await page.locator("[data-lane]:not(:disabled)").first().click();
        check(await page.locator("#total").textContent() === "$38", `${width}: peak rate`);
        await page.locator("[data-lane][aria-pressed=true]").click();
        check(await page.locator("#total").textContent() === "$0", `${width}: deselection`);
        await page.locator("[data-party='34']").click();
        check((await page.locator("#party-total").textContent()).includes("at least 12"), `${width}: package minimum`);
        await page.locator("#children").fill("12");
        check((await page.locator("#party-total").textContent()).includes("$408"), `${width}: party estimate`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "mobile navigation closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
