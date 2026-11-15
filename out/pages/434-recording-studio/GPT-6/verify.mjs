import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("434-recording-studio", async (page, check, width) =>
    {
        check(await page.locator(".gear li").count() === 15 && await page.locator(".session").count() === 4 && await page.locator(".rate").count() === 4, `${width}: complete studio index credits rates`);
        check(await page.locator(".reel").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).animationName === "none")), `${width}: reduced motion reels still`);
        await page.locator('[data-room="The Booth"]').click();
        check((await page.locator("#modal-body").textContent()).includes("180 GBP") && (await page.locator("#modal-body a").getAttribute("href")).startsWith("mailto:"), `${width}: room-specific details and contact`);
        await page.keyboard.press("Escape");
        await page.locator('[data-booking="Block booking enquiry"]').click();
        check(await page.locator('[name="length"]').inputValue() === "Block booking", `${width}: block path preselected`);
        await page.locator("#date-form button").click();
        check(!await page.locator("#email-date").isVisible(), `${width}: empty date rejected`);
        await page.locator('[name="date"]').fill("2020-01-01");
        await page.locator("#date-form button").click();
        check(!await page.locator("#email-date").isVisible(), `${width}: past date rejected`);
        await page.locator('[name="date"]').fill("2027-06-08");
        await page.locator('[name="service"]').selectOption("The Booth");
        await page.locator("#date-form button").click();
        check((await page.locator("#date-status").textContent()).includes("no booking is held"), `${width}: honest date enquiry`);
        check((await page.locator("#email-date").getAttribute("href")).includes("2027-06-08"), `${width}: chosen date email handoff`);
        await page.locator(".close").click();
        check(!await page.locator("dialog").isVisible(), `${width}: date dialog dismisses`);
        check((await page.locator("#today").textContent()).includes("SAMPLE HOURS"), `${width}: current-day hours labelled`);
        await page.emulateMedia({ reducedMotion: "no-preference" });
        check(await page.locator(".reel.left").evaluate((element) => getComputedStyle(element).animationDuration === "6s"), `${width}: six second reel speed`);
        check(await page.locator(".reel.right").evaluate((element) => getComputedStyle(element).animationDirection === "reverse"), `${width}: opposite reel direction`);
        await page.locator(".reel-wrap").hover();
        check(await page.locator(".reel.left").evaluate((element) => getComputedStyle(element).animationDuration === "3s"), `${width}: hover speed doubles`);
        await page.emulateMedia({ reducedMotion: "reduce" });
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: mobile menu opens`);
            await page.locator('header nav a[href="#gear"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile menu closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
