// Original SVG illustrations used in place of photography (no licensed photos are bundled).
(function () {
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  let u = 0;
  const hinoki = (x, y, w, h) => { const id = `hk${++u}`; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9C998"/><stop offset="1" stop-color="#C99E66"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>${[...Array(Math.ceil(h / 14))].map((_, i) => `<path d="M${x} ${y + i * 14 + 6} C ${x + w * 0.3} ${y + i * 14 + 2} ${x + w * 0.6} ${y + i * 14 + 10} ${x + w} ${y + i * 14 + 5}" stroke="#B88A54" stroke-width="1" opacity=".35" fill="none"/>`).join("")}`; };
  const warm = (w, h, cx = 0.5, cy = 0.2) => { const id = `wl${++u}`; return `<defs><radialGradient id="${id}" cx="${cx}" cy="${cy}" r=".8"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`; };
  const fish = { otoro: ["#F3B4A8", "#FBE3DC"], uni: ["#F2A93B", "#F7C96A"], masu: ["#F4A7A0", "#FCD7D2"], salmon: ["#F08A5D", "#F9C3A6"], tai: ["#F6E6E0", "#FFFFFF"], aji: ["#B9C3CC", "#E5ECF1"] };
  const nigiri = (x, y, s, kind) => {
    const [a, b] = fish[kind];
    const top = kind === "uni"
      ? [...Array(6)].map((_, i) => `<ellipse cx="${-30 + i * 12}" cy="${-14 - (i % 2) * 3}" rx="10" ry="8" fill="${i % 2 ? a : b}"/>`).join("")
      : `<path d="M-46 -6 Q -40 -30 0 -32 Q 40 -30 46 -6 Q 40 2 0 0 Q -40 2 -46 -6 Z" fill="${a}"/>${kind === "otoro" ? [...Array(5)].map((_, i) => `<path d="M${-34 + i * 16} -26 q 6 12 2 22" stroke="${b}" stroke-width="3" fill="none" opacity=".9"/>`).join("") : `<path d="M-30 -22 q 30 -8 60 0" stroke="${b}" stroke-width="3" fill="none"/>`}<ellipse cx="-12" cy="-24" rx="14" ry="3" fill="#fff" opacity=".35"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="14" rx="46" ry="10" fill="#000" opacity=".3"/><ellipse cx="0" cy="2" rx="42" ry="14" fill="#F7F3EA"/>${[...Array(10)].map((_, i) => `<ellipse cx="${-34 + i * 8}" cy="${2 + (i % 2) * 4}" rx="4" ry="2.4" fill="#fff"/>`).join("")}${top}${kind === "masu" ? `<path d="M6 -40 l 4 -6 l 4 6 l -4 4 z" fill="#F9A8D4"/>` : ""}${kind === "uni" ? `<rect x="-44" y="-4" width="88" height="10" fill="#1F2937"/>` : ""}</g>`;
  };
  const plate = (x, y, w, h, c = "#1F2937") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${c}"/><rect x="${x}" y="${y}" width="${w}" height="6" rx="3" fill="#fff" opacity=".06"/>`;
  const hand = (x, y, r, skin = "#E2B08A") => `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-10" width="140" height="44" rx="22" fill="#F8FAFC"/><ellipse cx="-30" cy="12" rx="36" ry="24" fill="${skin}"/>${[0, 1, 2, 3].map((k) => `<rect x="-78" y="${-6 + k * 10}" width="40" height="10" rx="5" fill="${skin}"/>`).join("")}</g>`;

  function hero() {
    return svg("0 0 1600 1000", `<rect width="1600" height="1000" fill="#1A1410"/>
      <rect width="1600" height="560" fill="#241A13"/>${[...Array(12)].map((_, i) => `<rect x="${i * 140}" y="0" width="6" height="560" fill="#1A120C"/>`).join("")}
      ${[260, 800, 1340].map((x) => `<path d="M${x} 0 V 150" stroke="#000" stroke-width="2"/><path d="M${x - 40} 190 q 40 -60 80 0 z" fill="#2A1E16"/><ellipse cx="${x}" cy="192" rx="30" ry="8" fill="#FFD27A"/><circle cx="${x}" cy="230" r="140" fill="#FFB547" opacity=".1"/>`).join("")}
      <g transform="translate(800 330)"><path d="M-170 300 L -150 40 Q 0 -30 150 40 L 170 300 Z" fill="#F8FAFC"/><path d="M-60 -10 L 0 70 L 60 -10" fill="none" stroke="#E2E8F0" stroke-width="8"/>
      <rect x="-28" y="-80" width="56" height="80" fill="#C9906C"/><circle cx="0" cy="-130" r="72" fill="#D7A27E"/><path d="M-74 -150 Q -70 -220 0 -220 Q 74 -220 74 -150 L 74 -138 Q 0 -170 -74 -138 Z" fill="#1E1A17"/><rect x="-76" y="-170" width="152" height="26" rx="6" fill="#F8FAFC"/>
      <path d="M-30 -112 q 12 6 24 0 M6 -112 q 12 6 24 0" stroke="#2A1E16" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      ${hinoki(0, 580, 1600, 420)}<rect y="570" width="1600" height="16" fill="#B58956"/>
      ${plate(560, 650, 480, 90)}${nigiri(660, 690, 1.2, "otoro")}${nigiri(800, 690, 1.2, "tai")}${nigiri(940, 690, 1.2, "masu")}
      ${hand(820, 600, -20)}${hand(640, 590, 200)}
      <rect x="1180" y="700" width="70" height="80" rx="10" fill="#334155"/><ellipse cx="1215" cy="700" rx="35" ry="8" fill="#475569"/>
      <rect x="320" y="680" width="160" height="10" rx="5" fill="#2A1E16" transform="rotate(-8 400 685)"/><rect x="320" y="700" width="160" height="10" rx="5" fill="#2A1E16" transform="rotate(-8 400 705)"/>
      ${warm(1600, 1000, 0.5, 0.25)}`, "Illustration of a sushi chef placing nigiri on a hinoki wood counter in warm light");
  }

  function dish(kind, label) {
    const bg = { otoro: "#1E1B1A", uni: "#14181F", masu: "#1B1A20" }[kind];
    return svg("0 0 500 400", `<rect width="500" height="400" fill="${bg}"/><ellipse cx="250" cy="250" rx="220" ry="90" fill="#0B0B0C"/><ellipse cx="250" cy="240" rx="210" ry="82" fill="#25221F"/>
      ${kind === "uni" ? `${nigiri(170, 240, 1.7, "uni")}${nigiri(330, 240, 1.7, "uni")}` : `${nigiri(170, 240, 1.7, kind)}${nigiri(330, 240, 1.7, kind)}`}
      <path d="M380 170 q 30 -10 46 6 q -22 6 -46 -6z" fill="#7BA542"/><circle cx="110" cy="300" r="14" fill="#7BA542" opacity=".9"/>${kind === "masu" ? `<path d="M250 150 l 6 -10 l 6 10 l -6 6z M230 170 l 5 -8 l 5 8 l -5 5z" fill="#F9A8D4"/>` : ""}${kind === "otoro" ? `<ellipse cx="400" cy="300" rx="34" ry="12" fill="#1A0E0A"/><ellipse cx="400" cy="298" rx="28" ry="8" fill="#3A1A0E"/>` : ""}
      ${warm(500, 400, 0.3, 0.1)}`, label);
  }

  const strips = {
    slicing: () => `<rect width="500" height="320" fill="#211812"/>${hinoki(0, 200, 500, 120)}<rect x="90" y="190" width="300" height="30" rx="6" fill="#F3B4A8"/><path d="M90 190 h 300" stroke="#FBE3DC" stroke-width="4"/>
      <path d="M160 120 L 440 196 L 436 204 L 152 132 Z" fill="#CBD5E1"/><rect x="100" y="104" width="70" height="22" rx="6" fill="#3F2A1E" transform="rotate(15 135 115)"/>${hand(150, 100, 15)}${warm(500, 320, 0.6, 0.1)}`,
    pressing: () => `<rect width="500" height="320" fill="#1F1712"/>${hinoki(0, 210, 500, 110)}${nigiri(250, 230, 2.2, "salmon")}${hand(320, 150, 160)}${hand(180, 190, 20, "#D9A47E")}${warm(500, 320, 0.4, 0.2)}`,
    lacquer: () => `<rect width="500" height="320" fill="#120E0C"/><rect x="60" y="90" width="380" height="180" rx="12" fill="#7F1D1D"/><rect x="74" y="104" width="352" height="152" rx="8" fill="#1A0A0A"/>${nigiri(160, 190, 1.2, "aji")}${nigiri(250, 190, 1.2, "otoro")}${nigiri(340, 190, 1.2, "uni")}<path d="M100 240 h 300" stroke="#F59E0B" stroke-width="2" opacity=".6"/>${warm(500, 320, 0.5, 0.1)}`,
  };

  function chef() {
    return svg("0 0 400 400", `<rect width="400" height="400" fill="#2A1E16"/><circle cx="200" cy="160" r="200" fill="#FFB547" opacity=".08"/>
      <path d="M60 400 L 80 290 Q 200 240 320 290 L 340 400 Z" fill="#F8FAFC"/><path d="M150 270 L 200 330 L 250 270" fill="none" stroke="#E2E8F0" stroke-width="6"/>
      <rect x="176" y="200" width="48" height="70" fill="#C9906C"/><circle cx="200" cy="160" r="66" fill="#D7A27E"/><path d="M134 140 Q 136 82 200 82 Q 264 82 266 140 Q 236 120 200 118 Q 164 120 134 140 Z" fill="#2A2522"/><rect x="132" y="108" width="136" height="22" rx="5" fill="#F8FAFC"/>
      <path d="M172 158 h 18 M210 158 h 18" stroke="#2A1E16" stroke-width="5" stroke-linecap="round"/><path d="M186 196 q 14 6 28 0" stroke="#7A4A36" stroke-width="4" fill="none" stroke-linecap="round"/>`, "Illustration of Chef Kenji Tanaka in a white chef's coat");
  }

  const gallery = {
    interior: () => `<rect width="600" height="760" fill="#14100D"/>${[...Array(5)].map((_, i) => `<path d="M${80 + i * 110} 0 V ${200 + i * 10}" stroke="#000" stroke-width="2"/><ellipse cx="${80 + i * 110}" cy="${214 + i * 10}" rx="20" ry="10" fill="#FFD27A"/><circle cx="${80 + i * 110}" cy="${230 + i * 10}" r="70" fill="#FFB547" opacity=".1"/>`).join("")}
      ${hinoki(0, 420, 600, 110)}<rect y="530" width="600" height="230" fill="#0E0B09"/>${[...Array(6)].map((_, i) => `<rect x="${40 + i * 92}" y="560" width="50" height="120" rx="8" fill="#1F1814"/>`).join("")}${[90, 270, 450].map((x) => `${plate(x - 50, 440, 100, 24)}`).join("")}`,
    torch: () => `<rect width="600" height="600" fill="#140F0C"/>${hinoki(0, 380, 600, 220)}${nigiri(240, 400, 2.4, "salmon")}${nigiri(400, 410, 2, "salmon")}
      <rect x="380" y="120" width="40" height="140" rx="10" fill="#B91C1C" transform="rotate(35 400 190)"/><rect x="330" y="230" width="60" height="18" fill="#94A3B8" transform="rotate(35 360 240)"/>
      <path d="M300 300 q -30 30 -50 60 q 40 -20 70 -50 q -10 -2 -20 -10z" fill="#60A5FA" opacity=".85"/><path d="M290 312 q -20 20 -36 44" stroke="#F59E0B" stroke-width="10" opacity=".8" fill="none"/>${warm(600, 600, 0.45, 0.6)}`,
    sashimi: () => `<rect width="600" height="500" fill="#0F172A"/><ellipse cx="300" cy="260" rx="270" ry="190" fill="#E2E8F0"/>${[...Array(40)].map((_, i) => `<circle cx="${80 + (i * 53) % 440}" cy="${120 + (i * 37) % 280}" r="${10 + (i % 4) * 3}" fill="#F8FAFC"/>`).join("")}
      ${[[180, 200, "#F08A5D"], [260, 180, "#F3B4A8"], [340, 200, "#F6E6E0"], [220, 290, "#B91C1C"], [320, 300, "#F2A93B"], [400, 260, "#F4A7A0"]].map(([x, y, c], i) => [...Array(4)].map((_, k) => `<ellipse cx="${x + k * 9}" cy="${y + k * 4}" rx="38" ry="16" transform="rotate(${-20 + i * 15} ${x + k * 9} ${y + k * 4})" fill="${c}" stroke="#fff" stroke-opacity=".4"/>`).join("")).join("")}
      <path d="M440 180 q 40 -30 70 0 q -30 20 -70 0z" fill="#7BA542"/>`,
    sake: () => `<rect width="600" height="700" fill="#1F2937"/>${[...Array(8)].map((_, i) => `<path d="M0 ${380 + i * 40} H600" stroke="#374151" stroke-width="16"/>`).join("")}
      <path d="M210 200 Q 170 300 200 420 Q 260 470 320 420 Q 350 300 310 200 Z" fill="#E7E5E4"/><rect x="236" y="150" width="48" height="60" rx="10" fill="#E7E5E4"/><path d="M200 300 q 60 20 120 0" stroke="#1E3A8A" stroke-width="8" fill="none"/>
      ${[[400, 430], [470, 470]].map(([x, y]) => `<path d="M${x - 40} ${y} q 40 50 80 0 z" fill="#F5F5F4"/><ellipse cx="${x}" cy="${y}" rx="40" ry="10" fill="#E7E5E4"/><ellipse cx="${x}" cy="${y + 2}" rx="30" ry="6" fill="#FDE68A" opacity=".6"/>`).join("")}${warm(600, 700, 0.4, 0.2)}`,
    noren: () => `<rect width="600" height="600" fill="#0F172A"/><rect x="80" y="100" width="440" height="500" fill="#1E1714"/><rect x="100" y="100" width="400" height="500" fill="#3A2A20"/>
      ${[0, 1, 2].map((i) => `<rect x="${110 + i * 132}" y="110" width="124" height="250" fill="#1E3A8A"/><path d="M${110 + i * 132} 110 h 124" stroke="#172554" stroke-width="10"/>`).join("")}<text x="300" y="250" text-anchor="middle" font-family="serif" font-size="96" fill="#F8FAFC">光</text>
      ${[50, 550].map((x) => `<rect x="${x - 26}" y="200" width="52" height="90" rx="20" fill="#FDE68A"/><rect x="${x - 26}" y="200" width="52" height="90" rx="20" fill="none" stroke="#B91C1C" stroke-width="3"/><circle cx="${x}" cy="245" r="70" fill="#FDE68A" opacity=".15"/>`).join("")}<rect y="560" width="600" height="40" fill="#334155"/>`,
    course: () => `<rect width="600" height="760" fill="#1A1410"/>${hinoki(0, 0, 600, 760)}${[...Array(6)].map((_, i) => `${plate(60, 60 + i * 115, 480, 86, i % 2 ? "#0F172A" : "#1F2937")}${nigiri(170, 108 + i * 115, 1, ["otoro", "uni", "masu", "salmon", "tai", "aji"][i])}${nigiri(300, 108 + i * 115, 1, ["otoro", "uni", "masu", "salmon", "tai", "aji"][i])}<circle cx="440" cy="${103 + i * 115}" r="12" fill="#7BA542"/>`).join("")}${warm(600, 760, 0.5, 0.1)}`,
  };
  const galVB = { interior: "0 0 600 760", torch: "0 0 600 600", sashimi: "0 0 600 500", sake: "0 0 600 700", noren: "0 0 600 600", course: "0 0 600 760" };
  const galLabels = { interior: "Minimalist dining room with hinoki counter and warm pendant lights", torch: "Chef torching aburi sushi", sashimi: "Colorful sashimi on an ice platter", sake: "Sake cups and a ceramic tokkuri on stone", noren: "Restaurant entrance with noren curtain and lantern light", course: "A full omakase course laid out on the counter" };

  function map() {
    return svg("0 0 700 500", `<rect width="700" height="500" fill="#E2E8F0"/>${[...Array(8)].map((_, i) => `<path d="M0 ${40 + i * 64} H700" stroke="#fff" stroke-width="${i === 3 ? 22 : 10}"/>`).join("")}${[...Array(9)].map((_, i) => `<path d="M${30 + i * 82} 0 V500" stroke="#fff" stroke-width="${i === 5 ? 22 : 10}"/>`).join("")}
      <text x="16" y="226" font-family="'Noto Sans', sans-serif" font-size="12" font-weight="700" fill="#475569" letter-spacing="2">PINE STREET</text>
      <rect x="470" y="300" width="110" height="80" rx="6" fill="#CBD5E1"/><text x="525" y="346" text-anchor="middle" font-family="'Noto Sans', sans-serif" font-size="11" font-weight="700" fill="#334155">GARAGE</text>
      <g transform="translate(190 90)"><circle r="16" fill="#1D4ED8"/><text y="5" text-anchor="middle" font-family="'Noto Sans', sans-serif" font-size="13" font-weight="700" fill="#fff">M</text></g><text x="212" y="96" font-family="'Noto Sans', sans-serif" font-size="12" fill="#1E3A8A">Central Station</text>
      <path d="M190 106 V 220 H 400" stroke="#1D4ED8" stroke-width="3" stroke-dasharray="6 6" fill="none"/>
      <g transform="translate(420 222)"><circle r="34" fill="#B91C1C" opacity=".15"/><circle r="14" fill="#B91C1C"/><text y="5" text-anchor="middle" font-family="serif" font-size="14" fill="#fff">光</text></g>`, "Map showing Hikari on Pine Street, two blocks from Central Station and next to the Pine Street Garage");
  }

  window.Art = { hero, dish, strip: (n, l) => svg("0 0 500 320", strips[n](), l), chef, gallery: (n) => svg(galVB[n], gallery[n](), galLabels[n]), galLabels, map };
})();
