(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const C = window.CONTENT;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = () => (reduce.matches ? "auto" : "smooth");

  /* ---------- imagery ---------- */
  $("[data-cover]").innerHTML = Art.shot("atlas", "Atlas Design System documentation, showing button variants and a color palette");
  $("[data-portrait]").innerHTML = Art.me("Illustrated portrait of Mara Ellison, smiling, with long auburn hair, on a sage background");

  /* ---------- skills + experience ---------- */
  $("[data-toolkit]").innerHTML = C.skills.map(([g, items]) => `<div><h3>${g}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("");
  $("[data-timeline]").innerHTML = C.experience.map(([t, role, co, d]) => `<li><time>${t}</time><h3>${esc(co)}</h3><p class="role">${esc(role)}</p><p>${esc(d)}</p></li>`).join("");

  /* ---------- projects (inline expansion, one at a time) ---------- */
  $("[data-projects]").innerHTML = C.projects.map((p) => `<article class="pc ${p.size}" data-pc="${p.id}">
    <button type="button" class="pc-sum" aria-expanded="false" aria-controls="cs-${p.id}" data-open="${p.id}">
      <div class="img">${Art.shot(p.id, `${p.title} interface`)}</div>
      <div class="txt"><div class="meta"><span>${esc(p.kicker)}</span><span>${p.year}</span></div><h3>${esc(p.title)}</h3><p class="d">${esc(p.desc)}</p>
      <ul class="tags" aria-label="Technologies">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul><span class="toggle" data-tg>${icon("i-plus")}<span>Read case study</span></span></div>
    </button>
    <div class="cs" id="cs-${p.id}" role="region" aria-label="${esc(p.title)} case study" inert><div class="cs-in"><div class="cs-body">
      <section><h4>01 Context</h4><p>${esc(p.context)}</p></section>
      <section style="grid-column: span 8"><h4>02 Role &amp; Approach</h4><p>${esc(p.approach)}</p></section>
      <div class="out"><h4 style="grid-column:1/-1;margin:0">03 Outcome</h4>${p.outcome.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
      <section style="grid-column:1/-1"><h4>04 Stack</h4><ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>
      <div class="end"><h4 class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">05 Links</h4>${p.links.map(([l, k]) => `<a class="link" href="#projects" data-soon="${esc(p.title)} — ${l}">${icon(k === "gh" ? "i-gh" : "i-ext")}${l}</a>`).join("")}<button class="close" type="button" data-close="${p.id}">${icon("i-minus")}Collapse</button></div>
    </div></div></div></article>`).join("");
  function setOpen(id, open, scroll) {
    const card = $(`[data-pc="${id}"]`), btn = $(".pc-sum", card), cs = $(".cs", card);
    card.classList.toggle("open", open); btn.setAttribute("aria-expanded", open);
    if (open) cs.removeAttribute("inert"); else cs.setAttribute("inert", "");
    $("[data-tg] span", card).textContent = open ? "Close case study" : "Read case study"; $("[data-tg] use", card).setAttribute("href", open ? "#i-minus" : "#i-plus");
    if (open && scroll) setTimeout(() => card.scrollIntoView({ behavior: smooth(), block: "start" }), 60);
  }
  $("[data-projects]").addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) { const id = o.dataset.open, was = $(`[data-pc="${id}"]`).classList.contains("open"); C.projects.forEach((p) => p.id !== id && setOpen(p.id, false)); setOpen(id, !was, !was); return; }
    const c = e.target.closest("[data-close]"); if (c) { setOpen(c.dataset.close, false); const b = $(`[data-open="${c.dataset.close}"]`); b.focus({ preventScroll: true }); b.scrollIntoView({ behavior: smooth(), block: "nearest" }); }
  });
  document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; const o = $(".pc.open"); if (o && o.contains(document.activeElement)) { setOpen(o.dataset.pc, false); $(".pc-sum", o).focus(); } });

  /* ---------- resume sheet (HTML rendering of assets/resume.pdf) ---------- */
  $("[data-paper]").innerHTML = `<header><h3>${C.name}</h3><p>${C.location} · ${C.email}<br>maraellison.example · github.com/example</p></header>
    <div class="pb"><p class="ttl">${C.title}</p><p class="sum">${esc(C.summary)}</p>
    <div class="col"><h4>Experience</h4>${C.experience.map(([t, r, co, d]) => `<div class="job"><small>${t}</small><b>${esc(r)}, ${esc(co)}</b><p>${esc(d)}</p></div>`).join("")}
      <h4 style="margin-top:14px">Selected projects</h4>${C.projects.map((p) => `<div class="pj"><b>${esc(p.title)} (${p.year})</b><p>${esc(p.desc)}</p><span>${p.outcome.map(([v, l]) => `${esc(v)} ${esc(l)}`).join(" · ")}</span></div>`).join("")}</div>
    <div class="col"><h4>Skills</h4>${C.skills.map(([g, it]) => `<span class="grp">${g.toUpperCase()}</span><ul>${it.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`).join("")}
      <h4 style="margin-top:16px">Education</h4><p style="margin:0">${esc(C.education)}</p><h4 style="margin-top:16px">Speaking</h4><p style="margin:0">${esc(C.speaking.replace(/^Talks: /, ""))}</p></div></div>
    <footer>Sample resume for a fictional person, created for a demo portfolio.</footer>`;
  $("[data-dl]").addEventListener("click", () => toast("Downloading mara-ellison-resume.pdf"));

  /* ---------- scheduler (demo stand-in for a Calendly embed) ---------- */
  const SLOTS = ["09:00", "09:30", "10:30", "11:00", "13:00", "14:00", "15:30", "16:30"];
  const days = []; const d0 = new Date(); d0.setHours(12, 0, 0, 0);
  for (let d = new Date(d0); days.length < 5;) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) days.push(new Date(d)); }
  const fmtDay = (d, o) => d.toLocaleDateString("en-US", o);
  let day = 0, slot = null;
  $("[data-tz]").textContent = "Times in Copenhagen (CET)";
  const taken = (di, si) => (di * 3 + si * 5) % 7 === 0;
  function renderSched() {
    $("[data-days]").innerHTML = days.map((d, i) => `<button type="button" aria-pressed="${i === day}" data-day="${i}">${fmtDay(d, { weekday: "short" })}<small>${fmtDay(d, { month: "short", day: "numeric" })}</small></button>`).join("");
    $("[data-slots]").innerHTML = SLOTS.map((s, i) => `<button type="button" aria-pressed="${slot === i}" data-slot="${i}" ${taken(day, i) ? 'disabled aria-label="' + s + ', unavailable"' : ""}>${s}</button>`).join("");
    const f = $("[data-book]"); f.hidden = slot === null;
    if (slot !== null) $("[data-sel]").textContent = `${fmtDay(days[day], { weekday: "long", month: "long", day: "numeric" })} at ${SLOTS[slot]} CET · 30 min video call`;
  }
  $("[data-sched]").addEventListener("click", (e) => {
    const d = e.target.closest("[data-day]"); if (d) { day = +d.dataset.day; slot = null; $("[data-book-msg]").textContent = ""; renderSched(); return; }
    const s = e.target.closest("[data-slot]"); if (s && !s.disabled) { slot = +s.dataset.slot; $("[data-book-msg]").textContent = ""; renderSched(); $("[data-book] input").focus(); }
  });
  $("[data-book]").addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target, n = f.name.value.trim(), m = f.email.value.trim(), msg = $("[data-book-msg]");
    f.name.toggleAttribute("aria-invalid", n.length < 2); f.email.toggleAttribute("aria-invalid", !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m));
    if (n.length < 2 || f.email.hasAttribute("aria-invalid")) { msg.className = "msg bad"; msg.textContent = "Please add your name and a valid email."; (n.length < 2 ? f.name : f.email).focus(); return; }
    const d = days[day], [h, mi] = SLOTS[slot].split(":").map(Number), pad = (x) => String(x).padStart(2, "0");
    const ymd = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`, end = new Date(2000, 0, 1, h, mi + 30);
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mara Ellison demo//EN\r\nBEGIN:VEVENT\r\nUID:${ymd}-${h}${mi}@maraellison.example\r\nDTSTAMP:${ymd}T000000Z\r\nDTSTART;TZID=Europe/Copenhagen:${ymd}T${pad(h)}${pad(mi)}00\r\nDTEND;TZID=Europe/Copenhagen:${ymd}T${pad(end.getHours())}${pad(end.getMinutes())}00\r\nSUMMARY:Intro call with Mara Ellison\r\nDESCRIPTION:Demo booking - not a real meeting.\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
    msg.className = "msg ok"; msg.innerHTML = `${icon("i-check")} Booked for ${esc($("[data-sel]").textContent.split(" · ")[0])}. <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}" download="intro-call.ics">Add to calendar (.ics)</a><br><small style="font-weight:400;color:var(--muted)">Demo: no invitation was sent to ${esc(m)}.</small>`;
    $(".i", msg).style.cssText = "display:inline;vertical-align:-3px";
  });
  renderSched();

  /* ---------- cursor-driven hero (fine pointers only; reduced on tablets) ---------- */
  const hero = $("[data-hero]"), layers = $$("[data-depth]"), cover = $(".cover");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  let raf = 0, tx = 0, ty = 0;
  hero.addEventListener("pointermove", (e) => {
    if (!fine.matches || reduce.matches || innerWidth <= 760 || e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect(), k = innerWidth <= 1024 ? 0.45 : 1;
    tx = ((e.clientX - r.left) / r.width - 0.5) * k; ty = ((e.clientY - r.top) / r.height - 0.5) * k;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => { layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate3d(${tx * d * 60}px, ${ty * d * 40}px, 0) rotate(${tx * d * 6}deg)`; }); cover.style.transform = `translate3d(${tx * -18}px, ${ty * -14}px, 0) rotate(${tx * -1.5}deg)`; hero.dataset.moved = "1"; });
  });
  hero.addEventListener("pointerleave", () => { layers.forEach((l) => (l.style.transform = "")); cover.style.transform = ""; });

  /* ---------- nav: sticky border, scroll spy, mobile menu ---------- */
  const nav = $("[data-nav]"), links = $("[data-links]"), burger = $("[data-burger]");
  addEventListener("scroll", () => nav.classList.toggle("solid", scrollY > 10), { passive: true });
  function menu(open) { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu"); }
  burger.addEventListener("click", () => menu(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) menu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { menu(false); burger.focus(); } });
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((es) => es.forEach((en) => { if (!en.isIntersecting) return; $$("[data-spy]").forEach((a) => { const on = a.dataset.spy === en.target.id; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }); }), { rootMargin: "-40% 0px -55% 0px" });
    ["top", "about", "experience", "projects", "contact", "resume"].forEach((id) => spy.observe(document.getElementById(id)));
    if (!reduce.matches) {
      const rv = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); rv.unobserve(en.target); } }), { rootMargin: "0px 0px -6% 0px" });
      $$(".sec .label, .sec h2, .about-t p, .portrait, .pull, .toolkit > div, .timeline li, .pc, .sched, .paper").forEach((el, i) => { el.classList.add("rv"); el.style.transitionDelay = `${(i % 3) * 70}ms`; rv.observe(el); });
    }
  }

  /* ---------- misc ---------- */
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon}: placeholder link in this demo portfolio.`); } });
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }
})();
