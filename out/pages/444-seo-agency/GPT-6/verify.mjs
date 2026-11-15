import { audit } from "../../436-restaurant/GPT-6/serial.mjs";
export async function verify()
{
    return audit("444-seo-agency", async (page, check, width) =>
    {
        check(await page.locator(".keyword").count() === 8 && await page.locator(".case-grid article").count() === 3, `${width}: full keywords and cases`);
        await page.locator('[data-period="6"]').click();
        check(await page.locator("#traffic-total").textContent() === "9,400" && (await page.locator("#chart-title").textContent()).includes("6 months"), `${width}: six-month chart`);
        await page.locator('[data-period="18"]').click();
        check(await page.locator("#traffic-total").textContent() === "61,400", `${width}: full chart restored`);
        await page.locator("#keyword-search").fill("procurement");
        check(await page.locator(".keyword").count() === 2, `${width}: relevant keyword filter`);
        await page.locator("#keyword-search").fill("no matching query");
        check(await page.locator("#keyword-empty").isVisible() && await page.locator(".keyword").count() === 0, `${width}: keyword empty state`);
        await page.locator("#reset-keywords").click();
        check(await page.locator(".keyword").count() === 8, `${width}: keyword reset`);
        await page.locator('[data-case="1"]').click();
        check((await page.locator("#modal-body").textContent()).includes("not a measured result"), `${width}: case limitations`);
        await page.keyboard.press("Escape");
        await page.locator('[data-plan="Growth"]').click();
        check((await page.locator("#selected-plan").textContent()).includes("Growth interest"), `${width}: plan context`);
        await page.locator("#audit-form > button").click();
        check(await page.locator("#audit-status").textContent() === "", `${width}: empty brief blocked`);
        await page.locator('[name="name"]').fill("Demo Alias");
        await page.locator('[name="company"]').fill("Example Company");
        await page.locator('[name="goal"]').fill("Increase qualified visits to our example product.");
        await page.locator(".consent input").check();
        await page.locator('[name="website"]').fill("not a website");
        await page.locator("#audit-form > button").click();
        check(await page.locator("#audit-status").textContent() === "", `${width}: invalid URL blocked`);
        await page.locator('[name="website"]').fill("ftp://example.com");
        await page.locator("#audit-form > button").click();
        check((await page.locator("#audit-status").textContent()).includes("http or https"), `${width}: unsupported protocol rejected`);
        await page.locator('[name="website"]').fill("https://example.com");
        await page.locator("#audit-form > button").click();
        check((await page.locator("#audit-status").textContent()).includes("Website not inspected") && (await page.locator("#audit-status").textContent()).includes("No audit requested"), `${width}: truthful local audit checklist`);
        await page.locator("#privacy").click();
        check((await page.locator("#modal-body").textContent()).includes("never crawled"), `${width}: privacy limits`);
        await page.locator(".close").click();
        check(await page.locator('[type="password"], [type="email"]').count() === 0, `${width}: no credentials or email`);
        if (width < 800)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#results"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
