(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const usd = (n) => "$" + n.toLocaleString("en-US");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  /* World map dot pattern (stylized continents) */
  const blobs = [[200, 150, 120, 80], [260, 300, 60, 100], [490, 130, 70, 50], [520, 260, 70, 110], [680, 150, 160, 80], [800, 330, 60, 40], [610, 230, 40, 30]];
  let dots = "";
  for (let x = 10; x < 1000; x += 14) for (let y = 10; y < 480; y += 14) if (blobs.some(([cx, cy, rx, ry]) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1)) dots += `<circle cx="${x}" cy="${y}" r="2.4" fill="#93C5FD"/>`;
  $("#worldmap").innerHTML = dots;

  /* Live counter */
  let live = 47;
  if (!reduced) setInterval(() => { if (Math.random() < 0.3) { live++; $("#liveCount").textContent = live; } }, 9000);

  /* Flash deals with countdowns */
  const now = Date.now();
  const flash = [
    ["New York → Barcelona", "plane", "Round-trip from", 289, 649, 55, 4 * 3600 + 23 * 60 + 11, "barcelona"],
    ["5 Nights in Bali — All-Inclusive", "hotel", "From", 599, 1299, 54, 8 * 3600 + 5 * 60 + 33, "bali", "/person"],
    ["London → Tokyo", "plane", "Round-trip from", 412, 890, 53, 2 * 3600 + 47 * 60 + 9, "tokyo"],
    ["Caribbean Cruise — 7 Nights", "ship", "From", 749, 1599, 53, 11 * 3600 + 30 * 60 + 22, "cruise", "/person"],
  ].map(([t, ic, lab, p, was, save, secs, scene, unit]) => ({ t, ic, lab, p, was, save, end: now + secs * 1000, scene, unit: unit || "" }));
  $("#fTrack").innerHTML = flash.map((f, i) => `<article class="fd" data-i="${i}">${f.end - now < 3 * 3600e3 ? '<span class="gone">Almost gone!</span>' : ""}
    <div class="fd-top"><span class="fd-ic">${icon(f.ic)}</span><span class="save">Save ${f.save}%</span></div>
    <h3>${f.t}</h3><p class="price">${f.lab} <strong>${usd(f.p)}</strong>${f.unit} <s>${usd(f.was)}</s></p>
    <p class="cd">${icon("clock")}Ends in <b class="mono" data-cd="${i}">--</b></p>
    <button class="btn btn-orange btn-block" type="button" data-flash="${i}">Book Now</button></article>`).join("");
  const pad = (n) => String(n).padStart(2, "0");
  const fmtLeft = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(s / 3600)}h ${pad(Math.floor((s % 3600) / 60))}m ${pad(s % 60)}s`; };
  function tick() {
    const t = Date.now();
    flash.forEach((f, i) => {
      const b = $(`[data-cd="${i}"]`); b.textContent = fmtLeft(f.end - t);
      b.classList.remove("tick"); void b.offsetWidth; if (!reduced) b.classList.add("tick");
      if (f.end <= t) { $(`.fd[data-i="${i}"]`).classList.add("expired"); $(`[data-flash="${i}"]`).disabled = true; $(`[data-flash="${i}"]`).textContent = "Expired"; }
    });
    const next = Math.min(...flash.map((f) => f.end).filter((e) => e > t));
    const s = Number.isFinite(next) ? Math.floor((next - t) / 1000) : 0;
    $("#master").textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  }
  tick(); setInterval(tick, 1000);
  const track = $("#fTrack"), cards = $$(".fd", track);
  $("#fDots").innerHTML = cards.map((_, i) => `<button type="button" aria-label="Show flash deal ${i + 1}" data-i="${i}"></button>`).join("");
  const step = () => cards[0].getBoundingClientRect().width + 20;
  const idx = () => Math.round(track.scrollLeft / step());
  const go = (i) => track.scrollTo({ left: Math.max(0, i) * step(), behavior: reduced ? "auto" : "smooth" });
  const syncDots = () => $$("#fDots button").forEach((b, j) => b.setAttribute("aria-current", j === idx()));
  track.addEventListener("scroll", () => requestAnimationFrame(syncDots), { passive: true });
  $("#fDots").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go(+b.dataset.i); });
  const atEnd = () => track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  $("#fPrev").addEventListener("click", () => go(idx() - 1));
  $("#fNext").addEventListener("click", () => (atEnd() ? go(0) : go(idx() + 1)));
  syncDots();
  // Auto-scroll on desktop; pauses on hover/focus.
  let paused = false;
  track.addEventListener("mouseenter", () => (paused = true)); track.addEventListener("mouseleave", () => (paused = false));
  track.addEventListener("focusin", () => (paused = true)); track.addEventListener("focusout", () => (paused = false));
  if (!reduced) setInterval(() => { if (!paused && window.matchMedia("(min-width: 721px)").matches && track.scrollWidth > track.clientWidth + 4) atEnd() ? go(0) : go(idx() + 1); }, 5000);

  /* Deals data */
  const deals = [
    { d: "Santorini, Greece", type: "Packages", label: "Flight + Hotel", region: "Europe", nights: 5, inc: "Breakfast included", p: 899, was: 1840, r: 4.7, rv: 1203, when: "next", dep: 18, urg: "Only 3 left at this price", scene: "santorini" },
    { d: "Cancún, Mexico", type: "Hotels", label: "All-Inclusive Resort", region: "Americas", nights: 7, inc: "All meals & drinks", p: 1149, was: 2100, r: 4.6, rv: 2410, when: "this", dep: 9, fast: true, scene: "cancun" },
    { d: "Kyoto, Japan", type: "Packages", label: "Flight + Ryokan Stay", region: "Asia", nights: 6, inc: "Kaiseki dinner included", p: 1299, was: 2450, r: 4.9, rv: 876, when: "next", dep: 24, urg: "Only 5 left at this price", scene: "kyoto" },
    { d: "Amalfi Coast, Italy", type: "Hotels", label: "Boutique Hotel", region: "Europe", nights: 4, inc: "Sea-view room", p: 679, was: 1200, r: 4.8, rv: 642, when: "this", dep: 12, fast: true, scene: "amalfi" },
    { d: "Maldives", type: "Hotels", label: "Overwater Villa", region: "Asia", nights: 5, inc: "Half board & seaplane", p: 2199, was: 4500, r: 4.9, rv: 512, when: "flex", dep: 40, urg: "Only 2 left at this price", scene: "maldives" },
    { d: "Reykjavik, Iceland", type: "Packages", label: "Flight + Northern Lights Tour", region: "Europe", nights: 4, inc: "Aurora tour included", p: 799, was: 1500, r: 4.7, rv: 931, when: "next", dep: 21, fast: true, scene: "iceland" },
    { d: "Marrakech, Morocco", type: "Packages", label: "Riad + Desert Tour", region: "Africa", nights: 5, inc: "Breakfast & camel trek", p: 549, was: 980, r: 4.6, rv: 1088, when: "this", dep: 6, urg: "Only 4 left at this price", scene: "marrakech" },
    { d: "Phuket, Thailand", type: "Hotels", label: "Beachfront Resort", region: "Asia", nights: 7, inc: "Breakfast included", p: 699, was: 1350, r: 4.5, rv: 1764, when: "flex", dep: 33, fast: true, scene: "phuket" },
    { d: "Barcelona, Spain", type: "Flights", label: "Flight Only", region: "Europe", nights: 0, inc: "Round-trip, 1 checked bag", p: 289, was: 649, r: 4.6, rv: 3120, when: "this", dep: 4, urg: "Only 6 left at this price", scene: "barcelona" },
    { d: "Tokyo, Japan", type: "Flights", label: "Flight Only", region: "Asia", nights: 0, inc: "Round-trip from London", p: 412, was: 890, r: 4.7, rv: 1544, when: "next", dep: 15, fast: true, scene: "tokyo" },
    { d: "Caribbean Cruise", type: "Cruises", label: "Cruise", region: "Caribbean", nights: 7, inc: "All meals, 4 island stops", p: 749, was: 1599, r: 4.5, rv: 2205, when: "next", dep: 27, urg: "Only 8 cabins left", scene: "cruise" },
    { d: "Bali, Indonesia", type: "Packages", label: "Flight + Hotel", region: "Asia", nights: 5, inc: "All-inclusive", p: 599, was: 1299, r: 4.8, rv: 1987, when: "this", dep: 10, fast: true, scene: "bali" },
    // Revealed by "Load More"
    { d: "Lisbon, Portugal", type: "Packages", label: "City Break", region: "Europe", nights: 4, inc: "Flight + central hotel", p: 449, was: 725, r: 4.7, rv: 860, when: "next", dep: 19, fast: true, scene: "lisbon", pt: true },
    { d: "Algarve, Portugal", type: "Hotels", label: "Beach Escape", region: "Europe", nights: 6, inc: "Ocean-view room", p: 599, was: 1035, r: 4.6, rv: 702, when: "flex", dep: 36, urg: "Only 4 left at this price", scene: "algarve", pt: true },
    { d: "Porto, Portugal", type: "Packages", label: "Wine Country", region: "Europe", nights: 3, inc: "Douro tasting tour", p: 379, was: 585, r: 4.8, rv: 455, when: "this", dep: 8, fast: true, scene: "porto", pt: true },
    { d: "Athens, Greece", type: "Packages", label: "Weekend Getaway", region: "Europe", nights: 3, inc: "Acropolis skip-the-line", p: 329, was: 560, r: 4.5, rv: 640, when: "next", dep: 14, fast: true, scene: "athens" },
    { d: "Sri Lanka", type: "Packages", label: "Beach & Culture", region: "Asia", nights: 8, inc: "Private driver", p: 649, was: 1180, r: 4.7, rv: 388, when: "flex", dep: 45, urg: "Only 3 left at this price", scene: "srilanka" },
    { d: "Paris, France", type: "Flights", label: "Flight Only", region: "Europe", nights: 0, inc: "Direct, one-way", p: 199, was: 389, r: 4.4, rv: 2875, when: "this", dep: 3, fast: true, scene: "paris" },
  ].map((x, i) => ({ ...x, id: i, save: Math.round((1 - x.p / x.was) * 100) }));

  /* Filters */
  const groups = [
    ["type", "Deal Type", ["Flights", "Hotels", "Packages", "Cruises"]],
    ["region", "Destination", ["Europe", "Asia", "Caribbean", "Americas", "Africa"]],
    ["budget", "Budget", ["Under $300", "$300–$700", "$700–$1500", "$1500+"]],
    ["when", "Travel Dates", ["This Month", "Next Month", "Flexible"]],
  ];
  const whenKey = { "This Month": "this", "Next Month": "next", Flexible: "flex" };
  const budgetOk = (p, b) => ({ "Under $300": p < 300, "$300–$700": p >= 300 && p <= 700, "$700–$1500": p > 700 && p <= 1500, "$1500+": p > 1500 }[b]);
  let F = { type: new Set(), region: new Set(), budget: new Set(), when: new Set() };
  let shown = 12, sortBy = "best";
  const pass = (x, skip) => (skip === "type" || !F.type.size || F.type.has(x.type)) && (skip === "region" || !F.region.size || F.region.has(x.region))
    && (skip === "budget" || !F.budget.size || [...F.budget].some((b) => budgetOk(x.p, b))) && (skip === "when" || !F.when.size || [...F.when].some((w) => whenKey[w] === x.when));
  $("#fbGroups").innerHTML = groups.map(([k, l, opts]) => `<div class="fg" data-g="${k}"><button type="button" class="fg-btn" aria-expanded="false" aria-controls="m-${k}">${l} <span class="fg-n" hidden></span>${icon("chev-down")}</button>
    <div class="menu" id="m-${k}" hidden>${opts.map((o) => `<label class="opt"><input type="checkbox" data-g="${k}" value="${o}"><span class="box">${icon("check")}</span>${o}<small data-c="${k}|${o}"></small></label>`).join("")}</div></div>`).join("");
  $("#fbGroups").addEventListener("click", (e) => {
    const b = e.target.closest(".fg-btn");
    if (!b) return;
    const m = b.nextElementSibling, open = m.hidden;
    $$(".menu").forEach((x) => { x.hidden = true; x.previousElementSibling.setAttribute("aria-expanded", "false"); });
    m.hidden = !open; b.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".fg") && window.matchMedia("(min-width: 721px)").matches) $$(".menu").forEach((x) => { x.hidden = true; x.previousElementSibling.setAttribute("aria-expanded", "false"); }); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") $$(".menu").forEach((x) => { x.hidden = true; x.previousElementSibling.setAttribute("aria-expanded", "false"); }); });
  $("#fbGroups").addEventListener("change", (e) => { const c = e.target; if (!c.dataset.g) return; c.checked ? F[c.dataset.g].add(c.value) : F[c.dataset.g].delete(c.value); update(); });
  $("#sort").addEventListener("change", (e) => { sortBy = e.target.value; update(true); });
  $("#fbToggle").addEventListener("click", (e) => { const open = !$("#fbGroups").classList.contains("open"); $("#fbGroups").classList.toggle("open", open); e.currentTarget.setAttribute("aria-expanded", open); if (open) $$(".menu").forEach((m) => { m.hidden = false; m.previousElementSibling.setAttribute("aria-expanded", "true"); }); });
  $("#mFilter").addEventListener("click", () => { $("#fbar").scrollIntoView({ block: "start" }); const t = $("#fbToggle"); if (t.getAttribute("aria-expanded") !== "true") t.click(); });
  const reset = () => { F = { type: new Set(), region: new Set(), budget: new Set(), when: new Set() }; $$("#fbGroups input").forEach((c) => (c.checked = false)); update(); };
  $("#emptyReset").addEventListener("click", reset);
  $("#chips").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; F[c.dataset.g].delete(c.dataset.v); $(`#fbGroups input[data-g="${c.dataset.g}"][value="${CSS.escape(c.dataset.v)}"]`).checked = false; update(); });

  const sorters = { best: (a, b) => a.id - b.id, price: (a, b) => a.p - b.p, save: (a, b) => b.save - a.save || (b.was - b.p) - (a.was - a.p), soon: (a, b) => a.dep - b.dep };
  const wish = new Set();
  function card(x) {
    const det = x.nights ? `${x.nights} nights • 2 adults • ${x.inc}` : `2 adults • ${x.inc}`;
    return `<article class="deal"><div class="d-img"><div data-scene="${x.scene}"></div><span class="d-save">Save ${x.save}%</span>
      <button type="button" class="heart" data-id="${x.id}" aria-pressed="${wish.has(x.id)}" aria-label="Save ${x.d}">${icon("heart")}</button><span class="d-type">${x.label}</span></div>
      <div class="d-b"><h3>${x.d}</h3><p class="det">${det}</p><p class="rate">${icon("star")}${x.r.toFixed(1)} <small>(${x.rv.toLocaleString()} reviews)</small></p>
        <div class="pr"><s>${usd(x.was)}</s><strong>${usd(x.p)}</strong><span>/person</span></div>
        <p class="tsave">Total savings: ${usd(x.was - x.p)}</p>
        ${x.urg ? `<p class="urg">${icon("clock")}${x.urg}</p>` : `<p class="urg fast">${icon("flame")}Selling fast</p>`}
        <button class="btn btn-orange btn-block" type="button" data-view="${x.id}">View Deal</button></div></article>`;
  }
  function update(keep) {
    if (!keep) shown = 12;
    const list = deals.filter((x) => pass(x)).sort(sorters[sortBy]);
    $("#grid").innerHTML = list.slice(0, shown).map(card).join("");
    window.__renderScenes($("#grid"));
    $("#empty").hidden = list.length > 0;
    $(".more").hidden = shown >= list.length;
    $("#found").textContent = list.length; $("#mbarN").textContent = list.length;
    $$("[data-c]").forEach((s) => { const [g, v] = s.dataset.c.split("|"); s.textContent = deals.filter((x) => pass(x, g) && (g === "type" ? x.type === v : g === "region" ? x.region === v : g === "budget" ? budgetOk(x.p, v) : x.when === whenKey[v])).length; });
    $$(".fg").forEach((g) => { const n = F[g.dataset.g].size, b = g.querySelector(".fg-btn"); b.classList.toggle("active", n > 0); const s = b.querySelector(".fg-n"); s.hidden = !n; s.textContent = n; });
    const total = Object.values(F).reduce((s, x) => s + x.size, 0);
    $("#fbN").hidden = !total; $("#fbN").textContent = total;
    $("#chips").innerHTML = Object.entries(F).flatMap(([g, set]) => [...set].map((v) => `<button type="button" class="chip" data-g="${g}" data-v="${v}" aria-label="Remove ${v}">${v}${icon("x")}</button>`)).join("");
  }
  $("#loadMore").addEventListener("click", () => { shown += 6; update(true); });
  $("#grid").addEventListener("click", (e) => {
    const h = e.target.closest(".heart");
    if (h) { const id = +h.dataset.id; wish.has(id) ? wish.delete(id) : wish.add(id); h.setAttribute("aria-pressed", wish.has(id)); toast(wish.has(id) ? `${deals[id].d} saved` : `${deals[id].d} removed`); return; }
    const v = e.target.closest("[data-view]");
    if (v) openDeal(deals[+v.dataset.view]);
  });
  $$(".tcard[data-type]").forEach((t) => t.addEventListener("click", () => { reset(); F.type.add(t.dataset.type); $(`#fbGroups input[data-g="type"][value="${t.dataset.type}"]`).checked = true; update(); $("#deals").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }));
  update();

  /* Quick search */
  $("#qs").addEventListener("submit", (e) => {
    e.preventDefault();
    reset();
    const to = $("#qTo").value.trim().toLowerCase();
    const region = groups[1][2].find((r) => r.toLowerCase() === to);
    if (region) { F.region.add(region); $(`#fbGroups input[data-g="region"][value="${region}"]`).checked = true; }
    const w = { this: "This Month", next: "Next Month" }[$("#qDates").value];
    if (w) { F.when.add(w); $(`#fbGroups input[data-g="when"][value="${w}"]`).checked = true; }
    update();
    const match = !region && to && to !== "anywhere" ? deals.filter((x) => x.d.toLowerCase().includes(to)) : null;
    toast(match ? (match.length ? `${match.length} deal${match.length > 1 ? "s" : ""} for “${$("#qTo").value}” — see below` : `No deals to “${$("#qTo").value}” right now — showing all deals`) : `Showing ${$("#found").textContent} deals from ${$("#qFrom").value.trim() || "your city"} for ${$("#qPax").value} traveler(s)`);
    $("#deals").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* Portugal spotlight */
  const pt = deals.filter((x) => x.pt);
  const ptNames = { "Lisbon, Portugal": "Lisbon City Break", "Algarve, Portugal": "Algarve Beach Escape", "Porto, Portugal": "Porto Wine Country" };
  $("#spList").innerHTML = pt.map((x) => `<article class="sp"><span class="sp-img">${window.__scene(x.scene)}</span><div><h3>${ptNames[x.d]}</h3><p>${x.nights} nights from <strong>${usd(x.p)}</strong></p><span class="sp-off">${x.save}% off</span></div><button class="btn btn-outline btn-sm" type="button" data-view="${x.id}">View</button></article>`).join("");
  $("#spList").addEventListener("click", (e) => { const v = e.target.closest("[data-view]"); if (v) openDeal(deals[+v.dataset.view]); });
  $("#allPortugal").addEventListener("click", (e) => { e.preventDefault(); reset(); shown = deals.length; F.region.add("Europe"); $('#fbGroups input[data-g="region"][value="Europe"]').checked = true; update(true); $("#deals").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); toast("Showing European deals, including all Portugal offers"); });

  /* Deal modal + recently viewed */
  const recent = [deals[0], deals[4], deals[6], deals[2]];
  function renderRecent() { $("#recent").innerHTML = recent.map((x) => `<button type="button" class="rv" data-id="${x.id}"><span class="rv-img">${window.__scene(x.scene)}</span><span><strong>${x.d}</strong><small>from <b>${usd(x.p)}</b> · ${x.save}% off</small></span></button>`).join(""); }
  $("#recent").addEventListener("click", (e) => { const b = e.target.closest(".rv"); if (b) openDeal(deals[+b.dataset.id]); });
  renderRecent();
  const dlg = $("#dealDlg");
  function openDeal(x) {
    $("#dlgBody").innerHTML = `<div class="dl-img">${window.__scene(x.scene)}<button class="dl-close" type="button" id="dlClose" aria-label="Close">${icon("x")}</button></div>
      <div class="dl-b"><span class="d-save" style="position:static;width:fit-content">Save ${x.save}%</span><h2 id="dlgTitle">${x.d}</h2><p class="det">${x.label}${x.nights ? ` · ${x.nights} nights` : ""} · departs in ${x.dep} days</p>
        <ul class="dl-inc"><li>${icon("check")}${x.inc}</li><li>${icon("check")}Free cancellation within 24 hours</li><li>${icon("check")}Best Price Guarantee</li></ul>
        <div class="dl-sum"><div><span>2 travelers · was ${usd(x.was * 2)}</span><strong>${usd(x.p * 2)}</strong></div><div style="text-align:right"><span>You save</span><strong style="color:#16A34A;font-size:20px">${usd((x.was - x.p) * 2)}</strong></div></div>
        <button class="btn btn-orange btn-block" type="button" id="dlBook">Book This Deal</button><p class="fine">Demo checkout — nothing is booked or charged.</p></div>`;
    dlg.showModal();
    $("#dlClose").addEventListener("click", () => dlg.close());
    $("#dlBook").addEventListener("click", () => { dlg.close(); toast(`${x.d} held for 15 minutes — demo booking only.`); });
    const i = recent.indexOf(x); if (i >= 0) recent.splice(i, 1);
    recent.unshift(x); recent.length = Math.min(recent.length, 6); renderRecent();
  }
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#fTrack").addEventListener("click", (e) => {
    const b = e.target.closest("[data-flash]");
    if (!b) return;
    const f = flash[+b.dataset.flash];
    const match = deals.find((x) => f.t.includes(x.d.split(",")[0]) || (f.scene === x.scene));
    if (match) openDeal(match); else toast(`${f.t} — demo booking only.`);
  });
  $$("[data-rec]").forEach((b) => b.addEventListener("click", () => { const n = b.dataset.rec; const x = deals.find((d) => n.includes(d.d.split(",")[0].split(" ")[0])); x ? openDeal(x) : toast(n); }));

  /* Price alert */
  $("#alForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = $("#aDest").value.trim(), m = +$("#aMax").value, em = $("#aEmail").value.trim(), msg = $("#alMsg");
    msg.className = "al-msg err";
    if (!d) msg.textContent = "Where would you like to go?";
    else if (!m || m < 50) msg.textContent = "Set a target price of at least $50.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) msg.textContent = "Enter a valid email address.";
    else { msg.className = "al-msg ok"; msg.textContent = `Alert set: we'll email ${em} when ${d} drops below ${usd(m)} (demo).`; e.target.reset(); }
  });
  /* Newsletter */
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nEmail").value.trim();
    $("#newsMsg").textContent = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "You're subscribed — early access starts with the next drop (demo)." : "Please enter a valid email address.";
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) $("#nEmail").value = "";
  });
})();
