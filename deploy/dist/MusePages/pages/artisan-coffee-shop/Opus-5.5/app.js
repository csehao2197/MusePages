(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem(`ember:${k}`); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(`ember:${k}`, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const usd = (n) => `$${n.toFixed(2)}`;
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2400); };

  /* Art */
  $$("[data-art]").forEach((el) => {
    const d = el.dataset;
    const html = d.art === "hero" ? Art.hero() : d.art === "beans" ? Art.beans() : d.art === "stamps" ? Art.stamps(3)
      : d.art === "drink" ? Art.drink(d.name, d.label) : d.art === "bag" ? Art.bag(d.label, d.color, d.roast) : Art.map(+d.seed, d.label);
    el.insertAdjacentHTML("afterbegin", html);
  });

  /* Overlays: drawer + cart share the scrim */
  const scrim = $("[data-scrim]"), drawer = $("#drawer"), cart = $("[data-cart]"), burger = $("[data-drawer-open]");
  let lastFocus = null;
  function openPanel(p) {
    closePanels();
    lastFocus = document.activeElement;
    p.hidden = false; scrim.hidden = false;
    document.body.style.overflow = "hidden";
    if (p === drawer) burger.setAttribute("aria-expanded", "true");
    $("button", p).focus();
  }
  function closePanels() {
    const wasOpen = !drawer.hidden || !cart.hidden;
    drawer.hidden = true; cart.hidden = true; scrim.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (wasOpen && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  burger.addEventListener("click", () => openPanel(drawer));
  $("[data-drawer-close]").addEventListener("click", closePanels);
  $$("#drawer nav a").forEach((a) => a.addEventListener("click", closePanels));
  scrim.addEventListener("click", closePanels);
  $("[data-cart-open]").addEventListener("click", () => openPanel(cart));
  $("[data-cart-close]").addEventListener("click", closePanels);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !scrim.hidden) closePanels(); });

  /* Cart */
  let items = store.get("cart", []);
  if (!Array.isArray(items)) items = [];
  function renderCart() {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const badge = $("[data-count]");
    badge.hidden = !count;
    badge.textContent = count;
    $("[data-cart-open]").setAttribute("aria-label", `Open cart, ${count} item${count === 1 ? "" : "s"}`);
    $("[data-subtotal]").textContent = usd(subtotal);
    $("[data-cart-foot]").hidden = !count;
    $("[data-cart-body]").innerHTML = count ? items.map((it, idx) => `<div class="line"><div><b>${it.name}</b><div class="lp">${usd(it.price)} each</div></div>
      <div class="line-total">${usd(it.price * it.qty)}</div>
      <div class="qty"><button type="button" data-q="${idx}" data-d="-1" aria-label="${it.qty === 1 ? "Remove" : "Decrease"} ${it.name}">${icon(it.qty === 1 ? "trash" : "minus")}</button><output aria-live="polite">${it.qty}</output><button type="button" data-q="${idx}" data-d="1" aria-label="Increase ${it.name}">${icon("plus")}</button></div></div>`).join("")
      : `<div class="empty">${icon("coffee")}<p>Your order is empty.</p><p>Add a drink or a bag of beans to get started.</p></div>`;
    store.set("cart", items);
  }
  $("[data-cart-body]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    const it = items[+b.dataset.q];
    it.qty += +b.dataset.d;
    if (it.qty <= 0) items.splice(+b.dataset.q, 1);
    if (it.qty > 20) it.qty = 20;
    renderCart();
  });
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.add;
    const found = items.find((i) => i.id === id);
    if (found) found.qty = Math.min(20, found.qty + 1);
    else items.push({ id, name: b.dataset.name, price: +b.dataset.price, qty: 1 });
    renderCart();
    const badge = $("[data-count]");
    badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
    b.classList.add("added");
    setTimeout(() => b.classList.remove("added"), 900);
    toast(`${b.dataset.name} added to your order`);
  }));
  $("[data-checkout]").addEventListener("click", () => {
    const where = $("[data-pickup]").value.split(" — ")[0], when = $("[data-when]").value.toLowerCase();
    const ref = `EB-${Math.floor(1000 + Math.random() * 9000)}`;
    $("[data-confirm-text]").textContent = `Order ${ref} · ${usd(items.reduce((s, i) => s + i.qty * i.price, 0))} · pickup at ${where}, ${when}. This is a demo — nothing was charged or sent.`;
    items = [];
    renderCart();
    closePanels();
    $('[data-modal="confirm"]').showModal();
  });
  $$("[data-order]").forEach((b) => b.addEventListener("click", () => {
    if (!items.length) { closePanels(); document.querySelector(".drinks").scrollIntoView({ behavior: "smooth" }); toast("Pick a drink to start your pickup order"); return; }
    openPanel(cart);
  }));
  renderCart();

  /* Rails */
  $$("[data-scroll]").forEach((b) => b.addEventListener("click", () => {
    const rail = $(`[data-rail="${b.dataset.scroll}"]`);
    rail.scrollBy({ left: +b.dataset.dir * 304, behavior: "smooth" });
  }));
  const drinksRail = $('[data-rail="drinks"]');
  const syncArrows = () => {
    const max = drinksRail.scrollWidth - drinksRail.clientWidth - 2;
    $('[data-scroll="drinks"][data-dir="-1"]').disabled = drinksRail.scrollLeft <= 2;
    $('[data-scroll="drinks"][data-dir="1"]').disabled = drinksRail.scrollLeft >= max;
  };
  drinksRail.addEventListener("scroll", syncArrows, { passive: true });
  window.addEventListener("resize", syncArrows);
  syncArrows();

  /* Open-now status (Portland time) */
  const hours = { pearl: [[6.5, 18], [7, 17]] };
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const h = (+get("hour") % 24) + +get("minute") / 60, weekend = ["Sat", "Sun"].includes(get("weekday"));
    const [open, close] = hours.pearl[weekend ? 1 : 0];
    $("[data-open-now]").innerHTML = h >= open && h < close
      ? `${icon("clock")}<span>Pearl District is <b>open now</b> until ${close > 12 ? close - 12 : close}pm</span>`
      : `${icon("clock")}<span>Pearl District opens at ${open % 1 ? "6:30" : open}am</span>`;
  } catch { /* Intl time zone unsupported */ }

  /* Menu PDF (generated in the browser) */
  function menuPdf() {
    const lines = [
      ["F2", 22, "Ember & Bloom Coffee - Menu"], ["F1", 10, "Pearl District · Division · Alberta Arts · Sellwood · Portland, Oregon"], ["", 0, ""],
      ["F2", 13, "ESPRESSO DRINKS"], ["F1", 11, "Espresso  3.00     Cortado  4.50     Flat White  5.50"], ["F1", 11, "Cappuccino  5.50     Latte  6.00     Mocha  6.50"], ["", 0, ""],
      ["F2", 13, "BREWED & COLD"], ["F1", 11, "Drip Coffee  3.50     Pour Over  5.00     Cold Brew  5.50"], ["F1", 11, "Cold Brew Flight  9.00     Iced Americano  4.50     Nitro Cold Brew  6.00"], ["", 0, ""],
      ["F2", 13, "FOOD & PASTRIES"], ["F1", 11, "Almond Croissant  4.50     Avocado Toast (V)  9.00     Acai Bowl (V, GF)  11.00"], ["F1", 11, "Banana Bread (GF)  4.00     Breakfast Burrito  10.00     Seasonal Scone  3.50"], ["", 0, ""],
      ["F2", 13, "SEASONAL"], ["F1", 11, "Lavender Oat Latte  6.50     Matcha Rose Latte  7.00"], ["", 0, ""],
      ["F1", 9, "(V) Vegan  (GF) Gluten-Free. Oat, almond or whole milk at no charge. Prices in USD."],
    ];
    const esc = (s) => s.replace(/·/g, "-").replace(/[\\()]/g, (c) => `\\${c}`);
    let y = 760, stream = "BT\n";
    for (const [f, size, text] of lines) {
      if (!f) { y -= 12; continue; }
      stream += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${esc(text)}) Tj\n`;
      y -= size + 10;
    }
    stream += "ET";
    const objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>",
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [];
    objs.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
    pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
  }
  $("[data-pdf]").addEventListener("click", () => {
    const url = URL.createObjectURL(menuPdf());
    const a = document.createElement("a");
    a.href = url; a.download = "ember-and-bloom-menu.pdf";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast("Menu PDF downloaded");
  });

  /* Newsletter */
  $("[data-subscribe]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.email, msg = $("[data-sub-msg]");
    const ok = input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    msg.className = `fine ${ok ? "ok" : "bad"}`;
    msg.textContent = ok ? "You're in! Watch for your 10% code (demo — nothing was sent)." : "Please enter a valid email address.";
    if (ok) e.target.reset(); else input.focus();
  });

  /* Rewards */
  const rw = $('[data-modal="rewards"]'), rwForm = $("[data-rewards-form]");
  $("[data-rewards]").addEventListener("click", () => { rwForm.hidden = false; $(".done", rw).hidden = true; rwForm.reset(); $("[data-err]", rw).textContent = ""; rw.showModal(); });
  rwForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input", rwForm).forEach((f) => { const bad = !f.checkValidity(); f.setAttribute("aria-invalid", String(bad)); if (bad && !first) first = f; });
    $("[data-err]", rw).textContent = first ? "Please add your name and a valid email." : "";
    if (first) { first.focus(); return; }
    rwForm.hidden = true;
    $(".done", rw).hidden = false;
  });
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
})();
