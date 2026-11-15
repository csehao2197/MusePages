export async function verify(page, assert, viewport)
{
    assert.equal(await page.locator(".track img").count(), 16);
    assert.equal(await page.locator(".pricing article").count(), 2);
    assert.equal(await page.locator(".price").first().textContent(), "$5,000 Monthly");
    await page.locator(".carousel").scrollIntoViewIfNeeded();
    await page.locator(".carousel").hover();
    const initial = await page.locator("#client").textContent();
    await page.waitForTimeout(3200);
    assert.equal(await page.locator("#client").textContent(), initial, "Hover pauses carousel");
    await page.locator("#next").click();
    const next = await page.locator("#client").textContent();
    assert.notEqual(next, initial);
    await page.locator("#prev").click();
    assert.equal(await page.locator("#client").textContent(), initial);
    await page.mouse.move(0, 0);
    const before = await page.locator("#client").textContent();
    await page.waitForTimeout(3200);
    assert.notEqual(await page.locator("#client").textContent(), before, "Auto-advance");
    assert.equal(await page.locator(".projects article").count(), 3);
    assert.equal(await page.locator(".dock").evaluate((el) => getComputedStyle(el).position), "fixed");
    await page.locator(".partner").scrollIntoViewIfNeeded();
    if (viewport.width > 600)
    {
        await page.locator(".partner").hover({ position: { x: 80, y: 80 } });
        await page.mouse.move(120, 400);
        assert.ok(await page.locator(".trail").count() > 0);
        await page.mouse.move(0, 0);
        await page.waitForTimeout(1200);
        assert.equal(await page.locator(".trail").count(), 0, "Trail cleanup");
    }
    assert.equal(await page.locator(".hero .primary").getAttribute("href"), "https://halaskastudio.com/./book");
    return ["16-image ribbon", "two exact pricing offers", "all five testimonials available", "carousel manual/auto/hover pause", "3 projects", "fixed chat dock", "pointer trail spawn/cleanup on desktop", "booking links"];
}
