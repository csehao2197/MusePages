import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "CloudBites — Good Food, Zero Detours",
    tags: ["Food Delivery", "Interactive Delivery Zones", "Orange and Olive"],
    assets: ["burger.jpg", "pizza.jpg", "sushi.jpg", "bowl.jpg", "dessert.jpg"],
    mocks: "ZIP-based demo delivery, fictional food/prices/ratings, in-memory bag and native-app concept.",
    mobile: async (page, check) =>
    {
        await page.locator('.zone-buttons [data-zone="94110"]').click();
        check((await page.locator("#zone-info").textContent()).includes("25–30"), "Mobile zone selection");
    }
}, async (page, check) =>
{
    check(await page.locator(".food-card").count() === 6, "Six bestsellers");
    await page.locator("#zip").fill("10001");
    await page.locator("#address-form button").click();
    check((await page.locator("#delivery-result").textContent()).includes("not in"), "Out-of-zone handling");
    await page.locator("#zip").fill("94103");
    await page.locator("#address-form button").click();
    check((await page.locator("#delivery-result").textContent()).includes("20–25"), "Supported ZIP ETA");
    await page.locator('[data-category="Burgers"]').click();
    check(await page.locator(".food-card").count() === 2, "Cuisine filter");
    await page.locator("#all-menu").click();
    check(await page.locator(".food-card").count() === 6, "Full menu restored");
    await page.locator('[data-add="0"]').click();
    await page.locator('[data-add="2"]').first().click();
    check(await page.locator("#bag-count").textContent() === "2", "Bag updates");
    await page.locator("#cart-open").click();
    check((await page.locator("#total").textContent()).includes("$30.00"), "Accurate subtotal");
    await page.locator("#promo").fill("invalid");
    await page.locator("#promo-form button").click();
    check((await page.locator("#promo-status").textContent()).includes("isn't available"), "Invalid promo");
    await page.locator("#promo").fill("FIRSTBITE");
    await page.locator("#promo-form button").click();
    check((await page.locator("#total").textContent()).endsWith("$20.00"), "Discount calculation");
    await page.locator("#checkout").click();
    check((await page.locator("#checkout-status").textContent()).includes("Nothing ordered"), "Honest checkout preview");
    await page.locator("[data-remove]").first().click();
    check((await page.locator("#promo-status").textContent()).includes("at least $25"), "Discount threshold recalculated");
    check((await page.locator("#total").textContent()).endsWith("$14.00"), "Discount removed below minimum");
    await page.locator("#bag .close").click();
    await page.locator(".app-button").first().click();
    check((await page.locator("#info-body").textContent()).includes("not a live"), "Honest app action");
    await page.locator("#info .close").click();
    await page.locator('[data-info="Allergen information"]').click();
    check((await page.locator("#info-body").textContent()).includes("shared kitchen"), "Allergen information accessible");
});
