export async function run(page, assert)
{
    assert(await page.locator(".device").count() === 2, "Seed devices");
    await page.locator("#add").click();
    await page.locator("#device-name").fill("<b>Test device</b>");
    await page.locator("#device-form button.primary").click();
    assert(await page.locator(".device").count() === 3, "Device created");
    assert((await page.locator(".device").last().textContent()).includes("10.0.0.4"), "Sequential address");
    assert(await page.locator(".device h3 b").count() === 0, "Device names rendered as text");
    await page.locator(".device").last().getByText("Sample profile").click();
    await page.locator("#regenerate").click();
    assert((await page.locator("#profile").textContent()).includes("revision: 2"), "Token regenerated");
    assert((await page.locator("#profile").textContent()).includes("10.0.0.4"), "Regeneration retains address");
    const event = page.waitForEvent("download");
    await page.locator("#download").click();
    assert((await event).suggestedFilename().endsWith(".txt"), "Nonimportable sample download");
    await page.keyboard.press("Escape");
    await page.locator(".device").last().getByText("Remove").click();
    assert(await page.locator(".device").count() === 2, "Device removed");
    await page.locator("#invite button").click();
    assert(await page.locator("#invite-result").textContent() === "All fields are required", "Required registration state");
    await page.locator("#username").fill("demo");
    await page.locator("#password").fill("secret123");
    await page.locator("#confirm").fill("secret123");
    for (const [code, message] of [["bad", "Invalid invitation code"], ["EXPIRED", "Invitation code has expired"], ["FULL", "Invitation code has reached maximum uses"]])
    {
        await page.locator("#code").fill(code);
        await page.locator("#invite button").click();
        assert(await page.locator("#invite-result").textContent() === message, message);
    }
    await page.locator("#code").fill("BETA01");
    await page.locator("#password").fill("short");
    await page.locator("#invite button").click();
    assert((await page.locator("#invite-result").textContent()).includes("at least 6"), "Password length");
    await page.locator("#password").fill("longersecret");
    await page.locator("#invite button").click();
    assert((await page.locator("#invite-result").textContent()).includes("do not match"), "Password match");
    await page.locator("#confirm").fill("longersecret");
    await page.locator("#invite button").click();
    assert((await page.locator("#invite-result").textContent()).includes("No account"), "Honest demo acceptance");
    assert((await page.locator("#usage").textContent()).startsWith("1 /"), "Invitation usage");
    await page.locator("#password").fill("secret123");
    await page.locator("#confirm").fill("secret123");
    await page.locator("#invite button").click();
    assert(await page.locator("#invite-result").textContent() === "Username already exists", "Duplicate account");
    await page.locator("#reset").click();
    assert((await page.locator("#usage").textContent()).startsWith("0 /"), "Reset works");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
