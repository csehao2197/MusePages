export async function verify(page, assert)
{
    await page.getByRole("button", { name: "Open cart" }).click();
    assert.match(await page.locator("#cart-content").textContent(), /empty/);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Explore Reel" }).click();
    await page.locator("#seek").fill("18");
    assert.match(await page.locator("#chapter").textContent(), /03 \/ Feeling/);
    await page.getByRole("button", { name: "Play", exact: true }).click();
    assert.equal(await page.locator("#play").getAttribute("aria-pressed"), "true");
    await page.waitForFunction(() => Number(document.querySelector("#seek").value) > 18.2);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Buy Now" }).click();
    assert.equal(await page.locator("#cart-count").textContent(), "1");
    await page.getByRole("button", { name: "Create demo order" }).click();
    assert.match(await page.locator("#order-status").textContent(), /not been charged/);
    await page.getByRole("button", { name: "Remove item" }).click();
    assert.equal(await page.locator("#cart-count").textContent(), "0");
    assert.match(await page.locator("#cart-content").textContent(), /empty/);
    return ["Empty cart", "Reel seek changes chapter", "Reel playback advances", "Add item updates ticket", "Truthful demo checkout", "Remove returns to empty"];
}
