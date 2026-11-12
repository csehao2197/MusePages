(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  const money = (value) => `$${value.toLocaleString("en-US")}`;
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const normalize = (value) => value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const typeIcon = { Flights: "Plane", Hotels: "Hotel", Packages: "Luggage", Cruises: "Ship", Cars: "Car", Experiences: "Mountain" };
  const definitions = [
    ["santorini", "Santorini, Greece", "Greece", "Europe", "Packages", "Flight + Hotel", 5, 899, 1840, "santorini", "Whitewashed island architecture above the Aegean Sea"],
    ["cancun", "Cancún, Mexico", "Mexico", "Americas", "Hotels", "All-Inclusive Resort", 7, 1149, 2100, "cancun", "Turquoise water and a tropical Mexican shoreline"],
    ["kyoto", "Kyoto, Japan", "Japan", "Asia", "Packages", "Flight + Ryokan Stay", 6, 1299, 2450, "kyoto", "Traditional Japanese streets and architecture"],
    ["amalfi", "Amalfi Coast, Italy", "Italy", "Europe", "Hotels", "Boutique Hotel", 4, 679, 1200, "amalfi", "The Amalfi Coast viewed from Ravello, Italy, photographed by Bruno Rijsman"],
    ["maldives", "Maldives", "Maldives", "Asia", "Hotels", "Overwater Villa", 5, 2199, 4500, "maldives", "Overwater villas above a clear turquoise lagoon"],
    ["reykjavik", "Reykjavik, Iceland", "Iceland", "Europe", "Packages", "Flight + Northern Lights Tour", 4, 799, 1500, "iceland", "Dramatic Icelandic landscape, illustrative of a northern escape"],
    ["marrakech", "Marrakech, Morocco", "Morocco", "Africa", "Packages", "Riad + Desert Tour", 5, 549, 980, "marrakech", "Warm-toned Moroccan architecture and streets"],
    ["phuket", "Phuket, Thailand", "Thailand", "Asia", "Hotels", "Beachfront Resort", 7, 699, 1350, "phuket", "A tropical beach, illustrative of a Thailand resort stay"],
    ["paris", "Paris, France", "France", "Europe", "Flights", "Direct · One-way Flight", 0, 199, 329, "paris", "The Eiffel Tower and Paris city skyline"],
    ["barcelona", "Barcelona, Spain", "Spain", "Europe", "Flights", "Round-trip Flight", 0, 289, 649, "amalfi", "Mediterranean coastal scenery, an illustrative stock photograph"],
    ["cruise", "Caribbean Islands", "Caribbean", "Caribbean", "Cruises", "7-Night Caribbean Cruise", 7, 749, 1599, "cruise", "A cruise ship on a sunny ocean voyage"],
    ["bali", "Bali, Indonesia", "Indonesia", "Asia", "Hotels", "All-Inclusive Resort", 5, 599, 1299, "bali", "Lush tropical Bali architecture and landscape"],
    ["lisbon", "Lisbon City Break", "Portugal", "Europe", "Packages", "City Hotel + Walking Tour", 4, 449, 725, "lisbon", "Lisbon's Praça do Comércio and Rua Augusta Arch"],
    ["algarve", "Algarve Beach Escape", "Portugal", "Europe", "Hotels", "Coastal Hotel", 6, 599, 1033, "phuket", "A sunlit beach, illustrative of a coastal escape"],
    ["porto", "Porto Wine Country", "Portugal", "Europe", "Packages", "Hotel + Wine Country Tour", 3, 379, 583, "porto", "Porto waterfront architecture beside the Douro River"],
    ["lisbon-car", "Lisbon Coastal Drive", "Portugal", "Europe", "Cars", "3-Day Compact Car Rental", 3, 149, 229, "lisbon", "Portuguese city architecture, illustrative of a road trip"],
    ["iceland-tour", "Iceland Waterfall Walk", "Iceland", "Europe", "Experiences", "Guided Day Experience", 0, 89, 139, "iceland", "An Icelandic waterfall and rugged landscape"],
    ["athens", "Athens Weekend Getaway", "Greece", "Europe", "Packages", "2-Night City Break", 2, 329, 549, "santorini", "Greek island architecture, illustrative of a Greek getaway"],
    ["sri-lanka", "Sri Lanka Beach & Culture", "Sri Lanka", "Asia", "Packages", "Beach Stay + Culture Tour", 6, 649, 1049, "bali", "Tropical scenery, illustrative of a Sri Lanka holiday"],
    ["tokyo", "London → Tokyo", "Japan", "Asia", "Flights", "Round-trip Flight", 0, 412, 890, "kyoto", "Traditional Japanese architecture, illustrative of a Japan trip"],
  ];
  const all = definitions.map(([id, title, country, region, type, label, nights, price, oldPrice, image, alt], index) => ({
    id, title, country, region, type, label, nights, price, oldPrice, image, alt,
    savings: oldPrice - price,
    percent: Math.round((1 - price / oldPrice) * 100),
    rating: [4.7, 4.8, 4.9, 4.6][index % 4],
    reviews: [1203, 846, 972, 638, 1562, 721, 493, 1158][index % 8],
    months: id === "bali" || index % 3 === 0 ? [0, 1] : [index % 2],
    departure: [6, 12, 19, 3, 26, 8, 15, 5, 2, 7, 14, 9][index % 12],
    origin: id === "tokyo" ? "London LHR" : type === "Flights" || label.startsWith("Flight") ? "New York NYC JFK" : "",
    unit: type === "Cars" ? "rental" : "person",
  }));
  const byId = new Map(all.map((deal) => [deal.id, deal]));
  const catalogue = all.slice(0, 17);
  let storageAvailable = true;
  function readStore(key, fallback) {
    let value;
    try { value = localStorage.getItem(`farefinder-${key}`); }
    catch { storageAvailable = false; return fallback; }
    try { return value === null ? fallback : JSON.parse(value); } catch { return fallback; }
  }
  function writeStore(key, value) {
    try { localStorage.setItem(`farefinder-${key}`, JSON.stringify(value)); }
    catch { storageAvailable = false; }
  }
  const validIds = (value) => Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === "string" && byId.has(id)))] : [];
  let saved = new Set(validIds(readStore("saved", [])));
  let history = validIds(readStore("history", [])).slice(0, 4);
  const storedCampaign = readStore("campaign", null);
  const campaign = Number.isFinite(storedCampaign) && storedCampaign > 0 && storedCampaign <= Date.now() ? storedCampaign : Date.now();
  writeStore("campaign", campaign);
  const flashes = [
    { id: "barcelona", title: "New York → Barcelona", subtitle: "Round-trip flight", percent: 55, seconds: 4 * 3600 + 23 * 60 + 11 },
    { id: "bali", title: "5 nights in Bali", subtitle: "All-inclusive · 5 nights", percent: 54, seconds: 8 * 3600 + 5 * 60 + 33 },
    { id: "tokyo", title: "London → Tokyo", subtitle: "Round-trip flight", percent: 53, seconds: 2 * 3600 + 47 * 60 + 9 },
    { id: "cruise", title: "Caribbean cruise", subtitle: "Ocean escape · 7 nights", percent: 53, seconds: 11 * 3600 + 30 * 60 + 22 },
  ];
  const state = { type: "", region: "", budget: "", dates: "", origin: "", query: "", saved: false, short: false, last: false, sort: "best", limit: 9 };
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    $("#toast").textContent = message;
    $("#toast").classList.add("visible");
    toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3200);
  }
  const adults = () => Number($("#travelers").value);
  const tripText = (deal) => deal.type === "Flights" ? `${deal.label.startsWith("Direct") ? "One way" : "Round trip"} · ${adults()} adult${adults() === 1 ? "" : "s"} · Economy`
    : deal.type === "Cars" ? "3 days · 1 compact car · Sample rental"
      : deal.type === "Experiences" ? `1 day · ${adults()} adult${adults() === 1 ? "" : "s"} · Guided tour`
        : `${deal.nights} nights · ${adults()} adult${adults() === 1 ? "" : "s"} · ${deal.label.includes("Inclusive") ? "All meals included" : "Breakfast included"}`;
  function fitsBudget(price) {
    return !state.budget || (state.budget === "under" && price < 300)
      || (state.budget === "mid" && price >= 300 && price <= 700)
      || (state.budget === "high" && price > 700 && price <= 1500)
      || (state.budget === "luxury" && price > 1500);
  }
  function matching() {
    const matches = (state.saved ? all : catalogue).filter((deal) => (!state.type || deal.type === state.type)
      && (!state.region || deal.region === state.region)
      && fitsBudget(deal.price)
      && (!state.dates || deal.months.includes(Number(state.dates)))
      && (!state.query || normalize(`${deal.title} ${deal.country} ${deal.region}`).includes(normalize(state.query)))
      && (!state.origin || (deal.origin && normalize(deal.origin).includes(normalize(state.origin))))
      && (!state.saved || saved.has(deal.id))
      && (!state.short || deal.nights <= 3)
      && (!state.last || deal.departure <= 7));
    if (state.sort === "price") matches.sort((a, b) => a.price - b.price);
    if (state.sort === "savings") matches.sort((a, b) => b.savings - a.savings);
    if (state.sort === "soon") matches.sort((a, b) => a.departure - b.departure);
    return matches;
  }
  function saveButton(deal, detail = false) {
    return `<button class="${detail ? "detail-save" : "save-deal"}" data-save="${deal.id}" aria-pressed="${saved.has(deal.id)}" aria-label="${saved.has(deal.id) ? "Unsave" : "Save"} ${escape(deal.title)}">${icon("Heart")}${detail ? '<span class="save-text">Save</span>' : ""}</button>`;
  }
  function card(deal) {
    return `<article class="deal-card" data-deal="${deal.id}" data-price="${deal.price}" data-savings="${deal.savings}" data-departure="${deal.departure}">
      <div class="deal-photo"><a href="#deal-details" data-open="${deal.id}" aria-label="View ${escape(deal.title)} details"><img src="assets/${deal.image}.jpg" alt="${escape(deal.alt)}" loading="lazy" width="600" height="420"></a><span class="savings-badge">Save ${deal.percent}%</span>${saveButton(deal)}<span class="deal-type">${icon(typeIcon[deal.type])}${deal.label}</span></div>
      <div class="deal-body"><p class="card-location">${icon("MapPin")}${deal.region} · ${deal.country}</p><h3>${deal.title}</h3><p class="trip-details">${tripText(deal)}</p><p class="rating">${icon("Star")}<strong>${deal.rating.toFixed(1)}</strong><span>(${deal.reviews.toLocaleString("en-US")} sample reviews)</span></p>
      <div class="deal-pricing"><div><del>${money(deal.oldPrice)}</del><p class="deal-price">${money(deal.price)}<small>/${deal.unit}</small></p></div><span class="total-savings">Save ${money(deal.savings)} total</span></div>
      <p class="deal-urgency">${icon(deal.id === "santorini" ? "Clock" : "Flame")}${deal.id === "santorini" ? "Only 3 left at this price" : "Selling fast"} <span>· demo stock</span></p>
      <button class="button button-orange" data-open="${deal.id}">View deal${icon("ArrowUpRight")}</button></div></article>`;
  }
  function renderResults() {
    const matches = matching();
    $("#deals-grid").innerHTML = matches.slice(0, state.limit).map(card).join("");
    $("#result-count").textContent = `${matches.length} ${state.saved ? "saved " : ""}deal${matches.length === 1 ? "" : "s"} found`;
    $("#mobile-count").textContent = matches.length;
    $("#showing-count").textContent = `Showing ${Math.min(state.limit, matches.length)} of ${matches.length} matching demo deals`;
    $("#empty-results").hidden = matches.length > 0;
    $("#load-more").hidden = state.limit >= matches.length;
    $("#search-summary").textContent = [state.query && `To: ${state.query}`, state.origin && `From: ${state.origin}`, state.short && "Weekend trips", state.last && "Within 7 days"].filter(Boolean).join(" · ");
    $("#show-saved").setAttribute("aria-pressed", String(state.saved));
    $$(".desktop-nav a").forEach((link) => link.classList.toggle("active", link.dataset.type === state.type));
    updateSaved();
  }
  function updateSaved() {
    $("#saved-count").textContent = saved.size;
    $$("[data-save]").forEach((button) => {
      const deal = byId.get(button.dataset.save);
      button.setAttribute("aria-pressed", String(saved.has(deal.id)));
      button.setAttribute("aria-label", `${saved.has(deal.id) ? "Unsave" : "Save"} ${deal.title}`);
      const label = $(".save-text", button);
      if (label) label.textContent = saved.has(deal.id) ? "Saved" : "Save";
    });
  }
  function syncFields() {
    for (const key of ["type", "region", "budget", "dates"]) $(`#filter-${key}`).value = state[key];
    $("#to-city").value = state.query;
    $("#from-city").value = state.origin;
    $("#search-dates").value = state.dates;
    $("#sort").value = state.sort;
  }
  function reset() {
    Object.assign(state, { type: "", region: "", budget: "", dates: "", origin: "", query: "", saved: false, short: false, last: false, sort: "best", limit: 9 });
    syncFields();
    renderResults();
  }
  function goToDeals() {
    $("#deals").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    closeMenu();
  }
  function filterBy(key, value) {
    reset();
    state[key] = value;
    syncFields();
    renderResults();
    goToDeals();
  }
  $("#deal-search").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = $("#to-city").value.trim();
    const origin = $("#from-city").value.trim();
    const dates = $("#search-dates").value;
    reset();
    Object.assign(state, { query, origin, dates });
    syncFields();
    renderResults();
    goToDeals();
    toast("Searching local sample offers only. Departure filtering applies to flight-inclusive offers.");
  });
  for (const key of ["type", "region", "budget", "dates"]) {
    $(`#filter-${key}`).addEventListener("change", (event) => {
      state[key] = event.target.value;
      state.limit = 9;
      syncFields();
      renderResults();
    });
  }
  $("#sort").addEventListener("change", (event) => { state.sort = event.target.value; renderResults(); });
  $("#load-more").addEventListener("click", () => {
    const index = state.limit;
    state.limit += 4;
    renderResults();
    const firstNew = $$(".deal-card")[index];
    if (firstNew) $("a", firstNew).focus({ preventScroll: true });
  });
  for (const id of ["clear-filters", "empty-reset"]) $(`#${id}`).addEventListener("click", reset);
  $("#show-saved").addEventListener("click", () => {
    const next = !state.saved;
    reset();
    state.saved = next;
    renderResults();
    goToDeals();
  });
  const categoryData = [
    ["Flights", "Flight deals", 124], ["Hotels", "Hotel deals", 89], ["Packages", "Vacation packages", 67],
    ["Cruises", "Cruise deals", 23], ["Cars", "Car rental deals", 45], ["Experiences", "Experiences & tours", 56],
  ];
  $("#category-grid").innerHTML = categoryData.map(([type, label, count]) => `<button class="category-card" data-type="${type}">${icon(typeIcon[type])}<strong>${label}</strong><small>${count} demo archive deals</small></button>`).join("");
  $("#portugal-deals").innerHTML = ["lisbon", "algarve", "porto"].map((id) => {
    const deal = byId.get(id);
    return `<button class="portugal-deal" data-open="${id}"><span><strong>${deal.title}</strong><small>${deal.nights} nights · Save ${deal.percent}%</small></span><span class="portugal-price"><span>from<b>${money(deal.price)}</b><span>/person</span></span>${icon("ArrowUpRight")}</span></button>`;
  }).join("");
  $("#see-portugal").addEventListener("click", () => filterBy("query", "Portugal"));
  function renderHistory() {
    $("#clear-history").disabled = !history.length;
    $("#recently-viewed").innerHTML = history.length ? history.map((id) => {
      const deal = byId.get(id);
      return `<button class="recent-card" data-open="${id}"><img src="assets/${deal.image}.jpg" alt="" width="90" height="90" loading="lazy"><span><strong>${deal.title}</strong><small>${deal.label}</small><b>${money(deal.price)} /${deal.unit}</b></span></button>`;
    }).join("") : `<div class="history-empty">${icon("Clock")}<div><strong>Every good trip starts with a look.</strong><span>Open a deal and it will appear here. ${storageAvailable ? "Your last four views stay on this browser." : "Storage is unavailable; activity stays in memory for this tab only."}</span></div></div>`;
    let picks = ["athens", "sri-lanka", "paris"];
    const last = byId.get(history[0]);
    if (last) {
      const sameRegion = all.filter((deal) => deal.region === last.region && !history.includes(deal.id) && !["lisbon-car", "iceland-tour", "tokyo"].includes(deal.id));
      picks = [...new Set([...sameRegion.map((deal) => deal.id), ...picks])].slice(0, 3);
    }
    $("#recommendation-note").textContent = last ? `Based on your interest in ${last.region}. Simple local matching, not live recommendations.` : "Popular sample picks. Browse a deal to see region-based recommendations.";
    $("#recommendations").innerHTML = picks.map((id) => {
      const deal = byId.get(id);
      return `<button class="recommendation" data-open="${id}"><img src="assets/${deal.image}.jpg" alt="${escape(deal.alt)}" width="180" height="200" loading="lazy"><span class="recommendation-copy"><small>${last ? `More to discover in ${deal.region}` : "A little inspiration for your next trip"}</small><strong>${deal.title}</strong><span>From <b>${money(deal.price)}</b> /${deal.unit}${deal.id === "paris" ? " · one way" : ""}</span></span></button>`;
    }).join("");
  }
  $("#clear-history").addEventListener("click", () => {
    history = [];
    writeStore("history", history);
    renderHistory();
    toast("Browsing history cleared on this browser.");
  });
  const dealDialog = $("#deal-dialog");
  let activeDeal = null;
  let activeFlash = false;
  const remaining = (flash) => Math.max(0, Math.ceil((campaign + flash.seconds * 1000 - Date.now()) / 1000));
  const monthLabel = (offset) => new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  function openDeal(id, flash = false, trigger = document.activeElement) {
    const deal = byId.get(id);
    if (!deal) return;
    activeDeal = deal;
    activeFlash = flash;
    history = [id, ...history.filter((viewed) => viewed !== id)].slice(0, 4);
    writeStore("history", history);
    renderHistory();
    $("#deal-detail").innerHTML = `<img class="detail-photo" src="assets/${deal.image}.jpg" alt="${escape(deal.alt)}" width="800" height="400"><div class="detail-content"><p class="eyebrow orange">${deal.label} · SAMPLE ITINERARY</p><h2 id="detail-title">${deal.title}</h2><p class="detail-meta">${tripText(deal)}<br>${icon("Star")} ${deal.rating.toFixed(1)} · ${deal.reviews.toLocaleString("en-US")} illustrative reviews${deal.origin ? `<br>Sample departure: ${deal.origin}` : ""}</p><div class="detail-includes"><span>${icon("Check")}No live inventory</span><span>${icon("Check")}Illustrative photography</span><span>${icon("Check")}No payment collected</span></div>
      <div class="detail-price"><div><del>${money(deal.oldPrice)}</del><strong>${money(deal.price)}</strong><small>/${deal.unit}</small></div><span>Save ${money(deal.savings)} /${deal.unit}</span></div><div class="booking-fields"><label>Sample travel month<select id="detail-month">${deal.months.map((month) => `<option value="${month}">${monthLabel(month)}</option>`).join("")}</select></label><label>Travelers<select id="detail-travelers">${[1, 2, 3, 4, 5, 6].map((number) => `<option value="${number}"${adults() === number ? " selected" : ""}>${number} adult${number === 1 ? "" : "s"}</option>`).join("")}</select></label></div><p class="detail-total"><span id="detail-total-label"></span><strong id="detail-total"></strong></p><div class="detail-actions"><button class="button button-orange" id="review-booking">Review demo booking${icon("ArrowRight")}</button>${saveButton(deal, true)}</div><p id="booking-feedback" class="form-feedback" role="status"></p><p class="detail-demo">Demo only. Prices, reviews, stock and included services are fictional. The total is simple sample-price arithmetic, not a quote. Taxes, transport details and cancellation terms are not verified; no booking or payment takes place.</p></div>`;
    if (state.dates && deal.months.includes(Number(state.dates))) $("#detail-month").value = state.dates;
    $("#detail-travelers").addEventListener("change", updateTotal);
    $("#review-booking").addEventListener("click", () => {
      const sale = flashes.find((item) => item.id === deal.id);
      if (activeFlash && sale && remaining(sale) === 0) {
        $("#booking-feedback").textContent = "This demo flash sale has expired. No reservation or payment was made.";
        return;
      }
      const count = Number($("#detail-travelers").value);
      $("#booking-feedback").textContent = `Demo itinerary reviewed: ${deal.title}, ${$("#detail-month").selectedOptions[0].textContent}, ${count} adult${count === 1 ? "" : "s"}. Sample total ${$("#detail-total").textContent}. No reservation, payment or email was made.`;
    });
    updateTotal();
    updateSaved();
    showDialog(dealDialog, trigger.isConnected ? trigger : $(`#recently-viewed [data-open="${id}"]`));
  }
  function updateTotal() {
    const count = activeDeal.unit === "rental" ? 1 : Number($("#detail-travelers").value);
    $("#detail-total-label").textContent = activeDeal.unit === "rental" ? "1 rental · 3 days · sample total" : `${count} adult${count === 1 ? "" : "s"} · sample total`;
    $("#detail-total").textContent = money(activeDeal.price * count);
    $("#booking-feedback").textContent = "";
  }
  $("#deal-dialog").addEventListener("change", (event) => { if (event.target.id === "detail-month") $("#booking-feedback").textContent = ""; });
  const info = {
    guarantee: ["Best Price Guarantee", "This is a fictional storefront, not a price-comparison service. Sample original and discounted prices demonstrate the interface; no lowest-price guarantee is offered.\nA real provider would need verified fare comparisons, eligibility rules and a claim process."],
    cancellation: ["A little flexibility", "“Free Cancellation” is an illustrative trust badge. This demo makes no reservations and has no real cancellation policy.\nIn a real purchase, confirm the provider's cancellation deadline, refund conditions and non-refundable fees before paying."],
    support: ["Here to help", "Explore the sample deals, combine filters, save favorites and open a demo itinerary. Search supports destination text; the From field filters flight-inclusive samples by their displayed origin.\nThere is no staffed 24/7 service, live inventory or help request backend. All behavior runs locally."],
    about: ["Made for the wonderfully restless", "FareFinder is a fictional travel-deals design prototype. It brings flights, stays, packages, cruises, rental cars and experiences into one small static collection.\nThe page is generated with GPT-6 (actual model: gpt-6.1-sol). No real travel business, suppliers or customer reviews are represented."],
    how: ["A better way to browse", "Search a destination, choose a deal type or budget, and compare the local sample offers. Open any deal to see an itinerary and a calculated demo total.\nHearts and your four most recent views are stored only in this browser when storage is available. Price alerts and newsletter signup validate inputs without sending or storing your email."],
    press: ["Press room", "This is a fictional brand prototype, with no press office or real announcements. Sample audience figures and ratings are illustrative rather than reported metrics."],
    careers: ["A world of possibilities", "FareFinder is a design demo, not an operating employer. There are no job listings, application forms or recruitment services connected to this page."],
    affiliates: ["Good trips, no hidden commissions", "This prototype has no affiliate programme or tracking links. Clicking a sample deal stays on this page and never transfers your information to a travel provider."],
    contact: ["A note on getting in touch", "This static demo has no contact service, staffed support or real company email address. No messages are collected.\nFor this prototype, use the local help guide to explore search, filters, saved deals and demo itinerary reviews."],
    privacy: ["Your browser. Your choices.", "Saved deal IDs, the last four viewed deal IDs and a demo-sale start timestamp can be stored in this browser. No analytics, cookies, account or remote requests are used at runtime.\nForms never store or send email addresses. If browser storage is blocked, saved deals and history work only in memory until you leave or reload. Clear your local saved deals and history below; sale timers keep their existing expiry."],
  };
  function openInfo(key) {
    const [title, text] = info[key] || info.how;
    $("#info-title").textContent = title;
    $("#info-text").textContent = text;
    $("#clear-local-data").hidden = key !== "privacy";
    $("#privacy-feedback").textContent = "";
    showDialog($("#info-dialog"));
  }
  $("#clear-local-data").addEventListener("click", () => {
    saved = new Set();
    history = [];
    writeStore("saved", []);
    writeStore("history", []);
    renderResults();
    renderHistory();
    $("#privacy-feedback").textContent = "Saved deals and browsing history cleared. Demo sale expiry is unchanged.";
  });
  function showDialog(dialog, opener = document.activeElement) {
    dialog._opener = opener;
    dialog.showModal();
    $("[data-close]", dialog).focus({ preventScroll: true });
    dialog.scrollTop = 0;
  }
  $$("dialog").forEach((dialog) => {
    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      const opener = dialog._opener;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      else { $("#deals-title").tabIndex = -1; $("#deals-title").focus({ preventScroll: true }); }
    });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = $$('button:not(:disabled),a[href],input,select,[tabindex="0"]', dialog).filter((element) => element.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  });
  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-open],[data-save],[data-info],[data-type],[data-region],[data-preset]");
    if (!control) return;
    event.preventDefault();
    if (control.hasAttribute("data-open")) openDeal(control.dataset.open, control.hasAttribute("data-flash"), control);
    else if (control.hasAttribute("data-save")) {
      const id = control.dataset.save;
      if (saved.has(id)) saved.delete(id); else saved.add(id);
      writeStore("saved", [...saved]);
      if (state.saved) renderResults(); else updateSaved();
      toast(`${saved.has(id) ? "Saved for your next escape." : "Removed from saved deals."}${storageAvailable ? "" : " Storage unavailable; this tab only."}`);
    } else if (control.hasAttribute("data-info")) openInfo(control.dataset.info);
    else if (control.hasAttribute("data-type")) filterBy("type", control.dataset.type);
    else if (control.hasAttribute("data-region")) filterBy("region", control.dataset.region);
    else if (control.hasAttribute("data-preset")) filterBy(control.dataset.preset === "last" ? "last" : "short", true);
  });
  function closeMenu() {
    $("#mobile-menu").hidden = true;
    $("#menu-toggle").setAttribute("aria-expanded", "false");
    $("#menu-toggle").setAttribute("aria-label", "Open menu");
  }
  $("#menu-toggle").addEventListener("click", () => {
    const open = $("#mobile-menu").hidden;
    $("#mobile-menu").hidden = !open;
    $("#menu-toggle").setAttribute("aria-expanded", String(open));
    $("#menu-toggle").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  $("#mobile-menu").addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$("#mobile-menu").hidden) { closeMenu(); $("#menu-toggle").focus(); }
  });
  function toggleFilters(open) {
    $("#filter-shell").classList.toggle("expanded", open);
    $("#filter-toggle").setAttribute("aria-expanded", String(open));
  }
  $("#filter-toggle").addEventListener("click", () => toggleFilters(!$("#filter-shell").classList.contains("expanded")));
  $("#mobile-filter").addEventListener("click", () => {
    closeMenu();
    toggleFilters(true);
    $("#filter-shell").scrollIntoView({ behavior: "instant", block: "start" });
    $("#filter-type").focus({ preventScroll: true });
  });
  $("#alert-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const destination = form.elements.destination.value.trim();
    if (destination.length < 2) {
      form.elements.destination.setCustomValidity("Enter at least two non-space characters.");
      form.elements.destination.reportValidity();
      return;
    }
    $("#alert-feedback").textContent = `Demo alert checked: ${destination}, up to ${money(Number(form.elements.price.value))} per person. No alert was created; your email was not sent or stored.`;
    form.reset();
  });
  $("#alert-form input[name=destination]").addEventListener("input", (event) => event.target.setCustomValidity(""));
  $("#newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#newsletter-feedback").textContent = "You're all set to explore the demo. No subscription was created, and your email was not sent or stored.";
    event.target.reset();
  });
  $("#flash-track").innerHTML = flashes.map((flash) => {
    const deal = byId.get(flash.id);
    return `<article class="flash-card" data-flash-id="${flash.id}"><div class="flash-card-top">${icon(typeIcon[deal.type])}<span class="flash-save">SAVE ${flash.percent}%</span></div><h3>${flash.title}</h3><p class="flash-subtitle">${flash.subtitle}</p><div class="flash-price"><strong>${money(deal.price)}</strong><del>${money(deal.oldPrice)}</del><small>/person</small></div><div class="flash-end"><span>${icon("Clock")}Ends in <span class="countdown"></span></span>${flash.id === "tokyo" ? '<span class="almost-gone">Almost gone!*</span>' : ""}</div><button class="button button-orange" data-open="${flash.id}" data-flash>Book now · demo${icon("ArrowUpRight")}</button></article>`;
  }).join("");
  function tick() {
    const left = [];
    for (const flash of flashes) {
      const seconds = remaining(flash);
      const card = $(`[data-flash-id="${flash.id}"]`);
      const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
      const remainder = String(seconds % 60).padStart(2, "0");
      $(".countdown", card).textContent = seconds ? `${hours}h ${minutes}m ${remainder}s` : "Expired";
      $(".button", card).disabled = seconds === 0;
      card.dataset.expired = String(seconds === 0);
      if (seconds > 0) left.push(seconds);
    }
    const minimum = Math.min(...left);
    $("#master-countdown").textContent = left.length ? `${String(Math.floor(minimum / 3600)).padStart(2, "0")}:${String(Math.floor(minimum % 3600 / 60)).padStart(2, "0")}:${String(minimum % 60).padStart(2, "0")}` : "All ended";
  }
  tick();
  setInterval(tick, 1000);
  const track = $("#flash-track");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = matchMedia("(min-width: 1001px)");
  let autoplay = desktop.matches && !reduced.matches;
  function updatePlay() {
    $("#flash-play").setAttribute("aria-pressed", String(autoplay));
    $("#flash-play").setAttribute("aria-label", `${autoplay ? "Pause" : "Play"} automatic flash carousel`);
    $("#flash-play").innerHTML = icon(autoplay ? "Pause" : "Play");
  }
  function moveFlash(direction) {
    const step = $(".flash-card", track).getBoundingClientRect().width + (innerWidth <= 720 ? 12 : 16);
    const maximum = track.scrollWidth - track.clientWidth;
    const next = direction > 0 && track.scrollLeft >= maximum - 2 ? 0
      : direction < 0 && track.scrollLeft <= 1 ? maximum : track.scrollLeft + step * direction;
    track.scrollTo({ left: Math.max(0, next), behavior: reduced.matches ? "instant" : "smooth" });
  }
  $("#flash-next").addEventListener("click", () => { autoplay = false; updatePlay(); moveFlash(1); });
  $("#flash-prev").addEventListener("click", () => { autoplay = false; updatePlay(); moveFlash(-1); });
  $("#flash-play").addEventListener("click", () => { autoplay = !autoplay; updatePlay(); });
  reduced.addEventListener("change", () => { if (reduced.matches) { autoplay = false; updatePlay(); } });
  desktop.addEventListener("change", () => { if (!desktop.matches) { autoplay = false; updatePlay(); } closeMenu(); });
  setInterval(() => {
    const rect = track.getBoundingClientRect();
    if (autoplay && desktop.matches && !document.hidden && !track.matches(":hover") && !$(".flash-controls").contains(document.activeElement)
      && !track.contains(document.activeElement) && !document.querySelector("dialog[open]") && rect.top < innerHeight && rect.bottom > 0) moveFlash(1);
  }, 6000);
  track.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    autoplay = false;
    updatePlay();
    moveFlash(event.key === "ArrowRight" ? 1 : -1);
  });
  updatePlay();
  renderResults();
  renderHistory();
})();
