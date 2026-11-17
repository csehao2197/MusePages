import path from "node:path";
import { createHash } from "node:crypto";
import { readFile, copyFile, mkdir, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const job = JSON.parse(await readFile(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const manifest = JSON.parse(await readFile(job.stateFile, "utf8"));
const pid = Number((await readFile(job.promptLock, "utf8")).trim());
if (job.prompt !== "614-light-beam-lens-puzzle-game" || manifest.runId !== job.runId ||
    manifest.ownedLock.prompt !== job.prompt || manifest.ownedLock.pid !== pid) throw Error("Coordinator lock mismatch");
process.kill(pid, 0);
const folder = job.output;
const vendor = await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, folder), "vendor");
const local = path.join(folder, "node_modules");
for (const name of ["three.module.js", "three.core.js"])
{
    await copyFile(path.join(local, "three", "build", name), path.join(vendor, name));
}
const fontFiles =
[
    ["@fontsource-variable", "space-grotesk", "space-grotesk-latin-wght-normal.woff2"],
    ["@fontsource", "ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff2"],
    ["@fontsource", "ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2"]
];
for (const [scope, name, filename] of fontFiles)
{
    await copyFile(path.join(local, scope, name, "files", filename), path.join(vendor, filename));
}
for (const [source, destination] of
[
    [path.join(local, "three", "LICENSE"), "THREE-LICENSE.txt"],
    [path.join(local, "@fontsource-variable", "space-grotesk", "LICENSE"), "SPACE-GROTESK-LICENSE.txt"],
    [path.join(local, "@fontsource", "ibm-plex-mono", "LICENSE"), "IBM-PLEX-LICENSE.txt"],
    [path.join(workspace, "node_modules", "lucide-react", "LICENSE"), "LUCIDE-LICENSE.txt"]
])
{
    await copyFile(source, path.join(vendor, destination));
}
const require = createRequire(path.join(workspace, "package.json"));
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const lucide = require("lucide-react");
const icons = Object.fromEntries(["Undo2", "RotateCcw", "Grid3X3", "CircleHelp", "Volume2", "VolumeX", "X", "Check", "ChevronRight"].map((name) =>
    [name, renderToStaticMarkup(React.createElement(lucide[name], { "aria-hidden": true, width: 18, height: 18, strokeWidth: 1.6 }))]));
await WorkspaceFiles.saveText(path.join(folder, "icons.js"), `export const icons = ${JSON.stringify(icons, null, 4)};\n`);
const metadataFile = path.join(folder, "metadata.json");
let metadata;
if (await WorkspaceFiles.info(metadataFile))
{
    metadata = await WorkspaceFiles.json(metadataFile);
    if (metadata.modelId !== job.modelId) throw Error("Existing identity mismatch");
}
else
{
    metadata = { modelId: job.modelId, tags: ["Optics", "Puzzle", "Isometric"], staticDir: "out", generated: false, preview: false, config_added: false, validated: false };
    await WorkspaceFiles.saveJson(metadataFile, metadata);
}
await StaticHomepage.checkSource(folder);
const fullRawMarkdown = await WorkspaceFiles.text(job.file);
const fullDesign = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
const input = createHash("sha256").update(JSON.stringify([fullRawMarkdown, fullDesign])).digest("hex");
const fingerprint = path.join(folder, ".generation-input.sha256");
if (await WorkspaceFiles.info(fingerprint) && (await WorkspaceFiles.text(fingerprint)).trim() !== input) throw Error("Input fingerprint mismatch");
await WorkspaceFiles.saveText(fingerprint, input + "\n");
metadata.generated = true;
await WorkspaceFiles.saveJson(metadataFile, metadata);
const output = await WorkspaceFiles.ensureDirectory(workspace, path.relative(workspace, folder), "out");
for (const name of ["index.html", "style.css", "facet.svg", "content.js", "levels.js", "trace.js", "state.js", "audio.js", "scene.js", "app.js", "icons.js", "LICENSE.txt"])
{
    await copyFile(path.join(folder, name), path.join(output, name));
}
await mkdir(path.join(output, "vendor"), { recursive: true });
for (const name of await readdir(vendor)) await copyFile(path.join(vendor, name), path.join(output, "vendor", name));
const digest = await StaticHomepage.validateStaticOutput(output, "light-beam-lens-puzzle-game", "GPT-6");
console.log(JSON.stringify({ sourceChecked: true, input, staticDigest: digest, output }));
