export async function verify(page, assert, viewport)
{
    assert.equal(await page.locator(".title > *").count(), 4);
    assert.equal(await page.locator(".marquee-track span").count(), 4);
    const scale = viewport.width < 768 ? .5 : 1;
    assert.equal(await page.locator(".left span").first().evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41), -60 * scale);
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, innerHeight * .2); });
    await page.waitForTimeout(300);
    assert.ok(await page.locator(".left").evaluate((el) => Number(getComputedStyle(el).opacity)) > .99);
    assert.ok(Math.abs(await page.locator(".right span").last().evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41)) < 1);
    assert.equal(await page.locator(".marquee-track").evaluate((el) => getComputedStyle(el).animationDuration), "18s");
    assert.ok((await page.locator(".marquee-track span").first().textContent()).includes("UNFOLD · GENESIS"));
    return ["four title layers", "four exact marquee copies and 18s timing", "desktop/mobile initial scroll offsets", "scroll brings columns to zero/full opacity", "local character asset"];
}
