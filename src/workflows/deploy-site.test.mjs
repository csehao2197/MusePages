import test from "node:test";
import assert from "node:assert/strict";
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { setTimeout } from "node:timers/promises";
import { spawnSync } from "node:child_process";
import { publishSite, syncDeployConfig, watchDeployConfig } from "./deploy-site.mjs";

async function fixture(t) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-publish-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await mkdir(path.join(workspace, "src", "gallery"), { recursive: true });
  await copyFile(new URL("../gallery/index.html", import.meta.url), path.join(workspace, "src", "gallery", "index.html"));
  await mkdir(path.join(workspace, "data", "prompts"), { recursive: true });
  return workspace;
}

async function result(workspace, prompt, model, next = false) {
  const input = path.join(workspace, "data", "prompts", prompt);
  const output = path.join(workspace, "out", "pages", prompt, model);
  await mkdir(input, { recursive: true });
  await writeFile(path.join(input, `${prompt}.md`), `# ${prompt}\n<literal prompt> & text`);
  await mkdir(output, { recursive: true });
  if (next) await writeFile(path.join(output, "package.json"), JSON.stringify({ dependencies: { next: "16.4.3" } }));
  const exported = next ? path.join(output, "out") : output;
  await mkdir(exported, { recursive: true });
  await writeFile(path.join(exported, "index.html"), `<h1>${prompt} / ${model}</h1>`);
  await writeFile(path.join(exported, "style.css"), "body{color:green}");
  return { output, exported };
}

async function configFile(workspace) {
  return JSON.parse(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"));
}

async function saveConfig(workspace, config) {
  await writeFile(path.join(workspace, "deploy", "config.json"), JSON.stringify(config, null, 2));
}

test("sync discovers every prompt/model result, defaults to disabled, and preserves edits without duplicates", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  await result(workspace, "002-food", "model-c", true);
  let config = await syncDeployConfig(workspace);
  assert.equal(config.pages.length, 3);
  assert.ok(config.pages.every((page) => page.enabled === false));
  assert.equal(config.pages.find((page) => page.model === "model-c").staticDir, "out");
  config.pages[0].enabled = true;
  config.pages[0].title = "User-edited title";
  config.pages[0].staticDir = "exported";
  await saveConfig(workspace, config);
  await result(workspace, "002-food", "model-d");
  config = await syncDeployConfig(workspace);
  assert.equal(config.pages.length, 4);
  assert.equal(config.pages[0].enabled, true);
  assert.equal(config.pages[0].title, "User-edited title");
  assert.equal(config.pages[0].staticDir, "exported");
  assert.equal((await syncDeployConfig(workspace)).pages.length, 4);
});

test("publishing copies only selected variants and removing the last selected model removes its prompt", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  await result(workspace, "002-food", "model-c");
  const config = await syncDeployConfig(workspace);
  config.pages.forEach((page) => { page.enabled = true; });
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), { pages: 3, prompts: 2 });
  const target = path.join(workspace, "deploy", "MusePages");
  await writeFile(path.join(target, "obsolete.txt"), "old");
  config.pages.find((page) => page.model === "model-a").enabled = false;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  assert.deepEqual(await readdir(path.join(target, "pages", "travel")), ["model-b"]);
  await assert.rejects(lstat(path.join(target, "obsolete.txt")), { code: "ENOENT" });
  config.pages.find((page) => page.model === "model-b").enabled = false;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  assert.deepEqual(await readdir(path.join(target, "pages")), ["food"]);
  const html = await readFile(path.join(target, "index.html"), "utf8");
  assert.doesNotMatch(html, /pages\/travel/);
  assert.match(html, /pages\/food\/model-c\/index\.html/);
  assert.match(html, /1 prompts \/ 1 pages/);
});

test("no selected models produces a valid empty collection and keeps config and Git metadata", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await syncDeployConfig(workspace);
  const target = path.join(workspace, "deploy", "MusePages");
  await mkdir(path.join(target, ".git"), { recursive: true });
  await writeFile(path.join(target, ".git", "sentinel"), "keep repository metadata");
  await writeFile(path.join(target, ".gitignore"), "local-only");
  await writeFile(path.join(target, "index.html"), "previous website");
  assert.deepEqual(await publishSite(workspace), { pages: 0, prompts: 0 });
  assert.deepEqual(await readdir(path.join(target, "pages")), []);
  assert.match(await readFile(path.join(target, "index.html"), "utf8"), /No published pages yet/);
  assert.equal(await readFile(path.join(target, ".git", "sentinel"), "utf8"), "keep repository metadata");
  assert.equal(await readFile(path.join(target, ".gitignore"), "utf8"), "local-only");
  assert.equal((await configFile(workspace)).pages.length, 1);
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["MusePages", "config.json"]);
});

test("Next.js publishes exported static files and app-router browser chunks, never the source project", async (t) => {
  const workspace = await fixture(t);
  const { output, exported } = await result(workspace, "001-travel", "model-a", true);
  await mkdir(path.join(output, "app"));
  await writeFile(path.join(output, "app", "page.tsx"), "server source");
  await mkdir(path.join(exported, "_next", "static", "chunks", "app"), { recursive: true });
  await writeFile(path.join(exported, "_next", "static", "chunks", "app", "page.js"), "browser chunk");
  await writeFile(path.join(exported, "index.html"), '<h1>Next export</h1><script src="_next/static/chunks/app/page.js"></script>');
  await writeFile(path.join(exported, ".env"), "private");
  await writeFile(path.join(exported, "package.json"), "{}");
  await writeFile(path.join(exported, "original.md"), "raw prompt");
  await writeFile(path.join(exported, "LICENSE.md"), "Keep license notice");
  const config = await syncDeployConfig(workspace);
  config.pages[0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const target = path.join(workspace, "deploy", "MusePages", "pages", "travel", "model-a");
  assert.equal(await readFile(path.join(target, "_next", "static", "chunks", "app", "page.js"), "utf8"), "browser chunk");
  assert.equal(await readFile(path.join(target, "LICENSE.md"), "utf8"), "Keep license notice");
  for (const name of [".env", "package.json", "original.md", "app", "node_modules", ".next"]) {
    await assert.rejects(lstat(path.join(target, name)), { code: "ENOENT" });
  }
  const prompt = await readFile(path.join(target, "prompt.html"), "utf8");
  assert.match(prompt, /&lt;literal prompt&gt; &amp; text/);
  assert.match(prompt, /href="\.\.\/\.\.\/\.\.\/index\.html"/);
  assert.equal(await readFile(path.join(output, "app", "page.tsx"), "utf8"), "server source");
});

test("invalid or unexported selections leave the old website untouched and release the lock", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a", true);
  const config = await syncDeployConfig(workspace);
  config.pages[0].enabled = true;
  await saveConfig(workspace, config);
  const target = path.join(workspace, "deploy", "MusePages");
  await mkdir(target);
  await writeFile(path.join(target, "index.html"), "old website");
  await rm(path.join(exported, "index.html"));
  await assert.rejects(publishSite(workspace), /Static index\.html is missing/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "old website");
  config.pages[0].staticDir = ".";
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /Next\.js source cannot be deployed/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "old website");
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["MusePages", "config.json"]);
});

test("publish synchronizes a newly discovered result but does not publish it without an explicit selection", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await syncDeployConfig(workspace);
  await result(workspace, "001-travel", "model-b");
  assert.deepEqual(await publishSite(workspace), { pages: 0, prompts: 0 });
  assert.equal((await configFile(workspace)).pages.length, 2);
});

test("broken subpath exports fail before replacing the old website", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a", true);
  const config = await syncDeployConfig(workspace);
  config.pages[0].enabled = true;
  await saveConfig(workspace, config);
  const target = path.join(workspace, "deploy", "MusePages");
  await mkdir(target);
  await writeFile(path.join(target, "index.html"), "keep the old website");
  await writeFile(path.join(exported, "index.html"), '<script src="/_next/static/missing.js"></script>');
  await assert.rejects(publishSite(workspace), /Missing static link/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "keep the old website");
});

test("gallery keeps literal replacement characters and escapes user-edited titles and tags", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const config = await syncDeployConfig(workspace);
  config.pages[0].enabled = true;
  config.pages[0].title = "Title $& <script>";
  config.pages[0].tags = ["$& <tag>"];
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const html = await readFile(path.join(workspace, "deploy", "MusePages", "index.html"), "utf8");
  assert.match(html, /Title \$&amp; &lt;script&gt;/);
  assert.match(html, /\$&amp; &lt;tag&gt;/);
  assert.doesNotMatch(html, /<!-- RESULT_CARDS -->/);
});

test("malformed config, traversal paths, duplicates and public path collisions fail explicitly", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "002-travel", "model-a");
  const base = await syncDeployConfig(workspace);
  for (const [field, value] of [["prompt", "../escape"], ["model", ".."], ["slug", "001-numbered"], ["staticDir", "../outside"], ["enabled", "true"]]) {
    const config = structuredClone(base);
    config.pages[0][field] = value;
    await saveConfig(workspace, config);
    await assert.rejects(publishSite(workspace));
  }
  await saveConfig(workspace, { ...base, pages: [base.pages[0], base.pages[0]] });
  await assert.rejects(publishSite(workspace), /Duplicate deployment option/);
  base.pages.forEach((page) => { page.enabled = true; });
  await saveConfig(workspace, base);
  await assert.rejects(publishSite(workspace), /Conflicting public path/);
  await writeFile(path.join(workspace, "deploy", "config.json"), "{bad json");
  await assert.rejects(publishSite(workspace), SyntaxError);
});

test("symbolic result assets cannot read outside the result or alter the existing website", async (t) => {
  const workspace = await fixture(t);
  const { output } = await result(workspace, "001-travel", "model-a");
  const outside = path.join(workspace, "private");
  await mkdir(outside);
  await writeFile(path.join(outside, "private.txt"), "not public");
  await symlink(outside, path.join(output, "linked"), process.platform === "win32" ? "junction" : "dir");
  const config = await syncDeployConfig(workspace);
  config.pages[0].enabled = true;
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /cannot be symbolic links/);
  assert.equal(await readFile(path.join(outside, "private.txt"), "utf8"), "not public");
});

test("different prompts cannot share a public slug even when their models differ", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "002-travel", "model-b");
  const config = await syncDeployConfig(workspace);
  config.pages.forEach((page) => { page.enabled = true; });
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /Conflicting public path/);
  config.pages[1].slug = "travel-adventures";
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), { pages: 2, prompts: 2 });
});

test("watching adds an externally generated result to config without publishing it", async (t) => {
  const workspace = await fixture(t);
  const input = path.join(workspace, "data", "prompts", "001-travel");
  await mkdir(input);
  await writeFile(path.join(input, "001-travel.md"), "prompt");
  const watcher = await watchDeployConfig(workspace);
  try {
    await result(workspace, "001-travel", "model-a");
    const deadline = Date.now() + 5000;
    let config;
    do {
      await setTimeout(100);
      config = await configFile(workspace);
    } while (config.pages.length === 0 && Date.now() < deadline);
    assert.equal(config.pages.length, 1);
    assert.equal(config.pages[0].enabled, false);
    await assert.rejects(lstat(path.join(workspace, "deploy", "MusePages")), { code: "ENOENT" });
  } finally {
    await watcher.close();
  }
});

test("concurrent sync operations preserve one option and leave no lock behind", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const configs = await Promise.all([syncDeployConfig(workspace), syncDeployConfig(workspace)]);
  assert.ok(configs.every((config) => config.pages.length === 1));
  assert.equal((await configFile(workspace)).pages.length, 1);
  await assert.rejects(lstat(path.join(workspace, "deploy", ".publish.lock")), { code: "ENOENT" });
});

test("the JavaScript CLI synchronizes options and rebuilds the exact configured website", async (t) => {
  const workspace = await fixture(t);
  const workflows = path.join(workspace, "src", "workflows");
  await mkdir(workflows);
  for (const file of ["deploy-site.mjs", "render-prompt-page.mjs"]) {
    await copyFile(new URL(`./${file}`, import.meta.url), path.join(workflows, file));
  }
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  const cli = (command) => {
    const execution = spawnSync(process.execPath, [path.join(workflows, "deploy-site.mjs"), command], {
      cwd: workspace, encoding: "utf8", timeout: 15000,
    });
    assert.equal(execution.status, 0, execution.stderr);
    return execution.stdout;
  };
  assert.match(cli("sync"), /options synchronized: 2/);
  const config = await configFile(workspace);
  config.pages[0].enabled = true;
  await saveConfig(workspace, config);
  assert.match(cli("publish"), /Published 1 pages from 1 prompts/);
  const target = path.join(workspace, "deploy", "MusePages", "pages", "travel");
  assert.deepEqual(await readdir(target), ["model-a"]);
  config.pages[0].enabled = false;
  await saveConfig(workspace, config);
  assert.match(cli("publish"), /Published 0 pages from 0 prompts/);
  await assert.rejects(lstat(target), { code: "ENOENT" });
  assert.equal((await configFile(workspace)).pages.length, 2);
});
