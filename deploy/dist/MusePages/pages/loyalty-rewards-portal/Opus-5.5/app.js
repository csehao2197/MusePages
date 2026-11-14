(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n = (v) => Math.round(v).toLocaleString("en-US");
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  /* ---------- demo clock: account snapshot as of Mar 12, 2026 10:00 ---------- */
  const DEMO0 = new Date(2026, 2, 12, 10, 0, 0).getTime(), T0 = Date.now();
  const demoNow = () => new Date(DEMO0 + (Date.now() - T0));
  const fmtD = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  /* ---------- history (47 transactions, newest first; balances consistent) ---------- */
  const RECENT = [
    [new Date(2026, 2, 10), "Purchase — Order #8834", 240, "earned"],
    [new Date(2026, 2, 5), "Redeemed — $10 Store Credit", -500, "redeemed"],
    [new Date(2026, 1, 28), "Bonus — Double Points Weekend", 380, "earned"],
    [new Date(2026, 1, 20), "Purchase — Order #8791", 160, "earned"],
    [new Date(2026, 1, 14), "Bonus — Valentine's Day Promo", 200, "earned"]
  ];
  let seed = 17; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const older = []; let bal = 0, d = new Date(2024, 0, 15), order = 7100, refs = 0;
  const COSTS = [[250, "$5 Store Credit"], [500, "$10 Store Credit"], [300, "Free Express Shipping"], [800, "20% Off Next Order"]];
  for (let i = 0; i < 41; i++) {
    d = new Date(d.getTime() + (12 + Math.floor(rnd() * 8)) * 864e5);
    let row;
    if (i % 6 === 3 && refs < 7) { row = ["Referral — friend's first purchase", 500, "earned"]; refs++; }
    else if (i % 5 === 4 && bal > 900) { const [c, t] = COSTS[Math.floor(rnd() * COSTS.length)]; row = [`Redeemed — ${t}`, -c, "redeemed"]; }
    else if (i === 17 || i === 33) { const v = 60 + Math.floor(rnd() * 5) * 20; row = ["Points expired (12 months inactive)", -v, "expired"]; }
    else if (i % 7 === 2) row = ["Review — product review", 50, "earned"];
    else { order += 7 + Math.floor(rnd() * 20); row = [`Purchase — Order #${order}`, 80 + Math.floor(rnd() * 19) * 10, "earned"]; }
    if (row[1] < 0 && bal + row[1] < 0) { order += 9; row = [`Purchase — Order #${order}`, 140, "earned"]; }
    bal += row[1]; older.push([d, ...row]);
  }
  // last older entry brings the balance to 3,800 before Feb 14, 2026
  const gap = 3800 - bal;
  older.push([new Date(2026, 1, 6), gap >= 0 ? "Purchase — Order #8760" : "Redeemed — 20% Off Next Order", gap, gap >= 0 ? "earned" : "redeemed"]);
  const HIST = [...older, ...RECENT.slice().reverse()]; // chronological
  let running = 0; HIST.forEach((h) => { running += h[2]; h.push(running); });
  HIST.reverse(); // newest first: [date, desc, delta, type, balance]

  const balance = () => HIST[0][4];
  // Tier progress counts points earned in 2026; the snapshot starts at 4,280 (equal to the current balance).
  let tierPts = 4280;

  /* ---------- tiers ---------- */
  const TIERS = [
    { k: "Bronze", min: 0, max: 1000, c: "#CD7F32", perk: "Earn 1pt per $1" },
    { k: "Silver", min: 1001, max: 3000, c: "#9CA3AF", perk: "5% birthday discount" },
    { k: "Gold", min: 3001, max: 6000, c: "#F59E0B", perk: "Free shipping on all orders" },
    { k: "Platinum", min: 6001, max: 10000, c: "#7C3AED", perk: "Early access + personal shopper" }
  ];
  const tierOf = (p) => TIERS.filter((t) => p >= t.min).pop();
  const pos = (p) => { const i = TIERS.indexOf(tierOf(p)), t = TIERS[i]; return Math.min(100, i * 25 + Math.min(1, (p - t.min) / (t.max - t.min + 1)) * 25); };
  $(".tlist").innerHTML = TIERS.map((t) => `<li class="tier" data-tier="${t.k}" style="--c:${t.c}"><span class="dot">${icon("i-check")}</span><h3>${t.k}</h3><small>${n(t.min)}${t.k === "Platinum" ? "+" : `–${n(t.max)}`} pts</small><p>${t.perk}</p></li>`).join("");
  function renderTier(animate = true) {
    const t = tierOf(tierPts), i = TIERS.indexOf(t), next = TIERS[i + 1];
    $$("[data-tier]").forEach((el, k) => { el.classList.toggle("cur", k === i); el.classList.toggle("done", k < i); el.classList.toggle("next", k === i + 1); el.querySelector(".dot").innerHTML = k <= i ? icon("i-check") : icon("i-lock"); });
    const p = pos(tierPts);
    const apply = () => {
      $("[data-fill]").style.width = `${p}%`; $("[data-marker]").style.left = `${p}%`;
      const tiers = $("[data-tiers]"); tiers.style.setProperty("--h", `${p}%`); tiers.querySelector(".marker").style.setProperty("--mt", `${p}%`);
      $("[data-slim] i").style.width = `${Math.min(100, (tierPts / 6001) * 100)}%`;
    };
    animate ? requestAnimationFrame(() => requestAnimationFrame(apply)) : apply();
    $("[data-marker-t]").textContent = `${n(tierPts)} / ${next ? n(next.min - 1 + 1) : "max"}`;
    $("[data-slim]").setAttribute("aria-valuenow", tierPts);
    $("[data-tier-name]").textContent = t.k;
    $("[data-year-earned]").textContent = n(tierPts);
    $("[data-away]").textContent = next ? `You're ${n(next.min - tierPts)} points away from ${next.k}!` : "You've reached Platinum — our top tier!";
  }

  /* ---------- history table ---------- */
  let hFilter = "all", page = 0; const PER = 10;
  function renderHist() {
    const list = HIST.filter((h) => hFilter === "all" || h[3] === hFilter);
    const pages = Math.max(1, Math.ceil(list.length / PER)); page = Math.min(page, pages - 1);
    const v = list.slice(page * PER, page * PER + PER);
    $("[data-hist]").innerHTML = v.length ? v.map((h) => `<tr class="${h.fresh ? "new" : ""}"><td>${fmtD(h[0])}</td><td>${esc(h[1])}</td><td class="num ${h[2] >= 0 ? "plus" : "minus"}">${h[2] >= 0 ? "+" : "−"}${n(Math.abs(h[2]))}</td><td class="num">${n(h[4])}</td></tr>`).join("") : `<tr><td colspan="4" style="text-align:center;color:#6B7280">No ${hFilter} transactions.</td></tr>`;
    $("[data-showing]").textContent = list.length ? `Showing ${page * PER + 1}–${page * PER + v.length} of ${list.length} transactions` : "Showing 0 transactions";
    $("[data-pageno]").textContent = `${page + 1} / ${pages}`;
    $("[data-prev]").disabled = page === 0; $("[data-next]").disabled = page >= pages - 1;
  }
  $("[data-htabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-h]"); if (!b) return; hFilter = b.dataset.h; page = 0; $$("[data-h]").forEach((x) => x.setAttribute("aria-selected", x === b)); renderHist(); });
  $("[data-prev]").addEventListener("click", () => { page--; renderHist(); });
  $("[data-next]").addEventListener("click", () => { page++; renderHist(); });

  /* ---------- snapshot (computed from history) ---------- */
  function spark(vals, c) { const max = Math.max(...vals, 1), pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 120},${30 - (v / max) * 26}`).join(" "); return `<svg class="spark" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><polygon points="0,32 ${pts} 120,32" fill="${c}" opacity=".12"/></svg>`; }
  function monthly(filter) { const now = demoNow(); return Array.from({ length: 6 }, (_, k) => { const m = new Date(now.getFullYear(), now.getMonth() - 5 + k, 1), e = new Date(m.getFullYear(), m.getMonth() + 1, 1); return HIST.filter((h) => h[0] >= m && h[0] < e && filter(h)).reduce((a, h) => a + Math.abs(h[2]), 0); }); }
  function renderSnap() {
    const earned = HIST.filter((h) => h[2] > 0).reduce((a, h) => a + h[2], 0);
    const redeemed = HIST.filter((h) => h[3] === "redeemed").reduce((a, h) => a - h[2], 0);
    const ref = HIST.filter((h) => /^Referral/.test(h[1])).reduce((a, h) => a + h[2], 0);
    const now = demoNow(), monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = HIST.filter((h) => h[0] >= monthStart && h[2] > 0).reduce((a, h) => a + h[2], 0);
    const lastR = HIST.find((h) => h[3] === "redeemed");
    const t = tierOf(tierPts), next = TIERS[TIERS.indexOf(t) + 1];
    const cards = [
      ["Total Earned", `${n(earned)} pts`, "i-trend", "#16A34A", `+${n(thisMonth)} this month`, monthly((h) => h[2] > 0)],
      ["Total Redeemed", `${n(redeemed)} pts`, "i-gift", "#2563EB", lastR ? `Last: ${lastR[1].replace("Redeemed — ", "")} on ${lastR[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Nothing redeemed yet", monthly((h) => h[3] === "redeemed")],
      ["Referral Bonus", `${n(ref)} pts`, "i-users", "#7C3AED", `${ref / 500} successful referrals`, monthly((h) => /^Referral/.test(h[1]))],
      ["Next Reward", next ? `${n(next.min - tierPts)} pts away` : "Top tier", "i-target", "#F97316", next ? `${next.k} tier: ${next.perk.toLowerCase()}` : "Enjoy Platinum perks", monthly((h) => h[2] > 0)]
    ];
    $("[data-snap]").innerHTML = cards.map(([l, v, ic, c, s, sp]) => `<article class="st" style="--a:${c}"><span class="st-h">${l}${icon(ic)}</span><b>${v}</b><small>${esc(s)}</small>${spark(sp, c)}</article>`).join("");
  }

  /* ---------- rewards catalog ---------- */
  const REWARDS = [
    { id: "c5", t: "$5 Store Credit", cost: 250, cat: "Discounts", ic: "i-gift" },
    { id: "c10", t: "$10 Store Credit", cost: 500, cat: "Discounts", ic: "i-gift" },
    { id: "ship", t: "Free Express Shipping", cost: 300, cat: "Discounts", ic: "i-truck" },
    { id: "20off", t: "20% Off Next Order", cost: 800, cat: "Discounts", ic: "i-tag" },
    { id: "tote", t: "Exclusive Tote Bag", cost: 1500, cat: "Products", ic: "i-bag", thumb: true },
    { id: "vip", t: "VIP Shopping Event Access", cost: 3000, cat: "Experiences", ic: "i-star" }
  ];
  const TOTE = `<svg viewBox="0 0 52 52" aria-hidden="true"><rect width="52" height="52" fill="#EDE9FE"/><path d="M14 20h24l-3 24H17z" fill="#7C3AED"/><path d="M20 20c0-8 12-8 12 0" stroke="#4C1D95" stroke-width="3" fill="none"/><path d="M22 30l4 4 4-4" stroke="#FDE68A" stroke-width="2" fill="none"/></svg>`;
  let rCat = "All", rSort = "lh";
  function renderRewards() {
    const b = balance();
    const list = REWARDS.filter((r) => rCat === "All" || r.cat === rCat).sort((x, y) => (rSort === "lh" ? x.cost - y.cost : y.cost - x.cost));
    $("[data-rewards]").innerHTML = list.map((r) => { const ok = b >= r.cost; return `<article class="rw"><div class="rw-top">${r.thumb ? `<span class="rw-thumb" role="img" aria-label="Tote bag photo">${TOTE}</span>` : `<span class="rw-ico">${icon(r.ic)}</span>`}<span class="rw-cat">${r.cat}</span></div><h3>${r.t}</h3><span class="cost">${n(r.cost)} pts</span><button class="btn" type="button" data-redeem="${r.id}"${ok ? "" : " disabled"}>${ok ? "Redeem" : `Need ${n(r.cost - b)} more pts`}</button></article>`; }).join("");
  }
  $("[data-ctabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-c]"); if (!b) return; rCat = b.dataset.c; $$("[data-c]").forEach((x) => x.setAttribute("aria-selected", x === b)); renderRewards(); });
  $("[data-sort]").addEventListener("change", (e) => { rSort = e.target.value; renderRewards(); });

  function addRow(desc, delta, type) {
    const row = [demoNow(), desc, delta, type, balance() + delta]; row.fresh = true;
    HIST.forEach((h) => (h.fresh = false)); HIST.unshift(row);
    if (delta > 0) tierPts += delta;
    renderAll();
  }
  $("[data-rewards]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-redeem]"); if (!b) return;
    const r = REWARDS.find((x) => x.id === b.dataset.redeem);
    openDlg(`<h3>Redeem ${esc(r.t)}?</h3><div class="calc"><div><span>Current balance</span><span>${n(balance())} pts</span></div><div><span>${esc(r.t)}</span><span>−${n(r.cost)} pts</span></div><div class="t"><span>New balance</span><span>${n(balance() - r.cost)} pts</span></div></div><p style="font-size:14px;color:#6B7280">Redeeming doesn't affect your tier — tiers count points earned this year.</p><button class="btn" type="button" data-confirm>Confirm redemption</button>`);
    $("[data-confirm]", body).addEventListener("click", () => {
      addRow(`Redeemed — ${r.t}`, -r.cost, "redeemed");
      const code = `ELV-${r.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      body.innerHTML = `<h3>Enjoy your reward!</h3><p>${esc(r.t)} is ready. Use this code at checkout:</p><div class="code">${code}</div><p style="font-size:13px;color:#6B7280">Demo code — not valid in a real store.</p><button class="btn" type="button" data-done>Done</button>`;
      $("[data-done]", body).addEventListener("click", () => dlg.close());
      toast(`Redeemed ${r.t} — new balance ${n(balance())} pts`);
    });
  });

  /* ---------- earn actions ---------- */
  const copyRef = () => {
    const v = "https://" + $("[data-ref]").value;
    const ok = () => toast("Referral link copied — share it with a friend!");
    try { navigator.clipboard.writeText(v).then(ok, () => { $("[data-ref]").select(); toast("Press Ctrl/Cmd+C to copy your link"); }); } catch { $("[data-ref]").select(); toast("Press Ctrl/Cmd+C to copy your link"); }
  };
  $$("[data-copy-ref]").forEach((b) => b.addEventListener("click", copyRef));
  $("[data-ref]").addEventListener("click", (e) => e.target.select());
  let connected = false;
  $("[data-connect]").addEventListener("click", (e) => {
    if (connected) { toast("Instagram already connected."); return; }
    connected = true; addRow("Bonus — Connected Instagram", 100, "earned");
    e.currentTarget.textContent = "Connected ✓"; e.currentTarget.classList.add("done");
    toast("+100 points for following us on Instagram (demo)");
  });
  const reviewed = new Set();
  $("[data-review]").addEventListener("click", () => {
    const items = [["8834", "Linen Overshirt"], ["8791", "Ceramic Pour-Over Set"], ["8760", "Merino Throw"]].filter(([o]) => !reviewed.has(o));
    if (!items.length) { toast("You've reviewed all recent purchases — thank you!"); return; }
    let stars = 5;
    openDlg(`<h3>Write a review · +50 pts</h3><form data-rv novalidate><label>Product<select name="p">${items.map(([o, t]) => `<option value="${o}">${t} (Order #${o})</option>`).join("")}</select></label><div><span style="font-weight:600;font-size:14px;color:#111827">Rating</span><div class="rate-s" role="group" aria-label="Rating">${[1, 2, 3, 4, 5].map((s) => `<button type="button" aria-label="${s} star${s > 1 ? "s" : ""}" aria-pressed="true" data-s="${s}">${icon("i-star")}</button>`).join("")}</div></div><label>Your review<textarea name="t" rows="3" placeholder="What did you like?"></textarea></label><p class="err" data-rv-err role="alert"></p><button class="btn" type="submit">Submit review</button></form>`);
    $$("[data-s]", body).forEach((b) => b.addEventListener("click", () => { stars = Number(b.dataset.s); $$("[data-s]", body).forEach((x) => x.setAttribute("aria-pressed", Number(x.dataset.s) <= stars)); }));
    $("[data-rv]", body).addEventListener("submit", (ev) => {
      ev.preventDefault(); const f = ev.target;
      if (f.t.value.trim().length < 20) { $("[data-rv-err]", body).textContent = "Please write at least 20 characters."; return; }
      reviewed.add(f.p.value); addRow("Review — product review", 50, "earned"); dlg.close(); toast("+50 points — thanks for your review!");
    });
  });

  /* ---------- promotions ---------- */
  const triple = new Date(2026, 2, 22, 0, 0, 0).getTime();
  function tickPromo() {
    let ms = Math.max(0, triple - demoNow().getTime());
    const dd = Math.floor(ms / 864e5); ms -= dd * 864e5; const hh = Math.floor(ms / 36e5); ms -= hh * 36e5; const mm = Math.floor(ms / 6e4);
    $('[data-pu="d"]').textContent = dd; $('[data-pu="h"]').textContent = hh; $('[data-pu="m"]').textContent = mm;
    $("[data-pcd]").setAttribute("aria-label", `Triple Points Weekend starts in ${dd} days ${hh} hours ${mm} minutes`);
  }
  tickPromo(); setInterval(tickPromo, 15000);
  $("[data-remind]").addEventListener("click", (e) => {
    const b = e.currentTarget;
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Elevate Rewards//EN", "BEGIN:VEVENT", "UID:platinum-flash-20260328@elevate.example", "DTSTAMP:20260312T100000", "DTSTART;VALUE=DATE:20260328", "SUMMARY:Elevate Platinum Flash Sale — 30% off for Gold & Platinum", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "elevate-platinum-flash-sale.ics"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    b.setAttribute("aria-pressed", "true"); $("span", b).textContent = "Reminder set"; toast("Reminder saved to your calendar file.");
  });

  /* ---------- challenges + badges ---------- */
  const CH = [["Weekend Warrior", "Make 3 purchases this weekend", 500, 1, 3, "i-shield", "Mar 16"], ["Review Rockstar", "Write 5 product reviews", 300, 3, 5, "i-star", "Mar 31"], ["Social Butterfly", "Share 2 products on social media", 200, 0, 2, "i-share", "Mar 25"]];
  $("[data-chal]").innerHTML = CH.map(([t, d, b, p, of, ic, ex]) => `<article class="ch"><div class="ch-top"><span class="ch-ico">${icon(ic)}</span><span class="bonus">+${b} bonus pts</span></div><h3>${t}</h3><p>${d}</p><div class="pbar" role="progressbar" aria-label="${t} progress" aria-valuemin="0" aria-valuemax="${of}" aria-valuenow="${p}"><i data-w="${Math.round((p / of) * 100)}%"></i></div><div class="ch-meta"><span><b>${p}/${of}</b> · ${Math.round((p / of) * 100)}%</span><span>Expires ${ex}</span></div></article>`).join("");
  const BADGES = [
    ["First Purchase", "i-bag", "Made your first purchase", "Jan 15, 2024", "#7C3AED", "#A78BFA"], ["Loyal Customer", "i-heart", "10+ purchases", "Jun 3, 2024", "#EC4899", "#F9A8D4"],
    ["Referral Pro", "i-mega", "5+ successful referrals", "Feb 9, 2025", "#2563EB", "#93C5FD"], ["Review Maven", "i-pencil", "10+ product reviews", "Aug 21, 2025", "#F59E0B", "#FDE68A"],
    ["Big Spender", "i-gem", "$500+ lifetime spend", "Nov 2, 2024", "#0EA5E9", "#7DD3FC"], ["Early Bird", "i-sunrise", "Purchased within 1 hour of a sale launch", "Dec 1, 2025", "#F97316", "#FDBA74"],
    ["Streak Master", "i-flame", "Purchase 4 consecutive weeks", null], ["Social Star", "i-camera", "Share 10 products", null], ["Birthday Club", "i-cake", "Make a birthday-month purchase", null]
  ];
  $("[data-badges]").innerHTML = BADGES.map(([t, ic, d, when, c, c2]) => `<li class="badge${when ? "" : " locked"}"><button type="button" style="--c:${c || "#9CA3AF"};--c2:${c2 || "#D1D5DB"}" aria-label="${t} — ${when ? `earned ${when}` : "locked"}: ${d}" aria-describedby="tip-${t.replace(/\W/g, "")}">${icon(ic)}${when ? "" : `<span class="lk">${icon("i-lock")}</span>`}</button><span>${t}</span><span class="tip" role="tooltip" id="tip-${t.replace(/\W/g, "")}"><b>${t}</b>${d}<br>${when ? `Earned ${when}` : "Locked"}</span></li>`).join("");
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { $$(".pbar i", e.target).forEach((i) => (i.style.width = i.dataset.w)); io.unobserve(e.target); } }), { threshold: 0.3 }) : null;
  io ? io.observe($("[data-chal]")) : $$(".pbar i").forEach((i) => (i.style.width = i.dataset.w));

  /* ---------- FAQ: smooth animation, one open ---------- */
  const faqs = $$("[data-faq] details");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  faqs.forEach((d) => {
    const s = $("summary", d), a = $(".ans", d);
    s.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        if (reduce) { d.open = false; return; }
        a.animate([{ height: `${a.offsetHeight}px` }, { height: "0px" }], { duration: 220, easing: "ease" }).onfinish = () => (d.open = false);
      } else {
        faqs.forEach((o) => { if (o !== d) o.open = false; });
        d.open = true; if (!reduce) a.animate([{ height: "0px" }, { height: `${a.scrollHeight}px` }], { duration: 260, easing: "ease" });
      }
    });
  });

  /* ---------- join / sign in ---------- */
  $("[data-join]").addEventListener("click", () => {
    openDlg(`<h3>Join Elevate Rewards</h3><p>Free forever. Earn 1 point per $1 from your first order.</p><form data-jf novalidate><label>Email<input type="email" name="email" autocomplete="email"></label><p class="err" data-jerr role="alert"></p><button class="btn" type="submit">Create free account</button></form>`);
    $("[data-jf]", body).addEventListener("submit", (e) => { e.preventDefault(); if (!validEmail(e.target.email.value.trim())) { $("[data-jerr]", body).textContent = "Please enter a valid email."; return; } body.innerHTML = `<h3>Welcome to Elevate!</h3><p>Your account would be created for ${esc(e.target.email.value.trim())}. (Demo — nothing is sent.)</p>`; });
  });
  $("[data-signin]").addEventListener("click", () => toast("You're already signed in as Sarah (demo account)."));

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input, select, .btn", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} isn't part of this demo page.`); } });

  function renderAll() {
    const b = balance();
    $("[data-balance]").textContent = n(b); $("[data-mbal]").textContent = `${n(b)} pts`;
    renderTier(); renderHist(); renderSnap(); renderRewards();
  }
  $("[data-asof]").textContent = fmtD(new Date(DEMO0));
  renderAll();
})();
