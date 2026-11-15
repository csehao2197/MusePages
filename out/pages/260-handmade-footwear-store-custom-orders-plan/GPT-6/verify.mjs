export async function run(page, assert)
{
    await page.locator('[data-path="recreate"]').click();
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("https"), "Recreation requires valid reference");
    await page.locator("#kind").selectOption("new");
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("10 characters"), "New idea minimum detail");
    await page.locator("#kind").selectOption("modify");
    await page.locator("#next").click();
    await page.locator("#roses").check();
    await page.locator("#colour").check();
    await page.locator("#next").click();
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("size"), "Size validation");
    await page.locator("#size").selectOption("42");
    await page.locator("#pairs").fill("0");
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("1–10"), "Invalid pair count blocked");
    await page.locator("#pairs").fill("2");
    await page.locator("#timing").selectOption("date");
    await page.locator("#date").fill("2020-01-01");
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("future"), "Past date blocked");
    await page.locator("#timing").selectOption("relaxed");
    await page.locator("#next").click();
    assert((await page.locator("#review").textContent()).includes("₦43,000"), "Edit and quantity estimate correct");
    await page.locator("#next").click();
    assert((await page.locator("#error").textContent()).includes("+234"), "Contact required only at last step");
    await page.locator("#name").fill("Ada Maker");
    await page.locator("#phone").fill("+2348012345678");
    await page.locator("#email").fill("ada@example.com");
    await page.locator("#close").click();
    await page.reload();
    await page.locator("#resume").click();
    assert(await page.locator("#product").inputValue() === "Amara slide", "Draft product survives reload");
    await page.locator("#next").click();
    assert(await page.locator("#roses").isChecked(), "Draft edits survive reload");
    await page.locator("#next").click();
    assert(await page.locator("#pairs").inputValue() === "2", "Draft quantity survives reload");
    await page.locator("#next").click();
    await page.locator("#next").click();
    assert(await page.locator("#hub").isVisible(), "Request hub opens");
    assert(await page.locator("#dispatch").isDisabled(), "Dispatch initially locked");
    await page.locator("#quote").click();
    assert((await page.locator("#hub-status").textContent()).includes("₦43,000"), "Item estimate quote");
    await page.locator("#deposit").click();
    assert((await page.locator("#pay-status").textContent()).includes("₦21,500"), "Half deposit");
    assert(await page.locator("#dispatch").isDisabled(), "Deposit alone cannot dispatch");
    await page.locator("#balance").click();
    assert(await page.locator("#dispatch").isEnabled(), "Balance unlocks dispatch");
    await page.locator("#dispatch").click();
    assert((await page.locator("#hub-status").textContent()).includes("Nothing was shipped"), "Dispatch truthfully simulated");
    await page.locator("#message").fill("<b>Adjust the strap</b>");
    await page.locator("#chat button").click();
    assert(await page.locator("#messages b").count() === 0, "Messages rendered as text");
    assert((await page.locator("#messages").textContent()).includes("<b>Adjust"), "Message retained");
    await page.locator("#chat button").click();
    assert(await page.locator("#messages .message").count() === 2, "Empty message ignored");
    await page.locator("#hub-close").click();
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
