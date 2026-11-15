import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("316-copywriter", async (page, check, width) =>
    {
        await page.locator("[data-case='0']").click();
        check((await page.locator("#case-copy").textContent()).includes("Less chasing"), `${width}: original after copy`);
        await page.locator("#before").click();
        check((await page.locator("#case-copy").textContent()).includes("Leverage"), `${width}: before comparison`);
        check(await page.locator("#before").getAttribute("aria-pressed") === "true", `${width}: active comparison state`);
        await page.keyboard.press("Escape");
        await page.locator("[data-case='1']").click();
        check((await page.locator("#case-title").textContent()).includes("launch"), `${width}: distinct email case`);
        await page.locator("#close").click();
        await page.locator("[data-case='2']").click();
        check((await page.locator("#case-copy").textContent()).includes("money"), `${width}: distinct fintech case`);
        await page.locator("#close").click();
        await page.locator("#service").selectOption("email");
        check(await page.locator("#service-price").textContent() === "From £1,100", `${width}: service starting rate`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#rate-card").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "mara-cole-rate-guide.pdf", `${width}: meaningful unnumbered PDF filename`);
        const chunks = [];
        for await (const chunk of await download.createReadStream()) chunks.push(chunk);
        const pdf = Buffer.concat(chunks).toString("ascii");
        check(pdf.startsWith("%PDF-1.4") && pdf.includes("xref") && pdf.includes("%%EOF") && pdf.includes("GBP 1100"), `${width}: complete real PDF document`);
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: contact validation`);
        await page.locator("#name").fill("Avery Stone");
        await page.locator("#email").fill("avery@example.com");
        await page.locator("#project").fill("Help");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: project context required`);
        await page.locator("#project").fill("A five-email welcome sequence for our new skincare brand.");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("#date").fill("2027-03-01");
        await page.locator("#brief-form button").click();
        check((await page.locator("#status").textContent()).includes("£1,100"), `${width}: selected service in brief`);
        check((await page.locator("#status").textContent()).includes("Nothing sent or booked"), `${width}: honest discovery state`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "copywriter mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
