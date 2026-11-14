(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const usd = (n, d = 0) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d, maximumFractionDigits: d });
  const A = window.Art;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  $("[data-hero-art]").innerHTML = A.hero();
  $$("[data-thumb]").forEach((el) => (el.innerHTML = A.thumb(el.dataset.thumb)));
  $$("[data-av]").forEach((el) => (el.innerHTML = A.avatar(el.dataset.av, "Sarah Mitchell")));
  $$("[data-av-lg]").forEach((el) => (el.innerHTML = A.avatar(el.dataset.avLg, "Sarah Mitchell")));

  /* ---------- articles ---------- */
  const CAT = { Budgeting: ["#ECFDF5", "#047857"], Investing: ["#EFF6FF", "#1D4ED8"], Debt: ["#FFFBEB", "#B45309"], "Earning More": ["#F5F3FF", "#6D28D9"] };
  const ARTS = [
    { id: "5030", t: "The 50/30/20 Budget Rule Is Outdated — Try This Instead", cat: "Budgeting", min: 8, img: "budget", latest: true, key: ["Start from your fixed costs, not a percentage", "Automate savings on payday before anything else", "Give 'wants' a weekly cash-style limit", "Review once a month for 15 minutes"] },
    { id: "loans", t: "I Paid Off $47,000 in Student Loans in 18 Months — Here's My Exact Strategy", cat: "Debt", min: 15, img: "loans", latest: true, key: ["List every loan with its rate and minimum", "Refinance only if it lowers the rate without losing protections", "Throw every raise and windfall at the highest-rate loan", "Celebrate milestones so you don't burn out"] },
    { id: "hysa", t: "5 High-Yield Savings Accounts Actually Worth Opening in 2026", cat: "Budgeting", min: 6, img: "hysa", latest: true, key: ["Look for no monthly fees and no minimum balance", "Check that deposits are FDIC- or NCUA-insured", "Compare the APY, but don't chase tiny differences", "Keep 3–6 months of expenses here as your emergency fund"] },
    { id: "roth", t: "Roth IRA vs Traditional IRA: Which One Wins? (We Did the Math)", cat: "Investing", min: 10, img: "roth", latest: true, key: ["Roth: pay tax now, withdraw tax-free in retirement", "Traditional: deduct now, pay tax on withdrawals", "If you expect a higher tax bracket later, Roth usually wins", "Many people benefit from having both"] },
    { id: "hustle", t: "How I Turned a $200/Month Side Hustle Into a $4,000/Month Business", cat: "Earning More", min: 12, img: "hustle", latest: true, key: ["Pick a skill people already pay for", "Raise prices before you add more hours", "Productize: package your service with a fixed scope", "Set aside 25–30% for taxes from day one"] },
    { id: "cards", t: "The Only 3 Credit Cards You Need (and When to Use Each)", cat: "Budgeting", min: 7, img: "cards", latest: true, key: ["A no-fee everyday cash-back card", "A travel or category card only if you'll use the perks", "Pay the full statement balance every month", "Never carry a balance to earn rewards"] },
    { id: "invest100", t: "How to Start Investing With $100: A Complete Beginner's Guide", cat: "Investing", min: 12, img: "feature", key: ["Build a small emergency fund first", "Open a brokerage account or IRA with no minimums", "Buy a broad, low-cost index fund (fractional shares are fine)", "Automate $100 a month and leave it alone"] },
    { id: "index", t: "Index Funds Explained in Five Minutes", cat: "Investing", min: 5, img: "roth", key: ["An index fund owns a slice of a whole market", "Low fees matter more than picking 'winners'", "Diversification lowers the chance of a single bad bet", "Time in the market beats timing the market"] },
    { id: "raise", t: "The Script I Used to Negotiate a 15% Raise", cat: "Earning More", min: 9, img: "hustle", key: ["Collect market salary data before the meeting", "Lead with results, not needs", "Name a specific number", "Get the agreement in writing"] },
    { id: "snowball", t: "Debt Snowball vs Avalanche: Which Should You Use?", cat: "Debt", min: 6, img: "loans", key: ["Snowball: smallest balance first for quick wins", "Avalanche: highest interest first to save the most", "Either works if you stick with it", "Try both in our free calculator"] }
  ];
  const BY = Object.fromEntries(ARTS.map((a) => [a.id, a]));
  const badge = (c) => `<span class="badge" style="--bg:${CAT[c][0]};--fg:${CAT[c][1]}">${c === "Debt" ? "Debt" : c}</span>`;
  const card = (a) => `<article class="art"><div class="thumb">${A.thumb(a.img)}</div><div class="a-body">${badge(a.cat)}<h3><a href="#read" data-read="${a.id}">${esc(a.t)}</a></h3><span class="rt">${icon("i-clock")}${a.min} min read</span></div></article>`;
  let topic = null, all = false;
  function renderArts() {
    const list = topic ? ARTS.filter((a) => a.cat === topic) : all ? ARTS : ARTS.filter((a) => a.latest);
    $("[data-arts]").innerHTML = list.length ? list.map(card).join("") : `<div class="empty">No articles yet.</div>`;
    const f = $("[data-filter]");
    f.hidden = !(topic || all);
    $("[data-filter-t]").textContent = topic ? `${list.length} ${topic} guides` : `All ${list.length} articles`;
    $("[data-view-all]").hidden = !!(topic || all);
  }
  renderArts();
  const setTopic = (t) => { topic = t; all = false; renderArts(); $("#latest").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-topic]"); if (!a) return; e.preventDefault(); closeMenu(); setTopic(a.dataset.topic); });
  $("[data-clear]").addEventListener("click", () => { topic = null; all = false; renderArts(); });
  $("[data-view-all]").addEventListener("click", () => { all = true; topic = null; renderArts(); });

  /* ---------- reader ---------- */
  function read(id) {
    const a = BY[id]; if (!a) return;
    const steps = a.key.map((k) => `<li>${esc(k)}</li>`).join("");
    openDlg(`<div class="thumb">${A.thumb(a.img)}</div>${badge(a.cat)}<h3 style="margin-top:10px">${esc(a.t)}</h3><p class="lead">By Sarah Mitchell · ${a.min} min read</p>
      <p>Here's the short version before you dive in — the four moves that matter most:</p><ol>${steps}</ol>
      <p>Everyone's situation is different, so treat these as a starting point. If you have questions about your specific taxes or investments, a fee-only financial planner is worth the conversation.</p>
      <p class="note">Preview excerpt for this demo. Educational content only — not financial advice.</p>`);
  }
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-read]"); if (!a) return; e.preventDefault(); closeSearch(); read(a.dataset.read === "budget" ? "5030" : a.dataset.read); });

  /* ---------- budget calculator ---------- */
  const pay = $("[data-pay]"), hint = $("[data-pay-hint]");
  const SPLIT = [["needs", 50, 0], ["wants", 30, 50], ["save", 20, 80]];
  const parse = (v) => Number(String(v).replace(/[$,\s]/g, ""));
  function calc() {
    const raw = pay.value.trim(), example = raw === "", v = example ? 4500 : parse(raw);
    const ok = Number.isFinite(v) && v > 0 && v < 1e7;
    $("[data-donut]").classList.toggle("example", example);
    hint.classList.toggle("bad", raw !== "" && !ok);
    hint.textContent = example ? "Showing an example for $4,500 — type your own number. Nothing leaves your browser." : ok ? "Based on the 50/30/20 rule — a starting point, not a rule." : "Enter a positive dollar amount, like 4500.";
    SPLIT.forEach(([k, pct, off]) => {
      const seg = $(`[data-seg="${k}"]`);
      seg.setAttribute("stroke-dasharray", ok ? `${pct - 0.6} ${100 - pct + 0.6}` : "0 100");
      seg.setAttribute("stroke-dashoffset", ok ? -off : 0);
      $(`[data-amt="${k}"]`).textContent = usd(ok ? (v * pct) / 100 : 0);
    });
    $("[data-total]").textContent = usd(ok ? v : 0);
    $("[data-donut] title").textContent = ok ? `Budget split of ${usd(v)}: needs ${usd(v * 0.5)}, wants ${usd(v * 0.3)}, savings ${usd(v * 0.2)}` : "Budget split: 50% needs, 30% wants, 20% savings";
  }
  pay.addEventListener("input", calc);
  pay.addEventListener("blur", () => { const v = parse(pay.value); if (v > 0 && Number.isFinite(v)) pay.value = v.toLocaleString("en-US", { maximumFractionDigits: 2 }); });
  calc();

  /* ---------- newsletter ---------- */
  $("[data-sub]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = e.target.email.value.trim(), m = $("[data-sub-msg]");
    if (!validEmail(v)) { m.className = "nl-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    m.className = "nl-msg ok"; m.textContent = `You're subscribed! Your first tip arrives Tuesday at ${v}. (Demo — nothing is sent.)`; e.target.reset();
  });

  /* ---------- downloads (generated locally) ---------- */
  function download(name, rows) {
    const csv = rows.map((r) => r.map((c) => (/[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : c)).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = name;
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  const DL = {
    budget: () => { download("penny-wise-monthly-budget.csv", [["Category", "Type", "Planned", "Actual", "Difference"], ["Rent / mortgage", "Need", 1500, "", "=C2-D2"], ["Groceries", "Need", 400, "", "=C3-D3"], ["Transportation", "Need", 200, "", "=C4-D4"], ["Insurance", "Need", 150, "", "=C5-D5"], ["Dining out", "Want", 250, "", "=C6-D6"], ["Subscriptions", "Want", 60, "", "=C7-D7"], ["Fun money", "Want", 200, "", "=C8-D8"], ["Emergency fund", "Savings", 400, "", "=C9-D9"], ["Investing (IRA/401k)", "Savings", 300, "", "=C10-D10"], ["Extra debt payment", "Savings", 200, "", "=C11-D11"], ["TOTAL", "", "=SUM(C2:C11)", "=SUM(D2:D11)", "=C12-D12"]]); toast("Downloaded penny-wise-monthly-budget.csv — import it into Google Sheets."); },
    networth: () => { download("penny-wise-net-worth-tracker.csv", [["Item", "Type", "Jan", "Feb", "Mar"], ["Checking", "Asset", "", "", ""], ["High-yield savings", "Asset", "", "", ""], ["Retirement accounts", "Asset", "", "", ""], ["Brokerage", "Asset", "", "", ""], ["Car (resale value)", "Asset", "", "", ""], ["Credit cards", "Liability", "", "", ""], ["Student loans", "Liability", "", "", ""], ["Car loan", "Liability", "", "", ""], ["NET WORTH", "", '=SUMIF($B2:$B9,"Asset",C2:C9)-SUMIF($B2:$B9,"Liability",C2:C9)', '=SUMIF($B2:$B9,"Asset",D2:D9)-SUMIF($B2:$B9,"Liability",D2:D9)', '=SUMIF($B2:$B9,"Asset",E2:E9)-SUMIF($B2:$B9,"Liability",E2:E9)']]); toast("Downloaded penny-wise-net-worth-tracker.csv"); }
  };
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-dl]"); if (!b) return; e.preventDefault(); DL[b.dataset.dl](); });

  /* ---------- debt payoff calculator (snowball vs avalanche) ---------- */
  function simulate(debts, extra, order) {
    const ds = debts.map((d) => ({ ...d }));
    let month = 0, interest = 0;
    while (ds.some((d) => d.bal > 0.005) && month < 600) {
      month++;
      ds.forEach((d) => { if (d.bal > 0) { const i = (d.bal * d.apr) / 1200; d.bal += i; interest += i; } });
      let pool = extra + ds.filter((d) => d.bal <= 0).reduce((s, d) => s + d.min, 0);
      ds.forEach((d) => { if (d.bal > 0) { const p = Math.min(d.min, d.bal); d.bal -= p; pool += d.min - p; } });
      const active = ds.filter((d) => d.bal > 0).sort(order);
      for (const d of active) { if (pool <= 0) break; const p = Math.min(pool, d.bal); d.bal -= p; pool -= p; }
    }
    return { month, interest };
  }
  function debtCalc() {
    const rows = [["Credit card", 4200, 22.9, 120], ["Car loan", 9800, 6.5, 260], ["Student loan", 18500, 5.0, 210]];
    openDlg(`<h3>Debt Payoff Calculator</h3><p class="lead">Compare snowball (smallest balance first) and avalanche (highest rate first). Everything is calculated in your browser.</p>
      <form data-debt-form novalidate><div class="debts">${rows.map(([n, b, r, m], i) => `<div class="debt"><label class="name">Debt<input name="n${i}" value="${n}"></label><label>Balance ($)<input name="b${i}" inputmode="decimal" value="${b}"></label><label>APR (%)<input name="r${i}" inputmode="decimal" value="${r}"></label><label>Min. payment<input name="m${i}" inputmode="decimal" value="${m}"></label><span></span></div>`).join("")}</div>
      <div class="form"><label>Extra payment each month ($)<input name="extra" inputmode="decimal" value="300"></label></div>
      <p class="err" data-err role="alert"></p><button class="btn btn-g" type="submit">Calculate my debt-free date</button></form><div data-debt-out aria-live="polite"></div>`);
    const f = $("[data-debt-form]", body);
    const run = () => {
      const debts = [0, 1, 2].map((i) => ({ n: f[`n${i}`].value.trim() || `Debt ${i + 1}`, bal: parse(f[`b${i}`].value), apr: parse(f[`r${i}`].value), min: parse(f[`m${i}`].value) })).filter((d) => d.bal > 0);
      const extra = parse(f.extra.value) || 0;
      if (!debts.length || debts.some((d) => !(d.apr >= 0) || !(d.min > 0)) || extra < 0) { $("[data-err]", body).textContent = "Enter positive balances, rates and minimum payments."; return; }
      if (debts.some((d) => d.min <= (d.bal * d.apr) / 1200) && extra === 0) { $("[data-err]", body).textContent = "A minimum payment doesn't cover its monthly interest — add an extra payment."; return; }
      $("[data-err]", body).textContent = "";
      const sb = simulate(debts, extra, (a, b) => a.bal - b.bal), av = simulate(debts, extra, (a, b) => b.apr - a.apr);
      const when = (m) => { const d = new Date(); d.setMonth(d.getMonth() + m); return d.toLocaleDateString("en-US", { month: "long", year: "numeric" }); };
      const capped = sb.month >= 600 || av.month >= 600;
      const win = av.interest <= sb.interest ? "av" : "sb";
      $("[data-debt-out]", body).innerHTML = capped ? `<p class="err">At these payments it would take more than 50 years — increase the extra payment.</p>` : `<div class="res-grid"><div class="${win === "sb" ? "win" : ""}" data-res="snowball"><small>Snowball</small><b>${when(sb.month)}</b><small>${sb.month} months · ${usd(sb.interest)} interest</small></div><div class="${win === "av" ? "win" : ""}" data-res="avalanche"><small>Avalanche</small><b>${when(av.month)}</b><small>${av.month} months · ${usd(av.interest)} interest</small></div></div><p class="note">Avalanche saves ${usd(Math.abs(sb.interest - av.interest))} in interest here; snowball pays off your first debt sooner. Estimates assume fixed rates and on-time payments.</p>`;
    };
    f.addEventListener("submit", (e) => { e.preventDefault(); run(); });
    run();
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-debt]"); if (!b) return; e.preventDefault(); debtCalc(); });

  /* ---------- investment quiz ---------- */
  const QZ = [
    ["Do you have 3+ months of expenses saved?", ["Yes", "Not yet"]],
    ["Does your employer match 401(k) contributions?", ["Yes", "No / not sure"]],
    ["Any debt above 8% interest?", ["Yes", "No"]]
  ];
  function quiz() {
    const ans = [];
    const step = (i) => {
      if (i === QZ.length) {
        const recs = [];
        if (ans[0] === 1) recs.push("Build your emergency fund in a high-yield savings account first.");
        if (ans[1] === 0) recs.push("Contribute at least enough to get the full 401(k) match — it's an instant return.");
        if (ans[2] === 0) recs.push("Pay down high-interest debt before investing beyond the match.");
        recs.push("Then open a Roth IRA and automate a broad, low-cost index fund.");
        openDlg(`<h3>Your next money move</h3><ol>${recs.map((r) => `<li>${r}</li>`).join("")}</ol><p><a class="link" href="#read" data-read="invest100">Read: How to Start Investing With $100 ${icon("i-arrow")}</a></p><p class="note">Educational only — not financial advice.</p>`);
        return;
      }
      const [q, opts] = QZ[i];
      openDlg(`<p class="lead">Investment quiz · ${i + 1} of ${QZ.length}</p><fieldset class="q-opts"><legend>${q}</legend>${opts.map((o, k) => `<label><input type="radio" name="q" value="${k}"> ${o}</label>`).join("")}</fieldset><p class="err" data-err role="alert"></p><button class="btn btn-g" type="button" data-qn>Next</button>`);
      $("[data-qn]", body).addEventListener("click", () => { const r = $("input:checked", body); if (!r) { $("[data-err]", body).textContent = "Choose an answer."; return; } ans[i] = Number(r.value); step(i + 1); });
    };
    step(0);
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-quiz]"); if (!b) return; e.preventDefault(); quiz(); });

  /* ---------- story / money / soon ---------- */
  $("[data-story]").addEventListener("click", () => openDlg(`<h3>My story</h3><p class="lead">Sarah Mitchell, founder of Penny Wise</p><p>I spent six years as a financial analyst building models for companies — and then went home and watched smart friends panic about rent, credit cards and whether they "should be investing."</p><p>Penny Wise started as a shared doc of answers to their questions. It turns out a lot of people had the same ones. Today the blog covers budgeting, debt, investing and earning more — always in plain English, always with the math shown.</p><p class="note">Illustrative founder story for this demo page.</p>`));
  $("[data-money]").addEventListener("click", () => openDlg(`<h3>How We Make Money</h3><p>Penny Wise is reader-supported. Some articles contain affiliate links: if you open an account through them, we may earn a commission at no cost to you.</p><ul><li>Affiliate relationships never change our ratings or recommendations.</li><li>We only recommend products we'd use ourselves.</li><li>Sponsored content is always clearly labeled.</li></ul><p class="note">Demo disclosure — this page contains no live affiliate links.</p>`));
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (!s) return; e.preventDefault(); toast(`${s.dataset.soon} — coming soon.`); });

  /* ---------- search ---------- */
  const sbox = $("[data-search]"), sin = $("[data-search-in]"), sres = $("[data-search-res]");
  function openSearch(q = "") { sbox.hidden = false; sin.value = q; renderSearch(); sin.focus(); }
  function closeSearch() { sbox.hidden = true; }
  function renderSearch() {
    const q = sin.value.trim().toLowerCase();
    const list = q ? ARTS.filter((a) => `${a.t} ${a.cat} ${a.key.join(" ")}`.toLowerCase().includes(q)) : ARTS.slice(0, 4);
    const hi = (t) => { const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`; };
    sres.innerHTML = list.length ? list.map((a) => `<li><button type="button" data-read="${a.id}"><b>${hi(a.t)}</b><small>${a.cat} · ${a.min} min</small></button></li>`).join("") : `<li><p>No guides match “${esc(sin.value.trim())}”.</p></li>`;
  }
  $("[data-search-open]").addEventListener("click", () => (sbox.hidden ? openSearch() : closeSearch()));
  $("[data-search-close]").addEventListener("click", closeSearch);
  sin.addEventListener("input", renderSearch);
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-search-q]"); if (!a) return; e.preventDefault(); scrollTo({ top: 0 }); openSearch(a.dataset.searchQ); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); closeMenu(); } });

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0; const f = $("input[type=radio], input, .btn", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); }

  /* ---------- nav + footer accordion ---------- */
  const burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() { if (mnav.hidden) return; mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  burger.addEventListener("click", () => { const show = mnav.hidden; mnav.hidden = !show; burger.setAttribute("aria-expanded", show); burger.setAttribute("aria-label", show ? "Close menu" : "Open menu"); });
  $$("a", mnav).forEach((a) => a.addEventListener("click", closeMenu));
  const mq = matchMedia("(max-width: 640px)");
  const syncFoot = () => $$(".f-col").forEach((d) => (d.open = !mq.matches));
  syncFoot(); mq.addEventListener("change", syncFoot);
  $$(".f-col summary").forEach((s) => s.addEventListener("click", (e) => { if (!mq.matches) e.preventDefault(); }));
})();
