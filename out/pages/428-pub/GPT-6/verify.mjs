import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("428-pub", async (page, check, width) =>
    {
        check(await page.locator(".dish").count() === 10 && await page.locator(".ales article").count() === 6 && await page.locator(".events article").count() === 5, `${width}: complete food drink events`);
        await page.locator('[data-filter="Mains"]').click();
        check(await page.locator(".dish-group:visible").count() === 1 && await page.locator(".dish:visible").count() === 4, `${width}: mains filter`);
        await page.locator('[data-filter="Puddings"]').click();
        check(await page.locator(".dish:visible").count() === 3, `${width}: pudding filter`);
        await page.locator('[data-filter="All"]').click();
        check(await page.locator(".dish:visible").count() === 10, `${width}: full menu restored`);
        await page.evaluate(() => window.print = () => document.body.dataset.printed = "yes");
        await page.locator("#print-menu").click();
        check(await page.locator("body").getAttribute("data-printed") === "yes", `${width}: print handoff`);
        await page.locator("#room-details").click();
        check(await page.locator("dialog").isVisible() && (await page.locator("dialog").textContent()).includes("No live room availability"), `${width}: honest room details`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: room dialog escape`);
        check((await page.locator(".actions .button").getAttribute("href")).startsWith("mailto:"), `${width}: booking is external enquiry`);
        check(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().width > 0 && !["SCRIPT", "STYLE"].includes(element.tagName) && [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((element) => parseFloat(getComputedStyle(element).fontSize) >= 14)), `${width}: minimum fourteen pixel text`);
        check(await page.locator("form, iframe").count() === 0, `${width}: no false booking widget or embedded map`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu opens`);
            await page.locator('header nav a[href="#food"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile menu closes`);
            check(await page.locator(".mobile-book").isVisible(), `${width}: fixed booking handoff`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
