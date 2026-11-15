import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("328-dog-groomer-boutique", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((img) => img.naturalWidth > 0), `${width}: original artisanal poodle`);
        check(await page.locator(".package").count() === 4, `${width}: four exact packages`);
        await page.locator("[data-package='2']").click();
        check((await page.locator("#summary").textContent()).includes("£75"), `${width}: package summary routes`);
        await page.locator("#assessment").check();
        check((await page.locator("#summary").textContent()).includes("Individual assessment"), `${width}: matting assessment state`);
        await page.locator("#assessment").uncheck();
        await page.locator("[data-filter='curly']").click();
        check(await page.locator(".gallery button").count() === 3, `${width}: curly gallery filter`);
        await page.locator("[data-filter='double']").click();
        check(await page.locator(".gallery button").count() === 1, `${width}: double-coat gallery filter`);
        await page.locator(".gallery button").click();
        check(await page.locator("#gallery-title").textContent() === "Samoyed", `${width}: correct gallery content`);
        await page.locator("#gallery-next").click();
        check(await page.locator("#gallery-title").textContent() === "Labradoodle", `${width}: next portrait changes`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: Escape gallery close`);
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact error`);
        await page.locator("#name").fill("Sample Parent");
        await page.locator("#email").fill("parent@example.com");
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("whole age"), `${width}: complete pet details required`);
        await page.locator("#dog").fill("Bertie");
        await page.locator("#size").selectOption("large");
        await page.locator("#age").fill("24");
        await page.locator("#package").selectOption("0");
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("small breeds"), `${width}: Tidy size restriction`);
        await page.locator("#package").selectOption("3");
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("under 12"), `${width}: puppy eligibility`);
        await page.locator("#age").fill("8");
        await page.locator("#date").fill("2027-04-18");
        await page.locator("#time").selectOption("Morning / 08:00–12:00");
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("Monday–Saturday"), `${width}: Sunday rejected`);
        await page.locator("#date").fill("2027-04-19");
        await page.locator("#care-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or reserved"), `${width}: honest care note`);
        await page.locator("#dog").fill("Updated Pet");
        check(await page.locator("#status").textContent() === "", `${width}: stale result cleared`);
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".gallery button").count() === 6, `${width}: complete sketchbook reset`);
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") !== null, `${width}: FAQ expands`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "boutique mobile nav");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
