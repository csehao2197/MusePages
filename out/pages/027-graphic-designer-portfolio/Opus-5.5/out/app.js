// Progressive enhancement for the pre-rendered portfolio (works on the homepage, case studies and checklist).
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const store = { get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* storage unavailable */ } } };

  // ---- Accent colour (configurable; preview switcher in the footer) ----
  const savedAccent = store.get("portfolio-accent");
  const setAccent = (c) => { document.documentElement.style.setProperty("--accent", c); $$("[data-accent]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.accent === c))); };
  if (savedAccent && /^#[0-9a-f]{6}$/i.test(savedAccent)) setAccent(savedAccent);
  $$("[data-accent]").forEach((b) => b.addEventListener("click", () => { setAccent(b.dataset.accent); store.set("portfolio-accent", b.dataset.accent); }));

  // ---- Mobile menu ----
  const menu = $("[data-menu]"), mb = $("[data-menu-btn]");
  if (menu && mb) {
    const setMenu = (open) => { menu.hidden = !open; mb.setAttribute("aria-expanded", String(open)); mb.innerHTML = `<span class="sr-only">${open ? "Close menu" : "Menu"}</span><svg class="i" aria-hidden="true"><use href="#i-${open ? "x" : "menu"}"/></svg>`; if (open) $("a", menu).focus(); };
    mb.addEventListener("click", () => setMenu(menu.hidden));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); mb.focus(); } });
    matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  // ---- Hero: rotating pair of featured projects ----
  const hero = $("[data-hero]");
  if (hero) {
    const slides = $$("[data-slide]", hero), dots = $$("[data-goto]", hero), pauseBtn = $("[data-hero-pause]", hero), live = $("[data-hero-live]", hero);
    let i = 0, timer = null, paused = reduce.matches, hover = false;
    const show = (n, announce) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { const on = k === i; s.classList.toggle("on", on); s.toggleAttribute("aria-hidden", !on); $(".hero-img", s).tabIndex = on ? 0 : -1; });
      dots.forEach((d, k) => d.setAttribute("aria-pressed", String(k === i)));
      if (announce) live.textContent = `Showing ${$("figcaption b", slides[i]).textContent}`;
    };
    const tick = () => { clearInterval(timer); if (!paused && !hover) timer = setInterval(() => show(i + 1), 6000); };
    const setPaused = (p) => { paused = p; pauseBtn.setAttribute("aria-label", p ? "Resume rotation" : "Pause rotation"); pauseBtn.innerHTML = `<svg class="i" aria-hidden="true"><use href="#i-${p ? "play" : "pause"}"/></svg>`; tick(); };
    dots.forEach((d) => d.addEventListener("click", () => { show(+d.dataset.goto, true); setPaused(true); }));
    pauseBtn.addEventListener("click", () => setPaused(!paused));
    hero.addEventListener("mouseenter", () => { hover = true; tick(); });
    hero.addEventListener("mouseleave", () => { hover = false; tick(); });
    hero.addEventListener("focusin", () => { hover = true; tick(); });
    hero.addEventListener("focusout", () => { hover = false; tick(); });
    setPaused(paused);
    window.MuseHero = { index: () => i };
  }

  // ---- Project filters ----
  const filters = $("[data-filters]");
  if (filters) {
    const status = $("[data-filter-status]"), cards = $$("[data-grid] > li");
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("[data-filter]"); if (!b) return;
      const f = b.dataset.filter;
      $$("[data-filter]", filters).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      let n = 0; cards.forEach((c) => { const ok = f === "all" || c.dataset.tags.split(" ").includes(f); c.hidden = !ok; if (ok) n++; });
      $("[data-empty]").hidden = n > 0;
      status.textContent = f === "all" ? `Showing all ${n} projects` : `Showing ${n} ${n === 1 ? "project" : "projects"} in ${b.firstChild.textContent.trim()}`;
    });
  }

  // ---- Inquiry form ----
  const form = $("[data-inquiry]");
  if (form) {
    const TYPE = { "Brand identity systems": "Brand Identity", "Packaging design": "Packaging", "Campaign art direction": "Campaign", "Editorial & publication design": "Editorial" };
    const pick = (v) => { const o = [...form.type.options].find((x) => x.text === v || x.text.startsWith(v)); if (o) form.type.value = o.value || o.text; };
    const qType = new URLSearchParams(location.search).get("type");
    if (qType) pick(qType);
    $$("[data-service]").forEach((a) => a.addEventListener("click", () => pick(TYPE[a.dataset.service] || "")));
    const ok = $("[data-ok]"), bad = $("[data-bad]"), sum = $("[data-err-summary]"), btn = $("[data-submit]");
    const rules = [
      [form.name, (v) => v.trim().length >= 2, "Enter your name."],
      [form.email, (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), "Enter an email address like name@company.com."],
      [form.website, (v) => !v.trim() || /^https?:\/\/[^\s.]+\.[^\s]{2,}/i.test(v.trim()), "Enter a full web address starting with https://, or leave it blank."],
      [form.type, (v) => !!v, "Choose a project type."],
      [form.summary, (v) => v.trim().length >= 40, "Tell me a little more about the project (at least 40 characters)."],
      [form.consent, (_, el) => el.checked, "Please agree to the privacy note so I can reply."],
    ];
    const setErr = (el, msg) => { const e = $(`#e-${el.id.slice(2)}`); el.setAttribute("aria-invalid", msg ? "true" : "false"); if (e) e.textContent = msg || ""; };
    const validate = () => rules.map(([el, test, msg]) => { const good = test(el.value, el); setErr(el, good ? "" : msg); return good ? null : [el, msg]; }).filter(Boolean);
    // Clear an error as soon as the field is fixed (on input), never on blur — a blur-time layout shift
    // would move the submit button between mousedown and mouseup and swallow the click.
    rules.forEach(([el, test]) => el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => { if (el.getAttribute("aria-invalid") === "true" && test(el.value, el)) setErr(el, ""); }));
    async function send() {
      btn.classList.add("loading"); btn.disabled = true; btn.setAttribute("aria-busy", "true"); $("[data-submit-label]").textContent = "Sending…";
      await new Promise((r) => setTimeout(r, reduce.matches ? 300 : 1100));
      btn.classList.remove("loading"); btn.disabled = false; btn.removeAttribute("aria-busy"); $("[data-submit-label]").textContent = "Send inquiry";
      if (!navigator.onLine) { bad.hidden = false; bad.focus(); return; }
      $("[data-ok-text]").textContent = `Thanks, ${form.name.value.trim().split(/\s+/)[0]}. I'll reply to ${form.email.value.trim()} within two business days about your ${form.type.value.toLowerCase()} project. (Template demo — nothing was actually sent; connect a form service before launch.)`;
      form.hidden = true; bad.hidden = true; ok.hidden = false; ok.focus();
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault(); bad.hidden = true;
      const errs = validate();
      if (errs.length) {
        sum.hidden = false;
        sum.innerHTML = `<b>Please fix ${errs.length} ${errs.length === 1 ? "field" : "fields"}:</b><ul>${errs.map(([el, m]) => `<li><a href="#${el.id}">${m}</a></li>`).join("")}</ul>`;
        sum.focus(); return;
      }
      sum.hidden = true; send();
    });
    sum.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a) { e.preventDefault(); $(a.getAttribute("href")).focus(); } });
    $("[data-retry]").addEventListener("click", () => { bad.hidden = true; form.requestSubmit(); });
  }

  // ---- Checklist progress ----
  const boxes = $$("[data-cl]");
  if (boxes.length) {
    const key = "portfolio-checklist", saved = new Set((store.get(key) || "").split(",").filter(Boolean));
    const prog = $("[data-progress]");
    const upd = () => { const n = boxes.filter((b) => b.checked).length; prog.textContent = `${n} of ${boxes.length} items ready`; store.set(key, boxes.filter((b) => b.checked).map((b) => b.dataset.cl).join(",")); };
    boxes.forEach((b) => { b.checked = saved.has(b.dataset.cl); b.addEventListener("change", upd); });
    upd();
  }
})();
