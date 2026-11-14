(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clone = (o) => (o ? JSON.parse(JSON.stringify(o)) : o);
  const uid = () => Math.random().toString(36).slice(2, 9);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* full or blocked */ } } };
  const stage = $("[data-stage]"), svg = $("[data-svg]"), world = $("[data-world]"), over = $("[data-over]");
  const COLORS = { red: "#EF4444", orange: "#F97316", yellow: "#EAB308", green: "#22C55E", teal: "#14B8A6", blue: "#3B82F6", indigo: "#6366F1", purple: "#A855F7", violet: "#8B5CF6", pink: "#EC4899", gray: "#9CA3AF", grey: "#9CA3AF", black: "#18181B", white: "#FFFFFF" };
  const SWATCHES = ["#18181B", "#FFFFFF", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#14B8A6", "#3B82F6", "#6D5BF6", "#EC4899", "#E4E4E7", "#FDE68A"];
  const PEOPLE = [["Riley", "#F97316"], ["Noor", "#22C55E"], ["Kenji", "#3B82F6"], ["Ines", "#EC4899"], ["Omar", "#A855F7"], ["Zoe", "#14B8A6"]];

  /* ---------- identity (per tab) ---------- */
  let me; try { me = JSON.parse(sessionStorage.getItem("cc-me")); } catch { me = null; }
  if (!me) { const p = PEOPLE[Math.floor(Math.random() * PEOPLE.length)]; me = { id: uid(), name: p[0], color: p[1] }; try { sessionStorage.setItem("cc-me", JSON.stringify(me)); } catch { /* ignore */ } }

  /* ---------- document ---------- */
  const seedDoc = () => {
    const S = (type, x, y, w, h, o = {}) => ({ id: uid(), type, x, y, w, h, rot: 0, fill: "#6D5BF6", stroke: "", sw: 2, r: 0, text: "", fs: 24, locked: false, group: null, ...o });
    const shapes = [S("rect", 120, 110, 520, 330, { fill: "#FFFFFF", stroke: "#E4E4E7", r: 16, name: "Card" }), S("text", 160, 150, 0, 0, { text: "Welcome to CollabCanvas", fs: 30, fill: "#18181B", name: "Title" }), S("text", 160, 205, 0, 0, { text: "Draw, move and rotate shapes together.\nOpen a second tab to see live cursors.", fs: 16, fill: "#52525B", name: "Body" }), S("rect", 160, 290, 150, 46, { fill: "#6D5BF6", r: 10, name: "Button" }), S("text", 190, 302, 0, 0, { text: "Get started", fs: 17, fill: "#FFFFFF", name: "Button label" }), S("ellipse", 500, 260, 100, 100, { fill: "#F97316", name: "Circle" }), S("rect", 455, 330, 70, 70, { fill: "#22C55E", rot: 18, r: 8, name: "Square" }), S("line", 700, 140, 160, 120, { stroke: "#18181B", fill: "#18181B", sw: 3, name: "Line" })];
    return { title: "Untitled design", shapes: Object.fromEntries(shapes.map((s) => [s.id, s])), order: shapes.map((s) => s.id) };
  };
  let doc = store.get("cc-doc", null); if (!doc || !doc.shapes || !Array.isArray(doc.order)) doc = seedDoc();
  const meas = document.createElement("canvas").getContext("2d");
  function fitText(s) { if (s.type !== "text") return s; meas.font = `500 ${s.fs}px Inter, sans-serif`; const lines = String(s.text || " ").split("\n"); s.w = Math.max(10, Math.ceil(Math.max(...lines.map((l) => meas.measureText(l || " ").width)))); s.h = Math.ceil(lines.length * s.fs * 1.25); return s; }
  Object.values(doc.shapes).forEach(fitText);
  let sel = [], view = { x: 40, y: 30, z: 1 }, tool = "select", lastIds = [];
  const undoStack = [], redoStack = [];
  let saveT; const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => store.set("cc-doc", doc), 250); dirty = true; };

  /* ---------- patches: every change is {shapes:{id: shape|null}, order?, title?} ---------- */
  function capture(ids, withOrder = true) { return { shapes: Object.fromEntries(ids.map((id) => [id, clone(doc.shapes[id] || null)])), order: withOrder ? doc.order.slice() : undefined, title: doc.title }; }
  function applyPatch(p) {
    for (const [id, s] of Object.entries(p.shapes || {})) { if (s) doc.shapes[id] = clone(s); else delete doc.shapes[id]; }
    if (p.order) doc.order = p.order.filter((id) => doc.shapes[id]); else { Object.keys(p.shapes || {}).forEach((id) => { if (doc.shapes[id] && !doc.order.includes(id)) doc.order.push(id); }); doc.order = doc.order.filter((id) => doc.shapes[id]); }
    if (p.title !== undefined) doc.title = p.title;
    sel = sel.filter((id) => doc.shapes[id]);
  }
  function commit(before, after, label = "edit") {
    undoStack.push({ before, after, label }); if (undoStack.length > 100) undoStack.shift(); redoStack.length = 0;
    persist(); send({ t: "patch", p: after }); scheduleRender(); renderPanel();
  }
  /** change(ids, fn): snapshot ids, run fn to mutate doc, commit */
  function change(ids, fn, label) { const before = capture(ids); fn(); const after = capture([...new Set([...ids, ...Object.keys(before.shapes)])]); Object.keys(after.shapes).forEach((id) => { if (!(id in before.shapes)) before.shapes[id] = null; }); commit(before, after, label); }
  function addShapes(list, label = "create") { const ids = list.map((s) => s.id); const before = { shapes: Object.fromEntries(ids.map((id) => [id, null])), order: doc.order.slice() }; list.forEach((s) => { doc.shapes[s.id] = fitText(s); doc.order.push(s.id); }); commit(before, capture(ids), label); lastIds = ids; return ids; }
  function undo() { const e = undoStack.pop(); if (!e) return; applyPatch(e.before); redoStack.push(e); persist(); send({ t: "patch", p: e.before }); scheduleRender(); renderPanel(); toast(`Undo ${e.label}`); }
  function redo() { const e = redoStack.pop(); if (!e) return; applyPatch(e.after); undoStack.push(e); persist(); send({ t: "patch", p: e.after }); scheduleRender(); renderPanel(); toast(`Redo ${e.label}`); }
  const mk = (type, x, y, w, h, o = {}) => ({ id: uid(), type, x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), rot: 0, fill: type === "line" ? "#18181B" : "#6D5BF6", stroke: type === "line" ? "#18181B" : "", sw: type === "line" ? 3 : 2, r: 0, text: type === "text" ? "Text" : "", fs: 24, locked: false, group: null, ...o });

  /* ---------- collaboration over BroadcastChannel (stands in for Yjs + y-websocket) ---------- */
  const chan = "BroadcastChannel" in window ? new BroadcastChannel("collabcanvas") : null;
  const peers = new Map();
  let lastSent = 0;
  function send(m) { if (chan) chan.postMessage({ ...m, from: me.id }); }
  function hello() { send({ t: "hello", user: me, sel }); }
  if (chan) chan.onmessage = ({ data: m }) => {
    if (m.from === me.id) return;
    const p = peers.get(m.from) || {};
    if (m.user) peers.set(m.from, { ...p, ...m.user, seen: Date.now(), sel: m.sel || p.sel || [] });
    else if (peers.has(m.from)) p.seen = Date.now();
    if (m.t === "hello") send({ t: "here", user: me, sel });
    if (m.t === "cur") { const q = peers.get(m.from); if (q) { q.x = m.x; q.y = m.y; q.seen = Date.now(); } renderCursors(); return; }
    if (m.t === "sel") { const q = peers.get(m.from); if (q) q.sel = m.sel; }
    if (m.t === "bye") peers.delete(m.from);
    if (m.t === "patch") { applyPatch(m.p); store.set("cc-doc", doc); }
    renderPresence(); scheduleRender(); if (m.t === "patch" || m.t === "sel") renderPanel(); renderCursors();
  };
  setInterval(() => { send({ t: "ping", user: me, sel }); const now = Date.now(); let ch = false; peers.forEach((p, id) => { if (!p.bot && now - p.seen > 6000) { peers.delete(id); ch = true; } }); if (ch) { renderPresence(); scheduleRender(); renderCursors(); } }, 2000);
  addEventListener("pagehide", () => send({ t: "bye" }));
  const lockedBy = (id) => { for (const [pid, p] of peers) if ((p.sel || []).includes(id)) return p; return null; };

  /* simulated teammate so presence is visible even in one tab */
  let botOn = true, botT = null;
  const bot = { id: "bot", name: "Sam (simulated)", color: "#0EA5E9", bot: true, x: 400, y: 300, sel: [], seen: Date.now() };
  function botTick() {
    if (!botOn) return; const ids = doc.order.filter((id) => !sel.includes(id) && !doc.shapes[id]?.locked);
    const target = ids.length && Math.random() < 0.5 ? doc.shapes[ids[Math.floor(Math.random() * ids.length)]] : null;
    bot.x = target ? target.x + target.w / 2 : 100 + Math.random() * 700; bot.y = target ? target.y + target.h / 2 : 80 + Math.random() * 400; bot.sel = target ? [target.id] : []; bot.seen = Date.now();
    renderCursors(); scheduleRender(); renderPresence();
  }
  function setBot(on) { botOn = on; clearInterval(botT); if (on) { peers.set("bot", bot); botT = setInterval(botTick, 2600); botTick(); } else { peers.delete("bot"); } renderPresence(); renderCursors(); scheduleRender(); renderPanel(); }

  /* ---------- coordinates ---------- */
  const sr = () => stage.getBoundingClientRect();
  const toWorld = (cx, cy) => { const r = sr(); return { x: (cx - r.left - view.x) / view.z, y: (cy - r.top - view.y) / view.z }; };
  const toScreen = (x, y) => ({ x: x * view.z + view.x, y: y * view.z + view.y });
  const rotPt = (px, py, cx, cy, deg) => { const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return { x: cx + (px - cx) * c - (py - cy) * s, y: cy + (px - cx) * s + (py - cy) * c }; };
  const corners = (s) => { const cx = s.x + s.w / 2, cy = s.y + s.h / 2; return [[s.x, s.y], [s.x + s.w, s.y], [s.x + s.w, s.y + s.h], [s.x, s.y + s.h]].map(([x, y]) => rotPt(x, y, cx, cy, s.rot)); };
  const aabb = (s) => { const c = corners(s), xs = c.map((p) => p.x), ys = c.map((p) => p.y); return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };

  /* ---------- rendering ---------- */
  function shapeSVG(s) {
    const cx = s.x + s.w / 2, cy = s.y + s.h / 2, tr = s.rot ? ` transform="rotate(${s.rot} ${cx} ${cy})"` : "", lb = lockedBy(s.id), cls = `shape${lb ? " lockedby" : ""}`;
    const st = s.stroke ? ` stroke="${s.stroke}" stroke-width="${s.sw}"` : "";
    if (s.type === "rect") return `<rect class="${cls}" data-id="${s.id}" x="${s.x}" y="${s.y}" width="${Math.max(1, s.w)}" height="${Math.max(1, s.h)}" rx="${s.r || 0}" fill="${s.fill}"${st}${tr}/>`;
    if (s.type === "ellipse") return `<ellipse class="${cls}" data-id="${s.id}" cx="${cx}" cy="${cy}" rx="${Math.max(0.5, s.w / 2)}" ry="${Math.max(0.5, s.h / 2)}" fill="${s.fill}"${st}${tr}/>`;
    if (s.type === "line") { const y1 = s.flip ? s.y + s.h : s.y, y2 = s.flip ? s.y : s.y + s.h; return `<g class="${cls}" data-id="${s.id}"${tr}><line x1="${s.x}" y1="${y1}" x2="${s.x + s.w}" y2="${y2}" stroke="transparent" stroke-width="14"/><line x1="${s.x}" y1="${y1}" x2="${s.x + s.w}" y2="${y2}" stroke="${s.stroke || s.fill}" stroke-width="${s.sw || 3}" stroke-linecap="round"/></g>`; }
    if (s.type === "text") return `<g class="${cls}" data-id="${s.id}"${tr}><rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="transparent"/><text x="${s.x}" y="${s.y}" font-family="Inter, sans-serif" font-weight="500" font-size="${s.fs}" fill="${s.fill}">${String(s.text).split("\n").map((l, i) => `<tspan x="${s.x}" dy="${i ? s.fs * 1.25 : s.fs}">${esc(l) || " "}</tspan>`).join("")}</text></g>`;
    return "";
  }
  let rq = 0, marquee = null;
  function scheduleRender() { if (!rq) rq = requestAnimationFrame(() => { rq = 0; render(); }); }
  function render() {
    world.setAttribute("transform", `translate(${view.x} ${view.y}) scale(${view.z})`);
    world.innerHTML = doc.order.map((id) => doc.shapes[id] && shapeSVG(doc.shapes[id])).join("");
    $("[data-bgrect]").setAttribute("fill", "url(#dots)"); $("#dots").setAttribute("patternTransform", `translate(${view.x % (24 * view.z)} ${view.y % (24 * view.z)}) scale(${view.z})`);
    let o = "";
    const poly = (s, col, w = 1.5, dash = "") => `<polygon points="${corners(s).map((p) => { const q = toScreen(p.x, p.y); return `${q.x},${q.y}`; }).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} pointer-events="none"/>`;
    peers.forEach((p) => (p.sel || []).forEach((id) => { const s = doc.shapes[id]; if (!s) return; o += poly(s, p.color, 2); const c = toScreen(aabb(s).x, aabb(s).y); o += `<g pointer-events="none"><rect x="${c.x}" y="${c.y - 20}" width="${p.name.length * 6.6 + 12}" height="18" rx="4" fill="${p.color}"/><text x="${c.x + 6}" y="${c.y - 7}" font-size="11" font-weight="600" fill="#fff" font-family="Inter, sans-serif">${esc(p.name)}</text></g>`; }));
    sel.forEach((id) => { const s = doc.shapes[id]; if (s) o += poly(s, "#2563EB", 1.5); });
    if (sel.length === 1) {
      const s = doc.shapes[sel[0]];
      if (s && !s.locked) {
        const cx = s.x + s.w / 2, cy = s.y + s.h / 2, H = { nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0] };
        Object.entries(H).forEach(([k, [hx, hy]]) => { if (s.type === "text" && (hx === 0 || hy === 0)) return; const w = rotPt(cx + (hx * s.w) / 2, cy + (hy * s.h) / 2, cx, cy, s.rot), q = toScreen(w.x, w.y); o += `<rect data-h="${k}" x="${q.x - 5}" y="${q.y - 5}" width="10" height="10" rx="2" fill="#fff" stroke="#2563EB" stroke-width="1.5" style="cursor:${["n", "s"].includes(k) ? "ns" : ["e", "w"].includes(k) ? "ew" : ["nw", "se"].includes(k) ? "nwse" : "nesw"}-resize"/>`; });
        const top = rotPt(cx, s.y, cx, cy, s.rot), up = rotPt(cx, s.y - 28 / view.z, cx, cy, s.rot), a = toScreen(top.x, top.y), b = toScreen(up.x, up.y);
        o += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#2563EB" stroke-width="1.5" pointer-events="none"/><circle data-h="rot" cx="${b.x}" cy="${b.y}" r="6" fill="#fff" stroke="#2563EB" stroke-width="1.5" style="cursor:grab"/>`;
      }
    } else if (sel.length > 1) { const b = selBox(); if (b) { const p1 = toScreen(b.x, b.y); o += `<rect x="${p1.x}" y="${p1.y}" width="${b.w * view.z}" height="${b.h * view.z}" fill="none" stroke="#2563EB" stroke-dasharray="4 3" pointer-events="none"/>`; } }
    if (marquee) o += `<rect x="${Math.min(marquee.x0, marquee.x1)}" y="${Math.min(marquee.y0, marquee.y1)}" width="${Math.abs(marquee.x1 - marquee.x0)}" height="${Math.abs(marquee.y1 - marquee.y0)}" fill="rgba(37,99,235,.08)" stroke="#2563EB" pointer-events="none"/>`;
    over.innerHTML = o;
    $("[data-zoom='0']").textContent = `${Math.round(view.z * 100)}%`;
    $("[data-undo]").disabled = !undoStack.length; $("[data-redo]").disabled = !redoStack.length;
    stage.dataset.count = doc.order.length;
  }
  const selBox = (ids = sel) => { const bs = ids.map((id) => doc.shapes[id] && aabb(doc.shapes[id])).filter(Boolean); if (!bs.length) return null; const x = Math.min(...bs.map((b) => b.x)), y = Math.min(...bs.map((b) => b.y)); return { x, y, w: Math.max(...bs.map((b) => b.x + b.w)) - x, h: Math.max(...bs.map((b) => b.y + b.h)) - y }; };
  function renderCursors() {
    let h = ""; peers.forEach((p, id) => { if (p.x == null) return; const q = toScreen(p.x, p.y); h += `<div class="cur" data-cursor="${id}" style="transform:translate(${q.x}px,${q.y}px)"><svg viewBox="0 0 24 24"><path d="M3 2l18 8-8 2-3 8z" fill="${p.color}" stroke="#fff" stroke-width="1.5"/></svg><span style="background:${p.color}">${esc(p.name)}</span></div>`; });
    $("[data-cursors]").innerHTML = h;
  }
  function renderPresence() {
    const all = [[me, true], ...[...peers.values()].map((p) => [p, false])];
    $("[data-presence]").innerHTML = all.map(([p, isMe]) => `<span class="pav${isMe ? " me" : ""}" style="background:${p.color}" title="${esc(p.name)}${isMe ? " (you)" : ""}" aria-label="${esc(p.name)}${isMe ? " (you)" : ""}">${esc(p.name[0])}</span>`).join("") + `<span class="count" data-pcount>${all.length} online</span>`;
  }
  function setSel(ids, broadcast = true) {
    const expanded = new Set(); ids.forEach((id) => { const s = doc.shapes[id]; if (!s) return; if (s.group) doc.order.forEach((o) => doc.shapes[o]?.group === s.group && expanded.add(o)); else expanded.add(id); });
    sel = [...expanded].filter((id) => !lockedBy(id)); if (broadcast) send({ t: "sel", sel }); scheduleRender(); renderPanel();
  }

  /* ---------- pointer interactions ---------- */
  let drag = null, spaceDown = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.button === 2) return; stage.focus({ preventScroll: true });
    const w = toWorld(e.clientX, e.clientY), h = e.target.closest("[data-h]"), hit = e.target.closest("[data-id]");
    stage.setPointerCapture(e.pointerId);
    if (e.button === 1 || spaceDown || tool === "hand") { drag = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y }; stage.classList.add("dragging-pan"); return; }
    if (h && sel.length === 1) { const s = doc.shapes[sel[0]]; drag = { kind: h.dataset.h === "rot" ? "rotate" : "resize", h: h.dataset.h, s0: clone(s), before: capture([s.id], false) }; return; }
    if (["rect", "ellipse", "line"].includes(tool)) { const s = mk(tool, w.x, w.y, 0, 0); doc.shapes[s.id] = s; doc.order.push(s.id); drag = { kind: "create", s, x0: w.x, y0: w.y, before: { shapes: { [s.id]: null }, order: doc.order.slice(0, -1) } }; return; }
    if (tool === "text") { const s = mk("text", w.x, w.y, 0, 0, { fill: "#18181B" }); addShapes([s], "add text"); setTool("select"); setSel([s.id]); setPanel("props"); setTimeout(() => { const t = $("[data-ptext]"); if (t) { t.focus(); t.select(); } }, 30); return; }
    if (hit) {
      const id = hit.dataset.id, lb = lockedBy(id);
      if (lb) { toast(`${lb.name} is editing this shape`); return; }
      if (e.shiftKey) setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]); else if (!sel.includes(id)) setSel([id]);
      const movable = sel.filter((x) => !doc.shapes[x].locked);
      if (movable.length) drag = { kind: "move", x0: w.x, y0: w.y, orig: Object.fromEntries(movable.map((x) => [x, { x: doc.shapes[x].x, y: doc.shapes[x].y }])), before: capture(movable, false), moved: false };
      else if (sel.length) toast("Shape is locked. Unlock it in the Layers panel");
      return;
    }
    if (!e.shiftKey) setSel([]);
    const r = sr(); drag = { kind: "marquee", base: e.shiftKey ? sel.slice() : [] }; marquee = { x0: e.clientX - r.left, y0: e.clientY - r.top, x1: e.clientX - r.left, y1: e.clientY - r.top };
  });
  stage.addEventListener("pointermove", (e) => {
    const w = toWorld(e.clientX, e.clientY);
    const now = Date.now(); if (now - lastSent > 40) { lastSent = now; send({ t: "cur", x: w.x, y: w.y }); }
    if (!drag) return;
    if (drag.kind === "pan") { view.x = drag.vx + e.clientX - drag.sx; view.y = drag.vy + e.clientY - drag.sy; scheduleRender(); renderCursors(); return; }
    if (drag.kind === "create") { const s = drag.s; let x = Math.min(drag.x0, w.x), y = Math.min(drag.y0, w.y), ww = Math.abs(w.x - drag.x0), hh = Math.abs(w.y - drag.y0); if (e.shiftKey && s.type !== "line") ww = hh = Math.max(ww, hh); Object.assign(s, { x: Math.round(x), y: Math.round(y), w: Math.round(ww), h: Math.round(hh), flip: s.type === "line" && (w.x - drag.x0) * (w.y - drag.y0) < 0 }); scheduleRender(); return; }
    if (drag.kind === "move") { let dx = w.x - drag.x0, dy = w.y - drag.y0; if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; } drag.moved = drag.moved || Math.hypot(dx, dy) > 1; Object.entries(drag.orig).forEach(([id, o]) => { const s = doc.shapes[id]; s.x = Math.round(o.x + dx); s.y = Math.round(o.y + dy); }); scheduleRender(); liveSync(Object.keys(drag.orig)); return; }
    if (drag.kind === "rotate") { const s = doc.shapes[drag.s0.id], cx = s.x + s.w / 2, cy = s.y + s.h / 2; let a = (Math.atan2(w.y - cy, w.x - cx) * 180) / Math.PI + 90; if (e.shiftKey) a = Math.round(a / 15) * 15; s.rot = Math.round(((a % 360) + 360) % 360); scheduleRender(); liveSync([s.id]); renderPanel(); return; }
    if (drag.kind === "resize") {
      const s0 = drag.s0, s = doc.shapes[s0.id], hx = { w: -1, e: 1 }[drag.h.slice(-1)] ?? (drag.h.includes("w") ? -1 : drag.h.includes("e") ? 1 : 0), hy = drag.h.startsWith("n") ? -1 : drag.h.startsWith("s") ? 1 : 0;
      const cx0 = s0.x + s0.w / 2, cy0 = s0.y + s0.h / 2, A = rotPt(cx0 - (hx * s0.w) / 2, cy0 - (hy * s0.h) / 2, cx0, cy0, s0.rot), L = rotPt(w.x, w.y, A.x, A.y, -s0.rot);
      let nw = hx ? Math.max(4, (L.x - A.x) * hx) : s0.w, nh = hy ? Math.max(4, (L.y - A.y) * hy) : s0.h;
      if (e.shiftKey && hx && hy) { const k = Math.max(nw / s0.w, nh / s0.h); nw = s0.w * k; nh = s0.h * k; }
      if (s.type === "text") { const k = nh / s0.h; s.fs = Math.max(8, Math.round(s0.fs * k)); fitText(s); nw = s.w; nh = s.h; }
      const C = rotPt(A.x + (hx ? (hx * nw) / 2 : 0), A.y + (hy ? (hy * nh) / 2 : 0), A.x, A.y, s0.rot), cxw = hx ? C.x : (hy ? C.x : cx0), cyw = hy ? C.y : (hx ? C.y : cy0);
      Object.assign(s, { w: Math.round(nw), h: Math.round(nh), x: Math.round(cxw - nw / 2), y: Math.round(cyw - nh / 2) }); scheduleRender(); liveSync([s.id]); renderPanel(); return;
    }
    if (drag.kind === "marquee") { const r = sr(); marquee.x1 = e.clientX - r.left; marquee.y1 = e.clientY - r.top; const a = toWorld(Math.min(marquee.x0, marquee.x1) + r.left, Math.min(marquee.y0, marquee.y1) + r.top), b = toWorld(Math.max(marquee.x0, marquee.x1) + r.left, Math.max(marquee.y0, marquee.y1) + r.top); const hits = doc.order.filter((id) => { const q = aabb(doc.shapes[id]); return q.x < b.x && q.x + q.w > a.x && q.y < b.y && q.y + q.h > a.y; }); sel = [...new Set([...drag.base, ...hits])].filter((id) => !lockedBy(id)); scheduleRender(); }
  });
  let lsT = 0; function liveSync(ids) { const n = Date.now(); if (n - lsT < 50) return; lsT = n; send({ t: "patch", p: { shapes: Object.fromEntries(ids.map((id) => [id, doc.shapes[id]])) } }); }
  stage.addEventListener("pointerup", () => {
    if (!drag) return; const d = drag; drag = null; stage.classList.remove("dragging-pan");
    if (d.kind === "create") { const s = d.s; if (s.w < 3 && s.h < 3) Object.assign(s, s.type === "line" ? { w: 120, h: 0 } : { w: 120, h: s.type === "ellipse" ? 120 : 80 }); s.name = `${s.type[0].toUpperCase() + s.type.slice(1)} ${doc.order.length}`; commit(d.before, capture([s.id]), `draw ${s.type}`); lastIds = [s.id]; setTool("select"); setSel([s.id]); return; }
    if (d.kind === "move" && d.moved) { commit(d.before, capture(Object.keys(d.orig), false), "move"); return; }
    if (d.kind === "resize" || d.kind === "rotate") { commit(d.before, capture([d.s0.id], false), d.kind); return; }
    if (d.kind === "marquee") { marquee = null; send({ t: "sel", sel }); scheduleRender(); renderPanel(); }
  });
  stage.addEventListener("dblclick", (e) => { const hit = e.target.closest("[data-id]"); if (hit && doc.shapes[hit.dataset.id]?.type === "text") { setSel([hit.dataset.id]); setPanel("props"); setTimeout(() => $("[data-ptext]")?.focus(), 30); } });
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { zoomAt(view.z * Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY); } else { view.x -= e.deltaX; view.y -= e.deltaY; scheduleRender(); renderCursors(); }
  }, { passive: false });
  stage.addEventListener("pointerleave", () => send({ t: "cur", x: null, y: null }));
  function zoomAt(z, cx, cy) { z = Math.min(8, Math.max(0.1, z)); const r = sr(); cx ??= r.left + r.width / 2; cy ??= r.top + r.height / 2; const w = toWorld(cx, cy); view.z = z; view.x = cx - r.left - w.x * z; view.y = cy - r.top - w.y * z; scheduleRender(); renderCursors(); }
  function fit() { const b = selBox(doc.order); if (!b) return; const r = sr(), z = Math.min(4, Math.max(0.1, Math.min((r.width - 80) / b.w, (r.height - 80) / b.h))); view.z = z; view.x = (r.width - b.w * z) / 2 - b.x * z; view.y = (r.height - b.h * z) / 2 - b.y * z; scheduleRender(); renderCursors(); }
  $$("[data-zoom]").forEach((b) => b.addEventListener("click", () => { const d = +b.dataset.zoom; zoomAt(d === 0 ? 1 : view.z * (d > 0 ? 1.25 : 0.8)); }));
  $("[data-fit]").addEventListener("click", fit);

  /* ---------- tools + keyboard ---------- */
  function setTool(t) { tool = t; $$("[data-tool]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.tool === t)); stage.className = `stage t-${t}`; }
  $("[data-tools]").addEventListener("click", (e) => { const b = e.target.closest("[data-tool]"); if (b) setTool(b.dataset.tool); });
  $("[data-undo]").addEventListener("click", undo); $("[data-redo]").addEventListener("click", redo);
  const editable = () => document.activeElement.matches("textarea, select, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=color])") || document.activeElement.isContentEditable;
  document.addEventListener("keydown", (e) => {
    if (editable()) return;
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === " " && !spaceDown) { spaceDown = true; stage.classList.add("panning"); e.preventDefault(); return; }
    if (mod && k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === "y") { e.preventDefault(); redo(); return; }
    if (mod && k === "a") { e.preventDefault(); setSel(doc.order.slice()); return; }
    if (mod && k === "d") { e.preventDefault(); duplicate(); return; }
    if (mod && k === "g") { e.preventDefault(); e.shiftKey ? ungroup() : group(sel); return; }
    if (mod && k === "l") { e.preventDefault(); toggleLock(sel); return; }
    if (mod) return;
    const tools = { v: "select", h: "hand", r: "rect", o: "ellipse", l: "line", t: "text" }; if (tools[k]) { setTool(tools[k]); return; }
    if (k === "delete" || k === "backspace") { if (sel.length) { e.preventDefault(); del(); } return; }
    if (k === "escape") { setSel([]); setTool("select"); return; }
    if (k === "]" || k === "[") { e.preventDefault(); reorder(k === "]" ? 1 : -1, e.shiftKey); return; }
    if (k === "=" || k === "+") { zoomAt(view.z * 1.25); return; } if (k === "-") { zoomAt(view.z * 0.8); return; } if (k === "!" || (e.shiftKey && k === "1")) { fit(); return; }
    const ar = { arrowleft: [-1, 0], arrowright: [1, 0], arrowup: [0, -1], arrowdown: [0, 1] }[k];
    if (ar && sel.length) { e.preventDefault(); const n = e.shiftKey ? 10 : 1, ids = sel.filter((id) => !doc.shapes[id].locked); change(ids, () => ids.forEach((id) => { doc.shapes[id].x += ar[0] * n; doc.shapes[id].y += ar[1] * n; }), "nudge"); }
  });
  document.addEventListener("keyup", (e) => { if (e.key === " ") { spaceDown = false; stage.classList.remove("panning"); } });

  /* ---------- operations ---------- */
  function del() { const ids = sel.filter((id) => !doc.shapes[id].locked); if (!ids.length) return toast("Locked shapes can't be deleted"); const before = capture(ids); ids.forEach((id) => delete doc.shapes[id]); doc.order = doc.order.filter((id) => doc.shapes[id]); sel = []; commit(before, { shapes: Object.fromEntries(ids.map((id) => [id, null])), order: doc.order.slice() }, "delete"); send({ t: "sel", sel }); toast(`Deleted ${ids.length} shape${ids.length > 1 ? "s" : ""}`); }
  function duplicate() { if (!sel.length) return; const gmap = {}; const copies = sel.map((id) => { const s = clone(doc.shapes[id]); s.id = uid(); s.x += 16; s.y += 16; s.locked = false; if (s.group) s.group = gmap[s.group] ||= uid(); s.name = (s.name || s.type) + " copy"; return s; }); addShapes(copies, "duplicate"); setSel(copies.map((c) => c.id)); }
  function reorder(dir, extreme) { if (!sel.length) return; change(sel, () => { let o = doc.order.slice(); const ids = o.filter((id) => sel.includes(id)); if (extreme) { o = o.filter((id) => !sel.includes(id)); o = dir > 0 ? [...o, ...ids] : [...ids, ...o]; } else { const seq = dir > 0 ? ids.slice().reverse() : ids; seq.forEach((id) => { const i = o.indexOf(id), j = i + dir; if (j < 0 || j >= o.length || sel.includes(o[j])) return; [o[i], o[j]] = [o[j], o[i]]; }); } doc.order = o; }, dir > 0 ? "bring forward" : "send backward"); }
  function group(ids) { if (ids.length < 2) return toast("Select 2+ shapes to group"); const g = uid(); change(ids, () => ids.forEach((id) => (doc.shapes[id].group = g)), "group"); toast(`Grouped ${ids.length} shapes`); return g; }
  function ungroup() { if (!sel.length) return; change(sel, () => sel.forEach((id) => (doc.shapes[id].group = null)), "ungroup"); toast("Ungrouped"); }
  function toggleLock(ids) { if (!ids.length) return; const to = !ids.every((id) => doc.shapes[id].locked); change(ids, () => ids.forEach((id) => (doc.shapes[id].locked = to)), to ? "lock" : "unlock"); toast(to ? "Locked" : "Unlocked"); }
  function align(mode) { const b = selBox(); if (!b || sel.length < 2) return; const ids = sel.filter((id) => !doc.shapes[id].locked); change(ids, () => ids.forEach((id) => { const s = doc.shapes[id], q = aabb(s), dx = { left: b.x - q.x, hcenter: b.x + b.w / 2 - (q.x + q.w / 2), right: b.x + b.w - (q.x + q.w) }[mode] ?? 0, dy = { top: b.y - q.y, vcenter: b.y + b.h / 2 - (q.y + q.h / 2), bottom: b.y + b.h - (q.y + q.h) }[mode] ?? 0; s.x = Math.round(s.x + dx); s.y = Math.round(s.y + dy); }), `align ${mode}`); }
  function distribute(axis) { if (sel.length < 3) return toast("Select 3+ shapes to distribute"); const items = sel.map((id) => [id, aabb(doc.shapes[id])]).sort((a, b) => (axis === "h" ? a[1].x - b[1].x : a[1].y - b[1].y)); const first = items[0][1], last = items[items.length - 1][1], total = items.reduce((t, [, q]) => t + (axis === "h" ? q.w : q.h), 0), gap = ((axis === "h" ? last.x + last.w - first.x : last.y + last.h - first.y) - total) / (items.length - 1); change(sel, () => { let pos = axis === "h" ? first.x : first.y; items.forEach(([id, q]) => { const s = doc.shapes[id]; if (axis === "h") { s.x = Math.round(s.x + pos - q.x); pos += q.w + gap; } else { s.y = Math.round(s.y + pos - q.y); pos += q.h + gap; } }); }, "distribute"); }

  /* ---------- AI agent: local interpreter producing the PRD's function calls ---------- */
  const FN = {
    createShape(a) { const s = mk(a.type, a.x, a.y, a.width ?? (a.type === "line" ? 160 : 120), a.height ?? (a.type === "line" ? 0 : a.type === "ellipse" ? a.width ?? 120 : 80), { fill: a.color || (a.type === "line" ? "#18181B" : "#6D5BF6"), stroke: a.type === "line" ? a.color || "#18181B" : "", rot: a.rotation || 0, r: a.radius || 0, name: a.name }); if (a.id) s.id = a.id; return s; },
    createText(a) { return mk("text", a.x, a.y, 0, 0, { text: a.text, fs: a.fontSize || 20, fill: a.color || "#18181B", name: a.name || `Text: ${String(a.text).slice(0, 18)}` }); }
  };
  function interpret(prompt) {
    const p = prompt.toLowerCase().trim(), calls = [], r = sr(), c = toWorld(r.left + r.width / 2, r.top + r.height / 2);
    const at = p.match(/at\s*\(?\s*(-?\d+)\s*[, ]\s*(-?\d+)/), pos = at ? { x: +at[1], y: +at[2] } : { x: Math.round(c.x - 60), y: Math.round(c.y - 40) };
    const colorW = Object.keys(COLORS).find((k) => new RegExp(`\\b${k}\\b`).test(p)), color = colorW ? COLORS[colorW] : undefined;
    const size = p.match(/(\d+)\s*(?:x|by|×)\s*(\d+)(?!\s*grid)/), quoted = prompt.match(/["“'‘]([^"”'’]+)["”'’]/);
    const target = sel.length ? sel.slice() : lastIds.filter((id) => doc.shapes[id]);
    const grid = p.match(/(\d+)\s*(?:x|by|×)\s*(\d+)\s+grid(?:\s+of\s+(\w+))?/);
    if (grid) {
      const rows = Math.min(12, +grid[1]), cols = Math.min(12, +grid[2]), what = grid[3] || "squares", btn = /button/.test(what), w = btn ? 120 : 80, h = btn ? 44 : 80, sp = 16;
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const x = pos.x + j * (w + sp), y = pos.y + i * (h + sp), id = uid(); calls.push({ name: "createShape", args: { id, type: what.startsWith("circle") ? "circle" : "rect", x, y, width: w, height: h, color: color || "#6D5BF6", radius: btn ? 10 : 6 } }); if (btn) calls.push({ name: "createText", args: { text: `Button ${i * cols + j + 1}`, x: x + 22, y: y + 12, fontSize: 15, color: "#FFFFFF" } }); }
      return { calls, msg: `Created a ${rows}×${cols} grid of ${btn ? "buttons" : what}.` };
    }
    if (/login form|sign ?in form/.test(p)) { const x = pos.x, y = pos.y; calls.push({ name: "createShape", args: { type: "rect", x, y, width: 320, height: 300, color: "#FFFFFF", radius: 14, name: "Login card" } }, { name: "createText", args: { text: "Sign in", x: x + 24, y: y + 22, fontSize: 24 } }, { name: "createText", args: { text: "Email", x: x + 24, y: y + 74, fontSize: 13, color: "#52525B" } }, { name: "createShape", args: { type: "rect", x: x + 24, y: y + 94, width: 272, height: 40, color: "#F4F4F5", radius: 8, name: "Email field" } }, { name: "createText", args: { text: "Password", x: x + 24, y: y + 146, fontSize: 13, color: "#52525B" } }, { name: "createShape", args: { type: "rect", x: x + 24, y: y + 166, width: 272, height: 40, color: "#F4F4F5", radius: 8, name: "Password field" } }, { name: "createShape", args: { type: "rect", x: x + 24, y: y + 230, width: 272, height: 44, color: color || "#6D5BF6", radius: 10, name: "Submit button" } }, { name: "createText", args: { text: "Sign in", x: x + 132, y: y + 242, fontSize: 16, color: "#FFFFFF" } }); calls.push({ name: "groupShapes", args: { shapeIds: "$created" } }); return { calls, msg: "Built a login form (card, two labeled fields, submit button) and grouped it." }; }
    if (/nav ?bar|navigation bar|header bar/.test(p)) { const x = pos.x, y = pos.y; calls.push({ name: "createShape", args: { type: "rect", x, y, width: 760, height: 64, color: color || "#18181B", radius: 12, name: "Navbar" } }, { name: "createText", args: { text: "Brand", x: x + 24, y: y + 20, fontSize: 20, color: "#FFFFFF" } }); ["Home", "Product", "Pricing", "About"].forEach((t, i) => calls.push({ name: "createText", args: { text: t, x: x + 360 + i * 92, y: y + 23, fontSize: 15, color: "#E4E4E7" } })); calls.push({ name: "groupShapes", args: { shapeIds: "$created" } }); return { calls, msg: "Added a navigation bar with a brand and four links, grouped together." }; }
    if (/\b(rotate|turn|tilt)\b/.test(p)) { const d = p.match(/(-?\d+)\s*(?:°|deg|degrees)?/); if (!target.length) return { calls, msg: "Select a shape first, then ask me to rotate it." }; target.forEach((id) => calls.push({ name: "rotateShape", args: { shapeId: id, degrees: d ? +d[1] : 45 } })); return { calls, msg: `Rotated ${target.length} shape${target.length > 1 ? "s" : ""} to ${d ? d[1] : 45}°.` }; }
    if (/\b(move|put|place|shift)\b/.test(p) && !/\b(add|create|draw|make)\b/.test(p)) {
      if (!target.length) return { calls, msg: "Select a shape first, then tell me where to move it." };
      const by = p.match(/\b(left|right|up|down)\b(?:\s+by)?\s+(\d+)/);
      target.forEach((id) => { const s = doc.shapes[id]; let x = s.x, y = s.y; if (at) { x = +at[1] + (s.x - doc.shapes[target[0]].x); y = +at[2] + (s.y - doc.shapes[target[0]].y); } else if (by) { const n = +by[2]; x += by[1] === "left" ? -n : by[1] === "right" ? n : 0; y += by[1] === "up" ? -n : by[1] === "down" ? n : 0; } else if (/center|middle/.test(p)) { x = Math.round(c.x - s.w / 2); y = Math.round(c.y - s.h / 2); } calls.push({ name: "moveShape", args: { shapeId: id, x, y } }); });
      return { calls, msg: `Moved ${target.length} shape${target.length > 1 ? "s" : ""}.` };
    }
    if (/\b(resize|scale|bigger|smaller|twice|double|half)\b/.test(p) || (/\bmake\b/.test(p) && size)) {
      if (!target.length) return { calls, msg: "Select a shape to resize first." };
      target.forEach((id) => { const s = doc.shapes[id]; let w = s.w, h = s.h; if (size) { w = +size[1]; h = +size[2]; } else if (/twice|double|bigger|larger/.test(p)) { w *= 2; h *= 2; } else if (/half|smaller/.test(p)) { w /= 2; h /= 2; } calls.push({ name: "resizeShape", args: { shapeId: id, width: Math.round(w), height: Math.round(h) } }); });
      return { calls, msg: `Resized ${target.length} shape${target.length > 1 ? "s" : ""}.` };
    }
    if (/\b(arrange|distribute|line up|lay out|layout|stack)\b/.test(p)) {
      if (target.length < 2) return { calls, msg: "Select at least two shapes to arrange." };
      const mode = /grid/.test(p) ? "grid" : /vertical|column|stack|down/.test(p) ? "vertical" : "horizontal", cols = p.match(/(\d+)\s*col/), spacing = p.match(/spacing\s*(?:of\s*)?(\d+)|(\d+)\s*px/);
      calls.push({ name: "arrangeShapes", args: { shapeIds: target, mode, cols: cols ? +cols[1] : undefined, spacing: spacing ? +(spacing[1] || spacing[2]) : 20 } });
      return { calls, msg: `Arranged ${target.length} shapes ${mode === "grid" ? "in a grid" : mode}ly.`.replace("gridly", "grid") };
    }
    if (/\bgroup\b/.test(p)) { if (target.length < 2) return { calls, msg: "Select at least two shapes to group." }; calls.push({ name: "groupShapes", args: { shapeIds: target } }); return { calls, msg: `Grouped ${target.length} shapes.` }; }
    const textReq = /\b(text|label|heading|title|write|says?|saying)\b/.test(p) && quoted;
    if (textReq) { calls.push({ name: "createText", args: { text: quoted[1], x: pos.x, y: pos.y, fontSize: /heading|title/.test(p) ? 32 : 20, color } }); return { calls, msg: `Added text “${quoted[1]}”.` }; }
    const kind = p.match(/\b(rectangle|rect|square|box|circle|ellipse|oval|line)s?\b/);
    if (kind && /\b(add|create|draw|make|insert|place|put|give)\b/.test(p)) {
      const type = /circle|ellipse|oval/.test(kind[1]) ? "circle" : kind[1] === "line" ? "line" : "rect", nm = p.match(/\b(\d+|two|three|four|five|six)\b\s+(?:\w+\s+)?(?:rectangle|rect|square|box|circle|ellipse|oval|line)s/), words = { two: 2, three: 3, four: 4, five: 5, six: 6 }, n = Math.min(20, nm ? +(words[nm[1]] || nm[1]) : 1);
      const rad = p.match(/radius\s*(\d+)/), w = rad ? +rad[1] * 2 : size ? +size[1] : type === "line" ? 160 : kind[1] === "square" || type === "circle" ? 100 : 140, h = rad ? +rad[1] * 2 : size ? +size[2] : type === "line" ? 0 : kind[1] === "square" || type === "circle" ? 100 : 90;
      for (let i = 0; i < n; i++) calls.push({ name: "createShape", args: { type, x: pos.x + i * (w + 20), y: pos.y, width: w, height: h, color } });
      return { calls, msg: `Created ${n} ${colorW ? colorW + " " : ""}${type === "circle" ? "circle" : type === "line" ? "line" : kind[1] === "square" ? "square" : "rectangle"}${n > 1 ? "s" : ""}.` };
    }
    return { calls, msg: "I can create shapes and text, build a login form or navbar, make grids (“create a 3x3 grid of buttons”), and move, resize, rotate, arrange or group the selection." };
  }
  function execute(calls) {
    const created = [], beforeIds = [], toCreate = [];
    const ensure = (id) => { if (!beforeIds.includes(id)) beforeIds.push(id); };
    calls.forEach((c) => { if (c.name === "createShape" || c.name === "createText") { const s = FN[c.name]({ ...c.args, type: c.args.type === "circle" ? "ellipse" : c.args.type }); toCreate.push(s); created.push(s.id); } else if (c.args.shapeId) ensure(c.args.shapeId); else (c.args.shapeIds === "$created" ? [] : c.args.shapeIds || []).forEach(ensure); });
    const before = capture(beforeIds); created.forEach((id) => (before.shapes[id] = null));
    toCreate.forEach((s) => { doc.shapes[s.id] = fitText(s); doc.order.push(s.id); });
    calls.forEach((c) => {
      const a = c.args, s = a.shapeId && doc.shapes[a.shapeId];
      if (c.name === "moveShape" && s) { s.x = a.x; s.y = a.y; }
      if (c.name === "resizeShape" && s) { if (s.type === "text") { s.fs = Math.max(8, Math.round((s.fs * a.height) / s.h)); fitText(s); } else { s.w = a.width; s.h = a.height; } }
      if (c.name === "rotateShape" && s) s.rot = ((a.degrees % 360) + 360) % 360;
      if (c.name === "arrangeShapes") { const ids = a.shapeIds.filter((id) => doc.shapes[id]), sp = a.spacing ?? 20, b = selBox(ids); let x = b.x, y = b.y; const cols = a.mode === "grid" ? a.cols || Math.ceil(Math.sqrt(ids.length)) : a.mode === "horizontal" ? ids.length : 1, cw = Math.max(...ids.map((id) => doc.shapes[id].w)), ch = Math.max(...ids.map((id) => doc.shapes[id].h)); ids.forEach((id, i) => { const t = doc.shapes[id]; if (a.mode === "grid") { t.x = Math.round(b.x + (i % cols) * (cw + sp)); t.y = Math.round(b.y + Math.floor(i / cols) * (ch + sp)); } else if (a.mode === "horizontal") { t.x = Math.round(x); t.y = Math.round(b.y); x += t.w + sp; } else { t.y = Math.round(y); t.x = Math.round(b.x); y += t.h + sp; } }); }
      if (c.name === "groupShapes") { const ids = a.shapeIds === "$created" ? created : a.shapeIds, g = uid(); ids.forEach((id) => doc.shapes[id] && (doc.shapes[id].group = g)); a.groupId = g; }
    });
    const after = capture([...beforeIds, ...created]); commit(before, after, "AI edit");
    if (created.length) { lastIds = created; setSel(created); } else if (beforeIds.length) setSel(beforeIds);
  }
  const aiLog = [];

  /* ---------- side panel ---------- */
  let panel = "props";
  function setPanel(p) { panel = p; $$("[data-pt]").forEach((b) => b.setAttribute("aria-selected", b.dataset.pt === p)); $("[data-panel]").setAttribute("aria-labelledby", `pt-${p}`); renderPanel(); }
  $("[data-ptabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-pt]"); if (b) setPanel(b.dataset.pt); });
  const num = (k, label, v, extra = "") => `<label class="fld"><span>${label}</span><input class="mono" data-prop="${k}" value="${Math.round(v)}" inputmode="numeric" aria-label="${k}" ${extra}></label>`;
  const colorRow = (k, label, v) => `<div><label class="colr"><input type="color" data-color="${k}" value="${v && v.length === 7 ? v : "#000000"}" aria-label="${label} color"><input type="text" data-colortext="${k}" value="${esc(v || "none")}" aria-label="${label} hex"></label><div class="swatches" aria-label="${label} swatches">${SWATCHES.map((c) => `<button type="button" data-swatch="${k}" data-c="${c}" style="background:${c}" aria-label="${label} ${c}"></button>`).join("")}</div></div>`;
  const TYPE_IC = { rect: "t-rect", ellipse: "t-ellipse", line: "t-line", text: "t-text" };
  function renderPanel() {
    const P = $("[data-panel]"); if (P.contains(document.activeElement) && document.activeElement.matches("input, textarea") && panel !== "ai") return;
    if (panel === "props") {
      if (!sel.length) { P.innerHTML = `<section><h3>Canvas</h3><p class="empty-p" data-info>${doc.order.length} objects · ${peers.size + 1} online</p><div class="row" style="margin-top:8px"><button class="btn-o sm" type="button" data-stress>Add 500 shapes (perf test)</button></div><label style="display:flex;gap:8px;align-items:center;margin-top:10px;min-height:32px"><input type="checkbox" data-bot ${botOn ? "checked" : ""}> Simulated teammate</label></section><section><h3>Shortcuts</h3><div class="kbd"><kbd>V</kbd><span>Select</span><kbd>R / O / L / T</kbd><span>Rectangle, ellipse, line, text</span><kbd>Space + drag</kbd><span>Pan (or H)</span><kbd>Ctrl + scroll</kbd><span>Zoom</span><kbd>Shift</kbd><span>Multi-select, constrain, snap rotation 15°</span><kbd>Ctrl + D</kbd><span>Duplicate</span><kbd>Ctrl + G</kbd><span>Group (Shift to ungroup)</span><kbd>Ctrl + L</kbd><span>Lock / unlock</span><kbd>[ / ]</kbd><span>Send backward / bring forward</span><kbd>Ctrl + Z</kbd><span>Undo (Shift to redo)</span><kbd>Arrows</kbd><span>Nudge 1px (Shift: 10px)</span></div></section>`; return; }
      if (sel.length === 1) {
        const s = doc.shapes[sel[0]];
        P.innerHTML = `<section><h3>${esc(s.name || s.type)}${s.locked ? " · locked" : ""}</h3><div class="grid2">${num("x", "X", s.x)}${num("y", "Y", s.y)}${s.type === "text" ? "" : num("w", "W", s.w) + num("h", "H", s.h)}${num("rot", "°", s.rot)}${s.type === "rect" ? num("r", "R", s.r || 0) : ""}</div></section>
          ${s.type === "text" ? `<section><h3>Text</h3><textarea class="txt" data-ptext aria-label="Text content">${esc(s.text)}</textarea><div class="grid2" style="margin-top:8px">${num("fs", "Aa", s.fs)}</div></section>` : ""}
          <section><h3>${s.type === "line" ? "Stroke" : "Fill"}</h3>${colorRow(s.type === "line" ? "stroke" : "fill", s.type === "line" ? "Stroke" : "Fill", s.type === "line" ? s.stroke || s.fill : s.fill)}</section>
          ${s.type === "rect" || s.type === "ellipse" ? `<section><h3>Border</h3>${colorRow("stroke", "Border", s.stroke)}</section>` : ""}
          <section><h3>Arrange</h3><div class="row"><button class="btn-o sm" type="button" data-act="front">Bring to front</button><button class="btn-o sm" type="button" data-act="back">Send to back</button><button class="btn-o sm" type="button" data-act="lock">${icon(s.locked ? "i-unlock" : "i-lock")}${s.locked ? "Unlock" : "Lock"}</button><button class="btn-o sm" type="button" data-act="dup">${icon("i-copy")}Duplicate</button><button class="btn-o sm" type="button" data-act="del">${icon("i-trash")}Delete</button></div></section>`;
      } else {
        const fills = [...new Set(sel.map((id) => doc.shapes[id].fill))];
        P.innerHTML = `<section><h3>${sel.length} selected</h3><div class="row" role="group" aria-label="Align">${[["left", "a-left"], ["hcenter", "a-hcenter"], ["right", "a-right"], ["top", "a-top"], ["vcenter", "a-vcenter"], ["bottom", "a-bottom"]].map(([m, ic]) => `<button class="icon-btn" type="button" data-align="${m}" aria-label="Align ${m}" title="Align ${m}">${icon(ic)}</button>`).join("")}<button class="icon-btn" type="button" data-dist="h" aria-label="Distribute horizontally" title="Distribute horizontally">${icon("a-dh")}</button><button class="icon-btn" type="button" data-dist="v" aria-label="Distribute vertically" title="Distribute vertically">${icon("a-dv")}</button></div></section><section><h3>Fill</h3>${colorRow("fill", "Fill", fills.length === 1 ? fills[0] : "")}</section><section><h3>Arrange</h3><div class="row"><button class="btn-o sm" type="button" data-act="group">Group</button><button class="btn-o sm" type="button" data-act="ungroup">Ungroup</button><button class="btn-o sm" type="button" data-act="lock">${icon("i-lock")}Lock / unlock</button><button class="btn-o sm" type="button" data-act="dup">${icon("i-copy")}Duplicate</button><button class="btn-o sm" type="button" data-act="del">${icon("i-trash")}Delete</button></div></section>`;
      }
      return;
    }
    if (panel === "layers") { P.innerHTML = `<section><h3>Layers · ${doc.order.length}</h3><ul class="layers" data-layers>${doc.order.slice().reverse().slice(0, 300).map((id) => { const s = doc.shapes[id], lb = lockedBy(id); return `<li class="${sel.includes(id) ? "sel" : ""}" data-layer="${id}" tabindex="0" role="button" aria-pressed="${sel.includes(id)}" aria-label="${esc(s.name || s.type)}"><svg class="i"><use href="#${TYPE_IC[s.type]}"/></svg><span class="nm">${esc(s.name || (s.type === "text" ? s.text : s.type))}${s.group ? ' <small style="color:var(--muted)">· grouped</small>' : ""}</span><span>${lb ? `<span class="by" style="background:${lb.color}">${esc(lb.name.split(" ")[0])}</span>` : ""}<button class="icon-btn" type="button" aria-label="${s.locked ? "Unlock" : "Lock"} ${esc(s.name || s.type)}" aria-pressed="${!!s.locked}" data-llock="${id}">${icon(s.locked ? "i-lock" : "i-unlock")}</button><button class="icon-btn" type="button" aria-label="Bring ${esc(s.name || s.type)} forward" data-lup="${id}">${icon("i-up")}</button><button class="icon-btn" type="button" aria-label="Send ${esc(s.name || s.type)} backward" data-ldown="${id}">${icon("i-down")}</button></span></li>`; }).join("")}</ul>${doc.order.length > 300 ? `<p class="empty-p">Showing top 300 layers.</p>` : ""}</section>`; return; }
    if (panel === "ai") {
      P.innerHTML = `<section><h3>AI co-designer</h3><form class="ai-form" data-aiform><label class="sr" for="aiq">Describe a change</label><input id="aiq" autocomplete="off" placeholder="e.g. create a 3x3 grid of buttons"><button class="btn" type="submit" aria-label="Run">${icon("i-send")}</button></form><div class="chips">${["create a 3x3 grid of buttons", "add a red circle at 200, 500", "make a login form", "add a navbar", "rotate selected 45 degrees", "arrange selected horizontally with spacing 24"].map((q) => `<button type="button" data-aichip>${q}</button>`).join("")}</div><p class="empty-p" style="margin-top:10px;font-size:12px">Runs a local rule-based interpreter that emits the same function calls (createShape, moveShape, resizeShape, rotateShape, createText, arrangeShapes, groupShapes) the production <code>/api/ai/interpret</code> endpoint would get from an LLM. Changes sync to everyone.</p><div class="ai-log" data-ailog>${aiLog.map((m) => `<div class="ai-msg ${m.user ? "user" : ""}">${esc(m.text)}${m.calls ? `<pre>${esc(JSON.stringify(m.calls, null, 1))}</pre>` : ""}</div>`).join("")}</div></section>`;
      return;
    }
    if (panel === "history") { const h = store.get("cc-history", []); P.innerHTML = `<section><h3>Version history</h3><div class="row" style="margin-bottom:10px"><button class="btn-o sm" type="button" data-snap>Save snapshot now</button></div><ul class="hist" data-hist>${h.slice().reverse().map((v, i) => `<li><span><b>${new Date(v.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</b><small>${esc(v.by)} · ${v.n} objects</small></span><button class="btn-o sm" type="button" data-restore="${h.length - 1 - i}">Restore</button></li>`).join("") || `<li><span class="empty-p">Snapshots are saved automatically every few seconds after changes (last 50 kept).</span></li>`}</ul></section>`; }
  }
  const P = $("[data-panel]");
  P.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("[data-prop]")) { const k = t.dataset.prop, v = parseFloat(t.value); if (!isFinite(v)) return renderPanel(); const id = sel[0]; change([id], () => { const s = doc.shapes[id]; if (k === "rot") s.rot = ((Math.round(v) % 360) + 360) % 360; else if (k === "fs") { s.fs = Math.max(6, Math.round(v)); fitText(s); } else if (k === "w" || k === "h") s[k] = Math.max(1, Math.round(v)); else s[k] = Math.round(v); }, `set ${k}`); t.blur(); renderPanel(); }
    if (t.matches("[data-color]")) setColor(t.dataset.color, t.value);
    if (t.matches("[data-colortext]")) { const v = t.value.trim(); if (/^#[0-9a-f]{6}$/i.test(v) || v === "none" || v === "") setColor(t.dataset.colortext, v === "none" ? "" : v); else { toast("Use a hex color like #3B82F6"); renderPanel(); } }
    if (t.matches("[data-bot]")) setBot(t.checked);
  });
  P.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches("[data-prop], [data-colortext]")) e.target.dispatchEvent(new Event("change", { bubbles: true })); });
  P.addEventListener("input", (e) => { if (e.target.matches("[data-ptext]")) { const id = sel[0], s = doc.shapes[id]; if (!s) return; if (!P.__tb || P.__tb.id !== id) P.__tb = { id, before: capture([id], false) }; s.text = e.target.value; fitText(s); scheduleRender(); liveSync([id]); } });
  P.addEventListener("focusout", (e) => { if (e.target.matches("[data-ptext]") && P.__tb) { const b = P.__tb; P.__tb = null; commit(b.before, capture([b.id], false), "edit text"); } });
  function setColor(k, v) { const ids = sel.slice(); change(ids, () => ids.forEach((id) => (doc.shapes[id][k] = v)), `set ${k}`); renderPanel(); }
  P.addEventListener("click", (e) => {
    const b = e.target.closest("button, li[data-layer]"); if (!b) return;
    if (b.dataset.swatch) return setColor(b.dataset.swatch, b.dataset.c);
    if (b.dataset.align) return align(b.dataset.align);
    if (b.dataset.dist) return distribute(b.dataset.dist);
    const act = b.dataset.act; if (act) return ({ front: () => reorder(1, true), back: () => reorder(-1, true), lock: () => toggleLock(sel), dup: duplicate, del, group: () => group(sel), ungroup })[act]();
    if (b.dataset.llock) return toggleLock([b.dataset.llock]);
    if (b.dataset.lup || b.dataset.ldown) { const id = b.dataset.lup || b.dataset.ldown, keep = sel; sel = [id]; reorder(b.dataset.lup ? 1 : -1, false); sel = keep; renderPanel(); return; }
    if (b.matches("li[data-layer]")) { const id = b.dataset.layer; if (lockedBy(id)) return toast(`${lockedBy(id).name} is editing this shape`); setSel(e.shiftKey ? (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]) : [id]); return; }
    if (b.hasAttribute("data-aichip")) { $("#aiq").value = b.textContent; $("[data-aiform]").requestSubmit(); return; }
    if (b.hasAttribute("data-stress")) { const t0 = performance.now(), list = []; for (let i = 0; i < 500; i++) list.push(mk(i % 3 ? "rect" : "ellipse", 950 + (i % 25) * 28, 60 + Math.floor(i / 25) * 28, 22, 22, { fill: SWATCHES[2 + (i % 8)], name: `Perf ${i + 1}` })); addShapes(list, "add 500 shapes"); render(); toast(`Added 500 shapes; render took ${Math.round(performance.now() - t0)} ms`); fit(); return; }
    if (b.hasAttribute("data-snap")) { snapshot(true); renderPanel(); return; }
    if (b.dataset.restore) { const v = store.get("cc-history", [])[+b.dataset.restore]; if (!v) return; const before = { shapes: Object.fromEntries(Object.keys(doc.shapes).map((id) => [id, clone(doc.shapes[id])])), order: doc.order.slice(), title: doc.title }; Object.keys(doc.shapes).forEach((id) => { if (!v.doc.shapes[id]) before.shapes[id] = clone(doc.shapes[id]); }); const after = { shapes: { ...Object.fromEntries(Object.keys(doc.shapes).map((id) => [id, null])), ...v.doc.shapes }, order: v.doc.order.slice(), title: v.doc.title }; applyPatch(after); sel = []; commit(before, after, "restore version"); $("[data-title]").value = doc.title; toast(`Restored version from ${new Date(v.at).toLocaleTimeString()}`); }
  });
  P.addEventListener("submit", (e) => {
    if (!e.target.matches("[data-aiform]")) return; e.preventDefault(); const q = $("#aiq").value.trim(); if (!q) return;
    const res = interpret(q); aiLog.unshift({ text: res.msg, calls: res.calls.length ? res.calls : null }, { user: true, text: q }); if (aiLog.length > 30) aiLog.length = 30;
    if (res.calls.length) execute(res.calls); renderPanel(); setTimeout(() => $("#aiq")?.focus(), 0);
  });
  P.addEventListener("keydown", (e) => { const li = e.target.closest("li[data-layer]"); if (li && (e.key === "Enter" || e.key === " ") && e.target === li) { e.preventDefault(); li.click(); } });

  /* ---------- snapshots (version history; last 50) ---------- */
  let dirty = false;
  function snapshot(force) { if (!dirty && !force) return; dirty = false; const h = store.get("cc-history", []); h.push({ at: Date.now(), by: me.name, n: doc.order.length, doc: clone(doc) }); while (h.length > 50) h.shift(); store.set("cc-history", h); if (panel === "history") renderPanel(); }
  setInterval(() => snapshot(false), 4000);

  /* ---------- misc ---------- */
  const title = $("[data-title]"); title.value = doc.title;
  title.addEventListener("change", () => { const before = { shapes: {}, title: doc.title }; doc.title = title.value.trim() || "Untitled design"; title.value = doc.title; commit(before, { shapes: {}, title: doc.title }, "rename"); document.title = `${doc.title} — CollabCanvas`; });
  $("[data-newtab]").addEventListener("click", () => { window.open(location.href, "_blank", "noopener"); toast("Opened a second tab. Edits and cursors sync live"); });
  function toast(m) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; $("[data-toasts]").append(t); setTimeout(() => t.remove(), 2600); }
  addEventListener("resize", () => { scheduleRender(); renderCursors(); });

  window.__cc = { get doc() { return doc; }, get sel() { return sel; }, get view() { return view; }, toScreen, interpret, setBot, peers };
  document.title = `${doc.title} — CollabCanvas`;
  setTool("select"); renderPresence(); hello(); setBot(true); render(); renderPanel();
  requestAnimationFrame(() => { const r = sr(); if (r.width < 700) { view.z = Math.max(0.35, (r.width - 24) / 900); view.x = 12; view.y = 16; scheduleRender(); } });
})();
