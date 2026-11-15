export async function run(page, assert)
{
    assert(await page.locator(".system-row").count() === 7, "Seven monitored surfaces");
    await page.locator('[data-filter="attention"]').click();
    assert(await page.locator("#empty").isVisible(), "Healthy attention filter empty");
    await page.locator("#scenario").selectOption("rpc");
    await page.locator("#run").click();
    assert(await page.locator(".system-row").count() === 1, "RPC failure filter");
    assert(await page.locator("#severity").textContent() === "HIGH", "RPC severity");
    assert((await page.locator("#incident-body").textContent()).includes("3 consecutive"), "RPC >2 threshold");
    assert(await page.locator("#recover").isDisabled(), "Recovery initially gated");
    await page.locator("#ack").click();
    assert(await page.locator("#recover").isDisabled(), "Acknowledgment alone insufficient");
    await page.locator("#contain").click();
    assert((await page.locator("#deploy-status").textContent()).includes("PAUSED"), "Contained local gate");
    await page.locator("#recover").click();
    assert(await page.locator("#incident-count").textContent() === "0", "Incident recovered");
    assert((await page.locator("#deploy-status").textContent()).includes("PAUSED"), "Recovery preserves paused gate");
    await page.locator("#scenario").selectOption("hash");
    await page.locator("#run").click();
    assert(await page.locator("#severity").textContent() === "CRITICAL", "Hash drift critical");
    assert((await page.locator("#incident-body").textContent()).includes("GitHub issue + email".toUpperCase()), "Critical escalation channel");
    await page.locator("#scenario").selectOption("catalog");
    await page.locator("#run").click();
    assert((await page.locator("#systems").textContent()).includes("49 catalog"), "Catalog threshold sample");
    await page.locator("#scenario").selectOption("eval");
    await page.locator("#run").click();
    assert((await page.locator("#incident-body").textContent()).includes("88%"), "Evaluation regression sample");
    await page.locator("#scenario").selectOption("ci");
    await page.locator("#run").click();
    assert((await page.locator("#systems").textContent()).includes("90%"), "CI failure below 100%");
    await page.locator('[data-filter="all"]').click();
    await page.locator('[data-detail="catalog"]').click();
    assert((await page.locator("#detail-body").textContent()).includes("at least 50"), "Threshold drilldown");
    await page.keyboard.press("Escape");
    assert(!(await page.locator("#detail").isVisible()), "Detail keyboard close");
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#export").click();
    const download = await downloadEvent;
    assert(download.suggestedFilename() === "stellar-forge-sample-snapshot.json", "Snapshot export");
    await page.locator("#scenario").selectOption("healthy");
    await page.locator("#run").click();
    assert(await page.locator("#incident-count").textContent() === "0", "Healthy rerun resets incident state");
}
if (process.argv[1]?.endsWith("verify.mjs"))
{
    const { verifyStandalone } = await import("../../258-handmade-footwear-store-drizzle-migration-plan/GPT-6/.checks/recheck.mjs");
    await verifyStandalone(import.meta.url, run);
}
