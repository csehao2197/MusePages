import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("295-campground", async (page, check, width) =>
    {
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("after arrival"), `${width}: empty dates`);
        await page.locator("[data-pitch='3']").click();
        check((await page.locator("#pitch-description").textContent()).includes("wood burner"), `${width}: pitch detail swaps`);
        check(await page.locator("#fire").isDisabled(), `${width}: unsupported fire pit disabled`);
        await page.locator("#arrive").fill("2027-04-02");
        await page.locator("#depart").fill("2027-04-03");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("2-night minimum"), `${width}: glamping minimum`);
        await page.locator("#depart").fill("2027-04-04");
        await page.locator("#people").fill("5");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("1–4"), `${width}: pitch capacity`);
        await page.locator("#people").fill("4");
        await page.locator("#dogs").fill("3");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("two dogs"), `${width}: dog maximum`);
        await page.locator("#dogs").fill("2");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("£198"), `${width}: bell and dogs estimate`);
        check((await page.locator("#status").textContent()).includes("Nothing booked"), `${width}: honest stay state`);
        await page.locator("[data-pitch='0']").click();
        await page.locator("#fire").check();
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("£64"), `${width}: tent plus dog and fire costs`);
        await page.locator("#arrive").fill("2027-04-09");
        await page.locator("#depart").fill("2027-04-10");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("No sample availability"), `${width}: sold out night`);
        await page.locator("#arrive").fill("2027-11-02");
        await page.locator("#depart").fill("2027-11-04");
        await page.locator("#stay button").click();
        check((await page.locator("#status").textContent()).includes("season"), `${width}: closed season`);
        const before = await page.locator("#month").textContent();
        await page.locator("#next").click();
        check(await page.locator("#month").textContent() !== before, `${width}: month navigation`);
        await page.locator("#prev").click();
        check(await page.locator("#month").textContent() === before, `${width}: previous month`);
        await page.locator("#calendar button:not(:disabled)").first().click();
        check((await page.locator("#arrive").inputValue()).length === 10, `${width}: calendar arrival`);
        await page.locator("[data-zone='4']").click();
        check((await page.locator("#zone-copy").textContent()).includes("140 metres"), `${width}: map zone detail`);
        await page.locator(".honest summary").nth(2).click();
        check((await page.locator(".honest details").nth(2).textContent()).includes("reception"), `${width}: signal disclosure`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "campground menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "campground menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
