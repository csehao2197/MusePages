export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert(await page.locator(".project:visible").count() === 6, "Six concept projects");
    await page.locator('[data-filter="Interiors"]').click();
    assert(await page.locator(".project:visible").count() === 2, "Interior filter");
    assert((await page.locator("#project-count").textContent()).includes("2"), "Filtered project count");
    await page.locator(".project:visible").first().click();
    assert(await page.locator("#project-dialog").isVisible(), "Project details open");
    assert(await page.locator("#project-title").textContent() === "A Place to Gather", "Correct project details");
    assert(await page.locator("#project-image svg").count() === 1, "Project artwork in detail");
    await page.keyboard.press("Escape");
    assert(!await page.locator("#project-dialog").isVisible(), "Project closes with Escape");
    await page.locator('[data-filter="Commercial"]').click();
    assert(await page.locator(".project:visible").count() === 1, "Commercial filter");
    await page.locator('[data-filter="All"]').click();
    assert(await page.locator(".project:visible").count() === 6, "Reset project filter");
    await page.locator(".service summary").first().click();
    assert(await page.locator(".service").first().getAttribute("open") !== null, "Service disclosure");


    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu expands");
        await page.locator("#navigation a").first().click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes on navigation");
    }
    if (!await page.locator("[data-book]").last().isVisible()) await page.locator("#menu").click();
    await page.locator("[data-book]").last().click();
    assert(await page.locator("#booking").isVisible(), "Request dialog opens");
    await page.locator("#booking-form button").click();
    assert(await page.locator("#booking-result").textContent() === "", "Required fields prevent empty request");
    await page.locator('[name="name"]').fill("Alex Sample");
    await page.locator('[name="email"]').fill("invalid");
    await page.locator("#booking-form button").click();
    assert(await page.locator("#booking-result").textContent() === "", "Invalid email rejected");
    await page.locator('[name="email"]').fill("alex@example.com");
    await page.locator("#booking-form button").click();
    assert((await page.locator("#booking-result").textContent()).includes("Nothing has been sent"), "Honest local form result");
    await page.keyboard.press("Escape");
    assert(!await page.locator("#booking").isVisible(), "Escape dismisses dialog");

}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
