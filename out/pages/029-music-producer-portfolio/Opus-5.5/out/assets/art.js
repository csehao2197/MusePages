// Original SVG artwork: abstract beat covers, discography covers, hero studio scene and portrait.
// No real album art, label logos or photography is used.
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const svg = (w, h, body, defs, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;

  // 6 abstract geometric styles for covers
  const STY = [
    (r, a, b, c) => { let o = `<rect width="400" height="400" fill="${a}"/>`; for (let i = 0; i < 9; i++) o += `<circle cx="200" cy="230" r="${190 - i * 20}" fill="none" stroke="${i % 2 ? b : c}" stroke-width="${6 + i}" opacity="${0.35 + i * 0.07}"/>`; return o + `<rect x="0" y="300" width="400" height="100" fill="${a}" opacity=".85"/><path d="M0 300 H400" stroke="${c}" stroke-width="3"/>`; },
    (r, a, b, c) => { let o = `<rect width="400" height="400" fill="${a}"/>`; for (let i = 0; i < 14; i++) o += `<rect x="${i * 30}" y="${400 - (60 + r() * 280)}" width="18" height="400" fill="${i % 3 ? b : c}" opacity="${0.5 + r() * 0.5}"/>`; return o; },
    (r, a, b, c) => `<rect width="400" height="400" fill="${a}"/><path d="M0 400 L200 60 L400 400Z" fill="${b}" opacity=".9"/><path d="M80 400 L200 180 L320 400Z" fill="${c}"/><circle cx="200" cy="120" r="34" fill="#fff" opacity=".9"/>`,
    (r, a, b, c) => { let o = `<rect width="400" height="400" fill="${a}"/>`; for (let i = 0; i < 6; i++) o += `<path d="M-20 ${120 + i * 40} C 100 ${60 + i * 40} 300 ${200 + i * 40} 420 ${110 + i * 40}" stroke="${i % 2 ? b : c}" stroke-width="10" fill="none" opacity=".85"/>`; return o; },
    (r, a, b, c) => { let o = `<rect width="400" height="400" fill="${a}"/>`; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (r() > 0.45) o += `<rect x="${x * 50 + 6}" y="${y * 50 + 6}" width="38" height="38" rx="6" fill="${r() > 0.5 ? b : c}" opacity="${0.4 + r() * 0.6}"/>`; return o; },
    (r, a, b, c) => `<rect width="400" height="400" fill="${a}"/><circle cx="150" cy="170" r="120" fill="${b}" opacity=".85"/><circle cx="260" cy="240" r="120" fill="${c}" opacity=".75" style="mix-blend-mode:screen"/><path d="M40 360 H360" stroke="#fff" stroke-width="2" opacity=".6"/>`,
  ];
  const PALS = [["#120B2E", "#8B5CF6", "#22D3EE"], ["#0B1220", "#F472B6", "#8B5CF6"], ["#1A0B0B", "#F59E0B", "#EF4444"], ["#04130F", "#10B981", "#A3E635"], ["#0F0F1A", "#60A5FA", "#C084FC"], ["#1B0F24", "#E879F9", "#FDE68A"], ["#0A0A0F", "#22D3EE", "#F43F5E"], ["#101820", "#FB923C", "#8B5CF6"]];
  function cover(i, title, label) {
    const r = rnd(i * 131 + 17), [a, b, c] = PALS[i % PALS.length], g = id("cg");
    const body = STY[i % STY.length](r, a, b, c) + `<rect width="400" height="400" fill="url(#${g})"/><text x="24" y="376" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="24" fill="#fff" letter-spacing="2" opacity=".9">${title.toUpperCase().replace(/&/g, "&amp;")}</text>`;
    return svg(400, 400, body, `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>`, label || `Abstract cover art for ${title}`);
  }

  function studio(w = 1600, h = 900) {
    const g = id("st"), glow = id("gl");
    let o = `<rect width="${w}" height="${h}" fill="url(#${g})"/><ellipse cx="${w * 0.5}" cy="${h * 0.42}" rx="${w * 0.34}" ry="${h * 0.3}" fill="url(#${glow})"/>`;
    // speakers + screens
    [[0.18, 0.22], [0.72, 0.22]].forEach(([fx, fy]) => { o += `<rect x="${w * fx}" y="${h * fy}" width="${w * 0.1}" height="${h * 0.26}" rx="10" fill="#121222"/><circle cx="${w * (fx + 0.05)}" cy="${h * (fy + 0.08)}" r="${h * 0.035}" fill="#1E1E36"/><circle cx="${w * (fx + 0.05)}" cy="${h * (fy + 0.18)}" r="${h * 0.055}" fill="#1E1E36"/>`; });
    o += `<rect x="${w * 0.34}" y="${h * 0.2}" width="${w * 0.32}" height="${h * 0.24}" rx="8" fill="#16162A" stroke="#2A2A4A" stroke-width="3"/>`;
    for (let i = 0; i < 40; i++) { const bh = 10 + Math.abs(Math.sin(i * 0.7)) * h * 0.12; o += `<rect x="${w * 0.355 + i * w * 0.0072}" y="${h * 0.32 - bh / 2}" width="${w * 0.004}" height="${bh}" fill="${i % 3 ? "#8B5CF6" : "#22D3EE"}" opacity=".85"/>`; }
    // console desk
    o += `<path d="M${w * 0.12} ${h * 0.66} L${w * 0.88} ${h * 0.66} L${w * 0.96} ${h * 0.82} L${w * 0.04} ${h * 0.82}Z" fill="#14142A"/>`;
    for (let i = 0; i < 32; i++) o += `<rect x="${w * 0.16 + i * w * 0.021}" y="${h * 0.68}" width="${w * 0.006}" height="${h * 0.08}" fill="#2A2A4A"/><rect x="${w * 0.155 + i * w * 0.021}" y="${h * (0.69 + ((i * 7) % 6) * 0.01)}" width="${w * 0.016}" height="${h * 0.012}" rx="2" fill="${i % 5 ? "#A1A1AA" : "#8B5CF6"}"/>`;
    // silhouette
    o += `<g fill="#05050A"><circle cx="${w * 0.5}" cy="${h * 0.5}" r="${h * 0.07}"/><path d="M${w * 0.42} ${h} Q ${w * 0.42} ${h * 0.6} ${w * 0.5} ${h * 0.59} Q ${w * 0.58} ${h * 0.6} ${w * 0.58} ${h}Z"/><path d="M${w * 0.455} ${h * 0.47} q ${w * 0.045} -${h * 0.11} ${w * 0.09} 0" stroke="#05050A" stroke-width="${h * 0.018}" fill="none"/><rect x="${w * 0.447}" y="${h * 0.465}" width="${w * 0.014}" height="${h * 0.05}" rx="6"/><rect x="${w * 0.539}" y="${h * 0.465}" width="${w * 0.014}" height="${h * 0.05}" rx="6"/></g>`;
    return svg(w, h, o, `<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A0A0F"/><stop offset="1" stop-color="#12081F"/></linearGradient><radialGradient id="${glow}"><stop offset="0" stop-color="#8B5CF6" stop-opacity=".35"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>`, "Silhouette of a producer at a mixing console, lit by purple studio light and a glowing waveform on screen");
  }

  function portrait() {
    const g = id("pt");
    let o = `<rect width="800" height="1000" fill="url(#${g})"/>`;
    for (let i = 0; i < 18; i++) o += `<rect x="${60 + i * 38}" y="${180 + ((i * 53) % 120)}" width="22" height="${80 + ((i * 37) % 160)}" rx="4" fill="#2A2440" opacity=".7"/>`;
    o += `<path d="M120 1000 Q 140 690 400 660 Q 660 690 680 1000Z" fill="#141018"/><rect x="360" y="560" width="80" height="120" fill="#5B4A55"/><ellipse cx="400" cy="470" rx="112" ry="128" fill="#6E5662"/><path d="M290 430 Q 300 330 400 330 Q 500 330 510 430 Q 470 380 400 384 Q 330 380 290 430Z" fill="#1A1420"/>`;
    o += `<path d="M300 450 q 100 -190 200 0" stroke="#0E0B14" stroke-width="22" fill="none"/><rect x="282" y="440" width="34" height="80" rx="14" fill="#0E0B14"/><rect x="484" y="440" width="34" height="80" rx="14" fill="#0E0B14"/>`;
    o += `<path d="M360 540 q 40 18 80 0" stroke="#3A2A33" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M0 860 H800 V1000 H0Z" fill="#0E0B14"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${40 + i * 52}" y="880" width="30" height="${30 + ((i * 29) % 60)}" rx="4" fill="${i % 4 ? "#3A3550" : "#8B5CF6"}"/>`).join("")}`;
    return svg(800, 1000, o, `<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1A1426"/><stop offset="1" stop-color="#0B0A12"/></linearGradient>`, "Moody portrait of KVOLT in headphones at a mixing console, with a purple tint");
  }

  window.Art = { cover, studio, portrait };
})();
