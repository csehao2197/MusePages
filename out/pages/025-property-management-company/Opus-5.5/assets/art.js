// Original SVG illustrations used in place of property photography (no licensed photos are bundled).
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const svg = (vb, body, label, defs = "") => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;
  const lin = (gid, stops) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`;
  const tree = (x, y, r, c = "#4E7A3A") => `<rect x="${x - r * 0.08}" y="${y}" width="${r * 0.16}" height="${r}" fill="#5B4636"/><circle cx="${x}" cy="${y - r * 0.15}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.5}" fill="#FDE68A" opacity=".18"/>`;
  const win = (x, y, w, h, lit = true, frame = "#fff") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${lit ? "#FDE7B0" : "#A9C7DE"}" stroke="${frame}" stroke-width="4"/><path d="M${x + w / 2} ${y} V${y + h}" stroke="${frame}" stroke-width="2.5"/>`;

  function houseShape(x, base, w, h, wall, roof, opts = {}) {
    let o = `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${wall}"/>`;
    o += opts.flat ? `<rect x="${x - 8}" y="${base - h - 12}" width="${w + 16}" height="14" fill="${roof}"/>` : `<path d="M${x - 14} ${base - h} L${x + w / 2} ${base - h - w * 0.32} L${x + w + 14} ${base - h}Z" fill="${roof}"/>`;
    const rows = Math.max(1, Math.round(h / 80)), cols = Math.max(2, Math.round(w / 70));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o += win(x + 16 + c * ((w - 32) / cols), base - h + 18 + r * 76, (w - 32) / cols - 16, 40, opts.lit !== false);
    o += `<rect x="${x + w / 2 - 14}" y="${base - 48}" width="28" height="48" fill="${opts.door || "#1E3A5F"}"/>`;
    return o;
  }

  function hero() {
    const sky = id("sky");
    let o = `<rect width="1600" height="900" fill="url(#${sky})"/><circle cx="1180" cy="330" r="120" fill="#FFF3C4" opacity=".55"/><circle cx="1180" cy="330" r="60" fill="#FFF7DA"/>`;
    o += `<path d="M0 470 Q 400 420 800 460 T 1600 440 V560 H0Z" fill="#B7A27A" opacity=".6"/>`;
    // houses along the street (two sides, perspective)
    const left = [[0, 640, 300, 210, "#EADFCF", "#6B4E3D"], [330, 600, 220, 150, "#DCE5DA", "#3F4F45"], [570, 575, 160, 110, "#F1EAE0", "#475569"], [745, 562, 110, 80, "#E7EEF5", "#334155"]];
    const right = [[1300, 640, 300, 210, "#E8E4F0", "#4B5563"], [1050, 600, 220, 150, "#F5F0E6", "#7C2D12"], [870, 575, 160, 110, "#EADFCF", "#3F2E22"]];
    o += `<path d="M0 900 L700 560 H900 L1600 900Z" fill="#9CA3AF"/><path d="M800 560 L800 900" stroke="#F8FAFC" stroke-width="6" stroke-dasharray="30 26" opacity=".7"/><path d="M0 760 L640 560 M1600 760 L960 560" stroke="#E5E7EB" stroke-width="18"/>`;
    o += `<path d="M0 620 L700 556 L0 760Z" fill="#7FA35B"/><path d="M1600 620 L900 556 L1600 760Z" fill="#7FA35B"/>`;
    [...left, ...right].forEach(([x, base, w, h, wall, roof]) => { o += houseShape(x, base, w, h, wall, roof); });
    [[260, 690, 90], [560, 620, 60], [730, 580, 34], [1340, 690, 90], [1040, 620, 60], [880, 585, 34], [100, 720, 110], [1500, 720, 110]].forEach(([x, y, r]) => { o += tree(x, y, r, ["#3F6B3A", "#4E7A3A", "#5C8A45"][Math.round(x) % 3]); });
    o += `<rect width="1600" height="900" fill="#F59E0B" opacity=".1"/>`;
    return svg("0 0 1600 900", o, "Well-maintained residential street at golden hour with tree-lined lawns and family homes", lin(sky, [[0, "#F7C98B"], [0.6, "#FCE3B5"], [1, "#FFF1D6"]]));
  }

  const SKY = [["#9CC5EB", "#E8F2FA"], ["#F9D9A8", "#FFF3DE"], ["#B9D3F0", "#F1F5F9"]];
  function prop(kind, label) {
    const sky = id("ps"), [s1, s2] = SKY[kind.length % 3];
    let o = `<rect width="800" height="450" fill="url(#${sky})"/><rect y="330" width="800" height="120" fill="#86A869"/><path d="M0 400 H800" stroke="#CBD5E1" stroke-width="40"/>`;
    if (kind === "single") { o += houseShape(220, 360, 360, 170, "#F1F5F9", "#1F2937", { flat: true }) + `<rect x="430" y="230" width="150" height="130" fill="#7C5A3C"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${430 + i * 25} 230 V360" stroke="#5B4636" stroke-width="3"/>`).join("")}` + tree(120, 340, 60) + tree(690, 330, 70, "#3F6B3A"); }
    if (kind === "duplex") { o += houseShape(160, 360, 230, 170, "#FDE68A", "#7C2D12") + houseShape(410, 360, 230, 170, "#BFDBFE", "#7C2D12") + `<rect x="150" y="340" width="500" height="20" fill="#E7E5E4"/>` + tree(80, 340, 50) + tree(720, 340, 50); }
    if (kind === "suburban") { o += houseShape(180, 360, 300, 190, "#EADFCF", "#475569") + houseShape(480, 360, 170, 110, "#EADFCF", "#475569") + `<rect x="500" y="290" width="130" height="70" fill="#E7E5E4" stroke="#fff" stroke-width="4"/>` + tree(100, 340, 66, "#3F6B3A") + tree(720, 330, 60); }
    if (kind === "condo") { o += `<rect x="290" y="40" width="220" height="330" fill="#64748B"/>${Array.from({ length: 10 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<rect x="${302 + c * 42}" y="${52 + r * 31}" width="34" height="22" fill="${(r + c) % 4 ? "#BFDBFE" : "#FDE7B0"}"/>`).join("")).join("")}<rect x="140" y="160" width="140" height="210" fill="#94A3B8"/><rect x="520" y="120" width="160" height="250" fill="#475569"/>${Array.from({ length: 7 }, (_, r) => `<rect x="530" y="${132 + r * 33}" width="140" height="20" fill="#93C5FD" opacity=".6"/>`).join("")}` + tree(90, 350, 46) + tree(730, 350, 46); }
    if (kind === "multi") { o += `<rect x="120" y="150" width="560" height="210" fill="#E7D8C3"/><rect x="110" y="138" width="580" height="16" fill="#334155"/>${[0, 1].map((r) => [0, 1, 2, 3].map((c) => win(150 + c * 135, 175 + r * 95, 80, 50)).join("")).join("")}${[0, 1, 2, 3].map((c) => `<rect x="${170 + c * 135}" y="250" width="40" height="8" fill="#334155"/>`).join("")}<path d="M120 255 H680" stroke="#334155" stroke-width="4"/>` + tree(70, 345, 52) + tree(735, 345, 52); }
    if (kind === "townhome") { o += [0, 1, 2, 3].map((i) => houseShape(130 + i * 140, 360, 130, 200, ["#F1F5F9", "#E2E8F0", "#F8FAFC", "#E5E7EB"][i], "#0F172A", { flat: true, door: ["#1D4ED8", "#10B981", "#F59E0B", "#1E3A5F"][i] })).join("") + tree(80, 345, 46) + tree(730, 345, 46); }
    return svg("0 0 800 450", o, label, lin(sky, [[0, s1], [1, s2]]));
  }

  window.Art = { hero, prop };
})();
