import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { WorkspaceFiles as W, StaticHomepage as S } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..", "..", "..", "..");
const job = await W.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await W.json(job.stateFile);
const pid = Number((await W.text(job.promptLock)).trim());
if (job.prompt !== "565-sorting-algorithms-visualizer" || root !== job.output ||
    state.runId !== job.runId || state.ownedLock.prompt !== job.prompt || state.ownedLock.pid !== pid)
{
    throw Error("Job or durable coordinator lock identity mismatch");
}
process.kill(pid, 0);
const metadataFile = path.join(root, "metadata.json");
const metadata = await W.json(metadataFile);
if (metadata.modelId !== "gpt-6.1-sol") throw Error("Unexpected model identity");
await S.checkSource(root);
const raw = await W.text(job.file);
const design = await W.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const digest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
await W.saveText(path.join(root, ".generation-input.sha256"), `${digest}\n`);
const out = await W.ensureDirectory(root, "out");
for (const name of ["index.html", "style.css", "favicon.svg", "app.js", "content.js", "stage.js", "icons.js", "LICENSE"])
{
    await copyFile(path.join(root, name), path.join(out, name));
}
for (const name of ["engine", "fonts", "licenses"])
{
    const target = await W.ensureDirectory(out, name);
    for (const file of await readdir(path.join(root, name)))
    {
        if (file.endsWith(".ts")) continue;
        await copyFile(path.join(root, name, file), path.join(target, file));
    }
}
const shared = (await W.json(path.join(workspace, "deploy", "config.json"))).pages[job.prompt]?.pages?.[0];
const slug = shared?.slug || "sorting-algorithms-visualizer";
await S.validateStaticOutput(out, slug, "GPT-6");
metadata.generated = true;
metadata.preview = false;
metadata.validated = false;
await W.saveJson(metadataFile, metadata);
console.log(JSON.stringify({ sourceChecked: true, inputDigest: digest, staticChecked: true, slug, output: out }));
