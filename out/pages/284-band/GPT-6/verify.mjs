import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("284-band", async (page, check, width) =>
    {
        await page.locator("#stream").click();
        check(await page.locator(".platforms a").count() === 3, `${width}: streaming choices`);
        check((await page.locator("#dialog-copy").textContent()).includes("Fictional album"), `${width}: honest media limits`);
        await page.keyboard.press("Escape");
        await page.locator("[data-track='6']").click();
        check(await page.locator("#dialog-copy h2").textContent() === "The Long Coast", `${width}: selected track notes`);
        check((await page.locator("#dialog-copy").textContent()).includes("7:01"), `${width}: selected track duration`);
        await page.locator("#close").click();
        check(await page.locator(".show").count() === 5, `${width}: full tour archive`);
        check(await page.locator("[data-show='1']").isDisabled(), `${width}: sold out disabled`);
        await page.locator("#tour-filter").click();
        check(await page.locator(".show").count() === 4, `${width}: available archive filter`);
        await page.locator("[data-show='2']").click();
        check((await page.locator("#dialog-copy").textContent()).includes("Berlin"), `${width}: Berlin date details`);
        check((await page.locator("#dialog-copy").textContent()).includes("has passed"), `${width}: archived ticket disclosure`);
        await page.locator("#close").click();
        await page.locator("[data-product='0']").click();
        await page.locator("[data-add]").click();
        check((await page.locator("#product-status").textContent()).includes("Choose a size"), `${width}: missing merch size rejected`);
        await page.locator("#size").selectOption("M");
        await page.locator("[data-add]").click();
        check((await page.locator("#product-status").textContent()).includes("Nothing purchased"), `${width}: local merch add`);
        await page.locator("#close").click();
        await page.locator("#bag").click();
        check((await page.locator("#dialog-copy").textContent()).includes("$32"), `${width}: correct bag total`);
        await page.locator("[data-remove]").click();
        check((await page.locator("#dialog-copy").textContent()).includes("empty"), `${width}: last item removal empty state`);
        await page.locator("#close").click();
        await page.locator("#newsletter button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: invalid newsletter error`);
        await page.locator("#email").fill("listener@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#status").textContent()).includes("No subscription"), `${width}: local subscription state`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "band mobile navigation opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "band mobile navigation closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
