// Original cinematic SVG scenes (silhouettes + light) used instead of photos. Exposes window.Scene.
(function () {
  "use strict";
  const rng = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const person = (x, y, s, c, opts = {}) => {
    const head = `<circle cx="${x}" cy="${y - 92 * s}" r="${15 * s}" fill="${c}"/>`;
    const body = `<path d="M${x - 24 * s} ${y}C${x - 26 * s} ${y - 50 * s} ${x - 22 * s} ${y - 72 * s} ${x} ${y - 74 * s}C${x + 22 * s} ${y - 72 * s} ${x + 26 * s} ${y - 50 * s} ${x + 24 * s} ${y}Z" fill="${c}"/>`;
    const cap = opts.cap ? `<path d="M${x - 24 * s} ${y - 104 * s}L${x} ${y - 114 * s}L${x + 24 * s} ${y - 104 * s}L${x} ${y - 96 * s}Z" fill="${c}"/><path d="M${x + 18 * s} ${y - 104 * s}v${16 * s}" stroke="#E8B04B" stroke-width="${2 * s}"/>` : "";
    const veil = opts.veil ? `<path d="M${x - 14 * s} ${y - 100 * s}C${x - 40 * s} ${y - 70 * s} ${x - 44 * s} ${y - 20 * s} ${x - 50 * s} ${y}L${x - 20 * s} ${y}Z" fill="#fff" opacity=".25"/>` : "";
    const dress = opts.dress ? `<path d="M${x - 14 * s} ${y - 60 * s}C${x - 40 * s} ${y - 20 * s} ${x - 46 * s} ${y} ${x - 50 * s} ${y + 2 * s}H${x + 50 * s}C${x + 46 * s} ${y} ${x + 40 * s} ${y - 20 * s} ${x + 14 * s} ${y - 60 * s}Z" fill="${c}"/>` : "";
    const arm = opts.arm ? `<path d="M${x + 16 * s} ${y - 66 * s}L${x + 38 * s} ${y - 120 * s}" stroke="${c}" stroke-width="${10 * s}" stroke-linecap="round"/>` : "";
    return veil + dress + body + head + cap + arm;
  };
  const bokeh = (r, n, w, h, col) => Array.from({ length: n }, () => `<circle cx="${r() * w}" cy="${r() * h * 0.7}" r="${4 + r() * 22}" fill="${col}" opacity="${0.08 + r() * 0.25}"/>`).join("");
  const grade = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const SC = {
    wedding(r, id) {
      return `<defs>${grade(id, "#2B1A12", "#0B0A0A")}<radialGradient id="${id}l" cx=".5" cy=".55" r=".5"><stop offset="0" stop-color="#F6C56B" stop-opacity=".75"/><stop offset="1" stop-color="#F6C56B" stop-opacity="0"/></radialGradient></defs><rect width="800" height="500" fill="url(#${id})"/>${bokeh(r, 22, 800, 500, "#F6C56B")}<ellipse cx="400" cy="290" rx="300" ry="220" fill="url(#${id}l)"/>
        <path d="M250 500V250C250 130 550 130 550 250V500" fill="none" stroke="#1A120D" stroke-width="22"/>${Array.from({ length: 16 }, (_, i) => `<circle cx="${262 + Math.cos(Math.PI * (i / 15)) * -138 + 138}" cy="${250 - Math.sin(Math.PI * (i / 15)) * 120}" r="${7 + r() * 5}" fill="#E7A9A9" opacity=".8"/>`).join("")}
        <g transform="translate(0 6)">${person(370, 470, 1.6, "#0A0706", { dress: true, veil: true })}${person(440, 470, 1.7, "#0A0706")}</g><rect y="440" width="800" height="60" fill="#070505" opacity=".7"/>`;
    },
    yearbook(r, id) {
      let s = `<defs>${grade(id, "#14202E", "#06090D")}</defs><rect width="800" height="500" fill="url(#${id})"/><rect x="0" y="120" width="800" height="300" fill="#1C2B3B" opacity=".7"/>`;
      for (let i = 0; i < 10; i++) s += `<rect x="${i * 82 + 6}" y="130" width="72" height="250" rx="4" fill="#24384D"/><rect x="${i * 82 + 60}" y="230" width="6" height="26" rx="2" fill="#E8B04B" opacity=".7"/><path d="M${i * 82 + 16} ${150 + (i % 3) * 4}h52M${i * 82 + 16} ${160 + (i % 3) * 4}h52" stroke="#1A2A3A" stroke-width="3"/>`;
      s += `<path d="M0 0L260 0L420 500L0 500Z" fill="#F6C56B" opacity=".07"/>`;
      [[180, 1.5], [300, 1.7], [420, 1.6], [540, 1.75], [650, 1.5]].forEach(([x, k], i) => (s += person(x + (r() - 0.5) * 20, 470, k, "#05080B", { arm: i === 2 })));
      return s + `<rect y="450" width="800" height="50" fill="#030507" opacity=".8"/>`;
    },
    graduation(r, id) {
      let s = `<defs>${grade(id, "#3A2410", "#120B06")}<radialGradient id="${id}s" cx=".75" cy=".2" r=".6"><stop offset="0" stop-color="#FFD58A" stop-opacity=".85"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient></defs><rect width="800" height="500" fill="url(#${id})"/><rect width="800" height="500" fill="url(#${id}s)"/>`;
      for (let i = 0; i < 9; i++) { const x = 80 + r() * 640, y = 40 + r() * 170, a = r() * 60 - 30; s += `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-26 0L0-10L26 0L0 10Z" fill="#0B0705"/><rect x="-12" y="2" width="24" height="10" fill="#0B0705"/><path d="M20 0v16" stroke="#E8B04B" stroke-width="2"/></g>`; }
      [[150, 1.6], [260, 1.8], [380, 1.7], [500, 1.85], [620, 1.6]].forEach(([x, k], i) => (s += person(x, 480, k, "#0B0705", { cap: true, arm: i % 2 === 0 })));
      return s;
    },
    video(r, id) {
      let s = `<defs>${grade(id, "#101418", "#050607")}</defs><rect width="800" height="500" fill="url(#${id})"/>${bokeh(r, 14, 800, 500, "#7FB6FF")}`;
      s += `<g transform="translate(470 180)"><rect x="-70" y="-50" width="190" height="120" rx="14" fill="#0A0C0E" stroke="#2A3036" stroke-width="3"/><circle cx="30" cy="10" r="44" fill="#0F1316" stroke="#3B444C" stroke-width="6"/><circle cx="30" cy="10" r="24" fill="#16202A"/><circle cx="20" cy="0" r="7" fill="#7FB6FF" opacity=".6"/><rect x="-60" y="-80" width="60" height="30" rx="6" fill="#0A0C0E"/><circle cx="96" cy="-30" r="6" fill="#E5484D"/></g><path d="M470 260L380 500M560 260L640 500M520 260v240" stroke="#0A0C0E" stroke-width="10"/>`;
      s += person(220, 480, 1.9, "#050607", { cap: r() > 0.5 });
      s += `<rect x="24" y="24" width="752" height="452" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-dasharray="40 372 40 0"/><text x="48" y="64" fill="#E5484D" font-family="DM Sans, sans-serif" font-size="18" font-weight="700">● REC</text>`;
      return s;
    }
  };
  function scene(kind, seed, label, variant = 0) {
    const r = rng(seed * 7919 + 1), id = `s${kind[0]}${seed}${variant}`;
    return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${SC[kind](r, id)}<rect width="800" height="500" fill="url(#${id}v)" opacity="0"/><defs><radialGradient id="${id}v" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient></defs><rect width="800" height="500" fill="url(#${id}v)"/></svg>`;
  }
  window.Scene = { scene };
})();
