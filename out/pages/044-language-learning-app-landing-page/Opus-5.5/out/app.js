(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- UI language (EN / ES / FR) ----------
  const I18N = {
    en: { skip: "Skip to languages", nav1: "How It Works", nav2: "Languages", nav3: "Pricing", nav4: "Blog", nav5: "For Schools", cta: "Start Learning Free", h1: "Speak a New Language in 30 Days", sub: "AI-powered conversations that adapt to your level. Practice speaking, listening, and reading — 15 minutes a day is all it takes.", cta2: "Start Free — No Credit Card", watch: "Watch How It Works" },
    es: { skip: "Ir a los idiomas", nav1: "Cómo funciona", nav2: "Idiomas", nav3: "Precios", nav4: "Blog", nav5: "Para escuelas", cta: "Empieza gratis", h1: "Habla un nuevo idioma en 30 días", sub: "Conversaciones con IA que se adaptan a tu nivel. Practica hablar, escuchar y leer: solo 15 minutos al día.", cta2: "Empieza gratis, sin tarjeta", watch: "Mira cómo funciona" },
    fr: { skip: "Aller aux langues", nav1: "Comment ça marche", nav2: "Langues", nav3: "Tarifs", nav4: "Blog", nav5: "Pour les écoles", cta: "Commencer gratuitement", h1: "Parlez une nouvelle langue en 30 jours", sub: "Des conversations avec l'IA qui s'adaptent à votre niveau. Parlez, écoutez et lisez — 15 minutes par jour suffisent.", cta2: "Gratuit — sans carte bancaire", watch: "Voir comment ça marche" },
  };
  function setUi(lang) { document.documentElement.lang = lang; $$("[data-i18n]").forEach((el) => { el.textContent = I18N[lang][el.dataset.i18n]; }); }
  $("[data-ui-lang]").addEventListener("change", (e) => { setUi(e.target.value); say({ en: "Site language: English", es: "Idioma del sitio: Español", fr: "Langue du site : Français" }[e.target.value]); });

  // ---------- languages + lesson preview ----------
  const LANGS = [
    { k: "es", n: "Spanish", lessons: "240+", learners: "48M", voice: "es-ES", words: [["la playa", "", "the beach"], ["el mercado", "", "the market"], ["la cena", "", "dinner"]], sentence: ["Vamos a la playa mañana.", "We're going to the beach tomorrow."] },
    { k: "fr", n: "French", lessons: "210+", learners: "32M", voice: "fr-FR", words: [["la boulangerie", "", "the bakery"], ["le train", "", "the train"], ["un café", "", "a coffee"]], sentence: ["Je prends un café à la gare.", "I'm getting a coffee at the station."] },
    { k: "ja", n: "Japanese", lessons: "180+", learners: "18M", voice: "ja-JP", words: [["駅", "eki", "station"], ["電車", "densha", "train"], ["ありがとう", "arigatō", "thank you"]], sentence: ["駅はどこですか？", "Where is the station?"] },
    { k: "de", n: "German", lessons: "195+", learners: "22M", voice: "de-DE", words: [["der Bahnhof", "", "the train station"], ["das Frühstück", "", "breakfast"], ["die Stadt", "", "the city"]], sentence: ["Ich fahre morgen in die Stadt.", "I'm going into the city tomorrow."] },
    { k: "zh", n: "Mandarin", lessons: "200+", learners: "28M", voice: "zh-CN", words: [["你好", "nǐ hǎo", "hello"], ["谢谢", "xièxie", "thank you"], ["朋友", "péngyou", "friend"]], sentence: ["我想喝茶。", "I'd like to drink tea."] },
  ];
  let cur = 0;
  $("[data-langs]").innerHTML = LANGS.map((l, i) => `<button class="lang" type="button" role="radio" aria-checked="${i === 0}" data-lang="${i}"><span class="flag">${window.Flags[l.k]}</span><b>${l.n}</b><span class="l-meta">${l.lessons} lessons · ${l.learners} speakers learning</span></button>`).join("");
  function speak(text, voice) {
    if (!("speechSynthesis" in window)) { say("Audio preview isn't supported in this browser."); return; }
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = voice; u.rate = 0.9; speechSynthesis.speak(u); say(`Playing: ${text}`); } catch { say("Audio preview isn't available here."); }
  }
  function renderPreview() {
    const l = LANGS[cur];
    $$("[data-lang]").forEach((b, i) => { b.setAttribute("aria-checked", String(i === cur)); b.classList.toggle("on", i === cur); });
    $("[data-preview]").innerHTML = `<div class="pv-screen"><div class="pv-top"><span class="pv-flag">${window.Flags[l.k]}</span><b>${l.n} · Lesson 1: Getting around</b><span class="pv-xp">+15 XP</span></div>
      <ul class="pv-words">${l.words.map(([w, rom, tr]) => `<li><button class="say" type="button" aria-label="Hear ${esc(w)}" data-say="${esc(w)}">${icon("volume")}</button><span class="pv-w" lang="${l.k}">${esc(w)}${rom ? `<small>${esc(rom)}</small>` : ""}</span><span class="pv-t">${esc(tr)}</span></li>`).join("")}</ul>
      <div class="pv-sent"><p lang="${l.k}">${esc(l.sentence[0])}</p><p class="pv-tr">${esc(l.sentence[1])}</p><button class="btn btn-ghost btn-sm" type="button" data-say="${esc(l.sentence[0])}">${icon("volume")}Listen</button></div></div>
      <div class="pv-copy"><h3>Your first ${l.n} lesson</h3><p>${l.lessons} lessons from first words to fluent conversation, with an AI partner that adapts to your pace.</p><a class="btn btn-primary" href="#pricing">Start ${l.n} free</a></div>`;
  }
  $("[data-langs]").addEventListener("click", (e) => { const b = e.target.closest("[data-lang]"); if (b) { cur = +b.dataset.lang; renderPreview(); } });
  $("[data-langs]").addEventListener("keydown", (e) => { if (!/Arrow(Left|Right)/.test(e.key)) return; e.preventDefault(); cur = (cur + (e.key === "ArrowRight" ? 1 : -1) + LANGS.length) % LANGS.length; renderPreview(); $(`[data-lang="${cur}"]`).focus(); });
  $("[data-preview]").addEventListener("click", (e) => { const b = e.target.closest("[data-say]"); if (b) speak(b.dataset.say, LANGS[cur].voice); });
  $$("[data-pick]").forEach((a) => a.addEventListener("click", () => { cur = LANGS.findIndex((l) => l.k === a.dataset.pick); renderPreview(); }));
  renderPreview();

  // ---------- step art ----------
  $$("[data-step]").forEach((el) => { el.innerHTML = window.Steps[el.dataset.step]; });

  // ---------- mini lesson: tap or drag to match ----------
  const PAIRS = [["Hola", "Hello"], ["Gracias", "Thank You"], ["Amigo", "Friend"], ["Libro", "Book"]];
  const shuffleDst = [2, 0, 3, 1];
  $("[data-l-flag]").innerHTML = window.Flags.es;
  let sel = null, done = new Set();
  function renderLesson() {
    $('[data-col="src"]').innerHTML = PAIRS.map(([s], i) => `<button class="tile src${done.has(i) ? " ok" : ""}" type="button" draggable="${!done.has(i)}" data-src="${i}" ${done.has(i) ? "disabled" : ""} lang="es">${s}</button>`).join("");
    $('[data-col="dst"]').innerHTML = shuffleDst.map((i) => `<button class="tile dst${done.has(i) ? " ok" : ""}" type="button" data-dst="${i}" ${done.has(i) ? "disabled" : ""}>${PAIRS[i][1]}</button>`).join("");
    $("[data-l-score]").textContent = `${done.size}/4`;
    $("[data-l-bar]").style.width = `${(done.size / 4) * 100}%`;
  }
  function attempt(s, d) {
    const a = $(`[data-src="${s}"]`), b = $(`[data-dst="${d}"]`);
    if (s === d) { done.add(s); sel = null; $("[data-l-hint]").textContent = `Correct: ${PAIRS[s][0]} = ${PAIRS[s][1]}`; renderLesson(); if (done.size === 4) finish(); }
    else { [a, b].forEach((x) => { x.classList.remove("bad"); void x.offsetWidth; x.classList.add("bad"); }); $("[data-l-hint]").textContent = `Not quite — “${PAIRS[s][0]}” isn't “${PAIRS[d][1]}”. Try again.`; sel = null; $$(".tile.src").forEach((t) => t.classList.remove("sel")); }
  }
  const lesson = $("[data-lesson]");
  lesson.addEventListener("click", (e) => {
    const s = e.target.closest("[data-src]"), d = e.target.closest("[data-dst]");
    if (s) { sel = +s.dataset.src; $$(".tile.src").forEach((t) => t.classList.toggle("sel", t === s)); $("[data-l-hint]").textContent = `Selected “${PAIRS[sel][0]}”. Now tap its translation.`; }
    if (d) { if (sel === null) { $("[data-l-hint]").textContent = "Pick a Spanish word first."; return; } attempt(sel, +d.dataset.dst); }
  });
  lesson.addEventListener("dragstart", (e) => { const s = e.target.closest("[data-src]"); if (!s) return; e.dataTransfer.setData("text/plain", s.dataset.src); e.dataTransfer.effectAllowed = "move"; s.classList.add("sel"); });
  lesson.addEventListener("dragover", (e) => { if (e.target.closest("[data-dst]")) { e.preventDefault(); e.target.closest("[data-dst]").classList.add("over"); } });
  lesson.addEventListener("dragleave", (e) => { const d = e.target.closest("[data-dst]"); if (d) d.classList.remove("over"); });
  lesson.addEventListener("drop", (e) => { const d = e.target.closest("[data-dst]"); if (!d) return; e.preventDefault(); d.classList.remove("over"); attempt(+e.dataTransfer.getData("text/plain"), +d.dataset.dst); });
  function finish() {
    const box = $("[data-l-done]"); box.hidden = false;
    const c = $("[data-confetti]"), ctx = c.getContext("2d"), w = (c.width = box.clientWidth), h = (c.height = box.clientHeight);
    const cols = ["#7C3AED", "#06B6D4", "#F59E0B", "#EC4899", "#10B981"];
    const P = Array.from({ length: still ? 0 : 120 }, () => ({ x: w / 2, y: h * 0.4, vx: (Math.random() - 0.5) * 9, vy: -Math.random() * 9 - 3, r: Math.random() * 6 + 3, c: cols[(Math.random() * 5) | 0], a: Math.random() * 6 }));
    let t = 0;
    (function frame() { ctx.clearRect(0, 0, w, h); P.forEach((p) => { p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); }); if (++t < 140) requestAnimationFrame(frame); else ctx.clearRect(0, 0, w, h); })();
    $("[data-l-reset]").focus();
  }
  $("[data-l-reset]").addEventListener("click", () => { done = new Set(); sel = null; $("[data-l-done]").hidden = true; $("[data-l-hint]").textContent = "Tap a Spanish word, then its English match — or drag one onto the other."; renderLesson(); });
  renderLesson();

  // ---------- dashboard bars ----------
  const XP = [["M", 120], ["T", 180], ["W", 90], ["T", 240], ["F", 200], ["S", 310], ["S", 150]];
  $("[data-bars]").innerHTML = XP.map(([d, v]) => `<span style="--h:${(v / 310) * 100}%" title="${v} XP"><i></i><small>${d}</small></span>`).join("");

  // ---------- testimonials stars ----------
  $$(".tm .stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  // ---------- pricing ----------
  let annual = false;
  const PLANS = [["Free", 0, ["1 language", "5 min/day", "Basic lessons", "No speech practice"]], ["Pro", 9.99, ["All languages", "Unlimited practice", "AI speech coach", "Offline mode", "Story mode"], true], ["Family", 14.99, ["Up to 5 accounts", "All Pro features", "Parental progress dashboard"]]];
  function renderPlans() {
    $("[data-plans]").innerHTML = PLANS.map(([n, p, feats, pop]) => { const m = annual ? Math.round(p * 0.6 * 100) / 100 : p; return `<article class="plan${pop ? " pop" : ""}">${pop ? '<span class="badge">Most Popular</span>' : ""}<h3>${n}</h3><p class="price"><b>$${m.toFixed(2).replace(/\.00$/, "")}</b>/month</p><p class="billed">${p === 0 ? "Free forever" : annual ? `$${(m * 12).toFixed(2)} billed yearly · save 40%` : "Billed monthly"}</p><ul>${feats.map((f) => `<li class="${/^No /.test(f) ? "no" : ""}">${icon(/^No /.test(f) ? "close" : "check")}${f}</li>`).join("")}</ul><button class="btn ${pop ? "btn-primary" : "btn-ghost"}" type="button" data-trial="${n}">Start Free Trial</button></article>`; }).join("");
  }
  $$("[data-bill]").forEach((b) => b.addEventListener("click", () => { annual = b.dataset.bill === "a"; $$("[data-bill]").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", String(x === b)); }); renderPlans(); }));
  renderPlans();

  // ---------- FAQ (smooth height) ----------
  const FAQ = [["Is LinguaLeap really free?", "Yes! The Free plan gives you access to one language with basic lessons for 5 minutes a day — no credit card, no time limit."], ["How is this different from Duolingo?", "LinguaLeap focuses heavily on real conversation practice with AI, plus phoneme-level pronunciation scoring, rather than mostly tap-to-translate drills."], ["Can I use it offline?", "Pro and Family plans allow you to download lessons and stories to practice without internet. Progress syncs when you reconnect."], ["What age is this for?", "Ages 13+. Our Family plan includes a kid-friendly mode for ages 8-12 with parental progress reports."], ["Do I need a microphone?", "For speech practice, yes. Any phone or laptop microphone works — no special headset required."], ["Can I cancel anytime?", "Absolutely. No contracts, cancel with one click from your account settings."]];
  $("[data-faq]").innerHTML = FAQ.map(([q, a]) => `<div class="fq"><button type="button" aria-expanded="false" data-fq>${q}<span class="pm" aria-hidden="true"></span></button><div class="fq-a" hidden><p>${a}</p></div></div>`).join("");
  $("[data-faq]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-fq]"); if (!b) return;
    const a = b.nextElementSibling, open = b.getAttribute("aria-expanded") === "true";
    b.setAttribute("aria-expanded", String(!open));
    if (open) { a.style.height = `${a.scrollHeight}px`; requestAnimationFrame(() => { a.style.height = "0px"; }); setTimeout(() => { a.hidden = true; a.style.height = ""; }, 260); }
    else { a.hidden = false; a.style.height = "0px"; requestAnimationFrame(() => { a.style.height = `${a.scrollHeight}px`; }); setTimeout(() => { a.style.height = ""; }, 280); }
  });

  // ---------- dialogs ----------
  const dlg = $("[data-dlg]");
  function show(html) { $("[data-dlg-body]").innerHTML = html; if (!dlg.open) dlg.showModal(); }
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close(); });
  let demoT = 0;
  $("[data-watch]").addEventListener("click", () => {
    const steps = [["chat", "1 · Chat with your AI partner", "Answer naturally — it corrects you in real time."], ["game", "2 · Earn XP and keep your streak", "Short daily lessons that feel like a game."], ["voice", "3 · Get your accent scored", "Speech recognition grades every syllable."]];
    let i = 0;
    show(`<h2 id="dlg-title">How LinguaLeap works</h2><div class="demo-stage" data-demo-stage></div><p class="demo-cap" data-demo-cap></p><div class="demo-dots" data-demo-dots>${steps.map((_, k) => `<i data-d="${k}"></i>`).join("")}</div><p class="fine">Animated walkthrough (illustration).</p>`);
    const draw = () => { const [k, t, d] = steps[i]; $("[data-demo-stage]").innerHTML = window.Steps[k]; $("[data-demo-cap]").innerHTML = `<b>${t}</b> ${d}`; $$("[data-d]").forEach((x, j) => x.classList.toggle("on", j === i)); };
    draw(); clearInterval(demoT); demoT = setInterval(() => { i = (i + 1) % 3; if (!dlg.open) return clearInterval(demoT); draw(); }, 2600);
  });
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-trial]");
    if (t) {
      const plan = t.dataset.trial;
      show(`<p class="kicker">${plan}${plan === "Free" ? "" : annual ? " · annual" : " · monthly"}</p><h2 id="dlg-title">Create your free account</h2><form class="form" novalidate data-signup><label class="field">Email<input name="email" type="email" autocomplete="email"></label><label class="field">I want to learn<select name="lang">${LANGS.map((l, i) => `<option${i === cur ? " selected" : ""}>${l.n}</option>`).join("")}</select></label><p class="err" role="alert" data-su-err></p><button class="btn btn-primary" type="submit">${plan === "Free" ? "Start Learning Free" : "Start 7-day free trial"}</button><p class="fine">No credit card needed for the Free plan. Demo: nothing is created.</p></form>`);
      $("[data-signup]").addEventListener("submit", (ev) => { ev.preventDefault(); const f = ev.target.elements; if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) { $("[data-su-err]").textContent = "Please enter a valid email."; return; } show(`<div class="ok">${icon("check")}<h2 id="dlg-title">¡Bienvenido! Welcome!</h2><p>Your ${esc(f.lang.value)} course on the ${plan} plan is ready. A sign-in link would go to ${esc(f.email.value.trim())}. (Demo)</p></div>`); });
    }
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); say(`${s.dataset.soon} lives on the full site; this demo is the landing page.`); setMenu(false); }
  });

  // ---------- nav drawer, sticky bar ----------
  const drawer = $("[data-drawer]"), scrim = $("[data-scrim]"), ob = $("[data-menu-open]");
  function setMenu(o) { drawer.classList.toggle("open", o); drawer.setAttribute("aria-hidden", String(!o)); ob.setAttribute("aria-expanded", String(o)); scrim.hidden = !o; document.body.style.overflow = o ? "hidden" : ""; }
  ob.addEventListener("click", () => { setMenu(true); $("[data-menu-close]").focus(); });
  $("[data-menu-close]").addEventListener("click", () => setMenu(false));
  scrim.addEventListener("click", () => setMenu(false));
  $$("a:not([data-soon])", drawer).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  function onScroll() { $("[data-nav]").classList.toggle("scrolled", scrollY > 8); const p = $("#pricing").getBoundingClientRect(); document.body.classList.toggle("show-bar", scrollY > 500 && !(p.top < innerHeight && p.bottom > 0)); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2600); }

  window.MuseLingua = { lang: () => LANGS[cur].n, matched: () => done.size, annual: () => annual };
})();
