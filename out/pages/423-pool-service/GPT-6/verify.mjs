import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("423-pool-service", async (page, check, width) =>
    {
        check(await page.locator(".plans article").count() === 3 && await page.locator(".included p").count() === 8 && await page.locator(".extra-list p").count() === 6, `${width}: complete plans inclusions extras`);
        check((await page.locator(".popular .button").getAttribute("href")).includes("Weekly%20plan"), `${width}: weekly plan email handoff`);
        await page.locator("#reveal").fill("0");
        check(await page.locator("#before").evaluate((element) => element.style.clipPath.includes("100%")), `${width}: comparison zero boundary`);
        await page.locator("#reveal").fill("100");
        check(await page.locator("#reveal-value").textContent() === "100%" && await page.locator("#before").evaluate((element) => /inset\(0(?:px)? 0%/.test(element.style.clipPath)), `${width}: comparison full boundary`);
        await page.locator("#reveal").fill("35");
        check(await page.locator("#reveal-value").textContent() === "35%", `${width}: comparison intermediate value`);
        await page.locator("#summer").click();
        check((await page.locator("#season-copy").textContent()).includes("sanitiser demand"), `${width}: summer care content`);
        await page.locator("#summer").focus();
        await page.keyboard.press("End");
        check((await page.locator("#season-copy").textContent()).includes("winterising") && await page.locator("#winter").getAttribute("aria-selected") === "true", `${width}: keyboard winter tab`);
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#spring").getAttribute("aria-selected") === "true", `${width}: season wrap`);
        await page.locator("summary").click();
        check((await page.locator("details").textContent()).includes("collects no photos"), `${width}: quote guidance no fake upload`);
        check((await page.locator(".chemistry .fine").textContent()).includes("does not calculate"), `${width}: chemistry reference limitation`);
        check(await page.locator("form").count() === 0, `${width}: no booking or chemical calculator`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
