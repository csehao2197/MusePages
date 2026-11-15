import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Orbit — A Little Off Course",
    tags: ["SaaS Error Recovery", "Original Astronaut Illustration", "Sage Minimalism"],
    mocks: "Error-state selector, local access/notification previews, sample maintenance; localStorage article cache, not a PWA.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-state="403"]').click();
        await page.locator("#access").click();
        check(await page.locator("#access-form").isVisible(), "Mobile access dialog");
    }
}, async (page, check) =>
{
    await page.locator("#search").fill("zzznomatch");
    await page.locator("#search-form button").click();
    check((await page.locator("#search-results").textContent()).includes("No matching"), "Search empty state");
    await page.locator("#search").fill("quickstart");
    await page.locator("#search-form button").click();
    check(await page.locator('#search-results [data-doc="Quickstart guide"]').count() === 1, "Local article search");
    await page.locator('#search-results [data-doc="Quickstart guide"]').click();
    await page.locator("#save-offline").click();
    check((await page.locator("#cache-status").textContent()).includes("saved"), "Save offline guide");
    await page.locator(".close").click();
    await page.locator('[data-destination="dashboard"]').click();
    check((await page.locator("#working-page").textContent()).includes("3 active"), "Working dashboard destination");
    await page.locator('#state-content [data-state="404"]').click();
    await page.locator('#state-content [data-destination="home"]').click();
    check((await page.locator("#working-page").textContent()).includes("Welcome to Orbit"), "Working home destination");
    await page.locator('nav [data-state="500"]').click();
    check((await page.locator(".reference").textContent()).includes("ORB-"), "Support reference");
    await page.locator("#retry").click();
    check((await page.locator("#state-status").textContent()).includes("remains unavailable"), "Honest server retry");
    await page.locator(".status-action").click();
    check((await page.locator("#dialog-body").textContent()).includes("Not connected"), "Status transparency");
    await page.locator(".close").click();
    await page.locator('[data-state="403"]').click();
    await page.locator("#access").click();
    await page.locator("#access-email").fill("alex@example.com");
    await page.locator("#access-reason").fill("Need access to the project plan");
    await page.locator("#access-form button").click();
    check((await page.locator("#access-result").textContent()).includes("Nothing was sent"), "Honest access request");
    await page.locator(".close").click();
    await page.locator('[data-state="maintenance"]').click();
    check(await page.locator("progress").getAttribute("value") === "72", "Sample maintenance progress");
    await page.locator("#notify-email").fill("alex@example.com");
    await page.locator("#notify button").click();
    check((await page.locator("#state-status").textContent()).includes("No subscription"), "Honest notification");
    await page.locator('[data-state="offline"]').click();
    check((await page.locator("#cached-content").textContent()).includes("Quickstart guide"), "Cached content available");
    await page.locator("#retry").click();
    check((await page.locator("#state-status").textContent()).includes("online connection"), "Connection detection");
    await page.reload({ waitUntil: "networkidle" });
    await page.locator('[data-state="offline"]').click();
    check((await page.locator("#cached-content").textContent()).includes("Quickstart guide"), "Cache persists reload");
    await page.locator('#cached-content [data-doc]').click();
    check((await page.locator("#dialog-body").textContent()).includes("invite a teammate"), "Cached article readable");
});
