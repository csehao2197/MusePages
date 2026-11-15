import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { PromptPageWorkflow as Workflow, WorkspaceFiles as Files, StaticHomepage as Static } from "../workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-resume-2026-11-15.json";
const runId = "ai-gpt6-resume-297a34d7-6a01-4e5f-afef-bf4cf20677cd";
const id = Number(process.argv[2]);
if (id < 487 || id > 496) throw Error("Outside assigned scope");
const source = JSON.parse(await fs.readFile("src\\manifest.json", "utf8")).find((item) => item.id === id);
const prompt = { id: path.basename(source.filename, ".md"), content: await fs.readFile(path.join("data", "prompts", source.filename), "utf8") };
const model = { directory: "GPT-6", modelId: "gpt-6.1-sol" };
let current;
let status = "failed";
let error = null;
let qa = null;
let registration = null;
try
{
    await Workflow.withPromptLock(root, prompt.id, async () =>
    {
        current = await Workflow.inspect(root, prompt, model);
        if (current.metadata) throw Error("Unexpected existing result: explicit retry/continuation approval required");
        await fs.mkdir(current.folder, { recursive: true });
        current.metadata = { modelId: model.modelId, tags: [], staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await Files.saveJson(current.file, current.metadata);
        await Files.saveText(path.join(current.folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([prompt.content, await fs.readFile("src\\workflows\\AI Agent\\DESIGN.md", "utf8")])).digest("hex") + "\n");
        await fs.copyFile(source.license_file, path.join(current.folder, "LICENSE"));
        await Files.saveText(path.join(current.folder, "NOTICE"), `Prompt: ${source.title}\nSource: ${source.source_url}\nOriginal prompt copyright belongs to its authors; license: ${source.license} (see LICENSE).\nLocal original artwork replaces referenced third-party media; no external media rights are asserted.\nGenerated using gpt-6.1-sol; public label GPT-6.\n`);
        console.log(`LOCKED ${prompt.id} PID ${process.pid}`);
        const signal = path.join(current.folder, ".finish");
        const deadline = Date.now() + 40 * 60 * 1000;
        while (!await Files.info(signal))
        {
            if (Date.now() > deadline) throw Error("Source completion timed out");
            await delay(500);
        }
        await fs.unlink(signal);
        const details = await Files.json(path.join(current.folder, ".details.json"));
        current.metadata.tags = details.tags;
        const categories = (await Files.json("deploy\\config.json")).categories;
        if (!details.tags.length || details.tags.some((tag) => !tag.trim() || categories.some((category) => category.toLowerCase() === tag.toLowerCase()))) throw Error("Invalid tags");
        await Static.checkSource(current.folder);
        current.metadata.generated = true;
        await Files.saveJson(current.file, current.metadata);
        qa = await Files.json(path.join(current.folder, ".checks", "qa.json"));
        if (!qa.passed || !qa.visualReviewed || qa.viewports.length !== 2) throw Error("Browser/visual QA incomplete");
        const exported = path.join(current.folder, "out");
        const digest = await Static.validateStaticOutput(exported, details.slug, "GPT-6");
        await Static.ensurePreview(root, current, exported, digest, undefined, false);
        current.metadata.preview = true;
        current.metadata.validated = true;
        await Files.saveJson(current.file, current.metadata);
        const previous = await Files.json("deploy\\config.json");
        const newGroup = !previous.pages[prompt.id];
        await registerGeneratedPage(root, { prompt: prompt.id, model: "GPT-6", slug: details.slug, title: details.title, tags: details.tags, staticDir: "out" });
        if (newGroup)
        {
            const lockFile = "deploy\\.publish.lock";
            let handle;
            const deadline = Date.now() + 5000;
            while (!handle)
            {
                try { handle = await fs.open(lockFile, "wx"); }
                catch (issue)
                {
                    if (issue.code !== "EEXIST" || Date.now() > deadline) throw issue;
                    await delay(50);
                }
            }
            try
            {
                await handle.writeFile(`${process.pid}\n`);
                const original = await fs.readFile("deploy\\config.json", "utf8");
                const config = JSON.parse(original);
                if (!config.pages[prompt.id].category) config.pages[prompt.id].category = "Creative";
                if (await fs.readFile("deploy\\config.json", "utf8") !== original) throw Error("Concurrent config change");
                await Files.saveJson("deploy\\config.json", config);
            }
            finally
            {
                await handle.close();
                await fs.unlink(lockFile);
            }
        }
        const group = (await Files.json("deploy\\config.json")).pages[prompt.id];
        registration = group.pages.find((option) => option.model === "GPT-6");
        if (!registration || registration.enabled || registration.deployed || !group.category) throw Error("Registration verification failed");
        current.metadata.config_added = true;
        await Files.saveJson(current.file, current.metadata);
        status = "generated";
    });
}
catch (issue)
{
    error = issue.message;
    status = /existing|locked|metadata/i.test(error) ? "blocked" : "failed";
}
const result = {
    timestamp: new Date().toISOString(), runId, prompt: prompt.id,
    display_model_name: "GPT-6", modelId: model.modelId, output: current?.folder,
    action: status === "generated" ? "generated-validated-registered" : "preserved-attempt",
    status, tags: current?.metadata?.tags || [], tagsNonempty: Boolean(current?.metadata?.tags?.length),
    metadata: current?.metadata || null, registration, deployed: registration?.deployed ?? null,
    qa, limitations: "Static HTML adaptation; original local artwork replaces unlicensed remote media; no runtime backend or external fonts.", error
};
await fs.mkdir("logs", { recursive: true });
await fs.appendFile("logs\\render-prompt-pages-ai.log", JSON.stringify(result) + "\n", "utf8");
const manifest = await Files.json(manifestFile);
const record = manifest.records.find((item) => item.prompt === prompt.id);
Object.assign(record, { status, metadata: result.metadata, registration, tags: result.tags, evidence: qa, error, completedAt: result.timestamp });
await Files.saveJson(manifestFile, manifest);
console.log(JSON.stringify({ prompt: prompt.id, status, error }));
if (status !== "generated") process.exitCode = 1;
