export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;

    assert((await page.locator("#subject").textContent()).includes("delivery"), "Default delivery ticket");
    await page.locator('[data-source="0"]').click();
    assert((await page.locator("#source").textContent()).includes("Tuesday"), "Source disclosure");
    await page.locator("#edit").click();
    await page.locator("#editor").fill("A reviewed reply.");
    await page.locator("#send").click();
    assert((await page.locator("#send-result").textContent()).includes("Save"), "Unsaved edit blocks approval");
    await page.locator("#edit").click();
    assert(await page.locator("#reply").textContent() === "A reviewed reply.", "Edit retained");
    await page.locator("#send").click();
    assert(await page.locator("#open-count").textContent() === "13", "Approval decrements local count");
    assert(await page.locator("#send").isDisabled(), "Duplicate send blocked");
    if (width < 760) await page.locator("#back").click();
    await page.locator('[data-ticket="0"]').click();
    assert((await page.locator("#question").textContent()).includes("charged"), "Ticket selection");
    assert((await page.locator("#confidence").textContent()).includes("HUMAN"), "Unknown answer requires review");


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
