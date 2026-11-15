import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const ids =
[
    "447-skincare-brand",
    "448-smart-home",
    "449-soccer-club",
    "452-spa-wellness",
    "453-sports-coach",
    "454-summer-camp",
    "455-sushi-restaurant-sumi-counter",
    "456-swim-coach",
    "457-tailor",
    "458-tattoo-parlor"
];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const config = await read(path.join(root, "deploy", "config.json"));
const manifest = await read(manifestFile);
const logs = (await fs.readFile(path.join(root, "logs", "render-prompt-pages-ai.log"), "utf8")).trim().split(/\r?\n/).flatMap((line) =>
{
    try { return [JSON.parse(line)]; }
    catch { return []; }
});
const design = await fs.readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
const results = [];
for (const id of ids)
{
    let checks = 0;
    const assert = (condition, label) =>
    {
        if (!condition) throw Error(`${id}: ${label}`);
        checks++;
    };
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    const output = path.join(folder, "out");
    const metadata = await read(path.join(folder, "metadata.json"));
    const spec = await read(path.join(folder, "page.json"));
    const qa = await read(path.join(folder, ".checks", "qa.json"));
    const audit = await read(path.join(folder, ".checks", "final-audit.json"));
    const record = manifest.records.find((item) => item.prompt === id);
    const options = config.pages[id].pages.filter((item) => item.model === "GPT-6");
    assert(metadata.modelId === "gpt-6.1-sol", "Real model identity");
    assert(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true), "Truthful completion states");
    assert(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0) && new Set(metadata.tags).size === metadata.tags.length, "Meaningful unique tags");
    assert(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), "Actual design tags");
    assert(options.length === 1, "Unique registration");
    assert(options[0].enabled === false && options[0].deployed === false, "Disabled and undeployed");
    const slug = id.replace(/^\d+-/, "");
    assert(options[0].slug === slug && !/^\d+-/.test(slug), "Unnumbered public path");
    assert(options[0].staticDir === "out" && metadata.staticDir === "out", "Standalone static boundary");
    for (const name of ["index.html", "site.css", "site.js", "art.svg"])
    {
        assert((await fs.readFile(path.join(folder, name))).equals(await fs.readFile(path.join(output, name))), `Exact source/export ${name}`);
    }
    const original = await fs.readFile(path.join(root, "data", "prompts", id, `${id}.md`), "utf8");
    assert((await fs.readFile(path.join(folder, ".generation-input.sha256"), "utf8")).trim() === hash(JSON.stringify([original, design])), "Exact input fingerprint");
    const digest = await StaticHomepage.validateStaticOutput(output, slug, "GPT-6");
    const preview = await fs.readFile(path.join(output, "preview.png"));
    assert((await fs.readFile(path.join(folder, ".generation-preview.sha256"), "utf8")).trim() === `${digest} ${hash(preview)}`, "Exact static/preview fingerprint");
    assert(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "Real desktop preview dimensions");
    assert(qa.digest === digest && qa.errors.length === 0 && qa.helpersStopped === true, "Current successful QA");
    for (const [name, width, height] of [["desktop", 1200, 900], ["mobile", 390, 844]])
    {
        const image = await fs.readFile(path.join(folder, ".checks", `${name}.png`));
        assert(image.readUInt32BE(16) === width && image.readUInt32BE(20) === height && image.length > 10000, `${name} screenshot`);
    }
    for (const lock of [path.join(root, "out", ".generation-locks", `${id}.lock`), path.join(output, ".preview.lock"), path.join(folder, ".preview.lock")])
    {
        let absent = false;
        try { await fs.access(lock); }
        catch (error) { if (error.code === "ENOENT") absent = true; else throw error; }
        assert(absent, "Scoped lock released");
    }
    const readme = await fs.readFile(path.join(folder, "README.md"), "utf8");
    assert(readme.includes("gpt-6.1-sol") && readme.includes(`pages/${slug}/GPT-6/index.html`), "Accurate documentation");
    const log = logs.findLast((item) => item.prompt === id);
    assert(log.status === "completed" && log.browserChecks === qa.browserChecks && log.modelId === metadata.modelId, "Append-only completion record");
    assert(record.status === "completed" && record.browserChecks === qa.browserChecks && record.modelId === metadata.modelId, "Manifest completion record");
    assert(audit.registrationChecks === 3 && audit.auditChecks === 9 && audit.error === null, "Per-item registration and audit evidence");
    results.push({ prompt: id, status: "passed", browserChecks: qa.browserChecks, registrationChecks: audit.registrationChecks, perItemAuditChecks: audit.auditChecks, batchAuditChecks: checks });
}
const report =
{
    timestamp: new Date().toISOString(),
    runId: manifest.runId,
    results,
    browserChecks: results.reduce((sum, item) => sum + item.browserChecks, 0),
    registrationChecks: results.reduce((sum, item) => sum + item.registrationChecks, 0),
    perItemAuditChecks: results.reduce((sum, item) => sum + item.perItemAuditChecks, 0),
    batchAuditChecks: results.reduce((sum, item) => sum + item.batchAuditChecks, 0),
    desktopMobileImagesViewed: 20,
    additionalPortfolioImagesViewed: 2,
    historicalBlockedRecords: manifest.records.filter((item) => item.status === "blocked").length,
    remainingMissingRecords: manifest.records.filter((item) => item.status === "missing").length,
    scopedLocksClean: true,
    buildsInstallsDistPublicationCommits: false
};
await fs.writeFile(path.join(root, "out", "pages", ids.at(-1), "GPT-6", ".checks", "batch-audit.json"), JSON.stringify(report, null, 4) + "\n");
console.log(JSON.stringify(report));
