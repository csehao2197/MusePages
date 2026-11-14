(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = window.Art;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } } };

  // gear flat-lay (camera, 3 lenses, filters, tripod) for the kit story
  const KIT = `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flat lay of a camera body, three lenses, filters and a tripod on a dark surface"><rect width="1600" height="1000" fill="#262220"/><rect x="560" y="320" width="420" height="260" rx="34" fill="#0C0A09"/><circle cx="800" cy="450" r="110" fill="#1C1917"/><circle cx="800" cy="450" r="78" fill="#111"/><circle cx="800" cy="450" r="40" fill="#1E3A8A" opacity=".45"/>${[[260, 260, 90], [270, 560, 70], [280, 800, 60]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#0C0A09" stroke="#3F3F46" stroke-width="10"/><circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#1E293B"/><circle cx="${x - r * 0.2}" cy="${y - r * 0.2}" r="${r * 0.12}" fill="#fff" opacity=".35"/>`).join("")}<rect x="1100" y="200" width="220" height="280" rx="10" fill="#1F2937" opacity=".85"/><rect x="1140" y="240" width="220" height="280" rx="10" fill="#334155" opacity=".6"/><circle cx="1240" cy="720" r="110" fill="#0F172A" stroke="#44403C" stroke-width="14"/><path d="M600 820 1500 900M600 840 1480 960M610 860 1440 990" stroke="#57534E" stroke-width="22" stroke-linecap="round"/><rect x="560" y="800" width="80" height="80" rx="10" fill="#1C1917"/></svg>`;
  const scene = (k) => (k === "kit" ? KIT : A.scene(k));

  // lazy paint
  const paint = (el) => { if (!el.dataset.painted) { el.innerHTML = scene(el.dataset.scene); el.dataset.painted = "1"; } };
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { paint(e.target); io.unobserve(e.target); } }), { rootMargin: "400px" }) : null;
  const lazy = (root = document) => $$("[data-scene]:not([data-painted])", root).forEach((el) => (el.hasAttribute("data-eager") || !io ? paint(el) : io.observe(el)));

  /* ---------- stories ---------- */
  const STORIES = {
    "tre-cime": { t: "First Light on the Tre Cime: A Dolomites Morning", cat: "Photo Essay", img: "dolomites", meta: "March 8, 2026 · 12 photos · 8 min read", dest: "Italian Dolomites", body: ["The trail to Rifugio Locatelli is easy in daylight and strange in the dark — headlamp beams bouncing off scree, the towers only an absence of stars above you.", "At 6:12 the first light touched the north faces. The cloud layer below the col turned pink, then gold, then burned away entirely in twenty minutes. I shot 340 frames; twelve made it into this essay."] },
    diamond: { t: "Iceland's Diamond Beach at Midnight Sun", cat: "Photo Essay", img: "diamond", meta: "Jun 2025 · 18 photos", dest: "Iceland", body: ["In June the sun barely sets on Breiðamerkursandur, and the ice that washes ashore glows for hours.", "I used long exposures between waves to smooth the surf around the ice — and a lot of patience waiting for the right chunk to land in the right spot."] },
    kit: { t: "The Gear I Actually Use: 2026 Kit Breakdown", cat: "Gear Review", img: "kit", meta: "Feb 2026 · 14 min read", dest: null, body: ["One body, three lenses, a filter kit and a tripod that fits in a carry-on — that's the whole system.", "Here's what stayed in the bag after a year of trips, what I sold, and the one accessory I'd buy first."] },
    patagonia: { t: "Patagonia in Autumn: Torres del Paine", cat: "Destination Guide", img: "patagonia", meta: "Apr 2025", dest: "Patagonia", body: ["Autumn turns the lenga forests copper and empties the trails. Where to stay, when to shoot the towers, and how to handle the wind."] },
    lightroom: { t: "How I Edit Moody Landscapes in Lightroom", cat: "Behind the Scenes", img: "lightroom", meta: "Jan 2026", dest: null, body: ["Mood comes from restraint: lower clarity, lifted blacks, and color grading that stays believable. A walkthrough of my five-step process."] },
    highlands: { t: "Scottish Highlands: Rain, Fog, and Perfect Light", cat: "Photo Essay", img: "highlands", meta: "Nov 2025 · 22 photos", dest: "Scottish Highlands", body: ["Ten days of forecasted rain turned into the best light I've seen in years. Bad weather is where the atmosphere lives."] }
  };
  const RECENT = [["diamond", "l1"], ["kit", "l2"], ["patagonia", "s1"], ["lightroom", "s2"], ["highlands", "s3"]];
  $("[data-recent]").innerHTML = RECENT.map(([k, c]) => { const s = STORIES[k]; return `<a class="post ${c}" href="#story" data-story="${k}"><span class="img" data-scene="${s.img}"></span><span class="txt"><span class="cat">${s.cat}</span><h3>${esc(s.t)}</h3><small>${s.meta}</small></span></a>`; }).join("");
  function openStory(k) {
    const s = STORIES[k]; if (!s) return;
    openDlg(`<div class="d-img" data-scene="${s.img}" data-eager></div><div class="d-in"><span class="cat" style="color:#0A0A0A">${s.cat}</span><h3>${esc(s.t)}</h3><p class="d-meta">${s.meta}</p>${s.body.map((p) => `<p>${p}</p>`).join("")}<p class="note">Preview excerpt — the full essay is part of the Aperture Journal archive.</p></div>`);
  }
  document.addEventListener("click", (e) => { const a = e.target.closest("[data-story]"); if (!a) return; e.preventDefault(); closeSearch(); openStory(a.dataset.story); });

  /* ---------- destinations ---------- */
  const DESTS = [
    ["Iceland", 8, "iceland", "#134E4A"], ["Italian Dolomites", 5, "hut", "#B45309"], ["Patagonia", 4, "glacier", "#1E40AF"],
    ["Scottish Highlands", 6, "glen", "#166534"], ["Norway", 7, "lofoten", "#1E3A8A"], ["New Zealand", 3, "milford", "#0F766E"]
  ];
  $("[data-dests]").innerHTML = DESTS.map(([n, c, img, t], i) => `<button class="dest" type="button" data-dest="${i}" aria-label="${n}, ${c} stories"><span class="img" data-scene="${img}"></span><span class="tint" style="--t:${t}"></span><span class="txt"><h3>${n}</h3><small>${c} stories</small></span></button>`).join("");
  const track = $("[data-dests]");
  const stepW = () => track.firstElementChild.getBoundingClientRect().width + 20;
  $("[data-dest-prev]").addEventListener("click", () => track.scrollBy({ left: -stepW(), behavior: "smooth" }));
  $("[data-dest-next]").addEventListener("click", () => track.scrollBy({ left: stepW(), behavior: "smooth" }));
  track.addEventListener("click", (e) => {
    const b = e.target.closest("[data-dest]"); if (!b) return;
    const [n, c, img] = DESTS[b.dataset.dest];
    const related = Object.entries(STORIES).filter(([, s]) => s.dest === n);
    const titles = related.map(([k, s]) => `<li><button class="text-link" type="button" data-story="${k}" style="text-transform:none;letter-spacing:0;font-size:16px">${esc(s.t)} ${icon("i-arrow")}</button></li>`).join("");
    openDlg(`<div class="d-img" data-scene="${img}" data-eager></div><div class="d-in"><span class="cat" style="color:#0A0A0A">Destination</span><h3>${n}</h3><p class="d-meta">${c} stories · location guides, photo essays and shooting notes</p>${titles ? `<ul style="list-style:none;padding:0">${titles}</ul>` : ""}<p class="note">${c - related.length} more ${n} stories live in the full archive.</p></div>`);
  });

  /* ---------- mosaic + lightbox ---------- */
  const WORK = [
    ["kirkjufell", "Milky Way over Kirkjufell, Iceland", "w2", { cam: "Sony A7R V", lens: "14mm f/1.8 GM", set: "f/1.8 · 15s · ISO 3200", loc: "Grundarfjörður, Iceland" }],
    ["wanaka", "Lone tree at Wanaka, New Zealand", "t2", { cam: "Sony A7R V", lens: "70-200mm f/4", set: "f/8 · 1/125s · ISO 100", loc: "Lake Wanaka, NZ" }],
    ["glencoe", "Foggy morning in Glencoe, Scotland", "", { cam: "Sony A7R V", lens: "24-70mm f/2.8 GM II", set: "f/9 · 1/60s · ISO 200", loc: "Glencoe, Scotland" }],
    ["seceda", "Sunrise at Seceda ridgeline, Dolomites", "w2", { cam: "Sony A7R V", lens: "16-35mm f/2.8 GM", set: "f/11 · 1/30s · ISO 100", loc: "Seceda, Val Gardena" }],
    ["reine", "Aurora reflection, Reine, Norway", "", { cam: "Sony A7R V", lens: "14mm f/1.8 GM", set: "f/2 · 6s · ISO 1600", loc: "Reine, Lofoten" }],
    ["fitzroy", "Fitz Roy alpenglow, Patagonia", "t2", { cam: "Sony A7R V", lens: "70-200mm f/4", set: "f/8 · 1/200s · ISO 100", loc: "El Chaltén, Argentina" }],
    ["faroe", "Faroe Islands sea stacks at sunset", "w2", { cam: "Sony A7R V", lens: "24-70mm f/2.8 GM II", set: "f/11 · 0.8s · ISO 64 · ND", loc: "Vágar, Faroe Islands" }],
    ["horses", "Icelandic wild horses in snowstorm", "", { cam: "Sony A7R V", lens: "100-400mm GM", set: "f/5.6 · 1/1000s · ISO 800", loc: "Snæfellsnes, Iceland" }],
    ["braies", "Lago di Braies turquoise waters", "", { cam: "Sony A7R V", lens: "16-35mm f/2.8 GM", set: "f/10 · 1/100s · ISO 100 · CPL", loc: "Lago di Braies, South Tyrol" }]
  ];
  $("[data-mosaic]").innerHTML = WORK.map(([k, t, c], i) => `<li class="${c}"><button type="button" data-work="${i}" aria-label="View ${esc(t)}"><span data-scene="${k}" style="display:block;width:100%;height:100%"></span><span class="cap">${esc(t)}</span></button></li>`).join("");
  const lb = $("[data-lb]"); let cur = 0, lbReturn = null;
  function showWork(i) {
    cur = (i + WORK.length) % WORK.length;
    const [k, t, , x] = WORK[cur];
    $("[data-lb-img]").innerHTML = A.scene(k);
    $("[data-lb-info]").innerHTML = `<h3>${esc(t)}</h3><dl><div><dt>Camera</dt><dd>${x.cam}</dd></div><div><dt>Lens</dt><dd>${x.lens}</dd></div><div><dt>Settings</dt><dd>${x.set}</dd></div><div><dt>Location</dt><dd>${x.loc}</dd></div><div><dt>Frame</dt><dd>${cur + 1} / ${WORK.length}</dd></div></dl>`;
  }
  $("[data-mosaic]").addEventListener("click", (e) => { const b = e.target.closest("[data-work]"); if (!b) return; lbReturn = b; showWork(Number(b.dataset.work)); lb.showModal(); $("[data-lb-close]").focus(); });
  $("[data-lb-close]").addEventListener("click", () => lb.close());
  $("[data-lb-prev]").addEventListener("click", () => showWork(cur - 1));
  $("[data-lb-next]").addEventListener("click", () => showWork(cur + 1));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") showWork(cur - 1); if (e.key === "ArrowRight") showWork(cur + 1); });
  lb.addEventListener("close", () => { if (lbReturn) lbReturn.focus(); });
  let tx = null;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) showWork(cur + (dx < 0 ? 1 : -1)); tx = null; });

  /* ---------- gear ---------- */
  const GEAR = [
    ["camera", "Sony A7R V Review: 14 Months Later", "9.2", "Still the best landscape body I've used. The autofocus improvement is real.", ["61MP files with room to crop", "Subject-detection AF that actually finds eyes and animals", "Battery life is fine in cold if you carry two", "Menus are better, still not great"]],
    ["tripod", "Peak Design Travel Tripod", "8.5", "Compact brilliance with one compromise — stiffness in wind.", ["Packs to the size of a water bottle", "Fast leg locks, smart phone mount", "Center column flex in strong wind", "Best for travelers who hike far"]],
    ["filters", "NiSi V7 Filter System", "9.0", "My go-to ND and polarizer kit. The magnetic system is a game-changer for quick setups.", ["Neutral color across ND strengths", "Magnetic CPL swaps in seconds", "Holder is bulky on ultra-wides", "Worth it if you shoot water or skies"]]
  ];
  $("[data-gear]").innerHTML = GEAR.map(([k, t, s, v], i) => `<article class="g-card"><div class="g-img">${A.gear(k)}<span class="score" aria-label="Rating ${s} out of 10">${s}<small>/10</small></span></div><h3>${esc(t)}</h3><p>“${esc(v)}”</p><button class="text-link" type="button" data-review="${i}">Read Review ${icon("i-arrow")}</button></article>`).join("");
  $("[data-gear]").addEventListener("click", (e) => { const b = e.target.closest("[data-review]"); if (!b) return; const [k, t, s, v, pts] = GEAR[b.dataset.review]; openDlg(`<div class="d-img" style="aspect-ratio:4/3">${A.gear(k)}</div><div class="d-in"><span class="cat" style="color:#0A0A0A">Gear Review · ${s}/10</span><h3>${esc(t)}</h3><p><em>${esc(v)}</em></p><ul>${pts.map((p) => `<li>${p}</li>`).join("")}</ul><p class="note">Independent review; no sponsorship. Demo excerpt.</p></div>`); });

  /* ---------- before / after ---------- */
  const ba = $("[data-ba]"), range = $("[data-ba-range]");
  const setPos = (v) => { ba.style.setProperty("--pos", `${v}%`); range.value = v; range.setAttribute("aria-valuetext", `${Math.round(v)}% RAW shown`); };
  range.addEventListener("input", () => { setPos(Number(range.value)); $$("[data-step]").forEach((b) => b.setAttribute("aria-pressed", "false")); });
  setPos(50);
  $("[data-steps]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]"); if (!b) return;
    const n = Number(b.dataset.step);
    $$("[data-step]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    setPos(100 - n * 20);
  });

  /* ---------- portrait / about ---------- */
  $("[data-portrait]").innerHTML = A.portrait();
  $("[data-more-elena]").addEventListener("click", () => openDlg(`<div class="d-in"><span class="cat" style="color:#0A0A0A">About</span><h3>Elena Voss</h3><p>Elena started photographing on a borrowed film camera during a summer in the Alps and never stopped. She now spends four to five months a year on the road, mostly in cold, wet and windy places.</p><p>She teaches small-group workshops in Iceland and the Dolomites and licenses her work to publishers and outdoor brands.</p><p class="note">Illustrative biography for this demo site.</p></div>`));
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-portfolio]"); if (!b) return; e.preventDefault(); openDlg(`<div class="d-in"><h3>Portfolio</h3><p class="d-meta">Selected frames, 2020–2026</p><div class="mini-grid">${["dolomites", "diamond", "patagonia", "highlands", "kirkjufell", "reine", "faroe", "braies", "seceda"].map((k) => `<div data-scene="${k}" data-eager></div>`).join("")}</div><p class="note">The full portfolio has 300+ images grouped by region.</p></div>`); });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-more-edits]"); if (!b) return; e.preventDefault(); openDlg(`<div class="d-in"><h3>Editing Breakdowns</h3><ul style="list-style:none;padding:0">${["Editing a Dolomites Sunrise — Step by Step", "Blending Exposures for Night Skies", "Color Grading Fog Without Muddy Shadows", "Sharpening for Print vs. Screen"].map((t, i) => `<li style="padding:12px 0;border-bottom:1px solid #E7E5E4">${i === 0 ? `<button class="text-link" type="button" data-story="lightroom" style="text-transform:none;letter-spacing:0;font-size:16px">${t} ${icon("i-arrow")}</button>` : t}</li>`).join("")}</ul></div>`); });

  /* ---------- newsletter ---------- */
  $("[data-sub]").addEventListener("submit", (e) => {
    e.preventDefault(); const v = e.target.email.value.trim(), m = $("[data-sub-msg]");
    if (!validEmail(v)) { m.className = "nl-msg bad"; m.textContent = "Please enter a valid email address."; return; }
    m.className = "nl-msg ok"; m.textContent = `Welcome aboard — next week's story goes to ${v}. (Demo — nothing is sent.)`; e.target.reset();
  });
  $("[data-issue]").addEventListener("click", () => openDlg(`<div class="d-img" data-scene="faroe" data-eager></div><div class="d-in"><span class="cat" style="color:#0A0A0A">Newsletter</span><h3>Why I Sold My Drone (And Why I Might Buy Another)</h3><p>Drones opened up compositions I'd never seen — and closed off half the places I wanted to fly. Permits, crowds and the noise in quiet valleys made me reconsider.</p><p class="note">Preview of the latest newsletter issue.</p></div>`));

  /* ---------- prints ---------- */
  const PRINTS = [["dolomites", "Tre Cime Sunrise", '24x36"', 189, "land"], ["diamond", "Diamond Beach Ice", '20x30"', 149, "land"], ["milford", "Milford Sound Mirror", '30x20"', 169, "port"], ["reine", "Aurora Over Reine", '24x36"', 199, "land", true]];
  $("[data-prints]").innerHTML = PRINTS.map(([k, t, s, p, o, best], i) => `<button class="print" type="button" data-print="${i}"><span class="wall">${best ? '<span class="best">Best Seller</span>' : ""}<span class="frame ${o}"><span style="display:block;width:100%;height:100%" data-scene="${k}"></span></span></span><h3>${t}</h3><small>${s} · From $${p}</small></button>`).join("");
  function printDlg(i) {
    const [k, t, s, p] = PRINTS[i];
    const sizes = [["12x18\"", 0.55], ["20x30\"", 0.8], [s, 1], ["40x60\"", 1.9]];
    openDlg(`<div class="d-img" data-scene="${k}" data-eager></div><div class="d-in"><span class="cat" style="color:#0A0A0A">Print</span><h3>${t}</h3><form class="form" data-pf><label>Size<select name="size">${sizes.map(([n, m]) => `<option value="${m}"${m === 1 ? " selected" : ""}>${n}</option>`).join("")}</select></label><label>Finish<select name="frame"><option value="0">Unframed giclée</option><option value="90">Black oak frame (+$90)</option><option value="110">Natural oak frame (+$110)</option></select></label><p style="margin:4px 0;font-size:20px" data-price></p><button class="btn-dark" type="submit">Add to cart</button><p class="note">Museum-quality giclée on Hahnemühle paper. Demo shop — no checkout.</p></form></div>`);
    const f = $("[data-pf]", body);
    const upd = () => { $("[data-price]", body).textContent = `$${Math.round(p * Number(f.size.value) + Number(f.frame.value))}`; };
    f.addEventListener("change", upd); upd();
    f.addEventListener("submit", (e) => { e.preventDefault(); dlg.close(); toast(`${t} (${f.size.selectedOptions[0].text}) added to cart — demo only.`); });
  }
  $("[data-prints]").addEventListener("click", (e) => { const b = e.target.closest("[data-print]"); if (b) printDlg(Number(b.dataset.print)); });
  $("[data-all-prints]").addEventListener("click", () => openDlg(`<div class="d-in"><h3>All Prints</h3><div class="mini-grid">${["dolomites", "diamond", "milford", "reine", "seceda", "kirkjufell", "braies", "faroe", "wanaka"].map((k) => `<div data-scene="${k}" data-eager></div>`).join("")}</div><p class="note">Limited editions of 50 per image. Demo shop.</p></div>`));

  /* ---------- cookies / misc ---------- */
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-cookies]");
    if (c) {
      const pref = store.get("aj-cookies", { analytics: false });
      openDlg(`<div class="d-in"><h3>Cookie Preferences</h3><p>This demo site sets no tracking cookies. Your choice is stored only in this browser.</p><label class="toggle">Essential (always on)<input type="checkbox" checked disabled></label><label class="toggle">Anonymous analytics<input type="checkbox" data-ck ${pref.analytics ? "checked" : ""}></label><p><button class="btn-dark" type="button" data-ck-save>Save preferences</button></p></div>`);
      $("[data-ck-save]", body).addEventListener("click", () => { store.set("aj-cookies", { analytics: $("[data-ck]", body).checked }); dlg.close(); toast("Preferences saved."); });
      return;
    }
    const s = e.target.closest("[data-soon]");
    if (s) { e.preventDefault(); toast(`${s.dataset.soon} — available on request.`); }
  });

  /* ---------- search ---------- */
  const sbox = $("[data-search]"), sin = $("[data-search-in]"), sres = $("[data-search-res]");
  const INDEX = Object.entries(STORIES).map(([k, s]) => ({ k, t: s.t, sub: s.cat, hay: `${s.t} ${s.cat} ${s.dest || ""} ${s.body.join(" ")}` }));
  let sReturn = null;
  function openSearch() { closeMenu(); sReturn = document.activeElement; sbox.hidden = false; sin.value = ""; renderS(); sin.focus(); }
  function closeSearch() { if (sbox.hidden) return; sbox.hidden = true; if (sReturn && sReturn.isConnected) sReturn.focus(); }
  function renderS() {
    const q = sin.value.trim().toLowerCase();
    const list = q ? INDEX.filter((x) => x.hay.toLowerCase().includes(q)) : INDEX;
    sres.innerHTML = list.length ? list.map((x) => `<li><button type="button" data-story="${x.k}"><b>${esc(x.t)}</b><small>${x.sub}</small></button></li>`).join("") : `<li><p>No stories match “${esc(sin.value.trim())}”.</p></li>`;
  }
  $$("[data-search-open]").forEach((b) => b.addEventListener("click", openSearch));
  $("[data-search-close]").addEventListener("click", closeSearch);
  sin.addEventListener("input", renderS);

  /* ---------- menu ---------- */
  const menu = $("[data-menu]"), burger = $("[data-burger]");
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; burger.focus(); }
  burger.addEventListener("click", () => { menu.hidden = false; burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("a", menu).focus(); });
  $("[data-menu-close]").addEventListener("click", closeMenu);
  $$("a", menu).forEach((a) => a.addEventListener("click", () => { menu.hidden = true; burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeSearch(); } });

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; lazy(body); if (!dlg.open) dlg.showModal(); dlg.scrollTop = 0; const f = $("select, input:not([disabled])", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }

  /* ---------- nav state ---------- */
  const nav = $("[data-nav]"), hero = $(".hero");
  const onScroll = () => nav.classList.toggle("solid", scrollY > 60 || hero.getBoundingClientRect().bottom < 80);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  lazy();
})();
