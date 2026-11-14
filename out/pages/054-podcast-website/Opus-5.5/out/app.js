(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = window.Art;
  let cur = null, playing = false;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60; return h ? `${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}` : `${m}:${String(x).padStart(2, "0")}`; };

  $("[data-cover]").innerHTML = A.cover();
  $("[data-mini-cover]").innerHTML = A.cover();
  $$("[data-ep-art]").forEach((el) => (el.innerHTML = A.epArt(Number(el.dataset.epArt), "Episode 187 artwork")));
  $$("[data-host]").forEach((el) => (el.innerHTML = A.hostPhoto(el.dataset.host, el.dataset.host === "maya" ? "Portrait of Maya Park" : "Portrait of Diego Santos")));

  /* ---------- platforms ---------- */
  const PLATS = [["Apple Podcasts", "#9333EA", "p-apple"], ["Spotify", "#1DB954", "p-spotify"], ["YouTube", "#FF0000", "p-yt"], ["Google Podcasts", "#4285F4", "p-google"], ["RSS", "#F97316", "p-rss"]];
  $("[data-plats]").innerHTML = PLATS.map(([n, c, ic]) => `<a class="plat" href="#subscribe" style="--c:${c}" data-plat="${n}"><span class="ic">${icon(ic)}</span>${n}</a>`).join("");
  function platform(n) {
    if (n === "RSS") { openDlg(`<h3>RSS feed</h3><p class="lead">Paste this URL into any podcast app.</p><div class="copybox"><input readonly value="https://shipit.example/feed.xml" aria-label="RSS feed URL" data-copy-src><button class="chip" type="button" data-copy>Copy</button></div><p class="note">Example feed URL for this demo.</p>`); return; }
    toast(`Opening Ship It on ${n} — demo link.`);
  }
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-plat], [data-plat-link]"); if (!a) return; e.preventDefault(); platform(a.dataset.plat || a.dataset.platLink); });

  /* ---------- episodes ---------- */
  const E = [
    [187, "How Figma Rebuilt Their Multiplayer Engine", "Dylan Field", "CEO of Figma", "Mar 4", 58, "Engineering", "Real-time collaboration, WebSocket scale and a Rust rendering engine."],
    [186, "Inside Linear's Product Philosophy", "Karri Saarinen", "", "Mar 4", 47, "Design", "Opinionated defaults, speed as a feature and saying no to customers."],
    [185, "Scaling to 10M Users with a 5-Person Team", "Sarah Chen", "", "Feb 25", 52, "Engineering", "Boring infrastructure, ruthless prioritization and paging rotations for five."],
    [184, "Why We Chose Rust for Our Backend", "James Liu", "", "Feb 18", 41, "Engineering", "The migration plan, the hiring trade-offs and what they'd do differently."],
    [183, "The Art of Developer Marketing", "Emily Zhang", "", "Feb 11", 38, "Growth", "Docs as marketing, honest benchmarks and why devs hate landing pages."],
    [182, "From Side Project to $50M ARR", "Marcus Johnson", "", "Feb 4", 55, "Founders", "Quitting at the right time, first hires and pricing that scaled."],
    [181, "Designing for AI-First Products", "Anna Kowalski", "", "Jan 28", 44, "AI", "Designing for uncertainty: confidence, undo and showing the model's work."],
    [180, "Pricing Your First B2B Product", "Rahul Desai", "", "Jan 21", 46, "Founders", "Charge more, sell annual and other lessons from 40 pricing pages."],
    [179, "Evals Are the New Unit Tests", "Lena Fischer", "", "Jan 14", 49, "AI", "Building evaluation suites for LLM features that change every week."],
    [178, "The Onboarding Teardown", "Chris Okoro", "", "Jan 7", 36, "Growth", "Time-to-value, empty states and the single metric that predicts retention."],
    [177, "Postgres at Ridiculous Scale", "Mira Patel", "", "Dec 31", 57, "Engineering", "Partitioning, connection pooling and when not to shard."],
    [176, "Design Reviews That Don't Suck", "Tom Becker", "", "Dec 24", 33, "Design", "Critique rituals, decision logs and keeping taste without bottlenecks."],
    [175, "Raising a Seed Round in 2026", "Ana Ruiz", "", "Dec 17", 42, "Founders", "What investors ask now, and how to tell a story with thin data."],
    [174, "Shipping an AI Agent to Production", "Kenji Mori", "", "Dec 10", 51, "AI", "Guardrails, tool design, cost controls and the incident that taught them most."],
    [173, "Community-Led Growth, For Real", "Priya Shah", "", "Dec 3", 39, "Growth", "From a Discord of 50 to an ecosystem of plugins."],
    [172, "The Death of the Design Handoff", "Leo Martins", "", "Nov 26", 37, "Design", "Designers in code, engineers in Figma and shared component ownership."],
    [171, "Hiring Your First Ten Engineers", "Grace Kim", "", "Nov 19", 48, "Founders", "Work trials, leveling and avoiding the 'clone yourself' trap."],
    [170, "Observability on a Startup Budget", "Omar Haddad", "", "Nov 12", 44, "Engineering", "Logs, traces and the three dashboards every team needs."]
  ].map(([n, t, g, role, d, min, cat, pv]) => ({ n, t, g, role, d, min, cat, pv, dur: min * 60 }));
  const POPULAR = [
    { n: 140, t: "How Notion Built a $10B Company", plays: "2.1M", min: 63, cat: "Founders", g: "Notion team", d: "Aug 13, 2024" },
    { n: 156, t: "The Vercel Origin Story", plays: "1.8M", min: 55, cat: "Founders", g: "Guillermo Rauch", d: "Dec 3, 2024" },
    { n: 142, t: "Stripe's API Design Principles", plays: "1.5M", min: 49, cat: "Engineering", g: "Patrick Collison", d: "Aug 27, 2024" },
    { n: 120, t: "Why Every Startup Needs a Design System", plays: "1.2M", min: 45, cat: "Design", g: "Design panel", d: "Mar 26, 2024" }
  ].map((p) => ({ ...p, dur: p.min * 60, pv: "" }));
  const ALL = [...E, ...POPULAR];
  const byN = (n) => ALL.find((e) => e.n === n);

  let tab = "All", shown = 8, sort = "new";
  const listEl = $("[data-eps]");
  function filtered() {
    const q = $("[data-q]").value.trim().toLowerCase();
    let l = E.filter((e) => e.n !== 187 && (tab === "All" || e.cat === tab) && (!q || `${e.n} ${e.t} ${e.g} ${e.pv} ${e.cat}`.toLowerCase().includes(q)));
    l.sort(sort === "old" ? (a, b) => a.n - b.n : sort === "long" ? (a, b) => b.min - a.min : sort === "short" ? (a, b) => a.min - b.min : (a, b) => b.n - a.n);
    return l;
  }
  function renderList() {
    const l = filtered(), v = l.slice(0, shown);
    listEl.innerHTML = v.length ? v.map((e) => `<li class="ep${cur && cur.n === e.n ? " on" : ""}" data-ep="${e.n}"><span class="no">EP ${e.n}</span><div class="body"><h3><button type="button" data-notes="${e.n}">${esc(e.t)}</button><span class="cat">${e.cat}</span></h3><p class="who">with ${esc(e.g)}</p><p class="pv">${esc(e.pv)}</p></div><p class="when"><span>${e.d}</span><span>${e.min} min</span></p>${ppBtn(e)}</li>`).join("") : `<li class="empty">No episodes match — try another topic or search term.</li>`;
    const q = $("[data-q]").value.trim();
    $("[data-result]").textContent = q || tab !== "All" ? `${l.length} episode${l.length === 1 ? "" : "s"} in this sample${tab !== "All" ? ` · ${tab}` : ""}${q ? ` · “${q}”` : ""}` : "";
    $("[data-more]").hidden = l.length <= shown;
  }
  const ppBtn = (e) => { const p = cur && cur.n === e.n && playing; return `<button class="pp" type="button" aria-label="${p ? "Pause" : "Play"} episode ${e.n}" data-play="${e.n}">${icon(p ? "i-pause" : "i-play")}</button>`; };
  $("[data-q]").addEventListener("input", () => { shown = 8; renderList(); });
  $("[data-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (!b) return; tab = b.dataset.tab; shown = 8; $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b)); renderList(); });
  $("[data-more]").addEventListener("click", () => { shown += 8; renderList(); });
  const st = $("[data-sort-toggle]"), sp = $("[data-sort]");
  st.addEventListener("click", () => { const show = sp.hidden; sp.hidden = !show; st.setAttribute("aria-expanded", show); });
  $("[data-sort-sel]").addEventListener("change", (e) => { sort = e.target.value; renderList(); });

  /* ---------- popular + guests ---------- */
  $("[data-pop]").innerHTML = POPULAR.map((p) => `<article class="pc"><div class="art">${A.epArt(p.n)}<span class="plays">${icon("i-headphones")}${p.plays} plays</span>${ppBtn(p).replace('class="pp"', 'class="pp"')}</div><h3>${esc(p.t)}</h3></article>`).join("");
  const GUESTS = [["Dylan Field", "CEO, Figma", 187, "#F59E0B", "#EF4444"], ["Guillermo Rauch", "CEO, Vercel", 156, "#64748B", "#0F172A"], ["Patrick Collison", "CEO, Stripe", 142, "#8B5CF6", "#6366F1"], ["Emmett Shear", "Co-founder, Twitch", 128, "#A855F7", "#7C3AED"], ["Julie Zhuo", "Author & Advisor", 115, "#EC4899", "#F59E0B"], ["Sahil Lavingia", "CEO, Gumroad", 98, "#14B8A6", "#0EA5E9"]];
  $("[data-guests]").innerHTML = GUESTS.map(([n, r, ep, a, b]) => `<article class="g"><span class="mono" style="--a:${a};--b:${b}" aria-hidden="true">${n.split(" ").map((x) => x[0]).join("")}</span><div><h3>${n}</h3><p>${r}</p><button class="link" type="button" data-guest-ep="${ep}">EP ${ep} ${icon("i-arrow")}</button></div></article>`).join("");
  $("[data-guests]").addEventListener("click", (e) => { const b = e.target.closest("[data-guest-ep]"); if (!b) return; const n = Number(b.dataset.guestEp); if (byN(n)) shownotes(n); else openDlg(`<h3>EP ${n}</h3><p class="lead">${esc(b.closest(".g").querySelector("h3").textContent)} · from the archive</p><p>This episode lives in the full archive of 187 episodes.</p><p><button class="chip" type="button" data-play-arch="${n}">${icon("i-play")}Play preview</button></p>`); });
  $("[data-all-guests]").addEventListener("click", () => openDlg(`<h3>All guests</h3><p class="lead">120+ builders since 2022 — a few recent ones:</p><ul>${[...GUESTS.map(([n, r, ep]) => `${n} — ${r} (EP ${ep})`), ...E.slice(1, 9).map((e) => `${e.g} (EP ${e.n})`)].map((x) => `<li>${esc(x)}</li>`).join("")}</ul><p class="note">Guest names are illustrative for this demo.</p>`));

  /* ---------- player (timed demo, no audio file) ---------- */
  let speed = 1, muted = false, timer = null;
  const pos = new Map();
  const SPEEDS = [1, 1.25, 1.5, 2, 0.75];
  const seek = $("[data-seek]"), feat = byN(187);
  function load(n) {
    let e = byN(n);
    if (!e) e = { n, t: `Episode ${n}`, g: "", dur: 2700, cat: "" };
    if (cur && cur.n !== e.n) pos.set(cur.n, t());
    cur = e;
    $("[data-mini-art]").innerHTML = A.epArt(e.n);
    $("[data-mini-title]").textContent = `EP ${e.n} · ${e.t}`;
  }
  const t = () => pos.get(cur ? cur.n : 0) || 0;
  function play(n) {
    if (!cur || cur.n !== n) load(n);
    if (t() >= cur.dur) pos.set(cur.n, 0);
    playing = true; clearInterval(timer);
    timer = setInterval(() => { const nt = Math.min(cur.dur, t() + 0.25 * speed); pos.set(cur.n, nt); if (nt >= cur.dur) pause(); sync(); }, 250);
    sync(true);
  }
  function pause() { playing = false; clearInterval(timer); sync(true); }
  function toggle(n) { if (cur && cur.n === n && playing) pause(); else play(n); }
  function sync(full) {
    const ft = pos.get(187) || 0;
    seek.value = Math.floor(ft); seek.style.setProperty("--p", `${(ft / feat.dur) * 100}%`);
    $("[data-cur]").textContent = fmt(ft);
    const fp = cur && cur.n === 187 && playing;
    const ppb = $("[data-pp]"); ppb.innerHTML = icon(fp ? "i-pause" : "i-play"); ppb.setAttribute("aria-label", `${fp ? "Pause" : "Play"} episode 187`);
    const mini = $("[data-mini]");
    if (cur) {
      mini.hidden = false; document.body.classList.add("has-mini");
      $("[data-mini-prog]").style.width = `${(t() / cur.dur) * 100}%`;
      const mb = $("[data-mini-pp]"); mb.innerHTML = icon(playing ? "i-pause" : "i-play"); mb.setAttribute("aria-label", playing ? "Pause" : "Play");
    }
    if (full) {
      $$("[data-play]").forEach((b) => { const on = cur && Number(b.dataset.play) === cur.n && playing; b.innerHTML = icon(on ? "i-pause" : "i-play"); b.setAttribute("aria-label", `${on ? "Pause" : "Play"} episode ${b.dataset.play}`); });
      $$(".ep").forEach((li) => li.classList.toggle("on", !!cur && Number(li.dataset.ep) === cur.n));
    }
  }
  $("[data-pp]").addEventListener("click", () => toggle(187));
  seek.addEventListener("input", () => { pos.set(187, Number(seek.value)); if (!cur) load(187); sync(); });
  $("[data-speed]").addEventListener("click", (e) => { speed = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]; e.currentTarget.textContent = `${speed}x`; e.currentTarget.setAttribute("aria-label", `Playback speed ${speed}x`); });
  const vol = $("[data-vol]");
  const syncVol = () => { vol.style.setProperty("--p", `${muted ? 0 : vol.value}%`); const m = $("[data-mute]"); m.innerHTML = icon(muted || vol.value === "0" ? "i-mute" : "i-vol"); m.setAttribute("aria-label", muted ? "Unmute" : "Mute"); };
  vol.addEventListener("input", () => { muted = false; syncVol(); });
  $("[data-mute]").addEventListener("click", () => { muted = !muted; syncVol(); });
  syncVol(); sync();
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-play], [data-play-arch]"); if (!b) return; const n = Number(b.dataset.play || b.dataset.playArch); toggle(n); });
  $("[data-mini-pp]").addEventListener("click", () => toggle(cur.n));
  $("[data-mini-x]").addEventListener("click", () => { pause(); $("[data-mini]").hidden = true; document.body.classList.remove("has-mini"); });

  /* ---------- notes / transcript / share ---------- */
  const CHAPTERS = [[0, "Intro and Dylan's first prototype"], [312, "Why multiplayer was hard in the browser"], [1105, "Scaling WebSocket connections"], [2040, "Rewriting the renderer in Rust"], [2910, "Advice for teams shipping real-time features"]];
  function shownotes(n) {
    const e = byN(n) || { n, t: `Episode ${n}`, g: "", dur: 2700 };
    const ch = n === 187 ? CHAPTERS : [[0, "Intro"], [Math.round(e.dur * 0.2), "Background"], [Math.round(e.dur * 0.5), "Deep dive"], [Math.round(e.dur * 0.85), "Lightning round"]];
    openDlg(`<h3>EP ${e.n}: ${esc(e.t)}</h3><p class="lead">${e.g ? `with ${esc(e.g)} · ` : ""}${Math.round(e.dur / 60)} min</p><p>${esc(e.pv || "")}</p><p style="font-weight:600;margin-bottom:4px">Chapters</p><ol>${ch.map(([s, l]) => `<li><button class="link" type="button" data-jump="${e.n}:${s}">${fmt(s)}</button> ${esc(l)}</li>`).join("")}</ol><p style="font-weight:600;margin-bottom:4px">Links mentioned</p><ul><li>Engineering blog post on the topic</li><li>Guest's newsletter</li><li>Books recommended in the lightning round</li></ul><p class="note">Sample show notes for this demo.</p>`);
  }
  document.addEventListener("click", (e) => {
    const j = e.target.closest("[data-jump]");
    if (j) { const [n, s] = j.dataset.jump.split(":").map(Number); if (!cur || cur.n !== n) load(n); pos.set(n, s); play(n); dlg.close(); toast(`Playing from ${fmt(s)}`); return; }
    const nb = e.target.closest("[data-notes]"); if (nb) { shownotes(Number(nb.dataset.notes)); return; }
    const tr = e.target.closest("[data-transcript]");
    if (tr) { openDlg(`<h3>Transcript — EP 187</h3><p class="lead">Excerpt · auto-generated, lightly edited</p><div class="ts">${[[0, "Maya", "Welcome back to Ship It. Today we're talking multiplayer — the thing that made Figma feel like magic."], [24, "Diego", "And the thing that kept your engineers up at night, I'm guessing."], [41, "Dylan", "Definitely. The first version synced whole documents. It worked for three people and fell over at thirty."], [78, "Maya", "So what changed?"], [83, "Dylan", "We moved to syncing small property changes with a server that's the source of truth, which made conflicts much simpler."]].map(([s, w, l]) => `<p><b>${fmt(s)}</b><span class="who">${w}:</span> ${l}</p>`).join("")}</div><p class="note">Illustrative transcript excerpt — not a real interview.</p>`); return; }
    const sh = e.target.closest("[data-share]");
    if (sh) { const url = `${location.origin}${location.pathname}#ep-${sh.dataset.share}`; openDlg(`<h3>Share EP ${sh.dataset.share}</h3><p class="lead">Copy the link to this episode.</p><div class="copybox"><input readonly value="${esc(url)}" aria-label="Episode link" data-copy-src><button class="chip" type="button" data-copy>Copy</button></div>`); return; }
    const cp = e.target.closest("[data-copy]");
    if (cp) { const v = $("[data-copy-src]", body).value; const ok = () => { cp.textContent = "Copied"; toast("Link copied"); }; try { navigator.clipboard.writeText(v).then(ok, () => { $("[data-copy-src]", body).select(); toast("Press Ctrl/Cmd+C to copy"); }); } catch { $("[data-copy-src]", body).select(); toast("Press Ctrl/Cmd+C to copy"); } }
  });

  /* ---------- newsletter / sponsors / misc ---------- */
  $("[data-sub]").addEventListener("submit", (e) => {
    e.preventDefault(); const v = e.target.email.value.trim(), m = $("[data-sub-msg]");
    if (!validEmail(v)) { m.className = "nl-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    m.className = "nl-msg ok"; m.textContent = `You're in — show notes for EP 188 go to ${v} next Tuesday. (Demo — nothing is sent.)`; e.target.reset();
  });
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-sponsor]"); if (s) { toast(`${s.dataset.sponsor}: sponsor link (demo — not an endorsement).`); return; }
    const k = e.target.closest("[data-kit]");
    if (k) { e.preventDefault(); openDlg(`<h3>Sponsor Ship It</h3><p class="lead">Reach 2M+ downloads of builders, engineers and founders.</p><ul><li>Host-read ads, pre-roll and mid-roll</li><li>Newsletter placements (18K subscribers)</li><li>Quarterly and annual packages</li></ul><form class="form" data-kit-form novalidate><label>Work email<input name="email" type="email" autocomplete="email"></label><label>Company<input name="co" autocomplete="organization"></label><p class="err" data-err role="alert"></p><button class="btn-a" type="submit">Email me the media kit</button></form>`); $("[data-kit-form]", body).addEventListener("submit", (ev) => { ev.preventDefault(); const f = ev.target; if (!validEmail(f.email.value.trim()) || !f.co.value.trim()) { $("[data-err]", body).textContent = "Please enter a work email and company."; return; } dlg.close(); toast(`Media kit request received for ${f.co.value.trim()} (demo).`); }); return; }
    const c = e.target.closest("[data-contact]"); if (c) { e.preventDefault(); toast("Contact: hello@shipit.example (demo address)."); return; }
    const p = e.target.closest("[data-privacy]"); if (p) { e.preventDefault(); openDlg(`<h3>Privacy Policy</h3><p>This demo page stores nothing and sets no cookies. The player runs entirely in your browser.</p>`); }
  });

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0; const f = $("input:not([readonly]), .link, .chip", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  document.addEventListener("keydown", (e) => { if (e.key === " " && cur && !/input|textarea|select|button/i.test(document.activeElement.tagName) && !dlg.open) { e.preventDefault(); toggle(cur.n); } });
  renderList();
})();
