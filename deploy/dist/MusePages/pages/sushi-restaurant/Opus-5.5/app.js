(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $("[data-art=chef]").innerHTML = Art.chef();
  $("[data-art=map]").innerHTML = Art.map();
  $$("[data-dish]").forEach((d) => d.insertAdjacentHTML("afterbegin", Art.dish(d.dataset.dish, d.dataset.label)));
  $$("[data-strip]").forEach((s) => { s.innerHTML = Art.strip(s.dataset.strip, s.dataset.label); });
  $$("[data-stars]").forEach((s) => { s.innerHTML = icon("star").repeat(+s.dataset.stars); });

  /* Fade-in on scroll */
  if ("IntersectionObserver" in window && !reduced) {
    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* Nav */
  const nav = $("[data-nav]"), burger = $("[data-burger]"), mnav = $("#mnav");
  const sync = () => nav.classList.toggle("solid", window.scrollY > 40 || !mnav.hidden);
  window.addEventListener("scroll", sync, { passive: true });
  const setMenu = (open) => { mnav.hidden = !open; burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-x" : "#i-menu"); sync(); };
  burger.addEventListener("click", () => setMenu(mnav.hidden));
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !mnav.hidden) { setMenu(false); burger.focus(); } });
  sync();

  /* Gallery + lightbox */
  const names = ["interior", "torch", "sashimi", "sake", "noren", "course"];
  const gal = $("[data-gallery]");
  gal.innerHTML = names.map((n, i) => `<button class="gi g${i + 1}" type="button" data-g="${i}" aria-label="View photo: ${Art.galLabels[n]}">${Art.gallery(n)}<span class="plus" aria-hidden="true">${icon("plus")}</span></button>`).join("");
  const lb = $("[data-lb]");
  let gi = 0, lastFocus;
  const show = (i) => { gi = (i + names.length) % names.length; $("[data-lb-img]").innerHTML = Art.gallery(names[gi]); $("[data-lb-cap]").textContent = `${Art.galLabels[names[gi]]} · ${gi + 1} / ${names.length}`; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  $$("[data-g]").forEach((b) => b.addEventListener("click", () => { lastFocus = b; show(+b.dataset.g); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); }));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb-step]").forEach((b) => b.addEventListener("click", () => show(gi + +b.dataset.lbStep)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") show(gi + 1); else if (e.key === "ArrowLeft") show(gi - 1); });
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) show(gi + (dx < 0 ? 1 : -1)); x0 = null; }, { passive: true });

  /* Review dots (mobile swipe) */
  const reviews = $("[data-reviews]"), rdots = $("[data-rv-dots]");
  rdots.innerHTML = $$(".rv", reviews).map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");
  reviews.addEventListener("scroll", () => { const w = $(".rv", reviews).offsetWidth + 14; const i = Math.round(reviews.scrollLeft / w); $$("i", rdots).forEach((d, j) => d.classList.toggle("on", i === j)); }, { passive: true });

  /* Full menu modal */
  const full = [["Nigiri · per piece", [["Otoro", "Bluefin tuna belly, Oma", 14], ["Chutoro", "Medium-fat tuna", 10], ["Uni", "Hokkaido sea urchin", 12], ["Sakura Masu", "Cherry trout, Nagano", 8], ["Madai", "Sea bream, Ehime", 7], ["Aji", "Horse mackerel, ginger & scallion", 6]]],
    ["Small plates", [["Chawanmushi", "Dashi custard, seasonal topping", 12], ["Aburi Salmon", "Torched, yuzu kosho", 16], ["Miso Soup", "Red miso, clams", 6]]],
    ["Sake · by the glass", [["Dassai 23", "Junmai Daiginjo, Yamaguchi", 28], ["Kokuryu Shizuku", "Daiginjo, Fukui", 24], ["Hakkaisan", "Junmai Ginjo, Niigata", 16], ["Sake pairing", "Six pours with omakase", 65]]]];
  $("[data-full-menu]").innerHTML = full.map(([h, items]) => `<h3>${h}</h3><ul>${items.map(([n, d, p]) => `<li><div><b>${n}</b><span>${d}</span></div><b>$${p}</b></li>`).join("")}</ul>`).join("");
  $$("[data-open=menu]").forEach((b) => b.addEventListener("click", () => $('[data-modal="menu"]').showModal()));
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  /* Reservation */
  const form = $("[data-res]"), done = $("[data-done]");
  const timesFor = { omakase: ["6:00 PM", "8:30 PM"], bar: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"] };
  $("[data-party]").innerHTML = Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1} guest${i ? "s" : ""}</option>`).join("");
  const minDate = (pref) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + (pref === "omakase" ? 2 : 0)); return d; };
  function sync2() {
    const pref = form.pref.value, sel = $("[data-time]"), prev = sel.value;
    sel.innerHTML = timesFor[pref].map((t) => `<option>${t}</option>`).join("");
    if (timesFor[pref].includes(prev)) sel.value = prev;
    form.date.min = iso(minDate(pref));
    const party = +form.party.value, hints = [];
    if (pref === "omakase") hints.push("Omakase seatings are at 6:00 PM and 8:30 PM and must be booked 48 hours ahead.");
    if (party >= 6) hints.push("Parties of 6–8 can also book our private dining room — mention it in your requests.");
    $("[data-hint]").textContent = hints.join(" ");
  }
  form.addEventListener("change", (e) => { if (["pref", "party"].includes(e.target.name)) sync2(); if (e.target.name === "date") validateDate(); });
  function validateDate() {
    const f = form.date;
    if (!f.value) { f.setCustomValidity(""); return; }
    const d = new Date(`${f.value}T00:00:00`), pref = form.pref.value;
    let msg = "";
    if ([0, 1].includes(d.getDay())) msg = "We're closed Sunday and Monday — please choose Tuesday through Saturday.";
    else if (d < minDate(pref)) msg = pref === "omakase" ? "Omakase requires at least 48 hours' notice — please choose a later date or the à la carte bar." : "Please choose today or a future date.";
    f.setCustomValidity(msg);
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateDate();
    let first = null;
    $$("input:not([type=radio]), select, textarea", form).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    $("[data-err]").textContent = first ? (first.validationMessage || "Please complete the highlighted fields.") : "";
    if (first) { first.focus(); return; }
    const d = new Date(`${form.date.value}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    $("[data-done-text]").textContent = `${form.pref.value === "omakase" ? "Omakase counter" : "À la carte bar"} for ${form.party.value} on ${d} at ${form.time.value}. We'll confirm by email to ${form.email.value} within 2 hours. Request HK-${Math.floor(1000 + Math.random() * 9000)}. (Demo — nothing was sent.)`;
    form.hidden = true; done.hidden = false; done.focus();
  });
  $("[data-again]").addEventListener("click", () => { form.reset(); sync2(); done.hidden = true; form.hidden = false; $("[data-err]").textContent = ""; });
  $("[data-omakase-cta]").addEventListener("click", () => { form.pref.value = "omakase"; sync2(); });
  sync2();

  /* Status */
  const now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const open = day >= 2 && day <= 6;
  $("[data-status]").textContent = open && h >= 17.5 && h < 22 ? "Open now · until 10:00 PM" : open && h < 17.5 ? "Opens today at 5:30 PM" : "Closed now · dinner Tuesday–Saturday from 5:30 PM";

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = $("#news-email"), ok = i.checkValidity();
    i.setAttribute("aria-invalid", String(!ok));
    $("[data-news-msg]").textContent = ok ? "Arigatō — you'll hear about our next seasonal menu first. (Demo — nothing was sent.)" : "Please enter a valid email address.";
    if (ok) { e.target.reset(); toast("Subscribed"); }
  });
})();
