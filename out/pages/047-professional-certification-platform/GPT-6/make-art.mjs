import { readFile, writeFile, copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../package.json", import.meta.url));
const React = require("react"), { renderToStaticMarkup } = require("react-dom/server"), lucide = require("lucide-react");
await mkdir(new URL("assets/", import.meta.url), { recursive: true });
const html = await readFile(new URL("index.html", import.meta.url), "utf8");
const names = new Set([...html.matchAll(/icons\.svg#([\w-]+)/g)].map((match) => match[1]));
for (const name of ["database", "chart-no-axes-combined", "network", "server", "lock", "brain-circuit", "star", "linkedin", "clock", "users", "arrow-right", "check", "play", "pause"]) names.add(name);
const paths = {};
for (const name of names) {
  const component = name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const Icon = name === "linkedin" ? lucide.ExternalLink : lucide[component];
  if (!Icon) throw Error(`Missing Lucide icon: ${component}`);
  paths[name] = renderToStaticMarkup(React.createElement(Icon)).replace(/<svg[^>]*>/, "").replace("</svg>", "");
}
await writeFile(new URL("assets/icons.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg"><defs>${Object.entries(paths).map(([id, value]) => `<symbol id="${id}" viewBox="0 0 24 24">${value}</symbol>`).join("")}</defs></svg>`);
await writeFile(new URL("assets/icons.js", import.meta.url), `export const ICONS = ${JSON.stringify(paths)};\n`);
for (const [source, target] of [["inter.ttf", "inter.ttf"], ["jakarta.ttf", "jakarta.ttf"], ["INTER-OFL.txt", "INTER-OFL.txt"], ["JAKARTA-OFL.txt", "JAKARTA-OFL.txt"], ["LUCIDE-LICENSE.txt", "LUCIDE-LICENSE.txt"]]) {
  await copyFile(new URL(`../../032-agency-process-page/GPT-6/assets/${source}`, import.meta.url), new URL(`assets/${target}`, import.meta.url));
}
await writeFile(new URL("assets/mark.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#2563eb"/><path d="m24 7 14 7v12L24 41 10 26V14Z" fill="none" stroke="white" stroke-width="2"/><path d="m16 23 6 6 11-12" fill="none" stroke="white" stroke-width="3"/></svg>`);
await writeFile(new URL("assets/sample-credential.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="#eff6ff"/><rect x="25" y="25" width="850" height="550" rx="15" fill="white" stroke="#2563eb"/><g text-anchor="middle" font-family="sans-serif"><text x="450" y="115" font-size="26" fill="#2563eb">CREDPATH · FICTIONAL SAMPLE</text><text x="450" y="215" font-size="35" fill="#1e293b">Cloud Architecture Professional</text><text x="450" y="280" font-size="24">Maria Garcia · fictional identity</text><text x="450" y="350" font-size="21">CP-DEMO-CLOUD-001</text><text x="450" y="435" font-size="42" font-weight="bold" fill="#b45309">SAMPLE · NOT VALID</text><text x="450" y="500" font-size="16">Not a qualification, accreditation or proof of skills</text></g></svg>`);
const portraits = [["david", "#c5d6e7", "#936345", "#263957"], ["amara", "#d5e0d1", "#744c36", "#477469"], ["ryan", "#e7d8cb", "#c68e69", "#5a607a"]];
for (const [id, background, skin, shirt] of portraits) {
  await writeFile(new URL(`assets/${id}.svg`, import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="${background}"/><path d="M12 120c0-47 96-47 96 0" fill="${shirt}"/><path d="M48 77h24v22H48" fill="${skin}"/><ellipse cx="60" cy="51" rx="25" ry="33" fill="${skin}"/><path d="M34 47c-6-46 60-47 52 1-10-4-18-14-23-20-10 11-21 15-29 19" fill="#253242"/><path d="M48 53h3m18 0h3m-19 18q7 5 14 0" fill="none" stroke="#302b2a" stroke-linecap="round" stroke-width="2"/></svg>`);
}
await writeFile(new URL("assets/credits.txt", import.meta.url), "CredPath: original fictional platform concept and original text, credential artwork and SVG portraits; generated with gpt-6.1-sol.\nEmployer names are plain text illustrations, not logos, endorsements or partnerships.\nLucide icons: ISC, see LUCIDE-LICENSE.txt.\nInter: SIL OFL, see INTER-OFL.txt. Plus Jakarta Sans: SIL OFL, see JAKARTA-OFL.txt.\nLocal font binaries reused from the existing Frameshift result; no external runtime requests.\n");
