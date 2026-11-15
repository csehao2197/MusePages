import { verify } from "../../../196-student-new-grad-portfolio/GPT-6/.checks/qa.mjs";
import { payment, amortize } from "../calculator.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export async function checks(page, check)
{
    check(Math.abs(payment(320000,6.5,30)-2022.6176751774927) < .001, "Fixed rate formula independently expected payment");
    const schedule = amortize(320000,6.5,30);
    check(schedule.months === 360 && schedule.rows.at(-1).balance < .001, "Schedule pays off exactly within term");
    check(Math.abs(schedule.rows.reduce((sum,row) => sum+row.principal,0)-320000) < .001, "Principal conservation");
    const initial = Number(await page.locator("#total").getAttribute("data-value"));
    check(Math.abs(initial-2522.6176751774927) < .01, "Default total includes monthly tax and insurance");
    await page.locator("[data-unit=percent]").click();
    check(Number(await page.locator("#down").inputValue()) === 20, "Dollar to percentage conversion preserves deposit");
    await page.locator("#down").fill("10");
    check((await page.locator("#breakdown").textContent()).includes("$150"), "PMI applies below 20% down");
    await page.locator("#down").fill("20");
    await page.locator("#rate").fill("0");
    check(Math.abs(Number(await page.locator("#total").getAttribute("data-value"))-(320000/360+500)) < .01, "Zero interest edge case");
    await page.locator("#rate").fill("6.5");
    await page.locator("#extra").fill("300");
    check(!(await page.locator("#savings").textContent()).startsWith("0.0"), "Extra payments reduce term");
    await page.locator("[data-view=monthly]").click();
    check(await page.locator("#schedule-body tr").count() === 360, "Monthly amortization view");
    await page.locator("#explore").evaluate(input =>
    {
        input.value = "120";
        input.dispatchEvent(new Event("input", { bubbles:true }));
    });
    check((await page.locator("#explore-result").textContent()).includes("Month 120"), "Interactive chart month detail");
    const chart = await page.locator(".chart").boundingBox();
    await page.mouse.move(chart.x + chart.width / 2, chart.y + 70);
    check((await page.locator("#explore-result").textContent()).includes("Month 180"), "Chart hover exposes exact middle-month numbers");
    await page.locator("#down").fill("100");
    check((await page.locator("#loan").textContent()) === "$0", "Full down payment yields zero mortgage");
    check((await page.locator("#payoff").textContent()) === "Paid in full", "Full payment payoff state");
    await page.locator("#price").fill("");
    check((await page.locator("#error").textContent()).includes("valid"), "Empty inputs show explicit validation");
    await page.locator("#price").fill("400000");
    await page.locator("#down").fill("20");
    await page.locator("[data-tool=deposit]").click();
    await page.locator("#tool-calculate").click();
    check((await page.locator("#tool-result").textContent()).includes("$80,000"), "Related down payment tool computes");
    await page.keyboard.press("Escape");
    await page.locator("[name=name]").fill("Buyer");
    await page.locator("[name=email]").fill("buyer@example.com");
    await page.locator("[name=phone]").fill("5550100");
    await page.getByRole("button", { name:"Check my rate / demo" }).click();
    check((await page.locator("#lead-result").textContent()).includes("Nothing sent"), "No real credit inquiry");
}

if (process.argv[1] === fileURLToPath(import.meta.url))
{
    await verify(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), checks);
}
