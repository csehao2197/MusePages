(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const KEY = "trigly-v1";
  const store = { get(d) { try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : d; } catch { return d; } }, set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } } };
  const DAY = 864e5;

  const POSTS = [
    { id: "p1", t: "5 lighting setups under $50", bg: "radial-gradient(circle at 30% 30%,#ffd166,transparent 45%),linear-gradient(140deg,#6c4cf5,#17131f)" },
    { id: "p2", t: "My Lightroom preset pack", bg: "linear-gradient(160deg,#ff5a36,#ffb347)" },
    { id: "p3", t: "Golden hour in 60 seconds", bg: "linear-gradient(200deg,#f9c74f,#f3722c 60%,#6c4cf5)" },
    { id: "p4", t: "Studio tour 2026", bg: "linear-gradient(140deg,#2b2536,#5a4d73)" },
    { id: "p5", t: "Phone vs camera test", bg: "linear-gradient(140deg,#43aa8b,#277da1)" },
    { id: "p6", t: "Behind the brand shoot", bg: "linear-gradient(140deg,#d7f25c,#43aa8b)" },
  ];
  const seedAutos = () => [
    { id: "a1", name: "Lighting guide", active: true, triggers: ["comment", "dm"], keywords: ["guide", "lighting"], posts: ["p1"], mode: "MESSAGE", message: "Hey {name}, here's the lighting guide: trigly.link/light5. Want my preset pack too?", prompt: "", counts: { comment: 412, dm: 96 }, created: Date.now() - 20 * DAY },
    { id: "a2", name: "Preset pricing", active: true, triggers: ["dm"], keywords: ["price", "cost", "how much"], posts: [], mode: "SMARTAI", message: "", prompt: "You sell a Lightroom preset pack of 24 presets for $19 at trigly.link/presets. Be warm and brief; mention it works on mobile and desktop.", counts: { comment: 0, dm: 188 }, created: Date.now() - 12 * DAY },
    { id: "a3", name: "Brand collabs", active: false, triggers: ["comment", "dm"], keywords: ["collab", "partnership", "sponsor"], posts: [], mode: "SMARTAI", message: "", prompt: "Thank them, ask for the brand name and budget range, and point them to hello@mayashoots.example.", counts: { comment: 12, dm: 41 }, created: Date.now() - 5 * DAY },
  ];
  const seedSeries = () => { let s = 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280); return Array.from({ length: 14 }, (_, i) => ({ d: Date.now() - (13 - i) * DAY, dm: Math.round(14 + r() * 18 + i * 1.2), comment: Math.round(22 + r() * 26 + i * 1.8) })); };
  const fresh = () => ({ user: null, plan: "FREE", integration: null, webhook: false, automations: seedAutos(), dms: [], series: seedSeries() });
  let db = store.get(null); if (!db || !Array.isArray(db.automations)) db = fresh();
  const save = () => store.set(db);

  /* ---------- engine ---------- */
  const firstSentences = (s, n = 2) => s.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, n).join(" ").replace(/\s+/g, " ").trim();
  function smartReply(prompt, text, name) {
    const t = text.toLowerCase(), price = prompt.match(/\$\d+(?:\.\d\d)?/)?.[0], link = prompt.match(/\b[a-z0-9-]+\.(?:link|com|co|io)\/[\w/-]+/i)?.[0], mail = prompt.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0], who = name ? `, ${name}` : "";
    let out;
    if (/(price|cost|how much|\$|expensive|buy)/.test(t)) out = `${price ? `It's ${price} for the full pack${who}` : `Happy to help with pricing${who}`}${/mobile|desktop/i.test(prompt) ? ", and it works on both mobile and desktop" : ""}. ${link ? `You can grab it here: ${link}` : "I'll send the details in a sec."}`;
    else if (/(collab|partner|sponsor|brand|work together)/.test(t)) out = `Thanks so much for reaching out${who}! ${mail ? `Could you send your brand name and budget range to ${mail}?` : "What's your brand name and budget range?"}`;
    else if (/(link|guide|where|send)/.test(t)) out = `Of course${who}! ${link ? `Here you go: ${link}` : "Sending it over now."}`;
    else if (/(ship|deliver|when)/.test(t)) out = `Great question${who}. It's a digital download, so you get it instantly after checkout.`;
    else out = `Thanks for the message${who}! ${link ? `Everything you need is here: ${link}` : "I'll get back to you shortly."}`;
    return firstSentences(out, 2);
  }
  function match(list, text, src, postId) {
    for (const a of list) {
      if (!a.active || !a.triggers.includes(src)) continue;
      if (src === "comment" && a.posts.length && !a.posts.includes(postId)) continue;
      const k = a.keywords.find((k) => new RegExp(`(^|\\W)${reEsc(k)}`, "i").test(text));
      if (k) return { a, k };
    }
    return null;
  }
  const replyFor = (a, text, name) => (a.mode === "SMARTAI" ? smartReply(a.prompt, text, name) : (a.message || "").replace(/\{name\}/g, name || "there"));
  function resultHTML(text, src, res, extra = "") {
    const head = `<div class="bub in">${esc(text)}</div>`;
    if (!res) return `${head}<p class="none">No automation matched. Nothing is sent, so you can reply yourself.</p>${extra}`;
    if (res.blocked) return `${head}<p class="fired">${icon("i-lock")}${esc(res.a.name)} matched “${esc(res.k)}”, but Smart AI needs the Smart AI plan. Nothing sent.</p>`;
    return `${head}<p class="fired">${icon("i-zap")}${esc(res.a.name)} · keyword “${esc(res.k)}” <span class="mode${res.a.mode === "MESSAGE" ? " msg" : ""}">${res.a.mode}</span></p>${src === "comment" ? `<p class="muted" style="margin:0;font-size:12px">Public reply:</p><div class="bub">${esc(res.pub || "Sent you a DM!")}</div>` : ""}<p class="muted" style="margin:0;font-size:12px">${src === "comment" ? "Then a direct message:" : "Direct message reply:"}</p><div class="bub">${esc(res.out)}</div>${extra}`;
  }

  /* ---------- landing: phone animation + playground ---------- */
  const phone = $("[data-phone]"); let ps = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) phone.className = "phone s3"; else setInterval(() => { ps = (ps + 1) % 5; phone.className = `phone${ps >= 1 && ps <= 3 ? ` s${ps}` : ps === 4 ? " s3" : ""}`; }, 1600);
  const PG = [
    { id: "g1", name: "Lighting guide", active: true, triggers: ["comment", "dm"], keywords: ["guide"], posts: [], mode: "MESSAGE", message: "Hey {name}, here's the lighting guide: trigly.link/light5. Want my preset pack too?" },
    { id: "g2", name: "Preset pricing", active: true, triggers: ["comment", "dm"], keywords: ["price", "cost", "how much"], posts: [], mode: "SMARTAI", prompt: "Preset pack of 24 for $19 at trigly.link/presets, works on mobile and desktop." },
    { id: "g3", name: "Brand collabs", active: true, triggers: ["comment", "dm"], keywords: ["collab", "sponsor"], posts: [], mode: "SMARTAI", prompt: "Ask for brand and budget, email hello@mayashoots.example." },
  ];
  $("[data-pgrules]").innerHTML = PG.map((a) => `<li><span class="k">${a.keywords[0].toUpperCase()}</span>${esc(a.name)} · ${a.mode === "MESSAGE" ? "static message" : "Smart AI"}</li>`).join("");
  $("[data-pgchips]").innerHTML = ["GUIDE please!", "how much is the preset pack?", "open to a collab with our brand?", "love this edit"].map((x) => `<button type="button" data-pgchip>${esc(x)}</button>`).join("");
  function runPg(text) {
    text = text.trim(); if (!text) return;
    const src = $("[data-pgform] input[name=src]:checked").value, res = match(PG, text, src, "p1");
    if (res) { res.out = replyFor(res.a, text, "Sam"); res.pub = "Just sent you a DM, Sam!"; }
    $("[data-pgout]").innerHTML = resultHTML(text, src, res);
  }
  $("[data-pgform]").addEventListener("submit", (e) => { e.preventDefault(); runPg($("#pgtext").value); $("#pgtext").value = ""; });
  $("[data-pgchips]").addEventListener("click", (e) => { const b = e.target.closest("[data-pgchip]"); if (b) runPg(b.textContent); });

  /* ---------- router ---------- */
  const landing = $("[data-landing]"), app = $("[data-app]");
  const route = () => (location.hash.startsWith("#/") ? location.hash.slice(2) : "");
  function render() {
    const r = route(), inApp = r.startsWith("dashboard") || r.startsWith("automation");
    landing.hidden = inApp; app.hidden = !inApp; $("[data-landnav]").hidden = inApp; $("[data-foot]").hidden = inApp;
    $("[data-topcta]").innerHTML = inApp && db.user ? `<span class="muted hide-s" style="font-weight:600">${esc(db.user.first)} ${esc(db.user.last)}</span><button type="button" class="ib" data-signout aria-label="Sign out">${icon("i-logout")}</button>` : db.user ? `<a class="btn dark sm" href="#/dashboard">Open dashboard</a>` : `<a class="btn ghost sm" href="#/dashboard">Sign in</a><a class="btn primary sm" href="#/dashboard">Start free</a>`;
    document.title = inApp ? "Dashboard — Trigly" : "Trigly — Turn Comments and DMs into Conversations, Automatically";
    if (!inApp) return;
    if (!db.user) return renderSignIn();
    const [a, b] = r.split("/");
    if (a === "automation") { const au = db.automations.find((x) => x.id === b); return au ? renderEditor(au) : (location.hash = "#/dashboard/automations"); }
    renderApp(b || "overview");
  }
  addEventListener("hashchange", () => { const r = route(); render(); if (r) { $("#main").focus({ preventScroll: true }); scrollTo({ top: 0, behavior: "instant" }); } });

  /* ---------- sign in (Clerk stand-in) ---------- */
  function renderSignIn() {
    app.innerHTML = `<div class="wrap"><div class="card signin"><h1 style="font-size:34px;font-weight:800">Sign in to Trigly</h1><p class="muted">Demo sign-in: your profile stays in this browser. No password, no email is sent.</p>
      <form class="stack" style="margin-top:16px" data-signin novalidate><div class="row2"><label class="fld">First name<input name="first" autocomplete="given-name" required></label><label class="fld">Last name<input name="last" autocomplete="family-name" required></label></div><label class="fld">Email<input name="email" type="email" autocomplete="email" required></label><p class="err" data-err role="alert"></p><button class="btn primary full" type="submit">Continue</button><button class="btn ghost full" type="button" data-demo>Use demo creator (Maya Lopez)</button></form></div></div>`;
  }
  function signIn(first, last, email) { db.user = { id: `user_${uid()}`, first, last, email, created: Date.now() }; save(); toast(`Welcome, ${first}`); location.hash = "#/dashboard"; render(); }

  /* ---------- app shell ---------- */
  const NAV = [["overview", "Overview", "i-home"], ["automations", "Automations", "i-flow"], ["integrations", "Integrations", "i-link"], ["billing", "Billing", "i-card"]];
  const shell = (cur, inner) => `<div class="app"><nav class="side" aria-label="Dashboard">${NAV.map(([k, l, ic]) => `<a href="#/dashboard/${k}" ${cur === k ? 'aria-current="page"' : ""}>${icon(ic)}${l}</a>`).join("")}<div class="plan-card"><b>${db.plan === "PRO" ? "Smart AI plan" : "Free plan"}</b>${db.plan === "PRO" ? "AI replies unlocked." : `<a href="#/dashboard/billing" style="padding:0;min-height:0;display:inline;color:var(--violet)">Upgrade for AI replies</a>`}</div></nav><section class="pane">${inner}</section></div>`;
  const totals = () => db.automations.reduce((t, a) => ({ comment: t.comment + a.counts.comment, dm: t.dm + a.counts.dm }), { comment: 0, dm: 0 });
  const connectBanner = () => (db.integration ? "" : `<div class="banner"><p><b>Connect your Instagram account</b> so automations can reply to real comments and DMs.</p><a class="btn sm" href="#/dashboard/integrations">Connect account</a></div>`);
  function renderApp(tab) {
    let inner = "";
    if (tab === "overview") {
      const t = totals(), act = db.automations.filter((a) => a.active).length;
      inner = `<div class="pane-h"><div><h1>Hi ${esc(db.user.first)}</h1><p>${db.integration ? `Replying as <b>${esc(db.integration.handle)}</b>` : "Not connected yet"} · ${act} active automation${act === 1 ? "" : "s"}</p></div><a class="btn primary sm" href="#/dashboard/automations" data-new>${icon("i-plus")}New automation</a></div>${connectBanner()}
        <div class="tiles"><div class="tile"><span>Comments replied</span><b data-tc>${t.comment.toLocaleString()}</b></div><div class="tile"><span>DMs replied</span><b data-td>${t.dm.toLocaleString()}</b></div><div class="tile"><span>Active automations</span><b>${act}</b></div><div class="tile"><span>Median reply time</span><b>3.2s</b></div></div>
        <div class="card"><div class="card-h"><h2>Replies, last 14 days</h2><div class="legend"><span><i style="background:var(--s1)"></i>DMs</span><span><i style="background:var(--s2)"></i>Comments</span><button type="button" class="btn ghost sm" data-tbl aria-pressed="false">${icon("i-table")}Table</button></div></div><div class="chart" data-chart></div><div data-tblbox hidden></div></div>
        <div class="grid2"><div class="card"><div class="card-h"><h2>Top automations</h2></div><table class="tbl"><thead><tr><th>Automation</th><th class="n">Comments</th><th class="n">DMs</th></tr></thead><tbody>${db.automations.slice().sort((a, b) => b.counts.comment + b.counts.dm - a.counts.comment - a.counts.dm).map((a) => `<tr><td><a href="#/automation/${a.id}">${esc(a.name)}</a></td><td class="n">${a.counts.comment}</td><td class="n">${a.counts.dm}</td></tr>`).join("")}</tbody></table></div>
        <div class="card"><div class="card-h"><h2>Recent replies</h2></div>${histHTML(db.dms.slice(0, 6))}</div></div>`;
    } else if (tab === "automations") {
      inner = `<div class="pane-h"><div><h1>Automations</h1><p>The first active match wins. Put post-specific automations first.</p></div><button type="button" class="btn primary sm" data-new>${icon("i-plus")}Create automation</button></div>${connectBanner()}
        <div class="alist" data-alist>${db.automations.length ? db.automations.map(autoCard).join("") : `<div class="empty"><p>No automations yet.</p><button type="button" class="btn primary sm" data-new>${icon("i-plus")}Create your first automation</button></div>`}</div>`;
    } else if (tab === "integrations") {
      const ig = db.integration;
      inner = `<div class="pane-h"><div><h1>Integrations</h1><p>Connect a Professional (Creator or Business) account linked to a Facebook Page.</p></div></div>
        <div class="card"><div class="integ"><span class="logo-box">${icon("i-camera")}</span><div class="grow"><h3>Instagram</h3><p>${ig ? `Connected as <b>${esc(ig.handle)}</b> since ${new Date(ig.at).toLocaleDateString()}` : "Comments and direct messages"}</p></div>${ig ? `<span class="status">${icon("i-check")}Connected</span><button type="button" class="btn ghost sm" data-disconnect>Disconnect</button>` : `<button type="button" class="btn primary sm" data-connect>Connect account</button>`}</div>
        ${ig ? `<dl class="kv"><dt>Access token</dt><dd>${esc(ig.token)} (stored server-side, encrypted)</dd><dt>Permissions</dt><dd>instagram_basic, instagram_manage_comments, instagram_manage_messages</dd></dl>` : ""}</div>
        <div class="card" style="margin-top:18px"><div class="card-h"><h2>Webhook</h2>${db.webhook ? `<span class="status">${icon("i-check")}Verified</span>` : `<span class="status off">Not verified</span>`}</div><dl class="kv"><dt>Callback URL</dt><dd>https://app.trigly.example/api/webhook/instagram</dd><dt>Verify token</dt><dd>trigly_verify_${esc((db.user.id || "").slice(5, 11))}</dd><dt>Fields</dt><dd>comments, messages</dd></dl><p class="muted" style="margin:14px 0 10px;font-size:14.5px">Meta calls the callback with <code>hub.mode=subscribe</code>, your verify token and a <code>hub.challenge</code>. Trigly echoes the challenge only when the token matches.</p><div data-wh></div><button type="button" class="btn dark sm" data-verify ${ig ? "" : "disabled"}>Send test verification</button>${ig ? "" : `<p class="muted" style="font-size:13px;margin:8px 0 0">Connect your account first.</p>`}</div>`;
    } else if (tab === "billing") {
      inner = `<div class="pane-h"><div><h1>Billing</h1><p>Payments run through Stripe Checkout. This demo uses a simulated test-mode checkout.</p></div></div>
        <div class="plans" style="margin-top:0"><article class="plan${db.plan === "FREE" ? "" : ""}"><h3>Free</h3><p class="price"><b>$0</b>/month</p><ul><li>Unlimited keyword automations</li><li>Static message replies</li><li>Post targeting and counters</li></ul>${db.plan === "FREE" ? `<button class="btn ghost full" disabled>Current plan</button>` : `<button type="button" class="btn ghost full" data-downgrade>Switch to Free</button>`}</article>
        <article class="plan pro"><h3>Smart AI</h3><p class="price"><b>$99</b>/month</p><ul><li>AI replies with conversation context</li><li>Custom AI brief per automation</li><li>Advanced analytics</li></ul>${db.plan === "PRO" ? `<button class="btn primary full" disabled>Current plan</button>` : `<button type="button" class="btn primary full" data-upgrade>Upgrade to Smart AI</button>`}</article></div>`;
    }
    app.innerHTML = shell(tab, inner);
    if (tab === "overview") drawChart();
  }
  const MODEL = (a) => (a.mode === "SMARTAI" ? `<span class="pill ai">${icon("i-spark")}Smart AI</span>` : `<span class="pill">${icon("i-msg")}Message</span>`);
  const autoCard = (a) => `<article class="auto${a.active ? "" : " off"}" data-auto="${a.id}"><div><h3><a href="#/automation/${a.id}">${esc(a.name)}</a></h3><div class="meta">${MODEL(a)}${a.triggers.map((t) => `<span class="pill">${icon(t === "dm" ? "i-msg" : "i-comment")}${t === "dm" ? "DMs" : "Comments"}</span>`).join("")}${a.keywords.slice(0, 4).map((k) => `<span class="kw">${esc(k)}</span>`).join("")}${a.keywords.length > 4 ? `<span>+${a.keywords.length - 4}</span>` : ""}${a.posts.length ? `<span>· ${a.posts.length} post${a.posts.length > 1 ? "s" : ""}</span>` : ""}</div><div class="meta">${a.counts.comment} comments · ${a.counts.dm} DMs replied${a.mode === "SMARTAI" && db.plan !== "PRO" ? ` · <b style="color:var(--coral-d)">Needs Smart AI plan</b>` : ""}</div></div>
    <div class="r"><button type="button" class="sw" role="switch" aria-checked="${a.active}" data-toggle="${a.id}" aria-label="${a.active ? "Deactivate" : "Activate"} ${esc(a.name)}"></button><a class="ib" href="#/automation/${a.id}" aria-label="Edit ${esc(a.name)}">${icon("i-flow")}</a><button type="button" class="ib" data-del="${a.id}" aria-label="Delete ${esc(a.name)}">${icon("i-trash")}</button></div></article>`;
  const histHTML = (list) => (list.length ? `<ul class="hist">${list.map((d) => `<li><div class="who"><span>${esc(d.who)} · ${d.src === "dm" ? "DM" : "comment"}</span><span>${new Date(d.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><p>${esc(d.in)}</p><p class="out">↳ ${esc(d.out)}</p></li>`).join("")}</ul>` : `<p class="muted" style="margin:0">No replies yet in this session. Use “Test a message” on any automation to simulate a webhook.</p>`);

  /* chart: stacked bars, one axis, tooltip + table view */
  function drawChart() {
    const box = $("[data-chart]"); if (!box) return;
    const W = box.clientWidth || 700, H = 240, L = 36, B = 26, T = 8, s = db.series, max = Math.max(...s.map((d) => d.dm + d.comment)), top = Math.ceil(max / 20) * 20, step = (W - L) / s.length, bw = Math.min(24, step * 0.58);
    const y = (v) => T + (H - T - B) * (1 - v / top), ticks = [0, top / 4, top / 2, (3 * top) / 4, top];
    const rTop = (x, y0, w, h) => { const r = Math.min(4, h); return `M${x} ${y0 + h}V${y0 + r}a${r} ${r} 0 0 1 ${r}-${r}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}V${y0 + h}z`; };
    const fmt = (t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    box.innerHTML = `<svg role="img" aria-label="Stacked bar chart of DMs and comments replied per day for the last 14 days" viewBox="0 0 ${W} ${H}">${ticks.map((v) => `<line class="gl" x1="${L}" x2="${W}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${L - 8}" y="${y(v) + 4}" text-anchor="end">${v}</text>`).join("")}
      ${s.map((d, i) => { const x = L + i * step + (step - bw) / 2, hd = y(0) - y(d.dm), hc = y(0) - y(d.comment); return `<g class="col" tabindex="0" data-i="${i}" aria-label="${fmt(d.d)}: ${d.dm} DMs, ${d.comment} comments"><rect class="hit" x="${L + i * step}" y="${T}" width="${step}" height="${H - T - B}"/><rect class="seg" x="${x}" y="${y(d.dm)}" width="${bw}" height="${hd}" fill="var(--s1)"/><path class="seg" d="${rTop(x, y(0) - hd - hc - 2 + 0, bw, Math.max(0, hc - 0))}" fill="var(--s2)"/>${i % 2 === 0 || s.length < 9 ? `<text class="ax" x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${fmt(d.d).replace(/\s/, " ")}</text>` : ""}</g>`; }).join("")}</svg><div class="tip" hidden data-tip></div>`;
    const tip = $("[data-tip]", box), show = (g) => { const d = s[+g.dataset.i], r = g.getBoundingClientRect(), br = box.getBoundingClientRect(); tip.hidden = false; tip.innerHTML = `<b>${fmt(d.d)}</b><span><i style="background:var(--s1)"></i>DMs ${d.dm}</span><br><span><i style="background:var(--s2)"></i>Comments ${d.comment}</span>`; tip.style.left = `${Math.min(br.width - 70, Math.max(70, r.left - br.left + r.width / 2))}px`; tip.style.top = `${y(d.dm + d.comment) - 8}px`; };
    $$(".col", box).forEach((g) => { g.addEventListener("pointerenter", () => show(g)); g.addEventListener("focus", () => show(g)); g.addEventListener("pointerleave", () => (tip.hidden = true)); g.addEventListener("blur", () => (tip.hidden = true)); });
    const tb = $("[data-tblbox]"); if (tb) tb.innerHTML = `<table class="tbl"><caption class="sr">Replies per day</caption><thead><tr><th>Day</th><th class="n">DMs</th><th class="n">Comments</th><th class="n">Total</th></tr></thead><tbody>${s.map((d) => `<tr><td>${fmt(d.d)}</td><td class="n">${d.dm}</td><td class="n">${d.comment}</td><td class="n">${d.dm + d.comment}</td></tr>`).join("")}</tbody></table>`;
  }
  let rT; addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(drawChart, 120); });

  /* ---------- automation editor ---------- */
  function renderEditor(a) {
    const locked = db.plan !== "PRO";
    app.innerHTML = shell("automations", `<a class="btn ghost sm" href="#/dashboard/automations" style="margin-bottom:16px">${icon("i-back")}Automations</a>
      <div class="pane-h"><div style="flex:1;min-width:240px"><label class="fld"><span class="sr">Automation name</span><input data-name value="${esc(a.name)}" maxlength="60" style="font:800 30px var(--display);letter-spacing:-.03em;border-color:transparent;background:transparent;padding:4px 8px"></label></div><div class="r" style="display:flex;gap:10px;align-items:center"><span class="muted" data-actlabel>${a.active ? "Active" : "Inactive"}</span><button type="button" class="sw" role="switch" aria-checked="${a.active}" data-toggle="${a.id}" aria-label="Automation active"></button></div></div>
      <div class="edit"><form class="stack" data-editor novalidate>
        <div class="card"><div class="step-h"><span class="n">1</span><h2>When this happens</h2></div><div class="checks" role="group" aria-label="Triggers"><label class="checkc"><input type="checkbox" name="trg" value="comment" ${a.triggers.includes("comment") ? "checked" : ""}>${icon("i-comment")}Someone comments</label><label class="checkc"><input type="checkbox" name="trg" value="dm" ${a.triggers.includes("dm") ? "checked" : ""}>${icon("i-msg")}Someone sends a DM</label></div>
          <label class="fld" style="margin-top:16px">Keywords <small>Press Enter or comma to add. Matching ignores case.</small><div class="kwin"><input data-kwin maxlength="30" placeholder="e.g. guide"><button type="button" class="btn dark sm" data-kwadd>Add</button></div></label><div class="chips" data-chips></div>
          <div data-postsbox ${a.triggers.includes("comment") ? "" : "hidden"} style="margin-top:16px"><p class="fld" style="margin:0">Only on these posts <small>Leave empty to listen on every post.</small></p><div class="posts" data-posts>${POSTS.map((p) => `<button type="button" class="post" style="background:${p.bg}" data-post="${p.id}" aria-pressed="${a.posts.includes(p.id)}" aria-label="Post: ${esc(p.t)}"><span>${esc(p.t)}</span></button>`).join("")}</div></div></div>
        <div class="card"><div class="step-h"><span class="n">2</span><h2>Reply with</h2></div><div class="modes" role="radiogroup" aria-label="Listener mode"><label class="modec"><input type="radio" name="mode" value="MESSAGE" ${a.mode === "MESSAGE" ? "checked" : ""}><b>${icon("i-msg")}Message</b><span>Send exactly what you write.</span></label><label class="modec"><input type="radio" name="mode" value="SMARTAI" ${a.mode === "SMARTAI" ? "checked" : ""}><b>${icon("i-spark")}Smart AI</b><span>Short, context-aware replies from your brief.</span>${locked ? `<span class="lock">PRO</span>` : ""}</label></div>
          <label class="fld" style="margin-top:14px" data-msgbox ${a.mode === "MESSAGE" ? "" : "hidden"}>Message <small>Use {name} for the follower's first name.</small><textarea data-message maxlength="500">${esc(a.message)}</textarea></label>
          <label class="fld" style="margin-top:14px" data-promptbox ${a.mode === "SMARTAI" ? "" : "hidden"}>AI brief <small>What should the AI know and do? Replies stay under two sentences.</small><textarea data-prompt maxlength="600">${esc(a.prompt)}</textarea></label></div>
        <p class="err" data-err role="alert"></p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" type="submit">${icon("i-check")}Save automation</button><button type="button" class="btn ghost" data-del="${a.id}">${icon("i-trash")}Delete</button></div>
      </form>
      <div class="stack"><div class="card"><div class="card-h"><h2>Replies</h2></div><div class="counter"><div><b data-cc>${a.counts.comment}</b><span>comments</span></div><div><b data-cd>${a.counts.dm}</b><span>DMs</span></div></div></div>
        <div class="sim"><h2>Test a message</h2><p class="muted" style="color:#c9c2d3;margin:4px 0 12px;font-size:14px">Simulates the webhook event. All of your active automations are checked, in order.</p>
          <div class="seg" role="radiogroup" aria-label="Event type"><label><input type="radio" name="simsrc" value="comment" checked> Comment</label><label><input type="radio" name="simsrc" value="dm"> DM</label></div>
          <div class="row2" style="margin-bottom:8px"><label class="sr" for="simname">Follower name</label><input id="simname" class="pg-in-like" value="Alex" maxlength="20" style="min-height:44px;border-radius:999px;border:1px solid #3b3350;background:#17131f;color:#fff;padding:0 16px"><label class="sr" for="simpost">Post</label><select id="simpost" style="min-height:44px;border-radius:999px;border:1px solid #3b3350;background:#17131f;color:#fff;padding:0 12px">${POSTS.map((p) => `<option value="${p.id}">${esc(p.t)}</option>`).join("")}</select></div>
          <form class="pg-in" data-simform><label class="sr" for="simtext">Message text</label><input id="simtext" maxlength="160" placeholder="Type what the follower writes" autocomplete="off"><button class="btn primary sm" type="submit">${icon("i-send")}Send</button></form>
          <div class="pg-out" data-simout aria-live="polite"><p class="muted">The result shows here.</p></div></div>
        <div class="card"><div class="card-h"><h2>History</h2></div><div data-hist>${histHTML(db.dms.filter((d) => d.autoId === a.id).slice(0, 8))}</div></div></div></div>`);
    let kws = a.keywords.slice();
    const chips = () => { $("[data-chips]").innerHTML = kws.map((k) => `<span class="chip">${esc(k)}<button type="button" data-rmkw="${esc(k)}" aria-label="Remove keyword ${esc(k)}">${icon("i-x")}</button></span>`).join("") || `<span class="muted" style="font-size:14px">No keywords yet.</span>`; };
    chips();
    const addKw = () => { const inp = $("[data-kwin]"); inp.value.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean).forEach((k) => { if (!kws.includes(k) && kws.length < 20) kws.push(k); }); inp.value = ""; chips(); inp.focus(); };
    $("[data-kwin]").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addKw(); } });
    $("[data-kwadd]").addEventListener("click", addKw);
    $("[data-chips]").addEventListener("click", (e) => { const b = e.target.closest("[data-rmkw]"); if (b) { kws = kws.filter((k) => k !== b.dataset.rmkw); chips(); } });
    $("[data-posts]").addEventListener("click", (e) => { const b = e.target.closest("[data-post]"); if (b) b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") !== "true"); });
    const form = $("[data-editor]");
    form.addEventListener("change", (e) => {
      if (e.target.name === "trg") $("[data-postsbox]").hidden = !$('[name=trg][value=comment]').checked;
      if (e.target.name === "mode") {
        if (e.target.value === "SMARTAI" && db.plan !== "PRO") { $('[name=mode][value=MESSAGE]').checked = true; upgradeDialog("Smart AI replies are part of the Smart AI plan."); return; }
        $("[data-msgbox]").hidden = e.target.value !== "MESSAGE"; $("[data-promptbox]").hidden = e.target.value !== "SMARTAI";
      }
    });
    form.addEventListener("submit", (e) => {
      if (e.target !== form) return;
      e.preventDefault();
      const name = $("[data-name]").value.trim(), triggers = $$("[name=trg]:checked").map((x) => x.value), mode = $("[name=mode]:checked").value, message = $("[data-message]").value.trim(), prompt = $("[data-prompt]").value.trim(), err = $("[data-err]");
      if ($("[data-kwin]").value.trim()) addKw();
      const problem = !name ? "Give the automation a name." : !triggers.length ? "Choose at least one trigger." : !kws.length ? "Add at least one keyword." : mode === "MESSAGE" && !message ? "Write the message to send." : mode === "SMARTAI" && !prompt ? "Write a brief for the AI." : "";
      if (problem) { err.textContent = problem; return; }
      err.textContent = "";
      Object.assign(a, { name, triggers, keywords: kws.slice(), mode, message, prompt, posts: triggers.includes("comment") ? $$("[data-post][aria-pressed=true]").map((b) => b.dataset.post) : [] });
      save(); toast("Automation saved");
    });
    $("[data-simform]").addEventListener("submit", (e) => {
      e.preventDefault(); const text = $("#simtext").value.trim(); if (!text) return;
      const src = $("[name=simsrc]:checked").value, name = $("#simname").value.trim() || "there", post = $("#simpost").value, out = $("[data-simout]");
      if (!db.integration) { out.innerHTML = `<div class="bub in">${esc(text)}</div><p class="none">No connected account, so Trigly can't receive this event. Connect Instagram under Integrations.</p>`; return; }
      const res = match(db.automations, text, src, post);
      if (res && res.a.mode === "SMARTAI" && db.plan !== "PRO") res.blocked = true;
      else if (res) {
        res.out = replyFor(res.a, text, name); res.pub = `Sent you a DM, ${name}!`;
        res.a.counts[src]++; db.dms.unshift({ at: Date.now(), autoId: res.a.id, who: name, src, in: text, out: res.out }); db.dms = db.dms.slice(0, 100);
        db.series[db.series.length - 1][src === "dm" ? "dm" : "comment"]++; save();
        $("[data-cc]").textContent = a.counts.comment; $("[data-cd]").textContent = a.counts.dm;
        $("[data-hist]").innerHTML = histHTML(db.dms.filter((d) => d.autoId === a.id).slice(0, 8));
      }
      out.innerHTML = resultHTML(text, src, res); $("#simtext").value = "";
    });
  }

  /* ---------- dialogs ---------- */
  const dlg = $("[data-dlg]"), dlgIn = $("[data-dlgin]");
  const openDlg = (html) => { dlgIn.innerHTML = html; dlg.showModal(); };
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  function upgradeDialog(reason) { openDlg(`<div class="dlg-h"><h2 id="dlg-h">Unlock Smart AI</h2><button type="button" class="ib" data-close aria-label="Close">${icon("i-x")}</button></div><p>${esc(reason)} Short, context-aware replies written from your brief, $99/month.</p><button type="button" class="btn primary full" data-checkout>Upgrade to Smart AI</button><button type="button" class="btn ghost full" data-close>Not now</button>`); }
  function checkoutDialog() { openDlg(`<div class="dlg-h"><h2 id="dlg-h">Checkout · Smart AI</h2><button type="button" class="ib" data-close aria-label="Close">${icon("i-x")}</button></div><p class="test">Test mode: no real payment. Use card 4242 4242 4242 4242.</p><form class="stack" style="gap:12px" data-pay novalidate><label class="fld">Card number<input name="card" inputmode="numeric" autocomplete="off" value="4242 4242 4242 4242"></label><div class="row2"><label class="fld">Expiry<input name="exp" placeholder="MM / YY" value="12 / 29"></label><label class="fld">CVC<input name="cvc" inputmode="numeric" value="123" maxlength="4"></label></div><p class="err" data-payerr role="alert"></p><button class="btn primary full" type="submit">Pay $99.00</button></form>`); }
  function connectDialog() { openDlg(`<div class="dlg-h"><h2 id="dlg-h">Connect Instagram</h2><button type="button" class="ib" data-close aria-label="Close">${icon("i-x")}</button></div><p>Simulated authorization screen. Trigly will be able to:</p><ul class="perm"><li>${icon("i-check")}Read your profile and posts</li><li>${icon("i-check")}Read and reply to comments</li><li>${icon("i-check")}Read and send direct messages</li></ul><label class="fld">Account handle<input data-handle value="@${esc((db.user.first + "." + db.user.last).toLowerCase().replace(/[^a-z.]/g, ""))}" maxlength="31"></label><p class="err" data-cerr role="alert"></p><button type="button" class="btn primary full" data-allow>Allow access</button>`); }
  dlg.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-checkout")) checkoutDialog();
    if (b.hasAttribute("data-allow")) { const h = $("[data-handle]").value.trim(); if (!/^@[a-z0-9._]{2,30}$/i.test(h)) { $("[data-cerr]").textContent = "Use a handle like @your.name (letters, numbers, dots, underscores)."; return; } db.integration = { handle: h, at: Date.now(), token: `IGQV…${uid().slice(0, 4)}` }; save(); dlg.close(); toast(`Connected ${h}`); render(); }
  });
  dlg.addEventListener("submit", (e) => {
    if (!e.target.matches("[data-pay]")) return; e.preventDefault();
    const f = e.target, card = f.card.value.replace(/\s/g, ""), err = $("[data-payerr]");
    if (!/^\d{16}$/.test(card)) { err.textContent = "Enter a 16-digit card number."; return; }
    if (card !== "4242424242424242") { err.textContent = "Your card was declined. In test mode, use 4242 4242 4242 4242."; return; }
    if (!/^\s*(0[1-9]|1[0-2])\s*\/\s*\d{2}\s*$/.test(f.exp.value)) { err.textContent = "Enter the expiry as MM / YY."; return; }
    if (!/^\d{3,4}$/.test(f.cvc.value)) { err.textContent = "Enter the 3-digit CVC."; return; }
    const btn = f.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Processing…";
    setTimeout(() => { db.plan = "PRO"; save(); dlg.close(); toast("You're on Smart AI. AI replies are unlocked"); render(); }, 700);
  });

  /* ---------- app clicks ---------- */
  app.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-demo")) return signIn("Maya", "Lopez", "maya@mayashoots.example");
    if (b.hasAttribute("data-new")) { e.preventDefault(); const a = { id: uid(), name: "Untitled automation", active: false, triggers: ["comment"], keywords: [], posts: [], mode: "MESSAGE", message: "", prompt: "", counts: { comment: 0, dm: 0 }, created: Date.now() }; db.automations.push(a); save(); location.hash = `#/automation/${a.id}`; return; }
    if (b.dataset.toggle) { const a = db.automations.find((x) => x.id === b.dataset.toggle); a.active = !a.active; save(); b.setAttribute("aria-checked", a.active); b.closest(".auto")?.classList.toggle("off", !a.active); const l = $("[data-actlabel]"); if (l) l.textContent = a.active ? "Active" : "Inactive"; if (b.closest(".auto")) b.setAttribute("aria-label", `${a.active ? "Deactivate" : "Activate"} ${a.name}`); toast(`${a.name} ${a.active ? "activated" : "paused"}`); return; }
    if (b.dataset.del) { const a = db.automations.find((x) => x.id === b.dataset.del); if (!confirm(`Delete “${a.name}”? Its counters and history go too.`)) return; db.automations = db.automations.filter((x) => x !== a); db.dms = db.dms.filter((d) => d.autoId !== a.id); save(); toast("Automation deleted"); if (route().startsWith("automation")) location.hash = "#/dashboard/automations"; else render(); return; }
    if (b.hasAttribute("data-connect")) return connectDialog();
    if (b.hasAttribute("data-disconnect")) { if (!confirm("Disconnect? All automations stop replying until you reconnect.")) return; db.integration = null; db.webhook = false; save(); toast("Account disconnected"); render(); return; }
    if (b.hasAttribute("data-verify")) { const ch = String(Math.floor(1e9 + Math.random() * 9e9)); $("[data-wh]").innerHTML = `<dl class="kv" style="margin:0 0 12px"><dt>Request</dt><dd>GET /api/webhook/instagram?hub.mode=subscribe&amp;hub.verify_token=trigly_verify_…&amp;hub.challenge=${ch}</dd><dt>Response</dt><dd>200 OK · ${ch}</dd></dl>`; db.webhook = true; save(); toast("Webhook verified"); setTimeout(render, 900); return; }
    if (b.hasAttribute("data-upgrade")) return checkoutDialog();
    if (b.hasAttribute("data-downgrade")) { if (!confirm("Switch to Free? Smart AI automations stop replying.")) return; db.plan = "FREE"; save(); toast("You're on the Free plan"); render(); return; }
    if (b.hasAttribute("data-tbl")) { const on = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", on); $("[data-tblbox]").hidden = !on; $("[data-chart]").hidden = on; if (!on) drawChart(); }
  });
  app.addEventListener("submit", (e) => {
    if (!e.target.matches("[data-signin]")) return; e.preventDefault();
    const f = e.target, err = $("[data-err]"), first = f.first.value.trim(), last = f.last.value.trim(), email = f.email.value.trim();
    if (!first || !last) { err.textContent = "Please enter your first and last name."; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; f.email.focus(); return; }
    signIn(first, last, email);
  });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-signout]")) { db.user = null; save(); toast("Signed out"); location.hash = "#/"; render(); } });

  let toastT; function toast(m) { const box = $("[data-toasts]"); box.innerHTML = `<div class="toast">${icon("i-check")}${esc(m)}</div>`; clearTimeout(toastT); toastT = setTimeout(() => (box.innerHTML = ""), 2400); }
  window.__trigly = { get db() { return db; }, match, smartReply };
  render();
})();
