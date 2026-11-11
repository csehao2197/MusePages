import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { syncDeployConfig } from "./deploy-site.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));

export async function generateSample(workspace = root) {
  const page = path.join(workspace, "out", "pages", "001-destination-guide", "unspecified");
  await mkdir(page, { recursive: true });
  await copyFile(path.join(workspace, "src", "gallery", "sample-destination.html"), path.join(page, "index.html"));
  await syncDeployConfig(workspace);
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
  await syncDeployConfig(workspace);
  return page;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateSample();
  console.log("Generated out\\pages\\001-destination-guide\\unspecified and synchronized deploy\\config.json; no website was published.");
}
