import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("396-nightclub", async (page, check, width) =>
    {
        check(await page.locator(".event").count() === 12 && await page.locator(".tier").count() === 4, `${width}: complete lineup and table tiers`);
        check(await page.locator("[data-ticket]:disabled").count() === 2, `${width}: sold out prevents purchase`);
        await page.locator("#availability").selectOption("sold");
        check(await page.locator(".event").count() === 2, `${width}: sold filter`);
        await page.locator("#availability").selectOption("available");
        check(await page.locator(".event").count() === 10, `${width}: available filter`);
        await page.locator("[data-ticket='0']").click();
        check(await page.locator("#ticket").isVisible() && (await page.locator("#ticket-name").textContent()) === "ANSWER CODE", `${width}: ticket preview handoff`);
        await page.locator("#quantity").fill("0");
        await page.locator("#calculate").click();
        check((await page.locator("#ticket-result").textContent()).includes("1 to 6"), `${width}: quantity guard`);
        await page.locator("#quantity").fill("3");
        await page.locator("#calculate").click();
        check((await page.locator("#ticket-result").textContent()).includes("€54") && (await page.locator("#ticket-result").textContent()).includes("No ticket"), `${width}: accurate local ticket calculation`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#ticket").isVisible(), `${width}: ticket escape`);
        await page.locator("[data-tier='2']").click();
        check(await page.locator("#table").inputValue() === "2", `${width}: table handoff`);
        await page.locator("#table-form button").first().click();
        check((await page.locator("#table-result").textContent()).includes("Choose a sample night"), `${width}: empty night guard`);
        await page.locator("#night").selectOption({ index: 1 });
        await page.locator("#guests").fill("13");
        await page.locator("#table-form button").first().click();
        check((await page.locator("#table-result").textContent()).includes("1–12"), `${width}: table capacity guard`);
        await page.locator("#guests").fill("10");
        await page.locator("#table-form button").first().click();
        check((await page.locator("#table-result").textContent()).includes("18+"), `${width}: policy acknowledgement`);
        await page.locator("#adult").check();
        await page.locator("#table-form button").first().click();
        check((await page.locator("#table-result").textContent()).includes("€70.00 each") && (await page.locator("#table-result").textContent()).includes("No table reserved"), `${width}: truthful spend per guest`);
        await page.locator("#table-form [type=reset]").click();
        check(await page.locator("#guests").inputValue() === "" && await page.locator("#table-result").textContent() === "", `${width}: table reset`);
        await page.locator(".resident-grid summary").first().click();
        check(await page.locator(".resident-grid details").first().getAttribute("open") !== null, `${width}: resident mix note`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile fullscreen navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
