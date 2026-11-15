import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("312-coffee-shop", async (page, check, width) =>
    {
        check((await page.locator("#basket-list").textContent()).includes("empty"), `${width}: empty basket`);
        await page.locator("#milk").selectOption("0.4");
        await page.locator("#quantity").fill("2");
        await page.locator("#add-item button").click();
        check(await page.locator("#total").textContent() === "£7.20", `${width}: quantity and oat surcharge`);
        await page.locator("#product").selectOption("3.5");
        check(!await page.locator("#milk-label").isVisible(), `${width}: no milk surcharge on filter`);
        await page.locator("#quantity").fill("1");
        await page.locator("#add-item button").click();
        check(await page.locator("#total").textContent() === "£10.70", `${width}: mixed basket`);
        await page.locator("#basket-list button").first().click();
        check(await page.locator("#total").textContent() === "£3.50", `${width}: removal recalculates`);
        await page.locator("#origin").selectOption("Ethiopia");
        check((await page.locator("#origin-note").textContent()).includes("jasmine"), `${width}: origin tasting notes`);
        await page.locator("#product").selectOption("12");
        await page.locator("#add-item button").click();
        check((await page.locator("#basket-list").textContent()).includes("Ethiopia beans"), `${width}: selected origin in order`);
        await page.locator("#clear").click();
        check(await page.locator("#total").textContent() === "£0.00", `${width}: clear order`);
        await page.locator("#quantity").fill("0");
        await page.locator("#add-item").evaluate((form) => form.noValidate = true);
        await page.locator("#add-item button").click();
        check((await page.locator("#add-status").textContent()).includes("1–12"), `${width}: invalid quantity`);
        await page.locator("#people").fill("25");
        await page.locator("#enquiry button").click();
        check((await page.locator("#event-status").textContent()).includes("4–24"), `${width}: event capacity`);
        await page.locator("#people").fill("12");
        await page.locator("#occasion").selectOption("Coffee cupping");
        await page.locator("#enquiry button").click();
        check((await page.locator("#event-status").textContent()).includes("Coffee cupping for 12"), `${width}: contextual enquiry`);
        check((await page.locator("#event-status").textContent()).includes("nothing booked or sent"), `${width}: honest event state`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "light coffee mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
