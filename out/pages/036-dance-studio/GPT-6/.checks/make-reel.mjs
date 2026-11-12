import { chromium } from "@playwright/test";
import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { startPreviewServer } from "../../../../../src/workflows/generate-preview.mjs";
const root = path.resolve(import.meta.dirname, "..");
const lockFile = path.resolve(root, "..", "..", "..", ".generation-locks", "036-dance-studio.lock");
const lock = JSON.parse(await readFile(lockFile, "utf8"));
if (lock.session !== "eccb5b0b-bbe8-44e2-97e8-4c615c652be2" || Date.now() - (await stat(lockFile)).mtimeMs >= 1800000) throw Error("Guard mismatch or expiry");
process.kill(lock.pid, 0);
if (Date.now() - (await stat(lockFile)).mtimeMs >= 1800000) throw Error("Guard expired");
const server = await startPreviewServer(root);
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(server.url, { waitUntil: "networkidle" });
  const encoded = await page.evaluate(async () => {
    const files = ["ballet.jpg", "dance-270789.jpg", "dance-175658.jpg"];
    const images = await Promise.all(files.map(async (file) => { const image = new Image(); image.src = `assets/${file}`; await image.decode(); return image; }));
    const canvas = document.createElement("canvas"); canvas.width = 960; canvas.height = 540;
    const ctx = canvas.getContext("2d"), stream = canvas.captureStream(12);
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8", videoBitsPerSecond: 1000000 });
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const done = new Promise((resolve) => { recorder.onstop = resolve; });
    recorder.start();
    for (let frame = 0; frame < 72; frame++) {
      const image = images[Math.floor(frame / 24)], scale = Math.max(960 / image.width, 540 / image.height);
      ctx.fillStyle = "#1e1e2e"; ctx.fillRect(0, 0, 960, 540);
      ctx.drawImage(image, (960 - image.width * scale) / 2, (540 - image.height * scale) / 2, image.width * scale, image.height * scale);
      ctx.fillStyle = "#11101cbb"; ctx.fillRect(0, 425, 960, 115);
      ctx.fillStyle = "#ffffff"; ctx.font = "800 33px Montserrat"; ctx.fillText(["MOVE.", "EXPRESS.", "TRANSFORM."][Math.floor(frame / 24)], 35, 475);
      ctx.font = "14px Inter"; ctx.fillText("RHYTHM & FLOW · SILENT STOCK-PHOTO MOOD REEL · FICTIONAL STUDIO", 35, 512);
      await new Promise((resolve) => setTimeout(resolve, 1000 / 12));
    }
    recorder.stop(); await done; stream.getTracks().forEach((track) => track.stop());
    const bytes = new Uint8Array(await new Blob(chunks, { type: "video/webm" }).arrayBuffer());
    let value = ""; for (let offset = 0; offset < bytes.length; offset += 16384) value += String.fromCharCode(...bytes.subarray(offset, offset + 16384));
    return btoa(value);
  });
  process.kill(lock.pid, 0);
  await writeFile(path.join(root, "assets", "dance-mood.webm"), Buffer.from(encoded, "base64"));
  console.log("Created original 6-second silent licensed-still reel.");
} finally { await browser?.close(); await server.close(); }
