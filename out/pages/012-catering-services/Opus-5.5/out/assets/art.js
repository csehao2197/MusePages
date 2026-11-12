// Original SVG illustrations used in place of event photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  const G = "#C9A84C";

  // Top-down plated dishes
  const plate = (x, y, r, dish) => `<circle cx="${x}" cy="${y + 6}" r="${r}" fill="#000" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="#F7F3EC"/><circle cx="${x}" cy="${y}" r="${r * 0.72}" fill="none" stroke="${G}" stroke-width="1.5" opacity=".7"/>${dishes[dish](x, y, r * 0.6)}`;
  const dishes = {
    salmon: (x, y, r) => `<path d="M${x - r * 0.8} ${y - r * 0.2} q ${r * 0.8} ${-r * 0.7} ${r * 1.6} 0 q ${-r * 0.8} ${r * 0.7} ${-r * 1.6} 0z" fill="#E98A5E"/>${[0, 1, 2].map((i) => `<path d="M${x - r * 0.5 + i * r * 0.4} ${y - r * 0.45} q 4 ${r * 0.3} 0 ${r * 0.5}" stroke="#F6C3A4" stroke-width="2" fill="none"/>`).join("")}<ellipse cx="${x}" cy="${y + r * 0.55}" rx="${r * 0.7}" ry="${r * 0.22}" fill="#6E9C3E"/><circle cx="${x + r * 0.6}" cy="${y - r * 0.5}" r="${r * 0.15}" fill="#F2D06B"/>`,
    steak: (x, y, r) => `<ellipse cx="${x - r * 0.1}" cy="${y}" rx="${r * 0.75}" ry="${r * 0.5}" fill="#6B2E1F"/><ellipse cx="${x - r * 0.1}" cy="${y}" rx="${r * 0.5}" ry="${r * 0.3}" fill="#B5554A"/><path d="M${x + r * 0.3} ${y + r * 0.55} q ${r * 0.4} ${-r * 0.2} ${r * 0.6} ${r * 0.1}" stroke="#7A2E1C" stroke-width="${r * 0.12}" fill="none" stroke-linecap="round"/>${[0, 1, 2, 3].map((i) => `<circle cx="${x - r * 0.6 + i * r * 0.3}" cy="${y + r * 0.7}" r="${r * 0.12}" fill="#E8D6A0"/>`).join("")}`,
    salad: (x, y, r) => { const q = rng(Math.round(x + y)); let o = ""; for (let i = 0; i < 14; i++) { const a = q() * 6.28, d = q() * r * 0.8; o += `<ellipse cx="${x + Math.cos(a) * d}" cy="${y + Math.sin(a) * d}" rx="${r * 0.28}" ry="${r * 0.14}" transform="rotate(${q() * 180} ${x + Math.cos(a) * d} ${y + Math.sin(a) * d})" fill="${["#6E9C3E", "#4E7A3A", "#9BC160"][i % 3]}"/>`; } return `${o}<circle cx="${x + r * 0.2}" cy="${y - r * 0.2}" r="${r * 0.18}" fill="#D9442E"/><circle cx="${x - r * 0.3}" cy="${y + r * 0.2}" r="${r * 0.16}" fill="#F2D06B"/>`; },
    burrata: (x, y, r) => `${[0, 1, 2, 3, 4].map((i) => { const a = i * 1.26; return `<circle cx="${x + Math.cos(a) * r * 0.6}" cy="${y + Math.sin(a) * r * 0.6}" r="${r * 0.28}" fill="${["#D9442E", "#F2B134", "#7A2E5A"][i % 3]}"/>`; }).join("")}<circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="#FBF8F1"/><path d="M${x - r * 0.1} ${y - r * 0.1} q ${r * 0.2} ${-r * 0.15} ${r * 0.3} 0" stroke="#E7DCC5" stroke-width="2" fill="none"/><circle cx="${x + r * 0.15}" cy="${y + r * 0.1}" r="${r * 0.08}" fill="#4E7A3A"/>`,
    dessert: (x, y, r) => `<path d="M${x - r * 0.6} ${y + r * 0.3} L ${x + r * 0.6} ${y + r * 0.3} L ${x + r * 0.4} ${y - r * 0.4} L ${x - r * 0.4} ${y - r * 0.4} Z" fill="#E8D2A6"/><rect x="${x - r * 0.6}" y="${y - r * 0.05}" width="${r * 1.2}" height="${r * 0.12}" fill="#6B3A1C"/><rect x="${x - r * 0.4}" y="${y - r * 0.45}" width="${r * 0.8}" height="${r * 0.12}" fill="#5A2E14"/><circle cx="${x + r * 0.5}" cy="${y - r * 0.55}" r="${r * 0.14}" fill="#C0263E"/><path d="M${x - r * 0.9} ${y + r * 0.6} q ${r * 0.9} ${-r * 0.2} ${r * 1.8} 0" stroke="#7A2E1C" stroke-width="2" fill="none"/>`,
    oysters: (x, y, r) => `${[0, 1, 2, 3, 4, 5].map((i) => { const a = i * 1.047; const cx = x + Math.cos(a) * r * 0.62, cy = y + Math.sin(a) * r * 0.62; return `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.3}" ry="${r * 0.22}" transform="rotate(${a * 57} ${cx} ${cy})" fill="#9AA3A8"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.18}" ry="${r * 0.12}" transform="rotate(${a * 57} ${cx} ${cy})" fill="#E9E4D8"/>`; }).join("")}<circle cx="${x}" cy="${y}" r="${r * 0.2}" fill="#F2D06B"/>`,
  };
  const glass = (x, y, s, wine = "#7A1F2B") => `<circle cx="${x}" cy="${y + 4}" r="${16 * s}" fill="#000" opacity=".2"/><circle cx="${x}" cy="${y}" r="${16 * s}" fill="#fff" opacity=".18" stroke="#fff" stroke-opacity=".5"/><circle cx="${x}" cy="${y}" r="${10 * s}" fill="${wine}" opacity=".85"/>`;
  const cutlery = (x, y, h) => `<rect x="${x}" y="${y}" width="5" height="${h}" rx="2.5" fill="#C9C2B4"/><rect x="${x + 12}" y="${y}" width="5" height="${h}" rx="2.5" fill="#C9C2B4"/><path d="M${x + 10} ${y} v ${h * 0.25}" stroke="#C9C2B4" stroke-width="2"/>`;
  const flower = (x, y, r, c) => `${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x + Math.cos(i * 1.05) * r * 0.55}" cy="${y + Math.sin(i * 1.05) * r * 0.55}" r="${r * 0.5}" fill="${c}"/>`).join("")}<circle cx="${x}" cy="${y}" r="${r * 0.4}" fill="${G}"/>`;
  const leaves = (x, y, n, seed) => { const q = rng(seed); let o = ""; for (let i = 0; i < n; i++) { const a = q() * 6.28; o += `<ellipse cx="${x + Math.cos(a) * 30}" cy="${y + Math.sin(a) * 30}" rx="22" ry="8" transform="rotate(${a * 57} ${x + Math.cos(a) * 30} ${y + Math.sin(a) * 30})" fill="${q() > 0.5 ? "#3F5E3A" : "#56794A"}"/>`; } return o; };
  const linen = (w, h, base = "#2D2D2D") => `<rect width="${w}" height="${h}" fill="${base}"/>${[...Array(Math.ceil(w / 60))].map((_, i) => `<rect x="${i * 60}" width="30" height="${h}" fill="#fff" opacity=".018"/>`).join("")}`;

  function hero() {
    return svg("0 0 1600 1000", `${linen(1600, 1000, "#262421")}
      <rect x="0" y="380" width="1600" height="240" fill="#3A332B"/><rect x="0" y="380" width="1600" height="6" fill="${G}" opacity=".5"/><rect x="0" y="614" width="1600" height="6" fill="${G}" opacity=".5"/>
      ${plate(260, 220, 120, "salmon")}${plate(700, 170, 105, "burrata")}${plate(1150, 230, 125, "steak")}${plate(1480, 140, 90, "dessert")}
      ${plate(420, 760, 130, "oysters")}${plate(900, 820, 115, "salad")}${plate(1340, 760, 120, "salmon")}${plate(80, 820, 95, "dessert")}
      ${[[520, 320], [940, 330], [1300, 420], [160, 470], [640, 600], [1100, 640]].map(([x, y], i) => glass(x, y, 1.6, i % 2 ? "#E8D58A" : "#7A1F2B")).join("")}
      ${cutlery(100, 120, 170)}${cutlery(560, 80, 150)}${cutlery(1010, 520, 160)}
      ${leaves(820, 500, 14, 3)}${flower(800, 480, 26, "#F3E8D6")}${flower(860, 520, 20, "#E9C6B9")}${flower(760, 530, 18, "#F7F0E3")}
      ${[[300, 520], [1450, 560], [600, 960], [1220, 960]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${G}" opacity=".6"/><circle cx="${x}" cy="${y}" r="26" fill="${G}" opacity=".12"/>`).join("")}`, "Overhead illustration of an elegantly plated catering spread on a dark table");
  }

  const events = {
    wedding: (q) => `<rect width="600" height="800" fill="#3B3530"/>${[...Array(18)].map((_, i) => `<circle cx="${30 + i * 32}" cy="${60 + Math.sin(i) * 16}" r="5" fill="#FFE2A0"/><circle cx="${30 + i * 32}" cy="${60 + Math.sin(i) * 16}" r="16" fill="#FFE2A0" opacity=".18"/>`).join("")}
      <path d="M0 60 Q 300 110 600 60" stroke="#8C7B66" stroke-width="2" fill="none"/>
      ${[[150, 360], [450, 360], [300, 600]].map(([x, y]) => `<ellipse cx="${x}" cy="${y + 40}" rx="140" ry="50" fill="#F4EEE4"/><ellipse cx="${x}" cy="${y + 34}" rx="140" ry="48" fill="#FBF8F2"/>${[...Array(8)].map((_, i) => { const a = i * 0.785; return `<circle cx="${x + Math.cos(a) * 112}" cy="${y + 34 + Math.sin(a) * 36}" r="9" fill="#E8DFD0"/>`; }).join("")}<rect x="${x - 4}" y="${y - 50}" width="8" height="80" fill="${G}"/>${flower(x - 16, y - 60, 18, "#F3E8D6")}${flower(x + 16, y - 56, 16, "#E9C6B9")}${flower(x, y - 78, 16, "#FBF8F2")}${leaves(x, y - 60, 8, x)}`).join("")}`,
    corporate: (q) => `<rect width="600" height="600" fill="#E9E4DA"/><rect y="0" width="600" height="250" fill="#CFC8BB"/>${[...Array(5)].map((_, i) => `<rect x="${40 + i * 120}" y="40" width="80" height="170" fill="#A7B6BE" opacity=".7"/>`).join("")}
      <rect x="20" y="300" width="560" height="200" rx="8" fill="#2D2D2D"/><rect x="20" y="300" width="560" height="22" fill="#3A3A3A"/>
      ${[0, 1, 2].map((i) => `<ellipse cx="${120 + i * 180}" cy="${380}" rx="70" ry="36" fill="#BFC4C7"/><ellipse cx="${120 + i * 180}" cy="372" rx="70" ry="32" fill="#D9DDE0"/><path d="M${60 + i * 180} 372 q 60 -46 120 0" fill="#C9CED2"/><circle cx="${120 + i * 180}" cy="340" r="6" fill="#8D9499"/>`).join("")}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${44 + i * 90}" y="440" width="62" height="40" rx="6" fill="#F7F3EC"/><circle cx="${75 + i * 90}" cy="460" r="12" fill="${["#E98A5E", "#6E9C3E", "#E8D2A6"][i % 3]}"/>`).join("")}
      <rect x="250" y="520" width="100" height="60" rx="6" fill="${G}"/><text x="300" y="557" font-family="Georgia, serif" font-size="16" fill="#2D2D2D" text-anchor="middle">Launch</text>`,
    party: () => `<rect width="600" height="700" fill="#2D2D2D"/>${[...Array(40)].map((_, i) => `<circle cx="${(i * 97) % 600}" cy="${(i * 53) % 300}" r="${2 + (i % 3)}" fill="${G}" opacity="${0.3 + (i % 4) * 0.15}"/>`).join("")}
      ${[[300, 300, 1], [270, 360, 2], [330, 360, 2], [240, 420, 3], [300, 420, 3], [360, 420, 3], [210, 480, 4], [270, 480, 4], [330, 480, 4], [390, 480, 4]].map(([x, y]) => `<path d="M${x - 22} ${y} h 44 l -6 26 q -16 10 -32 0 z" fill="#F3E3A6" opacity=".9"/><rect x="${x - 2}" y="${y + 28}" width="4" height="24" fill="#E8E2D2"/><ellipse cx="${x}" cy="${y + 54}" rx="16" ry="4" fill="#E8E2D2"/>`).join("")}
      <rect x="120" y="540" width="360" height="30" fill="#F4EEE4"/><rect x="140" y="570" width="320" height="130" fill="#3A3A3A"/>
      <path d="M380 230 l 30 -60" stroke="#1F3B2D" stroke-width="22" stroke-linecap="round"/><path d="M406 176 q 20 -30 40 -10" stroke="${G}" stroke-width="6" fill="none"/>`,
    brunch: () => `${linen(600, 600, "#F4EEE4")}${plate(170, 170, 110, "salad")}${plate(430, 180, 100, "burrata")}${plate(300, 430, 120, "dessert")}${glass(520, 390, 1.6, "#F2B134")}${glass(90, 420, 1.6, "#F2B134")}${leaves(520, 520, 10, 9)}${flower(520, 520, 20, "#E9C6B9")}`,
    dinner: () => `${linen(600, 760, "#262421")}<rect x="200" y="0" width="200" height="760" fill="#F7F3EC"/>${[120, 360, 600].map((y) => `${plate(300, y, 74, ["steak", "salmon", "steak"][y % 3])}${glass(390, y - 60, 1.2)}${cutlery(208, y - 40, 90)}`).join("")}
      ${[60, 540].map((x) => `<rect x="${x - 6}" y="200" width="12" height="160" fill="#F4EEE4"/><path d="M${x} 190 q -8 -14 0 -26 q 8 12 0 26" fill="#FFD27A"/><circle cx="${x}" cy="180" r="30" fill="#FFD27A" opacity=".15"/>`).join("")}`,
    raw: () => `${linen(600, 600, "#2B3236")}${[...Array(26)].map((_, i) => `<circle cx="${(i * 131) % 600}" cy="${(i * 71) % 600}" r="${30 + (i % 4) * 6}" fill="#DDE6EA" opacity=".55"/>`).join("")}${plate(300, 300, 160, "oysters")}${[[120, 110], [480, 120], [110, 490], [490, 480]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#F2D06B"/>`).join("")}`,
  };
  function event(name, label) {
    const vb = { wedding: "0 0 600 800", corporate: "0 0 600 600", party: "0 0 600 700", brunch: "0 0 600 600", dinner: "0 0 600 760", raw: "0 0 600 600" }[name];
    return svg(vb, events[name](), label);
  }

  function menuArt(tier) {
    const d = { classic: ["salad", "salmon", "dessert"], premium: ["burrata", "salmon", "dessert"], luxury: ["oysters", "steak", "dessert"] }[tier];
    return svg("0 0 600 600", `${linen(600, 600, "#262421")}${plate(180, 180, 120, d[0])}${plate(430, 300, 140, d[1])}${plate(190, 460, 100, d[2])}${glass(470, 90, 1.8, tier === "luxury" ? "#E8D58A" : "#7A1F2B")}${cutlery(40, 330, 150)}`, `Illustration of dishes from the ${tier} package`);
  }

  window.Art = { hero, event, menuArt };
})();
