import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("326-dj", async (page, check, width) =>
    {
        check(await page.locator("#waveform i").count() === 80, `${width}: full signal artwork`);
        check(await page.locator("figure img").evaluate((img) => img.naturalWidth > 0), `${width}: original performer image`);
        await page.locator("#motion").click();
        check(await page.locator("body").evaluate((body) => body.classList.contains("paused")), `${width}: animation pause`);
        await page.locator("[data-play='0']").click();
        check((await page.locator("#now-playing").textContent()).includes("DEAD RECKONING"), `${width}: actual synth playback starts`);
        await page.waitForTimeout(300);
        check(await page.locator("#progress").evaluate((p) => p.value > 0), `${width}: playback progresses`);
        await page.locator("#volume").fill("0.02");
        check(await page.locator("#volume").inputValue() === "0.02", `${width}: volume control`);
        await page.locator("[data-play='1']").click();
        check(await page.locator('[data-play][aria-pressed="true"]').count() === 1, `${width}: one active sound source`);
        await page.locator("#stop").click();
        check(await page.locator("#stop").isDisabled() && await page.locator("#progress").evaluate((p) => p.value === 0), `${width}: stop cleanup`);
        await page.locator("[data-play='9']").click();
        check((await page.locator("#now-playing").textContent()).includes("INNER GROOVE"), `${width}: mix control plays original sketch`);
        await page.locator("#stop").click();
        await page.locator("#city").fill("Berlin");
        check(await page.locator(".show").count() === 2, `${width}: city filter`);
        await page.locator("#city").fill("nowhere");
        check(await page.locator("#no-shows").isVisible(), `${width}: empty shows state`);
        await page.locator("#clear").click();
        check(await page.locator(".show").count() === 9, `${width}: shows reset`);
        await page.locator("[data-show='0']").click();
        check((await page.locator("#show-copy").textContent()).includes("Year unconfirmed"), `${width}: schedule honesty`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: Escape event close`);
        await page.locator("[data-show='0']").click();
        await page.locator("#event-enquiry").click();
        check(await page.locator("#venue").inputValue() === "London" && await page.locator("#date").inputValue() === "", `${width}: event routing without false date`);
        await page.locator("#booking-form button").click();
        check((await page.locator("#status").textContent()).includes("valid contact"), `${width}: contact validation`);
        await page.locator("#email").fill("booker@example.com");
        await page.locator("#date").fill("2020-01-01");
        await page.locator("#booking-form button").click();
        check((await page.locator("#status").textContent()).includes("future"), `${width}: past event rejected`);
        await page.locator("#date").fill("2027-04-15");
        await page.locator("#attendance").fill("1.5");
        await page.locator("#booking-form button").click();
        check((await page.locator("#status").textContent()).includes("whole-number"), `${width}: fractional attendance rejected`);
        await page.locator("#attendance").fill("250");
        await page.locator("#message").fill("short");
        await page.locator("#booking-form button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: room brief required`);
        await page.locator("#message").fill("An intimate listening room with a considered techno audience.");
        await page.locator("#booking-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or reserved"), `${width}: honest local booking preview`);
        const pending = page.waitForEvent("download");
        await page.locator("#press").click();
        const download = await pending;
        check(download.suggestedFilename() === "void-concept-press-sheet.txt", `${width}: actual press download`);
        await download.delete();
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "artist mobile menu");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
