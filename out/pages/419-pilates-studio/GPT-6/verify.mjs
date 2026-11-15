import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("419-pilates-studio", async (page, check, width) =>
    {
        check(await page.locator("[role=tab]").count() === 7 && await page.locator(".class-row").count() === 2, `${width}: full week and Monday schedule`);
        await page.locator("#day-0").focus();
        await page.keyboard.press("End");
        check((await page.locator("#class-list").textContent()).includes("No example group classes"), `${width}: Sunday empty state`);
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#day-0").getAttribute("aria-selected") === "true", `${width}: keyboard wraps to Monday`);
        await page.locator("#day-1").click();
        check((await page.locator("#class-list").textContent()).includes("Example class full"), `${width}: full class state`);
        await page.locator(".class-row button").last().click();
        check((await page.locator("#result").textContent()).includes("full") && await page.locator("#kind").inputValue() === "Reformer Pilates", `${width}: full class no reservation`);
        await page.locator('[data-kind="1-2-1 Private"]').click();
        check(await page.locator("#kind").inputValue() === "1-2-1 Private", `${width}: private class handoff`);
        await page.locator('[data-plan="Unlimited"]').click();
        check(await page.locator("#plan").inputValue() === "Unlimited", `${width}: featured plan handoff`);
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("Choose your experience"), `${width}: empty experience guard`);
        await page.locator("#experience").selectOption("First time");
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("acknowledge"), `${width}: consent guard`);
        await page.locator("#ack").check();
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("orientation") && (await page.locator("#result").textContent()).includes("Nothing sent"), `${width}: beginner-specific honest result`);
        await page.locator("#experience").selectOption("Regular practice");
        await page.locator("#planner .button").click();
        check((await page.locator("#result").textContent()).includes("right level"), `${width}: experienced route`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#experience").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: outline clear`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
