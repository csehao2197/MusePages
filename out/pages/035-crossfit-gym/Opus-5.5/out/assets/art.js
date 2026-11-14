// Original SVG illustrations for Iron Tide CrossFit (no photos). Exposes window.Art.
// Portrait and athlete helpers are shared with sibling Opus-5.5 pages.
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
  const RED = "#EF4444";
  const svg = (w, h, body, label, defs = "") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${body}</svg>`;
  let uid = 0;
  // dark gym backdrop with rig, plates and a light cone
  function gym(w, h, light = 0.5, warm = false) {
    const id = `g${++uid}`;
    let b = `<defs><radialGradient id="${id}" cx="${light}" cy=".05" r=".8"><stop offset="0" stop-color="${warm ? "#FCA5A5" : "#CBD5E1"}" stop-opacity=".6"/><stop offset=".5" stop-color="#334155" stop-opacity=".18"/><stop offset="1" stop-color="#020617" stop-opacity="0"/></radialGradient></defs>`;
    b += `<rect width="${w}" height="${h}" fill="#172033"/>`;
    for (let x = 0; x < w; x += 140) b += `<rect x="${x}" y="0" width="12" height="${h * 0.72}" fill="#25324A"/>`;
    b += `<rect x="0" y="${h * 0.18}" width="${w}" height="10" fill="#1E293B"/>`;
    b += `<rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="#0B1120"/><rect y="${h * 0.72}" width="${w}" height="3" fill="#EF4444" opacity=".25"/>`;
    b += `<ellipse cx="${w * light}" cy="0" rx="${w * 0.6}" ry="${h * 0.9}" fill="url(#${id})"/>`;
    return b;
  }
  const plates = (x, y, s = 1, c = "#020617") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-150" y="-4" width="300" height="8" rx="4" fill="#64748B"/><rect x="-128" y="-34" width="16" height="68" rx="4" fill="${c}"/><rect x="112" y="-34" width="16" height="68" rx="4" fill="${c}"/><rect x="-110" y="-26" width="10" height="52" rx="3" fill="${RED}"/><rect x="100" y="-26" width="10" height="52" rx="3" fill="${RED}"/></g>`;
  const rack = (x, y, n) => [...Array(n)].map((_, i) => plates(x, y + i * 70, 0.7, "#1E293B")).join("");
  const POSE = {
    clean: { torso: -4, armL: 200, armR: 160, foreL: -130, foreR: 130, legL: -24, legR: 24, shinL: 10, shinR: -10 },
    stand: { torso: 0, armL: 14, armR: -14, legL: -6, legR: 6 },
    cheer: { torso: 0, armL: 160, armR: 200, legL: -10, legR: 10 },
    squat: { torso: 20, armL: 120, armR: 110, legL: -80, legR: 70, shinL: 110, shinR: -100 },
    hang: { torso: 0, armL: 175, armR: 185, foreL: 0, foreR: 0, legL: -4, legR: 4, shinL: 40, shinR: 40 },
    run: { torso: 12, armL: 60, armR: -50, foreL: -70, foreR: 60, legL: -40, legR: 30, shinL: 60, shinR: 10 },
    point: { torso: -4, armL: 100, armR: -10, legL: -8, legR: 8 },
  };
  const fig = (x, floor, s, pose, fill = "#020617", rim = RED) => { const p = POSE[pose] || pose, y = floor - 150 * s; return (rim ? `<g opacity=".75">${athlete(x + 4 * s, y - 2 * s, s, p, rim)}</g>` : "") + athlete(x, y, s, p, fill); };

  function hero() {
    let b = gym(1600, 900, 0.5, true);
    b += rack(120, 440, 3) + rack(1480, 440, 3);
    [[460, 760, 1.45], [800, 770, 1.6], [1140, 760, 1.45]].forEach(([x, f, s]) => { b += fig(x, f, s, "clean"); b += plates(x, f - 258 * s, s * 0.85, "#0F172A"); });
    return svg(1600, 900, b, "Illustration of three athletes catching barbell cleans in sync in a dark gym");
  }
  const SCN = {
    group: () => { let b = gym(800, 600, 0.4); [[150, "squat"], [320, "clean"], [490, "squat"], [650, "clean"]].forEach(([x, p]) => { b += fig(x, 540, 0.95, p); if (p === "clean") b += plates(x, 540 - 258 * 0.95, 0.45, "#0F172A"); }); return [800, 600, b, "Group class mid-workout"]; },
    coach: () => { let b = gym(800, 600, 0.6, true); b += `<rect x="560" y="120" width="200" height="140" rx="6" fill="#F8FAFC"/><path d="M580 160h120M580 190h90M580 220h140" stroke="${RED}" stroke-width="6" stroke-linecap="round"/>`; b += fig(250, 560, 1.1, "point") + fig(450, 560, 1.05, "squat", "#1E293B"); return [800, 600, b, "Coach teaching a new member the squat"]; },
    rings: () => { let b = gym(800, 600, 0.5); b += `<path d="M340 0v120M460 0v120" stroke="#94A3B8" stroke-width="4"/><circle cx="340" cy="138" r="18" fill="none" stroke="#F8FAFC" stroke-width="6"/><circle cx="460" cy="138" r="18" fill="none" stroke="#F8FAFC" stroke-width="6"/>`; b += `<g opacity=".75">${athlete(404, 300, 1, { torso: 0, armL: 150, armR: 210, foreL: 30, foreR: -30, legL: -4, legR: 4, shinL: 20, shinR: 20 }, RED)}</g>` + athlete(400, 302, 1, { torso: 0, armL: 150, armR: 210, foreL: 30, foreR: -30, legL: -4, legR: 4, shinL: 20, shinR: 20 }, "#020617"); return [800, 600, b, "Athlete performing a ring muscle-up"]; },
    pullup: () => { let b = gym(600, 600, 0.5, true); b += `<rect x="90" y="110" width="420" height="12" rx="6" fill="#CBD5E1"/>`; b += `<g opacity=".75">${athlete(304, 282, 1, POSE.hang, RED)}</g>` + athlete(300, 284, 1, POSE.hang, "#020617"); return [600, 600, b, "David mid pull-up, grinning"]; },
    comp: () => { let b = gym(600, 600, 0.5, true); b += `<rect x="40" y="40" width="520" height="70" rx="8" fill="${RED}"/><text x="300" y="88" font-size="34" font-weight="800" fill="#fff" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif">QUARTERFINALS · EVENT 3</text>`; b += fig(300, 560, 1.05, "clean") + plates(300, 560 - 258 * 1.05, 0.9); return [600, 600, b, "Lucia lifting at a competition"]; },
    rope: () => { let b = gym(600, 760, 0.5, true); b += `<path d="M300 0v560" stroke="#D6A65C" stroke-width="10"/>`; b += `<g opacity=".75">${athlete(304, 250, 0.85, { torso: 0, armL: 175, armR: 185, legL: -30, legR: 30, shinL: 60, shinR: -60 }, RED)}</g>` + athlete(300, 252, 0.85, { torso: 0, armL: 175, armR: 185, legL: -30, legR: 30, shinL: 60, shinR: -60 }, "#020617"); [90, 200, 400, 510].forEach((x) => { b += fig(x, 740, 0.7, "cheer", "#1E293B"); }); return [600, 760, b, "Members cheering a first rope climb"]; },
    beach: () => { let b = `<rect width="600" height="440" fill="#FDE68A"/><circle cx="460" cy="100" r="56" fill="#FB923C"/><rect y="190" width="600" height="80" fill="#0EA5E9"/><path d="M0 200q75-14 150 0t150 0 150 0 150 0" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/><rect y="260" width="600" height="180" fill="#F5D0A9"/>`; [[100, "run"], [240, "squat"], [380, "run"], [510, "cheer"]].forEach(([x, p]) => { b += fig(x, 420, 0.7, p, "#0F172A", null); }); return [600, 440, b, "Saturday morning outdoor WOD on the beach"]; },
    shakes: () => { let b = gym(600, 520, 0.5, true); [150, 300, 450].forEach((x, i) => { b += fig(x, 500, 0.85, { torso: 0, armL: 14, armR: -150, foreR: -40, legL: -6, legR: 6 }, "#1E293B"); }); return [600, 520, b, "Post-WOD hangout with protein shakes"]; },
    charity: () => { let b = gym(600, 600, 0.5); b += `<rect x="80" y="70" width="440" height="110" rx="8" fill="#F8FAFC"/><text x="300" y="120" font-size="40" font-weight="800" fill="#0F172A" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif">LIFT FOR THE TIDE</text><text x="300" y="160" font-size="26" font-weight="700" fill="${RED}" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif">$12,400 RAISED</text>`; [120, 240, 360, 480].forEach((x) => { b += fig(x, 580, 0.8, "cheer"); }); return [600, 600, b, "Community charity fundraiser"]; },
    costume: () => { let b = gym(600, 440, 0.5, true); [[150, "#7C3AED"], [300, "#F97316"], [450, "#22C55E"]].forEach(([x, c], i) => { const s = 0.72, top = 420 - 150 * s - 150 * s; b += fig(x, 420, s, i === 1 ? "cheer" : "stand", c, null); b += `<path d="M${x - 20} ${top + 4} l20 -40 20 40z" fill="${["#FDE68A", "#F8FAFC", "#FDE68A"][i]}"/>`; }); return [600, 440, b, "Holiday costume WOD"]; },
    hero_wod: () => { let b = gym(800, 520, 0.5, true); [...Array(9)].forEach((_, i) => { b += fig(80 + i * 80, 500 - (i % 2) * 16, 0.62, i % 3 ? "stand" : "cheer", i % 2 ? "#1E293B" : "#020617"); }); b += `<rect x="300" y="50" width="200" height="56" rx="6" fill="${RED}"/><text x="400" y="88" font-size="28" font-weight="800" fill="#fff" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif">MURPH DAY</text>`; return [800, 520, b, "Group photo after a hero WOD"]; },
    final: () => { let b = gym(1600, 700, 0.5); b += rack(250, 300, 4) + rack(1350, 300, 4); [500, 800, 1100].forEach((x) => { b += plates(x, 600, 0.9, "#0F172A"); }); b += `<rect x="740" y="80" width="120" height="120" rx="8" fill="#1E293B"/><text x="800" y="160" font-size="46" font-weight="800" fill="${RED}" text-anchor="middle" font-family="Barlow Condensed, Inter, sans-serif">00:00</text>`; return [1600, 700, b, "Empty gym with barbells racked under moody light"]; },
  };
  function scene(name) { const [w, h, b, label] = SCN[name](); return svg(w, h, b, label); }

  function beforeAfter() {
    const f = (x, w, c) => `<g transform="translate(${x} 0)"><circle cy="120" r="34" fill="${c}"/><rect x="${-w / 2}" y="160" width="${w}" height="170" rx="${w / 3}" fill="${c}"/><rect x="${-w / 2 + 6}" y="316" width="${w / 2 - 10}" height="170" rx="16" fill="${c}"/><rect x="4" y="316" width="${w / 2 - 10}" height="170" rx="16" fill="${c}"/></g>`;
    const b = `<rect width="600" height="600" fill="#1E293B"/><rect x="300" width="300" height="600" fill="#273449"/><g filter="url(#bab)">${f(150, 150, "#475569")}${f(450, 104, "#64748B")}</g><line x1="300" y1="0" x2="300" y2="600" stroke="#0F172A" stroke-width="5"/>`;
    return svg(600, 600, b, "Blurred before and after placeholder for Rachel", `<filter id="bab"><feGaussianBlur stdDeviation="8"/></filter>`);
  }

  function coach(look, label) {
    return `<svg viewBox="-80 -110 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust({ ...look, bg: 6 }, 0, 0, 1, true).replace('fill="#F5F5F4"', 'fill="#1E293B"')}</svg>`;
  }

  function map() {
    let b = `<rect width="900" height="600" fill="#E2E8F0"/>`;
    b += `<path d="M0 0h260c-30 120-10 260 40 360s20 180-20 240H0z" fill="#7DD3FC"/><path d="M0 0h230c-26 120-8 250 36 350s18 180-16 250" stroke="#F8FAFC" stroke-width="10" fill="none" opacity=".7"/>`;
    b += `<path d="M560 0c20 60 100 90 160 80s120 40 180 20V0z" fill="#7DD3FC"/>`;
    for (let i = 0; i < 9; i++) b += `<path d="M${280 + i * 70} 0v600" stroke="#fff" stroke-width="${i % 3 ? 6 : 12}"/>`;
    for (let j = 0; j < 8; j++) b += `<path d="M260 ${40 + j * 75}H900" stroke="#fff" stroke-width="${j === 3 ? 16 : 6}"/>`;
    b += `<text x="620" y="303" font-size="18" font-weight="700" fill="#475569" font-family="Inter, sans-serif">GARNET AVE</text><text x="300" y="560" font-size="16" font-weight="600" fill="#0369A1" font-family="Inter, sans-serif" transform="rotate(-70 300 560)">PACIFIC OCEAN</text>`;
    b += `<rect x="760" y="430" width="110" height="80" rx="6" fill="#BBF7D0"/><text x="815" y="476" font-size="13" font-weight="600" fill="#15803D" text-anchor="middle" font-family="Inter, sans-serif">Park</text>`;
    b += `<ellipse cx="560" cy="300" rx="70" ry="22" fill="${RED}" opacity=".18"/><path d="M560 300c-26-30-38-50-38-68a38 38 0 0 1 76 0c0 18-12 38-38 68z" fill="${RED}"/><circle cx="560" cy="232" r="13" fill="#fff"/>`;
    b += `<rect x="600" y="200" width="196" height="54" rx="10" fill="#0F172A"/><text x="616" y="224" font-size="16" font-weight="800" fill="#fff" font-family="Barlow Condensed, Inter, sans-serif">IRON TIDE CROSSFIT</text><text x="616" y="244" font-size="12" fill="#94A3B8" font-family="Inter, sans-serif">1847 Garnet Ave</text>`;
    return svg(900, 600, b, "Map of Pacific Beach, San Diego, with a pin on Iron Tide CrossFit at 1847 Garnet Avenue");
  }

  window.Art = { hero, scene, beforeAfter, coach, map };
})();
