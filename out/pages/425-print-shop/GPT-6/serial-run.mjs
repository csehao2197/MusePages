import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import { StaticHomepage, PromptPageWorkflow } from "../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../src/workflows/script/deploy-site.mjs";

const root = process.cwd();
const id = process.argv[2];
const allowed = ["425-print-shop", "426-property-management", "428-pub", "429-real-estate-agent", "430-real-estate-developer", "431-real-estate-photography", "432-real-estate", "433-record-store", "434-recording-studio", "435-recruitment-agency"];
if (!allowed.includes(id)) throw Error("Outside authorized batch");
const folder = path.join(root, "out", "pages", id, "GPT-6");
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
await PromptPageWorkflow.withPromptLock(root, id, async () =>
{
    const resuming = process.argv.includes("--resume");
    if (await exists(path.join(folder, "metadata.json")))
    {
        if (!resuming) throw Error("Existing metadata requires review");
        const existing = await json(path.join(folder, "metadata.json"));
        const input = (await read(path.join(root, "data", "prompts", id, `${id}.md`))).replace(/^\uFEFF/, "");
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        if (existing.modelId !== "gpt-6.1-sol" || existing.generated !== true || (await read(path.join(folder, ".generation-input.sha256"))).trim() !== createHash("sha256").update(JSON.stringify([input, design])).digest("hex")) throw Error("Resume identity or input mismatch");
    }
    const waitFor = async (name) =>
    {
        const start = Date.now();
        while (!await exists(path.join(folder, ".checks", name)))
        {
            if (Date.now() - start > 1200000) throw Error(`Timed out: ${name}`);
            await new Promise((resolve) => setTimeout(resolve, 600));
        }
    };
    await fs.mkdir(path.join(folder, ".checks"), { recursive: true });
    console.log(`LOCKED ${id} pid=${process.pid}`);
    let metadata;
    try
    {
        await waitFor("source-ready");
        const spec = await json(path.join(folder, "page.json"));
        if (!spec.tags?.length || new Set(spec.tags).size !== spec.tags.length || spec.tags.some((tag) => !tag.trim())) throw Error("Tags invalid");
        metadata = { modelId: "gpt-6.1-sol", tags: spec.tags, staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await save(path.join(folder, "metadata.json"), metadata);
        const prompt = (await read(path.join(root, "data", "prompts", id, `${id}.md`))).replace(/^\uFEFF/, "");
        const design = await read(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
        if (!resuming) await fs.writeFile(path.join(folder, ".generation-input.sha256"), `${createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex")}\n`);
        await StaticHomepage.checkSource(folder);
        await fs.mkdir(path.join(folder, "out"), { recursive: true });
        for (const file of await fs.readdir(folder))
        {
            if (["index.html", "style.css", "app.js"].includes(file) || file.endsWith(".svg")) await fs.copyFile(path.join(folder, file), path.join(folder, "out", file));
        }
        const config = await json(path.join(root, "deploy", "config.json"));
        const previous = config.pages[id]?.pages?.[0];
        const slug = previous?.slug || id.replace(/^\d+-/, "");
        const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
        metadata.generated = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const { verify } = await import(pathToFileURL(path.join(folder, "verify.mjs")));
        const qa = await verify();
        await StaticHomepage.ensurePreview(root, { folder }, path.join(folder, "out"), digest, undefined, false);
        metadata.preview = true;
        await save(path.join(folder, "metadata.json"), metadata);
        console.log(`QA_READY ${id}: ${qa.assertions} assertions. View desktop/mobile then approve.`);
        await waitFor("visual-approved");
        const visual = (await read(path.join(folder, ".checks", "visual-approved"))).trim();
        if (visual.length < 50) throw Error("Visual inspection notes missing");
        metadata.validated = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const before = await json(path.join(root, "deploy", "config.json"));
        await registerGeneratedPage(root, { prompt: id, model: "GPT-6", slug, title: previous?.title || spec.title, tags: spec.tags, staticDir: "out" });
        const after = await json(path.join(root, "deploy", "config.json"));
        const registered = after.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!registered || registered.staticDir !== "out") throw Error("Registration missing");
        const existed = before.pages[id]?.pages.find((entry) => entry.model === "GPT-6");
        if (!existed && (registered.enabled || registered.deployed)) throw Error("Registration enabled unexpectedly");
        for (const [key, value] of Object.entries(before.pages))
        {
            if (key !== id && JSON.stringify(value) !== JSON.stringify(after.pages[key])) throw Error(`Unrelated config changed: ${key}`);
        }
        if (before.pages[id])
        {
            for (let i = 0; i < before.pages[id].pages.length; i++)
            {
                if (JSON.stringify(before.pages[id].pages[i]) !== JSON.stringify(after.pages[id].pages[i])) throw Error("Existing variant modified");
            }
        }
        metadata.config_added = true;
        await save(path.join(folder, "metadata.json"), metadata);
        const auditChecks = [];
        const assert = (condition, name) =>
        {
            if (!condition) throw Error(name);
            auditChecks.push(name);
        };
        assert(JSON.stringify(metadata.tags) === JSON.stringify(spec.tags), "tags match");
        assert(metadata.modelId === "gpt-6.1-sol", "actual identity");
        for (const field of ["generated", "preview", "validated", "config_added"]) assert(metadata[field] === true, field);
        assert((await read(path.join(folder, "index.html"))) === await read(path.join(folder, "out", "index.html")), "source/export equality");
        assert((await fs.stat(path.join(folder, "out", "preview.png"))).size > 10000, "real preview");
        assert((await fs.stat(path.join(folder, ".checks", "desktop.png"))).size > 10000, "desktop capture");
        assert((await fs.stat(path.join(folder, ".checks", "mobile.png"))).size > 10000, "mobile capture");
        assert((await read(path.join(folder, ".generation-input.sha256"))).trim() === createHash("sha256").update(JSON.stringify([prompt, design])).digest("hex"), "exact input fingerprint");
        assert(Boolean(await read(path.join(folder, ".generation-preview.sha256"))), "preview digest");
        assert(registered.enabled === (existed?.enabled || false), "selection preserved");
        assert(registered.deployed === (existed?.deployed || false), "deployment preserved");
        assert(registered.slug === slug, "public slug");
        assert(!/^\d+-/.test(slug), "unnumbered public path");
        const files = await fs.readdir(path.join(folder, "out"));
        assert(files.every((file) => ["index.html", "style.css", "app.js", "preview.png"].includes(file) || file.endsWith(".svg")), "safe export boundary");
        await save(path.join(folder, ".checks", "final-audit.json"), { assertions: auditChecks.length, checks: auditChecks });
        await fs.appendFile(path.join(folder, "README.md"), `\nVerified: ${qa.assertions} browser assertions, 3 registration/preservation checks, ${auditChecks.length} final audit assertions. Desktop 1200×900 and mobile 390×844 full-page images actually opened: ${visual} Evidence: .checks\\qa.json, final-audit.json and PNGs. Registered disabled/undeployed. No builds, installs, dist or publication.\n`);
        const record = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "generated", status: "generated", ...metadata, tags_nonempty: true, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: auditChecks.length, visualQA: true, visualNotes: visual, mocks: spec.mocks, limits: "Static browser demonstration; no backend, payment, real booking, financial or email delivery; no publication" };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        const entry = manifest.records.find((item) => item.prompt === id);
        if (!entry) throw Error("Manifest record absent");
        Object.assign(entry, { status: "generated", reason: "Static, browser and actual visual QA passed; registered disabled", ...metadata, assertions: qa.assertions, registrationChecks: 3, finalAuditChecks: auditChecks.length, visualQA: true, exportBoundary: "homepage-assets-preview-only" });
        await save(manifestFile, manifest);
        console.log(`COMPLETE ${id}: ${qa.assertions} browser + 3 registration + ${auditChecks.length} final checks; lock released on exit`);
    }
    catch (error)
    {
        const record = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt: id, display_model_name: "GPT-6", modelId: "gpt-6.1-sol", output: path.relative(root, folder), action: "retained", status: "failed", error: error.message, ...metadata };
        await fs.appendFile(path.join(root, "logs", "render-prompt-pages-ai.log"), `${JSON.stringify(record)}\n`, "utf8");
        const manifest = await json(manifestFile);
        Object.assign(manifest.records.find((item) => item.prompt === id), { status: "failed", reason: error.message, ...metadata });
        await save(manifestFile, manifest);
        throw error;
    }
});
