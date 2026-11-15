import { audit } from "./serial.mjs";
export async function verify()
{
    return audit("436-restaurant", async (page, check, width) =>
    {
        check(await page.locator(".dish").count() === 6, `${width}: complete menu teaser`);
        check(await page.locator('a[download]').getAttribute("href") === "menu.txt", `${width}: real downloadable menu`);
        const download = page.waitForEvent("download");
        await page.locator('a[download]').click();
        check((await download).suggestedFilename() === "maison-noir-menu.txt", `${width}: semantic download filename`);
        await page.locator(".hero [data-reserve]").click();
        check(await page.locator("dialog").isVisible(), `${width}: reservation opens`);
        await page.locator("#reservation-form button").click();
        check(await page.locator("#form-status").textContent() === "", `${width}: empty date blocked`);
        const future = new Date();
        future.setDate(future.getDate() + 14);
        while (future.getDay() !== 0) future.setDate(future.getDate() + 1);
        const format = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        await page.locator('[name="date"]').fill(format(future));
        await page.locator("#reservation-form button").click();
        check((await page.locator("#form-status").textContent()).includes("closed Sunday"), `${width}: closure day error`);
        future.setDate(future.getDate() + 2);
        await page.locator('[name="date"]').fill(format(future));
        await page.locator('[name="guests"]').selectOption("4");
        await page.locator('[name="time"]').selectOption("20:00");
        await page.locator("#reservation-form button").click();
        check((await page.locator("#form-status").textContent()).includes("4 guests") && (await page.locator("#form-status").textContent()).includes("not a confirmed booking"), `${width}: honest local plan`);
        await page.keyboard.press("Escape");
        await page.locator('[data-experience="Wine Pairing"]').click();
        check((await page.locator("#context").textContent()).includes("Wine Pairing"), `${width}: experience context`);
        check(await page.locator("#form-status").textContent() === "" && await page.locator('[name="date"]').inputValue() === "", `${width}: fresh modal resets draft`);
        await page.locator(".close").click();
        check(!await page.locator("dialog").isVisible(), `${width}: dialog closes`);
        check(await page.locator('[type="password"],[type="email"]').count() === 0, `${width}: no credentials/contact collection`);
        if (width < 700)
        {
            await page.locator(".menu").click();
            check(await page.locator("nav").isVisible(), `${width}: mobile nav opens`);
            await page.locator('nav a[href="#menu"]').click();
            check(await page.locator(".menu").getAttribute("aria-expanded") === "false", `${width}: mobile nav closes`);
        }
    });
}
if (process.argv[1]?.endsWith("verify.mjs")) console.log(JSON.stringify(await verify()));
