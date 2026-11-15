export async function verify(page, assert, viewport)
{
    if (viewport.width < 750)
    {
        await page.getByRole("button", { name: "Menu +" }).click();
        assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
        await page.getByRole("link", { name: "Services", exact: true }).click();
        assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
    }
    await page.getByRole("button", { name: "Watch the Film" }).click();
    await page.getByRole("button", { name: "Previous chapter" }).click();
    assert.match(await page.locator("#film-title").textContent(), /03/);
    await page.getByRole("button", { name: "Next chapter" }).click();
    assert.match(await page.locator("#film-title").textContent(), /01/);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    assert.equal(await page.locator("#film-play").getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: "Close film" }).click();
    await page.waitForFunction(() => document.querySelector("#film-play").getAttribute("aria-pressed") === "false");
    await page.getByRole("button", { name: "View Pricing" }).click();
    await page.getByRole("tab", { name: "Partnership", exact: true }).click();
    assert.match(await page.locator(".price").textContent(), /6,900/);
    await page.getByRole("button", { name: "Discuss a partnership" }).click();
    assert.equal(await page.locator('[name="service"]').inputValue(), "Partnership");
    await page.locator("form button").click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="email"]').fill("team@example.com");
    await page.locator('[name="vision"]').fill("A thoughtful new product identity with accessible digital interactions.");
    await page.locator("form button").click();
    assert.match(await page.locator("#inquiry-status").textContent(), /Nothing was sent/);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "See how it works" }).click();
    assert.match(await page.locator("#info-copy").textContent(), /No click tracking/);
    return ["Responsive mobile navigation", "Walkthrough wraparound", "Playback state resets on close", "Pricing switch changes price", "Selected plan carries into inquiry", "Required form validation", "Local submission disclosure", "Optimization limitation details"];
}
