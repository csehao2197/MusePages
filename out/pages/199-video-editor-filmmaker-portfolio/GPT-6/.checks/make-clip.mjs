import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const browser = await chromium.launch();
try
{
    const page = await browser.newPage();
    const svg = await readFile(new URL("../landscape.svg", import.meta.url), "utf8");
    const bytes = await page.evaluate(async svg =>
    {
        const image = new Image();
        image.src = "data:image/svg+xml;base64," + btoa(svg);
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 540;
        const context = canvas.getContext("2d");
        const stream = canvas.captureStream(20);
        const recorder = new MediaRecorder(stream, { mimeType:"video/webm;codecs=vp8" });
        const chunks = [];
        recorder.ondataavailable = event => chunks.push(event.data);
        const stopped = new Promise(resolve => recorder.onstop = resolve);
        recorder.start();
        const start = performance.now();
        await new Promise(resolve =>
        {
            const draw = now =>
            {
                context.drawImage(image,0,0,960,540);
                context.fillStyle = "#d0b988";
                context.beginPath();
                context.arc(680 + Math.sin((now-start)/1200)*9,168,92,0,Math.PI*2);
                context.fill();
                context.fillStyle = "#f4f4e7";
                context.font = "12px sans-serif";
                context.fillText("ORIGINAL MOTION STUDY / NO CLIENT FOOTAGE",35,510);
                if (now-start < 4000) requestAnimationFrame(draw);
                else resolve();
            };
            requestAnimationFrame(draw);
        });
        recorder.stop();
        await stopped;
        stream.getTracks().forEach(track => track.stop());
        return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
    }, svg);
    await writeFile(fileURLToPath(new URL("../quiet-study.webm", import.meta.url)), Buffer.from(bytes));
}
finally
{
    await browser.close();
}
