import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("352-garage-door", async (page, check, width) =>
    {
        check(await page.locator(".price-row").count() === 5, `${width}: all prices visible`);
        check(await page.locator(".fit-grid figure").count() === 5, `${width}: five illustrated fits`);
        check(await page.locator(".door-lift").evaluate((el) => getComputedStyle(el).display === "none"), `${width}: reduced motion avoids cover`);
        check(await page.locator("body *").evaluateAll((els) => els.filter((el) => Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim()) && getComputedStyle(el).display !== "none").every((el) => parseFloat(getComputedStyle(el).fontSize) >= 14)), `${width}: minimum readable text size`);
        await page.locator("#symptom").selectOption("spring");
        check(await page.locator(".repair").count() === 1 && (await page.locator(".repair").textContent()).includes("Stop".toUpperCase()), `${width}: heavy door safe guidance`);
        await page.locator("#symptom").selectOption("motor");
        check((await page.locator(".repair").textContent()).includes("£220"), `${width}: motor price range changes`);
        await page.locator("#symptom").selectOption("");
        check(await page.locator(".repair").count() === 4, `${width}: all repair reset`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#quote-result").textContent()).includes("full UK postcode"), `${width}: empty postcode validation`);
        await page.locator("[name='postcode']").fill("SW1A 1AA");
        await page.locator("#enquiry button").click();
        check((await page.locator("#quote-result").textContent()).includes("outside"), `${width}: out of coverage state`);
        await page.locator("[name='postcode']").fill("cm1 1aa");
        await page.locator("[name='email']").fill("invalid");
        await page.locator("#enquiry button").click();
        check((await page.locator("#quote-result").textContent()).includes("valid email"), `${width}: invalid email state`);
        await page.locator("[name='email']").fill("person@example.test");
        await page.locator("[name='service']").selectOption("1780");
        await page.locator("#enquiry button").click();
        check((await page.locator("#quote-result").textContent()).includes("£1,780") && (await page.locator("#quote-result").textContent()).includes("no visit booked"), `${width}: sectional estimate and honest status`);
        await page.locator("[name='service']").selectOption("540");
        await page.locator("#enquiry button").click();
        check((await page.locator("#quote-result").textContent()).includes("£540"), `${width}: changing service recalculates estimate`);
        check((await page.locator("header .button").getAttribute("href")) === "tel:012455550188", `${width}: immediate callable phone`);
        check(await page.locator(".mobile-call").isVisible() === (width < 768), `${width}: mobile-only call bar`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: enquiry not persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: form and filter states fit`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
