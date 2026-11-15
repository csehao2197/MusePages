import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("294-butcher-shop", async (page, check, width) =>
    {
        await page.locator("#review").click();
        check((await page.locator("#status").textContent()).includes("empty"), `${width}: empty collection list`);
        await page.locator("[data-add='ribeye']").click();
        check(await page.locator("#total").textContent() === "€19.00", `${width}: half kilo price`);
        await page.locator("[data-quantity='ribeye']").fill("1.25");
        await page.locator("[data-quantity='ribeye']").dispatchEvent("change");
        check(await page.locator("#total").textContent() === "€47.50", `${width}: weight recalculation`);
        await page.locator("[data-category='Poultry & game']").click();
        check((await page.locator("#cuts").textContent()).includes("10 December"), `${width}: turkey enquiry only`);
        await page.locator("[data-add='pheasant']").click();
        check(await page.locator("#total").textContent() === "€59.50", `${width}: item pricing`);
        await page.locator("[data-quantity='pheasant']").fill("1.5");
        await page.locator("[data-quantity='pheasant']").dispatchEvent("change");
        check((await page.locator("#status").textContent()).includes("whole items"), `${width}: fractional item rejected`);
        await page.locator("[data-add='week']").click();
        check(await page.locator("#total").textContent() === "€124.50", `${width}: box added`);
        await page.locator("[data-remove='pheasant']").click();
        check(await page.locator("#bag").textContent() === "2", `${width}: remove line`);
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#review").click();
        check((await page.locator("#status").textContent()).includes("closed"), `${width}: closed Sunday`);
        await page.locator("#date").fill("2027-02-09");
        await page.locator("#review").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: name required`);
        await page.locator("#name").fill("Robin Hart");
        await page.locator("#review").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or reserved"), `${width}: honest collection review`);
        const expected = Math.max(0, Math.floor((Date.now() - Date.parse("2026-11-01T00:00:00Z")) / 86400000));
        check(Number(await page.locator("#batches article").first().getAttribute("data-days")) === expected, `${width}: date-derived ageing`);
        await page.locator("[data-recipe='0']").click();
        check((await page.locator("#recipe-title").textContent()).includes("Ox cheek"), `${width}: actual recipe context`);
        check(await page.locator("#method li").count() === 4, `${width}: complete cooking method`);
        await page.keyboard.press("Escape");
        await page.locator(".advice summary").nth(2).click();
        check((await page.locator(".advice details").nth(2).textContent()).includes("Thaw safely"), `${width}: storage advice expands`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "butcher mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "butcher mobile closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
