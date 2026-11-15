export async function run(page, assert)
{
    assert(await page.locator("#duplicate").isDisabled(), "No-selection duplicate disabled");
    assert(await page.locator("#paste").isDisabled(), "Empty clipboard disabled");
    await page.locator('[data-layer="1"]').check();
    await page.locator("#canvas").focus();
    await page.keyboard.press("ArrowRight");
    assert(await page.locator("#x").inputValue() === "111", "Arrow moves 1px");
    await page.keyboard.press("Shift+ArrowDown");
    assert(await page.locator("#y").inputValue() === "262", "Shift arrow moves 10px");
    await page.locator("#name").focus();
    await page.keyboard.press("ArrowLeft");
    assert(await page.locator("#x").inputValue() === "111", "Typing focus does not move shape");
    await page.locator("#canvas").focus();
    await page.keyboard.press("Control+d");
    assert(await page.locator("[data-shape]").count() === 4, "Keyboard duplicate");
    assert(await page.locator("#x").inputValue() === "131", "Duplicate offset 20px");
    await page.locator("#copy").click();
    await page.locator("#color").fill("#123456");
    await page.locator("#paste").click();
    assert(await page.locator("#x").inputValue() === "161", "Paste offset 30px");
    assert(await page.locator("#color").inputValue() === "#eb7547", "Clipboard captures immutable snapshot");
    await page.locator("#reset").click();
    await page.locator('[data-layer="1"]').check();
    await page.locator('[data-layer="2"]').check();
    await page.locator("#color").fill("#456789");
    assert(await page.locator('[data-shape="1"]').getAttribute("fill") === "#456789" && await page.locator('[data-shape="2"]').getAttribute("fill") === "#456789", "Multi-selection colour");
    await page.locator('[data-align="left"]').click();
    assert(await page.locator('[data-shape="2"]').getAttribute("x") === "110", "Left alignment respects circle bounding box");
    await page.locator('[data-align="right"]').click();
    assert(await page.locator('[data-shape="1"]').getAttribute("cx") === "192", "Right alignment accounts for widths");
    await page.locator('[data-align="top"]').click();
    assert(await page.locator('[data-shape="2"]').getAttribute("y") === "252", "Top alignment");
    assert(await page.locator('[data-distribute="x"]').isDisabled(), "Distribution needs 3");
    await page.locator('[data-layer="3"]').check();
    await page.locator('[data-distribute="x"]').click();
    assert((await page.locator("#status").textContent()).includes("Equal spacing"), "Distribution executed");
    await page.locator("#delete").click();
    assert(await page.locator("[data-shape]").count() === 0, "Multi-delete");
    await page.locator("#add").click();
    assert(await page.locator("[data-shape]").count() === 1, "Add shape after empty state");
    await page.locator("#reset").click();
    assert(await page.locator("[data-shape]").count() === 3 && await page.locator("#paste").isDisabled(), "Reset restores clean canvas and clipboard");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
