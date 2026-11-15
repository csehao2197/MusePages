import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("424-pressure-washing", async (page, check, width) =>
    {
        check(await page.locator(".surfaces article").count() === 5 && await page.locator(".price-table article").count() === 5 && await page.locator(".job-grid figure").count() === 6, `${width}: complete surface pricing and job sections`);
        check(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim()) && element.getBoundingClientRect().width > 0 && !["SCRIPT", "STYLE"].includes(element.tagName)).every((element) => parseFloat(getComputedStyle(element).fontSize) >= 14)), `${width}: all rendered text at least fourteen pixels`);
        const lowContrast = await page.locator("body *").evaluateAll((elements) =>
        {
            const rgb = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number);
            const luminance = (values) => values.map((value) =>
            {
                const channel = value / 255;
                return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
            }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
            return elements.filter((element) =>
            {
                if (!element.getBoundingClientRect().width || ["SCRIPT", "STYLE"].includes(element.tagName) || ![...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())) return false;
                let ancestor = element;
                while (ancestor && getComputedStyle(ancestor).backgroundColor === "rgba(0, 0, 0, 0)") ancestor = ancestor.parentElement;
                const background = luminance(rgb(ancestor ? getComputedStyle(ancestor).backgroundColor : "rgb(255,255,255)"));
                const foreground = luminance(rgb(getComputedStyle(element).color));
                return (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05) < 4.5;
            }).map((element) => element.textContent.trim().slice(0, 50));
        });
        check(lowContrast.length === 0, `${width}: all solid-surface text contrast at least 4.5:1 ${lowContrast.join(", ")}`);
        await page.locator(".practical input").first().check();
        check((await page.locator("#prepared").textContent()).startsWith("1 of 5"), `${width}: preparation checkbox count`);
        for (const box of await page.locator(".practical input").all()) await box.check();
        check((await page.locator("#prepared").textContent()).includes("Confirm access"), `${width}: completed practical checklist`);
        await page.locator("#reset-checklist").click();
        check((await page.locator("#prepared").textContent()).startsWith("0 of 5") && await page.locator(".practical input:checked").count() === 0, `${width}: checklist reset`);
        await page.locator("#method summary").nth(1).click();
        check(await page.locator("#method details").nth(1).getAttribute("open") !== null, `${width}: roof method opens`);
        await page.locator("#method summary").nth(1).click();
        check(await page.locator("#method details").nth(1).getAttribute("open") === null, `${width}: roof method closes`);
        check((await page.locator(".contact .pill").getAttribute("href")).includes("mailto:") && (await page.locator(".phone").getAttribute("href")).startsWith("tel:"), `${width}: actual contact handoffs`);
        check(await page.locator('[type="range"]').count() === 0 && await page.locator("form").count() === 0, `${width}: no forbidden slider or quote calculator`);
        await page.locator(".stripe-image").scrollIntoViewIfNeeded();
        check(await page.locator("#clean-line").evaluate((element) => getComputedStyle(element).display === "none"), `${width}: reduced motion hides moving stripe`);
        if (width === 1200)
        {
            await page.emulateMedia({ reducedMotion: "no-preference" });
            await page.reload();
            await page.locator(".stripe-image").scrollIntoViewIfNeeded();
            await page.waitForTimeout(2300);
            check(await page.locator(".stripe-image").evaluate((element) => element.classList.contains("clean")), `${width}: real scroll triggers one-shot clean reveal`);
            check(await page.locator("#clean-layer").evaluate((element) => getComputedStyle(element).clipPath === "inset(0px)"), `${width}: clean image fully revealed`);
            await page.evaluate(() => scrollTo(0, 0));
            await page.locator(".stripe-image").scrollIntoViewIfNeeded();
            check(await page.locator(".stripe-image").evaluate((element) => element.classList.contains("clean")), `${width}: reveal stays complete after re-entry`);
            await page.emulateMedia({ reducedMotion: "reduce" });
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
