(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = window.Art;

  /* ---------- art ---------- */
  const hc = A.heroCollage();
  $$(".collage [data-art]").forEach((el) => (el.innerHTML = hc[el.dataset.art]));
  $('[data-art="classroom"]').innerHTML = A.classroom();
  $('[data-art="matching"]').innerHTML = A.matching();
  $('[data-art="progress"]').innerHTML = A.progress();
  $('[data-art="teaching"]').innerHTML = A.teaching();

  /* ---------- data ---------- */
  const SUBJECTS = [
    { n: "Mathematics", ic: "s-math", c: "#7C3AED", topics: ["Algebra", "Calculus", "Statistics", "Geometry"], tutors: 2400, from: 25, tag: "math" },
    { n: "Programming", ic: "s-code", c: "#2563EB", topics: ["Python", "JavaScript", "Java", "C++"], tutors: 1800, from: 30, tag: "code" },
    { n: "Languages", ic: "s-lang", c: "#16A34A", topics: ["Spanish", "French", "Mandarin", "Japanese"], tutors: 3200, from: 20, tag: "lang" },
    { n: "Test Prep", ic: "s-test", c: "#F59E0B", topics: ["SAT", "ACT", "GRE", "GMAT", "IELTS"], tutors: 1500, from: 35, tag: "test" },
    { n: "Sciences", ic: "s-sci", c: "#0891B2", topics: ["Physics", "Chemistry", "Biology"], tutors: 1600, from: 28, tag: "sci" },
    { n: "Writing", ic: "s-write", c: "#DB2777", topics: ["Essay Writing", "Creative Writing", "Grammar"], tutors: 900, from: 22, tag: "write" },
    { n: "Music", ic: "s-music", c: "#9333EA", topics: ["Piano", "Guitar", "Voice", "Music Theory"], tutors: 1100, from: 30, tag: "music" },
    { n: "Business", ic: "s-biz", c: "#475569", topics: ["Accounting", "Economics", "Finance", "Marketing"], tutors: 700, from: 32, tag: "biz" }
  ];
  const T = [
    { id: "chen", n: "Dr. Sarah Chen", sub: "Math & Statistics", cred: "PhD, Stanford University", r: 4.98, rv: 412, rate: 45, badge: "PhD in Mathematics", stat: "1,200+ lessons taught", tags: ["math", "Math", "Statistics", "Calculus", "Algebra", "Geometry"], on: true, when: ["eve", "wkd"], feat: true, intro: "Hi, I'm Sarah. I help students see why math works, not just how — from algebra to calculus and statistics." },
    { id: "carlos", n: "Carlos Mendez", sub: "Spanish & Portuguese", cred: "Native Speaker from Madrid", r: 4.96, rv: 678, rate: 28, badge: "Native Speaker", stat: "2,100+ lessons", tags: ["lang", "Spanish", "Portuguese"], on: true, native: true, when: ["eve", "wkd"], feat: true, intro: "¡Hola! I'm Carlos from Madrid. My lessons are conversation-first, so you speak from day one." },
    { id: "emily", n: "Emily Park", sub: "SAT/ACT Prep", cred: "Princeton grad, 1580 SAT", r: 4.97, rv: 356, rate: 55, badge: "Top SAT Score", stat: "Average 200pt improvement", tags: ["test", "SAT Prep", "SAT", "ACT"], on: false, when: ["eve"], feat: true, intro: "I'm Emily. I teach the strategies behind my 1580 — pacing, question patterns and smart guessing." },
    { id: "raj", n: "Raj Patel", sub: "Python & Web Dev", cred: "Senior Engineer at Google", r: 4.95, rv: 534, rate: 40, badge: "Industry Expert", stat: "1,800+ lessons", tags: ["code", "Python", "JavaScript", "Web Development"], on: true, when: ["wkd"], feat: true, intro: "Hey, I'm Raj. We'll build real projects in Python and JavaScript while you learn the fundamentals." },
    { id: "x1", n: "Amelia Grant", sub: "Piano & Music Theory", cred: "Royal College of Music graduate", r: 4.93, rv: 221, rate: 35, tags: ["music", "Piano", "Music Theory"], on: true, when: ["eve", "wkd"], p: { skin: 0, hair: 4, hairStyle: "bun", top: 6, bg: 5 } },
    { id: "x2", n: "Kenji Watanabe", sub: "Japanese", cred: "Native speaker from Osaka", r: 4.94, rv: 305, rate: 30, tags: ["lang", "Japanese"], on: false, native: true, when: ["eve"], p: { skin: 1, hair: 0, hairStyle: "short", top: 4, bg: 3, glasses: true } },
    { id: "x3", n: "Lucie Bernard", sub: "French", cred: "Native speaker, DELF examiner", r: 4.92, rv: 188, rate: 32, tags: ["lang", "French"], on: true, native: true, when: ["wkd"], p: { skin: 7, hair: 2, hairStyle: "bob", top: 2, bg: 1 } },
    { id: "x4", n: "Dr. Omar Haddad", sub: "Physics & Chemistry", cred: "PhD in Physics", r: 4.91, rv: 264, rate: 38, tags: ["sci", "Physics", "Chemistry"], on: true, when: ["eve"], p: { skin: 3, hair: 0, hairStyle: "side", top: 7, bg: 2, beard: true } },
    { id: "x5", n: "Hannah Brooks", sub: "Essay & Creative Writing", cred: "MFA, published novelist", r: 4.95, rv: 142, rate: 26, tags: ["write", "Essay Writing", "Creative Writing", "Grammar"], on: false, when: ["wkd"], p: { skin: 0, hair: 7, hairStyle: "long", top: 8, bg: 0 } },
    { id: "x6", n: "Daniel Okoye", sub: "Statistics & Economics", cred: "MSc Econometrics", r: 4.9, rv: 176, rate: 36, tags: ["math", "biz", "Statistics", "Economics"], on: true, when: ["eve"], p: { skin: 6, hair: 0, hairStyle: "buzz", top: 3, bg: 4 } },
    { id: "x7", n: "Sofia Rossi", sub: "Guitar & Voice", cred: "Session musician, Berklee alumna", r: 4.96, rv: 233, rate: 30, tags: ["music", "Guitar", "Voice"], on: true, when: ["eve", "wkd"], p: { skin: 2, hair: 1, hairStyle: "curly", top: 0, bg: 7 } },
    { id: "x8", n: "Mei Lin", sub: "Mandarin Chinese", cred: "Native speaker, HSK teacher", r: 4.97, rv: 410, rate: 27, tags: ["lang", "Mandarin"], on: true, native: true, when: ["eve"], p: { skin: 1, hair: 0, hairStyle: "bob", top: 1, bg: 3 } },
    { id: "x9", n: "Jake Morrison", sub: "Java & C++", cred: "Backend engineer, 9 years", r: 4.88, rv: 129, rate: 48, tags: ["code", "Java", "C++"], on: false, when: ["wkd"], p: { skin: 0, hair: 3, hairStyle: "short", top: 4, bg: 6, beard: true } },
    { id: "x10", n: "Priya Nair", sub: "Biology", cred: "Medical student, MCAT 520", r: 4.94, rv: 158, rate: 29, tags: ["sci", "Biology"], on: true, when: ["eve"], p: { skin: 4, hair: 0, hairStyle: "long", top: 3, bg: 4 } },
    { id: "x11", n: "Tom Becker", sub: "Accounting & Finance", cred: "CPA, former auditor", r: 4.89, rv: 97, rate: 42, tags: ["biz", "Accounting", "Finance", "Marketing"], on: false, when: ["eve"], p: { skin: 7, hair: 5, hairStyle: "side", top: 7, bg: 6, glasses: true } },
    { id: "x12", n: "Ana Silva", sub: "Spanish & Portuguese", cred: "Native speaker from Lisbon", r: 4.93, rv: 201, rate: 22, tags: ["lang", "Spanish", "Portuguese"], on: true, native: true, when: ["wkd"], p: { skin: 2, hair: 2, hairStyle: "wrap", top: 9, bg: 1 } },
    { id: "x13", n: "Marcus Hill", sub: "GRE & GMAT", cred: "GMAT 770, MBA", r: 4.92, rv: 143, rate: 62, tags: ["test", "GRE", "GMAT"], on: true, when: ["eve", "wkd"], p: { skin: 5, hair: 0, hairStyle: "buzz", top: 4, bg: 2 } },
    { id: "x14", n: "Grace Lee", sub: "IELTS & English", cred: "CELTA, former IELTS examiner", r: 4.95, rv: 260, rate: 34, tags: ["test", "lang", "IELTS", "English"], on: false, when: ["wkd"], p: { skin: 1, hair: 1, hairStyle: "long", top: 1, bg: 5 } }
  ];
  const TERMS = [...new Set(SUBJECTS.flatMap((s) => s.topics).concat(["Math", "SAT Prep", "Portuguese", "English", "Web Development"]))].sort();
  const pic = (t, shape = "sq") => (t.p ? (shape === "sq" ? A.portraitOf(t.p, t.n) : A.avatarOf(t.p, t.n)) : (shape === "sq" ? A.portraitOf(t.id, t.n) : A.avatarOf(t.id, t.n)));

  /* ---------- subjects ---------- */
  $("[data-subjects]").innerHTML = SUBJECTS.map((s) => `<button class="subj" type="button" data-subj="${s.n}"><span class="sj-ico" style="--c:${s.c}">${icon(s.ic)}</span><h3>${s.n}</h3><p>${s.topics.join(", ")}</p><span class="sj-meta"><span>${s.tutors.toLocaleString("en-US")} tutors</span><b>From $${s.from}/hr</b></span></button>`).join("");

  /* ---------- tutors carousel ---------- */
  const tutorCard = (t) => `<article class="tutor">
    <div class="t-photo">${pic(t)}${t.on ? '<span class="online"><i></i>Online now</span>' : ""}<span class="t-badge">${esc(t.badge)}</span><button class="t-play" type="button" aria-label="Watch ${esc(t.n)}'s intro video" data-intro="${t.id}">${icon("i-play")}</button></div>
    <div class="t-body"><h3>${esc(t.n)}<svg class="i" role="img" aria-label="Verified"><use href="#i-verified"/></svg></h3><p class="t-sub">${esc(t.sub)}</p><p class="t-cred">${esc(t.cred)}</p>
      <div class="t-row"><span class="rating">${icon("i-star")}${t.r.toFixed(2)} <small>(${t.rv} reviews)</small></span><span class="rate">$${t.rate}<small>/hr</small></span></div>
      <p class="t-stat">${esc(t.stat)}</p>
      <button class="btn btn-primary" type="button" data-book="${t.id}">Book Free Trial</button></div></article>`;
  const track = $("[data-tutors]");
  track.innerHTML = T.filter((t) => t.feat).map(tutorCard).join("") + T.filter((t) => !t.feat && t.r >= 4.95).map((t) => tutorCard({ ...t, badge: t.native ? "Native Speaker" : "Top Rated", stat: `${(t.rv * 4).toLocaleString("en-US")}+ lessons` })).join("");
  const step = () => (track.firstElementChild.getBoundingClientRect().width + 24);
  $("[data-prev]").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  $("[data-next]").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));

  /* ---------- stories ---------- */
  const STORIES = [
    { k: "jason", q: "My SAT score went from 1320 to 1520 in just 8 weeks of tutoring. Emily's strategies were game-changing.", n: "Jason W.", ctx: "High School Junior", subj: "SAT Prep", res: "+200 points" },
    { k: "maria", q: "I went from failing Calculus to getting an A. Dr. Chen explains things in ways my professor never could.", n: "Maria G.", ctx: "College Sophomore", subj: "Calculus II", res: "F → A" },
    { k: "patricia", q: "My daughter is now conversationally fluent in Spanish after 6 months. Carlos made every lesson fun.", n: "Patricia L.", ctx: "Parent", subj: "Spanish", res: "Conversational fluency" }
  ];
  $("[data-stories]").innerHTML = STORIES.map((s) => `<figure class="story"><blockquote>“${esc(s.q)}”</blockquote><figcaption><span class="av">${A.avatarOf(s.k, s.n)}</span><span><b>${s.n}</b><small>${s.ctx}</small></span></figcaption><div class="result"><span>Subject: <strong>${s.subj}</strong></span><span>Result: <b>${s.res}</b></span></div></figure>`).join("");

  /* ---------- pricing ---------- */
  const RANGES = [["Languages", 20, 50], ["Math & Science", 25, 60], ["Test Prep", 35, 80], ["Music", 25, 55], ["Programming", 30, 70]];
  const MAX = 90;
  $("[data-ranges]").innerHTML = RANGES.map(([n, a, b]) => `<div class="range"><b>${n}</b><span class="rbar" aria-hidden="true"><i style="left:${(a / MAX) * 100}%;right:${100 - (b / MAX) * 100}%"></i></span><span>$${a}–$${b}/hr</span></div>`).join("");
  const calc = () => {
    const r = Number($("[data-calc-rate]").value), n = Number($("[data-calc-n]").value);
    const full = r * n, pay = Math.round(full * 0.85);
    $("[data-calc-out]").innerHTML = `${n} lessons at $${r}/hr: <s>$${full}</s> → <b>$${pay}</b> (save $${full - pay})`;
  };
  $("[data-calc-rate]").addEventListener("change", calc); $("[data-calc-n]").addEventListener("change", calc); calc();

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  let onClose = null;
  function openDlg(html, close) { body.innerHTML = html; onClose = close || null; if (!dlg.open) dlg.showModal(); const f = $("input:not([type=checkbox]):not([type=radio]), select, .slots button, .btn", body); if (f) f.focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { if (onClose) onClose(); onClose = null; body.innerHTML = ""; });
  const toastEl = $("[data-toast]"); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); };
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const done = (title, msg) => { body.innerHTML = `<span class="ok">${icon("i-check")}</span><h3>${title}</h3><p class="lead-s">${msg}</p><button class="btn btn-primary" type="button" data-done>Done</button>`; $("[data-done]", body).addEventListener("click", () => dlg.close()); $("[data-done]", body).focus(); };

  /* ---------- results ---------- */
  function results(title, list, note = "") {
    openDlg(`<h3>${esc(title)}</h3><p class="lead-s">${list.length} tutor${list.length === 1 ? "" : "s"} in this sample${note}. All offer a free 30-minute trial.</p>
      ${list.length ? `<ul class="res-list">${list.sort((a, b) => b.r - a.r).map((t) => `<li class="res"><span class="av">${pic(t, "c")}</span><div><b>${esc(t.n)}</b> <small>${esc(t.sub)} · ${esc(t.cred)}</small><small>★ ${t.r.toFixed(2)} (${t.rv}) · $${t.rate}/hr${t.on ? " · <span style=\"color:#16A34A;font-weight:600\">Online now</span>" : ""}</small></div><button class="btn btn-primary" type="button" data-book="${t.id}">Book Free Trial</button></li>`).join("")}</ul>` : `<div class="empty">No tutors match those filters in this sample. Try removing a filter or another subject.</div>`}`);
  }
  const matchTerm = (q) => {
    const s = q.trim().toLowerCase();
    const subj = SUBJECTS.find((x) => x.n.toLowerCase() === s);
    if (subj) return T.filter((t) => t.tags.includes(subj.tag));
    return T.filter((t) => t.tags.some((g) => g.toLowerCase().includes(s)) || t.sub.toLowerCase().includes(s));
  };

  /* ---------- search with autocomplete + filters ---------- */
  const form = $("[data-search]"), q = $("[data-q]"), sug = $("[data-suggest]");
  let opts = [], act = -1;
  const hideSug = () => { sug.hidden = true; q.setAttribute("aria-expanded", "false"); q.removeAttribute("aria-activedescendant"); act = -1; };
  function renderSug() {
    const s = q.value.trim().toLowerCase();
    opts = (s ? TERMS.filter((t) => t.toLowerCase().includes(s)) : ["Math", "Spanish", "Python", "SAT Prep", "Piano"]).slice(0, 7);
    if (!opts.length) return hideSug();
    sug.innerHTML = opts.map((t, i) => {
      const k = t.toLowerCase().indexOf(s);
      const label = s && k >= 0 ? `${esc(t.slice(0, k))}<mark>${esc(t.slice(k, k + s.length))}</mark>${esc(t.slice(k + s.length))}` : esc(t);
      return `<li role="option" id="sg-${i}" data-opt="${i}" aria-selected="${i === act}"><span>${label}</span><small>${matchTerm(t).length} tutors</small></li>`;
    }).join("");
    sug.hidden = false; q.setAttribute("aria-expanded", "true");
    if (act >= 0) q.setAttribute("aria-activedescendant", `sg-${act}`);
  }
  q.addEventListener("input", () => { act = -1; renderSug(); });
  q.addEventListener("focus", renderSug);
  q.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (sug.hidden) renderSug(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length; renderSug(); }
    else if (e.key === "Enter" && act >= 0 && !sug.hidden) { e.preventDefault(); q.value = opts[act]; hideSug(); form.requestSubmit(); }
    else if (e.key === "Escape") hideSug();
  });
  sug.addEventListener("mousedown", (e) => { const li = e.target.closest("[data-opt]"); if (!li) return; e.preventDefault(); q.value = opts[li.dataset.opt]; hideSug(); form.requestSubmit(); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".s-field")) hideSug(); });
  const ft = $("[data-ftoggle]"), fl = $("[data-filters]");
  ft.addEventListener("click", () => { const show = fl.hidden; fl.hidden = !show; ft.setAttribute("aria-expanded", show); ft.setAttribute("aria-label", show ? "Hide filters" : "Show filters"); });
  form.addEventListener("submit", (e) => {
    e.preventDefault(); hideSug();
    const term = q.value.trim();
    if (!term) { q.focus(); renderSug(); toast("Type a subject or pick a suggestion to find tutors."); return; }
    let list = matchTerm(term);
    const max = Number(form.max.value), when = form.when.value, native = form.native.checked;
    const notes = [];
    if (max < 999) { list = list.filter((t) => t.rate <= max); notes.push(`up to $${max}/hr`); }
    if (when === "now") { list = list.filter((t) => t.on); notes.push("online now"); } else if (when !== "any") { list = list.filter((t) => t.when.includes(when)); notes.push(when === "eve" ? "evenings" : "weekends"); }
    if (native) { list = list.filter((t) => t.native); notes.push("native speakers"); }
    results(`Tutors for “${term}”`, list, notes.length ? ` (${notes.join(", ")})` : "");
  });
  $$("[data-pill]").forEach((b) => b.addEventListener("click", () => { q.value = b.dataset.pill; form.requestSubmit(); }));

  /* ---------- booking ---------- */
  function book(id) {
    const t = T.find((x) => x.id === id);
    const base = new Date(); base.setHours(0, 0, 0, 0);
    const slots = [];
    for (let d = 1; slots.length < 8; d++) {
      const day = new Date(base.getTime() + d * 864e5);
      for (const h of [16, 19]) slots.push(new Date(day.getTime() + h * 36e5));
    }
    const fmt = (d) => `${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}<small>${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</small>`;
    let pick = -1;
    openDlg(`<h3>Free trial with ${esc(t.n)}</h3><p class="lead-s">30 minutes · ${esc(t.sub)} · then $${t.rate}/hr if you continue</p>
      <p style="margin:0 0 8px;font-weight:600;color:#111827">Choose a time <span style="font-weight:400;color:#6B7280">(your local time)</span></p>
      <div class="slots" role="group" aria-label="Available times">${slots.map((s, i) => `<button type="button" data-slot="${i}" aria-pressed="false">${fmt(s)}</button>`).join("")}</div>
      <form class="form" data-book-form novalidate><label>Your name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email"></label><label>What would you like to work on? (optional)<input name="goal" placeholder="e.g. prepare for my calculus midterm"></label><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="submit">Book free lesson</button><p class="lead-s" style="margin:0;font-size:13px">No credit card required. Demo booking — nothing is sent.</p></form>`);
    $$("[data-slot]", body).forEach((b) => b.addEventListener("click", () => { pick = Number(b.dataset.slot); $$("[data-slot]", body).forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    $("[data-book-form]", body).addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, errs = [];
      if (pick < 0) errs.push("a time");
      if (!f.name.value.trim()) errs.push("your name");
      if (!validEmail(f.email.value.trim())) errs.push("a valid email");
      if (errs.length) { $("[data-err]", body).textContent = `Please choose ${errs.join(", ")}.`; return; }
      const s = slots[pick];
      done("Your free lesson is booked!", `${esc(f.name.value.trim().split(" ")[0])}, you'll meet ${esc(t.n)} on ${s.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${s.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}. The classroom link would be emailed to ${esc(f.email.value.trim())}.`);
    });
  }

  /* ---------- intro video (captioned demo) ---------- */
  function intro(id) {
    const t = T.find((x) => x.id === id);
    const words = t.intro.split(" ");
    let i = 0, timer;
    openDlg(`<h3>${esc(t.n)} — intro</h3><p class="lead-s">${esc(t.sub)} · demo video with captions</p><div class="intro">${pic(t)}<p class="cap" data-cap aria-live="polite"></p></div><button class="btn btn-primary" type="button" data-book="${t.id}" style="width:100%">Book Free Trial</button>`, () => clearInterval(timer));
    const cap = $("[data-cap]", body);
    timer = setInterval(() => { i = Math.min(words.length, i + 2); cap.textContent = words.slice(Math.max(0, i - 12), i).join(" "); if (i >= words.length) clearInterval(timer); }, 260);
  }

  /* ---------- classroom demo: shared whiteboard ---------- */
  function classroomDemo() {
    openDlg(`<h3>Try the whiteboard</h3><p class="lead-s">Draw below — in a real lesson your tutor sees it live.</p><canvas data-board width="560" height="300" style="width:100%;height:auto;border:1px solid #E5E7EB;border-radius:12px;background:#FAFAFF;touch-action:none" aria-label="Whiteboard drawing area"></canvas><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">${["#7C3AED", "#111827", "#F59E0B", "#16A34A"].map((c, i) => `<button class="icon-btn" type="button" data-pen="${c}" aria-label="Pen color ${["purple", "black", "amber", "green"][i]}" aria-pressed="${i === 0}" style="background:${c};border:3px solid ${i === 0 ? "#fff" : "transparent"};box-shadow:0 0 0 2px ${c}"></button>`).join("")}<button class="btn btn-outline" type="button" data-clear>Clear</button></div>`);
    const cv = $("[data-board]", body), ctx = cv.getContext("2d");
    let pen = "#7C3AED", drawing = false;
    ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.font = "22px Georgia"; ctx.fillStyle = "#5B21B6"; ctx.fillText("a² + b² = c²", 24, 40);
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.width / r.width), (e.clientY - r.top) * (cv.height / r.height)]; };
    cv.addEventListener("pointerdown", (e) => { drawing = true; cv.setPointerCapture(e.pointerId); ctx.strokeStyle = pen; ctx.beginPath(); ctx.moveTo(...pos(e)); });
    cv.addEventListener("pointermove", (e) => { if (!drawing) return; ctx.lineTo(...pos(e)); ctx.stroke(); cv.dataset.drawn = "1"; });
    cv.addEventListener("pointerup", () => (drawing = false));
    $$("[data-pen]", body).forEach((b) => b.addEventListener("click", () => { pen = b.dataset.pen; $$("[data-pen]", body).forEach((x) => { x.setAttribute("aria-pressed", x === b); x.style.borderColor = x === b ? "#fff" : "transparent"; }); }));
    $("[data-clear]", body).addEventListener("click", () => { ctx.clearRect(0, 0, cv.width, cv.height); delete cv.dataset.drawn; });
  }

  /* ---------- smart match quiz ---------- */
  const QUIZ = [
    { q: "What do you want to learn?", a: [["Math or statistics", "math"], ["A new language", "lang"], ["Test prep (SAT, GRE…)", "test"], ["Programming", "code"]] },
    { q: "How do you learn best?", a: [["Step-by-step explanations", "steps"], ["Conversation and practice", "talk"], ["Projects and examples", "build"]] },
    { q: "When can you take lessons?", a: [["Evenings", "eve"], ["Weekends", "wkd"]] }
  ];
  function matchQuiz() {
    const ans = [];
    const show = (i) => {
      if (i === QUIZ.length) {
        const pool = T.filter((t) => t.tags.includes(ans[0]));
        const scored = pool.map((t) => ({ t, s: Math.round(70 + (t.when.includes(ans[2]) ? 18 : 0) + (t.r - 4.85) * 60 + (t.feat ? 3 : 0)) })).sort((a, b) => b.s - a.s).slice(0, 3);
        openDlg(`<h3>Your top matches</h3><p class="lead-s">Based on your goal, learning style and schedule.</p><ul class="res-list">${scored.map(({ t, s }) => `<li class="res"><span class="av">${pic(t, "c")}</span><div><b>${esc(t.n)}</b><small>${esc(t.sub)} · $${t.rate}/hr</small><small style="color:#16A34A;font-weight:700">${Math.min(99, s)}% match</small></div><button class="btn btn-primary" type="button" data-book="${t.id}">Book Free Trial</button></li>`).join("")}</ul>`);
        return;
      }
      const s = QUIZ[i];
      openDlg(`<p class="lead-s" style="margin-bottom:4px">Step ${i + 1} of ${QUIZ.length}</p><fieldset class="q-opts"><legend>${s.q}</legend>${s.a.map(([t], k) => `<label><input type="radio" name="q" value="${k}"> ${t}</label>`).join("")}</fieldset><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="button" data-qnext>${i === QUIZ.length - 1 ? "See my matches" : "Next"}</button>`);
      $("[data-qnext]", body).addEventListener("click", () => {
        const r = $("input:checked", body);
        if (!r) { $("[data-err]", body).textContent = "Pick an option to continue."; return; }
        ans[i] = s.a[Number(r.value)][1]; show(i + 1);
      });
    };
    show(0);
  }

  /* ---------- simple forms ---------- */
  function signup(prefill = "") {
    openDlg(`<h3>Get started free</h3><p class="lead-s">Create your account and book your free 30-minute trial lesson.</p><form class="form" data-su-form novalidate><label>Email<input name="email" type="email" value="${esc(prefill)}" autocomplete="email"></label><label>I'm a…<select name="who"><option>Student</option><option>Parent</option><option>Adult learner</option></select></label><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="submit">Create free account</button></form>`);
    $("[data-su-form]", body).addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.email.value.trim(); if (!validEmail(v)) { $("[data-err]", body).textContent = "Please enter a valid email."; return; } done("Welcome to BrightMinds!", `Account created for ${esc(v)} (${esc(e.target.who.value.toLowerCase())}). Demo only — nothing is sent.`); });
  }
  function login() {
    openDlg(`<h3>Log in</h3><form class="form" data-li novalidate><label>Email<input name="email" type="email" autocomplete="email"></label><label>Password<input name="pw" type="password" autocomplete="current-password"></label><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="submit">Log In</button></form>`);
    $("[data-li]", body).addEventListener("submit", (e) => { e.preventDefault(); if (!validEmail(e.target.email.value.trim()) || !e.target.pw.value) { $("[data-err]", body).textContent = "Enter your email and password."; return; } dlg.close(); toast("Demo: accounts aren't connected in this preview."); });
  }
  function apply() {
    openDlg(`<h3>Apply to teach</h3><p class="lead-s">Every tutor passes a background check, knowledge test and teaching demo.</p><form class="form" data-ap novalidate><label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email"></label><label>Subject you teach<select name="subj">${SUBJECTS.map((s) => `<option>${s.n}</option>`).join("")}</select></label><label>Hourly rate ($25–$80)<input name="rate" type="number" min="25" max="80" value="35"></label><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="submit">Submit application</button></form>`);
    $("[data-ap]", body).addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target, r = Number(f.rate.value);
      if (!f.name.value.trim() || !validEmail(f.email.value.trim())) { $("[data-err]", body).textContent = "Please enter your name and a valid email."; return; }
      if (!(r >= 25 && r <= 80)) { $("[data-err]", body).textContent = "Rates on BrightMinds range from $25 to $80 per hour."; return; }
      done("Application received", `Thanks, ${esc(f.name.value.trim().split(" ")[0])}! At $${r}/hr and ~15 lessons a week you could earn about $${(r * 15 * 4).toLocaleString("en-US")}/month. Demo only — nothing is sent.`);
    });
  }

  /* ---------- global click routing ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-book], [data-intro], [data-subj], [data-subj-link], [data-browse], [data-all-subjects], [data-start], [data-login], [data-apply], [data-demo], [data-match], [data-soon]");
    if (!el) return;
    if (el.tagName === "A") e.preventDefault();
    closeMenu();
    if (el.dataset.book) book(el.dataset.book);
    else if (el.dataset.intro) intro(el.dataset.intro);
    else if (el.dataset.subj || el.dataset.subjLink) { const n = el.dataset.subj || el.dataset.subjLink; results(`${n} tutors`, matchTerm(n)); }
    else if (el.hasAttribute("data-browse")) results("All tutors", T.slice());
    else if (el.hasAttribute("data-all-subjects")) openDlg(`<h3>Explore 150+ subjects</h3><p class="lead-s">A sample of popular subjects — pick one to see tutors.</p><ul class="subj-all">${TERMS.map((t) => `<li><button class="link" type="button" data-term="${esc(t)}">${esc(t)}</button></li>`).join("")}</ul>`);
    else if (el.hasAttribute("data-start")) signup();
    else if (el.hasAttribute("data-login")) login();
    else if (el.hasAttribute("data-apply")) apply();
    else if (el.hasAttribute("data-demo")) classroomDemo();
    else if (el.hasAttribute("data-match")) matchQuiz();
    else if (el.dataset.soon) toast(`${el.dataset.soon} — coming soon in this demo.`);
  });
  body.addEventListener("click", (e) => { const b = e.target.closest("[data-term]"); if (b) results(`Tutors for “${b.dataset.term}”`, matchTerm(b.dataset.term)); });

  /* ---------- FAQ ---------- */
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- final signup ---------- */
  $("[data-signup]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = e.target.email.value.trim(), m = $("[data-su-msg]");
    if (!validEmail(v)) { m.className = "su-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    m.className = "su-msg"; m.textContent = ""; signup(v);
  });

  /* ---------- mobile menu + sticky bar ---------- */
  const burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  burger.addEventListener("click", () => { const show = mnav.hidden; mnav.hidden = !show; burger.setAttribute("aria-expanded", show); burger.setAttribute("aria-label", show ? "Close menu" : "Open menu"); });
  $$("a", mnav).forEach((a) => a.addEventListener("click", closeMenu));
  const mbar = $("[data-mbar]"), hero = $(".hero"), final = $(".final");
  const onScroll = () => { const f = final.getBoundingClientRect(); mbar.classList.toggle("show", hero.getBoundingClientRect().bottom < 0 && !(f.top < innerHeight && f.bottom > 0)); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
