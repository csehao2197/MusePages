import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("357-hair-salon", async (page, check, width) =>
    {
        check(await page.locator(".service").count() === 6 && await page.locator(".look").count() === 5, `${width}: complete services and five looks`);
        await page.locator("[data-look='4']").click();
        check(await page.locator("#look-title").textContent() === "RICH COPPER", `${width}: copper look detail`);
        await page.locator("#look-book").click();
        check(await page.locator("[name='service']").inputValue() === "Colour & Balayage" && !await page.locator("#look-dialog").isVisible(), `${width}: look reaches relevant service`);
        check(await page.locator("[name='stylist'] option").count() === 2, `${width}: colour-capable stylists only`);
        check(await page.locator("[name='time'] option").count() === 5 && await page.locator("[name='time'] option").last().textContent() === "15:00", `${width}: long service finishes before close`);
        check((await page.locator("#service-note").textContent()).includes("patch-test"), `${width}: colour consultation notice`);
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("valid email"), `${width}: empty appointment form`);
        await page.locator("[name='name']").fill("Example Client");
        await page.locator("[name='email']").fill("client@example.test");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("[name='date']").fill("2030-07-14");
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("Sundays"), `${width}: Sunday closure`);
        await page.locator("[name='date']").fill("2030-07-15");
        await page.locator("[name='stylist']").selectOption("Maya");
        await page.locator("[name='time']").selectOption("15:00");
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("with Maya") && (await page.locator("#booking-result").textContent()).includes("no appointment booked"), `${width}: accurate truthful preview`);
        await page.locator("[name='service']").selectOption("Extensions");
        check(await page.locator("[name='stylist'] option").count() === 1 && await page.locator("[name='stylist']").inputValue() === "Luna", `${width}: extensions specialist selection`);
        check(!(await page.locator("#booking-result").textContent()).includes("with Maya"), `${width}: stale result cleared`);
        await page.locator("[name='service']").selectOption("Blow-Dry");
        check(await page.locator("[name='time'] option").last().textContent() === "16:30", `${width}: shorter service permits later start`);
        await page.keyboard.press("Escape");
        await page.locator("[data-stylist='Luna']").click();
        check(await page.locator("[name='stylist']").inputValue() === "Luna" && await page.locator("[name='service']").inputValue() === "Cut & Style", `${width}: direct stylist flow`);
        await page.keyboard.press("Escape");
        await page.locator("[data-social='Google']").click();
        check((await page.locator("#social-result").textContent()).includes("no verified"), `${width}: honest social fallback`);
        if (width < 768)
        {
            check(await page.locator("#gallery").evaluate((el) => el.scrollWidth > el.clientWidth), `${width}: gallery scroll contained inside strip`);
            await page.locator("#menu-button").click();
            await page.locator("#mobile-menu a[href='#services']").click();
            check(!await page.locator("#mobile-menu").isVisible(), `${width}: mobile menu navigation`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: client details not persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: modal and gallery fit page`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
