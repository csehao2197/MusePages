import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("288-bookstore", async (page, check, width) =>
    {
        await page.locator("[data-pick='0']").click();
        check(await page.locator("#book-title").inputValue() === "Piranesi", `${width}: staff recommendation reserve prefill`);
        check(await page.locator("#book-author").inputValue() === "Susanna Clarke", `${width}: correct selected author`);
        await page.locator("#book-form button").click();
        check((await page.locator("#book-status").textContent()).includes("valid email"), `${width}: request email required`);
        await page.locator("#book-email").fill("reader@example.com");
        await page.locator("#book-form button").click();
        check((await page.locator("#book-status").textContent()).includes("Nothing ordered"), `${width}: local reserve draft only`);
        await page.keyboard.press("Escape");
        await page.locator("[data-category='Poetry']").click();
        check(await page.locator(".result").count() === 1 && (await page.locator(".result").textContent()).includes("Devotions"), `${width}: poetry section filter`);
        await page.locator("#search").fill("unfindable");
        check(await page.locator(".result").count() === 0 && (await page.locator("#result-count").textContent()).includes("No sample"), `${width}: no-match search`);
        await page.locator("#reset").click();
        check(await page.locator(".result").count() === 10, `${width}: reset full sample`);
        await page.locator("#search").fill("clarke");
        check(await page.locator(".result").count() === 1, `${width}: author search`);
        await page.locator("#reset").click();
        await page.locator("[data-category='Gifts & Cards']").click();
        check((await page.locator("#result-count").textContent()).includes("ask us"), `${width}: honest empty category`);
        await page.locator("[data-event='0']").click();
        await page.locator("#places").fill("2");
        check((await page.locator("#event-total").textContent()).includes("£16"), `${width}: ticket estimate calculation`);
        await page.locator("#places").fill("0");
        await page.locator("#event-form button").click();
        check((await page.locator("#event-status").textContent()).includes("1 to 6"), `${width}: invalid place count rejected`);
        await page.locator("#places").fill("2");
        await page.locator("#event-form button").click();
        check((await page.locator("#event-status").textContent()).includes("valid email"), `${width}: attendance contact validation`);
        await page.locator("#attendee").fill("Rowan");
        await page.locator("#event-email").fill("rowan@example.com");
        await page.locator("#event-form button").click();
        check((await page.locator("#event-status").textContent()).includes("Nothing reserved"), `${width}: no false ticket issuance`);
        await page.locator("[data-close='event-dialog']").click();
        await page.locator("#join-club").click();
        check((await page.locator("#event-title").textContent()).includes("Klara"), `${width}: current club title`);
        check((await page.locator("#event-total").textContent()).includes("Free"), `${width}: free club attendance`);
        await page.keyboard.press("Escape");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("valid email"), `${width}: empty newsletter error`);
        await page.locator("#newsletter-email").fill("booklover@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("No subscription"), `${width}: local newsletter only`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "bookshop mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "bookshop menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
