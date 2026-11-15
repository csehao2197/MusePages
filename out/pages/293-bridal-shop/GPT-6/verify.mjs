import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("293-bridal-shop", async (page, check, width) =>
    {
        const tiny = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(el).fontSize) < 14).length);
        check(tiny === 0, `${width}: all text at least fourteen pixels`);
        await page.locator("[data-designer='Savin London']").click();
        await page.locator("[data-designer='Andrea Hawkes']").click();
        check((await page.locator("#shortlist").textContent()).includes("Savin London, Andrea Hawkes"), `${width}: multiple shortlist`);
        await page.locator("[data-designer='Savin London']").click();
        check(!(await page.locator("#shortlist").textContent()).includes("Savin"), `${width}: remove shortlist`);
        await page.locator("#size-enquiry").click();
        check(await page.locator("#reason").inputValue() === "Ask about my size", `${width}: size enquiry context`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: name required`);
        await page.locator("#name").fill("Taylor Reed");
        await page.locator("#email").fill("bad");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("taylor@example.com");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("ten characters"), `${width}: useful note needed`);
        await page.locator("#note").fill("Please tell me which styles you hold in UK 20 for an autumn wedding.");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("Nothing has been sent"), `${width}: honest email state`);
        const href = decodeURIComponent(await page.locator("#email-draft").getAttribute("href"));
        check(href.includes("subject=Ask about my size") && href.includes("Andrea Hawkes") && href.includes("UK 20"), `${width}: exact contextual mailto`);
        await page.locator("#note").fill("Updated note");
        check(!await page.locator("#email-draft").isVisible(), `${width}: old draft hidden after edit`);
        await page.locator(".drawing").scrollIntoViewIfNeeded();
        await page.waitForFunction(() => document.querySelector(".drawing").classList.contains("visible"));
        check(await page.locator(".drawing").evaluate((el) => el.classList.contains("visible")), `${width}: line art revealed`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "bridal menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "bridal menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
