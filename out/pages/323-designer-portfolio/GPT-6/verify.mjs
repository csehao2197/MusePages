import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("323-designer-portfolio", async (page, check, width) =>
    {
        check(await page.locator(".sculpture").evaluate((img) => img.naturalWidth > 0), `${width}: sculpture decodes`);
        check(await page.locator(".project").count() === 5, `${width}: five concept projects`);
        await page.locator("[data-filter='system']").click();
        check(await page.locator(".project").count() === 1, `${width}: design systems filter`);
        await page.locator(".project button").click();
        check(await page.locator("#case-title").textContent() === "Forma", `${width}: correct case study`);
        check((await page.locator("#case-study").textContent()).includes("tokens"), `${width}: meaningful case study details`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: Escape modal close`);
        await page.locator("[data-filter='web']").click();
        check(await page.locator(".project").count() === 2, `${width}: web filter`);
        await page.locator(".project button").first().click();
        await page.locator("#case-contact").click();
        check((await page.locator("#message").inputValue()).includes("Morrow"), `${width}: project context routed`);
        await page.locator("[data-service='Design Systems']").click();
        check(await page.locator("#service").inputValue() === "Design Systems", `${width}: service preselection`);
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact rejected`);
        await page.locator("#name").fill("Alex Example");
        await page.locator("#email").fill("invalid");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#message").fill("short");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: short brief rejected`);
        await page.locator("#message").fill("An accessible design system for a small publication.");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or saved"), `${width}: local brief preview`);
        await page.locator("#name").fill("Updated Name");
        check(await page.locator("#status").textContent() === "", `${width}: stale result cleared`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#cv").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "paul-smith-concept-profile.txt", `${width}: honest unnumbered profile download`);
        await download.delete();
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".project").count() === 5, `${width}: all-work reset`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "designer mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
