import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const manifest = await json(manifestFile);
const config = await json("deploy\\config.json");
const design = await read("src\\workflows\\AI Agent\\DESIGN.md");
const records = manifest.records.filter((row) => /^(36[2-9]|37[01])-/.test(row.prompt));
const ids = new Set(records.map((row) => row.prompt));
const logs = (await read("logs\\render-prompt-pages-ai.log")).trim().split(/\r?\n/).flatMap((line) =>
{
    try
    {
        const row = JSON.parse(line);
        return ids.has(row.prompt) && row.runId === manifest.runId ? [row] : [];
    }
    catch
    {
        return [];
    }
});
let checks = 0;
const assert = (value, label) =>
{
    if (!value) throw Error(label);
    checks++;
};
assert(records.length === 10 && manifest.records.length === 427, "Bounded complete manifest");
const outcomes = [];
for (const row of records)
{
    const id = row.prompt;
    const folder = path.join("out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const metadata = await json(path.join(folder, "metadata.json"));
    const spec = await json(path.join(folder, "page.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const option = config.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
    const flagNames = ["generated", "preview", "validated", "config_added"];
    assert(row.status === "generated" && flagNames.every((key) => row[key] === true), `${id}: manifest flags`);
    assert(flagNames.every((key) => metadata[key] === true), `${id}: metadata flags`);
    assert(metadata.modelId === "gpt-6.1-sol" && row.modelId === metadata.modelId && row.display_model_name === "GPT-6", `${id}: real identity`);
    assert(metadata.staticDir === "out" && option?.staticDir === "out", `${id}: static boundary registration`);
    assert(option.enabled === false && option.deployed === false, `${id}: inactive registration`);
    assert(spec.tags.length > 0 && new Set(spec.tags).size === spec.tags.length && spec.tags.every((tag) => tag.trim()) && JSON.stringify(spec.tags) === JSON.stringify(metadata.tags) && JSON.stringify(metadata.tags) === JSON.stringify(row.tags), `${id}: consistent meaningful tags`);
    const original = await read(path.join("data", "prompts", id, `${id}.md`));
    assert((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([original, design])), `${id}: exact original/design fingerprint`);
    const slug = option.slug;
    assert(slug && !/^\d+-/.test(slug), `${id}: unnumbered public slug`);
    const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
    const preview = await fs.readFile(path.join(out, "preview.png"));
    assert(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${id}: real preview dimensions`);
    assert((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${id}: current export/preview digest`);
    const exported = await fs.readdir(out);
    assert(exported.every((name) => ["index.html", "style.css", "app.js", "preview.png"].includes(name) || name.endsWith(".svg")), `${id}: export allowlist`);
    assert((await Promise.all(exported.filter((name) => name !== "preview.png").map(async (name) => hash(await fs.readFile(path.join(out, name))) === hash(await fs.readFile(path.join(folder, name)))))).every(Boolean), `${id}: source/export identity`);
    assert(qa.assertions === row.assertions && qa.checks.length === qa.assertions && qa.errors.length === 0, `${id}: actual browser evidence`);
    assert(JSON.stringify(qa.viewports) === JSON.stringify([{ width: 1200, height: 900 }, { width: 390, height: 844 }]), `${id}: responsive evidence`);
    for (const [image, width] of [["desktop", 1200], ["mobile", 390]])
    {
        const bytes = await fs.readFile(path.join(folder, ".checks", `${image}.png`));
        assert(bytes.readUInt32BE(16) === width && bytes.readUInt32BE(20) >= 844, `${id}: ${image} capture`);
    }
    const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
    const last = logs.filter((log) => log.prompt === id).at(-1);
    assert(visual.length > 30 && row.visualQA === true && last?.visualNotes === visual && last.visualQA === true, `${id}: logged actual inspection`);
    assert(last?.status === "generated" && last.assertions === qa.assertions && last.registrationChecks === 3 && flagNames.every((key) => last[key] === true), `${id}: durable completed log`);
    assert((await read(path.join(folder, "README.md"))).includes(`Actual QA: ${qa.assertions}`), `${id}: documented actual QA`);
    assert(!await fs.stat(path.join("out", ".generation-locks", `${id}.lock`)).catch(() => null), `${id}: lock released`);
    outcomes.push({ prompt: id, assertions: qa.assertions, registration: 3, status: row.status });
}
assert(!await fs.stat("deploy\\.publish.lock").catch(() => null), "Registration lock released");
assert(!manifest.records.some((row) => /^361-/.test(row.prompt)), "Absent original 361 unchanged");
const historicalBlockers = manifest.records.filter((row) => row.status === "blocked" && row.reason === "Requirements or DESIGN changed; source retained").length;
assert(historicalBlockers === 117, "Historical input-change blockers retained");
const report =
{
    runId: manifest.runId,
    outcomes,
    pageAssertions: outcomes.reduce((sum, item) => sum + item.assertions, 0),
    registrationChecks: outcomes.length * 3,
    finalPersistenceChecks: checks,
    finalImagesInspected: 20,
    completedLogs: logs.filter((row) => row.status === "generated").length,
    retainedRefinementFailures: logs.filter((row) => row.status === "failed").map(({ prompt, error }) => ({ prompt, error })),
    historicalFingerprintBlockers: historicalBlockers,
    stoppedAfter: "371-language-school",
    cleanAssignedLocks: true
};
await fs.writeFile(path.join("out", "pages", "362-hvac", "GPT-6", ".checks", "batch-final-audit.json"), `${JSON.stringify(report, null, 4)}\n`);
console.log(JSON.stringify(report, null, 2));
