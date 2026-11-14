(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const PROJECTS = [
    { title: "Notion Calendar Redesign", tag: "Product Design · Mobile · 2025", art: "calendar", frame: "phone-frame",
      desc: "Redesigned Notion's mobile calendar to support multi-workspace scheduling. Reduced task creation time by 34%.",
      metrics: [["34%", "faster task creation"], ["4.8★", "App Store rating"], ["2M+", "daily users"]],
      problem: "People juggling personal and team workspaces kept two calendars open and double-booked themselves.",
      process: ["Diary study with 18 multi-workspace users", "Color-coded workspace filter prototyped in Figma", "Five rounds of usability tests on a one-tap event sheet"],
      outcome: "A single timeline with workspace chips and a floating quick-add, cutting task creation time by 34%." },
    { title: "Stripe Dashboard Analytics", tag: "Data Visualization · Web App · 2024", art: "dashboard", frame: "",
      desc: "Designed a unified analytics dashboard for Stripe merchants, consolidating 6 separate reporting views into one.",
      metrics: [["60%", "reduction in page switching"], ["89%", "merchant satisfaction"], ["$2.4B", "processed through new views"]],
      problem: "Merchants hopped between six reporting pages to answer one question about revenue.",
      process: ["Mapped 40 merchant questions to the data that answers them", "Built a chart component kit with shared tokens", "Beta with 300 merchants and instrumented page switching"],
      outcome: "One configurable view with comparable periods and exportable tables; page switching fell by 60%." },
    { title: "Figma Plugin Manager", tag: "UX Design · Desktop · 2024", art: "plugins", frame: "",
      desc: "Reimagined how designers discover, install, and manage plugins. Introduced categories, reviews, and one-click updates.",
      metrics: [["3x", "plugin install rate"], ["52%", "fewer support tickets"], ["800K+", "designers using it"]],
      problem: "Plugins were hard to find and harder to keep current, so support tickets piled up after every release.",
      process: ["Card sort to define seven plugin categories", "Review and rating patterns tested with power users", "Batch update flow with clear version diffs"],
      outcome: "Browsable categories, trustworthy reviews and an “Update all” tray: 3x installs and 52% fewer tickets." },
    { title: "HealthTrack Patient Portal", tag: "Healthcare UX · Web + Mobile · 2023", art: "portal", frame: "bare",
      desc: "Designed an accessible patient portal for a healthcare startup, enabling appointment booking, lab results, and messaging.",
      metrics: [["AA", "WCAG 2.1 compliant"], ["4.6★", "patient rating"], ["40%", "fewer missed appointments"]],
      problem: "Patients over 60 struggled to book visits and read lab results on the old portal.",
      process: ["Accessibility audit against WCAG 2.1 AA", "Large-target booking flow and plain-language lab ranges", "Remote tests with screen-reader and low-vision users"],
      outcome: "An AA-compliant portal with reminders and secure messaging; missed appointments dropped 40%." },
  ];

  // ---------- art ----------
  function renderArt(root = document) { $$("[data-art]", root).forEach((el) => { if (!el.firstElementChild) el.innerHTML = window.Art[el.dataset.art](); }); }

  // ---------- projects ----------
  const list = $("[data-projects]");
  list.innerHTML = PROJECTS.map((p, i) => `
    <article class="project${i % 2 ? " flip" : ""}" data-project="${i}">
      <div class="p-media"><div class="frame ${p.frame}" data-art="${p.art}"></div></div>
      <div class="p-body">
        <p class="tag">${esc(p.tag)}</p>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <ul class="metrics">${p.metrics.map(([v, l]) => `<li><b>${esc(v)}</b>${esc(l)}</li>`).join("")}</ul>
        <button class="text-link" type="button" data-open-case="${i}">View Case Study ${icon("arrow")}</button>
      </div>
    </article>`).join("");
  renderArt();

  // ---------- case study dialog ----------
  const dlg = $("[data-case]");
  let current = 0;
  function showCase(i) {
    current = (i + PROJECTS.length) % PROJECTS.length;
    const p = PROJECTS[current];
    $("[data-case-tag]").textContent = p.tag;
    $("[data-case-title]").textContent = p.title;
    $("[data-case-art]").innerHTML = `<div class="frame ${p.frame}">${window.Art[p.art]()}</div>`;
    $("[data-case-body]").innerHTML = `
      <div><h3>Problem</h3><p>${esc(p.problem)}</p></div>
      <div><h3>Process</h3><ul>${p.process.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div><h3>Outcome</h3><p>${esc(p.outcome)}</p></div>`;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  list.addEventListener("click", (e) => { const b = e.target.closest("[data-open-case]"); if (b) showCase(+b.dataset.openCase); });
  list.addEventListener("click", (e) => { if (!e.target.closest("button, a") && e.target.closest(".p-media")) showCase(+e.target.closest("[data-project]").dataset.project); });
  $$("[data-case-step]").forEach((b) => b.addEventListener("click", () => showCase(current + +b.dataset.caseStep)));
  $("[data-case-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  // ---------- nav ----------
  const nav = $("[data-nav]");
  const links = $$(".nav-links a");
  const sections = ["work", "process", "about", "contact"].map((id) => document.getElementById(id));
  function onScroll() {
    nav.classList.toggle("scrolled", scrollY > 8);
    const mid = scrollY + innerHeight * 0.35;
    let active = "";
    sections.forEach((s) => { if (s.offsetTop <= mid) active = s.id; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) active = "contact";
    links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${active}`));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // ---------- drawer ----------
  const drawer = $("[data-drawer]"), scrim = $("[data-scrim]"), openBtn = $("[data-menu-open]");
  function setMenu(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    openBtn.setAttribute("aria-expanded", String(open));
    if (open) { scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add("show")); $("[data-menu-close]").focus(); }
    else { scrim.classList.remove("show"); setTimeout(() => { if (!drawer.classList.contains("open")) scrim.hidden = true; }, 250); }
    document.body.style.overflow = open ? "hidden" : "";
  }
  openBtn.addEventListener("click", () => setMenu(true));
  $("[data-menu-close]").addEventListener("click", () => { setMenu(false); openBtn.focus(); });
  scrim.addEventListener("click", () => setMenu(false));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) setMenu(false); });

  // ---------- hero parallax ----------
  const stage = $("[data-parallax]");
  const parts = [[$(".tablet"), 10], [$(".phone"), 22], [$(".chip-card"), 34]];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && matchMedia("(hover: hover)").matches) {
    stage.closest(".hero").addEventListener("pointermove", (e) => {
      const b = stage.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      parts.forEach(([el, d]) => { el.style.transform = `translate(${(-x * d).toFixed(1)}px, ${(-y * d).toFixed(1)}px)`; });
    });
    stage.closest(".hero").addEventListener("pointerleave", () => parts.forEach(([el]) => { el.style.transform = ""; }));
  }
  if (!still) addEventListener("scroll", () => { if (scrollY < innerHeight) parts.forEach(([el, d]) => { el.style.translate = `0 ${(scrollY * d / 120).toFixed(1)}px`; }); }, { passive: true });

  // ---------- toast ----------
  const toast = $("[data-toast]"); let tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }
  $("[data-resume]").addEventListener("click", () => say("Downloading the sample resume (PDF)."));

  // ---------- contact form ----------
  const form = $("[data-form]"), err = $("[data-err]"), sent = $("[data-sent]");
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener("input", (e) => { if (e.target.getAttribute("aria-invalid") === "true") { e.target.removeAttribute("aria-invalid"); } });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, problems = [];
    const bad = (el, msg) => { el.setAttribute("aria-invalid", "true"); problems.push([el, msg]); };
    $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
    if (!f.name.value.trim()) bad(f.name, "your name");
    if (!EMAIL.test(f.email.value.trim())) bad(f.email, "a valid email");
    if (f.message.value.trim().length < 10) bad(f.message, "a message of at least 10 characters");
    if (problems.length) { err.textContent = `Please add ${problems.map((p) => p[1]).join(", ")}.`; problems[0][0].focus(); return; }
    err.textContent = "";
    $("[data-sent-text]").textContent = `Thanks, ${f.name.value.trim().split(/\s+/)[0]}. Your ${f.type.value.toLowerCase()} inquiry is noted, and Ava replies within 24 hours. (Demo: nothing was sent.)`;
    sent.hidden = false;
    $("[data-reset]").focus();
  });
  $("[data-reset]").addEventListener("click", () => { form.reset(); sent.hidden = true; form.elements.name.focus(); });

  window.MuseAva = { projects: PROJECTS.length, current: () => current };
})();
