import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { WorkspaceFiles, StaticHomepage } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const root = process.cwd();
const job = JSON.parse(await readFile(path.join(root, "src", "workflows", "script", ".ai-gpt6-current-job.json"), "utf8"));
const manifest = JSON.parse(await readFile(job.stateFile, "utf8"));
const pid = Number((await readFile(job.promptLock, "utf8")).trim());
if (job.prompt !== "628-video-streaming-platform" || manifest.runId !== job.runId || manifest.ownedLock.prompt !== job.prompt || manifest.ownedLock.pid !== pid)
{
    throw Error("Coordinator lock mismatch");
}
process.kill(pid, 0);
const folder = job.output;
if (await WorkspaceFiles.info(path.join(folder, "metadata.json")))
{
    throw Error("One-time authorship record: existing metadata and source must be preserved.");
}
const assets = path.join(folder, "assets");
await mkdir(assets, { recursive: true });
const metadata =
{
    modelId: "gpt-6.1-sol",
    tags: ["Cinema", "Streaming", "Nature"],
    staticDir: "out",
    generated: false,
    preview: false,
    validated: false,
    config_added: false
};
await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
const wrap = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs>${defs}<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter><linearGradient id="vignette" x2="0" y2="1"><stop stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#07100b" stop-opacity=".4"/></linearGradient></defs><g filter="url(#grain)">${body}</g><rect width="1600" height="900" fill="url(#vignette)"/></svg>`;
const gradient = (id, first, last) => `<linearGradient id="${id}" x2="0" y2="1"><stop stop-color="${first}"/><stop offset="1" stop-color="${last}"/></linearGradient>`;
const ridge = (points, fill) => `<path d="M0 900V${points} L1600 900Z" fill="${fill}"/>`;
const trees = (seed, color, y, count, scale = 1) => Array.from({ length: count }, (_, i) =>
{
    const x = ((i * 193 + seed * 59) % 1700) - 50;
    const h = (45 + (i * 31 + seed * 13) % 95) * scale;
    const base = y + (i * 43 % 85);
    return `<path d="M${x} ${base - h}l${h * .3} ${h * .6}h-${h * .15}l${h * .28} ${h * .4}h-${h * .36}v20h-${h * .14}v-20h-${h * .36}l${h * .28}-${h * .4}h-${h * .15}Z" fill="${color}"/>`;
}).join("");
const quiet = wrap(
    gradient("sky", "#8d9f8c", "#e7d1a0") + gradient("cliff", "#7d8060", "#283f36") + gradient("front", "#3e5841", "#172e25"),
    `<rect width="1600" height="900" fill="url(#sky)"/><circle cx="1125" cy="245" r="115" fill="#edc981" opacity=".8"/><circle cx="1125" cy="245" r="158" fill="#edc981" opacity=".09"/>
    ${ridge('410L170 335 300 380 460 260 590 320 740 185 900 315 1010 235 1160 335 1360 200 1600 320', "#a8ac90")}
    ${ridge('520L200 445 390 480 585 310 710 385 845 215 995 425 1110 335 1300 440 1435 295 1600 390', "#7b927f")}
    <path d="m585 310-115 117 115-47 60 17-11-40Zm260-95-55 86 55-25 34 8Zm590 80-49 61 47-29 37 12Z" fill="#d5d4b2" opacity=".7"/>
    ${ridge('630L175 560 295 640 465 450 610 535 770 400 920 470 1070 375 1230 570 1430 435 1600 490', "#4f7062")}
    <path d="M1040 900c-80-170-190-160-140-275s206-129 202-219c86 143-75 145-101 232-22 75 119 93 178 262" fill="#8ca294" opacity=".7"/>
    ${ridge('770L230 685 350 740 535 590 670 670 740 610 880 900', "url(#front)")}
    <path d="M1600 900H1040l80-162 53-30-10-60 125-80 46-160 66-62 30 55 38 183 132 66Z" fill="url(#cliff)"/>
    <path d="m1334 408 66-62-31 137-61 111 28-146Zm34 178-49 66-9 96 63-75Z" fill="#a2a27b" opacity=".45"/>
    ${trees(1, "#294936", 730, 13, 1.2)}${trees(5, "#1c3428", 850, 17, 1.5)}
    <path d="m1284 649 18-22 17-7 11 8 3 19-9 8-2 42h-7l-4-30-7 27h-7l7-43Z" fill="#16291f"/><path d="m1301 634 15-6 10 10-6 20-18-3Z" fill="#d7965f"/><circle cx="1318" cy="620" r="8" fill="#27382a"/><path d="m1330 652 18 42" stroke="#1b2b20" stroke-width="3"/>
    <path d="M800 180q8-10 15 0m-15 0q-8-10-15 0M875 144q7-8 12 0m-12 0q-7-8-12 0" fill="none" stroke="#344b3c" stroke-width="2"/>`
);
const tidal = wrap(
    gradient("seaSky", "#a9b5b4", "#e9c5a5") + gradient("water", "#769b9b", "#294f5b"),
    `<rect width="1600" height="900" fill="url(#seaSky)"/><circle cx="1030" cy="340" r="97" fill="#f3d9b2"/><path d="M0 470q450-50 800 0t800-20v450H0" fill="url(#water)"/><path d="M0 620q450-60 850 20t750-10M0 700q650-35 1000 20t600 0M0 800q450-20 850 10t750 35" stroke="#d3e2d4" fill="none" stroke-width="10" opacity=".6"/><path d="M0 780q400-80 700 40t900-10v90H0" fill="#c2b9a2"/><path d="M0 460q180-140 380-45l100 60Z" fill="#416467"/><path d="m1200 480 150-62 112 78Z" fill="#527171"/>`
);
const night = wrap(
    gradient("nightSky", "#14182e", "#6b3959"),
    `<rect width="1600" height="900" fill="url(#nightSky)"/><circle cx="1110" cy="205" r="80" fill="#dd9a9b"/><path d="M0 600h1600v300H0" fill="#202138"/>${Array.from({ length: 20 }, (_, i) =>
    {
        const x = i * 87;
        const y = 300 + i * 137 % 240;
        return `<rect x="${x}" y="${y}" width="78" height="${900-y}" fill="${i % 2 ? "#242b40" : "#33324e"}"/>${Array.from({ length: 12 }, (_, k) => `<rect x="${x+12+(k%3)*21}" y="${y+20+Math.floor(k/3)*36}" width="9" height="17" fill="${(i+k)%3 ? "#e5ad83" : "#73a3ac"}" opacity="${(i+k)%4 ? ".8" : ".15"}"/>`).join("")}`;
    }).join("")}<path d="M0 795 1600 750M0 845l1600-40" stroke="#ba6589" stroke-width="5"/><path d="M600 900 900 720h80l300 180" fill="#161c2c"/><path d="m918 790 70 95" stroke="#d39a82" stroke-width="4"/>`
);
const higher = wrap(
    gradient("goldSky", "#b39775", "#eed9af"),
    `<rect width="1600" height="900" fill="url(#goldSky)"/><circle cx="1000" cy="285" r="150" fill="#f1d098"/>${ridge('500L160 420 340 550 560 310 780 490 1000 300 1230 470 1470 340 1600 380', "#bbaa89")}${ridge('700L200 510 480 620 720 405 990 650 1290 435 1600 640', "#8c917b")}${ridge('720L280 630 520 750 850 550 1150 730 1420 530 1600 650', "#5f7966")}${ridge('820L230 720 600 850 900 690 1250 890 1600 720', "#365d4d")}${trees(4, "#244939", 860, 20, .8)}`
);
const orbit = wrap(
    gradient("space", "#1a1e35", "#574a68") + '<radialGradient id="planet"><stop stop-color="#d5ab91"/><stop offset="1" stop-color="#65536d"/></radialGradient>',
    `<rect width="1600" height="900" fill="url(#space)"/>${Array.from({ length: 130 }, (_, i) => `<circle cx="${(i*167)%1600}" cy="${(i*97)%900}" r="${i%4 ? 1 : 2}" fill="#ddd7cd" opacity="${i%3 ? ".4" : ".8"}"/>`).join("")}<circle cx="930" cy="440" r="224" fill="url(#planet)"/><ellipse cx="930" cy="460" rx="440" ry="80" fill="none" stroke="#b09b94" stroke-width="33" transform="rotate(-25 930 460)" opacity=".8"/><circle cx="1190" cy="190" r="53" fill="#b9c9b0"/><circle cx="350" cy="650" r="89" fill="#8b8ba0"/><path d="m0 830 330-110 300 140 300-65 300 105H0" fill="#1d2336"/>`
);
const rain = wrap(
    gradient("forest", "#708d70", "#243e35"),
    `<rect width="1600" height="900" fill="url(#forest)"/><path d="M950 0 440 900h220L1110 0" fill="#d5d5a0" opacity=".13"/><path d="m1260 0-310 900h110L1370 0" fill="#e1dfaf" opacity=".1"/>${trees(3, "#446b50", 650, 16, 3)}${trees(7, "#2c513c", 750, 12, 4)}${trees(6, "#193e2f", 860, 14, 4)}<path d="M700 900c80-170 220-190 240-300 35 140-50 198-50 300" fill="#7d9781"/><path d="M0 855q300-100 570 10t700-20 330 0v55H0" fill="#1b392a"/>${Array.from({ length: 80 }, (_, i) => `<path d="m${i*113%1600} ${i*71%900}-8 35" stroke="#b5ccaf" opacity=".15" stroke-width="2"/>`).join("")}`
);
const art = { quiet, tidal, night, higher, orbit, rain };
for (const [id, svg] of Object.entries(art))
{
    await writeFile(path.join(assets, `${id}.svg`), svg);
}
await writeFile(path.join(assets, "mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#101211"/><path d="M10 25V7h14M10 15h10" stroke="#d3ef82" stroke-width="4" fill="none"/></svg>');
const browser = await chromium.launch({ headless: true });
try
{
    const page = await browser.newPage();
    for (const [id, svg] of Object.entries(art))
    {
        const data = await page.evaluate(async ({ id, svg }) =>
        {
            const canvas = document.createElement("canvas");
            canvas.width = 640;
            canvas.height = 360;
            const ctx = canvas.getContext("2d");
            const image = new Image();
            image.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
            await image.decode();
            const stream = canvas.captureStream(24);
            const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1000000 });
            const chunks = [];
            recorder.ondataavailable = (event) => chunks.push(event.data);
            const done = new Promise((resolve) => recorder.onstop = async () =>
            {
                const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
                let result = "";
                for (let i = 0; i < bytes.length; i += 8192) result += String.fromCharCode(...bytes.slice(i, i + 8192));
                resolve(btoa(result));
            });
            const start = performance.now();
            function draw(now)
            {
                const t = (now - start) / 1000;
                const zoom = 1.015 + Math.sin(t / 9) * .025;
                ctx.drawImage(image, 320 - 320 * zoom, 180 - 180 * zoom, 640 * zoom, 360 * zoom);
                if (id === "tidal")
                {
                    for (let j = 0; j < 5; j++)
                    {
                        ctx.beginPath();
                        for (let x = 0; x < 640; x += 4)
                        {
                            const y = 235 + j * 20 + Math.sin(x / 90 + t * .8 + j) * 5;
                            if (!x) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                        ctx.strokeStyle = "#d4dfca66";
                        ctx.lineWidth = 1.2;
                        ctx.stroke();
                    }
                }
                else if (id === "rain")
                {
                    ctx.strokeStyle = "#d2e8c344";
                    ctx.lineWidth = .7;
                    for (let i = 0; i < 80; i++)
                    {
                        const x = (i * 83 - t * 32 + 1000) % 650;
                        const y = (i * 37 + t * 120) % 380;
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(x - 3, y + 13);
                        ctx.stroke();
                    }
                }
                else
                {
                    for (let i = 0; i < 16; i++)
                    {
                        const x = (i * 47 + t * (id === "night" ? 11 : 2)) % 640;
                        const y = 50 + (i * 71) % 250 + Math.sin(t + i) * 4;
                        ctx.fillStyle = `rgba(242,229,182,${.15 + Math.sin(t * 2 + i) * .12})`;
                        ctx.beginPath();
                        ctx.arc(x, y, id === "orbit" ? 1.3 : .8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                if (t < 8) requestAnimationFrame(draw);
                else recorder.stop();
            }
            recorder.start();
            requestAnimationFrame(draw);
            const result = await done;
            stream.getTracks().forEach((track) => track.stop());
            return result;
        }, { id, svg });
        const bytes = Buffer.from(data, "base64");
        await writeFile(path.join(assets, `${id}.webm`), bytes);
        console.log(`${id}: ${bytes.length} bytes, original 8-second VP8 animation`);
    }
}
finally
{
    await browser.close();
}
const originalLicense = await readFile(path.join(root, job.provenance.license_file), "utf8");
const iconLicense = await readFile(path.join(root, "node_modules", "lucide-react", "LICENSE"), "utf8");
await writeFile(path.join(folder, "LICENSE.txt"), `Original FRAME website, illustrations and animated video clips\nCopyright (c) 2026 MusePages contributors\nReleased under the MIT License reproduced below.\n\nPrompt attribution: Video streaming platform by KingLeoJr.\n${job.provenance.source_url}\n\n${originalLicense}\n\nIcons: Lucide / Feather\n${iconLicense}`);
await StaticHomepage.checkSource(folder);
metadata.generated = true;
await WorkspaceFiles.saveJson(path.join(folder, "metadata.json"), metadata);
const raw = await readFile(job.file, "utf8");
const design = await readFile(path.join(root, "src", "workflows", "AI Agent", "DESIGN.md"), "utf8");
await WorkspaceFiles.saveText(path.join(folder, ".generation-input.sha256"), createHash("sha256").update(JSON.stringify([raw, design])).digest("hex") + "\n");
const exported = path.join(folder, "out");
await mkdir(path.join(exported, "assets"), { recursive: true });
for (const file of ["index.html", "style.css", "app.js", "LICENSE.txt"])
{
    await copyFile(path.join(folder, file), path.join(exported, file));
}
for (const id of Object.keys(art))
{
    for (const ext of ["svg", "webm"]) await copyFile(path.join(assets, `${id}.${ext}`), path.join(exported, "assets", `${id}.${ext}`));
}
await copyFile(path.join(assets, "mark.svg"), path.join(exported, "assets", "mark.svg"));
console.log("Source checked and static export prepared without a build.");
