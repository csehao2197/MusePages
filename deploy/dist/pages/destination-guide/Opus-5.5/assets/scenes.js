// Illustrated SVG scenes used in place of photography (no licensed photos bundled).
(function () {
  const skyline = (y, color, seed, win) => {
    let x = 0, s = seed, out = "";
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    while (x < 1600) {
      const w = 30 + rnd() * 70, h = 60 + rnd() * 220;
      out += `<rect x="${x.toFixed(0)}" y="${(y - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${color}"/>`;
      if (win) for (let wy = y - h + 12; wy < y - 10; wy += 14) for (let wx = x + 6; wx < x + w - 6; wx += 11)
        if (rnd() > 0.62) out += `<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" fill="${rnd() > 0.85 ? "#F472B6" : rnd() > 0.5 ? "#FDE68A" : "#5EEAD4"}" opacity="${(0.5 + rnd() * 0.5).toFixed(2)}"/>`;
      x += w + 2;
    }
    return out;
  };
  const scenes = {
    hero: () => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of the Tokyo skyline at dusk with Mount Fuji behind">
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1B4B"/><stop offset=".3" stop-color="#5B3A8C"/><stop offset=".5" stop-color="#C2410C"/><stop offset=".64" stop-color="#F59E0B"/><stop offset="1" stop-color="#FDE68A"/></linearGradient>
      <linearGradient id="fuji" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0E7FF"/><stop offset=".22" stop-color="#C7D2FE"/><stop offset=".23" stop-color="#6D5A9C"/><stop offset="1" stop-color="#4C3D74"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#sky)"/>
      <circle cx="1220" cy="560" r="64" fill="#FEF3C7" opacity=".8"/>
      <path d="M420 700 L860 290 Q880 272 900 290 L1360 700 Z" fill="url(#fuji)"/>
      <g opacity=".8">${skyline(740, "#4A2E52", 7, false)}</g>
      <g>${skyline(800, "#111827", 19, true)}</g>
      <path d="M1020 800 L1032 360 L1044 800 Z" fill="#0B1220"/><rect x="1024" y="470" width="16" height="10" fill="#5EEAD4" opacity=".9"/>
      <rect y="800" width="1600" height="100" fill="#0B1220"/>
      <g opacity=".7">${Array.from({ length: 40 }, (_, i) => `<rect x="${i * 41}" y="${812 + (i % 3) * 18}" width="22" height="3" fill="${i % 4 ? "#FDE68A" : "#F472B6"}"/>`).join("")}</g></svg>`,
    temple: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#FDE7D7"/><circle cx="310" cy="70" r="34" fill="#FB923C" opacity=".6"/>
      <g fill="#B91C1C"><rect x="185" y="70" width="30" height="150"/>${[0, 1, 2, 3].map((i) => `<path d="M${130 + i * 10} ${80 + i * 38} h${140 - i * 20} l-14 14 h${-(112 - i * 20)} z" fill="#1F2937"/>`).join("")}</g>
      <rect x="60" y="150" width="70" height="70" fill="#DC2626"/><path d="M45 150 h100 l-12-16 h-76z" fill="#1F2937"/><ellipse cx="95" cy="185" rx="18" ry="24" fill="#FBBF24"/>
      <rect y="220" width="400" height="40" fill="#78716C"/></svg>`,
    crossing: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#1F2937"/>${skyline(120, "#374151", 3, true)}
      <rect y="120" width="400" height="140" fill="#4B5563"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${20 + i * 42}" y="150" width="24" height="90" fill="#F9FAFB" opacity=".85" transform="skewX(-12)"/>`).join("")}
      ${Array.from({ length: 46 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${150 + ((i * 31) % 90)}" r="4" fill="${["#F59E0B", "#0D9488", "#F472B6", "#E5E7EB"][i % 4]}"/>`).join("")}</svg>`,
    market: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#7C2D12"/><rect y="150" width="400" height="110" fill="#44403C"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${i * 100 + 8}" y="70" width="84" height="80" fill="#FFF7ED"/><path d="M${i * 100} 70 h100 l-8-22 h-84z" fill="${i % 2 ? "#0D9488" : "#B91C1C"}"/>`).join("")}
      ${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${30 + i * 57}" cy="34" rx="14" ry="18" fill="#F97316"/><rect x="${24 + i * 57}" y="14" width="12" height="5" fill="#1C1917"/>`).join("")}
      ${Array.from({ length: 8 }, (_, i) => `<rect x="${20 + i * 48}" y="170" width="32" height="14" rx="6" fill="${i % 2 ? "#FDE68A" : "#FCA5A5"}"/>`).join("")}</svg>`,
    shrine: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#DCFCE7"/>${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${i * 32}" cy="${60 + (i % 3) * 10}" rx="44" ry="70" fill="${i % 2 ? "#15803D" : "#166534"}"/>`).join("")}
      <rect y="200" width="400" height="60" fill="#D6D3D1"/><g fill="#9A3412"><rect x="130" y="80" width="14" height="130"/><rect x="256" y="80" width="14" height="130"/><rect x="104" y="72" width="192" height="14" rx="4"/><rect x="118" y="100" width="164" height="9"/></g></svg>`,
    lights: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#0F172A"/>${Array.from({ length: 160 }, (_, i) => `<circle cx="${(i * 37) % 400}" cy="${(i * 53) % 230}" r="${1 + (i % 5)}" fill="${["#22D3EE", "#A78BFA", "#F472B6", "#FDE68A"][i % 4]}" opacity="${0.35 + (i % 4) * 0.18}"/>`).join("")}
      <path d="M0 230 Q200 190 400 230 V260 H0z" fill="#1E293B"/><rect x="190" y="180" width="8" height="40" fill="#0B1220"/><circle cx="194" cy="174" r="7" fill="#0B1220"/></svg>`,
    neon: () => `<svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="260" fill="#18181B"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 82 + 6}" y="20" width="70" height="200" fill="#27272A"/>
      <rect x="${i * 82 + 16}" y="${36 + (i % 2) * 30}" width="18" height="120" rx="3" fill="none" stroke="${["#F472B6", "#22D3EE", "#FACC15", "#A3E635", "#FB7185"][i]}" stroke-width="4"/>
      <rect x="${i * 82 + 42}" y="${60 + (i % 3) * 20}" width="26" height="16" rx="3" fill="${["#22D3EE", "#F472B6", "#A78BFA", "#FB923C", "#5EEAD4"][i]}" opacity=".8"/>`).join("")}<rect y="220" width="400" height="40" fill="#3F3F46"/></svg>`,
    night: () => `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="240" fill="#1E1B4B"/>${skyline(240, "#0F172A", 41, true)}</svg>`,
    street: () => `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="240" fill="#FCE7F3"/>${skyline(190, "#831843", 11, true)}<rect y="190" width="400" height="50" fill="#52525B"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 34 + 6}" y="${200 + (i % 2) * 14}" width="18" height="5" fill="#F9FAFB"/>`).join("")}</svg>`,
    old: () => `<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="240" fill="#FEF3C7"/>${[0, 1, 2, 3].map((i) => `<rect x="${i * 100 + 6}" y="90" width="88" height="110" fill="#78350F"/><path d="M${i * 100 - 4} 92 L${i * 100 + 50} 60 L${i * 100 + 104} 92z" fill="#292524"/><ellipse cx="${i * 100 + 50}" cy="130" rx="10" ry="14" fill="#DC2626"/>`).join("")}<rect y="200" width="400" height="40" fill="#A8A29E"/></svg>`,
    collage1: () => `<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="380" fill="#FBCFE8"/>${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 47) % 300}" cy="${(i * 29) % 220}" r="${8 + (i % 4) * 4}" fill="${i % 2 ? "#F9A8D4" : "#FDF2F8"}"/>`).join("")}<path d="M0 260 Q150 220 300 260 V380 H0z" fill="#9D174D"/><path d="M150 380 L150 230" stroke="#3F1D2B" stroke-width="10"/></svg>`,
    collage2: () => `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="220" fill="#FFFBEB"/><ellipse cx="150" cy="150" rx="120" ry="44" fill="#1F2937"/><ellipse cx="150" cy="140" rx="104" ry="34" fill="#FDE68A"/>${[0, 1, 2, 3].map((i) => `<path d="M${80 + i * 30} 130 q15 -40 30 0" stroke="#FFF" stroke-width="5" fill="none"/>`).join("")}<rect x="170" y="40" width="6" height="110" fill="#78350F" transform="rotate(20 170 40)"/><rect x="186" y="40" width="6" height="110" fill="#78350F" transform="rotate(26 186 40)"/></svg>`,
  };
  window.__renderScenes = (root) => root.querySelectorAll("[data-scene]").forEach((el) => {
    const fn = scenes[el.dataset.scene];
    if (fn && !el.firstElementChild) el.innerHTML = fn();
  });
  window.__renderScenes(document);
})();
