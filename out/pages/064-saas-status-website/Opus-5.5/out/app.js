(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } } };
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  /* ---------- demo clock: fixed at Mar 13, 2026 11:59 UTC, advancing in real time ---------- */
  const T0 = Date.UTC(2026, 2, 13, 11, 59), LOADED = Date.now();
  const now = () => T0 + (Date.now() - LOADED);
  const LAST_UPDATE = Date.UTC(2026, 2, 13, 11, 57);
  const DAY = 864e5, FIRST = Date.UTC(2025, 11, 14);
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const dayIdx = (d) => Math.round((Date.parse(d + "T00:00:00Z") - FIRST) / DAY);
  const fmtDay = (t, long) => new Date(t).toLocaleDateString("en-US", { month: long ? "long" : "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const LABEL = { ok: "Operational", deg: "Degraded Performance", out: "Outage", mnt: "Maintenance" };

  /* ---------- components ---------- */
  const COMPS = [
    ["web", "Web Application", ["Dashboard", "Editor", "Sharing"]],
    ["api", "API (v2)", ["REST endpoints", "GraphQL", "Rate limiter"]],
    ["db", "Database Cluster", ["Primary (US-East)", "Read replicas", "Backups"]],
    ["cdn", "File Storage & CDN", ["Uploads", "Downloads", "Edge cache (US-West)", "Edge cache (EU)"]],
    ["auth", "Authentication Service", ["Login", "SSO / SAML", "OAuth tokens"]],
    ["hooks", "Webhooks", ["Delivery (US-East)", "Delivery (EU)", "Retry queue"]],
    ["email", "Email Delivery", ["Transactional", "Notifications"]],
    ["search", "Search & Indexing", ["Query service", "Indexer"]],
    ["mobile", "Mobile API", ["iOS sync", "Android sync", "Push notifications"]],
    ["jobs", "Background Jobs", ["Scheduler", "Exports", "Imports"]]
  ];
  const NAME = Object.fromEntries(COMPS.map(([k, n]) => [k, n]));

  /* ---------- 90-day history (sample data). Uptime = 100 − (outage min + 10% of degraded min) / 1440 ---------- */
  const EVENTS = [
    ["2026-03-13", "hooks", "deg", 135, "Degraded webhook delivery performance (ongoing)"],
    ["2026-03-11", "api", "deg", 45, "Elevated API response times"],
    ["2026-03-08", "db", "mnt", 120, "Scheduled maintenance: database migration"],
    ["2026-03-03", "cdn", "out", 80, "File upload failures"],
    ["2026-02-24", "hooks", "out", 9, "Webhook delivery paused during a deploy"],
    ["2026-02-17", "mobile", "deg", 30, "Slow sync for Android clients"],
    ["2026-02-12", "search", "out", 60, "Search index unavailable"],
    ["2026-02-09", "search", "out", 12, "Delayed indexing of new files"],
    ["2026-02-02", "api", "out", 35, "API errors in US-East"],
    ["2026-01-28", "web", "deg", 40, "Slow dashboard loads"],
    ["2026-01-21", "email", "deg", 60, "Delayed notification emails"],
    ["2026-01-14", "db", "out", 25, "Database primary failover"],
    ["2026-01-09", "api", "out", 30, "Elevated 5xx error rates"],
    ["2026-01-06", "auth", "out", 18, "Login failures for SSO users"],
    ["2025-12-29", "jobs", "deg", 120, "Export jobs delayed"],
    ["2025-12-22", "hooks", "out", 40, "Webhook delivery outage"],
    ["2025-12-19", "cdn", "mnt", 60, "Scheduled maintenance: CDN certificate rotation"]
  ];
  const HIST = {};
  COMPS.forEach(([k]) => (HIST[k] = Array.from({ length: 90 }, () => ({ up: 100, cls: "ok", notes: [] }))));
  EVENTS.forEach(([d, k, type, min, note]) => {
    const day = HIST[k][dayIdx(d)];
    day.notes.push(`${note} (${min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}` : `${min} min`})`);
    if (type === "mnt") { day.mnt = true; return; }
    day.up -= ((type === "out" ? min : min * 0.1) / 1440) * 100;
  });
  const clsOf = (d) => (d.mnt ? "mnt" : d.up >= 99.9995 ? "ok" : d.up >= 99 ? "deg" : "out");
  Object.values(HIST).forEach((arr) => arr.forEach((d) => (d.cls = clsOf(d))));
  const avg = (k) => HIST[k].reduce((s, d) => s + d.up, 0) / 90;
  const pct = (v) => (v >= 100 ? "100.00" : (Math.floor(v * 100) / 100).toFixed(2));
  const OVERALL = COMPS.reduce((s, [k]) => s + avg(k), 0) / COMPS.length;

  /* ---------- scenarios ---------- */
  const INC_CURRENT = {
    sev: "minor", title: "Degraded Webhook Delivery Performance", comps: ["hooks"], started: "March 13, 2026 at 9:42 AM UTC", duration: "2h 15m", stage: 2,
    updates: [["11:57 AM", "Monitoring", "Webhook delivery latency has improved. We are continuing to monitor."], ["10:30 AM", "Identified", "Root cause identified as elevated queue backlog in US-East region. Scaling resources."], ["9:42 AM", "Investigating", "We are investigating reports of delayed webhook deliveries."]]
  };
  const SCN = {
    current: { st: { hooks: "deg" }, sub: { hooks: { "Delivery (US-East)": "deg" } }, incs: [INC_CURRENT] },
    operational: { st: {}, sub: {}, incs: [] },
    partial: { st: { cdn: "out", hooks: "deg" }, sub: { cdn: { Uploads: "out", "Edge cache (US-West)": "out" }, hooks: { "Delivery (US-East)": "deg" } }, incs: [{ sev: "major", title: "File Uploads Failing in US-West", comps: ["cdn"], started: "March 13, 2026 at 11:31 AM UTC", duration: "28m", stage: 0, updates: [["11:38 AM", "Investigating", "Uploads to the US-West region are failing for some customers. Downloads are unaffected. Engineers are investigating."]] }, INC_CURRENT] },
    major: { st: { web: "out", api: "out", db: "out", auth: "deg", mobile: "out", hooks: "deg" }, sub: { db: { "Primary (US-East)": "out" }, api: { "REST endpoints": "out", GraphQL: "out" }, web: { Dashboard: "out", Editor: "out" } }, incs: [{ sev: "critical", title: "Service Unavailable — Database Cluster Failure", comps: ["db", "api", "web", "mobile"], started: "March 13, 2026 at 11:44 AM UTC", duration: "15m", stage: 1, updates: [["11:55 AM", "Identified", "The primary database in US-East became unavailable. We are failing over to a replica; expect full recovery within 30 minutes."], ["11:46 AM", "Investigating", "CloudSync is unavailable for most customers. We are investigating with the highest priority."]] }] }
  };
  let scn = "current";
  const status = (k) => SCN[scn].st[k] || "ok";

  /* ---------- banner + updated time ---------- */
  function renderBanner() {
    const outs = COMPS.filter(([k]) => status(k) === "out").length, degs = COMPS.filter(([k]) => status(k) === "deg");
    const state = outs >= 3 ? "major" : outs ? "partial" : "operational";
    const b = $("[data-banner]"); b.dataset.state = state;
    $("[data-banner-text]").textContent = { operational: "All Systems Operational", partial: "Partial System Outage", major: "Major System Outage" }[state];
    $("[data-banner-icon] use").setAttribute("href", { operational: "#i-check", partial: "#i-warn", major: "#i-alert" }[state]);
    $("[data-banner-sub]").textContent = state === "operational" && degs.length ? `${degs.map(([, n]) => n).join(", ")} ${degs.length === 1 ? "is" : "are"} reporting degraded performance.` : state !== "operational" ? `${outs} component${outs === 1 ? "" : "s"} affected. Follow the incident below for updates.` : "";
  }
  function tickUpdated() {
    const m = Math.max(0, Math.floor((now() - LAST_UPDATE) / 60000));
    $("[data-updated]").textContent = `Last updated ${m === 0 ? "just now" : m === 1 ? "1 minute ago" : m < 60 ? `${m} minutes ago` : `${Math.floor(m / 60)}h ago`}`;
    $("[data-updated]").title = "11:57 AM UTC, March 13, 2026";
    const left = Date.UTC(2026, 2, 18, 2) - now(), d = Math.floor(left / DAY), h = Math.floor((left % DAY) / 36e5);
    $("[data-countdown]").textContent = `Starts in ${d}d ${h}h`;
  }

  /* ---------- active incidents ---------- */
  const STAGES = ["Investigating", "Identified", "Monitoring", "Resolved"];
  function renderActive() {
    const incs = SCN[scn].incs;
    $("[data-active]").innerHTML = incs.length ? incs.map((x) => `<article class="inc ${x.sev}" style="--c:${x.sev === "minor" ? "#B45309" : x.sev === "major" ? "#C2410C" : "#B91C1C"}">
      <div class="inc-h"><span class="sev ${x.sev}">${x.sev}</span><h3>${esc(x.title)}</h3></div>
      <dl class="facts"><div><dt>Affected components</dt><dd>${x.comps.map((k) => esc(NAME[k])).join(", ")}</dd></div><div><dt>Started</dt><dd class="mono">${x.started}</dd></div><div><dt>Duration</dt><dd class="mono">${x.duration}</dd></div></dl>
      <ol class="prog" aria-label="Incident progress: ${STAGES[x.stage]}">${STAGES.map((s, i) => `<li class="${i <= x.stage ? "done" : ""}${i === x.stage ? " now" : ""}"${i === x.stage ? ' aria-current="step"' : ""}>${s}</li>`).join("")}</ol>
      <ol class="tl" aria-label="Updates, newest first">${x.updates.map(([t, s, m]) => `<li><time class="mono">${t}</time><b>${s}</b><p>${esc(m)}</p></li>`).join("")}</ol>
    </article>`).join("") : `<p class="none">${icon("i-check")}No active incidents</p>`;
  }

  /* ---------- component list ---------- */
  const open = new Set();
  function renderComps() {
    $("[data-comps]").innerHTML = COMPS.map(([k, n, subs]) => {
      const s = status(k), o = open.has(k);
      const sevenDays = HIST[k].slice(-7).map((d, i) => { const c = i === 6 && s !== "ok" ? s : d.cls; const t = FIRST + (83 + i) * DAY; return `<li><i class="dot-bar" style="background:var(--${c === "ok" ? "ok" : c === "deg" ? "deg" : c === "out" ? "out" : "mnt"})"></i><b>${pct(d.up)}%</b>${new Date(t).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}</li>`; }).join("");
      return `<li><button type="button" class="crow" aria-expanded="${o}" aria-controls="cd-${k}" data-comp="${k}">${icon("i-chev")}<span class="nm">${esc(n)}</span><span class="st ${s}"><i class="dot ${s}${s !== "ok" ? " pulse" : ""}"></i>${LABEL[s]}</span></button>
        <div class="cdet" id="cd-${k}" ${o ? "" : "hidden"}><ul class="subs-l">${subs.map((x) => { const ss = (SCN[scn].sub[k] || {})[x] || (s === "out" ? "ok" : "ok"); return `<li><span>${esc(x)}</span><span class="st ${ss}"><i class="dot ${ss}"></i>${LABEL[ss]}</span></li>`; }).join("")}</ul>
        <div class="d7"><h4>Last 7 days</h4><ol aria-label="Daily uptime, last 7 days">${sevenDays}</ol></div></div></li>`;
    }).join("");
  }
  $("[data-comps]").addEventListener("click", (e) => { const b = e.target.closest("[data-comp]"); if (!b) return; const k = b.dataset.comp; open.has(k) ? open.delete(k) : open.add(k); const o = open.has(k); b.setAttribute("aria-expanded", o); $(`#cd-${k}`).hidden = !o; });

  /* ---------- uptime bars ---------- */
  const weeks = (k) => { const out = []; for (let end = 90; end > 0; end -= 7) out.unshift([Math.max(0, end - 7), end]); return out.map(([a, b]) => { const ds = HIST[k].slice(a, b), rank = { ok: 0, mnt: 1, deg: 2, out: 3 }; const worst = ds.reduce((w, d) => (rank[d.cls] > rank[w] ? d.cls : w), "ok"); return { a, b, up: ds.reduce((s, d) => s + d.up, 0) / ds.length, cls: worst, notes: ds.flatMap((d, i) => d.notes.map((n) => `${fmtDay(FIRST + (a + i) * DAY)}: ${n}`)) }; }); };
  function renderUptime() {
    $("[data-overall]").innerHTML = `${icon("i-chart")}${pct(OVERALL)}% over 90 days`;
    $("[data-uptime]").innerHTML = COMPS.map(([k, n]) => { const a = avg(k); return `<div class="urow"><div class="urow-h"><b id="ur-${k}">${esc(n)}</b><span class="pct${a < 99.9 ? " warn" : ""}">${pct(a)}% uptime</span></div>
      <div class="bars daily" role="img" tabindex="0" aria-labelledby="ur-${k}" aria-describedby="ur-${k}-d" data-bars="${k}" data-mode="d">${HIST[k].map((d, i) => `<i class="${d.cls}" data-i="${i}"></i>`).join("")}</div>
      <div class="bars weekly" role="img" tabindex="0" aria-labelledby="ur-${k}" aria-describedby="ur-${k}-d" data-bars="${k}" data-mode="w">${weeks(k).map((w, i) => `<i class="${w.cls}" data-i="${i}"></i>`).join("")}</div>
      <span class="sr" id="ur-${k}-d">${pct(a)}% uptime over 90 days; ${HIST[k].filter((d) => d.cls !== "ok").length} days with incidents or maintenance.</span></div>`; }).join("");
  }
  const tip = $("[data-tip]");
  function showTip(bars, i) {
    const k = bars.dataset.bars, w = bars.dataset.mode === "w";
    $$("i.cur", bars).forEach((x) => x.classList.remove("cur"));
    const el = bars.children[i]; if (!el) return; el.classList.add("cur"); bars.dataset.cur = i;
    let head, up, cls, notes;
    if (w) { const wk = weeks(k)[i]; head = `${fmtDay(FIRST + wk.a * DAY)} – ${fmtDay(FIRST + (wk.b - 1) * DAY)}`; up = wk.up; cls = wk.cls; notes = wk.notes; }
    else { const d = HIST[k][i]; head = fmtDay(FIRST + i * DAY); up = d.up; cls = d.cls; notes = d.notes; }
    tip.innerHTML = `<b>${head}</b><div class="u"><i class="dot ${cls}"></i>${pct(up)}% uptime${cls === "mnt" ? " · maintenance" : ""}</div><div class="n">${notes.length ? notes.map(esc).join("<br>") : "No incidents"}</div>`;
    tip.hidden = false;
    const r = el.getBoundingClientRect(), sec = tip.offsetParent.getBoundingClientRect();
    let left = r.left + r.width / 2 - sec.left - 115; left = Math.max(4, Math.min(left, sec.width - 234));
    tip.style.left = `${left}px`; tip.style.top = `${r.top - sec.top - tip.offsetHeight - 8}px`;
  }
  const hideTip = () => { tip.hidden = true; $$(".bars i.cur").forEach((x) => x.classList.remove("cur")); };
  const up = $("[data-uptime]");
  let viaPointer = false;
  const fromPointer = (e) => { const bars = e.target.closest("[data-bars]"); if (!bars) return hideTip(); const r = bars.getBoundingClientRect(), n = bars.children.length; showTip(bars, Math.max(0, Math.min(n - 1, Math.floor(((e.clientX - r.left) / r.width) * n)))); };
  up.addEventListener("pointermove", fromPointer);
  up.addEventListener("pointerdown", (e) => { viaPointer = true; fromPointer(e); });
  up.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hideTip(); });
  document.addEventListener("pointerdown", (e) => { if (!e.target.closest("[data-uptime]")) hideTip(); });
  up.addEventListener("focusin", (e) => { if (viaPointer) { viaPointer = false; return; } const b = e.target.closest("[data-bars]"); if (b) showTip(b, b.children.length - 1); });
  up.addEventListener("focusout", hideTip);
  up.addEventListener("keydown", (e) => {
    const b = e.target.closest("[data-bars]"); if (!b) return;
    const n = b.children.length, c = +(b.dataset.cur ?? n - 1);
    const m = { ArrowLeft: -1, ArrowRight: 1, Home: -n, End: n }[e.key]; if (m === undefined) { if (e.key === "Escape") hideTip(); return; }
    e.preventDefault(); showTip(b, Math.max(0, Math.min(n - 1, c + m)));
  });
  $("[data-tip]").style.position = "absolute";
  $("#up-h").closest(".sec").style.position = "relative";

  /* ---------- past incidents ---------- */
  const PAST = {
    "2026-03-11": [{ title: "Elevated API Response Times", dur: "45 min", comps: "API (v2)", steps: [["Investigating", "2:10 PM"], ["Identified", "2:25 PM"], ["Monitoring", "2:40 PM"], ["Resolved", "2:55 PM"]], pm: true,
      tl: [["2:55 PM", "Resolved", "Response times have returned to normal. We'll publish a post-mortem."], ["2:40 PM", "Monitoring", "A fix has been deployed and p95 latency is recovering."], ["2:25 PM", "Identified", "A slow query introduced in today's release is saturating read replicas."], ["2:10 PM", "Investigating", "We're seeing elevated response times on API (v2) requests."]] }],
    "2026-03-08": [{ title: "Scheduled Maintenance: Database Migration", dur: "2h", comps: "Database Cluster", maint: true, note: "Planned maintenance completed successfully. No user-facing impact.", steps: [["Scheduled", "2:00 AM"], ["In progress", "2:00 AM"], ["Completed", "4:00 AM"]] }],
    "2026-03-03": [{ title: "File Upload Failures", dur: "1h 20m", comps: "File Storage & CDN", steps: [["Investigating", "4:05 PM"], ["Identified", "4:30 PM"], ["Monitoring", "5:05 PM"], ["Resolved", "5:25 PM"]],
      tl: [["5:25 PM", "Resolved", "Uploads have been succeeding for 20 minutes. This incident is resolved."], ["5:05 PM", "Monitoring", "The expired certificate has been replaced; upload success rates are back to normal."], ["4:30 PM", "Identified", "An expired internal TLS certificate is blocking writes from the upload service to storage."], ["4:05 PM", "Investigating", "Some users are seeing errors when uploading files. Downloads are unaffected."]] }]
  };
  const pincHtml = (x) => `<div class="pinc"><div class="pinc-h"><span class="res${x.maint ? " mt" : ""}">${x.maint ? "Completed" : "Resolved"}</span><h4>${esc(x.title)}</h4></div>
    <p class="m"><span>Duration: <span class="mono">${x.dur}</span></span><span>Components: ${esc(x.comps)}</span></p>
    ${x.note ? `<p class="note">${esc(x.note)}</p>` : ""}
    <ol class="steps" aria-label="Timeline">${x.steps.map(([s, t]) => `<li>${s} <time>(${t})</time></li>`).join("")}</ol>
    ${x.tl ? `<details><summary>Show updates (${x.tl.length})</summary><ol class="tl">${x.tl.map(([t, s, m]) => `<li><time class="mono">${t}</time><b>${s}</b><p>${esc(m)}</p></li>`).join("")}</ol></details>` : ""}
    ${x.pm ? `<button class="pm" type="button" data-pm>Read Post-Mortem${icon("i-chev")}</button>` : ""}</div>`;
  function renderPast() {
    let html = "";
    for (let i = 1; i <= 14; i++) { const t = Date.UTC(2026, 2, 13) - i * DAY, d = iso(t), list = PAST[d]; html += `<div class="day"><h3>${fmtDay(t, true)}</h3>${list ? list.map(pincHtml).join("") : '<p class="ok-t">No incidents reported</p>'}</div>`; }
    $("[data-past]").innerHTML = html;
    const cutoff = Date.UTC(2026, 1, 27);
    const older = EVENTS.filter(([d]) => Date.parse(d + "T00:00:00Z") < cutoff);
    let mo = "", full = "";
    older.forEach(([d, k, type, min, note]) => {
      const t = Date.parse(d + "T00:00:00Z"), m = new Date(t).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
      if (m !== mo) { full += `<h3 class="mo">${m}</h3>`; mo = m; }
      full += `<div class="day">${pincHtml({ title: note, dur: min >= 60 ? `${Math.floor(min / 60)}h${min % 60 ? ` ${min % 60}m` : ""}` : `${min} min`, comps: NAME[k], maint: type === "mnt", steps: [[type === "mnt" ? "Completed" : "Resolved", fmtDay(t)]] })}</div>`;
    });
    $("[data-full-list]").innerHTML = full + `<p class="hint">History begins ${fmtDay(FIRST, true)}.</p>`;
  }
  $("[data-full]").addEventListener("click", (e) => { const b = e.currentTarget, o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", o); b.firstChild.textContent = o ? "Hide Older Incidents" : "View Full Incident History"; $("[data-full-list]").hidden = !o; });

  /* ---------- metrics ---------- */
  function series(fn) { return Array.from({ length: 24 }, (_, h) => fn(h)); }
  const r = (s) => { let a = s; return () => ((a = (a * 16807) % 2147483647) / 2147483647); };
  const R1 = r(64), R2 = r(77), R3 = r(91);
  const MET = [
    { k: "rt", t: "API Response Time", v: "45ms", sub: "avg", d: series((h) => Math.round(38 + 10 * Math.sin((h - 8) / 24 * Math.PI * 2) + R1() * 9)), unit: "ms", s: `<span>p50 <b>32ms</b></span><span>p95 <b>89ms</b></span><span>p99 <b>142ms</b></span>`, col: "#3B82F6" },
    { k: "er", t: "Error Rate", v: "0.02%", sub: "", d: series((h) => +(0.05 - h * 0.0015 + R2() * 0.008).toFixed(3)), unit: "%", s: `<span class="good">Below threshold</span><span>threshold <b>0.5%</b></span>`, col: "#10B981" },
    { k: "tp", t: "Throughput", v: "12.4K", sub: "req/s", d: series((h) => +(12.4 + 5.2 * Math.sin((h - 9) / 24 * Math.PI * 2) + R3() * 0.8).toFixed(1)), unit: "K req/s", s: `<span>Peak <b>18.2K req/s</b></span>`, col: "#8B5CF6" }
  ];
  MET[2].d[15] = 18.2;
  function spark(m) {
    const W = 300, H = 64, mx = Math.max(...m.d), mn = Math.min(...m.d), y = (v) => H - 6 - ((v - mn) / (mx - mn || 1)) * (H - 12), x = (i) => (i / 23) * W;
    const pts = m.d.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,${H} ${pts} ${W},${H}" fill="${m.col}" opacity=".1"/><polyline points="${pts}" fill="none" stroke="${m.col}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><line class="cx" x1="0" x2="0" y1="0" y2="${H}" stroke="#111827" stroke-width="1" vector-effect="non-scaling-stroke" opacity="0"/></svg>`;
  }
  $("[data-metrics]").innerHTML = MET.map((m) => `<article class="mc"><h3>${m.t}</h3><p class="v">${m.v} <small>${m.sub}</small></p><div class="spark" data-spark="${m.k}" role="img" aria-label="${m.t}, last 24 hours: from ${m.d[0]}${m.unit === "%" ? "%" : ""} to ${m.d[23]}${m.unit === "%" ? "%" : ""}">${spark(m)}<span class="rd" hidden></span></div><p class="s">${m.s}</p></article>`).join("");
  $("[data-metrics]").addEventListener("pointermove", (e) => {
    const sp = e.target.closest("[data-spark]"); if (!sp) return; const m = MET.find((x) => x.k === sp.dataset.spark), rc = sp.getBoundingClientRect();
    const i = Math.max(0, Math.min(23, Math.round(((e.clientX - rc.left) / rc.width) * 23)));
    const ln = $(".cx", sp); ln.setAttribute("x1", (i / 23) * 300); ln.setAttribute("x2", (i / 23) * 300); ln.setAttribute("opacity", ".35");
    const rd = $(".rd", sp); rd.hidden = false; const hr = (12 + i) % 24; rd.textContent = `${String(hr).padStart(2, "0")}:00 UTC · ${m.d[i]}${m.unit === "%" ? "%" : m.unit === "ms" ? "ms" : "K"}`;
  });
  $("[data-metrics]").addEventListener("pointerleave", () => $$("[data-spark]").forEach((sp) => { $(".rd", sp).hidden = true; $(".cx", sp).setAttribute("opacity", "0"); }));
  $("[data-met-tog]").addEventListener("click", (e) => { const b = e.currentTarget, o = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", o); $("#metrics").hidden = !o; });

  /* ---------- subscribe ---------- */
  const prefs = $$("[data-prefs] input");
  prefs.forEach((c) => c.addEventListener("change", () => {
    if (c.value === "all" && c.checked) prefs.find((x) => x.value === "major").checked = false;
    if (c.value === "major" && c.checked) prefs.find((x) => x.value === "all").checked = false;
  }));
  const chosen = () => prefs.filter((c) => c.checked).map((c) => c.parentElement.textContent.trim().toLowerCase());
  const ef = $("[data-email-form]"), em = $("[data-email-msg]");
  ef.addEventListener("submit", (e) => {
    e.preventDefault(); const inp = ef.email, v = inp.value.trim();
    if (!validEmail(v)) { inp.setAttribute("aria-invalid", "true"); em.className = "msg bad"; em.textContent = "Enter a valid email address."; inp.focus(); return; }
    if (!chosen().length) { em.className = "msg bad"; em.textContent = "Choose at least one notification type above."; return; }
    inp.removeAttribute("aria-invalid"); store.set("cs-sub", JSON.stringify({ email: v, prefs: chosen() }));
    em.className = "msg ok"; em.textContent = `Subscribed ${v} to ${chosen().join(" and ")}. (Demo: saved in this browser only.)`; ef.reset();
  });
  ef.email.addEventListener("input", () => ef.email.removeAttribute("aria-invalid"));
  try { const s = JSON.parse(store.get("cs-sub") || "null"); if (s) { em.className = "msg ok"; em.textContent = `You're subscribed as ${s.email}.`; } } catch { /* ignore */ }
  $("[data-slack]").addEventListener("click", () => openDlg(`<h2 id="dlg-title">Add CloudSync Status to Slack</h2><p>In the real product this opens Slack's authorization screen, where you pick a channel for updates about: <b>${esc(chosen().join(", ") || "nothing selected")}</b>.</p><p class="meta">Demo: no connection to Slack is made.</p>`));
  const goSub = (e, mnt) => { e.preventDefault(); if (mnt) { const m = prefs.find((x) => x.value === "maintenance"); m.checked = true; } $("#subscribe").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); setTimeout(() => $("#sub-email").focus({ preventScroll: true }), 400); };
  $("[data-goto-sub]").addEventListener("click", (e) => goSub(e));
  $("[data-notify-mnt]").addEventListener("click", (e) => goSub(e, true));

  /* ---------- dialogs, toasts, misc ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); $("[data-close]").focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-pm]")) {
      openDlg(`<h2 id="dlg-title">Post-Mortem: Elevated API Response Times</h2><p class="meta">March 11, 2026 · 2:10 PM – 2:55 PM UTC · 45 min · API (v2)</p><h3>Summary</h3><p>Between 2:10 and 2:55 PM UTC, p95 latency for API (v2) rose from 90 ms to 1.8 s. About 4% of requests timed out. No data was lost.</p><h3>Root cause</h3><p>A release at 1:58 PM added a query without a supporting index to the project listing endpoint. Under peak load it saturated the read replicas.</p><h3>Resolution</h3><p>We rolled back the release at 2:38 PM and added the missing index before redeploying the next day.</p><h3>What we're changing</h3><ul><li>Query plans are now checked in CI for every new endpoint.</li><li>Latency SLO alerts page on-call within 3 minutes instead of 10.</li><li>Canary releases now hold at 5% traffic for 15 minutes.</li></ul>`);
      return;
    }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} isn't part of this status page demo.`); return; }
    const b = e.target.closest("[data-scn]"); if (b) { scn = b.dataset.scn; $$("[data-scn]").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderLive(); toast(`Previewing: ${b.textContent}`); }
  });
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); }

  function renderLive() { renderBanner(); renderActive(); renderComps(); }
  renderLive(); renderUptime(); renderPast(); tickUpdated();
  setInterval(tickUpdated, 30000);
  window.__status = { overall: OVERALL, avg: Object.fromEntries(COMPS.map(([k]) => [k, avg(k)])) };
})();
