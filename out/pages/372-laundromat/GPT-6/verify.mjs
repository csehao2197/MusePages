import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("372-laundromat", async (page, check, width) =>
    {
        check(await page.locator(".machine").count() === 42, `${width}: complete 24 washer/18 dryer sample`);
        check(await page.locator(".machine.free").count() === 15, `${width}: free sample summary`);
        check(await page.locator(".machine.broken").count() === 2, `${width}: broken machines never free`);
        const before = await page.locator(".machine.busy").first().textContent();
        await page.waitForTimeout(1200);
        check(before !== await page.locator(".machine.busy").first().textContent(), `${width}: actual countdown tick`);
        await page.locator("[data-filter='dryer']").click();
        check(await page.locator(".machine").count() === 18, `${width}: dryer filtering`);
        await page.locator("#free-only").check();
        check(await page.locator(".machine").count() === 6, `${width}: only free dryer filtering`);
        await page.locator("[data-filter='washer']").click();
        check(await page.locator(".machine").count() === 9, `${width}: free washer filtering`);
        await page.locator("#estimate button").click();
        check((await page.locator("#result").textContent()).includes("Enter a weight"), `${width}: empty weight error`);
        await page.locator("#weight").fill("-1");
        await page.locator("#estimate button").click();
        check((await page.locator("#result").textContent()).includes("Enter a weight"), `${width}: negative weight error`);
        await page.locator("#weight").fill("3");
        await page.locator("#estimate button").click();
        check((await page.locator("#result").textContent()).includes("£14.40") && (await page.locator("#result").textContent()).includes("same day"), `${width}: minimum weight and early turnaround`);
        await page.locator("#weight").fill("10");
        await page.locator("#drop-time").fill("10:00");
        await page.locator("#estimate button").click();
        check((await page.locator("#result").textContent()).includes("£24.00") && (await page.locator("#result").textContent()).includes("next morning"), `${width}: exact cutoff`);
        await page.locator("#drop-time").fill("21:00");
        await page.locator("#estimate button").click();
        check((await page.locator("#result").textContent()).includes("attended"), `${width}: unattended drop-off guard`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") !== null, `${width}: house rules expand`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile menu closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
