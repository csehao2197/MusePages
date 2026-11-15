import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("392-music-store", async (page, check, width) =>
    {
        check(await page.locator(".gear-card").count() === 12 && await page.locator(".job-row").count() === 10 && await page.locator(".lessons article").count() === 3, `${width}: complete inventory/workshop/lesson scope`);
        if (width < 767)
        {
            await page.locator("#filter-toggle").click();
            check(await page.locator("#filters").isVisible(), `${width}: mobile filter panel`);
        }
        await page.locator("[data-type=Electric]").click();
        check(await page.locator(".gear-card").count() === 4, `${width}: electric filter`);
        await page.locator("#decade").selectOption("2000s+");
        check(await page.locator(".gear-card").count() === 3, `${width}: decade intersection`);
        await page.locator("#condition").selectOption("Excellent");
        check(await page.locator(".gear-card").count() === 1 && (await page.locator("#gear-grid").textContent()).includes("Telecaster"), `${width}: condition intersection`);
        await page.locator("#max-price").fill("850");
        await page.locator("#max-price").dispatchEvent("input");
        check(await page.locator(".gear-card").count() === 0 && (await page.locator(".empty").textContent()).includes("No sample gear"), `${width}: price-filter empty state`);
        await page.locator("#reset-filters").click();
        check(await page.locator(".gear-card").count() === 12, `${width}: full filter reset`);
        await page.locator("[data-gear='11']").click();
        check(await page.locator("#gear-interest").isDisabled() && (await page.locator("#detail-meta").textContent()).includes("SOLD"), `${width}: sold entry cannot create interest`);
        await page.keyboard.press("Escape");
        await page.locator("[data-gear='0']").click();
        await page.locator("#gear-interest").click();
        check((await page.locator("#interest-result").textContent()).includes("£2,850") && (await page.locator("#interest-result").textContent()).includes("No enquiry sent"), `${width}: correct local interest without hold`);
        await page.locator("#close-detail").click();
        await page.locator("#available").check();
        check(await page.locator(".gear-card").count() === 11 && await page.locator(".sold-badge").count() === 0, `${width}: hide sold`);
        await page.locator("[data-type=Effects]").click();
        check(await page.locator(".gear-card").count() === 0, `${width}: honest no effects inventory`);
        await page.locator("[data-job='5']").click();
        check(await page.locator("#job").inputValue() === "5", `${width}: workshop job handoff`);
        await page.locator("#setup-form [type=submit]").click();
        check((await page.locator("#setup-result").textContent()).includes("example instrument"), `${width}: empty repair note`);
        await page.locator("[name=instrument]").fill("Example Tele");
        await page.locator("[name=issue]").fill("buzz");
        await page.locator("#setup-form [type=submit]").click();
        check((await page.locator("#setup-result").textContent()).includes("10 characters"), `${width}: meaningful issue required`);
        await page.locator("[name=issue]").fill("Intermittent crackle from the output jack.");
        await page.locator("#setup-form [type=submit]").click();
        check((await page.locator("#setup-result").textContent()).includes("acknowledgement"), `${width}: local note consent`);
        await page.locator("#setup-form [name=ack]").check();
        await page.locator("#setup-form [type=submit]").click();
        check((await page.locator("#setup-result").textContent()).includes("Electronics rewire / sample £95, 1 week") && (await page.locator("#setup-result").textContent()).includes("No enquiry sent"), `${width}: truthful selected repair summary`);
        await page.locator("#setup-form [type=reset]").click();
        check(await page.locator("[name=instrument]").inputValue() === "", `${width}: clear repair data`);
        await page.locator("#trade [type=submit]").click();
        check((await page.locator("#trade-result").textContent()).includes("greater than £0"), `${width}: empty trade value`);
        await page.locator("#trade-category").selectOption("Digital modelling amp");
        await page.locator("#trade [type=submit]").click();
        check((await page.locator("#trade-result").textContent()).includes("outside the sample"), `${width}: excluded trade category`);
        await page.locator("#trade-category").selectOption("Guitar");
        await page.locator("#neck").check();
        await page.locator("#trade [type=submit]").click();
        check((await page.locator("#trade-result").textContent()).includes("specialist inspection"), `${width}: structural condition exclusion`);
        await page.locator("#neck").uncheck();
        await page.locator("#retail").fill("1000");
        await page.locator("#trade [type=submit]").click();
        check((await page.locator("#trade-result").textContent()).includes("£600") && (await page.locator("#trade-result").textContent()).includes("Not an offer"), `${width}: honest 60 percent example`);
        await page.locator("#trade [type=reset]").click();
        check(await page.locator("#trade-result").textContent() === "" && await page.locator("#retail").inputValue() === "", `${width}: clear trade data`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: full-screen mobile nav`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores scroll`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
