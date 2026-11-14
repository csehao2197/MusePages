// Original SVG illustrations for Crescendo Academy (no photos). Exposes window.Art.
// The portrait helper is shared with sibling Opus-5.5 pages.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029", "#F1CDB0"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C", "#2E1F1A", "#B5452B"];
  const TOPS = ["#F97316", "#7C3AED", "#0EA5E9", "#10B981", "#1C1917", "#EAB308", "#EC4899", "#64748B", "#FDE68A", "#C4B5FD"];
  const BGS = ["#F3E8FF", "#EDE9FE", "#FEF3C7", "#E0F2FE", "#DCFCE7", "#FCE7F3", "#F5F5F4", "#FFE4E6"];

  // person: { skin, hair, hairStyle, top, bg, glasses, beard }
  // hairStyle: short | bob | long | bun | curly | buzz | wrap | side
  function bust(p, x = 0, y = 0, s = 1, withBg = false) {
    const sk = SKIN[p.skin], hr = HAIR[p.hair], tp = TOPS[p.top];
    const shade = "rgba(0,0,0,.08)";
    let back = "", front = "";
    switch (p.hairStyle) {
      case "long": back = `<path d="M-46-30c0-44 22-66 46-66s46 22 46 66v78c-14 8-78 8-92 0z" fill="${hr}"/>`; front = `<path d="M-40-34c4-30 22-46 40-46s38 14 42 44c-24-4-48-14-60-30-6 16-12 26-22 32z" fill="${hr}"/>`; break;
      case "bob": back = `<path d="M-46-28c0-44 22-64 46-64s46 20 46 64v42c-10 6-82 6-92 0z" fill="${hr}"/>`; front = `<path d="M-42-30c2-32 20-50 42-50s40 18 42 50c-30 0-58-8-70-24-4 12-8 20-14 24z" fill="${hr}"/>`; break;
      case "bun": back = `<circle cx="0" cy="-88" r="18" fill="${hr}"/>`; front = `<path d="M-40-26c0-34 18-54 40-54s40 20 40 54c-12-14-30-22-40-22s-28 8-40 22z" fill="${hr}"/>`; break;
      case "curly": back = [[-36, -50], [-20, -72], [4, -78], [26, -70], [40, -48], [-44, -24], [44, -22]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="20" fill="${hr}"/>`).join(""); front = ""; break;
      case "buzz": front = `<path d="M-38-30c0-32 16-50 38-50s38 18 38 50c-8-12-22-18-38-18s-30 6-38 18z" fill="${hr}" opacity=".85"/>`; break;
      case "wrap": back = `<path d="M-50-20c0-50 24-74 50-74s50 24 50 74v70c-20 12-80 12-100 0z" fill="${hr}"/>`; front = `<path d="M-42-12c0-40 18-62 42-62s42 22 42 62c-6-26-22-40-42-40s-36 14-42 40z" fill="${hr}"/>`; break;
      case "side": front = `<path d="M-42-26c-2-36 18-56 44-56 26 0 44 20 40 52-18-20-42-28-62-22-10 4-16 14-22 26z" fill="${hr}"/>`; break;
      default: front = `<path d="M-40-28c0-34 18-52 40-52s40 18 40 52c-6-14-16-20-26-22-12 6-34 6-54 22z" fill="${hr}"/>`;
    }
    const face = `<rect x="-12" y="16" width="24" height="26" rx="8" fill="${sk}"/><path d="M-12 30c8 6 16 6 24 0v8c-8 6-16 6-24 0z" fill="${shade}"/>` +
      `<ellipse cx="0" cy="-16" rx="38" ry="44" fill="${sk}"/>` +
      `<ellipse cx="-38" cy="-12" rx="7" ry="10" fill="${sk}"/><ellipse cx="38" cy="-12" rx="7" ry="10" fill="${sk}"/>`;
    const feat = `<ellipse cx="-14" cy="-12" rx="4" ry="5" fill="#2A211D"/><ellipse cx="14" cy="-12" rx="4" ry="5" fill="#2A211D"/>` +
      `<path d="M-22-26c5-3 11-3 15 0M7-26c5-3 11-3 15 0" stroke="${hr}" stroke-width="3.5" stroke-linecap="round" fill="none"/>` +
      `<path d="M-1-4c-2 6-3 10 2 12" stroke="rgba(0,0,0,.18)" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-12 14c7 7 17 7 24 0" stroke="#9A3B3B" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-24" cy="4" rx="7" ry="4" fill="#F87171" opacity=".18"/><ellipse cx="24" cy="4" rx="7" ry="4" fill="#F87171" opacity=".18"/>` +
      (p.glasses ? `<g fill="none" stroke="#1C1917" stroke-width="2.5"><rect x="-27" y="-21" width="22" height="17" rx="7"/><rect x="5" y="-21" width="22" height="17" rx="7"/><path d="M-5-13h10"/></g>` : "") +
      (p.beard ? `<path d="M-34-4c2 30 18 44 34 44s32-14 34-44c-6 12-14 16-20 16-4-4-10-6-14-6s-10 2-14 6c-6 0-14-4-20-16z" fill="${hr}" opacity=".9"/><path d="M-10 16c6 4 14 4 20 0" stroke="#7A3030" stroke-width="3" fill="none" stroke-linecap="round"/>` : "");
    const body = `<path d="M-74 120c4-52 30-78 74-78s70 26 74 78z" fill="${tp}"/><path d="M-16 42c6 14 26 14 32 0" fill="${sk}"/><path d="M-16 42c6 14 26 14 32 0" stroke="rgba(0,0,0,.08)" stroke-width="2" fill="none"/>`;
    const bg = withBg ? `<rect x="-100" y="-120" width="200" height="240" fill="${BGS[p.bg]}"/><circle cx="56" cy="-74" r="46" fill="#fff" opacity=".35"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">${bg}${back}${body}${face}${front}${feat}</g>`;
  }

  const svg = (w, h, b, label) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${b}</svg>`;
  function theater() {
    let b = `<defs><radialGradient id="spot" cx=".5" cy=".55" r=".55"><stop offset="0" stop-color="#FDE68A" stop-opacity=".55"/><stop offset=".6" stop-color="#B45309" stop-opacity=".12"/><stop offset="1" stop-color="#1E1033" stop-opacity="0"/></radialGradient><linearGradient id="curt" x1="0" x2="1"><stop offset="0" stop-color="#7F1D1D"/><stop offset=".5" stop-color="#B91C1C"/><stop offset="1" stop-color="#7F1D1D"/></linearGradient></defs>`;
    b += `<rect width="1600" height="900" fill="#2A1438"/>`;
    // ornate ceiling arches + gold trim
    for (let i = 0; i < 9; i++) b += `<path d="M${i * 200 - 100} 0q100 120 200 0" fill="none" stroke="#C9A24B" stroke-width="6" opacity=".55"/><circle cx="${i * 200}" cy="36" r="10" fill="#E6C47A" opacity=".7"/>`;
    b += `<path d="M260 140q540-130 1080 0v40q-540-120-1080 0z" fill="#C9A24B" opacity=".75"/>`;
    // proscenium + curtains
    b += `<rect x="200" y="150" width="1200" height="700" fill="#140A20"/><path d="M200 150h240c-30 200-10 480 40 700H200z" fill="url(#curt)"/><path d="M1400 150h-240c30 200 10 480-40 700h200z" fill="url(#curt)"/>`;
    for (let i = 0; i < 6; i++) b += `<path d="M${220 + i * 36} 160c-6 220 4 460 20 690M${1380 - i * 36} 160c6 220-4 460-20 690" stroke="#450A0A" stroke-width="5" opacity=".5" fill="none"/>`;
    b += `<path d="M200 150q600 70 1200 0v50q-600 60-1200 0z" fill="#991B1B"/>`;
    b += `<ellipse cx="800" cy="560" rx="560" ry="330" fill="url(#spot)"/>`;
    b += `<rect x="200" y="720" width="1200" height="180" fill="#5B3A1E"/><rect x="200" y="716" width="1200" height="8" fill="#C9A24B" opacity=".6"/>`;
    // grand piano (side view)
    b += `<path d="M560 520 L980 520 Q1080 520 1090 600 L1090 640 L560 640 z" fill="#0B0710"/><path d="M560 520 L700 460 L1000 470 Q1060 480 1085 560" fill="#140D1C"/><rect x="560" y="636" width="530" height="16" fill="#1F1527"/><rect x="580" y="610" width="200" height="14" fill="#F5F5F4"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${582 + i * 10}" y="610" width="5" height="8" fill="#0B0710"/>`).join("")}`;
    b += [600, 860, 1060].map((x) => `<rect x="${x}" y="650" width="12" height="70" fill="#0B0710"/>`).join("");
    // pianist (seated silhouette)
    b += `<rect x="470" y="640" width="110" height="18" rx="6" fill="#0B0710"/><rect x="480" y="656" width="10" height="64" fill="#0B0710"/><rect x="560" y="656" width="10" height="64" fill="#0B0710"/>`;
    b += `<circle cx="520" cy="500" r="30" fill="#1F1527"/><path d="M490 535q30-14 60 0l16 110h-92z" fill="#1F1527"/><path d="M548 560l60 40" stroke="#1F1527" stroke-width="18" stroke-linecap="round"/><path d="M500 640l40 0 30 80" stroke="#1F1527" stroke-width="20" fill="none" stroke-linecap="round"/>`;
    b += `<path d="M498 486q22-34 50-4" stroke="#E6C47A" stroke-width="4" fill="none" opacity=".5"/>`;
    return svg(1600, 900, b, "Illustration of a student at a grand piano on a historic theater stage under warm stage lights");
  }
  function lesson() {
    let b = `<rect width="700" height="760" fill="#F7EBDD"/><rect x="40" y="40" width="300" height="360" rx="8" fill="#FFF7EC"/><path d="M190 40v360M40 220h300" stroke="#EAD7BF" stroke-width="10"/><rect x="0" y="560" width="700" height="200" fill="#C99A6B"/>`;
    b += `<g opacity=".5">${[0, 1, 2, 3, 4].map((i) => `<path d="M420 ${90 + i * 14}h240" stroke="#7C3AED" stroke-width="2"/>`).join("")}<circle cx="470" cy="118" r="7" fill="#7C3AED"/><circle cx="520" cy="104" r="7" fill="#7C3AED"/><circle cx="580" cy="126" r="7" fill="#7C3AED"/></g>`;
    b += bust({ skin: 2, hair: 3, hairStyle: "bob", top: 1, bg: 0 }, 230, 520, 1.7);
    b += bust({ skin: 5, hair: 0, hairStyle: "curly", top: 2, bg: 0 }, 500, 600, 1.25);
    b += `<g transform="translate(470 500) rotate(-28)"><path d="M0 0c-20 10-24 40-10 56-12 16-10 50 10 60 24 10 50 0 54-24-6-12-6-28 0-40-4-24-30-62-54-52z" fill="#9A3412"/><rect x="18" y="-160" width="10" height="170" fill="#3F1D0B"/><path d="M40 -20 L200 -110" stroke="#D6D3D1" stroke-width="4"/></g>`;
    return svg(700, 760, b, "Illustration of an instructor and a young student laughing during a violin lesson");
  }
  function exterior() {
    let b = `<rect width="600" height="380" fill="#FDE7C7"/><rect y="300" width="600" height="80" fill="#9CA3AF"/>`;
    b += `<rect x="90" y="80" width="420" height="230" fill="#B45309"/><path d="M90 80 L300 20 L510 80z" fill="#92400E"/>`;
    b += [0, 1, 2, 3, 4].map((i) => `<rect x="${120 + i * 78}" y="120" width="44" height="70" rx="22" fill="#FDE68A"/>`).join("");
    b += `<rect x="150" y="210" width="300" height="46" fill="#1E1033"/><text x="300" y="241" font-size="24" font-weight="700" fill="#FDE68A" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" letter-spacing="3">CRESCENDO</text>`;
    b += `<rect x="260" y="262" width="80" height="48" fill="#3F1D0B"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${160 + i * 46}" cy="206" r="4" fill="#FEF3C7"/>`).join("")}`;
    return svg(600, 380, b, "Illustration of the renovated historic theater building exterior");
  }
  function map() {
    let b = `<rect width="700" height="460" fill="#EEE8F4"/>`;
    for (let i = 0; i < 8; i++) b += `<path d="M${i * 100} 0v460" stroke="#fff" stroke-width="${i === 3 ? 14 : 6}"/>`;
    for (let j = 0; j < 6; j++) b += `<path d="M0 ${j * 90 + 20}H700" stroke="#fff" stroke-width="${j === 2 ? 16 : 6}"/>`;
    b += `<path d="M560 0c-30 120 20 260-40 460" stroke="#BFDBFE" stroke-width="40" fill="none"/>`;
    b += `<text x="20" y="190" font-size="15" font-weight="700" fill="#6B7280" font-family="Inter, sans-serif">BROADWAY</text><text x="306" y="440" font-size="13" font-weight="600" fill="#6B7280" font-family="Inter, sans-serif" transform="rotate(-90 306 440)">4TH AVE</text>`;
    b += `<path d="M350 200c-22-26-32-42-32-56a32 32 0 0 1 64 0c0 14-10 30-32 56z" fill="#7C3AED"/><circle cx="350" cy="144" r="11" fill="#fff"/><rect x="390" y="120" width="190" height="48" rx="10" fill="#1E1033"/><text x="406" y="142" font-size="14" font-weight="700" fill="#fff" font-family="Inter, sans-serif">Crescendo Academy</text><text x="406" y="159" font-size="11" fill="#C4B5FD" font-family="Inter, sans-serif">412 Broadway</text>`;
    b += `<rect x="410" y="250" width="70" height="44" rx="6" fill="#DDD6FE"/><text x="445" y="277" font-size="11" text-anchor="middle" fill="#5B21B6" font-family="Inter, sans-serif">P</text>`;
    return svg(700, 460, b, "Map of downtown Nashville with a pin at 412 Broadway");
  }
  function face(look, label) { return `<svg viewBox="-80 -110 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust(look, 0, 0, 1, true)}</svg>`; }
  window.Art = { theater, lesson, exterior, map, face };
})();
