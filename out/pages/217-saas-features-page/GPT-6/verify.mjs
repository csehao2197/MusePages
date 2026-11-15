import { verify } from "../../216-saas-faq-page/GPT-6/lifecycle.mjs";

await verify(import.meta.url,
{
    title: "TaskFlow — Powerful Features for Modern Teams",
    tags: ["SaaS Features", "Interactive Project Board", "Cobalt Product Design"],
    mocks: "Local board, editing, comments and reporting; sample presence, integration, security and case-study content.",
    mobile: async (page, check) =>
    {
        await page.locator('[data-view="timeline"]').click();
        check(await page.locator(".timeline-row").count() >= 4, "Mobile timeline visible");
        await page.locator('[data-team="3"]').click();
        check((await page.locator("#case-title").textContent()).includes("wherever"), "Mobile use case");
    }
}, async (page, check) =>
{
    check(await page.locator(".task").count() === 4, "Four initial tasks");
    await page.locator('[data-move="1"]').click();
    check(await page.locator('[data-stage="1"] [data-id="1"]').count() === 1, "Move forward updates board");
    await page.locator('[data-id="3"]').dragTo(page.locator('[data-stage="2"]'));
    check(await page.locator('[data-stage="2"] [data-id="3"]').count() === 1, "Real drag and drop");
    await page.locator("#add-task").click();
    await page.locator("#task-name").fill("QA <launch>");
    await page.locator("#task-form button").click();
    check(await page.locator(".task").count() === 5, "Task added");
    check((await page.locator('[data-stage="0"]').textContent()).includes("QA <launch>"), "Task safely escaped");
    check(await page.locator("launch").count() === 0, "No task HTML injection");
    await page.locator('[data-view="timeline"]').click();
    check(await page.locator("#timeline .timeline-row").count() === 5, "Timeline reflects actual tasks");
    await page.locator('[data-view="insights"]').click();
    check(await page.locator("#completed").textContent() === "2/5", "Report reflects board");
    await page.locator("#log-time").click();
    check(await page.locator("#hours").textContent() === "19h", "Time tracking updates");
    const pending = page.waitForEvent("download");
    await page.locator("#export").click();
    const download = await pending;
    check(download.suggestedFilename() === "taskflow-launch-report.csv", "Report download");
    let csv = "";
    for await (const chunk of await download.createReadStream()) csv += chunk;
    check(csv.includes("QA <launch>") && csv.includes('"Done"'), "CSV contains actual task state");
    await page.locator('[data-feature="dependency"]').click();
    check((await page.locator("#feature-demo").textContent()).includes("Depends on brand"), "Dependency mockup");
    await page.locator('[data-feature="fields"]').click();
    await page.locator("#field-name").fill("Client");
    await page.locator("#field-form button").click();
    check((await page.locator("#custom-fields").textContent()).includes("Client"), "Custom field added");
    await page.locator("#document").fill("Updated launch plan");
    check((await page.locator("#activity").textContent()).includes("edited"), "Edit activity");
    await page.locator("#comment").fill("@Alex <great work>");
    await page.locator("#comment-form button").click();
    check((await page.locator("#comments").textContent()).includes("@Alex <great work>"), "Comment rendered as text");
    await page.locator("#file").setInputFiles({ name: "brief.txt", mimeType: "text/plain", buffer: Buffer.from("Local brief") });
    check((await page.locator("#file-status").textContent()).includes("No file was uploaded"), "Honest file preview");
    await page.locator('[data-team="1"]').click();
    check((await page.locator("#case-copy").textContent()).includes("GitHub"), "Software-specific case study");
    await page.locator('[data-open="Slack connection"]').click();
    check((await page.locator("#modal-description").textContent()).includes("never requests credentials"), "Honest integration");
    await page.locator(".close").click();
    await page.locator('[data-open="Book a personalized demo"]').click();
    await page.locator('#modal-form input').fill("alex@example.com");
    await page.locator('#modal-form button').click();
    check((await page.locator("#modal-status").textContent()).includes("No account"), "Demo request local");
    await page.locator(".close").click();
    await page.locator("#see-insights").click();
    check(await page.locator("#insights").isVisible(), "Report shortcut");
});
