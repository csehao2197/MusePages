// Original illustrations: campus, people, map and thumbnails (no photos). Exposes window.Art.
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
    nadia: { skin: 1, hair: 0, hairStyle: "bob", top: 7, bg: 3, glasses: true },
    marcus: { skin: 3, hair: 0, hairStyle: "short", top: 3, bg: 4, beard: true },
    priya: { skin: 4, hair: 0, hairStyle: "long", top: 1, bg: 1 },
    kai: { skin: 2, hair: 1, hairStyle: "side", top: 2, bg: 2 },
    mentor: { skin: 7, hair: 5, hairStyle: "short", top: 4, bg: 6, glasses: true },
    mentee: { skin: 5, hair: 0, hairStyle: "curly", top: 6, bg: 5 }
  };
  const avatar = (p, label) => portrait(p, label, "circle");

  // seeded rng
  function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

  function tree(x, y, s, colors, r) {
    const blobs = Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2; return `<circle cx="${x + Math.cos(a) * 26 * s}" cy="${y - 70 * s + Math.sin(a) * 20 * s}" r="${(24 + r() * 10) * s}" fill="${colors[Math.floor(r() * colors.length)]}"/>`; }).join("");
    return `<rect x="${x - 4 * s}" y="${y - 50 * s}" width="${8 * s}" height="${50 * s}" fill="#4A2E1F"/>${blobs}<circle cx="${x}" cy="${y - 74 * s}" r="${26 * s}" fill="${colors[Math.floor(r() * colors.length)]}"/>`;
  }

  // wide campus with autumn foliage
  function campus() {
    const r = rng(11);
    const fall = ["#C2410C", "#EA580C", "#F59E0B", "#B45309", "#DC2626", "#D97706", "#9A3412"];
    const win = (x, y, w, h, n, m) => Array.from({ length: n * m }, (_, i) => `<rect x="${x + (i % n) * (w + 10)}" y="${y + Math.floor(i / n) * (h + 14)}" width="${w}" height="${h}" rx="${w / 2}" fill="#FDE68A" opacity="${0.55 + r() * 0.4}"/>`).join("");
    return `<svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3A8A"/><stop offset=".55" stop-color="#F59E0B"/><stop offset="1" stop-color="#FDBA74"/></linearGradient><linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4D7C0F"/><stop offset="1" stop-color="#365314"/></linearGradient></defs>
      <rect width="1600" height="700" fill="url(#sky)"/><circle cx="1240" cy="330" r="70" fill="#FEF3C7" opacity=".7"/>
      <g fill="#7C2D12" opacity=".35"><path d="M0 420 160 360 320 400 520 340 760 390 1000 330 1240 380 1460 340 1600 380V500H0z"/></g>
      <g fill="#9A6B4F"><rect x="380" y="300" width="840" height="220"/><path d="M360 300 800 210 1240 300z" fill="#7C3F2C"/></g>
      <rect x="740" y="120" width="120" height="220" fill="#A87458"/><path d="M730 120 800 50 870 120z" fill="#7C3F2C"/><circle cx="800" cy="170" r="26" fill="#F8FAFC"/><path d="M800 170V154M800 170l10 6" stroke="#1A1F36" stroke-width="3" stroke-linecap="round"/>
      <g fill="#B98A6E"><rect x="460" y="360" width="20" height="160"/><rect x="560" y="360" width="20" height="160"/><rect x="1020" y="360" width="20" height="160"/><rect x="1120" y="360" width="20" height="160"/></g>
      ${win(410, 330, 18, 30, 4, 3)}${win(620, 330, 18, 30, 4, 3)}${win(880, 330, 18, 30, 4, 3)}${win(1060, 330, 18, 30, 4, 3)}
      <rect x="770" y="420" width="60" height="100" rx="30" fill="#3B2A20"/><path d="M640 520h320l60 40H580z" fill="#E7E5E4"/>
      <rect y="520" width="1600" height="180" fill="url(#lawn)"/><path d="M700 700 770 540h60l70 160z" fill="#D6D3D1"/>
      ${[[80, 560, 1.4], [230, 540, 1.1], [320, 590, 1.6], [1290, 560, 1.3], [1420, 540, 1.1], [1520, 600, 1.7], [620, 560, .9], [980, 560, .9]].map(([x, y, s]) => tree(x, y, s, fall, r)).join("")}
      <g fill="#F97316" opacity=".8">${Array.from({ length: 40 }, () => `<ellipse cx="${r() * 1600}" cy="${560 + r() * 140}" rx="5" ry="3" transform="rotate(${r() * 180})"/>`).join("")}</g>
    </svg>`;
  }

  function mentorCall() {
    return `<svg viewBox="0 0 520 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A mentor and a student talking on a video call">
      <rect width="520" height="380" rx="18" fill="#1A1F36"/><rect x="16" y="16" width="488" height="300" rx="12" fill="#0F172A"/>
      <clipPath id="mc1"><rect x="24" y="24" width="232" height="284" rx="10"/></clipPath><clipPath id="mc2"><rect x="264" y="24" width="232" height="284" rx="10"/></clipPath>
      <g clip-path="url(#mc1)"><rect x="24" y="24" width="232" height="284" fill="#E0E7FF"/><rect x="40" y="60" width="80" height="100" fill="#fff" opacity=".6"/><rect x="48" y="70" width="64" height="8" fill="#1E40AF" opacity=".5"/>${bust(P.mentor, 140, 220, 1.2)}</g>
      <g clip-path="url(#mc2)"><rect x="264" y="24" width="232" height="284" fill="#F3E8FF"/><circle cx="460" cy="70" r="30" fill="#fff" opacity=".5"/>${bust(P.mentee, 380, 220, 1.2)}</g>
      <rect x="32" y="282" width="118" height="20" rx="5" fill="rgba(0,0,0,.55)"/><text x="40" y="296" font-family="Inter,sans-serif" font-size="11" fill="#fff">Mentor · Class of '04</text>
      <rect x="272" y="282" width="104" height="20" rx="5" fill="rgba(0,0,0,.55)"/><text x="280" y="296" font-family="Inter,sans-serif" font-size="11" fill="#fff">Student · '27</text>
      <g transform="translate(176 330)">${["#334155", "#334155", "#DC2626", "#334155"].map((c, i) => `<circle cx="${i * 56 + 20}" cy="20" r="18" fill="${c}"/>`).join("")}<path d="M14 14v12M26 14v12" stroke="#fff" stroke-width="3"/><rect x="66" y="12" width="20" height="16" rx="3" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M120 16h24" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="188" cy="20" r="3" fill="#fff"/><circle cx="178" cy="20" r="3" fill="#fff"/><circle cx="198" cy="20" r="3" fill="#fff"/></g>
    </svg>`;
  }

  // news thumbnails 16:9
  function thumb(kind) {
    const k = {
      rank: `<rect width="320" height="180" fill="#1E40AF"/><circle cx="260" cy="40" r="80" fill="#3B82F6" opacity=".4"/><text x="40" y="118" font-family="Merriweather,Georgia,serif" font-size="74" font-weight="900" fill="#fff">#28</text><path d="M200 140 V90 M224 140 V70 M248 140 V100 M272 140 V60" stroke="#FDE68A" stroke-width="14" stroke-linecap="round"/>`,
      portal: `<rect width="320" height="180" fill="#EDE9FE"/><rect x="60" y="30" width="200" height="124" rx="10" fill="#fff" stroke="#C4B5FD" stroke-width="2"/><rect x="60" y="30" width="200" height="22" rx="10" fill="#9333EA"/><rect x="76" y="66" width="80" height="10" rx="5" fill="#C4B5FD"/><rect x="76" y="86" width="168" height="8" rx="4" fill="#EDE9FE"/><rect x="76" y="102" width="140" height="8" rx="4" fill="#EDE9FE"/><rect x="76" y="124" width="64" height="18" rx="9" fill="#9333EA"/><path d="M228 118l20 20-8 2-4 8z" fill="#1A1F36"/>`,
      award: `<rect width="320" height="180" fill="#FEF3C7"/><circle cx="160" cy="80" r="44" fill="#F59E0B"/><circle cx="160" cy="80" r="32" fill="#FCD34D"/><text x="160" y="92" text-anchor="middle" font-family="Merriweather,Georgia,serif" font-size="30" font-weight="900" fill="#92400E">30</text><path d="M134 116 120 166 140 154 150 172 160 124M186 116 200 166 180 154 170 172 160 124" fill="#B45309"/>${bust(P.marcus, 270, 168, .55)}`
    }[kind];
    return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice">${k}</svg>`;
  }

  // simple world map (dot grid) with chapter pins; equirectangular 0..360 x 0..180
  function worldMap(pins) {
    // rough continent boxes [lon0, lat0, lon1, lat1] (lon -180..180, lat -90..90)
    const land = [[-168, 52, -56, 72], [-130, 25, -60, 52], [-118, 15, -84, 30], [-82, -55, -35, 12], [-10, 36, 40, 70], [-18, -35, 50, 36], [40, 5, 145, 72], [68, 8, 90, 30], [95, -10, 155, 25], [113, -43, 153, -12], [-55, 60, -20, 82], [128, 30, 146, 45]];
    const isLand = (lon, lat) => land.some(([a, b, c, d]) => lon >= a && lon <= c && lat >= b && lat <= d);
    const X = (lon) => ((lon + 180) / 360) * 720, Y = (lat) => ((90 - lat) / 180) * 360;
    let dots = "";
    for (let lat = 80; lat >= -56; lat -= 5) for (let lon = -175; lon <= 175; lon += 5) if (isLand(lon, lat)) dots += `<circle cx="${X(lon)}" cy="${Y(lat)}" r="3.4"/>`;
    return `<svg viewBox="0 30 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="World map with Crestfield alumni chapter locations">
      <g fill="#CBD5E1">${dots}</g>
      ${pins.map((p, i) => `<g class="pin" data-pin="${i}" transform="translate(${X(p.lon)} ${Y(p.lat)})" tabindex="0" role="button" aria-label="${p.city}, ${p.members.toLocaleString("en-US")} members"><circle r="14" fill="#9333EA" opacity=".18"/><circle r="7" fill="#9333EA" stroke="#fff" stroke-width="2.5"/></g>`).join("")}
    </svg>`;
  }

  window.Art = { campus, mentorCall, thumb, worldMap, avatar, P };
})();
