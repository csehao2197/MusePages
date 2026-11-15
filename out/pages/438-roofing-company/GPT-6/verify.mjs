import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("438-roofing-company", async (page, check, width) =>
    {
        check(await page.locator(".services button").count() === 4 && await page.locator(".materials article").count() === 3, `${width}: full services/materials`);
        await page.locator('[data-service="Repairs & Maintenance"]').click();
        check(await page.locator('[name="service"]').inputValue() === "Repairs & Maintenance", `${width}: service-prefilled planner`);
        await page.locator("#quote-form button").click();
        check(await page.locator("#quote-status").textContent() === "", `${width}: empty form blocked`);
        await page.locator('[name="postcode"]').fill("invalid");
        await page.locator('[name="notes"]').fill("Replace slipped tiles and inspect the ridge.");
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-status").textContent()).includes("full UK postcode"), `${width}: invalid postcode error`);
        await page.locator('[name="postcode"]').fill("M1 1AA");
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-status").textContent()).includes("outside our sample"), `${width}: outside coverage state`);
        await page.locator('[name="postcode"]').fill("SW19 1AA");
        await page.locator("#quote-form button").click();
        check((await page.locator("#quote-status").textContent()).includes("No survey is booked"), `${width}: truthful local brief`);
        await page.keyboard.press("Escape");
        await page.locator('[data-material="Welsh Slate"]').click();
        check(await page.locator('[name="material"]').inputValue() === "Welsh Slate" && await page.locator('[name="postcode"]').inputValue() === "", `${width}: material selection fresh state`);
        await page.locator(".close").click();
        check(!await page.locator("dialog").isVisible(), `${width}: modal closes`);
        await page.locator("#emergency-help").click();
        check(await page.locator("#emergency-note").isVisible() && (await page.locator("#emergency-note").textContent()).includes("not a monitored"), `${width}: honest emergency information`);
        check((await page.locator(".trust").textContent()).includes("UNVERIFIED"), `${width}: credential disclosure`);
        check(await page.locator('[type="password"], [type="email"]').count() === 0, `${width}: no credentials/contact collection`);
        if (width < 750)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#materials"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
