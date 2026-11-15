import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const read = (file) => fs.readFile(file, "utf8");
const json = async (file) => JSON.parse(await read(file));
const exists = async (file) => Boolean(await fs.stat(file).catch(() => null));
const save = async (file, value) =>
{
    const next = `${file}.${process.pid}.next`;
    await fs.writeFile(next, `${JSON.stringify(value, null, 4)}\n`);
    await fs.rename(next, file);
};
const id = process.argv[2];
if (!/^(41[5-9]|42[0-4])-[a-z-]+$/.test(id)) throw Error("Outside bounded assignment");
const folder = path.join(root, "out", "pages", id, "GPT-6");
await PromptPageWorkflow.withPromptLock(root, id, async () =>
{
    if (await exists(path.join(folder, "metadata.json")) || await exists(path.join(folder, "index.html")))
    {
        throw Error("Existing source or metadata requires preservation review");
    }
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    console.log(`LOCKED ${id} pid=${process.pid}`);
    const wait = async (name) =>
    {
        const start = Date.now();
        while (!await exists(path.join(folder, ".checks", name)))
        {
            if (Date.now() - start > 1200000) throw Error(`Waiting for ${name} timed out`);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    };
    let metadata = {};
    try
    {
        await wait("source-ready");
        const spec = await json(path.join(folder, "page.json"));
        if (!spec.tags.length || spec.tags.some((tag) => !tag.trim()) || new Set(spec.tags).size !== spec.tags.length) throw Error("Invalid tags");
        metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await save(path.join(folder, "metadata.json"), metadata);
        const prompt = await read(path.join(root, "data", "prompts", id, `${id}.md`));
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex")}\n`);
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
        const before = await json(path.join(root, "deploy", "config.json"));
        const previous = before.pages[id]?.pages?.[0];
        const slug = previous?.slug || id.replace(/^\d+-/, "");
        const digest = await StaticHomepage.validateStaticOutput(out, slug, "GPT-6");
        metadata.generated = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const verify = await import(pathToFileURL(path.join(folder, "verify.mjs")));
        const qa = await verify.verify();
        await StaticHomepage.ensurePreview(root, { folder }, out, digest, undefined, false);
        metadata.preview = true;
        await save(path.join(folder, "metadata.json"), metadata);
        console.log(`QA_READY ${id}: ${qa.assertions} assertions; view both PNGs`);
        await wait("visual-approved");
        const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
        if (visual.length < 40) throw Error("Visual inspection evidence required");
        metadata.validated = true;
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
        const after = await json(path.join(root, "deploy", "config.json"));
        const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!registered || registered.staticDir !== "out" || registered.enabled || registered.deployed) throw Error("Disabled registration check failed");
        for (const [key, value] of Object.entries(before.pages))
        {
            if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Config preservation: ${key}`);
        }
        if (previous && before.pages[id].pages.some((value, i) => JSON.stringify(value) !== JSON.stringify(after.pages[id].pages[i]))) throw Error("Existing options changed");
        metadata.config_added = true;
        await save(path.join(folder, "metadata.json"), metadata);
        await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser/export assertions and 3 registration/preservation checks. Both desktop and mobile images actually viewed: ${visual} Evidence: .checks\\qa.json and desktop/mobile.png. Registered disabled and undeployed. No build, install, dist or publication.\n`);
        const record = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, visualQA: true, visualNotes: visual, mocks: spec.mocks, limits: "Standalone browser-only demo; no backend or publication", helperCleanup: true };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((entry) => entry.prompt === id), { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, visualQA: true, exportBoundary: "homepage-assets-preview-only", helperCleanup: true });
        await save(manifestFile, manifest);
        console.log(`COMPLETE ${id}: ${qa.assertions} + 3; helpers closed, releasing lock`);
    }
    catch (error)
    {
        const record = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...metadata };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((entry) => entry.prompt === id), { status: "failed", reason: error.message, ...metadata });
        await save(manifestFile, manifest);
        throw error;
    }
});
