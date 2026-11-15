import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const allowed = ["382-massage-therapist", "383-mechanic", "385-medical-clinic", "386-mexican-restaurant", "387-mortgage-broker", "388-moving-company", "389-museum", "390-music-producer", "391-music-school", "392-music-store"];
const id = process.argv[2];
if (!allowed.includes(id)) throw Error("Outside authorized batch");
const folder = path.join(root, "out", "pages", id, "GPT-6");
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};
await PromptPageWorkflow.withPromptLock(root, id, async () =>
{
    const continuing = process.argv.includes("--continue");
    if (!continuing && (await exists(path.join(folder, "metadata.json")) || await exists(path.join(folder, "index.html"))))
    {
        throw Error("Preexisting result requires preservation review");
    }
    if (continuing)
    {
        const existing = await json(path.join(folder, "metadata.json"));
        const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        const digest = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
        if (!existing.generated || existing.modelId !== "gpt-6.1-sol" || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== digest) throw Error("Continuation identity/input mismatch");
    }
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    console.log(`LOCKED ${id} pid=${process.pid}`);
    const waitFor = async (name) =>
    {
        const start = Date.now();
        while (!await exists(path.join(folder, ".checks", name)))
        {
            if (Date.now() - start > 1200000) throw Error(`Timeout: ${name}`);
            await new Promise((resolve) => setTimeout(resolve, 400));
        }
    };
    let metadata = {};
    try
    {
        await waitFor("source-ready");
        const spec = await json(path.join(folder, "page.json"));
        if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Tags invalid");
        metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        const metadataFile = path.join(folder, "metadata.json");
        await save(metadataFile, metadata);
        const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        const fingerprint = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
        await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
        await StaticHomepage.checkSource(folder);
        const out = path.join(folder, "out");
        await fs.mkdir(out, { recursive: true });
        for (const file of await fs.readdir(folder))
        {
            if (["index.html", "style.css", "app.js"].includes(file) || file.endsWith(".svg"))
            {
                await fs.copyFile(path.join(folder, file), path.join(out, file));
            }
        }
        const config = await json(path.join(root, "deploy", "config.json"));
        const previous = config.pages[id]?.pages?.[0];
        const slug = previous?.slug || id.replace(/^\d+-/, "");
        const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
        metadata.generated = true;
        await save(metadataFile, metadata);
        const { verify } = await import(pathToFileURL(path.join(folder, "verify.mjs")));
        const qa = await verify();
        await StaticHomepage.ensurePreview(root, { folder }, out, digest, undefined, false);
        metadata.preview = true;
        await save(metadataFile, metadata);
        console.log(`QA_READY ${id}: ${qa.assertions} checks; browser/server closed; awaiting visual-approved`);
        await waitFor("visual-approved");
        let visual = "";
        for (let attempt = 0; attempt < 20; attempt++)
        {
            visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
            if (visual.length >= 40) break;
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
        if (visual.length < 40) throw Error("Visual evidence missing");
        metadata.validated = true;
        await save(metadataFile, metadata);
        const before = await json(path.join(root, "deploy", "config.json"));
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
        const after = await json(path.join(root, "deploy", "config.json"));
        const option = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!option || option.staticDir !== "out") throw Error("Registration absent");
        const old = before.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!old && (option.enabled || option.deployed)) throw Error("New result enabled/deployed");
        for (const [key, value] of Object.entries(before.pages))
        {
            if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Unrelated config changed: ${key}`);
        }
        if (before.pages[id])
        {
            for (let i = 0; i < before.pages[id].pages.length; i++)
            {
                if (JSON.stringify(before.pages[id].pages[i]) !== JSON.stringify(after.pages[id].pages[i])) throw Error("Existing variant changed");
            }
            const { pages: a, ...groupBefore } = before.pages[id];
            const { pages: b, ...groupAfter } = after.pages[id];
            if (JSON.stringify(groupBefore) !== JSON.stringify(groupAfter)) throw Error("Group fields changed");
        }
        metadata.config_added = true;
        await save(metadataFile, metadata);
        await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser/export checks and 3 registration/preservation checks. Both desktop 1200×900 and mobile 390×844 captures actually opened: ${visual} Evidence: .checks\\qa.json, desktop.png, mobile.png. Registered disabled/undeployed. No build, install, dist or publication.\n`);
        const record = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, visualQA: true, visualNotes: visual, mocks: spec.mocks, limits: spec.limits, deployed: option.deployed };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        const entry = manifest.records.find((item) => item.prompt === id);
        if (!entry) throw Error("Manifest record absent");
        Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
        await save(manifestFile, manifest);
        console.log(`COMPLETE ${id}: ${qa.assertions} page checks + 3 registration checks; releasing lock`);
    }
    catch (error)
    {
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify({ timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...metadata })}\n`);
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...metadata });
        await save(manifestFile, manifest);
        throw error;
    }
});
