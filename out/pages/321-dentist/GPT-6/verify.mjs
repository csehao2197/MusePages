import { audit } from "./serial-run.mjs";
export async function verify()
{
    return audit("321-dentist", async (page, check, width) =>
    {
        check(await page.locator(".hero-art").evaluate((image) => image.naturalWidth > 0), `${width}: original studio art decodes`);
        check(await page.locator(".service").count() === 6, `${width}: six services`);
        await page.locator("#service-filter").selectOption("cosmetic");
        check(await page.locator(".service").count() === 1, `${width}: cosmetic filter`);
        await page.locator(".service button").click();
        check(await page.locator("#care").inputValue() === "Tooth Whitening", `${width}: contextual care selection`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact rejected`);
        await page.locator("#name").fill("Alex Sample");
        await page.locator("#email").fill("bad");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: malformed email rejected`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#care").selectOption("");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("care option"), `${width}: care required`);
        await page.locator("#care").selectOption("Teeth Cleaning");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("#date").fill("2027-04-15");
        await page.locator("#enquiry button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or booked"), `${width}: honest local enquiry preview`);
        await page.locator("#name").fill("Updated Name");
        check(await page.locator("#status").textContent() === "", `${width}: stale result cleared`);
        await page.locator("[data-step='2']").click();
        check(await page.locator("[data-step='2']").getAttribute("aria-selected") === "true", `${width}: active journey semantics`);
        check((await page.locator("#step-copy").textContent()).includes("treatment"), `${width}: journey detail changes`);
        await page.locator("summary").nth(4).click();
        check(await page.locator("details").nth(4).getAttribute("open") !== null, `${width}: emergency FAQ expands`);
        await page.locator("#service-filter").selectOption("all");
        check(await page.locator(".service").count() === 6, `${width}: filter reset`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "mobile navigation closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
