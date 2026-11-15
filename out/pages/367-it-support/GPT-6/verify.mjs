import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("367-it-support", async (page, check, width) =>
    {
        check(await page.locator(".service").count() === 6 && await page.locator(".sla-row").count() === 4, `${width}: complete service and SLA scope`);
        await page.locator("#simulate").click();
        check((await page.locator("#ticket-state").textContent()).includes("classified"), `${width}: demo triage stage`);
        await page.locator("#simulate").click();
        check((await page.locator("#ticket-state").textContent()).includes("No real person"), `${width}: simulated assignment`);
        await page.locator("#simulate").click();
        check(await page.locator("#simulate").isDisabled() && (await page.locator("#ticket-state").textContent()).includes("No issue was fixed"), `${width}: no false resolution`);
        await page.locator("#reset-demo").click();
        check(!await page.locator("#simulate").isDisabled(), `${width}: demo reset`);
        await page.locator("#incident").selectOption("3");
        check((await page.locator("#ticket-priority").textContent()) === "P4" && (await page.locator("#incident-result").textContent()).includes("480m"), `${width}: priority maps to real example target`);
        await page.locator("#staff").fill("0");
        check((await page.locator("#price-error").textContent()).includes("15 to 200") && await page.locator("[data-plan='1']").isDisabled(), `${width}: invalid team size`);
        await page.locator("#staff").fill("40");
        check((await page.locator(".plan.featured .total").textContent()).includes("2,560"), `${width}: complete monthly arithmetic`);
        await page.locator("[data-plan='1']").click();
        check(await page.locator("#contact-staff").inputValue() === "40" && await page.locator("[name='plan']").inputValue() === "Complete", `${width}: quote handoff`);
        await page.locator("#contact-form button").click();
        check((await page.locator("#contact-result").textContent()).includes("valid email"), `${width}: incomplete discovery form`);
        await page.locator("[name='company']").fill("Example Team");
        await page.locator("[name='name']").fill("Example Owner");
        await page.locator("[name='email']").fill("owner@example.test");
        await page.locator("[name='message']").fill("We need help with office Wi-Fi.");
        await page.locator("#contact-form button").click();
        check((await page.locator("#contact-result").textContent()).includes("40 staff") && (await page.locator("#contact-result").textContent()).includes("No call booked"), `${width}: local discovery summary`);
        await page.locator("#portal").click();
        await page.locator("#support-form button").click();
        check((await page.locator("#support-result").textContent()).includes("10 characters"), `${width}: support summary validation`);
        await page.locator("[name='impact']").selectOption("Department blocked");
        await page.locator("[name='summary']").fill("Finance cannot open shared files");
        await page.locator("#support-form button").click();
        check((await page.locator("#support-result").textContent()).includes("P2") && (await page.locator("#support-result").textContent()).includes("30 minutes"), `${width}: ticket triage selection`);
        await page.keyboard.press("Escape");
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
