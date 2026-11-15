import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";
export { audit } from "../../300-car-wash/GPT-6/serial-qa.mjs";

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

export async function run(id)
{
    if (!/^(31[1-9]|320)-[a-z-]+$/.test(id)) throw Error("Outside assigned range");
    const folder = path.join(root, "out", "pages", id, "GPT-6");
    await PromptPageWorkflow.withPromptLock(root, id, async () =>
    {
        const metadataFile = path.join(folder, "metadata.json");
        if (await exists(metadataFile) || await exists(path.join(folder, "index.html")))
        {
            if (!process.argv.includes("--continue")) throw Error("Existing result requires preservation review");
            const existing = await json(metadataFile);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            const fingerprint = createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex");
            if (!existing.generated || existing.modelId !== "gpt-6.1-sol" || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== fingerprint) throw Error("Continuation requires generated source with exact identity and input");
        }
        await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
        const wait = async (name) =>
        {
            const started = Date.now();
            while (!await exists(path.join(folder, ".checks", name)))
            {
                if (Date.now() - started > 1200000) throw Error(`Timed out: ${name}`);
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
        };
        console.log(`LOCKED ${id} pid=${process.pid}`);
        let metadata;
        try
        {
            await wait("source-ready");
            const spec = await json(path.join(folder, "page.json"));
            if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Meaningful unique tags required");
            metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
            await save(metadataFile, metadata);
            const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
            const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
            await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex")}\n`);
            await StaticHomepage.checkSource(folder);
            const out = path.join(folder, "out");
            await fs.mkdir(out, { recursive: true });
            for (const file of await fs.readdir(folder))
            {
                if (["index.html", "style.css", "app.js"].includes(file) || file.endsWith(".svg")) await fs.copyFile(path.join(folder, file), path.join(out, file));
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
            console.log(`QA_READY ${id}: ${qa.assertions}; inspect images then write visual-approved`);
            await wait("visual-approved");
            const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
            if (visual.length < 30) throw Error("Actual visual inspection description required");
            metadata.validated = true;
            await save(metadataFile, metadata);
            const before = await json(path.join(root, "deploy", "config.json"));
            await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
            const after = await json(path.join(root, "deploy", "config.json"));
            const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!registered || registered.staticDir !== "out") throw Error("Registration missing");
            const existed = before.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
            if (!existed && (registered.enabled || registered.deployed)) throw Error("New result must remain disabled and undeployed");
            for (const [key, value] of Object.entries(before.pages))
            {
                if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Unrelated config changed: ${key}`);
            }
            if (before.pages[id])
            {
                const old = before.pages[id];
                if (JSON.stringify({ ...old, pages: undefined }) !== JSON.stringify({ ...after.pages[id], pages: undefined })) throw Error("Group attributes changed");
                for (let i = 0; i < old.pages.length; i++)
                {
                    if (JSON.stringify(old.pages[i]) !== JSON.stringify(after.pages[id].pages[i])) throw Error("Existing option/order changed");
                }
            }
            metadata.config_added = true;
            await save(metadataFile, metadata);
            await fs.appendFile(path.join(folder, "README.md"), `\nActual QA: ${qa.assertions} browser/export assertions and 3 registration/preservation checks passed. Desktop 1200×900 and mobile 390×844 full-page screenshots opened and inspected: ${visual} Evidence: \`.checks\\qa.json\`, desktop/mobile PNGs. Registered disabled/undeployed. No build, install, dist or publication.\n`);
            const record = { timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, visualQA: true, visualNotes: visual, registrationChecks: 3, mocks: spec.mocks, limits: "Static browser-only demonstration; no backend, payment or real reservation; no publication" };
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
            const manifest = await json(manifestFile);
            const entry = manifest.records.find((item) => item.prompt === id);
            if (!entry) throw Error("Manifest record absent");
            Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
            await save(manifestFile, manifest);
            console.log(`COMPLETE ${id}: ${qa.assertions} + 3; lock released on exit`);
        }
        catch (error)
        {
            await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify({ timestamp: new Date().toISOString(), runId, prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...metadata })}\n`, "utf8");
            const manifest = await json(manifestFile);
            Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...metadata });
            await save(manifestFile, manifest);
            throw error;
        }
    });
}
