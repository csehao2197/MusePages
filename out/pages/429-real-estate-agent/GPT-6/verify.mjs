import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("429-real-estate-agent", async (page, check, width) =>
    {
        check(await page.locator(".property").count() === 3 && await page.locator(".neighborhoods button").count() === 6, `${width}: full listing/neighborhood collection`);
        await page.locator("#area-filter").selectOption("Bel Air");
        check(await page.locator(".property").count() === 1 && (await page.locator(".property h3").textContent()).includes("Mulholland"), `${width}: neighborhood filter`);
        await page.locator("#area-filter").selectOption("Malibu");
        check(await page.locator("#empty").isVisible() && await page.locator(".property").count() === 0, `${width}: honest empty inventory`);
        await page.locator("#reset").click();
        check(await page.locator(".property").count() === 3, `${width}: reset collection`);
        await page.locator("[data-address]").first().click();
        check(await page.locator("dialog").isVisible() && (await page.locator("#modal-body").textContent()).includes("illustrative brief data"), `${width}: property details disclaimer`);
        await page.locator("#property-enquiry").click();
        check((await page.locator('[name="message"]').inputValue()).includes("2847 Mulholland"), `${width}: property-specific enquiry`);
        check(!await page.locator("dialog").isVisible(), `${width}: property handoff closes dialog`);
        await page.locator('form .button').click();
        check((await page.locator("#form-status").textContent()).includes("Local draft only"), `${width}: empty contact prevented`);
        await page.locator('[name="name"]').fill("Alex Buyer");
        await page.locator('[name="email"]').fill("not-an-email");
        await page.locator('form .button').click();
        check((await page.locator("#form-status").textContent()).includes("Local draft only"), `${width}: invalid email prevented`);
        await page.locator('[name="email"]').fill("alex@example.test");
        await page.locator('[value="Sell"]').check();
        await page.locator("form .button").click();
        check((await page.locator("#form-status").textContent()).includes("(Sell). Not sent"), `${width}: selected intent truthful draft`);
        await page.locator('[data-neighborhood="Malibu"]').click();
        check((await page.locator("#modal-body").textContent()).includes("Beach & Canyon"), `${width}: neighborhood detail`);
        await page.keyboard.press("Escape");
        await page.locator("#privacy").click();
        check((await page.locator("#modal-body").textContent()).includes("memory only"), `${width}: privacy dialog`);
        await page.keyboard.press("Escape");
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu opens`);
            await page.locator('header nav a[href="#properties"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
