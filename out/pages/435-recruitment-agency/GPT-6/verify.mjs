import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("435-recruitment-agency", async (page, check, width) =>
    {
        check(await page.locator(".role").count() === 6 && await page.locator(".sectors button").count() === 3, `${width}: complete sectors and invented roles`);
        await page.locator('[data-sector="Finance & Operations"]').click();
        check(await page.locator(".role").count() === 2, `${width}: sector path filters roles`);
        await page.locator("#remote").check();
        check(await page.locator(".role").count() === 1 && (await page.locator(".role h3").textContent()).includes("Operations"), `${width}: combined remote sector filter`);
        await page.locator("#search").fill("no matching job");
        check(await page.locator("#empty").isVisible() && await page.locator("#role-count").textContent() === "0 sample roles", `${width}: empty search state`);
        await page.locator("#reset").click();
        check(await page.locator(".role").count() === 6 && await page.locator("#search").inputValue() === "" && !await page.locator("#remote").isChecked(), `${width}: all filters reset`);
        await page.locator("#search").fill("software");
        check(await page.locator(".role").count() === 1, `${width}: keyword search`);
        await page.locator("[data-role]").click();
        check((await page.locator("#modal-body").textContent()).includes("not accept applications"), `${width}: role disclosure`);
        await page.locator("#interest").click();
        check(await page.locator('[name="role"]').inputValue() === "Senior Software Engineer", `${width}: role-specific candidate draft`);
        await page.locator("#candidate-form button").click();
        check(await page.locator("#candidate-status").textContent() === "", `${width}: consent required`);
        await page.locator(".consent input").check();
        await page.locator("#candidate-form button").click();
        check((await page.locator("#candidate-status").textContent()).includes("not been registered"), `${width}: truthful candidate status`);
        await page.keyboard.press("Escape");
        await page.locator('.hero [data-open="company"]').click();
        await page.locator("#company-form button").click();
        check(await page.locator("#company-status").textContent() === "", `${width}: empty employer brief blocked`);
        await page.locator('#company-form [name="role"]').fill("Finance Director");
        await page.locator('[name="priorities"]').fill("Short");
        await page.locator("#company-form button").click();
        check(await page.locator("#company-status").textContent() === "", `${width}: short hiring brief blocked`);
        await page.locator('[name="priorities"]').fill("Lead finance and build a thoughtful planning function.");
        await page.locator("#company-form button").click();
        check((await page.locator("#company-status").textContent()).includes("No search, placement or fee agreement"), `${width}: honest employer draft`);
        await page.locator(".close").click();
        check(!await page.locator("dialog").isVisible(), `${width}: employer dialog closes`);
        check(await page.locator('[type="file"], [type="password"]').count() === 0, `${width}: no credentials or CV collection`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu opens`);
            await page.locator('header nav a[href="#candidates"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile menu closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
