(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, c = "") => `<svg class="ic ${c}"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  /* ---------- Currency ---------- */
  const rates = { USD: [1, "en-US"], EUR: [0.92, "de-DE"], JPY: [151, "ja-JP"] };
  let cur = "USD";
  const money = (usd) => new Intl.NumberFormat(rates[cur][1], { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(usd * rates[cur][0]);

  /* ---------- Data: 245 deterministic mock hotels ---------- */
  let seed = 2026;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fill = (spec) => spec.flatMap(([v, n]) => Array(n).fill(v));
  const hoods = { Shinjuku: [30, 46, 3.4], Shibuya: [33, 64, 3.7], Ginza: [64, 60, 1.1], Asakusa: [78, 24, 4.6], Roppongi: [46, 68, 2.9], Akihabara: [66, 34, 2.0], Ueno: [68, 22, 3.6], Ikebukuro: [30, 18, 5.4], Otemachi: [58, 44, 0.4], Shinagawa: [50, 88, 6.2] };
  const pinned = [
    { name: "Park Hyatt Tokyo", stars: 5, rating: 9.4, reviews: 1284, type: "Hotel", hood: "Shinjuku", amen: ["Free WiFi", "Pool", "Gym", "Spa", "Restaurant", "Free Cancellation"], keyAmen: ["wifi", "pool", "gym", "spa", "utensils"], badge: "“Lost in Translation” filming location", room: "Deluxe King — City View", size: 45, price: 412, orig: 580, cancel: "Free cancellation until Apr 7", urgency: "Only 3 rooms left!", ad: true, kinds: ["tower", "room", "pool", "lobby"], hue: 215 },
    { name: "MUJI HOTEL GINZA", stars: 4, rating: 9.1, reviews: 876, type: "Hotel", hood: "Ginza", amen: ["Free WiFi", "Free Cancellation"], keyAmen: ["wifi", "utensils", "shirt"], badge: "Minimalist Design", room: "Type E — Double", size: 32, price: 198, cancel: "Free cancellation until Apr 10", kinds: ["room", "lobby", "tower", "room"], hue: 30 },
    { name: "Hoshinoya Tokyo", stars: 5, rating: 9.6, reviews: 542, type: "Ryokan", hood: "Otemachi", amen: ["Free WiFi", "Breakfast Included", "Onsen/Hot Spring", "Free Cancellation"], keyAmen: ["wifi", "flame", "spa", "utensils", "bell"], badge: "Traditional Ryokan", room: "Sakura Suite — Garden View", size: 56, price: 549, orig: 720, perk: "Includes breakfast & onsen access", kinds: ["tatami", "bath", "lobby", "tatami"], hue: 140 },
    { name: "Capsule Hotel Anshin Oyado", stars: 3, rating: 8.2, reviews: 2105, type: "Capsule Hotel", hood: "Shinjuku", amen: ["Free WiFi", "Onsen/Hot Spring"], keyAmen: ["wifi", "flame", "shirt", "sofa"], badge: "Budget Pick", room: "Premium Capsule — Male Floor", size: 0, price: 38, payAt: true, kinds: ["capsule", "bath", "lobby", "capsule"], hue: 220 },
  ];
  const take = (arr, v) => arr.splice(arr.indexOf(v), 1);
  const starsArr = fill([[5, 42], [4, 89], [3, 67], [2, 31], [1, 16]]);
  const typesArr = fill([["Hotel", 156], ["Ryokan", 34], ["Hostel", 28], ["Apartment", 18], ["Capsule Hotel", 9]]);
  const hoodArr = fill([["Shinjuku", 52], ["Shibuya", 41], ["Ginza", 38], ["Asakusa", 29], ["Roppongi", 22], ["Akihabara", 15], ["Ueno", 18], ["Ikebukuro", 16], ["Otemachi", 8], ["Shinagawa", 6]]);
  const ratingArr = [...Array.from({ length: 28 }, () => 9 + Math.floor(rnd() * 9) / 10), ...Array.from({ length: 36 }, () => 8 + Math.floor(rnd() * 10) / 10), ...Array.from({ length: 48 }, () => 7 + Math.floor(rnd() * 10) / 10), ...Array.from({ length: 133 }, () => 5.8 + Math.floor(rnd() * 12) / 10)];
  pinned.forEach((p) => { take(starsArr, p.stars); take(typesArr, p.type); take(hoodArr, p.hood); ratingArr.splice(ratingArr.findIndex((r) => (p.rating >= 9 ? r >= 9 : r >= 8 && r < 9)), 1); });
  [starsArr, typesArr, hoodArr, ratingArr].forEach(shuffle);
  // Give the highest star values to hotels/ryokans and the lowest to hostels/capsules, keeping exact totals.
  const lux = { Hotel: 2, Ryokan: 2.4, Apartment: 1.2, Hostel: 0, "Capsule Hotel": 0.2 };
  const order = typesArr.map((t, i) => [lux[t] + rnd() * 2.2, i]).sort((a, b) => b[0] - a[0]).map((x) => x[1]);
  const sortedStars = [...starsArr].sort((a, b) => b - a);
  order.forEach((i, k) => { starsArr[i] = sortedStars[k]; });
  // Keep ryokans/capsules out of 1-star; pair best ratings with higher stars loosely.
  const prefixes = ["Hotel", "Grand", "The", "Sakura", "Nest", "Tokyu Stay", "Bamboo", "Hikari", "Kiro", "Sora", "Hanare", "Tsuki", "Mori"];
  const suffixes = { Hotel: ["Hotel", "Inn", "Tower", "Residence", "House"], Ryokan: ["Ryokan", "Ryokan & Spa", "Inn"], Hostel: ["Hostel", "Backpackers", "Social Hostel"], Apartment: ["Apartments", "Suites", "Living"], "Capsule Hotel": ["Capsule", "Pod Hotel", "Cabin"] };
  const kindsFor = { Hotel: ["tower", "room", "lobby", "pool"], Ryokan: ["tatami", "bath", "lobby", "room"], Hostel: ["room", "lobby", "capsule", "room"], Apartment: ["room", "tower", "room", "lobby"], "Capsule Hotel": ["capsule", "bath", "lobby", "capsule"] };
  const amenAll = ["Free WiFi", "Breakfast Included", "Pool", "Gym", "Free Cancellation", "Airport Shuttle", "Onsen/Hot Spring"];
  const amenIcon = { "Free WiFi": "wifi", "Breakfast Included": "coffee", Pool: "pool", Gym: "gym", "Free Cancellation": "check", "Airport Shuttle": "bus", "Onsen/Hot Spring": "flame" };
  const hotels = pinned.map((p, i) => ({ ...p, id: "h" + i, pinned: true }));
  const usedNames = new Set(hotels.map((h) => h.name));
  for (let i = 0; i < 241; i++) {
    const type = typesArr[i], hood = hoodArr[i], stars = starsArr[i];
    let name;
    do name = `${prefixes[Math.floor(rnd() * prefixes.length)]} ${hood} ${suffixes[type][Math.floor(rnd() * suffixes[type].length)]}`; while (usedNames.has(name) && !(name += " " + (i % 9 + 2)));
    usedNames.add(name);
    const baseP = { 5: 360, 4: 190, 3: 115, 2: 72, 1: 52 }[stars] * { Hotel: 1, Ryokan: 1.35, Hostel: 0.45, Apartment: 0.9, "Capsule Hotel": 0.4 }[type];
    const price = Math.max(38, Math.min(795, Math.round(baseP * (0.75 + rnd() * 0.6))));
    const amen = amenAll.filter((a) => rnd() < ({ "Free WiFi": 0.92, "Breakfast Included": 0.38, Pool: stars >= 4 ? 0.4 : 0.05, Gym: stars >= 4 ? 0.6 : 0.15, "Free Cancellation": 0.55, "Airport Shuttle": 0.18, "Onsen/Hot Spring": type === "Ryokan" ? 0.85 : 0.08 }[a]));
    hotels.push({
      id: "h" + (i + 4), name, stars, rating: ratingArr[i], reviews: 40 + Math.floor(rnd() * 1900), type, hood, amen, price,
      orig: rnd() < 0.3 ? Math.round(price * (1.15 + rnd() * 0.3)) : null,
      keyAmen: amen.map((a) => amenIcon[a]).filter((x) => x !== "check").slice(0, 4),
      room: { Hotel: "Superior Double", Ryokan: "Japanese-style Room", Hostel: "Bed in 6-bed Dorm", Apartment: "One-Bedroom Apartment", "Capsule Hotel": "Standard Capsule" }[type], size: type === "Capsule Hotel" ? 0 : type === "Hostel" ? 0 : 16 + Math.floor(rnd() * 30),
      cancel: amen.includes("Free Cancellation") ? `Free cancellation until Apr ${8 + Math.floor(rnd() * 4)}` : null,
      urgency: rnd() < 0.12 ? `Only ${1 + Math.floor(rnd() * 4)} rooms left!` : null,
      payAt: rnd() < 0.2, kinds: kindsFor[type], hue: Math.floor(rnd() * 360), sold: rnd() < 0.06,
    });
  }
  hotels.forEach((h) => {
    const [cx, cy, dist] = hoods[h.hood];
    h.x = h.pinned ? cx + [0, 1, 0, -2][hotels.indexOf(h)] : cx + (rnd() - 0.5) * 9;
    h.y = h.pinned ? cy + [0, 0, 0, 2][hotels.indexOf(h)] : cy + (rnd() - 0.5) * 8;
    h.dist = Math.max(0.2, dist + (rnd() - 0.5) * 1.6);
    h.label = h.rating >= 9 ? "Exceptional" : h.rating >= 8 ? "Excellent" : h.rating >= 7 ? "Very Good" : h.rating >= 6 ? "Good" : "Pleasant";
  });
  hotels[1].label = "Excellent"; hotels[3].label = "Very Good";
  const minPrice = Math.min(...hotels.map((h) => h.price));

  /* ---------- Search state ---------- */
  const guests = { adults: 2, children: 0 };
  const nights = () => Math.max(1, Math.round((new Date($("#checkout").value) - new Date($("#checkin").value)) / 864e5));
  const rooms = () => Number($("#rooms").value);
  const fmtD = (v) => new Date(v + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const fmtDL = (v) => new Date(v + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const guestText = () => `${guests.adults} Adult${guests.adults > 1 ? "s" : ""}, ${guests.children} Child${guests.children === 1 ? "" : "ren"}`;

  /* ---------- Filters ---------- */
  const defaults = () => ({ pMin: 50, pMax: 800, stars: new Set(), guest: 0, type: new Set(), hood: new Set(), amen: new Set(), area: null });
  let F = defaults();
  const passes = (h, skip) =>
    (skip === "price" || ((F.pMin <= 50 || h.price >= F.pMin) && (F.pMax >= 800 || h.price <= F.pMax))) &&
    (skip === "stars" || !F.stars.size || F.stars.has(h.stars)) &&
    (skip === "guest" || h.rating >= F.guest) &&
    (skip === "type" || !F.type.size || F.type.has(h.type)) &&
    (skip === "hood" || !F.hood.size || F.hood.has(h.hood)) &&
    (skip === "amen" || [...F.amen].every((a) => h.amen.includes(a))) &&
    (!F.area || (h.x >= F.area[0] && h.x <= F.area[2] && h.y >= F.area[1] && h.y <= F.area[3]));
  const box = `<span class="box">${icon("check")}</span>`;
  const chk = (g, v, label) => `<label class="chk"><input type="checkbox" data-g="${g}" value="${esc(v)}">${box}<span class="lbl">${label}</span><span class="cnt" data-g="${g}" data-v="${esc(v)}"></span></label>`;
  $("#fStars").innerHTML = [5, 4, 3, 2, 1].map((s) => chk("stars", s, `<span class="stars" aria-label="${s} stars">${"★".repeat(s)}<span class="dim">${"★".repeat(5 - s)}</span></span>`)).join("");
  $("#fGuest").innerHTML = [[0, "Any rating"], [9, "9+ Exceptional"], [8, "8+ Excellent"], [7, "7+ Very Good"]].map(([v, l]) => `<label class="chk radio"><input type="radio" name="guest" data-g="guest" value="${v}"${v === 0 ? " checked" : ""}><span class="box round"></span><span class="lbl">${l}</span><span class="cnt" data-g="guest" data-v="${v}"></span></label>`).join("");
  $("#fType").innerHTML = ["Hotel", "Ryokan", "Hostel", "Apartment", "Capsule Hotel"].map((t) => chk("type", t, t)).join("");
  const hoodNames = ["Shinjuku", "Shibuya", "Ginza", "Asakusa", "Roppongi", "Akihabara", "Ueno", "Ikebukuro", "Otemachi", "Shinagawa"];
  $("#fHood").innerHTML = hoodNames.map((n, i) => `<div${i >= 6 ? ' class="more-hood" hidden' : ""}>${chk("hood", n, n)}</div>`).join("");
  $("#fAmen").innerHTML = amenAll.map((a) => chk("amen", a, `${icon(amenIcon[a])}${a}`)).join("");
  // Histogram
  const bins = Array(25).fill(0);
  hotels.forEach((h) => bins[Math.min(24, Math.floor(((h.price - 50) / 750) * 25))]++);
  const bmax = Math.max(...bins);
  $("#hist").innerHTML = bins.map((b) => `<span style="height:${Math.max(4, (b / bmax) * 100)}%"></span>`).join("");

  function counts() {
    $$(".cnt").forEach((c) => {
      const g = c.dataset.g, v = c.dataset.v;
      const n = hotels.filter((h) => passes(h, g) && (g === "stars" ? h.stars === +v : g === "guest" ? h.rating >= +v : g === "type" ? h.type === v : g === "hood" ? h.hood === v : h.amen.includes(v))).length;
      c.textContent = `(${n})`;
    });
  }
  function paintRange() {
    const lo = +$("#pMin").value, hi = +$("#pMax").value;
    $("#pMinV").textContent = lo <= 50 ? "Any" : money(lo);
    $("#pMaxV").textContent = money(hi) + (hi >= 800 ? "+" : "");
    $("#dualFill").style.left = ((lo - 50) / 750) * 100 + "%";
    $("#dualFill").style.width = ((hi - lo) / 750) * 100 + "%";
    $$("#hist span").forEach((s, i) => s.classList.toggle("on", 50 + (i + 0.5) * 30 >= lo && 50 + (i + 0.5) * 30 <= hi));
  }
  function syncUI() {
    $$(".filters input[type=checkbox]").forEach((c) => { const g = c.dataset.g; c.checked = F[g].has(g === "stars" ? +c.value : c.value); });
    $$(".filters input[name=guest]").forEach((r) => (r.checked = +r.value === F.guest));
    $("#pMin").value = F.pMin; $("#pMax").value = F.pMax;
    paintRange();
  }
  $("#filters").addEventListener("change", (e) => {
    const c = e.target;
    if (c.name === "guest") F.guest = +c.value;
    else if (c.dataset.g) { const s = F[c.dataset.g], v = c.dataset.g === "stars" ? +c.value : c.value; c.checked ? s.add(v) : s.delete(v); }
    else return;
    update();
  });
  $("#pMin").addEventListener("input", (e) => { if (+e.target.value > F.pMax - 25) e.target.value = F.pMax - 25; F.pMin = +e.target.value; paintRange(); update(); });
  $("#pMax").addEventListener("input", (e) => { if (+e.target.value < F.pMin + 25) e.target.value = F.pMin + 25; F.pMax = +e.target.value; paintRange(); update(); });
  $("#moreHood").addEventListener("click", (e) => { const open = e.currentTarget.getAttribute("aria-expanded") !== "true"; $$(".more-hood").forEach((d) => (d.hidden = !open)); e.currentTarget.setAttribute("aria-expanded", open); e.currentTarget.textContent = open ? "Show less" : "Show more"; });
  const clearAll = () => { F = defaults(); syncUI(); update(); };
  $("#clearAll").addEventListener("click", clearAll);
  $("#emptyClear").addEventListener("click", clearAll);

  /* ---------- Sort & view ---------- */
  let sortBy = "rec", view = "list", page = 1, perPage = 20, extra = 0;
  const sortNames = { rec: "Recommended", plh: "Price: Low to High", phl: "Price: High to Low", rating: "Guest Rating", dist: "Distance to Center" };
  const sorters = {
    rec: (a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (a.pinned && b.pinned ? hotels.indexOf(a) - hotels.indexOf(b) : (b.rating * 10 + b.stars * 4 - b.price / 40) - (a.rating * 10 + a.stars * 4 - a.price / 40)),
    plh: (a, b) => a.price - b.price, phl: (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews, dist: (a, b) => a.dist - b.dist,
  };
  $("#sortChips").innerHTML = Object.entries(sortNames).map(([k, v]) => `<label><input type="radio" name="sortc" value="${k}"${k === "rec" ? " checked" : ""}><span>${v}</span></label>`).join("");
  const setSort = (k) => { sortBy = k; $("#sort").value = k; $$("#sortChips input").forEach((r) => (r.checked = r.value === k)); page = 1; extra = 0; update(); };
  $("#sort").addEventListener("change", (e) => setSort(e.target.value));
  $("#sortChips").addEventListener("change", (e) => setSort(e.target.value));
  $$(".vbtn[data-view]").forEach((b) => b.addEventListener("click", () => { view = b.dataset.view; $$(".vbtn[data-view]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); }); $("#list").classList.toggle("grid", view === "grid"); }));

  /* ---------- Cards ---------- */
  const saved = new Set();
  let current = [];
  const photoIdx = {};
  const starsHTML = (n) => `<span class="stars" aria-label="${n} stars">${"★".repeat(n)}</span>`;
  const amenTitle = { wifi: "Free WiFi", pool: "Pool", gym: "Gym", spa: "Spa", utensils: "Restaurant", shirt: "Laundry", flame: "Onsen / Sauna", bell: "Room Service", sofa: "Lounge", coffee: "Breakfast", bus: "Airport Shuttle" };
  function card(h) {
    const n = nights() * rooms();
    const pi = photoIdx[h.id] || 0;
    const off = h.orig ? Math.round((1 - h.price / h.orig) * 100) : 0;
    return `<article class="card${h.sold ? " sold" : ""}" data-id="${h.id}">
      <div class="gal" data-id="${h.id}">
        <div class="slides" style="transform:translateX(-${pi * 100}%)">${h.kinds.map((k, i) => `<div class="slide">${window.__photo(k, h.hue + i * 12, `${h.name} photo ${i + 1}`)}</div>`).join("")}</div>
        <button class="g-nav prev" type="button" aria-label="Previous photo">${icon("chev-left")}</button><button class="g-nav next" type="button" aria-label="Next photo">${icon("chev-right")}</button>
        <div class="g-dots" aria-hidden="true">${h.kinds.map((_, i) => `<i class="${i === pi ? "on" : ""}"></i>`).join("")}</div>
        ${h.ad ? '<span class="ad">Ad</span>' : ""}
        <button class="save" type="button" aria-pressed="${saved.has(h.id)}" aria-label="Save ${esc(h.name)}">${icon("heart")}</button>
      </div>
      <div class="info">
        <div class="i-main">
          <p class="loc">${starsHTML(h.stars)}<span>· ${h.hood}</span></p>
          <h3><button type="button" class="open" data-id="${h.id}">${esc(h.name)}</button></h3>
          <p class="score"><span class="sc">${h.rating.toFixed(1)}</span><strong>${h.label}</strong><span>(${h.reviews.toLocaleString()} reviews)</span></p>
          ${h.badge ? `<span class="badge">${esc(h.badge)}</span>` : ""}
          <ul class="amen">${h.keyAmen.map((a) => `<li title="${amenTitle[a]}">${icon(a)}<span class="vh">${amenTitle[a]}</span></li>`).join("")}</ul>
          <p class="room">${esc(h.room)}${h.size ? ` · ${h.size}m²` : ""}</p>
          ${h.cancel ? `<p class="ok">${icon("check")}${h.cancel}</p>` : ""}${h.perk ? `<p class="ok">${icon("check")}${h.perk}</p>` : ""}${h.payAt ? `<p class="ok">${icon("check")}Pay at property</p>` : ""}
          ${h.urgency && !h.sold ? `<p class="urgent">${h.urgency}</p>` : ""}
        </div>
        <div class="i-price">
          ${off ? `<span class="off">${off}% off</span>` : ""}
          ${h.orig ? `<s>${money(h.orig)}</s>` : ""}
          <p class="pn"><strong>${money(h.price)}</strong>/night</p>
          <p class="tot">${money(h.price * n)} total for ${nights()} night${nights() > 1 ? "s" : ""}${rooms() > 1 ? `, ${rooms()} rooms` : ""}</p>
          <p class="taxes">Includes taxes &amp; fees</p>
          ${h.sold ? '<span class="soldtag">Sold out for your dates</span>' : `<button class="btn btn-blue book" type="button" data-id="${h.id}">Book Now</button>`}
        </div>
      </div></article>`;
  }
  function pages() { return Math.max(1, Math.ceil(current.length / perPage)); }
  function render() {
    const start = (page - 1) * perPage, end = Math.min(current.length, start + perPage * (1 + extra));
    $("#list").innerHTML = current.slice(start, end).map(card).join("");
    $("#empty").hidden = current.length > 0;
    const total = pages();
    const lastShownPage = Math.min(total, page + extra);
    const nums = [];
    for (let i = 1; i <= total; i++) if (i === 1 || i === total || Math.abs(i - page) <= 1 || (page <= 3 && i <= 3)) nums.push(i); else if (nums[nums.length - 1] !== "…") nums.push("…");
    $("#pager").innerHTML = current.length ? `<p>Showing ${start + 1}–${end} of ${current.length} results</p><div class="pg">
      <button type="button" data-p="${page - 1}" ${page === 1 ? "disabled" : ""} aria-label="Previous page">${icon("chev-left")}<span>Previous</span></button>
      ${nums.map((n) => (n === "…" ? '<span class="gap">…</span>' : `<button type="button" data-p="${n}" class="num${n >= page && n <= lastShownPage ? " on" : ""}" ${n === page ? 'aria-current="page"' : ""}>${n}</button>`)).join("")}
      <button type="button" data-p="${lastShownPage + 1}" ${lastShownPage >= total ? "disabled" : ""} aria-label="Next page"><span>Next</span>${icon("chev-right")}</button></div>` : "";
    $(".loadmore").hidden = lastShownPage >= total;
    observeCards();
  }
  $("#pager").addEventListener("click", (e) => { const b = e.target.closest("button[data-p]"); if (!b || b.disabled) return; page = +b.dataset.p; extra = 0; render(); $("#results").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); });
  $("#loadMore").addEventListener("click", () => { extra++; render(); });

  function chips() {
    const c = [];
    if (F.pMin > 50 || F.pMax < 800) c.push(["price", "", `${money(F.pMin)}–${money(F.pMax)}${F.pMax >= 800 ? "+" : ""}`]);
    F.stars.forEach((s) => c.push(["stars", s, `${s} Stars`]));
    if (F.guest) c.push(["guest", "", `${F.guest}+ Rating`]);
    F.type.forEach((t) => c.push(["type", t, t]));
    F.hood.forEach((t) => c.push(["hood", t, t]));
    F.amen.forEach((t) => c.push(["amen", t, t]));
    if (F.area) c.push(["area", "", "Map area"]);
    $("#chips").innerHTML = c.map(([g, v, l]) => `<button type="button" class="chip" data-g="${g}" data-v="${esc(v)}" aria-label="Remove ${esc(l)}">${esc(l)}${icon("x")}</button>`).join("");
  }
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const { g, v } = b.dataset;
    if (g === "price") { F.pMin = 50; F.pMax = 800; } else if (g === "guest") F.guest = 0; else if (g === "area") F.area = null; else F[g].delete(g === "stars" ? +v : v);
    syncUI(); update();
  });
  function update() {
    current = hotels.filter((h) => passes(h)).sort(sorters[sortBy]);
    page = Math.min(page, pages());
    if (!arguments.length) { page = 1; extra = 0; }
    render(); counts(); chips();
    const n = current.length;
    $("#count").innerHTML = `<strong>${n} hotel${n === 1 ? "" : "s"} found</strong>`;
    $("#searchMeta").innerHTML = `<strong>${nights()} night${nights() > 1 ? "s" : ""}</strong> · ${n} hotels found · Prices include taxes &amp; fees`;
    $("#sheetN").textContent = n;
    $("#mapCount").textContent = `${n} hotels`;
    if (!$("#mapView").hidden) drawMap();
  }

  // Card interactions
  $("#list").addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const h = hotels.find((x) => x.id === card.dataset.id);
    const nav = e.target.closest(".g-nav");
    if (nav) { slide(card, h, nav.classList.contains("next") ? 1 : -1); return; }
    const sv = e.target.closest(".save");
    if (sv) { saved.has(h.id) ? saved.delete(h.id) : saved.add(h.id); sv.setAttribute("aria-pressed", saved.has(h.id)); const n = saved.size; $("#savedCount").hidden = !n; $("#savedCount").textContent = n; toast(saved.has(h.id) ? `Saved ${h.name}` : `Removed ${h.name}`); return; }
    if (h.sold && !e.target.closest(".open")) return;
    openDetail(h, !!e.target.closest(".book"));
  });
  function slide(card, h, d) {
    const n = h.kinds.length, i = ((photoIdx[h.id] || 0) + d + n) % n;
    photoIdx[h.id] = i;
    card.querySelector(".slides").style.transform = `translateX(-${i * 100}%)`;
    $$(".g-dots i", card).forEach((x, j) => x.classList.toggle("on", j === i));
  }
  let tsx = null;
  $("#list").addEventListener("touchstart", (e) => { if (e.target.closest(".gal")) tsx = e.touches[0].clientX; }, { passive: true });
  $("#list").addEventListener("touchend", (e) => { if (tsx === null) return; const dx = e.changedTouches[0].clientX - tsx; tsx = null; const card = e.target.closest(".card"); if (card && Math.abs(dx) > 35) slide(card, hotels.find((x) => x.id === card.dataset.id), dx < 0 ? 1 : -1); });

  /* ---------- Mobile bottom bar follows visible card ---------- */
  let cardIO;
  function observeCards() {
    if (!("IntersectionObserver" in window)) return;
    if (cardIO) cardIO.disconnect();
    cardIO = new IntersectionObserver((es) => {
      const vis = es.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!vis) return;
      const h = hotels.find((x) => x.id === vis.target.dataset.id);
      $("#mbarText").innerHTML = `<span class="mb-name">${esc(h.name)}</span><strong>${money(h.price)}</strong>/night`;
      $("#mDeal").dataset.id = h.id;
    }, { rootMargin: "-40% 0px -45% 0px" });
    $$("#list .card").forEach((c) => cardIO.observe(c));
  }
  $("#mDeal").addEventListener("click", (e) => { const id = e.currentTarget.dataset.id; if (id) { e.preventDefault(); openDetail(hotels.find((x) => x.id === id), true); } });

  /* ---------- Detail modal ---------- */
  const detail = $("#detail");
  const recent = [];
  const nearby = { Shinjuku: [["Shinjuku Station", "8 min walk", "walk"], ["Shinjuku Gyoen", "12 min walk", "walk"], ["Meiji Shrine", "20 min by train", "train"]], Ginza: [["Ginza Station", "3 min walk", "walk"], ["Tsukiji Outer Market", "10 min walk", "walk"], ["Tokyo Station", "6 min by train", "train"]], Otemachi: [["Otemachi Station", "2 min walk", "walk"], ["Imperial Palace East Gardens", "6 min walk", "walk"], ["Tokyo Station", "8 min walk", "walk"]] };
  function openDetail(h, focusBook) {
    const isPH = h.name === "Park Hyatt Tokyo";
    const roomsT = isPH ? [["Standard King", 30, "King", "City view", 2, 350], ["Deluxe King", 45, "King", "City view", 2, 412, true], ["Suite", 72, "King", "Park view", 3, 680]]
      : [[h.room.split(" — ")[0], h.size || 12, h.type === "Capsule Hotel" ? "Capsule" : "Double", "City view", 2, h.price, true], ["Superior", (h.size || 12) + 8, "Queen", "City view", 2, Math.round(h.price * 1.25)], ["Suite", (h.size || 12) + 30, "King", "Skyline view", 3, Math.round(h.price * 1.8)]];
    const br = isPH ? [9.6, 9.8, 9.2, 8.9, 9.0] : [0, 1, 2, 3, 4].map((i) => Math.min(10, Math.max(5, h.rating + [0.2, 0.4, -0.1, -0.4, -0.2][i])));
    const amenFull = ["Free WiFi", "Pool", "Gym", "Spa", "Restaurant", "Bar & lounge", "Room service", "Laundry", "Air conditioning", "Flat-screen TV", "Concierge", "Non-smoking rooms"];
    const amenIc = ["wifi", "pool", "gym", "spa", "utensils", "sofa", "bell", "shirt", "snow", "tv", "headset", "check"];
    const near = nearby[h.hood] || [[`${h.hood} Station`, "5 min walk", "walk"], ["Nearest park", "10 min walk", "walk"], ["Tokyo Station", `${Math.round(h.dist * 4)} min by train`, "train"]];
    let sel = roomsT.findIndex((r) => r[6]);
    const n = nights();
    detail.innerHTML = `<div class="d-in" id="dBody">
      <button class="icon-btn d-close" type="button" id="dClose" aria-label="Close details">${icon("x")}</button>
      <div class="d-gal" id="dGal">${h.kinds.concat([h.kinds[0]]).map((k, i) => `<div class="dg${i === 0 ? " main" : ""}">${window.__photo(k, h.hue + i * 20, `${h.name} photo ${i + 1}`)}</div>`).join("")}<button type="button" class="btn btn-white-sm allph" id="allPhotos">${icon("image")}View all 32 photos</button></div>
      <div class="d-cols">
        <div class="d-main">
          <p class="loc">${starsHTML(h.stars)}<span>· ${h.type}</span></p>
          <h2 id="dTitle">${esc(h.name)}</h2>
          <p class="addr">${icon("pin")}<a href="#dLoc">${isPH ? "3-7-1-2 Nishishinjuku, Shinjuku-ku, Tokyo" : `${h.hood}, Tokyo`}</a> · ${h.dist.toFixed(1)} km from center</p>
          <div class="d-score"><span class="sc big">${h.rating.toFixed(1)}</span><div><strong>${h.label}</strong><span>${h.reviews.toLocaleString()} verified reviews</span></div></div>
          <ul class="bars">${["Cleanliness", "Location", "Service", "Value", "Facilities"].map((l, i) => `<li><span>${l}</span><i><b style="width:${br[i] * 10}%"></b></i><strong>${br[i].toFixed(1)}</strong></li>`).join("")}</ul>
          <h3>About this property</h3>
          <div class="desc">${isPH ? `<p>Occupying the top 14 floors of Kenzo Tange's Shinjuku Park Tower, Park Hyatt Tokyo pairs sweeping views of the city — and, on clear days, Mount Fuji — with the calm of a private residence. Rooms are among the largest in Tokyo, finished in warm wood, granite and original artwork.</p><p>Guests gather at the 52nd-floor New York Bar for live jazz, swim beneath the glass pyramid of the 47th-floor pool, and dine at Kozue for seasonal Japanese cuisine. Shinjuku Station and the green expanse of Shinjuku Gyoen are an easy walk away.</p>` : `<p>${esc(h.name)} is a ${h.stars}-star ${h.type.toLowerCase()} in ${h.hood}, rated ${h.label.toLowerCase()} by ${h.reviews.toLocaleString()} guests. Rooms are designed for rest after long days exploring Tokyo, with thoughtful storage, blackout curtains and fast WiFi.</p><p>Stations, convenience stores and late-night dining are minutes away, making it an easy base for first-time visitors and returning travelers alike.</p>`}</div>
          <h3>Choose your room</h3>
          <div class="rooms" role="radiogroup" aria-label="Room type">${roomsT.map(([t, sz, bed, vw, mx, p, pop], i) => `<label class="rt${i === sel ? " on" : ""}"><input type="radio" name="room" value="${i}"${i === sel ? " checked" : ""}><span class="rt-img">${window.__photo("room", h.hue + i * 30, t)}</span><span class="rt-name"><strong>${esc(t)}</strong>${pop ? '<em class="pop-tag">Most Popular</em>' : ""}<small>${sz}m² · ${bed} bed · ${vw} · Sleeps ${mx}</small></span><span class="rt-price"><strong>${money(p)}</strong><small>/night</small></span><span class="rt-sel">Select</span></label>`).join("")}</div>
          <h3>Amenities</h3>
          <ul class="amen-grid">${amenFull.map((a, i) => `<li>${icon(amenIc[i])}${a}</li>`).join("")}</ul>
          <h3 id="dLoc">Location</h3>
          <div class="d-loc"><div class="d-map" aria-hidden="true"><span class="pinme" style="left:${h.x}%;top:${h.y}%">${icon("pin")}</span></div>
            <ul class="near">${near.map(([p, d, ic]) => `<li>${icon(ic)}<span>${p}</span><strong>${d}</strong></li>`).join("")}</ul></div>
          <h3>House Rules</h3>
          <ul class="rules"><li><span>Check-in</span><strong>3:00 PM</strong></li><li><span>Check-out</span><strong>11:00 AM</strong></li><li><span>Smoking</span><strong>No smoking</strong></li><li><span>Pets</span><strong>Pets not allowed</strong></li></ul>
          <h3>Guest reviews</h3>
          <div class="revs">${[["Emily", "United Kingdom", 10, "The view from our room at night was unreal and the staff remembered our names by day two."], ["Kenji", "Japan", 9.2, "Superb service and very quiet rooms. Breakfast is pricey but excellent."], ["Marco", "Italy", 9.6, "Perfect base for exploring. Station access was easier than expected."]].map(([n, c, s, t]) => `<figure class="rev"><div class="rv-top"><span class="rv-av">${n[0]}</span><strong>${n}</strong><small>${c}</small><span class="sc">${s.toFixed(1)}</span></div><blockquote>${t}</blockquote><p class="resp"><strong>Response from the property:</strong> Thank you, ${n} — we look forward to welcoming you back.</p></figure>`).join("")}</div>
          <a class="link" href="#dTitle" data-toast="All ${h.reviews.toLocaleString()} reviews would load here (demo).">Read all ${h.reviews.toLocaleString()} reviews</a>
        </div>
      </div>
      <div class="d-bar"><div><strong id="dRoom"></strong><span>${fmtD($("#checkin").value)} – ${fmtD($("#checkout").value)} · ${n} night${n > 1 ? "s" : ""} · ${guestText()}</span></div><div class="d-tot"><strong id="dTotal"></strong><small>incl. taxes &amp; fees</small></div><button class="btn btn-blue" type="button" id="reserve"${h.sold ? " disabled" : ""}>${h.sold ? "Sold out" : "Reserve Now"}</button></div>
    </div>`;
    const syncSel = () => { const r = roomsT[sel]; $("#dRoom").textContent = r[0]; $("#dTotal").textContent = money(r[5] * n * rooms()); $$(".rt", detail).forEach((l, i) => l.classList.toggle("on", i === sel)); };
    syncSel();
    detail.onchange = (e) => { if (e.target.name === "room") { sel = +e.target.value; syncSel(); } };
    $("#dClose").addEventListener("click", () => detail.close());
    $("#allPhotos").addEventListener("click", () => { $("#dGal").classList.toggle("all"); $("#allPhotos").lastChild.textContent = $("#dGal").classList.contains("all") ? "Show fewer photos" : "View all 32 photos"; });
    $("#reserve").addEventListener("click", () => { detail.close(); toast(`Reserved ${roomsT[sel][0]} at ${h.name} — demo booking, no payment taken.`); });
    detail.showModal();
    if (focusBook) $(".rooms", detail).scrollIntoView({ block: "center" });
    addRecent(h);
  }
  detail.addEventListener("click", (e) => { if (e.target === detail) detail.close(); });

  /* ---------- Recently viewed ---------- */
  let store = null;
  try { store = window.localStorage; } catch { store = null; }
  try { const ids = JSON.parse(store?.getItem("sf-recent") || "null"); if (Array.isArray(ids)) ids.forEach((id) => { const h = hotels.find((x) => x.id === id); if (h) recent.push(h); }); } catch { /* ignore */ }
  if (!recent.length) recent.push(hotels[2], hotels[1], hotels[0], hotels[3], hotels[12]);
  function addRecent(h) {
    const i = recent.indexOf(h);
    if (i >= 0) recent.splice(i, 1);
    recent.unshift(h);
    recent.length = Math.min(recent.length, 6);
    try { store?.setItem("sf-recent", JSON.stringify(recent.map((x) => x.id))); } catch { /* ignore */ }
    renderRecent();
  }
  function renderRecent() {
    $("#recent").innerHTML = recent.map((h) => `<button type="button" class="rc" data-id="${h.id}"><span class="rc-img">${window.__photo(h.kinds[0], h.hue, h.name)}</span><span class="rc-b"><strong>${esc(h.name)}</strong><span><span class="sc sm">${h.rating.toFixed(1)}</span>${h.hood}</span><span class="rc-p">${money(h.price)}<small>/night</small></span></span></button>`).join("");
  }
  $("#recent").addEventListener("click", (e) => { const b = e.target.closest(".rc"); if (b) openDetail(hotels.find((x) => x.id === b.dataset.id)); });
  renderRecent();

  /* ---------- Map ---------- */
  const mapView = $("#mapView"), canvas = $("#mapCanvas");
  let zoom = 1, cx = 50, cy = 50, sat = false;
  const baseMap = `<svg class="basemap" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <rect width="100" height="100" class="land"/><path d="M70 100 L74 82 Q80 70 92 66 L100 62 V100Z" class="water"/><path d="M84 0 Q80 20 76 34 Q73 48 70 60 Q68 70 72 82" class="river"/>
    <rect x="53" y="38" width="9" height="10" rx="2" class="park"/><rect x="28" y="50" width="6" height="7" rx="1.5" class="park"/><rect x="31" y="52" width="4" height="6" class="park" transform="translate(-3 3)"/><rect x="34" y="40" width="5" height="5" rx="1" class="park"/><circle cx="66" cy="18" r="3.5" class="park"/>
    <ellipse cx="48" cy="48" rx="20" ry="32" class="rail"/><path d="M0 46 H100 M48 0 V100 M10 80 L90 20" class="road"/></svg>`;
  function clusters(list) {
    if (zoom >= 3) return list.map((h) => ({ items: [h], x: h.x, y: h.y }));
    const cell = zoom === 1 ? 9 : 4.5, map = new Map();
    list.forEach((h) => {
      if (h.pinned) { map.set(h.id, { items: [h], x: h.x, y: h.y }); return; }
      const k = `${Math.floor(h.x / cell)}:${Math.floor(h.y / cell)}`;
      const c = map.get(k) || { items: [], x: 0, y: 0 };
      c.items.push(h); map.set(k, c);
    });
    return [...map.values()].map((c) => (c.items.length > 1 && !c.items[0].pinned ? { ...c, x: c.items.reduce((s, h) => s + h.x, 0) / c.items.length, y: c.items.reduce((s, h) => s + h.y, 0) / c.items.length } : { ...c, x: c.items[0].x, y: c.items[0].y }));
  }
  function drawMap() {
    canvas.classList.toggle("sat", sat);
    const t = `translate(${50 - cx * zoom}%, ${50 - cy * zoom}%) scale(${zoom})`;
    const pins = clusters(current).map((c) => c.items.length > 1
      ? `<button type="button" class="cluster" style="left:${c.x}%;top:${c.y}%" data-x="${c.x}" data-y="${c.y}" aria-label="${c.items.length} hotels, zoom in">${c.items.length}</button>`
      : `<button type="button" class="pin${c.items[0].sold ? " sold" : ""}${c.items[0].pinned ? " top" : ""}" style="left:${c.x}%;top:${c.y}%" data-id="${c.items[0].id}" aria-label="${esc(c.items[0].name)}, ${money(c.items[0].price)}${c.items[0].sold ? ", sold out" : ""}">${money(c.items[0].price)}</button>`).join("");
    canvas.innerHTML = `<div class="layer" style="transform:${t}">${baseMap}<div class="pins" style="--z:${zoom}">${pins}</div>${Object.entries(hoods).map(([n, [x, y]]) => `<span class="hood-l" style="left:${x}%;top:${y + 5}%;--z:${zoom}">${n}</span>`).join("")}</div>`;
    $("#zoomIn").disabled = zoom >= 4; $("#zoomOut").disabled = zoom <= 1;
  }
  function openMap() { mapView.hidden = false; document.body.classList.add("locked"); drawMap(); $("#mapClose").focus(); }
  function closeMap() { mapView.hidden = true; $("#mapCard").hidden = true; document.body.classList.remove("locked"); }
  $("#mapBtn").addEventListener("click", openMap); $("#mapPrev").addEventListener("click", openMap); $("#mMap").addEventListener("click", openMap);
  $("#mapClose").addEventListener("click", closeMap);
  const clampC = () => { const half = 50 / zoom; cx = Math.min(100 - half, Math.max(half, cx)); cy = Math.min(100 - half, Math.max(half, cy)); };
  $("#zoomIn").addEventListener("click", () => { zoom = Math.min(4, zoom + 1); clampC(); drawMap(); });
  $("#zoomOut").addEventListener("click", () => { zoom = Math.max(1, zoom - 1); clampC(); drawMap(); });
  $("#satBtn").addEventListener("click", (e) => { sat = !sat; e.currentTarget.setAttribute("aria-pressed", sat); drawMap(); });
  canvas.addEventListener("click", (e) => {
    const cl = e.target.closest(".cluster");
    if (cl) { zoom = Math.min(4, zoom + 1); cx = +cl.dataset.x; cy = +cl.dataset.y; clampC(); drawMap(); return; }
    const p = e.target.closest(".pin");
    if (p) {
      const h = hotels.find((x) => x.id === p.dataset.id);
      $$(".pin.active", canvas).forEach((x) => x.classList.remove("active")); p.classList.add("active");
      const mc = $("#mapCard");
      mc.innerHTML = `<span class="mc-img">${window.__photo(h.kinds[0], h.hue, h.name)}</span><div><strong>${esc(h.name)}</strong><p>${starsHTML(h.stars)} · ${h.hood}</p><p><span class="sc sm">${h.rating.toFixed(1)}</span>${h.label}</p><p class="mc-p">${h.sold ? '<span class="soldtag">Sold out</span>' : `<strong>${money(h.price)}</strong>/night`}</p></div><button type="button" class="btn btn-blue-sm" data-id="${h.id}">View</button>`;
      mc.hidden = false;
      return;
    }
    $("#mapCard").hidden = true;
  });
  $("#mapCard").addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) { closeMap(); openDetail(hotels.find((x) => x.id === b.dataset.id)); } });
  // Drag to pan
  let drag = null;
  canvas.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; drag = { x: e.clientX, y: e.clientY, cx, cy }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => { if (!drag) return; const r = canvas.getBoundingClientRect(); cx = drag.cx - ((e.clientX - drag.x) / r.width) * 100 / zoom; cy = drag.cy - ((e.clientY - drag.y) / r.height) * 100 / zoom; clampC(); $(".layer", canvas).style.transform = `translate(${50 - cx * zoom}%, ${50 - cy * zoom}%) scale(${zoom})`; });
  canvas.addEventListener("pointerup", () => { drag = null; });
  $("#searchArea").addEventListener("click", () => {
    const half = 50 / zoom;
    F.area = zoom === 1 ? null : [cx - half, cy - half, cx + half, cy + half];
    update();
    toast(F.area ? `Showing ${current.length} hotels in this map area` : "Zoom in to search a smaller area");
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!mapView.hidden) closeMap(); closeSheet(); $("#guestPop").hidden = true; } });

  /* ---------- Mobile filter sheet ---------- */
  const filters = $("#filters"), backdrop = $("#backdrop");
  function openSheet() { filters.classList.add("open"); backdrop.hidden = false; document.body.classList.add("locked"); $("#closeSheet").focus(); }
  function closeSheet() { filters.classList.remove("open"); backdrop.hidden = true; if (mapView.hidden) document.body.classList.remove("locked"); }
  $("#mFilters").addEventListener("click", openSheet);
  $("#closeSheet").addEventListener("click", closeSheet);
  $("#applySheet").addEventListener("click", () => { closeSheet(); $("#results").scrollIntoView(); });
  backdrop.addEventListener("click", closeSheet);

  /* ---------- Search form ---------- */
  const places = ["Tokyo, Japan", "Tokyo Station, Chiyoda", "Shinjuku, Tokyo", "Shibuya, Tokyo", "Kyoto, Japan", "Osaka, Japan", "Toronto, Canada", "Tours, France"];
  const dest = $("#dest"), dl = $("#destList");
  let act = -1, matches = [];
  function renderAC() {
    const q = dest.value.trim().toLowerCase();
    matches = q ? places.filter((p) => p.toLowerCase().includes(q)).slice(0, 6) : places.slice(0, 5);
    act = -1;
    dl.innerHTML = matches.map((p, i) => `<li role="option" id="ac${i}" aria-selected="false" data-v="${p}">${icon("pin")}${p}</li>`).join("");
    dl.hidden = !matches.length; dest.setAttribute("aria-expanded", !dl.hidden);
  }
  const pickAC = (v) => { dest.value = v; dl.hidden = true; dest.setAttribute("aria-expanded", "false"); };
  dest.addEventListener("input", renderAC);
  dest.addEventListener("focus", renderAC);
  dest.addEventListener("keydown", (e) => {
    if (dl.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length; $$("li", dl).forEach((l, i) => l.setAttribute("aria-selected", i === act)); dest.setAttribute("aria-activedescendant", `ac${act}`); }
    else if (e.key === "Enter" && act >= 0) { e.preventDefault(); pickAC(matches[act]); }
  });
  dl.addEventListener("mousedown", (e) => { const li = e.target.closest("li"); if (li) { e.preventDefault(); pickAC(li.dataset.v); } });
  dest.addEventListener("blur", () => setTimeout(() => { dl.hidden = true; dest.setAttribute("aria-expanded", "false"); }, 120));
  const gb = $("#guestBtn"), gp = $("#guestPop");
  gb.addEventListener("click", () => { gp.hidden = !gp.hidden; gb.setAttribute("aria-expanded", !gp.hidden); });
  gp.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (!b) return; const k = b.dataset.k; guests[k] = Math.max(k === "adults" ? 1 : 0, Math.min(k === "adults" ? 12 : 8, guests[k] + +b.dataset.d)); $("#gAdults").textContent = guests.adults; $("#gChildren").textContent = guests.children; $("#guestLabel").textContent = guestText(); });
  $("#guestDone").addEventListener("click", () => { gp.hidden = true; gb.setAttribute("aria-expanded", "false"); gb.focus(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".guests")) { gp.hidden = true; gb.setAttribute("aria-expanded", "false"); } });
  function syncSearchText() {
    const city = dest.value.split(",")[0].trim() || "Tokyo";
    const g = guests.adults + guests.children;
    $("#compactText").textContent = `${city} · ${fmtD($("#checkin").value)}–${fmtD($("#checkout").value).replace(/^\w+ /, "")} · ${g} guest${g > 1 ? "s" : ""}`;
    $(".m-search strong").textContent = dest.value;
    $("#mSearchSub").textContent = `${fmtD($("#checkin").value)} – ${fmtD($("#checkout").value)} · ${guests.adults} Adult${guests.adults > 1 ? "s" : ""} · ${rooms()} Room${rooms() > 1 ? "s" : ""}`;
  }
  $("#searchCard").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#searchErr");
    let msg = "";
    if (!dest.value.trim()) msg = "Enter a destination.";
    else if (new Date($("#checkout").value) <= new Date($("#checkin").value)) msg = "Check-out must be after check-in.";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    syncSearchText();
    update();
    if (!/tokyo|shinjuku|shibuya/i.test(dest.value)) toast(`Showing sample Tokyo results — ${dest.value} inventory is not part of this demo.`);
    else toast(`Updated: ${nights()} nights, ${guestText()}, ${rooms()} room${rooms() > 1 ? "s" : ""}.`);
    if (window.matchMedia("(max-width: 900px)").matches) toggleMSearch(false);
  });
  const toggleMSearch = (open) => { $("#searchCard").classList.toggle("open", open); $("#mSearchToggle").setAttribute("aria-expanded", open); };
  $("#mSearchToggle").addEventListener("click", () => toggleMSearch(!$("#searchCard").classList.contains("open")));
  $("#rooms").addEventListener("change", () => update(true));

  // Compact nav search on scroll
  const navEl = $(".nav");
  const sio = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => navEl.classList.toggle("scrolled", !e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" }) : null;
  if (sio) sio.observe($(".search-wrap"));
  $("#compact").addEventListener("click", () => { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); setTimeout(() => dest.focus(), reduced ? 0 : 400); });
  $("#savedBtn").addEventListener("click", () => toast(saved.size ? `${saved.size} saved hotel${saved.size > 1 ? "s" : ""}: ${[...saved].map((id) => hotels.find((h) => h.id === id).name).join(", ")}` : "No saved hotels yet — tap a heart to save one."));

  /* ---------- Currency ---------- */
  const setCur = (c) => { cur = c; $("#currency").value = c; $("#fCur").value = c; paintRange(); update(true); renderRecent(); };
  $("#currency").addEventListener("change", (e) => setCur(e.target.value));
  $("#fCur").addEventListener("change", (e) => setCur(e.target.value));

  syncUI(); update(); syncSearchText();
  $("#mbarText").innerHTML = `From <strong>${money(minPrice)}</strong>/night`;
})();
