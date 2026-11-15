import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("433-record-store", async (page, check, width) =>
    {
        check(await page.locator(".rack").count() === 5 && await page.locator(".sleeve-wall .sleeve").count() === 12, `${width}: complete fictional racks and sleeve wall`);
        check(await page.locator("audio").count() === 0 && await page.locator('[class*="cart"]').count() === 0, `${width}: no player or cart`);
        check(await page.locator(".rack .price").evaluateAll((links) => links.every((link) => link.href.startsWith("https://www.discogs.com/search/"))), `${width}: external Discogs searches`);
        await page.locator("[data-crate]").nth(2).click();
        check((await page.locator("#crate-info").textContent()).includes("DUB AND REGGAE") && await page.locator('.crate[aria-pressed="true"]').count() === 1, `${width}: genre digging note`);
        await page.locator("[data-crate]").nth(4).click();
        check((await page.locator("#crate-info").textContent()).includes("not live inventory"), `${width}: truthful crate counts`);
        await page.locator("#valuation").click();
        await page.locator("#valuation-form button").click();
        check(!await page.locator("#email-valuation").isVisible(), `${width}: empty record count prevented`);
        await page.locator('[name="count"]').fill("0");
        await page.locator("#valuation-form button").click();
        check(!await page.locator("#email-valuation").isVisible(), `${width}: invalid count prevented`);
        await page.locator('[name="count"]').fill("250");
        await page.locator("#valuation-form button").click();
        check((await page.locator("#valuation-status").textContent()).includes("Nothing has been appraised"), `${width}: no false appraisal`);
        check((await page.locator("#email-valuation").getAttribute("href")).includes("250"), `${width}: collection-specific email draft`);
        await page.keyboard.press("Escape");
        await page.locator("#newsletter").click();
        check((await page.locator("#modal-body").textContent()).includes("No subscription has been created"), `${width}: newsletter disclosure`);
        await page.locator(".close").click();
        check(!await page.locator("dialog").isVisible(), `${width}: dialog dismissal`);
        check(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().width > 0 && !["SCRIPT", "STYLE"].includes(element.tagName) && [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((element) => parseFloat(getComputedStyle(element).fontSize) >= 14)), `${width}: minimum fourteen pixel text`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile navigation`);
            await page.locator('header nav a[href="#crates"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
