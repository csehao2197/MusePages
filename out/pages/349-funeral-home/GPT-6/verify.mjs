import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("349-funeral-home", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((image) => image.naturalWidth > 0), `${width}: original calm landscape loads`);
        check((await page.locator(".concept-note").textContent()).includes("not a live"), `${width}: visible care-service limitation`);
        if (width < 768)
        {
            await page.locator("#menu-button").click();
            check(await page.locator("nav").isVisible(), `${width}: accessible mobile menu`);
            await page.locator("nav a[href='#prices']").click();
            check(await page.locator("#menu-button").getAttribute("aria-expanded") === "false", `${width}: mobile menu dismisses after navigation`);
        }
        await page.locator(".checklist").first().check();
        check((await page.locator("#checklist-status").textContent()).includes("1 item"), `${width}: private checklist selection`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "funeral-arrangements-checklist.txt", `${width}: meaningful unnumbered checklist download`);
        const stream = await download.createReadStream();
        let body = "";
        for await (const chunk of stream) body += chunk.toString();
        check(body.includes("[x] Contact details") && body.includes("Not legal or medical advice"), `${width}: actual downloaded checklist content and selected state`);
        await page.locator(".checklist").first().uncheck();
        check((await page.locator("#checklist-status").textContent()).includes("optional"), `${width}: checklist reset`);
        await page.locator("details summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null && await page.locator("details").first().locator("li").count() === 4, `${width}: native pricing inclusion disclosure`);
        await page.locator("[data-choice='Burial']").click();
        check(await page.locator("[name='topic']").inputValue() === "Burial", `${width}: cost enquiry prefills service`);
        await page.locator("form button").click();
        check((await page.locator("#contact-result").textContent()).includes("valid email"), `${width}: empty contact form rejected`);
        await page.locator("[name='name']").fill("Example Visitor");
        await page.locator("[name='email']").fill("visitor@example.test");
        await page.locator("form button").click();
        check((await page.locator("#contact-result").textContent()).includes("acknowledge"), `${width}: local preview consent`);
        await page.locator("[name='consent']").check();
        await page.locator("form button").click();
        check((await page.locator("#contact-result").textContent()).includes("Burial") && (await page.locator("#contact-result").textContent()).includes("Nothing has been sent"), `${width}: truthful neutral enquiry preview`);
        await page.locator("#notice-search").fill("Anne");
        check(await page.locator(".notice").count() === 1, `${width}: example notice search`);
        await page.locator(".notice").click();
        check((await page.locator("#notice-service").textContent()).includes("No public service details"), `${width}: private-family-service respected`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: notice keyboard dismissal`);
        await page.locator("#notice-search").fill("absent");
        check(await page.locator("#notice-empty").isVisible(), `${width}: no notices state`);
        await page.locator("#all-notices").click();
        check(await page.locator(".notice").count() === 4, `${width}: all four example notices restored`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no sensitive data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interactive states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
