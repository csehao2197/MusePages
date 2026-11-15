import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("441-school", async (page, check, width) =>
    {
        check(await page.locator(".date-row").count() === 5 && await page.locator(".quick > *").count() === 4, `${width}: full dates and quick links`);
        await page.locator("#date-filter").selectOption("future");
        const expected = await page.evaluate(() =>
        {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return ["2026-10-23", "2026-11-03", "2026-11-14", "2026-12-04", "2026-12-18"].filter((date) => new Date(`${date}T12:00:00`) >= today).length;
        });
        check(await page.locator(".date-row").count() === expected, `${width}: current date filter`);
        await page.locator("#date-filter").selectOption("all");
        check(await page.locator(".date-row").count() === 5, `${width}: dates reset`);
        await page.locator("#lunch-day").selectOption("Friday");
        check(await page.locator("#meal-name").textContent() === "Baked fish fingers", `${width}: day-specific meal`);
        await page.locator("#vegetarian").check();
        check(await page.locator("#meal-name").textContent() === "Vegetable fingers", `${width}: vegetarian option`);
        await page.locator(".hero [data-apply]").click();
        check((await page.locator("#modal-body").textContent()).includes("collects no pupil data"), `${width}: admissions guidance not application`);
        await page.locator("#admission-visit").click();
        await page.locator("#visit-form button").click();
        check(await page.locator("#visit-status").textContent() === "", `${width}: empty visit blocked`);
        await page.locator('dialog [type="checkbox"]').check();
        await page.locator('dialog [type="date"]').fill("2027-01-06");
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("Choose a Tuesday"), `${width}: invalid visit day`);
        await page.locator('dialog [type="date"]').fill("2027-01-05");
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("No visit has been booked"), `${width}: honest local visit plan`);
        await page.keyboard.press("Escape");
        await page.locator('[data-info="Report an absence"]').click();
        check((await page.locator("#modal-body").textContent()).includes("cannot report an absence"), `${width}: absence safety disclosure`);
        await page.locator(".close").click();
        await page.locator('[data-news="1"]').click();
        check((await page.locator("#modal-title").textContent()).includes("Harvest"), `${width}: news story opens`);
        await page.locator(".close").click();
        await page.locator("#all-news").click();
        check(await page.locator("#news-status").isVisible(), `${width}: all news status`);
        check(await page.locator("input").count() === 1 && await page.locator('[name="child"], [type="email"]').count() === 0, `${width}: no pupil/contact collection`);
        const minimum = await page.evaluate(() => Math.min(...[...document.querySelectorAll("body *")].filter((element) => [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent.trim())).map((element) => parseFloat(getComputedStyle(element).fontSize))));
        check(minimum >= 14, `${width}: minimum text size 14px`);
        if (width < 767)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#parents"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
