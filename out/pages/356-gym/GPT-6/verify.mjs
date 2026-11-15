import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("356-gym", async (page, check, width) =>
    {
        check(await page.locator(".class-card").count() === 6 && await page.locator(".plan").count() === 3, `${width}: complete classes and plans`);
        check(await page.locator(".session").count() === 3 && await page.locator(".session button:disabled").count() === 1, `${width}: sample capacity and full class`);
        await page.locator("[data-class='Boxing']").click();
        check(await page.locator("#class-filter").inputValue() === "Boxing" && await page.locator(".session").count() === 1, `${width}: class navigates to matching day`);
        await page.locator("[data-day='Sun']").click();
        check(await page.locator("#schedule-empty").isVisible() && await page.locator(".session").count() === 0, `${width}: combined filters empty state`);
        await page.locator("#reset-schedule").click();
        check(await page.locator(".session").count() === 3, `${width}: timetable reset`);
        await page.locator("[data-session='0']").click();
        check(await page.locator("#session-title").textContent() === "HIIT" && (await page.locator("#session-detail").textContent()).includes("06:30"), `${width}: matching class details`);
        await page.locator("#session-trial").click();
        check((await page.locator("#trial-selection").textContent()).includes("HIIT, Mon 06:30") && !await page.locator("#session-dialog").isVisible(), `${width}: selected class retained in trial preview`);
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-result").textContent()).includes("valid email"), `${width}: empty trial rejected`);
        await page.locator("[name='name']").fill("Example Visitor");
        await page.locator("[name='email']").fill("person@example.test");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-result").textContent()).includes("future"), `${width}: past trial start rejected`);
        await page.locator("[name='date']").fill("2030-05-17");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-result").textContent()).includes("Confirm"), `${width}: age/demo acknowledgement required`);
        await page.locator("[name='age']").check();
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-result").textContent()).includes("No membership, class booking or charge"), `${width}: truthful trial success preview`);
        await page.keyboard.press("Escape");
        await page.locator("#billing").selectOption("year");
        check((await page.locator(".plan.featured .plan-price").textContent()).includes("£660"), `${width}: annual plan arithmetic`);
        await page.locator("[data-plan='All In']").click();
        check((await page.locator("#trial-selection").textContent()).includes("£1068/year") && !(await page.locator("#trial-selection").textContent()).includes("HIIT"), `${width}: selected annual plan without stale class`);
        await page.keyboard.press("Escape");
        await page.locator("#billing").selectOption("month");
        check((await page.locator(".plan.featured .plan-price").textContent()).includes("£55"), `${width}: monthly reset`);
        await page.locator("[data-social='Instagram']").click();
        check((await page.locator("#social-result").textContent()).includes("no verified"), `${width}: honest social fallback`);
        if (width < 768)
        {
            await page.locator("#menu-button").click();
            check(await page.locator("#mobile-menu").isVisible(), `${width}: mobile menu opens`);
            await page.locator("#mobile-menu a[href='#classes']").click();
            check(!await page.locator("#mobile-menu").isVisible(), `${width}: mobile navigation closes`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no trial data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interactive state fits viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
