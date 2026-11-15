export async function verify(page, assert, viewport)
{
    await page.locator('[data-panel="Projects"]').last().click();
    await page.getByRole("tab", { name: "Movo" }).click();
    assert.equal(await page.locator("#case-title").textContent(), "Movo");
    assert.match(await page.locator("#case-copy").textContent(), /fitness/);
    await page.getByRole("button", { name: "Close portfolio panel" }).click();
    if (viewport.width)
    {
        await page.locator('[data-panel="Resume"]').last().click();
        const pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "Download concept resume" }).click();
        assert.equal((await pending).suggestedFilename(), "olivia-concept-resume.txt");
        await page.keyboard.press("Escape");
    }
    await page.getByRole("button", { name: "HIRE ME" }).click();
    await page.locator("form button").click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="email"]').fill("studio@example.com");
    await page.locator('[name="service"]').selectOption("Brand Identity");
    await page.locator('[name="idea"]').fill("We are launching an independent furniture design studio.");
    await page.locator("form button").click();
    assert.match(await page.locator("#result").textContent(), /Brand Identity inquiry/);
    assert.match(await page.locator("#result").textContent(), /nothing has been sent/);
    return ["Project switching changes content", "Resume download", "Hire validation", "Service selection", "Truthful local inquiry"];
}
