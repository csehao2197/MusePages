export async function run(page, assert)
{
    assert(await page.locator(".asset").count() === 6, "Six sample records");
    assert(await page.locator("#dry-run").isDisabled(), "No selection blocks report");
    assert(await page.locator('[data-select="4"]').isDisabled(), "Already WebP ineligible");
    assert(await page.locator('[data-select="6"]').isDisabled(), "Outside prefix excluded");
    await page.locator("#format").selectOption("png");
    assert(await page.locator(".asset").count() === 2, "Format filter");
    await page.locator("#search").fill("missing");
    assert(await page.locator("#empty").isVisible(), "Search empty state");
    await page.locator("#search").fill("");
    await page.locator("#format").selectOption("all");
    await page.locator('[data-detail="5"]').click();
    assert((await page.locator("#asset-join").textContent()).includes("exact URL"), "Category exact URL join explained");
    await page.keyboard.press("Escape");
    await page.locator("#select-all").click();
    assert(await page.locator("#selection-count").textContent() === "4 selected", "Scope-aware select all");
    await page.locator("#dry-run").click();
    assert((await page.locator("#report").textContent()).includes("4 candidate"), "Dry-run count");
    assert(await page.locator("#ready-count").textContent() === "1", "Dry run changes no sample records");
    assert(await page.locator("#apply").isDisabled(), "Review gate");
    await page.locator("#reviewed").check();
    assert(await page.locator("#apply").isEnabled(), "Reviewed report unlocks preview");
    await page.locator('[data-select="1"]').uncheck();
    assert(await page.locator("#apply").isDisabled() && await page.locator("#reviewed").isDisabled(), "Selection changes invalidate review");
    await page.locator("#select-all").click();
    await page.locator("#dry-run").click();
    await page.locator("#reviewed").check();
    await page.locator("#inject").check();
    await page.locator("#apply").click();
    assert((await page.locator("#result").textContent()).includes("3 updated, 1 failed, 5 sample"), "Partial failure and reference counts");
    assert(await page.locator("#ready-count").textContent() === "4", "Successful sample records update");
    assert(await page.locator("#pending-count").textContent() === "1", "Failed sample preserved");
    await page.locator('[data-detail="1"]').click();
    assert((await page.locator("#asset-url").textContent()).endsWith(".jpg"), "Failed record URL unchanged");
    await page.locator("#close").click();
    await page.locator("#inject").uncheck();
    await page.locator("#dry-run").click();
    await page.locator("#reviewed").check();
    await page.locator("#apply").click();
    assert(await page.locator("#pending-count").textContent() === "0", "Remaining sample completes");
    await page.locator("#select-all").click();
    assert(await page.locator("#selection-count").textContent() === "0 selected" && await page.locator("#dry-run").isDisabled(), "Idempotent: no candidates remain");
    await page.locator('[data-detail="6"]').click();
    assert((await page.locator("#asset-url").textContent()).endsWith(".jpg"), "Outside asset remains untouched");
    await page.locator("#close").click();
    await page.locator("#reset").click();
    assert(await page.locator("#pending-count").textContent() === "4", "Reset restores samples");
    assert((await page.locator("#log").textContent()).includes("FAILED / PRESERVED"), "Activity retains failure history");
    await page.locator("#select-all").click();
    await page.locator("#dry-run").click();
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#export").click();
    assert((await downloadEvent).suggestedFilename() === "maison-webp-rehearsal.json", "Dry-run report download");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
