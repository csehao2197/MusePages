import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("418-physiotherapist", async (page, check, width) =>
    {
        check(await page.locator("[data-condition]").count() === 6 && await page.locator(".service").count() === 3, `${width}: complete conditions and services`);
        await page.locator('[data-condition="Post-Surgical Rehab"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("surgeon") && (await page.locator("#detail-copy").textContent()).includes("cannot"), `${width}: surgery guidance avoids clearance`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#detail").isVisible(), `${width}: accessible modal escape`);
        await page.locator('[data-condition="Running Injuries"]').click();
        check((await page.locator("#detail-copy").textContent()).includes("does not diagnose"), `${width}: running information not diagnosis`);
        await page.locator("#detail-action").click();
        check(!await page.locator("#detail").isVisible(), `${width}: information to planner route`);
        await page.locator('[data-service="Introduction"]').click();
        check(await page.locator("#service").inputValue() === "Introduction", `${width}: free introduction handoff`);
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("future"), `${width}: empty date`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("future"), `${width}: past date`);
        await page.locator("#date").fill("2030-07-07");
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("Sundays"), `${width}: Sunday closure`);
        await page.locator("#date").fill("2030-07-08");
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("acknowledge"), `${width}: informed demo acknowledgement`);
        await page.locator("#ack").check();
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("No appointment booked"), `${width}: local outline no medical promise`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#date").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: clear local outline`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
