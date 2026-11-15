import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("387-mortgage-broker", async (page, check, width) =>
    {
        check(await page.locator("[data-service]").count() === 6, `${width}: all six situations`);
        check((await page.locator("#monthly").textContent()).includes("£1,334.00") && await page.locator("#ltv").textContent() === "80.0%", `${width}: known amortization example`);
        await page.locator("[data-service=Self-Employed]").click();
        check((await page.locator("#documents").textContent()).includes("tax calculation") && await page.locator("#situation").inputValue() === "Self-Employed", `${width}: specific document and outline handoff`);
        await page.locator("#rate").fill("0");
        await page.locator("#calc [type=submit]").click();
        check((await page.locator("#monthly").textContent()).includes("£800.00") && await page.locator("#interest").textContent() === "£0.00", `${width}: zero-rate formula`);
        await page.locator("#deposit").fill("300000");
        await page.locator("#calc [type=submit]").click();
        check(!await page.locator("#calculation").isVisible() && (await page.locator("#calc-error").textContent()).includes("less than"), `${width}: equal deposit error removes stale result`);
        await page.locator("#deposit").fill("-1");
        await page.locator("#calc [type=submit]").click();
        check((await page.locator("#calc-error").textContent()).includes("zero"), `${width}: negative deposit`);
        await page.locator("#deposit").fill("60000");
        await page.locator("#rate").fill("26");
        await page.locator("#calc [type=submit]").click();
        check((await page.locator("#calc-error").textContent()).includes("25%"), `${width}: rate bound`);
        await page.locator("#rate").fill("4.5");
        await page.locator("#years").fill("2.5");
        await page.locator("#calc [type=submit]").click();
        check((await page.locator("#calc-error").textContent()).includes("whole-number"), `${width}: fractional term rejected`);
        await page.locator("#price").fill("");
        await page.locator("#calc [type=submit]").click();
        check((await page.locator("#calc-error").textContent()).includes("every field"), `${width}: blank field rejected`);
        await page.locator("#calc [type=reset]").click();
        await page.waitForFunction(() => document.querySelector("#monthly").textContent.includes("1,334.00") && !document.querySelector("#calculation").hidden);
        check(await page.locator("#price").inputValue() === "300000", `${width}: reset recomputes defaults`);
        await page.locator("#outline [type=submit]").click();
        check((await page.locator("#outline-result").textContent()).includes("valid example email"), `${width}: empty contact`);
        await page.locator("[name=email]").fill("example@example.test");
        await page.locator("#outline [type=submit]").click();
        check((await page.locator("#outline-result").textContent()).includes("acknowledgement"), `${width}: explicit educational scope`);
        await page.locator("[name=ack]").check();
        await page.locator("#outline [type=submit]").click();
        check((await page.locator("#outline-result").textContent()).includes("Self-Employed") && (await page.locator("#outline-result").textContent()).includes("No enquiry sent"), `${width}: honest local outline`);
        await page.locator("#outline [type=reset]").click();
        check(await page.locator("[name=email]").inputValue() === "", `${width}: clear contact data`);
        await page.locator("#faq summary").nth(1).click();
        check((await page.locator("#faq details").nth(1).textContent()).includes("not eligibility"), `${width}: deposit FAQ limitation`);
        if (width < 760)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: responsive nav`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
