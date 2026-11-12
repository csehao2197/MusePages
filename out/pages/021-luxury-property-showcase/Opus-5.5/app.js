(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = () => window.matchMedia("(max-width: 760px)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };

  /* Art */
  $("[data-hero]").innerHTML = Art.room("living", "dusk", 3, "Penthouse living room with floor-to-ceiling windows and the city skyline at dusk");
  $$("[data-room]").forEach((el) => { if (el.classList.contains("ov-img")) el.innerHTML = Art.room(el.dataset.room, el.dataset.tone, 5, el.dataset.label); });
  $$("[data-agent]").forEach((el) => { el.innerHTML = Art.agent(); });
  $("[data-nbmap]").innerHTML = Art.nbhdMap();

  /* Nav + details bar */
  const nav = $("[data-nav]"), hero = $(".hero");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > hero.offsetHeight - 120);
  window.addEventListener("scroll", syncNav, { passive: true }); syncNav();
  const det = $("[data-details]"), dt = $("[data-details-toggle]");
  dt.addEventListener("click", () => { const o = !det.classList.contains("open"); det.classList.toggle("open", o); dt.setAttribute("aria-expanded", String(o)); });

  /* Fade-in */
  if ("IntersectionObserver" in window && !reduced) {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1 });
    window.__fadeIO = io;
    $$(".fade").forEach((el) => io.observe(el));
  }

  /* Gallery (16 photos) */
  const photos = [["living", "dusk", "Living room at dusk", "w2 h2"], ["living2", "day", "Living room, second angle", ""], ["kitchen", "dusk", "Chef's kitchen", ""], ["suite", "dusk", "Primary suite", "h2"], ["bath", "day", "Primary bath with soaking tub", ""], ["guest", "day", "Guest bedroom", ""], ["office", "day", "Home office", ""], ["cellar", "dusk", "Wine cellar", "h2"], ["terrace", "dusk", "Private terrace with plunge pool", "w2"], ["terrace2", "day", "Terrace dining", ""], ["guest", "dusk", "Guest bedroom, evening", ""], ["lobby", "dusk", "Building lobby", ""], ["pool", "dusk", "Rooftop pool deck", "w2"], ["gym", "day", "Fitness center", ""], ["living2", "night", "Living room at night", ""], ["suite", "day", "Primary suite, morning", ""]];
  const gal = $("[data-gallery]");
  gal.innerHTML = photos.map(([r, t, c, cls], i) => `<button class="gi fade ${cls}" type="button" data-g="${i}" aria-label="Open photo ${i + 1} of ${photos.length}: ${c}">${Art.room(r, t, i + 7, c)}<span>${c}</span></button>`).join("");
  if (window.__fadeIO) $$(".gi", gal).forEach((g) => window.__fadeIO.observe(g));
  $("[data-gcount]").textContent = `${photos.length} photos · tap any image to view full screen`;
  const lb = $("[data-lb]");
  let gi = 0, lastF;
  const show = (i) => { gi = (i + photos.length) % photos.length; const [r, t, c] = photos[gi]; $("[data-lb-img]").innerHTML = Art.room(r, t, gi + 7, c); $("[data-lb-cap]").textContent = c; $("[data-lb-count]").textContent = `${gi + 1} of ${photos.length}`; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastF) lastF.focus(); };
  $$("[data-g]").forEach((b) => b.addEventListener("click", () => { lastF = b; show(+b.dataset.g); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); }));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb-step]").forEach((b) => b.addEventListener("click", () => show(gi + +b.dataset.lbStep)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") show(gi + 1); else if (e.key === "ArrowLeft") show(gi - 1); });
  let sx = null;
  lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 45) show(gi + (dx < 0 ? 1 : -1)); sx = null; }, { passive: true });

  /* Floor plan */
  const roomsData = [["suite", "Primary Suite", "18' × 22'", "396 sq ft"], ["living", "Living Room", "24' × 30'", "720 sq ft"], ["kitchen", "Kitchen", "16' × 20'", "320 sq ft"], ["office", "Home Office", "12' × 14'", "168 sq ft"], ["g1", "Guest Bedroom 1", "14' × 16'", "224 sq ft"], ["g2", "Guest Bedroom 2", "12' × 14'", "168 sq ft"], ["g3", "Guest Bedroom 3", "12' × 12'", "144 sq ft"]];
  $("[data-plan]").innerHTML = Art.floorPlan();
  $("[data-room-list]").innerHTML = roomsData.map(([k, l, d]) => `<li><button type="button" data-rl="${k}" aria-pressed="false"><span>${l}</span><b>${d}</b></button></li>`).join("");
  function selectRoom(k) {
    const r = roomsData.find((x) => x[0] === k);
    $$(".room").forEach((g) => g.classList.toggle("on", g.dataset.room === k));
    $$("[data-rl]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.rl === k)));
    $("[data-plan-info]").innerHTML = `<b>${r[1]}</b> — ${r[2]} · approx. ${r[3]}`;
    const g = $(`.room[data-room="${k}"]`), view = $("[data-plan-view]");
    if (g && view.scrollWidth > view.clientWidth) { const b = g.getBoundingClientRect(), v = view.getBoundingClientRect(); view.scrollBy({ left: b.left - v.left - (v.width - b.width) / 2, top: b.top - v.top - (v.height - b.height) / 2, behavior: "smooth" }); }
  }
  $$(".room").forEach((g) => { g.addEventListener("click", () => selectRoom(g.dataset.room)); g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectRoom(g.dataset.room); } }); });
  $$("[data-rl]").forEach((b) => b.addEventListener("click", () => selectRoom(b.dataset.rl)));
  let pz = 1;
  $$("[data-pz]").forEach((b) => b.addEventListener("click", () => { pz = Math.min(2.5, Math.max(1, pz + +b.dataset.pz * 0.5)); $("[data-plan]").style.transform = `scale(${pz})`; $("[data-plan]").style.width = pz > 1 ? `${100}%` : ""; }));
  $("[data-plan-pdf]").addEventListener("click", () => {
    // Vector PDF: room outlines (1 ft = 6pt) with labels.
    const R = { suite: [40, 40, 220, 180], living: [300, 40, 300, 240], kitchen: [600, 40, 200, 160], office: [800, 40, 140, 120], g1: [40, 260, 160, 140], g2: [600, 240, 140, 120], g3: [800, 200, 140, 120] };
    const s = 0.55, ox = 40, oy = 700;
    let st = "0.4 w 0 0 0 RG\n2 w " + `${ox + 20 * s} ${oy - 420 * s} ${940 * s} ${400 * s} re S\n1 w\n`;
    for (const [k, l, d] of roomsData) { const [x, y, w, h] = R[k]; st += `${(ox + x * s).toFixed(1)} ${(oy - (y + h) * s).toFixed(1)} ${(w * s).toFixed(1)} ${(h * s).toFixed(1)} re S\nBT /F2 8 Tf 1 0 0 1 ${(ox + x * s + 6).toFixed(1)} ${(oy - y * s - 14).toFixed(1)} Tm (${l}) Tj ET\nBT /F1 7 Tf 1 0 0 1 ${(ox + x * s + 6).toFixed(1)} ${(oy - y * s - 24).toFixed(1)} Tm (${d.replace(/×/g, "x").replace(/'/g, " ft")}) Tj ET\n`; }
    st += `BT /F2 18 Tf 1 0 0 1 40 760 Tm (THE MERIDIAN PENTHOUSE - FLOOR PLAN) Tj ET\nBT /F1 10 Tf 1 0 0 1 40 742 Tm (42nd Floor - 3,800 sq ft living + 600 sq ft terrace - MLS 2026-MER-4201) Tj ET\nBT /F1 8 Tf 1 0 0 1 40 440 Tm (Dimensions approximate. Sterling Luxury Group.) Tj ET`;
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>", `<< /Length ${st.length} >>\nstream\n${st}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>"];
    let pdf = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = pdf.length; pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "meridian-penthouse-floor-plan.pdf" }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast("Floor plan PDF downloaded");
  });

  /* Features (accordion on mobile) */
  const feats = [["chef", "Kitchen", ["Sub-Zero refrigerator", "Wolf range", "Miele dishwasher", "Waterfall quartzite island"]], ["bath", "Bathrooms", ["Heated floors", "Rain shower", "Freestanding soaking tub", "Toto fixtures"]], ["sofa", "Living", ["Wide-plank European oak floors", "11-ft ceilings", "Gas fireplace", "Automated shades"]], ["cpu", "Technology", ["Savant smart home system", "Integrated Sonos", "Keyless entry", "EV charging"]], ["sun", "Outdoor", ["600 sq ft private terrace", "Built-in BBQ", "Plunge pool", "Panoramic views"]], ["shield", "Security", ["24/7 concierge", "Private elevator access", "Biometric entry", "Video intercom"]]];
  $("[data-features]").innerHTML = feats.map(([ic, t, items], i) => `<div class="feat"><button type="button" aria-expanded="true" aria-controls="ft-${i}" data-ft>${icon(ic)}<h3>${t}</h3><svg class="i chev"><use href="#i-down"/></svg></button><ul id="ft-${i}">${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("");
  const syncFeat = () => $$("[data-ft]").forEach((b, i) => { const open = !mobile() || i === 0; b.setAttribute("aria-expanded", String(open)); $(`#${b.getAttribute("aria-controls")}`).hidden = !open; b.disabled = false; });
  $$("[data-ft]").forEach((b) => b.addEventListener("click", () => { if (!mobile()) return; const o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(o)); $(`#${b.getAttribute("aria-controls")}`).hidden = !o; }));
  let wasM = mobile(); syncFeat();
  window.addEventListener("resize", () => { if (mobile() !== wasM) { wasM = mobile(); syncFeat(); } });

  /* Amenities */
  const am = [["pool", "Infinity Pool & Spa", "A rooftop infinity edge with cabanas and a eucalyptus steam room."], ["gym", "State-of-the-Art Fitness Center", "Technogym equipment, Pilates studio and private training suites."], ["cellar", "Private Wine Storage", "Climate-controlled lockers for up to 300 bottles per residence."], ["lounge", "Residents' Lounge & Bar", "A members-style lounge with a staffed bar and harbor views."], ["screen", "Screening Room", "Twelve reclining seats and 4K laser projection for private premieres."], ["play", "Children's Playroom", "A bright, supervised-friendly space with soft play and crafts."], ["pets", "Pet Spa & Dog Run", "Grooming station and a turfed rooftop run for four-legged residents."], ["valet", "Valet Parking", "Around-the-clock valet with two deeded spaces and EV charging."]];
  $("[data-amenities]").innerHTML = am.map(([r, t, d], i) => `<article class="am"><div class="am-img">${Art.room(r, "dusk", i + 40, t)}</div><h3>${t}</h3><p>${d}</p></article>`).join("");
  $$("[data-am]").forEach((b) => b.addEventListener("click", () => { const s = $("[data-amenities]"); s.scrollBy({ left: +b.dataset.am * s.clientWidth * 0.75, behavior: "smooth" }); }));

  /* Gauges */
  const gauges = [["Walk Score", 96], ["Transit Score", 92], ["Bike Score", 88]];
  const C = 2 * Math.PI * 40;
  $("[data-gauges]").innerHTML = gauges.map(([l, v]) => `<div class="gauge"><svg viewBox="0 0 100 100" role="img" aria-label="${l}: ${v} out of 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#E5E2DB" stroke-width="7"/><circle cx="50" cy="50" r="40" fill="none" stroke="#92764A" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}" transform="rotate(-90 50 50)" data-arc="${v}" style="transition:stroke-dashoffset 1.4s ease"/><text x="50" y="58" text-anchor="middle" class="num">${v}</text></svg><p>${l}</p></div>`).join("");
  const fill = () => $$("[data-arc]").forEach((a) => { a.style.strokeDashoffset = C * (1 - +a.dataset.arc / 100); });
  if ("IntersectionObserver" in window && !reduced) { const io2 = new IntersectionObserver((en) => { if (en.some((e) => e.isIntersecting)) { fill(); io2.disconnect(); } }, { threshold: 0.4 }); io2.observe($("[data-gauges]")); } else fill();

  /* Virtual tour: drag-to-pan panorama with room hotspots */
  const tour = $("[data-tour]"), pano = $("[data-pano]");
  pano.innerHTML = Art.panorama();
  const stops = [["Living Room", 0], ["Kitchen", 1 / 3], ["Terrace", 2 / 3]];
  let pos = 0, drag = null;
  const maxPos = () => pano.offsetWidth - tour.clientWidth;
  function setPos(p, smooth) {
    pos = Math.max(0, Math.min(maxPos(), p));
    pano.style.transition = smooth && !reduced ? "transform .8s ease" : "none";
    pano.style.transform = `translate3d(${-pos}px,0,0)`;
    const f = pos / pano.offsetWidth, idx = f < 0.25 ? 0 : f < 0.55 ? 1 : 2;
    $("[data-tour-room]").textContent = stops[idx][0];
    $$("[data-hotspots] button").forEach((b, i) => b.setAttribute("aria-current", String(i === idx)));
  }
  $("[data-hotspots]").innerHTML = stops.map(([n], i) => `<button type="button" data-stop="${i}">${n}</button>`).join("");
  $$("[data-stop]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); tour.classList.add("moved"); setPos(stops[+b.dataset.stop][1] * pano.offsetWidth, true); }));
  tour.addEventListener("pointerdown", (e) => { if (e.target.closest("button") || !$("[data-video]").hidden) return; drag = { x: e.clientX, p: pos }; tour.classList.add("dragging"); tour.setPointerCapture(e.pointerId); });
  tour.addEventListener("pointermove", (e) => { if (!drag) return; tour.classList.add("moved"); setPos(drag.p - (e.clientX - drag.x) * 1.4); });
  ["pointerup", "pointercancel"].forEach((ev) => tour.addEventListener(ev, () => { drag = null; tour.classList.remove("dragging"); }));
  tour.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); tour.classList.add("moved"); setPos(pos + (e.key === "ArrowRight" ? 1 : -1) * tour.clientWidth * 0.25, true); } });
  window.addEventListener("resize", () => setPos(pos));
  requestAnimationFrame(() => setPos(0));
  $("[data-tour-full]").addEventListener("click", async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else if (tour.requestFullscreen) await tour.requestFullscreen(); else throw 0; }
    catch { tour.classList.toggle("full"); document.body.style.overflow = tour.classList.contains("full") ? "hidden" : ""; }
    setTimeout(() => setPos(pos), 120);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && tour.classList.contains("full")) { tour.classList.remove("full"); document.body.style.overflow = ""; setPos(pos); } });
  window.MuseTour = { room: () => $("[data-tour-room]").textContent };

  // Video walkthrough fallback (simulated playback over the same scenes)
  const vid = $("[data-video]"), vframe = $("[data-video-frame]"), vplay = $("[data-vplay]");
  let vt = 0, vtimer = null;
  const vScenes = [["living", "dusk"], ["kitchen", "dusk"], ["suite", "dusk"], ["bath", "day"], ["terrace", "dusk"]];
  const vRender = () => { const i = Math.min(vScenes.length - 1, Math.floor(vt / 30)); if (vframe.dataset.i !== String(i)) { vframe.dataset.i = i; vframe.innerHTML = Art.room(vScenes[i][0], vScenes[i][1], 90 + i, "Video walkthrough frame"); } const svgEl = $("svg", vframe); if (svgEl && !reduced) svgEl.style.transform = `scale(${1 + (vt % 30) / 300})`; $("[data-vbar]").style.width = `${(vt / 150) * 100}%`; $("[data-vtime]").textContent = `${Math.floor(vt / 60)}:${String(Math.floor(vt % 60)).padStart(2, "0")} / 2:30`; };
  const vStop = () => { clearInterval(vtimer); vtimer = null; vplay.innerHTML = icon("play"); vplay.setAttribute("aria-label", "Play walkthrough"); };
  vplay.addEventListener("click", () => { if (vtimer) { vStop(); return; } vplay.innerHTML = `<svg class="i" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>`; vplay.setAttribute("aria-label", "Pause walkthrough"); vtimer = setInterval(() => { vt += 1; if (vt >= 150) { vt = 150; vStop(); } vRender(); }, 250); });
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => { $$("[data-mode]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); const v = b.dataset.mode === "video"; vid.hidden = !v; if (!v) vStop(); else vRender(); }));

  /* Mortgage */
  const calc = $("[data-calc]");
  const num = (s) => +String(s).replace(/[^0-9.]/g, "") || 0;
  function compute() {
    const price = num(calc.price.value), pct = +calc.downPct.value, rate = +calc.rate.value / 1200, n = +calc.term.value * 12;
    const down = price * pct / 100, loan = price - down;
    const pay = rate ? (loan * rate) / (1 - (1 + rate) ** -n) : loan / n;
    $("[data-down-pct]").textContent = `${pct}%`; $("[data-down-amt]").textContent = money(down);
    $("[data-pay]").textContent = `${money(pay)}/mo`; $("[data-loan]").textContent = `Loan amount ${money(loan)}`;
    return pay;
  }
  calc.addEventListener("input", compute);
  calc.price.addEventListener("blur", () => { calc.price.value = money(num(calc.price.value)); compute(); });
  calc.addEventListener("submit", (e) => e.preventDefault());
  compute();
  $("[data-preapproved]").addEventListener("click", () => toast("Tell us when you'd like to view — we'll connect you with our preferred private lender"));

  /* Viewing form */
  const vf = $("[data-view-form]");
  const t = new Date(); t.setDate(t.getDate() + 1); vf.date.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  vf.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input, select, textarea", vf).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    $("[data-view-err]").textContent = first ? "Please complete the highlighted fields." : "";
    if (first) { first.focus(); return; }
    $("[data-view-text]").textContent = `Thank you, ${vf.name.value.split(" ")[0]}. Alexandra Sterling will confirm your private viewing on ${new Date(`${vf.date.value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${vf.time.value} by phone or email. (Demo — nothing was sent.)`;
    vf.hidden = true; $("[data-view-done]").hidden = false; $("[data-view-done]").focus();
  });

  /* Similar */
  const sim = [["$3,800,000", "3 bed / 3 bath — 3,200 sq ft", "The Apex, Unit 38A", "living2"], ["$4,500,000", "4 bed / 4 bath — 4,100 sq ft", "Harborview Tower, PH2", "terrace"], ["$3,950,000", "3 bed / 3.5 bath — 3,500 sq ft", "One Park Place, Unit 52B", "suite"]];
  $("[data-similar]").innerHTML = sim.map(([p, s, a, r], i) => `<article class="sim"><div class="sim-img">${Art.room(r, i === 1 ? "dusk" : "day", 60 + i, a)}</div><div class="sim-body"><b>${p}</b><p>${s}</p><h3>${a}</h3></div></article>`).join("");
  $("[data-all-listings]").addEventListener("click", (e) => { e.preventDefault(); toast("Our full luxury portfolio is shared privately — contact Alexandra for access"); });

  /* Floating CTA */
  const float = $("[data-float]");
  if ("IntersectionObserver" in window) { const vis = new Set(); const io3 = new IntersectionObserver((en) => { en.forEach((x) => (x.isIntersecting ? vis.add(x.target) : vis.delete(x.target))); float.classList.toggle("away", vis.size > 0); }, { threshold: 0.15 }); [hero, $("#viewing")].forEach((el) => io3.observe(el)); }
})();
