import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("432-real-estate", async (page, check, width) =>
    {
        check(await page.locator(".listing").count() === 3 && (await page.locator("h1").textContent()).includes("Perfect"), `${width}: London specialist content`);
        await page.locator("#show-shortlist").click();
        check((await page.locator("#modal-body").textContent()).includes("shortlist is empty"), `${width}: empty shortlist`);
        await page.keyboard.press("Escape");
        await page.locator("[data-save]").first().click();
        check(await page.locator(".shortlist-count span").textContent() === "1", `${width}: add shortlist`);
        await page.locator("#show-shortlist").click();
        check((await page.locator("#modal-body").textContent()).includes("The Kensington Residence"), `${width}: shortlisted property`);
        await page.keyboard.press("Escape");
        await page.locator("[data-save]").first().click();
        check(await page.locator(".shortlist-count span").textContent() === "0", `${width}: remove shortlist`);
        await page.locator("[data-details]").nth(1).click();
        check((await page.locator("#modal-body").textContent()).includes("not been supplied"), `${width}: unknown details disclosed`);
        await page.locator("#discuss").click();
        check(await page.locator('[name="area"]').inputValue() === "Chelsea" && (await page.locator('[name="message"]').inputValue()).includes("Chelsea Mews"), `${width}: listing enquiry handoff`);
        await page.locator("#all-listings").click();
        check((await page.locator("#inventory").textContent()).includes("all 3"), `${width}: actual inventory boundary`);
        await page.locator("#valuation-open").click();
        check(await page.locator('[name="intent"]').inputValue() === "Arrange a valuation", `${width}: appraisal path preselection`);
        await page.locator("form .button").click();
        check(!await page.locator("#download").isVisible(), `${width}: empty contact blocked`);
        await page.locator('[name="name"]').fill("Sam London");
        await page.locator('[name="email"]').fill("invalid");
        await page.locator("form .button").click();
        check(!await page.locator("#download").isVisible(), `${width}: invalid email blocked`);
        await page.locator('[name="email"]').fill("sam@example.test");
        await page.locator("form .button").click();
        check((await page.locator("#form-status").textContent()).includes("No message, booking or valuation"), `${width}: honest enquiry draft`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "property-enquiry.txt" && await download.failure() === null, `${width}: actual local enquiry download`);
        if (width < 768)
        {
            await page.locator(".menu").click();
            check(await page.locator("header nav").isVisible(), `${width}: responsive menu`);
            await page.locator('header nav a[href="#about"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
