import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("285-barber", async (page, check, width) =>
    {
        await page.locator("[data-service='5']").click();
        check(await page.locator("#service").inputValue() === "5", `${width}: service preselection`);
        check((await page.locator("#booking-summary").textContent()).includes("80 min · from £72"), `${width}: duration and price`);
        await page.locator("#booking-form > button").click();
        check((await page.locator("#booking-status").textContent()).includes("date"), `${width}: incomplete plan rejected`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#date").dispatchEvent("change");
        check(await page.locator("[data-slot]").count() === 0, `${width}: past date has no slots`);
        await page.locator("#date").fill("2027-01-03");
        await page.locator("#date").dispatchEvent("change");
        check(await page.locator("[data-slot]").count() === 3, `${width}: Sunday opening times`);
        await page.locator("[data-slot='12:00']").click();
        await page.locator("#booking-form > button").click();
        check((await page.locator("#booking-status").textContent()).includes("valid email"), `${width}: contact fields required`);
        await page.locator("#customer").fill("Sam");
        await page.locator("#email").fill("bad");
        await page.locator("#booking-form > button").click();
        check((await page.locator("#booking-status").textContent()).includes("valid email"), `${width}: malformed email rejected`);
        await page.locator("#email").fill("sam@example.com");
        await page.locator("#booking-form > button").click();
        check((await page.locator("#booking-status").textContent()).includes("Nothing booked"), `${width}: valid local appointment plan`);
        await page.locator("#service").selectOption("0");
        check(await page.locator("[data-slot][aria-pressed='true']").count() === 0, `${width}: changing service resets appointment slot`);
        await page.locator("#booking-close").click();
        await page.locator("[data-barber='1']").click();
        check(await page.locator("#barber").inputValue() === "1", `${width}: specific barber selection`);
        await page.keyboard.press("Escape");
        await page.locator("[data-gallery='6']").click();
        check(await page.locator("#viewer-title").textContent() === "Precision clipper", `${width}: tool gallery viewer`);
        await page.locator("#viewer-close").click();
        await page.locator("#wait").click();
        check((await page.locator("#wait-status").textContent()).includes("not live"), `${width}: honest wait guidance`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "barber mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "barber mobile menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
