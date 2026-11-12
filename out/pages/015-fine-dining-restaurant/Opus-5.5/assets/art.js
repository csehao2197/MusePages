// Original SVG illustrations used in place of photography (no licensed photos are bundled).
(function () {
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  let uid = 0;
  const side = (w, h, from = "left") => { const id = `sl${++uid}`; return `<defs><linearGradient id="${id}" x1="${from === "left" ? 0 : 1}" y1="0" x2="${from === "left" ? 1 : 0}" y2="0"><stop offset="0" stop-color="#FFE7B8" stop-opacity=".22"/><stop offset=".45" stop-color="#FFE7B8" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`; };
  const blur = (id, sd) => `<filter id="${id}"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

  function plate(cx, cy, r) {
    return `<ellipse cx="${cx + r * 0.08}" cy="${cy + r * 0.1}" rx="${r}" ry="${r * 0.42}" fill="#000" opacity=".55"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.4}" fill="#2B2A28"/><ellipse cx="${cx}" cy="${cy - 2}" rx="${r * 0.98}" ry="${r * 0.38}" fill="#3A3835"/>
      <ellipse cx="${cx}" cy="${cy - 4}" rx="${r * 0.62}" ry="${r * 0.24}" fill="#2E2C29"/>
      <path d="M${cx - r * 0.3} ${cy - r * 0.04} q ${r * 0.3} ${-r * 0.2} ${r * 0.55} ${-r * 0.02} q ${-r * 0.2} ${r * 0.14} ${-r * 0.55} ${r * 0.02} z" fill="#C8693A"/>
      <path d="M${cx - r * 0.25} ${cy - r * 0.06} q ${r * 0.24} ${-r * 0.13} ${r * 0.46} ${-r * 0.02}" stroke="#E8A070" stroke-width="3" fill="none"/>
      <ellipse cx="${cx + r * 0.05}" cy="${cy + r * 0.05}" rx="${r * 0.3}" ry="${r * 0.06}" fill="#5E1F24" opacity=".85"/>
      ${[[-0.18, -0.12], [0.12, -0.15], [0.26, -0.07]].map(([dx, dy]) => `<circle cx="${cx + dx * r}" cy="${cy + dy * r}" r="${r * 0.035}" fill="#7C9A4E"/>`).join("")}
      <path d="M${cx + r * 0.05} ${cy - r * 0.16} l ${r * 0.02} ${-r * 0.2} M${cx + r * 0.08} ${cy - r * 0.15} l ${r * 0.07} ${-r * 0.16}" stroke="#93B062" stroke-width="2.4"/>
      <ellipse cx="${cx - r * 0.35}" cy="${cy - r * 0.2}" rx="${r * 0.35}" ry="${r * 0.08}" fill="#FFF3D6" opacity=".18"/>`;
  }

  function hero() {
    return svg("0 0 1600 1000", `<defs>${blur("hb", 18)}${blur("hb2", 6)}<radialGradient id="hspot" cx=".42" cy=".55" r=".55"><stop offset="0" stop-color="#3A2E22"/><stop offset="1" stop-color="#0A0908"/></radialGradient></defs>
      <rect width="1600" height="1000" fill="url(#hspot)"/>
      <g filter="url(#hb)" opacity=".7"><ellipse cx="1280" cy="380" rx="70" ry="160" fill="#2A2420"/><circle cx="1300" cy="200" r="22" fill="#FFCF7A"/><circle cx="1300" cy="200" r="90" fill="#FFB547" opacity=".25"/><ellipse cx="260" cy="420" rx="40" ry="120" fill="#2A2420"/><circle cx="240" cy="300" r="14" fill="#FFCF7A"/></g>
      <g filter="url(#hb2)"><rect x="0" y="640" width="1600" height="360" fill="#141210"/></g>
      ${plate(800, 800, 440)}
      <g filter="url(#hb)" opacity=".6"><rect x="1180" y="560" width="14" height="300" fill="#8A8478" transform="rotate(-6 1187 710)"/><rect x="1220" y="560" width="14" height="300" fill="#8A8478" transform="rotate(-6 1227 710)"/></g>
      ${side(1600, 1000)}`, "Cinematic illustration of an artfully plated dish on a dark table with dramatic side lighting");
  }

  const scenes = {
    dish: () => `<rect width="600" height="760" fill="#0F0E0C"/><radialGradient id="ds" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#3A2E22"/><stop offset="1" stop-color="#0A0908"/></radialGradient><rect width="600" height="760" fill="url(#ds)"/>${plate(300, 420, 260)}${side(600, 760)}`,
    room: () => `<rect width="600" height="500" fill="#16120E"/>${[0, 1, 2, 3].map((i) => `<rect x="${30 + i * 145}" y="60" width="110" height="200" fill="#211A14"/><rect x="${30 + i * 145}" y="60" width="110" height="200" fill="#C9A84C" opacity=".05"/>`).join("")}
      <rect y="300" width="600" height="200" fill="#100D0A"/>${[90, 300, 510].map((x) => `<ellipse cx="${x}" cy="350" rx="80" ry="18" fill="#F5F0E8" opacity=".85"/><rect x="${x - 3}" y="300" width="6" height="40" fill="#F5F0E8"/><path d="M${x} 296 q -5 -10 0 -18 q 5 8 0 18" fill="#FFD27A"/><circle cx="${x}" cy="290" r="50" fill="#FFB547" opacity=".16"/><rect x="${x - 4}" y="368" width="8" height="100" fill="#0A0806"/>`).join("")}`,
    chef: () => `<rect width="600" height="600" fill="#14110E"/><rect x="0" y="0" width="600" height="260" fill="#1F1A15"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${40 + i * 110}" y="80" width="70" height="8" fill="#8A8478" opacity=".5"/>`).join("")}
      <rect y="360" width="600" height="240" fill="#2C2824"/><rect y="360" width="600" height="10" fill="#4A443D"/>
      ${plate(300, 450, 150)}<path d="M120 0 Q 170 180 250 300 L 270 340 L 236 360 L 200 320 Q 110 200 60 0 Z" fill="#1C1C1C"/><path d="M262 330 l 30 70" stroke="#C9C2B4" stroke-width="5" stroke-linecap="round"/><ellipse cx="248" cy="330" rx="24" ry="18" fill="#C99470"/>
      <path d="M520 0 Q 470 160 400 300 L 380 330 L 410 350 L 440 320 Q 540 180 580 0 Z" fill="#1C1C1C"/><ellipse cx="398" cy="330" rx="22" ry="16" fill="#B98060"/>${side(600, 600, "right")}`,
    wine: () => `<rect width="600" height="700" fill="#0E0C0A"/><radialGradient id="ws" cx=".3" cy=".4" r=".7"><stop offset="0" stop-color="#2A2018"/><stop offset="1" stop-color="#0A0806"/></radialGradient><rect width="600" height="700" fill="url(#ws)"/>
      <path d="M220 300 Q 210 440 300 470 Q 390 440 380 300 Z" fill="#F5F0E8" opacity=".14"/><path d="M226 380 Q 222 440 300 462 Q 378 440 374 380 Z" fill="#6E1424"/><ellipse cx="300" cy="380" rx="74" ry="10" fill="#9A2A3A"/>
      <rect x="296" y="468" width="8" height="140" fill="#F5F0E8" opacity=".3"/><ellipse cx="300" cy="610" rx="70" ry="10" fill="#F5F0E8" opacity=".25"/><path d="M230 310 Q 228 360 240 400" stroke="#fff" stroke-width="4" opacity=".25" fill="none"/>
      <g transform="rotate(-42 470 150)"><rect x="420" y="0" width="100" height="280" rx="30" fill="#14201A"/><rect x="450" y="-90" width="40" height="110" rx="10" fill="#14201A"/><rect x="426" y="120" width="88" height="90" fill="#E8E0CC"/></g>
      <path d="M352 236 C 340 280 318 330 306 380" stroke="#6E1424" stroke-width="7" fill="none"/>${side(600, 700)}`,
    raw: () => `<rect width="600" height="600" fill="#1A1612"/>${[...Array(10)].map((_, i) => `<path d="M0 ${i * 64} H600" stroke="#211C17" stroke-width="22"/>`).join("")}
      ${[[150, 180], [230, 140], [190, 240]].map(([x, y]) => `<path d="M${x - 40} ${y} q 40 -50 80 0 z" fill="#B5895A"/><rect x="${x - 10}" y="${y}" width="20" height="50" rx="8" fill="#E8DCC4"/>`).join("")}
      ${[...Array(9)].map((_, i) => `<ellipse cx="${380 + (i % 3) * 50}" cy="${160 + Math.floor(i / 3) * 40}" rx="30" ry="10" transform="rotate(${-30 + i * 10} ${380 + (i % 3) * 50} ${160 + Math.floor(i / 3) * 40})" fill="${i % 2 ? "#4E6B3A" : "#6E8A4E"}"/>`).join("")}
      ${[[180, 420, "#7A2A3A"], [260, 450, "#E8B04A"], [340, 420, "#6E1424"], [430, 440, "#D4A04A"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="42" fill="${c}"/><path d="M${x} ${y - 42} l 4 -26" stroke="#4E6B3A" stroke-width="6"/>`).join("")}${side(600, 600)}`,
    table: () => `<rect width="600" height="760" fill="#EDE6D8"/><rect width="600" height="760" fill="#000" opacity=".35"/>
      <circle cx="300" cy="380" r="170" fill="#F5F0E8"/><circle cx="300" cy="380" r="120" fill="#FAF8F3"/><circle cx="300" cy="380" r="120" fill="none" stroke="#C9A84C" stroke-width="2"/>
      <rect x="90" y="250" width="12" height="260" rx="6" fill="#C9C2B4"/><rect x="60" y="250" width="12" height="260" rx="6" fill="#C9C2B4"/><rect x="500" y="250" width="12" height="260" rx="6" fill="#C9C2B4"/>
      <path d="M220 160 L 380 160 L 360 200 L 240 200 Z" fill="#F5F0E8"/><circle cx="440" cy="150" r="46" fill="#F5F0E8" opacity=".5" stroke="#fff" stroke-opacity=".5"/>
      ${[[150, 620], [190, 640], [170, 600]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${18 - i * 3}" fill="${["#E9C6B9", "#F5F0E8", "#C9A84C"][i]}"/>`).join("")}<path d="M150 640 q 40 40 90 40" stroke="#4E6B3A" stroke-width="4" fill="none"/>${side(600, 760)}`,
  };
  const galVB = { dish: "0 0 600 760", room: "0 0 600 500", chef: "0 0 600 600", wine: "0 0 600 700", raw: "0 0 600 600", table: "0 0 600 760" };
  const galLabels = { dish: "Artfully plated dish, close-up", room: "Dining room interior by candlelight", chef: "Chef plating in the open kitchen", wine: "Wine poured into a crystal glass", raw: "Raw ingredients: mushrooms, herbs and vegetables", table: "Table setting detail with linen, cutlery and flowers" };

  function portrait() {
    return svg("0 0 700 860", `<rect width="700" height="860" fill="#14110E"/><rect x="0" y="0" width="700" height="460" fill="#1D1915"/>
      ${[0, 1, 2].map((i) => `<rect x="${60 + i * 200}" y="${110 + (i % 2) * 30}" width="140" height="10" fill="#4A443D"/>`).join("")}<circle cx="560" cy="120" r="80" fill="#FFB547" opacity=".08"/>
      <path d="M120 860 L 140 600 Q 350 520 560 600 L 580 860 Z" fill="#111"/><path d="M300 560 L 350 640 L 400 560" fill="none" stroke="#2A2A2A" stroke-width="6"/>${[0, 1, 2, 3].map((i) => `<circle cx="${330 + (i % 2) * 40}" cy="${660 + Math.floor(i / 2) * 60}" r="7" fill="#2E2E2E"/>`).join("")}
      <rect x="315" y="440" width="70" height="110" fill="#B98060"/><circle cx="350" cy="380" r="96" fill="#C9906C"/>
      <path d="M254 370 Q 250 270 350 268 Q 456 270 446 372 Q 430 320 350 318 Q 272 320 254 370 Z" fill="#3A2A20"/>
      <path d="M288 420 q 62 70 124 0 q -10 60 -62 70 q -52 -10 -62 -70z" fill="#4A3628" opacity=".9"/>
      <path d="M322 414 q 28 12 56 0" stroke="#7A4A36" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="318" cy="376" r="6" fill="#1A120C"/><circle cx="382" cy="376" r="6" fill="#1A120C"/>
      <path d="M180 620 L 200 860 M520 620 L 500 860" stroke="#1A1A1A" stroke-width="40"/>${side(700, 860)}`, "Illustration of Chef Marcus Aldridge in a black chef coat in the kitchen");
  }

  function privateRoom() {
    return svg("0 0 1600 900", `<rect width="1600" height="900" fill="#14100C"/>${[...Array(8)].map((_, i) => `<rect x="${i * 210}" y="0" width="190" height="460" fill="#1C1611"/><rect x="${i * 210 + 30}" y="60" width="130" height="300" fill="#C9A84C" opacity=".04"/>`).join("")}
      <path d="M200 520 L 1400 520 L 1560 900 L 40 900 Z" fill="#F5F0E8" opacity=".9"/><path d="M200 520 L 1400 520 L 1420 560 L 180 560 Z" fill="#E8E0CC"/>
      ${[...Array(9)].map((_, i) => { const x = 300 + i * 125; return `<rect x="${x - 4}" y="${440}" width="8" height="80" fill="#F5F0E8"/><path d="M${x} 436 q -6 -12 0 -22 q 6 10 0 22" fill="#FFD27A"/><circle cx="${x}" cy="426" r="54" fill="#FFB547" opacity=".14"/>`; }).join("")}
      ${[500, 800, 1100].map((x) => `${[...Array(7)].map((_, k) => `<circle cx="${x - 60 + k * 20}" cy="${500 - (k % 2) * 16}" r="${16 + (k % 3) * 4}" fill="${["#E9C6B9", "#F5F0E8", "#C9A84C", "#B23A48"][k % 4]}" opacity=".9"/>`).join("")}<path d="M${x - 80} 510 q 80 -30 160 0" stroke="#3F5E3A" stroke-width="10" fill="none"/>`).join("")}
      ${[...Array(10)].map((_, i) => `<rect x="${170 + i * 130}" y="${640 + (i % 2) * 6}" width="80" height="40" rx="2" fill="#2A221A" opacity=".8"/>`).join("")}${side(1600, 900)}`, "Private dining room with a long candlelit table and floral arrangements");
  }

  function bottle(name, cuvee, color, label = "#EFE7D3") {
    return `<svg viewBox="0 0 160 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bottle of ${name}"><rect width="160" height="420" fill="none"/>
      <path d="M62 10 h 36 v 110 q 0 30 26 60 q 12 14 12 40 v 180 q 0 14 -14 14 h -84 q -14 0 -14 -14 v -180 q 0 -26 12 -40 q 26 -30 26 -60 z" fill="${color}"/>
      <rect x="62" y="10" width="36" height="34" fill="#C9A84C"/><rect x="34" y="230" width="92" height="120" fill="${label}"/><rect x="40" y="236" width="80" height="108" fill="none" stroke="#C9A84C" stroke-width="1"/>
      <text x="80" y="276" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="13" font-style="italic" fill="#0F0F0F">${cuvee}</text>
      <path d="M58 288 h 44" stroke="#C9A84C"/><text x="80" y="310" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="7" letter-spacing="1.5" fill="#3A3530">${name.toUpperCase()}</text>
      <path d="M40 140 q 4 80 0 300" stroke="#fff" stroke-width="5" opacity=".12" fill="none"/></svg>`;
  }

  function map() {
    return svg("0 0 700 560", `<rect width="700" height="560" fill="#1A1A1A"/>${[...Array(12)].map((_, i) => `<path d="M0 ${30 + i * 48} H700" stroke="#2A2A2A" stroke-width="${i % 4 === 0 ? 10 : 5}"/>`).join("")}${[...Array(10)].map((_, i) => `<path d="M${40 + i * 72} 0 V560" stroke="#2A2A2A" stroke-width="${i % 3 === 0 ? 12 : 5}"/>`).join("")}
      <path d="M0 270 H700" stroke="#3A342A" stroke-width="12"/><text x="18" y="262" font-family="Montserrat, sans-serif" font-size="11" letter-spacing="3" fill="#8A8172">WEST 18TH STREET</text>
      <path d="M472 0 V560" stroke="#3A342A" stroke-width="14"/><text x="484" y="40" font-family="Montserrat, sans-serif" font-size="11" letter-spacing="3" fill="#8A8172" transform="rotate(90 484 40)">7TH AVENUE</text>
      <rect x="560" y="330" width="120" height="180" fill="#1F2A1F"/><text x="620" y="424" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="10" letter-spacing="2" fill="#5E7A5E">PARK</text>
      <g transform="translate(400 270)"><circle r="40" fill="#C9A84C" opacity=".14"/><circle r="12" fill="#C9A84C"/><circle r="4" fill="#0F0F0F"/></g>
      <text x="420" y="314" font-family="'Cormorant Garamond', serif" font-size="20" fill="#F5F0E8" letter-spacing="4">AURELIAN</text>`, "Map of West 18th Street in Chelsea, New York, with Aurelian marked near 7th Avenue");
  }

  window.Art = { hero, scene: (n) => svg(galVB[n], scenes[n](), galLabels[n]), galLabels, portrait, privateRoom, bottle, map };
})();
