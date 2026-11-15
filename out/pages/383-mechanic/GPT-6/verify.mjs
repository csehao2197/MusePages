import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("383-mechanic", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 6 && await page.locator("#rates tr").count() === 8, `${width}: original categories and rates`);
        check((await page.locator("#selected").textContent()).includes("No services"), `${width}: estimate empty state`);
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("at least one"), `${width}: service required`);
        await page.waitForFunction(() => document.querySelector(".hero-bar").classList.contains("hidden"));
        check(await page.locator(".hero-bar").evaluate((element) => element.classList.contains("hidden")), `${width}: hero bar leaves with hero`);
        await page.locator("[data-add=mot]").first().click();
        await page.locator("[data-add=mot]").first().click();
        check(await page.locator(".selection").count() === 1 && await page.locator("#total").textContent() === "£35.99", `${width}: dedup and VAT rounding`);
        await page.locator("[data-add=scan]").first().click();
        check(await page.locator("#subtotal").textContent() === "£64.99" && await page.locator("#total").textContent() === "£77.99", `${width}: correct composite VAT`);
        await page.locator("[data-remove=mot]").click();
        check(await page.locator("#total").textContent() === "£42.00", `${width}: remove recalculates`);
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("valid example email"), `${width}: empty contact error`);
        await page.locator("[name=name]").fill("Example Driver");
        await page.locator("[name=email]").fill("driver@example.test");
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("make and model"), `${width}: vehicle required`);
        await page.locator("[name=vehicle]").fill("Example Hatchback");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("future date"), `${width}: past date error`);
        await page.locator("#date").fill("2099-01-04");
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("closed"), `${width}: Sunday blocked`);
        await page.locator("#date").fill("2099-01-06");
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: local acknowledgement`);
        await page.locator("[name=ack]").check();
        await page.locator("#visit [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("£42.00") && (await page.locator("#result").textContent()).includes("No appointment booked"), `${width}: accurate local summary`);
        await page.locator("#clear").click();
        check(await page.locator("#total").textContent() === "£0.00", `${width}: clear estimate`);
        await page.locator("[type=reset]").click();
        check(await page.locator("[name=email]").inputValue() === "", `${width}: clear personal input`);
        await page.locator(".workshop summary").first().click();
        check((await page.locator(".workshop details").first().textContent()).includes("unverified"), `${width}: profile qualification limits`);
        if (width < 750)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
