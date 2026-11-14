(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i"><use href="#${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const A = window.Art;
  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v);
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } } };

  /* ---------- data ---------- */
  const AUTH = { mia: "Mia Chen", leo: "Leo Alvarez", astrid: "Astrid Nygaard", kenji: "Kenji Matsuda", elena: "Elena Vasquez", sam: "Sam Okafor", nora: "Nora Lindqvist", ines: "Inés Romero" };
  const ARTS = [
    { id: "rest", t: "The Case for Doing Less: Why Rest Is the New Productivity Hack", cat: "Wellness", au: "mia", min: 8, ex: "In a culture obsessed with optimization, we talked to neuroscientists, monks, and burnt-out founders about the radical act of slowing down." },
    { id: "sauna", t: "Why Everyone in Copenhagen Is Biking to the Sauna", cat: "Travel", au: "astrid", min: 6, ex: "Harbor saunas, cold plunges and a city that treats warmth as public infrastructure." },
    { id: "pantry", t: "The 5 Japanese Pantry Staples That Changed How I Cook", cat: "Food", au: "kenji", min: 5, ex: "Miso, kombu, mirin, yuzu and good soy sauce — and the weeknight dishes they quietly transform." },
    { id: "wardrobe", t: "I Wore Only 15 Pieces for 30 Days — Here's What I Learned", cat: "Style", au: "elena", min: 7, ex: "Fewer choices, more outfits I actually liked, and an unexpected lesson about who I dress for." },
    { id: "mezcal", t: "A Weekend Guide to Oaxaca's Mezcal Country", cat: "Travel", au: "ines", min: 9, ex: "Family palenques, roadside tlayudas and how to taste mezcal like the people who make it." },
    { id: "meditate", t: "How to Actually Meditate (From Someone Who Couldn't)", cat: "Wellness", au: "sam", min: 4, ex: "Two minutes, one breath at a time, and permission to be terrible at it." },
    { id: "chefs", t: "The Restaurants Where Chefs Eat on Their Day Off", cat: "Food", au: "kenji", min: 6, ex: "Twelve chefs, twelve unpretentious favorites — from noodle counters to a beloved diner." },
    { id: "luxury", t: "What 'Quiet Luxury' Gets Wrong About Style", cat: "Culture", au: "elena", min: 7, ex: "Beige isn't a personality. A case for clothes that are loud about care, not price." },
    { id: "books", t: "12 Books Our Team Can't Stop Recommending", cat: "Culture", au: "leo", min: 5, ex: "Novels, essays and one very good cookbook we keep pressing into friends' hands." },
    { id: "morning", t: "The Morning Routine That Replaced My Coffee Addiction", cat: "Wellness", au: "mia", min: 6, ex: "Matcha, daylight and a ten-minute walk — and the surprisingly easy first week." },
    { id: "solo", t: "Why Solo Travel at 40 Feels Different (and Better)", cat: "Travel", au: "nora", min: 10, ex: "At 25 I traveled alone to prove I could. At 40 I travel alone because I finally know what I want from a day — long breakfasts, one museum, no itinerary after 3 p.m. Here's what changed, and a few places that reward going solo." },
    { id: "retreat", t: "Digital Detox Retreats That Are Actually Worth It", cat: "Wellness", au: "sam", min: 8, ex: "Five phone-free stays, from a Catskills cabin to a Portuguese farm, tested by an anxious scroller.", reads: "12K" },
    { id: "pasta", t: "The TikTok Pasta That Broke Our Test Kitchen", cat: "Food", au: "kenji", min: 4, ex: "We made it nine ways. Here's the version worth your oven.", reads: "9.8K" },
    { id: "onebag", t: "Pack Like a Local: The One-Bag Travel System", cat: "Travel", au: "astrid", min: 6, ex: "Packing cubes, a three-color rule and the five items that do double duty.", reads: "8.2K" },
    { id: "rams", t: "Interview: Designing Calm with Dieter Rams' Protégé", cat: "Culture", tags: ["Interviews"], au: "leo", min: 11, ex: "On less-but-better objects, quiet rooms and why good design should almost disappear.", reads: "7.1K" },
    { id: "capsule", t: "The Capsule Wardrobe Cheat Sheet for Spring 2026", cat: "Style", au: "elena", min: 5, ex: "Twenty pieces, endless outfits, and a printable checklist.", reads: "6.5K" },
    { id: "joy", img: "morning", t: "Finding Joy in the Mundane", cat: "Wellness", au: "mia", min: 5, ex: "Dishes, laundry, the walk to the train — small rituals that make an ordinary week feel good." },
    { id: "gifts", img: "books", t: "The Sunday Gift Guide: 20 Thoughtful Things Under $50", cat: "Style", tags: ["Gift Guides"], au: "leo", min: 6, ex: "Books, pantry treats and small objects our editors actually use." }
  ];
  const BY = Object.fromEntries(ARTS.map((a) => [a.id, a]));
  const imgOf = (a) => a.img || a.id;
  const inCat = (a, c) => c === "All" || a.cat === c || (a.tags || []).includes(c);

  /* ---------- lazy illustration rendering ---------- */
  const paint = (el) => { if (el.dataset.painted) return; el.innerHTML = A.scene(el.dataset.img); el.dataset.painted = "1"; };
  const io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { paint(e.target); io.unobserve(e.target); } }), { rootMargin: "300px" }) : null;
  const lazy = (root = document) => $$("[data-img]:not([data-painted])", root).forEach((el) => (el.hasAttribute("data-eager") || !io ? paint(el) : io.observe(el)));
  const avs = (root = document) => $$("[data-av]", root).forEach((el) => { if (!el.innerHTML) el.innerHTML = A.avatar(el.dataset.av, AUTH[el.dataset.av]); });

  /* ---------- saved (bookmarks) ---------- */
  const saved = new Set(store.get("tse-saved", []));
  const saveBtn = (id) => `<button class="save" type="button" data-save="${id}" aria-pressed="${saved.has(id)}" aria-label="${saved.has(id) ? "Remove from" : "Save to"} reading list">${icon("i-heart")}</button>`;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-save]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const id = b.dataset.save;
    saved.has(id) ? saved.delete(id) : saved.add(id);
    store.set("tse-saved", [...saved]);
    $$(`[data-save="${id}"]`).forEach((x) => { x.setAttribute("aria-pressed", saved.has(id)); x.setAttribute("aria-label", `${saved.has(id) ? "Remove from" : "Save to"} reading list`); });
    toast(saved.has(id) ? `Saved to your reading list (${saved.size})` : "Removed from your reading list");
  }, true);

  /* ---------- cards ---------- */
  const meta = (a, big) => `<p class="meta"><span class="av" data-av="${a.au}"></span>${big ? "By " : ""}${AUTH[a.au]} · ${a.min} min</p>`;
  const card = (a, cls = "") => `<article class="card ${cls}"><div class="img"><div data-img="${imgOf(a)}"></div>${saveBtn(a.id)}</div><div class="txt"><span class="pill${cls ? " soft" : ""}">${a.cat}</span><h3><a href="#${a.id}" data-open-article="${a.id}">${esc(a.t)}</a></h3>${cls === "pick" ? "" : `<p class="ex">${esc(a.ex)}</p>`}${meta(a, cls === "wide" || cls === "pick")}</div></article>`;

  $("[data-picks]").innerHTML = ["sauna", "pantry", "wardrobe"].map((id) => card(BY[id], "pick")).join("");

  const DEFAULT = [["mezcal", "big"], ["meditate", "small"], ["chefs", "small"], ["luxury", ""], ["books", ""], ["morning", ""], ["solo", "wide"]];
  let cat = "All";
  function renderLatest() {
    const el = $("[data-latest]");
    if (cat === "All") {
      el.innerHTML = DEFAULT.map(([id, c]) => card(BY[id], c)).join("");
      $("[data-filter-note]").textContent = "";
    } else {
      const list = ARTS.filter((a) => inCat(a, cat));
      el.innerHTML = list.length ? list.map((a) => card(a)).join("") : `<div class="empty">No ${esc(cat)} stories yet — check back Sunday.</div>`;
      $("[data-filter-note]").textContent = `${list.length} ${cat} ${list.length === 1 ? "story" : "stories"}`;
    }
    lazy(el); avs(el);
  }
  renderLatest();

  /* ---------- category bar ---------- */
  const catBar = $("[data-cats]");
  function setCat(c, scroll = true) {
    cat = c;
    $$("[data-cat]").forEach((b) => b.setAttribute("aria-selected", b.dataset.cat === c));
    const active = $(`[data-cat="${CSS.escape(c)}"]`);
    if (active) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    renderLatest();
    if (scroll) $("#latest").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  catBar.addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (b) setCat(b.dataset.cat); });
  $$("[data-cat-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); closeMenu(); setCat(a.dataset.catLink); }));
  $("[data-view-all]").addEventListener("click", () => {
    openDlg(`<div class="pad"><h3>All stories</h3><p style="color:#78716C">${ARTS.length} recent pieces from the magazine.</p><ul class="s-res">${ARTS.map((a) => `<li><button type="button" data-open-article="${a.id}"><b>${esc(a.t)}</b><small>${a.cat} · ${a.min} min</small></button></li>`).join("")}</ul></div>`);
  });

  /* ---------- trending ---------- */
  $("[data-trend]").innerHTML = ["retreat", "pasta", "onebag", "rams", "capsule"].map((id, i) => { const a = BY[id]; return `<li class="tr"><span class="num" aria-hidden="true">${i + 1}</span><div><span class="pill soft">${a.cat}</span><h3><a href="#${a.id}" data-open-article="${a.id}"><span class="sr">${i + 1}. </span>${esc(a.t)}</a></h3><small>${icon("i-eye")}${a.reads} reads</small></div><span class="thumb" data-img="${imgOf(a)}"></span></li>`; }).join("");

  /* ---------- collection ---------- */
  const COLL = ["wardrobe", "retreat", "joy", "rest"];
  $("[data-coll]").innerHTML = COLL.map((id) => { const a = BY[id]; return `<li><button type="button" data-open-article="${a.id}"><b>${esc(a.t)}</b><span><span class="pill soft">${a.cat}</span>${a.min} min</span></button></li>`; }).join("");
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-explore]"); if (!b) return; e.preventDefault(); openDlg(`<div class="a-img" data-img="slow"></div><div class="a-in"><span class="pill">Collection</span><h3>The Slow Living Guide</h3><p>Our favorite reads on intentional living — from minimalist wardrobes to digital boundaries to finding joy in the mundane.</p><ul class="s-res">${[...COLL, "meditate", "morning"].map((id) => `<li><button type="button" data-open-article="${id}"><b>${esc(BY[id].t)}</b><small>${BY[id].min} min</small></button></li>`).join("")}</ul></div>`); });

  /* ---------- instagram ---------- */
  $("[data-ig]").innerHTML = A.IG.map(([k, cap, likes], i) => `<li><button type="button" data-ig-i="${i}" aria-label="Instagram post: ${esc(cap)} — ${likes} likes"><span data-img="${k}"></span><span class="ov" aria-hidden="true"><b>${icon("i-heart")}${likes}</b>${esc(cap)}</span></button></li>`).join("");
  $("[data-ig]").addEventListener("click", (e) => { const b = e.target.closest("[data-ig-i]"); if (!b) return; const [k, cap, likes] = A.IG[b.dataset.igI]; openDlg(`<div class="a-img" style="aspect-ratio:1" data-img="${k}"></div><div class="a-in"><p style="margin:0"><b>@thesundayedit</b> ${esc(cap)}</p><p style="color:#78716C;font-size:14px;margin:6px 0 0">${likes} likes · preview of an Instagram post</p></div>`); });

  avs(); lazy();

  /* ---------- article reader ---------- */
  const BODY = {
    Wellness: ["We asked researchers what actually happens when we stop. The answer was less mystical than we expected: attention recovers, memory consolidates, and the ideas we chased all week tend to arrive on their own.", "None of the people we interviewed recommended a dramatic overhaul. They suggested something smaller — one protected hour, one walk without headphones, one evening with no plan — repeated until it becomes a habit."],
    Travel: ["The best trips we've taken lately were slower than planned. We booked fewer places, stayed longer in each, and let locals decide where dinner happened.", "Below are the neighborhoods, small hotels and early-morning rituals we'd repeat — plus the one thing we'd skip next time."],
    Food: ["Good cooking rarely needs more equipment; it needs a few ingredients that do a lot of work. These are the ones our test kitchen keeps reaching for.", "Each comes with a weeknight recipe that takes under thirty minutes and makes leftovers better than the original."],
    Culture: ["Taste is a conversation, not a rulebook. We spent a month with designers, writers and shop owners who make things slowly and well.", "What they share isn't an aesthetic so much as attention: to materials, to the people using the thing, and to what can be left out."],
    Style: ["Getting dressed is easier with fewer, better pieces. We tested the theory for a month and kept a diary of every outfit.", "The result surprised us: more variety, less laundry, and a clearer sense of what we actually like to wear."]
  };
  function openArticle(id) {
    const a = BY[id]; if (!a) return;
    openDlg(`<div class="a-img" data-img="${imgOf(a)}"></div><div class="a-in"><span class="pill">${a.cat}</span><h3>${esc(a.t)}</h3><p class="meta"><span class="av" data-av="${a.au}"></span>By ${AUTH[a.au]} · ${a.min} min read</p><p>${esc(a.ex)}</p>${BODY[a.cat].map((p) => `<p>${p}</p>`).join("")}<p style="color:#78716C;font-size:14px;font-style:italic">Preview excerpt — the full story is in this Sunday's issue.</p><p>${saveBtn(a.id).replace('class="save"', 'class="btn btn-of" style="position:static;width:auto;height:auto;box-shadow:none"').replace("</button>", " Save for later</button>")}</p></div>`);
    lazy(body); avs(body);
  }
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-open-article]"); if (!el || e.target.closest("[data-save]")) return;
    e.preventDefault(); closeSearch(); openArticle(el.dataset.openArticle);
  });

  /* ---------- dialog + toast ---------- */
  const dlg = $("[data-dlg]"), body = $("[data-dlg-body]");
  function openDlg(html) { body.innerHTML = html; lazy(body); avs(body); if (!dlg.open) dlg.showModal(); body.scrollTop = 0; dlg.scrollTop = 0; const f = $("input, textarea, select", body); (f || $("[data-close]")).focus(); }
  $("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => (body.innerHTML = ""));
  const toastEl = $("[data-toast]"); let tt;
  function toast(m) { toastEl.textContent = m; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2800); }

  /* ---------- subscribe ---------- */
  let subscribed = store.get("tse-sub", false);
  $$("[data-sub-form]").forEach((f) => f.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = f.email.value.trim(), msg = $("[data-msg]", f);
    if (!validEmail(v)) { msg.className = msg.className.replace(/ ?(ok|bad)/g, "") + " bad"; msg.textContent = "Please enter a valid email address."; f.email.focus(); return; }
    subscribed = true; store.set("tse-sub", true);
    msg.className = msg.className.replace(/ ?(ok|bad)/g, "") + " ok";
    msg.textContent = `You're in! Look for us in ${v}'s inbox this Sunday. (Demo — nothing is sent.)`;
    f.reset(); syncBar();
  }));

  /* ---------- search ---------- */
  const so = $("[data-search]"), sin = $("[data-search-in]"), sres = $("[data-search-res]");
  let lastFocus = null;
  function openSearch() { lastFocus = document.activeElement; so.hidden = false; sin.value = ""; renderSearch(); sin.focus(); }
  function closeSearch() { if (so.hidden) return; so.hidden = true; if (lastFocus) lastFocus.focus(); }
  function renderSearch() {
    const q = sin.value.trim().toLowerCase();
    const list = q ? ARTS.filter((a) => `${a.t} ${a.cat} ${AUTH[a.au]} ${(a.tags || []).join(" ")}`.toLowerCase().includes(q)) : ARTS.slice(0, 5);
    const hi = (t) => { if (!q) return esc(t); const i = t.toLowerCase().indexOf(q); return i < 0 ? esc(t) : `${esc(t.slice(0, i))}<mark>${esc(t.slice(i, i + q.length))}</mark>${esc(t.slice(i + q.length))}`; };
    sres.innerHTML = (q ? "" : '<li><p>Popular right now</p></li>') + (list.length ? list.map((a) => `<li><button type="button" data-open-article="${a.id}"><b>${hi(a.t)}</b><small>${a.cat} · ${AUTH[a.au]}</small></button></li>`).join("") : `<li><p>No stories match “${esc(sin.value.trim())}”.</p></li>`);
  }
  $("[data-search-open]").addEventListener("click", openSearch);
  $("[data-search-close]").addEventListener("click", closeSearch);
  sin.addEventListener("input", renderSearch);
  so.addEventListener("click", (e) => { if (e.target === so) closeSearch(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSearch(); closeMenu(); } if (e.key === "/" && so.hidden && !/input|textarea/i.test(document.activeElement.tagName) && !dlg.open) { e.preventDefault(); openSearch(); } });

  /* ---------- shop / team / pitch / misc ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-shop], [data-team], [data-pitch], [data-soon]"); if (!t) return;
    e.preventDefault(); closeMenu();
    if (t.hasAttribute("data-shop")) openDlg(`<div class="pad"><h3>Shop Our Picks</h3><p style="color:#78716C">Things our editors use every week. Product links aren't active in this demo.</p><ul class="products">${[["Stonewashed linen sheets", "Bedroom", "$148"], ["Ceramic matcha set", "Kitchen", "$42"], ["Yuzu kosho", "Pantry", "$12"], ["Merino travel tee", "Style", "$68"], ["Packing cube trio", "Travel", "$34"], ["Hardcover reading journal", "Culture", "$24"]].map(([n, c, p]) => `<li><small>${c}</small><b>${n}</b><span>${p}</span></li>`).join("")}</ul></div>`);
    else if (t.hasAttribute("data-team")) openDlg(`<div class="pad"><h3>Meet the Team</h3><ul class="team-list">${[["mia", "Co-founder & Editor-in-Chief"], ["leo", "Co-founder & Culture Editor"], ["kenji", "Food Editor"], ["elena", "Style Editor"], ["astrid", "Travel Editor"], ["sam", "Wellness Writer"]].map(([k, r]) => `<li><span class="av" data-av="${k}"></span><span><b>${AUTH[k]}</b><small>${r}</small></span></li>`).join("")}</ul></div>`);
    else if (t.hasAttribute("data-pitch")) {
      openDlg(`<div class="pad"><h3>Write for Us</h3><p style="color:#78716C">We commission personal essays, reported features and guides. Tell us your idea in a few sentences.</p><form class="form" data-pitch-form novalidate><label>Name<input name="name" autocomplete="name"></label><label>Email<input name="email" type="email" autocomplete="email"></label><label>Section<select name="sec"><option>Wellness</option><option>Travel</option><option>Culture</option><option>Food</option><option>Style</option></select></label><label>Your pitch<textarea name="pitch"></textarea></label><p class="err" data-err role="alert"></p><button class="btn btn-f" type="submit">Send pitch</button></form></div>`);
      $("[data-pitch-form]", body).addEventListener("submit", (ev) => {
        ev.preventDefault(); const f = ev.target;
        if (!f.name.value.trim() || !validEmail(f.email.value.trim()) || f.pitch.value.trim().length < 20) { $("[data-err]", body).textContent = "Please add your name, a valid email and a pitch of at least a sentence."; return; }
        $(".pad", body).innerHTML = `<h3>Thank you, ${esc(f.name.value.trim().split(" ")[0])}!</h3><p>Our ${esc(f.sec.value)} editor reads every pitch and replies within two weeks. (Demo — nothing is sent.)</p>`;
      });
    } else toast(`${t.dataset.soon} — coming soon.`);
  });

  /* ---------- nav: mobile menu, stuck bar, sticky subscribe ---------- */
  const burger = $("[data-burger]"), mnav = $("[data-mnav]");
  function closeMenu() { if (mnav.hidden) return; mnav.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open sections menu"); }
  burger.addEventListener("click", () => { const show = mnav.hidden; mnav.hidden = !show; burger.setAttribute("aria-expanded", show); burger.setAttribute("aria-label", show ? "Close sections menu" : "Open sections menu"); });
  const mbar = $("[data-mbar]"), hero = $(".hero"), news = $("#newsletter");
  function syncBar() {
    const n = news.getBoundingClientRect();
    mbar.classList.toggle("show", !subscribed && hero.getBoundingClientRect().bottom < 0 && !(n.top < innerHeight && n.bottom > 0));
    catBar.classList.toggle("stuck", catBar.getBoundingClientRect().top <= parseFloat(getComputedStyle(catBar).top) + 1 && scrollY > 10);
  }
  addEventListener("scroll", syncBar, { passive: true }); addEventListener("resize", syncBar); syncBar();
})();
