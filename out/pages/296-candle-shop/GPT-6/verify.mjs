import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("296-candle-shop", async (page, check, width) =>
    {
        await page.locator("[data-family='Kitchen']").click();
        check(await page.locator(".product").count() === 1, `${width}: kitchen family filtered`);
        await page.locator(".product").click();
        check(await page.locator("#detail-name").textContent() === "Glasshouse", `${width}: specific product detail`);
        check((await page.locator("#detail-copy").textContent()).includes("tomato"), `${width}: scent narrative`);
        check((await page.locator("#product-link").getAttribute("href")).includes("Glasshouse"), `${width}: product enquiry context`);
        await page.locator("#all").click();
        check(await page.locator(".product").count() === 6, `${width}: full bestseller reset`);
        for (const i of [0, 2, 4]) await page.locator(`[data-trio='${i}']`).click();
        check((await page.locator("#trio-status").textContent()).includes("3 of 3"), `${width}: trio complete`);
        const href = decodeURIComponent(await page.locator("#trio-link").getAttribute("href"));
        check(href.includes("Bothy, Library, Glasshouse") && href.includes("Nothing purchased"), `${width}: gift enquiry contents`);
        await page.locator("[data-trio='1']").click();
        check((await page.locator("#trio-status").textContent()).includes("Remove one"), `${width}: trio maximum`);
        await page.locator("[data-trio='2']").click();
        check(await page.locator("#trio-link").getAttribute("href") === "#trio-choices", `${width}: incomplete trio no enquiry`);
        await page.locator(".care details").nth(2).locator("summary").click();
        check((await page.locator(".care details").nth(2).textContent()).includes("10mm"), `${width}: care advice`);
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("valid email"), `${width}: empty newsletter rejected`);
        await page.locator("#email").fill("reader@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("no subscription created"), `${width}: truthful newsletter state`);
        check(await page.locator("#candlelight").evaluate((el) => getComputedStyle(el).pointerEvents) === "none", `${width}: glow never blocks controls`);
        check((await page.locator("#delivery").textContent()).includes("bag stays at zero"), `${width}: no false cart`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "candle mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "candle menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
