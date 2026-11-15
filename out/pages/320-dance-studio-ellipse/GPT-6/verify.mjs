import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("320-dance-studio-ellipse", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original dancer art decodes`);
        check(await page.locator(".slot").count() === 16 && await page.locator(".slot:disabled").count() === 3, `${width}: precise timetable and full states`);
        await page.locator("[data-style='Ballet']").click();
        check(await page.locator(".slot").count() === 5, `${width}: style to timetable routing`);
        await page.locator("#level-filter").selectOption("Advanced");
        check(await page.locator(".slot").count() === 1, `${width}: combined ballet advanced filter`);
        await page.locator("#style-filter").selectOption("Hip-Hop");
        check(await page.locator(".slot").count() === 3, `${width}: all-level classes remain eligible`);
        await page.locator("#clear-filters").click();
        check(await page.locator(".slot").count() === 16, `${width}: reset timetable`);
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("valid email"), `${width}: contact validation`);
        await page.locator("#name").fill("Morgan Ellis");
        await page.locator("#email").fill("morgan@example.com");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("Choose a sample"), `${width}: class selection required`);
        await page.locator("#session").selectOption("3");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("future"), `${width}: future date required`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("Choose a Tuesday"), `${width}: selected class weekday consistency`);
        await page.locator("#date").fill("2027-02-09");
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("Advanced ballet requires"), `${width}: advanced placement guidance`);
        await page.locator("#experience").selectOption("advanced");
        await page.locator("#participant").selectOption("child");
        check(await page.locator("#guardian-label").isVisible(), `${width}: conditional guardian control`);
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("parent or guardian"), `${width}: guardian confirmation required`);
        await page.locator("#guardian").check();
        await page.locator("#trial-form button").click();
        check((await page.locator("#trial-status").textContent()).includes("guardian confirmed"), `${width}: child trial enquiry`);
        check((await page.locator("#trial-status").textContent()).includes("Nothing booked or sent"), `${width}: honest trial state`);
        await page.locator("#participant").selectOption("adult");
        check(!await page.locator("#guardian-label").isVisible() && !await page.locator("#guardian").isChecked(), `${width}: clear hidden guardian state`);
        await page.locator("[data-instructor='Contemporary']").click();
        check(await page.locator(".slot").count() === 3, `${width}: instructor discipline filter`);
        await page.locator(".slot").first().click();
        check((await page.locator("#selection").textContent()).includes("Monday 18:00"), `${width}: contextual sample session`);
        await page.locator("[data-show='0']").click();
        check((await page.locator("#show-dialog").textContent()).includes("Year unconfirmed"), `${width}: honest showcase date`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#show-dialog").isVisible(), `${width}: showcase Escape close`);
        await page.locator("[data-show='1']").click();
        check((await page.locator("#show-title").textContent()).includes("Spring"), `${width}: distinct spring details`);
        await page.locator("#close").click();
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "dance mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
