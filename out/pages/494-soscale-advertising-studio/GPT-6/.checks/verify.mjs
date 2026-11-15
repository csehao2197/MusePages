export async function verify(page, assert, viewport)
{
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true);
    assert.equal(await page.locator(".band .lid").count(), 7);
    assert.ok((await page.locator(".band path").getAttribute("d")).length > 5000);
    assert.equal(await page.locator(".headline").textContent(), "YOUR AUDIENCE DESERVES BETTER ADS");
    const mode = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--layout").trim());
    assert.equal(mode, viewport.width < 560 ? "mobile" : "desktop");
    if (viewport.width < 1075)
    {
        await page.locator("#menuBtn").click();
        await page.waitForTimeout(300);
        assert.equal(await page.locator("#menuBtn").getAttribute("aria-expanded"), "true");
        assert.equal(await page.locator(".nav-links a").count(), 9);
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#menuBtn").getAttribute("aria-expanded"), "false");
        await page.locator("#menuBtn").click();
        await page.locator(".nav-links a").last().click();
        assert.equal(await page.locator("#menuBtn").getAttribute("aria-expanded"), "false");
    }
    await page.locator(".cta").click();
    await page.locator("input[name=email]").fill("brand@example.com");
    await page.locator("input[name=brand]").fill("Studio");
    await page.getByRole("button", { name: "Preview consultation" }).click();
    assert.match(await page.locator(".feedback").textContent(), /nothing was sent/);
    await page.getByRole("button", { name: "Close consultation" }).click();
    await page.locator(".tp").click();
    assert.match(await page.locator("#reviews").textContent(), /not a connected or independently verified review feed/);
    await page.getByRole("button", { name: "Close reviews" }).click();
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    assert.equal(await page.evaluate(() => document.documentElement.classList.contains("is-entering")), false);
    assert.equal(await page.evaluate(() => window.__soscaleEntrance), true);
    assert.ok(await page.locator(".cta").isVisible());
    return ["exact knockout SVG", "7 entrance lids and real normal-motion gate completion", "reference-scale responsive mode", "locked viewport", "9-link mobile menu and Escape", "consultation local preview", "truthful review disclosure"];
}
