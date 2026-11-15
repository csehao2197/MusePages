import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Relay — What's New",
    tags: ["Release Notes", "Searchable Timeline", "Blue Editorial"],
    assets: ["feed.xml"],
    mocks: "Sample releases/performance/roadmap, local subscription and feedback previews.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-filter="Fixes"]').click();
        check((await page.locator("#result-count").textContent()).includes("fixes"), "Mobile release filter");
    }
}, async (page, check) =>
{
    check(await page.locator(".release").count() === 3, "Initial page size");
    check((await page.locator(".release").first().textContent()).includes("January 15, 2025"), "Required latest release date");
    await page.locator("#load-more").click();
    check(await page.locator(".release").count() === 5, "Load more releases");
    check((await page.locator("#v2-2-0").textContent()).includes("Breaking change"), "Breaking notice");
    await page.locator('[data-filter="Features"]').click();
    check(await page.locator(".release").count() === 3, "Feature filter");
    check(await page.locator("#v2-3-2").count() === 0, "Patch excluded from features");
    await page.locator("#search").fill("Gantt");
    check(await page.locator(".release").count() === 1, "Keyword search");
    await page.locator("#search").fill("nothingmatches");
    check((await page.locator("#timeline").textContent()).includes("No updates"), "Search empty state");
    await page.locator('.jump[data-release="3"]').click();
    check(await page.locator("#v2-2-0").count() === 1, "Major-release jump reveals older release");
    check(await page.locator("#search").inputValue() === "", "Jump clears search");
    const feed = await page.evaluate(async () =>
    {
        const text = await (await fetch("feed.xml")).text();
        const xml = new DOMParser().parseFromString(text, "application/xml");
        return { items: xml.querySelectorAll("item").length, errors: xml.querySelectorAll("parsererror").length };
    });
    check(feed.items === 5 && feed.errors === 0, "Valid five-entry RSS feed");
    await page.locator("#theme").click();
    check(await page.locator("body").getAttribute("class") === "dark", "Dark theme");
    await page.reload({ waitUntil: "networkidle" });
    check((await page.locator("body").getAttribute("class")).includes("dark"), "Theme persistence");
    await page.locator("#theme").click();
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#subscribe button").click();
    check((await page.locator("#subscribe-status").textContent()).includes("No email subscription"), "Honest subscription preview");
    await page.locator("#manage").click();
    await page.locator("#unsubscribe").click();
    check((await page.locator("#manage-status").textContent()).includes("cleared"), "Clear local preference");
    await page.locator(".close").click();
    await page.locator("#suggest").click();
    await page.locator("#idea").fill("Add custom project templates for our team");
    await page.locator("#feedback-form button").click();
    check((await page.locator("#feedback-status").textContent()).includes("nothing was submitted"), "Feedback preview");
});
