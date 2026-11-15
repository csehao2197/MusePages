import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "Formwork — Settings",
    tags: ["SaaS Settings", "Local Avatar Crop", "Powder Blue Workspace"],
    mocks: "LocalStorage settings, nonfunctional sample API keys, illustrative billing/sessions/2FA; no real account changes.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-section="notifications"]').click();
        check(await page.locator('#panel [role="switch"]').count() === 18, "Mobile notifications");
        check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile notification table contained");
        await page.screenshot({ path: "out/pages/223-saas-settings-page/GPT-6/.checks/notifications-mobile.png", fullPage: true });
    }
}, async (page, check) =>
{
    check(await page.locator("#settings-nav button").count() === 8, "Eight categories");
    await page.locator('[data-field="name"]').fill("Alex North");
    check(await page.locator("body").getAttribute("class") === "dirty", "Unsaved changes indicator");
    await page.locator("#discard").click();
    check(await page.locator('[data-field="name"]').inputValue() === "Alex Morgan", "Discard restores saved value");
    await page.locator('[data-field="name"]').fill("Alex North");
    await page.locator("#save").click();
    await page.reload({ waitUntil: "networkidle" });
    check(await page.locator('[data-field="name"]').inputValue() === "Alex North", "Profile persisted");
    await page.locator("#avatar-upload").click();
    const image = await page.evaluate(() =>
    {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#bacee2";
        ctx.fillRect(0, 0, 300, 200);
        ctx.fillStyle = "#446789";
        ctx.fillRect(130, 50, 90, 90);
        return canvas.toDataURL().split(",")[1];
    });
    await page.locator("#avatar-file").setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: Buffer.from(image, "base64") });
    await page.waitForFunction(() => !document.querySelector("#apply-crop").disabled);
    const before = await page.locator("canvas").evaluate((canvas) => canvas.toDataURL());
    await page.locator("#zoom").fill("2");
    const after = await page.locator("canvas").evaluate((canvas) => canvas.toDataURL());
    check(before !== after, "Actual canvas crop changes with zoom");
    await page.locator("#apply-crop").click();
    check(await page.locator("img.avatar").count() === 1, "Cropped avatar applied");
    await page.locator("#change-email").click();
    await page.locator("#new-email").fill("alex@example.com");
    await page.locator("#email-form button").click();
    check(await page.locator("input[readonly]").inputValue() === "alex@example.com", "Email local update");
    await page.locator('[data-section="workspace"]').click();
    await page.locator('[data-field="slug"]').fill("Invalid URL!");
    await page.locator("#save").click();
    check((await page.locator("#status").textContent()).includes("lowercase URL"), "Workspace URL validation");
    await page.locator('[data-field="slug"]').fill("north-studio");
    const permission = page.locator('[data-toggle="permission:1:1"]');
    await permission.click();
    check(await permission.getAttribute("aria-checked") === "true", "Permission switch");
    await page.locator("#save").click();
    await page.locator('[data-section="notifications"]').click();
    check(await page.locator('#panel [role="switch"]').count() === 18, "Six by three notification matrix");
    await page.locator('[data-toggle="notification:1:0"]').click();
    check(await page.locator('[data-toggle="notification:1:0"]').getAttribute("aria-checked") === "true", "Notification state");
    await page.locator('[data-section="integrations"]').click();
    await page.locator("#integration-search").fill("unknown-app");
    check(await page.locator("#integration-empty").isVisible(), "Integration empty state");
    await page.locator("#integration-search").fill("github");
    await page.locator('[data-connect="github"]').click();
    await page.locator("#confirm-connection").click();
    check((await page.locator(".integration").textContent()).includes("Connected"), "Integration connected preview");
    await page.locator('[data-section="billing"]').click();
    const pending = page.waitForEvent("download");
    await page.locator('[data-invoice="0"]').click();
    const invoice = await pending;
    check(invoice.suggestedFilename() === "formwork-invoice-202611.txt", "Invoice download name");
    let text = "";
    for await (const chunk of await invoice.createReadStream()) text += chunk;
    check(text.includes("SAMPLE INVOICE") && text.includes("USD 96.00"), "Invoice actual content");
    await page.locator("#cancel-plan").click();
    await page.locator('#cancel-form input').check();
    await page.locator('#cancel-form button').click();
    check((await page.locator(".plan-card").textContent()).includes("Cancels"), "Confirmed local cancellation");
    await page.locator("#cancel-plan").click();
    check((await page.locator(".plan-card").textContent()).includes("Renews"), "Cancellation undo");
    await page.locator('[data-section="security"]').click();
    await page.locator("#password").click();
    await page.locator("#old-password").fill("Old-demo-only");
    await page.locator("#new-password").fill("New-Demo-Password!");
    await page.locator("#confirm-password").fill("Does-not-match");
    await page.locator("#password-form button").click();
    check((await page.locator("#modal-status").textContent()).includes("do not match"), "Password confirmation");
    await page.locator("#confirm-password").fill("New-Demo-Password!");
    await page.locator("#password-form button").click();
    check((await page.locator("#modal-status").textContent()).includes("No password was stored"), "Honest password preview");
    check(await page.locator("#new-password").inputValue() === "", "Password cleared");
    await page.locator(".close").click();
    await page.locator('[data-toggle="2fa"]').click();
    await page.locator("#twofactor-code").fill("000000");
    await page.locator("#twofactor-form button").click();
    check((await page.locator("#modal-status").textContent()).includes("123456"), "2FA invalid sample code");
    await page.locator("#twofactor-code").fill("123456");
    await page.locator("#twofactor-form button").click();
    check(await page.locator('[data-toggle="2fa"]').getAttribute("aria-checked") === "true", "2FA local enabled");
    await page.locator('[data-signout="iphone"]').click();
    check(await page.locator(".session").count() === 2, "Sample session removed");
    await page.locator('#panel [data-section="api"]').click();
    await page.locator("#create-key").click();
    await page.locator("#key-name").fill("Report reader");
    await page.locator("#key-form button").click();
    check(await page.locator(".key-row").count() === 2, "Created nonfunctional identifier");
    await page.locator(".key-row [data-revoke]").last().click();
    await page.locator("#confirm-revoke").click();
    check(await page.locator(".key-row").count() === 1, "Confirmed key revocation");
    await page.locator("#save").click();
    check(!(await page.evaluate(() => localStorage.getItem("formwork-settings"))).includes("New-Demo-Password"), "No secret stored");
    await page.locator('[data-section="profile"]').click();
    await page.screenshot({ path: "out/pages/223-saas-settings-page/GPT-6/.checks/profile-edited-desktop.png", fullPage: true });
    await page.locator('[data-section="account"]').click();
    await page.locator("#delete-account").click();
    await page.locator("#delete-confirm").fill("no");
    await page.locator("#delete-form button").click();
    check((await page.locator("#modal-status").textContent()).includes("exactly"), "Destructive confirmation protected");
    await page.locator("#delete-confirm").fill("DELETE");
    await page.locator("#delete-form button").click();
    check((await page.evaluate(() => JSON.parse(localStorage.getItem("formwork-settings")).profile.name)) === "Alex Morgan", "Local demo reset");
});
