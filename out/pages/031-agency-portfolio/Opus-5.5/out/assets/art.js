// Original SVG project imagery and client wordmarks (fictional brands). Exposes window.Art.
(function () {
  "use strict";
  const F = 'font-family="Space Grotesk, Inter, system-ui, sans-serif"';
  const B = 'font-family="Inter, system-ui, sans-serif"';
  const t = (x, y, s, size, fill, w = 700, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" ${extra}>${s}</text>`;
  const r = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}" ${F}>${body}</svg>`;
  const SIZE = { wide: [800, 500], square: [800, 800], tall: [800, 1000] };

  // brand marks: simple geometric logos keyed by name
  const MARKS = {
    sun: (c, s = 1) => `<g transform="scale(${s})"><circle r="34" fill="${c}"/>${[...Array(12)].map((_, i) => `<rect x="-4" y="-66" width="8" height="20" rx="4" fill="${c}" transform="rotate(${i * 30})"/>`).join("")}</g>`,
    petal: (c, s = 1) => `<g transform="scale(${s})">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-26" rx="16" ry="28" fill="${c}" opacity=".85" transform="rotate(${a})"/>`).join("")}<circle r="10" fill="#fff"/></g>`,
    hex: (c, s = 1) => `<g transform="scale(${s})"><path d="M0-50 43-25v50L0 50-43 25v-50z" fill="none" stroke="${c}" stroke-width="10"/><circle r="12" fill="${c}"/></g>`,
    pin: (c, s = 1) => `<g transform="scale(${s})"><path d="M0 54C-30 18-40 0-40-16a40 40 0 0 1 80 0C40 0 30 18 0 54z" fill="${c}"/><circle cy="-16" r="14" fill="#fff"/></g>`,
    crest: (c, s = 1) => `<g transform="scale(${s})"><path d="M-44-44h88v40c0 34-24 54-44 62-20-8-44-28-44-62z" fill="${c}"/><path d="m-22 4 22-28 22 28M-22 22l22-28 22 28" stroke="#fff" stroke-width="7" fill="none" stroke-linejoin="round"/></g>`,
    bolt: (c, s = 1) => `<g transform="scale(${s})"><path d="M8-56-36 8h30l-8 48 46-66H2z" fill="${c}"/></g>`,
    leaf: (c, s = 1) => `<g transform="scale(${s})"><path d="M0 52C-40 30-44-14 0-56 44-14 40 30 0 52z" fill="${c}"/><path d="M0-36V52" stroke="#fff" stroke-width="5"/></g>`,
    ring: (c, s = 1) => `<g transform="scale(${s})"><circle cx="-16" r="32" fill="none" stroke="${c}" stroke-width="10"/><circle cx="16" r="32" fill="none" stroke="${c}" stroke-width="10" opacity=".6"/></g>`,
    bowl: (c, s = 1) => `<g transform="scale(${s})"><path d="M-50-6h100c0 34-22 54-50 54s-50-20-50-54z" fill="${c}"/><path d="M-20-20c0-16 10-24 20-34M4-20c4-14 14-20 26-22" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`,
    x: (c, s = 1) => `<g transform="scale(${s})"><path d="M-40-40 40 40M40-40-40 40" stroke="${c}" stroke-width="18" stroke-linecap="square"/></g>`,
    drop: (c, s = 1) => `<g transform="scale(${s})"><path d="M0-56C24-24 40 0 40 18a40 40 0 0 1-80 0c0-18 16-42 40-74z" fill="${c}"/><path d="M-14 18h28M0 4v28" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`,
    wave: (c, s = 1) => `<g transform="scale(${s})"><path d="M-56 0c14-24 28-24 42 0s28 24 42 0 28-24 42 0" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/></g>`,
    tri: (c, s = 1) => `<g transform="scale(${s})"><path d="M0-50 50 40h-100z" fill="${c}"/></g>`,
    square: (c, s = 1) => `<g transform="scale(${s})"><rect x="-44" y="-44" width="88" height="88" rx="20" fill="${c}"/><rect x="-14" y="-14" width="28" height="28" rx="6" fill="#fff"/></g>`,
    arc: (c, s = 1) => `<g transform="scale(${s})"><path d="M-48 40a48 48 0 0 1 96 0" stroke="${c}" stroke-width="16" fill="none"/><circle cy="-30" r="12" fill="${c}"/></g>`,
    dots: (c, s = 1) => `<g transform="scale(${s})">${[[-26, -26], [26, -26], [-26, 26], [26, 26], [0, 0]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}"/>`).join("")}</g>`,
  };
  const mark = (name, c, x, y, s) => `<g transform="translate(${x} ${y})">${MARKS[name](c, s)}</g>`;

  // ---- templates ----
  function identity(p, [W, H]) {
    const [bg, a, b, ink] = p.pal;
    let s = r(0, 0, W, H, bg);
    s += mark(p.mark, a, W * 0.3, H * 0.42, H / 500 * 1.25);
    s += t(W * 0.3, H * 0.42 + H * 0.26, p.brand, Math.min(64, W / 11), ink, 700, `text-anchor="middle" letter-spacing="-1"`);
    // business card + swatches
    const cx = W * 0.62, cy = H * 0.18, cw = W * 0.32, ch = cw * 0.6;
    s += `<g transform="rotate(-6 ${cx + cw / 2} ${cy + ch / 2})">` + r(cx, cy, cw, ch, a, 10, 'filter="url(#sd)"') + mark(p.mark, ink, cx + cw * 0.18, cy + ch * 0.32, cw / 640) + t(cx + cw * 0.08, cy + ch * 0.8, p.brand, cw / 12, ink, 700) + `</g>`;
    const sw = [a, b, ink, "#fff"];
    sw.forEach((c, i) => { s += r(W * 0.6 + i * W * 0.085, H * 0.62, W * 0.07, H * 0.24, c, 8, c === "#fff" || c === bg ? `stroke="${ink}" stroke-opacity=".15"` : ""); });
    s += t(W * 0.6, H * 0.94, "PRIMARY · SECONDARY · INK", Math.max(12, W / 60), ink, 500, `${B} letter-spacing="2" opacity=".6"`);
    return s;
  }
  function web(p, [W, H]) {
    const [bg, a, b, ink] = p.pal;
    let s = r(0, 0, W, H, bg);
    const x = W * 0.08, y = H * 0.1, w = W * 0.84, h = H * 0.95;
    s += r(x, y, w, h, "#fff", 14, 'filter="url(#sd)"') + r(x, y, w, 34, "#F3F4F6", 14) + r(x, y + 20, w, 14, "#F3F4F6");
    [0, 1, 2].forEach((i) => { s += `<circle cx="${x + 20 + i * 16}" cy="${y + 17}" r="5" fill="#D1D5DB"/>`; });
    const by = y + 34;
    s += mark(p.mark, a, x + 34, by + 30, 0.22) + t(x + 56, by + 36, p.brand, 16, ink, 700);
    ["Shop", "About", "Journal"].forEach((n, i) => { s += t(x + w - 230 + i * 62, by + 35, n, 12, ink, 500, `${B} opacity=".7"`); });
    s += r(x + w - 50, by + 18, 34, 24, ink, 12);
    const hy = by + 62, hh = h * 0.45;
    s += r(x, hy, w, hh, b);
    s += t(x + 32, hy + hh * 0.34, p.head[0], Math.min(46, w / 13), ink, 700, 'letter-spacing="-1"') + t(x + 32, hy + hh * 0.34 + Math.min(50, w / 12), p.head[1], Math.min(46, w / 13), ink, 700, 'letter-spacing="-1"');
    s += r(x + 32, hy + hh * 0.66, 130, 40, a, 20) + t(x + 97, hy + hh * 0.66 + 25, p.cta, 13, p.ctaInk || "#fff", 600, `${B} text-anchor="middle"`);
    s += `<circle cx="${x + w * 0.74}" cy="${hy + hh * 0.5}" r="${hh * 0.36}" fill="${a}" opacity=".9"/>` + mark(p.mark, "#fff", x + w * 0.74, hy + hh * 0.5, hh / 420);
    const gy = hy + hh + 20, gw = (w - 64 - 32) / 3;
    [0, 1, 2].forEach((i) => { const gx = x + 32 + i * (gw + 16); s += r(gx, gy, gw, gw * 0.8, i === 1 ? a : b, 10, i === 1 ? 'opacity=".35"' : "") + r(gx, gy + gw * 0.8 + 12, gw * 0.7, 10, ink, 5, 'opacity=".75"') + r(gx, gy + gw * 0.8 + 30, gw * 0.4, 10, ink, 5, 'opacity=".3"'); });
    return s;
  }
  function dash(p, [W, H]) {
    const [bg, a, b, ink] = p.pal;
    let s = r(0, 0, W, H, bg);
    const x = W * 0.06, y = H * 0.08, w = W * 0.88, h = H * 0.9;
    s += r(x, y, w, h, "#0B1220", 16, 'stroke="#1F2937"') + r(x, y, 150, h, "#0F172A", 16);
    s += mark(p.mark, a, x + 34, y + 36, 0.22) + t(x + 54, y + 42, p.brand, 15, "#fff", 700);
    ["Overview", "Accounts", "Cards", "Insights", "Settings"].forEach((n, i) => { s += (i === 0 ? r(x + 12, y + 72 + i * 36, 126, 28, "#1E293B", 8) : "") + t(x + 26, y + 91 + i * 36, n, 12, i ? "#64748B" : "#E2E8F0", 500, B); });
    const cx = x + 172, cw = w - 194;
    s += t(cx, y + 44, "Portfolio", 22, "#F8FAFC", 700) + t(cx, y + 66, "Updated just now", 11, "#64748B", 400, B);
    [["Net worth", "$1.28M", "+4.2%"], ["Cash", "$84,120", "+1.1%"], ["Invested", "$1.19M", "+5.6%"]].forEach(([n, v, d], i) => {
      const kx = cx + i * (cw / 3); s += r(kx, y + 86, cw / 3 - 14, 84, "#111A2E", 12, 'stroke="#1F2937"') + t(kx + 14, y + 110, n, 11, "#94A3B8", 500, B) + t(kx + 14, y + 142, v, 22, "#F8FAFC", 700) + t(kx + 14, y + 160, d, 11, a, 600, B);
    });
    const gy = y + 190, gh = h - 220;
    s += r(cx, gy, cw * 0.62, gh, "#111A2E", 12, 'stroke="#1F2937"');
    const pts = [0.7, 0.62, 0.66, 0.5, 0.56, 0.42, 0.46, 0.32, 0.36, 0.24, 0.2].map((v, i, arr) => `${cx + 16 + i * ((cw * 0.62 - 32) / (arr.length - 1))},${gy + 30 + v * (gh - 50)}`);
    s += `<polyline points="${pts.join(" ")}" fill="none" stroke="${a}" stroke-width="3" stroke-linejoin="round"/><polygon points="${cx + 16},${gy + gh - 16} ${pts.join(" ")} ${cx + cw * 0.62 - 16},${gy + gh - 16}" fill="${a}" opacity=".12"/>`;
    const dx = cx + cw * 0.62 + 14, dw = cw * 0.38 - 14;
    s += r(dx, gy, dw, gh, "#111A2E", 12, 'stroke="#1F2937"') + `<circle cx="${dx + dw / 2}" cy="${gy + gh * 0.42}" r="${Math.min(dw, gh) * 0.28}" fill="none" stroke="#1E293B" stroke-width="18"/><circle cx="${dx + dw / 2}" cy="${gy + gh * 0.42}" r="${Math.min(dw, gh) * 0.28}" fill="none" stroke="${a}" stroke-width="18" stroke-dasharray="${Math.min(dw, gh) * 1.1} 999" transform="rotate(-90 ${dx + dw / 2} ${gy + gh * 0.42})"/><circle cx="${dx + dw / 2}" cy="${gy + gh * 0.42}" r="${Math.min(dw, gh) * 0.28}" fill="none" stroke="${b}" stroke-width="18" stroke-dasharray="0 ${Math.min(dw, gh) * 1.1} ${Math.min(dw, gh) * 0.45} 999" transform="rotate(-90 ${dx + dw / 2} ${gy + gh * 0.42})"/>`;
    s += t(dx + dw / 2, gy + gh * 0.42 + 6, "62%", 18, "#F8FAFC", 700, 'text-anchor="middle"') + t(dx + 16, gy + gh - 22, "Equities · Bonds", 11, "#94A3B8", 500, B);
    return s;
  }
  function phone(p, [W, H]) {
    const [bg, a, b, ink] = p.pal;
    let s = r(0, 0, W, H, bg);
    const ph = H * 0.84, pw = Math.min(ph / 2.05, W * 0.42), px = W / 2 - pw / 2 + (p.offset || 0) * W, py = H * 0.1;
    if (p.second) {
      const qx = px - pw * 0.72, qy = py + ph * 0.06;
      s += r(qx - 8, qy - 8, pw + 16, ph + 16, "#111827", 40, 'opacity=".9"') + r(qx, qy, pw, ph, b, 32) + screen(p, qx, qy, pw, ph, true);
    }
    s += r(px - 10, py - 10, pw + 20, ph + 20, "#111827", 46, 'filter="url(#sd)"') + r(px, py, pw, ph, "#fff", 36);
    s += `<clipPath id="ph-${p.uid}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="36"/></clipPath><g clip-path="url(#ph-${p.uid})">${screen(p, px, py, pw, ph)}</g>`;
    s += r(px + pw / 2 - 40, py + 10, 80, 20, "#111827", 10);
    return s;
    function screen(p, x, y, w, h, alt) {
      let o = "";
      if (p.screen === "map") {
        o += r(x, y, w, h, alt ? "#E7EFE9" : "#EAF2EC");
        for (let i = 0; i < 7; i++) o += `<path d="M${x} ${y + h * (0.1 + i * 0.13)} q${w * 0.4} ${-30 + i * 9} ${w} ${12}" stroke="#fff" stroke-width="${i % 3 ? 4 : 9}" fill="none"/>`;
        o += `<path d="M${x + w * 0.2} ${y + h * 0.7} C${x + w * 0.3} ${y + h * 0.45} ${x + w * 0.7} ${y + h * 0.5} ${x + w * 0.7} ${y + h * 0.28}" stroke="${a}" stroke-width="5" fill="none" stroke-dasharray="10 8"/>`;
        o += mark("pin", a, x + w * 0.7, y + h * 0.25, 0.32) + `<circle cx="${x + w * 0.2}" cy="${y + h * 0.7}" r="9" fill="${ink}" stroke="#fff" stroke-width="4"/>`;
        o += r(x + 14, y + h - 128, w - 28, 108, "#fff", 20, 'filter="url(#sd)"') + t(x + 30, y + h - 94, "Lisbon old town", 17, ink, 700) + t(x + 30, y + h - 72, "4 stops · 2.1 km walk", 12, "#6B7280", 500, B) + r(x + 30, y + h - 58, w - 60, 28, a, 14) + t(x + w / 2, y + h - 39, "Start route", 12, "#fff", 600, `${B} text-anchor="middle"`);
      } else {
        o += r(x, y, w, h, alt ? b : "#fff");
        o += t(x + 22, y + 72, "Today", 26, ink, 700) + t(x + 22, y + 94, "Tuesday, 14 April", 12, "#6B7280", 500, B);
        const R = w * 0.28, cx = x + w / 2, cy = y + 120 + R + 10;
        [[a, 0.78, R], [b === "#fff" ? "#93C5FD" : "#60A5FA", 0.6, R - 22], ["#F472B6", 0.45, R - 44]].forEach(([c, v, rr]) => { const L = 2 * Math.PI * rr; o += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${c}" stroke-opacity=".18" stroke-width="16"/><circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${L * v} ${L}" transform="rotate(-90 ${cx} ${cy})"/>`; });
        const ly = cy + R + 28;
        [["Steps", "8,412", a], ["Sleep", "7h 20m", "#60A5FA"], ["Heart", "64 bpm", "#F472B6"]].forEach(([n, v, c], i) => { const yy = ly + i * 52; o += r(x + 16, yy, w - 32, 42, "#F9FAFB", 12) + `<circle cx="${x + 38}" cy="${yy + 21}" r="8" fill="${c}"/>` + t(x + 56, yy + 26, n, 13, ink, 600, B) + t(x + w - 30, yy + 26, v, 13, ink, 700, 'text-anchor="end"'); });
      }
      return o;
    }
  }
  function product(p, [W, H]) { // e-commerce product page / configurator
    const [bg, a, b, ink] = p.pal;
    let s = r(0, 0, W, H, bg);
    const x = W * 0.07, y = H * 0.09, w = W * 0.86, h = H * 0.86;
    s += r(x, y, w, h, "#fff", 16, 'filter="url(#sd)"');
    const iw = w * 0.52;
    s += r(x, y, iw, h, b, 16) + r(x + iw - 16, y, 16, h, b);
    if (p.screen === "car") {
      const cx = x + iw / 2, cy = y + h * 0.56, L = iw * 0.8;
      s += `<ellipse cx="${cx}" cy="${cy + L * 0.17}" rx="${L * 0.5}" ry="${L * 0.05}" fill="#000" opacity=".12"/>`;
      s += `<path d="M${cx - L / 2} ${cy + L * 0.1} q0 -${L * 0.12} ${L * 0.12} -${L * 0.14} l${L * 0.12} -${L * 0.1} q${L * 0.14} -${L * 0.06} ${L * 0.34} -${L * 0.02} l${L * 0.16} ${L * 0.1} q${L * 0.16} ${L * 0.02} ${L * 0.16} ${L * 0.14} v${L * 0.04} h-${L}z" fill="${a}"/>`;
      s += `<path d="M${cx - L * 0.22} ${cy - L * 0.05} l${L * 0.08} -${L * 0.07} q${L * 0.12} -${L * 0.04} ${L * 0.26} -${L * 0.01} l${L * 0.1} ${L * 0.08}z" fill="#CBD5E1" opacity=".85"/>`;
      [-0.3, 0.3].forEach((d) => { s += `<circle cx="${cx + d * L}" cy="${cy + L * 0.12}" r="${L * 0.08}" fill="#111827"/><circle cx="${cx + d * L}" cy="${cy + L * 0.12}" r="${L * 0.035}" fill="#9CA3AF"/>`; });
    } else {
      const cx = x + iw / 2, cy = y + h * 0.5;
      s += mark(p.mark, a, cx, cy, iw / 300);
    }
    const tx = x + iw + 28, tw = w - iw - 56;
    s += t(tx, y + 54, p.brand.toUpperCase(), 11, "#6B7280", 600, `${B} letter-spacing="2"`) + t(tx, y + 92, p.head[0], Math.min(30, tw / 7), ink, 700) + t(tx, y + 92 + Math.min(34, tw / 6.5), p.head[1], Math.min(30, tw / 7), ink, 700);
    s += t(tx, y + 170, p.price, 20, ink, 600);
    const opts = p.swatches || [a, b, ink];
    opts.forEach((c, i) => { s += `<circle cx="${tx + 16 + i * 40}" cy="${y + 210}" r="14" fill="${c}" stroke="${i === 0 ? ink : "#E5E7EB"}" stroke-width="${i === 0 ? 3 : 1}"/>`; });
    [0, 1, 2].forEach((i) => { s += r(tx, y + 250 + i * 22, tw * (0.9 - i * 0.2), 8, "#E5E7EB", 4); });
    s += r(tx, y + h - 92, tw, 46, ink, 23) + t(tx + tw / 2, y + h - 63, p.cta, 14, "#fff", 600, `${B} text-anchor="middle"`);
    return s;
  }
  const TEMPLATES = { identity, web, dash, phone, product };

  let uid = 0;
  function project(p, label) {
    p = { ...p, uid: `${p.id}-${++uid}` };
    const size = SIZE[p.ratio];
    const defs = `<defs><filter id="sd" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#111827" flood-opacity=".18"/></filter></defs>`;
    return svg(size[0], size[1], defs + TEMPLATES[p.kind](p, size), label || `${p.title} project image`);
  }

  function logo(name, markName, color) {
    return `<svg viewBox="0 0 220 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name} logo" ${F}>${mark(markName, color, 30, 32, 0.32)}<text x="58" y="41" font-size="24" font-weight="700" fill="${color}" letter-spacing="-.5">${name}</text></svg>`;
  }

  window.Art = { project, logo, mark: (name, c) => `<svg viewBox="-70 -70 140 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${MARKS[name](c)}</svg>` };
})();
