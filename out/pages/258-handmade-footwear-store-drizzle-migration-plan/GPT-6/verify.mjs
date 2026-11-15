export async function run(page, assert)
{
    assert(await page.locator("#simulate").isDisabled(), "Safety gate initially locked");
    await page.locator("#backup").check();
    await page.locator("#parity").check();
    assert(await page.locator("#simulate").isDisabled(), "Partial confirmation stays locked");
    await page.locator("#check").check();
    assert(await page.locator("#simulate").isEnabled(), "All checks unlock simulation");
    assert(await page.locator("#progress").textContent() === "3 of 3 ready", "Progress reflects all checks");
    await page.locator("#simulate").click();
    assert((await page.locator("#result").textContent()).includes("0 records changed"), "Existing baseline preserves sample records");
    await page.locator('[data-mode="fresh"]').click();
    assert((await page.locator("#commands").textContent()).includes("--name init"), "Fresh database exposes correct sequence");
    assert(await page.locator('[data-mode="fresh"]').getAttribute("aria-pressed") === "true", "Mode accessible state");
    await page.locator("#simulate").click();
    assert((await page.locator("#result").textContent()).includes("empty sample"), "Fresh simulation");
    await page.locator("#check").uncheck();
    assert(await page.locator("#simulate").isDisabled(), "Revoking safety confirmation relocks");
    await page.locator("#inspect").click();
    assert(await page.locator("#schema").isVisible(), "Schema inspection opens");
    await page.locator("#inspect").click();
    assert(await page.locator("#schema").isHidden(), "Schema inspection closes");
    await page.locator('[data-mode="existing"]').click();
    assert(!(await page.locator("#commands").textContent()).includes("db:drizzle:migrate"), "Existing mode never proposes immediate migrate");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("./.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
