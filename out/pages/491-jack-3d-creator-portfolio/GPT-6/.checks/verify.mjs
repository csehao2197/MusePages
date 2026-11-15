export async function verify(page, assert, viewport)
{
    assert.equal(await page.locator("main > section").count(), 5);
    assert.equal(await page.locator(".ribbon img").count(), 63);
    assert.equal(await page.locator(".service").count(), 5);
    assert.equal(await page.locator(".project-card").count(), 3);
    await page.locator("nav .contact-link").click();
    await page.locator("input[name=email]").fill("hello@example.com");
    await page.locator("textarea").fill("A dimensional identity");
    await page.getByRole("button", { name: "Preview inquiry" }).click();
    assert.match(await page.locator(".feedback").textContent(), /nothing was sent/);
    await page.getByRole("button", { name: "Close contact" }).click();
    for (let index = 0; index < 3; index++)
    {
        await page.locator(".live").nth(index).click();
        assert.equal(await page.locator("#project-title").textContent(), ["Nextlevel Studio", "Aura Brand Identity", "Solaris Digital"][index]);
        await page.getByRole("button", { name: "Close project" }).click();
    }
    assert.equal(await page.locator(".project-card").first().evaluate((el) => getComputedStyle(el).position), "sticky");
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; scrollTo(0, 0); });
    await page.waitForTimeout(300);
    if (viewport.width > 600)
    {
        await page.mouse.move(700, 500);
        await page.waitForTimeout(400);
        assert.notEqual(await page.locator(".magnet").evaluate((el) => getComputedStyle(el).transform), "none");
    }
    const before = await page.locator(".row-one").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    await page.evaluate(() => scrollTo(0, 1200));
    await page.waitForTimeout(300);
    const after = await page.locator(".row-one").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    assert.ok(after > before);
    return ["5 sections/services", "63 scroll-driven dimensional tiles", "magnet pointer transform on desktop", "3 local project previews", "sticky cards", "local inquiry"];
}
