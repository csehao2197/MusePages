(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "") => `<svg class="i ${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } } };
  const S = window.SHOP, view = $("[data-view]");
  const naira = (n) => "₦" + Math.round(n).toLocaleString("en-NG");
  const byId = Object.fromEntries(S.products.map((p) => [p.id, p]));
  const look = (p, c) => ({ style: p.style, accent: p.accent, ...S.colors[c] });
  const img = (p, c, opts) => Shoe.pair(look(p, c), `${p.name} in ${S.colors[c].name}, handmade ${p.type.toLowerCase().replace(/s$/, "")}`, opts);
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const validPhone = (v) => /^(\+?234|0)[789][01]\d{8}$/.test(v.replace(/[\s-]/g, ""));

  /* ---------- JSON-LD for featured designs (Merchant-style structured data) ---------- */
  const ld = document.createElement("script"); ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "D’FOOTPRINT", areaServed: "NG", address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" } }, ...S.products.map((p) => ({ "@type": "Product", name: p.name, description: p.desc, category: `Footwear > ${p.type}`, brand: { "@type": "Brand", name: "D’FOOTPRINT" }, offers: { "@type": "Offer", priceCurrency: "NGN", price: p.price, availability: "https://schema.org/MadeToOrder", url: `#/product/${p.id}` } }))] });
  document.head.append(ld);

  /* ---------- cart ---------- */
  let cart = store.get("dfp-cart", []);
  const save = () => { store.set("dfp-cart", cart); renderCart(); };
  const count = () => cart.reduce((s, l) => s + l.qty, 0);
  const subtotal = () => cart.reduce((s, l) => s + byId[l.id].price * l.qty, 0);
  function addToCart(line) {
    const same = cart.find((l) => l.id === line.id && l.color === line.color && l.size === line.size && (l.note || "") === (line.note || ""));
    if (same) same.qty += line.qty; else cart.push({ ...line, key: Math.random().toString(36).slice(2, 9) });
    save(); const b = $("[data-cart-open]"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); openCart();
  }
  function renderCart() {
    const n = count(), c = $("[data-cnt]"); c.hidden = !n; c.textContent = n; $("[data-cart-open]").setAttribute("aria-label", `Open cart, ${n} item${n === 1 ? "" : "s"}`);
    if (!cart.length) { $("[data-cart-body]").innerHTML = `<div class="cart-empty">${icon("i-bag")}<p>Your bag is empty.</p><a class="btn-o" href="#/shop" data-close-cart>Browse designs</a></div>`; $("[data-cart-foot]").innerHTML = ""; return; }
    $("[data-cart-body]").innerHTML = cart.map((l) => { const p = byId[l.id]; return `<div class="line" data-line="${l.key}"><div class="im">${img(p, l.color)}</div><div><h3>${esc(p.name)}</h3><p class="v">${S.colors[l.color].name} · EU ${l.size}</p>${l.note ? `<p class="cn"><b>Custom edit (pending approval):</b> ${esc(l.note)}</p>` : ""}<div class="qty"><button type="button" aria-label="Decrease quantity of ${esc(p.name)}" data-q="-1">${icon("i-minus")}</button><span aria-live="polite">${l.qty}</span><button type="button" aria-label="Increase quantity of ${esc(p.name)}" data-q="1">${icon("i-plus")}</button></div></div><div class="r"><b class="naira">${naira(p.price * l.qty)}</b><button class="rm" type="button" data-rm>Remove</button></div></div>`; }).join("");
    const edits = cart.some((l) => l.note);
    $("[data-cart-foot]").innerHTML = `<div class="sum"><div><span>Subtotal</span><b class="naira" data-sub>${naira(subtotal())}</b></div><div><span>Delivery</span><span>Calculated at checkout</span></div></div>${edits ? `<p class="note warn">${icon("i-info")}<span>Custom edits are reviewed before production. Any extra cost is confirmed with you first and is never charged automatically.</span></p>` : ""}<a class="btn full" href="#/checkout" data-close-cart>Checkout</a><p class="pay">${icon("i-lock")}No account needed · Pay securely with Paystack</p>`;
  }
  $("[data-cart-body]").addEventListener("click", (e) => {
    const line = e.target.closest("[data-line]"); if (!line) return; const l = cart.find((x) => x.key === line.dataset.line);
    const q = e.target.closest("[data-q]"); if (q) { l.qty = Math.max(1, Math.min(10, l.qty + +q.dataset.q)); save(); $(`[data-line="${l.key}"] [data-q="${q.dataset.q}"]`)?.focus(); return; }
    if (e.target.closest("[data-rm]")) { cart = cart.filter((x) => x !== l); save(); toast(`Removed ${byId[l.id].name}`); }
  });
  const drawer = $("[data-drawer]"), scrim = $("[data-scrim]");
  let lastFocus = null;
  function openCart() { lastFocus = document.activeElement; drawer.classList.add("open"); drawer.removeAttribute("inert"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; setTimeout(() => $("[data-cart-close]").focus(), 50); }
  function closeCart(restore = true) { if (!drawer.classList.contains("open")) return; drawer.classList.remove("open"); drawer.setAttribute("inert", ""); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true; if (restore && lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true }); }
  $("[data-cart-open]").addEventListener("click", openCart);
  $("[data-cart-close]").addEventListener("click", () => closeCart());
  scrim.addEventListener("click", () => closeCart());
  drawer.addEventListener("click", (e) => { if (e.target.closest("[data-close-cart]")) closeCart(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); menu(false); } });

  /* ---------- shared fragments ---------- */
  const card = (p) => `<a class="pc" href="#/product/${p.id}" data-pid="${p.id}"><div class="im">${img(p, p.colors[0])}${p.badge ? `<span class="pill">${p.badge}</span>` : ""}<span class="sw" aria-hidden="true">${p.colors.map((c) => `<i style="background:${S.colors[c].strap}"></i>`).join("")}</span></div><h3>${esc(p.name)}</h3><p><span>${p.type} · ${p.colors.length} colours</span><b class="naira">${naira(p.price)}</b></p></a>`;
  const crumbs = (list) => `<nav class="crumbs" aria-label="Breadcrumb">${list.map(([l, h], i) => (h ? `<a href="${h}">${l}</a>` : `<span aria-current="page">${l}</span>`) + (i < list.length - 1 ? "<span aria-hidden=\"true\">/</span>" : "")).join("")}</nav>`;
  const SIZE_CM = { 36: 23, 37: 23.7, 38: 24.4, 39: 25, 40: 25.7, 41: 26.4, 42: 27, 43: 27.7, 44: 28.4, 45: 29, 46: 29.7 };

  /* ---------- views ---------- */
  const V = {};
  V.home = () => {
    const [a, b, c] = [byId["rose-garden-slide"], byId["amaka-buckle-slide"], byId["ikoyi-mule"]];
    const past = [["eko-cross-slipper", "wine", "Wedding party, Ibadan"], ["cloud-fur-slide", "pink", "Birthday gift, Abuja"], ["adire-braid-slide", "olive", "Custom colour, Lekki"], ["rose-garden-slide", "wine", "Bridal set, Port Harcourt"], ["studded-signature-slide", "tan", "Recreated from TikTok"], ["ribbon-bow-mule", "cream", "Buckle removed, Yaba"], ["monogram-slide", "brown", "Initials added, Enugu"], ["lekki-chain-slide", "olive", "Silver chain swap"], ["yaba-toe-post", "wine", "Family order, Ilorin"], ["allen-everyday-slipper", "tan", "Wider fit, Kano"], ["amaka-buckle-slide", "pink", "Gift box, Ikeja"], ["ikoyi-mule", "tan", "Office pair, Benin"]];
    return {
      title: "D’FOOTPRINT — Handmade Slippers & Slides in Lagos | Nationwide Delivery",
      desc: "Handmade slippers, slides and mules made to order in Lagos. Featured designs from ₦12,000, approved custom edits and nationwide delivery across Nigeria.",
      html: `<div class="page"><section class="wrap"><div class="hero-grid">${[[a, "big"], [b, ""], [c, ""]].map(([p, k]) => `<a class="tile ${k}" href="#/product/${p.id}">${img(p, p.colors[k ? 0 : 1])}<span class="lab"><span>${esc(p.name)}</span><span class="p naira">${naira(p.price)}</span></span></a>`).join("")}</div></section>
        <section class="sec"><div class="wrap intro"><div><h1>Handmade slippers &amp; slides, made to order in Lagos.</h1><p>Every pair is cut, stitched and finished by hand, then delivered anywhere in Nigeria. Choose a featured design, or ask us to recreate or tweak one. Every custom edit is approved with you before we start.</p><div class="ctas"><a class="btn" href="#/shop">Shop featured designs${icon("i-arrow")}</a><a class="btn-o" href="#/custom">Request a custom pair</a></div></div>
          <ul class="usps"><li>${icon("i-hand")}<b>Handmade, not mass-produced</b><span>Made by our 3 shoemakers in 5–7 working days.</span></li><li>${icon("i-pen")}<b>Custom edits on approval</b><span>Remove a buckle, add a rose. We confirm before making.</span></li><li>${icon("i-truck")}<b>Nationwide delivery</b><span>Pickup, dispatch rider in Lagos, or waybill to all 36 states and the FCT.</span></li><li>${icon("i-lock")}<b>Secure checkout</b><span>Pay by card, bank transfer or USSD via Paystack.</span></li></ul></div></section>
        <section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-h"><h2>Featured designs</h2><a href="#/shop">View all ${S.products.length}${icon("i-arrow")}</a></div><div class="grid">${S.products.slice(0, 8).map(card).join("")}</div></div></section>
        <section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-h"><h2>How custom orders work</h2><a href="#/custom">Start a request${icon("i-arrow")}</a></div><ol class="steps"><li><b>Send your idea</b><p>Pick a featured design to edit, or upload a picture of a pair you'd like recreated.</p></li><li><b>We review &amp; quote</b><p>Within 24 hours we confirm what's possible, any extra cost and the timeline. Nothing is charged yet.</p></li><li><b>Approve &amp; we make it</b><p>Once you approve, we handcraft your pair and deliver it to you anywhere in Nigeria.</p></li></ol></div></section>
        <section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-h"><div><h2>Past work</h2><p style="margin:6px 0 0;color:var(--muted)">Over 250 designs made for customers since we started. Here are a few recent ones.</p></div></div><div class="work">${past.map(([id, col, cap]) => `<figure>${img(byId[id], col)}<figcaption>${cap}</figcaption></figure>`).join("")}</div></div></section>
        <section class="sec" style="padding-top:0"><div class="wrap"><div class="band"><div><h2>Buying for someone special?</h2><p>Add premium gift packaging (${naira(S.gift.packaging)}) and a handwritten greeting card (${naira(S.gift.card)}) at checkout. We never put prices inside gift boxes.</p></div><a class="btn" href="#/shop">Find a gift${icon("i-gift")}</a></div></div></section></div>`
    };
  };
  let sort = "featured";
  V.shop = (type, q) => {
    const t = type ? type[0].toUpperCase() + type.slice(1) : null;
    let list = S.products.filter((p) => (!t || p.type === t) && (!q || `${p.name} ${p.desc} ${p.type} ${p.accent} ${p.colors.join(" ")}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === "low") list = [...list].sort((x, y) => x.price - y.price); if (sort === "high") list = [...list].sort((x, y) => y.price - x.price);
    const h = q ? `Results for “${esc(q)}”` : t ? `Handmade ${t.toLowerCase()}` : "All featured designs";
    return {
      title: `${q ? `Search: ${q}` : t ? `Handmade ${t}` : "Shop handmade footwear"} — D’FOOTPRINT`, desc: `${t ? `Handmade ${t.toLowerCase()}` : "Handmade slippers, slides and mules"} made to order in Lagos with nationwide delivery. From ${naira(Math.min(...S.products.map((p) => p.price)))}.`,
      html: `<div class="page wrap"><div class="ph">${crumbs([["Home", "#/"], ["Shop", t || q ? "#/shop" : null], ...(t ? [[t, null]] : q ? [["Search", null]] : [])])}<h1>${h}</h1><p>${list.length} design${list.length === 1 ? "" : "s"} · made to order · prices exclude delivery</p></div>
        <div class="filters" style="margin:20px 0 24px">${[["All", "#/shop", !t && !q], ["Slides", "#/shop/slides", t === "Slides"], ["Slippers", "#/shop/slippers", t === "Slippers"], ["Mules", "#/shop/mules", t === "Mules"]].map(([l, hr, on]) => `<a href="${hr}"${on ? ' aria-current="page"' : ""}>${l}</a>`).join("")}<label class="sr" for="sort">Sort</label><select id="sort" data-sort><option value="featured"${sort === "featured" ? " selected" : ""}>Featured</option><option value="low"${sort === "low" ? " selected" : ""}>Price: low to high</option><option value="high"${sort === "high" ? " selected" : ""}>Price: high to low</option></select></div>
        ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<div class="empty"><p>No designs match “${esc(q)}”.</p><a class="btn-o" href="#/custom">Request it as a custom order</a></div>`}</div>`,
      mount() { $("[data-sort]").addEventListener("change", (e) => { sort = e.target.value; route(); }); }
    };
  };
  V.product = (id) => {
    const p = byId[id]; if (!p) return V.notfound();
    return {
      title: `${p.name} — Handmade ${p.type.replace(/s$/, "")} | D’FOOTPRINT`, desc: `${p.desc} From ${naira(p.price)}. Made to order in Lagos, delivered nationwide.`,
      html: `<div class="page wrap">${crumbs([["Home", "#/"], [p.type, `#/shop/${p.type.toLowerCase()}`], [p.name, null]])}<div class="pdp">
        <div class="gallery"><div class="main" data-main></div><div class="thumbs" role="group" aria-label="Product images" data-thumbs></div></div>
        <form class="info" novalidate data-add>${p.badge ? `<span class="pill">${p.badge}</span>` : ""}<h1>${esc(p.name)}</h1><p class="price"><small>From</small><span class="naira">${naira(p.price)}</span></p><p class="d">${esc(p.desc)}</p>
          <fieldset class="opt"><legend>Colour: <span data-cname>${S.colors[p.colors[0]].name}</span></legend><div class="chips">${p.colors.map((c, i) => `<label><input type="radio" name="color" value="${c}"${i ? "" : " checked"}><span><i style="background:${S.colors[c].strap}"></i>${S.colors[c].name}</span></label>`).join("")}</div></fieldset>
          <fieldset class="opt"><legend>Size (EU)<button type="button" data-guide>${icon("i-ruler")}Size guide</button></legend><div class="chips">${S.sizes.map((s) => `<label><input type="radio" name="size" value="${s}"><span>${s}</span></label>`).join("")}</div><p class="f"><span class="e" data-size-err></span></p></fieldset>
          <details class="custom"><summary>${icon("i-pen")}Request a custom edit (optional)</summary><div class="in"><p class="note warn" style="margin:0 0 12px">${icon("i-info")}<span>Edits are <b>subject to approval</b>. We confirm what's possible and any extra cost before production. You won't be charged for an edit until you agree.</span></p><ul>${S.edits.map(([e, c]) => `<li>${e}<span>${c}</span></li>`).join("")}</ul><label class="f" for="note">Describe your edit<textarea id="note" name="note" maxlength="300" placeholder="e.g. Please remove the buckle and add a small rose"></textarea></label><label class="check"><input type="checkbox" name="ack"><span>I understand custom edits need approval and may cost extra.</span></label><p class="f"><span class="e" data-ack-err></span></p></div></details>
          <div class="add"><button class="btn full" type="submit">${icon("i-bag")}Add to bag · <span class="naira">${naira(p.price)}</span></button><p class="pay">${icon("i-truck")}Made in 5–7 working days · Delivery fee shown at checkout</p></div>
          <div class="facts"><details><summary>${icon("i-truck")}Delivery</summary><p>Pickup in Lagos (free), dispatch rider within Lagos (${naira(S.lagosZones[0][1])}–${naira(S.lagosZones[2][1])}), or waybill to other states (${naira(4000)}–${naira(5500)}). Buyer pays delivery. <a href="#/shipping">Details</a></p></details><details><summary>${icon("i-check")}Returns &amp; exchanges</summary><p>If something is wrong because of us, we remake or exchange it. Other cases are handled individually, so message us within 48 hours of delivery. <a href="#/shipping">Read the policy</a></p></details><details><summary>${icon("i-hand")}Handmade note</summary><p>Leather grain and stitching vary slightly from pair to pair. Our images are illustrations of each design; real pairs are handmade to match.</p></details></div>
        </form></div>
        <section class="related"><div class="sec-h"><h2>You might also like</h2></div><div class="grid">${S.products.filter((x) => x.id !== p.id && x.type === p.type).concat(S.products.filter((x) => x.type !== p.type)).slice(0, 4).map(card).join("")}</div></section></div>`,
      mount() {
        const f = $("[data-add]"); let view3 = 0;
        const color = () => f.elements.color.value;
        const draw = () => { const c = color(), opts = [{}, { single: true }, { bg: "#E7E2DA" }]; $("[data-main]").innerHTML = img(p, c, opts[view3]); $("[data-thumbs]").innerHTML = opts.map((o, i) => `<button type="button" aria-label="View ${i + 1} of 3" aria-current="${i === view3}" data-v="${i}">${img(p, c, o)}</button>`).join(""); $("[data-cname]").textContent = S.colors[c].name; };
        $("[data-thumbs]").addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (b) { view3 = +b.dataset.v; draw(); } });
        $$("[name=color]", f).forEach((r) => r.addEventListener("change", draw));
        $$("[name=size]", f).forEach((r) => r.addEventListener("change", () => ($("[data-size-err]").textContent = "")));
        $("[data-guide]").addEventListener("click", sizeGuide);
        f.addEventListener("submit", (e) => {
          e.preventDefault(); const size = f.elements.size.value, note = f.elements.note.value.trim(), ack = f.elements.ack.checked;
          if (!size) { $("[data-size-err]").textContent = "Please choose your size."; $("[name=size]", f).focus(); return; }
          if (note && !ack) { $("[data-ack-err]").textContent = "Please confirm you understand edits need approval."; f.elements.ack.focus(); return; }
          $("[data-ack-err]").textContent = "";
          addToCart({ id: p.id, color: color(), size: +size, qty: 1, note });
          toast(`Added ${p.name} (EU ${size}) to your bag`);
        });
        draw();
      }
    };
  };
  function sizeGuide() { openDlg(`<div class="paysim" style="width:min(520px,calc(100vw - 24px))"><h2 id="dlg-title">Size guide</h2><p>Stand on paper, mark heel and longest toe, then measure in centimetres. Choose the size at or just above your foot length.</p><table class="size-t"><thead><tr><th>EU size</th><th>Foot length (cm)</th></tr></thead><tbody>${S.sizes.map((s) => `<tr><td>${s}</td><td>${SIZE_CM[s]}</td></tr>`).join("")}</tbody></table><p>Between sizes or wide feet? Add a note asking for a wider fit. It's usually free.</p><button class="btn full" type="button" data-dlg-close>Got it</button></div>`); }
  V.checkout = () => {
    if (!cart.length) return { title: "Checkout — D’FOOTPRINT", desc: "Checkout", html: `<div class="page wrap"><div class="done"><h1>Your bag is empty</h1><p>Add a design before checking out.</p><a class="btn" href="#/shop">Shop designs</a></div></div>` };
    const saved = store.get("dfp-checkout", {});
    return {
      title: "Checkout — D’FOOTPRINT", desc: "Secure checkout. No account needed.",
      html: `<div class="page wrap">${crumbs([["Bag", null], ["Checkout", null]])}<h1 style="font-size:32px">Checkout</h1><p style="color:var(--muted);margin:6px 0 0">No account needed. Guest checkout with payment by Paystack.</p>
        <form class="co" novalidate data-co><div>
          <section class="box"><h2><span class="n">1</span>Contact</h2><div class="fgrid"><label class="f">Full name<input type="text" name="name" autocomplete="name" value="${esc(saved.name || "")}"><span class="e"></span></label><label class="f">Phone (WhatsApp preferred)<input type="tel" name="phone" autocomplete="tel" placeholder="0803 000 0000" value="${esc(saved.phone || "")}"><span class="e"></span></label><label class="f w">Email (for your receipt)<input type="email" name="email" autocomplete="email" value="${esc(saved.email || "")}"><span class="e"></span></label></div></section>
          <section class="box"><h2><span class="n">2</span>Delivery</h2><div class="fgrid"><label class="f">State<select class="field" name="state"><option value="">Choose state…</option>${S.states.map((s) => `<option${saved.state === s ? " selected" : ""}>${s}</option>`).join("")}</select><span class="e"></span></label><label class="f" data-zone-wrap hidden>Lagos area<select class="field" name="zone">${S.lagosZones.map(([z, f], i) => `<option value="${i}">${z} (${naira(f)})</option>`).join("")}</select></label><label class="f w" data-addr-wrap>Delivery address<input type="text" name="address" autocomplete="street-address" placeholder="House number, street, area, city"><span class="e"></span></label></div>
            <div class="radio" role="radiogroup" aria-label="Delivery method" style="margin-top:14px" data-methods></div><p class="f"><span class="e" data-method-err></span></p></section>
          <section class="box"><h2><span class="n">3</span>Gift options</h2><label class="check"><input type="checkbox" name="packaging"><span><b>Premium gift packaging</b> · ${naira(S.gift.packaging)}<br><small style="color:var(--muted)">Rigid box, tissue wrap and ribbon. No prices inside.</small></span></label><label class="check"><input type="checkbox" name="card"><span><b>Handwritten greeting card</b> · ${naira(S.gift.card)}</span></label><label class="f" data-card-msg hidden>Card message<textarea name="cardmsg" maxlength="200" placeholder="Happy birthday, Tolu! Love, Ada"></textarea></label></section>
          ${cart.some((l) => l.note) ? `<p class="note warn" style="margin-top:16px">${icon("i-info")}<span>Your bag includes <b>custom edit requests</b>. You're paying the base price now. We'll confirm each edit (and any extra cost) by WhatsApp or email before production. If an edit isn't possible, you can choose the standard design or a full refund.</span></p>` : ""}
        </div>
        <aside class="osum"><section class="box"><h2>Order summary</h2>${cart.map((l) => { const p = byId[l.id]; return `<div class="oline"><span class="im">${img(p, l.color)}</span><div><b>${esc(p.name)} × ${l.qty}</b><small>${S.colors[l.color].name} · EU ${l.size}${l.note ? " · custom edit pending" : ""}</small></div><span class="naira">${naira(p.price * l.qty)}</span></div>`; }).join("")}
          <div class="sum" style="margin-top:14px" data-totals></div><button class="btn full" type="submit" style="margin-top:16px" data-pay>Pay</button><p class="pay" style="margin-top:10px">${icon("i-lock")}Secured by Paystack · card, transfer, USSD</p></section></aside></form></div>`,
      mount() {
        const f = $("[data-co]");
        const lagos = () => f.elements.state.value === "Lagos";
        const zoneFee = () => S.lagosZones[+f.elements.zone.value][1];
        const waybill = () => { const s = f.elements.state.value; return S.southWest.includes(s) ? 4000 : s === "FCT (Abuja)" ? 5000 : 5500; };
        let method = "";
        const methods = () => {
          const s = f.elements.state.value;
          const list = [["pickup", "Pickup in Lagos", "Yaba pickup point, by appointment. Address shared after order.", 0, lagos()], ["dispatch", "Dispatch rider (Lagos)", "1–2 days after production", lagos() ? zoneFee() : 0, lagos()], ["waybill", "Waybill (outside Lagos)", s && !lagos() ? `To ${s} · 2–5 days after production` : "For all other states", s && !lagos() ? waybill() : 0, !!s && !lagos()]];
          if (!list.find((m) => m[0] === method && m[4])) method = list.find((m) => m[4])?.[0] === "pickup" ? "dispatch" : (list.find((m) => m[4])?.[0] || "");
          $("[data-methods]").innerHTML = list.map(([k, l, d, fee, ok]) => `<label><input type="radio" name="method" value="${k}"${method === k ? " checked" : ""}${ok ? "" : " disabled"}><span><b>${l}</b><small>${ok ? d : s ? "Not available for this state" : "Choose a state first"}</small></span><span class="naira">${ok ? (fee ? naira(fee) : "Free") : "–"}</span></label>`).join("");
          $("[data-zone-wrap]").hidden = !lagos(); $("[data-addr-wrap]").hidden = method === "pickup";
          totals();
        };
        const fee = () => (method === "dispatch" ? zoneFee() : method === "waybill" ? waybill() : 0);
        const gift = () => (f.elements.packaging.checked ? S.gift.packaging : 0) + (f.elements.card.checked ? S.gift.card : 0);
        const total = () => subtotal() + fee() + gift();
        function totals() {
          $("[data-totals]").innerHTML = `<div><span>Subtotal</span><b class="naira">${naira(subtotal())}</b></div><div><span>Delivery${method ? ` (${method})` : ""}</span><b class="naira" data-fee>${method ? (fee() ? naira(fee()) : "Free") : "Choose method"}</b></div>${gift() ? `<div><span>Gift options</span><b class="naira">${naira(gift())}</b></div>` : ""}<div class="tot"><span style="color:inherit">Total</span><span class="naira" data-total>${naira(total())}</span></div>`;
          $("[data-pay]").textContent = `Pay ${naira(total())} with Paystack`;
        }
        f.elements.state.addEventListener("change", () => { method = ""; methods(); });
        f.elements.zone.addEventListener("change", methods);
        $("[data-methods]").addEventListener("change", (e) => { method = e.target.value; $("[data-method-err]").textContent = ""; methods(); });
        f.elements.packaging.addEventListener("change", totals);
        f.elements.card.addEventListener("change", () => { $("[data-card-msg]").hidden = !f.elements.card.checked; totals(); });
        const err = (n, m) => { const el = f.elements[n], e = el.closest(".f").querySelector(".e"); el.toggleAttribute("aria-invalid", !!m); if (m) el.setAttribute("aria-invalid", "true"); e.textContent = m || ""; return !m; };
        f.addEventListener("submit", (e) => {
          e.preventDefault();
          const ok = [err("name", f.elements.name.value.trim().length < 2 ? "Enter your full name" : ""), err("phone", validPhone(f.elements.phone.value) ? "" : "Enter a Nigerian phone number, e.g. 0803 000 0000"), err("email", validEmail(f.elements.email.value) ? "" : "Enter a valid email for your receipt"), err("state", f.elements.state.value ? "" : "Choose your state"), method === "pickup" ? err("address", "") : err("address", f.elements.address.value.trim().length < 8 ? "Enter your delivery address" : "")];
          if (!method) { $("[data-method-err]").textContent = "Choose a delivery method"; ok.push(false); }
          if (ok.includes(false)) { const first = $("[aria-invalid=true]", f); (first || $("[data-methods] input:not(:disabled)", f))?.focus(); toast("Please check the highlighted fields"); return; }
          store.set("dfp-checkout", { name: f.elements.name.value.trim(), phone: f.elements.phone.value.trim(), email: f.elements.email.value.trim(), state: f.elements.state.value });
          const amt = total();
          openDlg(`<div class="paysim"><p class="pill warn">Simulated payment</p><h2 id="dlg-title" style="margin-top:12px">Paystack checkout</h2><p class="amt naira">${naira(amt)}</p><p>${esc(f.elements.email.value.trim())}</p><p>In the live store this opens Paystack's secure payment window (card, bank transfer or USSD). This demo doesn't connect to Paystack and takes no money.</p><div style="display:grid;gap:10px;margin-top:16px"><button class="btn full" type="button" data-simpay>Simulate successful payment</button><button class="btn-o full" type="button" data-dlg-close>Cancel</button></div></div>`);
          $("[data-simpay]").addEventListener("click", () => {
            const ref = "DFP-" + Date.now().toString(36).slice(-6).toUpperCase();
            const order = { ref, at: new Date().toISOString(), lines: cart, subtotal: subtotal(), delivery: fee(), method, gift: gift(), total: amt, state: f.elements.state.value, name: f.elements.name.value.trim(), cardmsg: f.elements.card.checked ? f.elements.cardmsg.value.trim() : "" };
            const orders = store.get("dfp-orders", {}); orders[ref] = order; store.set("dfp-orders", orders);
            cart = []; save(); dlg.close(); location.hash = `#/order/${ref}`;
          });
        });
        methods();
      }
    };
  };
  V.order = (ref) => {
    const o = store.get("dfp-orders", {})[ref]; if (!o) return V.notfound();
    const edits = o.lines.some((l) => l.note);
    return {
      title: `Order ${ref} confirmed — D’FOOTPRINT`, desc: "Order confirmation",
      html: `<div class="page wrap"><div class="done">${icon("i-check", "big")}<h1>Thank you, ${esc(o.name.split(" ")[0])}!</h1><p>Your order <span class="ref">${ref}</span> is confirmed (simulated payment of <b class="naira">${naira(o.total)}</b>).</p>
        <section class="box"><h2>What happens next</h2><ol class="tl"><li>${icon("i-check")}<span><b>Payment received</b> (demo)</span></li>${edits ? `<li class="wait">${icon("i-info")}<span><b>Custom edits reviewed</b>: we'll message you within 24 hours to confirm before production.</span></li>` : ""}<li class="wait">${icon("i-hand")}<span><b>Handmade in 5–7 working days</b></span></li><li class="wait">${icon("i-truck")}<span><b>${o.method === "pickup" ? "Ready for pickup in Lagos" : o.method === "dispatch" ? "Dispatch rider delivery in Lagos" : `Waybill to ${esc(o.state)}`}</b></span></li></ol></section>
        <section class="box"><h2>Summary</h2><div class="sum"><div><span>Items</span><b class="naira">${naira(o.subtotal)}</b></div><div><span>Delivery</span><b class="naira">${o.delivery ? naira(o.delivery) : "Free"}</b></div>${o.gift ? `<div><span>Gift options</span><b class="naira">${naira(o.gift)}</b></div>` : ""}<div class="tot"><span style="color:inherit">Total</span><span class="naira">${naira(o.total)}</span></div></div>${o.cardmsg ? `<p class="note" style="margin-top:14px">${icon("i-gift")}<span>Card message: “${esc(o.cardmsg)}”</span></p>` : ""}</section>
        <p style="margin-top:24px"><a class="btn-o" href="#/shop">Continue shopping</a></p></div></div>`
    };
  };
  V.custom = () => ({
    title: "Custom Orders — Recreate or Edit a Design | D’FOOTPRINT", desc: "Send a picture of the slippers or slides you want. We review every custom request and quote before production.",
    html: `<div class="page wrap"><div class="ph">${crumbs([["Home", "#/"], ["Custom orders", null]])}<h1>Custom orders</h1><p>Send a picture of a pair you love, or describe the changes you want. We review every request and reply with what's possible, a price and a timeline. <b>Nothing is charged until you approve the quote.</b></p></div>
      <form class="co" novalidate data-custom><div>
        <section class="box"><h2><span class="n">1</span>Your design</h2><label class="drop" data-drop>${icon("i-upload")}<span><b>Upload reference photos</b><br><small>Up to 3 images, 5 MB each (JPG, PNG, WEBP). Photos stay on your device in this demo.</small></span><input class="sr" type="file" name="photos" accept="image/*" multiple data-file></label><div class="prev" data-prev></div>
          <div class="fgrid" style="margin-top:14px"><label class="f">Type<select class="field" name="type"><option>Slides</option><option>Slippers</option><option>Mules</option><option>Not sure</option></select></label><label class="f">Size (EU)<select class="field" name="size"><option value="">Choose…</option>${S.sizes.map((s) => `<option>${s}</option>`).join("")}</select><span class="e"></span></label><label class="f w">Describe what you want<textarea name="desc" maxlength="600" placeholder="e.g. Recreate this pair in wine colour, no buckle, with a gold chain"></textarea><span class="e"></span></label><label class="f">Budget (optional)<input type="text" name="budget" placeholder="e.g. ₦20,000"></label><label class="f">Needed by (optional)<input type="text" name="by" placeholder="e.g. 20 December"></label></div></section>
        <section class="box"><h2><span class="n">2</span>How we reach you</h2><div class="fgrid"><label class="f">Name<input type="text" name="name" autocomplete="name"><span class="e"></span></label><label class="f">WhatsApp number<input type="tel" name="phone" autocomplete="tel" placeholder="0803 000 0000"><span class="e"></span></label><label class="f w">Email (optional)<input type="email" name="email" autocomplete="email"><span class="e"></span></label></div></section>
        <button class="btn" type="submit" style="margin-top:16px">Send request for review</button><div data-cr-out style="margin-top:18px"></div></div>
        <aside class="osum"><section class="box"><h2>Good to know</h2><ul class="tl"><li>${icon("i-check")}<span>All custom edits need approval. Not every request is possible.</span></li><li>${icon("i-check")}<span>Some edits cost extra; you'll see the price before you pay.</span></li><li>${icon("i-check")}<span>Custom pairs take 7–10 working days after approval.</span></li><li>${icon("i-check")}<span>Custom orders are paid through a secure Paystack link after approval.</span></li></ul></section></aside></form></div>`,
    mount() {
      const f = $("[data-custom]"), files = [];
      const show = () => { $("[data-prev]").innerHTML = files.map((x, i) => `<figure><img src="${x.url}" alt="Reference photo ${i + 1}: ${esc(x.name)}"><figcaption>${esc(x.name)}</figcaption></figure>`).join(""); };
      const take = (list) => { for (const file of list) { if (files.length >= 3) { toast("Up to 3 photos"); break; } if (!file.type.startsWith("image/")) { toast(`${file.name} isn't an image`); continue; } if (file.size > 5e6) { toast(`${file.name} is over 5 MB`); continue; } files.push({ name: file.name, url: URL.createObjectURL(file) }); } show(); };
      $("[data-file]").addEventListener("change", (e) => { take(e.target.files); e.target.value = ""; });
      const drop = $("[data-drop]");
      ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); if (ev === "drop") take(e.dataTransfer.files); }));
      const err = (n, m) => { const el = f.elements[n], e = el.closest(".f").querySelector(".e"); if (m) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid"); e.textContent = m || ""; return !m; };
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const ok = [err("size", f.elements.size.value ? "" : "Choose a size"), err("desc", f.elements.desc.value.trim().length < 10 && !files.length ? "Describe your idea or upload a photo" : ""), err("name", f.elements.name.value.trim().length < 2 ? "Enter your name" : ""), err("phone", validPhone(f.elements.phone.value) ? "" : "Enter a Nigerian WhatsApp number"), err("email", !f.elements.email.value.trim() || validEmail(f.elements.email.value) ? "" : "Check your email")];
        if (ok.includes(false)) { $("[aria-invalid=true]", f).focus(); return; }
        const ref = "CR-" + Date.now().toString(36).slice(-5).toUpperCase();
        const msg = `Hello D’FOOTPRINT, custom request ${ref}: ${f.elements.type.value}, EU ${f.elements.size.value}. ${f.elements.desc.value.trim()}${f.elements.budget.value ? ` Budget: ${f.elements.budget.value}.` : ""}${f.elements.by.value ? ` Needed by: ${f.elements.by.value}.` : ""} (${files.length} photo${files.length === 1 ? "" : "s"} to share)`;
        $("[data-cr-out]").innerHTML = `<div class="note" role="status">${icon("i-check")}<span><b>Request ${ref} is ready for review.</b> We reply within 24 hours with feasibility, price and timeline; nothing is charged until you approve. To speed things up, send it with your photos on WhatsApp:<br><a class="btn-o" style="margin-top:10px" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener" data-wa>${icon("i-chat")}Share request on WhatsApp</a><br><small style="color:var(--muted)">Demo: the request is not sent to a server.</small></span></div>`;
        $("[data-cr-out] .note").focus?.();
      });
    }
  });
  const prose = (title, desc, body) => () => ({ title: `${title} — D’FOOTPRINT`, desc, html: `<div class="page wrap"><div class="ph">${crumbs([["Home", "#/"], [title, null]])}<h1>${title}</h1></div><div class="prose">${body}</div></div>` });
  V.about = prose("About D’FOOTPRINT", "D’FOOTPRINT is a small handmade footwear brand from Lagos.", `<p>D’FOOTPRINT started with one pair of slides made for a friend's birthday. Since then we've made over 250 designs for customers across Nigeria, most of whom found us on TikTok and ordered on WhatsApp.</p><p>We're a one-person brand working with three trusted shoemakers in Lagos. Every pair is made to order, so we don't hold big stock, and we can adjust a design when you ask.</p><h2>What we believe</h2><ul><li><b>Handmade should feel premium.</b> Clean finishing, careful packaging, no shortcuts.</li><li><b>Clear before clever.</b> Prices, delivery fees and custom edits are explained before you pay.</li><li><b>Fair when things go wrong.</b> If a mistake is ours, we fix it.</li></ul><p><a class="btn" href="#/shop">Shop featured designs</a></p>`);
  V.contact = prose("Contact", "Contact D’FOOTPRINT by WhatsApp, email or TikTok.", `<p>The fastest way to reach us is WhatsApp. We reply between 9am and 7pm, Monday to Saturday.</p><table><tbody><tr><th>WhatsApp</th><td>Number shown on the live site</td></tr><tr><th>Email</th><td><a href="mailto:hello@dfootprint.example">hello@dfootprint.example</a></td></tr><tr><th>TikTok</th><td>Where most of our new designs appear first</td></tr><tr><th>Location</th><td>Lagos, Nigeria (online only; pickup by appointment)</td></tr></tbody></table><p>For custom designs, use the <a href="#/custom">custom order form</a> so we have your size and photos.</p>`);
  V.faq = () => ({ title: "FAQ — D’FOOTPRINT", desc: "Answers about production time, custom edits, sizing, delivery and gifts.", html: `<div class="page wrap"><div class="ph">${crumbs([["Home", "#/"], ["FAQ", null]])}<h1>Frequently asked questions</h1></div><div class="prose faq">${S.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div></div>` });
  V.shipping = prose("Shipping & Returns", "Delivery options and fees across Nigeria, plus our returns and exchange policy.", `<h2>Delivery</h2><p>Every pair is made to order (5–7 working days), then delivered. The buyer pays delivery, and the fee is shown at checkout before payment.</p><table><thead><tr><th>Method</th><th>Where</th><th>Fee</th><th>Time after production</th></tr></thead><tbody><tr><td>Pickup</td><td>Yaba, Lagos (by appointment)</td><td>Free</td><td>Same day</td></tr>${S.lagosZones.map(([z, f]) => `<tr><td>Dispatch rider</td><td>Lagos: ${z}</td><td>${naira(f)}</td><td>1–2 days</td></tr>`).join("")}<tr><td>Waybill</td><td>South-West states</td><td>${naira(4000)}</td><td>2–3 days</td></tr><tr><td>Waybill</td><td>FCT (Abuja)</td><td>${naira(5000)}</td><td>2–4 days</td></tr><tr><td>Waybill</td><td>All other states</td><td>${naira(5500)}</td><td>3–5 days</td></tr></tbody></table><h2>Returns &amp; exchanges</h2><p>Because every pair is handmade to order, returns are handled case by case:</p><ul><li><b>Our mistake</b> (wrong size made, defect, wrong colour): we remake or exchange at no cost, including delivery.</li><li><b>Wrong size ordered:</b> message us within 48 hours of delivery. We'll usually remake for the cost of materials plus delivery.</li><li><b>Custom edits:</b> approved custom work can't be returned, but we'll always try to make it right.</li></ul><p>Contact us within 48 hours of delivery with photos and your order number.</p>`);
  V.privacy = prose("Privacy Policy", "How D’FOOTPRINT collects and uses your information.", `<p>We collect only what we need to make and deliver your order: your name, phone, email and delivery address, plus any photos you send for custom designs.</p><h2>Payments</h2><p>Card and bank details are entered on Paystack's secure checkout and are never stored by us.</p><h2>How we use your data</h2><ul><li>To make, confirm and deliver your order</li><li>To contact you about custom edits</li><li>To send receipts</li></ul><p>We don't sell your data. You can ask us to delete it at any time.</p><p><small>Sample policy for this demo store, not legal advice.</small></p>`);
  V.terms = prose("Terms & Conditions", "Terms for ordering from D’FOOTPRINT.", `<ul><li>All products are handmade to order. Small variations in colour, grain and stitching are part of the craft.</li><li>Featured-design prices are fixed at checkout. Delivery is paid by the buyer.</li><li>Custom edits are subject to approval, and extra costs are agreed in writing (WhatsApp or email) before production.</li><li>Production starts after payment is confirmed. Typical production time is 5–7 working days (7–10 for custom pairs).</li><li>Returns are handled as described in <a href="#/shipping">Shipping &amp; Returns</a>.</li></ul><p><small>Sample terms for this demo store, not legal advice.</small></p>`);
  V.notfound = () => ({ title: "Page not found — D’FOOTPRINT", desc: "Page not found", html: `<div class="page wrap"><div class="done"><h1>Page not found</h1><p>That page or design doesn't exist.</p><a class="btn" href="#/shop">Shop designs</a></div></div>` });

  /* ---------- router ---------- */
  function parse() {
    const h = location.hash; if (!h || h === "#" || h === "#/") return ["home"];
    if (!h.startsWith("#/")) return null;
    const parts = h.slice(2).split("/").map(decodeURIComponent);
    if (parts[0] === "shop") return ["shop", parts[1] && ["slides", "slippers", "mules"].includes(parts[1]) ? parts[1] : null];
    if (parts[0] === "search") return ["shop", null, parts[1] || ""];
    if (["product", "order"].includes(parts[0])) return [parts[0], parts[1]];
    return V[parts[0]] && !["notfound"].includes(parts[0]) ? [parts[0]] : ["notfound"];
  }
  let firstRoute = true;
  function route() {
    const r = parse(); if (!r) return;
    const v = V[r[0]](r[1], r[2]);
    view.innerHTML = v.html; document.title = v.title; $('meta[name="description"]').setAttribute("content", v.desc);
    const key = r[0] === "shop" ? (r[1] ? `shop/${r[1]}` : r[2] !== undefined ? "" : "shop") : r[0];
    $$("[data-nav]").forEach((a) => (a.dataset.nav === key ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
    if (v.mount) v.mount();
    scrollTo({ top: 0, behavior: "instant" }); if (!firstRoute) view.focus({ preventScroll: true }); firstRoute = false;
    view.dataset.route = r.filter((x) => x !== undefined && x !== null).join("/");
    menu(false); closeCart(false);
  }
  addEventListener("hashchange", route);

  /* ---------- header bits ---------- */
  $("[data-search]").addEventListener("submit", (e) => { e.preventDefault(); const q = $("[data-q]").value.trim(); location.hash = q ? `#/search/${encodeURIComponent(q)}` : "#/shop"; });
  const links = $("[data-links]"), burger = $("[data-burger]");
  function menu(open) { links.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-close" : "#i-menu"); }
  burger.addEventListener("click", () => menu(!links.classList.contains("open")));
  const dlg = $("[data-dlg]"), dbody = $("[data-dlg-body]");
  function openDlg(html) { dbody.innerHTML = html; if (!dlg.open) dlg.showModal(); $("button", dbody)?.focus(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-dlg-close]")) dlg.close(); });
  dlg.addEventListener("close", () => { if (!dlg.open) dbody.innerHTML = ""; });
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  renderCart();
  route();
})();
