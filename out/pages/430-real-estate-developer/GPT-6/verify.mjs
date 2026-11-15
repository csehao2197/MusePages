import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("430-real-estate-developer", async (page, check, width) =>
    {
        check(await page.locator(".development").count() === 3 && await page.locator("[data-scheme]").count() === 5, `${width}: full development and completed collection`);
        await page.locator('[data-development="The Pines"]').click();
        check(await page.locator('[name="development"]').inputValue() === "The Pines", `${width}: scheme enquiry preselection`);
        await page.locator('form [type="submit"], form button').first().click();
        check(await page.locator("#confirmation").textContent() === "Your details stay in this page.", `${width}: empty required fields`);
        await page.locator('[name="name"]').fill("Robin Shore");
        await page.locator('[name="email"]').fill("bad-address");
        await page.locator('[name="consent"]').check();
        await page.locator("form .button").click();
        check(await page.locator("#confirmation").textContent() === "Your details stay in this page.", `${width}: invalid email rejected`);
        await page.locator('[name="email"]').fill("robin@example.test");
        await page.locator("form .button").click();
        check((await page.locator("#confirmation").textContent()).includes("The Pines") && (await page.locator("#confirmation").textContent()).includes("Nothing was submitted"), `${width}: truthful development confirmation`);
        await page.locator('[type="reset"]').click();
        check(await page.locator('[name="name"]').inputValue() === "" && !await page.locator('[name="consent"]').isChecked(), `${width}: clear private details`);
        await page.locator("[data-scheme]").first().click();
        check(await page.locator(".scheme-preview").isVisible() && (await page.locator("figcaption").textContent()).includes("Saltings · Bosham"), `${width}: completed scheme disclosure`);
        await page.locator("[data-scheme]").first().click();
        check(!await page.locator(".scheme-preview").isVisible(), `${width}: disclosure toggles closed`);
        await page.locator("#privacy").click();
        check(await page.locator("dialog").isVisible(), `${width}: privacy opens`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: privacy escape`);
        check(await page.locator("body *").evaluateAll((elements) => elements.filter((element) => element.getBoundingClientRect().width > 0 && !["SCRIPT", "STYLE"].includes(element.tagName) && [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).every((element) => parseFloat(getComputedStyle(element).fontSize) >= 14)), `${width}: text minimum fourteen pixels`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu`);
            await page.locator('header nav a[href="#approach"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: menu closes on navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
