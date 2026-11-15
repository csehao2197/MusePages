import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("327-dog-groomer", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((img) => img.naturalWidth > 0), `${width}: original golden portrait`);
        check(await page.locator(".service").count() === 6 && await page.locator(".gallery button").count() === 5, `${width}: complete service/gallery choices`);
        await page.locator("[data-service='1']").click();
        check(await page.locator("#service").inputValue() === "1", `${width}: service routes to enquiry`);
        await page.locator("#size").selectOption("large");
        check(await page.locator("#estimate").textContent() === "From £75", `${width}: full groom size estimate`);
        await page.locator("#condition").selectOption("tangled");
        check(await page.locator("#coat-warning").isVisible() && await page.locator("#estimate").textContent() === "Individual assessment", `${width}: matting removes false fixed estimate`);
        await page.locator("#condition").selectOption("regular");
        await page.locator("#service").selectOption("4");
        check(await page.locator("#estimate").textContent() === "From £12", `${width}: nail service ignores size uplift`);
        await page.locator("[data-coat='doodle']").click();
        check((await page.locator("#coat-info").textContent()).includes("Curl care"), `${width}: doodle care panel`);
        await page.locator("[data-dog='3']").click();
        check(await page.locator("#gallery-title").textContent() === "Maple", `${width}: distinct gallery detail`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: Escape gallery close`);
        await page.locator("#groom-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact rejected`);
        await page.locator("#name").fill("Pet Parent");
        await page.locator("#email").fill("parent@example.com");
        await page.locator("#groom-form button").click();
        check((await page.locator("#status").textContent()).includes("dog's name"), `${width}: pet identity required`);
        await page.locator("#dog").fill("Buddy");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#groom-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("#date").fill("2027-04-18");
        await page.locator("#groom-form button").click();
        check((await page.locator("#status").textContent()).includes("Monday–Saturday"), `${width}: Sunday rejected`);
        await page.locator("#date").fill("2027-04-19");
        await page.locator("#groom-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing booked or sent"), `${width}: honest local groom preview`);
        await page.locator("#size").selectOption("small");
        check(await page.locator("#status").textContent() === "", `${width}: changed service details invalidate preview`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: care FAQ expands`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "Pawfect mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
