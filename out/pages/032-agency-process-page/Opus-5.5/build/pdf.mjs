// Writes the sample "process overview" PDF used by "Download Process PDF". Run from the model folder: node build/pdf.mjs
import { writeFile } from "node:fs/promises";
function pdf(lines) {
  const e = (s) => s.replace(/[–—]/g, "-").replace(/[’]/g, "'").replace(/·/g, "|").replace(/[\()]/g, (x) => `\${x}`).replace(/[^\x20-\x7E]/g, "-");
  let s = "BT\n", y = 744;
  for (const [f, size, t] of lines) { if (!f) { y -= 8; continue; } s += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${e(t)}) Tj\n`; y -= size + 6; }
  s += "ET";
  const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
    `<< /Length ${s.length} >>\nstream\n${s}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
  let out = "%PDF-1.4\n"; const off = [];
  objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const x = out.length;
  return out + `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
}
const phases = [
  ["Phase 1 - Discover (Weeks 1-2)", ["Stakeholder interview summaries (3-5 sessions)", "Competitive landscape analysis (5+ competitors)", "User persona profiles (2-3 personas)", "Information architecture sitemap", "Project brief & success metrics document"], "You join 2 workshops and review the project brief."],
  ["Phase 2 - Design (Weeks 3-6)", ["Low-fidelity wireframes (all core flows)", "Design system & component library", "High-fidelity UI designs (Figma)", "Interactive clickable prototype", "Usability test report (5 user sessions)"], "2 design review checkpoints; async feedback in Figma comments."],
  ["Phase 3 - Develop (Weeks 7-10)", ["Sprint 1 & 2 working builds (bi-weekly demos)", "Frontend + backend implementation", "API documentation", "Automated test suite (90%+ coverage)", "Staging environment for review"], "Bi-weekly sprint demos; you test every feature on staging."],
  ["Phase 4 - Deliver (Weeks 11-12)", ["Production deployment & DNS setup", "Performance audit (Core Web Vitals, Lighthouse 95+)", "Analytics & monitoring setup (Mixpanel, Sentry)", "Technical handoff documentation", "30-day post-launch priority support"], "You approve the go-live checklist; shared Slack for launch day."],
];
const lines = [["F2", 22, "Frameshift - How We Work"], ["F1", 11, "From idea to launch in 12 weeks. Sample overview for this demo page."], ["", 0, ""]];
for (const [h, items, note] of phases) { lines.push(["F2", 13, h]); items.forEach((i) => lines.push(["F1", 10, `- ${i}`])); lines.push(["F1", 10, `Your involvement: ${note}`]); lines.push(["", 0, ""]); }
lines.push(["F1", 10, "Book a 30-minute discovery call: no commitment, response within 24 hours."]);
await writeFile("assets/frameshift-process.pdf", pdf(lines));
console.log("wrote assets/frameshift-process.pdf");
