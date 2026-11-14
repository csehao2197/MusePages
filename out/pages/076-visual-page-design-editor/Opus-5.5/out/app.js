(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => "f" + Math.random().toString(36).slice(2, 9);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } } };
  const KEY = "tessera-doc";
  const stage = $("[data-stage]"), worldEl = $("[data-world]"), guidesEl = $("[data-guides]"), marqEl = $("[data-marquee]"), propsEl = $("[data-props]"), layersEl = $("[data-layers]");
  const SW = ["#FFFFFF", "#F4F1EA", "#111318", "#4F7CFF", "#FF4F8B", "#FFC24B", "#3CCF91", "#8B5CF6", "#FF7A45", "#2B2F3A"];
  const FILLS = ["#4F7CFF", "#FF4F8B", "#FFC24B", "#3CCF91", "#8B5CF6", "#FF7A45"];

  /* ---------- document ---------- */
  const F = (o) => ({ id: uid(), name: "Frame", kind: "frame", x: 0, y: 0, w: 100, h: 100, rot: 0, fill: "#4F7CFF", opacity: 100, radius: 0, bw: 0, bc: "#FFFFFF", text: "", fs: 16, fw: 600, color: "#111318", align: "left", hidden: false, locked: false, board: false, ...o });
  const T = (o) => F({ kind: "text", fill: "transparent", ...o });
  function seed() {
    const L = [
      F({ name: "Desktop", board: true, x: 0, y: 0, w: 1040, h: 680, fill: "#F4F1EA" }),
      F({ name: "Nav", x: 40, y: 32, w: 960, h: 56, fill: "#FFFFFF", radius: 12 }),
      T({ name: "Logo", x: 64, y: 47, w: 140, h: 26, text: "Northwind", fs: 19, fw: 800 }),
      F({ name: "Nav button", x: 868, y: 42, w: 116, h: 36, fill: "#111318", radius: 18 }),
      T({ name: "Nav button label", x: 868, y: 51, w: 116, h: 18, text: "Get access", fs: 14, fw: 700, color: "#FFFFFF", align: "center" }),
      T({ name: "Headline", x: 72, y: 150, w: 540, h: 154, text: "Design boldly.\nShip on Friday.", fs: 64, fw: 800 }),
      T({ name: "Subhead", x: 72, y: 330, w: 420, h: 44, text: "A small studio of frames, color and type. Drag anything, rotate it, line it up.", fs: 18, fw: 500, color: "#4B5060" }),
      F({ name: "CTA", x: 72, y: 420, w: 184, h: 52, fill: "#4F7CFF", radius: 26 }),
      T({ name: "CTA label", x: 72, y: 436, w: 184, h: 20, text: "Start a project", fs: 16, fw: 700, color: "#FFFFFF", align: "center" }),
      F({ name: "Hero tile A", x: 640, y: 140, w: 300, h: 220, fill: "#FF4F8B", radius: 24, rot: -6 }),
      F({ name: "Hero tile B", x: 700, y: 290, w: 260, h: 200, fill: "#FFC24B", radius: 24, rot: 8 }),
      F({ name: "Hero circle", x: 610, y: 380, w: 140, h: 140, fill: "#3CCF91", radius: 70, bw: 6, bc: "#F4F1EA" }),
    ];
    [["48k", "frames placed this week"], ["0.4s", "median time to align"], ["12", "colors in the house palette"]].forEach(([n, c], i) => {
      const x = 72 + i * 304;
      L.push(F({ name: `Stat card ${i + 1}`, x, y: 548, w: 280, h: 92, fill: "#FFFFFF", radius: 16 }), T({ name: `Stat ${i + 1} value`, x: x + 20, y: 562, w: 200, h: 34, text: n, fs: 28, fw: 800 }), T({ name: `Stat ${i + 1} caption`, x: x + 20, y: 602, w: 240, h: 18, text: c, fs: 14, fw: 500, color: "#6B7080" }));
    });
    L.push(F({ name: "Sticky note", x: 1110, y: 60, w: 220, h: 160, fill: "#FFE58A", radius: 4, rot: 4 }), T({ name: "Note text", x: 1130, y: 85, w: 180, h: 110, text: "Try it: drag the pink tile, spin it from the dot above, or press F and draw a frame.", fs: 15, fw: 600, color: "#3A3216", rot: 4 }));
    return { name: "Landing page", frames: Object.fromEntries(L.map((f) => [f.id, f])), order: L.map((f) => f.id) };
  }
  let doc = store.get(KEY, null);
  if (!doc || !doc.frames || !Array.isArray(doc.order)) doc = seed();
  let sel = [], tool = "select", view = { x: 40, y: 40, z: 1 }, snapOn = store.get("tessera-snap", true), editingId = null, editBefore = null, pk = null;

  /* ---------- history + persistence ---------- */
  let past = [], future = [], saveT = 0;
  const snap = () => JSON.stringify(doc);
  const save = () => { if (!saveT) saveT = setTimeout(() => { saveT = 0; store.set(KEY, doc); }, 200); };
  addEventListener("pagehide", () => store.set(KEY, doc));
  function record(before, label) { if (!before || before === snap()) return; past.push({ s: before, label }); if (past.length > 150) past.shift(); future = []; save(); }
  function act(label, fn) { const b = snap(); fn(); record(b, label); renderAll(); }
  function travel(from, to, word) { const e = from.pop(); if (!e) return; to.push({ s: snap(), label: e.label }); doc = JSON.parse(e.s); sel = sel.filter((id) => doc.frames[id]); save(); renderAll(); toast(`${word} ${e.label}`); }
  const undo = () => { finishEdit(); travel(past, future, "Undo"); };
  const redo = () => { finishEdit(); travel(future, past, "Redo"); };

  /* ---------- geometry ---------- */
  const sr = () => stage.getBoundingClientRect();
  const toWorld = (cx, cy) => { const r = sr(); return { x: (cx - r.left - view.x) / view.z, y: (cy - r.top - view.y) / view.z }; };
  const toScreen = (x, y) => ({ x: x * view.z + view.x, y: y * view.z + view.y });
  const rotPt = (px, py, cx, cy, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return { x: cx + (px - cx) * c - (py - cy) * s, y: cy + (px - cx) * s + (py - cy) * c }; };
  const aabb = (f) => { if (!f.rot) return { x: f.x, y: f.y, w: f.w, h: f.h }; const cx = f.x + f.w / 2, cy = f.y + f.h / 2, p = [[f.x, f.y], [f.x + f.w, f.y], [f.x + f.w, f.y + f.h], [f.x, f.y + f.h]].map(([x, y]) => rotPt(x, y, cx, cy, f.rot)), xs = p.map((q) => q.x), ys = p.map((q) => q.y); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
  const bbox = (ids) => { const bs = ids.map((id) => doc.frames[id]).filter(Boolean).map(aabb); if (!bs.length) return null; const x = Math.min(...bs.map((b) => b.x)), y = Math.min(...bs.map((b) => b.y)); return { x, y, w: Math.max(...bs.map((b) => b.x + b.w)) - x, h: Math.max(...bs.map((b) => b.y + b.h)) - y }; };
  const normRot = (r) => { r = Math.round((((r % 360) + 540) % 360) - 180); return r === -180 ? 180 : r; };
  const inside = (f, b) => { const q = aabb(f), cx = q.x + q.w / 2, cy = q.y + q.h / 2; return cx >= b.x && cx <= b.x + b.w && cy >= b.y && cy <= b.y + b.h; };
  const parentBoard = (id) => { const f = doc.frames[id]; if (!f || f.board) return null; const i = doc.order.indexOf(id); for (let j = i - 1; j >= 0; j--) { const b = doc.frames[doc.order[j]]; if (b.board && inside(f, b)) return b; } return null; };
  const children = (bid) => doc.order.filter((id) => parentBoard(id)?.id === bid);
  const withChildren = (ids) => [...new Set(ids.flatMap((id) => (doc.frames[id]?.board ? [id, ...children(id)] : [id])))];
  const boardAt = (p) => { for (let j = doc.order.length - 1; j >= 0; j--) { const b = doc.frames[doc.order[j]]; if (b.board && !b.hidden && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h) return b; } return null; };

  /* ---------- rendering ---------- */
  const els = new Map();
  const selEl = document.createElement("div"), hovEl = document.createElement("div");
  selEl.className = "selbox"; selEl.hidden = true; hovEl.className = "hov"; hovEl.hidden = true;
  worldEl.append(hovEl, selEl);
  function renderView() {
    worldEl.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`;
    worldEl.style.setProperty("--iz", 1 / view.z);
    stage.style.setProperty("--gs", `${20 * view.z}px`); stage.style.setProperty("--gx", `${view.x}px`); stage.style.setProperty("--gy", `${view.y}px`);
    $("[data-zoom='0']").textContent = `${Math.round(view.z * 100)}%`;
    const zs = $("[data-stat-zoom]"); if (zs) zs.textContent = `${Math.round(view.z * 100)}%`;
  }
  function renderFrames() {
    const seen = new Set();
    doc.order.forEach((id, i) => {
      const f = doc.frames[id]; if (!f) return; seen.add(id);
      let el = els.get(id);
      if (!el) { el = document.createElement("div"); el.dataset.id = id; els.set(id, el); worldEl.insertBefore(el, hovEl); }
      el.className = `fr ${f.kind}${f.board ? " board" : ""}${f.locked ? " locked" : ""}${sel.includes(id) ? " issel" : ""}`;
      const st = el.style;
      st.left = `${f.x}px`; st.top = `${f.y}px`; st.width = `${f.w}px`; st.height = `${f.h}px`;
      st.transform = f.rot ? `rotate(${f.rot}deg)` : ""; st.background = f.fill; st.opacity = f.opacity / 100; st.borderRadius = `${f.radius}px`;
      st.boxShadow = f.bw ? `inset 0 0 0 ${f.bw}px ${f.bc}` : ""; st.zIndex = i + 1; st.display = f.hidden ? "none" : "";
      if (el.dataset.editing) return;
      if (f.kind === "text") {
        st.color = f.color; st.fontSize = `${f.fs}px`; st.fontWeight = f.fw; st.textAlign = f.align;
        if (el.__t !== f.text) { el.innerHTML = `<span>${esc(f.text)}</span>`; el.__t = f.text; }
      } else if (f.board) { if (el.__t !== f.name) { el.innerHTML = `<span class="blabel">${esc(f.name)}</span>`; el.__t = f.name; } }
      else if (el.__t !== "") { el.innerHTML = ""; el.__t = ""; }
    });
    els.forEach((el, id) => { if (!seen.has(id)) { el.remove(); els.delete(id); } });
  }
  const place = (el, f) => { const s = el.style; s.left = `${f.x}px`; s.top = `${f.y}px`; s.width = `${f.w}px`; s.height = `${f.h}px`; s.transform = f.rot ? `rotate(${f.rot}deg)` : ""; };
  function renderSel() {
    const live = sel.filter((id) => doc.frames[id] && !doc.frames[id].hidden);
    if (!live.length || editingId) { selEl.hidden = true; return; }
    selEl.hidden = false;
    if (live.length === 1) {
      const f = doc.frames[live[0]], mode = f.locked ? "locked" : "one";
      if (selEl.__mode !== mode) { selEl.__mode = mode; selEl.className = "selbox"; selEl.innerHTML = (mode === "one" ? ["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => `<span class="h" data-h="${h}"></span>`).join("") + `<span class="rot" data-rot title="Rotate (Shift snaps 15°)"></span>` : "") + `<span class="dim-badge" data-badge></span>`; }
      selEl.classList.toggle("thin-h", f.h * view.z < 36); selEl.classList.toggle("thin-w", f.w * view.z < 36);
      place(selEl, f); $("[data-badge]", selEl).textContent = `${Math.round(f.w)} × ${Math.round(f.h)}${f.rot ? `  ${normRot(f.rot)}°` : ""}`;
    } else {
      if (selEl.__mode !== "multi") { selEl.__mode = "multi"; selEl.className = "selbox multi"; selEl.innerHTML = `<span class="dim-badge" data-badge></span>`; }
      const b = bbox(live); place(selEl, { ...b, rot: 0 }); $("[data-badge]", selEl).textContent = `${Math.round(b.w)} × ${Math.round(b.h)}`;
    }
  }
  function updateUndo() { $("[data-undo]").disabled = !past.length; $("[data-redo]").disabled = !future.length; }
  function renderAll() { renderView(); renderFrames(); renderSel(); renderLayers(); renderProps(); updateUndo(); document.title = `${doc.name} — Tessera`; }
  let rq = 0; const live = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; renderFrames(); renderSel(); syncProps(); }); };

  /* ---------- pointer interaction ---------- */
  let drag = null, pinch = null, spaceDown = false;
  const pointers = new Map();
  const nextFill = () => FILLS[doc.order.length % FILLS.length];
  function hideCoach() { $("[data-coach]").classList.add("off"); }
  function candidates(moving) { const v = [], h = []; doc.order.forEach((id) => { const f = doc.frames[id]; if (moving.includes(id) || f.hidden) return; const b = aabb(f); v.push(b.x, b.x + b.w / 2, b.x + b.w); h.push(b.y, b.y + b.h / 2, b.y + b.h); }); return { v, h }; }
  function snapAxis(edges, lines, th) { let best = null; edges.forEach((e) => lines.forEach((l) => { const d = l - e; if (Math.abs(d) <= th && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, l }; })); return best; }
  function showGuides(vs, hs) { guidesEl.innerHTML = vs.map((x) => `<i class="v" style="left:${toScreen(x, 0).x}px"></i>`).join("") + hs.map((y) => `<i class="hz" style="top:${toScreen(0, y).y}px"></i>`).join(""); }

  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[contenteditable]")) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      if (drag?.before) { doc = JSON.parse(drag.before); renderAll(); }
      drag = null; marqEl.hidden = true; guidesEl.innerHTML = "";
      const [a, b] = [...pointers.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: view.z, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, vx: view.x, vy: view.y }; return;
    }
    if (pointers.size > 2 || e.button === 2) return;
    if (editingId) finishEdit();
    stage.focus({ preventScroll: true }); hideCoach(); hovEl.hidden = true;
    try { stage.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    const w = toWorld(e.clientX, e.clientY);
    if (e.button === 1 || spaceDown || tool === "hand") { drag = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; stage.classList.add("panning"); return; }
    const h = e.target.closest("[data-h]"), r = e.target.closest("[data-rot]");
    if ((h || r) && sel.length === 1) { const f = doc.frames[sel[0]]; drag = { kind: r ? "rotate" : "resize", h: h?.dataset.h, f0: { ...f }, before: snap() }; return; }
    if (tool === "text") {
      const before = snap(), b = boardAt(w), f = T({ name: `Text ${doc.order.length + 1}`, x: Math.round(w.x), y: Math.round(w.y - 14), w: 220, h: 29, text: "Type something", fs: 24, fw: 700, color: b ? "#111318" : "#ECEDF0" });
      doc.frames[f.id] = f; doc.order.push(f.id); sel = [f.id]; record(before, "add text"); setTool("select"); renderAll(); keepFocus = true; startEdit(f.id); return;
    }
    if (tool === "frame") { const before = snap(), f = F({ name: `Frame ${doc.order.length + 1}`, x: Math.round(w.x), y: Math.round(w.y), w: 0, h: 0, fill: nextFill(), radius: 8 }); doc.frames[f.id] = f; doc.order.push(f.id); sel = [f.id]; drag = { kind: "create", f, x0: w.x, y0: w.y, before }; renderAll(); return; }
    const hit = e.target.closest(".fr");
    if (hit) {
      const id = hit.dataset.id;
      if (e.shiftKey) { sel = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]; renderAll(); if (!sel.includes(id)) return; }
      else if (!sel.includes(id)) { sel = [id]; renderAll(); }
      const ids = withChildren(sel).filter((x) => !doc.frames[x].locked);
      if (!ids.length) { toast("This frame is locked. Unlock it in the layer list"); return; }
      drag = { kind: "move", x0: w.x, y0: w.y, ids, orig: Object.fromEntries(ids.map((x) => [x, { x: doc.frames[x].x, y: doc.frames[x].y }])), before: snap(), moved: false, bb: bbox(sel), cand: candidates(ids) };
      return;
    }
    if (!e.shiftKey && sel.length) { sel = []; renderAll(); }
    const r0 = sr(); drag = { kind: "marquee", base: sel.slice(), sx: e.clientX - r0.left, sy: e.clientY - r0.top };
  });

  stage.addEventListener("pointermove", (e) => {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size === 2) {
      const [a, b] = [...pointers.values()], d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, r = sr();
      const wx = (pinch.mx - r.left - pinch.vx) / pinch.z, wy = (pinch.my - r.top - pinch.vy) / pinch.z, z = clamp((pinch.z * d) / pinch.d, 0.1, 8);
      view = { z, x: mx - r.left - wx * z, y: my - r.top - wy * z }; renderView(); return;
    }
    if (!drag) { hover(e); return; }
    const w = toWorld(e.clientX, e.clientY);
    if (drag.kind === "pan") { view.x = drag.vx + e.clientX - drag.sx; view.y = drag.vy + e.clientY - drag.sy; renderView(); return; }
    if (drag.kind === "create") {
      const f = drag.f; let ww = Math.abs(w.x - drag.x0), hh = Math.abs(w.y - drag.y0);
      if (e.shiftKey) ww = hh = Math.max(ww, hh);
      Object.assign(f, { x: Math.round(w.x < drag.x0 ? drag.x0 - ww : drag.x0), y: Math.round(w.y < drag.y0 ? drag.y0 - hh : drag.y0), w: Math.round(ww), h: Math.round(hh) }); live(); return;
    }
    if (drag.kind === "move") {
      let dx = w.x - drag.x0, dy = w.y - drag.y0;
      if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
      if (!drag.moved && Math.hypot(dx, dy) * view.z < 3) return;
      drag.moved = true;
      const gv = [], gh = [];
      if (snapOn && !e.altKey && drag.bb) {
        const bb = drag.bb, th = 6 / view.z;
        const sx = snapAxis([bb.x + dx, bb.x + dx + bb.w / 2, bb.x + dx + bb.w], drag.cand.v, th), sy = snapAxis([bb.y + dy, bb.y + dy + bb.h / 2, bb.y + dy + bb.h], drag.cand.h, th);
        if (sx && !(e.shiftKey && dx === 0)) { dx += sx.d; gv.push(sx.l); }
        if (sy && !(e.shiftKey && dy === 0)) { dy += sy.d; gh.push(sy.l); }
      }
      dx = Math.round(dx); dy = Math.round(dy);
      drag.ids.forEach((id) => { const o = drag.orig[id], f = doc.frames[id]; f.x = o.x + dx; f.y = o.y + dy; });
      showGuides(gv, gh); live(); return;
    }
    if (drag.kind === "rotate") {
      const f = doc.frames[drag.f0.id], cx = f.x + f.w / 2, cy = f.y + f.h / 2;
      let a = (Math.atan2(w.y - cy, w.x - cx) * 180) / Math.PI + 90; if (e.shiftKey) a = Math.round(a / 15) * 15;
      f.rot = normRot(a); live(); return;
    }
    if (drag.kind === "resize") {
      const s0 = drag.f0, f = doc.frames[s0.id], hx = drag.h.includes("w") ? -1 : drag.h.includes("e") ? 1 : 0, hy = drag.h.startsWith("n") ? -1 : drag.h.startsWith("s") ? 1 : 0;
      const cx0 = s0.x + s0.w / 2, cy0 = s0.y + s0.h / 2, A = rotPt(cx0 - (hx * s0.w) / 2, cy0 - (hy * s0.h) / 2, cx0, cy0, s0.rot), L = rotPt(w.x, w.y, A.x, A.y, -s0.rot);
      let nw = hx ? Math.max(1, (L.x - A.x) * hx) : s0.w, nh = hy ? Math.max(1, (L.y - A.y) * hy) : s0.h;
      if (e.shiftKey && hx && hy) { const k = Math.max(nw / s0.w, nh / s0.h); nw = s0.w * k; nh = s0.h * k; }
      nw = Math.round(nw); nh = Math.round(nh);
      const C = rotPt(A.x + (hx ? (hx * nw) / 2 : 0), A.y + (hy ? (hy * nh) / 2 : 0), A.x, A.y, s0.rot);
      Object.assign(f, { w: nw, h: nh, x: Math.round(hx ? C.x - nw / 2 : s0.x + (C.x - cx0)), y: Math.round(hy ? C.y - nh / 2 : s0.y + (C.y - cy0)) });
      if (!hx) f.x = Math.round(C.x - nw / 2); if (!hy) f.y = Math.round(C.y - nh / 2);
      live(); return;
    }
    if (drag.kind === "marquee") {
      const r = sr(), x1 = e.clientX - r.left, y1 = e.clientY - r.top, L = Math.min(drag.sx, x1), Tp = Math.min(drag.sy, y1), W = Math.abs(x1 - drag.sx), H = Math.abs(y1 - drag.sy);
      if (W + H < 4) return;
      marqEl.hidden = false; Object.assign(marqEl.style, { left: `${L}px`, top: `${Tp}px`, width: `${W}px`, height: `${H}px` });
      const a = toWorld(L + r.left, Tp + r.top), b = toWorld(L + W + r.left, Tp + H + r.top);
      const hits = doc.order.filter((id) => { const f = doc.frames[id]; if (f.hidden || f.locked) return false; const q = aabb(f); return f.board ? q.x >= a.x && q.y >= a.y && q.x + q.w <= b.x && q.y + q.h <= b.y : q.x < b.x && q.x + q.w > a.x && q.y < b.y && q.y + q.h > a.y; });
      sel = [...new Set([...drag.base, ...hits])]; renderFrames(); renderSel();
    }
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pinch) { if (pointers.size < 2) pinch = null; return; }
    if (!drag) return;
    const d = drag; drag = null; stage.classList.remove("panning"); guidesEl.innerHTML = "";
    if (d.kind === "create") { const f = d.f; if (f.w < 4 && f.h < 4) Object.assign(f, { w: 200, h: 140 }); f.w = Math.max(1, f.w); f.h = Math.max(1, f.h); record(d.before, "draw frame"); setTool("select"); renderAll(); return; }
    if (d.kind === "move" && d.moved) { record(d.before, "move"); renderAll(); return; }
    if (d.kind === "resize" || d.kind === "rotate") { record(d.before, d.kind); renderAll(); return; }
    if (d.kind === "marquee") { marqEl.hidden = true; renderAll(); }
  }
  let keepFocus = false;
  stage.addEventListener("mousedown", (e) => { if (keepFocus) { e.preventDefault(); keepFocus = false; } });
  stage.addEventListener("pointerup", endPointer);
  stage.addEventListener("pointercancel", endPointer);
  function hover(e) {
    const hit = e.target.closest?.(".fr"), id = hit?.dataset.id;
    if (!id || sel.includes(id) || tool !== "select" || spaceDown) { hovEl.hidden = true; return; }
    const f = doc.frames[id]; hovEl.hidden = false; place(hovEl, f); hovEl.style.borderRadius = `${f.radius}px`;
  }
  stage.addEventListener("pointerleave", () => (hovEl.hidden = true));
  stage.addEventListener("dblclick", (e) => { const hit = document.elementFromPoint(e.clientX, e.clientY)?.closest(".fr"); if (hit && doc.frames[hit.dataset.id]?.kind === "text") startEdit(hit.dataset.id); });
  stage.addEventListener("wheel", (e) => {
    e.preventDefault(); hideCoach();
    const k = e.deltaMode === 1 ? 16 : 1;
    if (e.shiftKey && !e.ctrlKey) { view.x -= (e.deltaY || e.deltaX) * k; renderView(); return; }
    zoomAt(view.z * Math.exp(-e.deltaY * k * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX, e.clientY);
  }, { passive: false });
  function zoomAt(z, cx, cy) { const r = sr(); z = clamp(z, 0.1, 8); cx ??= r.left + r.width / 2; cy ??= r.top + r.height / 2; const w = toWorld(cx, cy); view.z = z; view.x = cx - r.left - w.x * z; view.y = cy - r.top - w.y * z; renderView(); renderSel(); }
  function fit(ids = doc.order.filter((id) => !doc.frames[id].hidden)) { const b = bbox(ids), r = sr(); if (!b || !r.width) return; const pad = r.width < 600 ? 24 : 64, z = clamp(Math.min((r.width - pad * 2) / b.w, (r.height - pad * 2) / b.h), 0.1, 4); view = { z, x: (r.width - b.w * z) / 2 - b.x * z, y: (r.height - b.h * z) / 2 - b.y * z }; renderView(); renderSel(); }
  $$("[data-zoom]").forEach((b) => b.addEventListener("click", () => { const d = +b.dataset.zoom; zoomAt(d === 0 ? 1 : view.z * (d > 0 ? 1.25 : 0.8)); }));
  $("[data-fit]").addEventListener("click", () => fit());

  /* ---------- text editing ---------- */
  function startEdit(id) {
    const f = doc.frames[id]; if (!f || f.kind !== "text" || f.locked) return;
    editingId = id; editBefore = snap(); sel = [id]; renderAll();
    const el = els.get(id), sp = el.firstElementChild; el.dataset.editing = "1";
    sp.contentEditable = "plaintext-only"; if (sp.contentEditable !== "plaintext-only") sp.contentEditable = "true";
    sp.focus(); const rg = document.createRange(); rg.selectNodeContents(sp); const s = getSelection(); s.removeAllRanges(); s.addRange(rg);
    sp.addEventListener("blur", finishEdit, { once: true });
    sp.addEventListener("input", () => { f.h = Math.max(f.h, Math.ceil(sp.scrollHeight)); el.style.height = `${f.h}px`; });
  }
  function finishEdit() {
    const id = editingId; if (!id) return; editingId = null;
    const el = els.get(id), f = doc.frames[id]; if (!el || !f) return;
    const sp = el.firstElementChild; f.text = sp.innerText.replace(/\n$/, "") || "Text"; sp.removeAttribute("contenteditable"); delete el.dataset.editing; el.__t = null;
    renderFrames(); fitText(f); record(editBefore, "edit text"); renderAll(); stage.focus({ preventScroll: true });
  }
  function fitText(f) { if (f.kind !== "text") return; const el = els.get(f.id); renderFrames(); const sp = el?.firstElementChild; if (!sp) return; el.style.height = "auto"; const h = Math.ceil(sp.getBoundingClientRect().height / view.z); el.style.height = `${f.h}px`; if (h > 0) f.h = h; }
  worldEl.addEventListener("keydown", (e) => { if (e.target.isContentEditable && (e.key === "Escape" || (e.key === "Enter" && (e.ctrlKey || e.metaKey)))) { e.preventDefault(); e.stopPropagation(); e.target.blur(); } });

  /* ---------- operations ---------- */
  function setTool(t) { tool = t; $$("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tool === t)); stage.classList.remove("t-select", "t-frame", "t-text", "t-hand"); stage.classList.add(`t-${t}`); hovEl.hidden = true; }
  function addFrame() {
    const r = sr(), c = toWorld(r.left + r.width / 2, r.top + r.height / 2), n = doc.order.length, off = (n % 6) * 16;
    const f = F({ name: `Frame ${n + 1}`, x: Math.round(c.x - 100 + off), y: Math.round(c.y - 70 + off), w: 200, h: 140, fill: nextFill(), radius: 8 });
    act("add frame", () => { doc.frames[f.id] = f; doc.order.push(f.id); sel = [f.id]; }); toast(`Added ${f.name}`);
  }
  function del() {
    const ids = withChildren(sel).filter((id) => !doc.frames[id].locked); if (!ids.length) return toast("Locked frames can't be deleted");
    act("delete", () => { ids.forEach((id) => delete doc.frames[id]); doc.order = doc.order.filter((id) => doc.frames[id]); sel = []; }); toast(`Deleted ${ids.length} ${ids.length > 1 ? "frames" : "frame"}`);
  }
  function duplicate() {
    if (!sel.length) return; const ids = withChildren(sel), b = sel.map((id) => doc.frames[id]).find((f) => f.board), dx = b ? b.w + 80 : 20, dy = b ? 0 : 20, map = {};
    act("duplicate", () => { doc.order.filter((id) => ids.includes(id)).forEach((id) => { const c = { ...doc.frames[id], id: uid(), x: doc.frames[id].x + dx, y: doc.frames[id].y + dy, locked: false, name: `${doc.frames[id].name} copy` }; map[id] = c.id; doc.frames[c.id] = c; doc.order.push(c.id); }); sel = sel.map((id) => map[id]); });
  }
  function reorder(ids, dir, extreme) {
    if (!ids.length) return;
    act(dir > 0 ? "bring forward" : "send backward", () => {
      let o = doc.order.slice(); const set = o.filter((id) => ids.includes(id));
      if (extreme) { o = o.filter((id) => !ids.includes(id)); o = dir > 0 ? [...o, ...set] : [...set, ...o]; }
      else (dir > 0 ? set.slice().reverse() : set).forEach((id) => { const i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length || ids.includes(o[j])) return; [o[i], o[j]] = [o[j], o[i]]; });
      doc.order = o;
    });
  }
  function toggle(ids, key, label) { if (!ids.length) return; const to = !ids.every((id) => doc.frames[id][key]); act(label, () => ids.forEach((id) => (doc.frames[id][key] = to))); if (key === "hidden" && to) { sel = sel.filter((id) => !ids.includes(id)); renderAll(); } return to; }
  const ALIGN = [["left", "a-left", "Align left"], ["hcenter", "a-hcenter", "Align horizontal centers"], ["right", "a-right", "Align right"], ["top", "a-top", "Align top"], ["vcenter", "a-vcenter", "Align vertical centers"], ["bottom", "a-bottom", "Align bottom"]];
  function align(mode) {
    const ids = sel.filter((id) => !doc.frames[id].locked); let b;
    if (sel.length === 1) { const p = parentBoard(sel[0]); if (!p) return; b = aabb(p); } else b = bbox(sel);
    if (!b || !ids.length) return;
    act(ALIGN.find((a) => a[0] === mode)[2].toLowerCase(), () => withChildren(ids).length && ids.forEach((id) => {
      const f = doc.frames[id], q = aabb(f);
      const dx = { left: b.x - q.x, hcenter: b.x + b.w / 2 - (q.x + q.w / 2), right: b.x + b.w - (q.x + q.w) }[mode] ?? 0, dy = { top: b.y - q.y, vcenter: b.y + b.h / 2 - (q.y + q.h / 2), bottom: b.y + b.h - (q.y + q.h) }[mode] ?? 0;
      (f.board ? withChildren([id]) : [id]).forEach((x) => { doc.frames[x].x = Math.round(doc.frames[x].x + dx); doc.frames[x].y = Math.round(doc.frames[x].y + dy); });
    }));
  }
  function distribute(axis) {
    if (sel.length < 3) return;
    const items = sel.map((id) => [id, aabb(doc.frames[id])]).sort((a, b) => (axis === "h" ? a[1].x - b[1].x : a[1].y - b[1].y));
    const first = items[0][1], last = items[items.length - 1][1], total = items.reduce((t, [, q]) => t + (axis === "h" ? q.w : q.h), 0);
    const gap = ((axis === "h" ? last.x + last.w - first.x : last.y + last.h - first.y) - total) / (items.length - 1);
    act(axis === "h" ? "distribute horizontally" : "distribute vertically", () => { let pos = axis === "h" ? first.x : first.y; items.forEach(([id, q]) => { const f = doc.frames[id]; if (axis === "h") { f.x = Math.round(f.x + pos - q.x); pos += q.w + gap; } else { f.y = Math.round(f.y + pos - q.y); pos += q.h + gap; } }); });
  }

  /* ---------- keyboard ---------- */
  const editable = () => { const a = document.activeElement; return !!a && (a.matches("textarea, select, input:not([type=checkbox]):not([type=button])") || a.isContentEditable); };
  document.addEventListener("keydown", (e) => {
    if (editable() || $("[data-keysdlg]").open) return;
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (e.key === " ") { if (!spaceDown) { spaceDown = true; stage.classList.add("pan"); } if (!e.target.closest?.("button, li")) e.preventDefault(); return; }
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === "y") { e.preventDefault(); redo(); return; }
    if (mod && k === "a") { e.preventDefault(); sel = doc.order.filter((id) => !doc.frames[id].hidden && !doc.frames[id].locked); renderAll(); return; }
    if (mod && k === "d") { e.preventDefault(); duplicate(); return; }
    if (mod && k === "0") { e.preventDefault(); zoomAt(1); return; }
    if (mod) return;
    if (e.key === "?") { openKeys(); return; }
    if (e.key === "!" || (e.shiftKey && e.code === "Digit1")) { fit(); return; }
    const tools = { v: "select", f: "frame", t: "text", h: "hand" };
    if (tools[k] && !e.shiftKey && !e.altKey) { setTool(tools[k]); return; }
    if (k === "delete" || k === "backspace") { if (sel.length) { e.preventDefault(); del(); } return; }
    if (k === "escape") { if (sel.length) { sel = []; renderAll(); } setTool("select"); return; }
    if (k === "enter" && sel.length === 1 && doc.frames[sel[0]].kind === "text" && !e.target.closest?.("button, li")) { e.preventDefault(); startEdit(sel[0]); return; }
    if (k === "]" || k === "[") { e.preventDefault(); reorder(sel, k === "]" ? 1 : -1, e.shiftKey || e.altKey); return; }
    if (k === "=" || k === "+") { zoomAt(view.z * 1.25); return; }
    if (k === "-") { zoomAt(view.z * 0.8); return; }
    const ar = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] }[k];
    if (ar && sel.length && !e.target.closest?.("li[data-layer]")) { e.preventDefault(); const n = e.shiftKey ? 10 : 1, ids = withChildren(sel).filter((id) => !doc.frames[id].locked); act("nudge", () => ids.forEach((id) => { doc.frames[id].x += ar[0] * n; doc.frames[id].y += ar[1] * n; })); }
  });
  document.addEventListener("keyup", (e) => { if (e.key === " ") { spaceDown = false; stage.classList.remove("pan"); } });
  addEventListener("blur", () => { spaceDown = false; stage.classList.remove("pan"); });

  /* ---------- layer panel ---------- */
  const kindIcon = (f) => (f.board ? "i-board" : f.kind === "text" ? "i-type" : "i-square");
  function renderLayers() {
    if (layersEl.querySelector(".nm input")) return;
    const focusId = document.activeElement?.closest?.("li[data-layer]")?.dataset.layer;
    $("[data-lcount]").textContent = doc.order.length;
    layersEl.innerHTML = doc.order.slice().reverse().map((id) => {
      const f = doc.frames[id], s = sel.includes(id), ind = f.board ? 0 : parentBoard(id) ? 1 : 0;
      return `<li data-layer="${id}" tabindex="0" draggable="true" class="${s ? "sel" : ""}${f.hidden ? " hid" : ""}" style="--ind:${ind}" aria-label="${esc(f.name)}${s ? ", selected" : ""}${f.hidden ? ", hidden" : ""}${f.locked ? ", locked" : ""}">
        <span class="grip" aria-hidden="true">${icon("i-grip")}</span><span class="kind" aria-hidden="true">${icon(kindIcon(f))}</span><span class="nm" data-nm>${esc(f.name)}</span>
        <button type="button" class="lb${f.hidden ? " on" : ""}" data-vis="${id}" aria-label="${f.hidden ? "Show" : "Hide"} ${esc(f.name)}" aria-pressed="${f.hidden}">${icon(f.hidden ? "i-eye-off" : "i-eye")}</button>
        <button type="button" class="lb${f.locked ? " on" : ""}" data-lock="${id}" aria-label="${f.locked ? "Unlock" : "Lock"} ${esc(f.name)}" aria-pressed="${f.locked}">${icon(f.locked ? "i-lock" : "i-unlock")}</button></li>`;
    }).join("");
    if (focusId) layersEl.querySelector(`[data-layer="${focusId}"]`)?.focus();
  }
  function rename(li) {
    const id = li.dataset.layer, f = doc.frames[id], nm = li.querySelector("[data-nm]");
    nm.innerHTML = `<input value="${esc(f.name)}" maxlength="60" aria-label="Layer name">`; const inp = nm.firstElementChild; inp.focus(); inp.select();
    let done = false; const finish = (ok) => { if (done) return; done = true; const v = inp.value.trim(); nm.innerHTML = ""; if (ok && v && v !== f.name) act("rename", () => (f.name = v)); else renderAll(); li.isConnected && layersEl.querySelector(`[data-layer="${id}"]`)?.focus(); };
    inp.addEventListener("keydown", (e) => { e.stopPropagation(); if (e.key === "Enter") finish(true); if (e.key === "Escape") finish(false); });
    inp.addEventListener("blur", () => finish(true));
  }
  layersEl.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (b) { if (b.dataset.vis) toggle([b.dataset.vis], "hidden", "visibility"); else if (b.dataset.lock) toggle([b.dataset.lock], "locked", "lock"); return; }
    const li = e.target.closest("li[data-layer]"); if (!li || e.target.closest("input")) return;
    const id = li.dataset.layer; sel = e.shiftKey ? (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]) : [id];
    /* update rows in place so a double-click on the same row still reaches it */
    renderFrames(); renderSel(); renderProps();
    $$("li[data-layer]", layersEl).forEach((row) => { const f = doc.frames[row.dataset.layer], s = sel.includes(row.dataset.layer); row.classList.toggle("sel", s); row.setAttribute("aria-label", `${f.name}${s ? ", selected" : ""}${f.hidden ? ", hidden" : ""}${f.locked ? ", locked" : ""}`); });
  });
  layersEl.addEventListener("dblclick", (e) => { const li = e.target.closest("li[data-layer]"); if (li && !e.target.closest("button")) rename(li); });
  layersEl.addEventListener("keydown", (e) => {
    const li = e.target.closest("li[data-layer]"); if (!li || e.target !== li) return;
    const id = li.dataset.layer;
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); li.click(); }
    else if (e.key === "F2") { e.preventDefault(); rename(li); }
    else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); e.stopPropagation(); reorder([id], e.key === "ArrowUp" ? 1 : -1, false); layersEl.querySelector(`[data-layer="${id}"]`)?.focus(); }
    else if (e.key === "ArrowUp" || e.key === "ArrowDown") { e.preventDefault(); (e.key === "ArrowUp" ? li.previousElementSibling : li.nextElementSibling)?.focus(); }
  });
  let dragId = null;
  layersEl.addEventListener("dragstart", (e) => { const li = e.target.closest("li[data-layer]"); if (!li) return; dragId = li.dataset.layer; li.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", dragId); });
  const clearDrop = () => $$(".drop-before, .drop-after", layersEl).forEach((x) => x.classList.remove("drop-before", "drop-after"));
  layersEl.addEventListener("dragover", (e) => { const li = e.target.closest("li[data-layer]"); if (!li || !dragId) return; e.preventDefault(); clearDrop(); const r = li.getBoundingClientRect(); li.classList.add(e.clientY < r.top + r.height / 2 ? "drop-before" : "drop-after"); });
  layersEl.addEventListener("dragleave", (e) => { if (!layersEl.contains(e.relatedTarget)) clearDrop(); });
  layersEl.addEventListener("dragend", () => { dragId = null; clearDrop(); $$(".dragging", layersEl).forEach((x) => x.classList.remove("dragging")); });
  layersEl.addEventListener("drop", (e) => {
    const li = e.target.closest("li[data-layer]"); if (!li || !dragId) return; e.preventDefault();
    const target = li.dataset.layer, above = li.classList.contains("drop-before"), moving = dragId; clearDrop(); dragId = null;
    if (target === moving) return;
    act("reorder", () => { const o = doc.order.filter((id) => id !== moving), i = o.indexOf(target); o.splice(above ? i + 1 : i, 0, moving); doc.order = o; sel = [moving]; });
  });

  /* ---------- color helpers ---------- */
  const hexOk = (v) => /^#?[0-9a-f]{6}$/i.test(v) || /^#?[0-9a-f]{3}$/i.test(v);
  const normHex = (v) => { v = v.replace("#", ""); if (v.length === 3) v = v.split("").map((c) => c + c).join(""); return `#${v.toUpperCase()}`; };
  function toHsv(hex) { if (!hexOk(hex || "")) hex = "#FFFFFF"; const n = parseInt(normHex(hex).slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return { h, s: mx ? d / mx : 0, v: mx }; }
  function fromHsv(h, s, v) { const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return `#${[f(5), f(3), f(1)].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`; }

  /* ---------- properties panel ---------- */
  const common = (k) => { const vs = [...new Set(sel.map((id) => doc.frames[id]?.[k]))]; return vs.length === 1 ? vs[0] : null; };
  const disp = (k, v) => (v == null ? "" : k === "rot" ? normRot(v) : Math.round(v));
  const num = (k, lab, aria, unit = "") => `<label class="num"><span class="lab" data-scrub="${k}" aria-hidden="true" title="Drag to adjust">${lab}</span><input data-k="${k}" inputmode="decimal" spellcheck="false" aria-label="${aria}" value="${disp(k, common(k))}"${common(k) == null ? ' placeholder="Mixed"' : ""}>${unit ? `<span class="unit">${unit}</span>` : ""}</label>`;
  const colorRow = (k, label) => { const v = common(k), shown = v == null ? "" : v === "transparent" ? "None" : v; return `<div class="fillrow"><button type="button" class="chip" data-pick="${k}" aria-label="${label} color picker" aria-expanded="${pk?.key === k}"><span data-chip="${k}" style="background:${v && v !== "transparent" ? v : "transparent"}"></span></button><input data-hex="${k}" value="${esc(shown)}" placeholder="Mixed" spellcheck="false" aria-label="${label} hex value"></div>${pk?.key === k ? pickerHTML() : ""}`; };
  const pickerHTML = () => `<div class="picker" data-picker><div class="sv" data-sv tabindex="0" role="slider" aria-label="Saturation and brightness" aria-valuetext="${Math.round(pk.s * 100)}% saturation, ${Math.round(pk.v * 100)}% brightness" style="--hue:${pk.h}"><span class="knob" style="left:${pk.s * 100}%;top:${(1 - pk.v) * 100}%"></span></div><input type="range" class="hue" min="0" max="360" step="1" value="${Math.round(pk.h)}" data-hue aria-label="Hue"><div class="sw">${SW.map((c) => `<button type="button" data-swatch="${c}" style="background:${c}" aria-label="Use ${c}"></button>`).join("")}</div></div>`;
  function propsHTML() {
    const n = doc.order.length;
    if (!sel.length) return `<div class="sec"><h3>Canvas</h3><p class="empty">Select a frame to edit it, or press <kbd>F</kbd> and drag to draw one.</p><dl class="stats"><dt>Frames</dt><dd data-stat-frames>${n}</dd><dt>Boards</dt><dd>${doc.order.filter((id) => doc.frames[id].board).length}</dd><dt>Zoom</dt><dd data-stat-zoom>${Math.round(view.z * 100)}%</dd></dl></div>
      <div class="sec"><h3>Options</h3><label class="check"><input type="checkbox" data-snap ${snapOn ? "checked" : ""}> Snap to other frames while moving</label><div class="rowbtns" style="margin-top:8px"><button class="btn" type="button" data-fitbtn>${icon("i-fit")}Zoom to fit</button><button class="btn danger" type="button" data-reset>${icon("i-reset")}Reset demo</button></div></div>`;
    const one = sel.length === 1 ? doc.frames[sel[0]] : null, alignOff = !(sel.length > 1 || (one && parentBoard(one.id)));
    let h = `<div class="sec"><p class="sel-name">${one ? `${icon(kindIcon(one))}<span data-selname>${esc(one.name)}</span><small>${one.board ? "Board" : one.kind === "text" ? "Text" : "Frame"}${one.locked ? " · Locked" : ""}</small>` : `${sel.length} frames <small>Multiple selection</small>`}</p></div>`;
    h += `<div class="sec"><h3>Align${one && !alignOff ? ` <span class="dim" style="text-transform:none;letter-spacing:0">to ${esc(parentBoard(one.id).name)}</span>` : ""}</h3><div class="align">${ALIGN.map(([m, ic, l]) => `<button type="button" data-align="${m}" aria-label="${l}" title="${l}" ${alignOff ? "disabled" : ""}>${icon(ic)}</button>`).join("")}<button type="button" data-dist="h" aria-label="Distribute horizontally" title="Distribute horizontally (3+)" ${sel.length < 3 ? "disabled" : ""}>${icon("a-dh")}</button><button type="button" data-dist="v" aria-label="Distribute vertically" title="Distribute vertically (3+)" ${sel.length < 3 ? "disabled" : ""}>${icon("a-dv")}</button></div></div>`;
    if (one) h += `<div class="sec"><h3>Position &amp; size</h3><div class="g2">${num("x", "X", "X position")}${num("y", "Y", "Y position")}${num("w", "W", "Width")}${num("h", "H", "Height")}${num("rot", "R", "Rotation", "°")}${num("radius", "Rd", "Corner radius")}</div></div>`;
    const op = common("opacity");
    h += `<div class="sec"><h3>Opacity</h3><div class="opa"><input type="range" min="0" max="100" step="1" value="${op ?? 100}" data-opacity aria-label="Opacity slider" style="--p:${op ?? 100}%">${num("opacity", "%", "Opacity percent")}</div></div>`;
    h += `<div class="sec"><h3>${one?.kind === "text" ? "Background" : "Fill"}</h3>${colorRow("fill", one?.kind === "text" ? "Background" : "Fill")}</div>`;
    if (one?.kind === "text") h += `<div class="sec"><h3>Text</h3><textarea class="txt" data-k="text" aria-label="Text content">${esc(one.text)}</textarea><div class="g2" style="margin:8px 0">${num("fs", "Fs", "Font size", "px")}<label class="num"><span class="lab" aria-hidden="true">Wt</span><select data-k="fw" aria-label="Font weight" style="flex:1;background:transparent;border:0;height:100%;outline:none">${[400, 500, 600, 700, 800].map((w) => `<option value="${w}" ${+one.fw === w ? "selected" : ""} style="background:#17181c">${w}</option>`).join("")}</select></label></div><div class="align" style="grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:8px" role="group" aria-label="Text alignment">${["left", "center", "right"].map((a) => `<button type="button" data-talign="${a}" aria-pressed="${one.align === a}" aria-label="Align text ${a}" style="${one.align === a ? "color:var(--text);background:var(--field-h)" : ""}">${icon(a === "left" ? "a-left" : a === "center" ? "a-hcenter" : "a-right")}</button>`).join("")}</div>${colorRow("color", "Text")}</div>`;
    else if (one) h += `<div class="sec"><h3>Border</h3><div class="g2" style="margin-bottom:8px">${num("bw", "B", "Border width", "px")}</div>${colorRow("bc", "Border")}</div>`;
    const locked = sel.every((id) => doc.frames[id].locked);
    h += `<div class="sec"><h3>Layer</h3><div class="rowbtns"><button class="btn" type="button" data-act="fwd">${icon("i-forward")}Forward</button><button class="btn" type="button" data-act="back">${icon("i-backward")}Backward</button><button class="btn" type="button" data-act="dup">${icon("i-copy")}Duplicate</button><button class="btn" type="button" data-act="lock">${icon(locked ? "i-unlock" : "i-lock")}${locked ? "Unlock" : "Lock"}</button><button class="btn danger" type="button" data-act="del">${icon("i-trash")}Delete</button></div></div>`;
    return h;
  }
  function renderProps() {
    const a = document.activeElement, keep = propsEl.contains(a) ? (a.dataset.k ? `[data-k="${a.dataset.k}"]` : a.dataset.hex ? `[data-hex="${a.dataset.hex}"]` : null) : null;
    if (pk && !(sel.length && common(pk.key) !== undefined)) pk = null;
    propsEl.innerHTML = propsHTML();
    if (keep) propsEl.querySelector(keep)?.focus();
  }
  function syncProps() {
    $$("[data-k]", propsEl).forEach((inp) => { if (inp === document.activeElement || inp.tagName !== "INPUT") return; const v = common(inp.dataset.k); inp.value = disp(inp.dataset.k, v); });
    const op = common("opacity"), r = $("[data-opacity]", propsEl); if (r && r !== document.activeElement) { r.value = op ?? 100; r.style.setProperty("--p", `${op ?? 100}%`); }
    const nm = $("[data-selname]", propsEl); if (nm && sel.length === 1) nm.textContent = doc.frames[sel[0]].name;
  }
  function setProp(k, raw) {
    if (!sel.length) return;
    const isNum = ["x", "y", "w", "h", "rot", "radius", "opacity", "bw", "fs"].includes(k);
    let v = raw;
    if (isNum) { v = parseFloat(String(raw).replace(",", ".")); if (!isFinite(v)) { syncProps(); return; } v = k === "rot" ? normRot(v) : Math.round(v); if (k === "opacity") v = clamp(v, 0, 100); if (["w", "h", "fs"].includes(k)) v = Math.max(1, v); if (["radius", "bw"].includes(k)) v = Math.max(0, v); }
    if (k === "fw") v = +v;
    act(`set ${k === "rot" ? "rotation" : k === "fs" ? "font size" : k}`, () => sel.forEach((id) => { const f = doc.frames[id]; if (k === "x" || k === "y") { const d = v - f[k]; (f.board ? withChildren([id]) : [id]).forEach((x) => (doc.frames[x][k] += d)); } else f[k] = v; if (f.kind === "text" && ["text", "fs", "fw", "w"].includes(k)) fitText(f); }));
  }
  function setColor(k, hex, label = true) { const v = hex === "transparent" ? hex : normHex(hex); if (label) act(`set ${k === "bc" ? "border color" : k === "color" ? "text color" : "fill"}`, () => sel.forEach((id) => (doc.frames[id][k] = v))); else { sel.forEach((id) => (doc.frames[id][k] = v)); renderFrames(); } const hx = $(`[data-hex="${k}"]`, propsEl), ch = $(`[data-chip="${k}"]`, propsEl); if (hx && hx !== document.activeElement) hx.value = v === "transparent" ? "None" : v; if (ch) ch.style.background = v; }
  propsEl.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.k && t.tagName !== "TEXTAREA") setProp(t.dataset.k, t.value);
    else if (t.dataset.k === "text") setProp("text", t.value);
    else if (t.dataset.hex) { const v = t.value.trim(); if (/^(none|transparent)$/i.test(v)) setColor(t.dataset.hex, "transparent"); else if (hexOk(v)) setColor(t.dataset.hex, v); else { toast("Use a hex color like #4F7CFF"); renderProps(); } }
    else if (t.matches("[data-snap]")) { snapOn = t.checked; store.set("tessera-snap", snapOn); toast(snapOn ? "Snapping on" : "Snapping off"); }
    else if (t.matches("[data-opacity]")) { record(propsEl.__ob, "set opacity"); propsEl.__ob = null; renderAll(); }
    else if (t.matches("[data-hue]")) { record(propsEl.__pb, "set color"); propsEl.__pb = null; renderLayers(); updateUndo(); }
  });
  propsEl.addEventListener("input", (e) => {
    const t = e.target;
    if (t.matches("[data-opacity]")) { propsEl.__ob ??= snap(); sel.forEach((id) => (doc.frames[id].opacity = +t.value)); t.style.setProperty("--p", `${t.value}%`); renderFrames(); const n = $('[data-k="opacity"]', propsEl); if (n) n.value = t.value; }
    if (t.matches("[data-hue]") && pk) { propsEl.__pb ??= snap(); pk.h = +t.value; $("[data-sv]", propsEl).style.setProperty("--hue", pk.h); setColor(pk.key, fromHsv(pk.h, pk.s, pk.v), false); }
  });
  propsEl.addEventListener("keydown", (e) => {
    const t = e.target;
    if (e.key === "Enter" && t.matches("input[data-k], input[data-hex]")) { e.preventDefault(); t.blur(); }
    if ((e.key === "ArrowUp" || e.key === "ArrowDown") && t.matches("input[data-k]") && t.dataset.k !== "text") { e.preventDefault(); const v = parseFloat(t.value) || 0; t.value = v + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 10 : 1); setProp(t.dataset.k, t.value); }
    if (t.matches("[data-sv]") && pk && e.key.startsWith("Arrow")) { e.preventDefault(); const st = e.shiftKey ? 0.1 : 0.02; if (e.key === "ArrowLeft") pk.s = clamp(pk.s - st, 0, 1); if (e.key === "ArrowRight") pk.s = clamp(pk.s + st, 0, 1); if (e.key === "ArrowUp") pk.v = clamp(pk.v + st, 0, 1); if (e.key === "ArrowDown") pk.v = clamp(pk.v - st, 0, 1); setColor(pk.key, fromHsv(pk.h, pk.s, pk.v)); const kn = $("[data-sv] .knob", propsEl); if (kn) Object.assign(kn.style, { left: `${pk.s * 100}%`, top: `${(1 - pk.v) * 100}%` }); }
  });
  propsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b || b.disabled) return;
    if (b.dataset.align) return align(b.dataset.align);
    if (b.dataset.dist) return distribute(b.dataset.dist);
    if (b.dataset.talign) return setProp("align", b.dataset.talign);
    if (b.dataset.pick) { const k = b.dataset.pick; pk = pk?.key === k ? null : { key: k, ...toHsv(common(k)) }; renderProps(); return; }
    if (b.dataset.swatch) { setColor(pk.key, b.dataset.swatch); pk = { key: pk.key, ...toHsv(b.dataset.swatch) }; renderProps(); return; }
    if (b.dataset.act) return ({ fwd: () => reorder(sel, 1, false), back: () => reorder(sel, -1, false), dup: duplicate, lock: () => toggle(sel, "locked", "lock"), del })[b.dataset.act]();
    if (b.hasAttribute("data-fitbtn")) return fit();
    if (b.hasAttribute("data-reset")) { act("reset demo", () => { doc = seed(); sel = []; }); fit(); toast("Demo restored. Undo brings your work back"); }
  });
  /* scrubbable labels + saturation/value square */
  propsEl.addEventListener("pointerdown", (e) => {
    const sc = e.target.closest("[data-scrub]"), sv = e.target.closest("[data-sv]");
    if (sc && sel.length) {
      e.preventDefault(); const k = sc.dataset.scrub, before = snap(), x0 = e.clientX, start = Object.fromEntries(sel.map((id) => [id, doc.frames[id][k]]));
      sc.setPointerCapture(e.pointerId);
      const mv = (ev) => { const d = Math.round((ev.clientX - x0) / 2) * (ev.shiftKey ? 10 : 1); sel.forEach((id) => { const f = doc.frames[id]; let v = start[id] + d; if (k === "rot") v = normRot(v); if (k === "opacity") v = clamp(v, 0, 100); if (["w", "h", "fs"].includes(k)) v = Math.max(1, v); if (["radius", "bw"].includes(k)) v = Math.max(0, v); if ((k === "x" || k === "y") && f.board) { const dd = v - f[k]; withChildren([id]).forEach((x) => (doc.frames[x][k] += dd)); } else f[k] = v; }); live(); };
      const up = () => { sc.removeEventListener("pointermove", mv); sc.removeEventListener("pointerup", up); sc.removeEventListener("pointercancel", up); record(before, `set ${k}`); renderAll(); };
      sc.addEventListener("pointermove", mv); sc.addEventListener("pointerup", up); sc.addEventListener("pointercancel", up); return;
    }
    if (sv && pk) {
      e.preventDefault(); sv.focus(); const before = snap(), kn = $(".knob", sv); sv.setPointerCapture(e.pointerId);
      const set = (ev) => { const r = sv.getBoundingClientRect(); pk.s = clamp((ev.clientX - r.left) / r.width, 0, 1); pk.v = clamp(1 - (ev.clientY - r.top) / r.height, 0, 1); kn.style.left = `${pk.s * 100}%`; kn.style.top = `${(1 - pk.v) * 100}%`; setColor(pk.key, fromHsv(pk.h, pk.s, pk.v), false); };
      const up = () => { sv.removeEventListener("pointermove", set); sv.removeEventListener("pointerup", up); record(before, "set color"); renderLayers(); updateUndo(); };
      set(e); sv.addEventListener("pointermove", set); sv.addEventListener("pointerup", up);
    }
  });

  /* ---------- chrome ---------- */
  $("[data-tools]").addEventListener("click", (e) => { const b = e.target.closest("[data-tool]"); if (b) setTool(b.dataset.tool); });
  $("[data-undo]").addEventListener("click", undo);
  $("[data-redo]").addEventListener("click", redo);
  $("[data-add]").addEventListener("click", addFrame);
  const pname = $("[data-pname]");
  pname.addEventListener("change", () => { const v = pname.value.trim() || "Untitled"; act("rename project", () => (doc.name = v)); pname.value = doc.name; });
  pname.addEventListener("keydown", (e) => { if (e.key === "Enter") pname.blur(); });
  const keysDlg = $("[data-keysdlg]");
  function openKeys() { keysDlg.showModal(); }
  $("[data-keys]").addEventListener("click", openKeys);
  keysDlg.addEventListener("click", (e) => { if (e.target === keysDlg || e.target.closest("[data-close]")) keysDlg.close(); });
  $("[data-mtabs]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-mtab]"); if (!b) return; const open = b.getAttribute("aria-pressed") !== "true";
    $$("[data-mtab]").forEach((x) => x.setAttribute("aria-pressed", open && x === b)); $$("[data-pane]").forEach((p) => p.classList.toggle("open", open && p.dataset.pane === b.dataset.mtab));
    if (open && sel.length) { const bb = bbox(sel), r = sr(), pane = $(`[data-pane="${b.dataset.mtab}"]`), vis = Math.max(80, innerHeight - 56 - pane.offsetHeight - r.top), c = toScreen(bb.x + bb.w / 2, bb.y + bb.h / 2); view.x += r.width / 2 - c.x; view.y += vis / 2 - c.y; renderView(); renderSel(); }
  });
  let toastT; function toast(m) { const box = $("[data-toasts]"); box.innerHTML = ""; const t = document.createElement("div"); t.className = "toast"; t.textContent = m; box.append(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2400); }
  addEventListener("resize", () => { renderView(); renderSel(); });

  window.__ts = { get doc() { return doc; }, get sel() { return sel; }, get view() { return view; }, toScreen, el: (id) => els.get(id), byName: (n) => Object.values(doc.frames).find((f) => f.name === n) };
  pname.value = doc.name; setTool("select"); renderAll();
  requestAnimationFrame(() => { fit(); });
})();
