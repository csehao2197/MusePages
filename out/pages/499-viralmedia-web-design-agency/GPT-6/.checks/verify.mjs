export async function verify(page, assert)
{
    await page.locator(".subscribe button").click();
    assert.equal(await page.locator("#subscription").textContent(), "");
    await page.locator(".subscribe input").fill("reader@example.com");
    await page.locator(".subscribe button").click();
    assert.match(await page.locator("#subscription").textContent(), /No email/);
    await page.locator('[data-project="Pulse Health"]').click();
    await page.getByRole("heading", { name: "Pulse Health", exact: true }).waitFor();
    assert.match(await page.locator("#info-copy").textContent(), /fictional/);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "BOOK A CALL" }).click();
    assert.equal(await page.locator("#time-label").isVisible(), true);
    await page.locator('#inquiry [name="email"]').fill("maker@example.com");
    await page.locator('#inquiry [name="brief"]').fill("A complete new website for our growing independent business.");
    await page.locator('#inquiry [name="time"]').selectOption({ index: 1 });
    await page.locator("#inquiry-form button").click();
    assert.match(await page.locator("#inquiry-result").textContent(), /Afternoon/);
    assert.match(await page.locator("#inquiry-result").textContent(), /Nothing was submitted/);
    await page.getByRole("button", { name: "Close inquiry" }).click();
    await page.getByRole("button", { name: "Privacy / Terms" }).click();
    assert.match(await page.locator("#info-copy").textContent(), /no cookies/);
    return ["Email invalid/valid states", "Project detail", "Call mode and time selection", "Validated local inquiry", "Privacy panel"];
}
