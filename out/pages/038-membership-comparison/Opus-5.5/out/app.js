(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

  const TIERS = [
    { id: "basic", name: "Basic", m: 29, a: 24, tag: "Perfect for getting started", feats: ["Gym access (6am - 10pm)", "Cardio equipment", "Weight machines", "Locker room access", "Free parking"] },
    { id: "standard", name: "Standard", m: 49, a: 39, tag: "Our best value for regular gym-goers", pop: true, feats: ["Everything in Basic", "24/7 access", "Free weights area", "5 group classes/month", "Fitness assessment", "Mobile app access"] },
    { id: "premium", name: "Premium", m: 79, a: 65, tag: "For serious fitness enthusiasts", feats: ["Everything in Standard", "Unlimited classes", "Pool & sauna access", "2 PT sessions/month", "Towel service", "Guest passes (2/month)", "Priority class booking"] },
    { id: "elite", name: "Elite", m: 149, a: 125, tag: "The ultimate fitness experience", feats: ["Everything in Premium", "Unlimited PT sessions", "Spa treatments (2/month)", "Nutrition coaching", "Recovery suite access", "Exclusive member events", "No contract, cancel anytime"] },
  ];
  const T = Object.fromEntries(TIERS.map((t, i) => [t.id, { ...t, i }]));
  let annual = false;
  const price = (t) => (annual ? t.a : t.m);
  const saving = (t) => Math.round((1 - t.a / t.m) * 100);

  // ---------- plan cards ----------
  function renderPlans() {
    $("[data-plans]").innerHTML = TIERS.map((t) => `
      <article class="plan${t.pop ? " pop" : ""}" data-plan="${t.id}">
        ${t.pop ? `<span class="badge">${icon("flame")}Most Popular</span>` : ""}
        <h2>${t.name}</h2><p class="tag">${t.tag}</p>
        <p class="price"><b>${money(price(t))}</b><span>/mo</span></p>
        <p class="billed">${annual ? `${money(t.a * 12)} billed yearly · save ${saving(t)}%` : `or ${money(t.a)}/mo billed annually`}</p>
        <ul>${t.feats.map((f, i) => `<li class="${i === 0 && t.id !== "basic" ? "all" : ""}">${icon("check")}${esc(f)}</li>`).join("")}</ul>
        <button class="btn ${t.pop ? "btn-primary" : "btn-outline"}" type="button" data-join="${t.id}">Start ${t.name}</button>
      </article>`).join("");
    $("[data-plans-note]").textContent = annual ? "Annual prices shown per month, paid yearly. First month free when you join today. No joining fee." : "Prices per month. First month free when you join today. No joining fee.";
    renderTable();
    $("[data-mbar-txt]").textContent = `Standard · ${money(price(T.standard))}/mo${annual ? " (annual)" : ""}`;
  }
  $$("[data-bill]").forEach((b) => b.addEventListener("click", () => {
    annual = b.dataset.bill === "annual";
    $$("[data-bill]").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); });
    renderPlans(); renderCalc();
  }));

  // ---------- comparison table ----------
  const ROWS = [["Gym Hours", ["6am-10pm", "24/7", "24/7", "24/7"]], ["Cardio Equipment", [1, 1, 1, 1]], ["Weight Machines", [1, 1, 1, 1]], ["Free Weights", [0, 1, 1, 1]], ["Group Classes", [0, "5/month", "Unlimited", "Unlimited"]], ["Pool & Sauna", [0, 0, 1, 1]], ["Personal Training", [0, 0, "2/month", "Unlimited"]], ["Towel Service", [0, 0, 1, 1]], ["Guest Passes", [0, 0, "2/month", "4/month"]], ["Spa Access", [0, 0, 0, 1]], ["Nutrition Coach", [0, 0, 0, 1]], ["All 3 Locations", [0, 0, 1, 1]]];
  const cell = (v) => v === 1 ? `<span class="yes" aria-label="Included">${icon("check")}</span>` : v === 0 ? `<span class="no" aria-label="Not included">${icon("x")}</span>` : `<span class="val">${esc(v)}</span>`;
  function renderTable() {
    $("[data-cmp]").innerHTML = `<caption class="sr">Feature comparison by plan</caption>
      <thead><tr><th scope="col">Feature</th>${TIERS.map((t) => `<th scope="col" class="${t.pop ? "pop" : ""}"><span class="th-name">${t.name}</span><span class="th-price">${money(price(t))}/mo</span><button class="btn btn-sm ${t.pop ? "btn-primary" : "btn-outline"}" type="button" data-join="${t.id}">Join</button></th>`).join("")}</tr></thead>
      <tbody>${ROWS.map(([f, v]) => `<tr><th scope="row">${f}</th>${v.map((x, i) => `<td class="${TIERS[i].pop ? "pop" : ""}">${cell(x)}</td>`).join("")}</tr>`).join("")}</tbody>`;
  }

  // ---------- classes ----------
  const CLASSES = [
    ["Spin 45", "standard", true], ["Vinyasa Yoga", "standard", true], ["Body Pump", "standard", false], ["Core 30", "standard", false],
    ["HIIT Circuit", "premium", true], ["Aqua Fit", "premium", false], ["Boxing Basics", "premium", true], ["Pilates Reformer", "premium", false], ["Mobility Flow", "premium", false],
    ["Small-Group Strength", "elite", false], ["Breathwork & Recovery", "elite", false],
  ];
  const SCHED = [["Mon", "6:00 AM", "Spin 45"], ["Mon", "6:30 PM", "HIIT Circuit"], ["Tue", "7:00 AM", "Vinyasa Yoga"], ["Tue", "12:15 PM", "Core 30"], ["Wed", "5:45 PM", "Boxing Basics"], ["Thu", "9:00 AM", "Aqua Fit"], ["Thu", "6:00 PM", "Body Pump"], ["Sat", "8:00 AM", "Pilates Reformer"], ["Sat", "10:00 AM", "Small-Group Strength"]];
  const rank = (id) => T[id].i;
  let clsTier = "premium";
  $("[data-cls-tabs]").innerHTML = TIERS.map((t) => `<button class="tt" type="button" role="tab" data-cls="${t.id}" aria-selected="${t.id === clsTier}">${t.name}</button>`).join("");
  function renderClasses() {
    $$("[data-cls]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.cls === clsTier)));
    const r = rank(clsTier), limit = { basic: "No group classes on Basic — add a 5-class pack or upgrade to Standard.", standard: "5 classes per month from the Standard list.", premium: "Unlimited classes from the Standard and Premium lists, with priority booking.", elite: "Unlimited classes including Elite-only small-group sessions." }[clsTier];
    $("[data-cls-list]").innerHTML = `<p class="cls-limit">${limit}</p><ul class="cls">${CLASSES.map(([n, tier, pop]) => { const ok = r >= rank(tier); return `<li class="${ok ? "ok" : "lock"}">${ok ? icon("check") : icon("x")}<span>${n}</span>${pop ? `<em>${icon("flame")}Popular</em>` : ""}<small>${T[tier].name}+</small></li>`; }).join("")}</ul>`;
    $("[data-sched]").innerHTML = SCHED.map(([d, t, n]) => { const c = CLASSES.find((x) => x[0] === n), ok = r >= rank(c[1]); return `<li class="${ok ? "" : "lock"}${c[2] ? " hot" : ""}"><span class="d">${d}</span><span class="t">${t}</span><b>${n}</b>${c[2] ? `<em>${icon("flame")}</em>` : ""}<small>${ok ? "Included" : `${T[c[1]].name}+`}</small></li>`; }).join("");
  }
  $("[data-cls-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-cls]"); if (b) { clsTier = b.dataset.cls; renderClasses(); } });
  renderClasses();

  // ---------- facility ----------
  const AREAS = [["cardio", "Cardio floor", "heart", "basic"], ["machines", "Weight machines", "cog", "basic"], ["free", "Free weights", "dumbbell", "standard"], ["studio", "Class studios", "music", "standard"], ["pool", "Lap pool", "waves", "premium"], ["sauna", "Sauna & steam", "thermo", "premium"], ["spa", "Spa rooms", "leaf", "elite"], ["recovery", "Recovery suite", "snow", "elite"]];
  let facTier = "standard";
  $("[data-fac-tabs]").innerHTML = TIERS.map((t) => `<button type="button" class="tp" aria-pressed="${t.id === facTier}" data-fac="${t.id}">${t.name}</button>`).join("");
  $("[data-areas]").innerHTML = AREAS.map(([k, n, ic, tier]) => `<figure class="area" data-area="${tier}"><div class="a-img">${window.Art.area(k)}</div><figcaption><span class="a-ico">${icon(ic)}</span><b>${n}</b><span class="a-tier"><span class="a-state"></span>${T[tier].name}+</span></figcaption></figure>`).join("");
  function renderFac() {
    $$("[data-fac]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.fac === facTier)));
    $$("[data-area]").forEach((a) => { const ok = rank(facTier) >= rank(a.dataset.area); a.classList.toggle("locked", !ok); a.querySelector(".a-state").innerHTML = ok ? icon("check") : icon("x"); });
  }
  $("[data-fac-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-fac]"); if (b) { facTier = b.dataset.fac; renderFac(); } });
  renderFac();

  // ---------- add-ons calculator ----------
  const ADDONS = [["pt", "Personal Training Pack (4 sessions)", 150, "one-time"], ["nut", "Nutrition Consultation", 75, "one-time"], ["guest", "Additional Guest Passes (5-pack)", 25, "one-time"], ["locker", "Locker Rental", 15, "month"], ["towel", "Towel Service (for Basic/Standard)", 10, "month"]];
  let calcTier = "standard";
  const picked = new Set();
  $("[data-addons]").innerHTML = ADDONS.map(([k, n, p, per]) => `<li><label class="addon"><input type="checkbox" data-addon="${k}"><span class="box">${icon("check")}</span><span class="a-n">${n}</span><span class="a-p">${money(p)}${per === "month" ? "/month" : ""}</span></label></li>`).join("");
  function renderCalc() {
    const t = T[calcTier], base = price(t);
    const towelIncluded = rank(calcTier) >= rank("premium");
    const lines = ADDONS.filter(([k]) => picked.has(k));
    const monthly = base + lines.filter((l) => l[3] === "month" && !(l[0] === "towel" && towelIncluded)).reduce((s, l) => s + l[2], 0);
    const once = lines.filter((l) => l[3] !== "month").reduce((s, l) => s + l[2], 0);
    $("[data-calc]").innerHTML = `<h3>Your estimate</h3>
      <label class="field">Plan<select data-calc-tier>${TIERS.map((x) => `<option value="${x.id}"${x.id === calcTier ? " selected" : ""}>${x.name} — ${money(price(x))}/mo</option>`).join("")}</select></label>
      <ul class="lines"><li><span>${t.name} membership${annual ? " (annual)" : ""}</span><b>${money(base)}/mo</b></li>${lines.map(([k, n, p, per]) => `<li><span>${n}</span><b>${k === "towel" && towelIncluded ? "Included" : money(p) + (per === "month" ? "/mo" : "")}</b></li>`).join("")}</ul>
      <p class="tot"><span>Monthly</span><b data-total-month>${money(monthly)}</b></p>
      <p class="tot sub"><span>One-time add-ons</span><b data-total-once>${money(once)}</b></p>
      <p class="free">${icon("gift")}First month's membership free today</p>
      <button class="btn btn-primary" type="button" data-join="${calcTier}">Join with ${t.name}</button>`;
    $("[data-calc-tier]").addEventListener("change", (e) => { calcTier = e.target.value; renderCalc(); });
  }
  $("[data-addons]").addEventListener("change", (e) => { const c = e.target.closest("[data-addon]"); if (!c) return; c.checked ? picked.add(c.dataset.addon) : picked.delete(c.dataset.addon); renderCalc(); });

  // ---------- locations ----------
  const LOCS = [{ id: "dt", name: "Downtown", short: "Downtown", addr: "1550 Larimer St", hrs: "24/7", x: 430, y: 230 }, { id: "hl", name: "Highlands", short: "Highlands", addr: "3401 W 32nd Ave", hrs: "24/7", x: 210, y: 130 }, { id: "cc", name: "Cherry Creek", short: "Cherry Creek", addr: "2800 E 2nd Ave", hrs: "5am–11pm", x: 620, y: 330 }];
  let home = 0;
  function renderLocs() {
    $("[data-locs]").innerHTML = LOCS.map((l, i) => `<button type="button" role="radio" aria-checked="${i === home}" class="loc" data-loc="${i}">${icon("pin")}<span><b>${l.name}</b><small>${l.addr} · ${l.hrs}</small></span>${i === home ? '<em>Home gym</em>' : ""}</button>`).join("");
    $("[data-map]").innerHTML = window.Art.map(LOCS, home);
  }
  $("[data-locs]").addEventListener("click", (e) => { const b = e.target.closest("[data-loc]"); if (b) { home = +b.dataset.loc; renderLocs(); } });
  renderLocs();

  // ---------- join wizard ----------
  const jd = $("[data-join-dlg]"), wz = $("[data-wizard]"), body = $("[data-step-body]");
  let step = 1, sel = { tier: "standard", start: "", orient: "" };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const today = new Date(), maxD = new Date(); maxD.setDate(maxD.getDate() + 30);
  function drawStep() {
    $$("[data-st]").forEach((li) => { const n = +li.dataset.st; li.classList.toggle("on", n === step); li.classList.toggle("past", n < step); });
    $("[data-w-err]").textContent = "";
    $("[data-w-back]").hidden = step === 1 || step === 5;
    const t = T[sel.tier];
    if (step === 1) body.innerHTML = `<h2 id="join-title">Choose your plan</h2><div class="pick">${TIERS.map((x) => `<label class="pk"><input type="radio" name="tier" value="${x.id}"${x.id === sel.tier ? " checked" : ""}><span><b>${x.name}</b><small>${money(price(x))}/mo${annual ? " · annual" : ""}</small></span></label>`).join("")}</div><p class="hint">Billing: ${annual ? "annual" : "monthly"} · change it with the toggle on the page.</p>`;
    if (step === 2) body.innerHTML = `<h2 id="join-title">Pick your start date</h2><label class="field">Start date<input type="date" name="start" min="${iso(today)}" max="${iso(maxD)}" value="${sel.start || iso(today)}"></label><label class="field">Home gym<select name="home">${LOCS.map((l, i) => `<option value="${i}"${i === home ? " selected" : ""}>${l.name}</option>`).join("")}</select></label>`;
    if (step === 3) body.innerHTML = `<h2 id="join-title">Complete payment</h2><p class="sumline">${t.name} · ${money(price(t))}/mo${annual ? ` · ${money(t.a * 12)}/yr` : ""}<br><b>Due today: $0.00</b> (first month free)</p><label class="field">Name on card<input name="cname" autocomplete="cc-name"></label><label class="field">Card number<input name="card" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242"></label><p class="hint">Demo checkout: no card is stored or charged.</p>`;
    if (step === 4) body.innerHTML = `<h2 id="join-title">Schedule orientation</h2><div class="pick">${["Tomorrow 7:00 AM", "Tomorrow 6:00 PM", "Saturday 10:00 AM", "I'll book later"].map((o) => `<label class="pk"><input type="radio" name="orient" value="${o}"${o === sel.orient ? " checked" : ""}><span><b>${o}</b></span></label>`).join("")}</div>`;
    if (step === 5) body.innerHTML = `<div class="welcome">${icon("check")}<h2 id="join-title">Welcome to Kinetic!</h2><p>${t.name} (${annual ? "annual" : "monthly"}) starting ${new Date(sel.start + "T12:00").toLocaleDateString("en-US", { month: "long", day: "numeric" })} at ${LOCS[home].name}. Orientation: ${sel.orient}. (Demo: nothing was charged or sent.)</p></div>`;
    $("[data-w-next]").textContent = step === 3 ? "Pay $0.00 today" : step === 4 ? "Finish" : step === 5 ? "Done" : "Continue";
  }
  function openJoin(tier) { sel = { tier: tier || "standard", start: "", orient: "" }; step = 1; drawStep(); jd.showModal(); }
  wz.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = wz.elements, err = (m) => { $("[data-w-err]").textContent = m; };
    if (step === 1) sel.tier = f.tier.value;
    if (step === 2) { if (!f.start.value || f.start.value < f.start.min || f.start.value > f.start.max) return err("Choose a start date within the next 30 days."); sel.start = f.start.value; home = +f.home.value; renderLocs(); }
    if (step === 3) { if (!f.cname.value.trim()) return err("Enter the name on the card."); if (f.card.value.replace(/\D/g, "").length < 15) return err("Enter a full card number (demo only)."); }
    if (step === 4) { const o = wz.querySelector("[name=orient]:checked"); if (!o) return err("Pick an orientation time."); sel.orient = o.value; }
    if (step === 5) { jd.close(); return; }
    step += 1; drawStep();
  });
  $("[data-w-back]").addEventListener("click", () => { if (step > 1) { step -= 1; drawStep(); } });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-join]"); if (b) openJoin(b.dataset.join); });

  // ---------- mini dialogs: day pass / tour ----------
  const md = $("[data-mini-dlg]"), mf = $("[data-mini]");
  let miniMode = "pass";
  function openMini(mode) {
    miniMode = mode; mf.reset(); $("[data-mini-done]").hidden = true; $("[data-mini-err]").textContent = "";
    $("[data-mini-title]").textContent = mode === "pass" ? "Free day pass" : "Schedule a tour";
    $("[data-mini-desc]").textContent = mode === "pass" ? "We'll email a pass valid for 7 days at your home gym." : `A 20-minute tour at ${LOCS[home].name}.`;
    const d = mf.elements.date; d.min = iso(today); d.max = iso(maxD);
    $("[data-mini-date]").hidden = mode === "pass";
    md.showModal();
  }
  $("[data-pass]").addEventListener("click", () => openMini("pass"));
  $("[data-tour]").addEventListener("click", () => openMini("tour"));
  mf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = mf.elements;
    if (!f.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) { $("[data-mini-err]").textContent = "Please add your name and a valid email."; return; }
    if (miniMode === "tour" && !f.date.value) { $("[data-mini-err]").textContent = "Pick a tour date."; return; }
    $("[data-mini-text]").textContent = miniMode === "pass" ? `Day pass on its way to ${f.email.value.trim()}. (Demo)` : `Tour booked for ${f.date.value} at ${LOCS[home].name}. (Demo)`;
    $("[data-mini-done]").hidden = false;
  });
  $$(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- chat ----------
  const chat = $("[data-chat]"), log = $("[data-chat-log]");
  const REPLIES = [[/pool|sauna|swim/i, "The pool and sauna come with Premium ($79/mo) and Elite ($149/mo)."], [/freeze|pause/i, "You can freeze any plan for up to 3 months a year, free."], [/student|senior|discount|military/i, "Students get 20% off, seniors 15%, and military & first responders have a special rate. Bring ID when you join."], [/cancel|contract/i, "Monthly plans are month-to-month and cancel online. Annual plans include a 30-day money-back guarantee."], [/class/i, "Standard includes 5 classes/month; Premium and Elite are unlimited."]];
  function msg(t, who) { log.insertAdjacentHTML("beforeend", `<p class="m ${who}">${esc(t)}</p>`); log.scrollTop = log.scrollHeight; }
  function ask(q) { msg(q, "me"); setTimeout(() => { const r = REPLIES.find(([re]) => re.test(q)); msg(r ? r[1] : "Good question! An advisor will follow up. You can also call (303) 555-0147.", "bot"); }, 500); }
  $("[data-chat-open]").addEventListener("click", () => { chat.hidden = false; if (!log.children.length) msg("Hi! I can help you pick a plan. What matters most to you?", "bot"); $("#chat-in").focus(); });
  $("[data-chat-close]").addEventListener("click", () => { chat.hidden = true; });
  $("[data-chat-quick]").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); });
  $("[data-chat-form]").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#chat-in").value.trim(); if (v) { ask(v); $("#chat-in").value = ""; } });

  // ---------- misc ----------
  $("[data-promo-x]").addEventListener("click", () => { $("[data-promo]").hidden = true; });
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));
  const toast = $("[data-toast]"); let tt;
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (!s) return; e.preventDefault(); toast.textContent = `${s.dataset.soon} lives on the full site; this demo is the membership page.`; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); });
  function onScroll() { const p = $("#plans").getBoundingClientRect(), fin = $(".final").getBoundingClientRect(); document.body.classList.toggle("show-bar", p.bottom < 140 && fin.top > innerHeight - 40); }
  addEventListener("scroll", onScroll, { passive: true });
  renderPlans(); renderCalc(); onScroll();

  window.MuseKinetic = { annual: () => annual, step: () => step };
})();
