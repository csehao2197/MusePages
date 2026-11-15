import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("412-pet-boarding", async (page, check, width) =>
    {
        check(await page.locator("#timeline li").count() === 10 && await page.locator(".rooms article").count() === 3 && await page.locator("tbody tr").count() === 5, `${width}: complete routine rooms exact rate table`);
        check((await page.locator("tbody tr").first().textContent()).includes("£168") && (await page.locator("tbody tr").last().textContent()).includes("£182"), `${width}: brief week and fortnight prices`);
        await page.locator("#next-update").click();
        check((await page.locator("#message-title").textContent()).includes("Otto"), `${width}: next sample update`);
        await page.locator("#next-update").click();
        await page.locator("#next-update").click();
        check((await page.locator("#message-title").textContent()).includes("Bramble"), `${width}: sample update wraps`);
        await page.locator(".packing input").first().check();
        await page.locator(".packing input").nth(2).check();
        check(await page.locator("#packed").textContent() === "2 of 6 packed", `${width}: useful packing checklist count`);
        await page.locator("#clear-packing").click();
        check(await page.locator("#packed").textContent() === "0 of 6 packed", `${width}: packing reset`);
        await page.locator("#requirements summary").nth(2).click();
        check((await page.locator("#requirements details[open]").textContent()).includes("free half-day"), `${width}: trial-day requirements`);
        await page.locator('[data-room="deluxe"]').click();
        check(await page.locator("#room").inputValue() === "deluxe", `${width}: accommodation handoff`);
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("departure after arrival"), `${width}: empty dates rejected`);
        await page.locator("#arrival").fill("2030-07-14");
        await page.locator("#departure").fill("2030-07-14");
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("departure after arrival"), `${width}: zero night stay rejected`);
        await page.locator("#departure").fill("2030-07-30");
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("pet name"), `${width}: empty pet details rejected`);
        await page.locator("#pet-name").fill("<b>Bramble</b>");
        await page.locator("#breed").fill("Golden retriever");
        await page.locator("#weight").fill("0");
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("0.5 to 120kg"), `${width}: dog weight guard`);
        await page.locator("#weight").fill("28");
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("Acknowledge"), `${width}: care confirmation acknowledgement`);
        await page.locator("#ack").check();
        await page.locator("#stay-form .button").click();
        check((await page.locator("#result").textContent()).includes("16 nights") && (await page.locator("#result").textContent()).includes("half-day trial") && (await page.locator("#result").textContent()).includes("neutering"), `${width}: exact nights, first trial and long stay conditions`);
        check(await page.locator("#result b").count() === 0 && (await page.locator("#result").textContent()).includes("No live availability checked"), `${width}: safe local unsent summary`);
        await page.locator("#room").selectOption("cat");
        check(await page.locator("#weight").isDisabled() && !await page.locator("#weight-label").isVisible(), `${width}: cat cabin does not require dog weight`);
        await page.locator("#stay-form [type=reset]").click();
        await page.waitForTimeout(50);
        check(await page.locator("#pet-name").inputValue() === "" && await page.locator("#result").textContent() === "" && !await page.locator("#weight").isDisabled(), `${width}: reset clears details and restores dog fields`);
        if (width < 767)
        {
            check(await page.locator(".mobile-book").isVisible(), `${width}: pinned mobile stay link`);
            await page.locator("#menu").click();
            check(await page.locator("#navigation").isVisible(), `${width}: mobile navigation`);
            await page.keyboard.press("Escape");
            check(!await page.locator("#navigation").isVisible(), `${width}: menu escape`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
