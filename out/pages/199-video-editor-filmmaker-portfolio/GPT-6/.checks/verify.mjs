import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    await page.locator("#motion").click();
    await page.waitForTimeout(250);
    check(await page.locator("#background").evaluate(video => !video.paused && video.muted), "Muted looping background can play");
    await page.locator("#motion").click();
    check(await page.locator("#background").evaluate(video => video.paused), "Background pause works");
    await page.getByRole("button", { name:"Documentary", exact:true }).click();
    check(await page.locator(".project:visible").count() === 1, "Documentary category filter");
    await page.locator(".project:visible").click();
    check((await page.locator("#film-title").textContent()).includes("quiet"), "Correct project details opened");
    await page.locator("#player").evaluate(video => video.play());
    await page.waitForTimeout(250);
    check(await page.locator("#player").evaluate(video => video.currentTime > 0), "Local project video plays");
    await page.keyboard.press("Escape");
    check(await page.locator("#player").evaluate(video => video.paused), "Closing film pauses playback");
    await page.getByRole("button", { name:"Corporate", exact:true }).click();
    check(await page.locator("#empty").isVisible(), "Missing category shows honest empty state");
    await page.locator("[name=email]").fill("hello@example.com");
    await page.locator("[name=brief]").fill("A short documentary edit.");
    await page.getByRole("button", { name:"Review project enquiry" }).click();
    check((await page.locator("#result").textContent()).includes("Nothing sent"), "Enquiry has local-only outcome");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
