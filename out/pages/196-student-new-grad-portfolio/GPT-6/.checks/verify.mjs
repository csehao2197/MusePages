import { verify } from "./qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    await page.getByRole("button", { name: "Product", exact: true }).click();
    check(await page.locator("article:visible").count() === 1, "Product filter selects one concept");
    check(await page.locator("article:visible h3").textContent() === "Sprout — a gentler daily habit", "Correct product selected");
    await page.locator("article:visible summary").click();
    check(await page.locator("article:visible details").getAttribute("open") !== null, "Project case opens");
    await page.getByRole("button", { name: "All work" }).click();
    check(await page.locator("article:visible").count() === 2, "All filter restores both projects");
    await page.locator("[name=email]").fill("hello@example.com");
    await page.locator("[name=name]").fill("Hiring team");
    await page.locator("[name=message]").fill("Can we discuss your project?");
    await page.getByRole("button", { name: "Try demo message" }).click();
    check((await page.locator("#feedback").textContent()).includes("Nothing was sent"), "Contact is explicitly local");
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByText("Download accessible sample CV").click()]);
    check(download.suggestedFilename() === "sample-cv.txt", "Accessible sample CV download works");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
