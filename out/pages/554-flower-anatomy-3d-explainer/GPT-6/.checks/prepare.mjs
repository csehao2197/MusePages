import { readFile, writeFile, copyFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
if (job.prompt !== "554-flower-anatomy-3d-explainer" || job.modelId !== "gpt-6.1-sol") throw Error("Wrong job");
const durable = JSON.parse(await readFile(job.stateFile, "utf8"));
const pid = Number((await readFile(job.promptLock, "utf8")).trim());
if (durable.runId !== job.runId || durable.ownedLock.prompt !== job.prompt || durable.ownedLock.pid !== pid) throw Error("Lock identity mismatch");
process.kill(pid, 0);
const folder = job.output;
const exported = path.join(folder, "out");
for (const name of ["vendor", "fonts", "licenses"]) await mkdir(path.join(folder, name), { recursive: true });
const node = path.join(folder, "node_modules");
for (const name of ["three.module.js", "three.core.js"])
{
    await copyFile(path.join(node, "three", "build", name), path.join(folder, "vendor", name));
}
const controls = await readFile(path.join(node, "three", "examples", "jsm", "controls", "OrbitControls.js"), "utf8");
await writeFile(path.join(folder, "vendor", "OrbitControls.js"), controls.replace("from 'three'", "from './three.module.js'"));
for (const [family, short, weights] of [["fraunces", "fraunces", [500, 600, 700]], ["inter", "inter", [400, 500, 600, 700]], ["ibm-plex-mono", "plex", [400, 500]]])
{
    for (const weight of weights) await copyFile(path.join(node, "@fontsource", family, "files", `${family}-latin-${weight}-normal.woff2`), path.join(folder, "fonts", `${short}-${weight}.woff2`));
    await copyFile(path.join(node, "@fontsource", family, "LICENSE"), path.join(folder, "licenses", `${family}-OFL.txt`));
}
await copyFile(path.join(node, "three", "LICENSE"), path.join(folder, "licenses", "three-MIT.txt"));
await copyFile(path.join(root, "node_modules", "lucide-react", "LICENSE"), path.join(folder, "licenses", "lucide-ISC.txt"));
await copyFile(path.join(root, job.provenance.license_file), path.join(folder, "licenses", "prompt-CC-BY-NC-4.0.txt"));
const iconNames = ["rotate-ccw", "eye", "eye-off", "play", "pause", "chevron-left", "chevron-right", "check", "x", "focus", "rotate-3d", "award"];
const icons = {};
for (const name of iconNames)
{
    const file = path.join(root, "node_modules", "lucide-react", "dist", "esm", "icons", `${name}.mjs`);
    const { __iconData } = await import(pathToFileURL(file));
    icons[name === "rotate-3d" ? "rotate3d" : name] = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${__iconData.node.map(([tag, props]) => `<${tag} ${Object.entries(props).filter(([key]) => key !== "key").map(([key, value]) => `${key}="${value}"`).join(" ")} />`).join("")}</svg>`;
}
await writeFile(path.join(folder, "icons.js"), `// Lucide v1.61.0, ISC. See licenses/lucide-ISC.txt.\nexport const icons = ${JSON.stringify(icons, null, 4)};\n`);
await copyFile(path.join(folder, "src", "content.ts"), path.join(folder, "content.js"));
const fingerprint = createHash("sha256").update(JSON.stringify([await readFile(job.file, "utf8"), await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8")])).digest("hex");
await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), fingerprint + "\n");
const metadataFile = path.join(folder, "metadata.json");
if (!await WorkspaceFiles.info(metadataFile))
{
    await WorkspaceFiles.saveJson(metadataFile, { modelId: job.modelId, tags: ["Botany", "3D"], staticDir: "out", generated: false, preview: false, validated: false, config_added: false });
}
const source = await StaticHomepage.checkSource(folder);
await mkdir(exported, { recursive: true });
for (const name of ["index.html", "styles.css", "app.js", "flowerScene.js", "content.js", "icons.js", "favicon.svg", "NOTICE"])
{
    await copyFile(path.join(folder, name), path.join(exported, name));
}
for (const name of ["vendor", "fonts", "licenses"]) await StaticHomepage.copyHtml(path.join(folder, name), path.join(exported, name));
const digest = await StaticHomepage.validateStaticOutput(exported, "flower-anatomy-3d-explainer", "GPT-6");
const metadata = await WorkspaceFiles.json(metadataFile);
metadata.generated = true;
await WorkspaceFiles.saveJson(metadataFile, metadata);
console.log(JSON.stringify({ source, digest, fingerprint, exported }));
