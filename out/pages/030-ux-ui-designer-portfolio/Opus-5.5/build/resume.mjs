// Writes the one-page sample resume PDF used by "Download Resume". Run from the model folder: node build/resume.mjs
import { writeFile } from "node:fs/promises";

function pdf(lines) {
  const e = (s) => s.replace(/[–—]/g, "-").replace(/[’]/g, "'").replace(/·/g, "|").replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
  let s = "BT\n", y = 740;
  for (const [f, size, t] of lines) { if (!f) { y -= 10; continue; } s += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${e(t)}) Tj\n`; y -= size + 7; }
  s += "ET";
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${s.length} >>\nstream\n${s}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  let out = "%PDF-1.4\n"; const off = [];
  objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  return out;
}

await writeFile("assets/ava-chen-resume-sample.pdf", pdf([
  ["F2", 22, "Ava Chen - Product Designer (SAMPLE)"],
  ["F1", 10, "Illustrative resume for a portfolio concept. Roles, employers and metrics are sample content."],
  ["F1", 11, "San Francisco, CA | ava@avachen.design"],
  ["", 0, ""],
  ["F2", 13, "Experience"],
  ["F1", 11, "Senior Product Designer, Notion - 2024 to present"],
  ["F1", 11, "- Mobile calendar redesign with multi-workspace scheduling; 34% faster task creation"],
  ["F1", 11, "Product Designer, Stripe - 2022 to 2024"],
  ["F1", 11, "- Unified merchant analytics dashboard; consolidated 6 reporting views into one"],
  ["F1", 11, "Product Designer, Figma - 2020 to 2022"],
  ["F1", 11, "- Plugin manager: discovery, reviews and one-click updates; 3x install rate"],
  ["F1", 11, "UX Designer, HealthTrack (contract) - 2019 to 2020"],
  ["F1", 11, "- WCAG 2.1 AA patient portal for booking, lab results and messaging"],
  ["", 0, ""],
  ["F2", 13, "Process"],
  ["F1", 11, "Discover - Define - Design - Deliver: research, framing, prototyping, handoff and iteration"],
  ["", 0, ""],
  ["F2", 13, "Tools"],
  ["F1", 11, "Figma, Sketch, Adobe XD, Framer, Principle, Whimsical, Maze, Hotjar, UserTesting"],
  ["F1", 11, "HTML/CSS, React basics, design systems"],
  ["", 0, ""],
  ["F2", 13, "Education"],
  ["F1", 11, "UX Design bootcamp; BFA, Graphic Design"],
]));
console.log("wrote assets/ava-chen-resume-sample.pdf");
