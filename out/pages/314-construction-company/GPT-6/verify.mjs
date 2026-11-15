import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("314-construction-company", async (page, check, width) =>
    {
        check(await page.locator(".project").count() === 6, `${width}: six selected studies`);
        await page.locator("[data-sector='Industrial']").click();
        check(await page.locator(".project").count() === 2, `${width}: industrial filter`);
        check(await page.locator("[data-sector='Industrial']").getAttribute("aria-pressed") === "true", `${width}: active sector`);
        await page.locator("#search").fill("Baxter");
        check(await page.locator(".project").count() === 1, `${width}: combined sector and search`);
        await page.locator(".project").click();
        check((await page.locator("#project-metrics").textContent()).includes("$31M"), `${width}: exact project metrics`);
        await page.locator("#similar").click();
        check(!await page.locator("#project-dialog").isVisible() && await page.locator("#sector").inputValue() === "Industrial", `${width}: contextual bid routing`);
        await page.locator("#search").fill("missing");
        check((await page.locator("#project-count").textContent()).includes("No matching"), `${width}: project empty state`);
        await page.locator("#search").fill("");
        await page.locator("[data-sector='Institutional']").click();
        check(await page.locator(".project").count() === 1, `${width}: institutional filter`);
        await page.locator(".project").click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#project-dialog").isVisible(), `${width}: Escape detail close`);
        await page.locator(".timeline summary").nth(5).click();
        check(await page.locator(".timeline details").nth(5).getAttribute("open") !== null, `${width}: warranty expansion`);
        await page.locator("#bid-form button").click();
        check((await page.locator("#bid-status").textContent()).includes("valid work email"), `${width}: bid email required`);
        await page.locator("#email").fill("owner@example.com");
        await page.locator("#scope").fill("Small");
        await page.locator("#bid-form button").click();
        check((await page.locator("#bid-status").textContent()).includes("20 characters"), `${width}: meaningful scope required`);
        await page.locator("#scope").fill("New industrial warehouse in Denver, target next year.");
        await page.locator("#bid-form button").click();
        check((await page.locator("#bid-status").textContent()).includes("budget range"), `${width}: budget selection required`);
        await page.locator("#budget").selectOption("$5M–$25M");
        await page.locator("#bid-form button").click();
        check((await page.locator("#bid-status").textContent()).includes("$5M–$25M"), `${width}: budget in prepared summary`);
        check((await page.locator("#bid-status").textContent()).includes("Nothing sent or uploaded"), `${width}: honest bid state`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "construction mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
