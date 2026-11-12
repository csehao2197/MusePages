import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

export async function publishToSite(workspace = root) {
  const source = path.join(workspace, "deploy", "dist", "MusePages");
  const destination = path.join(workspace, "deploy", "site", "MusePages");
  const names = await readdir(source);

  await mkdir(destination, { recursive: true });
  for (const name of await readdir(destination)) {
    if (name.toLowerCase() === ".git") continue;
    await rm(path.join(destination, name), { recursive: true, force: true });
  }
  for (const name of names) {
    if (name.toLowerCase() === ".git") continue;
    await cp(path.join(source, name), path.join(destination, name), { recursive: true });
  }
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  publishToSite().then((destination) => {
    console.log(`Copied deploy\\dist\\MusePages contents to ${path.relative(root, destination)}. Local files only.`);
  }).catch((error) => {
    console.error(`Publish failed: ${error.message}`);
    process.exitCode = 1;
  });
}