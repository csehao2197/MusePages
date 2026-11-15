import { readFile, writeFile, appendFile, readdir, access, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { PromptPageWorkflow, StaticHomepage, WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { registerGeneratedPage } from "../../../../../src/workflows/script/deploy-site.mjs";

const checks = path.dirname(fileURLToPath(import.meta.url));
const folder = path.dirname(checks);
const workspace = path.resolve(folder, "../../../..");
const prompt = path.basename(path.dirname(folder));
const slug = prompt.replace(/^\d+-/, "");
const manifestFile = "C:\\Users\\wanha\\.copilot\\session-state\\ae243afa-813b-49bb-8eb4-6605099d7278\\files\\render-pages-all.json";
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const waitFor = async (name) =>
{
    const deadline = Date.now() + 1800000;
    while (true)
    {
        try
        {
            await access(path.join(checks, name));
            return;
        }
        catch
        {
            if (Date.now() > deadline) throw Error(`Timed out waiting for ${name}`);
            await sleep(500);
        }
    }
};
await PromptPageWorkflow.withPromptLock(workspace, prompt, async () =>
{
    if ((await readdir(folder)).some((name) => name !== ".checks")) throw Error("Protected result appeared before lock; retained");
    await writeFile(path.join(checks, "locked"), String(process.pid));
    console.log(`LOCKED ${prompt} pid=${process.pid}`);
    await waitFor("source.ready");
    const item = await readJson(path.join(checks, "item.json"));
    const metadata =
    {
        modelId: "gpt-6.1-sol",
        tags: item.tags,
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    };
    const metadataFile = path.join(folder, "metadata.json");
    try
    {
        await StaticHomepage.checkSource(folder);
        await StaticHomepage.copyHtml(folder, path.join(folder, "out"));
        const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
        metadata.generated = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const input = await readFile(path.join(workspace, "data", "prompts", prompt, `${prompt}.md`), "utf8");
        const design = await readFile(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
        await writeFile(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([input, design])).digest("hex"));
        execFileSync(process.execPath, [path.join(checks, "verify.mjs")], { cwd: workspace, stdio: "inherit", timeout: 180000 });
        await StaticHomepage.ensurePreview(workspace, { folder }, path.join(folder, "out"), digest, undefined, false);
        console.log("QA_READY: desktop/mobile screenshots and preview available");
        await waitFor("visual.approved");
        const unchanged = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), slug, "GPT-6");
        if (unchanged !== digest) throw Error("Static output changed after QA");
        metadata.preview = true;
        metadata.validated = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const config = await readJson(path.join(workspace, "deploy", "config.json"));
        const existing = config.pages[prompt]?.pages?.[0];
        await registerGeneratedPage(workspace,
        {
            prompt,
            model: "GPT-6",
            slug: existing?.slug ?? slug,
            title: existing?.title ?? item.title,
            tags: item.tags,
            staticDir: "out"
        });
        const registered = (await readJson(path.join(workspace, "deploy", "config.json"))).pages[prompt].pages.find((entry) => entry.model === "GPT-6");
        if (!registered || registered.enabled || registered.deployed) throw Error("New registration is not disabled and undeployed");
        metadata.config_added = true;
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const qa = await readJson(path.join(checks, "results.json"));
        const summary =
        {
            timestamp: new Date().toISOString(),
            runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c",
            prompt,
            display_model_name: "GPT-6",
            modelId: metadata.modelId,
            output: path.relative(workspace, folder),
            action: "generated",
            status: "completed",
            tags: metadata.tags,
            tags_nonempty: metadata.tags.length > 0 && metadata.tags.every((tag) => tag.trim() === tag && tag.length > 0),
            ...metadata,
            deployed: false,
            assertions: qa.assertions,
            validation: { ...qa, visual: await readFile(path.join(checks, "visual.approved"), "utf8"), staticDigest: digest },
            mocks: item.mocks,
            limits: item.limits,
            builds: false,
            publication: false
        };
        await appendFile(path.join(workspace, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const manifest = await readJson(manifestFile);
        const record = manifest.records.find((entry) => entry.prompt === prompt);
        if (!record) throw Error("Missing assigned manifest record");
        Object.assign(record, summary);
        await WorkspaceFiles.saveJson(manifestFile, manifest);
        console.log(`COMPLETE ${prompt}: ${qa.assertions} assertions; registered disabled; logged`);
    }
    catch (error)
    {
        await WorkspaceFiles.saveJson(metadataFile, metadata);
        const summary = { timestamp: new Date().toISOString(), runId: "ai-gpt6-cc3b598e-2a27-4814-bab7-71861de97f6c", prompt, display_model_name: "GPT-6", output: path.relative(workspace, folder), ...metadata, status: "failed", error: error.stack };
        await appendFile(path.join(workspace, "logs", "render-prompt-pages-ai.log"), JSON.stringify(summary) + "\n", "utf8");
        const manifest = await readJson(manifestFile);
        Object.assign(manifest.records.find((entry) => entry.prompt === prompt), summary);
        await WorkspaceFiles.saveJson(manifestFile, manifest);
        throw error;
    }
});
