// Illustrated SVG scenes used in place of property photography (no licensed photos are bundled).
(function () {
  const tones = {
    morning: { sky: ["#BFE3F2", "#E6F4F7", "#FCEBD2"], sea: "#38BDD8", deep: "#0E7490", sun: "#FDE7B0", sunY: 0.32, light: "#FFF9EE", tint: "#FDE7B0", tintOp: 0.08, wall: "#F4EEE4" },
    day: { sky: ["#5BB8DE", "#9AD5EA", "#E3F3F7"], sea: "#16A6C6", deep: "#0B6F8A", sun: "#FFF6D9", sunY: 0.18, light: "#FFFFFF", tint: "#FFFFFF", tintOp: 0, wall: "#F6F1E8" },
    dusk: { sky: ["#27405F", "#C9677A", "#F6B26B"], sea: "#2B6F86", deep: "#163F55", sun: "#FFD08A", sunY: 0.5, light: "#FFE2B8", tint: "#F59E0B", tintOp: 0.1, wall: "#EBDDCB" },
  };
  let uid = 0;
  const rng = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  const sky = (t, h, id) => `<defs><linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sky[0]}"/><stop offset=".6" stop-color="${t.sky[1]}"/><stop offset="1" stop-color="${t.sky[2]}"/></linearGradient>
    <linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.sea}"/><stop offset="1" stop-color="${t.deep}"/></linearGradient></defs>
    <rect width="800" height="${h}" fill="url(#s${id})"/>`;
  const sea = (y, id, h = 600) => {
    let lines = "";
    for (let i = 0; i < 7; i++) {
      const yy = y + 6 + i * i * 4;
      if (yy < h) lines += `<path d="M${-20 + i * 37} ${yy} q 40 -3 80 0 t 80 0" stroke="#fff" stroke-opacity="${0.35 - i * 0.035}" stroke-width="2" fill="none"/><path d="M${380 + i * 23} ${yy + 3} q 30 -3 60 0" stroke="#fff" stroke-opacity="${0.3 - i * 0.03}" stroke-width="2" fill="none"/>`;
    }
    return `<rect y="${y}" width="800" height="${h - y}" fill="url(#w${id})"/>${lines}`;
  };
  const sun = (t, x, h) => `<circle cx="${x}" cy="${h * t.sunY}" r="34" fill="${t.sun}" opacity=".9"/><circle cx="${x}" cy="${h * t.sunY}" r="70" fill="${t.sun}" opacity=".18"/>`;
  const palm = (x, y, s = 1, c = "#1F5E3B", trunk = "#7A5A3A", lean = 1) => {
    const top = [x + 30 * lean * s, y - 230 * s];
    let fronds = "";
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI + (i / 6) * Math.PI;
      const ex = top[0] + Math.cos(a) * 120 * s, ey = top[1] + Math.sin(a) * 40 * s + 50 * s;
      const cx = top[0] + Math.cos(a) * 60 * s, cy = top[1] - 40 * s;
      fronds += `<path d="M${top[0]} ${top[1]} Q ${cx} ${cy} ${ex} ${ey} Q ${cx} ${cy + 26 * s} ${top[0]} ${top[1]}" fill="${c}"/>`;
    }
    return `<path d="M${x} ${y} Q ${x + 6 * lean * s} ${y - 120 * s} ${top[0]} ${top[1]}" stroke="${trunk}" stroke-width="${11 * s}" fill="none" stroke-linecap="round"/>${fronds}`;
  };
  const bush = (x, y, w, seed, colors = ["#2F6B45", "#3F8A57", "#24563A"]) => {
    const r = rng(seed); let out = "";
    for (let i = 0; i < 9; i++) out += `<ellipse cx="${x + r() * w}" cy="${y - r() * 40}" rx="${26 + r() * 30}" ry="${20 + r() * 22}" fill="${colors[i % 3]}"/>`;
    return out;
  };
  const monstera = (x, y, s = 1) => {
    let out = `<path d="M${x} ${y} v${-70 * s}" stroke="#2E5E3E" stroke-width="3"/>`;
    [[-40, -110, -20], [30, -120, 25], [-5, -150, 0], [45, -80, 40], [-50, -70, -40]].forEach(([dx, dy, rot]) => {
      out += `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${26 * s}" ry="${38 * s}" transform="rotate(${rot} ${x + dx * s} ${y + dy * s})" fill="#2F7A4C"/><path d="M${x + dx * s} ${y + (dy - 30) * s} L${x + dx * s} ${y + (dy + 30) * s}" stroke="#235C39" stroke-width="2" transform="rotate(${rot} ${x + dx * s} ${y + dy * s})"/>`;
    });
    return out;
  };
  const pot = (x, y, w = 70) => `<path d="M${x - w / 2} ${y - w * 0.8} h${w} l-8 ${w * 0.8} h${-w + 16} z" fill="#B9845A"/>`;
  const woodFloor = (y, c1 = "#C69C6D", c2 = "#B98C5E") => {
    let out = `<rect y="${y}" width="800" height="${600 - y}" fill="${c1}"/>`;
    for (let i = -8; i < 16; i++) out += `<path d="M${400 + i * 20} ${y} L${400 + i * 90} 600" stroke="${c2}" stroke-width="2"/>`;
    return out;
  };
  const beams = (c = "#8A6A48") => {
    let out = `<rect width="800" height="46" fill="${c}"/>`;
    for (let i = 0; i < 9; i++) out += `<rect x="${i * 100}" y="40" width="18" height="22" fill="${c}" opacity=".85"/>`;
    return out;
  };
  const bed = (x, y, w, sheet = "#FBFAF7", throwC = "#0891B2") => `
    <rect x="${x - 10}" y="${y - 120}" width="${w + 20}" height="110" rx="8" fill="#8B6A4A"/>
    <rect x="${x}" y="${y - 40}" width="${w}" height="70" rx="10" fill="${sheet}"/>
    <rect x="${x + 16}" y="${y - 66}" width="${w / 2 - 26}" height="38" rx="14" fill="#fff"/>
    <rect x="${x + w / 2 + 10}" y="${y - 66}" width="${w / 2 - 26}" height="38" rx="14" fill="#fff"/>
    <rect x="${x}" y="${y + 6}" width="${w}" height="24" fill="${throwC}" opacity=".85"/>
    <rect x="${x}" y="${y + 30}" width="${w}" height="16" fill="#6B4E33"/>`;
  const windowView = (t, x, y, w, h, id, kind = "sea") => {
    const inner = kind === "sea"
      ? `${sky(t, 600, id)}${sun(t, 560, 420)}${sea(330, id)}`
      : kind === "pool"
        ? `${sky(t, 600, id)}<rect y="300" width="800" height="300" fill="#7BAE6E"/><rect x="120" y="360" width="560" height="160" rx="6" fill="url(#w${id})"/>${palm(90, 380, 0.9)}${palm(720, 400, 0.8, "#2A6A43", "#7A5A3A", -1)}`
        : `<rect width="800" height="600" fill="#3E7D52"/>${bush(-40, 600, 880, 7)}${bush(-40, 420, 880, 13, ["#4E9A62", "#2F6B45", "#5FAE6E"])}${bush(-20, 240, 860, 21, ["#3F8A57", "#5FAE6E", "#2F6B45"])}`;
    return `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">${inner}</svg><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#7A5A3A" stroke-width="10"/>`;
  };

  // Window glass: reflective by day, warm interior glow at dusk.
  const glass = (t, x, y, w, h) => t === tones.dusk
    ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#F7B955"/><rect x="${x}" y="${y}" width="${w}" height="${h * 0.45}" fill="#FDE3A7" opacity=".7"/><rect x="${x + w * 0.15}" y="${y + h * 0.62}" width="${w * 0.7}" height="${h * 0.38}" fill="#B9733A" opacity=".55"/><rect x="${x + w / 2 - 1}" y="${y}" width="2" height="${h}" fill="#8B6A4A"/>`
    : `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#3B6577"/><path d="M${x} ${y + h * 0.7} L${x + w * 0.55} ${y} L${x + w * 0.85} ${y} L${x} ${y + h}" fill="#fff" opacity=".18"/><rect x="${x + w / 2 - 1}" y="${y}" width="2" height="${h}" fill="#8B6A4A"/>`;

  const scenes = {
    exterior: (t, id) => `${sky(t, 600, id)}${sun(t, 600, 600)}${sea(250, id, 330)}
      <rect y="300" width="800" height="300" fill="#E9DCC6"/>
      ${palm(70, 360, 1.15)}${palm(745, 350, 1.05, "#24563A", "#7A5A3A", -1)}
      <rect x="150" y="170" width="460" height="16" fill="#8B6A4A"/>
      <rect x="170" y="186" width="420" height="104" fill="${t.wall}"/>
      ${[[200, 160], [380, 180]].map(([x, w]) => glass(t, x, 200, w, 80)).join("")}
      <rect x="110" y="290" width="560" height="18" fill="#8B6A4A"/>
      <rect x="120" y="308" width="540" height="130" fill="${t.wall}"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => glass(t, 150 + i * 84, 326, 60, 112)).join("")}
      <rect x="0" y="438" width="800" height="22" fill="#D9C9AE"/>
      <rect x="40" y="460" width="720" height="120" fill="url(#w${id})"/>
      <rect x="40" y="460" width="720" height="8" fill="#fff" opacity=".5"/>
      <path d="M60 500 q 60 -6 120 0 t 120 0 t 120 0 t 120 0 t 120 0" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>
      <path d="M90 540 q 60 -6 120 0 t 120 0 t 120 0 t 120 0" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none"/>
      <rect y="580" width="800" height="20" fill="#CDB892"/>`,
    living: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>${beams()}
      ${windowView(t, 150, 90, 500, 260, id)}
      <rect x="0" y="62" width="120" height="400" fill="#E5D8C3"/><rect x="680" y="62" width="120" height="400" fill="#E5D8C3"/>
      ${woodFloor(420)}
      <rect x="120" y="470" width="560" height="90" rx="6" fill="#E9E1D3" opacity=".7"/>
      <rect x="190" y="380" width="420" height="70" rx="18" fill="#FBFAF6"/><rect x="170" y="350" width="40" height="110" rx="14" fill="#F3EFE7"/><rect x="590" y="350" width="40" height="110" rx="14" fill="#F3EFE7"/>
      <rect x="210" y="340" width="380" height="50" rx="16" fill="#fff"/>
      <rect x="240" y="350" width="70" height="40" rx="10" fill="#0891B2" opacity=".75"/><rect x="490" y="350" width="70" height="40" rx="10" fill="#F59E0B" opacity=".75"/>
      <rect x="300" y="480" width="200" height="16" rx="4" fill="#8B6A4A"/><rect x="315" y="496" width="10" height="40" fill="#6B4E33"/><rect x="475" y="496" width="10" height="40" fill="#6B4E33"/>
      <circle cx="400" cy="470" r="14" fill="#C2410C" opacity=".8"/>
      ${pot(70, 470, 80)}${monstera(70, 400, 1.2)}${pot(735, 470, 70)}${monstera(735, 410, 1)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    bedroom: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>${beams("#7E5F40")}
      ${windowView(t, 470, 110, 280, 230, id)}
      ${woodFloor(430, "#C9A27A", "#B98F66")}
      <path d="M90 70 Q 270 40 450 70 L 470 470 L 70 470 Z" fill="#fff" opacity=".35"/>
      ${bed(110, 420, 320)}
      <path d="M90 70 L 70 470 M450 70 L 470 470 M270 52 L 270 300" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>
      <rect x="20" y="380" width="60" height="80" fill="#8B6A4A"/><rect x="34" y="350" width="30" height="30" rx="15" fill="#FDE68A" opacity=".85"/>
      <rect x="0" y="0" width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    rooftop: (t, id) => `${sky(t, 600, id)}${sun(t, 640, 600)}${sea(280, id, 420)}
      <rect y="420" width="800" height="180" fill="#C9A27A"/>
      ${[...Array(14)].map((_, i) => `<path d="M${i * 60} 420 L ${i * 60 - 40} 600" stroke="#B48B60" stroke-width="3"/>`).join("")}
      <rect y="370" width="800" height="8" fill="#8B6A4A"/>${[...Array(17)].map((_, i) => `<rect x="${i * 50}" y="370" width="5" height="52" fill="#8B6A4A"/>`).join("")}
      <rect x="230" y="440" width="380" height="90" rx="12" fill="#8B6A4A"/>
      <rect x="240" y="420" width="360" height="60" rx="14" fill="#FBFAF6"/>
      <rect x="260" y="396" width="90" height="44" rx="14" fill="#fff"/><rect x="360" y="396" width="90" height="44" rx="14" fill="#0891B2" opacity=".7"/>
      <path d="M220 300 L 620 300 L 640 430 M220 300 L 200 430" stroke="#8B6A4A" stroke-width="6" fill="none"/>
      <path d="M220 300 Q 420 330 620 300 L 610 340 Q 420 360 230 340 Z" fill="#F4EEE4" opacity=".9"/>
      ${pot(110, 470, 70)}${bush(60, 420, 100, 3)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    beachpath: (t, id) => `${sky(t, 600, id)}${sun(t, 400, 600)}${sea(250, id, 330)}
      <rect y="300" width="800" height="300" fill="#EBDDC3"/>
      ${bush(-60, 380, 260, 5)}${bush(600, 380, 260, 9)}
      ${palm(120, 470, 1.1)}${palm(700, 480, 1.2, "#24563A", "#7A5A3A", -1)}${palm(250, 360, 0.6)}${palm(560, 360, 0.65, "#2A6A43", "#7A5A3A", -1)}
      <path d="M370 300 L 430 300 L 640 600 L 160 600 Z" fill="#B48B60"/>
      ${[...Array(16)].map((_, i) => { const p = i / 15, y = 300 + p * p * 300, hw = 30 + p * 210; return `<path d="M${400 - hw} ${y} L ${400 + hw} ${y}" stroke="#8B6A4A" stroke-width="${1 + p * 4}"/>`; }).join("")}
      <path d="M370 300 L 160 600 M430 300 L 640 600" stroke="#7A5A3A" stroke-width="4"/>
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    kitchen: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>${beams()}
      ${windowView(t, 250, 90, 300, 150, id, "jungle")}
      <rect x="40" y="250" width="720" height="110" fill="#fff"/>
      ${[...Array(24)].map((_, i) => [...Array(4)].map((__, j) => `<rect x="${42 + i * 30}" y="${252 + j * 27}" width="27" height="24" fill="${(i + j) % 3 ? "#E3F2F5" : "#0891B2"}" opacity="${(i + j) % 3 ? 1 : 0.55}"/>`).join("")).join("")}
      <rect x="40" y="350" width="720" height="20" fill="#D8CDBC"/><rect x="40" y="370" width="720" height="110" fill="#8B6A4A"/>
      ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${60 + i * 118}" y="384" width="100" height="84" rx="4" fill="#9C7A55"/>`).join("")}
      ${woodFloor(480)}
      <rect x="180" y="440" width="440" height="22" fill="#EFE8DD"/><rect x="200" y="462" width="400" height="110" fill="#6B4E33"/>
      ${[260, 400, 540].map((x) => `<path d="M${x} 62 V 150" stroke="#333" stroke-width="2"/><path d="M${x - 26} 176 Q ${x} 136 ${x + 26} 176 Z" fill="#1F2937"/><ellipse cx="${x}" cy="180" rx="16" ry="6" fill="#FDE68A" opacity=".9"/>`).join("")}
      <circle cx="300" cy="430" r="18" fill="#F59E0B"/><circle cx="330" cy="434" r="14" fill="#84CC16"/><rect x="470" y="400" width="40" height="40" rx="6" fill="#334155"/>
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    pool: (t, id) => `${sky(t, 600, id)}${sun(t, 160, 600)}${sea(200, id, 280)}
      <rect y="250" width="800" height="350" fill="#E9DCC6"/>
      <path d="M60 320 L 740 320 L 800 600 L 0 600 Z" fill="url(#w${id})"/>
      <path d="M60 320 L 740 320" stroke="#fff" stroke-width="6" opacity=".7"/>
      ${[...Array(8)].map((_, i) => `<path d="M${40 + i * 30} ${360 + i * 30} q 80 -8 160 0 t 160 0 t 160 0 t 160 0" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none"/>`).join("")}
      ${[120, 300, 480].map((x) => `<path d="M${x} 300 l 120 0 l 20 -40" stroke="#fff" stroke-width="16" stroke-linecap="round" fill="none"/><rect x="${x + 4}" y="288" width="110" height="8" fill="#0891B2" opacity=".6"/>`).join("")}
      ${palm(720, 300, 0.9, "#24563A", "#7A5A3A", -1)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    jungleroom: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>${beams("#7E5F40")}
      ${windowView(t, 60, 100, 300, 260, id, "jungle")}
      ${woodFloor(440, "#C9A27A", "#B98F66")}
      ${bed(390, 430, 300, "#FBFAF7", "#3F8A57")}
      <rect x="700" y="390" width="70" height="80" fill="#8B6A4A"/><path d="M720 390 v -40 h 30 v 40" fill="#F59E0B" opacity=".7"/>
      ${pot(80, 520, 70)}${monstera(80, 450, 0.9)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    palmroom: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>${beams("#7E5F40")}
      ${windowView(t, 250, 90, 300, 200, id, "pool")}
      ${woodFloor(430, "#C9A27A", "#B98F66")}
      ${bed(80, 440, 220, "#FBFAF7", "#F59E0B")}${bed(500, 440, 220, "#FBFAF7", "#F59E0B")}
      <rect x="360" y="380" width="80" height="90" fill="#8B6A4A"/><circle cx="400" cy="360" r="18" fill="#FDE68A" opacity=".8"/>
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    palapa: (t, id) => `${sky(t, 600, id)}${sun(t, 650, 600)}${sea(280, id, 380)}
      <path d="M0 380 Q 400 350 800 380 L 800 600 L 0 600 Z" fill="#EEDFC2"/>
      <path d="M0 370 Q 400 340 800 370" stroke="#fff" stroke-width="6" opacity=".6" fill="none"/>
      <path d="M180 240 L 400 140 L 620 240 Z" fill="#C79A5B"/>
      ${[...Array(12)].map((_, i) => `<path d="M${190 + i * 37} 240 l 14 -28" stroke="#A47A42" stroke-width="3"/>`).join("")}
      <path d="M180 240 L 620 240 L 600 256 L 200 256 Z" fill="#A47A42"/>
      <rect x="220" y="250" width="12" height="230" fill="#7A5A3A"/><rect x="568" y="250" width="12" height="230" fill="#7A5A3A"/>
      <path d="M232 330 Q 400 430 568 330" stroke="#F4EEE4" stroke-width="22" fill="none"/>
      <path d="M232 330 Q 400 430 568 330" stroke="#0891B2" stroke-width="4" stroke-dasharray="10 12" fill="none"/>
      ${palm(70, 520, 1)}${palm(760, 540, 0.9, "#24563A", "#7A5A3A", -1)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    yoga: (t, id) => `<rect width="800" height="600" fill="#2F6B45"/>${bush(-60, 300, 920, 31, ["#3F8A57", "#2F6B45", "#5FAE6E"])}${bush(-60, 200, 920, 37, ["#5FAE6E", "#3F8A57", "#24563A"])}
      <rect x="0" y="0" width="800" height="120" fill="${t.sky[1]}" opacity=".55"/>
      <path d="M0 360 L 800 360 L 800 600 L 0 600 Z" fill="#C9A27A"/>
      ${[...Array(12)].map((_, i) => `<path d="M0 ${370 + i * 20} H 800" stroke="#B48B60" stroke-width="2"/>`).join("")}
      <path d="M260 430 L 540 430 L 580 520 L 220 520 Z" fill="#0891B2" opacity=".85"/>
      <circle cx="660" cy="410" r="24" fill="#FBFAF6"/><rect x="630" y="430" width="60" height="16" rx="8" fill="#F59E0B" opacity=".8"/>
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    bathroom: (t, id) => `<rect width="800" height="600" fill="#D9CBB4"/>
      ${[...Array(10)].map((_, i) => [...Array(8)].map((__, j) => `<rect x="${(j % 2 ? 40 : 0) + i * 90 - 40}" y="${j * 60}" width="86" height="56" rx="6" fill="#E6DAC6"/>`).join("")).join("")}
      ${windowView(t, 470, 70, 260, 260, id, "jungle")}
      <path d="M180 60 h 120" stroke="#334155" stroke-width="8"/><rect x="230" y="60" width="100" height="16" rx="6" fill="#334155"/>
      ${[...Array(14)].map((_, i) => `<path d="M${238 + i * 6} 84 v ${180 + (i % 3) * 40}" stroke="#BAE6FD" stroke-width="2" opacity=".8"/>`).join("")}
      <rect x="0" y="470" width="800" height="130" fill="#B5A58C"/>
      <path d="M430 420 h 330 q 0 120 -100 120 h -130 q -100 0 -100 -120 z" fill="#FBFAF6"/><path d="M430 420 h 330" stroke="#E5E7EB" stroke-width="10"/>
      ${pot(120, 530, 60)}${monstera(120, 470, 0.7)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    dining: (t, id) => `${sky(t, 600, id)}${sun(t, 200, 600)}${sea(230, id, 300)}
      <rect y="300" width="800" height="300" fill="#D9C9AE"/>
      <path d="M60 120 H 740 M60 120 V 460 M740 120 V 460" stroke="#7A5A3A" stroke-width="14"/>
      ${[...Array(12)].map((_, i) => `<rect x="${70 + i * 56}" y="112" width="12" height="40" fill="#8B6A4A"/>`).join("")}
      <path d="M60 140 Q 120 160 100 220 M740 140 Q 690 170 710 230" stroke="#2F7A4C" stroke-width="10" fill="none"/>
      ${[100, 180, 260, 340, 420, 500, 580, 660].map((x, i) => `<circle cx="${x + 20}" cy="${150 + (i % 2) * 8}" r="9" fill="#FDE68A" opacity=".85"/>`).join("")}
      <rect x="150" y="380" width="500" height="26" rx="6" fill="#8B6A4A"/><rect x="170" y="406" width="14" height="90" fill="#6B4E33"/><rect x="616" y="406" width="14" height="90" fill="#6B4E33"/>
      ${[200, 290, 380, 470, 560].map((x) => `<rect x="${x}" y="350" width="50" height="34" rx="6" fill="#F4EEE4"/>`).join("")}
      ${[190, 300, 410, 520].map((x) => `<path d="M${x} 430 h 60 v 80" stroke="#7A5A3A" stroke-width="10" fill="none"/>`).join("")}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    bikes: (t, id) => `<rect width="800" height="600" fill="${t.wall}"/>
      ${[...Array(9)].map((_, i) => [...Array(7)].map((__, j) => `<rect x="${(j % 2 ? 50 : 0) + i * 100 - 50}" y="${j * 70}" width="96" height="66" fill="#EADFCD" rx="4"/>`).join("")).join("")}
      ${bush(-20, 120, 300, 17, ["#C026D3", "#DB2777", "#3F8A57"])}${bush(540, 90, 300, 23, ["#DB2777", "#3F8A57", "#C026D3"])}
      <rect y="470" width="800" height="130" fill="#CDB892"/>
      ${[[220, "#0891B2"], [500, "#F59E0B"]].map(([x, c]) => `<circle cx="${x - 70}" cy="440" r="56" stroke="#1F2937" stroke-width="8" fill="none"/><circle cx="${x + 80}" cy="440" r="56" stroke="#1F2937" stroke-width="8" fill="none"/>
        <path d="M${x - 70} 440 L ${x - 10} 340 L ${x + 60} 340 L ${x + 80} 440 M${x - 10} 340 L ${x + 10} 440 L ${x + 60} 340 M${x - 70} 440 L ${x + 10} 440" stroke="${c}" stroke-width="10" fill="none" stroke-linejoin="round"/>
        <path d="M${x - 20} 320 h 30 M${x + 50} 310 l 20 -10 h 20" stroke="#1F2937" stroke-width="8" stroke-linecap="round"/>`).join("")}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    treehouse: (t, id) => `<rect width="800" height="600" fill="#35704A"/>${bush(-60, 600, 920, 41)}${bush(-60, 260, 920, 43, ["#4E9A62", "#3F8A57", "#2F6B45"])}
      ${sky(t, 140, id)}${sea(110, id, 150)}
      <rect x="370" y="320" width="40" height="280" fill="#6B4E33"/>
      <path d="M220 300 L 390 180 L 560 300 Z" fill="#8B6A4A"/><rect x="250" y="300" width="280" height="140" fill="#C69C6D"/>
      <rect x="290" y="330" width="80" height="70" fill="#FDE68A" opacity=".8"/><rect x="410" y="330" width="80" height="70" fill="#FDE68A" opacity=".8"/>
      <rect x="220" y="440" width="340" height="14" fill="#6B4E33"/>${[...Array(9)].map((_, i) => `<rect x="${226 + i * 40}" y="454" width="6" height="40" fill="#6B4E33"/>`).join("")}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    cabana: (t, id) => `${sky(t, 600, id)}${sun(t, 140, 600)}${sea(270, id, 360)}
      <rect y="360" width="800" height="240" fill="#EEDFC2"/>
      <path d="M200 260 Q 400 150 600 260 Z" fill="#F4EEE4"/><path d="M200 260 Q 400 200 600 260" stroke="#C2410C" stroke-width="6" fill="none" opacity=".6"/>
      <rect x="215" y="258" width="10" height="200" fill="#7A5A3A"/><rect x="575" y="258" width="10" height="200" fill="#7A5A3A"/>
      <path d="M225 262 Q 260 360 240 460 M575 262 Q 540 360 560 460" stroke="#FBFAF6" stroke-width="18" fill="none" opacity=".85"/>
      <rect x="270" y="400" width="260" height="50" rx="12" fill="#FBFAF6"/><rect x="290" y="380" width="70" height="34" rx="12" fill="#F59E0B" opacity=".8"/><rect x="440" y="380" width="70" height="34" rx="12" fill="#C2410C" opacity=".6"/>
      <ellipse cx="400" cy="480" rx="200" ry="20" fill="#D6C29C"/>
      ${palm(720, 480, 1, "#24563A", "#7A5A3A", -1)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    junglevilla: (t, id) => `<rect width="800" height="600" fill="#2F6B45"/>${sky(t, 180, id)}
      ${bush(-60, 260, 920, 51, ["#3F8A57", "#2F6B45", "#5FAE6E"])}
      <rect x="120" y="190" width="560" height="14" fill="#334155"/><rect x="140" y="204" width="520" height="190" fill="#F5F2EC"/>
      <rect x="170" y="230" width="460" height="140" fill="#334155" opacity=".75"/><rect x="170" y="230" width="460" height="140" fill="${t.light}" opacity=".25"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${280 + i * 116}" y="230" width="4" height="140" fill="#F5F2EC"/>`).join("")}
      <rect y="394" width="800" height="206" fill="#D9CBB4"/>
      <ellipse cx="400" cy="500" rx="230" ry="60" fill="#0E7490"/><ellipse cx="400" cy="495" rx="210" ry="48" fill="#22D3EE" opacity=".6"/>
      ${bush(-60, 600, 220, 57)}${bush(640, 600, 220, 59)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
    studio: (t, id) => `${sky(t, 600, id)}${sun(t, 620, 600)}${sea(300, id, 420)}
      <rect y="420" width="800" height="180" fill="#F1ECE3"/>
      <rect x="120" y="440" width="380" height="120" rx="4" fill="url(#w${id})"/><rect x="120" y="440" width="380" height="10" fill="#fff" opacity=".6"/>
      <rect x="0" y="330" width="800" height="10" fill="#E2DACB"/>
      <rect x="560" y="440" width="180" height="20" rx="10" fill="#FBFAF6"/><path d="M570 460 l -10 40 M730 460 l 10 40" stroke="#334155" stroke-width="5"/>
      <rect x="600" y="410" width="60" height="34" rx="10" fill="#F59E0B" opacity=".75"/>
      ${pot(60, 520, 60)}${bush(20, 460, 80, 61)}
      <rect width="800" height="600" fill="${t.tint}" opacity="${t.tintOp}"/>`,
  };

  function render(name, toneName = "day", label = "") {
    const t = tones[toneName] || tones.day;
    const id = `${name}${++uid}`;
    return `<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${scenes[name](t, id)}</svg>`;
  }

  // Full photo tour: 14 villa scenes at three times of day = 42 frames.
  const villa = [
    ["exterior", "Villa exterior and infinity pool"], ["living", "Open-air living room"], ["bedroom", "Master suite with canopy bed"],
    ["rooftop", "Rooftop terrace with daybed"], ["beachpath", "Private beach path"], ["kitchen", "Chef's kitchen"],
    ["pool", "Infinity pool and loungers"], ["jungleroom", "Jungle Room"], ["palmroom", "Palm Room"],
    ["palapa", "Beach palapa with hammock"], ["yoga", "Yoga deck"], ["bathroom", "Outdoor rain shower"],
    ["dining", "Outdoor dining for 8"], ["bikes", "Complimentary bicycles"],
  ];
  const tour = [];
  ["dusk", "day", "morning"].forEach((tone) => villa.forEach(([scene, caption]) => tour.push({ scene, tone, caption: `${caption} · ${tone === "dusk" ? "sunset" : tone === "day" ? "midday" : "morning light"}` })));

  window.Scenes = { render, tour };
})();
