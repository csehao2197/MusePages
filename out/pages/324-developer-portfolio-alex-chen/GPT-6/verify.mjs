import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("324-developer-portfolio-alex-chen", async (page, check, width) =>
    {
        await page.locator("#command").fill("stack");
        await page.locator("#terminal-form button").click();
        check((await page.locator("#terminal-output").textContent()).includes("PostgreSQL"), `${width}: terminal stack command`);
        await page.locator("#command").fill("<script>bad</script>");
        await page.locator("#terminal-form button").click();
        check((await page.locator("#terminal-output").textContent()).includes("Unknown command"), `${width}: unknown command safe text`);
        await page.locator("#command").fill("clear");
        await page.locator("#terminal-form button").click();
        check(await page.locator("#terminal-output").textContent() === "", `${width}: terminal clear`);
        await page.locator("#search").fill("missing");
        check(await page.locator("#empty").isVisible() && await page.locator(".project").count() === 0, `${width}: project empty state`);
        await page.locator("#reset-search").click();
        check(await page.locator(".project").count() === 3, `${width}: project reset`);
        await page.locator("#search").fill("Prisma");
        check(await page.locator(".project").count() === 1, `${width}: technology search`);
        await page.locator("#search").fill("");
        await page.locator("[data-project='0']").click();
        await page.locator("#period").selectOption("month");
        check(await page.locator("#metric").textContent() === "48,920", `${width}: analytics period changes dataset`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible(), `${width}: demo Escape close`);
        await page.locator("[data-project='1']").click();
        check(await page.locator("#minus").isDisabled(), `${width}: empty cart lower bound`);
        await page.locator("#plus").click();
        await page.locator("#plus").click();
        check(await page.locator("#subtotal").textContent() === "Subtotal: $96.00", `${width}: cart arithmetic`);
        for (let n = 0; n < 3; n++) await page.locator("#plus").click();
        check(await page.locator("#plus").isDisabled(), `${width}: cart upper bound`);
        for (let n = 0; n < 5; n++) await page.locator("#minus").click();
        check((await page.locator("#subtotal").textContent()).includes("empty"), `${width}: cart removal empty state`);
        await page.locator("#close").click();
        await page.locator("[data-project='2']").click();
        await page.locator("#task-state").selectOption("Done");
        check((await page.locator("#task-status").textContent()).includes("→ Done"), `${width}: task workflow changes`);
        await page.locator("#close").click();
        await page.locator("[data-repo='focus']").click();
        check((await page.locator("#demo-content").textContent()).includes("visible focus"), `${width}: repository design note`);
        await page.locator("#close").click();
        await page.locator("#contact-form button").click();
        check((await page.locator("#status").textContent()).includes("valid email"), `${width}: empty contact error`);
        await page.locator("#name").fill("Sample Dev");
        await page.locator("#email").fill("sample@example.com");
        await page.locator("#brief").fill("short");
        await page.locator("#contact-form button").click();
        check((await page.locator("#status").textContent()).includes("20 characters"), `${width}: brief validation`);
        await page.locator("#stage").selectOption("New idea");
        await page.locator("#brief").fill("A keyboard-accessible dashboard for a local project.");
        await page.locator("#contact-form button").click();
        check((await page.locator("#status").textContent()).includes("Nothing sent or saved"), `${width}: honest project preview`);
        const promise = page.waitForEvent("download");
        await page.locator("#download").click();
        const download = await promise;
        check(download.suggestedFilename() === "alex-chen-concept-profile.txt", `${width}: local profile download`);
        await download.delete();
        if (width === 390)
        {
            await page.locator("#menu").click();
            check(await page.locator("#nav").isVisible(), "developer mobile navigation");
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
