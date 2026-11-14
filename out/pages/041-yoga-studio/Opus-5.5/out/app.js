(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const A = window.Art;
  $("[data-art=hero]").innerHTML = A.hero();

  // ---------- classes ----------
  const CLASSES = [
    ["vinyasa", "Vinyasa Flow", "Dynamic, breath-linked movement. Build strength, flexibility, and focus.", "60 min", "All levels", "flame", "#E9C9A8"],
    ["hot", "Hot Power Yoga", "Traditional power yoga in 95°F heated room. Deep sweat, deep stretch.", "75 min", "Intermediate+", "fire", "#EBB8A3"],
    ["yin", "Yin Yoga", "Slow, passive poses held 3-5 minutes. Deep connective tissue release.", "75 min", "All levels", "moon", "#C9C3DD"],
    ["restorative", "Restorative", "Prop-supported poses for total relaxation. Perfect stress relief.", "60 min", "All levels", "cloud", "#BFD6DA"],
    ["meditation", "Meditation & Breathwork", "Guided mindfulness, pranayama, and visualization techniques.", "30 min", "All levels", "eye", "#CFDCC3"],
    ["prenatal", "Prenatal Yoga", "Safe, nurturing practice for expecting mothers. Modified poses throughout.", "60 min", "All levels", "heart", "#E8C8CF"],
    ["sculpt", "Yoga Sculpt", "Yoga meets light weights. Cardio bursts, strength building, and stretching.", "60 min", "Intermediate", "dumbbell", "#E6D49E"],
  ];
  const CL = Object.fromEntries(CLASSES.map((c) => [c[0], c]));
  $("[data-classes]").innerHTML = CLASSES.map(([k, n, d, t, l, ic, c]) => `
    <article class="ccard" style="--c:${c}"><span class="c-ico">${icon(ic)}</span><h3>${n}</h3><p>${d}</p>
      <p class="c-meta"><span>${icon("clock")}${t}</span><span>${l}</span></p>
      <button class="link c-book" type="button" data-type="${k}">Book This Class ${icon("arrow")}</button></article>`).join("");

  // ---------- schedule ----------
  const SCHED = [
    ["6:00 AM", "vinyasa", "Maya R.", "South Lamar", "Studio A", 8],
    ["7:30 AM", "hot", "Devon K.", "South Lamar", "Hot Room", 0],
    ["9:00 AM", "yin", "Lena M.", "Domain", "Studio B", 12],
    ["10:30 AM", "sculpt", "Carlos G.", "South Lamar", "Studio A", 5],
    ["12:00 PM", "meditation", "Maya R.", "Livestream", "Online", -1],
    ["5:30 PM", "vinyasa", "Aisha T.", "Domain", "Studio A", 10],
    ["7:00 PM", "restorative", "Lena M.", "South Lamar", "Studio B", 15],
  ];
  const LOCS = ["South Lamar", "Domain", "Livestream"];
  const PILLS = [["", "All"], ["vinyasa", "Vinyasa"], ["hot", "Hot"], ["yin", "Yin"], ["restorative", "Restorative"], ["meditation", "Meditation"], ["sculpt", "Sculpt"]];
  let loc = "South Lamar", type = "", who = "";
  const booked = new Set();
  $("[data-today]").textContent = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  $("[data-loc-tabs]").innerHTML = LOCS.map((l) => `<button class="tab" type="button" role="tab" data-loc="${l}">${l}</button>`).join("");
  $("[data-pills]").innerHTML = PILLS.map(([k, n]) => `<button class="pill" type="button" aria-pressed="${k === ""}" data-type-pill="${k}">${n}</button>`).join("");
  const hour = (t) => { const [h, m] = t.split(/[: ]/); let H = +h % 12; if (/PM/.test(t)) H += 12; return H + +m / 60; };
  function renderSched() {
    $$("[data-loc]").forEach((b) => b.setAttribute("aria-selected", String(!who && b.dataset.loc === loc)));
    $$("[data-type-pill]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.typePill === type)));
    const rows = SCHED.map((r, i) => [r, i]).filter(([r]) => (who ? r[2] === who : r[3] === loc) && (!type || r[1] === type));
    const groups = [["Morning", (h) => h < 12], ["Midday", (h) => h >= 12 && h < 17], ["Evening", (h) => h >= 17]];
    $("[data-sched]").innerHTML = (who ? `<li class="who-chip">Showing ${esc(who)}'s classes today at all locations <button type="button" class="link" data-clear-who>Show all</button></li>` : "") + groups.map(([g, fn]) => {
      const rs = rows.filter(([r]) => fn(hour(r[0])));
      if (!rs.length) return "";
      return `<li class="grp"><details open><summary>${g}<span>${rs.length} class${rs.length > 1 ? "es" : ""}</span>${icon("chevron")}</summary><ol>${rs.map(([[t, k, ins, l, room, spots], i]) => {
        const c = CL[k], full = spots === 0, b = booked.has(i), left = spots - (b ? 1 : 0);
        return `<li class="row"><span class="dot" style="--c:${c[6]}"></span><span class="time">${t}</span><span class="cls"><b>${c[1]}</b><span>with <button type="button" class="ins" data-who="${ins}">${ins}</button></span></span><span class="where">${l} · ${room}</span><span class="avail${full ? " full" : ""}">${spots < 0 ? "Unlimited" : full ? "Full (Waitlist)" : `${left} spots left`}</span>
          ${b ? `<span class="booked">${icon("check")}Booked</span>` : `<button class="btn btn-sm ${full ? "btn-gray" : "btn-teal"}" type="button" data-book-row="${i}">${full ? "Waitlist" : spots < 0 ? "Join" : "Book"}</button>`}</li>`;
      }).join("")}</ol></details></li>`;
    }).join("");
    $("[data-empty]").hidden = rows.length > 0;
  }
  function setLoc(l) { loc = l; who = ""; $("[data-loc-select]").value = l === "Livestream" ? $("[data-loc-select]").value : l; renderSched(); }
  $("[data-loc-tabs]").addEventListener("click", (e) => { const b = e.target.closest("[data-loc]"); if (b) setLoc(b.dataset.loc); });
  $("[data-pills]").addEventListener("click", (e) => { const b = e.target.closest("[data-type-pill]"); if (b) { type = b.dataset.typePill; renderSched(); } });
  $("[data-loc-select]").addEventListener("change", (e) => { setLoc(e.target.value); say(`Home studio set to ${e.target.value}.`); });
  $("[data-classes]").addEventListener("click", (e) => { const b = e.target.closest("[data-type]"); if (!b) return; type = b.dataset.type; who = ""; if (!SCHED.some((r) => r[3] === loc && r[1] === type)) { const r = SCHED.find((x) => x[1] === type); if (r) loc = r[3]; } renderSched(); $("#schedule").scrollIntoView({ behavior: "smooth" }); if (!SCHED.some((r) => r[1] === type)) say(`${CL[type][1]} isn't on today's schedule — see the full week.`); });
  document.addEventListener("click", (e) => {
    const w = e.target.closest("[data-who]"); if (w) { who = w.dataset.who; type = ""; renderSched(); $("#schedule").scrollIntoView({ behavior: "smooth" }); }
    if (e.target.closest("[data-clear-who]")) { who = ""; renderSched(); }
  });
  renderSched();

  // ---------- instructors ----------
  const GUIDES = [
    ["Maya R.", "Lead Instructor, E-RYT 500", "Vinyasa, Meditation", 12, "Maya's classes blend physical challenge with mindfulness. Her playlists are legendary.", { skin: 3, hair: 0, hairStyle: "curly", top: 0, bg: 0 }],
    ["Devon K.", "Hot Yoga Specialist, RYT 200", "Hot Power, Vinyasa", 6, "Devon brings the heat — literally. Expect to sweat, laugh, and leave renewed.", { skin: 5, hair: 0, hairStyle: "buzz", top: 4, bg: 2 }],
    ["Lena M.", "Yin & Restorative, E-RYT 500", "Yin, Restorative, Prenatal", 15, "Lena creates the most calming space. Her yin classes feel like a warm hug.", { skin: 0, hair: 3, hairStyle: "long", top: 9, bg: 1 }],
    ["Carlos G.", "Yoga Sculpt, RYT 200", "Sculpt, Vinyasa Flow", 4, "Carlos fuses yoga with fitness. Come ready to work — and have fun.", { skin: 2, hair: 0, hairStyle: "side", top: 3, bg: 3, beard: true }],
  ];
  $("[data-guides]").innerHTML = GUIDES.map(([n, cr, sp, yrs, bio, look]) => `
    <article class="guide"><div class="g-img">${A.portrait(look, `Illustrated portrait of ${n}`)}</div>
      <h3>${n}</h3><p class="cred">${cr}</p><p class="spec">${sp} · ${yrs} years teaching</p><p class="bio">“${bio}”</p>
      <button class="link g-link" type="button" data-who="${n}">View Schedule ${icon("arrow")}</button></article>`).join("");

  // ---------- on-demand ----------
  const VIDS = [["flow", "Morning Vinyasa Flow", 45, "Maya R.", 4.9, 312], ["yin", "Deep Yin for Hips & Lower Back", 60, "Lena M.", 4.8, 287], ["desk", "Quick Desk Break Stretch", 10, "Carlos G.", 4.9, 541], ["sleep", "Sleep Meditation & Body Scan", 20, "Devon K.", 4.7, 198]];
  $("[data-vids]").innerHTML = VIDS.map(([k, t, m, ins, r, v], i) => `<button class="vid" type="button" data-vid="${i}"><span class="v-th">${A.thumb(k, "")}<span class="v-play">${icon("play")}</span><span class="v-dur">${m} min</span></span><b>${t}</b><span class="v-meta">with ${ins} · ${icon("star")}${r} (${v} views)</span></button>`).join("");
  const vd = $("[data-vdlg]");
  let vTimer = 0;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-vid]"); if (!b) return;
    const [k, t, m, ins] = VIDS[+b.dataset.vid];
    $("[data-v-stage]").innerHTML = A.thumb(k, `${t} preview (animated illustration)`) + `<span class="v-badge">Preview · animated illustration</span>`;
    $("[data-v-title]").textContent = t; $("[data-v-meta]").textContent = `${m} min · with ${ins} · members stream the full class`;
    let p = 0; clearInterval(vTimer); vTimer = setInterval(() => { p = (p + 1) % 300; $("[data-v-prog]").style.width = `${(p / 300) * 100}%`; $("[data-v-stage]").style.setProperty("--b", (Math.sin(p / 12) + 1) / 2); }, 100);
    vd.showModal();
  });
  vd.addEventListener("close", () => clearInterval(vTimer));

  // ---------- workshops ----------
  const WS = [["Jan 18", "2–4 PM", "Handstand Workshop", "Carlos G.", "$45", "Break down arm balances and inversions. All levels welcome (we use the wall!).", 8], ["Feb 1", "7–8:30 PM", "Sound Bath & Restorative", "Lena M.", "$35", "Crystal singing bowls, candlelight, and deep rest. Bring a blanket.", 14], ["Mar 1", "Starts", "200-Hour Teacher Training", "Maya R. & Lena M.", "$3,200 (payment plans available)", "Become a certified yoga teacher. 12-week immersive program.", 4]];
  $("[data-workshops]").innerHTML = WS.map(([d, t, n, ins, p, desc, s], i) => { const [mo, day] = d.split(" "); return `<article class="ws"><div class="ws-date"><span>${mo}</span><b>${day}</b></div><div class="ws-body"><p class="ws-time">${icon("cal")}${t === "Starts" ? `Starts ${d}` : `${d}, ${t}`}</p><h3>${n}</h3><p class="ws-ins">with ${ins}</p><p>${desc}</p><div class="ws-foot"><b>${p}</b><span class="${s < 5 ? "low" : ""}">${s} spots left</span></div><button class="btn btn-taupe" type="button" data-ws="${i}">Register</button></div></article>`; }).join("");

  // ---------- testimonials ----------
  const TMS = [["I've tried studios all over Austin. Inhale is different — the instructors actually see you. Maya adjusted my alignment in week one and it changed my entire practice.", "Rebecca T.", "2023"], ["Hot Power with Devon is the highlight of my week. I leave drenched and grinning. The heated room is immaculate too — no weird smell like other hot yoga spots.", "James P.", "2024"], ["As a complete beginner, I was nervous. But the vibe here is so welcoming. Nobody judges you. I started with Restorative and now I'm doing Vinyasa 3x a week.", "Mia L.", "2024"]];
  $("[data-tms]").innerHTML = TMS.map(([q, n, y]) => `<figure class="tm"><p class="stars" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</p><blockquote>“${q}”</blockquote><figcaption><b>${n}</b> · member since ${y}</figcaption></figure>`).join("");
  $(".rating .stars").innerHTML = icon("star").repeat(5);

  // ---------- locations ----------
  const L2 = [["South Lamar", "2401 S Lamar Blvd, Austin, TX 78704", "2 studios + hot room", "Parking: free lot", "Hours: 6 AM–9 PM daily", [["M0 70H400", 14], ["M140 0V220", 10], ["M0 150H400", 6], ["M290 0V220", 6]]], ["Domain", "11005 Burnet Rd, Suite 120, Austin, TX 78758", "1 studio + meditation room", "Parking: garage (free 2 hrs)", "Hours: 7 AM–9 PM daily", [["M60 0L340 220", 14], ["M0 90H400", 8], ["M250 0V220", 6]]]];
  $("[data-locs]").innerHTML = L2.map(([n, a, s, p, h, roads]) => `<article class="loc"><div class="map">${A.map(`Map of the ${n} studio`, roads)}</div><div class="loc-body"><h3>${n}</h3><p>${icon("pin")}${a}</p><p>${icon("door")}${s}</p><p>${icon("car")}${p}</p><p>${icon("clock")}${h}</p><a class="link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(a)}" target="_blank" rel="noopener">Get directions ${icon("arrow")}</a></div></article>`).join("");

  // ---------- booking dialog ----------
  const dlg = $("[data-dlg]"), form = $("[data-book]");
  let action = null;
  function openBook(o) { action = o; form.reset(); $("[data-b-done]").hidden = true; $("[data-b-err]").textContent = ""; $("[data-b-kicker]").textContent = o.kicker; $("[data-b-title]").textContent = o.title; $("[data-b-desc]").textContent = o.desc; $("[data-b-submit]").textContent = o.submit; dlg.showModal(); }
  document.addEventListener("click", (e) => {
    const r = e.target.closest("[data-book-row]");
    if (r) { const i = +r.dataset.bookRow, [t, k, ins, l, room, spots] = SCHED[i]; openBook({ kicker: spots === 0 ? "Join the waitlist" : "Reserve a spot", title: `${CL[k][1]} · ${t}`, desc: `with ${ins} · ${l}${l === "Livestream" ? "" : `, ${room}`} · ${CL[k][3]}`, submit: spots === 0 ? "Join Waitlist" : "Book Class", row: i, full: spots === 0 }); }
    const w = e.target.closest("[data-ws]"); if (w) { const [d, t, n, ins, p] = WS[+w.dataset.ws]; openBook({ kicker: "Workshop registration", title: n, desc: `${t === "Starts" ? `Starts ${d}` : `${d}, ${t}`} · with ${ins} · ${p}`, submit: "Register" }); }
    const b = e.target.closest("[data-buy]"); if (b) openBook({ kicker: "Membership", title: b.dataset.buy, desc: "Your first class is free either way. Payment is collected at the studio in this demo.", submit: "Continue" });
    const s = e.target.closest("[data-soon]"); if (s) { e.preventDefault(); say(`${s.dataset.soon} lives on the full site; this demo is the homepage.`); closeMenu(); }
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    if (!f.name.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) { $("[data-b-err]").textContent = "Please add your name and a valid email."; return; }
    if (action.row !== undefined && !action.full) { booked.add(action.row); renderSched(); }
    $("[data-b-done-title]").textContent = action.full ? "You're on the waitlist" : "See you on the mat";
    $("[data-b-text]").textContent = `${f.name.value.trim().split(/\s+/)[0]} — ${action.title}. Confirmation would go to ${f.email.value.trim()}. (Demo: nothing was sent or charged.)`;
    $("[data-b-done]").hidden = false;
  });
  $$(".dlg").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); }));

  // ---------- claim ----------
  $("[data-claim]").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#cl-email").value.trim(), m = $("[data-claim-msg]");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.textContent = "Please enter a valid email address."; m.classList.add("bad"); return; }
    m.classList.remove("bad"); m.textContent = `Your free class pass is on its way to ${v}. (Demo)`; e.target.reset();
  });

  // ---------- nav / overlay / fab ----------
  const menu = $("[data-menu]"), ob = $("[data-menu-open]");
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; ob.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; }
  ob.addEventListener("click", () => { menu.hidden = false; ob.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; $("[data-menu-close]").focus(); });
  $("[data-menu-close]").addEventListener("click", closeMenu);
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  function onScroll() { $("[data-nav]").classList.toggle("scrolled", scrollY > 8); const s = $("#schedule").getBoundingClientRect(); document.body.classList.toggle("show-fab", scrollY > 500 && !(s.top < innerHeight && s.bottom > 0)); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3200); }

  window.MuseInhale = { loc: () => loc, type: () => type, who: () => who };
})();
