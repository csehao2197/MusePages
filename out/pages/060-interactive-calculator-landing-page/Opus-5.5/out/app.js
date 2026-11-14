(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const usd = (n) => (n < 0 ? "−" : "") + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  const fmt = (n) => Math.round(n).toLocaleString("en-US");
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } } };
  const FREE = /@(gmail|yahoo|hotmail|outlook|icloud|aol|proton(mail)?)\./i;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

  /* ---------- model ---------- */
  const SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
  const PLANS = [["Starter", 3600], ["Starter", 3600], ["Growth", 9600], ["Scale", 19200], ["Enterprise", 36000]];
  const AUTO = { manual: 0.7, none: 0.7, erp: 0.55, legacy: 0.45 };
  const TOOL_CONSOLIDATION = 0.6, ERROR_RATE = 0.04;
  const INDUSTRIES = [["Manufacturing", 9.5], ["Healthcare", 11], ["Retail & e-commerce", 8.5], ["Logistics", 10.5], ["Professional services", 7], ["Software / SaaS", 6], ["Construction", 12], ["Nonprofit", 8]];
  const SIZE_AVG = [12000, 28000, 61000, 118000, 240000];
  const S = { size: 2, ind: 0, sol: "manual", hours: 40, rate: 45, tools: 800, team: 4, goals: ["time"] };

  function compute() {
    const labor = S.hours * 52 * S.rate, tools = S.tools * 12, current = labor + tools;
    const auto = AUTO[S.sol], [plan, P] = PLANS[S.size];
    const laborSave = labor * auto, toolSave = tools * TOOL_CONSOLIDATION, errSave = labor * ERROR_RATE;
    const gross = laborSave + toolSave + errSave, net = gross - P;
    return { labor, tools, current, auto, plan, P, laborSave, toolSave, errSave, gross, net, projected: current - net, hours: S.hours * 52 * auto, roi: (net / P) * 100, payback: gross > 0 ? P / (gross / 12) : Infinity };
  }

  /* ---------- inputs ---------- */
  $("[data-ind]").innerHTML = INDUSTRIES.map(([n], i) => `<option value="${i}">${n}</option>`).join("");
  const sizeIn = $("[data-size]");
  sizeIn.removeAttribute("list");
  const syncSize = () => { const t = `${SIZES[S.size]} employees`; $("[data-size-out]").textContent = t; sizeIn.setAttribute("aria-valuetext", t); sizeIn.style.setProperty("--p", `${(S.size / 4) * 100}%`); };
  let started = false;
  const touch = () => { started = true; update(); };
  sizeIn.addEventListener("input", () => { S.size = Number(sizeIn.value); syncSize(); touch(); });
  $("[data-ind]").addEventListener("change", (e) => { S.ind = Number(e.target.value); touch(); });
  $("[data-sol]").addEventListener("change", (e) => { S.sol = e.target.value; touch(); });
  const LIM = { hours: [1, 2000], rate: [10, 500], tools: [0, 100000], team: [1, 500] };
  $$("[data-in]").forEach((el) => el.addEventListener("input", () => {
    const k = el.dataset.in, v = Number(el.value), [lo, hi] = LIM[k];
    const ok = el.value !== "" && Number.isFinite(v) && v >= lo && v <= hi;
    el.setAttribute("aria-invalid", !ok);
    if (ok) S[k] = v;
    touch();
  }));
  $("[data-dec]").addEventListener("click", () => { const t = $('[data-in="team"]'); t.value = Math.max(1, Number(t.value) - 1); t.dispatchEvent(new Event("input")); });
  $("[data-inc]").addEventListener("click", () => { const t = $('[data-in="team"]'); t.value = Math.min(500, Number(t.value) + 1); t.dispatchEvent(new Event("input")); });
  $("[data-goals]").addEventListener("change", () => { S.goals = $$("[data-goals] input:checked").map((i) => i.value); touch(); });

  // tooltips (click/hover/focus)
  const tipbox = $("[data-tipbox]"); let tipFor = null;
  function showTip(b) { tipFor = b; tipbox.textContent = b.dataset.tip; tipbox.hidden = false; const r = b.getBoundingClientRect(); tipbox.style.left = `${Math.max(12, Math.min(innerWidth - 292, r.left + scrollX - 120))}px`; tipbox.style.top = `${r.bottom + scrollY + 8}px`; b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-describedby", "tipbox"); }
  function hideTip() { if (!tipFor) return; tipbox.hidden = true; tipFor.setAttribute("aria-expanded", "false"); tipFor.removeAttribute("aria-describedby"); tipFor = null; }
  $$("[data-tip]").forEach((b) => { b.setAttribute("aria-expanded", "false"); b.addEventListener("click", (e) => { e.stopPropagation(); tipFor === b ? hideTip() : showTip(b); }); b.addEventListener("mouseenter", () => showTip(b)); b.addEventListener("mouseleave", hideTip); b.addEventListener("focus", () => showTip(b)); b.addEventListener("blur", hideTip); });
  document.addEventListener("click", hideTip);

  /* ---------- wizard ---------- */
  let step = 0;
  function showStep(i) {
    step = i;
    $$("[data-step]").forEach((s) => (s.hidden = Number(s.dataset.step) !== i));
    $$("[data-sn]").forEach((li) => { const n = Number(li.dataset.sn); li.classList.toggle("on", n === i); li.classList.toggle("done", n < i); });
    $("[data-pbar] i").style.width = `${((i + 1) / 3) * 100}%`; $("[data-pbar]").setAttribute("aria-valuenow", Math.round(((i + 1) / 3) * 100));
    $("[data-back]").hidden = i === 0;
    $("[data-next]").innerHTML = i === 2 ? `See my results ${icon("i-arrow")}` : `Next ${icon("i-arrow")}`;
    const first = $(`[data-step="${i}"] input, [data-step="${i}"] select`); if (first && started) first.focus();
  }
  $("[data-next]").addEventListener("click", () => {
    if (step === 1) {
      const bad = $$("[data-in]").filter((el) => el.getAttribute("aria-invalid") === "true" || el.value === "");
      if (bad.length) { $("[data-err]").textContent = `Please check ${bad.map((b) => $(`label[for="${b.id}"]`).textContent.trim().split(/\s{2,}/)[0].replace(/\?$/, "").toLowerCase()).join(", ")}.`; bad[0].focus(); return; }
      $("[data-err]").textContent = "";
    }
    started = true;
    if (step < 2) showStep(step + 1); else reveal();
  });
  $("[data-back]").addEventListener("click", () => showStep(step - 1));

  /* ---------- live preview with animated numbers ---------- */
  const anim = new Map();
  function tween(el, to, f) {
    const from = anim.get(el) ?? 0; anim.set(el, to);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = f(to); return; }
    const t0 = performance.now(), d = 450;
    const run = (t) => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3); el.textContent = f(from + (to - from) * e); if (k < 1 && anim.get(el) === to) requestAnimationFrame(run); };
    requestAnimationFrame(run);
  }
  let revealed = false, unlocked = false;
  function update() {
    const c = compute();
    tween($("[data-pv-savings]"), c.net, usd);
    tween($("[data-pv-hours]"), c.hours, fmt);
    tween($("[data-pv-roi]"), c.roi, (v) => `${fmt(v)}%`);
    $("[data-mb-savings]").textContent = `${usd(c.net)}/yr`;
    if (revealed) renderResults(false);
    syncBar();
  }

  /* ---------- results ---------- */
  function reveal() {
    revealed = true; const r = $("[data-results]"); r.hidden = false;
    renderResults(true);
    r.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    $("[data-r-savings]").setAttribute("tabindex", "-1"); setTimeout(() => $("[data-r-savings]").focus({ preventScroll: true }), 400);
  }
  const months = (m) => (m === Infinity ? "n/a" : m < 1 ? "< 1 month" : `${m.toFixed(1)} months`);
  function renderResults(anew) {
    const c = compute();
    if (anew) { anim.set($("[data-r-savings]"), 0); }
    tween($("[data-r-savings]"), c.net, (v) => `${usd(v)}/year`);
    $("[data-r-hours]").textContent = fmt(c.hours);
    $("[data-r-roi]").textContent = `${fmt(c.roi)}%`;
    $("[data-r-payback]").textContent = months(c.payback);
    $("[data-r-current]").textContent = usd(c.current);
    $("[data-r-projected]").textContent = usd(c.projected);
    $("[data-r-net]").textContent = usd(c.net);
    $("[data-r-payback2]").textContent = months(c.payback);
    // before / after bars
    const max = Math.max(c.current, c.projected, 1), W = 520;
    const bar = (y, label, v, col) => `<text x="0" y="${y - 8}" font-size="13" fill="#334155">${label}</text><rect x="0" y="${y}" width="${W}" height="26" rx="6" fill="#F1F5F9"/><rect x="0" y="${y}" width="${Math.max(4, (v / max) * W)}" height="26" rx="6" fill="${col}"/><text x="${Math.min(W - 4, Math.max(4, (v / max) * W) + 8)}" y="${y + 18}" font-size="13" font-weight="700" fill="#0F172A" ${((v / max) * W) > W - 90 ? `text-anchor="end" fill="#fff" x="${(v / max) * W - 8}"` : ""}>${usd(v)}</text>`;
    $("[data-bars]").innerHTML = `<svg viewBox="0 0 ${W} 130" role="img" aria-label="Annual cost today ${usd(c.current)} versus with Ledgerly ${usd(c.projected)}">${bar(28, "Today", c.current, "#94A3B8")}${bar(92, "With Ledgerly", Math.max(0, c.projected), "#0F766E")}</svg>`;
    // donut of current cost
    const parts = [["Manual processing", c.labor * (1 - ERROR_RATE), "#0F766E"], ["Error & rework", c.labor * ERROR_RATE, "#F59E0B"], ["Tools & fees", c.tools, "#2563EB"]];
    let acc = 0; const R = 60, C = 2 * Math.PI * R;
    $("[data-pie]").innerHTML = `<svg viewBox="0 0 160 160" role="img" aria-label="Current cost breakdown: ${parts.map(([l, v]) => `${l} ${usd(v)}`).join(", ")}"><circle cx="80" cy="80" r="${R}" fill="none" stroke="#F1F5F9" stroke-width="28"/>${parts.map(([, v, col]) => { const f = v / c.current, s = `<circle cx="80" cy="80" r="${R}" fill="none" stroke="${col}" stroke-width="28" stroke-dasharray="${f * C} ${C}" stroke-dashoffset="${-acc * C}" transform="rotate(-90 80 80)"/>`; acc += f; return s; }).join("")}<text x="80" y="78" text-anchor="middle" font-size="12" fill="#64748B">today</text><text x="80" y="96" text-anchor="middle" font-size="15" font-weight="800" fill="#0F172A">${usd(c.current)}</text></svg><ul class="legend">${parts.map(([l, v, col]) => `<li><i style="--c:${col}"></i>${l}<b>${Math.round((v / c.current) * 100)}%</b></li>`).join("")}</ul>`;
    // timeline to ROI
    const TW = 640, TH = 180, pad = 36, mx = Math.max(c.gross, c.P) * 1.05 || 1;
    const X = (m) => pad + (m / 12) * (TW - pad - 44), Y = (v) => TH - 24 - (v / mx) * (TH - 44);
    const pts = Array.from({ length: 13 }, (_, m) => `${X(m)},${Y((c.gross / 12) * m)}`).join(" ");
    const pb = c.payback;
    $("[data-timeline]").innerHTML = `<svg viewBox="0 0 ${TW} ${TH}" role="img" aria-label="Cumulative savings pass the annual subscription cost after ${months(pb)}"><g stroke="#E2E8F0">${[0, 3, 6, 9, 12].map((m) => `<path d="M${X(m)} 10V${TH - 24}"/>`).join("")}</g><g font-size="11" fill="#64748B">${[0, 3, 6, 9, 12].map((m) => `<text x="${X(m)}" y="${TH - 6}" text-anchor="middle">${m === 0 ? "Start" : `Mo ${m}`}</text>`).join("")}</g><path d="M${X(0)} ${Y(c.P)}H${X(12)}" stroke="#DC2626" stroke-dasharray="6 5" stroke-width="2"/><text x="${X(12)}" y="${Y(c.P) - 6}" text-anchor="end" font-size="11" fill="#DC2626">Ledgerly cost ${usd(c.P)}/yr</text><polyline points="${pts}" fill="none" stroke="#0F766E" stroke-width="3"/><polygon points="${X(0)},${Y(0)} ${pts} ${X(12)},${Y(0)}" fill="#0F766E" opacity=".1"/>${pb <= 12 ? `<circle cx="${X(pb)}" cy="${Y(c.P)}" r="6" fill="#F59E0B" stroke="#fff" stroke-width="2"/><text x="${X(pb) + 8}" y="${Y(c.P) + 18}" font-size="12" font-weight="700" fill="#0F172A">Break-even · ${months(pb)}</text>` : ""}<text x="${X(12) - 4}" y="${Y(c.gross) - 8}" text-anchor="end" font-size="12" font-weight="700" fill="#0F766E">${usd(c.gross)} saved</text></svg>`;
    // recommendations
    const [plan, P] = PLANS[S.size];
    $("[data-plan]").innerHTML = `<span class="tag">Recommended</span><h3>Based on your company size (${SIZES[S.size]}), we recommend the ${plan} plan</h3><p class="pp">${usd(P / 12)}<small style="font-size:14px;font-weight:500;color:#64748B">/month, billed annually</small></p><p>${plan === "Starter" ? "Up to 300 invoices a month, 2 approval levels." : plan === "Growth" ? "Up to 1,500 invoices a month, unlimited approvers, ERP sync." : plan === "Scale" ? "Up to 5,000 invoices a month, multi-entity, SSO." : "Unlimited volume, dedicated success manager, custom integrations."}</p>`;
    const FEATS = { time: [["AI invoice capture", "Reads invoices from email in seconds — no typing"], ["Auto-matching", "Matches invoices to POs and receipts automatically"]], cost: [["Tool consolidation", "Replace OCR, approval and payment add-ons"], ["Early-payment discounts", "Surfaces vendor discounts before they expire"]], accuracy: [["Duplicate detection", "Flags duplicate and suspicious invoices"], ["3-way matching", "Catches price and quantity mismatches"]], scale: [["Approval workflows", "Route by amount, department or entity"], ["Multi-entity books", "One inbox for every subsidiary"]] };
    const g = [...S.goals, ...["time", "cost", "accuracy", "scale"].filter((x) => !S.goals.includes(x))];
    const top = []; let k = 0; while (top.length < 3 && k < 4) { g.forEach((x) => { const f = FEATS[x][k]; if (f && top.length < 3 && !top.includes(f)) top.push(f); }); k++; }
    $("[data-features]").innerHTML = top.map(([t, d]) => `<li>${icon("i-check")}<span><b>${t}</b>${d}</span></li>`).join("");
    const STORIES = [["Northwind Logistics", "Logistics", "Cut invoice processing from 6 days to 1 and redeployed two AP clerks to vendor management.", "Dana P., Controller", "−78% processing time"], ["Brightwave Health", "Healthcare", "Duplicate detection paid for the subscription in the first quarter.", "Luis M., Director of Finance", "$41k duplicates caught"], ["Coastline Retail", "Retail & e-commerce", "We scaled from 800 to 3,000 invoices a month with the same team.", "Amy K., AP Manager", "3.7x volume, same team"]];
    const st = STORIES.find((s) => s[1] === INDUSTRIES[S.ind][0]) || STORIES[S.ind % 3];
    $("[data-story]").innerHTML = `<span class="res">${st[4]}</span><blockquote>“${st[2]}”</blockquote><figcaption>${st[3]} · ${st[0]} (${st[1]})</figcaption>`;
    $("[data-avg-proof]").textContent = `Companies like yours (${SIZES[S.size]} employees) save an average of ${usd(SIZE_AVG[S.size])} a year.`;
    // locked content (comparison + lines)
    const mine = S.hours / S.team, avg = INDUSTRIES[S.ind][1], topP = avg * 0.35, after = mine * (1 - c.auto);
    const cmax = Math.max(mine, avg, 1);
    $("[data-compare]").innerHTML = [["You today", mine, "#94A3B8"], [`${INDUSTRIES[S.ind][0]} average`, avg, "#64748B"], ["Top performers", topP, "#2563EB"], ["You with Ledgerly", after, "#0F766E"]].map(([l, v, col]) => `<div class="cbar"><span>${l}</span><span class="b"><i style="--c:${col};width:${(v / cmax) * 100}%"></i></span><b>${v.toFixed(1)} hrs</b></div>`).join("");
    const lines = [["Labor cost savings", `${Math.round(c.auto * 100)}% of ${fmt(S.hours)} hrs/wk automated at $${S.rate}/hr`, c.laborSave], ["Tool consolidation", `${TOOL_CONSOLIDATION * 100}% of ${usd(c.tools)} current tool spend`, c.toolSave], ["Error reduction", `Duplicate payments & rework ≈ ${ERROR_RATE * 100}% of labor cost`, c.errSave], ["Ledgerly subscription", `${plan} plan, annual`, -c.P]];
    $("[data-lines]").innerHTML = lines.map(([l, d, v]) => `<tr class="${v < 0 ? "neg" : ""}"><td>${l}<small>${d}</small></td><td>${usd(v)}</td></tr>`).join("") + `<tr class="tot"><td>Net annual savings</td><td>${usd(c.net)}</td></tr>`;
    $("[data-gate-preview]").innerHTML = `<table>${lines.map(([l, , v]) => `<tr><td>${l}</td><td style="text-align:right">${usd(v)}</td></tr>`).join("")}</table>`;
    $("[data-assume]").innerHTML = [`Ledgerly automates ${Math.round(AUTO.manual * 100)}% of manual AP hours for teams on spreadsheets (${Math.round(AUTO.erp * 100)}% if you already use an ERP add-on, ${Math.round(AUTO.legacy * 100)}% if you use legacy AP software).`, `${TOOL_CONSOLIDATION * 100}% of current AP tool spend is replaced.`, `Errors, duplicate payments and rework cost about ${ERROR_RATE * 100}% of AP labor and are largely eliminated.`, `Plan pricing: Starter $300/mo (up to 50 employees), Growth $800/mo, Scale $1,600/mo, Enterprise from $3,000/mo.`].map((t) => `<li>${t}</li>`).join("");
  }

  /* ---------- lead gate ---------- */
  let leadEmail = "";
  $("[data-lead]").addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target, em = f.email.value.trim(), err = $("[data-lead-err]");
    f.email.setAttribute("aria-invalid", "false");
    if (!validEmail(em)) { err.textContent = "Please enter your work email."; f.email.setAttribute("aria-invalid", "true"); f.email.focus(); return; }
    if (FREE.test(em)) { err.textContent = "Please use your work email so we can tailor the report to your company."; f.email.setAttribute("aria-invalid", "true"); f.email.focus(); return; }
    err.textContent = ""; leadEmail = em; unlock();
  });
  function unlock() {
    unlocked = true; $("[data-gate]").hidden = true; $("[data-full]").hidden = false; $("[data-lead-email]").textContent = leadEmail;
    toast("Full analysis unlocked. (Demo — no email is sent.)");
    $("[data-full]").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- PDF report (generated locally) ---------- */
  function makePDF(lines) {
    const ascii = (s) => s.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/−/g, "-").replace(/≈/g, "~").replace(/[^\x20-\x7E]/g, "").replace(/([()\\])/g, "\\$1");
    let y = 790, content = "";
    lines.forEach(([t, size = 11, gap = 16]) => { y -= gap; content += `BT /F${size >= 14 ? 2 : 1} ${size} Tf 56 ${y} Td (${ascii(t)}) Tj ET\n`; });
    const objs = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>", `<< /Length ${content.length} >>\nstream\n${content}endstream`];
    let pdf = "%PDF-1.4\n"; const off = [];
    objs.forEach((o, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const xref = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([pdf], { type: "application/pdf" });
  }
  $("[data-pdf]").addEventListener("click", () => {
    if (!unlocked) { toast("Enter your work email to unlock the PDF report."); $("[data-gate]").scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => $("[data-lead] [name=email]").focus(), 400); return; }
    const c = compute();
    const lines = [["Ledgerly Savings Report", 20, 0], [`Prepared for ${leadEmail} - ${new Date().toLocaleDateString("en-US")}`, 10, 22], ["Your inputs", 14, 30], [`Company size: ${SIZES[S.size]} employees  |  Industry: ${INDUSTRIES[S.ind][0]}`], [`Hours/week on invoice processing: ${S.hours}  |  Hourly rate: $${S.rate}  |  Tools: $${S.tools}/month  |  Team: ${S.team}`], ["Results", 14, 30], [`Annual savings potential: ${usd(c.net)}`], [`Hours saved per year: ${fmt(c.hours)}  |  ROI: ${fmt(c.roi)}%  |  Payback: ${months(c.payback)}`], [`Current annual cost: ${usd(c.current)}  |  Projected with Ledgerly: ${usd(c.projected)}`], ["Line items", 14, 30], [`Labor cost savings: ${usd(c.laborSave)}`], [`Tool consolidation: ${usd(c.toolSave)}`], [`Error reduction: ${usd(c.errSave)}`], [`Ledgerly subscription (${c.plan}): -${usd(c.P)}`], [`Net annual savings: ${usd(c.net)}`], ["Your results may vary. Estimates based on your inputs and average customer outcomes.", 9, 34], ["Demo report generated in your browser - Ledgerly is a fictional company.", 9]];
    const a = document.createElement("a"); a.href = URL.createObjectURL(makePDF(lines)); a.download = "ledgerly-savings-report.pdf"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast("Downloaded ledgerly-savings-report.pdf");
  });

  /* ---------- share / save / CTAs ---------- */
  const stateQS = () => new URLSearchParams({ size: S.size, ind: S.ind, sol: S.sol, hours: S.hours, rate: S.rate, tools: S.tools, team: S.team, goals: S.goals.join(".") }).toString();
  const shareURL = () => `${location.origin}${location.pathname}?${stateQS()}#results`;
  $("[data-share]").addEventListener("click", () => {
    const c = compute(), url = shareURL();
    openDlg(`<h3>Share your results</h3><p>Anyone with this link sees the same inputs and estimate.</p><div class="copybox"><input readonly value="${esc(url)}" aria-label="Results link" data-share-url><button class="btn" type="button" data-copy>Copy</button></div><a class="btn-g" href="mailto:?subject=${encodeURIComponent("Our AP automation savings estimate")}&body=${encodeURIComponent(`Ledgerly estimates ${usd(c.net)}/year in savings for us. See the breakdown: ${url}`)}">${icon("i-mail")}Share by email</a>`);
    $("[data-copy]", body).addEventListener("click", () => { const inp = $("[data-share-url]", body); try { navigator.clipboard.writeText(inp.value).then(() => toast("Link copied"), () => { inp.select(); toast("Press Ctrl/Cmd+C to copy"); }); } catch { inp.select(); toast("Press Ctrl/Cmd+C to copy"); } });
  });
  $("[data-save]").addEventListener("click", () => { store.set("ledgerly-calc", { ...S }); history.replaceState(null, "", `?${stateQS()}`); toast("Saved — your inputs will be here next time (and in this page's link)."); });
  $("[data-trial]").addEventListener("click", () => {
    openDlg(`<h3>Start your 14-day free trial</h3><p>No credit card required.</p><form data-tf novalidate><label>Work email<input type="email" name="email" autocomplete="email" value="${esc(leadEmail)}"></label><p class="err" data-tferr role="alert"></p><button class="btn" type="submit">Create my workspace</button></form>`);
    $("[data-tf]", body).addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.email.value.trim(); if (!validEmail(v)) { $("[data-tferr]", body).textContent = "Please enter a valid work email."; return; } body.innerHTML = `<h3>You're all set!</h3><p>A workspace for ${esc(v)} would be created with your ${PLANS[S.size][0]} plan settings. (Demo — nothing is sent.)</p>`; });
  });
  $("[data-demo]").addEventListener("click", () => {
    const base = new Date(); base.setHours(0, 0, 0, 0); const slots = []; for (let d = 1; slots.length < 6; d++) { const day = new Date(base.getTime() + d * 864e5); if (day.getDay() % 6 === 0) continue; [10, 14].forEach((h) => slots.push(new Date(day.getTime() + h * 36e5))); }
    let pick = -1;
    openDlg(`<h3>Schedule a 30-minute demo</h3><p>We'll walk through your numbers live.</p><div class="slots" role="group" aria-label="Available times">${slots.slice(0, 6).map((s, i) => `<button type="button" aria-pressed="false" data-slot="${i}">${s.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}<br>${s.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</button>`).join("")}</div><form data-df novalidate><label>Work email<input type="email" name="email" value="${esc(leadEmail)}" autocomplete="email"></label><p class="err" data-dferr role="alert"></p><button class="btn" type="submit">Book demo</button></form>`);
    $$("[data-slot]", body).forEach((b) => b.addEventListener("click", () => { pick = Number(b.dataset.slot); $$("[data-slot]", body).forEach((x) => x.setAttribute("aria-pressed", x === b)); }));
    $("[data-df]", body).addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.email.value.trim(); if (pick < 0 || !validEmail(v)) { $("[data-dferr]", body).textContent = "Pick a time and enter your email."; return; } const s = slots[pick]; body.innerHTML = `<h3>Demo booked</h3><p>${s.toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })} — an invite would go to ${esc(v)}. (Demo.)</p>`; });
  });
  $("[data-guide]").addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.email.value.trim(), m = $("[data-g-msg]"); if (!validEmail(v)) { m.className = "g-msg bad"; m.textContent = "Please enter a valid email."; return; } m.className = "g-msg ok"; m.textContent = `Lesson 1 of the ROI Guide is on its way to ${v}. (Demo — nothing is sent.)`; e.target.reset(); converted = true; });
  const CASES = [["Northwind Logistics", "Freight broker, 120 employees. Moved from email approvals to Ledgerly in three weeks; invoice cycle time fell from 6 days to 1."], ["Brightwave Health", "Clinic network, 600 employees. Duplicate detection caught $41k in the first quarter; AP headcount unchanged through 40% growth."], ["Coastline Retail", "Online retailer, 85 employees. Scaled from 800 to 3,000 invoices a month with the same three-person team."]];
  $$("[data-case]").forEach((b) => b.addEventListener("click", () => { const [n, t] = CASES[b.dataset.case]; openDlg(`<h3>Case study: ${n}</h3><p>${t}</p><p style="font-size:13px;color:#64748B">Illustrative case study for this demo page.</p>`); }));

  /* ---------- exit intent (once, only after engagement, never after converting) ---------- */
  let exitShown = false, converted = false;
  document.addEventListener("mouseout", (e) => {
    if (e.relatedTarget || e.clientY > 0 || exitShown || !started || unlocked || converted || dlg.open) return;
    exitShown = true; const c = compute();
    openDlg(`<h3>Wait! Don't lose your results</h3><p>Your estimate:</p><p class="big-n">${usd(c.net)}/year</p><p>Want a copy in your inbox? No sales call, just your numbers.</p><form data-xf novalidate><label>Email<input type="email" name="email" autocomplete="email"></label><p class="err" data-xferr role="alert"></p><button class="btn" type="submit">Email me my results</button></form><button class="link" type="button" data-nothanks>No thanks</button>`);
    $("[data-nothanks]", body).addEventListener("click", () => dlg.close());
    $("[data-xf]", body).addEventListener("submit", (ev) => { ev.preventDefault(); const v = ev.target.email.value.trim(); if (!validEmail(v)) { $("[data-xferr]", body).textContent = "Please enter a valid email."; return; } converted = true; body.innerHTML = `<h3>Sent!</h3><p>Your estimate of ${usd(c.net)}/year would be emailed to ${esc(v)}. (Demo — nothing is sent.)</p>`; });
  });

  /* ---------- mobile sticky bar ---------- */
  const mbar = $("[data-mbar]"), preview = $(".preview");
  function syncBar() {
    const r = preview.getBoundingClientRect(), offPreview = r.bottom < 0 || r.top > innerHeight;
    const res = $("[data-results]"), inRes = revealed && res.getBoundingClientRect().top < innerHeight * 0.6 && res.getBoundingClientRect().bottom > 0;
    const show = started && offPreview && !inRes;
    mbar.hidden = !show; document.body.classList.toggle("has-mbar", show);
    $("a", mbar).setAttribute("href", revealed ? "#results" : "#calc"); $("a", mbar).textContent = revealed ? "See results" : "Finish";
  }
  addEventListener("scroll", syncBar, { passive: true });

  /* ---------- FAQ one-open; dialog + toast ---------- */
  const faqs = $$("[data-faq] details"); faqs.forEach((d) => d.addEventListener("toggle", () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input:not([readonly]), .btn, .slots button", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }

  /* ---------- restore from link or saved state ---------- */
  const qs = new URLSearchParams(location.search), saved = store.get("ledgerly-calc", null);
  const src = qs.has("hours") ? Object.fromEntries(qs) : saved;
  if (src) {
    const n = (k, lo, hi, d) => { const v = Number(src[k]); return Number.isFinite(v) && v >= lo && v <= hi ? v : d; };
    S.size = n("size", 0, 4, 2); S.ind = n("ind", 0, INDUSTRIES.length - 1, 0); S.sol = AUTO[src.sol] ? src.sol : "manual";
    S.hours = n("hours", 1, 2000, 40); S.rate = n("rate", 10, 500, 45); S.tools = n("tools", 0, 100000, 800); S.team = n("team", 1, 500, 4);
    S.goals = Array.isArray(src.goals) ? src.goals : String(src.goals || "time").split(".").filter((g) => ["time", "cost", "accuracy", "scale"].includes(g));
  }
  sizeIn.value = S.size; $("[data-ind]").value = S.ind; $("[data-sol]").value = S.sol;
  Object.entries({ hours: S.hours, rate: S.rate, tools: S.tools, team: S.team }).forEach(([k, v]) => ($(`[data-in="${k}"]`).value = v));
  $$("[data-goals] input").forEach((i) => (i.checked = S.goals.includes(i.value)));
  syncSize(); showStep(0); update(); renderResults(false);
  if (src) { started = true; reveal(); toast(qs.has("hours") ? "Showing shared results" : "Restored your saved inputs"); }
})();
