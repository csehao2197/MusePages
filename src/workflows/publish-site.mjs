import { createHash } from "node:crypto";
import { cp, lstat, mkdir, readFile, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

async function directory(folder, optional = false) {
  let info;
  try {
    info = await lstat(folder);
  } catch (error) {
    if (optional && error.code === "ENOENT") return;
    throw error;
  }
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw Error(`Expected a real directory: ${folder}`);
  }
}

async function checkSource(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await checkSource(file);
    else if (!entry.isFile()) throw Error(`Expected a regular file or directory: ${file}`);
  }
}

async function snapshot(folder, prefix = "", entries = new Map()) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) {
      entries.set(relative, "directory");
      await snapshot(file, relative, entries);
    } else if (entry.isFile()) {
      entries.set(relative, createHash("sha256").update(await readFile(file)).digest("hex"));
    } else {
      throw Error(`Expected a regular file or directory: ${file}`);
    }
  }
  return entries;
}

export async function verifySite(source, destination) {
  await directory(source);
  await directory(destination);
  const expected = await snapshot(source);
  const actual = await snapshot(destination);
  for (const relative of new Set([...expected.keys(), ...actual.keys()])) {
    if (expected.get(relative) !== actual.get(relative)) {
      throw Error(`Strict sync verification failed: ${relative}`);
    }
  }
}

export async function publishToSite(workspace = root) {
  const deploy = path.join(workspace, "deploy");
  const source = path.join(deploy, "dist");
  const destination = path.join(deploy, "site");
  await directory(deploy);
  await directory(source);
  await checkSource(source);
  await directory(destination, true);

  await mkdir(destination, { recursive: true });
  for (const name of await readdir(destination)) {
    await rm(path.join(destination, name), { recursive: true, force: true });
  }
  await cp(source, destination, { recursive: true });
  await verifySite(source, destination);
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw Error("Usage: npm run publish");
    const destination = await publishToSite();
    console.log(`Strictly synced deploy\\dist to ${destination}. Exact paths and file contents verified. Local files only.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
