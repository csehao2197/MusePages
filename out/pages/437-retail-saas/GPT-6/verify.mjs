import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("437-retail-saas", async (page, check, width) =>
    {
        check(await page.locator(".features article").count() === 6 && await page.locator("details").count() === 6, `${width}: complete features and FAQ`);
        await page.locator("#period").selectOption("week");
        check(await page.locator("#revenue").textContent() === "$24,180", `${width}: weekly analytics`);
        await page.locator("#period").selectOption("today");
        check(await page.locator("#revenue").textContent() === "$3,842", `${width}: daily analytics restored`);
        await page.locator("#low-only").check();
        check(await page.locator(".stock-row").count() === 2, `${width}: low stock filter`);
        await page.locator("[data-reorder]").first().click();
        check(await page.locator(".stock-row").count() === 1 && (await page.locator("#stock-status").textContent()).includes("No order was placed"), `${width}: sample reorder and disclosure`);
        await page.locator("[data-reorder]").click();
        check((await page.locator("#stock-list").textContent()).includes("All sample products"), `${width}: empty low stock state`);
        await page.locator("#low-only").uncheck();
        check(await page.locator(".stock-row").count() === 3, `${width}: inventory restored`);
        await page.locator("#receipt").click();
        check((await page.locator("#receipt-status").textContent()).includes("$9.50") && (await page.locator("#receipt-status").textContent()).includes("Not a payment"), `${width}: honest receipt preview`);
        await page.locator('[data-billing="annual"]').click();
        check(await page.locator('[data-price="49"]').textContent() === "39" && await page.locator('[data-price="119"]').textContent() === "95", `${width}: rounded annual pricing`);
        await page.locator('[data-billing="monthly"]').click();
        check(await page.locator('[data-price="49"]').textContent() === "49", `${width}: monthly pricing restored`);
        await page.locator(".hero [data-start]").click();
        await page.locator("#setup button").click();
        check(await page.locator("#setup-status").textContent() === "", `${width}: empty setup blocked`);
        await page.locator('[name="store"]').fill("  ");
        await page.locator('[name="consent"]').check();
        await page.locator("#setup button").click();
        check(await page.locator("#setup-status").textContent() === "", `${width}: whitespace name blocked`);
        await page.locator('[name="store"]').fill("<b>Corner Bakery</b>");
        await page.locator("#setup button").click();
        check((await page.locator("#setup-status").textContent()).includes("<b>Corner Bakery</b>") && await page.locator("#setup-status b").count() === 0, `${width}: safe local checklist`);
        await page.keyboard.press("Escape");
        await page.locator("details summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ opens`);
        await page.locator('[data-info="Privacy, terms and cookies"]').click();
        check((await page.locator("#modal-body").textContent()).includes("no cookies"), `${width}: privacy disclosure`);
        await page.locator(".close").click();
        check(await page.locator('[type="password"], [type="email"]').count() === 0, `${width}: no credentials or email`);
        if (width < 700)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#pricing"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
