// Original SVG portrait and project illustrations (no photos). Exposes window.Art.
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


  // ---------- editorial project "screenshots" ----------
  const C = { cream: "#FAFAF5", ink: "#1A1A1A", blue: "#1E3A5F", sage: "#8B9D8B", warm: "#EDEAE5", rust: "#B4653E" };
  const R = (x, y, w, h, f, r = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"${extra}/>`;
  const T = (x, y, s, f, w, txt, fam = "Playfair Display, Georgia, serif") => `<text x="${x}" y="${y}" font-family="${fam}" font-size="${s}" font-weight="${w}" fill="${f}">${txt}</text>`;
  const SC = {
    atlas: () => `${R(0, 0, 800, 600, C.warm)}${R(90, 70, 620, 500, "#fff", 6)}${R(90, 70, 160, 500, C.cream)}
      ${T(112, 112, 22, C.blue, 700, "Atlas")}${[0, 1, 2, 3, 4, 5].map((i) => R(112, 140 + i * 30, 70 + (i * 17) % 40, 8, i === 2 ? C.blue : "#D4D0C8", 4)).join("")}
      ${T(280, 124, 30, C.ink, 700, "Button")}${R(280, 140, 300, 8, "#D4D0C8", 4)}
      ${[["Primary", C.blue, "#fff"], ["Secondary", "#fff", C.blue], ["Quiet", C.cream, C.ink]].map(([l, bg, fg], i) => `${R(280 + i * 130, 180, 116, 44, bg, 22, ` stroke="${C.blue}" stroke-width="2"`)}${T(338 + i * 130, 208, 15, fg, 600, l, "DM Sans, sans-serif").replace("<text", '<text text-anchor="middle"')}`).join("")}
      ${R(280, 252, 400, 150, C.cream, 6)}${[0, 1, 2, 3].map((i) => R(300, 276 + i * 28, 180 + (i * 53) % 150, 10, i ? "#C9C4BA" : C.sage, 5)).join("")}
      ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${300 + i * 62}" cy="460" r="22" fill="${[C.blue, C.sage, C.rust, C.ink, "#D9CBB0", "#5B7FA6"][i]}"/>`).join("")}${R(280, 510, 300, 8, "#D4D0C8", 4)}`,
    meridian: () => `${R(0, 0, 800, 600, C.blue)}<circle cx="700" cy="80" r="200" fill="#2B4C75"/>
      ${R(140, 60, 300, 520, "#fff", 30)}${R(156, 76, 268, 488, C.cream, 20)}${T(176, 120, 22, C.ink, 700, "Checkout")}
      ${[0, 1].map((i) => `${R(176, 140 + i * 86, 228, 72, "#fff", 10)}${R(188, 152 + i * 86, 48, 48, [C.sage, C.rust][i], 8)}${R(248, 160 + i * 86, 110, 9, C.ink, 4)}${R(248, 178 + i * 86, 70, 8, "#C9C4BA", 4)}`).join("")}
      ${R(176, 330, 228, 1, "#D4D0C8")}${T(176, 366, 15, "#6B6B6B", 400, "Total", "DM Sans, sans-serif")}${T(340, 366, 17, C.ink, 700, "$148.00", "DM Sans, sans-serif")}
      ${R(176, 396, 228, 52, C.blue, 26)}${T(290, 428, 16, "#fff", 600, "Pay now", "DM Sans, sans-serif").replace("<text", '<text text-anchor="middle"')}
      ${R(470, 150, 230, 140, "#fff", 14)}${T(492, 196, 40, C.blue, 700, "-31%")}${T(492, 226, 14, "#6B6B6B", 400, "checkout abandonment", "DM Sans, sans-serif")}${R(492, 250, 180, 8, C.warm, 4)}${R(492, 250, 124, 8, C.sage, 4)}
      ${R(470, 320, 230, 110, "#fff", 14)}${T(492, 364, 34, C.ink, 700, "1.1s")}${T(492, 392, 14, "#6B6B6B", 400, "time to interactive", "DM Sans, sans-serif")}`,
    tidepool: () => `${R(0, 0, 800, 600, C.cream)}${T(60, 96, 42, C.ink, 700, "Tidepool")}${T(60, 126, 15, "#6B6B6B", 400, "Coastal sensor network · 30 days", "DM Sans, sans-serif")}
      ${[0, 1, 2, 3].map((k) => `<path d="${Array.from({ length: 31 }, (_, i) => `${i ? "L" : "M"}${60 + i * 22} ${330 + k * 34 - Math.sin(i / 3 + k) * (40 - k * 6) - Math.cos(i / 7) * 14}`).join(" ")}" stroke="${[C.blue, C.sage, C.rust, "#5B7FA6"][k]}" stroke-width="${k ? 2 : 3.5}" fill="none" opacity="${k ? .8 : 1}"/>`).join("")}
      ${R(60, 470, 660, 1, C.ink)}${[0, 1, 2, 3, 4, 5].map((i) => T(60 + i * 132, 496, 12, "#6B6B6B", 400, `Mar ${1 + i * 6}`, "JetBrains Mono, monospace")).join("")}
      ${R(520, 160, 200, 92, "#fff", 4, ` stroke="${C.ink}" stroke-width="1"`)}${T(538, 196, 13, "#6B6B6B", 400, "Water temp.", "DM Sans, sans-serif")}${T(538, 232, 30, C.blue, 700, "14.2°C")}
      <line x1="390" y1="150" x2="390" y2="470" stroke="${C.ink}" stroke-dasharray="4 6"/><circle cx="390" cy="292" r="7" fill="${C.blue}"/>`,
    wayfinder: () => `${R(0, 0, 800, 600, C.sage)}<circle cx="120" cy="520" r="220" fill="#7D8F7D"/>
      ${[0, 1].map((p) => `<g transform="translate(${250 + p * 210} ${70 + p * 40})">${R(0, 0, 200, 420, C.ink, 32)}${R(10, 10, 180, 400, C.cream, 24)}
        ${p ? `${T(28, 60, 20, C.ink, 700, "Gallery 4")}${R(28, 76, 120, 8, "#C9C4BA", 4)}${R(28, 100, 144, 120, C.blue, 8)}<circle cx="100" cy="160" r="30" fill="#D9CBB0"/>${R(28, 236, 144, 8, C.ink, 4)}${R(28, 254, 110, 8, "#C9C4BA", 4)}${R(28, 300, 144, 46, C.blue, 23)}${T(100, 329, 14, "#fff", 600, "Play audio", "DM Sans, sans-serif").replace("<text", '<text text-anchor="middle"')}`
        : `${T(28, 60, 20, C.ink, 700, "Wayfinder")}${R(28, 84, 144, 180, "#E3E7DF", 8)}<path d="M50 240 L80 180 L120 200 L150 120" stroke="${C.blue}" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="2 10"/><circle cx="150" cy="120" r="10" fill="${C.rust}"/><circle cx="50" cy="240" r="8" fill="${C.blue}"/>${[0, 1, 2].map((i) => `${R(28, 284 + i * 36, 144, 26, "#fff", 6)}${R(38, 293 + i * 36, 70 + i * 14, 8, "#9A9A9A", 4)}`).join("")}`}</g>`).join("")}`
  };
  const shot = (k, label) => `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${SC[k]()}</svg>`;
  const ME = { skin: 1, hair: 3, hairStyle: "long", top: 7, bg: 6, glasses: false };
  const me = (label) => `<svg viewBox="-90 -112 180 232" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice"><rect x="-90" y="-112" width="180" height="232" fill="#8B9D8B"/><circle cx="-40" cy="-60" r="90" fill="#9DAE9D"/>${bust(ME, 6, 4, 1.05, false)}</svg>`;
  window.Art = { shot, me };
})();
