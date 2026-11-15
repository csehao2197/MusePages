import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("340-farmers-market", async (page, check, width) =>
    {
        check(await page.locator(".mat img").evaluate((image) => image.naturalWidth > 0), `${width}: original market visual`);
        check(await page.locator(".stall").count() === 24 && await page.locator(".trader-row").count() === 24, `${width}: all twenty-four mapped traders`);
        await page.locator("[data-stall='23']").focus();
        check(await page.locator("#stall-name").textContent() === "Knife and Steel", `${width}: keyboard stall detail`);
        await page.keyboard.press("Enter");
        check(await page.locator("[data-stall='23']").getAttribute("aria-pressed") === "true", `${width}: keyboard activation`);
        await page.locator("[data-stall='2']").dispatchEvent("mouseenter");
        check(await page.locator("#stall-name").textContent() === "Marlow Hill", `${width}: hover detail`);
        await page.locator("[data-stall='1']").click();
        check(await page.locator("#stall-name").textContent() === "Cross Oak Bakery", `${width}: pointer/tap detail`);
        check((await page.locator("#cart-status").textContent()).includes("empty"), `${width}: initial empty shopping list`);
        await page.locator("#add-item").click();
        check(await page.locator("#cart-total").textContent() === "£4.50", `${width}: selected trader item added`);
        await page.getByRole("button", { name: "Increase Sourdough loaf", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£9.00", `${width}: quantity increases`);
        await page.getByRole("button", { name: "Decrease Sourdough loaf", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£4.50", `${width}: quantity decreases`);
        await page.getByRole("button", { name: "Decrease Sourdough loaf", exact: true }).click();
        check(await page.locator(".cart-row").count() === 0 && (await page.locator("#cart-status").textContent()).includes("empty"), `${width}: final decrease removes item and restores empty state`);
        await page.locator("#category").selectOption("produce");
        check(await page.locator(".trader-row").count() === 4, `${width}: produce/flower category`);
        await page.locator("#search").fill("mushroom");
        check(await page.locator(".trader-row").count() === 1, `${width}: combined search/category`);
        await page.locator(".trader-row").click();
        check(await page.locator("#stall-name").textContent() === "Cotswold Mushrooms", `${width}: index links back to stall`);
        await page.locator("#add-item").click();
        check(await page.locator("#cart-total").textContent() === "£4.50", `${width}: distinct trader shopping item`);
        await page.locator("#search").fill("absent-trader");
        check(await page.locator("#empty").isVisible(), `${width}: empty vendor result`);
        await page.locator("#reset").click();
        check(await page.locator(".trader-row").count() === 24, `${width}: full index reset`);
        await page.locator("#clear-cart").click();
        check(await page.locator("#cart-total").textContent() === "£0.00", `${width}: clear shopping list`);
        await page.locator("#apply-button").click();
        await page.locator("form button").click();
        check((await page.locator("#application-result").textContent()).includes("valid email"), `${width}: empty trader enquiry rejected`);
        await page.locator("[name='name']").fill("Example Maker");
        await page.locator("[name='email']").fill("maker@example.test");
        await page.locator("textarea").fill("We make small batches of local preserves.");
        await page.locator("form button").click();
        check((await page.locator("#application-result").textContent()).includes("acknowledge"), `${width}: requirements acknowledgement enforced`);
        await page.locator("[name='confirm']").check();
        await page.locator("[name='pitch']").selectOption("48");
        await page.locator("form button").click();
        check((await page.locator("#application-result").textContent()).includes("£48") && (await page.locator("#application-result").textContent()).includes("no stall reserved"), `${width}: six-metre pitch local review`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#application").isVisible(), `${width}: keyboard dismissal`);
        const expected = await page.evaluate(() =>
        {
            const date = new Date();
            const days = (6 - date.getDay() + 7) % 7;
            date.setDate(date.getDate() + (days === 0 && date.getHours() >= 14 ? 7 : days));
            return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();
        });
        check(await page.locator("#next-date").textContent() === expected, `${width}: next market date calculated from local clock`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: list is transient with no stored personal data`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no overflow after shopping/filter/dialog states`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
