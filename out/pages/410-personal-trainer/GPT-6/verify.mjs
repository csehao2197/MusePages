import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("410-personal-trainer", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 3 && await page.locator(".transformations article").count() === 3, `${width}: complete coaching programs and stories`);
        for (let index = 0; index < 3; index++)
        {
            const range = page.locator(".compare input").nth(index);
            await range.focus();
            await page.keyboard.press("Home");
            check((await range.locator("..").getAttribute("style")).includes("0%"), `${width}: comparison ${index} before endpoint`);
            await page.keyboard.press("End");
            check(await range.getAttribute("aria-valuetext") === "100 percent comparison divider", `${width}: comparison ${index} after endpoint`);
            await page.keyboard.press("ArrowLeft");
            check(await range.inputValue() === "99", `${width}: comparison ${index} keyboard adjustment`);
        }
        await page.locator('[data-program="nutrition"]').click();
        check(await page.locator("#program").inputValue() === "nutrition" && (await page.locator("#program-note").textContent()).includes("No restrictive diet"), `${width}: nutrition handoff with appropriate limits`);
        await page.locator("#consultation .button").click();
        check((await page.locator("#result").textContent()).includes("future preferred date"), `${width}: empty date guard`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#consultation .button").click();
        check((await page.locator("#result").textContent()).includes("future preferred date"), `${width}: past date guard`);
        await page.locator("#date").fill("2030-07-14");
        await page.locator("#email").fill("bad");
        await page.locator("#consultation .button").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: malformed email guard`);
        await page.locator("#email").fill("athlete@example.com");
        await page.locator("#consultation .button").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: adult/local acknowledgement required`);
        await page.locator("#ack").check();
        await page.locator("#consultation .button").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent, booked or saved"), `${width}: honest local request`);
        await page.locator("#consultation [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#email").inputValue() === "" && await page.locator("#result").textContent() === "" && await page.locator("#program").inputValue() === "personal", `${width}: reset clears data and program`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: responsive navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: navigation escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
