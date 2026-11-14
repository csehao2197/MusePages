// Original cover art, episode artwork and host portraits (no photos). Exposes window.Art.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029", "#F1CDB0"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C", "#2E1F1A", "#B5452B"];
  const TOPS = ["#F97316", "#7C3AED", "#0EA5E9", "#10B981", "#1C1917", "#EAB308", "#EC4899", "#64748B", "#FDE68A", "#C4B5FD"];
  const BGS = ["#FFEDD5", "#EDE9FE", "#FEF3C7", "#E0F2FE", "#DCFCE7", "#FCE7F3", "#F5F5F4", "#FFE4E6"];

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

  function portrait(p, label, shape = "square") {
    const vb = shape === "circle" ? "-80 -110 160 160" : "-100 -110 200 200";
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${bust(p, 0, 0, 1, true)}</svg>`;
  }


  const HOSTS = {
    maya: { skin: 1, hair: 0, hairStyle: "bob", top: 1, bg: 3 },
    diego: { skin: 3, hair: 0, hairStyle: "short", top: 4, bg: 0, beard: true }
  };
  const hostPhoto = (k, label) => portrait(HOSTS[k], label, "square");

  // show cover art
  function cover() {
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ship It podcast cover art"><defs><linearGradient id="cv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F59E0B"/><stop offset=".55" stop-color="#EA580C"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs><rect width="400" height="400" rx="28" fill="url(#cv)"/>
      <g opacity=".18" stroke="#fff" stroke-width="2">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${40 + i * 40}h400"/>`).join("")}</g>
      <g transform="translate(200 150)"><path d="M-70 40h140l-24 34h-92z" fill="#0F172A"/><path d="M0 -70v104M0-70l52 82H0z" fill="#fff" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M-6-60-48 22H-6z" fill="#FDE68A"/></g>
      <text x="200" y="300" text-anchor="middle" font-family="Space Grotesk,Inter,sans-serif" font-size="72" font-weight="700" fill="#fff" letter-spacing="-2">Ship It</text>
      <text x="200" y="338" text-anchor="middle" font-family="Inter,sans-serif" font-size="15" font-weight="600" fill="#0F172A" letter-spacing="5">THE BUILDERS PODCAST</text></svg>`;
  }
  // episode artwork: deterministic abstract art per episode number
  function epArt(n, label = "") {
    const pal = [["#F59E0B", "#7C3AED"], ["#8B5CF6", "#0EA5E9"], ["#10B981", "#1E293B"], ["#EC4899", "#F59E0B"], ["#0EA5E9", "#6366F1"], ["#EF4444", "#7C3AED"]][n % 6];
    const g = `ea${n}${Math.random().toString(36).slice(2, 6)}`;
    const shapes = [
      `<circle cx="210" cy="90" r="70" fill="#fff" opacity=".18"/><circle cx="90" cy="200" r="110" fill="${pal[1]}" opacity=".55"/>`,
      `<path d="M0 220 L150 60 L300 220z" fill="#fff" opacity=".14"/><path d="M60 300 L210 120 L360 300z" fill="${pal[1]}" opacity=".5"/>`,
      `${Array.from({ length: 6 }, (_, i) => `<rect x="${30 + i * 40}" y="${200 - (i * 37 % 5 + 2) * 26}" width="26" height="${(i * 37 % 5 + 2) * 26}" rx="6" fill="#fff" opacity=".22"/>`).join("")}`,
      `<g fill="none" stroke="#fff" stroke-width="10" opacity=".25">${[40, 80, 120].map((r) => `<circle cx="150" cy="150" r="${r}"/>`).join("")}</g>`
    ][n % 4];
    return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/></linearGradient></defs><rect width="300" height="300" fill="url(#${g})"/>${shapes}<text x="20" y="276" font-family="Space Grotesk,Inter,sans-serif" font-size="42" font-weight="700" fill="#fff" opacity=".92">EP ${n}</text></svg>`;
  }
  window.Art = { cover, epArt, hostPhoto };
})();
