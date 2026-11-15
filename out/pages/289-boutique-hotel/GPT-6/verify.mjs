import { audit } from "../../280-artist-portfolio/GPT-6/serial-qa.mjs";
import { fileURLToPath } from "node:url";
export async function verify()
{
    return audit("289-boutique-hotel", async (page, check, width) =>
    {
        await page.locator("[data-room-toggle='1']").click();
        check(await page.locator("#room-detail-1").isVisible(), `${width}: deluxe detail expands`);
        check((await page.locator("#room-detail-1").textContent()).includes("freestanding bath"), `${width}: specific room amenities`);
        await page.locator("#room-detail-1 [data-book]").click();
        check(await page.locator("#room").inputValue() === "1", `${width}: selected room in stay planner`);
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("future arrival"), `${width}: empty dates rejected`);
        await page.locator("#arrive").fill("2027-02-10");
        await page.locator("#depart").fill("2027-02-09");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("after arrival"), `${width}: reversed dates rejected`);
        await page.locator("#depart").fill("2027-02-12");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("valid email"), `${width}: email required`);
        await page.locator("#email").fill("guest@example.com");
        await page.locator("#dinner").check();
        await page.locator("#dog").check();
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("£630 indicative total"), `${width}: two-night deluxe plus dinner total`);
        check((await page.locator("#stay-status").textContent()).includes("Dog arrangements"), `${width}: dog fee not falsely included`);
        check((await page.locator("#stay-status").textContent()).includes("nothing reserved"), `${width}: no false booking claim`);
        await page.locator("#room").selectOption("2");
        await page.locator("#guests").selectOption("1");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("£835 indicative total"), `${width}: suite and one-diner recalculation`);
        await page.locator("#depart").fill("2027-03-10");
        await page.locator("#stay button").click();
        check((await page.locator("#stay-status").textContent()).includes("21 nights"), `${width}: long stay direct enquiry`);
        await page.locator("[data-close='booking']").click();
        await page.locator("[data-gallery='5']").click();
        check(await page.locator("#viewer-title").textContent() === "Coffee on the terrace", `${width}: gallery selected detail`);
        await page.keyboard.press("ArrowRight");
        check(await page.locator("#viewer-count").textContent() === "1 / 6", `${width}: gallery keyboard wraps`);
        await page.locator("#viewer-prev").click();
        check(await page.locator("#viewer-count").textContent() === "6 / 6", `${width}: gallery previous wraps`);
        await page.keyboard.press("Escape");
        await page.locator("[data-menu='vegetarian']").click();
        check((await page.locator("#menu-content").textContent()).includes("Wild mushroom"), `${width}: vegetarian menu swaps`);
        await page.locator("[data-menu='breakfast']").click();
        check((await page.locator("#menu-content").textContent()).includes("Porridge"), `${width}: breakfast menu swaps`);
        await page.locator("[data-experience='2']").click();
        check((await page.locator("#experience-copy").textContent()).includes("independent therapist"), `${width}: actual spa information`);
        await page.locator("[data-close='experience-dialog']").click();
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "Aldwick mobile menu opens");
            await page.locator("#nav a").first().click();
            check(await page.locator("#menu").getAttribute("aria-expanded") === "false", "Aldwick mobile menu closes");
        }
    });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(await verify()));
