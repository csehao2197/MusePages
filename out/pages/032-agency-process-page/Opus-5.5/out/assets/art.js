// Original SVG illustrations for the process page. Exposes window.Art (each returns an SVG string).
(function () {
  "use strict";
  const IN = "#6366F1", VI = "#8B5CF6", DK = "#1E1B4B", EM = "#10B981", SL = "#0F172A", G5 = "#64748B", G4 = "#94A3B8", G2 = "#E2E8F0", G1 = "#F1F5F9", G0 = "#F8FAFC";
  const F = 'font-family="Inter, system-ui, sans-serif"';
  const H = 'font-family="Plus Jakarta Sans, Inter, sans-serif"';
  const t = (x, y, s, size = 12, fill = SL, w = 500, extra = "") => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${w}" fill="${fill}" ${extra}>${s}</text>`;
  const r = (x, y, w, h, fill, rx = 8, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const line = (x, y, w, c = G2, h = 8) => r(x, y, w, h, c, h / 2);
  const svg = (w, h, body, label, defs = "") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" ${F}><defs><filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#1E1B4B" flood-opacity=".12"/></filter>${defs}</defs>${body}</svg>`;
  const check = (x, y, c = EM) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/><path d="m${x - 4} ${y}l3 3 5-6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ---------- hero: isometric blocks ----------
  function hero() {
    const cube = (cx, cy, s, h, top, left, right, label, icon) => {
      const dx = s * 0.866, dy = s * 0.5;
      return `<g>
        <path d="M${cx} ${cy - dy} L${cx + dx} ${cy} L${cx} ${cy + dy} L${cx - dx} ${cy}Z" fill="${top}"/>
        <path d="M${cx - dx} ${cy} L${cx} ${cy + dy} L${cx} ${cy + dy + h} L${cx - dx} ${cy + h}Z" fill="${left}"/>
        <path d="M${cx + dx} ${cy} L${cx} ${cy + dy} L${cx} ${cy + dy + h} L${cx + dx} ${cy + h}Z" fill="${right}"/>
        <g transform="translate(${cx} ${cy}) scale(1 .577) rotate(45)">${icon}</g>
        <text x="${cx - dx * 0.5}" y="${cy + dy * 0.5 + h * 0.55}" font-size="15" font-weight="700" fill="#fff" ${H} transform="skewY(30)" transform-origin="${cx - dx * 0.5} ${cy + dy * 0.5 + h * 0.55}" text-anchor="middle">${label}</text>
      </g>`;
    };
    const ic = {
      search: `<circle cx="-4" cy="-4" r="14" fill="none" stroke="#fff" stroke-width="5"/><path d="m7 7 12 12" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
      pen: `<path d="M-14 14 6-6l8 8-20 20h-8z" fill="#fff"/><path d="m10-10 6-6 8 8-6 6z" fill="#fff" opacity=".7"/>`,
      code: `<path d="m-8-14-12 14 12 14M8-14l12 14-12 14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      rocket: `<path d="M0-22c10 6 14 18 10 30H-10C-14-4-10-16 0-22z" fill="#fff"/><path d="M-10 8-18 18h10M10 8l8 10H8" fill="#fff" opacity=".7"/>`,
    };
    const P = [
      [160, 300, "#A5B4FC", "#818CF8", "#6366F1", "01", ic.search, 60],
      [290, 225, "#C4B5FD", "#A78BFA", "#8B5CF6", "02", ic.pen, 84],
      [420, 150, "#818CF8", "#6366F1", "#4F46E5", "03", ic.code, 108],
      [550, 75, "#6EE7B7", "#34D399", "#10B981", "04", ic.rocket, 132],
    ];
    let b = `<path d="M60 360 L380 545 L700 360 L380 175Z" fill="#EEF2FF" opacity=".7"/>`;
    for (let i = 0; i < 4; i++) b += `<path d="M${120 + i * 40} ${330 - i * 22}" />`;
    b += `<path d="M160 330 L290 255 L420 180 L550 105" stroke="${IN}" stroke-width="2" stroke-dasharray="5 6" fill="none" opacity=".5"/>`;
    P.forEach(([x, y, top, left, right, n, icon, h]) => { b += cube(x, y + 160 - h, 72, h, top, left, right, n, icon); });
    b += r(470, 330, 190, 68, "#fff", 14, 'filter="url(#s)"') + check(498, 364) + t(518, 360, "Launch-ready", 14, SL, 700, H) + t(518, 380, "Week 12 · on schedule", 12, G5, 500);
    b += r(40, 70, 178, 60, "#fff", 14, 'filter="url(#s)"') + `<circle cx="70" cy="100" r="14" fill="#EEF2FF"/>` + t(64, 105, "4", 14, IN, 800, H) + t(92, 96, "4 phases", 13, SL, 700, H) + t(92, 114, "1 clear path", 12, G5, 500);
    return svg(720, 560, b, "Isometric illustration of four connected building blocks for Discover, Design, Develop and Deliver");
  }

  // ---------- discover: brief + persona ----------
  function discover() {
    let b = r(40, 30, 380, 470, "#fff", 16, `filter="url(#s)" stroke="${G2}"`);
    b += r(64, 58, 96, 24, "#EEF2FF", 12) + t(78, 75, "PROJECT BRIEF", 10, IN, 700, 'letter-spacing="1"') + t(64, 116, "Streamline · Ops Hub", 22, SL, 800, H);
    b += t(64, 140, "v1.2 · Approved by stakeholders", 12, G5, 500);
    b += t(64, 182, "Goal", 12, SL, 700) + line(64, 194, 300) + line(64, 210, 250);
    b += t(64, 252, "Success metrics", 12, SL, 700);
    [["Activation", "45%"], ["Time to first value", "< 5 min"], ["Weekly retention", "60%"]].forEach(([k, v], i) => { const y = 268 + i * 40; b += r(64, y, 332, 32, G0, 8) + t(78, y + 21, k, 12, G5, 500) + t(382, y + 21, v, 13, SL, 700, 'text-anchor="end"'); });
    b += t(64, 414, "Sitemap", 12, SL, 700);
    b += r(64, 428, 70, 22, IN, 6) + `<path d="M99 450v14M99 464h-60v10M99 464h0v10M99 464h60v10" stroke="${G4}" fill="none"/>` + [39, 99, 159].map((x) => r(x - 26, 474, 52, 18, "#E0E7FF", 5)).join("");
    // persona card
    b += `<g transform="translate(330 150) rotate(4)">` + r(0, 0, 250, 300, "#fff", 18, `filter="url(#s)" stroke="${G2}"`);
    b += `<circle cx="125" cy="70" r="40" fill="#E0E7FF"/><circle cx="125" cy="60" r="16" fill="${IN}"/><path d="M97 98c6-18 50-18 56 0" fill="${IN}"/>`;
    b += t(125, 136, "Priya, Ops Lead", 17, SL, 800, `${H} text-anchor="middle"`) + t(125, 156, "Persona 1 of 3 · 34 · Remote", 11, G5, 500, 'text-anchor="middle"');
    b += t(24, 190, "Needs", 11, IN, 700, 'letter-spacing="1"') + line(24, 200, 200) + line(24, 214, 160);
    b += t(24, 246, "Frustrations", 11, "#E11D48", 700, 'letter-spacing="1"') + line(24, 256, 190) + line(24, 270, 130);
    b += `</g>`;
    return svg(620, 520, b, "Illustration of a project brief document and a user persona card");
  }

  // ---------- design: figma screens with annotations ----------
  function design() {
    let b = r(20, 20, 600, 470, "#2C2C2C", 14, 'filter="url(#s)"');
    b += r(20, 20, 600, 36, "#1E1E1E", 14) + r(20, 42, 600, 14, "#1E1E1E", 0);
    [0, 1, 2].forEach((i) => { b += `<circle cx="${40 + i * 16}" cy="38" r="5" fill="#555"/>`; });
    b += t(320, 43, "Ops Hub — Hi-fi v3", 12, "#ddd", 600, 'text-anchor="middle"');
    b += r(20, 56, 120, 434, "#252525", 0) + ["Pages", "Onboarding", "Dashboard", "Settings", "Components"].map((n, i) => (i === 2 ? r(28, 76 + i * 26, 104, 22, "#3A3A6A", 4) : "") + t(38, 92 + i * 26, n, 11, i === 2 ? "#fff" : "#999", 500)).join("");
    // frame 1: dashboard
    b += t(162, 82, "Dashboard / Default", 10, "#aaa", 500) + r(162, 90, 250, 330, "#fff", 6);
    b += r(176, 106, 90, 12, SL, 6) + r(176, 130, 222, 70, "#EEF2FF", 10) + `<polyline points="186,186 216,170 246,176 276,154 306,160 336,140 386,146" stroke="${IN}" stroke-width="3" fill="none"/>`;
    [0, 1].forEach((i) => { b += r(176 + i * 115, 212, 107, 60, G0, 10, `stroke="${G2}"`) + line(188 + i * 115, 228, 60, G4, 6) + r(188 + i * 115, 244, 40, 14, SL, 4); });
    [0, 1, 2].forEach((i) => { b += r(176, 288 + i * 38, 222, 30, G0, 8) + `<circle cx="194" cy="${303 + i * 38}" r="8" fill="${[IN, VI, EM][i]}"/>` + line(210, 299 + i * 38, 110, G4, 8); });
    b += r(176, 400, 222, 0, "none");
    // frame 2: mobile
    b += t(434, 82, "Mobile / Tasks", 10, "#aaa", 500) + r(434, 90, 150, 300, "#fff", 18);
    b += r(448, 112, 70, 12, SL, 6) + [0, 1, 2, 3].map((i) => r(448, 140 + i * 50, 122, 40, G0, 10) + check(466, 160 + i * 50, i < 2 ? EM : G2) + line(482, 156 + i * 50, 70, G4, 7)).join("") + r(448, 344, 122, 32, IN, 16);
    // selection + annotations
    b += r(174, 128, 226, 74, "none", 10, `stroke="#0EA5E9" stroke-width="2"`) + [[174, 128], [400, 128], [174, 202], [400, 202]].map(([x, y]) => r(x - 3, y - 3, 6, 6, "#fff", 0, 'stroke="#0EA5E9" stroke-width="1.5"')).join("");
    b += `<path d="M400 165h40" stroke="#F472B6" stroke-width="1.5"/>` + r(440, 400, 0, 0, "none");
    const note = (x, y, n, s) => `<circle cx="${x}" cy="${y}" r="13" fill="#F472B6"/>${t(x, y + 5, n, 12, "#fff", 800, 'text-anchor="middle"')}` + r(x + 20, y - 15, s.length * 6.4 + 20, 30, "#FDF2F8", 8, 'stroke="#F9A8D4"') + t(x + 30, y + 5, s, 11, "#9D174D", 600);
    b += note(318, 448, "1", "Chart uses tokens: indigo-500");
    b += note(450, 410, "2", "Tap target 44px");
    b += `<path d="M318 435V206" stroke="#F472B6" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    // comment bubble
    b += r(440, 230, 160, 62, "#fff", 12, 'filter="url(#s)"') + `<circle cx="460" cy="250" r="10" fill="${EM}"/>` + t(476, 254, "Client", 11, SL, 700) + t(454, 278, "Love this layout!", 11, G5, 500);
    return svg(640, 510, b, "Illustration of design screens in a design tool with annotation callouts and a client comment");
  }

  // ---------- develop: sprint board + diff ----------
  function develop() {
    let b = r(20, 20, 460, 340, "#fff", 16, `filter="url(#s)" stroke="${G2}"`);
    b += t(44, 56, "Sprint 3", 18, SL, 800, H) + r(130, 40, 108, 22, "#ECFDF5", 11) + t(184, 55, "Week 8 of 12", 11, "#047857", 700, 'text-anchor="middle"');
    const cols = [["To do", G4, ["Audit log", "Billing webhooks"]], ["In progress", IN, ["Team invites", "CSV export"]], ["Done", EM, ["SSO login", "Roles & perms", "Dashboard API"]]];
    cols.forEach(([n, c, items], i) => {
      const x = 44 + i * 144; b += `<circle cx="${x + 5}" cy="88" r="5" fill="${c}"/>` + t(x + 16, 92, n, 12, SL, 700) + t(x + 120, 92, items.length, 11, G4, 600);
      items.forEach((it, j) => { const y = 106 + j * 74; b += r(x, y, 132, 64, G0, 10, `stroke="${G2}"`) + t(x + 12, y + 24, it, 12, SL, 600) + r(x + 12, y + 36, 40, 16, c, 8, 'opacity=".15"') + t(x + 32, y + 48, ["FS-1", "FS-2", "FS-3"][j], 9, c, 700, 'text-anchor="middle"') + `<circle cx="${x + 114}" cy="${y + 44}" r="9" fill="${["#FDE68A", "#C7D2FE", "#A7F3D0"][j]}"/>`; });
    });
    // diff
    b += `<g transform="translate(200 230)">` + r(0, 0, 400, 250, SL, 14, 'filter="url(#s)"') + r(0, 0, 400, 34, "#1E293B", 14) + r(0, 20, 400, 14, "#1E293B", 0);
    b += t(16, 22, "src/api/invites.ts", 11, "#CBD5E1", 600) + t(384, 22, "+18 −4", 11, EM, 700, 'text-anchor="end"');
    const L = [[" ", "export async function invite(team, email) {", "#CBD5E1"], ["-", "  return db.insert(email)", "#FCA5A5"], ["+", "  const role = await roles.default(team)", "#86EFAC"], ["+", "  await audit.log('invite', { team, email })", "#86EFAC"], ["+", "  return db.invites.create({ team, email, role })", "#86EFAC"], [" ", "}", "#CBD5E1"], [" ", "", "#CBD5E1"], [" ", "test('invites get default role') ✓", "#94A3B8"]];
    L.forEach(([s, c, col], i) => { const y = 58 + i * 23; if (s !== " ") b += r(0, y - 15, 400, 22, s === "+" ? "#10B981" : "#EF4444", 0, 'opacity=".12"'); b += t(14, y, String(i + 41), 10, "#475569", 500, 'font-family="ui-monospace, monospace"') + t(42, y, s, 11, col, 700, 'font-family="ui-monospace, monospace"') + t(56, y, c.replace(/</g, "&lt;"), 11, col, 500, 'font-family="ui-monospace, monospace"'); });
    b += `</g>` + r(470, 196, 140, 36, "#fff", 18, 'filter="url(#s)"') + check(492, 214) + t(508, 219, "CI passed · 94%", 11, SL, 700);
    return svg(640, 500, b, "Illustration of a sprint board with task cards and a code diff view");
  }

  // ---------- deliver: checklist + lighthouse ----------
  function deliver() {
    let b = r(30, 30, 380, 440, "#fff", 16, `filter="url(#s)" stroke="${G2}"`);
    b += t(56, 72, "Go-live checklist", 20, SL, 800, H) + t(56, 94, "8 of 8 complete · approved by client", 12, G5, 500);
    b += line(56, 110, 328, "#D1FAE5", 8) + line(56, 110, 328, EM, 8);
    ["Production deploy", "DNS & SSL", "Core Web Vitals pass", "Mixpanel events firing", "Sentry alerts wired", "Backups verified", "Handoff docs shared", "Launch Slack channel"].forEach((n, i) => {
      const y = 148 + i * 38; b += check(68, y) + t(88, y + 5, n, 14, SL, 600) + (i < 7 ? `<line x1="56" y1="${y + 19}" x2="384" y2="${y + 19}" stroke="${G1}"/>` : "");
    });
    // lighthouse
    b += `<g transform="translate(440 120)">` + r(0, 0, 180, 250, "#fff", 18, `filter="url(#s)" stroke="${G2}"`);
    b += t(90, 34, "Lighthouse", 13, SL, 700, 'text-anchor="middle"');
    const ring = (cx, cy, rr, v, label) => { const L = 2 * Math.PI * rr; return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="#ECFDF5"/><circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#D1FAE5" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="${EM}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${L * v / 100} ${L}" transform="rotate(-90 ${cx} ${cy})"/>` + t(cx, cy + 6, v, rr > 30 ? 22 : 13, "#047857", 800, `${H} text-anchor="middle"`) + (label ? t(cx, cy + rr + 18, label, 10, G5, 600, 'text-anchor="middle"') : ""); };
    b += ring(90, 96, 40, 98, "Performance");
    b += ring(40, 196, 18, 100, "A11y") + ring(90, 196, 18, 96, "Best") + ring(140, 196, 18, 100, "SEO");
    b += `</g>` + r(440, 392, 180, 56, SL, 14) + `<circle cx="464" cy="420" r="6" fill="${EM}"><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>` + t(478, 416, "Live", 13, "#fff", 700) + t(478, 434, "99.99% uptime", 11, G4, 500);
    return svg(650, 500, b, "Illustration of a go-live checklist with green checkmarks and a Lighthouse score badge");
  }

  window.Art = { hero, discover, design, develop, deliver };
})();
