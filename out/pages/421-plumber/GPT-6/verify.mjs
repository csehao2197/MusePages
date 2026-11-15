import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("421-plumber", async (page, check, width) =>
    {
        check(await page.locator("[data-service]").count() === 6, `${width}: six plumbing services`);
        await page.locator('[data-service="Emergency Repairs"]').click();
        check(await page.locator("#urgency").inputValue() === "urgent", `${width}: emergency route`);
        await page.locator("#request .button").first().click();
        check((await page.locator("#result").textContent()).includes("cannot dispatch") && (await page.locator("#result").textContent()).includes("No request sent"), `${width}: urgent form never fake dispatches`);
        await page.locator('[data-service="Bathroom Fitting"]').click();
        check(await page.locator("#service").inputValue() === "Bathroom Fitting" && await page.locator("#urgency").inputValue() === "planned", `${width}: planned service handoff`);
        await page.locator("#request .button").first().click();
        check((await page.locator("#result").textContent()).includes("15 characters"), `${width}: empty description`);
        await page.locator("#description").fill("Replace a basin and inspect the existing pipework.");
        await page.locator("#email").fill("bad");
        await page.locator("#request .button").first().click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: invalid contact`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#request .button").first().click();
        check((await page.locator("#result").textContent()).includes("Nothing sent") && (await page.locator("#result").textContent()).includes("attendance charges"), `${width}: practical local outline`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#description").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: clear private inputs`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: call-out guidance opens`);
        await page.locator("summary").last().click();
        check((await page.locator("details").last().textContent()).includes("cannot dispatch"), `${width}: safety guidance no DIY hazards`);
        check(await page.locator('a[href="tel:5550123456"]').count() === 3, `${width}: working telephone handoffs`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
