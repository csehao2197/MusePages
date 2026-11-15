import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("287-bike-shop", async (page, check, width) =>
    {
        check(await page.locator("#tier-price").textContent() === "£65", `${width}: default minor service`);
        await page.locator("[data-tier='3']").click();
        check(await page.locator("#tier-price").textContent() === "FROM £260", `${width}: custom build minimum price`);
        check((await page.locator("#tier-items").textContent()).includes("torque log"), `${width}: custom build inclusions`);
        check((await page.locator("#turnaround").textContent()).includes("5 days"), `${width}: queue formula`);
        await page.locator("#workshop [data-book]").click();
        check(await page.locator("#booking-title").textContent() === "CUSTOM BUILD", `${width}: selected tier carries into planner`);
        await page.locator("#request button").click();
        check((await page.locator("#request-status").textContent()).includes("future"), `${width}: missing date`);
        await page.locator("#date").fill("2027-01-04");
        await page.locator("#request button").click();
        check((await page.locator("#request-status").textContent()).includes("closed"), `${width}: Monday rejected`);
        await page.locator("#date").fill("2027-01-05");
        await page.locator("#request button").click();
        check((await page.locator("#request-status").textContent()).includes("Describe"), `${width}: description and contact required`);
        await page.locator("#problem").fill("Commuter, grinding bottom bracket.");
        await page.locator("#email").fill("bad");
        await page.locator("#request button").click();
        check((await page.locator("#request-status").textContent()).includes("valid email"), `${width}: malformed email rejected`);
        await page.locator("#email").fill("rider@example.com");
        await page.locator("#request button").click();
        check((await page.locator("#request-status").textContent()).includes("Nothing booked"), `${width}: local request only`);
        await page.locator("#close").click();
        await page.locator("#repair-search").fill("brake");
        check(await page.locator(".repair").count() === 3, `${width}: repair search matches jobs`);
        await page.locator("#repair-search").fill("unicorn");
        check(await page.locator(".repair").count() === 0 && (await page.locator("#repair-count").textContent()).includes("No repair"), `${width}: repair empty state`);
        await page.locator("#repair-search").fill("");
        check(await page.locator(".repair").count() === 14, `${width}: reset repair list`);
        await page.locator("#pace").selectOption("fast");
        check((await page.locator("#route").textContent()).includes("not no-drop"), `${width}: fast pace safety expectations`);
        await page.locator("#pace").selectOption("social");
        check((await page.locator("#route").textContent()).includes("Nobody left behind"), `${width}: social ride detail`);
        await page.locator("[data-fit='Full fit']").click();
        check(await page.locator("#booking-cost").textContent() === "£150 · 2.5 hours", `${width}: fitting selection`);
        await page.keyboard.press("Escape");
        if (width === 390)
        {
            check(await page.locator(".mobile-book").isVisible(), "bike mobile service bar");
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "bike mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "bike mobile menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
