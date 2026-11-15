import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("407-personal-brand", async (page, check, width) =>
    {
        check(await page.locator(".talks button").count() === 4 && await page.locator(".essays button").count() === 6 && await page.locator(".projects article").count() === 4, `${width}: complete brief talks, writing and engagements`);
        await page.locator('[data-talk="0"]').click();
        check(await page.locator("#detail").isVisible() && await page.locator("#detail-title").textContent() === "The Consensus Tax", `${width}: talk detail opens`);
        check((await page.locator("#detail-copy").textContent()).includes("recording"), `${width}: no false video or availability`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#detail").isVisible(), `${width}: escape closes detail`);
        await page.locator(".essays button").nth(2).click();
        check((await page.locator("#detail-copy").textContent()).includes("not the article text"), `${width}: writing reference rather than fabricated article`);
        await page.locator("#close").click();
        await page.locator('[data-social="LinkedIn"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("verified profile URL was not supplied"), `${width}: unprovided profile disclosure`);
        await page.locator("#close").click();
        await page.locator(".project-name").first().click();
        check((await page.locator("#detail-copy").textContent()).includes("nine-week"), `${width}: engagement result view`);
        await page.locator("#close").click();
        const download = page.waitForEvent("download");
        await page.locator("#press").click();
        check((await download).suggestedFilename() === "nadia-press-kit.txt", `${width}: working unnumbered press kit download`);
        check((await page.locator('#booking a').getAttribute("href")).startsWith("mailto:hello@nadiaokonjo.com"), `${width}: mailto-only booking`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible() && await page.evaluate(() => document.body.style.overflow === "hidden"), `${width}: fullscreen menu locks background`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores page`);
            await page.locator("#menu").click();
            await page.locator('#navigation a[href="#about"]').click();
            check(!await page.locator("#navigation").isVisible(), `${width}: selection closes menu`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
