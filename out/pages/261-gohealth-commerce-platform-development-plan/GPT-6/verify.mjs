export async function run(page, assert)
{
    assert(await page.locator("#rows tr").count() === 4, "Catalog pagination");
    await page.locator("#next-page").click();
    assert(await page.locator("#rows tr").count() === 2, "Second page");
    await page.locator("#search").fill("not-a-product");
    assert(await page.locator("#empty").isVisible(), "Search empty state");
    await page.locator("#search").fill("");
    await page.locator("#category").selectOption("Nutrition");
    assert(await page.locator("#rows tr").count() === 2, "Category filter");
    assert(await page.locator('[data-add="4"]').isDisabled(), "Out of stock blocked");
    await page.locator("#category").selectOption("all");
    await page.locator("#new-product").click();
    await page.locator("#product-form .primary").click();
    assert((await page.locator("#form-error").textContent()).includes("positive"), "Invalid product blocked");
    await page.locator("#product-name").fill("Test Wellness Pack");
    await page.locator("#price").fill("10000");
    await page.locator("#stock").fill("1");
    await page.locator("#product-form .primary").click();
    await page.locator("#search").fill("Test Wellness");
    assert(await page.locator("#rows tr").count() === 1, "Create product");
    await page.locator('[data-add="7"]').click();
    assert(await page.locator('[data-add="7"]').isDisabled(), "Reserved stock cannot oversell");
    assert(await page.locator("#total").textContent() === "Rp 10.000", "Order total");
    await page.locator('[data-edit="7"]').click();
    await page.locator("#stock").fill("0");
    await page.locator("#product-form .primary").click();
    assert((await page.locator("#form-error").textContent()).includes("reserved"), "Stock edit guard");
    await page.locator("#stock").fill("1");
    await page.locator("#price").fill("12000");
    await page.locator("#product-form .primary").click();
    assert(await page.locator("#total").textContent() === "Rp 12.000", "Edited price updates draft total");
    await page.locator("#checkout").click();
    assert((await page.locator("#invoice").textContent()).includes("Rp 12.000"), "Invoice reflects order");
    assert((await page.locator("#invoice").textContent()).includes("Payment not collected"), "Payment not misrepresented");
    await page.locator("#close-invoice").click();
    assert(await page.locator("#orders").textContent() === "1", "Order count");
    assert((await page.locator("#rows").textContent()).includes("Out of stock"), "Checkout decrements stock");
    assert(await page.locator("#checkout").isDisabled(), "Cart cleared after checkout");
    await page.locator('[data-edit="7"]').click();
    await page.locator("#delete").click();
    assert(await page.locator("#rows tr").count() === 0, "Delete product");
    await page.locator("#search").fill("");
    await page.locator("#sort").selectOption("price");
    assert((await page.locator("#rows tr").first().textContent()).includes("Gentle Hand Wash"), "Price sorting");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
