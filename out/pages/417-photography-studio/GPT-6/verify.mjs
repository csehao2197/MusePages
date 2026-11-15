import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("417-photography-studio", async (page, check, width) =>
    {
        check(await page.locator("#grid button").count() === 12, `${width}: twelve portfolio studies`);
        await page.locator("#grid button").first().click();
        check(await page.locator("#project").isVisible() && await page.locator("#position").textContent() === "1 / 12", `${width}: first project opens`);
        await page.locator("#previous").click();
        check(await page.locator("#position").textContent() === "12 / 12", `${width}: previous wraps`);
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#position").textContent() === "1 / 12", `${width}: keyboard next wraps`);
        await page.locator("#next").click();
        check(await page.locator("#project-title").textContent() === "Structure in motion", `${width}: next project title`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#project").isVisible(), `${width}: Escape closes modal`);
        await page.locator('[data-package="Full Day"]').click();
        check(await page.locator("#package").inputValue() === "Full Day", `${width}: package handoff`);
        await page.locator(".solid").click();
        check((await page.locator("#result").textContent()).includes("at least 12") && !await page.locator("#email").isVisible(), `${width}: empty draft guarded`);
        await page.locator("#brief").fill("short");
        await page.locator(".solid").click();
        check(!await page.locator("#email").isVisible(), `${width}: brief minimum length`);
        await page.locator("#brief").fill("Portraits for a new independent journal & launch.");
        await page.locator(".solid").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent or reserved"), `${width}: honest local draft`);
        check((await page.locator("#email").getAttribute("href")).includes("Full%20Day") && (await page.locator("#email").getAttribute("href")).includes("%26"), `${width}: encoded subject and body`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#brief").inputValue() === "" && !await page.locator("#email").isVisible(), `${width}: draft clear`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
