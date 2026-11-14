// Original SVG scenes for IGNITE 30 (no photos). Exposes window.Art.
(function () {
  "use strict";
  const OR = "#F97316";
  const svg = (w, h, body, label, defs = "", par = "xMidYMid slice") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="${par}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs>${defs}</defs>${body}</svg>`;

  // a stylised athlete silhouette built from limbs: pose = joint angles
  function athlete(x, y, s, pose, fill, extra = "") {
    const P = Object.assign({ torso: -10, head: 0, armL: 160, armR: 150, foreL: 0, foreR: 0, legL: 10, legR: -10, shinL: 0, shinR: 0 }, pose);
    const limb = (len, w, ang, child = "") => `<g transform="rotate(${ang})"><rect x="${-w / 2}" y="0" width="${w}" height="${len}" rx="${w / 2}" fill="${fill}"/>${child ? `<g transform="translate(0 ${len - w / 2})">${child}</g>` : ""}</g>`;
    const leg = (a, b) => limb(78, 26, a, limb(76, 21, b));
    const arm = (a, b, hold = "") => limb(58, 18, a, limb(54, 15, b, hold));
    return `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>
      ${leg(P.legL, P.shinL)}${leg(P.legR, P.shinR)}
      <g transform="rotate(${P.torso})">
        <rect x="-26" y="-112" width="52" height="118" rx="24" fill="${fill}"/>
        <g transform="translate(0 -128) rotate(${P.head})"><circle r="22" fill="${fill}"/></g>
        <g transform="translate(-6 -100)">${arm(P.armL, P.foreL, P.hold || "")}</g>
        <g transform="translate(6 -100)">${arm(P.armR, P.foreR)}</g>
      </g>
    </g>`;
  }
  const kettlebell = `<g transform="translate(0 46)"><circle cy="20" r="22" fill="${OR}"/><path d="M-12 2a12 12 0 0 1 24 0" stroke="${OR}" stroke-width="6" fill="none"/></g>`;

  function hero() {
    const defs = `<radialGradient id="spot" cx=".62" cy=".2" r=".7"><stop offset="0" stop-color="#FDBA74" stop-opacity=".55"/><stop offset=".35" stop-color="#F97316" stop-opacity=".18"/><stop offset="1" stop-color="#020617" stop-opacity="0"/></radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E293B"/><stop offset="1" stop-color="#020617"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="6"/></filter><filter id="soft"><feGaussianBlur stdDeviation="2"/></filter>`;
    let b = `<rect width="1600" height="900" fill="#0B1120"/>`;
    b += [...Array(9)].map((_, i) => `<rect x="${i * 190 - 40}" y="0" width="110" height="600" fill="#111827" opacity="${0.5 + (i % 3) * 0.15}"/>`).join("");
    b += `<rect y="600" width="1600" height="300" fill="url(#floor)"/>`;
    b += `<g opacity=".55">${[0, 1, 2, 3, 4].map((i) => `<rect x="${120 + i * 36}" y="540" width="26" height="60" rx="4" fill="#334155"/><circle cx="${133 + i * 36}" cy="532" r="16" fill="#334155"/>`).join("")}<rect x="1280" y="420" width="220" height="16" rx="8" fill="#334155"/><rect x="1300" y="436" width="12" height="164" fill="#334155"/><rect x="1468" y="436" width="12" height="164" fill="#334155"/></g>`;
    b += `<ellipse cx="1000" cy="160" rx="520" ry="380" fill="url(#spot)"/>`;
    b += `<path d="M1000 -20 760 640h480z" fill="#FDBA74" opacity=".06"/>`;
    // motion trail
    [0.12, 0.22, 0.35].forEach((o, i) => { b += `<g opacity="${o}" filter="url(#blur)">${athlete(1000 - (3 - i) * 26, 600, 1.65, { torso: 30 - i * 14, armL: 120 - i * 24, armR: 112 - i * 24, legL: -22, legR: 18, shinL: 18, shinR: -14, head: -10, hold: kettlebell }, "#F97316")}</g>`; });
    b += athlete(1000, 600, 1.65, { torso: -8, armL: 196, armR: 188, foreL: 0, foreR: 0, legL: -18, legR: 16, shinL: 10, shinR: -8, head: 6, hold: kettlebell }, "#020617");
    b += `<g filter="url(#soft)" opacity=".8">${athlete(1000, 600, 1.65, { torso: -8, armL: 196, armR: 188, legL: -18, legR: 16, shinL: 10, shinR: -8, head: 6 }, "none")}</g>`;
    b += `<path d="M904 380c-4-40 14-80 40-100M1100 360c10-36 0-80-24-104" stroke="#FDBA74" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round"/>`;
    b += `<ellipse cx="1000" cy="770" rx="170" ry="20" fill="#000" opacity=".55"/>`;
    return svg(1600, 900, b, "Illustration of an athlete swinging a kettlebell in a dark gym with dramatic orange light", defs);
  }

  function group() {
    const defs = `<linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C2D12"/><stop offset="1" stop-color="#020617"/></linearGradient>`;
    let b = `<rect width="1600" height="700" fill="url(#gg)"/>`;
    b += [...Array(14)].map((_, i) => `<circle cx="${(i * 131) % 1600}" cy="${80 + (i * 47) % 200}" r="${40 + (i % 4) * 22}" fill="#FDBA74" opacity=".05"/>`).join("");
    const poses = [
      { torso: 0, armL: 200, armR: 160, legL: -14, legR: 14 },
      { torso: -6, armL: 150, armR: 210, legL: -30, legR: 26, shinL: 30, shinR: -30 },
      { torso: 4, armL: 190, armR: 170, legL: -8, legR: 8 },
      { torso: -2, armL: 220, armR: 140, legL: -26, legR: 24 },
      { torso: 6, armL: 180, armR: 180, legL: -18, legR: 18, shinL: 20, shinR: -20 },
      { torso: -4, armL: 205, armR: 155, legL: -12, legR: 16 },
      { torso: 2, armL: 165, armR: 200, legL: -22, legR: 20 },
    ];
    poses.forEach((p, i) => { b += athlete(140 + i * 220, 470 + (i % 2) * 40, 1.15 + (i % 2) * 0.12, p, i % 3 === 1 ? "#1F2937" : "#0B1120"); });
    b += `<rect y="600" width="1600" height="100" fill="#020617" opacity=".8"/>`;
    return svg(1600, 700, b, "Illustration of a group workout with silhouetted athletes jumping", defs);
  }

  // blurred before/after placeholder: silhouette that's slimmer for "after"
  function beforeAfter(seed, label) {
    const fig = (x, w, c) => `<g transform="translate(${x} 0)"><circle cx="0" cy="80" r="30" fill="${c}"/><rect x="${-w / 2}" y="116" width="${w}" height="120" rx="${w / 3}" fill="${c}"/><rect x="${-w / 2 + 6}" y="226" width="${w / 2 - 10}" height="120" rx="14" fill="${c}"/><rect x="${4}" y="226" width="${w / 2 - 10}" height="120" rx="14" fill="${c}"/></g>`;
    const defs = `<filter id="bb${seed}"><feGaussianBlur stdDeviation="7"/></filter>`;
    const b = `<rect width="400" height="300" fill="#1E293B"/><rect x="200" width="200" height="300" fill="#273449"/>
      <g filter="url(#bb${seed})">${fig(100, 110 - (seed % 2) * 8, "#475569")}${fig(300, 80 - (seed % 2) * 6, "#64748B")}</g>
      <line x1="200" y1="0" x2="200" y2="300" stroke="#0F172A" stroke-width="4"/>`;
    return svg(400, 300, b, label, defs);
  }

  // small round avatar (illustrated)
  const SK = ["#F1C9A5", "#C68863", "#8A5638", "#E0AC7E", "#6B4029", "#F6D7C3"], HR = ["#1F1A17", "#6B4426", "#1F1A17", "#D6A65C", "#2E1F1A", "#B5452B"], BG = ["#F97316", "#0EA5E9", "#22C55E", "#A855F7", "#EAB308", "#EF4444"];
  function avatar(i, label) {
    const s = SK[i % 6], h = HR[(i * 2) % 6], g = BG[i % 6];
    const hair = i % 3 === 0 ? `<path d="M-22-4c0-26 10-36 22-36s22 10 22 36c-4-12-10-16-22-16s-18 4-22 16z" fill="${h}"/>` : i % 3 === 1 ? `<path d="M-24 12c-2-34 10-50 24-50s26 16 24 50l-6-20c-6 4-30 4-36 0z" fill="${h}"/>` : `<circle cx="0" cy="-34" r="10" fill="${h}"/><path d="M-21-6c0-22 9-32 21-32s21 10 21 32c-6-8-14-12-21-12s-15 4-21 12z" fill="${h}"/>`;
    return svg(80, 80, `<g transform="translate(40 44)"><circle r="40" cy="-4" fill="${g}"/><path d="M-30 40c2-20 14-28 30-28s28 8 30 28z" fill="#0F172A"/><rect x="-7" y="4" width="14" height="14" rx="5" fill="${s}"/><ellipse cy="-8" rx="19" ry="22" fill="${s}"/>${hair}<circle cx="-7" cy="-8" r="2.2" fill="#1F1A17"/><circle cx="7" cy="-8" r="2.2" fill="#1F1A17"/><path d="M-6 3c4 4 8 4 12 0" stroke="#7A3030" stroke-width="2" fill="none" stroke-linecap="round"/></g>`, label, "", "xMidYMid meet");
  }

  window.Art = { hero, group, beforeAfter, avatar };
})();
