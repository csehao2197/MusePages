import fs from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { PromptPageWorkflow as Workflow, WorkspaceFiles as Files, StaticHomepage as Static } from "../workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../workflows/script/deploy-site.mjs";

const root = process.cwd();
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-resume-2026-11-15.json";
const runId = "ai-gpt6-resume-297a34d7-6a01-4e5f-afef-bf4cf20677cd";
const number = Number(process.argv[2]);
if (!Number.isInteger(number) || number < 497 || number > 506) throw Error("Outside assigned scope");
const source = (await Files.json("src\\manifest.json")).find((item) => item.id === number);
const [prompt] = await Workflow.prompts(root, [String(number)]);
const model = { directory: "GPT-6", modelId: "gpt-6.1-sol" };
const initialManifest = await Files.json(manifestFile);
const initialRecord = initialManifest.records.find((item) => item.prompt === prompt.id);
if (initialRecord.status !== "pending-generation") throw Error("Record requires explicit continuation authorization");
let current;
let status = "failed";
let error = null;
let qa = null;
let registration = null;
let details = null;
try
{
    await Workflow.withPromptLock(root, prompt.id, async () =>
    {
        current = await Workflow.inspect(root, prompt, model);
        if (current.metadata) throw Error("Unexpected existing result: explicit retry approval required");
        if (process.argv[3] === "--blocked")
        {
            status = "blocked";
            error = process.argv[4];
            return;
        }
        await fs.mkdir(current.folder, { recursive: true });
        current.metadata = { modelId: model.modelId, tags: [], staticDir: "out", generated: false, preview: false, validated: false, config_added: false };
        await Files.saveJson(current.file, current.metadata);
        const digest = createHash("sha256").update(JSON.stringify([prompt.content, await Files.text("src\\workflows\\AI Agent\\DESIGN.md")])).digest("hex");
        if (digest !== initialRecord.expectedInputDigest) throw Error("Authorized input digest changed");
        await Files.saveText(path.join(current.folder, ".generation-input.sha256"), digest + "\n");
        await fs.copyFile(source.license_file, path.join(current.folder, "LICENSE"));
        await Files.saveText(path.join(current.folder, "NOTICE"), `Prompt: ${source.title}\nSource: ${source.source_url}\nOriginal prompt license: ${source.license}; see LICENSE.\nOriginal local artwork is used; no rights are asserted over referenced third-party media.\nGenerated using gpt-6.1-sol; public display label GPT-6.\n`);
        console.log(`LOCKED ${prompt.id} PID ${process.pid}`);
        const signal = path.join(current.folder, ".finish");
        const deadline = Date.now() + 40 * 60 * 1000;
        while (!await Files.info(signal))
        {
            if (Date.now() > deadline) throw Error("Source completion timed out");
            await delay(500);
        }
        await fs.unlink(signal);
        details = await Files.json(path.join(current.folder, ".details.json"));
        const categories = (await Files.json("deploy\\config.json")).categories;
        if (!details.tags.length || new Set(details.tags).size !== details.tags.length ||
            details.tags.some((tag) => !tag.trim() || categories.some((category) => category.toLowerCase() === tag.toLowerCase()))) throw Error("Invalid tags");
        current.metadata.tags = details.tags;
        await Static.checkSource(current.folder);
        current.metadata.generated = true;
        await Files.saveJson(current.file, current.metadata);
        qa = await Files.json(path.join(current.folder, ".checks", "qa.json"));
        if (!qa.passed || !qa.visualReviewed || qa.viewports.length !== 2) throw Error("Browser/visual QA incomplete");
        const exported = path.join(current.folder, "out");
        const staticDigest = await Static.validateStaticOutput(exported, details.slug, "GPT-6");
        if (qa.staticDigest !== staticDigest) throw Error("Export changed after browser QA");
        await Static.ensurePreview(root, current, exported, staticDigest, undefined, false);
        current.metadata.preview = true;
        current.metadata.validated = true;
        await Files.saveJson(current.file, current.metadata);
        const previous = await Files.json("deploy\\config.json");
        const newGroup = !previous.pages[prompt.id];
        await registerGeneratedPage(root, { prompt: prompt.id, model: "GPT-6", slug: details.slug, title: details.title, tags: details.tags, staticDir: "out" });
        if (newGroup)
        {
            const lockFile = "deploy\\.publish.lock";
            const ownership = `${process.pid}\n${randomUUID()}\n`;
            let handle;
            const deadline = Date.now() + 10000;
            while (!handle)
            {
                try
                {
                    handle = await fs.open(lockFile, "wx");
                }
                catch (issue)
                {
                    if (issue.code !== "EEXIST" || Date.now() > deadline) throw issue;
                    await delay(50);
                }
            }
            try
            {
                await handle.writeFile(ownership);
                const original = await Files.text("deploy\\config.json");
                const config = JSON.parse(original);
                if (!config.pages[prompt.id].category) config.pages[prompt.id].category = source.category;
                if (await Files.text("deploy\\config.json") !== original) throw Error("Concurrent config change");
                if (await Files.text(lockFile) !== ownership) throw Error("Publish lock ownership changed");
                await Files.saveJson("deploy\\config.json", config);
            }
            finally
            {
                await handle.close();
                if (await Files.text(lockFile) === ownership) await fs.unlink(lockFile);
            }
        }
        const group = (await Files.json("deploy\\config.json")).pages[prompt.id];
        registration = group.pages.find((option) => option.model === "GPT-6");
        if (!registration || registration.enabled || registration.deployed || group.category !== source.category) throw Error("Registration verification failed");
        current.metadata.config_added = true;
        await Files.saveJson(current.file, current.metadata);
        status = "generated";
    });
}
catch (issue)
{
    error = issue.message;
    status = /existing|locked|identity|digest changed/i.test(error) ? "blocked" : "failed";
}
const result = {
    timestamp: new Date().toISOString(), runId, prompt: prompt.id,
    display_model_name: "GPT-6", modelId: model.modelId, output: current?.folder || initialRecord.output,
    action: status === "generated" ? "generated-validated-registered" : "preserved-blocked-or-failed",
    status, tags: current?.metadata?.tags || [], tagsNonempty: Boolean(current?.metadata?.tags?.length),
    metadata: current?.metadata || null, registration, deployed: registration?.deployed ?? null,
    qa, limitations: details?.limitations || "No browser QA or preview was performed for a blocked item.", error
};
await fs.mkdir("logs", { recursive: true });
await fs.appendFile("logs\\render-prompt-pages-ai.log", JSON.stringify(result) + "\n", "utf8");
const manifest = await Files.json(manifestFile);
const record = manifest.records.find((item) => item.prompt === prompt.id);
if (JSON.stringify(record) !== JSON.stringify(initialRecord)) throw Error("Manifest record changed concurrently");
Object.assign(record, { status, metadata: result.metadata, registration, tags: result.tags, evidence: qa, error, completedAt: result.timestamp });
await Files.saveJson(manifestFile, manifest);
console.log(JSON.stringify({ prompt: prompt.id, status, error }));
if (status !== "generated" && status !== "blocked") process.exitCode = 1;
