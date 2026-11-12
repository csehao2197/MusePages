// Original SVG illustrations used in place of real-estate photography (no licensed photos are bundled).
(function () {
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const svg = (vb, body, label, defs = "") => `<svg viewBox="${vb}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><defs>${defs}</defs>${body}</svg>`;
  const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join("")}</linearGradient>`;
  const rad = (gid, c, a = 1) => `<radialGradient id="${gid}"><stop offset="0" stop-color="${c}" stop-opacity="${a}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

  const saguaro = (x, y, h, c) => `<g fill="${c}"><rect x="${x - h * 0.06}" y="${y - h}" width="${h * 0.12}" height="${h}" rx="${h * 0.06}"/><path d="M${x - h * 0.06} ${y - h * 0.45} h-${h * 0.16} a${h * 0.05} ${h * 0.05} 0 0 1 -${h * 0.05} -${h * 0.05} v-${h * 0.22} a${h * 0.05} ${h * 0.05} 0 0 1 ${h * 0.1} 0 v${h * 0.17} h${h * 0.11}z"/><path d="M${x + h * 0.06} ${y - h * 0.6} h${h * 0.14} v-${h * 0.18} a${h * 0.05} ${h * 0.05} 0 0 1 ${h * 0.1} 0 v${h * 0.23} a${h * 0.05} ${h * 0.05} 0 0 1 -${h * 0.05} ${h * 0.05} h-${h * 0.19}z"/></g>`;
  const mountains = (y, c1, c2) => `<path d="M0 ${y} L180 ${y - 120} L300 ${y - 70} L470 ${y - 190} L640 ${y - 80} L820 ${y - 150} L1000 ${y - 60} L1180 ${y - 170} L1400 ${y - 50} L1600 ${y - 130} V${y + 40} H0Z" fill="${c1}"/><path d="M0 ${y + 10} L260 ${y - 50} L520 ${y} L760 ${y - 70} L1060 ${y} L1300 ${y - 60} L1600 ${y - 10} V${y + 60} H0Z" fill="${c2}"/>`;

  // Desert modern house; mode: twilight | day
  function house(mode = "twilight", variant = 0) {
    const tw = mode === "twilight", sky = id("s"), glow = id("g"), win = id("w");
    const defs = lin(sky, tw ? [[0, "#1B2340"], [0.45, "#5B3A63"], [0.75, "#D9775B"], [1, "#F5B47A"]] : [[0, "#7DB7E8"], [1, "#E9F2F8"]]) + rad(glow, "#FFD08A", 0.55) + lin(win, tw ? [[0, "#FFE2A8"], [1, "#F4A955"]] : [[0, "#B9D7EA"], [1, "#6B8FA8"]]);
    const stucco = tw ? "#C9B8A6" : "#EDE4D8", stone = tw ? "#6E5D4E" : "#A08B76", roof = tw ? "#2A2522" : "#3F3833", ground = tw ? "#3A2E2A" : "#D8C2A0";
    const shift = [0, -120, 80][variant % 3];
    let o = `<rect width="1600" height="900" fill="url(#${sky})"/>`;
    if (tw) o += `<circle cx="1280" cy="140" r="3" fill="#fff"/><circle cx="300" cy="90" r="2" fill="#fff"/><circle cx="820" cy="60" r="2" fill="#fff" opacity=".8"/><circle cx="1050" cy="110" r="2" fill="#fff" opacity=".7"/>`;
    o += mountains(520, tw ? "#3B2B45" : "#B9A48E", tw ? "#2E2236" : "#C9B49A");
    o += `<rect y="560" width="1600" height="340" fill="${ground}"/>`;
    o += `<g transform="translate(${shift} 0)">`;
    o += `<ellipse cx="800" cy="560" rx="620" ry="110" fill="url(#${glow})"/>`;
    // main volumes
    o += `<rect x="330" y="360" width="520" height="220" fill="${stucco}"/><rect x="850" y="300" width="460" height="280" fill="${stucco}"/><rect x="250" y="440" width="140" height="140" fill="${stone}"/>`;
    o += `<rect x="310" y="342" width="560" height="22" fill="${roof}"/><rect x="830" y="282" width="510" height="22" fill="${roof}"/><rect x="790" y="250" width="40" height="330" fill="${stone}"/>`;
    for (let i = 0; i < 9; i++) o += `<path d="M250 ${452 + i * 14} h140" stroke="#000" stroke-opacity=".18"/>`;
    // glass walls
    o += `<rect x="380" y="400" width="380" height="170" fill="url(#${win})"/>${[1, 2, 3].map((i) => `<path d="M${380 + i * 95} 400 V570" stroke="${roof}" stroke-width="5"/>`).join("")}`;
    o += `<rect x="890" y="340" width="380" height="110" fill="url(#${win})"/>${[1, 2].map((i) => `<path d="M${890 + i * 127} 340 V450" stroke="${roof}" stroke-width="5"/>`).join("")}<rect x="890" y="470" width="380" height="100" fill="url(#${win})" opacity=".9"/><path d="M1080 470 V570" stroke="${roof}" stroke-width="5"/>`;
    if (tw) o += `<rect x="380" y="400" width="380" height="170" fill="#FFE9BF" opacity=".25"/><path d="M420 470 h80 v30 h-80z M560 450 h20 v100 h-20z" fill="#7A5232" opacity=".6"/><circle cx="640" cy="430" r="16" fill="#FFF3D1" opacity=".9"/>`;
    o += `<rect x="300" y="580" width="1040" height="14" fill="${tw ? "#4A3E38" : "#BFA88C"}"/>`;
    // pool reflection strip (twilight)
    if (tw) o += `<rect x="360" y="610" width="700" height="46" fill="#1F7FA6"/><rect x="360" y="610" width="700" height="46" fill="#7FE0F5" opacity=".35"/><path d="M380 630 h200 M640 640 h260" stroke="#BFF3FF" stroke-width="3" opacity=".6"/><g><ellipse cx="1110" cy="625" rx="34" ry="10" fill="#3A2E2A"/><path d="M1095 620 q15 -40 30 0" fill="#FF9F43"/><path d="M1102 620 q8 -24 16 0" fill="#FFE08A"/></g>`;
    o += `</g>`;
    // landscape
    o += saguaro(150, 640, 260, tw ? "#14141F" : "#4E6B3A") + saguaro(1460, 650, 300, tw ? "#14141F" : "#4E6B3A") + saguaro(1250, 610, 130, tw ? "#1C1A26" : "#5E7B48");
    o += `<path d="M0 720 q 200 -40 420 -10 t 520 0 t 660 -20 V900 H0Z" fill="${tw ? "#241C1C" : "#C9AE88"}"/>`;
    for (let i = 0; i < 14; i++) o += `<circle cx="${60 + i * 115}" cy="${730 + (i % 3) * 12}" r="${18 + (i % 4) * 5}" fill="${tw ? "#1E2420" : "#8A9A62"}"/>`;
    if (tw) [420, 700, 980, 1240].forEach((x) => { o += `<circle cx="${x}" cy="700" r="40" fill="url(#${glow})"/><rect x="${x - 3}" y="690" width="6" height="16" fill="#FFE7B0"/>`; });
    return svg("0 0 1600 900", o, tw ? "Twilight exterior of a modern desert luxury home with glowing windows, saguaro cactus silhouettes and a dramatic sky" : "Daytime front exterior of the desert modern home in stucco and natural stone", defs);
  }

  // ----- interiors (800 x 600 canvas) -----
  function shell(wall, floor, side, ceil = "#F7F4EF") {
    return `<rect width="800" height="600" fill="${wall}"/><path d="M0 0 H800 L680 60 H120Z" fill="${ceil}"/><path d="M0 0 L120 60 V450 L0 600Z" fill="${side}"/><path d="M800 0 L680 60 V450 L800 600Z" fill="${side}"/><path d="M0 600 L120 450 H680 L800 600Z" fill="${floor}"/>`;
  }
  const desertWindow = (x, y, w, h, dusk) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${dusk ? "#E9A06B" : "#BFDDF0"}"/><path d="M${x} ${y + h * 0.62} l${w * 0.22} ${-h * 0.18} l${w * 0.2} ${h * 0.1} l${w * 0.25} ${-h * 0.2} l${w * 0.33} ${h * 0.22} V${y + h} H${x}Z" fill="${dusk ? "#7A4E5C" : "#C7AE92"}"/><rect x="${x}" y="${y + h * 0.8}" width="${w}" height="${h * 0.2}" fill="${dusk ? "#5B4040" : "#D9C3A1"}"/>${saguaro(x + w * 0.8, y + h, h * 0.45, dusk ? "#3A2A30" : "#5E7B48")}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#2A2522" stroke-width="5"/>`;
  const mullions = (x, y, w, h, n) => Array.from({ length: n - 1 }, (_, i) => `<path d="M${x + ((i + 1) * w) / n} ${y} V${y + h}" stroke="#2A2522" stroke-width="4"/>`).join("");
  const planks = (c) => Array.from({ length: 9 }, (_, i) => `<path d="M${120 + i * 70} 450 L${-40 + i * 110} 600" stroke="${c}" stroke-width="1.5"/>`).join("");

  const SCENES = {
    front: () => null,
    great() {
      let o = shell("#EFE9E1", "#CDB89A", "#E5DDD1") + planks("#B9A384");
      o += desertWindow(140, 70, 330, 370) + mullions(140, 70, 330, 370, 3);
      o += `<rect x="500" y="70" width="170" height="380" fill="#D9D0C4"/><rect x="510" y="300" width="150" height="40" fill="#1C1917"/><path d="M520 330 q 20 -26 40 0 q 20 -26 40 0 q 20 -26 40 0" fill="#F59E0B"/><rect x="540" y="140" width="90" height="120" fill="#C9A96E" opacity=".5"/>`;
      o += `<ellipse cx="400" cy="530" rx="300" ry="50" fill="#E6DBCB"/><path d="M170 440 h340 a16 16 0 0 1 16 16 v60 h-372 v-60 a16 16 0 0 1 16 -16z" fill="#F2EEE8"/><rect x="154" y="480" width="372" height="40" rx="10" fill="#E3DCD2"/><rect x="190" y="448" width="70" height="40" rx="8" fill="#1E3A5F" opacity=".8"/><rect x="420" y="448" width="70" height="40" rx="8" fill="#C9A96E"/><rect x="330" y="520" width="180" height="18" rx="4" fill="#3F3833"/>`;
      o += `<path d="M300 0 V40 M300 40 q -30 0 -30 20 h60 q0 -20 -30 -20" stroke="#2A2522" stroke-width="2" fill="#C9A96E"/>`;
      return [o, "Great room with double-height ceilings, floor-to-ceiling windows and a linear fireplace"];
    },
    kitchen() {
      let o = shell("#F3F0EB", "#D8CDBE", "#E8E2D9");
      o += `<rect x="130" y="90" width="540" height="110" fill="#5C4B3D"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${136 + i * 89}" y="96" width="83" height="98" fill="#6B5847" stroke="#4A3C30"/>`).join("")}`;
      o += `<rect x="130" y="200" width="540" height="70" fill="#E9E4DC"/><rect x="330" y="120" width="140" height="80" fill="#9CA3AF"/><rect x="130" y="270" width="540" height="14" fill="#F8F6F3"/><rect x="130" y="284" width="540" height="120" fill="#3F3833"/><rect x="560" y="284" width="110" height="120" fill="#A8A29E"/><rect x="566" y="290" width="98" height="108" fill="#D6D3D1"/>`;
      o += `<rect x="170" y="400" width="460" height="24" fill="#F8F6F3"/><rect x="170" y="424" width="460" height="100" fill="#F1EDE6"/><rect x="170" y="400" width="24" height="124" fill="#ECE7DF"/><rect x="606" y="400" width="24" height="124" fill="#ECE7DF"/>`;
      [270, 400, 530].forEach((x) => { o += `<path d="M${x} 60 V200" stroke="#2A2522" stroke-width="2"/><circle cx="${x}" cy="218" r="18" fill="#C9A96E"/><circle cx="${x}" cy="226" r="7" fill="#FFF3D1"/>`; });
      [250, 350, 450, 550].forEach((x) => { o += `<rect x="${x - 18}" y="500" width="36" height="12" rx="4" fill="#1E3A5F"/><path d="M${x - 12} 512 L${x - 16} 580 M${x + 12} 512 L${x + 16} 580" stroke="#C9A96E" stroke-width="4"/>`; });
      return [o, "Kitchen with waterfall quartz island, Wolf range and walnut cabinetry, open to dining"];
    },
    detail() {
      let o = `<rect width="800" height="600" fill="#F1EDE6"/><rect y="300" width="800" height="300" fill="#F8F6F3"/><path d="M0 300 H800" stroke="#E2DACB" stroke-width="4"/>`;
      for (let i = 0; i < 8; i++) o += `<path d="M${i * 120 - 40} 300 q 60 ${60 + i * 10} 160 300" stroke="#D9D2C6" stroke-width="2" fill="none" opacity=".7"/>`;
      o += `<rect y="0" width="800" height="300" fill="#5C4B3D"/>${[0, 1, 2, 3].map((i) => `<rect x="${20 + i * 200}" y="20" width="180" height="260" fill="#6B5847" stroke="#4A3C30" stroke-width="3"/><rect x="${170 + i * 200}" y="130" width="8" height="70" rx="4" fill="#C9A96E"/>`).join("")}`;
      o += `<rect x="520" y="40" width="240" height="250" rx="6" fill="#1F1B18"/>${[0, 1, 2, 3, 4].map((r) => `<path d="M530 ${80 + r * 44} H750" stroke="#3A332D" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map((b) => `<circle cx="${548 + b * 36}" cy="${70 + r * 44}" r="9" fill="${["#5B1A2A", "#7A2638", "#C9A96E", "#3F1820"][(b + r) % 4]}"/>`).join("")}`).join("")}<rect x="520" y="40" width="240" height="250" rx="6" fill="#BFDBFE" opacity=".12"/>`;
      o += `<path d="M120 300 c 0 -60 20 -80 40 -100 h10 c 20 20 40 40 40 100z" fill="#E7E5E4"/><path d="M150 210 q 20 -60 40 0" fill="#4E6B3A"/><rect x="300" y="250" width="120" height="50" rx="6" fill="#C9A96E" opacity=".9"/><circle cx="460" cy="285" r="15" fill="#E4C27C"/>`;
      return [o, "Kitchen detail: quartz countertop, brass hardware and a glass-front wine fridge"];
    },
    bedroom() {
      let o = shell("#EEE7DD", "#CDB89A", "#E4DBCF") + planks("#B9A384");
      o += desertWindow(380, 80, 280, 340) + mullions(380, 80, 280, 340, 2);
      o += `<rect x="130" y="260" width="230" height="110" rx="6" fill="#B8A48C"/><rect x="120" y="360" width="260" height="140" rx="10" fill="#F8F6F3"/><rect x="120" y="420" width="260" height="80" rx="8" fill="#E5DACB"/><rect x="140" y="330" width="90" height="40" rx="10" fill="#fff"/><rect x="250" y="330" width="90" height="40" rx="10" fill="#fff"/><rect x="120" y="470" width="260" height="30" fill="#C9A96E" opacity=".6"/>`;
      o += `<rect x="70" y="390" width="50" height="60" fill="#5C4B3D"/><circle cx="95" cy="370" r="14" fill="#FFF3D1"/><rect x="380" y="390" width="0" height="0"/>`;
      return [o, "Primary bedroom with king bed, neutral tones and a desert view through sliding glass"];
    },
    bath() {
      let o = shell("#F2EFEA", "#E5E0D8", "#EAE6DF");
      for (let x = 120; x < 680; x += 46) o += `<path d="M${x} 60 V450" stroke="#E0DAD0"/>`;
      for (let i = 0; i < 6; i++) o += `<path d="M${120 + i * 100} 60 q 40 120 10 390" stroke="#D3CCC0" stroke-width="2" fill="none" opacity=".7"/>`;
      o += desertWindow(300, 90, 200, 170) + `<path d="M230 360 h300 q 0 100 -90 110 h-120 q-90 -10 -90 -110z" fill="#fff" stroke="#D6D0C6" stroke-width="3"/><path d="M500 360 v-50 q0 -14 -14 -14" stroke="#C9A96E" stroke-width="5" fill="none"/>`;
      o += `<rect x="560" y="90" width="110" height="360" fill="#DCEBF2" opacity=".55" stroke="#C9D7DF" stroke-width="3"/><circle cx="615" cy="120" r="22" fill="#A8A29E"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${600 + i * 6} 140 v40" stroke="#BFDBFE" stroke-width="2"/>`).join("")}`;
      o += `<rect x="130" y="330" width="90" height="120" fill="#5C4B3D"/><rect x="124" y="322" width="102" height="10" fill="#F8F6F3"/>`;
      return [o, "Primary bathroom with freestanding tub, frameless rain shower and marble tile"];
    },
    pool() {
      const sky = id("ps"), glow = id("pg");
      let o = `<rect width="800" height="600" fill="url(#${sky})"/>` + `<path d="M0 260 L120 190 L240 230 L380 150 L520 220 L660 170 L800 220 V320 H0Z" fill="#3B2B45"/><rect y="300" width="800" height="300" fill="#2E2526"/>`;
      o += `<rect x="40" y="330" width="720" height="150" fill="#1F7FA6"/><rect x="40" y="330" width="720" height="150" fill="#7FE0F5" opacity=".3"/><path d="M40 330 H760" stroke="#BFF3FF" stroke-width="4"/>${[0, 1, 2, 3].map((i) => `<path d="M${90 + i * 170} ${380 + (i % 2) * 40} h90" stroke="#BFF3FF" stroke-width="3" opacity=".5"/>`).join("")}`;
      [140, 660].forEach((x) => { o += `<circle cx="${x}" cy="320" r="70" fill="url(#${glow})"/><ellipse cx="${x}" cy="330" rx="34" ry="10" fill="#4A3E38"/><path d="M${x - 16} 326 q16 -46 32 0" fill="#FF9F43"/><path d="M${x - 8} 326 q8 -26 16 0" fill="#FFE08A"/>`; });
      o += `<rect x="560" y="200" width="200" height="100" fill="#C9B8A6"/><rect x="580" y="220" width="160" height="70" fill="#FFE2A8"/><rect x="550" y="190" width="220" height="12" fill="#2A2522"/>${saguaro(80, 300, 140, "#14141F")}`;
      o += `<rect y="480" width="800" height="120" fill="#4A3E38"/>${[150, 300, 450].map((x) => `<rect x="${x}" y="510" width="100" height="22" rx="6" fill="#E7E5E4"/>`).join("")}`;
      return [o, "Infinity pool at twilight with lit fire bowls and the outdoor kitchen beyond", lin(sky, [[0, "#1B2340"], [0.6, "#7A4A63"], [1, "#E58B60"]]) + rad(glow, "#FFB347", 0.6)];
    },
    outdoor() {
      let o = `<rect width="800" height="600" fill="#F2C892"/><path d="M0 300 L160 220 L300 260 L460 200 L620 250 L800 210 V340 H0Z" fill="#C79C78"/><rect y="330" width="800" height="270" fill="#D9C3A1"/>`;
      o += `<rect x="40" y="60" width="720" height="22" fill="#3F3833"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="${50 + i * 60}" y="82" width="10" height="16" fill="#3F3833"/>`).join("")}<path d="M60 82 V360 M740 82 V360" stroke="#3F3833" stroke-width="16"/>`;
      [250, 550].forEach((x) => { o += `<path d="M${x} 82 v24" stroke="#2A2522" stroke-width="3"/><path d="M${x - 50} 110 h100" stroke="#2A2522" stroke-width="5"/><circle cx="${x}" cy="112" r="8" fill="#2A2522"/>`; });
      o += `<rect x="150" y="320" width="500" height="20" fill="#E8E2D9"/><rect x="150" y="340" width="500" height="110" fill="#6E5D4E"/><rect x="200" y="300" width="160" height="22" rx="4" fill="#9CA3AF"/><rect x="200" y="300" width="160" height="8" fill="#6B7280"/><path d="M230 296 q 10 -30 20 0 M280 296 q 10 -30 20 0" stroke="#E5E7EB" stroke-width="3" fill="none" opacity=".7"/>`;
      [220, 340, 460, 580].forEach((x) => { o += `<rect x="${x - 20}" y="440" width="40" height="12" rx="4" fill="#1E3A5F"/><path d="M${x - 14} 452 L${x - 18} 540 M${x + 14} 452 L${x + 18} 540" stroke="#2A2522" stroke-width="4"/>`; });
      o += saguaro(720, 340, 160, "#5E7B48");
      return [o, "Outdoor kitchen with built-in grill, bar seating and a pergola with ceiling fans"];
    },
    office() {
      let o = shell("#ECE7E0", "#B99B78", "#E2DBD2") + planks("#A68A68");
      o += `<rect x="130" y="80" width="250" height="360" fill="#5C4B3D"/>${[0, 1, 2, 3, 4].map((r) => `<rect x="140" y="${92 + r * 68}" width="230" height="6" fill="#4A3C30"/>${[0, 1, 2, 3, 4, 5, 6].map((b) => `<rect x="${148 + b * 30}" y="${100 + r * 68 + (b % 3) * 6}" width="20" height="${54 - (b % 3) * 6}" fill="${["#C9A96E", "#1E3A5F", "#F8F6F3", "#8A6E52", "#3F3833"][(b + r) % 5]}"/>`).join("")}`).join("")}`;
      o += `<rect x="420" y="80" width="250" height="370" fill="#DCEBF2" opacity=".5" stroke="#2A2522" stroke-width="6"/><path d="M545 80 V450" stroke="#2A2522" stroke-width="5"/><circle cx="530" cy="270" r="5" fill="#C9A96E"/><circle cx="560" cy="270" r="5" fill="#C9A96E"/>`;
      o += `<rect x="150" y="400" width="300" height="16" fill="#3F3833"/><rect x="230" y="350" width="110" height="50" rx="4" fill="#1F2937"/><rect x="236" y="356" width="98" height="38" fill="#93C5FD" opacity=".6"/><path d="M175 416 V500 M425 416 V500" stroke="#2A2522" stroke-width="8"/><rect x="250" y="430" width="80" height="60" rx="10" fill="#1E3A5F"/>`;
      return [o, "Home office with built-in desk, shelving and glass French doors"];
    },
    casita() {
      let o = `<rect width="800" height="600" fill="#9CC9EA"/><path d="M0 290 L140 210 L280 260 L420 190 L600 260 L800 220 V330 H0Z" fill="#C7AE92"/><rect y="320" width="800" height="280" fill="#D8C2A0"/>`;
      o += `<rect x="200" y="200" width="400" height="200" fill="#EDE4D8"/><rect x="180" y="186" width="440" height="18" fill="#3F3833"/><rect x="200" y="300" width="110" height="100" fill="#A08B76"/><rect x="340" y="250" width="70" height="150" fill="#1E3A5F"/><circle cx="398" cy="330" r="4" fill="#C9A96E"/><rect x="440" y="240" width="130" height="90" fill="#B9D7EA" stroke="#2A2522" stroke-width="5"/>`;
      o += `<rect x="160" y="400" width="480" height="14" fill="#BFA88C"/><rect x="430" y="430" width="160" height="60" fill="#A08B76" opacity=".4"/><rect x="440" y="440" width="60" height="30" rx="6" fill="#F8F6F3"/><rect x="520" y="440" width="60" height="30" rx="6" fill="#F8F6F3"/><circle cx="510" cy="480" r="16" fill="#3F3833"/>`;
      o += saguaro(100, 440, 220, "#5E7B48") + saguaro(700, 430, 160, "#4E6B3A") + `<path d="M260 470 h120 v120 h-120z" fill="#CDB89A" opacity=".5"/>`;
      return [o, "Detached guest casita with a private entrance and small seating patio"];
    },
    dining() {
      let o = shell("#EDE7DF", "#CDB89A", "#E3DACE") + planks("#B9A384");
      o += desertWindow(160, 90, 480, 260) + mullions(160, 90, 480, 260, 4);
      o += `<path d="M400 0 V60" stroke="#2A2522" stroke-width="2"/>${[-60, -30, 0, 30, 60].map((d) => `<path d="M400 60 L${400 + d} 120" stroke="#C9A96E" stroke-width="2"/><circle cx="${400 + d}" cy="124" r="6" fill="#FFF3D1"/>`).join("")}<ellipse cx="400" cy="60" rx="80" ry="8" fill="#C9A96E"/>`;
      o += `<rect x="150" y="400" width="500" height="22" fill="#5C4B3D"/><path d="M180 422 V520 M620 422 V520" stroke="#3F3833" stroke-width="10"/>`;
      for (let i = 0; i < 5; i++) o += `<rect x="${170 + i * 100}" y="360" width="50" height="50" rx="6" fill="#F2EEE8" stroke="#D6CEC2"/><rect x="${170 + i * 100}" y="470" width="50" height="70" rx="8" fill="#E8E1D6"/>`;
      return [o, "Dining room with a 10-seat table under a statement chandelier"];
    },
    garage() {
      let o = shell("#E5E7EB", "#9CA3AF", "#D1D5DB", "#F3F4F6");
      for (let i = 0; i < 40; i++) o += `<circle cx="${130 + ((i * 97) % 540)}" cy="${470 + ((i * 53) % 110)}" r="2" fill="#E5E7EB" opacity=".7"/>`;
      o += `<path d="M0 600 L120 450 H680 L800 600Z" fill="#94A3B8" opacity=".35"/>`;
      [170, 340, 510].forEach((x, i) => { o += `<rect x="${x}" y="110" width="120" height="250" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="3"/>${[0, 1, 2, 3, 4].map((r) => `<path d="M${x} ${110 + r * 50} h120" stroke="#E2E8F0" stroke-width="2"/>`).join("")}<rect x="${x + 44}" y="380" width="32" height="44" rx="4" fill="#1F2937"/><rect x="${x + 50}" y="388" width="20" height="10" fill="#22C55E"/><path d="M${x + 60} 424 q 0 30 -30 40" stroke="#1F2937" stroke-width="3" fill="none"/>`; });
      o += `<path d="M190 470 h170 l30 50 v40 h-230 v-40z" fill="#1E3A5F"/><rect x="200" y="480" width="150" height="30" rx="6" fill="#93C5FD" opacity=".6"/><circle cx="220" cy="560" r="16" fill="#111827"/><circle cx="370" cy="560" r="16" fill="#111827"/>`;
      return [o, "Three-car garage with EV chargers and epoxy floor"];
    },
  };
  function scene(kind) {
    if (kind === "front") return house("day");
    const [body, label, defs] = SCENES[kind]();
    return svg("0 0 800 600", body, label, defs || "");
  }

  function agent() {
    return svg("0 0 400 480", `<rect width="400" height="480" fill="#E9E3D9"/><rect x="250" y="0" width="150" height="480" fill="#DDD5C8"/><path d="M60 480 Q 70 330 200 318 Q 330 330 340 480Z" fill="#1E3A5F"/><path d="M168 322 L200 392 L232 322" fill="#F8F6F3"/><path d="M200 392 L180 480 M200 392 L220 480" stroke="#C9A96E" stroke-width="3"/><rect x="178" y="262" width="44" height="64" fill="#D9A07A"/><ellipse cx="200" cy="208" rx="70" ry="84" fill="#E2AE88"/><path d="M128 210 Q 120 110 200 104 Q 290 108 276 230 Q 290 300 300 350 Q 260 330 262 230 Q 250 160 200 150 Q 150 160 140 230 Q 142 300 104 340 Q 120 290 128 210Z" fill="#6B3E26"/><path d="M176 248 q 24 18 48 0" stroke="#A4583F" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="174" cy="206" r="6" fill="#2A1A12"/><circle cx="226" cy="206" r="6" fill="#2A1A12"/><path d="M160 190 q 14 -8 28 0 M212 190 q 14 -8 28 0" stroke="#4A2A18" stroke-width="4" fill="none"/><circle cx="132" cy="236" r="6" fill="#C9A96E"/><circle cx="268" cy="236" r="6" fill="#C9A96E"/>`, "Professional headshot of listing agent Victoria Reeves");
  }

  window.Art = { house, scene, agent };
})();
