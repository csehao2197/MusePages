import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("307-church", async (page, check, width) =>
    {
        check(await page.locator(".sermon").count() === 5, `${width}: complete reflection archive`);
        await page.locator("#search").fill("waiting");
        check(await page.locator(".sermon").count() === 1, `${width}: reflection search`);
        await page.locator(".sermon summary").click();
        check((await page.locator(".sermon p").textContent()).includes("attention"), `${width}: actual reflection expands`);
        await page.locator("#search").fill("no-such-topic");
        check(await page.locator("#empty").isVisible(), `${width}: empty archive`);
        await page.locator("#reset").click();
        check(await page.locator(".sermon").count() === 5, `${width}: archive reset`);
        await page.locator("#group-filter").selectOption("Saturday");
        check(await page.locator("[data-day]:visible").count() === 1, `${width}: gathering filter`);
        check((await page.locator("#group-count").textContent()).includes("1 gathering"), `${width}: result announcement`);
        await page.locator("#group-filter").selectOption("All gatherings");
        check(await page.locator("[data-day]:visible").count() === 6, `${width}: reset gatherings`);
        await page.locator("#give").click();
        check(await page.locator("#giving").isVisible(), `${width}: giving information dialog`);
        check((await page.locator("#giving").textContent()).includes("does not accept donations"), `${width}: no false donation action`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#giving").isVisible(), `${width}: giving escape`);
        await page.locator(".events summary").first().click();
        check((await page.locator(".events details").first().textContent()).includes("childcare"), `${width}: event details`);
        await page.locator("#people").fill("0");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("1–12"), `${width}: empty group size`);
        await page.locator("#people").fill("13");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("1–12"), `${width}: larger group guidance`);
        await page.locator("#people").fill("4");
        await page.locator("#service").selectOption("11:00 AM");
        await page.locator("#family").selectOption("Ask about kids’ activities");
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("10:30 AM for coffee"), `${width}: arrival calculation`);
        check((await page.locator("#status").textContent()).includes("Nothing sent or reserved"), `${width}: honest personal itinerary`);
        await page.locator("#coffee").uncheck();
        await page.locator("#visit-form button").click();
        check((await page.locator("#status").textContent()).includes("Arrive around 11:00 AM."), `${width}: no-coffee arrival`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "church mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
