export async function verify(page, assert, viewport)
{
    if (viewport.width < 600)
    {
        await page.getByRole("button", { name: "Menu +" }).click();
        assert.equal(await page.locator(".menu").getAttribute("aria-expanded"), "true");
    }
    await page.getByRole("button", { name: "Journal", exact: true }).click();
    await page.getByRole("heading", { name: "Notes from the quiet." }).waitFor();
    await page.getByRole("button", { name: "Close panel" }).click();
    await page.locator("main [data-journey]").click();
    await page.locator('button[type="submit"]').click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="name"]').fill("Taylor");
    await page.locator('[name="email"]').fill("taylor@example.com");
    await page.locator('[name="idea"]').fill("A thoughtful new platform for independent makers.");
    await page.locator('button[type="submit"]').click();
    await page.locator("#confirmation").waitFor();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download brief" }).click();
    assert.equal((await download).suggestedFilename(), "aethera-project-brief.txt");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#journey").evaluate((element) => element.open), false);
    return ["Responsive menu", "Journal content panel", "Required form validation", "Local brief creation", "Brief download", "Escape closes dialog"];
}
