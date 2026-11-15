import { audit } from "../../331-doula/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("339-farm", async (page, check, width) =>
    {
        check(await page.locator(".hero > img").evaluate((image) => image.naturalWidth > 0), `${width}: original landscape loaded`);
        check(await page.locator(".month").count() === 12 && await page.locator(".month[aria-current='date']").count() === 1, `${width}: twelve months and one clock-derived current marker`);
        await page.locator("[data-month='5']").focus();
        check(await page.locator("#produce").textContent() === "Strawberries", `${width}: accessible June season preview`);
        await page.locator("[data-month='11']").focus();
        check(await page.locator("#produce").textContent() === "Parsnips", `${width}: December differs`);
        await page.locator("#search").focus();
        const month = await page.evaluate(() => new Date().getMonth());
        const produce = ["Leeks", "Purple sprouting", "Forced rhubarb", "Asparagus", "Broad beans", "Strawberries", "New potatoes", "Sweetcorn", "Plums", "Squash", "Cavolo nero", "Parsnips"];
        check(await page.locator("#produce").textContent() === produce[month], `${width}: blur restores today`);
        check(await page.locator(".produce-row").count() === 14, `${width}: full growing index`);
        await page.locator("#season-filter").selectOption("now");
        check(await page.locator(".produce-row").count() > 0 && await page.locator(".produce-row").count() < 14, `${width}: current-season filter`);
        await page.locator("#search").fill("no-such-crop");
        check(await page.locator("#empty").isVisible(), `${width}: empty produce state`);
        await page.locator("#reset-produce").click();
        await page.locator("#search").fill("apples");
        check(await page.locator(".produce-row").count() === 2, `${width}: produce text search`);
        await page.locator(".box-list [data-box='fruit']").click();
        check(await page.locator("[name='frequency'] option").count() === 1 && (await page.locator("#box-summary").textContent()).includes("£9"), `${width}: seasonal fruit box frequency and price`);
        await page.locator("[name='box']").selectOption("meat");
        check(await page.locator("[name='frequency']").inputValue() === "quarterly" && (await page.locator("#box-summary").textContent()).includes("£65"), `${width}: quarterly meat schedule`);
        await page.locator("[name='box']").selectOption("large");
        check(await page.locator("[name='frequency'] option").count() === 2, `${width}: ordinary frequency choices restored`);
        await page.locator("[name='frequency']").selectOption("fortnightly");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("valid email"), `${width}: empty enquiry rejected`);
        await page.locator("[name='name']").fill("Example neighbour");
        await page.locator("[name='email']").fill("neighbour@example.test");
        await page.locator("[name='date']").fill("2027-12-03");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("Choose Thursday"), `${width}: collection weekday enforced`);
        await page.locator("[name='date']").fill("2027-12-02");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("No order or subscription"), `${width}: nonbinding collection review`);
        await page.locator("[name='method']").selectOption("delivery");
        check(await page.locator("#postcode-label").isVisible(), `${width}: delivery postcode revealed`);
        await page.locator("[name='date']").fill("2027-12-03");
        await page.locator("[name='postcode']").fill("invalid");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("full UK postcode"), `${width}: malformed postcode`);
        await page.locator("[name='postcode']").fill("HR6 9BT");
        await page.locator("form button").click();
        check((await page.locator("#result").textContent()).includes("Delivery distance, harvest and dates need direct confirmation"), `${width}: delivery remains unverified`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#order").isVisible(), `${width}: keyboard dismissal`);
        check(await page.locator("#hours .today").count() === 1, `${width}: current-day shop hours`);
        if (width < 700)
        {
            await page.locator("#menu").click();
            check(await page.locator("nav").isVisible(), "mobile menu opens");
            await page.locator("#menu").click();
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
