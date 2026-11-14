(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const mobile = () => window.matchMedia("(max-width: 760px)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };
  const download = (name, type, text) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  /* Art */
  $("[data-art=hero]").innerHTML = Art.hero();
  $("[data-art=founders]").innerHTML = Art.founders();
  $$("[data-gal]").forEach((f) => f.insertAdjacentHTML("afterbegin", Art.gallery(f.dataset.gal)));
  $$("[data-prod]").forEach((p) => { p.innerHTML = Art.product(p.dataset.prod); });

  /* Nav */
  const nav = $("[data-nav]"), burger = $("[data-burger]"), mnav = $("#mnav");
  const syncNav = () => nav.classList.toggle("solid", window.scrollY > 40 || !mnav.hidden);
  window.addEventListener("scroll", syncNav, { passive: true });
  const setMenu = (open) => { mnav.hidden = !open; burger.setAttribute("aria-expanded", String(open)); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu"); $("use", burger).setAttribute("href", open ? "#i-x" : "#i-menu"); syncNav(); };
  burger.addEventListener("click", () => setMenu(mnav.hidden));
  $$("a, button", mnav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  syncNav();

  /* Hours (Asheville time) */
  const sched = { 0: [11, 20], 1: [12, 21], 2: [12, 21], 3: [12, 21], 4: [12, 21], 5: [11, 23], 6: [11, 23] };
  const fmt = (h) => `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`;
  let day = new Date().getDay(), hour = new Date().getHours() + new Date().getMinutes() / 60;
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    hour = (+get("hour") % 24) + +get("minute") / 60;
  } catch { /* fall back to local time */ }
  const [o, c] = sched[day], open = hour >= o && hour < c;
  $("[data-hours-text]").textContent = open ? `Open Today: ${fmt(o)}–${fmt(c)}` : hour < o ? `Opens Today at ${fmt(o)}` : `Closed · Open Tomorrow ${fmt(sched[(day + 1) % 7][0])}`;
  $("[data-hours-badge]").classList.toggle("closed", !open);
  $$(".hours [data-days]").forEach((r) => r.classList.toggle("today", r.dataset.days.split(",").includes(String(day))));
  $("[data-today]").textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  /* Tap list */
  const beers = [
    ["Summit Haze", "New England IPA", 6.8, 55, "Juicy, tropical, pillowy soft. Citra & Mosaic hops.", "hop", ["new", "sparkle", "New"]],
    ["Blue Ridge Pils", "Czech Pilsner", 4.9, 35, "Crisp, clean, noble hops. Our best-seller since day one.", "light"],
    ["Copper Line", "American Amber", 5.4, 30, "Toasty malt, caramel, balanced bitterness.", "amber"],
    ["Dark Hollow", "Oatmeal Stout", 5.8, 25, "Chocolate, coffee, velvet mouthfeel. Nitro pour.", "dark"],
    ["Trail Dust", "West Coast IPA", 7.2, 65, "Piney, resinous, old-school dank. For the hop heads.", "hop"],
    ["Fog Valley", "Witbier", 4.6, 15, "Orange peel, coriander, refreshing. Great gateway beer.", "light"],
    ["Firebreak", "Double IPA", 8.5, 70, "Bold, tropical, dangerously smooth for 8.5%.", "hop", ["limited", "flame", "Limited"]],
    ["Harvest Table", "Farmhouse Saison", 6.2, 22, "Peppery, dry, complex. Brewed with local wildflower honey.", "light"],
    ["Stone Bridge", "Brown Ale", 5.1, 20, "Nutty, toasty, easy-drinking. A chill autumn pint.", "amber"],
    ["River Sour", "Berliner Weisse", 3.8, 5, "Tart, bright, kettle-soured with NC peaches.", "sour", ["seasonal", "leaf", "Seasonal"]],
    ["Basecamp", "Golden Ale", 4.4, 18, "Light, approachable, crushable. The beer for people who don't like beer.", "light"],
    ["Night Shift", "Imperial Stout", 10.2, 50, "Bourbon barrel-aged 6 months. Dark chocolate, vanilla, oak.", "dark", ["only", "star", "Brewery Only"]],
  ];
  $("[data-taps]").innerHTML = beers.map(([name, style, abv, ibu, note, fam, tag], i) => `<article class="beer" data-fam="${fam}">
    ${tag ? `<span class="tag ${tag[0]}">${icon(tag[1])}${tag[2]}</span>` : ""}
    <p class="beer-no">Tap ${String(i + 1).padStart(2, "0")}</p><h3>${name}</h3><p class="style">${style}</p>
    <dl class="stats"><div><dt>ABV</dt><dd>${abv.toFixed(1)}%</dd></div><div><dt>IBU</dt><dd>${ibu}</dd></div><span class="ibu-bar" role="img" aria-label="Bitterness ${ibu} of 100"><i style="width:${ibu}%"></i></span></dl>
    <p class="note">${note}</p></article>`).join("");
  $$("[data-fam]").forEach((b) => b.tagName === "BUTTON" && b.addEventListener("click", () => {
    $$("button[data-fam]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    $$(".beer").forEach((card) => { card.hidden = b.dataset.fam !== "all" && card.dataset.fam !== b.dataset.fam; });
  }));

  /* Beer menu PDF (generated in the browser) */
  function beerPdf() {
    const lines = [["F2", 24, "IRON RIDGE BREWING CO. - ON TAP"], ["F1", 10, `142 Riverside Drive, Asheville, NC 28801  |  Updated ${new Date().toLocaleDateString("en-US")}`], ["", 0, ""]];
    beers.forEach(([name, style, abv, ibu, note, , tag]) => {
      lines.push(["F2", 13, `${name.toUpperCase()}  -  ${style}  ${abv.toFixed(1)}% ABV / ${ibu} IBU${tag ? `  [${tag[2].toUpperCase()}]` : ""}`]);
      lines.push(["F1", 10, note]);
    });
    lines.push(["", 0, ""], ["F1", 9, "Drink responsibly. You must be 21+ to purchase. Taplist rotates; ask your bartender."]);
    const esc = (s) => s.replace(/[\\()]/g, (x) => `\\${x}`).replace(/[^\x20-\x7E]/g, "-");
    let y = 760, stream = "BT\n";
    for (const [f, size, text] of lines) { if (!f) { y -= 10; continue; } stream += `/${f} ${size} Tf 1 0 0 1 50 ${y} Tm (${esc(text)}) Tj\n`; y -= size + 8; }
    stream += "ET";
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>",
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
    let pdf = "%PDF-1.4\n"; const off = [];
    objs.forEach((ob, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${ob}\nendobj\n`; });
    const x = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((n) => `${String(n).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
    return pdf;
  }
  $$("[data-pdf]").forEach((b) => b.addEventListener("click", () => { download("iron-ridge-beer-menu.pdf", "application/pdf", beerPdf()); toast("Beer menu PDF downloaded"); }));

  /* Taproom collage dots (mobile swipe) */
  const collage = $("[data-collage]"), cdots = $$("[data-col-dots] i");
  collage.addEventListener("scroll", () => { const i = Math.round(collage.scrollLeft / Math.max(1, collage.clientWidth)); cdots.forEach((d, j) => d.classList.toggle("on", i === j)); }, { passive: true });

  /* Dialogs */
  document.addEventListener("click", (e) => { const c = e.target.closest("[data-close]"); if (c) c.closest("dialog").close(); });
  $$("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  $("[data-food]").addEventListener("click", () => $('[data-modal="food"]').showModal());

  /* Tour booking */
  const tourM = $('[data-modal="tour"]'), form = $("[data-tour-form]");
  const tours = { standard: { price: 15, days: [6, 0], times: ["1:00 PM", "3:00 PM"], name: "Standard Tour" }, vip: { price: 45, days: [5], times: ["5:00 PM"], name: "VIP Brewer's Experience" } };
  function fillDates() {
    const t = tours[form.tour.value], out = [];
    const d = new Date(); d.setHours(12, 0, 0, 0);
    for (let i = 1; out.length < 8 && i < 60; i++) { const x = new Date(d); x.setDate(d.getDate() + i); if (t.days.includes(x.getDay())) out.push(x); }
    $("[data-dates]").innerHTML = out.map((x) => `<option value="${x.toISOString().slice(0, 10)}">${x.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</option>`).join("");
    $("[data-times]").innerHTML = t.times.map((x) => `<option>${x}</option>`).join("");
    total();
  }
  const clampG = () => { const g = Math.min(12, Math.max(1, Math.round(+form.guests.value || 1))); form.guests.value = g; return g; };
  const total = () => { const g = Math.min(12, Math.max(1, +form.guests.value || 1)); $("[data-total]").textContent = `$${tours[form.tour.value].price * g}`; };
  $$("[data-g]").forEach((b) => b.addEventListener("click", () => { form.guests.value = Math.min(12, Math.max(1, (+form.guests.value || 0) + +b.dataset.g)); total(); }));
  form.guests.addEventListener("input", total);
  form.guests.addEventListener("blur", () => { clampG(); total(); });
  $$('input[name="tour"]', form).forEach((r) => r.addEventListener("change", fillDates));
  function openTour(type) {
    form.reset(); form.hidden = false; $(".done", tourM).hidden = true; $("[data-err]", form).textContent = "";
    $$("[aria-invalid]", form).forEach((x) => x.removeAttribute("aria-invalid")); $(".age-check").classList.remove("bad");
    if (type && tours[type]) form.tour.value = type;
    fillDates();
    tourM.showModal();
  }
  $$("[data-book]").forEach((b) => b.addEventListener("click", () => { setMenu(false); openTour(b.dataset.book); }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input:not([type=radio]):not([type=checkbox]), select", form).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    const ageOk = form.age.checked;
    $(".age-check").classList.toggle("bad", !ageOk);
    $("[data-err]", form).textContent = first ? "Please complete the highlighted fields." : ageOk ? "" : "All guests on a tasting tour must be 21 or older.";
    if (first || !ageOk) { (first || form.age).focus(); return; }
    const t = tours[form.tour.value], g = clampG(), when = new Date(`${form.date.value}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    $("[data-done]", tourM).textContent = `${t.name} for ${g} on ${when} at ${form.time.value} — $${t.price * g} due at check-in. Confirmation IR-${Math.floor(1000 + Math.random() * 9000)} would be sent to ${form.email.value}. (Demo — nothing was sent.)`;
    form.hidden = true; $(".done", tourM).hidden = false;
  });

  /* Events: real dates + .ics downloads */
  const nextDow = (dow, h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); let add = (dow - d.getDay() + 7) % 7; if (add === 0 && new Date() > d) add = 7; d.setDate(d.getDate() + add); return d; };
  const fixed = (mo, dd, h, m) => { const now = new Date(); const d = new Date(now.getFullYear(), mo, dd, h, m); if (d < now) d.setFullYear(d.getFullYear() + 1); return d; };
  const evs = {
    trivia: ["Trivia Night at Iron Ridge", nextDow(3, 19, 0), 2, "Free to play. Win beer.", "RRULE:FREQ=WEEKLY;BYDAY=WE"],
    music: ["Live Music: The Appalachian Drifters", nextDow(5, 19, 30), 3, "Bluegrass on the patio. No cover."],
    dinner: ["Brewer's Dinner: 5-Course Beer Pairing", fixed(2, 22, 18, 30), 3, "$85/person. Limited to 30 seats."],
    anniversary: ["Iron Ridge Anniversary Party — Year 4", fixed(3, 5, 12, 0), 10, "Rare keg tappings, live music all day, food trucks. Free entry."],
  };
  $("[data-friday]").textContent = `This Friday · ${evs.music[1].toLocaleDateString("en-US", { month: "short", day: "numeric" })} · 7:30PM`;
  const stamp = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
  $$("[data-ics]").forEach((b) => b.addEventListener("click", () => {
    const [title, start, hours, desc, rule] = evs[b.dataset.ics];
    const end = new Date(start.getTime() + hours * 3600000);
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Iron Ridge Brewing//Events//EN", "BEGIN:VEVENT", `UID:${b.dataset.ics}-${stamp(start)}@ironridge.example`, `DTSTAMP:${stamp(new Date())}`,
      `DTSTART;TZID=America/New_York:${stamp(start)}`, `DTEND;TZID=America/New_York:${stamp(end)}`, ...(rule ? [rule] : []), `SUMMARY:${title}`, `DESCRIPTION:${desc}`, "LOCATION:142 Riverside Drive\\, Asheville\\, NC 28801", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    download(`${b.dataset.ics}.ics`, "text/calendar", ics);
    toast(`Added “${title}” — check your downloads`);
  }));
  $("[data-all-events]").addEventListener("click", (e) => { e.preventDefault(); toast("Full calendar coming soon — follow us on Instagram for weekly lineups"); });

  /* Beer finder */
  const AVL = ["28801", "28803", "28804", "28805", "28806"];
  const locs = [
    ["Wicked Weed Funkatorium", "Bar/Restaurant", "Asheville", "Summit Haze, Blue Ridge Pils", 452, 312, ["28801"], ["288"]],
    ["Tasty Beverage Company", "Bottle Shop", "Asheville", "Full lineup + cans", 410, 268, ["28801"], ["288"]],
    ["The Biltmore Wine Bar", "Restaurant", "Asheville", "Copper Line, Basecamp", 470, 350, ["28803"], ["288"]],
    ["Highland Brewing Taproom", "Cross-tap", "Asheville", "Trail Dust", 520, 330, ["28803"], ["288"]],
    ["Fonta Flora State of Confusion", "Bottle Shop", "Morganton", "Seasonal releases", 680, 214, ["28655"], ["286"]],
    ["Burial Beer", "Cross-tap", "Asheville", "Dark Hollow", 438, 330, ["28801"], ["288"]],
    ["Green Man Brewery", "Cross-tap", "Asheville", "Fog Valley", 400, 300, ["28801"], ["288"]],
    ["Ingles Markets", "Grocery", "12 WNC locations", "6-packs & variety packs", 290, 380, [...AVL, "28655", "28792", "28778", "28739"], ["286", "287", "288"]],
  ];
  const map = $("[data-map]");
  map.innerHTML = Art.wncMap() + `<g data-home transform="translate(426 286)"><rect x="-13" y="-13" width="26" height="26" rx="6" fill="#1C1917"/><path d="M-7 5 L-2 -3 L1 1 L4 -5 L8 5 Z" fill="#D97706"/></g>`
    + locs.map(([name, type, , , x, y], i) => `<g class="pin" data-pin="${i}" tabindex="0" role="button" aria-label="${name}, ${type}" transform="translate(${x} ${y})"><circle class="halo" r="22"/><circle class="core" r="10" fill="${type === "Cross-tap" ? "#4D7C2F" : type === "Bottle Shop" || type === "Grocery" ? "#B45309" : "#D97706"}" stroke="#fff" stroke-width="2.5"/></g>`).join("");
  const list = $("[data-locs]");
  list.innerHTML = locs.map(([name, type, city, pours], i) => `<li><button class="loc" type="button" data-loc="${i}"><b>${name}</b><span class="meta">${type} · ${city}</span><span class="pours">${pours}</span></button></li>`).join("");
  function select(i) {
    $$(".pin").forEach((p) => p.classList.toggle("on", +p.dataset.pin === i));
    $$(".loc").forEach((l) => l.classList.toggle("on", +l.dataset.loc === i));
    const btn = $(`[data-loc="${i}"]`);
    if (btn && !mobile()) btn.scrollIntoView({ block: "nearest" });
  }
  list.addEventListener("click", (e) => { const b = e.target.closest("[data-loc]"); if (b) select(+b.dataset.loc); });
  map.addEventListener("click", (e) => { const p = e.target.closest("[data-pin]"); if (p) select(+p.dataset.pin); });
  map.addEventListener("keydown", (e) => { const p = e.target.closest("[data-pin]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(+p.dataset.pin); } });
  function filter() {
    const q = $("[data-zip]").value.trim().toLowerCase();
    let n = 0;
    locs.forEach(([name, type, city, pours, , , zips, areas], i) => {
      const numeric = /^\d{1,5}$/.test(q);
      const hit = !q || (numeric ? zips.some((z) => z.startsWith(q)) || (q.length >= 3 && areas.includes(q.slice(0, 3))) : `${name} ${type} ${city} ${pours}`.toLowerCase().includes(q));
      $(`[data-loc="${i}"]`).parentElement.hidden = !hit;
      $(`[data-pin="${i}"]`).classList.toggle("dim", !hit);
      if (hit) n++;
    });
    $("[data-loc-count]").textContent = q ? (n ? `${n} location${n === 1 ? "" : "s"} near “${$("[data-zip]").value.trim()}”` : `No stockists match “${$("[data-zip]").value.trim()}” yet — try 28801 or Asheville.`) : `${locs.length} locations carry Iron Ridge`;
  }
  $("[data-zip]").addEventListener("input", filter);
  filter();

  /* Shop */
  let bag = 0;
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => { bag++; b.classList.add("added"); b.textContent = "Added"; setTimeout(() => { b.classList.remove("added"); b.textContent = "Add to cart"; }, 1400); toast(`${b.dataset.add} added · ${bag} item${bag === 1 ? "" : "s"} in your cart (demo)`); }));
  $("[data-full-shop]").addEventListener("click", (e) => { e.preventDefault(); toast("The full online shop opens soon — everything is available in the taproom today"); });

  /* Newsletter */
  $("[data-news]").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#news-email"), msg = $("[data-news-msg]"), ok = input.checkValidity();
    input.setAttribute("aria-invalid", String(!ok));
    msg.className = `news-msg ${ok ? "ok" : "bad"}`;
    msg.textContent = ok ? "You're in. Release alerts headed your way (demo — nothing was sent)." : "Enter a valid email address.";
    if (ok) e.target.reset();
  });

  /* Footer accordion: collapsed on mobile, always open on desktop */
  const cols = $$(".col");
  const syncCols = () => cols.forEach((d) => { d.open = !mobile(); });
  let wasMobile = mobile();
  syncCols();
  window.addEventListener("resize", () => { if (mobile() !== wasMobile) { wasMobile = mobile(); syncCols(); } });
  cols.forEach((d) => $("summary", d).addEventListener("click", (e) => { if (!mobile()) e.preventDefault(); }));
})();
