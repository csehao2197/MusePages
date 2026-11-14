// Original editorial illustrations and portraits (no photos). Exposes window.Art.
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


  // ---------- Flowline editorial thumbnails ----------
  const PAL = {
    Productivity: ["#2563EB", "#BFDBFE", "#EFF6FF"],
    Engineering: ["#7C3AED", "#DDD6FE", "#F5F3FF"],
    "Remote Work": ["#059669", "#A7F3D0", "#ECFDF5"],
    Leadership: ["#D97706", "#FDE68A", "#FFFBEB"],
    "Product Updates": ["#DC2626", "#FECACA", "#FEF2F2"],
    "Customer Stories": ["#0891B2", "#A5F3FC", "#ECFEFF"]
  };
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const F = "Outfit, Inter, sans-serif";
  const card = (x, y, w, h, r = 16, fill = "#fff") => `<rect x="${x + 4}" y="${y + 8}" width="${w}" height="${h}" rx="${r}" fill="rgba(15,23,42,.08)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const chip = (x, y, w, txt, fill, size = 26) => `<rect x="${x}" y="${y}" width="${w}" height="${size * 2}" rx="${size}" fill="${fill}"/><text x="${x + w / 2}" y="${y + size * 1.36}" font-family="${F}" font-size="${size}" font-weight="700" fill="#fff" text-anchor="middle">${txt}</text>`;
  const check = (x, y, s, col = "#fff") => `<path d="M${x - 8 * s} ${y}l${6 * s} ${6 * s} ${11 * s}-${12 * s}" stroke="${col}" stroke-width="${4 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const spark = (x, y, s, col) => `<path d="M${x} ${y - 14 * s}C${x + 2 * s} ${y - 4 * s} ${x + 4 * s} ${y - 2 * s} ${x + 14 * s} ${y}C${x + 4 * s} ${y + 2 * s} ${x + 2 * s} ${y + 4 * s} ${x} ${y + 14 * s}C${x - 2 * s} ${y + 4 * s} ${x - 4 * s} ${y + 2 * s} ${x - 14 * s} ${y}C${x - 4 * s} ${y - 2 * s} ${x - 2 * s} ${y - 4 * s} ${x} ${y - 14 * s}z" fill="${col}"/>`;
  const lines = (x, y, n, w, r, col, gap = 16) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * gap}" width="${Math.round(w * (0.45 + r() * 0.55))}" height="8" rx="4" fill="${col}"/>`).join("");
  const tile = (p, x, y, w, h, ring) => `<rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${h + 6}" rx="14" fill="${ring}"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="-90 -100 180 180" preserveAspectRatio="xMidYMid slice"><clipPath id="t${x}${y}"><rect x="-90" y="-100" width="180" height="180" rx="22"/></clipPath><g clip-path="url(#t${x}${y})">${bust(p, 0, 0, 1, true)}</g></svg>`;
  const person = (r) => ({ skin: Math.floor(r() * 8), hair: Math.floor(r() * 8), hairStyle: ["short", "bob", "long", "bun", "curly", "buzz", "side", "wrap"][Math.floor(r() * 8)], top: Math.floor(r() * 10), bg: Math.floor(r() * 8), glasses: r() < 0.3, beard: r() < 0.2 });

  const SC = {
    week(c, r, o = {}) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><circle cx="580" cy="40" r="130" fill="${c[1]}" opacity=".6"/><circle cx="40" cy="340" r="90" fill="${c[1]}" opacity=".4"/>`;
      s += card(110, 46, 420, 268, 20);
      s += `<rect x="110" y="46" width="420" height="52" rx="20" fill="${c[0]}"/><rect x="110" y="76" width="420" height="22" fill="${c[0]}"/>`;
      s += ["M", "T", "W", "T", "F"].map((d, i) => `<text x="${172 + i * 74}" y="80" font-family="${F}" font-size="18" font-weight="600" fill="#fff" text-anchor="middle">${d}</text>`).join("");
      for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) {
        const on = o.four ? col < 4 : r() < 0.55;
        const x = 140 + col * 74, y = 116 + row * 48;
        s += `<rect x="${x}" y="${y}" width="64" height="38" rx="9" fill="${on ? c[0] : "#F1F5F9"}" opacity="${on ? 0.25 + ((row + col) % 3) * 0.3 : 1}"/>`;
        if (o.four && col === 4) s += `<circle cx="${x + 32}" cy="${y + 19}" r="9" fill="#FBBF24"/>`;
      }
      s += o.four ? chip(430, 268, 170, "+23%", "#111827") : `<circle cx="560" cy="290" r="38" fill="#111827"/>${check(560, 292, 1.5)}`;
      s += `<g transform="translate(64 214)"><rect x="0" y="20" width="56" height="66" rx="12" fill="#fff" stroke="${c[0]}" stroke-width="5"/><path d="M56 36c22 0 22 30 0 30" stroke="${c[0]}" stroke-width="5" fill="none"/><path d="M16 8c-6 6 6 8 0 14M34 4c-6 6 6 8 0 14" stroke="${c[0]}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/></g>`;
      return s;
    },
    pipeline(c, r) {
      let s = `<rect width="640" height="360" fill="#111827"/>`;
      for (let x = 20; x < 640; x += 32) for (let y = 20; y < 360; y += 32) s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#334155"/>`;
      s += `<rect x="150" y="34" width="340" height="120" rx="14" fill="#1F2937" stroke="#374151"/><circle cx="172" cy="54" r="5" fill="#F87171"/><circle cx="188" cy="54" r="5" fill="#FBBF24"/><circle cx="204" cy="54" r="5" fill="#34D399"/>`;
      const cols = [c[1], "#7DD3FC", "#86EFAC", "#F9A8D4"];
      for (let i = 0; i < 4; i++) { const ind = (i % 2) * 24; s += `<rect x="${172 + ind}" y="${76 + i * 18}" width="${50 + r() * 60}" height="8" rx="4" fill="${cols[i]}"/><rect x="${240 + ind + r() * 40}" y="${76 + i * 18}" width="${60 + r() * 90}" height="8" rx="4" fill="#475569"/>`; }
      const n = 4, xs = Array.from({ length: n }, (_, i) => 110 + i * 140), fail = r() < 0.25 ? 3 : -1;
      s += `<path d="M${xs[0]} 250H${xs[n - 1]}" stroke="${c[0]}" stroke-width="6" stroke-dasharray="2 14" stroke-linecap="round"/>`;
      xs.forEach((x, i) => { const done = i < 3 || fail < 0; s += `<circle cx="${x}" cy="250" r="34" fill="${done ? c[0] : "#374151"}"/><circle cx="${x}" cy="250" r="44" fill="none" stroke="${c[0]}" stroke-opacity=".3" stroke-width="4"/>${done ? check(x, 252, 1.6) : `<circle cx="${x}" cy="250" r="8" fill="#FBBF24"/>`}<rect x="${x - 34}" y="304" width="68" height="10" rx="5" fill="#475569"/>`; });
      return s;
    },
    async(c, r) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><rect x="0" y="250" width="640" height="110" fill="${c[1]}" opacity=".45"/>`;
      [["SF", 120, 9], ["NYC", 320, 12], ["BER", 520, 18]].forEach(([n, x, h], i) => {
        s += `<circle cx="${x}" cy="130" r="62" fill="#fff" stroke="${c[0]}" stroke-width="6"/><circle cx="${x}" cy="130" r="5" fill="#111827"/>`;
        const a = (h % 12) / 12 * Math.PI * 2 - Math.PI / 2, m = (r() * 2 * Math.PI) - Math.PI / 2;
        s += `<path d="M${x} 130l${Math.cos(a) * 30} ${Math.sin(a) * 30}" stroke="#111827" stroke-width="6" stroke-linecap="round"/><path d="M${x} 130l${Math.cos(m) * 44} ${Math.sin(m) * 44}" stroke="${c[0]}" stroke-width="4" stroke-linecap="round"/>`;
        s += `<text x="${x}" y="226" font-family="${F}" font-size="18" font-weight="700" fill="#111827" text-anchor="middle">${n}</text>`;
        s += card(x - 70, 262 + (i % 2) * 18, 140, 44, 14) + `<rect x="${x - 56}" y="${278 + (i % 2) * 18}" width="${50 + r() * 50}" height="8" rx="4" fill="${c[1]}"/><circle cx="${x + 50}" cy="${284 + (i % 2) * 18}" r="9" fill="${c[0]}"/>`;
      });
      return s;
    },
    remote(c, r) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><circle cx="320" cy="190" r="128" fill="${c[1]}" opacity=".55"/><g fill="none" stroke="${c[0]}" stroke-opacity=".35" stroke-width="3"><circle cx="320" cy="190" r="128"/><ellipse cx="320" cy="190" rx="56" ry="128"/><path d="M192 190h256M206 130h228M206 250h228"/></g>`;
      s += `<path d="M150 120C220 40 420 40 490 120M170 280C260 340 380 340 470 280" fill="none" stroke="${c[0]}" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round"/>`;
      s += tile(person(r), 70, 70, 130, 120, "#fff") + tile(person(r), 440, 60, 130, 120, "#fff") + tile(person(r), 255, 216, 130, 120, "#fff");
      s += `<circle cx="205" cy="190" r="20" fill="${c[0]}"/>${check(205, 192, 0.9)}`;
      return s;
    },
    standup(c, r) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><rect x="60" y="30" width="520" height="190" rx="16" fill="#fff" stroke="${c[1]}" stroke-width="4"/>`;
      const notes = ["#FDE68A", "#BFDBFE", "#FBCFE8", "#BBF7D0", "#FED7AA"];
      for (let i = 0; i < 7; i++) s += `<rect x="${84 + i * 70}" y="${50 + (i % 2) * 54}" width="56" height="48" rx="4" fill="${notes[(i + Math.floor(r() * 5)) % 5]}" transform="rotate(${(r() - 0.5) * 8} ${112 + i * 70} ${74 + (i % 2) * 54})"/>`;
      s += [180, 320, 460].map((x, i) => bust(person(r), x, 262 + (i === 1 ? -8 : 0), 0.95)).join("");
      s += `<g transform="translate(470 38)"><circle r="0" cx="0"/></g>${chip(470, 160, 120, "15 min", c[0], 20)}`;
      return s;
    },
    shipped(c, r, o = {}) {
      let s = `<rect width="640" height="360" fill="${c[1]}"/><circle cx="600" cy="320" r="150" fill="#fff" opacity=".35"/>`;
      s += card(80, 44, 480, 280, 16);
      s += `<rect x="80" y="44" width="110" height="280" rx="16" fill="#F3F4F6"/><rect x="174" y="44" width="16" height="280" fill="#F3F4F6"/><circle cx="104" cy="70" r="12" fill="#2563EB"/>`;
      for (let i = 0; i < 5; i++) s += `<rect x="98" y="${102 + i * 30}" width="${56 + (i * 13) % 24}" height="10" rx="5" fill="${i === 1 ? c[0] : "#D1D5DB"}"/>`;
      for (let col = 0; col < 3; col++) { s += `<rect x="${210 + col * 116}" y="66" width="60" height="10" rx="5" fill="#9CA3AF"/>`; const n = 2 + Math.floor(r() * 3); for (let k = 0; k < n; k++) s += `<rect x="${210 + col * 116}" y="${88 + k * 56}" width="104" height="46" rx="8" fill="#fff" stroke="#E5E7EB" stroke-width="2"/><rect x="${220 + col * 116}" y="${100 + k * 56}" width="${40 + r() * 44}" height="7" rx="3.5" fill="#CBD5E1"/><rect x="${220 + col * 116}" y="${114 + k * 56}" width="26" height="7" rx="3.5" fill="${[c[0], "#2563EB", "#059669", "#7C3AED"][Math.floor(r() * 4)]}" opacity=".7"/>`; }
      s += chip(470, 18, 130, o.ai ? "AI" : "NEW", c[0], 22) + spark(56, 70, 1.4, c[0]) + spark(596, 140, 1, "#fff") + spark(60, 290, 0.9, "#fff");
      return s;
    },
    ai(c, r) {
      let s = `<defs><radialGradient id="aiG" cx=".4" cy=".35"><stop offset="0" stop-color="#FCA5A5"/><stop offset=".55" stop-color="${c[0]}"/><stop offset="1" stop-color="#7C3AED"/></radialGradient></defs><rect width="640" height="360" fill="#0F172A"/>`;
      for (let i = 0; i < 40; i++) s += `<circle cx="${r() * 640}" cy="${r() * 360}" r="${r() * 1.8 + 0.4}" fill="#fff" opacity="${0.2 + r() * 0.5}"/>`;
      s += `<circle cx="320" cy="170" r="96" fill="url(#aiG)"/><circle cx="320" cy="170" r="122" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="2"/><circle cx="320" cy="170" r="150" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="2"/>`;
      s += spark(320, 170, 2.6, "#fff");
      s += card(40, 60, 170, 56, 14, "#1E293B") + `<rect x="58" y="78" width="100" height="8" rx="4" fill="#94A3B8"/><rect x="58" y="94" width="70" height="8" rx="4" fill="#475569"/>`;
      s += card(440, 220, 170, 70, 14, "#fff") + `<rect x="458" y="238" width="120" height="8" rx="4" fill="${c[0]}" opacity=".7"/><rect x="458" y="254" width="90" height="8" rx="4" fill="#CBD5E1"/><rect x="458" y="270" width="110" height="8" rx="4" fill="#CBD5E1"/>`;
      return s;
    },
    story(c, r, o = {}) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/>`;
      s += card(250, 46, 340, 270, 18);
      const h = o.down ? [180, 160, 132, 110, 84, 64] : Array.from({ length: 6 }, (_, i) => 50 + i * 24 + r() * 20);
      h.forEach((v, i) => (s += `<rect x="${286 + i * 48}" y="${286 - v}" width="30" height="${v}" rx="6" fill="${i === 5 ? c[0] : c[1]}"/>`));
      const pts = h.map((v, i) => `${301 + i * 48} ${270 - v}`).join(" L");
      s += `<path d="M${pts}" stroke="#111827" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${301 + 5 * 48}" cy="${270 - h[5]}" r="8" fill="#111827"/>`;
      s += tile(person(r), 50, 70, 160, 170, c[0]);
      s += `<text x="66" y="300" font-family="Georgia, serif" font-size="96" fill="${c[0]}" opacity=".35">&#8220;</text>`;
      if (o.label) s += chip(440, 18, 150, o.label, "#111827", 22);
      return s;
    },
    briefs(c, r) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><circle cx="90" cy="70" r="110" fill="${c[1]}" opacity=".5"/>`;
      s += card(60, 70, 220, 150, 14) + `<rect x="60" y="70" width="220" height="40" rx="14" fill="#E5E7EB"/><rect x="60" y="96" width="220" height="14" fill="#E5E7EB"/>`;
      for (let i = 0; i < 3; i++) s += `<rect x="80" y="${126 + i * 28}" width="${120 + r() * 60}" height="18" rx="6" fill="#F3F4F6"/>`;
      s += `<path d="M70 82l200 126M270 82L70 208" stroke="#EF4444" stroke-width="8" stroke-linecap="round" opacity=".75"/>`;
      s += card(320, 30, 260, 300, 16) + `<rect x="344" y="56" width="150" height="16" rx="8" fill="#111827"/><rect x="344" y="82" width="80" height="10" rx="5" fill="${c[0]}"/>`;
      for (let i = 0; i < 6; i++) { const y = 116 + i * 34; s += `<rect x="344" y="${y}" width="20" height="20" rx="5" fill="${i < 4 ? c[0] : "#fff"}" stroke="${c[0]}" stroke-width="2.5"/>${i < 4 ? check(354, y + 11, 0.55) : ""}<rect x="376" y="${y + 6}" width="${100 + r() * 80}" height="8" rx="4" fill="#CBD5E1"/>`; }
      return s;
    },
    chaos(c, r) {
      let s = `<rect width="640" height="360" fill="${c[2]}"/><rect x="320" width="320" height="360" fill="${c[1]}" opacity=".45"/>`;
      let d = "M60 180"; for (let i = 0; i < 26; i++) d += ` Q${40 + r() * 240} ${40 + r() * 280} ${40 + r() * 240} ${40 + r() * 280}`;
      s += `<path d="${d}" stroke="#94A3B8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`;
      s += `<path d="M286 180h52" stroke="#111827" stroke-width="6" stroke-linecap="round"/><path d="M326 166l16 14-16 14" stroke="#111827" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) s += `<rect x="${380 + col * 76}" y="${76 + row * 74}" width="62" height="58" rx="10" fill="${row === 0 ? c[0] : "#fff"}" opacity="${row === 0 ? 1 - col * 0.25 : 1}" stroke="${c[0]}" stroke-opacity=".25" stroke-width="2"/>`;
      return s;
    }
  };
  const KINDS = { Productivity: ["briefs", "week", "chaos"], Engineering: ["pipeline", "async"], "Remote Work": ["remote", "async"], Leadership: ["standup"], "Product Updates": ["shipped", "ai"], "Customer Stories": ["story"] };
  function thumb(cat, seed, label, kind, opts) {
    const c = PAL[cat], r = rng(seed * 2654435761);
    const k = kind || KINDS[cat][seed % KINDS[cat].length];
    return `<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${SC[k](c, r, opts || {})}</svg>`;
  }

  // ---------- free resource covers ----------
  const COVER = {
    playbook: `<rect width="160" height="120" fill="#DBEAFE"/><rect x="48" y="14" width="64" height="92" rx="4" fill="#2563EB"/><rect x="48" y="14" width="10" height="92" fill="#1D4ED8"/><rect x="64" y="30" width="38" height="6" rx="3" fill="#fff"/><rect x="64" y="42" width="28" height="6" rx="3" fill="#BFDBFE"/><circle cx="84" cy="78" r="12" fill="none" stroke="#fff" stroke-width="3"/><path d="M72 78h24M84 66c5 6 5 18 0 24M84 66c-5 6-5 18 0 24" stroke="#fff" stroke-width="2" fill="none"/>`,
    scorecard: `<rect width="160" height="120" fill="#ECFDF5"/><rect x="30" y="16" width="100" height="88" rx="8" fill="#fff" stroke="#A7F3D0" stroke-width="2"/><path d="M50 72a30 30 0 0 1 60 0" stroke="#E5E7EB" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M50 72a30 30 0 0 1 48-24" stroke="#059669" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M80 72l14-16" stroke="#111827" stroke-width="4" stroke-linecap="round"/><rect x="46" y="84" width="68" height="6" rx="3" fill="#D1FAE5"/>`,
    masterclass: `<rect width="160" height="120" fill="#1E3A5F"/><circle cx="130" cy="20" r="40" fill="#2563EB" opacity=".35"/><rect x="22" y="22" width="116" height="70" rx="8" fill="#0F172A"/><circle cx="80" cy="57" r="18" fill="#fff"/><path d="M75 48v18l14-9z" fill="#2563EB"/><rect x="22" y="100" width="116" height="5" rx="2.5" fill="#334155"/><rect x="22" y="100" width="44" height="5" rx="2.5" fill="#60A5FA"/>`
  };
  const cover = (k, label) => `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${COVER[k]}</svg>`;

  const AUTH = {
    sarah: { skin: 1, hair: 0, hairStyle: "bob", top: 7, bg: 3 },
    marcus: { skin: 5, hair: 0, hairStyle: "buzz", top: 1, bg: 1, beard: true },
    priya: { skin: 3, hair: 0, hairStyle: "long", top: 3, bg: 4 },
    daniel: { skin: 6, hair: 0, hairStyle: "short", top: 2, bg: 3, glasses: true },
    elena: { skin: 0, hair: 3, hairStyle: "bun", top: 6, bg: 5 },
    james: { skin: 2, hair: 1, hairStyle: "side", top: 4, bg: 6, glasses: true },
    aisha: { skin: 5, hair: 6, hairStyle: "curly", top: 5, bg: 2 },
    tom: { skin: 7, hair: 4, hairStyle: "short", top: 0, bg: 0, beard: true }
  };
  const avatar = (k, label) => portrait(AUTH[k], label, "circle");
  window.Art = { thumb, cover, avatar, PAL };
})();
