(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ic = (n, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const num = (v) => Number(String(v).replace(/[^0-9.]/g, "")) || 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("[data-toast]"); let tt;
  const toast = (t) => { toastEl.textContent = t; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3400); };
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // ---------- Art ----------
  $("[data-hero]").innerHTML = Art.house("twilight");
  $("[data-agent]").innerHTML = Art.agent();
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- Menu ----------
  const menu = $("[data-menu]"), mb = $("[data-menu-btn]");
  const setMenu = (open) => { menu.hidden = !open; mb.setAttribute("aria-expanded", String(open)); mb.setAttribute("aria-label", open ? "Close menu" : "Open menu"); mb.innerHTML = ic(open ? "x" : "menu"); };
  mb.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // ---------- Gallery ----------
  const GAL = [
    ["front", "Exterior front", "wide"], ["great", "Great room", "tall"], ["kitchen", "Kitchen", "wide"], ["detail", "Kitchen detail", "sq"],
    ["bedroom", "Primary bedroom", "wide"], ["bath", "Primary bathroom", "tall"], ["pool", "Backyard & infinity pool", "wide"], ["outdoor", "Outdoor kitchen", "sq"],
    ["office", "Home office", "tall"], ["casita", "Guest casita", "wide"], ["dining", "Dining room", "wide"], ["garage", "3-car garage", "sq"],
  ];
  const gal = $("[data-gallery]");
  gal.innerHTML = GAL.map(([k, c, s], i) => `<button class="ph ${s}" type="button" data-ph="${i}" aria-label="Open photo ${i + 1} of ${GAL.length}: ${c}">${Art.scene(k)}<span>${c}</span></button>`).join("");
  $("[data-dots]").innerHTML = GAL.map(() => "<i></i>").join("");
  const syncDots = () => {
    const first = gal.firstElementChild; if (!first) return;
    const idx = Math.round(gal.scrollLeft / (first.getBoundingClientRect().width + 12));
    $$("[data-dots] i").forEach((d, i) => d.classList.toggle("on", i === Math.min(idx, GAL.length - 1)));
  };
  gal.addEventListener("scroll", syncDots, { passive: true }); syncDots();
  const lb = $("[data-modal=lightbox]"); let gi = 0;
  function showPhoto(i) {
    gi = (i + GAL.length) % GAL.length;
    $("[data-lb-img]").innerHTML = Art.scene(GAL[gi][0]);
    $("[data-lb-cap]").textContent = GAL[gi][1];
    $("[data-lb-count]").textContent = `${gi + 1} of ${GAL.length}`;
  }
  gal.addEventListener("click", (e) => { const b = e.target.closest("[data-ph]"); if (b) { showPhoto(+b.dataset.ph); lb.showModal(); } });
  $$("[data-lb]").forEach((b) => b.addEventListener("click", () => showPhoto(gi + +b.dataset.lb)));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") showPhoto(gi + 1); if (e.key === "ArrowLeft") showPhoto(gi - 1); });
  let sx = null; const lbi = $("[data-lb-img]");
  lbi.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  lbi.addEventListener("touchend", (e) => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) showPhoto(gi + (dx < 0 ? 1 : -1)); sx = null; });

  // ---------- Floor plan & specs ----------
  const ROOMS = [
    ["3-Car Garage", 20, 20, 180, 130], ["Entry", 200, 20, 80, 110], ["Dining", 280, 20, 140, 110], ["Kitchen", 420, 20, 160, 110], ["Butler's Pantry", 580, 20, 60, 110, "v"],
    ["Primary Bath", 640, 20, 100, 140], ["Office", 20, 150, 90, 90], ["Laundry", 110, 150, 90, 50], ["Powder", 110, 200, 90, 40], ["Great Room", 200, 130, 300, 170],
    ["Primary Suite", 500, 130, 140, 150], ["Closet", 640, 160, 100, 120], ["Bedroom 2", 20, 240, 90, 90], ["Bath 2", 110, 240, 90, 45], ["Bath 3", 110, 285, 90, 45],
    ["Bedroom 3", 20, 330, 90, 100], ["Bedroom 4", 110, 330, 90, 100], ["Bedroom 5", 200, 300, 150, 130], ["Bath 4", 350, 300, 60, 50],
  ];
  const OUT = [["Covered Patio", 410, 300, 230, 50, "#F4EBDA"], ["Infinity Pool & Spa", 350, 360, 290, 70, "#CFE8F2"], ["Guest Casita", 660, 320, 80, 110, "#fff"]];
  const ft = (px) => Math.round(px / 5);
  $("[data-plan]").innerHTML = `<svg viewBox="0 0 760 450" role="img" aria-label="Stylized floor plan: garage, office and three bedrooms on the west wing; entry, dining, kitchen, great room and primary suite in the center and east; covered patio, infinity pool and detached guest casita at the rear">
    ${OUT.map(([n, x, y, w, h, f]) => `<g class="rmg"><rect class="rm" x="${x}" y="${y}" width="${w}" height="${h}" style="fill:${f}"${n === "Guest Casita" ? "" : ' stroke-dasharray="6 4"'}/><text class="rmt" x="${x + w / 2}" y="${y + h / 2 + (n === "Guest Casita" ? -4 : 4)}" text-anchor="middle">${n === "Guest Casita" ? "Casita" : n}</text>${n === "Guest Casita" ? `<text class="rmd" x="${x + w / 2}" y="${y + h / 2 + 12}" text-anchor="middle">450 sq ft</text>` : ""}</g>`).join("")}
    ${ROOMS.map(([n, x, y, w, h, v]) => `<g class="rmg"><rect class="rm" x="${x}" y="${y}" width="${w}" height="${h}"/>${v ? `<text class="rmt" transform="translate(${x + w / 2 + 4} ${y + h / 2}) rotate(-90)" text-anchor="middle">Pantry</text>` : `<text class="rmt" x="${x + w / 2}" y="${y + h / 2 - (h > 45 ? 2 : -4)}" text-anchor="middle">${n}</text>${h > 45 ? `<text class="rmd" x="${x + w / 2}" y="${y + h / 2 + 13}" text-anchor="middle">${ft(w)}' × ${ft(h)}'</text>` : ""}`}</g>`).join("")}
    <rect x="20" y="20" width="720" height="410" fill="none" stroke="#1E3A5F" stroke-width="0"/><path d="M20 20 H740 V280 M640 280 H500 V300 H410 M350 350 V430 H20 V20" fill="none" stroke="#1E3A5F" stroke-width="5"/>
    <g transform="translate(720 430)"><path d="M0 -26 L6 -10 L0 -14 L-6 -10Z" fill="#C9A96E"/><text class="rmd" y="0" text-anchor="middle">N</text></g></svg>`;

  const SPECS = [
    ["Living area", "4,820 sq ft"], ["Lot size", "0.75 acres (32,670 sq ft)"], ["Year built", "2021"], ["Style", "Contemporary Desert Modern"],
    ["Construction", "Stucco and natural stone"], ["Roof", "Flat with parapet, TPO membrane"], ["Flooring", "Porcelain tile, white oak hardwood"],
    ["Cooling", "3-zone HVAC, 16 SEER"], ["Heating", "Forced air + radiant in-floor (primary bath, kitchen)"], ["Water heater", "Tankless (2 units)"],
    ["HOA", "$285/month (gated community, common area maintenance)"], ["Property tax (2025)", "$14,280/year"], ["School district", "Scottsdale Unified — Saguaro High School"], ["MLS#", "AZ-2026-48210"],
  ];
  $("[data-specs] tbody").innerHTML = SPECS.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("");

  function pdf(lines, file) {
    const esc = (s) => s.replace(/[–—]/g, "-").replace(/·/g, "|").replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
    let s = "BT\n", y = 750;
    for (const [f, size, text] of lines) { if (!f) { y -= 10; continue; } s += `/${f} ${size} Tf 1 0 0 1 56 ${y} Tm (${esc(text)}) Tj\n`; y -= size + 8; }
    s += "ET\n0.79 0.66 0.43 RG 2 w 56 770 m 556 770 l S";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
      `<< /Length ${s.length} >>\nstream\n${s}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>"];
    let out = "%PDF-1.4\n"; const off = [];
    objs.forEach((o, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    download(new Blob([out], { type: "application/pdf" }), file);
  }
  function download(blob, file) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  $("[data-spec-pdf]").addEventListener("click", () => {
    pdf([["F2", 22, "4821 Ridgewood Terrace"], ["F1", 12, "Scottsdale, AZ 85262  |  $2,450,000  |  MLS# AZ-2026-48210"], ["F1", 11, "5 Bed | 4.5 Bath | 4,820 sq ft | 0.75 Acre Lot | Built 2021"], ["", 0, ""],
      ["F2", 14, "Property specifications"], ...SPECS.map(([k, v]) => ["F1", 11, `${k}: ${v}`]), ["", 0, ""], ["F2", 14, "Highlights"],
      ...$$(".glance li").map((li) => ["F1", 11, `${li.querySelector("h3").textContent} - ${li.querySelector("p").textContent}`]), ["", 0, ""],
      ["F1", 11, "Open House: Saturday, April 4, 2026, 11:00 AM - 3:00 PM"], ["F1", 11, "Victoria Reeves, Pinnacle Realty | (480) 555-0192 | victoria@pinnaclerealty.com"],
      ["F1", 8, "Information deemed reliable but not guaranteed. Equal Housing Opportunity."]], "4821-Ridgewood-Terrace-Spec-Sheet.pdf");
    toast("Spec sheet downloaded.");
  });

  // ---------- Map ----------
  const POIS = [
    ["Pinnacle Peak Trail", "Hiking", 2.1, "hike", 540, 96, "#5E7B48"], ["Grayhawk Golf Club", "Golf", 3.8, "golf", 300, 250, "#2F7D5B"],
    ["Scottsdale Quarter", "Shopping & dining", 4.3, "bag", 420, 330, "#B45309"], ["Whole Foods Market", "Grocery", 5.1, "cart", 300, 380, "#15803D"],
    ["HonorHealth Scottsdale", "Hospital", 6.2, "hospital", 640, 360, "#B91C1C"], ["Scottsdale Airport", "Airport", 8.7, "plane", 520, 470, "#475569"],
  ];
  const H = [450, 190];
  $("[data-map]").innerHTML = `<svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMid slice" role="group" aria-label="Map of the property and nearby points of interest">
    <rect width="900" height="560" fill="#EFE6D6"/>
    <path d="M430 0 L520 60 L600 30 L700 90 L820 40 L900 70 V0Z" fill="#D9C3A1"/><path d="M500 40 L540 10 L580 50Z" fill="#C2A47E"/><text x="545" y="30" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#7A6142">Pinnacle Peak</text>
    <path d="M200 200 C 260 230 320 220 380 280 L 300 310 C 260 280 220 270 180 260Z" fill="#CFDDB8"/><path d="M-10 420 C 200 400 360 470 520 440 S 800 400 910 430" stroke="#BFD5E6" stroke-width="14" fill="none"/>
    ${[["M0 190 H900", 10], ["M450 0 V560", 10], ["M0 330 C 300 320 600 340 900 320", 8], ["M150 0 C 180 200 220 400 260 560", 7], ["M720 0 C 700 200 690 380 700 560", 7], ["M0 470 H900", 6]].map(([d, w]) => `<path d="${d}" stroke="#fff" stroke-width="${w}" fill="none"/>`).join("")}
    <text x="460" y="16" font-family="Inter, sans-serif" font-size="10" fill="#9C8B70" transform="rotate(90 460 16)">N Pima Rd</text><text x="20" y="183" font-family="Inter, sans-serif" font-size="10" fill="#9C8B70">E Happy Valley Rd</text>
    <path d="M370 140 L 530 140 L 540 240 L 360 240Z" fill="#E6D9C2" stroke="#C9A96E" stroke-width="2" stroke-dasharray="6 4"/><text x="450" y="232" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" font-weight="600" fill="#8A6E3E">RIDGEWOOD TERRACE (GATED)</text>
    <g data-lines></g>
    ${POIS.map(([n, c, d, i, x, y, col], k) => `<g class="poi" data-poi="${k}" tabindex="0" role="button" aria-label="${n}, ${c}, ${d} miles" transform="translate(${x} ${y})"><circle class="b" r="17" fill="${col}" stroke="#fff" stroke-width="3"/><svg x="-9" y="-9" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><use href="#i-${i}"/></svg></g>`).join("")}
    <g transform="translate(${H[0]} ${H[1]})"><circle r="34" fill="#1E3A5F" opacity=".15"/><path d="M0 0 C -14 -18 -20 -28 -20 -36 a20 20 0 0 1 40 0 C 20 -28 14 -18 0 0Z" fill="#1E3A5F" stroke="#C9A96E" stroke-width="3"/><circle cy="-36" r="7" fill="#C9A96E"/></g>
    <rect x="${H[0] - 92}" y="${H[1] + 10}" width="184" height="26" rx="13" fill="#1E3A5F"/><text x="${H[0]}" y="${H[1] + 27}" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#fff">4821 Ridgewood Terrace</text></svg>`;
  $("[data-poi-list]").innerHTML = POIS.map(([n, c, d, i], k) => `<li><button type="button" data-pl="${k}"><span class="pl-ic">${ic(i)}</span><span><b>${n}</b><small>${c}</small></span><em>${d} mi</em></button></li>`).join("");
  const card = $("[data-poi-card]"), lines = $("[data-lines]");
  function hl(k) {
    $$(".poi").forEach((p) => p.classList.toggle("on", p.dataset.poi === String(k)));
    $$("[data-pl]").forEach((b) => b.classList.toggle("on", b.dataset.pl === String(k)));
    if (k == null) { card.hidden = true; lines.innerHTML = ""; return; }
    const [n, , d, , x, y] = POIS[k];
    lines.innerHTML = `<path d="M${H[0]} ${H[1]} L${x} ${y}" stroke="#1E3A5F" stroke-width="2.5" stroke-dasharray="6 6"/>`;
    const p = $(`.poi[data-poi="${k}"]`), box = card.parentElement.getBoundingClientRect(), r = p.getBoundingClientRect();
    card.innerHTML = `<b>${n}</b>${d} miles from the property`;
    card.style.left = `${r.left + r.width / 2 - box.left}px`; card.style.top = `${r.top + r.height / 2 - box.top}px`; card.hidden = false;
  }
  const mapEl = $("[data-map]");
  mapEl.addEventListener("mouseover", (e) => { const p = e.target.closest(".poi"); if (p) hl(+p.dataset.poi); });
  mapEl.addEventListener("focusin", (e) => { const p = e.target.closest(".poi"); if (p) hl(+p.dataset.poi); });
  mapEl.addEventListener("click", (e) => { const p = e.target.closest(".poi"); if (p) hl(+p.dataset.poi); });
  mapEl.addEventListener("mouseleave", () => hl(null));
  $("[data-poi-list]").addEventListener("mouseover", (e) => { const b = e.target.closest("[data-pl]"); if (b) hl(+b.dataset.pl); });
  $("[data-poi-list]").addEventListener("focusin", (e) => { const b = e.target.closest("[data-pl]"); if (b) hl(+b.dataset.pl); });
  $("[data-poi-list]").addEventListener("click", (e) => { const b = e.target.closest("[data-pl]"); if (b) hl(+b.dataset.pl); });
  $("[data-poi-list]").addEventListener("mouseleave", () => hl(null));

  // ---------- RSVP ----------
  const SLOTS = [["11 AM", 6], ["11:30 AM", 3], ["12 PM", 8], ["12:30 PM", 2], ["1 PM", 5], ["1:30 PM", 7], ["2 PM", 4], ["2:30 PM", 6]];
  $("[data-slots]").insertAdjacentHTML("beforeend", SLOTS.map(([s, n]) => `<option value="${s}">${s} — ${n} spot${n === 1 ? "" : "s"} left</option>`).join(""));
  const rf = $("[data-rsvp]"), done = $("[data-done]");
  let last = null;
  function validate(form, rules) {
    const errs = [];
    $$("[aria-invalid]", form).forEach((el) => el.removeAttribute("aria-invalid"));
    rules.forEach(([el, ok, msg]) => { if (!ok) { if (el) el.setAttribute("aria-invalid", "true"); errs.push(msg); } });
    return errs;
  }
  rf.addEventListener("submit", (e) => {
    e.preventDefault();
    const agentPick = $('[name="agent"]:checked', rf);
    const errs = validate(rf, [
      [rf.name, rf.name.value.trim().length > 1, "your full name"], [rf.email, emailOk(rf.email.value), "a valid email"],
      [rf.phone, rf.phone.checkValidity() && rf.phone.value.replace(/\D/g, "").length >= 10, "a 10-digit phone number"],
      [rf.slot, !!rf.slot.value, "a time slot"], [null, !!agentPick, "whether you're working with an agent"],
    ]);
    $("[data-err]").textContent = errs.length ? `Please add ${errs.join(", ")}.` : "";
    if (errs.length) { const bad = $("[aria-invalid]", rf); (bad || $('[name="agent"]', rf)).focus(); return; }
    const first = rf.name.value.trim().split(/\s+/)[0];
    last = { slot: rf.slot.value, name: rf.name.value.trim() };
    const opt = rf.slot.selectedOptions[0], s = SLOTS.find(([v]) => v === rf.slot.value);
    if (s && s[1] > 0) { s[1]--; opt.textContent = `${s[0]} — ${s[1]} spot${s[1] === 1 ? "" : "s"} left`; }
    $("[data-done-text]").textContent = `Thanks, ${first}! Your spot on the ${rf.slot.value} guided tour on Saturday, April 4, 2026 is reserved. A confirmation would go to ${rf.email.value.trim()}${agentPick.value === "Yes" ? ", and Victoria will coordinate with your agent" : ""}. (Demo — nothing was sent.)`;
    rf.hidden = true; done.hidden = false; done.focus();
  });
  $("[data-again]").addEventListener("click", () => { rf.reset(); rf.hidden = false; done.hidden = true; rf.name.focus(); });
  $("[data-ics]").addEventListener("click", () => {
    const [h, m] = (() => { const t = (last && last.slot) || "11 AM"; const mm = t.match(/(\d+)(?::(\d+))?\s*(AM|PM)/); let hh = +mm[1]; if (mm[3] === "PM" && hh !== 12) hh += 12; return [hh, +(mm[2] || 0)]; })();
    const z = (n) => String(n).padStart(2, "0");
    const startUtc = `20260404T${z(h + 7)}${z(m)}00Z`, endM = m + 30, endUtc = `20260404T${z(h + 7 + Math.floor(endM / 60))}${z(endM % 60)}00Z`;
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pinnacle Realty//Open House//EN", "BEGIN:VEVENT", `UID:openhouse-4821-ridgewood-${startUtc}@pinnaclerealty.example`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
      `DTSTART:${startUtc}`, `DTEND:${endUtc}`, "SUMMARY:Open House — 4821 Ridgewood Terrace", "LOCATION:4821 Ridgewood Terrace\\, Scottsdale\\, AZ 85262", "DESCRIPTION:Guided tour with Victoria Reeves\\, Pinnacle Realty. (480) 555-0192", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    download(new Blob([ics], { type: "text/calendar" }), "Open-House-4821-Ridgewood-Terrace.ics");
  });

  // ---------- Contact dialog (private showing / pre-approval / message) ----------
  const cm = $("[data-modal=contact]"), cf = $("[data-cform]"), cdone = $("[data-cm-done]");
  const MODES = {
    showing: ["Request a Private Showing", "Can't make the open house? Victoria will arrange a private tour at a time that suits you.", "Request Showing", true],
    preapproval: ["Get Pre-Approved", "Connect with our partner lender, Desert Financial CU. Victoria will introduce you.", "Start Pre-Approval", false],
    message: ["Send Victoria a Message", "Questions about 4821 Ridgewood Terrace? Victoria usually replies within the hour.", "Send Message", false],
  };
  let mode = "showing";
  $$("[data-contact]").forEach((b) => b.addEventListener("click", () => {
    mode = b.dataset.contact; const [t, s, btn, date] = MODES[mode];
    cf.reset(); cf.hidden = false; cdone.hidden = true; $("[data-cm-err]").textContent = "";
    $("[data-cm-title]").textContent = t; $("[data-cm-sub]").textContent = s; $("[data-cm-submit]").textContent = btn;
    $("[data-cm-date]").hidden = !date;
    cf.date.min = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    if (mode === "preapproval") cf.msg.value = `I'm interested in financing for 4821 Ridgewood Terrace — estimated payment ${$("[data-total]").textContent}/mo with ${$("[data-down-amt]").textContent} down.`;
    cm.showModal(); cf.name.focus();
  }));
  cf.addEventListener("submit", (e) => {
    e.preventDefault();
    const errs = validate(cf, [[cf.name, cf.name.value.trim().length > 1, "your name"], [cf.email, emailOk(cf.email.value), "a valid email"],
      [cf.phone, !cf.phone.value || cf.phone.checkValidity(), "a valid phone number"], [cf.date, mode !== "showing" || !cf.date.value || cf.date.value >= cf.date.min, "a date from tomorrow onward"]]);
    $("[data-cm-err]").textContent = errs.length ? `Please add ${errs.join(", ")}.` : "";
    if (errs.length) { $("[aria-invalid]", cf).focus(); return; }
    const first = cf.name.value.trim().split(/\s+/)[0];
    $("[data-cm-done-text]").textContent = {
      showing: `Thanks, ${first}! Victoria will contact you to confirm a private showing${cf.date.value ? ` on ${new Date(cf.date.value + "T12:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}` : ""}.`,
      preapproval: `Thanks, ${first}! Desert Financial CU will reach out at ${cf.email.value.trim()} to start your pre-approval.`,
      message: `Thanks, ${first}! Victoria will reply to ${cf.email.value.trim()} shortly.`,
    }[mode] + " (Demo — nothing was sent.)";
    cf.hidden = true; cdone.hidden = false; $("button", cdone).focus();
  });

  // ---------- Mortgage calculator ----------
  const calc = $("[data-calc]");
  let term = 30;
  const COLORS = [["Principal & Interest", "#C9A96E"], ["Property Tax", "#7FA7D9"], ["HOA", "#E8DCC4"], ["Insurance", "#5FA39A"]];
  function compute() {
    const price = num(calc.price.value), pct = +calc.down.value, down = price * pct / 100, loan = price - down, r = num(calc.rate.value) / 100 / 12, n = term * 12;
    const pi = loan <= 0 ? 0 : r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const parts = [pi, num(calc.tax.value) / 12, num(calc.hoa.value), num(calc.ins.value) / 12];
    return { down, pct, parts, total: parts.reduce((a, b) => a + b, 0) };
  }
  function renderCalc() {
    const { down, pct, parts, total } = compute();
    $("[data-down-amt]").textContent = `${usd(down)} (${pct}%)`;
    $("[data-total]").innerHTML = `${usd(total)}<small>/mo</small>`;
    let a = -Math.PI / 2; const R = 70, cx = 85, cy = 85;
    const segs = parts.map((v, i) => {
      const frac = total ? v / total : 0, a2 = a + frac * Math.PI * 2, large = frac > 0.5 ? 1 : 0;
      const d = frac >= 0.9999 ? `M${cx} ${cy - R} A${R} ${R} 0 1 1 ${cx - 0.01} ${cy - R}` : `M${cx + R * Math.cos(a)} ${cy + R * Math.sin(a)} A${R} ${R} 0 ${large} 1 ${cx + R * Math.cos(a2)} ${cy + R * Math.sin(a2)}`;
      a = a2; return frac > 0 ? `<path d="${d}" fill="none" stroke="${COLORS[i][1]}" stroke-width="28"/>` : "";
    }).join("");
    $("[data-pie]").innerHTML = `<svg viewBox="0 0 170 170" role="img" aria-label="Payment breakdown: ${parts.map((v, i) => `${COLORS[i][0]} ${usd(v)}`).join(", ")}">${segs}<text x="85" y="82" text-anchor="middle" font-family="Inter, sans-serif" font-size="11" fill="#94A3B8">${term}-year</text><text x="85" y="99" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="700" fill="#fff">${calc.rate.value}%</text></svg>`;
    $("[data-legend]").innerHTML = parts.map((v, i) => `<li><i style="background:${COLORS[i][1]}"></i><span>${COLORS[i][0]}</span><b>${usd(v)}</b></li>`).join("");
  }
  calc.addEventListener("input", renderCalc);
  calc.addEventListener("submit", (e) => e.preventDefault());
  $$("[name=price],[name=tax],[name=hoa],[name=ins]", calc).forEach((inp) => inp.addEventListener("blur", () => { inp.value = num(inp.value).toLocaleString("en-US"); }));
  $("[data-term]").addEventListener("click", (e) => { const b = e.target.closest("[data-v]"); if (!b) return; term = +b.dataset.v; $$("[data-term] button").forEach((x) => x.setAttribute("aria-pressed", String(x === b))); renderCalc(); });
  renderCalc();

  // ---------- Similar listings ----------
  const SIM = [["7930 E Raintree Dr", 1895000, "4 bed, 3.5 bath, 3,640 sq ft", ["day", 1]], ["22614 N Pinnacle Peak Rd", 2780000, "5 bed, 5 bath, 5,210 sq ft", ["twilight", 1]], ["10585 E Crescent Moon Dr", 3150000, "6 bed, 6 bath, 6,800 sq ft", ["day", 2], "Just Listed"]];
  $("[data-similar]").innerHTML = SIM.map(([a, p, m, [t, v], tag]) => `<article class="sim"><div class="sim-img">${Art.house(t, v).replace(/aria-label="[^"]*"/, `aria-label="Exterior of ${a}"`)}${tag ? `<span class="tag">${tag}</span>` : ""}</div><div class="sim-body"><p class="p">${usd(p)}</p><h3>${a}</h3><p class="m">${m}</p><button class="txt" type="button" data-listing="${a}">View Listing ${ic("arrow")}</button></div></article>`).join("");
  $("[data-similar]").addEventListener("click", (e) => { const b = e.target.closest("[data-listing]"); if (b) toast(`Listing pages aren't part of this demo — ask Victoria about ${b.dataset.listing}.`); });
  $$("[data-social]").forEach((b) => b.addEventListener("click", () => toast(`${b.dataset.social} profile links are placeholders in this demo.`)));

  // ---------- Floating RSVP ----------
  const fl = $("[data-float]");
  if ("IntersectionObserver" in window) {
    const seen = new Set();
    const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); fl.classList.toggle("away", seen.size > 0); });
    [$("#top"), $("#rsvp"), $(".footer")].forEach((el) => io.observe(el));
  }

  window.MuseOpenHouse = { payment: () => compute() };
})();
