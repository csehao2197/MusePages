import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../package.json", import.meta.url));
const { chromium } = require("@playwright/test");
const root = fileURLToPath(new URL("./out/", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const file = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(root) || !types[path.extname(file)]) { res.writeHead(404).end(); return; }
    res.setHeader("Content-Type", types[path.extname(file)]);
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
let browser;
try {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  browser = await chromium.launch({ headless: true });
  const source = await browser.newPage();
  await source.goto(`http://127.0.0.1:${server.address().port}/index.html`, { timeout: 15000 });
  const documents = await source.evaluate(async () => {
    const { fixtures } = await import("./assets/engine.js");
    const { previewDocument } = await import("./assets/preview.js");
    return fixtures().filter((record) => ["html", "svg", "css", "markdown"].includes(record.type)).map((record) => ({ id: record.id, document: previewDocument(record) }));
  });
  const page = await browser.newPage({ viewport: { width: 600, height: 360 }, deviceScaleFactor: 1 });
  for (const { id, document } of documents) {
    console.log(`Rendering ${id}.`);
    await page.setContent('<style>html,body{margin:0}iframe{display:block;width:600px;height:360px;border:0}</style><iframe id="preview" sandbox=""></iframe>');
    await page.locator("#preview").evaluate((frame, srcdoc) => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Preview load timed out")), 10000);
      frame.addEventListener("load", () => { clearTimeout(timeout); resolve(); }, { once: true });
      frame.srcdoc = srcdoc;
    }), document);
    await page.frameLocator("#preview").locator("body").waitFor();
    await page.locator("#preview").screenshot({ path: fileURLToPath(new URL(`assets/${id}.png`, import.meta.url)) });
    console.log(`Captured actual 600x360 ${id} thumbnail.`);
  }
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
