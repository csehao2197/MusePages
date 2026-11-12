(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Toast
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }
  $$("[data-toast]").forEach((b) => b.addEventListener("click", () => toast(b.dataset.toast)));

  // Header shadow + mobile menu
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const navToggle = $("#navToggle"), navLinks = $("#navLinks");
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navToggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  });
  navLinks.addEventListener("click", (e) => { if (e.target.closest("a") && navLinks.classList.contains("open")) navToggle.click(); });

  // At a glance accordion (mobile only)
  const gToggle = $("#glanceToggle"), gBody = $("#glanceBody");
  const mq = window.matchMedia("(max-width: 900px)");
  function syncGlance() {
    if (mq.matches) { gToggle.setAttribute("aria-expanded", "false"); gBody.hidden = true; }
    else { gToggle.setAttribute("aria-expanded", "true"); gBody.hidden = false; }
  }
  gToggle.addEventListener("click", () => {
    if (!mq.matches) return;
    const open = gToggle.getAttribute("aria-expanded") !== "true";
    gToggle.setAttribute("aria-expanded", open);
    gBody.hidden = !open;
  });
  mq.addEventListener("change", syncGlance);
  syncGlance();
  $("#pdfBtn").addEventListener("click", () => toast("Your Tokyo PDF guide is being prepared — demo download only."));

  // Attractions
  const attractions = [
    { name: "Senso-ji Temple", hood: "Asakusa", cat: ["culture"], desc: "Tokyo's oldest temple, dating to 645 AD, with the iconic Kaminarimon thunder gate", time: "2-3 hours", cost: "Free", rating: 4.8, scene: "temple" },
    { name: "Shibuya Crossing", hood: "Shibuya", cat: ["culture", "shopping"], desc: "The world's busiest pedestrian crossing — up to 3,000 people cross at once", time: "30 min", cost: "Free", rating: 4.6, scene: "crossing" },
    { name: "Tsukiji Outer Market", hood: "Chuo", cat: ["food"], desc: "Street food paradise with the freshest sushi, tamagoyaki, and wagyu skewers", time: "2-3 hours", cost: "Free entry", rating: 4.9, scene: "market" },
    { name: "Meiji Shrine", hood: "Harajuku", cat: ["culture", "nature"], desc: "A serene Shinto shrine surrounded by 170 acres of forest in the heart of the city", time: "1-2 hours", cost: "Free", rating: 4.7, scene: "shrine" },
    { name: "TeamLab Borderless", hood: "Odaiba", cat: ["culture"], desc: "An immersive digital art museum with stunning interactive light installations", time: "3-4 hours", cost: "¥3,800", rating: 4.8, scene: "lights" },
    { name: "Akihabara Electric Town", hood: "Akihabara", cat: ["shopping"], desc: "Neon-drenched district for anime, manga, retro games, and electronics", time: "3-4 hours", cost: "Free", rating: 4.5, scene: "neon" },
  ];
  const saved = new Set();
  const list = $("#attractionList");
  list.innerHTML = attractions.map((a, i) => `
    <article class="card" data-cat="${a.cat.join(" ")}">
      <div class="card-img"><div data-scene="${a.scene}" role="img" aria-label="Illustration of ${esc(a.name)}"></div>
        <button class="save" type="button" aria-pressed="false" aria-label="Save ${esc(a.name)}" data-i="${i}">${icon("heart")}</button></div>
      <div class="card-body">
        <div class="card-top"><span class="tag">${icon("pin")}${esc(a.hood)}</span><span class="rating">${icon("star")}${a.rating}</span></div>
        <h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p>
        <ul class="meta"><li>${icon("clock")}${esc(a.time)}</li><li>${icon("banknote")}<strong>${esc(a.cost)}</strong></li></ul>
      </div></article>`).join("");
  // Render the newly added scenes.
  if (window.__renderScenes) window.__renderScenes(list);
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".save");
    if (!b) return;
    const a = attractions[b.dataset.i];
    const on = !saved.has(a.name);
    on ? saved.add(a.name) : saved.delete(a.name);
    b.setAttribute("aria-pressed", on);
    toast(on ? `${a.name} saved to your trip (${saved.size})` : `${a.name} removed from your trip`);
  });
  $$(".filters .chip").forEach((chip) => chip.addEventListener("click", () => {
    $$(".filters .chip").forEach((c) => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", c === chip); });
    const f = chip.dataset.filter;
    let shown = 0;
    $$(".card", list).forEach((card) => {
      const ok = f === "all" || card.dataset.cat.split(" ").includes(f);
      card.hidden = !ok;
      if (ok) shown++;
    });
    $("#attractionEmpty").hidden = shown > 0;
    list.scrollLeft = 0;
  }));

  // Itineraries
  const S = (name, note, time, ic = "pin") => ({ name, note, time, ic });
  const M = (name, note, time) => ({ name, note, time, ic: "utensils", meal: true });
  const base = [
    { title: "Old Tokyo & Electric Town", stops: [S("Senso-ji", "Arrive early before the crowds", "8:00", "landmark"), S("Nakamise Street", "Snack on ningyo-yaki", "9:30", "bag"), S("Tokyo Skytree", "Observation deck at 450m", "11:30"), M("Lunch", "Monja-yaki in Tsukishima", "13:30"), S("Akihabara", "Retro arcades & figure shops", "15:30", "gamepad"), M("Dinner", "Ramen in Shinjuku's Omoide Yokocho", "19:30")] },
    { title: "Shrines, Style & Skylines", stops: [S("Meiji Shrine", "Forest walk to the main hall", "9:00", "landmark"), S("Harajuku", "Takeshita Street & Omotesando", "11:00", "bag"), M("Lunch", "Gyoza at Harajuku Gyoza-ro", "12:30"), S("Shibuya Crossing", "Watch from the Starbucks window", "15:00"), S("Shibuya Sky", "Sunset slot recommended", "17:00", "sparkles"), M("Izakaya crawl", "Nonbei Yokocho alley", "19:30")] },
    { title: "Markets, Gardens & Night Views", stops: [S("Tsukiji Market", "Tamagoyaki & tuna skewers", "8:00", "store"), S("Ginza shopping", "Itoya stationery & depachika", "10:30", "bag"), M("Lunch", "Sushi omakase lunch set", "12:30"), S("Imperial Palace gardens", "East Gardens, free entry", "14:30", "flower"), S("Roppongi Hills", "Mori Tower night views", "19:00", "sparkles"), M("Dinner", "Yakitori in Azabu-Juban", "20:30")] },
  ];
  const five = [
    { title: "Day Trip to Kamakura", stops: [S("Great Buddha", "13m bronze Daibutsu", "9:30", "landmark"), S("Hase-dera", "Hillside temple & ocean views", "11:00"), M("Lunch", "Shirasu-don by the sea", "12:30"), S("Komachi-dori", "Street snacks & crafts", "15:00", "bag")] },
    { title: "Vintage, Art & Sumo", stops: [S("Shimokitazawa", "Vintage shopping & coffee", "10:00", "bag"), S("Odaiba & TeamLab", "Book timed entry", "14:00", "sparkles"), S("Sumo tournament", "Ryogoku Kokugikan (Jan, May, Sep)", "16:00", "landmark"), M("Dinner", "Chanko-nabe in Ryogoku", "19:00")] },
  ];
  const seven = [
    { title: "Hakone & Mt. Fuji", stops: [S("Romancecar to Hakone", "85 min from Shinjuku", "8:00", "train"), S("Lake Ashi cruise", "Fuji views on clear days", "10:30"), M("Lunch", "Soba near Owakudani", "12:30"), S("Onsen soak", "Day-use hot spring", "15:00", "sparkles")] },
    { title: "Yanaka, Toyosu & Ueno", stops: [S("Toyosu tuna auction", "Observation deck, 5:30 AM", "5:30", "store"), S("Yanaka old town", "Wooden houses & cat street", "10:00", "landmark"), M("Lunch", "Kakigori at a Yanaka cafe", "12:30"), S("Ueno museums", "Tokyo National Museum", "14:00", "landmark")] },
  ];
  const plans = { 3: base, 5: [...base, ...five], 7: [...base, ...five, ...seven] };
  const panel = $("#itPanel");
  const tabs = $$("#itTabs [role=tab]");
  let current = 3;
  function renderPlan(days) {
    current = days;
    panel.innerHTML = plans[days].map((d, i) => `
      <article class="day">
        <div class="day-label">Day ${i + 1}<small>${esc(d.title)}</small>${i >= 3 ? `<span class="tag tag-amber day-new">Added in ${i >= 5 ? 7 : 5}-day plan</span>` : ""}</div>
        <ol class="timeline">${d.stops.map((s) => `<li><span class="tl-ic${s.meal ? " meal" : ""}">${icon(s.ic)}</span><span class="tl-name">${esc(s.name)}<small>${esc(s.note)}</small></span><span class="tl-time">${esc(s.time)}</span></li>`).join("")}</ol>
      </article>`).join("");
    tabs.forEach((t) => {
      const on = Number(t.dataset.days) === days;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      if (on) panel.setAttribute("aria-labelledby", t.id);
    });
    $("#dlgLength").value = String(days);
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => renderPlan(Number(t.dataset.days)));
    t.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus();
      n.click();
    });
  });
  // Swipe between plans on touch devices.
  let sx = null, sy = null;
  panel.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  panel.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    const order = [3, 5, 7];
    const next = order[order.indexOf(current) + (dx < 0 ? 1 : -1)];
    if (next) renderPlan(next);
  });
  renderPlan(3);
  $("#customizeBtn").addEventListener("click", (e) => { e.preventDefault(); openDialog(); });

  // Month chart
  const months = [
    ["Jan", 6, 52, "cold"], ["Feb", 7, 56, "cold"], ["Mar", 11, 117, "best"], ["Apr", 16, 125, "best"],
    ["May", 20, 138, "best"], ["Jun", 23, 168, "hot"], ["Jul", 27, 154, "hot"], ["Aug", 29, 168, "hot"],
    ["Sep", 25, 210, "good"], ["Oct", 19, 198, "best"], ["Nov", 14, 93, "best"], ["Dec", 9, 51, "good"],
  ];
  const label = { best: "Best", good: "Good", hot: "Hot/Rainy", cold: "Cold" };
  $("#monthChart").innerHTML = months.map(([m, t, r, c]) => `
    <div class="month" data-c="${c}" title="${m}: ${t}°C average, ${r}mm rain — ${label[c]}">
      <span class="temp">${t}°</span>
      <div class="bars"><span class="bar-t" style="height:${Math.round((t / 30) * 160)}px"></span><span class="bar-r" style="height:${Math.round((r / 220) * 120)}px"></span></div>
      <span class="m">${m}</span><span class="rn">${r}mm</span>
      <span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${label[c]}</span>
    </div>`).join("");

  // Plan dialog (mock)
  const dlg = $("#planDialog"), form = $("#planForm"), err = $("#formError");
  function openDialog() { err.hidden = true; dlg.showModal(); form.querySelector("[name=name]").focus(); }
  $$("[data-open=planDialog]").forEach((b) => b.addEventListener("click", openDialog));
  form.addEventListener("submit", (e) => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault();
    const name = form.querySelector("[name=name]").value.trim(), email = form.querySelector("[name=email]").value.trim();
    const days = form.querySelector("[name=days]").value;
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = !name ? "Please enter your name." : "Please enter a valid email address.";
      err.hidden = false;
      return;
    }
    const ref = "WT-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    dlg.close();
    form.reset();
    toast(`Thanks, ${name}! Request ${ref} created for a ${days}-day Tokyo trip.`);
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
})();
