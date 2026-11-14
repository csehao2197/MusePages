(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n, d = 0) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const short = (n) => (Math.abs(n) >= 1000 ? (n < 0 ? "−" : "") + "$" + (Math.abs(n) / 1000).toFixed(Math.abs(n) >= 10000 ? 0 : 1) + "k" : money(n));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const view = $("[data-view]");
  const KEY = "planwise-plan";

  /* ---------- dates ---------- */
  const now = new Date();
  const monthStart = (offset) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const fmtMonth = (d, long) => d.toLocaleDateString("en-US", { month: long ? "long" : "short", year: long ? "numeric" : "2-digit" });
  const fmtDate = (s) => new Date(s + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const monthsBetween = (from, to) => (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());

  /* ---------- plan model ---------- */
  const FREQ = { weekly: [52 / 12, "Weekly"], biweekly: [26 / 12, "Every 2 weeks"], semimonthly: [2, "Twice a month"], monthly: [1, "Monthly"], quarterly: [1 / 3, "Quarterly"], annually: [1 / 12, "Annually"] };
  const CATS = ["Housing", "Food", "Transportation", "Utilities", "Insurance", "Health", "Subscriptions", "Entertainment", "Shopping", "Personal", "Debt", "Travel", "Gifts", "Other"];
  const FLEX = ["Food", "Entertainment", "Shopping", "Subscriptions", "Personal", "Travel", "Gifts", "Other"];
  const BENCH = { Housing: 0.35, Food: 0.15, Transportation: 0.15, Entertainment: 0.08, Shopping: 0.08, Subscriptions: 0.03, Personal: 0.08 };
  function sample() {
    const d = (m, day) => ymd(new Date(now.getFullYear(), now.getMonth() + m, day));
    return { version: 1, currency: "USD", balance: 4200,
      income: [{ id: uid(), name: "Salary", amount: 2450, freq: "biweekly" }, { id: uid(), name: "Freelance design", amount: 600, freq: "monthly" }],
      expenses: [
        { id: uid(), name: "Rent", amount: 1650, category: "Housing", type: "recurring", day: 1 }, { id: uid(), name: "Groceries", amount: 520, category: "Food", type: "recurring", day: 5 },
        { id: uid(), name: "Dining out", amount: 340, category: "Food", type: "recurring", day: 15 }, { id: uid(), name: "Car payment", amount: 385, category: "Transportation", type: "recurring", day: 12 },
        { id: uid(), name: "Gas & transit", amount: 160, category: "Transportation", type: "recurring", day: 20 }, { id: uid(), name: "Utilities & internet", amount: 210, category: "Utilities", type: "recurring", day: 18 },
        { id: uid(), name: "Phone", amount: 65, category: "Utilities", type: "recurring", day: 22 }, { id: uid(), name: "Health insurance", amount: 240, category: "Insurance", type: "recurring", day: 1 },
        { id: uid(), name: "Streaming & apps", amount: 74, category: "Subscriptions", type: "recurring", day: 9 }, { id: uid(), name: "Gym", amount: 45, category: "Health", type: "recurring", day: 3 },
        { id: uid(), name: "Going out", amount: 260, category: "Entertainment", type: "recurring", day: 25 }, { id: uid(), name: "Clothes & shopping", amount: 180, category: "Shopping", type: "recurring", day: 28 },
        { id: uid(), name: "Student loan", amount: 290, category: "Debt", type: "recurring", day: 14 },
        { id: uid(), name: "Holiday gifts", amount: 650, category: "Gifts", type: "once", date: d(1, 15) }, { id: uid(), name: "Car insurance (annual)", amount: 1180, category: "Insurance", type: "once", date: d(3, 10) },
        { id: uid(), name: "Friend's wedding trip", amount: 900, category: "Travel", type: "once", date: d(6, 20) }
      ],
      goals: [
        { id: uid(), name: "Emergency fund", target: 10000, saved: 3500, date: d(14, 1) },
        { id: uid(), name: "Vacation to Hawaii", target: 4500, saved: 1200, date: d(9, 1) },
        { id: uid(), name: "House down payment", target: 40000, saved: 8000, date: d(48, 1) }
      ] };
  }
  const empty = () => ({ version: 1, currency: "USD", balance: 0, income: [], expenses: [], goals: [] });
  function valid(p) {
    const num = (x) => typeof x === "number" && isFinite(x);
    return p && typeof p === "object" && num(p.balance) && Array.isArray(p.income) && Array.isArray(p.expenses) && Array.isArray(p.goals)
      && p.income.every((i) => i && typeof i.name === "string" && num(i.amount) && FREQ[i.freq])
      && p.expenses.every((e) => e && typeof e.name === "string" && num(e.amount) && typeof e.category === "string" && (e.type === "recurring" ? num(e.day) : e.type === "once" && /^\d{4}-\d{2}-\d{2}$/.test(e.date)))
      && p.goals.every((g) => g && typeof g.name === "string" && num(g.target) && num(g.saved) && /^\d{4}-\d{2}-\d{2}$/.test(g.date));
  }
  let plan; try { plan = JSON.parse(localStorage.getItem(KEY)); } catch { plan = null; }
  if (!valid(plan)) plan = sample();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(plan)); } catch { /* storage unavailable */ } };
  save();

  /* ---------- calculations ---------- */
  const mIncome = () => plan.income.reduce((s, i) => s + i.amount * FREQ[i.freq][0], 0);
  const mRecurring = () => plan.expenses.filter((e) => e.type === "recurring").reduce((s, e) => s + e.amount, 0);
  const byCat = () => { const m = {}; plan.expenses.filter((e) => e.type === "recurring").forEach((e) => (m[e.category] = (m[e.category] || 0) + e.amount)); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
  function goalNeed(g, from = monthStart(1)) { const left = Math.max(0, g.target - g.saved), months = monthsBetween(from, new Date(g.date + "T12:00:00")); if (!left) return { monthly: 0, months, status: "done" }; if (months <= 0) return { monthly: left, months: 0, status: "overdue" }; return { monthly: left / months, months, status: "active" }; }
  const goalNeeds = () => plan.goals.reduce((s, g) => s + (goalNeed(g).status === "active" ? goalNeed(g).monthly : 0), 0);
  function forecast() {
    let bal = plan.balance; const saved = Object.fromEntries(plan.goals.map((g) => [g.id, g.saved])), rows = [];
    for (let m = 1; m <= 12; m++) {
      const ms = monthStart(m), me = monthStart(m + 1), inc = mIncome(), rec = mRecurring();
      const onceList = plan.expenses.filter((e) => e.type === "once" && new Date(e.date + "T12:00:00") >= ms && new Date(e.date + "T12:00:00") < me), once = onceList.reduce((s, e) => s + e.amount, 0);
      let contrib = 0;
      plan.goals.forEach((g) => { const gd = new Date(g.date + "T12:00:00"); if (gd < ms) return; const left = g.target - saved[g.id]; if (left <= 0) return; const months = Math.max(1, monthsBetween(ms, gd)); const c = Math.min(left, left / months); saved[g.id] += c; contrib += c; });
      bal = bal + inc - rec - once - contrib;
      rows.push({ m, ms, inc, rec, once, onceList, contrib, end: bal });
    }
    return rows;
  }

  /* ---------- suggestions (rule-based, for next month) ---------- */
  function suggestions() {
    const inc = mIncome(), rec = mRecurring(), need = goalNeeds(), surplus = inc - rec - need, out = [], cats = byCat(), fc = forecast(), next = fmtMonth(monthStart(1), true);
    if (!inc) out.push({ sev: "info", t: "Add your income to get started", d: "Suggestions use your monthly income, expenses and goals.", link: ["#/income", "Add income"] });
    if (inc && surplus < 0) {
      const short = -surplus; let left = short; const cuts = [];
      cats.filter(([c]) => FLEX.includes(c)).forEach(([c, v]) => { if (left <= 0) return; const cut = Math.min(left, Math.round(v * 0.25)); if (cut > 0) { cuts.push([c, cut]); left -= cut; } });
      out.push({ sev: "critical", t: `You're ${money(short)} a month short of your goals`, d: `Income covers expenses but not the ${money(need)}/month your goals need. ${cuts.length ? `Trimming ${cuts.map(([c, v]) => `${c} by ${money(v)}`).join(", ")} would ${left > 0 ? `close ${money(short - left)} of the gap` : "close the gap"}.` : ""}${left > 0 ? " Consider extending a goal's target date." : ""}`, link: ["#/expenses", "Review expenses"] });
      const big = plan.goals.filter((g) => goalNeed(g).status === "active").sort((a, b) => goalNeed(b).monthly - goalNeed(a).monthly)[0];
      if (big) { const afford = Math.max(1, goalNeed(big).monthly - short), months = Math.ceil((big.target - big.saved) / afford), nd = monthStart(1 + months); out.push({ sev: "warning", t: `Or move “${big.name}” to ${fmtMonth(nd, true)}`, d: `Saving ${money(afford)}/month instead of ${money(goalNeed(big).monthly)} keeps everything else on track.`, link: ["#/goals", "Edit goals"] }); }
    }
    cats.forEach(([c, v]) => { const b = BENCH[c]; if (b && inc && v / inc > b + 0.005) out.push({ sev: "warning", t: `${c} is ${Math.round((v / inc) * 100)}% of your income`, d: `A common guideline is under ${Math.round(b * 100)}%. Bringing it to ${money(inc * b)} would free ${money(v - inc * b)} a month.`, link: ["#/expenses", `See ${c.toLowerCase()} costs`] }); });
    const low = fc.reduce((a, r) => (r.end < a.end ? r : a), fc[0]);
    if (low && low.end < 0) out.push({ sev: "critical", t: `Your balance goes negative in ${fmtMonth(low.ms, true)}`, d: `The forecast reaches ${money(low.end)}${low.onceList.length ? ` when ${low.onceList.map((e) => e.name).join(" and ")} ${low.onceList.length > 1 ? "are" : "is"} due` : ""}. Set aside money earlier or reduce spending before then.`, link: ["#/forecast", "Open forecast"] });
    else if (low && low.end < rec) out.push({ sev: "warning", t: `Your cushion gets thin in ${fmtMonth(low.ms, true)}`, d: `The lowest projected balance is ${money(low.end)}, less than one month of expenses (${money(rec)}).`, link: ["#/forecast", "Open forecast"] });
    if (inc && !plan.goals.some((g) => /emergency/i.test(g.name)) && plan.balance < rec * 3) out.push({ sev: "info", t: "Build an emergency fund", d: `Aim for 3–6 months of expenses (${money(rec * 3)}–${money(rec * 6)}) before investing.`, link: ["#/goals", "Add a goal"] });
    const rate = inc ? (inc - rec) / inc : 0;
    if (inc && rate < 0.2) out.push({ sev: "warning", t: `You keep ${Math.round(rate * 100)}% of your income`, d: "A 20% savings rate is a healthy target. Ideas: ask for a raise at your next review, take on a freelance project, or sell items you no longer use.", link: ["#/income", "Review income"] });
    if (inc && surplus > 0) out.push({ sev: "good", t: `${money(surplus)} left over each month`, d: `After expenses and goal savings you have room to spare. Consider putting half toward your goals to finish early and investing the rest.`, link: ["#/goals", "Boost a goal"] });
    const soon = plan.expenses.filter((e) => e.type === "once" && new Date(e.date + "T12:00:00") >= monthStart(0) && new Date(e.date + "T12:00:00") < monthStart(3)).sort((a, b) => a.date.localeCompare(b.date));
    soon.forEach((e) => out.push({ sev: "info", t: `Upcoming: ${e.name} on ${fmtDate(e.date)}`, d: `${money(e.amount)} one-time expense. Setting aside ${money(e.amount / Math.max(1, monthsBetween(now, new Date(e.date + "T12:00:00")) || 1))}/month covers it.`, link: ["#/expenses", "View one-time expenses"] }));
    const order = { critical: 0, warning: 1, info: 2, good: 3 };
    return { list: out.sort((a, b) => order[a.sev] - order[b.sev]), next };
  }
  const SEV = { critical: ["i-warn", "red", "Action needed"], warning: ["i-warn", "amber", "Adjust"], info: ["i-info", "teal", "Heads up"], good: ["i-check", "green", "On track"] };
  const sugHtml = (s) => `<li class="sug ${s.sev}"><span class="ic">${icon(SEV[s.sev][0])}</span><div><b>${esc(s.t)}</b><p>${esc(s.d)}</p><span class="tag pill ${SEV[s.sev][1]}">${SEV[s.sev][2]}</span>${s.link ? ` <a href="${s.link[0]}" style="font-size:13px;font-weight:600;margin-left:6px">${esc(s.link[1])} →</a>` : ""}</div></li>`;

  /* ---------- charts ---------- */
  const nice = (v) => { const p = Math.pow(10, Math.floor(Math.log10(Math.abs(v) || 1))), f = Math.abs(v) / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
  function lineChart(box, rows, H) {
    const W = Math.max(300, box.clientWidth), m = { l: 56, r: 56, t: 24, b: 30 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    const pts = [{ label: "Now", end: plan.balance, now: true }].concat(rows.map((r) => ({ label: fmtMonth(r.ms), end: r.end, r })));
    let lo = Math.min(0, ...pts.map((p) => p.end)), hi = Math.max(...pts.map((p) => p.end), 1); const step = nice((hi - lo) / 4); lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step;
    const x = (i) => m.l + (i / (pts.length - 1)) * iw, y = (v) => m.t + ih - ((v - lo) / (hi - lo)) * ih;
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Projected balance over the next 12 months: starts at ${money(plan.balance)}, ends at ${money(pts[pts.length - 1].end)}, lowest ${money(Math.min(...pts.map((p) => p.end)))}.">`;
    for (let v = lo; v <= hi + 1e-6; v += step) s += `<line class="${Math.abs(v) < 1e-6 ? "zero" : "gl"}" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${m.l - 8}" y="${y(v) + 4}" text-anchor="end">${short(v)}</text>`;
    const every = W < 560 ? 3 : 1;
    pts.forEach((p, i) => { if (i % every === 0 || i === pts.length - 1) s += `<text class="ax" x="${x(i)}" y="${H - 8}" text-anchor="middle">${p.label}</text>`; });
    const d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p.end).toFixed(1)}`).join(" ");
    s += `<path class="area" d="${d} L${x(pts.length - 1)} ${y(Math.max(lo, 0))} L${x(0)} ${y(Math.max(lo, 0))}Z"/><path class="line" d="${d}"/>`;
    pts.forEach((p, i) => { if (p.r && p.r.once) s += `<circle class="ev" cx="${x(i)}" cy="${y(p.end)}" r="5"><title>One-time expense</title></circle>`; });
    const last = pts[pts.length - 1], li = pts.length - 1, minI = pts.reduce((a, p, i) => (p.end < pts[a].end ? i : a), 0);
    s += `<circle class="dot${last.end < 0 ? " neg" : ""}" cx="${x(li)}" cy="${y(last.end)}" r="5"/><text class="lab" x="${x(li) + 8}" y="${y(last.end) + 4}">${short(last.end)}</text>`;
    if (pts[minI].end < 0) s += `<circle class="dot neg" cx="${x(minI)}" cy="${y(pts[minI].end)}" r="5"/><text class="lab" x="${x(minI)}" y="${y(pts[minI].end) + 20}" text-anchor="middle">${short(pts[minI].end)}</text>`;
    s += `<line class="xh" data-xh x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" visibility="hidden"/><circle class="dot" data-xd r="5" visibility="hidden"/><rect data-hit x="${m.l - 10}" y="${m.t}" width="${iw + 20}" height="${ih}" fill="transparent" tabindex="0" aria-label="Forecast chart. Use left and right arrow keys to read each month."/></svg><div class="tip" hidden data-tip></div>`;
    box.innerHTML = s;
    const hit = $("[data-hit]", box), tip = $("[data-tip]", box), xh = $("[data-xh]", box), xd = $("[data-xd]", box); let cur = -1;
    const show = (i) => { cur = Math.max(0, Math.min(pts.length - 1, i)); const p = pts[cur], cx = x(cur), cy = y(p.end); xh.setAttribute("x1", cx); xh.setAttribute("x2", cx); xh.setAttribute("visibility", "visible"); xd.setAttribute("cx", cx); xd.setAttribute("cy", cy); xd.setAttribute("visibility", "visible"); xd.classList.toggle("neg", p.end < 0);
      tip.hidden = false; tip.innerHTML = p.now ? `<b>Now</b><div class="r"><span>Current balance</span>${money(p.end)}</div>` : `<b>${fmtMonth(p.r.ms, true)}</b><div class="r"><span>Income</span>+${money(p.r.inc)}</div><div class="r"><span>Recurring</span>−${money(p.r.rec)}</div>${p.r.once ? `<div class="r"><span>One-time</span>−${money(p.r.once)}</div>` : ""}<div class="r"><span>To goals</span>−${money(p.r.contrib)}</div><div class="r" style="border-top:1px solid #E2E8F0;margin-top:4px;padding-top:4px"><span>End balance</span><b style="display:inline;margin:0">${money(p.end)}</b></div>`;
      tip.style.left = `${Math.max(90, Math.min(box.clientWidth - 90, (cx / W) * box.clientWidth))}px`; tip.style.top = `${(Math.min(cy, m.t + ih * 0.5) / H) * box.clientHeight}px`; };
    const hide = () => { tip.hidden = true; xh.setAttribute("visibility", "hidden"); xd.setAttribute("visibility", "hidden"); };
    const fromEvt = (e) => { const r = box.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W; show(Math.round(((px - m.l) / iw) * (pts.length - 1))); };
    hit.addEventListener("pointermove", fromEvt); hit.addEventListener("pointerdown", fromEvt); hit.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hide(); });
    hit.addEventListener("focus", () => show(cur < 0 ? 0 : cur)); hit.addEventListener("blur", hide);
    hit.addEventListener("keydown", (e) => { const k = { ArrowRight: 1, ArrowLeft: -1, Home: -99, End: 99 }[e.key]; if (k === undefined) return; e.preventDefault(); show(cur + k); });
  }
  function barChart(box, data) {
    if (!data.length) { box.innerHTML = `<p class="empty">No recurring expenses yet.</p>`; return; }
    const W = Math.max(300, box.clientWidth), rowH = 34, m = { l: 118, r: 70, t: 4, b: 4 }, H = m.t + m.b + rowH * data.length, iw = W - m.l - m.r, max = Math.max(...data.map((d) => d[1]));
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Monthly recurring spending by category: ${data.map(([c, v]) => `${c} ${money(v)}`).join(", ")}.">`;
    data.forEach(([c, v], i) => { const yy = m.t + i * rowH + (rowH - 20) / 2, w = Math.max(2, (v / max) * iw), r = Math.min(4, w);
      s += `<g data-bar="${i}"><text class="ax" x="${m.l - 10}" y="${yy + 14}" text-anchor="end">${c}</text><path class="bar" d="M${m.l} ${yy}H${m.l + w - r}Q${m.l + w} ${yy} ${m.l + w} ${yy + r}V${yy + 20 - r}Q${m.l + w} ${yy + 20} ${m.l + w - r} ${yy + 20}H${m.l}Z"/><text class="lab" x="${m.l + w + 8}" y="${yy + 14}">${money(v)}</text><rect x="0" y="${m.t + i * rowH}" width="${W}" height="${rowH}" fill="transparent"><title>${c}: ${money(v)} per month (${Math.round((v / (mIncome() || 1)) * 100)}% of income)</title></rect></g>`; });
    box.innerHTML = s + "</svg>";
  }
  addEventListener("resize", () => { clearTimeout(window.__rt); window.__rt = setTimeout(route, 150); });

  /* ---------- views ---------- */
  const V = {};
  V.dashboard = () => {
    const inc = mIncome(), rec = mRecurring(), net = inc - rec, fc = forecast(), sug = suggestions();
    return `<div class="page"><div class="ph"><div><h1>Dashboard</h1><p>Your money at a glance · monthly figures</p></div></div>
      <div class="kpis"><div class="kpi"><span>Current balance</span><label class="bal"><span aria-hidden="true">$</span><input type="number" inputmode="decimal" step="any" value="${plan.balance}" aria-label="Current balance in dollars" data-bal></label><small>Edit to match your bank</small></div>
        <div class="kpi"><span>${icon("i-in")}Total income</span><b class="money" data-k-inc>${money(inc)}</b><small>${plan.income.length} source${plan.income.length === 1 ? "" : "s"} / month</small></div>
        <div class="kpi"><span>${icon("i-out")}Total expenses</span><b class="money" data-k-exp>${money(rec)}</b><small>recurring / month</small></div>
        <div class="kpi"><span>Net each month</span><b class="money ${net < 0 ? "neg" : "pos"}" data-k-net>${net < 0 ? "" : "+"}${money(net)}</b><small>before goal savings</small></div></div>
      <div class="grid2"><section class="card"><div class="card-h"><div><h2>12-month forecast</h2><p>Projected balance after expenses and goal savings</p></div><a class="btn-o sm" href="#/forecast">Details</a></div><div class="chart" data-line></div><p class="legend-note"><span><i style="background:#fff;border:1.5px solid #0F172A"></i>Month with a one-time expense</span></p></section>
        <section class="card"><div class="card-h"><h2>Goals</h2><a class="btn-o sm" href="#/goals">Manage</a></div>${plan.goals.length ? plan.goals.map((g) => { const p = Math.min(100, (g.saved / g.target) * 100); return `<div class="mini-goal"><div class="row"><b>${esc(g.name)}</b><span class="money">${Math.round(p)}%</span></div><div class="meter" role="progressbar" aria-label="${esc(g.name)} progress" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div><small style="color:var(--muted)">${money(g.saved)} of ${money(g.target)} · by ${fmtDate(g.date)}</small></div>`; }).join("") : `<p class="empty">No goals yet. <a href="#/goals">Add one</a></p>`}</section></div>
      <section class="card"><div class="card-h"><div><h2>Top suggestions for ${sug.next}</h2><p>Based on your current plan</p></div><a class="btn-o sm" href="#/suggestions">See all ${sug.list.length}</a></div><ul class="sugs">${sug.list.slice(0, 3).map(sugHtml).join("") || `<p class="empty">No suggestions right now.</p>`}</ul></section></div>`;
  };
  V.income = () => {
    const inc = mIncome();
    return `<div class="page"><div class="ph"><div><h1>Income</h1><p>${money(inc)} per month from ${plan.income.length} source${plan.income.length === 1 ? "" : "s"}</p></div><button class="btn" type="button" data-new="income">${icon("i-plus")}Add income</button></div>
      <section class="card">${plan.income.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="num">Amount</th><th class="hide-sm">Frequency</th><th class="num">Per month</th><th class="num"><span class="sr">Actions</span></th></tr></thead><tbody>${plan.income.map((i) => `<tr data-row="${i.id}"><td>${esc(i.name)}</td><td class="num">${money(i.amount, 2)}<br class="hide-lg"><small class="show-sm" style="color:var(--muted)">${FREQ[i.freq][1]}</small></td><td class="hide-sm">${FREQ[i.freq][1]}</td><td class="num">${money(i.amount * FREQ[i.freq][0], 2)}</td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Edit ${esc(i.name)}" data-edit="income">${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(i.name)}" data-del="income">${icon("i-trash")}</button></div></td></tr>`).join("")}</tbody><tfoot><tr><th colspan="2">Total monthly income</th><td class="hide-sm"></td><td class="num" data-total>${money(inc, 2)}</td><td></td></tr></tfoot></table></div>` : `<p class="empty">No income yet. Add your salary, freelance work or other sources.</p>`}</section></div>`;
  };
  let expFilter = "all";
  V.expenses = () => {
    const list = plan.expenses.filter((e) => expFilter === "all" || e.type === expFilter).sort((a, b) => (a.type === b.type ? b.amount - a.amount : a.type === "recurring" ? -1 : 1));
    return `<div class="page"><div class="ph"><div><h1>Expenses</h1><p>${money(mRecurring())} recurring per month · ${plan.expenses.filter((e) => e.type === "once").length} one-time planned</p></div><button class="btn" type="button" data-new="expense">${icon("i-plus")}Add expense</button></div>
      <div class="grid2"><section class="card"><div class="card-h"><h2>All expenses</h2><div class="filters" role="group" aria-label="Filter expenses">${[["all", "All"], ["recurring", "Recurring"], ["once", "One-time"]].map(([k, l]) => `<button type="button" aria-pressed="${k === expFilter}" data-ef="${k}">${l}</button>`).join("")}</div></div>
        ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="hide-sm">Category</th><th>When</th><th class="num">Amount</th><th class="num"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map((e) => `<tr data-row="${e.id}"><td>${esc(e.name)}</td><td class="hide-sm"><span class="pill">${esc(e.category)}</span></td><td>${e.type === "recurring" ? `Monthly · ${ordinal(e.day)}` : `<span class="pill amber">Once</span> ${fmtDate(e.date)}`}</td><td class="num">${money(e.amount, 2)}</td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Edit ${esc(e.name)}" data-edit="expense">${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(e.name)}" data-del="expense">${icon("i-trash")}</button></div></td></tr>`).join("")}</tbody></table></div>` : `<p class="empty">No expenses in this view.</p>`}</section>
        <section class="card"><div class="card-h"><div><h2>Recurring by category</h2><p>Per month</p></div></div><div class="chart" data-bars></div></section></div></div>`;
  };
  const ordinal = (n) => n + (["th", "st", "nd", "rd"][((n % 100) - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th");
  V.goals = () => `<div class="page"><div class="ph"><div><h1>Financial goals</h1><p>${money(goalNeeds())} per month needed to stay on track</p></div><button class="btn" type="button" data-new="goal">${icon("i-plus")}Add goal</button></div>
    ${plan.goals.length ? `<div class="goals">${plan.goals.map((g) => { const n = goalNeed(g), p = Math.min(100, (g.saved / g.target) * 100); return `<article class="card goal" data-row="${g.id}"><h3>${esc(g.name)}</h3><div class="row"><span>Target ${fmtDate(g.date)}</span><span>${n.status === "done" ? '<span class="pill green">Reached</span>' : n.status === "overdue" ? '<span class="pill red">Past date</span>' : `${n.months} months left`}</span></div><div class="meter" role="progressbar" aria-label="${esc(g.name)} progress" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%"></i></div><p class="amt">${money(g.saved)} <small>of ${money(g.target)} · ${Math.round(p)}%</small></p>${n.status === "active" ? `<p class="need">Save <b>${money(n.monthly)}</b> per month to reach it on time.</p>` : n.status === "overdue" ? `<p class="need">${money(g.target - g.saved)} still needed. Pick a new date.</p>` : ""}<div class="acts"><button class="btn-o sm" type="button" data-contrib>${icon("i-plus")}Add savings</button><button class="icon-btn" type="button" aria-label="Edit ${esc(g.name)}" data-edit="goal">${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(g.name)}" data-del="goal">${icon("i-trash")}</button></div></article>`; }).join("")}</div>` : `<p class="empty">No goals yet. Add one for a trip, a home, or an emergency fund.</p>`}</div>`;
  let fcTable = false;
  V.forecast = () => {
    const fc = forecast(), low = fc.reduce((a, r) => (r.end < a.end ? r : a), fc[0]);
    return `<div class="page"><div class="ph"><div><h1>12-month forecast</h1><p>Starting from today's balance of ${money(plan.balance)}</p></div><button class="btn-o sm" type="button" aria-pressed="${fcTable}" data-fct>${icon("i-table")}${fcTable ? "Show chart" : "Show table"}</button></div>
      <div class="kpis"><div class="kpi"><span>Balance in 12 months</span><b class="money ${fc[11].end < 0 ? "neg" : ""}" data-end>${money(fc[11].end)}</b></div><div class="kpi"><span>Lowest point</span><b class="money ${low.end < 0 ? "neg" : ""}">${money(low.end)}</b><small>${fmtMonth(low.ms, true)}</small></div><div class="kpi"><span>Saved toward goals</span><b class="money">${money(fc.reduce((s, r) => s + r.contrib, 0))}</b><small>over 12 months</small></div><div class="kpi"><span>One-time expenses</span><b class="money">${money(fc.reduce((s, r) => s + r.once, 0))}</b><small>${fc.reduce((s, r) => s + r.onceList.length, 0)} planned</small></div></div>
      <section class="card"><div class="card-h"><div><h2>Projected balance</h2><p>Income − recurring − one-time − goal savings, month by month</p></div></div><div class="chart" data-line ${fcTable ? "hidden" : ""}></div>${fcTable ? "" : `<p class="legend-note"><span><i style="background:#fff;border:1.5px solid #0F172A"></i>Month with a one-time expense</span><span>Hover, tap or use arrow keys for details</span></p>`}
        <div class="tbl-wrap" ${fcTable ? "" : "hidden"} data-fctable><table class="tbl"><caption class="sr">Monthly forecast</caption><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Recurring</th><th class="num">One-time</th><th class="num">To goals</th><th class="num">End balance</th></tr></thead><tbody>${fc.map((r) => `<tr class="${r.end < 0 ? "neg" : ""}"><td>${fmtMonth(r.ms, true)}${r.onceList.length ? `<br><small style="color:var(--muted)">${r.onceList.map((e) => esc(e.name)).join(", ")}</small>` : ""}</td><td class="num">${money(r.inc)}</td><td class="num">${money(r.rec)}</td><td class="num">${r.once ? money(r.once) : "–"}</td><td class="num">${money(r.contrib)}</td><td class="num"><b>${money(r.end)}</b></td></tr>`).join("")}</tbody></table></div></section></div>`;
  };
  V.suggestions = () => { const s = suggestions(); return `<div class="page"><div class="ph"><div><h1>Suggestions for ${s.next}</h1><p>Personalized from your income, expenses, goals and forecast. They update as you edit your plan.</p></div></div><ul class="sugs" data-sugs>${s.list.map(sugHtml).join("") || `<p class="empty">Nothing to suggest. Your plan looks balanced.</p>`}</ul><p style="font-size:13px;color:var(--muted);margin-top:16px">Guidance only, not financial advice. Benchmarks are common rules of thumb.</p></div>`; };

  /* ---------- router ---------- */
  let cur = "";
  function route() {
    const r = (location.hash.match(/^#\/(\w+)/) || [])[1] || "dashboard", tab = V[r] ? r : "dashboard";
    const y = cur === tab ? scrollY : 0;
    view.innerHTML = V[tab](); view.dataset.route = tab;
    $$("[data-tab]").forEach((a) => (a.dataset.tab === tab ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    document.title = `${tab[0].toUpperCase() + tab.slice(1)} — Planwise`;
    const line = $("[data-line]", view); if (line && !line.hidden) lineChart(line, forecast(), tab === "forecast" ? 340 : 260);
    const bars = $("[data-bars]", view); if (bars) barChart(bars, byCat());
    if (cur !== tab) { scrollTo(0, 0); if (cur) view.focus({ preventScroll: true }); } else scrollTo(0, y);
    cur = tab;
  }
  addEventListener("hashchange", route);
  const rerender = () => { save(); route(); };

  /* ---------- editing ---------- */
  view.addEventListener("change", (e) => { if (e.target.matches("[data-bal]")) { const v = parseFloat(e.target.value); if (isFinite(v)) { plan.balance = Math.round(v * 100) / 100; rerender(); toast("Balance updated"); $("[data-bal]")?.focus(); } } });
  view.addEventListener("click", (e) => {
    const t = e.target.closest("[data-new],[data-edit],[data-del],[data-ef],[data-fct],[data-contrib]"); if (!t) return;
    const row = t.closest("[data-row]"), id = row && row.dataset.row;
    if (t.dataset.ef) { expFilter = t.dataset.ef; route(); return; }
    if (t.hasAttribute("data-fct")) { fcTable = !fcTable; route(); $("[data-fct]").focus(); return; }
    if (t.hasAttribute("data-contrib")) return contribDlg(plan.goals.find((g) => g.id === id));
    const kind = t.dataset.new || t.dataset.edit || t.dataset.del, list = kind === "income" ? plan.income : kind === "expense" ? plan.expenses : plan.goals;
    if (t.dataset.del) { const item = list.find((x) => x.id === id); return confirmDlg(`Delete “${item.name}”?`, "This updates your forecast and suggestions.", "Delete", () => { list.splice(list.indexOf(item), 1); rerender(); toast(`Deleted ${item.name}`); }); }
    editDlg(kind, t.dataset.edit ? list.find((x) => x.id === id) : null);
  });
  const dlg = $("[data-dlg]"), dbody = $("[data-dlg-body]");
  let back = null;
  function openDlg(html, onSubmit) { back = document.activeElement; dbody.innerHTML = html; dbody.onsubmit = (e) => { if (e.submitter && e.submitter.value === "cancel") return; e.preventDefault(); onSubmit && onSubmit(); }; dlg.showModal(); ($("input, select", dbody) || $("button", dbody)).focus(); }
  dlg.addEventListener("close", () => { if (back && back.isConnected) back.focus({ preventScroll: true }); });
  const field = (n, l, v, type = "text", extra = "") => `<label class="f">${l}<input name="${n}" type="${type}" value="${esc(v ?? "")}" ${extra}><span class="e"></span></label>`;
  function bad(n, msg) { const el = dbody.elements[n]; if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); el.closest(".f").querySelector(".e").textContent = msg || ""; return !!msg; }
  function editDlg(kind, item) {
    const isNew = !item, title = `${isNew ? "Add" : "Edit"} ${kind === "goal" ? "goal" : kind}`;
    let body = "";
    if (kind === "income") body = field("name", "Name", item?.name, "text", 'placeholder="e.g. Salary" maxlength="60"') + `<div class="row2">${field("amount", "Amount ($)", item?.amount, "number", 'step="0.01" min="0" inputmode="decimal"')}<label class="f">Frequency<select name="freq">${Object.entries(FREQ).map(([k, [, l]]) => `<option value="${k}"${(item?.freq || "monthly") === k ? " selected" : ""}>${l}</option>`).join("")}</select></label></div>`;
    if (kind === "expense") body = `<div class="seg" role="radiogroup" aria-label="Expense type"><label><input type="radio" name="type" value="recurring"${(item?.type || "recurring") === "recurring" ? " checked" : ""}>Recurring</label><label><input type="radio" name="type" value="once"${item?.type === "once" ? " checked" : ""}>One-time</label></div>` + field("name", "Name", item?.name, "text", 'placeholder="e.g. Rent" maxlength="60"') + `<div class="row2">${field("amount", "Amount ($)", item?.amount, "number", 'step="0.01" min="0" inputmode="decimal"')}<label class="f">Category<select name="category">${CATS.map((c) => `<option${(item?.category || "Other") === c ? " selected" : ""}>${c}</option>`).join("")}</select></label></div><div data-when></div>`;
    if (kind === "goal") body = field("name", "Goal name", item?.name, "text", 'placeholder="e.g. Vacation to Hawaii" maxlength="60"') + `<div class="row2">${field("target", "Target amount ($)", item?.target, "number", 'step="1" min="1"')}${field("saved", "Saved so far ($)", item?.saved ?? 0, "number", 'step="1" min="0"')}</div>` + field("date", "Target date", item?.date || ymd(monthStart(12)), "date", `min="${ymd(monthStart(1))}"`);
    openDlg(`<h2 id="dlg-title">${title}</h2>${body}<div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">${isNew ? "Add" : "Save changes"}</button></div>`, () => {
      const f = dbody.elements, name = f.name.value.trim();
      let err = bad("name", name.length < 2 ? "Enter a name (2+ characters)" : "");
      if (kind === "goal") {
        const tg = parseFloat(f.target.value), sv = parseFloat(f.saved.value);
        err = bad("target", !(tg > 0) ? "Enter a target above $0" : "") || err; err = bad("saved", !(sv >= 0) ? "Enter $0 or more" : sv > tg ? "Can't exceed the target" : "") || err; err = bad("date", !f.date.value ? "Choose a date" : f.date.value < ymd(monthStart(1)) && isNew ? "Pick a date from next month on" : "") || err;
        if (err) return $("[aria-invalid=true]", dbody).focus();
        Object.assign(item || (plan.goals.push({ id: uid() }), plan.goals[plan.goals.length - 1]), { name, target: tg, saved: sv, date: f.date.value });
      } else {
        const amt = parseFloat(f.amount.value); err = bad("amount", !(amt > 0) ? "Enter an amount above $0" : "") || err;
        if (kind === "expense") { const once = f.type.value === "once"; if (once) err = bad("date", !f.date.value ? "Choose a date" : "") || err; else err = bad("day", !(+f.day.value >= 1 && +f.day.value <= 31) ? "Day 1–31" : "") || err; }
        if (err) return $("[aria-invalid=true]", dbody).focus();
        const list = kind === "income" ? plan.income : plan.expenses, target = item || (list.push({ id: uid() }), list[list.length - 1]);
        if (kind === "income") Object.assign(target, { name, amount: Math.round(amt * 100) / 100, freq: f.freq.value });
        else { const once = f.type.value === "once"; Object.assign(target, { name, amount: Math.round(amt * 100) / 100, category: f.category.value, type: once ? "once" : "recurring" }); if (once) { target.date = f.date.value; delete target.day; } else { target.day = +f.day.value; delete target.date; } }
      }
      dlg.close(); rerender(); toast(`${isNew ? "Added" : "Saved"} ${name}`);
    });
    if (kind === "expense") { const when = () => { const once = dbody.elements.type.value === "once"; $("[data-when]", dbody).innerHTML = once ? field("date", "Date", item?.date || ymd(monthStart(1)), "date") : field("day", "Due day of month", item?.day || 1, "number", 'min="1" max="31" step="1"'); }; $$("[name=type]", dbody).forEach((r) => r.addEventListener("change", when)); when(); }
  }
  function contribDlg(g) {
    openDlg(`<h2 id="dlg-title">Add savings to “${esc(g.name)}”</h2><p style="margin:0;color:var(--muted)">Saved ${money(g.saved)} of ${money(g.target)}.</p>${field("amt", "Amount ($)", "", "number", 'step="1" min="1"')}<label class="f" style="flex-direction:row;display:flex;gap:8px;align-items:center;font-weight:500"><input type="checkbox" name="frombal" checked style="width:18px;height:18px;min-height:0">Take it from my current balance (${money(plan.balance)})</label><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn" type="submit">Add savings</button></div>`, () => {
      const a = parseFloat(dbody.elements.amt.value); if (bad("amt", !(a > 0) ? "Enter an amount above $0" : "")) return dbody.elements.amt.focus();
      const add = Math.min(a, g.target - g.saved); g.saved = Math.round((g.saved + add) * 100) / 100; if (dbody.elements.frombal.checked) plan.balance = Math.round((plan.balance - add) * 100) / 100;
      dlg.close(); rerender(); toast(g.saved >= g.target ? `Goal reached: ${g.name}!` : `Added ${money(add)} to ${g.name}`);
    });
  }
  function confirmDlg(t, d, ok, fn) { openDlg(`<h2 id="dlg-title">${esc(t)}</h2><p style="margin:0">${esc(d)}</p><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn-d" type="submit">${ok}</button></div>`, () => { dlg.close(); fn(); }); }

  /* ---------- save / load / export ---------- */
  function download(name, type, data) { const url = URL.createObjectURL(new Blob([data], { type })), a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  $("[data-save]").addEventListener("click", () => { download(`planwise-plan-${ymd(now)}.json`, "application/json", JSON.stringify({ ...plan, savedAt: new Date().toISOString() }, null, 2)); toast("Plan saved to a file"); });
  $("[data-csv]").addEventListener("click", () => {
    const q = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
    const rows = [["section", "name", "amount", "frequency_or_category", "day_or_date", "monthly_equivalent", "target", "saved"]];
    plan.income.forEach((i) => rows.push(["income", i.name, i.amount, FREQ[i.freq][1], "", (i.amount * FREQ[i.freq][0]).toFixed(2), "", ""]));
    plan.expenses.forEach((e) => rows.push([e.type === "once" ? "one-time expense" : "recurring expense", e.name, e.amount, e.category, e.type === "once" ? e.date : e.day, e.type === "once" ? "" : e.amount.toFixed(2), "", ""]));
    plan.goals.forEach((g) => rows.push(["goal", g.name, "", "", g.date, "", g.target, g.saved]));
    rows.push(["balance", "Current balance", plan.balance, "", "", "", "", ""]);
    download(`planwise-${ymd(now)}.csv`, "text/csv", rows.map((r) => r.map(q).join(",")).join("\n") + "\n"); toast("CSV exported");
  });
  const loadInput = $("[data-load]");
  $("[data-load-l]").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); loadInput.click(); } });
  loadInput.addEventListener("change", async () => {
    const file = loadInput.files[0]; loadInput.value = ""; if (!file) return;
    if (file.size > 1e6) return toast("That file is too large to be a plan", "err");
    let data; try { data = JSON.parse(await file.text()); } catch { return toast("Couldn't read that file. Is it a Planwise .json plan?", "err"); }
    if (!valid(data)) return toast("This file isn't a valid Planwise plan", "err");
    confirmDlg(`Load “${file.name}”?`, `It has ${data.income.length} income sources, ${data.expenses.length} expenses and ${data.goals.length} goals. Your current plan in this browser will be replaced.`, "Replace plan", () => {
      plan = { version: 1, currency: "USD", balance: data.balance, income: data.income.map((x) => ({ ...x, id: x.id || uid() })), expenses: data.expenses.map((x) => ({ ...x, id: x.id || uid() })), goals: data.goals.map((x) => ({ ...x, id: x.id || uid() })) };
      rerender(); toast(`Loaded ${file.name}`);
    });
  });
  $("[data-reset]").addEventListener("click", () => openDlg(`<h2 id="dlg-title">Reset your plan</h2><p style="margin:0">Choose how to start over. Save your plan to a file first if you want to keep it.</p><div class="acts" style="flex-wrap:wrap"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn-o" type="submit" value="sample" data-r="sample">Load sample plan</button><button class="btn-d" type="submit" value="empty" data-r="empty">Start empty</button></div>`, () => {}));
  dbody.addEventListener("click", (e) => { const b = e.target.closest("[data-r]"); if (!b) return; e.preventDefault(); plan = b.dataset.r === "sample" ? sample() : empty(); dlg.close(); rerender(); toast(b.dataset.r === "sample" ? "Sample plan loaded" : "Started an empty plan"); });

  function toast(m, kind = "") { const t = document.createElement("div"); t.className = `toast ${kind}`; t.innerHTML = `${icon(kind === "err" ? "i-warn" : "i-check")}<span>${esc(m)}</span>`; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 3600); }

  route();
})();
