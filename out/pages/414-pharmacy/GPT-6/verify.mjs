import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("414-pharmacy", async (page, check, width) =>
    {
        check(await page.locator(".routes > *").count() === 3 && await page.locator(".services button").count() === 8 && await page.locator("tbody tr").count() === 5, `${width}: complete service routes directory and clinics`);
        check((await page.locator("#status").textContent()).startsWith("Example hours"), `${width}: status framed as example schedule`);
        const status = async (date) => page.evaluate((value) => window.pharmacyStatus(new Date(value)), date);
        check((await status("2026-11-16T12:59:00Z")).open, `${width}: weekday morning open`);
        check(!(await status("2026-11-16T13:00:00Z")).open && (await status("2026-11-16T13:00:00Z")).text.includes("lunch"), `${width}: exact lunch closure`);
        check((await status("2026-11-16T13:30:00Z")).open && !(await status("2026-11-16T18:30:00Z")).open, `${width}: exact afternoon reopen and closing boundary`);
        check((await status("2026-11-14T13:00:00Z")).text.includes("Monday") && (await status("2026-11-15T10:00:00Z")).text.includes("Monday"), `${width}: Saturday closing and Sunday skip to Monday`);
        check((await status("2026-07-13T08:30:00Z")).open, `${width}: London daylight saving respected`);
        await page.locator("#ask").click();
        check((await page.locator("#detail-copy").textContent()).includes("NHS 111") && (await page.locator("#detail-copy").textContent()).includes("No confidential conversation"), `${width}: ask route directs to real help without collecting symptoms`);
        await page.keyboard.press("Escape");
        await page.locator('[data-service="3"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("does not measure"), `${width}: blood pressure info no diagnosis`);
        await page.locator("#close").click();
        await page.locator('[data-advice="inhaler"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("no single technique"), `${width}: inhaler info device-specific`);
        await page.locator("#close").click();
        await page.locator("#repeat-form .button").click();
        check((await page.locator("#repeat-result").textContent()).includes("Acknowledge"), `${width}: repeat no-order acknowledgement`);
        await page.locator("#method").selectOption("delivery");
        await page.locator("#repeat-form .button").click();
        check((await page.locator("#repeat-result").textContent()).includes("full example UK postcode"), `${width}: empty delivery postcode guard`);
        await page.locator("#postcode").fill("bad");
        await page.locator("#repeat-form .button").click();
        check((await page.locator("#repeat-result").textContent()).includes("full example UK postcode"), `${width}: invalid delivery postcode guard`);
        await page.locator("#postcode").fill("ct5 1aq");
        await page.locator("#repeat-ack").check();
        await page.locator("#repeat-form .button").click();
        check((await page.locator("#repeat-result").textContent()).includes("area match only") && (await page.locator("#repeat-result").textContent()).includes("No prescription ordered"), `${width}: sample coverage and honest prescription checklist`);
        await page.locator("#postcode").fill("EH1 1AA");
        await page.locator("#repeat-form .button").click();
        check((await page.locator("#repeat-result").textContent()).includes("outside the sample list"), `${width}: outside sample requires confirmation`);
        await page.locator("#repeat-form [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#postcode").inputValue() === "" && !await page.locator("#postcode-label").isVisible() && await page.locator("#repeat-result").textContent() === "", `${width}: repeat reset`);
        await page.locator('[data-clinic="travel"]').click();
        check(await page.locator("#clinic").inputValue() === "travel" && await page.locator("#travel-label").isVisible(), `${width}: clinic table handoff`);
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("future preferred"), `${width}: empty clinic date guard`);
        await page.locator("#clinic-date").fill("2020-01-01");
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("future preferred"), `${width}: past clinic date guard`);
        await page.locator("#clinic-date").fill("2030-07-01");
        await page.locator("#travel-date").fill("2030-06-30");
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("departure after"), `${width}: travel chronology guard`);
        await page.locator("#travel-date").fill("2030-07-10");
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("Acknowledge"), `${width}: clinic suitability acknowledgement`);
        await page.locator("#clinic-ack").check();
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("Less than six weeks") && (await page.locator("#clinic-result").textContent()).includes("Nothing sent or booked"), `${width}: short lead-time note without clinical guarantee`);
        await page.locator("#travel-date").fill("2030-09-01");
        await page.locator("#clinic-form .button").click();
        check((await page.locator("#clinic-result").textContent()).includes("At least six weeks"), `${width}: adequate example lead-time still needs assessment`);
        await page.locator("#clinic-form [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#clinic-date").inputValue() === "" && await page.locator("#clinic-result").textContent() === "" && !await page.locator("#travel-label").isVisible(), `${width}: clinic reset clears local data`);
        if (width < 767)
        {
            check(await page.locator(".mobile-repeat").isVisible(), `${width}: mobile repeat route`);
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile menu opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: mobile menu escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
