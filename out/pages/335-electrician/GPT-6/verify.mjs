import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("335-electrician", async (page, check, width) =>
    {
        check(await page.locator(".panel-art img").evaluate((image) => image.naturalWidth > 0), `${width}: original circuit artwork loads`);
        check(await page.locator("[data-service]").count() === 6, `${width}: six service actions`);
        await page.locator("[data-service='ev']").click();
        check(await page.locator("[name='service']").inputValue() === "ev" && (await page.locator("#service-detail").textContent()).includes("$599"), `${width}: EV service reaches enquiry with relevant scope`);
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("15 characters"), `${width}: empty enquiry rejected`);
        await page.locator("[name='name']").fill("Example customer");
        await page.locator("[name='email']").fill("invalid");
        await page.locator("[name='details']").fill("Short");
        await page.locator("form button").click();
        check(await page.locator("[name='email']").getAttribute("aria-invalid") === "true" && await page.locator("textarea").getAttribute("aria-invalid") === "true", `${width}: malformed email and short detail rejected`);
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("textarea").fill("Assess an EV charging installation for an example office.");
        await page.locator("[value='Commercial']").check();
        await page.locator("form button").click();
        check(await page.locator("[name='consent']").getAttribute("aria-invalid") === "true", `${width}: explicit local-demo acknowledgement required`);
        await page.locator("[name='consent']").check();
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("Commercial") && (await page.locator("#result").textContent()).includes("Nothing has been sent"), `${width}: nonbinding commercial enquiry`);
        await page.locator("[data-service='lighting']").click();
        check((await page.locator("#service-detail").textContent()).includes("$149") && await page.locator("#result").textContent() === "", `${width}: service changes clear stale review`);
        await page.locator("[data-service='emergency']").click();
        check(await page.locator("#urgent-dialog").isVisible() && (await page.locator("#urgent-dialog").textContent()).includes("cannot dispatch"), `${width}: emergency routes to truthful guidance not reservation`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#urgent-dialog").isVisible(), `${width}: keyboard dismiss`);
        await page.locator("#urgent").click();
        await page.locator("#close-urgent").click();
        check(!await page.locator("#urgent-dialog").isVisible(), `${width}: hero urgent action and visible close`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null && await page.locator("details").count() === 7, `${width}: seven working FAQ rows`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile navigation opens");
            await page.locator("#menu").click();
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no persisted personal information`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
