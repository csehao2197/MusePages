(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const A = window.Art;
  const TRAINERS = ["Coach Leah Ortiz", "Coach Dante Brooks", "Coach Mei Tanaka", "Coach Sam Patel"];

  // goal, gender, ageBand, time, program, date (YYYY-MM), likes, magnitude (lbs changed)
  const S = [
    { id: "sarah", name: "Sarah M.", full: "Sarah Mitchell", age: 34, city: "Austin, TX", occ: "Elementary school teacher", since: "March 2025", goal: "Weight Loss", gender: "Female", time: "6 months", months: 8, program: "Personal Training", also: "Nutrition Coaching", date: "2026-10", likes: 1840, mag: 65, stat: "Lost 65 lbs in 8 months", w: [218, 153], bf: [38, 22], waist: [41, 30], hips: [48, 38], lift: ["Goblet squat", 25, 70], look: { skin: 2, hair: 0, style: "long", g: "f", top: "#F97316", bottom: "#1F2937", bg: 0 }, f: [1, 0.25], mu: [0.2, 0.45], badge: "Featured", quote: "I never thought I'd wear a swimsuit again. Now I can't wait for summer!", why: "Chasing my students at recess left me winded. I wanted to keep up with them — and with my own kids.", trainer: 0 },
    { id: "marcus", name: "Marcus T.", age: 29, city: "Denver, CO", occ: "Software engineer", since: "January 2026", goal: "Muscle Gain", gender: "Male", time: "6 months", months: 6, program: "Personal Training", date: "2026-09", likes: 1320, mag: 18, gain: true, stat: "Gained 18 lbs of muscle in 6 months", w: [152, 170], bf: [16, 14], waist: [31, 31], hips: [36, 37], lift: ["Bench press", 115, 205], look: { skin: 5, hair: 0, style: "buzz", g: "m", top: "#0EA5E9", bottom: "#334155", bg: 1 }, f: [0.15, 0.2], mu: [0.1, 0.85], badge: "Top rated", quote: "I stopped hiding in hoodies. Showing up four days a week built more than muscle.", why: "Years of desk work left me weak and stiff. I wanted to feel strong in my own body.", trainer: 1 },
    { id: "elena", name: "Elena R.", age: 52, city: "San Diego, CA", occ: "Nurse", since: "June 2025", goal: "Overall Health", gender: "Female", time: "1 year+", months: 14, program: "Group Classes", date: "2026-08", likes: 990, mag: 32, stat: "Lost 32 lbs and lowered blood pressure", w: [186, 154], bf: [36, 27], waist: [37, 31], hips: [45, 40], lift: ["Deadlift", 45, 135], look: { skin: 3, hair: 5, style: "bob", g: "f", top: "#7C3AED", bottom: "#1E293B", bg: 2 }, f: [0.75, 0.35], mu: [0.2, 0.45], badge: "1-year club", quote: "My doctor took me off one of my blood pressure meds. Group classes made it fun.", why: "Twelve-hour shifts and my health came last. A scare at my annual checkup changed that.", trainer: 2 },
    { id: "james", name: "James K.", age: 41, city: "Chicago, IL", occ: "Firefighter", since: "February 2026", goal: "Weight Loss", gender: "Male", time: "6 months", months: 6, program: "Nutrition Coaching", date: "2026-10", likes: 1510, mag: 40, stat: "Lost 40 lbs in 6 months", w: [252, 212], bf: [32, 22], waist: [44, 37], hips: [46, 41], lift: ["Push-ups (set)", 8, 35], look: { skin: 0, hair: 2, style: "short", g: "m", top: "#DC2626", bottom: "#1F2937", bg: 0 }, f: [0.95, 0.45], mu: [0.35, 0.55], badge: "Top rated", quote: "Nutrition was the missing piece. I trained hard for years and never changed until I fixed my plate.", why: "I need to carry people out of buildings. I wanted my fitness to match the job.", trainer: 3 },
    { id: "priya", name: "Priya S.", age: 27, city: "Seattle, WA", occ: "UX designer", since: "July 2026", goal: "Toning", gender: "Female", time: "3 months", months: 3, program: "Group Classes", date: "2026-10", likes: 760, mag: 9, stat: "Dropped 9 lbs and 3 inches in 3 months", w: [146, 137], bf: [29, 23], waist: [30, 27], hips: [39, 37], lift: ["Hip thrust", 65, 155], look: { skin: 3, hair: 0, style: "bun", g: "f", top: "#EC4899", bottom: "#334155", bg: 4 }, f: [0.45, 0.25], mu: [0.25, 0.55], badge: "Rising star", quote: "Ninety days of classes with the same crew. I finally love lifting.", why: "I wanted to feel strong, not just thinner, before my wedding.", trainer: 2 },
    { id: "robert", name: "Robert H.", age: 63, city: "Phoenix, AZ", occ: "Retired engineer", since: "May 2025", goal: "Overall Health", gender: "Male", time: "1 year+", months: 16, program: "Personal Training", date: "2026-07", likes: 1120, mag: 28, stat: "Lost 28 lbs and reversed pre-diabetes", w: [214, 186], bf: [31, 24], waist: [42, 37], hips: [44, 41], lift: ["Leg press", 90, 230], look: { skin: 1, hair: 5, style: "short", g: "m", top: "#10B981", bottom: "#374151", bg: 3 }, f: [0.8, 0.45], mu: [0.15, 0.35], badge: "Health win", quote: "At 63 I'm stronger than at 45. My grandkids can't believe I do farmer carries.", why: "My A1C was creeping up and I didn't want to start medication.", trainer: 0 },
    { id: "aisha", name: "Aisha B.", age: 36, city: "Atlanta, GA", occ: "Accountant", since: "September 2025", goal: "Weight Loss", gender: "Female", time: "1 year+", months: 12, program: "Nutrition Coaching", date: "2026-09", likes: 1430, mag: 54, stat: "Lost 54 lbs in 12 months", w: [231, 177], bf: [41, 29], waist: [42, 33], hips: [52, 43], lift: ["Row", 30, 85], look: { skin: 5, hair: 0, style: "long", g: "f", top: "#F59E0B", bottom: "#1F2937", bg: 5 }, f: [1, 0.45], mu: [0.2, 0.4], badge: "1-year club", quote: "Meal prep Sundays and a coach who answered every question — that's the whole secret.", why: "After my second child I didn't recognize myself in photos.", trainer: 3 },
    { id: "diego", name: "Diego L.", age: 24, city: "Miami, FL", occ: "Barista", since: "August 2026", goal: "Muscle Gain", gender: "Male", time: "3 months", months: 3, program: "Group Classes", date: "2026-11", likes: 610, mag: 10, gain: true, stat: "Gained 10 lbs of muscle in 3 months", w: [138, 148], bf: [12, 12], waist: [29, 29], hips: [34, 35], lift: ["Pull-ups", 1, 9], look: { skin: 3, hair: 0, style: "short", g: "m", top: "#6366F1", bottom: "#1F2937", bg: 1 }, f: [0.05, 0.1], mu: [0.05, 0.6], badge: "Rising star", quote: "Went from zero pull-ups to nine. The strength class coaches never let me skip legs, either.", why: "I was always the skinny guy. I wanted to fill out and feel athletic.", trainer: 1 },
    { id: "linda", name: "Linda P.", age: 58, city: "Portland, OR", occ: "Librarian", since: "April 2026", goal: "Toning", gender: "Female", time: "6 months", months: 6, program: "Personal Training", date: "2026-10", likes: 870, mag: 16, stat: "Lost 16 lbs and 4% body fat in 6 months", w: [168, 152], bf: [34, 30], waist: [35, 32], hips: [43, 41], lift: ["Squat", 0, 95], look: { skin: 0, hair: 4, style: "bob", g: "f", top: "#14B8A6", bottom: "#334155", bg: 3 }, f: [0.6, 0.35], mu: [0.15, 0.45], badge: "Health win", quote: "Strength training at 58 was the best gift I've given myself. My back pain is gone.", why: "Osteopenia runs in my family. My doctor said lift heavy things.", trainer: 2 },
    { id: "kevin", name: "Kevin W.", age: 47, city: "Dallas, TX", occ: "Sales manager", since: "October 2025", goal: "Weight Loss", gender: "Male", time: "1 year+", months: 12, program: "Group Classes", date: "2026-08", likes: 1260, mag: 47, stat: "Lost 47 lbs in 12 months", w: [261, 214], bf: [34, 24], waist: [46, 38], hips: [47, 42], lift: ["Kettlebell swing", 26, 53], look: { skin: 4, hair: 0, style: "buzz", g: "m", top: "#F97316", bottom: "#1F2937", bg: 0 }, f: [1, 0.5], mu: [0.25, 0.45], badge: "1-year club", quote: "The 6 AM crew became my accountability. Nobody lets you sleep in.", why: "Traveling for work, I lived on airport food. I wanted my energy back.", trainer: 1 },
    { id: "mei", name: "Mei C.", age: 31, city: "San Jose, CA", occ: "Physical therapist", since: "June 2026", goal: "Muscle Gain", gender: "Female", time: "6 months", months: 5, program: "Personal Training", date: "2026-11", likes: 940, mag: 7, gain: true, stat: "Gained 7 lbs of lean muscle in 5 months", w: [118, 125], bf: [24, 21], waist: [26, 26], hips: [34, 36], lift: ["Deadlift", 95, 205], look: { skin: 0, hair: 0, style: "bun", g: "f", top: "#0EA5E9", bottom: "#1F2937", bg: 1 }, f: [0.2, 0.2], mu: [0.15, 0.75], badge: "Top rated", quote: "I tell patients to strength train. Now I can say I do it too — and deadlift over 200.", why: "I wanted to practice what I preach to patients.", trainer: 0 },
    { id: "tom", name: "Tom G.", age: 66, city: "Tampa, FL", occ: "Retired pilot", since: "February 2026", goal: "Overall Health", gender: "Male", time: "6 months", months: 7, program: "Nutrition Coaching", date: "2026-09", likes: 580, mag: 21, stat: "Lost 21 lbs and halved his resting knee pain", w: [204, 183], bf: [30, 25], waist: [41, 37], hips: [43, 41], lift: ["Step-ups", 0, 25], look: { skin: 1, hair: 5, style: "short", g: "m", top: "#64748B", bottom: "#1F2937", bg: 5 }, f: [0.75, 0.45], mu: [0.15, 0.3], badge: "Health win", quote: "I can walk 18 holes again without stopping. Food was most of it.", why: "Knee pain was taking golf and walks with my wife away.", trainer: 3 },
  ];
  S.forEach((s) => { s.ageBand = s.age <= 30 ? "18-30" : s.age <= 45 ? "31-45" : s.age <= 60 ? "46-60" : "60+"; });
  const byId = Object.fromEntries(S.map((s) => [s.id, s]));
  const fig = (s, which) => A.figure(s.look, s.f[which], s.mu[which], `${s.name} ${which ? "after" : "before"} (illustration)`, which ? "after" : "before");

  // ---------- before/after slider component ----------
  function slider(el, s, start = 50) {
    el.classList.add("ba");
    el.innerHTML = `<div class="ba-img ba-before">${fig(s, 0)}</div><div class="ba-img ba-after">${fig(s, 1)}</div><div class="ba-handle" aria-hidden="true"><span>${icon("arrows")}</span></div><input class="ba-range" type="range" min="0" max="100" value="${start}" aria-label="${esc(el.dataset.baLabel || `Compare ${s.name} before and after`)}">`;
    const range = el.querySelector(".ba-range");
    const set = (v) => { el.style.setProperty("--pos", `${v}%`); range.value = v; el.dataset.pos = v; };
    set(start);
    range.addEventListener("input", () => set(+range.value));
    let drag = false;
    const move = (e) => { const r = el.getBoundingClientRect(); set(Math.max(0, Math.min(100, Math.round(((e.clientX - r.left) / r.width) * 100)))); };
    el.addEventListener("pointerdown", (e) => { drag = true; el.setPointerCapture(e.pointerId); move(e); });
    el.addEventListener("pointermove", (e) => { if (drag) move(e); });
    el.addEventListener("pointerup", () => { drag = false; });
    el.addEventListener("pointercancel", () => { drag = false; });
    return set;
  }
  $$("[data-ba]").forEach((el) => slider(el, S[+el.dataset.ba]));

  // ---------- gallery ----------
  const filt = { goal: "", gender: "", age: "", time: "", program: "" };
  let q = "", sort = "recent";
  function list() {
    let l = S.filter((s) => (!filt.goal || s.goal === filt.goal) && (!filt.gender || s.gender === filt.gender) && (!filt.age || s.ageBand === filt.age) && (!filt.time || s.time === filt.time) && (!filt.program || s.program === filt.program || s.also === filt.program)
      && (!q || `${s.name} ${s.city} ${s.goal} ${s.stat} ${s.occ}`.toLowerCase().includes(q)));
    l = l.slice().sort((a, b) => sort === "popular" ? b.likes - a.likes : sort === "biggest" ? b.mag - a.mag : b.date.localeCompare(a.date) || b.likes - a.likes);
    return l;
  }
  function renderGrid() {
    const l = list();
    $("[data-grid]").innerHTML = l.map((s) => `
      <article class="card" data-card="${s.id}">
        <div class="flip" data-state="before">
          <div class="f-img f-before">${fig(s, 0)}</div><div class="f-img f-after">${fig(s, 1)}</div>
          <div class="seg" role="group" aria-label="Show photo"><button type="button" aria-pressed="true" data-show="before">Before</button><button type="button" aria-pressed="false" data-show="after">After</button></div>
          <span class="badge">${icon("star")}${s.badge}</span>
        </div>
        <div class="c-body"><h3>${s.name}, ${s.age}</h3><p class="c-stat">${s.stat}</p><p class="c-meta">${s.goal} · ${s.program} · ${icon("heart")}${s.likes.toLocaleString("en-US")}</p>
        <button class="btn btn-outline" type="button" data-story="${s.id}">View Story</button></div>
      </article>`).join("");
    $("[data-count]").textContent = `${l.length} of ${S.length} stories`;
    $("[data-empty]").hidden = l.length > 0;
  }
  $("[data-filters]").addEventListener("change", (e) => { const t = e.target; if (t.dataset.f !== undefined) filt[t.dataset.f] = t.value; if (t.matches("[data-sort]")) sort = t.value; renderGrid(); });
  $("[data-q]").addEventListener("input", (e) => { q = e.target.value.trim().toLowerCase(); renderGrid(); });
  $$("[data-reset]").forEach((b) => b.addEventListener("click", () => { Object.keys(filt).forEach((k) => { filt[k] = ""; }); q = ""; sort = "recent"; $$("[data-filters] select").forEach((s) => { s.selectedIndex = 0; }); $("[data-q]").value = ""; renderGrid(); }));
  function setFlip(card, state) { const f = card.querySelector(".flip"); f.dataset.state = state; $$("[data-show]", f).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.show === state))); }
  const grid = $("[data-grid]");
  grid.addEventListener("click", (e) => { const b = e.target.closest("[data-show]"); if (b) setFlip(b.closest(".card"), b.dataset.show); });
  let sx = null;
  grid.addEventListener("touchstart", (e) => { if (e.target.closest(".flip")) sx = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx, card = e.target.closest(".card"); if (card && Math.abs(dx) > 40) setFlip(card, dx < 0 ? "after" : "before"); sx = null; });
  renderGrid();

  // ---------- story view ----------
  const sd = $("[data-story-dlg]");
  function openStory(id) {
    const s = byId[id], tr = TRAINERS[s.trainer], g = s.gain;
    const d = (a, b, u = "") => `${a}${u} → ${b}${u}`;
    const monthsShown = [0, Math.round(s.months / 3), Math.round((2 * s.months) / 3), s.months];
    const prog = monthsShown.map((m, i) => { const k = i / 3; return { m, f: s.f[0] + (s.f[1] - s.f[0]) * k, mu: s.mu[0] + (s.mu[1] - s.mu[0]) * k }; });
    $("[data-story-body]").innerHTML = `
      <header class="sb-head"><p class="kicker">${s.goal} · ${s.months} months</p><h2 id="story-name">${esc(s.full || s.name)}</h2>
        <ul class="profile"><li><b>Age</b>${s.age}</li><li><b>Occupation</b>${s.occ}</li><li><b>Location</b>${s.city}</li><li><b>Member since</b>${s.since}</li><li><b>Program</b>${s.program}${s.also ? ` + ${s.also}` : ""}</li></ul></header>
      <div class="sb-slider" data-sb-slider></div>
      <section><h3>The journey</h3>
        <div class="two"><div><h4>Starting point</h4><p>${s.w[0]} lbs · ${s.bf[0]}% body fat · ${g ? "new to lifting, low strength" : "low energy, couldn't run a mile"}. Biggest challenge: ${s.gain ? "eating enough and staying consistent" : "late-night snacking and an unpredictable schedule"}.</p></div>
        <div><h4>Why I decided to change</h4><p>${esc(s.why)}</p></div></div>
        <h4>Goals set</h4><p>${g ? `Add ${s.mag} lbs of lean mass` : `Lose ${s.mag} lbs`} and ${s.lift[0].toLowerCase()} ${s.lift[2]}${/\(set\)|ups/i.test(s.lift[0]) ? " reps" : " lbs"}.</p>
        <ol class="tl">${monthsShown.map((m, i) => `<li><b>${m === 0 ? "Start" : `Month ${m}`}</b><span>${i === 0 ? "Assessment and first plan" : i === 3 ? "Goal reached, maintenance plan" : `${Math.round(((i / 3) * (s.w[1] - s.w[0])) * 10) / 10 > 0 ? "+" : ""}${Math.round((i / 3) * (s.w[1] - s.w[0]))} lbs, new PR on ${s.lift[0].toLowerCase()}`}</span></li>`).join("")}</ol></section>
      <section><h3>Photos</h3><div class="prog-photos">${prog.map((p, i) => `<figure>${A.figure(s.look, p.f, p.mu, `${s.name} at ${p.m === 0 ? "start" : `month ${p.m}`} (illustration)`, i === 0 ? "before" : i === 3 ? "after" : "")}<figcaption>${p.m === 0 ? "Start" : `Month ${p.m}`}</figcaption></figure>`).join("")}</div></section>
      <section><h3>Stats breakdown</h3><ul class="statgrid">
        <li><b>${d(s.w[0], s.w[1], " lbs")}</b><span>Body weight</span></li><li><b>${d(s.bf[0], s.bf[1], "%")}</b><span>Body fat</span></li>
        <li><b>${d(s.waist[0], s.waist[1], "″")}</b><span>Waist</span></li><li><b>${d(s.hips[0], s.hips[1], "″")}</b><span>Hips</span></li>
        <li><b>${d(s.lift[1], s.lift[2], /\(set\)|ups/i.test(s.lift[0]) ? " reps" : " lbs")}</b><span>${s.lift[0]}</span></li><li><b>${s.gain ? "+2" : "−14"} bpm</b><span>Resting heart rate ${s.gain ? "(unchanged range)" : "drop"}</span></li></ul></section>
      <section class="two"><div><h3>The program</h3><ul class="plain"><li><b>Training:</b> ${s.program}${s.goal === "Muscle Gain" ? ", hypertrophy blocks" : ", strength + conditioning"}</li><li><b>Frequency:</b> ${s.program === "Group Classes" ? "4-5 classes" : "3 sessions + 1 solo workout"} per week</li><li><b>Nutrition:</b> ${s.gain ? "Calorie surplus, 1 g protein per lb" : "Moderate deficit, high-protein meal prep"}</li><li><b>Support:</b> weekly check-ins${s.also || s.program === "Nutrition Coaching" ? " and coach messaging" : ""}</li></ul></div>
        <div><h3>In their own words</h3><blockquote>“${esc(s.quote)}”</blockquote><ul class="plain"><li><b>Favorite exercise:</b> ${s.lift[0]}</li><li><b>Biggest challenge:</b> ${s.gain ? "Eating enough on busy days" : "Weekends and social dinners"}</li><li><b>Advice:</b> “Track the wins that aren't on the scale.”</li></ul></div></section>
      <section class="trainer"><span class="t-face">${A.coachFace(s.trainer, `Portrait of ${tr}`)}</span><div><h3>Trainer's note — ${tr}</h3><p>“${s.name.split(" ")[0]} never missed a check-in. What made the difference was consistency over intensity: we built habits first, then progressed the ${s.lift[0].toLowerCase()} every two weeks.”</p></div></section>
      <div class="sb-foot"><button class="btn btn-ghost" type="button" data-share="${s.id}">${icon("share")}Share story</button><button class="btn btn-primary" type="button" data-consult>Start your transformation</button></div>`;
    slider($("[data-sb-slider]"), s, 50);
    if (!sd.open) sd.showModal();
    sd.scrollTop = 0;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-story]"); if (b) openStory(b.dataset.story); });

  // ---------- videos ----------
  const VIDS = [["sarah", "Sarah's 8-month reveal", "2:14", "“I walked in at 218 pounds and terrified…”"], ["james", "Firefighter fit: James", "3:02", "“My shift partners noticed before I did.”"], ["elena", "Nurse to 5K finisher", "2:41", "“Group class became my second family.”"], ["mei", "Deadlift 205: Mei's story", "1:58", "“I tell my patients to lift. Now I do too.”"]];
  $("[data-videos]").innerHTML = VIDS.map(([id, t, len, q], i) => `<button class="vid" type="button" data-video="${i}"><span class="v-thumb">${fig(byId[id], 1)}<span class="v-play">${icon("play")}</span><span class="v-len">${len}</span></span><b>${t}</b><span class="v-q">${q}</span></button>`).join("");
  const vd = $("[data-video-dlg]");
  let vTimer = 0, vT = 0, vPlaying = false, vLen = 0;
  function vTick() { if (!vPlaying) return; vT += 0.25; if (vT >= vLen) vT = 0; const ph = (vT % 6) / 6; const k = ph < 0.4 ? 0 : ph < 0.6 ? (ph - 0.4) / 0.2 : 1; $("[data-v-stage]").style.setProperty("--k", k.toFixed(2)); $("[data-v-time]").textContent = `${Math.floor(vT / 60)}:${String(Math.floor(vT % 60)).padStart(2, "0")} / ${VIDS[vd.dataset.i][2]}`; }
  function vSet(on) { vPlaying = on; const b = $("[data-v-toggle]"); b.innerHTML = icon(on ? "pause" : "play"); b.setAttribute("aria-label", on ? "Pause" : "Play"); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-video]"); if (!b) return;
    const [id, t, len, q] = VIDS[+b.dataset.video], s = byId[id];
    vd.dataset.i = b.dataset.video; vLen = len.split(":").reduce((m, x) => m * 60 + +x, 0); vT = 0;
    $("[data-v-stage]").innerHTML = `<div class="v-b">${fig(s, 0)}</div><div class="v-a">${fig(s, 1)}</div><span class="v-badge">Animated illustration</span>`;
    $("[data-v-title]").textContent = t; $("[data-v-cap]").textContent = `${q} — ${s.name}, ${s.stat.toLowerCase()}.`;
    vd.showModal(); vSet(true); clearInterval(vTimer); vTimer = setInterval(vTick, 250); vTick();
  });
  $("[data-v-toggle]").addEventListener("click", () => vSet(!vPlaying));
  vd.addEventListener("close", () => { vSet(false); clearInterval(vTimer); });

  // ---------- programs ----------
  const PROGS = [["Weight Loss Program", "scale", "Avg −31 lbs", "212 members", "Weight Loss", ""], ["Strength & Conditioning", "dumbbell", "Avg +45% strength", "98 members", "Muscle Gain", ""], ["Group Fitness", "users", "Avg −19 lbs", "143 members", "", "Group Classes"], ["Personal Training", "user", "87% hit their goal", "121 members", "", "Personal Training"], ["Nutrition Coaching", "leaf", "Avg −12% body fat", "176 members", "", "Nutrition Coaching"]];
  $("[data-progs]").innerHTML = PROGS.map(([n, ic, stat, cnt, goal, prog]) => `<button class="prog" type="button" data-goal="${goal}" data-prog="${prog}"><span class="p-ico">${icon(ic)}</span><b>${n}</b><span class="p-stat">${stat}</span><span class="p-cnt">${cnt}</span><span class="p-go">See stories ${icon("right")}</span></button>`).join("");
  $("[data-progs]").addEventListener("click", (e) => {
    const b = e.target.closest(".prog"); if (!b) return;
    Object.keys(filt).forEach((k) => { filt[k] = ""; }); filt.goal = b.dataset.goal; filt.program = b.dataset.prog;
    $$("[data-filters] [data-f]").forEach((s) => { s.value = filt[s.dataset.f]; });
    renderGrid(); $("#gallery").scrollIntoView({ behavior: "smooth" });
  });

  // ---------- big stats ----------
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; io.disconnect(); $$("[data-n]").forEach((b) => { const end = +b.dataset.n, t0 = performance.now(); const st = (now) => { const k = still ? 1 : Math.min(1, (now - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - k, 3))); b.textContent = `${v.toLocaleString("en-US")}${b.dataset.s}`; if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }); }), { threshold: 0.3 });
  io.observe($("[data-bigstats]"));

  // ---------- comparison gallery ----------
  const CP = ["james", "aisha", "marcus", "linda", "kevin"].map((id) => byId[id]);
  let cpi = 0, setCp = null, auto = 0, autoT = 0;
  $("[data-dots]").innerHTML = CP.map((s, i) => `<button type="button" aria-label="Show ${s.name}" data-dot="${i}"></button>`).join("");
  function renderCp() {
    const s = CP[cpi];
    setCp = slider($("[data-cp-slider]"), s, 50);
    $("[data-cp-info]").innerHTML = `<h3>${s.name}, ${s.age}</h3><p class="c-stat">${s.stat}</p><blockquote>“${esc(s.quote)}”</blockquote><div class="cp-btns"><button class="btn btn-outline" type="button" data-story="${s.id}">View Story</button><button class="btn btn-ghost" type="button" data-share="${s.id}">${icon("share")}Share</button></div>`;
    $$("[data-dot]").forEach((d, i) => d.setAttribute("aria-current", String(i === cpi)));
  }
  function goCp(d) { cpi = (cpi + d + CP.length) % CP.length; renderCp(); }
  $$("[data-cp]").forEach((b) => b.addEventListener("click", () => goCp(+b.dataset.cp)));
  $("[data-dots]").addEventListener("click", (e) => { const d = e.target.closest("[data-dot]"); if (d) { cpi = +d.dataset.dot; renderCp(); } });
  const ap = $("[data-autoplay]");
  ap.addEventListener("click", () => {
    const on = ap.getAttribute("aria-pressed") !== "true";
    ap.setAttribute("aria-pressed", String(on)); ap.innerHTML = `${icon(on ? "pause" : "play")}${on ? "Pause" : "Auto-play"}`;
    clearInterval(auto);
    if (on) { autoT = 0; auto = setInterval(() => { autoT += 1; const ph = autoT % 40; setCp(ph < 20 ? Math.round(ph * 5) : Math.round((40 - ph) * 5)); if (autoT % 40 === 39) goCp(1); }, 100); }
  });
  renderCp();

  // ---------- share ----------
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-share]"); if (!b) return;
    const s = byId[b.dataset.share], url = `${location.href.split("#")[0]}#story-${s.id}`;
    try { if (navigator.share) { await navigator.share({ title: `${s.name}: ${s.stat}`, url }); return; } await navigator.clipboard.writeText(url); say(`Link to ${s.name}'s story copied.`); } catch { say(`Share link: ${url}`); }
  });
  if (/^#story-/.test(location.hash) && byId[location.hash.slice(7)]) openStory(location.hash.slice(7));

  // ---------- submit story ----------
  const sf = $("[data-submit-form]"), thumbs = $("[data-thumbs]");
  let urls = [];
  $("[data-files]").addEventListener("change", (e) => {
    urls.forEach((u) => URL.revokeObjectURL(u));
    const files = [...e.target.files].filter((f) => f.type.startsWith("image/")).slice(0, 4);
    urls = files.map((f) => URL.createObjectURL(f));
    thumbs.innerHTML = urls.map((u, i) => `<img src="${u}" alt="Selected photo ${i + 1}">`).join("") + (files.length ? `<span>${files.length} photo${files.length > 1 ? "s" : ""} selected</span>` : "");
  });
  sf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = sf.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (f.story.value.trim().length < 30) miss.push("a story of at least 30 characters");
    if (!f.consent.checked) miss.push("your consent");
    if (miss.length) { $("[data-sub-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-sub-err]").textContent = "";
    $("[data-sub-text]").textContent = `${f.name.value.trim().split(/\s+/)[0]}, our team will review your ${f.program.value.toLowerCase()} story${urls.length ? ` and ${urls.length} photo${urls.length > 1 ? "s" : ""}` : ""} within a week. (Demo: nothing was uploaded.)`;
    $("[data-sub-done]").hidden = false;
  });

  // ---------- consultation ----------
  const cd = $("[data-consult-dlg]"), cf = $("[data-consult-form]");
  document.addEventListener("click", (e) => { if (e.target.closest("[data-consult]")) { if (sd.open) sd.close(); cf.reset(); $("[data-cs-done]").hidden = true; $("[data-cs-err]").textContent = ""; cd.showModal(); } });
  cf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = cf.elements;
    if (!f.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) { $("[data-cs-err]").textContent = "Please add your name and a valid email."; return; }
    $("[data-cs-text]").textContent = `${f.name.value.trim().split(/\s+/)[0]}, a coach will email you within one business day to schedule your ${f.goal.value.toLowerCase()} consultation. (Demo)`;
    $("[data-cs-done]").hidden = false;
  });
  $$(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- feed, FAQ, nav ----------
  const FEED = ["priya", "kevin", "elena", "diego", "aisha", "tom"];
  $("[data-feed]").innerHTML = FEED.map((id, i) => { const s = byId[id]; return `<a class="post" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram post by ${s.name}"><span class="post-img">${fig(s, i % 2)}</span><span class="post-ov">${icon("heart")}${(s.likes / 3 | 0)} · ${s.name}</span></a>`; }).join("");
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  mbtn.addEventListener("click", () => { const o = menu.hidden; menu.hidden = !o; mbtn.setAttribute("aria-expanded", String(o)); mbtn.innerHTML = icon(o ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); }));

  window.MuseAscend = { count: () => list().length, cp: () => cpi, vt: () => vT };
})();
