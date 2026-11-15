import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("401-optician", async (page, check, width) =>
    {
        check(await page.locator(".frame-card").count() === 3, `${width}: all frame concepts`);
        await page.locator("[data-collection=Sports]").click();
        check(await page.locator("#no-frames").isVisible() && await page.locator(".frame-card").count() === 0, `${width}: honest missing sports inventory`);
        await page.locator("#reset-frames").click();
        check(await page.locator(".frame-card").count() === 3, `${width}: collection reset`);
        await page.locator(".frame-card [data-frame='1']").click();
        check(await page.locator("#explorer").isVisible() && (await page.locator("#frame-title").textContent()) === "The Camden", `${width}: selected frame explorer`);
        await page.locator("#finish").selectOption("130");
        check((await page.locator("#frame-art img").getAttribute("style")).includes("205deg"), `${width}: conceptual finish updates illustration`);
        await page.locator("#shortlist").click();
        check((await page.locator("#shortlist-result").textContent()).includes("No frame reserved"), `${width}: local shortlist without reservation`);
        await page.keyboard.press("Escape");
        await page.locator("#collection").selectOption("Shortlist");
        check(await page.locator(".frame-card").count() === 1 && (await page.locator(".frame-card").textContent()).includes("Camden"), `${width}: shortlist filter`);
        await page.locator(".frame-card button").click();
        await page.locator("#shortlist").click();
        await page.locator("#close-explorer").click();
        check(await page.locator("#no-frames").isVisible(), `${width}: remove shortlist and empty state`);
        await page.locator("#visit-form button").first().click();
        check((await page.locator("#visit-result").textContent()).includes("Choose a visit"), `${width}: empty visit validation`);
        await page.locator("#visit-type").selectOption("child");
        await page.locator("#session").selectOption("Saturday");
        await page.locator("#visit-form button").first().click();
        check((await page.locator("#visit-result").textContent()).includes("no free test assumed") && (await page.locator("#visit-result").textContent()).includes("No appointment"), `${width}: child eligibility boundary`);
        await page.locator("#visit-type").selectOption("lens");
        await page.locator("#visit-form button").first().click();
        check((await page.locator("#visit-result").textContent()).includes("£45"), `${width}: correct contact lens sample fee`);
        await page.locator("#visit-form [type=reset]").click();
        check(await page.locator("#visit-type").inputValue() === "" && await page.locator("#visit-result").textContent() === "", `${width}: visit reset`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
