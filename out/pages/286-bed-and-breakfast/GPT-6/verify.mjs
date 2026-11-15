import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("286-bed-and-breakfast", async (page, check, width) =>
    {
        if (width === 1200)
        {
            await page.locator("[data-room='2']").click();
            check(await page.locator("#room-2").isVisible() && !await page.locator("#room-0").isVisible(), "desktop room image/detail swaps");
            check((await page.locator("#room-2").textContent()).includes("across the hall"), "honest private-bath detail");
            await page.locator("[data-room='2']").press("ArrowDown");
            check(await page.locator("[data-room='3']").getAttribute("aria-selected") === "true", "keyboard room navigation");
        }
        else check(await page.locator(".room-card:visible").count() === 5, "all five mobile room cards shown");
        await page.locator("[data-book-room='3']").click();
        check(await page.locator("#booking-room").inputValue() === "3", `${width}: room CTA prefills booking`);
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("future arrival"), `${width}: missing dates rejected`);
        await page.locator("#arrive").fill("2027-01-08");
        await page.locator("#depart").fill("2027-01-09");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("two nights"), `${width}: single-night weekend rejected`);
        await page.locator("#arrive").fill("2027-01-04");
        await page.locator("#depart").fill("2027-01-06");
        await page.locator("#dog").check();
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("£265 estimated"), `${width}: Linnet dog supplement`);
        await page.locator("#booking-room").selectOption("0");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("Linnet only"), `${width}: dog room restriction`);
        await page.locator("#dog").uncheck();
        await page.locator("#guests").selectOption("3");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("need The Kestrel"), `${width}: occupancy restriction`);
        await page.locator("#booking-room").selectOption("4");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("£450 estimated"), `${width}: sofa guest supplement`);
        await page.locator("#guests").selectOption("2");
        await page.locator("#booking-room").selectOption("0");
        await page.locator("#arrive").fill("2027-03-31");
        await page.locator("#depart").fill("2027-04-02");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("£310 estimated"), `${width}: mixed-season per-night rates`);
        check((await page.locator("#stay-status").textContent()).includes("nothing booked"), `${width}: no false reservation`);
        await page.locator("#depart").fill("2027-03-30");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("after arrival"), `${width}: reversed dates rejected`);
        await page.locator("#practical summary").nth(2).click();
        check((await page.locator("#practical details").nth(2).textContent()).includes("no lift"), `${width}: access details`);
        if (width === 390)
        {
            check(await page.locator(".mobile-availability").isVisible(), "sticky mobile availability action");
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "Wrenhouse mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Wrenhouse menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
