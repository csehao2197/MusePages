// Procedural SVG "photos" used in place of real hotel photography (no licensed photos bundled).
(function () {
  const H = (h, s, l) => `hsl(${h} ${s}% ${l}%)`;
  const kinds = {
    tower: (h) => `<rect width="400" height="260" fill="${H(h, 45, 82)}"/><circle cx="320" cy="60" r="26" fill="${H(40, 90, 85)}"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${20 + i * 64}" y="${140 - (i % 3) * 30}" width="50" height="${120 + (i % 3) * 30}" fill="${H(h, 20, 40 + i * 3)}"/>`).join("")}
      <rect x="150" y="30" width="90" height="230" fill="${H(h, 25, 28)}"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${160 + (i % 5) * 16}" y="${44 + Math.floor(i / 5) * 34}" width="10" height="18" fill="${H(45, 90, 75)}" opacity=".85"/>`).join("")}`,
    room: (h) => `<rect width="400" height="260" fill="${H(h, 18, 88)}"/><rect x="0" y="0" width="400" height="150" fill="${H(h, 20, 80)}"/><rect x="230" y="30" width="140" height="100" fill="${H(205, 60, 70)}" stroke="#fff" stroke-width="6"/>
      <path d="M232 110 l30 -40 25 30 30 -45 50 55z" fill="${H(205, 30, 55)}"/><rect x="40" y="140" width="220" height="70" rx="6" fill="#fff"/><rect x="40" y="128" width="220" height="22" rx="6" fill="${H(h, 30, 55)}"/>
      <rect x="54" y="150" width="70" height="26" rx="8" fill="${H(h, 10, 94)}"/><rect x="134" y="150" width="70" height="26" rx="8" fill="${H(h, 10, 94)}"/><rect y="210" width="400" height="50" fill="${H(30, 25, 55)}"/><rect x="290" y="150" width="40" height="60" fill="${H(30, 30, 45)}"/><circle cx="310" cy="140" r="12" fill="${H(45, 90, 75)}"/>`,
    pool: (h) => `<rect width="400" height="260" fill="${H(h, 30, 20)}"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 52}" y="20" width="44" height="120" fill="${H(210, 40, 35 + (i % 2) * 6)}"/>`).join("")}
      <rect y="140" width="400" height="120" fill="${H(190, 70, 45)}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${i * 70} ${170 + (i % 3) * 25} q25 -8 50 0" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>`).join("")}<rect y="134" width="400" height="8" fill="${H(30, 20, 80)}"/>`,
    lobby: (h) => `<rect width="400" height="260" fill="${H(h, 25, 30)}"/><rect y="190" width="400" height="70" fill="${H(30, 30, 45)}"/>${[60, 200, 340].map((x) => `<rect x="${x - 6}" y="0" width="12" height="190" fill="${H(40, 40, 60)}"/><circle cx="${x}" cy="60" r="22" fill="${H(45, 90, 70)}" opacity=".8"/>`).join("")}
      <rect x="110" y="150" width="180" height="40" rx="6" fill="${H(h, 35, 55)}"/><rect x="120" y="138" width="160" height="16" rx="6" fill="${H(h, 35, 62)}"/>`,
    tatami: (h) => `<rect width="400" height="260" fill="${H(45, 40, 80)}"/>${Array.from({ length: 4 }, (_, i) => `<rect x="${i * 100}" y="150" width="100" height="110" fill="${H(70, 30, 62 + (i % 2) * 6)}" stroke="${H(30, 40, 30)}" stroke-width="3"/>`).join("")}
      <rect x="40" y="20" width="320" height="120" fill="${H(40, 30, 92)}" stroke="${H(30, 40, 30)}" stroke-width="5"/>${[0, 1, 2, 3].map((i) => `<line x1="${40 + i * 80}" y1="20" x2="${40 + i * 80}" y2="140" stroke="${H(30, 40, 30)}" stroke-width="3"/>`).join("")}<rect x="160" y="180" width="80" height="34" rx="4" fill="${H(20, 40, 30)}"/><circle cx="200" cy="80" r="26" fill="${H(140, 30, 45)}" opacity=".6"/>`,
    capsule: (h) => `<rect width="400" height="260" fill="${H(220, 15, 18)}"/>${[0, 1].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${20 + c * 95}" y="${20 + r * 115}" width="85" height="100" rx="14" fill="${H(220, 10, 92)}"/><rect x="${32 + c * 95}" y="${34 + r * 115}" width="61" height="72" rx="10" fill="${H(h, 50, 30)}"/><circle cx="${62 + c * 95}" cy="${50 + r * 115}" r="5" fill="${H(45, 90, 70)}"/>`).join("")).join("")}`,
    bath: (h) => `<rect width="400" height="260" fill="${H(30, 25, 30)}"/><ellipse cx="200" cy="190" rx="170" ry="54" fill="${H(30, 20, 55)}"/><ellipse cx="200" cy="186" rx="150" ry="42" fill="${H(185, 50, 55)}"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${120 + i * 40} 170 q-14 -40 6 -80 q14 -30 -4 -60" stroke="#fff" stroke-width="8" fill="none" opacity=".18" stroke-linecap="round"/>`).join("")}<rect x="0" y="0" width="400" height="70" fill="${H(130, 30, 30)}"/>`,
  };
  window.__photo = (kind, hue, label) => `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${(kinds[kind] || kinds.room)(hue)}</svg>`;
})();
