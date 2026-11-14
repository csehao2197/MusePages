// Original SVG illustrations for Inhale Studio (no photos). Exposes window.Art.
// Portrait and figure helpers are shared with sibling Opus-5.5 pages.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029", "#F1CDB0"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C", "#2E1F1A", "#B5452B"];
  const TOPS = ["#F97316", "#7C3AED", "#0EA5E9", "#10B981", "#1C1917", "#EAB308", "#EC4899", "#64748B", "#FDE68A", "#C4B5FD"];
  const BGS = ["#F3E8D8", "#E7EFE9", "#F5E6E0", "#E6EEF1", "#EFE7DA", "#F1E4EC", "#ECE9E4", "#F6EAD8"];

  // person: { skin, hair, hairStyle, top, bg, glasses, beard }
  // hairStyle: short | bob | long | bun | curly | buzz | wrap | side
  function bust(p, x = 0, y = 0, s = 1, withBg = false) {
    const sk = SKIN[p.skin], hr = HAIR[p.hair], tp = TOPS[p.top];
    const shade = "rgba(0,0,0,.08)";
    let back = "", front = "";
    switch (p.hairStyle) {
      case "long": back = `<path d="M-46-30c0-44 22-66 46-66s46 22 46 66v78c-14 8-78 8-92 0z" fill="${hr}"/>`; front = `<path d="M-40-34c4-30 22-46 40-46s38 14 42 44c-24-4-48-14-60-30-6 16-12 26-22 32z" fill="${hr}"/>`; break;
      case "bob": back = `<path d="M-46-28c0-44 22-64 46-64s46 20 46 64v42c-10 6-82 6-92 0z" fill="${hr}"/>`; front = `<path d="M-42-30c2-32 20-50 42-50s40 18 42 50c-30 0-58-8-70-24-4 12-8 20-14 24z" fill="${hr}"/>`; break;
      case "bun": back = `<circle cx="0" cy="-88" r="18" fill="${hr}"/>`; front = `<path d="M-40-26c0-34 18-54 40-54s40 20 40 54c-12-14-30-22-40-22s-28 8-40 22z" fill="${hr}"/>`; break;
      case "curly": back = [[-36, -50], [-20, -72], [4, -78], [26, -70], [40, -48], [-44, -24], [44, -22]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="20" fill="${hr}"/>`).join(""); front = ""; break;
      case "buzz": front = `<path d="M-38-30c0-32 16-50 38-50s38 18 38 50c-8-12-22-18-38-18s-30 6-38 18z" fill="${hr}" opacity=".85"/>`; break;
      case "wrap": back = `<path d="M-50-20c0-50 24-74 50-74s50 24 50 74v70c-20 12-80 12-100 0z" fill="${hr}"/>`; front = `<path d="M-42-12c0-40 18-62 42-62s42 22 42 62c-6-26-22-40-42-40s-36 14-42 40z" fill="${hr}"/>`; break;
      case "side": front = `<path d="M-42-26c-2-36 18-56 44-56 26 0 44 20 40 52-18-20-42-28-62-22-10 4-16 14-22 26z" fill="${hr}"/>`; break;
      default: front = `<path d="M-40-28c0-34 18-52 40-52s40 18 40 52c-6-14-16-20-26-22-12 6-34 6-54 22z" fill="${hr}"/>`;
    }
    const face = `<rect x="-12" y="16" width="24" height="26" rx="8" fill="${sk}"/><path d="M-12 30c8 6 16 6 24 0v8c-8 6-16 6-24 0z" fill="${shade}"/>` +
      `<ellipse cx="0" cy="-16" rx="38" ry="44" fill="${sk}"/>` +
      `<ellipse cx="-38" cy="-12" rx="7" ry="10" fill="${sk}"/><ellipse cx="38" cy="-12" rx="7" ry="10" fill="${sk}"/>`;
    const feat = `<ellipse cx="-14" cy="-12" rx="4" ry="5" fill="#2A211D"/><ellipse cx="14" cy="-12" rx="4" ry="5" fill="#2A211D"/>` +
      `<path d="M-22-26c5-3 11-3 15 0M7-26c5-3 11-3 15 0" stroke="${hr}" stroke-width="3.5" stroke-linecap="round" fill="none"/>` +
      `<path d="M-1-4c-2 6-3 10 2 12" stroke="rgba(0,0,0,.18)" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M-12 14c7 7 17 7 24 0" stroke="#9A3B3B" stroke-width="3.5" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="-24" cy="4" rx="7" ry="4" fill="#F87171" opacity=".18"/><ellipse cx="24" cy="4" rx="7" ry="4" fill="#F87171" opacity=".18"/>` +
      (p.glasses ? `<g fill="none" stroke="#1C1917" stroke-width="2.5"><rect x="-27" y="-21" width="22" height="17" rx="7"/><rect x="5" y="-21" width="22" height="17" rx="7"/><path d="M-5-13h10"/></g>` : "") +
      (p.beard ? `<path d="M-34-4c2 30 18 44 34 44s32-14 34-44c-6 12-14 16-20 16-4-4-10-6-14-6s-10 2-14 6c-6 0-14-4-20-16z" fill="${hr}" opacity=".9"/><path d="M-10 16c6 4 14 4 20 0" stroke="#7A3030" stroke-width="3" fill="none" stroke-linecap="round"/>` : "");
    const body = `<path d="M-74 120c4-52 30-78 74-78s70 26 74 78z" fill="${tp}"/><path d="M-16 42c6 14 26 14 32 0" fill="${sk}"/><path d="M-16 42c6 14 26 14 32 0" stroke="rgba(0,0,0,.08)" stroke-width="2" fill="none"/>`;
    const bg = withBg ? `<rect x="-100" y="-120" width="200" height="240" fill="${BGS[p.bg]}"/><circle cx="56" cy="-74" r="46" fill="#fff" opacity=".35"/>` : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">${bg}${back}${body}${face}${front}${feat}</g>`;
  }

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
  const svg = (w, h, b, label, par = "xMidYMid slice") => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="${par}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${b}</svg>`;
  const POSE = {
    warrior: { torso: 0, head: 0, armL: 90, armR: -90, legL: -48, legR: 52, shinL: 0, shinR: -40 },
    tree: { torso: 0, armL: 170, armR: 190, foreL: -20, foreR: 20, legL: 0, legR: 70, shinR: -140 },
    child: { torso: 100, head: 0, armL: 190, armR: 190, legL: -90, legR: -90, shinL: 160, shinR: 160 },
    seated: { torso: 0, armL: 30, armR: -30, foreL: -40, foreR: 40, legL: -90, legR: 90, shinL: 120, shinR: -120 },
    fold: { torso: 150, head: 20, armL: 0, armR: 0, legL: -6, legR: 6 },
    triangle: { torso: 60, armL: 180, armR: 0, legL: -40, legR: 40 },
    sculpt: { torso: 6, armL: 100, armR: -100, foreL: 70, foreR: -70, legL: -30, legR: 30, shinL: 20, shinR: -20 },
  };
  const yogi = (x, floor, s, pose, fill) => athlete(x, floor - 150 * s, s, POSE[pose], fill);
  function studio(w, h, warm = 1) {
    let b = `<rect width="${w}" height="${h}" fill="#F5EBDD"/>`;
    const win = w / 4;
    for (let i = 0; i < 4; i++) b += `<rect x="${i * win + 14}" y="${h * 0.05}" width="${win - 28}" height="${h * 0.6}" fill="#E8F1F2"/><path d="M${i * win + 14} ${h * 0.05 + h * 0.3}h${win - 28}M${i * win + win / 2} ${h * 0.05}v${h * 0.6}" stroke="#F5EBDD" stroke-width="8"/><path d="M${i * win + 30} ${h * 0.1}l${win * 0.35} ${h * 0.42}" stroke="#fff" stroke-width="18" opacity=".55"/>`;
    b += `<path d="M${w * 0.15} 0 L${w * 0.75} 0 L${w * 0.95} ${h} L${w * 0.25} ${h}z" fill="#FCD9A0" opacity="${0.22 * warm}"/>`;
    b += `<rect y="${h * 0.66}" width="${w}" height="${h * 0.34}" fill="#C69C6D"/>` + [...Array(12)].map((_, i) => `<path d="M0 ${h * 0.66 + i * h * 0.03}H${w}" stroke="#B4875A" stroke-width="2" opacity=".5"/>`).join("");
    b += `<path d="M${w * 0.06} ${h * 0.66}c-10-60 10-120 34-150 6 60-4 110-14 150z" fill="#6B8F71"/><rect x="${w * 0.045}" y="${h * 0.64}" width="${w * 0.05}" height="${h * 0.06}" rx="6" fill="#EADBC8"/>`;
    return b;
  }
  function hero() {
    let b = studio(1600, 900);
    b += `<ellipse cx="1290" cy="700" rx="200" ry="26" fill="#7C9A92" opacity=".8"/>`;
    b += yogi(1290, 700, 1.05, "warrior", "#3F3A33");
    return svg(1600, 900, b, "Illustration of a light-filled studio with wood floors and a practitioner in warrior pose");
  }
  const THUMB = { flow: ["triangle", "#F59E0B"], yin: ["child", "#7C6F5B"], desk: ["sculpt", "#2DD4BF"], sleep: ["seated", "#6366F1"] };
  function thumb(k, label) { const [pose, c] = THUMB[k]; let b = studio(640, 400, 0.6); b += `<rect x="190" y="330" width="260" height="22" rx="6" fill="${c}" opacity=".5"/>`; b += yogi(320, 345, 0.9, pose, "#3F3A33"); if (k === "sleep") b += `<rect width="640" height="400" fill="#1E1B4B" opacity=".45"/><circle cx="520" cy="80" r="30" fill="#FDE68A"/>`; return svg(640, 400, b, label); }
  function map(label, roads) {
    let b = `<rect width="400" height="220" fill="#EFE8DC"/>`;
    roads.forEach(([d, w]) => { b += `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none"/>`; });
    b += `<path d="M0 180c80-20 160 10 240-10s120-30 160-20" stroke="#BFDBFE" stroke-width="16" fill="none"/><rect x="260" y="40" width="90" height="50" rx="8" fill="#D9E8D2"/>`;
    b += `<path d="M200 118c-16-20-24-32-24-44a24 24 0 0 1 48 0c0 12-8 24-24 44z" fill="#7C6F5B"/><circle cx="200" cy="74" r="9" fill="#fff"/>`;
    return svg(400, 220, b, label);
  }
  function portrait(look, label) { return `<svg viewBox="-90 -115 180 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${bust(look, 0, 0, 1, true)}</svg>`; }
  function student() { let b = studio(800, 900); b += yogi(400, 780, 2.2, "tree", "#3F3A33"); return svg(800, 900, b, ""); }
  window.Art = { hero, thumb, map, portrait, student };
})();
