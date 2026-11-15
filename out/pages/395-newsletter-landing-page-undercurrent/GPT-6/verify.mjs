import { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";
export async function verify()
{
    return audit("395-newsletter-landing-page-undercurrent", async (page, check, width) =>
    {
        check(await page.locator(".issue").count() === 6, `${width}: six archive issues`);
        await page.locator("#search").fill("cable");
        check(await page.locator(".issue").count() === 1 && (await page.locator(".issue").textContent()).includes("082"), `${width}: archive topical search`);
        await page.locator(".issue summary").click();
        check(await page.locator(".issue").getAttribute("open") !== null, `${width}: inline excerpt opens`);
        await page.locator("#search").fill("xyzmissing");
        check(await page.locator("#empty").isVisible() && await page.locator(".issue").count() === 0, `${width}: empty search state`);
        await page.locator("#clear-search").click();
        check(await page.locator(".issue").count() === 6, `${width}: archive reset`);
        await page.locator(".subscribe").first().locator("button").click();
        check((await page.locator(".status").first().textContent()).includes("valid email"), `${width}: empty subscription validation`);
        await page.locator("#email-top").fill("invalid");
        await page.locator(".subscribe").first().locator("button").click();
        check(await page.locator("#email-top").getAttribute("aria-invalid") === "true", `${width}: malformed email validation`);
        await page.locator("#email-top").fill("reader@example.com");
        await page.locator(".subscribe").first().locator("button").click();
        check((await page.locator(".status").last().textContent()).includes("No subscription created"), `${width}: local confirmation synchronizes honestly`);
        await page.locator("#reset-subscription").click();
        check(await page.locator("#email-top").inputValue() === "" && await page.locator(".status").last().textContent() === "", `${width}: reset erases tab data`);
        await page.locator("#email-bottom").fill("second@example.com");
        await page.locator(".subscribe").last().locator("button").click();
        check((await page.locator(".status").first().textContent()).includes("second@example.com"), `${width}: second subscription form works`);
        await page.locator(".letter").scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        check((await page.locator(".letter").getAttribute("class")).includes("open"), `${width}: unfolding triggered`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
