(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = (n) => n.toLocaleString("en-US");

  $$("[data-art]").forEach((el) => { el.innerHTML = window.Art[el.dataset.art](); });
  $("[data-avs]").innerHTML = [0, 1, 2, 3, 4].map((i) => `<span class="av">${window.Art.avatar(i, "")}</span>`).join("");

  // ---------- countdown (demo: starts at the brief's 06:14:23:08 when the page loads) ----------
  const end = Date.now() + ((6 * 24 + 14) * 3600 + 23 * 60 + 8) * 1000;
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let s = Math.max(0, Math.round((end - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    $$("[data-countdown] [data-u]").forEach((b) => { const t = pad(v[b.dataset.u]); if (b.textContent !== t) { b.textContent = t; b.classList.remove("flip"); void b.offsetWidth; b.classList.add("flip"); } });
  }
  tick(); setInterval(tick, 1000);

  // ---------- sign-up counter ----------
  let signed = 2847;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countTo(el, to, from = 0, dur = 1600) { const t0 = performance.now(); const step = (now) => { const k = still ? 1 : Math.min(1, (now - t0) / dur), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.textContent = fmt(v); if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  function renderSigned(animate) {
    if (animate) countTo($("[data-signed]"), signed, 2400); else $("[data-signed]").textContent = fmt(signed);
    $("[data-others]").textContent = fmt(signed - 5);
    $("[data-cap]").textContent = fmt(signed);
    $("[data-cap-bar]").style.width = `${(signed / 5000) * 100}%`;
  }
  renderSigned(true);

  // ---------- workouts ----------
  const DAYS = [
    [1, "Full Body Fire", 28, "Beginner-friendly", "g", ["Squats", "Push-ups", "Plank holds", "Lunges", "Mountain climbers"]],
    [2, "Upper Body Blitz", 32, "Intermediate", "y", ["Pike push-ups", "Tricep dips", "Resistance band rows", "Shoulder taps", "Superman holds"]],
    [3, "Cardio Surge", 25, "All levels", "g", ["High knees", "Burpees", "Jump squats", "Speed skaters", "Boxing combos"]],
    [4, "Core Crusher", 22, "Intermediate", "y", ["Dead bugs", "Bicycle crunches", "Plank variations", "V-ups", "Hollow body holds"]],
    [5, "Lower Body Power", 30, "Intermediate", "y", ["Bulgarian split squats", "Glute bridges", "Wall sits", "Calf raises", "Lateral lunges"]],
    [6, "HIIT Storm", 20, "Advanced", "r", ["Tabata-style: 8 rounds, 20s on/10s off", "Burpees", "Jump lunges", "Push-up jacks", "Tuck jumps"]],
    [7, "Active Recovery", 30, "All levels", "g", ["Yoga flow", "Foam rolling guide", "Mobility stretches", "Breathwork session"]],
  ];
  $("[data-days]").innerHTML = DAYS.map(([d, n, min, lvl, c, ex]) => {
    const locked = d >= 4;
    return `<article class="day ${c}${locked ? " locked" : ""}" data-day="${d}">
      <p class="d-num">Day ${d}</p><h3>${esc(n)}</h3>
      <div class="d-tags"><span class="dur">${icon("clock")}${min} min</span><span class="lvl ${c}">${esc(lvl)}</span></div>
      <ul>${ex.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      ${locked ? `<button class="unlock" type="button" data-join><span class="lock-ico">${icon("lock")}</span>Sign up to unlock</button>` : `<button class="d-btn" type="button" data-open-day="${d}">Preview workout ${icon("arrow")}</button>`}
    </article>`;
  }).join("");
  const days = $("[data-days]");
  $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => days.scrollBy({ left: +b.dataset.scroll * 440, behavior: "smooth" })));
  const wk = $("[data-wk]");
  days.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open-day]"); if (!b) return;
    const [d, n, min, lvl, c, ex] = DAYS[+b.dataset.openDay - 1];
    const per = Math.round((min * 60 - 120) / ex.length / 60 * 10) / 10;
    $("[data-wk-body]").innerHTML = `<p class="kicker">Day ${d} · ${min} min · ${esc(lvl)}</p><h2 id="wk-title">${esc(n)}</h2>
      <ol class="wk-list">${ex.map((x, i) => `<li><span>${i + 1}</span><b>${esc(x)}</b><small>${per} min · 3 levels</small></li>`).join("")}</ol>
      <p class="wk-note">Includes a 2-minute warm-up and cool-down. Video demos unlock when the challenge starts.</p>
      <button class="btn btn-or btn-xl" type="button" data-join>Reserve My Spot — It's Free</button>`;
    wk.showModal();
  });

  // ---------- results ----------
  const RES = [
    ["Marcus T., 34", "Lost 12 lbs, gained visible abs", "I've tried every app out there. IGNITE 30 was the first time I actually finished a challenge. The daily accountability check-ins made all the difference."],
    ["Priya K., 28", "Down 2 dress sizes", "The workouts were tough but scalable. I started at beginner level and by Week 3, I was doing intermediate. The nutrition guide was refreshingly simple."],
    ["Derek & Sam W., both 41", "Couple challenge · −35 lbs combined", "We did it together. Lost a combined 35 lbs. The couple accountability pairing was genius — we couldn't let each other skip."],
  ];
  $("[data-results]").innerHTML = RES.map(([n, k, q], i) => `
    <article class="res">
      <div class="ba">${window.Art.beforeAfter(i, `Blurred before and after placeholder for ${n}`)}<span class="ba-l">Before</span><span class="ba-r">After</span><span class="ba-lock">${icon("lock")}Photos shared privately in the community</span></div>
      <div class="res-body"><h3>${esc(n)}</h3><p class="metric">${icon("flame")}${esc(k)}</p><blockquote>“${esc(q)}”</blockquote>
      <p class="stars" aria-label="Rated 5 out of 5">${icon("star").repeat(5)}</p></div>
    </article>`).join("");

  // ---------- leaderboard ----------
  const LB = [["FitMomJess", 30, 847, 30], ["IronMike_ATX", 30, 812, 30], ["YogaWarrior22", 29, 789, 29], ["SweatSquadRon", 28, 756, 25], ["MarcusT_Gains", 28, 742, 28]];
  $("[data-lb]").innerHTML = LB.map(([n, w, p, s], i) => `
    <li class="row r${i + 1}">
      <span class="rank-b${i < 3 ? ` m${i + 1}` : ""}" aria-label="Rank ${i + 1}">${i + 1}</span>
      <span class="who"><span class="mini-av">${window.Art.avatar(i + 1, "")}</span>${esc(n)}</span>
      <span class="wo"><span class="wo-txt">${w}/30</span><span class="bar"><i style="width:${(w / 30) * 100}%"></i></span></span>
      <span class="pts"><b>${p}</b> pts</span>
      <span class="streak">${icon("flame")}${s}-day streak</span>
    </li>`).join("");
  const tipBtn = $("[data-tip]");
  tipBtn.addEventListener("click", () => tipBtn.parentElement.classList.toggle("show-tip"));
  document.addEventListener("click", (e) => { if (!e.target.closest(".pts-h")) tipBtn.parentElement.classList.remove("show-tip"); });

  // ---------- FAQ ----------
  $$("[data-faq] details").forEach((d) => {
    const s = d.querySelector("summary"), a = d.querySelector(".ans");
    s.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) { a.style.height = `${a.scrollHeight}px`; requestAnimationFrame(() => { a.style.height = "0px"; }); setTimeout(() => { d.open = false; a.style.height = ""; }, 260); }
      else { d.open = true; a.style.height = "0px"; requestAnimationFrame(() => { a.style.height = `${a.scrollHeight}px`; }); setTimeout(() => { a.style.height = ""; }, 280); }
    });
  });

  // ---------- join dialog ----------
  const dlg = $("[data-dlg]"), form = $("[data-form]");
  let plan = "free";
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-join]"); if (!b) return;
    plan = b.dataset.join === "pro" ? "pro" : "free";
    if (wk.open) wk.close();
    form.reset(); $("[data-done]").hidden = true; $("[data-err]").textContent = "";
    $("[data-plan-label]").textContent = plan === "pro" ? "Pro tier · $29 one-time (was $49)" : "Free tier · $0";
    $("#join-title").textContent = plan === "pro" ? "Go Pro for IGNITE 30" : "Reserve your spot";
    $("[data-submit]").textContent = plan === "pro" ? "Continue — $29" : "Reserve My Spot";
    dlg.showModal();
  });
  $$(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your first name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (miss.length) { $("[data-err]").textContent = `Please add ${miss.join(" and ")}.`; return; }
    $("[data-err]").textContent = "";
    signed += 1; renderSigned(false);
    $("[data-done-text]").textContent = `${f.name.value.trim()}, you're challenger #${fmt(signed)} at ${f.level.value} level${f.pair.checked ? " with a partner match" : ""}${plan === "pro" ? " on Pro (payment would be taken at checkout)" : ""}. Your prep guide would be emailed now. (Demo: nothing was sent.)`;
    $("[data-done]").hidden = false;
  });

  // ---------- nav / mobile ----------
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  const closeMenu = () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); };
  mbtn.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; mbtn.setAttribute("aria-expanded", String(open)); mbtn.innerHTML = icon(open ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  const links = $$(".nav-links a"), secs = links.map((a) => $(a.getAttribute("href")));
  function onScroll() {
    $("[data-nav]").classList.toggle("scrolled", scrollY > 10);
    let on = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.4) on = i; });
    links.forEach((a, i) => a.classList.toggle("on", i === on));
    const heroOut = $(".hero").getBoundingClientRect().bottom < 0, finalIn = $(".final").getBoundingClientRect().top < innerHeight;
    document.body.classList.toggle("show-bar", heroOut && !finalIn);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  const toast = $("[data-toast]"); let tt;
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (!s) return; e.preventDefault(); toast.textContent = `${s.dataset.soon} is part of the full PulseUp site; not included in this landing page demo.`; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); });

  window.MuseIgnite = { signed: () => signed, plan: () => plan };
})();
