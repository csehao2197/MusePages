(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } }, del(k) { try { localStorage.removeItem(k); } catch { /* unavailable */ } } };
  const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- state (sample base count + this browser's signup) ---------- */
  const BASE = 4832;
  let me = store.get("kite-waitlist", null); // { email, code, position, refs }
  const total = () => BASE + (me ? 1 : 0);

  /* ---------- count-up ---------- */
  function countUp(el, to, from = 0) {
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 1400;
    const run = (t) => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  }
  const counted = new WeakSet();
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !counted.has(e.target)) { counted.add(e.target); countUp(e.target, total(), Math.max(0, total() - 600)); } }), { threshold: 0.6 }) : null;
  $$("[data-count]").forEach((el) => (io ? io.observe(el) : (el.textContent = fmt(total()))));

  /* ---------- referral code ---------- */
  function codeFor(email) { let h = 2166136261; for (const ch of email.toLowerCase()) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36).slice(0, 6).padStart(6, "k"); }
  const link = () => `https://kite.email/r/${me ? me.code : "abc123"}`;

  function renderReferral() {
    const ref = $("[data-ref]");
    ref.classList.toggle("locked", !me); ref.classList.toggle("live", !!me);
    $("[data-preview-tag]").textContent = me ? `You're in · ${me.email}` : "Preview — join to get your own link";
    $("[data-reflink]").value = link();
    const pos = me ? Math.max(1, me.position - me.refs * 100) : total() + 1;
    $("[data-pos]").textContent = `#${fmt(pos)}`;
    $("[data-refs]").textContent = me ? me.refs : 0;
    $("[data-jumped]").textContent = fmt(me ? Math.min(me.refs * 100, me.position - 1) : 0);
    const t = total(), pct = Math.max(0, Math.min(100, ((t - pos + 1) / t) * 100));
    $("[data-pb] i").style.width = `${pct}%`; $("[data-you]").style.left = `${Math.max(3, Math.min(97, pct))}%`;
    $("[data-pb]").setAttribute("aria-valuenow", Math.round(pct)); $("[data-pb]").setAttribute("aria-valuetext", `Position ${fmt(pos)} of ${fmt(t)}`);
    $("[data-total-l]").textContent = `#${fmt(t)}`;
    $("[data-sim]").hidden = !me;
    const text = encodeURIComponent("I just joined the waitlist for Kite — AI email that works for you. Skip the line with my link:");
    const u = encodeURIComponent(link());
    $('[data-share="x"]').href = `https://x.com/intent/tweet?text=${text}&url=${u}`;
    $('[data-share="li"]').href = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    $('[data-share="em"]').href = `mailto:?subject=${encodeURIComponent("Join me on the Kite waitlist")}&body=${text}%20${u}`;
    $('[data-share="wa"]').href = `https://wa.me/?text=${text}%20${u}`;
    $$("[data-share]").forEach((a) => a.setAttribute("aria-disabled", !me));
  }

  /* ---------- signup forms ---------- */
  $$("[data-signup]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const inp = f.email, v = inp.value.trim(), msg = f.nextElementSibling;
    if (!validEmail(v)) { inp.setAttribute("aria-invalid", "true"); msg.className = "msg bad"; msg.textContent = "Please enter a valid email address."; inp.focus(); return; }
    inp.removeAttribute("aria-invalid");
    if (me && me.email.toLowerCase() === v.toLowerCase()) { msg.className = "msg ok"; msg.textContent = `You're already on the list at #${fmt(me.position - me.refs * 100)} — share your link to move up.`; return; }
    me = { email: v, code: codeFor(v), position: BASE + 1, refs: 0 };
    store.set("kite-waitlist", me);
    $$("[data-msg]").forEach((m) => { m.className = "msg"; m.textContent = ""; });
    msg.className = "msg ok"; msg.textContent = `You're #${fmt(me.position)}! Share your link below to skip ahead. (Demo — stored only in this browser.)`;
    f.reset();
    $$("[data-count]").forEach((el) => countUp(el, total(), BASE));
    renderReferral(); syncBar();
    setTimeout(() => $("#referral").scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), 900);
  }));
  $$("[data-signup] input").forEach((i) => i.addEventListener("input", () => i.removeAttribute("aria-invalid")));

  /* ---------- copy / share / simulate ---------- */
  $("[data-copy]").addEventListener("click", (e) => {
    if (!me) { toast("Join the waitlist first to get your own link."); $("#email1").focus(); return; }
    const b = e.currentTarget, v = $("[data-reflink]").value;
    const ok = () => { b.classList.add("ok"); $("span", b).textContent = "Copied!"; toast("Referral link copied"); setTimeout(() => { b.classList.remove("ok"); $("span", b).textContent = "Copy"; }, 1600); };
    try { navigator.clipboard.writeText(v).then(ok, () => { $("[data-reflink]").select(); toast("Press Ctrl/Cmd+C to copy"); }); } catch { $("[data-reflink]").select(); toast("Press Ctrl/Cmd+C to copy"); }
  });
  $("[data-reflink]").addEventListener("focus", (e) => e.target.select());
  $("[data-shares]").addEventListener("click", (e) => { const a = e.target.closest("[data-share]"); if (a && !me) { e.preventDefault(); toast("Join the waitlist first to get your own link."); $("#email1").focus(); } });
  $("[data-sim]").addEventListener("click", () => {
    me.refs += 1; store.set("kite-waitlist", me); renderReferral();
    toast(`A friend joined with your link — you jumped 100 spots to #${fmt(Math.max(1, me.position - me.refs * 100))}!`);
  });

  /* ---------- testimonials ---------- */
  const TW = [
    ["Morgan Lee", "designlead", "Just signed up for @kite_email — finally someone rethinking email with AI", "#6366F1", "2h"],
    ["Sarah Kim", "sarahdev", "The referral system is genius. Already moved up 300 spots", "#EC4899", "5h"],
    ["Mark Ortiz", "markfounder", "If Kite is half as good as their landing page, I'm sold", "#0EA5E9", "8h"],
    ["Emily Chen", "emilywrites", "AI email replies that don't sound robotic? Take my money", "#F59E0B", "1d"],
    ["Alex Novak", "alexops", "Referred my whole team. We need this yesterday", "#10B981", "1d"],
    ["Jake Patel", "jakepm", "Smart triage is the feature I didn't know I needed", "#8B5CF6", "2d"]
  ];
  $("[data-tweets]").innerHTML = TW.map(([n, h, t, c, ago]) => `<figure class="tw"><div class="tw-h"><span class="av" style="--c:${c}" aria-hidden="true">${n.split(" ").map((x) => x[0]).join("")}</span><div><b>${n}<svg class="i" role="img" aria-label="Verified"><use href="#i-badge"/></svg></b><small>@${h}</small></div><svg class="i x" aria-hidden="true"><use href="#i-x"/></svg></div><p>${esc(t).replace(/@kite_email/, '<span class="at">@kite_email</span>')}</p><time>${ago} ago</time></figure>`).join("");

  /* ---------- FAQ one-open ---------- */
  const faqs = $$("[data-faq] details"); faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

  /* ---------- nav + mobile bar ---------- */
  const nav = $("[data-nav]"), mbar = $("[data-mbar]"), hero = $(".hero"), final = $(".final");
  function syncBar() {
    nav.classList.toggle("solid", scrollY > 20);
    const f = final.getBoundingClientRect();
    mbar.classList.toggle("show", hero.getBoundingClientRect().bottom < 0 && !(f.top < innerHeight && f.bottom > 0));
    const b = $("[data-mbar-btn]"); if (me) { b.textContent = "Share your link"; b.setAttribute("href", "#referral"); } else { b.textContent = "Join Waitlist"; b.setAttribute("href", "#join"); }
  }
  addEventListener("scroll", syncBar, { passive: true });
  $("[data-mbar-btn]").addEventListener("click", () => setTimeout(() => { if (!me) $("#email1").focus({ preventScroll: true }); }, 500));

  /* ---------- misc ---------- */
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} — coming soon.`); } });
  window.kiteReset = () => { store.del("kite-waitlist"); location.reload(); };

  renderReferral(); syncBar();
})();
