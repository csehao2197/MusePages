import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("370-landscaping-business", async (page, check, width) =>
    {
        check(await page.locator(".services article").count() === 3 && await page.locator(".plant").count() === 6, `${width}: service and plant content`);
        await page.locator("#light").selectOption("shade");
        check(await page.locator(".plant").count() === 3 && (await page.locator("#plants").textContent()).includes("Hellebore"), `${width}: shade palette`);
        await page.locator("#light").selectOption("sun");
        check(await page.locator(".plant").count() === 3 && (await page.locator("#plants").textContent()).includes("Lavender"), `${width}: sun palette`);
        await page.locator("#case-open").click();
        await page.locator("[data-zone='3']").click();
        check((await page.locator("#zone-copy").textContent()).includes("espaliered") && await page.locator("[data-zone='3']").getAttribute("aria-pressed") === "true", `${width}: case-specific kitchen garden detail`);
        await page.keyboard.press("Escape");
        await page.locator("#area").fill("");
        await page.locator("#estimate-form button").click();
        check((await page.locator("#estimate-result").textContent()).includes("10 to 2,000"), `${width}: empty area validation`);
        await page.locator("#area").fill("100");
        await page.locator("#estimate-form button").click();
        check((await page.locator("#range").textContent()).includes("£2,300–£4,000"), `${width}: design formula`);
        await page.locator("#focus").selectOption("Planting");
        check(!await page.locator("#use-plan").isVisible(), `${width}: changed-input stale result guard`);
        await page.locator("#estimate-form button").click();
        check((await page.locator("#range").textContent()).includes("£4,500–£8,500"), `${width}: planting formula`);
        await page.locator("#focus").selectOption("Care");
        await page.locator("#access").selectOption("restricted");
        await page.locator("#estimate-form button").click();
        check((await page.locator("#range").textContent()).includes("£120–£200 / visit") && (await page.locator("#estimate-result").textContent()).includes("excludes any access adjustment"), `${width}: care formula and access limit`);
        await page.locator("#use-plan").click();
        check((await page.locator("[name='message']").inputValue()).includes("100 m²") && (await page.locator("[name='message']").inputValue()).includes("Restricted"), `${width}: selected allowance handoff`);
        await page.locator("#contact-form button").click();
        check((await page.locator("#contact-result").textContent()).includes("valid email"), `${width}: contact error`);
        await page.locator("[name='name']").fill("Example Gardener");
        await page.locator("[name='email']").fill("gardener@example.test");
        await page.locator("#contact-form button").click();
        check((await page.locator("#contact-result").textContent()).includes("Nothing sent"), `${width}: honest local brief`);
        await page.locator("[data-service='Design']").click();
        check(await page.locator("#focus").inputValue() === "Design" && !await page.locator("#use-plan").isVisible(), `${width}: service-to-planner state`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
