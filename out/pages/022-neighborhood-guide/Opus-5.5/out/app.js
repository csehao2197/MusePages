(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const num = (n) => n.toLocaleString("en-US");
  const short = (n) => n.name.split(" ")[0];

  // ---- Data (illustrative; Maplewood Heights matches the brief exactly) ----
  const N = [
    {
      id: "maplewood", name: "Maplewood Heights", city: "Riverton, CA", zip: "95412", price: 485000, rent: 2100, pop: 28400, income: 94000,
      desc: "Maplewood Heights is a tree-lined residential neighborhood known for its top-rated schools, community parks, and charming downtown strip. Popular with young families and professionals, it offers a perfect balance of suburban tranquility and urban convenience.",
      tags: ["Family-Friendly", "Great Schools", "Quiet Streets"], scores: [82, 65, 71, 88],
      schools: [["Maplewood Elementary", "K-5", 9, 0.4, 380], ["Lincoln Middle School", "6-8", 8, 1.1, 620], ["Westview High School", "9-12", 8, 1.8, 1200], ["Little Acorns Montessori (Private)", "Pre-K-3", 9, 0.6, 85]],
      commute: { downtown: [22, 35], airport: 40, tech: [18, 28], uni: [15, 20] },
      market: { yoy: 4.2, dom: 18, domd: -3, ppsf: 245, sold: 24 }, dining: 42, near: ["cedar", "willow"],
      reviews: [["We moved here for the schools and stayed for the community. Block parties every summer!", "The Martinez Family", "6 years in Maplewood Heights", 5], ["Great walkability — I can get to the grocery store, gym, and coffee shop without my car.", "Sarah T.", "2 years", 4], ["Quiet neighborhood with beautiful tree-lined streets. The farmers market is a weekend highlight.", "James W.", "10 years", 5]],
      avg: 4.7, count: 156,
    },
    {
      id: "cedar", name: "Cedar Grove", city: "Riverton, CA", zip: "95415", price: 412000, rent: 1850, pop: 19200, income: 81000,
      desc: "Cedar Grove is a relaxed, value-minded neighborhood of ranch homes and generous lots on Riverton's east side. Mature cedars shade wide streets, and the dog park and community pool are the social heart of the area.",
      tags: ["Affordable", "Big Yards", "Pet-Friendly"], scores: [68, 52, 64, 84],
      schools: [["Cedar Grove Elementary", "K-5", 7, 0.5, 410], ["Eastside Middle School", "6-8", 7, 1.4, 580], ["Westview High School", "9-12", 8, 2.6, 1200], ["Bright Pines Preschool (Private)", "Pre-K", 6, 0.8, 60]],
      commute: { downtown: [30, 44], airport: 34, tech: [26, 40], uni: [22, 31] },
      market: { yoy: 3.1, dom: 24, domd: -1, ppsf: 208, sold: 19 }, dining: 18, near: ["maplewood", "sunny"],
      reviews: [["Our yard is big enough for a garden, a dog and a trampoline. Hard to beat at this price.", "Priya & Dev K.", "4 years in Cedar Grove", 5], ["Friendly neighbors and the pool is packed every summer weekend.", "Tom R.", "7 years", 4], ["You'll want a car, but the drive downtown is easy outside rush hour.", "Alicia M.", "3 years", 4]],
      avg: 4.4, count: 98,
    },
    {
      id: "harbor", name: "Harbor Point", city: "Riverton, CA", zip: "95401", price: 629000, rent: 2850, pop: 14600, income: 118000,
      desc: "Harbor Point wraps around the old marina with converted warehouses, townhomes and a busy waterfront promenade. Restaurants, galleries and the ferry terminal are all a short walk, making it Riverton's most car-free address.",
      tags: ["Walkable", "Nightlife", "Waterfront"], scores: [91, 84, 78, 79],
      schools: [["Harbor Point Elementary", "K-5", 8, 0.3, 340], ["Marina Middle School", "6-8", 7, 0.9, 510], ["Central High School", "9-12", 7, 1.5, 1450], ["Bayside Academy (Private)", "K-8", 9, 0.7, 210]],
      commute: { downtown: [12, 18], airport: 28, tech: [15, 20], uni: [20, 24] },
      market: { yoy: 5.6, dom: 14, domd: -4, ppsf: 412, sold: 31 }, dining: 96, near: ["maplewood", "willow"],
      reviews: [["I sold my car the first year. Everything I need is a ten-minute walk.", "Jordan L.", "5 years in Harbor Point", 5], ["Lively on weekends — light sleepers should look away from the promenade.", "Ines P.", "2 years", 4], ["Sunset on the pier never gets old.", "Marco & Lin", "8 years", 5]],
      avg: 4.6, count: 211,
    },
    {
      id: "oak", name: "Oakridge Village", city: "Fairbrook, CA", zip: "95420", price: 538000, rent: 2300, pop: 22100, income: 102000,
      desc: "Oakridge Village is a planned community in the foothills with curving streets, a golf course and miles of greenbelt. Homes are newer and roomier, and the HOA keeps parks and trails immaculate.",
      tags: ["Top Safety", "Golf Course", "Spacious Homes"], scores: [58, 41, 55, 92],
      schools: [["Oakridge Elementary", "K-5", 9, 0.6, 450], ["Foothill Middle School", "6-8", 8, 1.3, 700], ["Fairbrook High School", "9-12", 9, 2.2, 1600], ["Summit Prep (Private)", "6-12", 9, 1.9, 320]],
      commute: { downtown: [34, 52], airport: 45, tech: [30, 48], uni: [28, 40] },
      market: { yoy: 3.8, dom: 21, domd: -2, ppsf: 231, sold: 22 }, dining: 15, near: ["maplewood", "cedar"],
      reviews: [["Kids ride bikes in the cul-de-sac until dark. It feels incredibly safe.", "The Okafor Family", "9 years in Oakridge Village", 5], ["Beautiful trails. Commuting downtown is the trade-off.", "Brian S.", "3 years", 4], ["The HOA is strict, but everything is spotless.", "Nora G.", "6 years", 4]],
      avg: 4.5, count: 134,
    },
    {
      id: "willow", name: "Willow Creek", city: "Riverton, CA", zip: "95418", price: 455000, rent: 1980, pop: 31500, income: 88000,
      desc: "Willow Creek follows the creek greenway north of Maplewood, mixing craftsman bungalows with new townhomes. Protected bike lanes and the light rail stop make it a favorite of young professionals.",
      tags: ["Trails", "Young Professionals", "Bike Lanes"], scores: [74, 60, 80, 85],
      schools: [["Willow Creek Elementary", "K-5", 8, 0.5, 430], ["Lincoln Middle School", "6-8", 8, 1.6, 620], ["Westview High School", "9-12", 8, 2.1, 1200], ["Creekside Learning Center (Private)", "Pre-K-2", 7, 0.4, 70]],
      commute: { downtown: [25, 30], airport: 38, tech: [20, 24], uni: [12, 14] },
      market: { yoy: 4.8, dom: 16, domd: -5, ppsf: 238, sold: 28 }, dining: 37, near: ["maplewood", "harbor"],
      reviews: [["I bike the creek path to work every day. It's the best commute I've ever had.", "Kenji A.", "3 years in Willow Creek", 5], ["Lots of new construction nearby, so expect some noise for a while.", "Rachel D.", "1 year", 4], ["Great breweries and the Thursday night market.", "Sam & Ellie", "4 years", 5]],
      avg: 4.6, count: 142,
    },
    {
      id: "sunny", name: "Sunnyside Park", city: "Lakeport, CA", zip: "95430", price: 389000, rent: 1700, pop: 17800, income: 72000,
      desc: "Sunnyside Park is a diverse, close-knit neighborhood of 1950s cottages around a large central park and community garden. It is one of the region's best entry points for first-time buyers.",
      tags: ["First-Time Buyers", "Community Garden", "Diverse"], scores: [63, 48, 59, 81],
      schools: [["Sunnyside Elementary", "K-5", 7, 0.4, 390], ["Lakeport Middle School", "6-8", 6, 1.2, 640], ["Lakeport High School", "9-12", 7, 1.9, 1350], ["Little Sprouts Co-op (Private)", "Pre-K", 8, 0.3, 45]],
      commute: { downtown: [32, 46], airport: 30, tech: [35, 50], uni: [26, 34] },
      market: { yoy: 2.7, dom: 27, domd: 2, ppsf: 196, sold: 17 }, dining: 22, near: ["cedar", "maplewood"],
      reviews: [["We bought our first home here and our neighbors brought dinner the first night.", "Ana & Luis R.", "2 years in Sunnyside Park", 5], ["The community garden is a real gem — I've learned so much.", "Grace H.", "5 years", 5], ["Some homes need updating, but the prices make that worth it.", "Devon W.", "3 years", 4]],
      avg: 4.5, count: 87,
    },
  ];
  const byId = Object.fromEntries(N.map((n) => [n.id, n]));
  const schoolAvg = (n) => Math.round((n.schools.reduce((s, x) => s + x[2], 0) / n.schools.length) * 10) / 10;

  const CATS = [
    { id: "school", label: "Schools", color: "#EAB308", icon: "school" },
    { id: "park", label: "Parks", color: "#16A34A", icon: "tree" },
    { id: "dining", label: "Dining", color: "#EA580C", icon: "fork" },
    { id: "shop", label: "Shopping", color: "#2563EB", icon: "bag" },
    { id: "health", label: "Healthcare", color: "#DC2626", icon: "health" },
  ];
  const catById = Object.fromEntries(CATS.map((c) => [c.id, c]));

  function amenities(n) {
    const s = n.id === "maplewood" ? "Maplewood" : short(n);
    const sch = n.schools.slice(0, 3);
    return [
      { cat: "school", name: sch[0][0], dist: sch[0][3], rating: `${sch[0][2]}/10`, x: 330, y: 190 },
      { cat: "school", name: sch[1][0], dist: sch[1][3], rating: `${sch[1][2]}/10`, x: 520, y: 360 },
      { cat: "school", name: sch[2][0], dist: sch[2][3], rating: `${sch[2][2]}/10`, x: 210, y: 400 },
      { cat: "park", name: `${s} Central Park`, dist: 0.3, rating: "4.8★", x: 420, y: 250 },
      { cat: "park", name: "Riverside Trail", dist: 0.9, rating: "4.7★", x: 630, y: 140 },
      { cat: "park", name: "Community Playground", dist: 0.5, rating: "4.5★", x: 290, y: 300 },
      { cat: "dining", name: "Juniper & Rye", dist: 0.2, rating: "4.6★", x: 460, y: 170 },
      { cat: "dining", name: "Little Saigon Kitchen", dist: 0.3, rating: "4.7★", x: 500, y: 200 },
      { cat: "dining", name: "Copper Kettle Café", dist: 0.4, rating: "4.5★", x: 380, y: 150 },
      { cat: "dining", name: "Nonna's Trattoria", dist: 0.6, rating: "4.4★", x: 560, y: 260 },
      { cat: "dining", name: "Elm Street Taqueria", dist: 0.8, rating: "4.6★", x: 250, y: 220 },
      { cat: "shop", name: `${s} Town Center`, dist: 0.6, rating: "4.4★", x: 540, y: 190 },
      { cat: "shop", name: "Farmers Market (Saturdays)", dist: 0.4, rating: "4.9★", x: 400, y: 330 },
      { cat: "health", name: `${s} Medical Center`, dist: 1.2, rating: "4.6★", x: 640, y: 330 },
      { cat: "health", name: "Urgent Care — Elm Street", dist: 0.7, rating: "4.3★", x: 240, y: 160 },
      { cat: "health", name: "Urgent Care — Oak Avenue", dist: 1.0, rating: "4.2★", x: 600, y: 420 },
      { cat: "health", name: "Urgent Care — Riverside", dist: 1.4, rating: "4.4★", x: 160, y: 300 },
    ].sort((a, b) => a.dist - b.dist);
  }

  // ---- State ----
  let cur = N[0];
  let AM = [];
  const on = new Set(CATS.map((c) => c.id));

  // ---- Art ----
  $("[data-art=aerial]").innerHTML = Art.aerial();
  $("[data-agent]").innerHTML = Art.agent();

  // ---- Cards ----
  const cardsEl = $("[data-cards]");
  cardsEl.innerHTML = N.map((n, i) => `<button type="button" class="nb-card" data-nb="${n.id}" aria-label="Explore ${esc(n.name)}, ${esc(n.city)}">
      <div class="nb-img">${Art.card(i, `Street scene in ${n.name}`)}<span class="ws">${ic("walk")}Walk Score: ${n.scores[0]}</span></div>
      <div class="nb-body"><h3>${esc(n.name)}</h3><p class="city">${esc(n.city)}</p><p class="price">${usd(n.price)} <small>median home price</small></p>
      <div class="tags">${n.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div><span class="explore">Explore ${ic("arrow")}</span></div></button>`).join("");
  cardsEl.addEventListener("click", (e) => { const b = e.target.closest("[data-nb]"); if (b) select(b.dataset.nb, true); });
  $$("[data-rail]").forEach((b) => b.addEventListener("click", () => {
    const w = cardsEl.querySelector(".nb-card").getBoundingClientRect().width + 20;
    cardsEl.scrollBy({ left: +b.dataset.rail * w, behavior: "smooth" });
  }));

  // ---- Search with autocomplete ----
  const q = $("[data-q]"), ac = $("[data-ac]"), msg = $("[data-search-msg]");
  let acItems = [], acIdx = -1;
  const matches = (v) => {
    v = v.trim().toLowerCase();
    if (!v) return N;
    return N.filter((n) => n.name.toLowerCase().includes(v) || n.city.toLowerCase().includes(v) || n.zip.startsWith(v));
  };
  function showAc() {
    acItems = matches(q.value); acIdx = -1;
    if (!acItems.length) { hideAc(); return; }
    ac.innerHTML = (q.value.trim() ? "" : `<li class="ac-h" role="presentation">Popular neighborhoods</li>`) +
      acItems.map((n, i) => `<li role="option" id="ac-${i}" data-ac-i="${i}" aria-selected="false">${ic("pin")}<b>${esc(n.name)}</b><span>${esc(n.city)} ${n.zip}</span></li>`).join("");
    ac.hidden = false; q.setAttribute("aria-expanded", "true");
  }
  function hideAc() { ac.hidden = true; q.setAttribute("aria-expanded", "false"); q.removeAttribute("aria-activedescendant"); }
  function markAc() {
    $$("[data-ac-i]", ac).forEach((li) => li.setAttribute("aria-selected", String(+li.dataset.acI === acIdx)));
    if (acIdx >= 0) q.setAttribute("aria-activedescendant", `ac-${acIdx}`);
  }
  q.addEventListener("focus", showAc);
  q.addEventListener("input", () => { msg.textContent = ""; showAc(); });
  q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); if (ac.hidden) showAc();
      if (!acItems.length) return;
      acIdx = (acIdx + (e.key === "ArrowDown" ? 1 : -1) + acItems.length) % acItems.length; markAc();
    } else if (e.key === "Escape") hideAc();
  });
  ac.addEventListener("mousedown", (e) => e.preventDefault());
  ac.addEventListener("click", (e) => { const li = e.target.closest("[data-ac-i]"); if (li) pick(acItems[+li.dataset.acI]); });
  q.addEventListener("blur", () => setTimeout(hideAc, 100));
  $("[data-search]").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!ac.hidden && acIdx >= 0) return pick(acItems[acIdx]);
    const v = q.value.trim();
    if (!v) { msg.textContent = "Type a neighborhood, city, or ZIP code — or pick one from the list."; q.focus(); return; }
    const m = matches(v);
    if (m.length) pick(m[0]);
    else { hideAc(); msg.textContent = `No neighborhoods match “${v}”. Try “Maplewood Heights”, “Riverton” or ZIP 95412.`; }
  });
  function pick(n) { q.value = n.name; hideAc(); msg.textContent = ""; select(n.id, true); }

  // ---- Render a neighborhood ----
  const RING = 2 * Math.PI * 48;
  const SC = [
    ["Walk Score", "#0D9488", (v) => v >= 90 ? "Walker's Paradise" : v >= 70 ? "Very Walkable" : v >= 50 ? "Somewhat Walkable" : "Car-Dependent", "Most daily errands can be done on foot"],
    ["Transit Score", "#2563EB", (v) => v >= 85 ? "Rider's Paradise" : v >= 60 ? "Excellent Transit" : v >= 40 ? "Good Transit" : "Some Transit", "Bus and light rail options close by"],
    ["Bike Score", "#16A34A", (v) => v >= 90 ? "Biker's Paradise" : v >= 70 ? "Very Bikeable" : v >= 50 ? "Bikeable" : "Somewhat Bikeable", "Bike lanes and gentle terrain"],
    ["Safety Score", "#7C3AED", (v) => v >= 85 ? "Very Safe" : v >= 70 ? "Safe" : "Moderately Safe", "Crime rates compared with the metro area"],
  ];
  let scoresSeen = false;

  function render() {
    const n = cur;
    document.title = `${n.name} Neighborhood Guide — Find the Neighborhood That Fits Your Life | HomeScope Realty`;
    $$(".nb-card").forEach((c) => { c.classList.toggle("on", c.dataset.nb === n.id); c.setAttribute("aria-pressed", String(c.dataset.nb === n.id)); });
    $("[data-crumb]").textContent = n.name;
    $("[data-name]").textContent = n.name;
    $("[data-loc]").innerHTML = `${ic("pin")}${esc(n.city)} · ZIP ${n.zip}`;
    $("[data-desc]").textContent = n.desc;
    $("[data-kstats]").innerHTML = [["Population", num(n.pop)], ["Median Income", usd(n.income)], ["Median Home Price", usd(n.price)], ["Avg Rent", `${usd(n.rent)}/mo`]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");

    $("[data-scores]").innerHTML = SC.map(([label, color, lvl, d], i) => {
      const v = n.scores[i];
      return `<div class="score" data-score="${i}"><svg viewBox="0 0 120 120" role="img" aria-label="${label}: ${v} out of 100, ${lvl(v)}"><circle cx="60" cy="60" r="48" fill="none" stroke="#E2E8F0" stroke-width="10"/><circle class="arc" cx="60" cy="60" r="48" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" transform="rotate(-90 60 60)" stroke-dasharray="${RING.toFixed(1)}" stroke-dashoffset="${scoresSeen ? (RING * (1 - v / 100)).toFixed(1) : RING.toFixed(1)}" data-v="${v}"/><text class="num" x="60" y="62" text-anchor="middle" dominant-baseline="middle">${v}</text><text class="den" x="60" y="84" text-anchor="middle">/100</text></svg><h3>${label}</h3><p><b style="color:${color}">${lvl(v)}</b></p><p>${d}</p></div>`;
    }).join("");

    // amenities
    AM = amenities(n);
    $("[data-am-sub]").textContent = `${n.dining} restaurants within 1 mile · ${AM.length} highlighted places in and around ${n.name}`;
    renderCats(); renderMap(); renderList();

    // schools
    $("[data-schools-h]").textContent = `Schools in ${n.name}`;
    $("[data-schools]").innerHTML = n.schools.map(([nm, gr, r, d, st]) => `<tr><td><b>${esc(nm)}</b></td><td>${gr}</td><td><span class="rate ${r >= 8 ? "g" : r >= 6 ? "y" : "r"}">${r}/10</span></td><td>${d} mi</td><td>${num(st)}</td></tr>`).join("");

    // commutes
    const c = n.commute;
    $("[data-commute-h]").textContent = `Getting Around from ${n.name}`;
    const cm = [["Downtown", "pin", [["car", c.downtown[0], "by car"], ["bus", c.downtown[1], "by transit"]]], ["Airport", "arrow", [["car", c.airport, "by car"]]], ["Tech District", "pin", [["car", c.tech[0], "by car"], ["bus", c.tech[1], "by transit"]]], ["University", "school", [["car", c.uni[0], "by car"], ["bike", c.uni[1], "by bike"]]]];
    $("[data-commutes]").innerHTML = cm.map(([to, i, modes]) => `<article class="cm"><h3>${ic(i)}${to}</h3><ul>${modes.map(([m, t, l]) => `<li>${ic(m)}<span>${l}</span><b>${t} min</b></li>`).join("")}</ul></article>`).join("");

    // market
    const mk = n.market;
    $("[data-market-h]").textContent = `${n.name} Market Trends`;
    const up = (good, txt) => `<p style="color:${good ? "#15803D" : "#B91C1C"}">${ic(txt.startsWith("+") ? "up" : "dn")}${txt}</p>`;
    $("[data-mgrid]").innerHTML = `<div><dt>Median Sale Price</dt><dd>${usd(n.price)}</dd>${up(mk.yoy >= 0, `${mk.yoy >= 0 ? "+" : ""}${mk.yoy}% YoY`)}</div>
      <div><dt>Days on Market</dt><dd>${mk.dom} days</dd>${up(mk.domd <= 0, `${mk.domd > 0 ? "+" : ""}${mk.domd} days YoY`)}</div>
      <div><dt>Price per Sq Ft</dt><dd>$${mk.ppsf}</dd></div><div><dt>Homes Sold (Last 30 Days)</dt><dd>${mk.sold}</dd></div>`;
    $("[data-listings]").textContent = `View All ${n.name} Listings`;
    renderChart();

    // reviews
    $("[data-avg]").innerHTML = `${stars(Math.round(n.avg))}<span>${n.avg}/5 from ${n.count} reviews</span>`;
    $("[data-reviews]").innerHTML = n.reviews.map(([t, who, yrs, s]) => `<figure class="rv">${stars(s)}<blockquote>“${esc(t)}”</blockquote><figcaption><b>${esc(who)}</b> · ${esc(yrs)}</figcaption></figure>`).join("");

    // compare teaser
    $("[data-teaser]").innerHTML = cmpTable([n, ...n.near.map((id) => byId[id])], TEASER_ROWS, n.id);

    // CTA
    $("[data-cta-h]").textContent = `Ready to Explore ${n.name}?`;
    $("[data-agent-role]").textContent = `${n.name} Neighborhood Specialist · 11 years local`;
    $("[data-alert-sub]").textContent = `New listings, price changes and monthly market reports for ${n.name}.`;
    $("[data-alert-msg]").textContent = ""; $("[data-alert-msg]").className = "alert-msg";
  }
  const stars = (s) => `<span class="stars" aria-label="${s} out of 5 stars">${[1, 2, 3, 4, 5].map((k) => ic("star", `i${k > s ? " off" : ""}`)).join("")}</span>`;

  const scoreObs = "IntersectionObserver" in window ? new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { scoresSeen = true; fillRings(); scoreObs.disconnect(); }
  }, { threshold: 0.3 }) : null;
  function fillRings() { $$(".arc").forEach((a) => a.setAttribute("stroke-dashoffset", (RING * (1 - a.dataset.v / 100)).toFixed(1))); }

  // ---- Map ----
  const map = $("[data-map]"), tip = $("[data-tip]"), list = $("[data-amlist]");
  map.setAttribute("preserveAspectRatio", "xMidYMid slice");
  function renderCats() {
    $("[data-cats]").innerHTML = CATS.map((c) => {
      const cnt = c.id === "dining" ? cur.dining : AM.filter((a) => a.cat === c.id).length;
      return `<button type="button" data-cat="${c.id}" aria-pressed="${on.has(c.id)}"><i style="background:${c.color}"></i>${ic(c.icon)}${c.label} <span>(${cnt})</span></button>`;
    }).join("");
  }
  $("[data-cats]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    const id = b.dataset.cat;
    if (on.has(id)) on.delete(id); else on.add(id);
    b.setAttribute("aria-pressed", String(on.has(id)));
    applyFilter();
  });
  function renderMap() {
    let o = `<rect x="-300" y="-100" width="1400" height="720" fill="#EEF2EC"/>`;
    o += `<path d="M-300 470 C 100 430 260 500 420 470 S 760 380 1100 420" stroke="#93C5FD" stroke-width="26" fill="none"/>`;
    o += `<rect x="370" y="215" width="110" height="70" rx="12" fill="#BBF7D0"/><rect x="590" y="100" width="90" height="70" rx="12" fill="#BBF7D0"/><rect x="260" y="275" width="60" height="50" rx="10" fill="#BBF7D0"/>`;
    for (let x = -260; x < 1100; x += 70) o += `<path d="M${x} -100 L ${x + 30} 620" stroke="#fff" stroke-width="${x % 280 === 20 ? 10 : 5}"/>`;
    for (let y = 30; y < 520; y += 64) o += `<path d="M-300 ${y} L 1100 ${y - 14}" stroke="#fff" stroke-width="${y % 192 === 30 ? 10 : 5}"/>`;
    o += `<path d="M180 120 L 420 80 L 690 110 L 710 300 L 640 450 L 360 440 L 170 360 Z" fill="rgba(13,148,136,.08)" stroke="#0D9488" stroke-width="3" stroke-dasharray="10 7"/>`;
    o += `<text x="440" y="118" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="20" font-weight="700" fill="#1E3A5F" opacity=".7">${esc(cur.name.toUpperCase())}</text>`;
    o += AM.map((a, i) => `<g class="pin" data-pin="${i}" data-cat="${a.cat}" tabindex="0" role="button" aria-label="${esc(a.name)}, ${catById[a.cat].label}, ${a.dist} mi, ${a.rating}" transform="translate(${a.x} ${a.y})"><circle r="10" fill="${catById[a.cat].color}"/><circle r="3.5" fill="#fff" stroke="none"/></g>`).join("");
    map.innerHTML = o;
    applyFilter();
  }
  function renderList() {
    list.innerHTML = AM.map((a, i) => {
      const c = catById[a.cat];
      return `<li data-li="${i}" data-cat="${a.cat}"><button type="button" data-li-b="${i}"><span class="am-ic" style="background:${c.color}">${ic(c.icon)}</span><span><b>${esc(a.name)}</b><span>${c.label} · ${a.dist} mi</span></span><em>${a.rating}</em></button></li>`;
    }).join("") + `<li class="more" data-cat="dining" style="padding:10px 14px;font-size:13px;color:#64748B">+ ${cur.dining - AM.filter((a) => a.cat === "dining").length} more restaurants within 1 mile</li>`;
    applyFilter();
  }
  function applyFilter() {
    $$("[data-pin]", map).forEach((p) => { p.style.display = on.has(p.dataset.cat) ? "" : "none"; });
    $$("li[data-cat]", list).forEach((l) => { l.hidden = !on.has(l.dataset.cat); });
    hideTip();
  }
  function highlight(i, fromMap) {
    $$(".pin.hl", map).forEach((p) => p.classList.remove("hl"));
    $$(".hl", list).forEach((b) => b.classList.remove("hl"));
    if (i == null) { hideTip(); return; }
    const p = $(`[data-pin="${i}"]`, map), b = $(`[data-li-b="${i}"]`, list);
    p.classList.add("hl"); b.classList.add("hl");
    map.appendChild(p); // bring to front
    const box = map.parentElement.getBoundingClientRect(), r = p.getBoundingClientRect();
    tip.textContent = `${AM[i].name} · ${AM[i].dist} mi · ${AM[i].rating}`;
    tip.style.left = `${r.left + r.width / 2 - box.left}px`; tip.style.top = `${r.top - box.top}px`; tip.hidden = false;
    if (fromMap && !list.hidden) list.scrollTo({ top: b.parentElement.offsetTop - list.clientHeight / 2 + 24, behavior: "smooth" });
  }
  function hideTip() { tip.hidden = true; }
  map.addEventListener("mouseover", (e) => { const p = e.target.closest("[data-pin]"); if (p) highlight(+p.dataset.pin, true); });
  map.addEventListener("mouseleave", () => highlight(null));
  map.addEventListener("click", (e) => { const p = e.target.closest("[data-pin]"); if (p) highlight(+p.dataset.pin, true); });
  map.addEventListener("focusin", (e) => { const p = e.target.closest("[data-pin]"); if (p) highlight(+p.dataset.pin, true); });
  map.addEventListener("keydown", (e) => { const p = e.target.closest("[data-pin]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); highlight(+p.dataset.pin, true); } });
  list.addEventListener("mouseover", (e) => { const b = e.target.closest("[data-li-b]"); if (b) highlight(+b.dataset.liB, false); });
  list.addEventListener("focusin", (e) => { const b = e.target.closest("[data-li-b]"); if (b) highlight(+b.dataset.liB, false); });
  list.addEventListener("click", (e) => { const b = e.target.closest("[data-li-b]"); if (b) highlight(+b.dataset.liB, false); });
  list.addEventListener("mouseleave", () => highlight(null));
  const lt = $("[data-list-toggle]");
  const tablet = matchMedia("(max-width: 1080px)");
  lt.addEventListener("click", () => {
    const open = list.hidden; list.hidden = !open; lt.setAttribute("aria-expanded", String(open));
    lt.lastChild.textContent = open ? "Hide list" : "Show list";
  });
  function syncTablet() { if (!tablet.matches) { list.hidden = false; lt.setAttribute("aria-expanded", "true"); } lt.lastChild.textContent = list.hidden ? "Show list" : "Hide list"; }
  tablet.addEventListener("change", syncTablet); syncTablet();

  // ---- Chart ----
  const MONTHS = ["Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26"];
  const WIG = [0, -0.4, 0.2, 0.1, 0.6, 0.3, 0.8, 0.5, 0.2, 0.6, 0.1, 0];
  function series(n) {
    const start = n.price / (1 + n.market.yoy / 100);
    return MONTHS.map((_, i) => Math.round((start + (n.price - start) * (i / 11) + WIG[i] * (n.price - start) * 0.25) / 500) * 500);
  }
  function renderChart() {
    const s = series(cur), W = 600, H = 260, L = 58, R = 14, T = 16, B = 34;
    const lo = Math.floor(Math.min(...s) / 10000) * 10000, hi = Math.ceil(Math.max(...s) / 10000) * 10000;
    const x = (i) => L + (i * (W - L - R)) / 11, y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const pts = s.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    let o = "";
    for (let k = 0; k <= 4; k++) { const v = lo + ((hi - lo) * k) / 4; o += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#E2E8F0"/><text x="${L - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#64748B">$${Math.round(v / 1000)}k</text>`; }
    MONTHS.forEach((m, i) => { if (i % 2 === 1) o += `<text x="${x(i)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="#64748B">${m}</text>`; });
    o += `<path d="M${pts[0]} L ${pts.join(" L ")} L ${x(11)},${H - B} L ${x(0)},${H - B} Z" fill="#0D9488" opacity=".1"/><polyline points="${pts.join(" ")}" fill="none" stroke="#0D9488" stroke-width="3" stroke-linejoin="round"/>`;
    o += s.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === 11 ? 5 : 3}" fill="${i === 11 ? "#0D9488" : "#fff"}" stroke="#0D9488" stroke-width="2"/>`).join("");
    o += s.map((v, i) => `<rect class="hit" data-h="${i}" x="${x(i) - (W - L - R) / 22}" y="${T}" width="${(W - L - R) / 11}" height="${H - T - B}"/>`).join("");
    const chart = $("[data-chart]");
    chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Median sale price rose from ${usd(s[0])} in ${MONTHS[0]} to ${usd(s[11])} in ${MONTHS[11]}">${o}</svg><div class="ctip" hidden></div>`;
    $("[data-chart-range]").textContent = `${usd(s[0])} → ${usd(s[11])}`;
    const ct = $(".ctip", chart), svgEl = $("svg", chart);
    const show = (i) => {
      const r = svgEl.getBoundingClientRect();
      ct.textContent = `${MONTHS[i]}: ${usd(s[i])}`; ct.hidden = false;
      ct.style.left = `${(x(i) / W) * r.width}px`; ct.style.top = `${(y(s[i]) / H) * r.height}px`;
    };
    svgEl.addEventListener("pointermove", (e) => { const h = e.target.closest("[data-h]"); if (h) show(+h.dataset.h); });
    svgEl.addEventListener("pointerleave", () => { ct.hidden = true; });
  }

  // ---- Compare ----
  const TEASER_ROWS = [
    ["Median home price", (n) => n.price, usd, "min"],
    ["Walk Score", (n) => n.scores[0], (v) => v, "max"],
    ["School rating (avg)", schoolAvg, (v) => `${v}/10`, "max"],
    ["Commute to downtown", (n) => n.commute.downtown[0], (v) => `${v} min`, "min"],
  ];
  const FULL_ROWS = [
    ...TEASER_ROWS,
    ["Transit Score", (n) => n.scores[1], (v) => v, "max"],
    ["Safety Score", (n) => n.scores[3], (v) => v, "max"],
    ["Avg rent", (n) => n.rent, (v) => `${usd(v)}/mo`, "min"],
    ["Price per sq ft", (n) => n.market.ppsf, (v) => `$${v}`, "min"],
    ["Days on market", (n) => n.market.dom, (v) => `${v} days`, "min"],
    ["Resident rating", (n) => n.avg, (v) => `${v}/5`, "max"],
  ];
  function cmpTable(ns, rows, curId) {
    const head = `<thead><tr><th scope="col">Metric</th>${ns.map((n) => `<th scope="col"${n.id === curId ? ' class="cur"' : ""}>${esc(n.name)}</th>`).join("")}</tr></thead>`;
    const body = rows.map(([label, get, fmt, best]) => {
      const vals = ns.map(get), b = best === "min" ? Math.min(...vals) : Math.max(...vals);
      const tie = vals.filter((v) => v === b).length === vals.length;
      return `<tr><th scope="row">${label}</th>${vals.map((v) => `<td${v === b && !tie ? ' class="best"' : ""}>${fmt(v)}</td>`).join("")}</tr>`;
    }).join("");
    return head + `<tbody>${body}</tbody>`;
  }
  const cmpModal = $("[data-modal=compare]"), pickers = $("[data-pickers]");
  function openCompare() {
    const ids = [cur.id, ...cur.near];
    pickers.innerHTML = ids.map((id, k) => `<label class="f"><span>Neighborhood ${k + 1}</span><select data-pick>${N.map((n) => `<option value="${n.id}"${n.id === id ? " selected" : ""}>${esc(n.name)}</option>`).join("")}</select></label>`).join("");
    fullCmp(); cmpModal.showModal();
  }
  function fullCmp() {
    const ns = $$("[data-pick]", pickers).map((s) => byId[s.value]);
    $("[data-full-cmp]").innerHTML = cmpTable(ns, FULL_ROWS, cur.id);
  }
  pickers.addEventListener("change", fullCmp);
  $("[data-open-compare]").addEventListener("click", openCompare);

  // ---- Modals ----
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });
  const tourModal = $("[data-modal=tour]"), tf = $("[data-tour-form]"), done = $(".done", tourModal);
  $("[data-open-tour]").addEventListener("click", () => {
    tf.hidden = false; done.hidden = true; $("[data-err]").textContent = "";
    $$("[aria-invalid]", tf).forEach((el) => el.removeAttribute("aria-invalid"));
    $("[data-tour-sub]").textContent = `Marcus Bell will show you the streets, schools and favorite spots of ${cur.name}.`;
    const d = new Date(); d.setDate(d.getDate() + 1);
    tf.date.min = d.toISOString().slice(0, 10);
    tourModal.showModal();
  });
  tf.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = [];
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    $$("[aria-invalid]", tf).forEach((el) => el.removeAttribute("aria-invalid"));
    if (!tf.name.value.trim()) bad(tf.name, "Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tf.email.value.trim())) bad(tf.email, "Please enter a valid email.");
    if (!tf.date.value || tf.date.value < tf.date.min) bad(tf.date, "Please choose a date from tomorrow onward.");
    $("[data-err]").textContent = errs.join(" ");
    if (errs.length) { tf.querySelector("[aria-invalid]").focus(); return; }
    const when = new Date(tf.date.value + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    $("[data-done]").textContent = `Thanks, ${tf.name.value.trim().split(" ")[0]}! Marcus will confirm your ${tf.kind.value.toLowerCase()} of ${cur.name} on ${when} by email. (Demo — nothing was sent.)`;
    tf.hidden = true; done.hidden = false; tf.reset();
    $("button", done).focus();
  });

  // ---- Alerts ----
  $("[data-alerts]").addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = $("#alert-email"), m = $("[data-alert-msg]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
      inp.setAttribute("aria-invalid", "true"); m.className = "alert-msg bad"; m.textContent = "Please enter a valid email address."; inp.focus(); return;
    }
    inp.removeAttribute("aria-invalid"); m.className = "alert-msg ok";
    m.textContent = `You're subscribed to ${cur.name} market alerts. (Demo — nothing was sent.)`;
    inp.value = "";
  });

  // ---- Toast / listings ----
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  $("[data-listings]").addEventListener("click", (e) => {
    e.preventDefault();
    toast(`Listing search is a demo — ${cur.market.sold + 13} ${cur.name} homes would open here.`);
  });

  // ---- Selection ----
  function select(id, user) {
    if (!byId[id]) return;
    cur = byId[id];
    render();
    if (user) { const d = $("#detail"); d.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); d.focus({ preventScroll: true }); toast(`Showing ${cur.name}`); }
  }
  window.MuseGuide = { select: (id) => select(id, false), current: () => cur.id };

  render();
  if (scoreObs) scoreObs.observe($("[data-scores]")); else { scoresSeen = true; fillRings(); }
})();
