// Original SVG food, chart and portrait illustrations for FuelRight (no photos). Exposes window.Art.
// The portrait helper is shared with sibling Opus-5.5 pages.
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

  const EM = "#10B981";
  const svg = (w, h, b, label, par = "xMidYMid slice") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="${par}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${b}</svg>`;
  // food building blocks (top-down)
  const grain = (cx, cy, r, c = "#FEF3C7") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>` + [...Array(Math.round(r / 2))].map((_, i) => `<ellipse cx="${cx + Math.cos(i * 2.3) * r * 0.6}" cy="${cy + Math.sin(i * 2.3) * r * 0.6}" rx="3" ry="1.6" fill="#FDE68A" transform="rotate(${i * 40} ${cx} ${cy})"/>`).join("");
  const broccoli = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="12" fill="#16A34A"/><circle cx="10" cy="-6" r="10" fill="#22C55E"/><circle cx="-9" cy="-7" r="9" fill="#15803D"/><circle cx="2" cy="-14" r="8" fill="#16A34A"/></g>`;
  const chicken = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-14" width="52" height="28" rx="12" fill="#D97706"/><path d="M-18-10l8 20M-4-12l8 22M10-12l8 22" stroke="#92400E" stroke-width="3" opacity=".7"/></g>`;
  const salmon = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30-12h60c6 0 8 24 0 24h-60c-8 0-8-24 0-24z" fill="#FB923C"/><path d="M-20-12l8 24M-4-12l8 24M12-12l8 24" stroke="#FED7AA" stroke-width="3"/></g>`;
  const sweet = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="16" ry="11" fill="#EA580C"/><ellipse cx="20" cy="8" rx="14" ry="10" fill="#F97316"/><ellipse cx="-4" cy="16" rx="13" ry="9" fill="#C2410C"/></g>`;
  const berries = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[[0, 0, "#7C3AED"], [10, 4, "#DC2626"], [-9, 6, "#4338CA"], [4, -9, "#E11D48"], [-6, -6, "#6D28D9"]].map(([a, b, c]) => `<circle cx="${a}" cy="${b}" r="6" fill="${c}"/>`).join("")}</g>`;
  const container = (x, y, w, h, inner) => `<g transform="translate(${x} ${y})"><rect x="4" y="6" width="${w}" height="${h}" rx="18" fill="#000" opacity=".12"/><rect width="${w}" height="${h}" rx="18" fill="#F8FAFC"/><rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="12" fill="#fff"/>${inner}</g>`;
  function spread() {
    let b = `<rect width="720" height="640" fill="#ECFDF5"/><rect x="40" y="40" width="640" height="560" rx="28" fill="#D6A26B"/>` + [...Array(9)].map((_, i) => `<path d="M40 ${80 + i * 60}c200 10 440-10 640 0" stroke="#B9824E" stroke-width="3" fill="none" opacity=".5"/>`).join("");
    b += container(80, 80, 260, 200, grain(80, 100, 52) + chicken(170, 70, 1.1) + broccoli(160, 140, 1.4) + broccoli(200, 150, 1.1));
    b += container(380, 80, 260, 200, grain(80, 100, 50, "#FFF7ED") + salmon(170, 76, 1.15) + broccoli(150, 146, 1.2) + broccoli(196, 140, 1));
    b += container(80, 320, 260, 200, sweet(70, 70, 1.2) + chicken(170, 70, 1) + `<circle cx="70" cy="146" r="36" fill="#BBF7D0"/><circle cx="62" cy="140" r="14" fill="#86EFAC"/><circle cx="82" cy="152" r="12" fill="#4ADE80"/>` + broccoli(180, 146, 1.3));
    b += `<g transform="translate(470 420)"><circle r="94" fill="#fff"/><circle r="80" fill="#FEF3C7"/>${berries(-30, -20, 1.4)}${berries(30, 10, 1.3)}<circle cx="-10" cy="30" r="14" fill="#F5F5F4"/><circle cx="34" cy="-36" r="10" fill="#A16207"/></g>`;
    b += `<g transform="translate(610 560) rotate(-20)"><rect x="-8" y="-60" width="16" height="90" rx="8" fill="#94A3B8"/><ellipse cy="-70" rx="14" ry="20" fill="#CBD5E1"/></g>`;
    b += `<g transform="translate(600 300)"><circle r="34" fill="#84CC16"/><path d="M0-34c4-10 12-14 18-14" stroke="#65A30D" stroke-width="5" fill="none"/></g>`;
    return svg(720, 640, b, "Illustrated top-down meal prep spread: rice, chicken, salmon, sweet potato, broccoli and a berry bowl");
  }
  const MEALS = {
    oats: () => `<circle cx="60" cy="60" r="52" fill="#fff"/><circle cx="60" cy="60" r="42" fill="#FEF3C7"/>${berries(48, 50, 1.2)}${berries(74, 70, 1)}<path d="M70 40q10 6 8 16" stroke="#A16207" stroke-width="6" fill="none" stroke-linecap="round"/>${[[40, 74], [52, 82], [62, 30]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="2.5" fill="#1F2937"/>`).join("")}`,
    yogurt: () => `<circle cx="60" cy="60" r="52" fill="#fff"/><circle cx="60" cy="60" r="42" fill="#F8FAFC"/><path d="M40 50c10 10 30 10 40 0" stroke="#FBBF24" stroke-width="7" fill="none" stroke-linecap="round"/>${[[46, 70], [64, 76], [76, 62], [52, 82]].map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="7" ry="5" fill="#A16207"/>`).join("")}`,
    bowl: () => `<circle cx="60" cy="60" r="52" fill="#fff"/><circle cx="60" cy="60" r="42" fill="#FEF9C3"/>${chicken(60, 44, 0.75)}${broccoli(40, 72, 0.9)}${sweet(76, 76, 0.6)}<path d="M38 56q22 14 44 0" stroke="#D6D3D1" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    apple: () => `<circle cx="60" cy="60" r="52" fill="#fff"/>${[0, 1, 2, 3].map((i) => `<path d="M60 60 L${60 + Math.cos(i * 1.2 - 2) * 40} ${60 + Math.sin(i * 1.2 - 2) * 40} A40 40 0 0 1 ${60 + Math.cos(i * 1.2 - 1.5) * 40} ${60 + Math.sin(i * 1.2 - 1.5) * 40}z" fill="${i % 2 ? "#FEF3C7" : "#FDE68A"}" stroke="#DC2626" stroke-width="3"/>`).join("")}<circle cx="78" cy="78" r="13" fill="#B45309"/>${[[40, 84], [50, 90]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="4" fill="#3F1D0B"/>`).join("")}`,
    salmon: () => `<circle cx="60" cy="60" r="52" fill="#fff"/>${salmon(56, 44, 0.9)}${sweet(44, 78, 0.7)}${broccoli(80, 78, 0.9)}`,
  };
  function meal(k, label) { return svg(120, 120, MEALS[k](), label, "xMidYMid meet"); }
  function result(kind) {
    if (kind === "silhouette") {
      const fig = (x, w, c) => `<g transform="translate(${x} 0)"><circle cy="40" r="18" fill="${c}"/><rect x="${-w / 2}" y="62" width="${w}" height="80" rx="${w / 3}" fill="${c}"/><rect x="${-w / 2 + 4}" y="134" width="${w / 2 - 7}" height="74" rx="10" fill="${c}"/><rect x="3" y="134" width="${w / 2 - 7}" height="74" rx="10" fill="${c}"/></g>`;
      return svg(320, 220, `<rect width="320" height="220" fill="#F0FDF4"/>${fig(90, 86, "#CBD5E1")}${fig(230, 58, EM)}<path d="M140 110h40" stroke="#64748B" stroke-width="3" marker-end="url(#ar)"/><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10z" fill="#64748B"/></marker></defs><text x="90" y="214" font-size="12" font-weight="700" fill="#64748B" text-anchor="middle" font-family="Outfit, sans-serif">MONTH 0</text><text x="230" y="214" font-size="12" font-weight="700" fill="#047857" text-anchor="middle" font-family="Outfit, sans-serif">MONTH 5</text>`, "Before and after silhouettes showing 35 lbs lost", "xMidYMid meet");
    }
    if (kind === "chart") {
      const pts = [150, 146, 140, 132, 126, 116, 108, 98, 92, 84, 76, 70].map((y, i) => `${30 + i * 25},${y}`).join(" ");
      return svg(320, 220, `<rect width="320" height="220" fill="#F0FDF4"/>${[50, 90, 130, 170].map((y) => `<path d="M30 ${y}h280" stroke="#D1FAE5"/>`).join("")}<polygon points="30,180 ${pts} 305,180" fill="${EM}" opacity=".15"/><polyline points="${pts}" fill="none" stroke="${EM}" stroke-width="4" stroke-linejoin="round"/><circle cx="305" cy="70" r="7" fill="#fff" stroke="${EM}" stroke-width="4"/><text x="300" y="52" font-size="14" font-weight="800" fill="#047857" text-anchor="end" font-family="Outfit, sans-serif">+12 lbs lean</text><text x="30" y="204" font-size="11" fill="#64748B" font-family="Outfit, sans-serif">WEEK 1</text><text x="305" y="204" font-size="11" fill="#64748B" text-anchor="end" font-family="Outfit, sans-serif">WEEK 24</text>`, "Chart of lean muscle gained over 24 weeks", "xMidYMid meet");
    }
    return svg(320, 220, `<rect width="320" height="220" fill="#F0FDF4"/><text x="30" y="44" font-size="13" font-weight="700" fill="#64748B" font-family="Outfit, sans-serif">HbA1c</text><rect x="30" y="58" width="260" height="20" rx="10" fill="#E2E8F0"/><rect x="30" y="58" width="${260 * 0.68}" height="20" rx="10" fill="#F59E0B"/><text x="290" y="100" font-size="12" fill="#B45309" text-anchor="end" font-family="Outfit, sans-serif">Before: 6.1% (pre-diabetic)</text><rect x="30" y="120" width="260" height="20" rx="10" fill="#E2E8F0"/><rect x="30" y="120" width="${260 * 0.52}" height="20" rx="10" fill="${EM}"/><text x="290" y="162" font-size="12" fill="#047857" text-anchor="end" font-family="Outfit, sans-serif">After: 5.4% (normal range)</text><path d="M30 190h260" stroke="#D1FAE5"/><text x="160" y="210" font-size="12" font-weight="700" fill="#047857" text-anchor="middle" font-family="Outfit, sans-serif">−0.7 points in 6 months</text>`, "Blood sugar marker improving from pre-diabetic to normal range", "xMidYMid meet");
  }
  function coach(look, label) { return `<svg viewBox="-90 -115 180 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust(look, 0, 0, 1, true)}</svg>`; }
  window.Art = { spread, meal, result, coach };
})();
