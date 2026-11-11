import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../../", import.meta.url));

export async function generateSample(output = path.join(root, "out")) {
  const page = path.join(output, "pages", "001-destination-guide");
  await mkdir(page, { recursive: true });
  await copyFile(path.join(root, "src", "gallery", "index.html"), path.join(output, "index.html"));
  await copyFile(path.join(root, "src", "gallery", "sample-destination.html"), path.join(page, "index.html"));
  await copyFile(
    path.join(root, "data", "prompts", "001-destination-guide", "001-destination-guide.md"),
    path.join(page, "001-destination-guide.md"),
  );
  const html = await readFile(path.join(page, "index.html"), "utf8");
  const browser = await chromium.launch({ headless: true });
  try {
    const preview = await browser.newPage({
      viewport: { width: 1200, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await preview.route("http://127.0.0.1/**", (route) =>
      route.fulfill({ contentType: "text/html", body: html }));
    await preview.goto("http://127.0.0.1/sample", { waitUntil: "networkidle" });
    await preview.screenshot({ path: path.join(page, "preview.png") });
  } finally {
    await browser.close();
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateSample();
  console.log("Generated out\\index.html and out\\pages\\001-destination-guide\\index.html");
}
