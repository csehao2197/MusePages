// Original SVG illustrations used in place of photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  const SAGE = "#6B8C42", AMB = "#C4913E";

  const wood = (w, h, seed, base = "#8A6440") => { const q = rng(seed); let o = `<rect width="${w}" height="${h}" fill="${base}"/>`; for (let y = 0; y < h; y += 110) { o += `<rect y="${y}" width="${w}" height="106" fill="${["#93694A", "#7E5A3A", "#8C6544"][Math.floor(q() * 3)]}"/><rect y="${y + 106}" width="${w}" height="4" fill="#5E422A"/>`; for (let k = 0; k < 6; k++) { const yy = y + 10 + q() * 90; o += `<path d="M0 ${yy} C ${w * 0.3} ${yy - 8} ${w * 0.6} ${yy + 10} ${w} ${yy}" stroke="#6E4F33" stroke-width="${1 + q() * 2}" fill="none" opacity=".45"/>`; } } return o; };
  const leaf = (x, y, r, rot, c = SAGE) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.42}" transform="rotate(${rot} ${x} ${y})" fill="${c}"/>`;
  const flower = (x, y, r, c) => `${[0, 1, 2, 3, 4].map((i) => `<circle cx="${x + Math.cos(i * 1.26) * r * 0.6}" cy="${y + Math.sin(i * 1.26) * r * 0.6}" r="${r * 0.5}" fill="${c}"/>`).join("")}<circle cx="${x}" cy="${y}" r="${r * 0.35}" fill="#F2C94C"/>`;
  const plate = (x, y, r, body, rim = "#F4EFE6") => `<circle cx="${x + 8}" cy="${y + 12}" r="${r}" fill="#000" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r}" fill="${rim}"/><circle cx="${x}" cy="${y}" r="${r * 0.78}" fill="#FBF8F2"/>${body}`;

  const dishes = {
    trout: (x, y, r) => `${[0, 1, 2, 3, 4].map((i) => `<rect x="${x - r * 0.5 + i * r * 0.18}" y="${y - r * 0.6}" width="${r * 0.08}" height="${r * 0.9}" rx="${r * 0.04}" transform="rotate(${-20 + i * 4} ${x} ${y})" fill="#6E9C3E"/>`).join("")}
      <path d="M${x - r * 0.55} ${y + r * 0.05} q ${r * 0.55} ${-r * 0.45} ${r * 1.1} 0 q ${-r * 0.55} ${r * 0.4} ${-r * 1.1} 0z" fill="#E9A07A"/><path d="M${x - r * 0.4} ${y} q ${r * 0.4} ${-r * 0.26} ${r * 0.8} 0" stroke="#C9764E" stroke-width="3" fill="none"/>
      ${[[0.3, 0.45], [0.05, 0.55], [-0.25, 0.48]].map(([dx, dy]) => `<ellipse cx="${x + dx * r}" cy="${y + dy * r}" rx="${r * 0.13}" ry="${r * 0.09}" fill="#E8C98A"/>`).join("")}
      ${[...Array(6)].map((_, i) => `<circle cx="${x - r * 0.3 + i * r * 0.12}" cy="${y - r * 0.25}" r="${r * 0.03}" fill="#4E6B2E"/>`).join("")}`,
    gazpacho: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="#D8462E"/><circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="none" stroke="#B93A26" stroke-width="3"/>${[0, 1, 2, 3].map((i) => `<rect x="${x - r * 0.25 + i * r * 0.14}" y="${y - r * 0.1 + (i % 2) * r * 0.12}" width="${r * 0.12}" height="${r * 0.12}" fill="#F1D38E"/>`).join("")}<path d="M${x - r * 0.4} ${y + r * 0.3} q ${r * 0.4} ${-r * 0.2} ${r * 0.8} 0" stroke="#7BA542" stroke-width="4" fill="none" opacity=".9"/>${leaf(x + r * 0.2, y - r * 0.3, r * 0.12, 30, "#9BC160")}${leaf(x + r * 0.32, y - r * 0.22, r * 0.1, -20, "#9BC160")}`,
    risotto: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="#EAD9AE"/>${[...Array(30)].map((_, i) => `<ellipse cx="${x + Math.cos(i * 2.4) * r * 0.5 * ((i % 7) / 7)}" cy="${y + Math.sin(i * 2.4) * r * 0.5 * ((i % 7) / 7)}" rx="${r * 0.04}" ry="${r * 0.025}" fill="#F7EDCF"/>`).join("")}${[[-0.2, -0.2], [0.2, 0.05], [-0.05, 0.25]].map(([dx, dy]) => `<path d="M${x + dx * r - r * 0.12} ${y + dy * r} q ${r * 0.12} ${-r * 0.16} ${r * 0.24} 0 z" fill="#B07A3E"/><rect x="${x + dx * r - r * 0.03}" y="${y + dy * r}" width="${r * 0.06}" height="${r * 0.1}" fill="#E8D2A6"/>`).join("")}<path d="M${x + r * 0.1} ${y - r * 0.35} l ${r * 0.25} ${r * 0.1}" stroke="#F4EFE6" stroke-width="6" stroke-linecap="round"/>`,
    burrata: (x, y, r) => `${[0, 1, 2, 3].map((i) => `<path d="M${x} ${y} L ${x + Math.cos(i * 1.57 + 0.4) * r * 0.6} ${y + Math.sin(i * 1.57 + 0.4) * r * 0.6} A ${r * 0.6} ${r * 0.6} 0 0 1 ${x + Math.cos(i * 1.57 + 1.2) * r * 0.6} ${y + Math.sin(i * 1.57 + 1.2) * r * 0.6} Z" fill="#F0A35E"/>`).join("")}${[...Array(10)].map((_, i) => leaf(x + Math.cos(i * 0.63) * r * 0.5, y + Math.sin(i * 0.63) * r * 0.5, r * 0.14, i * 40, "#4E7A3A")).join("")}<circle cx="${x}" cy="${y}" r="${r * 0.3}" fill="#FFFDF7"/>`,
    torte: (x, y, r) => `<path d="M${x} ${y} L ${x + r * 0.6} ${y - r * 0.15} A ${r * 0.62} ${r * 0.62} 0 0 1 ${x + r * 0.45} ${y + r * 0.42} Z" fill="#3A1F14"/><path d="M${x - r * 0.6} ${y + r * 0.3} q ${r * 0.4} ${-r * 0.3} ${r * 0.7} ${r * 0.1}" stroke="#B91C3C" stroke-width="${r * 0.08}" fill="none" stroke-linecap="round"/>${flower(x - r * 0.25, y - r * 0.3, r * 0.1, "#E9A6C6")}${flower(x + r * 0.1, y - r * 0.4, r * 0.08, "#F2D06B")}<ellipse cx="${x - r * 0.2}" cy="${y + r * 0.05}" rx="${r * 0.14}" ry="${r * 0.09}" fill="#FFFDF7"/>`,
  };
  const dish = (name, x, y, r) => plate(x, y, r, dishes[name](x, y, r * 0.85));

  function hero() {
    return svg("0 0 1600 1000", `${wood(1600, 1000, 3)}
      <rect width="1600" height="1000" fill="#FFF4DD" opacity=".08"/>
      <rect x="170" y="420" width="360" height="200" rx="6" fill="#E9E2D3" transform="rotate(-8 350 520)"/><path d="M190 450 h 320" stroke="#CFC6B2" stroke-width="3" transform="rotate(-8 350 520)"/>
      ${dish("trout", 820, 500, 260)}
      <rect x="1140" y="340" width="12" height="300" rx="6" fill="#B9B2A4" transform="rotate(8 1146 490)"/><rect x="1172" y="340" width="14" height="300" rx="6" fill="#B9B2A4" transform="rotate(8 1179 490)"/>
      <circle cx="1310" cy="230" r="80" fill="#000" opacity=".2"/><circle cx="1300" cy="220" r="80" fill="#F4EFE6" opacity=".25"/><circle cx="1300" cy="220" r="60" fill="#B23A48" opacity=".6"/>
      ${[[1290, 790], [1360, 760], [1420, 820]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${30 - i * 4}" fill="${["#D8462E", "#F2B134", "#E86A3A"][i]}"/><path d="M${x} ${y - 28 + i * 4} l 6 -12" stroke="#4E6B2E" stroke-width="5"/>`).join("")}
      ${[...Array(10)].map((_, i) => leaf(260 + i * 34, 780 + Math.sin(i) * 30, 26, i * 25, i % 2 ? SAGE : "#88A85A")).join("")}
      <path d="M240 790 C 330 760 440 810 560 780" stroke="#4E6B2E" stroke-width="4" fill="none"/>
      <radialGradient id="hl" cx=".2" cy="0" r="1"><stop offset="0" stop-color="#FFF1CF" stop-opacity=".45"/><stop offset=".6" stop-color="#FFF1CF" stop-opacity="0"/></radialGradient><rect width="1600" height="1000" fill="url(#hl)"/>`, "Overhead illustration of a plated seasonal trout dish on a reclaimed wood table in soft natural light");
  }

  const farms = {
    sunnyside: () => `<rect width="600" height="400" fill="#F7C98B"/><circle cx="420" cy="150" r="54" fill="#FFE8B0"/><circle cx="420" cy="150" r="100" fill="#FFE8B0" opacity=".3"/>
      <path d="M0 190 Q 300 150 600 200 L 600 400 L 0 400 Z" fill="#7E9A4E"/>
      ${[...Array(9)].map((_, i) => `<path d="M${300 + (i - 4) * 18} 200 L ${300 + (i - 4) * 120} 400" stroke="${i % 2 ? "#5E7A34" : "#4A6A2A"}" stroke-width="${8 + Math.abs(i - 4) * 3}"/>`).join("")}
      <rect x="80" y="150" width="70" height="50" fill="#9A3B2E"/><path d="M74 152 L 115 120 L 156 152 Z" fill="#6E2A20"/>`,
    creamery: () => `<rect width="600" height="400" fill="#BFDCE4"/><path d="M0 220 Q 160 150 320 200 T 600 180 L 600 400 L 0 400 Z" fill="#8DB066"/><path d="M0 280 Q 200 240 420 280 T 600 270 L 600 400 L 0 400 Z" fill="#7AA05A"/>
      ${[[180, 300, 1], [380, 320, 1.15], [500, 260, 0.7]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="56" ry="30" fill="#FBF8F2"/><ellipse cx="-14" cy="-6" rx="18" ry="12" fill="#2C2418"/><ellipse cx="22" cy="8" rx="14" ry="10" fill="#2C2418"/><rect x="-44" y="20" width="9" height="32" fill="#FBF8F2"/><rect x="30" y="20" width="9" height="32" fill="#FBF8F2"/><ellipse cx="62" cy="-10" rx="18" ry="14" fill="#FBF8F2"/><ellipse cx="72" cy="-4" rx="8" ry="6" fill="#E8B9A8"/></g>`).join("")}`,
    ranch: () => `<rect width="600" height="400" fill="#E9D7B3"/><path d="M0 200 Q 150 120 300 170 T 600 140 L 600 400 L 0 400 Z" fill="#B5A66A"/><path d="M0 250 Q 200 200 400 240 T 600 230 L 600 400 L 0 400 Z" fill="#9AA35A"/>
      ${[...Array(12)].map((_, i) => `<rect x="${30 + i * 48}" y="290" width="6" height="60" fill="#6E4F33"/>`).join("")}<path d="M30 300 H 590 M30 326 H 590" stroke="#6E4F33" stroke-width="4"/>
      <g transform="translate(420 200)"><rect x="-50" y="-40" width="100" height="60" fill="#8A3324"/><path d="M-58 -38 L 0 -80 L 58 -38 Z" fill="#5E2418"/><rect x="-14" y="-10" width="28" height="30" fill="#5E2418"/></g>
      ${[[150, 240], [200, 250]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="20" ry="12" fill="#5A3A22"/><circle cx="${x + 20}" cy="${y - 6}" r="8" fill="#5A3A22"/>`).join("")}`,
  };

  function chef() {
    return svg("0 0 600 760", `<rect width="600" height="760" fill="#E3D6C0"/><rect x="0" y="0" width="600" height="420" fill="#D3C3A8"/>
      <rect x="360" y="40" width="200" height="280" fill="#FFF4DA" opacity=".8"/><path d="M460 40 V 320 M360 180 H 560" stroke="#B8A584" stroke-width="10"/>
      ${[0, 1, 2].map((i) => `<rect x="40" y="${80 + i * 70}" width="220" height="8" fill="#8A6440"/>${[0, 1, 2, 3].map((j) => `<circle cx="${70 + j * 50}" cy="${66 + i * 70}" r="16" fill="${["#C4913E", "#6B8C42", "#B23A48", "#E8D2A6"][(i + j) % 4]}"/>`).join("")}`).join("")}
      <rect y="560" width="600" height="200" fill="#8A6440"/>
      <path d="M120 760 L 140 520 Q 300 450 460 520 L 480 760 Z" fill="#FBF8F2"/><path d="M220 470 L 300 560 L 380 470" fill="none" stroke="#E3DACB" stroke-width="6"/>${[0, 1, 2].map((i) => `<circle cx="${280 + (i % 2) * 40}" cy="${580 + i * 40}" r="6" fill="#C9BFAE"/>`).join("")}
      <rect x="270" y="400" width="60" height="80" fill="#C99470"/><circle cx="300" cy="350" r="78" fill="#D3A27E"/>
      <path d="M218 360 Q 210 250 300 248 Q 400 250 386 370 Q 380 300 300 296 Q 236 300 218 360 Z" fill="#6B3F22"/><path d="M380 330 q 30 60 10 140 q -20 -30 -20 -90 z" fill="#6B3F22"/>
      <path d="M272 382 q 28 22 56 0" stroke="#8A4A2E" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="272" cy="346" r="6" fill="#2C2418"/><circle cx="328" cy="346" r="6" fill="#2C2418"/>
      <g transform="translate(410 600)">${plate(0, 0, 70, dishes.burrata(0, 0, 50))}</g>`, "Illustration of Chef Elara Voss in her kitchen in natural light");
  }

  const gal = {
    flowers: () => `${wood(600, 600, 11, "#6E4F33")}${dish("torte", 300, 300, 230)}`,
    dining: () => `<rect width="600" height="800" fill="#3A2A1E"/>${[0, 1, 2].map((i) => `<rect x="${60 + i * 170}" y="80" width="120" height="260" rx="60" fill="#5A4430"/>`).join("")}
      <rect y="460" width="600" height="340" fill="#5E422A"/><rect x="40" y="500" width="520" height="22" fill="#8A6440"/><rect x="60" y="522" width="14" height="200" fill="#4A321E"/><rect x="526" y="522" width="14" height="200" fill="#4A321E"/>
      ${[160, 300, 440].map((x) => `<rect x="${x - 7}" y="420" width="14" height="80" fill="#F4EFE6"/><path d="M${x} 410 q -8 -14 0 -26 q 8 12 0 26" fill="#FFD27A"/><circle cx="${x}" cy="400" r="60" fill="#FFD27A" opacity=".15"/>`).join("")}${[230, 370].map((x) => `<circle cx="${x}" cy="492" r="20" fill="#F4EFE6"/>`).join("")}`,
    hands: () => `${wood(600, 700, 5, "#7E5A3A")}${dish("risotto", 300, 420, 200)}<path d="M120 0 Q 160 140 240 210 L 290 250 L 260 290 L 180 230 Q 90 160 40 0 Z" fill="#D3A27E"/><path d="M290 250 l 20 40" stroke="#B9B2A4" stroke-width="8" stroke-linecap="round"/>
      <path d="M540 0 Q 500 160 410 230 L 380 260 L 410 290 L 450 260 Q 560 170 600 40 Z" fill="#C99470"/><path d="M0 0 h 140 l -60 120 z" fill="#FBF8F2"/><path d="M600 0 h -120 l 80 110 z" fill="#FBF8F2"/>`,
    patio: () => `<rect width="600" height="600" fill="#3E3A5A"/><rect width="600" height="260" fill="#6B5A7E"/><rect width="600" height="120" fill="#C98A6A" opacity=".5"/>
      ${[...Array(14)].map((_, i) => `<circle cx="${i * 46 + 10}" cy="${90 + Math.sin(i / 2) * 20}" r="5" fill="#FFE2A0"/><circle cx="${i * 46 + 10}" cy="${90 + Math.sin(i / 2) * 20}" r="16" fill="#FFE2A0" opacity=".25"/>`).join("")}
      <rect y="300" width="600" height="300" fill="#4A4038"/>${[140, 440].map((x) => `<ellipse cx="${x}" cy="420" rx="110" ry="30" fill="#F4EFE6"/><rect x="${x - 6}" y="420" width="12" height="90" fill="#2C2418"/><rect x="${x - 8}" y="380" width="16" height="40" fill="#F4EFE6"/><path d="M${x} 372 q -6 -10 0 -18 q 6 8 0 18" fill="#FFD27A"/>`).join("")}
      ${[...Array(8)].map((_, i) => leaf(30 + i * 75, 300, 30, i * 30, "#4E6B2E")).join("")}`,
    basket: () => `<rect width="600" height="500" fill="#EDE4D3"/><ellipse cx="300" cy="420" rx="230" ry="40" fill="#D3C3A8"/><path d="M90 250 L 130 420 H 470 L 510 250 Z" fill="#B07A3E"/>${[...Array(6)].map((_, i) => `<path d="M${100 + i * 4} ${280 + i * 25} H ${500 - i * 4}" stroke="#8A5A2A" stroke-width="5"/>`).join("")}<path d="M150 250 Q 300 60 450 250" stroke="#8A5A2A" stroke-width="14" fill="none"/>
      ${[[170, 230, "#D8462E", 34], [240, 210, "#F2B134", 30], [320, 220, "#7B4A9A", 32], [400, 230, "#D8462E", 30], [460, 240, "#E86A3A", 26]].map(([x, y, c, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("")}${[...Array(8)].map((_, i) => leaf(180 + i * 38, 190 - (i % 2) * 20, 30, -40 + i * 12, i % 2 ? SAGE : "#88A85A")).join("")}
      <path d="M260 160 l -10 -60 M280 160 l 10 -64 M300 162 l 30 -60" stroke="#5E7A34" stroke-width="6" stroke-linecap="round"/><path d="M240 170 l 60 0 l -10 -20 z" fill="#E86A3A"/>`,
    wine: () => `<rect width="600" height="760" fill="#2C2418"/><rect y="520" width="600" height="240" fill="#EDE4D3"/>
      <path d="M260 300 Q 250 420 300 440 Q 350 420 340 300 Z" fill="#F4EFE6" opacity=".35"/><path d="M262 360 Q 256 420 300 434 Q 344 420 338 360 Z" fill="#8E1F2E"/><rect x="296" y="440" width="8" height="90" fill="#F4EFE6" opacity=".6"/><ellipse cx="300" cy="530" rx="40" ry="8" fill="#F4EFE6" opacity=".6"/>
      <g transform="rotate(-38 420 150)"><rect x="380" y="20" width="80" height="230" rx="24" fill="#26381E"/><rect x="404" y="-50" width="32" height="90" rx="8" fill="#26381E"/><rect x="384" y="110" width="72" height="80" fill="#EDE4D3"/></g>
      <path d="M330 220 C 318 260 306 300 300 356" stroke="#8E1F2E" stroke-width="7" fill="none"/>
      ${dish("burrata", 120, 620, 100)}`,
  };
  const galLabels = { flowers: "Close-up of a plated torte with edible flowers", dining: "Rustic dining room interior with candlelight", hands: "Chef's hands plating a risotto", patio: "Outdoor patio with string lights at dusk", basket: "Basket of fresh produce from a farm delivery", wine: "Wine being poured at a table setting" };
  const galVB = { flowers: "0 0 600 600", dining: "0 0 600 800", hands: "0 0 600 700", patio: "0 0 600 600", basket: "0 0 600 500", wine: "0 0 600 760" };

  function botanical() {
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
      <path d="M200 390 C 196 300 210 200 200 20"/>${[...Array(9)].map((_, i) => { const y = 60 + i * 36, s = i % 2 ? 1 : -1; return `<path d="M${200} ${y + 20} C ${200 + s * 40} ${y} ${200 + s * 80} ${y + 4} ${200 + s * 110} ${y - 16} C ${200 + s * 80} ${y + 26} ${200 + s * 40} ${y + 30} 200 ${y + 20}"/><path d="M200 ${y + 20} L ${200 + s * 90} ${y - 8}"/>`; }).join("")}
      <path d="M120 390 C 130 330 100 290 60 260 M60 260 c 20 -6 30 -24 26 -44 M60 260 c -20 -2 -36 -18 -40 -36"/><path d="M290 380 C 300 330 330 300 350 260 M350 260 c 10 -20 0 -40 -14 -50 M350 260 c 20 -4 36 0 44 10"/></g></svg>`;
  }

  function map() {
    const pins = [["restaurant", 300, 260, "#2C2418"], ["sunnyside", 380, 170, SAGE], ["creamery", 120, 120, SAGE], ["ranch", 470, 380, SAGE]];
    return `<svg viewBox="0 0 600 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map showing the restaurant and partner farms 8, 15 and 22 miles away">
      <rect width="600" height="460" fill="#F1EADC"/>${[...Array(7)].map((_, i) => `<path d="M0 ${40 + i * 70} C 150 ${20 + i * 70} 300 ${70 + i * 70} 600 ${30 + i * 70}" stroke="#E2D7C2" stroke-width="2" fill="none"/>`).join("")}
      <path d="M0 330 C 160 300 240 360 380 320 S 560 260 600 280" stroke="#B9D3D8" stroke-width="12" fill="none"/>
      ${[80, 150, 220].map((r) => `<circle cx="300" cy="260" r="${r}" fill="none" stroke="#C4913E" stroke-width="1.5" stroke-dasharray="5 6" opacity=".7"/>`).join("")}
      ${pins.map(([, x, y]) => `<path d="M300 260 L ${x} ${y}" stroke="#2C2418" stroke-width="1.5" stroke-dasharray="2 5" opacity=".4"/>`).join("")}
      ${pins.map(([id, x, y, c]) => `<g data-mpin="${id}" transform="translate(${x} ${y})"><circle r="${id === "restaurant" ? 16 : 12}" fill="${c}" stroke="#FAF8F4" stroke-width="3"/>${id === "restaurant" ? `<path d="M-6 4 L0 -6 L6 4 Z" fill="#C4913E"/>` : ""}</g>`).join("")}
      <g font-family="Lato, sans-serif" font-size="13" font-weight="700" fill="#2C2418"><text x="320" y="282">Harvest &amp; Hearth</text><text x="396" y="162">Sunnyside · 8 mi</text><text x="40" y="100">Blue Ridge Creamery · 22 mi</text><text x="380" y="420">Willow Creek · 15 mi</text></g>
      <g font-family="Lato, sans-serif" font-size="11" fill="#8A7A62"><text x="372" y="262">8 mi</text><text x="446" y="262">15 mi</text><text x="516" y="262">22 mi</text></g></svg>`;
  }

  function location() {
    return svg("0 0 700 520", `<rect width="700" height="520" fill="#F1EADC"/>${[...Array(6)].map((_, i) => `<path d="M0 ${60 + i * 90} H700" stroke="#fff" stroke-width="16"/>`).join("")}${[...Array(7)].map((_, i) => `<path d="M${60 + i * 105} 0 V520" stroke="#fff" stroke-width="16"/>`).join("")}
      <path d="M0 240 H700" stroke="#F2D9A6" stroke-width="22"/><text x="24" y="232" font-family="Lato, sans-serif" font-size="13" font-weight="700" fill="#8A6A2E" letter-spacing="2">ELM STREET</text>
      <rect x="390" y="262" width="90" height="70" rx="6" fill="#E3D6C0"/><text x="435" y="303" text-anchor="middle" font-family="Lato, sans-serif" font-size="13" font-weight="700" fill="#6E5A40">P</text>
      <rect x="490" y="80" width="150" height="120" rx="8" fill="#CFDDB8"/><text x="565" y="146" text-anchor="middle" font-family="Lato, sans-serif" font-size="12" fill="#5E7A34">Valley Park</text>
      <g transform="translate(420 236)"><circle r="44" fill="#6B8C42" opacity=".18"/><path d="M0 -44 c 22 0 32 16 32 30 c 0 24 -32 46 -32 46 s -32 -22 -32 -46 c 0 -14 10 -30 32 -30z" fill="#6B8C42"/><circle cy="-14" r="12" fill="#FAF8F4"/></g>`, "Map of Elm Street in Ashford Valley showing Harvest & Hearth and the parking lot behind it");
  }

  window.Art = { hero, farm: (n, l) => svg("0 0 600 400", farms[n](), l), chef, gallery: (n) => svg(galVB[n], gal[n](), galLabels[n]), galLabels, botanical, map, location };
})();
