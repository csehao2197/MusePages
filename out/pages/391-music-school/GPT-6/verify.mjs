import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("391-music-school", async (page, check, width) =>
    {
        check(await page.locator("[data-instrument]").count() === 6 && await page.locator("[data-age]").count() === 3 && await page.locator("[data-tutor]").count() === 3, `${width}: original lesson scope`);
        await page.locator("[data-instrument=Violin]").click();
        check(await page.locator("#instrument").inputValue() === "Violin" && (await page.locator("#tutor").textContent()).includes("Unassigned"), `${width}: honest instrument/tutor handoff`);
        await page.locator("[data-tutor='Tom Bradley']").click();
        check(await page.locator("#instrument").inputValue() === "Guitar" && await page.locator("#tutor").inputValue() === "Tom Bradley", `${width}: tutor-matched instrument`);
        await page.locator("[data-age='Young Musicians']").click();
        check(await page.locator("#curriculum").isVisible() && (await page.locator("#curriculum-copy").textContent()).includes("playful"), `${width}: young curriculum detail`);
        await page.locator("#choose-age").click();
        check(await page.locator("#age").inputValue() === "Young Musicians" && await page.locator("#guardian-label").isVisible(), `${width}: age/guardian handoff`);
        await page.locator("[data-age='Adult Learners']").click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#curriculum").isVisible(), `${width}: keyboard dialog close`);
        await page.locator("#minutes").selectOption("20");
        await page.locator("#days").selectOption("5");
        await page.locator("#practice-button").click();
        check((await page.locator("#practice-result").textContent()).includes("100 minutes") && (await page.locator("#practice-result").textContent()).includes("4 minutes settling in, 6 on one skill, and 10"), `${width}: practice arithmetic/split`);
        await page.locator("#trial-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("adult example email"), `${width}: empty contact`);
        await page.locator("[name=email]").fill("parent@example.test");
        await page.locator("#trial-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("adult must confirm"), `${width}: younger learner adult requirement`);
        await page.locator("[name=guardian]").check();
        await page.locator("#trial-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: local-only scope`);
        await page.locator("[name=ack]").check();
        await page.locator("#format").selectOption("Online");
        await page.locator("#trial-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("Guitar / Young Musicians / Tom Bradley / Online") && (await page.locator("#result").textContent()).includes("No enquiry sent"), `${width}: accurate local lesson summary`);
        await page.locator("#instrument").selectOption("Vocals");
        check(!(await page.locator("#tutor").textContent()).includes("Tom Bradley") && (await page.locator("#tutor").textContent()).includes("Aiko"), `${width}: stale incompatible tutor removed`);
        await page.locator("#age").selectOption("Adult Learners");
        check(!await page.locator("#guardian-label").isVisible(), `${width}: adult scope`);
        await page.locator("[type=reset]").click();
        await page.waitForFunction(() => document.querySelector("#result").textContent === "");
        check(await page.locator("[name=email]").inputValue() === "" && await page.locator("#age").inputValue() === "", `${width}: complete reset`);
        await page.locator("#trial-form [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("Choose an age group"), `${width}: age required`);
        await page.locator(".faq summary").first().click();
        check((await page.locator(".faq details").first().textContent()).includes("No ABRSM/Trinity affiliation"), `${width}: exam limitations`);
        if (width < 760)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
