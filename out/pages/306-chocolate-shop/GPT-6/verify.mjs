import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("306-chocolate-shop", async (page, check, width) =>
    {
        check(await page.locator("#snap").evaluate((el) => el.classList.contains("snapped")), `${width}: reduced motion snapped bar`);
        check(await page.locator("#snap i").count() === 24, `${width}: complete scored bar`);
        await page.locator("#search").fill("raspberry");
        check(await page.locator(".origin").count() === 1, `${width}: tasting note search`);
        check((await page.locator(".origin h3").textContent()).includes("Madagascar"), `${width}: correct origin`);
        await page.locator("[data-origin='0']").click();
        check((await page.locator("#count").textContent()).includes("1 of 3"), `${width}: first tasting choice`);
        await page.locator("#search").fill("not-a-flavour");
        check(await page.locator("#empty").isVisible(), `${width}: empty note results`);
        await page.locator("#reset").click();
        check(await page.locator(".origin").count() === 5, `${width}: reset origin search`);
        await page.locator("[data-origin='1']").click();
        await page.locator("[data-origin='2']").click();
        await page.locator("[data-origin='3']").click();
        check((await page.locator("#selection-status").textContent()).includes("up to three"), `${width}: tasting set maximum`);
        check((await page.locator("#count").textContent()).includes("3 of 3"), `${width}: selection limit preserves state`);
        await page.locator("[data-origin='1']").click();
        await page.locator("[data-origin='3']").click();
        check(decodeURIComponent(await page.locator("#origin-email").getAttribute("href")).includes("Vietnam"), `${width}: enquiry body includes replacement`);
        check(!decodeURIComponent(await page.locator("#origin-email").getAttribute("href")).includes("Peru"), `${width}: removed origin absent`);
        await page.locator("#month").selectOption("6");
        check((await page.locator("#posting").textContent()).includes("Outside"), `${width}: summer posting closed`);
        await page.locator("#month").selectOption("10");
        check((await page.locator("#posting").textContent()).includes("Within"), `${width}: winter posting enquiry`);
        check(decodeURIComponent(await page.locator("#post-email").getAttribute("href")).includes("November"), `${width}: seasonal enquiry subject`);
        check(await page.locator("form").count() === 0, `${width}: contact-only no checkout`);
        check(await page.locator("body").evaluate((el) => Math.min(...[...el.querySelectorAll("p, a, button, span, label, strong")].map((node) => parseFloat(getComputedStyle(node).fontSize)))) >= 14, `${width}: readable minimum type size`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "chocolate mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
