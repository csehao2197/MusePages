(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } } };
  const ST = window.STATIONS, idx = Object.fromEntries(ST.map((s, i) => [s.id, i]));

  /* ---------- Pacific time clock (optional ?at=HH:MM&dow=0-6 for a fixed demo clock) ---------- */
  const qs = new URLSearchParams(location.search), fixed = qs.get("at"), fixedDow = qs.get("dow");
  const started = Date.now();
  function pt() {
    if (fixed && /^\d{1,2}:\d{2}$/.test(fixed)) { const [h, m] = fixed.split(":").map(Number), extra = Math.floor((Date.now() - started) / 60000); const mins = h * 60 + m + extra; return { mins: mins % 1440, dow: fixedDow !== null ? +fixedDow : 2, dateKey: "fixed" }; }
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "numeric", weekday: "short", year: "numeric", month: "numeric", day: "numeric", hourCycle: "h23" }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { mins: +p.hour * 60 + +p.minute, dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday), dateKey: `${p.year}-${p.month}-${p.day}`, month: +p.month };
  }
  const fmt = (m) => { m = ((Math.round(m) % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = String(m % 60).padStart(2, "0"); return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? "AM" : "PM"}`; };
  const dur = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")} min` : `${m} min`);

  /* ---------- sample timetable (generated, not official) ---------- */
  const LIMITED = ["sf", "22nd", "millbrae", "burlingame", "sanmateo", "hillsdale", "sancarlos", "redwoodcity", "menlopark", "paloalto", "calave", "mountainview", "sunnyvale", "lawrence", "santaclara", "sjdiridon"].map((s) => idx[s]);
  const EXPRESS = ["sf", "22nd", "millbrae", "hillsdale", "redwoodcity", "paloalto", "mountainview", "sunnyvale", "sjdiridon"].map((s) => idx[s]);
  const SOUTH = ["tamien", "capitol", "blossomhill", "morganhill", "sanmartin", "gilroy"].map((s) => idx[s]);
  const LOCAL = ST.map((_, i) => i).filter((i) => i <= idx.sjdiridon);
  function run(stops, startMin, kind) {
    const k = kind === "Express" ? 1.0 : kind === "Limited" ? 1.08 : 1.15, out = [[stops[0], startMin]]; let t = startMin;
    for (let i = 1; i < stops.length; i++) { t += Math.abs(ST[stops[i]].mi - ST[stops[i - 1]].mi) * k + (i < stops.length - 1 ? 1 : 0); out.push([stops[i], Math.round(t)]); }
    return out;
  }
  let schedCache = {};
  function schedule(weekend) {
    const key = weekend ? "we" : "wd"; if (schedCache[key]) return schedCache[key];
    const trips = [], base = { Local: 100, Limited: 400, Express: 500 }, cnt = { Local: { SB: 0, NB: 0 }, Limited: { SB: 0, NB: 0 }, Express: { SB: 0, NB: 0 } };
    const add = (kind, dir, stops, start) => { const num = base[kind] + 2 * cnt[kind][dir]++ + (dir === "NB" ? 1 : 0); trips.push({ num, kind, dir, stops: run(dir === "SB" ? stops : stops.slice().reverse(), start, kind) }); };
    if (weekend) {
      for (let t = 7 * 60; t <= 23 * 60; t += 60) { add("Local", "SB", LOCAL.concat(idx.tamien), t + 5); add("Local", "NB", [idx.tamien].concat(LOCAL), t - 20); }
    } else {
      for (let t = 5 * 60; t <= 23 * 60 + 30; t += 30) { add("Local", "SB", (t / 30) % 2 ? LOCAL : LOCAL.concat(idx.tamien), t); add("Local", "NB", (t / 30) % 2 ? [idx.tamien].concat(LOCAL) : LOCAL, t - 25); }
      for (const [a, b] of [[6 * 60, 9 * 60], [16 * 60, 19 * 60]]) for (let t = a; t < b; t += 30) { add("Limited", "SB", LIMITED, t + 15); add("Limited", "NB", LIMITED, t + 2); }
      for (const t of [6 * 60 + 37, 7 * 60 + 37, 8 * 60 + 37, 16 * 60 + 37, 17 * 60 + 37, 18 * 60 + 37]) { const south = t === 16 * 60 + 37 || t === 17 * 60 + 37; add("Express", "SB", south ? EXPRESS.concat(SOUTH) : EXPRESS, t); }
      for (const t of [5 * 60 + 56, 6 * 60 + 26, 6 * 60 + 56]) add("Express", "NB", EXPRESS.concat(SOUTH), t);
      for (const t of [7 * 60 + 47, 8 * 60 + 47, 16 * 60 + 47, 17 * 60 + 47, 18 * 60 + 47]) add("Express", "NB", EXPRESS, t);
    }
    return (schedCache[key] = trips);
  }
  // Sample delay: some southbound weekday trains through Hillsdale run late during signal work (ties to the alert).
  const delayOf = (trip, weekend) => (!weekend && trip.dir === "SB" && trip.stops.some(([s]) => s === idx.hillsdale) && trip.num % 3 === 0 ? 6 : 0);
  function nextTrains(o, d, clock, count = 5) {
    const dir = d > o ? "SB" : "NB", res = [];
    for (const dayOff of [0, 1]) {
      const dow = (clock.dow + dayOff) % 7, weekend = dow === 0 || dow === 6;
      schedule(weekend).forEach((t) => {
        if (t.dir !== dir) return;
        const a = t.stops.find(([s]) => s === o), b = t.stops.find(([s]) => s === d); if (!a || !b) return;
        const delay = delayOf(t, weekend), dep = a[1] + dayOff * 1440;
        if (dep + delay >= clock.mins) res.push({ num: t.num, kind: t.kind, dir, dep, arr: b[1] + dayOff * 1440, delay, tomorrow: dayOff === 1 });
      });
      if (res.length >= count) break;
    }
    return res.sort((x, y) => x.dep + x.delay - (y.dep + y.delay)).slice(0, count);
  }

  /* ---------- simulated weather service with 10-minute cache and failure mode ---------- */
  const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const HIGHS = [57, 60, 62, 63, 64, 66, 66, 67, 70, 69, 63, 57];
  function wxAt(st, mins, clock) {
    const month = (clock.month || 11) - 1, f = Math.sqrt(st.mi / 77.4), h = mins / 60;
    const hi = HIGHS[month] + 10 * f, lo = hi - 12 - 4 * f, day = Math.max(0, Math.sin((Math.PI * (h - 6)) / 12));
    const rainy = hash(clock.dateKey) % 6 === 0, fog = !rainy && st.mi < 15 && (h < 11 || h > 19), cloudy = !rainy && !fog && hash(clock.dateKey + st.id) % 4 === 0;
    let t = lo + (hi - lo) * Math.pow(day, 0.8) - (fog ? 3 : 0) - (rainy ? 4 : 0);
    const cond = rainy ? ["rain", "Light Rain"] : fog ? ["fog", "Fog"] : cloudy ? ["cloud", "Mostly Cloudy"] : st.mi < 25 && h < 13 ? ["partly", "Partly Cloudy"] : ["sun", h >= 18 || h < 6 ? "Clear" : "Sunny"];
    return { temp: Math.round(t), icon: cond[0], desc: cond[1], wind: Math.round(5 + 11 * (1 - f) + (hash(st.id + Math.floor(h)) % 5)), hum: Math.min(98, Math.round(48 + 32 * (1 - f) + (fog ? 12 : 0) + (rainy ? 20 : 0))) };
  }
  const wxCache = {};
  async function fetchWeather(st, clock) {
    await new Promise((r) => setTimeout(r, 300));
    if ($("[data-fail]").checked) throw new Error("Weather service unavailable");
    const c = wxCache[st.id]; if (c && Date.now() - c.at < 10 * 60000 && c.mins === clock.mins) return c.data;
    const data = { now: wxAt(st, clock.mins, clock), forecast: [1, 2, 3].map((k) => ({ mins: (Math.floor(clock.mins / 60) + k) * 60, ...wxAt(st, ((Math.floor(clock.mins / 60) + k) * 60) % 1440, clock) })) };
    wxCache[st.id] = { at: Date.now(), mins: clock.mins, data, shown: fmt(clock.mins) };
    return data;
  }

  /* ---------- state ---------- */
  let routes = store.get("nexttrain-routes", []);
  let last = store.get("nexttrain-last", { from: "sf", to: "paloalto" });
  if (!(last.from in idx) || !(last.to in idx)) last = { from: "sf", to: "paloalto" };
  const from = $("[data-from]"), to = $("[data-to]");
  const opts = ST.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("");
  from.innerHTML = opts; to.innerHTML = opts; from.value = last.from; to.value = last.to;

  /* ---------- rendering ---------- */
  let dismissed = new Set(store.get("nexttrain-dismissed", []));
  function renderAlerts(clock) {
    const weekend = clock.dow === 0 || clock.dow === 6, list = [];
    if (!weekend && clock.mins >= 5 * 60 && clock.mins < 21 * 60) list.push({ id: "signal", sev: "warning", t: "Southbound delays up to 8 minutes", d: "Signal work near Hillsdale is delaying some southbound trains. Delayed trains are marked below. (Sample alert.)" });
    if (weekend) list.push({ id: "weekend", sev: "info", t: "Weekend schedule in effect", d: "Hourly local service in both directions. Limited and express trains don't run on weekends in this sample timetable." });
    list.push({ id: "bikes", sev: "info", t: "Bike cars", d: "Two bike cars on most trains. Board at the cars marked with the bike symbol and stack bikes by destination." });
    const vis = list.filter((a) => !dismissed.has(a.id));
    $("[data-alerts]").innerHTML = vis.map((a) => `<div class="alert ${a.sev}" role="${a.sev === "info" ? "status" : "alert"}" data-alert="${a.id}">${icon(a.sev === "critical" ? "i-crit" : a.sev === "warning" ? "i-warn" : a.id === "bikes" ? "i-bike" : "i-info")}<div><b><span class="lvl">${a.sev}</span>${esc(a.t)}</b>${esc(a.d)}</div>${a.sev === "info" ? `<button class="icon-btn" type="button" aria-label="Dismiss ${esc(a.t)}" data-dismiss="${a.id}">${icon("i-x")}</button>` : ""}</div>`).join("");
  }
  function renderSaved() {
    $("[data-saved]").innerHTML = routes.map((r, i) => `<div class="route${r.from === from.value && r.to === to.value ? " on" : ""}" data-route-i="${i}"><button class="go" type="button" data-use aria-label="Use saved route ${esc(r.name)}: ${esc(ST[idx[r.from]].name)} to ${esc(ST[idx[r.to]].name)}">${esc(r.name)}<small>${ST[idx[r.from]].code} → ${ST[idx[r.to]].code}</small></button><button class="icon-btn" type="button" aria-label="Edit ${esc(r.name)}" data-redit>${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(r.name)}" data-rdel>${icon("i-trash")}</button></div>`).join("");
  }
  let loadSeq = 0;
  async function load(withSkeleton = true) {
    const seq = ++loadSeq, clock = pt(), o = idx[from.value], d = idx[to.value], err = $("[data-perr]");
    $("[data-clock]").textContent = fmt(clock.mins);
    renderAlerts(clock); renderSaved();
    store.set("nexttrain-last", { from: from.value, to: to.value });
    if (o === d) { err.hidden = false; err.textContent = "Choose two different stations."; to.setAttribute("aria-invalid", "true"); $("[data-trains]").innerHTML = `<p class="none">Pick a destination different from your origin.</p>`; $("[data-wx]").innerHTML = ""; $("[data-trip-sub]").textContent = ""; return; }
    err.hidden = true; to.removeAttribute("aria-invalid");
    const dir = d > o ? "Southbound" : "Northbound";
    $("[data-trip-sub]").textContent = `${ST[o].name} → ${ST[d].name} · ${dir}`;
    const tc = $("[data-trains-card]"), wc = $("[data-wx-card]");
    if (withSkeleton) { tc.setAttribute("aria-busy", "true"); wc.setAttribute("aria-busy", "true"); $("[data-trains]").innerHTML = `<div class="skel" aria-label="Loading trains">${"<i></i>".repeat(5)}</div>`; $("[data-wx]").innerHTML = `<div class="skel" aria-label="Loading weather"><i></i><i></i></div>`; await new Promise((r) => setTimeout(r, 350)); if (seq !== loadSeq) return; }
    const list = nextTrains(o, d, clock);
    $("[data-trains]").innerHTML = list.length ? `<ol class="tlist">${list.map((t, i) => { const real = t.dep + t.delay, inMin = real - clock.mins; return `<li class="tr${i === 0 ? " next" : ""}" data-train="${t.num}"><div class="dep">${fmt(t.dep)}<small>${i === 0 ? "Next · " : ""}${t.tomorrow ? "Tomorrow" : inMin <= 0 ? "Departing now" : `in ${dur(inMin)}`}</small></div><div class="mid"><div class="arr">Arrives ${esc(ST[d].name)} <b>${fmt(t.arr + t.delay)}</b></div><div class="meta"><span class="tag ${t.kind.toLowerCase()}">${t.kind}</span><span class="tag">Train ${t.num}</span><span class="tag">${t.dir === "SB" ? "Southbound" : "Northbound"}</span>${t.delay ? `<span class="st late">${icon("i-warn")}Delayed +${t.delay} min · departs ${fmt(real)}</span>` : `<span class="st ok">${icon("i-check")}On time</span>`}</div></div><div class="dur">${dur(t.arr - t.dep)}<small>trip time</small></div></li>`; }).join("")}</ol>` : `<p class="none">No more trains between these stations in the sample timetable. Try another station pair.</p>`;
    tc.setAttribute("aria-busy", "false");
    $("[data-updated]").textContent = `Updated ${fmt(clock.mins)}`;
    try {
      const [wo, wd] = await Promise.all([fetchWeather(ST[o], clock), fetchWeather(ST[d], clock)]); if (seq !== loadSeq) return;
      const card = (who, st, w) => `<article class="wx" data-wx-${who}><span class="who">${who === "o" ? "Origin" : "Destination"}</span><h3>${esc(st.name)}</h3><div class="now"><svg role="img" aria-label="${w.now.desc}"><use href="#w-${w.now.icon}"/></svg><span class="temp">${w.now.temp}°F</span></div><p class="desc">${w.now.desc}</p><p class="facts"><span>${icon("i-wind")}${w.now.wind} mph wind</span><span>${icon("i-drop")}${w.now.hum}% humidity</span></p></article>`;
      const delta = wd.now.temp - wo.now.temp;
      $("[data-wx]").innerHTML = `<div class="wx2">${card("o", ST[o], wo)}${card("d", ST[d], wd)}</div><p class="diff" data-diff>${Math.abs(delta) >= 3 ? `${Math.abs(delta)}° ${delta > 0 ? "warmer" : "cooler"} at ${esc(ST[d].name)} than ${esc(ST[o].name)}` : "Similar temperatures at both stations"}${wo.now.desc !== wd.now.desc ? `: ${wo.now.desc.toLowerCase()} at the origin, ${wd.now.desc.toLowerCase()} at your destination.` : "."}</p>
        <div class="fc"><h3>Next 3 hours at ${esc(ST[d].name)}</h3><ol>${wd.forecast.map((f) => `<li><span>${fmt(f.mins)}</span><svg role="img" aria-label="${f.desc}"><use href="#w-${f.icon}"/></svg><b>${f.temp}°</b></li>`).join("")}</ol></div><p style="font-size:12px;color:var(--muted);margin:10px 0 0">Simulated weather for this demo.</p>`;
    } catch (e) {
      if (seq !== loadSeq) return;
      const co = wxCache[ST[o].id], cd = wxCache[ST[d].id];
      $("[data-wx]").innerHTML = `<div class="wx-err" role="alert"><b>${icon("i-warn")} Weather is unavailable right now.</b><span>${cd ? `Showing cached weather from ${cd.shown}: ${esc(ST[d].name)} ${cd.data.now.temp}°F, ${cd.data.now.desc.toLowerCase()}${co ? `; ${esc(ST[o].name)} ${co.data.now.temp}°F` : ""}.` : "No cached weather for these stations yet."} Train times are not affected.</span><button class="btn-o sm" type="button" data-retry>${icon("i-refresh")}Try again</button></div>`;
    }
    wc.setAttribute("aria-busy", "false");
  }

  /* ---------- interactions ---------- */
  [from, to].forEach((s) => s.addEventListener("change", () => load()));
  $("[data-swap]").addEventListener("click", () => { const a = from.value; from.value = to.value; to.value = a; load(); toast("Swapped direction"); });
  $("[data-refresh]").addEventListener("click", () => load());
  document.addEventListener("click", (e) => {
    const dm = e.target.closest("[data-dismiss]"); if (dm) { dismissed.add(dm.dataset.dismiss); store.set("nexttrain-dismissed", [...dismissed]); renderAlerts(pt()); return; }
    if (e.target.closest("[data-retry]")) { load(); return; }
    const r = e.target.closest("[data-route-i]"); if (!r) return; const i = +r.dataset.routeI, rt = routes[i];
    if (e.target.closest("[data-use]")) { from.value = rt.from; to.value = rt.to; load(); toast(`Loaded “${rt.name}”`); return; }
    if (e.target.closest("[data-rdel]")) { routes.splice(i, 1); store.set("nexttrain-routes", routes); renderSaved(); toast(`Deleted “${rt.name}”`); $("[data-save]").focus(); return; }
    if (e.target.closest("[data-redit]")) routeDlg(i);
  });
  $("[data-save]").addEventListener("click", () => {
    if (from.value === to.value) { load(); return; }
    if (routes.length >= 5) { toast("You can save up to 5 routes. Delete one first."); return; }
    routeDlg(-1);
  });
  const dlg = $("[data-dlg]"), db = $("[data-dlg-body]");
  function routeDlg(i) {
    const edit = i >= 0, r = edit ? routes[i] : { name: "", from: from.value, to: to.value };
    db.innerHTML = `<h2 id="dlg-title">${edit ? "Edit saved route" : "Save this route"}</h2><p style="margin:0">${esc(ST[idx[edit ? r.from : from.value]].name)} → ${esc(ST[idx[edit ? r.to : to.value]].name)}</p><label class="f">Route name<input name="name" maxlength="30" value="${esc(r.name)}" placeholder="e.g. Home to Work" autocomplete="off"><span class="e" data-ne></span></label>${edit ? `<label style="display:flex;gap:8px;align-items:center;min-height:44px;font-size:14px"><input type="checkbox" name="use" style="width:18px;height:18px"> Update stations to ${esc(ST[idx[from.value]].code)} → ${esc(ST[idx[to.value]].code)}</label>` : ""}<div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">${edit ? "Save changes" : "Save route"}</button></div>`;
    db.onsubmit = (e) => {
      if (e.submitter && e.submitter.value === "cancel") return; e.preventDefault();
      const name = db.elements.name.value.trim();
      const dupe = routes.some((x, k) => k !== i && x.name.toLowerCase() === name.toLowerCase());
      if (!name || dupe) { db.elements.name.setAttribute("aria-invalid", "true"); $("[data-ne]", db).textContent = name ? "You already have a route with this name." : "Give your route a name."; db.elements.name.focus(); return; }
      if (edit) { routes[i].name = name; if (db.elements.use?.checked) { routes[i].from = from.value; routes[i].to = to.value; } } else routes.push({ name, from: from.value, to: to.value });
      store.set("nexttrain-routes", routes); dlg.close(); renderSaved(); toast(edit ? "Route updated" : `Saved “${name}”`);
    };
    dlg.showModal(); db.elements.name.focus();
  }
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); }

  /* ---------- auto-refresh every 60 s ---------- */
  load();
  setInterval(() => load(false), 60000);
  window.__nexttrain = { nextTrains, idx, pt, refresh: () => load(false) };
})();
