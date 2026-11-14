// Original SVG illustrations for Iron Path Academy (no photos). Exposes window.Art.
// Portrait and figure helpers are shared with sibling Opus-5.5 pages.
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

  // a stylised athlete silhouette built from limbs: pose = joint angles
  function athlete(x, y, s, pose, fill, extra = "") {
    const P = Object.assign({ torso: -10, head: 0, armL: 160, armR: 150, foreL: 0, foreR: 0, legL: 10, legR: -10, shinL: 0, shinR: 0 }, pose);
    const limb = (len, w, ang, child = "") => `<g transform="rotate(${ang})"><rect x="${-w / 2}" y="0" width="${w}" height="${len}" rx="${w / 2}" fill="${fill}"/>${child ? `<g transform="translate(0 ${len - w / 2})">${child}</g>` : ""}</g>`;
    const leg = (a, b) => limb(78, 26, a, limb(76, 21, b));
    const arm = (a, b, hold = "") => limb(58, 18, a, limb(54, 15, b, hold));
    return `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>
      ${leg(P.legL, P.shinL)}${leg(P.legR, P.shinR)}
      <g transform="rotate(${P.torso})">
        <rect x="-26" y="-112" width="52" height="118" rx="24" fill="${fill}"/>
        <g transform="translate(0 -128) rotate(${P.head})"><circle r="22" fill="${fill}"/></g>
        <g transform="translate(-6 -100)">${arm(P.armL, P.foreL, P.hold || "")}</g>
        <g transform="translate(6 -100)">${arm(P.armR, P.foreR)}</g>
      </g>
    </g>`;
  }
  const RED = "#DC2626", GOLD = "#F59E0B";
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
  let uid = 0;
  function room(w, h, light = 0.6) {
    const id = `lt${++uid}`;
    let b = `<defs><radialGradient id="${id}" cx="${light}" cy="0" r=".9"><stop offset="0" stop-color="#FEF3C7" stop-opacity=".5"/><stop offset=".5" stop-color="#9CA3AF" stop-opacity=".12"/><stop offset="1" stop-color="#111827" stop-opacity="0"/></radialGradient></defs>`;
    b += `<rect width="${w}" height="${h}" fill="#1F2937"/>`;
    b += `<rect y="${h * 0.12}" width="${w}" height="${h * 0.5}" fill="#374151" opacity=".5"/>`;
    for (let x = 30; x < w; x += 220) b += `<rect x="${x}" y="${h * 0.16}" width="150" height="${h * 0.1}" fill="${[RED, "#1D4ED8", GOLD, "#F9FAFB"][(x / 220 | 0) % 4]}" opacity=".55"/>`;
    b += `<rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#111827"/>`;
    for (let x = 0; x < w; x += 120) b += `<rect x="${x}" y="${h * 0.66}" width="120" height="${h * 0.34}" fill="${(x / 120) % 2 ? "#1F2937" : "#18202D"}"/>`;
    b += `<rect width="${w}" height="${h}" fill="url(#${id})"/>`;
    return b;
  }
  const P = {
    kick: { torso: -28, head: -10, armL: 40, armR: -40, foreL: 110, foreR: -100, legL: -6, legR: 95, shinL: 0, shinR: 10 },
    guard: { torso: -4, armL: 150, armR: 200, foreL: -150, foreR: 150, legL: -18, legR: 18 },
    pads: { torso: 6, armL: 120, armR: 70, foreL: 40, foreR: 60, legL: -14, legR: 20 },
    stand: { torso: 0, armL: 14, armR: -14, legL: -6, legR: 6 },
    corner: { torso: 10, armL: 100, armR: -30, foreL: 40, foreR: -20, legL: -10, legR: 14, shinL: 30 },
    lift: { torso: 0, armL: 175, armR: 185, foreL: 0, foreR: 0, legL: -20, legR: 20 },
    rope: { torso: 30, armL: 70, armR: 60, foreL: -40, foreR: -30, legL: -50, legR: 40, shinL: 70, shinR: -50 },
    stretch: { torso: 80, head: 10, armL: 200, armR: 190, legL: -80, legR: 70, shinL: 0, shinR: 0 },
  };
  const fig = (x, floor, s, pose, fill = "#0B0F17", rim = RED) => { const y = floor - 150 * s, p = P[pose] || pose; return (rim ? `<g opacity=".8">${athlete(x + 4 * s, y - 2 * s, s, p, rim)}</g>` : "") + athlete(x, y, s, p, fill); };
  const bag = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0-160V-120" stroke="#6B7280" stroke-width="4"/><rect x="-34" y="-120" width="68" height="200" rx="30" fill="${RED}"/><rect x="-34" y="-80" width="68" height="10" fill="#7F1D1D"/><rect x="-34" y="30" width="68" height="10" fill="#7F1D1D"/></g>`;
  // two grapplers on the ground
  const grapple = (x, y, s, a = "#0B0F17", b = "#F9FAFB") => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="150" ry="18" fill="#000" opacity=".35"/><rect x="-120" y="-10" width="170" height="50" rx="25" fill="${b}"/><circle cx="-140" cy="10" r="24" fill="${b}"/><rect x="40" y="-10" width="90" height="26" rx="13" fill="${b}" transform="rotate(-20 40 0)"/><rect x="-60" y="-60" width="140" height="54" rx="27" fill="${a}" transform="rotate(12 0 -30)"/><circle cx="96" cy="-50" r="24" fill="${a}"/><rect x="-80" y="-28" width="100" height="22" rx="11" fill="${a}" transform="rotate(-30 -60 -20)"/><rect x="-60" y="8" width="16" height="40" rx="8" fill="${GOLD}"/></g>`;

  function hero() {
    let b = room(1600, 900, 0.62);
    b += bag(1130, 520, 1.6) + bag(1450, 520, 1.3);
    b += fig(960, 860, 1.7, "kick");
    b += fig(620, 860, 1.25, "guard", "#0B0F17") + fig(760, 860, 1.25, "pads", "#1F2937");
    b += grapple(1320, 830, 1.1);
    return svg(1600, 900, b, "Illustration of fighters training in a lit mat room: one kicking a heavy bag, others drilling in pairs");
  }
  const SC = {
    bjj: () => { let b = room(800, 500, 0.5); b += grapple(400, 410, 1.3); return [800, 500, b, "Ground technique demonstration in BJJ"]; },
    muaythai: () => { let b = room(800, 500, 0.4); b += fig(330, 470, 1.15, "kick") + fig(540, 470, 1.1, "pads", "#1F2937"); b += `<rect x="470" y="${470 - 260}" width="34" height="56" rx="10" fill="${RED}"/>`; return [800, 500, b, "Fighter throwing a roundhouse kick on pads"]; },
    mma: () => { let b = room(800, 500, 0.5); for (let i = 0; i < 9; i++) b += `<path d="M${i * 100 - 40} 60 l80 400" stroke="#9CA3AF" stroke-width="2" opacity=".35"/><path d="M${i * 100 + 40} 60 l-80 400" stroke="#9CA3AF" stroke-width="2" opacity=".35"/>`; b += `<rect y="60" width="800" height="10" fill="#111827"/>`; b += fig(300, 470, 1.1, "guard") + fig(560, 470, 1.05, "corner", "#1F2937"); return [800, 500, b, "Cage training with a coach cornering"]; },
    matroom: () => { let b = room(600, 400, 0.5); b += grapple(200, 330, 0.7) + grapple(430, 340, 0.7, "#F9FAFB", "#1D4ED8"); return [600, 400, b, "Main mat room with Zebra mats, mirrors and flags"]; },
    cage: () => { let b = `<rect width="600" height="400" fill="#111827"/><polygon points="120,90 300,40 480,90 540,240 480,360 120,360 60,240" fill="#1F2937" stroke="#9CA3AF" stroke-width="5"/>`; for (let i = 0; i < 12; i++) b += `<path d="M${80 + i * 40} 70v300" stroke="#9CA3AF" stroke-width="1" opacity=".3"/>`; b += `<polygon points="150,290 450,290 500,340 100,340" fill="${RED}" opacity=".7"/>`; return [600, 400, b, "Regulation-size cage with padded fence"]; },
    bags: () => { let b = room(600, 400, 0.6); [90, 210, 330, 450, 560].forEach((x, i) => { b += bag(x, 250 + (i % 2) * 10, 0.7); }); return [600, 400, b, "Heavy bag area"]; },
    strength: () => { let b = room(600, 400, 0.4); b += `<rect x="60" y="80" width="12" height="230" fill="#6B7280"/><rect x="180" y="80" width="12" height="230" fill="#6B7280"/><rect x="40" y="150" width="170" height="8" fill="#9CA3AF"/>`; b += fig(126, 370, 0.85, "lift"); b += fig(400, 370, 0.7, "rope", "#0B0F17"); b += `<path d="M430 300c40 10 70-20 120 0" stroke="${GOLD}" stroke-width="6" fill="none"/>`; [500, 540].forEach((x) => { b += `<circle cx="${x}" cy="350" r="18" fill="#111827"/><path d="M${x - 10} 334a10 10 0 0 1 20 0" stroke="#111827" stroke-width="5" fill="none"/>`; }); return [600, 400, b, "Strength corner with rack, kettlebells and battle ropes"]; },
    recovery: () => { let b = room(600, 400, 0.5); b += fig(300, 370, 0.7, "stretch", "#0B0F17", null); for (let i = 0; i < 6; i++) b += `<rect x="${40 + i * 90}" y="90" width="76" height="70" rx="4" fill="#111827" stroke="#4B5563"/>`; b += `<rect x="460" y="320" width="100" height="22" rx="11" fill="${GOLD}"/>`; return [600, 400, b, "Recovery lounge with foam rollers and member cubbies"]; },
    shop: () => { let b = `<rect width="600" height="400" fill="#F9FAFB"/><rect y="320" width="600" height="80" fill="#E5E7EB"/>`; [[70, "#F9FAFB"], [170, "#1D4ED8"], [270, "#111827"], [370, RED], [470, "#F9FAFB"]].forEach(([x, c]) => { b += `<path d="M${x} 90h70l20 30-14 10v120h-82V130l-14-10z" fill="${c}" stroke="#9CA3AF" stroke-width="2"/>`; }); b += `<text x="300" y="60" font-size="30" font-weight="700" fill="${RED}" text-anchor="middle" font-family="Oswald, Inter, sans-serif">IRON PATH PRO SHOP</text>`; [[150, RED], [210, "#111827"], [390, GOLD], [450, RED]].forEach(([x, c]) => { b += `<rect x="${x}" y="280" width="44" height="40" rx="16" fill="${c}"/>`; }); return [600, 400, b, "Pro shop with gis, rashguards, gloves and wraps"]; },
  };
  function scene(name) { const [w, h, b, label] = SC[name](); return svg(w, h, b, label); }
  function portrait(look, label, gi) {
    let p = bust(look, 0, 0, 1, true);
    if (gi) p = p.replace(`<path d="M-74 120c4-52 30-78 74-78s70 26 74 78z" fill="${TOPS[look.top]}"/>`, `<path d="M-74 120c4-52 30-78 74-78s70 26 74 78z" fill="#F9FAFB"/><path d="M-20 44l20 40 20-40" stroke="#D1D5DB" stroke-width="6" fill="none"/>`);
    return `<svg viewBox="-90 -115 180 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${p}</svg>`;
  }
  window.Art = { hero, scene, portrait };
})();
