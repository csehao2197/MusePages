(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const A = window.Art;
  $("[data-art=spread]").innerHTML = A.spread();

  // ---------- plans ----------
  const PLANS = [
    { id: "starter", name: "Starter", m: 99, feats: ["Personalized macro targets", "Custom meal plan (updated monthly)", "Recipe database access (200+ recipes)", "Email support"] },
    { id: "pro", name: "Pro", m: 179, pop: true, feats: ["Everything in Starter", "Weekly 30-min video check-in", "Grocery shopping lists", "Restaurant dining guide", "Progress tracking dashboard"] },
    { id: "elite", name: "Elite", m: 299, feats: ["Everything in Pro", "Daily coach messaging via app", "Supplement recommendations", "Bi-weekly body composition analysis", "Priority scheduling", "Quarterly in-person consultation"] },
  ];
  let annual = false;
  const per = (p) => (annual ? Math.round(p.m * 0.8) : p.m);
  function renderPlans() {
    $("[data-plans]").innerHTML = PLANS.map((p) => `
      <article class="plan${p.pop ? " pop" : ""}">${p.pop ? '<span class="badge">Most Popular</span>' : ""}
        <h3>${p.name}</h3>
        <p class="price"><b>$${per(p)}</b>/month</p>
        <p class="billed">${annual ? `$${per(p) * 12} billed yearly · save $${(p.m - per(p)) * 12}` : "Billed monthly · cancel anytime"}</p>
        <ul>${p.feats.map((f, i) => `<li class="${i === 0 && p.id !== "starter" ? "all" : ""}">${icon("check")}${esc(f)}</li>`).join("")}</ul>
        <button class="btn ${p.pop ? "btn-primary" : "btn-outline"}" type="button" data-start="${p.id}">Start Now</button>
      </article>`).join("");
  }
  $("[data-annual]").addEventListener("click", (e) => {
    annual = !annual; e.currentTarget.setAttribute("aria-checked", String(annual));
    $('[data-lbl="m"]').classList.toggle("on", !annual); $('[data-lbl="a"]').classList.toggle("on", annual);
    renderPlans();
  });
  renderPlans();

  // ---------- coaches ----------
  const COACHES = [
    ["Dr. Amanda Chen", "MS, RD", "Sports Nutrition Specialist", "Helping athletes fuel their peak performance", { skin: 7, hair: 0, hairStyle: "bob", top: 3, bg: 4 }, "performance"],
    ["Marcus Johnson", "CSCS, PN1", "Weight Loss Expert", "Sustainable habits, not crash diets", { skin: 6, hair: 0, hairStyle: "buzz", top: 2, bg: 3, beard: true }, "fat loss"],
    ["Sofia Reyes", "CNS", "Plant-Based Nutrition", "Thriving on plants without sacrificing taste", { skin: 2, hair: 2, hairStyle: "long", top: 8, bg: 2 }, "plant-based"],
    ["David Kim", "RD, CISSN", "Muscle Building", "Strategic nutrition for serious gains", { skin: 1, hair: 0, hairStyle: "side", top: 4, bg: 0, glasses: true }, "muscle"],
  ];
  $("[data-coaches]").innerHTML = COACHES.map(([n, cr, sp, q, look], i) => `
    <article class="coach"><div class="c-img">${A.coach(look, `Illustrated portrait of ${n}`)}</div>
      <div><h3>${n}</h3><p class="cred">${cr}</p><p class="spec">${sp}</p><p class="quote">“${q}”</p>
      <button class="link" type="button" data-call="${i}">${icon("calendar")}Book a Call</button></div></article>`).join("");

  // ---------- results ----------
  const RES = [["silhouette", "Lost 35 lbs in 5 months", "I finally found an approach that works with my busy schedule.", "Jake T.", "Software Engineer"], ["chart", "Gained 12 lbs lean muscle", "The meal plans are delicious and I never feel deprived.", "Mia L.", "Competitive Swimmer"], ["metric", "Reversed pre-diabetes", "My doctor was shocked at my bloodwork improvements.", "Robert H.", "Age 54"]];
  $("[data-results]").innerHTML = RES.map(([k, h, q, n, w]) => `<article class="res"><div class="r-art">${A.result(k)}</div><h3>${h}</h3><blockquote>“${q}”</blockquote><p class="who"><b>${n}</b>, ${w}</p></article>`).join("");

  // ---------- sample day with swaps ----------
  const MEALS = [
    { slot: "Breakfast", time: "7:00 AM", opts: [["oats", "Overnight oats with berries, chia seeds, almond butter", 420, 35, 48, 12], ["yogurt", "Veggie egg-white scramble on sourdough with avocado", 410, 34, 40, 13]] },
    { slot: "Snack", time: "10:00 AM", opts: [["yogurt", "Greek yogurt with walnuts and honey", 250, 18, 22, 12], ["apple", "Cottage cheese with pineapple and pumpkin seeds", 240, 20, 20, 9]] },
    { slot: "Lunch", time: "12:30 PM", opts: [["bowl", "Grilled chicken quinoa bowl with roasted vegetables and tahini dressing", 550, 42, 52, 22], ["bowl", "Lentil and chickpea power bowl with feta and lemon dressing", 530, 30, 64, 16]] },
    { slot: "Snack", time: "3:30 PM", opts: [["apple", "Apple slices with peanut butter and dark chocolate chips", 280, 8, 34, 15], ["yogurt", "Protein shake with banana and oat milk", 270, 26, 32, 5]] },
    { slot: "Dinner", time: "7:00 PM", opts: [["salmon", "Pan-seared salmon with sweet potato and steamed broccoli", 520, 38, 42, 17], ["salmon", "Turkey meatballs with whole-wheat pasta and marinara", 540, 40, 56, 15]] },
  ];
  const pick = MEALS.map(() => 0);
  const fmt = (n) => n.toLocaleString("en-US");
  function renderMeals() {
    $("[data-meals]").innerHTML = MEALS.map((m, i) => {
      const [art, name, cal, p] = m.opts[pick[i]];
      return `<li class="ml"><span class="ml-time">${m.time}</span><span class="ml-dot" aria-hidden="true"></span>
        <div class="ml-card"><div class="ml-art">${A.meal(art, "")}</div><div class="ml-txt"><small>${m.slot}</small><b>${esc(name)}</b><span class="ml-mac">${cal} cal · ${p}g protein</span></div>
        <button class="icon-btn swap" type="button" aria-label="Swap ${m.slot.toLowerCase()} at ${m.time}" data-swap="${i}">${icon("swap")}</button></div></li>`;
    }).join("");
    const tot = MEALS.reduce((t, m, i) => { const o = m.opts[pick[i]]; return [t[0] + o[2], t[1] + o[3], t[2] + o[4], t[3] + o[5]]; }, [0, 0, 0, 0]);
    $("[data-tot-cal]").textContent = fmt(tot[0]);
    const kcal = tot[1] * 4 + tot[2] * 4 + tot[3] * 9;
    $("[data-macros]").innerHTML = [["Protein", tot[1], tot[1] * 4, "p"], ["Carbs", tot[2], tot[2] * 4, "c"], ["Fat", tot[3], tot[3] * 9, "f"]].map(([n, g, k, c]) => `<li><span>${n}</span><b data-macro="${c}">${g}g</b><i class="bar ${c}" style="--w:${Math.round((k / kcal) * 100)}%"></i></li>`).join("");
  }
  $("[data-meals]").addEventListener("click", (e) => { const b = e.target.closest("[data-swap]"); if (!b) return; const i = +b.dataset.swap; pick[i] = (pick[i] + 1) % MEALS[i].opts.length; renderMeals(); $(`[data-swap="${i}"]`).focus(); });
  renderMeals();

  // ---------- FAQ ----------
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  // ---------- assessment quiz / call booking ----------
  const dlg = $("[data-dlg]"), quiz = $("[data-quiz]"), body = $("[data-q-body]");
  const Q = [
    { k: "goal", q: "What's your main goal?", type: "radio", opts: ["Lose fat", "Build muscle", "Improve performance", "Eat healthier / manage a condition"] },
    { k: "diet", q: "How do you prefer to eat?", type: "radio", opts: ["No preference", "Plant-based", "Pescatarian", "Low-carb"] },
    { k: "allergy", q: "Any allergies or foods to avoid?", type: "check", opts: ["Dairy", "Gluten", "Nuts", "Shellfish", "None"] },
    { k: "time", q: "How much time can you spend cooking on weekdays?", type: "radio", opts: ["Under 15 minutes", "15–30 minutes", "30+ minutes"] },
    { k: "support", q: "How much coaching support do you want?", type: "radio", opts: ["Monthly plan, I'm self-driven", "Weekly check-ins", "Daily support"] },
    { k: "email", q: "Where should we send your recommendation?", type: "email" },
  ];
  let mode = "quiz", step = 0, ans = {}, plan = null, callCoach = 0;
  function draw() {
    $("[data-q-err]").textContent = "";
    $("[data-q-back]").hidden = mode !== "quiz" || step === 0 || step > Q.length;
    if (mode === "call") {
      const c = COACHES[callCoach];
      $("[data-q-count]").textContent = ""; $("[data-q-bar]").style.width = "100%";
      body.innerHTML = `<h2 id="as-title">Book a free intro call with ${c[0]}</h2><p class="q-sub">${c[2]} · 15 minutes by video</p><div class="opts">${["Tomorrow 9:00 AM", "Tomorrow 1:30 PM", "Thursday 6:00 PM"].map((t, i) => `<label class="opt"><input type="radio" name="slot" value="${t}"${i === 0 ? " checked" : ""}><span>${t}</span></label>`).join("")}</div><label class="field">Email<input name="email" type="email" autocomplete="email"></label>`;
      $("[data-q-next]").textContent = "Book call"; return;
    }
    if (mode === "start") {
      const p = PLANS.find((x) => x.id === plan);
      $("[data-q-count]").textContent = ""; $("[data-q-bar]").style.width = "100%";
      body.innerHTML = `<h2 id="as-title">Start ${p.name} — $${per(p)}/month${annual ? " (annual)" : ""}</h2><p class="q-sub">We'll start with your assessment so your coach can build the first plan within 48 hours.</p><label class="field">Email<input name="email" type="email" autocomplete="email"></label>`;
      $("[data-q-next]").textContent = "Continue to assessment"; return;
    }
    if (step >= Q.length) {
      const rec = ans.support?.startsWith("Daily") ? PLANS[2] : ans.support?.startsWith("Weekly") ? PLANS[1] : PLANS[0];
      const coachIdx = ans.diet === "Plant-based" ? 2 : ans.goal === "Build muscle" ? 3 : ans.goal === "Lose fat" ? 1 : 0;
      const avoid = (ans.allergy || []).filter((a) => a !== "None");
      $("[data-q-count]").textContent = "Done"; $("[data-q-bar]").style.width = "100%";
      body.innerHTML = `<div class="rec">${icon("check")}<h2 id="as-title">We recommend ${rec.name}</h2><p>$${per(rec)}/month · matched with <b>${COACHES[coachIdx][0]}</b> (${COACHES[coachIdx][2]}).</p>
        <ul><li>${esc(ans.goal)}</li><li>${esc(ans.diet)} meals, ${esc(ans.time.toLowerCase())} to cook</li><li>${avoid.length ? `Avoiding ${esc(avoid.join(", ").toLowerCase())}` : "No food restrictions"}</li></ul>
        <p class="q-sub">Your full recommendation would be emailed to ${esc(ans.email)}. (Demo: nothing was sent.)</p></div>`;
      $("[data-q-next]").textContent = "Close"; return;
    }
    const q = Q[step];
    $("[data-q-count]").textContent = `Question ${step + 1} of ${Q.length}`;
    $("[data-q-bar]").style.width = `${(step / Q.length) * 100}%`;
    $("[data-q-next]").textContent = step === Q.length - 1 ? "See my recommendation" : "Next";
    body.innerHTML = `<h2 id="as-title">${q.q}</h2>` + (q.type === "email"
      ? `<label class="field">Email<input name="email" type="email" autocomplete="email" value="${esc(ans.email || "")}"></label>`
      : `<div class="opts">${q.opts.map((o) => `<label class="opt"><input type="${q.type === "check" ? "checkbox" : "radio"}" name="${q.k}" value="${o}"${(q.type === "check" ? (ans[q.k] || []).includes(o) : ans[q.k] === o) ? " checked" : ""}><span>${o}</span></label>`).join("")}</div>`);
  }
  function open(m, extra) { mode = m; step = 0; if (m === "quiz") ans = extra ? { email: extra } : {}; draw(); if (!dlg.open) dlg.showModal(); }
  quiz.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = (t) => { $("[data-q-err]").textContent = t; };
    const email = quiz.elements.email?.value.trim();
    const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || "");
    if (mode === "call") { if (!validEmail(email)) return err("Please enter a valid email."); const s = quiz.elements.slot.value; body.innerHTML = `<div class="rec">${icon("check")}<h2 id="as-title">Call booked</h2><p>${s} with ${COACHES[callCoach][0]}. A video link would go to ${esc(email)}. (Demo)</p></div>`; mode = "done"; $("[data-q-next]").textContent = "Close"; return; }
    if (mode === "start") { if (!validEmail(email)) return err("Please enter a valid email."); mode = "quiz"; ans = { email }; step = 0; draw(); return; }
    if (mode === "done" || step >= Q.length) { dlg.close(); return; }
    const q = Q[step];
    if (q.type === "radio") { const v = quiz.querySelector(`[name="${q.k}"]:checked`); if (!v) return err("Pick one option to continue."); ans[q.k] = v.value; }
    if (q.type === "check") { const v = $$(`[name="${q.k}"]:checked`, quiz).map((x) => x.value); if (!v.length) return err("Choose at least one, or None."); ans[q.k] = v; }
    if (q.type === "email") { if (!validEmail(email)) return err("Please enter a valid email."); ans.email = email; }
    step += 1; draw();
  });
  $("[data-q-back]").addEventListener("click", () => { if (step > 0) { step -= 1; draw(); } });
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-assess]")) open("quiz");
    const c = e.target.closest("[data-call]"); if (c) { callCoach = +c.dataset.call; open("call"); }
    const s = e.target.closest("[data-start]"); if (s) { plan = s.dataset.start; open("start"); }
  });
  $("[data-lead]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#lead-email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { $("[data-lead-err]").textContent = "Please enter a valid email address."; return; }
    $("[data-lead-err]").textContent = "";
    open("quiz", v);
  });

  // ---------- nav ----------
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  mbtn.addEventListener("click", () => { const o = menu.hidden; menu.hidden = !o; mbtn.setAttribute("aria-expanded", String(o)); mbtn.innerHTML = icon(o ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); }));
  addEventListener("scroll", () => $("[data-nav]").classList.toggle("scrolled", scrollY > 8), { passive: true });

  window.MuseFuel = { annual: () => annual, step: () => step, mode: () => mode };
})();
