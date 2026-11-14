(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const mobile = matchMedia("(max-width: 760px)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3400); };

  // ---------- Art ----------
  $$("[data-art]").forEach((el) => { const k = el.dataset.art; if (Art[k]) el.innerHTML = Art[k](); });
  $$("[data-art-int]").forEach((el) => { el.innerHTML = Art.interior(el.dataset.artInt, el.dataset.artInt === "great" ? "Furnished living room in The Crestview model home" : "Furnished kitchen in The Ashford model home"); });
  $$(".stars").forEach((s) => { s.innerHTML = ic("star").repeat(5); });

  // ---------- Dialogs ----------
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- Nav / menu ----------
  const menu = $("[data-menu]"), menuBtn = $("[data-menu-btn]");
  menuBtn.addEventListener("click", () => {
    const open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = ic(open ? "x" : "menu"); menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.innerHTML = ic("menu"); menuBtn.setAttribute("aria-label", "Open menu"); } });
  mobile.addEventListener("change", () => { if (!mobile.matches) { menu.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); } });

  // ---------- Counters ----------
  function animateCounters() {
    $$("[data-count]").forEach((el) => {
      const to = +el.dataset.count, fmt = el.dataset.fmt, from = to > 100 ? to * 0.6 : 1, t0 = performance.now(), dur = 1200;
      const show = (v) => { el.textContent = fmt === "usd" ? usd(v) : fmt === "n" ? Math.round(v).toLocaleString("en-US") : String(Math.round(v)); };
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); show(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
      if (reduce) show(to); else requestAnimationFrame(step);
    });
  }
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { animateCounters(); co.disconnect(); } }, { threshold: 0.4 });
    co.observe($("[data-counters]"));
  }

  // ---------- Floor plans ----------
  const PLANS = [
    { id: "oakmont", name: "The Oakmont", beds: 3, baths: "2.5", sq: 1842, st: 1, price: 425000, style: "craftsman", badges: [], minAc: 0.28,
      levels: [["Main Level", [["2-Car Garage", 0, 0, 20, 22], ["Kitchen", 20, 0, 16, 14], ["Dining", 36, 0, 10, 14], ["Primary Suite", 46, 0, 14, 18], ["Laundry", 0, 22, 10, 8], ["Bath 2", 10, 22, 10, 8], ["Bedroom 2", 0, 30, 10, 10], ["Bedroom 3", 10, 30, 10, 10], ["Great Room", 20, 14, 26, 26], ["Primary Bath", 46, 18, 14, 12], ["Covered Porch", 46, 30, 14, 10]]]],
      incl: ["Open great room with 10' ceilings", "Kitchen island with seating for four", "Primary suite with walk-in closet", "Covered rear porch", "Split-bedroom layout"],
      custom: ["Sunroom extension (+180 sq ft)", "Owner's bath with curbless shower", "Flex room in place of Bedroom 3", "Extended 3-car garage"] },
    { id: "ashford", name: "The Ashford", beds: 4, baths: "3", sq: 2456, st: 2, price: 498000, style: "farmhouse", badges: [["hot", "Most Popular"]], minAc: 0.25,
      levels: [["First Floor", [["2-Car Garage", 0, 0, 20, 22], ["Foyer", 20, 0, 8, 12], ["Study", 28, 0, 12, 12], ["Dining", 40, 0, 20, 12], ["Mudroom", 0, 22, 10, 8], ["Bath 3", 10, 22, 10, 8], ["Guest Suite", 0, 30, 20, 10], ["Great Room", 20, 12, 20, 28], ["Kitchen", 40, 12, 20, 16], ["Café", 40, 28, 20, 12]]],
        ["Second Floor", [["Primary Suite", 0, 0, 22, 18], ["Loft", 22, 0, 18, 20], ["Bedroom 2", 40, 0, 20, 14], ["Primary Bath", 0, 18, 12, 12], ["Walk-in Closet", 12, 18, 10, 12], ["Bath 2", 40, 14, 10, 10], ["Laundry", 50, 14, 10, 10], ["Hall / Linen", 0, 30, 22, 10], ["Bedroom 4", 22, 20, 18, 20], ["Bedroom 3", 40, 24, 20, 16]]]],
      incl: ["First-floor guest suite with full bath", "Upstairs loft", "Walk-in pantry and café", "Drop zone mudroom", "Upstairs laundry"],
      custom: ["Covered porch with fireplace", "Loft converted to 5th bedroom", "Study with French doors", "Gourmet kitchen layout"] },
    { id: "belmont", name: "The Belmont", beds: 4, baths: "3.5", sq: 2890, st: 2, price: 565000, style: "transitional", badges: [], minAc: 0.28,
      levels: [["First Floor", [["2-Car Garage", 0, 0, 22, 22], ["Flex Room", 22, 0, 14, 14], ["Dining", 36, 0, 24, 14], ["Mudroom", 0, 22, 11, 8], ["Powder", 11, 22, 11, 8], ["Butler's Pantry", 0, 30, 22, 10], ["Great Room", 22, 14, 20, 26], ["Kitchen", 42, 14, 18, 16], ["Breakfast Nook", 42, 30, 18, 10]]],
        ["Second Floor", [["Primary Suite", 0, 0, 24, 18], ["Bonus Room", 24, 0, 16, 22], ["Bedroom 2", 40, 0, 20, 14], ["Primary Bath", 0, 18, 14, 12], ["Walk-in Closet", 14, 18, 10, 12], ["Jack & Jill Bath", 40, 14, 20, 8], ["Laundry", 0, 30, 12, 10], ["Bath 3", 12, 30, 12, 10], ["Bedroom 4", 24, 22, 16, 18], ["Bedroom 3", 40, 22, 20, 18]]]],
      incl: ["Butler's pantry between kitchen and dining", "Upstairs bonus room", "Primary suite with sitting area", "Flex room for office or playroom", "Jack & Jill bath"],
      custom: ["Bonus room as media room", "Screened porch", "Prep kitchen", "Primary bath spa package"] },
    { id: "crestview", name: "The Crestview", beds: 5, baths: "4", sq: 3218, st: 2, price: 639000, style: "estate", badges: [["model", "Model Home Open"]], minAc: 0.33,
      levels: [["First Floor", [["3-Car Garage", 0, 0, 24, 22], ["Study", 24, 0, 14, 14], ["Formal Dining", 38, 0, 22, 14], ["Mudroom", 0, 22, 12, 8], ["Bath 4", 12, 22, 12, 8], ["Guest Suite", 0, 30, 24, 10], ["Great Room", 24, 14, 18, 26], ["Gourmet Kitchen", 42, 14, 18, 16], ["Morning Room", 42, 30, 18, 10]]],
        ["Second Floor", [["Primary Suite", 0, 0, 24, 18], ["Game Room", 24, 0, 16, 22], ["Bedroom 2", 40, 0, 20, 13], ["Spa Bath", 0, 18, 14, 12], ["Walk-in Closet", 14, 18, 10, 12], ["Bath 2", 40, 13, 20, 9], ["Laundry", 0, 30, 24, 10], ["Bedroom 4", 24, 22, 16, 18], ["Bedroom 3", 40, 22, 20, 18]]]],
      incl: ["3-car garage", "Gourmet kitchen with morning room", "Upstairs game room", "Spa bath with freestanding tub", "Main-level guest suite"],
      custom: ["Outdoor kitchen package", "Game room wet bar", "Elevator-ready stack closets", "Golf-cart garage bay"] },
  ];
  const planById = Object.fromEntries(PLANS.map((p) => [p.id, p]));
  const F = { beds: "any", stories: "any", sqmin: 1800, sqmax: 3250, price: "any" };
  const plansEl = $("[data-plans]");
  plansEl.innerHTML = PLANS.map((p) => `<article class="plan" data-plan="${p.id}">
      <div class="plan-img">${Art.exterior(p.style)}${p.badges.length ? `<div class="badges">${p.badges.map(([c, t]) => `<span class="bdg ${c}">${t}</span>`).join("")}</div>` : ""}</div>
      <div class="plan-body"><h3>${p.name}</h3>
        <p class="specs"><span>${ic("bed")}${p.beds} bed</span><span>${ic("bath")}${p.baths} bath</span><span>${ic("ruler")}${p.sq.toLocaleString("en-US")} sq ft</span><span>${ic("layers")}${p.st}-story</span></p>
        <p class="price">From <b>${usd(p.price)}</b></p>
        <div class="btns"><button class="btn btn-ghost" type="button" data-view-plan="${p.id}">View Floor Plan</button><button class="btn btn-blue" type="button" data-avail="${p.id}">Check Availability</button></div></div></article>`).join("");

  function applyPlanFilter() {
    const [plo, phi] = F.price === "any" ? [0, Infinity] : F.price.split("-").map(Number);
    let n = 0;
    PLANS.forEach((p) => {
      const ok = (F.beds === "any" || p.beds === +F.beds) && (F.stories === "any" || p.st === +F.stories) && p.sq >= F.sqmin && p.sq <= F.sqmax && p.price >= plo && p.price < phi;
      $(`[data-plan="${p.id}"]`).hidden = !ok; if (ok) n++;
    });
    $("[data-plan-count]").textContent = `Showing ${n} of ${PLANS.length} floor plans`;
    $("[data-plans-empty]").hidden = n > 0;
  }
  $$("[data-chips]").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", g).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    F[g.dataset.chips] = b.dataset.v; applyPlanFilter();
  }));
  const sqmin = $("[data-sqmin]"), sqmax = $("[data-sqmax]");
  function sqUpdate(e) {
    if (+sqmin.value > +sqmax.value - 100) { if (e && e.target === sqmin) sqmin.value = +sqmax.value - 100; else sqmax.value = +sqmin.value + 100; }
    F.sqmin = +sqmin.value; F.sqmax = +sqmax.value;
    const lo = (F.sqmin - 1800) / 1450 * 100, hi = (F.sqmax - 1800) / 1450 * 100;
    $("[data-sq-fill]").style.left = `${lo}%`; $("[data-sq-fill]").style.right = `${100 - hi}%`;
    $("[data-sq-out]").textContent = `${F.sqmin.toLocaleString("en-US")} – ${F.sqmax.toLocaleString("en-US")}`;
    applyPlanFilter();
  }
  sqmin.addEventListener("input", sqUpdate); sqmax.addEventListener("input", sqUpdate);
  $("[data-price]").addEventListener("change", (e) => { F.price = e.target.value; applyPlanFilter(); });
  $("[data-reset]").addEventListener("click", () => {
    Object.assign(F, { beds: "any", stories: "any", sqmin: 1800, sqmax: 3250, price: "any" });
    $$("[data-chips] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === "any")));
    sqmin.value = 1800; sqmax.value = 3250; $("[data-price]").value = "any"; sqUpdate();
  });
  $("[data-filters]").addEventListener("submit", (e) => e.preventDefault());
  const fToggle = $("[data-filter-toggle]"), filters = $("[data-filters]");
  fToggle.addEventListener("click", () => { const open = filters.classList.toggle("closed") === false; fToggle.setAttribute("aria-expanded", String(open)); });
  const syncFilters = () => { filters.classList.toggle("closed", mobile.matches); fToggle.setAttribute("aria-expanded", String(!mobile.matches)); };
  mobile.addEventListener("change", syncFilters); syncFilters();
  sqUpdate();

  // ---------- Plan modal ----------
  const pm = $("[data-modal=plan]"); let pmPlan = null;
  function drawLevel(p, li) {
    const [, rooms] = p.levels[li];
    $$("[data-levels] button").forEach((b, i) => b.setAttribute("aria-selected", String(i === li)));
    $("[data-plan-svg]").innerHTML = `<svg viewBox="-1 -1 62 42" role="img" aria-label="${p.name} ${p.levels[li][0]} floor plan line drawing">${rooms.map(([n, x, y, w, h], i) => `<g data-room="${i}"><rect class="rm" x="${x}" y="${y}" width="${w}" height="${h}"/><text x="${x + w / 2}" y="${y + h / 2 - 0.3}" text-anchor="middle">${n.replace("&", "&amp;")}</text><text class="d" x="${x + w / 2}" y="${y + h / 2 + 1.8}" text-anchor="middle">${w}' × ${h}'</text></g>`).join("")}<rect x="0" y="0" width="60" height="40" fill="none" stroke="#1E293B" stroke-width="1"/></svg>`;
    $("[data-dims]").innerHTML = rooms.map(([n, , , w, h], i) => `<li data-dim="${i}"><b>${n}</b><span>${w}' × ${h}'</span></li>`).join("");
  }
  function openPlan(id) {
    const p = pmPlan = planById[id];
    $("[data-pm-name]").textContent = p.name;
    $("[data-pm-specs]").textContent = `${p.beds} bed · ${p.baths} bath · ${p.sq.toLocaleString("en-US")} sq ft · ${p.st}-story · From ${usd(p.price)}`;
    $("[data-levels]").innerHTML = p.levels.map(([n], i) => `<button type="button" role="tab" data-lv="${i}">${n}</button>`).join("");
    $("[data-incl]").innerHTML = p.incl.map((t) => `<li>${ic("check")}${t}</li>`).join("");
    $("[data-custom]").innerHTML = p.custom.map((t) => `<li>${ic("layers")}${t}</li>`).join("");
    drawLevel(p, 0);
    pm.showModal();
  }
  $("[data-levels]").addEventListener("click", (e) => { const b = e.target.closest("[data-lv]"); if (b) drawLevel(pmPlan, +b.dataset.lv); });
  const roomHl = (i) => { $$("[data-room]", pm).forEach((g) => g.classList.toggle("on", g.dataset.room === i)); $$("[data-dim]", pm).forEach((l) => l.classList.toggle("on", l.dataset.dim === i)); };
  $("[data-plan-svg]").addEventListener("mouseover", (e) => { const g = e.target.closest("[data-room]"); roomHl(g ? g.dataset.room : null); });
  $("[data-dims]").addEventListener("mouseover", (e) => { const l = e.target.closest("[data-dim]"); roomHl(l ? l.dataset.dim : null); });
  $("[data-req-price]").addEventListener("click", () => { pm.close(); toContact({ plan: pmPlan.name, intent: "Get Pricing Info", msg: `Please send current pricing for ${pmPlan.name}.` }); });
  plansEl.addEventListener("click", (e) => {
    const v = e.target.closest("[data-view-plan]"); if (v) return openPlan(v.dataset.viewPlan);
    const a = e.target.closest("[data-avail]"); if (a) { focusPlanLots(a.dataset.avail); $("#availability").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  });

  // ---------- Site plan ----------
  const BANDS = [60, 152, 300, 392, 540];
  const ORIENT = ["North-facing backyard", "South-facing backyard", "North-facing backyard", "South-facing backyard", "North-facing backyard"];
  const PHASES = [
    { n: 1, x: 70, w: 320, bands: [0, 1, 2, 3, 4], counts: [7, 7, 7, 7, 6], label: "Phase 1 · Sold out" },
    { n: 2, x: 440, w: 360, bands: [1, 0, 3, 2, 4], counts: [6, 6, 6, 6, 6], label: "Phase 2 · Selling now" },
    { n: 3, x: 850, w: 300, bands: [0, 1, 2, 3], counts: [6, 6, 5, 5], label: "Phase 3 · Coming Q4 2026" },
  ];
  const MODELS = { 22: "The Crestview", 23: "The Ashford", 24: "The Belmont · Sales Center" };
  const AVAIL = [36, 38, 39, 41, 43, 44, 47, 50, 52, 53, 57, 59, 61, 63];
  const SOLD2 = [35, 40, 46, 51, 58, 64], SOLD3 = [65, 66, 70, 73, 77, 80, 83, 85, 86];
  const LOTS = [];
  let num = 1;
  PHASES.forEach((ph) => ph.bands.forEach((b, bi) => {
    const n = ph.counts[bi], w = ph.w / n;
    for (let i = 0; i < n; i++, num++) {
      let s = "uc";
      if (ph.n === 1) s = MODELS[num] ? "md" : "sd";
      else if (AVAIL.includes(num)) s = "av";
      else if (SOLD2.includes(num) || SOLD3.includes(num)) s = "sd";
      const ac = num === 47 ? 0.31 : 0.25 + ((num * 37) % 16) / 100;
      const prem = [];
      if (b === 0) prem.push("Backs to wooded buffer"); else prem.push("Backs to green space");
      if (i === 0 || i === n - 1) prem.push("Corner lot");
      if (ac >= 0.36) prem.push("Oversized homesite");
      LOTS.push({ n: num, s, ac: Math.round(ac * 100) / 100, phase: ph.n, orient: ORIENT[b], prem, x: ph.x + i * w, y: BANDS[b], w, h: 60, model: MODELS[num] });
    }
  }));
  const compat = (lot) => PLANS.filter((p) => lot.ac >= p.minAc);
  const STATUS = { av: "Available", uc: "Under contract", sd: "Sold", md: "Model home" };
  const COLORS = { av: "#22C55E", uc: "#F59E0B", sd: "#94A3B8", md: "#1D4ED8" };
  const counts = LOTS.reduce((c, l) => ((c[l.s] = (c[l.s] || 0) + 1), c), {});
  $("[data-lot-summary]").innerHTML = `<span>${counts.av} Available</span> · <span>${counts.uc} Under Contract</span> · <span>${counts.sd} Sold</span> · <span>${counts.md} Model Homes</span>`;
  $("[data-remaining]").textContent = counts.av;

  function siteSvg() {
    let o = `<rect width="1200" height="700" fill="#E9F0DF"/>`;
    // green strips, preserved space and amenities
    o += `<rect x="40" y="216" width="1130" height="80" fill="#CFE3BC"/><rect x="40" y="456" width="1130" height="80" fill="#CFE3BC"/><rect x="850" y="540" width="300" height="90" rx="10" fill="#B9D7A0"/><rect x="0" y="640" width="1200" height="60" fill="#B9D7A0"/>`;
    o += `<path d="M50 256 C 200 230 300 286 450 252 S 700 230 820 260 S 1050 280 1160 250" stroke="#D9C9A3" stroke-width="5" fill="none" stroke-dasharray="2 0"/><path d="M50 496 C 220 470 300 520 460 490 S 760 470 900 500 S 1080 516 1160 492" stroke="#D9C9A3" stroke-width="5" fill="none"/>`;
    for (let i = 0; i < 40; i++) o += `<circle cx="${20 + i * 30}" cy="${668 + (i % 2) * 10}" r="${12 + (i % 3) * 3}" fill="#7FA35B"/>`;
    for (let i = 0; i < 9; i++) o += `<circle cx="${880 + (i % 5) * 60}" cy="${560 + Math.floor(i / 5) * 40}" r="14" fill="#7FA35B"/>`;
    o += `<text x="1000" y="618" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#3F6B3A">12-acre preserved green space</text>`;
    o += `<rect x="120" y="228" width="120" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/><text x="180" y="261" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#1E293B">Clubhouse</text><rect x="260" y="232" width="110" height="48" rx="14" fill="#7DD3FC" stroke="#38BDF8" stroke-width="2"/><text x="315" y="261" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0C4A6E">Pool</text>`;
    o += `<circle cx="560" cy="496" r="24" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/><text x="560" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#92400E">Play</text><circle cx="700" cy="256" r="24" fill="#FDE68A" stroke="#F59E0B" stroke-width="2"/><text x="700" y="260" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#92400E">Play</text><rect x="960" y="232" width="90" height="48" rx="6" fill="#FEF3C7" stroke="#D97706"/><text x="1005" y="261" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#92400E">Volleyball</text>`;
    // streets
    const st = (d, w = 24) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
    o += st("M40 136 H1170") + st("M0 376 H1170") + st("M40 616 H820") + st("M50 136 V616") + st("M415 136 V616") + st("M825 136 V616") + st("M1170 136 V376");
    o += `<text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" font-weight="600" fill="#94A3B8" letter-spacing="2">RIDGELINE DRIVE</text>`;
    o += `<g transform="translate(14 376)"><circle r="14" fill="#1D4ED8"/><path d="M-6 0 h12 M2 -5 l5 5 -5 5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g><text x="10" y="406" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">Entrance</text>`;
    // phase labels
    PHASES.forEach((ph) => { o += `<text x="${ph.x + ph.w / 2}" y="44" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#1E293B">${ph.label}</text>`; });
    o += `<rect x="845" y="54" width="310" height="${452 - 54 + 6}" rx="8" fill="none" stroke="#64748B" stroke-dasharray="6 5"/>`;
    // lots
    o += LOTS.map((l) => {
      const label = `Lot ${l.n}, ${STATUS[l.s]}${l.s === "av" ? `, ${l.ac} acres` : ""}${l.model ? `, ${l.model}` : ""}`;
      const act = l.s === "av" ? ` tabindex="0" role="button" aria-haspopup="dialog"` : ` tabindex="0" role="img"`;
      return `<g class="lot" data-lot="${l.n}" data-s="${l.s}"${act} aria-label="${label}"><rect x="${l.x + 1}" y="${l.y}" width="${l.w - 2}" height="${l.h}" rx="3" fill="${COLORS[l.s]}"/>${l.s === "md" ? `<path d="M${l.x + l.w / 2} ${l.y + 14} l12 10 h-4 v12 h-16 v-12 h-4z" fill="#fff"/><text x="${l.x + l.w / 2}" y="${l.y + 52}" text-anchor="middle">${l.n}</text>` : `<text x="${l.x + l.w / 2}" y="${l.y + 34}" text-anchor="middle">${l.n}</text>`}</g>`;
    }).join("");
    return `<svg viewBox="0 0 1200 700" role="group" aria-label="Interactive site plan of all ${LOTS.length} homesites">${o}</svg>`;
  }
  const site = $("[data-site]"), wrap = $("[data-site-wrap]"), ltip = $("[data-ltip]"), pop = $("[data-pop]");
  site.innerHTML = siteSvg();
  const lotBy = Object.fromEntries(LOTS.map((l) => [l.n, l]));
  const relRect = (el) => { const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect(); return { x: r.left - w.left + wrap.scrollLeft, y: r.top - w.top, w: r.width, h: r.height }; };
  function showTip(g) {
    const l = lotBy[g.dataset.lot], r = relRect(g);
    ltip.textContent = `Lot ${l.n} · ${l.model ? `Model Home — ${l.model}` : STATUS[l.s]}${l.s === "av" ? ` · ${l.ac} ac — click for details` : ""}`;
    ltip.style.left = `${r.x + r.w / 2}px`; ltip.style.top = `${r.y}px`; ltip.hidden = false;
  }
  function openPop(g) {
    const l = lotBy[g.dataset.lot]; ltip.hidden = true;
    $$(".lot.on", site).forEach((x) => x.classList.remove("on")); g.classList.add("on");
    const plans = compat(l);
    pop.innerHTML = `<button class="x" type="button" data-pop-close aria-label="Close">${ic("x")}</button><h3 id="pop-h"><i></i>Lot ${l.n} · ${l.ac} acres</h3>
      <dl><dt>Orientation</dt><dd>${l.orient}</dd><dt>Phase</dt><dd>Phase ${l.phase} · Available now</dd><dt>Compatible floor plans</dt><dd data-compat>${plans.map((p) => p.name).join(", ")}</dd><dt>Premium features</dt><dd class="prem">${l.prem.map((t) => `<span>${t}</span>`).join("")}</dd></dl>
      <button class="btn btn-blue wide" type="button" data-lot-req="${l.n}">Request Info on This Lot</button>`;
    pop.hidden = false;
    const r = relRect(g), pw = pop.offsetWidth, ph = pop.offsetHeight, W = wrap.scrollWidth, H = wrap.clientHeight;
    let left = Math.max(8, Math.min(r.x + r.w / 2 - pw / 2, W - pw - 8));
    let top = r.y - ph - 10; if (top < 8) top = Math.min(r.y + r.h + 10, H - ph - 8);
    pop.style.left = `${left}px`; pop.style.top = `${Math.max(8, top)}px`;
    $("[data-lot-req]", pop).focus();
  }
  const closePop = () => { if (pop.hidden) return; pop.hidden = true; const on = $(".lot.on", site); if (on) { on.classList.remove("on"); on.focus({ preventScroll: true }); } };
  site.addEventListener("mouseover", (e) => { const g = e.target.closest(".lot"); if (g) showTip(g); });
  site.addEventListener("mouseleave", () => { ltip.hidden = true; });
  site.addEventListener("focusin", (e) => { const g = e.target.closest(".lot"); if (g) showTip(g); });
  site.addEventListener("focusout", () => { ltip.hidden = true; });
  site.addEventListener("click", (e) => { const g = e.target.closest(".lot"); if (!g) return; if (g.dataset.s === "av") openPop(g); else showTip(g); });
  site.addEventListener("keydown", (e) => { const g = e.target.closest('.lot[data-s="av"]'); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPop(g); } });
  pop.addEventListener("click", (e) => {
    if (e.target.closest("[data-pop-close]")) return closePop();
    const b = e.target.closest("[data-lot-req]"); if (b) { const l = lotBy[b.dataset.lotReq]; pop.hidden = true; lotRequest(l); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePop(); });
  document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest("[data-pop]") && !e.target.closest(".lot")) closePop(); });
  function lotRequest(l) { toContact({ plan: compat(l).length === 1 ? compat(l)[0].name : null, intent: "Get Pricing Info", msg: `Please send me information on Lot ${l.n} (${l.ac} acres, ${l.orient.toLowerCase()}).` }); }

  // list view (mobile) — available first
  const ORDER = { av: 0, md: 1, uc: 2, sd: 3 };
  let showAllLots = false, planFocus = null;
  function renderLotList() {
    const sorted = [...LOTS].sort((a, b) => ORDER[a.s] - ORDER[b.s] || a.n - b.n);
    const vis = showAllLots ? sorted : planFocus ? sorted.filter((l) => l.s === "av" && l.ac >= planById[planFocus].minAc) : sorted.filter((l) => l.s === "av" || l.s === "md");
    const hiddenN = LOTS.length - vis.length;
    $("[data-lot-list]").innerHTML = vis.map((l) => `<li class="lot-card ${l.s}" data-lc="${l.n}"><span class="dot" style="background:${COLORS[l.s]}"></span><b>Lot ${l.n} · ${l.ac} acres</b><p>${l.model ? `Model Home — ${l.model}` : STATUS[l.s]} · ${l.orient} · Phase ${l.phase}${l.s === "av" ? ` · Fits ${compat(l).map((p) => p.name.replace("The ", "")).join(", ")}` : ""}</p>${l.s === "av" ? `<button class="btn btn-blue" type="button" data-lot-req-list="${l.n}">Request Info on This Lot</button>` : ""}</li>`).join("") +
      (hiddenN > 0 && !showAllLots ? `<li><button class="btn btn-ghost wide" type="button" data-all-lots>Show all homesites (${hiddenN} more)</button></li>` : "");
  }
  $("[data-lot-list]").addEventListener("click", (e) => {
    if (e.target.closest("[data-all-lots]")) { showAllLots = true; planFocus = null; renderLotList(); return; }
    const b = e.target.closest("[data-lot-req-list]"); if (b) lotRequest(lotBy[b.dataset.lotReqList]);
  });
  const availSec = $("#availability");
  function setView(v) { availSec.dataset.mode = v; $$("[data-view]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === v))); closePop(); }
  $("[data-view-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-view]"); if (b) setView(b.dataset.view); });
  setView("list"); renderLotList();

  function focusPlanLots(id) {
    const p = planById[id]; planFocus = id; showAllLots = false;
    const fits = LOTS.filter((l) => l.s === "av" && l.ac >= p.minAc);
    $$(".lot", site).forEach((g) => { const l = lotBy[g.dataset.lot]; g.style.opacity = l.s === "av" && l.ac >= p.minAc ? "1" : ".35"; });
    renderLotList();
    toast(`${fits.length} available homesites fit ${p.name}. Highlighted on the site plan.`);
    clearTimeout(focusPlanLots.t); focusPlanLots.t = setTimeout(() => { $$(".lot", site).forEach((g) => { g.style.opacity = ""; }); }, 8000);
  }

  // ---------- Model home tours & gallery ----------
  const tourM = $("[data-modal=tour]"), track = $("[data-pano-track]"), pano = $("[data-pano]");
  track.innerHTML = Art.panorama();
  const ROOMS = ["Great Room", "Kitchen", "Primary Bath"];
  $("[data-rooms]").innerHTML = ROOMS.map((r, i) => `<button type="button" data-room-go="${i}" aria-pressed="false">${r}</button>`).join("");
  let pos = 0;
  function setPos(p, smooth = true) {
    pos = Math.max(0, Math.min(2, p));
    track.style.transition = smooth && !reduce ? "transform .5s ease" : "none";
    track.style.transform = `translateX(${-(pos / 3) * 100}%)`;
    const r = Math.round(pos);
    $("[data-pano-room]").textContent = ROOMS[r];
    $$("[data-room-go]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.roomGo === r)));
  }
  $$("[data-vtour]").forEach((b) => b.addEventListener("click", () => {
    const crest = b.dataset.vtour === "crestview";
    $("[data-tour-name]").textContent = crest ? "The Crestview — Virtual Tour" : "The Ashford — Virtual Tour";
    setPos(crest ? 0 : 1, false); tourM.showModal(); pano.focus();
  }));
  $("[data-rooms]").addEventListener("click", (e) => { const b = e.target.closest("[data-room-go]"); if (b) setPos(+b.dataset.roomGo); });
  $$("[data-pan]").forEach((b) => b.addEventListener("click", () => setPos(Math.round(pos) + +b.dataset.pan)));
  pano.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { e.preventDefault(); setPos(pos - 0.25); } if (e.key === "ArrowRight") { e.preventDefault(); setPos(pos + 0.25); } });
  let drag = null;
  pano.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; drag = { x: e.clientX, p: pos }; pano.setPointerCapture(e.pointerId); });
  pano.addEventListener("pointermove", (e) => { if (drag) setPos(drag.p - ((e.clientX - drag.x) / pano.clientWidth), false); });
  const endDrag = () => { if (drag) { drag = null; setPos(Math.round(pos * 4) / 4); } };
  pano.addEventListener("pointerup", endDrag); pano.addEventListener("pointercancel", endDrag);
  $$("[data-inperson]").forEach((b) => b.addEventListener("click", () => toContact({ plan: b.dataset.inperson, intent: "Schedule a Tour", msg: `I'd like an in-person tour of ${b.dataset.inperson} model home.` })));

  const GAL = [["kitchen", "Kitchen"], ["bath", "Primary bath"], ["great", "Great room"], ["backyard", "Backyard"], ["porch", "Front porch"], ["office", "Home office"]];
  $("[data-strip]").innerHTML = GAL.map(([k, c], i) => `<button class="thumb" type="button" data-g="${i}" aria-label="Open photo: ${c}">${Art.interior(k)}<span>${c}</span></button>`).join("");
  const lb = $("[data-modal=lightbox]"); let gi = 0;
  function showG(i) { gi = (i + GAL.length) % GAL.length; $("[data-lb-img]").innerHTML = Art.interior(GAL[gi][0]); $("[data-lb-cap]").textContent = GAL[gi][1]; $("[data-lb-count]").textContent = `${gi + 1} of ${GAL.length}`; }
  $("[data-strip]").addEventListener("click", (e) => { const b = e.target.closest("[data-g]"); if (b) { showG(+b.dataset.g); lb.showModal(); } });
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => showG(gi + +b.dataset.lb)));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") showG(gi + 1); if (e.key === "ArrowLeft") showG(gi - 1); });
  let sx = null;
  $("[data-lb-img]").addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  $("[data-lb-img]").addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) showG(gi + (dx < 0 ? 1 : -1)); sx = null; });

  // ---------- Features ----------
  const FEAT = [
    ["Kitchen", "check", ["Granite countertops", "Stainless steel appliances", "36\" cabinets"], ["Quartz waterfall island", "GE Café series appliances", "42\" soft-close cabinets with under-cabinet lighting"]],
    ["Flooring", "layers", ["LVP throughout main level"], ["Hardwood throughout", "Tile in all baths"]],
    ["Exterior", "play", ["Fiber cement siding", "Sodded front yard"], ["Stone/brick accent facades", "Full landscape package with irrigation"]],
    ["Smart Home", "shield", ["Schlage keypad entry"], ["Full Ring security system", "Nest thermostat", "Motorized blinds"]],
  ];
  const li = (arr) => `<ul>${arr.map((t) => `<li>${ic("check")}${t.replace(/"/g, "&quot;")}</li>`).join("")}</ul>`;
  $("[data-compare]").innerHTML = `<div class="crow h"><span></span><span class="std">Standard</span><span class="prem-c">Premium Upgrade Package</span></div>` +
    FEAT.map(([c, i, s, p]) => `<div class="crow"><span class="cat">${ic(i)}${c}</span><div class="std">${li(s)}</div><div class="prem-c">${li(p)}</div></div>`).join("") +
    `<div class="crow"><span class="cat">${ic("bolt")}Energy</span><div class="both"><b>Standard on all homes:</b> Energy Star certified · 2x6 wall framing · Tankless water heater</div></div>`;
  $("[data-ftabs]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ftab]"); if (!b) return;
    $$("[data-ftab]").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    $("[data-compare]").dataset.show = b.dataset.ftab;
  });

  // ---------- PDFs (generated in the browser) ----------
  function pdf(lines, file) {
    const esc = (s) => s.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/·/g, "|").replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
    const wrapT = (t, size) => { const max = Math.floor(1000 / size); const out = []; let cur = ""; t.split(" ").forEach((w) => { if ((cur + " " + w).trim().length > max) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); out.push(cur); return out; };
    const pages = []; let s = "BT\n", y = 750;
    const flush = () => { pages.push(s + "ET"); s = "BT\n"; y = 750; };
    for (const [f, size, text] of lines) {
      if (!f) { y -= 10; continue; }
      for (const t of wrapT(text, size)) { if (y < 60) flush(); s += `/${f} ${size} Tf 1 0 0 1 54 ${y} Tm (${esc(t)}) Tj\n`; y -= size + 7; }
    }
    flush();
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${pages.map((_, i) => `${5 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    pages.forEach((st, i) => { objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${6 + i * 2} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>`, `<< /Length ${st.length} >>\nstream\n${st}\nendstream`); });
    let out = "%PDF-1.4\n"; const off = [];
    objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out], { type: "application/pdf" })); a.download = file;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const planLines = () => PLANS.flatMap((p) => [["F2", 12, `${p.name} - ${p.beds} bed / ${p.baths} bath - ${p.sq.toLocaleString("en-US")} sq ft - ${p.st}-story - From ${usd(p.price)}`], ["F1", 10, `Highlights: ${p.incl.join("; ")}.`]]);
  $("[data-brochure]").addEventListener("click", () => {
    pdf([["F2", 22, "RIDGELINE AT CEDAR CREEK"], ["F1", 11, "A Crestwood Homes community | Southwest Raleigh, NC | 919-555-0142"], ["", 0, ""],
      ["F1", 11, "86 thoughtfully designed single-family homes from the $420s. Now selling Phase 2."], ["", 0, ""], ["F2", 14, "Community highlights"],
      ...["Resort-style pool & clubhouse (opens summer 2026)", "12 acres of preserved green space with walking trails", "Two playgrounds + sand volleyball court", "Zoned for Cedar Creek Elementary and Panther Creek High", "5 minutes to Costco, Whole Foods, and Crossroads Plaza", "8 minutes to WakeMed Cary Hospital"].map((t) => ["F1", 11, `- ${t}`]),
      ["", 0, ""], ["F2", 14, "Floor plans"], ...planLines(), ["", 0, ""], ["F2", 14, "Visit"], ["F1", 11, "Sales Center: 100 Ridgeline Drive, Raleigh, NC 27607 | Open Thu-Mon 10AM-5PM"],
      ["", 0, ""], ["F1", 8, "All pricing, square footage, and availability subject to change without notice. Renderings are artist's impressions."]], "Ridgeline-at-Cedar-Creek-Brochure.pdf");
    toast("Brochure downloaded.");
  });
  $("[data-specs]").addEventListener("click", () => {
    pdf([["F2", 20, "RIDGELINE AT CEDAR CREEK - SPECIFICATIONS"], ["F1", 10, `Crestwood Homes | Generated ${new Date().toLocaleDateString("en-US")}`], ["", 0, ""],
      ...FEAT.flatMap(([c, , s, p]) => [["F2", 13, c], ["F1", 11, `Standard: ${s.join("; ")}`], ["F1", 11, `Premium Upgrade Package: ${p.join("; ")}`], ["", 0, ""]]),
      ["F2", 13, "Energy"], ["F1", 11, "Standard on all homes: Energy Star certified; 2x6 wall framing; tankless water heater."], ["", 0, ""], ["F2", 13, "Floor plans"], ...planLines(),
      ["", 0, ""], ["F1", 8, "Specifications subject to change without notice. See a sales advisor for current details."]], "Ridgeline-Specifications.pdf");
    toast("Specifications sheet downloaded.");
  });

  // ---------- Pre-qualification ----------
  const pq = $("[data-modal=prequal]"), pqf = $("[data-pq]");
  $("[data-prequal]").addEventListener("click", () => { $("[data-pq-out]").hidden = true; $("[data-pq-err]").textContent = ""; pq.showModal(); });
  pqf.income.value = "135,000";
  const money = (v) => Number(String(v).replace(/[^0-9.]/g, ""));
  pqf.addEventListener("submit", (e) => {
    e.preventDefault();
    const inc = money(pqf.income.value), down = money(pqf.down.value), debts = money(pqf.debts.value || 0), err = $("[data-pq-err]");
    if (!inc || inc < 10000) { err.textContent = "Please enter your annual household income."; pqf.income.focus(); return; }
    err.textContent = "";
    const mi = inc / 12, pay = Math.max(0, Math.min(0.28 * mi, 0.43 * mi - debts)) * 0.8, r = 0.0599 / 12;
    const loan = pay * (1 - Math.pow(1 + r, -360)) / r;
    let budget = loan + down;
    const prog = pqf.prog.value;
    if (prog === "fha") budget = Math.min(budget, down / 0.035);
    if (prog === "conv") budget = Math.min(budget, down / 0.03);
    const fits = PLANS.filter((p) => p.price <= budget);
    const out = $("[data-pq-out]");
    out.innerHTML = `<span>Estimated home budget</span><b data-budget>${usd(Math.floor(budget / 1000) * 1000)}</b><p>About ${usd(pay)}/mo principal &amp; interest at 5.99% (30-year).</p><p>${fits.length ? `Plans in range: <strong>${fits.map((p) => p.name).join(", ")}</strong>` : "Ridgeline starts at $425,000 — a sales advisor can walk you through incentives that may help."}</p><p class="m-sub">Demo estimate only — not a credit decision. Nothing was sent.</p>`;
    out.hidden = false;
  });

  // ---------- Contact ----------
  const cf = $("[data-contact]");
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  cf.date.min = tomorrow;
  function toContact({ plan, intent, msg } = {}) {
    if (!cf.hidden) {
      if (plan) $$('[name="plans"]', cf).forEach((c) => { if (plan.startsWith(c.value)) c.checked = true; });
      if (intent) $$('[name="intent"]', cf).forEach((r) => { r.checked = r.value === intent; });
      if (msg) cf.msg.value = msg;
    }
    $("#contact").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    setTimeout(() => { if (!cf.hidden) cf.first.focus({ preventScroll: true }); }, reduce ? 0 : 600);
  }
  $$("[data-tour-cta]").forEach((a) => a.addEventListener("click", () => { $$('[name="intent"]', cf).forEach((r) => { r.checked = r.value === "Schedule a Tour"; }); }));
  cf.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = []; $$("[aria-invalid]", cf).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (!cf.first.value.trim()) bad(cf.first, "first name");
    if (!cf.last.value.trim()) bad(cf.last, "last name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cf.email.value.trim())) bad(cf.email, "a valid email");
    if (!cf.phone.checkValidity() || cf.phone.value.replace(/\D/g, "").length < 10) bad(cf.phone, "a 10-digit phone number");
    if (cf.date.value && cf.date.value < tomorrow) bad(cf.date, "a tour date from tomorrow onward");
    $("[data-err]").textContent = errs.length ? `Please enter ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", cf).focus(); return; }
    const plans = $$('[name="plans"]:checked', cf).map((c) => c.value), intent = $('[name="intent"]:checked', cf).value;
    const when = cf.date.value ? ` We've penciled in ${new Date(cf.date.value + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.` : "";
    $("[data-sent-text]").textContent = `Thanks, ${cf.first.value.trim()}! A Ridgeline sales advisor will contact you at ${cf.email.value.trim()} within one business day to ${intent.toLowerCase().replace("schedule a tour", "schedule your tour").replace("get pricing info", "share pricing").replace("speak with a sales advisor", "talk through your options")}${plans.length ? ` for ${plans.join(", ")}` : ""}.${when} (Demo — nothing was sent.)`;
    cf.hidden = true; $("[data-sent]").hidden = false; $("[data-sent]").focus();
  });
  $("[data-again]").addEventListener("click", () => { cf.reset(); cf.hidden = false; $("[data-sent]").hidden = true; cf.first.focus(); });

  // contact map
  $("[data-cmap]").innerHTML = `<svg viewBox="0 0 500 640" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map showing the Ridgeline at Cedar Creek sales center entrance at 100 Ridgeline Drive, near I-40 and US-1">
    <rect width="500" height="640" fill="#EEF2EA"/><path d="M-20 140 C 120 160 300 120 520 170" stroke="#FCD34D" stroke-width="16" fill="none"/><path d="M-20 140 C 120 160 300 120 520 170" stroke="#F59E0B" stroke-width="2" fill="none"/>
    <path d="M90 -20 C 120 200 60 420 140 660" stroke="#FCD34D" stroke-width="12" fill="none"/>
    ${[90, 210, 330, 450, 570].map((y) => `<path d="M-10 ${y + 30} L 510 ${y}" stroke="#fff" stroke-width="6"/>`).join("")}${[60, 200, 340, 460].map((x) => `<path d="M${x} -10 L ${x + 30} 650" stroke="#fff" stroke-width="5"/>`).join("")}
    <path d="M210 260 C 300 230 420 260 430 360 C 440 460 330 520 250 490 C 190 470 170 320 210 260Z" fill="#CFE3BC" stroke="#059669" stroke-width="2.5" stroke-dasharray="7 5"/>
    <path d="M-10 610 C 160 560 300 640 520 560" stroke="#93C5FD" stroke-width="18" fill="none"/>
    <rect x="18" y="112" width="44" height="22" rx="4" fill="#1D4ED8"/><text x="40" y="128" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#fff">I-40</text>
    <rect x="96" y="40" width="44" height="22" rx="4" fill="#fff" stroke="#1E293B"/><text x="118" y="56" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#1E293B">US-1</text>
    <text x="320" y="390" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#065F46">Ridgeline at Cedar Creek</text>
    <g transform="translate(212 300)"><path d="M0 0 C -16 -22 -22 -32 -22 -42 a22 22 0 0 1 44 0 C 22 -32 16 -22 0 0Z" fill="#1D4ED8" stroke="#fff" stroke-width="3"/><circle cy="-42" r="8" fill="#fff"/></g>
    <rect x="236" y="244" width="200" height="44" rx="8" fill="#fff" stroke="#E2E8F0"/><text x="248" y="263" font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="#1E293B">Sales Center &amp; Entrance</text><text x="248" y="279" font-family="Inter, sans-serif" font-size="11" fill="#64748B">100 Ridgeline Drive</text>
    <circle cx="380" cy="120" r="7" fill="#DC2626"/><text x="392" y="124" font-family="Inter, sans-serif" font-size="11" fill="#334155">WakeMed Cary · 8 min</text>
    <circle cx="150" cy="210" r="7" fill="#7C3AED"/><text x="162" y="214" font-family="Inter, sans-serif" font-size="11" fill="#334155">Crossroads Plaza · 5 min</text>
    <circle cx="300" cy="560" r="7" fill="#F59E0B"/><text x="312" y="550" font-family="Inter, sans-serif" font-size="11" fill="#334155">Cedar Creek Elementary</text></svg>`;

  // ---------- Footer accordion / sticky bar ----------
  const syncFooter = () => $$("[data-fd]").forEach((d) => { d.open = !mobile.matches; });
  mobile.addEventListener("change", syncFooter); syncFooter();
  $$("[data-fd] summary").forEach((s) => s.addEventListener("click", (e) => { if (!mobile.matches) e.preventDefault(); }));
  const sticky = $("[data-sticky]");
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const so = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); }); sticky.classList.toggle("away", seen.size > 0); });
    so.observe($("#contact")); so.observe($(".footer"));
  }

  window.MuseRidge = { lots: () => counts, lot: (n) => ({ ...lotBy[n], plans: compat(lotBy[n]).map((p) => p.name) }), pano: () => ROOMS[Math.round(pos)] };
  applyPlanFilter();
})();
