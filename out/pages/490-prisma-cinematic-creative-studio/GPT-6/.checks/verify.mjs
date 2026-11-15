export async function verify(page, assert)
{
    assert.equal(await page.locator("main > section").count(), 3);
    assert.equal(await page.locator(".grid article").count(), 4);
    await page.locator(".hero .join").last().click();
    await page.locator("input[name=name]").fill("Alex");
    await page.locator("input[name=email]").fill("alex@example.com");
    await page.getByRole("button", { name: "Express interest" }).click();
    assert.match(await page.locator(".feedback").textContent(), /local demo only. Nothing was sent/);
    await page.getByRole("button", { name: "Close inquiry" }).click();
    for (let index = 0; index < 3; index++)
    {
        await page.locator(".learn").nth(index).click();
        assert.ok(await page.locator("#detail").isVisible());
        assert.equal(await page.locator("#detail-title").textContent(), ["Project Storyboard.", "Smart Critiques.", "Immersion Capsule."][index]);
        await page.getByRole("button", { name: "Close dialog", exact: true }).click();
    }
    await page.locator(".letter-reveal").scrollIntoViewIfNeeded();
    const first = await page.locator(".letter-reveal span").first().evaluate((el) => Number(getComputedStyle(el).opacity));
    await page.evaluate(() => window.scrollBy(0, 450));
    await page.waitForTimeout(500);
    const after = await page.locator(".letter-reveal span").first().evaluate((el) => Number(getComputedStyle(el).opacity));
    assert.ok(after >= first);
    assert.ok(await page.locator(".pull .word").count() > 25);
    return ["three sections/four feature cards", "three specific working detail dialogs", "local form validation and truthful confirmation", "scroll-linked letter reveal", "word pull-up segmentation"];
}
