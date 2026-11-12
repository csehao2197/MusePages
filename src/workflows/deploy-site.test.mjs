import test from "node:test";
import assert from "node:assert/strict";
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, symlink, unlink, utimes, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { setTimeout } from "node:timers/promises";
import { spawnSync } from "node:child_process";
import { publishSite, registerGeneratedPage, syncDeployConfig, watchDeployConfig } from "./deploy-site.mjs";

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

function options(config) {
  return Object.values(config.pages).flat();
}

test("sync discovers every prompt/model result, defaults to disabled, and preserves edits without duplicates", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  await result(workspace, "002-food", "model-c", true);
  let config = await syncDeployConfig(workspace);
  assert.equal(config.version, 2);
  assert.deepEqual(Object.keys(config.pages), ["001-travel", "002-food"]);
  assert.deepEqual(config.pages["001-travel"].map((page) => page.model), ["model-a", "model-b"]);
  assert.ok(options(config).every((page) => page.enabled === false && !Object.hasOwn(page, "prompt")));
  assert.equal(config.pages["002-food"][0].staticDir, "out");
  config.pages["001-travel"][0].enabled = true;
  config.pages["001-travel"][0].title = "User-edited title";
  config.pages["001-travel"][0].staticDir = "exported";
  await saveConfig(workspace, config);
  await result(workspace, "002-food", "model-d");
  config = await syncDeployConfig(workspace);
  assert.equal(options(config).length, 4);
  assert.equal(config.pages["001-travel"][0].enabled, true);
  assert.equal(config.pages["001-travel"][0].title, "User-edited title");
  assert.equal(config.pages["001-travel"][0].staticDir, "exported");
  assert.deepEqual(await syncDeployConfig(workspace), config);
});

test("legacy arrays migrate once by first prompt appearance, preserving model order and every option field", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  await result(workspace, "002-food", "model-c");
  const initial = await syncDeployConfig(workspace);
  const travel = initial.pages["001-travel"];
  travel[0].enabled = true;
  travel[0].title = "Keep custom title";
  travel[0].tags = ["Custom"];
  travel[0].staticDir = "exported";
  travel[0].custom = { keep: true };
  const legacy = {
    version: 1, custom: "preserve top-level fields",
    pages: [
      { prompt: "001-travel", ...travel[1] },
      { prompt: "002-food", ...initial.pages["002-food"][0] },
      { prompt: "001-travel", ...travel[0] },
    ],
  };
  await saveConfig(workspace, legacy);
  const migrated = await syncDeployConfig(workspace);
  assert.deepEqual(migrated, {
    version: 2, custom: legacy.custom,
    pages: { "001-travel": [travel[1], travel[0]], "002-food": initial.pages["002-food"] },
  });
  assert.deepEqual(await configFile(workspace), migrated);
  const contents = await readFile(path.join(workspace, "deploy", "config.json"), "utf8");
  assert.deepEqual(await syncDeployConfig(workspace), migrated);
  assert.equal(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"), contents);
  await assert.rejects(lstat(path.join(workspace, "deploy", "dist")), { code: "ENOENT" });
});

test("legacy deployment options default missing deployed flags to false without publishing", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  const base = await syncDeployConfig(workspace);
  const [first, second] = base.pages["001-travel"];
  first.enabled = true;
  delete first.deployed;
  second.deployed = true;
  for (const version of [1, 2]) {
    await saveConfig(workspace, version === 1
      ? { version, pages: [first, second].map((page) => ({ prompt: "001-travel", ...page })) }
      : { version, pages: { "001-travel": [first, second] } });
    const config = await syncDeployConfig(workspace);
    assert.deepEqual(config.pages["001-travel"].map((p) => [p.enabled, p.deployed]), [[true, false], [false, true]]);
    assert.deepEqual(await configFile(workspace), config);
    await assert.rejects(lstat(path.join(workspace, "deploy", "dist")), { code: "ENOENT" });
  }
});

test("deployed flags follow successful publication, not switches, sync, registration or failed publication", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const { exported } = await result(workspace, "001-travel", "model-b");
  let config = await syncDeployConfig(workspace);
  assert.deepEqual(options(config).map((p) => p.deployed), [false, false]);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  config = await syncDeployConfig(workspace);
  assert.deepEqual(options(config).map((p) => p.deployed), [true, false]);
  await registerGeneratedPage(workspace, { prompt: "001-travel", ...config.pages["001-travel"][0], deployed: false });
  assert.equal((await configFile(workspace)).pages["001-travel"][0].deployed, true);
  config.pages["001-travel"][0].enabled = false;
  config.pages["001-travel"][1].enabled = true;
  await saveConfig(workspace, config);
  const html = await readFile(path.join(exported, "index.html"), "utf8");
  await writeFile(path.join(exported, "index.html"), html + '<img src="missing.png">');
  await assert.rejects(publishSite(workspace), /Missing static link/);
  assert.deepEqual(await configFile(workspace), config);
  const target = path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel");
  assert.deepEqual(await readdir(target), ["model-a"]);
  await writeFile(path.join(exported, "index.html"), html);
  await publishSite(workspace);
  config = await configFile(workspace);
  assert.deepEqual(options(config).map((p) => p.deployed), [false, true]);
  config.pages["001-travel"][1].enabled = false;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  assert.deepEqual(options(await configFile(workspace)).map((p) => p.deployed), [false, false]);
});

test("failure to save deployed flags rolls back the website and preserves the previous config", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  let config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  config = await configFile(workspace);
  config.pages["001-travel"][1].enabled = true;
  await saveConfig(workspace, config);
  await syncDeployConfig(workspace);
  const configPath = path.join(workspace, "deploy", "config.json");
  const before = await readFile(configPath, "utf8");
  const target = path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel");
  const oldPage = await readFile(path.join(target, "model-a", "index.html"), "utf8");
  await writeFile(path.join(exported, "index.html"), "<h1>Updated page</h1>");
  const execution = spawnSync(process.execPath, ["--input-type=module", "--eval", `
    import assert from "node:assert/strict";
    import fs from "node:fs/promises";
    import path from "node:path";
    import { syncBuiltinESMExports } from "node:module";
    const configPath = path.join(process.argv[1], "deploy", "config.json");
    const rename = fs.rename;
    fs.rename = async (source, destination) => {
      if (destination === configPath) throw Error("Simulated deployed-state write failure");
      return rename(source, destination);
    };
    syncBuiltinESMExports();
    const { publishSite } = await import(process.argv[2]);
    await assert.rejects(publishSite(process.argv[1]), /Simulated deployed-state write failure/);
  `, workspace, new URL("./deploy-site.mjs", import.meta.url).href], {
    encoding: "utf8", timeout: 15000,
  });
  assert.equal(execution.status, 0, execution.stderr);
  assert.equal(await readFile(configPath, "utf8"), before);
  assert.deepEqual(await readdir(target), ["model-a"]);
  assert.equal(await readFile(path.join(target, "model-a", "index.html"), "utf8"), oldPage);
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["config.json", "dist"]);
});

test("group keys use the prompt filename rather than its parent directory or public slug", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await rename(path.join(workspace, "data", "prompts", "001-travel"),
    path.join(workspace, "data", "prompts", "different-parent"));
  const config = await syncDeployConfig(workspace);
  assert.deepEqual(Object.keys(config.pages), ["001-travel"]);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), {
    pages: 1, prompts: 1, changed: true, changes: { added: 1, updated: 0, removed: 0, unchanged: 0 },
  });
  assert.match(await readFile(path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel", "model-a", "prompt.html"), "utf8"),
    /&lt;literal prompt&gt;/);
});

test("registration migrates an existing legacy option and appends models to its group without overwriting edits", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const config = await syncDeployConfig(workspace);
  const page = { prompt: "001-travel", ...config.pages["001-travel"][0], enabled: true, title: "Keep title" };
  await saveConfig(workspace, { version: 1, pages: [page] });
  assert.equal(await registerGeneratedPage(workspace, page), false);
  const migrated = await configFile(workspace);
  assert.equal(migrated.version, 2);
  assert.deepEqual(migrated.pages["001-travel"], config.pages["001-travel"].map((entry) =>
    ({ ...entry, enabled: true, title: "Keep title" })));
  assert.equal(await registerGeneratedPage(workspace, { ...page, model: "model-b" }), true);
  const saved = await configFile(workspace);
  assert.deepEqual(Object.keys(saved.pages), ["001-travel"]);
  assert.deepEqual(saved.pages["001-travel"].map((entry) => [entry.model, entry.enabled]),
    [["model-a", true], ["model-b", false]]);
  assert.equal(await registerGeneratedPage(workspace, { ...page, title: "Do not overwrite" }), false);
  await assert.rejects(registerGeneratedPage(workspace, { ...page, staticDir: "out" }), /conflicts with metadata/);
  await assert.rejects(registerGeneratedPage(workspace, { ...page, prompt: "001-TRAVEL", model: "model-c" }), /casing conflicts/);
  assert.deepEqual(await configFile(workspace), saved);
});

test("invalid prompt groups and duplicate legacy options fail without changing config or the website", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const base = await syncDeployConfig(workspace);
  const option = base.pages["001-travel"][0];
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "index.html"), "keep the old website");
  for (const config of [
    { version: 2, pages: [] },
    { version: 2, pages: null },
    { version: 2, pages: { "../escape": [option] } },
    { version: 2, pages: { "001-travel": {} } },
    { version: 2, pages: { "001-travel": [null] } },
    { version: 2, pages: { "001-travel": [{ ...option, prompt: "002-food" }] } },
    { version: 2, pages: { "001-travel": [option], "001-TRAVEL": [option] } },
    { version: 2, pages: { "001-travel": [option, { ...option, model: "MODEL-A" }] } },
    { version: 1, pages: [{ prompt: "001-travel", ...option }, { prompt: "001-travel", ...option }] },
    { version: 3, pages: {} },
  ]) {
    await saveConfig(workspace, config);
    const contents = await readFile(path.join(workspace, "deploy", "config.json"), "utf8");
    await assert.rejects(publishSite(workspace));
    assert.equal(await readFile(path.join(workspace, "deploy", "config.json"), "utf8"), contents);
    assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "keep the old website");
    await assert.rejects(lstat(path.join(workspace, "deploy", ".publish.lock")), { code: "ENOENT" });
  }
});

test("publishing copies only selected variants and removing the last selected model removes its prompt", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "001-travel", "model-b");
  await result(workspace, "002-food", "model-c");
  const config = await syncDeployConfig(workspace);
  options(config).forEach((page) => { page.enabled = true; });
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), {
    pages: 3, prompts: 2, changed: true, changes: { added: 3, updated: 0, removed: 0, unchanged: 0 },
  });
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await writeFile(path.join(target, "obsolete.txt"), "old");
  config.pages["001-travel"][0].enabled = false;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  assert.deepEqual(await readdir(path.join(target, "pages", "travel")), ["model-b"]);
  await assert.rejects(lstat(path.join(target, "obsolete.txt")), { code: "ENOENT" });
  config.pages["001-travel"][1].enabled = false;
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
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await mkdir(path.join(target, ".git"), { recursive: true });
  await writeFile(path.join(target, ".git", "sentinel"), "keep repository metadata");
  await writeFile(path.join(target, ".gitignore"), "local-only");
  await writeFile(path.join(target, "index.html"), "previous website");
  assert.deepEqual(await publishSite(workspace), {
    pages: 0, prompts: 0, changed: true, changes: { added: 0, updated: 0, removed: 0, unchanged: 0 },
  });
  assert.deepEqual(await readdir(path.join(target, "pages")), []);
  assert.match(await readFile(path.join(target, "index.html"), "utf8"), /No published pages yet/);
  assert.equal(await readFile(path.join(target, ".git", "sentinel"), "utf8"), "keep repository metadata");
  assert.equal(await readFile(path.join(target, ".gitignore"), "utf8"), "local-only");
  assert.equal(options(await configFile(workspace)).length, 1);
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["config.json", "dist"]);
});

test("unchanged publication preserves target files and directories while reconciling deployed flags", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await mkdir(path.join(target, ".git"));
  await writeFile(path.join(target, ".git", "sentinel"), "keep");
  await writeFile(path.join(target, ".gitignore"), "local-only");
  const files = [target, path.join(target, "index.html"), path.join(target, "pages"),
    path.join(target, "pages", "travel", "model-a"),
    path.join(target, "pages", "travel", "model-a", "style.css")];
  const old = new Date("2000-01-01T00:00:00Z");
  for (const file of files) await utimes(file, old, old);
  const timestamps = await Promise.all(files.map(async (file) => (await lstat(file)).mtimeMs));
  const stale = await configFile(workspace);
  stale.pages["001-travel"][0].deployed = false;
  await saveConfig(workspace, stale);
  assert.deepEqual(await publishSite(workspace), {
    pages: 1, prompts: 1, changed: false, changes: { added: 0, updated: 0, removed: 0, unchanged: 1 },
  });
  assert.equal((await configFile(workspace)).pages["001-travel"][0].deployed, true);
  assert.deepEqual(await Promise.all(files.map(async (file) => (await lstat(file)).mtimeMs)), timestamps);
  assert.equal(await readFile(path.join(target, ".git", "sentinel"), "utf8"), "keep");
  assert.equal(await readFile(path.join(target, ".gitignore"), "utf8"), "local-only");
  const configPath = path.join(workspace, "deploy", "config.json");
  await utimes(configPath, old, old);
  const configTime = (await lstat(configPath)).mtimeMs;
  assert.equal((await publishSite(workspace)).changed, false);
  assert.equal((await lstat(configPath)).mtimeMs, configTime);
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["config.json", "dist"]);
});

test("enabling a seventh page reports one addition separately from the total and unchanged pages", async (t) => {
  const workspace = await fixture(t);
  for (let number = 1; number <= 7; number++) {
    await result(workspace, `${String(number).padStart(3, "0")}-travel`, "model-a");
  }
  const config = await syncDeployConfig(workspace);
  options(config).forEach((page, index) => {
    page.enabled = index < 6;
    page.slug = `travel-${index + 1}`;
  });
  await saveConfig(workspace, config);
  await publishSite(workspace);
  config.pages["007-travel"][0].enabled = true;
  config.pages["007-travel"][0].deployed = true;
  await saveConfig(workspace, config);
  const added = await publishSite(workspace);
  assert.equal(added.pages, 7);
  assert.deepEqual(added.changes, { added: 1, updated: 0, removed: 0, unchanged: 6 });
  await writeFile(path.join(workspace, "out", "pages", "001-travel", "model-a", "index.html"), "<h1>Updated story</h1>");
  assert.deepEqual((await publishSite(workspace)).changes, { added: 0, updated: 1, removed: 0, unchanged: 6 });
  const edited = await configFile(workspace);
  edited.pages["001-travel"][0].tags = ["New gallery tag"];
  await saveConfig(workspace, edited);
  const galleryOnly = await publishSite(workspace);
  assert.equal(galleryOnly.changed, true);
  assert.deepEqual(galleryOnly.changes, { added: 0, updated: 0, removed: 0, unchanged: 7 });
  edited.pages["007-travel"][0].enabled = false;
  await saveConfig(workspace, edited);
  assert.deepEqual((await publishSite(workspace)).changes, { added: 0, updated: 0, removed: 1, unchanged: 6 });
});

test("content comparison detects changed assets, prompts, gallery inputs and target drift", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a");
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  const asset = path.join(exported, "style.css");
  const mutations = [
    async () => {
      const previous = await lstat(asset);
      await writeFile(asset, "body{color:coral}");
      await utimes(asset, previous.atime, previous.mtime);
    },
    () => writeFile(path.join(workspace, "data", "prompts", "001-travel", "001-travel.md"), "Updated original prompt"),
    async () => {
      const edited = await configFile(workspace);
      edited.pages["001-travel"][0].title = "New gallery title";
      await saveConfig(workspace, edited);
    },
    async () => {
      const template = path.join(workspace, "src", "gallery", "index.html");
      await writeFile(template, (await readFile(template, "utf8")).replace("</body>", "<p>New footer</p></body>"));
    },
    () => unlink(path.join(target, "pages", "travel", "model-a", "style.css")),
    () => mkdir(path.join(target, "obsolete")),
  ];
  for (const mutate of mutations) {
    await mutate();
    assert.equal((await publishSite(workspace)).changed, true);
    assert.equal((await publishSite(workspace)).changed, false);
  }
  assert.equal(await readFile(path.join(target, "pages", "travel", "model-a", "style.css"), "utf8"), "body{color:coral}");
  assert.match(await readFile(path.join(target, "index.html"), "utf8"), /New gallery title/);
  assert.match(await readFile(path.join(target, "index.html"), "utf8"), /New footer/);
  assert.match(await readFile(path.join(target, "pages", "travel", "model-a", "prompt.html"), "utf8"), /Updated original prompt/);
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
  await writeFile(path.join(exported, "metadata.json"), '{"modelId":"private-state"}');
  await writeFile(path.join(exported, "original.md"), "raw prompt");
  await writeFile(path.join(exported, "LICENSE.md"), "Keep license notice");
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const target = path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel", "model-a");
  assert.equal(await readFile(path.join(target, "_next", "static", "chunks", "app", "page.js"), "utf8"), "browser chunk");
  assert.equal(await readFile(path.join(target, "LICENSE.md"), "utf8"), "Keep license notice");
  for (const name of [".env", "package.json", "metadata.json", "original.md", "app", "node_modules", ".next"]) {
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
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "index.html"), "old website");
  await rm(path.join(exported, "index.html"));
  await assert.rejects(publishSite(workspace), /Static index\.html is missing/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "old website");
  config.pages["001-travel"][0].staticDir = ".";
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /Next\.js source cannot be deployed/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "old website");
  assert.deepEqual((await readdir(path.join(workspace, "deploy"))).sort(), ["config.json", "dist"]);
});

test("publish synchronizes a newly discovered result but does not publish it without an explicit selection", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await syncDeployConfig(workspace);
  await result(workspace, "001-travel", "model-b");
  assert.deepEqual(await publishSite(workspace), {
    pages: 0, prompts: 0, changed: true, changes: { added: 0, updated: 0, removed: 0, unchanged: 0 },
  });
  assert.equal(options(await configFile(workspace)).length, 2);
});

test("broken subpath exports fail before replacing the old website", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a", true);
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  const target = path.join(workspace, "deploy", "dist", "MusePages");
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "index.html"), "keep the old website");
  await writeFile(path.join(exported, "index.html"), '<script src="/_next/static/missing.js"></script>');
  await assert.rejects(publishSite(workspace), /Missing static link/);
  assert.equal(await readFile(path.join(target, "index.html"), "utf8"), "keep the old website");
});

test("link validation ignores inline code and text but still validates actual image and script attributes", async (t) => {
  const workspace = await fixture(t);
  const { exported } = await result(workspace, "001-travel", "model-a", true);
  await writeFile(path.join(exported, "app.js"), "console.log('static script');");
  const html = `<link rel="stylesheet" href="style.css">
    <script src="app.js">
      img.src = 'assets/' + filename;
      const template = '<img src="template-only.png">';
    </script>
    <SCRIPT>const href = "not-a-link";</SCRIPT>
    <style>/* src="not-a-style-link" */</style>
    <textarea><img src="example-only.png"></textarea>
    <!-- <img src="comment-only.png"> -->
    <p data-src="not-an-image.png">src="plain-text.png"</p>
    <a title="Example href='not-an-attribute'" href="#local">Local</a>
    <h1 id="local">Static page</h1>`;
  await writeFile(path.join(exported, "index.html"), html);
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), {
    pages: 1, prompts: 1, changed: true, changes: { added: 1, updated: 0, removed: 0, unchanged: 0 },
  });
  const target = path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel", "model-a", "index.html");
  assert.equal(await readFile(target, "utf8"), html);
  for (const invalid of ['<img src="missing.png">', '<script src="missing.js"></script>', '<img src=missing.png>']) {
    await writeFile(path.join(exported, "index.html"), html + invalid);
    await assert.rejects(publishSite(workspace), /Missing static link/);
    assert.equal(await readFile(target, "utf8"), html);
  }
});

test("gallery keeps literal replacement characters and escapes user-edited titles and tags", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const config = await syncDeployConfig(workspace);
  config.pages["001-travel"][0].enabled = true;
  config.pages["001-travel"][0].title = "Title $& <script>";
  config.pages["001-travel"][0].tags = ["$& <tag>"];
  await saveConfig(workspace, config);
  await publishSite(workspace);
  const html = await readFile(path.join(workspace, "deploy", "dist", "MusePages", "index.html"), "utf8");
  assert.match(html, /Title \$&amp; &lt;script&gt;/);
  assert.match(html, /\$&amp; &lt;tag&gt;/);
  assert.doesNotMatch(html, /<!-- RESULT_CARDS -->/);
});

test("malformed config, traversal paths, duplicates and public path collisions fail explicitly", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "002-travel", "model-a");
  const base = await syncDeployConfig(workspace);
  for (const [field, value] of [["prompt", "../escape"], ["model", ".."], ["slug", "001-numbered"], ["staticDir", "../outside"], ["enabled", "true"], ["deployed", "true"], ["deployed", null]]) {
    const config = structuredClone(base);
    config.pages["001-travel"][0][field] = value;
    await saveConfig(workspace, config);
    await assert.rejects(publishSite(workspace));
  }
  await saveConfig(workspace, { ...base, pages: { "001-travel": [base.pages["001-travel"][0], base.pages["001-travel"][0]] } });
  await assert.rejects(publishSite(workspace), /Duplicate deployment option/);
  options(base).forEach((page) => { page.enabled = true; });
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
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /cannot be symbolic links/);
  assert.equal(await readFile(path.join(outside, "private.txt"), "utf8"), "not public");
});

test("different prompts cannot share a public slug even when their models differ", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  await result(workspace, "002-travel", "model-b");
  const config = await syncDeployConfig(workspace);
  options(config).forEach((page) => { page.enabled = true; });
  await saveConfig(workspace, config);
  await assert.rejects(publishSite(workspace), /Conflicting public path/);
  config.pages["002-travel"][0].slug = "travel-adventures";
  await saveConfig(workspace, config);
  assert.deepEqual(await publishSite(workspace), {
    pages: 2, prompts: 2, changed: true, changes: { added: 2, updated: 0, removed: 0, unchanged: 0 },
  });
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
    } while (options(config).length === 0 && Date.now() < deadline);
    assert.equal(options(config).length, 1);
    assert.equal(config.pages["001-travel"][0].enabled, false);
    await assert.rejects(lstat(path.join(workspace, "deploy", "dist")), { code: "ENOENT" });
  } finally {
    await watcher.close();
  }
});

test("concurrent sync operations preserve one option and leave no lock behind", async (t) => {
  const workspace = await fixture(t);
  await result(workspace, "001-travel", "model-a");
  const configs = await Promise.all([syncDeployConfig(workspace), syncDeployConfig(workspace)]);
  assert.ok(configs.every((config) => options(config).length === 1));
  assert.equal(options(await configFile(workspace)).length, 1);
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
  config.pages["001-travel"][0].enabled = true;
  await saveConfig(workspace, config);
  const first = cli("publish");
  assert.match(first, /Updated local static site: 1 added, 0 updated, 0 removed, 0 unchanged/);
  assert.match(first, /Total: 1 pages from 1 prompts/);
  assert.match(first, /in deploy\\dist\\MusePages\./);
  assert.deepEqual(await readdir(path.join(workspace, "deploy", "dist")), ["MusePages"]);
  await assert.rejects(lstat(path.join(workspace, "deploy", "MusePages")), { code: "ENOENT" });
  const unchanged = cli("publish");
  assert.match(unchanged, /No changes: local static site is up to date \(1 pages from 1 prompts\)/);
  assert.match(unchanged, /No remote deployment was performed/);
  assert.doesNotMatch(unchanged, /Published|Updated local static site/);
  const target = path.join(workspace, "deploy", "dist", "MusePages", "pages", "travel");
  assert.deepEqual(await readdir(target), ["model-a"]);
  config.pages["001-travel"][1].enabled = true;
  await saveConfig(workspace, config);
  const added = cli("publish");
  assert.match(added, /Updated local static site: 1 added, 0 updated, 0 removed, 1 unchanged/);
  assert.match(added, /Total: 2 pages from 1 prompts/);
  config.pages["001-travel"][0].enabled = false;
  config.pages["001-travel"][1].enabled = false;
  await saveConfig(workspace, config);
  const removed = cli("publish");
  assert.match(removed, /Updated local static site: 0 added, 0 updated, 2 removed, 0 unchanged/);
  assert.match(removed, /Total: 0 pages from 0 prompts/);
  await assert.rejects(lstat(target), { code: "ENOENT" });
  assert.equal(options(await configFile(workspace)).length, 2);
});
