import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const folder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
await mkdir(path.join(folder, "assets"), { recursive: true });
const browser = await chromium.launch({ headless: true });
try
{
    const page = await browser.newPage();
    await page.setContent('<canvas width="800" height="450"></canvas>');
    const base64 = await page.evaluate(async () =>
    {
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const stream = canvas.captureStream(12);
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1500000 });
        const chunks = [];
        recorder.ondataavailable = (event) => chunks.push(event.data);
        const done = new Promise((resolve) => recorder.onstop = resolve);
        const rounded = (x, y, width, height, radius, color) =>
        {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.fill();
        };
        recorder.start();
        const start = performance.now();
        while (performance.now() - start < 9000)
        {
            const seconds = (performance.now() - start) / 1000;
            const scene = Math.min(2, Math.floor(seconds / 3));
            ctx.fillStyle = "#f4f3fc";
            ctx.fillRect(0, 0, 800, 450);
            ctx.fillStyle = "#6d63d8";
            ctx.font = "bold 20px Arial";
            ctx.fillText("taskflow.", 42, 44);
            ctx.fillStyle = "#8b86a4";
            ctx.font = "11px Arial";
            ctx.fillText("YOUR FIRST NINE SECONDS OF FLOW", 420, 42);
            rounded(100, 85, 600, 285, 14, "#ffffff");
            ctx.fillStyle = "#353347";
            ctx.font = "26px Arial";
            ctx.fillText(["1. Give your idea a home.", "2. Find your next small step.", "3. Make a little progress."][scene], 133, 134);
            ctx.fillStyle = "#9290a3";
            ctx.font = "13px Arial";
            ctx.fillText(["Create a project. A simple name is a great start.", "Add a task. Keep it clear, specific and useful.", "Check off what is done. Good things build over time."][scene], 133, 162);
            const tasks = scene === 0 ? ["Studio North / Website refresh"] : ["Write the project brief", "Gather the team’s ideas", "Share a first draft"];
            tasks.forEach((text, index) =>
            {
                rounded(133, 188 + index * 45, 535, 35, 6, index === 0 && scene === 2 ? "#f0f4e9" : "#f8f8fc");
                ctx.fillStyle = "#888198";
                ctx.font = "13px Arial";
                ctx.fillText(scene === 2 && index === 0 ? "✓" : "○", 147, 211 + index * 45);
                ctx.fillStyle = "#555264";
                ctx.fillText(text, 174, 211 + index * 45);
            });
            ctx.fillStyle = "#a19caf";
            ctx.font = "12px Arial";
            ctx.fillText("Less busywork. More meaningful work.", 285, 410);
            rounded(100, 435, 600 * seconds / 9, 3, 1, "#8d82dc");
            await new Promise((resolve) => setTimeout(resolve, 75));
        }
        recorder.stop();
        await done;
        stream.getTracks().forEach((track) => track.stop());
        const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
        let binary = "";
        bytes.forEach((byte) => binary += String.fromCharCode(byte));
        return btoa(binary);
    });
    await writeFile(path.join(folder, "assets", "getting-started.webm"), Buffer.from(base64, "base64"));
    console.log("Recorded original 9-second getting-started walkthrough");
}
finally
{
    await browser.close();
}
