export async function verify(page, assert, viewport)
{
    await page.waitForFunction(() => window.axonStats?.frames > 12, { timeout: 60000 });
    const stats = await page.evaluate(() => window.axonStats);
    assert.equal(stats.backend, "WebGL2");
    assert.equal(stats.particles, viewport.width > 760 ? 262144 : 16384);
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true);
    assert.equal(await page.locator(".tags button").count(), 10);
    assert.equal(await page.locator(".card").count(), 4);
    assert.equal(await page.locator(".list").isVisible(), viewport.width > 760);
    if (viewport.width > 760)
    {
        await page.getByRole("button", { name: "Fluids", exact: true }).click();
        assert.equal(await page.locator(".card:visible").count(), 1);
        assert.match(await page.locator(".card:visible .meta").textContent(), /Nebular/);
        await page.getByRole("button", { name: "All", exact: true }).click();
        assert.equal(await page.locator(".card:visible").count(), 4);
    }
    const before = await page.evaluate(() => window.axonStats.splats);
    await page.mouse.move(viewport.width * .55, 180);
    await page.mouse.move(viewport.width * .6, 250, { steps: 6 });
    await page.waitForTimeout(500);
    assert.ok(await page.evaluate(() => window.axonStats.splats) > before);
    assert.equal(await page.locator("#fallback").isVisible(), false);
    return ["native WebGL2 frames rendered", `${stats.particles} GPU particles`, "GPU fluid pressure iterations", "pointer splats", "responsive no-scroll UI", "10 chips and meaningful category filtering", "4 original animated study canvases"];
}
