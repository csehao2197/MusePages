// Original illustrated "before/after" figures (no real member photos). Exposes window.Art.
(function () {
  "use strict";
  const SKIN = ["#F6D7C3", "#EDC3A3", "#D9A27E", "#C68863", "#A86D4A", "#8A5638", "#6B4029"];
  const HAIR = ["#1F1A17", "#3B2A20", "#6B4426", "#A0683A", "#D6A65C", "#8C8C8C"];
  const BG = [["#FFEDD5", "#FED7AA"], ["#E0F2FE", "#BAE6FD"], ["#EDE9FE", "#DDD6FE"], ["#DCFCE7", "#BBF7D0"], ["#FCE7F3", "#FBCFE8"], ["#FEF3C7", "#FDE68A"]];

  // p: { skin, hair, style: short|long|bun|buzz|bob, g: "f"|"m", top, bottom, bg }
  // f: body fat 0..1 (1 = heaviest), mu: muscle 0..1
  function figure(p, f, mu = 0.3, label = "", stage = "") {
    const sk = SKIN[p.skin], hr = HAIR[p.hair], [b1, b2] = BG[p.bg % BG.length];
    const sh = 52 + mu * 26 + f * 18;            // shoulder half-width
    const wa = 30 + f * 46 - mu * 4;             // waist half-width
    const hip = (p.g === "f" ? 44 : 36) + f * 34; // hip half-width
    const arm = 13 + f * 9 + mu * 6, leg = 20 + f * 12 + mu * 5;
    const cx = 200, top = p.top, bot = p.bottom;
    const neckY = 150, shY = 172, waistY = 270, hipY = 318, legY = 470;
    const id = `g${Math.round(Math.random() * 1e9)}`;
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient></defs><rect width="400" height="520" fill="url(#${id})"/>`;
    s += `<rect y="470" width="400" height="50" fill="#000" opacity=".06"/><ellipse cx="${cx}" cy="482" rx="${hip + 30}" ry="10" fill="#000" opacity=".12"/>`;
    // hair back
    if (p.style === "long") s += `<path d="M${cx - 44} 120c-6-60 18-86 44-86s50 26 44 86l6 70c-30 12-70 12-100 0z" fill="${hr}"/>`;
    if (p.style === "bob") s += `<path d="M${cx - 46} 112c-4-56 18-80 46-80s50 24 46 80v26c-20 8-72 8-92 0z" fill="${hr}"/>`;
    // legs
    s += `<path d="M${cx - hip + 6} ${hipY - 10}L${cx - 6} ${hipY}L${cx - 10} ${legY}H${cx - 10 - leg * 1.4}z" fill="${sk}"/><path d="M${cx + hip - 6} ${hipY - 10}L${cx + 6} ${hipY}L${cx + 10} ${legY}H${cx + 10 + leg * 1.4}z" fill="${sk}"/>`;
    s += `<path d="M${cx - hip} ${hipY - 30}Q${cx} ${hipY - 40} ${cx + hip} ${hipY - 30}L${cx + hip + 4} ${hipY + 62}H${cx + 6}L${cx} ${hipY + 26}L${cx - 6} ${hipY + 62}H${cx - hip - 4}z" fill="${bot}"/>`;
    s += `<rect x="${cx - 14 - leg * 1.2}" y="${legY - 4}" width="${leg * 1.2 + 6}" height="16" rx="8" fill="#F8FAFC"/><rect x="${cx + 8}" y="${legY - 4}" width="${leg * 1.2 + 6}" height="16" rx="8" fill="#F8FAFC"/>`;
    // arms
    s += `<path d="M${cx - sh + 4} ${shY + 6}Q${cx - sh - arm} ${shY + 70} ${cx - sh - arm * 0.4} ${waistY + 40}L${cx - sh + arm * 1.2} ${waistY + 36}Q${cx - sh + arm} ${shY + 70} ${cx - sh + arm + 8} ${shY + 20}z" fill="${sk}"/>`;
    s += `<path d="M${cx + sh - 4} ${shY + 6}Q${cx + sh + arm} ${shY + 70} ${cx + sh + arm * 0.4} ${waistY + 40}L${cx + sh - arm * 1.2} ${waistY + 36}Q${cx + sh - arm} ${shY + 70} ${cx + sh - arm - 8} ${shY + 20}z" fill="${sk}"/>`;
    // torso (top)
    s += `<path d="M${cx - sh} ${shY}Q${cx} ${shY - 16} ${cx + sh} ${shY}L${cx + sh - 6} ${shY + 34}Q${cx + wa + 8} ${waistY - 40} ${cx + wa} ${waistY}Q${cx + hip + 4} ${hipY - 34} ${cx + hip} ${hipY - 24}L${cx - hip} ${hipY - 24}Q${cx - hip - 4} ${hipY - 34} ${cx - wa} ${waistY}Q${cx - wa - 8} ${waistY - 40} ${cx - sh + 6} ${shY + 34}z" fill="${top}"/>`;
    if (mu > 0.5) s += `<path d="M${cx - sh + 16} ${shY + 18}q${sh - 16} 24 ${(sh - 16) * 2} 0" stroke="#000" stroke-opacity=".15" stroke-width="3" fill="none"/>`;
    // neck + head
    s += `<rect x="${cx - 12}" y="${neckY - 16}" width="24" height="30" rx="8" fill="${sk}"/><ellipse cx="${cx}" cy="100" rx="${36 + f * 6}" ry="${44 + f * 3}" fill="${sk}"/>`;
    s += `<circle cx="${cx - 13}" cy="98" r="3.5" fill="#2A211D"/><circle cx="${cx + 13}" cy="98" r="3.5" fill="#2A211D"/><path d="M${cx - 10} 120q10 ${stage === "after" ? 9 : 3} 20 0" stroke="#9A3B3B" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const hairs = { short: `<path d="M${cx - 36} 92c0-34 16-50 36-50s36 16 36 50c-8-14-18-20-26-22-12 6-30 6-46 22z" fill="${hr}"/>`, buzz: `<path d="M${cx - 35} 88c0-30 14-44 35-44s35 14 35 44c-8-10-20-16-35-16s-27 6-35 16z" fill="${hr}" opacity=".85"/>`, bun: `<circle cx="${cx}" cy="44" r="16" fill="${hr}"/><path d="M${cx - 36} 92c0-32 16-48 36-48s36 16 36 48c-12-14-26-20-36-20s-24 6-36 20z" fill="${hr}"/>`, long: `<path d="M${cx - 38} 90c2-30 18-48 38-48s38 18 38 48c-22-2-46-12-56-28-6 14-12 22-20 28z" fill="${hr}"/>`, bob: `<path d="M${cx - 38} 92c2-32 18-50 38-50s38 18 38 50c-26 0-50-8-62-22-4 10-8 18-14 22z" fill="${hr}"/>` };
    s += hairs[p.style] || hairs.short;
    if (stage) s += `<rect x="${stage === "before" ? 16 : 304}" y="16" width="${stage === "before" ? 92 : 80}" height="34" rx="17" fill="${stage === "before" ? "#0F172A" : "#F97316"}" opacity=".9"/><text x="${stage === "before" ? 62 : 344}" y="39" font-size="15" font-weight="800" fill="#fff" text-anchor="middle" font-family="Inter, sans-serif" letter-spacing="1">${stage.toUpperCase()}</text>`;
    return `<svg viewBox="0 0 400 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label || "Illustrated member"}">${s}</svg>`;
  }
  function coachFace(i, label) {
    const sk = SKIN[[3, 1, 5, 0][i % 4]], hr = HAIR[[0, 2, 0, 4][i % 4]];
    return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}"><circle cx="60" cy="60" r="60" fill="#FED7AA"/><path d="M14 120c4-30 22-42 46-42s42 12 46 42z" fill="#0F172A"/><rect x="50" y="64" width="20" height="18" rx="6" fill="${sk}"/><ellipse cx="60" cy="52" rx="24" ry="28" fill="${sk}"/><path d="M36 50c0-22 10-32 24-32s24 10 24 32c-6-10-14-14-24-14s-18 4-24 14z" fill="${hr}"/><circle cx="51" cy="52" r="2.6" fill="#2A211D"/><circle cx="69" cy="52" r="2.6" fill="#2A211D"/><path d="M52 66q8 7 16 0" stroke="#9A3B3B" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`;
  }
  window.Art = { figure, coachFace };
})();
