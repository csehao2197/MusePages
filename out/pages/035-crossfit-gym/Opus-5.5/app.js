(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- art ----------
  $("[data-art=hero]").innerHTML = window.Art.hero();
  $$("[data-scene]").forEach((el) => { el.innerHTML = window.Art.scene(el.dataset.scene); });
  $("[data-ba]").innerHTML = window.Art.beforeAfter();
  $("[data-map]").innerHTML = window.Art.map();

  // ---------- ticker ----------
  const times = ["5:30 AM", "6:30 AM", "9:00 AM", "12:00 PM", "4:30 PM", "5:30 PM", "6:30 PM"];
  const run = times.map((t) => `<span>${t}</span><i>✦</i>`).join("");
  $("[data-ticker]").innerHTML = `<div>${run}${run}</div><div>${run}${run}</div>`;

  // ---------- WOD scale toggle ----------
  $$("[data-ver]").forEach((b) => b.addEventListener("click", () => {
    const scaled = b.dataset.ver === "scaled";
    $$("[data-ver]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
    $$("[data-rx]").forEach((s) => { s.textContent = scaled ? s.dataset.sc : s.dataset.rx; s.classList.toggle("mod", scaled); });
    $("[data-scale-note]").hidden = !scaled;
  }));

  // ---------- schedule ----------
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const WEEKDAY = [
    ["5:30 AM", "CrossFit", "Mike", 6], ["6:30 AM", "CrossFit", "Priya", 0], ["9:00 AM", "CrossFit", "Sarah", 12], ["10:00 AM", "Iron Foundations", "Mike", 4],
    ["12:00 PM", "CrossFit", "Alex", 8], ["4:30 PM", "Open Gym", null, -1], ["5:30 PM", "CrossFit", "Priya", 3], ["6:30 PM", "CrossFit", "Sarah", 0],
  ];
  const SAT = [["8:00 AM", "Partner WOD", "Mike", 9], ["9:00 AM", "Beach WOD", "Sarah", 14], ["10:30 AM", "Open Gym", null, -1]];
  const SUN = [["9:00 AM", "Open Gym", null, -1], ["10:00 AM", "Mobility & Recovery", "Priya", 10]];
  const shift = (rows, d) => rows.map((r, i) => (r[3] > 0 ? [r[0], r[1], r[2], Math.max(1, r[3] + ((d * 3 + i) % 5) - 2)] : r));
  const sched = (d) => (d === 5 ? SAT : d === 6 ? SUN : d === 0 || d === 3 ? WEEKDAY : shift(WEEKDAY, d));
  const today = (new Date().getDay() + 6) % 7;
  let day = today;
  const booked = new Set();
  $("[data-days]").innerHTML = DAYS.map((d, i) => `<button type="button" role="tab" class="day${i === today ? " today" : ""}" aria-selected="${i === day}" data-day="${i}">${d}${i === today ? '<small>Today</small>' : ""}</button>`).join("");
  function renderSched() {
    $$("[data-day]").forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.day === day)));
    $("[data-sched]").innerHTML = sched(day).map(([t, c, coach, spots], i) => {
      const key = `${day}-${i}`, isBooked = booked.has(key);
      const full = spots === 0, open = spots < 0;
      const avail = open ? `<span class="av open"><i class="dot green"></i>Open</span>` : full ? `<span class="av"><i class="dot red"></i>Full</span>` : `<span class="av"><i class="dot ${spots <= 5 ? "yellow" : "green"}"></i>${spots} spot${spots === 1 ? "" : "s"} left</span>`;
      const btn = isBooked ? `<button class="btn btn-sm booked" type="button" disabled>${icon("check")}Reserved</button>`
        : full ? `<button class="btn btn-sm btn-outline" type="button" data-wait="${key}" data-label="${esc(`${DAYS[day]} ${t} ${c}`)}">Join Waitlist</button>`
        : open ? `<span class="drop">Drop in anytime</span>`
        : `<button class="btn btn-sm btn-outline" type="button" data-reserve="${key}" data-label="${esc(`${DAYS[day]} ${t} ${c} with Coach ${coach}`)}">Reserve Your Spot</button>`;
      return `<div class="row"><span class="time">${t}</span><span class="cls">${esc(c)}</span><span class="coach">${coach ? `Coach: ${coach}` : "Self-directed"}</span>${avail}${btn}</div>`;
    }).join("");
  }
  $("[data-days]").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (!b) return; day = +b.dataset.day; b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); renderSched(); });
  renderSched();

  // ---------- coaches ----------
  const COACHES = [
    ["Mike Torres", "Head Coach & Owner", "CF-L4, 12 years coaching", "Former Marine. Competed at CrossFit Regionals 3x.", { skin: 3, hair: 0, hairStyle: "buzz", top: 4, beard: true }],
    ["Priya Sharma", "Coach", "CF-L2, USAW Sports Performance", "Specialties: Olympic lifting, mobility.", { skin: 4, hair: 0, hairStyle: "bun", top: 0 }],
    ["Sarah Kim", "Coach", "CF-L2, NASM-CPT", "Former D1 gymnast. Runs our gymnastics skill sessions.", { skin: 7, hair: 0, hairStyle: "long", top: 2 }],
    ["Alex Rivera", "Coach", "CF-L2, Precision Nutrition L1", "Focuses on nutrition coaching and beginner on-ramp.", { skin: 2, hair: 1, hairStyle: "curly", top: 3 }],
  ];
  $("[data-coaches]").innerHTML = COACHES.map(([n, t, cr, bio, look]) => `
    <article class="coach"><div class="c-photo">${window.Art.coach(look, `Illustrated portrait of ${n}`)}</div>
      <h3>${esc(n)}</h3><p class="c-title">${esc(t)}</p><p class="cred">${esc(cr)}</p><p class="c-bio">${esc(bio)}</p></article>`).join("");

  // ---------- programs ----------
  const PROGS = [
    ["CrossFit", "Group classes · 60 min", "Every class runs warm-up, skill or strength work, the WOD and a cool-down. Coaches scale each movement so beginners and Rx athletes train side by side.", "Included in Unlimited and Competitor memberships."],
    ["Iron Foundations", "4-week on-ramp", "Eight small-group sessions covering the squat, hinge, press, pull, Olympic lifting basics and gymnastics progressions, with a coach who knows your name.", "Free with Unlimited; $149 on its own."],
    ["Open Gym & Competitors", "Advanced", "Competitor track programming, open gym access and monthly specialty sessions in Olympic lifting and gymnastics.", "Included in the Competitor membership."],
  ];
  $$("[data-prog]").forEach((b) => b.addEventListener("click", () => {
    const [t, k, d, p] = PROGS[+b.dataset.prog];
    openDialog({ kicker: k, title: t, desc: `${d} ${p}`, submit: "Book a Free Intro", mode: "intro" });
  }));

  // ---------- pricing ----------
  $("[data-annual]").addEventListener("change", (e) => {
    const on = e.target.checked;
    $$("[data-price]").forEach((b) => { const v = +b.dataset.price; b.textContent = `$${on ? Math.round(v * 0.85) : v}`; });
    $$("[data-billed]").forEach((p) => { const v = +p.dataset.billed; p.textContent = on ? `$${Math.round(v * 0.85 * 12).toLocaleString("en-US")} billed yearly · save $${Math.round(v * 0.15 * 12)}` : "Billed monthly"; });
  });

  // ---------- dialog ----------
  const dlg = $("[data-dlg]"), form = $("[data-form]");
  let mode = "intro", target = null;
  function openDialog(o) {
    mode = o.mode; target = o.target || null;
    form.reset(); $("[data-done]").hidden = true; $("[data-err]").textContent = "";
    $("[data-kicker]").textContent = o.kicker; $("[data-title]").textContent = o.title; $("[data-desc]").textContent = o.desc; $("[data-submit]").textContent = o.submit;
    $("[data-exp]").hidden = mode !== "intro";
    dlg.showModal();
  }
  const OFFERS = {
    "free-week": { kicker: "Free week", title: "Start your free week", desc: "Seven days of unlimited classes, starting with a free intro and movement assessment. No contracts.", submit: "Start My Free Week" },
    "drop-in": { kicker: "Drop-in · $25", title: "Buy a drop-in", desc: "One class at any scheduled time. Bring a water bottle; we'll handle the rest. Payment is taken at the front desk in this demo.", submit: "Reserve Drop-In" },
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-book]");
    if (b) { const o = OFFERS[b.dataset.book] || { kicker: "Free intro class", title: "Book your free intro", desc: "A 60-minute intro with a coach: movement assessment, a short workout, and a tour.", submit: "Book My Free Class" }; openDialog({ ...o, mode: "intro" }); return; }
    const r = e.target.closest("[data-reserve]"), w = e.target.closest("[data-wait]");
    if (r) openDialog({ kicker: "Reserve a spot", title: r.dataset.label, desc: "Class reservations open 7 days ahead. Cancel up to 2 hours before class.", submit: "Reserve My Spot", mode: "reserve", target: r.dataset.reserve });
    if (w) openDialog({ kicker: "Class is full", title: `Waitlist: ${w.dataset.label}`, desc: "We'll text you the moment a spot opens up.", submit: "Join Waitlist", mode: "wait", target: w.dataset.wait });
    const s = e.target.closest("[data-soon]");
    if (s) { e.preventDefault(); say(`${s.dataset.soon} lives on the full site; this demo is the homepage.`); }
  });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (f.phone.value.trim() && f.phone.value.replace(/\D/g, "").length < 10) miss.push("a 10-digit phone number");
    if (miss.length) { $("[data-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-err]").textContent = "";
    const first = f.name.value.trim().split(/\s+/)[0];
    if (mode === "reserve") { booked.add(target); renderSched(); $("[data-done-title]").textContent = "Spot reserved"; $("[data-done-text]").textContent = `${first}, you're on the roster for ${$("[data-title]").textContent}. (Demo: nothing was sent.)`; }
    else if (mode === "wait") { $("[data-done-title]").textContent = "You're on the waitlist"; $("[data-done-text]").textContent = `${first}, we'll text you if a spot opens. (Demo: nothing was sent.)`; }
    else { $("[data-done-title]").textContent = "See you there!"; $("[data-done-text]").textContent = `${first}, a coach will reach out within a day to pick your intro time. (Demo: nothing was sent.)`; }
    $("[data-done]").hidden = false;
  });

  // ---------- nav / mobile ----------
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  const closeMenu = () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); };
  mbtn.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; mbtn.setAttribute("aria-expanded", String(open)); mbtn.innerHTML = icon(open ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  function onScroll() {
    $("[data-nav]").classList.toggle("scrolled", scrollY > 10);
    const heroOut = $(".hero").getBoundingClientRect().bottom < 0, finalIn = $(".final").getBoundingClientRect().top < innerHeight;
    document.body.classList.toggle("show-bar", heroOut && !finalIn);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }

  window.MuseIronTide = { day: () => day, today, booked: () => booked.size };
})();
