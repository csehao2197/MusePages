import test from "node:test";
import assert from "node:assert/strict";
import { copyFile, lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { publishToSite } from "./publish-site.mjs";

async function fixture(t) {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "musepages-copy-site-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  await mkdir(path.join(workspace, "deploy", "dist"), { recursive: true });
  return workspace;
}

async function tree(folder) {
  const files = {};
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    files[entry.name] = entry.isDirectory() ? await tree(file) : await readFile(file);
  }
  return files;
}

test("publishing replaces all destination contents, including hidden entries, without changing source or siblings", async (t) => {
  const workspace = await fixture(t);
  const deploy = path.join(workspace, "deploy");
  const source = path.join(deploy, "dist");
  const destination = path.join(deploy, "site", "MusePages");
  await mkdir(path.join(source, "pages", "example"), { recursive: true });
  await mkdir(path.join(source, ".well-known"));
  await writeFile(path.join(source, "index.html"), "<h1>Gallery</h1>");
  await writeFile(path.join(source, "pages", "example", "index.html"), "<h1>Example</h1>");
  await writeFile(path.join(source, ".well-known", "asset"), Buffer.from([0, 255, 1, 128]));
  await mkdir(path.join(destination, ".git"), { recursive: true });
  await mkdir(path.join(destination, "obsolete"));
  await writeFile(path.join(destination, ".git", "config"), "old metadata");
  await writeFile(path.join(destination, "obsolete", "old.html"), "obsolete");
  await writeFile(path.join(destination, "index.html"), "old index");
  await writeFile(path.join(deploy, "site", "sibling.txt"), "keep sibling");
  await writeFile(path.join(deploy, "config.json"), "keep config");
  const before = await tree(source);

  assert.equal(await publishToSite(workspace), destination);
  assert.deepEqual(await tree(destination), before);
  assert.deepEqual(await tree(source), before);
  assert.equal(await readFile(path.join(deploy, "site", "sibling.txt"), "utf8"), "keep sibling");
  assert.equal(await readFile(path.join(deploy, "config.json"), "utf8"), "keep config");
  await rm(path.join(source, "pages"), { recursive: true });
  await writeFile(path.join(source, "index.html"), "updated index");
  await publishToSite(workspace);
  assert.deepEqual(await tree(destination), await tree(source));
});

test("npm run publish creates a missing destination and copies contents without an extra dist directory", async (t) => {
  const workspace = await fixture(t);
  await writeFile(path.join(workspace, "deploy", "dist", "index.html"), "new index");
  const scripts = path.join(workspace, "src", "workflows");
  await mkdir(scripts, { recursive: true });
  await copyFile(new URL("./publish-site.mjs", import.meta.url), path.join(scripts, "publish-site.mjs"));
  await copyFile(new URL("../../package.json", import.meta.url), path.join(workspace, "package.json"));
  const command = process.platform === "win32" ? process.env.ComSpec : "npm";
  const args = process.platform === "win32" ? ["/d", "/s", "/c", "npm run publish"] : ["run", "publish"];
  const result = spawnSync(command, args, { cwd: workspace, encoding: "utf8", timeout: 30000 });
  assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Local files only/);
  assert.deepEqual(await tree(path.join(workspace, "deploy", "site", "MusePages")), {
    "index.html": Buffer.from("new index"),
  });
});

test("a missing or invalid source leaves the existing destination untouched", async (t) => {
  for (const invalid of ["missing", "file"]) {
    await t.test(invalid, async (t) => {
      const workspace = await fixture(t);
      const source = path.join(workspace, "deploy", "dist");
      const destination = path.join(workspace, "deploy", "site", "MusePages");
      await mkdir(destination, { recursive: true });
      await writeFile(path.join(destination, "index.html"), "keep old site");
      await rm(source, { recursive: true });
      if (invalid === "file") await writeFile(source, "not a directory");
      await assert.rejects(publishToSite(workspace));
      assert.equal(await readFile(path.join(destination, "index.html"), "utf8"), "keep old site");
    });
  }
});

test("symbolic source and destination directories cannot redirect copying or cleanup", async (t) => {
  for (const redirected of ["dist", "source-child", "site", "destination"]) {
    await t.test(redirected, async (t) => {
      const workspace = await fixture(t);
      const deploy = path.join(workspace, "deploy");
      const outside = path.join(workspace, "unrelated");
      await mkdir(outside);
      await writeFile(path.join(outside, "keep.txt"), "untouched");
      let linked;
      if (redirected === "dist") {
        linked = path.join(deploy, "dist");
        await rm(linked, { recursive: true });
      } else if (redirected === "source-child") {
        linked = path.join(deploy, "dist", "linked");
      } else if (redirected === "site") {
        linked = path.join(deploy, "site");
      } else {
        await mkdir(path.join(deploy, "site"));
        linked = path.join(deploy, "site", "MusePages");
      }
      await symlink(outside, linked, process.platform === "win32" ? "junction" : "dir");
      await assert.rejects(publishToSite(workspace));
      assert.equal(await readFile(path.join(outside, "keep.txt"), "utf8"), "untouched");
      assert.ok((await lstat(linked)).isSymbolicLink());
    });
  }
});
