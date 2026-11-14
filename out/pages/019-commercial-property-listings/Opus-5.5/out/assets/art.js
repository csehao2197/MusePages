// Original SVG illustrations used in place of property photography (no licensed photos are bundled).
(function () {
  const rng = (s) => () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const svg = (vb, body, label) => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${body}</svg>`;
  let u = 0;
  const sky = (top, bot) => { const id = `sk${++u}`; return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect width="640" height="400" fill="url(#${id})"/>`; };
  const tree = (x, y, s = 1) => `<rect x="${x - 3 * s}" y="${y - 20 * s}" width="${6 * s}" height="${22 * s}" fill="#6B4E33"/><circle cx="${x}" cy="${y - 34 * s}" r="${20 * s}" fill="#3F7D4A"/><circle cx="${x + 10 * s}" cy="${y - 26 * s}" r="${14 * s}" fill="#4E9A5C"/>`;

  const exterior = {
    office: (q, c) => `${sky("#9CC9EA", "#E6F1F8")}
      <rect x="${200 + q() * 40}" y="40" width="200" height="320" fill="${c}"/>${[...Array(18)].map((_, r) => [...Array(8)].map((_, k) => `<rect x="${208 + k * 24 + q() * 2}" y="${50 + r * 17}" width="18" height="12" fill="#CFE6F5" opacity="${0.55 + q() * 0.4}"/>`).join("")).join("")}
      <rect x="${200}" y="30" width="200" height="14" fill="#334155"/><rect x="80" y="160" width="110" height="200" fill="#94A3B8"/>${[...Array(10)].map((_, r) => `<rect x="86" y="${168 + r * 19}" width="98" height="11" fill="#CBD5E1" opacity=".7"/>`).join("")}
      <rect x="430" y="120" width="130" height="240" fill="#64748B"/>${[...Array(12)].map((_, r) => `<rect x="436" y="${128 + r * 19}" width="118" height="10" fill="#BAD3E6" opacity=".7"/>`).join("")}
      <rect y="360" width="640" height="40" fill="#A3A3A3"/>${tree(60, 372)}${tree(590, 372, 1.2)}`,
    retail: (q, c) => `${sky("#F6C89F", "#FCE9D6")}<rect y="300" width="640" height="100" fill="#9CA3AF"/>${[...Array(6)].map((_, i) => `<rect x="${30 + i * 100}" y="330" width="60" height="6" fill="#fff"/>`).join("")}
      <rect x="60" y="150" width="520" height="150" fill="#F4EDE3"/><rect x="60" y="140" width="520" height="20" fill="${c}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${78 + i * 100}" y="190" width="82" height="110" fill="#334155" opacity=".85"/><rect x="${78 + i * 100}" y="176" width="82" height="12" fill="${["#F59E0B", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6"][i]}"/><rect x="${78 + i * 100}" y="190" width="82" height="110" fill="#FDE68A" opacity="${0.15 + q() * 0.2}"/>`).join("")}
      <rect x="520" y="230" width="90" height="70" fill="#7C9A6B"/>${[...Array(4)].map((_, i) => `<circle cx="${535 + i * 20}" cy="250" r="10" fill="#F4EDE3"/>`).join("")}${tree(30, 312)}${tree(612, 312, .9)}`,
    industrial: (q, c) => `${sky("#BFD7E8", "#EEF4F8")}<rect y="290" width="640" height="110" fill="#B6B6B0"/>
      <path d="M40 160 L 600 160 L 600 290 L 40 290 Z" fill="${c}"/><path d="M40 160 L 600 160 L 590 140 L 50 140 Z" fill="#94A3B8"/>${[...Array(26)].map((_, i) => `<path d="M${50 + i * 21} 160 V 290" stroke="#000" stroke-opacity=".06"/>`).join("")}
      ${[0, 1, 2, 3].map((i) => `<rect x="${120 + i * 110}" y="220" width="70" height="70" fill="#475569"/>${[...Array(6)].map((_, k) => `<path d="M${120 + i * 110} ${228 + k * 10} h 70" stroke="#334155"/>`).join("")}<rect x="${118 + i * 110}" y="214" width="74" height="6" fill="#F59E0B"/>`).join("")}
      <g transform="translate(470 296)"><rect width="120" height="44" fill="#E5E7EB"/><rect x="120" y="10" width="40" height="34" fill="#2563EB"/><circle cx="24" cy="48" r="10" fill="#1F2937"/><circle cx="140" cy="48" r="10" fill="#1F2937"/></g>
      <path d="M0 380 H640" stroke="#57534E" stroke-width="4"/>${[...Array(20)].map((_, i) => `<path d="M${i * 34} 374 v 12" stroke="#57534E" stroke-width="3"/>`).join("")}`,
    flex: (q, c) => `${sky("#A7D3E8", "#F1F7FA")}<rect y="300" width="640" height="100" fill="#A8A29E"/><rect x="70" y="170" width="500" height="130" fill="${c}"/><rect x="70" y="160" width="500" height="12" fill="#475569"/>
      ${[...Array(6)].map((_, i) => `<rect x="${86 + i * 80}" y="190" width="60" height="50" fill="#BFDBFE" opacity=".8"/><rect x="${86 + i * 80}" y="250" width="60" height="50" fill="${i % 2 ? "#64748B" : "#BFDBFE"}" opacity=".85"/>`).join("")}${tree(40, 312)}${tree(600, 312)}`,
    land: (q) => `${sky("#9FD3F0", "#EAF6FB")}<path d="M0 220 Q 160 190 320 210 T 640 200 V 400 H0 Z" fill="#C8B98A"/><path d="M0 260 Q 200 240 400 262 T 640 250 V 400 H0 Z" fill="#B3A473"/>
      <path d="M80 300 L 560 300 L 600 380 L 40 380 Z" fill="none" stroke="#2563EB" stroke-width="4" stroke-dasharray="12 8"/>${[[100, 300], [560, 300], [600, 380], [40, 380]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#2563EB"/>`).join("")}
      <rect x="290" y="300" width="60" height="40" fill="#fff"/><text x="320" y="326" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#1E3A5F">LOT</text>${tree(30, 230, .8)}${tree(610, 226, .9)}`,
    mixed: (q, c) => `${sky("#C7D2FE", "#EEF2FF")}<rect y="340" width="640" height="60" fill="#9CA3AF"/>
      <rect x="140" y="70" width="360" height="270" fill="${c}"/>${[...Array(9)].map((_, r) => [...Array(9)].map((_, k) => `<rect x="${152 + k * 38}" y="${80 + r * 24}" width="28" height="16" fill="#E0E7FF" opacity="${0.6 + q() * 0.35}"/>`).join("")).join("")}<rect x="140" y="292" width="360" height="48" fill="#1E293B"/>${[0, 1, 2, 3].map((i) => `<rect x="${152 + i * 88}" y="300" width="76" height="40" fill="#FCD34D" opacity=".55"/>`).join("")}
      ${[...Array(9)].map((_, i) => `<path d="M${152 + i * 38} 250 h 28" stroke="#fff" stroke-width="3"/>`).join("")}${tree(100, 352)}${tree(540, 352)}`,
  };
  const interior = (q, type) => type === "industrial"
    ? `<rect width="640" height="400" fill="#D6D3D1"/><path d="M0 0 H640 L 560 120 H 80 Z" fill="#A8A29E"/>${[...Array(8)].map((_, i) => `<path d="M${80 + i * 68} 120 V 400" stroke="#78716C" stroke-width="5"/>`).join("")}${[...Array(4)].map((_, i) => `<rect x="${120 + i * 120}" y="200" width="80" height="140" fill="#B45309" opacity=".8"/>${[...Array(4)].map((_, k) => `<rect x="${124 + i * 120}" y="${206 + k * 34}" width="72" height="28" fill="#D97706"/>`).join("")}`).join("")}<rect y="360" width="640" height="40" fill="#A3A3A3"/>`
    : type === "retail"
      ? `<rect width="640" height="400" fill="#F5F0E8"/><rect y="300" width="640" height="100" fill="#D6C7B0"/>${[...Array(5)].map((_, i) => `<rect x="${40 + i * 120}" y="140" width="90" height="160" fill="#fff" stroke="#E7E5E4"/>${[0, 1, 2].map((k) => `<rect x="${50 + i * 120}" y="${155 + k * 48}" width="70" height="36" fill="${["#FCA5A5", "#93C5FD", "#86EFAC", "#FCD34D"][(i + k) % 4]}"/>`).join("")}`).join("")}${[...Array(5)].map((_, i) => `<circle cx="${80 + i * 120}" cy="60" r="18" fill="#FDE68A"/>`).join("")}`
      : `<rect width="640" height="400" fill="#F1F5F9"/><rect x="0" y="0" width="640" height="250" fill="#DBEAFE"/>${[...Array(5)].map((_, i) => `<path d="M${i * 160} 0 V 250" stroke="#94A3B8" stroke-width="6"/>`).join("")}${[...Array(6)].map((_, i) => `<rect x="${i * 110} " y="${120 + (i % 3) * 30}" width="80" height="130" fill="#94A3B8" opacity=".55"/>`).join("")}
        <rect y="250" width="640" height="150" fill="#E2E8F0"/>${[0, 1, 2].map((i) => `<rect x="${60 + i * 200}" y="290" width="160" height="14" rx="4" fill="#1E3A5F"/><rect x="${70 + i * 200}" y="304" width="8" height="60" fill="#334155"/><rect x="${202 + i * 200}" y="304" width="8" height="60" fill="#334155"/>${[0, 1].map((k) => `<rect x="${80 + i * 200 + k * 80}" y="270" width="36" height="20" rx="6" fill="#64748B"/>`).join("")}`).join("")}`;
  const aerial = (q, type) => `<rect width="640" height="400" fill="#C7D2C0"/>${[...Array(5)].map((_, i) => `<path d="M0 ${60 + i * 80} H640" stroke="#E5E7EB" stroke-width="${i === 2 ? 26 : 10}"/>`).join("")}${[...Array(6)].map((_, i) => `<path d="M${50 + i * 110} 0 V400" stroke="#E5E7EB" stroke-width="10"/>`).join("")}
    <rect x="230" y="120" width="${type === "industrial" ? 240 : 150}" height="${type === "industrial" ? 150 : 140}" fill="#475569"/><rect x="230" y="120" width="${type === "industrial" ? 240 : 150}" height="${type === "industrial" ? 150 : 140}" fill="none" stroke="#2563EB" stroke-width="5"/>${[...Array(14)].map((_, i) => `<rect x="${80 + (i % 7) * 20}" y="${290 + Math.floor(i / 7) * 34}" width="14" height="26" fill="${["#EF4444", "#3B82F6", "#E5E7EB", "#1F2937"][i % 4]}"/>`).join("")}${tree(560, 120)}${tree(600, 340)}`;

  const palettes = { office: ["#3B5F86", "#2D4A6B", "#4A6F95"], retail: ["#B45309", "#0F766E", "#7C2D12"], industrial: ["#9CA3AF", "#A8A29E", "#94A3B8"], flex: ["#CBD5E1", "#D6D3D1", "#E2E8F0"], land: ["#000"], mixed: ["#64748B", "#475569", "#334155"] };
  function photo(type, seed, view, label) {
    const q = rng(seed * 7 + 3);
    const c = palettes[type][seed % palettes[type].length];
    const body = view === 0 ? exterior[type](q, c) : view === 1 ? (type === "land" ? exterior.land(q) : interior(q, type)) : aerial(q, type);
    return svg("0 0 640 400", body, label);
  }

  function broker(name, hue) {
    const q = rng(name.length * 13);
    const hair = ["#2A1A10", "#4A3020", "#1A1A1A", "#8A5A2A"][Math.floor(q() * 4)], skin = ["#E0B28E", "#C9906C", "#8D5A3E", "#F1C9A5"][Math.floor(q() * 4)];
    return `<svg viewBox="0 0 80 80" role="img" aria-label="${name}"><rect width="80" height="80" fill="${hue}"/><path d="M14 80 Q 16 56 40 54 Q 64 56 66 80 Z" fill="#1E3A5F"/><path d="M32 56 L 40 66 L 48 56" fill="#fff"/><circle cx="40" cy="36" r="15" fill="${skin}"/><path d="M25 34 Q 26 18 40 18 Q 55 18 55 34 Q 48 26 40 26 Q 31 26 25 34 Z" fill="${hair}"/></svg>`;
  }

  window.Art = { photo, broker };
})();
