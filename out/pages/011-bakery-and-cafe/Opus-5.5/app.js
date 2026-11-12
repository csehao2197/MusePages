(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const usd = (n) => `$${n.toFixed(2)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(`crumb:${k}`); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(`crumb:${k}`, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Catalog: v = vegan, gf = gluten-free option, n = contains nuts */
  const menu = {
    Breads: [
      ["sourdough", "Sourdough Boule", "48-hour fermented, crackling crust", 8.5, "boule", ["v"]],
      ["farmhouse", "Multigrain Farmhouse Loaf", "Seven grains, oats and sunflower seeds", 9, "multigrain", ["v"]],
      ["ciabatta", "Ciabatta", "Open crumb, olive oil, slow rise", 6.5, "ciabatta", ["v"]],
      ["focaccia", "Olive Rosemary Focaccia", "Kalamata olives, rosemary, flaky salt", 7.75, "focaccia", ["v"]],
      ["rye", "Rye Pumpernickel", "Dark rye, molasses and caraway", 8, "rye", ["v"]],
      ["baguette", "Baguette", "Classic French, baked every two hours", 4.5, "baguette", ["v"]],
    ],
    Pastries: [
      ["almond-croissant", "Almond Croissant", "Twice-baked with almond cream", 5.75, "almond", ["n"]],
      ["butter-croissant", "Butter Croissant", "Seventy-two layers of cultured butter", 4.25, "croissant", []],
      ["cinnamon-roll", "Cardamom Cinnamon Roll", "Brown butter glaze", 5.25, "cinnamon", []],
      ["berry-tart", "Seasonal Fruit Tart", "Vanilla custard, market berries", 6.5, "tart", ["gf"]],
      ["blueberry-muffin", "Blueberry Muffin", "Lemon crumble top", 4, "muffin", ["gf"]],
      ["cookie", "Brown Butter Chocolate Chip", "Sea salt, dark chocolate", 3.25, "cookie", ["n"]],
    ],
    Breakfast: [
      ["egg-sandwich", "Breakfast Sandwich", "Farm egg, cheddar, tomato jam on brioche", 9.5, "sandwich", []],
      ["eggs-toast", "Eggs & Sourdough Toast", "Two eggs your way, cultured butter", 8.75, "eggs", ["gf"]],
      ["quiche", "Spinach & Gruyère Quiche", "Flaky crust, side greens", 9.25, "quiche", []],
      ["scone", "Raspberry Scone", "With whipped honey butter", 4.25, "scone", []],
      ["granola", "Maple Granola Bowl", "Oat milk yogurt, berries, pecans", 8.5, "salad", ["v", "gf", "n"]],
    ],
    Lunch: [
      ["turkey", "Turkey & Brie on Ciabatta", "Apple, arugula, fig mustard", 12.5, "sandwich", []],
      ["veg-sandwich", "Roasted Vegetable Focaccia", "Hummus, peppers, zucchini", 11, "focaccia", ["v"]],
      ["soup", "Tomato Basil Soup", "With a sourdough heel", 7.5, "soup", ["v", "gf"]],
      ["salad", "Market Greens Salad", "Shaved fennel, citrus, toasted walnuts", 10.5, "salad", ["v", "gf", "n"]],
    ],
    "Coffee & Drinks": [
      ["lavender-latte", "Lavender Honey Latte", "Local honey, dried lavender, espresso", 6.25, "lavender", ["gf"]],
      ["latte", "House Latte", "Double shot, steamed whole or oat milk", 5, "latte", ["gf"]],
      ["espresso", "Espresso", "Our house blend, pulled short", 3.25, "espresso", ["v", "gf"]],
      ["cold-brew", "Cold Brew", "Steeped 18 hours, served over ice", 4.75, "iced", ["v", "gf"]],
      ["chai", "Masala Chai", "House-spiced, oat milk", 5.25, "tea", ["v", "gf"]],
    ],
  };
  const catalog = Object.fromEntries(Object.values(menu).flat().map(([id, name, desc, price, art]) => [id, { id, name, price, art }]));
  const dietIcon = { v: ["leaf", "Vegan", ""], gf: ["wheat", "Gluten-free option", ""], n: ["nut", "Contains nuts", "nut"] };

  /* Art */
  $$("[data-art]").forEach((el) => { el.insertAdjacentHTML("afterbegin", Art[el.dataset.art]()); });
  $$("[data-dish]").forEach((el) => { el.innerHTML = Art.dish(el.dataset.dish, el.dataset.bg, el.dataset.label); });
  $$("[data-scene]").forEach((el) => { el.innerHTML = Art.scene(el.dataset.scene, el.dataset.label); });
  $$(".stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  /* Nav */
  const nav = $("[data-nav]"), hero = $(".hero");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > 40);
  window.addEventListener("scroll", syncNav, { passive: true });
  syncNav();
  const overlay = $("#overlay"), burger = $("[data-overlay-open]");
  const closeOverlay = () => { overlay.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  burger.addEventListener("click", () => { overlay.hidden = false; burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("[data-overlay-close]").focus(); });
  $("[data-overlay-close]").addEventListener("click", () => { closeOverlay(); burger.focus(); });
  $$("#overlay nav a").forEach((a) => a.addEventListener("click", closeOverlay));

  /* Menu tabs */
  const tabs = $("[data-tabs]"), panel = $("[data-panel]");
  const names = Object.keys(menu);
  tabs.innerHTML = names.map((n, i) => `<button class="tab" type="button" role="tab" id="tab-${i}" aria-controls="menu-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${n}</button>`).join("");
  panel.id = "menu-panel";
  function showTab(i, focus) {
    $$(".tab", tabs).forEach((t, j) => { t.setAttribute("aria-selected", String(i === j)); t.tabIndex = i === j ? 0 : -1; });
    if (focus) $$(".tab", tabs)[i].focus();
    const t = $$(".tab", tabs)[i];
    if (tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: t.offsetLeft - tabs.offsetLeft - 20, behavior: reduced ? "auto" : "smooth" });
    panel.setAttribute("aria-labelledby", `tab-${i}`);
    panel.innerHTML = menu[names[i]].map(([id, name, desc, price, art, diet]) => `<div class="item">
      <div class="item-img">${Art.dish(art, "b")}</div>
      <div><h3>${name}${diet.map((d) => `<span class="diet ${dietIcon[d][2]}" title="${dietIcon[d][1]}" aria-label="${dietIcon[d][1]}" role="img">${icon(dietIcon[d][0])}</span>`).join("")}</h3><p>${desc}</p></div>
      <div class="item-buy"><b>${usd(price)}</b><button class="add-ic" type="button" data-add="${id}" aria-label="Add ${name} to order">${icon("plus")}</button></div></div>`).join("");
    panel.style.animation = "none"; void panel.offsetWidth; panel.style.animation = "";
  }
  tabs.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) showTab($$(".tab", tabs).indexOf(t)); });
  tabs.addEventListener("keydown", (e) => {
    const cur = $$(".tab", tabs).findIndex((t) => t.getAttribute("aria-selected") === "true");
    const next = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: names.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    showTab((next + names.length) % names.length, true);
  });
  showTab(0);
  $("[data-full-menu]").addEventListener("click", () => { showTab(1); $("#menu").scrollIntoView({ behavior: "smooth" }); toast("Showing Pastries — use the tabs to browse every category"); });

  /* Cart */
  let items = store.get("cart", []);
  if (!Array.isArray(items)) items = [];
  items = items.filter((i) => catalog[i.id]);
  const cart = $("[data-cart]"), scrim = $("[data-scrim]");
  let lastFocus;
  const openCart = () => { lastFocus = document.activeElement; closeOverlay(); cart.hidden = false; scrim.hidden = false; document.body.style.overflow = "hidden"; $("[data-cart-close]").focus(); };
  const closeCart = () => { cart.hidden = true; scrim.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus({ preventScroll: true }); };
  $("[data-cart-open]").addEventListener("click", openCart);
  $("[data-cart-close]").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);

  function windows() {
    const now = new Date(), slots = [];
    const day = now.getDay();
    const open = { 0: [8, 14], 1: null, 2: [7, 16], 3: [7, 16], 4: [7, 16], 5: [7, 16], 6: [7, 15] }[day];
    for (let h = 7; h < 16; h += 0.5) {
      const label = `${Math.floor(h) > 12 ? Math.floor(h) - 12 : Math.floor(h)}:${h % 1 ? "30" : "00"}${h < 12 ? "a" : "p"}`;
      const ok = open && h >= open[0] && h < open[1] - 0.25 && h > now.getHours() + now.getMinutes() / 60 + 0.25;
      slots.push([label, ok]);
    }
    const anyOpen = slots.some(([, ok]) => ok);
    const html = anyOpen
      ? slots.filter(([, ok]) => ok).slice(0, 9).map(([l], i) => `<label><input type="radio" name="win" value="${l}" ${i === 0 ? "checked" : ""}><span>${l}</span></label>`).join("")
      : ["7:30a", "8:00a", "8:30a", "9:00a", "9:30a", "10:00a"].map((l, i) => `<label><input type="radio" name="win" value="Tomorrow ${l}" ${i === 0 ? "checked" : ""}><span>Tmrw ${l}</span></label>`).join("");
    $("[data-windows]").innerHTML = html;
  }
  function renderCart() {
    const count = items.reduce((s, i) => s + i.qty, 0), subtotal = items.reduce((s, i) => s + i.qty * catalog[i.id].price, 0);
    const badge = $("[data-count]");
    badge.hidden = !count; badge.textContent = count;
    $("[data-cart-open]").setAttribute("aria-label", `Open order, ${count} item${count === 1 ? "" : "s"}`);
    $("[data-subtotal]").textContent = usd(subtotal);
    $("[data-cart-foot]").hidden = !count;
    $("[data-mb-label]").textContent = count ? `${count} item${count === 1 ? "" : "s"} · ${usd(subtotal)}` : "Fresh today · pickup in 15 min";
    $("[data-cart-body]").innerHTML = count ? items.map((it, idx) => { const c = catalog[it.id]; return `<div class="line"><div class="item-img">${Art.dish(c.art, "b")}</div><b>${c.name}</b><span class="lt">${usd(c.price * it.qty)}</span>
      <div class="qty"><button type="button" data-q="${idx}" data-d="-1" aria-label="${it.qty === 1 ? "Remove" : "Decrease"} ${c.name}">${icon(it.qty === 1 ? "trash" : "minus")}</button><output>${it.qty}</output><button type="button" data-q="${idx}" data-d="1" aria-label="Increase ${c.name}">${icon("plus")}</button></div></div>`; }).join("")
      : `<div class="empty">${icon("bag")}<p>Your order is empty.</p><button class="btn btn-outline btn-sm" type="button" data-browse>Browse the menu</button></div>`;
    store.set("cart", items);
  }
  $("[data-cart-body]").addEventListener("click", (e) => {
    if (e.target.closest("[data-browse]")) { closeCart(); $("#menu").scrollIntoView({ behavior: "smooth" }); return; }
    const b = e.target.closest("[data-q]"); if (!b) return;
    const it = items[+b.dataset.q];
    it.qty = Math.min(20, it.qty + +b.dataset.d);
    if (it.qty <= 0) items.splice(+b.dataset.q, 1);
    renderCart();
  });
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]"); if (!b) return;
    const c = catalog[b.dataset.add];
    const f = items.find((i) => i.id === c.id);
    if (f) f.qty = Math.min(20, f.qty + 1); else items.push({ id: c.id, qty: 1 });
    renderCart();
    const badge = $("[data-count]"); badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    b.classList.add("added"); setTimeout(() => b.classList.remove("added"), 800);
    toast(`${c.name} added to your order`);
  });
  $$("[data-start-order]").forEach((b) => b.addEventListener("click", () => {
    if (items.length) { windows(); openCart(); return; }
    closeOverlay();
    $("#menu").scrollIntoView({ behavior: "smooth" });
    toast("Tap + on anything you'd like — then pick a pickup time");
  }));
  $("[data-cart-open]").addEventListener("click", windows);
  $("[data-checkout]").addEventListener("click", () => {
    const win = ($("[data-windows] input:checked") || {}).value;
    if (!win) { toast("Choose a pickup window"); return; }
    const total = items.reduce((s, i) => s + i.qty * catalog[i.id].price, 0);
    $("[data-confirm-text]").textContent = `Order GC-${Math.floor(1000 + Math.random() * 9000)} · ${usd(total)} · ready ${/Tomorrow/.test(win) ? win.toLowerCase() : `today at ${win.replace("a", " AM").replace("p", " PM")}`} at 247 Elm Street. Demo only — nothing was charged.`;
    items = []; renderCart(); closeCart();
    $('[data-modal="confirm"]').showModal();
  });
  renderCart();

  /* Gallery lightbox */
  const gal = $$("[data-g]"), lb = $("[data-lightbox]");
  let gi = 0, gReturn;
  const showG = (i) => { gi = (i + gal.length) % gal.length; const art = $(".g-art", gal[gi]); $("[data-lb-img]").innerHTML = Art.scene(art.dataset.scene, art.dataset.label); $("[data-lb-cap]").textContent = $(".cap", gal[gi]).textContent; };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; if (gReturn) gReturn.focus(); };
  gal.forEach((g, i) => g.addEventListener("click", () => { gReturn = g; showG(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("[data-lb-close]").focus(); }));
  $("[data-lb-close]").addEventListener("click", closeLb);
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => showG(gi + +b.dataset.lb)));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  swipe(lb, (d) => showG(gi + d));

  function swipe(el, fn) {
    let x0 = null, y0 = 0;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) fn(dx < 0 ? 1 : -1); x0 = null; }, { passive: true });
  }

  /* Reviews carousel */
  const track = $("[data-track]"), slides = $$(".review", track), dots = $("[data-dots]"), car = $("[data-carousel]"), playBtn = $("[data-play]");
  let ri = 0, timer = null, userPaused = reduced, hover = false;
  dots.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Show review ${i + 1}"></button>`).join("");
  function go(i) {
    ri = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${ri * 100}%)`;
    slides.forEach((s, j) => s.setAttribute("aria-hidden", String(j !== ri)));
    $$("button", dots).forEach((d, j) => d.setAttribute("aria-current", String(j === ri)));
  }
  function schedule() {
    clearInterval(timer); timer = null;
    if (!userPaused && !hover) timer = setInterval(() => go(ri + 1), 5000);
    playBtn.setAttribute("aria-label", userPaused ? "Start auto-advance" : "Pause auto-advance");
    $("use", playBtn).setAttribute("href", userPaused ? "#i-play" : "#i-pause");
  }
  $$("button", dots).forEach((d, i) => d.addEventListener("click", () => { go(i); schedule(); }));
  $("[data-prev]").addEventListener("click", () => { go(ri - 1); schedule(); });
  $("[data-next]").addEventListener("click", () => { go(ri + 1); schedule(); });
  playBtn.addEventListener("click", () => { userPaused = !userPaused; schedule(); });
  car.addEventListener("mouseenter", () => { hover = true; schedule(); });
  car.addEventListener("mouseleave", () => { hover = false; schedule(); });
  car.addEventListener("focusin", () => { hover = true; schedule(); });
  car.addEventListener("focusout", () => { hover = false; schedule(); });
  swipe(track, (d) => { go(ri + d); schedule(); });
  go(0); schedule();
  window.MuseCarousel = { index: () => ri, paused: () => !timer };

  /* Open status */
  const sched = { 0: [8, 14], 1: null, 2: [7, 16], 3: [7, 16], 4: [7, 16], 5: [7, 16], 6: [7, 15] };
  const fmtH = (h) => `${h > 12 ? h - 12 : h} ${h < 12 ? "AM" : "PM"}`;
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60, today = sched[d];
  let status, open = false;
  if (today && h >= today[0] && h < today[1]) { open = true; status = `Open now · until ${fmtH(today[1])}`; }
  else if (today && h < today[0]) status = `Closed · opens today at ${fmtH(today[0])}`;
  else { let n = (d + 1) % 7; while (!sched[n]) n = (n + 1) % 7; status = `Closed · opens ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][n]} at ${fmtH(sched[n][0])}`; }
  $$("[data-open-status]").forEach((el) => { el.textContent = status; el.classList.toggle("closed", !open); });
  $$(".hours [data-day]").forEach((row) => row.classList.toggle("today", row.dataset.day.split(",").includes(String(d))));

  /* Forms & modals */
  const firstSaturday = () => { const t = new Date(); t.setDate(t.getDate() + ((6 - t.getDay() + 7) % 7 || 7)); return t; };
  $("[data-first-sat]").textContent = firstSaturday().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const iso = (x) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
  $$("[data-min-today]").forEach((i) => { i.min = iso(new Date()); });
  function openModal(name) {
    const m = $(`[data-modal="${name}"]`), f = $("form", m);
    if (f) { f.reset(); f.hidden = false; $(".done", m).hidden = true; $$("[aria-invalid]", f).forEach((x) => x.removeAttribute("aria-invalid")); $("[data-err]", f).textContent = ""; }
    m.showModal();
  }
  $$("[data-open]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.open)));
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((dlg) => dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }));
  const sub = $('[data-modal="subscribe"]');
  $$('input[name="for"]', sub).forEach((r) => r.addEventListener("change", () => { $("[data-name-label]", sub).textContent = r.value === "gift" && r.checked ? "Recipient's name" : "Your name"; }));
  $$(".js-form").forEach((form) => form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input:not([type=radio]), textarea, select", form).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    $("[data-err]", form).textContent = first ? (first.validationMessage || "Please check the highlighted field.") : "";
    if (first) { first.focus(); return; }
    const m = form.closest("dialog");
    if (m.dataset.modal === "subscribe") {
      const gift = form.elements.for.value === "gift";
      $("[data-done-text]", m).textContent = `${gift ? `${form.elements.name.value}'s gift box` : "Your first box"} arrives ${$("[data-first-sat]").textContent}. Demo only — no payment was taken.`;
    } else {
      $("[data-done-text]", m).textContent = `Thanks, ${form.elements.name.value}. Elena will reply within one business day with a custom menu for ${form.elements.guests.value} guests. (Demo — nothing was sent.)`;
    }
    form.hidden = true;
    $(".done", m).hidden = false;
  }));
  $("[data-club]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.email, msg = $("[data-club-msg]"), ok = input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    msg.className = `club-msg ${ok ? "ok" : "bad"}`;
    msg.textContent = ok ? "Welcome to the Crumb Club! Your 10% code is CRUMB10 (demo)." : "Please enter a valid email address.";
    if (ok) e.target.reset();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.hidden) { if (e.key === "Escape") closeLb(); else if (e.key === "ArrowRight") showG(gi + 1); else if (e.key === "ArrowLeft") showG(gi - 1); return; }
    if (e.key !== "Escape") return;
    if (!overlay.hidden) { closeOverlay(); burger.focus(); }
    if (!cart.hidden) closeCart();
  });
})();
