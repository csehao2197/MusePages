import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("426-property-management", async (page, check, width) =>
    {
        check(await page.locator(".paths a").count() === 2, `${width}: owner and tenant paths`);
        check(await page.locator(".service-list article").count() === 10 && await page.locator(".comparison-row").count() === 10, `${width}: services and comparison complete`);
        check(await page.locator(".areas li").count() === 12 && await page.locator("details").count() === 6, `${width}: coverage and FAQ complete`);
        check(await page.locator("#fee").textContent() === "$176", `${width}: initial single-home fee`);
        await page.locator("#units").fill("2");
        check(await page.locator("#fee").textContent() === "$330", `${width}: two-unit rate`);
        await page.locator("#units").fill("5");
        check(await page.locator("#fee").textContent() === "$770", `${width}: portfolio rate`);
        await page.locator("#units").fill("");
        check(await page.locator("#fee").textContent() === "—" && (await page.locator("#unit-error").textContent()).includes("whole number"), `${width}: empty input error`);
        await page.locator("#units").fill("1.5");
        check(await page.locator("#fee").textContent() === "—", `${width}: fractional units rejected`);
        await page.locator("#units").fill("1");
        await page.locator("#minus").click();
        check(await page.locator("#units").inputValue() === "1", `${width}: stepper lower bound`);
        await page.locator('#rent').fill("6000");
        check(await page.locator("#fee").textContent() === "$480", `${width}: rent slider updates`);
        await page.locator('[data-portal="Maintenance request"]').click();
        await page.locator("#maintenance button").click();
        check(await page.locator("#request-status").textContent() === "", `${width}: empty maintenance prevented`);
        await page.locator("#maintenance textarea").fill("Kitchen sink is leaking under the cabinet");
        await page.locator("#maintenance button").click();
        check((await page.locator("#request-status").textContent()).includes("not submitted or scheduled"), `${width}: honest local request`);
        await page.keyboard.press("Escape");
        await page.locator(".cta form button").click();
        check((await page.locator("#form-status").textContent()).includes("Local draft only"), `${width}: required property address`);
        await page.locator('[name="address"]').fill("123 Example Street, Austin");
        await page.locator(".cta form button").click();
        check((await page.locator("#form-status").textContent()).includes("not requested or produced"), `${width}: analysis draft not false valuation`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ opens`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu`);
            await page.locator('header nav a[href="#pricing"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile path closes menu`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
