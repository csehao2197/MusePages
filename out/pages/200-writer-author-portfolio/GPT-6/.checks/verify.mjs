import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    await page.locator("#list").click();
    check(await page.locator(".books").evaluate(element => element.classList.contains("list")), "Book list mode");
    await page.locator("#grid").click();
    check(await page.locator("#grid").getAttribute("aria-pressed") === "true", "Grid mode restored");
    await page.locator("[data-read=returning]").click();
    check((await page.locator("#read-text").textContent()).includes("Sample opening"), "Book detail includes original excerpt");
    await page.keyboard.press("Escape");
    check(!await page.locator("dialog").isVisible(), "Reading dialog keyboard dismissal");
    await page.locator("#topic").selectOption("Writing");
    check(await page.locator(".essay:visible").count() === 1, "Essay topic filter");
    await page.locator("[data-bio=long]").click();
    check((await page.locator("#bio").textContent()).includes("verified owner input"), "Long bio stays honest");
    await page.locator(".signup input").fill("reader@example.com");
    await page.getByRole("button", { name:"Try newsletter signup" }).click();
    check((await page.locator("#newsletter-status").textContent()).includes("not subscribed"), "Newsletter local demo");
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByText("Download sample press kit").click()]);
    check(download.suggestedFilename() === "press-kit.txt", "Press kit download");
    await page.locator("#enquiry [name=email]").fill("bookclub@example.com");
    await page.locator("[name=note]").fill("A sample book club enquiry.");
    await page.getByRole("button", { name:"Preview enquiry" }).click();
    check((await page.locator("#enquiry-status").textContent()).includes("Nothing sent"), "Speaking enquiry demo feedback");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
