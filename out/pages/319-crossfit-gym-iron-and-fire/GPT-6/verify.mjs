import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("319-crossfit-gym-iron-and-fire", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original athlete art decodes`);
        check(await page.evaluate(() => [...document.querySelectorAll("*")].every((node) => getComputedStyle(node).borderTopLeftRadius === "0px")), `${width}: zero radius throughout`);
        check(await page.locator("[data-target='220']").textContent() === "220+", `${width}: reduced motion final stats`);
        check(await page.locator(".slot").count() === 18 && await page.locator(".slot:disabled").count() === 5, `${width}: exact timetable and full states`);
        await page.locator("[data-level='Rx']").click();
        check((await page.locator("#workout-title").textContent()).includes("EARNED"), `${width}: Rx readiness guidance`);
        await page.locator("[data-level='Scaled']").click();
        check((await page.locator("#workout-copy").textContent()).includes("matched to you"), `${width}: scaled guidance`);
        await page.locator("[data-plan='annual']").click();
        check((await page.locator("#selection").textContent()).includes("£948 upfront"), `${width}: correct annual upfront billing`);
        check((await page.locator("#plan-status").textContent()).includes("saves £120"), `${width}: annual comparison saving`);
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: intro identity validation`);
        await page.locator("#name").fill("Casey Jordan");
        await page.locator("#email").fill("casey@example.com");
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: intro date required`);
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("Sunday"), `${width}: rest day rejected`);
        await page.locator("[aria-label='Monday 06:00: Available']").click();
        check(await page.locator("#visit-type").inputValue() === "class", `${width}: contextual schedule enquiry`);
        await page.locator("#date").fill("2027-02-09");
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("Choose a Monday"), `${width}: weekday matches sample slot`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("experience"), `${width}: coaching context required`);
        await page.locator("#experience").selectOption("New to CrossFit");
        await page.locator("#acknowledge").check();
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("Monday 06:00 class enquiry, £20"), `${width}: exact sample class summary`);
        check((await page.locator("#status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest class state`);
        await page.locator("#visit-type").selectOption("intro");
        await page.locator("#intro-form button").click();
        check((await page.locator("#status").textContent()).includes("45-minute free intro"), `${width}: free intro distinct from paid class`);
        await page.locator(".competition summary").first().click();
        check((await page.locator(".competition details").first().textContent()).includes("unconfirmed"), `${width}: honest event date`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "CrossFit mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
