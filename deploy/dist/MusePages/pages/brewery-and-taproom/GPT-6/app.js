(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const nav = $("#navigation");
  const navToggle = $(".nav-toggle");
  function closeNav() {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
  }
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$("a, button", nav).forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("click", (event) => { if (!$(".site-header").contains(event.target)) closeNav(); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) { closeNav(); navToggle.focus(); }
  });
  matchMedia("(min-width: 1051px)").addEventListener("change", closeNav);
  const day = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" }).format(new Date());
  $("#today-hours").textContent = `Open today: ${["Fri", "Sat"].includes(day) ? "11AM–11PM" : day === "Sun" ? "11AM–8PM" : "12PM–9PM"}`;
  $("#tap-date").textContent = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  $("#tap-date").dateTime = localDate();

  const beers = [
    { name: "Summit Haze", style: "New England IPA", abv: "6.8", ibu: 55, note: "Juicy, tropical, pillowy soft. Citra & Mosaic hops.", family: "hoppy", badge: "NEW" },
    { name: "Blue Ridge Pils", style: "Czech Pilsner", abv: "4.9", ibu: 35, note: "Crisp, clean, noble hops. Our best-seller since day one.", family: "light" },
    { name: "Copper Line", style: "American Amber", abv: "5.4", ibu: 30, note: "Toasty malt, caramel, balanced bitterness.", family: "malty", color: "amber" },
    { name: "Dark Hollow", style: "Oatmeal Stout", abv: "5.8", ibu: 25, note: "Chocolate, coffee, velvet mouthfeel. Nitro pour.", family: "malty", color: "dark" },
    { name: "Trail Dust", style: "West Coast IPA", abv: "7.2", ibu: 65, note: "Piney, resinous, old-school dank. For the hop heads.", family: "hoppy" },
    { name: "Fog Valley", style: "Witbier", abv: "4.6", ibu: 15, note: "Orange peel, coriander, refreshing. Great gateway beer.", family: "light" },
    { name: "Firebreak", style: "Double IPA", abv: "8.5", ibu: 70, note: "Bold, tropical, dangerously smooth for 8.5%.", family: "hoppy", badge: "LIMITED" },
    { name: "Harvest Table", style: "Farmhouse Saison", abv: "6.2", ibu: 22, note: "Peppery, dry, complex. Brewed with local wildflower honey.", family: "wild" },
    { name: "Stone Bridge", style: "Brown Ale", abv: "5.1", ibu: 20, note: "Nutty, toasty, easy-drinking. A chill autumn pint.", family: "malty", color: "amber" },
    { name: "River Sour", style: "Berliner Weisse", abv: "3.8", ibu: 5, note: "Tart, bright, kettle-soured with NC peaches.", family: "wild", badge: "SEASONAL" },
    { name: "Basecamp", style: "Golden Ale", abv: "4.4", ibu: 18, note: "Light, approachable, crushable. The beer for people who don't like beer.", family: "light" },
    { name: "Night Shift", style: "Imperial Stout", abv: "10.2", ibu: 50, note: "Bourbon barrel-aged 6 months. Dark chocolate, vanilla, oak.", family: "malty", color: "dark", badge: "BREWERY ONLY" },
  ];
  $("#tap-list").innerHTML = beers.map((beer) => `<article class="tap-card ${beer.color || beer.family}" data-beer-family="${beer.family}"><div class="beer-top">${icon(beer.family === "hoppy" ? "hop" : beer.family === "light" ? "wheat" : "beer")}${beer.badge ? `<span class="beer-badge">${beer.badge}</span>` : ""}</div><h3>${beer.name}</h3><p class="beer-style">${beer.style}</p><p class="beer-stats"><strong>${beer.abv}<small>% ABV</small></strong><span></span><strong>${beer.ibu}<small>IBU</small></strong></p><p class="tasting-note">${beer.note}</p></article>`).join("");
  $$("[data-family]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-family]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    $$(".tap-card").forEach((card) => { card.hidden = button.dataset.family !== "all" && card.dataset.beerFamily !== button.dataset.family; });
    $("#tap-list").scrollTo({ left: 0, behavior: "instant" });
  }));
  const gallery = $(".taproom-slides");
  const slides = $$("figure", gallery);
  const galleryDots = $$("[data-taproom-slide]");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  function moveGallery(index) {
    if (innerWidth > 650) return;
    gallery.scrollTo({ left: slides[index].offsetLeft - slides[0].offsetLeft, behavior: motion.matches ? "instant" : "smooth" });
  }
  galleryDots.forEach((button) => button.addEventListener("click", () => moveGallery(Number(button.dataset.taproomSlide))));
  gallery.addEventListener("scroll", () => {
    const index = Math.max(0, Math.min(2, Math.round(gallery.scrollLeft / gallery.clientWidth)));
    galleryDots.forEach((button, position) => button.setAttribute("aria-current", String(index === position)));
  }, { passive: true });
  gallery.addEventListener("keydown", (event) => {
    if (innerWidth > 650 || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const current = Math.round(gallery.scrollLeft / gallery.clientWidth);
    moveGallery((current + (event.key === "ArrowRight" ? 1 : 2)) % 3);
  });

  const dialogs = $$("dialog");
  dialogs.forEach((dialog) => {
    $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  const tourDialog = $("#tour-dialog");
  const tourForm = $("#tour-form");
  const tourField = (name) => tourForm.elements.namedItem(name);
  const tourResult = $("#tour-result");
  function validateTourDate() {
    const input = tourField("date");
    input.min = localDate();
    const weekday = input.value ? new Date(`${input.value}T12:00:00`).getDay() : null;
    input.setCustomValidity(!input.value || (tourField("type").value === "vip" ? weekday === 5 : [0, 6].includes(weekday)) ? "" :
      tourField("type").value === "vip" ? "VIP tours run on Fridays. Choose a Friday." : "Standard tours run on Saturdays and Sundays.");
  }
  function tourTotal() {
    const guests = Number(tourField("guests").value);
    $("#tour-total").textContent = Number.isInteger(guests) && guests >= 1 && guests <= 12 ? money(guests * (tourField("type").value === "vip" ? 45 : 15)) : "Choose 1–12 guests";
  }
  function updateTour() {
    const vip = tourField("type").value === "vip";
    $("#tour-schedule").textContent = vip ? "Fridays at 5PM · 90 minutes · Maximum 12 guests" : "Saturdays & Sundays at 1PM or 3PM · 45 minutes";
    tourField("time").innerHTML = vip ? '<option value="17:00">5:00 PM</option>' : '<option value="13:00">1:00 PM</option><option value="15:00">3:00 PM</option>';
    validateTourDate();
    tourTotal();
  }
  function openTour(type) {
    tourForm.reset();
    tourForm.hidden = false;
    tourResult.hidden = true;
    $("#tour-summary").textContent = "";
    tourField("name").setCustomValidity("");
    tourField("type").value = type;
    updateTour();
    tourDialog.showModal();
  }
  tourField("type").addEventListener("change", updateTour);
  tourField("date").addEventListener("input", validateTourDate);
  tourField("guests").addEventListener("input", tourTotal);
  tourField("name").addEventListener("input", () => tourField("name").setCustomValidity(tourField("name").value.trim().length < 2 ? "Enter at least two non-space characters." : ""));
  tourForm.addEventListener("submit", (event) => {
    event.preventDefault();
    validateTourDate();
    if (!tourForm.reportValidity()) return;
    const guests = Number(tourField("guests").value);
    const vip = tourField("type").value === "vip";
    const date = new Date(`${tourField("date").value}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    $("#tour-summary").textContent = `${tourField("name").value.trim()}, your sample ${vip ? "VIP" : "Standard"} tour: ${date}, ${tourField("time").selectedOptions[0].textContent} Asheville time, ${guests} guest${guests === 1 ? "" : "s"}. Total ${money(guests * (vip ? 45 : 15))}.`;
    tourForm.hidden = true;
    tourResult.hidden = false;
    tourForm.reset();
    tourResult.focus();
  });
  $("#tour-again").addEventListener("click", () => {
    tourResult.hidden = true;
    $("#tour-summary").textContent = "";
    tourForm.hidden = false;
    updateTour();
    tourField("type").focus();
  });
  tourDialog.addEventListener("close", () => {
    tourForm.reset();
    $("#tour-summary").textContent = "";
  });

  function nextWeekday(weekday, hour, minute = 0) {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    const delta = (weekday - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + delta);
    if (date <= new Date()) date.setDate(date.getDate() + 7);
    return date;
  }
  function nextAnnual(month, day, hour, minute = 0) {
    const date = new Date(new Date().getFullYear(), month - 1, day, hour, minute);
    if (date <= new Date()) date.setFullYear(date.getFullYear() + 1);
    return date;
  }
  const events = [
    { id: "trivia", title: "Trivia Night", label: "EVERY WEDNESDAY", time: "7PM", note: "Free to play. Win beer.", icon: "brain", date: nextWeekday(3, 19), duration: 120 },
    { id: "music", title: "The Appalachian Drifters", label: "THIS FRIDAY", time: "7:30PM", note: "Bluegrass on the patio. No cover.", icon: "music", date: nextWeekday(5, 19, 30), duration: 120 },
    { id: "dinner", title: "Brewer's Dinner", label: "MARCH 22", time: "6:30PM", note: "5-course beer pairing. $85/person. Limited to 30 seats.", icon: "dining", badge: "ALMOST FULL · DEMO", date: nextAnnual(3, 22, 18, 30), duration: 180 },
    { id: "anniversary", title: "Anniversary Party — Year 4", label: "APRIL 5", time: "12PM–10PM", note: "Rare keg tappings, live music, food trucks. Free entry.", icon: "party", date: nextAnnual(4, 5, 12), duration: 600 },
  ];
  $("#event-list").innerHTML = events.map((event) => `<article class="event-card"><div class="event-top">${icon(event.icon)}${event.badge ? `<span class="beer-badge">${event.badge}</span>` : ""}</div><p class="event-date">${event.label} <span> / ${event.time}</span></p><h3>${event.title}</h3><p>${event.note}</p><button class="event-open" type="button" data-event="${event.id}" aria-label="View ${event.title} event">Event details ${icon("arrow")}</button></article>`).join("");
  function downloadCalendar(event) {
    const zoned = (date) => {
      const fields = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "shortOffset" }).formatToParts(date).map((part) => [part.type, part.value]));
      const match = fields.timeZoneName.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
      const offset = match ? (Number(match[2]) * 60 + Number(match[3] || 0)) * (match[1] === "-" ? -1 : 1) : 0;
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()) - offset * 60000);
    };
    const stamp = (date) => date.toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const escape = (text) => text.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
    const start = zoned(event.date);
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Iron Ridge Demo//Sample Events//EN", "BEGIN:VEVENT",
      `UID:${event.id}-${localDate(event.date)}@ironridge.example`, `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(new Date(start.getTime() + event.duration * 60000))}`, `SUMMARY:${escape(`DEMO: ${event.title}`)}`,
      "DESCRIPTION:Fictional sample only. Not a real event or ticket. No reservation.",
      "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `iron-ridge-${event.id}.ics`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const locations = [
    { name: "Wicked Weed Funkatorium", type: "Bar / Restaurant", city: "Asheville", beers: "Summit Haze, Blue Ridge Pils", x: 34, y: 58 },
    { name: "Tasty Beverage Company", type: "Bottle Shop", city: "Asheville", beers: "Full lineup + cans", x: 45, y: 48 },
    { name: "The Biltmore Wine Bar", type: "Restaurant", city: "Asheville", beers: "Copper Line, Basecamp", x: 48, y: 67 },
    { name: "Highland Brewing Taproom", type: "Cross-tap", city: "Asheville", beers: "Trail Dust", x: 60, y: 57 },
    { name: "Fonta Flora State of Confusion", type: "Bottle Shop", city: "Morganton", beers: "Seasonal releases", x: 78, y: 33 },
    { name: "Burial Beer", type: "Cross-tap", city: "Asheville", beers: "Dark Hollow", x: 35, y: 75 },
    { name: "Green Man Brewery", type: "Cross-tap", city: "Asheville", beers: "Fog Valley", x: 23, y: 65 },
    { name: "Ingles Markets", type: "Grocery", city: "12 WNC locations", beers: "6-packs & variety packs", x: 68, y: 43 },
  ];
  let visibleLocations = locations.map((_, index) => index);
  let selectedLocation = 0;
  function selectLocation(index) {
    selectedLocation = index;
    $$("[data-location]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.location) === index)));
    const location = locations[index];
    $("#map-selected").replaceChildren();
    if (!location) return;
    const name = document.createElement("strong");
    name.textContent = location.name;
    const description = document.createElement("span");
    description.textContent = `${location.type} · ${location.city} · ${location.beers}`;
    $("#map-selected").append(name, description);
  }
  function renderLocations() {
    $("#location-count").textContent = `${visibleLocations.length} sample location${visibleLocations.length === 1 ? "" : "s"}`;
    $("#location-list").innerHTML = visibleLocations.length ? visibleLocations.map((index) => {
      const location = locations[index];
      return `<button type="button" class="location" data-location="${index}" aria-pressed="false"><span class="location-number">${index + 1}</span><span><strong>${location.name}</strong><small>${location.type} · ${location.city}</small><span>${location.beers}</span></span>${icon("arrow")}</button>`;
    }).join("") : '<p class="no-locations">No sample locations for that ZIP. Try 28801 or 28655, or show all.</p>';
    $("#map-pins").innerHTML = visibleLocations.map((index) => `<button type="button" class="map-pin" data-location="${index}" style="left:${locations[index].x}%;top:${locations[index].y}%" aria-label="Select ${locations[index].name} on map" aria-pressed="false"><span><b>${index + 1}</b></span></button>`).join("");
    selectLocation(visibleLocations.includes(selectedLocation) ? selectedLocation : visibleLocations[0]);
  }
  function filterLocations() {
    const zip = $("#zip").value;
    visibleLocations = locations.map((location, index) => {
      if (!zip || location.city === "12 WNC locations" && (/^2880[1-6]$/.test(zip) || zip === "28655")) return index;
      return /^2880[1-6]$/.test(zip) && location.city === "Asheville" || zip === "28655" && location.city === "Morganton" ? index : -1;
    }).filter((index) => index >= 0);
    renderLocations();
  }
  $("#zip-form").addEventListener("submit", (event) => { event.preventDefault(); filterLocations(); });
  $("#zip").addEventListener("input", () => { if ($("#zip").value.length === 5 || !$("#zip").value.length) filterLocations(); });
  $("#reset-locations").addEventListener("click", () => { $("#zip").value = ""; filterLocations(); });
  renderLocations();
  let zoom = 1;
  function updateZoom() {
    $(".map-art").style.transform = `scale(${zoom})`;
    $("#map-in").disabled = zoom >= 1.6;
    $("#map-out").disabled = zoom <= 1;
  }
  $("#map-in").addEventListener("click", () => { zoom = Math.min(1.6, Math.round((zoom + .2) * 10) / 10); updateZoom(); });
  $("#map-out").addEventListener("click", () => { zoom = Math.max(1, Math.round((zoom - .2) * 10) / 10); updateZoom(); });
  updateZoom();

  const products = {
    pack: { title: "Mixed 12-Pack", image: "mixed-pack.svg", price: 36, description: "Summit Haze, Blue Ridge Pils, Copper Line & Basecamp. A sample mixed pack of four favorites.", options: ["Mixed 12-pack"] },
    hoodie: { title: "Flagship Hoodie", image: "hoodie.svg", price: 55, description: "Charcoal heavyweight fleece with an embroidered-style mountain emblem.", options: ["S", "M", "L", "XL", "XXL"] },
    flight: { title: "Tasting Flight Board", image: "flight-board.svg", price: 28, description: "A sample reclaimed brewery oak paddle. Glasses shown for illustration.", options: ["Reclaimed oak"] },
    gift: { title: "Gift Card", image: "gift-card.svg", price: 25, description: "A little mountain spirit for the taproom, tours, or shop. This preview creates no gift credit.", options: ["25", "50", "75", "100"] },
  };
  let productKey = "pack";
  const productForm = $("#product-form");
  const productField = (name) => productForm.elements.namedItem(name);
  function productTotal() {
    const quantity = Number(productField("quantity").value);
    $("#product-total").textContent = Number.isInteger(quantity) && quantity >= 1 && quantity <= 10 ? money(quantity * (productKey === "gift" ? Number(productField("option").value) : products[productKey].price)) : "Choose 1–10";
    $("#product-result").textContent = "";
  }
  function openProduct(key) {
    productKey = key;
    const product = products[key];
    productForm.reset();
    $("#product-title").textContent = product.title;
    $("#product-description").textContent = product.description;
    $("#product-photo").src = `assets/${product.image}`;
    $("#product-photo").alt = `Original illustration of ${product.title}`;
    $("#product-option").replaceChildren(...product.options.map((value) => new Option(key === "gift" ? money(Number(value)) : value, value)));
    productTotal();
    $("#product-dialog").showModal();
  }
  productField("quantity").addEventListener("input", productTotal);
  productField("option").addEventListener("change", productTotal);
  productForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!productForm.reportValidity()) return;
    $("#product-result").textContent = `${productField("quantity").value} × ${products[productKey].title} (${productKey === "gift" ? money(Number(productField("option").value)) : productField("option").value}) — ${$("#product-total").textContent}. Sample preview only: no order placed or payment taken.`;
  });

  const infoDialog = $("#info-dialog");
  const infoContent = $("#info-content");
  const plainInfo = {
    food: ["FROM THE KITCHEN.", "<p>A sample wood-fired kitchen menu, made for sharing.</p><dl class='food-menu'><div><dt>Wood-fired margherita pizza</dt><dd>$16</dd></div><div><dt>Smoked pulled pork plate</dt><dd>$19</dd></div><div><dt>Warm pretzel & beer cheese</dt><dd>$9</dd></div><div><dt>Seasonal roasted vegetables</dt><dd>$11</dd></div></dl><p>Illustrative dishes and prices. Ask a real venue about allergens and dietary needs; this demo takes no food orders.</p>"],
    parking: ["COME ON OVER.", "<p>Sample visitor information: free parking beside the riverside warehouse, with accessible spaces near the main entrance.</p><p>This fictional venue has no verified parking lot. Check your actual destination before travelling.</p>"],
    privacy: ["A LITTLE PRIVACY.", "<p>This static demo has no analytics, accounts, newsletter service, payment processor, or backend. Forms stay in this browser tab and are never transmitted or persisted.</p><p>External Google Maps links leave this site. Optional calendar downloads save a clearly labeled sample event on your device.</p>"],
    terms: ["THE SMALL PRINT.", "<p>Iron Ridge is an imagined brewery, not an operating business. All beers, events, prices, capacity badges, service claims and shop previews are illustrative. No sale, booking, ticket, subscription, or gift credit is created.</p><p>Stock photography does not depict actual founders or this fictional venue. Named stockists are demo data, with no claimed endorsement or distribution relationship. Drink responsibly; 21+.</p>"],
    story: ["FROM GARAGE TO RIDGELINE.", "<p>Three friends, a ten-gallon homebrew rig, and a stubborn belief that the best beer is made with people you like.</p><p>In this imagined story, Iron Ridge opened in 2022 and grew into a 5,000-barrel riverside brewhouse. The mission stayed small-batch at heart: taste every beer, know every ingredient, welcome every neighbor.</p><p>A fictional brand story. Stock photographs illustrate brewing craft rather than actual founders.</p>"],
    instagram: ["INSTAGRAM, IMAGINED.", "<p>Small-batch releases and behind-the-scenes moments would live here. This fictional brand has no connected Instagram account.</p>"],
    facebook: ["FACEBOOK, IMAGINED.", "<p>Gatherings, taproom news, and neighborhood stories would live here. No live Facebook page is connected.</p>"],
    untappd: ["UNTAPPD, IMAGINED.", "<p>This is a local social preview. No live Untappd account, check-in, beer rating, or inventory service is connected.</p>"],
  };
  function showInfo(title, content) {
    $("#info-title").textContent = title;
    infoContent.innerHTML = content;
    infoDialog.showModal();
  }
  function openInfo(key) {
    if (plainInfo[key]) { showInfo(...plainInfo[key]); return; }
    if (key === "shop") {
      showInfo("THE MOUNTAIN GOODS.", `<p>Four favorites, all in one place. Browse a local product preview.</p><div class="catalog-list">${Object.entries(products).map(([id, product]) => `<button type="button" data-catalog-product="${id}"><img src="assets/${product.image}" alt=""><span>${product.title}<small>${id === "gift" ? "$25–$100" : money(product.price)}</small></span>${icon("arrow")}</button>`).join("")}</div><p>Illustrations and sample prices only. No checkout, shipping, or sales.</p>`);
      return;
    }
    if (key === "events") {
      showInfo("WHAT'S HAPPENING.", `<p>A fictional calendar for your next imagined visit.</p><div class="all-events">${events.map((event) => `<button type="button" data-event="${event.id}"><span>${event.title}<small>${event.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · ${event.time} Asheville time</small></span>${icon("arrow")}</button>`).join("")}</div>`);
      return;
    }
    if (key === "distribution" || key === "private") {
      const distribution = key === "distribution";
      showInfo(distribution ? "LET'S SHARE A POUR." : "MAKE IT YOUR GATHERING.", `<p>${distribution ? "Preview an inquiry about carrying Iron Ridge." : "Preview an inquiry about a private taproom gathering."} No message will be sent.</p><form class="contact-form"><label>Full name<input name="name" minlength="2" maxlength="100" autocomplete="name" required></label><label>Email<input name="email" type="email" maxlength="150" autocomplete="email" required></label><label>${distribution ? "Business name" : "Occasion"}<input name="subject" minlength="2" maxlength="150" required></label><label>Tell us more<textarea name="message" rows="3" maxlength="2000" required></textarea></label><button class="button amber full-button" type="submit">Preview inquiry ${icon("arrow")}</button><p class="contact-result" role="status"></p></form>`);
      const form = $(".contact-form", infoContent);
      $$('input:not([type="email"]), textarea', form).forEach((input) => input.addEventListener("input", () => input.setCustomValidity(input.value.trim().length < 2 ? "Enter at least two non-space characters." : "")));
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        $(".contact-result", form).textContent = "Sample inquiry preview complete. No message was sent; no follow-up will arrive.";
        form.reset();
      });
    }
  }
  function openEvent(id) {
    const event = events.find((item) => item.id === id);
    if (infoDialog.open) infoDialog.close();
    showInfo(event.title.toUpperCase(), `<p class="event-dialog-date">${event.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · ${event.time} Asheville time</p><p>${event.note}</p><p>This is a fictional event. Availability badges are illustrative; there are no tickets, seats or reservations.</p><button class="button amber full-button" type="button" data-calendar="${event.id}">Download sample calendar event ${icon("calendar")}</button>`);
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.book) openTour(button.dataset.book);
    else if (button.dataset.product) openProduct(button.dataset.product);
    else if (button.dataset.catalogProduct) { infoDialog.close(); openProduct(button.dataset.catalogProduct); }
    else if (button.dataset.info) openInfo(button.dataset.info);
    else if (button.dataset.event) openEvent(button.dataset.event);
    else if (button.dataset.calendar) downloadCalendar(events.find((item) => item.id === button.dataset.calendar));
    else if (button.dataset.location !== undefined) selectLocation(Number(button.dataset.location));
  });
  $("#newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    $("#newsletter-status").textContent = "You're in the spirit! Demo only: no subscription created and no email sent.";
    event.target.reset();
  });
  const footerMedia = matchMedia("(max-width: 650px)");
  function footerState() { $$(".footer-columns details").forEach((details) => { details.open = !footerMedia.matches; }); }
  footerState();
  footerMedia.addEventListener("change", footerState);
})();
