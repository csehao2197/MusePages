// Original SVG renderings: 360° room panoramas (cylindrical, 3600×900), exteriors and video frames.
// No licensed photography is bundled; every image is drawn here.
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
  const svg = (w, h, body, defs = "", label = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"${label ? ` role="img" aria-label="${label}"` : ""}><defs>${defs}</defs>${body}</svg>`;
  const tree = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.5}" fill="#fff" opacity=".12"/>`;

  const PAL = {
    base: { living: ["#ECE6DC", "#A57C55", "#F6F3EE"], kitchen: ["#F2EFEA", "#C9B8A0", "#F8F6F2"], dining: ["#E6E0D3", "#A57C55", "#F6F3EE"], office: ["#DDE4E8", "#8E6B4A", "#F3F5F6"], primary: ["#E9E3EC", "#B79A7C", "#F7F5F8"], pbath: ["#EEF0EF", "#D3D0CA", "#F8F8F7"] },
    comp: { living: ["#E3E9E4", "#8A6A4E", "#F4F6F4"], kitchen: ["#E9EEF2", "#B7A58E", "#F5F7F9"], primary: ["#F0E6DE", "#A98A6B", "#F8F4F0"] },
  };
  const WOOD = { cab: "#F7F6F2", cabLine: "#D9D5CC", counter: "#F4F2EE", splash: "#E3E7EA" };
  const DATED = { cab: "#B9824B", cabLine: "#8C5E33", counter: "#C7B98F", splash: "#D8CFB5" };

  // ---- features (wall-local coordinates: x 0..900, y 0..900; ceiling 0–170, wall 170–650, floor 650–900) ----
  const F = {
    window(cx, o) {
      const w = (o.w || 0.5) * 900, x = cx - w / 2, sky = id("w");
      return { defs: lin(sky, [[0, "#9CC9EE"], [1, "#DCEBF5"]]), body: `<rect x="${x - 14}" y="226" width="${w + 28}" height="${348}" fill="#fff"/><rect x="${x}" y="240" width="${w}" height="320" fill="url(#${sky})"/><path d="M${x} 470 Q ${x + w * 0.3} 430 ${x + w * 0.6} 455 T ${x + w} 445 V560 H${x}Z" fill="#7FA35B"/>${tree(x + w * 0.25, 450, 48, "#4E7A3A")}${tree(x + w * 0.78, 440, 60, "#3F6B3A")}${Array.from({ length: Math.max(1, Math.round(w / 180)) - 1 }, (_, i) => `<rect x="${x + ((i + 1) * w) / Math.round(w / 180) - 4}" y="240" width="8" height="320" fill="#fff"/>`).join("")}<rect x="${x - 24}" y="574" width="${w + 48}" height="12" fill="#fff"/>` };
    },
    door(cx, o) {
      const g = id("d");
      return { defs: lin(g, [[0, "#3B3530"], [1, "#6E655C"]]), body: `<rect x="${cx - 88}" y="282" width="176" height="368" fill="#fff"/><rect x="${cx - 76}" y="294" width="152" height="356" fill="url(#${g})"/><path d="M${cx - 76} 650 L${cx - 40} 560 H${cx + 40} L${cx + 76} 650Z" fill="#000" opacity=".15"/>${o.label ? "" : ""}` };
    },
    stairs(cx) {
      let s = `<rect x="${cx - 110}" y="250" width="220" height="400" fill="#D8D2C8"/>`;
      for (let i = 0; i < 8; i++) s += `<rect x="${cx - 110 + i * 10}" y="${610 - i * 45}" width="${220 - i * 20}" height="40" fill="${i % 2 ? "#A57C55" : "#B48B63"}"/>`;
      s += `<path d="M${cx + 110} 650 L${cx + 40} 300" stroke="#3F3833" stroke-width="8"/>`;
      return { body: s };
    },
    fireplace(cx) {
      const fl = id("f");
      return { defs: `<radialGradient id="${fl}" cx=".5" cy=".9" r=".7"><stop offset="0" stop-color="#FFD27A"/><stop offset=".5" stop-color="#F28B30"/><stop offset="1" stop-color="#7A2E0E" stop-opacity="0"/></radialGradient>`, body: `<rect x="${cx - 170}" y="330" width="340" height="320" fill="#B9B2A6"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${cx - 170} ${360 + i * 36} H${cx + 170}" stroke="#A39B8E" stroke-width="2"/>`).join("")}<rect x="${cx - 190}" y="318" width="380" height="18" fill="#6B4E36"/><rect x="${cx - 95}" y="470" width="190" height="150" fill="#1C1917"/><ellipse cx="${cx}" cy="600" rx="80" ry="60" fill="url(#${fl})"/><rect x="${cx - 160}" y="200" width="320" height="100" rx="4" fill="#111827"/><rect x="${cx - 152}" y="208" width="304" height="84" fill="#1F2937"/>` };
    },
    shelves(cx, o) {
      const w = (o.w || 0.2) * 900; let s = `<rect x="${cx - w / 2}" y="190" width="${w}" height="460" fill="#F4F1EA" stroke="#D9D3C7" stroke-width="4"/>`;
      for (let r = 0; r < 6; r++) {
        const y = 210 + r * 72; s += `<rect x="${cx - w / 2 + 8}" y="${y + 58}" width="${w - 16}" height="6" fill="#D9D3C7"/>`;
        for (let b = 0; b < Math.floor((w - 30) / 22); b++) if ((b + r) % 5 !== 3) s += `<rect x="${cx - w / 2 + 14 + b * 22}" y="${y + 14 + ((b * 7 + r) % 3) * 6}" width="16" height="${44 - ((b * 7 + r) % 3) * 6}" fill="${["#1E3A5F", "#C2410C", "#E0C48C", "#475569", "#6B8E5A", "#F1EDE4"][(b + r * 2) % 6]}"/>`;
      }
      return { body: s };
    },
    sofa(cx, o) { const w = (o.w || 0.5) * 900; return { body: `<rect x="${cx - w / 2}" y="520" width="${w}" height="110" rx="20" fill="#5B6B7C"/><rect x="${cx - w / 2 - 20}" y="590" width="${w + 40}" height="110" rx="18" fill="#6B7B8C"/><rect x="${cx - w / 2 + 30}" y="540" width="90" height="60" rx="12" fill="#E0C48C"/><rect x="${cx + w / 2 - 120}" y="540" width="90" height="60" rx="12" fill="#C2410C" opacity=".8"/><ellipse cx="${cx}" cy="800" rx="${w * 0.6}" ry="60" fill="#E6DCCB" opacity=".9"/><rect x="${cx - 110}" y="740" width="220" height="30" rx="6" fill="#6B4E36"/>` }; },
    art(cx, o) { const y = o.y || 300; return { body: `<rect x="${cx - 120}" y="${y}" width="240" height="160" fill="#2F2A26"/><rect x="${cx - 108}" y="${y + 12}" width="216" height="136" fill="#E9DCC6"/><circle cx="${cx - 30}" cy="${y + 70}" r="34" fill="#C2410C" opacity=".8"/><path d="M${cx - 108} ${y + 120} Q ${cx} ${y + 80} ${cx + 108} ${y + 110} V${y + 148} H${cx - 108}Z" fill="#1E3A5F" opacity=".7"/>` }; },
    plant(cx) { return { body: `<path d="M${cx - 34} 580 h68 l-10 70 h-48z" fill="#D6CFC4"/><path d="M${cx} 580 q -60 -90 -20 -170 M${cx} 580 q 40 -120 10 -200 M${cx} 580 q 70 -60 60 -140" stroke="#4E7A3A" stroke-width="16" fill="none" stroke-linecap="round"/>` }; },
    lamp(cx) { return { body: `<path d="M${cx} 650 V420" stroke="#3F3833" stroke-width="6"/><path d="M${cx - 50} 420 h100 l-20 -70 h-60z" fill="#F5E6C8"/><circle cx="${cx}" cy="400" r="70" fill="#FFE8B0" opacity=".25"/>` }; },
    cabinets(cx, o) {
      const w = (o.w || 0.8) * 900, x = cx - w / 2, P = o.dated ? DATED : WOOD; let s = "";
      s += `<rect x="${x}" y="210" width="${w}" height="160" fill="${P.cab}" stroke="${P.cabLine}" stroke-width="3"/>`;
      for (let i = 1; i < Math.round(w / 110); i++) s += `<path d="M${x + (i * w) / Math.round(w / 110)} 210 V370" stroke="${P.cabLine}" stroke-width="3"/>`;
      s += `<rect x="${x}" y="370" width="${w}" height="110" fill="${P.splash}"/>${o.dated ? "" : Array.from({ length: Math.round(w / 40) }, (_, i) => `<path d="M${x + i * 40} 370 V480" stroke="#fff" stroke-width="2" opacity=".7"/>`).join("")}`;
      s += `<rect x="${x - 6}" y="480" width="${w + 12}" height="18" fill="${P.counter}"/><rect x="${x}" y="498" width="${w}" height="152" fill="${P.cab}" stroke="${P.cabLine}" stroke-width="3"/>`;
      for (let i = 1; i < Math.round(w / 110); i++) s += `<path d="M${x + (i * w) / Math.round(w / 110)} 498 V650" stroke="${P.cabLine}" stroke-width="3"/>`;
      if (o.range !== undefined) { const rx = x + o.range * w; s += `<path d="M${rx - 80} 210 h160 l-30 110 h-100z" fill="${o.dated ? "#E7E5E4" : "#9CA3AF"}"/><rect x="${rx - 70}" y="498" width="140" height="152" fill="${o.dated ? "#F5F5F4" : "#4B5563"}"/><rect x="${rx - 70}" y="480" width="140" height="18" fill="#1F2937"/>`; }
      if (!o.dated) s += [0.25, 0.75].map((f) => `<path d="M${x + f * w} 170 V250" stroke="#1F2937" stroke-width="2"/><circle cx="${x + f * w}" cy="262" r="16" fill="#E0C48C"/>`).join("");
      return { body: s };
    },
    fridge(cx) { return { body: `<rect x="${cx - 85}" y="250" width="170" height="400" rx="6" fill="#C7CBD1"/><path d="M${cx} 250 V650" stroke="#9CA3AF" stroke-width="3"/><rect x="${cx - 14}" y="400" width="6" height="90" fill="#6B7280"/><rect x="${cx + 8}" y="400" width="6" height="90" fill="#6B7280"/>` }; },
    island(cx, o) { const w = (o.w || 0.6) * 900; return { body: `<rect x="${cx - w / 2}" y="600" width="${w}" height="24" fill="#F4F2EE"/><rect x="${cx - w / 2 + 10}" y="624" width="${w - 20}" height="150" fill="${o.dated ? "#B9824B" : "#1E3A5F"}"/>${[0.2, 0.4, 0.6, 0.8].map((f) => `<rect x="${cx - w / 2 + f * w - 24}" y="700" width="48" height="16" rx="5" fill="#3F3833"/><path d="M${cx - w / 2 + f * w - 16} 716 L${cx - w / 2 + f * w - 22} 820 M${cx - w / 2 + f * w + 16} 716 L${cx - w / 2 + f * w + 22} 820" stroke="#3F3833" stroke-width="5"/>`).join("")}` }; },
    table(cx, o) { const w = (o.w || 0.6) * 900; return { body: `<path d="M${cx} 0 V180" stroke="#1F2937" stroke-width="3"/><ellipse cx="${cx}" cy="200" rx="80" ry="16" fill="#E0C48C"/>${[-60, -30, 0, 30, 60].map((d) => `<circle cx="${cx + d}" cy="226" r="9" fill="#FFF3D1"/>`).join("")}${[0.15, 0.38, 0.62, 0.85].map((f) => `<rect x="${cx - w / 2 + f * w - 28}" y="560" width="56" height="70" rx="6" fill="#E9E3D7" stroke="#CFC6B6"/>`).join("")}<rect x="${cx - w / 2}" y="640" width="${w}" height="26" fill="#6B4E36"/><path d="M${cx - w / 2 + 30} 666 V780 M${cx + w / 2 - 30} 666 V780" stroke="#4A3626" stroke-width="12"/>${[0.15, 0.38, 0.62, 0.85].map((f) => `<rect x="${cx - w / 2 + f * w - 30}" y="700" width="60" height="90" rx="8" fill="#DCD3C3"/>`).join("")}` }; },
    buffet(cx) { return { body: `<rect x="${cx - 180}" y="520" width="360" height="130" fill="#6B4E36"/><path d="M${cx - 60} 520 V650 M${cx + 60} 520 V650" stroke="#4A3626" stroke-width="3"/><rect x="${cx - 190}" y="510" width="380" height="12" fill="#4A3626"/><path d="M${cx - 30} 510 q 30 -80 60 0" fill="#4E7A3A"/>` }; },
    bed(cx) { return { body: `<rect x="${cx - 200}" y="400" width="400" height="200" rx="14" fill="#8A7A6A"/><rect x="${cx - 230}" y="560" width="460" height="210" rx="14" fill="#F4F1EC"/><rect x="${cx - 230}" y="660" width="460" height="110" fill="#C9B9A3"/><rect x="${cx - 180}" y="530" width="150" height="60" rx="16" fill="#fff"/><rect x="${cx + 30}" y="530" width="150" height="60" rx="16" fill="#fff"/>${[-300, 300].map((d) => `<rect x="${cx + d - 50}" y="540" width="100" height="110" fill="#6B4E36"/><path d="M${cx + d} 540 V470" stroke="#3F3833" stroke-width="4"/><path d="M${cx + d - 36} 470 h72 l-12 -50 h-48z" fill="#F5E6C8"/>`).join("")}` }; },
    vanity(cx, o) { const w = (o.w || 0.6) * 900; return { body: `<rect x="${cx - w / 2}" y="500" width="${w}" height="150" fill="#5C4B3D"/><rect x="${cx - w / 2 - 8}" y="488" width="${w + 16}" height="16" fill="#F4F2EE"/>${[0.27, 0.73].map((f) => `<rect x="${cx - w / 2 + f * w - 90}" y="230" width="180" height="230" rx="90" fill="#CBD5E1" stroke="#A8A29E" stroke-width="6"/><ellipse cx="${cx - w / 2 + f * w}" cy="494" rx="50" ry="8" fill="#E5E7EB"/>`).join("")}` }; },
    tub(cx) { return { body: `<path d="M${cx - 220} 600 h440 q 0 140 -110 150 h-220 q-110 -10 -110 -150z" fill="#fff" stroke="#D6D3D1" stroke-width="4"/><path d="M${cx + 190} 600 v-80 q0 -20 -20 -20" stroke="#A8A29E" stroke-width="8" fill="none"/>` }; },
    shower(cx) { let s = `<rect x="${cx - 200}" y="190" width="400" height="460" fill="#E7EBEE"/>`; for (let y = 210; y < 650; y += 40) s += `<path d="M${cx - 200} ${y} H${cx + 200}" stroke="#fff" stroke-width="2"/>`; return { body: s + `<rect x="${cx - 200}" y="190" width="400" height="460" fill="#BFDBFE" opacity=".25" stroke="#CBD5E1" stroke-width="6"/><circle cx="${cx}" cy="230" r="30" fill="#A8A29E"/>` }; },
    desk(cx) { return { body: `<rect x="${cx - 200}" y="540" width="400" height="20" fill="#6B4E36"/><path d="M${cx - 180} 560 V650 M${cx + 180} 560 V650" stroke="#4A3626" stroke-width="10"/><rect x="${cx - 80}" y="440" width="160" height="96" rx="6" fill="#111827"/><rect x="${cx - 72}" y="448" width="144" height="80" fill="#3B82F6" opacity=".55"/><rect x="${cx - 70}" y="610" width="140" height="120" rx="20" fill="#1F2937"/>` }; },
    closet(cx) { return { body: `<rect x="${cx - 120}" y="282" width="240" height="368" fill="#F4F1EA" stroke="#D9D3C7" stroke-width="4"/><path d="M${cx} 282 V650" stroke="#D9D3C7" stroke-width="4"/><circle cx="${cx - 14}" cy="470" r="6" fill="#A8A29E"/><circle cx="${cx + 14}" cy="470" r="6" fill="#A8A29E"/>` }; },
    thermostat(cx) { return { body: `<rect x="${cx - 26}" y="390" width="52" height="64" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-width="3"/><circle cx="${cx}" cy="422" r="16" fill="none" stroke="#0EA5E9" stroke-width="4"/>` }; },
    vent(cx) { return { body: `<rect x="${cx - 60}" y="186" width="120" height="30" fill="#E5E7EB" stroke="#9CA3AF"/>${[0, 1, 2, 3].map((i) => `<path d="M${cx - 50} ${192 + i * 6} h100" stroke="#9CA3AF"/>`).join("")}` }; },
  };

  // spec: { palette:[wall,floor,ceiling] key, walls:[[feature, cx(0..1), opts], ...] x4 }
  function pano(room, variant = "base") {
    const [wall, floor, ceil] = (PAL[variant === "comp" ? "comp" : "base"][room.id] || PAL.base[room.id]);
    let defs = "", body = "";
    const shade = [0, 0.05, 0.1, 0.04];
    room.walls.forEach((features, wi) => {
      const ox = wi * 900, lit = id("l");
      defs += lin(lit, [[0, "#000", 0.12], [0.18, "#000", 0], [0.82, "#000", 0], [1, "#000", 0.12]], 1, 0);
      let g = `<rect x="0" y="0" width="900" height="170" fill="${ceil}"/><path d="M0 170 H900" stroke="#fff" stroke-width="6"/><rect x="0" y="170" width="900" height="480" fill="${wall}"/><rect x="0" y="650" width="900" height="250" fill="${floor}"/>`;
      if (room.id === "pbath") for (let x = 0; x < 900; x += 60) g += `<path d="M${x} 650 L${450 + (x - 450) * 0.5} 900" stroke="#fff" stroke-width="2" opacity=".5"/>`;
      else for (let x = -400; x < 1300; x += 70) g += `<path d="M${450 + (x - 450) * 0.62} 650 L${x} 900" stroke="#000" stroke-opacity=".09" stroke-width="2"/>`;
      g += `<rect x="0" y="640" width="900" height="12" fill="#fff" opacity=".85"/>`;
      if (room.vaulted) g += `<path d="M0 170 L450 40 L900 170" stroke="#D9D3C7" stroke-width="10" fill="none"/>`;
      features.forEach(([name, cx, o = {}]) => {
        if (variant === "empty" && ["sofa", "plant", "lamp", "art", "table", "bed", "desk", "island", "buffet"].includes(name)) return;
        const r = F[name](cx * 900, { ...o, dated: variant === "dated" && room.id === "kitchen" });
        if (r.defs) defs += r.defs; g += r.body;
      });
      g += `<rect x="0" y="0" width="900" height="900" fill="url(#${lit})"/><rect x="0" y="0" width="900" height="900" fill="#000" opacity="${shade[wi]}"/>`;
      body += `<g transform="translate(${ox} 0)">${g}</g>`;
    });
    if (variant === "dated") body += `<rect width="3600" height="900" fill="#F59E0B" opacity=".08"/>`;
    return svg(3600, 900, body, defs);
  }
  // crop of a panorama (one wall) for gallery thumbnails/photos
  function crop(panoSvg, wall, label) {
    return panoSvg.replace('viewBox="0 0 3600 900" width="3600" height="900"', `viewBox="${wall * 900 + 30} 120 840 700" role="img" aria-label="${label}"`);
  }

  function exterior(label = "Front exterior of the craftsman-modern home at 2148 Larkspur Lane") {
    const sky = id("s");
    let o = `<rect width="1600" height="900" fill="url(#${sky})"/><path d="M0 420 L240 300 L420 380 L640 250 L880 360 L1100 270 L1360 370 L1600 300 V520 H0Z" fill="#8FA3B8" opacity=".7"/><rect y="520" width="1600" height="380" fill="#7FA35B"/>`;
    o += `<rect x="440" y="330" width="720" height="260" fill="#E8E1D4"/><path d="M400 340 L800 160 L1200 340Z" fill="#3F4A55"/><rect x="900" y="250" width="200" height="90" fill="#E8E1D4"/><path d="M880 260 L1000 200 L1120 260Z" fill="#3F4A55"/>`;
    o += `<rect x="440" y="470" width="720" height="120" fill="#A39B8E"/>${Array.from({ length: 4 }, (_, i) => `<path d="M440 ${490 + i * 24} H1160" stroke="#8C8478" stroke-width="2"/>`).join("")}`;
    [[500, 380], [640, 380], [960, 380], [1060, 380]].forEach(([x, y]) => { o += `<rect x="${x}" y="${y}" width="80" height="80" fill="#FDE7B0" stroke="#fff" stroke-width="6"/><path d="M${x + 40} ${y} V${y + 80}" stroke="#fff" stroke-width="3"/>`; });
    o += `<rect x="770" y="440" width="70" height="150" fill="#1E3A5F"/><rect x="730" y="420" width="150" height="16" fill="#3F4A55"/><path d="M745 436 V590 M865 436 V590" stroke="#fff" stroke-width="10"/><path d="M760 590 L700 900 H910 L850 590Z" fill="#D6D3D1"/>`;
    o += tree(260, 520, 110, "#3F6B3A") + tree(1380, 500, 130, "#4E7A3A") + tree(130, 560, 70, "#5C8A45");
    for (let i = 0; i < 12; i++) o += `<circle cx="${460 + i * 60}" cy="600" r="24" fill="#4E7A3A"/>`;
    return svg(1600, 900, o, lin(sky, [[0, "#8CC0EA"], [1, "#E6F0F8"]]), label);
  }
  function aerial(t = 0) {
    let o = `<rect width="1600" height="900" fill="#86A869"/>`;
    o += `<path d="M0 640 C 400 600 1200 680 1600 620" stroke="#CBD5E1" stroke-width="60" fill="none"/><path d="M780 0 C 760 300 820 500 800 900" stroke="#CBD5E1" stroke-width="44" fill="none"/>`;
    const lots = [[300, 380], [560, 380], [1040, 380], [1300, 380], [300, 820], [560, 820], [1040, 820], [1300, 820]];
    lots.forEach(([x, y], i) => { o += `<rect x="${x - 90}" y="${y - 150}" width="180" height="130" fill="${["#64748B", "#7C2D12", "#475569", "#3F4A55"][i % 4]}"/><path d="M${x - 90} ${y - 85} H${x + 90}" stroke="#000" stroke-opacity=".2" stroke-width="3"/>`; });
    o += `<rect x="530" y="200" width="200" height="150" fill="#3F4A55" stroke="#F2B544" stroke-width="6"/><path d="M530 275 H730" stroke="#000" stroke-opacity=".25" stroke-width="3"/><rect x="590" y="360" width="90" height="60" rx="8" fill="#38BDF8"/>`;
    for (let i = 0; i < 30; i++) o += tree((i * 197) % 1600, ((i * 131) % 900), 26 + (i % 4) * 6, ["#3F6B3A", "#4E7A3A", "#5C8A45"][i % 3]);
    return svg(1600, 900, `<g transform="translate(${800 - 800 * (1 + t * 0.25)} ${450 - 450 * (1 + t * 0.25)}) scale(${1 + t * 0.25})">${o}</g>`, "", "Drone view above the property and neighboring lots");
  }
  function street() {
    let o = `<rect width="3200" height="900" fill="#BFDDF2"/><rect y="560" width="3200" height="340" fill="#9CA3AF"/><rect y="540" width="3200" height="30" fill="#E5E7EB"/>`;
    for (let i = 0; i < 9; i++) { const x = 60 + i * 360; o += `<rect x="${x}" y="${330 + (i % 2) * 20}" width="260" height="${210 - (i % 2) * 20}" fill="${["#EADFCF", "#DCE5DA", "#F1EAE0", "#E7EEF5"][i % 4]}"/><path d="M${x - 20} ${330 + (i % 2) * 20} L${x + 130} ${230 + (i % 2) * 20} L${x + 280} ${330 + (i % 2) * 20}Z" fill="${["#475569", "#7C2D12", "#334155"][i % 3]}"/><rect x="${x + 110}" y="460" width="40" height="80" fill="#1E3A5F"/>${tree(x + 320, 470, 60, "#4E7A3A")}`; }
    o += `<rect x="1400" y="360" width="420" height="180" fill="#F8FAFC"/><rect x="1400" y="330" width="420" height="34" fill="#C2410C"/><text x="1610" y="353" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="#fff">LARKSPUR CAFÉ</text>${[0, 1, 2].map((i) => `<rect x="${1420 + i * 135}" y="390" width="115" height="110" fill="#FDE7B0"/>`).join("")}`;
    return svg(3200, 900, o, "", "Walk along nearby streets with cafés and parks");
  }

  window.Art = { pano, crop, exterior, aerial, street };
})();
