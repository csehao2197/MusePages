import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("398-notary", async (page, check, width) =>
    {
        check(await page.locator(".documents article").count() === 6 && await page.locator(".fee-table > div").count() === 7, `${width}: six services and fee rows`);
        await page.locator("#signatories").fill("0");
        await page.locator("#estimate button").first().click();
        check((await page.locator("#estimate-result").textContent()).includes("1–8"), `${width}: invalid signatory count`);
        await page.locator("#signatories").fill("3");
        await page.locator("#apostille").check();
        await page.locator("#visit").check();
        await page.locator("#estimate button").first().click();
        check((await page.locator("#estimate-result").textContent()).includes("from £320") && (await page.locator("#estimate-result").textContent()).includes("excluding VAT"), `${width}: transparent fee calculation`);
        await page.locator("#base").selectOption("75");
        check(await page.locator("#signatories").isDisabled(), `${width}: non-signature additional signatory excluded`);
        await page.locator("#estimate button").first().click();
        check((await page.locator("#estimate-result").textContent()).includes("from £220"), `${width}: copy fee without spurious signatory fee`);
        await page.locator("#estimate [type=reset]").click();
        check(!await page.locator("#signatories").isDisabled() && await page.locator("#estimate-result").textContent() === "", `${width}: calculator reset`);
        await page.locator("[data-document='Company documents']").click();
        check(await page.locator("#document-type").inputValue() === "Company documents", `${width}: service checklist handoff`);
        await page.locator("#checklist-form button").first().click();
        check((await page.locator("#checklist-result").textContent()).includes("Still to prepare") && (await page.locator("#checklist-result").textContent()).includes("signatory authority"), `${width}: missing requirements and document-specific note`);
        for (const id of ["original", "identity", "country"]) await page.locator(`#${id}`).check();
        await page.locator("#checklist-form button").first().click();
        check((await page.locator("#checklist-result").textContent()).includes("reviewed locally") && (await page.locator("#checklist-result").textContent()).includes("does not confirm"), `${width}: no false legal approval`);
        await page.locator("#checklist-form [type=reset]").click();
        check(!await page.locator("#original").isChecked() && await page.locator("#checklist-result").textContent() === "", `${width}: preparation reset`);
        await page.locator(".questions summary").first().click();
        check(await page.locator(".questions details").first().getAttribute("open") !== null, `${width}: FAQ opens`);
        check((await page.locator("a[href^='tel:']").getAttribute("href")) === "tel:+442079460381" && (await page.locator("a[href^='mailto:']").getAttribute("href")).includes("General%20appointment"), `${width}: phone and email handoff without booking system`);
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
