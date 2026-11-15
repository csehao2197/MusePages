import { audit } from "./serial-run.mjs";
export async function verify()
{
    return audit("311-cocktail-bar", async (page, check, width) =>
    {
        check(await page.locator(".drink").count() === 3, `${width}: three signature drinks`);
        await page.locator("#search").fill("sesame");
        check(await page.locator(".drink").count() === 1 && (await page.locator(".drink h4").textContent()).includes("Midnight"), `${width}: ingredient search`);
        await page.locator("#search").fill("doesnotexist");
        check((await page.locator("#drink-list").textContent()).includes("No matching"), `${width}: empty menu result`);
        await page.locator("[data-category='Zero']").click();
        check(await page.locator(".drink").count() === 2, `${width}: zero category clears search`);
        check(await page.locator("[data-category='Zero']").getAttribute("aria-pressed") === "true", `${width}: selected menu category`);
        await page.locator("[data-category='Classics']").click();
        check((await page.locator("#drink-list").textContent()).includes("Negroni"), `${width}: classics menu`);
        await page.locator("[data-category='Spirits']").click();
        check((await page.locator("#drink-list").textContent()).includes("Rare Pours"), `${width}: spirits menu`);
        await page.locator("#booking button").click();
        check((await page.locator("#booking-status").textContent()).includes("future"), `${width}: missing date`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#booking button").click();
        check((await page.locator("#booking-status").textContent()).includes("Mondays"), `${width}: closed Monday`);
        await page.locator("#date").fill("2027-02-09");
        await page.locator("#guests").selectOption("4");
        await page.locator("#time").selectOption("22:30");
        await page.locator("#booking button").click();
        check((await page.locator("#booking-status").textContent()).includes("4 guests, 2027-02-09 at 22:30"), `${width}: contextual evening plan`);
        check((await page.locator("#booking-status").textContent()).includes("Nothing reserved"), `${width}: honest reservation state`);
        await page.locator("#email").fill("bad");
        await page.locator("#mailing button").click();
        check((await page.locator("#mail-status").textContent()).includes("valid email"), `${width}: invalid newsletter email`);
        await page.locator("#email").fill("guest@example.com");
        await page.locator("#mailing button").click();
        check((await page.locator("#mail-status").textContent()).includes("no subscription"), `${width}: honest newsletter preview`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "cocktail mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
