import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("322-dermatology-clinic", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((img) => img.naturalWidth > 0), `${width}: clinic illustration decodes`);
        check(await page.locator(".treatment").count() === 6, `${width}: medical treatments`);
        await page.locator("[data-track='cosmetic']").click();
        check(await page.locator(".cosmetic .treatment").count() === 6, `${width}: cosmetic track replaces medical`);
        check((await page.locator(".treatment h3").first().textContent()).includes("Botulinum"), `${width}: distinct cosmetic content`);
        await page.locator(".treatment summary").first().click();
        check(await page.locator(".treatment details").first().getAttribute("open") !== null, `${width}: treatment preparation expands`);
        await page.locator("[data-treatment='0']").click();
        check(await page.locator("#topic").inputValue() === "Botulinum Toxin", `${width}: treatment to enquiry`);
        check(await page.locator("#visit-track").inputValue() === "cosmetic", `${width}: track carried to request`);
        await page.locator("#conditions button").filter({ hasText: /^Eczema$/ }).click();
        check(await page.locator("#topic").inputValue() === "Eczema" && await page.locator("#visit-track").inputValue() === "medical", `${width}: condition routes medical`);
        check(await page.locator("#conditions button").count() === 20, `${width}: complete condition topics`);
        await page.locator("[data-location='Bellevue']").click();
        check(await page.locator("#location").inputValue() === "Bellevue" && await page.locator("#pin span").textContent() === "Bellevue", `${width}: coordinated location/map`);
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact error`);
        await page.locator("#name").fill("Jordan Example");
        await page.locator("#email").fill("invalid");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: malformed contact error`);
        await page.locator("#email").fill("jordan@example.com");
        await page.locator("#topic").fill("");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("topic"), `${width}: topic required`);
        await page.locator("#cost-link").click();
        check((await page.locator("#topic").inputValue()).includes("Cost estimate"), `${width}: billing CTA prepares topic`);
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or booked"), `${width}: honest local preview`);
        await page.locator("#name").fill("Revised Name");
        check(await page.locator("#status").textContent() === "", `${width}: stale result cleared`);
        await page.locator(".narrow summary").first().click();
        check(await page.locator(".narrow details").first().getAttribute("open") !== null, `${width}: patient FAQ`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "mobile clinical nav");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "clinical nav dismisses");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
