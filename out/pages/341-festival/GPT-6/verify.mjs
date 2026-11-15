import { audit } from "./serial-run.mjs";
export async function verify()
{
    return audit("341-festival", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((image) => image.naturalWidth > 0), `${width}: original concert art loaded`);
        await page.locator("[data-day='sunday']").click();
        check(await page.locator("[data-lineup='saturday']").isHidden() && await page.locator("[data-lineup='sunday']").isVisible(), `${width}: Sunday filter`);
        await page.locator("[data-day='saturday']").click();
        check(await page.locator("[data-lineup='sunday']").isHidden(), `${width}: Saturday filter`);
        await page.locator("[data-day='all']").click();
        check(await page.locator("[data-lineup]:visible").count() === 2, `${width}: lineup restored`);
        await page.locator("[data-ticket='Day ticket']").click();
        check(await page.locator("#ticket-dialog").isVisible(), `${width}: ticket dialog opens`);
        await page.locator("form button").click();
        check((await page.locator("#ticket-result").textContent()).includes("acknowledge"), `${width}: acknowledgement required`);
        await page.locator("#quantity").fill("0");
        await page.locator("form button").click();
        check((await page.locator("#ticket-result").textContent()).includes("whole number"), `${width}: invalid quantity rejected`);
        await page.locator("#quantity").fill("3");
        check(await page.locator("#total").textContent() === "£177", `${width}: ticket arithmetic`);
        await page.locator("#ticket-day").selectOption("Sunday");
        await page.locator("#acknowledge").check();
        await page.locator("form button").click();
        check((await page.locator("#ticket-result").textContent()).includes("Sunday: £177"), `${width}: day selection reflected`);
        check((await page.locator("#ticket-result").textContent()).includes("No tickets reserved"), `${width}: truthful local result`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#ticket-dialog").isVisible(), `${width}: escape dismisses`);
        await page.locator("[data-ticket='Weekend ticket']").click();
        check(await page.locator("#ticket-day").isDisabled() && await page.locator("#total").textContent() === "£99", `${width}: weekend locks both days and resets total`);
        await page.locator(".close").click();
        await page.getByText("Is it accessible?", { exact: true }).click();
        check(await page.locator("details").nth(1).getAttribute("open") !== null, `${width}: accessibility disclosure opens`);
        await page.getByText("Is it accessible?", { exact: true }).click();
        check(await page.locator("details").nth(1).getAttribute("open") === null, `${width}: disclosure closes`);
        check(await page.locator("details").count() === 6, `${width}: six supplied questions`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interaction states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
