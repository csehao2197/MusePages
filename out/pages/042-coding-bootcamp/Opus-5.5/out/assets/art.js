// Original SVG illustrations for LaunchCode Academy (no photos). Exposes window.Art.
// The portrait helper is shared with sibling Opus-5.5 pages.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029", "#F1CDB0"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C", "#2E1F1A", "#B5452B"];
  const TOPS = ["#F97316", "#7C3AED", "#0EA5E9", "#10B981", "#1C1917", "#EAB308", "#EC4899", "#64748B", "#FDE68A", "#C4B5FD"];
  const BGS = ["#EEF2FF", "#EDE9FE", "#FEF3C7", "#E0F2FE", "#DCFCE7", "#FCE7F3", "#F5F5F4", "#FFE4E6"];

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
  const laptop = (x, y, s, screen) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-104" width="160" height="104" rx="8" fill="#1E1B4B"/><rect x="-72" y="-96" width="144" height="88" rx="4" fill="#0F172A"/>${screen}<path d="M-96 0h192l-10 12h-172z" fill="#CBD5E1"/></g>`;
  const code = (c1, c2) => [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-64 + (i % 3) * 8}" y="${-88 + i * 13}" width="${40 + ((i * 37) % 60)}" height="6" rx="3" fill="${i % 2 ? c1 : c2}"/>`).join("");
  function hero() {
    let b = `<rect width="720" height="600" fill="#EEF2FF"/><rect y="0" width="720" height="380" fill="#E0E7FF"/>`;
    b += [0, 1, 2].map((i) => `<rect x="${60 + i * 220}" y="40" width="180" height="200" rx="8" fill="#F5F3FF"/><path d="M${150 + i * 220} 40v200M${60 + i * 220} 140h180" stroke="#E0E7FF" stroke-width="6"/>`).join("");
    b += `<rect x="480" y="70" width="200" height="120" rx="8" fill="#fff"/><path d="M500 100h90M500 124h140M500 148h110" stroke="#C7D2FE" stroke-width="8" stroke-linecap="round"/><text x="500" y="178" font-size="14" font-weight="700" fill="#4F46E5" font-family="Inter, sans-serif">git push origin main</text>`;
    const P = [[150, { skin: 5, hair: 0, hairStyle: "curly", top: 1, bg: 0 }], [360, { skin: 7, hair: 0, hairStyle: "bob", top: 2, bg: 0 }], [570, { skin: 2, hair: 2, hairStyle: "short", top: 3, bg: 0, glasses: true }]];
    P.forEach(([x, look]) => { b += bust(look, x, 360, 1.15); });
    b += `<rect y="420" width="720" height="180" fill="#C7A27C"/><rect y="420" width="720" height="14" fill="#B08A64"/>`;
    b += laptop(150, 500, 0.95, code("#818CF8", "#34D399")) + laptop(360, 500, 0.95, `<rect x="-64" y="-88" width="128" height="72" rx="3" fill="#1E293B"/><polyline points="-56,-28 -32,-44 -8,-36 16,-60 40,-52 56,-72" fill="none" stroke="#34D399" stroke-width="4"/>`) + laptop(570, 500, 0.95, `<rect x="-62" y="-88" width="56" height="72" rx="4" fill="#F5F3FF"/><rect x="2" y="-88" width="60" height="32" rx="4" fill="#A78BFA"/><rect x="2" y="-50" width="60" height="34" rx="4" fill="#E0E7FF"/>`);
    b += `<rect x="40" y="540" width="70" height="40" rx="6" fill="#fff"/><path d="M110 548c14 0 14 24 0 24" stroke="#fff" stroke-width="6" fill="none"/>`;
    return svg(720, 600, b, "Illustration of three students collaborating at laptops in a bright classroom");
  }
  function face(look, label) { return `<svg viewBox="-80 -110 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust(look, 0, 0, 1, true)}</svg>`; }
  window.Art = { hero, face };
})();
