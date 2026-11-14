(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3200); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  // Menu
  const burger = $("#burger"), links = $("#links");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  });
  links.addEventListener("click", (e) => { if (e.target.closest("a") && links.classList.contains("open")) burger.click(); });

  // Calculator. Mid-range 7-day base price per person for a group of 12.
  const base = { Bali: 1240, "Costa Rica": 1450, Iceland: 2380, Japan: 2650, Morocco: 1320, Portugal: 1290, Thailand: 1080, Peru: 1560 };
  const tierMult = { budget: 0.78, mid: 1, premium: 1.45 };
  const size = $("#size");
  function days() {
    const v = $("input[name=len]:checked").value;
    if (v !== "custom") return Number(v);
    const d = Math.round(Number($("#customDays").value));
    return Math.min(21, Math.max(3, Number.isFinite(d) ? d : 7));
  }
  function calc() {
    const n = Number(size.value), d = days();
    const groupFactor = 1 - Math.min(0.12, Math.max(-0.06, (n - 12) * 0.003)); // larger groups get better rates
    const pp = Math.round((base[$("#dest").value] * (d / 7) * tierMult[$("input[name=tier]:checked").value] * groupFactor) / 10) * 10;
    const total = pp * n;
    const rate = 0.15 + 0.1 * Math.min(1, Math.max(0, (n - 6) / 6)) + 0.05 * Math.min(1, Math.max(0, (n - 12) / 38));
    $("#sizeOut").textContent = `${n} people`;
    $("#pp").textContent = usd(pp);
    $("#total").innerHTML = `${usd(total)} <small>(${n} people)</small>`;
    $("#save").innerHTML = `${icon("check")}You save ${usd(total * rate)} vs booking individually`;
    $("#sizeMinus").disabled = n <= 6;
    $("#sizePlus").disabled = n >= 50;
    const pct = ((n - 6) / 44) * 100;
    size.style.background = `linear-gradient(90deg, var(--orange) ${pct}%, #F3D9C2 ${pct}%)`;
    return { n, d, pp, total };
  }
  size.addEventListener("input", calc);
  $("#sizeMinus").addEventListener("click", () => { size.value = Number(size.value) - 1; calc(); });
  $("#sizePlus").addEventListener("click", () => { size.value = Number(size.value) + 1; calc(); });
  $("#dest").addEventListener("change", calc);
  $$("input[name=len]").forEach((r) => r.addEventListener("change", () => { $("#customWrap").hidden = r.value !== "custom" || !r.checked; calc(); }));
  $$("input[name=tier]").forEach((r) => r.addEventListener("change", calc));
  $("#customDays").addEventListener("input", calc);
  $("#detailQuote").addEventListener("click", () => {
    const r = calc();
    $("#qDest").value = $("#dest").value;
    $("#qSize").selectedIndex = r.n <= 10 ? 1 : r.n <= 20 ? 2 : r.n <= 35 ? 3 : 4;
  });
  calc();

  // Packages
  const pkgs = [
    ["Bali Bliss", 7, "Ubud, Seminyak, Nusa Penida", 1100, "8-20", "terraces", ["Beach", "Culture"], ["beach", "cultural"], 4.9, 342],
    ["Iceland Ring Road", 10, "Full island circuit", 2400, "6-15", "aurora", ["Adventure"], ["adventure"], 4.8, 187],
    ["Costa Rica Adventure", 7, "Arenal, Monteverde, Manuel Antonio", 1350, "8-25", "zipline", ["Adventure", "Nature"], ["adventure", "corporate"], 4.9, 256],
    ["Morocco Explorer", 9, "Marrakech, Sahara, Fes, Chefchaouen", 1500, "8-20", "desert", ["Cultural"], ["cultural"], 4.7, 198],
    ["Portugal Coast", 7, "Lisbon, Sintra, Algarve, Porto", 1200, "6-18", "cliff", ["Beach", "Culture"], ["beach", "cultural", "corporate"], 4.8, 221],
    ["Japan Highlights", 10, "Tokyo, Kyoto, Osaka, Hakone", 2800, "6-16", "torii", ["Cultural"], ["cultural"], 4.9, 164],
  ];
  $("#pkgs").innerHTML = pkgs.map(([name, d, route, price, grp, scene, tags, cats, rating, reviews]) => `
    <article class="pkg" data-cat="${cats.join(" ")}">
      <div class="pkg-img"><div data-scene="${scene}" role="img" aria-label="${name} illustration"></div><span class="pkg-days">${icon("clock")}${d} days</span><span class="pkg-tags">${tags.map((t) => `<span>${t}</span>`).join("")}</span></div>
      <div class="pkg-body">
        <p class="pkg-route">${icon("pin")}${route}</p>
        <h3>${name}</h3>
        <div class="pkg-meta"><span>${icon("users")}Group: ${grp}</span><span class="rt">${icon("star")}${rating} <small>(${reviews} reviews)</small></span></div>
        <div class="pkg-foot"><p class="pkg-price">From <strong>${usd(price)}<small style="font:400 13px var(--sans);color:var(--muted)">/person</small></strong></p><button class="btn btn-orange" type="button" data-pkg="${name}">View Trip</button></div>
      </div></article>`).join("");
  window.__renderScenes($("#pkgs"));
  $("#pkgs").addEventListener("click", (e) => { const b = e.target.closest("[data-pkg]"); if (b) toast(`${b.dataset.pkg}: full itinerary opens here (demo).`); });
  $$(".tab").forEach((t) => t.addEventListener("click", () => {
    $$(".tab").forEach((x) => { x.classList.toggle("on", x === t); x.setAttribute("aria-pressed", x === t); });
    let n = 0;
    $$(".pkg").forEach((p) => { const ok = t.dataset.f === "all" || p.dataset.cat.split(" ").includes(t.dataset.f); p.hidden = !ok; if (ok) n++; });
    $("#pkgEmpty").hidden = n > 0;
    $("#pkgs").scrollLeft = 0;
  }));

  // Planning dashboard: live voting
  const options = [["Canopy zipline", 6], ["Waterfall rappelling", 4], ["Coffee farm tour", 2]];
  let myVote = -1;
  function renderVotes() {
    const total = options.reduce((s, o, i) => s + o[1] + (i === myVote ? 1 : 0), 0);
    $("#votes").innerHTML = options.map(([n, v], i) => { const c = v + (i === myVote ? 1 : 0); return `<button type="button" class="vote" aria-pressed="${i === myVote}" data-i="${i}"><i style="width:${(c / total) * 100}%"></i><span><b>${n}</b>${c}</span></button>`; }).join("");
    $("#voteNote").textContent = myVote < 0 ? "Tap to cast your vote" : `You voted · ${total} of 14 voted`;
  }
  $("#votes").addEventListener("click", (e) => { const b = e.target.closest(".vote"); if (!b) return; const i = Number(b.dataset.i); myVote = myVote === i ? -1 : i; renderVotes(); });
  renderVotes();

  // Split payment tracker
  const people = [["Ana", "#E85D04", 1], ["Ben", "#059669", 1], ["Chloe", "#7C3AED", 1], ["Dev", "#0EA5E9", 0], ["Ella", "#DB2777", 1], ["Femi", "#CA8A04", 0], ["Gus", "#475569", 1], ["Hana", "#DC2626", 0]];
  const share = 12000 / people.length;
  function renderPay() {
    const inst = $("input[name=plan]:checked").value === "3";
    const paid = people.filter((p) => p[2]).length;
    $("#people").innerHTML = people.map(([n, c, p], i) => `<li><button type="button" class="person${p ? " paid" : ""}" data-i="${i}" aria-pressed="${!!p}" aria-label="${n}: ${p ? "paid" : "pending"}"><span class="av" style="--c:${c}">${n[0]}<b>${icon("check")}</b></span><span class="pn">${n}</span><span class="pa">${p ? "Paid" : inst ? usd(share / 3) + "×3" : usd(share)}</span></button></li>`).join("");
    $("#payBar").style.width = `${(paid / people.length) * 100}%`;
    $("#paidAmt").textContent = usd(paid * share);
    $("#paidCnt").textContent = `${paid} of ${people.length} paid`;
  }
  $("#people").addEventListener("click", (e) => { const b = e.target.closest(".person"); if (!b) return; const p = people[b.dataset.i]; p[2] = p[2] ? 0 : 1; renderPay(); if (p[2]) toast(`${p[0]} paid their ${usd(share)} share (demo).`); });
  $$("input[name=plan]").forEach((r) => r.addEventListener("change", renderPay));
  renderPay();

  // Testimonials carousel
  const track = $("#tTrack"), cards = $$(".tcard", track), dots = $("#tDots");
  dots.innerHTML = cards.map((_, i) => `<button type="button" aria-label="Show testimonial ${i + 1}" data-i="${i}"></button>`).join("");
  const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 24);
  const go = (i) => track.scrollTo({ left: i * step(), behavior: reduced ? "auto" : "smooth" });
  const idx = () => Math.round(track.scrollLeft / step());
  function syncT() {
    const i = idx(), max = track.scrollWidth - track.clientWidth;
    $$("button", dots).forEach((b, j) => b.setAttribute("aria-current", i === j));
    $("#tPrev").disabled = track.scrollLeft <= 2;
    $("#tNext").disabled = track.scrollLeft >= max - 2;
  }
  dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go(Number(b.dataset.i)); });
  $("#tPrev").addEventListener("click", () => go(idx() - 1));
  $("#tNext").addEventListener("click", () => go(idx() + 1));
  track.addEventListener("scroll", () => requestAnimationFrame(syncT), { passive: true });
  window.addEventListener("resize", syncT);
  syncT();

  // FAQ: one open at a time
  $$("#faqList details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) $$("#faqList details").forEach((o) => { if (o !== d) o.open = false; }); }));

  // Quote form
  $("#qform").addEventListener("submit", (e) => {
    e.preventDefault();
    const m = $("#qMsg"), dest = $("#qDest").value.trim(), sz = $("#qSize").value, em = $("#qEmail").value.trim();
    if (!dest) m.textContent = "Tell us where you'd like to go.";
    else if (!sz) m.textContent = "Choose your group size.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) m.textContent = "Enter a valid email so we can send your quote.";
    else { m.textContent = `Thanks! A specialist will email a free ${dest} quote for ${sz} within 24 hours (demo — nothing was sent).`; e.target.reset(); }
  });
})();
