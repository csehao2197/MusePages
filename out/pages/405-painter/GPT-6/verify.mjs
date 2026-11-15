import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("405-painter", async (page, check, width) =>
    {
        check(await page.locator(".swatches button").count() === 6, `${width}: six exact paint choices`);
        check(await page.locator(".gallery figure").count() === 6 && await page.locator(".process li").count() === 5, `${width}: gallery and complete process`);
        check(await page.locator(".service").count() === 4 && await page.locator(".price-grid article").count() === 3, `${width}: services and actual brief price examples`);
        const headline = await page.locator("h1").textContent();
        const room = await page.locator(".hero-art img").getAttribute("src");
        for (const name of ["Terracotta", "Slate Blue", "Ochre", "Claret", "Charcoal Brown", "Fern"])
        {
            const button = page.getByRole("button", { name: `Preview ${name}`, exact: true });
            await button.click();
            check(await button.getAttribute("aria-pressed") === "true" && await page.locator("#colour-name").textContent() === name, `${width}: selected ${name}`);
            check(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--swatch").trim()) === await button.getAttribute("data-colour"), `${width}: only chosen accent ${name}`);
        }
        check(await page.locator("h1").textContent() === headline && await page.locator(".hero-art img").getAttribute("src") === room, `${width}: swatches preserve content and artwork`);
        await page.getByRole("button", { name: "Preview Claret", exact: true }).focus();
        await page.keyboard.press("Enter");
        check(await page.locator("#colour-name").textContent() === "Claret", `${width}: keyboard colour selection`);
        await page.getByRole("link", { name: /Get a free quote/ }).click();
        check(new URL(page.url()).hash === "#contact", `${width}: quote navigates to honest contact`);
        check(await page.locator("input").count() === 0, `${width}: no unauthorized calculator or booking`);
        check(await page.locator('a[href="mailto:hello@brushwork.scot"]').count() === 1, `${width}: email contact usable`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
