
export async function run(page, assert, width)
{
    width = width === "mobile" ? 390 : width === "desktop" ? 1200 : width;
    assert(await page.locator(".class-block:visible").count() === 4, "Four distinct sessions");
    await page.locator("#class-filter").selectOption("weekend");
    assert(await page.locator(".class-block:visible").count() === 1, "Weekend filter");
    await page.locator('[data-class="3"]').click();
    await page.locator("#sessions").fill("3");
    assert((await page.locator("#budget-result").textContent()).includes("£27"), "Saturday session calculation");
    await page.locator("#hire").selectOption("45");
    assert((await page.locator("#budget-result").textContent()).includes("£72"), "Term hire added once");
    await page.locator("#sessions").fill("0");
    assert((await page.locator("#budget-result").textContent()).includes("1 to 12"), "Zero session rejected");
    assert(await page.locator("#email-enquiry").getAttribute("href") === null, "Invalid budget disables email draft");
    await page.locator("#sessions").fill("2.5");
    assert((await page.locator("#budget-result").textContent()).includes("whole number"), "Fraction rejected");
    await page.locator("#sessions").fill("13");
    assert((await page.locator("#budget-result").textContent()).includes("1 to 12"), "Session upper bound");
    await page.locator("#sessions").fill("2");
    await page.locator("#hire").selectOption("0");
    await page.locator("#class-filter").selectOption("evening");
    assert(await page.locator(".class-block:visible").count() === 3, "Evening filter");
    await page.locator('[data-class="1"]').click();
    assert((await page.locator("#budget-result").textContent()).includes("£32"), "Life drawing rate");
    await page.locator('[data-term="winter"]').click();
    assert((await page.locator("#term-info").textContent()).includes("Nothing is held"), "No false place reservation");
    assert(decodeURIComponent(await page.locator("#email-enquiry").getAttribute("href")).includes("winter"), "Term in email draft");
    assert(decodeURIComponent(await page.locator("#email-enquiry").getAttribute("href")).includes("Wednesday"), "Class in email draft");
    await page.locator("#class-filter").selectOption("");
    assert(await page.locator(".class-block:visible").count() === 4, "Restore all classes");
    assert(await page.locator(".painting").count() === 6, "Six original student-work studies");
    await page.locator("summary").click();
    assert(await page.locator("details").getAttribute("open") !== null, "Easel hire details");
    if (width < 760)
    {
        await page.locator("#menu").click();
        assert(await page.locator("#navigation").isVisible(), "Mobile menu expands");
        await page.locator('#navigation a[href="#room"]').click();
        assert(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Menu closes after anchor");
    }
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
