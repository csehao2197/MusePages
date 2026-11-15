import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("343-fine-dining-restaurant-ember-and-stone", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original fire illustration loaded`);
        check(await page.locator(".dish").count() === 6, `${width}: six starters`);
        await page.locator("[data-course='Mains']").click();
        check(await page.locator(".dish").count() === 6 && (await page.locator("#menu-items").textContent()).includes("$155"), `${width}: complete mains and prices`);
        await page.locator("[data-course='Mains']").press("ArrowRight");
        check(await page.locator("[data-course='Desserts']").getAttribute("aria-selected") === "true" && await page.locator(".dish").count() === 4, `${width}: keyboard tabs`);
        await page.locator("[data-course='Drinks']").click();
        check((await page.locator("#menu-items").textContent()).includes("$28/glass"), `${width}: drinks pricing`);
        await page.locator("[data-note='2']").click();
        check(await page.locator("#note").textContent() === "Nothing for decoration.", `${width}: editorial slider`);
        await page.locator("#private-button").click();
        check(await page.locator("[name='occasion']").inputValue() === "Private dining" && await page.locator("#party option").count() === 15, `${width}: private dining 8 through 22 guests`);
        await page.locator("form button").click();
        check((await page.locator("#reservation-result").textContent()).includes("future date"), `${width}: empty date rejected`);
        await page.locator("[name='date']").fill("2020-01-01");
        await page.locator("form button").click();
        check((await page.locator("#reservation-result").textContent()).includes("future date"), `${width}: past date rejected`);
        await page.locator("[name='date']").fill("2030-07-12");
        await page.locator("form button").click();
        check((await page.locator("#reservation-result").textContent()).includes("valid email"), `${width}: empty contacts rejected`);
        await page.locator("[name='name']").fill("Example Diner");
        await page.locator("[name='email']").fill("diner@example.test");
        await page.locator("[name='phone']").fill("5551234567");
        await page.locator("form button").click();
        check((await page.locator("#reservation-result").textContent()).includes("acknowledge"), `${width}: local request consent`);
        await page.locator("[name='consent']").check();
        await page.locator("[name='party']").selectOption("22");
        await page.locator("form button").click();
        check((await page.locator("#reservation-result").textContent()).includes("22 guests") && (await page.locator("#reservation-result").textContent()).includes("no table reserved"), `${width}: truthful private request review`);
        await page.locator("[name='occasion']").selectOption("Table reservation");
        check(await page.locator("#party option").count() === 8, `${width}: table party range resets`);
        if (width < 768)
        {
            await page.locator("#menu-toggle").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile navigation`);
            await page.locator("nav a[href='#menu']").click();
            check(await page.locator("#menu-toggle").getAttribute("aria-expanded") === "false", `${width}: menu closes on navigation`);
        }
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: all states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
