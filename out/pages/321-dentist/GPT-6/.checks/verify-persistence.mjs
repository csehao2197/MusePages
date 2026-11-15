import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const folder = path.join(root, "out", "pages", "321-dentist", "GPT-6", ".checks");
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const baseline = await json(path.join(folder, "baseline.json"));
const manifest = await json("C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json");
const config = await json(path.join(root, "deploy", "config.json"));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const records = manifest.records.filter((record) => record.number >= 321 && record.number <= 330);
const target = new Set(records.map((record) => record.prompt));
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).trim().split(/\r?\n/).map((line) => JSON.parse(line)).filter((record) => record.runId === runId && target.has(record.prompt));
const evidence = { runId, assertions: 0, checks: [], items: [], browserAssertions: 0, registrationChecks: 0, finalImagesViewed: 20, failuresRetained: logs.filter((record) => record.status === "failed").map(({ prompt, error }) => ({ prompt, error })) };

function check(condition, name)
{
    if (!condition) throw Error(`Persistence assertion failed: ${name}`);
    evidence.assertions++;
    evidence.checks.push(name);
}

check(records.length === 10 && manifest.runId === runId, "exact ten assigned records and run identity");
const unrelated = manifest.records.filter((record) => !target.has(record.prompt));
check(JSON.stringify(unrelated) === JSON.stringify(baseline.records), `${unrelated.length} unrelated manifest records exactly preserved`);
check(Object.keys(config).join("|") === Object.keys(baseline.config).join("|"), "configuration top level key order preserved");
for (const key of Object.keys(baseline.config).filter((key) => key !== "pages"))
{
    check(JSON.stringify(config[key]) === JSON.stringify(baseline.config[key]), `configuration ${key} preserved`);
}
const oldKeys = Object.keys(baseline.config.pages);
check(JSON.stringify(Object.keys(config.pages).filter((key) => oldKeys.includes(key))) === JSON.stringify(oldKeys), "existing configuration group order preserved");
check(Object.keys(config.pages).every((key) => oldKeys.includes(key) || target.has(key)), "no unrelated groups added");
for (const [id, before] of Object.entries(baseline.config.pages))
{
    const after = config.pages[id];
    if (!target.has(id))
    {
        check(JSON.stringify(after) === JSON.stringify(before), `unrelated configuration ${id} preserved`);
        continue;
    }
    const { pages: beforeOptions, ...beforeSettings } = before;
    const { pages: afterOptions, ...afterSettings } = after;
    check(JSON.stringify(afterSettings) === JSON.stringify(beforeSettings), `${id}: group settings preserved`);
    check(JSON.stringify(afterOptions.slice(0, beforeOptions.length)) === JSON.stringify(beforeOptions), `${id}: existing variants and their order preserved`);
}

for (const record of records)
{
    const id = record.prompt;
    const model = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(model, "out");
    const metadata = await json(path.join(model, "metadata.json"));
    const spec = await json(path.join(model, "page.json"));
    const qa = await json(path.join(model, ".checks", "qa.json"));
    const options = config.pages[id].pages.filter((option) => option.model === "GPT-6");
    check(options.length === 1, `${id}: one registered variant`);
    const option = options[0];
    check(option.enabled === false && option.deployed === false && option.staticDir === "out", `${id}: registration remains disabled and undeployed`);
    check(!/^\d+-/.test(option.slug) && !/^\d+[\s-]/.test(option.title), `${id}: public slug and title omit input prefix`);
    check(metadata.modelId === "gpt-6.1-sol" && metadata.staticDir === "out", `${id}: truthful model identity and export location`);
    check(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true && record[key] === true), `${id}: all persisted completion states`);
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => typeof tag === "string" && tag.trim()) && new Set(metadata.tags).size === metadata.tags.length, `${id}: nonempty unique tags`);
    check(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags) && JSON.stringify(option.tags) === JSON.stringify(spec.tags), `${id}: source metadata and registration tags agree`);
    const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    check((await read(path.join(model, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), `${id}: exact original and DESIGN fingerprint`);
    const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
    const preview = await fs.readFile(path.join(out, "preview.png"));
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${id}: real desktop preview dimensions`);
    check((await read(path.join(model, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${id}: current static and preview digests`);
    const files = await fs.readdir(out);
    check(files.every((file) => ["index.html", "style.css", "app.js", "preview.png"].includes(file) || file.endsWith(".svg")), `${id}: static export allowlist only`);
    for (const file of files.filter((file) => file !== "preview.png"))
    {
        check(hash(await fs.readFile(path.join(model, file))) === hash(await fs.readFile(path.join(out, file))), `${id}: exported ${file} matches source`);
    }
    check(qa.errors.length === 0 && qa.assertions === qa.checks.length && qa.assertions === record.assertions, `${id}: successful counted browser and export evidence`);
    check(qa.viewports.length === 2 && qa.viewports[0].width === 1200 && qa.viewports[1].width === 390, `${id}: desktop and mobile verified`);
    for (const [name, width] of [["desktop", 1200], ["mobile", 390]])
    {
        const screenshot = await fs.readFile(path.join(model, ".checks", `${name}.png`));
        check(screenshot.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && screenshot.readUInt32BE(16) === width, `${id}: ${name} actual screenshot`);
    }
    const visual = (await read(path.join(model, ".checks", "visual-approved"))).trim();
    check(visual.length > 100 && record.visualQA === true, `${id}: actual image review approval persisted`);
    const latest = logs.filter((entry) => entry.prompt === id).at(-1);
    check(latest?.status === "generated" && latest.visualQA === true && latest.assertions === qa.assertions && latest.registrationChecks === 3, `${id}: latest append-only log confirms success`);
    check(record.status === "generated" && record.registrationChecks === 3, `${id}: manifest confirms successful registration`);
    check((await read(path.join(model, "README.md"))).includes("Actual QA:"), `${id}: durable validation documentation`);
    check(!await exists(path.join(root, "out", ".generation-locks", `${id}.lock`)), `${id}: generation lock released`);
    evidence.items.push({ prompt: id, title: option.title, browserAssertions: qa.assertions, registrationChecks: 3, status: "generated", publicPath: `pages/${option.slug}/GPT-6/` });
    evidence.browserAssertions += qa.assertions;
    evidence.registrationChecks += 3;
}
check(!await exists(path.join(root, "deploy", ".publish.lock")), "registration lock released");
evidence.unrelatedManifestRecordsPreserved = unrelated.length;
evidence.historicalFingerprintBlockersPreserved = unrelated.filter((record) => record.status === "blocked" && record.reason === "Requirements or DESIGN changed; source retained").length;
check(evidence.historicalFingerprintBlockersPreserved === 117, "all historical input fingerprint blockers preserved");
evidence.timestamp = new Date().toISOString();
await fs.writeFile(path.join(folder, "persistence.json"), `${JSON.stringify(evidence, null, 4)}\n`);
console.log(JSON.stringify({ assertions: evidence.assertions, browserAssertions: evidence.browserAssertions, registrationChecks: evidence.registrationChecks, unrelatedManifestRecordsPreserved: evidence.unrelatedManifestRecordsPreserved, historicalFingerprintBlockersPreserved: evidence.historicalFingerprintBlockersPreserved, failuresRetained: evidence.failuresRetained, items: evidence.items }, null, 2));
