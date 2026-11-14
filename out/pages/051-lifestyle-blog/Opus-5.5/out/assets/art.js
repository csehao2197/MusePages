// Original editorial illustrations (no photos). Exposes window.Art.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029", "#F1CDB0"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C", "#2E1F1A", "#B5452B"];
  const TOPS = ["#F97316", "#7C3AED", "#0EA5E9", "#10B981", "#1C1917", "#EAB308", "#EC4899", "#64748B", "#FDE68A", "#C4B5FD"];
  const BGS = ["#FFEDD5", "#EDE9FE", "#FEF3C7", "#E0F2FE", "#DCFCE7", "#FCE7F3", "#F5F5F4", "#FFE4E6"];

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

  function portrait(p, label, shape = "square") {
    const vb = shape === "circle" ? "-80 -110 160 160" : "-100 -110 200 200";
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${bust(p, 0, 0, 1, true)}</svg>`;
  }


  // ---------- editorial "photographs" as SVG scenes (viewBox 600x400 unless noted) ----------
  const P = {
    mia: { skin: 1, hair: 0, hairStyle: "bob", top: 9, bg: 1 },
    leo: { skin: 3, hair: 0, hairStyle: "curly", top: 4, bg: 0, beard: true },
    astrid: { skin: 0, hair: 4, hairStyle: "long", top: 2, bg: 3 },
    kenji: { skin: 1, hair: 0, hairStyle: "short", top: 7, bg: 6, glasses: true },
    elena: { skin: 2, hair: 2, hairStyle: "bun", top: 8, bg: 5 },
    sam: { skin: 5, hair: 0, hairStyle: "buzz", top: 3, bg: 4 },
    nora: { skin: 7, hair: 7, hairStyle: "side", top: 6, bg: 7 },
    ines: { skin: 4, hair: 1, hairStyle: "wrap", top: 1, bg: 2 }
  };
  const grain = (id) => `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  let uid = 0;
  function frame(inner, sky, w = 600, h = 400, label = "") {
    const g = `g${uid++}`, s = `s${uid++}`;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs><linearGradient id="${s}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>${grain(g)}</defs><rect width="${w}" height="${h}" fill="url(#${s})"/>${inner}<rect width="${w}" height="${h}" filter="url(#${g})"/></svg>`;
  }
  const S = {
    // hero: sunlit bedroom, linen, book, tea — rest
    rest: () => frame(`<rect x="380" y="40" width="170" height="220" fill="#FFF7ED"/><path d="M380 40h170v220H380z" fill="none" stroke="#E7D7C4" stroke-width="8"/><path d="M465 40v220M380 150h170" stroke="#E7D7C4" stroke-width="5"/><path d="M380 40 300 400h330V40z" fill="#FDE68A" opacity=".25"/>
      <rect x="0" y="250" width="600" height="150" fill="#E7DCCF"/><path d="M40 250c40-40 180-50 300-30s200 10 240 30v60H40z" fill="#F5EFE6"/><path d="M60 270c60 20 160 30 260 10s180-10 220 10" stroke="#D6C8B6" stroke-width="3" fill="none"/>
      <ellipse cx="150" cy="232" rx="80" ry="26" fill="#FAF7F2"/><path d="M380 300l90-14 40 22-90 14z" fill="#9F1239"/><path d="M380 300l90-14 1 4-90 14z" fill="#FFF"/>
      <g transform="translate(250 300)"><ellipse cx="0" cy="34" rx="34" ry="8" fill="#C8B9A6"/><path d="M-22 0h44l-4 30h-36z" fill="#F8FAFC"/><path d="M22 6c14 0 14 16 0 16" stroke="#F8FAFC" stroke-width="5" fill="none"/><path d="M-8-10c0-10 8-10 8-20M6-8c0-10 8-10 8-20" stroke="#fff" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/></g>
      <g transform="translate(370 70) scale(.62)"><path d="M90 120c10-30 30-40 40-30 0 20-20 30-40 30z" fill="#4D7C0F"/><rect x="100" y="120" width="40" height="70" rx="6" fill="#C2410C"/><path d="M118 120c-10-40 20-70 30-60-4 30-20 50-30 60z" fill="#65A30D"/></g>`, ["#FCE7D6", "#F5D0B5"], 600, 400, "A sunlit bed with linen, a cup of tea and an open book"),
    sauna: () => frame(`<rect y="230" width="600" height="170" fill="#1E3A5F"/><path d="M0 260h600M0 300h600M0 340h600" stroke="#2D5A88" stroke-width="2" opacity=".6"/>
      <g fill="#7C4A2D"><rect x="70" y="150" width="140" height="90"/><path d="M60 150 140 100 220 150z" fill="#5B341F"/><rect x="250" y="160" width="120" height="80"/><path d="M240 160 310 115 380 160z" fill="#5B341F"/></g><rect x="120" y="190" width="30" height="50" fill="#FDE68A" opacity=".8"/><rect x="290" y="190" width="40" height="22" fill="#FDE68A" opacity=".7"/>
      <rect x="40" y="236" width="380" height="10" fill="#A16207"/><path d="M420 120h160v120H420z" fill="#94A3B8"/><g fill="#CBD5E1">${[0, 1, 2, 3].map((i) => `<rect x="${430 + i * 38}" y="132" width="26" height="20"/>`).join("")}</g>
      <g transform="translate(470 250)"><circle r="12" fill="none" stroke="#111" stroke-width="3"/><circle cx="50" r="12" fill="none" stroke="#111" stroke-width="3"/><path d="M0 0 20-22h22L50 0M20-22 10 0" stroke="#DC2626" stroke-width="3" fill="none"/></g><path d="M140 100c10-20-10-30 0-50M150 98c10-20-10-30 0-50" stroke="#fff" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>`, ["#BFDBFE", "#E0F2FE"], 600, 400, "Wooden harbor saunas on the water in Copenhagen with a bicycle"),
    pantry: () => frame(`<rect width="600" height="400" fill="#F5EFE6"/>${[60, 170, 280].map((y) => `<rect x="30" y="${y + 80}" width="540" height="10" fill="#A16207"/>`).join("")}
      ${[[60, 70, "#F8FAFC", "#1C1917", "MISO"], [150, 70, "#FEF3C7", "#92400E", "MIRIN"], [240, 70, "#E7E5E4", "#44403C", "KOMBU"], [330, 70, "#FDE68A", "#78350F", "YUZU"], [420, 70, "#D9F99D", "#3F6212", "NORI"], [60, 180, "#FEE2E2", "#991B1B", "UME"], [150, 180, "#E0F2FE", "#075985", "DASHI"], [240, 180, "#F5F5F4", "#292524", "SOY"], [330, 180, "#FFEDD5", "#9A3412", "SESAME"], [420, 180, "#ECFCCB", "#365314", "MATCHA"]].map(([x, y, c, t, l]) => `<rect x="${x}" y="${y - 10}" width="70" height="80" rx="8" fill="${c}" stroke="#D6D3D1" stroke-width="2"/><rect x="${x}" y="${y - 18}" width="70" height="14" rx="4" fill="#78716C"/><text x="${x + 35}" y="${y + 40}" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" font-weight="700" fill="${t}">${l}</text>`).join("")}
      <path d="M60 330h120l-10 40H70z" fill="#1C1917"/><ellipse cx="120" cy="330" rx="60" ry="10" fill="#F8FAFC"/><path d="M380 370h160" stroke="#A16207" stroke-width="6" stroke-linecap="round"/><path d="M400 350h140" stroke="#A16207" stroke-width="5" stroke-linecap="round"/>`, ["#F5EFE6", "#EADFD0"], 600, 400, "A tidy pantry shelf of Japanese staples in labeled jars"),
    wardrobe: () => frame(`<rect x="60" y="60" width="480" height="8" rx="4" fill="#A8A29E"/>${[["#F5F5F4", 90], ["#1C1917", 150], ["#D6D3D1", 210], ["#A16207", 270], ["#E7E5E4", 330], ["#57534E", 390], ["#FDE68A", 450]].map(([c, x], i) => `<path d="M${x} 68v14" stroke="#78716C" stroke-width="3"/><path d="M${x - 26} 100l26-18 26 18v${170 + (i % 3) * 30}h-52z" fill="${c}" stroke="#D6D3D1" stroke-width="1.5"/>`).join("")}
      <rect y="350" width="600" height="50" fill="#D6C8B6"/>${[120, 200, 280].map((x) => `<path d="M${x} 360c10-12 40-12 50 0v14h-50z" fill="#292524"/>`).join("")}<rect x="420" y="330" width="120" height="40" rx="6" fill="#E7E5E4"/>`, ["#FAFAF9", "#F0EBE3"], 600, 400, "A minimal wardrobe rail with fifteen neutral pieces"),
    mezcal: () => frame(`<circle cx="470" cy="110" r="60" fill="#FDBA74"/><path d="M0 230 120 180 260 220 400 170 600 210V400H0z" fill="#9A3412" opacity=".55"/><rect y="260" width="600" height="140" fill="#B45309"/>
      ${Array.from({ length: 14 }, (_, i) => { const x = 20 + (i % 7) * 86 + (i > 6 ? 40 : 0), y = i > 6 ? 360 : 300; return `<g transform="translate(${x} ${y})">${[-60, -35, -12, 12, 35, 60].map((a) => `<path d="M0 0 ${Math.sin((a * Math.PI) / 180) * 50} ${-Math.cos((a * Math.PI) / 180) * 50}" stroke="#4D7C0F" stroke-width="9" stroke-linecap="round"/>`).join("")}</g>`; }).join("")}`, ["#FB923C", "#FDE68A"], 600, 400, "Rows of agave plants at sunset in Oaxaca"),
    meditate: () => frame(`<circle cx="300" cy="170" r="110" fill="#FCE7F3" opacity=".8"/><rect y="300" width="600" height="100" fill="#E9D5FF"/>${bust(P.ines, 300, 250, 1.1)}<path d="M200 320c40-30 160-30 200 0" fill="#C4B5FD"/>`, ["#F5F3FF", "#EDE9FE"], 600, 400, "A person meditating in soft morning light"),
    chefs: () => frame(`<rect y="250" width="600" height="150" fill="#44403C"/><rect x="40" y="60" width="520" height="160" rx="8" fill="#292524"/>${[80, 200, 320, 440].map((x) => `<circle cx="${x + 40}" cy="100" r="20" fill="#FDE68A" opacity=".85"/><path d="M${x + 40} 60v20" stroke="#A8A29E"/>`).join("")}
      <ellipse cx="200" cy="280" rx="110" ry="24" fill="#F5F5F4"/><ellipse cx="200" cy="276" rx="60" ry="12" fill="#B91C1C"/><circle cx="185" cy="272" r="6" fill="#65A30D"/><ellipse cx="430" cy="290" rx="90" ry="20" fill="#F5F5F4"/><ellipse cx="430" cy="286" rx="50" ry="10" fill="#CA8A04"/><path d="M320 240v60M340 240v60" stroke="#E7E5E4" stroke-width="4"/><path d="M315 240h30v20h-30z" fill="#7F1D1D" opacity=".85"/>`, ["#1C1917", "#57534E"], 600, 400, "A warm, dim restaurant counter with plated dishes"),
    luxury: () => frame(`<rect x="0" y="300" width="600" height="100" fill="#D6D3D1"/><path d="M220 80h160l20 220H200z" fill="#E7E5E4"/><path d="M220 80c20 30 140 30 160 0" fill="#D6D3D1"/><path d="M300 100v200" stroke="#A8A29E" stroke-width="2"/><rect x="420" y="220" width="120" height="80" rx="10" fill="#78350F"/><path d="M450 220c0-30 60-30 60 0" stroke="#78350F" stroke-width="8" fill="none"/><text x="470" y="270" text-anchor="middle" font-family="Playfair Display,serif" font-size="14" fill="#FDE68A" opacity=".4">no logo</text>`, ["#F5F5F4", "#E7E5E4"], 600, 400, "A beige cashmere coat and an unbranded leather bag"),
    books: () => frame(`<rect y="300" width="600" height="100" fill="#A16207"/>${["#9F1239", "#1E3A8A", "#F59E0B", "#065F46", "#D946EF", "#1C1917", "#F97316", "#0E7490", "#BE185D", "#4D7C0F", "#7C2D12", "#6D28D9"].map((c, i) => `<rect x="${60 + i * 40}" y="${110 + (i % 4) * 14}" width="${32 + (i % 3) * 4}" height="${190 - (i % 4) * 14}" fill="${c}"/><rect x="${66 + i * 40}" y="${140 + (i % 4) * 14}" width="20" height="4" fill="#fff" opacity=".6"/>`).join("")}`, ["#FFF7ED", "#FDE68A"], 600, 400, "Twelve colorful book spines on a wooden shelf"),
    morning: () => frame(`<rect y="270" width="600" height="130" fill="#E7DCCF"/><g transform="translate(300 250)"><path d="M-50 0h100l-10 60h-80z" fill="#fff"/><ellipse cx="0" cy="0" rx="50" ry="10" fill="#65A30D"/><path d="M50 10c24 0 24 30 0 30" stroke="#fff" stroke-width="8" fill="none"/><path d="M-14-20c0-14 10-14 10-28M8-18c0-14 10-14 10-28" stroke="#fff" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/></g><circle cx="140" cy="300" r="30" fill="#FDE047"/><circle cx="140" cy="300" r="22" fill="#FEF9C3"/><path d="M460 300h80l-6 30h-68z" fill="#F59E0B"/>`, ["#FEF3C7", "#FFF7ED"], 600, 400, "A cup of matcha and lemon on a sunny breakfast table"),
    solo: () => frame(`<path d="M0 240 150 150 300 220 460 120 600 200V400H0z" fill="#64748B"/><path d="M0 290 200 230 380 280 600 240V400H0z" fill="#334155"/><rect y="330" width="600" height="70" fill="#0EA5E9" opacity=".55"/>${bust(P.nora, 220, 300, .9)}<rect x="250" y="240" width="40" height="70" rx="10" fill="#B45309"/>`, ["#FDBA74", "#BAE6FD"], 600, 400, "A solo traveler with a backpack looking over mountains and a lake"),
    retreat: () => frame(`<rect y="260" width="600" height="140" fill="#166534"/><path d="M200 260 300 170 400 260z" fill="#A16207"/><rect x="230" y="260" width="140" height="70" fill="#CA8A04"/><rect x="285" y="285" width="30" height="45" fill="#FDE68A"/>${[60, 120, 480, 540].map((x) => `<path d="M${x} 270 ${x - 30} 270 ${x} 160 ${x + 30} 270z" fill="#14532D"/>`).join("")}<rect x="100" y="300" width="50" height="34" rx="4" fill="#1C1917"/><path d="M110 300l30 34M140 300l-30 34" stroke="#DC2626" stroke-width="4"/>`, ["#BBF7D0", "#F0FDF4"], 600, 400, "A wooden cabin in a forest with a phone crossed out"),
    pasta: () => frame(`<ellipse cx="300" cy="220" rx="200" ry="120" fill="#F8FAFC"/><ellipse cx="300" cy="220" rx="150" ry="85" fill="#FDE68A"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${180 + i * 24} 180c20 20-20 40 0 60s-20 40 0 50" stroke="#F59E0B" stroke-width="5" fill="none"/>`).join("")}<circle cx="300" cy="215" r="34" fill="#F8FAFC"/><circle cx="300" cy="215" r="26" fill="#FEF9C3"/><circle cx="250" cy="180" r="12" fill="#DC2626"/><circle cx="350" cy="250" r="10" fill="#DC2626"/><path d="M340 170c10-10 24-6 20 6" fill="#16A34A"/>`, ["#FED7AA", "#FDBA74"], 600, 400, "A bowl of baked feta pasta with tomatoes"),
    onebag: () => frame(`<rect x="170" y="90" width="260" height="240" rx="40" fill="#0F766E"/><rect x="200" y="140" width="200" height="120" rx="14" fill="#115E59"/><path d="M250 90c0-40 100-40 100 0" stroke="#134E4A" stroke-width="16" fill="none"/>${[0, 1, 2].map((i) => `<rect x="${60 + i * 30}" y="${300 - i * 28}" width="80" height="20" rx="6" fill="${["#F59E0B", "#E7E5E4", "#1C1917"][i]}"/>`).join("")}<rect x="460" y="250" width="70" height="90" rx="10" fill="#F5F5F4"/>`, ["#F0FDFA", "#CCFBF1"], 600, 400, "A single carry-on backpack with neatly packed cubes"),
    rams: () => frame(`<rect y="300" width="600" height="100" fill="#D6D3D1"/><rect x="130" y="130" width="230" height="140" rx="6" fill="#E7E5E4" stroke="#A8A29E"/><g fill="#57534E">${Array.from({ length: 30 }, (_, i) => `<circle cx="${160 + (i % 6) * 18}" cy="${160 + Math.floor(i / 6) * 18}" r="4"/>`).join("")}</g><circle cx="310" cy="170" r="20" fill="#F97316"/><rect x="290" y="220" width="40" height="8" fill="#57534E"/><rect x="400" y="160" width="80" height="140" fill="#F5F5F4" stroke="#A8A29E"/><path d="M400 200h80M400 240h80" stroke="#A8A29E"/>`, ["#FAFAF9", "#E7E5E4"], 600, 400, "A minimalist radio and shelving unit in a calm studio"),
    capsule: () => frame(`${[["#FDE68A", 80, 90], ["#F5F5F4", 230, 80], ["#1C1917", 380, 100], ["#BE185D", 100, 240], ["#E7E5E4", 250, 230], ["#0F766E", 400, 250]].map(([c, x, y]) => `<rect x="${x}" y="${y}" width="120" height="110" rx="10" fill="${c}" stroke="#D6D3D1"/>`).join("")}`, ["#FDF4FF", "#FAE8FF"], 600, 400, "A flat-lay grid of six spring wardrobe pieces"),
    // collection collage
    slow: () => frame(`<circle cx="160" cy="150" r="100" fill="#FAE8FF"/><rect x="300" y="60" width="220" height="150" rx="14" fill="#FDF4FF" stroke="#F0ABFC"/><path d="M330 180c30-50 60-50 90-10s50 20 70-10" stroke="#D946EF" stroke-width="4" fill="none"/>
      <g transform="translate(160 160)"><path d="M-40-10h80l-8 60h-64z" fill="#fff" stroke="#E9D5FF" stroke-width="3"/><path d="M40 0c20 0 20 26 0 26" stroke="#E9D5FF" stroke-width="6" fill="none"/></g>
      <rect x="60" y="280" width="200" height="90" rx="10" fill="#fff"/><path d="M80 300h120M80 320h150M80 340h90" stroke="#E9D5FF" stroke-width="6" stroke-linecap="round"/><path d="M360 250c-20 40-10 90 30 110 40-20 50-70 30-110z" fill="#86EFAC"/><rect x="380" y="330" width="30" height="40" fill="#F59E0B"/>`, ["#FDF4FF", "#F5D0FE"], 600, 400, "Collage: a mug, a notebook, a plant and a calm landscape"),
    team: () => frame(`<rect y="280" width="700" height="140" fill="#D6C8B6"/><rect x="40" y="40" width="160" height="200" rx="8" fill="#FFF7ED"/><path d="M500 90c-20 0-30 40-10 60h40c20-20 10-60-30-60z" fill="#4D7C0F" opacity=".7"/>${bust(P.mia, 260, 330, 1.25)}${bust(P.leo, 440, 330, 1.25)}`, ["#FCE7D6", "#F5E6D8"], 700, 420, "Founders Mia Chen and Leo Alvarez in their Brooklyn studio")
  };
  const IG = [["rest", "Sunday reset: linen, tea, no alarms.", "2.4K"], ["pasta", "Test kitchen chaos (worth it).", "3.1K"], ["sauna", "Copenhagen, sauna, swim, repeat.", "1.9K"], ["books", "The shelf that runs our office.", "1.6K"], ["morning", "Matcha o'clock.", "2.2K"], ["wardrobe", "15 pieces. 30 days.", "2.8K"]];

  const avatar = (k, label) => portrait(P[k], label, "circle");
  window.Art = { scene: (k) => S[k](), avatar, IG };
})();
