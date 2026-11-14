(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = (n) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`;
  $("[data-art=hero]").innerHTML = window.Art.hero();

  // ---------- programs ----------
  const PROGS = [
    { name: "Full-Stack Web Development", short: "Full-Stack", icon: "code", color: "#3B82F6", dur: "12 weeks full-time / 24 weeks part-time", tech: ["React", "Node.js", "PostgreSQL", "AWS"], proj: "5 portfolio projects + capstone", price: 14900, pdf: "assets/syllabus-full-stack.pdf", outcome: "Junior software engineer, front-end or back-end developer", salary: "$82K" },
    { name: "Data Science & Analytics", short: "Data Science", icon: "chart", color: "#10B981", dur: "12 weeks full-time / 24 weeks part-time", tech: ["Python", "SQL", "TensorFlow", "Tableau"], proj: "4 portfolio projects + capstone", price: 13900, pdf: "assets/syllabus-data-science.pdf", outcome: "Data analyst, junior data scientist, BI developer", salary: "$79K" },
    { name: "UX Design", short: "UX Design", icon: "pen", color: "#8B5CF6", dur: "10 weeks full-time / 20 weeks part-time", tech: ["Figma", "Adobe XD", "Maze", "Hotjar"], proj: "3 case studies + capstone", price: 11900, pdf: "assets/syllabus-ux-design.pdf", outcome: "UX/UI designer, product designer, UX researcher", salary: "$71K" },
  ];
  $("[data-progs]").innerHTML = PROGS.map((p, i) => `
    <article class="prog" style="--c:${p.color}"><span class="p-ico">${icon(p.icon)}</span><h3>${p.name}</h3>
      <ul class="p-facts"><li>${icon("clock")}<span><b>Duration</b>${p.dur}</span></li><li>${icon("layers")}<span><b>Technologies</b>${p.tech.join(", ")}</span></li><li>${icon("folder")}<span><b>Projects</b>${p.proj}</span></li><li>${icon("tag")}<span><b>Tuition</b>${money(p.price)}</span></li></ul>
      <button class="link" type="button" data-learn="${i}">Learn More ${icon("arrow")}</button></article>`).join("");

  // ---------- dialog helper ----------
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function show(html, wide) { body.innerHTML = html; dlg.classList.toggle("wide", !!wide); if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0; }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function learn(i) {
    const p = PROGS[i];
    show(`<p class="kicker" style="color:${p.color}">${p.short}</p><h2 id="dlg-title">${p.name}</h2>
      <ul class="d-facts"><li><b>Format</b>${p.dur}</li><li><b>Stack</b>${p.tech.join(" · ")}</li><li><b>Portfolio</b>${p.proj}</li><li><b>Tuition</b>${money(p.price)}</li><li><b>Typical roles</b>${p.outcome}</li><li><b>Median grad salary</b>${p.salary}</li></ul>
      <div class="d-actions"><a class="btn btn-outline" href="${p.pdf}" download>${icon("download")}Download Syllabus</a><button class="btn btn-primary" type="button" data-apply="${i}">Apply to ${p.short}</button></div>`);
  }
  function compare() {
    const rows = [["Duration", (p) => p.dur], ["Technologies", (p) => p.tech.join(", ")], ["Projects", (p) => p.proj], ["Tuition", (p) => money(p.price)], ["Pay upfront", (p) => money(p.price - 1000)], ["Monthly (12 × 0%)", (p) => `${money(Math.round((p.price / 12) * 100) / 100)}/mo`], ["Median grad salary", (p) => p.salary]];
    show(`<h2 id="dlg-title">Compare all programs</h2><div class="cmp-wrap"><table class="cmp"><thead><tr><th></th>${PROGS.map((p) => `<th style="--c:${p.color}">${p.short}</th>`).join("")}</tr></thead><tbody>${rows.map(([n, f]) => `<tr><th scope="row">${n}</th>${PROGS.map((p) => `<td>${esc(f(p))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`, true);
  }
  function apply(pre) {
    show(`<p class="kicker">Application · free, 15 minutes</p><h2 id="dlg-title">Apply to LaunchCode Academy</h2>
      <form class="form" novalidate data-app-form>
        <div class="row2"><label class="field">First name<input name="first" autocomplete="given-name"></label><label class="field">Last name<input name="last" autocomplete="family-name"></label></div>
        <label class="field">Email<input name="email" type="email" autocomplete="email"></label>
        <div class="row2"><label class="field">Program<select name="prog">${PROGS.map((p, i) => `<option value="${i}"${+pre === i ? " selected" : ""}>${p.name}</option>`).join("")}</select></label><label class="field">Schedule<select name="sched"><option>Full-time</option><option>Part-time</option></select></label></div>
        <label class="field">Why tech, why now? <small>(a few sentences)</small><textarea name="why" rows="3"></textarea></label>
        <p class="err" role="alert" data-app-err></p>
        <button class="btn btn-primary" type="submit">${icon("send")}Submit application</button>
      </form>`);
    $("[data-app-form]").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target.elements, miss = [];
      if (!f.first.value.trim()) miss.push("your first name");
      if (!valid(f.email.value.trim())) miss.push("a valid email");
      if (f.why.value.trim().length < 20) miss.push("a short answer (20+ characters)");
      if (miss.length) { $("[data-app-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
      const p = PROGS[+f.prog.value];
      show(`<div class="ok">${icon("check")}<h2 id="dlg-title">Application received</h2><p>Thanks, ${esc(f.first.value.trim())}! An admissions advisor will email ${esc(f.email.value.trim())} within 2 business days to schedule your ${f.sched.value.toLowerCase()} ${p.short} interview. (Demo: nothing was sent.)</p><a class="btn btn-outline" href="${p.pdf}" download>${icon("download")}Download the ${p.short} syllabus</a></div>`);
    });
  }
  function report() {
    show(`<p class="kicker">Audited outcomes · 2025 graduates</p><h2 id="dlg-title">Outcomes report summary</h2>
      <ul class="d-facts"><li><b>Graduates in cohort</b>412</li><li><b>Job-seeking within 180 days</b>371</li><li><b>Hired in-field within 180 days</b>345 (93%)</li><li><b>Average starting salary</b>$78,200</li><li><b>Median days to offer</b>64</li><li><b>Hiring partners</b>300+</li></ul>
      <p class="fine">Sample figures for this demo page. A real report would follow the CIRR methodology and be independently audited.</p>`);
  }
  document.addEventListener("click", (e) => {
    const l = e.target.closest("[data-learn]"); if (l) { e.preventDefault(); learn(+l.dataset.learn); return; }
    const a = e.target.closest("[data-apply]"); if (a) { e.preventDefault(); apply(a.dataset.apply || 0); return; }
    if (e.target.closest("[data-compare]")) compare();
    const r = e.target.closest("[data-report]"); if (r) { e.preventDefault(); report(); }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); say(`${s.dataset.soon} lives on the full site; this demo is the homepage.`); closeMenu(); }
  });

  // ---------- stats ----------
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; io.disconnect(); $$("[data-n]").forEach((b) => { const end = +b.dataset.n, t0 = performance.now(); const st = (now) => { const k = still ? 1 : Math.min(1, (now - t0) / 1500), v = Math.round(end * (1 - Math.pow(1 - k, 3))); b.textContent = `${b.dataset.p || ""}${v.toLocaleString("en-US")}${b.dataset.s}`; if (k < 1) requestAnimationFrame(st); }; requestAnimationFrame(st); }); }), { threshold: 0.4 });
  io.observe($("[data-stats]"));

  // ---------- testimonials ----------
  const TMS = [
    ["I went from bartender to software engineer in 4 months. LaunchCode gave me the structure and support I needed.", "Maria Chen", "Full-Stack Graduate", "Shopify", { skin: 7, hair: 0, hairStyle: "long", top: 0, bg: 0 }, "#95BF47"],
    ["The data science curriculum was incredibly hands-on. I was building real models by week 3.", "Jamal Williams", "Data Science Graduate", "Capital One", { skin: 6, hair: 0, hairStyle: "buzz", top: 2, bg: 3, beard: true }, "#D03027"],
    ["Career services made all the difference. I had 3 offers within a month of graduating.", "Priya Patel", "UX Design Graduate", "IBM", { skin: 3, hair: 0, hairStyle: "bun", top: 1, bg: 1 }, "#1F70C1"],
    ["The part-time track let me keep my job while transitioning into tech.", "Alex Rivera", "Full-Stack Graduate", "Stripe", { skin: 2, hair: 1, hairStyle: "side", top: 4, bg: 2 }, "#635BFF"],
  ];
  $("[data-tms]").innerHTML = TMS.map(([q, n, prog, co, look, c]) => `<figure class="tm"><blockquote>“${q}”</blockquote><figcaption><span class="tm-av">${window.Art.face(look, `Portrait of ${n}`)}</span><span class="tm-who"><b>${n}</b><small>${prog}</small></span><span class="co" style="--c:${c}"><small>now at</small><b>${co}</b></span></figcaption></figure>`).join("");

  // ---------- partners marquee ----------
  const LOGOS = [["Google", "#4285F4"], ["Amazon", "#FF9900"], ["Shopify", "#95BF47"], ["Stripe", "#635BFF"], ["Capital One", "#D03027"], ["IBM", "#1F70C1"], ["Deloitte", "#86BC25"], ["Accenture", "#A100FF"]];
  const set = LOGOS.map(([n, c]) => `<li style="--c:${c}">${n}</li>`).join("");
  $("[data-track]").innerHTML = `<ul>${set}</ul><ul aria-hidden="true">${set}</ul>`;

  // ---------- financing ----------
  let fp = 0;
  function renderFin() {
    const p = PROGS[fp], monthly = Math.round((p.price / 12) * 100) / 100;
    $("[data-fins]").innerHTML = `
      <article class="fin"><span class="tagline">Best value</span><span class="f-ico">${icon("cash")}</span><h3>Pay Upfront</h3><p class="f-big">${money(p.price - 1000)}</p><p>Save $1,000 on tuition</p></article>
      <article class="fin"><span class="f-ico">${icon("cal")}</span><h3>Monthly Installments</h3><p class="f-big">${money(monthly)}<small>/mo</small></p><p>12 monthly payments, 0% interest</p></article>
      <article class="fin pop"><span class="badge">Most popular</span><span class="f-ico">${icon("percent")}</span><h3>Income Share Agreement</h3><p class="f-big">$0<small> upfront</small></p><p>Pay nothing until you earn $50K+</p></article>`;
  }
  $("[data-fin-prog]").addEventListener("change", (e) => { fp = +e.target.value; renderFin(); });
  renderFin();

  // ---------- events ----------
  const EVENTS = [["Wed", "Mar", "19", "Free Online Info Session", "7:00 PM EST", "Online (Zoom)"], ["Sat", "Mar", "22", "Campus Tour & Q&A", "10:00 AM EST", "Campus"], ["Thu", "Mar", "27", "Intro to Coding Workshop (Free)", "6:30 PM EST", "Online + Campus"]];
  const reg = new Set();
  function renderEvents() {
    $("[data-events]").innerHTML = EVENTS.map(([dow, mon, d, n, t, where], i) => `<article class="ev"><div class="ev-date"><span>${mon}</span><b>${d}</b><small>${dow}</small></div><div class="ev-body"><h3>${n}</h3><p>${icon("clock")}${dow}, ${mon}ch ${d} at ${t}</p><p class="ev-where">${where}</p>${reg.has(i) ? `<span class="ev-ok">${icon("check")}Registered</span>` : `<button class="btn btn-outline btn-sm" type="button" data-reg="${i}">Register</button>`}</div></article>`).join("").replace(/March /g, "March ");
  }
  renderEvents();
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-reg]"); if (!b) return;
    const i = +b.dataset.reg, ev = EVENTS[i];
    show(`<p class="kicker">Register · free</p><h2 id="dlg-title">${ev[3]}</h2><p>${ev[0]}, March ${ev[2]} at ${ev[4]} · ${ev[5]}</p><form class="form" novalidate data-reg-form><label class="field">Name<input name="name" autocomplete="name"></label><label class="field">Email<input name="email" type="email" autocomplete="email"></label><p class="err" role="alert" data-reg-err></p><button class="btn btn-primary" type="submit">Reserve my seat</button></form>`);
    $("[data-reg-form]").addEventListener("submit", (ev2) => {
      ev2.preventDefault(); const f = ev2.target.elements;
      if (!f.name.value.trim() || !valid(f.email.value.trim())) { $("[data-reg-err]").textContent = "Please add your name and a valid email."; return; }
      reg.add(i); renderEvents();
      show(`<div class="ok">${icon("check")}<h2 id="dlg-title">You're registered</h2><p>${esc(ev[3])} — a calendar invite would go to ${esc(f.email.value.trim())}. (Demo)</p></div>`);
    });
  });

  // ---------- FAQ ----------
  const FAQ = [
    ["Do I need prior coding experience?", "No! Our programs are designed for complete beginners. The free 2-week prep module covers the basics before day one."],
    ["What is the class schedule?", "Full-time: Mon-Fri 9AM-5PM. Part-time: Tue/Thu evenings 6:30-9:30PM + Saturdays 10AM-4PM."],
    ["What happens if I don't get a job?", "Our ISA means you don't pay until you're hired earning $50K+. Career coaching continues for 12 months after graduation."],
    ["Can I visit the campus?", "Yes! We offer campus tours every Saturday at 10AM, or book a time that suits you."],
    ["Is the program online or in person?", "Both. Every cohort runs live on campus and remotely with the same instructors and schedule."],
    ["What computer do I need?", "Any laptop from the last 5 years with 8GB+ RAM. Loaner laptops are available on request."],
    ["Are scholarships available?", "Yes — partial scholarships for women, veterans and underrepresented groups in tech, plus GI Bill® and MyCAA."],
    ["How big are the classes?", "Cohorts cap at 24 students with a 1:8 instructor-to-student ratio during labs."],
  ];
  $("[data-faq]").innerHTML = FAQ.map(([q, a]) => `<details><summary>${q}<span class="pm" aria-hidden="true"></span></summary><p>${a}</p></details>`).join("");
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  // ---------- chrome ----------
  $("[data-announce-x]").addEventListener("click", () => { $("[data-announce]").hidden = true; });
  const menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  function closeMenu() { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); }
  mbtn.addEventListener("click", () => { const o = menu.hidden; menu.hidden = !o; mbtn.setAttribute("aria-expanded", String(o)); mbtn.innerHTML = icon(o ? "close" : "menu"); });
  $$("a:not([data-soon])", menu).forEach((a) => a.addEventListener("click", closeMenu));
  function onScroll() { $("[data-nav]").classList.toggle("scrolled", scrollY > 10); const f = $(".final").getBoundingClientRect(); document.body.classList.toggle("show-bar", scrollY > 500 && f.top > innerHeight); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }
})();
