(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id, cls = "i") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtN = (n) => n.toLocaleString("en-US");
  const A = window.Art;
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* unavailable */ } } };
  const starsHTML = (r, size = "") => `<span class="stars ${size}" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => icon("i-star", `i${i < r ? "" : " off"}`)).join("")}</span>`;

  /* ---------- deterministic sample data ---------- */
  let seed = 20261112; const rnd = () => ((seed = (seed * 48271) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const COLORS = Object.keys(A.COLORS);
  const SIZES = []; for (let s = 7; s <= 13; s += 0.5) SIZES.push(String(s));
  const FIRST = ["Maya", "Jordan", "Chris", "Priya", "Liam", "Sofia", "Noah", "Elena", "Marcus", "Hannah", "Diego", "Aisha", "Tom", "Grace", "Ben", "Leah", "Kai", "Olivia", "Sam", "Nina", "Owen", "Rosa", "Eli", "Zoe", "Ravi", "Ada", "Felix", "Ivy", "Hugo", "Mei"];
  const LAST = "ABCDEFGHJKLMNOPRSTVW".split("");
  const AVC = ["#14532D", "#1D4ED8", "#9333EA", "#B45309", "#BE123C", "#0F766E", "#4338CA", "#A16207"];
  const BANK = {
    5: { t: ["Best hiking boots I've owned", "Waterproof and comfy out of the box", "Worth every penny", "Rock solid on rocky trails", "Five stars from a trail runner turned hiker", "No break-in needed", "My feet stayed dry all weekend", "Great grip, great value"],
      s: ["Wore them on a 14-mile loop with creek crossings and my feet stayed completely dry.", "The quality of the leather and stitching is excellent for the price.", "Comfortable right out of the box — no blisters on day one.", "Grip on wet granite is fantastic.", "Fast shipping, arrived two days after ordering.", "Great value compared to boots twice the price.", "Easy to lace and the heel lock keeps everything snug on descents.", "Ankle support is firm without being stiff.", "Easy to clean after a muddy hike — just rinse and air dry.", "Fits true to size with a medium-weight sock."] },
    4: { t: ["Very good, a few small nitpicks", "Solid boots, slightly warm", "Great support, takes a hike to break in", "Comfortable and dry", "Good quality for the price"],
      s: ["Took one short hike to break in, then they were great.", "Run a little warm in summer but perfect in spring and fall.", "Quality feels premium and the waterproofing works.", "Shipping was quick and the box was well packed.", "The insole is just okay — I swapped mine for an aftermarket one.", "Good value for a waterproof leather boot.", "Laces are a bit long, but easy to tuck away.", "Fit is true to size, slightly narrow in the toe box."] },
    3: { t: ["Good boot, but runs narrow", "Mixed feelings", "Comfortable but heavy", "Fine for day hikes"],
      s: ["The toe box is narrow for my wide feet, so I'd size up.", "Waterproofing works, but they're heavier than I expected.", "Quality is decent, though the lace hooks feel thin.", "Comfortable on flat trails, less so on long descents.", "Shipping took a few extra days."] },
    2: { t: ["Not for wide feet", "Disappointed with durability", "Sizing was off"],
      s: ["The sole started separating at the toe after three months of weekend hikes.", "Ran a full half size small for me.", "Too stiff even after several hikes.", "Customer service was helpful with the exchange, though."] },
    1: { t: ["Leaked on the first rainy hike", "Returned them", "Not as described"],
      s: ["Water came through the tongue seam on my first rainy day.", "Gave me blisters on both heels and I returned them.", "Packaging was damaged and one boot had a scuff."] }
  };
  const PROS = ["Waterproof", "Comfortable", "Great grip", "Ankle support", "Quality materials", "Good value", "No break-in", "Easy to clean"];
  const CONS = ["Runs narrow", "A bit heavy", "Warm in summer", "Basic insole", "Long laces", "Stiff at first"];
  const RESP = ["Thanks for the detailed feedback. We're sorry the fit didn't work out — our team has reached out by email to arrange a free exchange for a wider size.", "We're sorry to hear about this. A seam leak is not expected and is covered by our 1-year warranty; please check your email for a prepaid return label.", "Thank you for taking the time to review. We've shared your notes on the insole and lace length with our product team.", "Thanks so much for the kind words — happy trails!"];

  const COUNTS = { 5: 847, 4: 312, 3: 56, 2: 20, 1: 12 };
  const ratings = []; for (const r of [5, 4, 3, 2, 1]) for (let i = 0; i < COUNTS[r]; i++) ratings.push(r);
  for (let i = ratings.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ratings[i], ratings[j]] = [ratings[j], ratings[i]]; }
  const NOW = Date.now(), DAY = 864e5;
  let fourYes = 0, threeYes = 0;
  const REVIEWS = ratings.map((r, i) => {
    const b = BANK[r], n = Math.min(b.s.length, 2 + Math.floor(rnd() * 3)), sents = []; while (sents.length < n) { const s = pick(b.s); if (!sents.includes(s)) sents.push(s); }
    if (r >= 4 && rnd() < 0.35) sents.push(pick(BANK[5].s));
    const anon = rnd() < 0.06, name = anon ? "Anonymous" : `${pick(FIRST)} ${pick(LAST)}.`;
    const media = rnd() < 0.09 ? Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => ({ kind: rnd() < 0.08 ? "video" : "photo", scene: Math.floor(rnd() * 8) })) : [];
    let rec = r === 5 ? true : r === 4 ? (fourYes++ < 306) : r === 3 ? (threeYes++ < 22) : false;
    const helpful = Math.floor(Math.pow(rnd(), 3) * (r >= 4 ? 140 : 90)), nothelp = Math.floor(rnd() * 6);
    const date = new Date(NOW - i * 0.55 * DAY - rnd() * 0.4 * DAY);
    const pros = r >= 3 ? Array.from(new Set([pick(PROS), pick(PROS)])) : [];
    const cons = r <= 4 && rnd() < 0.7 ? [pick(CONS)] : [];
    const resp = (r <= 2 && rnd() < 0.7) || (r === 3 && rnd() < 0.3) ? { text: r <= 2 ? RESP[rnd() < 0.5 ? 0 : 1] : RESP[2], date: new Date(date.getTime() + (1 + Math.floor(rnd() * 3)) * DAY) } : (r === 5 && rnd() < 0.02 ? { text: RESP[3], date: new Date(date.getTime() + DAY) } : null);
    return { id: `r${1247 - i}`, r, title: pick(b.t), body: sents.join(" "), name, av: AVC[i % AVC.length], verified: rnd() < 0.88, size: pick(SIZES), color: pick(COLORS), date, media, rec, helpful, nothelp, pros, cons, resp };
  });
  // featured: long, highly helpful reviews written by hand (replace three existing 5/4/5-star entries)
  const FEAT = [
    { r: 5, title: "Survived 200 trail miles and a week of rain", body: "I bought these for a section hike of the Appalachian Trail and put roughly 200 miles on them over two weeks, including four straight days of rain. My feet stayed dry every day — the only moisture was sweat, and the lining wicked it well enough that I didn't get a single blister. The Vibram-style lugs bit into wet roots and slick rock better than my previous boots, and the heel lock lacing kept my toes off the front on long descents. They took about 10 miles to fully soften around the ankle. After the trip the leather cleaned up with a damp cloth and they look almost new. If you have average-width feet, buy your normal size with a medium hiking sock.", helpful: 312, size: "10", color: "Timber Brown", media: [{ kind: "photo", scene: 2 }, { kind: "photo", scene: 0 }, { kind: "video", scene: 4 }], name: "Jordan K.", pros: ["Waterproof", "Great grip", "Ankle support"], cons: ["Stiff at first"] },
    { r: 4, title: "Great boot — size up if you have wide feet", body: "Quality is excellent and they're properly waterproof (I stood in a creek for a minute to test). Comfort was good from day one apart from the toe box, which is a little narrow; I exchanged my 9 for a 9.5 and that fixed it completely. Shipping was fast both times and the exchange was painless. Knocked off one star only because a wide option would be nice.", helpful: 245, size: "9.5", color: "Slate Gray", media: [{ kind: "photo", scene: 7 }], name: "Priya S.", pros: ["Waterproof", "Quality materials"], cons: ["Runs narrow"], resp: { text: "Thanks for the helpful sizing tip, Priya! A wide version is on our roadmap for next spring — we'll note your feedback.", days: 2 } },
    { r: 5, title: "Winter-ready with a warm sock", body: "Used these for snowy day hikes in Colorado down to about 15°F with a thick wool sock. Warm enough, totally dry, and the grip on packed snow is better than I expected for a three-season boot. Easy to clean salt off afterwards. Great value compared with the big-name boots I tried in store.", helpful: 198, size: "11", color: "Forest Green", media: [{ kind: "photo", scene: 6 }, { kind: "photo", scene: 5 }], name: "Marcus D.", pros: ["Great grip", "Good value"], cons: [] }
  ];
  const featIdx = [3, 8, 14].map((k) => REVIEWS.findIndex((x, i) => i >= k && x.r === FEAT[[3, 8, 14].indexOf(k)].r));
  featIdx.forEach((ix, k) => { const f = FEAT[k], o = REVIEWS[ix]; Object.assign(o, { title: f.title, body: f.body, helpful: f.helpful, nothelp: 3 + k, size: f.size, color: f.color, media: f.media, name: f.name, verified: true, rec: true, pros: f.pros, cons: f.cons, featured: true, resp: f.resp ? { text: f.resp.text, date: new Date(o.date.getTime() + f.resp.days * DAY) } : null }); });
  REVIEWS.forEach((r) => { if (!r.featured) r.helpful = Math.min(r.helpful, 150); });

  /* ---------- overview ---------- */
  const published = () => REVIEWS.filter((r) => !r.pending);
  const total = () => published().length;
  function renderOverview() {
    const P = published(), avg = P.reduce((a, r) => a + r.r, 0) / P.length;
    $("[data-avg]").textContent = avg.toFixed(1);
    $("[data-avg-stars]").innerHTML = `<span style="position:relative;display:inline-flex">${starsHTML(0, "lg").replace('class="stars lg"', 'class="stars lg" style="color:#E5E7EB"').replace(/ off/g, "")}<span style="position:absolute;inset:0;overflow:hidden;width:${(avg / 5) * 100}%;white-space:nowrap">${starsHTML(5, "lg")}</span></span>`;
    $("[data-avg-stars]").setAttribute("aria-label", `${avg.toFixed(1)} out of 5 stars`);
    $("[data-total-text]").textContent = `Based on ${fmtN(P.length)} reviews`;
    $("[data-rec]").textContent = `${Math.round((P.filter((r) => r.rec).length / P.length) * 100)}%`;
    $("[data-dist]").innerHTML = [5, 4, 3, 2, 1].map((s) => { const c = P.filter((r) => r.r === s).length, pct = Math.round((c / P.length) * 100); return `<button type="button" data-dstar="${s}" aria-pressed="${F.stars.has(s)}" aria-label="${s} star: ${fmtN(c)} reviews (${pct}%) — filter"><span class="lbl">${s} ${icon("i-star")}</span><span class="bar"><i style="width:${pct}%"></i></span><span class="n">${fmtN(c)} (${pct}%)</span></button>`; }).join("");
  }
  const CATR = [["Quality", 4.8], ["Value for Money", 4.5], ["Ease of Use", 4.6], ["Durability", 4.7], ["Shipping/Packaging", 4.4]];
  $("[data-catratings]").innerHTML = CATR.map(([l, v]) => `<li><span>${l}</span><b>${v}/5</b><span class="cbar" aria-hidden="true"><i style="width:${(v / 5) * 100}%"></i></span></li>`).join("");

  /* ---------- highlights (computed from text) ---------- */
  const MENTIONS = [["Quality", /\bquality\b/i], ["Fast shipping", /\b(fast|quick)\b.*shipping|shipping was quick|arrived two days/i], ["Great value", /\bvalue\b/i], ["Easy to use", /\beasy to\b/i], ["Waterproof", /waterproof|stayed (completely )?dry|feet stayed dry/i], ["Comfort", /comfort/i]];
  function renderHighlights() {
    const P = published();
    $("[data-mentions]").innerHTML = MENTIONS.map(([l, re], i) => `<button type="button" aria-pressed="${F.mention === i}" data-mention="${i}">${l} <small>(${fmtN(P.filter((r) => re.test(r.body)).length)} mentions)</small></button>`).join("");
    const cnt = (key) => { const m = new Map(); P.forEach((r) => r[key].forEach((x) => m.set(x, (m.get(x) || 0) + 1))); return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4); };
    $("[data-pros]").innerHTML = cnt("pros").map(([t, n]) => `<li>${icon("i-check")}${t} <small>${fmtN(n)} reviews</small></li>`).join("");
    $("[data-cons]").innerHTML = cnt("cons").map(([t, n]) => `<li>${icon("i-x")}${t} <small>${fmtN(n)} reviews</small></li>`).join("");
  }

  /* ---------- media gallery + lightbox ---------- */
  let MEDIA = [];
  function collectMedia() { MEDIA = []; REVIEWS.forEach((r) => r.media.forEach((m, k) => MEDIA.push({ r, m, k }))); }
  const mediaThumb = (it, label = true) => it.m.url ? (it.m.kind === "video" ? `<span class="vf" style="display:grid;place-items:center;width:100%;height:100%;background:#111827;color:#fff;font-size:11px">Video</span>` : `<img src="${it.m.url}" alt="${label ? "Customer photo" : ""}">`) : A.photo(it.m.scene, it.r.color, label ? `Customer ${it.m.kind} from ${it.r.name}` : "");
  function renderGallery() {
    collectMedia();
    const show = MEDIA.slice(0, 16);
    $("[data-gallery]").innerHTML = show.map((it, i) => `<li><button type="button" data-media="${i}" aria-label="Open ${it.m.kind} from ${esc(it.r.name)}'s ${it.r.r}-star review">${mediaThumb(it, false)}${it.m.kind === "video" ? `<span class="vid"><span>${icon("i-play")}</span></span>` : ""}${i === 15 && MEDIA.length > 16 ? `<span class="more-ph">+${MEDIA.length - 15}</span>` : ""}</button></li>`).join("");
    $("[data-all-photos]").textContent = `See all ${fmtN(MEDIA.length)} photos & videos`;
  }
  const lb = $("[data-lb]"); let lbi = 0, lbReturn = null;
  function showMedia(i) {
    lbi = (i + MEDIA.length) % MEDIA.length; const it = MEDIA[lbi];
    $("[data-lb-img]").innerHTML = mediaThumb(it) + (it.m.kind === "video" ? `<p class="cap">Video review preview (still frame) · ${esc(it.r.name)}</p>` : "");
    $("[data-lb-ctx]").innerHTML = `${starsHTML(it.r.r)} <b>${esc(it.r.title)}</b> · ${esc(it.r.name)}${it.r.verified ? " · Verified Purchase" : ""} · ${it.r.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}<p>${esc(it.r.body.slice(0, 180))}${it.r.body.length > 180 ? "…" : ""}</p><p><button class="link" style="color:#86EFAC" type="button" data-goto="${it.r.id}">Go to this review</button> · ${lbi + 1} of ${fmtN(MEDIA.length)}</p>`;
  }
  function openMedia(i) { lbReturn = document.activeElement; showMedia(i); if (!lb.open) lb.showModal(); $("[data-lb-close]").focus(); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-media]"); if (b) { if (dlg.open) dlg.close(); openMedia(Number(b.dataset.media)); return; }
    const t = e.target.closest("[data-rmedia]"); if (t) { const [id, k] = t.dataset.rmedia.split(":"); const i = MEDIA.findIndex((x) => x.r.id === id && x.k === Number(k)); openMedia(i); return; }
    const g = e.target.closest("[data-goto]"); if (g) { lb.close(); gotoReview(g.dataset.goto); }
  });
  $("[data-lb-close]").addEventListener("click", () => lb.close());
  $("[data-lb-prev]").addEventListener("click", () => showMedia(lbi - 1));
  $("[data-lb-next]").addEventListener("click", () => showMedia(lbi + 1));
  lb.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") showMedia(lbi - 1); if (e.key === "ArrowRight") showMedia(lbi + 1); });
  lb.addEventListener("close", () => { if (lbReturn && lbReturn.isConnected) lbReturn.focus(); });
  let tx = null; lb.addEventListener("touchstart", (e) => (tx = e.touches[0].clientX), { passive: true }); lb.addEventListener("touchend", (e) => { if (tx === null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) showMedia(lbi + (d < 0 ? 1 : -1)); tx = null; });
  $("[data-all-photos]").addEventListener("click", () => openDlg(`<h3>All customer photos &amp; videos (${fmtN(MEDIA.length)})</h3><div class="all-ph">${MEDIA.map((it, i) => `<button type="button" data-media="${i}" aria-label="Open ${it.m.kind} ${i + 1}">${mediaThumb(it, false)}</button>`).join("")}</div>`));

  /* ---------- votes / reports ---------- */
  const votes = store.get("nw-votes", {}), reported = new Set(store.get("nw-reported", []));
  const helpfulCount = (r) => r.helpful + (votes[r.id] === "y" ? 1 : 0), nothelpCount = (r) => r.nothelp + (votes[r.id] === "n" ? 1 : 0);

  /* ---------- review card ---------- */
  const fmtD = (d) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  function hiText(t) { const q = F.q.trim(); if (!q) return esc(t); const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"); return esc(t).replace(re, "<mark>$1</mark>"); }
  function card(r, featured = false) {
    const long = r.body.length > 280 && !featured;
    return `<li class="card${r.pending ? " pending" : ""}" id="review-${r.id}" data-rid="${r.id}">
      <div class="c-head"><span class="av" style="--c:${r.av}" aria-hidden="true">${r.name === "Anonymous" ? "?" : r.name.split(" ").map((x) => x[0]).join("")}</span><div class="c-who"><b>${esc(r.name)}${r.verified ? `<span class="ver">${icon("i-check-c")}Verified Purchase</span>` : ""}${r.pending ? '<span class="pend">Pending moderation · only you can see this</span>' : ""}</b><small>${fmtD(r.date)}</small></div></div>
      <div class="c-title"><span aria-label="${r.r} out of 5 stars" role="img">${starsHTML(r.r)}</span><h3>${hiText(r.title)}</h3></div>
      <p class="c-var">Size ${r.size} · ${r.color}${r.rec ? " · Recommends this product" : ""}</p>
      <p class="c-body${long ? " clamp" : ""}" data-body>${hiText(r.body)}</p>${long ? `<button class="more" type="button" data-more aria-expanded="false">Read more</button>` : ""}
      ${r.pros.length || r.cons.length ? `<div class="c-pc">${r.pros.map((p) => `<span class="p">${icon("i-check")}${esc(p)}</span>`).join("")}${r.cons.map((p) => `<span class="n">${icon("i-x")}${esc(p)}</span>`).join("")}</div>` : ""}
      ${r.media.length ? `<div class="thumbs">${r.media.map((m, k) => `<button type="button" data-rmedia="${r.id}:${k}" aria-label="Open ${m.kind} ${k + 1} from this review">${mediaThumb({ r, m, k }, false)}${m.kind === "video" ? `<span class="vid"><span>${icon("i-play")}</span></span>` : ""}</button>`).join("")}</div>` : ""}
      ${featured ? `<p class="helpful-n"><b>${fmtN(helpfulCount(r))}</b> people found this helpful</p>` : ""}
      <div class="c-act"><span class="q">Was this helpful?</span><button class="vote" type="button" aria-pressed="${votes[r.id] === "y"}" data-vote="${r.id}:y">${icon("i-thumb")}Yes (${fmtN(helpfulCount(r))})</button><button class="vote" type="button" aria-pressed="${votes[r.id] === "n"}" data-vote="${r.id}:n">${icon("i-thumbd")}No (${fmtN(nothelpCount(r))})</button>
        <span class="sp">${reported.has(r.id) ? `<span class="small-b">${icon("i-flag")}Reported</span>` : `<button class="small-b" type="button" data-report="${r.id}">${icon("i-flag")}Report</button>`}<button class="small-b" type="button" data-share="${r.id}">${icon("i-share")}Share</button></span></div>
      ${r.resp ? `<div class="resp"><div class="resp-h">${icon("i-store")}Response from Northwind Outfitters <span class="vs">Verified seller</span><small>${fmtD(r.resp.date)}</small></div><p>${esc(r.resp.text)}</p></div>` : ""}
    </li>`;
  }

  /* ---------- filters ---------- */
  const F = { stars: new Set(), verified: false, media: false, recent: "all", size: "", color: "", q: "", mention: -1, sort: "recent", page: 0 };
  const PER = 20;
  $("[data-starchecks]").innerHTML = [5, 4, 3, 2, 1].map((s) => `<label class="sc"><input type="checkbox" value="${s}" data-scheck>${starsHTML(s)}<span class="sr">${s} stars</span><small>${fmtN(COUNTS[s])}</small></label>`).join("");
  $("[data-size]").insertAdjacentHTML("beforeend", SIZES.map((s) => `<option>${s}</option>`).join(""));
  $("[data-color]").insertAdjacentHTML("beforeend", COLORS.map((c) => `<option>${c}</option>`).join(""));
  $("[data-qchips]").innerHTML = [5, 4, 3, 2, 1].map((s) => `<button type="button" aria-pressed="false" data-qstar="${s}">${s}${icon("i-star")}</button>`).join("") + `<button type="button" aria-pressed="false" data-qmedia>With photos</button><button type="button" aria-pressed="false" data-qver>Verified</button>`;
  function filtered() {
    const q = F.q.trim().toLowerCase(), cut = F.recent === "all" ? 0 : NOW - Number(F.recent) * DAY;
    let L = REVIEWS.filter((r) => (r.pending || ((!F.stars.size || F.stars.has(r.r)) && (!F.verified || r.verified) && (!F.media || r.media.length) && r.date.getTime() >= cut && (!F.size || r.size === F.size) && (!F.color || r.color === F.color) && (!q || `${r.title} ${r.body}`.toLowerCase().includes(q)) && (F.mention < 0 || MENTIONS[F.mention][1].test(r.body)))));
    const S = { recent: (a, b) => b.date - a.date, helpful: (a, b) => helpfulCount(b) - helpfulCount(a), high: (a, b) => b.r - a.r || b.date - a.date, low: (a, b) => a.r - b.r || b.date - a.date, media: (a, b) => (b.media.length > 0) - (a.media.length > 0) || b.date - a.date }[F.sort];
    return L.sort((a, b) => (b.pending ? 1 : 0) - (a.pending ? 1 : 0) || S(a, b));
  }
  function activeCount() { return F.stars.size + (F.verified ? 1 : 0) + (F.media ? 1 : 0) + (F.recent !== "all" ? 1 : 0) + (F.size ? 1 : 0) + (F.color ? 1 : 0) + (F.mention >= 0 ? 1 : 0) + (F.q.trim() ? 1 : 0); }
  function renderList(scroll = false) {
    const L = filtered(), pages = Math.max(1, Math.ceil(L.length / PER)); F.page = Math.min(F.page, pages - 1);
    const v = L.slice(F.page * PER, F.page * PER + PER);
    $("[data-cards]").innerHTML = v.length ? v.map((r) => card(r)).join("") : `<li class="empty">No reviews match these filters. <button class="link" type="button" data-clear>Clear all filters</button></li>`;
    $("[data-showing]").textContent = L.length ? `Showing ${fmtN(F.page * PER + 1)}–${fmtN(F.page * PER + v.length)} of ${fmtN(L.length)} reviews` : "Showing 0 reviews";
    $("[data-f-count]").textContent = fmtN(L.length);
    const n = activeCount(), fc = $("[data-fc]"); fc.hidden = !n; fc.textContent = n;
    // chips + sync controls
    $$("[data-scheck]").forEach((c) => (c.checked = F.stars.has(Number(c.value))));
    $$("[data-qstar]").forEach((b) => b.setAttribute("aria-pressed", F.stars.has(Number(b.dataset.qstar))));
    $("[data-qmedia]").setAttribute("aria-pressed", F.media); $("[data-qver]").setAttribute("aria-pressed", F.verified);
    $("[data-verified]").checked = F.verified; $("[data-fmedia]").checked = F.media;
    $$("[data-dstar]").forEach((b) => b.setAttribute("aria-pressed", F.stars.has(Number(b.dataset.dstar))));
    $$("[data-mention]").forEach((b) => b.setAttribute("aria-pressed", Number(b.dataset.mention) === F.mention));
    const act = [];
    [...F.stars].sort((a, b) => b - a).forEach((s) => act.push([`${s} stars`, () => F.stars.delete(s)]));
    if (F.verified) act.push(["Verified only", () => (F.verified = false)]);
    if (F.media) act.push(["With photos/videos", () => (F.media = false)]);
    if (F.recent !== "all") act.push([$("[data-recent]").selectedOptions[0].text, () => { F.recent = "all"; $("[data-recent]").value = "all"; }]);
    if (F.size) act.push([`Size ${F.size}`, () => { F.size = ""; $("[data-size]").value = ""; }]);
    if (F.color) act.push([F.color, () => { F.color = ""; $("[data-color]").value = ""; }]);
    if (F.mention >= 0) act.push([`Mentions: ${MENTIONS[F.mention][0]}`, () => (F.mention = -1)]);
    if (F.q.trim()) act.push([`“${F.q.trim()}”`, () => { F.q = ""; $("[data-q]").value = ""; }]);
    activeRemovers = act.map((a) => a[1]);
    $("[data-active]").innerHTML = act.map(([l], i) => `<button type="button" data-unf="${i}" aria-label="Remove filter ${esc(l)}">${esc(l)}${icon("i-close")}</button>`).join("");
    // pager
    const btn = (p, l = p + 1, extra = "") => `<button type="button" data-page="${p}"${p === F.page ? ' aria-current="page"' : ""}${extra}>${l}</button>`;
    let ph = `<button type="button" data-page="${F.page - 1}" aria-label="Previous page"${F.page === 0 ? " disabled" : ""}>‹</button>`;
    const set = new Set([0, pages - 1, F.page - 1, F.page, F.page + 1].filter((p) => p >= 0 && p < pages)); let last = -1;
    [...set].sort((a, b) => a - b).forEach((p) => { if (p - last > 1) ph += `<span class="gap">…</span>`; ph += btn(p); last = p; });
    ph += `<button type="button" data-page="${F.page + 1}" aria-label="Next page"${F.page >= pages - 1 ? " disabled" : ""}>›</button>`;
    if (pages > 1) ph += `<label class="jump">Jump to page<input type="number" min="1" max="${pages}" value="${F.page + 1}" data-jump aria-label="Page number"></label>`;
    $("[data-pager]").innerHTML = ph;
    if (scroll) $("#reviews").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  let activeRemovers = [];
  const refresh = (scroll = false) => { F.page = 0; renderList(scroll); };
  $("[data-dist]").addEventListener("click", (e) => { const b = e.target.closest("[data-dstar]"); if (!b) return; const s = Number(b.dataset.dstar); F.stars.has(s) ? F.stars.delete(s) : F.stars.add(s); refresh(true); });
  $("[data-starchecks]").addEventListener("change", (e) => { const s = Number(e.target.value); e.target.checked ? F.stars.add(s) : F.stars.delete(s); refresh(); });
  $("[data-qchips]").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.qstar) { const s = Number(b.dataset.qstar); F.stars.has(s) ? F.stars.delete(s) : F.stars.add(s); }
    else if (b.hasAttribute("data-qmedia")) F.media = !F.media; else if (b.hasAttribute("data-qver")) F.verified = !F.verified;
    refresh();
  });
  $("[data-verified]").addEventListener("change", (e) => { F.verified = e.target.checked; refresh(); });
  $("[data-fmedia]").addEventListener("change", (e) => { F.media = e.target.checked; refresh(); });
  $("[data-recent]").addEventListener("change", (e) => { F.recent = e.target.value; refresh(); });
  $("[data-size]").addEventListener("change", (e) => { F.size = e.target.value; refresh(); });
  $("[data-color]").addEventListener("change", (e) => { F.color = e.target.value; refresh(); });
  $("[data-sort]").addEventListener("change", (e) => { F.sort = e.target.value; refresh(); });
  let qt; $("[data-q]").addEventListener("input", (e) => { clearTimeout(qt); qt = setTimeout(() => { F.q = e.target.value; refresh(); }, 150); });
  $("[data-mentions]").addEventListener("click", (e) => { const b = e.target.closest("[data-mention]"); if (!b) return; const i = Number(b.dataset.mention); F.mention = F.mention === i ? -1 : i; refresh(true); });
  document.addEventListener("click", (e) => {
    const c = e.target.closest("[data-clear]"); if (c) { Object.assign(F, { stars: new Set(), verified: false, media: false, recent: "all", size: "", color: "", q: "", mention: -1 }); $("[data-q]").value = ""; ["[data-recent]", "[data-size]", "[data-color]"].forEach((s) => ($(s).value = s === "[data-recent]" ? "all" : "")); refresh(); return; }
    const u = e.target.closest("[data-unf]"); if (u) { activeRemovers[Number(u.dataset.unf)](); refresh(); }
  });
  $("[data-pager]").addEventListener("click", (e) => { const b = e.target.closest("[data-page]"); if (!b || b.disabled) return; F.page = Number(b.dataset.page); renderList(true); });
  $("[data-pager]").addEventListener("change", (e) => { if (!e.target.matches("[data-jump]")) return; const p = Math.max(1, Math.min(Number(e.target.max), Number(e.target.value) || 1)); F.page = p - 1; renderList(true); });

  /* ---------- card actions ---------- */
  document.addEventListener("click", (e) => {
    const m = e.target.closest("[data-more]"); if (m) { const b = m.previousElementSibling; const open = b.classList.toggle("clamp") === false; m.textContent = open ? "Show less" : "Read more"; m.setAttribute("aria-expanded", open); return; }
    const v = e.target.closest("[data-vote]");
    if (v) { const [id, k] = v.dataset.vote.split(":"); votes[id] = votes[id] === k ? undefined : k; if (!votes[id]) delete votes[id]; store.set("nw-votes", votes); rerenderCard(id); toast(votes[id] ? "Thanks for your feedback!" : "Vote removed"); return; }
    const rp = e.target.closest("[data-report]");
    if (rp) {
      const id = rp.dataset.report;
      openDlg(`<h3>Report this review</h3><p>Why should our moderators look at it?</p>${["Contains offensive language", "Not about this product", "Spam or advertising", "Contains personal information", "Something else"].map((t, i) => `<label class="r"><input type="radio" name="why" value="${i}"> ${t}</label>`).join("")}<p class="err" data-rerr role="alert"></p><button class="btn" type="button" data-rsend>Submit report</button>`);
      $("[data-rsend]", body).addEventListener("click", () => { if (!$("input:checked", body)) { $("[data-rerr]", body).textContent = "Choose a reason."; return; } reported.add(id); store.set("nw-reported", [...reported]); dlg.close(); rerenderCard(id); toast("Thanks — our moderators will review it within 24 hours."); });
      return;
    }
    const sh = e.target.closest("[data-share]");
    if (sh) { const url = `${location.origin}${location.pathname}#review-${sh.dataset.share}`; const ok = () => toast("Link to this review copied"); try { navigator.clipboard.writeText(url).then(ok, () => openDlg(`<h3>Share review</h3><input readonly value="${esc(url)}" aria-label="Review link">`)); } catch { openDlg(`<h3>Share review</h3><input readonly value="${esc(url)}" aria-label="Review link">`); } }
  });
  function rerenderCard(id) { const r = REVIEWS.find((x) => x.id === id); $$(`[data-rid="${id}"]`).forEach((el) => { const feat = !!el.closest("[data-featured]"); const html = card(r, feat); const tmp = document.createElement("div"); tmp.innerHTML = feat ? html.replace("<li", "<article").replace(/<\/li>\s*$/, "</article>") : html; el.replaceWith(tmp.firstElementChild); }); }
  function gotoReview(id) {
    const L = filtered(); let i = L.findIndex((r) => r.id === id);
    if (i < 0) { $("[data-clear]").click(); i = filtered().findIndex((r) => r.id === id); }
    F.page = Math.floor(i / PER); renderList();
    const el = $(`#review-${id}`); if (el) { el.scrollIntoView({ block: "center" }); el.style.outline = "3px solid #F59E0B"; setTimeout(() => (el.style.outline = ""), 2000); }
  }

  /* ---------- mobile filter drawer ---------- */
  const panel = $("[data-filters]"), scrim = $("[data-scrim]"); let fReturn = null;
  const openF = () => { fReturn = document.activeElement; panel.classList.add("open"); scrim.hidden = false; $$("[data-f-open]").forEach((b) => b.setAttribute("aria-expanded", "true")); $(".f-close").focus(); };
  const closeF = () => { if (!panel.classList.contains("open")) return; panel.classList.remove("open"); scrim.hidden = true; $$("[data-f-open]").forEach((b) => b.setAttribute("aria-expanded", "false")); if (fReturn && fReturn.isConnected) fReturn.focus(); };
  $$("[data-f-open]").forEach((b) => b.addEventListener("click", openF));
  $$("[data-f-close]").forEach((b) => b.addEventListener("click", closeF));
  scrim.addEventListener("click", closeF);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeF(); });

  /* ---------- write a review ---------- */
  let wRating = 0, verifiedBuyer = false, files = [];
  const RL = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  $("[data-rate]").innerHTML = [1, 2, 3, 4, 5].map((s) => `<button type="button" aria-label="${s} star${s > 1 ? "s" : ""} — ${RL[s]}" aria-pressed="false" data-rs="${s}">${icon("i-star")}</button>`).join("");
  const syncRate = (h = wRating) => $$("[data-rs]").forEach((b) => { b.classList.toggle("on", Number(b.dataset.rs) <= h); b.setAttribute("aria-pressed", Number(b.dataset.rs) === wRating); });
  $("[data-rate]").addEventListener("click", (e) => { const b = e.target.closest("[data-rs]"); if (!b) return; wRating = Number(b.dataset.rs); syncRate(); $("[data-rate-l]").textContent = `${wRating} — ${RL[wRating]}`; });
  $("[data-rate]").addEventListener("mouseover", (e) => { const b = e.target.closest("[data-rs]"); if (b) syncRate(Number(b.dataset.rs)); });
  $("[data-rate]").addEventListener("mouseleave", () => syncRate());
  $("[data-wsize]").innerHTML = SIZES.map((s) => `<option${s === "10" ? " selected" : ""}>${s}</option>`).join("");
  $("[data-wcolor]").innerHTML = COLORS.map((c) => `<option>${c}</option>`).join("");
  $("[data-wbody]").addEventListener("input", (e) => { const n = e.target.value.trim().length, c = $("[data-wcount]"); c.textContent = n >= 50 ? `${n} characters` : `${n} / 50 minimum`; c.classList.toggle("ok", n >= 50); });
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => { $$("[data-mode]").forEach((x) => x.setAttribute("aria-checked", x === b)); $("[data-verify-box]").hidden = b.dataset.mode !== "verify"; }));
  $("[data-v-go]").addEventListener("click", () => {
    const em = $("[data-v-email]").value.trim(), od = $("[data-v-order]").value.trim().toUpperCase(), m = $("[data-v-msg]");
    if (!/^\S+@\S+\.\S+$/.test(em)) { m.className = "v-msg bad"; m.textContent = "Enter the email you ordered with."; return; }
    if (od !== "NW-48213") { m.className = "v-msg bad"; m.textContent = "We couldn't find that order. (Demo: use order NW-48213.)"; return; }
    verifiedBuyer = true; m.className = "v-msg ok"; m.textContent = "Order verified — your review will show the Verified Purchase badge.";
  });
  $("[data-files]").addEventListener("change", (e) => {
    files = [...e.target.files].slice(0, 4).map((f) => ({ kind: f.type.startsWith("video") ? "video" : "photo", url: URL.createObjectURL(f), name: f.name }));
    $("[data-previews]").innerHTML = files.map((f) => f.kind === "photo" ? `<img src="${f.url}" alt="Selected photo ${esc(f.name)}">` : `<span class="vf">${esc(f.name)}</span>`).join("");
    if (e.target.files.length > 4) toast("Only the first 4 files were added.");
  });
  $("[data-wform]").addEventListener("submit", (e) => {
    e.preventDefault(); const f = e.target, errs = [];
    if (!wRating) errs.push("a star rating");
    if (!f.title.value.trim()) errs.push("a title");
    if (f.body.value.trim().length < 50) errs.push("a review of at least 50 characters");
    if (!f.rec.value) errs.push("whether you'd recommend it");
    if (errs.length) { $("[data-werr]").textContent = `Please add ${errs.join(", ")}.`; return; }
    $("[data-werr]").textContent = "";
    const r = { id: `new${Date.now()}`, r: wRating, title: f.title.value.trim(), body: f.body.value.trim(), name: f.name.value.trim() || "Anonymous", av: "#14532D", verified: verifiedBuyer, size: f.size.value, color: f.color.value, date: new Date(), media: files.map((x) => ({ ...x })), rec: f.rec.value === "yes", helpful: 0, nothelp: 0, pros: f.pros.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4), cons: f.cons.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4), resp: null, pending: true };
    REVIEWS.unshift(r); renderGallery();
    f.reset(); wRating = 0; syncRate(); $("[data-rate-l]").textContent = "Select a rating"; $("[data-previews]").innerHTML = ""; files = []; $("[data-wcount]").textContent = "0 / 50 minimum";
    $("[data-clear]").click(); gotoReview(r.id);
    toast("Thanks! Your review is pending moderation and will be published within 48 hours (demo).");
  });
  $("[data-write]").addEventListener("click", () => { $("#write").scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("[data-rs]").focus(), 400); });

  /* ---------- guidelines: one open; related ---------- */
  const REL = [["Trailblazer Merino Hiking Socks (3-pack)", 24, 4.8, 2114, "sock", "#166534"], ["Ridgeline 28L Daypack", 89, 4.7, 986, "pack", "#B45309"], ["Summit Carbon Trekking Poles", 119, 4.6, 742, "pole", "#475569"], ["Pathfinder Trail Runner", 129, 4.5, 1530, "shoe", "#1D4ED8"]];
  $("[data-related]").innerHTML = REL.map(([n, p, r, c, k, col]) => `<article class="rp"><div class="img">${A.RELATED[k](col)}</div><h3>${n}</h3><p>${starsHTML(Math.round(r))}<b>${r}</b> (${fmtN(c)})</p><p><b>$${p}</b></p><a class="btn-o" href="#top" data-soon="${esc(n)} reviews">See reviews</a></article>`).join("");
  $("[data-product-img]").innerHTML = A.product("Timber Brown", "Trailblazer Waterproof Hiking Boot in Timber Brown");

  /* ---------- dialog + toast + misc ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; if (!dlg.open) dlg.showModal(); const f = $("input, .btn", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); }
  document.addEventListener("click", (e) => { const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); toast(`${s.dataset.soon} isn't part of this demo page.`); } });

  const renderFeatured = () => { $("[data-featured]").innerHTML = REVIEWS.filter((r) => r.featured).sort((a, b) => b.helpful - a.helpful).map((r) => card(r, true).replace("<li", "<article").replace(/<\/li>\s*$/, "</article>")).join(""); };
  renderFeatured(); renderOverview(); renderHighlights(); renderGallery(); renderList();
  const h = location.hash.match(/^#review-(r\d+)$/); if (h) gotoReview(h[1]);
})();
