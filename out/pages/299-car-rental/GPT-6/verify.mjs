import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("299-car-rental", async (page, check, width) =>
    {
        await page.locator("#search-form button").click();
        check((await page.locator("#search-status").textContent()).includes("return after"), `${width}: empty dates`);
        await page.locator("#from").fill("2027-02-08");
        await page.locator("#to").fill("2027-02-07");
        await page.locator("#search-form button").click();
        check((await page.locator("#search-status").textContent()).includes("return after"), `${width}: reversed dates`);
        await page.locator("#to").fill("2027-02-10");
        await page.locator("#age").fill("20");
        await page.locator("#search-form button").click();
        check((await page.locator("#search-status").textContent()).includes("21–99"), `${width}: underage rejected`);
        await page.locator("#age").fill("23");
        check((await page.locator("#live-estimate").textContent()).includes("£86"), `${width}: live young-driver estimate`);
        await page.locator("#search-form button").click();
        check(await page.locator(".vehicle").count() === 3, `${width}: young-driver classes only`);
        await page.locator("[data-category='SUV']").click();
        check(await page.locator("#empty").isVisible(), `${width}: age category empty state`);
        await page.locator("#reset").click();
        await page.locator("[data-rent='0']").click();
        check(await page.locator("#hire-total").textContent() === "£86", `${width}: initial rental total`);
        await page.locator("#cover").selectOption("11");
        await page.locator("#cover").dispatchEvent("input");
        await page.locator("#seats").fill("1");
        await page.locator("#drivers").fill("1");
        check(await page.locator("#hire-total").textContent() === "£136", `${width}: itemised extras total`);
        check(await page.locator("#hold").textContent() === "£350", `${width}: separate reduced excess hold`);
        await page.locator("#cover").selectOption("19");
        await page.locator("#cover").dispatchEvent("input");
        check(await page.locator("#hire-total").textContent() === "£152", `${width}: zero cover upgrade`);
        check(await page.locator("#hold").textContent() === "£0", `${width}: zero excess hold`);
        await page.locator("#seats").fill("4");
        await page.locator("#rental-form button").click();
        check((await page.locator("#rental-status").textContent()).includes("0–3"), `${width}: invalid extras rejected`);
        await page.locator("#seats").fill("1");
        await page.locator("#rental-form button").click();
        check((await page.locator("#rental-status").textContent()).includes("name"), `${width}: driver name required`);
        await page.locator("#name").fill("Morgan Lane");
        await page.locator("#email").fill("bad");
        await page.locator("#rental-form button").click();
        check((await page.locator("#rental-status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("morgan@example.com");
        await page.locator("#rental-form button").click();
        check((await page.locator("#rental-status").textContent()).includes("Acknowledge"), `${width}: demo consent`);
        await page.locator("#accept").check();
        await page.locator("#rental-form button").click();
        check((await page.locator("#rental-status").textContent()).includes("Nothing booked, charged or sent"), `${width}: honest rental state`);
        await page.keyboard.press("Escape");
        await page.locator("#age").fill("30");
        await page.locator("#return").selectOption("Liverpool");
        await page.locator("#search-form button").click();
        check((await page.locator("#live-estimate").textContent()).includes("£103"), `${width}: one-way fee in estimate`);
        await page.locator("#available").check();
        check(await page.locator(".vehicle").count() < 8, `${width}: deterministic unavailable classes filtered`);
        await page.locator("[data-branch='Leeds']").click();
        await page.locator("#from").fill("2027-02-07");
        await page.locator("#to").fill("2027-02-09");
        await page.locator("#search-form button").click();
        check((await page.locator("#search-status").textContent()).includes("closed on Sunday"), `${width}: branch closed pickup`);
        await page.locator("#months").selectOption("6");
        check(await page.locator("#long-price").textContent() === "£3,400", `${width}: monthly term pricing`);
        check(decodeURIComponent(await page.locator("#long-link").getAttribute("href")).includes("6-month"), `${width}: specific monthly enquiry`);
        await page.locator(".faq details").last().locator("summary").click();
        check((await page.locator(".faq details").last().textContent()).includes("£60"), `${width}: cross-border terms`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "rental menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "rental menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
