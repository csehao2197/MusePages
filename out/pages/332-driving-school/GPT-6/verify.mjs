import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("332-driving-school", async (page, check, width) =>
    {
        check(await page.locator(".hero-image img").evaluate((image) => image.naturalWidth > 0), `${width}: original learner car loaded`);
        await page.locator("[data-course='intensive']").click();
        check((await page.locator("#estimate").textContent()).includes("£450"), `${width}: intensive estimate`);
        check(await page.locator("[name='block']").isDisabled(), `${width}: irrelevant blocks disabled`);
        await page.locator("[data-course='refresher']").click();
        check((await page.locator("#estimate").textContent()).includes("£120 for 3 hours"), `${width}: refresher minimum respected`);
        await page.locator("[data-course='beginner']").click();
        await page.locator("[name='block']").selectOption("10");
        check((await page.locator("#estimate").textContent()).includes("£320"), `${width}: ten-hour saving`);
        await page.locator("[data-instructor='Priya Sharma']").click();
        check(await page.locator("[name='instructor']").inputValue() === "Priya Sharma", `${width}: instructor reaches request`);
        await page.locator("form button").click();
        check((await page.locator("#booking-result").textContent()).includes("valid email"), `${width}: empty request rejected`);
        await page.locator("[name='name']").fill("Example learner");
        await page.locator("[name='email']").fill("learner@example.test");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("[name='postcode']").fill("SW1");
        await page.locator("form button").click();
        check(await page.locator("[name='date']").getAttribute("aria-invalid") === "true" && await page.locator("[name='postcode']").getAttribute("aria-invalid") === "true", `${width}: past date and out-of-area rejected`);
        await page.locator("[name='date']").fill("2027-12-01");
        await page.locator("[name='postcode']").fill("m20");
        await page.locator("form button").click();
        check((await page.locator("#booking-result").textContent()).includes("Priya Sharma") && (await page.locator("#booking-result").textContent()).includes("No lesson is reserved"), `${width}: truthful complete request review`);
        await page.locator("[data-answer='wrong']").click();
        check((await page.locator("#quiz-result").textContent()).includes("Not quite"), `${width}: incorrect theory answer`);
        await page.locator("[data-answer='right']").click();
        check((await page.locator("#quiz-result").textContent()).startsWith("Correct"), `${width}: correct theory answer`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ expands`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible() && await page.locator("#menu").getAttribute("aria-expanded") === "true", "mobile navigation expanded");
            await page.locator("#menu").click();
            check(!await page.locator("#nav").isVisible(), "mobile navigation collapsed");
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no persisted personal information`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
