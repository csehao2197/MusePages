import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Folio Help — How can we help?",
    tags: ["Help Center", "Article Library", "Terracotta Editorial"],
    assets: ["article.html"],
    mocks: "Twelve illustrative product guides and local feedback/support; no live service or agent.",
    mobile: async (page, check) =>
    {
        await page.locator(".article-link").first().click();
        check(await page.locator(".toc").isVisible(), "Mobile article navigation");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile article no overflow");
        await page.screenshot({ path: "out/pages/218-saas-help-center-page/GPT-6/.checks/article-mobile.png", fullPage: true });
    }
}, async (page, check) =>
{
    check(await page.locator(".category").count() === 6, "Six help categories");
    check(await page.locator(".article-link").count() === 6, "Six popular articles");
    await page.locator("#all").click();
    check(await page.locator(".article-link").count() === 12, "All twelve articles");
    await page.locator('[data-category="4"]').click();
    check(await page.locator(".article-link").count() === 2, "Integration category");
    await page.locator("#search").fill("password");
    check(await page.locator(".article-link").count() >= 1, "Live search");
    await page.locator("#search").fill("zznotfoundzz");
    check(await page.locator("#empty").isVisible(), "No results state");
    await page.locator("#reset").click();
    check(await page.locator(".article-link").count() === 12, "Search reset");
    await page.locator('[data-search="Slack"]').click();
    check((await page.locator(".article-link").first().textContent()).includes("Slack"), "Popular search shortcut");
    await page.locator(".article-link").first().click();
    check((await page.title()).includes("Connect Folio"), "Actual article URL");
    check(await page.locator("article h2").count() === 4, "Article heading structure");
    check(await page.locator(".callout").count() === 3, "Info warning tip callouts");
    check((await page.locator("pre").textContent()).includes("#launch-team"), "Specific guide example");
    await page.locator('.toc a[href="#steps"]').click();
    check(page.url().endsWith("#steps"), "Article anchor navigation");
    await page.locator('[data-helpful="yes"]').click();
    check((await page.locator("#feedback-status").textContent()).includes("Thank you"), "Article helpful vote");
    await page.locator('[data-helpful="no"]').click();
    check(await page.locator('[data-helpful="yes"]').getAttribute("aria-pressed") === "false", "Feedback exclusive selection");
    check(await page.locator("#related a").count() >= 1, "Related article links");
    await page.screenshot({ path: "out/pages/218-saas-help-center-page/GPT-6/.checks/article-desktop.png", fullPage: true });
    await page.locator(".link-button").click();
    check(await page.locator("dialog").isVisible(), "Article support link opens contact");
    await page.locator('#support-form input').fill("alex@example.com");
    await page.locator('#support-form textarea').fill("Help me configure notifications.");
    await page.locator('#support-form button').click();
    check((await page.locator("#support-status").textContent()).includes("No message was sent"), "Honest support outcome");
    await page.locator(".close").click();
    await page.locator('[data-support="Status page"]').click();
    check((await page.locator("#support-copy").textContent()).includes("does not monitor"), "Status clearly illustrative");
});
