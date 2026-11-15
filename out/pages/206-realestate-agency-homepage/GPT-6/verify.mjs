import { verify } from "./lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Prestige Properties",
    tags: ["Luxury Real Estate", "Coastal Living", "Navy and Gold"],
    assets: ["estate.jpg"],
    mocks: "Fictional listings, agents, market figures and valuation; repeated local photography.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-mode="Rent"]').click();
        check((await page.locator("#results").textContent()).includes("rental"), "Mobile rent toggle");
    }
}, async (page, check) =>
{
    check(await page.locator(".property").count() === 6, "Six listings");
    await page.locator('[data-filter="Waterfront"]').click();
    check(await page.locator(".property").count() === 2, "Waterfront filter");
    await page.locator('[data-filter="All"]').click();
    await page.locator("#location").fill("La Jolla");
    await page.locator("#search button").click();
    check(await page.locator(".property").count() === 2, "Location search");
    await page.locator("#type").selectOption("Townhouse");
    await page.locator("#search button").click();
    check(await page.locator(".property").count() === 1, "Property type");
    await page.locator(".save").click();
    check(await page.locator(".save").getAttribute("aria-pressed") === "true", "Save state");
    await page.locator(".carousel").click();
    check(await page.locator(".carousel").textContent() === "○ ● ○", "Photo carousel");
    await page.locator("[data-home]").click();
    check(await page.locator("dialog").isVisible(), "Property dialog");
    await page.locator(".close").click();
    check(!await page.locator("dialog").isVisible(), "Dialog closes");
    await page.locator('[data-mode="Rent"]').click();
    check((await page.locator(".property h3").textContent()).includes("/ mo"), "Rental monthly rates");
    await page.locator('[data-quote="1"]').click();
    check((await page.locator("#quote-credit").textContent()).includes("85,000"), "Testimonial switch");
    await page.locator("#report").click();
    check((await page.locator("#detail-content").textContent()).includes("2.8 months"), "Market report");
    await page.locator(".close").click();
    await page.locator("#address").fill("42 Ocean Avenue, San Diego");
    await page.locator("#valuation button").click();
    check((await page.locator("#valuation-result").textContent()).includes("No request was sent"), "Honest valuation result");
    await page.locator('[data-place="Coronado"]').click();
    check(await page.locator("#location").inputValue() === "Coronado", "Neighborhood drilldown");
});
