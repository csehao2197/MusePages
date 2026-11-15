import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("413-pet-store", async (page, check, width) =>
    {
        check(await page.locator(".pets > a").count() === 4 && await page.locator(".products article").count() === 4, `${width}: complete categories and supplied picks`);
        await page.locator('[data-filter="cats"]').click();
        check(await page.locator(".products article:visible").count() === 1 && (await page.locator("#count").textContent()).startsWith("1 "), `${width}: cat filter`);
        await page.locator('[data-filter="birds"]').click();
        check(await page.locator("#empty").isVisible() && (await page.locator("#empty").textContent()).includes("not connected"), `${width}: honest empty category`);
        await page.locator("#reset-filters").click();
        check(await page.locator(".products article:visible").count() === 4, `${width}: reset empty shelf`);
        await page.locator("#search").fill("salmon");
        check(await page.locator(".products article:visible").count() === 1 && (await page.locator(".products article:visible h3").textContent()).includes("Salmon"), `${width}: useful product search`);
        await page.locator("#search").fill("not-a-product");
        check(await page.locator("#empty").isVisible(), `${width}: no-result search state`);
        await page.locator("#search").fill("");
        await page.locator('.products a[href*="rope"]').first().click();
        check(await page.locator("#detail").isVisible() && await page.locator("#detail-price").textContent() === "£9" && new URL(page.url()).searchParams.get("product") === "rope", `${width}: shop product link with exact price`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#detail").isVisible(), `${width}: keyboard closes product preview`);
        await page.locator('[data-size="large"]').click();
        check((await page.locator("#wash-note").textContent()).includes("£16") && await page.locator('[data-size="large"]').getAttribute("aria-pressed") === "true", `${width}: self-wash large price selection`);
        await page.locator('[data-size="medium"]').click();
        check((await page.locator("#wash-note").textContent()).includes("£13"), `${width}: self-wash medium price`);
        await page.locator('[data-info="delivery"]').first().click();
        check((await page.locator("#detail-copy").textContent()).includes("over £30 within three miles"), `${width}: delivery terms reconciled`);
        await page.locator("#close").click();
        await page.locator('[data-info="loyalty"]').first().click();
        check((await page.locator("#detail-copy").textContent()).includes("issues no stamps"), `${width}: no false loyalty account`);
        await page.locator("#close").click();
        await page.locator("#copy-address").click();
        await page.waitForFunction(() => /copied|Copy manually/.test(document.querySelector("#copy-result").textContent));
        check((await page.locator("#copy-result").textContent()).includes("copied") || (await page.locator("#copy-result").textContent()).includes("Copy manually"), `${width}: working clipboard or graceful manual fallback`);
        check(await page.locator('button:has-text("Add to cart")').count() === 0, `${width}: no unauthorized cart`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible() && await page.evaluate(() => document.body.style.overflow === "hidden"), `${width}: fullscreen menu background lock`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
