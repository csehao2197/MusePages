import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("301-care-home", async (page, check, width) =>
    {
        await page.locator("#room-filter").selectOption("garden");
        check(await page.locator("[data-room]:visible").count() === 2, `${width}: garden room filter`);
        check((await page.locator("#room-count").textContent()).includes("2 room types"), `${width}: accessible result count`);
        check(decodeURIComponent(await page.locator("#room-email").getAttribute("href")).includes("Garden outlook"), `${width}: specific enquiry subject`);
        await page.locator("#room-filter").selectOption("ensuite");
        check(await page.locator("[data-room]:visible").count() === 1, `${width}: private wet room filter`);
        await page.locator("#room-filter").selectOption("all");
        check(await page.locator("[data-room]:visible").count() === 4, `${width}: reset rooms`);
        await page.locator("summary").last().click();
        check((await page.locator("details").last().textContent()).includes("no verified CQC"), `${width}: honest inspection information`);
        check(await page.locator("a[href^='tel:']").count() >= 3, `${width}: direct phone actions`);
        check(await page.locator("form").count() === 0, `${width}: contact-only privacy`);
        check((await page.locator("#time").textContent()).startsWith("13:00"), `${width}: reduced motion midday`);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.locator("#day").scrollIntoViewIfNeeded();
        await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
        check(/07:00|13:00|19:00/.test(await page.locator("#time").textContent()), `${width}: window scroll state`);
        if (width === 390)
        {
            check(await page.locator(".call-bar").isVisible(), "mobile persistent call action");
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "care mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "care menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
