import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("399-nutritionist", async (page, check, width) =>
    {
        check(await page.locator(".programmes article").count() === 3 && await page.locator("blockquote").count() === 6 && await page.locator(".journal details").count() === 3, `${width}: complete programmes reflections journal`);
        await page.locator("#fit-form button").first().click();
        check((await page.locator("#fit-result").textContent()).includes("Choose a starting point"), `${width}: empty programme preference`);
        await page.locator("#goal").selectOption("ongoing");
        await page.locator("#fit-form button").first().click();
        check((await page.locator("#fit-result").textContent()).includes("graduates"), `${width}: graduate suitability guard`);
        await page.locator("#graduate").check();
        await page.locator("#fit-form button").first().click();
        check((await page.locator("#fit-result").textContent()).includes("£180") && (await page.locator("#fit-result").textContent()).includes("no enrolment"), `${width}: ongoing scenario without signup`);
        await page.locator("#goal").selectOption("depth");
        await page.locator("#fit-form button").first().click();
        check((await page.locator("#fit-result").textContent()).includes("3 × £280") && (await page.locator("#fit-result").textContent()).includes("Not a payment"), `${width}: transparent sample instalments`);
        await page.locator("#goal").selectOption("start");
        await page.locator("#fit-form button").first().click();
        check((await page.locator("#fit-result").textContent()).includes("4 weeks, from £320"), `${width}: short programme comparison`);
        await page.locator("#fit-form [type=reset]").click();
        check(await page.locator("#goal").inputValue() === "" && await page.locator("#fit-result").textContent() === "", `${width}: comparison reset`);
        await page.locator("[data-programme=Transform]").click();
        check(await page.locator("#programme").inputValue() === "Transform", `${width}: programme handoff`);
        await page.locator("#intro-form button").first().click();
        check((await page.locator("#intro-result").textContent()).includes("Choose a call focus"), `${width}: empty agenda guard`);
        await page.locator("#focus").selectOption("Fees and payment structure");
        await page.locator("#intro-form button").first().click();
        check((await page.locator("#intro-result").textContent()).includes("Transform / Fees") && (await page.locator("#intro-result").textContent()).includes("No call booked"), `${width}: useful honest agenda`);
        await page.locator("#intro-form [type=reset]").click();
        check(await page.locator("#intro-result").textContent() === "", `${width}: agenda reset`);
        await page.locator(".journal summary").first().click();
        check(await page.locator(".journal details").first().getAttribute("open") !== null, `${width}: journal note opens`);
        await page.locator(".faq summary").nth(3).click();
        check((await page.locator(".faq details").nth(3).textContent()).includes("not a substitute"), `${width}: medical referral boundary`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
