export async function run(page, assert)
{
    const original = Number((await page.locator("#views").textContent()).replaceAll(",", ""));
    assert(original > 0, "Sample aggregates populated");
    assert(await page.locator("#trend-chart").getAttribute("data-points") === "30", "Default range 30 days");
    assert(Number(await page.locator("#trend-chart").getAttribute("data-zeros")) > 0, "Zero days retained");
    const visitors = Number((await page.locator("#visitors").textContent()).replaceAll(",", ""));
    assert(visitors <= original, "Unique visitors bounded by views");
    await page.locator('[data-range="7"]').click();
    assert(await page.locator("#trend-chart").getAttribute("data-points") === "7", "Seven day trend");
    assert(Number((await page.locator("#views").textContent()).replaceAll(",", "")) < original, "Range recalculates totals");
    assert(page.url().includes("range=7"), "Range URL");
    await page.reload();
    assert(await page.locator("#trend-chart").getAttribute("data-points") === "7", "Range reload");
    await page.locator('[data-range="90"]').click();
    assert(await page.locator("#trend-chart").getAttribute("data-points") === "90", "Ninety day range");
    await page.locator('[data-metric="visitors"]').click();
    assert((await page.locator("#trend-chart").getAttribute("aria-label")).includes("visitors"), "Metric changes chart");
    await page.locator("#day").focus();
    await page.keyboard.press("Home");
    assert((await page.locator("#daily-summary").textContent()).includes("views /"), "Daily inspection");
    await page.locator("#empty-toggle").click();
    assert(await page.locator("#empty").isVisible() && await page.locator("#views").textContent() === "0", "Composed empty state");
    assert(await page.locator(".no-data").count() === 4, "All breakdown empty states");
    await page.locator("#theme").click();
    assert(await page.locator("body").evaluate((body) => body.classList.contains("dark")), "Dark empty state");
    await page.locator("#restore").click();
    assert(!(await page.locator("#empty").isVisible()), "Restore populated dark state");
    await page.locator("#theme").click();
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#export").click();
    assert((await downloadEvent).suggestedFilename() === "maison-analytics-summary.csv", "Aggregate export");
    await page.goto(page.url().replace("range=90", "range=bogus"));
    assert(await page.locator("#trend-chart").getAttribute("data-points") === "30", "Invalid range clamps to 30");
    assert(await page.locator("table").count() === 0, "No individual visit log UI");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
