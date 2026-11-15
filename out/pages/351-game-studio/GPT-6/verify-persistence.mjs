import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (content) => createHash("sha256").update(content).digest("hex");
const manifest = await json("C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json");
const config = await json(path.join(root, "deploy", "config.json"));
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).trim().split(/\r?\n/).map((line) => JSON.parse(line));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const records = manifest.records.filter((record) => record.number >= 351 && record.number <= 360);
const result = { assertions: 0, pageAssertions: 0, registrationChecks: 0, finalImagesInspected: 0, checks: [], items: [], blockers: [], helpersClean: true };
function check(condition, name)
{
    if (!condition) throw Error(`Persistence assertion failed: ${name}`);
    result.assertions++;
    result.checks.push(name);
}
check(records.length === 10 && records.every((record, i) => record.number === 351 + i), "exact bounded ordered range");
check(manifest.runId === "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", "authorized run identity");
check(manifest.records.filter((record) => record.status === "blocked" && /Requirements or DESIGN changed|fingerprint/i.test(record.reason || "")).length === 117, "117 historical input-fingerprint blockers retained");
check(config.version === 2, "version two config retained");
check(!(await fs.stat(path.join(root, "deploy", ".publish.lock")).catch(() => null)), "registration lock released");
const workers = execFileSync("powershell.exe", ["-NoProfile", "-Command", "Get-CimInstance Win32_Process -Filter \"Name = 'node.exe'\" | Where-Object { $_.CommandLine -match '351-game-studio.+serial-run\\.mjs' } | Select-Object -ExpandProperty ProcessId"], { encoding: "utf8" }).trim();
check(workers === "", "assigned lock/browser/server workers exited");
for (const record of records)
{
    const id = record.prompt;
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const metadata = await json(path.join(folder, "metadata.json"));
    const spec = await json(path.join(folder, "page.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const option = config.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
    const ownLogs = logs.filter((entry) => entry.runId === manifest.runId && entry.prompt === id);
    const latest = ownLogs.at(-1);
    check(metadata.modelId === "gpt-6.1-sol" && record.modelId === metadata.modelId, `${id}: actual model identity`);
    check(metadata.generated === true, `${id}: generated state`);
    check(metadata.preview === true, `${id}: preview state`);
    check(metadata.validated === true, `${id}: validated state`);
    check(metadata.config_added === true, `${id}: registered state`);
    check(metadata.staticDir === "out", `${id}: separate static directory`);
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => typeof tag === "string" && tag.trim() === tag && tag.length > 0 && !/^\d{3}-/.test(tag)) && new Set(metadata.tags).size === metadata.tags.length, `${id}: meaningful nonempty unique tags`);
    check(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), `${id}: tags describe local page spec`);
    check(option?.model === "GPT-6" && option.staticDir === "out" && config.pages[id].pages.filter((entry) => entry.model === "GPT-6").length === 1, `${id}: exact unique registration mapping`);
    check(option.enabled === false && option.deployed === false, `${id}: new page disabled and undeployed`);
    check(!/^\d+-/.test(option.slug) && !/^\d{3}[\s-]/.test(option.title), `${id}: unnumbered public identity`);
    check(record.status === "generated" && record.generated && record.preview && record.validated && record.config_added, `${id}: manifest durable state`);
    check(record.assertions === qa.assertions && record.registrationChecks === 3 && record.visualQA === true, `${id}: manifest evidence matches`);
    check(qa.checks.length === qa.assertions && qa.assertions > 20, `${id}: actual named assertion count`);
    check(qa.errors.length === 0, `${id}: no final browser/resource errors`);
    check(qa.viewports.length === 2 && qa.viewports[0].width === 1200 && qa.viewports[0].height === 900 && qa.viewports[1].width === 390, `${id}: desktop/mobile evidence`);
    for (const viewport of ["desktop", "mobile"])
    {
        const screenshot = await fs.readFile(path.join(folder, ".checks", `${viewport}.png`));
        check(screenshot.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && screenshot.readUInt32BE(16) === (viewport === "desktop" ? 1200 : 390), `${id}: real ${viewport} PNG dimensions`);
    }
    const preview = await fs.readFile(path.join(folder, "out", "preview.png"));
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, `${id}: real 1200x900 preview`);
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), option.slug, "GPT-6");
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`, `${id}: preview/export digest exact`);
    const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])), `${id}: exact original/DESIGN fingerprint`);
    for (const file of ["index.html", "style.css", "app.js"])
    {
        check(hash(await fs.readFile(path.join(folder, file))) === hash(await fs.readFile(path.join(folder, "out", file))), `${id}: source/export ${file} match`);
    }
    check((await fs.readdir(path.join(folder, "out"))).sort().join(",") === "app.js,index.html,preview.png,style.css", `${id}: homepage-only export allowlist`);
    check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 100, `${id}: actual image inspection notes persisted`);
    check((await read(path.join(folder, "README.md"))).includes(`Actual QA: ${qa.assertions}`) && (await read(path.join(folder, "README.md"))).includes("gpt-6.1-sol"), `${id}: actual QA and model documented`);
    check(latest?.status === "generated" && latest.assertions === qa.assertions && latest.visualQA === true && latest.tags_nonempty === true, `${id}: latest append-only log matches evidence`);
    check(latest?.generated && latest.preview && latest.validated && latest.config_added && latest.mocks?.length > 0, `${id}: log has truthful states and mocks`);
    check(!(await fs.stat(path.join(root, "out", ".generation-locks", `${id}.lock`)).catch(() => null)), `${id}: generation lock released`);
    check(!(await fs.stat(path.join(folder, "out", ".preview.lock")).catch(() => null)) && !(await fs.stat(path.join(folder, ".preview.lock")).catch(() => null)), `${id}: preview locks released`);
    check(!(await fs.readdir(folder)).some((name) => name.endsWith(".next")), `${id}: no atomic-write scratch left`);
    result.pageAssertions += qa.assertions;
    result.registrationChecks += 3;
    result.finalImagesInspected += 2;
    result.items.push({ prompt: id, status: "generated", pageAssertions: qa.assertions, registrationChecks: 3, historicalAttemptsRetained: ownLogs.length, disabled: true, deployed: false });
}
await fs.writeFile(path.join(root, "out", "pages", "351-game-studio", "GPT-6", ".checks", "persistence.json"), `${JSON.stringify(result, null, 4)}\n`);
console.log(JSON.stringify({ assertions: result.assertions, pageAssertions: result.pageAssertions, registrationChecks: result.registrationChecks, finalImagesInspected: result.finalImagesInspected, items: result.items, blockers: result.blockers, helpersClean: result.helpersClean }, null, 2));
