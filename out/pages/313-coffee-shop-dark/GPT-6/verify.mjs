import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("313-coffee-shop-dark", async (page, check, width) =>
    {
        check(await page.locator(".menu-item").count() === 4, `${width}: espresso menu`);
        await page.locator("#tab-espresso").focus();
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#tab-pour").getAttribute("aria-selected") === "true", `${width}: keyboard tabs`);
        check(await page.locator(".menu-item").count() === 3, `${width}: pour-over items`);
        await page.locator("#tab-food").click();
        await page.locator("#search").fill("vegan");
        check(await page.locator(".menu-item").count() === 1, `${width}: vegan search`);
        await page.locator("#search").fill("zzzzz");
        check((await page.locator("#menu-panel").textContent()).includes("No matching"), `${width}: empty menu search`);
        await page.locator("#tab-cold").click();
        check(await page.locator(".menu-item").count() === 3, `${width}: category resets query`);
        await page.locator(".menu-item button").nth(1).click();
        check(await page.locator("#order-dialog").isVisible(), `${width}: contextual dialog`);
        check(await page.locator("#chosen").textContent() === "Cold Brew Tonic", `${width}: selected menu item`);
        await page.locator("#quantity").fill("2");
        check(await page.locator("#total").textContent() === "£9.20", `${width}: regular tonic quantity price`);
        await page.locator("#order-form button").click();
        check((await page.locator("#order-status").textContent()).includes("future"), `${width}: missing pickup date`);
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#time").fill("15:00");
        await page.locator("#order-form button").click();
        check((await page.locator("#order-status").textContent()).includes("09:00–14:30"), `${width}: Sunday last orders`);
        await page.locator("#time").fill("14:30");
        await page.locator("#order-form button").click();
        check((await page.locator("#order-status").textContent()).includes("Nothing ordered, paid or sent"), `${width}: honest pickup plan`);
        await page.locator("#quantity").fill("0");
        await page.locator("#order-form button").click();
        check((await page.locator("#order-status").textContent()).includes("1–10"), `${width}: invalid item count`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#order-dialog").isVisible(), `${width}: Escape closes modal`);
        await page.locator("[data-order='Cold Brew Tonic special']").click();
        check(await page.locator("#total").textContent() === "£4.20", `${width}: special price independent from regular`);
        await page.locator("#close").click();
        await page.locator("#story summary").click();
        check((await page.locator("#story details").textContent()).includes("harvest"), `${width}: expanded sourcing story`);
        if (width === 390)
        {
            await page.locator("#nav-toggle").click();
            check(await page.locator("#nav").isVisible(), "dark coffee mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
