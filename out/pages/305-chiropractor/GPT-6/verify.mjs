import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("305-chiropractor", async (page, check, width) =>
    {
        await page.locator("[data-condition='2']").click();
        check((await page.locator("#condition-copy").textContent()).includes("many causes"), `${width}: neutral headaches information`);
        await page.locator("[data-condition='5']").click();
        check((await page.locator("#condition-copy").textContent()).includes("no single perfect"), `${width}: desk information`);
        await page.locator("[data-person='Marcus Webb']").click();
        check(await page.locator("#person").inputValue() === "Marcus Webb", `${width}: team preference`);
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: empty appointment`);
        await page.locator("#date").fill("2027-02-07");
        await page.locator("#date").dispatchEvent("change");
        check((await page.locator("#time").textContent()).includes("Closed"), `${width}: Sunday empty times`);
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("Sundays"), `${width}: closed date rejected`);
        await page.locator("#date").fill("2027-02-06");
        await page.locator("#date").dispatchEvent("change");
        check(await page.locator("#time option").count() === 3, `${width}: Saturday shortened hours`);
        await page.locator("#location").selectOption("Video discussion");
        await page.locator("#type").selectOption("75");
        check((await page.locator("#estimate").textContent()).includes("£75"), `${width}: sample fee`);
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("introductory discussion only"), `${width}: video clinical boundary`);
        await page.locator("#type").selectOption("0");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("name"), `${width}: required name`);
        await page.locator("#name").fill("Jamie");
        await page.locator("#email").fill("bad");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid email`);
        await page.locator("#email").fill("jamie@example.com");
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("Acknowledge"), `${width}: preference acknowledgement`);
        await page.locator("#accept").check();
        await page.locator("#form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing scheduled, charged or sent"), `${width}: honest preference summary`);
        await page.locator(".faq details").last().locator("summary").click();
        check((await page.locator(".faq details").last().textContent()).includes("Reloading clears"), `${width}: privacy explanation`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "clinic mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
