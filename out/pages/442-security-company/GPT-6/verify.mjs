import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("442-security-company", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 6 && await page.locator(".timeline article").count() === 5, `${width}: complete capabilities and timeline`);
        check(await page.locator("#feed-toggle").textContent() === "Resume feed", `${width}: reduced motion pauses feed`);
        const line = await page.locator("#feed-line").textContent();
        await page.locator("#feed-toggle").click();
        await page.waitForTimeout(3200);
        check(await page.locator("#feed-line").textContent() !== line, `${width}: simulated feed advances`);
        await page.locator("#feed-toggle").click();
        check(await page.locator("#feed-toggle").getAttribute("aria-pressed") === "true", `${width}: feed pauses accessibly`);
        for (let i = 0; i < 4; i++) await page.locator("#next-step").click();
        check(await page.locator("#next-step").isDisabled() && (await page.locator("#simulation-status").textContent()).includes("No report or email"), `${width}: manual simulation completes honestly`);
        await page.locator("#reset-step").click();
        check(await page.locator(".timeline .active").count() === 1 && !await page.locator("#next-step").isDisabled(), `${width}: scenario resets`);
        await page.locator('[data-sector="Education"]').click();
        check((await page.locator("#sector-copy").textContent()).includes("independently verified"), `${width}: education checks disclosed`);
        await page.locator("#sector-select").click();
        check(await page.locator('[name="sector"]').inputValue() === "Education", `${width}: sector carried into form`);
        await page.locator('[data-service="CCTV Monitoring"]').click();
        check(await page.locator('[name="service"]').inputValue() === "CCTV Monitoring", `${width}: service carried into form`);
        await page.locator("#survey-form > button").click();
        check(await page.locator("#survey-status").textContent() === "", `${width}: empty form blocked`);
        await page.locator('[name="company"]').fill("Demo Workshop");
        await page.locator('[name="contact"]').fill("Demo Contact");
        await page.locator('[name="email"]').fill("invalid");
        await page.locator('[name="phone"]').fill("0161 555 0100");
        await page.locator('[name="brief"]').fill("A fictional overview of a sample warehouse.");
        await page.locator(".consent input").check();
        await page.locator("#survey-form > button").click();
        check(await page.locator("#survey-status").textContent() === "", `${width}: invalid email blocked`);
        await page.locator('[name="email"]').fill("demo@example.com");
        await page.locator('[name="phone"]').fill("abcdefg");
        await page.locator("#survey-form > button").click();
        check((await page.locator("#survey-status").textContent()).includes("7 to 15 digits"), `${width}: invalid phone error`);
        await page.locator('[name="phone"]').fill("0161 555 0100");
        await page.locator("#survey-form > button").click();
        check((await page.locator("#survey-status").textContent()).includes("no protection service started"), `${width}: truthful local summary`);
        await page.locator("#control-info").click();
        check((await page.locator("dialog").textContent()).includes("No alarm"), `${width}: control room safety disclosure`);
        await page.keyboard.press("Escape");
        check(!await page.locator("dialog").isVisible() && await page.locator('[type="password"]').count() === 0, `${width}: dismissible dialog and no credentials`);
        if (width < 800)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#response"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
