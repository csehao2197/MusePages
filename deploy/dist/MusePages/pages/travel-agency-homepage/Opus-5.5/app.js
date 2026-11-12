(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  /* Nav: transparent over hero, solid after; mobile drawer */
  const nav = $("#nav"), hero = $(".hero"), heroBg = $("#heroBg");
  let ticking = false;
  function onScroll() {
    nav.classList.toggle("solid", window.scrollY > 40);
    if (ticking || reduced) return;
    ticking = true;
    requestAnimationFrame(() => { const y = window.scrollY; if (y < hero.offsetHeight) heroBg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`; ticking = false; });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const burger = $("#burger"), drawer = $("#drawer"), scrim = $("#scrim");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    scrim.hidden = !open;
    document.body.classList.toggle("locked", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  }
  burger.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
  scrim.addEventListener("click", () => setDrawer(false));
  drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setDrawer(false); });

  /* Destinations */
  const dests = [
    { name: "Santorini, Greece", scene: "santorini", price: 2499, days: 7, rating: 4.9, reviews: 128, tag: "Most Popular", styles: ["beach", "luxury", "food"], featured: true },
    { name: "Kyoto, Japan", scene: "bamboo", price: 3199, days: 10, rating: 4.8, reviews: 94, tag: "Cultural", styles: ["cultural", "food"], featured: true },
    { name: "Costa Rica", scene: "bridge", price: 1899, days: 8, rating: 4.9, reviews: 156, tag: "Adventure", styles: ["adventure", "family", "beach"], featured: true },
    { name: "Amalfi Coast, Italy", scene: "amalfi", price: 3499, days: 9, rating: 4.9, reviews: 112, tag: "Luxury", styles: ["luxury", "food", "beach"], featured: true },
    { name: "Bali, Indonesia", scene: "terraces", price: 2399, days: 10, rating: 4.8, reviews: 203, tag: "Deal", styles: ["beach", "cultural", "adventure"] },
    { name: "Iceland", scene: "mountain", price: 2899, days: 8, rating: 4.9, reviews: 87, tag: "Adventure", styles: ["adventure", "family"] },
    { name: "Patagonia", scene: "mountain", price: 3899, days: 12, rating: 4.9, reviews: 61, tag: "Adventure", styles: ["adventure"] },
    { name: "Maldives", scene: "beach", price: 4299, days: 7, rating: 5.0, reviews: 74, tag: "Luxury", styles: ["beach", "luxury"] },
  ];
  const styleNames = { beach: "Beach & Island", adventure: "Adventure", cultural: "Cultural", luxury: "Luxury", family: "Family", food: "Food & Wine" };
  const wish = new Set();
  let filter = { style: "", dest: "", all: false };
  function renderDests() {
    let list = dests.filter((d) => (filter.style ? d.styles.includes(filter.style) : true) && (filter.dest ? d.name === filter.dest : true));
    if (!filter.style && !filter.dest && !filter.all) list = list.filter((d) => d.featured);
    $("#dests").innerHTML = list.length ? list.map((d) => `
      <article class="dest">
        <div class="dest-img"><div data-scene="${d.scene}"></div><span class="dtag${d.tag === "Most Popular" || d.tag === "Deal" ? " hot" : ""}">${d.tag}</span>
          <button type="button" class="heart" aria-pressed="${wish.has(d.name)}" aria-label="Save ${d.name} to wishlist" data-name="${d.name}">${icon("heart")}</button></div>
        <div class="dest-b">
          <div class="dmeta"><span class="dd">${icon("clock")}${d.days} days</span><span class="drate">${icon("star")}${d.rating.toFixed(1)} <small>(${d.reviews} reviews)</small></span></div>
          <h3><a href="#plan" data-plan="${d.name}">${d.name}</a></h3>
          <p class="dprice">From <strong>$${d.price.toLocaleString()}</strong>/person · ${d.days} days</p>
        </div></article>`).join("") : `<p class="no-match">No trips match yet — <button class="link" type="button" id="noMatchClear">see all destinations</button></p>`;
    window.__renderScenes($("#dests"));
    const fb = $("#filterbar");
    const label = filter.dest ? `Showing trips to <strong>${filter.dest}</strong>` : filter.style ? `Showing <strong>${styleNames[filter.style]}</strong> trips (${list.length})` : filter.all ? `Showing all ${list.length} destinations` : "";
    fb.hidden = !label;
    $("#filterText").innerHTML = label;
    $("#viewAll").hidden = filter.all || !!filter.style || !!filter.dest;
    $("#dests").scrollLeft = 0;
  }
  const setFilter = (f) => { filter = { style: "", dest: "", all: false, ...f }; renderDests(); };
  $("#dests").addEventListener("click", (e) => {
    const h = e.target.closest(".heart");
    if (h) {
      const n = h.dataset.name;
      wish.has(n) ? wish.delete(n) : wish.add(n);
      h.setAttribute("aria-pressed", wish.has(n));
      $("#wishCount").hidden = !wish.size; $("#wishCount").textContent = wish.size;
      toast(wish.has(n) ? `${n} added to your wishlist` : `${n} removed from your wishlist`);
      return;
    }
    const a = e.target.closest("[data-plan]");
    if (a) { e.preventDefault(); openPlan(a.dataset.plan); }
    if (e.target.closest("#noMatchClear")) setFilter({ all: true });
  });
  $("#viewAll").addEventListener("click", () => setFilter({ all: true }));
  $("#clearFilter").addEventListener("click", () => setFilter({}));
  $("#wishBtn").addEventListener("click", () => toast(wish.size ? `Wishlist: ${[...wish].join(", ")}` : "Your wishlist is empty — tap a heart to save a destination."));
  $$(".style").forEach((b) => b.addEventListener("click", () => { setFilter({ style: b.dataset.style }); $("#destinations").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }));
  $$(".trending a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setFilter({ dest: a.dataset.dest }); $("#destinations").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }));
  renderDests();

  /* Trip search */
  let travelers = 2;
  const syncT = () => { $("#tCount").textContent = `${travelers} Adult${travelers > 1 ? "s" : ""}`; $("#tMinus").disabled = travelers <= 1; $("#tPlus").disabled = travelers >= 12; };
  $("#tMinus").addEventListener("click", () => { travelers--; syncT(); });
  $("#tPlus").addEventListener("click", () => { travelers++; syncT(); });
  syncT();
  $("#tsToggle").addEventListener("click", (e) => { const open = !$("#tsFields").classList.contains("open"); $("#tsFields").classList.toggle("open", open); e.currentTarget.setAttribute("aria-expanded", open); });
  $("#tripSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#tsErr"), from = $("#tsFrom").value, to = $("#tsTo").value;
    if (!from || !to || to <= from) { err.textContent = "Choose a return date after your departure date."; err.hidden = false; return; }
    err.hidden = true;
    const dest = $("#tsDest").value, style = $("#tsStyle").value;
    setFilter({ dest, style: dest ? "" : style, all: !dest && !style });
    const nights = Math.round((new Date(to) - new Date(from)) / 864e5);
    toast(`${dest || (style ? styleNames[style] + " trips" : "All destinations")} · ${nights} nights · ${travelers} traveler${travelers > 1 ? "s" : ""}`);
    $("#destinations").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* Countdown: ends 2d 14h 32m after the page opens (demo timer) */
  const end = Date.now() + ((2 * 24 + 14) * 60 + 32) * 60000;
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const left = Math.max(0, end - Date.now()), s = Math.floor(left / 1000);
    $("#cdD").textContent = Math.floor(s / 86400); $("#cdH").textContent = pad(Math.floor((s % 86400) / 3600));
    $("#cdM").textContent = pad(Math.floor((s % 3600) / 60)); $("#cdS").textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);
  let spots = 6;
  $("#claimBtn").addEventListener("click", () => {
    if (spots > 1) spots--;
    $("#spots").textContent = spots;
    openPlan("Bali Explorer — 10 Days (Deal of the Week, $2,399/person)");
  });

  /* Count-up stats */
  const counters = $$("[data-to]");
  const run = (el) => {
    const to = +el.dataset.to, suf = el.dataset.suf || "";
    if (reduced) { el.textContent = to.toLocaleString() + suf; return; }
    const t0 = performance.now();
    const step = (t) => { const p = Math.min(1, (t - t0) / 1500); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach(run);

  /* Plan dialog (mock) */
  const dlg = $("#planDlg"), form = $("#planForm");
  function openPlan(where) {
    $("#planErr").hidden = true;
    if (where) $("#planWhere").value = where;
    $("#planSub").textContent = where ? `Tell us a little about your ${where.split(" (")[0]} trip and an expert will reply within one business day.` : "Tell us a little and a travel expert will reply within one business day.";
    dlg.showModal();
    form.querySelector("[name=name]").focus();
  }
  $$("[data-open=planDlg]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openPlan($("#tsDest").value); }));
  $$('a[href="#plan"]:not([data-plan]):not([data-open])').forEach((a) => a.addEventListener("click", (e) => { if (a.classList.contains("btn")) { e.preventDefault(); openPlan($("#tsDest").value); } }));
  form.addEventListener("submit", (e) => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    const name = form.querySelector("[name=name]").value.trim(), email = form.querySelector("[name=email]").value.trim();
    const err = $("#planErr");
    if (!name) { err.textContent = "Please enter your name."; err.hidden = false; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = "Please enter a valid email address."; err.hidden = false; return; }
    dlg.close();
    toast(`Thanks, ${name}! A Wanderly expert will be in touch (demo — nothing was sent).`);
    form.reset();
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  /* Newsletter (mock) */
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nEmail").value.trim(), m = $("#newsMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.textContent = "Please enter a valid email address."; return; }
    m.textContent = "You're on the list! Watch for this week's secret deals (demo).";
    $("#nEmail").value = "";
  });
})();
