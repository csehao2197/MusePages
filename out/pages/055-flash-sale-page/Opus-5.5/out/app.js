(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "i") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const usd = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
  const pad = (n) => String(n).padStart(2, "0");
  const A = window.Art;
  const T0 = Date.now();
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  $$("[data-float]").forEach((el) => (el.innerHTML = A.product(el.dataset.float, "", { bg: "#F9FAFB" })));
  $("[data-dotd-img]").innerHTML = A.product("headphones", "Over-ear wireless headphones", { bg: "#FFFBEB" });
  const starRow = (r) => Array.from({ length: 5 }, (_, i) => icon("i-star", `i${i < Math.round(r) ? "" : " off"}`)).join("");
  $(".dotd .stars").innerHTML = starRow(4.8);

  /* ---------- data ---------- */
  const D = (id, n, cat, art, was, now, left, max, r, rv, mins, opts = {}) => ({ id, n, cat, art, was, now, left, max, r, rv, ends: T0 + mins * 60000, ...opts });
  const GRID = [
    D("mba", "MacBook Air M3", "Laptops", "laptop", 1199, 899, 8, 40, 4.8, 3120, 382),
    D("app", "AirPods Pro 2", "Audio", "headphones", 249, 169, 23, 40, 4.7, 8840, 515, { c: "#E5E7EB" }),
    D("tv", 'Samsung 65" OLED TV', "Smart Home", "tv", 2199, 1399, 3, 25, 4.6, 1204, 268),
    D("nsw", "Nintendo Switch OLED", "Gaming", "console", 349, 279, 18, 30, 4.8, 5630, 440),
    D("gp", "GoPro Hero 12", "Cameras", "actioncam", 399, 249, 6, 35, 4.5, 2210, 299),
    D("kp", "Kindle Paperwhite", "Accessories", "ereader", 149, 94, 31, 50, 4.7, 9400, 610),
    D("bose", "Bose SoundLink Flex", "Audio", "speaker", 149, 89, 2, 30, 4.7, 4310, 186),
    D("ipad", "iPad 10th Gen", "Laptops", "tablet", 449, 329, 15, 40, 4.7, 6120, 470),
    D("mx", "Logitech MX Master 3S", "Accessories", "mouse", 99, 64, 22, 40, 4.8, 7020, 555)
  ];
  const LIGHT = [
    D("xps", "Dell XPS 13 Laptop", "Laptops", "laptop", 999, 749, 9, 30, 4.5, 1830, 120),
    D("zen", "ASUS Zenbook 14 OLED", "Laptops", "laptop", 899, 649, 5, 25, 4.6, 960, 120),
    D("s24", "Samsung Galaxy S24", "Smartphones", "phone", 799, 579, 14, 40, 4.6, 4120, 120),
    D("px8", "Google Pixel 8a", "Smartphones", "phone", 499, 379, 11, 40, 4.5, 2870, 120),
    D("a64", "Sony Alpha a6400 Camera", "Cameras", "camera", 899, 699, 4, 20, 4.7, 1530, 120),
    D("xbc", "Xbox Wireless Controller", "Gaming", "controller", 59, 44, 27, 60, 4.8, 12040, 120)
  ].map((d) => ({ ...d, light: true, now: Math.round(d.now * 0.9 * 100) / 100, base: d.now }));
  const RECENT = [
    D("aws", "Apple Watch SE (2nd Gen)", "Accessories", "watch", 249, 174, 19, 40, 4.7, 5210, 700, { viewed: "You viewed this 2 hours ago — now 30% off!" }),
    D("echo", "Echo Show 8 Smart Display", "Smart Home", "smarthome", 149, 99, 26, 50, 4.6, 3380, 720, { viewed: "You viewed this yesterday — now 34% off!" }),
    D("jbl", "JBL Flip 6 Speaker", "Audio", "speaker", 129, 89, 12, 40, 4.8, 6440, 650, { c: "#F97316", viewed: "In your wishlist — now 31% off!" }),
    D("sdc", "SanDisk 1TB Portable SSD", "Accessories", "ereader", 159, 99, 33, 60, 4.7, 3960, 680, { viewed: "Similar to items you viewed — 38% off" })
  ];
  const DOTD = D("dotd", "Sony WH-1000XM5 Wireless Headphones", "Audio", "headphones", 349.99, 189.99, 12, 55, 4.8, 2341, 4 * 60 + 22 + 8 / 60);
  const ALL = [...GRID, ...LIGHT, ...RECENT, DOTD];
  const byId = (id) => ALL.find((d) => d.id === id);
  const pct = (d) => Math.round(((d.was - d.now) / d.was) * 100);

  /* ---------- stock + countdown helpers ---------- */
  function stockInfo(d) {
    const p = d.left / d.max;
    if (d.left <= 0) return { c: "#9CA3AF", t: "Sold out", w: 0 };
    if (p < 0.2) return { c: "#EF4444", t: d.left <= 3 ? `Almost gone! ${d.left} left` : `${d.left} left — almost gone`, w: p };
    if (p <= 0.5) return { c: "#EAB308", t: `Selling fast · ${d.left} left`, w: p };
    return { c: "#22C55E", t: `${d.left} left`, w: p };
  }
  const left = (d) => Math.max(0, d.ends - Date.now());
  const short = (ms) => { const m = Math.floor(ms / 60000); return `${Math.floor(m / 60)}h ${pad(m % 60)}m`; };
  const long = (ms) => { const s = Math.floor(ms / 1000); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`; };

  /* ---------- cards ---------- */
  const wish = new Set();
  function card(d) {
    const s = stockInfo(d);
    return `<article class="card${d.left <= 0 ? " sold" : ""}" data-card="${d.id}">
      <div class="c-img">${A.product(d.art, d.n, { c: d.c })}<span class="disc">-${pct(d)}%</span>${d.light ? '<span class="extra">EXTRA 10% OFF</span>' : ""}<button class="wish" type="button" aria-pressed="${wish.has(d.id)}" aria-label="${wish.has(d.id) ? "Remove from" : "Add to"} wishlist: ${esc(d.n)}" data-wish="${d.id}">${icon("i-heart")}</button></div>
      <div class="c-body"><span class="c-cat">${d.cat}</span><h3>${esc(d.n)}</h3>
        <span class="c-rate"><span class="stars" aria-hidden="true">${starRow(d.r)}</span><span>${d.r} (${d.rv.toLocaleString("en-US")})</span></span>
        <span class="c-price"><s>${usd(d.was)}</s><b>${usd(d.now)}</b></span>
        ${d.viewed ? `<p class="viewed">${d.viewed}</p>` : ""}
        <span class="mini-cd" data-cd="${d.id}">${icon("i-clock")}Ends in ${d.light ? long(left(d)) : short(left(d))}</span>
        <div class="c-stock stock"><div class="bar" role="progressbar" aria-label="Stock remaining" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(s.w * 100)}"><i style="width:${Math.max(4, s.w * 100)}%;--c:${s.c}"></i></div><span style="color:${s.c === "#22C55E" ? "#15803D" : s.c === "#EAB308" ? "#A16207" : s.c}">${s.t}</span></div>
        <button class="btn-amber" type="button" data-add="${d.id}"${d.left <= 0 ? " disabled" : ""}>${d.left <= 0 ? "Sold out" : "Add to Cart"}</button></div></article>`;
  }

  /* ---------- filters ---------- */
  const CATS = ["All Deals", "Laptops", "Audio", "Smartphones", "Cameras", "Gaming", "Accessories", "Smart Home"];
  const pool = [...GRID, ...LIGHT];
  const count = (c) => (c === "All Deals" ? pool.length : pool.filter((d) => d.cat === c).length);
  $("[data-cats]").innerHTML = CATS.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cat="${c}">${c} (${count(c)})</button>`).join("");
  let cat = "All Deals", q = "";
  let soldHour = 42;
  const urgent = () => `<div class="urgent" role="note"><span class="fire" aria-hidden="true">${icon("i-flame")}</span><b><span data-sold>${soldHour}</span> items sold in the last hour</b><p>Prices and availability change quickly. Don't wait!</p></div>`;
  function render() {
    const match = (d) => (cat === "All Deals" || d.cat === cat) && (!q || `${d.n} ${d.cat}`.toLowerCase().includes(q));
    const g = GRID.filter(match);
    const cards = g.map(card);
    if (cat === "All Deals" && !q && cards.length > 6) cards.splice(6, 0, urgent());
    else if (cards.length > 3) cards.splice(3, 0, urgent());
    $("[data-grid]").innerHTML = cards.length ? cards.join("") : `<div class="empty">No flash deals in ${q ? `“${esc(q)}”` : esc(cat)} right now — check the Lightning Deals below.</div>`;
    const l = LIGHT.filter(match);
    $("[data-ld]").innerHTML = l.length ? l.map(card).join("") : `<div class="empty" style="flex:1">No lightning deals match.</div>`;
    $("[data-note]").textContent = cat !== "All Deals" || q ? `${g.length + l.length} deal${g.length + l.length === 1 ? "" : "s"}${q ? ` matching “${q}”` : ` in ${cat}`}` : "";
  }
  $("[data-recent]").innerHTML = RECENT.map(card).join("");
  render();
  $("[data-cats]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat; $$("[data-cat]").forEach((x) => x.setAttribute("aria-selected", x === b));
    b.scrollIntoView({ block: "nearest", inline: "center" });
    render();
  });
  const qIn = $("[data-q]");
  qIn.addEventListener("input", () => { q = qIn.value.trim().toLowerCase(); render(); });
  $("[data-search]").addEventListener("submit", (e) => { e.preventDefault(); $("#deals").scrollIntoView(); });

  /* ---------- wishlist ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-wish]"); if (!b) return;
    const id = b.dataset.wish; wish.has(id) ? wish.delete(id) : wish.add(id);
    $$(`[data-wish="${id}"]`).forEach((x) => { x.setAttribute("aria-pressed", wish.has(id)); x.setAttribute("aria-label", `${wish.has(id) ? "Remove from" : "Add to"} wishlist: ${byId(id).n}`); });
    toast(wish.has(id) ? "Saved to wishlist — we'll alert you if the price drops." : "Removed from wishlist");
  });

  /* ---------- cart ---------- */
  const cart = new Map();
  const cartCount = () => [...cart.values()].reduce((a, b) => a + b, 0);
  function syncCart() {
    const n = cartCount();
    $$("[data-count]").forEach((b) => { b.hidden = n === 0; b.textContent = n; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); });
    $("[data-count2]").textContent = n;
    $("[data-open-cart]").setAttribute("aria-label", `Cart, ${n} item${n === 1 ? "" : "s"}`);
    $("[data-mbar]").hidden = n === 0; document.body.classList.toggle("has-cart", n > 0);
    const list = $("[data-cart-list]"), foot = $("[data-cart-foot]");
    if (!n) { list.innerHTML = `<li class="dr-empty" style="display:block">Your cart is empty — the clock is ticking!</li>`; foot.innerHTML = ""; return; }
    let total = 0, saved = 0;
    list.innerHTML = [...cart.entries()].map(([id, qn]) => { const d = byId(id); total += d.now * qn; saved += (d.was - d.now) * qn; return `<li><span class="th">${A.product(d.art, d.n, { c: d.c })}</span><span><b>${esc(d.n)}</b><small>${usd(d.now)}</small></span><span class="qty"><button type="button" aria-label="Decrease quantity of ${esc(d.n)}" data-dec="${id}">${icon("i-minus")}</button><span>${qn}</span><button type="button" aria-label="Increase quantity of ${esc(d.n)}" data-inc="${id}">${icon("i-plus")}</button></span></li>`; }).join("");
    foot.innerHTML = `<div class="row"><span>Subtotal</span><span class="tot">${usd(Math.round(total * 100) / 100)}</span></div><div class="row saved"><span>You save</span><span>${usd(Math.round(saved * 100) / 100)}</span></div><p style="margin:0;font-size:13px;color:#6B7280">${total >= 50 ? "You qualify for free shipping." : `Add ${usd(Math.round((50 - total) * 100) / 100)} for free shipping.`}</p><button class="btn-amber btn-block" type="button" data-checkout>Checkout</button>`;
  }
  function add(id) {
    const d = byId(id);
    if (d.left <= 0) { toast("Sold out at this price."); return; }
    cart.set(id, (cart.get(id) || 0) + 1); d.left -= 1; soldHour += 1;
    syncCart(); refreshStock(id);
    $$(`[data-add="${id}"]`).forEach((b) => { if (d.left > 0) { b.classList.add("added"); b.textContent = "Added ✓"; setTimeout(() => { b.classList.remove("added"); b.textContent = "Add to Cart"; }, 1400); } });
    toast(`${d.n} added to cart`);
  }
  function refreshStock(id) {
    const d = byId(id);
    if (id === "dotd") { $("[data-dotd-left]").textContent = d.left; $(".dotd .bar i").style.width = `${Math.max(4, (d.left / 12) * 78)}%`; if (d.left <= 0) { const b = $('[data-add="dotd"]'); b.disabled = true; b.textContent = "Sold out"; } }
    $$(`[data-card="${id}"]`).forEach((c) => { c.outerHTML = card(d); });
    $$("[data-sold]").forEach((s) => (s.textContent = soldHour));
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]"); if (a) { add(a.dataset.add); return; }
    const inc = e.target.closest("[data-inc]"); if (inc) { add(inc.dataset.inc); return; }
    const dec = e.target.closest("[data-dec]");
    if (dec) { const id = dec.dataset.dec, d = byId(id), qn = cart.get(id) - 1; d.left += 1; qn ? cart.set(id, qn) : cart.delete(id); syncCart(); refreshStock(id); return; }
    if (e.target.closest("[data-checkout]")) { toast("Demo store — checkout is disabled. No order was placed."); return; }
    if (e.target.closest("[data-open-cart]")) { openCart(); return; }
    if (e.target.closest("[data-close-cart]") || e.target === $("[data-drawer]")) { closeCart(); return; }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} — not part of this demo page.`); }
  });
  const drawer = $("[data-drawer]"); let cartReturn = null;
  function openCart() { cartReturn = document.activeElement; syncCart(); drawer.hidden = false; $("[data-close-cart]").focus(); }
  function closeCart() { if (drawer.hidden) return; drawer.hidden = true; if (cartReturn && cartReturn.isConnected) cartReturn.focus(); }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  syncCart();

  /* ---------- timers ---------- */
  const midnight = () => { const m = new Date(); m.setHours(24, 0, 0, 0); return m.getTime(); };
  let end = midnight();
  const units = { h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
  function tick() {
    let ms = end - Date.now();
    if (ms <= 0) { end = midnight(); ms = end - Date.now(); }
    const s = Math.floor(ms / 1000), vals = { h: pad(Math.floor(s / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) };
    for (const k in units) if (units[k].textContent !== vals[k]) { units[k].textContent = vals[k]; units[k].classList.remove("flip"); void units[k].offsetWidth; units[k].classList.add("flip"); }
    $("[data-master]").setAttribute("aria-label", `Flash sale ends in ${+vals.h} hours ${+vals.m} minutes`);
    $("[data-dotd-cd]").textContent = long(left(DOTD));
    $$("[data-cd]").forEach((el) => { const d = byId(el.dataset.cd); el.innerHTML = `${icon("i-clock")}${left(d) ? `Ends in ${d.light ? long(left(d)) : short(left(d))}` : "Deal ended"}`; });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- lightning carousel: arrows + grab-to-scroll ---------- */
  const ld = $("[data-ld]");
  const stepW = () => (ld.querySelector(".card") ? ld.querySelector(".card").getBoundingClientRect().width + 16 : 236);
  $("[data-ld-prev]").addEventListener("click", () => ld.scrollBy({ left: -stepW() * 2, behavior: "smooth" }));
  $("[data-ld-next]").addEventListener("click", () => ld.scrollBy({ left: stepW() * 2, behavior: "smooth" }));
  let drag = null;
  ld.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse" || e.target.closest("button")) return; drag = { x: e.clientX, l: ld.scrollLeft, moved: false }; ld.setPointerCapture(e.pointerId); });
  ld.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) { drag.moved = true; ld.classList.add("dragging"); } ld.scrollLeft = drag.l - dx; });
  const endDrag = () => { if (!drag) return; drag = null; ld.classList.remove("dragging"); };
  ld.addEventListener("pointerup", endDrag); ld.addEventListener("pointercancel", endDrag);

  /* ---------- alerts ---------- */
  $("[data-alert]").addEventListener("submit", (e) => {
    e.preventDefault(); const v = e.target.email.value.trim(), m = $("[data-al-msg]");
    if (!validEmail(v)) { m.className = "al-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    m.className = "al-msg ok"; m.textContent = `You're on the list — early alerts go to ${v}. (Demo — nothing is sent.)`; e.target.reset();
  });

  /* ---------- sticky category shadow ---------- */
  const bar = $("[data-cats-bar]");
  const onScroll = () => bar.classList.toggle("stuck", bar.getBoundingClientRect().top <= parseFloat(getComputedStyle(bar).top) + 1 && scrollY > 200);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- toast ---------- */
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); }
})();
