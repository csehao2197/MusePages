import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("443-self-storage", async (page, check, width) =>
    {
        check(await page.locator("#unit-price").textContent() === "38" && await page.locator("#unit-rows tr").count() === 8, `${width}: default comparison and full sizes`);
        await page.locator('[data-size="200"]').click();
        check(await page.locator("#unit-price").textContent() === "108" && await page.locator("#unit-art").getAttribute("data-capacity") === "200", `${width}: comparison illustration and price`);
        check((await page.locator("#unit-period").textContent()).includes("432"), `${width}: explicit four-week price`);
        await page.locator("#reserve-selected").click();
        check((await page.locator("#reservation-unit").textContent()).includes("200 sq ft"), `${width}: chosen unit in planner`);
        await page.locator("#reserve-form button").click();
        check(await page.locator("#reserve-status").textContent() === "", `${width}: empty move date blocked`);
        await page.locator('[name="date"]').fill("2027-01-15");
        await page.locator(".consent input").check();
        await page.locator("#reserve-form button").click();
        check((await page.locator("#reserve-status").textContent()).includes("No unit has been reserved"), `${width}: honest local plan`);
        await page.keyboard.press("Escape");
        await page.locator("#minimum").selectOption("250");
        check(await page.locator("#units-empty").isVisible() && await page.locator("#unit-rows tr").count() === 0, `${width}: empty size filter`);
        await page.locator("#minimum").selectOption("100");
        check(await page.locator("#unit-rows tr").count() === 3, `${width}: minimum size filter`);
        await page.locator('[data-unit="150"]').click();
        check((await page.locator("#reservation-unit").textContent()).includes("150 sq ft") && await page.locator('[name="date"]').inputValue() === "", `${width}: table reservation fresh state`);
        await page.locator(".close").click();
        await page.locator("#box-qty").fill("-1");
        await page.locator("#estimate").click();
        check((await page.locator("#supply-status").textContent()).includes("whole quantities"), `${width}: invalid supply quantity`);
        await page.locator("#box-qty").fill("3");
        await page.locator("#tape-qty").fill("2");
        await page.locator("#estimate").click();
        check((await page.locator("#supply-status").textContent()).includes("£11.60"), `${width}: supply estimate arithmetic`);
        await page.locator("#box-qty").fill("0");
        await page.locator("#tape-qty").fill("0");
        await page.locator("#estimate").click();
        check((await page.locator("#supply-status").textContent()).includes("No supplies selected"), `${width}: empty supply estimate`);
        await page.locator("#business-plan").click();
        check(await page.locator('[name="purpose"]').inputValue() === "Business stock", `${width}: business plan context`);
        await page.keyboard.press("Escape");
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ works`);
        check(await page.locator('[type="password"], [type="email"]').count() === 0, `${width}: no credentials/contact collection`);
        if (width < 800)
        {
            check(await page.locator(".mobile-reserve").isVisible(), `${width}: mobile reserve bar`);
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#sizes"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
