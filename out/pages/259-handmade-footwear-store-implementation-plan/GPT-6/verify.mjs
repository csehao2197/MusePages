export async function run(page, assert)
{
    assert(await page.locator(".product").count() === 3, "Full collection");
    await page.locator('[data-filter="slides"]').click();
    assert(await page.locator(".product").count() === 1, "Slides filter");
    await page.locator('[data-filter="saved"]').click();
    assert(await page.locator("#empty").isVisible(), "Wishlist empty state");
    await page.locator('[data-filter="all"]').click();
    await page.locator('[data-save="0"]').click();
    await page.locator('[data-filter="saved"]').click();
    assert(await page.locator(".product").count() === 1, "Wishlist retains selected pair");
    await page.locator('[data-save="0"]').click();
    assert(await page.locator("#empty").isVisible(), "Removing last saved pair");
    await page.locator('[data-filter="all"]').click();
    await page.locator('[data-add="0"]').click();
    assert(await page.locator("#bag-count").textContent() === "1", "Bag updates");
    await page.locator("#bag").click();
    await page.locator("#coupon").fill("wrong");
    await page.locator("#apply").click();
    assert((await page.locator("#coupon-status").textContent()).includes("not valid"), "Invalid coupon");
    await page.locator("#coupon").fill(" first10 ");
    await page.locator("#apply").click();
    assert(await page.locator("#total").textContent() === "Total ₦43,200", "Coupon calculation");
    await page.locator("#apply").click();
    assert(await page.locator("#total").textContent() === "Total ₦43,200", "Coupon never stacks");
    await page.locator("#checkout").click();
    assert((await page.locator("#checkout-status").textContent()).includes("No payment"), "Honest checkout preview");
    await page.locator("[data-remove]").click();
    assert(await page.locator("#checkout").isDisabled(), "Empty checkout blocked");
    await page.locator('[data-close="cart-dialog"]').click();
    await page.locator("#size-guide").click();
    assert(await page.locator("#size-dialog").isVisible(), "Size guide opens");
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#size-dialog").isVisible()), "Keyboard dialog dismissal");
    await page.locator("#email").fill("invalid");
    await page.locator('#newsletter button').click();
    assert((await page.locator("#email-status").textContent()).includes("valid email"), "Invalid signup");
    await page.locator("#email").fill("maker@example.com");
    await page.locator('#newsletter button').click();
    assert((await page.locator("#email-status").textContent()).includes("No email was sent"), "Local subscription");
    await page.locator('#newsletter button').click();
    assert((await page.locator("#email-status").textContent()).includes("Already"), "Duplicate subscription");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
