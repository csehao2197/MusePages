(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const usd = (n) => (n < 0 ? "-" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3400); };

  $("[data-hero]").innerHTML = Art.hero();
  $$(".stars").forEach((s) => { s.innerHTML = ic("star").repeat(5); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // trust bar marquee: duplicate the items for a seamless loop
  const track = $("[data-trust]");
  if (!reduce) track.insertAdjacentHTML("beforeend", track.innerHTML.replace(/<span>/g, '<span aria-hidden="true">'));

  // ---------- Menu ----------
  const menu = $("[data-menu]"), mb = $("[data-menu-btn]");
  const setMenu = (o) => { menu.hidden = !o; mb.setAttribute("aria-expanded", String(o)); mb.setAttribute("aria-label", o ? "Close menu" : "Open menu"); mb.innerHTML = ic(o ? "x" : "menu"); };
  mb.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  matchMedia("(min-width: 1181px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // ---------- Services ----------
  const SVC = [
    ["search", "Tenant Screening", "Comprehensive background checks, credit reports, income verification, and rental history — we find tenants who pay on time and stay longer.", ["Credit, criminal and eviction history", "Income verified at 3× rent", "Landlord and employer references"], "Included in every plan · placement covered by the leasing fee"],
    ["coins", "Rent Collection", "Automated online payments, late fee enforcement, and direct deposits to your account by the 10th of every month. 98.5% on-time payment rate.", ["ACH, debit and card payments", "Automatic late notices and fees", "Owner disbursement by the 10th"], "Included · late fees collected are passed through to you"],
    ["wrench", "Maintenance & Repairs", "24/7 emergency line, vetted vendor network, and transparent pricing. All repairs approved by you before work begins (unless emergency).", ["Licensed, insured vendors", "Your approval threshold (e.g. $300)", "Photos before and after every job"], "No markup on vendor invoices · Portfolio plans get priority vendor rates"],
    ["clip", "Property Inspections", "Move-in, move-out, and semi-annual inspections with detailed photo reports. Catch problems before they become expensive.", ["150+ photo move-in baseline", "Semi-annual condition reports", "Smoke detector and HVAC filter checks"], "Semi-annual inspections included · extra inspections $95 each"],
    ["bars", "Financial Reporting", "Monthly owner statements, year-end tax packages (1099s), and a real-time owner portal with income/expense tracking.", ["Monthly statements and receipts", "Year-end 1099 and tax package", "Real-time owner portal"], "Included in every plan · custom dashboards on Enterprise"],
    ["scale", "Legal & Compliance", "Lease drafting, eviction management, fair housing compliance, and local ordinance monitoring. We keep you protected.", ["Attorney-reviewed Texas lease", "Eviction coordination", "Fair housing and ordinance monitoring"], "Eviction filing at cost · legal retainer included on Enterprise"],
  ];
  $("[data-services]").innerHTML = SVC.map(([i, t, d, list, price], k) => `<article class="sv"><span class="sv-ic">${ic(i)}</span><h3>${t}</h3><p>${d}</p>
    <button type="button" aria-expanded="false" aria-controls="sv-${k}" data-sv>Learn More ${ic("down")}</button>
    <div class="sv-more" id="sv-${k}" hidden><ul>${list.map((x) => `<li>${ic("check")}${x}</li>`).join("")}</ul><p class="price">${price}</p></div></article>`).join("");
  $("[data-services]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-sv]"); if (!b) return;
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open)); b.firstChild.textContent = open ? "Show Less " : "Learn More ";
    $(`#${b.getAttribute("aria-controls")}`).hidden = !open;
  });

  // ---------- Portfolio ----------
  const PROPS = [
    ["single", "3BR/2BA Single Family", "Mueller", 2150, "Occupied", "/mo"],
    ["duplex", "2BR/1BA Duplex Unit", "East Austin", 1450, "Available", "/mo", "1904 Aldrich St, Unit B", "Available Dec 1 · 950 sq ft · fenced yard · pets considered"],
    ["suburban", "4BR/3BA House", "Round Rock", 2800, "Occupied", "/mo"],
    ["condo", "1BR/1BA Condo", "Downtown", 1650, "Available", "/mo", "200 Congress Ave, #1412", "Available now · 720 sq ft · 14th-floor view · pool & gym"],
    ["multi", "8-Unit Multi-Family", "South Austin", 12400, "Occupied", "/mo total"],
    ["townhome", "3BR/2BA Townhome", "Cedar Park", 2350, "Available", "/mo", "1611 Brushy Creek Rd, #4", "Available Dec 15 · 1,640 sq ft · 2-car garage · Leander ISD"],
  ];
  const rail = $("[data-rail-track]");
  rail.innerHTML = PROPS.map(([k, t, loc, rent, st, per], i) => `<article class="pc" data-st="${st}"><div class="pc-img">${Art.prop(k, `${t} in ${loc}`)}<span class="st ${st === "Available" ? "st-av" : "st-oc"}">${st}</span></div>
    <div class="pc-body"><p class="type">${t}</p><p class="loc">${ic("pin")}${loc}</p><p class="rent">$${rent.toLocaleString("en-US")}<small>${per}</small></p>
    ${st === "Available" ? `<button type="button" data-listing="${i}">View listing ${ic("arrow")}</button>` : `<p class="na">Currently leased</p>`}</div></article>`).join("");
  $$("[data-rail]").forEach((b) => b.addEventListener("click", () => { const w = rail.querySelector(".pc:not([hidden])").getBoundingClientRect().width + 20; rail.scrollBy({ left: +b.dataset.rail * w, behavior: reduce ? "auto" : "smooth" }); }));
  function filterProps(f) {
    $$("[data-pf-filter] button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
    $$(".pc", rail).forEach((c) => { c.hidden = f !== "all" && c.dataset.st !== f; });
    rail.scrollLeft = 0;
  }
  $("[data-pf-filter]").addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (b) filterProps(b.dataset.f); });
  $$("[data-browse]").forEach((a) => a.addEventListener("click", () => filterProps("Available")));
  $("[data-view-all]").addEventListener("click", () => { filterProps("all"); toast("Showing our sample portfolio — the full search of 120+ rentals isn't part of this demo."); });
  const lsM = $("[data-modal=listing]");
  rail.addEventListener("click", (e) => {
    const b = e.target.closest("[data-listing]"); if (!b) return;
    const [k, t, loc, rent, , , addr, note] = PROPS[+b.dataset.listing];
    $("[data-ls-img]").innerHTML = Art.prop(k, `${t} in ${loc}`);
    $("[data-ls-title]").textContent = `${t} — ${loc}`;
    $("[data-ls-sub]").textContent = addr;
    const [bd, ba] = t.match(/(\d)BR\/(\d)BA/).slice(1);
    $("[data-ls-body]").innerHTML = `<div class="ls-facts"><div><b>$${rent.toLocaleString("en-US")}</b><span>per month</span></div><div><b>${bd}</b><span>bedrooms</span></div><div><b>${ba}</b><span>bathrooms</span></div></div><p>${note}.</p><p class="m-sub">Application fee $55 per adult · income 3× rent · security deposit equal to one month's rent.</p><button class="btn btn-green wide" type="button" data-apply="${addr}">Apply Online</button>`;
    lsM.showModal();
  });
  $("[data-ls-body]").addEventListener("click", (e) => { const b = e.target.closest("[data-apply]"); if (b) { lsM.close(); toast(`Online applications are a demo — nothing was submitted for ${b.dataset.apply}.`); } });

  // ---------- ROI calculator ----------
  const roi = $("[data-roi]");
  const UPLIFT = 1.10, OCC = 0.98, FEE = 0.08;
  function calc() {
    const units = +roi.units.value, rent = +roi.rent.value, vac = +roi.vac.value / 100;
    const gross = units * rent * 12, now = gross * (1 - vac), ks = gross * UPLIFT * OCC, fee = ks * FEE, net = ks - fee - now;
    return { units, rent, vac, gross, now, ks, fee, net };
  }
  function renderRoi() {
    const r = calc();
    $('[data-o="units"]').textContent = r.units; $('[data-o="rent"]').textContent = usd(r.rent); $('[data-o="vac"]').textContent = `${Math.round(r.vac * 100)}%`;
    $('[data-r="now"]').textContent = usd(r.now);
    $('[data-r="ks"]').textContent = usd(r.ks);
    $('[data-r="fee"]').textContent = `${usd(r.fee)}/year`;
    $('[data-r="net"]').textContent = `${r.net >= 0 ? "+" : "−"}${usd(Math.abs(r.net))}/year`;
    $('[data-r="net"]').parentElement.classList.toggle("neg", r.net < 0);
    const m = $('[data-r="msg"]');
    m.textContent = r.net >= 0 ? `That's an extra ${usd(r.net / 12)}/month in your pocket after our fee` : `At this vacancy rate, self-managing may net more — let's review your numbers together.`;
    m.classList.toggle("neg", r.net < 0);
  }
  roi.addEventListener("input", renderRoi); roi.addEventListener("change", renderRoi);
  roi.addEventListener("submit", (e) => e.preventDefault());
  renderRoi();

  // ---------- FAQ ----------
  const FAQ = [
    ["What types of properties do you manage?", "We manage single-family homes, duplexes, triplexes, condos, townhomes, and multi-family complexes (up to 50 units) across Greater Austin, Round Rock, Cedar Park, Pflugerville, and Georgetown."],
    ["How do you screen tenants?", "Every applicant goes through credit check, criminal background, eviction history, income verification (must earn 3x rent), employment verification, and landlord reference checks. Our average tenant stays 2.3 years."],
    ["How quickly can you fill a vacancy?", "Our average fill time is 21 days. We use professional photography, list on 40+ rental sites (Zillow, Apartments.com, etc.), and conduct showings 7 days a week."],
    ["When do I get paid?", "Owner disbursements are processed by the 10th of each month via direct deposit. You can track all income and expenses in real-time through your owner portal."],
    ["What if a tenant damages my property?", "Security deposits are held in a trust account and applied to damages beyond normal wear and tear. For larger issues, our rent guarantee program and landlord insurance recommendations provide additional protection."],
    ["Can I still be involved in decisions?", "Absolutely. You set your thresholds — for example, approve all repairs over $300. We handle the day-to-day and escalate based on your preferences."],
  ];
  $("[data-faq]").innerHTML = FAQ.map(([q, a], i) => `<div class="qa"><h3><button type="button" aria-expanded="false" aria-controls="qa-${i}" data-qa>${q}${ic("down")}</button></h3><div class="ans" id="qa-${i}" role="region" hidden><p>${a}</p></div></div>`).join("");
  $("[data-faq]").addEventListener("click", (e) => {
    const b = e.target.closest("[data-qa]"); if (!b) return;
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open)); $(`#${b.getAttribute("aria-controls")}`).hidden = !open; b.closest(".qa").classList.toggle("open", open);
  });

  // ---------- Final CTA form ----------
  const fin = $("[data-fin]");
  const goAnalysis = () => setTimeout(() => { if (!fin.hidden) fin.address.focus({ preventScroll: true }); }, reduce ? 0 : 650);
  $$("[data-analysis-cta]").forEach((a) => a.addEventListener("click", () => { setMenu(false); goAnalysis(); }));
  $$("[data-plan]").forEach((a) => a.addEventListener("click", () => { fin.plan.value = a.dataset.plan; goAnalysis(); }));
  fin.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = []; $$("[aria-invalid]", fin).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (fin.address.value.trim().length < 6) bad(fin.address, "the property address");
    if (!emailOk(fin.email.value)) bad(fin.email, "a valid email");
    if (!fin.phone.checkValidity() || fin.phone.value.replace(/\D/g, "").length < 10) bad(fin.phone, "a 10-digit phone number");
    $("[data-fin-err]").textContent = errs.length ? `Please enter ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", fin).focus(); return; }
    $("[data-fin-text]").textContent = `Thanks! Your free rental analysis for ${fin.address.value.trim()}${fin.plan.value ? ` (${fin.plan.value} plan)` : ""} is in the queue. We'll email ${fin.email.value.trim()} within 24 hours. (Demo — nothing was sent.)`;
    fin.hidden = true; $("[data-fin-done]").hidden = false; $("[data-fin-done]").focus();
  });

  // ---------- Tenant portal ----------
  const pm = $("[data-modal=portal]");
  function ptTab(t) {
    $$("[data-pt]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.pt === t)));
    $$("[data-pt-panel]").forEach((p) => { p.hidden = p.dataset.ptPanel !== t; });
    $("[data-pt-done]").hidden = true; $$("[data-pt-err]").forEach((e) => { e.textContent = ""; });
  }
  $$("[data-portal]").forEach((b) => b.addEventListener("click", () => { ptTab(b.dataset.portal || "login"); setMenu(false); pm.showModal(); }));
  $$("[data-pt]").forEach((b) => b.addEventListener("click", () => ptTab(b.dataset.pt)));
  const done = (msg) => { $$("[data-pt-panel]").forEach((p) => { p.hidden = true; }); $("[data-pt-done]").hidden = false; $("[data-pt-done-text]").textContent = msg; };
  $$("[data-pt-panel]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = $("[data-pt-err]", f), t = f.dataset.ptPanel; const errs = [];
    $$("[aria-invalid]", f).forEach((el) => el.removeAttribute("aria-invalid"));
    const bad = (el, m) => { el.setAttribute("aria-invalid", "true"); errs.push(m); };
    if (t === "login") { if (!emailOk(f.email.value)) bad(f.email, "a valid email"); if (f.pw.value.length < 8) bad(f.pw, "your password (8+ characters)"); }
    if (t === "pay") { if (f.unit.value.trim().length < 4) bad(f.unit, "your unit address"); if (!(parseFloat(f.amt.value.replace(/[^0-9.]/g, "")) > 0)) bad(f.amt, "an amount"); }
    if (t === "maint") { if (f.unit.value.trim().length < 4) bad(f.unit, "your unit address"); if (f.desc.value.trim().length < 10) bad(f.desc, "a short description (10+ characters)"); }
    err.textContent = errs.length ? `Please enter ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", f).focus(); return; }
    if (t === "login") done("This demo isn't connected to a real tenant portal, so no account was checked. Use the Pay rent or Maintenance tabs to try those flows.");
    if (t === "pay") { const amt = parseFloat(f.amt.value.replace(/[^0-9.]/g, "")); done(`Payment preview: ${usd(amt)} for ${f.unit.value.trim()} via ${f.method.value.split(" —")[0]}. (Demo — no payment was made.)`); }
    if (t === "maint") { const urg = $('[name="urg"]:checked', f).value; done(`Request #KPG-${String(48210 + f.desc.value.length).padStart(6, "0")} logged: ${f.cat.value} (${urg}).${urg === "Emergency" ? " For emergencies, call our 24/7 line at (512) 555-0148." : " A coordinator will follow up within one business day."} (Demo — nothing was sent.)`); }
    f.reset();
  }));

  // ---------- Mobile bottom bar: owners vs. tenants by scroll position ----------
  const ownerBtn = $("[data-mbar-owner]"), tenantBtn = $("[data-mbar-tenant]"), mbar = $("[data-mbar]");
  const audSections = $$("[data-aud]");
  let raf = 0;
  function syncBar() {
    raf = 0;
    const mid = innerHeight / 2;
    const cur = audSections.find((s) => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    if (!cur) return;
    const tenant = cur.dataset.aud === "tenant";
    ownerBtn.hidden = tenant; tenantBtn.hidden = !tenant;
    mbar.hidden = cur.id === "analysis";
  }
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(syncBar); }, { passive: true });
  syncBar();

  window.MuseKeystone = { roi: calc };
})();
