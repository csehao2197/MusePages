import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    await page.getByRole("button",{ name:"Open exterior illustration", exact:true }).click();
    check(await page.locator("#photo-count").textContent() === "1 / 3", "Gallery opens correct illustration");
    await page.keyboard.press("ArrowRight");
    check((await page.locator("#modal-title").textContent()).includes("Living"), "Keyboard gallery navigation");
    await page.locator("#next").click();
    check(await page.locator("#photo-count").textContent() === "3 / 3", "Gallery next navigation");
    await page.keyboard.press("Escape");
    await page.locator("#video").click();
    await page.locator("#walkthrough").evaluate(video => video.play());
    await page.waitForTimeout(300);
    check(await page.locator("#walkthrough").evaluate(video => video.currentTime > 0), "Local walkthrough montage plays");
    await page.keyboard.press("Escape");
    check(await page.locator("#walkthrough").evaluate(video => video.paused), "Closing pauses montage");
    await page.locator("#save").click();
    check(await page.locator("#save").getAttribute("aria-pressed") === "true", "Favorite saves");
    await page.reload();
    check(await page.locator("#save").getAttribute("aria-pressed") === "true", "Favorite survives local reload");
    await page.locator("#save").click();
    await page.locator("#share").click();
    check((await page.locator("#share-link").inputValue()).startsWith("http://127.0.0.1:"), "Share uses actual page URL");
    await page.locator("#copy").click();
    await page.waitForFunction(() => document.querySelector("#copy-result").textContent.length > 0);
    check((await page.locator("#copy-result").textContent()).length > 0, "Clipboard action gives result or fallback");
    await page.keyboard.press("Escape");
    await page.evaluate(() => window.print = () => window.printInvoked = true);
    await page.locator("#print").click();
    check(await page.evaluate(() => window.printInvoked), "Print action invokes browser print");
    await page.locator("[data-place=Parks]").click();
    check((await page.locator("#place-result").textContent()).includes("Parks"), "Nearby category updates");
    await page.locator("#commute").click();
    check((await page.locator("#commute-result").textContent()).startsWith("20 minutes"), "Distance/speed commute estimate");
    await page.locator("#speed").fill("0");
    await page.locator("#commute").click();
    check((await page.locator("#commute-result").textContent()).includes("Enter"), "Invalid speed rejected");
    await page.locator("#rate").fill("0");
    check((await page.locator("#monthly").textContent()) === "$4,228", "Zero interest mortgage calculation");
    await page.locator("#next-similar").click();
    check((await page.locator("#similar-grid").textContent()).includes("Birch"), "Comparable carousel advances");
    await page.locator("[name=name]").fill("Visitor");
    await page.locator("[name=email]").fill("visitor@example.com");
    await page.locator("[name=date]").fill("2030-01-20");
    await page.getByRole("button",{ name:"Request demo showing" }).click();
    check((await page.locator("#form-result").textContent()).includes("Nothing sent"), "Showing remains local demo");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
