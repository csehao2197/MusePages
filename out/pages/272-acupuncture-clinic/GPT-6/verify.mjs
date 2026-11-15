export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert(await page.locator(".card").count() === 6, "Six treatments");
    await page.locator('[data-treatment="4"]').click();
    assert((await page.locator("#treatment-info").textContent()).includes("£85"), "Treatment appointment details");
    for (let i = 0; i < 6; i++)
    {
        await page.locator('[data-point="' + i + '"]').click();
        assert(await page.locator('[data-point="' + i + '"]').getAttribute("aria-pressed") === "true", "Point selection " + i);
    }
    assert((await page.locator("#point-info").textContent()).includes("Tai Chong"), "Point content updates");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") !== null, "Health FAQ opens");


    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu expands");
        await page.locator("#navigation a").first().click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes on navigation");
    }
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
