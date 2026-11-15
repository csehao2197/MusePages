import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("376-life-insurance", async (page, check, width) =>
    {
        check(await page.locator("main > section").count() === 6 && await page.locator("header").count() === 1 && await page.locator("footer").count() === 1, `${width}: exact eight structural regions`);
        check(await page.locator("table").count() === 1 && await page.locator("tbody tr").count() === 4, `${width}: real four-row premium table`);
        check(await page.locator("form, button, img, svg, canvas").count() === 0, `${width}: restrained document without form/graphics/buttons`);
        await page.locator("nav a[href='#costs']").click();
        check(await page.evaluate(() => location.hash === "#costs"), `${width}: cost navigation`);
        check((await page.locator("caption").textContent()).includes("Not verified"), `${width}: quote limitation visible`);
        check(await page.locator(".contact-links a").first().getAttribute("href") === "tel:+4417935550142", `${width}: correct phone action`);
        check(await page.locator(".contact-links a").nth(1).getAttribute("href") === "mailto:hello@thornburyreed.co.uk", `${width}: correct email action`);
        await page.locator("a[href='#privacy']").click();
        await page.locator("#privacy summary").click();
        check((await page.locator("#privacy").textContent()).includes("no forms, analytics, cookies or storage") && await page.locator("#privacy").getAttribute("open") !== null, `${width}: useful privacy disclosure`);
        await page.locator("#complaints summary").click();
        check(await page.locator("#complaints").getAttribute("open") !== null, `${width}: complaints limitation disclosure`);
        check(await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((el) => parseFloat(getComputedStyle(el).fontSize) >= 14)), `${width}: every text size at least 14px`);
        const contrast = (a, b) =>
        {
            const luminance = (hex) =>
            {
                const v = hex.match(/../g).map((part) => parseInt(part, 16) / 255).map((x) => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
                return .2126 * v[0] + .7152 * v[1] + .0722 * v[2];
            };
            const x = luminance(a);
            const y = luminance(b);
            return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
        };
        check(["16233b", "5c6579", "735720"].every((color) => ["f2f1ed", "e6e5e0"].every((surface) => contrast(color, surface) >= 4.5)), `${width}: all text tokens 4.5 contrast on both surfaces`);
        if (width < 768)
        {
            const age = await page.locator("tbody tr").first().locator("th").boundingBox();
            const premium = await page.locator("tbody tr").first().locator("td").last().boundingBox();
            check(Math.abs(age.y - premium.y) < 2, `${width}: premium on same line as age`);
            check(await page.locator(".mobile-phone").isVisible() && (await page.locator("caption").boundingBox()).width > 300, `${width}: mobile hero phone and full-width table caption`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
