import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("397-nonprofit-organization", async (page, check, width) =>
    {
        check(await page.locator(".programs details").count() === 4 && await page.locator(".stories article").count() === 3, `${width}: complete programme/story scope`);
        await page.locator("[data-amount='25']").click();
        check((await page.locator("#translation").textContent()).includes("water filter"), `${width}: cost example translation`);
        await page.locator("[data-frequency='One-time']").click();
        check((await page.locator("#give-button").textContent()).includes("one-time"), `${width}: frequency handoff`);
        await page.locator("#custom").fill("0");
        await page.locator("#give-button").click();
        check((await page.locator("#give-result").textContent()).includes("valid amount"), `${width}: invalid giving amount`);
        await page.locator("#custom").fill("14.123");
        await page.locator("#give-button").click();
        check((await page.locator("#give-result").textContent()).includes("valid amount"), `${width}: excess precision guard`);
        await page.locator("#custom").fill("75.50");
        await page.locator("#give-button").click();
        check((await page.locator("#give-result").textContent()).includes("$75.50 one-time") && (await page.locator("#give-result").textContent()).includes("No donation"), `${width}: truthful custom giving review`);
        check((await page.locator("#translation").textContent()).includes("No specific impact"), `${width}: custom impact not fabricated`);
        await page.locator("#giving-form [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("[data-amount='60']").getAttribute("aria-pressed") === "true" && await page.locator("#custom").inputValue() === "", `${width}: giving reset`);
        await page.locator("[data-route=Steward]").click();
        check(await page.locator("#route").inputValue() === "Steward", `${width}: steward handoff`);
        await page.locator("#interest button").first().click();
        check((await page.locator("#interest-result").textContent()).includes("Choose a time"), `${width}: empty commitment guard`);
        await page.locator("#time").selectOption("Four visits a year");
        await page.locator("#interest button").first().click();
        check((await page.locator("#interest-result").textContent()).includes("Steward: Four visits") && (await page.locator("#interest-result").textContent()).includes("No signup"), `${width}: local involvement plan`);
        await page.locator("#interest [type=reset]").click();
        check(await page.locator("#interest-result").textContent() === "", `${width}: involvement reset`);
        await page.locator("#newsletter button").click();
        check((await page.locator("#email-result").textContent()).includes("valid email"), `${width}: newsletter empty error`);
        await page.locator("#email").fill("reader@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#email-result").textContent()).includes("No subscription"), `${width}: newsletter honest confirmation`);
        await page.locator(".documents summary").first().click();
        check((await page.locator(".documents details").first().textContent()).includes("No download"), `${width}: missing reports stated honestly`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
