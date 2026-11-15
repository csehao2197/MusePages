import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("369-junk-removal", async (page, check, width) =>
    {
        check(await page.locator(".item").count() === 15 && await page.locator(".load").count() === 4, `${width}: complete acceptance and load bands`);
        check(await page.locator(".call").getAttribute("href") === "tel:08001182244", `${width}: actual phone CTA`);
        await page.locator("#search").fill("absent");
        check(await page.locator("#empty").isVisible(), `${width}: item empty state`);
        await page.locator("#search").fill("Asbestos");
        await page.locator(".item").click();
        check((await page.locator("#item-status").textContent()).includes("specialist") && (await page.locator("#selected").textContent()).includes("empty"), `${width}: hazardous waste not added`);
        await page.locator("#search").fill("");
        await page.locator("[data-item='Furniture']").click();
        await page.locator("[data-item='Garden waste']").click();
        check(await page.locator("#selected p").count() === 2, `${width}: accepted list selection`);
        await page.locator("[data-load='1']").click();
        check((await page.locator("#load-status").textContent()).includes("£165"), `${width}: stated half-load price`);
        await page.locator("#plan-form .button").click();
        check((await page.locator("#plan-result").textContent()).includes("describe access"), `${width}: incomplete checklist`);
        await page.locator("[name='area']").selectOption("Elsewhere");
        await page.locator("[name='access']").fill("Driveway parking, no stairs.");
        await page.locator("[name='safe']").check();
        await page.locator("#plan-form .button").click();
        check((await page.locator("#plan-result").textContent()).includes("Outside"), `${width}: out-of-area guard`);
        await page.locator("[name='area']").selectOption("Nottingham");
        await page.locator("#plan-form .button").click();
        check((await page.locator("#plan-result").textContent()).includes("No pickup booked") && !await page.locator("#download").isDisabled(), `${width}: local checklist success`);
        const pending = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await pending;
        const stream = await download.createReadStream();
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        const text = Buffer.concat(chunks).toString();
        check(download.suggestedFilename() === "haul-clear-out-checklist.txt" && text.includes("Furniture, Garden waste") && text.includes("NOT A BOOKING"), `${width}: real checklist download content`);
        await page.locator("#selected button").first().click();
        check(await page.locator("#download").isDisabled() && await page.locator("#selected p").count() === 1, `${width}: changes invalidate stale download`);
        await page.locator("#clear").click();
        check((await page.locator("#selected").textContent()).includes("empty") && await page.locator(".load[aria-pressed='true']").count() === 0, `${width}: full planner reset`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: truck meters and final states fit`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
