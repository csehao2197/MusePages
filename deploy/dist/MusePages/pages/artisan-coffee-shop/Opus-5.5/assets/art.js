// Original SVG illustrations used in place of photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let n = 0;
  const svg = (vb, body, label, ratio = "xMidYMid slice") => `<svg viewBox="${vb}" preserveAspectRatio="${ratio}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;

  function brick(w, h, seed) {
    const r = rng(seed); let out = `<rect width="${w}" height="${h}" fill="#7A3B22"/>`;
    for (let y = 0, row = 0; y < h; y += 26, row++) {
      for (let x = row % 2 ? -40 : 0; x < w; x += 80) {
        const c = ["#9A4A2C", "#8C4127", "#A65535", "#7F3A22", "#B0623F"][Math.floor(r() * 5)];
        out += `<rect x="${x + 2}" y="${y + 2}" width="76" height="22" rx="2" fill="${c}" opacity="${0.75 + r() * 0.25}"/>`;
      }
    }
    return out;
  }
  const leaves = (x, y, len, seed, dir = 1) => {
    const r = rng(seed); let out = `<path d="M${x} ${y} C ${x + 10 * dir} ${y + len * 0.4} ${x - 10 * dir} ${y + len * 0.7} ${x + 6 * dir} ${y + len}" stroke="#3F5E33" stroke-width="2" fill="none"/>`;
    for (let i = 0; i < len / 14; i++) {
      const yy = y + i * 14, side = i % 2 ? 1 : -1;
      out += `<ellipse cx="${x + side * 9}" cy="${yy + 6}" rx="9" ry="5" transform="rotate(${side * 30} ${x + side * 9} ${yy + 6})" fill="${r() > 0.5 ? "#5C7F45" : "#4A6B39"}"/>`;
    }
    return out;
  };

  function hero() {
    const id = `h${++n}`;
    return svg("0 0 1600 1000", `<defs>
      <linearGradient id="${id}sun" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7B0" stop-opacity=".9"/><stop offset=".6" stop-color="#FFD58A" stop-opacity=".15"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}cup" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#F6E3C6"/><stop offset=".55" stop-color="#C8915A"/><stop offset="1" stop-color="#6B3A1C"/></radialGradient></defs>
      ${brick(1600, 1000, 11)}
      <rect x="1060" y="80" width="420" height="520" fill="#F5E6C8"/><rect x="1060" y="80" width="420" height="520" fill="#FFF6DD" opacity=".6"/>
      <path d="M1270 80 V600 M1060 340 H1480" stroke="#3A2416" stroke-width="14"/><rect x="1060" y="80" width="420" height="520" fill="none" stroke="#3A2416" stroke-width="18"/>
      <polygon points="1060,80 1480,80 900,1000 300,1000" fill="url(#${id}sun)"/>
      <path d="M0 120 H1600" stroke="#2B1A10" stroke-width="6"/>
      ${[200, 520, 820, 1550].map((x, i) => `<path d="M${x} 120 V ${180 + i * 12}" stroke="#2B1A10" stroke-width="2"/><path d="M${x - 34} ${200 + i * 12} q 34 -36 68 0 z" fill="#B45309"/>${leaves(x - 20, 210 + i * 12, 140 + i * 30, 3 + i, -1)}${leaves(x + 22, 210 + i * 12, 110 + i * 40, 9 + i)}`).join("")}
      <rect x="0" y="700" width="1600" height="300" fill="#4A2A17"/><rect x="0" y="690" width="1600" height="24" fill="#6B3E22"/>
      ${[...Array(12)].map((_, i) => `<path d="M0 ${740 + i * 22} H1600" stroke="#3E2313" stroke-width="2" opacity=".6"/>`).join("")}
      <ellipse cx="1150" cy="760" rx="210" ry="40" fill="#2A160B" opacity=".5"/>
      <path d="M980 640 Q 990 790 1050 800 H1250 Q 1310 790 1320 640 Z" fill="#F4EEE6"/>
      <path d="M1316 670 q 70 0 70 50 t -70 60" stroke="#F4EEE6" stroke-width="22" fill="none"/>
      <ellipse cx="1150" cy="640" rx="170" ry="40" fill="url(#${id}cup)"/>
      <path d="M1080 640 q 70 -40 140 0 q -70 30 -140 0 z" fill="#F7E9D4" opacity=".95"/>
      <path d="M1110 640 q 40 -22 80 0 q -40 16 -80 0 z" fill="#C8915A" opacity=".8"/><path d="M1130 640 q 20 -10 40 0" stroke="#F7E9D4" stroke-width="5" fill="none"/>
      <path d="M1150 330 C 1146 420 1158 520 1150 625" stroke="#F3E3C9" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>
      <g transform="rotate(-28 1200 300)">
        <path d="M1110 250 h 130 l 14 120 q -78 22 -158 0 z" fill="#C9CED3"/><path d="M1110 250 h 130 l 3 26 h -136 z" fill="#E5E8EB"/>
        <path d="M1104 268 l -46 -6 l 6 26 z" fill="#B5BBC1"/>
        <path d="M1254 280 q 48 6 44 52 q -4 30 -40 32" stroke="#AEB4BA" stroke-width="14" fill="none"/>
      </g>
      <path d="M1600 120 L 1380 200 Q 1320 230 1300 270 L 1340 330 Q 1420 300 1600 250 Z" fill="#2F4A3A"/>
      <path d="M1360 180 L 1500 140" stroke="#26402F" stroke-width="6"/>
      <ellipse cx="1300" cy="300" rx="46" ry="36" fill="#C98E62"/><path d="M1268 312 q -10 22 8 30 M1290 320 q -4 24 14 28" stroke="#A8714A" stroke-width="8" stroke-linecap="round" fill="none"/>
      ${[...Array(10)].map((_, i) => `<circle cx="${560 + i * 50}" cy="${790 + (i % 3) * 30}" r="9" fill="#6B3E22" opacity=".8"/>`).join("")}`, "Illustration of a barista pouring latte art in a sunlit brick cafe with hanging plants");
  }

  function latte(art = "#F7E9D4", base = "#B87A48", rim = "#F4EEE6", tint = null) {
    return `<ellipse cx="200" cy="270" rx="150" ry="150" fill="${rim}"/><circle cx="200" cy="255" r="130" fill="${rim}"/>
      <circle cx="200" cy="255" r="112" fill="${base}"/>${tint ? `<circle cx="200" cy="255" r="112" fill="${tint}" opacity=".45"/>` : ""}
      <path d="M200 175 c -52 18 -62 74 -8 112 c -46 -6 -60 26 -32 44 c 24 12 56 6 80 -12 c 44 -34 26 -110 -40 -144 z" fill="${art}"/>
      <path d="M200 190 c -24 26 -24 64 0 90 M180 230 c 14 6 30 6 44 0 M176 254 c 18 8 36 8 52 0" stroke="${base}" stroke-width="5" fill="none" opacity=".8"/>
      <path d="M346 250 q 52 4 50 44 q -2 36 -52 36" stroke="${rim}" stroke-width="22" fill="none"/>`;
  }
  const drinks = {
    lavender: () => `<rect width="400" height="500" fill="#E9E1F0"/><rect y="380" width="400" height="120" fill="#C8B6A6"/>${latte("#F6EEF8", "#A88AB8", "#FBF8F4", "#7C5C99")}
      ${[[60, 90], [330, 80], [80, 430], [320, 440]].map(([x, y], i) => `<path d="M${x} ${y} l ${6} -40" stroke="#5A7D4A" stroke-width="3"/>${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="${x + 1 + k * 1.2}" cy="${y - 8 - k * 7}" rx="5" ry="4" fill="#8E6BB3"/>`).join("")}`).join("")}`,
    flight: () => `<rect width="400" height="500" fill="#EADBC6"/><rect y="300" width="400" height="200" fill="#9A6B43"/><rect x="40" y="300" width="320" height="70" rx="10" fill="#6B4227"/>
      ${[[100, "#2A140A"], [200, "#3A1E0E"], [300, "#4A2814"]].map(([x, c]) => `<path d="M${x - 38} 160 h 76 l -8 150 h -60 z" fill="#FFFFFF" opacity=".55"/><path d="M${x - 33} 190 h 66 l -7 116 h -52 z" fill="${c}"/><ellipse cx="${x}" cy="190" rx="33" ry="6" fill="#7A4A26"/><rect x="${x - 30}" y="324" width="60" height="16" rx="3" fill="#F3E3C9"/>`).join("")}
      <text x="100" y="337" font-size="12" text-anchor="middle" fill="#3C1A0B" font-family="Inter, sans-serif">ETH</text><text x="200" y="337" font-size="12" text-anchor="middle" fill="#3C1A0B" font-family="Inter, sans-serif">COL</text><text x="300" y="337" font-size="12" text-anchor="middle" fill="#3C1A0B" font-family="Inter, sans-serif">GUA</text>`,
    matcha: () => `<rect width="400" height="500" fill="#E3ECDC"/><rect y="380" width="400" height="120" fill="#BFA98F"/>${latte("#EEF5E2", "#6E9C3E", "#FBF8F4")}
      ${[[90, 120, 0], [300, 110, 40], [120, 420, 80], [290, 430, 120], [215, 160, 20]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="7" transform="rotate(${r} ${x} ${y})" fill="#D9566E"/>`).join("")}`,
    drip: () => `<rect width="400" height="500" fill="#F1E6D6"/><rect y="360" width="400" height="140" fill="#8C5E3C"/>
      <path d="M110 190 h 180 v 150 a 40 40 0 0 1 -40 40 h -100 a 40 40 0 0 1 -40 -40 z" fill="#3F5560"/><path d="M110 190 h 180 v 30 h -180 z" fill="#4F6872"/>
      <ellipse cx="200" cy="192" rx="90" ry="14" fill="#1F0F07"/><path d="M290 230 q 50 0 50 45 q 0 45 -50 45" stroke="#3F5560" stroke-width="20" fill="none"/>
      <path d="M170 160 q -14 -24 0 -48 q 14 -24 0 -48 M220 160 q -14 -24 0 -48 q 14 -24 0 -48" stroke="#fff" stroke-width="5" fill="none" opacity=".55" stroke-linecap="round"/>`,
  };
  function drink(name, label) { return svg("0 0 400 500", drinks[name](), label); }

  function beans() {
    const r = rng(42); let b = "";
    for (let i = 0; i < 160; i++) {
      const x = 40 + r() * 720, y = 260 + r() * 300, a = r() * 180, green = x < 380 && r() > 0.25;
      const c = green ? ["#9DAA6E", "#8C9A5E", "#B3B97A"][i % 3] : ["#5B2E15", "#6D3819", "#4A2410"][i % 3];
      b += `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="${c}"/><path d="M${x - 10} ${y} q 10 -4 20 0" stroke="${green ? "#6E7A44" : "#2A1208"}" stroke-width="2" fill="none"/></g>`;
    }
    return svg("0 0 800 640", `<rect width="800" height="640" fill="#B07A4C"/>
      ${[...Array(10)].map((_, i) => `<path d="M0 ${i * 64 + 20} C 200 ${i * 64 + 6} 600 ${i * 64 + 40} 800 ${i * 64 + 20}" stroke="#9A673D" stroke-width="3" fill="none"/>`).join("")}
      <polygon points="800,0 520,0 0,640 300,640" fill="#FFE8B8" opacity=".18"/>
      <path d="M380 240 L380 600" stroke="#8C5A33" stroke-width="3" stroke-dasharray="6 10" opacity=".7"/>
      ${b}
      <path d="M560 40 q 60 60 30 170 q -40 40 -90 30 l -60 -90 q 40 -100 120 -110 z" fill="#C98E62"/><path d="M590 210 q -20 40 -70 50" stroke="#A56D45" stroke-width="16" stroke-linecap="round" fill="none"/>`, "Illustration of hands sorting green and roasted coffee beans on a wooden table in natural light");
  }

  function bag(label, color, roast) {
    return svg("0 0 400 400", `<rect width="400" height="400" fill="#F6EFE4"/><ellipse cx="200" cy="350" rx="120" ry="16" fill="#E2D6C4"/>
      <path d="M118 70 h 164 l 12 270 h -188 z" fill="#FFFFFF"/><path d="M118 70 h 164 l 2 34 h -168 z" fill="#ECE6DC"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${130 + i * 34} 70 v 34" stroke="#D9D2C6" stroke-width="2"/>`).join("")}
      <rect x="140" y="150" width="120" height="140" rx="4" fill="#C9A77C"/><rect x="146" y="156" width="108" height="128" rx="3" fill="none" stroke="#8B6A47" stroke-dasharray="3 4"/>
      <circle cx="200" cy="190" r="18" fill="${color}"/><path d="M193 190 q 7 -12 14 0 q -7 12 -14 0" fill="#F6EFE4"/>
      <text x="200" y="232" font-family="Georgia, serif" font-size="15" text-anchor="middle" fill="#3C1A0B">${label}</text>
      <text x="200" y="252" font-family="Inter, sans-serif" font-size="9" letter-spacing="2" text-anchor="middle" fill="#5A3A22">${roast.toUpperCase()}</text>
      <text x="200" y="272" font-family="Inter, sans-serif" font-size="9" text-anchor="middle" fill="#5A3A22">12 OZ · 340 G</text>`, `${label} coffee bag with kraft paper label`);
  }

  function map(seed, label) {
    const r = rng(seed); let roads = "";
    for (let i = 0; i < 6; i++) roads += `<path d="M0 ${20 + r() * 160} L400 ${20 + r() * 160}" stroke="#fff" stroke-width="${3 + r() * 5}"/>`;
    for (let i = 0; i < 6; i++) roads += `<path d="M${20 + r() * 360} 0 L${20 + r() * 360} 200" stroke="#fff" stroke-width="${3 + r() * 5}"/>`;
    const px = 140 + r() * 120, py = 70 + r() * 60;
    return svg("0 0 400 200", `<rect width="400" height="200" fill="#EFE7DA"/><path d="M${r() * 100} 200 C ${100 + r() * 100} 120 ${200 + r() * 60} 140 400 ${40 + r() * 60} L400 200 Z" fill="#CFE0D2"/>${roads}
      <rect x="${r() * 300}" y="${r() * 140}" width="70" height="40" rx="6" fill="#D6E6C3"/>
      <g transform="translate(${px} ${py})"><path d="M0 -26 c 14 0 22 10 22 20 c 0 16 -22 32 -22 32 s -22 -16 -22 -32 c 0 -10 8 -20 22 -20z" fill="#92400E"/><circle cy="-6" r="7" fill="#FFFBEB"/></g>`, label);
  }

  function stamps(filled = 3) {
    return svg("0 0 240 150", `<rect x="4" y="4" width="232" height="142" rx="14" fill="#FFFBEB" stroke="#92400E" stroke-width="2"/>
      <text x="20" y="34" font-family="'Playfair Display', Georgia, serif" font-size="16" fill="#3C1A0B">Ember Rewards</text>
      ${[...Array(10)].map((_, i) => { const x = 32 + (i % 5) * 44, y = 72 + Math.floor(i / 5) * 44; return `<circle cx="${x}" cy="${y}" r="16" fill="${i < filled ? "#92400E" : "none"}" stroke="#92400E" stroke-width="1.5" stroke-dasharray="${i < filled ? "0" : "3 3"}"/>${i < filled ? `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="#FFFBEB" transform="rotate(30 ${x} ${y})"/>` : ""}`; }).join("")}`, "Ember Rewards stamp card", "xMidYMid meet");
  }

  window.Art = { hero, drink, beans, bag, map, stamps };
})();
