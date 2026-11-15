import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("386-mexican-restaurant", async (page, check, width) =>
    {
        check(await page.locator(".dish").count() === 4 && (await page.locator("#dishes").textContent()).includes("$4.50"), `${width}: original taco menu`);
        await page.locator("[data-tab=Platos]").click();
        check((await page.locator("#dishes").textContent()).includes("Mole poblano") && (await page.locator("#dishes").textContent()).includes("$26.00"), `${width}: plates and prices`);
        await page.locator("#vegetarian").check();
        check(await page.locator(".dish").count() === 1 && (await page.locator("#dishes").textContent()).includes("Chile relleno"), `${width}: vegetarian plate`);
        await page.locator("[data-tab=Sides]").click();
        check(await page.locator(".dish").count() === 0 && (await page.locator("#dishes").textContent()).includes("No dishes match"), `${width}: honest empty designation state`);
        await page.locator("#reset-menu").click();
        check(await page.locator(".dish").count() === 4 && await page.locator("[data-tab=Tacos]").getAttribute("aria-selected") === "true", `${width}: reset tab and filters`);
        await page.locator("#search").fill("pineapple");
        check(await page.locator(".dish").count() === 1 && (await page.locator("#dishes").textContent()).includes("Al pastor"), `${width}: ingredient search`);
        await page.locator("#search").fill("<script>");
        check(await page.locator(".dish").count() === 0 && await page.locator("#dishes script").count() === 0, `${width}: safe unmatched search`);
        await page.locator("#reset-menu").click();
        await page.locator("[data-tab=Tacos]").focus();
        await page.keyboard.press("ArrowRight");
        check(await page.locator("[data-tab=Platos]").getAttribute("aria-selected") === "true", `${width}: keyboard tabs`);
        await page.keyboard.press("End");
        check((await page.locator("#dishes").textContent()).includes("Horchata") && await page.locator(".dish").count() === 4, `${width}: drink menu`);
        await page.locator("[data-tab=Sides]").click();
        check((await page.locator("#dishes").textContent()).includes("Guacamole") && (await page.locator("#dishes").textContent()).includes("$11.00"), `${width}: side prices`);
        check(await page.locator(".bottles article").count() === 8, `${width}: full bottle list`);
        await page.locator("#booking-info").click();
        check(await page.locator("#booking-note").isVisible() && (await page.locator("#booking-note").textContent()).includes("no table can be booked"), `${width}: truthful booking boundary`);
        check(await page.locator("form").count() === 0, `${width}: no reservation widget`);
        if (width < 767)
        {
            await page.locator("#nav-toggle").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
