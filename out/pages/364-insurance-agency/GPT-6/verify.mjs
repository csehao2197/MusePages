import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("364-insurance-agency", async (page, check, width) =>
    {
        check(await page.locator(".gap").count() === 4, `${width}: initial four discussion topics`);
        await page.locator("[data-policy='Flood']").click();
        check(await page.locator(".gap").count() === 3 && await page.locator("[data-policy='Flood']").getAttribute("aria-pressed") === "true", `${width}: policy toggles and state`);
        for (const topic of ["Life", "Umbrella", "Disability"]) await page.locator(`[data-policy='${topic}']`).click();
        check(await page.locator(".gap").count() === 0 && (await page.locator("#gaps").textContent()).includes("cannot confirm"), `${width}: all-selected is not a coverage guarantee`);
        await page.locator("#reset").click();
        check(await page.locator(".gap").count() === 4, `${width}: reset checker`);
        await page.locator("[data-policy='Home']").click();
        check(await page.locator(".gap").count() === 5 && (await page.locator("#gaps").textContent()).includes("rebuilding"), `${width}: missing home consequence`);
        check(await page.locator(".coverage-grid article").count() === 12, `${width}: all personal and business lines`);
        await page.locator("[data-detail='Cyber']").click();
        check((await page.locator("#detail-copy").textContent()).includes("breach"), `${width}: specific coverage detail`);
        await page.locator("#choose").click();
        check(await page.locator("#topic").inputValue() === "Business coverage", `${width}: business selection preserved`);
        await page.locator("#quote-form button").click();
        check((await page.locator("#form-result").textContent()).includes("valid email"), `${width}: empty form`);
        await page.locator("[name='name']").fill("Example Visitor");
        await page.locator("[name='email']").fill("visitor@example.test");
        await page.locator("#quote-form button").click();
        check((await page.locator("#form-result").textContent()).includes("Confirm"), `${width}: explicit education acknowledgement`);
        await page.locator("[name='consent']").check();
        await page.locator("#quote-form button").click();
        check((await page.locator("#form-result").textContent()).includes("Business coverage") && (await page.locator("#form-result").textContent()).includes("no coverage quoted, sold or bound"), `${width}: accurate local brief and limits`);
        check(await page.evaluate(() => localStorage.length === 0 && document.cookie === ""), `${width}: no personal-data persistence`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
