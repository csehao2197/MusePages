import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("368-jeweler", async (page, check, width) =>
    {
        check((await page.locator("h1").textContent()).includes("FIRST WAVE"), `${width}: actual original surf content`);
        check(await page.locator(".level").count() === 3 && await page.locator(".slot").count() === 21, `${width}: complete levels and sample week`);
        check(await page.locator(".slot:disabled").count() === 4, `${width}: full slots disabled`);
        await page.locator("#level-filter").selectOption("Advanced");
        check(await page.locator(".slot").count() === 7, `${width}: level filter`);
        await page.locator(".slot:not(:disabled)").first().click();
        check(await page.locator("#booking-level").inputValue() === "Advanced" && (await page.locator("#slot-label").textContent()).includes("Not held"), `${width}: slot and level handoff`);
        await page.locator("[name='people']").fill("3");
        check((await page.locator("#estimate").textContent()).includes("1–2"), `${width}: advanced capacity enforced`);
        await page.locator("[name='people']").fill("2");
        check((await page.locator("#estimate").textContent()).includes("£150"), `${width}: group total`);
        await page.locator("#booking-form .button").click();
        check((await page.locator("#booking-result").textContent()).includes("valid email"), `${width}: incomplete planner rejected`);
        await page.locator("[name='name']").fill("Example Surfer");
        await page.locator("[name='email']").fill("surfer@example.test");
        await page.locator("#booking-form .button").click();
        check((await page.locator("#booking-result").textContent()).includes("Confirm"), `${width}: mock acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#booking-form .button").click();
        check((await page.locator("#booking-result").textContent()).includes("no reservation, payment or confirmation"), `${width}: honest local plan`);
        await page.locator("#booking-level").selectOption("Beginner");
        check((await page.locator("#slot-label").textContent()).includes("Level changed"), `${width}: mismatched time cleared`);
        check((await page.locator("#estimate").textContent()).includes("£110"), `${width}: changed level pricing`);
        await page.keyboard.press("Escape");
        await page.locator("#clear-filter").click();
        check(await page.locator(".slot").count() === 21, `${width}: timetable reset`);
        await page.locator(".faq summary").first().click();
        check(await page.locator(".faq details").first().getAttribute("open") !== null, `${width}: suitability FAQ`);
        if (width < 768)
        {
            check(await page.locator(".schedule-scroll").evaluate((el) => el.scrollWidth > el.clientWidth), `${width}: contained mobile timetable scroll`);
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
