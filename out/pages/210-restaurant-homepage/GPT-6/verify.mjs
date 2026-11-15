import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Bella Cucina — A Taste of Home",
    tags: ["Italian Restaurant", "Burgundy and Cream", "Editorial Dining"],
    assets: ["pasta.jpg", "chef.jpg", "bar.jpg", "interior.jpg", "pizza.jpg", "salmon.jpg", "playfair.ttf", "lato.ttf", "LICENSE-Playfair.txt", "LICENSE-Lato.txt"],
    mocks: "Fictional restaurant/reviews, reservation/newsletter previews, offline location diagram and illustrative photos.",
    mobile: async (page, check) =>
    {
        await page.locator(".hero .menu-open").click();
        check(await page.locator("#menu-dialog").isVisible(), "Mobile menu CTA");
    }
}, async (page, check) =>
{
    check(await page.locator(".dish-link").count() === 3, "Three signatures");
    check(await page.evaluate(() => document.fonts.check("16px Playfair") && document.fonts.check("16px Lato")), "Local fonts loaded");
    await page.locator(".hero .menu-open").click();
    check(await page.locator(".menu-row").count() === 4, "Dinner menu");
    await page.locator('[data-course="Dessert"]').click();
    check((await page.locator("#full-menu").textContent()).includes("Tiramisù"), "Dessert menu");
    await page.locator('[data-course="Wine"]').click();
    check((await page.locator("#full-menu").textContent()).includes("Chianti"), "Wine menu");
    await page.locator("#menu-dialog .close").click();
    await page.locator('[data-photo="0"]').click();
    check((await page.locator("#photo-caption").textContent()).startsWith("1 / 4"), "Gallery opens");
    await page.locator("#photo-next").click();
    check((await page.locator("#photo-caption").textContent()).startsWith("2 / 4"), "Gallery next");
    await page.keyboard.press("ArrowLeft");
    check((await page.locator("#photo-caption").textContent()).startsWith("1 / 4"), "Gallery keyboard previous");
    await page.keyboard.press("Escape");
    check(!await page.locator("#lightbox").isVisible(), "Gallery escape");
    const monday = new Date();
    monday.setDate(monday.getDate() + ((8 - monday.getDay()) % 7 || 7));
    const iso = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
    await page.locator("#date").fill(iso(monday));
    await page.locator("#guest-name").fill("Alex");
    await page.locator("#reserve-form button").click();
    check((await page.locator("#reservation-result").textContent()).includes("Mondays"), "Closed day");
    monday.setDate(monday.getDate() + 1);
    await page.locator("#date").fill(iso(monday));
    await page.locator("#reserve-form button").click();
    check((await page.locator("#reservation-result").textContent()).includes("nothing was booked"), "Honest reservation preview");
    await page.locator("#newsletter-email").fill("diner@example.com");
    await page.locator("#newsletter button").click();
    check((await page.locator("#newsletter-result").textContent()).includes("no subscription"), "Honest newsletter preview");
    await page.locator('[data-info="Private events"]').click();
    check((await page.locator("#info-copy").textContent()).includes("12–30"), "Private events info");
    await page.keyboard.press("Escape");
    check((await page.locator(".map-art a").getAttribute("href")).includes("google.com/maps"), "Location directions link");
});
