import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("281-author", async (page, check, width) =>
    {
        await page.locator("#chapter").click();
        check((await page.locator("#dialog-copy").textContent()).includes("first bird"), `${width}: readable original chapter sample`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#details").evaluate((el) => el.open), `${width}: escape closes reading`);
        await page.locator("[data-buy='The Heron Year']").click();
        check(await page.locator(".retailers a").count() === 2, `${width}: preorder retailer options`);
        check((await page.locator("#dialog-copy").textContent()).includes("No order"), `${width}: no false checkout claim`);
        await page.locator("#close").click();
        await page.locator("[data-buy='Salt Ledger']").click();
        check(await page.locator("#dialog-copy h2").textContent() === "Salt Ledger", `${width}: specific backlist purchase details`);
        await page.locator("#close").click();
        check(await page.locator(".event").count() === 5, `${width}: five future readings`);
        await page.locator("[data-event='4']").click();
        check((await page.locator("#dialog-copy").textContent()).includes("Hay Festival"), `${width}: selected event venue`);
        check((await page.locator("#dialog-copy").textContent()).includes("not being issued"), `${width}: ticket mock disclosure`);
        await page.locator("#close").click();
        await page.locator("#subscribe button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty newsletter rejected`);
        await page.locator("#email").fill("not-an-address");
        await page.locator("#subscribe button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: malformed address rejected`);
        await page.locator("#email").fill("reader@example.com");
        await page.locator("#subscribe button").click();
        check((await page.locator("#status").textContent()).includes("no subscription was created"), `${width}: valid local-only signup`);
        await page.locator("[data-info='Press kit']").click();
        check((await page.locator("#dialog-copy").textContent()).includes("Four novels"), `${width}: actual press information`);
        await page.locator("#close").click();
        check(await page.evaluate(() => [...document.querySelectorAll("body *")].filter((el) => el.textContent.trim() && !["SCRIPT", "STYLE", "SVG", "PATH"].includes(el.tagName)).every((el) => parseFloat(getComputedStyle(el).fontSize) >= 14)), `${width}: no text below fourteen pixels`);
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "author mobile menu opens");
            await page.locator("#nav a[href='#books']").click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "author mobile menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
