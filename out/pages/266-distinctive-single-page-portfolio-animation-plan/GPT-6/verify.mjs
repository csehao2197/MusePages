export async function run(page, assert)
{
    assert(await page.locator("#motion").getAttribute("aria-pressed") === "true", "Motion initially available");
    await page.locator("#motion").click();
    assert(await page.locator("body").evaluate((body) => body.classList.contains("motion-off")), "Motion kill switch");
    await page.locator("#motion").click();
    assert(await page.locator("#motion").textContent() === "MOTION: ON", "Mechanical toggle restores");
    await page.locator("#rotate").click();
    assert((await page.locator("#rotate").textContent()).includes("90°"), "Wireframe rotation");
    for (let i = 0; i < 3; i++) await page.locator("#rotate").click();
    assert((await page.locator("#rotate").textContent()).includes("/ 0°"), "Rotation wraps full turn");
    await page.locator('[data-project="0"]').click();
    assert(await page.locator("#viewer").isVisible(), "Project viewer opens");
    await page.locator("#previous").click();
    assert((await page.locator("#project-label").textContent()).includes("3 / 3"), "Previous wraps");
    await page.keyboard.press("ArrowRight");
    assert((await page.locator("#project-label").textContent()).includes("1 / 3"), "Keyboard next wraps");
    await page.locator("#next").click();
    assert((await page.locator("#project-description").textContent()).includes("marketplace"), "Carousel project detail changes");
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#viewer").isVisible()), "Escape dismissal");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") !== null, "Experience expands");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") === null, "Experience collapses");
    await page.locator("#transmission button").click();
    assert((await page.locator("#send-status").textContent()).includes("INPUT ERROR"), "Empty transmission blocked");
    await page.locator("#email").fill("engineer@example.com");
    await page.locator("#message").fill("Build a useful, unusual little system.");
    await page.locator("#transmission button").click();
    assert((await page.locator("#send-status").textContent()).includes("NO MESSAGE WAS SENT"), "Honest staged transmission");
    const before = await page.locator("#thought").textContent();
    await page.locator("#quote").click();
    assert(await page.locator("#thought").textContent() !== before, "Quote cycle");
    const reduced = await page.context().browser().newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await reduced.goto(page.url());
    assert(await reduced.locator("#motion").getAttribute("aria-pressed") === "false", "OS reduced-motion respected");
    await reduced.close();
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
