import { readFile, writeFile, copyFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const icons = require("lucide-react");
const folder = path.resolve(import.meta.dirname, "..");
const file = path.join(folder, "index.html");
let html = await readFile(file, "utf8");
html = html.replace(/<i data-icon="([^"]+)"><\/i>/g, (_, name) => {
  const symbol = name === "figma" ? "PanelsTopLeft" : name.split("-").map(part => part[0].toUpperCase() + part.slice(1)).join("");
  if (!icons[symbol]) throw Error(`Missing Lucide ${symbol}`);
  return renderToStaticMarkup(React.createElement(icons[symbol], { className: "icon", "aria-hidden": "true", focusable: "false", strokeWidth: 1.7 }));
});
await writeFile(file, html);
await copyFile(path.resolve("node_modules", "lucide-react", "LICENSE"), path.join(folder, "assets", "LUCIDE-LICENSE.txt"));
const lines = [
  "FRAMESHIFT / OUR PROCESS",
  "A fictional studio concept. Local demo summary.",
  "",
  "From idea to launch in 12 weeks",
  "Discover / Weeks 1-2: Research, workshops, personas, project brief.",
  "Design / Weeks 3-6: Wireframes, design system, prototype, user testing.",
  "Develop / Weeks 7-10: Two sprints, working demos, tests, documentation.",
  "Deliver / Weeks 11-12: Launch checklist, handoff, 30-day support.",
  "",
  "You stay involved through workshops, design reviews and sprint demos.",
  "Illustrative price range: $60K-$150K, subject to agreed scope.",
  "All services, timelines and performance targets are illustrative.",
  "This document is not a real service offer or a confirmed booking.",
  "No personal information is collected. No backend is connected."
];
let y = 770;
const stream = `BT /F1 12 Tf ${lines.map(line => {
  const escaped = line.replace(/[\\()]/g, "\\$&");
  const result = `1 0 0 1 45 ${y} Tm (${escaped}) Tj`;
  y -= 28; return result;
}).join("\n")} ET`;
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`
];
let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, index) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
pdf += offsets.slice(1).map(offset => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
await writeFile(path.join(folder, "assets", "frameshift-process.pdf"), pdf);
const config = await readFile(path.resolve("deploy", "config.json"), "utf8");
await writeFile(path.join(import.meta.dirname, "config-before.json"), config);
console.log("Original process PDF and licensed Lucide inline icons prepared. Prior deployment config preserved for comparison.");
