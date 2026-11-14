(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } }, del(k) { try { localStorage.removeItem(k); } catch { /* unavailable */ } } };
  const usd = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const view = $("[data-view]");
  const P = window.SEED.products;
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  /* ---------- auth (demo: SHA-256 hashes in localStorage; a real app would use Supabase Auth) ---------- */
  async function hash(email, pw) { const d = new TextEncoder().encode(`gohealth:${email.toLowerCase()}:${pw}`); const b = await crypto.subtle.digest("SHA-256", d); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
  let users = store.get("gh-users", null);
  const ready = (async () => { if (!users) { users = await Promise.all(window.SEED.users.map(async (u) => ({ email: u.email, name: u.name, role: u.role, hash: await hash(u.email, u.password) }))); store.set("gh-users", users); } })();
  let session = store.get("gh-session", null);
  const me = () => (session ? users.find((u) => u.email === session.email) : null);
  async function login(email, pw) { await ready; const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase()); if (!u || u.hash !== (await hash(u.email, pw))) return null; session = { email: u.email, at: Date.now() }; store.set("gh-session", session); return u; }
  async function register(name, email, pw) { await ready; if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return "exists"; const u = { email: email.trim(), name: name.trim(), role: "customer", hash: await hash(email.trim(), pw) }; users.push(u); store.set("gh-users", users); session = { email: u.email, at: Date.now() }; store.set("gh-session", session); return u; }
  function logout() { session = null; store.del("gh-session"); renderHeader(); toast("You're signed out"); location.hash = "#/"; }

  /* ---------- categories (CRUD, persisted) ---------- */
  let cats = store.get("gh-cats", window.SEED.categories);
  let moved = store.get("gh-moved", {});
  const catOf = (p) => moved[p.id] || p.cat;
  const catName = (id) => (cats.find((c) => c.id === id) || { name: "Uncategorized" }).name;
  const allCats = () => cats.concat(P.some((p) => catOf(p) === "uncategorized") ? [{ id: "uncategorized", name: "Uncategorized" }] : []);
  const saveCats = () => { store.set("gh-cats", cats); store.set("gh-moved", moved); renderCats(); };

  /* ---------- cart (per user, persisted) ---------- */
  const carts = () => store.get("gh-carts", {});
  const cartOf = () => (session ? carts()[session.email] || [] : []);
  function setCart(c) { const all = carts(); all[session.email] = c; store.set("gh-carts", all); renderHeader(); }
  function add(id, qty = 1) { const c = cartOf(), l = c.find((x) => x.id === id); if (l) l.qty = Math.min(20, l.qty + qty); else c.push({ id, qty }); setCart(c); toast(`Added ${byId[id].name} to your cart`); }
  const totals = (lines) => { const sub = lines.reduce((s, l) => s + byId[l.id].price * l.qty, 0), ship = sub === 0 || sub >= 50 ? 0 : 4.99, tax = Math.round(sub * 0.08 * 100) / 100; return { sub, ship, tax, total: Math.round((sub + ship + tax) * 100) / 100 }; };

  /* ---------- orders: seeded store-wide history (deterministic per day) + this browser's orders ---------- */
  const DAY = 864e5, dayKey = (t) => new Date(t).toISOString().slice(0, 10);
  const rng = (s) => { const f = () => ((s = (s * 16807) % 2147483647) / 2147483647); f(); f(); return f; };
  function seeded(daysBack = 30) {
    const out = [], today = new Date(); today.setUTCHours(0, 0, 0, 0);
    for (let d = daysBack - 1; d >= 0; d--) {
      const t = today.getTime() - d * DAY, r = rng((Math.imul(Math.floor(t / DAY), 2654435761) >>> 0) % 2147483646 + 1), n = 6 + Math.floor(r() * 9) + ([0, 6].includes(new Date(t).getUTCDay()) ? 4 : 0);
      for (let i = 0; i < n; i++) { const items = Array.from({ length: 1 + Math.floor(r() * 3) }, () => ({ id: P[Math.floor(r() * P.length)].id, qty: 1 + Math.floor(r() * 2) })); out.push({ id: `GH-${String(Math.floor(t / DAY) % 10000).padStart(4, "0")}${String(i).padStart(2, "0")}`, email: "store", customer: window.SEED.customers[Math.floor(r() * 12)], items, total: totals(items).total, date: new Date(Math.min(t + (8 + r() * 13) * 36e5, t + ((8 + r() * 13) * 36e5) * Math.min(1, (Date.now() - t) / (21 * 36e5)))).toISOString(), status: d > 2 ? "Delivered" : d > 0 ? "Shipped" : "Processing", seed: true }); }
    }
    return out;
  }
  const myOrders = () => store.get("gh-orders", []);
  const allOrders = () => seeded().concat(myOrders()).sort((a, b) => b.date.localeCompare(a.date));

  /* ---------- header ---------- */
  function renderHeader() {
    const u = me(), n = cartOf().reduce((s, l) => s + l.qty, 0), b = $("[data-cart-n]");
    b.hidden = !n; b.textContent = n; $("[data-cart-link]").setAttribute("aria-label", `Cart, ${n} item${n === 1 ? "" : "s"}`);
    $("[data-acct]").innerHTML = u ? `${u.role === "admin" ? `<a href="#/admin">${icon("i-chart")}<span class="lbl">Dashboard</span></a>` : ""}<a href="#/orders">${icon("i-box")}<span class="lbl">Orders</span></a><span class="who lbl" style="padding:0 6px">${esc(u.name.split(" ")[0])}</span><button type="button" data-logout aria-label="Sign out">${icon("i-logout")}<span class="lbl">Sign out</span></button>` : `<a href="#/login">${icon("i-user")}<span class="lbl">Sign in</span></a><a class="btn sm" href="#/register" style="color:#fff">Register</a>`;
  }
  function renderCats() { $("[data-cats]").innerHTML = `<a href="#/">All products</a>` + allCats().map((c) => `<a href="#/c/${c.id}" data-cat-link="${c.id}">${esc(c.name)}</a>`).join(""); markNav(); }
  $("[data-acct]").addEventListener("click", (e) => { if (e.target.closest("[data-logout]")) logout(); });
  $("[data-search]").addEventListener("submit", (e) => { e.preventDefault(); const q = $("[data-q]").value.trim(); location.hash = q ? `#/search/${encodeURIComponent(q)}` : "#/"; });
  const burger = $("[data-burger]");
  burger.addEventListener("click", () => { const o = !$("[data-cats]").classList.contains("open"); $("[data-cats]").classList.toggle("open", o); burger.setAttribute("aria-expanded", o); });

  /* ---------- views ---------- */
  const card = (p) => `<article class="pc" data-pc="${p.id}"><a class="im" href="#/p/${p.id}" tabindex="-1" aria-hidden="true">${Pack.shot(p, "")}</a><div class="b"><span class="cat">${esc(catName(catOf(p)))}</span><h3><a href="#/p/${p.id}">${esc(p.name)}</a></h3><span class="rating">${icon("i-star")}${p.rating} <span>(${p.reviews})</span></span><div class="row"><span class="price">${usd(p.price)}</span><button class="btn sm" type="button" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart">${icon("i-cart")}Add</button></div></div></article>`;
  let sort = "popular";
  function shop({ cat, q } = {}) {
    let list = P.filter((p) => (!cat || catOf(p) === cat) && (!q || `${p.name} ${p.desc} ${catName(catOf(p))}`.toLowerCase().includes(q.toLowerCase())));
    list = sort === "low" ? [...list].sort((a, b) => a.price - b.price) : sort === "high" ? [...list].sort((a, b) => b.price - a.price) : sort === "rating" ? [...list].sort((a, b) => b.rating - a.rating) : [...list].sort((a, b) => b.reviews - a.reviews);
    const home = !cat && !q, c = cat && allCats().find((x) => x.id === cat);
    if (cat && !c) return notFound();
    const hero = home ? `<section class="hero"><div><span class="pill">${icon("i-leaf")}New: sleep &amp; calm range</span><h1 style="margin-top:12px">Feel your best, every day.</h1><p>Vitamins, herbal teas, sports nutrition and personal care, all third-party tested and shipped fast. Free shipping over $50.</p><div class="ctas"><a class="btn" href="#products">Shop bestsellers</a><a class="btn-o" href="#/c/sleep">Explore Sleep &amp; Calm</a></div></div><div class="hero-art" aria-hidden="true">${["p1", "p7", "p8"].map((id) => `<div>${Pack.shot(byId[id], "")}</div>`).join("")}</div></section>
      <nav class="tiles" aria-label="Shop by category">${cats.map((c) => { const fp = P.find((p) => catOf(p) === c.id) || P[0]; return `<a class="tile" href="#/c/${c.id}"><span class="ti">${Pack.shot(fp, "")}</span>${esc(c.name)}<small>${P.filter((p) => catOf(p) === c.id).length} products</small></a>`; }).join("")}</nav>` : "";
    return { title: q ? `Search: ${q} — GoHealth` : c ? `${c.name} — GoHealth` : "GoHealth — Vitamins, Herbal Teas & Wellness Essentials",
      html: `<div class="page wrap">${hero}${!home ? `<div class="ph"><h1>${q ? `Results for “${esc(q)}”` : esc(c.name)}</h1><p>${list.length} product${list.length === 1 ? "" : "s"}</p></div>` : ""}
        <div class="bar" id="products"><h2>${home ? "Bestsellers" : "Products"}</h2><label>Sort <select data-sort>${[["popular", "Most popular"], ["rating", "Top rated"], ["low", "Price: low to high"], ["high", "Price: high to low"]].map(([v, l]) => `<option value="${v}"${v === sort ? " selected" : ""}>${l}</option>`).join("")}</select></label></div>
        ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty">No products found. <a href="#/">Browse all products</a></div>`}</div>`,
      mount() { $("[data-sort]").addEventListener("change", (e) => { sort = e.target.value; route(); }); } };
  }
  function product(id) {
    const p = byId[id]; if (!p) return notFound();
    return { title: `${p.name} — GoHealth`, html: `<div class="page wrap"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Shop</a>/<a href="#/c/${catOf(p)}">${esc(catName(catOf(p)))}</a>/<span aria-current="page">${esc(p.name)}</span></nav>
      <div class="pdp"><div class="im">${Pack.shot(p, `${p.name}, ${p.sub}`)}</div><div><span class="pill gray">${esc(catName(catOf(p)))}</span><h1>${esc(p.name)}</h1><span class="rating">${icon("i-star")}${p.rating} · ${p.reviews} reviews</span><span class="price">${usd(p.price)}</span><p class="d">${esc(p.desc)}</p><p style="color:var(--muted);font-size:14px">${esc(p.sub)}</p>
      <div class="buy"><div class="qty" role="group" aria-label="Quantity"><button type="button" aria-label="Decrease quantity" data-dq="-1">${icon("i-minus")}</button><output data-qv aria-live="polite">1</output><button type="button" aria-label="Increase quantity" data-dq="1">${icon("i-plus")}</button></div><button class="btn" type="button" data-add-qty="${p.id}" style="flex:1">${icon("i-cart")}Add to cart</button></div>
      ${me() ? "" : `<p class="alert info" style="margin-top:12px">${icon("i-lock")}Sign in to add items to your cart. We'll bring you right back.</p>`}
      <ul class="perks"><li>${icon("i-truck")}Free shipping on orders over $50</li><li>${icon("i-shield")}Third-party tested for purity</li><li>${icon("i-check")}30-day satisfaction guarantee</li></ul></div></div>
      <section style="margin-top:56px"><div class="bar"><h2>More in ${esc(catName(catOf(p)))}</h2></div><div class="grid">${P.filter((x) => x.id !== p.id && catOf(x) === catOf(p)).concat(P.filter((x) => catOf(x) !== catOf(p))).slice(0, 4).map(card).join("")}</div></section></div>`,
      mount() { let q = 1; $$("[data-dq]").forEach((b) => b.addEventListener("click", () => { q = Math.max(1, Math.min(20, q + +b.dataset.dq)); $("[data-qv]").textContent = q; })); $("[data-add-qty]").addEventListener("click", () => requireAdd(p.id, q)); } };
  }
  function requireAdd(id, qty) {
    if (me()) { add(id, qty); return; }
    store.set("gh-pending", { id, qty, back: location.hash || "#/" });
    toast("Please sign in to add items to your cart", "err");
    location.hash = `#/login?next=${encodeURIComponent(location.hash || "#/")}`;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-add]"); if (b) requireAdd(b.dataset.add, 1); });

  function authView(mode, next) {
    const reg = mode === "register";
    return { title: `${reg ? "Create account" : "Sign in"} — GoHealth`, html: `<div class="page wrap"><section class="auth" aria-labelledby="auth-h"><h1 id="auth-h">${reg ? "Create your account" : "Welcome back"}</h1><p>${reg ? "Track orders and check out faster." : "Sign in to manage your cart and orders."}</p>
      <nav class="tabs" aria-label="Account"><a href="#/login${next ? `?next=${encodeURIComponent(next)}` : ""}"${reg ? "" : ' aria-current="page"'}>Sign in</a><a href="#/register${next ? `?next=${encodeURIComponent(next)}` : ""}"${reg ? ' aria-current="page"' : ""}>Register</a></nav>
      <form class="form" novalidate data-auth>${reg ? `<label class="f">Full name<input name="name" autocomplete="name" required><span class="e"></span></label>` : ""}
        <label class="f">Email<input name="email" type="email" autocomplete="email" required><span class="e"></span></label>
        <label class="f">Password<span class="pw"><input name="password" type="password" autocomplete="${reg ? "new-password" : "current-password"}" required minlength="8"><button type="button" aria-label="Show password" aria-pressed="false" data-pw>${icon("i-eye")}</button></span><span class="e"></span>${reg ? `<small style="font-weight:400;color:var(--muted)">At least 8 characters, including a number.</small>` : ""}</label>
        <p class="alert" hidden data-auth-err role="alert"></p><button class="btn full" type="submit">${reg ? "Create account" : "Sign in"}</button></form>
      ${reg ? "" : `<div class="demo"><b>Demo accounts</b> (stored only in this browser):<br>Customer: demo@gohealth.example / demo1234<br>Admin: admin@gohealth.example / admin1234<br><button class="btn-o sm" type="button" data-fill="demo">Use customer</button><button class="btn-o sm" type="button" data-fill="admin">Use admin</button></div>`}</section></div>`,
      mount() {
        const f = $("[data-auth]");
        $("[data-pw]").addEventListener("click", (e) => { const b = e.currentTarget, i = f.elements.password, show = i.type === "password"; i.type = show ? "text" : "password"; b.setAttribute("aria-pressed", show); b.setAttribute("aria-label", show ? "Hide password" : "Show password"); $("use", b).setAttribute("href", show ? "#i-eye-off" : "#i-eye"); });
        $$("[data-fill]").forEach((b) => b.addEventListener("click", () => { const a = b.dataset.fill === "admin"; f.elements.email.value = a ? "admin@gohealth.example" : "demo@gohealth.example"; f.elements.password.value = a ? "admin1234" : "demo1234"; }));
        const err = (n, m) => { const el = f.elements[n]; if (!el) return true; el.toggleAttribute("aria-invalid", !!m); if (m) el.setAttribute("aria-invalid", "true"); el.closest(".f").querySelector(".e").textContent = m || ""; return !m; };
        f.addEventListener("submit", async (e) => {
          e.preventDefault(); $("[data-auth-err]").hidden = true;
          const pw = f.elements.password.value;
          const ok = [reg ? err("name", f.elements.name.value.trim().length < 2 ? "Enter your name" : "") : true, err("email", validEmail(f.elements.email.value) ? "" : "Enter a valid email"), err("password", reg ? (pw.length < 8 || !/\d/.test(pw) ? "Use 8+ characters with a number" : "") : pw ? "" : "Enter your password")];
          if (ok.includes(false)) { $("[aria-invalid=true]", f).focus(); return; }
          const btn = $("[type=submit]", f); btn.disabled = true;
          const u = reg ? await register(f.elements.name.value, f.elements.email.value, pw) : await login(f.elements.email.value, pw);
          btn.disabled = false;
          if (!u || u === "exists") { const m = $("[data-auth-err]"); m.hidden = false; m.innerHTML = `${icon("i-x")}${u === "exists" ? "An account with this email already exists. Try signing in." : "Incorrect email or password."}`; f.elements.password.value = ""; f.elements.password.focus(); return; }
          renderHeader(); toast(reg ? `Welcome to GoHealth, ${u.name.split(" ")[0]}!` : `Signed in as ${u.name}`);
          const pend = store.get("gh-pending", null); store.del("gh-pending");
          if (pend && byId[pend.id]) add(pend.id, pend.qty);
          location.hash = next && next.startsWith("#/") && !/^#\/(login|register)/.test(next) ? next : u.role === "admin" ? "#/admin" : "#/";
        });
      } };
  }
  function cartView() {
    const lines = cartOf(), t = totals(lines);
    return { title: "Your cart — GoHealth", html: `<div class="page wrap"><div class="ph"><h1>Your cart</h1><p>Saved to your account on this device.</p></div>${lines.length ? `<div class="two"><section class="card" aria-label="Cart items">${lines.map((l) => { const p = byId[l.id]; return `<div class="line" data-line="${l.id}"><span class="im">${Pack.shot(p, "")}</span><div><h3>${esc(p.name)}</h3><small>${esc(p.sub)} · ${usd(p.price)} each</small><div style="margin-top:8px" class="qty" role="group" aria-label="Quantity for ${esc(p.name)}"><button type="button" aria-label="Decrease" data-lq="-1">${icon("i-minus")}</button><output>${l.qty}</output><button type="button" aria-label="Increase" data-lq="1">${icon("i-plus")}</button></div></div><div class="r"><b>${usd(p.price * l.qty)}</b><button class="btn-g sm" type="button" data-lrm aria-label="Remove ${esc(p.name)}">${icon("i-trash")}Remove</button></div></div>`; }).join("")}</section>
      <aside class="card sticky"><h2>Order summary</h2><div class="sum"><div><span>Subtotal</span><b data-sub>${usd(t.sub)}</b></div><div><span>Shipping</span><b>${t.ship ? usd(t.ship) : "Free"}</b></div><div><span>Estimated tax (8%)</span><b>${usd(t.tax)}</b></div><div class="tot"><span>Total</span><span data-total>${usd(t.total)}</span></div></div>${t.ship ? `<p style="font-size:13px;color:var(--muted)">Add ${usd(50 - t.sub)} more for free shipping.</p>` : ""}<a class="btn full" href="#/checkout" style="margin-top:14px">${icon("i-lock")}Checkout</a></aside></div>` : `<div class="empty">Your cart is empty. <a href="#/">Start shopping</a></div>`}</div>`,
      mount() { view.addEventListener("click", cartClick); } };
  }
  function cartClick(e) {
    const line = e.target.closest("[data-line]"); if (!line || !location.hash.startsWith("#/cart")) return;
    const c = cartOf(), l = c.find((x) => x.id === line.dataset.line);
    const q = e.target.closest("[data-lq]"); if (q) { l.qty = Math.max(1, Math.min(20, l.qty + +q.dataset.lq)); setCart(c); route(); $(`[data-line="${l.id}"] [data-lq="${q.dataset.lq}"]`)?.focus(); return; }
    if (e.target.closest("[data-lrm]")) { setCart(c.filter((x) => x !== l)); toast(`Removed ${byId[l.id].name}`); route(); }
  }
  const luhn = (n) => { const d = n.replace(/\D/g, ""); if (d.length < 13) return false; let s = 0; for (let i = 0; i < d.length; i++) { let x = +d[d.length - 1 - i]; if (i % 2) { x *= 2; if (x > 9) x -= 9; } s += x; } return s % 10 === 0; };
  function checkoutView() {
    const lines = cartOf(); if (!lines.length) return { title: "Checkout — GoHealth", html: `<div class="page wrap"><div class="ph"><h1>Checkout</h1></div><div class="empty">Your cart is empty. <a href="#/">Start shopping</a></div></div>` };
    const t = totals(lines), u = me();
    return { title: "Checkout — GoHealth", html: `<div class="page wrap"><div class="ph"><h1>Checkout</h1><p>Signed in as ${esc(u.email)}</p></div><form class="two" novalidate data-co><div>
      <section class="card"><h2>Shipping address</h2><div class="fgrid"><label class="f w">Full name<input name="name" autocomplete="name" value="${esc(u.name)}"><span class="e"></span></label><label class="f w">Street address<input name="street" autocomplete="street-address"><span class="e"></span></label><label class="f">City<input name="city" autocomplete="address-level2"><span class="e"></span></label><label class="f">ZIP / Postal code<input name="zip" autocomplete="postal-code"><span class="e"></span></label></div></section>
      <section class="card"><h2>Payment</h2><p class="alert info" style="margin-bottom:12px">${icon("i-lock")}Demo checkout: no payment provider is connected. Use test card 4242 4242 4242 4242.</p><div class="fgrid"><label class="f w">Card number<input name="card" inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242"><span class="e"></span></label><label class="f">Expiry (MM/YY)<input name="exp" autocomplete="cc-exp" placeholder="12/28"><span class="e"></span></label><label class="f">CVC<input name="cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123"><span class="e"></span></label></div></section></div>
      <aside class="card sticky"><h2>Summary</h2>${lines.map((l) => `<div class="line" style="grid-template-columns:52px 1fr auto;padding:8px 0"><span class="im" style="width:52px;height:52px">${Pack.shot(byId[l.id], "")}</span><small><b style="color:var(--ink)">${esc(byId[l.id].name)}</b><br>Qty ${l.qty}</small><b>${usd(byId[l.id].price * l.qty)}</b></div>`).join("")}<div class="sum" style="margin-top:10px"><div><span>Subtotal</span><b>${usd(t.sub)}</b></div><div><span>Shipping</span><b>${t.ship ? usd(t.ship) : "Free"}</b></div><div><span>Tax</span><b>${usd(t.tax)}</b></div><div class="tot"><span>Total</span><span>${usd(t.total)}</span></div></div><button class="btn full" type="submit" style="margin-top:14px" data-place>Place order · ${usd(t.total)}</button></aside></form></div>`,
      mount() {
        const f = $("[data-co]");
        f.elements.card.addEventListener("input", (e) => { const d = e.target.value.replace(/\D/g, "").slice(0, 16); e.target.value = d.replace(/(.{4})/g, "$1 ").trim(); });
        const err = (n, m) => { const el = f.elements[n]; if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); el.closest(".f").querySelector(".e").textContent = m || ""; return !m; };
        f.addEventListener("submit", (e) => {
          e.preventDefault();
          const [mm, yy] = f.elements.exp.value.split("/").map((x) => +x), now = new Date(), expOk = mm >= 1 && mm <= 12 && yy >= 0 && new Date(2000 + yy, mm, 1) > now;
          const ok = [err("name", f.elements.name.value.trim().length < 2 ? "Enter the recipient's name" : ""), err("street", f.elements.street.value.trim().length < 5 ? "Enter a street address" : ""), err("city", f.elements.city.value.trim() ? "" : "Enter a city"), err("zip", /^[A-Za-z0-9 -]{3,10}$/.test(f.elements.zip.value.trim()) ? "" : "Enter a valid ZIP"), err("card", luhn(f.elements.card.value) ? "" : "Card number is invalid"), err("exp", expOk ? "" : "Use a future date as MM/YY"), err("cvc", /^\d{3,4}$/.test(f.elements.cvc.value) ? "" : "3–4 digits")];
          if (ok.includes(false)) { $("[aria-invalid=true]", f).focus(); return; }
          const b = $("[data-place]"); b.disabled = true; b.textContent = "Placing order…";
          setTimeout(() => {
            const id = "GH-" + Date.now().toString(36).toUpperCase().slice(-7), t2 = totals(lines);
            const o = { id, email: me().email, customer: me().name, items: lines, total: t2.total, sub: t2.sub, ship: t2.ship, tax: t2.tax, date: new Date().toISOString(), status: "Processing", address: `${f.elements.street.value.trim()}, ${f.elements.city.value.trim()} ${f.elements.zip.value.trim()}`, card: f.elements.card.value.slice(-4) };
            const all = myOrders(); all.push(o); store.set("gh-orders", all); setCart([]);
            toast(`Order ${id} placed`); location.hash = `#/orders/${id}`;
          }, 500);
        });
      } };
  }
  const statusPill = (s) => `<span class="pill ${s === "Delivered" ? "" : s === "Shipped" ? "blue" : "amber"}">${s}</span>`;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  function ordersView(id) {
    const mine = myOrders().filter((o) => o.email === me().email).sort((a, b) => b.date.localeCompare(a.date));
    if (id) {
      const o = mine.find((x) => x.id === id); if (!o) return notFound();
      return { title: `Order ${o.id} — GoHealth`, html: `<div class="page wrap"><nav class="crumbs"><a href="#/orders">Orders</a>/<span aria-current="page">${o.id}</span></nav><div class="ph"><h1>Order ${o.id}</h1><p>Placed ${fmtDate(o.date)} · ${statusPill(o.status)}</p></div><div class="two"><section class="card">${o.items.map((l) => `<div class="line"><span class="im">${Pack.shot(byId[l.id], "")}</span><div><h3>${esc(byId[l.id].name)}</h3><small>Qty ${l.qty}</small></div><b>${usd(byId[l.id].price * l.qty)}</b></div>`).join("")}</section><aside class="card"><h2>Details</h2><div class="sum"><div><span>Subtotal</span><b>${usd(o.sub)}</b></div><div><span>Shipping</span><b>${o.ship ? usd(o.ship) : "Free"}</b></div><div><span>Tax</span><b>${usd(o.tax)}</b></div><div class="tot"><span>Total</span><span>${usd(o.total)}</span></div></div><p style="font-size:14px;margin:14px 0 0"><b>Ship to:</b> ${esc(o.address)}<br><b>Paid with:</b> card ending ${o.card} (demo)</p><button class="btn-o full" type="button" style="margin-top:14px" data-invoice="${o.id}">${icon("i-dl")}Download invoice (PDF)</button></aside></div></div>` };
    }
    return { title: "Your orders — GoHealth", html: `<div class="page wrap"><div class="ph"><h1>Your orders</h1><p>${mine.length} order${mine.length === 1 ? "" : "s"}</p></div>${mine.length ? `<div class="ord">${mine.map((o) => `<article class="card"><h3><a href="#/orders/${o.id}">Order ${o.id}</a></h3><div class="meta"><span>${fmtDate(o.date)}</span><span>${o.items.reduce((s, l) => s + l.qty, 0)} items</span><span>${usd(o.total)}</span>${statusPill(o.status)}</div><div class="thumbs">${o.items.map((l) => `<span>${Pack.shot(byId[l.id], "")}</span>`).join("")}</div></article>`).join("")}</div>` : `<div class="empty">No orders yet. <a href="#/">Start shopping</a></div>`}</div>` };
  }

  /* ---------- admin ---------- */
  let metric = "orders", tableView = false;
  function last7() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today.getTime() - (6 - i) * DAY); return { key: dayKey(d.getTime() - d.getTimezoneOffset() * 6e4), d, orders: 0, revenue: 0 }; });
    const idx = Object.fromEntries(days.map((x, i) => [x.key, i]));
    allOrders().forEach((o) => { const dt = new Date(o.date), k = dayKey(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime() - dt.getTimezoneOffset() * 6e4); if (k in idx) { days[idx[k]].orders++; days[idx[k]].revenue += o.total; } });
    days.forEach((x) => (x.revenue = Math.round(x.revenue * 100) / 100));
    return days;
  }
  const nice = (m) => { const p = Math.pow(10, Math.floor(Math.log10(m || 1))), f = m / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };
  function drawChart() {
    const box = $("[data-chart]"); if (!box) return;
    const data = last7(), vals = data.map((x) => x[metric]), W = Math.max(280, box.clientWidth), H = box.clientWidth < 500 ? 240 : 280, m = { l: 52, r: 12, t: 24, b: 34 };
    const max = nice(Math.max(...vals) * 1.1), ticks = 4, iw = W - m.l - m.r, ih = H - m.t - m.b, band = iw / 7, bw = Math.min(24, band * 0.56);
    const y = (v) => m.t + ih - (v / max) * ih, fmt = (v) => (metric === "orders" ? String(v) : v >= 1000 ? "$" + (v / 1000).toFixed(1) + "k" : "$" + Math.round(v));
    const maxI = vals.indexOf(Math.max(...vals));
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${metric === "orders" ? "Orders" : "Revenue"} per day for the last 7 days. ${data.map((d, i) => `${d.d.toLocaleDateString("en-US", { weekday: "short" })}: ${metric === "orders" ? vals[i] : usd(vals[i])}`).join("; ")}">`;
    for (let i = 0; i <= ticks; i++) { const v = (max / ticks) * i, yy = y(v); s += `<line class="grid-l" x1="${m.l}" x2="${W - m.r}" y1="${yy}" y2="${yy}"/><text class="axis-t" x="${m.l - 8}" y="${yy + 4}" text-anchor="end">${fmt(v)}</text>`; }
    data.forEach((d, i) => {
      const cx = m.l + band * i + band / 2, top = y(vals[i]), h = m.t + ih - top, r = Math.min(4, h);
      const path = h > 0 ? `M${cx - bw / 2} ${m.t + ih}V${top + r}Q${cx - bw / 2} ${top} ${cx - bw / 2 + r} ${top}H${cx + bw / 2 - r}Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + r}V${m.t + ih}Z` : "";
      const isToday = i === 6, lab = d.d.toLocaleDateString("en-US", { weekday: "short" }) + " " + d.d.getDate();
      s += `<g data-i="${i}"><path class="bar-m" d="${path}"/>${isToday || i === maxI ? `<text class="vlab" x="${cx}" y="${top - 6}" text-anchor="middle">${fmt(vals[i])}</text>` : ""}<text class="axis-t" x="${cx}" y="${H - 12}" text-anchor="middle"${isToday ? ' style="font-weight:700;fill:#0F172A"' : ""}>${isToday ? "Today" : lab}</text><rect class="hit" x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih + 4}" tabindex="0" role="button" aria-label="${lab}: ${d.orders} orders, ${usd(d.revenue)} revenue" data-hit="${i}"/></g>`;
    });
    s += `<line x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}" stroke="#CBD5E1"/></svg><div class="tip" hidden data-tip></div>`;
    box.innerHTML = s;
    const tip = $("[data-tip]", box);
    const show = (i) => { const d = data[i], cx = m.l + band * i + band / 2; $$("g[data-i]", box).forEach((g) => g.classList.toggle("on", +g.dataset.i === i)); tip.hidden = false; tip.innerHTML = `<b>${d.d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</b><span class="sw"></span>${d.orders} orders<br><span class="sw" style="opacity:0"></span>${usd(d.revenue)} revenue`; tip.style.left = `${(cx / W) * box.clientWidth}px`; tip.style.top = `${(y(vals[i]) / H) * box.clientHeight}px`; };
    const hide = () => { tip.hidden = true; $$("g.on", box).forEach((g) => g.classList.remove("on")); };
    $$("[data-hit]", box).forEach((h) => { h.addEventListener("pointerenter", () => show(+h.dataset.hit)); h.addEventListener("focus", () => show(+h.dataset.hit)); h.addEventListener("pointerdown", () => show(+h.dataset.hit)); h.addEventListener("blur", hide); });
    box.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hide(); });
    $("[data-ctable]").innerHTML = `<table class="tbl"><caption class="sr">Orders and revenue for the last 7 days</caption><thead><tr><th>Day</th><th class="num">Orders</th><th class="num">Revenue</th></tr></thead><tbody>${data.map((d) => `<tr><td>${d.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</td><td class="num">${d.orders}</td><td class="num">${usd(d.revenue)}</td></tr>`).join("")}</tbody><tfoot><tr><th>Total</th><th class="num">${data.reduce((s, d) => s + d.orders, 0)}</th><th class="num">${usd(data.reduce((s, d) => s + d.revenue, 0))}</th></tr></tfoot></table>`;
  }
  addEventListener("resize", () => { clearTimeout(drawChart.t); drawChart.t = setTimeout(drawChart, 120); });
  const sideNav = (cur) => `<nav class="side" aria-label="Admin"><a href="#/admin"${cur === "dash" ? ' aria-current="page"' : ""}>${icon("i-chart")}Dashboard</a><a href="#/admin/categories"${cur === "cats" ? ' aria-current="page"' : ""}>${icon("i-tag")}Categories</a><a href="#/">${icon("i-box")}View store</a></nav>`;
  function adminView() {
    const d = last7(), o7 = d.reduce((s, x) => s + x.orders, 0), r7 = d.reduce((s, x) => s + x.revenue, 0), recent = allOrders().slice(0, 8);
    return { title: "Admin dashboard — GoHealth", html: `<div class="page wrap"><div class="adm">${sideNav("dash")}<div>
      <div class="ph" style="padding-top:0"><h1>Dashboard</h1><p>Store performance over the last 7 days. Sample store data plus orders placed in this browser.</p></div>
      <div class="kpis"><div class="kpi"><span>Orders (7 days)</span><b data-k-orders>${o7}</b><small>${(o7 / 7).toFixed(1)} per day</small></div><div class="kpi"><span>Revenue (7 days)</span><b>${usd(r7)}</b><small>incl. tax &amp; shipping</small></div><div class="kpi"><span>Avg. order value</span><b>${usd(o7 ? r7 / o7 : 0)}</b><small>last 7 days</small></div><div class="kpi"><span>Categories</span><b data-k-cats>${cats.length}</b><small>${P.length} products</small></div></div>
      <section class="card chart-card" aria-labelledby="ch-h"><div class="chart-h"><div><h2 id="ch-h">${metric === "orders" ? "Orders" : "Revenue"} per day</h2><p>Last 7 days, ending today</p></div><div style="display:flex;gap:8px;flex-wrap:wrap"><div class="seg" role="group" aria-label="Metric"><button type="button" aria-pressed="${metric === "orders"}" data-metric="orders">Orders</button><button type="button" aria-pressed="${metric === "revenue"}" data-metric="revenue">Revenue</button></div><button class="btn-o sm" type="button" aria-pressed="${tableView}" data-tview>${icon("i-table")}${tableView ? "Show chart" : "Show table"}</button><button class="btn-o sm" type="button" data-report>${icon("i-dl")}PDF report</button></div></div>
        <div class="chart" data-chart ${tableView ? "hidden" : ""}></div><div class="tbl-wrap" data-ctable ${tableView ? "" : "hidden"}></div></section>
      <section class="card" style="margin-top:18px"><h2>Recent orders</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th class="num">Total</th></tr></thead><tbody data-recent>${recent.map((o) => `<tr><td>${o.id}</td><td>${esc(o.customer)}</td><td>${fmtDate(o.date)}</td><td>${statusPill(o.status)}</td><td class="num">${usd(o.total)}</td></tr>`).join("")}</tbody></table></div></section></div></div></div>`,
      mount() {
        drawChart();
        $$("[data-metric]").forEach((b) => b.addEventListener("click", () => { metric = b.dataset.metric; $$("[data-metric]").forEach((x) => x.setAttribute("aria-pressed", x === b)); $("#ch-h").textContent = `${metric === "orders" ? "Orders" : "Revenue"} per day`; drawChart(); }));
        $("[data-tview]").addEventListener("click", (e) => { tableView = !tableView; const b = e.currentTarget; b.setAttribute("aria-pressed", tableView); b.lastChild.textContent = tableView ? "Show chart" : "Show table"; $("[data-chart]").hidden = tableView; $("[data-ctable]").hidden = !tableView; if (!tableView) drawChart(); });
        $("[data-report]").addEventListener("click", () => { const L = [["GoHealth - 7-day sales report", 18, 10], [`Generated ${new Date().toLocaleString("en-US")}`, 9, 16], ["Day            Orders      Revenue", 11, 6]]; d.forEach((x) => L.push([`${x.d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).padEnd(15)}${String(x.orders).padStart(6)}      ${usd(x.revenue)}`, 10, 5])); L.push(["", 6], [`Total orders: ${o7}   Revenue: ${usd(r7)}   AOV: ${usd(o7 ? r7 / o7 : 0)}`, 11, 8], ["Demo report with sample data.", 8]); download("gohealth-7-day-report.pdf", pdf(L)); toast("Report downloaded"); });
      } };
  }
  function catsView() {
    return { title: "Categories — GoHealth admin", html: `<div class="page wrap"><div class="adm">${sideNav("cats")}<div><div class="ph" style="padding-top:0"><h1>Category management</h1><p>Changes update the storefront immediately.</p></div>
      <section class="card"><form class="crud" novalidate data-new><label class="sr" for="newcat">New category name</label><input id="newcat" name="name" placeholder="New category name, e.g. Kids' Health" maxlength="40"><button class="btn" type="submit">${icon("i-plus")}Add category</button></form><p class="alert" hidden role="alert" data-cerr></p>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th class="num">Products</th><th class="num">Actions</th></tr></thead><tbody data-ctbody></tbody></table></div></section></div></div></div>`,
      mount() {
        const body = $("[data-ctbody]"), cerr = $("[data-cerr]");
        let editing = null;
        const count = (id) => P.filter((p) => catOf(p) === id).length;
        const draw = () => { body.innerHTML = cats.map((c) => `<tr data-cid="${c.id}">${editing === c.id ? `<td><label class="sr" for="ed-${c.id}">Category name</label><input id="ed-${c.id}" value="${esc(c.name)}" maxlength="40" data-edin></td><td class="num">${count(c.id)}</td><td><div class="acts"><button class="btn sm" type="button" data-save>Save</button><button class="btn-o sm" type="button" data-cancel>Cancel</button></div></td>` : `<td><a href="#/c/${c.id}">${esc(c.name)}</a></td><td class="num">${count(c.id)}</td><td><div class="acts"><button class="btn-o sm" type="button" data-edit aria-label="Rename ${esc(c.name)}">${icon("i-edit")}Rename</button><button class="btn-d sm" type="button" data-del aria-label="Delete ${esc(c.name)}">${icon("i-trash")}Delete</button></div></td>`}</tr>`).join(""); };
        const check = (name, self) => { const n = name.trim(); if (n.length < 2) return "Name must be at least 2 characters."; if (cats.some((c) => c.id !== self && c.name.toLowerCase() === n.toLowerCase())) return `“${n}” already exists.`; return ""; };
        const showErr = (m) => { cerr.hidden = !m; cerr.innerHTML = m ? `${icon("i-x")}${esc(m)}` : ""; };
        $("[data-new]").addEventListener("submit", (e) => { e.preventDefault(); const inp = e.target.elements.name, m = check(inp.value); showErr(m); if (m) { inp.setAttribute("aria-invalid", "true"); inp.focus(); return; } inp.removeAttribute("aria-invalid"); let id = inp.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cat"; while (cats.some((c) => c.id === id) || id === "uncategorized") id += "-2"; cats.push({ id, name: inp.value.trim() }); saveCats(); toast(`Created “${inp.value.trim()}”`); inp.value = ""; draw(); });
        body.addEventListener("click", (e) => {
          const tr = e.target.closest("[data-cid]"); if (!tr) return; const c = cats.find((x) => x.id === tr.dataset.cid);
          if (e.target.closest("[data-edit]")) { editing = c.id; draw(); $("[data-edin]").focus(); $("[data-edin]").select(); return; }
          if (e.target.closest("[data-cancel]")) { editing = null; showErr(""); draw(); $(`[data-cid="${c.id}"] [data-edit]`).focus(); return; }
          if (e.target.closest("[data-save]")) { const v = $("[data-edin]").value, m = check(v, c.id); showErr(m); if (m) { $("[data-edin]").focus(); return; } c.name = v.trim(); editing = null; saveCats(); draw(); toast(`Renamed to “${c.name}”`); $(`[data-cid="${c.id}"] [data-edit]`).focus(); return; }
          if (e.target.closest("[data-del]")) {
            const n = count(c.id);
            openDlg(`<h2 id="dlg-title">Delete “${esc(c.name)}”?</h2><p>${n ? `${n} product${n === 1 ? "" : "s"} will move to <b>Uncategorized</b>.` : "This category has no products."} This can't be undone.</p><div class="acts"><button class="btn-o" type="button" data-dlg-close>Cancel</button><button class="btn" style="background:#DC2626;border-color:#DC2626" type="button" data-confirm>Delete category</button></div>`);
            $("[data-confirm]").addEventListener("click", () => { P.forEach((p) => { if (catOf(p) === c.id) moved[p.id] = "uncategorized"; }); cats = cats.filter((x) => x !== c); saveCats(); dlg.close(); draw(); toast(`Deleted “${c.name}”`); });
          }
        });
        body.addEventListener("keydown", (e) => { if (e.target.matches("[data-edin]")) { if (e.key === "Enter") { e.preventDefault(); $("[data-save]").click(); } if (e.key === "Escape") { e.preventDefault(); $("[data-cancel]").click(); } } });
        draw();
      } };
  }
  const notFound = () => ({ title: "Not found — GoHealth", html: `<div class="page wrap"><div class="ph"><h1>Page not found</h1><p><a href="#/">Back to the store</a></p></div></div>` });

  /* ---------- PDF helpers (invoice + report) ---------- */
  function pdf(lines) {
    const t = (s) => s.replace(/[^\x20-\x7E]/g, "").replace(/[\\()]/g, (c) => "\\" + c);
    let y = 750, st = "BT\n"; lines.forEach(([s, size, gap = 6]) => { st += `/F${size > 12 ? 2 : 1} ${size} Tf 1 0 0 1 56 ${y} Tm (${t(s)}) Tj\n`; y -= size + gap; }); st += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>", `<< /Length ${st.length} >>\nstream\n${st}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    let out = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length; return out + `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => String(n).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
  }
  function download(name, data) { const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" })), a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-invoice]"); if (!b) return;
    const o = myOrders().find((x) => x.id === b.dataset.invoice);
    const L = [["GoHealth - Invoice", 18, 10], [`Order ${o.id}   ${fmtDate(o.date)}`, 10, 4], [`Bill to: ${o.customer} <${o.email}>`, 10, 4], [`Ship to: ${o.address}`, 10, 14]];
    o.items.forEach((l) => L.push([`${byId[l.id].name.padEnd(30).slice(0, 30)} x${String(l.qty).padEnd(3)} ${usd(byId[l.id].price * l.qty).padStart(10)}`, 10, 5]));
    L.push(["", 6], [`Subtotal ${usd(o.sub).padStart(12)}`, 10, 4], [`Shipping ${(o.ship ? usd(o.ship) : "Free").padStart(12)}`, 10, 4], [`Tax      ${usd(o.tax).padStart(12)}`, 10, 4], [`Total    ${usd(o.total).padStart(12)}`, 13, 14], ["Demo invoice - no payment was processed.", 8]);
    download(`invoice-${o.id}.pdf`, pdf(L)); toast("Invoice downloaded");
  });

  /* ---------- router with guards ---------- */
  function parse() {
    const h = location.hash || "#/"; if (!h.startsWith("#/")) return null;
    const [path, qs] = h.slice(2).split("?"), parts = path.split("/").map(decodeURIComponent), next = new URLSearchParams(qs || "").get("next");
    return { parts, next };
  }
  const guard = { cart: "user", checkout: "user", orders: "user", admin: "admin" };
  function markNav() { const h = location.hash; $$("[data-cats] a").forEach((a) => (a.getAttribute("href") === (h || "#/") || (h === "" && a.getAttribute("href") === "#/") ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"))); }
  let first = true;
  async function route() {
    await ready;
    const r = parse(); if (!r) return;
    const [a, b] = r.parts, need = guard[a];
    if (need && !me()) { toast("Please sign in to continue", "err"); location.replace(`#/login?next=${encodeURIComponent(location.hash)}`); return; }
    if (need === "admin" && me().role !== "admin") { view.innerHTML = `<div class="page wrap"><div class="ph"><h1>Admins only</h1><p>Your account doesn't have access to the dashboard. <a href="#/">Back to the store</a></p></div></div>`; document.title = "Access denied — GoHealth"; view.dataset.route = "denied"; return; }
    if ((a === "login" || a === "register") && me()) { location.replace(r.next && r.next.startsWith("#/") ? r.next : "#/"); return; }
    const v = !a ? shop() : a === "c" ? shop({ cat: b }) : a === "search" ? shop({ q: b || "" }) : a === "p" ? product(b) : a === "login" ? authView("login", r.next) : a === "register" ? authView("register", r.next) : a === "cart" ? cartView() : a === "checkout" ? checkoutView() : a === "orders" ? ordersView(b) : a === "admin" ? (b === "categories" ? catsView() : adminView()) : notFound();
    view.removeEventListener("click", cartClick);
    view.innerHTML = v.html; document.title = v.title; view.dataset.route = r.parts.filter(Boolean).join("/") || "home";
    if (v.mount) v.mount();
    markNav(); $("[data-cats]").classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    if (!first) { scrollTo({ top: 0, behavior: "instant" }); view.focus({ preventScroll: true }); } first = false;
  }
  addEventListener("hashchange", route);

  /* ---------- dialog + toasts ---------- */
  const dlg = $("[data-dlg]"), dbody = $("[data-dlg-body]");
  function openDlg(html) { dbody.innerHTML = html; if (!dlg.open) dlg.showModal(); $("button", dbody)?.focus(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-dlg-close]")) dlg.close(); });
  function toast(m, kind = "") { const t = document.createElement("div"); t.className = `toast ${kind}`; t.innerHTML = `${icon(kind === "err" ? "i-lock" : "i-check")}<span>${esc(m)}</span>`; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 3500); }

  ready.then(() => { renderHeader(); renderCats(); route(); });
})();
