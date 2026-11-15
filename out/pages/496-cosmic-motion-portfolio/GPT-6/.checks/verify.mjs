export async function verify(page, assert, viewport)
{
    assert.equal(await page.locator("#loader").isVisible(), false, "Reduced motion skips loader");
    assert.equal(await page.locator(".project").count(), 4);
    assert.equal(await page.locator(".entry").count(), 4);
    const first = await page.locator("#role").textContent();
    await page.waitForTimeout(2100);
    assert.notEqual(await page.locator("#role").textContent(), first);
    await page.locator("#resume").click();
    assert.match(await page.locator("#detail-copy").textContent(), /demonstration claims/);
    await page.getByRole("button", { name: "Close detail" }).click();
    for (let index = 0; index < 4; index++)
    {
        await page.locator(".project").nth(index).click();
        assert.equal(await page.locator("#detail-title").textContent(), ["Automotive Motion", "Urban Architecture", "Human Perspective", "Brand Identity"][index]);
        assert.ok(await page.locator("#detail-image").isVisible());
        await page.getByRole("button", { name: "Close detail" }).click();
    }
    await page.locator(".entry").first().click();
    assert.match(await page.locator("#detail-copy").textContent(), /smallest moments/);
    await page.getByRole("button", { name: "Close detail" }).click();
    await page.getByRole("button", { name: "Open exploration 1", exact: true }).click();
    assert.equal(await page.locator("#lightbox-count").textContent(), "1 / 6");
    await page.locator("#next").click();
    assert.equal(await page.locator("#lightbox-count").textContent(), "2 / 6");
    await page.keyboard.press("ArrowLeft");
    assert.equal(await page.locator("#lightbox-count").textContent(), "1 / 6");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#lightbox").isVisible(), false);
    assert.deepEqual(await page.locator(".stats strong").allTextContents(), ["20+", "95+", "200%"]);
    assert.equal(await page.locator(".contact-inner > a").getAttribute("href"), "mailto:hello@michaelsmith.com");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.ok(await page.locator("#loader").isVisible());
    await page.waitForTimeout(1000);
    const count = Number(await page.locator("#loading-count").textContent());
    assert.ok(count > 20 && count < 90);
    await page.locator("#loader").waitFor({ state: "hidden", timeout: 6000 });
    assert.equal(await page.locator("#loading-count").textContent(), "100");
    return ["normal 2700ms counter/word/progress loader and reduced-motion skip", "cycling creative roles", "4 specific project dialogs", "readable original journal article", "6-image exploration lightbox/keyboard controls", "exact 20+/95+/200% stats", "mailto contact"];
}
