(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tt;
  const toast = (m) => { const t = $("[data-toast]"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2600); };
  const hash = (s) => { let h = 2166136261; for (const c of s.toLowerCase()) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

  /* ---------- Address book (sample local records) ---------- */
  const streets = [["Evergreen Terrace", "Springfield", 97477], ["Oak Avenue", "Springfield", 97477], ["Maple Drive", "Springfield", 97478], ["Willamette Street", "Riverside", 97401], ["River Road", "Riverside", 97404], ["Cedar Lane", "Oakwood", 97405], ["Hawthorne Court", "Oakwood", 97405], ["Pine Ridge Way", "Riverside", 97402], ["Sunset Boulevard", "Springfield", 97478], ["Elm Street", "Oakwood", 97403]];
  const book = [];
  streets.forEach(([st, city, zip], si) => { for (let k = 0; k < 6; k++) book.push({ line: `${[742, 738, 801, 655, 1120, 310][k] + si * 4} ${st}`, city, zip }); });
  const full = (a) => `${a.line}, ${a.city}, OR ${a.zip}`;

  /* ---------- Valuation model (deterministic, illustrative) ---------- */
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  function valuate(address, known) {
    const q = rng(hash(address) % 233280);
    const beds = 2 + Math.floor(q() * 4), baths = [1, 1.5, 2, 2.5, 3, 3.5][Math.min(5, beds - 1 + Math.floor(q() * 2))];
    const sqft = Math.round((1100 + beds * 280 + q() * 600) / 10) * 10, lot = (0.12 + q() * 0.3).toFixed(2), year = 1955 + Math.floor(q() * 65), garage = ["1-car", "2-car", "2-car", "3-car"][Math.floor(q() * 4)];
    const ppsf = 205 + q() * 50, mid = Math.round((sqft * ppsf) / 1000) * 1000, spread = known ? 0.035 : 0.06;
    const trend = (3 + q() * 6).toFixed(1);
    const series = months.map((_, i) => mid * (1 - trend / 100) + (mid * trend / 100) * (i / 11) + (q() - 0.5) * mid * 0.006);
    const city = (address.match(/(Springfield|Riverside|Oakwood)/i) || [null, "Springfield"])[1];
    const comps = book.filter((b) => b.city.toLowerCase() === city.toLowerCase() && full(b) !== address).slice(0, 12).sort(() => q() - 0.5).slice(0, 3)
      .map((b, i) => [`${b.line}`, Math.round((mid * (0.95 + q() * 0.1)) / 1000) * 1000, ["Dec 2025", "Jan 2026", "Feb 2026"][i]]);
    return { address, low: Math.round((mid * (1 - spread)) / 1000) * 1000, high: Math.round((mid * (1 + spread)) / 1000) * 1000, mid, conf: known ? "High" : "Medium", beds, baths, sqft, lot, year, garage, trend, series, comps };
  }
  const sample = { address: "742 Evergreen Terrace, Springfield", low: 485000, high: 520000, mid: 502000, conf: "High", beds: 4, baths: 2.5, sqft: 2100, lot: "0.28", year: 1998, garage: "2-car", trend: "6.2", series: [473, 476, 478, 482, 485, 489, 491, 494, 496, 498, 500, 502].map((k) => k * 1000), comps: [["738 Evergreen Terrace", 498000, "Jan 2026"], ["801 Oak Avenue", 512000, "Feb 2026"], ["655 Maple Drive", 475000, "Dec 2025"]] };

  function spark(series) {
    const w = 300, h = 64, min = Math.min(...series), max = Math.max(...series);
    const pts = series.map((v, i) => [(i / (series.length - 1)) * w, h - 6 - ((v - min) / (max - min || 1)) * (h - 14)]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Value trend over the last 12 months, rising"><path d="${d} L ${w} ${h} L 0 ${h} Z" fill="#05966922"/><path d="${d}" fill="none" stroke="#059669" stroke-width="2.5" vector-effect="non-scaling-stroke"/><circle cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="4" fill="#059669"/></svg>`;
  }
  function report(v, isSample) {
    const lo = v.low * 0.94, hi = v.high * 1.06, pct = (x) => ((x - lo) / (hi - lo)) * 100;
    return `<article class="report" aria-label="${isSample ? "Sample valuation report" : `Valuation report for ${v.address}`}">${isSample ? `<span class="wm">Sample Report</span>` : ""}
      <div><p class="r-prop">${icon("pin")}<b>${v.address}</b></p>
        <p class="r-label">Estimated Value</p><p class="r-value">${money(v.low)} – ${money(v.high)}</p>
        <span class="conf ${v.conf.toLowerCase()}">Confidence: ${v.conf}</span>
        <div class="range"><div class="bar" role="img" aria-label="Value range from ${money(v.low)} to ${money(v.high)}, estimate ${money(v.mid)}"><span class="band" style="left:${pct(v.low)}%;right:${100 - pct(v.high)}%"></span><span class="mk" style="left:${pct(v.mid)}%" data-l="Est. ${money(v.mid)}"></span></div>
          <p class="range-l"><span>Low <b>${money(v.low)}</b></span><span>High <b>${money(v.high)}</b></span></p></div>
        <dl class="factors"><div><dt>${icon("bed")}Bedrooms</dt><dd>${v.beds}</dd></div><div><dt>${icon("bath")}Bathrooms</dt><dd>${v.baths}</dd></div><div><dt>${icon("ruler")}Sq Ft</dt><dd>${v.sqft.toLocaleString("en-US")}</dd></div>
          <div><dt>${icon("tree")}Lot Size</dt><dd>${v.lot} acres</dd></div><div><dt>${icon("cal")}Year Built</dt><dd>${v.year}</dd></div><div><dt>${icon("car")}Garage</dt><dd>${v.garage}</dd></div></dl></div>
      <div class="side"><div class="trend"><div class="trend-h"><span>Last 12-Month Trend</span><b>${icon("up")}${v.trend}%</b></div>${spark(v.series)}</div>
        <div class="comps"><h3>Nearby Comparable Sales</h3><ul>${v.comps.map(([a, p, d]) => `<li><b>${a}</b><span>${d}</span><em>${money(p)}</em></li>`).join("")}</ul></div></div>
      ${isSample ? "" : `<div class="r-actions"><a class="btn btn-blue" href="#cma" data-to-cma>Get an Exact Number — Free CMA</a><button class="btn btn-ghost" type="button" data-email-report>Email Me This Report</button></div><p class="disclaimer">${v.conf === "High" ? "Estimate based on matched public records and recent nearby sales." : "We couldn't match this address to a public record, so the estimate uses neighborhood averages and has a wider range."} Online estimates are typically within 5–8% of market value. Illustrative demo data.</p>`}</article>`;
  }
  $("[data-sample]").innerHTML = report(sample, true);

  /* ---------- Address forms + autocomplete ---------- */
  let lastAddress = "";
  $$("[data-addr-form]").forEach((form, fi) => {
    const input = $("[data-addr]", form), ac = $("[data-ac]", form), err = form.nextElementSibling;
    let rows = [], idx = -1;
    const close = () => { ac.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); };
    const show = () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { close(); return; }
      rows = book.filter((b) => full(b).toLowerCase().includes(q)).slice(0, 5);
      idx = -1;
      ac.innerHTML = rows.map((b, i) => `<li role="option" id="ac${fi}-${i}" aria-selected="false" data-i="${i}">${icon("pin")}<span><b>${b.line}</b> <span>${b.city}, OR ${b.zip}</span></span></li>`).join("") + (rows.length ? `<li class="powered" aria-hidden="true">Sample address data</li>` : "");
      ac.hidden = !rows.length; input.setAttribute("aria-expanded", String(!ac.hidden));
    };
    const pick = (i) => { input.value = full(rows[i]); close(); };
    input.addEventListener("input", () => { err.textContent = ""; show(); });
    input.addEventListener("blur", () => setTimeout(close, 150));
    input.addEventListener("keydown", (e) => {
      if (ac.hidden || !rows.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); idx = (idx + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length; $$("[data-i]", ac).forEach((li, i) => li.setAttribute("aria-selected", String(i === idx))); input.setAttribute("aria-activedescendant", `ac${fi}-${idx}`); }
      else if (e.key === "Enter" && idx >= 0) { e.preventDefault(); pick(idx); }
      else if (e.key === "Escape") close();
    });
    ac.addEventListener("mousedown", (e) => { const li = e.target.closest("[data-i]"); if (li) { e.preventDefault(); pick(+li.dataset.i); } });
    form.addEventListener("submit", (e) => {
      e.preventDefault(); close();
      const v = input.value.trim();
      if (v.length < 6 || !/\d/.test(v) || !/[a-z]{3,}/i.test(v)) { err.textContent = "Please enter a full street address, including the house number."; input.focus(); return; }
      err.textContent = "";
      const known = book.some((b) => full(b).toLowerCase() === v.toLowerCase());
      showResult(v, known);
    });
  });
  function showResult(address, known) {
    lastAddress = address;
    const wrap = $("[data-result-wrap]");
    wrap.hidden = false;
    $("[data-result]").innerHTML = `<div class="result-head"><h2>Your Home Value Estimate</h2><a class="btn btn-ghost" href="#top" data-focus-addr>Check another address</a></div>${report(valuate(address, known), false)}`;
    wrap.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    wrap.focus({ preventScroll: true });
    const cmaAddr = $("[data-cma-addr]");
    // Keep following the latest estimate until the visitor types their own address.
    if (!cmaAddr.value || cmaAddr.parentElement.classList.contains("prefilled")) { cmaAddr.value = address; cmaAddr.parentElement.classList.add("prefilled"); }
    $$("[data-addr]").forEach((i) => { i.value = address; });
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-focus-addr]")) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); setTimeout(() => $("[data-addr]").focus({ preventScroll: true }), reduced ? 0 : 400); }
    if (e.target.closest("[data-email-report]")) { $("#cma").scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); setTimeout(() => $('[data-cma] [name="email"]').focus({ preventScroll: true }), reduced ? 0 : 500); toast("Add your email below and we'll send the full report"); }
  });

  /* ---------- Market chart ---------- */
  const med = [446, 449, 455, 458, 461, 463, 462, 464, 466, 468, 470, 472];
  const mLabels = ["Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026"];
  const chart = $("[data-chart]");
  function drawChart() {
    const W = Math.max(320, chart.clientWidth), H = 240, pad = { l: 52, r: 12, t: 12, b: 28 };
    const min = 440, max = 476, x = (i) => pad.l + (i / 11) * (W - pad.l - pad.r), y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
    const d = med.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
    const ticks = [440, 452, 464, 476];
    chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Median home price rose from $446,000 in April 2025 to $472,000 in March 2026">
      ${ticks.map((t) => `<path d="M${pad.l} ${y(t)} H${W - pad.r}" stroke="#E5E7EB"/><text x="${pad.l - 8}" y="${y(t) + 4}" text-anchor="end" font-size="12" fill="#6B7280">$${t}K</text>`).join("")}
      ${med.map((_, i) => (i % 2 === 0 || i === 11 ? `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="12" fill="#6B7280">${mLabels[i].slice(0, 3)}</text>` : "")).join("")}
      <path d="${d} L ${x(11)} ${y(min)} L ${x(0)} ${y(min)} Z" fill="#2563EB18"/><path d="${d}" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round"/>
      <line data-guide x1="0" x2="0" y1="${pad.t}" y2="${H - pad.b}" stroke="#9CA3AF" stroke-dasharray="3 3" visibility="hidden"/><circle data-dot r="5" fill="#2563EB" stroke="#fff" stroke-width="2" visibility="hidden"/>
      <rect class="hit" x="${pad.l}" y="${pad.t}" width="${W - pad.l - pad.r}" height="${H - pad.t - pad.b}" tabindex="0" aria-label="Explore monthly values with the arrow keys"/></svg><div class="tip" data-ctip hidden></div>`;
    const hit = $(".hit", chart), tip = $("[data-ctip]", chart), guide = $("[data-guide]", chart), dot = $("[data-dot]", chart);
    let cur = 11;
    const show = (i) => { cur = Math.max(0, Math.min(11, i)); const cx = x(cur), cy = y(med[cur]); guide.setAttribute("x1", cx); guide.setAttribute("x2", cx); guide.setAttribute("visibility", "visible"); dot.setAttribute("cx", cx); dot.setAttribute("cy", cy); dot.setAttribute("visibility", "visible"); tip.hidden = false; tip.innerHTML = `<b>$${med[cur]},000</b>${mLabels[cur]}`; const sc = chart.clientWidth / W; tip.style.left = `${cx * sc}px`; tip.style.top = `${cy * sc}px`; };
    const hide = () => { tip.hidden = true; guide.setAttribute("visibility", "hidden"); dot.setAttribute("visibility", "hidden"); };
    hit.addEventListener("pointermove", (e) => { const r = chart.getBoundingClientRect(), px = ((e.clientX - r.left) / r.width) * W; show(Math.round(((px - pad.l) / (W - pad.l - pad.r)) * 11)); });
    hit.addEventListener("pointerleave", hide);
    hit.addEventListener("focus", () => show(cur)); hit.addEventListener("blur", hide);
    hit.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") { e.preventDefault(); show(cur - 1); } if (e.key === "ArrowRight") { e.preventDefault(); show(cur + 1); } });
  }
  drawChart();
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(drawChart, 120); });
  window.MuseChart = { values: med };

  /* ---------- Team illustration ---------- */
  const agents = [[110, "#1E3A8A", "#E0B28E", "#2A1A10"], [230, "#047857", "#8D5A3E", "#1A1A1A"], [350, "#374151", "#F1C9A5", "#8A5A2A"], [470, "#2563EB", "#C9906C", "#4A3020"], [590, "#6B21A8", "#E0B28E", "#1A1A1A"]];
  $("[data-team]").innerHTML = `<svg viewBox="0 0 700 560" role="img" aria-label="The Keystone agent team standing in front of the Keystone office" preserveAspectRatio="xMidYMid slice">
    <rect width="700" height="560" fill="#DBEAFE"/><rect x="60" y="90" width="580" height="330" fill="#F9FAFB"/><path d="M40 100 350 20l310 80z" fill="#1E3A8A"/>${[0, 1, 2, 3].map((i) => `<rect x="${100 + i * 130}" y="140" width="100" height="120" fill="#BFDBFE" stroke="#93C5FD" stroke-width="4"/>`).join("")}
    <rect x="290" y="96" width="120" height="30" rx="4" fill="#2563EB"/><text x="350" y="117" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="16" font-weight="700" fill="#fff">KEYSTONE</text>
    <rect y="420" width="700" height="140" fill="#D1D5DB"/>
    ${agents.map(([x, suit, skin, hair], i) => `<g transform="translate(${x} ${400 + (i % 2) * 14})"><path d="M-48 160 L -44 40 Q 0 14 44 40 L 48 160 Z" fill="${suit}"/><path d="M-12 26 L 0 50 L 12 26" fill="#fff"/><circle cy="-6" r="32" fill="${skin}"/><path d="M-32 -10 Q -30 -44 0 -44 Q 32 -44 32 -10 Q 20 -26 0 -26 Q -20 -26 -32 -10Z" fill="${hair}"/><path d="M-10 6 q 10 8 20 0" stroke="#5A3420" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join("")}</svg>`;
  $$(".stars").forEach((s) => { s.innerHTML = icon("star").repeat(5); });

  /* ---------- FAQ (one open at a time) ---------- */
  const faqs = [["How accurate is the online estimate?", "Our algorithm uses recent comparable sales, tax records, and market trends to provide an estimate within 5-8% of actual market value. For a precise valuation, we recommend a professional CMA."], ["Do I have to be selling to get an estimate?", "Not at all. Many homeowners check their home value annually for financial planning, refinancing, or curiosity. There's zero obligation."], ["What is a CMA?", "A Comparative Market Analysis is a detailed report prepared by a licensed real estate agent. It compares your home to similar recently sold properties and accounts for unique features, condition, and local market trends."], ["How is this different from Zillow's Zestimate?", "We use local MLS data and agent expertise specific to your neighborhood. Our agents live and work in these communities, providing context that national algorithms miss."], ["Is my personal information safe?", "Absolutely. We never sell your information to third parties. Your data is used solely to provide your home valuation and connect you with a local Keystone agent if you request it."]];
  const faq = $("[data-faq]");
  faq.innerHTML = faqs.map(([q, a], i) => `<div class="qa"><h3><button type="button" aria-expanded="false" aria-controls="fa-${i}" id="fq-${i}">${q}${icon("down")}</button></h3><div class="ans" id="fa-${i}" role="region" aria-labelledby="fq-${i}"><div><p>${a}</p></div></div></div>`).join("");
  $$(".qa button", faq).forEach((b) => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    $$(".qa", faq).forEach((qa) => { qa.classList.remove("open"); $("button", qa).setAttribute("aria-expanded", "false"); });
    if (open) { b.closest(".qa").classList.add("open"); b.setAttribute("aria-expanded", "true"); }
  }));

  /* ---------- CMA form ---------- */
  const cma = $("[data-cma]");
  $("[data-cma-addr]").addEventListener("input", (e) => e.target.parentElement.classList.remove("prefilled"));
  cma.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    $$("input, select, textarea", cma).forEach((f) => { const bad = !f.checkValidity(); f.toggleAttribute("aria-invalid", bad); if (bad && !first) first = f; });
    $("[data-cma-err]").textContent = first ? "Please complete the highlighted fields." : "";
    if (first) { first.focus(); return; }
    const when = cma.when.value;
    $("[data-cma-text]").textContent = `Thanks, ${cma.name.value.split(" ")[0]}. A Keystone agent will call ${cma.phone.value} within 24 hours to schedule your free CMA walkthrough at ${cma.address.value}${when === "Just curious" || when === "Not selling" ? " — no pressure, just numbers" : ""}. (Demo — nothing was sent.)`;
    cma.hidden = true; $("[data-cma-done]").hidden = false; $("[data-cma-done]").focus();
  });

  /* ---------- Floating mobile CTA ---------- */
  const float = $("[data-float]");
  float.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); setTimeout(() => $("[data-addr]").focus({ preventScroll: true }), reduced ? 0 : 400); });
  if ("IntersectionObserver" in window) {
    const visible = new Set();
    const io = new IntersectionObserver((en) => { en.forEach((x) => (x.isIntersecting ? visible.add(x.target) : visible.delete(x.target))); float.classList.toggle("away", visible.size > 0); }, { threshold: 0.2 });
    [$(".hero"), $("#cma"), $(".banner")].forEach((el) => io.observe(el));
  }
})();
