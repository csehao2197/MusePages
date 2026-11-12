// Original SVG illustrations standing in for the illustrator's artwork (no licensed images are bundled).
// Each piece is generated from a motif + palette; `Art.piece(id, {w,h,crop,alt})` returns an <svg> string.
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const rnd = (s) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const grain = (gid) => `<filter id="${gid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .07 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
  const sky = (gid, a, b, c) => `<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c || b}"/></linearGradient>`;
  const stars = (r, W, H, n, c = "#FFF7E0") => Array.from({ length: n }, () => `<circle cx="${r() * W}" cy="${r() * H * 0.6}" r="${0.8 + r() * 2.2}" fill="${c}" opacity="${0.4 + r() * 0.6}"/>`).join("");
  const flower = (x, y, s, petal, core, n = 6) => `<g transform="translate(${x} ${y}) scale(${s})">${Array.from({ length: n }, (_, i) => `<ellipse rx="9" ry="20" cy="-16" transform="rotate(${(360 / n) * i})" fill="${petal}"/>`).join("")}<circle r="8" fill="${core}"/></g>`;
  const leaf = (x, y, s, rot, c) => `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0 C 18 -30 52 -36 70 -30 C 54 -6 26 6 0 0Z" fill="${c}"/>`;
  const stem = (x, y, h, c, bend = 20) => `<path d="M${x} ${y} q ${bend} ${-h / 2} 0 ${-h}" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const bird = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-20 0 Q -10 -10 0 0 Q 10 -10 20 0" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const hills = (W, H, y, c, amp, r) => { let d = `M0 ${H} V${y}`; for (let x = 0; x <= W; x += W / 6) d += ` Q ${x + W / 12} ${y - amp * (0.5 + r())} ${x + W / 6} ${y + (r() - 0.5) * amp * 0.4}`; return `<path d="${d} V${H}Z" fill="${c}"/>`; };
  const figure = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><circle cy="-62" r="12"/><path d="M-14 -48 h28 l6 48 h-40z"/></g>`;

  const M = {
    garden(W, H, P, r) { // The Midnight Garden
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>${stars(r, W, H, 70)}<circle cx="${W * 0.7}" cy="${H * 0.2}" r="${W * 0.12}" fill="${P[3]}"/><circle cx="${W * 0.66}" cy="${H * 0.18}" r="${W * 0.11}" fill="url(#S)" opacity=".25"/>`;
      o += hills(W, H, H * 0.72, P[1], H * 0.06, r);
      for (let i = 0; i < 26; i++) { const x = r() * W, y = H * (0.68 + r() * 0.3), h = 60 + r() * H * 0.25; o += stem(x, y, h, P[2], (r() - 0.5) * 50) + leaf(x, y - h * 0.4, 0.6 + r() * 0.5, -40 - r() * 60, P[2]) + flower(x, y - h, 0.7 + r() * 1.1, [P[3], P[4], "#F4E3F0"][i % 3], P[5]); }
      o += `<path d="M${W * 0.46} ${H} C ${W * 0.47} ${H * 0.85} ${W * 0.52} ${H * 0.8} ${W * 0.5} ${H * 0.7}" stroke="${P[4]}" stroke-width="5" fill="none" opacity=".5"/>` + figure(W * 0.5, H * 0.72, 1.3, "#0B0B1E");
      return o;
    },
    ai(W, H, P, r) { // AI issue
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/>`;
      const nodes = Array.from({ length: 40 }, () => [W * (0.1 + r() * 0.8), H * (0.1 + r() * 0.8)]);
      nodes.forEach(([x, y], i) => nodes.slice(i + 1, i + 4).forEach(([x2, y2]) => { o += `<path d="M${x} ${y} L${x2} ${y2}" stroke="${P[2]}" stroke-width="1.5" opacity=".5"/>`; }));
      o += `<path d="M${W * 0.36} ${H * 0.85} C ${W * 0.2} ${H * 0.6} ${W * 0.28} ${H * 0.2} ${W * 0.5} ${H * 0.16} C ${W * 0.7} ${H * 0.14} ${W * 0.78} ${H * 0.4} ${W * 0.66} ${H * 0.58} L ${W * 0.7} ${H * 0.7} L ${W * 0.62} ${H * 0.72} L ${W * 0.6} ${H * 0.85}Z" fill="${P[1]}" opacity=".9"/>`;
      nodes.forEach(([x, y], i) => { o += `<circle cx="${x}" cy="${y}" r="${4 + (i % 4) * 2}" fill="${[P[3], P[4], "#fff"][i % 3]}"/>`; });
      o += `<circle cx="${W * 0.55}" cy="${H * 0.36}" r="${W * 0.05}" fill="${P[3]}"/><circle cx="${W * 0.55}" cy="${H * 0.36}" r="${W * 0.02}" fill="${P[0]}"/>`;
      return o;
    },
    coffee(W, H, P) { // Fauna Coffee
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/><circle cx="${W / 2}" cy="${H * 0.45}" r="${W * 0.32}" fill="${P[1]}"/>`;
      o += `<path d="M${W * 0.33} ${H * 0.42} h${W * 0.34} l-${W * 0.04} ${H * 0.36} h-${W * 0.26}z" fill="${P[4]}"/><path d="M${W * 0.67} ${H * 0.48} q ${W * 0.1} 0 ${W * 0.06} ${H * 0.1} q -${W * 0.03} ${H * 0.06} -${W * 0.09} ${H * 0.04}" stroke="${P[4]}" stroke-width="${W * 0.025}" fill="none"/>`;
      o += `<g transform="translate(${W / 2} ${H * 0.6})"><path d="M-${W * 0.09} 0 L -${W * 0.06} -${W * 0.1} L -${W * 0.02} -${W * 0.04} L ${W * 0.02} -${W * 0.04} L ${W * 0.06} -${W * 0.1} L ${W * 0.09} 0 L 0 ${W * 0.08}Z" fill="${P[2]}"/><path d="M-${W * 0.05} ${W * 0.01} L 0 ${W * 0.08} L ${W * 0.05} ${W * 0.01}Z" fill="#fff"/><circle cx="-${W * 0.035}" cy="-${W * 0.005}" r="${W * 0.01}" fill="${P[5]}"/><circle cx="${W * 0.035}" cy="-${W * 0.005}" r="${W * 0.01}" fill="${P[5]}"/></g>`;
      o += `<path d="M${W * 0.42} ${H * 0.36} q 10 -30 0 -60 M${W * 0.5} ${H * 0.36} q 10 -30 0 -60 M${W * 0.58} ${H * 0.36} q 10 -30 0 -60" stroke="${P[3]}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>`;
      o += `<text x="${W / 2}" y="${H * 0.9}" text-anchor="middle" font-family="Georgia, serif" font-size="${W * 0.07}" fill="${P[4]}" letter-spacing="${W * 0.012}">FAUNA</text>`;
      return o;
    },
    migration(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/><circle cx="${W * 0.3}" cy="${H * 0.3}" r="${W * 0.18}" fill="${P[3]}" opacity=".85"/>`;
      for (let i = 0; i < 9; i++) o += `<path d="M0 ${H * (0.45 + i * 0.06)} C ${W * 0.3} ${H * (0.4 + i * 0.07)} ${W * 0.6} ${H * (0.52 + i * 0.05)} ${W} ${H * (0.46 + i * 0.065)}" stroke="${[P[1], P[2], P[4]][i % 3]}" stroke-width="${10 + i * 2}" fill="none" opacity=".7"/>`;
      for (let i = 0; i < 40; i++) o += bird(W * (0.2 + r() * 0.7 + i * 0.004), H * (0.12 + r() * 0.3 + i * 0.003), 0.6 + r() * 0.9, P[5]);
      return o;
    },
    solitude(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>${stars(r, W, H, 30)}`;
      for (let i = 0; i < 7; i++) { const x = i * W / 6 - W * 0.05, w = W * (0.16 + r() * 0.1), h = H * (0.35 + r() * 0.4); o += `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="${i % 2 ? P[1] : P[2]}"/>`; for (let wy = H - h + 20; wy < H - 20; wy += 34) for (let wx = x + 12; wx < x + w - 16; wx += 26) if (r() > 0.75) o += `<rect x="${wx}" y="${wy}" width="12" height="18" fill="${P[3]}" opacity=".8"/>`; }
      const bx = W * 0.32, by = H * 0.38, bw = W * 0.36, bh = H * 0.3;
      o += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${P[3]}"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="none" stroke="${P[0]}" stroke-width="10"/><path d="M${bx + bw / 2} ${by} V${by + bh}" stroke="${P[0]}" stroke-width="6"/>` + figure(bx + bw * 0.3, by + bh, 1.6, P[0]) + `<rect x="${bx + bw * 0.55}" y="${by + bh * 0.6}" width="${bw * 0.2}" height="${bh * 0.1}" fill="${P[0]}"/><path d="M${bx + bw * 0.62} ${by + bh * 0.6} q 6 -18 0 -30" stroke="${P[0]}" stroke-width="3" fill="none"/>`;
      return o;
    },
    dream(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>${stars(r, W, H, 50)}<circle cx="${W * 0.5}" cy="${H * 0.36}" r="${H * 0.16}" fill="${P[3]}"><animate attributeName="r" values="${H * 0.16};${H * 0.175};${H * 0.16}" dur="6s" repeatCount="indefinite"/></circle>`;
      for (let i = 0; i < 6; i++) { const y = H * (0.5 + i * 0.08); o += `<path d="M-50 ${y} q ${W * 0.12} -40 ${W * 0.25} 0 t ${W * 0.25} 0 t ${W * 0.25} 0 t ${W * 0.25} 0 t ${W * 0.25} 0" fill="none" stroke="${[P[1], P[2], P[4]][i % 3]}" stroke-width="${18 - i}" opacity=".75"><animateTransform attributeName="transform" type="translate" values="0 0;${-W * 0.25} 0" dur="${8 + i * 2}s" repeatCount="indefinite"/></path>`; }
      o += `<g><path d="M${W * 0.45} ${H * 0.62} l${W * 0.05} -${H * 0.05} l${W * 0.05} ${H * 0.05}z" fill="${P[5]}"/><animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0" dur="4s" repeatCount="indefinite"/></g>`;
      return o;
    },
    herbarium(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/><rect x="${W * 0.06}" y="${H * 0.06}" width="${W * 0.88}" height="${H * 0.88}" fill="none" stroke="${P[1]}" stroke-width="2"/>`;
      for (let i = 0; i < 6; i++) { const cx = W * (0.22 + (i % 3) * 0.28), cy = H * (0.38 + Math.floor(i / 3) * 0.38), h = H * 0.22; o += stem(cx, cy + h * 0.4, h, P[2], (r() - 0.5) * 30) + leaf(cx, cy, 0.7, -30, P[2]) + leaf(cx, cy + 20, 0.6, -150, P[2]) + flower(cx, cy - h * 0.6, 1, [P[3], P[4], P[5]][i % 3], P[1], 5 + (i % 3)) + `<text x="${cx}" y="${cy + h * 0.55}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="${W * 0.026}" fill="${P[1]}">${["Viola", "Achillea", "Papaver", "Borago", "Lupinus", "Malva"][i]}</text>`; }
      return o;
    },
    ruins(W, H, P, r) { // The Lost City
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/><circle cx="${W * 0.5}" cy="${H * 0.3}" r="${W * 0.2}" fill="${P[3]}" opacity=".9"/>`;
      o += `<path d="M${W * 0.2} ${H * 0.8} L${W * 0.5} ${H * 0.28} L${W * 0.8} ${H * 0.8}Z" fill="${P[1]}"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${W * (0.2 + i * 0.05)} ${H * (0.8 - i * 0.087)} H${W * (0.8 - i * 0.05)}" stroke="${P[2]}" stroke-width="5"/>`).join("")}<rect x="${W * 0.46}" y="${H * 0.36}" width="${W * 0.08}" height="${H * 0.08}" fill="${P[0]}"/>`;
      for (let i = 0; i < 18; i++) { const x = r() * W, y = H * (0.75 + r() * 0.25); o += `<path d="M${x} ${H} V${y}" stroke="${P[4]}" stroke-width="6"/>` + [0, 1, 2, 3].map((k) => leaf(x, y, 0.9 + r() * 0.6, -20 - k * 45, P[4])).join(""); }
      return o;
    },
    oats(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/><path d="M0 ${H * 0.7} Q ${W * 0.5} ${H * 0.55} ${W} ${H * 0.7} V${H} H0Z" fill="${P[1]}"/>`;
      for (let i = 0; i < 5; i++) { const x = W * (0.12 + i * 0.19), y = H * 0.62 - (i % 2) * 30; o += `<g transform="translate(${x} ${y})"><ellipse rx="${W * 0.05}" ry="${W * 0.08}" fill="${P[3]}" stroke="${P[5]}" stroke-width="4"/><circle cx="-12" cy="-10" r="5" fill="${P[5]}"/><circle cx="12" cy="-10" r="5" fill="${P[5]}"/><path d="M-12 12 q 12 12 24 0" stroke="${P[5]}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-${W * 0.05} 10 l-24 ${16 + (i % 3) * 8} M${W * 0.05} 10 l24 ${-10 - (i % 2) * 14}" stroke="${P[5]}" stroke-width="5" stroke-linecap="round"/></g>`; }
      o += `<text x="${W * 0.06}" y="${H * 0.2}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${W * 0.07}" fill="${P[5]}">GOOD MORNINGS</text><text x="${W * 0.06}" y="${H * 0.29}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${W * 0.07}" fill="${P[4]}">START WITH OATS.</text>`;
      return o;
    },
    deep(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>`;
      for (let i = 0; i < 40; i++) o += `<circle cx="${r() * W}" cy="${r() * H}" r="${1 + r() * 3}" fill="${P[3]}" opacity="${0.2 + r() * 0.5}"/>`;
      for (let i = 0; i < 5; i++) { const x = W * (0.15 + i * 0.18), y = H * (0.2 + (i % 3) * 0.2), s = 0.7 + (i % 2) * 0.6; o += `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0 Q 0 -70 50 0Z" fill="${[P[3], P[4], P[5]][i % 3]}" opacity=".85"/>${Array.from({ length: 6 }, (_, k) => `<path d="M${-40 + k * 16} 0 q 10 40 -4 ${80 + k * 10} q -12 30 4 70" stroke="${[P[3], P[4], P[5]][i % 3]}" stroke-width="3" fill="none" opacity=".7"/>`).join("")}</g>`; }
      o += `<g transform="translate(${W * 0.6} ${H * 0.82})"><path d="M-120 0 q 60 -60 160 -10 q 30 -30 50 -10 q -10 20 -50 20 q -90 40 -160 0z" fill="${P[2]}"/><circle cx="20" cy="-14" r="5" fill="${P[3]}"/></g>`;
      return o;
    },
    quantum(W, H, P) {
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/>`;
      for (let i = 0; i < 5; i++) o += `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * 0.36}" ry="${H * 0.12}" transform="rotate(${i * 36} ${W / 2} ${H / 2})" fill="none" stroke="${[P[1], P[2], P[3]][i % 3]}" stroke-width="3"/>`;
      o += `<circle cx="${W / 2}" cy="${H / 2}" r="${H * 0.1}" fill="${P[4]}"/><circle cx="${W / 2}" cy="${H / 2}" r="${H * 0.18}" fill="${P[4]}" opacity=".15"/>`;
      for (let i = 0; i < 5; i++) { const a = (i * 72 * Math.PI) / 180; o += `<circle cx="${W / 2 + Math.cos(a) * W * 0.32}" cy="${H / 2 + Math.sin(a) * H * 0.3}" r="${H * 0.03}" fill="${P[5]}"/>`; }
      o += `<path d="M${W * 0.08} ${H * 0.85} h${W * 0.25} M${W * 0.08} ${H * 0.9} h${W * 0.16}" stroke="${P[2]}" stroke-width="4"/><text x="${W * 0.08}" y="${H * 0.18}" font-family="Courier New, monospace" font-size="${H * 0.06}" fill="${P[3]}">|ψ⟩ = α|0⟩ + β|1⟩</text>`;
      return o;
    },
    tea(W, H, P) {
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/>`;
      [[0.18, P[1]], [0.5, P[2]], [0.82, P[4]]].forEach(([fx, c], i) => { const x = W * fx; o += `<rect x="${x - W * 0.12}" y="${H * 0.3}" width="${W * 0.24}" height="${H * 0.5}" rx="12" fill="${c}"/><rect x="${x - W * 0.13}" y="${H * 0.26}" width="${W * 0.26}" height="${H * 0.07}" rx="8" fill="${P[5]}"/><circle cx="${x}" cy="${H * 0.5}" r="${W * 0.07}" fill="${P[3]}"/><circle cx="${x + W * 0.025}" cy="${H * 0.49}" r="${W * 0.06}" fill="${c}"/><text x="${x}" y="${H * 0.7}" text-anchor="middle" font-family="Georgia, serif" font-size="${W * 0.035}" fill="${P[3]}" letter-spacing="3">${["DUSK", "LUNA", "DAWN"][i]}</text>`; });
      return o;
    },
    desert(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/><circle cx="${W * 0.7}" cy="${H * 0.35}" r="${W * 0.14}" fill="${P[3]}"/>` + hills(W, H, H * 0.62, P[1], H * 0.1, r) + hills(W, H, H * 0.74, P[2], H * 0.08, r);
      for (let i = 0; i < 9; i++) { const x = W * (0.08 + i * 0.11), y = H * (0.82 + (i % 3) * 0.05); o += `<path d="M${x} ${y} v-${40 + (i % 3) * 20}" stroke="${P[4]}" stroke-width="10" stroke-linecap="round"/>` + flower(x, y - 50 - (i % 3) * 20, 0.6, P[5], P[3], 5); }
      return o;
    },
    city(W, H, P, r) { // night shift / tidepool etc generic
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>`;
      for (let i = 0; i < 12; i++) { const x = (i / 12) * W, h = H * (0.2 + r() * 0.5); o += `<rect x="${x}" y="${H - h}" width="${W / 12 + 2}" height="${h}" fill="${i % 2 ? P[1] : P[2]}"/>`; }
      o += `<path d="M0 ${H * 0.8} H${W}" stroke="${P[3]}" stroke-width="3"/>` + Array.from({ length: 8 }, (_, i) => `<circle cx="${W * (0.08 + i * 0.12)}" cy="${H * 0.8}" r="${H * 0.03}" fill="${P[3]}" opacity=".9"/>`).join("") + figure(W * 0.4, H * 0.92, 1.4, P[0]) + figure(W * 0.62, H * 0.92, 1.2, P[0]);
      return o;
    },
    tide(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>`;
      for (let i = 0; i < 14; i++) o += `<ellipse cx="${r() * W}" cy="${H * (0.5 + r() * 0.45)}" rx="${W * (0.05 + r() * 0.08)}" ry="${H * (0.02 + r() * 0.04)}" fill="${[P[1], P[2]][i % 2]}"/>`;
      for (let i = 0; i < 6; i++) { const x = W * (0.15 + r() * 0.7), y = H * (0.55 + r() * 0.35); o += `<g transform="translate(${x} ${y})">${Array.from({ length: 5 }, (_, k) => `<path d="M0 0 L ${Math.cos((k * 72 - 90) * Math.PI / 180) * 26} ${Math.sin((k * 72 - 90) * Math.PI / 180) * 26}" stroke="${P[4]}" stroke-width="10" stroke-linecap="round"/>`).join("")}</g>`; }
      o += `<text x="${W / 2}" y="${H * 0.2}" text-anchor="middle" font-family="Georgia, serif" font-size="${W * 0.08}" fill="${P[5]}">Tidepool</text><text x="${W / 2}" y="${H * 0.27}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="${W * 0.045}" fill="${P[5]}">Stories</text>`;
      return o;
    },
    kites(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>` + hills(W, H, H * 0.82, P[1], H * 0.05, r);
      for (let i = 0; i < 6; i++) { const x = W * (0.1 + i * 0.15), y = H * (0.18 + r() * 0.35), s = 0.7 + r() * 0.6; o += `<g transform="translate(${x} ${y}) scale(${s}) rotate(${(r() - 0.5) * 40})"><path d="M0 -40 L28 0 L0 50 L-28 0Z" fill="${[P[3], P[4], P[5]][i % 3]}"/><path d="M0 -40 V50 M-28 0 H28" stroke="#fff" stroke-width="2" opacity=".7"/><path d="M0 50 q 20 40 -10 80 q -20 30 10 60" stroke="${P[2]}" stroke-width="2" fill="none"/></g>`; }
      return o;
    },
    paper(W, H, P, r) { // Paper Moon (motion)
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>${stars(r, W, H, 40)}<g><circle cx="${W * 0.5}" cy="${H * 0.4}" r="${H * 0.2}" fill="${P[3]}"/><circle cx="${W * 0.56}" cy="${H * 0.36}" r="${H * 0.18}" fill="url(#S)"/><animateTransform attributeName="transform" type="rotate" values="-4 ${W / 2} ${H / 2};4 ${W / 2} ${H / 2};-4 ${W / 2} ${H / 2}" dur="7s" repeatCount="indefinite"/></g>`;
      o += hills(W, H, H * 0.8, P[1], H * 0.06, r) + `<path d="M${W * 0.2} ${H * 0.82} q ${W * 0.3} -60 ${W * 0.6} 0" stroke="${P[4]}" stroke-width="3" fill="none" stroke-dasharray="8 8"><animate attributeName="stroke-dashoffset" values="0;-32" dur="2s" repeatCount="indefinite"/></path>`;
      return o;
    },
    fox(W, H, P, r) {
      let o = `<rect width="${W}" height="${H}" fill="${P[0]}"/>`;
      for (let i = 0; i < 30; i++) o += leaf(r() * W, r() * H, 0.8 + r(), r() * 360, [P[1], P[2]][i % 2]);
      o += `<g transform="translate(${W / 2} ${H * 0.55}) scale(${W / 500})"><path d="M-90 40 L-70 -60 L-30 -20 L30 -20 L70 -60 L90 40 L0 110Z" fill="${P[3]}"/><path d="M-50 50 L0 110 L50 50Z" fill="#FFF5E8"/><circle cx="-34" cy="20" r="8" fill="${P[5]}"/><circle cx="34" cy="20" r="8" fill="${P[5]}"/><circle cx="0" cy="100" r="9" fill="${P[5]}"/></g>`;
      return o;
    },
    rain(W, H, P, r) { // Rainy Season (motion)
      let o = `<rect width="${W}" height="${H}" fill="url(#S)"/>`;
      for (let i = 0; i < 4; i++) o += `<g transform="translate(${W * (0.15 + i * 0.24)} ${H * (0.55 + (i % 2) * 0.1)})"><path d="M-60 0 Q 0 -70 60 0Z" fill="${[P[3], P[4], P[5]][i % 3]}"/><path d="M0 0 V70 q 0 14 -12 14" stroke="${P[0]}" stroke-width="5" fill="none"/></g>`;
      for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * H; o += `<path d="M${x} ${y} l-6 18" stroke="${P[2]}" stroke-width="2" opacity=".7"><animateTransform attributeName="transform" type="translate" values="0 ${-H * 0.1};0 ${H * 0.2}" dur="${1 + r()}s" repeatCount="indefinite"/></path>`; }
      return o;
    },
  };

  const PAL = {
    garden: ["#0D1B3E", "#1B2B4A", "#2F5B4A", "#F6D27A", "#E58FB0", "#F2A65A", "#203364"],
    ai: ["#0F172A", "#E11D48", "#64748B", "#FACC15", "#38BDF8", "#fff"],
    coffee: ["#F4E9DA", "#E9C9A5", "#C2410C", "#8A5A3C", "#3B2A20", "#1A1A1A"],
    migration: ["#F7D9C4", "#E8A87C", "#C38D9E", "#F4F0E6", "#41B3A3", "#2B2D42", "#FBE3D4"],
    solitude: ["#111827", "#1F2937", "#374151", "#FBBF24", "#0B1022", "#1E293B", "#334155"],
    dream: ["#1E1B4B", "#7C3AED", "#EC4899", "#FDE68A", "#38BDF8", "#F9FAFB", "#312E81"],
    herbarium: ["#F7F1E3", "#7C6A4E", "#5B7B4A", "#B5446E", "#E3A72F", "#6C8EBF"],
    ruins: ["#1F2937", "#B45309", "#92400E", "#FDE68A", "#166534", "#F59E0B", "#FCD34D"],
    oats: ["#F5F0E1", "#C8D9B9", "#E11D48", "#FFF7E0", "#2563EB", "#1A1A1A"],
    deep: ["#020617", "#0C4A6E", "#155E75", "#67E8F9", "#F0ABFC", "#FDE68A", "#0E7490"],
    quantum: ["#0A0A0A", "#22D3EE", "#A78BFA", "#F472B6", "#F8FAFC", "#FACC15"],
    tea: ["#EDE7F6", "#4C1D95", "#1E3A8A", "#FDE68A", "#7C2D12", "#1A1A1A"],
    desert: ["#FDE68A", "#F59E0B", "#B45309", "#FEF3C7", "#166534", "#E11D48", "#FB923C"],
    city: ["#0B1022", "#1E293B", "#334155", "#FBBF24", "#FB7185", "#1A1A1A", "#475569"],
    tide: ["#CFFAFE", "#5EEAD4", "#2DD4BF", "#0E7490", "#F97316", "#134E4A", "#A5F3FC"],
    kites: ["#BAE6FD", "#86EFAC", "#334155", "#E11D48", "#F59E0B", "#7C3AED", "#E0F2FE"],
    paper: ["#0F172A", "#1E293B", "#334155", "#FEF3C7", "#F472B6", "#fff", "#312E81"],
    fox: ["#14532D", "#166534", "#3F6212", "#EA580C", "#FDE68A", "#1A1A1A"],
    rain: ["#1A1A1A", "#334155", "#94A3B8", "#E11D48", "#F59E0B", "#38BDF8", "#475569"],
  };
  const SKY = { garden: [0, 6, 1], migration: [6, 0, 1], solitude: [4, 5, 6], dream: [0, 6, 1], ruins: [6, 5, 1], deep: [6, 1, 0], desert: [6, 0, 0], city: [0, 6, 1], tide: [6, 0, 0], kites: [6, 0, 0], paper: [0, 6, 1], rain: [6, 1, 0] };

  function piece(motif, { w = 1200, h = 1500, crop, alt = "", variant = 0, seed = 7, label } = {}) {
    const P = PAL[motif].slice();
    if (variant === 1) { const t = P[3]; P[3] = P[4] || t; P[4] = t; } // alternate colourway
    const r = rnd(seed * 97 + motif.length * 13), S = id("s"), G = id("g");
    const sk = SKY[motif] || [0, 0, 0];
    const defs = sky("S", P[sk[0]] || P[0], P[sk[1]] || P[0], P[sk[2]] || P[1]).replace('id="S"', `id="${S}"`) + grain(G);
    const body = M[motif](w, h, P, r).replace(/url\(#S\)/g, `url(#${S})`);
    const vb = crop ? crop.map((v, i) => v * (i % 2 ? h : w)).join(" ") : `0 0 ${w} ${h}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${(label || alt).replace(/"/g, "&quot;")}"><defs>${defs}</defs>${body}<rect width="${w}" height="${h}" filter="url(#${G})"/></svg>`;
  }

  function portrait() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Maya in her sunlit studio, smiling while she sketches at a drafting table surrounded by plants and pinned-up prints"><defs><linearGradient id="pw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6D6B0"/><stop offset="1" stop-color="#E9A87C"/></linearGradient></defs>
      <rect width="800" height="1000" fill="url(#pw)"/><rect x="460" y="80" width="280" height="380" fill="#FFF3DA" opacity=".8"/><path d="M600 80 V460 M460 270 H740" stroke="#D69A6A" stroke-width="8"/>
      <rect x="70" y="120" width="140" height="180" fill="#0D1B3E"/><circle cx="160" cy="170" r="26" fill="#F6D27A"/><rect x="230" y="150" width="120" height="120" fill="#F7F1E3"/><circle cx="290" cy="210" r="20" fill="#B5446E"/>
      <path d="M690 980 q -60 -140 10 -260 q 70 120 10 260z" fill="#3F6B3A"/><path d="M700 980 q -10 -180 -80 -240 M700 980 q 30 -200 80 -230" stroke="#2F5A33" stroke-width="10" fill="none"/>
      <path d="M180 1000 Q 200 700 360 680 Q 520 700 540 1000Z" fill="#E11D48" opacity=".9"/><rect x="330" y="560" width="64" height="120" fill="#B97A57"/>
      <ellipse cx="362" cy="470" rx="104" ry="120" fill="#C98B64"/><path d="M252 470 Q 240 320 366 320 Q 500 320 478 470 Q 492 600 520 660 Q 450 640 452 470 Q 420 400 362 396 Q 300 400 280 470 Q 280 600 220 660 Q 252 590 252 470Z" fill="#2B1A12"/>
      <path d="M326 520 q 36 26 72 0" stroke="#8E4E36" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M310 462 q 18 -10 36 0 M378 462 q 18 -10 36 0" stroke="#2B1A12" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="120" y="780" width="560" height="26" fill="#8A5A3C" transform="rotate(-6 400 793)"/><path d="M380 760 l90 -40" stroke="#1A1A1A" stroke-width="8" stroke-linecap="round"/><rect x="160" y="700" width="200" height="80" fill="#FFF7E8" transform="rotate(-6 260 740)"/></svg>`;
  }

  window.Art = { piece, portrait };
})();
