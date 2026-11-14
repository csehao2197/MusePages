(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  $$("[data-art]").forEach((el) => { el.innerHTML = window.Art[el.dataset.art](); });

  // ---------- programs ----------
  const PROGS = [
    ["piano", "Piano & Keyboard", "Classical, jazz, pop, and composition. Acoustic and digital piano. Ages 5 to adult.", 45, ["Beginner", "Intermediate", "Advanced", "Pre-Conservatory"], "#7C3AED", "Piano"],
    ["guitar", "Guitar & Strings", "Acoustic, electric, classical guitar, violin, viola, cello, and bass. Individual and chamber group options.", 42, ["Beginner", "Intermediate", "Advanced"], "#059669", "Guitar"],
    ["mic", "Voice & Vocal", "Classical technique, contemporary styles, musical theater, and songwriting. Solo and choral programs.", 48, ["Beginner", "Intermediate", "Advanced"], "#D97706", "Voice"],
    ["drum", "Drums & Percussion", "Drum kit, hand percussion, orchestral percussion, and world rhythms. Soundproofed studios.", 42, ["Beginner", "Intermediate", "Advanced"], "#E11D48", "Drums"],
  ];
  $("[data-progs]").innerHTML = PROGS.map(([ic, n, d, p, lv, c], i) => `
    <article class="prog" style="--c:${c}"><span class="p-ico">${icon(ic)}</span><h3>${n}</h3><p>${d}</p>
      <p class="price">Starting at <b>$${p}</b>/lesson</p>
      <ol class="levels" aria-label="Levels">${lv.map((l) => `<li>${l}</li>`).join("")}</ol>
      <button class="link" type="button" data-prog="${i}">Learn More ${icon("arrow")}</button></article>`).join("");

  const dlg = $("[data-dlg]");
  function show(html) { $("[data-dlg-body]").innerHTML = html; if (!dlg.open) dlg.showModal(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  const lessonPrices = (p) => [[30, p], [45, Math.round(p * 1.45)], [60, Math.round(p * 1.85)]];
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-prog]");
    if (b) {
      const [ic, n, d, p, lv, c, inst] = PROGS[+b.dataset.prog];
      show(`<p class="kicker" style="color:${c}">Program</p><h2 id="dlg-title">${n}</h2><p>${d}</p>
        <table class="ptable"><thead><tr><th>Lesson length</th><th>Per lesson</th><th>Monthly (4 lessons)</th></tr></thead><tbody>${lessonPrices(p).map(([m, v]) => `<tr><td>${m} min</td><td>$${v}</td><td>$${v * 4}</td></tr>`).join("")}</tbody></table>
        <p class="path">${lv.map((l) => `<span>${l}</span>`).join(icon("right"))}</p>
        <a class="btn btn-violet" href="#trial" data-close data-pick="${inst}">Book a free ${inst.toLowerCase()} trial</a>`);
    }
    const pick = e.target.closest("[data-pick]"); if (pick) { const sel = $("[data-trial] [name=inst]"); sel.value = pick.dataset.pick; }
    if (e.target.closest("[data-all-programs]")) show(`<h2 id="dlg-title">All programs</h2><ul class="allp">${["Piano & Keyboard", "Guitar & Strings", "Voice & Vocal", "Drums & Percussion", "Woodwinds (flute, clarinet, saxophone)", "Brass (trumpet, trombone, horn)", "Music Theory (group, levels 1-6)", "Composition & Songwriting", "Music Production (Logic, Ableton)", "Early Childhood Music (ages 3-5)", "Chamber & Jazz Ensembles", "Summer Intensive (ages 12-18)"].map((x) => `<li>${icon("ok")}${x}</li>`).join("")}</ul>`);
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); say(`${s.dataset.soon} lives on the full site; this demo is the homepage.`); closeMenu(); }
  });

  // ---------- faculty ----------
  const FAC = [
    ["Dr. Elena Vasquez", "Piano & Music Theory", "Juilliard-trained pianist. 18 years teaching. Former pianist for the Nashville Symphony. Specializes in classical technique and competition preparation.", ["Classical", "Jazz", "Competition Prep"], { skin: 3, hair: 0, hairStyle: "bun", top: 1, bg: 1 }],
    ["Marcus Williams", "Guitar & Bass", "Session guitarist with 200+ studio credits. Berklee College of Music alum. Teaches acoustic, electric, and bass guitar across all contemporary styles.", ["Rock", "Blues", "Jazz", "Fingerstyle"], { skin: 6, hair: 0, hairStyle: "buzz", top: 4, bg: 4, beard: true }],
    ["Amara Johnson", "Voice & Musical Theater", "Broadway performer (Hamilton national tour). Vocal coach for emerging artists. Specializes in contemporary commercial music and audition preparation.", ["Musical Theater", "Pop", "R&B"], { skin: 5, hair: 0, hairStyle: "curly", top: 6, bg: 5 }],
    ["Kenji Tanaka", "Drums & World Percussion", "Touring drummer for platinum-selling artists. Studied West African drumming in Ghana. Teaches all ages with an emphasis on musicality over speed.", ["Rock", "Jazz", "World", "Orchestral"], { skin: 7, hair: 0, hairStyle: "side", top: 7, bg: 3 }],
  ];
  $("[data-faculty]").innerHTML = FAC.map(([n, inst, bio, tags, look]) => `<article class="fac"><div class="f-img">${window.Art.face(look, `Illustrated portrait of ${n}`)}</div><h3>${n}</h3><p class="inst">${inst}</p><p class="bio">${bio}</p><ul class="tags">${tags.map((t) => `<li>${t}</li>`).join("")}</ul></article>`).join("");

  // ---------- events ----------
  const EVENTS = [
    ["Spring Recital — Piano & Strings", "Saturday, April 18, 2026 · 3:00 PM", "Crescendo Main Hall (Historic Theater Stage)", "45 student performances across all levels. Free admission. Reception to follow.", "RSVP"],
    ["Jazz Night — Student & Faculty Jam", "Friday, May 8, 2026 · 7:00 PM", "The Green Room (Downstairs Lounge)", "Open jam session featuring intermediate and advanced students alongside faculty. Light refreshments. $5 suggested donation.", "RSVP"],
    ["Summer Intensive — Auditions Open", "June 15-27, 2026 · 9:00 AM - 3:00 PM daily", "Full Campus", "Two-week intensive for serious students ages 12-18. Ensemble masterclasses, theory workshops, and a final showcase concert.", "Apply Now"],
  ];
  const rsvped = new Set();
  function renderEvents() {
    $("[data-events]").innerHTML = EVENTS.map(([t, d, loc, desc, cta], i) => `<article class="ev"><p class="ev-date">${icon("cal")}${d}</p><h3>${t}</h3><p class="ev-loc">${icon("pin")}${loc}</p><p>${desc}</p>${rsvped.has(i) ? `<p class="done">${icon("ok")}${cta === "RSVP" ? "You're on the guest list" : "Application started"}</p>` : `<button class="btn ${cta === "RSVP" ? "btn-outline" : "btn-violet"}" type="button" data-ev="${i}">${cta} ${icon("arrow")}</button>`}</article>`).join("");
  }
  renderEvents();
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ev]"); if (!b) return;
    const i = +b.dataset.ev, [t, d, , , cta] = EVENTS[i], apply = cta !== "RSVP";
    show(`<p class="kicker">${apply ? "Audition application" : "RSVP"}</p><h2 id="dlg-title">${t}</h2><p>${d}</p><form class="mini" novalidate data-ev-form><label class="f2">Name<input name="name" autocomplete="name"></label><label class="f2">Email<input name="email" type="email" autocomplete="email"></label>${apply ? `<label class="f2">Instrument<input name="inst" placeholder="e.g. Cello"></label>` : `<label class="f2">Guests<select name="guests"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>`}<p class="err" role="alert" data-ev-err></p><button class="btn btn-violet" type="submit">${apply ? "Submit application" : "Reserve seats"}</button></form>`);
    $("[data-ev-form]").addEventListener("submit", (ev) => {
      ev.preventDefault(); const f = ev.target.elements;
      if (!f.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) || (apply && !f.inst.value.trim())) { $("[data-ev-err]").textContent = `Please add your name, a valid email${apply ? " and your instrument" : ""}.`; return; }
      rsvped.add(i); renderEvents();
      show(`<div class="okbox">${icon("ok")}<h2 id="dlg-title">${apply ? "Application received" : "See you there!"}</h2><p>${esc(t)} — confirmation would go to ${esc(f.email.value.trim())}. (Demo)</p></div>`);
    });
  });

  // ---------- testimonials (swipe on mobile) ----------
  const TMS = [
    ["My daughter started piano at age 6 with zero interest in practicing. Three years later, she performed Chopin at the spring recital and asked to add a second lesson per week. Dr. Vasquez is a miracle worker.", "Jennifer M.", "Parent"],
    ["I picked up guitar at 42 thinking it was too late. Marcus had me playing songs I loved within a month. No judgment, no pressure — just genuine encouragement and smart teaching.", "Robert K.", "Adult beginner"],
    ["Crescendo prepared me for my Berklee audition better than any program I've seen. The theory classes and performance opportunities gave me real confidence on stage.", "Aisha T.", "Student (now at Berklee College of Music)"],
  ];
  const tms = $("[data-tms]");
  tms.innerHTML = TMS.map(([q, n, r]) => `<figure class="tm"><svg class="i qm" aria-hidden="true"><use href="#i-quote"/></svg><blockquote>“${q}”</blockquote><p class="stars" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</p><figcaption><b>${n}</b><span>${r}</span></figcaption></figure>`).join("");
  $("[data-dots]").innerHTML = TMS.map((_, i) => `<button type="button" aria-label="Show testimonial ${i + 1}" data-dot="${i}"></button>`).join("");
  function syncDots() { const w = tms.clientWidth, i = Math.round(tms.scrollLeft / Math.max(1, w * 0.86)); $$("[data-dot]").forEach((d, k) => d.setAttribute("aria-current", String(k === Math.min(i, TMS.length - 1)))); }
  tms.addEventListener("scroll", syncDots, { passive: true });
  $("[data-dots]").addEventListener("click", (e) => { const d = e.target.closest("[data-dot]"); if (!d) return; const card = tms.children[+d.dataset.dot]; tms.scrollTo({ left: card.offsetLeft - tms.offsetLeft, behavior: "smooth" }); });
  syncDots();

  // ---------- trial form ----------
  const tf = $("[data-trial]");
  tf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = tf.elements, miss = [];
    if (!f.name.value.trim()) miss.push("the student's name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (f.phone.value.replace(/\D/g, "").length < 10) miss.push("a 10-digit phone number");
    if (miss.length) { $("[data-t-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-t-err]").textContent = "";
    $("[data-t-text]").textContent = `Thank you! We'll call ${f.phone.value.trim()} within one business day to schedule ${f.name.value.trim()}'s free 30-minute ${f.inst.value.toLowerCase()} trial (age group ${f.age.value}). (Demo: nothing was sent.)`;
    $("[data-t-done]").hidden = false; tf.reset();
  });

  // ---------- nav ----------
  const menu = $("[data-menu]"), ob = $("[data-menu-open]");
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; ob.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  ob.addEventListener("click", () => { menu.hidden = false; ob.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("[data-menu-close]").focus(); });
  $("[data-menu-close]").addEventListener("click", closeMenu);
  $$("a:not([data-soon])", menu).forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  addEventListener("scroll", () => $("[data-nav]").classList.toggle("scrolled", scrollY > 8), { passive: true });
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3000); }
})();
