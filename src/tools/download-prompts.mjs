import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const agent = "MusePages-prompt-collector (+https://github.com/csehao2197/MusePages)";
const digest = (data) => createHash("sha256").update(data).digest("hex").toUpperCase();
export const normalize = (text) => text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
const portable = (value) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function promptBaseSlug(source, manifest, text = "") {
  const url = new URL(source.source_url);
  if (["websiteprompts.com", "websiteprompts.ai"].includes(url.hostname)) {
    const detail = url.hostname === "websiteprompts.com" ? /^\/prompts\/[^/]+\/[^/]+\/?$/ : /^\/prompts\/[^/]+\/?$/;
    const topic = detail.test(url.pathname) ? url.pathname.split("/").filter(Boolean).at(-1) : source.title;
    return portable((topic ?? "").replace(/-website-prompt$/, ""));
  }
  if (url.hostname === "github.com") {
    const parts = url.pathname.slice(1).split("/");
    const repository = parts.slice(0, 2).join("/").toLowerCase();
    const original = manifest.find((entry) => entry.id <= 100
      && new URL(entry.source_url).hostname === "github.com"
      && new URL(entry.source_url).pathname.slice(1).split("/").slice(0, 2).join("/").toLowerCase() === repository);
    const project = original
      ? path.win32.basename(original.filename, ".md").replace(/^\d+-/, "")
      : portable(parts[1]);
    const upstream = source.upstream_path ?? parts.slice(4).map(decodeURIComponent).join("/");
    let document = path.posix.basename(upstream).replace(/\.[^.]+$/, "");
    if (/^\d{10,}-/.test(document)) document = text.match(/^#\s+(.+)$/m)?.[1] ?? document.replace(/^\d+-/, "");
    document = portable(document.replace(/^\d{4}-\d{2}-\d{2}-/, ""))
      .replace(/^example-prd$/, "example-requirements")
      .replace(/^prd$/, "requirements")
      .replace(/^spec$/, "specification")
      .replace(/^spec-(.+)$/, "$1-specification")
      .replace(/^dev-plan$/, "development-plan");
    return `${project}-${document}`;
  }
  return portable(source.slug || source.title);
}

export function uniquePromptSlug(source, manifest, text) {
  const base = promptBaseSlug(source, manifest, text);
  assert.ok(base, `Prompt topic is missing: ${source.source_url}`);
  const used = new Set(manifest.map((entry) => path.win32.basename(entry.filename, ".md").replace(/^\d+-/, "").toLowerCase()));
  if (!used.has(base)) return base;
  const brand = text.match(/\bcalled\s+["\u201c]([^"\u201d]+)["\u201d]/i)?.[1]
    ?? text.match(/\bfor\s+\*\*([^*]+)\*\*/i)?.[1]
    ?? text.match(/^#\s+(.+?)(?:\s+[\u2014\u2013]\s+|:\s+)/m)?.[1];
  const qualifier = brand ? portable(brand) : "";
  const variant = `${base}-${qualifier}`;
  assert.ok(qualifier && !used.has(variant), `Prompt name collision needs a semantic qualifier: ${base}`);
  return variant;
}

export function extractPrompts(html, decode) {
  const found = [];
  for (const match of html.matchAll(/<(?:button|a|div)\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
    const attrs = Object.fromEntries([...match[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
      .map((attr) => [attr[1].toLowerCase(), decode(attr[2] ?? attr[3])]));
    if (attrs["data-prompt"]?.trim()) {
      found.push({ title: attrs["data-prompt-title"], text: normalize(attrs["data-prompt"]) });
    }
  }
  if (!found.length && /data-route-type=["']prompt["']|detail-prompt__body/i.test(html)) {
    for (const match of html.matchAll(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi)) {
      found.push({ text: normalize(decode(match[1].replace(/<[^>]*>/g, ""))) });
    }
  }
  return found.filter((item, index) => found.findIndex((other) => other.text === item.text) === index);
}

export function extractFramerPrompts(html, decode) {
  const found = [];
  for (const tag of html.matchAll(/<a\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
    const attr = tag[0].match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (!attr) continue;
    const href = decode(attr[1] ?? attr[2]);
    const position = href.indexOf("#prompt=");
    if (position === -1) continue;
    const text = normalize(decodeURIComponent(href.slice(position + 8)));
    if (text && !found.some((item) => item.text === text)) found.push({ text });
  }
  return found;
}

export function framerPromptUrls(xml, index) {
  const locations = [...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) => match[1]);
  return [...new Set([...locations, ...Object.keys(index)].map((value) => {
    const url = new URL(value, "https://websiteprompts.ai");
    if (url.origin !== "https://websiteprompts.ai" || !/^\/prompts\/[^/]+\/?$/.test(url.pathname)) return null;
    return url.origin + url.pathname.replace(/\/$/, "");
  }).filter(Boolean))].sort();
}

export function isRequirement(file, originalFiles = []) {
  if (originalFiles.includes(file)) return true;
  if (!/\.(?:md|mdx|markdown|txt|prompt)$/i.test(file)) return false;
  if (/(?:^|\/)(?:node_modules|vendor|skills|\.specstory)(?:\/|$)/i.test(file)) return false;
  const name = path.posix.basename(file);
  if (/^(?:requirements(?:[-_.][\w-]+)?\.txt|readme\.[^.]+)$/i.test(name)) return false;
  return /(?:^|\/)(?:prompts?|requirements?|specs?|prds?|briefs?|plans?)(?:\/|$)/i.test(file)
    || /(?:^|[-_.\s])(?:prd|srs|specs?|requirements?|prompts?|briefs?|plans?|roadmap|todo|design)(?:[-_.\s]|$)/i.test(name);
}

export function websiteUrls(xml) {
  return [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) => match[1]))]
    .filter((url) => {
      const parsed = new URL(url);
      return parsed.origin === "https://websiteprompts.com" && !/^\/(?:de|es)(?:\/|$)/.test(parsed.pathname);
    });
}

export function pendingWebsitePages(pages, completed) {
  const downloaded = new Set(completed.filter((page) => page.status === "downloaded").map((page) => page.url));
  return pages.filter((url) => !downloaded.has(url));
}

async function atomicJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(value, null, 2) + "\n");
  await rename(temp, file);
}

async function keepFile(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  try {
    await writeFile(file, data, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    assert.ok((await readFile(file)).equals(data), `Existing file differs: ${file}`);
  }
}

async function main() {
  const aiWebsite = process.argv.includes("--source=websiteprompts.ai");
  const manifestFile = path.join(root, "src", "manifest.json");
  const reportFile = path.join(root, "src", "downloads", aiWebsite ? "websiteprompts-ai.json" : "manifest.json");
  const manifestData = await readFile(manifestFile);
  let manifestHash = digest(manifestData);
  const original = JSON.parse(manifestData.toString("utf8"));
  const manifest = structuredClone(original);
  const originalHashes = new Map();
  const contentIndex = new Map();
  const slugs = new Set();
  for (const entry of original) {
    const file = path.join(root, "data", "prompts", entry.filename);
    const data = await readFile(file);
    originalHashes.set(file, digest(data));
    contentIndex.set(digest(normalize(data.toString("utf8"))), entry);
    slugs.add(path.win32.basename(path.win32.dirname(entry.filename)).replace(/^\d+-/, "").toLowerCase());
  }
  const resume = process.argv.includes("--resume");
  const report = resume ? JSON.parse(await readFile(reportFile, "utf8")) : {
    started_at_utc: new Date().toISOString(),
    scope: aiWebsite ? "All public full website prompts on websiteprompts.ai, discovered through its sitemap and public search index."
      : "All public English copy-ready website prompts, plus requirement/prompt files in manifest-linked GitHub repositories at their current default-branch revision.",
    selection: "GitHub PRD/SRS/spec/requirements/prompt/brief/design/plan/roadmap/todo documents, prompt/spec/plan directories, and explicitly listed originals. Dependency lists, reusable agent skills, translated website duplicates and interactive generator combinations are excluded.",
    rights: "Original authors retain their rights. Source URLs and available repository licenses are recorded; public access alone does not grant republication or commercial rights.",
    website: { pages: [], prompts: [] },
    github: [],
    failures: [],
    original_prompt_count: original.length,
    original_manifest_sha256: digest(await readFile(manifestFile)),
    original_inputs: [...originalHashes].map(([file, sha256]) => ({ filename: path.relative(root, file), sha256 })),
    added: [],
  };
  delete report.validation;
  let entities;
  const decode = (value) => {
    entities ??= JSON.parse(execFileSync("python", ["-c", "import json,html.entities; print(json.dumps(html.entities.html5))"], { encoding: "utf8" }));
    return value.replace(/&(#x[0-9a-f]+;?|#\d+;?|[a-z][a-z0-9]+;)/gi, (whole, entity) => {
      if (!entity.startsWith("#")) return entities[entity] ?? whole;
      const point = Number.parseInt(entity.replace(/;$/, "").slice(/^#x/i.test(entity) ? 2 : 1), /^#x/i.test(entity) ? 16 : 10);
      return point > 0 && point <= 0x10ffff && !(point >= 0xd800 && point <= 0xdfff) ? String.fromCodePoint(point) : "\uFFFD";
    });
  };
  const lastRequest = new Map();
  async function get(url, attempt = 0) {
    const host = new URL(url).hostname;
    const allowed = aiWebsite ? ["websiteprompts.ai", "framerusercontent.com"]
      : ["websiteprompts.com", "api.github.com", "raw.githubusercontent.com"];
    assert.ok(allowed.includes(host));
    await delay(Math.max(0, 1100 - (Date.now() - (lastRequest.get(host) ?? 0))));
    lastRequest.set(host, Date.now());
    const response = await fetch(url, { headers: { "User-Agent": agent }, signal: AbortSignal.timeout(60000) });
    assert.ok(allowed.includes(new URL(response.url).hostname));
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${url}`);
      error.status = response.status;
      if (attempt < 2 && [429, 500, 502, 503, 504].includes(response.status)) {
        await response.body?.cancel();
        await delay(Math.min(60000, Math.max(2000, Number(response.headers.get("retry-after") || 2) * 1000)));
        return get(url, attempt + 1);
      }
      await response.body?.cancel();
      throw error;
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > 10 * 1024 * 1024) throw Error(`Response exceeds 10 MiB: ${url}`);
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  let pending = Promise.resolve();
  function savePrompt(source, data) {
    const saved = pending.then(async () => {
      const text = new TextDecoder("utf-8", { fatal: true }).decode(data);
      assert.ok(normalize(text), `Empty prompt: ${source.source_url}`);
      const hash = digest(data);
      const archive = path.join("data", "downloads", source.host, `${hash.toLowerCase()}.md`);
      await keepFile(path.join(root, archive), data);
      let entry = contentIndex.get(digest(normalize(text)));
      const reused = Boolean(entry);
      if (!entry) {
        const id = Math.max(...manifest.map((item) => item.id)) + 1;
        const slug = uniquePromptSlug(source, manifest, text);
        assert.ok(!slugs.has(slug), `Prompt slug collision: ${slug}`);
        const name = `${String(id).padStart(3, "0")}-${slug}`;
        const filename = path.join(name, `${name}.md`);
        await keepFile(path.join(root, "data", "prompts", filename), data);
        entry = {
          id, title: source.title, filename,
          source_url: source.source_url, fetch_url: source.fetch_url,
          source_kind: source.source_kind,
          downloaded_at_utc: new Date().toISOString(),
          status: "downloaded", sha256: hash, bytes: data.length,
          ...(source.revision ? { source_revision: source.revision } : {}),
        };
        manifest.push(entry);
        contentIndex.set(digest(normalize(text)), entry);
        slugs.add(slug);
        report.added.push({ id, filename, source_url: source.source_url });
        assert.equal(digest(await readFile(manifestFile)), manifestHash, "Source manifest changed in another process");
        await atomicJson(manifestFile, manifest);
        manifestHash = digest(JSON.stringify(manifest, null, 2) + "\n");
      }
      return {
        ...source, archive, sha256: hash, bytes: data.length,
        prompt_filename: entry.filename, reused_existing_content: reused,
        downloaded_at_utc: new Date().toISOString(),
      };
    });
    pending = saved.catch(() => {});
    return saved;
  }
  async function website() {
    if (resume && report.website.pages.length === report.website.discovered_pages
      && report.website.pages.every((page) => page.status === "downloaded")) return;
    const robots = (await get("https://websiteprompts.com/robots.txt")).toString("utf8");
    assert.match(robots, /Allow:\s*\/(?:\s|$)/);
    const sitemap = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
    assert.ok(sitemap, "robots.txt must provide a sitemap");
    const queue = [sitemap];
    const visited = new Set();
    const urls = new Set();
    while (queue.length) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);
      const xml = (await get(url)).toString("utf8");
      if (/<sitemapindex\b/.test(xml)) queue.push(...websiteUrls(xml));
      else for (const item of websiteUrls(xml)) urls.add(item);
    }
    const pages = [...urls].sort((a, b) =>
      Number(/^\/prompts\/[^/]+\/[^/]+\/?$/.test(new URL(b).pathname))
      - Number(/^\/prompts\/[^/]+\/[^/]+\/?$/.test(new URL(a).pathname)) || a.localeCompare(b));
    report.website.sitemaps = [...visited];
    report.website.discovered_pages = pages.length;
    report.website.library_pages = pages.filter((url) => /^\/prompts\/[^/]+\/[^/]+\/?$/.test(new URL(url).pathname)).length;
    const remaining = pendingWebsitePages(pages, report.website.pages);
    for (const [index, url] of remaining.entries()) {
      report.website.pages = report.website.pages.filter((page) => page.url !== url);
      report.website.prompts = report.website.prompts.filter((prompt) => prompt.fetch_url !== url);
      report.failures = report.failures.filter((failure) => failure.source !== url);
      try {
        const html = (await get(url)).toString("utf8");
        const items = extractPrompts(html, decode);
        const pageTitle = decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, "") ?? new URL(url).pathname).trim();
        if (/^\/prompts\/[^/]+\/[^/]+\/?$/.test(new URL(url).pathname)) assert.ok(items.length, `No full prompt extracted: ${url}`);
        for (const [position, item] of items.entries()) {
          const entry = await savePrompt({
            host: "websiteprompts.com",
            title: item.title || (items.length > 1 ? `${pageTitle} - prompt ${position + 1}` : pageTitle),
            slug: `websiteprompts-${new URL(url).pathname}-${position + 1}`,
            source_url: items.length > 1 ? `${url}#prompt-${position + 1}` : url,
            fetch_url: url, source_kind: "framework-neutral website prompt",
          }, Buffer.from(item.text + "\n"));
          report.website.prompts.push(entry);
        }
        report.website.pages.push({ url, status: "downloaded", prompts: items.length });
      } catch (error) {
        report.website.pages.push({ url, status: "failed", error: error.message });
        report.failures.push({ source: url, error: error.message });
      }
      if ((index + 1) % 20 === 0 || index === remaining.length - 1) {
        await atomicJson(reportFile, report);
        console.log(`Website: ${report.website.pages.length}/${pages.length} pages scanned, ${report.website.prompts.length} prompt copies.`);
      }
    }
  }
  async function websiteAi() {
    const origin = "https://websiteprompts.ai";
    const robots = (await get(`${origin}/robots.txt`)).toString("utf8");
    assert.match(robots, /Allow:\s*\/(?:\s|$)/);
    const sitemapUrl = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
    assert.ok(sitemapUrl, "robots.txt must provide a sitemap");
    const xml = (await get(sitemapUrl)).toString("utf8");
    const home = (await get(origin + "/")).toString("utf8");
    const searchUrl = home.match(/<meta\b[^>]*name="framer-search-index"[^>]*content="([^"]+)"/i)?.[1];
    assert.ok(searchUrl, "Public search index must be linked from the homepage");
    const index = JSON.parse((await get(decode(searchUrl))).toString("utf8"));
    const pages = framerPromptUrls(xml, index);
    assert.ok(pages.length, "Prompt catalog is empty");
    report.website.sitemaps = [sitemapUrl];
    report.website.search_index = searchUrl;
    report.website.sitemap_prompt_pages = framerPromptUrls(xml, {});
    report.website.search_index_prompt_pages = framerPromptUrls("", index);
    report.website.discovered_pages = pages.length;
    report.website.library_pages = pages.length;
    report.rights = {
      source_url: origin + "/",
      statement: "Every prompt on websiteprompts.ai is completely free. Copy and use them as many times as you like, for personal or commercial projects.",
      attribution: "websiteprompts.ai, built by Adam Sebesta. Original authors retain their rights.",
    };
    const remaining = pendingWebsitePages(pages, report.website.pages);
    for (const [index, url] of remaining.entries()) {
      report.website.pages = report.website.pages.filter((page) => page.url !== url);
      report.website.prompts = report.website.prompts.filter((prompt) => prompt.fetch_url !== url);
      report.failures = report.failures.filter((failure) => failure.source !== url);
      try {
        const html = (await get(url)).toString("utf8");
        const items = extractFramerPrompts(html, decode);
        assert.ok(items.length, `No full prompt extracted: ${url}`);
        const title = decode(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]*>/g, "") ?? new URL(url).pathname).trim();
        for (const [position, item] of items.entries()) {
          report.website.prompts.push(await savePrompt({
            host: "websiteprompts.ai",
            title: items.length > 1 ? `${title} - prompt ${position + 1}` : title,
            slug: `websiteprompts-ai-${new URL(url).pathname.split("/").filter(Boolean).at(-1)}${items.length > 1 ? `-${position + 1}` : ""}`,
            source_url: items.length > 1 ? `${url}#prompt-${position + 1}` : url,
            fetch_url: url, source_kind: "native Markdown website prompt",
          }, Buffer.from(item.text + "\n")));
        }
        report.website.pages.push({ url, status: "downloaded", prompts: items.length });
      } catch (error) {
        report.website.pages.push({ url, status: "failed", error: error.message });
        report.failures.push({ source: url, error: error.message });
      }
      if ((index + 1) % 20 === 0 || index === remaining.length - 1) {
        await atomicJson(reportFile, report);
        console.log(`Websiteprompts.ai: ${report.website.pages.length}/${pages.length} pages scanned.`);
      }
    }
  }
  async function github() {
    const repos = new Map();
    for (const entry of original.slice(0, report.original_prompt_count)) {
      const url = new URL(entry.source_url);
      if (url.hostname !== "github.com") continue;
      const [owner, name, kind, ref, ...parts] = url.pathname.slice(1).split("/");
      assert.equal(kind, "blob");
      const repo = `${owner}/${name}`;
      if (!repos.has(repo)) repos.set(repo, []);
      repos.get(repo).push({ ref, file: parts.map(decodeURIComponent).join("/"), entry });
    }
    let repositoryIndex = 0;
    for (const [repo, inputs] of repos) {
      repositoryIndex++;
      const record = report.github.find((item) => item.repository === repo) ?? { repository: repo, prompts: [], licenses: [] };
      if (!report.github.includes(record)) report.github.push(record);
      report.failures = report.failures.filter((failure) => !failure.source.startsWith(`https://github.com/${repo}`)
        && !failure.source.startsWith(`https://raw.githubusercontent.com/${repo}/`));
      try {
        const remote = record.revision ? null : spawnSync("git", ["-c", "credential.helper=", "ls-remote", `https://github.com/${repo}.git`, "HEAD"], {
          encoding: "utf8", timeout: 30000,
          env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "Never" },
        });
        const revision = record.revision || (remote.status === 0 ? remote.stdout.match(/^([0-9a-f]{40,64})\s+HEAD/m)?.[1] : undefined);
        const originals = inputs.map((input) => input.file);
        const cachedFiles = record.files?.filter((file) => isRequirement(file, originals));
        const missing = cachedFiles?.some((file) => !record.prompts.some((item) => item.upstream_path === file)
          && !record.empty_documents?.some((item) => item.upstream_path === file));
        const missingLicense = record.files?.some((file) => !file.includes("/")
          && /^(?:licen[cs]e|copying|notice)(?:\.[\w-]+)?$/i.test(file)
          && !record.licenses.some((license) => path.basename(license.file) === file));
        const tree = cachedFiles && !missing && !missingLicense
          ? { truncated: false, sha: record.tree_sha, tree: record.file_inventory ?? record.files.map((file) => ({ path: file, type: "blob" })) }
          : JSON.parse((await get(`https://api.github.com/repos/${repo}/git/trees/${revision || "HEAD"}?recursive=1`)).toString("utf8"));
        assert.equal(tree.truncated, false, "GitHub tree is truncated; complete inventory is required");
        record.revision = revision || "HEAD";
        record.tree_sha = tree.sha;
        record.files = tree.tree.filter((item) => item.type === "blob").map((item) => item.path);
        if (tree.tree.every((item) => item.type !== "blob" || item.sha)) {
          record.file_inventory = tree.tree.filter((item) => item.type === "blob");
        }
        const selected = tree.tree.filter((item) =>
          item.type === "blob" && item.mode !== "120000" && isRequirement(item.path, inputs.map((input) => input.file)));
        record.selected_files = selected.map((item) => item.path);
        const licenses = tree.tree.filter((item) => item.type === "blob" && !item.path.includes("/") && /^(?:licen[cs]e|copying|notice)(?:\.[\w-]+)?$/i.test(item.path));
        record.license_status = licenses.length ? "license files archived; review their scope before reuse" : "no root license found; reuse permission unverified";
        for (const item of [...selected, ...licenses]) {
          if (record.prompts.some((prompt) => prompt.upstream_path === item.path)
            || record.empty_documents?.some((prompt) => prompt.upstream_path === item.path)
            || record.licenses.some((license) => path.basename(license.file) === item.path)) continue;
          const fetchUrl = `https://raw.githubusercontent.com/${repo}/${revision || "HEAD"}/${item.path.split("/").map(encodeURIComponent).join("/")}`;
          try {
            const data = item.size === 0 ? Buffer.alloc(0) : await get(fetchUrl);
            assert.equal(createHash("sha1").update(`blob ${data.length}\0`).update(data).digest("hex"), item.sha, "Downloaded Git blob differs from discovered revision");
            if (!licenses.includes(item) && !normalize(data.toString("utf8"))) {
              const archive = path.join("data", "downloads", "github.com", `${digest(data).toLowerCase()}.md`);
              await keepFile(path.join(root, archive), data);
              (record.empty_documents ??= []).push({ upstream_path: item.path, source_url: fetchUrl, bytes: data.length, sha256: digest(data), archive, reason: "Upstream document has no prompt content." });
              continue;
            }
            if (licenses.includes(item)) {
              const file = path.join("data", "downloads", "github.com", repo.replace("/", "-"), item.path);
              await keepFile(path.join(root, file), data);
              record.licenses.push({ file, sha256: digest(data), source_url: fetchUrl });
            } else {
              record.prompts.push(await savePrompt({
                host: "github.com", title: `${repo}: ${item.path}`,
                slug: `github-${repo}-${item.path.replace(/\.[^.]+$/, "")}`,
                source_url: `https://github.com/${repo}/blob/${revision || "HEAD"}/${item.path.split("/").map(encodeURIComponent).join("/")}`,
                fetch_url: fetchUrl, source_kind: "native Markdown requirements or prompt",
                revision: revision || "HEAD", repository: repo, upstream_path: item.path,
                git_blob_sha: item.sha,
              }, data));
            }
          } catch (error) {
            report.failures.push({ source: fetchUrl, error: error.message });
          }
        }
        for (const input of inputs.filter((input) => !record.files.includes(input.file))) {
          if (record.prompts.some((prompt) => prompt.upstream_path === input.file && prompt.revision === input.ref)) continue;
          const fetchUrl = input.entry.fetch_url;
          try {
            record.prompts.push(await savePrompt({
              host: "github.com", title: input.entry.title, slug: `github-${repo}-${input.file}`,
              source_url: input.entry.source_url, fetch_url: fetchUrl,
              source_kind: "native Markdown requirements or prompt",
              revision: input.ref, repository: repo, upstream_path: input.file,
              historical_original: true,
            }, await get(fetchUrl)));
          } catch (error) {
            report.failures.push({ source: fetchUrl, error: error.message });
          }
        }
        record.status = selected.every((item) => record.prompts.some((prompt) => prompt.upstream_path === item.path)
          || record.empty_documents?.some((prompt) => prompt.upstream_path === item.path))
          && !report.failures.some((failure) => failure.source.startsWith(`https://raw.githubusercontent.com/${repo}/`))
          ? "downloaded" : "partial";
      } catch (error) {
        record.status = "unavailable";
        record.error = error.message;
        record.preserved_originals = inputs.map((input) => input.entry.filename);
        report.failures.push({ source: `https://github.com/${repo}`, error: error.message });
      }
      await atomicJson(reportFile, report);
      console.log(`GitHub: ${repositoryIndex}/${repos.size} ${repo}: ${record.status}, ${record.prompts.length} documents.`);
    }
  }
  if (aiWebsite) await websiteAi();
  else await Promise.all([website(), github()]);
  await pending;
  assert.deepEqual(manifest.slice(0, original.length), original);
  for (const [file, hash] of originalHashes) assert.equal(digest(await readFile(file)), hash, `Original input changed: ${file}`);
  for (const entry of report.original_inputs) {
    assert.equal(digest(await readFile(path.join(root, entry.filename))), entry.sha256, `Original input changed: ${entry.filename}`);
  }
  const records = [...report.website.prompts, ...report.github.flatMap((repo) => repo.prompts)];
  for (const entry of records) {
    assert.equal(digest(await readFile(path.join(root, entry.archive))), entry.sha256);
    if (entry.active === false) continue;
    const prompt = await readFile(path.join(root, "data", "prompts", entry.prompt_filename), "utf8");
    assert.equal(digest(normalize(prompt)), digest(normalize((await readFile(path.join(root, entry.archive))).toString("utf8"))));
  }
  report.completed_at_utc = new Date().toISOString();
  report.summary = {
    website_pages_scanned: report.website.pages.length,
    website_prompt_copies: report.website.prompts.length,
    unique_website_prompts: new Set(report.website.prompts.map((entry) => entry.sha256)).size,
    github_repositories: report.github.length,
    github_repositories_downloaded: report.github.filter((repo) => repo.status === "downloaded").length,
    github_documents: report.github.reduce((count, repo) => count + repo.prompts.length, 0),
    new_prompt_files: report.added.length,
    total_prompt_files: manifest.length,
    removed_prompt_files: report.removed_prompts?.length ?? 0,
    original_inputs_preserved: true,
    failures: report.failures.length,
  };
  report.selection = aiWebsite
    ? "Full Markdown from each public detail page's encoded prompt link; sitemap and public search-index catalogs are reconciled. Outbound AI-builder links are decoded locally and never opened."
    : "GitHub PRD/SRS/spec/requirements/prompt/brief/design/plan/roadmap/todo documents, prompt/spec/plan directories, and explicitly listed originals. Dependency lists, reusable agent skills, translated website duplicates and interactive generator combinations are excluded.";
  report.status = report.failures.length ? "partial" : "complete";
  await atomicJson(reportFile, report);
  console.log(JSON.stringify({ status: report.status, ...report.summary }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const lockFile = path.join(root, "src", "downloads", ".download.lock");
  await mkdir(path.dirname(lockFile), { recursive: true });
  let lock;
  try {
    lock = await open(lockFile, "wx");
    await lock.writeFile(JSON.stringify({ pid: process.pid, started_at_utc: new Date().toISOString() }));
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    if (lock) {
      await lock.close();
      await unlink(lockFile);
    }
  }
}
