const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const header = $(".header");
const nav = $("#mobile-nav");
const navToggle = $(".nav-toggle");
navToggle.addEventListener("click", () => { nav.showModal(); navToggle.setAttribute("aria-expanded", "true"); });
$(".close", nav).addEventListener("click", () => nav.close());
nav.addEventListener("close", () => navToggle.setAttribute("aria-expanded", "false"));
$$("a", nav).forEach((link) => link.addEventListener("click", () => nav.close()));

const photos = [
  ["hero.jpg", "A study in balance", "A glossy gourmet dish on a dark marble table"],
  ["dining.jpg", "An intimate evening", "A warmly lit dining room with timber details and hanging lights"],
  ["plating.jpg", "The final, considered touch", "A chef carefully garnishing a dish in an open restaurant kitchen"],
  ["wine.jpg", "A conversation in the glass", "Red wine being poured into a glass at a dinner setting"],
  ["ingredients.jpg", "Before the first course", "Fresh mushrooms, herbs and vegetables being prepared by hand"],
  ["private.jpg", "Set for something special", "A table set with candles, flowers and elegant tableware"],
];
const gallery = $(".editorial-gallery");
photos.forEach(([file, caption, alt], index) => {
  const figure = document.createElement("figure");
  figure.innerHTML = `<button type="button" data-photo="${index}" aria-label="View photograph: ${caption}"><img src="assets/${file}" alt="${alt}" loading="lazy"><span class="photo-caption">${caption}</span></button>`;
  gallery.append(figure);
});
const lightbox = $("#lightbox");
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const [file, caption, alt] = photos[photoIndex];
  $("#photo-large").src = `assets/${file}`;
  $("#photo-large").alt = alt;
  $("#photo-caption").textContent = caption;
}
gallery.addEventListener("click", (event) => {
  const button = event.target.closest("[data-photo]");
  if (!button) return;
  showPhoto(Number(button.dataset.photo));
  lightbox.showModal();
});
$(".photo-previous").addEventListener("click", () => showPhoto(photoIndex - 1));
$(".photo-next").addEventListener("click", () => showPhoto(photoIndex + 1));
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
let frame = 0;
function renderScroll() {
  frame = 0;
  header.classList.toggle("solid", scrollY > 50);
  const viewport = innerHeight;
  for (const image of $$("img", gallery)) {
    const box = image.parentElement.getBoundingClientRect();
    if (box.bottom >= 0 && box.top <= viewport) {
      image.style.setProperty("--shift", `${motion.matches ? 0 : Math.max(-12, Math.min(12, (viewport / 2 - (box.top + box.height / 2)) * .025))}px`);
    }
  }
}
addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(renderScroll); }, { passive: true });
addEventListener("resize", renderScroll);
motion.addEventListener("change", renderScroll);
renderScroll();

const info = $("#info-dialog");
const content = $("#info-content");
function openInfo(title, html) {
  $("#info-title").textContent = title;
  content.innerHTML = html;
  info.showModal();
}
for (const dialog of [info, lightbox]) {
  $(".close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
}
info.addEventListener("close", () => { content.replaceChildren(); });
const wines = [
  { title: "2021 Barolo", producer: "Giacomo Conterno", price: 145, type: "Red", image: "barolo.svg", detail: "Piedmont, Italy · Nebbiolo. An imagined cellar selection to accompany the richness of the main course." },
  { title: "2022 Pouilly-Fumé", producer: "Didier Dagueneau", price: 110, type: "White", image: "pouilly.svg", detail: "Loire Valley, France · Sauvignon Blanc. A concept selection for a mineral, food-focused glass." },
  { title: "2020 Châteauneuf-du-Pape", producer: "Château Rayas", price: 280, type: "Red", image: "rhone.svg", detail: "Southern Rhône, France · Grenache. Presented as a sample reserve-list bottle." },
  { title: "NV Champagne", producer: "Krug Grande Cuvée", price: 320, type: "Sparkling", image: "champagne.svg", detail: "Champagne, France · A sample celebratory selection for the beginning of an evening." },
  { title: "2024 Chablis Premier Cru", producer: "Domaine Raveneau", type: "White", detail: "First course pairing · Hokkaido scallop" },
  { title: "2023 Sancerre Rosé", producer: "Domaine Vacheron", type: "Rosé", detail: "Second course pairing · Roasted beet tartare" },
  { title: "2022 Meursault", producer: "Domaine Roulot", type: "White", detail: "Fish course pairing · Wild turbot" },
  { title: "2021 Chambolle-Musigny", producer: "Domaine Roumier", type: "Red", detail: "Main course pairing · Dry-aged duck" },
  { title: "2020 Banyuls", producer: "Domaine de la Rectorie", type: "Sweet", detail: "Dessert pairing · Dark chocolate soufflé" },
];
$$("[data-bottle]").forEach((button) => button.addEventListener("click", () => {
  const wine = wines[Number(button.dataset.bottle)];
  openInfo(wine.title, `<div class="wine-detail"><img src="assets/${wine.image}" alt="Original illustrative bottle silhouette"><div><h3>${wine.producer}</h3><p>${wine.detail}</p><p class="price">${money(wine.price)}</p><p class="disclaimer">Illustrative concept pricing and artwork, not a current offer or actual producer label. No wine is sold through this page.</p></div></div>`);
}));
function wineList() {
  openInfo("The Wine List", `<p>A concept edit of the four featured bottles and five menu pairings. The 350+ label collection and 12 weekly pours describe the fictional program, not verified inventory.</p><div class="wine-filters" role="group" aria-label="Filter wines">${["All", "Red", "White", "Sparkling", "Rosé", "Sweet"].map((type) => `<button type="button" data-wine-type="${type}" aria-pressed="${type === "All"}">${type}</button>`).join("")}</div><div class="wine-list"></div><p class="disclaimer">Bottle prices are supplied sample prices. Individual pairing bottle prices are unspecified. Pairing journey: $95 per guest aged 21+. No sales or live stock.</p>`);
  const list = $(".wine-list", content);
  function filter(type) {
    $$("[data-wine-type]", content).forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.wineType === type)));
    list.innerHTML = wines.filter((wine) => type === "All" || wine.type === type).map((wine) => `<article class="wine-row"><div><h3>${wine.title}</h3><p>${wine.producer} · ${wine.type}</p></div><span>${wine.price ? money(wine.price) : "Pairing"}</span></article>`).join("");
  }
  $$("[data-wine-type]", content).forEach((button) => button.addEventListener("click", () => filter(button.dataset.wineType)));
  filter("All");
}
function today() {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type) => parts.find((value) => value.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function validateDate(input) {
  input.min = today();
  input.setCustomValidity("");
  if (!input.value) return;
  const weekday = new Date(`${input.value}T12:00:00`).getDay();
  if (weekday === 1 || weekday === 2) input.setCustomValidity("Our concept dining schedule is Wednesday–Sunday. Please choose another date.");
}
function bindDate(input) {
  validateDate(input);
  input.addEventListener("input", () => validateDate(input));
}
function bindTrimmed(input) {
  input.addEventListener("input", () => input.setCustomValidity(input.value && !input.value.trim() ? "Please enter more than spaces." : ""));
}
function privateDining() {
  openInfo("An Occasion, Personally Considered", `<p>Plan a private evening for 8–24 guests. From $150 per person; tax, service, custom menus and live availability are unconfirmed. This form produces a local preview only.</p><form class="private-form"><div class="row"><label>Your Name<input name="name" autocomplete="off" maxlength="80" required></label><label>Email<input name="email" type="email" autocomplete="off" maxlength="150" required></label></div><div class="row"><label>Preferred Date<input name="date" type="date" required></label><label>Number of Guests<input name="guests" type="number" min="8" max="24" step="1" value="8" required></label></div><label>Tell Us About Your Occasion<textarea name="message" maxlength="800" required placeholder="A celebration, a shared table, a particular wish…"></textarea></label><p class="private-total" aria-live="polite"></p><button class="button" type="submit">Preview Inquiry ${icon("arrow")}</button><div class="private-result result" role="status" tabindex="-1" hidden></div></form>`);
  const form = $(".private-form");
  const date = $('[name="date"]', form);
  const guests = $('[name="guests"]', form);
  const name = $('[name="name"]', form);
  const message = $('[name="message"]', form);
  bindDate(date);
  bindTrimmed(name);
  bindTrimmed(message);
  function quote() { $(".private-total", form).textContent = guests.validity.valid ? `From ${money(Number(guests.value) * 150)} for ${guests.value} guests` : "Choose 8–24 whole-number guests for an estimate."; }
  quote();
  guests.addEventListener("input", quote);
  const result = $(".private-result", form);
  form.addEventListener("input", () => { result.hidden = true; result.replaceChildren(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    validateDate(date);
    if (!form.reportValidity()) return;
    const summary = `${name.value.trim()} · ${guests.value} guests · ${date.value} · From ${money(Number(guests.value) * 150)} before tax, service and customization. ${message.value.trim()}. Local preview only. No message was sent, no personal data was stored, and no room was reserved.`;
    result.textContent = summary;
    result.hidden = false;
    form.reset();
    $$("input,textarea", form).forEach((input) => input.setCustomValidity(""));
    quote();
    result.focus();
  });
}
const infos = {
  privacy: ["Privacy", "<p>This static concept has no analytics, cookies, account system, storage or connected form service. Form values stay in the current page and are cleared after previews or newsletter checks. Closing inquiry details removes the form and preview.</p><p>All photos, fonts and icons load locally. A directions link opens Google Maps only when you activate it; Google and your mail or telephone application have their own privacy policies.</p>"],
  terms: ["Concept Terms", "<p>Aurelian is a fictional restaurant design. Awards, press, biography, sourcing, location, collection size and affiliations are unverified concept copy. Photographs do not identify actual staff or premises. Bottle drawings are illustrative.</p><p>The October 2026 menu is archived sample content. Every itinerary, inquiry and price is a local demonstration, not an offer, real-time availability, reservation, sale or subscription. No payment is requested. Wine is for guests aged 21+.</p><p>Concept cancellation policy: 24-hour notice. Please discuss dietary restrictions, allergies, exact pricing and any actual service directly with a verified venue.</p>"],
  instagram: ["Instagram", "<p>A glimpse behind the imagined pass. This concept has no connected Instagram account; these photographs are illustrative stock images. Explore the on-page gallery instead.</p>"],
  facebook: ["Facebook", "<p>This fictional restaurant has no connected Facebook profile. Event and community announcements here are demonstration content only.</p>"],
};
$$("[data-info]").forEach((button) => button.addEventListener("click", () => {
  const key = button.dataset.info;
  if (key === "private") privateDining();
  else if (key === "wine") wineList();
  else if (infos[key]) openInfo(...infos[key]);
}));
const booking = $("#reservation-form");
const date = $('[name="date"]', booking);
const party = $('[name="party"]', booking);
const pairing = $('[name="pairing"]', booking);
const adult = $('[name="adult"]', booking);
const availability = $("#availability-result");
party.innerHTML = Array.from({ length: 8 }, (_, index) => `<option value="${index + 1}" ${index === 1 ? "selected" : ""}>${index + 1} ${index ? "guests" : "guest"}</option>`).join("");
bindDate(date);
function updatePairing() {
  $("#wine-age").hidden = !pairing.checked;
  adult.disabled = !pairing.checked;
  adult.required = pairing.checked;
  if (!pairing.checked) adult.checked = false;
}
pairing.addEventListener("change", updatePairing);
updatePairing();
booking.addEventListener("input", () => { availability.hidden = true; availability.replaceChildren(); });
booking.addEventListener("submit", (event) => {
  event.preventDefault();
  validateDate(date);
  if (!booking.reportValidity()) return;
  const count = Number(party.value);
  if (!Number.isInteger(count) || count < 1 || count > 8) return;
  const seating = $('[name="seating"]', booking).value === "20:30" ? "8:30 PM" : "5:30 PM";
  const occasion = $('[name="occasion"]', booking).value;
  availability.replaceChildren();
  const title = document.createElement("h3");
  title.textContent = "Your Sample Evening";
  const lead = document.createElement("p");
  lead.textContent = `${date.value} · ${seating}, New York time · ${count} ${count === 1 ? "guest" : "guests"}${occasion === "None" ? "" : ` · ${occasion}`}`;
  const lines = document.createElement("dl");
  for (const [label, value] of [["Tasting menu", money(count * 185)], ...(pairing.checked ? [["Wine pairing · age 21+ confirmed", money(count * 95)]] : []), ["Illustrative subtotal", money(count * (pairing.checked ? 280 : 185))]]) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const definition = document.createElement("dd");
    term.textContent = label;
    definition.textContent = value;
    row.append(term, definition);
    lines.append(row);
  }
  const note = document.createElement("p");
  note.textContent = "No live availability was checked and no table has been reserved. Archived October menu; food, taxes, service and future availability are unconfirmed. This is a local itinerary preview only.";
  availability.append(title, lead, lines, note);
  if (count === 8) {
    const privateButton = document.createElement("button");
    privateButton.type = "button";
    privateButton.className = "button";
    privateButton.textContent = "Explore Private Dining";
    privateButton.addEventListener("click", privateDining);
    availability.append(privateButton);
  }
  date.value = "";
  validateDate(date);
  availability.hidden = false;
  availability.focus();
});
$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#newsletter-status").textContent = "Email format checked locally — no subscription created and no address stored.";
  $("#newsletter-email").value = "";
});
