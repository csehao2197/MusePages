import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    check(await page.locator(".review").count() === 6, "Six distinct sample stories");
    await page.locator("#industry").selectOption("Tech");
    check(await page.locator(".review").count() === 2, "Industry filter");
    await page.locator("#service").selectOption("Web Design");
    check(await page.locator(".review").count() === 1, "Combined service filter");
    await page.getByRole("button", { name: "Read more", exact: true }).click();
    check(await page.locator(".more").isVisible(), "Review expands");
    await page.locator("#reset").click();
    await page.locator("#sort").selectOption("rating");
    check((await page.locator(".review").first().locator(".stars").getAttribute("aria-label")).startsWith("5"), "Highest rating sorts first");
    await page.getByRole("button", { name: "Play Form and Field demo video" }).click();
    await page.locator("video").evaluate(video => video.play());
    await page.waitForTimeout(300);
    check(await page.locator("video").evaluate(video => video.currentTime > 0 && !video.paused), "Actual local demo clip plays");
    await page.keyboard.press("Escape");
    check(await page.locator("video").evaluate(video => video.paused), "Closing video pauses playback");
    await page.locator("[name=name]").fill("Demo reviewer");
    await page.locator("[name=review]").fill("A useful and clearly labeled demonstration review.");
    await page.getByRole("button", { name: "Preview review" }).click();
    check((await page.locator("#review-status").textContent()).includes("Not sent, saved or published"), "Review preview stays local");
    await page.locator("#consult").click();
    check((await page.locator("#consult-status").textContent()).includes("No appointment"), "No false scheduling");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
