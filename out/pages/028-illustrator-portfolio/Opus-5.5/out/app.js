(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n) => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } } };
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };

  // ---------- Data ----------
  const SHAPES = { tall: [1000, 1500], portrait: [1200, 1500], landscape: [1500, 1000], square: [1200, 1200] };
  const PIECES = [
    ["The Midnight Garden", "Book Covers", "tall", "garden", "Moonwell Press", 2025, "Cover art for a middle-grade fantasy novel: a girl walks a moonlit path through flowers that only open after dark.", "Procreate, Photoshop"],
    ["Bloomberg Businessweek: AI Issue", "Editorial", "landscape", "ai", "Bloomberg", 2025, "A series of 4 illustrations exploring the visual language of artificial intelligence for Bloomberg Businessweek's special AI issue.", "Procreate, Photoshop"],
    ["Fauna Coffee Branding", "Branding", "square", "coffee", "Fauna Coffee", 2024, "A fox mascot and illustration system for a neighborhood roaster's cups, bags and café walls.", "Illustrator, Procreate"],
    ["Migration Patterns", "Personal", "portrait", "migration", "Self-initiated", 2024, "A personal study of autumn migration, layering flight paths over the Columbia River at dusk.", "Procreate"],
    ["New Yorker: Urban Solitude", "Editorial", "tall", "solitude", "The New Yorker", 2025, "An illustration for an essay on loneliness in big cities — one warm window in a sleeping block.", "Procreate, Photoshop"],
    ["Dreamscape", "Motion", "landscape", "dream", "Self-initiated", 2025, "A looping animation of tides made of cloud, created as a calm-screen loop for a meditation app pitch.", "Procreate Dreams, After Effects"],
    ["Wildflower Herbarium", "Personal", "square", "herbarium", "Self-initiated", 2023, "Six pressed-flower studies from a summer of walks in Forest Park, annotated by hand.", "Gouache, Photoshop"],
    ["HarperCollins: The Lost City", "Book Covers", "portrait", "ruins", "HarperCollins", 2024, "Jacket art for an adventure novel: a stepped temple rising out of the jungle at golden hour.", "Procreate, Photoshop"],
    ["Oatly Campaign Illustrations", "Branding", "landscape", "oats", "Oatly", 2024, "Playful oat characters for a breakfast campaign across posters, cartons and social.", "Procreate, Illustrator"],
    ["Creatures of the Deep", "Personal", "tall", "deep", "Self-initiated", 2023, "A bioluminescent study of jellyfish and anglerfish, printed as a limited glow-ink edition.", "Procreate"],
    ["Wired Magazine: Quantum Computing", "Editorial", "landscape", "quantum", "Wired", 2024, "Opening spread for a feature explaining superposition without equations (well, one).", "Illustrator, Photoshop"],
    ["Luna Tea Packaging", "Branding", "square", "tea", "Luna Tea", 2023, "Three moon-phase tins for an evening tea range: Dusk, Luna and Dawn.", "Illustrator"],
    ["Desert Bloom", "Personal", "landscape", "desert", "Self-initiated", 2022, "A sketchbook piece after a spring trip to the high desert of eastern Oregon.", "Gouache, Procreate"],
    ["Night Shift", "Editorial", "portrait", "city", "The Weekly Ledger", 2023, "Spot illustration for a story on the people who keep a city running after midnight.", "Procreate"],
    ["Tidepool Stories", "Book Covers", "portrait", "tide", "Little Wave Books", 2022, "Cover for a picture book about a child exploring Oregon tidepools at low tide.", "Gouache, Photoshop"],
    ["Kite Festival", "Branding", "square", "kites", "Rose City Kite Festival", 2022, "Poster and merch illustration for a community kite festival.", "Illustrator"],
    ["Paper Moon", "Motion", "square", "paper", "Self-initiated", 2024, "A gentle paper-cut loop for an animated holiday card.", "Procreate Dreams"],
    ["Fox & Fern", "Personal", "portrait", "fox", "Self-initiated", 2021, "An early woodland piece that started the fox motif later used for Fauna Coffee.", "Procreate"],
  ].map(([title, cat, shape, motif, client, year, desc, tools], i) => ({ i, title, cat, shape, motif, client, year, desc, tools, seed: i + 3 }));
  const CATNAME = { Editorial: "Editorial Illustration", "Book Covers": "Book Cover Illustration", Branding: "Brand Illustration", Personal: "Personal Work", Motion: "Motion Illustration" };
  const art = (p, o = {}) => Art.piece(p.motif, { w: SHAPES[p.shape][0], h: SHAPES[p.shape][1], seed: p.seed, label: o.label || `${p.title} — ${p.cat.toLowerCase()} illustration`, ...o });

  // ---------- Hero ----------
  $("[data-hero-art]").innerHTML = art(PIECES[0], { w: 1600, h: 1000, label: "Hero illustration: The Midnight Garden — a girl walking through moonlit flowers under a starry sky" });
  $("[data-portrait]").innerHTML = Art.portrait();

  // ---------- Nav: transparent over hero, solid on scroll ----------
  const nav = $("[data-nav]"), heroArt = $("[data-parallax]");
  let ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle("solid", scrollY > 24);
    if (!reduce() && scrollY < innerHeight * 1.2) heroArt.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // theme
  const themeBtn = $("[data-theme-toggle]");
  const syncTheme = () => { const dark = document.documentElement.dataset.theme === "dark"; themeBtn.setAttribute("aria-pressed", String(dark)); themeBtn.innerHTML = ic(dark ? "sun" : "moon"); themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode"); };
  themeBtn.addEventListener("click", () => { const dark = document.documentElement.dataset.theme !== "dark"; if (dark) document.documentElement.dataset.theme = "dark"; else delete document.documentElement.dataset.theme; store.set("mt-theme", dark ? "dark" : "light"); syncTheme(); });
  syncTheme();

  // full-screen menu
  const overlay = $("[data-overlay]"), menuBtn = $("[data-menu-btn]");
  const setMenu = (open) => { overlay.hidden = !open; menuBtn.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-menu-close]").focus(); else menuBtn.focus(); };
  menuBtn.addEventListener("click", () => setMenu(true));
  $("[data-menu-close]").addEventListener("click", () => setMenu(false));
  overlay.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
    if (e.key === "Tab") { const f = $$("a, button", overlay), a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });

  // ---------- Gallery (masonry) ----------
  const grid = $("[data-grid]"), moreBtn = $("[data-more]"), PAGE = 6;
  let filter = "all", shown = PAGE;
  grid.innerHTML = PIECES.map((p) => `<li class="tile" data-i="${p.i}" data-cat="${p.cat}" hidden><button type="button" aria-haspopup="dialog" aria-label="${esc(p.title)} — ${p.cat}. View project">${p.cat === "Motion" ? `<span class="badge">${ic("play")}MOTION</span>` : ""}<span class="art" data-art></span><span class="ov" aria-hidden="true"><b>${esc(p.title)}</b><span>${p.cat} · ${p.year}</span><em>View Project →</em></span></button></li>`).join("");
  const tiles = $$(".tile", grid);
  function layout() {
    const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length, gap = 24;
    const colW = (grid.clientWidth - gap * (cols - 1)) / cols;
    tiles.forEach((t) => { if (t.hidden) return; const p = PIECES[+t.dataset.i], [w, h] = SHAPES[p.shape], ht = colW * (h / w); t.firstElementChild.style.height = `${ht}px`; t.style.gridRowEnd = `span ${Math.ceil((ht + gap) / 8)}`; });
  }
  function apply(animate) {
    const list = PIECES.filter((p) => filter === "all" || p.cat === filter), vis = new Set(list.slice(0, shown).map((p) => p.i));
    tiles.forEach((t) => {
      const on = vis.has(+t.dataset.i);
      if (on && !$("[data-art] svg", t)) $("[data-art]", t).innerHTML = art(PIECES[+t.dataset.i]);
      if (on && t.hidden && animate) { t.classList.add("fade"); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.remove("fade"))); }
      t.hidden = !on;
    });
    layout();
    moreBtn.hidden = shown >= list.length;
    $("[data-count]").textContent = `Showing ${Math.min(shown, list.length)} of ${list.length} pieces`;
    return list;
  }
  $("[data-filters]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-f]"); if (!b || b.dataset.f === filter) return;
    $$("[data-f]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    filter = b.dataset.f; shown = PAGE;
    const go = () => { const list = apply(true); $("[data-status]").textContent = `${filter === "all" ? "All work" : filter}: ${list.length} ${list.length === 1 ? "piece" : "pieces"}`; };
    if (reduce()) go(); else { tiles.forEach((t) => { if (!t.hidden) t.classList.add("fade"); }); setTimeout(() => { tiles.forEach((t) => t.classList.remove("fade")); go(); }, 220); }
  });
  moreBtn.addEventListener("click", () => {
    const before = shown; shown += PAGE; apply(true);
    const first = tiles.filter((t) => !t.hidden)[before]; if (first) $("button", first).focus({ preventScroll: true });
    $("[data-status]").textContent = `Loaded ${Math.min(PAGE, tiles.filter((t) => !t.hidden).length - before)} more pieces`;
  });
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(layout, 120); });
  apply(false);

  // ---------- Project detail ----------
  const pm = $("[data-modal=project]"), track = $("[data-car-track]");
  let cur = null, slide = 0;
  const VIEWS = [[null, "Full artwork"], [[0.25, 0.2, 0.5, 0.5], "Detail"], ["alt", "Alternate colourway"]];
  function openProject(p) {
    cur = p; slide = 0;
    $("[data-pj-title]").textContent = p.title; $("[data-pj-client]").textContent = p.client; $("[data-pj-cat]").textContent = CATNAME[p.cat];
    $("[data-pj-year]").textContent = p.year; $("[data-pj-tools]").textContent = p.tools; $("[data-pj-desc]").textContent = p.desc;
    track.innerHTML = VIEWS.map(([v, n], k) => `<div role="group" aria-roledescription="slide" aria-label="${k + 1} of ${VIEWS.length}: ${n}">${art(p, { crop: Array.isArray(v) ? v : undefined, variant: v === "alt" ? 1 : 0, label: `${p.title}: ${n.toLowerCase()}` })}</div>`).join("");
    $("[data-sub]").innerHTML = [[0, 0, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]].map((c, k) => `<div>${art(p, { crop: c, label: `${p.title}: close-up ${k + 1}` })}</div>`).join("");
    $("[data-pj-inquire]").dataset.inquire = { Editorial: "Editorial", "Book Covers": "Book", Branding: "Brand", Personal: "Personal", Motion: "Other" }[p.cat];
    go(0); pm.showModal();
  }
  function go(n) { slide = (n + VIEWS.length) % VIEWS.length; track.style.transform = `translateX(${-slide * 100}%)`; $("[data-car-count]").textContent = `${slide + 1} of ${VIEWS.length}`; }
  grid.addEventListener("click", (e) => { const t = e.target.closest(".tile"); if (t) openProject(PIECES[+t.dataset.i]); });
  $$("[data-car-step]").forEach((b) => b.addEventListener("click", () => go(slide + +b.dataset.carStep)));
  pm.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(slide + 1); if (e.key === "ArrowLeft") go(slide - 1); });
  let sx = null; const car = $("[data-car]");
  car.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  car.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(slide + (dx < 0 ? 1 : -1)); sx = null; });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- Shop ----------
  const PRINTS = [[0, "The Midnight Garden — Limited Print", "12/50 remaining", 120], [6, "Wildflower Herbarium — Limited Print", "8/40 remaining", 95], [9, "Creatures of the Deep — Glow Print", "21/50 remaining", 140], [3, "Migration Patterns — Limited Print", "5/30 remaining", 110]];
  const sq = (p) => { const [w, h] = SHAPES[p.shape], s = Math.min(w, h); return [(w - s) / 2 / w, (h - s) / 2 / h, s / w, s / h]; };
  $("[data-prints]").innerHTML = PRINTS.map(([i, t, ed, price], k) => `<li class="print reveal"><div class="p-img">${art(PIECES[i], { crop: sq(PIECES[i]), label: `${t} artwork` })}</div><h3>${esc(t)}</h3><p class="ed">Edition: ${ed}</p><p class="pp">$${price}</p><button type="button" data-print="${k}">View in Shop ${ic("arrow")}</button></li>`).join("");
  const prm = $("[data-modal=print]"); let pk = 0;
  $("[data-prints]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-print]"); if (!b) return; pk = +b.dataset.print;
    const [i, t, ed, price] = PRINTS[pk];
    $("[data-pr-img]").innerHTML = art(PIECES[i], { crop: sq(PIECES[i]), label: `${t} artwork` });
    $("[data-pr-title]").textContent = t; $("[data-pr-ed]").textContent = `Edition: ${ed}`; $("[data-pr-price]").textContent = `$${price}`; $("[data-pr-msg]").textContent = ""; $("[data-pr-size]").selectedIndex = 0;
    prm.showModal();
  });
  $("[data-pr-size]").addEventListener("change", (e) => { $("[data-pr-price]").textContent = `$${PRINTS[pk][3] + [0, 40, 90][e.target.selectedIndex]}`; });
  $("[data-reserve]").addEventListener("click", () => { $("[data-pr-msg]").textContent = `Reserved ${$("[data-pr-size]").value} for 24 hours — Maya will email checkout details. (Demo — no order was placed.)`; });
  $("[data-browse]").addEventListener("click", (e) => { e.preventDefault(); toast("The full print shop isn't part of this demo — these four editions are available now."); });

  // ---------- Testimonials: auto-scroll, pause on hover/focus ----------
  const TM = [["Maya's work brought our cover story to life in ways we couldn't have imagined.", "Art Director, Bloomberg Businessweek", "BB"], ["She understood our brand ethos immediately and delivered illustrations that feel authentically Oatly.", "Creative Director, Oatly", "Oa"], ["Working with Maya was seamless. The final book cover exceeded our expectations.", "Editor, HarperCollins", "HC"]];
  const tmHtml = (hidden) => TM.map(([q, who, m]) => `<li${hidden ? ' aria-hidden="true"' : ""}><figure class="tm"><blockquote>${esc(q)}</blockquote><figcaption><span class="mono" aria-hidden="true">${m}</span>${esc(who)}</figcaption></figure></li>`).join("");
  const tmBox = $("[data-tm]");
  $("[data-tm-track]").innerHTML = tmHtml(false) + tmHtml(true);
  let tmPause = false, tmLast = 0, tmPos = 0;
  ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach((ev) => tmBox.addEventListener(ev, () => { tmPause = true; }, { passive: true }));
  ["mouseleave", "focusout"].forEach((ev) => tmBox.addEventListener(ev, () => { tmPause = false; tmPos = tmBox.scrollLeft; }));
  function tmTick(t) {
    const dt = tmLast ? Math.min(64, t - tmLast) : 0; tmLast = t;
    if (!tmPause && !reduce() && document.visibilityState === "visible") {
      const half = $("[data-tm-track]").scrollWidth / 2;
      tmPos += dt * 0.03; if (tmPos >= half) tmPos -= half;
      tmBox.scrollLeft = tmPos;
    }
    requestAnimationFrame(tmTick);
  }
  requestAnimationFrame(tmTick);
  window.MuseMaya = { tm: () => ({ paused: tmPause, left: tmBox.scrollLeft }) };

  // ---------- Contact ----------
  const form = $("[data-form]");
  $$("[data-inquire]").forEach((a) => a.addEventListener("click", () => { if (pm.open) pm.close(); form.type.value = a.dataset.inquire; setTimeout(() => form.name.focus({ preventScroll: true }), reduce() ? 0 : 600); }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = []; $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (form.name.value.trim().length < 2) bad(form.name, "your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) bad(form.email, "a valid email");
    if (form.msg.value.trim().length < 20) bad(form.msg, "a short message about the project (20+ characters)");
    $("[data-err]").textContent = errs.length ? `Please add ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", form).focus(); return; }
    $("[data-sent-text]").textContent = `Thanks, ${form.name.value.trim().split(/\s+/)[0]} — I'll reply to ${form.email.value.trim()} within 48 hours about your ${form.type.value.toLowerCase()} project${form.budget.value ? ` (${form.budget.value})` : ""}. (Demo — nothing was sent.)`;
    form.hidden = true; $("[data-sent]").hidden = false; $("[data-sent]").focus();
  });

  // ---------- CV (generated PDF) & privacy ----------
  $("[data-cv]").addEventListener("click", () => {
    const L = [["F2", 22, "MAYA TORRES - Curriculum Vitae"], ["F1", 11, "Illustrator & Visual Storyteller | Portland, Oregon | hello@mayatorres.com"], ["", 0, ""], ["F2", 13, "Education"], ["F1", 11, "BFA Illustration, Rhode Island School of Design"], ["", 0, ""], ["F2", 13, "Experience"], ["F1", 11, "Freelance illustrator, 8+ years | 200+ projects | 40+ clients worldwide"], ["", 0, ""], ["F2", 13, "Selected work (sample content)"], ...PIECES.slice(0, 12).map((p) => ["F1", 10, `${p.year}  ${p.title} - ${p.client} (${p.cat})`]), ["", 0, ""], ["F1", 9, "Sample CV generated for this portfolio template."]];
    const e = (s) => s.replace(/[–—]/g, "-").replace(/[’]/g, "'").replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
    let s = "BT\n", y = 750; for (const [f, size, t] of L) { if (!f) { y -= 8; continue; } s += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${e(t)}) Tj\n`; y -= size + 7; } s += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>", `<< /Length ${s.length} >>\nstream\n${s}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>"];
    let out = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([out], { type: "application/pdf" })); a.download = "Maya-Torres-CV.pdf"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  });
  $("[data-privacy]").addEventListener("click", () => $("[data-modal=privacy]").showModal());

  // ---------- Fade-ins on scroll ----------
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce()) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    reveals.forEach((r) => io.observe(r));
  } else reveals.forEach((r) => r.classList.add("in"));
})();
