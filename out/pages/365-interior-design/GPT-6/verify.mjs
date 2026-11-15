import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("365-interior-design", async (page, check, width) =>
    {
        check(await page.locator(".project").count() === 6, `${width}: six design studies`);
        await page.locator("[data-filter='Hospitality']").click();
        check(await page.locator(".project").count() === 1 && (await page.locator(".project").textContent()).includes("Solaire"), `${width}: hospitality category`);
        await page.locator("#search").fill("Paris");
        check(await page.locator("#empty").isVisible(), `${width}: combined-filter empty state`);
        await page.locator("[data-filter='All']").click();
        check(await page.locator(".project").count() === 1, `${width}: location search`);
        await page.locator("#search").fill("");
        await page.locator(".project").first().click();
        check((await page.locator("#materials").textContent()).includes("Charcoal velvet"), `${width}: real project-specific palette`);
        await page.locator("#previous").click();
        check((await page.locator("#gallery-title").textContent()).includes("Dover"), `${width}: previous wraps`);
        await page.locator("#next").click();
        check((await page.locator("#gallery-count").textContent()).includes("1 / 6"), `${width}: next wraps`);
        await page.locator("#next").click();
        await page.locator("#plan").click();
        check((await page.locator("[name='message']").inputValue()).includes("Palazzo") && await page.locator("[name='type']").inputValue() === "Residential", `${width}: project enquiry handoff`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: enquiry validation`);
        await page.locator("[name='name']").fill("Example Client");
        await page.locator("[name='email']").fill("client@example.test");
        await page.locator("[name='budget']").selectOption("£150–500k");
        await page.locator("#enquiry button").click();
        check((await page.locator("#result").textContent()).includes("£150–500k") && (await page.locator("#result").textContent()).includes("Nothing sent"), `${width}: selected budget and honest local result`);
        await page.locator("#journal summary").first().click();
        check(await page.locator("#journal details").first().getAttribute("open") !== null, `${width}: journal article expands`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
