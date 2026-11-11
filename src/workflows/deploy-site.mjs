import { watch } from "node:fs";
import { randomUUID } from "node:crypto";
import { copyFile, lstat, mkdir, mkdtemp, open, readFile, readdir, rename, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import { escapeHtml, renderPromptPage } from "./render-prompt-page.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const gitFiles = new Set([".git", ".gitignore", ".gitattributes"]);
const excludedDirectories = new Set(["node_modules", ".next", ".git"]);
const staticExtensions = new Set([
  ".html", ".css", ".js", ".mjs", ".json", ".png", ".jpg", ".jpeg", ".gif",
  ".svg", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf",
  ".eot", ".txt", ".xml", ".webmanifest", ".mp4", ".webm", ".mp3", ".wav", ".pdf",
]);

async function exists(file) {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function checkName(name, label) {
  if (typeof name !== "string" || !/^[a-z0-9][a-z0-9._-]*$/i.test(name)
    || name.endsWith(".") || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)) {
    throw Error(`Invalid ${label}: ${JSON.stringify(name)}`);
  }
}

async function directory(folder) {
  const info = await lstat(folder);
  if (info.isSymbolicLink() || !info.isDirectory()) throw Error(`Expected a real directory: ${folder}`);
}

async function directories(folder) {
  if (!await exists(folder)) return [];
  await directory(folder);
  const entries = await readdir(folder, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) throw Error(`Symbolic links are not allowed: ${path.join(folder, entry.name)}`);
  }
  return entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name).sort();
}

async function inputPrompts(workspace) {
  const inputs = new Map();
  const base = path.join(workspace, "data", "prompts");
  await directory(path.join(workspace, "data"));
  for (const folder of await directories(base)) {
    for (const name of await readdir(path.join(base, folder))) {
      if (!name.endsWith(".md") || /^(README|AGENTS|DESIGN)\.md$/i.test(name)) continue;
      const prompt = name.slice(0, -3);
      checkName(prompt, "prompt filename");
      const key = prompt.toLowerCase();
      if (inputs.has(key)) throw Error(`Duplicate prompt filename: ${prompt}`);
      const file = path.join(base, folder, name);
      if ((await lstat(file)).isSymbolicLink()) throw Error(`Prompt cannot be a symbolic link: ${file}`);
      inputs.set(key, file);
    }
  }
  return inputs;
}

function pageOptions(config) {
  return Object.entries(config.pages).flatMap(([prompt, models]) =>
    models.map((page) => ({ ...page, prompt })));
}

function validateConfig(config) {
  if (config?.version !== 2 || !config.pages || typeof config.pages !== "object" || Array.isArray(config.pages)) {
    throw Error("Expected config version 2 and a pages object keyed by prompt filename");
  }
  const prompts = new Set();
  for (const [prompt, models] of Object.entries(config.pages)) {
    checkName(prompt, "prompt filename");
    if (prompts.has(prompt.toLowerCase())) throw Error(`Duplicate prompt key: ${prompt}`);
    prompts.add(prompt.toLowerCase());
    if (!Array.isArray(models)) throw Error(`Expected a model options array for ${prompt}`);
    for (const page of models) {
      if (!page || typeof page !== "object" || Array.isArray(page) || Object.hasOwn(page, "prompt")) {
        throw Error(`Invalid model option for ${prompt}; prompt belongs in the pages key`);
      }
    }
  }
  const keys = new Set();
  for (const page of pageOptions(config)) {
    checkName(page.prompt, "prompt");
    checkName(page.model, "model");
    checkName(page.slug, "public prompt slug");
    if (/^\d+-/.test(page.slug)) throw Error(`Public slug must not contain the prompt number: ${page.slug}`);
    if (typeof page.enabled !== "boolean" || typeof page.title !== "string" || !page.title.trim()
      || typeof page.staticDir !== "string" || !page.staticDir
      || !Array.isArray(page.tags) || page.tags.some((tag) => typeof tag !== "string")) {
      throw Error(`Invalid deployment settings for ${page.prompt}/${page.model}`);
    }
    if (path.isAbsolute(page.staticDir) || page.staticDir.split(/[\\/]/).some((part) => part === ".." || !part)) {
      throw Error(`staticDir must stay inside its model directory: ${page.staticDir}`);
    }
    const key = `${page.prompt}/${page.model}`.toLowerCase();
    if (keys.has(key)) throw Error(`Duplicate deployment option: ${key}`);
    keys.add(key);
  }
}

async function readConfig(file) {
  const config = await exists(file) ? JSON.parse(await readFile(file, "utf8")) : { version: 2, pages: {} };
  if (config?.version === 1 && Array.isArray(config.pages)) {
    const pages = new Map();
    for (const page of config.pages) {
      if (!page || typeof page !== "object") throw Error("Invalid legacy deployment option");
      checkName(page.prompt, "prompt filename");
      const { prompt, ...option } = page;
      if (!pages.has(prompt)) pages.set(prompt, []);
      pages.get(prompt).push(option);
    }
    config.version = 2;
    config.pages = Object.fromEntries(pages);
  }
  validateConfig(config);
  return config;
}

async function writeConfig(workspace, config) {
  const file = path.join(workspace, "deploy", "config.json");
  const contents = JSON.stringify(config, null, 2) + "\n";
  if (await exists(file) && await readFile(file, "utf8") === contents) return;
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, contents, { encoding: "utf8", flag: "wx" });
    await rename(temporary, file);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function isNextProject(folder) {
  const file = path.join(folder, "package.json");
  if (!await exists(file)) return false;
  if ((await lstat(file)).isSymbolicLink()) throw Error(`Project manifest cannot be a symbolic link: ${file}`);
  const pkg = JSON.parse(await readFile(file, "utf8"));
  return Boolean(pkg.dependencies?.next || pkg.devDependencies?.next);
}

async function synchronize(workspace) {
  const file = path.join(workspace, "deploy", "config.json");
  const config = await readConfig(file);
  const inputs = await inputPrompts(workspace);
  const known = new Set(pageOptions(config).map((page) => `${page.prompt}/${page.model}`.toLowerCase()));
  const output = path.join(workspace, "out");
  if (await exists(output)) await directory(output);
  for (const prompt of await directories(path.join(output, "pages"))) {
    checkName(prompt, "output prompt");
    if (!inputs.has(prompt.toLowerCase())) throw Error(`No original prompt found for output: ${prompt}`);
    for (const model of await directories(path.join(output, "pages", prompt))) {
      checkName(model, "output model");
      const key = `${prompt}/${model}`.toLowerCase();
      if (known.has(key)) continue;
      const source = path.join(output, "pages", prompt, model);
      const next = await isNextProject(source);
      if (!next && !await exists(path.join(source, "index.html"))) continue;
      const slug = prompt.replace(/^\d+-/, "");
      const promptKey = Object.keys(config.pages).find((key) => key.toLowerCase() === prompt.toLowerCase()) ?? prompt;
      if (!Object.hasOwn(config.pages, promptKey)) {
        Object.defineProperty(config.pages, promptKey, { value: [], enumerable: true, writable: true, configurable: true });
      }
      config.pages[promptKey].push({
        model, enabled: false, slug, title: slug.replaceAll("-", " "),
        tags: [], staticDir: next ? "out" : ".",
      });
      known.add(key);
    }
  }
  validateConfig(config);
  await writeConfig(workspace, config);
  return { config, inputs };
}

async function withLock(workspace, action) {
  const deploy = path.join(workspace, "deploy");
  if (await exists(deploy)) await directory(deploy);
  else await mkdir(deploy, { recursive: true });
  const lock = path.join(deploy, ".publish.lock");
  let handle;
  const deadline = Date.now() + 5000;
  while (!handle) {
    try {
      handle = await open(lock, "wx");
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (Date.now() >= deadline) throw Error(`Deployment is locked: ${lock}. Check for an active process before removing a stale lock.`);
      await delay(50);
    }
  }
  try {
    await handle.writeFile(`${process.pid}\n`);
    return await action();
  } finally {
    await handle.close();
    await unlink(lock);
  }
}

export async function syncDeployConfig(workspace = root) {
  return withLock(workspace, async () => (await synchronize(workspace)).config);
}

export async function registerGeneratedPage(workspace, page) {
  return withLock(workspace, async () => {
    const file = path.join(workspace, "deploy", "config.json");
    if (await exists(file) && (await lstat(file)).isSymbolicLink()) {
      throw Error("Deployment config cannot be a symbolic link");
    }
    const config = await readConfig(file);
    const { prompt, ...option } = { ...page, enabled: false };
    validateConfig({ version: 2, pages: { [prompt]: [option] } });
    const options = pageOptions(config);
    if (options.some((entry) => entry.prompt.toLowerCase() !== page.prompt.toLowerCase()
      && entry.slug.toLowerCase() === page.slug.toLowerCase())) {
      throw Error(`Conflicting public slug: ${page.slug}`);
    }
    if (options.some((entry) => entry.prompt.toLowerCase() === page.prompt.toLowerCase() && entry.slug !== page.slug)) {
      throw Error(`Prompt has a different public slug: ${page.prompt}`);
    }
    const existing = options.find((entry) =>
      entry.prompt.toLowerCase() === page.prompt.toLowerCase() && entry.model.toLowerCase() === page.model.toLowerCase());
    if (existing) {
      if (existing.prompt !== page.prompt || existing.model !== page.model
        || existing.slug !== page.slug || existing.staticDir !== page.staticDir) {
        throw Error(`Deployment mapping conflicts with metadata: ${page.prompt}/${page.model}`);
      }
      await writeConfig(workspace, config);
      return false;
    }
    const promptKey = Object.keys(config.pages).find((key) => key.toLowerCase() === prompt.toLowerCase());
    if (promptKey && promptKey !== prompt) throw Error(`Deployment prompt casing conflicts with metadata: ${prompt}`);
    if (!Object.hasOwn(config.pages, prompt)) {
      Object.defineProperty(config.pages, prompt, { value: [], enumerable: true, writable: true, configurable: true });
    }
    config.pages[prompt].push(option);
    validateConfig(config);
    await writeConfig(workspace, config);
    const saved = JSON.parse(await readFile(file, "utf8"));
    validateConfig(saved);
    if (!pageOptions(saved).some((entry) => entry.prompt === page.prompt && entry.model === page.model)) {
      throw Error("Deployment registration was not saved");
    }
    return true;
  });
}

async function staticDirectory(source, relative) {
  await directory(source);
  let current = source;
  for (const part of relative.split(/[\\/]/)) {
    if (part === ".") continue;
    checkName(part, "staticDir component");
    current = path.join(current, part);
    await directory(current);
  }
  if (current === source && await isNextProject(source)) {
    throw Error(`Next.js source cannot be deployed directly; set staticDir to its static export: ${source}`);
  }
  return current;
}

async function copyStatic(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const input = path.join(source, entry.name);
    if (entry.isSymbolicLink()) throw Error(`Static assets cannot be symbolic links: ${input}`);
    const name = entry.name.toLowerCase();
    if (entry.isDirectory()) {
      if (name.startsWith(".") || excludedDirectories.has(name)) continue;
      await copyStatic(input, path.join(destination, entry.name));
    } else if (entry.isFile() && !name.startsWith(".") && name !== "package.json"
      && name !== "package-lock.json" && name !== "result.json" && name !== "metadata.json"
      && !/^(?:next|postcss|tailwind|playwright)\.config\./.test(name)
      && (staticExtensions.has(path.extname(name)) || /^(?:licen[cs]e|notice)(?:\.md)?$/.test(name))) {
      await copyFile(input, path.join(destination, entry.name));
    }
  }
}

function gallery(template, pages) {
  const cards = pages.map((page) => {
    const href = `pages/${encodeURIComponent(page.slug)}/${encodeURIComponent(page.model)}`;
    const title = escapeHtml(page.title);
    const preview = page.preview
      ? `<img src="${href}/preview.png" alt="Preview of ${title}" width="1200" height="900" loading="lazy">`
      : '<span class="preview-label">No preview provided</span>';
    return `<article class="card">
      <a class="preview" href="${href}/index.html" aria-label="Open ${title}">${preview}</a>
      <div class="details"><h3><a href="${href}/index.html">${title}</a></h3>
        <div class="tags">${page.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<span class="tag model">Model: ${escapeHtml(page.model)}</span></div>
        <div class="actions"><a class="open" href="${href}/index.html">View page &rarr;</a><a class="prompt" href="${href}/prompt.html">Read prompt &nearr;</a></div>
      </div>
    </article>`;
  }).join("\n");
  for (const marker of ["<!-- RESULT_COUNT -->", "<!-- RESULT_CARDS -->"]) {
    if (template.split(marker).length !== 2) throw Error(`Gallery template must contain exactly one ${marker}`);
  }
  return template.replace("<!-- RESULT_COUNT -->", () => `${new Set(pages.map((page) => page.prompt)).size} prompts / ${pages.length} pages`)
    .replace("<!-- RESULT_CARDS -->", () => cards || '<p class="sample-note">No published pages yet.</p>');
}

async function validateLinks(staging, folder = staging) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) {
      await validateLinks(staging, file);
    } else if (entry.name.endsWith(".html")) {
      const html = await readFile(file, "utf8");
      if (!html.trim()) throw Error(`Static page is empty: ${file}`);
      const base = new URL(path.relative(staging, file).split(path.sep).map(encodeURIComponent).join("/"), "https://musepages.invalid/");
      for (const match of html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi)) {
        const reference = match[2].replaceAll("&amp;", "&");
        if (!reference || reference.startsWith("#")) continue;
        const url = new URL(reference, base);
        if (url.origin !== base.origin) continue;
        const target = path.resolve(staging, decodeURIComponent(url.pathname).replace(/^\/+/, ""));
        const relative = path.relative(staging, target);
        if (relative.startsWith("..") || path.isAbsolute(relative)) throw Error(`Static link escapes the website: ${reference}`);
        const candidates = [target, `${target}.html`, path.join(target, "index.html")];
        let found = false;
        for (const candidate of candidates) {
          if (await exists(candidate) && (await lstat(candidate)).isFile()) {
            found = true;
            break;
          }
        }
        if (!found) throw Error(`Missing static link in ${path.relative(staging, file)}: ${reference}. Check export base paths and copied assets.`);
      }
    }
  }
}

async function replaceWebsite(target, staging) {
  if (await exists(target)) await directory(target);
  else await mkdir(target);
  const backup = await mkdtemp(path.join(path.dirname(target), ".site-backup-"));
  const old = [];
  const installed = [];
  let cleanBackup = false;
  try {
    for (const name of await readdir(target)) {
      if (gitFiles.has(name)) continue;
      await rename(path.join(target, name), path.join(backup, name));
      old.push(name);
    }
    for (const name of await readdir(staging)) {
      await rename(path.join(staging, name), path.join(target, name));
      installed.push(name);
    }
    cleanBackup = true;
  } catch (error) {
    try {
      for (const name of installed) await rename(path.join(target, name), path.join(staging, name));
      for (const name of old) await rename(path.join(backup, name), path.join(target, name));
      cleanBackup = true;
    } catch (restoreError) {
      throw new AggregateError([error, restoreError], `Publish and rollback failed. Recovery files remain in ${backup} and ${staging}`);
    }
    throw error;
  } finally {
    if (cleanBackup) await rm(backup, { recursive: true });
  }
}

export async function publishSite(workspace = root) {
  return withLock(workspace, async () => {
    const { config, inputs } = await synchronize(workspace);
    const selected = pageOptions(config).filter((page) => page.enabled);
    const destinations = new Set();
    const slugOwners = new Map();
    const promptSlugs = new Map();
    const staging = await mkdtemp(path.join(workspace, "deploy", ".site-build-"));
    let keepRecovery = false;
    try {
      await mkdir(path.join(staging, "pages"));
      for (const page of selected) {
        const promptKey = page.prompt.toLowerCase();
        const slugKey = page.slug.toLowerCase();
        if ((slugOwners.has(slugKey) && slugOwners.get(slugKey) !== promptKey)
          || (promptSlugs.has(promptKey) && promptSlugs.get(promptKey) !== slugKey)) {
          throw Error(`Conflicting public path: prompt/slug mapping for ${page.prompt}`);
        }
        slugOwners.set(slugKey, promptKey);
        promptSlugs.set(promptKey, slugKey);
        const key = `${page.slug}/${page.model}`.toLowerCase();
        if (destinations.has(key)) throw Error(`Conflicting public path: ${key}`);
        destinations.add(key);
        const promptFile = inputs.get(page.prompt.toLowerCase());
        if (!promptFile) throw Error(`Original prompt is missing: ${page.prompt}`);
        const source = path.join(workspace, "out", "pages", page.prompt, page.model);
        await directory(path.dirname(source));
        const exported = await staticDirectory(source, page.staticDir);
        const destination = path.join(staging, "pages", page.slug, page.model);
        await copyStatic(exported, destination);
        const index = path.join(destination, "index.html");
        if (!await exists(index) || !(await lstat(index)).isFile()) {
          throw Error(`Static index.html is missing for ${page.prompt}/${page.model}; export it before publishing`);
        }
        await writeFile(path.join(destination, "prompt.html"),
          renderPromptPage(await readFile(promptFile, "utf8"), page.title, "../../../index.html"), "utf8");
        page.preview = await exists(path.join(destination, "preview.png"));
      }
      const template = await readFile(path.join(workspace, "src", "gallery", "index.html"), "utf8");
      await writeFile(path.join(staging, "index.html"), gallery(template, selected), "utf8");
      await validateLinks(staging);
      try {
        await replaceWebsite(path.join(workspace, "deploy", "MusePages"), staging);
      } catch (error) {
        if (error instanceof AggregateError) keepRecovery = true;
        throw error;
      }
      return { pages: selected.length, prompts: new Set(selected.map((page) => page.prompt)).size };
    } finally {
      if (!keepRecovery) await rm(staging, { recursive: true });
    }
  });
}

export async function watchDeployConfig(workspace = root) {
  const output = path.join(workspace, "out", "pages");
  await mkdir(output, { recursive: true });
  await directory(path.join(workspace, "out"));
  await directory(output);
  let timer;
  let pending = Promise.resolve();
  const watcher = watch(output, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      pending = pending.then(() => syncDeployConfig(workspace))
        .then((config) => console.log(`Deployment options synchronized: ${pageOptions(config).length}`))
        .catch((error) => console.error("Deployment option sync failed:", error));
    }, 150);
  });
  watcher.on("error", (error) => console.error("Output watcher failed:", error));
  try {
    await syncDeployConfig(workspace);
  } catch (error) {
    watcher.close();
    throw error;
  }
  return {
    async close() {
      clearTimeout(timer);
      watcher.close();
      await pending;
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const command = process.argv[2] ?? "publish";
    if (command === "sync") {
      const config = await syncDeployConfig();
      console.log(`Deployment options synchronized: ${pageOptions(config).length}`);
    } else if (command === "watch") {
      const watcher = await watchDeployConfig();
      console.log("Watching out\\pages for new deployment options. Press Ctrl+C to stop.");
      for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => { void watcher.close(); });
    } else if (command === "publish") {
      const result = await publishSite();
      console.log(`Published ${result.pages} pages from ${result.prompts} prompts to deploy\\MusePages`);
    } else {
      throw Error(`Unknown command: ${command}. Use publish, sync, or watch.`);
    }
  } catch (error) {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
  }
}
