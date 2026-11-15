import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("388-moving-company", async (page, check, width) =>
    {
        check(await page.locator("[data-service]").count() === 6, `${width}: original services`);
        await page.locator("[data-service='Piano & Antiques']").click();
        check(await page.locator("#service").inputValue() === "Piano & Antiques", `${width}: service handoff`);
        await page.locator("#next").click();
        check((await page.locator("#error").textContent()).includes("both general areas"), `${width}: empty route error`);
        await page.locator("#from").fill("London");
        await page.locator("#to").fill("london");
        await page.locator("#next").click();
        check((await page.locator("#error").textContent()).includes("different areas"), `${width}: ambiguous same route`);
        await page.locator("#city").selectOption("Edinburgh");
        await page.locator("#use-city").click();
        check(await page.locator("#to").inputValue() === "Edinburgh" && (await page.locator("#coverage-result").textContent()).includes("example route"), `${width}: destination handoff with disclaimer`);
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#next").click();
        check((await page.locator("#error").textContent()).includes("future"), `${width}: past date error`);
        await page.locator("#date").fill("2099-01-06");
        await page.locator("#next").click();
        check(await page.locator("#stage-two").isVisible() && !await page.locator("#stage-one").isVisible(), `${width}: next stage`);
        await page.locator("#summary").click();
        check((await page.locator("#error").textContent()).includes("at least one"), `${width}: empty inventory error`);
        await page.getByRole("button", { name: "Remove Boxes", exact: true }).click();
        check(await page.getByLabel("Boxes count", { exact: true }).textContent() === "0", `${width}: counter lower bound`);
        await page.getByRole("button", { name: "Add Boxes", exact: true }).click();
        await page.getByRole("button", { name: "Add Boxes", exact: true }).click();
        await page.getByRole("button", { name: "Add Specialist items", exact: true }).click();
        await page.locator("#stairs").check();
        await page.locator("#fragile").check();
        await page.locator("#summary").click();
        check((await page.locator("#summary-copy").textContent()).includes("London to Edinburgh") && (await page.locator("#summary-items").textContent()).includes("Boxes: 2"), `${width}: route and exact inventory summary`);
        check((await page.locator("#access-copy").textContent()).includes("Stairs") && (await page.locator("#access-copy").textContent()).includes("Specialist"), `${width}: access flags`);
        check((await page.locator("#stage-three").textContent()).includes("No enquiry sent"), `${width}: honest local state`);
        await page.locator("#edit").click();
        check(await page.getByLabel("Boxes count", { exact: true }).textContent() === "2", `${width}: edits retain inventory`);
        await page.locator("#back").click();
        check(await page.locator("#from").inputValue() === "London", `${width}: back retains route`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#from").inputValue() === "" && await page.locator("#summary-copy").textContent() === "", `${width}: full clear`);
        await page.locator("#next").click();
        check((await page.locator("#error").textContent()).includes("general areas"), `${width}: reset validation`);
        if (width < 760)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
