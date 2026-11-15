import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("325-digital-agency", async (page, check, width) =>
    {
        check(await page.locator(".project-row").count() === 4, `${width}: four concept projects`);
        await page.locator("[data-filter='brand']").click();
        check(await page.locator(".project-row").count() === 2, `${width}: brand filter`);
        await page.locator("[data-filter='product']").click();
        check(await page.locator(".project-row").count() === 1, `${width}: product filter`);
        await page.locator(".project-row").click();
        check(await page.locator("#case-title").textContent() === "Zeno Health", `${width}: correct case content`);
        check((await page.locator("#case-content").textContent()).includes("clinical"), `${width}: health concept limitation`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: Escape case close`);
        await page.locator(".project-row").click();
        await page.locator("#case-brief").click();
        check((await page.locator("#ambition").inputValue()).includes("Zeno"), `${width}: case routes into brief`);
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact error`);
        await page.locator("#name").fill("Taylor Example");
        await page.locator("#email").fill("bad");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid contact error`);
        await page.locator("#email").fill("taylor@example.com");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("one discipline"), `${width}: discipline required`);
        await page.locator(".service input").nth(0).check();
        await page.locator(".service input").nth(2).check();
        check((await page.locator("#service-status").textContent()).includes("2 selected"), `${width}: multi-service selection`);
        check((await page.locator("#brief-services").textContent()).includes("Motion & Animation"), `${width}: summary synchronized`);
        await page.locator(".service input").nth(0).uncheck();
        check(!(await page.locator("#brief-services").textContent()).includes("Brand Identity"), `${width}: deselection synchronized`);
        await page.locator("#ambition").fill("short");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: short/unstaged brief rejected`);
        await page.locator("#ambition").fill("A cohesive motion language for a new independent brand.");
        await page.locator("#stage").selectOption("Launching something new");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing submitted or saved"), `${width}: honest local brief`);
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".project-row").count() === 4, `${width}: reset portfolio`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "agency mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
