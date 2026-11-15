import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("366-interior-design-studio", async (page, check, width) =>
    {
        check(await page.locator(".project").count() === 12, `${width}: twelve masonry studies`);
        await page.locator("[data-filter='Staging']").click();
        check(await page.locator(".project").count() === 1, `${width}: staging filter`);
        await page.locator("#search").fill("Canal");
        check(await page.locator("#empty").isVisible(), `${width}: combined empty result`);
        await page.locator("[data-filter='All']").click();
        check(await page.locator(".project").count() === 1 && (await page.locator("#counter").textContent()).includes("01 / 12"), `${width}: search and count`);
        await page.locator(".project").click();
        check((await page.locator("#detail-name").textContent()).includes("Canal"), `${width}: matching project details`);
        await page.locator("#inspired").click();
        check((await page.locator("[name='message']").inputValue()).includes("Canal") && await page.locator("[name='type']").inputValue() === "Residential", `${width}: inspiration handoff`);
        await page.locator("#enquiry button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: invalid enquiry`);
        await page.locator("[name='name']").fill("Example Owner");
        await page.locator("[name='email']").fill("owner@example.test");
        await page.locator("#enquiry button").click();
        check((await page.locator("#result").textContent()).includes("Nothing sent"), `${width}: local form success`);
        await page.locator("[data-service='Commercial']").click();
        check(await page.locator("[name='type']").inputValue() === "Commercial", `${width}: commercial service handoff`);
        await page.locator("[data-material='1']").click();
        check((await page.locator("#material-copy").textContent()).includes("Earthy") && await page.locator("[data-material='1']").getAttribute("aria-pressed") === "true", `${width}: material notes and selected state`);
        check(await page.locator("#step-back").isDisabled(), `${width}: process start boundary`);
        for (let i = 0; i < 4; i++) await page.locator("#step-next").click();
        check(await page.locator("#step-next").isDisabled() && (await page.locator("#step-status").textContent()).includes("5 of 5"), `${width}: process end boundary`);
        check(await page.locator("#track").evaluate((el) => el.scrollLeft > 0), `${width}: process actually scrolls`);
        await page.locator("#step-back").click();
        check((await page.locator("#step-status").textContent()).includes("4 of 5"), `${width}: previous process state`);
        await page.locator("#search").fill("");
        check(await page.locator(".project").count() === 12, `${width}: search reset restores studies`);
        if (width < 768)
        {
            await page.locator("#menu").click();
            await page.locator("#nav a").first().click();
            check(!await page.locator("#nav").isVisible(), `${width}: mobile navigation`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
