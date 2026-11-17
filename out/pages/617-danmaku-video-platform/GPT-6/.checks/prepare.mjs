import path from "node:path";
import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as lucide from "lucide-react";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";
import { startPreviewServer } from "../../../../../src/workflows/script/generate-preview.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
if (job.prompt !== "617-danmaku-video-platform" || job.modelId !== "gpt-6.1-sol") throw Error("Unexpected job");
const state = JSON.parse(await readFile(job.stateFile, "utf8"));
const lock = Number((await readFile(job.promptLock, "utf8")).trim());
if (state.runId !== job.runId || state.ownedLock?.prompt !== job.prompt || state.ownedLock?.pid !== lock) throw Error("Coordinator lock mismatch");
process.kill(lock, 0);
const folder = job.output;
await WorkspaceFiles.ensureDirectory(root, ...path.relative(root, folder).split(path.sep), "assets");
await WorkspaceFiles.ensureDirectory(root, ...path.relative(root, folder).split(path.sep), "out");
if (await WorkspaceFiles.info(path.join(folder, "metadata.json"))) throw Error("Preparation cannot overwrite existing metadata");
await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"),
{
    modelId: job.modelId,
    tags: ["Danmaku", "Visual Culture", "Local-first"],
    staticDir: "out",
    generated: false,
    preview: false,
    config_added: false,
    validated: false
});
const names = ["Search", "CircleHelp", "Compass", "Bookmark", "Users", "MessagesSquare", "ArrowUpRight", "Sun", "Sparkles", "Play", "Pause", "LayoutGrid", "ArrowLeft", "Share2", "Send"];
const symbols = names.map((name) =>
{
    const markup = renderToStaticMarkup(createElement(lucide[name], { size: 24 }));
    return `<symbol id="${name}" viewBox="0 0 24 24">${markup.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</symbol>`;
});
await writeFile(path.join(folder, "assets", "icons.svg"), `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><defs>${symbols.join("")}</defs></svg>`);
await writeFile(path.join(folder, "assets", "mark.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36"><path d="M5 8v22M13 4v24M21 7v17M29 12v8" stroke="#718064" stroke-width="4" stroke-linecap="round"/></svg>`);
await writeFile(path.join(folder, "assets", "fonts.css"), "");
for (const name of ["index.html", "styles.css", "app.js", "content.js", "film.js", "LICENSE.txt"])
{
    await cp(path.join(folder, name), path.join(folder, "out", name));
}
await cp(path.join(folder, "assets"), path.join(folder, "out", "assets"), { recursive: true });

function fixDuration(input, milliseconds)
{
    const position = input.indexOf(Buffer.from([0x15, 0x49, 0xa9, 0x66]));
    if (position < 0) throw Error("WebM info missing");
    const start = position + 4;
    let bytes = 1;
    while (!(input[start] & (0x80 >> (bytes - 1)))) bytes++;
    let length = input[start] & ((1 << (8 - bytes)) - 1);
    for (let i = 1; i < bytes; i++) length = length * 256 + input[start + i];
    const duration = Buffer.alloc(11);
    duration.set([0x44, 0x89, 0x88]);
    duration.writeDoubleBE(milliseconds, 3);
    const newSize = length + duration.length;
    if (newSize >= (2 ** (7 * bytes)) - 1) throw Error("Info length exceeds current encoding");
    const encoded = Buffer.alloc(bytes);
    let remaining = newSize;
    for (let i = bytes - 1; i >= 0; i--)
    {
        encoded[i] = remaining & 255;
        remaining = Math.floor(remaining / 256);
    }
    encoded[0] |= 0x80 >> (bytes - 1);
    const end = start + bytes + length;
    return Buffer.concat([input.subarray(0, start), encoded, input.subarray(start + bytes, end), duration, input.subarray(end)]);
}

let server;
let browser;
try
{
    server = await startPreviewServer(path.join(folder, "out"), { workspace: root });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
    await page.route("**/index.html", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><html lang=\"en\"><title>Original film recording</title><body></body></html>" }));
    const response = await page.goto(server.url);
    if (response.status() !== 200) throw Error("Recording server unresponsive");
    const records = await page.evaluate(async () => (await import("./content.js")).content.videos);
    const evidence = [];
    for (const record of records)
    {
        const result = await page.evaluate(async (record) =>
        {
            const { drawFilm } = await import("./film.js");
            const canvas = document.createElement("canvas");
            canvas.width = 960;
            canvas.height = 540;
            document.body.replaceChildren(canvas);
            drawFilm(canvas, record.palette, 4);
            const poster = canvas.toDataURL("image/png").split(",")[1];
            const stream = canvas.captureStream(24);
            const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1000000 });
            const chunks = [];
            recorder.ondataavailable = (event) => chunks.push(event.data);
            const finished = new Promise((resolve) =>
            {
                recorder.onstop = async () =>
                {
                    const bytes = new Uint8Array(await new Blob(chunks, { type: "video/webm" }).arrayBuffer());
                    let binary = "";
                    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
                    resolve(btoa(binary));
                };
            });
            const started = performance.now();
            let frame;
            const render = () =>
            {
                const time = (performance.now() - started) / 1000;
                drawFilm(canvas, record.palette, Math.min(time, record.duration));
                if (time < record.duration) frame = requestAnimationFrame(render);
                else recorder.stop();
            };
            recorder.start(500);
            render();
            const clip = await finished;
            cancelAnimationFrame(frame);
            stream.getTracks().forEach((track) => track.stop());
            return { poster, clip };
        }, record);
        const movie = fixDuration(Buffer.from(result.clip, "base64"), record.duration * 1000);
        for (const base of [folder, path.join(folder, "out")])
        {
            await writeFile(path.join(base, "assets", `${record.id}.png`), Buffer.from(result.poster, "base64"));
            await writeFile(path.join(base, "assets", record.file), movie);
        }
        evidence.push({ id: record.id, duration: record.duration, bytes: movie.length, sha256: createHash("sha256").update(movie).digest("hex"), originalCanvasRecording: true });
        console.log(`Recorded original ${record.id}: ${record.duration}s, ${movie.length} bytes`);
    }
    await WorkspaceFiles.saveJson(path.join(folder, ".checks", "media.json"), { original: true, silent: true, renderer: "film.js / Canvas 2D", clips: evidence, resourcesClosed: true });
}
finally
{
    await browser?.close();
    await server?.close();
}
console.log("Original film recording complete; recording resources closed.");
