(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "") => `<svg class="ic ${cls}"><use href="#i-${id}"/></svg>`;

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3400); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  /* ---------- Currency ---------- */
  const rates = { USD: [1, "en-US", "USD"], EUR: [0.92, "de-DE", "EUR"], JPY: [151, "ja-JP", "JPY"] };
  let cur = "USD";
  const money = (usd) => { const [r, loc, c] = rates[cur]; return new Intl.NumberFormat(loc, { style: "currency", currency: c, maximumFractionDigits: 0 }).format(usd * r); };

  /* ---------- Data: 247 deterministic mock itineraries ---------- */
  let seed = 42;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const airlines = [
    { code: "NH", name: "ANA", full: "All Nippon Airways", n: 42, color: "#13448F", alliance: "Star Alliance", hubs: ["ORD", "SFO", "LAX", "SEA"] },
    { code: "JL", name: "JAL", full: "Japan Airlines", n: 38, color: "#C8102E", alliance: "Oneworld", hubs: ["LAX", "SFO", "DFW", "ORD"] },
    { code: "DL", name: "Delta", full: "Delta Air Lines", n: 35, color: "#9B1631", alliance: "SkyTeam", hubs: ["LAX", "SEA", "ICN", "DTW"] },
    { code: "UA", name: "United", full: "United Airlines", n: 31, color: "#0033A0", alliance: "Star Alliance", hubs: ["SFO", "ORD", "LAX", "DEN"] },
    { code: "AA", name: "American", full: "American Airlines", n: 28, color: "#0078D2", alliance: "Oneworld", hubs: ["DFW", "LAX", "ORD"] },
    { code: "KE", name: "Korean Air", full: "Korean Air", n: 22, color: "#00256C", alliance: "SkyTeam", hubs: ["ICN"] },
    { code: "AC", name: "Air Canada", full: "Air Canada", n: 15, color: "#D22630", alliance: "Star Alliance", hubs: ["YVR", "YYZ"] },
    { code: "BR", name: "EVA Air", full: "EVA Air", n: 13, color: "#007A53", alliance: "Star Alliance", hubs: ["TPE"] },
    { code: "OZ", name: "Asiana", full: "Asiana Airlines", n: 12, color: "#8C6239", alliance: "Star Alliance", hubs: ["ICN"] },
    { code: "CX", name: "Cathay", full: "Cathay Pacific", n: 11, color: "#006564", alliance: "Oneworld", hubs: ["HKG"] },
  ];
  const aircraft = [["Boeing 777-300ER", 31, 17.2], ["Boeing 787-9", 32, 17.3], ["Airbus A350-900", 31, 18], ["Boeing 767-300ER", 32, 17.1], ["Airbus A330-300", 31, 17.5]];
  const stopsPlan = [...Array(3).fill(0), ...Array(89).fill(1), ...Array(155).fill(2)];
  // Distribute stops: nonstops go to ANA, JAL, United; the rest are shuffled deterministically.
  const rest = stopsPlan.slice(3);
  for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
  const hm = (m) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
  const clock = (m) => { m = ((m % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${(h % 12) || 12}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const TZ = 13 * 60; // NRT is 13h ahead of JFK in April
  function leg(dir, al, stops, dep, dur, extra = {}) {
    const local = dir === "out" ? dep + dur + TZ : dep + dur - TZ;
    const days = Math.floor(local / 1440);
    const via = [];
    const pool = [...al.hubs, "ICN", "SEA", "YVR", "TPE", "HKG"];
    while (via.length < stops) { const h = via.length === 0 ? pick(al.hubs) : pick(pool); if (!via.includes(h)) via.push(h); }
    const ac = pick(aircraft);
    return { from: dir === "out" ? "JFK" : "NRT", to: dir === "out" ? "NRT" : "JFK", dep, dur, arr: local % 1440, plus: days, stops, via, aircraft: ac, ...extra };
  }
  const flights = [];
  let idx = 0;
  airlines.forEach((al) => {
    for (let k = 0; k < al.n; k++) {
      let stops;
      if ((al.code === "NH" || al.code === "JL" || al.code === "UA") && !flights.some((f) => f.al === al && f.out.stops === 0)) stops = 0;
      else stops = rest[idx++];
      const outDur = stops === 0 ? 830 + Math.floor(rnd() * 25) : stops === 1 ? 960 + Math.floor(rnd() * 480) : 1320 + Math.floor(rnd() * 840);
      const retDur = stops === 0 ? 755 + Math.floor(rnd() * 25) : outDur - 60 + Math.floor(rnd() * 90);
      const dep = 5 * 60 + Math.floor(rnd() * 18.5 * 4) * 15;
      const rdep = 6 * 60 + Math.floor(rnd() * 17 * 4) * 15;
      const base = stops === 0 ? 900 + rnd() * 380 : stops === 1 ? 905 + rnd() * 1500 : 900 + rnd() * 3290;
      flights.push({ id: `${al.code}${k}`, al, num: `${al.code} ${stops === 0 ? (al.code === "NH" ? 9 : al.code === "JL" ? 5 : 79) : 100 + Math.floor(rnd() * 899)}`, out: leg("out", al, stops, dep, outDur), ret: leg("ret", al, stops, rdep, retDur), price: Math.round(base) });
    }
  });
  // Pin the prompt's reference itineraries.
  const ana = flights.find((f) => f.al.code === "NH" && f.out.stops === 0);
  Object.assign(ana, { price: 892, out: { ...ana.out, dep: 655, dur: 850, arr: 845, plus: 1, aircraft: aircraft[0] }, ret: { ...ana.ret, dep: 1050, dur: 765, arr: 975, plus: 0, aircraft: aircraft[0] } });
  const jal = flights.find((f) => f.al.code === "JL" && f.out.stops === 0);
  Object.assign(jal, { price: 1045, out: { ...jal.out, dep: 690, dur: 830, arr: 690 + 830 + TZ - 1440, plus: 1 } });
  const cheapest = flights.find((f) => f.out.stops === 2 && f.al.code === "KE");
  cheapest.price = 876;
  const durTotal = (f) => f.out.dur + f.ret.dur;
  const minPrice = Math.min(...flights.map((f) => f.price));
  const minDur = Math.min(...flights.map(durTotal));
  const bestScore = (f) => 0.6 * (f.price / minPrice) + 0.4 * (durTotal(f) / minDur) + f.out.stops * 0.01;
  const fastestId = flights.reduce((a, b) => (durTotal(a) <= durTotal(b) ? a : b)).id;
  const cheapestId = cheapest.id;
  const bestId = flights.reduce((a, b) => (bestScore(a) <= bestScore(b) ? a : b)).id;

  /* ---------- Filters ---------- */
  const slotsDef = [["morning", "Morning", "6AM–12PM", "sunrise", 360, 720], ["afternoon", "Afternoon", "12PM–6PM", "sun", 720, 1080], ["evening", "Evening", "6PM–12AM", "sunset", 1080, 1440], ["redeye", "Red-Eye", "12AM–6AM", "moon", 0, 360]];
  const slotOf = (m) => slotsDef.find(([, , , , a, b]) => m >= a && m < b)[0];
  const layovers = ["LAX", "SFO", "ORD", "ICN", "SEA", "DFW", "YVR", "TPE", "HKG", "DEN", "DTW", "YYZ"];
  const defaults = () => ({ pMin: 650, pMax: 4200, stops: new Set(), air: new Set(), dep: new Set(), arr: new Set(), dur: 36, lay: new Set(), all: new Set() });
  let F = defaults();
  let sortBy = "best";
  const stopLabel = (s) => (s === 0 ? "Nonstop" : s === 1 ? "1 Stop" : "2+ Stops");
  const passes = (f, skip) =>
    (skip === "price" || (f.price >= F.pMin && f.price <= F.pMax)) &&
    (skip === "stops" || !F.stops.size || F.stops.has(Math.min(2, f.out.stops))) &&
    (skip === "air" || !F.air.size || F.air.has(f.al.code)) &&
    (skip === "dep" || !F.dep.size || F.dep.has(slotOf(f.out.dep))) &&
    (skip === "arr" || !F.arr.size || F.arr.has(slotOf(f.out.arr))) &&
    (skip === "dur" || f.out.dur <= F.dur * 60) &&
    (skip === "lay" || !F.lay.size || f.out.via.some((v) => F.lay.has(v)) || f.ret.via.some((v) => F.lay.has(v))) &&
    (skip === "all" || !F.all.size || F.all.has(f.al.alliance));

  const check = (group, value, label, count, extra = "") => `<label class="chk"><input type="checkbox" data-g="${group}" value="${value}"><span class="box">${icon("check")}</span>${extra}<span class="lbl">${label}</span><span class="cnt">${count}</span></label>`;
  const mono = (al, size = "") => `<span class="mono ${size}" style="--c:${al.color}" aria-hidden="true">${al.code}</span>`;
  function buildFilters() {
    $("#fStops").innerHTML = [0, 1, 2].map((s) => check("stops", s, stopLabel(s), flights.filter((f) => Math.min(2, f.out.stops) === s).length)).join("");
    $("#fAir").innerHTML = airlines.map((al, i) => `<div class="${i >= 6 ? "extra-air" : ""}"${i >= 6 ? " hidden" : ""}>${check("air", al.code, `${al.full}${al.full !== al.name ? ` (${al.code === "NH" ? "ANA" : al.code === "JL" ? "JAL" : al.name})` : ""}`, al.n, mono(al, "sm"))}</div>`).join("");
    const slots = (g) => slotsDef.map(([v, l, t, ic]) => `<button type="button" class="slot" data-g="${g}" data-v="${v}" aria-pressed="false">${icon(ic)}<strong>${l}</strong><small>${t}</small></button>`).join("");
    $("#fDepSlots").innerHTML = slots("dep");
    $("#fArrSlots").innerHTML = slots("arr");
    $("#fLay").innerHTML = layovers.map((l) => `<button type="button" class="chip" data-g="lay" data-v="${l}" aria-pressed="false">${l}</button>`).join("");
    $("#fAll").innerHTML = ["Star Alliance", "SkyTeam", "Oneworld"].map((a) => check("all", a, a, flights.filter((f) => f.al.alliance === a).length)).join("");
    // Histogram of fares
    const bins = Array(24).fill(0);
    flights.forEach((f) => bins[Math.min(23, Math.floor(((f.price - 650) / 3550) * 24))]++);
    const max = Math.max(...bins);
    $("#hist").innerHTML = bins.map((b, i) => `<span data-i="${i}" style="height:${Math.max(4, (b / max) * 100)}%"></span>`).join("");
  }
  buildFilters();
  function syncFilterUI() {
    $$(".chk input").forEach((c) => { c.checked = F[c.dataset.g].has(c.dataset.g === "stops" ? Number(c.value) : c.value); });
    $$(".slot, #fLay .chip").forEach((b) => b.setAttribute("aria-pressed", F[b.dataset.g].has(b.dataset.v)));
    $("#pMin").value = F.pMin; $("#pMax").value = F.pMax; $("#dur").value = F.dur;
    paintRange();
  }
  function paintRange() {
    const lo = Number($("#pMin").value), hi = Number($("#pMax").value);
    $("#pMinV").textContent = money(lo); $("#pMaxV").textContent = money(hi) + (hi === 4200 ? "+" : "");
    const a = ((lo - 650) / 3550) * 100, b = ((hi - 650) / 3550) * 100;
    $("#dualFill").style.left = a + "%"; $("#dualFill").style.width = (b - a) + "%";
    $$("#hist span").forEach((s, i) => { const mid = 650 + (i + 0.5) * (3550 / 24); s.classList.toggle("on", mid >= lo && mid <= hi); });
    $("#durV").textContent = `up to ${$("#dur").value}h`;
  }
  $("#filters").addEventListener("change", (e) => {
    const c = e.target.closest(".chk input");
    if (!c) return;
    const set = F[c.dataset.g], v = c.dataset.g === "stops" ? Number(c.value) : c.value;
    c.checked ? set.add(v) : set.delete(v);
    update();
  });
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".slot, #fLay .chip");
    if (!b) return;
    const set = F[b.dataset.g];
    set.has(b.dataset.v) ? set.delete(b.dataset.v) : set.add(b.dataset.v);
    b.setAttribute("aria-pressed", set.has(b.dataset.v));
    update();
  });
  $("#pMin").addEventListener("input", (e) => { if (+e.target.value > F.pMax - 100) e.target.value = F.pMax - 100; F.pMin = +e.target.value; paintRange(); update(); });
  $("#pMax").addEventListener("input", (e) => { if (+e.target.value < F.pMin + 100) e.target.value = F.pMin + 100; F.pMax = +e.target.value; paintRange(); update(); });
  $("#dur").addEventListener("input", (e) => { F.dur = +e.target.value; paintRange(); update(); });
  $("#moreAir").addEventListener("click", (e) => {
    const open = e.currentTarget.getAttribute("aria-expanded") !== "true";
    $$(".extra-air").forEach((d) => (d.hidden = !open));
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.textContent = open ? "Show fewer airlines" : `Show ${airlines.length - 6} more airlines`;
  });
  $("#moreAir").textContent = `Show ${airlines.length - 6} more airlines`;
  const resetAll = () => { F = defaults(); syncFilterUI(); update(); };
  $("#resetBtn").addEventListener("click", resetAll);
  $("#emptyReset").addEventListener("click", resetAll);

  /* ---------- Results ---------- */
  let shown = 10;
  let current = [];
  const expanded = new Set();
  const sorters = { best: (a, b) => bestScore(a) - bestScore(b), cheap: (a, b) => a.price - b.price || durTotal(a) - durTotal(b), fast: (a, b) => durTotal(a) - durTotal(b), early: (a, b) => a.out.dep - b.out.dep, late: (a, b) => b.out.dep - a.out.dep };
  const sortNames = { best: "Best", cheap: "Cheapest", fast: "Fastest", early: "Earliest Departure", late: "Latest Departure" };
  const pax = { adults: 2, children: 0 };
  const travelers = () => pax.adults + pax.children;
  function legHTML(l, label) {
    const stopTxt = l.stops === 0 ? `<span class="nonstop">Nonstop</span>` : `<span class="stopping">${l.stops} stop${l.stops > 1 ? "s" : ""} · ${l.via.join(", ")}</span>`;
    return `<div class="leg"><span class="vh">${label}:</span>
      <div class="pt"><strong>${clock(l.dep)}</strong><span>${l.from}</span></div>
      <div class="route"><span class="dur">${hm(l.dur)}</span><span class="line">${Array.from({ length: l.stops }, () => '<i class="dot"></i>').join("")}${icon("plane", "pl")}</span>${stopTxt}</div>
      <div class="pt"><strong>${clock(l.arr)}${l.plus ? `<sup class="plus">+${l.plus}</sup>` : ""}</strong><span>${l.to}</span></div></div>`;
  }
  function fares(f) {
    return [
      ["Basic Economy", f.price, ["No seat selection", "No changes", "1 personal item"], ["x", "x", "check"]],
      ["Economy", f.price + 66, ["Seat selection included", "$200 change fee", "1 carry-on + 1 checked bag"], ["check", "info", "check"]],
      ["Premium Economy", f.price + 448, ["Extra legroom", "Free changes", "2 checked bags", "Priority boarding"], ["check", "check", "check", "check"]],
    ];
  }
  function segs(l, dir) {
    const points = [l.from, ...l.via, l.to];
    const n = points.length - 1;
    const lay = l.stops ? Math.round((l.dur - (l.dur * 0.82)) / l.stops) : 0;
    const flyEach = Math.round((l.dur - lay * l.stops) / n);
    let t = l.dep, out = "";
    for (let i = 0; i < n; i++) {
      out += `<li class="seg"><span class="seg-ic">${icon(i === 0 ? "takeoff" : "plane")}</span><div><strong>${points[i]} → ${points[i + 1]}</strong> · ${hm(flyEach)}<small>${l.aircraft[0]} · ${3 + (i * 5) % 9} yrs old · Terminal ${dir === "out" && i === 0 ? "7" : 1 + (i % 3)}, Gate ${["B", "C", "D"][i % 3]}${12 + i * 7}</small></div></li>`;
      t += flyEach;
      if (i < n - 1) {
        const change = i % 2 === 0;
        out += `<li class="lay"><span class="seg-ic">${icon("clock")}</span><div>Layover in <strong>${points[i + 1]}</strong> · ${hm(lay)}${change ? ` <span class="term">${icon("door")}Terminal change</span>` : ""}</div></li>`;
        t += lay;
      }
    }
    return out;
  }
  function detailHTML(f) {
    return `<div class="detail">
      <div class="det-legs">
        ${[["Outbound · Wed, Apr 15", f.out, "out"], ["Return · Wed, Apr 29", f.ret, "ret"]].map(([t, l, d]) => `<div><h4>${t}</h4><ol class="timeline">${segs(l, d)}</ol></div>`).join("")}
        <div class="amen"><h4>On board</h4><ul><li>${icon("wifi")}Wi-Fi</li><li>${icon("meal")}Meal service</li><li>${icon("tv")}Entertainment</li><li>${icon("plug")}Power outlet</li></ul>
          <p>Seat pitch: <strong>${f.out.aircraft[1]} inches</strong> | Seat width: <strong>${f.out.aircraft[2]} inches</strong></p></div>
      </div>
      <h4>Choose your fare</h4>
      <div class="fares">${fares(f).map(([n, p, items, ics], i) => `<div class="fare${i === 1 ? " rec" : ""}">${i === 1 ? '<span class="rec-tag">Most chosen</span>' : ""}<h5>${n}</h5><p class="fp">${money(p)}<small>/person</small></p>
        <ul>${items.map((it, j) => `<li class="${ics[j]}">${icon(ics[j])}${it}</li>`).join("")}</ul>
        <button class="btn ${i === 1 ? "btn-blue" : "btn-outline"} btn-block" data-select="${f.id}" data-fare="${i}" type="button">Select This Fare</button></div>`).join("")}</div>
      <p class="bag">${icon("briefcase")}<span><strong>Baggage:</strong> personal item 40×30×20 cm · carry-on up to 10 kg (22 lb) · checked bags up to 23 kg (50 lb) each, 158 cm linear. Overweight fees apply at the airport.</span></p>
    </div>`;
  }
  function cardHTML(f) {
    const badges = [f.id === bestId && sortBy === "best" ? '<span class="badge b-best">Best Value</span>' : "", f.id === cheapestId ? '<span class="badge b-cheap">Cheapest</span>' : "", f.id === fastestId ? '<span class="badge b-fast">Fastest</span>' : ""].join("");
    const open = expanded.has(f.id);
    return `<article class="card${open ? " open" : ""}" data-id="${f.id}">
      ${badges ? `<div class="badges-row">${badges}</div>` : ""}
      <div class="card-main">
        <div class="air">${mono(f.al)}<div><strong>${f.al.name}</strong><span>${f.num}</span></div></div>
        <div class="legs">${legHTML(f.out, "Outbound")}${legHTML(f.ret, "Return")}<p class="ac">${f.out.aircraft[0]} · ${$("#fClass").value}</p></div>
        <div class="buy"><p class="price">${money(f.price)}<small>/person</small></p><p class="total">${money(f.price * travelers())} total</p>
          <button class="btn btn-blue btn-block" type="button" data-select="${f.id}" data-fare="0">Select</button>
          ${f.price < 1400 ? `<a href="#top" class="lock" data-toast="Price lock: hold ${money(f.price)} for 72 hours for ${money(12)} (demo).">${icon("lock")}Price lock available</a>` : ""}</div>
      </div>
      <button class="expand" type="button" aria-expanded="${open}" aria-controls="d-${f.id}">${open ? "Hide" : "Flight"} details ${icon("chev-down")}</button>
      <div class="det-wrap" id="d-${f.id}"${open ? "" : " hidden"}>${open ? detailHTML(f) : ""}</div>
    </article>`;
  }
  const sponsored = `<article class="card sponsored"><span class="spons">Sponsored</span><div class="sp-in">${mono(airlines[0])}<div><h3>Fly ANA Premium Economy</h3><p>Extra legroom, lounge access, 2 bags included. From <strong class="sp-price"></strong>/person</p></div><button class="btn btn-outline" type="button" data-toast="Opening ANA Premium Economy deals (demo).">View Deal</button></div></article>`;
  const trust = `<div class="trust"><span class="logo logo-sm">${icon("send")}FlyFair</span><ul><li>${icon("check")}No hidden fees</li><li>${icon("check")}Price match guarantee</li><li>${icon("check")}Free cancellation within 24 hours</li><li>${icon("check")}24/7 support</li></ul></div>`;
  function render() {
    const list = $("#list");
    const slice = current.slice(0, shown);
    let html = "";
    slice.forEach((f, i) => { html += cardHTML(f); if (i === 2) html += sponsored; if (i === 4) html += trust; });
    list.innerHTML = html;
    $$(".sp-price", list).forEach((s) => (s.textContent = money(1190)));
    $("#empty").hidden = current.length > 0;
    $("#showing").textContent = `Showing ${Math.min(shown, current.length)} of ${current.length} flights`;
    const left = current.length - shown;
    $("#moreBtn").hidden = left <= 0;
    $("#moreBtn").textContent = `Show ${Math.min(20, Math.max(0, left))} more flights`;
    $(".more").hidden = current.length === 0;
  }
  function filterCounts() {
    $$("#fStops .chk").forEach((l) => { const v = Number(l.querySelector("input").value); l.querySelector(".cnt").textContent = flights.filter((f) => passes(f, "stops") && Math.min(2, f.out.stops) === v).length; });
    $$("#fAir .chk").forEach((l) => { const v = l.querySelector("input").value; l.querySelector(".cnt").textContent = flights.filter((f) => passes(f, "air") && f.al.code === v).length; });
    $$("#fAll .chk").forEach((l) => { const v = l.querySelector("input").value; l.querySelector(".cnt").textContent = flights.filter((f) => passes(f, "all") && f.al.alliance === v).length; });
  }
  function activeChips() {
    const chips = [];
    if (F.pMin > 650 || F.pMax < 4200) chips.push(["price", "", `${money(F.pMin)}–${money(F.pMax)}`]);
    F.stops.forEach((s) => chips.push(["stops", s, stopLabel(s)]));
    F.air.forEach((a) => chips.push(["air", a, airlines.find((x) => x.code === a).name]));
    F.dep.forEach((d) => chips.push(["dep", d, "Depart: " + slotsDef.find((s) => s[0] === d)[1]]));
    F.arr.forEach((d) => chips.push(["arr", d, "Arrive: " + slotsDef.find((s) => s[0] === d)[1]]));
    if (F.dur < 36) chips.push(["dur", "", `≤ ${F.dur}h`]);
    F.lay.forEach((l) => chips.push(["lay", l, "Via " + l]));
    F.all.forEach((a) => chips.push(["all", a, a]));
    $("#activeFilters").innerHTML = chips.map(([g, v, t]) => `<button type="button" class="af" data-g="${g}" data-v="${v}" aria-label="Remove filter ${t}">${t}${icon("x")}</button>`).join("") + (chips.length > 1 ? `<button type="button" class="text-btn" id="clearChips">Clear all</button>` : "");
  }
  $("#activeFilters").addEventListener("click", (e) => {
    if (e.target.closest("#clearChips")) return resetAll();
    const b = e.target.closest(".af");
    if (!b) return;
    const { g, v } = b.dataset;
    if (g === "price") { F.pMin = 650; F.pMax = 4200; } else if (g === "dur") F.dur = 36;
    else F[g].delete(g === "stops" ? Number(v) : v);
    syncFilterUI();
    update();
  });
  function update(keepShown) {
    current = flights.filter((f) => passes(f)).sort(sorters[sortBy]);
    if (!keepShown) shown = 10;
    render();
    filterCounts();
    activeChips();
    const from = current.length ? Math.min(...current.map((f) => f.price)) : 0;
    $("#summaryText").innerHTML = `<strong>${current.length} flight${current.length === 1 ? "" : "s"} found</strong> · ${route.from} → ${route.to} · ${tripLabel()} · ${dateLabel()}`;
    $("#mbarText").innerHTML = current.length ? `<strong>${current.length} flights</strong> from ${money(from)}` : "<strong>No flights</strong> match";
    $("#sheetCount").textContent = current.length;
  }

  // Card interactions
  $("#list").addEventListener("click", (e) => {
    const ex = e.target.closest(".expand");
    if (ex) {
      const card = ex.closest(".card"), id = card.dataset.id, f = flights.find((x) => x.id === id);
      const open = !expanded.has(id);
      open ? expanded.add(id) : expanded.delete(id);
      card.classList.toggle("open", open);
      ex.setAttribute("aria-expanded", open);
      ex.innerHTML = `${open ? "Hide" : "Flight"} details ${icon("chev-down")}`;
      const w = card.querySelector(".det-wrap");
      w.innerHTML = open ? detailHTML(f) : "";
      w.hidden = !open;
      return;
    }
    const sel = e.target.closest("[data-select]");
    if (sel) openBooking(flights.find((x) => x.id === sel.dataset.select), Number(sel.dataset.fare));
  });

  // More / infinite scroll
  function loadMore() {
    if (shown >= current.length) return;
    const list = $("#list");
    list.insertAdjacentHTML("beforeend", Array.from({ length: 3 }, () => `<div class="card skeleton" aria-hidden="true"><i></i><i></i><i></i></div>`).join(""));
    $("#moreBtn").disabled = true;
    setTimeout(() => { shown += 20; render(); $("#moreBtn").disabled = false; }, 600);
  }
  $("#moreBtn").addEventListener("click", loadMore);
  let io;
  $("#infinite").addEventListener("change", (e) => {
    if (io) io.disconnect();
    if (e.target.checked && "IntersectionObserver" in window) {
      io = new IntersectionObserver((es) => { if (es[0].isIntersecting && !$("#moreBtn").disabled) loadMore(); }, { rootMargin: "300px" });
      io.observe($("#sentinel"));
    }
  });

  // Sort
  const sortSel = $("#sort");
  sortSel.addEventListener("change", () => { sortBy = sortSel.value; update(); syncSortSheet(); });
  $("#sortOptions").innerHTML = Object.entries(sortNames).map(([k, v]) => `<label class="sort-opt"><input type="radio" name="msort" value="${k}"${k === "best" ? " checked" : ""}><span>${v}</span>${icon("check")}</label>`).join("");
  const syncSortSheet = () => $$("#sortOptions input").forEach((r) => (r.checked = r.value === sortBy));
  $("#sortOptions").addEventListener("change", (e) => { sortBy = e.target.value; sortSel.value = sortBy; update(); closeSheets(); });

  /* ---------- Mobile sheets ---------- */
  const backdrop = $("#backdrop");
  function openSheet(el) { el.classList.add("open"); el.hidden = false; backdrop.hidden = false; document.body.classList.add("locked"); (el.querySelector("button, input") || el).focus(); }
  function closeSheets() { $("#filters").classList.remove("open"); $("#sortSheet").classList.remove("open"); $("#sortSheet").hidden = true; backdrop.hidden = true; document.body.classList.remove("locked"); }
  $("#mFilter").addEventListener("click", () => openSheet($("#filters")));
  $("#mSort").addEventListener("click", () => openSheet($("#sortSheet")));
  $("#closeFilters").addEventListener("click", closeSheets);
  $("#applyFilters").addEventListener("click", () => { closeSheets(); $("#results").scrollIntoView(); });
  backdrop.addEventListener("click", closeSheets);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSheets(); $("#paxPop").hidden = true; } });

  /* ---------- Search bar ---------- */
  const route = { from: "JFK", to: "NRT" };
  const code = (v) => (v.match(/^\s*([A-Za-z]{3})\b/) || [])[1]?.toUpperCase();
  const fmtDate = (v) => new Date(v + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const tripType = () => $("input[name=trip]:checked").value;
  const tripLabel = () => ({ round: "Round trip", oneway: "One way", multi: "Multi-city" }[tripType()]);
  const dateLabel = () => tripType() === "oneway" ? fmtDate($("#fDep").value) : `${fmtDate($("#fDep").value)} – ${fmtDate($("#fRet").value)}`;
  const paxText = () => `${pax.adults} Adult${pax.adults > 1 ? "s" : ""}${pax.children ? `, ${pax.children} Child${pax.children > 1 ? "ren" : ""}` : ""}`;
  function syncSummary() {
    const d = tripType() === "oneway" ? fmtDate($("#fDep").value) : `${fmtDate($("#fDep").value)}–${fmtDate($("#fRet").value).replace(/^[A-Za-z]+ /, "")}`;
    $("#mSummary").innerHTML = `<strong>${route.from} → ${route.to}</strong> · ${d} · ${paxText()}`;
  }
  $$("input[name=trip]").forEach((r) => r.addEventListener("change", () => { $("#retField").hidden = tripType() === "oneway"; if (tripType() === "multi") toast("Multi-city search is a demo — showing round-trip results."); }));
  $("#swapBtn").addEventListener("click", () => { const a = $("#fFrom"), b = $("#fTo"); [a.value, b.value] = [b.value, a.value]; $("#swapBtn").classList.toggle("spun"); });
  const paxBtn = $("#paxBtn"), paxPop = $("#paxPop");
  paxBtn.addEventListener("click", () => { paxPop.hidden = !paxPop.hidden; paxBtn.setAttribute("aria-expanded", !paxPop.hidden); });
  paxPop.addEventListener("click", (e) => {
    const b = e.target.closest("[data-pax]");
    if (!b) return;
    const k = b.dataset.pax;
    pax[k] = Math.max(k === "adults" ? 1 : 0, Math.min(9 - (k === "adults" ? pax.children : pax.adults), pax[k] + Number(b.dataset.d)));
    $("#pAdults").textContent = pax.adults; $("#pChildren").textContent = pax.children;
    $("#paxLabel").textContent = paxText();
  });
  $("#paxDone").addEventListener("click", () => { paxPop.hidden = true; paxBtn.setAttribute("aria-expanded", "false"); paxBtn.focus(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".pax-field")) { paxPop.hidden = true; paxBtn.setAttribute("aria-expanded", "false"); } });
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("#searchErr"), a = code($("#fFrom").value), b = code($("#fTo").value);
    let msg = "";
    if (!a || !b) msg = "Enter airports as a 3-letter code, e.g. JFK.";
    else if (a === b) msg = "Origin and destination must be different.";
    else if (tripType() !== "oneway" && $("#fRet").value <= $("#fDep").value) msg = "Return date must be after the departure date.";
    if (msg) { err.textContent = msg; err.hidden = false; return; }
    err.hidden = true;
    route.from = a; route.to = b;
    syncSummary();
    update();
    toast(`Updated search: ${a} → ${b}, ${paxText()}. Showing sample fares.`);
    if (window.matchMedia("(max-width: 900px)").matches) toggleModify(false);
  });
  const toggleModify = (open) => { $("#searchForm").classList.toggle("open", open); $("#modifyBtn").setAttribute("aria-expanded", open); $("#modifyBtn").textContent = open ? "Close" : "Modify"; };
  $("#modifyBtn").addEventListener("click", () => toggleModify(!$("#searchForm").classList.contains("open")));
  $("#fClass").addEventListener("change", () => update(true));

  /* ---------- Price calendar ---------- */
  const week = [["2026-04-12", 945], ["2026-04-13", 892], ["2026-04-14", 1102], ["2026-04-15", 892], ["2026-04-16", 934], ["2026-04-17", 1245], ["2026-04-18", 876]];
  const tier = (p) => (p < 925 ? "cheap" : p < 1100 ? "mid" : "high");
  const weekMax = Math.max(...week.map((w) => w[1]));
  const weekMin = Math.min(...week.map((w) => w[1]));
  function renderWeek() {
    const sel = $("#fDep").value;
    $("#week").innerHTML = week.map(([d, p]) => {
      const dt = new Date(d + "T12:00:00");
      return `<button type="button" class="day ${tier(p)}${d === sel ? " sel" : ""}${p === weekMin ? " min" : ""}" data-d="${d}" aria-pressed="${d === sel}" aria-label="${dt.toDateString()}: ${money(p)}${p === weekMin ? ", cheapest" : ""}">
        <span class="bar-w"><span class="bar" style="height:${30 + ((p - 800) / (weekMax - 800)) * 70}%"></span></span>
        <span class="dp">${money(p)}</span><span class="dd">${dt.toLocaleDateString("en-US", { weekday: "short" })}<b>${dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</b></span>${p === weekMin ? '<span class="lowest">Lowest</span>' : ""}</button>`;
    }).join("");
  }
  function monthPrice(day) { const w = week.find(([d]) => Number(d.slice(-2)) === day); if (w) return w[1]; let s = day * 7919; s = (s * 16807) % 2147483647; return 860 + (s % 520); }
  function renderMonth() {
    const sel = $("#fDep").value;
    const first = new Date("2026-04-01T12:00:00").getDay();
    let cells = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => `<span class="wd">${d}</span>`).join("");
    cells += Array(first).fill('<span class="blank"></span>').join("");
    for (let d = 1; d <= 30; d++) {
      const iso = `2026-04-${String(d).padStart(2, "0")}`, p = monthPrice(d);
      cells += `<button type="button" class="mday ${tier(p)}${iso === sel ? " sel" : ""}" data-d="${iso}" aria-label="April ${d}: ${money(p)}"><b>${d}</b><span>${money(p)}</span></button>`;
    }
    $("#month").innerHTML = `<p class="mtitle">April 2026 · round-trip fares per person</p><div class="mgrid">${cells}</div>`;
  }
  function pickDate(d) {
    $("#fDep").value = d;
    const ret = new Date(d + "T12:00:00"); ret.setDate(ret.getDate() + 14);
    $("#fRet").value = ret.toISOString().slice(0, 10);
    renderWeek(); renderMonth(); syncSummary(); update();
    toast(`Departure changed to ${fmtDate(d)} — showing sample fares.`);
  }
  $("#week").addEventListener("click", (e) => { const b = e.target.closest(".day"); if (b) pickDate(b.dataset.d); });
  $("#month").addEventListener("click", (e) => { const b = e.target.closest(".mday"); if (b) pickDate(b.dataset.d); });
  $("#monthBtn").addEventListener("click", (e) => { const m = $("#month"); m.hidden = !m.hidden; e.currentTarget.setAttribute("aria-expanded", !m.hidden); e.currentTarget.textContent = m.hidden ? "Show full month view" : "Hide month view"; });
  $("#calToggle").addEventListener("click", (e) => { const b = $("#calBody"), open = b.hidden; b.hidden = !open; e.currentTarget.setAttribute("aria-expanded", open); });

  /* ---------- Booking dialog ---------- */
  const dlg = $("#bookDlg");
  let pending = null;
  function openBooking(f, fi) {
    const [name, price, items] = fares(f)[fi];
    pending = { f, name, price };
    $("#bookBody").innerHTML = `<div class="bk-air">${mono(f.al)}<div><strong>${f.al.full}</strong><span>${f.num} · ${name}</span></div></div>
      ${legHTML(f.out, "Outbound")}${legHTML(f.ret, "Return")}
      <ul class="bk-items">${items.map((i) => `<li>${icon("check")}${i}</li>`).join("")}</ul>
      <dl class="bk-sum"><div><dt>${money(price)} × ${travelers()} traveler${travelers() > 1 ? "s" : ""}</dt><dd>${money(price * travelers())}</dd></div><div><dt>Taxes &amp; fees</dt><dd>Included</dd></div><div class="tot"><dt>Total</dt><dd>${money(price * travelers())}</dd></div></dl>`;
    dlg.showModal();
  }
  $("#bookClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#bookGo").addEventListener("click", () => { dlg.close(); toast(`${pending.f.al.name} ${pending.name} held for 20 minutes — demo checkout, nothing booked.`); });

  /* ---------- Widgets ---------- */
  $("#alertForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#alertEmail").value.trim(), m = $("#alertMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.textContent = "Enter a valid email address."; m.className = "msg err"; return; }
    m.textContent = `Alert set for ${route.from} → ${route.to}. We'll email ${v} (demo).`; m.className = "msg ok";
  });
  $$("[data-route]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const [x, y] = a.dataset.route.split("|");
    const names = { JFK: "New York", EWR: "Newark", HND: "Tokyo Haneda", NRT: "Tokyo Narita", KIX: "Osaka Kansai" };
    $("#fFrom").value = `${x} - ${names[x]}`; $("#fTo").value = `${y} - ${names[y]}`;
    $("#searchForm").requestSubmit();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));

  /* ---------- Nav ---------- */
  $("#burger").addEventListener("click", (e) => { const open = $("#links").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", open); e.currentTarget.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu"); });
  $("#currency").addEventListener("change", (e) => { cur = e.target.value; renderWeek(); renderMonth(); paintRange(); update(true); });

  renderWeek(); renderMonth(); syncFilterUI(); update(); syncSummary();
})();
