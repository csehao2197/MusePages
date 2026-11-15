import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";

const browser = await chromium.launch();
try
{
    const page = await browser.newPage();
    const svgs = await Promise.all(["exterior","living","garden"].map(name => readFile(new URL(`../${name}.svg`, import.meta.url),"utf8")));
    const bytes = await page.evaluate(async svgs =>
    {
        const images = await Promise.all(svgs.map(async svg =>
        {
            const image = new Image();
            image.src = "data:image/svg+xml;base64," + btoa(svg);
            await image.decode();
            return image;
        }));
        const canvas = document.createElement("canvas");
        canvas.width = 960;
        canvas.height = 600;
        const context = canvas.getContext("2d");
        const stream = canvas.captureStream(20);
        const recorder = new MediaRecorder(stream,{ mimeType:"video/webm;codecs=vp8" });
        const chunks = [];
        recorder.ondataavailable = event => chunks.push(event.data);
        const stopped = new Promise(resolve => recorder.onstop = resolve);
        recorder.start();
        const start = performance.now();
        await new Promise(resolve =>
        {
            const draw = now =>
            {
                const elapsed = now-start;
                const index = Math.min(2,Math.floor(elapsed/1800));
                const zoom = 1+((elapsed%1800)/1800)*.025;
                context.drawImage(images[index],-(zoom-1)*480,-(zoom-1)*300,960*zoom,600*zoom);
                context.fillStyle = "#0f172acc";
                context.fillRect(0,555,960,45);
                context.fillStyle = "#fffdf1";
                context.font = "14px sans-serif";
                context.fillText(`${["EXTERIOR","LIVING","GARDEN"][index]} / ORIGINAL ILLUSTRATED CONCEPT, NOT PROPERTY FOOTAGE`,25,583);
                if (elapsed < 5400) requestAnimationFrame(draw);
                else resolve();
            };
            requestAnimationFrame(draw);
        });
        recorder.stop();
        await stopped;
        stream.getTracks().forEach(track => track.stop());
        return Array.from(new Uint8Array(await new Blob(chunks).arrayBuffer()));
    },svgs);
    await writeFile(new URL("../walkthrough.webm",import.meta.url),Buffer.from(bytes));
}
finally
{
    await browser.close();
}
