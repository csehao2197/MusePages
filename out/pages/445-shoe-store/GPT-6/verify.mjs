import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("445-shoe-store", async (page, check, width) =>
    {
        check(await page.locator(".product").count() === 8 && await page.locator(".sale-tag").count() === 2, `${width}: eight products and two sales`);
        await page.locator("#bag-open").click();
        check((await page.locator("#modal-body").textContent()).includes("bag is empty"), `${width}: empty bag state`);
        await page.locator("#continue").click();
        await page.locator("#category").selectOption("Running");
        check(await page.locator(".product").count() === 3, `${width}: running category`);
        await page.locator("#wide").check();
        check(await page.locator(".product").count() === 1, `${width}: combined wide filter`);
        await page.locator("#search").fill("no matching shoes");
        check(await page.locator("#empty").isVisible() && await page.locator(".product").count() === 0, `${width}: empty search state`);
        await page.locator("#reset").click();
        check(await page.locator(".product").count() === 8, `${width}: filters reset`);
        await page.locator('[data-add="court-white"]').click();
        await page.locator("#confirm-add").click();
        check((await page.locator("#add-status").textContent()).includes("Choose an available"), `${width}: size required`);
        check(await page.locator('[data-size="9"]').isDisabled(), `${width}: unavailable size disabled`);
        await page.locator('[data-size="7"]').click();
        await page.locator("#width").selectOption("Wide");
        await page.locator("#confirm-add").click();
        check(await page.locator("#bag-count").textContent() === "1" && await page.locator(".toast").isVisible(), `${width}: add and toast`);
        await page.locator('[data-add="court-white"]').click();
        await page.locator('[data-size="7"]').click();
        await page.locator("#width").selectOption("Wide");
        await page.locator("#confirm-add").click();
        await page.locator("#bag-open").click();
        check(await page.locator(".bag-row").count() === 1 && (await page.locator(".bag-row").textContent()).includes("Qty 2") && (await page.locator(".bag-total").textContent()).includes("240"), `${width}: bag merges identical variants and subtotal`);
        await page.locator("[data-remove]").click();
        check(await page.locator("#bag-count").textContent() === "0" && (await page.locator("#modal-body").textContent()).includes("bag is empty"), `${width}: remove empties bag`);
        await page.keyboard.press("Escape");
        await page.locator('#newsletter-email').fill("invalid");
        await page.locator("#newsletter-form button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("Demo only"), `${width}: invalid newsletter email blocked`);
        await page.locator('#newsletter-email').fill("demo@example.com");
        await page.locator("#newsletter-form button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("not been subscribed") && await page.locator("#newsletter-email").inputValue() === "", `${width}: truthful newsletter demo clears email`);
        await page.locator('[data-info="Size guide"]').first().click();
        check(await page.locator(".guide tbody tr").count() === 8, `${width}: size guide opens`);
        await page.locator(".close").click();
        check(await page.locator('[type="password"]').count() === 0, `${width}: no credentials`);
        const min = await page.evaluate(() => Math.min(...[...document.querySelectorAll("body *")].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())).map((e) => parseFloat(getComputedStyle(e).fontSize))));
        check(min >= 14, `${width}: minimum text size`);
        if (width < 767)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav [data-filter="Boots"]').click();
            check(await page.locator(".product").count() === 2 && await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile category navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
