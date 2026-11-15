import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("404-paintball", async (page, check, width) =>
    {
        check(await page.locator(".packages article").count() === 3 && await page.locator(".day li").count() === 8 && await page.locator(".map button").count() === 6, `${width}: complete packages timeline map`);
        check((await page.locator("#total").textContent()) === "£384", `${width}: exact brief rounding for twelve`);
        await page.locator("#players").fill("9");
        check(await page.locator("#total").textContent() === "£315", `${width}: no discount below ten`);
        await page.locator("#players").fill("10");
        check(await page.locator("#total").textContent() === "£320" && (await page.locator("#discount").textContent()).includes("10%"), `${width}: ten-player threshold`);
        await page.locator("#players").fill("20");
        check(await page.locator("#total").textContent() === "£600" && (await page.locator("#discount").textContent()).includes("15%"), `${width}: twenty-player threshold`);
        await page.locator("#extra").fill("100");
        await page.locator("#players").fill("12");
        check(await page.locator("#total").textContent() === "£420" && (await page.locator("#breakdown").textContent()).includes("400 paintballs"), `${width}: extra paint per person discounted and rounded`);
        await page.locator("#players").fill("");
        check((await page.locator("#cost-error").textContent()).includes("whole number") && await page.locator("#total").textContent() === "—", `${width}: empty calculator guard`);
        await page.locator("#players").fill("5");
        check((await page.locator("#group-note").textContent()).includes("open-day"), `${width}: under minimum open-day note`);
        await page.locator("#cost-form [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#total").textContent() === "£384", `${width}: calculator reset`);
        await page.locator(".map [data-zone='4']").click();
        check(await page.locator("#zone-name").textContent() === "THE YARD" && await page.locator(".zone-row[data-zone='4']").getAttribute("aria-pressed") === "true", `${width}: map and list linked selection`);
        await page.locator(".zone-row[data-zone='5']").focus();
        await page.keyboard.press("Enter");
        check(await page.locator("#zone-name").textContent() === "THE BRIDGE", `${width}: keyboard zone selection`);
        await page.locator("#players").fill("16");
        await page.locator("#package").selectOption("assault");
        await page.locator("#handoff").click();
        check(await page.locator("#booking-players").inputValue() === "16" && await page.locator("#booking-package").inputValue() === "assault", `${width}: calculator enquiry handoff`);
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("future date"), `${width}: empty date guard`);
        await page.locator("#date").fill("2030-01-05");
        await page.locator("#ages").selectOption("under");
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("minimum age"), `${width}: under-twelve guard`);
        await page.locator("#ages").selectOption("junior");
        await page.locator("#occasion").selectOption("birthday");
        await page.locator("#booking-players").fill("7");
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("at least eight"), `${width}: birthday minimum`);
        await page.locator("#occasion").selectOption("corporate");
        await page.locator("#booking-players").fill("41");
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("up to forty"), `${width}: private hire scope guard`);
        await page.locator("#occasion").selectOption("group");
        await page.locator("#booking-players").fill("12");
        await page.locator("#email").fill("bad");
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("valid example email"), `${width}: malformed contact error`);
        await page.locator("#email").fill("organiser@example.com");
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("Acknowledge"), `${width}: local-only acknowledgement`);
        await page.locator("#ack").check();
        await page.locator("#booking-form button").first().click();
        check((await page.locator("#booking-result").textContent()).includes("£120") && (await page.locator("#booking-result").textContent()).includes("guardian process") && (await page.locator("#booking-result").textContent()).includes("No availability"), `${width}: truthful deposit and junior preparation`);
        await page.locator("#booking-form [type=reset]").click();
        check(await page.locator("#email").inputValue() === "" && await page.locator("#booking-result").textContent() === "", `${width}: clear local contact data`);
        if (width < 767)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), `${width}: mobile fullscreen navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#nav").isVisible() && await page.evaluate(() => document.body.style.overflow === ""), `${width}: escape restores scrolling`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
