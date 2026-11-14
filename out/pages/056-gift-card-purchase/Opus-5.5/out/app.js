(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const short$ = (n) => "$" + (n % 1 ? n.toFixed(2) : n.toLocaleString("en-US"));
  const A = window.Art;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  $("[data-hero]").innerHTML = A.hero();

  /* ---------- state ---------- */
  const S = { design: "birthday", image: null, amount: 75, amountOk: true, to: "", from: "", msg: "", mode: "digital", when: "now", date: "", remind: false, premium: false };
  const total = () => (S.amountOk ? S.amount : 0) + (S.mode === "physical" && S.premium ? 5 : 0);
  const designName = () => (S.image ? "Your photo" : A.DESIGNS[S.design].name);
  const front = (o = {}) => A.front(S.design, { image: S.image, amount: S.amountOk ? short$(S.amount) : "", title: S.to ? `For ${S.to}` : designName(), ...o });

  /* ---------- designs ---------- */
  $("[data-designs]").innerHTML = A.keys.map((k) => `<button class="dz" type="button" role="radio" aria-checked="${k === S.design}" aria-label="${A.DESIGNS[k].name}" data-design="${k}"><span class="th">${A.front(k, { small: true })}</span>${A.DESIGNS[k].name}</button>`).join("");
  $("[data-designs]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-design]"); if (!b) return;
    S.design = b.dataset.design; S.image = null;
    $$("[data-design]").forEach((x) => x.setAttribute("aria-checked", x === b));
    $("[data-flip]").classList.remove("flipped"); $("[data-flip-btn]").setAttribute("aria-pressed", "false");
    render();
  });
  $("[data-designs]").addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const btns = $$("[data-design]"), i = btns.indexOf(document.activeElement); if (i < 0) return;
    e.preventDefault(); const n = btns[(i + (e.key === "ArrowRight" ? 1 : -1) + btns.length) % btns.length]; n.focus(); n.click();
  });
  $("[data-flip-btn]").addEventListener("click", (e) => { const f = $("[data-flip]").classList.toggle("flipped"); e.currentTarget.setAttribute("aria-pressed", f); });

  // upload own image (stays local)
  const drop = $("[data-drop]"), up = $("[data-upload]");
  function useFile(f) {
    if (!f) return;
    if (!/^image\//.test(f.type)) { toast("Please choose an image file (JPG or PNG)."); return; }
    if (f.size > 5 * 1024 * 1024) { toast("That image is over 5 MB — please choose a smaller one."); return; }
    const r = new FileReader();
    r.onload = () => { S.image = r.result; $$("[data-design]").forEach((x) => x.setAttribute("aria-checked", "false")); render(); toast("Your image is on the card — it never leaves your browser."); };
    r.readAsDataURL(f);
  }
  up.addEventListener("change", () => useFile(up.files[0]));
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => useFile(e.dataTransfer.files[0]));

  /* ---------- amounts ---------- */
  const PRESETS = [25, 50, 75, 100, 150, 200, 500];
  $("[data-amounts]").innerHTML = PRESETS.map((a) => `<button class="amt" type="button" role="radio" aria-checked="${a === S.amount}" data-amt="${a}">$${a}</button>`).join("");
  const custom = $("[data-custom]"), amsg = $("[data-amt-msg]");
  $("[data-amounts]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-amt]"); if (!b) return;
    S.amount = Number(b.dataset.amt); S.amountOk = true; custom.value = ""; custom.removeAttribute("aria-invalid");
    amsg.className = "hint"; amsg.textContent = "Any amount from $10 to $1,000.";
    $$("[data-amt]").forEach((x) => x.setAttribute("aria-checked", x === b)); render();
  });
  custom.addEventListener("input", () => {
    const raw = custom.value.trim();
    $$("[data-amt]").forEach((x) => x.setAttribute("aria-checked", "false"));
    if (!raw) { S.amountOk = false; amsg.className = "hint"; amsg.textContent = "Any amount from $10 to $1,000."; custom.removeAttribute("aria-invalid"); render(); return; }
    const v = Number(raw.replace(/[$,]/g, ""));
    if (!Number.isFinite(v) || v < 10 || v > 1000) {
      S.amountOk = false; custom.setAttribute("aria-invalid", "true"); amsg.className = "hint bad";
      amsg.textContent = !Number.isFinite(v) ? "Enter a number, like 120." : v < 10 ? "The minimum gift card amount is $10." : "The maximum gift card amount is $1,000.";
    } else { S.amount = Math.round(v * 100) / 100; S.amountOk = true; custom.removeAttribute("aria-invalid"); amsg.className = "hint"; amsg.textContent = `Custom amount: ${money(S.amount)}`; }
    render();
  });

  /* ---------- personalization ---------- */
  const to = $("[data-to]"), from = $("[data-from]"), msg = $("[data-msg]"), cnt = $("[data-count]");
  [to, from, msg].forEach((el) => el.addEventListener("input", () => {
    S.to = to.value.trim(); S.from = from.value.trim(); S.msg = msg.value;
    cnt.textContent = `${msg.value.length} / 200`; cnt.classList.toggle("max", msg.value.length >= 200);
    render();
  }));

  /* ---------- delivery ---------- */
  const today = new Date(); const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const date = $("[data-date]"); date.min = iso(today); const max = new Date(today); max.setFullYear(max.getFullYear() + 1); date.max = iso(max);
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    S.mode = b.dataset.mode;
    $$("[data-mode]").forEach((x) => x.setAttribute("aria-checked", x === b));
    $$("[data-pane]").forEach((p) => (p.hidden = p.dataset.pane !== S.mode));
    render();
  }));
  $$("[data-when]").forEach((b) => b.addEventListener("click", () => {
    S.when = b.dataset.when;
    $$("[data-when]").forEach((x) => x.setAttribute("aria-pressed", x === b));
    date.hidden = S.when !== "later"; if (S.when === "later") { if (!date.value) { const t = new Date(today); t.setDate(t.getDate() + 1); date.value = iso(t); } date.focus(); }
    S.date = date.value; render();
  }));
  date.addEventListener("change", () => { S.date = date.value; render(); });
  $("[data-remind]").addEventListener("change", (e) => { S.remind = e.target.checked; });
  $("[data-premium]").addEventListener("change", (e) => { S.premium = e.target.checked; render(); });
  $("[data-email]").addEventListener("input", (e) => e.target.removeAttribute("aria-invalid"));
  $$("[data-ship]").forEach((i) => i.addEventListener("input", () => i.removeAttribute("aria-invalid")));

  /* ---------- render ---------- */
  function render() {
    const f = front({ label: `Gift card preview, ${designName()} design${S.amountOk ? `, ${short$(S.amount)}` : ""}` });
    $("[data-front]").innerHTML = f;
    $("[data-back]").innerHTML = `<span class="to">To: ${esc(S.to || "Someone special")}</span><p class="m">${esc(S.msg || "Happy birthday! Treat yourself to something special.")}</p><span class="fr">From: ${esc(S.from || "You")}</span><span class="code"><span>CODE •••• •••• •••• ••••</span><b>${S.amountOk ? short$(S.amount) : "—"}</b></span>`;
    $("[data-design-name]").textContent = designName();
    const small = front();
    $("[data-s-card]").innerHTML = small;
    $("[data-em-card]").innerHTML = small;
    $("[data-mock-card]").innerHTML = small;
    $("[data-mock]").classList.toggle("premium", S.premium);
    $("[data-s-design]").textContent = designName();
    $("[data-s-amount]").textContent = S.amountOk ? money(S.amount) : "Choose an amount";
    $("[data-s-msg]").textContent = S.msg ? `“${S.msg}”` : "—";
    $("[data-s-delivery]").textContent = S.mode === "digital" ? (S.when === "later" && S.date ? `Digital · ${new Date(S.date + "T12:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Digital · Send now") : "Physical · 3-5 days";
    $("[data-s-pack]").textContent = S.mode === "physical" && S.premium ? "Premium (+$5)" : "Standard";
    const t = money(total());
    $("[data-s-total]").textContent = t; $("[data-total-mini]").textContent = t; $("[data-mbar-amt]").textContent = t;
    $("[data-em-subject]").textContent = `${S.from || "Someone"} sent you a ${S.amountOk ? short$(S.amount) + " " : ""}Lumina gift card!`;
    $("[data-em-text]").textContent = S.msg || `Hi ${S.to || "there"} — someone special sent you a gift card.`;
  }
  render();

  /* ---------- add to cart / buy ---------- */
  function validate() {
    const errs = []; let first = null;
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); first = first || el; };
    if (!S.amountOk) { errs.push("choose an amount between $10 and $1,000"); first = first || custom; }
    if (S.mode === "digital") {
      const em = $("[data-email]"); if (!validEmail(em.value.trim())) bad(em, "enter the recipient's email");
      if (S.when === "later" && (!S.date || S.date < date.min)) bad(date, "pick a future delivery date");
    } else {
      $$("[data-ship]").forEach((i) => { if (i.tagName === "INPUT" && !i.value.trim()) bad(i, null); });
      const zip = $('[data-ship="zip"]'); if (zip.value.trim() && !/^[A-Za-z0-9 -]{3,10}$/.test(zip.value.trim())) bad(zip, null);
      if ($$("[data-ship][aria-invalid=true]").length) errs.push("complete the shipping address");
    }
    const msgs = errs.filter(Boolean);
    $("[data-err]").textContent = msgs.length ? `Please ${msgs.join(" and ")}.` : "";
    if (first) { $("[data-sum]").open = true; first.focus(); }
    return !msgs.length;
  }
  let cartN = 0;
  function ics() {
    const d = S.date.replace(/-/g, "");
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lumina//Gift Card//EN", "BEGIN:VEVENT", `UID:gift-${d}@lumina.example`, `DTSTAMP:${d}T090000`, `DTSTART;VALUE=DATE:${d}`, `SUMMARY:Lumina gift card delivers to ${S.to || "your recipient"}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" })); a.download = "lumina-gift-reminder.ics"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function add(express) {
    if (!validate()) { if (matchMedia("(max-width: 640px)").matches) toast($("[data-err]").textContent); return; }
    if (S.mode === "digital" && S.when === "later" && S.remind) ics();
    if (express) {
      openDlg(`<h3>Express checkout</h3><div class="s-card" style="border-radius:12px;overflow:hidden">${front()}</div><p><b>${money(total())}</b> · ${esc($("[data-s-delivery]").textContent)}</p><p class="muted">This demo store doesn't take payments — in a live store you'd confirm with Apple Pay, Google Pay or a saved card here.</p><button class="btn-p btn-block" type="button" data-close-ok>Got it</button>`);
      $("[data-close-ok]", body).addEventListener("click", () => dlg.close());
      return;
    }
    cartN += 1;
    const b = $("[data-badge]"); b.hidden = false; b.textContent = cartN;
    $("[data-cart-btn]").setAttribute("aria-label", `Cart, ${cartN} item${cartN === 1 ? "" : "s"}`);
    openDlg(`<span class="ok">${icon("i-check")}</span><h3>Added to your cart</h3><div style="border-radius:12px;overflow:hidden">${front()}</div><p>${money(total())} ${S.mode === "digital" ? `digital gift card for ${esc(S.to || "your recipient")}` : "physical gift card"}${S.mode === "digital" && S.when === "later" && S.remind ? " · calendar reminder downloaded" : ""}.</p><button class="btn-p btn-block" type="button" data-close-ok>Keep shopping</button>`);
    $("[data-close-ok]", body).addEventListener("click", () => dlg.close());
  }
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => add(false)));
  $("[data-buy]").addEventListener("click", () => add(true));

  /* ---------- balance checker ---------- */
  const CARDS = {
    "4000123456789010": { bal: 62.4, status: "Active · never expires", tx: [["Oct 28, 2026", "Online order #48213", -37.6], ["Sep 2, 2026", "Card activated", 100]] },
    "4000000000000002": { bal: 0, status: "Fully redeemed", tx: [["Aug 14, 2026", "Store purchase", -50], ["Jul 1, 2026", "Card activated", 50]] }
  };
  const cardno = $("[data-cardno]");
  cardno.addEventListener("input", () => { const d = cardno.value.replace(/\D/g, "").slice(0, 16); cardno.value = d.replace(/(.{4})(?=.)/g, "$1 "); });
  $("[data-sample]").addEventListener("click", () => { cardno.value = "4000 1234 5678 9010"; $("[data-bal]").requestSubmit(); });
  $("[data-bal]").addEventListener("submit", (e) => {
    e.preventDefault();
    const d = cardno.value.replace(/\D/g, ""), out = $("[data-bal-out]");
    out.className = "bal-out";
    if (d.length !== 16) { out.classList.add("bad"); out.textContent = "Card numbers have 16 digits — please check and try again."; return; }
    const c = CARDS[d];
    if (!c) { out.classList.add("bad"); out.textContent = `No gift card found ending in ${d.slice(-4)}. Check the number on the back of your card or in your email.`; return; }
    out.innerHTML = `<p style="margin:0" class="muted">Card ending in ${d.slice(-4)}</p><div class="big">${money(c.bal)}</div><span class="ok-s">${icon("i-check-c")}${c.status}</span><table><tbody>${c.tx.map(([dt, t, a]) => `<tr><td>${dt}<br><span class="muted">${t}</span></td><td>${a < 0 ? "−" : "+"}${money(Math.abs(a))}</td></tr>`).join("")}</tbody></table>`;
  });

  /* ---------- FAQ (one open) + corporate ---------- */
  const faqs = $$("[data-faq] details");
  faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));
  $("[data-sales]").addEventListener("click", () => {
    openDlg(`<h3>Corporate &amp; Bulk Gifting</h3><p class="muted">Tell us about your order and a gifting specialist will follow up.</p><form class="fields" data-sales-form novalidate><label>Work email<input type="email" name="email" autocomplete="email"></label><label>Company<input name="co" autocomplete="organization"></label><label>How many cards?<select name="qty"><option>10–49</option><option>50–249</option><option>250–999</option><option>1,000+</option></select></label><p class="err" data-sales-err role="alert"></p><button class="btn-p" type="submit">Contact Sales</button></form>`);
    $("[data-sales-form]", body).addEventListener("submit", (ev) => {
      ev.preventDefault(); const f = ev.target;
      if (!validEmail(f.email.value.trim()) || !f.co.value.trim()) { $("[data-sales-err]", body).textContent = "Please enter a work email and company."; return; }
      body.innerHTML = `<span class="ok">${icon("i-check")}</span><h3>Thanks — we'll be in touch</h3><p>A specialist will contact ${esc(f.co.value.trim())} about ${esc(f.qty.value)} cards within one business day. (Demo — nothing is sent.)</p>`;
    });
  });

  /* ---------- summary collapsible on mobile ---------- */
  const sum = $("[data-sum]"), mq = matchMedia("(max-width: 820px)");
  const syncSum = () => { sum.open = !mq.matches; };
  syncSum(); mq.addEventListener("change", syncSum);
  $("[data-sum] > summary").addEventListener("click", (e) => { if (!mq.matches) e.preventDefault(); });

  /* ---------- dialog + toast + misc ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input, .btn-p", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} isn't part of this demo page.`); } });
  $("[data-cart-btn]").addEventListener("click", () => toast(cartN ? `${cartN} gift card${cartN === 1 ? "" : "s"} in your cart (demo).` : "Your cart is empty."));
})();
