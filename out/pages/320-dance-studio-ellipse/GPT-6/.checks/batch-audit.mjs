import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const expected = new Map(
[
    ["311-cocktail-bar", 37], ["312-coffee-shop", 35], ["313-coffee-shop-dark", 43],
    ["314-construction-company", 41], ["315-consulting-firm", 39], ["316-copywriter", 37],
    ["317-coworking-space", 45], ["318-craft-brewery", 49], ["319-crossfit-gym-iron-and-fire", 47],
    ["320-dance-studio-ellipse", 53]
]);
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const manifest = await json(manifestFile);
const config = await json(path.join("deploy", "config.json"));
const logs = (await read(path.join("logs", "render-prompt-pages-ai.log"))).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line)).filter((entry) => expected.has(entry.prompt));
const design = await read(path.join("src", "workflows", "AI Agent", "DESIGN.md"));
let assertions = 0;
const results = [];
function check(condition, message)
{
    assertions++;
    if (!condition) throw Error(message);
}
for (const [id, count] of expected)
{
    const folder = path.join("out", "pages", id, "GPT-6");
    const exported = path.join(folder, "out");
    const slug = id.replace(/^\d+-/, "");
    const metadata = await json(path.join(folder, "metadata.json"));
    check(metadata.modelId === "gpt-6.1-sol" && metadata.staticDir === "out", `${id}: identity/export`);
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag.trim()) && new Set(metadata.tags).size === metadata.tags.length, `${id}: tags`);
    for (const flag of ["generated", "preview", "validated", "config_added"]) check(metadata[flag] === true, `${id}: ${flag}`);
    const prompt = await read(path.join("data", "prompts", id, `${id}.md`));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), `${id}: exact inputs`);
    const digest = await StaticHomepage.validateStaticOutput(exported, slug, "GPT-6");
    const preview = await fs.readFile(path.join(exported, "preview.png"));
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${id}: current static/preview fingerprint`);
    check(preview.toString("hex", 0, 8) === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${id}: real preview dimensions`);
    const files = await fs.readdir(exported, { withFileTypes: true });
    check(files.every((file) => file.isFile() && (/^(index\.html|style\.css|app\.js|preview\.png)$/.test(file.name) || /^[a-z-]+\.svg$/.test(file.name))), `${id}: safe flat export`);
    for (const file of files.filter((entry) => entry.name !== "preview.png"))
    {
        check(hash(await fs.readFile(path.join(exported, file.name))) === hash(await fs.readFile(path.join(folder, file.name))), `${id}: matching source asset ${file.name}`);
    }
    const option = config.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
    check(Boolean(option) && option.slug === slug && option.staticDir === "out", `${id}: public mapping`);
    check(option.enabled === false && option.deployed === false, `${id}: disabled undeployed`);
    check(JSON.stringify(option.tags) === JSON.stringify(metadata.tags) && !/^\d+-/.test(option.title), `${id}: public tags/title`);
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    check(qa.assertions === count && qa.checks.length === count && qa.errors.length === 0, `${id}: QA assertion evidence`);
    check(JSON.stringify(qa.viewports) === JSON.stringify([{ width: 1200, height: 900 }, { width: 390, height: 844 }]), `${id}: responsive evidence`);
    for (const [name, width] of [["desktop.png", 1200], ["mobile.png", 390]])
    {
        const screenshot = await fs.readFile(path.join(folder, ".checks", name));
        check(screenshot.toString("hex", 0, 8) === "89504e470d0a1a0a" && screenshot.readUInt32BE(16) === width && screenshot.readUInt32BE(20) >= 844, `${id}: ${name} evidence`);
    }
    check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 30, `${id}: actual image inspection notes`);
    const record = manifest.records.find((entry) => entry.prompt === id);
    check(record.status === "generated" && record.assertions === count && record.registrationChecks === 3 && record.visualQA === true, `${id}: manifest outcome`);
    check(["generated", "preview", "validated", "config_added"].every((flag) => record[flag] === metadata[flag]), `${id}: manifest state`);
    const log = logs.filter((entry) => entry.prompt === id).at(-1);
    check(log.status === "generated" && log.runId === "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c" && log.modelId === metadata.modelId && log.assertions === count && log.registrationChecks === 3 && log.visualQA === true, `${id}: append-only success log`);
    check((await read(path.join(folder, "README.md"))).includes(`Actual QA: ${count}`), `${id}: actual validation documentation`);
    check(!await exists(path.join("out", ".generation-locks", `${id}.lock`)), `${id}: generation lock released`);
    check(!await exists(path.join(exported, ".preview.lock")) && !await exists(path.join(folder, ".preview.lock")), `${id}: preview lock released`);
    check(!(await fs.readdir(folder)).some((name) => name.endsWith(".next")), `${id}: no atomic leftovers`);
    results.push({ prompt: id, browserExportChecks: count, registrationChecks: 3 });
}
check(!(await fs.readdir("deploy")).some((name) => /^config\.json.*\.next$/.test(name)), "No config atomic leftovers");
check(!(await fs.readdir(path.dirname(manifestFile))).some((name) => /^render-pages-all\.json.*\.next$/.test(name)), "No manifest atomic leftovers");
const report = { status: "passed", persistenceAssertions: assertions, browserExportAssertions: results.reduce((sum, item) => sum + item.browserExportChecks, 0), registrationAssertions: 30, finalScreenshots: 20, results };
await fs.writeFile(path.join("out", "pages", "320-dance-studio-ellipse", "GPT-6", ".checks", "batch-audit.json"), `${JSON.stringify(report, null, 4)}\n`);
console.log(JSON.stringify(report));
