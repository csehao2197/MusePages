// Original SVG illustrations standing in for product and customer photos. Exposes window.Art.
(function () {
  "use strict";
  const COLORS = { "Timber Brown": ["#92400E", "#78350F", "#F59E0B"], "Slate Gray": ["#475569", "#334155", "#F97316"], "Forest Green": ["#166534", "#14532D", "#FACC15"] };
  function boot(x, y, s, color, flip = false) {
    const [a, b, lace] = COLORS[color] || COLORS["Timber Brown"];
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M-60 40h130c10 0 14-8 12-16l-6-16c-4-10-14-14-26-16l-30-6-4-46c0-6-4-10-10-10h-46c-6 0-10 4-10 10z" fill="${a}"/><path d="M-62 40h134v12c0 4-4 8-8 8H-54c-4 0-8-4-8-8z" fill="#1C1917"/><path d="M-62 46h134" stroke="#57534E" stroke-width="3" stroke-dasharray="6 5"/><path d="M-50-50h46v8h-46z" fill="${b}"/>${[-36, -26, -16, -6].map((yy) => `<path d="M-14 ${yy}l14 6" stroke="${lace}" stroke-width="3" stroke-linecap="round"/>`).join("")}<path d="M8 -6c18 2 30 8 34 18" stroke="${b}" stroke-width="3" fill="none"/></g>`;
  }
  const SCENES = [
    (c) => `<rect width="400" height="300" fill="#E0F2FE"/><path d="M0 170 120 90 220 150 300 80 400 140V300H0z" fill="#64748B"/><path d="M0 220 160 180 400 230V300H0z" fill="#A16207"/>${boot(200, 220, 1.1, c)}`,
    (c) => `<rect width="400" height="300" fill="#F5F5F4"/><rect y="230" width="400" height="70" fill="#D6D3D1"/>${boot(140, 220, 1, c)}${boot(270, 225, 1, c, true)}`,
    (c) => `<rect width="400" height="300" fill="#57534E"/><path d="M0 200c80-20 160 10 240-10s120 0 160 10V300H0z" fill="#44403C"/>${[60, 150, 300, 350].map((x) => `<ellipse cx="${x}" cy="${230 + (x % 3) * 8}" rx="30" ry="8" fill="#292524"/>`).join("")}${boot(200, 215, 1.05, c)}<g fill="#78350F" opacity=".6">${Array.from({ length: 14 }, (_, i) => `<circle cx="${150 + (i * 23) % 120}" cy="${235 + (i * 7) % 20}" r="${3 + (i % 3)}"/>`).join("")}</g>`,
    (c) => `<rect width="400" height="300" fill="#FEF3C7"/><rect x="60" y="150" width="280" height="110" rx="6" fill="#D6BFA8"/><path d="M60 150l40-40h200l40 40" fill="#E7D7C4"/><path d="M60 150h280" stroke="#A8A29E" stroke-width="2"/>${boot(200, 160, 0.9, c)}`,
    (c) => `<rect width="400" height="300" fill="#BBF7D0"/><path d="M0 120c60-30 140-30 200 0s140 30 200 0V300H0z" fill="#4D7C0F"/><path d="M0 240h400V300H0z" fill="#78716C"/><path d="M40 240c40-10 80-8 120 0" stroke="#A8A29E" stroke-width="6"/>${boot(230, 225, 1.1, c)}`,
    (c) => `<rect width="400" height="300" fill="#1E293B"/><circle cx="320" cy="60" r="26" fill="#F8FAFC" opacity=".8"/><g fill="#fff">${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="${(i * 29) % 140}" r="1.4"/>`).join("")}</g><path d="M0 220 140 150 260 200 400 160V300H0z" fill="#0F172A"/><path d="M150 230l50-60 50 60z" fill="#F97316" opacity=".9"/>${boot(110, 250, 0.8, c)}`,
    (c) => `<rect width="400" height="300" fill="#DBEAFE"/><g fill="#fff" opacity=".9">${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 47) % 400}" cy="${(i * 31) % 300}" r="${2 + (i % 3)}"/>`).join("")}</g><path d="M0 230c100-20 300-20 400 0V300H0z" fill="#F8FAFC"/>${boot(200, 225, 1.05, c)}`,
    (c) => `<rect width="400" height="300" fill="#E7E5E4"/><path d="M0 0h400v300H0z" fill="url(#none)"/><rect x="40" y="40" width="320" height="220" rx="12" fill="#fff"/><path d="M60 230h280" stroke="#E7E5E4" stroke-width="4"/><text x="70" y="78" font-family="Inter,sans-serif" font-size="14" fill="#78716C">Size check</text>${boot(200, 200, 1, c)}<path d="M80 250h240" stroke="#F59E0B" stroke-width="3"/><g font-family="Inter,sans-serif" font-size="11" fill="#78716C">${[0, 1, 2, 3, 4, 5].map((i) => `<text x="${80 + i * 48}" y="270">${i * 6}cm</text>`).join("")}</g>`
  ];
  function photo(i, color = "Timber Brown", label = "") {
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${SCENES[i % SCENES.length](color)}</svg>`;
  }
  function product(color = "Timber Brown", label = "") {
    return `<svg viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><rect width="300" height="220" fill="#F5F5F4"/><ellipse cx="150" cy="190" rx="110" ry="10" fill="#000" opacity=".08"/>${boot(150, 150, 1.25, color)}</svg>`;
  }
  const RELATED = {
    sock: (c) => `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#F5F5F4"/><path d="M80 20h40v70c0 10 30 14 30 30s-14 18-28 14l-40-12c-10-3-14-10-14-18V20z" fill="${c}"/><path d="M80 30h40" stroke="#fff" stroke-width="6" opacity=".6"/></svg>`,
    pack: (c) => `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#F5F5F4"/><rect x="60" y="30" width="80" height="100" rx="20" fill="${c}"/><rect x="72" y="70" width="56" height="40" rx="8" fill="#000" opacity=".15"/><path d="M80 30c0-16 40-16 40 0" stroke="#1C1917" stroke-width="6" fill="none"/></svg>`,
    pole: (c) => `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#F5F5F4"/><path d="M80 20 100 135M120 20 100 135" stroke="${c}" stroke-width="7" stroke-linecap="round"/><rect x="72" y="16" width="16" height="28" rx="6" fill="#1C1917"/><rect x="112" y="16" width="16" height="28" rx="6" fill="#1C1917"/></svg>`,
    shoe: (c) => `<svg viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#F5F5F4"/><g transform="translate(100 95) scale(.8)"><path d="M-80 20h150c10 0 14-8 12-16l-6-12c-4-8-14-10-26-12l-40-8-20-20h-40c-14 0-24 10-26 24z" fill="${c}"/><path d="M-82 20h154v10c0 4-4 8-8 8H-74c-4 0-8-4-8-8z" fill="#1C1917"/></g></svg>`
  };
  window.Art = { photo, product, RELATED, COLORS };
})();
