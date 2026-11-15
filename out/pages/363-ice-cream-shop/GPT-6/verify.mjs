import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("363-ice-cream-shop", async (page, check, width) =>
    {
        check(await page.locator(".flavour").count() === 9, `${width}: complete menu`);
        await page.locator("#search").fill("absent");
        check(await page.locator("#empty").isVisible(), `${width}: search empty state`);
        await page.locator("#search").fill("");
        await page.locator("#diet").selectOption("vegan");
        check(await page.locator(".flavour").count() === 4, `${width}: vegan variant filtering`);
        await page.locator("#diet").selectOption("all");
        await page.locator("#prepare").click();
        check((await page.locator("#cup-status").textContent()).includes("at least one"), `${width}: empty cup guard`);
        const selector = width < 768 ? "#choices [data-add]" : "#wheel [data-add]";
        await page.locator(selector).nth(0).focus();
        await page.keyboard.press("Enter");
        check(await page.locator("#cup p").count() === 1, `${width}: keyboard scoop selection`);
        await page.locator(selector).nth(1).click();
        await page.locator(selector).nth(2).click();
        check((await page.locator("#cup-status").textContent()).includes("£7.5"), `${width}: actual cup arithmetic`);
        await page.locator(selector).nth(3).click();
        check(await page.locator("#cup p").count() === 3 && (await page.locator("#cup-status").textContent()).includes("limit"), `${width}: scoop capacity`);
        await page.locator("#cup button").first().click();
        check(await page.locator("#cup p").count() === 2, `${width}: remove scoop`);
        await page.locator("#prepare").click();
        check((await page.locator("#cup-status").textContent()).includes("no order placed"), `${width}: honest cup summary`);
        await page.locator("#clear").click();
        check(await page.locator("#cup p").count() === 0, `${width}: reset cup`);
        await page.locator("#daily").click();
        check((await page.locator("#daily-name").textContent()).includes("Pistachio"), `${width}: daily reveal`);
        await page.locator("[data-gift='25']").click();
        check((await page.locator("#gift-result").textContent()).includes("£25") && (await page.locator("#gift-result").textContent()).includes("No payment"), `${width}: gift preview`);
        await page.locator("[data-enquire='Private tasting']").click();
        await page.locator("#event-form .button").click();
        check((await page.locator("#event-result").textContent()).includes("1–20"), `${width}: event validation`);
        await page.locator("[name='guests']").fill("5");
        await page.locator("[name='email']").fill("party@example.test");
        await page.locator("#event-form .button").click();
        check((await page.locator("#event-result").textContent()).includes("£325") && (await page.locator("#event-result").textContent()).includes("nothing sent"), `${width}: guest pricing and no reservation`);
        await page.keyboard.press("Escape");
        await page.locator(".faq summary").nth(2).click();
        check(await page.locator(".faq details").nth(2).getAttribute("open") !== null, `${width}: allergy disclosure expands`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
