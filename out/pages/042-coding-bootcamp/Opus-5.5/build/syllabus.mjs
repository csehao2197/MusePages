// Writes sample syllabus PDFs for the three programs. Run from the model folder: node build/syllabus.mjs
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
const PROGRAMS = [
  ["full-stack", "Full-Stack Web Development", "12 weeks full-time / 24 weeks part-time", "React, Node.js, PostgreSQL, AWS", ["Weeks 1-2: HTML, CSS, JavaScript fundamentals", "Weeks 3-4: React components, state and routing", "Weeks 5-6: Node.js, Express and REST APIs", "Weeks 7-8: PostgreSQL, auth and testing", "Weeks 9-10: AWS deployment and team project", "Weeks 11-12: Capstone and career sprint"], "5 portfolio projects + capstone", "$14,900"],
  ["data-science", "Data Science & Analytics", "12 weeks full-time / 24 weeks part-time", "Python, SQL, TensorFlow, Tableau", ["Weeks 1-2: Python and statistics refresher", "Weeks 3-4: SQL and data wrangling with pandas", "Weeks 5-6: Visualization and Tableau dashboards", "Weeks 7-8: Machine learning with scikit-learn", "Weeks 9-10: Deep learning with TensorFlow", "Weeks 11-12: Capstone and career sprint"], "4 portfolio projects + capstone", "$13,900"],
  ["ux-design", "UX Design", "10 weeks full-time / 20 weeks part-time", "Figma, Adobe XD, Maze, Hotjar", ["Weeks 1-2: Research methods and interviews", "Weeks 3-4: Information architecture and flows", "Weeks 5-6: Wireframes and prototyping in Figma", "Weeks 7-8: Usability testing with Maze and Hotjar", "Weeks 9-10: Capstone case study and portfolio"], "3 case studies + capstone", "$11,900"],
];
for (const [slug, name, dur, tech, weeks, proj, price] of PROGRAMS) {
  const lines = [["F2", 20, `LaunchCode Academy - ${name}`], ["F1", 10, "Sample syllabus for a demo page. Schedule and content are illustrative."], ["", 0, ""], ["F2", 12, "Format"], ["F1", 11, dur], ["F2", 12, "Technologies"], ["F1", 11, tech], ["F2", 12, "Projects"], ["F1", 11, proj], ["F2", 12, "Tuition"], ["F1", 11, `${price} - upfront, 0% installments or income share agreement`], ["", 0, ""], ["F2", 12, "Curriculum"], ...weeks.map((w) => ["F1", 11, `- ${w}`]), ["", 0, ""], ["F1", 11, "Career services: coaching, resume review, mock interviews, partner intros."]];
  await writeFile(`assets/syllabus-${slug}.pdf`, pdf(lines));
}
console.log("wrote 3 syllabus PDFs");
