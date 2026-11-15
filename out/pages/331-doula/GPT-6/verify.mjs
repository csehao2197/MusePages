import { audit } from "./serial-run.mjs";
export async function verify()
{
    return audit("331-doula", async (page, check, width) =>
    {
        check(await page.locator(".portrait").evaluate((image) => image.naturalWidth > 0), `${width}: original portrait rendered`);
        check(await page.locator(".packages article").count() === 3, `${width}: three support packages`);
        await page.locator("[data-package='Postnatal support']").click();
        check(await page.locator("select").inputValue() === "Postnatal support", `${width}: package choice reaches enquiry`);
        await page.locator("form button").click();
        check(await page.locator("[name='name']").getAttribute("aria-invalid") === "true", `${width}: empty form rejected`);
        await page.locator("[name='name']").fill("   ");
        await page.locator("[name='email']").fill("not-an-email");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: whitespace and malformed email rejected`);
        await page.locator("[name='name']").fill("Example family");
        await page.locator("[name='email']").fill("family@example.test");
        await page.locator("[name='message']").fill("Please discuss postnatal support.");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("has not been sent"), `${width}: truthful local thank-you`);
        check(await page.locator("[name='email']").inputValue() === "", `${width}: personal details cleared`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ opens`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") === null, `${width}: FAQ closes`);
        check(await page.locator("details").count() === 5, `${width}: complete question set`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no persisted personal information`);
        if (width < 700)
        {
            check(await page.locator(".packages article").nth(1).evaluate((card) => getComputedStyle(card).order === "-1"), "mobile most chosen first");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
