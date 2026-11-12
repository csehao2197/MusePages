(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };

  /* Hero */
  $("[data-art=hero]").innerHTML = Art.hero();
  if (!reduced) {
    const colors = ["#FEF08A", "#E11D48", "#F97316", "#38BDF8", "#A3E635", "#F9A8D4"];
    $("[data-confetti]").innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${colors[i % 6]};animation-duration:${9 + (i % 7)}s;animation-delay:-${(i * 1.3) % 12}s;transform:rotate(${i * 25}deg)"></i>`).join("");
  }
  const start = new Date(2026, 6, 25, 16, 0);
  const days = Math.ceil((start - new Date()) / 864e5);
  $("[data-countdown]").textContent = days > 0 ? `${days} day${days === 1 ? "" : "s"} to go — early birds get the best seats` : days > -3 ? "Happening now — come on down!" : "See you next summer — 2027 dates announced soon";

  /* Nav */
  const nav = $(".nav");
  window.addEventListener("scroll", () => nav.classList.toggle("shadow", window.scrollY > 8), { passive: true });
  const ov = $("#overlay"), burger = $("[data-burger]");
  const setOv = (open) => { ov.hidden = !open; burger.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; if (open) $("[data-ov-close]").focus(); };
  burger.addEventListener("click", () => setOv(true));
  $("[data-ov-close]").addEventListener("click", () => { setOv(false); burger.focus(); });
  $$("#overlay nav a").forEach((a) => a.addEventListener("click", () => setOv(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !ov.hidden) { setOv(false); burger.focus(); } });

  /* Lineup */
  const trucks = [
    ["Taco Libre", "Mexican", "Wood-fired birria tacos, elote, churros", "A", "birria", "Fan Favorite", ["Mexican"]],
    ["Bao Down", "Asian Fusion", "Steamed bao buns, kimchi fries, matcha soft serve", "B", "bao", "", ["Asian", "Fusion"]],
    ["Holy Smoke BBQ", "BBQ", "14-hour brisket, pulled pork mac & cheese, cornbread", "A", "brisket", "New This Year", ["BBQ"]],
    ["Green Machine", "Vegan", "Jackfruit sliders, cauliflower wings, açaí bowls", "C", "jackfruit", "", ["Vegan"]],
    ["Catch of the Day", "Seafood", "Lobster rolls, fish & chips, clam chowder bowls", "B", "lobster", "", ["Seafood"]],
    ["Sugar Rush", "Desserts", "Mini donuts, rolled ice cream, churro sundaes", "C", "rolled", "", ["Desserts"]],
    ["Naan Stop", "Mediterranean", "Lamb shawarma wraps, falafel plates, halloumi fries", "A", "shawarma", "", ["Mediterranean"]],
    ["Umami Lab", "Fusion", "Ramen burgers, Korean corn dogs, miso caramel popcorn", "B", "ramen", "Must Try", ["Fusion", "Asian"]],
  ];
  const cuisines = ["All", "Mexican", "Asian", "BBQ", "Vegan", "Seafood", "Desserts", "Fusion", "Mediterranean"];
  let cuisine = "All", zone = null;
  $("[data-chips]").innerHTML = cuisines.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-c="${c}">${c}</button>`).join("");
  $("[data-trucks]").innerHTML = trucks.map(([n, c, d, z, art, badge, tags]) => `<article class="truck" data-tags="${tags.join(",")}" data-zone="${z}">
    ${badge ? `<span class="t-badge">${badge}</span>` : ""}<div class="t-img">${Art.food(art, `${d.split(",")[0]} from ${n}`)}</div>
    <div class="t-body"><span class="cuisine">${c}</span><h3>${n}</h3><p>${d}</p><span class="zone ${z}">${icon("pin")}Zone ${z}</span></div></article>`).join("");
  function filter() {
    let n = 0;
    $$(".truck").forEach((t) => { const ok = (cuisine === "All" || t.dataset.tags.split(",").includes(cuisine)) && (!zone || t.dataset.zone === zone); t.hidden = !ok; if (ok) n++; });
    $("[data-empty]").hidden = n > 0;
    const note = $("[data-zone-note]");
    note.hidden = !zone;
    if (zone) $("span", note).textContent = `Showing Zone ${zone} (${{ A: "West", B: "Center", C: "East" }[zone]})`;
    $$(".zone-poly").forEach((p) => p.classList.toggle("on", p.dataset.z === zone));
    $$("[data-legend-z]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.legendZ === zone)));
  }
  $$("[data-c]").forEach((b) => b.addEventListener("click", () => { cuisine = b.dataset.c; $$("[data-c]").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); filter(); }));
  $("[data-clear-zone]").addEventListener("click", () => { zone = null; filter(); });
  $("[data-all-trucks]").addEventListener("click", (e) => { e.preventDefault(); toast("The full 50+ truck lineup drops June 1 — sign up below for first look"); });
  function pickZone(z) { zone = zone === z ? null : z; filter(); $("#lineup").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); toast(zone ? `Showing trucks in Zone ${zone}` : "Showing all zones"); }

  /* Map */
  const zones = [["A", "West", "Mexican · BBQ · Mediterranean", "#EF4444", "M70 150 L 330 120 L 340 330 L 80 360 Z"], ["B", "Center", "Asian · Seafood · Fusion", "#3B82F6", "M370 115 L 620 110 L 630 320 L 380 330 Z"], ["C", "East", "Vegan · Desserts · Drinks", "#22C55E", "M660 110 L 920 130 L 910 340 L 670 320 Z"]];
  const marks = [["Main Stage", "#F97316", 500, 400, "Center lawn"], ["Acoustic Stage", "#8B5CF6", 250, 470, "South garden"], ["DJ Tent", "#EC4899", 500, 60, "North pier"], ["Beer & Cocktail Garden", "#EAB308", 790, 420, "21+ with ID"]];
  const svcs = [["Restrooms", 120, 420], ["First Aid", 640, 470], ["ATM", 360, 410], ["ATM", 870, 380], ["Restrooms", 860, 470]];
  const gates = [["Gate 1 · Naito Pkwy & SW Salmon", 40, 470], ["Gate 2 · SW Ankeny", 960, 470]];
  const map = $("[data-map]");
  map.innerHTML = `<rect width="1000" height="560" fill="#BBF7D0"/><path d="M0 0 H1000 V90 Q 760 70 500 95 T 0 85 Z" fill="#7DD3FC"/>${[...Array(6)].map((_, i) => `<path d="M${i * 180 + 20} 40 q 30 -8 60 0" stroke="#fff" stroke-width="3" opacity=".6" fill="none"/>`).join("")}
    <text x="20" y="34" font-family="Inter, sans-serif" font-weight="700" font-size="14" fill="#0369A1">Willamette River</text>
    <rect x="460" y="20" width="80" height="70" rx="8" fill="#D6D3D1"/><path d="M0 520 H1000" stroke="#E7E5E4" stroke-width="40"/><text x="420" y="526" font-family="Inter, sans-serif" font-weight="700" font-size="13" fill="#78716C">NAITO PARKWAY</text>
    ${[...Array(14)].map((_, i) => `<circle cx="${40 + i * 70}" cy="${100 + (i % 2) * 6}" r="14" fill="#4ADE80"/>`).join("")}
    ${zones.map(([z, w, c, col, d]) => `<path class="zone-poly" data-z="${z}" d="${d}" fill="${col}" fill-opacity=".28" stroke="${col}" stroke-width="3" tabindex="0" role="button" aria-label="Zone ${z} (${w}): ${c}. Show these trucks"/>`).join("")}
    ${zones.map(([z, w, c, col, d]) => { const pts = d.match(/\d+ \d+/g).map((p) => p.split(" ").map(Number)); const cx = pts.reduce((s, p) => s + p[0], 0) / 4, cy = pts.reduce((s, p) => s + p[1], 0) / 4; return `<g pointer-events="none"><text x="${cx}" y="${cy - 8}" text-anchor="middle" font-family="'Bricolage Grotesque', sans-serif" font-weight="800" font-size="34" fill="${col}">ZONE ${z}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-family="Inter, sans-serif" font-weight="600" font-size="13" fill="#1C1917">${c}</text>${[0, 1, 2].map((k) => `<path d="M${cx - 60 + k * 60} ${cy + 50} c 0 -12 -10 -18 -10 -26 a 10 10 0 0 1 20 0 c 0 8 -10 14 -10 26z" fill="${col}" stroke="#fff" stroke-width="2"/>`).join("")}</g>`; }).join("")}
    ${marks.map(([n, col, x, y]) => `<g class="mk" transform="translate(${x} ${y})"><circle r="22" fill="${col}" stroke="#fff" stroke-width="4"/><path d="M-7 -6 l 14 6 l -14 6 z" fill="#fff"/><text y="40" text-anchor="middle" font-family="Inter, sans-serif" font-weight="700" font-size="13" fill="#1C1917">${n}</text></g>`).join("")}
    ${svcs.map(([n, x, y]) => `<g transform="translate(${x} ${y})"><rect x="-13" y="-13" width="26" height="26" rx="6" fill="#78716C"/><text y="5" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="12" fill="#fff">${n === "Restrooms" ? "WC" : n === "First Aid" ? "+" : "$"}</text></g>`).join("")}
    ${gates.map(([n, x, y]) => `<g transform="translate(${x} ${y})"><rect x="-22" y="-14" width="44" height="28" rx="6" fill="#1C1917"/><path d="M-12 -4 h 24 v 8 h -24 z" fill="#FEF08A"/></g>`).join("")}`;
  $$(".zone-poly", map).forEach((p) => {
    p.addEventListener("click", () => pickZone(p.dataset.z));
    p.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickZone(p.dataset.z); } });
  });
  $("[data-legend]").innerHTML = zones.map(([z, w, c, col]) => `<li><button type="button" data-legend-z="${z}" aria-pressed="false"><i style="background:${col}"></i>Zone ${z} · ${w}</button></li>`).join("")
    + marks.map(([n, col]) => `<li><i style="background:${col}"></i>${n}</li>`).join("") + `<li><i class="sq" style="background:#78716C"></i>Restrooms · First Aid · ATMs</li><li><i class="sq" style="background:#1C1917"></i>Entry gates (2)</li>`;
  $$("[data-legend-z]").forEach((b) => b.addEventListener("click", () => pickZone(b.dataset.legendZ)));
  $("[data-map-list]").innerHTML = zones.map(([z, w, c, col]) => `<li><h3><i style="background:${col}"></i>Zone ${z} · ${w}</h3><p>${c}</p><p><b>Trucks:</b> ${trucks.filter((t) => t[3] === z).map((t) => t[0]).join(", ")}</p></li>`).join("")
    + marks.map(([n, col, , , d]) => `<li><h3><i style="background:${col}"></i>${n}</h3><p>${d}</p></li>`).join("") + `<li><h3>Gates &amp; services</h3><p>${gates.map((g) => g[0]).join(" · ")}. Restrooms in Zones A &amp; C, First Aid by the Main Stage, ATMs in Zones A &amp; C.</p></li>`;
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-view]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $("[data-map-wrap]").hidden = b.dataset.view !== "map";
    $("[data-map-list]").hidden = b.dataset.view !== "list";
  }));

  /* Schedule */
  const sched = [
    [["4:00 PM", "Gates open", "all", "All zones", "All trucks serving"], ["5:30 PM", "Opening Toast", "main", "Main Stage", "With the festival MC"], ["6:00 PM", "Live band: The Saucy Peppers", "main", "Main Stage", "Indie rock"], ["7:30 PM", "The Big Bite Challenge", "main", "Main Stage", "12 contestants, 5 min, most tacos wins"], ["8:30 PM", "DJ set: DJ Wasabi", "dj", "DJ Tent", "Electronic/funk"], ["10:00 PM", "Festival closes", "all", "All zones", "Safe travels home!"]],
    [["11:00 AM", "Gates open", "all", "All zones", "Brunch trucks serving"], ["12:00 PM", "Kids cooking demo", "acoustic", "Acoustic Stage", "Little chefs, big flavors"], ["1:00 PM", "Chef panel: The Street Food Revolution", "acoustic", "Acoustic Stage", "Featured truck chefs talk shop"], ["3:00 PM", "Live band: Plantain Kings", "main", "Main Stage", "Latin funk"], ["5:00 PM", "Cocktail masterclass", "garden", "Beer Garden", "$15 add-on"], ["7:00 PM", "Headliner: Neon Flavor", "main", "Main Stage", "Funk/soul"], ["10:30 PM", "Festival closes", "all", "All zones", "See you tomorrow"]],
    [["11:00 AM", "Gates open", "all", "All zones", "Brunch service"], ["12:30 PM", "People's Choice Awards voting opens", "all", "All zones", "Vote for your favorite truck"], ["2:00 PM", "Acoustic set: Rosemary & Thyme", "acoustic", "Acoustic Stage", "Folk duo"], ["4:00 PM", "Awards ceremony", "main", "Main Stage", "Best Truck, Best Dessert, Most Creative, People's Choice"], ["5:00 PM", "Final service hour", "all", "All zones", "Last call at all trucks"], ["6:00 PM", "Festival closes", "all", "All zones", "Until next summer"]],
  ];
  const dTabs = $$("[data-days] [role=tab]"), sp = $("[data-sched]");
  let di = 0;
  function showDay(i, focus) {
    di = (i + 3) % 3;
    dTabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === di)); t.tabIndex = j === di ? 0 : -1; });
    if (focus) dTabs[di].focus();
    sp.setAttribute("aria-labelledby", dTabs[di].id);
    sp.innerHTML = sched[di].map(([t, n, k, l, d]) => `<li><time>${t}</time><h3>${n}</h3><span class="loc ${k}">${l}</span><p>${d}</p></li>`).join("");
  }
  dTabs.forEach((t, i) => { t.addEventListener("click", () => showDay(i)); t.addEventListener("keydown", (e) => { const n = { ArrowRight: i + 1, ArrowLeft: i - 1 }[e.key]; if (n !== undefined) { e.preventDefault(); showDay(n, true); } }); });
  showDay(0);
  let sx = null;
  sp.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  sp.addEventListener("touchend", (e) => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) showDay(di + (dx < 0 ? 1 : -1)); sx = null; }, { passive: true });

  /* Music */
  const artists = [["Neon Flavor", "Headliner · Sat 7PM", "Portland's own funk & soul collective. Think Vulfpeck meets Anderson .Paak."], ["The Saucy Peppers", "Friday · 6PM", "High-energy indie rock with a splash of ska. Guaranteed dancing."], ["Rosemary & Thyme", "Sunday acoustic · 2PM", "Husband-wife folk duo. Warm harmonies, heartfelt originals."]];
  $("[data-artists]").innerHTML = artists.map(([n, w, d], i) => `<article class="artist"><div class="a-img">${Art.artist(i)}<span class="a-when">${w}</span></div><div class="a-body"><h3>${n}</h3><p>${d}</p>
    <div class="player" data-player="${i}"><button class="play" type="button" aria-label="Play preview of ${n}" aria-pressed="false">${icon("play")}</button><div class="bar"><i></i></div><div class="eq" aria-hidden="true"><span></span><span></span><span></span></div><p class="t-label" data-t>0:00 / 0:30 preview</p></div></div></article>`).join("");
  let active = null;
  function stop(p) { if (!p) return; clearInterval(p.timer); p.el.classList.remove("playing"); const b = $(".play", p.el); b.setAttribute("aria-pressed", "false"); b.innerHTML = icon("play"); }
  $$("[data-player]").forEach((el) => {
    const st = { el, t: 0, timer: null };
    $(".play", el).addEventListener("click", () => {
      if (active === st && el.classList.contains("playing")) { stop(st); return; }
      stop(active); active = st;
      el.classList.add("playing"); const b = $(".play", el); b.setAttribute("aria-pressed", "true"); b.innerHTML = icon("pause");
      st.timer = setInterval(() => { st.t = (st.t + 0.25) % 30.25; $(".bar i", el).style.width = `${(st.t / 30) * 100}%`; $("[data-t]", el).textContent = `0:${String(Math.floor(st.t)).padStart(2, "0")} / 0:30 preview`; if (st.t >= 30) { st.t = 0; stop(st); } }, 250);
    });
  });
  const lightsSvg = $("[data-string]");
  lightsSvg.innerHTML = `<path d="M0 10 Q 360 80 720 20 T 1440 20" stroke="#57534E" stroke-width="2" fill="none"/>${Array.from({ length: 30 }, (_, i) => { const x = i * 50, y = 10 + Math.sin(i / 29 * Math.PI * 2) * -25 + 30; return `<circle cx="${x}" cy="${y}" r="5" fill="${["#FEF08A", "#FDBA74", "#FDA4AF"][i % 3]}"/><circle cx="${x}" cy="${y}" r="14" fill="#FEF08A" opacity=".15"/>`; }).join("")}`;

  /* FAQ */
  const faqs = [["Can I bring my dog?", "Yes! StreetBite Fest is dog-friendly. Please keep dogs leashed and clean up after them. Water stations are available in each zone."], ["Is there parking?", "Limited street parking available. We recommend biking, MAX Light Rail (Yamhill District stop), or rideshare. Bike valet is free!"], ["Can I use cards or is it cash only?", "All trucks accept cards and mobile pay. A few also take cash. Two ATMs are on-site."], ["Are there vegetarian/vegan options?", "Absolutely! Zone C features dedicated vegan trucks, and most other trucks have at least one plant-based option. Look for the green leaf icon."], ["What if it rains?", "Rain or shine! This is Portland, after all. Covered seating is available in the VIP and Beer Garden areas. We recommend layers."], ["Can I buy tickets at the door?", "Yes, if not sold out. Door prices are $5 more per tier. We strongly recommend buying online."], ["Is the festival accessible?", "Yes. All pathways are ADA accessible. Accessible parking and restrooms available. Contact us for specific accommodation needs."], ["What are the age restrictions?", "All ages welcome! Kids under 10 are free. The Beer & Cocktail Garden is 21+ with valid ID."]];
  $("[data-faq]").innerHTML = faqs.map(([q, a]) => `<details><summary>${q}<span class="plus" aria-hidden="true">${icon("plus")}</span></summary><p>${a}</p></details>`).join("");

  /* Tickets */
  const tiers = { day: ["Day Pass", 15], weekend: ["Weekend Pass", 35], vip: ["VIP Experience", 89] };
  const qty = { day: 0, weekend: 0, vip: 0 };
  let promo = false;
  const co = $('[data-modal="checkout"]'), form = $("[data-co]");
  function renderCo() {
    $("[data-lines]").innerHTML = Object.entries(tiers).map(([k, [n, p]]) => `<li><div><b>${n}</b><small>$${p} each</small></div><div class="qty"><button type="button" data-q="${k}" data-d="-1" aria-label="Fewer ${n}" ${qty[k] ? "" : "disabled"}>${icon("minus")}</button><output>${qty[k]}</output><button type="button" data-q="${k}" data-d="1" aria-label="More ${n}" ${qty[k] >= 20 ? "disabled" : ""}>${icon("plus")}</button></div><span class="l-total">$${p * qty[k]}</span></li>`).join("");
    const count = Object.values(qty).reduce((a, b) => a + b, 0), sub = Object.entries(qty).reduce((s, [k, q]) => s + tiers[k][1] * q, 0);
    const disc = promo && count >= 8 ? Math.round(sub * 0.2 * 100) / 100 : 0;
    if (promo && count < 8) { $("[data-promo-msg]").textContent = `CREW20 applies to groups of 8+ — add ${8 - count} more ticket${8 - count === 1 ? "" : "s"}.`; $("[data-promo-msg]").className = "promo-msg bad"; }
    else if (promo) { $("[data-promo-msg]").textContent = "CREW20 applied — 20% off your crew!"; $("[data-promo-msg]").className = "promo-msg ok"; }
    $("[data-sub]").textContent = `$${sub.toFixed(2)}`;
    $("[data-disc-row]").hidden = !disc; $("[data-disc]").textContent = `−$${disc.toFixed(2)}`;
    $("[data-total]").textContent = `$${(sub - disc).toFixed(2)}`;
    $("[data-day-pick]").hidden = !qty.day;
    return { count, total: sub - disc };
  }
  $("[data-lines]").addEventListener("click", (e) => { const b = e.target.closest("[data-q]"); if (!b) return; qty[b.dataset.q] = Math.max(0, Math.min(20, qty[b.dataset.q] + +b.dataset.d)); renderCo(); });
  $("[data-apply]").addEventListener("click", () => {
    const code = form.promo.value.trim().toUpperCase();
    if (code === "CREW20") promo = true;
    else { promo = false; $("[data-promo-msg]").textContent = code ? `“${code}” isn't a valid code.` : "Enter a promo code."; $("[data-promo-msg]").className = "promo-msg bad"; }
    renderCo();
  });
  $$("[data-buy]").forEach((b) => b.addEventListener("click", () => {
    Object.keys(qty).forEach((k) => { qty[k] = 0; }); qty[b.dataset.buy] = 1; promo = false;
    form.reset(); form.hidden = false; $(".done", co).hidden = true; $("[data-promo-msg]").textContent = ""; $("[data-err]", co).textContent = "";
    renderCo(); co.showModal();
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { count, total } = renderCo();
    const ok = form.email.checkValidity();
    form.email.toggleAttribute("aria-invalid", !ok);
    $("[data-err]", co).textContent = !count ? "Add at least one ticket." : ok ? "" : "Enter a valid email for your tickets.";
    if (!count || !ok) return;
    $("[data-done]", co).textContent = `${count} ticket${count === 1 ? "" : "s"} · $${total.toFixed(2)}${qty.day ? ` · day pass for ${form.day.value}` : ""}. Mobile tickets would be emailed to ${form.email.value}. Order SB-${Math.floor(10000 + Math.random() * 90000)}. (Demo — no payment taken.)`;
    form.hidden = true; $(".done", co).hidden = false;
  });
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  co.addEventListener("click", (e) => { if (e.target === co) co.close(); });

  /* PDF map */
  $("[data-pdf]").addEventListener("click", () => {
    const lines = [["F2", 22, "STREETBITE FEST 2026 - FESTIVAL MAP"], ["F1", 11, "Jul 25-27 - Tom McCall Waterfront Park, Portland OR"], ["", 0, ""],
      ...zones.map(([z, w, c]) => ["F1", 12, `ZONE ${z} (${w}): ${c} - ${trucks.filter((t) => t[3] === z).map((t) => t[0]).join(", ")}`]), ["", 0, ""],
      ...marks.map(([n, , , , d]) => ["F1", 12, `${n}: ${d}`]), ["", 0, ""], ...gates.map(([g]) => ["F1", 12, g]), ["F1", 12, "Restrooms: Zones A & C. First Aid: by Main Stage. ATMs: Zones A & C."], ["", 0, ""], ["F1", 9, "Beer & Cocktail Garden is 21+ with valid ID. Kids under 10 free with an adult ticket."]];
    const esc = (s) => s.replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
    let y = 750, st = "BT\n"; for (const [f, sz, t] of lines) { if (!f) { y -= 10; continue; } st += `/${f} ${sz} Tf 1 0 0 1 50 ${y} Tm (${esc(t)}) Tj\n`; y -= sz + 9; } st += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>", `<< /Length ${st.length} >>\nstream\n${st}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    let pdf = "%PDF-1.4\n"; const off = []; objs.forEach((o, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = pdf.length; pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "streetbite-fest-2026-map.pdf" }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast("Festival map PDF downloaded");
  });

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const i = $("#news-email"), ok = i.checkValidity();
    i.setAttribute("aria-invalid", String(!ok));
    $("[data-news-msg]").textContent = ok ? "You're on the list! Watch for secret menu drops. (Demo — nothing was sent.)" : "Please enter a valid email address.";
    if (ok) e.target.reset();
  });

  /* Sticky mobile bar hides over tickets */
  const bar = $(".sticky-bar");
  if ("IntersectionObserver" in window) new IntersectionObserver((en) => en.forEach((x) => bar.classList.toggle("away", x.isIntersecting)), { threshold: 0.2 }).observe($("#tickets"));
})();
