import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("315-consulting-firm", async (page, check, width) =>
    {
        check(await page.locator(".case").count() === 6, `${width}: six engagements`);
        await page.locator("[data-industry='Healthcare']").click();
        check(await page.locator(".case").count() === 1, `${width}: industry work routing`);
        await page.locator(".case summary").click();
        check((await page.locator(".case p").textContent()).includes("clinical"), `${width}: engagement detail`);
        await page.locator("#work-filter").selectOption("Financial");
        check(await page.locator(".case").count() === 0 && (await page.locator("#work-count").textContent()).includes("No public"), `${width}: honest Financial empty state`);
        await page.locator("#work-filter").selectOption("All industries");
        check(await page.locator(".case").count() === 6, `${width}: reset engagement filter`);
        await page.locator("[data-insight='2']").click();
        check((await page.locator("#insight-copy").textContent()).includes("Realised price"), `${width}: substantive insight excerpt`);
        await page.locator("#discuss").click();
        check(!await page.locator("#insight-dialog").isVisible(), `${width}: insight to contact`);
        await page.locator("#contact-form > button").click();
        check((await page.locator("#contact-status").textContent()).includes("name and company"), `${width}: identity required`);
        await page.locator("#name").fill("Jordan Ellis");
        await page.locator("#company").fill("West Manufacturing");
        await page.locator("#email").fill("invalid");
        await page.locator("#contact-form > button").click();
        check((await page.locator("#contact-status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("jordan@example.com");
        await page.locator("#question").fill("Help");
        await page.locator("#contact-form > button").click();
        check((await page.locator("#contact-status").textContent()).includes("20 characters"), `${width}: substantive question required`);
        await page.locator("#question").fill("How should we integrate two manufacturing operations?");
        await page.locator("#contact-form > button").click();
        check((await page.locator("#brief-copy").textContent()).includes("West Manufacturing"), `${width}: contextual conversation brief`);
        check((await page.locator("#contact-status").textContent()).includes("Nothing sent"), `${width}: honest contact state`);
        await page.locator("#reset").click();
        check(await page.locator("#email").inputValue() === "" && !await page.locator("#brief").isVisible(), `${width}: clear private details`);
        await page.locator("[data-insight='0']").click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#insight-dialog").isVisible(), `${width}: keyboard dialog close`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "consulting mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
