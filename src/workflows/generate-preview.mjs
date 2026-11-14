import { createReadStream } from "node:fs";
import { lstat, open, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { pipeline } from "node:stream/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("../../", import.meta.url));
const viewport = { width: 1200, height: 900 };
const types = new Map(Object.entries({
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".avif": "image/avif", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".otf": "font/otf", ".mp4": "video/mp4", ".webm": "video/webm",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".wasm": "application/wasm",
  ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
  ".pdf": "application/pdf",
}));
const privateNames = new Set(["node_modules", "package.json", "package-lock.json", "metadata.json", "result.json"]);

function publicPart(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9._-]*$/i.test(value)
    && !value.endsWith(".") && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(value);
}

async function realEntry(file, directory) {
  const info = await lstat(file);
  if (info.isSymbolicLink() || (directory ? !info.isDirectory() : !info.isFile())) {
    throw Error(`Expected a real ${directory ? "directory" : "file"}: ${file}`);
  }
  return info;
}

async function previewInput(input, workspace) {
  if (typeof input !== "string" || !input) throw Error("A static output directory is required");
  const directory = path.resolve(workspace, input);
  const base = path.join(workspace, "out", "pages");
  const relative = path.relative(base, directory);
  const parts = relative.split(path.sep);
  if (path.isAbsolute(relative) || parts.length < 2 || parts.some((part) => !publicPart(part))) {
    throw Error("Input must stay inside out\\pages\\<prompt>\\<model>\\");
  }
  let current = workspace;
  await realEntry(current, true);
  for (const part of ["out", "pages", ...parts]) {
    if (privateNames.has(part.toLowerCase())) throw Error(`Not a static directory: ${part}`);
    current = path.join(current, part);
    await realEntry(current, true);
  }
  await realEntry(path.join(directory, "index.html"), false);
  const sharedFile = path.join(base, parts[0], "metadata.json");
  let slug = parts[0].replace(/^\d+-/, "");
  try {
    await realEntry(sharedFile, false);
    slug = JSON.parse(await readFile(sharedFile, "utf8")).slug;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (!publicPart(slug) || /^\d+-/.test(slug)) throw Error("Invalid public prompt slug");
  return { directory, mount: `/pages/${encodeURIComponent(slug)}/${encodeURIComponent(parts[1])}/` };
}

export async function startPreviewServer(input, { workspace = root } = {}) {
  const { directory, mount } = await previewInput(input, path.resolve(workspace));
  const server = createServer(async (request, response) => {
    try {
      if (!["GET", "HEAD"].includes(request.method)) {
        response.writeHead(405).end();
        return;
      }
      const pathname = new URL(request.url, "http://localhost").pathname;
      if (pathname === "/favicon.ico") {
        response.writeHead(204).end();
        return;
      }
      if (!pathname.startsWith(mount)) {
        response.writeHead(404).end();
        return;
      }
      const relative = decodeURIComponent(pathname.slice(mount.length));
      const parts = (relative.endsWith("/") || !relative ? `${relative}index.html` : relative).split("/");
      if (parts.some((part) => !part || part.startsWith(".") || /[\\:\0]/.test(part)
        || privateNames.has(part.toLowerCase()) || /^(next|postcss|tailwind|playwright)\.config\./i.test(part))) {
        response.writeHead(404).end();
        return;
      }
      const type = types.get(path.extname(parts.at(-1)).toLowerCase());
      if (!type) {
        response.writeHead(404).end();
        return;
      }
      let file = directory;
      let info;
      for (let index = 0; index < parts.length; index++) {
        file = path.join(file, parts[index]);
        info = await realEntry(file, index < parts.length - 1);
      }
      response.writeHead(200, {
        "Content-Type": type, "Content-Length": info.size,
        "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff",
      });
      if (request.method === "HEAD") response.end();
      else await pipeline(createReadStream(file), response);
    } catch {
      if (!response.headersSent) response.writeHead(404).end();
      else response.destroy();
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  return {
    directory,
    url: `http://127.0.0.1:${server.address().port}${mount}index.html`,
    async close() {
      const closed = new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      server.closeAllConnections();
      await closed;
    },
  };
}

export async function generatePreview(input, { workspace = root, timeoutMs = 60000, signal } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 300000) {
    throw Error("timeoutMs must be an integer from 1 to 300000");
  }
  signal?.throwIfAborted();
  const { directory } = await previewInput(input, path.resolve(workspace));
  const destination = path.join(directory, "preview.png");
  try {
    await realEntry(destination, false);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const lockFile = path.join(directory, ".preview.lock");
  const lock = await open(lockFile, "wx").catch((error) => {
    if (error.code === "EEXIST") throw Error(`Preview is locked: ${lockFile}; check for an active capture before removing it`);
    throw error;
  });
  const temporary = path.join(directory, `.preview-${randomUUID()}.png`);
  const controller = new AbortController();
  let browser;
  let service;
  const stop = () => {
    controller.abort(signal.reason ?? Error("Preview cancelled"));
    void browser?.close().catch(() => {});
  };
  const timer = setTimeout(() => {
    controller.abort(Error(`Preview timed out after ${timeoutMs} ms`));
    void browser?.close().catch(() => {});
  }, timeoutMs);
  signal?.addEventListener("abort", stop, { once: true });
  if (signal?.aborted) stop();
  try {
    let image;
    try {
      service = await startPreviewServer(input, { workspace });
      controller.signal.throwIfAborted();
      browser = await chromium.launch({ headless: true, timeout: Math.min(timeoutMs, 30000) });
      controller.signal.throwIfAborted();
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
      page.setDefaultTimeout(timeoutMs);
      const failures = new Set();
      page.on("pageerror", (error) => failures.add(error.message));
      page.on("requestfailed", (request) => failures.add(`Failed resource: ${request.url()}`));
      page.on("response", (response) => {
        if (response.status() >= 400) failures.add(`HTTP ${response.status()}: ${response.url()}`);
      });
      const response = await page.goto(service.url, { waitUntil: "networkidle", timeout: timeoutMs });
      const loaded = new URL(page.url());
      const expected = new URL(service.url);
      if (!response?.ok() || loaded.origin !== expected.origin || loaded.pathname !== expected.pathname) {
        throw Error("Static homepage did not load at its expected URL");
      }
      await page.evaluate(async () => {
        await document.fonts.ready;
        if ([...document.fonts].some((font) => font.status === "error")) throw Error("A page font failed to load");
        const visible = (element) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return box.width > 0 && box.height > 0 && box.bottom > 0 && box.right > 0
            && box.top < innerHeight && box.left < innerWidth
            && style.visibility !== "hidden" && style.display !== "none" && style.opacity !== "0";
        };
        await Promise.all([...document.images].filter(visible).map((image) => image.decode()));
        const elements = [...document.querySelectorAll("body, body *")].filter(visible);
        if (!elements.some((element) => element.innerText?.trim()
          || element.matches("img, svg, canvas, video")
          || getComputedStyle(element).backgroundImage !== "none")) throw Error("Static homepage appears blank");
      });
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      image = await page.screenshot({ type: "png", fullPage: false, animations: "disabled", timeout: timeoutMs });
      if (failures.size) throw Error(`Preview validation failed:\n${[...failures].join("\n")}`);
      if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
        || image.readUInt32BE(16) !== viewport.width || image.readUInt32BE(20) !== viewport.height) {
        throw Error("Invalid preview image or dimensions");
      }
    } finally {
      try { await browser?.close(); } finally { await service?.close(); }
    }
    controller.signal.throwIfAborted();
    await writeFile(temporary, image, { flag: "wx" });
    controller.signal.throwIfAborted();
    await rename(temporary, destination);
    return { file: destination, ...viewport };
  } catch (error) {
    if (controller.signal.aborted) throw controller.signal.reason;
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", stop);
    try { await rm(temporary, { force: true }); } finally {
      await lock.close();
      await rm(lockFile);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const controller = new AbortController();
  const stop = () => controller.abort(Error("Preview cancelled"));
  for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, stop);
  try {
    const args = process.argv.slice(2);
    if (args.length === 1 && args[0] === "--help") {
      console.log("Usage: node src\\workflows\\generate-preview.mjs <static-directory> [--timeout-ms=60000]");
    } else {
      const [input, timeout] = args;
      if (!input || input.startsWith("--") || args.length > 2 || (timeout && !/^--timeout-ms=\d+$/.test(timeout))) {
        throw Error("Expected <static-directory> [--timeout-ms=60000]; use --help for usage");
      }
      const result = await generatePreview(input, {
        timeoutMs: timeout ? Number(timeout.split("=")[1]) : 60000, signal: controller.signal,
      });
      console.log(`Preview saved: ${result.file} (${result.width} x ${result.height})`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = controller.signal.aborted ? 130 : 1;
  } finally {
    for (const signal of ["SIGINT", "SIGTERM"]) process.removeListener(signal, stop);
  }
}
