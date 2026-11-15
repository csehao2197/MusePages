import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("348-food-truck", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original truck illustration loads`);
        check(await page.locator(".menu-item").count() === 13, `${width}: all thirteen menu choices`);
        await page.locator("#day").selectOption("1");
        check(await page.locator("#no-stop").isVisible() && await page.locator(".stop").count() === 0, `${width}: Monday prep-day empty state`);
        await page.locator("#day").selectOption("6");
        check(await page.locator(".stop").count() === 1 && (await page.locator(".stop").textContent()).includes("Brixton"), `${width}: Saturday route`);
        await page.locator(".stop").click();
        check(await page.locator("#pickup").inputValue() === "Brixton Market", `${width}: route stop preselects pickup`);
        await page.locator("#day").selectOption("all");
        check(await page.locator(".stop").count() === 3, `${width}: whole week restored`);
        await page.locator("form button").click();
        check((await page.locator("#order-result").textContent()).includes("empty"), `${width}: empty tray rejected`);
        await page.locator("[data-quick='classic']").click();
        check(await page.locator("#cart-total").textContent() === "£11.00", `${width}: quick add signature`);
        await page.getByRole("button", { name: "Increase The Classic", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£22.00", `${width}: increase quantity`);
        await page.getByRole("button", { name: "Decrease The Classic", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£11.00", `${width}: decrease quantity`);
        await page.locator("#category").selectOption("Drinks");
        check(await page.locator(".menu-item").count() === 4, `${width}: drinks category`);
        await page.locator("#search").fill("lemonade");
        check(await page.locator(".menu-item").count() === 1, `${width}: combined menu search`);
        await page.locator("[data-add='lemonade']").click();
        check(await page.locator("#cart-total").textContent() === "£13.50", `${width}: decimal-price total`);
        await page.locator("#search").fill("absent");
        check(await page.locator("#menu-empty").isVisible(), `${width}: empty menu result`);
        await page.locator("#reset").click();
        check(await page.locator(".menu-item").count() === 13, `${width}: full menu reset`);
        await page.locator("form button").click();
        check((await page.locator("#order-result").textContent()).includes("first name"), `${width}: missing customer rejected`);
        await page.locator("#customer").fill("Example");
        await page.locator("form button").click();
        check((await page.locator("#order-result").textContent()).includes("Brixton Market") && (await page.locator("#order-result").textContent()).includes("No order sent"), `${width}: truthful pickup review`);
        await page.getByRole("button", { name: "Remove The Classic", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£2.50", `${width}: item removed`);
        await page.locator("#clear-cart").click();
        check(await page.locator("#cart-empty").isVisible() && await page.locator("#order-count").textContent() === "0", `${width}: tray clear`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: responsive interaction states`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
