import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("375-life-coach", async (page, check, width) =>
    {
        await page.locator("[data-programme='1']").click();
        check((await page.locator("#programme-detail").textContent()).includes("Six focused weeks") && await page.locator("#call-programme").inputValue() === "Career Pivot", `${width}: programme detail and enquiry handoff`);
        await page.locator("[data-programme='2']").click();
        check((await page.locator("#programme-detail").textContent()).includes("not financial"), `${width}: founder scope limits`);
        await page.locator("[data-episode='2']").click();
        check((await page.locator("#episode-copy").textContent()).includes("recurring request"), `${width}: meaningful episode note switching`);
        await page.locator("#reflection [type='submit']").click();
        check((await page.locator("#reflection-result").textContent()).includes("at least 8"), `${width}: empty reflection guard`);
        await page.locator("[name='focus']").selectOption("Balance");
        check((await page.locator("#prompt").textContent()).includes("room for yourself"), `${width}: tailored reflection prompt`);
        await page.locator("[name='step']").fill("Take a short lunch walk");
        await page.locator("#reflection [type='submit']").click();
        check((await page.locator("#reflection-result").textContent()).includes("balance experiment") && (await page.locator("#reflection-result").textContent()).includes("Nothing saved"), `${width}: private local reflection`);
        await page.locator("#reflection [type='reset']").click();
        check(await page.locator("[name='step']").inputValue() === "" && await page.locator("#reflection-result").textContent() === "", `${width}: reflection clear`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#guide").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "clarity-reflection-guide.txt" && !await download.failure(), `${width}: useful guide download`);
        await page.locator("#call-form [type='submit']").click();
        check((await page.locator("#call-result").textContent()).includes("valid example email"), `${width}: empty enquiry guard`);
        await page.locator("#call-form [name='name']").fill("Example");
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("#call-form [type='submit']").click();
        check((await page.locator("#call-result").textContent()).includes("Confirm"), `${width}: acknowledgement guard`);
        await page.locator("[name='ack']").check();
        await page.locator("#call-form [type='submit']").click();
        check((await page.locator("#call-result").textContent()).includes("Business Founder") && (await page.locator("#call-result").textContent()).includes("No request sent"), `${width}: correct honest enquiry preview`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
