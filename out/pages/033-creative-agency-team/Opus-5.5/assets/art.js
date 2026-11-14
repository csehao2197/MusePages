// Original illustrated portraits and studio scenes (no photos). Exposes window.Art.
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

  function people(n, seed) {
    const S = ["short", "bob", "long", "bun", "curly", "buzz", "side", "wrap"];
    return Array.from({ length: n }, (_, i) => { const k = (i * 7 + seed) % 97; return { skin: k % 8, hair: (k * 3) % 8 === 5 && i % 3 ? 0 : (k * 3) % 8, hairStyle: S[(k * 5 + i) % 8], top: (k * 3 + i) % 10, bg: i % 8, glasses: k % 4 === 1, beard: S[(k * 5 + i) % 8] === "buzz" || (S[(k * 5 + i) % 8] === "short" && k % 3 === 0) }; });
  }

  // ---------- group "photo" ----------
  function group() {
    let b = `<rect width="1200" height="560" fill="#FED7AA"/><rect width="1200" height="380" fill="#FFEDD5"/>`;
    b += [0, 1, 2].map((i) => `<rect x="${110 + i * 360}" y="40" width="260" height="210" rx="10" fill="#FFF7ED"/><path d="M${240 + i * 360} 40v210M${110 + i * 360} 145h260" stroke="#FED7AA" stroke-width="6"/>`).join("");
    b += `<rect x="0" y="380" width="1200" height="180" fill="#C2410C" opacity=".18"/>`;
    b += `<path d="M40 380c0-60 20-100 40-120 10 40 30 70 20 120z" fill="#15803D"/><path d="M60 380c-10-50 0-90 30-110 0 40 10 80 0 110z" fill="#22C55E"/><rect x="40" y="370" width="60" height="50" rx="8" fill="#9A3412"/>`;
    b += `<path d="M1120 380c0-70 30-110 50-120 4 50-4 90-20 120z" fill="#15803D"/><rect x="1100" y="370" width="70" height="50" rx="8" fill="#7C3AED"/>`;
    b += `<g transform="translate(560 30)"><rect width="100" height="70" rx="6" fill="#7C3AED"/><text x="50" y="44" font-size="22" font-weight="700" fill="#fff" text-anchor="middle" font-family="General Sans, Inter, sans-serif">M/S</text></g>`;
    const P = people(13, 11);
    const back = [[170, 300], [300, 286], [430, 300], [560, 282], [690, 298], [820, 286], [950, 300], [1060, 292]];
    const front = [[230, 420], [380, 430], [530, 418], [700, 428], [860, 422]];
    back.forEach(([x, y], i) => { b += bust(P[i], x, y, 1.05); });
    b += `<rect x="0" y="420" width="1200" height="140" fill="#9A3412" opacity=".12"/>`;
    front.forEach(([x, y], i) => { b += bust(P[8 + i], x, y, 1.18); });
    return `<svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of the Mosaic Studio team gathered in the studio" preserveAspectRatio="xMidYMid slice">${b}</svg>`;
  }

  // ---------- collage scenes ----------
  const SC = {
    retreat: () => {
      const P = people(5, 3);
      let b = `<rect width="600" height="760" fill="#1E1B4B"/><circle cx="460" cy="140" r="46" fill="#FDE68A"/>`;
      b += [...Array(30)].map((_, i) => `<circle cx="${(i * 97) % 600}" cy="${(i * 53) % 320}" r="${i % 3 ? 1.5 : 2.5}" fill="#fff" opacity=".7"/>`).join("");
      b += `<path d="M0 420 160 250l120 120 110-150 210 220v320H0z" fill="#312E81"/><path d="M0 520 200 380l150 100 120-80 130 90v270H0z" fill="#4C1D95"/><rect y="600" width="600" height="160" fill="#2E1065"/>`;
      b += `<path d="M300 640c-30-20-20-60 0-90 20 30 30 70 0 90z" fill="#F97316"/><path d="M300 640c-14-12-10-34 0-50 10 16 14 38 0 50z" fill="#FDE68A"/><path d="M260 650h80" stroke="#7C2D12" stroke-width="10" stroke-linecap="round"/>`;
      b += `<ellipse cx="300" cy="640" rx="220" ry="80" fill="#F97316" opacity=".12"/>`;
      [[120, 640], [200, 670], [400, 670], [480, 640]].forEach(([x, y], i) => { b += bust(P[i], x, y, 0.7); });
      return [600, 760, b, "Team retreat around a campfire in the mountains"];
    },
    office: () => {
      const P = people(3, 21);
      let b = `<rect width="600" height="440" fill="#FEF3C7"/><rect x="40" y="40" width="200" height="150" rx="8" fill="#FFFBEB"/><path d="M140 40v150M40 115h200" stroke="#FDE68A" stroke-width="5"/>`;
      b += `<path d="M500 300c0-80 20-120 40-140 6 60-4 110-16 140z" fill="#16A34A"/><rect x="486" y="290" width="54" height="50" rx="6" fill="#EA580C"/>`;
      b += bust(P[0], 185, 215, 0.8) + bust(P[1], 395, 215, 0.8);
      b += `<rect x="0" y="330" width="600" height="110" fill="#78350F" opacity=".85"/><rect x="0" y="322" width="600" height="14" fill="#92400E"/>`;
      b += `<rect x="110" y="236" width="150" height="96" rx="8" fill="#1C1917"/><rect x="118" y="244" width="134" height="76" rx="4" fill="#7C3AED"/><rect x="130" y="256" width="60" height="8" rx="4" fill="#fff" opacity=".8"/><rect x="130" y="272" width="100" height="30" rx="4" fill="#F97316"/>`;
      b += `<rect x="330" y="250" width="130" height="84" rx="8" fill="#E5E7EB"/><rect x="338" y="258" width="114" height="64" rx="4" fill="#fff"/><path d="M350 300l20-16 20 10 20-20 26 14" stroke="#0EA5E9" stroke-width="4" fill="none"/>`;
      b += `<rect x="290" y="300" width="22" height="30" rx="4" fill="#fff"/><path d="M312 308h6a6 6 0 0 1 0 12h-6" stroke="#fff" stroke-width="4" fill="none"/>`;
      return [600, 440, b, "Two teammates working side by side in the studio"];
    },
    whiteboard: () => {
      const P = people(1, 40);
      let b = `<rect width="600" height="520" fill="#E0E7FF"/><rect x="60" y="60" width="480" height="300" rx="10" fill="#fff" stroke="#C7D2FE" stroke-width="6"/>`;
      const notes = [["#FDE68A", 90, 90], ["#FBCFE8", 170, 100], ["#BBF7D0", 250, 86], ["#FED7AA", 110, 190], ["#DDD6FE", 200, 200], ["#FDE68A", 280, 180], ["#BAE6FD", 360, 96], ["#FBCFE8", 360, 200]];
      notes.forEach(([c, x, y], i) => { b += `<rect x="${x}" y="${y}" width="66" height="66" fill="${c}" transform="rotate(${(i % 3) - 1} ${x + 33} ${y + 33})"/><path d="M${x + 10} ${y + 22}h40M${x + 10} ${y + 36}h30" stroke="rgba(0,0,0,.25)" stroke-width="3"/>`; });
      b += `<path d="M450 110c40 20 50 80 10 120" stroke="#F97316" stroke-width="4" fill="none" stroke-dasharray="6 6"/><path d="m452 226 8 6 6-10" stroke="#F97316" stroke-width="4" fill="none"/>`;
      b += bust(P[0], 480, 430, 0.95);
      return [600, 520, b, "Whiteboard session covered in sticky notes"];
    },
    dinner: () => {
      const P = people(6, 55);
      let b = `<rect width="600" height="700" fill="#7C2D12"/><rect width="600" height="300" fill="#9A3412"/>`;
      b += [80, 220, 360, 500].map((x) => `<path d="M${x} 0v80" stroke="#FDE68A" stroke-width="2"/><circle cx="${x}" cy="92" r="14" fill="#FDE68A"/><circle cx="${x}" cy="92" r="40" fill="#FDE68A" opacity=".15"/>`).join("");
      [[110, 330], [300, 316], [490, 330]].forEach(([x, y], i) => { b += bust(P[i], x, y, 0.8); });
      b += `<rect x="0" y="380" width="600" height="140" fill="#FFFBEB"/><rect x="0" y="380" width="600" height="10" fill="#FDE68A"/>`;
      [100, 230, 370, 500].forEach((x) => { b += `<ellipse cx="${x}" cy="440" rx="44" ry="18" fill="#fff" stroke="#E7E5E4" stroke-width="3"/><ellipse cx="${x}" cy="436" rx="22" ry="8" fill="#F97316" opacity=".7"/><rect x="${x + 50}" y="396" width="10" height="34" rx="4" fill="#7C3AED" opacity=".5"/>`; });
      [[110, 640], [300, 660], [490, 640]].forEach(([x, y], i) => { b += bust(P[3 + i], x, y, 0.9); });
      return [600, 700, b, "Team dinner around a long table"];
    },
  };
  function scene(name) { const [w, h, b, label] = SC[name](); return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration: ${label}" preserveAspectRatio="xMidYMid slice">${b}</svg>`; }

  window.Art = { portrait, group, scene, people };
})();
