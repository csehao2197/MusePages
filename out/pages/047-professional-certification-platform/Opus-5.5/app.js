(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => n.toLocaleString("en-US");

  /* ---------- badge art ---------- */
  const SHAPES = {
    shield: "M32 3 57 12v18c0 15-10 26-25 31C17 56 7 45 7 30V12z",
    hex: "M32 3 57 17.5v29L32 61 7 46.5v-29z",
    oct: "M21 4h22l17 17v22L43 60H21L4 43V21z",
    diamond: "M32 2 62 32 32 62 2 32z",
    circle: "M32 3a29 29 0 1 1 0 58 29 29 0 0 1 0-58z",
    square: "M14 4h36a10 10 0 0 1 10 10v36a10 10 0 0 1-10 10H14A10 10 0 0 1 4 50V14A10 10 0 0 1 14 4z"
  };
  const GLYPHS = {
    cloud: '<path d="M24 41h17a8 8 0 0 0 1-15.9A11 11 0 0 0 21 27a7 7 0 0 0 3 14z"/>',
    db: '<ellipse cx="32" cy="22" rx="11" ry="4"/><path d="M21 22v20c0 2.2 4.9 4 11 4s11-1.8 11-4V22M21 32c0 2.2 4.9 4 11 4s11-1.8 11-4"/>',
    shield: '<path d="M32 18l11 4v8c0 7-4.5 11.5-11 14-6.5-2.5-11-7-11-14v-8z"/><path d="m27 31 4 4 7-7"/>',
    neural: '<circle cx="22" cy="24" r="3"/><circle cx="22" cy="40" r="3"/><circle cx="42" cy="32" r="3"/><circle cx="32" cy="20" r="3"/><circle cx="32" cy="44" r="3"/><path d="m25 24 4-3M25 40l4 3M35 21l5 9M35 43l5-9M22 27v10"/>',
    chart: '<path d="M21 43h22M24 38v-6M31 38V25M38 38v-10"/>',
    lock: '<rect x="23" y="29" width="18" height="14" rx="3"/><path d="M27 29v-4a5 5 0 0 1 10 0v4"/>',
    gear: '<circle cx="32" cy="32" r="5"/><path d="M32 19v4M32 41v4M19 32h4M41 32h4M23 23l3 3M38 38l3 3M41 23l-3 3M26 38l-3 3"/>',
    target: '<circle cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="5"/><path d="M40 24l5-5"/>',
    pipeline: '<rect x="19" y="21" width="9" height="9" rx="2"/><rect x="36" y="34" width="9" height="9" rx="2"/><path d="M28 25.5h4a4 4 0 0 1 4 4v4.5"/>',
    bug: '<rect x="25" y="24" width="14" height="18" rx="7"/><path d="M32 24v18M25 30h-5M39 30h5M25 37h-5M39 37h5M28 24l-2-4M36 24l2-4"/>',
    spark: '<path d="M32 18l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/>'
  };
  let gid = 0;
  function badge(shape, c1, c2, glyph) {
    const id = `bg${gid++}`;
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><path d="${SHAPES[shape]}" fill="url(#${id})"/><path d="${SHAPES[shape]}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2" transform="translate(32 32) scale(.84) translate(-32 -32)"/><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${GLYPHS[glyph]}</g></svg>`;
  }
  $("[data-hero-badge]").innerHTML = `<svg viewBox="0 0 104 104" aria-hidden="true"><defs><linearGradient id="hs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#60A5FA"/><stop offset=".5" stop-color="#2563EB"/><stop offset="1" stop-color="#1E3A8A"/></linearGradient></defs><g fill="#93C5FD">${Array.from({ length: 16 }, (_, i) => `<path d="M52 2l5 9h-10z" transform="rotate(${i * 22.5} 52 52)"/>`).join("")}</g><path d="M52 8 88 21v26c0 22-15 38-36 46C31 85 16 69 16 47V21z" fill="url(#hs)"/><path d="M52 18 79 28v19c0 16-11 28-27 34-16-6-27-18-27-34V28z" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/><path d="M40 56h22a9 9 0 0 0 1-17.9A13 13 0 0 0 38 40a8 8 0 0 0 2 16z" fill="#fff"/><path d="m45 48 5 5 9-9" fill="none" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  /* ---------- catalog ---------- */
  const CATS = { cloud: "Cloud & Infrastructure", data: "Data & Analytics", sec: "Cybersecurity", ai: "AI & Machine Learning" };
  const CERTS = [
    { id: "CAP", t: "Cloud Architecture Professional", cat: "cloud", lvl: "Expert", b: ["shield", "#3B82F6", "#1D4ED8", "cloud"], d: "Design and implement scalable, secure cloud infrastructure", study: 80, exam: "3 hr", price: 549, diff: 3, n: 2340, skills: ["Multi-region architecture", "Networking & identity", "Cost optimization", "Resilience & disaster recovery"] },
    { id: "DEA", t: "Data Engineering Associate", cat: "data", lvl: "Intermediate", b: ["hex", "#22C55E", "#15803D", "db"], d: "Build and maintain data pipelines at production scale", study: 50, exam: "2 hr", price: 399, diff: 2, n: 4120, skills: ["Batch & streaming pipelines", "Data modeling", "Orchestration", "Data quality"] },
    { id: "CSA", t: "Cybersecurity Analyst", cat: "sec", lvl: "Intermediate", b: ["oct", "#F87171", "#B91C1C", "shield"], d: "Detect, analyze, and respond to security threats", study: 60, exam: "2.5 hr", price: 449, diff: 2, n: 3580, skills: ["Threat detection", "SIEM & log analysis", "Incident response", "Vulnerability management"] },
    { id: "AIE", t: "AI/ML Engineer Professional", cat: "ai", lvl: "Expert", b: ["diamond", "#A78BFA", "#6D28D9", "neural"], d: "Deploy and optimize production machine learning systems", study: 100, exam: "3.5 hr", price: 599, diff: 3, n: 1890, skills: ["Model training & evaluation", "MLOps & monitoring", "LLM applications", "Serving at scale"] },
    { id: "CF", t: "Cloud Foundations", cat: "cloud", lvl: "Beginner", b: ["circle", "#7DD3FC", "#0284C7", "cloud"], d: "Core concepts of cloud computing and services", study: 25, exam: "1 hr", price: 199, diff: 1, n: 8740, skills: ["Cloud service models", "Core compute & storage", "Security basics", "Pricing & billing"] },
    { id: "DAF", t: "Data Analytics Fundamentals", cat: "data", lvl: "Beginner", b: ["circle", "#4ADE80", "#16A34A", "chart"], d: "SQL, data visualization, and analytical thinking", study: 30, exam: "1.5 hr", price: 249, diff: 1, n: 6210, skills: ["SQL querying", "Dashboards & visualization", "Statistics basics", "Storytelling with data"] },
    { id: "DKA", t: "DevOps & Kubernetes Associate", cat: "cloud", lvl: "Intermediate", b: ["hex", "#60A5FA", "#1E40AF", "gear"], d: "Automate delivery with containers, CI/CD and infrastructure as code", study: 55, exam: "2 hr", price: 429, diff: 2, n: 3010, skills: ["Docker & Kubernetes", "CI/CD pipelines", "Terraform", "Observability"] },
    { id: "CSS", t: "Cloud Security Specialist", cat: "cloud", lvl: "Expert", b: ["shield", "#38BDF8", "#0E7490", "lock"], d: "Secure identities, workloads and data across cloud platforms", study: 75, exam: "3 hr", price: 549, diff: 3, n: 1460, skills: ["Identity & access", "Workload protection", "Compliance automation", "Cloud forensics"] },
    { id: "AEP", t: "Analytics Engineering Professional", cat: "data", lvl: "Expert", b: ["square", "#34D399", "#047857", "pipeline"], d: "Model trusted, tested data for analytics at company scale", study: 70, exam: "3 hr", price: 499, diff: 3, n: 1220, skills: ["dbt & transformation", "Semantic layers", "Testing & governance", "Performance tuning"] },
    { id: "SF", t: "Security Foundations", cat: "sec", lvl: "Beginner", b: ["circle", "#FCA5A5", "#DC2626", "lock"], d: "Core security principles, threats and controls for any IT role", study: 25, exam: "1 hr", price: 199, diff: 1, n: 7350, skills: ["CIA triad & risk", "Network security basics", "Identity & passwords", "Security awareness"] },
    { id: "PTP", t: "Penetration Testing Professional", cat: "sec", lvl: "Expert", b: ["oct", "#FB7185", "#9F1239", "bug"], d: "Plan and run ethical hacking engagements end to end", study: 90, exam: "4 hr", price: 599, diff: 3, n: 980, skills: ["Recon & enumeration", "Web & network exploitation", "Privilege escalation", "Reporting"] },
    { id: "AAA", t: "Applied AI Associate", cat: "ai", lvl: "Intermediate", b: ["diamond", "#C4B5FD", "#7C3AED", "spark"], d: "Build reliable AI features with modern models and APIs", study: 45, exam: "2 hr", price: 399, diff: 2, n: 2670, skills: ["Prompt & context design", "Retrieval & evaluation", "Responsible AI", "Shipping AI features"] }
  ];
  const DIFF = ["", "Beginner", "Intermediate", "Expert"];
  let filter = "all", showAll = false;
  const tabs = $("[data-tabs]"), grid = $("[data-grid]"), allBtn = $("[data-all]");
  const count = (k) => (k === "all" ? CERTS.length : CERTS.filter((c) => c.cat === k).length);
  tabs.innerHTML = [["all", "All"], ...Object.entries(CATS)].map(([k, v]) => `<button class="tab" type="button" role="tab" data-tab="${k}" aria-selected="${k === "all"}">${esc(v)} (${count(k)})</button>`).join("");
  const card = (c) => `<article class="card" data-cert="${c.id}">
    <div class="c-top"><span class="c-badge">${badge(...c.b)}</span><span class="lvl ${c.lvl}">${c.lvl} level</span></div>
    <h3>${esc(c.t)}</h3><p class="desc">${esc(c.d)}</p>
    <div class="c-meta"><span class="dur">${icon("i-clock")}${c.study} hrs study + ${c.exam} exam</span><span class="c-price">$${c.price}</span><span class="diff l${c.diff}" aria-label="Difficulty ${c.diff} of 3"><span>Difficulty</span><i></i><i></i><i></i></span></div>
    <div class="c-foot"><span class="certified">${icon("i-users")}${fmt(c.n)} certified</span><button class="link" type="button" data-details="${c.id}">View Details ${icon("i-arrow")}</button></div>
  </article>`;
  function render() {
    let list = filter === "all" ? CERTS : CERTS.filter((c) => c.cat === filter);
    if (filter === "all" && !showAll) list = list.slice(0, 6);
    grid.innerHTML = list.map(card).join("");
    allBtn.hidden = filter !== "all";
    allBtn.innerHTML = showAll ? `Show fewer certifications ${icon("i-arrow")}` : `View all 12 certifications ${icon("i-arrow")}`;
  }
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]"); if (!b) return;
    filter = b.dataset.tab;
    $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b));
    b.scrollIntoView({ block: "nearest", inline: "center" });
    render();
  });
  allBtn.addEventListener("click", () => { showAll = !showAll; render(); });
  render();

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input, select, button.btn", body); if (f) f.focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { body.innerHTML = ""; });
  const toastEl = $("[data-toast]"); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); };
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  function details(id) {
    const c = CERTS.find((x) => x.id === id);
    openDlg(`<div class="d-head"><span class="c-badge">${badge(...c.b)}</span><div><h3>${esc(c.t)}</h3><p class="lead" style="margin:0">${CATS[c.cat]} · ${c.lvl} level</p></div></div>
      <p>${esc(c.d)}.</p>
      <div class="d-grid"><div>Study<b>${c.study} hrs</b></div><div>Exam<b>${c.exam}</b></div><div>Price<b>$${c.price}</b></div><div>Certified<b>${fmt(c.n)}</b></div><div>Validity<b>3 years</b></div><div>Format<b>Proctored</b></div></div>
      <p style="margin:0 0 6px;font-weight:700;color:#0F172A">Skills validated</p>
      <ul class="d-list">${c.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="d-acts"><button class="btn btn-primary" type="button" data-buy-cert="${c.id}">Buy for $${c.price}</button><button class="btn btn-outline" type="button" data-buy="all">Or get all 12 with All-Access</button></div>`);
  }
  function checkout(kind, certId) {
    const c = certId && CERTS.find((x) => x.id === certId);
    const isAll = kind === "all";
    const opts = CERTS.map((x) => `<option value="${x.id}"${c && c.id === x.id ? " selected" : ""}>${esc(x.t)} — $${x.price}</option>`).join("");
    openDlg(`<h3>${isAll ? "Start All-Access Annual" : "Buy a certification"}</h3><p class="lead">${isAll ? "$999/year · all 12 certifications, unlimited retakes" : "Study path, practice labs, 1 exam attempt, badge and certificate"}</p>
      <form class="form" data-co novalidate>
        ${isAll ? "" : `<label>Certification<select name="cert">${opts}</select></label>`}
        <label>Full name<input name="name" autocomplete="name"></label>
        <label>Work or personal email<input name="email" type="email" autocomplete="email"></label>
        <p class="err" data-err role="alert"></p>
        <button class="btn btn-primary" type="submit">${isAll ? "Start All-Access — $999/yr" : "Continue to payment"}</button>
        <p class="lead" style="margin:0;font-size:13px">Demo checkout — no payment is taken. 30-day money-back guarantee.</p>
      </form>`);
    $("[data-co]", body).addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, name = f.name.value.trim(), email = f.email.value.trim();
      if (!name || !validEmail(email)) { $("[data-err]", body).textContent = "Please enter your name and a valid email."; return; }
      const what = isAll ? "All-Access Annual" : CERTS.find((x) => x.id === f.cert.value).t;
      body.innerHTML = `<h3>You're set, ${esc(name.split(" ")[0])}!</h3><p class="lead">${esc(what)} is reserved. In this demo nothing is charged or sent to ${esc(email)}.</p><button class="btn btn-primary" type="button" data-done>Done</button>`;
      $("[data-done]", body).addEventListener("click", () => dlg.close());
    });
  }
  function sales() {
    openDlg(`<h3>Talk to Sales</h3><p class="lead">Team licensing from 10 seats, SSO, custom paths and API access.</p>
      <form class="form" data-sales-form novalidate>
        <label>Work email<input name="email" type="email" autocomplete="email"></label>
        <label>Company<input name="co" autocomplete="organization"></label>
        <label>Team size<select name="size"><option>10-49</option><option>50-249</option><option>250-999</option><option>1,000+</option></select></label>
        <p class="err" data-err role="alert"></p>
        <button class="btn btn-primary" type="submit">Request a call</button>
      </form>`);
    $("[data-sales-form]", body).addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      if (!validEmail(f.email.value.trim()) || !f.co.value.trim()) { $("[data-err]", body).textContent = "Please enter a work email and company."; return; }
      body.innerHTML = `<h3>Thanks — request received</h3><p class="lead">A team-licensing specialist would contact ${esc(f.co.value.trim())} (${esc(f.size.value)} seats). Demo only: nothing is sent.</p><button class="btn btn-primary" type="button" data-done>Done</button>`;
      $("[data-done]", body).addEventListener("click", () => dlg.close());
    });
  }
  function compare() {
    const rows = [["Full study path", 1, 1, 1], ["Practice labs", 1, 1, 1], ["Exam attempts", "1", "Unlimited", "Unlimited"], ["Certifications included", "1", "All 12", "Custom"], ["Digital badge + PDF certificate", 1, 1, 1], ["Priority support", 0, 1, 1], ["Early access to new certs", 0, 1, 1], ["LinkedIn profile enhancement", 0, 1, 1], ["Team dashboard & reporting", 0, 0, 1], ["SSO & API access", 0, 0, 1], ["Dedicated success manager", 0, 0, 1]];
    const cell = (v) => (v === 1 ? '<td class="y">✓</td>' : v === 0 ? '<td class="n">—</td>' : `<td>${v}</td>`);
    openDlg(`<h3>Compare plans</h3><p class="lead">Every plan includes the 30-day money-back guarantee.</p><div class="tbl-wrap"><table class="cmp"><thead><tr><th>Feature</th><th>Single</th><th>All-Access</th><th>Enterprise</th></tr></thead><tbody>${rows.map(([f, ...v]) => `<tr><td>${f}</td>${v.map(cell).join("")}</tr>`).join("")}<tr><td>Price</td><td>$199–$599</td><td>$999/yr</td><td>Custom</td></tr></tbody></table></div>`);
  }
  // free 5-minute assessment
  const QUIZ = [
    { q: "Which work sounds most exciting?", a: [["Designing systems that scale", "cloud"], ["Finding answers in data", "data"], ["Stopping attackers", "sec"], ["Building with machine learning", "ai"]] },
    { q: "How much tech experience do you have?", a: [["Just getting started", 1], ["1-3 years", 2], ["4+ years", 3]] },
    { q: "How many hours a week can you study?", a: [["2-4 hours", 1], ["5-8 hours", 2], ["9+ hours", 3]] }
  ];
  function quiz() {
    const ans = [];
    const step = (i) => {
      if (i === QUIZ.length) {
        const level = Math.min(ans[1], ans[2]);
        const pool = CERTS.filter((c) => c.cat === ans[0]);
        const pick = pool.slice().sort((a, b) => Math.abs(a.diff - level) - Math.abs(b.diff - level) || a.diff - b.diff)[0];
        openDlg(`<h3>Your recommended path</h3><p class="lead">Based on your interests, experience and study time.</p>
          <div class="rec"><span class="c-badge">${badge(...pick.b)}</span><div><b>${esc(pick.t)}</b><br><small>${pick.lvl} · ${pick.study} hrs study · $${pick.price}</small></div></div>
          <div class="d-acts"><button class="btn btn-primary" type="button" data-details="${pick.id}">View details</button><button class="btn btn-outline" type="button" data-retake>Retake</button></div>`);
        $("[data-retake]", body).addEventListener("click", quiz);
        return;
      }
      const s = QUIZ[i];
      openDlg(`<div class="q-prog"><i style="width:${(i / QUIZ.length) * 100}%"></i></div><p class="lead" style="margin-bottom:6px">Question ${i + 1} of ${QUIZ.length}</p>
        <fieldset class="q"><legend>${s.q}</legend>${s.a.map(([t, v], k) => `<label><input type="radio" name="q" value="${k}"> ${t}</label>`).join("")}</fieldset>
        <p class="err" data-err role="alert"></p><button class="btn btn-primary" type="button" data-next>${i === QUIZ.length - 1 ? "See my result" : "Next"}</button>`);
      $("[data-next]", body).addEventListener("click", () => {
        const r = $("input:checked", body);
        if (!r) { $("[data-err]", body).textContent = "Choose an answer to continue."; return; }
        ans[i] = s.a[Number(r.value)][1]; step(i + 1);
      });
    };
    step(0);
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-details], [data-buy], [data-buy-cert], [data-sales], [data-compare], [data-quiz]");
    if (!t) return;
    if (t.dataset.details) details(t.dataset.details);
    else if (t.dataset.buyCert) checkout("single", t.dataset.buyCert);
    else if (t.dataset.buy) checkout(t.dataset.buy);
    else if (t.hasAttribute("data-sales")) sales();
    else if (t.hasAttribute("data-compare")) compare();
    else if (t.hasAttribute("data-quiz")) quiz();
  });

  /* ---------- verification portal (sample registry) ---------- */
  const REGISTRY = [
    { id: "CP-CAP-7F3K-2291", email: "jordan.avery@mail.example", name: "Jordan Avery", cert: "CAP", issued: "March 4, 2026", exp: "March 4, 2029" },
    { id: "CP-DEA-2M9Q-4410", email: "amara.osei@mail.example", name: "Amara Osei", cert: "DEA", issued: "September 18, 2025", exp: "September 18, 2028" },
    { id: "CP-CSA-8T1V-0937", email: "ryan.murphy@mail.example", name: "Ryan Murphy", cert: "CSA", issued: "January 22, 2026", exp: "January 22, 2029" }
  ];
  const vForm = $("[data-verify]"), vOut = $("[data-v-out]"), vIn = $("#v-in");
  vForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = vIn.value.trim();
    vOut.className = "v-out";
    if (!q) { vOut.classList.add("no"); vOut.textContent = "Enter a credential ID (e.g. CP-CAP-7F3K-2291) or a candidate email."; return; }
    vOut.classList.add("loading"); vOut.textContent = "Checking the CredPath registry…";
    setTimeout(() => {
      const r = REGISTRY.find((x) => x.id.toLowerCase() === q.toLowerCase() || x.email.toLowerCase() === q.toLowerCase());
      vOut.className = "v-out";
      if (!r) { vOut.classList.add("no"); vOut.textContent = `No active credential found for “${q}”. Check the ID format (CP-XXX-XXXX-XXXX) or ask the candidate for their badge link.`; return; }
      const c = CERTS.find((x) => x.id === r.cert);
      vOut.classList.add("ok");
      vOut.innerHTML = `<p class="v-h">${icon("i-check-c")}Valid credential</p><dl><dt>Holder</dt><dd>${esc(r.name)}</dd><dt>Credential</dt><dd>${esc(c.t)}</dd><dt>Credential ID</dt><dd>${r.id}</dd><dt>Issued</dt><dd>${r.issued}</dd><dt>Expires</dt><dd>${r.exp}</dd></dl>`;
    }, 600);
  });
  $$("[data-sample]").forEach((b) => b.addEventListener("click", () => { vIn.value = b.dataset.sample; vForm.requestSubmit(); }));
  $("[data-goto-verify]").addEventListener("click", () => setTimeout(() => vIn.focus({ preventScroll: true }), 500));

  /* ---------- marquee: duplicate for a seamless loop ---------- */
  const mq = $("[data-marquee] ul");
  mq.insertAdjacentHTML("beforeend", mq.innerHTML.replace(/<li>/g, '<li aria-hidden="true">'));

  /* ---------- testimonials ---------- */
  const face = (skin, hair, top, bg, style) => {
    const hairs = {
      short: `<path d="M18 26c0-10 6-15 14-15s15 5 14 15c-3-5-7-7-12-7-6 1-11 2-16 7z" fill="${hair}"/>`,
      long: `<path d="M15 30c0-13 7-19 17-19s17 6 17 19v14h-5V27c-4-3-8-5-12-5s-9 2-12 5v17h-5z" fill="${hair}"/>`,
      buzz: `<path d="M19 25c1-8 6-12 13-12s12 4 13 12c-4-3-8-4-13-4s-9 1-13 4z" fill="${hair}"/>`
    };
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/><path d="M10 64c2-12 11-18 22-18s20 6 22 18z" fill="${top}"/><rect x="27" y="38" width="10" height="10" rx="4" fill="${skin}" filter="brightness(.9)"/><ellipse cx="32" cy="29" rx="13" ry="15" fill="${skin}"/>${hairs[style]}<circle cx="27" cy="30" r="1.5" fill="#1F1A17"/><circle cx="37" cy="30" r="1.5" fill="#1F1A17"/><path d="M28 37q4 3 8 0" stroke="#7A3B30" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  };
  const TMS = [
    { q: "I studied 45 minutes a day for 8 weeks and passed on my first attempt. The structured path made it feel achievable, not overwhelming.", n: "David Chen", c: "Cloud Architecture Professional", r: "AWS Solutions Architect at Stripe", f: face("#E8C4A0", "#1C1917", "#1E3A8A", "#DBEAFE", "short") },
    { q: "The practice labs were the game-changer. I wasn't just memorizing — I was actually building things. That confidence carried into the exam and my job.", n: "Amara Osei", c: "Data Engineering Associate", r: "Data Engineer at Spotify", f: face("#8D5524", "#0C0A09", "#15803D", "#DCFCE7", "long") },
    { q: "My CredPath badge on LinkedIn got me 3 recruiter messages within a week. Employers actually recognize and trust this credential.", n: "Ryan Murphy", c: "Cybersecurity Analyst", r: "Security Analyst at JPMorgan", f: face("#F2CDA8", "#B45309", "#334155", "#FEE2E2", "buzz") }
  ];
  $("[data-tms]").innerHTML = TMS.map((t) => `<figure class="tm"><div class="stars" aria-label="5 out of 5 stars">${icon("i-star").repeat(5)}</div><blockquote>“${esc(t.q)}”</blockquote>
    <figcaption><span class="face">${t.f}</span><span class="who"><b>${esc(t.n)}</b><span>${esc(t.c)}</span>${esc(t.r)}</span><a class="li" href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="${esc(t.n)} on LinkedIn">${icon("i-in")}</a></figcaption></figure>`).join("");

  /* ---------- stat count-up ---------- */
  const stats = $$("[data-count]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const showStat = (el, v) => {
    const dec = Number(el.dataset.dec || 0);
    el.textContent = `${el.dataset.prefix || ""}${dec ? v.toFixed(dec) : fmt(Math.round(v))}${el.dataset.suffix || ""}`;
  };
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target, end = Number(el.dataset.count), t0 = performance.now();
      const run = (t) => { const k = Math.min(1, (t - t0) / 1200); showStat(el, end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(run); };
      requestAnimationFrame(run);
    }), { threshold: .5 });
    stats.forEach((s) => io.observe(s));
  }

  /* ---------- FAQ: one open at a time ---------- */
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- final signup ---------- */
  $("[data-signup]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = e.target.email.value.trim(), msg = $("[data-su-msg]");
    if (!validEmail(v)) { msg.className = "su-msg bad"; msg.textContent = "Please enter a valid email address."; return; }
    msg.className = "su-msg ok"; msg.textContent = `Free account created for ${v} — your career assessment is ready (demo: nothing is sent).`;
    e.target.reset();
  });

  /* ---------- mobile bottom bar ---------- */
  const mbar = $("[data-mbar]"), hero = $(".hero"), final = $(".final");
  const onScroll = () => {
    const f = final.getBoundingClientRect();
    mbar.classList.toggle("show", hero.getBoundingClientRect().bottom < 60 && !(f.top < innerHeight && f.bottom > 0));
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
