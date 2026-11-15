import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("337-esthetician", async (page, check, width) =>
    {
        check(await page.locator(".arch-layout img").evaluate((image) => image.naturalWidth > 0), `${width}: original arch-room visual`);
        check(await page.locator(".treatment").count() === 4, `${width}: four treatments`);
        await page.locator("[data-treatment='2']").click();
        check(await page.locator("#detail-2").isVisible() && (await page.locator("#detail-2").textContent()).includes("No outcome is guaranteed"), `${width}: resurfacing expands with suitability caveat`);
        await page.locator("#detail-2 [data-book]").click();
        check(await page.locator("#enquiry").isVisible() && await page.locator("select").inputValue() === "Resurfacing", `${width}: treatment routed to enquiry`);
        check((await page.locator("#suitability").textContent()).includes("professional suitability"), `${width}: treatment-specific caution`);
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty form rejected`);
        await page.locator("[name='name']").fill("Example guest");
        await page.locator("[name='email']").fill("guest@example.test");
        await page.locator("textarea").fill("Short");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("10 characters"), `${width}: short enquiry rejected`);
        await page.locator("textarea").fill("Could we discuss the treatment options?");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("No appointment is held"), `${width}: truthful local completion`);
        await page.locator("select").selectOption("The Quiet Hour");
        check(await page.locator("#result").textContent() === "" && !(await page.locator("#suitability").textContent()).includes("Resurfacing"), `${width}: treatment switch clears stale response and caution`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#enquiry").isVisible(), `${width}: Escape dismissal`);
        await page.locator("[data-treatment='2']").click();
        check(!await page.locator("#detail-2").isVisible(), `${width}: treatment collapses`);
        await page.locator("#gift-info").click();
        check((await page.locator("#enquiry-note").textContent()).includes("issues no voucher"), `${width}: gift scope clear`);
        await page.locator("#close").click();
        check(await page.locator("#hours .today").count() === 1 && (await page.locator("#hours .today").textContent()).includes("today"), `${width}: one correct current-day hours marker`);
        check(await page.locator("#face").evaluate((node) => getComputedStyle(node).strokeDashoffset === "0px"), `${width}: reduced motion face fully drawn`);
        check(await page.locator(".gallery figure").count() === 5, `${width}: five original still-life compositions`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile menu opens");
            await page.locator("#menu").click();
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no persisted personal information`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
