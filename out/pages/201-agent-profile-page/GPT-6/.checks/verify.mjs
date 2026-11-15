import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    check(await page.locator(".listing").count() === 4, "Four active sample homes");
    await page.getByRole("button", { name:"Pending", exact:true }).click();
    check(await page.locator(".listing").count() === 1, "Pending status filters");
    await page.locator(".listing").click();
    check((await page.locator("#dialog-text").textContent()).includes("not a live listing"), "Property detail is truthful");
    await page.keyboard.press("Escape");
    await page.locator("#all-listings").click();
    check(await page.locator(".listing").count() === 6, "All listings restores six samples");
    await page.getByRole("button", { name:"Explore Riverside" }).click();
    check(await page.locator("#area-title").textContent() === "Riverside", "Interactive service-area guide");
    await page.locator("#next-sold").click();
    check((await page.locator("#sold-text").textContent()).includes("Birch"), "Sold carousel advances");
    await page.locator("#more-reviews").click();
    check(await page.locator("#extra-reviews").isVisible(), "Review disclosure reveals three more");
    await page.getByRole("button", { name:"Call Sarah", exact:true }).click();
    check((await page.locator("#dialog-text").textContent()).includes("no call"), "Unconfigured contact never calls a fake number");
    await page.keyboard.press("Escape");
    await page.locator("[name=name]").fill("Home seeker");
    await page.locator("[name=email]").fill("home@example.com");
    await page.locator("[name=message]").fill("Interested in a sample home.");
    await page.getByRole("button", { name:"Send demo message" }).click();
    check((await page.locator("#result").textContent()).includes("Nothing sent"), "Contact form stays local");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
