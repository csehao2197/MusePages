// Original SVG thumbnails for OpenShelf resources (no publisher covers). Exposes window.Art.
(function () {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PAL = [["#1E3A8A", "#93C5FD"], ["#7C2D12", "#FDBA74"], ["#064E3B", "#6EE7B7"], ["#4C1D95", "#C4B5FD"], ["#831843", "#F9A8D4"], ["#1F2937", "#FCD34D"], ["#0C4A6E", "#7DD3FC"], ["#3F6212", "#BEF264"]];
  const wrap = (t, n) => { const w = t.split(" "), out = []; let line = ""; w.forEach((x) => { if ((line + " " + x).trim().length > n) { out.push(line.trim()); line = x; } else line += " " + x; }); out.push(line.trim()); return out.slice(0, 4); };
  const svg = (w, h, b, label) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>${b}</svg>`;
  function cover(r) {
    const [bg, fg] = PAL[r.seed % PAL.length], lines = wrap(r.title, 16);
    let b = `<rect width="200" height="300" fill="${bg}"/><rect width="12" height="300" fill="#000" opacity=".2"/>`;
    const motif = r.seed % 3;
    if (motif === 0) b += `<circle cx="150" cy="70" r="46" fill="${fg}" opacity=".85"/><circle cx="120" cy="96" r="30" fill="none" stroke="${fg}" stroke-width="3"/>`;
    else if (motif === 1) b += [0, 1, 2, 3, 4].map((i) => `<rect x="${30 + i * 30}" y="${40 + (i % 2) * 20}" width="20" height="${70 - (i % 3) * 14}" fill="${fg}" opacity="${0.5 + i * 0.1}"/>`).join("");
    else b += `<path d="M24 120 L80 40 L120 90 L176 30" stroke="${fg}" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
    b += lines.map((l, i) => `<text x="22" y="${170 + i * 24}" font-size="19" font-weight="700" fill="#fff" font-family="Source Serif 4, Georgia, serif">${esc(l)}</text>`).join("");
    b += `<rect x="22" y="${178 + lines.length * 24 - 14}" width="40" height="3" fill="${fg}"/><text x="22" y="282" font-size="11" fill="#fff" opacity=".85" font-family="Inter, sans-serif">${esc(r.author.split(",")[0])}</text>`;
    return svg(200, 300, b, `Cover of ${r.title}`);
  }
  function video(r) {
    const [bg, fg] = PAL[r.seed % PAL.length];
    let b = `<rect width="320" height="180" fill="${bg}"/><rect x="24" y="24" width="170" height="110" rx="6" fill="#fff" opacity=".92"/>`;
    b += [0, 1, 2].map((i) => `<rect x="40" y="${42 + i * 22}" width="${120 - i * 26}" height="9" rx="4" fill="${fg}"/>`).join("");
    b += `<circle cx="252" cy="88" r="30" fill="${fg}"/><rect x="226" y="120" width="52" height="60" rx="24" fill="${fg}"/>`;
    return svg(320, 180, b, `Video lecture thumbnail: ${r.title}`);
  }
  function paper(r) {
    let b = `<rect width="320" height="180" fill="#ECFDF5"/><rect x="104" y="14" width="112" height="152" rx="4" fill="#fff" stroke="#A7F3D0" stroke-width="2"/>`;
    b += `<rect x="118" y="28" width="84" height="8" rx="3" fill="#059669"/>` + [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect x="118" y="${46 + i * 12}" width="${i % 3 === 2 ? 56 : 84}" height="5" rx="2" fill="#CBD5E1"/>`).join("");
    b += `<path d="M222 22h40v40" fill="none" stroke="#6EE7B7" stroke-width="3"/>`;
    return svg(320, 180, b, `Paper preview: ${r.title}`);
  }
  function tutorial(r) {
    const cs = ["#F97316", "#FB923C", "#FDBA74", "#3B82F6", "#22C55E", "#A855F7"];
    let b = `<rect width="320" height="180" fill="#FFF7ED"/>`;
    for (let i = 0; i < 6; i++) b += `<rect x="${20 + (i % 3) * 96}" y="${20 + Math.floor(i / 3) * 74}" width="86" height="64" rx="10" fill="${cs[(i + r.seed) % 6]}" opacity="${i === 0 ? 1 : 0.75}"/><text x="${32 + (i % 3) * 96}" y="${48 + Math.floor(i / 3) * 74}" font-size="13" font-weight="700" fill="#fff" font-family="Inter, sans-serif">${String(i + 1).padStart(2, "0")}</text>`;
    b += `<text x="32" y="${74}" font-size="11" fill="#fff" font-family="ui-monospace, monospace">{ api }</text>`;
    return svg(320, 180, b, `Tutorial modules preview: ${r.title}`);
  }
  function podcast(r) {
    const [bg, fg] = PAL[r.seed % PAL.length];
    let b = `<rect width="320" height="180" fill="${bg}"/>`;
    for (let i = 0; i < 40; i++) { const h = 10 + Math.abs(Math.sin(i * 0.7 + r.seed)) * 70; b += `<rect x="${20 + i * 7}" y="${90 - h / 2}" width="4" height="${h}" rx="2" fill="${fg}"/>`; }
    return svg(320, 180, b, `Podcast episode art: ${r.title}`);
  }
  function thumb(r) { return r.type === "ebook" ? cover(r) : r.type === "video" ? video(r) : r.type === "paper" ? paper(r) : r.type === "tutorial" ? tutorial(r) : podcast(r); }
  window.Art = { thumb, cover };
})();
