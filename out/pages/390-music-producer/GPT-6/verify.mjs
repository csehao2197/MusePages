import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("390-music-producer", async (page, check, width) =>
    {
        check(await page.locator(".track").count() === 6 && await page.locator("tbody tr").count() === 8, `${width}: original work/credit scope`);
        check(await page.locator(".waveform i").count() === 40 && await page.locator("#player").getAttribute("data-state") === "stopped", `${width}: no autoplay`);
        await page.locator("[data-play='0']").click();
        await page.waitForFunction(() => window.studioAudio.context?.state === "running" && window.studioAudio.context.currentTime > .1);
        check(await page.evaluate(() => window.studioAudio.context.state === "running" && window.studioAudio.scheduledNotes > 8 && window.studioAudio.context.currentTime > .1), `${width}: actual scheduled Web Audio notes/running clock`);
        check(await page.locator("#player").getAttribute("data-state") === "playing" && (await page.locator("#now-playing").textContent()).includes("NIGHT TRANSIT"), `${width}: play state`);
        await page.locator("#mute").click();
        check(await page.locator("#mute").getAttribute("aria-pressed") === "true", `${width}: mute control`);
        await page.locator("#mute").click();
        await page.locator("[data-play='1']").click();
        check(await page.locator("[data-play='0']").getAttribute("aria-pressed") === "false" && await page.locator("[data-play='1']").getAttribute("aria-pressed") === "true", `${width}: one active study`);
        await page.locator("#stop").click();
        check(await page.locator("#player").getAttribute("data-state") === "stopped", `${width}: stop audio`);
        await page.locator("[data-filter=Electronic]").click();
        check(await page.locator(".track").count() === 2, `${width}: genre filter`);
        await page.locator("[data-reference='2']").click();
        check(await page.locator("#reference").inputValue() === "Afterimage", `${width}: reference handoff`);
        await page.locator("[data-service='Mixing & Mastering']").click();
        check(await page.locator("#service").inputValue() === "Mixing & Mastering", `${width}: service handoff`);
        await page.locator("#brief [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("project name"), `${width}: empty artist error`);
        await page.locator("[name=artist]").fill("<Example Artist>");
        await page.locator("[name=direction]").fill("short");
        await page.locator("#brief [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("15 characters"), `${width}: direction length validation`);
        await page.locator("[name=direction]").fill("A warm electronic EP with a restrained bass sound.");
        await page.locator("#brief [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("acknowledgement"), `${width}: local-only scope`);
        await page.locator("[name=ack]").check();
        await page.locator("#brief [type=submit]").click();
        check((await page.locator("#result").textContent()).includes("Afterimage") && (await page.locator("#result").textContent()).includes("No enquiry sent") && await page.locator("#result example").count() === 0, `${width}: exact safe local summary`);
        await page.locator("[type=reset]").click();
        check(await page.locator("[name=artist]").inputValue() === "", `${width}: clear draft`);
        await page.locator("[data-filter=All]").click();
        await page.locator("[data-play='3']").click();
        await page.waitForFunction(() => document.querySelector("#player").dataset.state === "stopped", undefined, { timeout: 6000 });
        check(await page.locator("#player").getAttribute("data-state") === "stopped", `${width}: automatic preview end`);
        if (width < 760)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
