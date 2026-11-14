(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const A = window.Art;
  $("[data-art=hero]").innerHTML = A.hero();

  // ---------- programs ----------
  const PROG = [
    { id: "bjj", name: "Brazilian Jiu-Jitsu", art: "bjj", form: "BJJ",
      desc: "The gentle art of leverage and control. Learn submissions, sweeps, and escapes from every position. Our BJJ program produces confident grapplers — from your first class to competition-level training.",
      classes: [["Fundamentals", "White–Blue belt", "Mon/Wed/Fri 6 PM", "Core techniques, positional drilling, and live rolling with guidance"], ["Advanced", "Blue belt+", "Tue/Thu 7 PM", "Competition-focused. Advanced guards, passing systems, and strategy"], ["No-Gi Grappling", "All ranks", "Sat 10 AM", "Submission wrestling without the kimono. Fast-paced and athletic"], ["Kids BJJ", "Ages 5–12", "Mon/Wed 4:30 PM", "Coordination, discipline, and anti-bullying confidence"]],
      results: "23 IBJJF medals in 2025 · 4 state champions" },
    { id: "mt", name: "Muay Thai", art: "muaythai", form: "Muay Thai",
      desc: "The art of eight limbs. Develop devastating striking with punches, kicks, elbows, and knees. Our Muay Thai program builds real-world striking skills and elite conditioning.",
      classes: [["Foundations", "Beginners", "Mon/Wed 5 PM", "Stance, basic combos, pad work, heavy bag rounds"], ["All Levels", "Everyone", "Tue/Thu 6 PM", "Technical striking, clinch work, sparring drills"], ["Fight Team", "Competitors", "Fri 5:30 PM", "For competitors: advanced strategy, sparring, fight prep"], ["Cardio Kickboxing", "No contact", "Sat 9 AM", "High-energy bag workout. No contact, all fitness levels"]],
      results: "8 amateur fighters · 3 regional champions · 28-4 combined record" },
    { id: "mma", name: "MMA", art: "mma", form: "MMA",
      desc: "The complete martial artist. Combine striking, wrestling, and submissions into a unified fighting system. Our MMA program integrates BJJ and Muay Thai with wrestling and cage work.",
      classes: [["MMA Fundamentals", "Beginners", "Tue/Thu 5 PM", "Blending ranges: striking to clinch to ground transitions"], ["Advanced MMA", "Experienced", "Mon/Wed 7:30 PM", "Cage strategy, wrestling, fight IQ development"], ["Open Mat", "All disciplines", "Sun 11 AM", "Free training. All disciplines. Coach supervision available"]],
      results: "12 active amateur fighters · 2 pro fighters on roster" },
  ];
  let tab = 0;
  $("[data-tabs]").innerHTML = PROG.map((p, i) => `<button class="tab" type="button" role="tab" id="tab-${p.id}" aria-controls="panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${i}">${p.name}</button>`).join("");
  $("[data-tab-select]").innerHTML = PROG.map((p, i) => `<option value="${i}">${p.name}</option>`).join("");
  function renderTab() {
    const p = PROG[tab];
    $$("[data-tab]").forEach((b, i) => { b.setAttribute("aria-selected", String(i === tab)); b.tabIndex = i === tab ? 0 : -1; });
    $("[data-tab-select]").value = String(tab);
    const panel = $("[data-panel]");
    panel.id = "panel"; panel.setAttribute("aria-labelledby", `tab-${p.id}`);
    panel.innerHTML = `
      <div class="p-top"><div class="p-img">${A.scene(p.art)}</div>
        <div class="p-copy"><h3>${p.name}</h3><p>${esc(p.desc)}</p><p class="results">${icon("trophy")}<span>${esc(p.results)}</span></p></div></div>
      <div class="classes">${p.classes.map(([n, lvl, when, d]) => `
        <article class="cls"><div class="cls-top"><h4>${esc(n)}</h4><span class="lvl">${esc(lvl)}</span></div>
          <p class="when">${icon("clock")}${esc(when)}</p><p class="cls-d">${esc(d)}</p>
          <button class="link" type="button" data-try="${esc(p.form)}">Try this class ${icon("arrow")}</button></article>`).join("")}</div>`;
    panel.classList.remove("fade"); void panel.offsetWidth; panel.classList.add("fade");
  }
  function setTab(i, focus) { tab = (i + PROG.length) % PROG.length; renderTab(); if (focus) $(`[data-tab="${tab}"]`).focus(); }
  $("[data-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(+b.dataset.tab); });
  $("[data-tabs]").addEventListener("keydown", (e) => { if (e.key === "ArrowRight") setTab(tab + 1, true); if (e.key === "ArrowLeft") setTab(tab - 1, true); });
  $("[data-tab-select]").addEventListener("change", (e) => setTab(+e.target.value));
  $$("[data-tab-link]").forEach((a) => a.addEventListener("click", () => setTab(PROG.findIndex((p) => p.id === a.dataset.tabLink))));
  renderTab();

  // ---------- belts ----------
  const BELTS = [
    ["White Belt", "#F9FAFB", "Where everyone starts. Learn fundamentals, survive, escape.", "0–2 years", 89],
    ["Blue Belt", "#2563EB", "Technical base established. Chain attacks, develop your game.", "2–4 years", 34],
    ["Purple Belt", "#7C3AED", "Creativity and flow. Start coaching. Advanced competition.", "4–6 years", 12],
    ["Brown Belt", "#92400E", "Mastery of fundamentals. Refine your A-game.", "6–8 years", 5],
    ["Black Belt", "#0B0F17", "The beginning of the journey. Lifelong learning.", "8–12 years", 3],
  ];
  const maxN = 89;
  $("[data-belts]").innerHTML = BELTS.map(([n, c, d, t, count], i) => `
    <li class="belt" style="--c:${c}">
      <button class="belt-bar" type="button" aria-expanded="${i === 0}" data-belt="${i}"><span class="bar"><i></i></span><span class="belt-name">${n}</span></button>
      <p class="belt-d">${d}</p>
      <p class="belt-t">${icon("clock")}Avg time: ${t}</p>
      <p class="belt-n">${icon("users")}<b>${count}</b> students<span class="mini"><i style="width:${(count / maxN) * 100}%"></i></span></p>
    </li>`).join("");
  $("[data-belts]").addEventListener("click", (e) => { const b = e.target.closest("[data-belt]"); if (!b) return; $$("[data-belt]").forEach((x) => x.setAttribute("aria-expanded", String(x === b))); });

  // ---------- coaches ----------
  const COACH = [
    ["Coach Marcus Torres", "Head BJJ Instructor", "3rd-degree Black Belt", "15 years teaching. IBJJF World Masters gold medalist. Marcus has promoted 28 black belts.", { skin: 3, hair: 0, hairStyle: "buzz", top: 4, bg: 6, beard: true }, true, "Teaches Fundamentals (Mon/Wed/Fri 6 PM) and Advanced (Tue/Thu 7 PM)."],
    ["Coach Sana Patel", "Head Muay Thai Coach", "Kru rank", "Former WBC Muay Thai ranked fighter with a 24-3 record. Sana brings authentic Thai technique from training in Bangkok.", { skin: 4, hair: 0, hairStyle: "bun", top: 0, bg: 7 }, false, "Teaches Foundations (Mon/Wed 5 PM), All Levels (Tue/Thu 6 PM) and Fight Team (Fri 5:30 PM)."],
    ["Coach Jake Brennan", "MMA Coach", "BJJ Brown Belt", "8-2 pro MMA record. Jake coaches fight strategy and wrestling, and runs the amateur fight team.", { skin: 0, hair: 3, hairStyle: "short", top: 4, bg: 3, beard: true }, false, "Teaches MMA Fundamentals (Tue/Thu 5 PM) and Advanced MMA (Mon/Wed 7:30 PM)."],
    ["Coach Adrienne Cole", "Kids Program Director", "BJJ Black Belt", "Former elementary teacher turned martial artist. Adrienne designs our youth curriculum around confidence, discipline, and fun.", { skin: 6, hair: 0, hairStyle: "curly", top: 1, bg: 2 }, true, "Runs Kids BJJ (Mon/Wed 4:30 PM) and the summer youth camp."],
  ];
  $("[data-coaches]").innerHTML = COACH.map(([n, t, cr, bio, look, gi], i) => `
    <article class="coach"><div class="c-img">${A.portrait(look, `Illustrated portrait of ${n}`, gi)}</div>
      <div class="c-body"><h3>${n}</h3><p class="c-title">${t}</p><p class="cred">${icon("award")}${cr}</p><p class="c-bio">${bio}</p>
      <button class="link view-bio" type="button" data-bio="${i}">View Bio ${icon("arrow")}</button></div></article>`).join("");

  // ---------- testimonials ----------
  const TMS = [
    ["I walked in 40 lbs overweight with zero martial arts experience. 18 months later I'm a blue belt, down 35 lbs, and I compete. Iron Path changed my life.", "Derek S.", "Member since 2024", { skin: 2, hair: 2, hairStyle: "short", top: 2, bg: 3, beard: true }],
    ["My daughter was being bullied at school. After 6 months of kids BJJ, her confidence is through the roof. She stands taller. Coach Adrienne is incredible with kids.", "Michelle T.", "Parent", { skin: 5, hair: 0, hairStyle: "long", top: 6, bg: 5 }],
    ["I trained Muay Thai in Thailand for a year. Sana's coaching is the real deal — authentic technique with smart programming. Best gym I've trained at in the US.", "Ryan K.", "Member since 2023", { skin: 7, hair: 0, hairStyle: "side", top: 4, bg: 0 }],
  ];
  $("[data-tms]").innerHTML = TMS.map(([q, n, c, look]) => `
    <figure class="tm"><div class="tm-top"><span class="tm-av">${A.portrait(look, `Portrait of ${n}`)}</span><span><b>${n}</b><small>${c}</small><span class="stars" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</span></span></div>
      <blockquote>“${esc(q)}”</blockquote></figure>`).join("");

  // ---------- facility strip ----------
  const FAC = [["matroom", "Mat room (main)", "3,000 sq ft Zebra mats, wall mirrors, flag display"], ["cage", "MMA cage", "Regulation-size octagon with padded fence"], ["bags", "Heavy bag area", "12 bags, speed bags, double-end bags"], ["strength", "Strength corner", "Squat rack, kettlebells, battle ropes, plyometric boxes"], ["recovery", "Recovery lounge", "Foam rollers, stretch area, water station, member cubbies"], ["shop", "Pro shop", "Gis, rashguards, gloves, hand wraps, Iron Path branded gear"]];
  const strip = $("[data-strip]");
  strip.innerHTML = FAC.map(([k, t, d]) => `<figure class="ph">${A.scene(k)}<figcaption><b>${t}</b><span>${d}</span></figcaption></figure>`).join("");
  const stepW = () => strip.querySelector(".ph").offsetWidth + 16;
  function go(dir) { const max = strip.scrollWidth - strip.clientWidth; const next = strip.scrollLeft + dir * stepW(); strip.scrollTo({ left: next > max + 4 ? 0 : next < -4 ? max : next, behavior: "smooth" }); }
  $$("[data-tour]").forEach((b) => b.addEventListener("click", () => { go(+b.dataset.tour); pause(8000); }));
  let auto = null, hold = 0;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pause(ms) { hold = Date.now() + ms; }
  ["pointerenter", "focusin", "touchstart"].forEach((ev) => strip.addEventListener(ev, () => pause(10000), { passive: true }));
  if (!still) auto = setInterval(() => { if (Date.now() > hold && !document.hidden && strip.getBoundingClientRect().top < innerHeight) go(1); }, 4000);

  // ---------- dialogs ----------
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function show(html) { body.innerHTML = html; dlg.showModal(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  document.addEventListener("click", (e) => {
    const bio = e.target.closest("[data-bio]");
    if (bio) { const [n, t, cr, b, , , sched] = COACH[+bio.dataset.bio]; show(`<p class="kicker">${t}</p><h2 id="dlg-title">${n}</h2><p class="cred">${icon("award")}${cr}</p><p>${b}</p><p>${sched}</p><a class="btn btn-red" href="#trial" data-close>Train with ${n.split(" ")[1]}</a>`); }
    const plan = e.target.closest("[data-plan]");
    if (plan) {
      const price = +plan.dataset.price;
      show(`<p class="kicker">Membership</p><h2 id="dlg-title">${plan.dataset.plan} — $${price}/month</h2>
        <form class="promo" novalidate data-promo><label class="field">Promo code<input name="code" placeholder="IRONPATH50" autocomplete="off"></label><button class="btn btn-dark" type="submit">Apply</button></form>
        <p class="sum" data-sum>First month: <b>$${price}.00</b> · then $${price}/month</p>
        <p class="fine">Month-to-month. Cancel anytime. Checkout happens at the front desk in this demo; nothing is charged.</p>
        <a class="btn btn-red" href="#trial" data-close>Start with a free class</a>`);
      $("[data-promo]").addEventListener("submit", (ev) => {
        ev.preventDefault();
        const ok = ev.target.code.value.trim().toUpperCase() === "IRONPATH50";
        $("[data-sum]").innerHTML = ok ? `First month: <s>$${price}.00</s> <b>$${(price / 2).toFixed(2)}</b> · then $${price}/month <span class="ok">${icon("check")}IRONPATH50 applied</span>` : `<span class="bad">That code isn't valid.</span> First month: <b>$${price}.00</b>`;
      });
    }
    const tr = e.target.closest("[data-try]");
    if (tr) { $("[data-form]").elements.program.value = tr.dataset.try; $("#trial").scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("[data-form]").elements.name.focus({ preventScroll: true }), 600); }
    const cp = e.target.closest("[data-copy]");
    if (cp) { navigator.clipboard?.writeText(cp.dataset.copy).catch(() => {}); say("Code IRONPATH50 copied: 50% off your first month."); }
    const s = e.target.closest("[data-soon]");
    if (s) { e.preventDefault(); closeMenu(); say(`${s.dataset.soon} lives on the full site; this demo is the homepage.`); }
  });

  // ---------- trial form ----------
  const form = $("[data-form]"), date = $("[data-date]");
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  date.min = iso(tomorrow); const max = new Date(); max.setDate(max.getDate() + 60); date.max = iso(max);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, miss = [];
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (f.phone.value.replace(/\D/g, "").length < 10) miss.push("a 10-digit phone");
    if (!f.date.value || f.date.value < date.min || f.date.value > date.max) miss.push("a date in the next 60 days");
    if (miss.length) { $("[data-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-err]").textContent = "";
    const d = new Date(`${f.date.value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    $("[data-done-text]").textContent = `${f.name.value.trim().split(/\s+/)[0]}, your free ${f.program.value === "Not sure" ? "intro" : f.program.value} class is requested for ${d}. A coach will text to confirm the time. (Demo: nothing was sent.)`;
    $("[data-done]").hidden = false;
  });
  $("[data-reset]").addEventListener("click", () => { form.reset(); $("[data-done]").hidden = true; });

  // ---------- nav, drawer, parallax ----------
  const drawer = $("[data-drawer]"), scrim = $("[data-scrim]"), ob = $("[data-menu-open]");
  function setMenu(open) { drawer.classList.toggle("open", open); drawer.setAttribute("aria-hidden", String(!open)); ob.setAttribute("aria-expanded", String(open)); scrim.hidden = !open; document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-menu-close]").focus(); }
  function closeMenu() { if (drawer.classList.contains("open")) setMenu(false); }
  ob.addEventListener("click", () => setMenu(true));
  $("[data-menu-close]").addEventListener("click", () => { setMenu(false); ob.focus(); });
  scrim.addEventListener("click", () => setMenu(false));
  $$("a:not([data-soon])", drawer).forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  const bg = $("[data-parallax]");
  function onScroll() {
    if (!still && scrollY < innerHeight) bg.style.transform = `translateY(${scrollY * 0.3}px)`;
    const heroOut = $(".hero").getBoundingClientRect().bottom < 0, tr = $("#trial").getBoundingClientRect();
    document.body.classList.toggle("show-bar", heroOut && !(tr.top < innerHeight && tr.bottom > 0));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }

  window.MuseIronPath = { tab: () => tab, strip: () => strip.scrollLeft, stop: () => clearInterval(auto) };
})();
