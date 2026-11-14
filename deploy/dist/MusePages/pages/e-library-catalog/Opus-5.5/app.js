(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } } };

  const TYPES = { ebook: ["E-Book", "#3B82F6", "book", 4230], paper: ["Paper", "#059669", "file", 3890], video: ["Video", "#7C3AED", "video", 2100], tutorial: ["Tutorial", "#F97316", "code", 1430], podcast: ["Podcast", "#DB2777", "mic", 800] };
  const TYPE_LABEL = { ebook: "E-Books", paper: "Research Papers", video: "Video Lectures", tutorial: "Interactive Tutorials", podcast: "Podcasts" };
  const SUBJECTS = [["Computer Science", 2340], ["Mathematics", 1890], ["Business & Economics", 1560], ["Psychology", 1230], ["Engineering", 980]];
  const MORE_SUBJECTS = [["Biology", 870], ["Environmental Science", 640], ["History", 610], ["Philosophy", 420], ["Design", 390]];
  const LEVELS = [["Beginner", 3200], ["Intermediate", 5100], ["Advanced", 4150]];
  const LANGS = ["English", "Spanish", "French", "German", "Mandarin"];
  const AVAIL = ["Free", "Premium", "Open Access"];

  // ---------- sample catalog (first four are the brief's examples) ----------
  const R = [
    { type: "ebook", title: "Algorithms: Design and Analysis", author: "Dr. Sarah Mitchell", subject: "Computer Science", level: "Intermediate", lang: "English", avail: "Free", year: 2024, rating: 4.8, ratings: 342, pop: 980, staff: true, trend: true },
    { type: "video", title: "Introduction to Behavioral Economics", author: "Prof. James Carter, MIT", subject: "Business & Economics", level: "Beginner", lang: "English", avail: "Free", year: 2025, rating: 4.9, ratings: 518, pop: 1240, dur: "1h 24m", trend: true },
    { type: "paper", title: "Neural Networks in Climate Modeling: A Comprehensive Review", author: "Park, J., Williams, R., & Liu, X.", subject: "Computer Science", level: "Advanced", lang: "English", avail: "Open Access", year: 2025, rating: 4.6, ratings: 61, pop: 760, journal: "Nature Machine Intelligence", cites: 89, staff: true },
    { type: "tutorial", title: "Build a REST API with Node.js", author: "LearnCraft Team", subject: "Computer Science", level: "Intermediate", lang: "English", avail: "Premium", year: 2026, rating: 4.7, ratings: 203, pop: 870, hours: 3, modules: 12, progress: 45, isNew: true },
  ];
  const T = ["Linear Algebra for Data Science", "Foundations of Microeconomics", "Cognitive Psychology Today", "Thermodynamics Explained", "Discrete Mathematics Workbook", "Marketing in the Digital Age", "Statistics with R", "Introduction to Robotics", "The Social Brain", "Corporate Finance Essentials", "Graph Theory and Networks", "Deep Learning from Scratch", "Developmental Psychology", "Structural Engineering Basics", "Game Theory in Practice", "Calculus II Video Course", "Cloud Architecture Patterns", "Organizational Behavior", "Probability for Beginners", "Signals and Systems", "Behavioral Finance Podcast", "Python for Scientists", "Leadership and Negotiation", "Clinical Psychology Methods", "Fluid Mechanics Lab Series", "Number Theory Primer", "Databases: SQL to NoSQL", "Entrepreneurship 101", "Memory and Learning", "Control Systems Design", "Real Analysis Notes", "Computer Vision Survey", "Supply Chain Management", "Social Psychology Lectures", "Electric Circuits Tutorial", "Optimization Methods", "Ethics in AI Podcast", "Accounting Fundamentals", "Neuroscience of Habit", "Materials Science Overview", "Topology Made Visual", "Mobile App Development", "Behavioral Economics Readings", "Research Methods in Psychology"];
  const AUTH = ["Dr. Elena Ruiz", "Prof. Daniel Okafor", "Dr. Mei Lin", "Prof. Hannah Weber", "Dr. Arjun Rao", "LearnCraft Team", "Prof. Laura Bennett", "Dr. Samuel Osei", "Prof. Yuki Tanaka", "Dr. Omar Haddad"];
  const tseq = ["ebook", "video", "paper", "tutorial", "ebook", "paper", "video", "podcast"];
  T.forEach((title, i) => {
    const subj = /Psych|Brain|Memory|Habit|Social/.test(title) ? "Psychology" : /Econ|Market|Finance|Corporate|Leader|Supply|Entre|Account|Organ/.test(title) ? "Business & Economics" : /Algebra|Discrete|Calculus|Probab|Number|Analysis|Graph|Topology|Optim|Statistics|Game/.test(title) ? "Mathematics" : /Thermo|Robot|Struct|Signals|Fluid|Control|Electric|Materials/.test(title) ? "Engineering" : "Computer Science";
    const type = /Podcast/.test(title) ? "podcast" : /Video|Lectures/.test(title) ? "video" : /Tutorial|Workbook|Lab/.test(title) ? "tutorial" : /Survey|Review|Readings|Methods/.test(title) ? "paper" : tseq[i % tseq.length];
    R.push({ type, title, author: type === "paper" ? `${AUTH[i % 10].split(" ").pop()}, ${"ABCDEFGH"[i % 8]}., & ${AUTH[(i + 3) % 10].split(" ").pop()}, ${"JKLMNPRS"[i % 8]}.` : AUTH[i % 10], subject: subj, level: LEVELS[i % 3][0], lang: i % 9 === 4 ? "Spanish" : i % 11 === 7 ? "French" : i % 13 === 5 ? "German" : i % 17 === 3 ? "Mandarin" : "English", avail: AVAIL[(i * 7) % 3], year: 2015 + ((i * 5) % 12), rating: Math.round((4.1 + ((i * 13) % 9) / 10) * 10) / 10, ratings: 40 + ((i * 53) % 600), pop: 120 + ((i * 97) % 1100), dur: type === "video" ? `${(i % 2) + 1}h ${(i * 7) % 60}m` : type === "podcast" ? `${30 + (i % 4) * 10} min` : undefined, journal: type === "paper" ? ["Journal of Applied Learning", "Computational Review", "Behavioral Science Letters", "Engineering Reports"][i % 4] : undefined, cites: type === "paper" ? 5 + ((i * 17) % 140) : undefined, hours: type === "tutorial" ? 1 + (i % 5) : undefined, modules: type === "tutorial" ? 6 + (i % 9) : undefined, progress: type === "tutorial" && i % 3 === 0 ? 20 + (i % 60) : undefined, staff: i % 7 === 2, trend: i % 6 === 1, isNew: 2015 + ((i * 5) % 12) >= 2025 });
  });
  R.forEach((r, i) => { r.id = i; r.seed = i + 3; });
  const by = (id) => R[id];

  // ---------- state ----------
  const f = { types: new Set(), subjects: new Set(), levels: new Set(), langs: new Set(), avail: new Set(), y0: 2015, y1: 2026, q: "", chip: "" };
  let sort = "relevance", view = "grid", page = 1;
  const PER = 24;
  const saved = new Set(store.get("os-saved", [0, 2, 5]));
  const BASE_SAVED = 11; // saved items outside this sample, so the list shows 14 to start
  let recent = store.get("os-recent", [1, 3, 7, 12, 18, 26]);

  // ---------- facets ----------
  const box = (group, val, label, count) => `<label class="cb"><input type="checkbox" data-g="${group}" value="${esc(val)}"><span>${label}</span>${count ? `<small>${count.toLocaleString("en-US")}</small>` : ""}</label>`;
  $("[data-f-type]").innerHTML = Object.entries(TYPE_LABEL).map(([k, l]) => box("types", k, `<i class="tdot" style="--c:${TYPES[k][1]}"></i>${l}`, TYPES[k][3])).join("");
  $("[data-f-subject]").innerHTML = SUBJECTS.map(([s, n]) => box("subjects", s, s, n)).join("") + `<div class="more" hidden data-more>${MORE_SUBJECTS.map(([s, n]) => box("subjects", s, s, n)).join("")}<p class="fine">…and 76 more in the full catalog.</p></div>`;
  $("[data-f-level]").innerHTML = LEVELS.map(([l, n]) => box("levels", l, l, n)).join("");
  $("[data-f-lang]").innerHTML = LANGS.map((l) => box("langs", l, l)).join("");
  $("[data-f-avail]").innerHTML = AVAIL.map((a) => box("avail", a, a)).join("");
  $("[data-more-subjects]").addEventListener("click", (e) => { const m = $("[data-more]"), open = m.hidden; m.hidden = !open; e.currentTarget.setAttribute("aria-expanded", String(open)); e.currentTarget.textContent = open ? "Show fewer subjects" : "Show 81 more subjects"; });
  $("[data-filters]").addEventListener("change", (e) => { const c = e.target.closest("[data-g]"); if (!c) return; f[c.dataset.g][c.checked ? "add" : "delete"](c.value); page = 1; render(); });
  const y0 = $("[data-y0]"), y1 = $("[data-y1]");
  function years(e) { let a = +y0.value, b = +y1.value; if (a > b) { if (e && e.target === y0) a = b; else b = a; } y0.value = a; y1.value = b; f.y0 = a; f.y1 = b; $("[data-y0-out]").textContent = a; $("[data-y1-out]").textContent = b; const span = 2026 - 2015; $("[data-r-fill]").style.cssText = `left:${((a - 2015) / span) * 100}%;right:${((2026 - b) / span) * 100}%`; }
  [y0, y1].forEach((r) => r.addEventListener("input", (e) => { years(e); page = 1; render(); }));
  years();

  // ---------- filtering ----------
  function matches(r) {
    if (f.types.size && !f.types.has(r.type)) return false;
    if (f.subjects.size && !f.subjects.has(r.subject)) return false;
    if (f.levels.size && !f.levels.has(r.level)) return false;
    if (f.langs.size && !f.langs.has(r.lang)) return false;
    if (f.avail.size && !f.avail.has(r.avail)) return false;
    if (r.year < f.y0 || r.year > f.y1) return false;
    if (f.chip === "trending" && !r.trend) return false;
    if (f.chip === "new" && !r.isNew) return false;
    if (f.chip === "staff" && !r.staff) return false;
    if (f.chip === "open" && r.avail !== "Open Access") return false;
    if (f.q) { const hay = `${r.title} ${r.author} ${r.subject} ${TYPES[r.type][0]} ${r.journal || ""}`.toLowerCase(); if (!f.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false; }
    return true;
  }
  function list() {
    const l = R.filter(matches);
    const s = { newest: (a, b) => b.year - a.year || b.pop - a.pop, popular: (a, b) => b.pop - a.pop, rated: (a, b) => b.rating - a.rating || b.ratings - a.ratings, relevance: (a, b) => a.id - b.id };
    return l.sort(s[sort]);
  }

  // ---------- cards ----------
  const stars = (r) => `<span class="rate">${icon("star")}${r.rating} <small>(${r.ratings.toLocaleString("en-US")} ratings)</small></span>`;
  function card(r) {
    const [tl, tc, ti] = TYPES[r.type], s = saved.has(r.id);
    const primary = { ebook: "Read Now", video: "Watch Now", paper: "Read Paper", tutorial: r.progress ? "Continue" : "Start", podcast: "Listen" }[r.type];
    const meta = r.type === "paper" ? `<p class="meta">${esc(r.journal)} · ${r.cites} citations</p>` : r.type === "tutorial" ? `<p class="meta">${icon("clock")}${r.hours} hours · ${r.modules} modules</p>${stars(r)}` : `<p class="meta">${esc(r.subject)}</p>${stars(r)}`;
    return `<article class="card t-${r.type}" style="--tc:${tc}" data-id="${r.id}">
      <div class="thumb ${r.type === "ebook" ? "book" : ""}">${window.Art.thumb(r)}${r.dur ? `<span class="dur">${r.type === "video" ? icon("play") : ""}${r.dur}</span>` : ""}${r.type === "video" ? `<span class="play">${icon("play")}</span>` : ""}</div>
      <div class="c-body">
        <div class="badges"><span class="type" style="--tc:${tc}">${icon(ti)}${tl}</span><span class="acc ${r.avail === "Open Access" ? "oa" : r.avail === "Premium" ? "pr" : "fr"}">${r.avail}</span></div>
        <h3><button type="button" class="t-link" data-open="${r.id}">${esc(r.title)}</button></h3>
        <p class="by">${esc(r.author)}${r.type === "paper" ? ` (${r.year})` : ""}</p>
        ${meta}
        ${r.progress ? `<div class="prog" aria-label="${r.progress}% complete"><i style="width:${r.progress}%"></i></div><p class="prog-t">${r.progress}% Complete</p>` : ""}
        <div class="acts"><button class="btn btn-blue btn-sm" type="button" data-open="${r.id}">${primary}</button>${r.type === "paper" ? `<button class="btn btn-ghost btn-sm" type="button" data-cite="${r.id}">${icon("quote")}Cite</button>` : ""}<button class="icon-btn" type="button" aria-pressed="${s}" aria-label="${s ? "Remove from" : "Save to"} reading list: ${esc(r.title)}" data-save="${r.id}">${icon("bookmark")}</button>${r.type !== "paper" ? `<button class="icon-btn" type="button" aria-label="Share ${esc(r.title)}" data-share="${r.id}">${icon("share")}</button>` : ""}</div>
      </div></article>`;
  }
  function render() {
    const l = list(), pages = Math.max(1, Math.ceil(l.length / PER));
    page = Math.min(page, pages);
    const slice = l.slice((page - 1) * PER, page * PER);
    $("[data-cards]").className = `cards ${view}`;
    $("[data-cards]").innerHTML = slice.map(card).join("");
    $("[data-empty]").hidden = l.length > 0;
    $("[data-count]").innerHTML = l.length ? `Showing <b>${(page - 1) * PER + 1}–${(page - 1) * PER + slice.length}</b> of <b>${l.length}</b> results${f.q ? ` for “${esc(f.q)}”` : ""}` : "No results";
    // pills
    const pills = [];
    f.types.forEach((v) => pills.push(["types", v, TYPE_LABEL[v]]));
    ["subjects", "levels", "langs", "avail"].forEach((g) => f[g].forEach((v) => pills.push([g, v, v])));
    if (f.y0 > 2015 || f.y1 < 2026) pills.push(["years", "", `${f.y0}–${f.y1}`]);
    if (f.chip) pills.push(["chip", f.chip, $(`[data-chip="${f.chip}"]`).textContent.trim()]);
    if (f.q) pills.push(["q", "", `“${f.q}”`]);
    $("[data-pills]").innerHTML = pills.map(([g, v, l2]) => `<button class="pill" type="button" data-pill="${g}" data-v="${esc(v)}" aria-label="Remove filter ${esc(l2)}">${esc(l2)}${icon("x")}</button>`).join("") + (pills.length > 1 ? `<button class="link" type="button" data-clear-all>Clear all</button>` : "");
    const n = pills.filter((p) => p[0] !== "q").length;
    $("[data-fcount]").textContent = n ? `(${n})` : "";
    // pager
    if (pages > 1) {
      $("[data-pager]").innerHTML = `<button class="btn btn-ghost" type="button" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>${icon("left")}Previous</button>${Array.from({ length: pages }, (_, i) => `<button class="pg${i + 1 === page ? " on" : ""}" type="button" aria-current="${i + 1 === page ? "page" : "false"}" data-page="${i + 1}">${i + 1}</button>`).join("")}<button class="btn btn-ghost" type="button" data-page="${page + 1}" ${page === pages ? "disabled" : ""}>Next${icon("right")}</button>`;
    } else $("[data-pager]").innerHTML = "";
  }
  function clearAll() { ["types", "subjects", "levels", "langs", "avail"].forEach((g) => f[g].clear()); f.chip = ""; f.q = ""; $("[data-q]").value = ""; $("[data-clear]").hidden = true; y0.value = 2015; y1.value = 2026; years(); $$("[data-g]").forEach((c) => { c.checked = false; }); syncChips(); page = 1; render(); }
  function syncChips() { $$("[data-chip]").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.chip === f.chip))); }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-clear-all]")) { clearAll(); return; }
    const p = e.target.closest("[data-pill]");
    if (p) { const g = p.dataset.pill, v = p.dataset.v; if (g === "years") { y0.value = 2015; y1.value = 2026; years(); } else if (g === "chip") { f.chip = ""; syncChips(); } else if (g === "q") { f.q = ""; $("[data-q]").value = ""; $("[data-clear]").hidden = true; } else { f[g].delete(v); const c = $(`[data-g="${g}"][value="${CSS.escape(v)}"]`); if (c) c.checked = false; } render(); return; }
    const pg = e.target.closest("[data-page]"); if (pg && !pg.disabled) { page = +pg.dataset.page; render(); $("#results").scrollIntoView({ behavior: "smooth" }); }
  });
  $("[data-sort]").addEventListener("change", (e) => { sort = e.target.value; page = 1; render(); });
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => { view = b.dataset.view; $$("[data-view]").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); }); render(); }));
  $$("[data-chip]").forEach((c) => c.addEventListener("click", () => { f.chip = f.chip === c.dataset.chip ? "" : c.dataset.chip; if (f.chip === "trending") { sort = "popular"; $("[data-sort]").value = "popular"; } syncChips(); page = 1; render(); }));
  $$("[data-chip-link]").forEach((a) => a.addEventListener("click", () => { const k = a.dataset.chipLink; if (k === "popular") { sort = "popular"; $("[data-sort]").value = "popular"; render(); } else if (k === "subject") { openFilters(); } else { f.chip = k; syncChips(); render(); } }));

  // ---------- search + suggestions ----------
  const q = $("[data-q]"), sugg = $("[data-sugg]");
  const POPULAR = ["machine learning", "behavioral economics", "statistics", "node.js", "psychology"];
  let searches = store.get("os-searches", ["algorithms", "climate"]);
  let active = -1;
  function suggest() {
    const v = q.value.trim().toLowerCase();
    const titleHits = v ? R.filter((r) => r.title.toLowerCase().includes(v) || r.author.toLowerCase().includes(v)).slice(0, 4).map((r) => ["title", r.title]) : [];
    const rec = searches.filter((s) => !v || s.includes(v)).slice(0, 3).map((s) => ["recent", s]);
    const pop = POPULAR.filter((s) => !v || s.includes(v)).slice(0, 3).map((s) => ["popular", s]);
    const items = [...titleHits, ...rec, ...pop];
    active = -1;
    sugg.innerHTML = items.length ? items.map(([k, s], i) => `<li role="option" id="sg-${i}" aria-selected="false" data-sug="${esc(s)}"><span class="sg-k">${k === "recent" ? icon("history") : k === "popular" ? icon("trend") : icon("search")}</span>${esc(s)}<small>${k === "title" ? "Resource" : k === "recent" ? "Recent" : "Popular"}</small></li>`).join("") : "";
    sugg.hidden = !items.length || document.activeElement !== q;
    q.setAttribute("aria-expanded", String(!sugg.hidden));
  }
  function doSearch(v) {
    f.q = v.trim(); q.value = f.q; $("[data-clear]").hidden = !f.q;
    if (f.q) { searches = [f.q.toLowerCase(), ...searches.filter((s) => s !== f.q.toLowerCase())].slice(0, 5); store.set("os-searches", searches); }
    sugg.hidden = true; q.setAttribute("aria-expanded", "false"); page = 1; render();
  }
  q.addEventListener("input", () => { $("[data-clear]").hidden = !q.value; suggest(); });
  q.addEventListener("focus", suggest);
  q.addEventListener("blur", () => setTimeout(() => { sugg.hidden = true; q.setAttribute("aria-expanded", "false"); }, 150));
  q.addEventListener("keydown", (e) => {
    const items = $$("[data-sug]", sugg);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { if (!items.length) return; e.preventDefault(); active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; items.forEach((li, i) => li.setAttribute("aria-selected", String(i === active))); q.setAttribute("aria-activedescendant", items[active].id); }
    if (e.key === "Enter" && active >= 0 && items[active]) { e.preventDefault(); doSearch(items[active].dataset.sug); }
    if (e.key === "Escape") { sugg.hidden = true; }
  });
  sugg.addEventListener("mousedown", (e) => { const li = e.target.closest("[data-sug]"); if (li) { e.preventDefault(); doSearch(li.dataset.sug); } });
  $("[data-search]").addEventListener("submit", (e) => { e.preventDefault(); doSearch(q.value); $("#results").scrollIntoView({ behavior: "smooth" }); });
  $("[data-clear]").addEventListener("click", () => { doSearch(""); q.focus(); });

  // ---------- actions ----------
  const dlg = $("[data-dlg]");
  function show(html) { $("[data-dlg-body]").innerHTML = html; if (!dlg.open) dlg.showModal(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  function view_(id) {
    const r = by(id), [tl, tc] = TYPES[r.type];
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, 6); store.set("os-recent", recent); renderRecent();
    const body = r.type === "video" || r.type === "podcast" ? `<div class="player">${window.Art.thumb(r)}<span class="play big">${icon("play")}</span></div><p class="fine">Preview player placeholder — streaming is not part of this demo.</p>`
      : r.type === "tutorial" ? `<ol class="mods">${Array.from({ length: Math.min(r.modules, 6) }, (_, i) => `<li class="${r.progress && i < Math.round((r.progress / 100) * r.modules) ? "done" : ""}">${icon("check")}Module ${i + 1}: ${["Setup", "Routing", "Controllers", "Validation", "Database", "Auth"][i]}</li>`).join("")}</ol>`
      : `<div class="reader"><p class="r-h">${r.type === "paper" ? "Abstract" : "Chapter 1"}</p><p>${r.type === "paper" ? `This ${r.subject.toLowerCase()} review synthesizes recent work, compares methods across benchmarks and outlines open problems for future research.` : `An approachable introduction to ${esc(r.title.toLowerCase())}, with worked examples, exercises and summaries at the end of every chapter.`}</p><p class="fine">Reader preview — full text is not included in this demo.</p></div>`;
    show(`<p class="kicker" style="color:${tc}">${tl} · ${esc(r.subject)} · ${r.level}</p><h2 id="dlg-title">${esc(r.title)}</h2><p class="by">${esc(r.author)} · ${r.year} · ${r.lang} · ${r.avail}</p>${body}`);
  }
  function cite(id) {
    const r = by(id);
    const apa = `${r.author} (${r.year}). ${r.title}. ${r.journal}.`;
    const mla = `${r.author.split(",")[0]}, et al. "${r.title}." ${r.journal}, ${r.year}.`;
    show(`<p class="kicker">Cite this paper</p><h2 id="dlg-title">${esc(r.title)}</h2><div class="cites"><div><b>APA</b><p data-cite-text>${esc(apa)}</p><button class="btn btn-ghost btn-sm" type="button" data-copy="${esc(apa)}">Copy</button></div><div><b>MLA</b><p>${esc(mla)}</p><button class="btn btn-ghost btn-sm" type="button" data-copy="${esc(mla)}">Copy</button></div></div>`);
  }
  async function copy(t, msg) { try { await navigator.clipboard.writeText(t); say(msg); } catch { say(`Copy this: ${t}`); } }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]"); if (o) { view_(+o.dataset.open); return; }
    const c = e.target.closest("[data-cite]"); if (c) { cite(+c.dataset.cite); return; }
    const cp = e.target.closest("[data-copy]"); if (cp) { copy(cp.dataset.copy, "Citation copied."); return; }
    const s = e.target.closest("[data-save]");
    if (s) { const id = +s.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id); store.set("os-saved", [...saved]); render(); renderRL(); say(saved.has(id) ? "Saved to your reading list." : "Removed from your reading list."); return; }
    const sh = e.target.closest("[data-share]"); if (sh) { copy(`${location.href.split("#")[0]}#resource-${sh.dataset.share}`, "Link copied."); return; }
    const so = e.target.closest("[data-soon]"); if (so) { e.preventDefault(); say(`${so.dataset.soon} lives on the full site; this demo is the catalog page.`); }
  });

  // ---------- reading list, collections, recent ----------
  function renderRL() {
    const n = BASE_SAVED + saved.size;
    $$("[data-rl-count]").forEach((b) => { b.textContent = n; });
    const last = [...saved].slice(-3).reverse().map(by);
    $("[data-rl]").innerHTML = last.map((r) => `<li><button type="button" class="rl-item" data-open="${r.id}"><span class="rl-th">${window.Art.thumb(r)}</span><span><b>${esc(r.title)}</b><small>${TYPES[r.type][0]} · ${esc(r.author)}</small></span></button></li>`).join("") || `<li class="fine">Bookmark resources to build your list.</li>`;
  }
  const COLS = [["Machine Learning Essentials", 28, "Dr. Liu", [11, 31, 2, 4]], ["Startup Founder Reading List", 15, "OpenShelf Team", [31, 26, 18, 9]], ["Data Science with Python", 22, "Prof. Carter", [25, 10, 6, 15]]];
  $("[data-cols]").innerHTML = COLS.map(([n, c, by2, ids]) => `<button class="col" type="button" data-col="${esc(n)}"><span class="mosaic">${ids.map((i) => `<span>${window.Art.thumb(by(i))}</span>`).join("")}</span><b>${n}</b><small>${c} resources · by ${by2}</small></button>`).join("");
  $("[data-cols]").addEventListener("click", (e) => { const b = e.target.closest("[data-col]"); if (!b) return; const n = b.dataset.col; doSearch(/Machine/.test(n) ? "learning" : /Startup/.test(n) ? "entrepreneurship" : "python"); $("#results").scrollIntoView({ behavior: "smooth" }); say(`Showing sample resources from “${n}”.`); });
  function renderRecent() {
    $("[data-recent]").innerHTML = recent.map(by).map((r) => `<li><button type="button" class="rv" data-open="${r.id}"><span class="rv-th">${window.Art.thumb(r)}</span><span class="rv-t">${icon(TYPES[r.type][2])}<span>${esc(r.title)}</span></span></button></li>`).join("");
    $("[data-recent-empty]").hidden = recent.length > 0;
  }
  $("[data-clear-history]").addEventListener("click", () => { recent = []; store.set("os-recent", recent); renderRecent(); });

  // ---------- filters drawer ----------
  const fl = $("[data-filters]"), scrim = $("[data-scrim]");
  function openFilters() { fl.classList.add("open"); scrim.hidden = false; document.body.style.overflow = "hidden"; fl.querySelector("input").focus(); }
  function closeFilters() { fl.classList.remove("open"); scrim.hidden = true; document.body.style.overflow = ""; }
  $("[data-filters-open]").addEventListener("click", openFilters);
  $$("[data-filters-close]").forEach((b) => b.addEventListener("click", closeFilters));
  scrim.addEventListener("click", closeFilters);
  addEventListener("keydown", (e) => { if (e.key === "Escape" && fl.classList.contains("open")) closeFilters(); });

  // ---------- newsletter, toast, sticky search ----------
  $("[data-news]").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#news-email").value.trim(), m = $("[data-news-msg]"); m.textContent = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Subscribed — first picks arrive Monday. (Demo)" : "Please enter a valid email."; });
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2800); }
  const sw = $("[data-search-wrap]"), ph = document.createElement("div"); ph.className = "search-ph";
  addEventListener("scroll", () => { if (innerWidth > 760) { sw.classList.remove("stuck"); return; } const stuck = $(".hero").getBoundingClientRect().bottom < 80; sw.classList.toggle("stuck", stuck); }, { passive: true });

  render(); renderRL(); renderRecent();
  window.MuseShelf = { count: () => list().length, page: () => page, view: () => view, saved: () => saved.size, recent: () => recent.slice() };
})();
