import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("416-photographer", async (page, check, width) =>
    {
        await page.locator('[data-filter="Editorial"]').click();
        check(await page.locator("[data-category]:visible").count() === 1, `${width}: editorial filter`);
        await page.locator('[data-category="Editorial"]').click();
        check(await page.locator("#study").isVisible() && (await page.locator("#study-title").textContent()).includes("space"), `${width}: correct creative brief dialog`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#study").isVisible(), `${width}: dialog escape`);
        await page.locator('[data-filter="Couples"]').click();
        check((await page.locator("#count").textContent()) === "1 illustrated study", `${width}: couples count`);
        await page.locator('[data-filter="All"]').click();
        check(await page.locator("[data-category]:visible").count() === 4, `${width}: all restored`);
        await page.locator('[data-session="Signature"]').click();
        check(await page.locator("#session").inputValue() === "Signature", `${width}: session handoff`);
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty request guard`);
        await page.locator("#name").fill("Alex");
        await page.locator("#email").fill("bad");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("#date").fill("2030-07-01");
        await page.locator("#vision").fill("<script>not executable</script>");
        await page.locator("#request .button").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent or booked"), `${width}: honest local summary`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#name").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: clear private inputs`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: menu escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
