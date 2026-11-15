import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("406-perfume-brand", async (page, check, width) =>
    {
        check(await page.locator(".fragrances article").count() === 4 && await page.locator(".pyramid p").count() === 3, `${width}: complete collection and exact notes tiers`);
        await page.locator('.fragrances a[href*="figue"]').click();
        check(await page.locator("#product").isVisible() && await page.locator("#product-name").textContent() === "Figue Noire", `${width}: real product link opens static detail`);
        await page.locator("#size").selectOption("260");
        check(await page.locator("#product-price").textContent() === "€260", `${width}: 100ml price`);
        await page.locator("#close-product").click();
        check(!await page.locator("#product").isVisible(), `${width}: close product and return collection`);
        await page.locator('.fragrances a[href*="ambre"]').click();
        check(await page.locator("#product-price").textContent() === "€195", `${width}: amber independent product detail`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#product").isVisible(), `${width}: escape dismisses native product dialog`);
        await page.locator('#discovery a[href*="discovery"]').click();
        check(await page.locator("#product-name").textContent() === "The discovery set" && await page.locator("#product-price").textContent() === "€32", `${width}: discovery details, no checkout`);
        await page.locator("#close-product").click();
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-result").textContent()).includes("valid email"), `${width}: empty newsletter guard`);
        await page.locator("#email").fill("bad");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-result").textContent()).includes("valid email"), `${width}: malformed newsletter guard`);
        await page.locator("#email").fill("reader@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-result").textContent()).includes("Nothing was sent"), `${width}: honest local newsletter success`);
        await page.locator("#delivery").click();
        check(await page.locator("#delivery-info").isVisible(), `${width}: delivery disclosure works`);
        await page.locator("#close-delivery").click();
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile navigation opens`);
            await page.locator('#navigation a[href="#house"]').click();
            check(!await page.locator("#navigation").isVisible(), `${width}: mobile navigation closes after selection`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
