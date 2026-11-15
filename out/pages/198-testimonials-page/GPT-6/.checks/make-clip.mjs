import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const browser = await chromium.launch();
try
{
    const page = await browser.newPage();
    const bytes = await page.evaluate(async () =>
    {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
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
                context.fillStyle = "#163e35";
                context.fillRect(0,0,640,360);
                context.fillStyle = "#b9d1b3";
                context.beginPath();
                context.arc(520,110,60 + Math.sin((now-start)/650)*12,0,Math.PI*2);
                context.fill();
                context.fillStyle = "#f4f4e7";
                context.font = "42px Georgia";
                context.fillText("Good stories start",40,145);
                context.fillText("with good people.",40,195);
                context.font = "15px sans-serif";
                context.fillText("ORIGINAL MOTION DEMO / NOT A CLIENT INTERVIEW",40,280);
                if (now-start < 3200) requestAnimationFrame(draw);
                else resolve();
            };
            requestAnimationFrame(draw);
        });
        recorder.stop();
        await stopped;
        stream.getTracks().forEach(track => track.stop());
        return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
    });
    await writeFile(fileURLToPath(new URL("../studio-demo.webm", import.meta.url)), Buffer.from(bytes));
}
finally
{
    await browser.close();
}
