// Documentary-style SVG landscapes used in place of photography (no licensed photos bundled).
(function () {
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const hills = (y, amp, color, n = 8) => {
    let d = `M0 ${y}`;
    for (let i = 0; i <= n; i++) d += ` Q${(i - 0.5) * (1600 / n)} ${y - amp * (0.4 + rnd())} ${i * (1600 / n)} ${y + (rnd() - 0.5) * amp * 0.3}`;
    return `<path d="${d} V900 H0Z" fill="${color}"/>`;
  };
  const canopy = (y, r, color, count, w = 1600) => Array.from({ length: count }, (_, i) =>
    `<circle cx="${(i / count) * w + rnd() * 40}" cy="${y + rnd() * r * 0.8}" r="${r * (0.7 + rnd() * 0.6)}" fill="${color}"/>`).join("");
  const grain = `<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .09 0"/></filter>`;
  const wrap = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs>${grain}</defs>${body}<rect width="100%" height="100%" filter="url(#grain)"/></svg>`;
  const S = {
    hero: () => { seed = 11; return wrap("0 0 1600 900", `
      <defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE8D3"/><stop offset=".55" stop-color="#A9C3A0"/><stop offset="1" stop-color="#5C8A5F"/></linearGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF3E8" stop-opacity="0"/><stop offset=".5" stop-color="#EEF3E8" stop-opacity=".8"/><stop offset="1" stop-color="#EEF3E8" stop-opacity="0"/></linearGradient><radialGradient id="sun" cx=".72" cy=".2" r=".5"><stop offset="0" stop-color="#FFF7D6" stop-opacity=".95"/><stop offset="1" stop-color="#FFF7D6" stop-opacity="0"/></radialGradient></defs>
      <rect width="1600" height="900" fill="url(#hs)"/><rect width="1600" height="900" fill="url(#sun)"/>
      <g opacity=".55">${canopy(300, 70, "#7FA77A", 22)}</g>
      <rect y="270" width="1600" height="170" fill="url(#mist)" opacity=".8"/>
      <g opacity=".8">${canopy(420, 90, "#4E7A52", 20)}</g>
      <rect y="410" width="1600" height="150" fill="url(#mist)" opacity=".55"/>
      ${canopy(560, 110, "#2F5A39", 18)}${canopy(700, 130, "#1D4229", 16)}${canopy(840, 140, "#123020", 14)}
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${120 + i * 180} 900 C ${130 + i * 180} 700 ${100 + i * 180} 600 ${140 + i * 180} 520" stroke="#0E2618" stroke-width="${6 + (i % 3) * 3}" fill="none" opacity=".6"/>`).join("")}`,
      "Rainforest canopy with morning mist") },
    canopy: () => { seed = 3; return wrap("0 0 600 400", `<rect width="600" height="400" fill="#C9DCC0"/>${canopy(80, 60, "#5D8B5B", 12, 600)}${canopy(330, 80, "#2E5A37", 10, 600)}
      <path d="M-10 210 Q300 270 610 190" stroke="#6B4F2A" stroke-width="6" fill="none"/><path d="M-10 196 Q300 250 610 176" stroke="#8B6B3E" stroke-width="2" fill="none"/>
      ${Array.from({ length: 22 }, (_, i) => `<line x1="${i * 28}" y1="${198 + Math.sin(i / 7 * 3.14) * 22}" x2="${i * 28}" y2="${222 + Math.sin(i / 7 * 3.14) * 24}" stroke="#6B4F2A" stroke-width="2"/>`).join("")}
      <circle cx="300" cy="222" r="7" fill="#F59E0B"/><rect x="295" y="229" width="10" height="20" rx="4" fill="#B45309"/>`, "Canopy walkway in a rainforest") },
    fjord: () => { seed = 5; return wrap("0 0 600 400", `<rect width="600" height="400" fill="#D7E3EA"/><path d="M0 230 L120 60 L220 200 L320 40 L470 210 L600 90 V260 H0Z" fill="#5E7685"/><path d="M110 74 L120 60 L132 78 Z M310 56 L320 40 L332 60Z" fill="#fff"/>
      <path d="M0 250 L160 140 L260 250 Z M380 250 L520 130 L600 190 V250Z" fill="#3E5462"/><rect y="250" width="600" height="150" fill="#6F93A6"/>
      ${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 70}" y="${280 + (i % 3) * 30}" width="40" height="2" fill="#fff" opacity=".4"/>`).join("")}
      <path d="M250 312 Q300 326 360 312 Q300 318 250 312Z" fill="#DC2626"/><circle cx="305" cy="300" r="6" fill="#1F2937"/><line x1="270" y1="296" x2="340" y2="322" stroke="#1F2937" stroke-width="3"/>`, "Kayak on a fjord beneath mountains") },
    orangutan: () => { seed = 7; return wrap("0 0 600 400", `<rect width="600" height="400" fill="#9FBF8E"/>${canopy(40, 70, "#4B7A45", 10, 600)}${canopy(380, 70, "#2D5233", 10, 600)}
      <path d="M180 0 Q200 200 170 400" stroke="#5B3E22" stroke-width="16" fill="none"/>
      <ellipse cx="320" cy="230" rx="62" ry="78" fill="#B4541E"/><circle cx="320" cy="140" r="44" fill="#C2621F"/><ellipse cx="320" cy="150" rx="28" ry="24" fill="#E8B48A"/>
      <circle cx="309" cy="142" r="4" fill="#2A1A0E"/><circle cx="331" cy="142" r="4" fill="#2A1A0E"/><path d="M310 160 Q320 166 330 160" stroke="#2A1A0E" stroke-width="2" fill="none"/>
      <path d="M268 190 Q210 120 190 60" stroke="#B4541E" stroke-width="22" stroke-linecap="round" fill="none"/><path d="M372 200 Q420 260 410 320" stroke="#B4541E" stroke-width="22" stroke-linecap="round" fill="none"/>`, "Orangutan in the forest") },
    geo: () => { seed = 9; return wrap("0 0 600 400", `<rect width="600" height="400" fill="#C8D2D6"/><path d="M0 200 L150 120 L280 180 L420 100 L600 170 V260 H0Z" fill="#59656B"/>
      <rect y="230" width="600" height="170" fill="#6B5B4A"/><ellipse cx="300" cy="300" rx="200" ry="50" fill="#7DD3E0"/><ellipse cx="300" cy="300" rx="140" ry="30" fill="#A5F3FC"/>
      ${Array.from({ length: 6 }, (_, i) => `<path d="M${200 + i * 40} 290 q-20 -60 10 -120 q20 -40 -5 -90" stroke="#fff" stroke-width="${14 - i}" fill="none" opacity=".35" stroke-linecap="round"/>`).join("")}`, "Geothermal hot spring with steam") },
    savanna: () => { seed = 13; return wrap("0 0 600 400", `<defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C770"/><stop offset="1" stop-color="#E7894B"/></linearGradient></defs>
      <rect width="600" height="400" fill="url(#gs)"/><circle cx="430" cy="210" r="56" fill="#FDE7A8"/><rect y="250" width="600" height="150" fill="#B8823F"/>
      <path d="M90 250 v-60 M60 190 q30 -24 60 0 q-30 8 -60 0" stroke="#3B2A1A" stroke-width="6" fill="#3B2A1A"/>
      ${[[220, 1], [330, .8], [400, .6]].map(([x, s]) => `<g transform="translate(${x} ${262 - 6 / s}) scale(${s})" fill="#4A3B33"><ellipse cx="0" cy="-40" rx="56" ry="38"/><circle cx="52" cy="-58" r="26"/><path d="M70 -50 q16 30 4 66" stroke="#4A3B33" stroke-width="10" fill="none"/><rect x="-42" y="-14" width="16" height="44"/><rect x="-6" y="-14" width="16" height="44"/><rect x="24" y="-14" width="16" height="44"/></g>`).join("")}`, "Elephants on the savanna at golden hour") },
    turtle: () => { seed = 15; return wrap("0 0 600 400", `<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EC4D6"/><stop offset="1" stop-color="#0E4E68"/></linearGradient></defs>
      <rect width="600" height="400" fill="url(#sea)"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 100} 0 L${i * 100 + 60} 400" stroke="#fff" stroke-width="18" opacity=".06"/>`).join("")}
      <g transform="translate(300 200) rotate(-12)"><ellipse rx="96" ry="64" fill="#5A7247"/><path d="M-50 -30 L0 -50 L50 -30 L50 30 L0 50 L-50 30Z" fill="#7C9360" stroke="#3D5130" stroke-width="3"/>
      <ellipse cx="120" cy="0" rx="34" ry="24" fill="#8BA16E"/><path d="M40 -50 Q90 -120 140 -110 Q90 -70 60 -40Z M40 50 Q90 120 140 110 Q90 70 60 40Z" fill="#8BA16E"/><circle cx="132" cy="-6" r="4" fill="#1F2A17"/></g>
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${80 + (i * 61) % 460}" cy="${40 + (i * 37) % 120}" r="${2 + (i % 3)}" fill="#E0F7FA" opacity=".6"/>`).join("")}`, "Sea turtle swimming underwater") },
    treehouse: () => { seed = 17; return wrap("0 0 640 360", `<rect width="640" height="360" fill="#CFE0C4"/>${canopy(60, 80, "#7BA372", 10, 640)}${canopy(330, 80, "#2C5434", 10, 640)}
      <rect x="300" y="140" width="22" height="220" fill="#5A3C1E"/><rect x="230" y="150" width="160" height="80" fill="#A07445"/><path d="M215 152 L310 96 L405 152Z" fill="#3D5A2C"/>
      <rect x="250" y="172" width="34" height="30" fill="#FDE68A"/><rect x="336" y="172" width="34" height="30" fill="#FDE68A"/><rect x="236" y="98" width="70" height="14" fill="#1E3A5F" transform="rotate(-30 236 98)" opacity=".85"/>`, "Treehouse lodge in the cloud forest") },
    glass: () => { seed = 19; return wrap("0 0 640 360", `<defs><linearGradient id="ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1B33"/><stop offset="1" stop-color="#1B3A4B"/></linearGradient></defs><rect width="640" height="360" fill="url(#ns)"/>
      <path d="M0 120 Q160 40 320 110 T640 80" stroke="#4ADE80" stroke-width="40" fill="none" opacity=".35"/><path d="M0 150 Q200 80 360 140 T640 120" stroke="#86EFAC" stroke-width="16" fill="none" opacity=".35"/>
      ${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 640}" cy="${(i * 31) % 160}" r="1.3" fill="#fff"/>`).join("")}<path d="M0 290 Q320 250 640 290 V360 H0Z" fill="#E5EEF4"/>
      <path d="M250 290 L320 210 L390 290Z" fill="#9CC9DA" opacity=".55" stroke="#E5EEF4" stroke-width="3"/><rect x="306" y="262" width="28" height="18" fill="#FCD34D" opacity=".85"/>`, "Glass cabin under the northern lights") },
    bamboo: () => { seed = 21; return wrap("0 0 640 360", `<rect width="640" height="360" fill="#D9E8C9"/>${canopy(60, 70, "#6F9E5D", 12, 640)}<rect y="260" width="640" height="100" fill="#5B8E86"/>
      ${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 30 + 10}" y="40" width="8" height="240" fill="#8FAF4A"/>`).join("")}
      <path d="M240 250 Q340 110 440 250Z" fill="#C59A5C"/><path d="M262 250 Q340 140 418 250" stroke="#8C6A38" stroke-width="3" fill="none"/><rect x="320" y="206" width="40" height="44" fill="#3B2A1A"/><rect x="230" y="248" width="220" height="8" fill="#7A5A2E"/>`, "Bamboo villa on a jungle river") },
    dome: () => { seed = 23; return wrap("0 0 640 360", `<defs><linearGradient id="ds" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset=".7" stop-color="#9A4D3A"/><stop offset="1" stop-color="#E7A867"/></linearGradient></defs><rect width="640" height="360" fill="url(#ds)"/>
      ${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 89) % 640}" cy="${(i * 23) % 150}" r="1.2" fill="#fff"/>`).join("")}<path d="M0 280 Q180 220 360 270 T640 250 V360 H0Z" fill="#D08B4F"/><path d="M0 310 Q240 270 640 300 V360 H0Z" fill="#B86E3A"/>
      <path d="M270 290 A60 60 0 0 1 390 290Z" fill="#F5EBDD"/><path d="M290 290 L330 232 L370 290 M300 260 H360" stroke="#C7B299" stroke-width="2" fill="none"/><path d="M318 290 a12 14 0 0 1 24 0Z" fill="#FCD34D"/>`, "Geodesic eco-dome in the Sahara at dusk") },
    coast: () => { seed = 25; return wrap("0 0 1600 700", `<rect width="1600" height="700" fill="#2B8AA8"/><path d="M0 0 H1600 V160 Q1300 260 1100 220 T600 300 T0 260Z" fill="#1F6E52"/>
      ${canopy(120, 50, "#2F7D57", 40)}<path d="M0 260 Q300 300 600 300 T1100 220 T1600 160" stroke="#F2E2C2" stroke-width="40" fill="none"/>
      <path d="M0 290 Q300 330 600 330 T1100 250 T1600 190" stroke="#7DD3E0" stroke-width="40" fill="none" opacity=".7"/>
      ${Array.from({ length: 30 }, (_, i) => `<path d="M${i * 60} ${400 + (i % 5) * 50} q30 -10 60 0" stroke="#fff" stroke-width="2" fill="none" opacity=".25"/>`).join("")}`, "Aerial view of a forested coastline") },
  };
  window.__renderScenes = (root) => root.querySelectorAll("[data-scene]").forEach((el) => {
    if (S[el.dataset.scene] && !el.firstElementChild) el.innerHTML = S[el.dataset.scene]();
  });
  window.__renderScenes(document);
})();
