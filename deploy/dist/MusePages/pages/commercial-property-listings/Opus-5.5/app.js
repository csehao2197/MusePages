(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const fmt = (n) => n.toLocaleString("en-US");
  const money = (n) => `$${fmt(Math.round(n))}`;
  const short$ = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 ? 2 : 0).replace(/\.?0+$/, "")}M` : `$${Math.round(n / 1e3)}K`);
  const store = { get(k, d) { try { const v = localStorage.getItem(`vg:${k}`); return v === null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(`vg:${k}`, JSON.stringify(v)); } catch { /* unavailable */ } } };
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };
  const mobile = () => window.matchMedia("(max-width: 680px)").matches;

  /* ---------- Data (sample inventory) ---------- */
  // [title, address, type, tx, class, sf, specs[], built, price, tags[], broker, amenities[], certs[], avail(days), flags[], x, y, listedDaysAgo, submarket]
  const raw = [
    ["Frost Tower — Suite 2400", "401 Congress Ave, Austin, TX 78701", "Office", "lease", "A", 12500, ["24th Floor", "Built 2003", "Renovated 2022"], 2003, 52, ["Full-Floor", "City Views", "Spec Suite"], "Sarah Chen", ["Parking Included", "On-Site Management", "Fiber Internet", "Conference Rooms"], ["ENERGY STAR"], 0, ["movein"], 402, 372, 2, "Downtown"],
    ["Domain NORTHSIDE — Retail Pad 8", "11600 Domain Dr, Austin, TX 78758", "Retail", "lease", "A", 3200, ["Ground Floor", "Built 2019", "Endcap"], 2019, 42, ["High Traffic", "Patio Available", "Restaurant Ready"], "Marcus Rivera", ["Parking Included", "On-Site Management"], [], 30, [], 372, 140, 4, "Domain / North"],
    ["East Austin Distribution Center", "4800 E 7th St, Austin, TX 78702", "Industrial", "sale", "B", 45000, ["24' Clear Height", "Built 2015", "4 Loading Docks"], 2015, 6750000, ["Fenced Yard", "Sprinklered", "Rail Adjacent"], "Tom Bradley", ["Loading Docks", "Parking Included"], [], 0, [], 520, 392, 6, "East Austin"],
    ["The Republic — Floors 12-13", "401 W 4th St, Austin, TX 78701", "Office", "lease", "A", 28400, ["Floors 12-13", "Built 2023", "Terrace"], 2023, 61, ["New Construction", "Terrace", "Amenity Floor"], "Sarah Chen", ["Parking Included", "Fiber Internet", "Rooftop Access", "EV Charging", "Conference Rooms"], ["LEED", "WELL Building"], 90, ["newbuild", "green"], 386, 380, 1, "Downtown"],
    ["South Congress Creative Loft", "1601 S Congress Ave, Austin, TX 78704", "Office", "sublease", "B", 4800, ["2nd Floor", "Built 1998", "Furnished"], 1998, 34, ["Furnished", "Exposed Brick", "Below Market"], "Sarah Chen", ["Fiber Internet", "Conference Rooms"], [], 0, ["sublease", "cowork", "movein"], 404, 470, 3, "South Congress"],
    ["Mueller Flex Center — Bldg C", "4600 Mueller Blvd, Austin, TX 78723", "Flex", "lease", "B", 9600, ["18' Clear", "Built 2012", "Grade Door"], 2012, 21, ["Showroom", "Grade-Level Door", "Office/Warehouse"], "Tom Bradley", ["Loading Docks", "Parking Included"], ["ENERGY STAR"], 30, [], 478, 286, 9, "Mueller"],
    ["Rainey Street Retail Corner", "70 Rainey St, Austin, TX 78701", "Retail", "lease", "A", 2400, ["Ground Floor", "Built 2017", "Corner"], 2017, 58, ["Bar/Restaurant", "Patio", "Nightlife Corridor"], "Marcus Rivera", ["On-Site Management"], [], 0, ["movein"], 430, 396, 5, "Downtown"],
    ["Round Rock Logistics Park", "2300 N A W Grimes Blvd, Round Rock, TX 78665", "Industrial", "lease", "A", 98000, ["32' Clear", "Built 2022", "36 Docks"], 2022, 9.5, ["Cross-Dock", "ESFR", "Trailer Parking"], "Tom Bradley", ["Loading Docks", "Parking Included", "EV Charging"], ["LEED"], 90, ["newbuild", "green"], 470, 46, 12, "Round Rock"],
    ["Barton Creek Plaza — Suite 300", "3800 N Capital of TX Hwy, Austin, TX 78746", "Office", "lease", "B", 6200, ["3rd Floor", "Built 2001", "Hill Views"], 2001, 38, ["Hill Country Views", "Turnkey", "Covered Parking"], "Sarah Chen", ["Parking Included", "On-Site Management", "Conference Rooms"], [], 30, ["movein"], 270, 420, 8, "Southwest"],
    ["Burnet Road Pad Site", "5400 Burnet Rd, Austin, TX 78756", "Land", "sale", "C", 38000, ["0.87 Acres", "Zoned CS-MU", "Corner"], 1990, 3900000, ["Development Site", "Corner Lot", "VMU Eligible"], "Marcus Rivera", [], [], 0, [], 352, 268, 14, "North Central"],
    ["Plaza Saltillo Mixed-Use — Ground Retail", "901 E 5th St, Austin, TX 78702", "Mixed-Use", "lease", "A", 5400, ["Ground Floor", "Built 2021", "Transit-Oriented"], 2021, 47, ["Near Rail", "Residential Above", "Patio"], "Marcus Rivera", ["Parking Included", "On-Site Management", "EV Charging"], ["LEED"], 30, ["newbuild", "green"], 456, 378, 7, "East Austin"],
    ["Riverside Tech Campus — Bldg 2", "2401 E Riverside Dr, Austin, TX 78741", "Office", "lease", "B", 41000, ["3 Floors", "Built 2009", "Renovated 2021"], 2009, 33, ["Campus", "Lab-Capable", "Large Floorplates"], "Sarah Chen", ["Parking Included", "Fiber Internet", "Conference Rooms", "EV Charging"], ["ENERGY STAR"], 90, ["cowork"], 470, 430, 10, "Riverside"],
    ["Arboretum Retail — Suite 140", "10000 Research Blvd, Austin, TX 78759", "Retail", "lease", "B", 1800, ["Ground Floor", "Built 1986", "Renovated 2018"], 1986, 31, ["Inline Suite", "Anchored Center"], "Marcus Rivera", ["Parking Included"], [], 0, ["movein"], 326, 176, 15, "Domain / North"],
    ["Hwy 290 Service Warehouse", "7300 E Ben White Blvd, Austin, TX 78741", "Industrial", "lease", "C", 15000, ["20' Clear", "Built 1984", "2 Dock-High"], 1984, 12.5, ["Fenced Yard", "Heavy Power"], "Tom Bradley", ["Loading Docks"], [], 0, ["movein"], 560, 470, 18, "Southeast"],
    ["Seaholm District Office Condo", "800 W Cesar Chavez St, Austin, TX 78701", "Office", "sale", "A", 3600, ["7th Floor", "Built 2016", "Lake Views"], 2016, 2650000, ["Owner-User", "Lake Views", "Condo"], "Sarah Chen", ["Parking Included", "Fiber Internet", "Rooftop Access"], ["LEED"], 30, ["green"], 372, 392, 11, "Downtown"],
    ["North Lamar Flex Suites", "9100 N Lamar Blvd, Austin, TX 78753", "Flex", "sublease", "C", 3200, ["Single Story", "Built 1999", "Roll-Up Door"], 1999, 16, ["Short-Term", "Below Market"], "Tom Bradley", ["Parking Included"], [], 0, ["sublease", "movein"], 414, 196, 20, "North Central"],
    ["Domain 12 — Suite 900", "3121 Palm Way, Austin, TX 78758", "Office", "lease", "A", 18700, ["9th Floor", "Built 2020", "Spec Suite"], 2020, 56, ["Spec Suite", "Amenity Center", "Walkable"], "Sarah Chen", ["Parking Included", "Fiber Internet", "Conference Rooms", "EV Charging", "On-Site Management"], ["LEED", "ENERGY STAR"], 0, ["movein", "green", "cowork"], 384, 130, 2, "Domain / North"],
    ["Montopolis Industrial Land", "6400 Montopolis Dr, Austin, TX 78744", "Land", "sale", "C", 217800, ["5 Acres", "Zoned LI", "Utilities to Site"], 1990, 8200000, ["Industrial Zoning", "Truck Access"], "Tom Bradley", [], [], 0, [], 540, 500, 25, "Southeast"],
  ];
  const listings = raw.map((r, i) => ({ id: i, title: r[0], addr: r[1], type: r[2], tx: r[3], cls: r[4], sf: r[5], specs: r[6], built: r[7], price: r[8], tags: r[9], broker: r[10], amen: r[11], certs: r[12], avail: r[13], flags: r[14], x: r[15], y: r[16], age: r[17], sub: r[18] }));
  const isSale = (l) => l.tx === "sale";
  const monthly = (l) => (isSale(l) ? 0 : (l.price * l.sf) / 12);
  const comparable = (l) => (isSale(l) ? l.price : l.price * l.sf); // sale price vs annual rent, for sort

  /* ---------- State ---------- */
  const S = { q: "Austin, TX", sub: null, types: new Set(), tx: "", chips: new Set(), lease: [15, 85], sale: [500000, 50000000], size: [500, 100000], cls: new Set(), years: new Set(), amen: new Set(), certs: new Set(), avail: null, area: null, sort: "new", view: "grid", page: 1, priceMode: "lease" };
  const saved = new Set(store.get("saved", []));
  const PER = 9;

  /* ---------- Filter sidebar ---------- */
  const groups = [
    ["type", "Property Type", () => ["Office", "Retail", "Industrial", "Flex", "Land", "Mixed-Use"].map((t) => chk("types", t, t, listings.filter((l) => l.type === t).length)).join("")],
    ["price", "Price Range", () => `<div class="seg-mini" role="group" aria-label="Price type"><button type="button" data-pmode="lease" aria-pressed="true">For Lease</button><button type="button" data-pmode="sale" aria-pressed="false">For Sale</button></div><div data-price-ui></div>`],
    ["size", "Size (SF)", () => dual("size", 500, 100000, 500, (v) => (v >= 100000 ? "100,000+" : fmt(v)))],
    ["cls", "Building Class", () => ["A", "B", "C"].map((c) => chk("cls", c, `Class ${c}`, listings.filter((l) => l.cls === c).length)).join("")],
    ["year", "Year Built", () => [["pre2000", "Before 2000"], ["2000", "2000-2010"], ["2010", "2010-2020"], ["2020", "2020+"]].map(([v, l]) => chk("years", v, l, listings.filter((x) => yearBucket(x.built) === v).length)).join("")],
    ["amen", "Amenities", () => ["Parking Included", "On-Site Management", "Fiber Internet", "Loading Docks", "Conference Rooms", "Rooftop Access", "EV Charging"].map((a) => chk("amen", a, a, listings.filter((l) => l.amen.includes(a)).length)).join("")],
    ["cert", "Certifications", () => ["LEED", "ENERGY STAR", "WELL Building"].map((c) => chk("certs", c, c, listings.filter((l) => l.certs.includes(c)).length)).join("")],
    ["avail", "Availability", () => [[0, "Available Now"], [30, "Within 30 Days"], [90, "Within 90 Days"]].map(([v, l]) => `<label class="chk"><input type="radio" name="avail" value="${v}"> ${l}<small>${listings.filter((x) => x.avail <= v).length}</small></label>`).join("") + `<label class="chk"><input type="radio" name="avail" value="" checked> Any time</label>`],
  ];
  function chk(set, v, label, n) { return `<label class="chk"><input type="checkbox" data-set="${set}" value="${v}"> ${label}<small>${n}</small></label>`; }
  function dual(key, min, max, step, show) {
    return `<div class="range" data-range="${key}" data-min="${min}" data-max="${max}"><span class="track"></span><span class="fill"></span><input type="range" min="${min}" max="${max}" step="${step}" value="${min}" aria-label="Minimum ${key}"><input type="range" min="${min}" max="${max}" step="${step}" value="${max}" aria-label="Maximum ${key}"></div>
      <div class="mm"><input inputmode="numeric" data-mm="${key}-lo" aria-label="Minimum ${key}"><span>to</span><input inputmode="numeric" data-mm="${key}-hi" aria-label="Maximum ${key}"></div>`;
  }
  const yearBucket = (y) => (y < 2000 ? "pre2000" : y < 2010 ? "2000" : y < 2020 ? "2010" : "2020");
  $("[data-fgroups]").innerHTML = groups.map(([id, title, body]) => `<div class="fg"><button type="button" aria-expanded="${["type", "price", "size", "cls"].includes(id)}" aria-controls="fg-${id}">${title}${icon("down")}</button><div class="fg-body" id="fg-${id}" ${["type", "price", "size", "cls"].includes(id) ? "" : "hidden"}>${body()}</div></div>`).join("");
  $$(".fg > button").forEach((b) => b.addEventListener("click", () => { const open = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(open)); $(`#${b.getAttribute("aria-controls")}`).hidden = !open; }));
  const ranges = {
    lease: { min: 15, max: 85, step: 1, show: (v) => `$${v}` },
    sale: { min: 500000, max: 50000000, step: 250000, show: (v) => short$(v) },
    size: { min: 500, max: 100000, step: 500, show: (v) => (v >= 100000 ? "100,000+" : fmt(v)) },
  };
  function renderPriceUI() {
    const k = S.priceMode;
    $("[data-price-ui]").innerHTML = dual(k, ranges[k].min, ranges[k].max, ranges[k].step) + `<p class="mm" style="display:block;margin-top:4px">${k === "lease" ? "$/SF/year" : "Sale price"}</p>`;
    $$("[data-pmode]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.pmode === k)));
    wireRange(k);
  }
  function wireRange(key) {
    const box = $(`[data-range="${key}"]`), [lo, hi] = $$("input", box), cfg = ranges[key];
    const loI = $(`[data-mm="${key}-lo"]`), hiI = $(`[data-mm="${key}-hi"]`);
    lo.step = hi.step = cfg.step; lo.value = S[key][0]; hi.value = S[key][1];
    const paint = () => {
      const a = +lo.value, b = +hi.value, span = cfg.max - cfg.min;
      $(".fill", box).style.left = `${((a - cfg.min) / span) * 100}%`;
      $(".fill", box).style.right = `${100 - ((b - cfg.min) / span) * 100}%`;
      loI.value = cfg.show(a); hiI.value = cfg.show(b);
    };
    const commit = () => { let a = +lo.value, b = +hi.value; if (a > b - cfg.step) { if (document.activeElement === lo) a = b - cfg.step; else b = a + cfg.step; } lo.value = a; hi.value = b; S[key] = [a, b]; paint(); S.page = 1; render(); };
    lo.addEventListener("input", commit); hi.addEventListener("input", commit);
    const parse = (s) => { const t = s.replace(/[^0-9.kKmM]/g, ""); const n = parseFloat(t); if (Number.isNaN(n)) return null; return /m/i.test(t) ? n * 1e6 : /k/i.test(t) ? n * 1e3 : n; };
    [[loI, 0], [hiI, 1]].forEach(([inp, idx]) => inp.addEventListener("change", () => {
      const v = parse(inp.value); if (v === null) { paint(); return; }
      const arr = [...S[key]]; arr[idx] = Math.min(cfg.max, Math.max(cfg.min, v));
      if (arr[0] > arr[1]) arr.reverse();
      S[key] = arr; lo.value = arr[0]; hi.value = arr[1]; paint(); S.page = 1; render();
    }));
    paint();
  }
  renderPriceUI(); wireRange("size");
  $$("[data-pmode]").forEach((b) => b.addEventListener("click", () => { S.priceMode = b.dataset.pmode; renderPriceUI(); }));
  $("[data-filters]").addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.set) { const set = S[t.dataset.set]; t.checked ? set.add(t.value) : set.delete(t.value); if (t.dataset.set === "types") $("[data-type]").value = S.types.size === 1 ? [...S.types][0] : ""; }
    else if (t.name === "avail") S.avail = t.value === "" ? null : +t.value;
    else return;
    S.page = 1; render();
  });

  /* ---------- Search bar + autocomplete ---------- */
  const places = [["Austin, TX", "All submarkets", null], ["Downtown Austin", "78701", "Downtown"], ["Domain / North Austin", "78758", "Domain / North"], ["East Austin", "78702", "East Austin"], ["South Congress", "78704", "South Congress"], ["Mueller", "78723", "Mueller"], ["Riverside", "78741", "Riverside"], ["North Central Austin", "78756", "North Central"], ["Round Rock", "78665", "Round Rock"], ["Southwest Austin", "78746", "Southwest"], ["Southeast Austin", "78744", "Southeast"]];
  const qIn = $("[data-q]"), ac = $("[data-ac]");
  let acIdx = -1, acRows = [];
  function showAc() {
    const q = qIn.value.trim().toLowerCase();
    acRows = places.filter(([n, z]) => !q || n.toLowerCase().includes(q) || z.startsWith(q) || q.includes(n.toLowerCase().split(",")[0]));
    acIdx = -1;
    ac.innerHTML = acRows.map(([n, z], i) => `<li role="option" id="ac-${i}" aria-selected="false" data-ac-i="${i}">${n}<small>${z}</small></li>`).join("");
    ac.hidden = !acRows.length || document.activeElement !== qIn;
    qIn.setAttribute("aria-expanded", String(!ac.hidden));
  }
  function pickPlace(p) { qIn.value = p[0] === "Austin, TX" ? "Austin, TX" : `${p[0]}, Austin, TX`; S.sub = p[2]; ac.hidden = true; qIn.setAttribute("aria-expanded", "false"); }
  qIn.addEventListener("input", showAc); qIn.addEventListener("focus", showAc);
  qIn.addEventListener("blur", () => setTimeout(() => { ac.hidden = true; qIn.setAttribute("aria-expanded", "false"); }, 150));
  qIn.addEventListener("keydown", (e) => {
    if (ac.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); acIdx = (acIdx + (e.key === "ArrowDown" ? 1 : -1) + acRows.length) % acRows.length; $$("li", ac).forEach((li, i) => li.setAttribute("aria-selected", String(i === acIdx))); qIn.setAttribute("aria-activedescendant", `ac-${acIdx}`); }
    else if (e.key === "Enter" && acIdx >= 0) { e.preventDefault(); pickPlace(acRows[acIdx]); }
    else if (e.key === "Escape") { ac.hidden = true; }
  });
  ac.addEventListener("mousedown", (e) => { const li = e.target.closest("[data-ac-i]"); if (li) { e.preventDefault(); pickPlace(acRows[+li.dataset.acI]); } });
  $("[data-search]").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = qIn.value.trim().toLowerCase();
    // Match specific submarkets (name or ZIP) before falling back to the whole city.
    const hit = places.slice(1).find(([n, z]) => q.includes(n.toLowerCase()) || q.includes(z));
    S.sub = hit ? hit[2] : !q || q.includes("austin") ? null : "__none";
    const t = $("[data-type]").value; S.types = new Set(t ? [t] : []); $$('[data-set="types"]').forEach((c) => { c.checked = S.types.has(c.value); });
    S.tx = $("[data-tx]").value; S.page = 1; render();
    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
  });
  $$("[data-chip]").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.chip; S.chips.has(k) ? S.chips.delete(k) : S.chips.add(k); b.setAttribute("aria-pressed", String(S.chips.has(k))); S.page = 1; render(); }));

  /* ---------- Filtering ---------- */
  function inPoly(x, y, poly) { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; }
  function filtered() {
    let out = listings.filter((l) => {
      if (S.sub === "__none") return false;
      if (S.sub && l.sub !== S.sub) return false;
      if (S.types.size && !S.types.has(l.type)) return false;
      if (S.tx && l.tx !== S.tx) return false;
      for (const c of S.chips) if (!l.flags.includes(c)) return false;
      // Slider ends mean "no limit", so untouched defaults never hide listings outside the visible range.
      if (isSale(l)) { if ((S.sale[0] > 500000 && l.price < S.sale[0]) || (S.sale[1] < 50000000 && l.price > S.sale[1])) return false; }
      else if ((S.lease[0] > 15 && l.price < S.lease[0]) || (S.lease[1] < 85 && l.price > S.lease[1])) return false;
      if ((S.size[0] > 500 && l.sf < S.size[0]) || (S.size[1] < 100000 && l.sf > S.size[1])) return false;
      if (S.cls.size && !S.cls.has(l.cls)) return false;
      if (S.years.size && !S.years.has(yearBucket(l.built))) return false;
      for (const a of S.amen) if (!l.amen.includes(a)) return false;
      if (S.certs.size && !l.certs.some((c) => S.certs.has(c))) return false;
      if (S.avail !== null && l.avail > S.avail) return false;
      if (S.area && !(S.area.poly ? inPoly(l.x, l.y, S.area.poly) : l.x >= S.area.x && l.x <= S.area.x + S.area.w && l.y >= S.area.y && l.y <= S.area.y + S.area.h)) return false;
      return true;
    });
    const by = { new: (a, b) => a.age - b.age, plh: (a, b) => comparable(a) - comparable(b), phl: (a, b) => comparable(b) - comparable(a), ssl: (a, b) => a.sf - b.sf, sls: (a, b) => b.sf - a.sf }[S.sort];
    return out.sort(by);
  }
  function activeChips() {
    const chips = [];
    if (S.sub && S.sub !== "__none") chips.push(["Submarket: " + S.sub, () => { S.sub = null; qIn.value = "Austin, TX"; }]);
    if (S.tx) chips.push([{ lease: "For Lease", sale: "For Sale", sublease: "For Sublease" }[S.tx], () => { S.tx = ""; $("[data-tx]").value = ""; }]);
    S.types.forEach((t) => chips.push([t, () => { S.types.delete(t); $(`[data-set="types"][value="${t}"]`).checked = false; $("[data-type]").value = ""; }]));
    S.chips.forEach((c) => chips.push([$(`[data-chip="${c}"]`).textContent, () => { S.chips.delete(c); $(`[data-chip="${c}"]`).setAttribute("aria-pressed", "false"); }]));
    if (S.lease[0] > 15 || S.lease[1] < 85) chips.push([`Lease $${S.lease[0]}–$${S.lease[1]}/SF`, () => { S.lease = [15, 85]; if (S.priceMode === "lease") renderPriceUI(); }]);
    if (S.sale[0] > 500000 || S.sale[1] < 50000000) chips.push([`Sale ${short$(S.sale[0])}–${short$(S.sale[1])}`, () => { S.sale = [500000, 50000000]; if (S.priceMode === "sale") renderPriceUI(); }]);
    if (S.size[0] > 500 || S.size[1] < 100000) chips.push([`${fmt(S.size[0])}–${S.size[1] >= 100000 ? "100,000+" : fmt(S.size[1])} SF`, () => { S.size = [500, 100000]; wireRange("size"); }]);
    [["cls", "Class "], ["years", ""], ["amen", ""], ["certs", ""]].forEach(([k, p]) => S[k].forEach((v) => chips.push([p + (k === "years" ? { pre2000: "Before 2000", 2000: "2000-2010", 2010: "2010-2020", 2020: "2020+" }[v] : v), () => { S[k].delete(v); const el = $(`[data-set="${k}"][value="${v}"]`); if (el) el.checked = false; }])));
    if (S.avail !== null) chips.push([{ 0: "Available Now", 30: "Within 30 Days", 90: "Within 90 Days" }[S.avail], () => { S.avail = null; $('input[name="avail"][value=""]').checked = true; }]);
    if (S.area) chips.push([S.area.poly ? "Drawn area" : "Map area", () => { S.area = null; }]);
    return chips;
  }

  /* ---------- Rendering ---------- */
  const typeColor = { Office: "#2563EB", Retail: "#059669", Industrial: "#EA580C", Flex: "#94A3B8", Land: "#94A3B8", "Mixed-Use": "#94A3B8" };
  const typeKey = { Office: "office", Retail: "retail", Industrial: "industrial", Flex: "flex", Land: "land", "Mixed-Use": "mixed" };
  const priceHtml = (l) => isSale(l) ? `<b>${money(l.price)}</b><small>${money(l.price / l.sf)}/SF</small>` : `<b>$${l.price.toFixed(2)} /SF/year${l.type === "Retail" ? " NNN" : ""}</b><small>${money(monthly(l))}/month</small>`;
  const txLabel = { lease: "FOR LEASE", sale: "FOR SALE", sublease: "SUBLEASE" };
  const kindLabel = (l) => (l.type === "Office" ? `CLASS ${l.cls}` : l.type.toUpperCase());
  function card(l) {
    const photos = [0, 1, 2].map((v) => `<div>${Art.photo(typeKey[l.type], l.id + 1, v, `${l.title} — ${["exterior", "interior", "aerial"][v]}`)}</div>`).join("");
    return `<article class="card" data-card="${l.id}">
      <div class="ph"><div class="ph-track" data-track>${photos}</div><button class="ph-nav p" type="button" data-ph="-1" aria-label="Previous photo">${icon("left")}</button><button class="ph-nav n" type="button" data-ph="1" aria-label="Next photo">${icon("right")}</button>
        <div class="ph-dots" aria-hidden="true"><i class="on"></i><i></i><i></i></div><div class="badges"><span class="bdg ${l.tx}">${txLabel[l.tx]}</span><span class="bdg kind">${kindLabel(l)}</span></div></div>
      <div class="cb"><h3><button type="button" data-detail="${l.id}">${l.title}</button></h3><p class="addr">${l.addr}</p>
        <p class="specs"><span>${icon("ruler")}${fmt(l.sf)} SF</span>${l.specs.map((s) => `<span>${s}</span>`).join("")}</p>
        <p class="price">${priceHtml(l)}</p><p class="tags">${l.tags.map((t) => `<span>${t}</span>`).join("")}</p><p class="brk">Listed by ${l.broker}, Vanguard Commercial</p></div>
      <div class="cf"><button type="button" data-save-l="${l.id}" aria-pressed="${saved.has(l.id)}" aria-label="Save ${l.title}">${icon("heart")}Save</button><button type="button" data-tour="${l.id}">${icon("calendar")}Tour</button><button class="details" type="button" data-detail="${l.id}">Details ${icon("arrow")}</button></div></article>`;
  }
  const featured = { title: "The Austin Tech Center — Full Building", sf: 185000 };
  function featuredHtml() {
    return `<aside class="featured" aria-label="Featured listing"><div class="feat-img">${Art.photo("mixed", 40, 0, "The Austin Tech Center exterior")}</div><div class="feat-body"><p class="feat-k">Featured Listing</p><h3>The Austin Tech Center — Full Building</h3>
      <p class="feat-facts"><span>185,000 SF</span><span>Class A</span><span>LEED Platinum</span><span>Built 2021</span></p>
      <p class="feat-price"><b>$58.00/SF/year</b> — Divisible to 15,000 SF</p>
      <p>Flagship campus opportunity in East Austin's booming tech corridor. Features 10,000 SF rooftop amenity deck, 500-space parking garage, and campus-grade fiber connectivity.</p>
      <button class="btn btn-blue" type="button" data-tour="featured">Schedule a Tour</button></div></aside>`;
  }
  function render() {
    const list = filtered(), pages = Math.max(1, Math.ceil(list.length / PER));
    S.page = Math.min(S.page, pages);
    const where = S.sub && S.sub !== "__none" ? `${S.sub}, Austin, TX` : S.sub === "__none" ? qIn.value : "Austin, TX";
    $("[data-count]").innerHTML = `<b>${list.length}</b> ${list.length === 1 ? "property" : "properties"} found in ${where}`;
    $("[data-apply-count]").textContent = list.length;
    const chips = activeChips();
    $("[data-active]").innerHTML = chips.map(([l], i) => `<li><button type="button" data-rm="${i}" aria-label="Remove filter ${l}">${l}${icon("x")}</button></li>`).join("");
    $$("[data-rm]").forEach((b) => b.addEventListener("click", () => { chips[+b.dataset.rm][1](); S.page = 1; render(); }));
    const n = chips.filter(([l]) => !/^Submarket/.test(l)).length;
    [$("[data-fbadge]"), $("[data-fbadge2]")].forEach((b) => { b.hidden = !n; b.textContent = n; });
    const pageItems = list.slice((S.page - 1) * PER, S.page * PER);
    const cardsEl = $("[data-cards]");
    cardsEl.className = `cards ${S.view === "list" ? "list" : "grid"}`;
    if (!list.length) cardsEl.innerHTML = `<div class="empty"><h3>No properties match these filters</h3><p>${S.sub === "__none" ? "This preview covers the Austin market only — try “Austin, TX”." : "Try widening the price or size range, or clear a few filters."}</p><button class="btn btn-ghost" type="button" data-clear>Clear All Filters</button></div>`;
    else cardsEl.innerHTML = pageItems.map((l, i) => card(l) + (S.page === 1 && i === 5 ? featuredHtml() : "")).join("") + (S.page === 1 && pageItems.length <= 5 ? featuredHtml() : "");
    wireCards(cardsEl);
    const from = list.length ? (S.page - 1) * PER + 1 : 0, to = Math.min(S.page * PER, list.length);
    $("[data-pager]").innerHTML = S.view === "map" ? "" : `<p>Showing ${from}-${to} of ${list.length}</p><ul><li><button type="button" data-pg="${S.page - 1}" ${S.page === 1 ? "disabled" : ""} aria-label="Previous page">${icon("left")}</button></li>${Array.from({ length: pages }, (_, i) => `<li><button type="button" data-pg="${i + 1}" ${i + 1 === S.page ? 'aria-current="page"' : ""}>${i + 1}</button></li>`).join("")}<li><button type="button" data-pg="${S.page + 1}" ${S.page === pages ? "disabled" : ""} aria-label="Next page">${icon("right")}</button></li></ul>`;
    $$("[data-pg]").forEach((b) => b.addEventListener("click", () => { S.page = +b.dataset.pg; render(); $("#results").scrollIntoView({ behavior: "smooth" }); }));
    $("[data-maplist]").innerHTML = list.map((l) => `<button class="mini" type="button" data-mini="${l.id}"><span class="mph">${Art.photo(typeKey[l.type], l.id + 1, 0, l.title)}</span><span><b>${l.title}</b><span>${l.addr.split(",")[0]} · ${fmt(l.sf)} SF</span><em>${isSale(l) ? money(l.price) : `$${l.price.toFixed(2)}/SF/yr`}</em></span></button>`).join("") || `<p class="empty">No properties in view.</p>`;
    $$("[data-mini]").forEach((m) => { m.addEventListener("mouseenter", () => hlPin(+m.dataset.mini, true)); m.addEventListener("mouseleave", () => hlPin(+m.dataset.mini, false)); m.addEventListener("click", () => openDetail(+m.dataset.mini)); });
    drawMap(list);
    window.MuseVG = { visible: () => list.map((l) => l.title), page: () => S.page };
  }
  function wireCards(root) {
    $$("[data-track]", root).forEach((t) => {
      const dots = $$(".ph-dots i", t.parentElement);
      t.addEventListener("scroll", () => { const i = Math.round(t.scrollLeft / t.clientWidth); dots.forEach((d, j) => d.classList.toggle("on", i === j)); }, { passive: true });
    });
    $$("[data-ph]", root).forEach((b) => b.addEventListener("click", () => { const t = $("[data-track]", b.parentElement); const n = Math.round(t.scrollLeft / t.clientWidth) + +b.dataset.ph; t.scrollTo({ left: ((n + 3) % 3) * t.clientWidth, behavior: "smooth" }); }));
    $$("[data-save-l]", root).forEach((b) => b.addEventListener("click", () => { const id = +b.dataset.saveL; saved.has(id) ? saved.delete(id) : saved.add(id); store.set("saved", [...saved]); b.setAttribute("aria-pressed", String(saved.has(id))); toast(saved.has(id) ? "Saved to your properties" : "Removed from saved"); }));
    $$("[data-card]", root).forEach((c) => { c.addEventListener("mouseenter", () => hlPin(+c.dataset.card, true)); c.addEventListener("mouseleave", () => hlPin(+c.dataset.card, false)); });
  }
  document.addEventListener("click", (e) => {
    const d = e.target.closest("[data-detail]"); if (d) openDetail(+d.dataset.detail);
    const t = e.target.closest("[data-tour]"); if (t) openTour(t.dataset.tour);
    if (e.target.closest("[data-clear]")) clearAll();
  });
  function clearAll() {
    Object.assign(S, { sub: null, tx: "", lease: [15, 85], sale: [500000, 50000000], size: [500, 100000], avail: null, area: null, page: 1 });
    ["types", "chips", "cls", "years", "amen", "certs"].forEach((k) => S[k].clear());
    $$("[data-filters] input[type=checkbox]").forEach((c) => { c.checked = false; }); $('input[name="avail"][value=""]').checked = true;
    $$("[data-chip]").forEach((b) => b.setAttribute("aria-pressed", "false")); $("[data-type]").value = ""; $("[data-tx]").value = ""; qIn.value = "Austin, TX";
    renderPriceUI(); wireRange("size"); render();
  }

  /* ---------- Views ---------- */
  $("[data-sort]").addEventListener("change", (e) => { S.sort = e.target.value; S.page = 1; render(); });
  function setView(v) {
    S.view = v;
    $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === v)));
    $("[data-cards]").hidden = v === "map"; $("[data-mapview]").hidden = v !== "map";
    $("[data-mbar-map] span").textContent = v === "map" ? "List" : "Map";
    render();
  }
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  $("[data-mbar-map]").addEventListener("click", () => setView(S.view === "map" ? "grid" : "map"));

  /* ---------- Map ---------- */
  const map = $("[data-map]"), box = $("[data-mapbox]"), tip = $("[data-tip]"), pc = $("[data-pincard]");
  const VW = 800, VH = 640;
  let vb = { x: 0, y: 0, w: VW, h: VH }, sat = false, drawPts = null;
  const base = () => sat
    ? `<rect width="${VW}" height="${VH}" fill="#4B5D3A"/>${Array.from({ length: 60 }, (_, i) => `<rect x="${(i * 97) % 780}" y="${(i * 53) % 620}" width="${20 + (i % 5) * 8}" height="${16 + (i % 4) * 6}" fill="${["#5E6F48", "#6B5E4A", "#3F4F33", "#7A7466"][i % 4]}" opacity=".8"/>`).join("")}<path d="M0 410 C 160 380 280 420 400 395 S 640 360 800 400" stroke="#2C4A5A" stroke-width="26" fill="none"/>`
    : `<rect width="${VW}" height="${VH}" fill="#EEF2EC"/>${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 48} H${VW}" stroke="#fff" stroke-width="4"/>`).join("")}${Array.from({ length: 18 }, (_, i) => `<path d="M${i * 48} 0 V${VH}" stroke="#fff" stroke-width="4"/>`).join("")}
       <path d="M200 420 C 260 380 300 360 380 360 L 420 340 L 500 300 L 620 200" fill="none" stroke="#DCEBD3" stroke-width="40"/><path d="M0 410 C 160 380 280 420 400 395 S 640 360 800 400" stroke="#A5CBE0" stroke-width="22" fill="none"/>`;
  const roads = () => `<path d="M440 0 L 450 200 L 445 400 L 470 640" stroke="${sat ? "#C9C2A8" : "#F8D57E"}" stroke-width="10" fill="none"/><path d="M320 0 L 330 300 L 300 640" stroke="${sat ? "#C9C2A8" : "#F8D57E"}" stroke-width="8" fill="none"/><path d="M0 470 H800" stroke="${sat ? "#C9C2A8" : "#FCE6B0"}" stroke-width="8"/>
    <g font-family="Inter, sans-serif" font-size="12" font-weight="700" fill="${sat ? "#F1F5F9" : "#64748B"}"><text x="452" y="60">I-35</text><text x="286" y="60">MoPac</text><text x="20" y="400">Lady Bird Lake</text><text x="610" y="465">US-290</text>
    <text x="360" y="345">DOWNTOWN</text><text x="330" y="112">THE DOMAIN</text><text x="500" y="355">EAST AUSTIN</text><text x="380" y="505">SOUTH CONGRESS</text><text x="490" y="270">MUELLER</text><text x="440" y="30">ROUND ROCK ↑</text></g>`;
  let lastList = [];
  function zoom() { return VW / vb.w; }
  function drawMap(list = lastList) {
    lastList = list;
    map.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    const z = zoom(), rad = 42 / z;
    const groupsC = [];
    list.forEach((l) => { const g = groupsC.find((c) => Math.hypot(c.x - l.x, c.y - l.y) < rad); if (g && z < 2.2) { g.items.push(l); g.x = (g.x * (g.items.length - 1) + l.x) / g.items.length; g.y = (g.y * (g.items.length - 1) + l.y) / g.items.length; } else groupsC.push({ x: l.x, y: l.y, items: [l] }); });
    const s = 1 / z;
    map.innerHTML = base() + roads() + groupsC.map((g) => g.items.length > 1
      ? `<g class="cluster" data-cluster="${g.x},${g.y}" transform="translate(${g.x} ${g.y}) scale(${s})" tabindex="0" role="button" aria-label="${g.items.length} properties — zoom in"><circle r="20"/><text text-anchor="middle" y="5">${g.items.length}</text></g>`
      : `<g class="pin" data-pin="${g.items[0].id}" transform="translate(${g.x} ${g.y}) scale(${s})" tabindex="0" role="button" aria-label="${g.items[0].title}"><circle class="dot" r="10" fill="${typeColor[g.items[0].type]}"/></g>`).join("")
      + (drawPts && drawPts.length ? `<polyline points="${drawPts.map((p) => p.join(",")).join(" ")}${drawPts.length > 2 ? ` ${drawPts[0].join(",")}` : ""}" fill="rgba(37,99,235,.15)" stroke="#2563EB" stroke-width="${2 / z}" stroke-dasharray="${6 / z} ${4 / z}"/>${drawPts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${5 / z}" fill="#2563EB"/>`).join("")}` : "")
      + (S.area && S.area.poly ? `<polygon points="${S.area.poly.map((p) => p.join(",")).join(" ")}" fill="rgba(37,99,235,.08)" stroke="#2563EB" stroke-width="${2 / z}"/>` : "");
  }
  function hlPin(id, on) { const p = $(`[data-pin="${id}"]`, map); if (p) p.classList.toggle("hl", on); const c = $(`[data-card="${id}"]`); if (c) c.classList.toggle("hl", on); const m = $(`[data-mini="${id}"]`); if (m) m.classList.toggle("hl", on); }
  const upp = (r) => Math.min(vb.w / r.width, vb.h / r.height); // map units per CSS pixel (slice)
  const toLocal = (e) => { const r = map.getBoundingClientRect(); const sc = upp(r); const ox = (r.width * sc - vb.w) / 2, oy = (r.height * sc - vb.h) / 2; return [vb.x + (e.clientX - r.left) * sc - ox, vb.y + (e.clientY - r.top) * sc - oy]; };
  map.addEventListener("pointermove", (e) => {
    const p = e.target.closest("[data-pin]");
    if (p && !drag) { const l = listings[+p.dataset.pin]; const r = box.getBoundingClientRect(); tip.innerHTML = `<b>${l.title}</b>${isSale(l) ? money(l.price) : `$${l.price.toFixed(2)}/SF/yr`} · ${fmt(l.sf)} SF`; tip.style.left = `${e.clientX - r.left}px`; tip.style.top = `${e.clientY - r.top}px`; tip.hidden = false; hlPin(l.id, true); }
    else { tip.hidden = true; $$(".pin.hl", map).forEach((x) => hlPin(+x.dataset.pin, false)); }
  });
  map.addEventListener("pointerleave", () => { tip.hidden = true; });
  function openPin(id) {
    const l = listings[id];
    pc.innerHTML = `<div class="pc-img">${Art.photo(typeKey[l.type], l.id + 1, 0, l.title)}</div><div class="pc-body"><b>${l.title}</b><span>${l.addr}</span><span>${fmt(l.sf)} SF · ${isSale(l) ? money(l.price) : `$${l.price.toFixed(2)}/SF/yr`}</span><button class="link" type="button" data-detail="${l.id}">View details →</button></div><button class="pc-x" type="button" aria-label="Close" data-pc-x>${icon("x")}</button>`;
    pc.hidden = false; $("[data-pc-x]").addEventListener("click", () => { pc.hidden = true; });
    const m = $(`[data-mini="${id}"]`); if (m) m.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function zoomTo(cx, cy, factor) {
    const nw = Math.min(VW, Math.max(VW / 4, vb.w / factor)), nh = nw * (VH / VW);
    vb = { x: Math.min(VW - nw, Math.max(0, cx - nw / 2)), y: Math.min(VH - nh, Math.max(0, cy - nh / 2)), w: nw, h: nh };
    drawMap(); $("[data-search-area]").hidden = vb.w >= VW;
  }
  let drag = null, moved = false;
  map.addEventListener("pointerdown", (e) => { if (drawPts) return; drag = { x: e.clientX, y: e.clientY, vb: { ...vb } }; moved = false; });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const r = map.getBoundingClientRect(), sc = upp(r);
    const dx = (e.clientX - drag.x) * sc, dy = (e.clientY - drag.y) * sc;
    if (Math.abs(dx) + Math.abs(dy) > 4) { moved = true; map.classList.add("dragging"); }
    if (!moved) return;
    vb.x = Math.min(VW - vb.w, Math.max(0, drag.vb.x - dx)); vb.y = Math.min(VH - vb.h, Math.max(0, drag.vb.y - dy));
    map.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  });
  window.addEventListener("pointerup", () => { if (drag && moved) { $("[data-search-area]").hidden = false; } drag = null; map.classList.remove("dragging"); });
  map.addEventListener("click", (e) => {
    if (moved) { moved = false; return; }
    if (drawPts) { drawPts.push(toLocal(e).map((v) => Math.round(v))); drawMap(); return; }
    const p = e.target.closest("[data-pin]"); if (p) { openPin(+p.dataset.pin); return; }
    const c = e.target.closest("[data-cluster]"); if (c) { const [x, y] = c.dataset.cluster.split(",").map(Number); zoomTo(x, y, 2.4); }
  });
  map.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const p = e.target.closest("[data-pin]"), c = e.target.closest("[data-cluster]");
    if (p) { e.preventDefault(); openPin(+p.dataset.pin); } else if (c) { e.preventDefault(); const [x, y] = c.dataset.cluster.split(",").map(Number); zoomTo(x, y, 2.4); }
  });
  $$("[data-zoom]").forEach((b) => b.addEventListener("click", () => zoomTo(vb.x + vb.w / 2, vb.y + vb.h / 2, +b.dataset.zoom > 0 ? 1.6 : 1 / 1.6)));
  $("[data-sat]").addEventListener("click", (e) => { sat = !sat; e.currentTarget.setAttribute("aria-pressed", String(sat)); drawMap(); });
  $("[data-full]").addEventListener("click", () => { box.classList.toggle("full"); document.body.style.overflow = box.classList.contains("full") ? "hidden" : ""; });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("full")) { box.classList.remove("full"); document.body.style.overflow = ""; } });
  $("[data-search-area]").addEventListener("click", () => { S.area = { ...vb }; S.page = 1; $("[data-search-area]").hidden = true; render(); toast("Showing properties in this map area"); });
  const drawBtn = $("[data-draw]");
  drawBtn.addEventListener("click", () => {
    if (S.view !== "map") setView("map");
    drawPts = []; drawBtn.setAttribute("aria-pressed", "true"); map.classList.add("drawing"); $("[data-draw-hint]").hidden = false; pc.hidden = true; drawMap();
  });
  const endDraw = () => { drawPts = null; drawBtn.setAttribute("aria-pressed", "false"); map.classList.remove("drawing"); $("[data-draw-hint]").hidden = true; };
  $("[data-draw-done]").addEventListener("click", () => { if (!drawPts || drawPts.length < 3) { toast("Add at least three points to draw an area"); return; } S.area = { poly: drawPts }; endDraw(); S.page = 1; render(); toast("Showing properties inside your drawn area"); });
  $("[data-draw-cancel]").addEventListener("click", () => { endDraw(); drawMap(); });

  /* ---------- Filters drawer (mobile/tablet) ---------- */
  const fl = $("[data-filters]"), scrim = $("[data-scrim]");
  const setFilters = (open) => { fl.classList.toggle("open", open); scrim.hidden = !open; document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-filters-close]").focus(); };
  $$("[data-filters-open]").forEach((b) => b.addEventListener("click", () => setFilters(true)));
  $$("[data-filters-close]").forEach((b) => b.addEventListener("click", () => setFilters(false)));
  scrim.addEventListener("click", () => setFilters(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && fl.classList.contains("open")) setFilters(false); });

  /* ---------- Nav ---------- */
  const burger = $("[data-burger]"), mnav = $("#mnav");
  burger.addEventListener("click", () => { const o = mnav.hidden; mnav.hidden = !o; burger.setAttribute("aria-expanded", String(o)); $("use", burger).setAttribute("href", o ? "#i-x" : "#i-menu"); });
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); $("use", burger).setAttribute("href", "#i-menu"); }));
  $$("[data-ftype]").forEach((a) => a.addEventListener("click", () => { clearAll(); if (a.dataset.ftype) { S.types.add(a.dataset.ftype); $(`[data-set="types"][value="${a.dataset.ftype}"]`).checked = true; $("[data-type]").value = a.dataset.ftype; render(); } }));

  /* ---------- Modals ---------- */
  const modal = (n) => $(`[data-modal="${n}"]`);
  const resetM = (m) => { const f = $("form", m); if (!f) return; f.reset(); f.hidden = false; $(".done", m).hidden = true; $("[data-err]", m).textContent = ""; $$("[aria-invalid]", f).forEach((x) => x.removeAttribute("aria-invalid")); };
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  let tourTarget = "";
  function openTour(id) {
    const m = modal("tour"); resetM(m);
    const l = id === "featured" ? featured : listings[+id];
    tourTarget = l.title;
    $("[data-tour-prop]").innerHTML = `<b>${l.title}</b>${l.addr ? ` · ${l.addr}` : " · East Austin"}`;
    const t = new Date(); t.setDate(t.getDate() + 1); $("form", m).date.min = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    $$("dialog[open]").forEach((d) => d !== m && d.close());
    m.showModal();
  }
  function openDetail(id) {
    const l = listings[id], m = modal("detail");
    $("[data-dt-title]").textContent = l.title;
    const rows = [["Address", l.addr], ["Transaction", { lease: "For Lease", sale: "For Sale", sublease: "Sublease" }[l.tx]], ["Property type", l.type], ["Building class", `Class ${l.cls}`], ["Available area", `${fmt(l.sf)} SF`], ["Year built", l.type === "Land" ? "—" : l.built], ["Asking", isSale(l) ? `${money(l.price)} (${money(l.price / l.sf)}/SF)` : `$${l.price.toFixed(2)}/SF/year`], ["Availability", l.avail ? `Within ${l.avail} days` : "Available now"], ["Amenities", l.amen.join(", ") || "—"], ["Certifications", l.certs.join(", ") || "—"], ["Broker", `${l.broker}, Vanguard Commercial`]];
    $("[data-dt-body]").innerHTML = `<div class="dt-grid"><div class="dt-img">${Art.photo(typeKey[l.type], l.id + 1, 0, l.title)}</div><div class="calc" data-calc>${isSale(l)
      ? `<label>Down payment (%)<input type="number" min="10" max="100" value="25" data-down></label><label>Rate (%)<input type="number" min="1" max="15" step="0.1" value="6.5" data-rate></label><span>Est. monthly debt service (25-yr)</span><output data-out></output>`
      : `<label>Square feet needed<input type="number" min="500" max="${l.sf}" step="100" value="${l.sf}" data-sf></label><span>Est. monthly rent</span><output data-out></output><span data-annual></span>`}</div></div>
      <table class="dt-table"><tbody>${rows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
      <div><button class="btn btn-blue" type="button" data-tour="${l.id}">${icon("calendar")}Schedule a Tour</button></div>`;
    const calc = () => {
      if (isSale(l)) { const down = +$("[data-down]").value / 100, r = +$("[data-rate]").value / 1200, P = l.price * (1 - down), n = 300; $("[data-out]").textContent = `${money(r ? (P * r) / (1 - (1 + r) ** -n) : P / n)}/mo`; }
      else { const sf = Math.min(l.sf, Math.max(500, +$("[data-sf]").value || l.sf)); $("[data-out]").textContent = `${money((sf * l.price) / 12)}/mo`; $("[data-annual]").textContent = `${money(sf * l.price)} per year`; }
    };
    $$("[data-calc] input").forEach((i) => i.addEventListener("input", calc)); calc();
    $$("dialog[open]").forEach((d) => d !== m && d.close());
    m.showModal();
  }
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const m = modal(b.dataset.open); resetM(m);
    if (b.dataset.open === "save") { const chips = activeChips().map(([l]) => l); $("[data-save-sum]").innerHTML = `<b>${filtered().length} properties</b> in Austin, TX${chips.length ? ` · ${chips.join(" · ")}` : " · all listings"}`; }
    m.showModal();
  }));
  $$(".m-form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = f.closest("dialog");
    let first = null;
    $$("input, select", f).forEach((x) => { const bad = !x.checkValidity(); x.toggleAttribute("aria-invalid", bad); if (bad && !first) first = x; });
    $("[data-err]", m).textContent = first ? first.validationMessage || "Please complete the highlighted fields." : "";
    if (first) { first.focus(); return; }
    const k = f.dataset.kind;
    if (k === "tour") $("[data-done]", m).textContent = `${tourTarget} — ${new Date(`${f.date.value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${f.time.value}. The listing broker will confirm by email to ${f.email.value}. (Demo — nothing was sent.)`;
    if (k === "save") $("[data-done]", m).textContent = `We'll email ${f.email.value} a ${f.freq.value.toLowerCase()} when new matches appear. (Demo — nothing was sent.)`;
    f.hidden = true; $(".done", m).hidden = false;
  }));

  /* ---------- Market report ---------- */
  $("[data-report]").addEventListener("click", () => {
    const csv = "Metric,Value,Change\nOffice Vacancy,14.2%,-0.8% from Q4\nAvg. Office Rent,$48.50/SF,+3.2% YoY\nRetail Absorption,\"+320,000 SF\",Q1\nIndustrial Cap Rate,5.8%,stable\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "austin-market-snapshot-q1-2026.csv" }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast("Market snapshot downloaded (CSV)");
  });

  /* ---------- Lead form ---------- */
  const subs = ["Downtown", "Domain / North", "East Austin", "South Congress", "Mueller", "Riverside", "Round Rock", "Southwest"];
  $("[data-subs]").innerHTML = subs.map((s) => `<label><input type="checkbox" name="sub" value="${s}"><span>${s}</span></label>`).join("");
  const team = [["Sarah Chen", "Managing Director", "Office", "sarah@vanguard.com", "#DBEAFE"], ["Marcus Rivera", "Senior VP", "Retail", "marcus@vanguard.com", "#D1FAE5"], ["Tom Bradley", "Director", "Industrial", "tom@vanguard.com", "#FFEDD5"]];
  $("[data-team]").innerHTML = team.map(([n, t, s, e, c], i) => `<li><span class="hs">${Art.broker(n, c)}</span><div><b>${n}</b><p>${t}, ${s}</p><p class="ct"><a href="tel:+1512555014${i}">${icon("phone")}(512) 555-014${i}</a><a href="mailto:${e}">${icon("mail")}${e}</a></p></div></li>`).join("");
  const lf = $("[data-lead]");
  lf.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input:not([type=checkbox]), select", lf).forEach((x) => { const bad = !x.checkValidity(); x.toggleAttribute("aria-invalid", bad); if (bad && !first) first = x; });
    $("[data-lead-err]").textContent = first ? "Please complete the highlighted fields." : "";
    if (first) { first.focus(); return; }
    const picked = $$('[name="sub"]:checked', lf).map((c) => c.value);
    const who = { Office: team[0], Retail: team[1], Industrial: team[2] }[lf.ptype.value] || team[0];
    $("[data-lead-text]").textContent = `${who[0]} (${who[2]}) will reach out to ${lf.email.value} within one business day about ${lf.ptype.value.toLowerCase()} space of ${lf.size.value}${/SF$/.test(lf.size.value) ? "" : " SF"}${picked.length ? ` in ${picked.join(", ")}` : " anywhere in Austin"}. (Demo — nothing was sent.)`;
    lf.hidden = true; $("[data-lead-done]").hidden = false; $("[data-lead-done]").focus();
  });
  $("[data-lead-again]").addEventListener("click", () => { lf.reset(); lf.hidden = false; $("[data-lead-done]").hidden = true; });

  render();
})();
