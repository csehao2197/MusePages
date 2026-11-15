import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("408-personal-chef", async (page, check, width) =>
    {
        check(await page.locator(".menus article").count() === 3 && await page.locator(".events button").count() === 4 && await page.locator(".gallery figure").count() === 5, `${width}: complete menus events gallery`);
        await page.locator('[data-menu="british"]').click();
        check(await page.locator("#menu-dialog").isVisible() && (await page.locator("#menu-copy").textContent()).includes("£65"), `${width}: correct menu details`);
        await page.locator("#preference").selectOption("plant");
        check((await page.locator("#menu-dishes").textContent()).includes("mushroom"), `${width}: plant-led sample changes`);
        await page.locator("#choose").click();
        check(await page.locator("#menu-choice").inputValue() === "british", `${width}: menu handoff`);
        await page.locator('[data-event="wedding"]').click();
        check(await page.locator("#occasion").inputValue() === "wedding", `${width}: event handoff`);
        await page.locator('#enquiry-form button[type=submit], #enquiry-form button:not([type])').first().click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: empty date rejected`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: past date rejected`);
        await page.locator("#date").fill("2030-07-12");
        await page.locator("#guests").fill("");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("2 to 200"), `${width}: empty guest count rejected`);
        await page.locator("#guests").fill("8.5");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("whole guest"), `${width}: fractional guest count rejected`);
        await page.locator("#guests").fill("8");
        await page.locator("#email").fill("bad");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: malformed email rejected`);
        await page.locator("#email").fill("host@example.com");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("Acknowledge"), `${width}: local preview consent`);
        await page.locator("#ack").check();
        await page.locator("#diet").fill("<b>No nuts</b>");
        await page.locator("#enquiry-form .button").click();
        check((await page.locator("#result").textContent()).includes("£520") && (await page.locator("#result").textContent()).includes("Nothing sent or booked"), `${width}: honest local draft with correct menu starting price`);
        check(await page.locator("#result b").count() === 0 && (await page.locator("#result").textContent()).includes("<b>No nuts</b>"), `${width}: dietary text rendered safely`);
        await page.locator("#enquiry-form [type=reset]").click();
        check(await page.locator("#email").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: reset clears local draft`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") !== null, `${width}: biography disclosure`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
