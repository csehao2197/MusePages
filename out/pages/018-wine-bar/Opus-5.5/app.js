(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $("[data-art=map]").innerHTML = Art.map();
  $$("[data-bottle]").forEach((b) => { b.innerHTML = Art.bottle(b.dataset.bottle, b.dataset.color, b.dataset.color === "#C9C27A" ? "#F4EFE6" : "#E8DCC4", b.dataset.region); });
  $$("[data-scene]").forEach((s) => { s.innerHTML = Art.scene(s.dataset.scene, s.dataset.label); });
  $$(".stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  /* Nav, drawer, parallax */
  const nav = $("[data-nav]"), bg = $("[data-parallax]"), hero = $(".hero");
  let ticking = false;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("solid", window.scrollY > 40);
    if (reduced || ticking) return;
    ticking = true;
    requestAnimationFrame(() => { bg.style.transform = `translate3d(0, ${Math.min(window.scrollY, hero.offsetHeight) * 0.35}px, 0)`; ticking = false; });
  }, { passive: true });
  const drawer = $("#drawer"), scrim = $("[data-scrim]"), burger = $("[data-burger]");
  const setDrawer = (open) => { drawer.hidden = !open; scrim.hidden = !open; burger.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-drawer-close]").focus(); };
  burger.addEventListener("click", () => setDrawer(true));
  $("[data-drawer-close]").addEventListener("click", () => { setDrawer(false); burger.focus(); });
  scrim.addEventListener("click", () => setDrawer(false));
  $$("#drawer a, #drawer button.btn").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !drawer.hidden) setDrawer(false); });

  /* Events */
  const events = [
    ["Old World vs. New World", "Sat", "Apr", "12", "7:00 PM", 65, 8, "oldnew", "Side-by-side flights of France and Australia"],
    ["Italian Wine Masterclass", "Fri", "Apr", "18", "6:30 PM", 85, 12, "italy", "Piedmont to Sicily with our lead sommelier"],
    ["Blind Tasting Challenge", "Sat", "Apr", "26", "7:30 PM", 45, 20, "blind", "Five glasses, no labels, one champion"],
  ];
  const availClass = (n) => (n === 0 ? "red" : n <= 10 ? "amber" : "green");
  function renderEvents() {
    $("[data-events]").innerHTML = events.map(([t, dow, mon, day, time, price, left, art, desc], i) => `<article class="ev"><div class="ev-img">${Art.scene(art, desc)}<span class="date"><small>${mon}</small><b>${day}</b><small>${dow}</small></span></div>
      <div class="ev-body"><h3>${t}</h3><p class="ev-meta"><span>${icon("clock")}${dow}, ${mon} ${day} · ${time}</span><span>${icon("wine")}$${price}/person</span></p>
      <div class="ev-foot"><span class="avail ${availClass(left)}"><i></i>${left ? `${left} spots left` : "Sold out"}</span><button class="btn btn-burgundy" type="button" data-ev="${i}" ${left ? "" : "disabled"}>${left ? "Reserve" : "Sold out"}</button></div></div></article>`).join("");
  }
  renderEvents();
  $("[data-all-events]").addEventListener("click", () => toast("Our May calendar is announced to Vine Club members first — join below"));

  /* Gallery */
  const shots = [["bar", "The bar counter, glasses ready"], ["cheese", "A cheese board for the table"], ["candles", "Brick walls by candlelight"], ["patio", "The patio under string lights"], ["pour", "Our sommelier pouring a Burgundy"], ["alcove", "The private dining alcove"]];
  $("[data-gallery]").innerHTML = shots.map(([n, c], i) => `<button class="gi" type="button" data-g="${i}" aria-label="View photo: ${c}">${Art.scene(n, c)}<span class="cap">${c}</span></button>`).join("");
  const lb = $("[data-lb]");
  let gi = 0, lastFocus;
  const show = (i) => { gi = (i + shots.length) % shots.length; $("[data-lb-img]").innerHTML = Art.scene(shots[gi][0], shots[gi][1]); $("[data-lb-cap]").textContent = shots[gi][1]; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  $$("[data-g]").forEach((b) => b.addEventListener("click", () => { lastFocus = b; show(+b.dataset.g); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); }));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb-step]").forEach((b) => b.addEventListener("click", () => show(gi + +b.dataset.lbStep)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") show(gi + 1); else if (e.key === "ArrowLeft") show(gi - 1); });
  swipe(lb, (d) => show(gi + d));
  function swipe(el, fn) {
    let x0 = null, y0 = 0;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1); x0 = null; }, { passive: true });
  }

  /* Testimonials */
  const track = $("[data-track]"), slides = $$(".t", track), dots = $("[data-tdots]"), sec = $(".testi");
  let ti = 0, timer = null, hold = false;
  dots.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}"></button>`).join("");
  const go = (i) => { ti = (i + slides.length) % slides.length; track.style.transform = `translateX(-${ti * 100}%)`; slides.forEach((s, j) => s.setAttribute("aria-hidden", String(j !== ti))); $$("button", dots).forEach((d, j) => d.setAttribute("aria-current", String(j === ti))); };
  const auto = () => { clearInterval(timer); timer = reduced || hold ? null : setInterval(() => go(ti + 1), 5000); };
  $$("button", dots).forEach((d, i) => d.addEventListener("click", () => { go(i); auto(); }));
  ["mouseenter", "focusin"].forEach((ev) => sec.addEventListener(ev, () => { hold = true; auto(); }));
  ["mouseleave", "focusout"].forEach((ev) => sec.addEventListener(ev, () => { hold = false; auto(); }));
  swipe(track, (d) => { go(ti + d); auto(); });
  go(0); auto();
  window.MuseTesti = { index: () => ti };

  /* Hours, status, happy hour */
  const sched = { 0: [15, 21], 1: null, 2: [16, 23], 3: [16, 23], 4: [16, 23], 5: [16, 25], 6: [16, 25] };
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const prevLate = sched[(d + 6) % 7] && sched[(d + 6) % 7][1] > 24 && h < sched[(d + 6) % 7][1] - 24;
  const s = sched[d], open = prevLate || (s && h >= s[0] && h < s[1]);
  const st = $("[data-status]");
  st.textContent = open ? "Open now" : s && h < s[0] ? `Opens today at ${s[0] - 12}PM` : "Closed now";
  st.classList.toggle("closed", !open);
  $$(".hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").includes(String(d))));
  const hh = [2, 3, 4].includes(d) && h >= 16 && h < 18;
  $("[data-hh]").classList.toggle("live", hh);
  $("[data-hh-short]").textContent = hh ? "Happy hour is on now — 30% off by the glass" : "Happy Hour Tue–Thu 4–6 PM";

  /* Modals */
  const modal = (n) => $(`[data-modal="${n}"]`);
  const reset = (m) => { const f = $("form", m); if (!f) return; f.reset(); f.hidden = false; $(".done", m).hidden = true; $("[data-err]", m).textContent = ""; $$("[aria-invalid]", f).forEach((x) => x.removeAttribute("aria-invalid")); };
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((dl) => dl.addEventListener("click", (e) => { if (e.target === dl) dl.close(); }));

  // Tasting
  const picks = new Set();
  $$("[data-pour]").forEach((b) => b.addEventListener("click", () => {
    const n = b.dataset.pour;
    picks.has(n) ? picks.delete(n) : picks.add(n);
    b.classList.toggle("on", picks.has(n));
    b.textContent = picks.has(n) ? "In your tasting" : "Add to tasting";
    toast(picks.has(n) ? `${n} added to your tasting request` : `${n} removed`);
  }));
  const tk = modal("tasting"), tf = $("form", tk);
  const tTotal = () => { $("[data-ttotal]").textContent = `$${48 * Math.max(1, Math.min(8, +tf.guests.value || 1))}`; };
  tf.guests.addEventListener("input", tTotal);
  function tastingSlots() {
    const v = tf.date.value; const day = v ? new Date(`${v}T00:00:00`).getDay() : 2;
    const slots = day === 0 ? ["3:30 PM", "5:00 PM", "6:30 PM"] : ["5:00 PM", "6:30 PM", "8:00 PM"];
    $("[data-ttime]").innerHTML = slots.map((x) => `<option>${x}</option>`).join("");
  }
  tf.date.addEventListener("change", tastingSlots);
  $$("[data-open=tasting]").forEach((b) => b.addEventListener("click", () => {
    reset(tk);
    const t = new Date(); t.setDate(t.getDate() + 1); tf.date.min = iso(t);
    $("[data-picks]").hidden = !picks.size; $("[data-pick-list]").innerHTML = [...picks].map((p) => `<li>${p}</li>`).join("");
    tastingSlots(); tTotal(); setDrawer(false); tk.showModal();
  }));

  // Inquiry
  const iq = modal("inquiry");
  $$("[data-open=inquiry]").forEach((b) => b.addEventListener("click", () => { reset(iq); const t = new Date(); t.setDate(t.getDate() + 7); $("form", iq).date.min = iso(t); iq.showModal(); }));

  // Event booking
  const em = modal("event");
  let evIdx = 0;
  const evTotal = () => { $("[data-ev-total]").textContent = `$${events[evIdx][5] * +$("[data-ev-seats]").value}`; };
  $("[data-ev-seats]").addEventListener("change", evTotal);
  $("[data-events]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-ev]"); if (!b) return;
    evIdx = +b.dataset.ev; const ev = events[evIdx];
    reset(em);
    $("[data-ev-title]").textContent = ev[0];
    $("[data-ev-sub]").textContent = `${ev[1]}, ${ev[2]} ${ev[3]} · ${ev[4]} · $${ev[5]} per person · ${ev[8]}`;
    $("[data-ev-seats]").innerHTML = Array.from({ length: Math.min(6, ev[6]) }, (_, i) => `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1}</option>`).join("");
    evTotal(); em.showModal();
  });

  // Shared submit
  $$(".m-form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = f.closest("dialog"), kind = f.dataset.kind;
    if (f.date && f.date.value && kind !== "event") f.date.setCustomValidity(new Date(`${f.date.value}T00:00:00`).getDay() === 1 ? "We're closed on Mondays" : "");
    let first = null;
    $$("input, select", f).forEach((x) => { const bad = !x.checkValidity(); x.toggleAttribute("aria-invalid", bad); if (bad && !first) first = x; });
    $("[data-err]", m).textContent = first ? (first.type === "checkbox" ? "All guests must be 21 or older." : first.validationMessage || "Please complete the highlighted fields.") : "";
    if (first) { first.focus(); return; }
    let text;
    if (kind === "tasting") text = `${f.guests.value} guest${+f.guests.value > 1 ? "s" : ""} on ${new Date(`${f.date.value}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${f.time.value} — $${48 * +f.guests.value}${picks.size ? `, featuring ${[...picks].join(" & ")}` : ""}. Confirmation to ${f.email.value}. (Demo — nothing was sent.)`;
    else if (kind === "inquiry") text = `Thanks, ${f.name.value.split(" ")[0]}. Our events team will reply to ${f.email.value} within one business day about your ${f.type.value.toLowerCase()} for ${f.guests.value}. (Demo — nothing was sent.)`;
    else { const n = +f.seats.value, ev = events[evIdx]; ev[6] -= n; renderEvents(); text = `${n} seat${n > 1 ? "s" : ""} for ${ev[0]} — $${ev[5] * n}. Tickets to ${f.email.value}. ${ev[6]} spots remain. (Demo — no payment taken.)`; }
    $("[data-done]", m).textContent = text;
    f.hidden = true; $(".done", m).hidden = false;
  }));

  /* Wine list */
  const wines = [
    ["Red", "2021 Château Margaux", "Bordeaux, France · Cabernet blend", 28, 240], ["Red", "2022 Penfolds Bin 389", "South Australia · Cabernet–Shiraz", 22, 120], ["Red", "2019 Barolo, Vietti Castiglione", "Piedmont, Italy · Nebbiolo", 24, 130], ["Red", "2021 Rioja Reserva, López de Heredia", "Rioja, Spain · Tempranillo", 19, 95], ["Red", "2022 Morgon, Marcel Lapierre", "Beaujolais, France · Gamay", 16, 78],
    ["White", "2023 Cloudy Bay Sauvignon Blanc", "Marlborough, NZ", 18, 82], ["White", "2022 Sancerre, Domaine Vacheron", "Loire, France · Sauvignon Blanc", 20, 92], ["White", "2022 Chablis, William Fèvre", "Burgundy, France · Chardonnay", 21, 98], ["White", "2023 Albariño, Do Ferreiro", "Rías Baixas, Spain", 15, 68],
    ["Sparkling", "NV Champagne, Billecart-Salmon Brut", "Champagne, France", 24, 120], ["Sparkling", "NV Franciacorta, Ca' del Bosco", "Lombardy, Italy", 19, 88],
    ["Rosé", "2023 Bandol Rosé, Domaine Tempier", "Provence, France · Mourvèdre", 18, 84],
  ];
  const seg = $("[data-wl-seg]"), cats = ["All", "Red", "White", "Sparkling", "Rosé"];
  seg.innerHTML = cats.map((c, i) => `<button type="button" aria-pressed="${i === 0}">${c}</button>`).join("");
  let cat = "All";
  const renderWl = () => {
    const q = $("[data-wl-search]").value.trim().toLowerCase();
    const rows = wines.filter((w) => (cat === "All" || w[0] === cat) && (!q || `${w[1]} ${w[2]}`.toLowerCase().includes(q)));
    $("[data-wl]").innerHTML = rows.length ? rows.map(([, n, r, g, b]) => `<li><b>${n}</b><span>${r}</span><em>$${g}<small>glass · $${b} bottle</small></em></li>`).join("") : `<li class="wl-empty">No wines match — ask your sommelier, there are 200 more in the cellar.</li>`;
  };
  $$("button", seg).forEach((b) => b.addEventListener("click", () => { cat = b.textContent; $$("button", seg).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderWl(); }));
  $("[data-wl-search]").addEventListener("input", renderWl);
  renderWl();
  $$("[data-open=list]").forEach((b) => b.addEventListener("click", () => modal("list").showModal()));

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = $("#news-email"), ok = i.checkValidity();
    i.setAttribute("aria-invalid", String(!ok));
    $("[data-news-msg]").textContent = ok ? "Welcome to the Vine Club — rare releases are headed your way. (Demo — nothing was sent.)" : "Please enter a valid email address.";
    if (ok) e.target.reset();
  });
})();
