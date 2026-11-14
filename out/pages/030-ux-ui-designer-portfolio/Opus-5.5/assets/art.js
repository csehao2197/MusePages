// Original SVG interface illustrations for the hero and case studies (no screenshots of real products).
// Exposes window.Art: each function returns an SVG string.
(function () {
  "use strict";
  const I = "#6366F1", I50 = "#EEF2FF", I100 = "#E0E7FF", INK = "#111827", G5 = "#6B7280", G4 = "#9CA3AF", G2 = "#E5E7EB", G1 = "#F3F4F6", G0 = "#F9FAFB";
  const F = 'font-family="Inter, system-ui, sans-serif"';
  const t = (x, y, s, size = 12, fill = INK, w = 500, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" ${extra}>${s}</text>`;
  const r = (x, y, w, h, fill, rx = 6, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const bar = (x, y, w, fill = G2, h = 8) => r(x, y, w, h, fill, h / 2);
  const svg = (w, h, body, label) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" ${F}>${body}</svg>`;
  const WS = [["Personal", "#10B981"], ["Acme", I], ["Studio", "#F59E0B"]];

  // ---------- mobile calendar ----------
  function calendar(label = "Illustration of a mobile calendar with color-coded workspaces") {
    let b = r(0, 0, 320, 660, "#fff", 0);
    b += t(24, 34, "9:41", 13, INK, 600) + r(262, 25, 34, 12, INK, 4);
    b += t(24, 82, "November", 24, INK, 700, 'font-family="DM Sans, Inter, sans-serif"') + t(150, 82, "2025", 24, G4, 500, 'font-family="DM Sans, Inter, sans-serif"');
    b += `<circle cx="282" cy="74" r="16" fill="${I50}"/><path d="M276 74h12M282 68v12" stroke="${I}" stroke-width="2" stroke-linecap="round"/>`;
    let x = 24;
    WS.forEach(([n, c], i) => { const w = n.length * 7 + 34; b += r(x, 102, w, 28, i === 1 ? I50 : G1, 14) + `<circle cx="${x + 14}" cy="116" r="4" fill="${c}"/>` + t(x + 24, 120, n, 12, i === 1 ? I : G5, 600); x += w + 8; });
    const days = ["M", "T", "W", "T", "F", "S", "S"];
    days.forEach((d, i) => {
      const cx = 40 + i * 40, on = i === 2;
      b += t(cx, 160, d, 11, G4, 500, 'text-anchor="middle"');
      if (on) b += `<circle cx="${cx}" cy="184" r="16" fill="${I}"/>`;
      b += t(cx, 189, 10 + i, 14, on ? "#fff" : INK, 600, 'text-anchor="middle"');
      if ([0, 2, 3, 5].includes(i)) b += `<circle cx="${cx}" cy="208" r="2.5" fill="${on ? I : G4}"/>`;
    });
    b += `<line x1="0" y1="224" x2="320" y2="224" stroke="${G1}"/>`;
    for (let h = 0; h < 7; h++) { const y = 252 + h * 56; b += t(24, y + 4, `${h + 8}:00`, 10, G4, 500) + `<line x1="68" y1="${y}" x2="300" y2="${y}" stroke="${G1}"/>`; }
    const ev = [[252, 50, 0, "Morning run", "8:00 – 8:50"], [308, 80, 1, "Design critique", "9:00 – 10:30 · Acme"], [400, 44, 2, "Client sync", "10:40 · Studio"], [476, 70, 1, "Sprint planning", "12:00 – 1:15"], [560, 40, 0, "Dentist", "1:30"]];
    ev.forEach(([y, h, w, n, s]) => { const c = WS[w][1]; b += r(76, y + 2, 224, h - 4, c, 10, 'fill-opacity=".12"') + r(76, y + 2, 4, h - 4, c, 2) + t(90, y + 22, n, 13, INK, 600) + (h > 44 ? t(90, y + 40, s, 11, G5, 500) : ""); });
    b += `<line x1="68" y1="430" x2="300" y2="430" stroke="#EF4444" stroke-width="1.5"/><circle cx="68" cy="430" r="4" fill="#EF4444"/>`;
    b += r(236, 586, 60, 60, I, 30, 'filter="url(#sh)"') + `<path d="M256 616h20M266 606v20" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>`;
    return svg(320, 660, `<defs><filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="${I}" flood-opacity=".35"/></filter></defs>${b}`, label);
  }

  // ---------- analytics dashboard ----------
  function dashboard(label = "Illustration of a merchant analytics dashboard with charts and a data table") {
    let b = r(0, 0, 960, 620, "#fff", 0) + r(0, 0, 200, 620, G0, 0) + `<line x1="200" y1="0" x2="200" y2="620" stroke="${G2}"/>`;
    b += r(24, 26, 28, 28, I, 8) + t(62, 46, "Payments", 15, INK, 700);
    ["Home", "Balances", "Analytics", "Customers", "Products", "Reports"].forEach((n, i) => { const on = i === 2; b += (on ? r(14, 82 + i * 40, 172, 32, I50, 8) : "") + r(28, 92 + i * 40, 12, 12, on ? I : G4, 3) + t(52, 103 + i * 40, n, 13, on ? I : G5, on ? 600 : 500); });
    b += t(232, 52, "Analytics", 22, INK, 700) + t(232, 74, "All reporting in one view", 12, G5, 400);
    [["Last 30 days", 640], ["Compare", 760], ["Export", 862]].forEach(([n, x], i) => { b += r(x, 34, i === 2 ? 74 : 108, 32, i === 2 ? I : "#fff", 8, i === 2 ? "" : `stroke="${G2}"`) + t(x + (i === 2 ? 18 : 16), 54, n, 12, i === 2 ? "#fff" : INK, 600); });
    const k = [["Gross volume", "$2.4B", "+18.2%"], ["Net revenue", "$84.1M", "+9.6%"], ["Successful payments", "12.8M", "+4.1%"], ["Dispute rate", "0.04%", "−0.01"]];
    k.forEach(([n, v, d], i) => { const x = 232 + i * 178; b += r(x, 96, 164, 92, "#fff", 12, `stroke="${G2}"`) + t(x + 16, 122, n, 11, G5, 500) + t(x + 16, 156, v, 22, INK, 700) + t(x + 16, 176, d, 11, "#059669", 600); });
    b += r(232, 204, 452, 236, "#fff", 12, `stroke="${G2}"`) + t(250, 232, "Gross volume", 13, INK, 600) + t(590, 232, "Daily", 11, G5, 500);
    for (let i = 0; i < 4; i++) b += `<line x1="250" y1="${270 + i * 40}" x2="666" y2="${270 + i * 40}" stroke="${G1}"/>`;
    const pts = [380, 372, 360, 366, 340, 344, 330, 318, 322, 300, 306, 290, 282, 288, 270, 262], step = 416 / (pts.length - 1);
    const line = pts.map((y, i) => `${250 + i * step},${y}`).join(" ");
    const prev = pts.map((y, i) => `${250 + i * step},${y + 34 - i}`).join(" ");
    b += `<polygon points="250,400 ${line} 666,400" fill="${I}" fill-opacity=".08"/><polyline points="${prev}" fill="none" stroke="${G4}" stroke-width="2" stroke-dasharray="4 4"/><polyline points="${line}" fill="none" stroke="${I}" stroke-width="2.5" stroke-linejoin="round"/>`;
    b += `<circle cx="${250 + 11 * step}" cy="290" r="5" fill="#fff" stroke="${I}" stroke-width="2.5"/>` + r(250 + 11 * step - 44, 248, 88, 28, INK, 6) + t(250 + 11 * step, 266, "$94.2M", 11, "#fff", 600, 'text-anchor="middle"');
    b += r(700, 204, 236, 236, "#fff", 12, `stroke="${G2}"`) + t(718, 232, "Payment methods", 13, INK, 600);
    [["Cards", 72, I], ["Wallets", 48, "#818CF8"], ["Bank debits", 30, "#A5B4FC"], ["BNPL", 18, I100]].forEach(([n, w, c], i) => { const y = 262 + i * 42; b += t(718, y, n, 11, G5, 500) + t(918, y, `${w}%`, 11, INK, 600, 'text-anchor="end"') + bar(718, y + 10, 200, G1) + bar(718, y + 10, w * 2, c); });
    b += r(232, 456, 704, 148, "#fff", 12, `stroke="${G2}"`) + t(250, 482, "Top customers", 13, INK, 600);
    ["Customer", "Volume", "Payments", "Change"].forEach((h, i) => { b += t(250 + i * 170, 510, h, 10, G4, 600); });
    [["Northwind Co.", "$18.4M", "41,208", "+12%"], ["Bluefin Labs", "$12.9M", "28,410", "+8%"], ["Orbital Goods", "$9.1M", "19,882", "+3%"]].forEach((row, j) => {
      const y = 538 + j * 26; b += `<line x1="250" y1="${y - 16}" x2="918" y2="${y - 16}" stroke="${G1}"/>`;
      row.forEach((c, i) => { b += t(250 + i * 170, y, c, 12, i === 3 ? "#059669" : INK, i ? 500 : 600); });
    });
    return svg(960, 620, b, label);
  }

  // ---------- plugin manager ----------
  function plugins(label = "Illustration of a desktop plugin manager with categories, ratings and update buttons") {
    let b = r(0, 0, 960, 620, "#fff", 0) + r(0, 0, 960, 40, G0, 0) + `<line x1="0" y1="40" x2="960" y2="40" stroke="${G2}"/>`;
    ["#F87171", "#FBBF24", "#34D399"].forEach((c, i) => { b += `<circle cx="${22 + i * 18}" cy="20" r="6" fill="${c}"/>`; });
    b += t(480, 25, "Plugins", 12, G5, 600, 'text-anchor="middle"');
    b += t(28, 82, "Browse", 11, G4, 600);
    ["All plugins", "Installed", "Updates · 3", "Accessibility", "Content", "Prototyping", "Dev handoff"].forEach((n, i) => { const on = i === 0; b += (on ? r(16, 96 + i * 36, 176, 30, I50, 8) : "") + t(30, 116 + i * 36, n, 13, on ? I : INK, on ? 600 : 500); });
    b += `<line x1="208" y1="40" x2="208" y2="620" stroke="${G2}"/>`;
    b += r(232, 62, 460, 40, G0, 10, `stroke="${G2}"`) + `<circle cx="256" cy="82" r="7" fill="none" stroke="${G4}" stroke-width="2"/><path d="m261 87 5 5" stroke="${G4}" stroke-width="2" stroke-linecap="round"/>` + t(276, 87, "Search 2,400 plugins", 13, G4, 400);
    ["Popular", "New", "Top rated"].forEach((n, i) => { b += r(710 + i * 76, 66, 70, 32, i === 0 ? INK : "#fff", 16, i ? `stroke="${G2}"` : "") + t(745 + i * 76, 86, n, 11, i ? INK : "#fff", 600, 'text-anchor="middle"'); });
    const P = [["Contrast Check", "Accessibility", "4.9", "#10B981", "Installed"], ["Lorem Studio", "Content", "4.7", "#F59E0B", "Update"], ["Spec Inspector", "Dev handoff", "4.8", I, "Install"], ["Icon Atlas", "Content", "4.6", "#EC4899", "Install"], ["Flow Linker", "Prototyping", "4.8", "#0EA5E9", "Update"], ["Token Sync", "Dev handoff", "4.9", "#8B5CF6", "Installed"]];
    P.forEach(([n, c, s, col, a], i) => {
      const x = 232 + (i % 3) * 182, y = 122 + Math.floor(i / 3) * 214;
      b += r(x, y, 168, 198, "#fff", 14, `stroke="${G2}"`) + r(x + 16, y + 16, 44, 44, col, 12, 'fill-opacity=".15"') + r(x + 28, y + 28, 20, 20, col, 6);
      b += t(x + 16, y + 86, n, 13, INK, 600) + t(x + 16, y + 104, c, 11, G5, 500);
      for (let k = 0; k < 5; k++) b += `<circle cx="${x + 20 + k * 12}" cy="${y + 126}" r="4" fill="${k < 4 ? "#FBBF24" : G2}"/>`;
      b += t(x + 84, y + 130, s, 11, INK, 600);
      const up = a === "Update", inst = a === "Installed";
      b += r(x + 16, y + 148, 136, 34, up ? I : inst ? G1 : "#fff", 8, !up && !inst ? `stroke="${I}"` : "") + t(x + 84, y + 170, a, 12, up ? "#fff" : inst ? G5 : I, 600, 'text-anchor="middle"');
    });
    b += r(788, 122, 152, 412, I50, 14) + t(804, 150, "3 updates ready", 13, INK, 600) + t(804, 170, "Update all in one click", 11, G5, 400);
    ["Lorem Studio", "Flow Linker", "Pixel Grid"].forEach((n, i) => { const y = 196 + i * 58; b += r(804, y, 120, 46, "#fff", 10) + t(816, y + 20, n, 12, INK, 600) + t(816, y + 36, `v2.${4 + i} → v2.${5 + i}`, 10, G5, 500); });
    b += r(804, 380, 120, 34, I, 8) + t(864, 402, "Update all", 12, "#fff", 600, 'text-anchor="middle"');
    b += t(804, 448, "Your reviews", 12, INK, 600) + bar(804, 462, 120, "#fff") + bar(804, 462, 84, I) + bar(804, 480, 120, "#fff") + bar(804, 480, 60, "#A5B4FC");
    return svg(960, 620, b, label);
  }

  // ---------- patient portal (laptop + phone) ----------
  function portal(label = "Illustration of an accessible patient portal on a laptop and a phone") {
    let s = r(0, 0, 640, 400, "#fff", 0) + r(0, 0, 640, 52, "#0F766E", 0) + t(24, 32, "HealthTrack", 15, "#fff", 700) + t(560, 32, "Hi, Sam", 12, "#CCFBF1", 500);
    s += t(24, 86, "Book an appointment", 17, INK, 700) + t(24, 106, "Dr. Rivera · Primary care", 12, G5, 500);
    ["Mon 17", "Tue 18", "Wed 19", "Thu 20"].forEach((d, i) => { const on = i === 1; s += r(24 + i * 84, 122, 76, 52, on ? "#0F766E" : "#fff", 10, on ? "" : `stroke="${G2}"`) + t(62 + i * 84, 153, d, 12, on ? "#fff" : INK, 600, 'text-anchor="middle"'); });
    ["9:00", "9:30", "10:15", "11:00", "2:30", "3:15"].forEach((h, i) => { const on = i === 2, x = 24 + (i % 3) * 110, y = 190 + Math.floor(i / 3) * 46; s += r(x, y, 100, 36, on ? "#CCFBF1" : G0, 8, `stroke="${on ? "#0F766E" : G2}"`) + t(x + 50, y + 23, h, 12, on ? "#0F766E" : INK, 600, 'text-anchor="middle"'); });
    s += r(24, 300, 320, 44, "#0F766E", 10) + t(184, 327, "Confirm Tue 18 · 10:15", 13, "#fff", 600, 'text-anchor="middle"');
    s += r(372, 72, 244, 300, G0, 12, `stroke="${G2}"`) + t(390, 100, "Lab results", 14, INK, 700);
    [["Glucose", "92 mg/dL", 0.45], ["Cholesterol", "178 mg/dL", 0.6], ["Vitamin D", "31 ng/mL", 0.35]].forEach(([n, v, p], i) => { const y = 132 + i * 70; s += t(390, y, n, 12, G5, 500) + t(598, y, v, 12, INK, 600, 'text-anchor="end"') + bar(390, y + 14, 208, "#D1FAE5", 10) + `<circle cx="${390 + 208 * p}" cy="${y + 19}" r="7" fill="#fff" stroke="#0F766E" stroke-width="3"/>` + t(390, y + 44, "In normal range", 10, "#047857", 600); });
    let b = `<defs><clipPath id="lp"><rect x="80" y="40" width="640" height="400"/></clipPath></defs>`;
    b += r(64, 24, 672, 432, "#1F2937", 18) + `<g clip-path="url(#lp)" transform="translate(80 40)">${s}</g>` + `<path d="M20 456h760l-34 26H54z" fill="#D1D5DB"/>` + r(340, 456, 120, 8, "#9CA3AF", 4);
    let p = r(0, 0, 200, 400, "#fff", 0) + r(0, 0, 200, 64, "#0F766E", 0) + t(16, 44, "Messages", 15, "#fff", 700);
    [["Dr. Rivera", "Your results look great —", 1], ["Front desk", "Reminder: Tue 18 at 10:15", 0], ["Care team", "Your refill is ready", 0]].forEach(([n, m, u], i) => { const y = 82 + i * 70; p += `<circle cx="34" cy="${y + 22}" r="16" fill="#CCFBF1"/>` + t(34, y + 27, n[0], 12, "#0F766E", 700, 'text-anchor="middle"') + t(58, y + 18, n, 12, INK, 600) + t(58, y + 36, m, 10, G5, 400) + (u ? `<circle cx="184" cy="${y + 14}" r="4" fill="#0F766E"/>` : "") + `<line x1="16" y1="${y + 56}" x2="184" y2="${y + 56}" stroke="${G1}"/>`; });
    p += r(16, 330, 168, 40, G1, 20) + t(32, 355, "Write a message…", 11, G4, 400);
    b += `<g transform="translate(560 168)"><rect x="-10" y="-10" width="220" height="420" rx="30" fill="#111827"/><clipPath id="pp"><rect width="200" height="400" rx="22"/></clipPath><g clip-path="url(#pp)">${p}</g></g>`;
    return svg(800, 500, b, label);
  }

  // ---------- compact component card for the hero ----------
  function component(label = "Illustration of a design-system component specification") {
    let b = r(0, 0, 260, 188, "#fff", 16);
    b += t(18, 30, "Button / Primary", 12, INK, 600) + r(186, 16, 56, 22, I50, 11) + t(214, 31, "v3.2", 10, I, 600, 'text-anchor="middle"');
    b += r(18, 50, 108, 40, I, 10) + t(72, 75, "Continue", 13, "#fff", 600, 'text-anchor="middle"');
    b += r(136, 50, 106, 40, "#fff", 10, `stroke="${I}"`) + t(189, 75, "Cancel", 13, I, 600, 'text-anchor="middle"');
    b += `<path d="M18 104h108" stroke="#F472B6" stroke-width="1"/><path d="M18 100v8M126 100v8" stroke="#F472B6"/>` + t(72, 120, "108 × 40", 10, "#DB2777", 600, 'text-anchor="middle"');
    [["radius", "10"], ["padding", "12 / 20"], ["token", "indigo-500"]].forEach(([k, v], i) => { const y = 146 + i * 0; b += t(18 + i * 84, y, k, 10, G4, 500) + t(18 + i * 84, y + 18, v, 11, INK, 600); });
    return svg(260, 188, b, label);
  }

  // ---------- illustrated headshot ----------
  function portrait(label = "Illustrated portrait of Ava Chen") {
    return svg(560, 640, `
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF0F4"/><stop offset="1" stop-color="#DDE1E8"/></linearGradient>
        <radialGradient id="light" cx=".3" cy=".25" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D2B8"/><stop offset="1" stop-color="#E2B694"/></linearGradient>
      </defs>
      <rect width="560" height="640" fill="url(#bg)"/><rect width="560" height="640" fill="url(#light)"/>
      <path d="M100 640c8-110 70-168 180-168s172 58 180 168z" fill="#C7CDF9"/>
      <path d="M150 640c10-80 56-130 130-130s120 50 130 130z" fill="#A5B4FC" opacity=".55"/>
      <path d="M244 420h72v74c-10 22-62 22-72 0z" fill="#DDAE8C"/>
      <path d="M244 470c20 26 52 26 72 0v20c-14 22-58 22-72 0z" fill="#C99878" opacity=".5"/>
      <path d="M176 270c-10-108 50-170 108-170 70 0 120 56 112 170-4 64-6 124 22 170-60 18-104-4-120-52-26 52-90 66-138 40 28-44 22-102 16-158z" fill="#1F1A1C"/>
      <ellipse cx="280" cy="300" rx="84" ry="104" fill="url(#skin)"/>
      <path d="M196 262c18-80 72-108 120-102 44 6 70 46 72 96-40-8-92-30-120-64-12 34-38 58-72 70z" fill="#1F1A1C"/>
      <ellipse cx="248" cy="306" rx="7" ry="8" fill="#2A2023"/><ellipse cx="314" cy="306" rx="7" ry="8" fill="#2A2023"/>
      <path d="M232 286c10-6 22-6 30 0M298 286c10-6 22-6 30 0" stroke="#3B2E2F" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M280 316c-4 16-8 26 2 30" stroke="#C99878" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M254 366c16 14 40 14 54 0" stroke="#B4535E" stroke-width="5" stroke-linecap="round" fill="none"/>
      <ellipse cx="228" cy="344" rx="16" ry="9" fill="#F08F86" opacity=".25"/><ellipse cx="334" cy="344" rx="16" ry="9" fill="#F08F86" opacity=".25"/>
      <circle cx="198" cy="330" r="5" fill="${I}"/>
    `, label);
  }

  window.Art = { calendar, dashboard, plugins, portal, component, portrait };
})();
