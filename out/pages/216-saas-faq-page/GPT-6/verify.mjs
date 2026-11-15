import { verify } from "./lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Gather — Frequently Asked Questions",
    tags: ["SaaS FAQ", "Searchable Knowledge Base", "Sage Editorial"],
    mocks: "Illustrative product policies and browser-only support/resource dialogs; no messages sent.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-category="Billing & Pricing"]').click();
        check(await page.locator("details").count() === 7, "Mobile billing category");
        await page.locator("summary").first().click();
        check(await page.locator("details").first().getAttribute("open") === null, "Mobile native collapse");
    }
}, async (page, check) =>
{
    check(await page.locator("details").count() === 6, "Six getting started answers");
    check(await page.locator("details").first().getAttribute("open") !== null, "Initial answer open");
    await page.locator('[data-category="All topics"]').click();
    check(await page.locator("details").count() === 34, "Seven complete groups");
    await page.locator("#search").fill("encrypted");
    check(await page.locator("details").count() === 1, "Search narrows answers");
    check(await page.locator("mark").count() > 0, "Matching text highlighted");
    await page.locator("summary").click();
    await page.locator('[data-vote="yes"]').click();
    check(await page.locator('[data-vote="yes"]').getAttribute("aria-pressed") === "true", "Helpful vote selected");
    check((await page.locator(".answer small").textContent()).includes("Thanks"), "Helpful acknowledgement");
    await page.locator('[data-vote="no"]').click();
    check(await page.locator('[data-vote="yes"]').getAttribute("aria-pressed") === "false", "Vote switches");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.locator("[data-copy]").click();
    check((await page.evaluate(() => navigator.clipboard.readText())).endsWith("#is-my-data-encrypted"), "Copy exact deep link");
    await page.locator("#search").fill("zzzznotfound");
    check(await page.locator("#empty").isVisible(), "Helpful empty state");
    await page.locator("#clear").click();
    check(await page.locator("details").count() === 34, "Clear resets search and filter");
    await page.locator('[data-search="trial"]').click();
    check(await page.locator("details").count() >= 2, "Popular trial search");
    await page.goto(page.url().split("#")[0] + "#how-do-i-enable-two-factor-authentication", { waitUntil: "networkidle" });
    check(await page.locator("#how-do-i-enable-two-factor-authentication").getAttribute("open") !== null, "Deep link opens correct answer");
    await page.locator('[data-dialog="Contact support"]').click();
    check(await page.locator("dialog").isVisible(), "Support opens");
    await page.locator('#contact input').fill("alex@example.com");
    await page.locator('#contact textarea').fill("I need help importing a CSV.");
    await page.locator('#contact button').click();
    check((await page.locator("#dialog-status").textContent()).includes("No email"), "Honest local submission");
    await page.locator(".close").click();
    await page.locator('[data-dialog="Gather documentation"]').click();
    check((await page.locator("#dialog-copy").textContent()).includes("import your tasks"), "Resource contains usable guide");
    await page.locator(".close").click();
    await page.evaluate(() => window.print = () => document.body.dataset.printed = "true");
    await page.locator("#print").click();
    check(await page.locator("body").getAttribute("data-printed") === "true", "Print invokes browser");
    check(await page.locator("details:not([open])").count() === 0, "Print opens visible answers");
});
