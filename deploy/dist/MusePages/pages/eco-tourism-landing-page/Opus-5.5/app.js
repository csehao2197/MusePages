(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  // Header
  const bar = $(".topbar");
  const hero = $(".hero");
  const syncBar = () => bar.classList.toggle("solid", window.scrollY > hero.offsetHeight - 80 || $("#menu").classList.contains("open"));
  const mt = $("#menuToggle"), menu = $("#menu");
  mt.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    mt.setAttribute("aria-expanded", open);
    mt.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mt.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    syncBar();
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a") && menu.classList.contains("open")) mt.click(); });

  // Floating leaves that drift with scroll
  const pWrap = $("#particles");
  const leaves = reduced ? [] : Array.from({ length: 14 }, (_, i) => {
    const el = document.createElement("span");
    el.className = "particle";
    el.innerHTML = icon("leaf");
    el.style.left = `${(i * 71) % 100}%`;
    el.style.top = `${10 + ((i * 37) % 70)}%`;
    el.style.width = el.style.height = `${10 + (i % 4) * 5}px`;
    pWrap.appendChild(el);
    return { el, speed: 0.15 + (i % 5) * 0.08, sway: (i % 2 ? 1 : -1) * (8 + i), rot: i * 25 };
  });
  let ticking = false;
  function onScroll() {
    syncBar();
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < hero.offsetHeight) leaves.forEach((l) => { l.el.style.transform = `translate(${Math.sin(y / 120 + l.rot) * l.sway}px, ${-y * l.speed}px) rotate(${l.rot + y * 0.15}deg)`; });
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  syncBar();

  // Counters
  const fmt = (n) => n.toLocaleString("en-US");
  const counters = $$("[data-count]");
  const runCounter = (el) => {
    const end = Number(el.dataset.count), suf = el.dataset.suffix || "";
    if (reduced) { el.textContent = fmt(end) + suf; return; }
    const t0 = performance.now(), dur = 1600;
    const step = (t) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(Math.round(end * e)) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); } }), { threshold: 0.4 });
    counters.forEach((c) => io.observe(c));
  } else counters.forEach(runCounter);

  // Trips
  const trips = [
    ["Costa Rica Rainforest Retreat", 7, 2450, "canopy", ["Wildlife", "Rainforest", "Carbon Neutral"], "Plants 50 trees per booking", 4.9, 127],
    ["Norwegian Fjord Kayaking", 5, 1890, "fjord", ["Adventure", "Nordic", "Zero Waste"], "100% electric transport included", 4.8, 89],
    ["Borneo Orangutan Conservation", 10, 3200, "orangutan", ["Conservation", "Wildlife", "Volunteering"], "3 days hands-on conservation work", 5.0, 64],
    ["Iceland Geothermal Explorer", 6, 2100, "geo", ["Geothermal", "Photography", "Eco-Lodge"], "Powered entirely by renewable energy", 4.9, 103],
    ["Kenyan Safari & Community Stay", 8, 2800, "savanna", ["Safari", "Community", "Conservation"], "Funds local Maasai school programs", 4.9, 91],
    ["Galápagos Marine Biology Expedition", 9, 4500, "turtle", ["Marine", "Science", "Expedition"], "Led by marine biologists", 5.0, 42],
  ];
  $("#tripGrid").innerHTML = trips.map(([name, days, price, scene, tags, hl, rating, reviews]) => `
    <article class="trip">
      <div class="trip-img"><div data-scene="${scene}"></div><span class="eco-badge">${icon("leaf")}Eco Certified</span></div>
      <div class="trip-body">
        <div class="trip-meta"><span>${icon("clock")}${days} days</span><span class="rate">${icon("star")}${rating.toFixed(1)} <small>(${reviews} reviews)</small></span></div>
        <h3>${name.replace("&", "&amp;")}</h3>
        <ul class="tags">${tags.map((t) => `<li>${t}</li>`).join("")}</ul>
        <p class="highlight">${icon("sprout")}${hl}</p>
        <div class="trip-foot"><span class="price">from <strong>$${fmt(price)}</strong>/person</span><a class="view" href="#calculator" data-trip="${name}">View Trip ${icon("arrow")}</a></div>
      </div>
    </article>`).join("");
  window.__renderScenes($("#tripGrid"));
  $("#tripGrid").addEventListener("click", (e) => {
    const v = e.target.closest(".view");
    if (!v) return;
    const dest = $("#dest");
    const match = [...dest.options].find((o) => v.dataset.trip.startsWith(o.dataset.trip));
    if (match) dest.value = match.value;
    toast(`${v.dataset.trip}: estimate its footprint below.`);
  });

  // Lodge scroller
  const track = $("#lodgeTrack"), lodges = $$(".lodge", track), ldots = $("#lodgeDots");
  ldots.innerHTML = lodges.map((l, i) => `<button type="button" aria-label="Show ${l.querySelector("h3").textContent}" data-i="${i}"></button>`).join("");
  const goLodge = (i) => track.scrollTo({ left: lodges[i].offsetLeft - lodges[0].offsetLeft, behavior: reduced ? "auto" : "smooth" });
  const lodgeIndex = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= max - 4) return lodges.length - 1;
    return lodges.reduce((best, l, i) => Math.abs(l.offsetLeft - lodges[0].offsetLeft - track.scrollLeft) < Math.abs(lodges[best].offsetLeft - lodges[0].offsetLeft - track.scrollLeft) ? i : best, 0);
  };
  const syncLodges = () => {
    const i = lodgeIndex();
    $$("button", ldots).forEach((b, j) => b.setAttribute("aria-current", i === j));
    $("#lodgePrev").disabled = track.scrollLeft <= 4;
    $("#lodgeNext").disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
  };
  ldots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) goLodge(Number(b.dataset.i)); });
  $("#lodgePrev").addEventListener("click", () => goLodge(Math.max(0, lodgeIndex() - 1)));
  $("#lodgeNext").addEventListener("click", () => goLodge(Math.min(lodges.length - 1, lodgeIndex() + 1)));
  track.addEventListener("scroll", () => requestAnimationFrame(syncLodges), { passive: true });
  window.addEventListener("resize", syncLodges);
  syncLodges();

  // Carbon calculator (estimate model: great-circle distance × 0.15 kg CO2/passenger-km, round trip)
  const cities = { "New York": [40.71, -74.01], "Los Angeles": [34.05, -118.24], "Chicago": [41.88, -87.63], "San Francisco": [37.77, -122.42], "Toronto": [43.65, -79.38], "London": [51.51, -0.13], "Paris": [48.86, 2.35], "Berlin": [52.52, 13.4], "Amsterdam": [52.37, 4.9], "Madrid": [40.42, -3.7], "Sydney": [-33.87, 151.21], "Singapore": [1.35, 103.82], "Tokyo": [35.68, 139.69], "Dubai": [25.2, 55.27], "Mexico City": [19.43, -99.13], "São Paulo": [-23.55, -46.63], "Seattle": [47.61, -122.33], "Boston": [42.36, -71.06], "Miami": [25.76, -80.19], "Denver": [39.74, -104.99] };
  const dests = [["Costa Rica", [9.93, -84.08], "Costa Rica"], ["Norway", [61.0, 7.0], "Norwegian"], ["Borneo", [1.55, 110.36], "Borneo"], ["Iceland", [64.15, -21.94], "Iceland"], ["Kenya", [-1.29, 36.82], "Kenyan"], ["Galápagos", [-0.74, -90.31], "Galápagos"]];
  const dest = $("#dest");
  dest.innerHTML = dests.map(([n, , t], i) => `<option value="${i}" data-trip="${t}">${n}</option>`).join("");
  const km = ([a, b], [c, d]) => { const r = Math.PI / 180, x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };
  const from = $("#from"), list = $("#fromList");
  let active = -1, matches = [];
  function renderList() {
    const q = from.value.trim().toLowerCase();
    matches = q ? Object.keys(cities).filter((c) => c.toLowerCase().includes(q)).slice(0, 6) : [];
    active = -1;
    list.innerHTML = matches.map((c, i) => `<li role="option" id="opt${i}" aria-selected="false" data-c="${c}">${c}<small>${Math.round(km(cities[c], dests[dest.value][1])).toLocaleString()} km</small></li>`).join("");
    const show = matches.length > 0;
    list.hidden = !show;
    from.setAttribute("aria-expanded", show);
  }
  const choose = (c) => { from.value = c; list.hidden = true; from.setAttribute("aria-expanded", "false"); from.removeAttribute("aria-activedescendant"); };
  from.addEventListener("input", renderList);
  from.addEventListener("keydown", (e) => {
    if (list.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length;
      $$("li", list).forEach((li, i) => li.setAttribute("aria-selected", i === active));
      from.setAttribute("aria-activedescendant", `opt${active}`);
    } else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(matches[active]); }
    else if (e.key === "Escape") { list.hidden = true; }
  });
  list.addEventListener("mousedown", (e) => { const li = e.target.closest("li"); if (li) { e.preventDefault(); choose(li.dataset.c); } });
  from.addEventListener("blur", () => setTimeout(() => { list.hidden = true; from.setAttribute("aria-expanded", "false"); }, 100));
  let travelers = 2;
  const trav = $("#trav");
  const syncTrav = () => { trav.textContent = travelers; $("#travMinus").disabled = travelers <= 1; $("#travPlus").disabled = travelers >= 8; };
  $("#travMinus").addEventListener("click", () => { travelers = Math.max(1, travelers - 1); syncTrav(); });
  $("#travPlus").addEventListener("click", () => { travelers = Math.min(8, travelers + 1); syncTrav(); });
  syncTrav();
  $("#calcForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#calcErr");
    const city = Object.keys(cities).find((c) => c.toLowerCase() === from.value.trim().toLowerCase());
    if (!city) { err.textContent = "Choose a departure city from the suggestions."; err.hidden = false; from.focus(); return; }
    err.hidden = true;
    const d = dests[dest.value];
    const dist = km(cities[city], d[1]);
    const kg = Math.round(dist * 2 * 0.15 * travelers + 45 * travelers * 7);
    const trees = Math.ceil((kg / 1000) * 2 * 40); // 200% offset, ~25 kg CO2/tree/year over the first years
    $("#rCo2").textContent = `${fmt(kg)} kg`;
    $("#rTrees").textContent = fmt(trees);
    $("#rCost").textContent = `$${fmt(Math.round((kg / 1000) * 2 * 18))}`;
    $("#rNote").textContent = `${city} → ${d[0]} for ${travelers} traveler${travelers > 1 ? "s" : ""}. We cover the 200% offset — your cost: $0.`;
    $("#calcResult").hidden = false;
  });

  // Testimonials
  const quotes = $$(".quote"), qdots = $("#quoteDots");
  qdots.innerHTML = quotes.map((_, i) => `<button type="button" aria-label="Show testimonial ${i + 1}" data-i="${i}"></button>`).join("");
  let qi = 0, timer = null, paused = reduced;
  const showQuote = (i) => {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach((q, j) => { q.classList.toggle("active", j === qi); q.setAttribute("aria-hidden", j !== qi); });
    $$("button", qdots).forEach((b, j) => b.setAttribute("aria-current", j === qi));
  };
  const restart = () => { clearInterval(timer); if (!paused) timer = setInterval(() => showQuote(qi + 1), 6000); };
  qdots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { showQuote(Number(b.dataset.i)); restart(); } });
  const pb = $("#pauseBtn");
  pb.textContent = paused ? "Play" : "Pause";
  pb.setAttribute("aria-pressed", paused);
  pb.addEventListener("click", () => { paused = !paused; pb.textContent = paused ? "Play" : "Pause"; pb.setAttribute("aria-pressed", paused); restart(); });
  let sx = null;
  const slides = $("#slides");
  slides.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  slides.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 40) { showQuote(qi + (dx < 0 ? 1 : -1)); restart(); } });
  $("#carousel").addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { showQuote(qi + (e.key === "ArrowRight" ? 1 : -1)); restart(); } });
  showQuote(0);
  restart();

  // Newsletter (mock)
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#email").value.trim(), msg = $("#newsMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.textContent = "Please enter a valid email address."; msg.className = "news-msg err"; return; }
    msg.textContent = "You're in! A tree will be planted in your name (demo — nothing was sent).";
    msg.className = "news-msg ok";
    $("#email").value = "";
  });
})();
