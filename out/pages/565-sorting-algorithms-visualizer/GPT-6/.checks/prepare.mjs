import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "..", "..", "..", "..");
await mkdir(path.join(root, "fonts"), { recursive: true });
await mkdir(path.join(root, "licenses"), { recursive: true });
const fonts = [
    ["@fontsource-variable/bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2", "bricolage.woff2"],
    ...[400, 500, 600].map((w) => ["@fontsource/ibm-plex-sans", `ibm-plex-sans-latin-${w}-normal.woff2`, `plex-${w}.woff2`]),
    ...[400, 500, 700].map((w) => ["@fontsource/jetbrains-mono", `jetbrains-mono-latin-${w}-normal.woff2`, `mono-${w}.woff2`])
];
for (const [pkg, file, name] of fonts)
{
    await copyFile(path.join(root, "node_modules", pkg, "files", file), path.join(root, "fonts", name));
}
for (const [pkg, name] of [
    ["@fontsource-variable/bricolage-grotesque", "bricolage"],
    ["@fontsource/ibm-plex-sans", "plex"],
    ["@fontsource/jetbrains-mono", "jetbrains"]
])
{
    await copyFile(path.join(root, "node_modules", pkg, "LICENSE"), path.join(root, "licenses", `${name}.txt`));
}
await copyFile(path.join(workspace, "node_modules", "lucide-react", "LICENSE"), path.join(root, "licenses", "lucide.txt"));
const icons = {};
for (const name of ["play", "pause", "skip-back", "step-back", "step-forward", "shuffle", "rotate-ccw", "flag"])
{
    const file = path.join(workspace, "node_modules", "lucide-react", "dist", "esm", "icons", `${name}.mjs`);
    const { __iconData: data } = await import(pathToFileURL(file));
    icons[name] = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${data.node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ")} />`).join("")}</svg>`;
}
await writeFile(path.join(root, "icons.js"), `// Lucide icon geometry, ISC. See licenses/lucide.txt.\nexport const icons = ${JSON.stringify(icons, null, 4)};\n`);
console.log("Prepared seven self-hosted fonts, eight Lucide glyphs and full asset licenses.");
