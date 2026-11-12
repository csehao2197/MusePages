(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const longDate = (d) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $("[data-art=chef]").innerHTML = Art.chef();
  $("[data-art=location]").innerHTML = Art.location();
  $$("[data-botanical]").forEach((b) => { b.innerHTML = Art.botanical(); });
  $$("[data-farm-art]").forEach((f) => { f.innerHTML = Art.farm(f.dataset.farmArt, f.dataset.label); });
  $("[data-farm-map]").innerHTML = Art.map();
  $$(".stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  /* Nav */
  const nav = $("[data-nav]"), burger = $("[data-burger]"), mnav = $("#mnav");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > 40 || !mnav.hidden);
  window.addEventListener("scroll", syncNav, { passive: true });
  const setMenu = (open) => { mnav.hidden = !open; burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-x" : "#i-menu"); syncNav(); };
  burger.addEventListener("click", () => setMenu(mnav.hidden));
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  syncNav();

  /* Seasonal menu */
  const courses = [
    [["Heirloom Tomato Gazpacho", "roasted garlic croutons, basil oil, microgreens", 14], ["Burrata & Stone Fruit", "grilled peaches, arugula, aged balsamic, toasted hazelnuts", 18], ["Farm Egg Tartine", "sourdough, whipped ricotta, pickled shallots, herb salad", 16], ["Spring Pea Soup", "mint crème fraîche, pea shoots, lemon zest", 13]],
    [["Pan-Seared Trout", "asparagus, fingerling potatoes, brown butter, capers", 32], ["Grass-Fed Ribeye", "roasted root vegetables, bone marrow jus, chimichurri", 42], ["Wild Mushroom Risotto", "porcini, chanterelle, truffle oil, aged parmesan", 28], ["Heritage Pork Chop", "braised greens, apple mostarda, sweet potato purée", 36]],
    [["Lavender Crème Brûlée", "shortbread cookie, fresh berries", 14], ["Seasonal Fruit Galette", "vanilla bean ice cream, honey drizzle", 15], ["Dark Chocolate Torte", "raspberry coulis, whipped cream, edible flowers", 16]],
  ];
  const tabs = $$("[role=tab]"), panel = $("[data-panel]"), sel = $("[data-tab-select]");
  function showCourse(i, focus) {
    tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    if (focus) tabs[i].focus();
    sel.value = String(i);
    panel.setAttribute("aria-labelledby", tabs[i].id);
    panel.innerHTML = courses[i].map(([n, d, p]) => `<li class="dish"><h3>${n}</h3><p>${d}</p><b>$${p}</b></li>`).join("");
    panel.style.animation = "none"; void panel.offsetWidth; panel.style.animation = "";
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => showCourse(i));
    t.addEventListener("keydown", (e) => { const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: 2 }[e.key]; if (n === undefined) return; e.preventDefault(); showCourse((n + 3) % 3, true); });
  });
  sel.addEventListener("change", () => showCourse(+sel.value));
  showCourse(0);
  $("[data-full-menu]").addEventListener("click", () => toast("Our full menu changes weekly — your server will walk you through tonight's"));

  /* Farms + map */
  const farmNotes = {
    sunnyside: "Sunnyside Organic Farm · 8 miles north. Tomatoes and greens are picked the morning we serve them.",
    creamery: "Blue Ridge Creamery · 22 miles west. Butter and crème fraîche arrive twice a week from a 40-cow herd.",
    ranch: "Willow Creek Ranch · 15 miles south. Pasture-raised beef and heritage pork, butchered in-house.",
  };
  $$("[data-learn]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.learn;
    $$(".farm").forEach((f) => f.classList.toggle("on", f.dataset.farm === id));
    $$("[data-mpin]").forEach((p) => p.classList.toggle("on", p.dataset.mpin === id));
    $("[data-farm-note]").textContent = farmNotes[id];
    $(".farm-map").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }));

  /* Gallery + lightbox */
  const gis = $$("[data-g]");
  gis.forEach((g) => { g.innerHTML = Art.gallery(g.dataset.g); g.dataset.cap = Art.galLabels[g.dataset.g]; g.setAttribute("aria-label", `View photo: ${Art.galLabels[g.dataset.g]}`); });
  const gdots = $("[data-gdots]"), gallery = $("[data-gallery]");
  gdots.innerHTML = gis.map(() => "<i></i>").join("");
  const syncG = () => { const i = Math.round(gallery.scrollLeft / Math.max(1, gis[0].offsetWidth + 12)); $$("i", gdots).forEach((d, j) => d.classList.toggle("on", i === j)); };
  gallery.addEventListener("scroll", syncG, { passive: true }); syncG();
  const lb = $("[data-lb]");
  let gi = 0, lastFocus;
  const show = (i) => { gi = (i + gis.length) % gis.length; const n = gis[gi].dataset.g; $("[data-lb-img]").innerHTML = Art.gallery(n); $("[data-lb-cap]").textContent = Art.galLabels[n]; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); };
  gis.forEach((g, i) => g.addEventListener("click", () => { lastFocus = g; show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); }));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb-step]").forEach((b) => b.addEventListener("click", () => show(gi + +b.dataset.lbStep)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => { if (lb.hidden) return; if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") show(gi + 1); else if (e.key === "ArrowLeft") show(gi - 1); });
  swipe(lb, (d) => show(gi + d));
  function swipe(el, fn) {
    let x0 = null, y0 = 0;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1); x0 = null; }, { passive: true });
  }

  /* Reviews */
  const track = $("[data-rv]"), slides = $$(".rv", track), rdots = $("[data-rv-dots]"), rvSec = $(".reviews");
  let ri = 0, timer = null, hold = false;
  rdots.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}"></button>`).join("");
  const go = (i) => { ri = (i + slides.length) % slides.length; track.style.transform = `translateX(-${ri * 100}%)`; slides.forEach((s, j) => s.setAttribute("aria-hidden", String(j !== ri))); $$("button", rdots).forEach((d, j) => d.setAttribute("aria-current", String(j === ri))); };
  const auto = () => { clearInterval(timer); timer = reduced || hold ? null : setInterval(() => go(ri + 1), 6000); };
  $$("button", rdots).forEach((d, i) => d.addEventListener("click", () => { go(i); auto(); }));
  ["mouseenter", "focusin"].forEach((ev) => rvSec.addEventListener(ev, () => { hold = true; auto(); }));
  ["mouseleave", "focusout"].forEach((ev) => rvSec.addEventListener(ev, () => { hold = false; auto(); }));
  swipe(track, (d) => { go(ri + d); auto(); });
  go(0); auto();
  window.MuseReviews = { index: () => ri };

  /* Reservation */
  const form = $("[data-res]");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  form.date.min = iso(today);
  const maxD = new Date(today); maxD.setDate(maxD.getDate() + 90); form.date.max = iso(maxD);
  $("[data-party]").innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1} ${i ? "guests" : "guest"}</option>`).join("");
  const slotsFor = (d) => {
    const day = d.getDay();
    if (day === 1) return [];
    const range = day === 0 ? [10, 13.5] : [17, 21.5];
    const out = [];
    for (let h = range[0]; h <= range[1]; h += 0.5) {
      const now = new Date();
      const at = new Date(d); at.setHours(Math.floor(h), h % 1 ? 30 : 0);
      if (at - now < 3600000) continue;
      out.push(`${Math.floor(h) % 12 || 12}:${h % 1 ? "30" : "00"} ${h < 12 ? "AM" : "PM"}`);
    }
    return out;
  };
  function syncTimes() {
    const note = $("[data-day-note]"), timeSel = $("[data-time]");
    if (!form.date.value) { timeSel.innerHTML = `<option value="">Select a date first</option>`; note.textContent = ""; return; }
    const d = new Date(`${form.date.value}T00:00:00`);
    const slots = slotsFor(d);
    if (d.getDay() === 1) note.textContent = "We're closed on Mondays — please choose Tuesday through Sunday.";
    else if (d.getDay() === 0) note.textContent = "Sunday is brunch service, 10:00 AM – 2:00 PM.";
    else note.textContent = slots.length ? "" : "No more tables today — please choose another date.";
    timeSel.innerHTML = slots.length ? `<option value="">Choose a time</option>${slots.map((s) => `<option>${s}</option>`).join("")}` : `<option value="">No times available</option>`;
  }
  form.date.addEventListener("change", syncTimes);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    const d = form.date.value ? new Date(`${form.date.value}T00:00:00`) : null;
    form.date.setCustomValidity(d && d.getDay() === 1 ? "Closed on Mondays" : "");
    $$("input, select, textarea", form).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    $("[data-res-err]").textContent = first ? (first === form.date && d && d.getDay() === 1 ? "We're closed on Mondays — please pick another date." : "Please complete the highlighted fields.") : "";
    if (first) { first.focus(); return; }
    $("[data-res-text]").textContent = `${form.name.value.split(" ")[0]}, we've held a table for ${form.party.value} on ${longDate(d)} at ${form.time.value}. A confirmation would go to ${form.email.value}. Reference HH-${Math.floor(1000 + Math.random() * 9000)}. (Demo — nothing was sent.)`;
    form.hidden = true; $("[data-res-done]").hidden = false; $("[data-res-done]").focus();
  });
  $("[data-res-again]").addEventListener("click", () => { form.reset(); syncTimes(); $("[data-res-done]").hidden = true; form.hidden = false; form.date.focus(); });

  /* Status (Pacific time) */
  const sched = { 0: [10, 14], 1: null, 2: [17, 21.5], 3: [17, 21.5], 4: [17, 21.5], 5: [17, 22.5], 6: [17, 22.5] };
  let day = new Date().getDay(), hr = new Date().getHours() + new Date().getMinutes() / 60;
  try { const p = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()); const g = (t) => p.find((x) => x.type === t).value; day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")); hr = (+g("hour") % 24) + +g("minute") / 60; } catch { /* local time */ }
  const fmtH = (h) => `${Math.floor(h) % 12 || 12}:${h % 1 ? "30" : "00"} ${h < 12 ? "AM" : "PM"}`;
  const s = sched[day], st = $("[data-status]");
  if (s && hr >= s[0] && hr < s[1]) { st.textContent = `Open now · until ${fmtH(s[1])}`; }
  else { st.classList.add("closed"); if (s && hr < s[0]) st.textContent = `Closed · opens today at ${fmtH(s[0])}`; else { let n = (day + 1) % 7; while (!sched[n]) n = (n + 1) % 7; st.textContent = `Closed · opens ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n]} at ${fmtH(sched[n][0])}`; } }
  $$(".hours [data-d]").forEach((r) => r.classList.toggle("today", r.dataset.d.split(",").includes(String(day))));

  /* Event modals */
  let seatsLeft = 14;
  const seatSel = $("[data-seat-select]");
  const fillSeats = () => { seatSel.innerHTML = Array.from({ length: Math.min(8, seatsLeft) }, (_, i) => `<option value="${i + 1}" ${i === 1 ? "selected" : ""}>${i + 1} seat${i ? "s" : ""}</option>`).join(""); $("[data-farm-total]").textContent = `$${125 * +seatSel.value}`; };
  seatSel.addEventListener("change", () => { $("[data-farm-total]").textContent = `$${125 * +seatSel.value}`; });
  const pDate = $("[data-private-date]"); pDate.min = iso(new Date(today.getTime() + 7 * 864e5));
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => {
    const m = $(`[data-modal="${b.dataset.open}"]`), f = $("form", m);
    f.reset(); f.hidden = false; $(".m-done", m).hidden = true; $("[data-err]", m).textContent = ""; $$("[aria-invalid]", f).forEach((x) => x.removeAttribute("aria-invalid"));
    if (b.dataset.open === "farm") fillSeats();
    m.showModal();
  }));
  $$(".m-form").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const m = f.closest("dialog");
    if (f.dataset.kind === "private" && f.date.value) f.date.setCustomValidity(new Date(`${f.date.value}T00:00:00`).getDay() === 1 ? "Private dining is available Tuesday–Sunday evenings" : "");
    let first = null;
    $$("input, select", f).forEach((x) => { const bad = !x.checkValidity(); x.toggleAttribute("aria-invalid", bad); if (bad && !first) first = x; });
    $("[data-err]", m).textContent = first ? (first.validationMessage || "Please check the highlighted fields.") : "";
    if (first) { first.focus(); return; }
    if (f.dataset.kind === "farm") {
      const n = +f.seats.value; seatsLeft -= n;
      $("[data-seats]").textContent = `${seatsLeft} of 40 seats left`;
      $("[data-done]", m).textContent = `${n} seat${n > 1 ? "s" : ""} held for ${f.name.value.split(" ")[0]} at the Spring Harvest Dinner — $${125 * n}, wine included. (Demo — nothing was charged.)`;
    } else {
      $("[data-done]", m).textContent = `Thanks, ${f.name.value.split(" ")[0]}. Our events team will reply about ${f.guests.value} guests on ${longDate(new Date(`${f.date.value}T00:00:00`))} within one business day. (Demo — nothing was sent.)`;
    }
    f.hidden = true; $(".m-done", m).hidden = false;
  }));
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#news-email"), ok = input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    $("[data-news-msg]").textContent = ok ? "Welcome to the table — your first seasonal letter arrives Sunday. (Demo — nothing was sent.)" : "Please enter a valid email address.";
    if (ok) e.target.reset();
  });

  /* Sticky mobile CTA hides over the reservation form */
  const sticky = $(".sticky-cta");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => entries.forEach((en) => sticky.classList.toggle("away", en.isIntersecting)), { threshold: 0.15 }).observe($("#reserve"));
  }
})();
