import
{
    cp,
    mkdir,
    readFile,
    readdir,
    rm,
    writeFile
}
from "node:fs/promises";
import path from "node:path";
import
{
    fileURLToPath
}
from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const protectedNames = new Set([".git", ".ssh"]);
const preservedFiles = /^(?:google.*\.html|robots\.txt)$/i;

export async function publishToSite(workspace = root)
{
    const source = path.join(workspace, "deploy", "dist", "MusePages");
    const destination = path.join(workspace, "deploy", "site", "MusePages");
    const names = await readdir(source);

    await mkdir(destination,
    {
        recursive: true
    });
    for (const name of await readdir(destination))
    {
        if (protectedNames.has(name.toLowerCase()) || preservedFiles.test(name)) continue;
        await rm(path.join(destination, name),
        {
            recursive: true,
            force: true
        });
    }
    for (const name of names)
    {
        if (protectedNames.has(name.toLowerCase()) || name.toLowerCase() === "collections") continue;
        if (name.toLowerCase() === "index.html")
        {
            const html = await readFile(path.join(source, name), "utf8");
            await writeFile(path.join(destination, name),
                html.replace(/<a\b[^>]*\bhref=(["'])(?:\.\/)?collections\/index\.html\1[^>]*>[\s\S]*?<\/a>/gi, ""), "utf8");
        }
        else
        {
            await cp(path.join(source, name), path.join(destination, name),
            {
                recursive: true
            });
        }
    }
    return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
{
    publishToSite().then((destination) =>
    {
        console.log(`Copied deploy\\dist\\MusePages contents to ${path.relative(root, destination)}. Local files only.`);
    }).catch((error) =>
    {
        console.error(`Publish failed: ${error.message}`);
        process.exitCode = 1;
    });
}
