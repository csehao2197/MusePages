import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    check(await page.locator(".feature").count() === 13, "All original roadmap features represented");
    await page.getByRole("button", { name:"Next 3–6 months", exact:true }).click();
    check(await page.locator(".feature").count() === 5, "Near-term horizon filter");
    await page.locator("#search").fill("invitation");
    check(await page.locator(".feature").count() === 1, "Feature search combines with horizon");
    await page.locator(".priority").click();
    check((await page.locator("#count").textContent()).includes("1 local priorities"), "Session-only prioritization");
    await page.locator(".detail").click();
    check((await page.locator("#detail-title").textContent()).includes("invitation"), "Feature details dialog");
    await page.keyboard.press("Escape");
    await page.locator("#search").fill("nonexistent");
    check(await page.locator("#empty").isVisible(), "Search empty state");
    await page.locator("#expiry").selectOption("7 days");
    await page.locator("#invite").click();
    check((await page.locator("#invite-result").textContent()).includes("7 days"), "Invitation limit simulation");
    check((await page.locator("#invite-result").textContent()).includes("no account created"), "No real account claim");
    await page.locator("#logs").check();
    check((await page.locator("#events").textContent()).includes("SYNTHETIC"), "Opt-in logs only synthetic");
    await page.locator("#logs").uncheck();
    check(!(await page.locator("#events").textContent()).includes("09:42"), "Disabling samples clears event display");
    await page.locator("#rtl").click();
    check(await page.locator("main").getAttribute("dir") === "rtl", "RTL layout preview toggles");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "RTL layout fits desktop");
    await page.locator("#rtl").click();
    await page.locator("#contribution").click();
    check((await page.locator("#detail-note").textContent()).includes("No issue"), "Contribution mock remains local");
    await page.keyboard.press("Escape");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
