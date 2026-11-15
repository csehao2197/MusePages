import { audit } from "../../321-dentist/GPT-6/serial-run.mjs";

export async function verify()
{
    return audit("330-dog-walking", async (page, check, width) =>
    {
        check(await page.locator(".hero-art img").evaluate((image) => image.naturalWidth > 0), `${width}: original woodland illustration loads`);
        check(await page.locator(".dog").count() === 6, `${width}: six individual pack portraits`);
        await page.locator("[data-group='long']").click();
        check((await page.locator("#group-detail").textContent()).includes("£22"), `${width}: long walk price and suitability detail`);
        check(decodeURIComponent(await page.locator("#meet-email").getAttribute("href")).includes("The Long Ones"), `${width}: selected group reaches email draft`);
        await page.locator("[data-group='solo']").click();
        check((await page.locator("#group-detail").textContent()).includes("your vet"), `${width}: solo recovery suitability note`);
        await page.locator("[data-filter='steady']").click();
        check(await page.locator(".dog").count() === 3 && (await page.locator("#pack-count").textContent()).startsWith("3"), `${width}: gentle pack filter and count`);
        await page.getByRole("button", { name: "Meet Sid, staffie cross", exact: true }).click();
        check(await page.locator("#dog-dialog").isVisible() && await page.locator("#dog-name").textContent() === "Sid", `${width}: individual dog profile`);
        check(await page.locator("#dog-image").evaluate((image) => image.complete && image.naturalWidth > 0), `${width}: profile portrait loads`);
        await page.keyboard.press("Escape");
        check(!await page.locator("#dog-dialog").isVisible(), `${width}: keyboard profile dismissal`);
        await page.locator("[data-filter='long']").click();
        check(await page.locator(".dog").count() === 3 && (await page.locator("#pack-grid").textContent()).includes("MABEL"), `${width}: long legs pack differs`);
        await page.getByRole("button", { name: "Meet Peg, whippet", exact: true }).click();
        await page.locator("#dog-walk").click();
        check(!await page.locator("#dog-dialog").isVisible() && await page.locator("[data-group='long']").getAttribute("aria-pressed") === "true", `${width}: profile routes to relevant group`);
        await page.getByRole("button", { name: "Meet Peg, whippet", exact: true }).click();
        await page.locator("#dialog-close").click();
        check(!await page.locator("#dog-dialog").isVisible(), `${width}: visible close control`);
        await page.locator("[data-filter='all']").click();
        check(await page.locator(".dog").count() === 6, `${width}: complete pack restored`);
        await page.locator("[data-route='moor']").click();
        check((await page.locator("#route-distance").textContent()).includes("6.4 KM") && (await page.locator("#route-title").textContent()).includes("moor"), `${width}: moor sample report`);
        await page.locator("[data-route='river']").click();
        check((await page.locator("#route-note").textContent()).includes("No swimming") && (await page.locator("#route-distance").textContent()).includes("3.1 KM"), `${width}: distinct river report`);
        await page.locator("#coverage-form button").click();
        check(await page.locator("#postcode").getAttribute("aria-invalid") === "true", `${width}: empty postcode validation`);
        await page.locator("#postcode").fill("S7<script>");
        await page.locator("#coverage-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("Enter a Sheffield"), `${width}: malformed postcode rejected`);
        await page.locator("#postcode").fill("s7 1aa");
        await page.locator("#coverage-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("S7 is in the example area") && (await page.locator("#coverage-result").textContent()).includes("still need confirming"), `${width}: normalized in-area postcode remains nonbinding`);
        check(decodeURIComponent(await page.locator("#meet-email").getAttribute("href")).includes("outward postcode is S7"), `${width}: local area included in mail draft`);
        await page.locator("#postcode").fill("S11");
        await page.locator("#coverage-form button").click();
        check((await page.locator("#coverage-result").textContent()).startsWith("S11 is in"), `${width}: two digit outward code`);
        await page.locator("#postcode").fill("S6 1AA");
        await page.locator("#coverage-form button").click();
        check((await page.locator("#coverage-result").textContent()).includes("outside the listed area"), `${width}: out-of-area state`);
        check(!decodeURIComponent(await page.locator("#meet-email").getAttribute("href")).includes("outward postcode"), `${width}: stale valid area removed from draft`);
        check(await page.locator(".hero a[href='tel:+441145550180']").count() === 1, `${width}: direct call action`);
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no persisted personal information`);
        if (width === 1200)
        {
            check(await page.locator(".lead").isVisible(), "desktop lead visible");
            check(Number(await page.locator("#lead-path").evaluate((path) => path.style.strokeDashoffset)) === 0, "reduced motion lead fully drawn");
            await page.emulateMedia({ reducedMotion: "no-preference" });
            await page.evaluate(() =>
            {
                document.documentElement.style.scrollBehavior = "auto";
                window.scrollTo(0, 0);
            });
            await page.waitForTimeout(100);
            const before = Number(await page.locator("#lead-path").evaluate((path) => path.style.strokeDashoffset));
            await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
            await page.waitForTimeout(100);
            const after = Number(await page.locator("#lead-path").evaluate((path) => path.style.strokeDashoffset));
            check(before > after && after < 1, "lead pays out along actual scroll");
            await page.emulateMedia({ reducedMotion: "reduce" });
        }
        else
        {
            check(!await page.locator(".lead").isVisible(), "mobile decorative lead hidden");
            check(await page.locator(".pack-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length === 2), "mobile two column pack");
            check(await page.locator(".hero-art").evaluate((art) => art.getBoundingClientRect().top < document.querySelector(".hero-copy").getBoundingClientRect().top), "mobile artwork above headline");
        }
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: no overflow after interactive states`);
    });
}

if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
