import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("355-gutter-cleaning", async (page, check, width) =>
    {
        check(await page.locator(".price-row").count() === 5, `${width}: complete property prices`);
        check(await page.locator(".water").evaluate((el) => getComputedStyle(el).strokeDashoffset === "0px"), `${width}: reduced motion shows completed water path`);
        check(await page.locator(".leaves").evaluate((el) => getComputedStyle(el).opacity === "0"), `${width}: reduced-motion debris cleared`);
        await page.locator("[data-filter='included']").click();
        check(await page.locator(".service").count() === 6 && (await page.locator("#service-list").textContent()).includes("Downpipes"), `${width}: included scope`);
        await page.locator("[data-filter='extra']").click();
        check(await page.locator(".service").count() === 4 && (await page.locator("#service-list").textContent()).includes("£45"), `${width}: extra scope and prices`);
        check(await page.locator("[data-filter='extra']").getAttribute("aria-pressed") === "true", `${width}: accessible selected filter`);
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".service").count() === 10, `${width}: all services restored`);
        await page.locator("#town").fill("MAL");
        check(await page.locator("#town-list li").count() === 1 && await page.locator("#town-list").textContent() === "Malvern", `${width}: case-insensitive town match`);
        await page.locator("#town").fill("London");
        check(await page.locator("#town-list li").count() === 0 && (await page.locator("#town-status").textContent()).includes("No listed"), `${width}: empty coverage state`);
        await page.locator("#reset-area").click();
        check(await page.locator("#town-list li").count() === 5, `${width}: coverage reset`);
        await page.locator(".comparison summary").click();
        check((await page.locator(".comparison details").textContent()).includes("not evidence of a real job"), `${width}: report explanation`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("Enter your town"), `${width}: missing town`);
        await page.locator("[name='town']").fill("Worcester");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("access note"), `${width}: missing access details`);
        await page.locator("[name='notes']").fill("Side gate access, no conservatory.");
        await page.locator("[name='property']").selectOption("Detached, large");
        await page.locator("[name='storeys']").selectOption("3");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("No message sent"), `${width}: honest prepared draft state`);
        check(decodeURIComponent(await page.locator("#email-draft").getAttribute("href")).includes("Detached, large, 3 storeys"), `${width}: selected property and storeys in actual draft`);
        await page.locator("[name='notes']").fill("Updated gate access");
        check(!await page.locator("#email-draft").isVisible(), `${width}: stale draft hidden after change`);
        check(await page.locator(".mobile-call").isVisible() === (width < 768), `${width}: correct mobile call affordance`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no personal data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interaction states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
