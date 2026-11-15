import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("431-real-estate-photography", async (page, check, width) =>
    {
        check(await page.locator(".packages article").count() === 3 && await page.locator(".work-grid figure").count() === 6, `${width}: complete packages and work`);
        check(await page.locator("dialog, select, form, input[type=range]").count() === 0, `${width}: no filter lightbox booking or slider`);
        check(await page.locator(".finished").evaluate((element) => getComputedStyle(element).opacity === "1"), `${width}: reduced motion final exposure visible`);
        await page.locator(".checklist input").first().check();
        check((await page.locator("#prepared").textContent()).startsWith("1 of 6"), `${width}: preparation checkbox`);
        for (const input of await page.locator(".checklist input").all()) await input.check();
        check((await page.locator("#prepared").textContent()).includes("house is prepared"), `${width}: complete preparation`);
        await page.locator("#reset-checklist").click();
        check(await page.locator(".checklist input:checked").count() === 0, `${width}: reset preparation`);
        await page.evaluate(() => window.print = () => document.body.dataset.printed = "true");
        await page.locator("#print-guide").click();
        check(await page.locator("body").getAttribute("data-printed") === "true", `${width}: printable seller guide`);
        check((await page.locator(".book").getAttribute("href")).startsWith("mailto:"), `${width}: external shoot enquiry`);
        check(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().width > 0 && !["SCRIPT", "STYLE"].includes(element.tagName) && [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((element) => parseFloat(getComputedStyle(element).fontSize) >= 14)), `${width}: all text minimum fourteen pixels`);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.reload();
        await page.locator(".merge").scrollIntoViewIfNeeded();
        await page.waitForTimeout(1800);
        check(await page.locator(".merge").evaluate((element) => element.classList.contains("done")), `${width}: viewport triggers one merge`);
        check(await page.locator(".finished").evaluate((element) => getComputedStyle(element).opacity === "1"), `${width}: merge reaches final frame`);
        await page.locator(".wordmark").scrollIntoViewIfNeeded();
        await page.locator(".merge").scrollIntoViewIfNeeded();
        check(await page.locator(".finished").evaluate((element) => getComputedStyle(element).opacity === "1"), `${width}: merge does not restart`);
        check(await page.locator("body *").evaluateAll((elements) => elements.every((element) => !element.getAnimations().some((animation) => animation.playState === "running"))), `${width}: no other running animation`);
        await page.emulateMedia({ reducedMotion: "reduce" });
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
