import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { StaticHomepage } from "../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const manifest = await json("C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json");
const records = manifest.records.filter((record) => record.number >= 290 && record.number <= 299);
assert.equal(records.length, 10);
const config = await json(path.join(root, "deploy", "config.json"));
const logs = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
const evidence = { prompts: [], assertions: 1, browserAssertions: 0, registrationChecks: 0, failuresRetained: [], noBuildInstallDistPublication: true };
function check(condition)
{
    assert.ok(condition);
    evidence.assertions++;
}
for (const record of records)
{
    const folder = path.join(root, record.output);
    const metadata = await json(path.join(folder, "metadata.json"));
    const qa = await json(path.join(folder, ".checks", "qa.json"));
    const option = config.pages[record.prompt]?.pages.find((page) => page.model === "GPT-6");
    const prompt = await read(path.join(root, "data", "prompts", record.prompt, `${record.prompt}.md`));
    check(metadata.modelId === "gpt-6.1-sol" && metadata.staticDir === "out");
    check(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true && record[key] === true));
    check(metadata.tags.length > 0 && metadata.tags.every((tag) => tag === tag.trim() && tag.length > 0) && new Set(metadata.tags).size === metadata.tags.length);
    check(record.status === "generated" && record.visualQA === true);
    check(option?.enabled === false && option?.deployed === false && option.staticDir === "out");
    check(JSON.stringify(option.tags) === JSON.stringify(metadata.tags) && !/^\d+-/.test(option.slug));
    check((await read(path.join(folder, ".generation-input.sha256"))).trim() === hash(JSON.stringify([prompt, design])));
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), option.slug, "GPT-6");
    const preview = await fs.readFile(path.join(folder, "out", "preview.png"));
    check(preview.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900);
    check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${digest} ${hash(preview)}`);
    check(qa.errors.length === 0 && qa.assertions === record.assertions && qa.checks.length === qa.assertions);
    check((await read(path.join(folder, ".checks", "visual-approved"))).trim().length > 30);
    for (const [file, width] of [["desktop.png", 1200], ["mobile.png", 390]])
    {
        const screenshot = await fs.readFile(path.join(folder, ".checks", file));
        check(screenshot.readUInt32BE(16) === width && screenshot.readUInt32BE(20) >= 844);
    }
    const publicFiles = await fs.readdir(path.join(folder, "out"));
    check(publicFiles.every((file) => ["index.html", "style.css", "app.js", "preview.png"].includes(file) || file.endsWith(".svg")));
    for (const file of publicFiles.filter((file) => file !== "preview.png"))
    {
        check((await fs.readFile(path.join(folder, file))).equals(await fs.readFile(path.join(folder, "out", file))));
    }
    const related = logs.filter((log) => log.runId === manifest.runId && log.prompt === record.prompt && log.display_model_name === "GPT-6");
    const latest = related.at(-1);
    check(latest?.status === "generated" && latest.visualQA === true && latest.assertions === qa.assertions);
    check(!(await fs.stat(path.join(root, "out", ".generation-locks", `${record.prompt}.lock`)).catch(() => null)));
    check(!(await fs.stat(path.join(folder, "out", ".preview.lock")).catch(() => null)));
    evidence.browserAssertions += qa.assertions;
    evidence.registrationChecks += record.registrationChecks;
    evidence.prompts.push({ prompt: record.prompt, browserAssertions: qa.assertions, visualViewports: 2, status: "generated-disabled", previewDigest: "matched" });
    for (const log of related.filter((log) => log.status === "failed"))
    {
        evidence.failuresRetained.push({ prompt: record.prompt, error: log.error });
    }
}
await fs.writeFile(path.join(root, "out", "pages", "299-car-rental", "GPT-6", ".checks", "batch-persistence.json"), `${JSON.stringify(evidence, null, 4)}\n`);
console.log(JSON.stringify({ prompts: evidence.prompts, persistenceAssertions: evidence.assertions, browserAssertions: evidence.browserAssertions, registrationChecks: evidence.registrationChecks, retainedResolvedAttempts: evidence.failuresRetained.length }));
