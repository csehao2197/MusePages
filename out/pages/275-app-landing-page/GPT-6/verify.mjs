export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert(await page.locator(".sound").count() === 8, "Eight sounds");
    await page.locator('[data-sound="6"]').click();
    assert(await page.locator("#now-playing").textContent() === "Old fan", "Sound selection updates player");
    assert(await page.locator('[data-sound="0"]').getAttribute("aria-pressed") === "false", "Previous sound cleared");
    await page.locator("#timer").selectOption("15");
    assert(await page.locator("#clock").textContent() === "15:00", "Timer choice");
    await page.locator("#play").click();
    await page.waitForTimeout(1150);
    assert(await page.locator("#clock").textContent() !== "15:00", "Timer actually counts");
    await page.locator("#play").click();
    assert(await page.locator("#play").getAttribute("aria-pressed") === "false", "Timer pauses");
    await page.locator("#restart").click();
    assert(await page.locator("#clock").textContent() === "15:00", "Reset restores duration");
    await page.locator('[data-billing="yearly"]').click();
    assert((await page.locator("#price").textContent()).includes("$29"), "Annual price");
    await page.locator('[data-billing="monthly"]').click();
    assert((await page.locator("#price").textContent()).includes("$4.99"), "Monthly price");


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
