// Original SVG illustrations used in place of brewery photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  const COP = ["#B87333", "#D08A4A", "#8C5426"];
  const beerC = { gold: "#E8B53A", amber: "#C46A1E", dark: "#2A160C", ipa: "#E9A93B", sour: "#E9927A" };

  const tank = (x, y, w, h, id) => `<defs><linearGradient id="tk${id}" x1="0" x2="1"><stop offset="0" stop-color="${COP[2]}"/><stop offset=".35" stop-color="${COP[1]}"/><stop offset=".5" stop-color="#F2B279"/><stop offset=".7" stop-color="${COP[0]}"/><stop offset="1" stop-color="${COP[2]}"/></linearGradient></defs>
    <rect x="${x}" y="${y + w * 0.3}" width="${w}" height="${h}" fill="url(#tk${id})"/><ellipse cx="${x + w / 2}" cy="${y + w * 0.3}" rx="${w / 2}" ry="${w * 0.3}" fill="url(#tk${id})"/>
    <path d="M${x} ${y + w * 0.3 + h} L ${x + w / 2} ${y + w * 0.3 + h + w * 0.4} L ${x + w} ${y + w * 0.3 + h} Z" fill="${COP[2]}"/>
    <path d="M${x + w * 0.15} ${y + w * 0.3 + h + w * 0.2} v ${w * 0.6} M${x + w * 0.85} ${y + w * 0.3 + h + w * 0.2} v ${w * 0.6}" stroke="#3A3530" stroke-width="6"/>
    <rect x="${x + w * 0.42}" y="${y + w * 0.3 + h * 0.4}" width="${w * 0.16}" height="${w * 0.1}" rx="3" fill="#2A2522"/>`;
  const pint = (x, y, s, c) => `<path d="M${x - 14 * s} ${y} h ${28 * s} l -3 ${46 * s} h ${-22 * s} z" fill="${c}" opacity=".95"/><path d="M${x - 14 * s} ${y} h ${28 * s} v ${6 * s} h ${-28 * s} z" fill="#FFF6E0"/><path d="M${x - 14 * s} ${y} h ${28 * s} l -3 ${46 * s} h ${-22 * s} z" fill="none" stroke="#fff" stroke-opacity=".4"/>`;
  const person = (x, y, s, c, seed) => { const q = rng(seed); return `<circle cx="${x}" cy="${y - 64 * s}" r="${14 * s}" fill="#2A211C"/><path d="M${x - 24 * s} ${y} q 0 ${-50 * s} ${24 * s} ${-50 * s} q ${24 * s} 0 ${24 * s} ${50 * s} z" fill="${c}"/>${q() > 0.4 ? pint(x + 22 * s, y - 40 * s, s * 0.7, beerC[["gold", "amber", "ipa", "dark"][Math.floor(q() * 4)]]) : ""}`; };
  const grain = (w, h, seed, op = 0.06) => { const q = rng(seed); let o = ""; for (let i = 0; i < 220; i++) o += `<rect x="${q() * w}" y="${q() * h}" width="2" height="2" fill="#fff" opacity="${q() * op}"/>`; return o; };

  function hero() {
    const lights = [200, 520, 840, 1160, 1480].map((x) => `<path d="M${x} 0 V 130" stroke="#111" stroke-width="2"/><path d="M${x - 26} 160 q 26 -50 52 0 z" fill="#1F1B18"/><ellipse cx="${x}" cy="162" rx="16" ry="6" fill="#FFCF7A"/><circle cx="${x}" cy="180" r="64" fill="#FFB547" opacity=".1"/><circle cx="${x}" cy="172" r="30" fill="#FFB547" opacity=".12"/>`).join("");
    const taps = [...Array(18)].map((_, i) => `<rect x="${520 + i * 36}" y="560" width="8" height="40" rx="3" fill="#C9C2B8"/><rect x="${516 + i * 36}" y="522" width="16" height="40" rx="5" fill="${["#D97706", "#1C1917", "#8C5426", "#E7E5E4", "#5B7F3A"][i % 5]}"/>`).join("");
    const crowd = [[180, 860, 1.6, "#3D2A1E"], [330, 880, 1.7, "#4A3A2A"], [1180, 870, 1.7, "#2F3A3A"], [1360, 880, 1.6, "#4B2E25"], [1500, 860, 1.5, "#3A3A2A"]].map(([x, y, s, c], i) => person(x, y, s, c, i + 3)).join("");
    return svg("0 0 1600 1000", `<rect width="1600" height="1000" fill="#1C1917"/>
      <rect x="0" y="60" width="1600" height="440" fill="#2A2420"/>${[...Array(9)].map((_, i) => `<rect x="${i * 180}" y="60" width="4" height="440" fill="#141210"/>`).join("")}<rect y="300" width="1600" height="4" fill="#141210"/>
      ${tank(80, 130, 180, 230, 1)}${tank(320, 110, 200, 260, 2)}${tank(1080, 110, 200, 260, 3)}${tank(1330, 130, 180, 230, 4)}
      <rect x="0" y="60" width="1600" height="440" fill="#FFF3DA" opacity=".05"/>
      ${lights}
      <rect x="380" y="500" width="840" height="40" fill="#3A2A1E"/>${taps}
      <rect x="0" y="600" width="1600" height="30" fill="#7A4A26"/><rect x="0" y="626" width="1600" height="12" fill="#5A3418"/>
      <rect x="0" y="638" width="1600" height="362" fill="#3A2416"/>${[...Array(14)].map((_, i) => `<path d="M0 ${660 + i * 24} H1600" stroke="#2E1C10" stroke-width="2" opacity=".7"/>`).join("")}
      ${[[600, 590], [700, 590], [880, 590], [1000, 590]].map(([x, y], i) => pint(x, y - 46, 1, beerC[["gold", "amber", "ipa", "dark"][i]])).join("")}
      <rect x="760" y="585" width="120" height="12" rx="4" fill="#8C5426"/>${[0, 1, 2, 3].map((i) => pint(778 + i * 28, 548, 0.55, beerC[["gold", "ipa", "amber", "dark"][i]])).join("")}
      ${crowd}${grain(1600, 1000, 7, 0.05)}`, "Illustration of the taproom with copper brewing tanks behind glass, a wooden bar with taps and guests enjoying flights");
  }

  const gallery = {
    bar: () => `<rect width="600" height="600" fill="#2A2420"/>${[...Array(10)].map((_, i) => `<rect x="${30 + i * 56}" y="200" width="16" height="60" rx="6" fill="${["#D97706", "#E7E5E4", "#8C5426", "#1C1917"][i % 4]}"/><rect x="${34 + i * 56}" y="258" width="8" height="40" fill="#C9C2B8"/>`).join("")}
      <rect y="300" width="600" height="40" fill="#7A4A26"/><rect y="340" width="600" height="260" fill="#3A2416"/>${[0, 1, 2, 3, 4].map((i) => pint(80 + i * 110, 250, 1.1, beerC[["gold", "amber", "ipa", "dark", "sour"][i]])).join("")}
      <rect x="0" y="0" width="600" height="160" fill="#1C1917"/>${[...Array(8)].map((_, i) => `<text x="${40 + (i % 2) * 290}" y="${40 + Math.floor(i / 2) * 32}" font-family="Oswald, Impact, sans-serif" font-size="20" fill="#FEF3C7" opacity=".85">${["SUMMIT HAZE", "BLUE RIDGE PILS", "COPPER LINE", "DARK HOLLOW", "TRAIL DUST", "FOG VALLEY", "FIREBREAK", "NIGHT SHIFT"][i]}</text>`).join("")}`,
    garden: () => `<rect width="600" height="600" fill="#F2B279"/><rect width="600" height="300" fill="#E9C9A1"/>
      <path d="M0 260 L 120 150 L 210 220 L 330 110 L 450 210 L 600 140 L 600 320 L 0 320 Z" fill="#5E6E80"/><path d="M0 300 L 150 210 L 280 280 L 420 200 L 600 270 L 600 340 L 0 340 Z" fill="#3E4E5E"/>
      <rect y="330" width="600" height="270" fill="#6E8A4E"/>${[...Array(12)].map((_, i) => `<circle cx="${i * 54}" cy="70" r="5" fill="#FFE2A0"/><circle cx="${i * 54}" cy="70" r="14" fill="#FFE2A0" opacity=".3"/>`).join("")}<path d="M0 66 Q 300 100 600 66" stroke="#3A3530" stroke-width="2" fill="none"/>
      ${[[130, 450], [430, 470]].map(([x, y]) => `<rect x="${x - 110}" y="${y}" width="220" height="16" fill="#8C5426"/><rect x="${x - 100}" y="${y + 16}" width="10" height="70" fill="#5A3418"/><rect x="${x + 90}" y="${y + 16}" width="10" height="70" fill="#5A3418"/><rect x="${x - 120}" y="${y + 50}" width="240" height="10" fill="#8C5426"/>${pint(x - 40, y - 46, 0.9, beerC.gold)}${pint(x + 30, y - 46, 0.9, beerC.amber)}`).join("")}
      <g transform="translate(300 540)"><ellipse rx="40" ry="16" fill="#B8865A"/><circle cx="34" cy="-18" r="14" fill="#B8865A"/><path d="M40 -28 l 10 -10" stroke="#8C5E3A" stroke-width="5"/></g>`,
    flight: () => `<rect width="600" height="600" fill="#5A3418"/>${[...Array(12)].map((_, i) => `<path d="M0 ${i * 50 + 20} H600" stroke="#4A2A12" stroke-width="3" opacity=".7"/>`).join("")}
      <rect x="60" y="250" width="480" height="110" rx="20" fill="#B8865A"/><rect x="60" y="250" width="480" height="110" rx="20" fill="none" stroke="#8C5E3A" stroke-width="4"/>
      ${[0, 1, 2, 3].map((i) => `<circle cx="${130 + i * 113}" cy="305" r="44" fill="#000" opacity=".15"/><circle cx="${130 + i * 113}" cy="300" r="40" fill="${beerC[["gold", "ipa", "amber", "dark"][i]]}"/><circle cx="${130 + i * 113}" cy="300" r="40" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3"/><ellipse cx="${118 + i * 113}" cy="288" rx="12" ry="6" fill="#FFF6E0" opacity=".6"/>`).join("")}
      ${[0, 1, 2, 3].map((i) => `<text x="${130 + i * 113}" y="400" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-size="16" fill="#FEF3C7">${["PILS", "HAZE", "COPPER", "HOLLOW"][i]}</text>`).join("")}`,
  };
  const galleryLabels = { bar: "Illustration of the bar with taps and the chalk tap list", garden: "Illustration of the beer garden patio with mountain views", flight: "Illustration of a four-beer flight board close-up" };

  function founders() {
    return svg("0 0 700 800", `<rect width="700" height="800" fill="#2A2420"/>${tank(20, 40, 200, 380, 9)}${tank(250, 20, 210, 400, 10)}${tank(490, 40, 200, 380, 11)}
      <rect y="600" width="700" height="200" fill="#57534E"/>${grain(700, 800, 4, 0.06)}
      ${[[170, "#3F5E4A", "#C9906A", "#2A1A10"], [350, "#1C1917", "#E0B28E", "#7A3E1C"], [530, "#7A4A26", "#8C5E3E", "#1A120C"]].map(([x, shirt, skin, hair], i) => `
        <path d="M${x - 95} 800 L ${x - 85} 560 Q ${x} 500 ${x + 85} 560 L ${x + 95} 800 Z" fill="${shirt}"/>
        <path d="M${x - 70} 620 Q ${x} 660 ${x + 70} 620 L ${x + 70} 650 Q ${x} 690 ${x - 70} 650 Z" fill="${skin}"/>
        <rect x="${x - 18}" y="470" width="36" height="50" fill="${skin}"/><circle cx="${x}" cy="430" r="58" fill="${skin}"/>
        <path d="M${x - 60} 420 q 0 -80 60 -80 q 62 0 60 80 q -20 -40 -60 -40 q -40 0 -60 40z" fill="${hair}"/>${i === 2 ? `<path d="M${x - 40} 460 q 40 50 80 0 q -10 40 -40 46 q -30 -6 -40 -46z" fill="${hair}"/>` : ""}
        <path d="M${x - 22} 452 q 22 18 44 0" stroke="#3A2016" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="${x - 20}" cy="420" r="5" fill="#1A120C"/><circle cx="${x + 20}" cy="420" r="5" fill="#1A120C"/>`).join("")}`, "Illustration of the three founders standing in front of the brewing tanks, arms crossed, grinning");
  }

  const products = {
    pack: () => `<rect width="400" height="400" fill="#E7E5E4"/><path d="M80 140 L 200 100 L 320 140 L 320 310 L 200 350 L 80 310 Z" fill="#1C1917"/><path d="M200 100 V 350 M80 140 L 200 180 L 320 140" stroke="#D97706" stroke-width="3" fill="none"/>
      <path d="M100 200 l 30 -30 l 20 18 l 25 -32 l 30 44" stroke="#FEF3C7" stroke-width="5" fill="none" stroke-linejoin="round"/><text x="140" y="250" text-anchor="middle" font-family="Oswald, Impact, sans-serif" font-size="22" fill="#FEF3C7" transform="skewY(18) translate(0 -46)">MIXED 12</text>
      ${[0, 1, 2, 3].map((i) => `<rect x="${222 + (i % 2) * 44}" y="${190 + Math.floor(i / 2) * 64}" width="34" height="56" rx="6" fill="${["#E8B53A", "#5B7F3A", "#C46A1E", "#E7E5E4"][i]}" transform="skewY(-18) translate(0 ${74 + (i % 2) * 14})"/>`).join("")}`,
    hoodie: () => `<rect width="400" height="400" fill="#D6D3D1"/><path d="M130 90 Q 200 60 270 90 L 340 140 L 320 330 L 280 320 L 280 350 L 120 350 L 120 320 L 80 330 L 60 140 Z" fill="#3A3836"/><path d="M160 90 Q 200 150 240 90" stroke="#2A2826" stroke-width="10" fill="none"/>
      <path d="M200 130 v 60" stroke="#2A2826" stroke-width="3"/><path d="M175 200 l 14 -14 l 10 8 l 12 -16 l 14 22" stroke="#D97706" stroke-width="4" fill="none" stroke-linejoin="round"/><rect x="150" y="270" width="100" height="44" rx="8" fill="#2F2D2B"/>`,
    paddle: () => `<rect width="400" height="400" fill="#EDE7DF"/><rect x="50" y="160" width="270" height="80" rx="16" fill="#9A6B43"/><rect x="310" y="185" width="70" height="30" rx="12" fill="#9A6B43"/>${[0, 1, 2, 3].map((i) => `<circle cx="${95 + i * 62}" cy="200" r="24" fill="#6E4A2C"/><circle cx="${95 + i * 62}" cy="200" r="18" fill="${beerC[["gold", "ipa", "amber", "dark"][i]]}"/>`).join("")}${[...Array(6)].map((_, i) => `<path d="M60 ${170 + i * 12} q 120 4 250 0" stroke="#7E5534" stroke-width="1.5" fill="none" opacity=".6"/>`).join("")}`,
    gift: () => `<rect width="400" height="400" fill="#292524"/><g transform="rotate(-8 200 200)"><rect x="70" y="120" width="260" height="160" rx="14" fill="#D97706"/><rect x="70" y="120" width="260" height="160" rx="14" fill="none" stroke="#FEF3C7" stroke-opacity=".3" stroke-width="2"/>
      <path d="M100 180 l 26 -26 l 16 14 l 22 -28 l 28 40" stroke="#1C1917" stroke-width="5" fill="none" stroke-linejoin="round"/><text x="100" y="250" font-family="Oswald, Impact, sans-serif" font-size="26" fill="#1C1917" letter-spacing="2">IRON RIDGE</text><text x="300" y="166" text-anchor="end" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1C1917">GIFT CARD</text></g>`,
  };
  const productLabels = { pack: "Mixed 12-pack variety box", hoodie: "Charcoal hoodie with mountain logo", paddle: "Wooden flight paddle", gift: "Iron Ridge branded gift card" };

  function wncMap() {
    return `<rect width="800" height="560" fill="#E7E5E4"/>
      <path d="M0 360 L 80 300 L 150 330 L 240 250 L 330 300 L 420 220 L 520 280 L 600 230 L 700 290 L 800 250 L 800 560 L 0 560 Z" fill="#D6D3D1"/>
      <path d="M0 430 L 120 380 L 220 420 L 340 360 L 460 410 L 560 360 L 680 400 L 800 370 L 800 560 L 0 560 Z" fill="#C9C5C1"/>
      <path d="M0 160 C 120 200 200 140 300 180 S 480 260 560 220 S 720 160 800 190" fill="none" stroke="#9CC3D5" stroke-width="10" opacity=".8"/>
      <path d="M380 0 C 400 120 360 220 410 300 S 420 460 400 560" fill="none" stroke="#9CC3D5" stroke-width="8" opacity=".8"/>
      <path d="M0 300 H 800 M 420 0 V 560" stroke="#fff" stroke-width="5" opacity=".9"/><path d="M120 0 L 700 560" stroke="#fff" stroke-width="3" opacity=".6"/>
      <text x="436" y="292" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#57534E">Asheville</text>
      <text x="660" y="232" font-family="Inter, sans-serif" font-size="13" fill="#78716C">Morganton</text>
      <text x="40" y="520" font-family="Oswald, Impact, sans-serif" font-size="18" letter-spacing="3" fill="#A8A29E">BLUE RIDGE MOUNTAINS</text>`;
  }

  window.Art = { hero, gallery: (n) => svg("0 0 600 600", gallery[n](), galleryLabels[n]), founders, product: (n) => svg("0 0 400 400", products[n](), productLabels[n]), wncMap };
})();
