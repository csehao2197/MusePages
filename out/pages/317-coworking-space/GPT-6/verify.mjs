import { audit } from "../../311-cocktail-bar/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("317-coworking-space", async (page, check, width) =>
    {
        check(await page.locator(".desk").count() === 42, `${width}: forty two desks`);
        check(await page.locator(".desk.filled").count() === 31 && await page.locator("#clock").textContent() === "11:00", `${width}: reduced motion final floor`);
        check(await page.evaluate(() => [...document.querySelectorAll("body *")].filter((node) => node.textContent.trim() && getComputedStyle(node).display !== "none").every((node) => parseFloat(getComputedStyle(node).fontSize) >= 14)), `${width}: fourteen pixel minimum text`);
        check((await page.locator("#room-total").textContent()).includes("£18"), `${width}: two free member room hours`);
        await page.locator("#member").selectOption("no");
        check((await page.locator("#room-total").textContent()).includes("£96"), `${width}: nonmember room rate`);
        check(await page.locator("#allowance").isDisabled(), `${width}: nonmember has no free allowance`);
        await page.locator("#room").selectOption("booth");
        check((await page.locator("#room-total").textContent()).includes("members only"), `${width}: nonmember booth unavailable`);
        await page.locator("#member").selectOption("yes");
        check((await page.locator("#room-total").textContent()).includes("free for members"), `${width}: member booths free`);
        await page.locator("#room").selectOption("folio");
        await page.locator("#hours").fill("0");
        check((await page.locator("#room-total").textContent()).includes("1 to 8"), `${width}: invalid room duration`);
        await page.locator("#hours").fill("4");
        await page.locator("#allowance").fill("1");
        check((await page.locator("#room-total").textContent()).includes("£36"), `${width}: remaining free allowance`);
        await page.locator("[data-plan='fixed']").click();
        check(await page.locator("#plan").inputValue() === "fixed", `${width}: membership contextual visit`);
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("worker@example.com");
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("future"), `${width}: date required`);
        await page.locator("#date").fill("2027-02-06");
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("weekday"), `${width}: weekend first visit rejected`);
        await page.locator("#date").fill("2027-02-08");
        await page.locator("#visit-form button").click();
        check((await page.locator("#visit-status").textContent()).includes("£395 a month"), `${width}: selected plan fee`);
        check((await page.locator("#visit-status").textContent()).includes("Nothing booked or sent"), `${width}: honest visit plan`);
        if (width === 1200)
        {
            await page.emulateMedia({ reducedMotion: "no-preference" });
            await page.reload();
            await page.locator("#desks").scrollIntoViewIfNeeded();
            await page.waitForTimeout(2300);
            check(await page.locator(".desk.filled").count() === 31 && await page.locator("#clock").textContent() === "11:00", "normal motion settles at correct floor");
            await page.locator("#home").scrollIntoViewIfNeeded();
            await page.locator("#desks").scrollIntoViewIfNeeded();
            check(await page.locator(".desk.filled").count() === 31, "floor animation does not restart");
            await page.emulateMedia({ reducedMotion: "reduce" });
        }
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "coworking mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
