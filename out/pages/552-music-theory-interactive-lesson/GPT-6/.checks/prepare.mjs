import path from "node:path";
import {fileURLToPath} from "node:url";
import {createHash} from "node:crypto";
import {readFile, writeFile, mkdir, copyFile} from "node:fs/promises";
import {createRequire} from "node:module";
import {WorkspaceFiles, StaticHomepage} from "../../../../../src/workflows/script/render-prompt-page.mjs";

const workspace = process.cwd();
const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const job = await WorkspaceFiles.json(path.join(workspace, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await WorkspaceFiles.json(job.stateFile);
const lockPid = Number((await readFile(job.promptLock, "utf8")).trim());
if (job.prompt !== "552-music-theory-interactive-lesson" || job.output !== folder || job.modelId !== "gpt-6.1-sol" || state.runId !== job.runId || state.ownedLock?.pid !== lockPid || state.ownedLock?.prompt !== job.prompt)
{
    throw Error("Job / owned lock mismatch");
}
process.kill(lockPid, 0);
const metadata =
{
    modelId: job.modelId,
    tags: ["Music", "Ear Training", "Ultraviolet"],
    staticDir: "out",
    generated: false,
    preview: false,
    validated: false,
    config_added: false
};
const localAssets = process.argv.includes("--local-assets");
if (await WorkspaceFiles.info(path.join(folder, "metadata.json")))
{
    const existing = await WorkspaceFiles.json(path.join(folder, "metadata.json"));
    if (!localAssets || existing.modelId !== job.modelId || existing.generated !== false) throw Error("Existing metadata requires preservation");
}
else await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
await mkdir(path.join(folder, "images"), {recursive: true});
await mkdir(path.join(folder, "fonts"), {recursive: true});
const assets = localAssets ? await WorkspaceFiles.json(path.join(folder, ".checks", "asset-evidence.json")) : [];
async function download(url, target)
{
    const response = await fetch(url, {signal: AbortSignal.timeout(45000)});
    if (!response.ok) throw Error(`Required asset HTTP ${response.status}: ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) throw Error(`Empty required asset: ${url}`);
    await writeFile(path.join(folder, target), bytes);
    assets.push({path: target, source: url, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex")});
}
for (const name of localAssets ? [] : ["hero-stage", "instructor-portrait", "evening-class", "keys-closeup"])
{
    await download(`https://media.vibefather.ai/assets/cf319907-f8d2-4e65-990a-90703b5a0bec/${name}.webp`, path.join("images", `${name}.webp`));
}
for (const name of localAssets ? [] : ["unbounded", "figtree", "jetbrains-mono"])
{
    const response = await fetch(`https://registry.npmjs.org/@fontsource-variable/${name}/latest`, {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw Error(`Cannot establish font package version: ${name}`);
    const packageInfo = await response.json();
    const base = `https://cdn.jsdelivr.net/npm/@fontsource-variable/${name}@${packageInfo.version}`;
    await download(`${base}/files/${name}-latin-wght-normal.woff2`, path.join("fonts", `${name}.woff2`));
    await download(`${base}/LICENSE`, path.join("fonts", `${name}-OFL.txt`));
}
const require = createRequire(import.meta.url);
const React = require("react");
const {renderToStaticMarkup} = require("react-dom/server");
const lucide = require("lucide-react");
const names = {"volume-2": "Volume2", "volume-x": "VolumeX", play: "Play", check: "Check", x: "X", plus: "Plus", trophy: "Trophy", "rotate-ccw": "RotateCcw", "arrow-down": "ArrowDown", "arrow-right": "ArrowRight", headphones: "Headphones"};
const symbols = Object.entries(names).map(([id, component]) =>
{
    const svg = renderToStaticMarkup(React.createElement(lucide[component]));
    return `<symbol id="${id}" viewBox="0 0 24 24">${svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</symbol>`;
});
await writeFile(path.join(folder, "icons.svg"), `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>\n`);
await copyFile(path.join(workspace, "node_modules", "lucide-react", "LICENSE"), path.join(folder, "lucide-LICENSE.txt"));
await copyFile(path.join(workspace, job.provenance.license_file), path.join(folder, "LICENSE"));
await writeFile(path.join(folder, "NOTICE.txt"), "Music Theory Interactive Lesson · Prompt and supplied photos by VibeFather, https://vibefather.ai/t/music-theory-interactive-lesson · CC BY-NC 4.0, https://creativecommons.org/licenses/by-nc/4.0/. Non-commercial use only; commercial use needs a VibeFather Pro license. Adapted by GPT-6 (gpt-6.1-sol) for MusePages. Font and Lucide notices accompany their files.\n");
const colors = ["#FF5A47", "#FF8A2B", "#FFC21F", "#E6FF2E", "#8CF23C", "#2EE87F", "#1FE5C4", "#29C9FF", "#6FA3FF", "#A98BFF", "#E872FF", "#FF5CB0"];
const wedges = colors.map((fill, i) =>
{
    const a = (i * 30 - 90) * Math.PI / 180;
    const b = ((i + 1) * 30 - 90) * Math.PI / 180;
    return `<path d="M24 24 L${24 + 22 * Math.cos(a)} ${24 + 22 * Math.sin(a)} A22 22 0 0 1 ${24 + 22 * Math.cos(b)} ${24 + 22 * Math.sin(b)} Z" fill="${fill}"/>`;
});
await writeFile(path.join(folder, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${wedges.join("")}<circle cx="24" cy="24" r="7" fill="#120634"/></svg>\n`);
let assetsDoc = await readFile(path.join(folder, "ASSETS.md"), "utf8");
for (const asset of assets.filter((a) => a.path.endsWith(".woff2")))
{
    const name = path.basename(asset.path, ".woff2");
    assetsDoc = assetsDoc.replace(new RegExp(`https://cdn\\.jsdelivr\\.net/npm/@fontsource-variable/${name}@[^ /]+/files/${name}-latin-wght-normal\\.woff2`, "g"), asset.source);
}
assetsDoc = assetsDoc.replaceAll("`lucide-LICENSE`", "`lucide-LICENSE.txt`");
await WorkspaceFiles.saveText(path.join(folder, "ASSETS.md"), assetsDoc);
await WorkspaceFiles.saveJson(path.join(folder, ".checks", "asset-evidence.json"), assets);
await StaticHomepage.checkSource(folder);
metadata.generated = true;
await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
const raw = await WorkspaceFiles.text(job.file);
const design = await WorkspaceFiles.text(path.join(workspace, "src", "workflows", "AI Agent", "DESIGN.md"));
await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
await StaticHomepage.copyHtml(folder, path.join(folder, "out"));
const digest = await StaticHomepage.validateStaticOutput(path.join(folder, "out"), "music-theory-interactive-lesson", "GPT-6");
console.log(JSON.stringify({lockPid, source: "html", flags: metadata, staticDigest: digest, assets: assets.map(({path: file, bytes}) => ({file, bytes}))}, null, 2));
