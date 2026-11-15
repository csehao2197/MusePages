import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("283-bakery", async (page, check, width) =>
    {
        await page.locator(".hero [data-order]").click();
        check(await page.locator("#order").evaluate((el) => el.open), `${width}: order menu opens`);
        check((await page.locator("#basket").textContent()).includes("empty"), `${width}: empty basket`);
        await page.locator("#pickup button").click();
        check((await page.locator("#pickup-status").textContent()).includes("empty"), `${width}: empty order blocked`);
        await page.locator("[data-category='Bread']").click();
        check(await page.locator(".menu-item").count() === 2, `${width}: bread filter`);
        await page.locator("[data-add='0']").click();
        await page.locator("[data-add='0']").click();
        check(await page.locator("#total").textContent() === "Demo total: €13.00", `${width}: bread quantity total`);
        await page.locator("[data-category='Pastry']").click();
        check(await page.locator(".menu-item").count() === 3, `${width}: pastry filter`);
        await page.locator("[data-add='2']").click();
        check(await page.locator("#total").textContent() === "Demo total: €16.20", `${width}: mixed basket total`);
        await page.locator("[data-remove='0']").click();
        check(await page.locator("#total").textContent() === "Demo total: €9.70", `${width}: remove one item recalculates`);
        await page.locator("#pickup button").click();
        check((await page.locator("#pickup-status").textContent()).includes("Choose today"), `${width}: missing collection date`);
        await page.locator("#pickup-date").fill("2020-01-01");
        await page.locator("#pickup button").click();
        check((await page.locator("#pickup-status").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("#pickup-date").fill("2027-05-01");
        await page.locator("#pickup button").click();
        check((await page.locator("#pickup-status").textContent()).includes("Nothing reserved"), `${width}: valid demo collection`);
        await page.locator("[data-remove='0']").click();
        await page.locator("[data-remove='2']").click();
        check((await page.locator("#basket").textContent()).includes("empty"), `${width}: remove last items`);
        await page.locator("#order-close").click();
        check(await page.locator("#bag-count").textContent() === "[ 0 ]", `${width}: bag count synchronized`);
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("valid email"), `${width}: invalid newsletter error`);
        await page.locator("#email").fill("baker@example.com");
        await page.locator("#newsletter button").click();
        check((await page.locator("#newsletter-status").textContent()).includes("No subscription"), `${width}: local newsletter only`);
        await page.locator("summary").click();
        check(await page.locator("details").getAttribute("open") !== null, `${width}: process expands`);
        if (width === 390)
        {
            await page.locator("#menu-toggle").click();
            check(await page.locator("#nav").isVisible(), "bakery mobile menu");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu-toggle").getAttribute("aria-expanded") === "false", "bakery menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
