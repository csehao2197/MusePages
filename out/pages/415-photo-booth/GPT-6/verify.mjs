import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("415-photo-booth", async (page, check, width) =>
    {
        check(await page.locator(".machine-list button").count() === 3, `${width}: all three restored booths`);
        await page.locator('[data-booth="1"]').click();
        check((await page.locator("#booth-copy").textContent()).includes("Wood panelled"), `${width}: Sid detail`);
        check(await page.locator('[data-booth="1"]').getAttribute("aria-expanded") === "true", `${width}: selected booth accessible`);
        await page.locator('[data-booth="2"]').click();
        check((await page.locator("#booth-copy").textContent()).includes("tight rooms"), `${width}: Dot detail`);
        await page.locator('[data-booth="0"]').click();
        check((await page.locator("#booth-copy").textContent()).includes("loudest shutter"), `${width}: selection returns to Marlene`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") !== null, `${width}: access guidance opens`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") === null, `${width}: access guidance closes`);
        check(await page.locator(".price-row").count() === 3 && await page.locator("dt").count() === 5, `${width}: complete prices and inclusions`);
        check((await page.locator(".enquiry .pill").getAttribute("href")).startsWith("mailto:"), `${width}: enquiry email not fake booking`);
        check(await page.locator('a[href^="tel:"]').count() === 2, `${width}: telephone handoffs`);
        const broken = await page.locator("a[href^='#']").evaluateAll((links) => links.filter((link) => link.hash && !document.getElementById(link.hash.slice(1))).length);
        check(broken === 0, `${width}: all section navigation resolves`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
