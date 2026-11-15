import { audit } from "../../290-bowling-alley/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("298-car-detailing", async (page, check, width) =>
    {
        await page.locator("[data-service='2']").click();
        check(await page.locator("#service-title").textContent() === "Full detail", `${width}: service details`);
        check((await page.locator("#service-list").textContent()).includes("Single-stage"), `${width}: meaningful service scope`);
        await page.locator("#service-quote").click();
        check(await page.locator("#package").inputValue() === "2", `${width}: package preselection`);
        check(await page.locator("#total").textContent() === "$550", `${width}: package base`);
        await page.locator("#size").selectOption("1.25");
        await page.locator("#condition").selectOption("80");
        await page.locator("#pet").check();
        await page.locator("#fabric").check();
        check(await page.locator("#total").textContent() === "$918", `${width}: size condition extras calculation`);
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("make and model"), `${width}: vehicle required`);
        await page.locator("#vehicle").fill("Grand touring coupe");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: name required`);
        await page.locator("#name").fill("Sam Dale");
        await page.locator("#email").fill("bad");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: email validation`);
        await page.locator("#email").fill("sam@example.com");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("preferred date"), `${width}: date required`);
        await page.locator("#date").fill("2027-02-10");
        await page.locator("#quote button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or booked"), `${width}: honest quote state`);
        const href = decodeURIComponent(await page.locator("#email-draft").getAttribute("href"));
        check(href.includes("$918") && href.includes("Pet hair: true") && href.includes("Grand touring"), `${width}: complete quote email`);
        await page.locator("#pet").uncheck();
        check(!await page.locator("#email-draft").isVisible(), `${width}: stale quote invalidated`);
        await page.locator("#compare").fill("25");
        await page.locator("#compare").dispatchEvent("input");
        check(await page.locator("#compare-status").textContent() === "25% before", `${width}: finish comparison`);
        check(await page.locator("#divider").evaluate((el) => el.style.left) === "25%", `${width}: visible comparison divider`);
        await page.locator("#policies").click();
        check((await page.locator("#policy-dialog").textContent()).includes("No payment"), `${width}: policies disclose boundaries`);
        await page.keyboard.press("Escape");
        check((await page.locator(".showreel a").getAttribute("href")).includes("youtube.com/results"), `${width}: honest external film link`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "detail mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "detail menu closes");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
