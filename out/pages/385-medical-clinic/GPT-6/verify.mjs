import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("385-medical-clinic", async (page, check, width) =>
    {
        check(await page.locator(".service-grid article").count() === 8 && await page.locator("tbody tr").count() === 7, `${width}: original care scope/fees`);
        check(!(await page.locator(".availability").textContent()).includes("left today"), `${width}: no false live scarcity`);
        await page.locator("[data-slot=extended]").click();
        check((await page.locator("#slot-detail").textContent()).includes("45 minutes · £150") && await page.locator("#appointment").inputValue() === "extended", `${width}: comparison and planner sync`);
        await page.locator("[data-filter=tests]").click();
        check(await page.locator(".service-grid article:visible").count() === 4, `${width}: preventive filter`);
        await page.locator("[data-filter=consult]").click();
        check(await page.locator(".service-grid article:visible").count() === 4, `${width}: consultation filter`);
        await page.locator("[data-filter=all]").click();
        check(await page.locator(".service-grid article:visible").count() === 8, `${width}: filter reset`);
        await page.locator("[data-doctor='Priya Nair']").click();
        check(await page.locator("#profile").isVisible() && (await page.locator("#profile").textContent()).includes("No verified"), `${width}: honest clinician dialog`);
        await page.locator("#choose-doctor").click();
        check(await page.locator("#doctor").inputValue() === "Priya Nair", `${width}: profile preference handoff`);
        await page.locator("[data-doctor='Helen Fielding']").click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#profile").isVisible(), `${width}: keyboard dialog dismissal`);
        await page.locator("#panel").selectOption("5");
        check((await page.locator("#panel-result").textContent()).includes("3–5 working days") && (await page.locator("#panel-result").textContent()).includes("Not a result"), `${width}: honest laboratory range`);
        await page.locator("#membership summary").last().click();
        check((await page.locator("#membership details").last().textContent()).includes("three children"), `${width}: family coverage details`);
        await page.locator("#plan [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty planner`);
        await page.locator("[name=email]").fill("not-an-email");
        await page.locator("#plan [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: invalid email`);
        await page.locator("[name=email]").fill("visitor@example.test");
        await page.locator("#plan [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: local-only consent`);
        await page.locator("[name=ack]").check();
        await page.locator("#plan [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("£150") && (await page.locator("#result").textContent()).includes("Priya Nair") && (await page.locator("#result").textContent()).includes("No appointment booked"), `${width}: actual selected summary/no booking`);
        await page.locator("[type=reset]").click();
        check(await page.locator("[name=email]").inputValue() === "", `${width}: privacy clear`);
        await page.locator("#faq summary").last().click();
        check((await page.locator("#faq details").last().textContent()).includes("999"), `${width}: emergency signposting`);
        if (width < 760)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
