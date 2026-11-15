import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Umami House — The Menu",
    tags: ["Digital Menu", "Asian Fusion", "Rose Editorial"],
    assets: ["sushi.jpg", "bao.jpg", "noodles.jpg", "salmon.jpg", "bowl.jpg", "dessert.jpg", "tea.jpg", "menu-qr.png"],
    mocks: "Fictional menu, in-memory order; English/romanized names; illustrative serving photography.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-diet="Vegan"]').click();
        check(await page.locator(".dish").count() === 5, "Mobile vegan filter");
    }
}, async (page, check) =>
{
    check(await page.locator(".dish").count() === 8, "Eight dishes");
    await page.locator('[data-diet="Vegan"]').click();
    check(await page.locator(".dish").count() === 5, "Vegan filter");
    await page.locator('[data-diet="Gluten-Free"]').click();
    check(await page.locator(".dish").count() === 3, "Intersected dietary filters");
    await page.locator('[data-category="Desserts"]').click();
    check((await page.locator("#dishes").textContent()).includes("No dishes"), "Empty intersection");
    await page.locator("#clear").click();
    check(await page.locator(".dish").count() === 1, "Clear retains category");
    await page.locator('[data-category="All"]').click();
    await page.locator("#language").click();
    check((await page.locator(".dish h3").first().textContent()).includes("Sake aburi"), "Romanized names");
    await page.locator("#special-button").click();
    check((await page.locator("#dish-detail").textContent()).includes("Gluten, soy, sesame"), "Allergens shown");
    await page.locator("#spice").selectOption("Hot");
    await page.locator("#extra").check();
    check(await page.locator("#item-total").textContent() === "$15.00", "Add-on price");
    await page.locator("#customize button").click();
    check(await page.locator("#basket-count").textContent() === "1", "Basket count");
    await page.locator("#basket-button").click();
    check((await page.locator("#order-items").textContent()).includes("Hot · Extra avocado"), "Customization retained");
    check((await page.locator("#order-total").textContent()).includes("$15.00"), "Subtotal");
    await page.locator("[data-remove]").click();
    check((await page.locator("#order-items").textContent()).includes("Your table is waiting"), "Remove basket item");
    await page.locator('#order-dialog .close').click();
    check((await page.locator("#hours").textContent()).match(/OPEN NOW|CLOSED/), "Live hours");
    await page.emulateMedia({ media: "print" });
    check(!await page.locator("header").isVisible(), "Print layout");
    await page.emulateMedia({ media: "screen" });
});
