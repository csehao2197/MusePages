(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(`staydirect:${k}`); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(`staydirect:${k}`, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const mobile = () => window.matchMedia("(max-width: 860px)").matches;
  const icon = (name, cls = "i") => `<svg class="${cls}"><use href="#i-${name}"/></svg>`;

  let toastTimer;
  function toast(msg) {
    const t = $("[data-toast]");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* Scenes */
  $$("[data-scene]").forEach((el) => { el.innerHTML = Scenes.render(el.dataset.scene, el.dataset.tone, el.getAttribute("aria-label") || ""); });

  /* Header */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const menuBtn = $(".menu-btn"), mnav = $("#mobile-nav");
  menuBtn.addEventListener("click", () => {
    const open = mnav.hidden;
    mnav.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  });
  mnav.addEventListener("click", (e) => { if (e.target.closest("a,button")) { mnav.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.querySelector("use").setAttribute("href", "#i-menu"); } });

  /* Currency (indicative demo rates) */
  const rates = { USD: [1, "$"], EUR: [0.92, "€"], GBP: [0.79, "£"] };
  let currency = store.get("currency", "USD");
  if (!rates[currency]) currency = "USD";
  const money = (usd) => {
    const [r] = rates[currency];
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(Math.round(usd * r));
  };
  function applyCurrency() {
    $$("[data-currency]").forEach((s) => { s.value = currency; });
    $$("[data-usd]").forEach((el) => { el.textContent = money(+el.dataset.usd); });
    updateBooking();
  }
  $$("[data-currency]").forEach((s) => s.addEventListener("change", () => {
    currency = s.value;
    store.set("currency", currency);
    applyCurrency();
    toast(currency === "USD" ? "Prices shown in US dollars" : `Prices shown in ${currency} at indicative rates`);
  }));
  $("[data-language]").addEventListener("change", (e) => {
    if (e.target.selectedIndex) toast(`${e.target.value} translation is coming soon — showing English`);
  });

  /* Saves */
  const saved = new Set(store.get("saved", []));
  const syncSaves = () => $$("[data-save]").forEach((b) => {
    const on = saved.has(b.dataset.save);
    b.setAttribute("aria-pressed", String(on));
    const label = b.querySelector("span");
    if (label) label.textContent = on ? "Saved" : "Save";
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-save]");
    if (!b) return;
    e.preventDefault();
    const k = b.dataset.save;
    saved.has(k) ? saved.delete(k) : saved.add(k);
    store.set("saved", [...saved]);
    syncSaves();
    toast(saved.has(k) ? "Saved to your wishlist" : "Removed from your wishlist");
  });
  syncSaves();

  /* Gallery + lightbox */
  const mosaicOrder = [["exterior", "dusk"], ["living", "day"], ["bedroom", "morning"], ["rooftop", "day"], ["beachpath", "day"]];
  const tour = [
    ...mosaicOrder.map(([s, t]) => Scenes.tour.find((x) => x.scene === s && x.tone === t)),
    ...Scenes.tour.filter((x) => !mosaicOrder.some(([s, t]) => x.scene === s && x.tone === t)),
  ];
  const lb = $("[data-lightbox]");
  let lbIndex = 0, lbReturn = null;
  const thumbs = $("[data-lb-thumbs]");
  $("[data-lb-total]").textContent = tour.length;
  function lbShow(i) {
    lbIndex = (i + tour.length) % tour.length;
    const p = tour[lbIndex];
    $("[data-lb-img]").innerHTML = Scenes.render(p.scene, p.tone, p.caption);
    $("[data-lb-cap]").textContent = p.caption;
    $("[data-lb-index]").textContent = lbIndex + 1;
    $$("button", thumbs).forEach((b, j) => b.setAttribute("aria-current", String(j === lbIndex)));
    const cur = thumbs.children[lbIndex];
    if (cur) thumbs.scrollTo({ left: cur.offsetLeft - thumbs.clientWidth / 2 + cur.clientWidth / 2, behavior: "smooth" });
  }
  function lbOpen(i) {
    if (!thumbs.children.length) {
      thumbs.innerHTML = tour.map((p, j) => `<button type="button" aria-label="Photo ${j + 1}: ${p.caption}">${Scenes.render(p.scene, p.tone)}</button>`).join("");
      $$("button", thumbs).forEach((b, j) => b.addEventListener("click", () => lbShow(j)));
    }
    lbReturn = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lbShow(i);
    $("[data-lb-close]").focus();
  }
  function lbClose() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lbReturn) lbReturn.focus();
  }
  $$("[data-photo]").forEach((b) => b.addEventListener("click", () => lbOpen(+b.dataset.photo)));
  $("[data-lb-close]").addEventListener("click", lbClose);
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => lbShow(lbIndex + +b.dataset.lb)));
  lb.addEventListener("keydown", (e) => {
    if (e.key === "Escape") lbClose();
    else if (e.key === "ArrowRight") lbShow(lbIndex + 1);
    else if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
    else if (e.key === "Tab") {
      const f = $$("button", lb).filter((b) => b.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  swipe($(".lb-stage"), (d) => lbShow(lbIndex + d));

  const mosaic = $("[data-carousel]");
  const dots = $(".carousel-ui .dots");
  dots.innerHTML = mosaicOrder.map(() => "<i></i>").join("");
  const syncDots = () => {
    const i = Math.round(mosaic.scrollLeft / Math.max(1, mosaic.clientWidth));
    $$("i", dots).forEach((d, j) => d.classList.toggle("on", j === i));
    $("[data-carousel-index]").textContent = i + 1;
  };
  mosaic.addEventListener("scroll", syncDots, { passive: true });
  syncDots();

  function swipe(el, fn) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* Description */
  const desc = $("#description"), descBtn = $("[data-toggle-desc]");
  descBtn.addEventListener("click", () => {
    const open = desc.dataset.collapsed === "true";
    desc.dataset.collapsed = String(!open);
    descBtn.setAttribute("aria-expanded", String(open));
    descBtn.firstChild.textContent = open ? "Show less" : "Show more";
  });

  /* Modals */
  const modal = (name) => $(`[data-modal="${name}"]`);
  function openModal(name) {
    const m = modal(name);
    if (!m) return;
    const form = $("form", m), done = $(".done", m);
    if (form && done) { form.hidden = false; done.hidden = true; form.reset(); $$("[aria-invalid]", form).forEach((x) => x.removeAttribute("aria-invalid")); $("[data-err]", form).textContent = ""; }
    if (typeof m.showModal === "function") m.showModal(); else m.setAttribute("open", "");
  }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { e.preventDefault(); openModal(o.dataset.open); }
    const c = e.target.closest("[data-close]");
    if (c) c.closest("dialog").close();
  });
  $$("dialog.modal").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  /* Amenities modal */
  const amenityCats = [
    ["Bathroom", [["shower", "Rainfall shower"], ["bath", "Soaking tub"], ["droplet", "Luxury toiletries"], ["flame", "Hair dryer"]]],
    ["Kitchen", [["flame", "Gas stove"], ["pot", "Oven"], ["pot", "Espresso machine"], ["pot", "Blender"], ["droplet", "Dishwasher"], ["droplet", "Filtered water"]]],
    ["Outdoor", [["flame", "BBQ grill"], ["palm", "Hammocks"], ["umbrella", "Beach palapa"], ["users", "Outdoor dining for 8"], ["flame", "Fire pit"]]],
    ["Entertainment", [["tv", "65\" smart TV"], ["music", "Sonos speakers"], ["grid", "Board games"], ["waves", "Snorkel gear"]]],
    ["Safety", [["bell", "Smoke detectors"], ["alert", "Fire extinguisher"], ["aid", "First aid kit"], ["camera", "Security cameras (exterior only)"]]],
    ["Essentials", [["waves", "Private infinity pool"], ["wifi", "High-speed WiFi (150 Mbps)"], ["snow", "Air conditioning"], ["car", "Free parking (2 vehicles)"], ["lock", "Smart lock entry"]]],
  ];
  $("[data-amen-cats]").innerHTML = amenityCats.map(([cat, items]) => `<section><h3>${cat}</h3><ul>${items.map(([ic, l]) => `<li>${icon(ic)}${l}</li>`).join("")}</ul></section>`).join("");

  /* Share */
  const url = location.href.split("#")[0];
  $("[data-mailto]").href = `mailto:?subject=${encodeURIComponent("Casa Azul — Tulum beachfront villa")}&body=${encodeURIComponent(`Take a look at this villa on StayDirect: ${url}`)}`;
  $("[data-copy]").addEventListener("click", async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch {
      const ta = document.createElement("textarea"); ta.value = url; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
    }
    $("[data-copy-label]").textContent = ok ? "Link copied" : "Copy failed";
    toast(ok ? "Link copied to clipboard" : "Couldn't copy — select the address bar instead");
    setTimeout(() => { $("[data-copy-label]").textContent = "Copy link"; }, 2000);
  });
  $("[data-native-share]").addEventListener("click", async () => {
    if (navigator.share) { try { await navigator.share({ title: "Casa Azul on StayDirect", url }); } catch { /* cancelled */ } }
    else toast("Your browser doesn't support system sharing — use Copy link");
  });

  /* Forms (local validation only) */
  $$(".js-form").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("[data-err]", form);
    let msg = "";
    if (form.dataset.form === "report") {
      if (!form.reason.value) msg = "Choose a reason to continue.";
    } else {
      for (const field of $$("input, textarea", form)) {
        const bad = !field.checkValidity();
        field.toggleAttribute("aria-invalid", bad);
        if (bad && !msg) msg = field.validationMessage || "Please complete this field.";
      }
    }
    err.textContent = msg;
    if (msg) { const first = $("[aria-invalid]", form); if (first) first.focus(); return; }
    form.hidden = true;
    $(".done", form.parentElement).hidden = false;
  }));

  /* Map */
  $("[data-map-canvas]").innerHTML = `<svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Map of the Tulum coast showing the approximate area of Casa Azul">
    <rect width="800" height="520" fill="#9ED8E5"/>
    <path d="M0 0 H 560 C 540 80 520 120 500 170 C 470 250 470 300 430 360 C 400 410 380 460 360 520 H 0 Z" fill="#EEF3E7"/>
    <path d="M0 0 H 560 C 540 80 520 120 500 170 C 470 250 470 300 430 360 C 400 410 380 460 360 520" fill="none" stroke="#F5E7C8" stroke-width="10"/>
    <path d="M60 300 C 140 280 200 330 260 310 C 300 300 340 330 360 360 L 360 520 H 0 V 330 Z" fill="#D4E6C7"/>
    <path d="M20 40 C 120 60 160 30 260 70" fill="none" stroke="#D4E6C7" stroke-width="40" stroke-linecap="round"/>
    <circle cx="220" cy="210" r="16" fill="#7CC4D6"/><circle cx="120" cy="140" r="11" fill="#7CC4D6"/>
    <path d="M0 230 C 120 220 220 240 330 200 S 470 110 500 40" fill="none" stroke="#fff" stroke-width="9"/>
    <path d="M520 0 C 500 120 470 210 440 290 C 420 350 400 420 380 520" fill="none" stroke="#fff" stroke-width="7"/>
    <path d="M520 0 C 500 120 470 210 440 290 C 420 350 400 420 380 520" fill="none" stroke="#FBBF24" stroke-width="2" stroke-dasharray="6 8"/>
    <g font-family="Inter, sans-serif" font-size="13" fill="#475569" font-weight="500">
      <text x="40" y="216">Tulum Town</text><text x="236" y="214">Gran Cenote</text>
      <text x="410" y="70" transform="rotate(-68 410 70)">Tulum Beach Road</text>
      <text x="380" y="132">Tulum Ruins</text>
      <text x="200" y="470" fill="#3F6B4A">Sian Ka'an Biosphere Reserve</text>
      <text x="640" y="280" fill="#2B7A90" font-size="15" font-style="italic">Caribbean Sea</text>
    </g>
    <g fill="#334155"><circle cx="455" cy="128" r="6"/><circle cx="230" cy="190" r="0"/></g>
    <defs><radialGradient id="mapblur"><stop offset="0" stop-color="#0891B2" stop-opacity=".45"/><stop offset=".7" stop-color="#0891B2" stop-opacity=".18"/><stop offset="1" stop-color="#0891B2" stop-opacity="0"/></radialGradient></defs>
    <circle cx="448" cy="300" r="90" fill="url(#mapblur)"/>
    <circle cx="448" cy="300" r="60" fill="none" stroke="#0891B2" stroke-width="2" stroke-dasharray="4 6" opacity=".6"/>
    <g transform="translate(448 300)"><circle r="24" fill="#0891B2"/><path d="M-9 2 L0 -8 L9 2 V9 H-9 Z" fill="#fff"/></g>
  </svg>`;
  let zoom = 1;
  $$("[data-zoom]").forEach((b) => b.addEventListener("click", () => {
    zoom = Math.min(2, Math.max(1, zoom + (b.dataset.zoom === "in" ? 0.25 : -0.25)));
    $("[data-map-canvas]").style.transform = `scale(${zoom})`;
    $('[data-zoom="in"]').disabled = zoom >= 2;
    $('[data-zoom="out"]').disabled = zoom <= 1;
  }));
  $('[data-zoom="out"]').disabled = true;

  /* Reviews */
  const reviews = [
    ["Sarah K.", "Austin, TX", "December 2025", 5, "Absolutely magical. The villa exceeded every expectation — the photos don't do it justice. Waking up to that ocean view every morning was surreal.", "#0891B2"],
    ["Tom & Linda R.", "Toronto", "November 2025", 5, "Best-equipped kitchen we've ever had in a rental. We hired the private chef for one dinner and cooked ourselves the rest — both were amazing.", "#B45309"],
    ["Yuki M.", "Tokyo", "November 2025", 5, "Gabriela was incredibly responsive and left a personalized welcome basket with local mezcal and chocolates. The self check-in was seamless.", "#475569"],
    ["Anna & Chris B.", "Brooklyn", "January 2026", 5, "Third time staying here. We come back every winter. The private beach path and yoga deck make it impossible to leave.", "#047857"],
    ["James W.", "London", "October 2025", 4, "Pool is stunning, beach is gorgeous, but be aware there's some seaweed on the beach (common in Tulum). Villa itself is perfection.", "#BE123C"],
    ["Maria G.", "Madrid", "September 2025", 5, "Perfect for our family of 5. Kids loved the pool. The bikes were perfect for exploring. Only wish we'd booked a longer stay.", "#7C3AED"],
  ];
  const initials = (n) => n.replace(/&.*/, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2);
  const reviewHtml = ([name, city, date, stars, text, color]) => `<article class="review">
    <div class="rv-head"><span class="rv-av" style="background:${color}" aria-hidden="true">${initials(name)}</span><div><b>${name}</b><span>${city} · ${date}</span></div></div>
    <div class="rv-stars" role="img" aria-label="${stars} out of 5 stars">${[1, 2, 3, 4, 5].map((n) => icon("star", `i i-fill${n > stars ? " off" : ""}`)).join("")}</div>
    <p>${text}</p></article>`;
  $("[data-reviews]").innerHTML = reviews.map(reviewHtml).join("");
  const list = $("[data-review-list]");
  const renderList = (q = "") => {
    const hits = reviews.filter((r) => `${r[0]} ${r[1]} ${r[4]}`.toLowerCase().includes(q.toLowerCase()));
    list.innerHTML = hits.length ? hits.map(reviewHtml).join("") : `<p class="muted">No reviews mention “${q.replace(/[<>&"]/g, "")}”.</p>`;
  };
  renderList();
  $("[data-review-search]").addEventListener("input", (e) => renderList(e.target.value.trim()));

  /* Similar listings */
  const track = $("[data-sim-track]");
  $$("[data-sim]").forEach((b) => b.addEventListener("click", () => track.scrollBy({ left: +b.dataset.sim * (track.clientWidth / 2), behavior: "smooth" })));

  /* Calendar + booking */
  const NIGHTLY = 389, CLEANING = 150, PET = 50, MIN = 3, MAX_GUESTS = 6;
  const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = day0(new Date());
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const key = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const nightsBetween = (a, b) => Math.round((b - a) / 86400000);
  const booked = new Set();
  [[3, 6], [13, 18], [26, 28], [37, 43], [55, 58], [66, 71]].forEach(([a, b]) => { for (let i = a; i <= b; i++) booked.add(key(addDays(today, i))); });
  const firstOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
  const minMonth = firstOfMonth(today), maxMonth = new Date(today.getFullYear(), today.getMonth() + 11, 1);
  const views = { main: minMonth, pop: minMonth };
  let checkIn = null, checkOut = null;
  const guests = { adults: 2, children: 0, infants: 0, pets: 0 };
  const fmt = (d, o = { month: "short", day: "numeric" }) => d.toLocaleDateString("en-US", o);
  const monthsOf = { main: 2, pop: 1 };

  function monthHtml(start) {
    const days = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
    let cells = "";
    for (let i = 0; i < start.getDay(); i++) cells += "<span></span>";
    for (let n = 1; n <= days; n++) {
      const d = new Date(start.getFullYear(), start.getMonth(), n);
      const past = d < today, isBooked = booked.has(key(d));
      const cls = ["day"];
      if (isBooked) cls.push("booked");
      if (+d === +today) cls.push("today");
      if (checkIn && +d === +checkIn) cls.push("start", ...(checkOut ? ["ranged"] : []));
      if (checkOut && +d === +checkOut) cls.push("end");
      if (checkIn && checkOut && d > checkIn && d < checkOut) cls.push("in-range");
      const label = `${fmt(d, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}${isBooked ? ", booked" : past ? ", unavailable" : ", available"}`;
      cells += `<button type="button" class="${cls.join(" ")}" data-day="${+d}" ${past || isBooked ? "disabled" : ""} aria-label="${label}" aria-pressed="${cls.includes("start") || cls.includes("end")}"><span>${n}</span></button>`;
    }
    return `<div class="month"><h3>${fmt(start, { month: "long", year: "numeric" })}</h3><div class="dow">${["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((x) => `<span>${x}</span>`).join("")}</div><div class="days">${cells}</div></div>`;
  }
  function renderCalendars() {
    Object.keys(views).forEach((name) => {
      const el = $(`[data-calendar="${name}"]`);
      const count = monthsOf[name];
      let html = "";
      for (let i = 0; i < count; i++) html += monthHtml(new Date(views[name].getFullYear(), views[name].getMonth() + i, 1));
      el.innerHTML = html;
    });
    $("[data-cal-prev]").disabled = +views.main <= +minMonth;
    $("[data-cal-next]").disabled = +views.main >= +maxMonth;
    $("[data-pop-prev]").disabled = +views.pop <= +minMonth;
    $("[data-pop-next]").disabled = +views.pop >= +maxMonth;
  }
  function shiftView(name, n) {
    const v = views[name];
    const next = new Date(v.getFullYear(), v.getMonth() + n, 1);
    if (next < minMonth || next > maxMonth) return;
    views[name] = next;
    renderCalendars();
  }
  const msg = (t) => { $("[data-cal-msg]").textContent = t; };
  function pick(d) {
    msg("");
    if (!checkIn || checkOut || d <= checkIn) {
      checkIn = d; checkOut = null;
    } else {
      const n = nightsBetween(checkIn, d);
      let blocked = false;
      for (let i = 1; i < n; i++) if (booked.has(key(addDays(checkIn, i)))) blocked = true;
      if (blocked) { msg("Those dates include booked nights — pick a checkout before the next booking."); return; }
      if (n < MIN) { msg(`Casa Azul has a ${MIN}-night minimum — choose ${fmt(addDays(checkIn, MIN))} or later.`); return; }
      checkOut = d;
    }
    renderCalendars();
    updateBooking();
    if (checkIn && checkOut && !$("[data-date-pop]").hidden) setTimeout(closePop, 250);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-day]");
    if (b && !b.disabled) pick(new Date(+b.dataset.day));
  });
  $("[data-cal-prev]").addEventListener("click", () => shiftView("main", -1));
  $("[data-cal-next]").addEventListener("click", () => shiftView("main", 1));
  $("[data-pop-prev]").addEventListener("click", () => shiftView("pop", -1));
  $("[data-pop-next]").addEventListener("click", () => shiftView("pop", 1));
  swipe($('[data-calendar="main"]'), (d) => shiftView("main", d));
  swipe($('[data-calendar="pop"]'), (d) => shiftView("pop", d));
  $$("[data-clear-dates]").forEach((b) => b.addEventListener("click", () => { checkIn = checkOut = null; msg(""); renderCalendars(); updateBooking(); }));

  const pop = $("[data-date-pop]");
  function openPop(which) {
    pop.hidden = false;
    $$("[data-date-field]").forEach((f) => f.setAttribute("aria-expanded", String(f.dataset.dateField === which)));
    views.pop = firstOfMonth(checkIn && which === "out" ? checkIn : checkIn || today);
    renderCalendars();
    const first = $('[data-calendar="pop"] .day:not(:disabled)');
    if (first) first.focus({ preventScroll: true });
  }
  function closePop() {
    pop.hidden = true;
    $$("[data-date-field]").forEach((f) => f.setAttribute("aria-expanded", "false"));
  }
  $$("[data-date-field]").forEach((f) => f.addEventListener("click", () => (pop.hidden ? openPop(f.dataset.dateField) : closePop())));
  $("[data-pop-done]").addEventListener("click", closePop);
  document.addEventListener("click", (e) => {
    if (!pop.hidden && !e.target.closest("[data-date-pop],[data-date-field],[data-reserve],[data-book],[data-day],[data-sheet-open]")) closePop();
  });

  // Guests
  const gPanel = $("#guest-panel"), gToggle = $("[data-guests-toggle]");
  gToggle.addEventListener("click", () => {
    const open = gPanel.hidden;
    gPanel.hidden = !open;
    gToggle.setAttribute("aria-expanded", String(open));
  });
  function syncGuests() {
    const total = guests.adults + guests.children;
    $$(".g-row").forEach((row) => {
      const k = row.dataset.g, [minus, plus] = $$("button", row);
      $("output", row).textContent = guests[k];
      minus.disabled = guests[k] <= (k === "adults" ? 1 : 0);
      plus.disabled = (k === "adults" || k === "children") ? total >= MAX_GUESTS : k === "pets" ? guests.pets >= 1 : guests.infants >= 4;
    });
    const parts = [`${total} guest${total > 1 ? "s" : ""}`];
    if (guests.infants) parts.push(`${guests.infants} infant${guests.infants > 1 ? "s" : ""}`);
    if (guests.pets) parts.push("1 pet");
    $("[data-guest-label]").textContent = parts.join(", ");
    $("[data-guest-label]").classList.add("set");
    updateBooking();
  }
  $$(".g-row").forEach((row) => $$("button", row).forEach((b) => b.addEventListener("click", () => {
    guests[row.dataset.g] += +b.dataset.step;
    syncGuests();
  })));

  function quote() {
    if (!checkIn || !checkOut) return null;
    const nights = nightsBetween(checkIn, checkOut);
    const sub = nights * NIGHTLY, pet = guests.pets * PET * nights;
    const tax = Math.floor((sub + CLEANING + pet) * 0.16);
    return { nights, sub, pet, tax, total: sub + CLEANING + pet + tax };
  }
  function breakdownHtml(q) {
    return `<div><dt>${money(NIGHTLY)} × ${q.nights} nights</dt><dd>${money(q.sub)}</dd></div>
      <div><dt>Cleaning fee</dt><dd>${money(CLEANING)}</dd></div>
      ${q.pet ? `<div><dt>Pet fee</dt><dd>${money(q.pet)}</dd></div>` : ""}
      <div class="nofee"><dt>Service fee <small>Direct booking — no platform fees!</small></dt><dd><s>${money(0)}</s></dd></div>
      <div><dt>Taxes (16% IVA)</dt><dd>${money(q.tax)}</dd></div>
      <div class="total"><dt>Total</dt><dd>${money(q.total)}</dd></div>`;
  }
  function updateBooking() {
    if (!$("[data-in-label]")) return;
    const inL = $("[data-in-label]"), outL = $("[data-out-label]");
    inL.textContent = checkIn ? fmt(checkIn, { month: "numeric", day: "numeric", year: "numeric" }) : "Add date";
    outL.textContent = checkOut ? fmt(checkOut, { month: "numeric", day: "numeric", year: "numeric" }) : "Add date";
    inL.classList.toggle("set", !!checkIn);
    outL.classList.toggle("set", !!checkOut);
    $("[data-pop-hint]").textContent = !checkIn ? "Select check-in" : !checkOut ? "Select checkout · 3-night minimum" : `${nightsBetween(checkIn, checkOut)} nights selected`;
    const q = quote();
    const bd = $("[data-breakdown]");
    bd.hidden = !q;
    const range = $("[data-range-label]"), mb = $("[data-mb-dates]");
    if (q) {
      $("[data-nights-label]").textContent = `${money(NIGHTLY)} × ${q.nights} nights`;
      $("[data-sub]").textContent = money(q.sub);
      $("[data-clean]").textContent = money(CLEANING);
      $("[data-pet-row]").hidden = !q.pet;
      $("[data-pet]").textContent = money(q.pet);
      $("[data-tax]").textContent = money(q.tax);
      $("[data-total]").textContent = money(q.total);
      $(".nofee s").textContent = money(0);
      range.textContent = `${q.nights} nights in Tulum · ${fmt(checkIn)} – ${fmt(checkOut, { month: "short", day: "numeric", year: "numeric" })}`;
      mb.textContent = `${fmt(checkIn)} – ${fmt(checkOut)} · ${money(q.total)} total`;
    } else {
      range.textContent = checkIn ? `Check-in ${fmt(checkIn)} · select checkout (3-night minimum)` : "Select your check-in date · 3-night minimum";
      mb.textContent = checkIn ? `${fmt(checkIn)} – select checkout` : "Add dates · 3-night minimum";
    }
  }

  // Mobile sheet
  const card = $(".booking-card"), backdrop = $("[data-sheet-backdrop]");
  function openSheet() {
    card.classList.add("open");
    backdrop.hidden = false;
    document.body.style.overflow = "hidden";
    $("[data-sheet-close]").focus({ preventScroll: true });
  }
  function closeSheet() {
    card.classList.remove("open");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }
  $$("[data-sheet-open]").forEach((b) => b.addEventListener("click", () => {
    openSheet();
    if (b.hasAttribute("data-mb-reserve") && !quote()) openPop(checkIn ? "out" : "in");
  }));
  $("[data-sheet-close]").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!pop.hidden) closePop();
    else if (card.classList.contains("open")) closeSheet();
    if (!gPanel.hidden) { gPanel.hidden = true; gToggle.setAttribute("aria-expanded", "false"); }
  });

  $("[data-book]").addEventListener("click", () => {
    if (mobile()) { openSheet(); if (!quote()) openPop(checkIn ? "out" : "in"); return; }
    $("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
    if (!quote()) setTimeout(() => openPop(checkIn ? "out" : "in"), 350);
  });

  // Reserve
  const resModal = modal("reserve");
  $("[data-reserve]").addEventListener("click", () => {
    const q = quote();
    if (!q) { openPop(checkIn ? "out" : "in"); msg(""); return; }
    $("[data-res-summary]").textContent = `${fmt(checkIn)} – ${fmt(checkOut, { month: "short", day: "numeric", year: "numeric" })} · ${$("[data-guest-label]").textContent}`;
    $("[data-res-breakdown]").innerHTML = breakdownHtml(q);
    $("[data-res-ref]").textContent = "";
    const btn = $("[data-res-confirm]");
    btn.disabled = false;
    btn.textContent = "Send request";
    if (mobile()) closeSheet();
    resModal.showModal();
  });
  $("[data-res-confirm]").addEventListener("click", (e) => {
    const ref = `SD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    $("[data-res-ref]").textContent = `Request ${ref} saved in this browser demo — no payment was taken and nothing was sent.`;
    e.target.disabled = true;
    e.target.textContent = "Request sent";
    toast("Reservation request created (demo)");
  });

  let wasMobile = mobile();
  window.addEventListener("resize", () => {
    if (mobile() !== wasMobile) { wasMobile = mobile(); closeSheet(); renderCalendars(); }
  });

  renderCalendars();
  syncGuests();
  applyCurrency();
})();
