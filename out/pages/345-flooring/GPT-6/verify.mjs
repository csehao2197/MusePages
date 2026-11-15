import { audit } from "../../341-festival/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("345-flooring", async (page, check, width) =>
    {
        check(await page.locator("figure img").evaluate((image) => image.naturalWidth > 0), `${width}: original room art loads`);
        check(await page.locator("#price-rows tr").count() === 9, `${width}: complete nine-product table`);
        await page.locator("[data-finish='walnut']").click();
        check((await page.locator("#finish-price").textContent()).includes("£120/m²"), `${width}: walnut supply and fit`);
        check((await page.locator("#room-title").textContent()).includes("American Walnut"), `${width}: visualiser accessible name changes`);
        const walnut = await page.locator("html").getAttribute("style");
        check(walnut.includes("#73513b"), `${width}: actual floor colour changes`);
        await page.locator("#estimate button").click();
        check((await page.locator("#estimate-result").textContent()).includes("£2,400.00"), `${width}: area estimate`);
        await page.locator("#level").check();
        await page.locator("#uplift").check();
        await page.locator("#estimate button").click();
        check((await page.locator("#estimate-result").textContent()).includes("£2,920.00"), `${width}: levelling and uplift arithmetic`);
        await page.locator("[data-finish='herringbone']").click();
        check(await page.locator("#room-floor").getAttribute("fill") === "url(#herring)", `${width}: herringbone pattern swaps`);
        await page.locator("[data-finish='lvt-stone']").click();
        check(await page.locator("#room-floor").getAttribute("fill") === "url(#stone)", `${width}: stone pattern swaps`);
        await page.locator("#area").fill("0");
        await page.locator("#estimate button").click();
        check((await page.locator("#estimate-result").textContent()).includes("between"), `${width}: invalid area rejected`);
        await page.locator("#project-search").fill("LVT");
        check(await page.locator(".project").count() === 1, `${width}: project material search`);
        await page.locator("#project-search").fill("absent");
        check(await page.locator("#project-empty").isVisible() && await page.locator(".project").count() === 0, `${width}: empty projects state`);
        await page.locator("#project-search").fill("");
        check(await page.locator(".project").count() === 3, `${width}: project reset`);
        await page.locator("#survey-form button").click();
        check((await page.locator("#survey-result").textContent()).includes("UK postcode"), `${width}: invalid form rejected`);
        await page.locator("[name='name']").fill("Example Owner");
        await page.locator("[name='postcode']").fill("NG7 3NR");
        await page.locator("[name='phone']").fill("01155550163");
        await page.locator("[name='current']").fill("Old carpet");
        await page.locator("[name='rooms']").fill("0");
        await page.locator("#survey-form button").click();
        check((await page.locator("#survey-result").textContent()).includes("whole rooms"), `${width}: room bounds enforced`);
        await page.locator("[name='rooms']").fill("3");
        await page.locator("#survey-form button").click();
        check((await page.locator("#survey-result").textContent()).includes("3 rooms") && (await page.locator("#survey-result").textContent()).includes("no appointment"), `${width}: truthful survey preview`);
        await page.getByText("How should I clean the floor?", { exact: true }).click();
        check(await page.locator("details").nth(1).getAttribute("open") !== null, `${width}: care disclosure`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: states fit viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
