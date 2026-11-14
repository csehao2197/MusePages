(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n) => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };

  // ---------- Data ----------
  const NOTE = { C: 0, "C#": 1, D: 2, Eb: 3, E: 4, F: 5, "F#": 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  const BEATS = [
    ["Midnight Drive", "Trap / R&B", 142, "F#", "Minor", "trap", 225],
    ["Velvet Hours", "R&B", 88, "Eb", "Major", "rnb", 198],
    ["Concrete Halo", "Trap", 150, "C", "Minor", "trap", 172],
    ["Neon Psalms", "Drill", 144, "G", "Minor", "drill", 186],
    ["Southside Sunset", "Boom Bap", 92, "A", "Minor", "boom", 204],
    ["Gold Static", "Trap / Soul", 128, "D", "Minor", "rnb", 191],
  ].map(([title, genre, bpm, key, mode, style, duration], i) => ({ i, title, genre, bpm, key, mode, style, duration, price: 29.99, root: 48 + NOTE[key] - (NOTE[key] > 7 ? 12 : 0), major: mode === "Major", seed: i + 1 }));
  const TIERS = [["Basic", 29.99, "MP3 (tagged) · 5,000 streams"], ["Premium", 79.99, "WAV + MP3 (untagged) · 100,000 streams"], ["Exclusive", 499, "WAV + Stems + MP3 · full ownership"]];
  const DISC = [["Lil Baby", "Venom", 2025, "24M"], ["SZA", "Late Nights", 2025, "18M"], ["21 Savage", "Red Opps", 2024, "31M"], ["Summer Walker", "Session 33", 2024, "12M"], ["Gunna", "Top Floor", 2023, "27M"], ["6LACK", "Switch", 2023, "9M"]];

  // ---------- Art ----------
  $("[data-hero-bg]").innerHTML = Art.studio();
  $("[data-portrait]").innerHTML = Art.portrait();
  const eq = $("[data-eq]"); eq.innerHTML = Array.from({ length: 48 }, (_, i) => `<i style="animation-delay:${(-(i * 137) % 1600) / 1000}s;animation-duration:${1.2 + ((i * 7) % 9) / 10}s"></i>`).join("");
  const eqBars = $$("i", eq);

  // ---------- Beats ----------
  const list = $("[data-beats]");
  list.innerHTML = BEATS.map((b) => `<li class="beat" data-beat="${b.i}">
      <div class="b-art">${Art.cover(b.i, b.title)}<button class="b-play" type="button" data-play="${b.i}" aria-label="Play ${b.title}" aria-pressed="false">${ic("play")}</button></div>
      <div class="b-info"><h3>${b.title}</h3><span class="pill">${b.genre}</span><p class="b-meta">${b.bpm} BPM · ${b.key} ${b.mode}</p><p class="b-price">From $${b.price.toFixed(2)}</p><button class="b-lic" type="button" data-license="${b.i}">${ic("cart")}License</button></div>
      <canvas class="b-wave" data-wave width="600" height="96" hidden aria-hidden="true"></canvas></li>`).join("");

  // ---------- Player ----------
  let eng = null, cur = null, paused = false, raf = 0;
  const player = $("[data-player]"), seek = $("[data-pl-seek]"), vol = $("[data-pl-vol]");
  const setRange = (el) => el.style.setProperty("--p", `${(el.value / el.max) * 100}%`);
  setRange(vol);
  function ensure() { if (!eng) { eng = window.Synth && Synth.create(); if (!eng) { toast("Audio preview isn't supported in this browser."); return false; } eng.onEnd = () => next(1); eng.volume(vol.value / 100); } return true; }
  async function play(i, pos = 0) {
    if (!ensure()) return;
    cur = BEATS[i]; paused = false;
    await eng.play(cur, pos);
    player.hidden = false; document.body.classList.add("has-player");
    $("[data-pl-art]").innerHTML = Art.cover(cur.i, cur.title, ""); $("[data-pl-title]").textContent = cur.title;
    $("[data-pl-dur]").textContent = fmt(cur.duration);
    sync(); loop();
  }
  function sync() {
    const on = !!cur && !paused;
    $$("[data-beat]").forEach((li) => { const me = cur && +li.dataset.beat === cur.i; li.classList.toggle("on", me); const b = $("[data-play]", li); const p = me && on; b.innerHTML = ic(p ? "pause" : "play"); b.setAttribute("aria-pressed", String(p)); b.setAttribute("aria-label", `${p ? "Pause" : "Play"} ${BEATS[+li.dataset.beat].title}`); $("[data-wave]", li).hidden = !me; });
    const t = $('[data-pl="toggle"]'); t.innerHTML = ic(on ? "pause" : "play"); t.setAttribute("aria-label", on ? "Pause" : "Play");
    eq.classList.toggle("live", on);
  }
  async function toggle() { if (!cur || !eng) return; if (paused) { await eng.resume(); paused = false; } else { await eng.pause(); paused = true; } sync(); }
  function next(d) { if (!cur) return; play((cur.i + d + BEATS.length) % BEATS.length); }
  list.addEventListener("click", (e) => {
    const p = e.target.closest("[data-play]");
    if (p) { const i = +p.dataset.play; if (cur && cur.i === i) toggle(); else play(i); }
  });
  $$("[data-pl]").forEach((b) => b.addEventListener("click", () => { const a = b.dataset.pl; if (a === "toggle") toggle(); else next(a === "next" ? 1 : -1); }));
  seek.addEventListener("input", () => { if (!cur) return; setRange(seek); $("[data-pl-cur]").textContent = fmt((seek.value / 1000) * cur.duration); });
  seek.addEventListener("change", () => { if (cur) eng.seek((seek.value / 1000) * cur.duration); });
  vol.addEventListener("input", () => { setRange(vol); if (eng) eng.volume(vol.value / 100); });
  document.addEventListener("keydown", (e) => { if (e.code === "Space" && cur && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName) && !document.querySelector("dialog[open]")) { e.preventDefault(); toggle(); } });
  const buf = new Uint8Array(1024), fbuf = new Uint8Array(512);
  function loop() {
    cancelAnimationFrame(raf);
    const draw = () => {
      if (!cur) return;
      const t = eng.time();
      if (document.activeElement !== seek) { seek.value = Math.round((t / cur.duration) * 1000); setRange(seek); $("[data-pl-cur]").textContent = fmt(t); }
      const cv = $(`[data-beat="${cur.i}"] [data-wave]`), c = cv.getContext("2d");
      eng.analyser.getByteTimeDomainData(buf);
      c.clearRect(0, 0, cv.width, cv.height);
      const g = c.createLinearGradient(0, 0, cv.width, 0); g.addColorStop(0, "#8B5CF6"); g.addColorStop(1, "#22D3EE");
      c.strokeStyle = g; c.lineWidth = 3; c.beginPath();
      for (let x = 0; x < cv.width; x++) { const v = buf[Math.floor((x / cv.width) * buf.length)] / 128 - 1, y = cv.height / 2 + v * cv.height * 0.9; if (x) c.lineTo(x, y); else c.moveTo(x, y); }
      c.stroke();
      if (!paused && !reduce()) { eng.analyser.getByteFrequencyData(fbuf); eqBars.forEach((b, k) => { b.style.transform = `scaleY(${Math.max(0.08, fbuf[Math.floor(k * 4 + 2)] / 255)})`; }); }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
  }
  window.MuseKvolt = { state: () => ({ beat: cur && cur.title, paused, time: eng ? eng.time() : 0, playing: eng ? eng.playing() : false, vol: +vol.value }) };

  // ---------- Licensing ----------
  const lm = $("[data-modal=license]"), lf = $("[data-lic]");
  $("[data-lic-beat]").innerHTML = BEATS.map((b) => `<option value="${b.i}">${b.title} — ${b.bpm} BPM · ${b.key} ${b.mode}</option>`).join("");
  $("[data-lic-tiers]").innerHTML = TIERS.map(([n, p, d], k) => `<label><input type="radio" name="tier" value="${n}"${k === 1 ? " checked" : ""}><span><b>${n}</b><br><small>${d}</small></span><b>$${n === "Exclusive" ? "499+" : p.toFixed(2)}</b></label>`).join("");
  function licSum() {
    const b = BEATS[+lf.beat.value], tier = $('[name="tier"]:checked', lf).value, excl = tier === "Exclusive";
    $("[data-offer]").hidden = !excl;
    const price = excl ? Math.max(499, +lf.offer.value || 0) : TIERS.find((t) => t[0] === tier)[1];
    $("[data-lic-sum]").innerHTML = `<span>${b.title} · ${tier} license</span><b>$${price.toFixed(2)}</b><span>${excl ? "Exclusive offers are reviewed within 24 hours; the beat is removed from the store once accepted." : "Instant download after checkout. Credit: Prod. KVOLT."}</span>`;
    return { b, tier, price };
  }
  function openLicense(beatI, tier) {
    lf.hidden = false; $("[data-lic-done]").hidden = true; $("[data-lic-err]").textContent = "";
    if (beatI != null) lf.beat.value = beatI;
    if (tier) $(`[name="tier"][value="${tier}"]`, lf).checked = true;
    licSum(); lm.showModal();
  }
  lf.addEventListener("change", licSum); lf.addEventListener("input", licSum);
  document.addEventListener("click", (e) => {
    const l = e.target.closest("[data-license]"); if (l) { closeMenu(); openLicense(l.dataset.license === "" ? (cur ? cur.i : 0) : +l.dataset.license); return; }
    const t = e.target.closest("[data-tier]"); if (t) openLicense(cur ? cur.i : 0, t.dataset.tier);
  });
  $("[data-pl-license]").addEventListener("click", () => openLicense(cur ? cur.i : 0, "Premium"));
  lf.addEventListener("submit", (e) => {
    e.preventDefault();
    const { b, tier, price } = licSum(), err = $("[data-lic-err]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lf.email.value.trim())) { lf.email.setAttribute("aria-invalid", "true"); err.textContent = "Enter the email where your files should be delivered."; lf.email.focus(); return; }
    if (tier === "Exclusive" && (+lf.offer.value || 0) < 499) { err.textContent = "Exclusive offers start at $499."; lf.offer.focus(); return; }
    lf.email.removeAttribute("aria-invalid"); err.textContent = "";
    $("[data-lic-done-text]").textContent = tier === "Exclusive" ? `Offer of $${price.toFixed(2)} for exclusive rights to “${b.title}” received. KVOLT will reply to ${lf.email.value.trim()} within 24 hours. (Demo — no payment was taken.)` : `“${b.title}” — ${tier} license ($${price.toFixed(2)}). Checkout and file delivery would go to ${lf.email.value.trim()}. (Demo — no payment was taken.)`;
    lf.hidden = true; $("[data-lic-done]").hidden = false; $("[data-lic-done]").focus();
  });
  $("[data-view-all]").addEventListener("click", () => toast("The full catalog of 500+ beats isn't part of this demo — these six are the latest drops."));

  // ---------- Discography ----------
  $("[data-disc]").innerHTML = DISC.map(([a, t, y, s], k) => `<li class="dc"><div class="dc-art">${Art.cover(k + 6, t, `Abstract cover art for ${a} — ${t}`)}<div class="dc-links"><a href="https://open.spotify.com/" target="_blank" rel="noopener" aria-label="Listen to ${a} — ${t} on Spotify">${ic("sp")}</a><a href="https://music.apple.com/" target="_blank" rel="noopener" aria-label="Listen to ${a} — ${t} on Apple Music">${ic("am")}</a></div></div><b>${a}</b><p class="t">${t}</p><p><span class="y">${y}</span><span class="st">${s} streams</span></p></li>`).join("");
  $("[data-disc-all]").addEventListener("click", () => toast("Full placement list available on request — ask in the booking form."));

  // ---------- Nav & menu ----------
  const nav = $("[data-nav]");
  const onScroll = () => nav.classList.toggle("solid", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const menu = $("[data-menu]"), mb = $("[data-menu-btn]");
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; mb.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  mb.addEventListener("click", () => { menu.hidden = false; mb.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("[data-menu-close]").focus(); });
  $("[data-menu-close]").addEventListener("click", () => { closeMenu(); mb.focus(); });
  menu.addEventListener("click", (e) => { if (e.target.closest("nav a")) closeMenu(); });
  menu.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeMenu(); mb.focus(); }
    if (e.key === "Tab") { const f = $$("a, button", menu), a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- Contact, newsletter, legal ----------
  const form = $("[data-form]");
  $("[data-book]").addEventListener("click", () => { form.service.value = "Studio Session"; });
  $("[data-custom]").addEventListener("click", () => { form.service.value = "Custom Production"; form.budget.value = "Let's Discuss"; });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = []; $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (form.name.value.trim().length < 2) bad(form.name, "your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) bad(form.email, "a valid email");
    if (form.desc.value.trim().length < 15) bad(form.desc, "a short project description");
    if (form.ref.value.trim() && !/^https?:\/\/\S+\.\S+/.test(form.ref.value.trim())) bad(form.ref, "a full reference link (https://…) or leave it blank");
    $("[data-err]").textContent = errs.length ? `Please add ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", form).focus(); return; }
    $("[data-sent-text]").textContent = `Thanks, ${form.name.value.trim().split(/\s+/)[0]} — your ${form.service.value.toLowerCase()} request (${form.budget.value}) is in. Expect a reply at ${form.email.value.trim()} in under 4 hours. (Demo — nothing was sent.)`;
    form.hidden = true; $("[data-sent]").hidden = false; $("[data-sent]").focus();
  });
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault(); const inp = $("#news-email"), m = $("[data-news-msg]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim())) { m.textContent = "Enter a valid email to get free beat drops."; inp.setAttribute("aria-invalid", "true"); inp.focus(); return; }
    inp.removeAttribute("aria-invalid"); m.textContent = "You're on the list — first drop lands Friday. (Demo — nothing was sent.)"; inp.value = "";
  });
  const LEGAL = { "Terms of Service": "Use of this site and its previews is for personal evaluation. Beats may not be downloaded, recorded or redistributed without a license.", "License Agreement": "Each license grants the rights listed on its tier card. Non-exclusive licenses may be sold to other artists until an exclusive is purchased. Credit must read “Prod. KVOLT”.", "Privacy Policy": "Inquiry and newsletter details are used only to reply to you and send beat drops. No tracking cookies are used.", "Refund Policy": "Digital licenses are non-refundable once files are delivered. Exclusive offers can be withdrawn until accepted." };
  $$("[data-legal]").forEach((b) => b.addEventListener("click", () => { $("[data-legal-title]").textContent = b.dataset.legal; $("[data-legal-text]").textContent = `${LEGAL[b.dataset.legal]} (Sample policy text.)`; $("[data-modal=legal]").showModal(); }));
})();
