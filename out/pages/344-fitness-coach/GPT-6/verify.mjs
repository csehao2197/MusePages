import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("344-fitness-coach", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original training art loaded`);
        await page.locator("#format").selectOption("online");
        check(await page.locator("[data-format]:visible").count() === 1 && await page.locator("[data-format='online']").isVisible(), `${width}: program format filter`);
        await page.locator("[data-plan='Online Coaching']").click();
        check(await page.locator("[name='plan']").inputValue() === "Online Coaching", `${width}: chosen program prefilled`);
        await page.locator("form button").click();
        check((await page.locator("#call-result").textContent()).includes("valid email"), `${width}: empty enquiry rejected`);
        await page.locator("[name='name']").fill("Example Athlete");
        await page.locator("[name='email']").fill("athlete@example.test");
        await page.locator("[name='goal']").fill("Build a consistent training routine.");
        await page.locator("form button").click();
        check((await page.locator("#call-result").textContent()).includes("acknowledge"), `${width}: consent required`);
        await page.locator("[name='consent']").check();
        await page.locator("form button").click();
        check((await page.locator("#call-result").textContent()).includes("Online Coaching") && (await page.locator("#call-result").textContent()).includes("no call booked"), `${width}: truthful program enquiry review`);
        await page.locator("#format").selectOption("all");
        check(await page.locator("[data-format]:visible").count() === 3, `${width}: program reset`);
        for (const [id, value] of [["lift", "12"], ["walk", "30"], ["habit", "3"]])
        {
            await page.locator(`#${id}`).fill("8");
            check(await page.locator(`#${id}-value`).textContent() === value && await page.locator(`#${id}-week`).textContent() === "8", `${width}: ${id} sample week updates value`);
            await page.locator(`#${id}`).fill("1");
        }
        await page.locator("#lift").focus();
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#lift-week").textContent() === "2", `${width}: progress slider keyboard accessible`);
        await page.getByText("Do I need to be experienced?", { exact: true }).click();
        check(await page.locator("details").nth(2).getAttribute("open") !== null, `${width}: beginner FAQ opens`);
        check(await page.locator("details").count() === 5, `${width}: complete FAQs`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no personal data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interactive states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
