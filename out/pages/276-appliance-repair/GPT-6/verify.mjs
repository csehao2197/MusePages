export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert(await page.locator("[data-appliance]").count() === 8, "Eight appliance choices");
    await page.locator('[data-appliance="2"]').click();
    assert(await page.locator("#appliance-2").getAttribute("class") === "price-row selected", "Matching price row highlighted");
    assert((await page.locator("#picked").textContent()).includes("£90–£180"), "Matching dishwasher total");
    assert(await page.locator('[name="service"]').inputValue() === "Dishwasher", "Enquiry appliance preselected");
    await page.locator('[data-appliance="6"]').click();
    assert(await page.locator(".price-row.selected").count() === 1, "Previous selection clears");
    assert((await page.locator("#picked").textContent()).includes("£70–£140"), "Microwave range");
    await page.locator("#postcode").fill("LS1");
    await page.locator("#area-form button").click();
    assert((await page.locator("#area-result").textContent()).includes("full UK"), "Postcode format validation");
    await page.locator("#postcode").fill("ls1 1aa");
    await page.locator("#area-form button").click();
    assert((await page.locator("#area-result").textContent()).includes("in our sample"), "Case-insensitive covered postcode");
    await page.locator("#postcode").fill("SW1A 1AA");
    await page.locator("#area-form button").click();
    assert((await page.locator("#area-result").textContent()).includes("Outside"), "Outside coverage state");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") !== null, "Repair FAQ");


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
