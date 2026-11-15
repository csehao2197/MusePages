import { audit } from "./serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("280-artist-portfolio", async (page, check, width) =>
    {
        await page.locator("#next").click();
        check(await page.locator("#hero-title").textContent() === "Meridian Blue", `${width}: carousel next updates artwork and caption`);
        await page.locator("#previous").click();
        check(await page.locator("#counter").textContent() === "1 / 6", `${width}: carousel previous`);
        await page.locator("[data-slide='4']").click();
        check((await page.locator("#hero-title").textContent()).includes("Hakodate"), `${width}: direct slide selection`);
        await page.locator("#hero-art").click();
        check(await page.locator("#lightbox").evaluate((el) => el.open), `${width}: featured painting opens lightbox`);
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#lightbox-title").textContent() === "Evidence I", `${width}: lightbox keyboard next`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#lightbox").evaluate((el) => el.open), `${width}: escape dismisses lightbox`);
        await page.locator("[data-medium='Acrylic']").click();
        check(await page.locator(".painting").count() === 1, `${width}: acrylic filter`);
        await page.locator("[data-medium='Mixed media']").click();
        check(await page.locator(".painting strong").textContent() === "Interior Grid", `${width}: mixed-media filter`);
        await page.locator("[data-medium='All']").click();
        await page.locator("#load").click();
        check(await page.locator(".painting").count() === 12, `${width}: all twelve works load`);
        await page.locator("[data-type='Solo']").click();
        check(await page.locator(".exhibition").count() === 6, `${width}: solo exhibition filter`);
        await page.locator("[data-type='Group']").click();
        check(await page.locator(".exhibition").count() === 6, `${width}: group exhibition filter`);
        await page.locator("#cv").click();
        check(await page.locator("#cv-dialog").evaluate((el) => el.open), `${width}: actual CV content`);
        await page.locator("#cv-close").click();
        await page.locator("#enquiry button").click();
        check((await page.locator("#form-status").textContent()).includes("Please"), `${width}: empty contact error`);
        await page.locator("[name=name]").fill("Alex");
        await page.locator("[name=email]").fill("invalid");
        await page.locator("[name=message]").fill("Studio visit enquiry");
        await page.locator("#enquiry button").click();
        check((await page.locator("#form-status").textContent()).includes("valid email"), `${width}: invalid email error`);
        await page.locator("[name=email]").fill("alex@example.com");
        await page.locator("#enquiry button").click();
        check((await page.locator("#form-status").textContent()).includes("Nothing was sent"), `${width}: valid local-only enquiry`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "true", "mobile navigation expanded");
            await page.locator("#navigation a[href='#work']").click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "mobile navigation closes after selection");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
