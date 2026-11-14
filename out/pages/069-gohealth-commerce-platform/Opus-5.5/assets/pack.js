// Illustrated wellness product packshots (original SVG, no photos). Exposes window.Pack.
(function () {
  "use strict";
  const T = (x, y, s, w, f, t, a = "middle") => `<text x="${x}" y="${y}" font-family="Plus Jakarta Sans, Inter, sans-serif" font-size="${s}" font-weight="${w}" fill="${f}" text-anchor="${a}">${t}</text>`;
  const leaf = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0C10-18 30-20 40-18C38-6 26 10 0 0Z" fill="${c}"/><path transform="translate(${x} ${y}) scale(${s})" d="M0 0Q18-8 34-15" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>`;
  function label(p, x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#fff"/>${leaf(x + w / 2 - 10, y + 24, 0.6, p.color)}${T(x + w / 2, y + h * 0.48, Math.min(17, w / 7), 800, "#14321F", p.short)}${T(x + w / 2, y + h * 0.48 + 18, 10, 600, p.color, p.sub)}<rect x="${x + 14}" y="${y + h - 22}" width="${w - 28}" height="6" rx="3" fill="${p.color}" opacity=".25"/>`;
  }
  const SHAPES = {
    bottle: (p) => `<rect x="150" y="70" width="60" height="34" rx="6" fill="${p.cap}"/><rect x="146" y="100" width="68" height="14" rx="4" fill="${p.cap}" opacity=".85"/><path d="M120 128Q120 112 136 112H224Q240 112 240 128V318Q240 334 224 334H136Q120 334 120 318Z" fill="${p.body}"/><rect x="128" y="120" width="12" height="200" rx="6" fill="#fff" opacity=".18"/>${label(p, 132, 168, 96, 120)}`,
    jar: (p) => `<rect x="108" y="102" width="144" height="38" rx="10" fill="${p.cap}"/><path d="M100 152Q100 140 112 140H248Q260 140 260 152V312Q260 330 242 330H118Q100 330 100 312Z" fill="${p.body}"/><rect x="108" y="150" width="14" height="168" rx="7" fill="#fff" opacity=".2"/>${label(p, 124, 172, 112, 124)}`,
    box: (p) => `<path d="M112 96L212 80L248 104L148 120Z" fill="${p.cap}"/><path d="M112 96L148 120V330L112 306Z" fill="${p.body}" opacity=".75"/><path d="M148 120L248 104V314L148 330Z" fill="${p.body}"/>${label(p, 158, 150, 80, 130).replace(/<rect x="158"/, '<rect x="158"')}`,
    tube: (p) => `<path d="M130 84H230L222 300Q220 316 204 316H156Q140 316 138 300Z" fill="${p.body}"/><rect x="126" y="76" width="108" height="16" rx="3" fill="${p.cap}"/><rect x="160" y="316" width="40" height="30" rx="6" fill="${p.cap}"/>${label(p, 146, 132, 68, 120)}`,
    pouch: (p) => `<path d="M112 92H248L256 312Q256 330 238 330H122Q104 330 104 312Z" fill="${p.body}"/><rect x="112" y="92" width="136" height="20" fill="${p.cap}"/><path d="M118 104H242" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" opacity=".6"/>${label(p, 128, 150, 104, 140)}`,
    dropper: (p) => `<path d="M168 52Q180 40 192 52V104H168Z" fill="${p.cap}"/><rect x="156" y="100" width="48" height="26" rx="5" fill="${p.cap}"/><path d="M136 140Q136 126 150 126H210Q224 126 224 140V318Q224 334 208 334H152Q136 334 136 318Z" fill="${p.body}"/>${label(p, 144, 172, 72, 120)}`
  };
  function shot(p, alt, opts = {}) {
    const bg = opts.bg || p.bg;
    return `<svg viewBox="0 0 360 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${alt}" preserveAspectRatio="xMidYMid meet"><rect width="360" height="380" fill="${bg}"/><circle cx="290" cy="70" r="90" fill="#fff" opacity=".35"/><ellipse cx="180" cy="342" rx="96" ry="12" fill="#000" opacity=".08"/>${leaf(60, 330, 1.4, p.color)}${leaf(250, 340, 1, p.color).replace(/scale\(1\)/, "scale(-1 1)")}${SHAPES[p.shape](p)}</svg>`;
  }
  window.Pack = { shot };
})();
