import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { WorkspaceFiles as W } from "./render-prompt-page.mjs";

const root = process.cwd();
const job = await W.json(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"));
const state = await W.json(job.stateFile);
const lock = Number((await W.text(job.promptLock)).trim());
if (job.prompt !== "608-music-streaming-app-with-lyrics" || state.activePrompt !== job.prompt || state.ownedLock.prompt !== job.prompt || state.ownedLock.pid !== lock)
{
    throw Error("Coordinator lock ownership does not match.");
}
process.kill(lock, 0);
const folder = job.output;
if (!process.argv.includes("--assets") && await W.info(path.join(folder, "metadata.json")))
{
    throw Error("Existing metadata requires deliberate continuation, not another initialization.");
}
if (!process.argv.includes("--assets")) await W.saveJson(path.join(folder, "metadata.json"),
{
    modelId: job.modelId,
    tags: ["Music", "Lyrics", "Nocturnal"],
    staticDir: "out",
    generated: false,
    preview: false,
    validated: false,
    config_added: false
});
const raw = await W.text(job.file);
const design = await W.text(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"));
await W.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
const images = await W.ensureDirectory(root, path.relative(root, folder), "public", "images");
const fonts = await W.ensureDirectory(root, path.relative(root, folder), "public", "fonts");
const licenses = await W.ensureDirectory(root, path.relative(root, folder), "public", "licenses");

async function download(url)
{
    const result = await promisify(execFile)("curl.exe", ["--fail", "--location", "--silent", "--show-error", "--max-time", "60", url],
    {
        encoding: "buffer", maxBuffer: 15000000, windowsHide: true
    });
    return result.stdout;
}

for (const name of ["afterglow-avenue", "peach-static", "blue-hour-radio", "velvet-satellites", "glass-garden", "midnight-orchard"])
{
    const url = `https://media.vibefather.ai/assets/9726b42a-9387-4af5-b970-450a99dff4e6/${name}.webp`;
    const data = await download(url);
    if (data.subarray(8, 12).toString() !== "WEBP") throw Error("Invalid supplied cover");
    await writeFile(path.join(images, `${name}.webp`), data);
}
await W.saveText(path.join(images, "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M37 10C18-1 0 26 15 38c10 9 23-3 25-15" fill="none" stroke="#ffb08a" stroke-width="3"/><ellipse cx="25" cy="24" rx="4" ry="9" transform="rotate(32 25 24)" fill="#ffb08a"/></svg>');
const fontRecords = [];
for (const [pkg, name, wanted] of [
    ["@fontsource-variable/fraunces", "fraunces", ["latin-wght-normal"]],
    ["@fontsource-variable/dm-sans", "dm-sans", ["latin-wght-normal"]],
    ["@fontsource/ibm-plex-mono", "ibm-plex-mono", ["latin-400-normal", "latin-500-normal"]]
])
{
    for (const style of wanted)
    {
        const url = `https://cdn.jsdelivr.net/fontsource/fonts/${name}${style.includes("wght") ? ":vf" : ""}@latest/${style}.woff2`;
        const filename = `${name}-${style}.woff2`;
        const data = await download(url);
        if (data.subarray(0, 4).toString() !== "wOF2") throw Error("Invalid font");
        await writeFile(path.join(fonts, filename), data);
        fontRecords.push({ package: pkg, file: `public/fonts/${filename}`, source: url });
    }
    await writeFile(path.join(licenses, `${name}-OFL.txt`), await download(`https://cdn.jsdelivr.net/npm/${pkg}@latest/LICENSE`));
}
if (fontRecords.length !== 4) throw Error("Missing required font files");
await W.saveJson(path.join(folder, ".font-sources.json"), fontRecords);
const names =
{
    library: "Library", chart: "ChartNoAxesCombined", disc: "Disc3", search: "Search", close: "X",
    play: "Play", pause: "Pause", previous: "SkipBack", next: "SkipForward", volume: "Volume2", mute: "VolumeX",
    add: "ListPlus", queue: "ListMusic", heart: "Heart", comment: "MessageCircle",
    up: "ArrowUp", down: "ArrowDown", remove: "Trash2", reset: "RotateCcw", arrow: "ArrowUpRight",
    info: "Info", check: "Check", menu: "Menu", music: "Music2", send: "Send", chevron: "ChevronRight"
};
const icons = {};
for (const [key, name] of Object.entries(names))
{
    icons[key] = renderToStaticMarkup(createElement(lucide[name], { size: 20, strokeWidth: 1.65, "aria-hidden": true, focusable: false }));
}
await W.saveText(path.join(folder, "icons.js"), `export const icons = ${JSON.stringify(icons, null, 4)};\n`);
await writeFile(path.join(licenses, "Lucide-ISC.txt"), await readFile(path.join(root, "node_modules", "lucide-react", "LICENSE")));
await writeFile(path.join(licenses, "Prompt-license.txt"), await readFile(path.join(root, job.provenance.license_file)));
await W.saveText(path.join(licenses, "Audio-CC0.txt"), "Original procedural audio generated for this template by GPT-6 (gpt-6.1-sol). Dedicated to the public domain under CC0 1.0: https://creativecommons.org/publicdomain/zero/1.0/\nNo recordings, samples, voices, or imitation of existing songs.\n");
console.log(JSON.stringify({ covers: 6, fonts: fontRecords, icons: Object.keys(icons).length, lock, metadataInitialized: true }));
