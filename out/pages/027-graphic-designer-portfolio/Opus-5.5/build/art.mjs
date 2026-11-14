// Original SVG artwork for the sample projects (no licensed imagery). Each export returns a standalone SVG file.
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const svg = (w, h, body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${body}</svg>\n`;
const T = (x, y, s, txt, o = {}) => `<text x="${x}" y="${y}" font-family="${o.serif ? SERIF : SANS}" font-size="${s}" font-weight="${o.w || 400}" fill="${o.f || "#111"}" text-anchor="${o.a || "start"}"${o.ls ? ` letter-spacing="${o.ls}"` : ""}${o.it ? ' font-style="italic"' : ""}${o.op ? ` opacity="${o.op}"` : ""}>${String(txt).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, "&amp;")}</text>`;
const lines = (x, y, w, n, gap = 14, c = "#9AA0A6", sw = 4) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${i === n - 1 ? w * 0.6 : w}" height="${sw}" rx="2" fill="${c}"/>`).join("");
const shadow = (id) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".28"/></filter>`;

// ---------- Saltmarsh ----------
const SG = "#0F3B3A", CR = "#F2EBDD", CO = "#E2725B", KE = "#5C7A4A";
const shell = (cx, cy, r, c = CR, sw) => Array.from({ length: 5 }, (_, i) => `<path d="M${cx - r * (1 - i * 0.18)} ${cy} A${r * (1 - i * 0.18)} ${r * (1 - i * 0.18)} 0 0 1 ${cx + r * (1 - i * 0.18)} ${cy}" fill="none" stroke="${c}" stroke-width="${sw || r * 0.07}" stroke-linecap="round"/>`).join("") + `<path d="M${cx - r * 1.08} ${cy + r * 0.12} H${cx + r * 1.08}" stroke="${c}" stroke-width="${(sw || r * 0.07) * 0.8}" stroke-linecap="round"/>`;
const tin = (x, y, w, h, label, c = SG) => `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.16}" fill="${CR}"/><rect x="${x}" y="${y + h * 0.28}" width="${w}" height="${h * 0.44}" fill="${c}"/>${shell(x + w * 0.2, y + h * 0.58, h * 0.14, CR)}${T(x + w * 0.38, y + h * 0.48, h * 0.11, "SALTMARSH", { serif: 1, f: CR, ls: 3 })}${T(x + w * 0.38, y + h * 0.62, h * 0.08, label, { f: CO, w: 700, ls: 2 })}<rect x="${x + 8}" y="${y + 6}" width="${w - 16}" height="${h * 0.12}" rx="${h * 0.06}" fill="#fff" opacity=".35"/></g>`;
export function saltmarshLead(w = 1600, h = 900) {
  let o = `<rect width="${w}" height="${h}" fill="${SG}"/>${shell(w * 0.27, h * 0.56, h * 0.3)}${T(w * 0.27, h * 0.72, h * 0.07, "SALTMARSH", { serif: 1, f: CR, a: "middle", ls: 10 })}${T(w * 0.27, h * 0.78, h * 0.03, "OYSTER CO. · EST. 1962", { f: CO, a: "middle", w: 700, ls: 6 })}`;
  o += tin(w * 0.56, h * 0.18, w * 0.34, h * 0.2, "NATIVE") + tin(w * 0.6, h * 0.42, w * 0.34, h * 0.2, "ROCK", KE) + tin(w * 0.54, h * 0.66, w * 0.34, h * 0.2, "SMOKED", "#7A3B2A");
  return svg(w, h, o, shadow("sh"));
}
export function saltmarshSeq(k, w = 1600, h = 1000) {
  let o = "";
  if (k === "system") {
    o = `<rect width="${w}" height="${h}" fill="${CR}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${(i + 1) * w / 10} 0 V${h}" stroke="${SG}" stroke-opacity=".08"/>`).join("")}`;
    o += `<rect x="80" y="80" width="660" height="400" fill="${SG}"/>${shell(410, 300, 120)}${T(410, 400, 44, "SALTMARSH", { serif: 1, f: CR, a: "middle", ls: 8 })}`;
    o += `<rect x="860" y="80" width="660" height="400" fill="#fff"/>${shell(1190, 260, 110, SG)}${T(1190, 340, 36, "SALTMARSH", { serif: 1, f: SG, a: "middle", ls: 7 })}${T(1190, 380, 18, "OYSTER CO.", { f: CO, a: "middle", w: 700, ls: 6 })}`;
    o += `<rect x="80" y="540" width="420" height="380" fill="${CO}"/>${shell(290, 760, 100, CR)}<rect x="560" y="540" width="420" height="380" fill="${KE}"/>${shell(770, 760, 100, CR)}<rect x="1040" y="540" width="480" height="380" fill="#fff"/>${[60, 36, 20, 12].map((s, i) => shell(1110 + i * 110, 760, s, SG, Math.max(2, s * 0.09))).join("")}${T(1060, 880, 18, "Minimum size: 12 mm", { f: SG, w: 700 })}`;
  }
  if (k === "palette") {
    o = `<rect width="${w}" height="${h}" fill="#fff"/>`;
    [[SG, "Sea green", "#0F3B3A"], [CR, "Cream", "#F2EBDD"], [CO, "Coral", "#E2725B"], [KE, "Kelp", "#5C7A4A"]].forEach(([c, n, hx], i) => { o += `<rect x="${80 + i * 200}" y="80" width="180" height="560" fill="${c}" stroke="#ddd"/>${T(96 + i * 200, 610, 20, n, { f: i === 1 ? SG : "#fff", w: 700 })}${T(96 + i * 200, 635, 16, hx, { f: i === 1 ? SG : "#fff" })}`; });
    o += `${T(940, 220, 150, "Aa", { serif: 1, f: SG })}${T(940, 280, 22, "Display serif — names & headlines", { f: "#555" })}${T(940, 470, 120, "Aa", { f: SG, w: 700 })}${T(940, 520, 22, "Humanist sans — product information", { f: "#555" })}`;
    o += `${T(80, 760, 64, "From the tide to the table.", { serif: 1, f: SG, it: 1 })}${lines(80, 820, 900, 4, 22, "#C9C2B4", 6)}`;
  }
  if (k === "tins") { o = `<rect width="${w}" height="${h}" fill="#DCE3DC"/><rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="#C9D2C9"/>` + tin(120, 360, 420, 260, "NATIVE") + tin(590, 360, 420, 260, "ROCK", KE) + tin(1060, 360, 420, 260, "SMOKED", "#7A3B2A"); }
  if (k === "print") {
    o = `<rect width="${w}" height="${h}" fill="#BFA98A"/><g filter="url(#sh)"><rect x="160" y="120" width="560" height="780" fill="${CR}"/>${shell(440, 290, 80, SG)}${T(440, 360, 34, "SALTMARSH", { serif: 1, f: SG, a: "middle", ls: 6 })}${T(440, 420, 18, "TODAY'S OYSTERS", { f: CO, a: "middle", w: 700, ls: 4 })}`;
    [["Native, half dozen", "18"], ["Rock, half dozen", "14"], ["Smoked tin, 120 g", "9"], ["Shucking class", "25"]].forEach(([n, p], i) => { o += `${T(220, 500 + i * 70, 24, n, { serif: 1, f: SG })}${T(660, 500 + i * 70, 24, p, { f: SG, a: "end", w: 700 })}<path d="M220 ${515 + i * 70} H660" stroke="${SG}" stroke-opacity=".2"/>`; });
    o += `</g><g filter="url(#sh)"><path d="M900 300 h480 l40 600 h-560z" fill="${SG}"/><path d="M1020 300 q120 -160 240 0" fill="none" stroke="${SG}" stroke-width="24"/>${shell(1140, 620, 110, CR)}${T(1140, 720, 30, "SALTMARSH", { serif: 1, f: CR, a: "middle", ls: 6 })}</g>`;
  }
  if (k === "sketch") {
    o = `<rect width="${w}" height="${h}" fill="#F7F4EC"/>${Array.from({ length: 30 }, (_, i) => `<path d="M0 ${i * 34} H${w}" stroke="#B7C7D6" stroke-opacity=".5"/>`).join("")}`;
    for (let i = 0; i < 6; i++) { const cx = 220 + (i % 3) * 480, cy = 300 + Math.floor(i / 3) * 400; o += `<g stroke="#555" fill="none" stroke-width="3" stroke-linecap="round" opacity=".8">${Array.from({ length: 3 + i % 3 }, (_, j) => `<path d="M${cx - 120 + j * 22} ${cy} A${120 - j * 22} ${110 - j * 20 + i * 4} 0 0 1 ${cx + 120 - j * 22} ${cy}"/>`).join("")}<path d="M${cx - 140} ${cy + 14} q 140 ${10 + i * 3} 280 0"/></g>${T(cx, cy + 90, 22, ["tide gauge?", "5 arcs ✓", "too busy", "stamp test", "+ wordmark", "lighthouse →"][i], { serif: 1, it: 1, f: "#666", a: "middle" })}`; }
  }
  if (k === "rejected") {
    o = `<rect width="${w}" height="${h}" fill="#E9E6DE"/><g opacity=".75"><rect x="420" y="160" width="760" height="680" fill="#24324A"/><path d="M800 260 l50 300 h-100z" fill="#F2EBDD"/><rect x="760" y="230" width="80" height="40" fill="#E9B949"/><path d="M800 250 L560 380 M800 250 L1040 380" stroke="#E9B949" stroke-width="10" opacity=".7"/>${T(800, 700, 54, "SALTMARSH", { serif: 1, f: "#F2EBDD", a: "middle", ls: 8 })}</g><path d="M400 140 L1200 860 M1200 140 L400 860" stroke="${CO}" stroke-width="16" stroke-linecap="round"/><rect x="560" y="880" width="480" height="70" rx="35" fill="${CO}"/>${T(800, 926, 30, "REJECTED DIRECTION", { f: "#fff", a: "middle", w: 700, ls: 4 })}`;
  }
  return svg(w, h, o, shadow("sh"));
}

// ---------- Lumen ----------
const YE = "#F5D90A", MA = "#E0457B", CY = "#3FC5E8";
function lumenPoster(w, h, beam = YE, ang = 18, strand = "COMPETITION") {
  const id = `b${Math.round(ang * 10)}${beam.slice(1)}`;
  let o = `<rect width="${w}" height="${h}" fill="#111"/><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${beam}" stop-opacity="0"/><stop offset=".5" stop-color="${beam}" stop-opacity=".55"/><stop offset="1" stop-color="${beam}" stop-opacity="0"/></linearGradient></defs>`;
  const fs = w * 0.36;
  ["LU", "MEN"].forEach((t, i) => { o += T(w * 0.06, h * 0.33 + i * fs * 0.86, fs, t, { f: YE, w: 900, ls: -w * 0.01 }); });
  for (let i = 0; i < 3; i++) o += `<g transform="rotate(${-ang} ${w / 2} ${h / 2})"><rect x="${-w}" y="${h * (0.25 + i * 0.18)}" width="${w * 3}" height="${h * 0.06}" fill="url(#${id})"/><rect x="${-w}" y="${h * (0.28 + i * 0.18)}" width="${w * 3}" height="${h * 0.012}" fill="#111"/></g>`;
  o += `${T(w * 0.06, h * 0.84, w * 0.05, "FILM FESTIVAL 2026", { f: "#fff", w: 700, ls: 2 })}${T(w * 0.06, h * 0.9, w * 0.032, `12–21 JUNE · ${strand}`, { f: beam, w: 700, ls: 3 })}`;
  return o;
}
export function lumenLead(w = 1200, h = 1500) { return svg(w, h, lumenPoster(w, h)); }
export function lumenSeq(k, w = 1600, h = 1000) {
  let o = "";
  if (k === "posters") { o = `<rect width="${w}" height="${h}" fill="#2A2A2E"/><rect y="${h * 0.85}" width="${w}" height="${h * 0.15}" fill="#1C1C1F"/>`; [[YE, 18, "COMPETITION"], [MA, 30, "SHORTS"], [CY, 8, "RETROSPECTIVE"]].forEach(([c, a, s], i) => { o += `<g transform="translate(${130 + i * 470} 110)" filter="url(#sh)"><svg width="400" height="560" viewBox="0 0 400 560">${lumenPoster(400, 560, c, a, s)}</svg></g>`; }); }
  if (k === "social") { o = `<rect width="${w}" height="${h}" fill="#F1F1F1"/>`; [[YE, 18], [MA, 30], [CY, 8]].forEach(([c, a], i) => { o += `<g transform="translate(${120 + i * 300} 120)" filter="url(#sh)"><rect width="260" height="520" rx="34" fill="#111"/><svg x="14" y="40" width="232" height="440" viewBox="0 0 232 440">${lumenPoster(232, 440, c, a, ["TONIGHT", "SHORTS", "Q&A"][i])}</svg></g>`; }); o += `<g transform="translate(1060 160)" filter="url(#sh)"><svg width="420" height="420" viewBox="0 0 420 420">${lumenPoster(420, 420, YE, 18, "TICKETS")}</svg></g>`; }
  if (k === "grid") { o = `<rect width="${w}" height="${h}" fill="#111"/><g opacity=".35"><svg x="500" y="80" width="600" height="840" viewBox="0 0 600 840">${lumenPoster(600, 840)}</svg></g>${Array.from({ length: 13 }, (_, i) => `<path d="M${500 + i * 50} 80 V920" stroke="${CY}" stroke-opacity=".5"/>`).join("")}${Array.from({ length: 16 }, (_, i) => `<path d="M${200 + i * 90} 1000 L${200 + i * 90 + 325} 0" stroke="${YE}" stroke-opacity=".6" stroke-width="2"/>`).join("")}${T(80, 120, 40, "18°", { f: YE, w: 900 })}${T(80, 160, 20, "beam grid", { f: "#ccc" })}`; }
  if (k === "sketch") { o = `<rect width="${w}" height="${h}" fill="#F7F4EC"/>`; for (let i = 0; i < 8; i++) { const x = 120 + (i % 4) * 360, y = 120 + Math.floor(i / 4) * 420; o += `<rect x="${x}" y="${y}" width="280" height="380" fill="none" stroke="#444" stroke-width="3"/>${T(x + 20, y + 120, 90, "LU", { f: "none", w: 900 }).replace('fill="none"', 'fill="none" stroke="#444" stroke-width="3"')}<path d="M${x} ${y + 260 - i * 8} L${x + 280} ${y + 160 - i * 10}" stroke="#E0457B" stroke-width="5" opacity=".7"/><path d="M${x} ${y + 300 - i * 6} L${x + 280} ${y + 210 - i * 9}" stroke="#E0457B" stroke-width="5" opacity=".5"/>${T(x + 140, y + 410, 20, ["8°", "12°", "18° ✓", "24°", "30°", "45° — no", "split", "stacked ✓"][i], { serif: 1, it: 1, f: "#666", a: "middle" })}`; } }
  return svg(w, h, o, shadow("sh"));
}

// ---------- Field Notes ----------
const PA = "#F4EFE4", IN = "#1F2A44", OC = "#D9A441", FE = "#4E6B45";
const leaf = (x, y, s, r, c = FE) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0 C 30 -60 90 -70 120 -60 C 100 -20 60 10 0 0Z" fill="${c}"/><path d="M0 0 L110 -58" stroke="${PA}" stroke-width="2"/></g>`;
function spread(w, h) {
  let o = `<g filter="url(#sh)"><rect x="${w * 0.06}" y="${h * 0.12}" width="${w * 0.88}" height="${h * 0.76}" fill="${PA}"/></g><path d="M${w / 2} ${h * 0.12} V${h * 0.88}" stroke="#000" stroke-opacity=".12" stroke-width="6"/>`;
  o += `${T(w * 0.1, h * 0.24, h * 0.065, "The quiet", { serif: 1, f: IN })}${T(w * 0.1, h * 0.31, h * 0.065, "return of", { serif: 1, f: IN })}${T(w * 0.1, h * 0.38, h * 0.065, "the meadow", { serif: 1, f: IN, it: 1 })}`;
  for (let c = 0; c < 2; c++) o += lines(w * 0.1 + c * w * 0.13, h * 0.46, w * 0.115, 14, h * 0.026, "#B9B2A3", h * 0.008);
  o += `<rect x="${w * 0.53}" y="${h * 0.16}" width="${w * 0.37}" height="${h * 0.34}" fill="#E7E0CF"/>${leaf(w * 0.6, h * 0.42, h * 0.0022, -30)}${leaf(w * 0.66, h * 0.44, h * 0.0028, -55, "#6E8B5E")}${leaf(w * 0.75, h * 0.43, h * 0.0024, -80)}${leaf(w * 0.8, h * 0.45, h * 0.002, -120, OC)}`;
  o += `${T(w * 0.54, h * 0.6, h * 0.04, "“Meadows recover", { serif: 1, f: OC, it: 1 })}${T(w * 0.54, h * 0.65, h * 0.04, "when we stop mowing.”", { serif: 1, f: OC, it: 1 })}`;
  for (let c = 0; c < 3; c++) o += lines(w * 0.54 + c * w * 0.125, h * 0.7, w * 0.11, 6, h * 0.026, "#B9B2A3", h * 0.008);
  o += T(w * 0.92, h * 0.86, h * 0.018, "FIELD NOTES · 41", { f: OC, a: "end", w: 700, ls: 2 });
  return o;
}
function cover(x, y, w, h, n = 41, illo = 0) {
  return `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PA}"/>${T(x + w * 0.08, y + h * 0.14, w * 0.13, "Field Notes", { serif: 1, f: IN })}${T(x + w * 0.08, y + h * 0.19, w * 0.035, `QUARTERLY · ISSUE ${n}`, { f: OC, w: 700, ls: 3 })}<rect x="${x + w * 0.08}" y="${y + h * 0.26}" width="${w * 0.84}" height="${h * 0.62}" fill="${["#E7E0CF", "#DCE4D3", "#EBDCC6"][illo % 3]}"/>${leaf(x + w * 0.25, y + h * 0.8, w * 0.004, -40)}${leaf(x + w * 0.45, y + h * 0.82, w * 0.005, -70, "#6E8B5E")}${leaf(x + w * 0.62, y + h * 0.8, w * 0.0045, -100, OC)}${leaf(x + w * 0.5, y + h * 0.6, w * 0.0035, -20)}</g>`;
}
export function fieldLead(w = 1200, h = 900) { return svg(w, h, `<rect width="${w}" height="${h}" fill="#C9BBA3"/>${spread(w, h)}`, shadow("sh")); }
export function fieldSeq(k, w = 1600, h = 1000) {
  let o = "";
  if (k === "cover") o = `<rect width="${w}" height="${h}" fill="#C9BBA3"/>${cover(140, 100, 400, 540, 39, 0)}${cover(600, 100, 400, 540, 40, 1)}${cover(1060, 100, 400, 540, 41, 2)}${T(800, 760, 30, "Fixed masthead, one illustration, nothing else.", { serif: 1, it: 1, f: IN, a: "middle" })}`;
  if (k === "spread") o = `<rect width="${w}" height="${h}" fill="#BCAE95"/>${spread(w, h)}`;
  if (k === "grid") { o = `<rect width="${w}" height="${h}" fill="${PA}"/>`; for (let p = 0; p < 2; p++) { const x0 = 100 + p * 720; o += `<rect x="${x0}" y="100" width="680" height="800" fill="#fff" stroke="#ddd"/>`; for (let c = 0; c < 4; c++) o += `<rect x="${x0 + 50 + c * 150}" y="150" width="${c === 3 ? 90 : 135}" height="700" fill="${c === 3 ? OC : IN}" opacity=".12"/>`; for (let b = 0; b < 40; b++) o += `<path d="M${x0 + 50} ${150 + b * 17.5} H${x0 + 630}" stroke="#E0457B" stroke-opacity=".18"/>`; } o += T(800, 960, 24, "3 body columns + caption column · 5 mm gutters · 12 pt baseline", { f: IN, a: "middle" }); }
  if (k === "sketch") { o = `<rect width="${w}" height="${h}" fill="#F7F4EC"/>`; for (let i = 0; i < 16; i++) { const x = 120 + (i % 8) * 170, y = 160 + Math.floor(i / 8) * 380; o += `<rect x="${x}" y="${y}" width="150" height="200" fill="none" stroke="#555" stroke-width="2.5"/>${i % 3 === 0 ? `<rect x="${x + 12}" y="${y + 14}" width="126" height="80" fill="none" stroke="#999" stroke-width="2"/>` : ""}${lines(x + 12, y + (i % 3 === 0 ? 110 : 20), 126, i % 3 === 0 ? 5 : 10, 16, "#AAA", 3)}${T(x + 75, y + 230, 18, `p. ${i * 2 + 2}–${i * 2 + 3}`, { serif: 1, it: 1, f: "#777", a: "middle" })}`; } }
  return svg(w, h, o, shadow("sh"));
}

// ---------- Other projects (lead images only) ----------
export function tideLead(w = 1200, h = 900) {
  const stamp = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1F3A5F" stroke-width="${r * 0.06}"/><path d="M${cx - r * 0.6} ${cy + r * 0.2} q ${r * 0.3} -${r * 0.25} ${r * 0.6} 0 t ${r * 0.6} 0" fill="none" stroke="#1F3A5F" stroke-width="${r * 0.08}"/><path d="M${cx} ${cy + r * 0.05} V${cy - r * 0.6}" stroke="#1F3A5F" stroke-width="${r * 0.06}"/>${[0, 1, 2].map((i) => `<ellipse cx="${cx - r * 0.12}" cy="${cy - r * 0.2 - i * r * 0.16}" rx="${r * 0.1}" ry="${r * 0.05}" transform="rotate(-30 ${cx - r * 0.12} ${cy - r * 0.2 - i * r * 0.16})" fill="#1F3A5F"/><ellipse cx="${cx + r * 0.12}" cy="${cy - r * 0.2 - i * r * 0.16}" rx="${r * 0.1}" ry="${r * 0.05}" transform="rotate(30 ${cx + r * 0.12} ${cy - r * 0.2 - i * r * 0.16})" fill="#1F3A5F"/>`).join("")}`;
  let o = `<rect width="${w}" height="${h}" fill="#E8DFD1"/><rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="#CFC2AE"/>`;
  o += `<g filter="url(#sh)"><path d="M140 180 h260 l20 520 h-300z" fill="#C49A6C"/><path d="M140 180 l20 -40 h220 l20 40" fill="#B58B5E"/>${stamp(270, 420, 80)}${T(270, 560, 24, "TIDE &amp; TIMBER", { serif: 1, f: "#1F3A5F", a: "middle", ls: 3 })}</g>`;
  o += `<g filter="url(#sh)"><path d="M480 260 h220 l16 440 h-252z" fill="#D2AC7F"/>${stamp(590, 450, 64)}</g><g filter="url(#sh)"><rect x="780" y="440" width="320" height="260" fill="#F4EEE4"/><rect x="780" y="440" width="320" height="60" fill="#1F3A5F"/>${T(940, 480, 22, "MORNING BAKE", { f: "#F4EEE4", a: "middle", w: 700, ls: 3 })}${stamp(940, 600, 60)}</g>`;
  return svg(w, h, o, shadow("sh"));
}
export function orbitLead(w = 1200, h = 900) {
  let o = `<rect width="${w}" height="${h}" fill="#E6F2F1"/><g filter="url(#sh)"><rect x="160" y="110" width="340" height="680" rx="44" fill="#111"/><rect x="178" y="150" width="304" height="600" rx="10" fill="#F4F7F6"/>`;
  for (let i = 0; i < 8; i++) o += `<path d="M178 ${200 + i * 70} H482" stroke="#D5E3E1" stroke-width="10"/><path d="M${200 + i * 36} 150 V750" stroke="#D5E3E1" stroke-width="8"/>`;
  o += [[260, 300], [400, 420], [300, 560]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="26" fill="${i === 1 ? "#F27A1A" : "#0E8A86"}"/>${T(x, y + 8, 22, i === 1 ? "3" : "7", { f: "#fff", a: "middle", w: 700 })}`).join("");
  o += `<rect x="198" y="640" width="264" height="90" rx="16" fill="#0E8A86"/>${T(330, 695, 26, "Unlock bike", { f: "#fff", a: "middle", w: 700 })}</g>`;
  o += `<g filter="url(#sh)"><rect x="660" y="140" width="380" height="520" rx="20" fill="#0E8A86"/><rect x="845" y="660" width="20" height="160" fill="#555"/>${T(700, 250, 64, "orbit", { f: "#fff", w: 800 })}<circle cx="850" cy="420" r="90" fill="#F27A1A"/><g stroke="#fff" stroke-width="10" fill="none"><circle cx="810" cy="440" r="26"/><circle cx="890" cy="440" r="26"/><path d="M810 440 L840 395 H875 L890 440 M840 395 L860 440"/></g>${T(700, 600, 30, "12 bikes · 4 docks", { f: "#E6F2F1", w: 700 })}</g>`;
  return svg(w, h, o, shadow("sh"));
}
export function verdantLead(w = 1200, h = 1500) {
  let o = `<rect width="${w}" height="${h}" fill="#1E2B22"/><circle cx="${w / 2}" cy="${h * 0.42}" r="${w * 0.4}" fill="#2B3D30"/><g filter="url(#sh)"><rect x="${w * 0.44}" y="${h * 0.12}" width="${w * 0.12}" height="${h * 0.14}" rx="10" fill="#9DB8A3" opacity=".9"/><rect x="${w * 0.42}" y="${h * 0.08}" width="${w * 0.16}" height="${h * 0.06}" rx="8" fill="#C9A653"/><path d="M${w * 0.44} ${h * 0.26} C ${w * 0.3} ${h * 0.32} ${w * 0.28} ${h * 0.4} ${w * 0.28} ${h * 0.5} V${h * 0.86} Q ${w * 0.28} ${h * 0.9} ${w * 0.33} ${h * 0.9} H${w * 0.67} Q ${w * 0.72} ${h * 0.9} ${w * 0.72} ${h * 0.86} V${h * 0.5} C ${w * 0.72} ${h * 0.4} ${w * 0.7} ${h * 0.32} ${w * 0.56} ${h * 0.26}Z" fill="#B9D1BE" opacity=".55"/>`;
  o += `<rect x="${w * 0.31}" y="${h * 0.5}" width="${w * 0.38}" height="${h * 0.3}" fill="#F2EAD7"/><rect x="${w * 0.33}" y="${h * 0.515}" width="${w * 0.34}" height="${h * 0.27}" fill="none" stroke="#C9A653" stroke-width="3"/>${T(w / 2, h * 0.58, w * 0.07, "VERDANT", { serif: 1, f: "#1E2B22", a: "middle", ls: 6 })}${T(w / 2, h * 0.61, w * 0.022, "SMALL BATCH GIN · AUTUMN", { f: "#7A6A3A", a: "middle", w: 700, ls: 4 })}`;
  for (let i = 0; i < 7; i++) o += `<g transform="translate(${w / 2} ${h * 0.73}) rotate(${-60 + i * 20})"><path d="M0 0 C 10 -40 30 -70 0 -110 C -30 -70 -10 -40 0 0Z" fill="${i % 2 ? "#3D6B3A" : "#C9A653"}"/></g>`;
  o += `</g>`;
  return svg(w, h, o, shadow("sh"));
}
export function readingLead(w = 1600, h = 900) {
  let o = `<rect width="${w}" height="${h}" fill="#D9D3C7"/>`;
  [["R", "#C2412D", "#F4EDE1"], ["E", "#2747A6", "#F4EDE1"], ["A", "#F4EDE1", "#C2412D"], ["D", "#1D1D1D", "#F2C14E"]].forEach(([l, bg, fg], i) => {
    const x = 90 + i * 370; o += `<g filter="url(#sh)"><rect x="${x}" y="120" width="330" height="620" fill="${bg}"/>${T(x + 165, 560, 420, l, { serif: 1, f: fg, a: "middle" })}${T(x + 30, 700, 22, ["READING SEASON", "ALL BRANCHES", "FREE ENTRY", "OCT–DEC"][i], { f: fg, w: 700, ls: 3 })}</g>`;
  });
  return svg(w, h, o, shadow("sh"));
}
export function calderLead(w = 1200, h = 900) {
  let o = `<rect width="${w}" height="${h}" fill="#F3EEE3"/>${T(80, 520, 460, "Aa", { f: "#1D1D1D", w: 800, ls: -10 })}`;
  o += `${T(700, 160, 30, "CALDER GROTESK", { f: "#C2502F", w: 700, ls: 4 })}${T(700, 200, 18, "Specimen · Regular, Medium, Bold", { f: "#555" })}`;
  ["ABCDEFGHIJKLM", "NOPQRSTUVWXYZ", "abcdefghijklm", "nopqrstuvwxyz", "0123456789 &amp;!?"].forEach((s, i) => { o += T(700, 290 + i * 60, 40, s, { f: "#1D1D1D", w: i < 2 ? 700 : 400 }); });
  o += `<path d="M80 600 H1120" stroke="#C2502F" stroke-width="3"/>${T(80, 680, 54, "Net wt. 120 g · Best before 06/27", { f: "#1D1D1D", w: 500 })}${T(80, 760, 24, "Built for small sizes on packaging information panels.", { f: "#666" })}`;
  return svg(w, h, o);
}

export function portrait(w = 900, h = 1100) {
  let o = `<rect width="${w}" height="${h}" fill="#E7E1D6"/><rect x="${w * 0.55}" y="0" width="${w * 0.45}" height="${h}" fill="#DAD2C4"/><rect x="${w * 0.6}" y="${h * 0.12}" width="${w * 0.3}" height="${h * 0.22}" fill="#C2502F" opacity=".85"/><rect x="${w * 0.64}" y="${h * 0.38}" width="${w * 0.22}" height="${h * 0.16}" fill="#2747A6" opacity=".8"/>`;
  o += `<path d="M${w * 0.18} ${h} Q ${w * 0.2} ${h * 0.66} ${w * 0.42} ${h * 0.62} Q ${w * 0.64} ${h * 0.66} ${w * 0.68} ${h}Z" fill="#2E2A27"/><rect x="${w * 0.38}" y="${h * 0.5}" width="${w * 0.09}" height="${h * 0.14}" fill="#B98563"/><ellipse cx="${w * 0.425}" cy="${h * 0.4}" rx="${w * 0.13}" ry="${h * 0.14}" fill="#C8936F"/><path d="M${w * 0.29} ${h * 0.42} Q ${w * 0.27} ${h * 0.22} ${w * 0.43} ${h * 0.22} Q ${w * 0.6} ${h * 0.22} ${w * 0.57} ${h * 0.44} Q ${w * 0.58} ${h * 0.56} ${w * 0.62} ${h * 0.62} Q ${w * 0.52} ${h * 0.6} ${w * 0.53} ${h * 0.38} Q ${w * 0.47} ${h * 0.3} ${w * 0.36} ${h * 0.33} Q ${w * 0.32} ${h * 0.5} ${w * 0.25} ${h * 0.6} Q ${w * 0.3} ${h * 0.5} ${w * 0.29} ${h * 0.42}Z" fill="#3A2418"/>`;
  o += `<path d="M${w * 0.39} ${h * 0.45} q ${w * 0.035} ${h * 0.02} ${w * 0.07} 0" stroke="#8E4E36" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${w * 0.385}" cy="${h * 0.385}" r="6" fill="#2A1A12"/><circle cx="${w * 0.465}" cy="${h * 0.385}" r="6" fill="#2A1A12"/>`;
  o += `<rect x="${w * 0.08}" y="${h * 0.8}" width="${w * 0.26}" height="${h * 0.04}" fill="#8A6A4A"/><rect x="${w * 0.1}" y="${h * 0.72}" width="${w * 0.04}" height="${h * 0.08}" fill="#C2502F"/><rect x="${w * 0.15}" y="${h * 0.7}" width="${w * 0.04}" height="${h * 0.1}" fill="#3D6B3A"/><rect x="${w * 0.2}" y="${h * 0.73}" width="${w * 0.05}" height="${h * 0.07}" fill="#F2C14E"/>`;
  return svg(w, h, o);
}

export const LEADS = { "saltmarsh-oyster-co": saltmarshLead, "lumen-film-festival": lumenLead, "field-notes-quarterly": fieldLead, "tide-and-timber-bakery": tideLead, "orbit-bike-share": orbitLead, "verdant-gin": verdantLead, "reading-season": readingLead, "calder-grotesk": calderLead };
export const SEQS = { "saltmarsh-oyster-co": saltmarshSeq, "lumen-film-festival": lumenSeq, "field-notes-quarterly": fieldSeq };
