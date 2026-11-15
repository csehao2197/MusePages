import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("333-dry-cleaner", async (page, check, width) =>
    {
        check(await page.locator(".price-row").count() === 21, `${width}: complete 21-item price list`);
        check((await page.locator("#bag-status").textContent()).includes("empty"), `${width}: initial empty bag`);
        await page.locator("[data-speed='express']").click();
        check(await page.locator("[data-price='Two-piece suit']").textContent() === "£22.40", `${width}: express multiplier`);
        await page.locator("[data-speed='sameday']").click();
        check(await page.locator("[data-price='Shirt, laundered & pressed']").textContent() === "£6.08", `${width}: same-day multiplier and rounding`);
        check((await page.locator("#delivery").textContent()).includes("6pm"), `${width}: same-day deadline`);
        await page.locator("[data-speed='standard']").click();
        await page.getByRole("button", { name: "Add Two-piece suit to bag", exact: true }).click();
        check(await page.locator("#total").textContent() === "£16.00", `${width}: garment added`);
        await page.locator("form button").click();
        check((await page.locator("#pickup-result").textContent()).includes("covered outward postcode"), `${width}: empty collection rejected`);
        await page.locator("[name='postcode']").fill("RG9");
        await page.locator("[name='date']").fill("2027-12-04");
        await page.locator("[name='email']").fill("example@example.test");
        await page.locator("form button").click();
        check(await page.locator("[name='postcode']").getAttribute("aria-invalid") === "true", `${width}: uncovered postcode rejected`);
        await page.locator("[name='postcode']").fill("rg6");
        await page.locator("form button").click();
        check((await page.locator("#pickup-result").textContent()).includes("more than £20"), `${width}: below-threshold bag rejected`);
        check(await page.locator("[name='window'] option").count() === 2, `${width}: Saturday windows`);
        await page.getByRole("button", { name: "Add Trousers to bag", exact: true }).click();
        check(await page.locator("#total").textContent() === "£23.50", `${width}: cumulative bag`);
        await page.locator("[name='date']").fill("2027-12-05");
        await page.locator("form button").click();
        check((await page.locator("#pickup-result").textContent()).includes("Sunday is closed"), `${width}: closed Sunday state`);
        await page.locator("[name='date']").fill("2027-12-06");
        check(await page.locator("[name='window'] option").count() === 3, `${width}: weekday windows restored`);
        await page.locator("form button").click();
        check((await page.locator("#pickup-result").textContent()).includes("Nothing sent or reserved"), `${width}: nonbinding collection review`);
        await page.locator("[data-speed='express']").click();
        check(await page.locator("#total").textContent() === "£32.90", `${width}: existing bag repriced`);
        check(await page.locator("#pickup-result").textContent() === "", `${width}: stale request review cleared`);
        await page.locator("#clear").click();
        check(await page.locator("#total").textContent() === "£0.00" && (await page.locator("#bag-status").textContent()).includes("empty"), `${width}: clear bag reset`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: care FAQ opens`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile menu opens");
            await page.locator("#menu").click();
            check(await page.locator(".mobile-pickup").isVisible(), "mobile sticky pickup visible");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
