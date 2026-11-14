// Original flat illustrations and thumbnails (no photos). Exposes window.Art.
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


  const P = {
    sarah: { skin: 1, hair: 2, hairStyle: "long", top: 3, bg: 4 },
    hero: { skin: 3, hair: 0, hairStyle: "curly", top: 1, bg: 1 }
  };
  let n = 0;
  const wrap = (inner, w, h, label, bg) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><rect width="${w}" height="${h}" fill="${bg}"/>${inner}</svg>`;

  // hero: person relaxing on a couch with floating icons
  function hero() {
    return `<svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a person relaxing on a couch with a laptop, surrounded by a piggy bank, a rising chart and a coffee cup">
      <circle cx="290" cy="250" r="210" fill="#ECFDF5"/><circle cx="430" cy="110" r="60" fill="#D1FAE5"/>
      <rect x="70" y="300" width="420" height="90" rx="30" fill="#059669"/><rect x="90" y="250" width="380" height="80" rx="30" fill="#10B981"/><rect x="50" y="270" width="60" height="120" rx="26" fill="#047857"/><rect x="450" y="270" width="60" height="120" rx="26" fill="#047857"/><rect x="90" y="388" width="14" height="30" fill="#78350F"/><rect x="456" y="388" width="14" height="30" fill="#78350F"/>
      <path d="M210 300c-40 0-80 10-100 40h80z" fill="#1F2937"/>
      ${bust(P.hero, 250, 250, .95)}
      <path d="M320 330h120l-14 24H300z" fill="#1F2937"/><path d="M190 340h100v14H190z" fill="#1F2937"/>
      <g transform="translate(250 250) rotate(-8)"><rect x="-10" y="40" width="110" height="70" rx="6" fill="#E5E7EB"/><rect x="-4" y="46" width="98" height="58" rx="3" fill="#111827"/><path d="M6 92l20-16 18 8 24-22 18 10" stroke="#34D399" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g class="float1" transform="translate(70 120)"><rect width="110" height="76" rx="16" fill="#fff" stroke="#D1FAE5" stroke-width="2"/><path d="M18 56l22-18 18 10 32-26" stroke="#059669" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 22h12v12" stroke="#059669" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      <g class="float2" transform="translate(410 190)"><ellipse cx="40" cy="40" rx="40" ry="32" fill="#F9A8D4"/><circle cx="68" cy="34" r="8" fill="#F472B6"/><circle cx="64" cy="32" r="2" fill="#831843"/><rect x="18" y="62" width="10" height="14" rx="3" fill="#F472B6"/><rect x="50" y="62" width="10" height="14" rx="3" fill="#F472B6"/><path d="M28 14h22" stroke="#831843" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="-6" r="12" fill="#FBBF24" stroke="#D97706" stroke-width="3"/><text x="38" y="-1" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="800" fill="#92400E">$</text></g>
      <g class="float3" transform="translate(380 40)"><path d="M10 20h44l-6 44H16z" fill="#fff" stroke="#E5E7EB" stroke-width="2"/><path d="M54 30c14 0 14 22 0 22" stroke="#E5E7EB" stroke-width="5" fill="none"/><path d="M22 10c0-8 6-8 6-16M36 10c0-8 6-8 6-16" stroke="#9CA3AF" stroke-width="3" fill="none" stroke-linecap="round"/></g>
      <g class="float1" transform="translate(190 60)"><circle r="22" fill="#FBBF24"/><circle r="15" fill="none" stroke="#D97706" stroke-width="3"/><text y="6" text-anchor="middle" font-family="Inter,sans-serif" font-size="16" font-weight="800" fill="#92400E">¢</text></g>
    </svg>`;
  }

  // article thumbnails 16:9 (320x180)
  const T = {
    budget: () => wrap(`<rect x="110" y="18" width="100" height="160" rx="16" fill="#111827"/><rect x="118" y="30" width="84" height="136" rx="6" fill="#fff"/>${Array.from({ length: 7 }, (_, i) => `<rect x="124" y="${40 + i * 17}" width="34" height="9" rx="2" fill="#D1FAE5"/><rect x="162" y="${40 + i * 17}" width="34" height="9" rx="2" fill="${i % 3 ? "#F3F4F6" : "#A7F3D0"}"/>`).join("")}<circle cx="250" cy="60" r="26" fill="#059669"/><text x="250" y="66" text-anchor="middle" font-family="Inter" font-size="16" font-weight="800" fill="#fff">%</text>`, 320, 180, "", "#ECFDF5"),
    loans: () => wrap(`${Array.from({ length: 26 }, (_, i) => `<rect x="${(i * 37) % 320}" y="${(i * 53) % 170}" width="8" height="14" rx="2" fill="${["#F59E0B", "#059669", "#3B82F6", "#EC4899", "#8B5CF6"][i % 5]}" transform="rotate(${i * 23} ${(i * 37) % 320} ${(i * 53) % 170})"/>`).join("")}<text x="160" y="104" text-anchor="middle" font-family="Lora,serif" font-size="44" font-weight="700" fill="#065F46">$0.00</text><text x="160" y="132" text-anchor="middle" font-family="Inter" font-size="13" fill="#047857">balance remaining</text>`, 320, 180, "", "#FEF3C7"),
    hysa: () => wrap(`${[["#059669", 4.6], ["#3B82F6", 4.35], ["#8B5CF6", 4.2], ["#9CA3AF", .45]].map(([c, v], i) => `<rect x="${50 + i * 60}" y="${150 - v * 26}" width="40" height="${v * 26}" rx="6" fill="${c}"/><text x="${70 + i * 60}" y="${142 - v * 26}" text-anchor="middle" font-family="Inter" font-size="11" font-weight="700" fill="#374151">${v}%</text>`).join("")}<path d="M30 150h270" stroke="#D1D5DB" stroke-width="2"/>`, 320, 180, "", "#F0F9FF"),
    roth: () => wrap(`<rect x="30" y="30" width="120" height="120" rx="14" fill="#fff"/><rect x="170" y="30" width="120" height="120" rx="14" fill="#fff"/><text x="90" y="62" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#059669">ROTH</text><text x="230" y="62" text-anchor="middle" font-family="Inter" font-size="13" font-weight="700" fill="#3B82F6">TRADITIONAL</text><path d="M50 130l20-20 20 6 30-40" stroke="#059669" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M190 130l20-14 20 4 30-30" stroke="#3B82F6" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="160" cy="90" r="16" fill="#111827"/><text x="160" y="95" text-anchor="middle" font-family="Inter" font-size="11" font-weight="800" fill="#fff">VS</text>`, 320, 180, "", "#EEF2FF"),
    hustle: () => wrap(`<rect y="130" width="320" height="50" fill="#D6BFA8"/><rect x="90" y="40" width="140" height="90" rx="8" fill="#1F2937"/><rect x="98" y="48" width="124" height="74" rx="4" fill="#F0FDF4"/><path d="M108 108l22-18 18 8 26-26 22 6" stroke="#059669" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M70 130h180" stroke="#9CA3AF" stroke-width="8" stroke-linecap="round"/><path d="M262 92c-14 0-18 24-6 38h20c10-14 0-38-14-38z" fill="#16A34A"/><rect x="254" y="122" width="22" height="16" fill="#B45309"/><path d="M40 112h28l-4 20h-20z" fill="#fff"/>`, 320, 180, "", "#FEF3C7"),
    cards: () => wrap(`${[["#111827", -12, 70], ["#059669", 0, 130], ["#3B82F6", 12, 190]].map(([c, r, x]) => `<g transform="translate(${x} 92) rotate(${r})"><rect x="-56" y="-36" width="112" height="72" rx="10" fill="${c}"/><rect x="-44" y="-18" width="22" height="16" rx="3" fill="#FCD34D"/><path d="M-44 18h60" stroke="#fff" stroke-opacity=".6" stroke-width="4" stroke-linecap="round"/></g>`).join("")}`, 320, 180, "", "#E5E7EB"),
    feature: () => wrap(`<rect width="480" height="360" fill="#ECFDF5"/><g transform="translate(70 40)"><rect width="340" height="230" rx="18" fill="#fff"/><text x="28" y="50" font-family="Inter" font-size="15" font-weight="700" fill="#6B7280">Portfolio</text><text x="28" y="92" font-family="Lora,serif" font-size="30" font-weight="700" fill="#111827">$100 → $1,860</text><path d="M28 200 80 180 130 186 180 150 230 140 280 100 312 80" stroke="#059669" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 200 80 180 130 186 180 150 230 140 280 100 312 80V210H28z" fill="#059669" opacity=".12"/></g><g transform="translate(330 250)"><circle r="44" fill="#FBBF24"/><circle r="32" fill="none" stroke="#D97706" stroke-width="4"/><text y="10" text-anchor="middle" font-family="Inter" font-size="30" font-weight="800" fill="#92400E">$</text></g><text x="70" y="330" font-family="Inter" font-size="13" fill="#047857">Illustrative growth of $100/month over 12 months</text>`, 480, 360, "Chart illustrating a portfolio growing from $100", "#ECFDF5")
  };
  const avatar = (k, label) => portrait(P[k], label, "circle");
  window.Art = { hero, thumb: (k) => T[k](), avatar };
})();
