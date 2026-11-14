// Original SVG renderings used in place of architectural photography (no licensed photos are bundled).
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label, defs = "") => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;
  const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
  const tree = (x, y, r, c = "#3F6B3A") => `<rect x="${x - r * 0.08}" y="${y}" width="${r * 0.16}" height="${r * 0.9}" fill="#5B4636"/><circle cx="${x}" cy="${y - r * 0.2}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.45}" r="${r * 0.55}" fill="#fff" opacity=".1"/>`;
  const person = (x, y, s, shirt, skin = "#C68B59", hair = "#2B1D14") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-7" y="-2" width="14" height="22" rx="6" fill="${shirt}"/><rect x="-6" y="18" width="5" height="16" rx="2" fill="#334155"/><rect x="1" y="18" width="5" height="16" rx="2" fill="#334155"/><circle cy="-10" r="7" fill="${skin}"/><path d="M-7 -11 a7 7 0 0 1 14 0 q-7 -4 -14 0z" fill="${hair}"/></g>`;

  // ---------- Hero: elevated golden-hour view of the community ----------
  function house(x, y, s, c) {
    const [wall, roof, trim] = c;
    return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-50" width="120" height="50" fill="${wall}"/><path d="M-70 -48 L0 -96 L70 -48Z" fill="${roof}"/><rect x="-46" y="-36" width="16" height="16" fill="#FDE68A" stroke="${trim}" stroke-width="3"/><rect x="30" y="-36" width="16" height="16" fill="#FDE68A" stroke="${trim}" stroke-width="3"/><rect x="-8" y="-30" width="16" height="30" fill="${trim}"/><rect x="62" y="-34" width="44" height="34" fill="${wall}" opacity=".92"/><path d="M58 -32 L84 -52 L110 -32Z" fill="${roof}"/><rect x="68" y="-22" width="32" height="22" fill="#E2E8F0"/><path d="M-60 0 H106" stroke="#000" stroke-opacity=".15" stroke-width="3"/></g>`;
  }
  const PAL = [["#F5F0E6", "#475569", "#1E293B"], ["#E7EEF5", "#334155", "#0F172A"], ["#EADFCF", "#6B4E3D", "#3F2E22"], ["#DCE5DA", "#3F4F45", "#1F2D24"], ["#F1EAE0", "#1E293B", "#7C2D12"], ["#E8E4F0", "#4B5563", "#1E293B"]];
  function hero() {
    const q = rng(11), g = id("sky"), sun = id("sun"), lawn = id("lawn");
    const defs = lin(g, [[0, "#F8C9A0"], [0.55, "#FCE3B8"], [1, "#FFF1D6"]]) + `<radialGradient id="${sun}" cx=".72" cy=".2" r=".45"><stop offset="0" stop-color="#FFF7D6"/><stop offset="1" stop-color="#FFF7D6" stop-opacity="0"/></radialGradient>` + lin(lawn, [[0, "#9DB66E"], [1, "#5E8A3E"]]);
    let o = `<rect width="1600" height="900" fill="url(#${g})"/><rect width="1600" height="900" fill="url(#${sun})"/>`;
    o += `<path d="M0 140 Q 300 90 620 130 T 1200 110 T 1600 130 V 230 H0Z" fill="#9AA88A" opacity=".7"/><path d="M0 180 Q 400 140 800 175 T 1600 165 V 250 H0Z" fill="#7F9A68"/>`;
    for (let i = 0; i < 40; i++) o += `<circle cx="${q() * 1600}" cy="${185 + q() * 30}" r="${10 + q() * 12}" fill="#58784A" opacity=".85"/>`;
    o += `<rect y="210" width="1600" height="690" fill="url(#${lawn})"/>`;
    // green space and pond
    o += `<ellipse cx="1260" cy="300" rx="320" ry="64" fill="#6E9A4C"/><ellipse cx="1300" cy="305" rx="120" ry="24" fill="#7DB4D8"/><path d="M940 318 C 1080 280 1180 350 1440 310" stroke="#E7D9B8" stroke-width="6" fill="none"/>`;
    // streets (perspective)
    const rows = [[240, 0.36, 13], [380, 0.56, 9], [560, 0.85, 6], [800, 1.25, 5]];
    rows.forEach(([y, s], r) => { o += `<path d="M0 ${y + 14 * s} L1600 ${y + 8 * s}" stroke="#D6D3CC" stroke-width="${30 * s}"/><path d="M0 ${y + 14 * s} L1600 ${y + 8 * s}" stroke="#fff" stroke-opacity=".6" stroke-width="${2 * s}" stroke-dasharray="${24 * s} ${18 * s}"/>`; if (r) o += `<path d="M0 ${y + 32 * s} L1600 ${y + 26 * s}" stroke="#EFEBE2" stroke-width="${8 * s}"/>`; });
    o += `<path d="M760 210 L 670 900" stroke="#D6D3CC" stroke-width="54"/><path d="M760 210 L 670 900" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-dasharray="26 20"/>`;
    rows.forEach(([y, s, n], r) => {
      const step = 1600 / n;
      for (let i = 0; i < n; i++) {
        const x = step * i + step / 2 + (r % 2 ? step / 3 : 0) - 60;
        if (Math.abs(x - 740) < 110 * s) continue;
        if (r === 0 && x > 1000 && x < 1500) continue;
        o += house(x, y - 4 * s, s * 0.9, PAL[(i + r * 2) % PAL.length]);
        o += tree(x + 95 * s, y - 2 * s, 22 * s, ["#3F6B3A", "#4E7A3A", "#5C8A45"][i % 3]);
      }
    });
    // people strolling on the sidewalks
    [[260, 836, 1.6, "#1D4ED8"], [292, 838, 1.3, "#F59E0B"], [318, 842, 1, "#059669"], [1030, 600, 1.1, "#DC2626"], [1054, 601, 1.1, "#1E293B"], [520, 410, 0.8, "#7C3AED"], [1180, 345, 0.6, "#0EA5E9"], [1200, 345, 0.6, "#F97316"]].forEach(([x, y, s, c]) => { o += person(x, y, s, c); });
    o += `<rect width="1600" height="900" fill="#F59E0B" opacity=".08"/>`;
    return svg("0 0 1600 900", o, "Elevated golden-hour rendering of Ridgeline at Cedar Creek: homes along tree-lined streets, a green space with a pond, and families walking", defs);
  }

  // ---------- Exterior renderings for floor plans ----------
  const STYLES = {
    craftsman: { w: 520, st: 1, wall: "#8A9A7B", roof: "#4B3B2F", trim: "#F5F0E6", stone: "#9C8C78", door: "#7C2D12", label: "Craftsman-style single-story exterior rendering" },
    farmhouse: { w: 440, st: 2, wall: "#F8FAFC", roof: "#1F2937", trim: "#111827", stone: null, door: "#111827", porchRoof: "#475569", label: "Modern farmhouse two-story exterior rendering" },
    transitional: { w: 470, st: 2, wall: "#CBD5E1", roof: "#334155", trim: "#F8FAFC", stone: "#A8A29E", door: "#1E3A8A", hip: true, label: "Transitional two-story exterior rendering" },
    estate: { w: 540, st: 2, wall: "#B45F3E", roof: "#292524", trim: "#F5F5F4", stone: "#A8A29E", door: "#1C1917", garages: 3, label: "Estate-style two-story brick and stone exterior rendering" },
  };
  function exterior(kind) {
    const k = STYLES[kind], sky = id("sk"), cx = 400, base = 380, fh = 92, H = fh * k.st, L = cx - k.w / 2;
    let o = `<rect width="800" height="500" fill="url(#${sky})"/><rect y="300" width="800" height="200" fill="#7FA35B"/><path d="M0 300 Q 200 280 400 296 T 800 290 V 320 H0Z" fill="#6B8F4A"/>`;
    o += tree(70, 320, 70, "#4E7A3A") + tree(740, 310, 80, "#3F6B3A") + tree(150, 335, 44, "#5C8A45");
    const gw = (k.garages || 2) * 64;
    o += `<path d="M${L + k.w - gw} ${base} L${L + k.w - gw - 70} 500 H${L + k.w + 60} L${L + k.w} ${base}Z" fill="#D6D3D1"/>`;
    o += `<rect x="${L}" y="${base - H}" width="${k.w}" height="${H}" fill="${k.wall}"/>`;
    if (kind === "farmhouse") for (let x = L + 10; x < L + k.w; x += 14) o += `<path d="M${x} ${base - H} V${base}" stroke="#E2E8F0" stroke-width="2"/>`;
    if (kind === "estate") for (let y = base - H + 8; y < base; y += 10) o += `<path d="M${L} ${y} H${L + k.w}" stroke="#8C4A30" stroke-width="1.2" opacity=".6"/>`;
    if (k.stone) o += `<rect x="${L}" y="${base - 34}" width="${k.w * (kind === "estate" ? 0.38 : 1)}" height="34" fill="${k.stone}"/><path d="M${L} ${base - 22} H${L + k.w * (kind === "estate" ? 0.38 : 1)} M${L} ${base - 11} H${L + k.w * (kind === "estate" ? 0.38 : 1)}" stroke="#78716C" stroke-width="1.5" stroke-dasharray="14 6"/>`;
    // roof
    const rt = base - H;
    if (k.hip) o += `<path d="M${L - 20} ${rt} L${L + 80} ${rt - 70} H${L + k.w - 80} L${L + k.w + 20} ${rt}Z" fill="${k.roof}"/>`;
    else if (k.st === 1) o += `<path d="M${L - 26} ${rt} L${cx} ${rt - 86} L${L + k.w + 26} ${rt}Z" fill="${k.roof}"/><path d="M${cx - 110} ${rt + 2} L${cx} ${rt - 50} L${cx + 110} ${rt + 2}Z" fill="${k.trim}" opacity=".9"/><path d="M${cx - 96} ${rt} L${cx} ${rt - 44} L${cx + 96} ${rt}Z" fill="${k.wall}"/>`;
    else o += `<path d="M${L - 18} ${rt} L${L + k.w * 0.3} ${rt - 90} L${L + k.w * 0.6} ${rt}Z" fill="${k.roof}"/><path d="M${L + k.w * 0.45} ${rt} L${L + k.w * 0.75} ${rt - 70} L${L + k.w + 18} ${rt}Z" fill="${k.roof}"/>`;
    if (kind === "estate") o += `<path d="M${L + 40} ${rt + 2} L${L + k.w * 0.3} ${rt - 60} L${L + k.w * 0.6 - 40} ${rt + 2}Z" fill="${k.stone}"/>`;
    // windows
    const win = (x, y, w = 44, h = 54) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#FDE9B5" stroke="${k.trim}" stroke-width="5"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${k.trim}" stroke-width="3"/>`;
    const usable = k.w - gw - 30;
    for (let s = 0; s < k.st; s++) {
      const y = base - fh * (s + 1) + 22;
      for (let i = 0; i < 3; i++) o += win(L + 20 + i * (usable / 3), y);
      if (s > 0) for (let i = 0; i < (k.garages || 2); i++) o += win(L + k.w - gw + 10 + i * 64, y, 40, 48);
    }
    // garage doors
    for (let i = 0; i < (k.garages || 2); i++) o += `<rect x="${L + k.w - gw + 6 + i * 64}" y="${base - 66}" width="54" height="66" fill="#E7E5E4" stroke="${k.trim}" stroke-width="4"/>${[1, 2, 3].map((r) => `<path d="M${L + k.w - gw + 8 + i * 64} ${base - 66 + r * 16} h50" stroke="#A8A29E"/>`).join("")}`;
    // door + porch
    const dx = L + usable / 2 + 8;
    o += `<rect x="${dx}" y="${base - 66}" width="34" height="66" fill="${k.door}"/><circle cx="${dx + 27}" cy="${base - 32}" r="2.5" fill="#FBBF24"/>`;
    if (k.st === 1 || k.porchRoof) {
      o += `<path d="M${L - 6} ${base - 78} H${L + usable + 14} L${L + usable} ${base - 92} H${L + 8}Z" fill="${k.porchRoof || k.roof}"/>`;
      [L + 4, L + usable * 0.33, L + usable * 0.66, L + usable].forEach((x) => { o += `<path d="M${x} ${base - 78} V${base}" stroke="${k.trim}" stroke-width="${k.st === 1 ? 10 : 6}"/>`; });
    }
    o += `<rect x="${L - 10}" y="${base}" width="${k.w + 20}" height="8" fill="#A8A29E"/>`;
    for (let i = 0; i < 9; i++) o += `<circle cx="${L + 10 + i * (usable / 8)}" cy="${base + 6}" r="12" fill="#4E7A3A"/>`;
    o += `<rect width="800" height="500" fill="#F59E0B" opacity=".06"/>`;
    return svg("0 0 800 500", o, k.label, lin(sky, [[0, "#9CC5EB"], [1, "#F4E6CC"]]));
  }

  // ---------- Interiors ----------
  function roomShell(wall, floor, side) {
    return `<rect width="800" height="560" fill="${wall}"/><path d="M0 0 L120 70 V420 L0 560Z" fill="${side}"/><path d="M800 0 L680 70 V420 L800 560Z" fill="${side}"/><path d="M0 560 L120 420 H680 L800 560Z" fill="${floor}"/><path d="M120 70 H680 M0 0 L120 70 M800 0 L680 70" stroke="#000" stroke-opacity=".06" stroke-width="2"/>`;
  }
  const windowWall = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#BFDDF2"/><rect x="${x}" y="${y + h * 0.65}" width="${w}" height="${h * 0.35}" fill="#8DB86B"/>${tree(x + w * 0.3, y + h * 0.7, 40, "#4E7A3A")}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#1E293B" stroke-width="6"/>${[1, 2].map((i) => `<path d="M${x + (w * i) / 3} ${y} V${y + h}" stroke="#1E293B" stroke-width="4"/>`).join("")}`;
  function great() {
    let o = roomShell("#EEE8DF", "#B08A64", "#E4DCD0");
    for (let i = 0; i < 6; i++) o += `<path d="M0 ${560 - i * 4} L120 420" stroke="#9C7754" opacity=".0"/>`;
    for (let i = 1; i < 10; i++) o += `<path d="M${120 + i * 56} 420 L${-40 + i * 98} 560" stroke="#9C7754" stroke-width="1.5"/>`;
    o += `<path d="M120 70 L400 20 L680 70" stroke="#7C5A3C" stroke-width="14" fill="none"/>`;
    o += windowWall(160, 120, 220, 220) + `<rect x="430" y="140" width="190" height="280" fill="#D6D3D1"/><rect x="470" y="300" width="110" height="80" fill="#1C1917"/><path d="M490 370 q 30 -50 70 0" fill="#F59E0B"/><rect x="420" y="290" width="210" height="14" fill="#78716C"/><rect x="470" y="180" width="110" height="80" fill="#1E293B"/>`;
    o += `<ellipse cx="400" cy="480" rx="260" ry="46" fill="#D9CBB4"/><path d="M190 400 h300 a16 16 0 0 1 16 16 v54 h-332 v-54 a16 16 0 0 1 16 -16z" fill="#F1F5F9"/><rect x="174" y="440" width="332" height="40" rx="10" fill="#E2E8F0"/><rect x="210" y="404" width="60" height="40" rx="8" fill="#1D4ED8" opacity=".75"/><rect x="420" y="404" width="60" height="40" rx="8" fill="#F59E0B" opacity=".8"/><rect x="330" y="478" width="160" height="22" rx="4" fill="#7C5A3C"/>`;
    o += `<path d="M580 470 q -10 -80 30 -110 q 40 30 30 110z" fill="#4E7A3A"/><rect x="590" y="460" width="40" height="40" rx="6" fill="#E7E5E4"/>`;
    return o;
  }
  function kitchen() {
    let o = roomShell("#F4F1EC", "#C9B79C", "#E8E2D8");
    o += `<rect x="140" y="100" width="520" height="90" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${150 + i * 102}" y="108" width="94" height="74" fill="#F1F5F9" stroke="#CBD5E1"/>`).join("")}`;
    o += `<rect x="140" y="190" width="520" height="70" fill="#E5E7EB"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${140 + i * 65}" y="190" width="65" height="70" fill="none" stroke="#fff" stroke-opacity=".7"/>`).join("")}`;
    o += `<path d="M350 120 h100 l20 70 h-140z" fill="#94A3B8"/><rect x="140" y="260" width="520" height="16" fill="#F8FAFC"/><rect x="140" y="276" width="520" height="110" fill="#1E293B"/><rect x="340" y="282" width="120" height="96" fill="#9CA3AF"/>`;
    o += `<rect x="190" y="370" width="420" height="22" fill="#F8FAFC"/><rect x="190" y="392" width="420" height="96" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/><rect x="190" y="370" width="22" height="118" fill="#F1F5F9"/><rect x="588" y="370" width="22" height="118" fill="#F1F5F9"/>`;
    [260, 400, 540].forEach((x) => { o += `<path d="M${x} 0 V180" stroke="#1E293B" stroke-width="2"/><path d="M${x - 22} 210 q 22 -40 44 0z" fill="#F59E0B"/><ellipse cx="${x}" cy="212" rx="16" ry="4" fill="#FEF3C7"/>`; });
    [250, 350, 450, 550].forEach((x) => { o += `<rect x="${x - 18}" y="470" width="36" height="12" rx="4" fill="#78716C"/><path d="M${x - 12} 482 L${x - 16} 540 M${x + 12} 482 L${x + 16} 540" stroke="#1C1917" stroke-width="4"/>`; });
    o += `<path d="M560 360 q -6 -40 14 -54 q 20 14 14 54z" fill="#4E7A3A"/><rect x="226" y="346" width="70" height="24" rx="12" fill="#FDE68A"/>`;
    return o;
  }
  function bath() {
    let o = roomShell("#F5F5F4", "#D6D3D1", "#E7E5E4");
    for (let x = 120; x < 680; x += 40) o += `<path d="M${x} 70 V420" stroke="#E7E5E4" stroke-width="2"/>`;
    o += windowWall(300, 110, 200, 150) + `<path d="M260 330 h280 q0 90 -80 100 h-120 q-80 -10 -80 -100z" fill="#fff" stroke="#D6D3D1" stroke-width="3"/><path d="M520 330 v-60 q0 -16 -16 -16" stroke="#9CA3AF" stroke-width="5" fill="none"/>`;
    o += `<rect x="560" y="300" width="110" height="130" fill="#7C5A3C"/><rect x="552" y="292" width="126" height="12" fill="#F5F5F4"/><rect x="576" y="140" width="80" height="120" rx="40" fill="#CBD5E1" stroke="#A8A29E" stroke-width="4"/><rect x="140" y="300" width="100" height="130" fill="#7C5A3C"/><rect x="132" y="292" width="116" height="12" fill="#F5F5F4"/><rect x="150" y="140" width="80" height="120" rx="40" fill="#CBD5E1" stroke="#A8A29E" stroke-width="4"/>`;
    o += `<path d="M370 480 h80 v10 h-80z" fill="#E7E5E4"/><path d="M380 300 q 6 -30 20 -10" stroke="#4E7A3A" stroke-width="4" fill="none"/>`;
    return o;
  }
  function office() {
    let o = roomShell("#E8EEF4", "#A47E58", "#DCE4EC");
    o += `<rect x="140" y="90" width="200" height="330" fill="#1E293B"/>${[0, 1, 2, 3, 4].map((r) => `<rect x="150" y="${100 + r * 64}" width="180" height="6" fill="#475569"/>${[0, 1, 2, 3, 4, 5].map((b) => `<rect x="${156 + b * 28}" y="${106 + r * 64 + (b % 2) * 8}" width="18" height="${50 - (b % 2) * 8}" fill="${["#F59E0B", "#1D4ED8", "#F8FAFC", "#059669", "#DC2626", "#CBD5E1"][(b + r) % 6]}"/>`).join("")}`).join("")}`;
    o += windowWall(400, 110, 230, 190) + `<rect x="380" y="360" width="270" height="16" fill="#7C5A3C"/><path d="M400 376 V470 M630 376 V470" stroke="#5B4636" stroke-width="8"/><rect x="470" y="300" width="90" height="56" rx="4" fill="#0F172A"/><rect x="476" y="306" width="78" height="44" fill="#3B82F6" opacity=".6"/><path d="M500 356 h30 v6 h-30z" fill="#334155"/>`;
    o += `<path d="M470 400 h80 v60 h-80z" fill="#334155"/><path d="M480 460 v50 M540 460 v50" stroke="#1E293B" stroke-width="6"/><rect x="460" y="380" width="100" height="26" rx="10" fill="#475569"/><path d="M600 340 q -6 -36 14 -48 q 20 12 14 48z" fill="#4E7A3A"/>`;
    return o;
  }
  function backyard() {
    let o = `<rect width="800" height="560" fill="#A7CBEA"/><rect y="250" width="800" height="310" fill="#7FA35B"/>`;
    for (let i = 0; i < 26; i++) o += `<rect x="${i * 32}" y="200" width="22" height="80" fill="#C8A27C"/>`;
    o += `<path d="M0 222 H800 M0 258 H800" stroke="#A47E58" stroke-width="6"/>` + tree(80, 220, 70, "#4E7A3A") + tree(720, 210, 80, "#3F6B3A");
    o += `<path d="M0 380 L800 380 L800 560 L0 560Z" fill="#CBB89D"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${i * 110} 380 L${i * 130 - 40} 560" stroke="#B4A084" stroke-width="2"/>`).join("")}`;
    o += `<rect x="200" y="420" width="240" height="14" fill="#5B4636"/><path d="M220 434 V500 M420 434 V500" stroke="#5B4636" stroke-width="10"/><circle cx="320" cy="400" r="22" fill="#F59E0B" opacity=".25"/><rect x="520" y="380" width="80" height="70" rx="6" fill="#334155"/><rect x="510" y="374" width="100" height="10" fill="#1E293B"/><rect x="140" y="450" width="60" height="40" rx="10" fill="#1D4ED8" opacity=".7"/><rect x="460" y="450" width="60" height="40" rx="10" fill="#1D4ED8" opacity=".7"/>`;
    o += `<path d="M0 300 h800" stroke="#fff" stroke-opacity=".0"/>` + `<path d="M0 0 H800 V60 H0Z" fill="#1E293B" opacity=".85"/><path d="M60 60 V380 M740 60 V380" stroke="#F8FAFC" stroke-width="16"/>`;
    return o;
  }
  function porch() {
    let o = `<rect width="800" height="560" fill="#DCE9F5"/><rect width="800" height="420" fill="#F8FAFC"/>`;
    for (let y = 0; y < 420; y += 18) o += `<path d="M0 ${y} H800" stroke="#E2E8F0" stroke-width="2"/>`;
    o += `<rect x="320" y="120" width="160" height="300" fill="#1E3A8A"/><rect x="340" y="140" width="120" height="110" fill="#BFDBFE" opacity=".7"/><circle cx="455" cy="290" r="6" fill="#FBBF24"/><rect x="300" y="100" width="200" height="20" fill="#E2E8F0"/>`;
    o += `<rect x="100" y="150" width="140" height="170" fill="#FDE9B5" stroke="#1E293B" stroke-width="8"/><rect x="560" y="150" width="140" height="170" fill="#FDE9B5" stroke="#1E293B" stroke-width="8"/><path d="M170 150 V320 M630 150 V320" stroke="#1E293B" stroke-width="4"/>`;
    o += `<rect y="420" width="800" height="140" fill="#A47E58"/>${[1, 2, 3, 4, 5, 6].map((i) => `<path d="M0 ${420 + i * 22} H800" stroke="#8C6A48" stroke-width="2"/>`).join("")}`;
    o += `<path d="M40 0 V560 M760 0 V560" stroke="#F8FAFC" stroke-width="34"/><path d="M40 0 V560 M760 0 V560" stroke="#E2E8F0" stroke-width="2"/>`;
    const rocker = (x) => `<g transform="translate(${x} 0)"><path d="M0 330 h70 v80 h-70z" fill="#1E293B" opacity=".9"/><path d="M-6 410 q 41 30 82 0" stroke="#1E293B" stroke-width="8" fill="none"/><rect x="-4" y="400" width="78" height="12" fill="#1E293B"/><rect x="6" y="380" width="58" height="20" rx="6" fill="#F59E0B" opacity=".85"/></g>`;
    o += rocker(150) + rocker(580) + `<path d="M250 420 q -10 -60 20 -80 q 30 20 20 80z" fill="#4E7A3A"/><rect x="250" y="410" width="40" height="40" fill="#78716C"/><path d="M510 420 q -10 -60 20 -80 q 30 20 20 80z" fill="#4E7A3A"/><rect x="510" y="410" width="40" height="40" fill="#78716C"/>`;
    return o;
  }
  const INTERIOR = { great: [great, "Furnished great room with vaulted beams, fireplace and large windows"], kitchen: [kitchen, "Model kitchen with waterfall quartz island, pendant lights and stools"], bath: [bath, "Primary bath with freestanding tub and double vanities"], backyard: [backyard, "Covered patio and fenced backyard"], porch: [porch, "Front porch with rocking chairs and a navy front door"], office: [office, "Home office with built-in bookshelves and a window desk"] };
  function interior(kind, label) { const [fn, l] = INTERIOR[kind]; return svg("0 0 800 560", fn(), label || l); }

  // ---------- Community collage ----------
  function pool() {
    let o = `<rect width="600" height="450" fill="#BFDBFE"/><rect y="170" width="600" height="280" fill="#E7E5E4"/><rect x="60" y="70" width="300" height="110" fill="#F5F0E6"/><path d="M40 72 L210 10 L380 72Z" fill="#334155"/>${[0, 1, 2, 3].map((i) => `<rect x="${90 + i * 66}" y="100" width="40" height="60" fill="#FDE9B5" stroke="#1E293B" stroke-width="4"/>`).join("")}`;
    o += tree(470, 160, 60, "#4E7A3A") + `<path d="M60 230 h480 q20 0 20 20 v140 q0 20 -20 20 h-480 q-20 0 -20 -20 v-140 q0 -20 20 -20z" fill="#38BDF8"/>`;
    for (let i = 0; i < 7; i++) o += `<path d="M${80 + i * 66} ${270 + (i % 3) * 36} q 16 -8 32 0" stroke="#E0F2FE" stroke-width="4" fill="none"/>`;
    [80, 200, 320].forEach((x) => { o += `<rect x="${x}" y="196" width="80" height="20" rx="6" fill="#F8FAFC"/><path d="M${x + 60} 196 l14 -16" stroke="#F8FAFC" stroke-width="8"/>`; });
    o += `<circle cx="300" cy="190" r="0"/><path d="M500 190 l0 -60 M470 130 q30 -26 60 0z" stroke="#1E293B" stroke-width="4" fill="#F59E0B"/>` + person(250, 320, 1, "#F59E0B") + person(420, 290, 0.9, "#DC2626");
    return svg("0 0 600 450", o, "Resort-style community pool and clubhouse");
  }
  function playground() {
    let o = `<rect width="600" height="450" fill="#C7E3F6"/><rect y="250" width="600" height="200" fill="#8DB86B"/><ellipse cx="300" cy="350" rx="260" ry="80" fill="#E7D2AF"/>` + tree(60, 240, 60, "#4E7A3A") + tree(560, 230, 70, "#3F6B3A");
    o += `<rect x="160" y="190" width="140" height="16" fill="#1D4ED8"/><path d="M170 206 V340 M290 206 V340" stroke="#1D4ED8" stroke-width="10"/><path d="M160 190 L230 130 L300 190Z" fill="#F59E0B"/><path d="M300 240 L420 340" stroke="#DC2626" stroke-width="22" stroke-linecap="round"/><rect x="160" y="236" width="140" height="10" fill="#1E293B"/>`;
    o += `<path d="M380 160 H520 M390 160 L370 340 M510 160 L530 340" stroke="#334155" stroke-width="8"/><path d="M430 160 V270 M460 160 V270" stroke="#64748B" stroke-width="3"/><rect x="424" y="268" width="42" height="8" fill="#1E293B"/>`;
    o += person(445, 250, 1, "#059669", "#E0AC69") + person(225, 215, 0.9, "#F97316", "#8D5524") + person(380, 330, 1, "#7C3AED", "#F1C27D", "#B45309");
    return svg("0 0 600 450", o, "Children playing on a community playground");
  }
  function trail() {
    let o = `<rect width="600" height="450" fill="#FCE7C3"/><rect y="220" width="600" height="230" fill="#7FA35B"/><path d="M260 450 C 300 360 220 300 330 220" stroke="#E7D2AF" stroke-width="70" fill="none"/>`;
    for (let i = 0; i < 9; i++) o += tree(30 + i * 70, 220 + (i % 2) * 20, 46 + (i % 3) * 10, ["#3F6B3A", "#4E7A3A", "#5C8A45"][i % 3]);
    o += person(270, 330, 1.6, "#1D4ED8", "#C68B59") + person(310, 326, 1.6, "#F59E0B", "#F1C27D", "#7C2D12");
    o += `<g transform="translate(350 380)"><rect x="0" y="0" width="40" height="18" rx="9" fill="#92400E"/><circle cx="42" cy="-2" r="10" fill="#92400E"/><path d="M4 18 v12 M34 18 v12" stroke="#92400E" stroke-width="5"/><path d="M0 4 q-10 -10 -14 -2" stroke="#92400E" stroke-width="4" fill="none"/></g><path d="M330 350 Q 350 370 380 380" stroke="#DC2626" stroke-width="2" fill="none"/>`;
    return svg("0 0 600 450", o, "Couple walking their dog on a wooded trail");
  }

  function family() {
    let o = `<rect width="240" height="240" fill="#F8FAFC"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<path d="M0 ${i * 20} H240" stroke="#E2E8F0" stroke-width="2"/>`).join("")}<rect x="150" y="40" width="60" height="140" fill="#1E3A8A"/><rect y="180" width="240" height="60" fill="#A47E58"/><path d="M20 0 V240" stroke="#fff" stroke-width="16"/>`;
    o += person(70, 140, 2.2, "#1D4ED8", "#C68B59") + person(120, 142, 2.1, "#F59E0B", "#C68B59", "#3F2E22") + person(95, 175, 1.3, "#059669", "#C68B59") + person(150, 180, 1.1, "#DC2626", "#C68B59", "#3F2E22");
    return svg("0 0 240 240", o, "The Martinez family on their front porch");
  }

  function panorama() {
    // Three rooms side by side for the model-home tour (2400 x 560)
    return `<svg viewBox="0 0 2400 560" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Panoramic walkthrough of the model home: great room, kitchen and primary suite bath"><g>${great()}</g><g transform="translate(800 0)">${kitchen()}</g><g transform="translate(1600 0)">${bath()}</g></svg>`;
  }

  window.Art = { hero, exterior, interior, pool, playground, trail, family, panorama };
})();
