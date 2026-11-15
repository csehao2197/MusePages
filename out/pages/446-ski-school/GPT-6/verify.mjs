import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("446-ski-school", async (page, check, width) =>
    {
        await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) =>
        {
            image.loading = "eager";
            return image.decode();
        })));
        check(await page.locator(".lesson").count() === 3 && await page.locator(".people article").count() === 3 && await page.locator(".timeline li").count() === 4, `${width}: complete lesson people and timeline content`);
        check(await page.locator("table tbody tr").count() === 4 && await page.locator('a[href*="creativecommons.org"]').count() === 2, `${width}: complete prices and persistent license links`);
        check(await page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), `${width}: all local photographs render`);
        await page.locator('[data-level="Confident"]').click();
        check(await page.locator('[data-level="Confident"]').getAttribute("aria-pressed") === "true" && (await page.locator("#level-status").textContent()).includes("Confident"), `${width}: starting level choice`);
        await page.locator('.lesson [data-book="adult"]').click();
        check(await page.locator('[name="level"]').inputValue() === "Confident" && await page.locator('[name="lesson"]').inputValue() === "adult", `${width}: level carried into enquiry`);
        await page.locator('[name="people"]').fill("");
        await page.locator('#planner [type="submit"]').click();
        check(await page.locator("#summary").isHidden() && await page.locator('[name="people"]').evaluate((input) => !input.validity.valid), `${width}: empty party blocked`);
        await page.locator('[name="people"]').fill("7");
        await page.locator('#planner [type="submit"]').click();
        check(await page.locator("#summary").isHidden(), `${width}: maximum group capacity enforced`);
        await page.locator('[name="people"]').fill("2");
        await page.locator('#planner [type="submit"]').click();
        check((await page.locator("#summary-copy").textContent()).includes("£620 illustrative total") && (await page.locator("#planner-status").textContent()).includes("Nothing has been sent"), `${width}: honest per-person local estimate`);
        const downloadPromise = page.waitForEvent("download");
        await page.locator("#download-plan").click();
        const download = await downloadPromise;
        check(download.suggestedFilename() === "col-bleu-sample-enquiry.txt" && await download.failure() === null, `${width}: sample enquiry download`);
        await page.locator('[name="lesson"]').selectOption("private");
        check(await page.locator("#summary").isHidden() && await page.locator('[name="people"]').getAttribute("max") === "4", `${width}: stale result cleared and private capacity`);
        await page.locator('[name="people"]').fill("5");
        await page.locator('#planner [type="submit"]').click();
        check(await page.locator("#summary").isHidden(), `${width}: private group over capacity blocked`);
        await page.keyboard.press("Escape");
        await page.locator('.lesson [data-book="kids"]').click();
        check(await page.locator("#age-field").isVisible() && await page.locator('[name="age"]').getAttribute("required") !== null, `${width}: child age required`);
        await page.locator('[name="age"]').fill("4");
        await page.locator('#planner [type="submit"]').click();
        check(await page.locator("#summary").isHidden(), `${width}: child below age range rejected`);
        await page.locator('[name="age"]').fill("8");
        await page.locator('#planner [type="submit"]').click();
        check((await page.locator("#summary-copy").textContent()).includes("£280 illustrative total"), `${width}: child plan calculated`);
        await page.keyboard.press("Escape");
        await page.locator('[data-instructor="Priya Shah"]').click();
        check(await page.locator('[name="lesson"]').inputValue() === "private" && (await page.locator("#instructor-choice").textContent()).includes("Priya Shah"), `${width}: instructor preference context`);
        await page.locator('#booking .close').click();
        await page.locator("#reset-level").click();
        check(await page.locator('[aria-pressed="true"]').count() === 0 && (await page.locator("#level-status").textContent()).includes("No level"), `${width}: level empty reset`);
        await page.locator('[data-info="privacy"]').click();
        check((await page.locator("#info-body").textContent()).includes("page memory only"), `${width}: privacy disclosure`);
        await page.keyboard.press("Escape");
        check(await page.locator('input[type="email"],input[type="password"]').count() === 0, `${width}: no personal credentials collected`);
        check(await page.locator("body *").evaluateAll((nodes) => nodes.every((node) => ![...node.childNodes].some((child) => child.nodeType === 3 && child.textContent.trim()) || getComputedStyle(node).display === "none" || parseFloat(getComputedStyle(node).fontSize) >= 14)), `${width}: minimum text size`);
        if (width < 768)
        {
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.locator("#menu-button").click();
            check(await page.locator("nav").isVisible() && await page.locator("#menu-button").getAttribute("aria-expanded") === "true", `${width}: full mobile navigation`);
            await page.locator('nav a[href="#prices"]').click();
            check(await page.locator("#menu-button").getAttribute("aria-expanded") === "false", `${width}: navigation closes after link`);
            check(await page.locator(".floating-book").isVisible(), `${width}: fixed safe-area booking entry`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
