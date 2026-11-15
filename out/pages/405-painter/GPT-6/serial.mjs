import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const id = process.argv[2];
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const hash = (value) => createHash("sha256").update(value).digest("hex");
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};
if (!/^(40[5-9]|41[0-4])-[a-z-]+$/.test(id)) throw Error("Outside authorized batch");
const folder = path.join(root, "out", "pages", id, "GPT-6");
await PromptPageWorkflow.withPromptLock(root, id, async () =>
{
    const repair = process.argv.includes("--repair");
    if (repair)
    {
        const previous = await json(path.join(folder, "metadata.json"));
        const original = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        if (previous.modelId !== "gpt-6.1-sol" || previous.validated || previous.config_added ||
            (await read(path.join(folder, ".generation-input.sha256"))).trim() !== hash(JSON.stringify([original, design]))) throw Error("Repair cannot change existing identity or completed results");
        const lines = (await read(path.join(root, "logs", "render-prompt-pages-ai.log"))).trim().split(/\r?\n/);
        const ownFailure = lines.reverse().map((line) => JSON.parse(line)).find((entry) => entry.prompt === id);
        if (ownFailure?.runId !== runId || ownFailure.status !== "failed") throw Error("Repair requires this run's recorded failure");
    }
    else if (await exists(path.join(folder, "metadata.json")) || await exists(path.join(folder, "index.html"))) throw Error("Existing source or metadata requires preservation review");
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    const wait = async (name) =>
    {
        const start = Date.now();
        while (!await exists(path.join(folder, ".checks", name)))
        {
            if (Date.now() - start > 1200000) throw Error(`Timeout: ${name}`);
            await new Promise((resolve) => setTimeout(resolve, 600));
        }
    };
    console.log(`LOCKED ${id} pid=${process.pid}`);
    let metadata;
    try
    {
        await wait("source-ready");
        const spec = await json(path.join(folder, "page.json"));
        if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Meaningful unique tags required");
        const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        const fingerprint = hash(JSON.stringify([prompt, design]));
        await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
        metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await save(path.join(folder, "metadata.json"), metadata);
        await StaticHomepage.checkSource(folder);
        const out = path.join(folder, "out");
        await fs.mkdir(out, { recursive: true });
        const assets = (await fs.readdir(folder)).filter((file) => ["index.html", "style.css", "app.js"].includes(file) || file.endsWith(".svg"));
        for (const file of assets) await fs.copyFile(path.join(folder, file), path.join(out, file));
        const config = await json(path.join(root, "deploy", "config.json"));
        const previous = config.pages[id]?.pages?.[0];
        const slug = previous?.slug || id.replace(/^\d+-/, "");
        const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
        metadata.generated = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const qa = await (await import(pathToFileURL(path.join(folder, "verify.mjs")))).verify();
        await StaticHomepage.ensurePreview(root, { folder }, out, digest, undefined, false);
        metadata.preview = true;
        await save(path.join(folder, "metadata.json"), metadata);
        console.log(`QA_READY ${id}: ${qa.assertions} checks; view both PNGs then approve`);
        await wait("visual-approved");
        const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
        if (visual.length < 30) throw Error("Actual visual inspection description required");
        metadata.validated = true;
        const before = await json(path.join(root, "deploy", "config.json"));
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
        const after = await json(path.join(root, "deploy", "config.json"));
        const option = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!option || option.enabled || option.deployed || option.staticDir !== "out") throw Error("Disabled registration not verified");
        for (const [key, value] of Object.entries(before.pages))
        {
            if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Unrelated config changed: ${key}`);
        }
        if (before.pages[id])
        {
            for (let i = 0; i < before.pages[id].pages.length; i++)
            {
                if (JSON.stringify(before.pages[id].pages[i]) !== JSON.stringify(after.pages[id].pages[i])) throw Error("Existing option/order changed");
            }
        }
        metadata.config_added = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const checks = [];
        const check = (condition, name) =>
        {
            if (!condition) throw Error(`Final audit: ${name}`);
            checks.push(name);
        };
        check(metadata.modelId === "gpt-6.1-sol", "actual generating model");
        check(["generated", "preview", "validated", "config_added"].every((key) => metadata[key] === true), "real complete stages");
        check(spec.tags.length > 0 && new Set(spec.tags).size === spec.tags.length, "unique meaningful tags");
        check((await read(path.join(folder, ".generation-input.sha256"))).trim() === fingerprint, "exact original and full DESIGN fingerprint");
        const preview = await fs.readFile(path.join(out, "preview.png"));
        check(preview.readUInt32BE(16) === 1200 && preview.readUInt32BE(20) === 900, "real 1200x900 preview");
        check((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${await StaticHomepage.validateStaticOutput(out, slug, "GPT-6")} ${hash(preview)}`, "current static and preview digests");
        for (const asset of assets) check(hash(await fs.readFile(path.join(folder, asset))) === hash(await fs.readFile(path.join(out, asset))), `source/export match ${asset}`);
        check((await fs.readdir(out)).every((file) => [...assets, "preview.png"].includes(file)), "homepage assets only");
        for (const name of ["desktop", "mobile"])
        {
            const image = await fs.readFile(path.join(folder, ".checks", `${name}.png`));
            check(image.subarray(0, 8).toString("hex") === "89504e470d0a1a0a", `${name} actual PNG`);
            check(image.readUInt32BE(16) === (name === "desktop" ? 1200 : 390), `${name} correct width`);
        }
        check(qa.errors.length === 0, "no browser/resource errors");
        check(qa.viewports.length === 2, "both viewport interactions");
        check(visual.length > 30, "both images opened and reviewed");
        check(option.slug === slug && !/^\d+-/.test(slug), "unnumbered public mapping");
        check(option.enabled === false && option.deployed === false, "disabled undeployed registration");
        check(after.pages[id].pages.filter((entry) => entry.model === "GPT-6").length === 1, "unique registered option");
        await save(path.join(folder, ".checks", "final-audit.json"), { prompt: id, assertions: checks.length, checks });
        await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser/export checks, 3 registration/preservation checks and ${checks.length} final audit checks. Both desktop/mobile PNGs opened and inspected: ${visual} Evidence: \`.checks\`. Registered disabled/undeployed. No build, install, dist or publication.\n`);
        const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: checks.length, visualQA: true, visualNotes: visual, mocks: spec.mocks, limits: "Standalone browser-only demonstration; no backend or publication", helperCleanup: true };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        const entry = manifest.records.find((item) => item.prompt === id);
        if (!entry) throw Error("Manifest record absent");
        Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: checks.length, visualQA: true, exportBoundary: "homepage-assets-preview-only", helperCleanup: true });
        await save(manifestFile, manifest);
        console.log(`COMPLETE ${id}: ${qa.assertions} browser + 3 registration + ${checks.length} final checks; helpers closed`);
    }
    catch (error)
    {
        const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), status: "failed", error: error.message, ...(metadata || {}) };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...(metadata || {}) });
        await save(manifestFile, manifest);
        throw error;
    }
});
