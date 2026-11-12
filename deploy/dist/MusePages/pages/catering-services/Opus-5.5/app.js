(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $$("[data-menu-art]").forEach((el) => { el.innerHTML = Art.menuArt(el.dataset.menuArt); });
  $$(".stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  /* Nav */
  const nav = $("[data-nav]"), burger = $("[data-burger]"), mnav = $("#mnav");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > 30 || !mnav.hidden);
  burger.addEventListener("click", () => {
    const open = mnav.hidden;
    mnav.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    $("use", burger).setAttribute("href", open ? "#i-x" : "#i-menu");
    syncNav();
  });
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); $("use", burger).setAttribute("href", "#i-menu"); syncNav(); }));

  /* Parallax */
  const bg = $("[data-parallax]"), hero = $(".hero");
  let ticking = false;
  function onScroll() {
    syncNav();
    if (reduced || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, hero.offsetHeight);
      bg.style.transform = `translate3d(0, ${y * 0.3}px, 0)`;
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu tabs */
  const tabs = $$("[role=tab]");
  function select(i, focus) {
    tabs.forEach((t, j) => {
      const on = i === j;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute("aria-controls")}`).hidden = !on;
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i));
    t.addEventListener("keydown", (e) => {
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault();
      select((n + tabs.length) % tabs.length, true);
    });
  });

  /* Gallery */
  const events = [
    ["wedding", "Wedding", "Hartwell–Moreno Wedding", 180, "The Glasshouse at Linden Park", "Garden reception with string lights and floral centerpieces"],
    ["corporate", "Corporate", "Northbeam Product Launch", 320, "Pier 9 Event Hall", "Product launch buffet with chafing stations"],
    ["party", "Private", "Ellison 40th Anniversary", 85, "Private residence, Cedar Hills", "Champagne tower and dessert table"],
    ["dinner", "Wedding", "Rehearsal Dinner for the Parks", 60, "Osteria Lume private room", "Candlelit plated rehearsal dinner"],
    ["raw", "Corporate", "Meridian Capital Board Dinner", 24, "Meridian HQ, 40th floor", "Oyster bar for an executive board dinner"],
    ["brunch", "Private", "Spring Garden Brunch", 45, "Wildflower Farm", "Brunch send-off spread with spritzes"],
  ];
  const grid = $("[data-masonry]");
  grid.innerHTML = events.map(([scene, cat, title, guests, venue, alt], i) => `<figure class="ev" data-cat="${cat}">
    <button type="button" data-ev="${i}" aria-label="View ${title}"><span class="art">${Art.event(scene, alt)}</span><span class="badge">${cat}</span></button>
    <figcaption><div><b>${title}</b><span class="venue">${venue}</span></div><span>${icon("users")}${guests} guests</span></figcaption></figure>`).join("");
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filter]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$(".ev", grid).forEach((ev) => { ev.hidden = b.dataset.filter !== "all" && ev.dataset.cat !== b.dataset.filter; });
  }));

  const lb = $("[data-lb]");
  let li = 0, lastFocus;
  const visible = () => $$(".ev:not([hidden]) [data-ev]", grid).map((b) => +b.dataset.ev);
  function show(i) {
    li = i;
    const [scene, cat, title, guests, venue, alt] = events[i];
    $("[data-lb-img]").innerHTML = Art.event(scene, alt);
    $("[data-lb-cap]").innerHTML = `<b>${title}</b><span>${cat} · ${guests} guests · ${venue}</span>`;
  }
  const step = (d) => { const v = visible(); const k = v.indexOf(li); show(v[(k + d + v.length) % v.length]); };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  grid.addEventListener("click", (e) => { const b = e.target.closest("[data-ev]"); if (!b) return; lastFocus = b; show(+b.dataset.ev); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); });
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb-step]").forEach((b) => b.addEventListener("click", () => step(+b.dataset.lbStep)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
  });
  swipe(lb, step);

  function swipe(el, fn) {
    let x0 = null, y0 = 0;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1); x0 = null; }, { passive: true });
  }

  /* Testimonials */
  const slides = $("[data-slides]"), quotes = $$(".quote", slides), sd = $("[data-sdots]"), slider = $("[data-slider]");
  let si = 0, st = null, hold = false;
  sd.innerHTML = quotes.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}"></button>`).join("");
  function go(i) {
    si = (i + quotes.length) % quotes.length;
    slides.style.transform = `translateX(-${si * 100}%)`;
    quotes.forEach((q, j) => q.setAttribute("aria-hidden", String(j !== si)));
    $$("button", sd).forEach((d, j) => d.setAttribute("aria-current", String(j === si)));
  }
  const auto = () => { clearInterval(st); st = reduced || hold ? null : setInterval(() => go(si + 1), 7000); };
  $$("button", sd).forEach((d, i) => d.addEventListener("click", () => { go(i); auto(); }));
  $$("[data-s]").forEach((b) => b.addEventListener("click", () => { go(si + +b.dataset.s); auto(); }));
  ["mouseenter", "focusin"].forEach((ev) => slider.addEventListener(ev, () => { hold = true; auto(); }));
  ["mouseleave", "focusout"].forEach((ev) => slider.addEventListener(ev, () => { hold = false; auto(); }));
  swipe(slides, (d) => { go(si + d); auto(); });
  go(0); auto();

  /* Inquiry form */
  const form = $("[data-inquiry]"), done = $("[data-done]");
  const perPerson = { Corporate: [35, 55], Wedding: [75, 110], "Private Party": [45, 70], Other: [35, 85] };
  const pkg = { Classic: 35, Premium: 55, Luxury: 85 };
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const minDate = new Date(); minDate.setDate(minDate.getDate() + 7);
  form.date.min = iso(minDate);
  function estimate() {
    const g = +form.guests.value, t = form.type.value, p = form.package.value;
    const out = $("[data-est]"), note = $("[data-est-note]");
    if (!t || !g || g < 20 || g > 500) { out.textContent = "—"; note.textContent = g && (g < 20 || g > 500) ? "We cater for 20 to 500 guests." : "Choose an event type and guest count to see a range."; return; }
    if (p) { out.textContent = money(pkg[p] * g); note.textContent = `${p} package · ${money(pkg[p])}/person × ${g} guests, before staffing, rentals and tax.`; return; }
    const [lo, hi] = perPerson[t];
    out.textContent = `${money(lo * g)} – ${money(hi * g)}`;
    note.textContent = `${t} menus typically run ${money(lo)}–${money(hi)} per person for ${g} guests, before staffing, rentals and tax.`;
  }
  ["input", "change"].forEach((ev) => form.addEventListener(ev, estimate));
  $$("[data-prefill]").forEach((a) => a.addEventListener("click", () => { form.type.value = a.dataset.prefill; estimate(); }));
  $$("[data-choose]").forEach((b) => b.addEventListener("click", () => {
    form.package.value = b.dataset.choose;
    estimate();
    $("#inquiry").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    setTimeout(() => form.name.focus({ preventScroll: true }), reduced ? 0 : 600);
  }));
  const messages = { guests: "Enter 20 to 500 guests.", date: "Choose a date at least one week from today.", phone: "Enter a valid phone number.", email: "Enter a valid email address." };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input, select, textarea", form).forEach((f) => {
      const bad = !f.checkValidity();
      f.toggleAttribute("aria-invalid", bad);
      let hint = f.parentElement.querySelector("small");
      if (bad) { if (!hint) { hint = document.createElement("small"); f.parentElement.appendChild(hint); } hint.textContent = messages[f.name] || "This field is required."; }
      else if (hint) hint.remove();
      if (bad && !first) first = f;
    });
    $("[data-form-err]").textContent = first ? "Please fix the highlighted fields." : "";
    if (first) { first.focus(); return; }
    const d = new Date(`${form.date.value}T12:00:00`);
    $("[data-done-text]").textContent = `Thanks, ${form.name.value.split(" ")[0]}. We'll email ${form.email.value} within 24 hours with a proposal for your ${form.type.value.toLowerCase()} on ${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} for ${form.guests.value} guests. Reference SA-${Math.floor(10000 + Math.random() * 90000)}. (Demo — nothing was sent.)`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
  $("[data-again]").addEventListener("click", () => { form.reset(); estimate(); done.hidden = true; form.hidden = false; form.name.focus(); });

  /* FAQ: one open at a time */
  $$(".faq details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) $$(".faq details").forEach((o) => { if (o !== d) o.open = false; }); }));
})();
