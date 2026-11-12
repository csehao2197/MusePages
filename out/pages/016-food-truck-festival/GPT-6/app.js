const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = (name, extra = "") => `<svg class="icon ${extra}" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const vendors = [
  { name: "Taco Libre", cuisine: "Mexican", filters: ["Mexican"], menu: "Wood-fired birria tacos, elote, churros", zone: "A", image: "tacos", alt: "Illustrative vegetable tacos with chickpeas and lime, not birria", badge: "Fan Favorite" },
  { name: "Bao Down", cuisine: "Asian Fusion", filters: ["Asian", "Fusion"], menu: "Steamed bao buns, kimchi fries, matcha soft serve", zone: "B", image: "bao", alt: "Sauced bao buns in a bamboo steamer" },
  { name: "Holy Smoke BBQ", cuisine: "BBQ", filters: ["BBQ"], menu: "14-hour brisket, pulled pork mac & cheese, cornbread", zone: "A", image: "bbq", alt: "A cook slicing smoked brisket on a wooden board", badge: "New This Year" },
  { name: "Green Machine", cuisine: "Vegan", filters: ["Vegan"], menu: "Jackfruit sliders, cauliflower wings, açaí bowls", zone: "C", image: "vegan", alt: "Illustrative falafel burger with salad, not a jackfruit slider" },
  { name: "Catch of the Day", cuisine: "Seafood", filters: ["Seafood"], menu: "Lobster rolls, fish & chips, clam chowder bowls", zone: "B", image: "lobster", alt: "A lobster roll in a paper basket with potato chips" },
  { name: "Sugar Rush", cuisine: "Desserts", filters: ["Desserts"], menu: "Mini donuts, rolled ice cream, churro sundaes", zone: "C", image: "icecream", alt: "Rolled ice cream topped with coconut" },
  { name: "Naan Stop", cuisine: "Mediterranean", filters: ["Mediterranean"], menu: "Lamb shawarma wraps, falafel plates, halloumi fries", zone: "A", image: "shawarma", alt: "Illustrative chicken shawarma wrap, not lamb" },
  { name: "Umami Lab", cuisine: "Fusion", filters: ["Fusion"], menu: "Ramen burgers, Korean corn dogs, miso caramel popcorn", zone: "B", image: "fusion", alt: "Korean corn dog, one of the featured menu ideas", badge: "Must Try" },
];
let cuisine = "All";
let zone = "";
const dialog = $("#info-dialog");
const mobileNav = $("#mobile-nav");
const navButton = $(".nav-toggle");
function openDialog(title, html) {
  $("#info-title").textContent = title;
  $("#info-content").innerHTML = html;
  dialog.showModal();
  dialog.scrollTop = 0;
}
$(".close", dialog).addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  if (!dialog.open) $("#info-content").replaceChildren();
});
navButton.addEventListener("click", () => {
  mobileNav.showModal();
  navButton.setAttribute("aria-expanded", "true");
});
$(".close", mobileNav).addEventListener("click", () => mobileNav.close());
mobileNav.addEventListener("close", () => navButton.setAttribute("aria-expanded", "false"));
$$("a", mobileNav).forEach((link) => link.addEventListener("click", () => mobileNav.close()));
window.matchMedia("(min-width: 951px)").addEventListener("change", (event) => {
  if (event.matches && mobileNav.open) mobileNav.close();
});
const confetti = $(".confetti");
for (let index = 0; index < 24; index++) {
  const piece = document.createElement("i");
  piece.style.cssText = `--x:${(index * 37 + 5) % 98}%;--y:${(index * 23 + 7) % 92}%;--r:${index * 47}deg;--delay:-${index % 6}s`;
  confetti.append(piece);
}
const cuisines = ["All", "Mexican", "Asian", "BBQ", "Vegan", "Seafood", "Desserts", "Fusion", "Mediterranean"];
$(".cuisine-filters").innerHTML = cuisines.map((name) => `<button type="button" data-cuisine="${name}" aria-pressed="${name === "All"}">${name}</button>`).join("");
function renderVendors() {
  const featured = vendors.filter((vendor) => (cuisine === "All" || vendor.filters.includes(cuisine)) && (!zone || vendor.zone === zone));
  $(".vendor-grid").innerHTML = featured.map((vendor) => `<article class="vendor-card"><div class="vendor-photo"><img loading="lazy" src="assets/${vendor.image}.jpg" alt="${vendor.alt}" width="600" height="450">${vendor.badge ? `<span class="vendor-badge">${vendor.badge}</span>` : ""}</div><div class="vendor-content"><span class="cuisine-badge">${vendor.cuisine}</span><h3>${vendor.name}</h3><p>${vendor.menu}</p><div class="zone-tag">${icon("pin")}Zone ${vendor.zone}${vendor.cuisine === "Vegan" ? icon("leaf", "leaf") : ""}</div><button type="button" class="text-link" data-vendor="${vendors.indexOf(vendor)}" aria-label="Meet ${vendor.name}">Meet the Truck ${icon("right")}</button></div></article>`).join("");
  $("#vendor-count").textContent = `${featured.length} of 8 featured trucks${zone ? ` · Zone ${zone}` : ""}${cuisine !== "All" ? ` · ${cuisine}` : ""}`;
  $(".empty-vendors").hidden = featured.length > 0;
  $(".vendor-grid").hidden = featured.length === 0;
  $(".reset-filters").hidden = cuisine === "All" && !zone;
  $$("[data-cuisine]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.cuisine === cuisine)));
  $$("[data-zone]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.zone === zone)));
}
$(".cuisine-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-cuisine]");
  if (!button) return;
  cuisine = button.dataset.cuisine;
  renderVendors();
});
$(".reset-filters").addEventListener("click", () => {
  cuisine = "All";
  zone = "";
  renderVendors();
  $('[data-cuisine="All"]').focus({ preventScroll: true });
});
$(".vendor-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-vendor]");
  if (!button) return;
  const vendor = vendors[Number(button.dataset.vendor)];
  openDialog(vendor.name, `<div class="vendor-detail"><img src="assets/${vendor.image}.jpg" alt="${vendor.alt}" width="600" height="450"><div><p class="eyebrow rose">${vendor.cuisine} · Zone ${vendor.zone}</p><h3>A little taste of ${vendor.name}.</h3><p>${vendor.menu}.</p><p class="small-note">Fictional featured vendor. Photograph is illustrative, not the actual business or every named dish. Ask a real vendor directly about ingredients and allergens.</p><button class="button" type="button" id="vendor-map">Find Zone ${vendor.zone} ${icon("pin")}</button></div></div>`);
  $("#vendor-map").addEventListener("click", () => {
    dialog.close();
    requestAnimationFrame(() => { $("#map").scrollIntoView(); $(`.map-legend [data-zone="${vendor.zone}"]`).focus({ preventScroll: true }); });
  });
});
const places = [
  { name: "Zone A", sub: "West · Mexican, BBQ, Mediterranean", zone: "A", x: 23, y: 17, type: "zone-a", icon: "utensils" },
  { name: "Zone B", sub: "Center · Asian, Seafood, Fusion", zone: "B", x: 49, y: 19, type: "zone-b", icon: "utensils" },
  { name: "Zone C", sub: "East · Vegan, Desserts, Drinks", zone: "C", x: 71, y: 19, type: "zone-c", icon: "leaf" },
  { name: "Main Stage", sub: "Center lawn · Opening toast, bands and awards", x: 49, y: 63, type: "stage-main", icon: "mic" },
  { name: "Acoustic Stage", sub: "South garden · Folk, kids' cooking and chef panel", x: 26, y: 70, type: "stage-acoustic", icon: "music" },
  { name: "DJ Tent", sub: "North pier · DJ Wasabi, electronic / funk", x: 77, y: 7, type: "stage-dj", icon: "music" },
  { name: "Beer & Cocktail Garden", sub: "Covered garden · 21+ with valid ID", x: 71, y: 63, type: "beer", icon: "beer" },
  { name: "Restrooms", sub: "South path · Includes accessible facilities (concept)", x: 39, y: 78, type: "facility", icon: "restroom" },
  { name: "First Aid", sub: "West gate · Ask the festival team for assistance", x: 16, y: 57, type: "facility", icon: "aid" },
  { name: "ATM 1", sub: "West path · Sample cash machine location", x: 10, y: 37, type: "facility", icon: "cash" },
  { name: "ATM 2", sub: "East path · Sample cash machine location", x: 79, y: 41, type: "facility", icon: "cash" },
  { name: "West Entry", sub: "West gate · Wristbands, entry and bike valet", x: 10, y: 85, type: "facility", icon: "ticket" },
  { name: "East Entry", sub: "East gate · Waterfront entry and assistance", x: 76, y: 85, type: "facility", icon: "ticket" },
];
$(".map-pins").innerHTML = places.map((place, index) => `<button type="button" class="map-pin ${place.type}" style="left:${place.x}%;top:${place.y}%" ${place.zone ? `data-zone="${place.zone}" aria-pressed="false"` : `data-place="${index}"`} aria-label="${place.name}: ${place.sub}">${icon(place.icon)}${place.name}</button>`).join("");
$(".map-list").innerHTML = places.map((place, index) => `<button type="button" ${place.zone ? `data-zone="${place.zone}" aria-pressed="false"` : `data-place="${index}"`}>${icon(place.icon)}<span>${place.name}<small>${place.sub}</small></span></button>`).join("");
document.addEventListener("click", (event) => {
  const zoneButton = event.target.closest("[data-zone]");
  if (zoneButton) {
    zone = zone === zoneButton.dataset.zone ? "" : zoneButton.dataset.zone;
    renderVendors();
    $("#lineup").scrollIntoView();
  }
  const placeButton = event.target.closest("[data-place]");
  if (placeButton) {
    const place = places[Number(placeButton.dataset.place)];
    openDialog(place.name, `<p>${place.sub}.</p><p class="small-note">Illustrated concept position only. This archived festival is not an operational event. Facilities and access require confirmation for any real future event.</p>`);
  }
});
$$("[data-map-view]").forEach((button) => button.addEventListener("click", () => {
  const isMap = button.dataset.mapView === "map";
  $$(".map-toolbar [data-map-view]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  $(".map-viewport").hidden = !isMap;
  $(".map-list").hidden = isMap;
  $(".map-zoom").hidden = !isMap;
}));
$("#map-zoom").addEventListener("click", () => {
  const zoomed = $(".map-canvas").classList.toggle("zoomed");
  $("#map-zoom").setAttribute("aria-pressed", String(zoomed));
  $("#map-zoom").setAttribute("aria-label", zoomed ? "Zoom map out" : "Zoom map");
});
$("#map-reset").addEventListener("click", () => {
  $(".map-canvas").classList.remove("zoomed");
  $("#map-zoom").setAttribute("aria-pressed", "false");
  $("#map-zoom").setAttribute("aria-label", "Zoom map");
  $(".map-viewport").scrollTo({ left: 0, top: 0, behavior: "instant" });
});
renderVendors();
const program = [
  { label: "Friday Jul 25", events: [
    ["4:00 PM", "Gates Open", "All trucks serving. Find your first bite.", "All Zones"],
    ["5:30 PM", "Opening Toast", "A waterfront welcome with the festival MC.", "Main Stage"],
    ["6:00 PM", "The Saucy Peppers", "Live band · High-energy indie rock.", "Main Stage"],
    ["7:30 PM", "The Big Bite Challenge", "12 contestants. 5 minutes. Most tacos wins.", "Main Stage"],
    ["8:30 PM", "DJ Wasabi", "DJ set · Electronic / funk into the evening.", "DJ Tent"],
    ["10:00 PM", "Festival Closes", "That's a wrap. See you for another round.", "All Zones"],
  ] },
  { label: "Saturday Jul 26", events: [
    ["11:00 AM", "Gates Open", "Brunch trucks serving. Start your day delicious.", "All Zones"],
    ["12:00 PM", "Kids Cooking Demo", "Little chefs, big ideas. A family-friendly demo.", "Acoustic Stage"],
    ["1:00 PM", "The Street Food Revolution", "Chef panel · The people changing how we eat.", "Acoustic Stage"],
    ["3:00 PM", "Plantain Kings", "Live band · Latin funk and feel-good grooves.", "Main Stage"],
    ["5:00 PM", "Cocktail Masterclass", "$15 add-on · Sample class, 21+ with valid ID.", "Beer Garden"],
    ["7:00 PM", "Neon Flavor", "Headliner · Portland funk / soul collective.", "Main Stage"],
    ["10:30 PM", "Festival Closes", "Last dance, last bites. Thanks for being here.", "All Zones"],
  ] },
  { label: "Sunday Jul 27", events: [
    ["11:00 AM", "Gates Open", "Brunch service. A slow start, a full plate.", "All Zones"],
    ["12:30 PM", "People's Choice Voting Opens", "Pick your favorite bite and back your truck.", "All Zones"],
    ["2:00 PM", "Rosemary & Thyme", "Acoustic set · Warm harmonies from a folk duo.", "Acoustic Stage"],
    ["4:00 PM", "Awards Ceremony", "Best Truck, Best Dessert, Most Creative, People's Choice.", "Main Stage"],
    ["5:00 PM", "Final Service Hour", "One more favorite. All trucks serving.", "All Zones"],
    ["6:00 PM", "Festival Closes", "Good food. Great company. Until next time.", "All Zones"],
  ] },
];
$(".day-tabs").innerHTML = program.map((day, index) => `<button type="button" id="day-${index}" role="tab" data-day="${index}" aria-selected="${index === 0}" aria-controls="schedule-panel" tabindex="${index === 0 ? 0 : -1}">${day.label}</button>`).join("");
function setDay(index) {
  const day = program[index];
  $$("[data-day]").forEach((button, number) => {
    button.setAttribute("aria-selected", String(number === index));
    button.tabIndex = number === index ? 0 : -1;
  });
  $("#schedule-panel").setAttribute("aria-labelledby", `day-${index}`);
  $("#schedule-panel").innerHTML = day.events.map(([time, title, description, location]) => `<article class="timeline-row"><time>${time}</time><div><h3>${title}</h3><p>${description}</p></div><span class="location-badge">${location}</span></article>`).join("");
}
$(".day-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (button) setDay(Number(button.dataset.day));
});
$(".day-tabs").addEventListener("keydown", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const index = Number(button.dataset.day);
  const next = event.key === "Home" ? 0 : event.key === "End" ? 2 : (index + (event.key === "ArrowRight" ? 1 : 2)) % 3;
  setDay(next);
  $(`#day-${next}`).focus();
});
setDay(0);
const passTypes = { day: { name: "Day Pass", price: 15 }, weekend: { name: "Weekend Pass", price: 35 }, vip: { name: "VIP Experience", price: 89 } };
const money = (amount) => amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
function ticketPlanner(type) {
  openDialog("A weekend worth planning.", `<p>This is an archived event concept, not a ticket sale. Use this local sample estimate to compare passes. Original dates: July 25–27, 2026 (actual calendar: Saturday–Monday).</p><form class="dialog-form ticket-preview" id="ticket-form"><div class="form-row"><label>Pass type<select name="pass">${Object.entries(passTypes).map(([key, pass]) => `<option value="${key}" ${key === type ? "selected" : ""}>${pass.name} — $${pass.price}</option>`).join("")}</select></label><label>Paid guests<input name="quantity" type="number" min="1" max="20" step="1" value="1" required></label></div><p class="small-note">Sample planner limit: 1–20 paid guests. Children under 10 enter free with an adult; exclude them from paid quantity. No availability is implied.</p><label id="ticket-day-label">Single day<select name="day"><option value="2026-07-25">July 25, 2026 — Saturday</option><option value="2026-07-26">July 26, 2026 — Sunday</option><option value="2026-07-27">July 27, 2026 — Monday</option></select></label><label>Group code<input name="code" maxlength="20" placeholder="CREW20 for groups of 8+"></label><p class="coupon-status" role="status"></p><dl class="ticket-summary" aria-live="polite"></dl><button class="button" type="submit">Preview My Festival Plan ${icon("right")}</button><p class="small-note">Food is sold separately in the concept. Original Saturday cocktail class: $15 add-on per attendee, 21+ with valid ID; excluded from this admission-only estimate. VIP arrival drink also requires valid ID for alcohol.</p></form>`);
  const form = $("#ticket-form");
  let total = 0;
  function update() {
    const pass = passTypes[form.elements.pass.value];
    const input = form.elements.quantity;
    const quantity = input.validity.valid ? Number(input.value) : 0;
    const subtotal = pass.price * quantity;
    const code = form.elements.code.value.trim().toUpperCase();
    const discount = code === "CREW20" && quantity >= 8 ? subtotal * .2 : 0;
    total = subtotal - discount;
    $("#ticket-day-label").hidden = form.elements.pass.value !== "day";
    form.elements.day.disabled = form.elements.pass.value !== "day";
    $(".coupon-status").textContent = !code ? "Groups of 8+ save 20% with CREW20." : code !== "CREW20" ? "Code not recognized. This demo supports CREW20." : quantity < 8 ? "CREW20 needs at least 8 paid guests." : "CREW20 applied — 20% off admission.";
    $(".ticket-summary").innerHTML = `<div><dt>${pass.name} × ${quantity || "—"}</dt><dd>${money(subtotal)}</dd></div><div><dt>Group savings</dt><dd>−${money(discount)}</dd></div><div><dt>Estimated admission total</dt><dd>${quantity ? money(total) : "Enter 1–20 whole guests"}</dd></div>`;
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    update();
    const pass = passTypes[form.elements.pass.value];
    const result = document.createElement("div");
    result.className = "result";
    result.setAttribute("role", "status");
    const heading = document.createElement("h3");
    heading.textContent = "Your sample festival plan";
    const text = document.createElement("p");
    text.textContent = `${pass.name} · ${form.elements.quantity.value} paid guests · ${money(total)} estimated admission. ${form.elements.pass.value === "day" ? form.elements.day.selectedOptions[0].textContent : "All three original dates, July 25–27, 2026."} No ticket issued, reservation made or payment taken. Dates are past and the source weekday labels conflict with the calendar.`;
    result.append(heading, text);
    form.replaceWith(result);
  });
  update();
}
$$("[data-ticket]").forEach((button) => button.addEventListener("click", () => ticketPlanner(button.dataset.ticket)));
const artists = [
  { name: "Neon Flavor", badge: "HEADLINER · SAT 7:00 PM", image: "neon", alt: "Illustrative three-piece band playing guitar, keyboards and drums beneath string lights", description: "Portland's own funk & soul collective. Think Vulfpeck meets Anderson .Paak." },
  { name: "The Saucy Peppers", badge: "FRIDAY · 6:00 PM", image: "peppers", alt: "Illustrative rock performance with bass guitarist and vocalist", description: "High-energy indie rock with a splash of ska. Guaranteed dancing." },
  { name: "Rosemary & Thyme", badge: "SUNDAY · 2:00 PM", image: "folk", alt: "Illustrative acoustic duo portrait with a wooden guitar", description: "Husband-wife folk duo. Warm harmonies, heartfelt originals." },
];
$(".artist-grid").innerHTML = artists.map((artist, index) => `<article class="artist-card"><div class="artist-photo"><img src="assets/${artist.image}.jpg" alt="${artist.alt}" width="800" height="600" loading="lazy"><span>${artist.badge}</span></div><div class="artist-copy"><h3>${artist.name}</h3><p>${artist.description}</p><div class="audio-player"><button type="button" data-audio="${index}" aria-label="Play ${artist.name} demo loop" aria-pressed="false">${icon("play")}</button><div><strong>Original demo loop</strong><span>Not artist audio · Local preview</span></div><span class="audio-time">0:08</span><audio id="audio-${index}" src="assets/loop-${index}.wav" preload="none"></audio></div></div></article>`).join("");
const audioPlayers = $$("audio");
function showAudioState(index, playing) {
  const button = $(`[data-audio="${index}"]`);
  button.setAttribute("aria-pressed", String(playing));
  button.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${artists[index].name} demo loop`);
  button.innerHTML = icon(playing ? "pause" : "play");
}
audioPlayers.forEach((audio, index) => {
  audio.addEventListener("play", () => showAudioState(index, true));
  audio.addEventListener("pause", () => showAudioState(index, false));
  audio.addEventListener("ended", () => { audio.currentTime = 0; showAudioState(index, false); });
  audio.addEventListener("timeupdate", () => {
    $(".audio-time", audio.parentElement).textContent = `0:${String(Math.max(0, Math.ceil(8 - audio.currentTime))).padStart(2, "0")}`;
  });
  $(`[data-audio="${index}"]`).addEventListener("click", async () => {
    if (!audio.paused) { audio.pause(); return; }
    audioPlayers.forEach((other) => { if (other !== audio) other.pause(); });
    try { await audio.play(); }
    catch { $(".audio-time", audio.parentElement).textContent = "Unavailable"; showAudioState(index, false); }
  });
});
document.addEventListener("visibilitychange", () => { if (document.hidden) audioPlayers.forEach((audio) => audio.pause()); });
const faqs = [
  ["Can I bring my dog?", "Yes! StreetBite Fest is dog-friendly. Please keep dogs leashed and clean up after them. Water stations are available in each zone."],
  ["Is there parking?", "Limited street parking available. We recommend biking, MAX Light Rail (Yamhill District stop), or rideshare. Bike valet is free!"],
  ["Can I use cards or is it cash only?", "All trucks accept cards and mobile pay. A few also take cash. Two ATMs are on-site."],
  ["Are there vegetarian/vegan options?", "Absolutely! Zone C features dedicated vegan trucks, and most other trucks have at least one plant-based option. Look for the green leaf icon."],
  ["What if it rains?", "Rain or shine! This is Portland, after all. Covered seating is available in the VIP and Beer Garden areas. We recommend layers."],
  ["Can I buy tickets at the door?", "Yes, if not sold out. Door prices are $5 more per tier. We strongly recommend buying online."],
  ["Is the festival accessible?", "Yes. All pathways are ADA accessible. Accessible parking and restrooms available. Contact us for specific accommodation needs."],
  ["What are the age restrictions?", "All ages welcome! Kids under 10 are free. The Beer & Cocktail Garden is 21+ with valid ID."],
];
$(".faq-items").innerHTML = faqs.map(([question, answer]) => `<details><summary>${question}${icon("down")}</summary><p>${answer}</p></details>`).join("") + '<p class="small-note" style="margin-top:20px">Original concept FAQ, not confirmed operational guidance. This archived page is not selling tickets or guaranteeing venue facilities.</p>';
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $("#newsletter-status").textContent = "You're on the local preview list! No email was stored, transmitted or subscribed. A real newsletter service is not connected.";
  event.currentTarget.reset();
});
function localForm(kind) {
  const labels = { vendor: "Vendor application preview", sponsor: "Sponsorship enquiry preview", volunteer: "Volunteer interest preview", contact: "Contact message preview" };
  openDialog(labels[kind], `<p>Try a local ${kind === "contact" ? "message" : "interest"} preview. Nothing is submitted, stored, emailed or reserved.</p><form class="dialog-form" id="interest-form"><div class="form-row"><label>Your name<input name="name" required maxlength="100" autocomplete="off"></label><label>Email<input name="email" type="email" required maxlength="150" autocomplete="off"></label></div>${kind === "vendor" ? '<label>Truck name & cuisine<input name="organization" required maxlength="150"></label><label>Space & power needs<input name="needs" required maxlength="200" placeholder="Example: 20 ft truck, 30 A power"></label>' : kind === "sponsor" ? '<label>Organization<input name="organization" required maxlength="150"></label><label>Partnership level<select name="level"><option>Presenting</option><option>Gold</option><option>Silver</option><option>Community</option></select></label>' : kind === "volunteer" ? '<label>Area of interest<select name="area"><option>Welcome & wristbands</option><option>Bike valet</option><option>Green team</option><option>Stage support</option></select></label>' : ""}<label>${kind === "contact" ? "Your message" : "Tell us a little more"}<textarea name="message" maxlength="1000" required></textarea></label><button class="button" type="submit">Preview ${kind === "contact" ? "Message" : "Interest"} ${icon("right")}</button><p class="small-note">Fictional event · Temporary browser-only preview · Closing removes the form</p></form>`);
  const form = $("#interest-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const result = document.createElement("div");
    result.className = "result";
    result.setAttribute("role", "status");
    const title = document.createElement("h3");
    title.textContent = "Your local preview";
    const text = document.createElement("p");
    text.textContent = `${form.elements.name.value.trim()}: ${form.elements.message.value.trim()}`;
    const note = document.createElement("p");
    note.textContent = "No submission or subscription was made. This preview disappears when you close the dialog.";
    form.reset();
    result.append(title, text, note);
    form.replaceWith(result);
  });
}
function lineupDialog() {
  openDialog("So many ways to bite.", '<p>The supplied concept names eight featured trucks. The advertised 50+ complete lineup has not been supplied; the remaining names are unannounced, not invented here.</p><div class="form-row"><label>Search featured trucks<input id="lineup-search" type="search" placeholder="Truck, food or zone"></label><label>Cuisine<select id="lineup-cuisine"></select></label></div><p id="directory-count" role="status"></p><div class="dialog-list" id="directory"></div>');
  $("#lineup-cuisine").innerHTML = cuisines.map((name) => `<option>${name}</option>`).join("");
  function update() {
    const query = $("#lineup-search").value.trim().toLocaleLowerCase();
    const selected = $("#lineup-cuisine").value;
    const matches = vendors.filter((vendor) => (selected === "All" || vendor.filters.includes(selected)) && `${vendor.name} ${vendor.cuisine} ${vendor.menu} Zone ${vendor.zone}`.toLocaleLowerCase().includes(query));
    $("#directory-count").textContent = `${matches.length} featured trucks found`;
    $("#directory").innerHTML = matches.map((vendor) => `<article><h3>${vendor.name}</h3><p>${vendor.cuisine} · Zone ${vendor.zone}<br>${vendor.menu}</p></article>`).join("");
  }
  $("#lineup-search").addEventListener("input", update);
  $("#lineup-cuisine").addEventListener("change", update);
  update();
}
const information = {
  past: ["A little festival history.", "<p>The concept calls this the third annual StreetBite Fest and describes last year's sell-out, 12,000+ attendees and a 4.8 Google rating. These are unverified fictional claims; there is no verified past-years archive or review source.</p><p>Explore the current supplied program and original eight vendors instead.</p>"],
  cuisine: ["Follow your appetite.", `<div class="dialog-list">${vendors.map((vendor) => `<article><h3>${vendor.cuisine}</h3><p>${vendor.name} · Zone ${vendor.zone}<br>${vendor.menu}</p></article>`).join("")}</div><p class="small-note">Concept menus, not live food availability.</p>`],
  beer: ["A little sip of summer.", "<p>Beer & Cocktail Garden · 21+ with valid ID. The original concept includes covered seating and a $15 cocktail masterclass on its supplied Saturday program.</p><div class=\"dialog-list\"><article><h3>Sample garden menu</h3><p>Local lager, pale ale, seasonal spritz and alcohol-free citrus fizz. Illustrative suggestions only; brands, prices and allergens are unannounced. Water stations are planned in each zone.</p></article></div><p>VIP includes a concept arrival drink. Alcohol always requires age and ID checks in a real event; no alcohol sale or order is available here.</p>"],
  dietary: ["Every appetite belongs.", "<p>Start in Zone C with Green Machine's jackfruit sliders, cauliflower wings and açaí bowls. The green leaf identifies its dedicated vegan concept menu.</p><p>Other featured plant-based ideas include falafel at Naan Stop, elote at Taco Libre and bao options at Bao Down. Ingredients, dairy, preparation and shared equipment are unconfirmed. Always ask a real vendor about allergens; this page cannot guarantee dietary safety.</p>"],
  press: ["The story behind the bites.", '<p>StreetBite Fest · Portland, Oregon · Tom McCall Waterfront Park · Original dates: July 25–27, 2026. A fictional community festival by Portland Street Food Collective, celebrating street food, local sounds and a shared waterfront.</p><p>This is a design concept, not a verified press release. Source weekday labels conflict with the 2026 calendar. Artist and sponsor affiliations are not verified.</p><p><a class="text-link" href="assets/festival-map.pdf" download>Download the original concept map PDF</a></p><p><a class="text-link" href="assets/taco.svg" download>Download original taco illustration</a></p><p class="small-note">Photography belongs to the credited creators, not the fictional festival. Asset sources and licenses accompany the generated page.</p>'],
  directions: ["Meet us by the water.", "<p>Concept venue: Tom McCall Waterfront Park, Portland, OR. The supplied transit suggestion is MAX Light Rail, Yamhill District stop. Check current TriMet service for a real trip; no transport or event status has been verified.</p><p>Original plans include limited street parking, free bike valet at the west gate and rideshare drop-offs. Cycling or public transit is recommended over driving.</p><p><a class=\"text-link\" href=\"https://www.google.com/maps/search/?api=1&amp;query=Tom+McCall+Waterfront+Park+Portland+Oregon\" target=\"_blank\" rel=\"noopener noreferrer\">Open Google Maps search (external)</a></p>"],
  accessibility: ["A festival for everybody.", "<p>The supplied concept plans ADA pathways, accessible parking and restrooms, shaded VIP seating and covered garden seating. The schematic map is not a surveyed or certified accessibility plan.</p><p>For a real future event, confirm path surfaces, seating, stage sightlines, service animal policies and any accommodation needs directly with its organizer before travelling. Use the local Contact preview to explore that message flow.</p>"],
  terms: ["A good time, honestly.", "<p>This website is a fictional, archived festival concept. Dates are past. Prices, quantities, facilities, performers and sponsors are illustrative; no admission, stock, event or partnership is guaranteed.</p><p>The local ticket planner issues no tickets, accepts no payment and creates no reservation or contract. Menus and dietary guidance require verification with real vendors. Sponsor names remain their owners' property. External map searches follow their providers' terms.</p>"],
  privacy: ["A small digital footprint.", "<p>All forms and ticket calculations run in this browser. The page uses no analytics, cookies, local storage, database or submission endpoint. Fields are cleared after previews; closing removes dialog content. Newsletter details are never saved or sent.</p><p>Images, fonts, icons and original audio are served locally. Hosting still receives ordinary resource requests. Google Maps opens only if you explicitly select its external link, under Google's privacy policy.</p>"],
};
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-info]");
  if (!button) return;
  const name = button.dataset.info;
  if (["vendor", "sponsor", "volunteer", "contact"].includes(name)) { localForm(name); return; }
  if (name === "full-lineup") { lineupDialog(); return; }
  if (["instagram", "tiktok", "facebook", "twitter"].includes(name)) {
    openDialog(`A taste of ${name[0].toUpperCase() + name.slice(1)}.`, "<p>No verified social profile was supplied. This local preview keeps you here rather than sending you to an unrelated account.</p><p>Sample post: Good food. Great company. Zero regrets. Meet the featured trucks and explore three days of flavor by the waterfront.</p>");
    return;
  }
  const entry = information[name];
  if (entry) openDialog(...entry);
});
