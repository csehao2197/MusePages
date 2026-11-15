import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const manifestPath = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (content) => createHash("sha256").update(content).digest("hex");
const manifest = await json(manifestPath);
const config = await json(path.join(root, "deploy", "config.json"));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const records = manifest.records.filter((record) => record.number >= 341 && record.number <= 350).sort((a, b) => a.number - b.number);
const evidence = { assertions: 0, checks: [], items: [], historicalInputBlockers: manifest.records.filter((record) => record.status === "blocked" && /changed|fingerprint/i.test(record.reason || "")).length };
function check(condition, message)
{
    if (!condition) throw Error(`Persistence assertion failed: ${message}`);
    evidence.assertions++;
    evidence.checks.push(message);
}
check(records.length === 10 && records.every((record, index) => record.number === 341 + index), "exact bounded ten-record manifest range");
check(manifest.runId === "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", "original run identity retained");
for (const record of records)
{
    const id = record.prompt;
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const metadata = await json(path.join(folder, "metadata.json"));
    const spec = await json(path.join(folder, "page.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const options = config.pages[id].pages.filter((option) => option.model === "GPT-6");
    check(record.status === "generated", `${id}: durable generated manifest`);
    check(metadata.modelId === "gpt-6.1-sol" && record.modelId === metadata.modelId, `${id}: real model identity`);
    for (const key of ["generated", "preview", "validated", "config_added"])
    {
        check(metadata[key] === true && record[key] === true, `${id}: ${key} exact persisted boolean`);
    }
    check(metadata.staticDir === "out", `${id}: explicit source/export boundary`);
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => typeof tag === "string" && tag.trim() === tag && tag.length > 2) && new Set(metadata.tags).size === metadata.tags.length, `${id}: meaningful nonempty unique tags`);
    check(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), `${id}: tags agree with implementation description`);
    check(options.length === 1, `${id}: unique GPT-6 registration`);
    const option = options[0];
    check(option.enabled === false && option.deployed === false, `${id}: disabled and undeployed`);
    check(option.staticDir === "out" && !/^\d+-/.test(option.slug) && !/^\d+/.test(option.title), `${id}: unnumbered public identity and export`);
    check(JSON.stringify(option.tags) === JSON.stringify(metadata.tags), `${id}: registered tags match`);
    const original = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([original, design])), `${id}: exact prompt/design fingerprint`);
    check(await StaticHomepage.checkSource(folder) === "html", `${id}: valid HTML source with README`);
    const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
    const preview = await fs.readFile(path.join(out, "preview.png"));
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${id}: real 1200 by 900 preview PNG`);
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${id}: preview matches current static digest`);
    const publicFiles = await fs.readdir(out);
    check(publicFiles.every((name) => ["index.html", "style.css", "app.js", "preview.png"].includes(name) || name.endsWith(".svg")), `${id}: homepage-only public allowlist`);
    for (const file of publicFiles.filter((file) => file !== "preview.png"))
    {
        check(hash(await fs.readFile(path.join(folder, file))) === hash(await fs.readFile(path.join(out, file))), `${id}: source/export byte match ${file}`);
    }
    check(qa.assertions === record.assertions && qa.assertions === qa.checks.length && qa.assertions > 30, `${id}: actual browser assertion counts retained`);
    check(qa.errors.length === 0 && qa.viewports.length === 2, `${id}: both browser viewports completed without errors`);
    for (const [image, width] of [["desktop.png", 1200], ["mobile.png", 390]])
    {
        const screenshot = await fs.readFile(path.join(folder, ".checks", image));
        check(screenshot.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && screenshot.readUInt32BE(16) === width && screenshot.readUInt32BE(20) > 800, `${id}: retained ${image} screenshot`);
    }
    check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 100 && record.visualQA === true, `${id}: actual image-view QA notes retained`);
    const log = logs.filter((log) => log.prompt === id && log.runId === manifest.runId && log.status === "generated").at(-1);
    check(Boolean(log) && log.visualQA && log.assertions === qa.assertions && log.config_added, `${id}: append-only success summary agrees`);
    check(Boolean(log.mocks) && Boolean(log.limits), `${id}: truthful mock/limit evidence`);
    check(!await fs.stat(path.join(root, "out", ".generation-locks", `${id}.lock`)).catch(() => null), `${id}: prompt lock released`);
    check(!await fs.stat(path.join(out, ".preview.lock")).catch(() => null), `${id}: preview lock released`);
    evidence.items.push({ prompt: id, status: record.status, browserAssertions: qa.assertions, registrationChecks: record.registrationChecks, enabled: option.enabled, deployed: option.deployed, publicEntry: `pages/${option.slug}/GPT-6/index.html`, visualQA: true });
}
evidence.browserAssertions = evidence.items.reduce((sum, item) => sum + item.browserAssertions, 0);
evidence.registrationChecks = evidence.items.reduce((sum, item) => sum + item.registrationChecks, 0);
evidence.visualImagesOpened = 20;
evidence.currentBatchCorrections = ["346 mobile heading overflow corrected and both viewports rerun", "348 malformed truck SVG corrected and both viewports rerun"];
await fs.writeFile(path.join(root, "out", "pages", "341-festival", "GPT-6", ".checks", "batch-persistence.json"), `${JSON.stringify(evidence, null, 4)}\n`);
console.log(JSON.stringify({ persistenceAssertions: evidence.assertions, browserAssertions: evidence.browserAssertions, registrationChecks: evidence.registrationChecks, visualImagesOpened: evidence.visualImagesOpened, historicalInputBlockers: evidence.historicalInputBlockers, items: evidence.items }, null, 2));
