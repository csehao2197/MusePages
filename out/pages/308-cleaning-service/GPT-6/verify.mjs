import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("308-cleaning-service", async (page, check, width) =>
    {
        await page.locator("[data-filter='work']").click();
        check(await page.locator(".service").count() === 1, `${width}: workplace service filter`);
        await page.locator(".service button").click();
        check(await page.locator("#service").inputValue() === "1", `${width}: service selection from card`);
        check((await page.locator("#unit-label").textContent()).includes("500"), `${width}: office sizing`);
        await page.locator("#service").selectOption("4");
        await page.locator("#units").fill("3");
        check(await page.locator("#total").textContent() === "$225.00", `${width}: carpet per-room pricing`);
        await page.locator("#frequency").selectOption("15");
        await page.locator(".extra[value='25']").check();
        check(await page.locator("#total").textContent() === "$216.25", `${width}: base-only recurring discount plus extras`);
        await page.locator("#units").fill("0");
        check(await page.locator("#total").textContent() === "Check size", `${width}: empty size estimate`);
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("1–10"), `${width}: zero size rejected`);
        await page.locator("#units").fill("3");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("five-digit"), `${width}: missing ZIP`);
        await page.locator("#zip").fill("90210");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Outside"), `${width}: no coverage state`);
        await page.locator("#zip").fill("10001");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("full name"), `${width}: required name`);
        await page.locator("#name").fill("Alex");
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Sundays"), `${width}: Sunday unavailable`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#email").fill("bad");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#phone").fill("123");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("10–15"), `${width}: phone validation`);
        await page.locator("#phone").fill("2125550123");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: sample acknowledgement`);
        await page.locator("#accept").check();
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest quote summary`);
        await page.locator("#faq details").nth(3).locator("summary").click();
        check((await page.locator("#faq details").nth(3).textContent()).includes("base only"), `${width}: transparent rate explanation`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "cleaning mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
