import { verify } from "../../206-realestate-agency-homepage/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "TaskFlow Post — Emails That Move Work Forward",
    tags: ["HTML Email Templates", "Personalized Email Studio", "Lilac Product Design"],
    assets: ["welcome.html", "password-reset.html", "team-invitation.html", "weekly-digest.html", "trial-ending.html"],
    mocks: "Standalone HTML templates with local CTA preview destinations; no email/authentication/payment provider.",
    mobile: async (page, check) =>
    {
        await page.locator("#mobile").click();
        const frame = page.frameLocator("#email-preview");
        check(await frame.locator("body").evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Email mobile overflow");
        await page.locator('[data-template="4"]').click();
        await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("3 days"));
        check((await page.frameLocator("#email-preview").locator("body").textContent()).includes("Upgrade Now"), "Mobile trial template");
    }
}, async (page, check) =>
{
    const frame = () => page.frameLocator("#email-preview");
    await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("Welcome"));
    check((await frame().locator("body").textContent()).includes("Hi Alex"), "Initial personalization");
    check(await frame().locator('table[role="presentation"]').count() >= 4, "Email table layout");
    check(await page.locator("#email-preview").evaluate((element) => element.clientHeight >= element.contentDocument.body.scrollHeight), "Email canvas includes footer without clipping");
    await page.locator('[data-template="1"]').click();
    await page.waitForFunction(() => document.querySelector("#subject").textContent.startsWith("Reset"));
    check((await frame().locator("body").textContent()).includes("24 hours"), "Reset expiry");
    await page.locator('[data-template="2"]').click();
    await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("invited"));
    check((await page.locator("#subject").textContent()).includes("Sarah invited you to join Studio North"), "Invitation subject");
    check((await frame().locator("body").textContent()).includes("7 days"), "Invitation expiry");
    await page.locator("#first-name").fill("Alex <Guest>");
    await page.locator("#workspace").fill("Design & Research");
    await page.locator("#personalize button").click();
    await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("Design & Research"));
    check((await frame().locator("body").textContent()).includes("Hi Alex <Guest>"), "Personalization escaped");
    check(await frame().locator("guest").count() === 0, "No HTML injection");
    await page.locator("#mobile").click();
    check(await page.locator("#email-preview").evaluate((element) => element.getBoundingClientRect().width) === 320, "320px email canvas");
    check(await frame().locator("body").evaluate(() => document.documentElement.scrollWidth <= innerWidth), "320px invitation no overflow");
    await page.locator("#desktop").click();
    check(await page.locator("#email-preview").evaluate((element) => element.getBoundingClientRect().width) === 600, "600px email canvas");
    await page.locator('[data-template="3"]').click();
    await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("weekly"));
    check((await frame().locator("body").textContent()).includes("18.5"), "Digest metrics");
    await page.locator('[data-template="4"]').click();
    await page.waitForFunction(() => document.querySelector("#subject").textContent.includes("3 days"));
    check((await frame().locator("body").textContent()).includes("Unlimited projects"), "Upgrade benefits");
    const pending = page.waitForEvent("download");
    await page.locator("#download").click();
    const download = await pending;
    check(download.suggestedFilename() === "taskflow-trial-ending.html", "Template download filename");
    const stream = await download.createReadStream();
    let html = "";
    for await (const chunk of stream) html += chunk;
    check(html.includes("Alex &lt;Guest&gt;") && html.includes("max-width:600px"), "Downloaded HTML is personalized real template");
    check(!html.includes("<script"), "Email has no script");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.locator("#copy").click();
    await page.waitForFunction(() => document.querySelector("#action-status").textContent.includes("copied"));
    check((await page.evaluate(() => navigator.clipboard.readText())).includes("Upgrade Now"), "Copied actual email HTML");
    const raw = await page.evaluate(async () => (await fetch("welcome.html")).text());
    check(raw.includes("[First Name]"), "Original merge placeholder retained");
    const base = new URL(page.url());
    base.search = "?action=invitation";
    await page.goto(base.href, { waitUntil: "networkidle" });
    await page.locator("#local-action").click();
    check((await page.locator("#dialog-status").textContent()).includes("No account"), "Invitation CTA destination");
    await page.locator(".close").click();
    base.search = "?action=unsubscribe";
    await page.goto(base.href, { waitUntil: "networkidle" });
    await page.locator("#local-action").click();
    check((await page.locator("#dialog-status").textContent()).includes("No real mailing"), "Unsubscribe CTA destination");
});
