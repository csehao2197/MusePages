// Original SVG illustrations for Rhythm & Flow (no photos or video files). Exposes window.Art.
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
  const ROSE = "#E11D48";
  const svg = (w, h, body, label, defs = "") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${body}</svg>`;
  const dancer = (x, floor, s, pose, fill, extra = "") => athlete(x, floor - 150 * s, s, pose, fill, extra);
  const P = {
    groove: { torso: -8, head: -10, armL: 60, armR: -120, foreL: 70, foreR: -60, legL: -20, legR: 26, shinL: 20, shinR: -6 },
    reach: { torso: 14, head: 20, armL: 210, armR: 120, foreL: 10, foreR: 20, legL: -30, legR: 60, shinL: 0, shinR: 40 },
    arabesque: { torso: 30, head: -20, armL: 220, armR: 100, legL: 0, legR: 100, shinL: 0, shinR: 0 },
    spin: { torso: 0, armL: 170, armR: 190, foreL: -60, foreR: 60, legL: 0, legR: 50, shinL: 0, shinR: 90 },
    lead: { torso: -4, armL: 120, armR: 30, foreL: 60, foreR: 40, legL: -14, legR: 22, shinL: 6, shinR: -10 },
    follow: { torso: 10, head: 10, armL: 210, armR: -60, foreL: 0, foreR: 30, legL: -24, legR: 10, shinL: 30, shinR: 0 },
    jump: { torso: -6, armL: 150, armR: 210, legL: -60, legR: 60, shinL: 80, shinR: -80 },
    stretch: { torso: 60, head: 10, armL: 180, armR: 170, legL: -80, legR: 80, shinL: 0, shinR: 0 },
    pose: { torso: 0, armL: 30, armR: -160, foreL: 80, foreR: 0, legL: -10, legR: 12 },
  };
  function studio(w, h, warm = "#FDE68A") {
    const id = `sun${w}${h}`;
    let b = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${warm}" stop-opacity=".9"/><stop offset=".6" stop-color="#FDA4AF" stop-opacity=".25"/><stop offset="1" stop-color="#FFF1F2" stop-opacity="0"/></linearGradient></defs>`;
    b += `<rect width="${w}" height="${h}" fill="#FCE7F3"/>`;
    for (let x = 0; x < w; x += w / 5) b += `<rect x="${x + 8}" y="${h * 0.08}" width="${w / 5 - 16}" height="${h * 0.62}" fill="#E0E7FF" opacity=".7"/><path d="M${x + 20} ${h * 0.12}l${w / 12} ${h * 0.4}" stroke="#fff" stroke-width="10" opacity=".5"/>`;
    b += `<rect y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="#B45309" opacity=".55"/>` + [...Array(10)].map((_, i) => `<path d="M${i * w / 10} ${h * 0.7}l${-w * 0.08} ${h * 0.3}" stroke="#92400E" stroke-width="2" opacity=".35"/>`).join("");
    b += `<path d="M${w * 0.55} 0 L${w} 0 L${w * 0.35} ${h} L0 ${h}z" fill="url(#${id})" opacity=".55"/>`;
    b += `<rect y="${h * 0.52}" width="${w}" height="6" fill="#94A3B8" opacity=".6"/>`;
    return b;
  }
  function hero() {
    let b = studio(1600, 900);
    const D = [[300, 840, 1.25, P.reach, "#1E1E2E"], [620, 830, 1.35, P.jump, ROSE], [930, 840, 1.3, P.groove, "#1E1E2E"], [1220, 840, 1.25, P.arabesque, "#7C3AED"], [1460, 840, 1.1, P.spin, "#1E1E2E"]];
    D.forEach(([x, f, s, p, c]) => { b += `<g opacity=".1">${dancer(x + 30, f - 330, s * 0.6, p, "#475569")}</g>`; });
    D.forEach(([x, f, s, p, c]) => { b += dancer(x, f, s, p, c); });
    return svg(1600, 900, b, "Illustration of dancers mid-movement in a sunlit studio with mirrored walls");
  }
  const STYLE = {
    hiphop: () => { let b = `<rect width="300" height="400" fill="#1E1E2E"/><path d="M0 60h300M0 130h300M0 200h300" stroke="#334155" stroke-width="2"/><text x="30" y="120" font-size="64" font-weight="900" fill="#FDE047" opacity=".9" font-family="Montserrat, Inter, sans-serif" transform="rotate(-8 150 120)">FLOW</text><circle cx="230" cy="60" r="30" fill="${ROSE}" opacity=".7"/>`; b += dancer(160, 380, 0.85, P.groove, "#F8FAFC"); return [b, "Hip-hop dancer in an urban pose"]; },
    contemporary: () => { let b = `<rect width="300" height="400" fill="#7C3AED"/><circle cx="150" cy="140" r="110" fill="#C4B5FD" opacity=".45"/><path d="M0 320c60-30 120-30 300 0v80H0z" fill="#5B21B6"/>`; b += dancer(150, 360, 0.85, P.reach, "#FDF4FF"); b += `<path d="M60 150c40 30 90 20 120-10" stroke="#fff" stroke-width="3" fill="none" opacity=".5"/>`; return [b, "Contemporary dancer in a lyrical reach"]; },
    ballet: () => { let b = `<rect width="300" height="400" fill="#FCE7F3"/><rect x="0" y="210" width="300" height="8" fill="#9CA3AF"/><rect x="0" y="300" width="300" height="100" fill="#F5D0FE" opacity=".6"/>`; b += dancer(140, 370, 0.85, P.arabesque, "#BE185D"); return [b, "Ballet dancer in arabesque at the barre"]; },
    salsa: () => { let b = `<rect width="300" height="400" fill="#F97316"/><circle cx="150" cy="120" r="90" fill="#FDBA74" opacity=".6"/><rect y="320" width="300" height="80" fill="#C2410C"/>`; b += dancer(110, 370, 0.75, P.lead, "#1E1E2E") + dancer(195, 370, 0.75, P.follow, ROSE); return [b, "Salsa pair dancing"]; },
    breaking: () => { let b = `<rect width="300" height="400" fill="#0EA5E9"/><rect y="300" width="300" height="100" fill="#0369A1"/><circle cx="150" cy="300" r="120" fill="#fff" opacity=".1"/>`; b += `<g transform="rotate(180 150 260)">${athlete(150, 200, 0.75, { torso: 10, armL: 0, armR: 10, foreL: 0, foreR: 0, legL: 160, legR: 210, shinL: 40, shinR: -60 }, "#F8FAFC")}</g>`; return [b, "B-girl holding a freeze"]; },
  };
  function style(name) { const [b, label] = STYLE[name](); return svg(300, 400, b, label); }
  const GAL = {
    stage: () => { let b = `<rect width="600" height="800" fill="#0B0B14"/><path d="M300 0 80 700h440z" fill="#FDE68A" opacity=".18"/><rect y="680" width="600" height="120" fill="#1E1E2E"/>`; [[200, P.reach, ROSE], [300, P.jump, "#F8FAFC"], [400, P.arabesque, "#A78BFA"]].forEach(([x, p, c]) => { b += dancer(x, 690, 0.8, p, c); }); return [600, 800, b, "Student showcase on stage under dramatic lighting"]; },
    sync: () => { let b = studio(600, 420); [100, 230, 360, 490].forEach((x, i) => { b += dancer(x, 400, 0.62, P.pose, i % 2 ? ROSE : "#1E1E2E"); }); return [600, 420, b, "Group class in sync mid-choreography"]; },
    freeze: () => { let b = `<rect width="600" height="600" fill="#1E293B"/><rect y="420" width="600" height="180" fill="#0F172A"/><circle cx="300" cy="420" r="200" fill="#0EA5E9" opacity=".12"/>`; b += `<g transform="rotate(180 300 330)">${athlete(300, 260, 0.95, { torso: 20, armL: 0, armR: 20, legL: 150, legR: 220, shinL: 60, shinR: -40 }, "#FDE047")}</g>`; return [600, 600, b, "Close-up of a breaking freeze on the studio floor"]; },
    partner: () => { let b = studio(600, 500, "#FDBA74"); b += dancer(240, 470, 0.8, P.lead, "#1E1E2E") + dancer(350, 470, 0.8, P.follow, ROSE); return [600, 500, b, "Instructor demonstrating salsa partner work"]; },
    warmup: () => { let b = studio(600, 420); [120, 300, 480].forEach((x, i) => { b += dancer(x, 405, 0.55, i === 1 ? P.stretch : P.pose, ["#7C3AED", "#1E1E2E", ROSE][i]); }); return [600, 420, b, "Students stretching and laughing before class"]; },
    recital: () => { let b = `<rect width="600" height="700" fill="#1E1E2E"/><rect x="40" y="40" width="520" height="340" fill="#7C3AED" opacity=".35"/><path d="M40 40h520v40c-80 20-180 30-260 30S120 100 40 80z" fill="${ROSE}"/>`; [180, 300, 420].forEach((x, i) => { b += dancer(x, 380, 0.6, [P.reach, P.spin, P.jump][i], "#F8FAFC"); }); for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) b += `<circle cx="${40 + i * 65 + (r % 2) * 30}" cy="${470 + r * 80}" r="26" fill="#334155"/><rect x="${10 + i * 65 + (r % 2) * 30}" y="${492 + r * 80}" width="60" height="60" rx="26" fill="#334155"/>`; return [600, 700, b, "End-of-year recital with audience and performers"]; },
    rehearsal: () => { let b = studio(600, 460, "#A5F3FC"); b += `<rect x="40" y="60" width="160" height="110" fill="#fff"/><path d="M60 90h100M60 115h70M60 140h110" stroke="${ROSE}" stroke-width="5"/>`; [280, 400, 520].forEach((x, i) => { b += dancer(x, 440, 0.6, [P.groove, P.lead, P.pose][i], i === 1 ? ROSE : "#1E1E2E"); }); return [600, 460, b, "Behind-the-scenes rehearsal for a community event"]; },
    progress: () => { let b = `<rect width="600" height="420" fill="#F8FAFC"/><rect x="300" width="300" height="420" fill="#FFE4E6"/>`; b += dancer(150, 380, 0.7, { torso: 0, armL: 20, armR: -20, legL: -4, legR: 4 }, "#94A3B8") + dancer(450, 380, 0.7, P.jump, ROSE); b += `<rect x="20" y="20" width="96" height="34" rx="17" fill="#1E1E2E"/><text x="68" y="43" font-size="16" font-weight="700" fill="#fff" text-anchor="middle" font-family="Inter, sans-serif">Week 1</text><rect x="320" y="20" width="110" height="34" rx="17" fill="${ROSE}"/><text x="375" y="43" font-size="16" font-weight="700" fill="#fff" text-anchor="middle" font-family="Inter, sans-serif">Week 12</text>`; return [600, 420, b, "Student progress: week 1 versus week 12"]; },
  };
  function gallery(name) { const [w, h, b, label] = GAL[name](); return svg(w, h, b, label); }

  // animated "reel" for the Watch Us Dance modal
  function reel() {
    let b = studio(1280, 720);
    const moves = [[P.groove, P.jump, P.pose], [P.reach, P.spin, P.arabesque], [P.lead, P.groove, P.jump], [P.pose, P.reach, P.spin]];
    [[260, "#1E1E2E"], [520, ROSE], [780, "#7C3AED"], [1040, "#1E1E2E"]].forEach(([x, c], i) => {
      const frames = moves[i].map((p, k) => `<g class="fr f${k}">${dancer(x, 680, 1.15, p, c)}</g>`).join("");
      b += `<g class="dancer d${i}">${frames}</g>`;
    });
    const css = `<style>.fr{opacity:0;animation:frame 1.8s steps(1) infinite}.f1{animation-delay:.6s}.f2{animation-delay:1.2s}.d1 .fr{animation-duration:1.8s}.dancer{animation:bob .6s ease-in-out infinite alternate}.d1{animation-delay:.15s}.d2{animation-delay:.3s}.d3{animation-delay:.45s}@keyframes frame{0%{opacity:1}33.33%{opacity:0}100%{opacity:0}}@keyframes bob{to{transform:translateY(-14px)}}.paused *{animation-play-state:paused!important}</style>`;
    return svg(1280, 720, css + b, "Animated illustration of four dancers moving through a routine");
  }

  function portrait(look, label) {
    return `<svg viewBox="-80 -110 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust(look, 0, 0, 1, true)}</svg>`;
  }
  function student() {
    let b = studio(800, 900, "#FDE68A");
    b += `<g transform="translate(400 600) scale(2.6)">${bust({ skin: 3, hair: 0, hairStyle: "curly", top: 0, bg: 0 }, 0, 0, 1, false).replace('M-12 14c7 7 17 7 24 0', 'M-16 10c8 12 24 12 32 0')}</g>`;
    b += `<rect x="40" y="40" width="190" height="56" rx="28" fill="#fff"/><text x="135" y="75" font-size="22" font-weight="700" fill="${ROSE}" text-anchor="middle" font-family="Montserrat, Inter, sans-serif">First class!</text>`;
    return svg(800, 900, b, "Illustration of a smiling student after her first class");
  }

  window.Art = { hero, style, gallery, reel, portrait, student };
})();
