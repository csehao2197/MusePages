(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const icon = (id) => `<svg class="i" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const CATS = ["All", "Branding", "Web Design", "E-commerce", "Mobile Apps", "Digital Marketing", "Product Design"];
  // kind: identity | web | dash | phone | product; pal: [background, primary, secondary, ink]
  const P = [
    { id: "solaris", title: "Solaris Rebrand", client: "Solaris Energy", brand: "Solaris", cats: ["Branding"], kind: "identity", ratio: "wide", mark: "sun", pal: ["#FFF6D6", "#FACC15", "#F97316", "#1C1917"], year: 2025, logo: true,
      brief: "Bold yellow identity system for a clean-energy installer going national.", result: ["+340% qualified leads", "+127% organic traffic"] },
    { id: "bloom", title: "Bloom E-commerce", client: "Bloom Skincare", brand: "Bloom", cats: ["E-commerce", "Web Design"], kind: "web", ratio: "square", mark: "petal", pal: ["#FCE7EC", "#E11D74", "#FFF1F4", "#3F1D2B"], head: ["Skin that", "feels like you"], cta: "Shop the edit", year: 2025, logo: true,
      brief: "Soft-pink storefront with guided routines and a faster checkout.", result: ["+62% conversion rate", "+38% average order value"] },
    { id: "nexus", title: "Nexus Dashboard", client: "Nexus Finance", brand: "Nexus", cats: ["Product Design"], kind: "dash", ratio: "wide", mark: "hex", pal: ["#0F172A", "#22D3EE", "#A78BFA", "#F8FAFC"], year: 2024, logo: true,
      brief: "Dark-mode wealth dashboard that turns twelve account views into one.", result: ["-45% time to insight", "4.8★ in-app rating"] },
    { id: "wander", title: "Wander App", client: "Wander Travel", brand: "Wander", cats: ["Mobile Apps"], kind: "phone", ratio: "tall", screen: "map", mark: "pin", pal: ["#D9F2E6", "#0F766E", "#ECFDF5", "#0B2A26"], year: 2025, logo: true,
      brief: "Map-first travel companion with walkable routes and offline guides.", result: ["1.2M downloads", "Apple Design shortlist"] },
    { id: "crest", title: "Crest Brewing", client: "Crest Craft Beer", brand: "Crest", cats: ["Branding", "Web Design"], kind: "web", ratio: "wide", mark: "crest", pal: ["#EADBC8", "#9A3412", "#F5EBDD", "#2B1D12"], head: ["Brewed slow,", "poured local"], cta: "Find the taproom", year: 2024, logo: true,
      brief: "Earthy brand and taproom site for a mountain craft brewery.", result: ["+210% taproom bookings", "3 packaging awards"] },
    { id: "pulse", title: "Pulse Fitness", client: "Pulse Gym", brand: "Pulse", cats: ["Digital Marketing", "Web Design"], kind: "web", ratio: "square", mark: "bolt", pal: ["#111827", "#F43F5E", "#FFE4E6", "#111827"], head: ["Train hard.", "Feel unstoppable."], cta: "Claim free pass", year: 2025, logo: true,
      brief: "High-energy landing page and paid social engine for a gym launch.", result: ["4,800 trial sign-ups", "-52% cost per lead"] },
    { id: "arborist", title: "Arborist", client: "Arborist Consulting", brand: "Arborist", cats: ["Branding"], kind: "identity", ratio: "square", mark: "leaf", pal: ["#FFFFFF", "#15803D", "#BBF7D0", "#14532D"], year: 2024, logo: true,
      brief: "Minimal green identity for an urban forestry consultancy.", result: ["+3 municipal contracts", "Brand system in 9 weeks"] },
    { id: "kindred", title: "Kindred", client: "Kindred Community", brand: "Kindred", cats: ["Web Design"], kind: "web", ratio: "wide", mark: "ring", pal: ["#FDE7D3", "#EA580C", "#FFE4CC", "#3B1F0E"], head: ["Find your", "people nearby"], cta: "Join a circle", year: 2023, logo: true,
      brief: "Community platform with warm gradients and friendly onboarding.", result: ["+88% weekly active members", "2x event RSVPs"] },
    { id: "volt", title: "Volt EV", client: "Volt Motors", brand: "Volt", cats: ["E-commerce", "Branding"], kind: "product", ratio: "wide", screen: "car", mark: "bolt", pal: ["#E0F2FE", "#2563EB", "#F1F5F9", "#0F172A"], head: ["Volt One", "Long Range"], price: "From $42,900", cta: "Reserve yours", swatches: ["#2563EB", "#E5E7EB", "#111827", "#B91C1C"], year: 2025, logo: true,
      brief: "Electric vehicle configurator with live pricing and reservations.", result: ["11,400 reservations", "+74% configurator completion"] },
    { id: "nourish", title: "Nourish", client: "Nourish Meal Kits", brand: "Nourish", cats: ["E-commerce"], kind: "product", ratio: "square", mark: "bowl", pal: ["#ECFCCB", "#65A30D", "#F7FEE7", "#1A2E05"], head: ["Miso glazed", "salmon bowl"], price: "$11.50 / serving", cta: "Add to this week", year: 2024, logo: true,
      brief: "Recipe-led product pages that make picking a weekly box effortless.", result: ["+41% subscription starts", "-23% churn"] },
    { id: "studiox", title: "StudioX", client: "StudioX Coworking", brand: "StudioX", cats: ["Web Design", "Digital Marketing"], kind: "web", ratio: "wide", mark: "x", pal: ["#E5E7EB", "#111827", "#F3F4F6", "#111827"], head: ["Space to do", "your best work"], cta: "Book a tour", year: 2023, logo: true,
      brief: "Membership and booking site with live desk availability.", result: ["+156% tour bookings", "92% desk occupancy"] },
    { id: "clarity", title: "Clarity", client: "Clarity Health", brand: "Clarity", cats: ["Mobile Apps", "Product Design"], kind: "phone", ratio: "tall", screen: "health", second: true, offset: 0.12, mark: "drop", pal: ["#E0E7FF", "#4F46E5", "#EEF2FF", "#1E1B4B"], year: 2025, logo: true,
      brief: "Health tracking app that turns daily data into gentle nudges.", result: ["68% 30-day retention", "Featured on the App Store"] },
    // additional sample work so the full archive matches the 24-project count
    { id: "meridian", title: "Meridian Identity", client: "Meridian Architects", brand: "Meridian", cats: ["Branding"], kind: "identity", ratio: "wide", mark: "arc", pal: ["#F5F5F4", "#57534E", "#D6D3D1", "#1C1917"], year: 2024, logo: true,
      brief: "Quiet, material-led identity for an architecture studio.", result: ["Shortlisted, Brand Impact Awards", "+40% RFP invitations"] },
    { id: "cadence", title: "Cadence", client: "Cadence Music", brand: "Cadence", cats: ["Mobile Apps", "Product Design"], kind: "phone", ratio: "square", screen: "health", mark: "wave", pal: ["#EDE9FE", "#7C3AED", "#F5F3FF", "#2E1065"], year: 2024, logo: true,
      brief: "Practice tracker for music students with streaks and teacher notes.", result: ["250K learners", "+35% practice minutes"] },
    { id: "trailhead", title: "Trailhead Outfitters", client: "Trailhead", brand: "Trailhead", cats: ["E-commerce"], kind: "product", ratio: "tall", mark: "tri", pal: ["#E7E5E4", "#B45309", "#FAFAF9", "#1C1917"], head: ["Ridgeline 40L", "Pack"], price: "$189", cta: "Add to cart", year: 2023, logo: true,
      brief: "Outdoor gear store with fit finders and trail-tested reviews.", result: ["+29% conversion", "-18% returns"] },
    { id: "ledger", title: "Ledger Business", client: "Ledger Bank", brand: "Ledger", cats: ["Product Design", "Web Design"], kind: "dash", ratio: "square", mark: "square", pal: ["#0B1324", "#34D399", "#60A5FA", "#F8FAFC"], year: 2025, logo: true,
      brief: "Small-business banking dashboard with cash-flow forecasting.", result: ["+61% feature adoption", "-30% support calls"] },
    { id: "kettle", title: "Kettle Tea House", client: "Kettle", brand: "Kettle", cats: ["Branding", "Digital Marketing"], kind: "identity", ratio: "tall", mark: "drop", pal: ["#FEF3C7", "#B45309", "#FDE68A", "#451A03"], year: 2023, logo: true,
      brief: "Packaging and launch campaign for a modern tea house.", result: ["Sold out first run", "+9K Instagram followers"] },
    { id: "lumen", title: "Lumen Learning", client: "Lumen Learning", brand: "Lumen", cats: ["Mobile Apps"], kind: "phone", ratio: "wide", screen: "map", mark: "sun", pal: ["#FEF9C3", "#CA8A04", "#FEFCE8", "#422006"], year: 2024, logo: true,
      brief: "Field-trip companion app for school groups.", result: ["600 schools onboarded", "4.7★ teacher rating"] },
    { id: "hound", title: "Hound & Co.", client: "Hound & Co. Vets", brand: "Hound&Co", cats: ["Digital Marketing"], kind: "web", ratio: "square", mark: "dots", pal: ["#DBEAFE", "#1D4ED8", "#EFF6FF", "#172554"], head: ["Vets who", "know your dog"], cta: "Book a visit", year: 2025, logo: true,
      brief: "Local SEO and paid search for a growing veterinary group.", result: ["+190% booked visits", "#1 for 40 local terms"] },
    { id: "petal", title: "Petal & Stem", client: "Petal & Stem", brand: "Petal", cats: ["E-commerce", "Branding"], kind: "product", ratio: "wide", mark: "petal", pal: ["#FCE7F3", "#DB2777", "#FDF2F8", "#500724"], head: ["Weekly", "garden bunch"], price: "$48", cta: "Subscribe", year: 2024, logo: true,
      brief: "Florist brand refresh and subscription store.", result: ["+3.4x subscriptions", "+45% repeat orders"] },
    { id: "grounded", title: "Grounded Coffee", client: "Grounded", brand: "Grounded", cats: ["Web Design"], kind: "web", ratio: "tall", mark: "bowl", pal: ["#E7D7C9", "#7C2D12", "#F3E8DE", "#2A140A"], head: ["Roasted on", "Thursdays"], cta: "Shop beans", year: 2023, logo: true,
      brief: "Roastery website with brew guides and a wholesale portal.", result: ["+70% wholesale leads", "2.1s faster LCP"] },
    { id: "echo", title: "Echo Audio", client: "Echo Audio", brand: "Echo", cats: ["E-commerce", "Product Design"], kind: "product", ratio: "square", mark: "ring", pal: ["#E2E8F0", "#0F172A", "#F8FAFC", "#0F172A"], head: ["Echo Studio", "Headphones"], price: "$349", cta: "Pre-order", swatches: ["#0F172A", "#E2E8F0", "#B45309"], year: 2025, logo: true,
      brief: "Product launch store with an interactive sound comparison.", result: ["$2.1M launch week", "+48% pre-orders"] },
    { id: "pageturn", title: "Pageturn Press", client: "Pageturn", brand: "Pageturn", cats: ["Web Design", "Branding"], kind: "web", ratio: "wide", mark: "square", pal: ["#FEE2E2", "#B91C1C", "#FEF2F2", "#450A0A"], head: ["Stories worth", "staying up for"], cta: "Browse catalog", year: 2024, logo: true,
      brief: "Independent publisher site with author pages and pre-orders.", result: ["+120% pre-orders", "3x newsletter growth"] },
    { id: "harbor", title: "Harbor Health", client: "Harbor Health", brand: "Harbor", cats: ["Digital Marketing", "Mobile Apps"], kind: "phone", ratio: "square", screen: "health", mark: "wave", pal: ["#CCFBF1", "#0D9488", "#F0FDFA", "#134E4A"], year: 2025, logo: true,
      brief: "Patient app launch with lifecycle email and paid social.", result: ["85K installs in 90 days", "-37% cost per install"] },
  ];

  // ---------- filter + grid ----------
  let filter = "All", view = "grid";
  const pills = $("[data-pills]"), gridA = $("[data-grid-a]"), gridB = $("[data-grid-b]"), featured = $("[data-featured]");
  pills.innerHTML = CATS.map((c) => `<button class="pill${c === "All" ? " on" : ""}" type="button" aria-pressed="${c === "All"}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");

  function card(p) {
    return `<article class="card r-${p.ratio}" data-id="${p.id}">
      <button class="card-hit" type="button" data-case-open="${p.id}" aria-label="${esc(p.title)} — view case study">
        <span class="card-img">${window.Art.project(view === "list" ? { ...p, ratio: "wide" } : p)}</span>
        <span class="overlay" aria-hidden="true">
          <span class="ov-tags">${p.cats.map((c) => `<span class="tagpill">${esc(c)}</span>`).join("")}</span>
          <span class="ov-title">${esc(p.title)}</span>
          <span class="ov-client">${esc(p.client)}</span>
          <span class="ov-link">View Case Study ${icon("arrow")}</span>
        </span>
      </button>
      <div class="card-meta"><h3>${esc(p.title)}</h3><p>${esc(p.client)} · ${p.cats.map(esc).join(", ")}</p></div>
      <div class="row-info"><span class="row-year">${p.year}</span><p class="row-brief">${esc(p.brief)}</p><span class="row-go">${icon("arrow")}</span></div>
    </article>`;
  }
  function render() {
    const list = P.filter((p) => filter === "All" || p.cats.includes(filter));
    gridA.innerHTML = list.slice(0, 6).map(card).join("");
    gridB.innerHTML = list.slice(6).map(card).join("");
    featured.hidden = !(filter === "All" || filter === "Branding" || filter === "Web Design") || list.length < 1;
    $("[data-empty]").hidden = list.length > 0;
    $("[data-result]").textContent = `Showing ${list.length} project${list.length === 1 ? "" : "s"}`;
    [gridA, gridB].forEach((g) => { g.classList.toggle("list", view === "list"); g.classList.remove("fade"); void g.offsetWidth; g.classList.add("fade"); });
  }
  function setFilter(c) {
    filter = c;
    $$(".pill", pills).forEach((b) => { const on = b.dataset.cat === c; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); if (on) b.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); });
    render();
  }
  pills.addEventListener("click", (e) => { const b = e.target.closest(".pill"); if (b) setFilter(b.dataset.cat); });
  $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
    view = b.dataset.view;
    $$("[data-view]").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", String(on)); });
    render();
  }));
  $$("[data-filter-link]").forEach((a) => a.addEventListener("click", () => setFilter(a.dataset.filterLink)));
  render();

  // featured art
  const sol = P[0];
  $("[data-feat-art]").innerHTML = window.Art.project({ ...sol, ratio: "square" }, "Solaris Energy brand identity system");
  $("[data-feat-logo]").innerHTML = window.Art.logo("Solaris", "sun", "#fff");

  // ---------- dialogs ----------
  const caseDlg = $("[data-case]"), infoDlg = $("[data-info]"), briefDlg = $("[data-brief]");
  let caseIdx = 0, caseList = P;
  function openCase(id) {
    caseList = P.filter((p) => filter === "All" || p.cats.includes(filter));
    if (!caseList.some((p) => p.id === id)) caseList = P;
    caseIdx = caseList.findIndex((p) => p.id === id);
    fillCase();
    if (!caseDlg.open) caseDlg.showModal();
  }
  function fillCase() {
    const p = caseList[caseIdx];
    $("[data-case-art]").innerHTML = window.Art.project({ ...p, ratio: "wide" }, `${p.title} case study image`);
    $("[data-case-meta]").textContent = `${p.client} · ${p.cats.join(" + ")} · ${p.year}`;
    $("[data-case-title]").textContent = p.title;
    $("[data-case-lede]").textContent = p.id === "solaris" ? "A complete rebrand and website redesign that repositioned Solaris from a regional installer to a national clean energy leader." : p.brief;
    const res = p.id === "solaris" ? ["+340% qualified leads", "+127% organic traffic", "2.8s → 0.9s load time"] : p.result;
    $("[data-case-cols]").innerHTML = `
      <div><h3>Challenge</h3><p>${esc(p.client)} needed ${p.cats.includes("Branding") ? "a brand that matched its ambition" : p.cats.includes("Digital Marketing") ? "predictable, measurable growth" : "a digital experience customers would choose again"}.</p></div>
      <div><h3>What we did</h3><ul>${p.cats.map((c) => `<li>${esc({ Branding: "Strategy, naming and visual identity", "Web Design": "UX, visual design and build", "E-commerce": "Storefront, merchandising and checkout", "Mobile Apps": "iOS and Android product design", "Digital Marketing": "SEO, paid media and content", "Product Design": "Research, UX and design system" }[c])}</li>`).join("")}</ul></div>
      <div><h3>Results</h3><ul class="res">${res.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>`;
    caseDlg.scrollTop = 0;
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-case-open]"); if (b) openCase(b.dataset.caseOpen); });
  $$("[data-case-step]").forEach((b) => b.addEventListener("click", () => { caseIdx = (caseIdx + +b.dataset.caseStep + caseList.length) % caseList.length; fillCase(); }));
  $$(".dlg").forEach((d) => {
    d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
  });

  const SERVICES = {
    branding: ["Brand Strategy & Identity", "From naming to full visual systems", ["Positioning and naming", "Logo, type and color systems", "Brand guidelines and asset libraries", "Packaging and environmental design"], "Typical engagement: 8–12 weeks"],
    web: ["Web Design & Development", "Websites that convert visitors into customers", ["Conversion-led UX and content strategy", "Visual design and prototyping", "Headless CMS and e-commerce builds", "Core Web Vitals performance tuning"], "Typical engagement: 10–16 weeks"],
    marketing: ["Digital Marketing", "SEO, PPC, and content that drives growth", ["Technical and local SEO", "Paid search and paid social", "Content programs and lifecycle email", "Analytics and monthly reporting"], "Typical engagement: ongoing retainers"],
  };
  function info(kicker, title, html) { $("[data-info-kicker]").textContent = kicker; $("[data-info-title]").textContent = title; $("[data-info-body]").innerHTML = html; if (!infoDlg.open) infoDlg.showModal(); }
  function openService(k) { const s = SERVICES[k]; info("Services", s[0], `<p class="lede">${esc(s[1])}</p><ul class="checks">${s[2].map((x) => `<li>${icon("check")}${esc(x)}</li>`).join("")}</ul><p class="note">${esc(s[3])}</p><button class="btn btn-dark" type="button" data-start>Start a Project</button>`); }
  $$("[data-service]").forEach((b) => b.addEventListener("click", () => openService(b.dataset.service)));
  $$("[data-service-link]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openService(a.dataset.serviceLink); }));
  const STEPS = [["Discover", "Workshops, research and an audit of what already works."], ["Define", "Positioning, success metrics and a scoped roadmap."], ["Design", "Concepts, prototypes and testing with real customers."], ["Build", "Development, content and QA in weekly sprints."], ["Grow", "Launch, measure and iterate against the metrics we agreed."]];
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-process]")) { e.preventDefault(); info("How we work", "Our Process", `<ol class="proc">${STEPS.map(([n, d], i) => `<li><span>${String(i + 1).padStart(2, "0")}</span><div><b>${n}</b><p>${d}</p></div></li>`).join("")}</ol>`); }
    if (e.target.closest("[data-start]")) { e.preventDefault(); if (infoDlg.open) infoDlg.close(); if (caseDlg.open) caseDlg.close(); resetBrief(); briefDlg.showModal(); }
    const soon = e.target.closest("[data-soon]");
    if (soon) { e.preventDefault(); say(`${soon.dataset.soon} is part of the full site; this demo includes the Work page only.`); closeMenu(); }
  });

  // ---------- brief form ----------
  const bf = $("[data-brief-form]");
  function resetBrief() { bf.reset(); $("[data-brief-done]").hidden = true; $("[data-brief-err]").textContent = ""; }
  bf.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = bf.elements, needs = $$("[name=need]:checked", bf).map((x) => x.value), miss = [];
    if (!needs.length) miss.push("what you need");
    if (!f.name.value.trim()) miss.push("your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim())) miss.push("a valid email");
    if (miss.length) { $("[data-brief-err]").textContent = `Please add ${miss.join(", ")}.`; return; }
    $("[data-brief-err]").textContent = "";
    $("[data-brief-text]").textContent = `Thanks, ${f.name.value.trim().split(/\s+/)[0]}. We'll reply within one business day about ${needs.join(", ").toLowerCase()}. (Demo: nothing was sent.)`;
    $("[data-brief-done]").hidden = false;
  });

  // ---------- counters ----------
  const fmt = (el, v) => { const d = +(el.dataset.decimals || 0); return `${el.dataset.prefix || ""}${v.toFixed(d)}${el.dataset.suffix || ""}`; };
  function run(el) {
    if (el.dataset.done) return; el.dataset.done = "1";
    const end = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = (now) => { const k = still ? 1 : Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(el, end * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { $$("[data-count]", en.target).forEach(run); io.unobserve(en.target); } }), { threshold: 0.3 });
  $$("[data-counters]").forEach((c) => io.observe(c));

  // ---------- client marquee ----------
  const LOGOS = P.slice(0, 16).map((p) => [p.brand, p.mark, p.pal[1] === "#111827" ? "#4B5563" : p.pal[1]]);
  $$("[data-track]").forEach((tr, row) => {
    const set = (row ? LOGOS.slice(8).concat(LOGOS.slice(0, 8)) : LOGOS).map(([n, m, c]) => `<li class="lg">${window.Art.logo(n, m, c)}</li>`).join("");
    tr.innerHTML = `<ul>${set}</ul><ul aria-hidden="true">${set}</ul>`;
  });

  // ---------- nav, sticky filter, mobile ----------
  const nav = $("[data-nav]"), filters = $("[data-filters]"), menu = $("[data-menu]"), mbtn = $("[data-menu-btn]");
  function onScroll() {
    nav.classList.toggle("scrolled", scrollY > 4);
    filters.classList.toggle("stuck", filters.getBoundingClientRect().top <= nav.offsetHeight + 1);
    document.body.classList.toggle("show-sticky", scrollY > 300 && !briefDlg.open);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  function closeMenu() { menu.hidden = true; mbtn.setAttribute("aria-expanded", "false"); mbtn.innerHTML = icon("menu"); }
  mbtn.addEventListener("click", () => { const open = menu.hidden; menu.hidden = !open; mbtn.setAttribute("aria-expanded", String(open)); mbtn.innerHTML = icon(open ? "close" : "menu"); });
  $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));

  const toast = $("[data-toast]"); let tt;
  function say(m) { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 3400); }

  window.MuseForge = { count: () => $$(".card").length, filter: () => filter, view: () => view };
})();
