const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const header = $("header");
function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 40); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
const nav = $("#mobile-nav");
const navButton = $(".nav-toggle");
navButton.addEventListener("click", () => { nav.showModal(); navButton.setAttribute("aria-expanded", "true"); });
$(".close", nav).addEventListener("click", () => nav.close());
nav.addEventListener("close", () => navButton.setAttribute("aria-expanded", "false"));
$$("a", nav).forEach((link) => link.addEventListener("click", () => nav.close()));
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches && nav.open) nav.close(); });
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
}), { threshold: .08 });
$$(".reveal").forEach((element) => observer.observe(element));
const dialog = $("#info-dialog");
function openDialog(title, html) {
  $("#info-title").textContent = title;
  $("#info-content").innerHTML = html;
  dialog.showModal();
  dialog.scrollTop = 0;
}
$(".close", dialog).addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => { if (!dialog.open) $("#info-content").replaceChildren(); });
const selections = [
  { name: "Otoro (Bluefin Tuna Belly)", origin: "Wild-caught, Oma, Aomori Prefecture", description: "The pinnacle of tuna. Silky, marbled, and rich — served with aged soy and fresh wasabi.", image: "otoro", alt: "Illustrative tuna nigiri; otoro cut and origin are unverified", badge: "Peak Season" },
  { name: "Uni (Sea Urchin)", origin: "Hokkaido, hand-harvested", description: "Creamy and briny with a sweet finish. Served on warm rice to release the full aroma.", image: "uni", alt: "Golden uni and black caviar on a bite of tuna and rice", badge: "Chef's Choice" },
  { name: "Sakura Masu (Cherry Trout)", origin: "River-caught, Nagano", description: "A spring delicacy with a clean, delicate flavor. Lightly cured and served with yuzu zest.", image: "trout", alt: "Illustrative salmon nigiri, not verified cherry trout or sakura garnish", badge: "Limited" },
];
$$("[data-item]").forEach((button) => button.addEventListener("click", () => {
  const item = selections[Number(button.dataset.item)];
  openDialog(item.name, `<img class="detail-image" src="assets/${item.image}.jpg" alt="${item.alt}" width="1100" height="733"><p class="eyebrow">${item.badge} · Spring 2026</p><p>${item.description}</p><p>${item.origin}.</p><p class="small-note">Archived fictional menu. Origins, cut and season availability are supplied concept copy, not verified sourcing. Photography is illustrative; prices and current availability are unannounced. Ask a real restaurant about ingredients and allergens.</p>`);
}));
const gallery = [
  { name: "The Counter", image: "interior", alt: "Warm pendant lighting and wood detailing in an illustrative Japanese restaurant" },
  { name: "Fire & Precision", image: "aburi", alt: "A chef torching nigiri at a wooden counter" },
  { name: "The Season's Palette", image: "sashimi", alt: "Colorful tuna and salmon sashimi arranged on crushed ice" },
  { name: "A Quiet Pour", image: "sake", alt: "A ceramic tokkuri and sake cup on a stone surface" },
  { name: "Beyond the Noren", image: "entrance", alt: "An illustrative Japanese restaurant entrance with noren and warm lantern light" },
  { name: "A Considered Arrangement", image: "plating", alt: "An illustrative ceramic platter of tuna nigiri and sushi rolls" },
];
$(".gallery-grid").innerHTML = gallery.map((photo, index) => `<figure><button type="button" data-photo="${index}" aria-label="View ${photo.name}"><img src="assets/${photo.image}.jpg" alt="${photo.alt}" loading="lazy" width="1000" height="800"><span class="gallery-overlay">${icon("plus")}<span>${photo.name}</span></span></button></figure>`).join("");
const lightbox = $("#lightbox");
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + gallery.length) % gallery.length;
  const photo = gallery[photoIndex];
  $("#lightbox-image").src = `assets/${photo.image}.jpg`;
  $("#lightbox-image").alt = photo.alt;
  $("#lightbox-caption").textContent = `${photo.name} · Illustrative photograph, not actual Hikari premises`;
}
$$("[data-photo]").forEach((button) => button.addEventListener("click", () => {
  showPhoto(Number(button.dataset.photo));
  lightbox.showModal();
}));
$(".close", lightbox).addEventListener("click", () => lightbox.close());
$('[aria-label="Previous photo"]', lightbox).addEventListener("click", () => showPhoto(photoIndex - 1));
$('[aria-label="Next photo"]', lightbox).addEventListener("click", () => showPhoto(photoIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
});
$$(".stars").forEach((stars, index) => { stars.innerHTML = icon("star").repeat(index === 0 ? 4 : 5); });
function menuDialog(initial = "seasonal") {
  openDialog("A season at the counter.", '<p>Illustrative menus, not live service. Spring 2026 selections are archived. The actual concept calls for daily-changing courses, so no current menu or availability is promised.</p><div class="dialog-tabs" role="group" aria-label="Menu sections"><button type="button" data-menu="seasonal">Seasonal Selection</button><button type="button" data-menu="omakase">Omakase Outline</button><button type="button" data-menu="sake">Sake List</button></div><div class="menu-detail" aria-live="polite"></div>');
  const outline = ["Seasonal vegetable sakizuke", "Chawanmushi", "Market sashimi", "White fish nigiri", "Sakura Masu nigiri", "Scallop nigiri", "Squid nigiri", "Kohada nigiri", "Seasonal shellfish", "Akami nigiri", "Chutoro nigiri", "Otoro nigiri", "Uni on warm rice", "Aburi course", "Anago nigiri", "Hand roll", "House tamago & broth", "Seasonal fruit"];
  function show(section) {
    $$("[data-menu]", dialog).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.menu === section)));
    $(".menu-detail").innerHTML = section === "seasonal" ? selections.map((item) => `<article><h3>${item.name}</h3><p>${item.description}</p><small>${item.origin} · ${item.badge} · Price unannounced</small></article>`).join("") + '<p class="small-note" style="margin-top:22px">À la carte bar pricing is not supplied. Raw or undercooked seafood can increase the risk of foodborne illness. Ask about dietary needs and allergies before ordering.</p>' : section === "omakase" ? `<p>18 courses · 90 minutes · $185 per person. This is an original example outline, not Chef Tanaka's verified daily menu.</p><ol>${outline.map((course) => `<li>${course}</li>`).join("")}</ol><p class="small-note">14 seats per evening in the concept; no live inventory. A minimum 48-hour advance request is required, with one week recommended. Ingredients and substitutions depend on actual service.</p>` : '<p>Sake pairing: +$65 per person with omakase. Four illustrative styles below describe a possible pairing, not a confirmed bottle list.</p><article><h3>Junmai Daiginjo</h3><p>Delicate aromatics, a clean finish. A gentle beginning beside white fish.</p></article><article><h3>Junmai Ginjo</h3><p>Balanced fruit and rice character beside spring nigiri.</p></article><article><h3>Junmai</h3><p>Rounder umami for richer tuna and aburi.</p></article><article><h3>Seasonal Selection</h3><p>A chef-chosen finish. Bottles, vintages and glass prices are unannounced.</p></article><p class="small-note" style="margin-top:22px">21+ with valid ID for alcohol. Pairing is optional; no drinks are sold or ordered here.</p>';
  }
  $$("[data-menu]", dialog).forEach((button) => button.addEventListener("click", () => show(button.dataset.menu)));
  show(initial);
}
const form = $("#reservation-form");
const dateField = form.elements.date;
const timeField = form.elements.time;
const result = $("#reservation-result");
function localDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isOmakase() { return form.elements.preference.value === "omakase"; }
function validateDate() {
  dateField.setCustomValidity("");
  if (!dateField.value || !dateField.validity.valid) return;
  const selected = new Date(`${dateField.value}T${timeField.value}:00`);
  const day = selected.getDay();
  if (day === 0 || day === 1) dateField.setCustomValidity("Hikari is closed Sunday and Monday. Choose Tuesday–Saturday.");
  else if (selected.getTime() < Date.now() + (isOmakase() ? 48 * 60 * 60 * 1000 : 0)) dateField.setCustomValidity(isOmakase() ? "Omakase requires at least 48 hours' advance notice, using your browser's local time." : "Choose a future dinner time, using your browser's local time.");
}
function updateReservation() {
  const omakase = isOmakase();
  const threshold = new Date(Date.now() + (omakase ? 48 * 60 * 60 * 1000 : 0));
  dateField.min = localDate(threshold);
  $$("option", timeField).forEach((option) => { option.disabled = omakase && !["18:00", "20:30"].includes(option.value); });
  if (timeField.selectedOptions[0].disabled) timeField.value = "18:00";
  $(".pairing").hidden = !omakase;
  form.elements.pairing.disabled = !omakase;
  if (!omakase) form.elements.pairing.checked = false;
  const pairing = omakase && form.elements.pairing.checked;
  $(".age-confirmation").hidden = !pairing;
  form.elements.adult.required = pairing;
  form.elements.adult.disabled = !pairing;
  if (!pairing) form.elements.adult.checked = false;
  const guests = Number(form.elements.guests.value);
  $(".form-guidance").textContent = `${omakase ? "18 courses · 90 minutes · 6:00 PM or 8:30 PM only. At least 48 hours ahead; one week recommended." : "À la carte dinner · Tuesday–Saturday. Bar pricing is unannounced."} ${guests >= 6 ? "For a private occasion, explore the separate 6–8 guest enquiry." : ""} Dates and lead time use your browser's local time; venue time zone is unspecified.`;
  $(".estimate").replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = omakase ? `$${((185 + (pairing ? 65 : 0)) * guests).toLocaleString("en-US")} sample total for ${guests} ${guests === 1 ? "guest" : "guests"}` : "À la carte: menu-priced; no estimate supplied";
  $(".estimate").append(strong, document.createElement("br"), "Illustrative dining only; no taxes, gratuity, payment or availability implied.");
  validateDate();
  result.hidden = true;
}
form.addEventListener("input", updateReservation);
form.addEventListener("change", updateReservation);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  validateDate();
  if (!form.reportValidity()) return;
  const omakase = isOmakase();
  const pairing = form.elements.pairing.checked;
  const guests = Number(form.elements.guests.value);
  const heading = document.createElement("h3");
  heading.textContent = "Your local dining preview";
  const detail = document.createElement("p");
  detail.textContent = `${omakase ? "Omakase Counter" : "À La Carte Bar"} · ${dateField.value} at ${timeField.selectedOptions[0].textContent} · ${guests} ${guests === 1 ? "guest" : "guests"}.${omakase ? ` Sample dining total: $${((185 + (pairing ? 65 : 0)) * guests).toLocaleString("en-US")}${pairing ? " including sake pairing (21+ with valid ID)" : ""}.` : " Pricing unannounced."} ${form.elements.requests.value.trim() ? `Special requests: ${form.elements.requests.value.trim()}` : ""}`;
  const note = document.createElement("p");
  note.textContent = "No request was sent, seat reserved, payment taken or confirmation email scheduled. This is a browser-only preview, not live availability.";
  form.reset();
  updateReservation();
  result.replaceChildren(heading, detail, note);
  result.hidden = false;
});
$$("[data-preference]").forEach((link) => link.addEventListener("click", () => {
  form.elements.preference.value = link.dataset.preference;
  updateReservation();
}));
updateReservation();
function privateDialog() {
  openDialog("An evening, just for you.", '<p>Private dining is an original concept for 6–8 guests. Explore a local enquiry preview; capacity, pricing and dates are not live.</p><form class="private-form" id="private-form"><div class="form-row"><label>Your name<input name="name" required maxlength="100" autocomplete="off"></label><label>Email<input name="email" type="email" required maxlength="150" autocomplete="off"></label></div><div class="form-row"><label>Guests (6–8)<input name="guests" type="number" min="6" max="8" step="1" value="6" required></label><label>Occasion<input name="occasion" required maxlength="120"></label></div><label>Your note<textarea name="message" maxlength="800" required></textarea></label><button class="button" type="submit">Preview Enquiry '+icon("arrow")+'</button><p class="small-note">Temporary local preview · No message delivery, storage or reservation</p></form>');
  const privateForm = $("#private-form");
  privateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!privateForm.reportValidity()) return;
    const preview = document.createElement("div");
    preview.className = "result";
    preview.setAttribute("role", "status");
    const heading = document.createElement("h3");
    heading.textContent = "Your private dining preview";
    const message = document.createElement("p");
    message.textContent = `${privateForm.elements.name.value.trim()} · ${privateForm.elements.guests.value} guests · ${privateForm.elements.occasion.value.trim()}. ${privateForm.elements.message.value.trim()}`;
    const note = document.createElement("p");
    note.textContent = "No enquiry was submitted. Contact details were cleared; closing removes this temporary preview.";
    privateForm.reset();
    preview.append(heading, message, note);
    privateForm.replaceWith(preview);
  });
}
const info = {
  parking: ["A quieter arrival.", "<p>The supplied concept includes validated parking at Pine Street Garage. Rates, opening hours, validation rules and an exact city are not provided or verified.</p><p>Confirm the actual garage and venue before travelling. The illustrated map is a local schematic, not navigation or a parking booking.</p>"],
  accessibility: ["Hospitality for every guest.", "<p>No verified access survey or accommodation policy was supplied. The fourteen-seat counter concept does not establish step-free access, counter height, accessible restrooms or parking.</p><p>Before any real visit, confirm those needs and dietary accommodations with the real venue. The private enquiry preview can demonstrate a message, but sends nothing.</p>"],
  directions: ["Find Hikari.", "<p>Original address: 428 Pine Street, Suite B, Downtown. Original transit note: two blocks from Central Station (Blue Line). Validated parking at Pine Street Garage.</p><p>The city and country were not specified. We use an original schematic instead of embedding a misleading geocoded map. Confirm a real location before arranging travel; this is a fictional restaurant concept.</p>"],
  privacy: ["A considered digital footprint.", "<p>All forms run locally in your browser. This page uses no analytics, cookies, local storage, database or submission endpoint. Fields are cleared after previews; closing a dialog removes its temporary form content.</p><p>Images, fonts and icons are local resources. Ordinary HTTP resource requests still reach the hosting server. Newsletter previews send no email and create no subscription.</p>"],
};
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-info]");
  if (!button) return;
  const name = button.dataset.info;
  if (name === "menu" || name === "sake") { menuDialog(name === "sake" ? "sake" : "seasonal"); return; }
  if (name === "private") { privateDialog(); return; }
  if (["instagram", "facebook", "google"].includes(name)) {
    openDialog("A glimpse beyond the counter.", `<p>No verified ${name === "google" ? "Google Business listing" : name === "instagram" ? "Instagram account" : "Facebook page"} was supplied. This local information panel avoids linking to an unrelated restaurant.</p><p>Explore the six illustrative gallery photographs and seasonal selection here. Hikari's credentials and press references are fictional concept copy, not verified affiliations.</p>`);
    return;
  }
  if (info[name]) openDialog(...info[name]);
});
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $("#newsletter-status").textContent = "Thank you for exploring Hikari. This local preview sends no email, stores no address and creates no subscription.";
  event.currentTarget.reset();
});
