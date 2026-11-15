export async function run(page, assert)
{
    await page.locator("#pause").click();
    await page.locator('[data-slide="1"]').click();
    assert(await page.locator('[data-slide="1"]').getAttribute("aria-pressed") === "true", "Slideshow indicator");
    assert((await page.locator("#slide-label").textContent()).includes("INTERIORS"), "Slide label synchronized");
    assert(await page.locator(".service").count() === 4, "Four service offerings");
    await page.locator('[data-gallery="0"]').first().click();
    assert(await page.locator("#gallery").isVisible(), "Service image opens gallery");
    await page.locator("#previous").click();
    assert(await page.locator("#gallery-count").textContent() === "4 / 4", "Gallery previous wraps");
    await page.locator("#next").click();
    assert(await page.locator("#gallery-count").textContent() === "1 / 4", "Gallery next wraps");
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#gallery").isVisible()), "Escape closes gallery");
    await page.locator('[data-project-link="retail"]').click();
    assert(await page.locator(".project").count() === 1, "Service links filter projects");
    assert(page.url().includes("filter=retail"), "Category deep link");
    await page.reload();
    assert(await page.locator(".project").count() === 1, "Deep link survives reload");
    await page.locator('[data-filter="all"]').click();
    assert(await page.locator(".project").count() === 4, "All projects restore");
    assert(await page.locator(".project img").evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0)), "Local photos load");
    await page.locator("#contact button").click();
    assert((await page.locator("#contact-status").textContent()).includes("both names"), "Inquiry required fields");
    await page.locator("#first").fill("Alex");
    await page.locator("#last").fill("Studio");
    await page.locator("#email").fill("alex@example.com");
    await page.locator("#needs").fill("Commercial interior photography for a small studio.");
    await page.locator("#website").fill("javascript:alert(1)");
    await page.locator("#contact button").click();
    assert((await page.locator("#contact-status").textContent()).includes("http"), "Unsafe optional link blocked");
    await page.locator("#website").fill("");
    await page.locator("#contact button").click();
    assert((await page.locator("#contact-status").textContent()).includes("No message was sent"), "Honest local inquiry");
    await page.locator("summary").first().click();
    assert(await page.locator("details").first().getAttribute("open") !== null, "FAQ expands");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
