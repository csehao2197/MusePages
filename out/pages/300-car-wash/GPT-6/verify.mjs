import { audit } from "./serial-qa.mjs";
export async function verify()
{
    return audit("300-car-wash", async (page, check, width) =>
    {
        await page.locator("[data-package='Full Detail']").click();
        check(await page.locator("#total").textContent() === "£45", `${width}: detail selection`);
        await page.locator(".extras input[value='35']").check();
        await page.locator(".extras input[value='8']").check();
        check(await page.locator("#total").textContent() === "£88", `${width}: add-ons total`);
        await page.locator(".extras input[value='8']").uncheck();
        check(await page.locator("#total").textContent() === "£80", `${width}: add-on removed`);
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: empty date`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past date`);
        await page.locator("#date").fill("2027-12-20");
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: required name`);
        await page.locator("#name").fill("Alex Lane");
        await page.locator("#email").fill("bad");
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: demo consent`);
        await page.locator("#accept").check();
        await page.locator("#booking button").click();
        check((await page.locator("#status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest plan`);
        await page.locator("#compare").fill("80");
        check(await page.locator("#compare-value").textContent() === "80%", `${width}: comparison value`);
        check(await page.locator("#dust").evaluate((el) => el.style.width) === "80%", `${width}: comparison visual changes`);
        await page.locator("[data-member='Detail Pass']").click();
        check((await page.locator("#member-status").textContent()).includes("No subscription"), `${width}: membership enquiry`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "mobile menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
