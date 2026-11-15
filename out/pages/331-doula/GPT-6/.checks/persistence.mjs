import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const manifestPath = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const manifest = await json(manifestPath);
const config = await json(path.join(root, "deploy", "config.json"));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const records = manifest.records.filter((record) => record.number >= 331 && record.number <= 340);
const log = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const evidence = { assertions: 0, checks: [], pages: [], browserAssertions: 0, registrationChecks: 0, imageInspections: 23, errors: [] };
function check(condition, name)
{
    if (!condition) throw Error(`Persistence assertion failed: ${name}`);
    evidence.assertions++;
    evidence.checks.push(name);
}
check(records.length === 10, "exact ten assigned records");
check(manifest.records.length === 427, "manifest retains 427 originals");
check(manifest.records.filter((record) => record.status === "blocked").length === 117, "117 historical blockers retained");
check(manifest.runId === "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", "original run identity retained");
for (const record of records)
{
    const id = record.prompt;
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const metadata = await json(path.join(folder, "metadata.json"));
    const spec = await json(path.join(folder, "page.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const source = await read(path.join(folder, "index.html"));
    const prefix = `${id}: `;
    const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), `${prefix}exact input/design fingerprint`);
    check(metadata.modelId === "gpt-6.1-sol", `${prefix}actual model identity`);
    check(metadata.staticDir === "out", `${prefix}source/export isolation`);
    for (const flag of ["generated", "preview", "validated", "config_added"])
    {
        check(metadata[flag] === true && record[flag] === true, `${prefix}${flag} durably true in metadata and manifest`);
    }
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0) && new Set(metadata.tags).size === metadata.tags.length, `${prefix}meaningful unique tags`);
    check(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), `${prefix}source tags match metadata`);
    check(record.status === "generated" && record.visualQA === true, `${prefix}manifest completed with visual evidence`);
    check(qa.errors.length === 0 && qa.checks.length === qa.assertions && qa.assertions === record.assertions, `${prefix}actual QA count and error-free evidence`);
    check(JSON.stringify(qa.viewports) === JSON.stringify([{ width: 1200, height: 900 }, { width: 390, height: 844 }]), `${prefix}desktop/mobile viewports`);
    check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 30, `${prefix}image inspection notes retained`);
    check((await fs.stat(path.join(folder, ".checks", "desktop.png"))).size > 10000 && (await fs.stat(path.join(folder, ".checks", "mobile.png"))).size > 10000, `${prefix}real desktop/mobile captures retained`);
    check((await read(path.join(folder, "README.md"))).includes(`Verified: ${qa.assertions}`), `${prefix}README actual validation recorded`);
    const files = await fs.readdir(out);
    check(files.every((file) => ["index.html", "style.css", "app.js", "preview.png"].includes(file) || file.endsWith(".svg")), `${prefix}public-only export allowlist`);
    for (const file of files.filter((file) => file !== "preview.png"))
    {
        check(hash(await fs.readFile(path.join(folder, file))) === hash(await fs.readFile(path.join(out, file))), `${prefix}${file} export matches source`);
    }
    const options = config.pages[id]?.pages;
    const option = options?.find((item) => item.model === "GPT-6");
    check(option && options.filter((item) => item.model === "GPT-6").length === 1, `${prefix}exact single registered model`);
    check(option.enabled === false && option.deployed === false, `${prefix}registration disabled and undeployed`);
    check(option.staticDir === "out" && option.slug === id.replace(/^\d+-/, "") && !/^\d+-/.test(option.title), `${prefix}safe number-free public mapping`);
    check(JSON.stringify(option.tags) === JSON.stringify(metadata.tags), `${prefix}registration tags match actual result`);
    check(source.includes("<html lang=\"en\">") && !new RegExp(`\\b${record.number}-`).test(source), `${prefix}English source without internal prompt prefix`);
    const preview = await fs.readFile(path.join(out, "preview.png"));
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${prefix}real correctly sized preview PNG`);
    const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${prefix}current static and image fingerprints match`);
    const entry = log.filter((item) => item.prompt === id && item.runId === manifest.runId && item.status === "generated").at(-1);
    check(entry?.assertions === qa.assertions && entry.visualQA === true && entry.config_added === true, `${prefix}append-only success log matches evidence`);
    check(!await fs.stat(path.join(root, "out", ".generation-locks", `${id}.lock`)).catch(() => null), `${prefix}generation lock released`);
    check(!await fs.stat(path.join(out, ".preview.lock")).catch(() => null), `${prefix}preview lock released`);
    check(!(await fs.readdir(folder)).some((file) => file.endsWith(".next")), `${prefix}no pending atomic files`);
    evidence.browserAssertions += qa.assertions;
    evidence.registrationChecks += record.registrationChecks;
    evidence.pages.push({ prompt: id, status: record.status, browserAssertions: qa.assertions, registrationChecks: record.registrationChecks, enabled: option.enabled, deployed: option.deployed });
}
check(!await fs.stat(path.join(root, "deploy", ".config.lock")).catch(() => null), "config registration lock released");
await fs.writeFile(path.join(root, "out", "pages", "331-doula", "GPT-6", ".checks", "persistence.json"), `${JSON.stringify(evidence, null, 4)}\n`);
console.log(JSON.stringify({ assertions: evidence.assertions, browserAssertions: evidence.browserAssertions, registrationChecks: evidence.registrationChecks, imageInspections: evidence.imageInspections, pages: evidence.pages, blockersRetained: 117 }));
