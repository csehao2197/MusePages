import { readFile, writeFile, appendFile, mkdir, open, unlink, rename, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";
import { verify } from "./qa.mjs";

const root = process.cwd();
const number = Number(process.argv[2]);
if (number < 196 || number > 205) throw Error("Outside bounded batch");
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
const record = manifest.records.find(item => item.number === number);
if (!record) throw Error("Missing manifest record");
const prompt = record.prompt;
const folder = path.join(root, "out", "pages", prompt, "GPT-6");
const lockFile = path.join(root, "out", ".generation-locks", `${prompt}.lock`);
await mkdir(path.dirname(lockFile), { recursive: true });
const handle = await open(lockFile, "wx");
const owner = JSON.stringify({ run: runId, pid: process.pid, prompt, started: new Date().toISOString() });
await handle.writeFile(owner);
await handle.close();
const exists = async file => access(file).then(() => true, () => false);
const waitFor = async name =>
{
    const start = Date.now();
    while (!await exists(path.join(folder, ".checks", name)))
    {
        if (Date.now() - start > 1200000) throw Error(`Timed out awaiting ${name}`);
        await new Promise(resolve => setTimeout(resolve, 600));
    }
};
const save = async (file, value) =>
{
    const temporary = `${file}.${process.pid}.pending`;
    await writeFile(temporary, JSON.stringify(value, null, 4) + "\n");
    await rename(temporary, file);
};
let metadata;
let evidence;
let intent;
let failure;
let status = "success";
try
{
    await mkdir(path.join(folder, ".checks"), { recursive: true });
    const metaFile = path.join(folder, "metadata.json");
    metadata = await exists(metaFile) ? JSON.parse(await readFile(metaFile, "utf8")) : null;
    if (metadata && metadata.modelId !== "gpt-6.1-sol") throw Error("Identity mismatch; source preserved");
    const repairing = process.argv.includes("--repair-checks") && record.status === "failed" && metadata?.modelId === "gpt-6.1-sol";
    if (metadata?.generated && !repairing) throw Error("Existing generated source preserved; continuation needs individual review");
    if (metadata && number !== 196 && !repairing) throw Error("Incomplete existing result requires explicit retry");
    console.log(`LOCKED ${prompt} pid=${process.pid}; awaiting source.ready`);
    await waitFor("source.ready");
    intent = JSON.parse(await readFile(path.join(folder, ".checks", "batch.json"), "utf8"));
    if (!intent.tags?.length || new Set(intent.tags).size !== intent.tags.length || intent.tags.some(tag => !tag.trim())) throw Error("Invalid tags");
    metadata = { modelId: "gpt-6.1-sol", tags: intent.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
    await save(metaFile, metadata);
    await StaticHomepage.checkSource(folder);
    await StaticHomepage.copyHtml(folder, path.join(folder, "out"));
    const config = JSON.parse(await readFile(path.join(root, "deploy", "config.json"), "utf8"));
    const existing = config.pages[prompt]?.pages?.[0];
    const slug = existing?.slug || prompt.replace(/^\d+-/, "");
    const title = existing?.title || intent.title;
    const content = await readFile(path.join(root, "data", "prompts", prompt, `${prompt}.md`), "utf8");
    const design = await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
    await writeFile(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([content, design])).digest("hex") + "\n");
    metadata.generated = true;
    await save(metaFile, metadata);
    const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
    const { checks } = await import(pathToFileURL(path.join(folder, ".checks", "verify.mjs")));
    evidence = await verify(folder, checks);
    await StaticHomepage.ensurePreview(root, { folder }, path.join(folder, "out"), digest, undefined, false);
    console.log(`VISUAL REVIEW READY ${prompt}; inspect desktop.png, mobile.png, out/preview.png; awaiting visual.approved`);
    await waitFor("visual.approved");
    const approval = await readFile(path.join(folder, ".checks", "visual.approved"), "utf8");
    if (!approval.trim()) throw Error("Visual review missing");
    evidence = JSON.parse(await readFile(path.join(folder, ".checks", "results.json"), "utf8"));
    metadata.preview = true;
    metadata.validated = true;
    await save(metaFile, metadata);
    await registerGeneratedPage(root, { prompt, model: "GPT-6", slug, title, tags: intent.tags, staticDir: "out" });
    const latest = JSON.parse(await readFile(path.join(root, "deploy", "config.json"), "utf8"));
    if (!latest.pages[prompt].pages.some(page => page.model === "GPT-6" && page.staticDir === "out" && page.slug === slug)) throw Error("Registration not found");
    metadata.config_added = true;
    await save(metaFile, metadata);
    evidence.visualReview = approval.trim();
}
catch (error)
{
    failure = error.stack;
    status = "failed";
    console.error(failure);
}
finally
{
    try
    {
        const summary = { time: new Date().toISOString(), runId, prompt, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: number === 196 ? "authorized-retry" : "generate-static-homepage", status, tags: metadata?.tags || [], tagsVerified: Boolean(metadata?.tags?.length), metadata, validation: evidence || "Not completed", mocks: intent?.limits || "Not evaluated", error: failure || null, published: false };
        await mkdir(path.join(root, "logs"), { recursive: true });
        await appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const latest = JSON.parse(await readFile(manifestFile, "utf8"));
        const item = latest.records.find(entry => entry.prompt === prompt);
        Object.assign(item, { status, reason: failure || "Static, browser and visual validation passed; registered disabled", metadata, verification: evidence, handledAt: summary.time });
        await save(manifestFile, latest);
        console.log(`RECORDED ${prompt}: ${status}`);
    }
    finally
    {
        if (await readFile(lockFile, "utf8") === owner) await unlink(lockFile);
        console.log(`LOCK RELEASED ${prompt}`);
    }
}
