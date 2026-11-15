import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("297-car-dealership", async (page, check, width) =>
    {
        check(await page.locator(".vehicle").count() === 6, `${width}: initial inventory`);
        await page.locator("#more").click();
        check(await page.locator(".vehicle").count() === 9, `${width}: load all samples`);
        await page.locator("#make").selectOption("Nimbus");
        await page.locator("#type").selectOption("Truck");
        check(await page.locator("#empty").isVisible(), `${width}: combined empty result`);
        await page.locator("#reset").click();
        await page.locator("#quick-model").fill("GT Line");
        await page.locator("#quick button").click();
        check(await page.locator(".vehicle").count() === 1, `${width}: actual model search`);
        await page.locator("[data-vehicle='0']").click();
        check((await page.locator("#vehicle-title").textContent()).includes("Aurora GT"), `${width}: vehicle detail`);
        await page.locator("#use-price").click();
        check(await page.locator("#price").inputValue() === "42900", `${width}: price preselected`);
        const expected = Math.round((42900 - 5000) * (.069 / 12) / (1 - (1 + .069 / 12) ** -60));
        check(await page.locator("#monthly").textContent() === `$${expected}`, `${width}: amortized payment`);
        await page.locator("#down").fill("42900");
        await page.locator("#down").dispatchEvent("input");
        check(await page.locator("#monthly").textContent() === "$0", `${width}: fully paid principal`);
        await page.locator("#price").fill("15000");
        await page.locator("#price").dispatchEvent("input");
        check(Number(await page.locator("#down").inputValue()) <= 15000, `${width}: deposit clamped`);
        await page.locator("#trade-form button").click();
        check((await page.locator("#trade-status").textContent()).includes("year"), `${width}: invalid trade year`);
        await page.locator("#year").fill("2021");
        await page.locator("#trade-make").fill("Sample");
        await page.locator("#trade-model").fill("Touring");
        await page.locator("#mileage").fill("-1");
        await page.locator("#trade-form button").click();
        check((await page.locator("#trade-status").textContent()).includes("mileage"), `${width}: negative mileage`);
        await page.locator("#mileage").fill("45000");
        await page.locator("#trade-form button").click();
        check((await page.locator("#trade-status").textContent()).includes("Not an offer"), `${width}: honest trade guide`);
        await page.locator("[data-enquiry='Scheduled maintenance']").click();
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-status").textContent()).includes("name"), `${width}: service empty form`);
        await page.locator("#name").fill("Alex Hart");
        await page.locator("#email").fill("bad");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-status").textContent()).includes("valid email"), `${width}: service email`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#date").fill("2027-02-10");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-status").textContent()).includes("Scheduled maintenance"), `${width}: service context`);
        check((await page.locator("#enquiry-status").textContent()).includes("Nothing sent or scheduled"), `${width}: honest service state`);
        await page.keyboard.press("Escape");
        await page.locator("#reset").click();
        await page.locator("#payment-filter").selectOption("400");
        check(await page.locator(".vehicle").count() === 1, `${width}: monthly budget filter`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "dealer menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "dealer menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
