export async function verify(page, assert)
{
    await page.getByRole("button", { name: "Our process" }).click();
    assert.equal(await page.locator(".process-step").count(), 3);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Book a 15-min call" }).click();
    assert.equal(await page.locator("#continue").isDisabled(), true);
    await page.locator(".days button").first().click();
    await page.locator('[data-time="14:30"]').click();
    await page.locator("#timezone").selectOption("Europe/London");
    await page.locator("#continue").click();
    assert.match(await page.locator("#selection").textContent(), /14:30.*Europe\/London/);
    await page.locator('form button[type="submit"]').click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="name"]').fill("Robin");
    await page.locator('[name="email"]').fill("robin@example.com");
    await page.locator('form button[type="submit"]').click();
    assert.match(await page.locator("#confirmation-copy").textContent(), /not a real booking/);
    await page.getByRole("button", { name: "Choose another time" }).click();
    await page.locator(".days button").last().click();
    assert.equal(await page.locator("#continue").isDisabled(), true);
    await page.locator('[data-time="09:00"]').click();
    await page.locator("#continue").click();
    assert.match(await page.locator("#selection").textContent(), /09:00/);
    return ["Process details", "Cannot continue without slot", "Day/time/timezone selection", "Required contact validation", "Explicit demo confirmation", "Changing day resets time"];
}
