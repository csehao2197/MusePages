import { cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
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

export async function publishToSite(workspace = root) {
  const deploy = path.join(workspace, "deploy");
  const source = path.join(deploy, "dist");
  const site = path.join(deploy, "site");
  const destination = path.join(site, "MusePages");
  await directory(deploy);
  await directory(source);
  await checkSource(source);
  await directory(site, true);
  await directory(destination, true);

  await mkdir(destination, { recursive: true });
  for (const name of await readdir(destination)) {
    await rm(path.join(destination, name), { recursive: true, force: true });
  }
  await cp(source, destination, { recursive: true });
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length > 2) throw Error("Usage: npm run publish");
    const destination = await publishToSite();
    console.log(`Copied deploy\\dist contents to ${destination}. Local files only.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
