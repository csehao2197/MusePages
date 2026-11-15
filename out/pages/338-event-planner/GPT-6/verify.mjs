import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("338-event-planner", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original ballroom visual loads`);
        check(await page.locator(".event:visible").count() === 6, `${width}: six initial concepts`);
        await page.locator("[data-filter='wedding']").click();
        check(await page.locator(".event:visible").count() === 2, `${width}: wedding filter`);
        await page.locator("#search").fill("no-such-event");
        check(await page.locator("#empty").isVisible() && (await page.locator("#count").textContent()).startsWith("0"), `${width}: empty search state`);
        await page.locator("#reset-filters").click();
        check(await page.locator(".event:visible").count() === 6, `${width}: full collection reset`);
        await page.locator("#search").fill("light");
        check(await page.locator(".event:visible").count() === 3, `${width}: searchable title and concept description`);
        await page.locator("#search").fill("");
        await page.locator(".event[data-title='Under the same sky']").click();
        check(await page.locator("#event-dialog").isVisible() && (await page.locator("#event-description").textContent()).includes("120 guests"), `${width}: event-specific detail`);
        await page.locator("#plan-similar").click();
        check(await page.locator("[name='type']").inputValue() === "Wedding" && (await page.locator("textarea").inputValue()).includes("Under the same sky"), `${width}: concept routes relevant enquiry`);
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty planning enquiry rejected`);
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("[name='guests']").fill("1");
        await page.locator("[name='name']").fill("Example planner");
        await page.locator("[name='email']").fill("planner@example.test");
        await page.locator("form button").click();
        check(await page.locator("[name='date']").getAttribute("aria-invalid") === "true" && await page.locator("[name='guests']").getAttribute("aria-invalid") === "true", `${width}: past date and undersized party rejected`);
        await page.locator("[name='date']").fill("2027-12-01");
        await page.locator("[name='guests']").fill("120");
        await page.locator("[name='budget']").selectOption("£25,000 to £50,000");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("120 guests") && (await page.locator("#result").textContent()).includes("No date held"), `${width}: complete nonbinding event review`);
        await page.locator("[data-service='Brand experience']").click();
        check(await page.locator("[name='type']").inputValue() === "Brand experience" && await page.locator("#result").textContent() === "", `${width}: service strip routes choice without stale review`);
        await page.locator(".event").first().click();
        await page.keyboard.press("Escape");
        check(!await page.locator("#event-dialog").isVisible(), `${width}: keyboard dialog dismissal`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile menu opens");
            await page.locator("#menu").click();
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
