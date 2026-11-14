// Original SVG portrait and project mockups (no photos). Exposes window.Art.
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


  // ---------- project thumbnails (UI mockups) ----------
  const win = (bg, bar, inner) => `<rect width="640" height="400" fill="${bg}"/><g transform="translate(60 44)"><rect x="6" y="12" width="520" height="340" rx="14" fill="rgba(0,0,0,.18)"/><rect width="520" height="340" rx="14" fill="${bar}"/><circle cx="20" cy="18" r="5" fill="#F87171"/><circle cx="36" cy="18" r="5" fill="#FBBF24"/><circle cx="52" cy="18" r="5" fill="#34D399"/><rect x="0" y="36" width="520" height="304" fill="#fff"/><rect x="0" y="326" width="520" height="14" rx="0" fill="#fff"/>${inner}</g>`;
  const L = (x, y, w, c = "#E2E8F0", h = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}"/>`;
  const SC = {
    ledger: () => win("#0EA5E9", "#0F172A", `<rect x="0" y="36" width="110" height="304" fill="#F1F5F9"/>${[0, 1, 2, 3, 4].map((i) => L(18, 62 + i * 28, 60 + (i % 2) * 14, i === 0 ? "#0EA5E9" : "#CBD5E1")).join("")}
      ${[0, 1, 2].map((i) => `<rect x="${128 + i * 128}" y="54" width="116" height="66" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/>${L(140 + i * 128, 68, 50, "#94A3B8", 6)}<text x="${140 + i * 128}" y="104" font-family="Inter,sans-serif" font-size="20" font-weight="700" fill="#0F172A">${["$8,420", "$2,180", "+12%"][i]}</text>`).join("")}
      <rect x="128" y="134" width="372" height="186" rx="10" fill="#F8FAFC" stroke="#E2E8F0"/><path d="M146 290 L190 262 L234 272 L278 228 L322 240 L366 196 L410 206 L454 168 L484 176" stroke="#0EA5E9" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M146 290 L190 262 L234 272 L278 228 L322 240 L366 196 L410 206 L454 168 L484 176 V304 H146z" fill="#0EA5E9" opacity=".12"/>`),
    trail: () => win("#22C55E", "#14532D", `<rect x="0" y="36" width="520" height="304" fill="#DCFCE7"/><path d="M0 120 C80 90 160 160 240 130 S400 80 520 110" stroke="#BBF7D0" stroke-width="30" fill="none"/><path d="M0 250 C120 230 200 300 320 260 S460 220 520 250" stroke="#86EFAC" stroke-width="40" fill="none" opacity=".6"/>
      <path d="M60 300 C120 250 140 200 210 190 S300 140 340 120 S420 90 460 70" stroke="#15803D" stroke-width="5" fill="none" stroke-dasharray="2 10" stroke-linecap="round"/><circle cx="60" cy="300" r="10" fill="#15803D"/><path d="M460 50 l0 22 M460 50 l18 6 -18 6" stroke="#B91C1C" stroke-width="4" fill="#EF4444"/>
      <rect x="320" y="226" width="180" height="96" rx="12" fill="#fff"/>${L(336, 244, 90, "#14532D")}${L(336, 262, 120)}<path d="M336 306 l20-18 18 10 22-24 22 14 22-12 22 20" stroke="#22C55E" stroke-width="3" fill="none"/>`),
    commit: () => `<rect width="640" height="400" fill="#18181B"/><g font-family="ui-monospace,Menlo,monospace" font-size="17"><text x="48" y="70" fill="#A1A1AA">$ <tspan fill="#FAFAFA">npx commitly</tspan></text><text x="48" y="110" fill="#22D3EE">? Select the type of change:</text>
      ${["feat:     A new feature", "fix:      A bug fix", "docs:     Documentation only", "refactor: Code change, no new behavior"].map((t, i) => `<text x="64" y="${146 + i * 30}" fill="${i === 0 ? "#FACC15" : "#D4D4D8"}">${i === 0 ? "❯ " : "  "}${t}</text>`).join("")}
      <text x="48" y="290" fill="#22D3EE">? Scope: <tspan fill="#FAFAFA">projects</tspan></text><text x="48" y="322" fill="#4ADE80">✓ feat(projects): add case study for portfolio app</text><text x="48" y="354" fill="#A1A1AA">  v1.4.0 → v1.5.0 · CHANGELOG.md updated</text></g>`,
    shelf: () => `<rect width="640" height="400" fill="#FDE68A"/><circle cx="560" cy="60" r="120" fill="#FCD34D"/>${[0, 1].map((p) => `<g transform="translate(${150 + p * 190} ${40 + p * 20}) rotate(${p ? 4 : -4})"><rect width="160" height="320" rx="28" fill="#1F2937"/><rect x="8" y="8" width="144" height="304" rx="22" fill="#fff"/><rect x="56" y="16" width="48" height="8" rx="4" fill="#1F2937"/>
      ${p ? `${L(22, 44, 80, "#1F2937", 10)}${[0, 1, 2].map((i) => `<rect x="22" y="${70 + i * 76}" width="44" height="64" rx="4" fill="${["#F97316", "#6366F1", "#14B8A6"][i]}"/>${L(76, 78 + i * 76, 56, "#334155")}${L(76, 94 + i * 76, 40)}<rect x="76" y="${110 + i * 76}" width="56" height="6" rx="3" fill="#E5E7EB"/><rect x="76" y="${110 + i * 76}" width="${[44, 20, 56][i]}" height="6" rx="3" fill="#F59E0B"/>`).join("")}` : `<rect x="22" y="44" width="116" height="160" rx="6" fill="#6366F1"/>${L(38, 70, 70, "#C7D2FE", 8)}${L(38, 88, 50, "#C7D2FE", 8)}${L(22, 220, 100, "#1F2937", 10)}${L(22, 240, 70)}${[0, 1, 2, 3, 4].map((i) => `<path d="M${30 + i * 20} 266l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="${i < 4 ? "#F59E0B" : "#E5E7EB"}"/>`).join("")}`}</g>`).join("")}`,
    pulse: () => win("#8B5CF6", "#1E1B4B", `<rect x="0" y="36" width="520" height="304" fill="#0F0D24"/>${[0, 1, 2, 3].map((i) => `<rect x="${20 + (i % 2) * 250}" y="${54 + Math.floor(i / 2) * 140}" width="230" height="124" rx="10" fill="#1E1B4B"/>${L(36 + (i % 2) * 250, 72 + Math.floor(i / 2) * 140, 70, "#A5B4FC", 6)}<circle cx="${230 + (i % 2) * 250}" cy="${75 + Math.floor(i / 2) * 140}" r="6" fill="${i === 2 ? "#FBBF24" : "#34D399"}"/>
      <path d="${Array.from({ length: 12 }, (_, k) => `${k ? "L" : "M"}${36 + (i % 2) * 250 + k * 18} ${150 + Math.floor(i / 2) * 140 - Math.abs(Math.sin(k * 1.3 + i)) * 50}`).join(" ")}" stroke="${["#818CF8", "#22D3EE", "#FBBF24", "#F472B6"][i]}" stroke-width="3" fill="none" stroke-linejoin="round"/>`).join("")}`),
    folio: () => win("#F43F5E", "#111827", `<rect x="0" y="36" width="520" height="304" fill="#0B1120"/>${L(24, 58, 60, "#F43F5E")}${[0, 1, 2, 3].map((i) => L(300 + i * 52, 58, 36, "#475569", 6)).join("")}
      <text x="24" y="140" font-family="Inter,sans-serif" font-size="34" font-weight="800" fill="#F8FAFC">Hi, I'm Jordan.</text>${L(24, 160, 260, "#64748B", 10)}${L(24, 180, 200, "#64748B", 10)}<rect x="24" y="206" width="110" height="34" rx="8" fill="#F43F5E"/><rect x="144" y="206" width="90" height="34" rx="8" fill="none" stroke="#475569" stroke-width="2"/>
      ${[0, 1, 2].map((i) => `<rect x="${24 + i * 162}" y="262" width="148" height="70" rx="8" fill="#1E293B"/>`).join("")}<circle cx="420" cy="150" r="64" fill="#1E293B"/><circle cx="420" cy="150" r="64" fill="none" stroke="#F43F5E" stroke-width="3" stroke-dasharray="6 10"/>`)
  };
  const thumb = (k, label) => `<svg viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${SC[k]()}</svg>`;
  const ME = { skin: 3, hair: 0, hairStyle: "side", top: 1, bg: 1, glasses: true };
  const me = (label) => `<svg viewBox="-100 -110 200 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice"><rect x="-100" y="-110" width="200" height="230" fill="#FFE4E6"/><circle cx="60" cy="-70" r="60" fill="#FECDD3"/>${bust(ME, 0, 0, 1, false)}</svg>`;
  window.Art = { thumb, me };
})();
