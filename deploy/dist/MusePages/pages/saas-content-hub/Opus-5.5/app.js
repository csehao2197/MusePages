(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } } };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  /* ---------- taxonomy ---------- */
  const CATS = [
    ["Productivity", "#2563EB", "i-bolt"], ["Engineering", "#7C3AED", "i-code"], ["Remote Work", "#059669", "i-globe"],
    ["Leadership", "#D97706", "i-flag"], ["Product Updates", "#DC2626", "i-spark"], ["Customer Stories", "#0891B2", "i-quote"]
  ];
  const COLOR = Object.fromEntries(CATS.map(([n, c]) => [n, c]));
  const AUTHORS = {
    sarah: ["Sarah Chen", "Head of People"], marcus: ["Marcus Webb", "Staff Engineer"], priya: ["Priya Nair", "Remote Ops Lead"], daniel: ["Daniel Okafor", "Product Manager"],
    elena: ["Elena Rossi", "Customer Success Lead"], james: ["James Park", "VP Engineering"], aisha: ["Aisha Bello", "Content Lead"], tom: ["Tom Lindqvist", "Design Lead"]
  };
  const BY_CAT = { Productivity: ["sarah", "aisha", "tom"], Engineering: ["marcus", "james"], "Remote Work": ["priya", "sarah"], Leadership: ["james", "daniel"], "Product Updates": ["daniel", "tom"], "Customer Stories": ["elena", "aisha"] };

  /* ---------- articles: 10 from the brief + 98 archive posts ---------- */
  const slug = (t) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const FEATURED = { t: "The 4-Day Work Week: How We Boosted Output by 23%", cat: "Productivity", a: "sarah", d: "2026-03-10", min: 8, kind: "week", opts: { four: true }, ex: "After six months of experimentation, here's what we learned about compressed schedules, async communication, and measuring what matters." };
  const BRIEF = [
    { t: "Async-First: 7 Rules for Teams That Ship Faster", cat: "Engineering", a: "marcus", d: "2026-03-06", min: 6, kind: "async", ex: "Default to writing, protect maker time, and make decisions where everyone can see them. The rules our engineers live by." },
    { t: "Building a Culture of Ownership in Remote Teams", cat: "Remote Work", a: "priya", d: "2026-03-04", min: 10, kind: "remote", ex: "Ownership isn't assigned, it's designed. How clear DRIs, open roadmaps and written context changed how our distributed team works." },
    { t: "What We Shipped in February 2026", cat: "Product Updates", a: "daniel", d: "2026-03-02", min: 4, kind: "shipped", ex: "Workload view, smarter recurring tasks, a faster mobile app and 40+ fixes. Here's everything new in Flowline this month." },
    { t: "How Designlab Reduced Project Delays by 40%", cat: "Customer Stories", a: "elena", d: "2026-02-27", min: 7, kind: "story", opts: { label: "-40%", down: true }, ex: "With 60 designers across four studios, Designlab needed one source of truth. Here's how they got projects back on schedule." },
    { t: "The Manager's Guide to Running Better Standups", cat: "Leadership", a: "james", d: "2026-02-25", min: 5, kind: "standup", ex: "Fifteen minutes, three questions and zero status theater. A practical format for standups your team won't dread." },
    { t: "Why We Replaced Meetings With Flowline Briefs", cat: "Productivity", a: "aisha", d: "2026-02-23", min: 9, kind: "briefs", ex: "We cancelled every recurring status meeting for a quarter. Written briefs took their place, and here's what happened." },
    { t: "CI/CD for Non-Engineers: A Visual Guide", cat: "Engineering", a: "james", d: "2026-02-19", min: 12, kind: "pipeline", ex: "What actually happens between 'merged' and 'live'? A jargon-free tour of pipelines, tests and deploys for PMs and designers." },
    { t: "From Chaos to Clarity: Our Planning Framework", cat: "Productivity", a: "tom", d: "2026-02-17", min: 8, kind: "chaos", ex: "Bets, appetites and a single planning board. The lightweight framework we use to turn a messy backlog into a clear quarter." },
    { t: "Introducing Flowline AI: Your Smart Assistant", cat: "Product Updates", a: "daniel", d: "2026-02-13", min: 3, kind: "ai", ex: "Summarize threads, draft project plans and spot at-risk work automatically. Meet the assistant built into every Flowline workspace." }
  ];
  const BANK = {
    Productivity: ["How to Run a Quarterly Planning Week That Actually Works", "The Two-List Method for Overloaded Weeks", "Deep Work Blocks: A Team-Wide Experiment", "Inbox Zero Is Dead. Try Inbox Triage Instead", "Why Your To-Do List Keeps Growing", "The Hidden Cost of Context Switching", "Weekly Reviews in 20 Minutes", "Templates We Use to Kick Off Every Project", "Saying No Without Burning Bridges", "How to Estimate Work When Everything Is Uncertain", "Notification Hygiene for Busy Teams", "The 3-Priority Rule for Daily Planning", "Turning Retros Into Real Change", "A Better Way to Write Project Briefs", "Time Blocking for People Who Hate Calendars", "How We Cut Status Updates by Half", "The Myth of the 100% Utilized Team", "Building Focus Time Into a Meeting-Heavy Culture", "Checklists: The Most Underrated Productivity Tool", "How to Plan a Launch in 30 Days", "Energy, Not Time: Rethinking Your Workday", "What 500 Teams Taught Us About Deadlines", "Clearing Your Backlog Without Losing Your Mind", "The Monday Kickoff Ritual Our Team Swears By", "Measuring Productivity Without Micromanaging"],
    Engineering: ["How We Cut Our Build Times in Half", "Feature Flags at Scale: Lessons From 1,000 Toggles", "Writing RFCs Your Team Will Actually Read", "Our On-Call Playbook, Open-Sourced", "Postmortems Without Blame", "The Case for Boring Technology", "Migrating 4TB to Postgres With Zero Downtime", "Code Review Norms for Async Teams", "How We Test Real-Time Collaboration", "Tracking Tech Debt in Your Roadmap", "Designing Our Public API for Humans", "From Monolith to Modules, Gradually", "Shipping Small: Our Pull Request Size Guidelines", "Observability for Product Teams", "Why We Moved Our Sync Engine to CRDTs", "Engineering Onboarding in Two Weeks", "Load Testing Before Launch Day", "Linking Commits to Tasks Automatically", "The Sprint Is Not the Point", "Mobile Offline Mode: How It Works"],
    "Remote Work": ["The Remote Onboarding Checklist", "Time Zones Are a Feature, Not a Bug", "Writing Is the New Meeting", "How to Build Trust When You've Never Met", "Our Annual Offsite, Planned in Flowline", "Remote Rituals That Don't Feel Forced", "Async Video Updates: Dos and Don'ts", "Designing a Handbook-First Company", "Avoiding Burnout on Distributed Teams", "Hybrid Without the Second-Class Citizens", "Running Workshops Across 9 Time Zones", "Home Office Setups From the Flowline Team", "Overlap Hours: Finding the Sweet Spot", "Remote Hiring: What We Look For", "Celebrating Wins When Nobody Is in the Room", "The Documentation Habit", "Chat Less, Write More", "Measuring Engagement on Remote Teams"],
    Leadership: ["One-on-Ones That Don't Waste Time", "How to Give Feedback That Lands", "Delegation for First-Time Managers", "Setting OKRs Your Team Believes In", "Leading Through a Reorg", "The Manager's Weekly Calendar, Decoded", "Hiring Your First Five Engineers", "Running a Skip-Level That Matters", "Making Decisions With Incomplete Information", "Psychological Safety in Practice", "How to Run a Calm Quarterly Review", "Coaching vs. Managing: When to Switch", "Writing a Team Charter in One Afternoon", "Growing Senior ICs Without Making Them Managers"],
    "Product Updates": ["Introducing Timeline View", "Recurring Tasks Are Here", "Flowline for iOS Gets Offline Mode", "Custom Fields 2.0", "New: Workload Balancing", "Goals: Connect Tasks to Outcomes", "Faster Search, Everywhere", "The New Flowline Integrations Directory", "Guest Access for Clients", "Release Notes: Keyboard Shortcuts Everywhere", "Release Notes: Smarter Notifications", "Release Notes: Dashboards Refresh"],
    "Customer Stories": ["How Northpeak Agency Scaled to 40 Clients", "Brightside Health Unified 6 Teams in One Workspace", "How Orbit Labs Ships Weekly With 5 Engineers", "Fernway Studio's Remote Design Process", "How Kettle & Co. Planned 120 Store Openings", "Why Lumen Schools Switched From Spreadsheets", "Tidewater Nonprofit Cut Admin Time by 30%", "How Parcel Run Coordinates 300 Drivers", "Atlas Robotics: From Chaos to Clear Roadmaps"]
  };
  const EXC = {
    Productivity: ["Small changes to how you plan, prioritize and protect focus add up fast. Here's a practical playbook you can try this week.", "We tested this with our own team for a month. The results surprised us, and the template is yours to steal.", "Less busywork, more finished work. A simple framework, real examples and the mistakes we made along the way.", "Productivity isn't about doing more. It's about doing the right things with less friction, and here's how."],
    Engineering: ["A behind-the-scenes look at how our engineering team approaches the problem, including the trade-offs we made.", "What worked, what didn't, and the tooling we built along the way. Lessons for teams of any size.", "Practical guidelines from the team that builds Flowline, with examples you can adapt for your own codebase.", "We share the numbers, the architecture diagrams and the one decision we'd make differently next time."],
    "Remote Work": ["Distributed teams need intentional habits. These are the ones that made the biggest difference for us.", "Working across time zones is hard. Here's how we keep everyone aligned without endless calls.", "Lessons from five years as a remote-first company, from onboarding to offsites and everything between.", "Practical ideas for keeping connection, clarity and momentum when your team is spread out."],
    Leadership: ["Great managers are made, not born. A practical guide with scripts and templates you can use tomorrow.", "Leading a team means making hard calls with imperfect information. Here's a framework that helps.", "What we've learned from coaching dozens of new managers at Flowline and at the companies we work with.", "The habits that separate good teams from great ones, and how leaders can model them every week."],
    "Product Updates": ["Here's what's new in Flowline, why we built it and how to start using it with your team today.", "Our latest release is live for every workspace. A quick tour of what changed and what's coming next.", "You asked, we shipped. Everything you need to know about the newest Flowline features.", "Faster, simpler and more flexible. The details on this update and tips from the team that built it."],
    "Customer Stories": ["How one team replaced scattered spreadsheets and status meetings with a single source of truth.", "A closer look at the workflows, templates and habits that helped this team ship faster with Flowline.", "From messy handoffs to predictable delivery. The story of a team that changed how it plans work.", "Real numbers from a real rollout: what changed in the first 90 days and what the team would tell you."]
  };
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const R = rng(63);
  const archive = [];
  Object.entries(BANK).forEach(([cat, titles]) => titles.forEach((t, i) => archive.push({ t, cat, a: BY_CAT[cat][i % BY_CAT[cat].length], min: 4 + Math.floor(R() * 9), ex: EXC[cat][i % 4] })));
  for (let i = archive.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [archive[i], archive[j]] = [archive[j], archive[i]]; }
  const start = new Date("2026-02-10T12:00:00Z");
  archive.forEach((p, i) => { const d = new Date(start); d.setUTCDate(d.getUTCDate() - i * 3); p.d = d.toISOString().slice(0, 10); });
  const ALL = [FEATURED, ...BRIEF, ...archive].map((p, i) => ({ ...p, id: slug(p.t), seed: i + 3 }));
  FEATURED.id = ALL[0].id;
  const byId = Object.fromEntries(ALL.map((p) => [p.id, p]));
  const fmtDate = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  const thumb = (p) => Art.thumb(p.cat, p.seed, `Illustration for “${p.t}”`, p.kind, p.opts);
  const av = (k) => `<span class="av">${Art.avatar(k, AUTHORS[k][0])}</span>`;

  /* ---------- featured ---------- */
  const F = ALL[0];
  $("[data-featured]").innerHTML = `<article class="featured" data-open="${F.id}"><div class="art">${thumb(F)}</div><div class="txt"><span class="f-tag">${F.cat.toUpperCase()}</span><h2><a href="#post/${F.id}" data-open-link>${esc(F.t)}</a></h2><p>${esc(F.ex)}</p><div class="byline">${av(F.a)}<span><b>${AUTHORS[F.a][0]}</b> · ${AUTHORS[F.a][1]}</span><span>· ${fmtDate(F.d)}</span><span>· ${F.min} min read</span></div><span class="read">Read Article ${icon("i-right")}</span></div></article>`;

  /* ---------- pills + topics ---------- */
  const counts = Object.fromEntries(CATS.map(([n]) => [n, ALL.filter((p) => p.cat === n).length]));
  $("[data-pills]").innerHTML = ["All", ...CATS.map(([n]) => n)].map((n) => `<button type="button" class="pill" aria-pressed="${n === "All"}" data-pill="${n}">${n}</button>`).join("");
  $("[data-topics]").innerHTML = CATS.map(([n, c, ic]) => `<button type="button" class="topic" style="--c:${c}" data-topic="${n}"><span class="ic">${icon(ic)}</span><span><b>${n}</b><small>${counts[n]} articles</small></span>${icon("i-right")}</button>`).join("");

  /* ---------- feed state ---------- */
  const PER = 9;
  let topic = "All", query = "", page = 1, shown = PER;
  const news = $("[data-news]"), grid = $("[data-grid]");
  function matches() {
    const q = query.toLowerCase();
    return ALL.filter((p) => (topic === "All" || p.cat === topic) && (!q || `${p.t} ${p.ex} ${p.cat} ${AUTHORS[p.a][0]}`.toLowerCase().includes(q)));
  }
  const filtered = () => topic !== "All" || query !== "";
  function cardHtml(p, isNew) {
    return `<article class="card${isNew ? " new" : ""}" data-card="${p.id}"><div class="thumb">${thumb(p)}</div><div class="body"><span class="badge" style="--c:${COLOR[p.cat]}">${p.cat}</span><h3><a href="#post/${p.id}" data-open-link>${esc(p.t)}</a></h3><p class="ex">${esc(p.ex)}</p><div class="meta">${av(p.a)}<span class="who"><b>${AUTHORS[p.a][0]}</b><span>${fmtDate(p.d)} · ${p.min} min read</span></span></div></div></article>`;
  }
  function render(opts = {}) {
    const all = matches(), pool = filtered() ? all : all.slice(1);
    const total = all.length, pages = Math.max(1, Math.ceil(pool.length / PER));
    $("[data-featured]").hidden = filtered();
    const from = (page - 1) * PER, list = pool.slice(from, from + shown);
    const prev = opts.append ? grid.querySelectorAll("[data-card]").length : 0;
    if (news.parentNode === grid) grid.removeChild(news);
    grid.innerHTML = list.map((p, i) => cardHtml(p, opts.append && i >= prev)).join("");
    const cards = grid.querySelectorAll("[data-card]");
    if (cards.length >= 6) cards[5].after(news); else grid.append(news);
    $("[data-empty]").hidden = total > 0;
    $("[data-feed-title]").textContent = query ? `Results for “${query}”` : topic === "All" ? "Latest articles" : topic;
    $("[data-count]").textContent = `${total} article${total === 1 ? "" : "s"}`;
    const lastShown = Math.min(pool.length, from + shown);
    $("[data-more]").hidden = lastShown >= pool.length;
    $("[data-pager]").hidden = total === 0;
    $("[data-showing]").textContent = total ? `Showing ${list.length} of ${total} articles` : "";
    // page numbers: current page highlights the last loaded block
    const cur = page + Math.ceil(shown / PER) - 1;
    const nums = pages <= 7 ? Array.from({ length: pages }, (_, i) => i + 1) : [...new Set([1, 2, 3, cur - 1, cur, cur + 1, pages].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b);
    let html = `<button type="button" aria-label="Previous page" data-page="${page - 1}" ${page === 1 ? "disabled" : ""}>${icon("i-left")}</button>`;
    nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) html += `<span aria-hidden="true">…</span>`; html += `<button type="button" data-page="${n}" ${n >= page && n <= cur ? 'aria-current="page"' : ""} aria-label="Page ${n}">${n}</button>`; });
    html += `<button type="button" aria-label="Next page" data-page="${cur + 1}" ${cur >= pages ? "disabled" : ""}>${icon("i-right")}</button>`;
    $("[data-pages]").innerHTML = html;
    $$("[data-pill]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.pill === topic));
  }
  function setTopic(t, scroll) {
    topic = t; page = 1; shown = PER; render();
    const pill = $(`[data-pill="${CSS.escape(t)}"]`); if (pill) pill.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
    if (scroll) $("#articles").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $("[data-pills]").addEventListener("click", (e) => { const b = e.target.closest("[data-pill]"); if (b) setTopic(b.dataset.pill); });
  $("[data-topics]").addEventListener("click", (e) => { const b = e.target.closest("[data-topic]"); if (b) setTopic(b.dataset.topic, true); });
  $("[data-more]").addEventListener("click", () => { shown += PER; render({ append: true }); });
  $("[data-pages]").addEventListener("click", (e) => { const b = e.target.closest("[data-page]"); if (!b || b.disabled) return; page = +b.dataset.page; shown = PER; render(); $("#articles").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
  $("[data-reset]").addEventListener("click", () => { q.value = ""; query = ""; clr.hidden = true; setTopic("All"); });

  /* ---------- search ---------- */
  const q = $("[data-q]"), clr = $("[data-clear]"); let qt;
  q.addEventListener("input", () => { clr.hidden = !q.value; clearTimeout(qt); qt = setTimeout(() => { query = q.value.trim(); page = 1; shown = PER; render(); }, 150); });
  $("[data-search-form]").addEventListener("submit", (e) => { e.preventDefault(); query = q.value.trim(); page = 1; shown = PER; render(); $("#articles").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
  clr.addEventListener("click", () => { q.value = ""; clr.hidden = true; query = ""; page = 1; shown = PER; render(); q.focus(); });
  $("[data-search-open]").addEventListener("click", () => { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); q.focus({ preventScroll: true }); });

  /* ---------- rail ---------- */
  const POP = [[F.id, "The 4-Day Work Week...", "14.2K"], [BRIEF[0].t, "Async-First: 7 Rules...", "9.8K"], [BRIEF[8].t, "Flowline AI: Your Smart...", "8.1K"], [BRIEF[4].t, "Manager's Guide to Standups", "6.4K"], [BRIEF[6].t, "CI/CD for Non-Engineers", "5.7K"]];
  $("[data-popular]").innerHTML = POP.map(([k, t, n], i) => `<li><button type="button" data-open="${i ? slug(k) : k}"><b>${esc(t)}</b><small>${icon("i-eye")}${n} reads</small></button></li>`).join("");
  const FREE = [["playbook", "The Remote Team Playbook", "Download PDF", "i-download"], ["scorecard", "Project Health Scorecard", "Download Template", "i-download"], ["masterclass", "Flowline Masterclass", "Watch Free", "i-play"]];
  $("[data-free]").innerHTML = FREE.map(([k, t, c, ic]) => `<li><span class="cv">${Art.cover(k, t + " cover")}</span><span><b>${t}</b><button type="button" data-free="${k}">${icon(ic)}${c}</button></span></li>`).join("");

  /* ---------- dialog ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  let lastFocus = null;
  function openDlg(html, focusSel) { lastFocus = document.activeElement; body.innerHTML = html; if (!dlg.open) dlg.showModal(); body.scrollTop = 0; dlg.scrollTop = 0; ($(focusSel || "h2", body) || $("[data-close]")).focus?.(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { body.innerHTML = ""; clearInterval(play); if (location.hash.startsWith("#post/")) history.replaceState(null, "", location.pathname + location.search); if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true }); });

  const TAKE = {
    Productivity: ["Write down the outcome before you plan the work.", "Protect at least two focus blocks per person per week.", "Review and prune your list every Friday."],
    Engineering: ["Keep changes small and reversible.", "Automate the boring checks so reviews focus on design.", "Write down the why, not just the what."],
    "Remote Work": ["Default to written, searchable updates.", "Agree on a few overlap hours and guard them.", "Make social time optional but regular."],
    Leadership: ["Clarity beats charisma: say what good looks like.", "Give feedback early, privately and specifically.", "Model the habits you want to see."],
    "Product Updates": ["Available today on all plans unless noted.", "Admins can enable it from Workspace settings.", "Tell us what you think via in-app feedback."],
    "Customer Stories": ["Start with one team and one workflow.", "Templates made adoption stick.", "Weekly reviews in Flowline replaced status meetings."]
  };
  function openPost(id) {
    const p = byId[id]; if (!p) return;
    history.replaceState(null, "", `#post/${id}`);
    openDlg(`<div class="hero-art">${thumb(p)}</div><article class="in"><span class="badge" style="--c:${COLOR[p.cat]}">${p.cat}</span><h2 id="dlg-title" tabindex="-1">${esc(p.t)}</h2><div class="byline">${av(p.a)}<span><b>${AUTHORS[p.a][0]}</b> · ${AUTHORS[p.a][1]}</span><span>· ${fmtDate(p.d)}</span><span>· ${p.min} min read</span></div><p class="lede">${esc(p.ex)}</p><p>At Flowline we spend a lot of time thinking about how teams plan, communicate and ship. This piece collects what we've learned, the experiments that failed and the habits that stuck, so you can adapt them to your own team.</p><h3>Key takeaways</h3><ul>${TAKE[p.cat].map((x) => `<li>${x}</li>`).join("")}</ul><p class="demo">Demo preview: the full article text isn't included in this sample blog.</p><div class="acts"><button class="btn-o" type="button" data-copylink="${id}">${icon("i-link")}Copy link</button><button class="btn-o" type="button" data-more-topic="${esc(p.cat)}">More in ${p.cat}</button></div></article>`, "h2");
  }
  document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open], [data-card]");
    if (o && !e.target.closest("dialog")) { e.preventDefault(); openPost(o.dataset.open || o.dataset.card); return; }
    const cl = e.target.closest("[data-copylink]");
    if (cl) { const u = `${location.origin}${location.pathname}#post/${cl.dataset.copylink}`; try { navigator.clipboard.writeText(u).then(() => toast("Link copied"), () => toast(u)); } catch { toast(u); } return; }
    const mt = e.target.closest("[data-more-topic]"); if (mt) { dlg.close(); setTopic(mt.dataset.moreTopic, true); return; }
    const tl = e.target.closest("[data-topic-link]"); if (tl) { e.preventDefault(); closeDd(); closeMenu(); setTopic(tl.dataset.topicLink, true); return; }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); closeDd(); closeMenu(); toast(`${s.dataset.soon} isn't part of this blog demo.`); }
  });
  const openFromHash = () => { const m = location.hash.match(/^#post\/(.+)$/); if (m && byId[m[1]]) openPost(m[1]); };

  /* ---------- free resources ---------- */
  function download(name, type, data) { const url = URL.createObjectURL(new Blob([data], { type })); const a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  function pdf(lines) {
    const txt = (s) => s.replace(/[\\()]/g, (c) => "\\" + c);
    let y = 760, stream = "BT\n";
    lines.forEach(([s, size]) => { stream += `/F1 ${size} Tf 1 0 0 1 64 ${y} Tm (${txt(s)}) Tj\n`; y -= size + 10; });
    stream += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
    let out = "%PDF-1.4\n"; const off = [];
    objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => String(n).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    return out;
  }
  const PLAYBOOK = [["The Remote Team Playbook", 24], ["Flowline sample edition", 12], ["", 8], ["1. Write it down: decisions, context and owners live in one place.", 12], ["2. Agree on 3-4 overlap hours and protect them.", 12], ["3. Replace status meetings with weekly written briefs.", 12], ["4. Onboard with a 30-60-90 checklist and a buddy.", 12], ["5. Default to async; escalate to a call after two replies.", 12], ["6. Make wins visible with a weekly highlights post.", 12], ["7. Review your rituals every quarter and drop what's stale.", 12], ["", 8], ["Demo resource from a fictional company. Flowline is not a real product.", 10]];
  const SCORE = "Project Health Scorecard (Flowline sample template)\nArea,Question,Score (1-5),Notes\nScope,Is the goal written down and agreed?,,\nScope,Is out-of-scope work explicitly listed?,,\nSchedule,Are milestones dated and owned?,,\nSchedule,Is the critical path visible?,,\nTeam,Does every task have one owner?,,\nTeam,Is workload balanced this sprint?,,\nRisk,Are top 3 risks tracked with mitigations?,,\nCommunication,Was a status brief sent this week?,,\nQuality,Are acceptance criteria defined?,,\nTotal,,=SUM(C3:C11),\n";
  const CHAPTERS = [["Welcome & workspace setup", "4:12"], ["Projects, views and templates", "11:38"], ["Automations that save hours", "9:05"], ["Reporting and goals", "7:46"], ["Rolling Flowline out to your team", "8:20"]];
  let play;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-free]"); if (!b) return;
    const k = b.dataset.free;
    if (k === "scorecard") { download("project-health-scorecard.csv", "text/csv", SCORE); toast("Template downloaded: project-health-scorecard.csv"); return; }
    if (k === "playbook") {
      const saved = store.get("fl-sub");
      openDlg(`<div class="in"><h2 id="dlg-title">The Remote Team Playbook</h2><p>Seven habits for distributed teams in one printable page. Enter your email and the PDF downloads right away.</p><form novalidate data-gate><label class="sr" for="gate-email">Work email</label><input id="gate-email" type="email" placeholder="you@company.com" value="${esc(saved || "")}" autocomplete="email"><button class="btn" type="submit">${icon("i-download")}Download PDF</button></form><p class="msg" role="status" data-gate-msg></p><p class="demo">Demo: your email stays in this browser and nothing is sent.</p></div>`, "input");
      $("[data-gate]", body).addEventListener("submit", (ev) => {
        ev.preventDefault(); const inp = $("input", ev.target), m = $("[data-gate-msg]", body);
        if (!validEmail(inp.value.trim())) { inp.setAttribute("aria-invalid", "true"); m.className = "msg bad"; m.textContent = "Please enter a valid email address."; inp.focus(); return; }
        inp.removeAttribute("aria-invalid"); download("remote-team-playbook.pdf", "application/pdf", pdf(PLAYBOOK)); m.className = "msg ok"; m.textContent = "Your download has started.";
      });
      return;
    }
    openDlg(`<div class="in"><h2 id="dlg-title">Flowline Masterclass</h2><p>Five short lessons, 41 minutes in total, from your first project to a team-wide rollout.</p><div class="player">${Art.cover("masterclass", "Masterclass video preview")}<div class="bar"><i data-prog></i></div></div><div class="acts"><button class="btn" type="button" data-play aria-pressed="false">${icon("i-play")}<span>Play preview</span></button></div><ol class="chapters">${CHAPTERS.map(([t, d], i) => `<li><button type="button" data-ch="${i}" aria-current="${i === 0}"><span>${i + 1}. ${t}</span><small>${d}</small></button></li>`).join("")}</ol><p class="demo">Demo player: the progress bar is simulated and no video is streamed.</p></div>`, "[data-play]");
  });
  document.addEventListener("click", (e) => {
    const pb = e.target.closest("[data-play]");
    if (pb) {
      const on = pb.getAttribute("aria-pressed") !== "true"; pb.setAttribute("aria-pressed", on); $("span", pb).textContent = on ? "Pause preview" : "Play preview";
      clearInterval(play); if (on) { const bar = $("[data-prog]", body); let w = parseFloat(bar.style.width) || 0; play = setInterval(() => { w = Math.min(100, w + 2); bar.style.width = w + "%"; if (w >= 100) { clearInterval(play); pb.setAttribute("aria-pressed", "false"); $("span", pb).textContent = "Replay preview"; bar.style.width = "0%"; } }, 200); }
      return;
    }
    const ch = e.target.closest("[data-ch]"); if (ch) { $$("[data-ch]", body).forEach((c) => c.setAttribute("aria-current", c === ch)); $("[data-prog]", body).style.width = `${(+ch.dataset.ch / CHAPTERS.length) * 100}%`; }
  });

  /* ---------- newsletter ---------- */
  const nf = $("[data-news-form]"), nm = $("[data-news-msg]");
  function subscribed(email) { news.classList.add("done"); nm.className = "msg ok"; nm.innerHTML = `${icon("i-check")} You're subscribed as <b>${esc(email)}</b>. Watch your inbox on Tuesday. (Demo: stored only in this browser.)`; $(".i", nm).style.cssText = "display:inline;width:16px;height:16px;vertical-align:-3px"; }
  nf.addEventListener("submit", (e) => {
    e.preventDefault(); const inp = nf.email, v = inp.value.trim();
    if (!validEmail(v)) { inp.setAttribute("aria-invalid", "true"); nm.className = "msg bad"; nm.textContent = "Please enter a valid email address."; inp.focus(); return; }
    inp.removeAttribute("aria-invalid"); store.set("fl-sub", v); subscribed(v);
  });
  nf.email.addEventListener("input", () => nf.email.removeAttribute("aria-invalid"));
  if (store.get("fl-sub")) subscribed(store.get("fl-sub"));

  /* ---------- nav ---------- */
  const nav = $("[data-nav]"), ddBtn = $("[data-dd-btn]"), ddMenu = $("[data-dd-menu]"), burger = $("[data-burger]"), mm = $("[data-mmenu]");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function closeDd() { ddMenu.hidden = true; ddBtn.setAttribute("aria-expanded", "false"); }
  ddBtn.addEventListener("click", () => { const open = ddMenu.hidden; ddMenu.hidden = !open; ddBtn.setAttribute("aria-expanded", open); if (open) $("a", ddMenu).focus(); });
  $("[data-dd]").addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeDd(); ddBtn.focus(); }
    if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !ddMenu.hidden) { e.preventDefault(); const items = $$("a", ddMenu), i = items.indexOf(document.activeElement); items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus(); }
  });
  document.addEventListener("click", (e) => { if (!e.target.closest("[data-dd]")) closeDd(); });
  ddMenu.addEventListener("click", (e) => { if (e.target.closest("a[href='#articles']") && !e.target.closest("[data-topic-link]")) closeDd(); });
  function closeMenu() { if (mm.hidden) return; mm.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); $("use", burger).setAttribute("href", "#i-menu"); }
  burger.addEventListener("click", () => { const open = mm.hidden; mm.hidden = !open; burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu"); });
  mm.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  addEventListener("resize", () => { if (innerWidth > 900) closeMenu(); });

  /* ---------- toast ---------- */
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  render();
  openFromHash();
  addEventListener("hashchange", openFromHash);
})();
