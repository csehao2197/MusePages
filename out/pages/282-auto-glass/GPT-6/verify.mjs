import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("282-auto-glass", async (page, check, width) =>
    {
        check((await page.locator("#advice").textContent()).includes("resin repair"), `${width}: small chip advice`);
        await page.locator("#size").selectOption("large");
        check((await page.locator("#advice").textContent()).includes("Replacement"), `${width}: large crack requires assessment`);
        await page.locator("#size").selectOption("small");
        await page.locator("#sight").selectOption("yes");
        check((await page.locator("#advice").textContent()).includes("Replacement"), `${width}: driver sight safety edge`);
        await page.locator("#sight").selectOption("unsure");
        check((await page.locator("#advice").textContent()).includes("Not sure"), `${width}: uncertain damage guidance`);
        check(decodeURIComponent(await page.locator("#photo-link").getAttribute("href")).includes("Please attach a photograph"), `${width}: useful photo email draft`);
        await page.locator("#chips").fill("3");
        check(await page.locator("#estimate").textContent() === "£105 · about 70 minutes", `${width}: multi-chip price and duration`);
        await page.locator("#chips").fill("0");
        check((await page.locator("#estimate").textContent()).includes("1 to 6"), `${width}: zero count rejected`);
        await page.locator("#chips").fill("1.5");
        check((await page.locator("#estimate").textContent()).includes("whole number"), `${width}: fractional chips rejected`);
        await page.locator("#chips").fill("7");
        check((await page.locator("#estimate").textContent()).includes("Call"), `${width}: upper limit`);
        await page.locator("#chips").fill("");
        check((await page.locator("#estimate").textContent()).includes("Enter"), `${width}: blank count rejected`);
        await page.locator("#area-search").fill("beeston");
        check(await page.locator(".area").count() === 1, `${width}: case-insensitive town match`);
        await page.locator("#area-search").fill("nowhere");
        check(await page.locator(".area").count() === 0 && (await page.locator("#area-status").textContent()).includes("No listed"), `${width}: town empty state`);
        await page.locator("#area-search").fill("");
        check(await page.locator(".area").count() === 10, `${width}: clear town search`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") !== null, `${width}: insurance explanation expands`);
        check(await page.locator(".call").first().getAttribute("href") === "tel:08001184411", `${width}: correct telephone action`);
        check(await page.locator(".branches").evaluate((el) => getComputedStyle(el).animationName) === "none", `${width}: reduced motion repaired state`);
        if (width === 390) check(await page.locator(".mobile-call").isVisible(), "mobile persistent call action");
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
