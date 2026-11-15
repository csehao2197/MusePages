import { audit } from "../../351-game-studio/GPT-6/serial-run.mjs";
export async function verify()
{
    return audit("353-glamping", async (page, check, width) =>
    {
        check(await page.locator(".tent-row").count() === 4 && await page.locator("tbody tr").count() === 4, `${width}: complete stays and prices`);
        check(await page.locator(".inventory-list > div").count() === 6, `${width}: packing inventory complete`);
        await page.locator("[data-stay='Curlew']").click();
        check(await page.locator("[name='stay']").inputValue() === "Curlew", `${width}: tent selection reaches planner`);
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("real arrival"), `${width}: missing date`);
        await page.locator("[name='arrival']").fill("2027-02-30");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("real arrival"), `${width}: impossible date rejected`);
        await page.locator("[name='arrival']").fill("2020-05-14");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("future"), `${width}: past date rejected`);
        await page.locator("[name='arrival']").fill("2030-05-17");
        await page.locator("[name='guests']").selectOption("3");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("at most 2"), `${width}: capacity checked`);
        await page.locator("[name='guests']").selectOption("2");
        await page.locator("[name='dog']").check();
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("Larch and Rede"), `${width}: dog restriction`);
        await page.locator("[name='dog']").uncheck();
        await page.locator("[name='children']").check();
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("adults only"), `${width}: adult-only pitch checked`);
        await page.locator("[name='children']").uncheck();
        await page.locator("[name='stay']").selectOption("Larch");
        await page.locator("[name='arrival']").fill("2030-01-11");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("March to October"), `${width}: closed canvas season`);
        await page.locator("[name='stay']").selectOption("The Hut");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("£350"), `${width}: winter hut weekend total`);
        await page.locator("[name='stay']").selectOption("Larch");
        await page.locator("[name='arrival']").fill("2030-05-17");
        await page.locator("[name='dog']").check();
        await page.locator("[name='hamper']").check();
        await page.locator("[name='holiday']").check();
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("three night"), `${width}: holiday minimum`);
        await page.locator("[name='holiday']").uncheck();
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("£353") && (await page.locator("#stay-result").textContent()).includes("nothing reserved"), `${width}: weekend plus extras, truthful total`);
        check((await page.locator("#booking-link").getAttribute("href")).startsWith("mailto:") && (await page.locator("#booking-link").getAttribute("href")).includes("Larch"), `${width}: selected enquiry email draft`);
        await page.locator("[name='nights']").selectOption("3");
        check(!await page.locator("#booking-link").isVisible(), `${width}: stale result cannot be enquired`);
        await page.locator("[name='arrival']").fill("2030-10-31");
        await page.locator("#stay-form button").click();
        check((await page.locator("#stay-result").textContent()).includes("March to October"), `${width}: entire stay season checked`);
        await page.locator("[data-info='access']").click();
        check((await page.locator("#info-copy").textContent()).includes("not been verified"), `${width}: honest accessibility detail`);
        await page.keyboard.press("Escape");
        if (width < 768)
        {
            await page.locator("#menu-button").click();
            check(await page.locator("#menu-button").getAttribute("aria-expanded") === "true", `${width}: mobile menu opens`);
            await page.locator("#mobile-menu a[href='#inside']").click();
            check(!await page.locator("#mobile-menu").isVisible(), `${width}: mobile navigation closes`);
        }
        check(await page.evaluate(() => localStorage.length === 0), `${width}: no guest data persisted`);
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}: planner fits viewport`);
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
