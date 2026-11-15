export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert(await page.locator(".route").count() === 8, "Eight fixed routes");
    await page.locator("#airport").selectOption("Heathrow");
    assert(await page.locator(".route").count() === 3, "Heathrow route filtering");
    await page.locator(".route button").first().click();
    assert((await page.locator("#selection").textContent()).includes("£128"), "Exact fixed route fare");
    assert((await page.locator("#selection").textContent()).includes("nothing is reserved"), "No false booking");
    await page.locator("#airport").selectOption("Stansted");
    assert(await page.locator(".route").count() === 3, "Stansted filtering");
    assert(!await page.locator("#selection").isVisible(), "Filter clears stale selection");
    await page.locator("#airport").selectOption("");
    assert(await page.locator(".route").count() === 8, "All routes restored");
    assert((await page.locator(".phone").getAttribute("href")).startsWith("tel:"), "Telephone action");


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
