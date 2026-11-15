import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("329-dog-trainer", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((img) => img.naturalWidth > 0), `${width}: original training art`);
        check(await page.locator(".program").count() === 3, `${width}: three programs`);
        await page.locator("#finder-form button").click();
        check((await page.locator("#finder-status").textContent()).includes("whole months"), `${width}: empty finder validation`);
        await page.locator("#finder-age").fill("3");
        await page.locator("#goal").selectOption("basics");
        await page.locator("#finder-form button").click();
        check((await page.locator("#finder-status").textContent()).includes("Puppy Foundation"), `${width}: puppy route`);
        await page.locator("#goal").selectOption("behaviour");
        await page.locator("#finder-form button").click();
        check((await page.locator("#finder-status").textContent()).includes("Behaviour & Rehab"), `${width}: complex behaviour overrides age`);
        await page.locator("#use-program").click();
        check(await page.locator("#program").inputValue() === "behaviour" && await page.locator("#age").inputValue() === "3", `${width}: finder to enquiry context`);
        await page.locator("#program").selectOption("adult");
        await page.locator("#format").selectOption("package");
        await page.locator("#distance").fill("35");
        check((await page.locator("#cost").textContent()).includes("£403.50"), `${width}: package and excess travel arithmetic`);
        await page.locator("#format").selectOption("assessment");
        check(await page.locator("#cost").textContent() === "£0.00", `${width}: intro call has no travel`);
        await page.locator("[data-stage='2']").click();
        check((await page.locator("#stage-copy").textContent()).startsWith("Practice"), `${width}: journey detail`);
        if (width === 1200)
        {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(150);
            const before = await page.locator("#journey-dog").getAttribute("style");
            await page.locator("#journey").scrollIntoViewIfNeeded();
            await page.waitForTimeout(150);
            check(before !== await page.locator("#journey-dog").getAttribute("style"), "desktop dog follows scroll progress");
        }
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: contact validation`);
        await page.locator("#name").fill("Sample Parent");
        await page.locator("#email").fill("parent@example.com");
        await page.locator("#dog").fill("Archie");
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("under 6 months"), `${width}: adult age boundary`);
        await page.locator("#age").fill("6");
        await page.locator("#program").selectOption("puppy");
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("under 6 months"), `${width}: puppy upper age boundary`);
        await page.locator("#program").selectOption("adult");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past assessment rejected`);
        await page.locator("#date").fill("2027-04-19");
        await page.locator("#message").fill("short");
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: useful goal required`);
        await page.locator("#message").fill("We would like to explore loose-lead walking and calm attention.");
        await page.locator("#assessment-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or booked"), `${width}: honest local assessment`);
        await page.locator("#distance").fill("-1");
        check((await page.locator("#cost").textContent()).includes("0 to 150"), `${width}: invalid distance state`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: training FAQ`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "trainer mobile nav");
            check(!await page.locator("#journey-dog").isVisible(), "mobile vertical timeline hides sliding dog");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
