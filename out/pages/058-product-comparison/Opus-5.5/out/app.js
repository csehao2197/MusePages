(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "i") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  /* ---------- generic headphone illustrations (no brand marks) ---------- */
  function phones(c, style = "band", label = "") {
    const cup = style === "mesh"
      ? `<path d="M60 80a90 70 0 0 1 180 0" fill="none" stroke="#D1D5DB" stroke-width="14"/><path d="M68 84a82 60 0 0 1 164 0" fill="none" stroke="${c}" stroke-width="5" stroke-dasharray="3 4" opacity=".6"/><rect x="40" y="100" width="70" height="104" rx="22" fill="${c}"/><rect x="190" y="100" width="70" height="104" rx="22" fill="${c}"/><rect x="50" y="112" width="50" height="80" rx="16" fill="#111827" opacity=".18"/><rect x="200" y="112" width="50" height="80" rx="16" fill="#111827" opacity=".18"/><circle cx="246" cy="104" r="6" fill="#9CA3AF"/>`
      : `<path d="M62 120a88 88 0 0 1 176 0" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round"/><ellipse cx="72" cy="150" rx="34" ry="48" fill="${c}"/><ellipse cx="228" cy="150" rx="34" ry="48" fill="${c}"/><ellipse cx="78" cy="150" rx="20" ry="34" fill="#000" opacity=".15"/><ellipse cx="222" cy="150" rx="20" ry="34" fill="#000" opacity=".15"/>${style === "slim" ? `<path d="M110 70h80" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>` : ""}`;
    return `<svg viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><ellipse cx="150" cy="222" rx="110" ry="8" fill="#000" opacity=".06"/>${cup}</svg>`;
  }

  /* ---------- data ---------- */
  const P = {
    sony: { name: "Sony WH-1000XM5", short: "Sony XM5", price: 348, was: 399, rating: 4.7, reviews: 2341, style: "slim", c: "#1A1A2E",
      colors: [["Black", "#1F2937"], ["Silver", "#D6D3D1"], ["Midnight Blue", "#1E3A8A"]], brand: "#2563EB" },
    bose: { name: "Bose QuietComfort Ultra", short: "Bose QC Ultra", price: 379, was: 429, rating: 4.6, reviews: 1892, style: "band", c: "#111827",
      colors: [["Black", "#111827"], ["White Smoke", "#E7E5E4"], ["Lunar Blue", "#475569"]], brand: "#059669" },
    apple: { name: "Apple AirPods Max", short: "AirPods Max", price: 549, was: null, rating: 4.5, reviews: 3104, style: "mesh", c: "#6B7280",
      colors: [["Space Gray", "#6B7280"], ["Silver", "#E5E7EB"], ["Sky Blue", "#93C5FD"], ["Midnight", "#1E293B"], ["Starlight", "#F5E6CC"]], brand: "#6B7280" }
  };
  const KEYS = ["sony", "bose", "apple"];
  const chosen = {}; KEYS.forEach((k) => (chosen[k] = 0));
  const art = (k, label) => phones(P[k].colors[chosen[k]][1], P[k].style, label);

  // value kinds: num (with better: low|high), bool, text; best: explicit indices override
  const SPECS = [
    { g: "Price & Value" },
    { l: "Price", v: ["$348", "$379", "$549"], num: [348, 379, 549], better: "low" },
    { g: "Audio" },
    { l: "Noise Cancellation", v: ["Adaptive ANC", "Adaptive ANC", "Active ANC"], bool: [true, true, true] },
    { l: "Driver Size", v: ["30mm", "35mm", "40mm"], num: [30, 35, 40], better: "high" },
    { l: "Codec Support", v: ["LDAC, SBC, AAC", "aptX Adaptive, SBC, AAC", "AAC only"] },
    { l: "Spatial Audio", v: ["360 Reality Audio", "Immersive Audio", "Dolby Atmos"], bool: [true, true, true], best: [2] },
    { l: "Transparency Mode", bool: [true, true, true] },
    { g: "Battery & Build" },
    { l: "Battery Life", v: ["30 hours", "24 hours", "20 hours"], num: [30, 24, 20], better: "high" },
    { l: "Weight", v: ["250g", "250g", "384g"], num: [250, 250, 384], better: "low" },
    { l: "Foldable", bool: [true, true, false] },
    { l: "Water/Sweat Resistance", v: ["IPX4", "None", "None"], bool: [true, false, false], best: [0] },
    { l: "Carrying Case", v: ["Included (slim)", "Included (hard shell)", "Smart Case (included)"] },
    { l: "Warranty", v: ["1 year", "1 year", "1 year"] },
    { g: "Connectivity" },
    { l: "Bluetooth Version", v: ["5.3", "5.3", "5.0"], num: [5.3, 5.3, 5.0], better: "high" },
    { l: "Multipoint Connection", bool: [true, true, false] },
    { l: "Wired Option", v: ["3.5mm included", "3.5mm included", "Lightning cable (adapter needed)"] },
    { l: "Voice Assistant", v: ["Google, Alexa, Siri", "Google, Alexa", "Siri only"] },
    { l: "App Support", v: ["Sony Headphones Connect", "Bose Music", "Apple Settings (limited)"] }
  ];
  const GROUPS = SPECS.filter((s) => s.g).map((s) => s.g);
  const RATINGS = [["Sound Quality", [4.8, 4.7, 4.8]], ["Noise Cancellation", [4.9, 4.8, 4.6]], ["Comfort", [4.7, 4.6, 4.3]], ["Battery Life", [4.8, 4.5, 4.2]], ["Build Quality", [4.5, 4.6, 4.9]], ["Value for Money", [4.7, 4.4, 3.8]]];
  const PROS = {
    sony: [["Industry-leading ANC", "30-hour battery", "Lightweight (250g)", "LDAC hi-res audio", "Multipoint Bluetooth"], ["Plastic build feels less premium", "Touch controls can be finicky", "Call quality just average"]],
    bose: [["Best-in-class comfort", "aptX Adaptive codec", "CustomTune sound calibration", "Excellent call quality", "Premium carrying case"], ["No water resistance", "Shorter battery (24h)", "Heavier than Sony"]],
    apple: [["Seamless Apple ecosystem", "Best build quality", "Dolby Atmos spatial audio", "Computational audio processing", "Premium materials (aluminum, steel)"], ["Heaviest option (384g)", "No multipoint", "Expensive at $549", "Lightning connector (adapter needed)", "Limited EQ controls"]]
  };
  const EXPERT = {
    sony: ["9.2/10", "The XM5 continues Sony's dominance in the ANC space. It's lighter, quieter, and longer-lasting than the competition — and at $348, it's the best value in premium wireless headphones.", "Alex Chen", "Audio Editor", "#2563EB"],
    bose: ["9.0/10", "Bose wins on comfort and calls. The Ultra's plush fit disappears on long flights, and Immersive Audio is genuinely fun for movies — just mind the 24-hour battery and lack of water resistance.", "Priya Natarajan", "Senior Reviewer", "#059669"],
    apple: ["8.6/10", "Gorgeous build and the smoothest experience for Apple users. Spatial audio with head tracking is excellent, but the weight, price and Lightning-only wired option keep it from the top spot.", "Marcus Bell", "Tech Editor", "#6B7280"]
  };
  const BUYER = {
    sony: ["Upgraded from XM4 — the difference in noise cancellation on my daily commute is night and day. Battery lasts my entire work week.", 5, "Michael R."],
    bose: ["Most comfortable headphones I've ever worn. The immersive audio mode makes movies feel like a theater.", 5, "Sarah T."],
    apple: ["If you're all-in on Apple, these are magical. The seamless switching between my iPhone, iPad, and MacBook is worth the premium.", 4, "David L."]
  };

  /* ---------- state from URL ---------- */
  const params = new URLSearchParams(location.search);
  let vis = (params.get("compare") || "").split(",").filter((k) => KEYS.includes(k));
  if (vis.length < 2) vis = KEYS.slice();
  let diffOnly = false;
  const groupsOn = new Set(GROUPS);
  let cur = 0; // mobile current product index (within vis)

  const stars = (r) => Array.from({ length: 5 }, (_, i) => icon("i-star", `i${i < Math.round(r - 0.05) ? "" : " off"}`)).join("");
  const stateURL = () => `${location.origin}${location.pathname}?compare=${vis.join(",")}`;

  /* ---------- comparison table ---------- */
  function bestIdx(s, idx) {
    if (s.best) return s.best.filter((i) => idx.includes(i));
    if (!s.num) return [];
    const vals = idx.map((i) => s.num[i]); if (new Set(vals).size === 1) return [];
    const t = s.better === "low" ? Math.min(...vals) : Math.max(...vals);
    return idx.filter((i) => s.num[i] === t);
  }
  function cellVal(s, i) {
    const label = s.v ? esc(s.v[i]) : "";
    if (s.bool) return s.bool[i] ? `<span class="yes">${icon("i-check")}${label || "Yes"}</span>` : `<span class="no">${icon("i-x")}${label || "No"}</span>`;
    return label;
  }
  function render() {
    const idx = vis.map((k) => KEYS.indexOf(k));
    document.documentElement.style.setProperty("--n", vis.length);
    let html = `<div role="row" class="head"><div class="cell lab" role="columnheader"><span class="sr">Specification</span></div>${vis.map((k) => { const p = P[k]; return `<div class="cell" role="columnheader" data-col="${k}">${vis.length > 2 ? `<button class="icon-btn rm" type="button" aria-label="Remove ${esc(p.name)} from comparison" data-remove="${k}">${icon("i-close")}</button>` : ""}<div class="p-img">${art(k, p.name + " headphones illustration")}</div><span class="p-name">${esc(p.name)}</span><span class="p-rate"><span class="stars" aria-hidden="true">${stars(p.rating)}</span><b>${p.rating}</b> (${p.reviews.toLocaleString("en-US")} reviews)</span><span class="p-price"><b>$${p.price}</b>${p.was ? `<s>$${p.was}</s>` : ""}</span>${p.was ? `<span class="save">Save $${p.was - p.price}</span>` : ""}<button class="btn" type="button" data-add="${k}">Add to Cart</button><div class="swatches" role="group" aria-label="${esc(p.name)} colors">${p.colors.map(([n, c], i) => `<button type="button" style="--c:${c}" aria-label="${n}" aria-pressed="${i === chosen[k]}" data-swatch="${k}:${i}"></button>`).join("")}</div><span class="sw-name">${p.colors[chosen[k]][0]}</span></div>`; }).join("")}</div>`;
    html += `<div role="row" class="vrow"><div class="cell vcell" role="cell">${$("[data-verdict]").innerHTML}</div></div>`;
    let alt = false, shown = 0, group = null;
    const rows = [];
    for (const s of SPECS) {
      if (s.g) { group = s.g; continue; }
      if (!groupsOn.has(group)) continue;
      const disp = idx.map((i) => (s.v ? s.v[i] : "") + (s.bool ? String(s.bool[i]) : ""));
      if (diffOnly && new Set(disp).size === 1) continue;
      rows.push([group, s]);
    }
    let lastG = null;
    for (const [g, s] of rows) {
      if (g !== lastG) { html += `<div role="row" class="grp"><div class="cell lab" role="rowheader"><span class="gl">${g}</span></div></div>`; lastG = g; alt = false; }
      const best = bestIdx(s, idx);
      html += `<div role="row" class="${alt ? "r-alt" : ""}" data-spec="${esc(s.l)}"><div class="cell lab" role="rowheader">${esc(s.l)}</div>${idx.map((i) => `<div class="cell${best.includes(i) ? " best" : ""}" role="cell">${cellVal(s, i)}${best.includes(i) ? `<span class="bestb">${icon("i-check")}Best</span>` : ""}</div>`).join("")}</div>`;
      alt = !alt; shown++;
    }
    if (!shown) html += `<div role="row"><div class="cell empty-diff" role="cell" style="grid-column:1/-1">No differing specs in the selected groups.</div></div>`;
    const cmp = $("[data-cmp]"); cmp.innerHTML = html; cmp.setAttribute("role", "table"); cmp.setAttribute("aria-rowcount", rows.length + 1);
    renderMini(); renderSections(); syncMobile();
  }

  /* ---------- below-table sections (respect visible products) ---------- */
  function renderSections() {
    const idx = vis.map((k) => KEYS.indexOf(k));
    $("[data-legend]").innerHTML = vis.map((k) => `<span><i style="--c:${P[k].brand}"></i>${esc(P[k].short)}</span>`).join("");
    $("[data-rates]").innerHTML = RATINGS.map(([cat, vals]) => { const v = idx.map((i) => vals[i]), mx = Math.max(...v); return `<div class="rate"><h3>${cat}</h3>${vis.map((k, j) => `<div class="bar-row"><span>${esc(P[k].short.split(" ")[0])}</span><span class="bar" role="img" aria-label="${esc(P[k].short)} ${v[j]} out of 5"><i style="--c:${P[k].brand}" data-w="${(v[j] / 5) * 100}%"></i></span><b>${v[j].toFixed(1)}${v[j] === mx ? `<span class="win" title="Winner">${icon("i-trophy")}<span class="sr">winner</span></span>` : ""}</b></div>`).join("")}</div>`; }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => observeBars()));
    $("[data-pros]").innerHTML = vis.map((k) => `<article class="pc"><div class="pc-h"><span class="thumb">${art(k)}</span><h3>${esc(P[k].name)}</h3></div><h4>Pros</h4><ul>${PROS[k][0].map((t) => `<li class="pro">${icon("i-check")}${esc(t)}</li>`).join("")}</ul><h4>Cons</h4><ul>${PROS[k][1].map((t) => `<li class="con">${icon("i-x")}${esc(t)}</li>`).join("")}</ul></article>`).join("");
    $("[data-experts]").innerHTML = vis.map((k) => { const [sc, t, n, r, c] = EXPERT[k]; return `<article class="ex"><div class="ex-h"><h3>${esc(P[k].name)}</h3><span class="score">${sc}</span></div><p>${esc(t)}</p><button class="link" type="button" data-review="${k}" style="align-self:flex-start">Read Full Review →</button><div class="who"><span class="av" style="--c:${c}">${n.split(" ").map((x) => x[0]).join("")}</span><span><b>${n}</b>${r}</span></div></article>`; }).join("");
    $("[data-buyers]").innerHTML = vis.map((k) => { const [q, s, n] = BUYER[k]; return `<figure class="by" style="--c:${P[k].brand}"><blockquote>“${esc(q)}”</blockquote><figcaption><span class="stars" aria-label="${s} out of 5 stars">${stars(s)}</span><b>${n}</b><span class="ver">${icon("i-check", "i sm")} Verified buyer</span> · ${esc(P[k].short)}</figcaption></figure>`; }).join("");
  }
  let barIO = null;
  function observeBars() {
    const bars = $$("[data-rates] .bar i");
    if (!("IntersectionObserver" in window)) { bars.forEach((b) => (b.style.width = b.dataset.w)); return; }
    if (barIO) barIO.disconnect();
    barIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { $$(".bar i", e.target).forEach((b) => (b.style.width = b.dataset.w)); barIO.unobserve(e.target); } }), { threshold: 0.2 });
    $$("[data-rates] .rate").forEach((r) => barIO.observe(r));
  }

  // static sections
  const BF = [["Best Overall", "sony", "Top noise cancellation, longest battery, best price"], ["Best for Comfort", "bose", "Plush fit for all-day wear, excellent sound"], ["Best for Apple Users", "apple", "Seamless ecosystem integration, premium build"]];
  $("[data-bestfor]").innerHTML = BF.map(([t, k, d]) => `<article class="bf"><span class="award">${icon("i-award")}${t}</span><div class="bf-p"><span class="thumb">${art(k)}</span><h3>${esc(P[k].name)}</h3></div><p>${d}</p><button class="btn" type="button" data-add="${k}">Add to Cart</button></article>`).join("");
  const CROSS = [["Sony WF-1000XM5 Earbuds", 278, 4.6, "In-ear alternative", "#1F2937"], ["Bose QuietComfort Earbuds II", 249, 4.5, "", "#E7E5E4"], ["Sennheiser Momentum 4", 299, 4.4, "", "#374151"], ["Audio-Technica ATH-M50xBT2", 179, 4.3, "", "#111827"]];
  $("[data-cross]").innerHTML = CROSS.map(([n, pr, r, note, c], i) => `<article class="xc"><div class="img">${i < 2 ? `<svg viewBox="0 0 120 100" aria-hidden="true"><ellipse cx="38" cy="50" rx="20" ry="24" fill="${c}"/><ellipse cx="82" cy="50" rx="20" ry="24" fill="${c}"/><circle cx="38" cy="50" r="8" fill="#000" opacity=".2"/><circle cx="82" cy="50" r="8" fill="#000" opacity=".2"/></svg>` : phones(c, "band")}</div><h3>${esc(n)}</h3><span class="pr">$${pr}</span><small>★ ${r}${note ? ` · ${note}` : ""}</small><button class="btn-o" type="button" data-add-x="${esc(n)}">Add to Cart</button></article>`).join("");

  /* ---------- compact sticky bar ---------- */
  function renderMini() {
    $("[data-mini-in]").innerHTML = `<span class="lbl">Comparing ${vis.length} products</span>${vis.map((k, i) => `<div class="mp${i === cur ? " cur" : ""}" data-mp="${k}"><b>${esc(P[k].short)}</b><span>$${P[k].price}</span><button class="btn" type="button" data-add="${k}" tabindex="-1">Add to Cart</button></div>`).join("")}`;
  }
  const mini = $("[data-mini]");
  function syncMiniVis() {
    const head = $("[data-cmp] .head .cell:not(.lab)"); if (!head) return;
    const navH = $(".nav").getBoundingClientRect().height;
    const cmpBottom = $("[data-cmp]").getBoundingClientRect().bottom;
    const show = head.getBoundingClientRect().bottom < navH && cmpBottom > navH + 80;
    mini.classList.toggle("show", show); mini.setAttribute("aria-hidden", !show);
    $$("button", mini).forEach((b) => (b.tabIndex = show ? 0 : -1));
  }
  addEventListener("scroll", syncMiniVis, { passive: true }); addEventListener("resize", syncMiniVis);

  /* ---------- mobile: one product at a time ---------- */
  const cmp = $("[data-cmp]");
  const mobile = () => matchMedia("(max-width: 767px)").matches;
  function colW() { const h = $("[data-cmp] .head .cell:not(.lab)"); return h ? h.getBoundingClientRect().width : 0; }
  function syncMobile() {
    cur = Math.max(0, Math.min(vis.length - 1, cur));
    const k = vis[cur], p = P[k];
    $("[data-mlabel]").textContent = `${cur + 1} of ${vis.length}: ${p.short}`;
    $("[data-mprev]").disabled = cur === 0; $("[data-mnext]").disabled = cur === vis.length - 1;
    $("[data-mbar-name]").textContent = p.name; $("[data-mbar-price]").textContent = `$${p.price}`;
    $("[data-mbar-add]").dataset.add = k;
    $$("[data-mp]").forEach((el) => el.classList.toggle("cur", el.dataset.mp === k));
  }
  function goCol(i) { cur = Math.max(0, Math.min(vis.length - 1, i)); cmp.scrollTo({ left: cur * colW(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); syncMobile(); }
  $("[data-mprev]").addEventListener("click", () => goCol(cur - 1));
  $("[data-mnext]").addEventListener("click", () => goCol(cur + 1));
  cmp.addEventListener("scroll", () => { if (!mobile()) return; const w = colW(); if (!w) return; const i = Math.round(cmp.scrollLeft / w); if (i !== cur) { cur = i; syncMobile(); } }, { passive: true });

  /* ---------- controls ---------- */
  $("[data-chips]").innerHTML = GROUPS.map((g) => `<button type="button" aria-pressed="true" data-g="${g}">${g}</button>`).join("");
  $("[data-chips]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-g]"); if (!b) return;
    const g = b.dataset.g;
    if (groupsOn.has(g) && groupsOn.size === 1) { toast("Keep at least one spec group visible."); return; }
    groupsOn.has(g) ? groupsOn.delete(g) : groupsOn.add(g);
    b.setAttribute("aria-pressed", groupsOn.has(g)); render();
  });
  $("[data-diff]").addEventListener("change", (e) => { diffOnly = e.target.checked; render(); toast(diffOnly ? "Showing only specs that differ" : "Showing all specs"); });
  $("[data-edit]").addEventListener("click", () => {
    openDlg(`<h3>Edit comparison</h3><p>Choose 2 or 3 headphones to compare.</p>${KEYS.map((k) => `<label class="pick"><input type="checkbox" value="${k}" ${vis.includes(k) ? "checked" : ""}><span class="thumb">${art(k)}</span><span><b>${esc(P[k].name)}</b><br><small>$${P[k].price}</small></span></label>`).join("")}<p class="err" data-ed-err role="alert"></p><button class="btn" type="button" data-apply>Update comparison</button>`);
    $("[data-apply]", body).addEventListener("click", () => {
      const sel = $$("input:checked", body).map((i) => i.value);
      if (sel.length < 2) { $("[data-ed-err]", body).textContent = "Pick at least 2 products."; return; }
      vis = KEYS.filter((k) => sel.includes(k)); cur = 0; history.replaceState(null, "", stateURL()); render(); dlg.close(); toast(`Comparing ${vis.length} products`);
    });
  });
  cmp.addEventListener("click", (e) => {
    const r = e.target.closest("[data-remove]");
    if (r) { vis = vis.filter((k) => k !== r.dataset.remove); cur = 0; history.replaceState(null, "", stateURL()); render(); toast(`Removed ${P[r.dataset.remove].short} — use Edit comparison to add it back.`); return; }
    const s = e.target.closest("[data-swatch]");
    if (s) { const [k, i] = s.dataset.swatch.split(":"); chosen[k] = Number(i); render(); toast(`${P[k].short}: ${P[k].colors[i][0]}`); }
  });
  $("[data-share]").addEventListener("click", () => {
    const url = stateURL();
    const done = () => toast("Comparison link copied");
    try { navigator.clipboard.writeText(url).then(done, () => openDlg(`<h3>Share this comparison</h3><input readonly value="${esc(url)}" style="min-height:44px;padding:0 10px;border:1px solid #E2E8F0;border-radius:8px" aria-label="Comparison link">`)); } catch { openDlg(`<h3>Share this comparison</h3><input readonly value="${esc(url)}" aria-label="Comparison link">`); }
  });

  /* ---------- cart / wishlist / misc ---------- */
  let cart = 0;
  function addCart(label, btn) {
    cart += 1; const b = $("[data-cart-count]"); b.hidden = false; b.textContent = cart;
    $("[data-cart-btn]").setAttribute("aria-label", `Cart, ${cart} item${cart === 1 ? "" : "s"}`);
    if (btn) { const t = btn.textContent; btn.classList.add("added"); btn.textContent = "Added ✓"; setTimeout(() => { btn.classList.remove("added"); btn.textContent = t; }, 1300); }
    toast(`${label} added to cart`);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]"); if (a) { const k = a.dataset.add; addCart(`${P[k].name} (${P[k].colors[chosen[k]][0]})`, a); return; }
    const x = e.target.closest("[data-add-x]"); if (x) { addCart(x.dataset.addX, x); return; }
    const rv = e.target.closest("[data-review]");
    if (rv) { const k = rv.dataset.review, [sc, t, n, r] = EXPERT[k]; openDlg(`<h3>${esc(P[k].name)} review · ${sc}</h3><p>${esc(t)}</p><p>We tested noise cancellation on a commuter train and in an open office, ran battery rundowns at 50% volume with ANC on, and wore each pair for full workdays.</p><p style="font-size:13px;color:#64748B">By ${n}, ${r} · illustrative review excerpt</p>`); return; }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} isn't part of this demo page.`); }
  });
  $("[data-cart-btn]").addEventListener("click", () => toast(cart ? `${cart} item${cart === 1 ? "" : "s"} in your cart (demo)` : "Your cart is empty"));
  $("[data-wish-btn]").addEventListener("click", () => toast("2 items in your wishlist (demo)"));
  const acct = $("[data-acct]"), am = $("[data-acct-menu]");
  acct.addEventListener("click", (e) => { e.stopPropagation(); const show = am.hidden; am.hidden = !show; acct.setAttribute("aria-expanded", show); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".acct")) { am.hidden = true; acct.setAttribute("aria-expanded", "false"); } });
  const burger = $("[data-burger]"), mnav = $("[data-mnav]");
  burger.addEventListener("click", () => { const show = mnav.hidden; mnav.hidden = !show; burger.setAttribute("aria-expanded", show); burger.setAttribute("aria-label", show ? "Close menu" : "Open menu"); });
  $$("a", mnav).forEach((a) => a.addEventListener("click", () => { mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { am.hidden = true; acct.setAttribute("aria-expanded", "false"); } });
  $("[data-nl]").addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.email.value.trim(), m = $("[data-nl-msg]"); if (!validEmail(v)) { m.className = "nl-msg bad"; m.textContent = "Please enter a valid email."; return; } m.className = "nl-msg ok"; m.textContent = "Subscribed! (Demo — nothing is sent.)"; e.target.reset(); });
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input, .btn", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); }

  render(); syncMiniVis();
})();
