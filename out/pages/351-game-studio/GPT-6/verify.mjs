import { audit } from "./serial-run.mjs";
export async function verify()
{
    return audit("351-game-studio", async (page, check, width) =>
    {
        check(await page.locator(".credit").count() === 11, `${width}: complete eleven-person team`);
        check(await page.locator(".press-row").count() === 6, `${width}: complete brief press list`);
        check(await page.locator(".walker").evaluate((el) => getComputedStyle(el).animationName === "none"), `${width}: reduced motion parks sprite`);
        await page.locator("[data-game='tide']").focus();
        check(await page.locator("#game-art use").getAttribute("href") === "#tide", `${width}: keyboard changes actual game artwork`);
        check((await page.locator("#game-meta").textContent()).includes("XBOX"), `${width}: matching game platforms`);
        await page.locator("[data-game='snow']").click();
        await page.locator("#game-details").click();
        check(await page.locator("#detail-title").textContent() === "LAST BUS TO VELKA", `${width}: selected game details`);
        check((await page.locator("#store-link").getAttribute("href")).includes("LAST%20BUS"), `${width}: selected game external search`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#game-dialog").isVisible(), `${width}: accessible escape dismisses modal`);
        await page.locator("header [data-open='press-dialog']").click();
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "ninefold-fact-sheet.txt", `${width}: real local press download`);
        check((await page.locator("#download-status").textContent()).includes("locally"), `${width}: download status truthful`);
        await page.keyboard.press("Escape");
        await page.locator("#jobs [data-open='jobs-dialog']").click();
        await page.locator("#jobs-dialog summary").first().click();
        check(await page.locator("#jobs-dialog details").first().getAttribute("open") !== null, `${width}: role details disclosure`);
        await page.locator("#ask-role").click();
        check(await page.locator("#question-dialog").isVisible() && !await page.locator("#jobs-dialog").isVisible(), `${width}: role question flow`);
        await page.locator("#question button").click();
        check((await page.locator("#question-result").textContent()).includes("valid email"), `${width}: empty form rejected`);
        await page.locator("#question [name='email']").fill("example@example.test");
        await page.locator("#question button").click();
        check((await page.locator("#question-result").textContent()).includes("10 characters"), `${width}: short question rejected`);
        await page.locator("#question [name='message']").fill("What does a normal studio week look like?");
        await page.locator("#question button").click();
        check((await page.locator("#question-result").textContent()).includes("Nothing sent or saved"), `${width}: truthful valid preview`);
        await page.keyboard.press("Escape");
        await page.locator("#games").scrollIntoViewIfNeeded();
        check(await page.locator("header").evaluate((el) => el.classList.contains("solid")), `${width}: scroll header treatment`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no personal data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: interactive state fits viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
