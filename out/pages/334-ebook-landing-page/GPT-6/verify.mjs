import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
import { promises as fs } from "node:fs";
export async function verify()
{
    return audit("334-ebook-landing-page", async (page, check, width) =>
    {
        check(await page.locator(".book .front").isVisible() && await page.locator(".spine").count() === 1, `${width}: real geometric cover`);
        check(await page.locator("[data-chapter]").count() === 7, `${width}: seven chapters`);
        await page.locator("[data-chapter='2']").click();
        check((await page.locator("#chapter-note").textContent()).includes("six short headings"), `${width}: case study reflection`);
        await page.locator("[data-chapter='6']").click();
        check((await page.locator("#chapter-note").textContent()).includes("prospective client"), `${width}: outreach reflection differs`);
        await page.locator("#preview").click();
        check(await page.locator("#reader").isVisible() && await page.locator("#previous").isDisabled(), `${width}: preview opens at bounded first page`);
        await page.locator("#next").click();
        check((await page.locator("#reader-text").textContent()).includes("problem, constraint, decision, result"), `${width}: second sample content`);
        check(await page.locator("#next").isDisabled(), `${width}: final page bounded`);
        await page.locator("#previous").click();
        check(await page.locator("#page-status").textContent() === "1 of 2", `${width}: previous page`);
        const [sample] = await Promise.all([page.waitForEvent("download"), page.locator("#download").click()]);
        const sampleText = await fs.readFile(await sample.path(), "utf8");
        check(sample.suggestedFilename() === "quiet-portfolio-sample.txt" && sampleText.includes("Not the complete PDF"), `${width}: real clearly scoped sample download`);
        const [template] = await Promise.all([page.waitForEvent("download"), page.locator("#template").click()]);
        check((await fs.readFile(await template.path(), "utf8")).includes("Notes:"), `${width}: useful downloadable reflection template`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#reader").isVisible(), `${width}: Escape dismisses preview`);
        await page.locator("#get-book").click();
        check(await page.locator("#reader").isVisible(), `${width}: edition action works without checkout`);
        await page.locator("#close-reader").click();
        check(!await page.locator("#reader").isVisible(), `${width}: visible dismiss control`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ opens`);
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(100);
        check(await page.locator("#progress").evaluate((node) => parseFloat(node.style.width) > 95), `${width}: progress reaches end`);
        if (width < 700) check(await page.locator(".sticky-buy").isVisible(), "mobile edition action after hero");
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no personal tracking state`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
