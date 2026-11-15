import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("394-nail-salon", async (page, check, width) =>
    {
        check(await page.locator(".service-row").count() === 8 && await page.locator(".nail-item").count() === 12, `${width}: complete service and study collections`);
        await page.locator("[data-study='2']").click();
        check(await page.locator("#study").isVisible() && (await page.locator("#study-title").textContent()).includes("Terracotta"), `${width}: correct study dialog`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#study").isVisible(), `${width}: dialog escape`);
        await page.locator("#next").click();
        check((await page.locator("#author").textContent()).includes("Priya"), `${width}: next review`);
        await page.locator("#prev").click();
        check((await page.locator("#author").textContent()).includes("Isabelle"), `${width}: previous review`);
        await page.locator("[data-service='2']").click();
        check(await page.locator("#service").inputValue() === "2", `${width}: service handoff`);
        await page.locator("#planner [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: empty date validation`);
        await page.locator("#date").fill("2030-01-06");
        await page.locator("#planner [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("closed on Sundays"), `${width}: closed day validation`);
        await page.locator("#date").fill("2030-01-07");
        await page.locator("#service").selectOption("6");
        await page.locator("#planner [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("add-on"), `${width}: add-on guard`);
        await page.locator("#service").selectOption("2");
        await page.locator("#tier").selectOption("Signature");
        await page.locator("#planner [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("£62") && (await page.locator("#result").textContent()).includes("No booking made"), `${width}: truthful computed sample visit`);
        await page.locator("#tier").selectOption("Artist");
        await page.locator("#planner [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("price on consultation"), `${width}: custom price not fabricated`);
        await page.locator("#planner [type=reset]").click();
        check(await page.locator("#date").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: reset clears state`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ expands`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile nav opens`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
