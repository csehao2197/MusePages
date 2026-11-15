import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("303-ceramics-studio", async (page, check, width) =>
    {
        check(await page.locator(".session").count() === 8, `${width}: complete sample schedule`);
        check(await page.locator(".session button:disabled").count() === 2, `${width}: full sessions disabled`);
        await page.locator("[data-class='Wheel Throwing']").click();
        check(await page.locator(".session").count() === 4, `${width}: class filter`);
        await page.locator("#available").check();
        check(await page.locator(".session").count() === 3, `${width}: availability filter`);
        await page.locator("[data-session='2']").click();
        check(await page.locator("#booking").isVisible(), `${width}: workshop dialog`);
        await page.locator("#people").fill("3");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("1–2"), `${width}: sample capacity enforced`);
        await page.locator("#people").fill("0");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("1–2"), `${width}: zero people rejected`);
        await page.locator("#people").fill("2");
        check((await page.locator("#total").textContent()).includes("£150"), `${width}: workshop total`);
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: name required`);
        await page.locator("#name").fill("Taylor");
        await page.locator("#email").fill("bad");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("taylor@example.com");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: sample acknowledgement`);
        await page.locator("#accept").check();
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing reserved, charged or sent"), `${width}: honest workshop plan`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#booking").isVisible(), `${width}: escape closes dialog`);
        await page.locator("#commission-type").selectOption("Tableware set");
        check(decodeURIComponent(await page.locator("#commission-link").getAttribute("href")).includes("Tableware set"), `${width}: commission subject`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "ceramics mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
