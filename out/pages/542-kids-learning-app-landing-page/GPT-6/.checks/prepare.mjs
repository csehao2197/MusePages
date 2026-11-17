import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, copyFile, cp, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrowRight, Check, Plus, X, Volume2, Leaf, UserRound, ShieldCheck, BookOpen } from "lucide-react";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const durable = JSON.parse(await readFile(job.stateFile, "utf8"));
const pid = Number((await readFile(job.promptLock, "utf8")).trim());
if (job.prompt !== "542-kids-learning-app-landing-page" || job.modelId !== "gpt-6.1-sol" || job.runId !== durable.runId || durable.activePrompt !== job.prompt || durable.ownedLock.prompt !== job.prompt || durable.ownedLock.pid !== pid)
{
    throw Error("Current job or coordinator lock mismatch");
}
process.kill(pid, 0);
const folder = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
if (folder !== job.output) throw Error("Wrong target");
const metadataFile = path.join(folder, "metadata.json");
const existing = await WorkspaceFiles.info(metadataFile);
if (!existing)
{
    await WorkspaceFiles.saveJson(metadataFile,
    {
        modelId: job.modelId,
        tags: ["Claymorphism", "Phonics", "Math"],
        staticDir: "out",
        generated: false,
        preview: false,
        validated: false,
        config_added: false
    });
}
const glyphs = { arrow: ArrowRight, check: Check, plus: Plus, close: X, volume: Volume2, leaf: Leaf, user: UserRound, shield: ShieldCheck, book: BookOpen };
const svg = Object.fromEntries(Object.entries(glyphs).map(([name, component]) => [name, renderToStaticMarkup(createElement(component, { "aria-hidden": "true", focusable: "false", size: 20, strokeWidth: 1.8 }))]));
await WorkspaceFiles.saveText(path.join(folder, "icons.js"), `export const icons = ${JSON.stringify(svg, null, 4)};\n`);
await copyFile(path.join(folder, "src", "content.ts"), path.join(folder, "content.js"));
const lucideRoot = path.join(root, "node_modules", "lucide-react");
await copyFile(path.join(lucideRoot, "LICENSE"), path.join(folder, "NOTICE"));
for (const file of ["index.html", "styles.css", "app.js", "icons.js", "content.js", "LICENSE", "NOTICE"])
{
    await copyFile(path.join(folder, file), path.join(folder, "out", file));
}
await cp(path.join(folder, "public"), path.join(folder, "out"), { recursive: true });
await StaticHomepage.checkSource(folder);
const metadata = await WorkspaceFiles.json(metadataFile);
if (metadata.modelId !== job.modelId) throw Error("Metadata identity mismatch");
metadata.generated = true;
await WorkspaceFiles.saveJson(metadataFile, metadata);
const raw = await readFile(job.file, "utf8");
const design = await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
const inputDigest = createHash("sha256").update(JSON.stringify([raw, design])).digest("hex");
await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), inputDigest);
const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "kids-learning-app-landing-page", "GPT-6");
console.log(JSON.stringify({ generated: metadata.generated, staticDigest: digest, inputDigest, copied: true }));
