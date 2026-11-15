import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("389-museum", async (page, check, width) =>
    {
        check(await page.locator(".exhibition").count() === 3 && await page.locator(".events tbody tr").count() === 5 && await page.locator("[data-object]").count() === 4, `${width}: complete original programme`);
        check(await page.locator("form").count() === 0, `${width}: no ticket booking form`);
        await page.locator(".green .ticket").click();
        check(new URL(page.url()).hash === "#admission" && (await page.locator("#admission").textContent()).includes("no real ticket provider"), `${width}: ticket information link`);
        await page.locator("[data-object='0']").click();
        check(await page.locator("#detail").isVisible() && (await page.locator("#detail-label").textContent()).includes("RM.1972.14"), `${width}: original accession and object dialog`);
        await page.locator("#close-detail").click();
        check(!await page.locator("#detail").isVisible(), `${width}: pointer dialog close`);
        await page.locator("[data-object='3']").click();
        check((await page.locator("#detail-title").textContent()).includes("Bentwood") && (await page.locator("#detail-copy").textContent()).includes("manufacturing"), `${width}: different catalogue story`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#detail").isVisible(), `${width}: native escape close`);
        await page.locator("[data-event='4']").click();
        check((await page.locator("#detail-label").textContent()).includes("ARCHIVE EXAMPLE") && (await page.locator("#detail-copy").textContent()).includes("confirmed directly"), `${width}: honest access-event detail`);
        await page.locator("#close-detail").click();
        await page.locator("[data-event='1']").click();
        check((await page.locator("#detail-copy").textContent()).includes("not available to book"), `${width}: archived ticket boundary`);
        await page.keyboard.press("Escape");
        await page.locator(".visit summary").first().click();
        check((await page.locator(".visit details").first().textContent()).includes("illustrative"), `${width}: access disclosure`);
        await page.locator("#membership .ticket").click();
        check(new URL(page.url()).hash === "#membership-info" && (await page.locator("#membership-info").textContent()).includes("No membership purchase"), `${width}: membership information link`);
        check(await page.locator(".programme-rule").count() === 6, `${width}: print programme hierarchy`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === "hidden"), `${width}: full-screen mobile overlay`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible() && await page.locator("#menu").getAttribute("aria-expanded") === "false", `${width}: escape restores navigation state`);
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: mobile link restores scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
