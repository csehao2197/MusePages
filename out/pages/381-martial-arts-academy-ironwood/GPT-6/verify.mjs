import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("381-martial-arts-academy-ironwood", async (page, check, width) =>
    {
        check(await page.locator(".disciplines article").count() === 4 && await page.locator(".class-row").count() === 5, `${width}: full discipline scope and original Monday classes`);
        check(await page.locator("[data-class='Mon-4']").isDisabled(), `${width}: advanced not offered as trial`);
        await page.locator("#beginner").check();
        check(await page.locator(".class-row").count() === 4, `${width}: beginner excludes advanced`);
        await page.locator("[data-day='Sun']").click();
        check(await page.locator("#schedule-empty").isVisible() && (await page.locator("#schedule-empty").textContent()).includes("closed"), `${width}: Sunday closed state`);
        await page.locator("[data-day='Sat']").click();
        await page.locator("#schedule-discipline").selectOption("Boxing");
        check(await page.locator("#schedule-empty").isVisible() && await page.locator(".class-row").count() === 0, `${width}: real filtered empty state`);
        await page.locator("[data-discipline='Kids']").click();
        check(await page.locator(".class-row").count() === 2, `${width}: discipline-to-schedule handoff`);
        await page.locator("[data-class='Sat-1']").click();
        check(await page.locator("#trial-discipline").inputValue() === "Kids" && await page.locator("#trial-class").inputValue() === "Sat-1", `${width}: sample class handoff`);
        await page.locator("[data-plan='Family']").click();
        check(await page.locator("#trial-plan").inputValue() === "Family", `${width}: membership-interest handoff`);
        await page.locator("[data-belt='4']").click();
        check((await page.locator("#belt-detail").textContent()).includes("not an end point or a calendar promise"), `${width}: honest belt detail`);
        await page.locator("[data-coach='1']").click();
        check((await page.locator("#coach-copy").textContent()).includes("not verified or claimed"), `${width}: coach credential limitation`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#coach-dialog").isVisible(), `${width}: profile keyboard close`);
        await page.locator(".beginner-section summary").last().click();
        check((await page.locator(".beginner-section details").last().textContent()).includes("injury risk"), `${width}: honest training risk FAQ`);
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("valid example email"), `${width}: empty trial error`);
        await page.locator("[name='name']").fill("Example Guardian");
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("#age").fill("4");
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("5 to 99"), `${width}: out-of-range age error`);
        await page.locator("#age").fill("12");
        check(await page.locator("#trial-class option").count() === 4 && (await page.locator("#trial-class").textContent()).includes("10–14"), `${width}: age changes eligible class choices`);
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("age-appropriate"), `${width}: class selection required`);
        await page.locator("#trial-class").selectOption("Sat-2");
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("parent or guardian"), `${width}: minor guardian requirement`);
        await page.locator("[name='guardian']").check();
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("Confirm"), `${width}: local-only acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#trial-form [type='submit']").click();
        check((await page.locator("#trial-result").textContent()).includes("Sat 11:00 AM / Kids BJJ (10–14) / Family") && (await page.locator("#trial-result").textContent()).includes("No enquiry sent"), `${width}: correct local trial plan`);
        await page.locator("#age").fill("30");
        check(await page.locator("#trial-class option").count() === 1 && (await page.locator("#trial-class").textContent()).includes("No age-appropriate"), `${width}: adult cannot choose kids class`);
        await page.locator("[type='reset']").click();
        check(await page.locator("[name='name']").inputValue() === "", `${width}: clears local personal data`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
