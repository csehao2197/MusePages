(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 864e5;
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = startOfDay(now);
  const monday = new Date(today.getTime() - ((today.getDay() + 6) % 7) * DAY);
  const fmtDate = (d, o) => d.toLocaleDateString("en-US", o);

  /* ---------- people / avatars ---------- */
  const face = (skin, hair, top, bg, style = "short") => {
    const hairs = {
      short: `<path d="M18 26c0-10 6-15 14-15s15 5 14 15c-3-5-7-7-12-7-6 1-11 2-16 7z" fill="${hair}"/>`,
      long: `<path d="M15 30c0-13 7-19 17-19s17 6 17 19v14h-5V27c-4-3-8-5-12-5s-9 2-12 5v17h-5z" fill="${hair}"/>`,
      bun: `<circle cx="32" cy="10" r="6" fill="${hair}"/><path d="M18 27c0-10 6-15 14-15s14 5 14 15c-4-5-9-6-14-6s-10 1-14 6z" fill="${hair}"/>`
    };
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/><path d="M10 64c2-12 11-18 22-18s20 6 22 18z" fill="${top}"/><rect x="27" y="38" width="10" height="10" rx="4" fill="${skin}"/><ellipse cx="32" cy="29" rx="13" ry="15" fill="${skin}"/>${hairs[style]}<circle cx="27" cy="30" r="1.5" fill="#1F1A17"/><circle cx="37" cy="30" r="1.5" fill="#1F1A17"/><path d="M28 37q4 3 8 0" stroke="#7A3B30" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
  };
  const ME = face("#F1C9A5", "#5B3A29", "#4F46E5", "#E0E7FF", "short");
  $$("[data-me-av]").forEach((el) => (el.innerHTML = ME));
  const PEOPLE = {
    chen: { n: "Prof. Sarah Chen", f: face("#EBC7A6", "#111827", "#1E40AF", "#DBEAFE", "bun") },
    park: { n: "Dr. James Park", f: face("#E3B98F", "#1C1917", "#065F46", "#D1FAE5", "short") },
    garcia: { n: "Prof. Maria Garcia", f: face("#C98E66", "#3F2A1E", "#6D28D9", "#EDE9FE", "long") },
    okafor: { n: "Dr. Nnamdi Okafor", f: face("#7B4B2A", "#0C0A09", "#C2410C", "#FFEDD5", "short") },
    lind: { n: "Prof. Erik Lind", f: face("#F2D2B6", "#A16207", "#0F766E", "#CCFBF1", "short") }
  };

  /* ---------- data ---------- */
  const COURSES = [
    { id: "ds", t: "Data Structures & Algorithms", code: "CS 201", who: "chen", c: "#3B82F6", p: 68, next: "Wed, 10:00 AM — Lecture: Binary Trees", g: "A- (92%)", art: "code" },
    { id: "ml", t: "Introduction to Machine Learning", code: "CS 245", who: "park", c: "#10B981", p: 45, next: "Thu, 2:00 PM — Lab: Neural Networks", g: "B+ (87%)", art: "net" },
    { id: "tw", t: "Technical Writing", code: "ENG 210", who: "garcia", c: "#8B5CF6", p: 72, next: "Fri, 11:00 AM — Workshop: Peer Review", g: "A (95%)", art: "doc" },
    { id: "db", t: "Database Systems", code: "CS 230", who: "okafor", c: "#F97316", p: 51, next: "Tue, 9:00 AM — Lecture: Normalization", g: "A- (91%)", art: "db" },
    { id: "dm", t: "Discrete Mathematics", code: "MATH 220", who: "lind", c: "#14B8A6", p: 60, next: "Mon, 1:00 PM — Lecture: Graph Theory", g: "B+ (88%)", art: "graph" }
  ];
  const C = Object.fromEntries(COURSES.map((c) => [c.id, c]));
  const art = (kind, c) => {
    const bg = `<rect width="320" height="96" fill="${c}" opacity=".14"/><circle cx="290" cy="10" r="50" fill="${c}" opacity=".18"/>`;
    const k = {
      code: `<g font-family="ui-monospace,monospace" font-size="13" fill="${c}"><text x="18" y="30">&lt;/&gt;</text><text x="60" y="30" opacity=".7">insert(node)</text><text x="60" y="52" opacity=".5">left.depth + 1</text><text x="60" y="74" opacity=".35">return root</text></g><g stroke="${c}" stroke-width="2" fill="#fff"><path d="M250 30 230 60M250 30 270 60M230 60 220 82M230 60 240 82" fill="none"/><circle cx="250" cy="28" r="7"/><circle cx="230" cy="60" r="7"/><circle cx="270" cy="60" r="7"/><circle cx="220" cy="82" r="5"/><circle cx="240" cy="82" r="5"/></g>`,
      net: `<g stroke="${c}" stroke-width="1.4" opacity=".55">${[24, 48, 72].flatMap((a) => [20, 40, 60, 80].map((b) => `<path d="M60 ${a}L150 ${b}"/>`)).join("")}${[20, 40, 60, 80].flatMap((a) => [36, 60].map((b) => `<path d="M150 ${a}L240 ${b}"/>`)).join("")}</g><g fill="#fff" stroke="${c}" stroke-width="2.5">${[24, 48, 72].map((y) => `<circle cx="60" cy="${y}" r="7"/>`).join("")}${[20, 40, 60, 80].map((y) => `<circle cx="150" cy="${y}" r="7"/>`).join("")}<circle cx="240" cy="36" r="7"/><circle cx="240" cy="60" r="7"/></g>`,
      doc: `<rect x="110" y="12" width="70" height="88" rx="6" fill="#fff" stroke="${c}" stroke-width="2"/><g stroke="${c}" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M122 30h46M122 42h46M122 54h30M122 66h40"/></g><rect x="150" y="22" width="70" height="80" rx="6" fill="#fff" stroke="${c}" stroke-width="2" opacity=".6"/><path d="M230 70l26-26 8 8-26 26h-8z" fill="${c}" opacity=".8"/>`,
      db: `<g fill="#fff" stroke="${c}" stroke-width="2.5"><ellipse cx="150" cy="24" rx="40" ry="10"/><path d="M110 24v50c0 5.5 18 10 40 10s40-4.5 40-10V24" fill="none"/><path d="M110 49c0 5.5 18 10 40 10s40-4.5 40-10" fill="none"/></g><g stroke="${c}" stroke-width="2" fill="none" opacity=".5"><rect x="220" y="20" width="60" height="26" rx="4"/><rect x="220" y="56" width="60" height="26" rx="4"/><path d="M200 33h20M200 69h20"/></g>`,
      graph: `<g stroke="${c}" stroke-width="2" opacity=".6"><path d="M80 30 140 20 200 50 150 80 90 70zM140 20 150 80M80 30 200 50"/></g><g fill="#fff" stroke="${c}" stroke-width="2.5">${[[80, 30], [140, 20], [200, 50], [150, 80], [90, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join("")}</g>`
    }[kind];
    return `<svg viewBox="0 0 320 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg}${k}</svg>`;
  };
  const at = (days, h, m) => new Date(today.getTime() + days * DAY + (h * 60 + m) * 6e4);
  const ASSIGN = [
    { id: "a1", t: "ML Problem Set 4", course: "ml", due: at(1, 23, 59), action: "Submit" },
    { id: "a2", t: "Binary Tree Implementation", course: "ds", due: at(3, 23, 59), action: "Start" },
    { id: "a3", t: "Essay Draft: Technical Ethics", course: "tw", due: at(6, 23, 59), action: "Continue" },
    { id: "a4", t: "Database ER Diagram", course: "db", due: at(8, 23, 59), action: null }
  ];
  const GRADES = [
    { t: "ML Quiz 3", course: "ml", s: 88, l: "B+", cm: "Good work on backpropagation.", full: "Good work on backpropagation. Your chain-rule derivation was clean; review learning-rate scheduling (Q7) before the midterm.", d: "Oct 5" },
    { t: "Data Structures HW 6", course: "ds", s: 95, l: "A", cm: "Excellent binary search implementation.", full: "Excellent binary search implementation. Edge cases for empty arrays and duplicates were handled well. Consider iterative over recursive for large inputs.", d: "Oct 3" },
    { t: "Writing Assignment 3", course: "tw", s: 92, l: "A-", cm: "Strong thesis, tighten conclusion.", full: "Strong thesis, tighten conclusion. The second section's evidence is persuasive; the final paragraph restates rather than extends your argument.", d: "Oct 1" }
  ];

  /* ---------- greeting + summary ---------- */
  const h = now.getHours();
  const part = h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  $("[data-greet]").textContent = `Good ${part}, Alex`;
  const sunday = new Date(monday.getTime() + 7 * DAY);
  const open = () => ASSIGN.filter((a) => !a.done);
  function syncCounts() {
    const week = open().filter((a) => a.due < sunday).length;
    $("[data-summary]").textContent = `You have ${week} assignment${week === 1 ? "" : "s"} due this week and 1 upcoming quiz.`;
    $("[data-due-week]").innerHTML = `${week} <span>this week</span>`;
    const nx = open().sort((a, b) => a.due - b.due)[0];
    $("[data-due-next]").textContent = nx ? `Next: ${nx.t}` : "All caught up";
    $("[data-due-badge]").textContent = open().length;
  }

  /* ---------- courses ---------- */
  let allCourses = false;
  function renderCourses() {
    const list = allCourses ? COURSES : COURSES.slice(0, 3);
    $("[data-courses]").innerHTML = list.map((c) => `<article class="course" data-course="${c.id}">
      <div class="thumb">${art(c.art, c.c)}</div>
      <div class="c-body"><h3><a href="#courses" data-course-open="${c.id}">${esc(c.t)}</a></h3><p class="inst">${PEOPLE[c.who].n}</p>
        <div class="prog"><span class="bar" role="progressbar" aria-label="${esc(c.t)} progress" aria-valuenow="${c.p}" aria-valuemin="0" aria-valuemax="100"><i style="width:${c.p}%"></i></span>${c.p}%</div>
        <p class="next"><b>Next class</b>${esc(c.next)}</p>
        <div class="c-foot"><span class="gr">${c.g}</span><button class="btn btn-soft btn-sm" type="button" data-continue="${c.id}">Continue Learning</button></div></div>
    </article>`).join("");
    $("[data-all-courses]").textContent = allCourses ? "Show Less" : "View All";
  }
  $("[data-all-courses]").addEventListener("click", () => { allCourses = !allCourses; renderCourses(); });
  renderCourses();

  /* ---------- schedule ---------- */
  const SCHED = [
    [{ c: "ds", t: "Data Structures", s: "10:00", e: "11:30 AM", where: "Room 204 / Zoom", topic: "Lecture: Heaps & Priority Queues", zoom: true }, { c: "dm", t: "Discrete Math", s: "1:00", e: "2:15 PM", where: "Room 118", topic: "Lecture: Graph Theory" }],
    [{ c: "db", t: "Database Systems", s: "9:00", e: "10:30 AM", where: "Room 310", topic: "Lecture: Normalization" }, { c: "ml", t: "ML Lecture", s: "2:00", e: "3:30 PM", where: "Hall B / Zoom", topic: "Gradient descent", zoom: true }],
    [{ c: "ds", t: "Data Structures", s: "10:00", e: "11:30 AM", where: "Room 204 / Zoom", topic: "Lecture: Binary Trees", zoom: true }, { c: "sg", t: "Study Group", s: "5:00", e: "6:00 PM", where: "Library", topic: "DS problem set review" }],
    [{ c: "db", t: "Database Systems", s: "9:00", e: "10:30 AM", where: "Room 310", topic: "Lab: SQL joins" }, { c: "ml", t: "ML Lab", s: "2:00", e: "4:00 PM", where: "CS Lab 3", topic: "Lab: Neural Networks" }],
    [{ c: "tw", t: "Technical Writing", s: "11:00", e: "12:00 PM", where: "Room 102 / Zoom", topic: "Workshop: Peer Review", zoom: true }, { c: "dm", t: "Discrete Math", s: "1:00", e: "2:15 PM", where: "Room 118", topic: "Recitation" }],
    [{ c: "sg", t: "Study Group", s: "10:00", e: "11:00 AM", where: "Zoom", topic: "ML problem set 4", zoom: true }],
    []
  ];
  const color = (id) => (id === "sg" ? "#6366F1" : C[id].c);
  const todayIdx = (today.getDay() + 6) % 7;
  const week = $("[data-week]");
  week.innerHTML = SCHED.map((evs, i) => {
    const d = new Date(monday.getTime() + i * DAY);
    return `<div class="day${i === todayIdx ? " today" : ""}" data-day="${i}" aria-label="${fmtDate(d, { weekday: "long", month: "long", day: "numeric" })}">
      <div class="day-h">${fmtDate(d, { weekday: "short" })} <b>${d.getDate()}</b></div>
      ${evs.length ? evs.map((e, k) => `<button class="ev" type="button" style="--c:${color(e.c)}" data-ev="${i}-${k}" aria-expanded="false"><b>${esc(e.t)}</b><span>${e.s}–${e.e}</span><br><span>${esc(e.where)}</span></button>`).join("") : '<p class="empty-day">No classes</p>'}
    </div>`;
  }).join("");
  const detail = $("[data-ev-detail]");
  week.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ev]"); if (!b) return;
    const wasOpen = b.getAttribute("aria-expanded") === "true";
    $$("[data-ev]").forEach((x) => x.setAttribute("aria-expanded", "false"));
    if (wasOpen) { detail.innerHTML = ""; return; }
    b.setAttribute("aria-expanded", "true");
    const [di, k] = b.dataset.ev.split("-").map(Number), ev = SCHED[di][k];
    const d = new Date(monday.getTime() + di * DAY);
    detail.style.borderLeft = `4px solid ${color(ev.c)}`;
    detail.innerHTML = `<div><h3>${esc(ev.t)} — ${esc(ev.topic)}</h3><p>${fmtDate(d, { weekday: "long", month: "short", day: "numeric" })} · ${ev.s}–${ev.e} · ${esc(ev.where)}</p></div>${ev.zoom ? `<button class="btn btn-primary btn-sm" type="button" data-join-ev>${icon("i-video")}Join virtual class</button>` : `<span class="muted sm">In person</span>`}`;
    const j = $("[data-join-ev]", detail); if (j) j.addEventListener("click", () => joinDialog(`${ev.t} — ${ev.topic}`));
  });
  // mobile daily view: swipe + prev/next
  const dayLabel = $("[data-day-label]");
  const curDay = () => Math.round(week.scrollLeft / (week.clientWidth + 10));
  const label = () => { const i = Math.min(6, Math.max(0, curDay())); dayLabel.textContent = i === todayIdx ? "Today" : fmtDate(new Date(monday.getTime() + i * DAY), { weekday: "long" }); };
  const goDay = (i) => { i = Math.min(6, Math.max(0, i)); week.scrollTo({ left: i * (week.clientWidth + 10), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  $("[data-day-prev]").addEventListener("click", () => goDay(curDay() - 1));
  $("[data-day-next]").addEventListener("click", () => goDay(curDay() + 1));
  week.addEventListener("scroll", () => requestAnimationFrame(label), { passive: true });
  if (week.scrollWidth > week.clientWidth + 20) week.scrollLeft = todayIdx * (week.clientWidth + 10);
  label();
  // .ics export (works with Google Calendar import)
  $("[data-ics]").addEventListener("click", () => {
    const pad = (n) => String(n).padStart(2, "0");
    const to24 = (t, ampm, start) => { let [hh, mm] = t.split(":").map(Number); const pm = /PM/.test(ampm); if (pm && hh < 12 && !(start && hh >= 8)) hh += 12; return [hh, mm]; };
    const stamp = (d, [hh, mm]) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hh)}${pad(mm)}00`;
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BrightPath//Student Schedule//EN"];
    SCHED.forEach((evs, i) => evs.forEach((ev, k) => {
      const d = new Date(monday.getTime() + i * DAY);
      const endHM = to24(ev.e.split(" ")[0], ev.e, false);
      const st = ev.s.split(":").map(Number); if (st[0] < 8) st[0] += 12;
      lines.push("BEGIN:VEVENT", `UID:bp-${i}-${k}-${monday.getTime()}@brightpath.example`, `DTSTAMP:${stamp(today, [0, 0])}`, `DTSTART:${stamp(d, st)}`, `DTEND:${stamp(d, endHM)}`, `SUMMARY:${ev.t} — ${ev.topic}`, `LOCATION:${ev.where}`, "END:VEVENT");
    }));
    lines.push("END:VCALENDAR");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar" }));
    a.download = "brightpath-week.ics"; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast("Week exported as brightpath-week.ics — import it in Google Calendar");
  });

  /* ---------- join next class countdown (45 min from page load, demo) ---------- */
  const joinAt = Date.now() + 45 * 6e4;
  const joinCd = $("[data-join-cd]");
  const tickJoin = () => {
    const ms = joinAt - Date.now();
    if (ms <= 0) { joinCd.textContent = "live now"; return; }
    const m = Math.floor(ms / 6e4), s = Math.floor((ms % 6e4) / 1e3);
    joinCd.textContent = m >= 1 ? `in ${m + (s > 0 ? 1 : 0)} min` : `in ${s}s`;
  };
  tickJoin(); setInterval(tickJoin, 1000);
  function joinDialog(name) {
    openDlg(`<h3>Join virtual class</h3><p class="lead">${esc(name)}</p>
      <dl class="kv"><dt>Instructor</dt><dd>${PEOPLE.chen.n}</dd><dt>Room</dt><dd>Room 204 / Zoom</dd><dt>Starts</dt><dd data-dlg-cd>${joinCd.textContent}</dd></dl>
      <p class="fb">The waiting room opens 10 minutes before class. This demo doesn't connect to a real meeting.</p>
      <button class="btn btn-primary" type="button" data-enter style="width:100%">${icon("i-video")}Enter waiting room</button>`);
    $("[data-enter]", body).addEventListener("click", () => { dlg.close(); toast("You're in the waiting room (demo)."); });
  }
  $("[data-join]").addEventListener("click", () => joinDialog("Data Structures — Lecture: Binary Trees"));

  /* ---------- assignments ---------- */
  function dueText(a) {
    const days = Math.round((startOfDay(a.due) - today) / DAY);
    if (a.due < now) return { s: `Overdue · was due ${fmtDate(a.due, { month: "short", day: "numeric" })}`, u: "#EF4444" };
    if (days <= 1) return { s: `Due ${days === 0 ? "today" : "tomorrow"}, 11:59 PM`, u: "#EF4444" };
    if (days <= 3) return { s: `Due in ${days} days`, u: "#F59E0B" };
    return { s: `Due in ${days} days`, u: "#10B981" };
  }
  function renderDue() {
    const list = ASSIGN.slice().sort((a, b) => (!!a.done - !!b.done) || ((a.due < now) === (b.due < now) ? a.due - b.due : a.due < now ? -1 : 1));
    $("[data-due]").innerHTML = list.map((a) => {
      const d = dueText(a), c = C[a.course];
      const right = a.done ? `<span class="state">${icon("i-check")} Submitted</span>` : a.action ? `<button class="btn ${a.action === "Submit" ? "btn-primary" : "btn-outline"} btn-sm" type="button" data-act="${a.id}">${a.action}</button>` : `<button class="btn btn-outline btn-sm" type="button" data-act="${a.id}">Not Started</button>`;
      return `<li class="${a.done ? "done" : a.due < now ? "overdue" : ""}" data-assign="${a.id}"><span class="urg" style="--u:${a.done ? "#D1D5DB" : d.u}" aria-hidden="true"></span><b>${esc(a.t)}</b>${right}<small><span class="when" style="--u2:${d.u === "#EF4444" ? "#DC2626" : "inherit"}">${a.done ? "Submitted" : d.s}</span> · <span class="cdot" style="--c:${c.c}"></span>${esc(c.t.replace("Introduction to ", ""))}</small></li>`;
    }).join("");
    syncCounts();
  }
  $("[data-due]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = ASSIGN.find((x) => x.id === b.dataset.act);
    if (a.action === "Submit") return submitDialog(a.id);
    a.action = "Continue"; renderDue();
    toast(`${a.t}: workspace opened — progress saves locally in this demo.`);
  });
  renderDue();

  function submitDialog(pre) {
    const opts = open().map((a) => `<option value="${a.id}"${a.id === pre ? " selected" : ""}>${esc(a.t)} — ${esc(dueText(a).s)}</option>`).join("");
    if (!opts) { toast("Nothing left to submit — you're all caught up!"); return; }
    openDlg(`<h3>Submit assignment</h3><p class="lead">Files stay in your browser; this demo uploads nothing.</p>
      <form class="form" data-sub novalidate>
        <label>Assignment<select name="a">${opts}</select></label>
        <label class="drop">${icon("i-upload")}<span data-file-l>Choose a file or drop it here</span><small class="muted">PDF, ZIP, .py or .ipynb up to 50 MB</small><input type="file" name="f" accept=".pdf,.zip,.py,.ipynb,.docx,.txt"></label>
        <label>Comment for instructor (optional)<textarea name="cm"></textarea></label>
        <p class="err" data-err role="alert"></p>
        <button class="btn btn-primary" type="submit">Submit</button>
      </form>`);
    const f = $("[data-sub]", body);
    f.f.addEventListener("change", () => { $("[data-file-l]", body).textContent = f.f.files[0] ? f.f.files[0].name : "Choose a file or drop it here"; });
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!f.f.files.length) { $("[data-err]", body).textContent = "Please attach your work before submitting."; return; }
      const a = ASSIGN.find((x) => x.id === f.a.value);
      a.done = true; renderDue();
      body.innerHTML = `<span class="ok">${icon("i-check")}</span><h3>Submitted!</h3><p class="lead">${esc(a.t)} · ${esc(f.f.files[0].name)} · ${fmtDate(new Date(), { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p><button class="btn btn-primary" type="button" data-done>Done</button>`;
      $("[data-done]", body).addEventListener("click", () => dlg.close());
    });
  }
  $("[data-submit]").addEventListener("click", () => submitDialog());

  /* ---------- grades ---------- */
  $("[data-grades]").innerHTML = `<div class="g-row head" role="row"><span role="columnheader">Assignment</span><span role="columnheader" class="sc">Score</span><span role="columnheader">Grade</span><span role="columnheader">Feedback</span><span role="columnheader" class="dt">Date</span></div>` +
    GRADES.map((g, i) => `<button class="g-row" type="button" role="row" data-grade="${i}"><b role="cell">${esc(g.t)}</b><span role="cell" class="sc">${g.s}/100</span><span role="cell"><span class="letter${g.l.startsWith("B") ? " b" : ""}">${g.l}</span></span><span role="cell" class="cmt">“${esc(g.cm)}”</span><span role="cell" class="dt">${g.d}</span></button>`).join("");
  $("[data-grades]").addEventListener("click", (e) => {
    const r = e.target.closest("[data-grade]"); if (!r) return;
    const g = GRADES[r.dataset.grade], c = C[g.course];
    openDlg(`<h3>${esc(g.t)}</h3><p class="lead">${esc(c.t)} · ${PEOPLE[c.who].n} · ${g.d}</p>
      <dl class="kv"><dt>Score</dt><dd>${g.s}/100</dd><dt>Letter grade</dt><dd>${g.l}</dd><dt>Course grade so far</dt><dd>${c.g}</dd></dl>
      <p class="fb"><b>Instructor feedback</b><br>${esc(g.full)}</p>
      <button class="btn btn-outline" type="button" data-reply>Reply to instructor</button>`);
    $("[data-reply]", body).addEventListener("click", () => { dlg.close(); toast(`Draft message to ${PEOPLE[c.who].n} started (demo).`); });
  });
  $("[data-all-grades]").addEventListener("click", () => {
    openDlg(`<h3>All grades — Spring 2026</h3><p class="lead">Current GPA 3.72 · +0.08 from last semester</p><table class="tbl"><thead><tr><th>Course</th><th>Progress</th><th>Grade</th></tr></thead><tbody>${COURSES.map((c) => `<tr><td>${c.code} · ${esc(c.t)}</td><td>${c.p}%</td><td><b>${c.g}</b></td></tr>`).join("")}</tbody></table>`);
  });

  /* ---------- study heatmap (sample data, seeded) ---------- */
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const start = new Date(monday.getTime() - 11 * 7 * DAY);
  const hours = [];
  for (let w = 0; w < 12; w++) for (let d = 0; d < 7; d++) {
    const date = new Date(start.getTime() + (w * 7 + d) * DAY);
    const r = rnd();
    const base = d >= 5 ? 1.1 : 2.1;
    hours.push({ date, h: date > today ? null : Math.max(0, Math.round((base + (r - 0.35) * 3) * 10) / 10) });
  }
  const shade = (v) => (v === null ? "" : v === 0 ? "#F3F4F6" : v < 1 ? "#E0E7FF" : v < 2 ? "#A5B4FC" : v < 3 ? "#818CF8" : "#4F46E5");
  const heat = $("[data-heat]");
  let html = '<span></span>';
  for (let w = 0; w < 12; w++) { const d = new Date(start.getTime() + w * 7 * DAY); html += `<span class="ml">${w === 0 || d.getDate() <= 7 ? fmtDate(d, { month: "short" }) : ""}</span>`; }
  ["Mon", "", "Wed", "", "Fri", "", "Sun"].forEach((lab, d) => {
    html += `<span class="dl">${lab}</span>`;
    for (let w = 0; w < 12; w++) {
      const x = hours[w * 7 + d], txt = `${fmtDate(x.date, { month: "short", day: "numeric" })}: ${x.h === null ? "upcoming" : `${x.h} hours studied`}`;
      html += `<button type="button" class="cell${x.h === null ? " future" : ""}" style="${x.h === null ? "" : `background:${shade(x.h)}`}" data-tip-text="${txt}" aria-label="${txt}"></button>`;
    }
  });
  heat.innerHTML = html;
  const tip = $("[data-tip]"), wrap = $(".heat-wrap");
  const showTip = (el) => {
    const r = el.getBoundingClientRect(), w = wrap.getBoundingClientRect();
    tip.textContent = el.dataset.tipText; tip.hidden = false;
    tip.style.left = `${r.left - w.left + wrap.scrollLeft + r.width / 2}px`; tip.style.top = `${r.top - w.top - 6}px`;
  };
  heat.addEventListener("mouseover", (e) => { const c = e.target.closest(".cell"); if (c) showTip(c); });
  heat.addEventListener("focusin", (e) => { const c = e.target.closest(".cell"); if (c) showTip(c); });
  heat.addEventListener("mouseleave", () => (tip.hidden = true));
  heat.addEventListener("focusout", () => (tip.hidden = true));
  const weekSum = (w) => hours.slice(w * 7, w * 7 + 7).reduce((a, x) => a + (x.h || 0), 0);
  const thisW = weekSum(11), lastW = weekSum(10);
  const avg = Array.from({ length: 11 }, (_, w) => weekSum(w)).reduce((a, b) => a + b, 0) / 11;
  $("[data-act-sum]").textContent = `This week: ${thisW.toFixed(1)} hrs · Last week: ${lastW.toFixed(1)} hrs · Average: ${avg.toFixed(1)} hrs/week`;
  const total = hours.reduce((a, x) => a + (x.h || 0), 0);
  const share = { ds: 0.3, ml: 0.27, tw: 0.14, db: 0.17, dm: 0.12 };
  const maxShare = Math.max(...Object.values(share));
  $("[data-bars]").innerHTML = COURSES.map((c) => `<div><span>${esc(c.t.replace("Introduction to ", ""))}</span><i style="--c:${c.c};width:${(share[c.id] / maxShare) * 100}%"></i><em>${(total * share[c.id]).toFixed(1)}h</em></div>`).join("");

  /* ---------- announcements ---------- */
  const ANN = [
    { ico: "i-mega", who: "chen", m: "Prof. Chen: Data Structures midterm moved to Oct 20", t: "2 hours ago", pin: true, unread: true },
    { ico: "i-note", who: "park", m: "Dr. Park: Office hours extended to 5 PM this week", t: "5 hours ago", unread: true },
    { ico: "i-party", who: null, m: "New: Study room booking now available in Resources", t: "1 day ago", unread: false }
  ];
  const renderAnn = () => {
    $("[data-ann]").innerHTML = ANN.map((a) => `<li class="${a.unread ? "unread" : ""}"><span class="a-ico"><span class="av">${a.who ? PEOPLE[a.who].f : `<svg viewBox="0 0 36 36"><rect width="36" height="36" fill="#4F46E5"/><path d="M27 15.5a1 1 0 0 0 0-1.8l-8.2-3.7a2 2 0 0 0-1.6 0L9 13.7a1 1 0 0 0 0 1.8l8.2 3.7a2 2 0 0 0 1.6 0z" fill="#fff"/></svg>`}</span>${icon(a.ico)}</span><div><p>${esc(a.m)}</p><small>${a.t}${a.pin ? `<span class="pinned">${icon("i-pin")}Pinned</span>` : ""}${a.unread ? '<span class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Unread</span>' : ""}</small></div></li>`).join("");
  };
  renderAnn();
  $("[data-ann-read]").addEventListener("click", () => { ANN.forEach((a) => (a.unread = false)); renderAnn(); toast("All announcements marked as read."); });

  /* ---------- top bar popovers ---------- */
  const NOTIF = [
    { i: "i-clip", m: "ML Problem Set 4 is due tomorrow at 11:59 PM", t: "1 hour ago", u: true },
    { i: "i-chart", m: "New grade posted: ML Quiz 3 — 88/100", t: "3 hours ago", u: true },
    { i: "i-mega", m: "Data Structures midterm moved to Oct 20", t: "2 hours ago", u: true }
  ];
  const MSGS = [{ who: "chen", m: "Great question in lecture today — I posted extra reading on AVL trees.", t: "20 min ago", u: true }];
  const renderNotif = () => {
    $("[data-notif-list]").innerHTML = NOTIF.map((n) => `<li class="${n.u ? "unread" : ""}">${icon(n.i)}<div>${esc(n.m)}<small>${n.t}</small></div></li>`).join("");
    const k = NOTIF.filter((n) => n.u).length, b = $("[data-notif-count]");
    b.textContent = k || ""; b.closest("button").setAttribute("aria-label", `Notifications, ${k} unread`);
  };
  const renderMsg = () => {
    $("[data-msg-list]").innerHTML = MSGS.map((n) => `<li class="${n.u ? "unread" : ""}"><span class="av av-sm">${PEOPLE[n.who].f}</span><div><b>${PEOPLE[n.who].n}</b><br>${esc(n.m)}<small>${n.t}</small></div></li>`).join("");
  };
  renderNotif(); renderMsg();
  $("[data-notif-read]").addEventListener("click", () => { NOTIF.forEach((n) => (n.u = false)); renderNotif(); });
  const closePops = (except) => $$("[data-pop]").forEach((b) => {
    if (b.dataset.pop === except) return;
    b.setAttribute("aria-expanded", "false"); $(`[data-pop-panel="${b.dataset.pop}"]`).hidden = true;
  });
  const openPop = (k) => {
    closePops(k);
    const b = $(`[data-pop="${k}"]`), p = $(`[data-pop-panel="${k}"]`), show = p.hidden;
    p.hidden = !show; b.setAttribute("aria-expanded", show);
    if (show && k === "msg") setTimeout(() => { MSGS.forEach((m) => (m.u = false)); const mb = $("[data-msg-count]"); mb.textContent = ""; mb.closest("button").setAttribute("aria-label", "Messages, 0 unread"); }, 600);
  };
  $$("[data-pop]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openPop(b.dataset.pop); }));
  document.addEventListener("click", (e) => { if (!e.target.closest(".pop, [data-pop]")) closePops(); if (!e.target.closest("[data-search]")) hideSearch(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closePops(); hideSearch(); closeSheet(); } });
  $$("[data-open-msg]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeSheet(); scrollTo({ top: 0 }); openPop("msg"); }));
  $("[data-signout]").addEventListener("click", () => { closePops(); toast("Signed out (demo) — this preview keeps you on the dashboard."); });

  /* ---------- search ---------- */
  const INDEX = [
    ...COURSES.map((c) => ({ t: c.t, k: "Course", go: () => courseDialog(c.id) })),
    ...ASSIGN.map((a) => ({ t: a.t, k: "Assignment", go: () => { location.hash = "#due"; $(`[data-assign="${a.id}"]`).scrollIntoView({ block: "center" }); } })),
    ...Object.values(PEOPLE).map((p) => ({ t: p.n, k: "Instructor", go: () => toast(`${p.n}: profile and office hours open in the full portal.`) })),
    ...["Priya Shah", "Marcus Lee", "Jenna Ortiz"].map((n) => ({ t: n, k: "Classmate", go: () => toast(`${n} is in your Data Structures study group.`) })),
    ...GRADES.map((g, i) => ({ t: g.t, k: "Grade", go: () => $(`[data-grade="${i}"]`).click() }))
  ];
  const sIn = $("[data-search-in]"), sRes = $("[data-search-res]");
  let hits = [], act = -1;
  function hideSearch() { sRes.hidden = true; sIn.setAttribute("aria-expanded", "false"); act = -1; }
  function renderSearch() {
    const q = sIn.value.trim().toLowerCase();
    if (!q) return hideSearch();
    hits = INDEX.filter((x) => x.t.toLowerCase().includes(q)).slice(0, 8);
    const mark = (t) => { const i = t.toLowerCase().indexOf(q); return `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`; };
    sRes.innerHTML = hits.length ? hits.map((x, i) => `<a href="#" role="option" data-hit="${i}" class="${i === act ? "act" : ""}">${mark(x.t)}<small>${x.k}</small></a>`).join("") : `<p class="muted">No results for “${esc(sIn.value.trim())}”</p>`;
    sRes.hidden = false; sIn.setAttribute("aria-expanded", "true");
  }
  sIn.addEventListener("input", () => { act = -1; renderSearch(); });
  sIn.addEventListener("keydown", (e) => {
    if (sRes.hidden) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); act = (act + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length; renderSearch(); }
    if (e.key === "Enter" && hits.length) { e.preventDefault(); pick(Math.max(0, act)); }
  });
  const pick = (i) => { const x = hits[i]; hideSearch(); sIn.value = ""; x.go(); };
  sRes.addEventListener("click", (e) => { const a = e.target.closest("[data-hit]"); if (!a) return; e.preventDefault(); pick(Number(a.dataset.hit)); });

  /* ---------- course detail ---------- */
  function courseDialog(id) {
    const c = C[id];
    const mods = ["Foundations", "Core concepts", "Applied practice", "Projects", "Review & final"];
    const done = Math.round((c.p / 100) * mods.length);
    openDlg(`<h3>${esc(c.t)}</h3><p class="lead">${c.code} · ${PEOPLE[c.who].n}</p>
      <dl class="kv"><dt>Progress</dt><dd>${c.p}% complete</dd><dt>Grade so far</dt><dd>${c.g}</dd><dt>Next class</dt><dd>${esc(c.next)}</dd></dl>
      <ul class="modules">${mods.map((m, i) => `<li class="${i < done ? "d" : i === done ? "n" : ""}">${icon(i < done ? "i-check" : "i-book")}Unit ${i + 1}: ${m}</li>`).join("")}</ul>
      <button class="btn btn-primary" type="button" data-resume style="width:100%">Continue Learning</button>`);
    $("[data-resume]", body).addEventListener("click", () => { dlg.close(); toast(`Resuming ${c.t} at Unit ${Math.min(mods.length, done + 1)} (demo).`); });
  }
  $("[data-courses]").addEventListener("click", (e) => {
    const cont = e.target.closest("[data-continue]");
    if (cont) { e.stopPropagation(); const c = C[cont.dataset.continue]; toast(`Resuming ${c.t} — ${c.p}% complete (demo).`); return; }
    const card = e.target.closest("[data-course]");
    if (card) { e.preventDefault(); courseDialog(card.dataset.course); }
  });

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { closePops(); body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("select, input, textarea, .btn", body); if (f) f.focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }
  $$("[data-soon]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); closePops(); closeSheet(); toast(`${a.dataset.soon} opens in the full BrightPath portal.`); }));
  $$("[data-support]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault(); closeSheet();
    openDlg(`<h3>Contact Support</h3><p class="lead">Typical reply time: under 1 hour on weekdays.</p><form class="form" data-sup novalidate><label>Topic<select name="t"><option>Course access</option><option>Technical issue</option><option>Grades</option><option>Other</option></select></label><label>Describe the issue<textarea name="m"></textarea></label><p class="err" data-err role="alert"></p><button class="btn btn-primary" type="submit">Send</button></form>`);
    $("[data-sup]", body).addEventListener("submit", (ev) => {
      ev.preventDefault();
      if (ev.target.m.value.trim().length < 5) { $("[data-err]", body).textContent = "Please describe the issue."; return; }
      body.innerHTML = `<span class="ok">${icon("i-check")}</span><h3>Ticket created</h3><p class="lead">Ticket #BP-${Math.floor(1000 + rnd() * 9000)} (demo — nothing is sent).</p>`;
    });
  }));

  /* ---------- sidebar + tab bar ---------- */
  const setActive = (sel, el) => { $$(sel).forEach((x) => { x.classList.toggle("on", x === el); if (x.matches(".side-nav a")) x.toggleAttribute("aria-current", x === el); }); };
  $$(".side-nav a[data-nav]").forEach((a) => a.addEventListener("click", () => setActive(".side-nav a", a)));
  $$(".tabbar [data-tab]").forEach((a) => a.addEventListener("click", () => setActive(".tabbar a, .tabbar button", a)));
  $("[data-collapse]").addEventListener("click", (e) => {
    const b = e.currentTarget;
    const narrow = matchMedia("(max-width: 1100px)").matches;
    const cls = narrow ? "expanded" : "collapsed";
    const on = document.body.classList.toggle(cls);
    const collapsedNow = narrow ? !on : on;
    b.setAttribute("aria-pressed", collapsedNow); b.setAttribute("aria-label", collapsedNow ? "Expand sidebar" : "Collapse sidebar");
  });
  const sheet = $("[data-sheet]"), more = $("[data-more]");
  function closeSheet() { sheet.hidden = true; more.setAttribute("aria-expanded", "false"); }
  more.addEventListener("click", () => { const show = sheet.hidden; sheet.hidden = !show; more.setAttribute("aria-expanded", show); });
  sheet.addEventListener("click", (e) => { if (e.target === sheet || e.target.closest("[data-sheet-link]")) closeSheet(); });
})();
