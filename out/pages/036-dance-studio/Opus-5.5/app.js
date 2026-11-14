(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const A = window.Art;

  $("[data-art=hero]").innerHTML = A.hero();
  $("[data-art=student]").innerHTML = A.student();

  // ---------- people ----------
  const LOOK = {
    Maya: { skin: 7, hair: 0, hairStyle: "bun", top: 6, bg: 5 },
    Carlos: { skin: 3, hair: 0, hairStyle: "short", top: 4, bg: 0, beard: true },
    Ava: { skin: 5, hair: 0, hairStyle: "curly", top: 1, bg: 1 },
    Kai: { skin: 1, hair: 0, hairStyle: "side", top: 2, bg: 3 },
    Jordan: { skin: 2, hair: 2, hairStyle: "buzz", top: 3, bg: 4 },
    Lena: { skin: 0, hair: 4, hairStyle: "long", top: 9, bg: 2 },
  };
  const av = (n, size = "") => `<span class="av ${size}">${A.portrait(LOOK[n], `Portrait of ${n}`)}</span>`;

  // ---------- styles ----------
  const STYLES = [
    ["hiphop", "Hip-Hop", "High energy, isolations, groove", "Beginner to Advanced"],
    ["contemporary", "Contemporary", "Fluidity, emotion, floor work", "Intermediate to Advanced"],
    ["ballet", "Ballet", "Technique, grace, foundation", "Beginner to Intermediate"],
    ["salsa", "Salsa & Latin", "Partner work, rhythm, heat", "All Levels"],
    ["breaking", "Breaking", "Power moves, freezes, flow", "Beginner to Advanced"],
  ];
  const STYLE_NAME = Object.fromEntries(STYLES.map((s) => [s[0], s[1]]));
  $("[data-styles]").innerHTML = STYLES.map(([k, n, d, lvl]) => `
    <button class="style" type="button" data-style="${k}" aria-label="${esc(n)}: ${esc(d)}. ${esc(lvl)}. Show classes">
      <span class="style-img">${A.style(k)}</span>
      <span class="style-txt"><span class="lvl">${esc(lvl)}</span><b>${esc(n)}</b><span>${esc(d)}</span></span>
    </button>`).join("");

  // ---------- schedule ----------
  // [time, class, style, room, instructor, level, spots]
  const BASE = [
    ["6:00 PM", "Hip-Hop Foundations", "hiphop", "Studio A", "Maya", "Beginner", 9],
    ["7:15 PM", "Contemporary Flow", "contemporary", "Studio B", "Ava", "Intermediate", 4],
    ["8:30 PM", "Salsa Social", "salsa", "Studio A", "Carlos", "All Levels", 12],
    ["9:00 PM", "Breaking Lab", "breaking", "Studio C", "Kai", "Open Level", 3],
  ];
  const WEEK = [
    [["12:00 PM", "Ballet Basics", "ballet", "Studio B", "Ava", "Beginner", 7], ...BASE],
    [["5:30 PM", "Breaking Foundations", "breaking", "Studio C", "Kai", "Beginner", 8], ["6:30 PM", "Hip-Hop Choreo", "hiphop", "Studio A", "Maya", "Intermediate", 2], ["7:30 PM", "Ballet Barre", "ballet", "Studio B", "Lena", "Beginner", 10], ["8:30 PM", "Salsa On1", "salsa", "Studio A", "Carlos", "All Levels", 6]],
    [...BASE, ["9:15 PM", "Ballet Stretch", "ballet", "Studio B", "Lena", "All Levels", 11]],
    [["6:00 PM", "Hip-Hop Foundations", "hiphop", "Studio A", "Jordan", "Beginner", 5], ["7:00 PM", "Contemporary Technique", "contemporary", "Studio B", "Ava", "Advanced", 3], ["8:00 PM", "Bachata Basics", "salsa", "Studio A", "Carlos", "All Levels", 14], ["9:00 PM", "Breaking Lab", "breaking", "Studio C", "Kai", "Open Level", 6]],
    [["6:00 PM", "Friday Hip-Hop Party", "hiphop", "Studio A", "Maya", "All Levels", 4], ["7:15 PM", "Contemporary Flow", "contemporary", "Studio B", "Ava", "Intermediate", 8], ["8:30 PM", "Salsa Social", "salsa", "Studio A", "Carlos", "All Levels", 20]],
    [["10:00 AM", "Ballet Basics", "ballet", "Studio B", "Lena", "Beginner", 6], ["11:30 AM", "Breaking Kids & Teens", "breaking", "Studio C", "Kai", "Beginner", 9], ["1:00 PM", "Hip-Hop Choreo", "hiphop", "Studio A", "Jordan", "Intermediate", 2], ["3:00 PM", "Contemporary Floor Work", "contemporary", "Studio B", "Ava", "Advanced", 7]],
    [["11:00 AM", "Sunday Stretch & Ballet", "ballet", "Studio B", "Lena", "All Levels", 12], ["12:30 PM", "Salsa Fundamentals", "salsa", "Studio A", "Carlos", "Beginner", 10], ["2:00 PM", "Open Breaking Session", "breaking", "Studio C", "Kai", "Open Level", 15]],
  ];
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const LVL = { Beginner: "green", Intermediate: "amber", Advanced: "red", "All Levels": "blue", "Open Level": "purple" };
  const today = (new Date().getDay() + 6) % 7;
  let day = today, filter = null;
  const booked = new Set();
  $("[data-days]").innerHTML = DAYS.map((d, i) => `<button class="day${i === today ? " today" : ""}" type="button" role="tab" data-day="${i}">${d}${i === today ? "<small>Today</small>" : ""}</button>`).join("");
  function renderSlots() {
    $$("[data-day]").forEach((b) => { const on = +b.dataset.day === day; b.setAttribute("aria-selected", String(on)); b.classList.toggle("on", on); });
    const rows = WEEK[day].map((r, i) => [r, i]).filter(([r]) => !filter || r[2] === filter);
    $("[data-filter-chip]").hidden = !filter;
    if (filter) $("[data-filter-label]").textContent = `Showing ${STYLE_NAME[filter]} classes`;
    $("[data-slots]").innerHTML = rows.length ? rows.map(([[t, n, st, room, who, lvl, spots], i]) => {
      const key = `${day}-${i}`, done = booked.has(key), left = spots - (done ? 1 : 0);
      return `<article class="slot">
        <span class="s-time">${t}</span>
        <div class="s-main"><b>${esc(n)}</b><span class="s-meta">${av(who, "sm")}with ${who} · ${icon("door")}${room}</span></div>
        <span class="lv ${LVL[lvl]}">${lvl}</span>
        <span class="spots${left < 5 ? " low" : ""}">${left} spot${left === 1 ? "" : "s"} left</span>
        ${done ? `<span class="s-booked">${icon("check")}Booked</span>` : `<button class="btn btn-rose s-book" type="button" data-book="${key}" data-label="${esc(`${n} · ${DAYS[day]} ${t} · ${room}`)}">Book</button>`}
      </article>`;
    }).join("") : `<p class="empty">No ${STYLE_NAME[filter]} classes on ${DAYS[day]}. Try another day.</p>`;
  }
  function setDay(d) { day = (d + 7) % 7; renderSlots(); $(`[data-day="${day}"]`).scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }
  $("[data-days]").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (b) setDay(+b.dataset.day); });
  $$("[data-step]").forEach((b) => b.addEventListener("click", () => setDay(day + +b.dataset.step)));
  let sx = null; const slotsEl = $("[data-slots]");
  slotsEl.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  slotsEl.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) setDay(day + (dx < 0 ? 1 : -1)); sx = null; });
  function setFilter(k) {
    filter = k;
    if (k && !WEEK[day].some((r) => r[2] === k)) day = WEEK.findIndex((rows) => rows.some((r) => r[2] === k));
    renderSlots();
    $("#schedule").scrollIntoView({ behavior: "smooth" });
  }
  $("[data-styles]").addEventListener("click", (e) => { const b = e.target.closest("[data-style]"); if (b) setFilter(b.dataset.style); });
  $$("[data-style-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); setFilter(a.dataset.styleLink); }));
  $("[data-clear-filter]").addEventListener("click", () => { filter = null; renderSlots(); });
  $("[data-full]").addEventListener("click", () => say("The full 7-day timetable with 60+ weekly classes lives on the schedule page (not part of this homepage demo)."));
  renderSlots();

  // ---------- instructors ----------
  const INS = [
    ["Maya", "Maya Chen", "Hip-Hop & Breaking", "15 years performing. Toured with Missy Elliott. Believes everyone has rhythm — you just need permission to find it."],
    ["Carlos", "Carlos Rivera", "Salsa & Latin", "Former competitive Latin ballroom champion. Trained in Havana. Makes partner work feel natural from day one."],
    ["Ava", "Ava Williams", "Contemporary & Ballet", "Juilliard-trained. Former Alvin Ailey company member. Focuses on emotional expression through movement."],
    ["Kai", "Kai Nakamura", "Breaking & Hip-Hop", "World-class b-boy. Red Bull BC One competitor. Teaches power moves with a focus on safety and progression."],
  ];
  $("[data-instructors]").innerHTML = INS.map(([k, n, st, bio]) => `
    <article class="ins">${av(k, "lg")}<div><h3>${n}</h3><p class="ins-st">${st}</p><p class="ins-bio">${bio}</p><button class="link" type="button" data-profile="${k}">View Profile ${icon("arrow")}</button></div></article>`).join("");
  $("[data-instructors]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-profile]"); if (!b) return;
    const k = b.dataset.profile, n = INS.find((x) => x[0] === k)[1], classes = WEEK.flatMap((rows, d) => rows.filter((r) => r[4] === k).map((r) => `${DAYS[d]} ${r[0]}`));
    say(`${n} teaches ${classes.length} classes this week: ${classes.slice(0, 4).join(", ")}${classes.length > 4 ? "…" : ""}`);
  });

  // ---------- gallery ----------
  const GAL = [["stage", "Student showcase", false, "tall"], ["sync", "Group class in sync", true, ""], ["freeze", "Breaking freeze", false, "sq"], ["partner", "Salsa partner work", true, ""], ["warmup", "Before class", false, ""], ["recital", "End-of-year recital", false, "tall"], ["rehearsal", "Community event rehearsal", true, ""], ["progress", "Week 1 vs week 12", true, ""]];
  $("[data-gallery]").innerHTML = GAL.map(([k, cap, vid, cls]) => `
    <figure class="g ${cls}">${vid ? `<button class="g-hit" type="button" data-reel="${esc(cap)}" aria-label="Play video: ${esc(cap)}">` : `<div class="g-hit">`}
      <span class="g-img">${A.gallery(k)}</span>
      <span class="g-ov">${vid ? `<span class="play">${icon("play")}Play</span>` : ""}<span class="g-cap">${esc(cap)}</span></span>
    ${vid ? "</button>" : "</div>"}</figure>`).join("");

  // ---------- testimonials ----------
  const TMS = [
    ["I hadn't danced since middle school and was terrified. Maya made me feel like I belonged from minute one. I've been coming 3x a week for 8 months now.", "Jessica T.", "Hip-hop student", { skin: 0, hair: 3, hairStyle: "bob", top: 0, bg: 5 }],
    ["I signed up for salsa to surprise my fiancée at our wedding. Carlos had me leading confidently in 6 weeks. She cried on the dance floor.", "Derek M.", "Salsa student", { skin: 5, hair: 0, hairStyle: "buzz", top: 7, bg: 3 }],
    ["As a former athlete recovering from knee surgery, contemporary dance gave me a way to move again that felt joyful instead of clinical.", "Priya K.", "Contemporary student", { skin: 3, hair: 0, hairStyle: "long", top: 1, bg: 1 }],
  ];
  $("[data-tms]").innerHTML = TMS.map(([q, n, c, look]) => `
    <figure class="tm"><p class="stars" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</p><blockquote>“${esc(q)}”</blockquote>
      <figcaption><span class="av md">${A.portrait(look, `Portrait of ${n}`)}</span><span><b>${n}</b><small>${c}</small></span></figcaption></figure>`).join("");

  // ---------- reel modal ----------
  const reel = $("[data-reel-dlg]"), stage = $("[data-reel-stage]");
  let t0 = 0, raf = 0, playing = false, elapsed = 0;
  function frame() {
    if (playing) { elapsed = (elapsed + (performance.now() - t0) / 1000) % 30; t0 = performance.now(); }
    $("[data-reel-time]").textContent = `0:${String(Math.floor(elapsed)).padStart(2, "0")} / 0:30`;
    $("[data-reel-prog]").style.width = `${(elapsed / 30) * 100}%`;
    raf = requestAnimationFrame(frame);
  }
  function setPlay(on) {
    playing = on; t0 = performance.now();
    stage.classList.toggle("paused", !on);
    const b = $("[data-reel-toggle]"); b.setAttribute("aria-label", on ? "Pause" : "Play"); b.innerHTML = icon(on ? "pause" : "play");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-reel]"); if (!b) return;
    stage.innerHTML = A.reel(); elapsed = 0;
    $("[data-reel-title]").textContent = `${b.dataset.reel || "Studio reel"} · animated illustration`;
    reel.showModal(); setPlay(true); cancelAnimationFrame(raf); frame();
  });
  $("[data-reel-toggle]").addEventListener("click", () => setPlay(!playing));
  reel.addEventListener("close", () => { setPlay(false); cancelAnimationFrame(raf); });

  // ---------- booking dialog (class slots + plans) ----------
  const bk = $("[data-book-dlg]"), bf = $("[data-book-form]");
  let bkKey = null;
  function openBook(kicker, title, desc, submit, key) {
    bkKey = key; bf.reset(); $("[data-bk-done]").hidden = true; $("[data-bk-err]").textContent = "";
    $("[data-bk-kicker]").textContent = kicker; $("[data-bk-title]").textContent = title; $("[data-bk-desc]").textContent = desc; $("[data-bk-submit]").textContent = submit;
    bk.showModal();
  }
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-book]"); if (s) openBook("Reserve a spot", s.dataset.label, "Members book free. First-timers can use their free trial here.", "Book My Spot", s.dataset.book);
    const p = e.target.closest("[data-plan]"); if (p) openBook("Checkout", p.dataset.plan, "We'll email a secure payment link. Student & military discount applies automatically with a valid ID.", "Continue", null);
  });
  bf.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = bf.elements.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { $("[data-bk-err]").textContent = "Please enter a valid email."; return; }
    $("[data-bk-err]").textContent = "";
    if (bkKey) { booked.add(bkKey); renderSlots(); }
    $("[data-bk-text]").textContent = `${$("[data-bk-title]").textContent}. Confirmation would go to ${em}. (Demo: nothing was sent or charged.)`;
    $("[data-bk-done]").hidden = false;
  });
  $$(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- trial form ----------
  const form = $("[data-form]");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (miss.length) { $("[data-err]").textContent = `Please add ${miss.join(" and ")}.`; return; }
    $("[data-err]").textContent = "";
    const st = f.style.value, first = f.name.value.trim().split(/\s+/)[0];
    const k = Object.keys(STYLE_NAME).find((x) => STYLE_NAME[x] === st);
    const next = k ? WEEK.flatMap((rows, d) => rows.filter((r) => r[2] === k).map((r) => `${DAYS[d]} ${r[0]} ${r[1]}`))[0] : "any beginner-friendly class this week";
    $("[data-done-text]").textContent = `${first}, your free ${st === "Not Sure Yet" ? "class" : st + " class"} is held. We suggest ${next}. (${f.exp.value}; demo, nothing was sent.)`;
    $("[data-done]").hidden = false;
  });
  $("[data-reset]").addEventListener("click", () => { form.reset(); $("[data-done]").hidden = true; form.elements.name.focus(); });

  // ---------- nav ----------
  const nav = $("[data-nav]"), menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  const closeMenu = () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); nav.classList.remove("open"); };
  mbtn.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; nav.classList.toggle("open", open); mbtn.setAttribute("aria-expanded", String(open)); mbtn.innerHTML = icon(open ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  function onScroll() {
    nav.classList.toggle("solid", scrollY > 40);
    const heroOut = $(".hero").getBoundingClientRect().bottom < 0, trial = $("#trial").getBoundingClientRect();
    document.body.classList.toggle("show-bar", heroOut && !(trial.top < innerHeight && trial.bottom > 0));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3600); }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); say(`${s.dataset.soon} is on the full site; this demo is the homepage.`); } });

  window.MuseRhythm = { day: () => day, filter: () => filter, today, playing: () => playing, elapsed: () => elapsed };
})();
