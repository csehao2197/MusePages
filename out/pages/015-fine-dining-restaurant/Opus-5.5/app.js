(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2800); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $("[data-art=portrait]").innerHTML = Art.portrait();
  $("[data-art=private]").innerHTML = Art.privateRoom();
  $("[data-art=map]").innerHTML = Art.map();

  /* Nav + overlay */
  const nav = $("[data-nav]"), burger = $("[data-burger]"), ov = $("#overlay");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > 60);
  const openOv = (open) => { ov.hidden = !open; burger.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-ov-close]").focus(); else burger.focus({ preventScroll: true }); };
  burger.addEventListener("click", () => openOv(true));
  $("[data-ov-close]").addEventListener("click", () => openOv(false));
  $$("#overlay nav a").forEach((a) => a.addEventListener("click", () => { ov.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ov.hidden) openOv(false); });

  /* Tasting menu */
  const menus = {
    std: [
      ["Amuse-Bouche", "Potato Velouté, Truffle Foam, Chive Oil"],
      ["First Course", "Hokkaido Scallop, Cauliflower Purée, Golden Raisin, Brown Butter", "2024 Chablis Premier Cru, Domaine Raveneau"],
      ["Second Course", "Roasted Beet Tartare, Goat Cheese Mousse, Walnut, Aged Balsamic", "2023 Sancerre Rosé, Domaine Vacheron"],
      ["Fish Course", "Wild Turbot, Fennel, Saffron Broth, Sea Beans", "2022 Meursault, Domaine Roulot"],
      ["Main Course", "Dry-Aged Duck Breast, Roasted Fig, Parsnip, Jus Gras", "2021 Chambolle-Musigny, Domaine Roumier"],
      ["Pre-Dessert", "Yuzu Sorbet, Champagne Granita, Mint"],
      ["Dessert", "Dark Chocolate Soufflé, Crème Fraîche, Smoked Salt Caramel", "2020 Banyuls, Domaine de la Rectorie"],
    ],
    veg: [
      ["Amuse-Bouche", "Potato Velouté, Truffle Foam, Chive Oil"],
      ["First Course", "Roasted Cauliflower, Golden Raisin, Brown Butter, Capers", "2024 Chablis Premier Cru, Domaine Raveneau"],
      ["Second Course", "Roasted Beet Tartare, Goat Cheese Mousse, Walnut, Aged Balsamic", "2023 Sancerre Rosé, Domaine Vacheron"],
      ["Garden Course", "Charred Leek, Fennel, Saffron Broth, Sea Beans", "2022 Meursault, Domaine Roulot"],
      ["Main Course", "Wild Mushroom Wellington, Roasted Fig, Parsnip, Madeira Jus", "2021 Chambolle-Musigny, Domaine Roumier"],
      ["Pre-Dessert", "Yuzu Sorbet, Champagne Granita, Mint"],
      ["Dessert", "Dark Chocolate Soufflé, Crème Fraîche, Smoked Salt Caramel", "2020 Banyuls, Domaine de la Rectorie"],
    ],
  };
  const list = $("[data-courses]"), pairBtn = $("[data-pairings]"), vegBtn = $("[data-veg]");
  const renderMenu = () => {
    const veg = vegBtn.getAttribute("aria-pressed") === "true";
    list.innerHTML = menus[veg ? "veg" : "std"].map(([k, d, w], i) => `<li class="course" style="animation-delay:${i * 50}ms"><p class="course-k">${k}</p><p class="course-d">${d}</p>${w ? `<p class="pairing">${icon("wine")}${w}</p>` : ""}</li>`).join("");
  };
  pairBtn.addEventListener("click", () => { const on = pairBtn.getAttribute("aria-pressed") !== "true"; pairBtn.setAttribute("aria-pressed", String(on)); list.classList.toggle("no-pairings", !on); });
  vegBtn.addEventListener("click", () => { vegBtn.setAttribute("aria-pressed", String(vegBtn.getAttribute("aria-pressed") !== "true")); list.classList.add("anim"); renderMenu(); });
  renderMenu();

  /* Gallery with parallax */
  const gal = $("[data-gallery]");
  gal.innerHTML = ["dish", "room", "chef", "wine", "raw", "table"].map((n) => `<figure class="gi" tabindex="0"><span class="gi-inner">${Art.scene(n)}</span><figcaption>${Art.galLabels[n]}</figcaption></figure>`).join("");
  const inners = $$(".gi-inner", gal);
  let ticking = false;
  function parallax() {
    syncNav();
    if (reduced || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      inners.forEach((el, i) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(p * (i % 2 ? 36 : 24)).toFixed(1)}px, 0) scale(1.12)`;
      });
      ticking = false;
    });
  }
  window.addEventListener("scroll", parallax, { passive: true });
  parallax();

  /* Bottles + wine list */
  const bottles = [["2021 Barolo", "Giacomo Conterno", "Barolo", "#3A1418", 145], ["2022 Pouilly-Fumé", "Didier Dagueneau", "Silex", "#B9B07A", 110], ["2020 Châteauneuf-du-Pape", "Château Rayas", "Rayas", "#2A1214", 280], ["NV Champagne", "Krug Grande Cuvée", "Krug", "#2A3A2A", 320]];
  $("[data-bottles]").innerHTML = bottles.map(([v, p, c, col, $p]) => `<article class="bottle"><div class="b-art">${Art.bottle(p, c, col)}</div><h3>${v}</h3><p>${p}</p><b>$${$p}</b></article>`).join("");
  const wines = [
    ["Sparkling", "NV Champagne, Krug Grande Cuvée", "Reims, France", 320], ["Sparkling", "2015 Champagne, Bérêche Le Cran", "Montagne de Reims", 190], ["Sparkling", "NV Crémant du Jura, Tissot", "Jura · biodynamic", 72],
    ["White", "2022 Pouilly-Fumé, Didier Dagueneau", "Loire", 110], ["White", "2022 Meursault, Domaine Roulot", "Burgundy", 240], ["White", "2024 Chablis 1er Cru, Domaine Raveneau", "Burgundy", 210], ["White", "2023 Savagnin, Ganevat", "Jura · natural", 135],
    ["Red", "2021 Barolo, Giacomo Conterno", "Piedmont", 145], ["Red", "2020 Châteauneuf-du-Pape, Château Rayas", "Rhône", 280], ["Red", "2021 Chambolle-Musigny, Domaine Roumier", "Burgundy", 260], ["Red", "2022 Poulsard, Overnoy", "Jura · natural", 160],
    ["Sweet", "2020 Banyuls, Domaine de la Rectorie", "Roussillon", 88], ["Sweet", "2017 Sauternes, Château Climens", "Bordeaux", 175],
  ];
  const wl = $("[data-wl]"), wf = $("[data-wl-filter]");
  const cats = ["All", "Sparkling", "White", "Red", "Sweet"];
  wf.innerHTML = cats.map((c, i) => `<button type="button" aria-pressed="${i === 0}">${c}</button>`).join("");
  const renderWl = (c) => { wl.innerHTML = wines.filter((w) => c === "All" || w[0] === c).map(([, n, r, p]) => `<li><b>${n}</b><span>${r}</span><em>$${p}</em></li>`).join(""); };
  $$("button", wf).forEach((b) => b.addEventListener("click", () => { $$("button", wf).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderWl(b.textContent); }));
  renderWl("All");
  $("[data-winelist]").addEventListener("click", () => $('[data-modal="wine"]').showModal());

  /* Dialogs */
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  const pd = $('[data-modal="private"]'), pf = $("form", pd);
  const min7 = new Date(); min7.setDate(min7.getDate() + 7); $("[data-min7]").min = iso(min7);
  const est = () => { const g = Math.max(8, Math.min(24, +pf.guests.value || 8)); $("[data-pd-est]").textContent = `Estimated from $${(150 * g).toLocaleString("en-US")} for ${g} guests`; };
  pf.guests.addEventListener("input", est);
  function openPrivate(guests) {
    pf.reset(); pf.hidden = false; $(".m-done", pd).hidden = true; $("[data-err]", pd).textContent = ""; $$("[aria-invalid]", pf).forEach((x) => x.removeAttribute("aria-invalid"));
    if (guests) pf.guests.value = guests;
    est(); pd.showModal();
  }
  $$("[data-open=private]").forEach((b) => b.addEventListener("click", () => openPrivate()));
  pf.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input, select", pf).forEach((x) => { const bad = !x.checkValidity(); x.toggleAttribute("aria-invalid", bad); if (bad && !first) first = x; });
    $("[data-err]", pd).textContent = first ? (first.name === "guests" ? "Private dining seats 8 to 24 guests." : "Please complete the highlighted fields.") : "";
    if (first) { first.focus(); return; }
    $("[data-done]", pd).textContent = `Our events director will reply to ${pf.email.value} within one business day about your ${pf.type.value.toLowerCase()} for ${pf.guests.value} on ${new Date(`${pf.date.value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}. (Demo — nothing was sent.)`;
    pf.hidden = true; $(".m-done", pd).hidden = false;
  });

  /* Reservation widget */
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const first = new Date(today.getFullYear(), today.getMonth(), 1), last = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  let view = new Date(first), picked = null;
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0) % 100; };
  const availability = (d) => { const k = iso(d), a = hash(`${k}-530`), b = hash(`${k}-830`); return { "5:30 PM": a < 18 ? "full" : a < 40 ? "few" : "open", "8:30 PM": b < 12 ? "full" : b < 35 ? "few" : "open" }; };
  const open = (d) => d >= today && ![1, 2].includes(d.getDay());
  const grid = $("[data-cal-grid]");
  function renderCal() {
    $("[data-cal-title]").textContent = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    $("[data-cal-prev]").disabled = view <= first;
    $("[data-cal-next]").disabled = view >= last;
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let html = "<span></span>".repeat(view.getDay());
    for (let n = 1; n <= days; n++) {
      const d = new Date(view.getFullYear(), view.getMonth(), n), ok = open(d), av = ok ? availability(d) : null;
      const few = av && Object.values(av).some((v) => v !== "open");
      html += `<button type="button" data-day="${iso(d)}" ${ok ? "" : "disabled"} aria-pressed="${picked && iso(picked) === iso(d)}" class="${few ? "few" : ""}" aria-label="${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${ok ? few ? ", limited availability" : ", available" : ", closed"}">${n}</button>`;
    }
    grid.innerHTML = html;
  }
  $("[data-cal-prev]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
  $("[data-cal-next]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });
  const form = $("[data-res]"), msg = $("[data-res-msg]"), hold = $("[data-hold]");
  const setMsg = (t, k = "") => { msg.textContent = t; msg.className = `res-msg ${k}`; };
  function syncSeatings() {
    if (!picked) return;
    const av = availability(picked);
    $$('input[name="seating"]', form).forEach((r) => { r.disabled = av[r.value] === "full"; });
    if ($('input[name="seating"]:checked', form).disabled) { const alt = $('input[name="seating"]:not(:disabled)', form); if (alt) alt.checked = true; }
  }
  grid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]"); if (!b || b.disabled) return;
    picked = new Date(`${b.dataset.day}T00:00:00`);
    $("[data-sel-date]").textContent = picked.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    hold.hidden = true; setMsg("");
    renderCal(); syncSeatings();
  });
  $("[data-party]").innerHTML = Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1} ${i ? "guests" : "guest"}</option>`).join("") + `<option value="9">9+ guests — private dining</option>`;
  $("[data-party]").addEventListener("change", (e) => { if (e.target.value === "9") { e.target.value = "8"; openPrivate(10); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!picked) { setMsg("Please choose a date on the calendar.", "bad"); grid.querySelector("button:not(:disabled)")?.focus(); return; }
    const av = availability(picked), seat = form.seating.value, party = +form.party.value;
    if (av[seat] === "full") { setMsg(`${seat} is fully booked on this date — please choose another seating or date.`, "bad"); return; }
    setMsg(`${av[seat] === "few" ? "Only a few tables remain" : "A table is available"} for ${party} at ${seat}. Add your details to hold it.`, "ok");
    hold.hidden = false; form.name.focus();
  });
  $("[data-confirm]").addEventListener("click", () => {
    let bad = null;
    [form.name, form.email].forEach((f) => { f.required = true; const b = !f.checkValidity(); f.toggleAttribute("aria-invalid", b); if (b && !bad) bad = f; });
    if (bad) { setMsg("Please add your name and a valid email.", "bad"); bad.focus(); return; }
    const occ = form.occasion.value;
    setMsg(`Reserved: ${form.party.value} guests on ${$("[data-sel-date]").textContent} at ${form.seating.value}${occ !== "None" ? ` · ${occ}` : ""}. Confirmation AU-${hash(form.email.value + iso(picked)) + 1000} would be sent to ${form.email.value}. (Demo — nothing was sent.)`, "ok");
    hold.hidden = true;
    toast("Your table is held — we look forward to welcoming you");
  });
  renderCal();

  /* Status (New York time) */
  const sched = { 0: [17, 21.5], 1: null, 2: null, 3: [17.5, 22], 4: [17.5, 22], 5: [17.5, 23], 6: [17.5, 23] };
  let day = new Date().getDay(), hr = new Date().getHours() + new Date().getMinutes() / 60;
  try { const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()); const g = (t) => p.find((x) => x.type === t).value; day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")); hr = (+g("hour") % 24) + +g("minute") / 60; } catch { /* local */ }
  const fm = (h) => `${Math.floor(h) % 12 || 12}:${h % 1 ? "30" : "00"} PM`;
  const s = sched[day], st = $("[data-status]");
  if (s && hr >= s[0] && hr < s[1]) st.textContent = `Open now · until ${fm(s[1])}`;
  else { st.classList.add("closed"); if (s && hr < s[0]) st.textContent = `Opens tonight at ${fm(s[0])}`; else { let n = (day + 1) % 7; while (!sched[n]) n = (n + 1) % 7; st.textContent = `Closed · reopens ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n]} ${fm(sched[n][0])}`; } }
  $$(".hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").includes(String(day))));

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = $("#news-email"), ok = i.checkValidity();
    i.setAttribute("aria-invalid", String(!ok));
    $("[data-news-msg]").textContent = ok ? "Thank you — you'll hear from us when the winter menu is announced. (Demo — nothing was sent.)" : "Please enter a valid email address.";
    if (ok) e.target.reset();
  });

  /* Sticky mobile CTA */
  const sticky = $(".sticky");
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => en.forEach((x) => sticky.classList.toggle("away", x.isIntersecting)), { threshold: 0.1 }).observe($("#reserve"));
})();
