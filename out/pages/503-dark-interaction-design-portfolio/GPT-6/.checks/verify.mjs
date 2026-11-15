export async function verify(page, assert, viewport)
{
    await page.getByRole("button", { name: "Experiments", exact: true }).click();
    assert.equal(await page.locator(".work-item:visible").count(), 1);
    await page.locator('.work-item[data-kind="Experiment"]').click();
    assert.match(await page.locator("#detail-copy").textContent(), /reduced-motion/);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Resume", exact: true }).click();
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download concept resume" }).click();
    assert.equal((await pending).suggestedFilename(), "michael-smith-concept-resume.txt");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Say hi" }).click();
    await page.locator("form button").click();
    assert.equal(await page.locator("form").isVisible(), true);
    await page.locator('[name="email"]').fill("hello@example.com");
    await page.locator('[name="idea"]').fill("An accessible interaction system for an editorial platform.");
    await page.locator("form button").click();
    assert.match(await page.locator("#result").textContent(), /Nothing has been sent/);
    await page.keyboard.press("Escape");
    if (viewport.width === 1200)
    {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.reload({ waitUntil: "domcontentloaded" });
        await page.locator(".loader:not([hidden])").waitFor();
        assert.equal(await page.locator(".loader").isVisible(), true);
        await page.waitForFunction(() => Number(document.querySelector(".counter").textContent) > 0);
        await page.locator(".loader").waitFor({ state: "hidden", timeout: 8000 });
        assert.equal(await page.locator(".counter").textContent(), "100");
        const initial = await page.locator("#role").textContent();
        await page.waitForFunction((previous) => document.querySelector("#role").textContent !== previous, initial, { timeout: 3000 });
    }
    return ["Reduced-motion hero available", "Work filtering and detail", "Resume download", "Contact invalid/valid states", ...(viewport.width === 1200 ? ["Normal-motion loader count reaches 100 and exits", "Role cycles in normal motion"] : [])];
}
