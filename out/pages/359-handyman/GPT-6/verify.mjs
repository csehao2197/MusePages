import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("359-handyman", async (page, check, width) =>
    {
        check(await page.locator(".job").count() === 12 && await page.locator(".slot").count() === 3, `${width}: complete jobs and sample slots`);
        check(await page.locator("#total-price").textContent() === "£0", `${width}: initially empty list`);
        await page.locator("[data-job='tv']").click();
        await page.locator("[data-job='shelf']").click();
        check(await page.locator("#total-price").textContent() === "£110" && (await page.locator("#total-copy").textContent()).includes("1.8 hours"), `${width}: fixed-price and time arithmetic`);
        await page.locator("[data-job='tv']").click();
        check(await page.locator("#total-price").textContent() === "£45" && await page.locator("[data-job='tv']").getAttribute("aria-pressed") === "false", `${width}: job deselection`);
        for (const id of ["hang", "bed", "seal"]) await page.locator(`[data-job='${id}']`).click();
        check((await page.locator("#total-copy").textContent()).includes("2 half-day visits"), `${width}: oversized job list capacity warning`);
        await page.locator("#clear-jobs").click();
        check(await page.locator("#total-price").textContent() === "£0" && await page.locator(".job[aria-pressed='true']").count() === 0, `${width}: reset empties selection`);
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("Pick at least one"), `${width}: empty job request invalid`);
        await page.locator("[data-job='tap']").click();
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("valid phone"), `${width}: contact validation`);
        await page.locator("#check-coverage").click();
        check((await page.locator("#coverage-result").textContent()).includes("full UK postcode"), `${width}: empty coverage input`);
        await page.locator("#postcode").fill("bs16 1aa");
        await page.locator("#check-coverage").click();
        check((await page.locator("#coverage-result").textContent()).includes("travel included"), `${width}: upper boundary included`);
        await page.locator("#postcode").fill("BS17 1AA");
        await page.locator("#check-coverage").click();
        check((await page.locator("#coverage-result").textContent()).includes("outside"), `${width}: adjacent district outside`);
        await page.locator("#postcode").fill("BA12 1AA");
        await page.locator("#check-coverage").click();
        check((await page.locator("#coverage-result").textContent()).includes("outside"), `${width}: BA1 does not overmatch BA12`);
        await page.locator("[name='name']").fill("Example Resident");
        await page.locator("[name='address']").fill("BS6 5AA");
        await page.locator("[name='phone']").fill("07700 900123");
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("preferred sample"), `${width}: slot required`);
        await page.locator("[data-slot='0']").click();
        check((await page.locator("[name='slot']").inputValue()).endsWith("morning"), `${width}: availability slot populates request`);
        await page.locator("[name='photo']").setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("Not an image") });
        check((await page.locator("#photo-status").textContent()).includes("Choose a JPG") && !await page.locator("#photo-preview").isVisible(), `${width}: unsupported photo rejected`);
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("unsupported photo"), `${width}: unsupported file blocks preview`);
        await page.locator("[name='photo']").setInputFiles({ name: "hinge.png", mimeType: "image/png", buffer: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64") });
        check((await page.locator("#photo-status").textContent()).includes("Never uploaded") && await page.locator("#photo-preview").isVisible(), `${width}: valid photo local preview`);
        await page.locator("#booking-form button").click();
        check((await page.locator("#booking-result").textContent()).includes("£70 labour") && (await page.locator("#booking-result").textContent()).includes("No enquiry sent"), `${width}: accurate truthful visit preview`);
        await page.locator("[name='photo']").setInputFiles([]);
        check(!await page.locator("#photo-preview").isVisible(), `${width}: photo removal`);
        if (width < 768)
        {
            check(await page.locator(".job-total").evaluate((el) => getComputedStyle(el).position === "fixed"), `${width}: mobile running total pinned`);
            await page.locator("#menu-button").click();
            await page.locator("#mobile-menu a[href='#rates']").click();
            check(!await page.locator("#mobile-menu").isVisible(), `${width}: mobile navigation`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no household data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: dynamic totals and form fit`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
