import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("292-branding-agency", async (page, check, width) =>
    {
        await page.locator("[data-filter='Motion']").click();
        check(await page.locator(".project").count() === 1, `${width}: motion filter`);
        await page.locator(".project").click();
        check(await page.locator("#case-title").textContent() === "Orion", `${width}: case context`);
        check((await page.locator("#case-copy").textContent()).includes("orbital"), `${width}: specific case narrative`);
        await page.locator("#reveal").fill("80");
        await page.locator("#reveal").dispatchEvent("input");
        check(await page.locator("#reveal-status").textContent() === "80% before / 20% after", `${width}: comparison slider`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#case").isVisible(), `${width}: keyboard closes dialog`);
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".project").count() === 6, `${width}: work reset`);
        await page.locator(".services details").first().locator("summary").click();
        check(await page.locator(".deliverables").first().isVisible(), `${width}: service details`);
        await page.locator("[data-package='Studio Package']").click();
        check(await page.locator("#package").inputValue() === "Studio Package", `${width}: package selected`);
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: empty name`);
        await page.locator("#name").fill("Ari Lane");
        await page.locator("#email").fill("no");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("valid work email"), `${width}: email validation`);
        await page.locator("#email").fill("ari@example.com");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: useful brief required`);
        await page.locator("#goals").fill("Launch an independent materials brand with a confident and accessible visual identity.");
        await page.locator("#brief button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent"), `${width}: truthful draft state`);
        const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#download").click()]);
        check(download.suggestedFilename() === "form-studio-project-brief.txt", `${width}: useful download`);
        const stream = await download.createReadStream();
        let text = "";
        for await (const chunk of stream) text += chunk;
        check(text.includes("Studio Package") && text.includes("independent materials"), `${width}: exact brief content`);
        await page.locator("#goals").fill("Changed");
        check(!await page.locator("#download").isVisible(), `${width}: stale download invalidated`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "branding mobile navigation");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "branding menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
