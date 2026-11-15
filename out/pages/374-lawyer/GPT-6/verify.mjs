import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("374-lawyer", async (page, check, width) =>
    {
        check(await page.locator("#specialisation-list details").count() === 6, `${width}: full boutique specialisation scope`);
        await page.locator("#specialisation-list summary").nth(2).click();
        await page.locator("[data-topic='2']").click();
        check(await page.locator("#topic").inputValue() === "Business Formation Law", `${width}: specialist-to-plan handoff`);
        await page.locator("[data-article='1']").click();
        check(await page.locator("#reader").isVisible() && (await page.locator("#reader-body").textContent()).includes("executors"), `${width}: actual estate reading content`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#reader").isVisible(), `${width}: reader keyboard close`);
        await page.locator("#checklist").click();
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "consultation-checklist.txt" && !await download.failure(), `${width}: real checklist download`);
        await page.locator("#close-reader").click();
        await page.locator("#plan [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("first name"), `${width}: empty planner guard`);
        await page.locator("[name='name']").fill("Example");
        await page.locator("[name='channel'][value='Video']").check();
        await page.locator("#plan [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Confirm"), `${width}: local-only acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#plan [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Business Formation Law, Video") && (await page.locator("#result").textContent()).includes("No request sent"), `${width}: meaningful local consultation plan`);
        await page.locator("[type='reset']").click();
        check(await page.locator("[name='name']").inputValue() === "", `${width}: input reset`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile menu closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
