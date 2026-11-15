import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("380-manufacturing", async (page, check, width) =>
    {
        const matrix = width < 768 ? "#matrix-mobile" : "#matrix-desktop";
        if (width < 768) await page.locator("#matrix-mobile summary").nth(2).click();
        await page.locator(`${matrix} [data-r='2'][data-c='5']`).click();
        check((await page.locator("#capability-detail").textContent()).includes("No tolerance is offered"), `${width}: unsupported material state`);
        await page.locator(`${matrix} [data-r='2'][data-c='2']`).click();
        check((await page.locator("#capability-detail").textContent()).includes("±0.003mm"), `${width}: sample EDM detail`);
        await page.locator(`${matrix} [data-r='2'][data-c='3']`).click();
        check((await page.locator("#capability-detail").textContent()).includes("On request"), `${width}: on-request capability`);
        check(await page.locator(".equipment tbody tr").count() === 14, `${width}: all machine entries`);
        await page.locator("#machine-search").fill("Hermle");
        check(await page.locator(".equipment tbody tr").count() === 2, `${width}: equipment search`);
        await page.locator("#machine-search").fill("no-such-machine");
        check(await page.locator("#machine-empty").isVisible() && await page.locator(".equipment tbody tr").count() === 0, `${width}: real empty search state`);
        await page.locator("#machine-search").fill("");
        await page.locator(".quality summary").first().click();
        check((await page.locator(".quality details").first().textContent()).includes("fictional brief content only"), `${width}: certification honesty`);
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty RFQ error`);
        for (const [name, value] of Object.entries({ company: "Example Engineering", contact: "Example Engineer", part: "Test bracket / Rev A", email: "engineer@example.test", quantity: "1.5", date: "2099-06-01" })) await page.locator(`[name='${name}']`).fill(value);
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("whole number"), `${width}: integer quantity guard`);
        await page.locator("[name='quantity']").fill("25");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("future required date"), `${width}: date guard`);
        await page.locator("[name='date']").fill("2099-06-01");
        await page.locator("[name='drawing']").setInputFiles({ name: "test.exe", mimeType: "application/octet-stream", buffer: Buffer.from("harmless") });
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("nonempty STEP"), `${width}: unsupported file guard`);
        await page.locator("[name='drawing']").setInputFiles({ name: "example.step", mimeType: "text/plain", buffer: Buffer.from("harmless example, not a CAD drawing") });
        check((await page.locator("#file-note").textContent()).includes("Metadata only"), `${width}: local file metadata note`);
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("Confirm"), `${width}: example-data acknowledgement`);
        await page.locator("[name='ack']").check();
        await page.locator("#rfq [type='submit']").click();
        check((await page.locator("#result").textContent()).includes("25 × Aluminium") && (await page.locator("#result").textContent()).includes("No request or file sent"), `${width}: meaningful local RFQ preview`);
        await page.locator("[type='reset']").click();
        check(await page.locator("[name='part']").inputValue() === "" && await page.locator("[name='drawing']").evaluate((el) => el.files.length === 0), `${width}: clears brief and file selection`);
        if (width < 768)
        {
            check(await page.locator(".mobile-rfq").isVisible(), `${width}: pinned mobile RFQ`);
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
