(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const wrapDeg = (d) => ((d % 360) + 360) % 360;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const html = document.documentElement;
  const osReduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  const store = { get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } } };
  const reduced = () => html.classList.contains("rm");
  if (osReduce) html.classList.add("rm");

  // ======================= Data =======================
  const ROOMS = [
    { id: "living", name: "Living Room", level: "main", rect: [22, 16, 24, 20], type: "living", ceil: 10, dims: "24' × 20' · 10' ceilings", note: "Floors refinished 2024",
      walls: [[["shelves", 0.14, { w: 0.2 }], ["fireplace", 0.5], ["shelves", 0.86, { w: 0.2 }]], [["plant", 0.12], ["window", 0.5, { w: 0.62 }], ["lamp", 0.9]], [["art", 0.5, { y: 290 }], ["sofa", 0.5, { w: 0.55 }], ["plant", 0.9]], [["door", 0.3], ["door", 0.78], ["vent", 0.55]]],
      hs: [["info", 2, 0.2, 0.86, "Hardwood floors throughout", "Wide-plank white oak, refinished in 2024. Continues through the main level, stairs and upstairs hall."],
        ["info", 0, 0.14, 0.42, "Custom built-in shelving", "Floor-to-ceiling maple built-ins with adjustable shelves and integrated LED lighting."],
        ["info", 3, 0.55, 0.23, "New HVAC system (2023)", "High-efficiency heat pump with two-zone climate control, installed 2023. Transferable 10-year warranty."],
        ["video", 0, 0.5, 0.62, "Fireplace ambience", "A short clip of the gas fireplace on a winter evening.", "fire"],
        ["nav", 3, 0.3, 0.5, "Kitchen", "", "kitchen"], ["nav", 3, 0.78, 0.5, "Office", "", "office"]],
      features: ["Gas fireplace with stone surround", "Custom built-in shelving", "Hardwood floors throughout", "Picture window onto the backyard", "10' ceilings"],
      desc: ["a gas fireplace with a stone surround and a wall-mounted TV, flanked by built-in bookshelves", "a wide picture window looking onto the backyard trees, with a floor lamp and a plant", "a grey sofa with throw pillows, a framed abstract print and a rug with a coffee table", "two doorways: to the kitchen on the left and the office on the right"],
      narration: "Welcome to 2148 Larkspur Lane. The living room centers on a gas fireplace framed by custom built-in shelving, with wide-plank hardwood floors and ten-foot ceilings.",
      fit: [["South wall (sofa wall)", 24, 20], ["East wall (window wall)", 20, 24], ["North wall (between built-ins)", 9, 20]] },
    { id: "office", name: "Office", level: "main", rect: [46, 16, 14, 14], type: "work", ceil: 9, dims: "14' × 14'", note: "",
      walls: [[["window", 0.5, { w: 0.46 }], ["desk", 0.5]], [["shelves", 0.3, { w: 0.28 }], ["shelves", 0.72, { w: 0.28 }]], [["door", 0.5]], [["art", 0.4], ["plant", 0.8]]],
      hs: [["info", 0, 0.5, 0.62, "Built-in desk & fiber internet", "Wired for 1 Gbps fiber with a Cat6 drop at the desk."],
        ["info", 1, 0.5, 0.36, "Custom built-in shelving", "Matching maple built-ins with a library-ladder rail."],
        ["link", 0, 0.86, 0.4, "Check internet providers", "See broadband availability for this area on the FCC National Broadband Map.", "https://broadbandmap.fcc.gov/"],
        ["nav", 2, 0.5, 0.5, "Living Room", "", "living"]],
      features: ["French doors for privacy", "Built-in desk and shelving", "1 Gbps fiber ready", "North light — no screen glare"],
      desc: ["a desk with a monitor beneath a window", "two walls of built-in shelving filled with books", "French doors back to the living room", "a framed print and a tall plant"],
      narration: "Off the living room, the office has built-in shelving, a desk under soft north light and fiber internet for work-from-home days.",
      fit: [["West wall", 14, 14], ["North wall (under window)", 14, 14]] },
    { id: "kitchen", name: "Kitchen", level: "main", rect: [22, 0, 18, 16], type: "wet", ceil: 9, dims: "18' × 16'", note: "Recently renovated (2024)",
      walls: [[["cabinets", 0.5, { w: 0.92, range: 0.5 }]], [["fridge", 0.2], ["window", 0.64, { w: 0.42 }]], [["island", 0.5, { w: 0.62 }], ["door", 0.9]], [["door", 0.5], ["thermostat", 0.82]]],
      hs: [["info", 0, 0.25, 0.52, "Quartz counters & 2024 renovation", "Calacatta-look quartz, soft-close shaker cabinets and a ceramic subway backsplash — renovated in 2024."],
        ["info", 3, 0.82, 0.44, "Smart thermostat", "Controls the new 2023 heat-pump system in two zones."],
        ["link", 1, 0.2, 0.36, "Appliance package", "Energy-efficient stainless appliances (2024). Learn how ENERGY STAR appliances cut running costs.", "https://www.energystar.gov/products"],
        ["video", 2, 0.5, 0.72, "Chef's kitchen walkthrough", "Walk the work triangle from range to island.", "kitchen"],
        ["nav", 3, 0.5, 0.5, "Living Room", "", "living"], ["nav", 2, 0.9, 0.5, "Dining Room", "", "dining"]],
      features: ["Quartz counters, island seats four", "Gas range with vented hood", "Walk-in pantry", "Brass pendant lighting", "Renovated 2024"],
      desc: ["white shaker cabinets with quartz counters, a subway-tile backsplash and a gas range under a steel hood, lit by brass pendants", "a stainless refrigerator and a window above the sink", "a navy island with four stools and a doorway to the dining room", "the doorway back to the living room and a smart thermostat"],
      narration: "The kitchen was renovated in 2024 with quartz counters, a navy island that seats four and a vented gas range.",
      fit: [["West wall", 16, 18]] },
    { id: "dining", name: "Dining Room", level: "main", rect: [40, 0, 20, 16], type: "living", ceil: 10, dims: "20' × 16' · coffered 10' ceiling", note: "",
      walls: [[["window", 0.5, { w: 0.72 }], ["table", 0.5, { w: 0.62 }]], [["art", 0.5]], [["door", 0.22], ["stairs", 0.72]], [["buffet", 0.5]]],
      hs: [["info", 0, 0.5, 0.09, "Coffered 10' ceiling", "Painted coffers with a dimmable chandelier; the table seats ten."],
        ["nav", 2, 0.22, 0.5, "Kitchen", "", "kitchen"], ["nav", 2, 0.72, 0.45, "Upstairs: Primary Suite", "", "primary"]],
      features: ["Seats ten", "Coffered ceiling", "Picture window to the garden", "Built-in buffet"],
      desc: ["a long walnut table with upholstered chairs under a chandelier, in front of a broad picture window", "a large framed abstract print", "the doorway to the kitchen and the staircase up to the bedrooms", "a walnut buffet with a plant"],
      narration: "The dining room seats ten beneath a coffered ceiling, with a picture window onto the garden and stairs up to the bedrooms.",
      fit: [["East wall", 16, 20], ["West wall (instead of buffet)", 16, 20]] },
    { id: "primary", name: "Primary Bedroom", level: "upper", rect: [0, 0, 24, 18], type: "sleeping", ceil: 12, vaulted: true, dims: "24' × 18' · vaulted 12' ceiling", note: "New carpet and paint (2024)",
      walls: [[["art", 0.5, { y: 230 }], ["bed", 0.5]], [["window", 0.5, { w: 0.7 }]], [["door", 0.25], ["closet", 0.7]], [["door", 0.5], ["plant", 0.85]]],
      hs: [["info", 0, 0.5, 0.08, "Vaulted 12' ceiling", "Cathedral ceiling with an exposed beam and a quiet ceiling fan."],
        ["info", 2, 0.7, 0.5, "Walk-in closet 8' × 10'", "Custom closet system with island drawers and a cedar-lined shoe wall."],
        ["video", 1, 0.5, 0.45, "Morning light time-lapse", "Sunrise through the east-facing windows.", "light"],
        ["nav", 2, 0.25, 0.5, "Primary Bath", "", "pbath"], ["nav", 3, 0.5, 0.5, "Downstairs: Dining Room", "", "dining"]],
      features: ["Vaulted 12' ceiling", "East-facing windows", "Walk-in closet 8' × 10'", "Private en-suite bath"],
      desc: ["a king bed with linen bedding and two nightstands with lamps, beneath a framed print", "a wide window with garden views", "the doorway to the primary bath and the walk-in closet's double doors", "the doorway to the stairs and a plant"],
      narration: "Upstairs, the primary suite has a vaulted twelve-foot ceiling, east-facing windows and an eight-by-ten walk-in closet.",
      fit: [["East wall (under window)", 18, 24], ["West wall", 18, 24]] },
    { id: "pbath", name: "Primary Bath", level: "upper", rect: [0, 18, 14, 12], type: "wet", ceil: 9, dims: "14' × 12'", note: "Recently renovated (2024)",
      walls: [[["vanity", 0.5, { w: 0.72 }]], [["shower", 0.5]], [["door", 0.5]], [["window", 0.5, { w: 0.36 }], ["tub", 0.5]]],
      hs: [["info", 2, 0.25, 0.86, "Heated tile floors", "Radiant in-floor heating on a programmable timer."],
        ["info", 0, 0.5, 0.6, "Double vanity", "Quartz double vanity with arched mirrors and drawer organizers."],
        ["nav", 2, 0.5, 0.5, "Primary Bedroom", "", "primary"]],
      features: ["Freestanding soaking tub", "Frameless glass rain shower", "Heated tile floors", "Double vanity"],
      desc: ["a walnut double vanity with two arched mirrors", "a glass-enclosed tiled shower with a rain head", "the doorway back to the bedroom", "a freestanding soaking tub beneath a window"],
      narration: "The spa-like primary bath features a freestanding soaking tub, a frameless rain shower and heated tile floors.",
      fit: [] },
  ];
  const byId = Object.fromEntries(ROOMS.map((r) => [r.id, r]));
  const OTHER = { main: [["Garage", 0, 0, 22, 22, "util"], ["Laundry / Mud", 0, 22, 22, 14, "util"], ["Powder", 46, 30, 14, 6, "wet"]],
    upper: [["Bedroom 2", 24, 0, 12, 14, "sleeping"], ["Bedroom 3", 36, 0, 12, 14, "sleeping"], ["Bedroom 4", 48, 0, 12, 14, "sleeping"], ["Bath 2", 24, 14, 12, 10, "wet"], ["Loft", 36, 14, 24, 22, "living"], ["Hall", 24, 24, 12, 12, "util"], ["Closet", 14, 18, 10, 12, "util"], ["Linen", 0, 30, 24, 6, "util"]] };
  const TYPES = { living: ["Living & dining", "#F2B544"], wet: ["Kitchen & baths", "#38BDF8"], sleeping: ["Bedrooms", "#A78BFA"], work: ["Work", "#34D399"], util: ["Utility & storage", "#6B7280"] };
  const DIRS = ["north", "east", "south", "west"];
  const hsYaw = (w, x) => wrapDeg(w * 90 + (x - 0.5) * 90);

  // ======================= Panorama images =======================
  const urlCache = new Map();
  const toUrl = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const svgCache = new Map();
  function panoSvg(id, variant = "base") { const k = `${id}:${variant}`; if (!svgCache.has(k)) svgCache.set(k, Art.pano(byId[id], variant)); return svgCache.get(k); }
  function panoUrl(id, variant = "base") { const k = `${id}:${variant}`; if (!urlCache.has(k)) urlCache.set(k, toUrl(panoSvg(id, variant))); return urlCache.get(k); }
  function cropUrl(id, wall, variant = "base") { return toUrl(Art.crop(panoSvg(id, variant), wall, "").replace(' role="img" aria-label=""', "")); }

  // ======================= Viewer =======================
  class Viewer {
    constructor(el, opts = {}) {
      this.el = el; this.opts = opts; this.yaw = 0; this.pitch = 0; this.zoom = 1; this.hot = [];
      this.track = document.createElement("div"); this.track.className = "vw-track";
      this.imgs = [0, 1, 2].map(() => { const i = document.createElement("img"); i.alt = ""; i.draggable = false; i.decoding = "async"; this.track.appendChild(i); return i; });
      this.layer = document.createElement("div"); this.layer.className = "vw-hot";
      el.append(this.track, this.layer);
      this.ptrs = new Map();
      if (opts.interactive !== false) this.bind();
      new ResizeObserver(() => this.render()).observe(el);
    }
    setImage(url) { this.imgs.forEach((i) => { i.src = url; }); this.render(); }
    geom() {
      const vw = this.el.clientWidth || 1, vh = this.el.clientHeight || 1, base = Math.max(vh * 1.15, vw / 2.6);
      const minZ = Math.max(vh / base, (vw * 1.05) / (4 * base)), maxZ = 3;
      this.zoom = clamp(this.zoom, minZ, maxZ);
      const H = base * this.zoom, W = H * 4; return { vw, vh, H, W, minZ, maxZ };
    }
    render() {
      const g = this.geom(); this.g = g;
      this.pitch = clamp(this.pitch, -1, 1);
      const px = (wrapDeg(this.yaw + 45) / 360) * g.W, left = g.vw / 2 - (g.W + px), top = (g.vh - g.H) / 2 + this.pitch * (g.H - g.vh) / 2;
      this.top = top;
      this.imgs.forEach((i) => { i.style.width = `${g.W}px`; i.style.height = `${g.H}px`; });
      this.track.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      this.hot.forEach((h) => { const p = this.toScreen(h.yaw, h.y); h.el.style.left = `${p.x}px`; h.el.style.top = `${p.y}px`; h.el.style.display = p.visible ? "" : "none"; });
      if (this.opts.onRender) this.opts.onRender(this);
    }
    toScreen(yaw, y) { const g = this.g || this.geom(), d = ((yaw - this.yaw + 540) % 360) - 180, x = g.vw / 2 + (d / 360) * g.W; return { x, y: this.top + y * g.H, visible: x > -40 && x < g.vw + 40 }; }
    toPano(sx, sy) { const g = this.g || this.geom(); return { yaw: wrapDeg(this.yaw + ((sx - g.vw / 2) / g.W) * 360), y: clamp((sy - this.top) / g.H, 0, 1) }; }
    look(yaw, pitch, zoom) { if (yaw != null) this.yaw = wrapDeg(yaw); if (pitch != null) this.pitch = pitch; if (zoom != null) this.zoom = zoom; this.render(); this.changed(); }
    changed() { if (this.opts.onChange) this.opts.onChange(this); }
    setHot(list) { this.layer.innerHTML = ""; this.hot = list.map((h) => { this.layer.appendChild(h.el); return h; }); this.render(); }
    bind() {
      const el = this.el;
      el.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".hs")) return;
        el.setPointerCapture(e.pointerId);
        this.ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
        if (this.ptrs.size === 2) { const [a, b] = [...this.ptrs.values()]; this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: this.zoom }; }
        this.moved = false; if (this.opts.onStart) this.opts.onStart();
      });
      el.addEventListener("pointermove", (e) => {
        const p = this.ptrs.get(e.pointerId); if (!p) return;
        const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
        if (Math.hypot(p.x - p.sx, p.y - p.sy) > 6) this.moved = true;
        if (this.ptrs.size >= 2 && this.pinch) { const [a, b] = [...this.ptrs.values()]; this.zoom = this.pinch.z * (Math.hypot(a.x - b.x, a.y - b.y) / this.pinch.d); this.render(); this.changed(); return; }
        const g = this.g || this.geom();
        this.yaw = wrapDeg(this.yaw - (dx / g.W) * 360);
        this.pitch = clamp(this.pitch + (g.H > g.vh ? dy / ((g.H - g.vh) / 2) : 0), -1, 1);
        this.render(); this.changed();
      });
      const end = (e) => {
        const p = this.ptrs.get(e.pointerId); if (!p) return; this.ptrs.delete(e.pointerId);
        if (this.ptrs.size < 2) this.pinch = null;
        if (!this.moved && e.type === "pointerup" && this.opts.onTap) { const r = el.getBoundingClientRect(); this.opts.onTap(e.clientX - r.left, e.clientY - r.top, e); }
      };
      el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
      el.addEventListener("wheel", (e) => { e.preventDefault(); this.zoom *= Math.exp(-e.deltaY * 0.0015); this.render(); this.changed(); if (this.opts.onStart) this.opts.onStart(); }, { passive: false });
    }
  }

  // ======================= Main viewer & state =======================
  const app = $("[data-app]"), stage = $("[data-stage]");
  let cur = null, autoRot = false, measuring = false, mPts = [], lastDir = -1;
  const V = new Viewer(stage, { onChange: () => onViewChange(), onStart: () => { closePop(); if (autoRot && !guide.on) setAutoRot(false); }, onTap: (x, y, e) => onTap(x, y, e), onRender: () => { drawMeasure(); updateCones(); } });

  function makeHotspots(room) {
    return room.hs.map(([t, w, x, y, title, text, extra]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = `hs ${t}`;
      const icon = { info: "info", nav: "up", video: "video", link: "link" }[t];
      b.innerHTML = ic(icon) + (t === "nav" ? `<span class="lbl">${esc(title)}</span>` : "");
      b.setAttribute("aria-label", t === "nav" ? `Go to ${title}` : `${{ info: "Info", video: "Video", link: "Link" }[t]}: ${title}`);
      const h = { el: b, yaw: hsYaw(w, x), y, t, title, text, extra };
      b.addEventListener("click", (e) => { e.stopPropagation(); hotspotClick(h); });
      return h;
    });
  }
  function hotspotClick(h) {
    if (measuring) return;
    if (h.t === "nav") { closePop(); goRoom(h.extra, { from: cur.id }); return; }
    if (h.t === "video") { closePop(); openMedia("clip", h.extra); return; }
    openPop(h);
  }
  const pop = $("[data-pop]");
  function openPop(h) {
    pop.innerHTML = `<button class="ib sm" type="button" data-pop-x aria-label="Close">${ic("x")}</button><p class="k">${h.t === "link" ? "External resource" : "Property detail"}</p><h3 id="pop-h">${esc(h.title)}</h3><p>${esc(h.text)}</p>${h.t === "link" ? `<a class="btn btn-accent" href="${h.extra}" target="_blank" rel="noopener">${ic("link")}Open resource</a>` : ""}`;
    pop.hidden = false;
    const r = h.el.getBoundingClientRect(), ar = app.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let x = r.left - ar.left + r.width / 2 - pw / 2, y = r.top - ar.top - ph - 14;
    if (y < 80) y = r.bottom - ar.top + 14;
    pop.style.left = `${clamp(x, 10, ar.width - pw - 10)}px`; pop.style.top = `${clamp(y, 10, ar.height - ph - 10)}px`;
    pop.dataset.for = h.title; $("[data-pop-x]", pop).focus({ preventScroll: true });
  }
  function closePop() { if (!pop.hidden) { pop.hidden = true; } }
  pop.addEventListener("click", (e) => { if (e.target.closest("[data-pop-x]")) closePop(); });
  document.addEventListener("pointerdown", (e) => { if (!pop.hidden && !e.target.closest("[data-pop]") && !e.target.closest(".hs")) closePop(); });

  // ---- descriptions for screen readers
  let descT;
  function onViewChange() {
    clearTimeout(descT);
    descT = setTimeout(() => {
      const dir = Math.round(wrapDeg(V.yaw) / 90) % 4;
      if (dir === lastDir) return; lastDir = dir;
      if ($('[data-set="announce"]').checked) $("[data-desc]").textContent = `${cur.name}, facing ${DIRS[dir]}: ${cur.desc[dir]}.`;
    }, 500);
  }
  const altText = (r) => `${r.name} (${r.dims}). ${r.desc.map((d, i) => `Facing ${DIRS[i]}: ${d}.`).join(" ")}`;

  // ======================= Room navigation =======================
  const fader = $("[data-fader]"), chip = $("[data-chip]");
  let switching = false;
  async function goRoom(id, { from, yaw, instant } = {}) {
    const room = byId[id]; if (!room || switching || (cur && cur.id === id)) return;
    switching = true; closePop(); mPts = []; lastDir = -1;
    const fast = instant || reduced();
    chip.textContent = `Loading ${room.name}…`; chip.hidden = false;
    if (!fast) { fader.classList.add("on"); stage.classList.add("zoomin"); V.zoom *= 1.15; V.render(); await wait(260); }
    const url = panoUrl(id);
    await new Promise((res) => { const im = new Image(); im.onload = im.onerror = res; im.src = url; });
    cur = room;
    let y = yaw;
    if (y == null && from) { const back = room.hs.find((h) => h[0] === "nav" && h[6] === from); y = back ? hsYaw(back[1], back[2]) + 180 : 0; }
    V.yaw = wrapDeg(y || 0); V.pitch = 0; V.zoom = 1;
    V.setImage(url); V.setHot(makeHotspots(room));
    stage.classList.remove("zoomin");
    syncRoomUI();
    if (!fast) { await wait(60); fader.classList.remove("on"); }
    chip.hidden = true; switching = false;
    try { history.replaceState(null, "", `#room=${id}`); } catch (_) { /* sandboxed */ }
    $("[data-desc]").textContent = `${room.name}. ${room.dims}. Facing ${DIRS[Math.round(wrapDeg(V.yaw) / 90) % 4]}: ${room.desc[Math.round(wrapDeg(V.yaw) / 90) % 4]}.`;
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  function step(d) { const i = ROOMS.indexOf(cur); goRoom(ROOMS[(i + d + ROOMS.length) % ROOMS.length].id); }

  // ---- strip
  const strip = $("[data-strip]");
  function buildStrip() {
    strip.innerHTML = ROOMS.map((r) => `<button class="thumb" type="button" role="tab" aria-selected="false" data-room="${r.id}" aria-label="${r.name}"><img alt="" src="${cropUrl(r.id, 0)}"><span>${r.name}</span></button>`).join("");
  }
  strip.addEventListener("click", (e) => { const b = e.target.closest("[data-room]"); if (b) goRoom(b.dataset.room); });
  strip.addEventListener("keydown", (e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const bs = $$("[data-room]", strip), i = bs.indexOf(document.activeElement); if (i >= 0) { e.preventDefault(); bs[(i + (e.key === "ArrowRight" ? 1 : -1) + bs.length) % bs.length].focus(); } } });

  function syncRoomUI() {
    $$("[data-room]", strip).forEach((b) => { const on = b.dataset.room === cur.id; b.setAttribute("aria-selected", String(on)); if (on) b.scrollIntoView({ block: "nearest", inline: "nearest" }); });
    $("[data-r-name]").textContent = cur.name; $("[data-r-dims]").textContent = cur.dims;
    $("[data-r-note]").textContent = cur.note;
    $("[data-r-features]").innerHTML = cur.features.map((f) => `<li>${esc(f)}</li>`).join("");
    $("[data-r-gallery]").innerHTML = [0, 1, 2, 3].map((w) => `<button type="button" data-rphoto="${w}" aria-label="${cur.name} photo ${w + 1}: facing ${DIRS[w]}"><img alt="" src="${cropUrl(cur.id, w)}" style="width:100%;height:100%;object-fit:cover;display:block"></button>`).join("");
    $("[data-r-alt]").textContent = altText(cur); $("[data-a11y-alt]").textContent = altText(cur);
    $("[data-m-room]").textContent = `${cur.name} · ${cur.dims}`;
    const [, , w, h] = cur.rect;
    $("[data-m-dims]").innerHTML = `<div><dt>Width × depth</dt><dd>${w}' × ${h}'</dd></div><div><dt>Floor area</dt><dd>${w * h} sq ft</dd></div><div><dt>Ceiling height</dt><dd>${cur.ceil}'${cur.vaulted ? " (vaulted)" : ""}</dd></div>`;
    $("[data-fit-wall]").innerHTML = cur.fit.length ? cur.fit.map(([n, l], i) => `<option value="${i}">${n} — ${l}'</option>`).join("") : `<option value="">No open wall for seating</option>`;
    $("[data-fit-wall]").disabled = !cur.fit.length; fitCalc();
    $("[data-mini-level]").textContent = cur.level === "main" ? "Main level" : "Upper level";
    $("[data-mini-map]").innerHTML = planSvg(cur.level, true);
    if ($("[data-modal=plan]").open) drawPlan(cur.level);
    $("[data-m-log]").innerHTML = "";
    guideSyncRoom();
  }

  // ======================= Floor plan & mini map =======================
  function planSvg(level, mini) {
    const rooms = [...OTHER[level].map(([n, x, y, w, h, t]) => ({ n, x, y, w, h, t })), ...ROOMS.filter((r) => r.level === level).map((r) => ({ n: r.name, x: r.rect[0], y: r.rect[1], w: r.rect[2], h: r.rect[3], t: r.type, id: r.id }))];
    let s = `<svg viewBox="-1 -1 62 38" role="group" aria-label="${level === "main" ? "Main" : "Upper"} level floor plan${mini ? " (mini map)" : ""}"><rect x="-1" y="-1" width="62" height="38" fill="${mini ? "transparent" : "#1B1E24"}"/>`;
    rooms.forEach((r) => {
      const col = TYPES[r.t][1], on = cur && r.id === cur.id;
      s += `<g class="fp-room${r.id ? " tour" : ""}${on ? " cur" : ""}"${r.id ? ` data-go="${r.id}" tabindex="0" role="button" aria-label="${on ? "Current room: " : "Go to "}${r.n}"` : ""}><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${col}" fill-opacity="${r.id ? (on ? 0.55 : 0.32) : 0.12}"/>${mini && (!r.id || on) ? "" : `<text x="${r.x + r.w / 2}" y="${r.y + r.h / 2 + 0.6}" text-anchor="middle"${mini ? ' style="font-size:2.6px"' : ""}>${r.n.replace("Primary ", mini ? "" : "Primary ")}</text>`}</g>`;
    });
    if (cur && cur.level === level) { const [x, y, w, h] = cur.rect, cx = x + w / 2, cy = y + h / 2 + (mini ? 0 : 3); s += `<g class="cone" transform="translate(${cx} ${cy}) rotate(${V.yaw})"><path d="M0 0 L-5 -10 A11 11 0 0 1 5 -10Z" fill="#F2B544" fill-opacity=".55"/><circle r="1.6" fill="#F2B544" stroke="#fff" stroke-width=".5"/></g>`; }
    return s + "</svg>";
  }
  function updateCones() { if (!cur) return; $$(".cone").forEach((c) => { const t = c.getAttribute("transform"); c.setAttribute("transform", t.replace(/rotate\([^)]*\)/, `rotate(${V.yaw.toFixed(1)})`)); }); }
  let planLevel = "main";
  function drawPlan(level) {
    planLevel = level;
    $$("[data-lv]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.lv === level)));
    $("[data-fp]").innerHTML = planSvg(level, false);
  }
  $("[data-legend]").innerHTML = Object.values(TYPES).map(([n, c]) => `<li><i style="background:${c}"></i>${n}</li>`).join("") + `<li><i style="background:#F2B544;border-radius:50%"></i>You are here (cone = view direction)</li>`;
  $("[data-lv-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-lv]"); if (b) drawPlan(b.dataset.lv); });
  const planGo = (e) => { const g = e.target.closest("[data-go]"); if (!g) return; if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); const d = e.target.closest("dialog"); if (d) d.close(); goRoom(g.dataset.go); };
  ["click", "keydown"].forEach((t) => { $("[data-fp]").addEventListener(t, planGo); $("[data-mini-map]").addEventListener(t, planGo); });
  $("[data-mini-toggle]").addEventListener("click", () => { $("[data-mini]").hidden = true; $("[data-mini-show]").hidden = false; $("[data-mini-show]").focus(); });
  $("[data-mini-show]").addEventListener("click", () => { $("[data-mini]").hidden = false; $("[data-mini-show]").hidden = true; $("[data-mini-toggle]").focus(); });

  // ======================= Controls =======================
  const raf = { last: 0 };
  function setAutoRot(on) { autoRot = on; $("[data-autorot]").setAttribute("aria-pressed", String(on)); }
  $("[data-autorot]").addEventListener("click", () => { if (reduced() && !autoRot) toast("Auto-rotate runs slowly while reduced motion is on."); setAutoRot(!autoRot); });
  $$("[data-zoom]").forEach((b) => b.addEventListener("click", () => zoomBy(+b.dataset.zoom)));
  function zoomBy(d) { const z0 = V.zoom, z1 = z0 * (d > 0 ? 1.25 : 0.8); tween((k) => { V.zoom = z0 + (z1 - z0) * k; V.render(); }); }
  function tween(fn, ms = 260) { if (reduced()) { fn(1); return; } const t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / ms); fn(1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
  function resetView() { const y0 = V.yaw, p0 = V.pitch, z0 = V.zoom, d = ((0 - y0 + 540) % 360) - 180; tween((k) => { V.yaw = wrapDeg(y0 + d * k); V.pitch = p0 * (1 - k); V.zoom = z0 + (1 - z0) * k; V.render(); }, 400); setTimeout(() => V.changed(), 420); }
  $("[data-reset]").addEventListener("click", resetView);
  const fsBtn = $("[data-fs]");
  function toggleFs() {
    const el = app;
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
    if (!el.requestFullscreen) { toast("Fullscreen isn't supported in this browser — try landscape mode instead."); return; }
    el.requestFullscreen().catch(() => toast("Fullscreen was blocked by the browser."));
  }
  fsBtn.addEventListener("click", toggleFs);
  document.addEventListener("fullscreenchange", () => { const on = document.fullscreenElement === app; fsBtn.setAttribute("aria-label", on ? "Exit fullscreen" : "Enter fullscreen"); fsBtn.setAttribute("aria-pressed", String(on)); });

  // gyroscope
  let gyro = null;
  const gyroBtn = $("[data-gyro]");
  async function setGyro(on) {
    if (!on) { if (gyro) removeEventListener("deviceorientation", gyro.fn); gyro = null; gyroBtn.setAttribute("aria-pressed", "false"); return; }
    try { if (typeof DeviceOrientationEvent !== "undefined" && DeviceOrientationEvent.requestPermission) { const p = await DeviceOrientationEvent.requestPermission(); if (p !== "granted") { toast("Motion access was declined."); return; } } } catch (_) { /* not available */ }
    gyro = { a0: null, y0: V.yaw, got: false, fn: (e) => {
      if (e.alpha == null) return; gyro.got = true;
      if (gyro.a0 == null) gyro.a0 = e.alpha;
      V.yaw = wrapDeg(gyro.y0 - (e.alpha - gyro.a0)); V.pitch = clamp(((e.beta || 90) - 90) / 45, -1, 1); V.render(); V.changed();
    } };
    addEventListener("deviceorientation", gyro.fn); gyroBtn.setAttribute("aria-pressed", "true");
    setTimeout(() => { if (gyro && !gyro.got) { setGyro(false); toast("No gyroscope detected on this device — drag to look around."); } }, 1200);
  }
  gyroBtn.addEventListener("click", () => setGyro(!gyro));

  // VR stereo view
  const vrbox = $("[data-vrbox]"); let eyes = [];
  $("[data-vr]").addEventListener("click", () => {
    vrbox.hidden = false;
    if (!eyes.length) eyes = $$("[data-eye]", vrbox).map((el) => new Viewer(el, { onChange: (v) => { V.yaw = v.yaw - (v.el.dataset.eye === "l" ? -1.5 : 1.5); V.pitch = v.pitch; syncEyes(v); V.render(); } }));
    eyes.forEach((e) => e.setImage(panoUrl(cur.id))); syncEyes();
    if (vrbox.requestFullscreen) vrbox.requestFullscreen().then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock("landscape").catch(() => {})).catch(() => {});
    $("[data-vr-exit]").focus();
  });
  function syncEyes(except) { eyes.forEach((e, i) => { if (e === except) return; e.yaw = V.yaw + (i ? 1.5 : -1.5); e.pitch = V.pitch; e.zoom = 1; e.render(); }); }
  $("[data-vr-exit]").addEventListener("click", () => { vrbox.hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); });

  // ======================= Panels =======================
  const PANEL_SIDE = { room: "right", measure: "right", a11y: "right", details: "left" };
  function openPanel(name) {
    const p = $(`[data-panel="${name}"]`);
    const was = !p.hidden;
    $$("[data-panel]").forEach((x) => { if (x === p || PANEL_SIDE[x.dataset.panel] === PANEL_SIDE[name] || matchMedia("(max-width: 860px)").matches) x.hidden = true; });
    p.hidden = was;
    $$(`[data-open]`).forEach((b) => { const n = b.dataset.open; if (PANEL_SIDE[n]) b.setAttribute("aria-expanded", String(!$(`[data-panel="${n}"]`).hidden)); });
    if (!was) $("[data-close-panel]", p).focus();
    if (name === "measure" && was && measuring) setMeasure(false);
  }
  $$("[data-close-panel]").forEach((b) => b.addEventListener("click", () => { const p = b.closest("[data-panel]"); p.hidden = true; if (p.dataset.panel === "measure") setMeasure(false); $$(`[data-open="${p.dataset.panel}"]`).forEach((x) => x.setAttribute("aria-expanded", "false")); stage.focus(); }));

  // generic openers
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]"); if (!b) return;
    const n = b.dataset.open; closeSheet();
    if (PANEL_SIDE[n]) { openPanel(n); return; }
    if (n === "plan") { drawPlan(cur.level); $("[data-modal=plan]").showModal(); }
    if (n === "ba") openBA("reno");
    if (n === "media") openMedia("photos");
    if (n === "compare") openCompare();
    if (n === "share") openShare();
    if (n === "schedule") openSchedule("tour");
  });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));
  $("[data-modal=media]").addEventListener("close", () => player.stop());

  // mobile nav
  const sheet = $("[data-sheet]"), dock = $("[data-dock]");
  function closeSheet() { sheet.hidden = true; $('[data-mnav="tools"]').setAttribute("aria-expanded", "false"); }
  $('[data-mnav="tools"]').addEventListener("click", (e) => { const open = sheet.hidden; sheet.hidden = !open; e.currentTarget.setAttribute("aria-expanded", String(open)); if (open) { dock.classList.remove("open"); app.classList.remove("mdock"); $('[data-mnav="rooms"]').setAttribute("aria-expanded", "false"); } });
  $('[data-mnav="rooms"]').addEventListener("click", (e) => { const open = !dock.classList.contains("open"); dock.classList.toggle("open", open); app.classList.toggle("mdock", open); e.currentTarget.setAttribute("aria-expanded", String(open)); closeSheet(); });

  // ======================= Measure & couch fit =======================
  const mhint = $("[data-mhint]"), mBtn = $("[data-measure]");
  function setMeasure(on) {
    measuring = on; mPts = []; stage.classList.toggle("measuring", on); mBtn.setAttribute("aria-pressed", String(on));
    $("span", mBtn).textContent = on ? "Stop measuring" : "Measure two points";
    mhint.hidden = !on; mhint.textContent = "Click or tap the first point"; V.render();
    if (on) { setAutoRot(false); closePop(); }
  }
  mBtn.addEventListener("click", () => setMeasure(!measuring));
  function onTap(x, y) {
    if (!measuring) return;
    const p = V.toPano(x, y);
    if (mPts.length >= 2) mPts = [];
    mPts.push(p);
    if (mPts.length === 1) mhint.textContent = "Now click the second point";
    else {
      const d = measureFt(mPts[0], mPts[1]);
      mhint.textContent = `Distance ≈ ${d.toFixed(1)} ft · click to start a new measurement`;
      $("[data-m-log]").insertAdjacentHTML("afterbegin", `<li><b>≈ ${d.toFixed(1)} ft</b> (${Math.floor(d)}' ${Math.round((d % 1) * 12)}") in the ${esc(cur.name.toLowerCase())}</li>`);
    }
    V.render();
  }
  function measureFt(a, b) {
    const [, , w, h] = cur.rect, per = 2 * (w + h), dyaw = Math.abs(((b.yaw - a.yaw + 540) % 360) - 180);
    const horiz = (dyaw / 360) * per, vert = Math.abs(b.y - a.y) * (cur.ceil / (480 / 900));
    return Math.hypot(horiz, vert);
  }
  function drawMeasure() {
    $$(".mpt,.mline,.mlabel", V.layer).forEach((n) => n.remove());
    if (!measuring || !mPts.length) return;
    const pts = mPts.map((p) => V.toScreen(p.yaw, p.y));
    pts.forEach((p) => { const d = document.createElement("i"); d.className = "mpt"; d.style.left = `${p.x}px`; d.style.top = `${p.y}px`; V.layer.appendChild(d); });
    if (pts.length === 2) {
      const [a, b] = pts, len = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x);
      const l = document.createElement("i"); l.className = "mline"; l.style.left = `${a.x}px`; l.style.top = `${a.y - 1.5}px`; l.style.width = `${len}px`; l.style.transform = `rotate(${ang}rad)`;
      const t = document.createElement("span"); t.className = "mlabel"; t.style.left = `${(a.x + b.x) / 2}px`; t.style.top = `${(a.y + b.y) / 2}px`; t.textContent = `≈ ${measureFt(mPts[0], mPts[1]).toFixed(1)} ft`;
      V.layer.append(l, t);
    }
  }
  const fit = $("[data-fit]");
  function fitCalc() {
    const out = $("[data-fit-out]");
    if (!cur || !cur.fit.length) { out.innerHTML = `<p class="verdict no">This room has no open wall for a couch — try the living room or bedroom.</p>`; return; }
    const L = (+fit.len.value || 0) / 12, D = (+fit.dep.value || 0) / 12, [name, wall, depth] = cur.fit[+fit.wall.value || 0];
    const spare = wall - L, walk = depth - D, ok = spare >= 1 && walk >= 3;
    const sc = 300 / wall, cl = (300 - L * sc) / 2;
    out.innerHTML = `<p class="verdict ${ok ? "yes" : "no"}">${ok ? `Yes — fits along the ${esc(name.split(" (")[0].toLowerCase())} with ${spare.toFixed(1)} ft to spare and ${walk.toFixed(1)} ft of walkway.` : spare < 1 ? `Too long — needs ${(L + 1 - wall).toFixed(1)} ft more wall (keep 6" each side).` : `Too deep — leaves only ${walk.toFixed(1)} ft of walkway (aim for 3 ft).`}</p>
      <svg viewBox="0 0 320 120" role="img" aria-label="Couch ${(L).toFixed(1)} by ${D.toFixed(1)} feet on a ${wall} foot wall"><rect x="10" y="14" width="300" height="8" fill="#94A3B8"/><text x="160" y="10" text-anchor="middle" font-size="9" fill="#A7AEB9" font-family="Inter, sans-serif">${esc(name)} · ${wall} ft</text>
      <rect x="${10 + Math.max(0, cl)}" y="24" width="${Math.min(300, L * sc)}" height="${Math.min(80, D * sc)}" rx="6" fill="${ok ? "#34D399" : "#F87171"}" fill-opacity=".55" stroke="${ok ? "#34D399" : "#F87171"}"/><text x="160" y="${24 + Math.min(80, D * sc) / 2 + 3}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" font-family="Inter, sans-serif">${Math.round(L * 12)}" × ${Math.round(D * 12)}"</text></svg>`;
  }
  fit.addEventListener("input", fitCalc); fit.addEventListener("change", fitCalc); fit.addEventListener("submit", (e) => e.preventDefault());

  // ======================= Guided tour =======================
  const ORDER = ["living", "office", "kitchen", "dining", "primary", "pbath"];
  const guide = { on: false, playing: false, i: 0, t: 0, dur: 9, audio: false, spokeFor: -1 };
  const gUI = $("[data-guide]"), playBtn = $('[data-g="play"]');
  $("[data-t-list]").innerHTML = ORDER.map((id, i) => `<li data-ti="${i}"><b>${byId[id].name}</b>${esc(byId[id].narration)}</li>`).join("");
  function setMode(m) {
    $$("[data-mode]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.mode === m)));
    guide.on = m === "guided"; gUI.hidden = !guide.on;
    if (guide.on) { guide.i = Math.max(0, ORDER.indexOf(cur.id)); guide.t = 0; setPlaying(true); goRoom(ORDER[guide.i], { yaw: 0 }); }
    else { setPlaying(false); speechStop(); $("[data-transcript]").hidden = true; $('[data-g="transcript"]').setAttribute("aria-pressed", "false"); }
    syncGuideUI();
  }
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  function setPlaying(p) {
    guide.playing = p; playBtn.innerHTML = ic(p ? "pause" : "play"); playBtn.setAttribute("aria-label", p ? "Pause guided tour" : "Play guided tour");
    if (!p) speechPause(); else speechResume();
  }
  playBtn.addEventListener("click", () => { if (!guide.playing && guide.i >= ORDER.length - 1 && guide.t >= guide.dur) { guide.i = 0; guide.t = 0; goRoom(ORDER[0], { yaw: 0 }); } setPlaying(!guide.playing); });
  function gStep(d) { guide.i = clamp(guide.i + d, 0, ORDER.length - 1); guide.t = 0; speechStop(); guide.spokeFor = -1; goRoom(ORDER[guide.i], { yaw: 0 }); syncGuideUI(); }
  $('[data-g="prev"]').addEventListener("click", () => gStep(-1));
  $('[data-g="next"]').addEventListener("click", () => gStep(1));
  $('[data-g="audio"]').addEventListener("click", (e) => {
    if (!("speechSynthesis" in window)) { toast("Narration audio isn't available in this browser — the transcript has every word."); return; }
    guide.audio = !guide.audio; e.currentTarget.setAttribute("aria-pressed", String(guide.audio)); e.currentTarget.innerHTML = ic(guide.audio ? "vol" : "mute");
    e.currentTarget.setAttribute("aria-label", guide.audio ? "Turn narration audio off" : "Turn narration audio on");
    if (!guide.audio) speechStop(); else guide.spokeFor = -1;
  });
  $('[data-g="transcript"]').addEventListener("click", (e) => { const t = $("[data-transcript]"); t.hidden = !t.hidden; e.currentTarget.setAttribute("aria-pressed", String(!t.hidden)); });
  function guideSyncRoom() { if (!guide.on) return; const i = ORDER.indexOf(cur.id); if (i >= 0 && i !== guide.i) { guide.i = i; guide.t = 0; guide.spokeFor = -1; } syncGuideUI(); }
  function syncGuideUI() {
    $("[data-g-prog]").textContent = `${guide.i + 1} / ${ORDER.length}`;
    $$("[data-ti]").forEach((li) => li.classList.toggle("on", +li.dataset.ti === guide.i));
    const n = byId[ORDER[guide.i]].narration.split(/\s+/).length; guide.dur = Math.max(8, n * 0.42);
  }
  function speechStop() { if ("speechSynthesis" in window) speechSynthesis.cancel(); }
  function speechPause() { if ("speechSynthesis" in window && speechSynthesis.speaking) speechSynthesis.pause(); }
  function speechResume() { if ("speechSynthesis" in window && speechSynthesis.paused) speechSynthesis.resume(); }
  function guideTick(dt) {
    if (!guide.on || !guide.playing || switching) return;
    if (guide.audio && guide.spokeFor !== guide.i && "speechSynthesis" in window) { guide.spokeFor = guide.i; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(byId[ORDER[guide.i]].narration); u.rate = 1; speechSynthesis.speak(u); }
    guide.t += dt;
    V.yaw = wrapDeg(V.yaw + dt * (reduced() ? 6 : 16)); V.render(); V.changed();
    const speaking = guide.audio && "speechSynthesis" in window && speechSynthesis.speaking;
    if (guide.t >= guide.dur && !speaking) {
      if (guide.i < ORDER.length - 1) gStep(1);
      else { setPlaying(false); toast("That's the end of the guided tour. Switch to self-guided to explore freely."); }
    }
  }

  // ======================= Animation loop =======================
  function loop(t) {
    const dt = raf.last ? Math.min(0.1, (t - raf.last) / 1000) : 0; raf.last = t;
    if (autoRot && !guide.on && !measuring && !switching && !V.ptrs.size) { V.yaw = wrapDeg(V.yaw + dt * (reduced() ? 3 : 8)); V.render(); V.changed(); }
    guideTick(dt);
    if (!vrbox.hidden) syncEyes();
    requestAnimationFrame(loop);
  }

  // ======================= Keyboard =======================
  stage.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowLeft" || k === "ArrowRight") { e.preventDefault(); V.look(V.yaw + (k === "ArrowLeft" ? -6 : 6)); }
    else if (k === "ArrowUp" || k === "ArrowDown") { e.preventDefault(); V.look(null, V.pitch + (k === "ArrowUp" ? 0.15 : -0.15)); }
    else if (k === "+" || k === "=") { e.preventDefault(); zoomBy(1); }
    else if (k === "-" || k === "_") { e.preventDefault(); zoomBy(-1); }
    else if (k === "PageDown") { e.preventDefault(); step(1); }
    else if (k === "PageUp") { e.preventDefault(); step(-1); }
    else if (k === "r" || k === "R") setAutoRot(!autoRot);
    else if (k === "0") resetView();
    else if (k === "f" || k === "F") toggleFs();
    else if (k === "m" || k === "M") { if ($('[data-panel="measure"]').hidden) openPanel("measure"); setMeasure(!measuring); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || document.querySelector("dialog[open]")) return;
    if (!pop.hidden) { closePop(); return; }
    if (measuring) { setMeasure(false); return; }
    if (!vrbox.hidden) { $("[data-vr-exit]").click(); return; }
    const open = $$("[data-panel]").filter((p) => !p.hidden);
    if (open.length) { open.forEach((p) => $("[data-close-panel]", p).click()); return; }
    if (!sheet.hidden) closeSheet();
  });

  // ======================= Before / After =======================
  const BA = { reno: ["kitchen", 0, "dated", "base", "Before (2019)", "After (2024 renovation)", "Kitchen renovation: oak cabinets and laminate replaced with shaker cabinetry, quartz and a new range hood."],
    stage: ["living", 2, "empty", "base", "Empty", "Staged", "Staging vs. empty: the same living room wall with and without furniture."] };
  function openBA(k) {
    const [id, w, before, after, l, r, sub] = BA[k];
    $$("[data-ba]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.ba === k)));
    $("[data-ba-before]").innerHTML = Art.crop(panoSvg(id, before), w, `${byId[id].name}, ${l.toLowerCase()}`);
    $("[data-ba-after]").innerHTML = Art.crop(panoSvg(id, after), w, `${byId[id].name}, ${r.toLowerCase()}`);
    $("[data-ba-l]").textContent = l; $("[data-ba-r]").textContent = r; $("[data-ba-sub]").textContent = sub;
    $("[data-ba-range]").value = 50; baSet(50);
    if (!$("[data-modal=ba]").open) $("[data-modal=ba]").showModal();
  }
  function baSet(v) { $("[data-ba-before]").style.clipPath = `inset(0 ${100 - v}% 0 0)`; $("[data-ba-handle]").style.left = `${v}%`; $("[data-ba-range]").setAttribute("aria-valuetext", `${v}% before`); }
  $("[data-ba-range]").addEventListener("input", (e) => baSet(+e.target.value));
  $("[data-ba-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-ba]"); if (b) openBA(b.dataset.ba); });

  // ======================= Media =======================
  const PHOTOS = [["ext", "Front exterior"], ...ROOMS.flatMap((r) => [[r.id, 0, `${r.name}`], [r.id, r.id === "living" ? 1 : 2, `${r.name} — another angle`]])];
  const CLIPS = {
    walk: { title: "Video walkthrough", dur: 30, cap: "A 30-second walk from the living room into the kitchen.", kind: "pan", src: () => panoSvg("living") + "", to: 0.62 },
    drone: { title: "Drone footage", dur: 24, cap: "Aerial view of the lot, the backyard pool and the tree-lined block.", kind: "drone" },
    hood: { title: "Neighborhood video", dur: 28, cap: "A stroll along Larkspur Lane past neighbors' homes to the corner café.", kind: "pan", src: () => Art.street(), to: 0.5 },
    fire: { title: "Fireplace ambience", dur: 15, cap: "The gas fireplace on a winter evening.", kind: "zoom", src: () => Art.crop(panoSvg("living"), 0, "Living room fireplace") },
    kitchen: { title: "Chef's kitchen walkthrough", dur: 20, cap: "From range to island: the 2024 kitchen renovation.", kind: "pan", src: () => panoSvg("kitchen"), to: 0.75 },
    light: { title: "Morning light time-lapse", dur: 12, cap: "Sunrise moving across the primary bedroom.", kind: "light", src: () => Art.crop(panoSvg("primary"), 1, "Primary bedroom window") },
  };
  const md = $("[data-modal=media]");
  function photoSvg(p) { return p[0] === "ext" ? Art.exterior() : Art.crop(panoSvg(p[0]), p[1], p[2]); }
  function mdTab(t) {
    $$("[data-md]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.md === t)));
    player.stop(); $("[data-player]").hidden = true; $("[data-photo]").hidden = true; $("[data-md-grid]").hidden = false;
    if (t === "photos") $("[data-md-grid]").innerHTML = PHOTOS.map((p, i) => `<button type="button" data-pi="${i}" aria-label="Open photo ${i + 1} of ${PHOTOS.length}: ${esc(p[2] || p[1])}">${photoSvg(p)}<span>${esc(p[2] || p[1])}</span></button>`).join("");
    else { $("[data-md-grid]").hidden = true; openClip(t); }
  }
  function openMedia(t, clip) { if (!md.open) md.showModal(); if (t === "clip") { $$("[data-md]").forEach((b) => b.setAttribute("aria-selected", "false")); $("[data-md-grid]").hidden = true; $("[data-photo]").hidden = true; openClip(clip); } else mdTab(t); }
  $("[data-md-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-md]"); if (b) mdTab(b.dataset.md); });
  let pi = 0;
  function showPhoto(i) { pi = (i + PHOTOS.length) % PHOTOS.length; $("[data-photo-img]").innerHTML = photoSvg(PHOTOS[pi]); $("[data-ph-count]").textContent = `${pi + 1} of ${PHOTOS.length} · ${PHOTOS[pi][2] || PHOTOS[pi][1]}`; }
  $("[data-md-grid]").addEventListener("click", (e) => { const b = e.target.closest("[data-pi]"); if (!b) return; $("[data-md-grid]").hidden = true; $("[data-photo]").hidden = false; showPhoto(+b.dataset.pi); });
  $$("[data-ph]").forEach((b) => b.addEventListener("click", () => showPhoto(pi + +b.dataset.ph)));
  $$("[data-pl-grid]").forEach((b) => b.addEventListener("click", () => mdTab("photos")));
  $("[data-r-gallery]").addEventListener("click", (e) => { const b = e.target.closest("[data-rphoto]"); if (!b) return; md.showModal(); mdTab("photos"); const i = PHOTOS.findIndex((p) => p[0] === cur.id); $("[data-md-grid]").hidden = true; $("[data-photo]").hidden = false; showPhoto(Math.max(0, i)); });
  const player = {
    clip: null, t: 0, playing: false, last: 0, raf: 0,
    stop() { this.playing = false; cancelAnimationFrame(this.raf); },
    tick(ts) { const p = player; if (!p.playing) return; const dt = p.last ? (ts - p.last) / 1000 : 0; p.last = ts; p.t = Math.min(p.clip.dur, p.t + dt); p.draw(); if (p.t >= p.clip.dur) { p.playing = false; p.btn(); return; } p.raf = requestAnimationFrame(player.tick); },
    draw() {
      const c = this.clip, k = this.t / c.dur, sc = $("[data-screen]");
      if (c.kind === "pan") { const inner = $(".pan", sc); if (inner) { const w = inner.offsetWidth - sc.offsetWidth; inner.style.transform = `translateX(${-w * c.to * k}px)`; } }
      if (c.kind === "drone") { const s = $("svg", sc); if (s) s.style.transform = `scale(${1 + k * 0.35}) rotate(${k * 6}deg)`; }
      if (c.kind === "zoom") { const s = $("svg", sc); if (s) { s.style.transform = `scale(${1 + k * 0.4})`; s.style.filter = `brightness(${0.9 + 0.12 * Math.sin(this.t * 7)})`; } }
      if (c.kind === "light") { const s = $("svg", sc); if (s) s.style.filter = `brightness(${0.45 + k * 0.7}) sepia(${0.4 - k * 0.35})`; }
      $("[data-pl-fill]").style.width = `${k * 100}%`;
      const f = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
      $("[data-pl-time]").textContent = `${f(this.t)} / ${f(c.dur)}`;
    },
    btn() { const b = $("[data-pl-play]"); b.innerHTML = ic(this.playing ? "pause" : "play"); b.setAttribute("aria-label", this.playing ? "Pause" : "Play"); },
  };
  function openClip(id) {
    const c = CLIPS[id]; player.stop(); player.clip = c; player.t = 0;
    const sc = $("[data-screen]");
    sc.innerHTML = c.kind === "pan" ? `<div class="pan">${c.src()}</div>` : c.kind === "drone" ? Art.aerial(0) : c.src();
    $$("svg", sc).forEach((s) => { s.style.transformOrigin = "50% 50%"; s.style.transition = "none"; });
    sc.setAttribute("role", "img"); sc.setAttribute("aria-label", `${c.title} (simulated video)`);
    $("[data-pl-cap]").textContent = `${c.title} — ${c.cap}`;
    $("[data-player]").hidden = false; player.draw();
    player.playing = true; player.last = 0; player.btn(); player.raf = requestAnimationFrame(player.tick);
  }
  $("[data-pl-play]").addEventListener("click", () => { if (player.playing) { player.stop(); } else { if (player.t >= player.clip.dur) player.t = 0; player.playing = true; player.last = 0; player.raf = requestAnimationFrame(player.tick); } player.btn(); });
  $(".pl-prog").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); player.t = clamp((e.clientX - r.left) / r.width, 0, 1) * player.clip.dur; player.draw(); });

  // ======================= Compare =======================
  let cpA = null, cpB = null, cpRoom = "living";
  const COMP_DIMS = { living: "21' × 19'", kitchen: "16' × 15'", primary: "18' × 16'" };
  function openCompare() {
    const d = $("[data-modal=compare]"); d.showModal();
    if (!cpA) {
      const sync = (src, dst) => { if (!$("[data-cp-sync]").checked) return; dst.yaw = src.yaw; dst.pitch = src.pitch; dst.zoom = src.zoom; dst.render(); };
      cpA = new Viewer($("[data-cp-a]"), { onChange: (v) => sync(v, cpB) });
      cpB = new Viewer($("[data-cp-b]"), { onChange: (v) => sync(v, cpA) });
      [cpA, cpB].forEach((v) => v.el.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); v.look(v.yaw + (e.key === "ArrowLeft" ? -8 : 8)); } }));
    }
    cpLoad(cpRoom);
  }
  function cpLoad(id) {
    cpRoom = id; $$("[data-cp]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.cp === id)));
    cpA.setImage(panoUrl(id)); cpB.setImage(panoUrl(id, "comp"));
    cpA.look(0, 0, 1); cpB.look(0, 0, 1);
    $("[data-cp-a-cap]").textContent = `${byId[id].name} · ${byId[id].dims.split(" ·")[0]}`; $("[data-cp-b-cap]").textContent = `${byId[id].name} · ${COMP_DIMS[id]}`;
    requestAnimationFrame(() => { cpA.render(); cpB.render(); });
  }
  $("[data-cp-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-cp]"); if (b) cpLoad(b.dataset.cp); });

  // ======================= Share =======================
  function tourUrl() { const u = new URL(location.href); u.hash = `room=${cur.id}`; return u.toString(); }
  function openShare() {
    const url = tourUrl();
    $("[data-share-url]").value = url;
    $("[data-share-embed]").value = `<iframe src="${url}" width="960" height="540" style="border:0" allow="fullscreen; gyroscope; accelerometer" allowfullscreen title="Virtual tour of 2148 Larkspur Lane"></iframe>`;
    $("[data-share-mail]").href = `mailto:?subject=${encodeURIComponent("Virtual tour: 2148 Larkspur Lane, Boulder, CO")}&body=${encodeURIComponent(`Take a look at this home — 4 bed, 3.5 bath, $1,250,000. Start in the ${cur.name.toLowerCase()}:\n${url}`)}`;
    try { $("[data-qr]").innerHTML = QR.toSvg(url); } catch (_) { $("[data-qr]").innerHTML = `<p style="color:#111;font-size:12px;padding:10px">Link too long for a QR code — copy it instead.</p>`; }
    $("[data-modal=share]").showModal();
  }
  async function copy(text, label) {
    try { await navigator.clipboard.writeText(text); toast(`${label} copied.`); }
    catch (_) { const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (__) { /* blocked */ } ta.remove(); toast(ok ? `${label} copied.` : "Copy isn't available here — select the text and copy it manually."); }
  }
  $$("[data-copy]").forEach((b) => b.addEventListener("click", () => b.dataset.copy === "url" ? copy($("[data-share-url]").value, "Tour link") : copy($("[data-share-embed]").value, "Embed code")));
  if (navigator.share) $("[data-share-mail]").insertAdjacentHTML("afterend", `<button class="btn btn-ghost" type="button" data-native-share>${ic("share")}More apps…</button>`);
  document.addEventListener("click", (e) => { if (e.target.closest("[data-native-share]")) navigator.share({ title: "2148 Larkspur Lane virtual tour", url: tourUrl() }).catch(() => {}); });

  // save
  const saveBtn = $("[data-save]");
  const setSaved = (on) => { saveBtn.setAttribute("aria-pressed", String(on)); saveBtn.setAttribute("aria-label", on ? "Saved — remove from favorites" : "Save this home"); };
  setSaved(store.get("larkspur-saved") === "1");
  saveBtn.addEventListener("click", () => { const on = saveBtn.getAttribute("aria-pressed") !== "true"; setSaved(on); store.set("larkspur-saved", on ? "1" : "0"); toast(on ? "Saved to your favorites." : "Removed from your favorites."); });

  // ======================= Schedule =======================
  const sc = $("[data-modal=schedule]"), sf = $("[data-sc-form]");
  const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"];
  $("[data-slots]").innerHTML = SLOTS.map((s, i) => `<label><input type="radio" name="slot" value="${s}"${i === 2 ? " checked" : ""}>${s}</label>`).join("");
  let scMode = "tour";
  function openSchedule(m) {
    scMode = m; $$("[data-sc]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.sc === m)));
    $("[data-sc-when]").hidden = m !== "tour"; $("[data-sc-submit]").textContent = m === "tour" ? "Request Tour" : "Request More Info";
    sf.hidden = false; $("[data-sc-done]").hidden = true; $("[data-sc-err]").textContent = "";
    const d = new Date(Date.now() + 864e5); sf.date.min = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (m === "info" && !sf.msg.value) sf.msg.value = "I'd love the disclosure packet and HOA documents.";
    if (!sc.open) sc.showModal();
  }
  $("[data-sc-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-sc]"); if (b) openSchedule(b.dataset.sc); });
  sf.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = []; $$("[aria-invalid]", sf).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (scMode === "tour" && (!sf.date.value || sf.date.value < sf.date.min)) bad(sf.date, "a date from tomorrow onward");
    if (sf.name.value.trim().length < 2) bad(sf.name, "your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sf.email.value.trim())) bad(sf.email, "a valid email");
    if (sf.phone.value && !sf.phone.checkValidity()) bad(sf.phone, "a valid phone number");
    $("[data-sc-err]").textContent = errs.length ? `Please add ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", sf).focus(); return; }
    const first = sf.name.value.trim().split(/\s+/)[0];
    const when = scMode === "tour" ? ` on ${new Date(sf.date.value + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at ${$('[name="slot"]:checked', sf).value}` : "";
    $("[data-sc-done-text]").textContent = scMode === "tour" ? `Thanks, ${first}! Elena Marsh will confirm your in-person tour${when} by email. (Demo — nothing was sent.)` : `Thanks, ${first}! Elena will email ${sf.email.value.trim()} with more information. (Demo — nothing was sent.)`;
    sf.hidden = true; $("[data-sc-done]").hidden = false; $("[data-sc-done]").focus();
  });

  // ======================= Accessibility & settings =======================
  let audio = null;
  function music(on) {
    if (on) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext; const ctx = new AC(), g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
        const oscs = [196, 246.94, 293.66, 392].map((f, i) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = "sine"; o.frequency.value = f; og.gain.value = 0.25 / (i + 1); o.connect(og).connect(g); o.start(); return o; });
        const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.08; lg.gain.value = 0.015; lfo.connect(lg).connect(g.gain); lfo.start();
        g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 2); audio = { ctx, oscs: [...oscs, lfo] };
      } catch (_) { toast("Audio isn't available in this browser."); $('[data-set="music"]').checked = false; }
    } else if (audio) { audio.ctx.close(); audio = null; }
  }
  $$("[data-set]").forEach((c) => c.addEventListener("change", () => {
    const k = c.dataset.set;
    if (k === "contrast") html.classList.toggle("hc", c.checked);
    if (k === "motion") { html.classList.toggle("rm", c.checked); if (c.checked) setAutoRot(false); }
    if (k === "music") music(c.checked);
    store.set(`larkspur-${k}`, c.checked ? "1" : "0");
  }));
  if (store.get("larkspur-contrast") === "1") { $('[data-set="contrast"]').checked = true; html.classList.add("hc"); }
  if (store.get("larkspur-motion") === "1" || osReduce) { $('[data-set="motion"]').checked = true; html.classList.add("rm"); }

  // ======================= Exit / listing =======================
  $("[data-ls-hero]").innerHTML = Art.exterior();
  $("[data-ls-rooms]").innerHTML = ROOMS.map((r) => `<li><button type="button" data-ls-room="${r.id}"><img alt="" src="${cropUrl(r.id, 0)}" style="width:100%;height:100%;object-fit:cover;display:block"><span>${r.name}</span></button></li>`).join("");
  $("[data-exit]").addEventListener("click", () => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); if (guide.on) setMode("self"); setAutoRot(false); });
  const resume = (id) => { $("#tour").scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }); if (id) goRoom(id); setTimeout(() => stage.focus({ preventScroll: true }), reduced() ? 0 : 500); };
  $("[data-resume]").addEventListener("click", (e) => { e.preventDefault(); resume(); });
  $("[data-ls-rooms]").addEventListener("click", (e) => { const b = e.target.closest("[data-ls-room]"); if (b) resume(b.dataset.lsRoom); });

  // ======================= Loading experience =======================
  async function boot() {
    const start = (location.hash.match(/room=([a-z]+)/) || [])[1];
    const first = byId[start] ? start : "living";
    const conn = navigator.connection || {};
    const slow = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
    $("[data-bw]").textContent = conn.effectiveType ? `Connection: ${conn.effectiveType.toUpperCase()}${conn.downlink ? ` (~${conn.downlink} Mbps)` : ""} — ${slow ? "lite mode: auto-rotate off" : "loading full-quality panoramas"}` : "Connection speed unavailable — loading standard panoramas";
    $("[data-loader-text]").textContent = `Loading ${byId[first].name}…`;
    $("[data-loader-preview]").style.backgroundImage = `url("${panoUrl(first)}")`;
    $("[data-loader-bar]").style.width = "35%";
    panoUrl(first);
    $("[data-loader-bar]").style.width = "70%";
    buildStrip();
    await goRoom(first, { instant: true });
    $("[data-loader-bar]").style.width = "100%";
    $("[data-loader]").classList.add("done"); $("[data-loader]").setAttribute("aria-hidden", "true");
    setTimeout(() => { $("[data-loader]").hidden = true; }, 600);
    // prepare the remaining rooms in the background so later transitions are instant
    ROOMS.map((r) => r.id).filter((id) => id !== first).forEach((id, i) => setTimeout(() => panoUrl(id), 120 * (i + 1)));
    if (!slow && !reduced()) setAutoRot(true);
    requestAnimationFrame(loop);
  }
  window.MuseTour = { state: () => ({ room: cur && cur.id, yaw: V.yaw, pitch: V.pitch, zoom: V.zoom, autoRot, guided: guide.on, playing: guide.playing, guideIndex: guide.i, measuring }), measureFt: (a, b) => measureFt(a, b), viewer: V, ready: () => !!cur && !switching };
  boot();
})();
