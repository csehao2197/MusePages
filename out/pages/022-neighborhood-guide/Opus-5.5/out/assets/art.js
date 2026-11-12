// Original SVG illustrations used in place of aerial and street photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  const tree = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.5}" fill="#fff" opacity=".12"/>`;

  function aerial(seed = 4) {
    const q = rng(seed);
    let o = `<rect width="1600" height="900" fill="#7FA36B"/>`;
    for (let i = 0; i < 9; i++) o += `<path d="M${-100 + i * 220} 0 C ${i * 220 + 40} 300 ${i * 220 - 60} 600 ${i * 220 + 30} 900" stroke="#D9D6CE" stroke-width="${i % 3 ? 16 : 30}" fill="none"/>`;
    for (let i = 0; i < 6; i++) o += `<path d="M0 ${80 + i * 160} C 400 ${60 + i * 160} 1000 ${110 + i * 160} 1600 ${70 + i * 160}" stroke="#D9D6CE" stroke-width="16" fill="none"/>`;
    for (let i = 0; i < 160; i++) {
      const x = q() * 1600, y = q() * 900, w = 34 + q() * 20, h = 26 + q() * 16, rot = -10 + q() * 20;
      o += `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${["#C2410C", "#7C2D12", "#475569", "#94A3B8", "#B45309"][Math.floor(q() * 5)]}"/><path d="M${x} ${y + h / 2} H${x + w}" stroke="#000" stroke-opacity=".2"/></g>`;
      if (q() > 0.6) o += `<rect x="${x + 4}" y="${y + h + 6}" width="${w * 0.6}" height="${h * 0.5}" rx="4" fill="#38BDF8" opacity=".85"/>`;
    }
    for (let i = 0; i < 220; i++) o += tree(q() * 1600, q() * 900, 10 + q() * 16, ["#3F6B3A", "#4E7A3A", "#5E8A4A", "#2F5A33"][Math.floor(q() * 4)]);
    o += `<ellipse cx="1180" cy="460" rx="180" ry="110" fill="#5E8A4A"/><ellipse cx="1180" cy="460" rx="70" ry="40" fill="#38BDF8" opacity=".8"/>`;
    return svg("0 0 1600 900", o, "Aerial illustration of a leafy suburban neighborhood with homes, pools, parks and curving streets");
  }

  function street(seed, palette) {
    const q = rng(seed * 13 + 1), [sky, house1, house2, accent] = palette;
    let o = `<rect width="600" height="400" fill="${sky}"/><rect y="290" width="600" height="110" fill="#9CA3AF"/><rect y="282" width="600" height="12" fill="#D1D5DB"/><path d="M0 345 H600" stroke="#F8FAFC" stroke-width="4" stroke-dasharray="26 18"/>`;
    for (let i = 0; i < 4; i++) {
      const x = 10 + i * 150, h = 90 + q() * 50, c = i % 2 ? house1 : house2;
      o += `<rect x="${x}" y="${282 - h}" width="120" height="${h}" fill="${c}"/><path d="M${x - 8} ${282 - h} L ${x + 60} ${222 - h} L ${x + 128} ${282 - h} Z" fill="${accent}"/><rect x="${x + 48}" y="${242}" width="24" height="40" fill="#374151"/>${[0, 1].map((k) => `<rect x="${x + 16 + k * 66}" y="${282 - h + 18}" width="22" height="22" fill="#FEF3C7"/>`).join("")}`;
    }
    for (let i = 0; i < 5; i++) o += `<rect x="${60 + i * 130}" y="230" width="8" height="58" fill="#6B4E33"/>${tree(64 + i * 130, 212, 36 + q() * 10, ["#3F7D4A", "#4E9A5C", "#2F6B45"][i % 3])}`;
    return o;
  }
  const palettes = [["#BAE6FD", "#F5F0E6", "#E7D8C3", "#7C2D12"], ["#FDE68A", "#E0E7FF", "#F1F5F9", "#334155"], ["#C7D2FE", "#FCE7F3", "#F5F5F4", "#9F1239"], ["#A7F3D0", "#FEF3C7", "#E2E8F0", "#065F46"], ["#FBCFE8", "#F1F5F9", "#E5E7EB", "#1E3A5F"], ["#BFDBFE", "#FFF7ED", "#E7E5E4", "#B45309"]];
  function card(i, label) { return svg("0 0 600 400", street(i + 2, palettes[i % palettes.length]), label); }

  function agent() {
    return svg("0 0 160 160", `<rect width="160" height="160" fill="#CCFBF1"/><path d="M24 160 Q 28 110 80 104 Q 132 110 136 160 Z" fill="#1E3A5F"/><path d="M66 106 L 80 126 L 94 106" fill="#fff"/><rect x="70" y="82" width="20" height="28" fill="#8D5A3E"/><circle cx="80" cy="66" r="28" fill="#A86E4C"/><path d="M52 64 Q 50 34 80 34 Q 110 34 108 64 Q 98 48 80 48 Q 62 48 52 64 Z" fill="#1A1A1A"/><path d="M70 78 q 10 7 20 0" stroke="#5A3420" stroke-width="3" fill="none" stroke-linecap="round"/>`, "Portrait of neighborhood specialist Marcus Bell");
  }

  window.Art = { aerial, card, agent };
})();
