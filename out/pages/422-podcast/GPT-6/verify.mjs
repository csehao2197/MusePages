import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("422-podcast", async (page, check, width) =>
    {
        check(await page.locator("#wave rect").count() === 20 && await page.locator(".episode-card").count() === 6, `${width}: waveform and complete episode concepts`);
        await page.locator("#search").fill("remote");
        check(await page.locator(".episode-card").count() === 1, `${width}: episode search`);
        await page.locator("#search").fill("nothing matches xyz");
        check(await page.locator("#empty").isVisible() && await page.locator(".episode-card").count() === 0, `${width}: empty search guidance`);
        await page.locator("#clear-search").click();
        check(await page.locator(".episode-card").count() === 6, `${width}: clear restores catalog`);
        await page.locator(".episode-card").first().click();
        check((await page.locator("#episode-title").textContent()).includes("Stripe"), `${width}: correct episode notes`);
        await page.locator("#save").click();
        check((await page.locator("#saved-status").textContent()).startsWith("1 "), `${width}: save for visit`);
        await page.locator("#save").click();
        check((await page.locator("#saved-status").textContent()).startsWith("0 "), `${width}: remove saved concept`);
        await page.locator("#sound").click();
        await page.waitForTimeout(300);
        check((await page.locator("#sound-status").textContent()).includes("Playing original") && await page.locator("#progress").evaluate((element) => element.value > 0), `${width}: real Web Audio ident progresses`);
        await page.locator("#sound").click();
        check((await page.locator("#sound-status").textContent()).startsWith("Stopped"), `${width}: sound stops`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#episode").isVisible(), `${width}: episode modal closes`);
        await page.locator('[data-platform="Spotify"]').click();
        check((await page.locator("#platform-status").textContent()).includes("no verified"), `${width}: no false platform redirect`);
        await page.locator("#subscribe .button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty subscription`);
        await page.locator("#email").fill("bad");
        await page.locator("#subscribe .button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: invalid subscription`);
        await page.locator("#email").fill("alex@example.com");
        await page.locator("#subscribe .button").click();
        check((await page.locator("#result").textContent()).includes("Acknowledge"), `${width}: demo acknowledgement`);
        await page.locator("#consent").check();
        await page.locator("#subscribe .button").click();
        check((await page.locator("#result").textContent()).includes("not joined"), `${width}: honest subscription preview`);
        await page.locator("[type=reset]").click();
        check(await page.locator("#email").inputValue() === "" && await page.locator("#result").textContent() === "", `${width}: email clear`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
