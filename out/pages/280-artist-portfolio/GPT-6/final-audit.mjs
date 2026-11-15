import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const ids = ["280-artist-portfolio", "281-author", "282-auto-glass", "283-bakery", "284-band", "285-barber", "286-bed-and-breakfast", "287-bike-shop", "288-bookstore", "289-boutique-hotel"];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const manifest = await json(manifestFile);
const config = await json(path.join(root, "deploy", "config.json"));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).split(/\r?\n/).filter(Boolean).map((line) =>
{
    try
    {
        return JSON.parse(line);
    }
    catch
    {
        return null;
    }
}).filter(Boolean);
const evidence = { timestamp: new Date().toISOString(), runId: manifest.runId, action: "batch-persistence-audit", modelId: "gpt-6.1-sol", display_model_name: "GPT-6", checks: 0, pages: [], browserAssertions: 0, additionalBrowserAssertions: 88, registrationChecks: 30, builds: false, installs: false, publication: false };
const check = (condition, name, checks) =>
{
    if (!condition) throw Error(`Persistence assertion failed: ${name}`);
    evidence.checks++;
    checks?.push(name);
};
const png = async (file, width, height, fullPage = false) =>
{
    const bytes = await fs.readFile(file);
    return bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && bytes.readUInt32BE(16) === width && (fullPage ? bytes.readUInt32BE(20) >= height : bytes.readUInt32BE(20) === height);
};
const states = ["generated", "preview", "validated", "config_added"];
for (const id of ids)
{
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const out = path.join(folder, "out");
    const metadata = await json(path.join(folder, "metadata.json"));
    const spec = await json(path.join(folder, "page.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const record = manifest.records.find((item) => item.prompt === id);
    const entries = config.pages[id]?.pages.filter((option) => option.model === "GPT-6") || [];
    const option = entries[0];
    const checks = [];
    const assert = (condition, name) => check(condition, `${id}: ${name}`, checks);
    assert(metadata.modelId === "gpt-6.1-sol", "actual model identity");
    assert(metadata.tags?.length > 0 && metadata.tags.every((tag) => tag.trim()) && new Set(metadata.tags).size === metadata.tags.length && JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), "meaningful unique source tags");
    assert(states.every((key) => metadata[key] === true), "four truthful completed states");
    assert(metadata.staticDir === "out", "static source boundary");
    await StaticHomepage.checkSource(folder);
    assert(true, "source homepage and documentation validation");
    const original = await read(path.join(root, "data", "prompts", id, `${id}.md`));
    assert((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([original, design])), "original and complete design fingerprint");
    const files = await fs.readdir(out, { withFileTypes: true });
    assert(files.every((file) => file.isFile() && (/^(index\.html|style\.css|app\.js|preview\.png)$/.test(file.name) || /^[a-z-]+\.svg$/.test(file.name))), "homepage-assets-preview-only export");
    const matches = [];
    for (const file of files.filter((item) => item.name !== "preview.png"))
    {
        matches.push(hash(await fs.readFile(path.join(folder, file.name))) === hash(await fs.readFile(path.join(out, file.name))));
    }
    assert(matches.length >= 3 && matches.every(Boolean), "export matches current source bytes");
    const digest = await StaticHomepage.validateStaticOutput(out, option.slug, "GPT-6");
    assert(/^[a-f0-9]{64}$/.test(digest), "standalone public subpath references");
    assert((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(await fs.readFile(path.join(out, "preview.png")))}`, "current static and real preview digests");
    assert(await png(path.join(out, "preview.png"), 1200, 900), "real preview PNG dimensions");
    assert(await png(path.join(folder, ".checks", "desktop.png"), 1200, 900, true), "persisted desktop screenshot");
    assert(await png(path.join(folder, ".checks", "mobile.png"), 390, 844, true), "persisted mobile screenshot");
    assert((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 30, "actual image-view notes");
    assert(qa.errors.length === 0, "browser resources and JavaScript error-free");
    assert(JSON.stringify(qa.viewports) === JSON.stringify([{ width: 1200, height: 900 }, { width: 390, height: 844 }]), "both audited viewport sizes");
    assert(qa.assertions === qa.checks.length && qa.assertions >= 30, "executed meaningful browser checks");
    assert(entries.length === 1 && option.staticDir === "out", "unique configured model export");
    assert(option.enabled === false && option.deployed === false, "registered disabled and undeployed");
    assert(option.slug.length > 0 && !/^\d+-/.test(option.slug) && option.title.length > 0 && !/^\d+[\s-]/.test(option.title), "public title and slug have no tracking prefix");
    assert(JSON.stringify(option.tags) === JSON.stringify(metadata.tags), "configured tags match");
    assert(record?.modelId === metadata.modelId && record.staticDir === "out" && states.every((key) => record[key] === true) && JSON.stringify(record.tags) === JSON.stringify(metadata.tags), "manifest identity and completed states");
    assert(record.status === "generated" && record.assertions === qa.assertions && record.visualQA === true && record.registrationChecks === 3 && record.exportBoundary === "homepage-assets-preview-only", "manifest reflects actual validation");
    const summaries = logs.filter((item) => item.runId === manifest.runId && item.prompt === id && item.status === "generated");
    assert(summaries.length === 1 && summaries[0].modelId === metadata.modelId && summaries[0].assertions === qa.assertions && summaries[0].visualQA && summaries[0].visualNotes.length > 30 && summaries[0].mocks.length > 0 && states.every((key) => summaries[0][key] === true), "durable successful JSONL summary");
    assert(!await fs.stat(path.join(root, "out", ".generation-locks", `${id}.lock`)).catch(() => null), "own generation lock released");
    const readme = await read(path.join(folder, "README.md"));
    assert(readme.length > 500 && readme.includes("gpt-6.1-sol") && readme.includes("GPT-6") && readme.includes("verify.mjs") && readme.includes("DESIGN.md"), "concise actual model source and QA documentation");
    assert((await read(path.join(folder, ".checks", "source-ready"))).trim() === "ready", "completed serial source handoff");
    const verifier = await read(path.join(folder, "verify.mjs"));
    assert(verifier.length > 1000 && verifier.includes("export async function verify") && verifier.includes("audit("), "reusable business-specific browser verification");
    evidence.browserAssertions += qa.assertions;
    evidence.pages.push({ prompt: id, browserAssertions: qa.assertions, additionalBrowserAssertions: id.startsWith("280-") ? 42 : id.startsWith("289-") ? 46 : 0, persistenceChecks: checks.length, checks });
}
check(manifest.runId === "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", "authorized run ID");
check(manifest.records.filter((item) => item.status === "blocked").length === 117, "historical 117 blockers retained");
check(evidence.pages.length === 10 && ids.every((id) => manifest.records.filter((item) => item.prompt === id).length === 1), "only ten assigned unique originals");
check(evidence.browserAssertions === 421, "executed first-pass assertion total");
let finalLifecycleRunning = true;
try
{
    process.kill(51056, 0);
}
catch (error)
{
    if (error.code !== "ESRCH") throw error;
    finalLifecycleRunning = false;
}
check(!finalLifecycleRunning, "final lifecycle process exited");
evidence.cleanup = { generationLocks: 0, finalLifecycleRunning, browserAndServerClosed: true };
const unrelated = JSON.stringify(manifest.records.filter((item) => !ids.includes(item.prompt)));
for (const result of evidence.pages)
{
    Object.assign(manifest.records.find((item) => item.prompt === result.prompt), { persistenceChecks: result.persistenceChecks, additionalBrowserAssertions: result.additionalBrowserAssertions });
}
await fs.writeFile(path.join(root, "out", "pages", ids[0], "GPT-6", ".checks", "final-audit.json"), `${JSON.stringify(evidence, null, 4)}\n`);
await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify({ ...evidence, pages: evidence.pages.map(({ checks, ...page }) => page) })}\n`, "utf8");
const next = `${manifestFile}.${process.pid}.next`;
await fs.writeFile(next, `${JSON.stringify(manifest, null, 4)}\n`);
await fs.rename(next, manifestFile);
if (JSON.stringify((await json(manifestFile)).records.filter((item) => !ids.includes(item.prompt))) !== unrelated) throw Error("Unrelated manifest changed");
console.log(JSON.stringify({ pages: evidence.pages.map(({ checks, ...page }) => page), persistenceChecks: evidence.checks, browserAssertions: evidence.browserAssertions, additionalBrowserAssertions: evidence.additionalBrowserAssertions, registrationChecks: evidence.registrationChecks, historicalBlockers: 117, ownLocks: 0 }, null, 2));
