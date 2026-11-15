import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("358-hair-salon-editorial", async (page, check, width) =>
    {
        check(await page.locator(".service").count() === 4 && await page.locator(".work:not(.clone)").count() === 8, `${width}: complete service and artwork collections`);
        check(await page.locator(".marquee").evaluate((el) => getComputedStyle(el).animationName === "none"), `${width}: reduced motion parks marquee`);
        await page.locator("#compare-range").focus();
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#compare-value").textContent() === "51%", `${width}: keyboard colour reveal`);
        await page.locator("#compare-range").fill("85");
        check(await page.locator("#comparison").evaluate((el) => el.style.getPropertyValue("--position") === "85%"), `${width}: slider changes actual clipping variable`);
        check((await page.locator(".after-layer").evaluate((el) => getComputedStyle(el).clipPath)).includes("15%"), `${width}: correct clip geometry`);
        await page.locator("#motion-toggle").click();
        check(await page.locator("#motion-toggle").getAttribute("aria-pressed") === "true" && await page.locator("body").evaluate((el) => el.classList.contains("paused")), `${width}: explicit motion pause state`);
        await page.locator(".work:not(.clone)[data-look='0']").click();
        check(await page.locator("#gallery-title").textContent() === "Honey balayage", `${width}: selected study detail`);
        await page.locator("#previous-look").click();
        check(await page.locator("#gallery-title").textContent() === "Lived-in highlights", `${width}: gallery previous wraps`);
        await page.locator("#next-look").click();
        check((await page.locator("#gallery-number").textContent()).includes("1 of 8"), `${width}: gallery next wraps`);
        await page.keyboard.press("Escape");
        await page.locator(".transformation [data-service='Colour']").click();
        check(await page.locator("[name='service']").inputValue() === "Colour" && (await page.locator("#request-note").textContent()).includes("£120"), `${width}: consultation service and price populated`);
        check((await page.locator("#request-note").textContent()).includes("patch-test"), `${width}: appropriate colour suitability notice`);
        await page.locator("#request-form button").click();
        check((await page.locator("#request-result").textContent()).includes("valid email"), `${width}: empty request rejected`);
        await page.locator("[name='name']").fill("Example Client");
        await page.locator("[name='email']").fill("person@example.test");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#request-form button").click();
        check((await page.locator("#request-result").textContent()).includes("future"), `${width}: past preference rejected`);
        await page.locator("[name='date']").fill("2030-07-14");
        await page.locator("#request-form button").click();
        check((await page.locator("#request-result").textContent()).includes("No request sent") && await page.locator("#email-draft").isVisible(), `${width}: Sunday-open truthful enquiry preview`);
        check(decodeURIComponent(await page.locator("#email-draft").getAttribute("href")).includes("Colour appointment enquiry"), `${width}: actual selected-service mailto draft`);
        await page.locator("[name='service']").selectOption("Bridal");
        check(!await page.locator("#email-draft").isVisible() && (await page.locator("#request-note").textContent()).includes("£200"), `${width}: service change invalidates draft and updates bridal scope`);
        await page.locator("[data-info='privacy']").click();
        check((await page.locator("#info-copy").textContent()).includes("browser memory"), `${width}: meaningful privacy dialog`);
        await page.keyboard.press("Escape");
        if (width < 768)
        {
            check(await page.locator(".testimonial-track").evaluate((el) => el.scrollWidth > el.clientWidth), `${width}: testimonial swipe container`);
            await page.locator("#menu-button").click();
            await page.locator("#mobile-menu a[href='#team']").click();
            check(!await page.locator("#mobile-menu").isVisible(), `${width}: mobile navigation`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: client details not persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: all dynamic layouts fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
