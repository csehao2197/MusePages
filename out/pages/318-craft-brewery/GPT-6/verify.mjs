import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("318-craft-brewery", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.complete && image.naturalWidth > 0), `${width}: original copper SVG decodes`);
        check(await page.locator(".beer").count() === 6, `${width}: six core beers`);
        await page.locator(".beer").first().focus();
        await page.keyboard.press("Enter");
        check(await page.locator(".beer").first().getAttribute("aria-pressed") === "true", `${width}: keyboard flip`);
        await page.keyboard.press("Space");
        check(await page.locator(".beer").first().getAttribute("aria-pressed") === "false", `${width}: keyboard flip back`);
        await page.locator("#style").selectOption("Dark");
        check(await page.locator(".beer").count() === 1 && (await page.locator(".beer").getAttribute("aria-label")).includes("28 IBU"), `${width}: porter and tasting statistics`);
        await page.locator("#search").fill("citrus");
        check((await page.locator("#beer-status").textContent()).includes("No matching"), `${width}: combined empty beer filter`);
        await page.locator("#style").selectOption("All styles");
        check(await page.locator(".beer").count() === 1, `${width}: flavour search`);
        await page.locator(".events summary").first().click();
        check((await page.locator(".events details").first().textContent()).includes("Historical example"), `${width}: honest past event detail`);
        await page.locator("#people").fill("13");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("1–12"), `${width}: tour capacity`);
        await page.locator("#people").fill("4");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("future"), `${width}: preferred date required`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("Mondays"), `${width}: closed-day enquiry`);
        await page.locator("#date").fill("2027-02-09");
        await page.locator("#email").fill("wrong");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("valid email"), `${width}: enquiry email`);
        await page.locator("#email").fill("guest@example.com");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("18 or over"), `${width}: adult confirmation`);
        await page.locator("#adult").check();
        await page.locator("#tour").selectOption("28");
        await page.locator("#tour-form button").click();
        check((await page.locator("#tour-status").textContent()).includes("£112"), `${width}: group price calculation`);
        check((await page.locator("#tour-status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest tour preview`);
        check((await page.locator("#bag-list").textContent()).includes("empty"), `${width}: empty bag`);
        await page.locator("[data-product='Mixed case']").click();
        await page.locator("#size").selectOption("3XL");
        await page.locator("[data-product='Hoodie']").click();
        check(await page.locator("#bag-total").textContent() === "£77" && (await page.locator("#bag-list").textContent()).includes("3XL"), `${width}: selected size and bag total`);
        await page.locator("#bag-list button").first().click();
        check(await page.locator("#bag-total").textContent() === "£45", `${width}: remove bag item`);
        await page.locator("#clear").click();
        check(await page.locator("#bag-total").textContent() === "£0", `${width}: clear bag`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "brewery mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
