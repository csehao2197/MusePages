(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const A = window.Art;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  $("[data-campus]").innerHTML = A.campus();
  $("[data-mentor-art]").innerHTML = A.mentorCall();
  $("[data-kai]").innerHTML = A.avatar(A.P.kai, "Kai Torres");

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  let after = null;
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input:not([type=checkbox]), select, textarea, .amts button, .btn", body); if (f) f.focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); };
  const done = (title, msg) => { body.innerHTML = `<span class="ok">${icon("i-check")}</span><h3>${title}</h3><p class="dl-lead">${msg}</p><button class="btn btn-blue" type="button" data-done>Done</button>`; $("[data-done]", body).addEventListener("click", () => dlg.close()); $("[data-done]", body).focus(); };

  /* ---------- auth (demo, in-memory) ---------- */
  let user = null;
  function login(reason = "", then = null) {
    after = then;
    openDlg(`<h3>Log in to the alumni network</h3><p class="dl-lead">${reason || "Access the directory, RSVPs, chapters and benefits."}</p><form class="form" data-li novalidate><label>Email<input name="email" type="email" autocomplete="email"></label><label>Password<input name="pw" type="password" autocomplete="current-password"></label><p class="err" data-err role="alert"></p><button class="btn btn-blue" type="submit">Log In</button><p class="dl-lead" style="margin:0;font-size:13px">Demo: any email and password work; nothing is sent.</p></form>`);
    $("[data-li]", body).addEventListener("submit", (e) => {
      e.preventDefault();
      const em = e.target.email.value.trim();
      if (!validEmail(em) || !e.target.pw.value) { $("[data-err]", body).textContent = "Enter your email and password."; return; }
      user = { email: em };
      $$("[data-login]").forEach((b) => { b.textContent = "My Account"; });
      $("[data-login-note]").textContent = `Logged in as ${em} — full profiles unlocked (demo).`;
      dlg.close();
      toast("Welcome back! You're logged in (demo).");
      const fn = after; after = null; if (fn) fn();
    });
  }
  const requireLogin = (reason, fn) => (user ? fn() : login(reason, fn));

  /* ---------- spotlight ---------- */
  const STORIES = [
    { k: "nadia", n: "Dr. Nadia Chen", y: 2008, t: "Chief Medical Officer at Meridian Health", q: "Crestfield gave me the foundation to think critically and lead with empathy.", s: ["Nadia arrived at Crestfield planning to study chemistry and left with a double major in biology and philosophy — a combination she credits for the way she approaches clinical ethics today.", "After medical school and residency in Boston, she joined Meridian Health as a hospitalist and rose to Chief Medical Officer in 2024, where she leads a system-wide program on patient-centered care.", "She returns to campus each spring to speak with pre-med students and sits on the advisory board of the Crestfield Health Sciences Institute."] },
    { k: "marcus", n: "Marcus Rivera", y: 2015, t: "Founder & CEO of GreenLoop Technologies", q: "The connections I made in the entrepreneurship program still drive my business today.", s: ["Marcus pitched the first version of GreenLoop — software that helps cities route recyclables more efficiently — at Crestfield's student venture competition in his senior year.", "Two classmates from that program became his co-founders, and an alumni angel investor wrote GreenLoop's first check. The company now operates in 40 municipalities.", "He mentors student founders through the Crestfield Launchpad and hires interns from the university every summer."] },
    { k: "priya", n: "Priya Anand", y: 2019, t: "Senior Data Scientist at NASA JPL", q: "My professors didn't just teach — they mentored. That changed everything.", s: ["Priya joined a faculty research lab analyzing satellite imagery during her sophomore year, an experience that turned a vague interest in space into a career plan.", "Her undergraduate thesis on terrain classification led to a graduate fellowship and, later, a role on the team that processes data from planetary missions.", "She now co-leads the Crestfield Women in STEM alumni circle."] }
  ];
  const spot = $("[data-spot]");
  spot.innerHTML = STORIES.map((s, i) => `<article class="sp-card"><div class="sp-photo">${A.avatar(A.P[s.k], `Portrait of ${s.n}`)}</div><h3>${s.n}</h3><span class="sp-year">Class of ${s.y}</span><p class="sp-title">${s.t}</p><blockquote>“${s.q}”</blockquote><button class="link" type="button" data-story="${i}">Read Story ${icon("i-arrow")}</button></article>`).join("");
  const storyDlg = (i) => { const s = STORIES[i]; openDlg(`<div class="story"><div class="story-h"><span class="av">${A.avatar(A.P[s.k], s.n)}</span><div><h3>${s.n}, Class of ${s.y}</h3><p class="dl-lead" style="margin:0">${s.t}</p></div></div><blockquote style="font-family:Merriweather,serif;font-style:italic;margin:0 0 14px;color:#1A1F36">“${s.q}”</blockquote>${s.s.map((p) => `<p>${p}</p>`).join("")}</div>`); };
  spot.addEventListener("click", (e) => { const b = e.target.closest("[data-story]"); if (b) storyDlg(Number(b.dataset.story)); });
  const sdots = $("[data-spot-dots]");
  sdots.innerHTML = STORIES.map((s, i) => `<button type="button" aria-label="Show ${s.n}" data-dot="${i}" aria-current="${i === 0}"></button>`).join("");
  const cards = $$(".sp-card", spot);
  sdots.addEventListener("click", (e) => { const b = e.target.closest("[data-dot]"); if (!b) return; const c = cards[b.dataset.dot]; spot.scrollTo({ left: c.offsetLeft - spot.offsetLeft - (spot.clientWidth - c.clientWidth) / 2, behavior: "smooth" }); });
  spot.addEventListener("scroll", () => { const mid = spot.scrollLeft + spot.clientWidth / 2; let best = 0; cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - spot.offsetLeft + c.clientWidth / 2 - mid) < Math.abs(cards[best].offsetLeft - spot.offsetLeft + cards[best].clientWidth / 2 - mid)) best = i; }); $$("[data-dot]", sdots).forEach((d, i) => d.setAttribute("aria-current", i === best)); }, { passive: true });
  $("[data-all-stories]").addEventListener("click", () => openDlg(`<h3>Alumni stories</h3><p class="dl-lead">More stories are published monthly by the alumni office.</p>${STORIES.map((s, i) => `<p><button class="link" type="button" data-story-dlg="${i}">${s.n}, '${String(s.y).slice(2)} — ${s.t}</button></p>`).join("")}`));
  body.addEventListener("click", (e) => { const b = e.target.closest("[data-story-dlg]"); if (b) storyDlg(Number(b.dataset.storyDlg)); });

  /* ---------- events ---------- */
  const TYPES = { Reunion: ["#F3E8FF", "#7E22CE"], Networking: ["#DBEAFE", "#1E40AF"], Virtual: ["#CCFBF1", "#0F766E"], Homecoming: ["#FEF3C7", "#B45309"] };
  const EVENTS = [
    { t: "Class of 2016 — 10-Year Reunion", type: "Reunion", m: "May", d: "16", wd: "Sat", date: "Saturday, May 16, 2026", where: "On Campus, Grand Hall", act: "Register", start: [2026, 4, 16, 18], end: [2026, 4, 16, 23] },
    { t: "Alumni Networking Mixer — NYC Chapter", type: "Networking", m: "Apr", d: "3", wd: "Thu", date: "Thursday, April 3, 2026", where: "The Loft, Manhattan", act: "RSVP", start: [2026, 3, 3, 18], end: [2026, 3, 3, 21] },
    { t: "Webinar: Career Pivots After 30", type: "Virtual", m: "Apr", d: "9", wd: "Wed", date: "Wednesday, April 9, 2026", where: "Virtual (Zoom)", act: "Join", start: [2026, 3, 9, 19], end: [2026, 3, 9, 20] },
    { t: "Homecoming Weekend 2026", type: "Homecoming", m: "Oct", d: "10–12", wd: "Fri–Sun", date: "October 10–12, 2026", where: "On Campus", act: "Save the Date", start: [2026, 9, 10, 9], end: [2026, 9, 12, 17] }
  ];
  const renderEvents = () => {
    $("[data-events]").innerHTML = EVENTS.map((e, i) => `<li class="ev"><div class="ev-date" aria-hidden="true"><small>${e.m}</small><b>${e.d}</b><em>${e.wd}</em></div>
      <div><span class="badge" style="--c:${TYPES[e.type][0]};--fg:${TYPES[e.type][1]}">${e.type}</span><h3>${e.t}</h3><p><span>${icon("i-cal")}${e.date}</span><span>${icon("i-pin")}${e.where}</span></p></div>
      <button class="btn ${e.done ? "btn-outline done" : i === 0 ? "btn-purple" : "btn-outline"}" type="button" data-ev="${i}">${e.done ? `${icon("i-check")}${e.done}` : e.act}</button></li>`).join("");
  };
  renderEvents();
  const pad = (n) => String(n).padStart(2, "0");
  const icsDate = ([y, m, d, h]) => `${y}${pad(m + 1)}${pad(d)}T${pad(h)}0000`;
  function saveDate(e) {
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Crestfield Alumni//Events//EN", "BEGIN:VEVENT", `UID:homecoming-2026@crestfield.example`, `DTSTAMP:${icsDate([2026, 0, 1, 0])}`, `DTSTART:${icsDate(e.start)}`, `DTEND:${icsDate(e.end)}`, `SUMMARY:${e.t}`, `LOCATION:${e.where}, Crestfield University`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "crestfield-homecoming-2026.ics";
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    e.done = "Saved"; renderEvents(); toast("Added to your calendar file: crestfield-homecoming-2026.ics");
  }
  function register(i) {
    const e = EVENTS[i];
    if (e.act === "Save the Date") return saveDate(e);
    if (e.done) { toast(`You're already ${e.done.toLowerCase()} for this event.`); return; }
    openDlg(`<h3>${e.act === "Join" ? "Join the webinar" : e.act === "RSVP" ? "RSVP" : "Register"}: ${e.t}</h3><p class="dl-lead">${e.date} · ${e.where}</p>
      <form class="form" data-ev-form novalidate><label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email" value="${user ? esc(user.email) : ""}"></label><label>Class year<input name="year" inputmode="numeric" placeholder="e.g. 2016" maxlength="4"></label>${e.type === "Reunion" ? `<label>Guests<select name="guests"><option value="0">Just me</option><option value="1">+1 guest</option><option value="2">+2 guests</option></select></label>` : ""}<p class="err" data-err role="alert"></p><button class="btn btn-purple" type="submit">${e.act === "Join" ? "Get the Zoom link" : "Confirm"}</button></form>`);
    $("[data-ev-form]", body).addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = ev.target, y = Number(f.year.value), errs = [];
      if (!f.name.value.trim()) errs.push("your name");
      if (!validEmail(f.email.value.trim())) errs.push("a valid email");
      if (!(y >= 1940 && y <= 2030)) errs.push("your class year");
      if (errs.length) { $("[data-err]", body).textContent = `Please enter ${errs.join(", ")}.`; return; }
      e.done = e.act === "Join" ? "Registered" : e.act === "RSVP" ? "RSVP'd" : "Registered";
      renderEvents();
      done("You're on the list!", `${esc(f.name.value.trim())} ('${String(y).slice(2)}) — ${esc(e.t)}${f.guests && f.guests.value !== "0" ? ` with ${f.guests.value} guest${f.guests.value === "1" ? "" : "s"}` : ""}. ${e.act === "Join" ? "The Zoom link would be emailed" : "A confirmation would be emailed"} to ${esc(f.email.value.trim())}. Demo only — nothing is sent.`);
    });
  }
  $("[data-events]").addEventListener("click", (e) => { const b = e.target.closest("[data-ev]"); if (b) register(Number(b.dataset.ev)); });
  $("[data-calendar]").addEventListener("click", () => openDlg(`<h3>Events calendar 2026</h3><p class="dl-lead">Highlights from 340+ events each year.</p><table class="cal"><tbody>${[["Apr 3", "Alumni Networking Mixer — NYC Chapter"], ["Apr 9", "Webinar: Career Pivots After 30"], ["Apr 24", "Chicago Chapter Spring Social"], ["May 16", "Class of 2016 — 10-Year Reunion"], ["Jun 6", "London Chapter Garden Party"], ["Sep 18", "Singapore Chapter Dinner"], ["Oct 10–12", "Homecoming Weekend 2026"], ["Dec 4", "Washington D.C. Holiday Reception"]].map(([d, t]) => `<tr><td>${d}</td><td>${t}</td></tr>`).join("")}</tbody></table>`));

  /* ---------- directory ---------- */
  const DIR = [
    { n: "Jordan Blake", y: 2012, t: "Marketing Director", co: "Ogilvy", city: "San Francisco, CA", ind: "Marketing", ch: "San Francisco", p: { skin: 0, hair: 2, hairStyle: "side", top: 2, bg: 3 } },
    { n: "Aisha Okonkwo", y: 2018, t: "Software Engineer", co: "Stripe", city: "London, UK", ind: "Technology", ch: "London", p: { skin: 6, hair: 0, hairStyle: "wrap", top: 1, bg: 1 } },
    { n: "Tom Nakamura", y: 2005, t: "Partner", co: "Baker McKenzie", city: "Tokyo, Japan", ind: "Law", ch: "", p: { skin: 1, hair: 0, hairStyle: "short", top: 4, bg: 6, glasses: true } },
    { n: "Elena Petrova", y: 2021, t: "Graduate Student", co: "MIT", city: "Cambridge, MA", ind: "Education", ch: "", p: { skin: 0, hair: 4, hairStyle: "long", top: 9, bg: 5 } },
    { n: "Samuel Osei", y: 2010, t: "Investment Banker", co: "Goldman Sachs", city: "New York, NY", ind: "Finance", ch: "New York City", p: { skin: 5, hair: 0, hairStyle: "buzz", top: 7, bg: 2 } },
    { n: "Grace Liu", y: 2016, t: "Product Manager", co: "Airbnb", city: "San Francisco, CA", ind: "Technology", ch: "San Francisco", p: { skin: 1, hair: 0, hairStyle: "bob", top: 3, bg: 4 } },
    { n: "Daniel Cohen", y: 1998, t: "Professor of History", co: "Georgetown University", city: "Washington, DC", ind: "Education", ch: "Washington D.C.", p: { skin: 7, hair: 5, hairStyle: "short", top: 0, bg: 0, beard: true } },
    { n: "Maya Rodriguez", y: 2016, t: "Pediatric Nurse", co: "Lurie Children's Hospital", city: "Chicago, IL", ind: "Healthcare", ch: "Chicago", p: { skin: 3, hair: 1, hairStyle: "curly", top: 6, bg: 7 } },
    { n: "Wei Tan", y: 2014, t: "Regional Director", co: "DBS Bank", city: "Singapore", ind: "Finance", ch: "Singapore", p: { skin: 1, hair: 0, hairStyle: "side", top: 4, bg: 3 } },
    { n: "Olivia Bennett", y: 2009, t: "Policy Advisor", co: "U.S. Department of Energy", city: "Washington, DC", ind: "Government", ch: "Washington D.C.", p: { skin: 0, hair: 3, hairStyle: "bun", top: 1, bg: 1 } },
    { n: "Rahul Mehta", y: 2019, t: "Data Analyst", co: "Spotify", city: "New York, NY", ind: "Technology", ch: "New York City", p: { skin: 4, hair: 0, hairStyle: "short", top: 5, bg: 4 } },
    { n: "Chloe Martin", y: 2022, t: "Associate", co: "McKinsey & Company", city: "Chicago, IL", ind: "Consulting", ch: "Chicago", p: { skin: 7, hair: 4, hairStyle: "long", top: 3, bg: 2 } },
    { n: "James O'Connor", y: 1994, t: "Retired Judge", co: "Massachusetts Superior Court", city: "Boston, MA", ind: "Law", ch: "", p: { skin: 0, hair: 5, hairStyle: "side", top: 7, bg: 6, glasses: true } },
    { n: "Fatima Al-Sayed", y: 2017, t: "Architect", co: "Foster + Partners", city: "London, UK", ind: "Architecture", ch: "London", p: { skin: 3, hair: 0, hairStyle: "wrap", top: 9, bg: 5 } },
    { n: "Noah Williams", y: 2013, t: "Head Coach", co: "Crestfield Athletics", city: "Crestfield, MA", ind: "Education", ch: "", p: { skin: 5, hair: 0, hairStyle: "buzz", top: 0, bg: 0, beard: true } },
    { n: "Sophie Laurent", y: 2020, t: "UX Designer", co: "Figma", city: "New York, NY", ind: "Technology", ch: "New York City", p: { skin: 0, hair: 6, hairStyle: "bob", top: 6, bg: 7 } }
  ];
  const form = $("[data-dir-form]");
  const uniq = (k) => [...new Set(DIR.map((d) => d[k]).filter(Boolean))].sort();
  const fill = (name, vals) => form[name].insertAdjacentHTML("beforeend", vals.map((v) => `<option>${esc(v)}</option>`).join(""));
  fill("industry", uniq("ind")); fill("loc", uniq("city")); fill("chapter", uniq("ch"));
  const pending = new Set();
  function renderDir() {
    const q = form.q.value.trim().toLowerCase().replace(/^'/, "");
    const yr = form.year.value, ind = form.industry.value, loc = form.loc.value, ch = form.chapter.value;
    const list = DIR.filter((d) => {
      const hay = `${d.n} ${d.y} '${String(d.y).slice(2)} ${d.t} ${d.co} ${d.city}`.toLowerCase();
      return (!q || hay.includes(q)) && (!yr || `${String(d.y).slice(0, 3)}0s` === yr) && (!ind || d.ind === ind) && (!loc || d.city === loc) && (!ch || d.ch === ch);
    });
    const active = [yr, ind, loc, ch].filter(Boolean).length;
    const fc = $("[data-fcount]"); fc.hidden = !active; fc.textContent = active;
    const isDefault = !q && !active;
    const show = user ? list : list.slice(0, 4);
    $("[data-dir-count]").textContent = isDefault ? "Preview of the directory — search 45,200+ alumni after logging in." : `${list.length} match${list.length === 1 ? "" : "es"} in this preview${!user && list.length > 4 ? ` · showing 4 — log in to see all` : ""}`;
    $("[data-dir-grid]").innerHTML = show.length ? show.map((d) => `<article class="al"><span class="av">${A.avatar(d.p, d.n)}</span><h3>${esc(d.n)}, '${String(d.y).slice(2)}</h3><p>${esc(d.t)}, ${esc(d.co)}</p><span class="loc">${icon("i-pin")}${esc(d.city)}</span><button class="btn ${pending.has(d.n) ? "btn-outline done" : "btn-outline"}" type="button" data-connect="${esc(d.n)}">${pending.has(d.n) ? `${icon("i-check")}Request sent` : "Connect"}</button></article>`).join("") : `<div class="empty">No alumni match that search in this preview. Try a different name, year or city.</div>`;
  }
  form.addEventListener("input", renderDir);
  form.addEventListener("submit", (e) => { e.preventDefault(); renderDir(); });
  renderDir();
  $("[data-dir-grid]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-connect]"); if (!b) return;
    const n = b.dataset.connect;
    if (pending.has(n)) { toast(`Your request to ${n} is pending.`); return; }
    requireLogin(`Log in to connect with ${n}.`, () => { pending.add(n); renderDir(); toast(`Connection request sent to ${n} (demo).`); });
  });
  $("[data-full-dir]").addEventListener("click", () => requireLogin("The full directory is available to logged-in alumni.", () => { renderDir(); $("#directory").scrollIntoView(); toast(`Showing all ${DIR.length} alumni in this preview directory.`); }));
  const ft = $("[data-dir-ftoggle]"), fl = $("[data-dir-filters]");
  fl.classList.add("closed");
  ft.addEventListener("click", () => { const open = fl.classList.toggle("closed") === false; ft.setAttribute("aria-expanded", open); });

  /* ---------- mentorship ---------- */
  $("[data-mentor]").addEventListener("click", () => {
    openDlg(`<h3>Become a Mentor</h3><p class="dl-lead">Tell us how you'd like to help. Most mentors give 1–2 hours a month.</p><form class="form" data-m-form novalidate><label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email" value="${user ? esc(user.email) : ""}"></label><label>Industry<select name="ind">${uniq("ind").map((v) => `<option>${v}</option>`).join("")}</select></label><fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:600;font-size:14px;color:#1A1F36;margin-bottom:4px">I can help with</legend>${["Career advice", "Portfolio reviews", "Interview prep", "Résumé feedback"].map((h) => `<label class="chk"><input type="checkbox" name="help" value="${h}"> ${h}</label>`).join("")}</fieldset><p class="err" data-err role="alert"></p><button class="btn btn-purple" type="submit">Join as a mentor</button></form>`);
    $("[data-m-form]", body).addEventListener("submit", (e) => {
      e.preventDefault(); const f = e.target, helps = $$("input[name=help]:checked", f).map((x) => x.value);
      if (!f.name.value.trim() || !validEmail(f.email.value.trim())) { $("[data-err]", body).textContent = "Please enter your name and a valid email."; return; }
      if (!helps.length) { $("[data-err]", body).textContent = "Choose at least one way you can help."; return; }
      done("Thank you for paying it forward!", `${esc(f.name.value.trim().split(" ")[0])}, we'd match you with students in ${esc(f.ind.value)} for ${helps.map(esc).join(", ").toLowerCase()}. Demo only — nothing is sent.`);
    });
  });

  /* ---------- giving ---------- */
  const FUNDS = {
    annual: { n: "Annual Fund 2026", raised: 2180000, goal: 3000000 },
    stem: { n: "STEM Scholarship Fund", raised: 420000, goal: 500000 },
    library: { n: "Library Renovation", raised: 1100000, goal: 2000000 },
    athletics: { n: "Athletics Program", raised: 280000, goal: 400000 }
  };
  let donors = 4200;
  const short = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 ? (n % 1e5 ? 2 : 1) : 0)}M` : money(n));
  $("[data-funds]").innerHTML = ["stem", "library", "athletics"].map((k) => `<article class="fund"><h3>${FUNDS[k].n}</h3><div class="bar" role="progressbar" aria-label="${FUNDS[k].n} progress" aria-valuemin="0" aria-valuemax="100" data-bar="${k}"><i></i></div><p class="nums"><span><b data-raised="${k}"></b> / ${short(FUNDS[k].goal)} goal</span><span class="pct" data-pct="${k}"></span></p><button class="btn btn-outline" type="button" data-give="${k}">Donate</button></article>`).join("");
  function syncFund(k) {
    const f = FUNDS[k], pct = Math.min(100, Math.round((f.raised / f.goal) * 100));
    $(`[data-raised="${k}"]`).textContent = k === "annual" ? money(f.raised) : short(f.raised);
    $(`[data-pct="${k}"]`).textContent = `${pct}%`;
    const bar = $(`[data-bar="${k}"]`); bar.setAttribute("aria-valuenow", pct); $("i", bar).style.setProperty("--w", `${pct}%`);
  }
  Object.keys(FUNDS).forEach(syncFund);
  const bars = $$("[data-bar]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.4 });
    bars.forEach((b) => io.observe(b));
  } else bars.forEach((b) => b.classList.add("in"));
  function give(k) {
    let amt = 100;
    openDlg(`<h3>Make a gift</h3><p class="dl-lead">Every gift counts toward this year's participation goal.</p><form class="form" data-g-form novalidate>
      <label>Designation<select name="fund">${Object.entries(FUNDS).map(([key, f]) => `<option value="${key}"${key === k ? " selected" : ""}>${f.n}</option>`).join("")}</select></label>
      <div><p style="margin:0 0 6px;font-weight:600;font-size:14px;color:#1A1F36">Amount</p><div class="amts" role="group" aria-label="Gift amount">${[50, 100, 250, 500].map((a) => `<button type="button" data-amt="${a}" aria-pressed="${a === amt}">$${a}</button>`).join("")}</div></div>
      <label>Other amount (USD)<input name="other" inputmode="numeric" placeholder="e.g. 1000"></label>
      <label class="chk"><input type="checkbox" name="monthly"> Make this a monthly gift</label>
      <label>Full name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email" value="${user ? esc(user.email) : ""}"></label>
      <p class="err" data-err role="alert"></p><button class="btn btn-purple" type="submit" data-g-submit>Give $100</button><p class="dl-lead" style="margin:0;font-size:13px">Demo: no payment is processed.</p></form>`);
    const f = $("[data-g-form]", body), btn = $("[data-g-submit]", body);
    const cur = () => { const o = Number(f.other.value.replace(/[^\d.]/g, "")); return o > 0 ? o : amt; };
    const sync = () => (btn.textContent = `Give ${money(cur())}${f.monthly.checked ? "/month" : ""}`);
    $$("[data-amt]", body).forEach((b) => b.addEventListener("click", () => { amt = Number(b.dataset.amt); f.other.value = ""; $$("[data-amt]", body).forEach((x) => x.setAttribute("aria-pressed", x === b)); sync(); }));
    f.other.addEventListener("input", () => { if (f.other.value) $$("[data-amt]", body).forEach((x) => x.setAttribute("aria-pressed", "false")); sync(); });
    f.monthly.addEventListener("change", sync);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = cur();
      if (!(v >= 5)) { $("[data-err]", body).textContent = "Please choose an amount of at least $5."; return; }
      if (!f.name.value.trim() || !validEmail(f.email.value.trim())) { $("[data-err]", body).textContent = "Please enter your name and a valid email."; return; }
      const key = f.fund.value;
      FUNDS[key].raised += v; syncFund(key);
      if (key === "annual") { donors += 1; $("[data-donors]").textContent = donors.toLocaleString("en-US"); }
      done("Thank you for your generosity!", `${money(v)}${f.monthly.checked ? " monthly" : ""} to the ${FUNDS[key].n}. The progress bar now includes your gift. Demo only — no payment was taken.`);
    });
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-give]"); if (b) give(b.dataset.give); });
  $("[data-all-campaigns]").addEventListener("click", () => openDlg(`<h3>All campaigns</h3><p class="dl-lead">Current fundraising priorities.</p><table class="cal"><tbody>${Object.entries(FUNDS).map(([k, f]) => `<tr><td>${Math.round((f.raised / f.goal) * 100)}%</td><td>${f.n} — ${money(f.raised)} of ${money(f.goal)} <button class="link" type="button" data-give="${k}">Give</button></td></tr>`).join("")}<tr><td>New</td><td>First-Generation Student Fund — launching spring</td></tr></tbody></table>`));

  /* ---------- chapters ---------- */
  const flag = (c) => ({
    US: `<svg viewBox="0 0 60 40" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<rect y="${i * 5.72}" width="60" height="2.86" fill="#B22234"/>`).join("")}<rect width="26" height="20" fill="#3C3B6E"/></svg>`,
    UK: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"/><path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#C8102E" stroke-width="7"/></svg>`,
    SG: `<svg viewBox="0 0 60 40" aria-hidden="true"><rect width="60" height="20" fill="#EF3340"/><rect y="20" width="60" height="20" fill="#fff"/><circle cx="12" cy="10" r="6" fill="#fff"/><circle cx="14.5" cy="10" r="6" fill="#EF3340"/>${[[19, 6], [22, 9], [21, 13], [17, 13], [16, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.1" fill="#fff"/>`).join("")}</svg>`
  }[c]);
  const CHAPS = [
    { city: "New York City", members: 3800, c: "US", lat: 40.7, lon: -74 },
    { city: "San Francisco", members: 2400, c: "US", lat: 37.8, lon: -122.4 },
    { city: "London", members: 1100, c: "UK", lat: 51.5, lon: -0.1 },
    { city: "Chicago", members: 1600, c: "US", lat: 41.9, lon: -87.6 },
    { city: "Washington D.C.", members: 2100, c: "US", lat: 38.9, lon: -77 },
    { city: "Singapore", members: 680, c: "SG", lat: 1.35, lon: 103.8 }
  ];
  $("[data-map]").innerHTML = A.worldMap(CHAPS);
  const renderChaps = () => {
    $("[data-chapters]").innerHTML = CHAPS.map((c, i) => `<article class="chap" data-chap="${i}"><span class="flag">${flag(c.c)}</span><div><h3>${c.city}</h3><small>${c.members.toLocaleString("en-US")} members</small></div><button class="btn ${c.joined ? "btn-outline done" : "btn-outline"}" type="button" data-join="${i}">${c.joined ? `${icon("i-check")}Joined` : "Join Chapter"}</button></article>`).join("");
  };
  renderChaps();
  $("[data-chapters]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-join]"); if (!b) return;
    const c = CHAPS[b.dataset.join];
    requireLogin(`Log in to join the ${c.city} chapter.`, () => {
      c.joined = !c.joined; c.members += c.joined ? 1 : -1; renderChaps();
      toast(c.joined ? `Welcome to the ${c.city} chapter!` : `You left the ${c.city} chapter.`);
    });
  });
  const pickPin = (i) => {
    $$(".pin").forEach((p) => p.classList.toggle("on", p.dataset.pin === String(i)));
    $$(".chap").forEach((c) => c.classList.toggle("on", c.dataset.chap === String(i)));
    const c = CHAPS[i];
    $("[data-map-tip]").textContent = `${c.city} — ${c.members.toLocaleString("en-US")} members`;
  };
  $("[data-map]").addEventListener("click", (e) => { const p = e.target.closest(".pin"); if (p) pickPin(Number(p.dataset.pin)); });
  $("[data-map]").addEventListener("keydown", (e) => { const p = e.target.closest(".pin"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pickPin(Number(p.dataset.pin)); } });
  $("[data-find-chapter]").addEventListener("click", () => {
    openDlg(`<h3>Find your local chapter</h3><p class="dl-lead">Type a city to see the nearest chapter.</p><form class="form" data-fc novalidate><label>City<input name="city" placeholder="e.g. Brooklyn, Oakland, Boston"></label><button class="btn btn-blue" type="submit">Search</button><p data-fc-out aria-live="polite"></p></form>`);
    const near = { brooklyn: 0, manhattan: 0, newark: 0, oakland: 1, "san jose": 1, berkeley: 1, oxford: 2, cambridge: 2, evanston: 3, arlington: 4, baltimore: 4, "kuala lumpur": 5 };
    $("[data-fc]", body).addEventListener("submit", (e) => {
      e.preventDefault(); const v = e.target.city.value.trim().toLowerCase(), out = $("[data-fc-out]", body);
      const i = CHAPS.findIndex((c) => c.city.toLowerCase().includes(v)) >= 0 ? CHAPS.findIndex((c) => c.city.toLowerCase().includes(v)) : near[v];
      out.textContent = !v ? "Enter a city." : i !== undefined && i >= 0 ? `Nearest chapter: ${CHAPS[i].city} (${CHAPS[i].members.toLocaleString("en-US")} members).` : "No chapter nearby yet — you can start one with the alumni office (demo).";
    });
  });

  /* ---------- news ---------- */
  const NEWS = [
    { t: "Crestfield Ranked #28 in National University Rankings", d: "March 5, 2026", b: "News", c: ["#DBEAFE", "#1E40AF"], img: "rank", body: "Crestfield climbed four places in this year's national rankings, with notable gains in graduation rate and alumni giving participation." },
    { t: "New Career Services Portal Now Open to All Alumni", d: "February 22, 2026", b: "Announcement", c: ["#F3E8FF", "#7E22CE"], img: "portal", body: "Every graduate can now book coaching sessions, browse the job board and request résumé reviews through the new portal — free for life." },
    { t: "Alumni Entrepreneur Wins Forbes 30 Under 30", d: "February 10, 2026", b: "Feature", c: ["#FEF3C7", "#B45309"], img: "award", body: "A recent Crestfield graduate was named to this year's list for climate-tech innovation, crediting the university's venture competition with the company's start." }
  ];
  $("[data-news]").innerHTML = NEWS.map((n, i) => `<article class="nw"><div class="nw-img">${A.thumb(n.img)}</div><div class="nw-b"><span class="badge" style="--c:${n.c[0]};--fg:${n.c[1]};align-self:flex-start">${n.b}</span><h3>${n.t}</h3><time>${n.d}</time><button class="link" type="button" data-news-i="${i}">Read More ${icon("i-arrow")}</button></div></article>`).join("");
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-news-i]"); if (b) { const n = NEWS[b.dataset.newsI]; openDlg(`<span class="badge" style="--c:${n.c[0]};--fg:${n.c[1]}">${n.b}</span><h3 style="margin-top:10px">${n.t}</h3><p class="dl-lead">${n.d}</p><p>${n.body}</p>`); } });
  $("[data-all-news]").addEventListener("click", () => openDlg(`<h3>All news</h3>${NEWS.map((n, i) => `<p><button class="link" type="button" data-news-i="${i}">${n.t}</button><br><small style="color:#697386">${n.d}</small></p>`).join("")}`));

  /* ---------- benefits (grid on desktop, accordion on mobile) ---------- */
  const BEN = [
    ["i-brief", "Career Services", "Resume reviews, job board access, career coaching"], ["i-book", "Library Access", "Digital library and research databases"],
    ["i-tag", "Campus Discounts", "Bookstore, athletics events, campus facilities"], ["i-shield", "Insurance Plans", "Group rates on health, auto, and life insurance"],
    ["i-plane", "Travel Discounts", "Partner hotels and airlines"], ["i-school", "Continuing Education", "Free audit of select online courses"],
    ["i-mail", "Email for Life", "Keep your @crestfield.edu email address"], ["i-doc", "Transcript Requests", "Fast-track official transcript orders"]
  ];
  $("[data-benefits]").innerHTML = BEN.map(([ic, n, d]) => `<details class="bn"><summary><span class="b-ico">${icon(ic)}</span><h3>${n}</h3><svg class="i chev"><use href="#i-chev-d"/></svg></summary><p>${d}</p></details>`).join("");
  const mq = matchMedia("(max-width: 860px)");
  const syncBen = () => $$(".bn").forEach((d) => { d.open = !mq.matches; });
  syncBen(); mq.addEventListener("change", syncBen);
  $$(".bn summary").forEach((s) => s.addEventListener("click", (e) => { if (!mq.matches) e.preventDefault(); }));
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-all-benefits]"); if (!b) return; e.preventDefault(); openDlg(`<h3>All alumni benefits</h3><p class="dl-lead">Available to every Crestfield graduate with an alumni account.</p><ul>${BEN.map(([, n, d]) => `<li><b>${n}</b> — ${d}</li>`).join("")}<li><b>Fitness Center</b> — discounted alumni memberships</li><li><b>Event Tickets</b> — priority access to campus performances</li></ul>`); });

  /* ---------- signup / login / misc ---------- */
  $("[data-signup]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = e.target.email.value.trim(), m = $("[data-su-msg]");
    if (!validEmail(v)) { m.className = "su-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    openDlg(`<h3>Create your alumni account</h3><p class="dl-lead">${esc(v)}</p><form class="form" data-acct novalidate><label>Full name<input name="name" autocomplete="name"></label><label>Class year<input name="year" inputmode="numeric" maxlength="4" placeholder="e.g. 2015"></label><p class="err" data-err role="alert"></p><button class="btn btn-purple" type="submit">Create account</button></form>`);
    $("[data-acct]", body).addEventListener("submit", (ev) => {
      ev.preventDefault(); const f = ev.target, y = Number(f.year.value);
      if (!f.name.value.trim() || !(y >= 1940 && y <= 2030)) { $("[data-err]", body).textContent = "Please enter your name and class year."; return; }
      user = { email: v }; $$("[data-login]").forEach((b) => (b.textContent = "My Account"));
      $("[data-login-note]").textContent = `Logged in as ${v} — full profiles unlocked (demo).`; renderDir();
      m.className = "su-msg ok"; m.textContent = `Welcome to the network, ${f.name.value.trim().split(" ")[0]}!`; e.target.reset();
      done(`Welcome back, ${esc(f.name.value.trim().split(" ")[0])} '${String(y).slice(2)}!`, "Your alumni account is ready (demo — nothing is sent). The directory, RSVPs and chapters are now unlocked.");
    });
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-login]");
    if (b) { closeMenu(); if (user) toast(`Logged in as ${user.email} (demo).`); else login("", () => renderDir()); return; }
    const s = e.target.closest("[data-soon]");
    if (s) { e.preventDefault(); toast(`${s.dataset.soon} — available in the full alumni portal.`); }
  });

  /* ---------- nav / mobile ---------- */
  const burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); }
  burger.addEventListener("click", () => { const show = mnav.hidden; mnav.hidden = !show; burger.setAttribute("aria-expanded", show); burger.setAttribute("aria-label", show ? "Close menu" : "Open menu"); });
  $$("a", mnav).forEach((a) => a.addEventListener("click", closeMenu));
  const mbar = $("[data-mbar]"), hero = $(".hero"), join = $("#join");
  const onScroll = () => { const j = join.getBoundingClientRect(); mbar.classList.toggle("show", hero.getBoundingClientRect().bottom < 0 && !(j.top < innerHeight && j.bottom > 0)); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
