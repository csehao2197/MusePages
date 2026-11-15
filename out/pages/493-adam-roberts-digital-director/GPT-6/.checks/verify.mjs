export async function verify(page, assert, viewport)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true);
    assert.equal(await page.locator(".meta-grid > div").count(), 4);
    assert.match(await page.locator("footer").textContent(), /5 full cases • 82 archive fragments • 22 catalog items/);
    assert.match(await page.locator(".awards").textContent(), /x1.*x7.*x22/);
    if (viewport.width < 768)
    {
        await page.getByRole("button", { name: "Open menu" }).click();
        assert.equal(await page.locator("#menu").isVisible(), true);
        assert.equal(await page.locator("#menu a").count(), 6);
        await page.locator("#menu a").nth(2).click();
        assert.equal(await page.locator("#menu").isVisible(), false);
        await page.waitForFunction(() => document.getElementById("open-menu").getAttribute("aria-expanded") === "false");
        assert.equal(await page.locator("#open-menu").getAttribute("aria-expanded"), "false");
        await page.locator("#open-menu").click();
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#menu").isVisible(), false);
    }
    await page.locator("#showreel").click();
    assert.ok(await page.locator("#reel").isVisible());
    await page.locator("#pause").click();
    assert.equal(await page.locator("#pause").textContent(), "Resume showreel");
    await page.getByRole("button", { name: "Close showreel" }).click();
    await page.locator("#schedule").click();
    await page.locator("input").fill("director@example.com");
    await page.locator("textarea").fill("A digital launch");
    await page.getByRole("button", { name: "Preview request" }).click();
    assert.match(await page.locator("#feedback").textContent(), /sends nothing/);
    await page.getByRole("button", { name: "Close call request" }).click();
    return ["locked viewport", "four metadata groups", "exact awards/archive counts", "mobile menu links/escape/state", "original showreel and pause", "local call-request preview"];
}
