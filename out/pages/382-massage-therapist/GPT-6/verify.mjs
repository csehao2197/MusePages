import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("382-massage-therapist", async (page, check, width) =>
    {
        check(await page.locator(".treatment-grid article").count() === 4, `${width}: four original treatments`);
        check(await page.locator(".steam i").count() === 12, `${width}: steam artwork`);
        await page.locator("[data-treatment='hotstone-90']").click();
        check(await page.locator("#treatment").inputValue() === "hotstone-90", `${width}: treatment handoff`);
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty error`);
        await page.locator("[name=name]").fill("Example Visitor");
        await page.locator("[name=email]").fill("bad");
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: invalid email`);
        await page.locator("[name=email]").fill("visitor@example.test");
        await page.locator("#treatment").selectOption("");
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("Choose a treatment"), `${width}: missing treatment`);
        await page.locator("#package").click();
        check(await page.locator("#package-note").isVisible() && await page.locator("#treatment").inputValue() === "swedish-60", `${width}: package plan, not purchase`);
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: missing date`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: past date`);
        await page.locator("#date").fill("2099-01-04");
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("closed"), `${width}: Sunday closed`);
        await page.locator("#date").fill("2099-01-06");
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: explicit local consent`);
        await page.locator("[name=ack]").check();
        await page.locator("#booking-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("Swedish — 60 min (£65)") && (await page.locator("#result").textContent()).includes("No request sent"), `${width}: truthful selected summary`);
        await page.locator("[type=reset]").click();
        check(await page.locator("[name=name]").inputValue() === "" && !await page.locator("#package-note").isVisible(), `${width}: clear private state`);
        await page.locator("summary").nth(1).click();
        check((await page.locator("details").nth(1).textContent()).includes("does not collect health"), `${width}: medical limitation FAQ`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile menu close`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
