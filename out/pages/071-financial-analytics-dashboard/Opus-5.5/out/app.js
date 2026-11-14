(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const usd = (n, d = 0) => (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const pct = (n, d = 0) => (n * 100).toFixed(d) + "%";
  const uid = () => Math.random().toString(36).slice(2, 9);
  const view = $("[data-view]");
  const KEY = "quantleaf-data";
  const now = new Date(), ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`, day = (d) => `${ym}-${String(Math.min(d, 28)).padStart(2, "0")}`;
  const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  /* ---------- data model (mirrors the PRD entities: Transaction, Budget, PortfolioItem) ---------- */
  const CATS = ["Housing", "Food", "Utilities", "Transportation", "Insurance", "Health", "Subscriptions", "Entertainment", "Shopping", "Debt", "Other"];
  const FIXED = ["Housing", "Utilities", "Insurance", "Subscriptions", "Debt"];
  const CLASSES = ["Equities", "Bonds", "Real estate", "Commodities", "Crypto", "Cash"]; // fixed categorical order → series-1..6
  const VOL = { Equities: 16, Bonds: 5, "Real estate": 18, Commodities: 15, Crypto: 65, Cash: 0.5 };
  const INK = { Equities: "light", Bonds: "light", "Real estate": "dark", Commodities: "dark", Crypto: "dark", Cash: "light" };
  function seed() {
    const t = (d, desc, amount, type, category) => ({ id: uid(), date: day(d), desc, amount, type, category });
    return {
      transactions: [t(1, "Paycheck", 2600, "income", "Salary"), t(15, "Paycheck", 2600, "income", "Salary"), t(9, "Freelance invoice", 450, "income", "Freelance"),
        t(1, "Rent", 1800, "expense", "Housing"), t(3, "Grocery store", 142.5, "expense", "Food"), t(10, "Grocery store", 168.2, "expense", "Food"), t(17, "Grocery store", 131.9, "expense", "Food"), t(12, "Dinner out", 96, "expense", "Food"), t(19, "Lunch with team", 48, "expense", "Food"),
        t(5, "Electric & water", 132, "expense", "Utilities"), t(6, "Internet", 70, "expense", "Utilities"), t(8, "Transit pass", 127, "expense", "Transportation"), t(14, "Rideshare", 64, "expense", "Transportation"), t(2, "Health insurance", 160, "expense", "Insurance"),
        t(4, "Streaming", 23, "expense", "Subscriptions"), t(4, "Cloud storage", 10, "expense", "Subscriptions"), t(11, "Concert tickets", 140, "expense", "Entertainment"), t(16, "Running shoes", 135, "expense", "Shopping"), t(18, "Pharmacy", 34, "expense", "Health"), t(20, "Student loan", 310, "expense", "Debt")],
      budgets: { Housing: 1800, Food: 600, Utilities: 220, Transportation: 220, Insurance: 160, Health: 80, Subscriptions: 40, Entertainment: 120, Shopping: 200, Debt: 310 },
      portfolio: [{ id: uid(), ticker: "VTI", name: "US total stock market", weight: 40, cls: "Equities" }, { id: uid(), ticker: "VXUS", name: "International stocks", weight: 15, cls: "Equities" }, { id: uid(), ticker: "BND", name: "US aggregate bonds", weight: 25, cls: "Bonds" }, { id: uid(), ticker: "VNQ", name: "Real estate (REITs)", weight: 8, cls: "Real estate" }, { id: uid(), ticker: "GLD", name: "Gold", weight: 5, cls: "Commodities" }, { id: uid(), ticker: "BTC", name: "Bitcoin", weight: 4, cls: "Crypto" }, { id: uid(), ticker: "CASH", name: "Money market", weight: 3, cls: "Cash" }]
    };
  }
  let data; try { data = JSON.parse(localStorage.getItem(KEY)); } catch { data = null; }
  if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.portfolio)) data = seed();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* unavailable */ } };
  save();

  /* ---------- finance analytics ---------- */
  function fin() {
    const tx = data.transactions.filter((t) => t.date.startsWith(ym));
    const income = tx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), exp = tx.filter((t) => t.type === "expense");
    const expenses = exp.reduce((s, t) => s + t.amount, 0), byCat = {};
    exp.forEach((t) => (byCat[t.category] = (byCat[t.category] || 0) + t.amount));
    const fixed = exp.filter((t) => FIXED.includes(t.category)).reduce((s, t) => s + t.amount, 0);
    const budgeted = Object.entries(data.budgets).filter(([, v]) => v > 0), within = budgeted.filter(([c, v]) => (byCat[c] || 0) <= v).length;
    const savingsRate = income ? (income - expenses) / income : 0, fixedRatio = income ? fixed / income : 1;
    const p1 = Math.max(0, Math.min(40, (savingsRate / 0.2) * 40)), p2 = fixedRatio <= 0.5 ? 30 : Math.max(0, 30 * (1 - (fixedRatio - 0.5) / 0.3)), p3 = budgeted.length ? (within / budgeted.length) * 30 : 15;
    const score = Math.round(p1 + p2 + p3);
    return { tx, income, expenses, byCat: Object.entries(byCat).sort((a, b) => b[1] - a[1]), byCatMap: byCat, fixed, savingsRate, fixedRatio, within, budgeted: budgeted.length, parts: [p1, p2, p3], score, label: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs attention" };
  }
  /* ---------- portfolio risk ---------- */
  function risk() {
    const P = data.portfolio, total = P.reduce((s, p) => s + p.weight, 0), w = P.map((p) => p.weight / 100);
    let v2 = 0; P.forEach((a, i) => P.forEach((b, j) => { const rho = i === j ? 1 : a.cls === "Cash" || b.cls === "Cash" ? 0 : a.cls === b.cls ? 0.85 : 0.3; v2 += w[i] * w[j] * VOL[a.cls] * VOL[b.cls] * rho; }));
    const vol = Math.sqrt(Math.max(0, v2)), score = Math.max(1, Math.min(10, Math.round(vol / 2.5)));
    const byCls = CLASSES.map((c) => [c, P.filter((p) => p.cls === c).reduce((s, p) => s + p.weight, 0)]).filter(([, v]) => v > 0);
    const hhi = w.reduce((s, x) => s + x * x, 0), largest = P.reduce((a, p) => (p.weight > (a?.weight || 0) ? p : a), null);
    const warnings = [];
    P.filter((p) => p.weight > 25).forEach((p) => warnings.push(`${p.ticker} is ${p.weight}% of the portfolio (above a 25% single-holding guideline).`));
    byCls.filter(([, v]) => v > 70).forEach(([c, v]) => warnings.push(`${c} make up ${v}% (above 70% in one asset class).`));
    const crypto = byCls.find(([c]) => c === "Crypto"); if (crypto && crypto[1] > 10) warnings.push(`Crypto is ${crypto[1]}%, a highly volatile class (above 10%).`);
    return { total, vol, score, label: score <= 3 ? "Conservative" : score <= 6 ? "Moderate" : score <= 8 ? "Growth" : "Aggressive", byCls, hhi, effN: hhi ? 1 / hhi : 0, largest, warnings };
  }

  /* ---------- order book: price-time priority matching engine ---------- */
  const Engine = (() => {
    let bids = [], asks = [], trades = [], seq = 0, last = null;
    const cents = (p) => Math.round(p * 100);
    function seedBook() {
      bids = []; asks = []; trades = []; seq = 0; last = null;
      const r = ((s) => () => ((s = (s * 16807) % 2147483647) / 2147483647))(4242);
      for (let i = 0; i < 10; i++) { add({ side: "sell", price: 10005 + i * 5, qty: 10 + Math.floor(r() * 60), owner: "mm" }); add({ side: "buy", price: 9995 - i * 5, qty: 10 + Math.floor(r() * 60), owner: "mm" }); }
      add({ side: "sell", price: 10005, qty: 15, owner: "mm" });
    }
    function add(o) { const ord = { id: "O" + (++seq), ts: seq, rem: o.qty, status: "open", fills: 0, ...o }; (o.side === "buy" ? bids : asks).push(ord); sort(); return ord; }
    function sort() { bids.sort((a, b) => b.price - a.price || a.ts - b.ts); asks.sort((a, b) => a.price - b.price || a.ts - b.ts); }
    function submit({ side, price, qty, owner }) {
      const o = { id: "O" + (++seq), ts: seq, side, price, qty, rem: qty, owner, status: "open", fills: 0 }, book = side === "buy" ? asks : bids, fills = [];
      while (o.rem > 0 && book.length && (side === "buy" ? book[0].price <= o.price : book[0].price >= o.price)) {
        const rest = book[0], q = Math.min(o.rem, rest.rem);
        o.rem -= q; rest.rem -= q; o.fills += q; rest.fills += q;
        const t = { id: "T" + (trades.length + 1), price: rest.price, qty: q, aggressor: side, buyId: side === "buy" ? o.id : rest.id, sellId: side === "sell" ? o.id : rest.id, buyer: side === "buy" ? owner : rest.owner, seller: side === "sell" ? owner : rest.owner, time: new Date() };
        trades.unshift(t); fills.push(t); last = rest.price;
        if (!rest.rem) { rest.status = "filled"; book.shift(); } else rest.status = "partial";
      }
      if (o.rem > 0) { o.status = o.fills ? "partial" : "open"; (side === "buy" ? bids : asks).push(o); sort(); } else o.status = "filled";
      return { order: o, fills };
    }
    function cancel(id) { for (const b of [bids, asks]) { const i = b.findIndex((o) => o.id === id); if (i >= 0) { b[i].status = "canceled"; return b.splice(i, 1)[0]; } } return null; }
    const levels = (b, n) => { const m = new Map(); b.forEach((o) => m.set(o.price, (m.get(o.price) || 0) + o.rem)); return [...m.entries()].slice(0, n).map(([p, q]) => ({ price: p, qty: q, mine: b.some((o) => o.price === p && o.owner === "you") })); };
    seedBook();
    return { submit, cancel, cents, seed: seedBook, get bids() { return bids; }, get asks() { return asks; }, get trades() { return trades; }, get last() { return last; }, depth: (n = 10) => ({ bids: levels(bids, n), asks: levels(asks, n) }) };
  })();
  window.__engine = Engine;
  const myOrders = [];

  /* ---------- small chart helpers (dataviz method) ---------- */
  function hbars(box, rows) {
    if (!rows.length) { box.innerHTML = `<p class="empty">No expenses this month.</p>`; return; }
    const W = Math.max(280, box.clientWidth), rowH = 32, l = 112, r = 76, H = rows.length * rowH + 8, max = Math.max(...rows.map((x) => x[1])), iw = W - l - r;
    box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Spending by category this month: ${rows.map(([c, v]) => `${c} ${usd(v)}`).join(", ")}">${rows.map(([c, v], i) => { const y = 4 + i * rowH + 6, w = Math.max(2, (v / max) * iw), rr = Math.min(4, w); return `<g><text class="ax" x="${l - 10}" y="${y + 14}" text-anchor="end">${c}</text><path class="bar1" d="M${l} ${y}H${l + w - rr}Q${l + w} ${y} ${l + w} ${y + rr}V${y + 20 - rr}Q${l + w} ${y + 20} ${l + w - rr} ${y + 20}H${l}Z"/><text class="vl" x="${l + w + 8}" y="${y + 14}">${usd(v)}</text><title>${c}: ${usd(v, 2)}</title></g>`; }).join("")}</svg>`;
  }
  function line(box, pts) {
    if (pts.length < 2) { box.innerHTML = `<p class="empty" style="margin:0">Trades will chart here once the book matches orders.</p>`; return; }
    const W = Math.max(280, box.clientWidth), H = 180, m = { l: 52, r: 56, t: 14, b: 22 }, iw = W - m.l - m.r, ih = H - m.t - m.b;
    let lo = Math.min(...pts), hi = Math.max(...pts); if (hi - lo < 10) { lo -= 5; hi += 5; }
    const x = (i) => m.l + (i / (pts.length - 1)) * iw, y = (v) => m.t + ih - ((v - lo) / (hi - lo)) * ih, d = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(" ");
    let s = `<svg viewBox="0 0 ${W} ${H}" height="${H}" role="img" aria-label="Last ${pts.length} trade prices, from ${(pts[0] / 100).toFixed(2)} to ${(pts[pts.length - 1] / 100).toFixed(2)}">`;
    [lo, (lo + hi) / 2, hi].forEach((v) => (s += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${m.l - 6}" y="${y(v) + 4}" text-anchor="end">${(v / 100).toFixed(2)}</text>`));
    s += `<path class="ln" d="${d}"/><circle cx="${x(pts.length - 1)}" cy="${y(pts[pts.length - 1])}" r="4" fill="var(--series-1)" stroke="var(--surface-1)" stroke-width="2"/><text class="vl" x="${x(pts.length - 1) + 8}" y="${y(pts[pts.length - 1]) + 4}">${(pts[pts.length - 1] / 100).toFixed(2)}</text></svg>`;
    box.innerHTML = s;
  }
  const meterRow = (name, val, lim, fig, aria) => { const scale = Math.max(val, lim) * 1.15 || 1, ratio = lim ? val / lim : 0, sev = ratio > 1 ? "critical" : ratio >= 0.9 ? "warning" : ""; return `<li class="meter-row"><span class="nm">${esc(name)}</span><span class="track ${sev}" role="meter" aria-label="${esc(aria)}" aria-valuemin="0" aria-valuemax="${Math.round(scale)}" aria-valuenow="${Math.round(val)}"><i style="width:${(val / scale) * 100}%"></i><span class="lim" style="left:${(lim / scale) * 100}%" title="Limit"></span></span><span class="fig">${fig}${sev ? ` <span class="st ${sev}">${icon("i-warn")}${sev === "critical" ? "Over" : "Near"}</span>` : ""}</span></li>`; };

  /* ---------- views ---------- */
  const V = {};
  V.home = () => `<div class="page"><section class="hero"><div><span class="pill" style="background:rgba(255,255,255,.1);color:#CBD5E1">Educational FinTech platform</span><h1 style="margin-top:14px">Money, risk and markets, explained by building them.</h1><p>Track spending and a financial health score, stress-test a portfolio's risk, ask an assistant to explain your numbers, and trade against a real price-time priority matching engine.</p><div class="ctas"><a class="btn" href="#/dashboard">Open the dashboard${icon("i-arrow")}</a><a class="btn-o" href="#/trading">Try the order book</a></div></div>
      <div class="stack" aria-label="Reference architecture"><div>${icon("i-code")}<span><b>Next.js + React</b>Frontend pages: dashboard, portfolio, assistant, trading</span></div><div>${icon("i-db")}<span><b>FastAPI + PostgreSQL</b>Transactions, budgets, portfolio items, orders, trades</span></div><div>${icon("i-shield")}<span><b>LLM with guardrails</b>Summarized, anonymized context; educational only</span></div></div></section>
    <div class="features">${[["dashboard", "i-dash", "Personal finance", "Income and expense CRUD, category totals, budget vs actual and a 0–100 health score.", ["Savings rate", "Fixed vs variable costs", "Budget adherence"]], ["portfolio", "i-pie", "Portfolio risk", "Allocate assets to 100%, see concentration by class and holding, and a volatility-based risk score.", ["Correlation-aware volatility", "Concentration warnings", "Effective number of holdings"]], ["ai", "i-bot", "AI assistant", "Ask about your spending, budget or risk and get context-aware, educational explanations.", ["Context preview", "Investment-advice guardrails", "Disclaimers on every answer"]], ["trading", "i-book", "Order book simulator", "Place limit orders and watch them match by price, then time. Includes depth, spread and trade history.", ["Partial fills", "Cancel resting orders", "Simulated market makers"]]].map(([r, ic, t, d, li]) => `<a class="feat" href="#/${r}">${icon(ic)}<h3>${t}</h3><p>${d}</p><ul>${li.map((x) => `<li>${x}</li>`).join("")}</ul><span class="go">Open${icon("i-arrow")}</span></a>`).join("")}</div>
    <section class="card cv"><h2>What this project demonstrates</h2><ul><li><b>Full-stack engineering:</b> typed APIs and stateful UIs across five modules.</li><li><b>Algorithms:</b> a price-time priority limit order book with partial fills.</li><li><b>Data modeling:</b> User, Transaction, Budget, PortfolioItem, Order and Trade entities.</li><li><b>Safe AI integration:</b> summarized context, refusal rules and mandatory disclaimers.</li></ul></section></div>`;
  let txFilter = "all";
  V.dashboard = () => {
    const f = fin(), list = f.tx.filter((t) => txFilter === "all" || t.type === txFilter).sort((a, b) => b.date.localeCompare(a.date));
    return `<div class="page"><div class="ph"><div><h1>Personal finance</h1><p>${monthName} · ${f.tx.length} transactions</p></div><button class="btn acc" type="button" data-addtx>${icon("i-plus")}Add transaction</button></div>
      <div class="kpis"><div class="kpi"><span>Income</span><b data-k-inc>${usd(f.income)}</b><small>this month</small></div><div class="kpi"><span>Expenses</span><b data-k-exp>${usd(f.expenses)}</b><small>${pct(f.fixed / (f.expenses || 1))} of spending is fixed</small></div><div class="kpi"><span>Saved</span><b data-k-net>${usd(f.income - f.expenses)}</b><small>savings rate ${pct(f.savingsRate)}</small></div><div class="kpi"><span>Health score</span><b data-k-score>${f.score}<small style="font-size:14px"> / 100</small></b><small>${f.label}</small></div></div>
      <div class="g2"><section class="card"><div class="card-h"><div><h2>Financial health score</h2><p>Savings rate (40) + fixed-cost ratio (30) + budget adherence (30)</p></div></div><div class="score"><div class="big" data-score>${f.score}<small>/100</small></div><ul class="parts"><li><span>Savings rate ${pct(f.savingsRate)} <b>${Math.round(f.parts[0])}/40</b></span></li><li><span>Fixed costs ${pct(f.fixedRatio)} of income <b>${Math.round(f.parts[1])}/30</b></span></li><li><span>${f.within} of ${f.budgeted} budgets on track <b>${Math.round(f.parts[2])}/30</b></span></li></ul></div></section>
        <section class="card"><div class="card-h"><div><h2>Spending by category</h2><p>${monthName}, auto-summed</p></div></div><div class="chart" data-hbars></div></section></div>
      <section class="card" style="margin-bottom:16px"><div class="card-h"><div><h2>Budget: target vs actual</h2><p>Black tick = monthly target. Amber at 90%+, red when over.</p></div><button class="btn-o sm" type="button" data-budgets>${icon("i-edit")}Edit budgets</button></div><ul class="meters" data-meters>${Object.entries(data.budgets).filter(([, v]) => v > 0).map(([c, v]) => meterRow(c, f.byCatMap[c] || 0, v, `${usd(f.byCatMap[c] || 0)} / ${usd(v)}`, `${c}: ${usd(f.byCatMap[c] || 0)} of ${usd(v)} budget`)).join("")}</ul></section>
      <section class="card"><div class="card-h"><h2>Transactions</h2><div class="chips" role="group" aria-label="Filter transactions" style="margin:0">${[["all", "All"], ["income", "Income"], ["expense", "Expenses"]].map(([k, l]) => `<button type="button" aria-pressed="${k === txFilter}" data-txf="${k}" style="${k === txFilter ? "background:#0B1220;color:#fff;border-color:#0B1220" : ""}">${l}</button>`).join("")}</div></div>
        ${list.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Description</th><th class="hide-sm">Category</th><th class="r">Amount</th><th class="r"><span class="sr">Actions</span></th></tr></thead><tbody>${list.map((t) => `<tr data-tx="${t.id}"><td class="mono">${t.date.slice(5)}</td><td>${esc(t.desc)}</td><td class="hide-sm"><span class="pill">${esc(t.category)}</span></td><td class="r mono ${t.type === "income" ? "in" : "out"}">${t.type === "income" ? "+" : "−"}${usd(t.amount, 2).replace("−", "")}</td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Edit ${esc(t.desc)}" data-etx>${icon("i-edit")}</button><button class="icon-btn" type="button" aria-label="Delete ${esc(t.desc)}" data-dtx>${icon("i-trash")}</button></div></td></tr>`).join("")}</tbody></table></div>` : `<p class="empty">No transactions in this view.</p>`}</section></div>`;
  };
  let allocTable = false;
  V.portfolio = () => {
    const r = risk(), ok = Math.abs(r.total - 100) < 0.01;
    return `<div class="page"><div class="ph"><div><h1>Portfolio risk analyzer</h1><p>${data.portfolio.length} holdings · weights must total 100%</p></div><button class="btn acc" type="button" data-addasset>${icon("i-plus")}Add asset</button></div>
      ${ok ? "" : `<p class="card" role="alert" style="margin-bottom:16px;border-color:#FDE68A;background:#FFFBEB"><span class="st warning">${icon("i-warn")}Allocation totals ${r.total}%</span> Adjust weights so they add up to exactly 100% (${r.total < 100 ? `${(100 - r.total).toFixed(1)}% unallocated` : `${(r.total - 100).toFixed(1)}% over`}). Risk figures are estimates until then.</p>`}
      <div class="kpis"><div class="kpi"><span>Risk score</span><b data-risk>${r.score}<small style="font-size:14px"> / 10</small></b><small>${r.label}</small></div><div class="kpi"><span>Est. annual volatility</span><b data-vol>${r.vol.toFixed(1)}%</b><small>class-based, ρ = 0.3 across classes</small></div><div class="kpi"><span>Largest holding</span><b>${r.largest ? esc(r.largest.ticker) : "–"}</b><small>${r.largest ? r.largest.weight + "%" : ""}</small></div><div class="kpi"><span>Effective holdings</span><b>${r.effN.toFixed(1)}</b><small>1 / Σ weight² (HHI ${r.hhi.toFixed(2)})</small></div></div>
      <section class="card" style="margin-bottom:16px"><div class="card-h"><div><h2>Asset class allocation</h2><p>Share of portfolio by class</p></div><button class="btn-o sm" type="button" aria-pressed="${allocTable}" data-alloct>${icon("i-table")}${allocTable ? "Show chart" : "Show table"}</button></div>
        ${allocTable ? `<div class="tbl-wrap" data-alloc-table><table class="tbl"><thead><tr><th>Asset class</th><th class="r">Weight</th><th class="r">Assumed volatility</th></tr></thead><tbody>${r.byCls.map(([c, v]) => `<tr><td>${c}</td><td class="r mono">${v}%</td><td class="r mono">${VOL[c]}%</td></tr>`).join("")}</tbody></table></div>`
        : `<div class="seg" role="img" aria-label="Allocation by asset class: ${r.byCls.map(([c, v]) => `${c} ${v}%`).join(", ")}" data-seg>${r.byCls.map(([c, v]) => `<div class="${INK[c]}" style="flex:${v} 1 0;background:var(--series-${CLASSES.indexOf(c) + 1})" tabindex="0" title="${c}: ${v}%" aria-label="${c} ${v}%">${v >= 7 ? `${v}%` : ""}</div>`).join("")}</div><ul class="legend">${r.byCls.map(([c]) => `<li><i style="background:var(--series-${CLASSES.indexOf(c) + 1})"></i>${c}</li>`).join("")}</ul>`}</section>
      <div class="g3"><section class="card"><div class="card-h"><div><h2>Holdings</h2><p>Black tick = 25% single-holding guideline</p></div></div><ul class="meters" data-holdings>${data.portfolio.slice().sort((a, b) => b.weight - a.weight).map((p) => meterRow(p.ticker, p.weight, 25, `${p.weight}% · ${p.cls}`, `${p.ticker} ${p.weight}% of portfolio`)).join("")}</ul>
          <div class="tbl-wrap" style="margin-top:16px"><table class="tbl"><thead><tr><th>Ticker</th><th class="hide-sm">Name</th><th>Class</th><th class="r">Weight</th><th class="r"><span class="sr">Actions</span></th></tr></thead><tbody>${data.portfolio.map((p) => `<tr data-asset="${p.id}"><td class="mono"><b>${esc(p.ticker)}</b></td><td class="hide-sm">${esc(p.name)}</td><td>${p.cls}</td><td class="r"><label class="sr" for="w-${p.id}">Weight of ${esc(p.ticker)}</label><input id="w-${p.id}" class="mono" type="number" min="0" max="100" step="0.5" value="${p.weight}" data-weight style="width:76px;min-height:36px;padding:0 6px;border:1px solid #CBD5E1;border-radius:8px;text-align:right"></td><td><div class="acts"><button class="icon-btn" type="button" aria-label="Remove ${esc(p.ticker)}" data-dasset>${icon("i-trash")}</button></div></td></tr>`).join("")}</tbody><tfoot><tr><th colspan="3">Total</th><th class="r mono" data-total style="color:${ok ? "var(--good)" : "var(--critical)"}">${r.total}%</th><th></th></tr></tfoot></table></div></section>
        <section class="card"><h2>Risk notes</h2>${r.warnings.length ? `<ul class="meters" style="margin-top:12px" data-warnings>${r.warnings.map((w) => `<li><span class="st warning">${icon("i-warn")}Concentration</span><br>${esc(w)}</li>`).join("")}</ul>` : `<p style="margin:12px 0 0"><span class="st good">${icon("i-check")}No concentration flags</span><br>No holding above 25%, no class above 70%, crypto at or below 10%.</p>`}
          <p style="font-size:13px;color:var(--muted);margin-top:16px">Method: each asset class gets a typical annual volatility (equities 16%, bonds 5%, real estate 18%, commodities 15%, crypto 65%, cash 0.5%). Portfolio volatility assumes 0.3 correlation across classes and 0.85 within a class. Score = volatility ÷ 2.5, clamped to 1–10.</p></section></div></div>`;
  };
  V.ai = () => `<div class="page"><div class="ph"><div><h1>Financial assistant</h1><p>Context-aware, educational explanations of your dashboard and portfolio</p></div><button class="btn-o sm" type="button" data-ctx>${icon("i-db")}View context sent</button></div>
    <div class="g3"><section class="card chat"><div class="log" data-log aria-live="polite"></div><div><div class="chips" data-chips>${["How am I doing this month?", "Where does my money go?", "Am I over budget?", "How risky is my portfolio?", "Explain the order book", "Should I buy Bitcoin?"].map((q) => `<button type="button" data-ask>${q}</button>`).join("")}</div><form class="composer" data-chat><label class="sr" for="ask">Ask the assistant</label><input id="ask" autocomplete="off" placeholder="Ask about spending, budgets, savings or risk…" maxlength="300"><button class="btn acc" type="submit" aria-label="Send">${icon("i-send")}</button></form></div></section>
      <section class="card"><h2>How it works</h2><ol style="padding-left:18px;font-size:14px;margin:12px 0 0;display:grid;gap:8px"><li>Your data is <b>summarized and anonymized</b> (totals and percentages, no descriptions).</li><li>In the full stack, that summary plus your question goes to <code>POST /api/v1/ai/insight</code> and an LLM.</li><li><b>Guardrails:</b> no buy/sell/hold recommendations for specific securities, and every answer ends with an educational disclaimer.</li></ol><p class="pill" style="margin-top:14px;background:#FEF3C7;color:#92400E">Demo: answers come from a local rule-based engine, not a live LLM.</p></section></div></div>`;
  let bots = null;
  V.trading = () => `<div class="page"><div class="ph"><div><h1>Order book simulator</h1><p>Symbol <b class="mono">DEMO</b> · price-time priority · simulated market makers</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn-o sm" type="button" aria-pressed="${!!bots}" data-bots>${icon(bots ? "i-pause" : "i-play")}${bots ? "Pause market" : "Start market simulation"}</button><button class="btn-o sm" type="button" data-resetbook>Reset book</button></div></div>
    <div class="trade"><section class="card"><h2>New limit order</h2><form class="oform" novalidate data-order style="margin-top:12px"><div class="sideseg" role="radiogroup" aria-label="Side"><label><input type="radio" name="side" value="buy" checked>Buy</label><label><input type="radio" name="side" value="sell">Sell</label></div>
        <label class="f">Limit price<input name="price" class="mono" inputmode="decimal" placeholder="100.00"><span class="e"></span></label><label class="f">Quantity<input name="qty" class="mono" inputmode="numeric" placeholder="10"><span class="e"></span></label><button class="btn" type="submit" data-submit>Place order</button><p class="msg" role="status" data-omsg></p></form>
        <h3 style="font-size:15px;margin-top:18px">Your orders</h3><div data-mine></div></section>
      <section class="card"><div class="card-h"><h2>Order book</h2><span class="pill mono" data-last></span></div><div data-book></div></section>
      <section class="card"><h2>Trades</h2><div class="chart" data-tline style="margin:12px 0"></div><div class="tbl-wrap" style="max-height:300px;overflow-y:auto"><table class="tbl"><thead><tr><th>Time</th><th>Side</th><th class="r">Price</th><th class="r">Qty</th></tr></thead><tbody data-trades></tbody></table></div></section></div></div>`;

  function renderBook() {
    const d = Engine.depth(8), maxQ = Math.max(1, ...d.bids.map((x) => x.qty), ...d.asks.map((x) => x.qty)), bb = Engine.bids[0], ba = Engine.asks[0];
    const row = (l, side) => `<tr class="${side}"><td>${(l.price / 100).toFixed(2)}${l.mine ? `<span class="tag">YOU</span>` : ""}</td><td>${l.qty}<span class="depth" style="width:${(l.qty / maxQ) * 100}%"></span></td></tr>`;
    const box = $("[data-book]"); if (!box) return;
    box.innerHTML = `<table class="book" aria-label="Order book depth"><thead><tr><th>Ask price</th><th>Size</th></tr></thead><tbody>${d.asks.slice().reverse().map((l) => row(l, "ask")).join("")}</tbody></table><div class="spread" data-spread><span>Spread</span>${bb && ba ? ((ba.price - bb.price) / 100).toFixed(2) : "–"}<span>Mid</span>${bb && ba ? ((ba.price + bb.price) / 200).toFixed(3) : "–"}</div><table class="book"><thead class="sr"><tr><th>Bid price</th><th>Size</th></tr></thead><tbody>${d.bids.map((l) => row(l, "bid")).join("")}</tbody></table><p style="font-size:12px;color:var(--muted);margin:8px 0 0">Orange rows are asks (sell), blue rows are bids (buy). Bars show size at each price.</p>`;
    $("[data-last]").textContent = Engine.last ? `Last ${(Engine.last / 100).toFixed(2)}` : "No trades yet";
    $("[data-trades]").innerHTML = Engine.trades.slice(0, 40).map((t) => `<tr><td class="mono">${t.time.toLocaleTimeString("en-US", { hour12: false })}</td><td><span class="st" style="color:${t.aggressor === "buy" ? "#1D5FB0" : "#B4461C"}">${t.aggressor === "buy" ? "Buy" : "Sell"}</span>${t.buyer === "you" || t.seller === "you" ? ' <span class="pill">You</span>' : ""}</td><td class="r mono">${(t.price / 100).toFixed(2)}</td><td class="r mono">${t.qty}</td></tr>`).join("") || `<tr><td colspan="4" style="color:var(--muted)">No trades yet.</td></tr>`;
    $("[data-mine]").innerHTML = myOrders.length ? `<table class="tbl"><thead><tr><th>Side</th><th class="r">Price</th><th class="r">Filled</th><th>Status</th><th><span class="sr">Cancel</span></th></tr></thead><tbody>${myOrders.slice().reverse().map((o) => `<tr data-oid="${o.id}"><td>${o.side === "buy" ? "Buy" : "Sell"}</td><td class="r mono">${(o.price / 100).toFixed(2)}</td><td class="r mono">${o.fills}/${o.qty}</td><td><span class="pill" data-status>${o.status}</span></td><td>${["open", "partial"].includes(o.status) ? `<button class="icon-btn" type="button" aria-label="Cancel order ${o.id}" data-cancel>${icon("i-x")}</button>` : ""}</td></tr>`).join("")}</tbody></table>` : `<p style="font-size:13px;color:var(--muted)">Orders you place appear here.</p>`;
    const tl = $("[data-tline]"); if (tl) line(tl, Engine.trades.slice(0, 60).reverse().map((t) => t.price));
  }
  function botTick() {
    const bb = Engine.bids[0], ba = Engine.asks[0], mid = bb && ba ? (bb.price + ba.price) / 2 : 10000, side = Math.random() < 0.5 ? "buy" : "sell";
    const off = Math.round((Math.random() * 30 - (Math.random() < 0.35 ? -8 : 12)) / 5) * 5, price = Math.round(side === "buy" ? mid - off : mid + off);
    Engine.submit({ side, price: Math.max(100, price), qty: 5 + Math.floor(Math.random() * 40), owner: "bot" });
    if (Engine.bids.length > 40) Engine.bids.splice(40); if (Engine.asks.length > 40) Engine.asks.splice(40);
    renderBook();
  }

  /* ---------- assistant (local rule engine with guardrails) ---------- */
  const DISC = "Educational information only, not financial advice.";
  function context() { const f = fin(), r = risk(); return { period: monthName, income_total: Math.round(f.income), expense_total: Math.round(f.expenses), savings_rate_pct: +(f.savingsRate * 100).toFixed(1), fixed_cost_ratio_pct: +(f.fixedRatio * 100).toFixed(1), health_score: f.score, spend_by_category_pct_of_income: Object.fromEntries(f.byCat.map(([c, v]) => [c, +((v / (f.income || 1)) * 100).toFixed(1)])), budgets_over: Object.entries(data.budgets).filter(([c, v]) => (f.byCatMap[c] || 0) > v).map(([c]) => c), portfolio: { total_weight_pct: r.total, risk_score: r.score, est_volatility_pct: +r.vol.toFixed(1), by_class_pct: Object.fromEntries(r.byCls), largest_holding_pct: r.largest ? r.largest.weight : 0, concentration_flags: r.warnings.length } }; }
  const RANGES = { Housing: [0.25, 0.35], Food: [0.1, 0.15], Transportation: [0.1, 0.15], Utilities: [0.05, 0.1], Entertainment: [0.03, 0.08], Shopping: [0.03, 0.08] };
  function answer(q) {
    const s = q.toLowerCase(), f = fin(), r = risk(), out = [];
    if (/\b(should i|buy|sell|short|invest in|good investment|price target|which stock|tip)\b/.test(s) && /\b(buy|sell|short|invest|stock|crypto|bitcoin|btc|eth|tsla|aapl|nvda|etf|coin|shares?)\b/.test(s)) {
      out.push("I can't recommend buying, selling or holding a specific security or coin. That would be personalized investment advice, which this educational tool doesn't give.");
      out.push(`What I can do is explain how it would affect your risk: your portfolio's estimated volatility is ${r.vol.toFixed(1)}% (risk score ${r.score}/10, ${r.label.toLowerCase()}). Adding a volatile asset like crypto raises volatility quickly; at 65% assumed volatility, every 5% you allocate adds noticeable swings. Try it in the Portfolio analyzer to see the effect.`);
    } else if (/order ?book|spread|bid|ask|matching|limit order|price.?time/.test(s)) {
      const bb = Engine.bids[0], ba = Engine.asks[0];
      out.push(`The order book lists resting limit orders: bids (buyers) sorted from the highest price, and asks (sellers) from the lowest. ${bb && ba ? `Right now the best bid is ${(bb.price / 100).toFixed(2)} and the best ask is ${(ba.price / 100).toFixed(2)}, a spread of ${((ba.price - bb.price) / 100).toFixed(2)}.` : ""}`);
      out.push("An incoming order matches against the best opposite price first. If several orders sit at that price, the oldest fills first: that's price-time priority. Any unfilled remainder rests in the book.");
    } else if (/risk|portfolio|diversif|allocation|volatil|concentrat/.test(s)) {
      out.push(`Your portfolio's estimated annual volatility is ${r.vol.toFixed(1)}%, a risk score of ${r.score}/10 (${r.label}). It's spread across ${r.byCls.length} asset classes with about ${r.effN.toFixed(1)} "effective" holdings.`);
      out.push(r.warnings.length ? `Concentration flags: ${r.warnings.join(" ")}` : "No concentration flags: no single holding above 25% and no asset class above 70%.");
      if (Math.abs(r.total - 100) > 0.01) out.push(`Note: your weights total ${r.total}%, so these figures are estimates until they add up to 100%.`);
    } else if (/budget|over|overspend/.test(s)) {
      const over = Object.entries(data.budgets).filter(([c, v]) => (f.byCatMap[c] || 0) > v), near = Object.entries(data.budgets).filter(([c, v]) => (f.byCatMap[c] || 0) <= v && (f.byCatMap[c] || 0) >= v * 0.9);
      out.push(over.length ? `You're over budget in ${over.map(([c, v]) => `${c} (${usd(f.byCatMap[c])} vs ${usd(v)}, ${usd(f.byCatMap[c] - v)} over)`).join(", ")}.` : "You're within budget in every category so far this month.");
      if (near.length) out.push(`Close to the limit: ${near.map(([c, v]) => `${c} (${Math.round(((f.byCatMap[c] || 0) / v) * 100)}%)`).join(", ")}.`);
      out.push(`Overall, ${f.within} of ${f.budgeted} budgets are on track, which contributes ${Math.round(f.parts[2])}/30 points to your health score.`);
    } else if (/where|spend|category|housing|rent|food|groceries|transport|money go/.test(s)) {
      const lines = f.byCat.slice(0, 4).map(([c, v]) => { const share = v / (f.income || 1), rg = RANGES[c]; return `${c}: ${usd(v)} (${pct(share)} of income)${rg ? `, ${share <= rg[1] ? `within the common ${pct(rg[0])}–${pct(rg[1])} range` : `above the common ${pct(rg[0])}–${pct(rg[1])} range`}` : ""}.`; });
      out.push(`Your biggest categories in ${monthName}:`); out.push(lines.join(" "));
      out.push(`Fixed costs (housing, utilities, insurance, subscriptions, debt) are ${pct(f.fixedRatio)} of income; under 50% leaves room for flexible spending and saving.`);
    } else if (/sav|how am i|doing|overview|summary|health|score/.test(s)) {
      out.push(`In ${monthName} you earned ${usd(f.income)} and spent ${usd(f.expenses)}, so you saved ${usd(f.income - f.expenses)}: a ${pct(f.savingsRate)} savings rate.`);
      out.push(`Your financial health score is ${f.score}/100 (${f.label}): savings ${Math.round(f.parts[0])}/40, fixed costs ${Math.round(f.parts[1])}/30, budgets ${Math.round(f.parts[2])}/30.`);
      out.push(f.savingsRate >= 0.2 ? "A savings rate of 20% or more is often cited as a healthy target, and you're there." : `Many guides suggest aiming for a 20% savings rate; you'd need about ${usd(f.income * 0.2 - (f.income - f.expenses))} more saved this month.`);
    } else {
      out.push("I can explain your monthly summary and health score, where your money goes, budget status, portfolio risk and concentration, and how the order book works. Try one of the suggestions below.");
    }
    return out;
  }
  function chat(q) {
    const log = $("[data-log]"); if (!log || !q.trim()) return;
    log.insertAdjacentHTML("beforeend", `<div class="bubble user">${esc(q)}</div><div class="bubble bot typing" data-typing>Thinking…</div>`); log.scrollTop = log.scrollHeight;
    setTimeout(() => { const t = $("[data-typing]", log); if (!t) return; t.outerHTML = `<div class="bubble bot">${answer(q).map((p) => `<p>${esc(p)}</p>`).join("")}<p class="disc">${DISC}</p></div>`; log.scrollTop = log.scrollHeight; }, 350);
  }

  /* ---------- router ---------- */
  function route() {
    if (bots && !location.hash.startsWith("#/trading")) { clearInterval(bots); bots = null; }
    const r = (location.hash.match(/^#\/(\w+)/) || [])[1] || "home", key = V[r] ? r : "home";
    view.innerHTML = V[key](); view.dataset.route = key;
    $$("[data-r]").forEach((a) => (a.dataset.r === key ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    document.title = { home: "Quantleaf — FinTech Intelligence Platform", dashboard: "Personal finance — Quantleaf", portfolio: "Portfolio risk — Quantleaf", ai: "Assistant — Quantleaf", trading: "Order book — Quantleaf" }[key];
    if (key === "dashboard") hbars($("[data-hbars]"), fin().byCat);
    if (key === "trading") renderBook();
    if (key === "ai") { const log = $("[data-log]"); log.innerHTML = `<div class="bubble bot"><p>Hi! I can explain your finances and portfolio using a summary of your data. What would you like to know?</p><p class="disc">${DISC}</p></div>`; }
  }
  let lastKey = "";
  addEventListener("hashchange", () => { route(); if (view.dataset.route !== lastKey) { scrollTo(0, 0); view.focus({ preventScroll: true }); } lastKey = view.dataset.route; });
  addEventListener("resize", () => { clearTimeout(window.__rz); window.__rz = setTimeout(() => { if (view.dataset.route === "dashboard") hbars($("[data-hbars]"), fin().byCat); if (view.dataset.route === "trading") renderBook(); }, 150); });
  const rerender = () => { save(); const y = scrollY; route(); scrollTo(0, y); };

  /* ---------- interactions ---------- */
  view.addEventListener("click", (e) => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.txf) { txFilter = t.dataset.txf; rerender(); return; }
    if (t.hasAttribute("data-addtx")) return txDlg();
    if (t.hasAttribute("data-etx")) return txDlg(data.transactions.find((x) => x.id === t.closest("[data-tx]").dataset.tx));
    if (t.hasAttribute("data-dtx")) { const id = t.closest("[data-tx]").dataset.tx, tx = data.transactions.find((x) => x.id === id); data.transactions = data.transactions.filter((x) => x.id !== id); rerender(); toast(`Deleted “${tx.desc}”`); return; }
    if (t.hasAttribute("data-budgets")) return budgetDlg();
    if (t.hasAttribute("data-addasset")) return assetDlg();
    if (t.hasAttribute("data-dasset")) { const id = t.closest("[data-asset]").dataset.asset, a = data.portfolio.find((x) => x.id === id); data.portfolio = data.portfolio.filter((x) => x.id !== id); rerender(); toast(`Removed ${a.ticker}`); return; }
    if (t.hasAttribute("data-alloct")) { allocTable = !allocTable; rerender(); $("[data-alloct]").focus(); return; }
    if (t.hasAttribute("data-ask")) { chat(t.textContent); return; }
    if (t.hasAttribute("data-ctx")) { openDlg(`<h2 id="dlg-title">Context sent to the assistant</h2><p style="margin:0;font-size:14px">Aggregates only: no transaction descriptions, names or tickers beyond class totals.</p><pre class="ctx" data-ctxjson>${esc(JSON.stringify(context(), null, 2))}</pre><div class="acts"><button class="btn" value="cancel">Close</button></div>`); return; }
    if (t.hasAttribute("data-bots")) { if (bots) { clearInterval(bots); bots = null; } else bots = setInterval(botTick, 1200); const y = scrollY; route(); scrollTo(0, y); $("[data-bots]").focus(); return; }
    if (t.hasAttribute("data-resetbook")) { Engine.seed(); myOrders.length = 0; renderBook(); toast("Order book reset"); return; }
    if (t.hasAttribute("data-cancel")) { const id = t.closest("[data-oid]").dataset.oid, o = Engine.cancel(id); if (o) { const m = myOrders.find((x) => x.id === id); m.status = "canceled"; renderBook(); toast(`Canceled ${id}`); } }
  });
  view.addEventListener("change", (e) => {
    if (!e.target.matches("[data-weight]")) return;
    const v = parseFloat(e.target.value), a = data.portfolio.find((x) => x.id === e.target.closest("[data-asset]").dataset.asset);
    if (!(v >= 0 && v <= 100)) { e.target.value = a.weight; toast("Weight must be between 0 and 100", "err"); return; }
    a.weight = Math.round(v * 10) / 10; const id = e.target.id; rerender(); $("#" + id)?.focus();
  });
  view.addEventListener("submit", (e) => {
    if (e.target.matches("[data-chat]")) { e.preventDefault(); const i = $("#ask"); chat(i.value); i.value = ""; return; }
    if (!e.target.matches("[data-order]")) return;
    e.preventDefault(); const f = e.target, msg = $("[data-omsg]"), ps = f.price.value.trim(), qs = f.qty.value.trim();
    const pe = !/^\d+(\.\d{1,2})?$/.test(ps) || +ps <= 0 ? "Enter a price above 0 with up to 2 decimals" : "", qe = !/^\d+$/.test(qs) || +qs < 1 || +qs > 10000 ? "Whole number from 1 to 10,000" : "";
    [[f.price, pe], [f.qty, qe]].forEach(([el, m]) => { if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); el.closest(".f").querySelector(".e").textContent = m; });
    if (pe || qe) { msg.textContent = ""; (pe ? f.price : f.qty).focus(); return; }
    const res = Engine.submit({ side: f.side.value, price: Engine.cents(+ps), qty: +qs, owner: "you" }); myOrders.push(res.order);
    const filled = res.fills.reduce((s, t) => s + t.qty, 0), avg = filled ? res.fills.reduce((s, t) => s + t.price * t.qty, 0) / filled / 100 : 0;
    renderBook();
    const m2 = $("[data-omsg]"); m2.className = "msg ok";
    m2.textContent = `${res.order.id}: ${filled ? `filled ${filled} @ avg ${avg.toFixed(2)} across ${res.fills.length} trade${res.fills.length > 1 ? "s" : ""}` : "no match"}${res.order.rem ? `; ${res.order.rem} resting at ${(res.order.price / 100).toFixed(2)}` : ""}.`;
  });

  /* ---------- dialogs ---------- */
  const dlg = $("[data-dlg]"), db = $("[data-dlg-body]");
  let back = null;
  function openDlg(html, onSubmit) { back = document.activeElement; db.innerHTML = html; db.onsubmit = (e) => { if (e.submitter && e.submitter.value === "cancel") return; e.preventDefault(); onSubmit && onSubmit(); }; dlg.showModal(); ($("input, select", db) || $("button", db)).focus(); }
  dlg.addEventListener("close", () => { if (back && back.isConnected) back.focus({ preventScroll: true }); });
  const fld = (n, l, v, t = "text", x = "") => `<label class="f">${l}<input name="${n}" type="${t}" value="${esc(v ?? "")}" ${x}><span class="e"></span></label>`;
  const err = (n, m) => { const el = db.elements[n]; if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); el.closest(".f").querySelector(".e").textContent = m || ""; return !!m; };
  function txDlg(t) {
    openDlg(`<h2 id="dlg-title">${t ? "Edit" : "Add"} transaction</h2><div class="row2"><label class="f">Type<select name="type"><option value="expense"${t?.type !== "income" ? " selected" : ""}>Expense</option><option value="income"${t?.type === "income" ? " selected" : ""}>Income</option></select></label>${fld("date", "Date", t?.date || day(now.getDate()), "date")}</div>${fld("desc", "Description", t?.desc, "text", 'maxlength="60"')}<div class="row2">${fld("amount", "Amount ($)", t?.amount, "number", 'step="0.01" min="0"')}<label class="f">Category<select name="category">${["Salary", "Freelance", ...CATS].map((c) => `<option${(t?.category || "Food") === c ? " selected" : ""}>${c}</option>`).join("")}</select></label></div><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn acc" type="submit">${t ? "Save" : "Add"}</button></div>`, () => {
      const f = db.elements, amt = parseFloat(f.amount.value);
      const bad = [err("desc", f.desc.value.trim().length < 2 ? "Describe it (2+ characters)" : ""), err("amount", !(amt > 0) ? "Enter an amount above 0" : ""), err("date", !f.date.value ? "Choose a date" : "")];
      if (bad.includes(true)) return $("[aria-invalid=true]", db).focus();
      const rec = t || (data.transactions.push({ id: uid() }), data.transactions[data.transactions.length - 1]);
      Object.assign(rec, { type: f.type.value, date: f.date.value, desc: f.desc.value.trim(), amount: Math.round(amt * 100) / 100, category: f.category.value });
      dlg.close(); rerender(); toast(`${t ? "Saved" : "Added"} “${rec.desc}”`);
    });
  }
  function budgetDlg() {
    openDlg(`<h2 id="dlg-title">Monthly budgets</h2><p style="margin:0;font-size:14px;color:var(--muted)">Set 0 to stop tracking a category.</p><div class="row2">${CATS.filter((c) => c !== "Other").map((c) => fld(`b_${c}`, c, data.budgets[c] || 0, "number", 'min="0" step="10"')).join("")}</div><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn acc" type="submit">Save budgets</button></div>`, () => {
      let bad = false; CATS.filter((c) => c !== "Other").forEach((c) => { const v = parseFloat(db.elements[`b_${c}`].value); bad = err(`b_${c}`, !(v >= 0) ? "0 or more" : "") || bad; });
      if (bad) return;
      CATS.filter((c) => c !== "Other").forEach((c) => (data.budgets[c] = parseFloat(db.elements[`b_${c}`].value)));
      dlg.close(); rerender(); toast("Budgets updated");
    });
  }
  function assetDlg() {
    const r = risk();
    openDlg(`<h2 id="dlg-title">Add asset</h2><div class="row2">${fld("ticker", "Ticker", "", "text", 'maxlength="8" placeholder="e.g. QQQ"')}${fld("weight", "Weight (%)", Math.max(0, 100 - r.total) || "", "number", 'min="0.5" max="100" step="0.5"')}</div>${fld("name", "Name (optional)", "", "text", 'maxlength="40"')}<label class="f">Asset class<select name="cls">${CLASSES.map((c) => `<option>${c}</option>`).join("")}</select></label><div class="acts"><button class="btn-o" value="cancel" formnovalidate>Cancel</button><button class="btn acc" type="submit">Add</button></div>`, () => {
      const f = db.elements, tk = f.ticker.value.trim().toUpperCase(), w = parseFloat(f.weight.value);
      const bad = [err("ticker", !/^[A-Z0-9.\-]{1,8}$/.test(tk) ? "1–8 letters or digits" : data.portfolio.some((p) => p.ticker === tk) ? "Already in the portfolio" : ""), err("weight", !(w > 0 && w <= 100) ? "Between 0 and 100" : "")];
      if (bad.includes(true)) return $("[aria-invalid=true]", db).focus();
      data.portfolio.push({ id: uid(), ticker: tk, name: f.name.value.trim() || tk, weight: Math.round(w * 10) / 10, cls: f.cls.value });
      dlg.close(); rerender(); toast(`Added ${tk}`);
    });
  }
  function toast(m, kind = "") { const t = document.createElement("div"); t.className = `toast ${kind}`; t.innerHTML = `${icon(kind === "err" ? "i-warn" : "i-check")}<span>${esc(m)}</span>`; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 3200); }

  route(); lastKey = view.dataset.route;
})();
