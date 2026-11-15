import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(path.join(folder, "assets"), { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
try
{
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await page.setContent('<html><body style="margin:0"><canvas width="1400" height="1000"></canvas></body></html>');
    await page.addScriptTag({ path: path.join(folder, ".checks", "art.js") });
    for (const [file, variant, time] of [["hero", 0, 0], ["character", 1, 2], ["environment", 2, 1], ["product", 3, 1], ["motion", 4, 3], ["study", 0, 6]])
    {
        await page.evaluate(({ variant, time }) =>
        {
            const canvas = document.querySelector("canvas");
            window.render = window.createArtwork(canvas, variant);
            window.render(time);
        }, { variant, time });
        await page.locator("canvas").screenshot({ path: path.join(folder, "assets", `${file}.png`) });
        console.log(`Rendered original ${file}.png`);
    }
    await page.evaluate(() =>
    {
        const canvas = document.querySelector("canvas");
        canvas.width = 640;
        canvas.height = 456;
        window.render = window.createArtwork(canvas, 0);
    });
    const video = await page.evaluate(async () =>
    {
        const canvas = document.querySelector("canvas");
        const stream = canvas.captureStream(12);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1000000 });
        const chunks = [];
        recorder.ondataavailable = (event) => chunks.push(event.data);
        const stopped = new Promise((resolve) => recorder.onstop = resolve);
        recorder.start();
        const start = performance.now();
        while (performance.now() - start < 6500)
        {
            window.render((performance.now() - start) / 400);
            await new Promise((resolve) => setTimeout(resolve, 70));
        }
        recorder.stop();
        await stopped;
        stream.getTracks().forEach((track) => track.stop());
        const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
        let binary = "";
        bytes.forEach((byte) => binary += String.fromCharCode(byte));
        return btoa(binary);
    });
    await writeFile(path.join(folder, "assets", "showreel.webm"), Buffer.from(video, "base64"));
    console.log("Recorded original local motion reel");
}
finally
{
    await browser.close();
}
