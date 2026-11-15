import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("342-finance-advisor", async (page, check, width) =>
    {
        check(await page.locator(".hero-art img").evaluate((image) => image.naturalWidth > 0), `${width}: original advisory illustration loaded`);
        if (width < 800)
        {
            await page.locator("#menu-button").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile navigation opens`);
            await page.locator("nav a[href='#services']").click();
            check(await page.locator("#menu-button").getAttribute("aria-expanded") === "false", `${width}: mobile navigation closes after selection`);
        }
        await page.locator("[data-topic='Estate Planning']").click();
        check(await page.locator("[name='topic']").inputValue() === "Estate Planning", `${width}: service preselects enquiry`);
        await page.locator("#consultation button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("valid email"), `${width}: empty enquiry rejected`);
        await page.locator("[name='name']").fill("Example Visitor");
        await page.locator("[name='email']").fill("invalid");
        await page.locator("[name='message']").fill("I would like to discuss future planning.");
        await page.locator("#consultation button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("valid email"), `${width}: malformed email rejected`);
        await page.locator("[name='email']").fill("visitor@example.test");
        await page.locator("#consultation button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("acknowledge"), `${width}: local preview consent enforced`);
        await page.locator("[name='consent']").check();
        await page.locator("#consultation button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("Estate Planning") && (await page.locator("#enquiry-result").textContent()).includes("no appointment"), `${width}: truthful local consultation result`);
        await page.locator("#monthly").fill("250");
        await page.locator("#years").fill("20");
        await page.locator("#calculator button").click();
        check((await page.locator("#calculation").textContent()).includes("£60,000"), `${width}: contributions arithmetic exact`);
        await page.locator("#monthly").fill("0");
        await page.locator("#calculator button").click();
        check((await page.locator("#calculation").textContent()).includes("£0"), `${width}: zero contribution allowed`);
        await page.locator("#years").fill("0");
        await page.locator("#calculator button").click();
        check((await page.locator("#calculation").textContent()).includes("1 to 60"), `${width}: invalid duration rejected`);
        await page.locator("#monthly").fill("");
        await page.locator("#calculator button").click();
        check((await page.locator("#calculation").textContent()).includes("Enter"), `${width}: empty calculator rejected`);
        for (const article of ["retirement", "advice", "mistakes"])
        {
            await page.locator(`[data-article='${article}']`).click();
            check(await page.locator("#guide-body").textContent().then((text) => text.length > 200), `${width}: ${article} guide has useful full local content`);
            await page.keyboard.press("Escape");
        }
        check(!await page.locator("dialog").isVisible(), `${width}: guide keyboard dismissal`);
        check((await page.locator(".regulatory").textContent()).includes("No FCA authorisation"), `${width}: visible non-credential disclosure`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no personal data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
