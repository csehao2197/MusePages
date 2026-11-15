import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("400-online-course", async (page, check, width) =>
    {
        check(await page.locator(".course").count() === 6, `${width}: full six-course catalogue`);
        await page.locator("#category").selectOption("Marketing");
        check(await page.locator(".course").count() === 2, `${width}: category filter`);
        await page.locator("#search").fill("brand");
        check(await page.locator(".course").count() === 1, `${width}: intersecting title search`);
        await page.locator("#search").fill("missing");
        check(await page.locator("#empty").isVisible() && await page.locator(".course").count() === 0, `${width}: empty catalogue state`);
        await page.locator("#clear").click();
        check(await page.locator(".course").count() === 6, `${width}: filter reset`);
        await page.locator(".course [data-course='0']").click();
        check(await page.locator("#lesson").isVisible() && (await page.locator("#lesson-text").textContent()).includes("primary action"), `${width}: actual local first lesson`);
        check(await page.locator("#complete").isDisabled(), `${width}: completion locked before quiz`);
        await page.locator("#quiz button").click();
        check((await page.locator("#quiz-result").textContent()).includes("Choose an answer"), `${width}: empty quiz error`);
        await page.locator("[name=answer][value='0']").check();
        await page.locator("#quiz button").click();
        check((await page.locator("#quiz-result").textContent()).includes("Not quite") && await page.locator("#complete").isDisabled(), `${width}: incorrect answer feedback`);
        await page.locator("[name=answer][value='1']").check();
        await page.locator("#quiz button").click();
        check((await page.locator("#quiz-result").textContent()).includes("Correct") && !await page.locator("#complete").isDisabled(), `${width}: correct answer unlock`);
        await page.locator("#complete").click();
        check((await page.locator("#progress").textContent()).includes("1 of 6") && (await page.locator("#progress").textContent()).includes("not a certificate"), `${width}: honest lesson completion`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#lesson").isVisible() && (await page.locator("#count").textContent()).includes("1 demo lessons"), `${width}: close and local progress retained`);
        await page.locator(".course [data-course='2']").click();
        check((await page.locator("#lesson-title").textContent()).includes("Brand Strategy") && await page.locator("#complete").isDisabled(), `${width}: lesson-specific state reset`);
        await page.locator("#close-lesson").click();
        await page.locator("[data-plan=Annual]").click();
        check((await page.locator("#plan-result").textContent()).includes("£79 less") && (await page.locator("#plan-result").textContent()).includes("No purchase"), `${width}: annual comparison without checkout`);
        await page.locator("#next-prompt").click();
        check((await page.locator("#practice-title").textContent()).includes("brand promise"), `${width}: practice prompt rotation`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
