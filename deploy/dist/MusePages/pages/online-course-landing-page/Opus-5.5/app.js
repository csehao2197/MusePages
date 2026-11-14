(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "i") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- curriculum ---------- */
  const MODULES = [
    { t: "Web Foundations", w: "Weeks 1-2", topics: ["HTML5 semantics & accessibility", "CSS layout: Flexbox & Grid", "Responsive design & media queries", "Dev tools, VS Code & the terminal"], lessons: 8, projects: ["Responsive portfolio site", "Landing page clone"] },
    { t: "JavaScript Deep Dive", w: "Weeks 3-4", topics: ["Variables, types & control flow", "Functions, scope & closures", "DOM manipulation & events", "Async JS: promises, async/await & fetch", "TypeScript fundamentals"], lessons: 10, projects: ["Interactive quiz app", "Weather dashboard (API)"] },
    { t: "React & Frontend", w: "Weeks 5-7", topics: ["Components, props & JSX", "State & hooks", "Routing & data fetching with Next.js", "Styling, forms & testing"], lessons: 11, projects: ["Task manager app", "E-commerce storefront", "Next.js blog"] },
    { t: "Backend with Node.js", w: "Weeks 8-9", topics: ["Node.js & Express servers", "REST API design", "Authentication with JWT & sessions", "Middleware, validation & error handling"], lessons: 9, projects: ["REST API for a notes app", "Auth service"] },
    { t: "Databases & Deployment", w: "Weeks 10-11", topics: ["SQL & PostgreSQL basics", "Prisma ORM & migrations", "Git workflows, GitHub Actions & CI/CD", "Deploying on Vercel & AWS"], lessons: 10, projects: ["Full-stack recipe app", "CI/CD pipeline", "Cloud deployment"] },
    { t: "Capstone & Career", w: "Week 12", topics: ["Capstone planning & build sprints", "Portfolio & GitHub polish", "Resume, LinkedIn & interview prep", "Demo day presentation"], lessons: 6, projects: ["Capstone project"], capstone: true }
  ];
  const mods = $("[data-mods]");
  mods.innerHTML = MODULES.map((m, i) => {
    const projs = m.projects.length;
    const count = `${m.lessons} lessons · ${m.capstone ? "capstone" : projs + " projects"}`;
    return `<div class="mod${i === 0 ? " open" : ""}" data-mod="${i}">
      <button class="mod-h" type="button" aria-expanded="${i === 0}" aria-controls="mod-b-${i}" id="mod-h-${i}">
        <span class="mod-n">${String(i + 1).padStart(2, "0")}</span>
        <span class="mod-t"><b>Module ${i + 1}: ${m.t}</b><small>${m.w}</small></span>
        <span class="mod-c">${count}</span>${icon("i-chevron")}
      </button>
      <div class="mod-b" id="mod-b-${i}" role="region" aria-labelledby="mod-h-${i}"><div><ul>
        ${m.topics.map((t) => `<li>${icon("i-book")}${esc(t)}</li>`).join("")}
        ${m.projects.map((p) => `<li class="proj">${icon("i-folder")}${esc(p)}<span class="tag">${m.capstone ? "Capstone" : "Project"}</span></li>`).join("")}
      </ul></div></div>
    </div>`;
  }).join("");
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons, 0);
  const totalProjects = MODULES.filter((m) => !m.capstone).reduce((a, m) => a + m.projects.length, 0);
  $("[data-total]").textContent = `${totalLessons} lessons • ${totalProjects} hands-on projects • 1 capstone`;
  const setMod = (el, open) => { el.classList.toggle("open", open); $(".mod-h", el).setAttribute("aria-expanded", open); };
  const expandBtn = $("[data-expand-all]");
  const syncExpand = () => { expandBtn.textContent = $$(".mod").every((m) => m.classList.contains("open")) ? "Collapse all" : "Expand all"; };
  mods.addEventListener("click", (e) => {
    const h = e.target.closest(".mod-h"); if (!h) return;
    const m = h.parentElement; setMod(m, !m.classList.contains("open")); syncExpand();
  });
  expandBtn.addEventListener("click", () => {
    const all = $$(".mod").every((m) => m.classList.contains("open"));
    $$(".mod").forEach((m) => setMod(m, !all)); syncExpand();
  });

  /* ---------- nav shadow + mobile bar ---------- */
  const nav = $("[data-nav]"), mbar = $("[data-mbar]"), hero = $(".hero"), final = $(".final");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 8);
    const past = hero.getBoundingClientRect().bottom < 0;
    const f = final.getBoundingClientRect();
    const finalVisible = f.top < innerHeight && f.bottom > 0;
    mbar.classList.toggle("show", past && !finalVisible);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- FAQ: one open at a time ---------- */
  const faq = $("[data-faq]");
  $$("details", faq).forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) $$("details", faq).forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ---------- countdown ---------- */
  // The brief's "April 14" cohort date has passed; use the next April 14 or, failing that, a rolling cohort start.
  function nextCohort(now) {
    const y = now.getFullYear();
    let d = new Date(y, 3, 14, 19, 0, 0);
    if (d <= now) d = new Date(y + 1, 3, 14, 19, 0, 0);
    return d;
  }
  const target = nextCohort(new Date());
  $("[data-cd-date]").textContent = `Cohort kicks off ${target.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} at 7 PM`;
  const cdEls = { d: $('[data-cd-u="d"]'), h: $('[data-cd-u="h"]'), m: $('[data-cd-u="m"]'), s: $('[data-cd-u="s"]') };
  const spotsLeft = 35 - 13; // sample seats already reserved
  $("[data-left]").textContent = `${spotsLeft} left for this cohort`;
  function tick() {
    let ms = Math.max(0, target - Date.now());
    const d = Math.floor(ms / 864e5); ms -= d * 864e5;
    const h = Math.floor(ms / 36e5); ms -= h * 36e5;
    const m = Math.floor(ms / 6e4); ms -= m * 6e4;
    const s = Math.floor(ms / 1e3);
    cdEls.d.textContent = d; cdEls.h.textContent = String(h).padStart(2, "0");
    cdEls.m.textContent = String(m).padStart(2, "0"); cdEls.s.textContent = String(s).padStart(2, "0");
  }
  tick(); setInterval(tick, 1000);

  /* ---------- dialog ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  let onClose = null;
  function openDlg(html, { wide = false, close } = {}) {
    body.innerHTML = html; dlg.classList.toggle("wide", wide); onClose = close || null;
    if (!dlg.open) dlg.showModal();
    const f = $("input, .seg button, .p-play", body); if (f) f.focus();
  }
  dlg.addEventListener("close", () => { if (onClose) onClose(); onClose = null; body.innerHTML = ""; });
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  const toastEl = $("[data-toast]"); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); };

  /* ---------- preview lesson (mock player) ---------- */
  const CAPTIONS = [
    [0, "Welcome to Module 3! Today we build our first React component."],
    [6, "A component is just a function that returns JSX — markup that lives next to your logic."],
    [14, "We pass data in with props, like arguments to a function."],
    [22, "Then useState lets the component remember things between renders."],
    [30, "By the end of this lesson you'll have a working counter — your first interactive UI."]
  ];
  const LEN = 38;
  const playerArt = `<svg viewBox="0 0 640 360" aria-hidden="true"><rect width="640" height="360" fill="#1E1B4B"/><rect x="40" y="40" width="360" height="280" rx="12" fill="#0F172A"/><g font-family="JetBrains Mono, monospace" font-size="15"><text x="64" y="84" fill="#F472B6">function <tspan fill="#A5B4FC">Counter</tspan><tspan fill="#E0E7FF">() {</tspan></text><text x="84" y="114" fill="#F472B6">const <tspan fill="#E0E7FF">[n, setN] = </tspan><tspan fill="#A5B4FC">useState</tspan><tspan fill="#E0E7FF">(0);</tspan></text><text x="84" y="144" fill="#F472B6">return <tspan fill="#E0E7FF">(</tspan></text><text x="104" y="174" fill="#86EFAC">&lt;button onClick={…}&gt;</text><text x="124" y="204" fill="#E0E7FF">Clicked {n} times</text><text x="104" y="234" fill="#86EFAC">&lt;/button&gt;</text><text x="84" y="264" fill="#E0E7FF">);</text><text x="64" y="294" fill="#E0E7FF">}</text></g><circle cx="520" cy="150" r="64" fill="#6366F1"/><ellipse cx="520" cy="138" rx="26" ry="30" fill="#D9A27E"/><path d="M494 130c0-26 12-38 26-38s28 10 26 36c-6-10-14-15-22-16-10 4-20 6-30 18z" fill="#2E1F1A"/><path d="M470 214c6-30 26-44 50-44s44 14 50 44z" fill="#334155"/><text x="520" y="262" text-anchor="middle" fill="#C7D2FE" font-family="Inter, sans-serif" font-size="14">Alex Rivera</text></svg>`;
  function openPreview() {
    let t = 0, timer = null;
    openDlg(`<h3>Free preview: Your first React component</h3><p class="lead">Module 3 · Lesson 1 · 38-second excerpt (demo player with captions)</p>
      <div class="player">${playerArt}</div>
      <div class="p-ctrl"><button class="icon-btn p-play" type="button" aria-label="Play preview" data-play>${icon("i-play")}</button><div class="p-bar" aria-hidden="true"><i data-pbar></i></div><span class="p-time" data-ptime>0:00 / 0:38</span></div>
      <p class="cap" data-cap aria-live="polite">Press play to start the preview.</p>
      <button class="btn btn-primary" type="button" style="width:100%;margin-top:16px" data-to-enroll>Enroll Now — $599</button>`, { wide: true, close: () => clearInterval(timer) });
    const play = $("[data-play]", body), bar = $("[data-pbar]", body), time = $("[data-ptime]", body), cap = $("[data-cap]", body);
    const fmt = (s) => `0:${String(s).padStart(2, "0")}`;
    const render = () => {
      bar.style.width = `${(t / LEN) * 100}%`; time.textContent = `${fmt(t)} / ${fmt(LEN)}`;
      const c = [...CAPTIONS].reverse().find(([s]) => t >= s); if (c && timer) cap.textContent = c[1];
      if (t >= LEN) cap.textContent = "That's the end of the preview — enroll to watch the full lesson.";
    };
    const stop = () => { clearInterval(timer); timer = null; play.innerHTML = icon("i-play"); play.setAttribute("aria-label", "Play preview"); };
    play.addEventListener("click", () => {
      if (timer) return stop();
      if (t >= LEN) t = 0;
      play.innerHTML = icon("i-pause"); play.setAttribute("aria-label", "Pause preview");
      timer = setInterval(() => { t++; render(); if (t >= LEN) stop(); }, 1000);
      render();
    });
    $("[data-to-enroll]", body).addEventListener("click", () => openEnroll("once"));
  }
  $$("[data-preview]").forEach((b) => b.addEventListener("click", openPreview));

  /* ---------- enroll (mock checkout) ---------- */
  const PLANS = {
    once: { name: "One-Time Payment", lines: [["Full-Stack Web Development Bootcamp", "$1,199"], ["Launch discount", "−$600"]], total: "$599 today" },
    plan: { name: "3-Month Plan", lines: [["Payment 1 of 3 (today)", "$219"], ["Payments 2–3 (monthly)", "$438"]], total: "$657 total" }
  };
  let enrolled = false;
  function openEnroll(planKey) {
    if (enrolled) { toast("You're already enrolled — check your inbox for the welcome email."); return; }
    let plan = planKey;
    const sum = () => { const p = PLANS[plan]; return p.lines.map(([a, b]) => `<div><span>${a}</span><span>${b}</span></div>`).join("") + `<div class="tot"><span>${p.name}</span><span>${p.total}</span></div>`; };
    openDlg(`<h3>Enroll in the bootcamp</h3><p class="lead">Next cohort: ${esc(target.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))} · ${spotsLeft} spots left</p>
      <div class="seg" role="group" aria-label="Payment option"><button type="button" data-plan="once" aria-pressed="${plan === "once"}">$599 one-time</button><button type="button" data-plan="plan" aria-pressed="${plan === "plan"}">$219 × 3 months</button></div>
      <div class="summary" data-sum>${sum()}</div>
      <form class="form" data-enroll-form novalidate>
        <label>Full name<input name="name" autocomplete="name" required></label>
        <label>Email<input name="email" type="email" autocomplete="email" required></label>
        <p class="err" data-err role="alert"></p>
        <button class="btn btn-primary" type="submit">Reserve my seat</button>
        <p class="note">${icon("i-lock")}Demo checkout — no payment is taken. 30-day money-back guarantee.</p>
      </form>`);
    $$("[data-plan]", body).forEach((b) => b.addEventListener("click", () => {
      plan = b.dataset.plan;
      $$("[data-plan]", body).forEach((x) => x.setAttribute("aria-pressed", x === b));
      $("[data-sum]", body).innerHTML = sum();
    }));
    $("[data-enroll-form]", body).addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, name = f.name.value.trim(), email = f.email.value.trim();
      const errs = [];
      f.name.setAttribute("aria-invalid", !name); f.email.setAttribute("aria-invalid", !/^\S+@\S+\.\S+$/.test(email));
      if (!name) errs.push("your name");
      if (!/^\S+@\S+\.\S+$/.test(email)) errs.push("a valid email");
      if (errs.length) { $("[data-err]", body).textContent = `Please enter ${errs.join(" and ")}.`; return; }
      enrolled = true;
      $("[data-spots]").textContent = 35; $("[data-left]").textContent = `${spotsLeft - 1} left for this cohort`;
      body.innerHTML = `<span class="ok-ico">${icon("i-check")}</span><h3>You're in, ${esc(name.split(" ")[0])}!</h3>
        <p class="lead">Seat reserved on the <b>${PLANS[plan].name}</b> (${PLANS[plan].total}). We'd send onboarding details to ${esc(email)} — in this demo nothing is sent.</p>
        <button class="btn btn-primary" type="button" data-close-ok style="width:100%">Done</button>`;
      $("[data-close-ok]", body).addEventListener("click", () => dlg.close());
      $$("[data-enroll]").forEach((b) => { if (b.closest(".nav, .mbar")) b.firstChild.textContent = "Enrolled "; });
    });
  }
  $$("[data-enroll]").forEach((b) => b.addEventListener("click", () => openEnroll(b.dataset.enroll)));
})();
