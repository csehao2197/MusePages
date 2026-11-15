import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const runId = "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};

async function run(id)
{
    if (!/^(37[2-9]|38[01])-[a-z-]+$/.test(id)) throw Error("Outside assigned range");
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    await PromptPageWorkflow.withPromptLock(root, id, async () =>
    {
        const file = path.join(folder, "metadata.json");
        const resume = process.argv.includes("--resume");
        if ((await exists(file) || await exists(path.join(folder, "index.html"))) && !resume) throw Error("Existing source/metadata requires preservation review");
        if (resume)
        {
            const existing = await json(file);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            const expected = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
            if (existing.modelId !== "gpt-6.1-sol" || existing.generated !== true || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== expected) throw Error("Resume identity/generated/input mismatch");
        }
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        const wait = async (name) =>
        {
            const start = Date.now();
            while (!await exists(path.join(folder, ".checks", name)))
            {
                if (Date.now() - start > 1200000) throw Error(`Timed out: ${name}`);
                await new Promise((resolve) => setTimeout(resolve, 600));
            }
        };
        console.log(`LOCKED ${id} pid=${process.pid}`);
        let metadata;
        try
        {
            await wait("source-ready");
            const spec = await json(path.join(folder, "page.json"));
            if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => tag !== tag.trim() || !tag)) throw Error("Invalid tags");
            metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
            await save(file, metadata);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            const fingerprint = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
            await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${fingerprint}\n`);
            await StaticHomepage.checkSource(folder);
            const out = path.join(folder, "out");
            await fs.mkdir(out, { recursive: true });
            const assets = (await fs.readdir(folder)).filter((name) => ["index.html", "style.css", "app.js"].includes(name) || name.endsWith(".svg"));
            for (const asset of assets) await fs.copyFile(path.join(folder, asset), path.join(out, asset));
            const config = await json(path.join(root, "deploy", "config.json"));
            const previous = config.pages[id]?.pages?.[0];
            const slug = previous?.slug || id.replace(/^\d+-/, "");
            const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
            metadata.generated = true;
            await save(file, metadata);
            const { verify } = await import(pathToFileURL(path.join(folder, "verify.mjs")));
            let qa = await verify();
            await StaticHomepage.ensurePreview(root, { folder }, out, digest, undefined, false);
            metadata.preview = true;
            await save(file, metadata);
            console.log(`QA_READY ${id}: ${qa.assertions}; view both images then approve`);
            await wait("visual-approved");
            qa = await json(path.join(folder, ".checks", "qa.json"));
            const notes = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
            if (notes.length < 50) throw Error("Visual inspection notes required");
            metadata.validated = true;
            await save(file, metadata);
            const before = await json(path.join(root, "deploy", "config.json"));
            await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
            const after = await json(path.join(root, "deploy", "config.json"));
            const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!registered || registered.staticDir !== "out") throw Error("Missing registration");
            const old = before.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!old && (registered.enabled || registered.deployed)) throw Error("Registration enabled/deployed unexpectedly");
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
                for (const [key, value] of Object.entries(before.pages[id]))
                {
                    if (key !== "pages" && JSON.stringify(value) !== JSON.stringify(after.pages[id][key])) throw Error("Group field changed");
                }
            }
            metadata.config_added = true;
            await save(file, metadata);
            let persistence = 0;
            const ensure = (condition) =>
            {
                if (!condition) throw Error("Persistence verification failed");
                persistence++;
            };
            for (const asset of assets) ensure((await fs.readFile(path.join(folder, asset))).equals(await fs.readFile(path.join(out, asset))));
            ensure((await read(path.join(folder, ".generation-input.sha256"))).trim() === fingerprint);
            const png = await fs.readFile(path.join(out, "preview.png"));
            ensure(png.readUInt32BE(16) === 1200 && png.readUInt32BE(20) === 900);
            ensure((await read(path.join(folder, ".generation-preview.sha256"))).trim() === `${await StaticHomepage.validateStaticOutput(out, slug, "GPT-6")} ${createHash("sha256").update(png).digest("hex")}`);
            ensure(JSON.stringify(await json(file)) === JSON.stringify(metadata));
            ensure((await fs.readdir(out)).every((name) => assets.includes(name) || name === "preview.png"));
            await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser/export assertions, 3 registration/preservation checks, ${persistence} persistence checks. Opened and evaluated desktop/mobile PNGs: ${notes} Evidence: .checks\\qa.json and desktop/mobile.png. Disabled/undeployed registration; no build/install/dist/publication.\n`);
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, persistenceChecks: persistence, visualQA: true, visualNotes: notes, mocks: spec.mocks, limits: spec.limits };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            const entry = manifest.records.find((item) => item.prompt === id);
            if (!entry) throw Error("Manifest record absent");
            Object.assign(entry, { status: "generated", reason: "Static/browser/actual desktop+mobile visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, persistenceChecks: persistence, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
            await save(manifestFile, manifest);
            console.log(`COMPLETE ${id}: ${qa.assertions} page + 3 registration + ${persistence} persistence checks`);
        }
        catch (error)
        {
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...(metadata || {}) };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...(metadata || {}) });
            await save(manifestFile, manifest);
            throw error;
        }
    });
}

await run(process.argv[2]);
