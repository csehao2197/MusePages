import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("354-golf-club", async (page, check, width) =>
    {
        check(await page.locator(".hole").count() === 18, `${width}: complete 18-hole scorecard`);
        check(await page.locator("#score-yards").textContent() === "6,412", `${width}: exact white tee total`);
        check(await page.locator(".nine-total b").allTextContents().then((items) => items.join(",") === "3,248,36,3,164,36"), `${width}: front/back sums and par`);
        await page.locator(".hole[data-number='12'] button").focus();
        check(await page.locator(".hole[data-number='12']").evaluate((el) => el.classList.contains("open")), `${width}: keyboard hole highlight`);
        check((await page.locator("#hole-note-12").textContent()).includes("hardest hole"), `${width}: actual hole description`);
        await page.locator("#tee").selectOption("yellow");
        check(await page.locator("#score-yards").textContent() === "6,092", `${width}: yellow tee arithmetic`);
        check(await page.locator(".hole[data-number='7'] button span").nth(1).textContent() === "158", `${width}: individual tee distance changes`);
        await page.locator("#tee").selectOption("white");
        await page.locator("[data-hole='18']").click();
        check(await page.locator(".hole[data-number='18'] button").getAttribute("aria-expanded") === "true", `${width}: signature hole opens matching row`);
        await page.locator("[data-interest='Weekday Membership']").click();
        check((await page.locator("#selection-note").textContent()).includes("£1,650"), `${width}: weekday first-year cost`);
        await page.locator("#enquiry-form button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("valid email"), `${width}: empty enquiry invalid`);
        await page.locator("[name='name']").fill("Example Member");
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("[name='interest']").selectOption("Junior Membership");
        await page.locator("[name='age']").fill("18");
        await page.locator("#enquiry-form button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("1 to 17"), `${width}: junior age restriction`);
        await page.locator("[name='age']").fill("15");
        await page.locator("#enquiry-form button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("Confirm"), `${width}: preview understanding required`);
        await page.locator("[name='consent']").check();
        await page.locator("#enquiry-form button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("No application submitted"), `${width}: truthful membership state`);
        await page.locator("#event-guests").selectOption("24");
        check((await page.locator("#event-total").textContent()).includes("£1,632"), `${width}: corporate group cost`);
        await page.locator("[data-interest='Coaching']").click();
        check(await page.locator("[name='interest']").inputValue() === "Coaching" && !await page.locator("#age-field").isVisible(), `${width}: lesson enquiry hides junior field`);
        check((await page.locator("#enquiry-result").textContent()).includes("Selection updated"), `${width}: stale result cleared`);
        if (width < 768)
        {
            await page.locator("#menu-button").click();
            check(await page.locator("#mobile-menu").isVisible(), `${width}: mobile menu opens`);
            await page.locator("#mobile-menu a[href='#visitors']").click();
            check(await page.locator("#menu-button").getAttribute("aria-expanded") === "false", `${width}: menu closes after selection`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no applicant data retained`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: dynamic states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
