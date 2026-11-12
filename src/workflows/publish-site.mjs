import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));

export async function publishToSite(workspace = root) {
  const deploy = path.join(workspace, "deploy");
  const source = path.join(deploy, "dist", "MusePages");
  const destination = path.join(deploy, "site", "MusePages");

  await mkdir(destination, { recursive: true });
  for (const name of await readdir(destination)) {
    await rm(path.join(destination, name), { recursive: true, force: true });
  }
  await cp(source, destination, { recursive: true });
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const destination = await publishToSite();
    console.log(`Copied deploy\\dist\\MusePages contents to ${destination}. Local files only.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
