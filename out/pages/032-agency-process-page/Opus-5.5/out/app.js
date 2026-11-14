(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $$("[data-art]").forEach((el) => { el.innerHTML = window.Art[el.dataset.art](); });

  // ---------- toast ----------
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3400); }
  document.addEventListener("click", (e) => {
    const s = e.target.closest("[data-soon]");
    if (s) { e.preventDefault(); closeMenu(); say(`${s.dataset.soon} lives on the full site; this demo is the Process page.`); }
  });
  $("[data-pdf]").addEventListener("click", () => say("Downloading the Frameshift process overview (PDF)."));

  // ---------- menu overlay ----------
  const menu = $("[data-menu]"), openBtn = $("[data-menu-open]");
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; openBtn.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  openBtn.addEventListener("click", () => { menu.hidden = false; openBtn.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("[data-menu-close]").focus(); });
  $("[data-menu-close]").addEventListener("click", () => { closeMenu(); openBtn.focus(); });
  $$("a:not([data-soon])", menu).forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // ---------- timeline follows scroll ----------
  const timeline = $("[data-timeline]"), nodes = $$("[data-node]"), phases = $$("[data-phase]");
  let active = 0;
  function setActive(i) {
    active = i;
    nodes.forEach((n, k) => { n.classList.toggle("active", k === i); n.classList.toggle("done", k < i); if (k === i) n.setAttribute("aria-current", "step"); else n.removeAttribute("aria-current"); });
    timeline.style.setProperty("--progress", String(i / 3));
  }
  function onScroll() {
    const mid = innerHeight * 0.45;
    let i = 0;
    phases.forEach((p, k) => { if (p.getBoundingClientRect().top < mid) i = k; });
    if (i !== active) setActive(i);
    const heroBottom = $(".hero").getBoundingClientRect().bottom, book = $("#book").getBoundingClientRect();
    document.body.classList.toggle("show-bar", heroBottom < 0 && !(book.top < innerHeight && book.bottom > 0));
  }
  setActive(0);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  nodes.forEach((n) => n.addEventListener("click", () => setActive(+n.dataset.node)));

  // ---------- count-up ----------
  function run(el) {
    const end = +el.dataset.count, dec = +(el.dataset.decimals || 0), t0 = performance.now(), dur = 1500;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = (now) => { const k = still ? 1 : Math.min(1, (now - t0) / dur), v = end * (1 - Math.pow(1 - k, 3)); el.textContent = `${v.toFixed(dec)}${el.dataset.suffix || ""}`; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { $$("[data-count]", en.target).forEach(run); io.unobserve(en.target); } }), { threshold: 0.35 });
  io.observe($("[data-stats]"));

  // ---------- FAQ: one open at a time ----------
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  // ---------- booking picker ----------
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let view = new Date(today.getFullYear(), today.getMonth(), 1), selDay = null, selSlot = null;
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const SLOTS = ["9:00", "9:30", "10:30", "11:00", "13:00", "14:00", "15:30", "16:30"];
  const isOpen = (d) => { const w = d.getDay(), diff = (d - today) / 864e5; return w > 0 && w < 6 && diff >= 1 && diff <= 60 && (d.getDate() * 7) % 5 !== 0; };
  const slotsFor = (d) => SLOTS.filter((_, i) => (d.getDate() + i * 3) % 4 !== 0);
  const fmtDay = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  function drawMonth() {
    $("[data-month-label]").textContent = `${MONTHS[view.getMonth()]} ${view.getFullYear()}`;
    const first = (view.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < first; i++) html += `<span></span>`;
    for (let d = 1; d <= days; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d), open = isOpen(date), key = date.toDateString();
      const cls = ["day", open && "open", selDay && selDay.toDateString() === key && "sel", +date === +today && "today"].filter(Boolean).join(" ");
      html += open ? `<button class="${cls}" type="button" data-day="${date.getTime()}" aria-label="${fmtDay(date)}, available">${d}</button>` : `<span class="${cls}" aria-hidden="true" style="display:grid;place-items:center">${d}</span>`;
    }
    $("[data-days]").innerHTML = html;
    const min = new Date(today.getFullYear(), today.getMonth(), 1);
    $('[data-month="-1"]').disabled = view <= min;
    $('[data-month="1"]').disabled = view.getMonth() === (today.getMonth() + 2) % 12;
  }
  function drawSlots() {
    const box = $("[data-slots]");
    if (!selDay) { box.innerHTML = `<p class="pk-hint">Pick a highlighted day to see open times.</p>`; return; }
    box.innerHTML = `<h4>${fmtDay(selDay)}</h4><div class="slots">${slotsFor(selDay).map((s) => `<button class="slot${selSlot === s ? " sel" : ""}" type="button" data-slot="${s}" aria-pressed="${selSlot === s}">${s}</button>`).join("")}</div>`;
  }
  $$("[data-month]").forEach((b) => b.addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + +b.dataset.month, 1); drawMonth(); }));
  $("[data-days]").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (!b) return; selDay = new Date(+b.dataset.day); selSlot = null; drawMonth(); drawSlots(); $("[data-book-err]").textContent = ""; });
  $("[data-slots]").addEventListener("click", (e) => { const b = e.target.closest("[data-slot]"); if (!b) return; selSlot = b.dataset.slot; drawSlots(); });
  drawMonth();
  const bf = $("[data-book-form]");
  bf.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = bf.elements.email.value.trim(), miss = [];
    if (!selDay || !selSlot) miss.push("a day and time");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) miss.push("a valid work email");
    if (miss.length) { $("[data-book-err]").textContent = `Please choose ${miss.join(" and ")}.`; return; }
    $("[data-book-err]").textContent = "";
    $("[data-book-text]").textContent = `${fmtDay(selDay)} at ${selSlot}. A calendar invite would go to ${email}. (Demo: nothing was sent.)`;
    $("[data-book-done]").hidden = false;
  });
  $("[data-book-reset]").addEventListener("click", () => { $("[data-book-done]").hidden = true; selSlot = null; drawSlots(); });

  // ---------- newsletter ----------
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#news-email").value.trim(), msg = $("[data-news-msg]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg.style.color = "#FCA5A5"; msg.textContent = "Please enter a valid email."; return; }
    msg.style.color = ""; msg.textContent = "Subscribed — the next issue arrives on the first Tuesday. (Demo)"; e.target.reset();
  });

  window.MuseFrameshift = { active: () => active, picked: () => [selDay && selDay.toDateString(), selSlot] };
})();
