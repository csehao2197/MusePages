// Illustrated SVG scenes used in place of photography (no licensed photos bundled).
(function () {
  const hiker = (x, y, s, c, pack) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><circle cx="0" cy="-58" r="9"/><path d="M-8 -48 h16 l4 30 h-6 l-2 -10 -2 10 -2 34 h-7 l1 -34 -3 0 -4 34 h-7 l4 -36 z"/>${pack ? `<rect x="-17" y="-46" width="11" height="20" rx="3"/>` : ""}<path d="M9 -40 l12 18 v28" stroke="${c}" stroke-width="2.5" fill="none"/></g>`;
  const S = {
    hero: () => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a group of friends hiking along a ridge with mountains behind">
      <defs><linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2D5C"/><stop offset=".45" stop-color="#C2553A"/><stop offset=".72" stop-color="#F59E52"/><stop offset="1" stop-color="#FCD9A0"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#hs)"/><circle cx="1130" cy="470" r="90" fill="#FFE8B8" opacity=".85"/>
      <path d="M0 560 L180 400 L320 500 L520 300 L700 470 L880 330 L1080 520 L1260 380 L1420 470 L1600 360 V900 H0Z" fill="#7A4A6B" opacity=".75"/>
      <path d="M500 312 L520 300 L545 322 Z M860 345 L880 330 L900 350Z M1240 392 L1260 380 L1282 398Z" fill="#FFE4E6" opacity=".8"/>
      <path d="M0 640 L240 520 L460 610 L700 500 L960 600 L1200 520 L1600 610 V900 H0Z" fill="#4A2F55"/>
      <path d="M0 760 Q400 640 820 690 T1600 700 V900 H0Z" fill="#241A33"/>
      ${[[560, 700, 1.25, 1], [640, 694, 1.15, 0], [705, 690, 1.3, 1], [790, 688, 1.2, 1], [860, 690, 1.12, 0], [930, 694, 1.22, 1]].map(([x, y, s, p]) => hiker(x, y, s, "#120E1C", p)).join("")}</svg>`,
    terraces: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="#E6F2D0"/>${Array.from({ length: 9 }, (_, i) => `<path d="M-20 ${90 + i * 38} Q300 ${40 + i * 40} 620 ${100 + i * 36} V400 H-20Z" fill="${["#9BC46B", "#86B356", "#73A447", "#5F9139", "#4E7F2E"][i % 5]}" stroke="#D9EBB8" stroke-width="3"/>`).join("")}<circle cx="480" cy="70" r="30" fill="#FFF3C4"/></svg>`,
    aurora: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="#0B1530"/>${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 97) % 600}" cy="${(i * 41) % 220}" r="1.2" fill="#fff"/>`).join("")}
      <path d="M-20 160 Q120 40 260 140 T600 90" stroke="#34D399" stroke-width="50" fill="none" opacity=".45"/><path d="M-20 200 Q160 100 320 180 T620 140" stroke="#A7F3D0" stroke-width="18" fill="none" opacity=".5"/>
      <path d="M0 320 L140 250 L250 300 L380 230 L600 310 V400 H0Z" fill="#1E293B"/><path d="M0 350 Q300 320 600 350 V400 H0Z" fill="#E2E8F0"/></svg>`,
    zipline: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="#BFE3D0"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 55}" cy="${300 + (i % 3) * 20}" r="${60 + (i % 4) * 12}" fill="${i % 2 ? "#2F7A4E" : "#24633F"}"/>`).join("")}
      <line x1="0" y1="80" x2="600" y2="190" stroke="#3F3F46" stroke-width="3"/><g transform="translate(330 136)"><line x1="0" y1="0" x2="0" y2="34" stroke="#3F3F46" stroke-width="3"/><circle cx="0" cy="44" r="10" fill="#E85D04"/><path d="M-10 54 h20 l6 34 h-32z" fill="#1A1A2E"/></g></svg>`,
    desert: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A5C"/><stop offset=".6" stop-color="#E07A4F"/><stop offset="1" stop-color="#F6B66E"/></linearGradient></defs><rect width="600" height="400" fill="url(#dg)"/>
      <path d="M0 270 Q150 210 300 260 T600 240 V400 H0Z" fill="#D9874A"/><path d="M0 310 Q200 270 600 300 V400 H0Z" fill="#B96A33"/>
      ${[160, 260, 360].map((x, i) => `<path d="M${x - 40} 320 L${x} ${270 + i * 4} L${x + 40} 320Z" fill="#F3E3C8" stroke="#8A5A2B" stroke-width="2"/><path d="M${x - 8} 320 L${x} 300 L${x + 8} 320Z" fill="#FCD34D"/>`).join("")}<circle cx="300" cy="330" r="10" fill="#F97316"/></svg>`,
    cliff: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="#BAE6FD"/><rect y="200" width="600" height="200" fill="#38BDF8"/>
      <path d="M380 0 Q420 120 400 220 Q440 300 600 320 V0Z" fill="#D97706"/><path d="M420 0 Q450 120 440 200" stroke="#B45309" stroke-width="6" fill="none"/>
      <path d="M0 330 Q200 300 420 320 L600 340 V400 H0Z" fill="#FDE68A"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${i * 70} ${250 + i * 8} q20 -8 40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`).join("")}
      <rect x="120" y="300" width="22" height="10" rx="2" fill="#E85D04"/><path d="M110 300 L131 270 L152 300" fill="#FB923C"/></svg>`,
    torii: () => `<svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><rect width="600" height="400" fill="#F5E6D3"/>${Array.from({ length: 7 }, (_, i) => { const s = 1 - i * 0.12, w = 420 * s, x = 300 - w / 2, y = 60 + i * 26; return `<g fill="#D9480F" opacity="${1 - i * 0.08}"><rect x="${x}" y="${y}" width="${w}" height="${18 * s}"/><rect x="${x + 30 * s}" y="${y + 30 * s}" width="${w - 60 * s}" height="${10 * s}"/><rect x="${x + 50 * s}" y="${y}" width="${16 * s}" height="${340 - y}"/><rect x="${x + w - 66 * s}" y="${y}" width="${16 * s}" height="${340 - y}"/></g>`; }).reverse().join("")}<rect y="340" width="600" height="60" fill="#A8A29E"/></svg>`,
  };
  window.__renderScenes = (root) => root.querySelectorAll("[data-scene]").forEach((el) => {
    if (S[el.dataset.scene] && !el.firstElementChild) el.innerHTML = S[el.dataset.scene]();
  });
  window.__renderScenes(document);
})();
