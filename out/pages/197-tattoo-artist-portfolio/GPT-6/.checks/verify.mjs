import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    await page.getByRole("button", { name: "Healed work", exact: true }).click();
    check(await page.locator("article:visible").count() === 0, "Healed filter does not invent tattoo examples");
    check(await page.locator("#empty").isVisible(), "Healed consent/data limitation shown");
    await page.getByRole("button", { name: "Botanical", exact: true }).click();
    check(await page.locator("article:visible").count() === 1, "Botanical category selects one design");
    await page.getByRole("button", { name: "View Wild rose study" }).click();
    check(await page.locator("dialog").isVisible(), "Dedicated project case opens");
    await page.keyboard.press("Escape");
    check(!await page.locator("dialog").isVisible(), "Case closes with Escape");
    await page.locator("[name=email]").fill("demo@example.com");
    for (const [name, value] of [["placement", "Arm"], ["size", "8 cm"], ["location", "London"], ["idea", "Botanical concept"]])
    {
        await page.locator(`[name=${name}]`).fill(value);
    }
    await page.getByRole("button", { name: "Review demo enquiry" }).click();
    check((await page.locator("#result").textContent()).includes("nothing sent"), "Booking feedback is honest");
    await page.locator("#reference").setInputFiles({ name: "reference.svg", mimeType: "image/svg+xml", buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>') });
    check((await page.locator("#files").textContent()).includes("1 reference"), "Local reference selection acknowledged");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
