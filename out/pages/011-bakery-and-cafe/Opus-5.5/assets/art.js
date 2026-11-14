// Original SVG illustrations used in place of photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label, par = "xMidYMid slice") => `<svg viewBox="${vb}" preserveAspectRatio="${par}" xmlns="http://www.w3.org/2000/svg"${label ? ` role="img" aria-label="${label}"` : ` aria-hidden="true"`}>${body}</svg>`;
  const C = { crust: "#B5652A", crustD: "#8A4518", gold: "#D9953F", goldL: "#F0C27A", crumb: "#F6E3BE", flour: "#FBF6EC", cream: "#FEF3C7", brown: "#451A03", wood: "#A86B3C", woodD: "#7C4A26", marble: "#ECE7E1" };

  // Food painters draw into a 200x200 box centred on (100,100).
  const food = {
    boule: () => `<ellipse cx="100" cy="128" rx="78" ry="16" fill="#000" opacity=".12"/><path d="M24 118 C 24 58 176 58 176 118 C 176 136 24 136 24 118 Z" fill="${C.crust}"/><path d="M34 110 C 40 72 160 72 166 110" fill="${C.gold}" opacity=".55"/>
      <path d="M62 84 q 38 -14 76 0 M58 100 q 42 -16 84 0" stroke="${C.goldL}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="80" cy="94" r="2" fill="${C.flour}"/><circle cx="120" cy="88" r="2.5" fill="${C.flour}"/>`,
    croissant: () => `<ellipse cx="100" cy="134" rx="74" ry="12" fill="#000" opacity=".12"/>
      <path d="M30 120 Q 40 74 100 70 Q 160 74 170 120 Q 150 126 136 112 Q 120 130 100 128 Q 80 130 64 112 Q 50 126 30 120 Z" fill="${C.gold}"/>
      <path d="M64 112 Q 70 84 100 78 Q 130 84 136 112" fill="none" stroke="${C.crust}" stroke-width="4"/><path d="M84 124 Q 86 90 100 78 Q 114 90 116 124" fill="none" stroke="${C.crust}" stroke-width="4"/>
      <path d="M30 120 Q 40 74 100 70 Q 160 74 170 120" fill="none" stroke="${C.crustD}" stroke-width="3" opacity=".6"/>`,
    almond: () => `${food.croissant()}${[[76, 92, 20], [96, 84, -10], [118, 90, 30], [104, 100, 70], [86, 104, -40]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4" transform="rotate(${r} ${x} ${y})" fill="#F3DEC0" stroke="#C99A62"/>`).join("")}
      ${[...Array(18)].map((_, i) => `<circle cx="${60 + (i * 37) % 80}" cy="${80 + (i * 17) % 34}" r="1.6" fill="#fff"/>`).join("")}`,
    latte: (art = "#FBF1DF", base = "#B9783F") => `<ellipse cx="100" cy="150" rx="74" ry="12" fill="#000" opacity=".12"/><ellipse cx="100" cy="140" rx="82" ry="18" fill="#EDE6DB"/>
      <path d="M44 88 Q 48 148 100 150 Q 152 148 156 88 Z" fill="#E9D7C2"/><path d="M152 98 q 26 0 24 20 q -2 18 -28 16" stroke="#E9D7C2" stroke-width="9" fill="none"/>
      <ellipse cx="100" cy="88" rx="56" ry="16" fill="${base}"/><path d="M100 76 c -18 4 -22 16 -6 22 c -10 2 -12 6 -4 8 c 12 2 26 -4 30 -14 c 4 -8 -6 -18 -20 -16 z" fill="${art}"/>`,
    lavender: () => `${food.latte("#F6EEF8", "#A6875F")}${[0, 1, 2].map((k) => `<path d="M${160 + k * 8} 60 l -6 30" stroke="#5A7D4A" stroke-width="2"/>${[0, 1, 2, 3].map((j) => `<ellipse cx="${160 + k * 8 - j * 1.4}" cy="${56 + j * 7}" rx="3.5" ry="3" fill="#8E6BB3"/>`).join("")}`).join("")}`,
    baguette: () => `<ellipse cx="100" cy="132" rx="84" ry="10" fill="#000" opacity=".12"/><rect x="18" y="98" width="164" height="34" rx="17" transform="rotate(-12 100 115)" fill="${C.crust}"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${46 + i * 34} ${118 - i * 7} q 10 -12 22 -8" stroke="${C.goldL}" stroke-width="5" stroke-linecap="round" fill="none"/>`).join("")}`,
    focaccia: () => `<rect x="28" y="72" width="144" height="70" rx="12" fill="${C.goldL}"/><rect x="28" y="72" width="144" height="70" rx="12" fill="none" stroke="${C.gold}" stroke-width="4"/>
      ${[...Array(12)].map((_, i) => `<circle cx="${46 + (i % 6) * 22}" cy="${90 + Math.floor(i / 6) * 30}" r="4" fill="${C.gold}"/>`).join("")}
      ${[[60, 98], [110, 116], [146, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#3F4A2E"/>`).join("")}${[[86, 92], [132, 120]].map(([x, y]) => `<path d="M${x} ${y} l 14 -6 M${x + 4} ${y} l 4 -8" stroke="#4E6B3A" stroke-width="2"/>`).join("")}`,
    ciabatta: () => `<path d="M30 124 Q 34 80 100 82 Q 166 80 170 124 Z" fill="#E2B579"/><path d="M30 124 Q 34 80 100 82 Q 166 80 170 124" stroke="${C.gold}" stroke-width="4" fill="none"/>${[...Array(14)].map((_, i) => `<circle cx="${50 + (i * 23) % 100}" cy="${96 + (i * 7) % 22}" r="2" fill="${C.flour}"/>`).join("")}`,
    rye: () => `<rect x="38" y="70" width="124" height="70" rx="22" fill="#5B3420"/><path d="M50 84 h 100" stroke="#3E2214" stroke-width="3"/>${[...Array(10)].map((_, i) => `<ellipse cx="${56 + (i * 31) % 90}" cy="${100 + (i * 13) % 30}" rx="3" ry="1.6" fill="#8C6A44"/>`).join("")}`,
    multigrain: () => `${food.rye().replace("#5B3420", "#9A5E2E").replace("#3E2214", "#7C4520")}${[...Array(16)].map((_, i) => `<ellipse cx="${50 + (i * 29) % 100}" cy="${74 + (i * 3) % 8}" rx="3" ry="1.6" fill="#F3E2BF"/>`).join("")}`,
    muffin: () => `<path d="M58 110 l 10 40 h 64 l 10 -40 z" fill="#C48A5C"/>${[0, 1, 2, 3, 4].map((i) => `<path d="M${66 + i * 16} 112 l 4 38" stroke="#A86F43" stroke-width="2"/>`).join("")}<path d="M48 112 Q 52 62 100 60 Q 148 62 152 112 Z" fill="${C.gold}"/>${[[78, 88], [112, 80], [96, 100], [126, 98]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#4C3B8C"/>`).join("")}`,
    scone: () => `<path d="M40 136 L 100 64 L 160 136 Z" fill="${C.goldL}"/><path d="M40 136 L 100 64 L 160 136" stroke="${C.gold}" stroke-width="5" fill="none"/>${[[90, 110], [110, 120], [100, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#B91C1C"/>`).join("")}`,
    cookie: () => `<circle cx="100" cy="104" r="54" fill="${C.goldL}"/><circle cx="100" cy="104" r="54" fill="none" stroke="${C.gold}" stroke-width="4"/>${[[80, 90], [116, 86], [96, 120], [124, 116], [72, 116]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="8" rx="2" fill="#4A2814"/>`).join("")}`,
    cinnamon: () => `<circle cx="100" cy="104" r="54" fill="${C.gold}"/><path d="M100 104 m -6 0 a 6 6 0 1 1 12 0 a 14 14 0 1 1 -28 0 a 22 22 0 1 1 44 0 a 30 30 0 1 1 -60 0 a 38 38 0 1 1 76 0" stroke="${C.crust}" stroke-width="5" fill="none"/><path d="M70 80 q 30 20 60 0" stroke="#fff" stroke-width="6" fill="none" opacity=".85"/>`,
    tart: () => `<ellipse cx="100" cy="110" rx="62" ry="30" fill="${C.gold}"/><ellipse cx="100" cy="104" rx="52" ry="22" fill="#F4E3B5"/>${[[80, 100], [100, 96], [120, 102], [92, 110], [112, 112]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${["#B91C1C", "#4C3B8C", "#E07B39"][i % 3]}"/>`).join("")}`,
    sandwich: () => `<path d="M30 104 Q 100 70 170 104 L 166 116 Q 100 86 34 116 Z" fill="${C.gold}"/><path d="M34 116 Q 100 92 166 116" stroke="#6E9C3E" stroke-width="8" fill="none"/><path d="M36 122 Q 100 100 164 122" stroke="#F2C94C" stroke-width="7" fill="none"/><path d="M38 128 Q 100 108 162 128" stroke="#C2410C" stroke-width="6" fill="none"/><path d="M36 134 Q 100 122 164 134 L 160 144 Q 100 134 40 144 Z" fill="${C.goldL}"/>`,
    eggs: () => `<circle cx="100" cy="104" r="62" fill="#F1ECE4"/><ellipse cx="84" cy="98" rx="26" ry="22" fill="#fff"/><circle cx="84" cy="98" r="10" fill="#F2A93B"/><ellipse cx="122" cy="114" rx="24" ry="20" fill="#fff"/><circle cx="122" cy="114" r="9" fill="#F2A93B"/><rect x="70" y="132" width="60" height="12" rx="6" fill="${C.goldL}" transform="rotate(-8 100 138)"/>`,
    quiche: () => `<circle cx="100" cy="104" r="58" fill="${C.gold}"/><circle cx="100" cy="104" r="48" fill="#F6D98B"/>${[[86, 92], [114, 98], [98, 118], [76, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#4E7A3A"/>`).join("")}<path d="M100 104 L 148 80 A 58 58 0 0 1 152 120 Z" fill="${C.flour}" opacity=".9"/>`,
    soup: () => `<ellipse cx="100" cy="116" rx="70" ry="22" fill="#E7DED2"/><path d="M34 106 Q 40 150 100 150 Q 160 150 166 106 Z" fill="#F4EFE8"/><ellipse cx="100" cy="106" rx="64" ry="18" fill="#D06A2A"/><path d="M80 104 q 20 -8 40 0" stroke="#F6E3BE" stroke-width="4" fill="none"/>${[[70, 104], [128, 108]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#4E7A3A"/>`).join("")}`,
    salad: () => `<ellipse cx="100" cy="116" rx="70" ry="22" fill="#E7DED2"/><path d="M34 106 Q 40 150 100 150 Q 160 150 166 106 Z" fill="#F4EFE8"/>${[...Array(10)].map((_, i) => `<ellipse cx="${56 + (i * 41) % 90}" cy="${96 + (i * 7) % 16}" rx="16" ry="9" transform="rotate(${i * 37} ${56 + (i * 41) % 90} ${96 + (i * 7) % 16})" fill="${["#6E9C3E", "#4E7A3A", "#8DB255"][i % 3]}"/>`).join("")}<circle cx="96" cy="94" r="7" fill="#C2410C"/><circle cx="122" cy="100" r="6" fill="#C2410C"/>`,
    iced: () => `<path d="M64 52 h 72 l -8 104 h -56 z" fill="#E9F2F4" opacity=".9"/><path d="M68 80 h 64 l -6 74 h -52 z" fill="#7A4A26"/><path d="M68 80 h 64 l -2 20 h -60 z" fill="#E9D7C2"/>${[[82, 96], [108, 110], [92, 128]].map(([x, y]) => `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="#fff" opacity=".6"/>`).join("")}<path d="M118 40 l -8 60" stroke="#B45309" stroke-width="5"/>`,
    tea: () => `${food.latte("#E9D7A5", "#C59A4A")}`.replace(/<path d="M100 76[^>]*>/, ""),
    espresso: () => `<ellipse cx="100" cy="138" rx="56" ry="12" fill="#EDE6DB"/><path d="M66 96 Q 70 136 100 138 Q 130 136 134 96 Z" fill="#E9D7C2"/><ellipse cx="100" cy="96" rx="34" ry="10" fill="#6A3714"/><ellipse cx="100" cy="96" rx="22" ry="5" fill="#B9783F"/><path d="M132 104 q 16 0 14 12 q -2 10 -16 10" stroke="#E9D7C2" stroke-width="6" fill="none"/>`,
  };
  const plates = { a: "#F6EBD9", b: "#EFE3CF", c: "#F3E6D3" };
  function dish(name, bg = "a", label = "") { return svg("0 0 200 200", `<rect width="200" height="200" fill="${plates[bg] || bg}"/>${food[name]()}`, label); }

  function hero() {
    const r = rng(5);
    let dust = ""; for (let i = 0; i < 120; i++) dust += `<circle cx="${r() * 1600}" cy="${560 + r() * 380}" r="${0.8 + r() * 2.4}" fill="#fff" opacity="${0.35 + r() * 0.5}"/>`;
    let veins = ""; for (let i = 0; i < 9; i++) veins += `<path d="M${r() * 1600} ${520 + r() * 120} C ${r() * 1600} ${620 + r() * 120} ${r() * 1600} ${760 + r() * 100} ${r() * 1600} 1000" stroke="#C9C0B6" stroke-width="${0.8 + r() * 1.2}" fill="none" opacity=".28"/>`;
    const crois = (x, y, s, rot) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(-100 -100)">${food.croissant()}</g>`;
    return svg("0 0 1600 1000", `<defs><linearGradient id="hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset="1" stop-color="#7A5034"/></linearGradient>
      <radialGradient id="hl" cx=".78" cy=".1" r=".9"><stop offset="0" stop-color="#FFF1CF" stop-opacity=".85"/><stop offset=".5" stop-color="#FFE1A6" stop-opacity=".2"/><stop offset="1" stop-color="#FFE1A6" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="700" fill="url(#hw)"/>${[...Array(9)].map((_, i) => `<rect x="${i * 180}" y="0" width="176" height="560" fill="#6A4329" opacity="${0.3 + (i % 3) * 0.15}"/>`).join("")}
      <rect x="1120" y="40" width="380" height="420" fill="#FCE9C2" opacity=".55"/><path d="M1310 40 V460 M1120 250 H1500" stroke="#4A2E1A" stroke-width="14"/>
      ${[260, 520, 900].map((x) => `<path d="M${x} 0 V 150" stroke="#2A1A10" stroke-width="2"/><circle cx="${x}" cy="170" r="20" fill="#FFD27A" opacity=".9"/><circle cx="${x}" cy="170" r="54" fill="#FFD27A" opacity=".18"/>`).join("")}
      <g transform="translate(0 120)"><rect y="540" width="1600" height="460" fill="${C.marble}"/>${veins}<rect y="540" width="1600" height="14" fill="#D9D1C8"/>
      <ellipse cx="760" cy="760" rx="420" ry="80" fill="#B9A792" opacity=".25"/>
      <rect x="430" y="640" width="660" height="40" rx="8" fill="${C.wood}"/><rect x="430" y="676" width="660" height="10" fill="${C.woodD}"/>
      ${crois(560, 610, 1.6, -8)}${crois(760, 600, 1.7, 6)}${crois(960, 615, 1.5, -4)}${crois(660, 690, 1.5, 12)}${crois(870, 700, 1.6, -10)}
      ${crois(300, 820, 1.3, 20)}${crois(1260, 800, 1.4, -18)}
      <g transform="translate(1180 520) scale(1.3)">${food.latte()}</g>
      ${dust}</g><rect width="1600" height="1000" fill="url(#hl)"/>`, "Illustration of fresh croissants on a marble counter with flour dust and morning light");
  }

  function bakers() {
    return svg("0 0 600 760", `<rect width="600" height="760" fill="#E9D6B8"/>
      ${[...Array(6)].map((_, i) => `<rect x="0" y="${i * 90}" width="600" height="6" fill="#D8C29F"/>`).join("")}
      <rect x="30" y="80" width="160" height="300" fill="#F6E3BE" opacity=".7"/><rect x="40" y="90" width="140" height="280" fill="#FFF3D6"/>
      ${[0, 1, 2].map((i) => `<rect x="400" y="${120 + i * 90}" width="170" height="8" fill="${C.woodD}"/>${[0, 1, 2].map((j) => `<g transform="translate(${420 + j * 50} ${88 + i * 90}) scale(.28)">${food.boule()}</g>`).join("")}`).join("")}
      <g><circle cx="220" cy="300" r="70" fill="#B07850"/><path d="M150 290 q 0 -90 74 -86 q 70 4 66 84 q -18 -44 -70 -40 q -48 2 -70 42z" fill="#3B2416"/>
      <path d="M100 760 L 110 470 Q 120 400 220 392 Q 320 400 330 470 L 340 760 Z" fill="#6E8A7A"/><path d="M160 430 L 160 760 L 280 760 L 280 430 Q 220 446 160 430 Z" fill="#F4EEE4"/><path d="M180 430 q 40 -50 80 0" stroke="#F4EEE4" stroke-width="10" fill="none"/>
      <path d="M196 320 q 24 18 48 0" stroke="#5A3420" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="196" cy="290" r="5" fill="#2A1A10"/><circle cx="244" cy="290" r="5" fill="#2A1A10"/></g>
      <g><circle cx="400" cy="270" r="66" fill="#D6A57C"/><path d="M330 280 q -10 -110 74 -104 q 90 6 70 120 q 10 60 30 110 q -60 10 -80 -30 q 10 -60 -10 -90 q -50 -10 -84 -6z" fill="#7A3E1C"/>
      <path d="M290 760 L 300 450 Q 310 380 400 372 Q 490 380 500 450 L 510 760 Z" fill="#C2410C"/><path d="M350 410 L 350 760 L 460 760 L 460 410 Q 405 424 350 410 Z" fill="#F4EEE4"/>
      <path d="M376 292 q 24 18 48 0" stroke="#7A3E1C" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="378" cy="262" r="5" fill="#2A1A10"/><circle cx="424" cy="262" r="5" fill="#2A1A10"/></g>
      <ellipse cx="270" cy="560" rx="60" ry="18" fill="#F6E3BE"/><g transform="translate(270 520) scale(.7)">${food.boule()}</g>`, "Illustration of bakers Elena and Marcus in aprons, smiling in their kitchen");
  }

  const scenes = {
    interior: () => `<rect width="600" height="800" fill="#8C4A2E"/>${[...Array(30)].map((_, i) => `<rect x="${(i % 5) * 124 + (Math.floor(i / 5) % 2) * 60 - 30}" y="${Math.floor(i / 5) * 40}" width="118" height="34" rx="3" fill="${["#A0573A", "#93502F", "#B0663F"][i % 3]}"/>`).join("")}
      ${[120, 300, 480].map((x, i) => `<path d="M${x} 0 V ${200 + i * 30}" stroke="#2A1A10" stroke-width="2"/><ellipse cx="${x}" cy="${214 + i * 30}" rx="12" ry="18" fill="#FFD27A"/><circle cx="${x}" cy="${214 + i * 30}" r="46" fill="#FFD27A" opacity=".2"/>`).join("")}
      <rect y="560" width="600" height="240" fill="#6B3E22"/>${[60, 330].map((x) => `<rect x="${x}" y="520" width="210" height="18" rx="4" fill="${C.wood}"/><rect x="${x + 16}" y="538" width="10" height="120" fill="${C.woodD}"/><rect x="${x + 184}" y="538" width="10" height="120" fill="${C.woodD}"/><circle cx="${x + 60}" cy="512" r="12" fill="#F4EEE4"/><circle cx="${x + 140}" cy="512" r="10" fill="#E9D7C2"/>`).join("")}`,
    torn: () => `<rect width="600" height="600" fill="#E7D8C3"/><g transform="translate(80 120) scale(2.2)">${food.croissant()}</g>
      <path d="M260 210 q 30 40 10 90 q -20 40 0 80" stroke="#F6E3BE" stroke-width="40" fill="none" stroke-linecap="round"/>${[...Array(18)].map((_, i) => `<path d="M${250 + (i % 3) * 14} ${220 + i * 9} q 10 -4 20 0" stroke="#E9C88E" stroke-width="2" fill="none"/>`).join("")}`,
    pour: () => `<rect width="600" height="700" fill="#4A2A17"/><g transform="translate(120 300) scale(1.8)">${food.latte()}</g><path d="M300 60 C 296 200 306 340 300 440" stroke="#F3E3C9" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M220 20 h 160 l -30 60 h -100 z" fill="#C0C4C8"/>`,
    case: () => `<rect width="600" height="500" fill="#F4EEE4"/><rect x="20" y="40" width="560" height="420" rx="10" fill="#E6F0F2" opacity=".6" stroke="#B9C6CA" stroke-width="4"/>
      ${[0, 1, 2].map((row) => `<rect x="30" y="${170 + row * 130}" width="540" height="8" fill="#C9B9A3"/>${[0, 1, 2, 3, 4].map((c) => `<g transform="translate(${44 + c * 106} ${86 + row * 130}) scale(.45)">${food[["tart", "muffin", "cinnamon", "scone", "cookie", "almond"][(row * 5 + c) % 6]]()}</g>`).join("")}`).join("")}`,
    patio: () => `<rect width="600" height="760" fill="#F0E2CC"/><rect x="40" y="60" width="520" height="380" fill="#E9D6B8"/><rect x="80" y="100" width="180" height="260" fill="#3C4A52" opacity=".7"/><rect x="340" y="100" width="180" height="260" fill="#3C4A52" opacity=".7"/>
      <path d="M40 60 h 520 l -30 -40 h -460 z" fill="#B45309"/>${[...Array(9)].map((_, i) => `<path d="M${70 + i * 52} 20 l -6 40" stroke="#FFFBEB" stroke-width="16" opacity=".8"/>`).join("")}
      ${[80, 340].map((x) => `<rect x="${x}" y="360" width="180" height="40" fill="${C.wood}"/>${[...Array(8)].map((_, i) => `<circle cx="${x + 12 + i * 22}" cy="${352 - (i % 2) * 10}" r="11" fill="${["#DB2777", "#F59E0B", "#FDE68A", "#C026D3"][i % 4]}"/>`).join("")}`).join("")}
      <rect y="440" width="600" height="320" fill="#C9B79C"/>${[150, 420].map((x) => `<circle cx="${x}" cy="560" r="56" fill="#2F3E46"/><rect x="${x - 4}" y="560" width="8" height="120" fill="#2F3E46"/><path d="M${x - 90} 620 v 70 M${x - 90} 620 h 40 v -50" stroke="#2F3E46" stroke-width="6" fill="none"/><path d="M${x + 90} 620 v 70 M${x + 90} 620 h -40 v -50" stroke="#2F3E46" stroke-width="6" fill="none"/>`).join("")}`,
    racks: () => `<rect width="600" height="600" fill="#D9C3A2"/>${[0, 1, 2].map((row) => `<path d="M20 ${200 + row * 170} h 560" stroke="#6B6B6B" stroke-width="4"/>${[...Array(12)].map((_, i) => `<path d="M${30 + i * 48} ${196 + row * 170} v 8" stroke="#6B6B6B" stroke-width="2"/>`).join("")}${[0, 1, 2, 3].map((c) => `<g transform="translate(${30 + c * 140} ${86 + row * 170}) scale(.66)">${food[["boule", "baguette", "multigrain", "boule"][(row + c) % 4]]()}</g>`).join("")}`).join("")}`,
  };
  function scene(name, label) {
    const vb = { interior: "0 0 600 800", torn: "0 0 600 600", pour: "0 0 600 700", case: "0 0 600 500", patio: "0 0 600 760", racks: "0 0 600 600" }[name];
    return svg(vb, scenes[name](), label);
  }

  function platter() {
    const items = ["croissant", "muffin", "scone", "cinnamon", "tart", "cookie", "almond", "muffin", "tart"];
    return svg("0 0 700 560", `<rect width="700" height="560" fill="#E9DCC7"/><rect x="40" y="90" width="620" height="380" rx="26" fill="${C.wood}"/><rect x="40" y="90" width="620" height="380" rx="26" fill="none" stroke="${C.woodD}" stroke-width="8"/>
      ${[...Array(10)].map((_, i) => `<path d="M60 ${120 + i * 36} H640" stroke="${C.woodD}" stroke-width="2" opacity=".4"/>`).join("")}
      ${items.map((n, i) => `<g transform="translate(${70 + (i % 3) * 190} ${100 + Math.floor(i / 3) * 118}) scale(.78)">${food[n]()}</g>`).join("")}
      <circle cx="650" cy="80" r="40" fill="#F4EEE4"/><path d="M630 70 q 20 -20 40 0" stroke="#6E9C3E" stroke-width="6" fill="none"/>`, "Illustration of a pastry platter arranged on a wooden board");
  }

  function box() {
    return svg("0 0 600 480", `<rect width="600" height="480" fill="#FEF3C7"/><ellipse cx="300" cy="410" rx="240" ry="26" fill="#E8D3A2"/>
      <path d="M110 220 L 300 270 L 490 220 L 490 400 L 300 450 L 110 400 Z" fill="#C49A6C"/><path d="M300 270 V 450" stroke="#A47A4E" stroke-width="3"/>
      <path d="M110 220 L 300 170 L 490 220 L 300 270 Z" fill="#8F6A43"/>
      <path d="M110 220 L 60 140 L 250 96 L 300 170 Z" fill="#D7B286"/><path d="M490 220 L 540 140 L 350 96 L 300 170 Z" fill="#CBA478"/>
      <g transform="translate(150 140) rotate(-14) scale(.9)"><path d="M20 90 C 20 40 180 40 180 90 C 180 110 20 110 20 90Z" fill="#E7D5B5"/><path d="M60 62 v 44 M140 62 v 44" stroke="#B91C1C" stroke-width="3"/></g>
      <g transform="translate(270 120) rotate(10) scale(.9)">${food.baguette()}</g>
      <g transform="translate(330 160) scale(.6)">${food.almond()}</g>
      <rect x="230" y="320" width="140" height="56" rx="6" fill="#F6EFE4" transform="rotate(-6 300 348)"/><text x="300" y="356" text-anchor="middle" font-family="'Dancing Script', cursive" font-size="24" fill="#92400E" transform="rotate(-6 300 348)">Bread Box</text>`, "Illustration of an open box with bread wrapped in kraft paper and a pastry");
  }

  function map() {
    const r = rng(23); let blocks = "";
    for (let i = 0; i < 26; i++) blocks += `<rect x="${(i % 6) * 110 + 14}" y="${Math.floor(i / 6) * 110 + 14}" width="${70 + r() * 20}" height="${70 + r() * 20}" rx="6" fill="${r() > 0.8 ? "#D6E6C3" : "#EFE6D6"}"/>`;
    return svg("0 0 660 520", `<rect width="660" height="520" fill="#FBF6EC"/>${blocks}
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M0 ${104 + i * 110} H660" stroke="#fff" stroke-width="18"/>`).join("")}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${104 + i * 110} 0 V520" stroke="#fff" stroke-width="18"/>`).join("")}
      <path d="M0 324 H660" stroke="#FDE2A7" stroke-width="22"/><text x="20" y="318" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#92400E">ELM STREET</text>
      <text x="330" y="98" font-family="Inter, sans-serif" font-size="12" fill="#8C7A66" transform="rotate(90 330 98)">Maple Ave</text>
      <rect x="400" y="350" width="80" height="60" rx="6" fill="#E3D6C0"/><text x="440" y="385" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#6B5A48">P</text>
      <g transform="translate(372 300)"><circle r="40" fill="#B45309" opacity=".18"/><path d="M0 -40 c 20 0 30 14 30 28 c 0 22 -30 44 -30 44 s -30 -22 -30 -44 c 0 -14 10 -28 30 -28z" fill="#B45309"/><circle cy="-12" r="11" fill="#FFFBEB"/></g>`, "Map of Elm Street in Maplewood Village showing Golden Crumb and the parking lot behind it");
  }

  function signature() {
    return svg("0 0 260 70", `<path d="M10 50 c 20 -40 40 -40 30 0 c -6 20 30 -30 40 -10 c 6 12 20 -10 30 0" stroke="#92400E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <text x="96" y="46" font-family="'Dancing Script', cursive" font-size="34" fill="#92400E">Elena &amp; Marcus</text>`, "Signature: Elena and Marcus", "xMinYMid meet");
  }

  window.Art = { hero, dish, scene, platter, box, map, bakers, signature };
})();
