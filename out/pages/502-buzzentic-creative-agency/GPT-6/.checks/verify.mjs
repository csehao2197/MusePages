export async function verify(page, assert)
{
    await page.locator("#feature").click();
    assert.match(await page.locator("#panel-copy").textContent(), /not been featured/);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Explore our work" }).click();
    await page.getByRole("tab", { name: "Off the Clock" }).click();
    assert.match(await page.locator("#campaign-copy").textContent(), /travel/);
    await page.getByRole("button", { name: "Close details" }).click();
    await page.getByRole("button", { name: "Build your next big idea" }).click();
    await page.locator("form button").click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="brand"]').fill("Morrow");
    await page.locator('[name="platform"]').selectOption("TikTok");
    await page.locator('[name="goal"]').selectOption("Build community");
    await page.locator("form button").click();
    assert.equal(await page.locator("#shotlist li").count(), 3);
    assert.match(await page.locator("#shotlist").textContent(), /remix/);
    assert.match(await page.locator("#outline-title").textContent(), /Morrow \/ TikTok/);
    await page.getByRole("button", { name: "Refine your choices" }).click();
    await page.locator('[name="platform"]').selectOption("YouTube Shorts");
    await page.locator("form button").click();
    assert.match(await page.locator("#shotlist").textContent(), /full story/);
    return ["Press badge disclosure", "Campaign switching", "Required brand validation", "Goal and platform affect outline", "Refine/recreate flow"];
}
