// Visual effects without libraries: 3D particle field (canvas), interactive skill sphere and SVG screen mockups.
(function () {
  "use strict";
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 3D particle field: points on a slowly rotating sphere + noise, perspective projected ---------- */
  function particles(canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, dpr = 1, raf = 0, t = 0, mx = 0, my = 0, running = false;
    const N = innerWidth < 700 ? 110 : 220;
    const pts = Array.from({ length: N }, (_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N), th = Math.PI * (1 + Math.sqrt(5)) * i, r = 1 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.9;
      return { x: Math.sin(phi) * Math.cos(th) * r, y: Math.cos(phi) * r, z: Math.sin(phi) * Math.sin(th) * r, c: i % 7 === 0 ? "255,0,170" : i % 3 === 0 ? "123,47,255" : "0,240,255" };
    });
    function size() { dpr = Math.min(2, devicePixelRatio || 1); W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function frame() {
      t += reduce() ? 0 : 0.0016;
      ctx.clearRect(0, 0, W, H);
      const ry = t * 1.4 + mx * 0.6, rx = 0.35 + my * 0.4, cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      const S = Math.min(W, H) * 0.42, ox = W * (W > 900 ? 0.68 : 0.5), oy = H * 0.5;
      const proj = pts.map((p) => { const x = p.x * cy - p.z * sy, z1 = p.x * sy + p.z * cy, y = p.y * cx - z1 * sx, z = p.y * sx + z1 * cx, k = 3 / (3 + z); return { X: ox + x * S * k, Y: oy + y * S * k, k, z, c: p.c }; });
      ctx.lineWidth = 0.6;
      for (let i = 0; i < proj.length; i += 2) for (let j = i + 1; j < Math.min(proj.length, i + 14); j++) {
        const a = proj[i], b = proj[j], d = Math.hypot(a.X - b.X, a.Y - b.Y);
        if (d < S * 0.22) { ctx.strokeStyle = `rgba(0,240,255,${(1 - d / (S * 0.22)) * 0.16 * a.k})`; ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke(); }
      }
      proj.sort((a, b) => b.z - a.z).forEach((p) => { const r = 1.6 * p.k * p.k; ctx.fillStyle = `rgba(${p.c},${0.35 + 0.5 * (p.k - 0.6)})`; ctx.beginPath(); ctx.arc(p.X, p.Y, r, 0, 6.283); ctx.fill(); });
      canvas.dataset.frames = String(+(canvas.dataset.frames || 0) + 1);
      if (running && !reduce()) raf = requestAnimationFrame(frame);
    }
    const onMove = (e) => { if (e.pointerType !== "mouse") return; mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; if (reduce()) frame(); };
    size(); addEventListener("resize", () => { size(); frame(); });
    addEventListener("pointermove", onMove, { passive: true });
    return {
      start() { if (running) return; running = true; frame(); },
      stop() { running = false; cancelAnimationFrame(raf); }
    };
  }

  /* ---------- skill sphere: DOM tags placed on a sphere, drag or arrow keys to rotate ---------- */
  function sphere(el, words) {
    const n = words.length;
    el.innerHTML = words.map((w, i) => `<span class="tagw" data-i="${i}">${w}</span>`).join("");
    const tags = [...el.children];
    const base = words.map((_, i) => { const phi = Math.acos(1 - (2 * (i + 0.5)) / n), th = Math.PI * (1 + Math.sqrt(5)) * i; return [Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]; });
    let ax = 0.3, ay = 0, vx = 0.002, vy = 0.004, drag = null, raf = 0;
    function draw() {
      const R = el.clientWidth * 0.4, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      base.forEach(([x, y, z], i) => { const x1 = x * cy - z * sy, z1 = x * sy + z * cy, y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx, s = (z2 + 2) / 3; tags[i].style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px,${y1 * R}px,0) scale(${0.6 + s * 0.55})`; tags[i].style.opacity = 0.25 + s * 0.75; tags[i].style.zIndex = Math.round(s * 100); });
    }
    function loop() { if (!drag && !reduce()) { ax += vx; ay += vy; } draw(); raf = requestAnimationFrame(loop); }
    el.addEventListener("pointerdown", (e) => { drag = [e.clientX, e.clientY]; el.setPointerCapture(e.pointerId); });
    el.addEventListener("pointermove", (e) => { if (!drag) return; const dx = e.clientX - drag[0], dy = e.clientY - drag[1]; ay += dx * 0.008; ax -= dy * 0.008; vy = dx * 0.0006; vx = -dy * 0.0006; drag = [e.clientX, e.clientY]; draw(); });
    el.addEventListener("pointerup", () => (drag = null)); el.addEventListener("pointercancel", () => (drag = null));
    el.addEventListener("keydown", (e) => { const k = { ArrowLeft: [0, -0.2], ArrowRight: [0, 0.2], ArrowUp: [-0.2, 0], ArrowDown: [0.2, 0] }[e.key]; if (!k) return; e.preventDefault(); ax += k[0]; ay += k[1]; draw(); el.dataset.rot = `${ax.toFixed(2)},${ay.toFixed(2)}`; });
    draw(); loop();
    return { stop: () => cancelAnimationFrame(raf) };
  }

  /* ---------- SVG mock screens for projects (variant 0 = overview, 1 = detail, 2 = mobile) ---------- */
  function screen(p, v, label) {
    const c = p.color, seed = p.slug.length * 7 + v * 13;
    const r = (i) => ((Math.sin(seed + i * 9.13) + 1) / 2);
    let s = `<defs><linearGradient id="g${p.slug}${v}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="#7b2fff" stop-opacity=".05"/></linearGradient></defs><rect width="800" height="500" fill="#0d0d16"/><rect width="800" height="500" fill="url(#g${p.slug}${v})"/>`;
    if (v === 2) {
      s += [0, 1].map((k) => `<g transform="translate(${230 + k * 200} ${50 + k * 30})"><rect width="170" height="360" rx="26" fill="#05050a" stroke="${c}" stroke-opacity=".5"/><rect x="10" y="12" width="150" height="336" rx="18" fill="#12121c"/><rect x="24" y="34" width="80" height="10" rx="5" fill="${c}"/>${[0, 1, 2, 3].map((i) => `<rect x="24" y="${64 + i * 66}" width="122" height="54" rx="10" fill="#1b1b2a"/><rect x="34" y="${76 + i * 66}" width="${40 + r(i + k) * 60}" height="8" rx="4" fill="#e4e4e7" opacity=".7"/><rect x="34" y="${92 + i * 66}" width="${30 + r(i * 2) * 50}" height="8" rx="4" fill="${i % 2 ? "#ff00aa" : c}" opacity=".7"/>`).join("")}</g>`).join("");
    } else {
      s += `<rect x="40" y="30" width="720" height="440" rx="14" fill="#12121c" stroke="${c}" stroke-opacity=".35"/><circle cx="62" cy="52" r="5" fill="#ff5f57"/><circle cx="80" cy="52" r="5" fill="#febc2e"/><circle cx="98" cy="52" r="5" fill="#28c840"/><text x="130" y="57" font-family="JetBrains Mono, monospace" font-size="13" fill="#71717a">${p.slug}.app</text>`;
      if (v === 0) {
        s += `<rect x="40" y="74" width="150" height="396" fill="#0f0f18"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="60" y="${100 + i * 34}" width="${70 + r(i) * 40}" height="10" rx="5" fill="${i === 0 ? c : "#3f3f46"}"/>`).join("")}`;
        s += [0, 1, 2].map((i) => `<rect x="${214 + i * 178}" y="96" width="162" height="86" rx="10" fill="#1b1b2a"/><text x="${232 + i * 178}" y="150" font-family="Outfit, sans-serif" font-size="28" font-weight="700" fill="${[c, "#e4e4e7", "#ff00aa"][i]}">${p.results[i][0]}</text><rect x="${232 + i * 178}" y="160" width="90" height="7" rx="3.5" fill="#52525b"/>`).join("");
        s += `<rect x="214" y="200" width="518" height="246" rx="10" fill="#1b1b2a"/><path d="M234 420 ${Array.from({ length: 12 }, (_, i) => `L${234 + i * 44} ${400 - r(i) * 120 - i * 10}`).join(" ")}" stroke="${c}" stroke-width="3" fill="none" stroke-linejoin="round"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${238 + i * 44}" y="${430 - r(i + 3) * 60}" width="20" height="${r(i + 3) * 60}" rx="3" fill="#7b2fff" opacity=".45"/>`).join("")}`;
      } else {
        s += `<rect x="64" y="96" width="320" height="350" rx="12" fill="#1b1b2a"/><circle cx="224" cy="230" r="80" fill="none" stroke="#27273a" stroke-width="18"/><circle cx="224" cy="230" r="80" fill="none" stroke="${c}" stroke-width="18" stroke-dasharray="${300 + r(1) * 150} 600" transform="rotate(-90 224 230)" stroke-linecap="round"/><text x="224" y="242" text-anchor="middle" font-family="Outfit, sans-serif" font-size="34" font-weight="700" fill="#e4e4e7">${p.results[0][0]}</text>${[0, 1].map((i) => `<rect x="94" y="${350 + i * 30}" width="${150 + r(i) * 100}" height="10" rx="5" fill="#3f3f46"/>`).join("")}`;
        s += [0, 1, 2, 3, 4].map((i) => `<rect x="408" y="${96 + i * 72}" width="328" height="58" rx="10" fill="#1b1b2a"/><circle cx="436" cy="${125 + i * 72}" r="12" fill="${[c, "#7b2fff", "#ff00aa"][i % 3]}" opacity=".8"/><rect x="460" y="${114 + i * 72}" width="${120 + r(i) * 120}" height="9" rx="4.5" fill="#e4e4e7" opacity=".75"/><rect x="460" y="${130 + i * 72}" width="${70 + r(i + 5) * 80}" height="8" rx="4" fill="#52525b"/>`).join("");
      }
    }
    return `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${s}</svg>`;
  }

  window.FX = { particles, sphere, screen };
})();
