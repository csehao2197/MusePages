(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* unavailable */ } } };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- site content (single config object) ---------- */
  const CONTENT = {
    email: "hello@jordanreyes.example",
    projects: [
      { id: "ledgerline", name: "Ledgerline", kind: "Full-stack", art: "ledger", year: 2026, desc: "A personal finance dashboard that categorizes transactions and forecasts monthly cash flow.", stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
        problem: "Freelancers juggle irregular income and couldn't see next month's runway at a glance.", role: "Solo build: product design, front end, API and deployment.", result: "Server components and streaming cut the dashboard's first paint to 0.8 s on a mid-range phone.", kpis: [["0.8s", "first contentful paint"], ["1.2K", "monthly active users"], ["98", "Lighthouse performance"]] },
      { id: "trailmate", name: "TrailMate", kind: "Frontend", art: "trail", year: 2025, desc: "An offline-first PWA for planning hikes, with elevation profiles and downloadable route packs.", stack: ["React", "Vite", "MapLibre GL", "Service Workers", "IndexedDB"],
        problem: "Hikers lose signal exactly when they need their map most.", role: "Lead front-end engineer in a team of three.", result: "Route packs cache tiles and elevation data so trails work with no connection.", kpis: [["100%", "offline route access"], ["4.8", "average store rating"], ["-62%", "data usage vs. v1"]] },
      { id: "commitly", name: "Commitly", kind: "Tools", art: "commit", year: 2025, desc: "A CLI that guides conventional commits and automates version bumps and changelogs.", stack: ["Node.js", "TypeScript", "Commander", "semver"],
        problem: "Inconsistent commit messages made release notes a manual chore.", role: "Creator and maintainer (open source).", result: "Teams release with one command: version bump, CHANGELOG.md, tag and commit.", kpis: [["3.1K", "weekly downloads"], ["42", "contributors"], ["< 1s", "release prep"]] },
      { id: "shelfie", name: "Shelfie", kind: "Mobile", art: "shelf", year: 2024, desc: "A book-tracking app with reading goals, progress streaks and shared shelves for friends.", stack: ["React Native", "Expo", "Supabase", "TypeScript"],
        problem: "Readers wanted a calm, ad-free way to track books and share recommendations.", role: "Full-stack developer, from schema to app-store release.", result: "Shipped iOS and Android from one codebase in 10 weeks.", kpis: [["10 wk", "idea to launch"], ["25K", "books logged"], ["99.9%", "crash-free sessions"]] },
      { id: "pulseboard", name: "Pulseboard", kind: "Full-stack", art: "pulse", year: 2024, desc: "A real-time operations dashboard that streams service metrics and incident alerts over WebSockets.", stack: ["Go", "WebSockets", "Redis", "React", "D3"],
        problem: "On-call engineers were switching between five tools during incidents.", role: "Backend and visualization lead.", result: "One live screen with p95 latency under 120 ms per update at 10K events/s.", kpis: [["10K/s", "events streamed"], ["120ms", "p95 update latency"], ["-35%", "time to acknowledge"]] },
      { id: "folio", name: "Folio", kind: "Frontend", art: "folio", year: 2026, desc: "This portfolio: content from typed config objects, a theme toggle and a perfect accessibility score.", stack: ["Next.js 15", "React", "Tailwind CSS", "TypeScript"],
        problem: "My old site was slow, hard to update and inaccessible with a keyboard.", role: "Design and development.", result: "Every section is driven by one content file, and releases are automated with conventional commits.", kpis: [["100", "Lighthouse accessibility"], ["< 60KB", "JavaScript shipped"], ["1", "file to update content"]] }
    ],
    skills: [
      ["Languages", "i-code", [["TypeScript", 95, "7 yrs"], ["JavaScript", 95, "8 yrs"], ["Go", 70, "3 yrs"], ["SQL", 80, "6 yrs"]]],
      ["Frontend", "i-layout", [["React", 95, "6 yrs"], ["Next.js", 90, "4 yrs"], ["Tailwind CSS", 90, "4 yrs"], ["Accessibility (WCAG)", 85, "5 yrs"]]],
      ["Backend", "i-server", [["Node.js", 90, "7 yrs"], ["PostgreSQL", 80, "6 yrs"], ["Redis", 70, "4 yrs"], ["REST & GraphQL", 85, "6 yrs"]]],
      ["Tooling", "i-tool", [["Git & CI/CD", 90, "7 yrs"], ["Testing (Playwright, Vitest)", 85, "5 yrs"], ["Docker", 75, "4 yrs"], ["Figma", 70, "5 yrs"]]]
    ],
    experience: [
      ["2023 — Present", "Senior Full-Stack Engineer", "Northwind Cloud (remote)", ["Led the migration of the customer dashboard to Next.js App Router, cutting load time by 48%.", "Built the design system used by 4 product teams (60+ components, fully accessible).", "Mentor two junior engineers; introduced conventional commits and automated releases."]],
      ["2020 — 2023", "Front-End Developer", "Brightline Studio", ["Shipped 20+ marketing sites and web apps for clients in retail and healthcare.", "Raised average Lighthouse scores from 62 to 95 across client projects.", "Ran internal workshops on accessibility and performance budgets."]],
      ["2018 — 2020", "Junior Developer", "Coinpath (fintech startup)", ["Built onboarding flows and KYC forms used by 80K customers.", "Wrote the first end-to-end test suite, catching regressions before release."]],
      ["2017 — 2018", "Freelance Web Developer", "Self-employed", ["Built websites for 15 local businesses and learned to talk to clients in plain language."]]
    ]
  };

  /* ---------- portrait ---------- */
  $("[data-me]").innerHTML = Art.me("Illustrated portrait of Jordan Reyes wearing glasses and a purple sweater");

  /* ---------- projects ---------- */
  const KINDS = ["All", "Full-stack", "Frontend", "Mobile", "Tools"];
  let kind = "All";
  $("[data-filters]").innerHTML = KINDS.map((k) => `<button type="button" aria-pressed="${k === "All"}" data-kind="${k}">${k}</button>`).join("");
  function renderProjects() {
    const list = CONTENT.projects.filter((p) => kind === "All" || p.kind === kind);
    $("[data-pcount]").textContent = `${list.length} project${list.length === 1 ? "" : "s"}${kind === "All" ? "" : ` · ${kind}`}`;
    $("[data-projects]").innerHTML = list.map((p) => `<article class="pc" data-pid="${p.id}"><div class="th">${Art.thumb(p.art, `${p.name} interface preview`)}</div><div class="b"><span class="kind">${p.kind} · ${p.year}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><ul class="stack" aria-label="Tech stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><div class="links"><a href="#projects" data-soon="${p.name} on GitHub" aria-label="${p.name} source on GitHub">${icon("i-gh")}GitHub</a><a href="#projects" data-soon="${p.name} live demo" aria-label="${p.name} live demo">${icon("i-ext")}Live demo</a><button class="det" type="button" data-detail="${p.id}" aria-label="${p.name} case study">Case study${icon("i-arrow")}</button></div></div></article>`).join("");
    $$("[data-kind]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.kind === kind));
  }
  $("[data-filters]").addEventListener("click", (e) => { const b = e.target.closest("[data-kind]"); if (!b) return; kind = b.dataset.kind; renderProjects(); });

  /* ---------- case-study dialog (deep link #project/<id>) ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  let back = null;
  function openProject(id) {
    const p = CONTENT.projects.find((x) => x.id === id); if (!p) return;
    back = document.activeElement;
    history.replaceState(null, "", `#project/${id}`);
    body.innerHTML = `<div class="th">${Art.thumb(p.art, `${p.name} interface preview`)}</div><div class="in"><p class="eyebrow">${p.kind} · ${p.year}</p><h2 id="dlg-title">${esc(p.name)}</h2><p>${esc(p.desc)}</p><ul class="kpis">${p.kpis.map(([v, l]) => `<li><b>${v}</b><span>${l}</span></li>`).join("")}</ul><h3>The problem</h3><p>${esc(p.problem)}</p><h3>My role</h3><p>${esc(p.role)}</p><h3>Outcome</h3><p>${esc(p.result)}</p><h3>Stack</h3><ul class="stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul><div class="acts"><a class="btn" href="#projects" data-soon="${p.name} live demo">${icon("i-ext")}Live demo</a><a class="btn-o" href="#projects" data-soon="${p.name} on GitHub">${icon("i-gh")}Source code</a></div></div>`;
    if (!dlg.open) dlg.showModal();
    $("[data-close]").focus();
  }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (dlg.open) return; body.innerHTML = ""; if (location.hash.startsWith("#project/")) history.replaceState(null, "", location.pathname + location.search + "#projects"); if (back && back.isConnected) back.focus({ preventScroll: true }); });
  const fromHash = () => { const m = location.hash.match(/^#project\/([\w-]+)$/); if (m) openProject(m[1]); };

  /* ---------- skills + experience ---------- */
  $("[data-skills]").innerHTML = CONTENT.skills.map(([g, ic, items]) => `<div class="sg"><h3>${icon(ic)}${g}</h3><ul>${items.map(([n, lv, y]) => `<li><span>${esc(n)}<small>${y}</small></span><div class="lvl" role="img" aria-label="${esc(n)}: ${lv >= 90 ? "expert" : lv >= 80 ? "advanced" : "proficient"}"><i style="--w:${lv}%"></i></div></li>`).join("")}</ul></div>`).join("");
  $("[data-exp]").innerHTML = CONTENT.experience.map(([t, role, co, pts]) => `<li><time>${t}</time><div><h3>${esc(role)}</h3><p class="co">${esc(co)}</p><ul>${pts.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></li>`).join("");

  /* ---------- contact ---------- */
  const form = $("[data-form]"), fm = $("[data-form-msg]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, bad = [];
    [["name", (v) => v.trim().length > 1, "your name"], ["email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "a valid email"], ["msg", (v) => v.trim().length >= 20, "a message of at least 20 characters"]].forEach(([n, ok, label]) => { const el = f[n]; if (ok(el.value)) el.removeAttribute("aria-invalid"); else { el.setAttribute("aria-invalid", "true"); bad.push([el, label]); } });
    if (bad.length) { fm.className = "msg bad"; fm.textContent = `Please add ${bad.map((b) => b[1]).join(", ")}.`; bad[0][0].focus(); return; }
    const subject = `${f.topic.value} — from ${f.name.value.trim()}`, text = `${f.msg.value.trim()}\n\n${f.name.value.trim()} · ${f.email.value.trim()}`;
    const href = `mailto:${CONTENT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    fm.className = "msg ok"; fm.innerHTML = `Your message is ready. <a href="${esc(href)}" data-mailto>Open it in your email app</a>.`;
    $("[data-mailto]", fm).focus();
  });
  $$("input, textarea", form).forEach((el) => el.addEventListener("input", () => el.removeAttribute("aria-invalid")));
  $("[data-copy-email]").addEventListener("click", (e) => {
    const b = e.currentTarget, ok = () => { $("use", b).setAttribute("href", "#i-check"); toast("Email address copied"); setTimeout(() => $("use", b).setAttribute("href", "#i-copy"), 1600); };
    try { navigator.clipboard.writeText(CONTENT.email).then(ok, () => toast(CONTENT.email)); } catch { toast(CONTENT.email); }
  });

  /* ---------- CV (one-page PDF generated in the browser) ---------- */
  function pdf(lines) {
    const t = (s) => s.replace(/[\\()]/g, (c) => "\\" + c);
    let y = 750, st = "BT\n"; lines.forEach(([s, size, gap = 8]) => { st += `/F${size > 13 ? 2 : 1} ${size} Tf 1 0 0 1 60 ${y} Tm (${t(s)}) Tj\n`; y -= size + gap; }); st += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${st.length} >>\nstream\n${st}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    let out = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => String(n).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    return out;
  }
  $("[data-cv]").addEventListener("click", () => {
    const L = [["Jordan Reyes", 24, 6], ["Full-Stack Developer · Lisbon, Portugal · " + CONTENT.email, 10, 18], ["Experience", 15]];
    CONTENT.experience.forEach(([t, r, c, pts]) => { L.push([`${r} - ${c} (${t.replace("—", "-")})`, 11, 4]); pts.forEach((p) => L.push([`  - ${p}`, 9, 4])); L.push(["", 4, 4]); });
    L.push(["Skills", 15]); CONTENT.skills.forEach(([g, , it]) => L.push([`${g}: ${it.map((i) => i[0]).join(", ")}`, 10, 5]));
    L.push(["", 6], ["Selected projects", 15]); CONTENT.projects.forEach((p) => L.push([`${p.name} - ${p.desc}`, 9, 5]));
    L.push(["", 8], ["Sample CV for a fictional portfolio.", 8]);
    const url = URL.createObjectURL(new Blob([pdf(L)], { type: "application/pdf" })), a = document.createElement("a");
    a.href = url; a.download = "jordan-reyes-cv.pdf"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("CV downloaded: jordan-reyes-cv.pdf");
  });

  /* ---------- theme ---------- */
  const tb = $("[data-theme-btn]");
  const syncTheme = () => { const d = document.documentElement.dataset.theme === "dark"; $("use", tb).setAttribute("href", d ? "#i-sun" : "#i-moon"); tb.setAttribute("aria-label", d ? "Switch to light theme" : "Switch to dark theme"); };
  tb.addEventListener("click", () => { const d = document.documentElement.dataset.theme === "dark"; if (d) delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = "dark"; store.set("jr-theme", d ? "light" : "dark"); syncTheme(); });
  syncTheme();

  /* ---------- header, menu, scroll spy ---------- */
  const hdr = $("[data-hdr]"), nav = $("[data-nav]"), burger = $("[data-burger]");
  addEventListener("scroll", () => hdr.classList.toggle("scrolled", scrollY > 8), { passive: true });
  function setMenu(open) { nav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu"); }
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); } });
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) $$("[data-link]").forEach((a) => { const on = a.dataset.link === en.target.id; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }), { rootMargin: "-45% 0px -50% 0px" });
    ["top", "about", "projects", "skills", "experience", "contact"].forEach((id) => spy.observe(document.getElementById(id)));
    if (!reduce) {
      const rv = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
      $$(".sec .wrap > *").forEach((el) => { el.classList.add("reveal"); rv.observe(el); });
    }
    const sk = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); sk.disconnect(); } }), { threshold: 0.2 });
    sk.observe($("[data-skills]"));
  } else $("[data-skills]").classList.add("in");

  /* ---------- delegated: details, soon links ---------- */
  document.addEventListener("click", (e) => {
    const d = e.target.closest("[data-detail]"); if (d) { openProject(d.dataset.detail); return; }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon}: links are placeholders in this demo portfolio.`); }
  });
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  renderProjects();
  fromHash();
  addEventListener("hashchange", fromHash);
})();
