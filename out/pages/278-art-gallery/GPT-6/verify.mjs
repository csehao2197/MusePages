
export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;
    assert(await page.locator(".artwork").count() === 6, "Six original work illustrations");
    await page.locator(".artwork").first().click();
    assert(await page.locator("#work-title").textContent() === "Slow Water (iv)", "Correct work details");
    await page.locator("#previous").click();
    assert(await page.locator("#position").textContent() === "6 / 6", "Previous wraps to last work");
    await page.locator("#next").click();
    assert(await page.locator("#position").textContent() === "1 / 6", "Next wraps to first work");
    assert((await page.locator("#work-enquiry").getAttribute("href")).includes("Slow%20Water"), "Work-specific enquiry subject");
    await page.keyboard.press("Escape");
    assert(!await page.locator("#work-dialog").isVisible(), "Escape closes work");
    await page.locator("#year").selectOption("2025");
    assert(await page.locator(".archive-row:visible").count() === 4, "Archive 2025 filter");
    await page.locator("#year").selectOption("2026");
    assert(await page.locator(".archive-row:visible").count() === 2, "Archive 2026 filter");
    await page.locator("#year").selectOption("");
    assert(await page.locator(".archive-row:visible").count() === 6, "Archive filter reset");
    await page.locator(".artist summary").nth(2).click();
    assert((await page.locator(".artist").nth(2).textContent()).includes("archival print"), "Artist practice disclosure");
    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu open");
        await page.locator('#navigation a[href="#visit"]').click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes after anchor");
    }
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
