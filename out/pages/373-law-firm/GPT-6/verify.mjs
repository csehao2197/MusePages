import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("373-law-firm", async (page, check, width) =>
    {
        check(await page.locator(".area").count() === 6, `${width}: six disciplines`);
        await page.locator("[data-area='4']").click();
        check(await page.locator("#area-title").textContent() === "Estate Planning", `${width}: practice selection`);
        await page.locator("#area-choose").click();
        check(await page.locator("#area-select").inputValue() === "Estate Planning", `${width}: consultation handoff`);
        await page.locator("[data-person='1']").click();
        check(await page.locator("#profile").isVisible() && (await page.locator("#profile-copy").textContent()).includes("No board certification"), `${width}: honest profile modal`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#profile").isVisible(), `${width}: modal keyboard dismissal`);
        const quote = await page.locator("#quote").textContent();
        await page.locator("#next").click();
        check(quote !== await page.locator("#quote").textContent(), `${width}: next quote`);
        await page.locator("#prev").click();
        check(quote === await page.locator("#quote").textContent(), `${width}: previous quote`);
        check(await page.locator("#pause").getAttribute("aria-pressed") === "true", `${width}: reduced motion pauses auto advance`);
        await page.locator("#pause").click();
        check(await page.locator("#pause").getAttribute("aria-pressed") === "false", `${width}: rotation can resume`);
        await page.locator("#contact-form [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty intake guard`);
        await page.locator("[name='name']").fill("Example Client");
        await page.locator("[name='email']").fill("invalid");
        await page.locator("[name='message']").fill("Example estate planning question");
        await page.locator("#contact-form [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: malformed email guard`);
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("#contact-form [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Confirm"), `${width}: local-only acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#contact-form [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Estate Planning") && (await page.locator("#result").textContent()).includes("No request sent"), `${width}: honest local outline`);
        await page.locator("[type='reset']").click();
        check(await page.locator("[name='name']").inputValue() === "" && (await page.locator("#result").textContent()).includes("No request"), `${width}: clear private inputs`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav handoff`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
