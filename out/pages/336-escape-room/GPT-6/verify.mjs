import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("336-escape-room", async (page, check, width) =>
    {
        check(await page.locator(".room").count() === 4 && await page.locator(".scene").count() === 4, `${width}: four original room sets`);
        await page.locator("#pause").click();
        await page.locator("#reset").click();
        check(await page.locator("#timer").textContent() === "47:23", `${width}: countdown reset`);
        await page.waitForTimeout(1100);
        check(await page.locator("#timer").textContent() === "47:23", `${width}: countdown pauses`);
        await page.locator("#pause").click();
        await page.waitForTimeout(1100);
        check(await page.locator("#timer").textContent() !== "47:23", `${width}: countdown actually ticks`);
        await page.locator("#review").click();
        check((await page.locator("#booking-error").textContent()).includes("date"), `${width}: missing date`);
        await page.locator("#date").fill("2027-12-06");
        await page.locator("#review").click();
        check((await page.locator("#booking-error").textContent()).includes("available room"), `${width}: empty slot selection`);
        check(await page.locator("[data-slot='1-0']").isDisabled(), `${width}: fully booked slot disabled`);
        await page.locator("#players").selectOption("6");
        await page.locator("[data-slot='1-2']").click();
        await page.locator("#review").click();
        check((await page.locator("#booking-error").textContent()).includes("up to 4"), `${width}: Isolation capacity enforced`);
        await page.locator("#players").selectOption("4");
        await page.locator("[data-slot='0-2']").click();
        await page.locator("#review").click();
        check((await page.locator("#booking-error").textContent()).includes("only 2 spots"), `${width}: limited slot capacity`);
        await page.locator("#players").selectOption("2");
        check(await page.locator("#price").textContent() === "£36", `${width}: weekday price`);
        await page.locator("#date").fill("2027-12-04");
        check(await page.locator("#price").textContent() === "£44", `${width}: weekend price`);
        await page.locator("#review").click();
        check(await page.locator("#request").isVisible() && (await page.locator("#summary").textContent()).includes("Isolation"), `${width}: selection review dialog`);
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty contact validation`);
        await page.locator("[name='name']").fill("Example team");
        await page.locator("[name='email']").fill("team@example.test");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("No booking"), `${width}: truthful local completion`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#request").isVisible(), `${width}: keyboard dismissal`);
        await page.locator("[data-room='0']").click();
        check(await page.locator("#focus").inputValue() === "0" && (await page.locator("#selection").textContent()).includes("No room"), `${width}: room focus resets stale slot`);
        await page.locator("#players").selectOption("6");
        check(await page.locator("#price").textContent() === "£96", `${width}: six-person group price`);
        await page.locator("#gift-amount").selectOption("72");
        await page.locator("#gift").click();
        check((await page.locator("#gift-result").textContent()).includes("£72 gift preview") && (await page.locator("#gift-result").textContent()).includes("No voucher"), `${width}: gift mock scoped honestly`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile menu");
            await page.locator("#menu").click();
            check(await page.locator(".calendar-scroll").evaluate((node) => node.scrollWidth > node.clientWidth), "mobile calendar scrolls internally");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
