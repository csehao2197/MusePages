(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="ic"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toastEl = $("#toast");
  let tt;
  const toast = (m) => { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 3000); };
  document.addEventListener("click", (e) => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

  const authors = {
    "Elena Vasquez": ["#D6A77A", "#3F2A1D", "#0F766E"], "Marcus Chen": ["#E8C39E", "#111827", "#334155"],
    "Priya Sharma": ["#B9825A", "#1C1917", "#B45309"], "Diego Morales": ["#C68A5E", "#292524", "#4D7C0F"], "Sophie Laurent": ["#F1D2B6", "#A16207", "#7C3AED"],
  };
  const portrait = (n) => window.__portrait(...authors[n], `Portrait of ${n}`);
  $$("[data-author]").forEach((el) => (el.innerHTML = portrait(el.dataset.author)));

  const cats = [["All", null], ["Destinations", 42], ["Adventure", 28], ["Culture", 19], ["Food & Drink", 24], ["Budget Travel", 16], ["Travel Tips", 31]];
  const posts = [
    ["The Complete Japan Rail Pass Guide for 2026", "shinkansen", "Travel Tips", "Everything you need to know about the JR Pass — routes, pricing, where to buy, and the 7 mistakes first-timers make.", "Marcus Chen", "2026-02-28", 8, 9.4],
    ["Street Food Markets of Bangkok: A Neighborhood-by-Neighborhood Guide", "market", "Food & Drink", "From Chinatown's legendary Yaowarat Road to the hidden alley stalls of Ari — where locals actually eat.", "Priya Sharma", "2026-02-25", 10, 12, "", true],
    ["Backpacking Patagonia on $50 a Day", "patagonia", "Budget Travel", "Yes, it's possible. Here's exactly how we spent 3 weeks in one of the world's most expensive hiking destinations — without breaking the bank.", "Diego Morales", "2026-02-22", 14, 15, "pick"],
    ["Learning to Surf in Sri Lanka: A Beginner's Honest Diary", "surf", "Adventure", "Day 1: swallowed half the Indian Ocean. Day 7: stood up for 3 glorious seconds. Day 14: hooked for life.", "Elena Vasquez", "2026-02-18", 9, 7.8],
    ["The Ceramics Villages of Portugal Nobody Talks About", "azulejo", "Culture", "In Alcobaça, São Pedro do Corval, and Bordallo Pinheiro's hometown, centuries-old pottery traditions are alive and thriving.", "Sophie Laurent", "2026-02-15", 7, 6.1],
    ["How to Fly Business Class for Economy Prices", "business", "Travel Tips", "Award flights, positioning fares, mistake fares, and the 5 credit cards that actually deliver. No clickbait — real strategies we've used.", "Marcus Chen", "2026-02-12", 11, 24, "pop"],
    ["48 Hours in Marrakech: Medina, Mountains & Mint Tea", "majorelle", "Destinations", "A whirlwind weekend itinerary covering the souk, Atlas Mountains day trip, and the best riad rooftop dinners.", "Priya Sharma", "2026-02-08", 8, 8.6, "", true],
    ["Oaxaca's Mezcal Trail: Farm to Glass", "agave", "Food & Drink", "We visited 5 family palenques and tasted mezcal made from wild agave species you'll never find in a bar.", "Diego Morales", "2026-02-05", 6, 5.2],
    ["Solo Female Travel in Jordan: What I Wish I'd Known", "petra", "Adventure", "From Amman's street art scene to floating in the Dead Sea — safety tips, packing advice, and the moments that made it unforgettable.", "Elena Vasquez", "2026-02-01", 13, 11],
    // Older archive stories revealed by "Load More"
    ["Lisbon's Hidden Miradores: 8 Viewpoints the Guidebooks Miss", "alfama", "Destinations", "Skip the queue at Senhora do Monte — these quieter viewpoints have the same sunset and a cold ginjinha.", "Elena Vasquez", "2026-01-28", 7, 6.8],
    ["Porto Wine Tasting: A Route Through the Douro Valley", "douro", "Food & Drink", "Three quintas, one river cruise and the train ride that might be Europe's prettiest.", "Sophie Laurent", "2026-01-24", 9, 5.6],
    ["Algarve Coast on a Budget: Camping, Hiking & Beach Life", "algarve", "Budget Travel", "Seven nights along the Rota Vicentina for less than one night in a Lagos resort.", "Diego Morales", "2026-01-20", 10, 4.9],
    ["Kyoto in the Rain: A Love Letter", "shinkansen", "Culture", "Moss gardens glow, temples empty out, and the tea tastes better. Why we now pray for drizzle.", "Marcus Chen", "2026-01-16", 6, 7.1],
    ["The Ultimate Carry-On Packing List", "business", "Travel Tips", "Two weeks, one bag, zero regrets — the exact list we reuse for every trip.", "Priya Sharma", "2026-01-12", 5, 9.9],
    ["Hiking the Atlas: Berber Villages and Snowy Passes", "majorelle", "Adventure", "Three days on foot from Imlil with a muleteer named Hassan and a lot of mint tea.", "Diego Morales", "2026-01-08", 12, 4.4],
    ["Santorini's Volcanic Wineries", "hero", "Destinations", "Assyrtiko grown in woven basket vines — and the families who keep the tradition alive.", "Elena Vasquez", "2026-01-04", 8, 6.3],
    ["Night Trains of Europe, Ranked", "shinkansen", "Travel Tips", "From Vienna to Venice by sleeper: which cabins are worth it and which to skip.", "Marcus Chen", "2025-12-30", 9, 8.2],
    ["Bangkok on $30 a Day", "market", "Budget Travel", "Boat buses, 40-baht noodles and the free temples that rival the famous ones.", "Priya Sharma", "2025-12-26", 7, 5.5],
  ].map(([title, scene, cat, ex, author, date, mins, reads, flag, tall], i) => ({ id: i, title, scene, cat, ex, author, date, mins, reads, flag, tall }));
  const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  let cat = "All", order = "recent", loaded = 9;
  const saved = new Set();
  $("#catRow").innerHTML = cats.map(([n, c]) => `<button type="button" class="cat" data-cat="${n}" aria-pressed="${n === "All"}">${esc(n)}${c ? ` <small>(${c})</small>` : ""}</button>`).join("");
  $("#ovList").innerHTML = cats.slice(1).map(([n, c]) => `<a href="#stories" data-cat="${n}">${esc(n)}<span class="cnt">${c}</span></a>`).join("");

  function card(p) {
    return `<article class="post${p.tall ? " tall" : ""}">
      <div class="cover"><div data-scene="${p.scene}"></div>${p.flag === "pick" ? '<span class="flag pick">Editor\'s Pick</span>' : p.flag === "pop" ? '<span class="flag pop">Popular</span>' : ""}
        <button type="button" class="bm" data-id="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="Bookmark ${esc(p.title)}">${icon("bookmark")}</button></div>
      <div class="post-b"><span class="pill">${esc(p.cat)}</span>
        <h3><a href="#stories" data-read="${esc(p.title)}">${esc(p.title)}</a></h3>
        <p class="ex">${esc(p.ex)}</p>
        <p class="meta"><span class="av">${portrait(p.author)}</span><strong>${p.author}</strong> · ${fmtDate(p.date)} · ${p.mins} min read</p></div></article>`;
  }
  function render() {
    let list = posts.slice(0, loaded).filter((p) => cat === "All" || p.cat === cat);
    list = [...list].sort(order === "popular" ? (a, b) => b.reads - a.reads : (a, b) => b.date.localeCompare(a.date));
    $("#posts").innerHTML = list.map(card).join("");
    window.__renderScenes($("#posts"));
    $("#empty").hidden = list.length > 0;
    const total = cats.find((c) => c[0] === cat)[1];
    $("#filterNote").hidden = cat === "All";
    $("#filterNote").textContent = cat === "All" ? "" : `Showing ${list.length} of ${total} ${cat} stories`;
    const all = loaded >= posts.length;
    $("#loadMore").hidden = all;
    $("#moreNote").textContent = all ? "You've reached the end of this demo archive." : "";
    $("#latestTitle").textContent = cat === "All" ? (order === "popular" ? "Most Popular Stories" : "Latest Stories") : cat;
  }
  function setCat(c, scroll) {
    cat = c;
    $$(".cat").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === c));
    render();
    const active = $(`.cat[data-cat="${CSS.escape(c)}"]`);
    if (active) active.scrollIntoView({ inline: "center", block: "nearest" });
    if (scroll) $("#stories").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  $("#catRow").addEventListener("click", (e) => { const b = e.target.closest(".cat"); if (b) setCat(b.dataset.cat, false); });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-cat]:not(.cat), [data-cat-link]");
    if (a) { e.preventDefault(); closeOverlay(); setCat(a.dataset.cat || a.dataset.catLink, true); }
  });
  $$("input[name=order]").forEach((r) => r.addEventListener("change", () => { order = r.value; render(); }));
  $("#loadMore").addEventListener("click", () => {
    const btn = $("#loadMore");
    btn.disabled = true; btn.textContent = "Loading…";
    setTimeout(() => { loaded = Math.min(posts.length, loaded + 9); btn.disabled = false; btn.textContent = "Load More Stories"; render(); }, 400);
  });
  $("#posts").addEventListener("click", (e) => {
    const b = e.target.closest(".bm");
    if (b) { const id = +b.dataset.id; saved.has(id) ? saved.delete(id) : saved.add(id); b.setAttribute("aria-pressed", saved.has(id)); toast(saved.has(id) ? `Saved to your reading list (${saved.size})` : "Removed from your reading list"); }
  });
  document.addEventListener("click", (e) => { const r = e.target.closest("[data-read]"); if (r) { e.preventDefault(); toast(`“${r.dataset.read}” — full articles aren't part of this demo.`); } });
  render();

  // Trending
  const trend = [["How to Fly Business Class for Economy Prices", "Marcus Chen", "24K"], ["48 Hours in Santorini: Beyond the Instagram Spots", "Elena Vasquez", "18K"], ["Backpacking Patagonia on $50 a Day", "Diego Morales", "15K"], ["Street Food Markets of Bangkok", "Priya Sharma", "12K"], ["Solo Female Travel in Jordan", "Elena Vasquez", "11K"]];
  $("#trend").innerHTML = trend.map(([t, a, r], i) => `<li><a href="#stories" data-read="${esc(t)}"><span class="rank">${i + 1}</span><span><strong>${esc(t)}</strong><small>${a} · ${icon("eye")}${r} reads</small></span></a></li>`).join("");

  // Writers
  const writers = [
    ["Elena Vasquez", "Senior Writer · 89 articles", "Former architect turned full-time nomad. Currently based in Lisbon. Specializes in Mediterranean & Latin America."],
    ["Marcus Chen", "Travel Hacker · 64 articles", "Points & miles obsessive. Flies 100K+ miles a year on airline rewards. Based in Singapore."],
    ["Priya Sharma", "Food & Culture Editor · 52 articles", "Culinary school graduate who traded the kitchen for the road. If it's fermented, she's tried it."],
    ["Diego Morales", "Adventure & Budget Editor · 41 articles", "Former Peace Corps volunteer. Believes the best travel costs the least. Based nowhere specific."],
  ];
  $("#writers").innerHTML = writers.map(([n, r, b]) => `<article class="writer"><span class="w-av">${portrait(n)}</span><h3>${n}</h3><p class="role">${r}</p><p>${b}</p><button type="button" class="w-link" data-writer="${n}">View All Posts ${icon("arrow")}</button></article>`).join("");
  $("#writers").addEventListener("click", (e) => {
    const b = e.target.closest("[data-writer]");
    if (!b) return;
    const n = b.dataset.writer, count = posts.filter((p) => p.author === n).length;
    openSearch(n.split(" ")[0]);
    toast(`${count} stories by ${n} in this demo`);
  });

  // Instagram grid
  const ig = [["shinkansen", "Kyoto, Japan"], ["majorelle", "Marrakech, Morocco"], ["surf", "Arugam Bay, Sri Lanka"], ["patagonia", "Torres del Paine, Chile"], ["alfama", "Lisbon, Portugal"], ["petra", "Petra, Jordan"]];
  $("#ig").innerHTML = ig.map(([s, l]) => `<a class="ig-item" href="#top" data-toast="Instagram is not connected in this demo." aria-label="Photo from ${l}"><div data-scene="${s}"></div><span class="ig-loc">${icon("pin")}${l}</span></a>`).join("");
  window.__renderScenes($("#ig"));

  // Mobile overlay
  const overlay = $("#overlay"), burger = $("#burger");
  function openOverlay() { overlay.hidden = false; document.body.classList.add("locked"); burger.setAttribute("aria-expanded", "true"); $("#ovClose").focus(); }
  function closeOverlay() { if (overlay.hidden) return; overlay.hidden = true; document.body.classList.remove("locked"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", openOverlay);
  $("#ovClose").addEventListener("click", closeOverlay);
  $("#ovSub").addEventListener("click", closeOverlay);

  // Search
  const panel = $("#searchPanel"), q = $("#q");
  const all = [...posts.map((p) => [p.title, `${p.cat} · ${p.author}`]), ["48 Hours in Santorini: Beyond the Instagram Spots", "Destinations · Elena Vasquez"]];
  function runSearch() {
    const v = q.value.trim().toLowerCase();
    if (!v) { $("#sRes").innerHTML = ""; return; }
    const hits = all.filter(([t, m]) => (t + " " + m).toLowerCase().includes(v)).slice(0, 8);
    const hl = (t) => esc(t).replace(new RegExp(`(${v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"), "<mark>$1</mark>");
    $("#sRes").innerHTML = hits.length ? hits.map(([t, m]) => `<li><a href="#stories" data-read="${esc(t)}"><span>${hl(t)}</span><small>${esc(m)}</small></a></li>`).join("") : `<li class="none">No stories match “${esc(q.value)}”</li>`;
  }
  function openSearch(v) { panel.hidden = false; q.value = v || ""; runSearch(); q.focus(); }
  const closeSearch = () => { panel.hidden = true; };
  $("#searchBtn").addEventListener("click", () => openSearch());
  $("#searchClose").addEventListener("click", closeSearch);
  q.addEventListener("input", runSearch);
  $("#sRes").addEventListener("click", (e) => { if (e.target.closest("a")) closeSearch(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); closeOverlay(); } if (e.key === "/" && document.activeElement === document.body) { e.preventDefault(); openSearch(); } });

  // Sticky category shadow + back to top
  const catsEl = $("#cats"), toTop = $("#toTop");
  const onScroll = () => {
    catsEl.classList.toggle("stuck", catsEl.getBoundingClientRect().top <= parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) + 1 && window.scrollY > 200);
    toTop.hidden = window.scrollY < 1200;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); $(".logo").focus({ preventScroll: true }); });

  // Newsletter
  $("#nlForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#nlEmail").value.trim(), m = $("#nlMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.textContent = "Please enter a valid email address."; return; }
    m.textContent = "You're in — see you Thursday! (demo, nothing was sent)";
    $("#nlEmail").value = "";
  });
})();
