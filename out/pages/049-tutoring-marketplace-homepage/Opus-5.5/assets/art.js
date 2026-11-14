// Original illustrated people and product scenes (no photos). Exposes window.Art.
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
    chen: { skin: 1, hair: 0, hairStyle: "bob", top: 1, bg: 1, glasses: true },
    carlos: { skin: 3, hair: 0, hairStyle: "short", top: 3, bg: 2, beard: true },
    emily: { skin: 0, hair: 1, hairStyle: "long", top: 2, bg: 3 },
    raj: { skin: 4, hair: 0, hairStyle: "side", top: 7, bg: 4, glasses: true },
    jason: { skin: 5, hair: 0, hairStyle: "buzz", top: 0, bg: 0 },
    maria: { skin: 2, hair: 2, hairStyle: "curly", top: 6, bg: 5 },
    patricia: { skin: 7, hair: 4, hairStyle: "bun", top: 9, bg: 6 },
    kid: { skin: 6, hair: 0, hairStyle: "curly", top: 5, bg: 7 },
    teen: { skin: 1, hair: 3, hairStyle: "long", top: 3, bg: 3 },
    adult: { skin: 3, hair: 0, hairStyle: "short", top: 4, bg: 2 },
    tutorF: { skin: 2, hair: 6, hairStyle: "wrap", top: 1, bg: 1 }
  };
  const PEOPLE = P;
  const BG = (p) => BGS[p.bg];

  // a video-call tile: person framed in a rect of w×h at (x,y)
  function tile(p, x, y, w, h, opts = {}) {
    const id = "t" + Math.random().toString(36).slice(2, 8);
    const s = (h / 200) * (opts.zoom || 1.05);
    return `<g><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${opts.r ?? 8}"/></clipPath><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${BG(p)}"/>${opts.shelf ? `<rect x="${x + w * 0.62}" y="${y + h * 0.18}" width="${w * 0.3}" height="${h * 0.05}" fill="#fff" opacity=".7"/><rect x="${x + w * 0.66}" y="${y + h * 0.08}" width="${w * 0.04}" height="${h * 0.1}" fill="${TOPS[1]}" opacity=".6"/><rect x="${x + w * 0.72}" y="${y + h * 0.1}" width="${w * 0.04}" height="${h * 0.08}" fill="${TOPS[0]}" opacity=".6"/>` : ""}${bust(p, x + w / 2, y + h * 0.62, s)}</g>${opts.name ? `<rect x="${x + 6}" y="${y + h - 22}" width="${opts.name.length * 6.4 + 12}" height="16" rx="4" fill="rgba(17,24,39,.65)"/><text x="${x + 12}" y="${y + h - 10}" font-family="Inter,sans-serif" font-size="10" fill="#fff">${opts.name}</text>` : ""}</g>`;
  }
  function laptop(inner, w = 300) {
    const h = w * 0.62;
    return `<svg viewBox="0 0 ${w + 40} ${h + 34}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="20" y="4" width="${w}" height="${h}" rx="10" fill="#1F2937"/><g transform="translate(28 12)">${inner(w - 16, h - 16)}</g><path d="M0 ${h + 6}h${w + 40}l-10 ${18}H10z" fill="#CBD5E1"/><rect x="${(w + 40) / 2 - 30}" y="${h + 6}" width="60" height="5" rx="2" fill="#94A3B8"/></svg>`;
  }

  // hero: three laptops with different tutoring sessions
  function heroCollage() {
    const a = laptop((w, h) => `${tile(P.chen, 0, 0, w, h, { name: "Dr. Sarah Chen", shelf: true })}${tile(P.teen, w - 86, h - 64, 80, 56, { r: 6, zoom: 1.3 })}<g transform="translate(10 10)"><rect width="96" height="58" rx="6" fill="#fff" opacity=".92"/><text x="10" y="24" font-family="Georgia,serif" font-size="16" fill="#7C3AED">∫ x² dx</text><text x="10" y="46" font-family="Georgia,serif" font-size="14" fill="#111827">= x³/3 + C</text></g>`);
    const b = laptop((w, h) => `${tile(P.carlos, 0, 0, w, h, { name: "Carlos · Spanish" })}${tile(P.kid, w - 76, 8, 68, 50, { r: 6, zoom: 1.3 })}<g transform="translate(10 12)"><rect width="104" height="30" rx="15" fill="#fff"/><text x="14" y="20" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#5B21B6">¡Muy bien!</text></g>`, 260);
    const c = laptop((w, h) => `<rect width="${w}" height="${h}" fill="#0F172A"/><g font-family="ui-monospace,monospace" font-size="10"><text x="12" y="22" fill="#C4B5FD">def</text><text x="36" y="22" fill="#FDE68A">fizzbuzz</text><text x="90" y="22" fill="#E5E7EB">(n):</text><text x="24" y="40" fill="#C4B5FD">for</text><text x="48" y="40" fill="#E5E7EB">i in range(1, n+1):</text><text x="36" y="58" fill="#E5E7EB">print(i % 3 …)</text><rect x="12" y="70" width="60" height="3" fill="#7C3AED"/></g>${tile(P.raj, w - 92, h - 70, 86, 64, { r: 6, zoom: 1.3, name: "Raj" })}${tile(P.adult, w - 92, 8, 86, 54, { r: 6, zoom: 1.3 })}`, 260);
    return { a, b, c };
  }

  // classroom mockup with whiteboard
  function classroom() {
    return `<svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BrightMinds video classroom with a shared whiteboard, two video tiles and chat">
      <rect width="560" height="360" rx="14" fill="#fff"/><rect width="560" height="36" rx="14" fill="#F5F3FF"/><rect y="22" width="560" height="14" fill="#F5F3FF"/>
      <circle cx="20" cy="18" r="5" fill="#F87171"/><circle cx="36" cy="18" r="5" fill="#FBBF24"/><circle cx="52" cy="18" r="5" fill="#34D399"/>
      <text x="76" y="22" font-family="Inter,sans-serif" font-size="11" fill="#5B21B6" font-weight="600">Calculus II · Lesson 7 · 32:14</text>
      <circle cx="520" cy="18" r="5" fill="#EF4444"/><text x="470" y="22" font-family="Inter,sans-serif" font-size="10" fill="#EF4444">REC</text>
      <rect x="14" y="48" width="372" height="252" rx="10" fill="#FAFAFF" stroke="#E9D5FF"/>
      <g fill="none" stroke-linecap="round" stroke-width="3"><path d="M40 260 C 110 250, 150 120, 200 110 S 300 220, 360 90" stroke="#7C3AED"/><path d="M40 270h320M50 280V80" stroke="#94A3B8" stroke-width="2"/><path d="M200 110 l 0 150" stroke="#F59E0B" stroke-dasharray="6 6" stroke-width="2"/></g>
      <text x="60" y="96" font-family="Georgia,serif" font-size="20" fill="#111827">f(x) = x³ − 3x</text><text x="60" y="124" font-family="Georgia,serif" font-size="16" fill="#5B21B6">f′(x) = 3x² − 3 = 0</text>
      <g transform="translate(24 310)"><rect width="230" height="36" rx="18" fill="#F5F3FF"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${22 + i * 46}" cy="18" r="11" fill="${["#7C3AED", "#F59E0B", "#16A34A", "#111827", "#EF4444"][i]}" opacity="${i ? 0.85 : 1}"/>`).join("")}</g>
      <g transform="translate(270 310)"><rect width="116" height="36" rx="18" fill="#EF4444"/><text x="58" y="23" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#fff">Leave</text></g>
      ${tile(P.chen, 398, 48, 148, 104, { name: "Dr. Chen", zoom: 1.2 })}${tile(P.maria, 398, 160, 148, 104, { name: "Maria (you)", zoom: 1.2 })}
      <rect x="398" y="272" width="148" height="74" rx="8" fill="#F8FAFC"/><text x="408" y="290" font-family="Inter,sans-serif" font-size="10" fill="#6B7280">Chat</text><rect x="408" y="298" width="110" height="18" rx="9" fill="#EDE9FE"/><text x="416" y="311" font-family="Inter,sans-serif" font-size="9" fill="#5B21B6">So x = ±1 are critical?</text><rect x="420" y="322" width="96" height="18" rx="9" fill="#7C3AED"/><text x="428" y="335" font-family="Inter,sans-serif" font-size="9" fill="#fff">Exactly! Now test f″</text>
    </svg>`;
  }

  // smart matching: student → AI → 3 tutor matches
  function matching() {
    const t = [[P.chen, 96, "#16A34A"], [P.emily, 91, "#7C3AED"], [P.raj, 84, "#F59E0B"]];
    return `<svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Smart matching: your goals, style and schedule feed a matching engine that ranks tutors by compatibility">
      <rect width="560" height="360" rx="14" fill="#F5F3FF"/>
      <g transform="translate(30 70)"><rect width="150" height="220" rx="14" fill="#fff"/>${tile(P.jason, 45, 18, 60, 60, { r: 30, zoom: 1.5 })}<text x="75" y="102" text-anchor="middle" font-family="Inter,sans-serif" font-size="12" font-weight="600" fill="#111827">Your profile</text>
      ${["Goal: SAT 1500+", "Style: visual", "Evenings · Tue/Thu"].map((s, i) => `<rect x="14" y="${118 + i * 30}" width="122" height="22" rx="11" fill="#EDE9FE"/><text x="75" y="${133 + i * 30}" text-anchor="middle" font-family="Inter,sans-serif" font-size="10" fill="#5B21B6">${s}</text>`).join("")}</g>
      <g transform="translate(240 150)"><circle cx="30" cy="30" r="40" fill="#7C3AED" opacity=".12"/><circle cx="30" cy="30" r="28" fill="#7C3AED"/><path d="M30 14l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff"/></g>
      <g stroke="#A78BFA" stroke-width="2" stroke-dasharray="5 6" fill="none"><path d="M180 180h60"/><path d="M310 180c30 0 30-90 60-90M310 180h60M310 180c30 0 30 90 60 90"/></g>
      ${t.map(([p, pct, c], i) => `<g transform="translate(370 ${54 + i * 90})"><rect width="164" height="72" rx="12" fill="#fff"/>${tile(p, 10, 10, 52, 52, { r: 26, zoom: 1.45 })}<text x="72" y="30" font-family="Inter,sans-serif" font-size="11" font-weight="600" fill="#111827">${["Dr. Sarah Chen", "Emily Park", "Raj Patel"][i]}</text><rect x="72" y="40" width="80" height="8" rx="4" fill="#EDE9FE"/><rect x="72" y="40" width="${(80 * pct) / 100}" height="8" rx="4" fill="${c}"/><text x="72" y="62" font-family="Inter,sans-serif" font-size="10" fill="${c}" font-weight="700">${pct}% match</text></g>`).join("")}
    </svg>`;
  }

  // progress dashboard with charts
  function progress() {
    const pts = [42, 48, 47, 55, 61, 64, 70, 78];
    const path = pts.map((v, i) => `${i ? "L" : "M"}${40 + i * 40} ${230 - v * 2}`).join(" ");
    return `<svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Progress dashboard: practice score rising from 42 to 78 over 8 weeks, goal milestones and lesson summary">
      <rect width="560" height="360" rx="14" fill="#fff"/><text x="24" y="38" font-family="Plus Jakarta Sans,Inter,sans-serif" font-size="16" font-weight="700" fill="#111827">Progress · SAT Math</text><text x="24" y="58" font-family="Inter,sans-serif" font-size="11" fill="#6B7280">8 weeks · 16 lessons</text>
      <g transform="translate(0 20)"><g stroke="#F1F5F9">${[0, 1, 2, 3].map((i) => `<path d="M40 ${80 + i * 50}h300"/>`).join("")}</g><path d="${path} L320 230 L40 230Z" fill="#7C3AED" opacity=".1"/><path d="${path}" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((v, i) => `<circle cx="${40 + i * 40}" cy="${230 - v * 2}" r="4" fill="#fff" stroke="#7C3AED" stroke-width="2"/>`).join("")}<path d="M40 74h300" stroke="#16A34A" stroke-dasharray="5 5"/><text x="300" y="68" font-family="Inter,sans-serif" font-size="10" fill="#16A34A">Goal</text></g>
      <g transform="translate(370 74)"><rect width="168" height="96" rx="12" fill="#F5F3FF"/><text x="14" y="26" font-family="Inter,sans-serif" font-size="11" fill="#6B7280">Practice score</text><text x="14" y="62" font-family="Plus Jakarta Sans,Inter,sans-serif" font-size="30" font-weight="800" fill="#5B21B6">+36</text><text x="14" y="82" font-family="Inter,sans-serif" font-size="10" fill="#16A34A">▲ 86% since week 1</text></g>
      <g transform="translate(370 184)" font-family="Inter,sans-serif" font-size="11"><rect width="168" height="150" rx="12" fill="#F8FAFC"/><text x="14" y="24" fill="#6B7280">Milestones</text>${["Linear equations", "Functions", "Geometry", "Data analysis"].map((m, i) => `<circle cx="22" cy="${46 + i * 26}" r="7" fill="${i < 3 ? "#16A34A" : "#E5E7EB"}"/>${i < 3 ? `<path d="M18.5 ${46 + i * 26}l2.5 2.5 4.5-4.5" stroke="#fff" stroke-width="2" fill="none"/>` : ""}<text x="36" y="${50 + i * 26}" fill="#111827">${m}</text>`).join("")}</g>
      <g transform="translate(24 280)" font-family="Inter,sans-serif"><rect width="330" height="56" rx="12" fill="#FFFBEB"/><text x="14" y="24" font-size="11" font-weight="600" fill="#92400E">Lesson 16 summary</text><text x="14" y="42" font-size="10" fill="#78350F">Mastered systems of equations · next: circle theorems</text></g>
    </svg>`;
  }

  // tutor teaching on laptop (for tutors section)
  function teaching() {
    return `<svg viewBox="0 0 520 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A tutor teaching from home on a laptop">
      <rect width="520" height="400" rx="20" fill="#EDE9FE"/><rect x="0" y="300" width="520" height="100" fill="#DDD6FE"/>
      <rect x="40" y="40" width="120" height="150" rx="8" fill="#fff" opacity=".7"/><rect x="56" y="58" width="88" height="10" rx="5" fill="#C4B5FD"/><rect x="56" y="78" width="60" height="8" rx="4" fill="#DDD6FE"/>
      <path d="M420 120c-30 0-40 40-20 60h40c20-20 10-60-20-60z" fill="#16A34A" opacity=".6"/><rect x="408" y="176" width="24" height="36" rx="4" fill="#A16207"/>
      ${bust(P.tutorF, 220, 220, 1.15)}
      <rect x="120" y="290" width="300" height="14" rx="4" fill="#C4B5FD"/>
      <g transform="translate(250 196)"><rect width="190" height="118" rx="8" fill="#1F2937"/><rect x="8" y="8" width="174" height="102" rx="4" fill="#F5F3FF"/>${tile(P.kid, 8, 8, 174, 102, { r: 4, zoom: 1.2 })}<path d="M-14 118h218l-12 12H-2z" fill="#9CA3AF"/></g>
      <g transform="translate(330 60)"><rect width="150" height="58" rx="12" fill="#fff"/><text x="14" y="24" font-family="Inter,sans-serif" font-size="11" fill="#6B7280">This month</text><text x="14" y="46" font-family="Plus Jakarta Sans,Inter,sans-serif" font-size="20" font-weight="800" fill="#16A34A">$2,640</text></g>
    </svg>`;
  }

  function portraitOf(key, label) { return portrait(typeof key === "string" ? P[key] : key, label, "square"); }
  function avatarOf(key, label) { return portrait(typeof key === "string" ? P[key] : key, label, "circle"); }

  window.Art = { heroCollage, classroom, matching, progress, teaching, portraitOf, avatarOf, PEOPLE };
})();
