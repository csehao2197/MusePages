import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("378-magazine", async (page, check, width) =>
    {
        check(await page.locator("nav a").count() === 8 && await page.locator("#opinion-grid article").count() === 4, `${width}: full category/opinion structure`);
        await page.locator("nav [data-category='Shop']").click();
        check(await page.locator("#archive-empty").isVisible() && await page.locator("#archive-list article").count() === 0, `${width}: honest shop empty state`);
        await page.locator("nav [data-category='Travel']").click();
        check(await page.locator("#archive-list article").count() === 5 && !await page.locator("#archive-empty").isVisible(), `${width}: filtered travel archive`);
        await page.locator("#archive-list [data-story='13']").click();
        check(await page.locator("#reading").isVisible() && (await page.locator("#reading-copy").textContent()).includes("return services"), `${width}: actual inline travel reading note`);
        await page.locator("#close-reading").click();
        check(!await page.locator("#reading").isVisible(), `${width}: close inline reader`);
        await page.locator(".recipe [data-story='8']").click();
        check((await page.locator("#reading-copy").textContent()).includes("800g") && (await page.locator("#reading-copy").textContent()).includes("Do not store garlic in oil at room temperature"), `${width}: complete recipe and safe storage`);
        await page.locator("#close-reading").click();
        await page.locator("#newsletter button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: newsletter empty error`);
        await page.locator("#email").fill("invalid");
        await page.locator("#newsletter button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: malformed email error`);
        await page.locator("#email").fill("reader@example.test");
        await page.locator("#newsletter button").click();
        check((await page.locator("#result").textContent()).includes("Confirm"), `${width}: newsletter acknowledgement guard`);
        await page.locator("#ack").check();
        await page.locator("#newsletter button").click();
        check((await page.locator("#result").textContent()).includes("No subscription created"), `${width}: honest newsletter local outcome`);
        check(await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).display !== "none" && [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((el) => parseFloat(getComputedStyle(el).fontSize) >= 14)), `${width}: all text minimum 14px`);
        check(await page.locator("dialog").count() === 0, `${width}: no popups`);
        if (width === 1200)
        {
            await page.locator("#signin").click();
            check((await page.locator("#account").textContent()).includes("no accounts"), `${width}: sign in states unavailable honestly`);
            await page.locator("#close-account").click();
        }
        else
        {
            check(await page.locator("nav").evaluate((el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX === "auto"), `${width}: contained mobile category scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
