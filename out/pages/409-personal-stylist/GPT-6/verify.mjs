import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("409-personal-stylist", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 4 && await page.locator(".polaroids figure").count() === 5 && await page.locator(".price-row").count() === 5, `${width}: complete service moodboard and pricing`);
        await page.locator("#reveal").focus();
        await page.keyboard.press("Home");
        check((await page.locator("#after").getAttribute("style")).includes("100%"), `${width}: before endpoint`);
        await page.keyboard.press("End");
        check((await page.locator("#after").getAttribute("style")).includes("0%") && await page.locator("#reveal").getAttribute("aria-valuetext") === "100 percent curated wardrobe", `${width}: after endpoint and accessible value`);
        await page.locator("#reveal").focus();
        await page.keyboard.press("ArrowLeft");
        check(await page.locator("#reveal").inputValue() === "99", `${width}: keyboard comparison`);
        await page.locator(".faqs summary").first().click();
        check(await page.locator(".faqs details").first().getAttribute("open") !== null, `${width}: faq opens`);
        await page.locator(".faqs summary").nth(1).click();
        check(await page.locator(".faqs details").first().getAttribute("open") === null, `${width}: single accordion closes previous`);
        await page.locator('[data-service="executive"]').click();
        await page.locator("#location").selectOption("outer");
        check((await page.locator("#estimate").textContent()).includes("£200/month") && (await page.locator("#estimate").textContent()).includes("£600"), `${width}: travel and retainer minimum correctly disclosed`);
        await page.locator("#location").selectOption("outside");
        check((await page.locator("#estimate").textContent()).includes("individual quote"), `${width}: outside London no invented price`);
        await page.locator("#service").selectOption("online");
        check(await page.locator("#location").isDisabled() && (await page.locator("#estimate").textContent()).includes("£95"), `${width}: worldwide online no travel charge`);
        await page.locator("#service").selectOption("gift");
        await page.locator("#voucher").fill("49");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("at least £50"), `${width}: gift minimum`);
        await page.locator("#voucher").fill("");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("at least £50"), `${width}: empty gift value`);
        await page.locator("#voucher").fill("75");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty contact guard`);
        await page.locator("#name").fill("<b>Alex</b>");
        await page.locator("#email").fill("bad");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: malformed email guard`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("Acknowledge"), `${width}: local-only acknowledgement`);
        await page.locator("#ack").check();
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent") && await page.locator("#result b").count() === 0, `${width}: safe honest local request`);
        await page.locator("#request [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#name").inputValue() === "" && await page.locator("#result").textContent() === "" && (await page.locator("#estimate").textContent()).includes("£250"), `${width}: reset clears data and estimate`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile menu opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: mobile menu escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
