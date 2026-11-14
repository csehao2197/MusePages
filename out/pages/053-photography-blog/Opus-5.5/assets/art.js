// Original landscape illustrations standing in for photographs. Exposes window.Art.
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


  // ---------- parametric landscape "photographs" ----------
  const rng = (seed) => { let s = seed % 2147483647 || 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
  let uid = 0;
  const id = (p) => `${p}${uid++}`;
  function ridge(w, base, amp, step, seed, jag = 0.6, peaks = []) {
    const r = rng(seed); let d = `M0 ${base}`; let y = base - amp * r();
    for (let x = 0; x <= w + step; x += step) {
      y = Math.max(base - amp, Math.min(base + amp * 0.2, y + (r() - 0.5) * amp * jag));
      let py = y;
      for (const [px, ph, pw] of peaks) { const dx = Math.abs(x - px); if (dx < pw) py = Math.min(py, base - ph + (dx / pw) * ph * 0.9); }
      d += ` L${x} ${py.toFixed(1)}`;
    }
    return d;
  }
  function land(o) {
    const w = o.w || 1600, h = o.h || 1000, g = id("g"), clip = id("c"), sunG = id("s"), wy = o.water ? o.water.y : h;
    let defs = `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1">${o.sky.map((c, i) => `<stop offset="${i / (o.sky.length - 1)}" stop-color="${c}"/>`).join("")}</linearGradient>`;
    if (o.sun) defs += `<radialGradient id="${sunG}"><stop offset="0" stop-color="${o.sun.c}" stop-opacity=".95"/><stop offset=".25" stop-color="${o.sun.c}" stop-opacity=".5"/><stop offset="1" stop-color="${o.sun.c}" stop-opacity="0"/></radialGradient>`;
    let s = `<rect width="${w}" height="${h}" fill="url(#${g})"/>`;
    if (o.stars) { const r = rng(o.stars); s += `<g fill="#fff">${Array.from({ length: 220 }, () => `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * wy * 0.8).toFixed(0)}" r="${(r() * 1.6 + 0.3).toFixed(1)}" opacity="${(r() * 0.7 + 0.3).toFixed(2)}"/>`).join("")}</g>`; }
    if (o.milky) s += `<path d="M${w * 0.1} ${h * 0.9} C ${w * 0.35} ${h * 0.4}, ${w * 0.55} ${h * 0.2}, ${w * 0.95} 0" stroke="#E9D5FF" stroke-width="${h * 0.16}" opacity=".16" fill="none" stroke-linecap="round" filter="blur(18px)"/><path d="M${w * 0.15} ${h * 0.85} C ${w * 0.38} ${h * 0.42}, ${w * 0.56} ${h * 0.24}, ${w * 0.92} 0.02" stroke="#FFF7ED" stroke-width="${h * 0.05}" opacity=".22" fill="none" filter="blur(8px)"/>`;
    if (o.aurora) s += o.aurora.map((c, i) => `<path d="M${-100} ${h * (0.35 + i * 0.07)} C ${w * 0.25} ${h * (0.1 + i * 0.05)}, ${w * 0.55} ${h * (0.45 - i * 0.05)}, ${w + 100} ${h * (0.15 + i * 0.06)}" stroke="${c}" stroke-width="${h * 0.09}" opacity=".38" fill="none" filter="blur(22px)"/>`).join("");
    if (o.sun) s += `<circle cx="${o.sun.x * w}" cy="${o.sun.y * h}" r="${o.sun.r * h * 4}" fill="url(#${sunG})"/><circle cx="${o.sun.x * w}" cy="${o.sun.y * h}" r="${o.sun.r * h}" fill="#FFF7E0" opacity=".9"/>`;
    const layers = (o.ranges || []).map((R) => `<path d="${ridge(w, R.y * h, R.a * h, R.step || 24, R.seed, R.j ?? 0.6, (R.peaks || []).map(([px, ph, pw]) => [px * w, ph * h, pw * w]))} L${w + 30} ${h} L0 ${h}Z" fill="${R.c}"/>${R.snow ? `<path d="${ridge(w, R.y * h, R.a * h, R.step || 24, R.seed, R.j ?? 0.6, (R.peaks || []).map(([px, ph, pw]) => [px * w, ph * h, pw * w]))} L${w + 30} ${h} L0 ${h}Z" fill="${R.snow}" opacity=".55" transform="translate(0 ${h * 0.012})" style="mix-blend-mode:screen" clip-path="inset(0 0 ${100 - (R.y - R.a * 0.5) * 100}% 0)"/>` : ""}`).join("");
    s += layers;
    if (o.fog) s += o.fog.map(([y, op, c]) => `<rect x="-50" y="${y * h - h * 0.05}" width="${w + 100}" height="${h * 0.12}" fill="${c || "#fff"}" opacity="${op}" filter="blur(${h * 0.025}px)"/>`).join("");
    if (o.water) {
      s += `<clipPath id="${clip}"><rect y="${wy}" width="${w}" height="${h - wy}"/></clipPath><rect y="${wy}" width="${w}" height="${h - wy}" fill="${o.water.c}"/>`;
      if (o.water.reflect) s += `<g clip-path="url(#${clip})" opacity="${o.water.reflect}"><g transform="translate(0 ${2 * wy}) scale(1 -1)"><rect width="${w}" height="${wy}" fill="url(#${g})"/>${layers}</g></g>`;
      s += `<g stroke="#fff" opacity=".18">${Array.from({ length: 10 }, (_, i) => `<path d="M${(i * 173) % w} ${wy + 12 + i * ((h - wy) / 11)}h${60 + (i % 3) * 40}"/>`).join("")}</g>`;
    }
    if (o.extra) s += o.extra(w, h);
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" ${o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${s}</svg>`;
  }
  const cottage = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-30" width="80" height="34" fill="#E7E5E4"/><path d="M-46-28 0-58 46-28z" fill="#3F3F46"/><rect x="18" y="-56" width="10" height="18" fill="#57534E"/><rect x="-8" y="-18" width="12" height="22" fill="#292524"/><rect x="-30" y="-20" width="12" height="10" fill="#FDE68A" opacity=".8"/></g>`;
  const tree = (x, y, s, c = "#1C1917") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0V-60M0-30-18-50M0-38 16-62M0-50-10-72M16-62 26-74" stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;
  const cabins = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 70, 150, 230].map((dx, i) => `<rect x="${dx}" y="-40" width="56" height="40" fill="${["#B91C1C", "#991B1B", "#FBBF24", "#DC2626"][i]}"/><path d="M${dx - 4}-38 ${dx + 28}-62 ${dx + 60}-38z" fill="#1C1917"/><rect x="${dx + 6}" y="0" width="4" height="30" fill="#292524"/><rect x="${dx + 46}" y="0" width="4" height="30" fill="#292524"/><rect x="${dx + 22}" y="-26" width="12" height="10" fill="#FEF3C7"/>`).join("")}</g>`;

  const SCENES = {
    dolomites: () => land({ label: "The Tre Cime di Lavaredo at golden hour above layers of low cloud", sky: ["#1E2A48", "#7A5A7A", "#E8A65A", "#F8D9A0"], sun: { x: 0.82, y: 0.52, r: 0.03, c: "#FFD58A" },
      ranges: [{ y: 0.62, a: 0.2, c: "#6B5466", seed: 3, j: 0.5 }, { y: 0.72, a: 0.18, c: "#3F2E3E", seed: 11, j: 0.35, step: 18, peaks: [[0.42, 0.5, 0.05], [0.49, 0.56, 0.055], [0.56, 0.46, 0.05]] }, { y: 0.9, a: 0.12, c: "#1C1418", seed: 5 }],
      fog: [[0.64, 0.55, "#FCE7D0"], [0.74, 0.5, "#F5D0B5"], [0.82, 0.35, "#E7C1A5"]] }),
    diamond: () => land({ label: "Ice chunks glowing on Iceland's black sand Diamond Beach under the midnight sun", sky: ["#33415C", "#C2847A", "#F5C28B"], sun: { x: 0.3, y: 0.55, r: 0.025, c: "#FFCF8A" }, water: { y: 0.6, c: "#22313F", reflect: 0.35 },
      ranges: [{ y: 0.6, a: 0.06, c: "#3A4656", seed: 9 }],
      extra: (w, h) => { const r = rng(42); return `<rect y="${h * 0.72}" width="${w}" height="${h * 0.28}" fill="#121212"/><path d="M0 ${h * 0.72} Q ${w * 0.5} ${h * 0.69} ${w} ${h * 0.73}" stroke="#E2E8F0" stroke-width="6" opacity=".5" fill="none"/>${Array.from({ length: 14 }, (_, i) => { const x = r() * w, y = h * (0.76 + r() * 0.2), s = 30 + r() * 70; return `<path d="M${x} ${y}l${s * 0.4} ${-s * 0.7} ${s * 0.8} ${-s * 0.1} ${s * 0.4} ${s * 0.8}z" fill="#BAE6FD" opacity="${0.55 + r() * 0.35}"/><path d="M${x + s * 0.4} ${y - s * 0.7}l${s * 0.3} ${s * 0.5}" stroke="#FDE68A" stroke-width="3" opacity=".8"/>`; }).join("")}`; } }),
    patagonia: () => land({ label: "The granite Torres del Paine reflected in a turquoise lake in autumn", sky: ["#5B7FA6", "#B8CDE0", "#EEF2F5"], water: { y: 0.66, c: "#2BA3A3", reflect: 0.45 },
      ranges: [{ y: 0.66, a: 0.55, c: "#6B6A74", seed: 21, j: 0.3, step: 14, peaks: [[0.38, 0.58, 0.03], [0.45, 0.62, 0.03], [0.52, 0.56, 0.03]], snow: "#fff" }, { y: 0.68, a: 0.08, c: "#B45309", seed: 4 }],
      extra: (w, h) => `<rect y="${h * 0.66}" width="${w}" height="${h * 0.03}" fill="#C2410C" opacity=".75"/>` }),
    lightroom: () => land({ label: "A Dolomites sunrise shown half as a flat RAW file and half as the final edit", sky: ["#1E2A48", "#7A5A7A", "#E8A65A", "#F8D9A0"], sun: { x: 0.8, y: 0.5, r: 0.03, c: "#FFD58A" },
      ranges: [{ y: 0.64, a: 0.22, c: "#6B5466", seed: 13 }, { y: 0.8, a: 0.3, c: "#3F2E3E", seed: 17 }], fog: [[0.7, 0.5, "#FCE7D0"]],
      extra: (w, h) => `<rect width="${w / 2}" height="${h}" fill="#9CA3AF" style="mix-blend-mode:saturation"/><rect width="${w / 2}" height="${h}" fill="#fff" opacity=".18"/><path d="M${w / 2} 0V${h}" stroke="#fff" stroke-width="5"/><text x="${w * 0.04}" y="${h * 0.08}" font-family="Inter,sans-serif" font-size="${h * 0.04}" font-weight="700" fill="#fff">RAW</text><text x="${w * 0.96}" y="${h * 0.08}" text-anchor="end" font-family="Inter,sans-serif" font-size="${h * 0.04}" font-weight="700" fill="#fff">FINAL</text>` }),
    highlands: () => land({ label: "A lone white cottage beside a misty Scottish loch", sky: ["#6B7280", "#A8B1B8", "#D6DBDF"], water: { y: 0.7, c: "#4B5563", reflect: 0.4 },
      ranges: [{ y: 0.55, a: 0.18, c: "#5B6B60", seed: 8, j: 0.4 }, { y: 0.7, a: 0.12, c: "#3F4F3F", seed: 15, j: 0.4 }], fog: [[0.52, 0.6], [0.62, 0.45]],
      extra: (w, h) => cottage(w * 0.62, h * 0.69, h / 400) }),
    // destinations (portrait 3:4)
    iceland: () => land({ w: 900, h: 1200, sky: ["#071423", "#0F2A3A", "#16404A"], stars: 3, aurora: ["#34D399", "#10B981", "#A78BFA"], ranges: [{ y: 0.72, a: 0.14, c: "#0B1A20", seed: 31 }], extra: (w, h) => `<rect y="${h * 0.8}" width="${w}" height="${h * 0.2}" fill="#060606"/><path d="M0 ${h * 0.8}Q${w / 2} ${h * 0.78} ${w} ${h * 0.81}" stroke="#94A3B8" stroke-width="4" opacity=".4" fill="none"/>` }),
    hut: () => land({ w: 900, h: 1200, sky: ["#3B2F4A", "#C47A5A", "#F5C68B"], sun: { x: 0.7, y: 0.5, r: 0.025, c: "#FFD58A" }, ranges: [{ y: 0.55, a: 0.3, c: "#6B4E4E", seed: 33, step: 14, peaks: [[0.4, 0.38, 0.06]] }, { y: 0.82, a: 0.1, c: "#2A1D1F", seed: 34 }], fog: [[0.6, 0.4, "#FCD9B5"]], extra: (w, h) => `<g transform="translate(${w * 0.5} ${h * 0.82}) scale(1.6)"><rect x="-40" y="-30" width="80" height="30" fill="#7C2D12"/><path d="M-48-28 0-60 48-28z" fill="#292524"/><rect x="-26" y="-20" width="12" height="10" fill="#FDE68A"/><rect x="10" y="-20" width="12" height="10" fill="#FDE68A"/></g>` }),
    glacier: () => land({ w: 900, h: 1200, sky: ["#1E3A5F", "#7FA7C9", "#DCE8F2"], ranges: [{ y: 0.55, a: 0.42, c: "#475569", seed: 41, step: 12, j: 0.35, peaks: [[0.5, 0.45, 0.05]], snow: "#fff" }, { y: 0.75, a: 0.05, c: "#E0F2FE", seed: 42 }], extra: (w, h) => `<path d="M0 ${h * 0.75}L${w} ${h * 0.73}V${h}H0z" fill="#BAE6FD"/><g stroke="#7DD3FC" stroke-width="3" opacity=".7">${[0.8, 0.86, 0.92].map((y) => `<path d="M0 ${h * y}Q${w / 2} ${h * (y - 0.02)} ${w} ${h * y}"/>`).join("")}</g>` }),
    glen: () => land({ w: 900, h: 1200, sky: ["#4B5B4F", "#8C9A88", "#C7CFC3"], ranges: [{ y: 0.55, a: 0.3, c: "#3F5243", seed: 51, j: 0.3 }, { y: 0.75, a: 0.18, c: "#2C3A2E", seed: 52, j: 0.3 }], fog: [[0.5, 0.6], [0.66, 0.5]], extra: (w, h) => `<g transform="translate(${w * 0.55} ${h * 0.86}) scale(2)" fill="#1C1917"><ellipse cx="0" cy="0" rx="26" ry="11"/><rect x="-20" y="6" width="4" height="22"/><rect x="14" y="6" width="4" height="22"/><path d="M22-4 30-26 38-26 34-4z"/><path d="M30-26 24-40M36-26 44-42M26-34 20-36M40-34 48-34" stroke="#1C1917" stroke-width="2.5" fill="none"/></g>` }),
    lofoten: () => land({ w: 900, h: 1200, sky: ["#0F1E3D", "#25417A", "#5C7CB8"], stars: 5, water: { y: 0.72, c: "#0B1B36", reflect: 0.45 }, ranges: [{ y: 0.72, a: 0.5, c: "#1F2C46", seed: 61, step: 14, j: 0.35, peaks: [[0.6, 0.55, 0.12]], snow: "#E2E8F0" }], extra: (w, h) => cabins(w * 0.1, h * 0.72, 1.3) }),
    milford: () => land({ w: 900, h: 1200, sky: ["#4A7A86", "#8FB7BE", "#D5E6E8"], water: { y: 0.58, c: "#1F5F66", reflect: 0.75 }, ranges: [{ y: 0.58, a: 0.48, c: "#284A45", seed: 71, step: 12, j: 0.25, peaks: [[0.55, 0.5, 0.12]] }], fog: [[0.42, 0.35]] }),
    // gallery
    kirkjufell: () => land({ label: "The Milky Way over Kirkjufell mountain in Iceland", sky: ["#050816", "#101935", "#25305A"], stars: 11, milky: true, ranges: [{ y: 0.75, a: 0.05, c: "#0A0F1E", seed: 81, peaks: [[0.55, 0.42, 0.14]] }], extra: (w, h) => `<path d="M0 ${h * 0.85}H${w}V${h}H0z" fill="#05070D"/><path d="M${w * 0.18} ${h * 0.83}q20 -30 40 0" stroke="#7DD3FC" stroke-width="4" fill="none" opacity=".6"/>` }),
    wanaka: () => land({ label: "The lone willow tree standing in Lake Wanaka, New Zealand", w: 900, h: 1200, sky: ["#F5C9A8", "#F9E2CF", "#FCEFE3"], water: { y: 0.55, c: "#C7B8B0", reflect: 0.5 }, ranges: [{ y: 0.55, a: 0.12, c: "#9A8C99", seed: 91, j: 0.3 }], extra: (w, h) => tree(w * 0.5, h * 0.6, 4.2, "#2A211D") + `<g transform="translate(${w * 0.5} ${h * 0.6}) scale(4.2 -3)" opacity=".35">${tree(0, 0, 1, "#2A211D")}</g>` }),
    glencoe: () => land({ label: "Foggy morning among the mountains of Glencoe, Scotland", sky: ["#8A949A", "#B8BFC2", "#DADEE0"], ranges: [{ y: 0.6, a: 0.45, c: "#5E6A60", seed: 101, j: 0.35, step: 18, peaks: [[0.5, 0.45, 0.2]] }, { y: 0.85, a: 0.12, c: "#40483F", seed: 102 }], fog: [[0.5, 0.65], [0.72, 0.55]] }),
    seceda: () => land({ label: "Sunrise along the sharp Seceda ridgeline in the Dolomites", sky: ["#3E4A72", "#D8957A", "#F7D3A1"], sun: { x: 0.2, y: 0.42, r: 0.025, c: "#FFD58A" }, extra: (w, h) => `<path d="M0 ${h * 0.95}L${w * 0.75} ${h * 0.25}L${w} ${h * 0.38}V${h}H0z" fill="#3F6B3A"/><path d="M${w * 0.75} ${h * 0.25}L${w} ${h * 0.38}V${h}H${w * 0.82}z" fill="#8C7A6B"/><path d="M0 ${h * 0.95}L${w * 0.75} ${h * 0.25}" stroke="#F8C77A" stroke-width="6" opacity=".7"/>` + `<rect y="${h * 0.6}" width="${w}" height="${h * 0.1}" fill="#FCE7D0" opacity=".35" filter="blur(20px)"/>` }),
    reine: () => land({ label: "Aurora reflected in the water at Reine, Lofoten, Norway", sky: ["#071423", "#0D2B3A", "#123E4A"], stars: 13, aurora: ["#4ADE80", "#22D3EE"], water: { y: 0.66, c: "#05131C", reflect: 0.6 }, ranges: [{ y: 0.66, a: 0.42, c: "#0B1A22", seed: 111, step: 14, j: 0.3, peaks: [[0.4, 0.45, 0.1]] }], extra: (w, h) => cabins(w * 0.6, h * 0.66, 0.9) }),
    fitzroy: () => land({ label: "Alpenglow on Mount Fitz Roy, Patagonia", w: 900, h: 1200, sky: ["#2D2347", "#8A5A7A", "#F2A07B"], ranges: [{ y: 0.6, a: 0.5, c: "#C2603F", seed: 121, step: 10, j: 0.3, peaks: [[0.5, 0.52, 0.06], [0.38, 0.38, 0.05], [0.62, 0.4, 0.05]] }, { y: 0.78, a: 0.1, c: "#2A1E2C", seed: 122 }], fog: [[0.68, 0.35, "#F7C6A5"]] }),
    faroe: () => land({ label: "Sea stacks off the Faroe Islands at sunset", sky: ["#3B3355", "#C46A5A", "#F7B27A"], sun: { x: 0.6, y: 0.58, r: 0.03, c: "#FFC07A" }, water: { y: 0.62, c: "#2E2A3E", reflect: 0.3 }, extra: (w, h) => `<path d="M${w * 0.62} ${h * 0.62}V${h * 0.3}l${w * 0.04} -${h * 0.05} ${w * 0.03} ${h * 0.05}V${h * 0.62}z" fill="#1C1724"/><path d="M${w * 0.74} ${h * 0.62}V${h * 0.42}l${w * 0.025} -${h * 0.04} ${w * 0.02} ${h * 0.04}V${h * 0.62}z" fill="#1C1724"/><path d="M0 ${h * 0.4}L${w * 0.3} ${h * 0.45}L${w * 0.38} ${h * 0.62}H0z" fill="#25202E"/><path d="M0 ${h * 0.4}L${w * 0.3} ${h * 0.45}" stroke="#4D7C0F" stroke-width="10"/>` }),
    horses: () => land({ label: "Icelandic horses standing in a snowstorm", sky: ["#B6BEC6", "#D4D9DE", "#E8EBEE"], ranges: [{ y: 0.55, a: 0.15, c: "#9AA3AB", seed: 131 }], extra: (w, h) => { const r = rng(77); return `<rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="#F1F3F5"/>${[[0.35, "#6B3E26"], [0.55, "#E7E5E4"], [0.7, "#3F2A1E"]].map(([x, c]) => `<g transform="translate(${w * x} ${h * 0.78}) scale(${h / 260})"><ellipse cx="0" cy="0" rx="34" ry="16" fill="${c}"/><path d="M26-6 44-30 52-28 40 0z" fill="${c}"/><path d="M40-32c6 10 14 12 18 8" stroke="#1C1917" stroke-width="5"/><rect x="-26" y="10" width="6" height="26" fill="${c}"/><rect x="20" y="10" width="6" height="26" fill="${c}"/><path d="M-34-4c-8 10-8 20-4 26" stroke="${c}" stroke-width="6" fill="none"/></g>`).join("")}<g fill="#fff">${Array.from({ length: 160 }, () => `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(r() * 4 + 1).toFixed(1)}" opacity="${(r() * 0.6 + 0.3).toFixed(2)}"/>`).join("")}</g>`; } }),
    braies: () => land({ label: "Wooden rowboats on the turquoise water of Lago di Braies", sky: ["#7FA9C9", "#C9DCE8", "#EAF1F5"], water: { y: 0.6, c: "#14B8A6", reflect: 0.35 }, ranges: [{ y: 0.6, a: 0.45, c: "#8A8F93", seed: 141, step: 14, j: 0.35, peaks: [[0.5, 0.48, 0.15]], snow: "#fff" }, { y: 0.62, a: 0.06, c: "#14532D", seed: 142 }], extra: (w, h) => [0.3, 0.42, 0.54].map((x) => `<path d="M${w * x} ${h * 0.82}h${w * 0.08}l-${w * 0.012} ${h * 0.03}h-${w * 0.056}z" fill="#7C2D12"/>`).join("") + `<rect x="${w * 0.25}" y="${h * 0.8}" width="${w * 0.4}" height="${h * 0.012}" fill="#57534E"/>` }),
    // newsletter
    camp: () => land({ label: "The Milky Way above a glowing tent at a mountain campsite", sky: ["#04060F", "#0B1430", "#1A2550"], stars: 151, milky: true, ranges: [{ y: 0.72, a: 0.2, c: "#070A14", seed: 151 }], extra: (w, h) => `<rect y="${h * 0.82}" width="${w}" height="${h * 0.18}" fill="#05060B"/><g transform="translate(${w * 0.55} ${h * 0.84}) scale(${h / 300})"><path d="M-60 0 0-60 60 0z" fill="#F59E0B"/><path d="M-60 0 0-60 60 0z" fill="#FDE68A" opacity=".5"/><path d="M0-60V0" stroke="#92400E" stroke-width="2"/></g><circle cx="${w * 0.4}" cy="${h * 0.86}" r="${h * 0.1}" fill="#F97316" opacity=".25" filter="blur(20px)"/><path d="M${w * 0.39} ${h * 0.86}q8 -26 14 0z" fill="#FBBF24"/>` })
  };

  // gear "product photos"
  const GEAR = {
    camera: () => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mirrorless camera body"><rect width="400" height="300" fill="#E7E5E4"/><ellipse cx="200" cy="250" rx="140" ry="16" fill="#D6D3D1"/><rect x="90" y="110" width="220" height="130" rx="18" fill="#1C1917"/><path d="M150 110l14-26h72l14 26z" fill="#292524"/><rect x="100" y="120" width="44" height="110" rx="14" fill="#0C0A09"/><circle cx="220" cy="175" r="54" fill="#0C0A09"/><circle cx="220" cy="175" r="40" fill="#292524"/><circle cx="220" cy="175" r="22" fill="#1E3A8A" opacity=".6"/><circle cx="210" cy="165" r="6" fill="#fff" opacity=".5"/><rect x="270" y="96" width="24" height="14" rx="3" fill="#44403C"/><text x="248" y="134" font-family="Inter" font-size="10" fill="#A8A29E">α7R V</text></svg>`,
    tripod: () => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compact travel tripod"><rect width="400" height="300" fill="#E7E5E4"/><ellipse cx="200" cy="268" rx="120" ry="10" fill="#D6D3D1"/><rect x="186" y="40" width="28" height="22" rx="4" fill="#292524"/><rect x="194" y="62" width="12" height="70" fill="#57534E"/><path d="M200 130 140 266M200 130 200 270M200 130 260 266" stroke="#44403C" stroke-width="9" stroke-linecap="round"/><path d="M200 130 150 244M200 130 250 244" stroke="#78716C" stroke-width="4" stroke-linecap="round"/><rect x="186" y="124" width="28" height="16" rx="4" fill="#1C1917"/></svg>`,
    filters: () => `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Square filter holder with ND and polarizer filters"><rect width="400" height="300" fill="#E7E5E4"/><ellipse cx="200" cy="262" rx="150" ry="12" fill="#D6D3D1"/><rect x="70" y="70" width="120" height="160" rx="8" fill="#1C1917" opacity=".72"/><rect x="100" y="56" width="120" height="160" rx="8" fill="#334155" opacity=".55"/><circle cx="280" cy="160" r="64" fill="#1C1917"/><circle cx="280" cy="160" r="50" fill="#0F172A"/><circle cx="280" cy="160" r="50" fill="url(#pol)" opacity=".5"/><defs><linearGradient id="pol"><stop offset="0" stop-color="#6366F1"/><stop offset="1" stop-color="#14B8A6"/></linearGradient></defs><text x="96" y="210" font-family="Inter" font-size="12" fill="#E7E5E4">ND 1000</text></svg>`
  };

  const ELENA = { skin: 0, hair: 2, hairStyle: "long", top: 3, bg: 3 };
  function portraitScene() {
    return land({ w: 900, h: 1100, label: "Portrait of Elena Voss outdoors holding a camera, mountains behind her", sky: ["#9DB4C8", "#D6E2EA", "#EEF2F4"], ranges: [{ y: 0.5, a: 0.25, c: "#7C8C99", seed: 201, step: 14, j: 0.35, peaks: [[0.7, 0.3, 0.12]], snow: "#fff" }, { y: 0.62, a: 0.1, c: "#4D6B55", seed: 202 }],
      extra: (w, h) => `<g transform="translate(${w * 0.5} ${h * 0.68}) scale(3.4)">${bust(ELENA, 0, 0, 1)}<g transform="translate(-10 70)"><rect x="-34" y="-20" width="68" height="40" rx="8" fill="#1C1917"/><circle cx="6" cy="0" r="16" fill="#0C0A09"/><circle cx="6" cy="0" r="9" fill="#334155"/><rect x="-20" y="-28" width="20" height="10" rx="2" fill="#292524"/></g></g>` });
  }

  window.Art = { scene: (k) => SCENES[k](), gear: (k) => GEAR[k](), portrait: portraitScene };
})();
