import fs from "node:fs/promises";
export async function verify(page, assert, viewport)
{
    const prompt = await fs.readFile("data\\prompts\\487-kollektiva-talent-studio\\487-kollektiva-talent-studio.md", "utf8");
    const people = [...prompt.matchAll(/\d\. \*\*(.*?)\*\* — (.*?)\s+`https:[\s\S]*?Description: `(.*?)`/g)];
    assert.equal(await page.locator(".picker button").count(), 8);
    assert.equal(await page.locator("#name").textContent(), "Andrei Baranov");
    await page.waitForTimeout(1000);
    assert.equal(await page.locator("#name").textContent(), "Andrei Baranov", "No autoplay");
    for (const [index, person] of people.entries())
    {
        await page.getByRole("button", { name: `Show ${person[1]}`, exact: true }).click();
        await page.waitForTimeout(900);
        assert.equal(await page.locator("#name").textContent(), person[1]);
        assert.equal(await page.locator("#role").textContent(), person[2]);
        assert.equal(await page.locator("#bio").textContent(), person[3]);
        assert.equal(await page.locator(".portrait.active").count(), 1);
        assert.equal(await page.locator(".portrait").nth(index).evaluate((el) => getComputedStyle(el).opacity), "1");
        assert.equal(await page.locator(".picker button[aria-pressed=true]").count(), 1);
        assert.equal(await page.locator(".picker button").nth(index).locator(".dot").evaluate((el) => getComputedStyle(el).opacity), "1");
    }
    assert.equal(await page.locator("#role").isVisible(), viewport.width >= 640);
    assert.equal(await page.locator(".tenure").isVisible(), viewport.width >= 768);
    assert.equal(await page.locator("h1").textContent(), "Kollektiva is the talent you build with each\u00a0day");
    assert.equal(await page.locator(".portrait").first().evaluate((el) => getComputedStyle(el).transitionDuration), "0.7s");
    return ["8 exact biographies/names/roles", "8 background selections and dot state", "700ms crossfade", "manual-only", "responsive footer", "exact static headline"];
}
