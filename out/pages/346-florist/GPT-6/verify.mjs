import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("346-florist", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((image) => image.naturalWidth > 0), `${width}: original botanical art loads`);
        check(await page.locator("#cart-empty").isVisible(), `${width}: initial empty selection`);
        await page.locator("#delivery button").click();
        check((await page.locator("#delivery-result").textContent()).includes("Choose an arrangement"), `${width}: empty order rejected`);
        await page.locator("[data-add='After Hours']").click();
        check(await page.locator("#cart-total").textContent() === "£65", `${width}: add arrangement`);
        await page.getByRole("button", { name: "Increase After Hours", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£130", `${width}: increase quantity`);
        await page.getByRole("button", { name: "Decrease After Hours", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£65", `${width}: decrease quantity`);
        await page.locator("#postcode").fill("bad");
        await page.locator("#delivery button").click();
        check((await page.locator("#delivery-result").textContent()).includes("valid UK"), `${width}: malformed postcode`);
        await page.locator("#postcode").fill("NG7 3NR");
        await page.locator("#delivery button").click();
        check((await page.locator("#delivery-result").textContent()).includes("Outside"), `${width}: unsupported delivery area`);
        await page.locator("#postcode").fill("EC1A 1BB");
        await page.locator("#delivery button").click();
        check((await page.locator("#delivery-result").textContent()).includes("£8"), `${width}: under-threshold delivery fee`);
        await page.locator("[data-add='Still Life']").click();
        await page.locator("#delivery button").click();
        check((await page.locator("#delivery-result").textContent()).includes("free") && (await page.locator("#delivery-result").textContent()).includes("No order placed"), `${width}: free delivery and truthful mock`);
        await page.getByRole("button", { name: "Remove Still Life", exact: true }).click();
        check(await page.locator("#cart-total").textContent() === "£65", `${width}: remove distinct bouquet`);
        await page.locator("#clear-cart").click();
        check(await page.locator("#cart-empty").isVisible() && await page.locator("#bag-count").textContent() === "0", `${width}: clear restores empty state`);
        await page.locator("[data-enquiry='Wedding flowers']").first().click();
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("valid email"), `${width}: empty wedding enquiry`);
        await page.locator("[name='name']").fill("Example Couple");
        await page.locator("[name='email']").fill("couple@example.test");
        await page.locator("[name='setting']").fill("An intimate garden ceremony and dinner.");
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("future"), `${width}: past occasion rejected`);
        await page.locator("[name='date']").fill("2030-07-12");
        await page.locator("#enquiry button").click();
        check((await page.locator("#enquiry-result").textContent()).includes("Wedding flowers") && (await page.locator("#enquiry-result").textContent()).includes("Nothing sent"), `${width}: wedding local preview`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: enquiry keyboard dismissal`);
        await page.getByText("Pets and seasonal substitutions", { exact: true }).click();
        check(await page.locator("details").nth(2).getAttribute("open") !== null, `${width}: pet safety disclosure`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
