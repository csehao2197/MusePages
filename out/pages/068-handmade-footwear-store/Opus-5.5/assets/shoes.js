// Illustrated handmade footwear (top-down pairs). Original SVG, used in place of product photos. Exposes window.Shoe.
(function () {
  "use strict";
  const SOLE = "M100 20C150 20 170 70 168 130C166 190 140 222 140 262C140 322 160 362 130 387C110 402 80 402 65 387C40 362 58 322 58 262C58 222 32 190 32 130C30 70 50 20 100 20Z";
  const INSOLE = "M100 34C142 34 156 78 154 132C152 188 128 220 128 262C128 318 146 352 122 374C108 386 88 386 76 374C54 352 70 318 70 262C70 220 46 188 46 132C44 78 58 34 100 34Z";
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };
  function strap(style, c, id) {
    const d = shade(c, 0.78), l = shade(c, 1.15);
    switch (style) {
      case "cross": return `<path d="M22 92L178 190L170 214L14 116Z" fill="${c}"/><path d="M178 92L22 190L30 214L186 116Z" fill="${l}"/><path d="M178 92L22 190" stroke="${d}" stroke-width="2" stroke-dasharray="5 5" fill="none" opacity=".6"/>`;
      case "double": return `<path d="M20 86Q100 66 180 86L182 128Q100 110 18 128Z" fill="${c}"/><path d="M24 150Q100 132 176 150L174 190Q100 174 26 190Z" fill="${c}"/><path d="M26 98Q100 80 174 98M30 162Q100 146 170 162" stroke="${d}" stroke-width="2" stroke-dasharray="5 5" fill="none" opacity=".6"/>`;
      case "braid": return `<path d="M16 96Q100 70 184 96L184 176Q100 154 16 176Z" fill="${c}"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${26 + i * 18} ${92 - Math.sin(i / 2.6) * 6}l14 76" stroke="${d}" stroke-width="6" opacity=".55"/><path d="M${40 + i * 18} ${92 - Math.sin(i / 2.6) * 6}l-14 76" stroke="${l}" stroke-width="5" opacity=".6"/>`).join("")}`;
      case "toe": return `<path d="M100 56L34 150Q28 162 40 160L100 84L160 160Q172 162 166 150Z" fill="${c}"/><circle cx="100" cy="60" r="10" fill="${d}"/>`;
      case "mule": return `<path d="M40 70Q100 10 160 70L172 196Q100 172 28 196Z" fill="${c}"/><path d="M48 80Q100 30 152 80L162 186Q100 164 38 186Z" fill="none" stroke="${l}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
      case "fur": return `<path d="M18 92Q100 68 182 92L182 176Q100 154 18 176Z" fill="${c}"/>${Array.from({ length: 26 }, (_, i) => `<circle cx="${18 + (i % 13) * 13.6}" cy="${i < 13 ? 92 - Math.sin(((i % 13) / 12) * Math.PI) * 22 : 176 - Math.sin(((i % 13) / 12) * Math.PI) * 22}" r="9" fill="${l}"/>`).join("")}`;
      default: return `<path d="M16 92Q100 66 184 92L184 180Q100 156 16 180Z" fill="${c}"/><path d="M24 104Q100 80 176 104M24 168Q100 146 176 168" stroke="${d}" stroke-width="2" stroke-dasharray="5 5" fill="none" opacity=".6"/>`;
    }
  }
  function accent(kind, c) {
    switch (kind) {
      case "buckle": return `<rect x="78" y="112" width="44" height="34" rx="6" fill="none" stroke="#D4AF37" stroke-width="7"/><rect x="96" y="108" width="8" height="42" rx="3" fill="#B8962E"/>`;
      case "rose": return `<g transform="translate(100 128)">${[0, 72, 144, 216, 288].map((a) => `<ellipse rx="13" ry="20" transform="rotate(${a}) translate(0 -12)" fill="#C2185B"/>`).join("")}<circle r="11" fill="#E91E63"/><path d="M-4-2q4-6 8 0q-4 6-8 0" fill="#AD1457"/><path d="M14 18q20 8 30-4M-14 18q-20 8-30-4" stroke="#2E7D32" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
      case "chain": return Array.from({ length: 7 }, (_, i) => `<ellipse cx="${46 + i * 18}" cy="${132 - Math.sin((i / 6) * Math.PI) * 10}" rx="10" ry="6" fill="none" stroke="#D4AF37" stroke-width="4" transform="rotate(${i % 2 ? 20 : -20} ${46 + i * 18} ${132 - Math.sin((i / 6) * Math.PI) * 10})"/>`).join("");
      case "studs": return Array.from({ length: 12 }, (_, i) => `<circle cx="${34 + (i % 6) * 26}" cy="${i < 6 ? 112 : 150}" r="5" fill="#E5E4E2" stroke="#9E9E9E" stroke-width="1.5"/>`).join("");
      case "bow": return `<g transform="translate(100 128)"><path d="M0 0L-38-22Q-46 0-38 22Z" fill="#F3EDE2" stroke="#CDBFA8" stroke-width="2"/><path d="M0 0L38-22Q46 0 38 22Z" fill="#F3EDE2" stroke="#CDBFA8" stroke-width="2"/><rect x="-9" y="-11" width="18" height="22" rx="5" fill="#D9CBB2"/></g>`;
      case "logo": return `<text x="100" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="26" font-weight="700" fill="${shade(c, 0.55)}" opacity=".85">D'F</text>`;
      default: return "";
    }
  }
  function foot(p, mirror, id) {
    return `<g transform="${mirror ? "translate(200 0) scale(-1 1)" : ""}"><path d="${SOLE}" fill="rgba(0,0,0,.18)" transform="translate(6 10)"/><path d="${SOLE}" fill="${p.sole}"/><path d="${INSOLE}" fill="${p.insole}"/><path d="${INSOLE}" fill="none" stroke="${shade(p.insole, 0.82)}" stroke-width="2" stroke-dasharray="4 5"/>${strap(p.style, p.strap, id)}${mirror && p.accent === "logo" ? `<g transform="translate(200 0) scale(-1 1)">${accent(p.accent, p.strap)}</g>` : accent(p.accent, p.strap)}</g>`;
  }
  function pair(p, label, opts = {}) {
    const id = Math.random().toString(36).slice(2, 7);
    const bg = opts.bg || "#EEECE8";
    return `<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="bg${id}" cx=".45" cy=".35" r=".85"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs><rect width="500" height="500" fill="${bg}"/><rect width="500" height="500" fill="url(#bg${id})"/>
      <g transform="translate(${opts.single ? 150 : 46} 40) rotate(${opts.single ? 0 : -6} 100 210)">${foot(p, false, id)}</g>${opts.single ? "" : `<g transform="translate(246 60) rotate(8 100 210)">${foot(p, true, id)}</g>`}</svg>`;
  }
  window.Shoe = { pair };
})();
