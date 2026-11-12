const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
function scrollEffects() {
  $("header").classList.toggle("scrolled", scrollY > 40);
  $(".hero-image").style.transform = motion.matches ? "" : `translateY(${Math.min(scrollY * .12, 90)}px)`;
  frame = 0;
}
addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(scrollEffects); }, { passive: true });
motion.addEventListener("change", scrollEffects);
scrollEffects();
const nav = $("#mobile-nav");
const navToggle = $(".nav-toggle");
navToggle.addEventListener("click", () => { nav.showModal(); navToggle.setAttribute("aria-expanded", "true"); });
$(".close", nav).addEventListener("click", () => nav.close());
nav.addEventListener("close", () => navToggle.setAttribute("aria-expanded", "false"));
$$("a", nav).forEach((link) => link.addEventListener("click", () => nav.close()));
matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches && nav.open) nav.close(); });
const dialog = $("#info-dialog");
function openDialog(title, html) {
  $("#info-title").textContent = title;
  $("#info-content").innerHTML = html;
  dialog.showModal();
  $(".close", dialog).focus();
  dialog.scrollTop = 0;
}
$(".close", dialog).addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => { if (!dialog.open) $("#info-content").replaceChildren(); });
const wines = [
  { name: "2021 Château Margaux", region: "Bordeaux, France", type: "Red", notes: "Dark fruit, tobacco, elegant tannins", price: 28, image: "bordeaux" },
  { name: "2022 Penfolds Bin 389", region: "South Australia", type: "Red", notes: "Blackcurrant, chocolate, spice", price: 22, image: "australia" },
  { name: "2023 Cloudy Bay Sauvignon Blanc", region: "Marlborough, NZ", type: "White", notes: "Citrus, passionfruit, mineral finish", price: 18, image: "marlborough" },
];
const money = (value) => `$${value.toFixed(2)}`;
const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
$$("[data-wine]").forEach((button) => button.addEventListener("click", () => {
  const wine = wines[Number(button.dataset.wine)];
  openDialog(wine.name, `<div class="detail-layout"><img src="assets/${wine.image}.svg" alt="Original illustrative bottle silhouette, not the actual producer label"><div><p class="eyebrow">${wine.type} · ${wine.region}</p><h3>A sense of place.</h3><p>${wine.notes}.</p><p class="detail-price">$${wine.price}<small> / glass</small></p><p class="small-note">Original concept price and notes, not verified producer information, availability or an offer to sell. Bottle artwork is an original placeholder; no affiliation implied.</p></div></div>`);
}));
function wineList() {
  openDialog("Find your next favorite.", '<p>The concept describes 200+ wines; only the three supplied selections are listed here. Explore the sample by style, origin, price or tasting note.</p><div class="wine-tools"><label>Search wines<input type="search" id="wine-search" placeholder="Region, producer, tasting note…" autocomplete="off"></label><label>Sort<select id="wine-sort"><option value="curated">Curated order</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div><div class="wine-filter-row" role="group" aria-label="Wine styles"><button type="button" data-style="All" aria-pressed="true">All wines</button><button type="button" data-style="Red" aria-pressed="false">Red</button><button type="button" data-style="White" aria-pressed="false">White</button></div><label class="checkbox"><input type="checkbox" id="happy-preview">Preview happy-hour pricing (Tue–Thu 4–6 PM · 30% off by the glass)</label><p id="wine-count" role="status"></p><div class="wine-results" aria-live="polite"></div><p class="small-note" style="margin-top:22px">Illustrative prices only, excluding any tax or gratuity. Toggle previews the stated offer, not current eligibility. No purchases, inventory or verified vintages.</p>');
  let style = "All";
  function filter() {
    const query = normalize($("#wine-search").value.trim());
    const sorted = wines.filter((wine) => (style === "All" || wine.type === style) && normalize(`${wine.name} ${wine.region} ${wine.notes}`).includes(query)).sort((a, b) => $("#wine-sort").value === "low" ? a.price - b.price : $("#wine-sort").value === "high" ? b.price - a.price : 0);
    $("#wine-count").textContent = `${sorted.length} of 3 supplied wines${$("#happy-preview").checked ? " · Happy-hour price preview" : ""}`;
    $(".wine-results").innerHTML = sorted.length ? sorted.map((wine) => `<article><h3>${wine.name}</h3><p>${wine.region} · ${wine.type}</p><p>${wine.notes}</p><strong>${money(wine.price * ($("#happy-preview").checked ? .7 : 1))}</strong> / glass</article>`).join("") : "<p>No selections match. Clear the search or choose a different style.</p>";
  }
  $$("[data-style]", dialog).forEach((button) => button.addEventListener("click", () => {
    style = button.dataset.style;
    $$("[data-style]", dialog).forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    filter();
  }));
  $("#wine-search").addEventListener("input", filter);
  $("#wine-sort").addEventListener("change", filter);
  $("#happy-preview").addEventListener("change", filter);
  filter();
}
const events = [
  { name: "Old World vs. New World", day: "Sat", date: 12, time: "7:00 PM", price: 65, spots: 8, image: "tasting", description: "Compare two approaches to terroir in a guided tasting. An illustrative conversation across continents." },
  { name: "Italian Wine Masterclass", day: "Fri", date: 18, time: "6:30 PM", price: 85, spots: 12, image: "candles", description: "Explore the character of Italian wine regions with a sommelier-led sample evening." },
  { name: "Blind Tasting Challenge", day: "Sat", date: 26, time: "7:30 PM", price: 45, spots: 20, image: "wine-bar", description: "Follow aroma, texture and taste, with the labels hidden. A playful, illustrative tasting format." },
];
$(".event-grid").innerHTML = events.map((event, index) => `<article class="event-card"><div class="event-photo"><img loading="lazy" src="assets/${event.image}.jpg" alt="Illustrative ${index === 0 ? "table of wine bottles and glasses during a tasting" : index === 1 ? "candlelit wine and cheese table" : "warm stone wine-bar counter with bottles"}" width="1100" height="733"><div class="date-badge"><span>APR</span>${event.date}</div></div><div class="event-copy"><h3>${event.name}</h3><p class="event-meta">${icon("clock")}${event.day}, April ${event.date} · ${event.time}<span>|</span>$${event.price}/person</p><div class="event-bottom"><p><span class="availability-dot" aria-hidden="true"></span>${event.spots} spots left*</p><button class="text-link" type="button" data-event="${index}">Explore tasting ${icon("arrow")}</button></div></div></article>`).join("");
$(".event-grid").insertAdjacentHTML("afterend", '<p class="small-note event-inventory-note" style="margin-top:15px">*Supplied example counts, not real-time availability. Tasting previews do not hold or sell a place.</p>');
function allEvents() {
  openDialog("Make an evening of it.", '<p>Original April programme. No year was supplied; the weekday labels and example availability are preserved, not treated as upcoming live dates.</p><div class="event-list">' + events.map((event, index) => `<article><h3>${event.name}</h3><p>${event.day}, April ${event.date} · ${event.time} · $${event.price}/person</p><p>${event.description}</p><p>${event.spots} spots left in the original sample, unverified.</p><button type="button" class="text-link" data-event="${index}">Preview this tasting ${icon("arrow")}</button></article>`).join("") + "</div>");
}
function localDate(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function booking(type, eventIndex = 0) {
  const privateEvent = type === "private";
  openDialog(privateEvent ? "Gather your favorite people." : "A tasting, imagined.", `<p>${privateEvent ? "Curated 5-wine flight with cheese pairings, private rooms for 8–24 guests and corporate packages. Create an enquiry preview; prices and dates require a real venue." : "Explore a local preview of the original April programme. Year and current availability are unknown. This does not book, hold or sell a place."}</p><form class="local-form" id="booking-form"><div class="form-row"><label>Your name<input name="name" required maxlength="100" autocomplete="off"></label><label>Email address<input name="email" type="email" required maxlength="150" autocomplete="off"></label></div>${privateEvent ? '<div class="form-row"><label>Preferred date<input type="date" name="date" required></label><label>Guests (8–24)<input name="guests" type="number" min="8" max="24" step="1" value="8" required></label></div><label>Occasion<select name="occasion"><option>Private celebration</option><option>Corporate event</option><option>Friends & family</option></select></label>' : `<label>Tasting<select name="event">${events.map((event, index) => `<option value="${index}"${index === eventIndex ? " selected" : ""}>${event.name} · $${event.price}/person</option>`).join("")}</select></label><label>Guests (sample limit, not live seats)<input type="number" name="guests" min="1" max="${events[eventIndex].spots}" step="1" value="2" required></label>`}<label>Anything we should know?<textarea name="message" rows="2" maxlength="800" placeholder="Dietary needs, an occasion, or a question"></textarea></label><label class="checkbox"><input name="adult" type="checkbox" required>I confirm all guests are 21+; valid ID is required.</label><div class="form-estimate" role="status"></div><button type="submit" class="button">Preview ${privateEvent ? "Enquiry" : "Tasting"} ${icon("arrow")}</button><p class="small-note">Browser-only preview · No storage, submission, ticket, reservation or payment</p></form>`);
  const form = $("#booking-form");
  if (privateEvent) form.elements.date.min = localDate(new Date());
  function update() {
    if (privateEvent) {
      form.elements.date.setCustomValidity("");
      if (form.elements.date.value && new Date(`${form.elements.date.value}T12:00:00`).getDay() === 1) form.elements.date.setCustomValidity("Closed Monday. Please choose Tuesday–Sunday.");
      $(".form-estimate").innerHTML = "<strong>Private event pricing on enquiry</strong>8–24 guests · No quote or live availability. Dates use your browser's local calendar.";
    } else {
      const event = events[Number(form.elements.event.value)];
      form.elements.guests.max = String(event.spots);
      $(".form-estimate").innerHTML = `<strong>${money(event.price * Number(form.elements.guests.value))} sample total</strong>${event.day}, April ${event.date} · ${event.time} · Year unspecified. ${event.spots} is a supplied sample limit, not real inventory.`;
    }
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    update();
    if (!form.reportValidity()) return;
    const panel = document.createElement("div");
    panel.className = "preview-result";
    panel.setAttribute("role", "status");
    const heading = document.createElement("h3");
    heading.textContent = "Your local preview";
    const text = document.createElement("p");
    const chosen = privateEvent ? null : events[Number(form.elements.event.value)];
    text.textContent = `${form.elements.name.value.trim()} · ${form.elements.guests.value} guests · ${privateEvent ? `${form.elements.occasion.value}, ${form.elements.date.value}; private pricing unannounced` : `${chosen.name}, ${chosen.day} April ${chosen.date} at ${chosen.time}, year unspecified. Sample total ${money(chosen.price * Number(form.elements.guests.value))}`}. ${form.elements.message.value.trim()}`;
    const note = document.createElement("p");
    note.textContent = "Nothing was submitted, stored, charged or reserved. Contact fields were cleared. Closing removes this temporary preview.";
    form.reset();
    panel.append(heading, text, note);
    form.replaceWith(panel);
  });
  update();
}
const gallery = [
  { name: "One More Glass", image: "bar", alt: "An atmospheric wine bar with glowing menu boards and a guest at the counter" },
  { name: "The Perfect Pairing", image: "cheese", alt: "Cheese and walnuts on a wooden board beside white wine and grapes" },
  { name: "By Candlelight", image: "candles", alt: "A candlelit table with wine and a sharing board, not a brick interior" },
  { name: "A Slower Afternoon", image: "patio", alt: "A sunny outdoor table with wine, grapes and cheese; seating is outside the frame" },
  { name: "A Considered Pour", image: "pour", alt: "A sommelier pouring red wine from a decanter into a glass" },
  { name: "Your Kind of Evening", image: "alcove", alt: "A candle and wine glasses on a set dining table against a wine-cellar backdrop" },
];
$(".gallery-grid").innerHTML = gallery.map((photo, index) => `<figure><button type="button" data-photo="${index}" aria-label="View ${photo.name}"><img src="assets/${photo.image}.jpg" alt="${photo.alt}" loading="lazy" width="1100" height="900"><span class="gallery-overlay"><span>${photo.name}</span>${icon("plus")}</span></button></figure>`).join("");
const lightbox = $("#lightbox");
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + gallery.length) % gallery.length;
  const photo = gallery[photoIndex];
  $("#lightbox-image").src = `assets/${photo.image}.jpg`;
  $("#lightbox-image").alt = photo.alt;
  $("#lightbox-caption").textContent = `${photo.name} · Illustrative stock photograph`;
}
$$("[data-photo]").forEach((button) => button.addEventListener("click", () => { showPhoto(Number(button.dataset.photo)); lightbox.showModal(); }));
$(".close", lightbox).addEventListener("click", () => lightbox.close());
$('[aria-label="Previous photo"]', lightbox).addEventListener("click", () => showPhoto(photoIndex - 1));
$('[aria-label="Next photo"]', lightbox).addEventListener("click", () => showPhoto(photoIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
});
const reviews = [
  ["The sommelier recommendations were spot-on. Best wine bar in the city.", "Sarah M. · Google Review"],
  ["Hosted our anniversary here. The private tasting was unforgettable.", "James & Linda K."],
  ["Incredible selection and the ambiance is unmatched.", "David R. · Yelp"],
];
let reviewIndex = 0;
let paused = false;
let visible = false;
const reviewSection = $(".reviews-section");
$(".review-stars").innerHTML = icon("star").repeat(5);
$("#review-dots").innerHTML = reviews.map((review, index) => `<button type="button" data-review="${index}" aria-label="Show ${review[1].split(" · ")[0]} review"><span></span></button>`).join("");
function showReview(index, manual = false) {
  reviewIndex = (index + reviews.length) % reviews.length;
  $(".review-view").setAttribute("aria-live", manual ? "polite" : "off");
  $("#review-quote").textContent = `“${reviews[reviewIndex][0]}”`;
  $("#review-author").textContent = reviews[reviewIndex][1];
  $$("[data-review]").forEach((button, index) => button.setAttribute("aria-current", String(index === reviewIndex)));
}
$$("[data-review]").forEach((button) => button.addEventListener("click", () => showReview(Number(button.dataset.review), true)));
reviewSection.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  showReview(event.key === "Home" ? 0 : event.key === "End" ? 2 : reviewIndex + (event.key === "ArrowRight" ? 1 : -1), true);
});
let touchOrigin = null;
$(".review-view").addEventListener("touchstart", (event) => {
  touchOrigin = { x: event.touches[0].clientX, y: event.touches[0].clientY };
}, { passive: true });
$(".review-view").addEventListener("touchend", (event) => {
  if (!touchOrigin || !event.changedTouches.length) return;
  const deltaX = event.changedTouches[0].clientX - touchOrigin.x;
  const deltaY = event.changedTouches[0].clientY - touchOrigin.y;
  touchOrigin = null;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) showReview(reviewIndex + (deltaX < 0 ? 1 : -1), true);
}, { passive: true });
$(".review-view").addEventListener("touchcancel", () => { touchOrigin = null; }, { passive: true });
function updatePause() {
  $("#review-pause").disabled = motion.matches;
  $("#review-pause").setAttribute("aria-label", motion.matches ? "Automatic reviews disabled for reduced motion" : paused ? "Resume automatic reviews" : "Pause automatic reviews");
  $("#review-pause").innerHTML = icon(paused || motion.matches ? "play" : "pause");
}
$("#review-pause").addEventListener("click", () => { paused = !paused; updatePause(); });
motion.addEventListener("change", updatePause);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .25 }).observe(reviewSection);
setInterval(() => {
  if (!paused && !motion.matches && visible && !document.hidden && !reviewSection.matches(":hover") && !reviewSection.contains(document.activeElement) && !document.querySelector("dialog[open]")) showReview(reviewIndex + 1);
}, 5000);
showReview(0);
updatePause();
const information = {
  directions: ["Find your way to a good evening.", "<p>Original address: 412 Warehouse Row, Arts District, Downtown. Validated parking in the Warehouse Row garage. These are supplied concept details, not verified directions.</p><p>The city is unspecified. Our original schematic keeps the location illustrative rather than embedding an unrelated Google Map. Confirm the real venue before travelling.</p>"],
  gifts: ["A good evening makes a lovely gift.", "<p>Gift cards would be part of a live Terroir & Vine service. This fictional concept has no card issuer, purchase checkout, redemption system or confirmed terms.</p><p>Explore the three featured wines and local tasting previews here; no credit, gift card or payment is created.</p>"],
  careers: ["Good people. Great hospitality.", "<p>The concept imagines a welcoming sommelier and hospitality team. No actual vacancies, employer or hiring contact has been supplied.</p><p>This panel collects no applications or personal documents. The page is a static design exploration, not a recruiting service.</p>"],
  press: ["A story worth sharing.", "<p>Terroir & Vine is an original fictional wine-bar concept. The supplied guest quotes are illustrative and are not verified coverage or endorsements.</p><p>Photography credits and licenses accompany the source assets. Producer names and named review platforms imply no affiliation.</p>"],
  privacy: ["A little less digital noise.", "<p>Forms generate temporary local text previews. There are no cookies, analytics, local storage, database or submission endpoints. Contact fields are cleared after previews; closing removes temporary dialog content.</p><p>Fonts, images and icons are local files. Normal resource requests reach the host, but no booking, email, subscription or payment is sent by this page.</p>"],
};
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-info],[data-book],[data-event]");
  if (!button) return;
  if (button.dataset.book) { booking(button.dataset.book); return; }
  if (button.dataset.event !== undefined) { booking("tasting", Number(button.dataset.event)); return; }
  const name = button.dataset.info;
  if (name === "wines") { wineList(); return; }
  if (name === "events") { allEvents(); return; }
  if (["instagram", "facebook", "yelp"].includes(name)) {
    openDialog("An invitation, not an endorsement.", `<p>No verified ${name === "yelp" ? "Yelp listing" : name === "instagram" ? "Instagram account" : "Facebook page"} was supplied for this fictional venue. We keep this action local rather than send you to an unrelated business.</p><p>Explore the gallery for atmosphere and the sample tasting programme for inspiration. There is no live social feed.</p>`);
    return;
  }
  if (information[name]) openDialog(...information[name]);
});
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $("#newsletter-status").textContent = "Welcome to the idea of the Vine Club. This local preview sends no email, stores no address and creates no subscription.";
  event.currentTarget.reset();
});
