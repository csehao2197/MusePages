export async function verify(page, assert)
{
    const first = await page.locator("#quote").textContent();
    await page.getByRole("button", { name: "Previous testimonial" }).click();
    assert.match(await page.locator(".count").textContent(), /05 \/ 05/);
    await page.getByRole("button", { name: "Next testimonial" }).click();
    assert.equal(await page.locator("#quote").textContent(), first);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    assert.equal(await page.locator(".pause").getAttribute("aria-pressed"), "false");
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page.locator('[data-project="Orbit"]').last().click();
    await page.getByRole("heading", { name: "Orbit", exact: true }).waitFor();
    await page.getByRole("button", { name: "Create something like this" }).click();
    assert.equal(await page.locator('[name="plan"]').inputValue(), "Custom Project");
    await page.locator("form button").click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="email"]').fill("founder@example.com");
    await page.locator('[name="idea"]').fill("An ambitious identity and product experience for our climate business.");
    await page.locator("form button").click();
    assert.match(await page.locator("#result").textContent(), /Custom Project inquiry prepared/);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#chat").evaluate((element) => element.open), false);
    return ["Carousel wraparound", "Pause/resume state", "Project detail", "Correct inquiry plan", "Required validation", "Local inquiry summary", "Escape dialog"];
}
