(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
  const photos = window.STAYDIRECT_PHOTOS;
  const DAY = 86400000;
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const iso = (date) => date.toISOString().slice(0, 10);
  const addDays = (count) => iso(new Date(+today + count * DAY));
  const lastDate = iso(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 12, 0)));
  const booked = new Set([12, 13, 14, 23, 24, 25, 43, 44, 45, 46, 74, 75, 76].map(addDays));
  const parseDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(+date) && iso(date) === value ? date : null;
  };
  const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(parseDate(value));
  const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
  const knownSaves = new Set(["casa", "treehouse", "cabana", "jungle", "studio"]);
  let storageAvailable = true;
  function readStorage(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { storageAvailable = false; return fallback; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { storageAvailable = false; }
  }
  const storedSaved = readStorage("staydirect-saved", []);
  const storedCurrency = readStorage("staydirect-currency", "USD");
  const state = {
    saved: new Set(Array.isArray(storedSaved) ? storedSaved.filter((id) => knownSaves.has(id)) : []),
    currency: Object.hasOwn(rates, storedCurrency) ? storedCurrency : "USD",
    start: "", end: "", month: 0, photo: 0,
    adults: 2, children: 0, infants: 0, pets: 0,
  };
  const money = (usd) => new Intl.NumberFormat("en-US", { style: "currency", currency: state.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(usd * rates[state.currency]);
  const people = () => state.adults + state.children + state.infants;
  const guestText = () => `${people()} guest${people() === 1 ? "" : "s"}${state.pets ? " · 1 pet" : ""}`;
  let toastTimer;
  function toast(text) {
    $("#toast").textContent = text;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $("#toast").hidden = true; }, 4000);
  }
  function showDialog(dialog, opener = document.activeElement) {
    dialog._opener = opener;
    if (!dialog.open) dialog.showModal();
  }
  function restoreDialog(dialog) {
    if (dialog.open) return;
    if (dialog.id === "booking-dialog") $("#booking-rail").prepend($("#booking-card"));
    const opener = dialog._opener;
    if (opener?.isConnected && opener.getClientRects().length) opener.focus({ preventScroll: true });
    else if (matchMedia("(max-width:767px)").matches) $("#mobile-reserve").focus({ preventScroll: true });
  }
  function closeDialog(dialog) {
    if (!dialog?.open) return;
    if (dialog.id === "booking-dialog") $("#booking-rail").prepend($("#booking-card"));
    dialog.close();
    restoreDialog(dialog);
  }
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = $$('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]', dialog).filter((node) => node.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    });
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(dialog); });
    dialog.addEventListener("close", () => restoreDialog(dialog));
  });

  $("#gallery-track").innerHTML = photos.map((photo, index) => `<button class="gallery-photo" data-photo="${index}" aria-label="Open photo ${index + 1} of ${photos.length}"><img src="${photo.src}" alt="${photo.caption}" loading="${index < 5 ? "eager" : "lazy"}"${index === 0 ? ' fetchpriority="high"' : ""}></button>`).join("");
  function renderDots() {
    const count = Math.min(7, Math.max(3, Math.floor($("#photo-dots").clientWidth / 44)));
    const first = Math.max(0, Math.min(state.photo - Math.floor(count / 2), photos.length - count));
    $("#photo-dots").innerHTML = photos.slice(first, first + count).map((_, index) => `<button data-slide="${first + index}" aria-label="Go to photo ${first + index + 1}" aria-current="${first + index === state.photo}"></button>`).join("");
    $("#mobile-photo-count").textContent = `${state.photo + 1} / ${photos.length}`;
  }
  function setPhoto(index) {
    state.photo = (index + photos.length) % photos.length;
    const photo = photos[state.photo];
    $("#lightbox-photo").src = photo.src;
    $("#lightbox-photo").alt = photo.caption;
    $("#photo-caption").textContent = photo.caption;
    $("#lightbox-count").textContent = `${state.photo + 1} / ${photos.length}`;
    renderDots();
  }
  function openPhoto(index, opener) {
    setPhoto(index);
    showDialog($("#lightbox"), opener);
  }
  let galleryFrame = false;
  $("#gallery-track").addEventListener("scroll", () => {
    if (!matchMedia("(max-width:767px)").matches || galleryFrame) return;
    galleryFrame = true;
    requestAnimationFrame(() => {
      state.photo = Math.max(0, Math.min(photos.length - 1, Math.round($("#gallery-track").scrollLeft / $("#gallery-track").clientWidth)));
      renderDots(); galleryFrame = false;
    });
  });
  let pointerStart = null, suppressPhotoClick = false;
  $("#gallery-track").addEventListener("pointerdown", (event) => { pointerStart = event.clientX; suppressPhotoClick = false; });
  $("#gallery-track").addEventListener("pointerup", (event) => { suppressPhotoClick = pointerStart !== null && Math.abs(event.clientX - pointerStart) > 12; pointerStart = null; });
  $("#lightbox").addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault(); setPhoto(state.photo + (event.key === "ArrowRight" ? 1 : -1));
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); setPhoto(event.key === "Home" ? 0 : photos.length - 1);
    }
  });
  let lightboxTouch;
  $("#lightbox-photo").addEventListener("touchstart", (event) => { lightboxTouch = event.changedTouches[0].clientX; }, { passive: true });
  $("#lightbox-photo").addEventListener("touchend", (event) => {
    const movement = event.changedTouches[0].clientX - lightboxTouch;
    if (Math.abs(movement) > 40) setPhoto(state.photo + (movement < 0 ? 1 : -1));
  }, { passive: true });

  const essentials = [
    ["Waves", "Private infinity pool"], ["TreePalm", "Direct beach access"],
    ["Wifi", "High-speed WiFi (150 Mbps)"], ["AirVent", "Air conditioning in all rooms"],
    ["Utensils", "Full chef's kitchen"], ["Car", "Free parking for 2 vehicles"],
    ["ChefHat", "Private chef available (extra)"], ["Leaf", "Yoga deck"],
    ["Bike", "2 complimentary bicycles"], ["LockKeyhole", "Smart lock entry"],
  ];
  const amenityGroups = [
    ["The essentials", essentials.map(([, label]) => label)],
    ["Bathroom", ["Rainfall shower", "Soaking tub", "Luxury toiletries", "Hair dryer"]],
    ["Kitchen", ["Gas stove & oven", "Espresso machine & blender", "Dishwasher & filtered water"]],
    ["Outdoor", ["BBQ grill", "Hammocks", "Beach palapa", "Outdoor dining for 8", "Fire pit"]],
    ["Entertainment", ['65" smart TV', "Sonos speakers", "Board games & snorkel gear"]],
    ["Safety", ["Smoke / carbon monoxide detectors & fire extinguisher", "First aid kit", "Exterior-only security cameras"]],
  ];
  $("#amenities-preview").innerHTML = essentials.map(([name, label]) => `<div class="amenity">${icon(name)}<span>${label}</span></div>`).join("");
  function renderAmenities() {
    const query = normalize($("#amenity-search").value);
    let count = 0;
    $("#all-amenities").innerHTML = amenityGroups.map(([group, labels]) => {
      const matches = labels.filter((label) => normalize(`${group} ${label}`).includes(query));
      count += matches.length;
      return matches.length ? `<section class="amenity-group"><h3>${group}</h3><ul>${matches.map((label) => `<li>${icon("Check")}${label}</li>`).join("")}</ul></section>` : "";
    }).join("");
    $("#amenity-count").textContent = count ? `${count} amenit${count === 1 ? "y" : "ies"} shown` : "No amenities match. Try another word.";
  }

  function dateError(start = state.start, end = state.end) {
    if (!start || !end) return "Choose check-in and check-out dates. A 3-night minimum applies.";
    const from = parseDate(start), to = parseDate(end);
    if (!from || !to) return "Enter valid check-in and check-out dates.";
    if (start < iso(today) || end > lastDate) return "Choose dates within the next 12 months.";
    if (to <= from) return "Check-out must be after check-in.";
    if ((to - from) / DAY < 3) return "A 3-night minimum applies. Choose a later check-out.";
    if (booked.has(end)) return "That check-out date is unavailable in this sample calendar.";
    for (let date = +from; date < +to; date += DAY) {
      if (booked.has(iso(new Date(date)))) return "Your dates include a booked night. Please choose another range.";
    }
    return "";
  }
  function costs() {
    if (dateError()) return null;
    const nights = (+parseDate(state.end) - +parseDate(state.start)) / DAY;
    const room = 389 * nights, pet = 50 * nights * state.pets;
    const tax = Math.round((room + pet + 150) * 0.16 * 100) / 100;
    return { nights, room, pet, tax, total: room + pet + 150 + tax };
  }
  function renderCalendar(focusDate) {
    const visibleMonths = matchMedia("(min-width:1101px)").matches ? 2 : 1;
    $("#previous-month").disabled = state.month === 0;
    $("#next-month").disabled = state.month === 11;
    const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    $("#calendars").innerHTML = Array.from({ length: visibleMonths }, (_, offset) => {
      const first = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + state.month + offset, 1));
      const days = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
      const label = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
      let buttons = '<span class="blank-date"></span>'.repeat(first.getUTCDay());
      for (let day = 1; day <= days; day++) {
        const key = iso(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), day)));
        const past = key < iso(today), unavailable = booked.has(key), after = key > lastDate;
        const edge = key === state.start || key === state.end;
        const inRange = state.start && state.end && key > state.start && key < state.end;
        const classes = [past ? "past" : "", unavailable ? "booked" : "", edge ? "range-edge" : "", inRange ? "in-range" : "", key === iso(today) ? "today" : ""].filter(Boolean).join(" ");
        const prefix = key === state.start ? "Check-in, " : key === state.end ? "Check-out, " : unavailable ? "Unavailable, " : past ? "Past date, " : "";
        buttons += `<button data-date="${key}" class="${classes}" aria-label="${prefix}${dateLabel(key)}" aria-pressed="${edge}"${past || unavailable || after ? " disabled" : ""}>${day}</button>`;
      }
      return `<div class="calendar-month"><h3>${label}</h3><div class="weekday-grid">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div><div class="date-grid">${buttons}</div></div>`;
    }).join("");
    if (focusDate) $(`[data-date="${focusDate}"]`)?.focus({ preventScroll: true });
  }
  function updateBooking(error = "") {
    $("#check-in").value = state.start; $("#check-out").value = state.end;
    $("#guest-summary").textContent = guestText();
    $("#booking-error").textContent = error;
    const cost = costs();
    const rows = cost ? [
      [`${money(389)} × ${cost.nights} nights`, money(cost.room)],
      ["Cleaning fee", money(150)],
      ...(cost.pet ? [[`${money(50)} × ${cost.nights} pet nights`, money(cost.pet)]] : []),
      ["Service fee", money(0), "fee-free"],
      ["Direct booking — no platform fees!", "", "fee-caption"],
      ["Taxes (16% IVA)", money(cost.tax)],
      ["Total", money(cost.total), "total"],
    ] : [];
    $("#price-breakdown").hidden = !cost;
    $("#price-breakdown").innerHTML = rows.map(([label, amount, className = ""]) => `<div class="${className}"><span>${label}</span><span>${amount}</span></div>`).join("");
    $("#mobile-date-summary").textContent = cost ? `${dateLabel(state.start).replace(/, \d{4}/, "")} – ${dateLabel(state.end).replace(/, \d{4}/, "")} · ${cost.nights} nights` : "Add dates · 3-night minimum";
    $("#calendar-status").textContent = cost ? `Check-in ${dateLabel(state.start)} · Check-out ${dateLabel(state.end)} · ${cost.nights} nights` : state.start ? `Check-in ${dateLabel(state.start)} selected. Choose check-out (3+ nights).` : "Choose your check-in date to get started.";
    if (error) $("#calendar-status").textContent = error;
  }
  function chooseDate(key) {
    if (key < iso(today) || booked.has(key) || key > lastDate) return;
    if (!state.start || state.end || key <= state.start) {
      state.start = key; state.end = "";
      updateBooking();
    } else {
      const error = dateError(state.start, key);
      if (error) { updateBooking(error); toast(error); }
      else { state.end = key; updateBooking(); }
    }
    renderCalendar(key);
  }
  function renderGuests() {
    const limits = { adults: 6, children: 5, infants: 5, pets: 1 };
    const notes = { adults: "Ages 13+", children: "Ages 2–12", infants: "Under 2 years", pets: `${money(50)} per night · max 1` };
    $("#guest-panel").innerHTML = Object.keys(limits).map((kind) => {
      const label = kind[0].toUpperCase() + kind.slice(1);
      const full = kind === "pets" ? state.pets >= 1 : people() >= 6 || state[kind] >= limits[kind];
      return `<div class="guest-row"><div><strong>${label}</strong><small>${notes[kind]}</small></div><div class="stepper"><button class="icon-button" data-guest="${kind}" data-step="-1" aria-label="Remove ${kind}"${state[kind] <= (kind === "adults" ? 1 : 0) ? " disabled" : ""}>${icon("Minus")}</button><span data-guest-count="${kind}" aria-live="polite">${state[kind]}</span><button class="icon-button" data-guest="${kind}" data-step="1" aria-label="Add ${kind}"${full ? " disabled" : ""}>${icon("Plus")}</button></div></div>`;
    }).join("") + '<p class="fixture-note">Maximum 6 people, including infants. At least 1 adult and up to 1 pet.</p><button class="text-link" id="guests-done">Done</button>';
  }
  function openBooking(opener) {
    if (matchMedia("(max-width:767px)").matches) {
      $("#booking-mount").append($("#booking-card"));
      showDialog($("#booking-dialog"), opener);
    } else $("#booking-card").scrollIntoView({ block: "center", behavior: "smooth" });
    (state.start ? $("#reserve") : $("#check-in")).focus({ preventScroll: true });
  }
  function reserve(opener) {
    const error = dateError();
    if (error) {
      updateBooking(error); $("#booking-error").focus({ preventScroll: true }); return;
    }
    const cost = costs();
    $("#confirmation-summary").innerHTML = `<p>Casa Azul · Tulum, Mexico</p><p>${dateLabel(state.start)} – ${dateLabel(state.end)}<br>${cost.nights} nights · ${guestText()}</p><p>Sample total, including cleaning and IVA</p><strong>${money(cost.total)}</strong>`;
    showDialog($("#confirmation-dialog"), opener);
  }
  function updateCurrency() {
    $$("[data-currency]").forEach((select) => { select.value = state.currency; });
    $$("[data-price]").forEach((node) => { node.textContent = money(Number(node.dataset.price)); });
    $("#fx-note").textContent = state.currency === "USD" ? "Prices in USD." : `Illustrative FX: 1 USD = ${rates[state.currency]} ${state.currency}. Not a live exchange rate.`;
    renderGuests(); updateBooking();
  }
  function updateSaves() {
    $$("[data-save]").forEach((button) => {
      const saved = state.saved.has(button.dataset.save);
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", `${saved ? "Unsave" : "Save"} ${button.dataset.save === "casa" ? "Casa Azul" : button.dataset.save}`);
      if ($("span", button)) $("span", button).textContent = saved ? "Saved" : "Save";
    });
  }

  const reviews = [
    { name: "Sarah K.", place: "Austin, TX", date: "December 2025", order: "2025-12", rating: 5, text: "Absolutely magical. The villa exceeded every expectation — the photos don't do it justice. Waking up to that ocean view every morning was surreal." },
    { name: "Tom & Linda R.", place: "Toronto", date: "November 2025", order: "2025-11", rating: 5, text: "Best-equipped kitchen we've ever had in a rental. We hired the private chef for one dinner and cooked ourselves the rest — both were amazing." },
    { name: "Yuki M.", place: "Tokyo", date: "November 2025", order: "2025-11", rating: 5, text: "Gabriela was incredibly responsive and left a personalized welcome basket with local mezcal and chocolates. The self check-in was seamless." },
    { name: "Anna & Chris B.", place: "Brooklyn", date: "January 2026", order: "2026-01", rating: 5, text: "Third time staying here. We come back every winter. The private beach path and yoga deck make it impossible to leave." },
    { name: "James W.", place: "London", date: "October 2025", order: "2025-10", rating: 4, text: "Pool is stunning, beach is gorgeous, but be aware there's some seaweed on the beach (common in Tulum). Villa itself is perfection." },
    { name: "Maria G.", place: "Madrid", date: "September 2025", order: "2025-09", rating: 5, text: "Perfect for our family of 5. Kids loved the pool. The bikes were perfect for exploring. Only wish we'd booked a longer stay." },
  ];
  const reviewMarkup = (review) => `<article class="review-card"><div class="review-person"><span class="review-avatar" aria-hidden="true">${review.name[0]}${review.name.includes("&") ? "+" : ""}</span><div><h3>${review.name}</h3><p>${review.place}</p></div></div><div class="review-date"><span class="stars" aria-label="${review.rating} out of 5 stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</span><span>${review.date}</span></div><p>${review.text}</p></article>`;
  $("#reviews-preview").innerHTML = reviews.map(reviewMarkup).join("");
  $("#rating-bars").innerHTML = [["Cleanliness", 5], ["Accuracy", 4.9], ["Communication", 5], ["Location", 4.9], ["Check-in", 5], ["Value", 4.8]].map(([label, rating]) => `<div class="rating-bar"><span>${label}</span><span class="bar-track" role="meter" aria-label="${label}" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${rating}"><i class="bar-fill" style="width:${rating * 20}%"></i></span><b>${rating.toFixed(1)}</b></div>`).join("");
  function renderReviews() {
    const query = normalize($("#review-search").value);
    const sort = $("#review-sort").value;
    const matches = reviews.filter((review) => normalize(`${review.name} ${review.place} ${review.text}`).includes(query));
    matches.sort((a, b) => sort === "recent" ? b.order.localeCompare(a.order) : sort === "low" ? a.rating - b.rating : b.rating - a.rating);
    $("#all-reviews").innerHTML = matches.map(reviewMarkup).join("");
    $("#review-count").textContent = `${matches.length} of 6 sample reviews${matches.length ? "" : " — no matches"}`;
  }
  const similar = [
    { id: "treehouse", title: "Oceanview Treehouse Loft", guests: 2, beds: 1, price: 189, rating: "4.88", reviews: 89, photo: 20 },
    { id: "cabana", title: "Bohemian Beach Cabana", guests: 4, beds: 2, price: 249, rating: "4.95", reviews: 203, photo: 37 },
    { id: "jungle", title: "Modern Jungle Villa with Cenote", guests: 8, beds: 4, price: 529, rating: "4.91", reviews: 64, photo: 3 },
    { id: "studio", title: "Seaside Studio with Rooftop Plunge Pool", guests: 2, beds: 1, price: 159, rating: "4.87", reviews: 156, photo: 8 },
  ];
  $("#similar-track").innerHTML = similar.map((stay) => `<article class="similar-card"><button class="similar-photo" data-stay="${stay.id}" aria-label="Preview ${stay.title}"><img src="${photos[stay.photo].src}" alt="Illustrative accommodation photograph" loading="lazy"></button><button class="icon-button similar-save" data-save="${stay.id}" aria-pressed="false">${icon("Heart")}</button>${stay.id === "cabana" ? '<span class="similar-badge">Guest favorite</span>' : ""}<h3><button data-stay="${stay.id}">${stay.title}</button></h3><p class="similar-specs">${stay.guests} guests · ${stay.beds} bed${stay.beds === 1 ? "" : "s"}</p><div class="similar-meta"><span><strong data-price="${stay.price}">${money(stay.price)}</strong> / night</span><span>${icon("Star")} ${stay.rating} (${stay.reviews})</span></div></article>`).join("");
  const footer = {
    Explore: ["Beach stays", "Mountain retreats", "City apartments", "Countryside", "Unique stays", "New listings"],
    Hosts: ["List your property", "Host resources", "Pricing calculator", "Insurance", "Host community"],
    StayDirect: ["About us", "How it works", "Trust & safety", "Careers", "Press", "Blog"],
    Support: ["Help center", "Contact us", "Cancellation options", "Accessibility", "Report a concern"],
  };
  $("#footer-links").innerHTML = Object.entries(footer).map(([group, links]) => `<div><h3>${group}</h3>${links.map((label) => `<button data-info="${label}">${label}</button>`).join("")}</div>`).join("");
  function info(title, opener) {
    const key = title.toLowerCase();
    if (key === "report a concern") { openForm("report", opener); return; }
    $("#info-title").textContent = title;
    const descriptions = {
      "how it works": "Explore a home, choose sample dates and review a transparent estimate. A real direct-booking service would connect you with its owner; this static concept does not create reservations or handle payments.",
      "list your property": "A thoughtful home deserves a personal welcome. This demo illustrates an owner-direct listing. There is no host onboarding, document upload or listing submission service.",
      "help center": "Choose dates in the availability calendar or booking card. A stay requires at least three nights. Capacity is six people, including infants, and one pet. Rates and booked dates are fictional examples.",
      "cancellation options": "Sample policy: full refund seven or more days before check-in, half refund three to six days before, and no refund less than three days before. No actual booking exists to cancel.",
      "privacy": "Saved homes and your chosen currency stay in this browser only. Dates and guest counts stay in memory. Forms do not send or store emails or messages. No analytics, external map requests or runtime services are used.",
      "terms": "This fictional property and platform are for design demonstration, not an offer, booking contract or payment service. Host identity, ratings, prices, terms and availability are illustrative.",
      "language": "This demonstration is written in English (US). Currency estimates can be changed to USD, EUR or GBP using the selector. Translated content is not provided.",
      "accessibility": "Use keyboard-focus outlines, labelled controls and Escape to close dialogs. The gallery supports arrow keys in fullscreen; reduced-motion preferences are respected. Availability is also editable with labelled date inputs.",
      "pricing calculator": "Use the Casa Azul date and guest controls to calculate nights, cleaning, optional pet fees and 16% IVA. USD is the base currency; EUR and GBP use explicitly labelled sample rates.",
      "trust & safety": "For real travel, independently verify the property, host identity and booking protections. Do not transfer funds based on this concept. Safety features and host badges shown here have not been independently verified.",
      "insurance": "No insurance or payment protection is supplied by this static demonstration. Review real provider coverage and terms before making a booking elsewhere.",
      "sitemap": "Explore the property details, sleeping arrangements, amenities, availability, approximate location, six sample reviews, host profile, policies and four sample similar stays on this page.",
    };
    $("#info-content").replaceChildren();
    const paragraph = document.createElement("p");
    paragraph.textContent = descriptions[key] || `${title} is a demonstration navigation destination. StayDirect is a fictional platform; this local page has no external catalogue, accounts, publishing or contact service. You can explore Casa Azul and the four sample stay previews on this page.`;
    $("#info-content").append(paragraph);
    if (key === "privacy") {
      const button = document.createElement("button");
      button.className = "outline-button"; button.id = "clear-saved"; button.textContent = "Clear saved homes";
      $("#info-content").append(button);
    }
    if (key === "sitemap" || ["explore", "beach stays", "new listings"].includes(key)) {
      const button = document.createElement("button"); button.className = "outline-button";
      button.textContent = "Explore sample stays"; button.dataset.scroll = "similar-stays"; $("#info-content").append(button);
    }
    showDialog($("#info-dialog"), opener);
  }
  function openForm(kind, opener) {
    $("#form-dialog").dataset.kind = kind;
    const message = kind === "message", report = kind === "report";
    $("#form-title").textContent = message ? "Say hello to Gabriela" : report ? "Report this listing" : "Welcome to StayDirect";
    $("#form-intro").textContent = message ? "Demo form: your message is not sent or stored." : report ? "Demo form: no report is submitted or stored." : "Demo form: no account is created, email sent or email stored.";
    $("#form-fields").innerHTML = report ? '<label class="form-label">Reason<select name="reason" required><option value="">Choose a reason</option><option>Inaccurate details</option><option>Safety concern</option><option>Misleading imagery</option><option>Other</option></select></label><label class="form-label">Details<textarea name="details" maxlength="1000" required placeholder="Describe the concern"></textarea></label>' : `<label class="form-label">Email<input name="email" type="email" required autocomplete="email" placeholder="you@example.com"></label>${message ? '<label class="form-label">Your message<textarea name="message" maxlength="1000" required placeholder="Ask a question about this sample stay"></textarea></label>' : ""}`;
    $("#form-status").textContent = "";
    $("#form-submit").firstChild.textContent = report ? "Preview report " : message ? "Preview message " : "Continue ";
    showDialog($("#form-dialog"), opener);
  }
  $("#demo-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = $("#demo-form textarea");
    if (text && !text.value.trim()) { text.setCustomValidity("Please enter a message, not only spaces."); text.reportValidity(); return; }
    $("#form-status").textContent = "Demo complete. Nothing was sent or stored; no account or report was created.";
    event.target.reset();
  });
  $("#demo-form").addEventListener("input", (event) => { event.target.setCustomValidity?.(""); $("#form-status").textContent = ""; });
  $("#copy-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#share-url").value);
      $("#share-status").textContent = "Link copied. Share a little escape.";
    } catch {
      $("#share-url").focus(); $("#share-url").select();
      $("#share-status").textContent = "Clipboard unavailable. The link is selected; copy it with Ctrl+C or your browser's copy command.";
    }
  });

  document.addEventListener("click", (event) => {
    const control = event.target.closest("button, a");
    if (!control || control.disabled) return;
    const inGuestPicker = !!control.closest(".guest-picker");
    if (control.matches("[data-close]")) { closeDialog(control.closest("dialog")); return; }
    if (control.matches("[data-save]")) {
      const id = control.dataset.save;
      if (state.saved.has(id)) state.saved.delete(id); else state.saved.add(id);
      writeStorage("staydirect-saved", [...state.saved]); updateSaves();
      toast(`${state.saved.has(id) ? "Saved for a little later." : "Removed from your saved homes."}${storageAvailable ? "" : " Browser storage unavailable; kept in this tab only."}`);
    } else if (control.matches("[data-photo]")) {
      if (suppressPhotoClick) { suppressPhotoClick = false; return; }
      openPhoto(Number(control.dataset.photo), control);
    } else if (control.id === "show-photos") openPhoto(state.photo, control);
    else if (control.id === "photo-next" || control.id === "photo-previous") setPhoto(state.photo + (control.id === "photo-next" ? 1 : -1));
    else if (control.matches("[data-slide]")) {
      const target = Number(control.dataset.slide);
      $("#gallery-track").scrollTo({ left: target * $("#gallery-track").clientWidth, behavior: "smooth" });
    } else if (control.id === "share-button") {
      $("#share-url").value = new URL("index.html", location.href).href;
      $("#share-status").textContent = ""; showDialog($("#share-dialog"), control);
    } else if (control.id === "description-toggle") {
      const expanded = $("#description").classList.toggle("expanded");
      control.setAttribute("aria-expanded", String(expanded));
      control.firstChild.textContent = expanded ? "Show less " : "Show more ";
    } else if (control.id === "show-amenities") {
      $("#amenity-search").value = ""; renderAmenities(); showDialog($("#amenities-dialog"), control);
    } else if (control.id === "show-reviews") {
      renderReviews(); showDialog($("#reviews-dialog"), control);
    } else if (control.matches("[data-date]")) chooseDate(control.dataset.date);
    else if (control.id === "previous-month" || control.id === "next-month") {
      state.month = Math.max(0, Math.min(11, state.month + (control.id === "previous-month" ? -1 : 1))); renderCalendar();
    } else if (control.id === "clear-dates") {
      state.start = state.end = ""; updateBooking(); renderCalendar();
    } else if (control.id === "guest-toggle") {
      $("#guest-panel").hidden = !$("#guest-panel").hidden;
      control.setAttribute("aria-expanded", String(!$("#guest-panel").hidden));
    } else if (control.matches("[data-guest]")) {
      const kind = control.dataset.guest, step = Number(control.dataset.step);
      const max = { adults: 6, children: 5, infants: 5, pets: 1 }[kind];
      const candidate = state[kind] + step;
      if (candidate < (kind === "adults" ? 1 : 0) || candidate > max || (kind !== "pets" && people() + step > 6)) return;
      state[kind] = candidate; renderGuests(); updateBooking();
      ($(`[data-guest="${kind}"][data-step="${step}"]:not(:disabled)`) || $(`[data-guest="${kind}"][data-step="${-step}"]:not(:disabled)`))?.focus({ preventScroll: true });
    } else if (control.id === "guests-done") {
      $("#guest-panel").hidden = true; $("#guest-toggle").setAttribute("aria-expanded", "false"); $("#guest-toggle").focus();
    } else if (control.matches("[data-book]")) openBooking(control);
    else if (control.id === "reserve") reserve(control);
    else if (control.matches("[data-info]")) info(control.dataset.info, control);
    else if (control.matches("[data-form]")) openForm(control.dataset.form, control);
    else if (control.matches("[data-scroll]")) {
      closeDialog(control.closest("dialog"));
      document.getElementById(control.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    } else if (control.id === "menu-button") {
      $("#mobile-menu").hidden = !$("#mobile-menu").hidden;
      control.setAttribute("aria-expanded", String(!$("#mobile-menu").hidden));
      control.setAttribute("aria-label", $("#mobile-menu").hidden ? "Open menu" : "Close menu");
    } else if (control.matches("[data-zoom]")) {
      const map = $("#area-map"), zoom = Math.max(1, Math.min(1.8, Number(map.dataset.zoom || 1) + Number(control.dataset.zoom) * 0.2));
      map.dataset.zoom = String(zoom); map.style.transform = `scale(${zoom})`;
    } else if (control.matches("[data-similar-scroll]")) {
      $("#similar-track").scrollBy({ left: Number(control.dataset.similarScroll) * $("#similar-track").clientWidth * 0.8, behavior: "smooth" });
    } else if (control.matches("[data-stay]")) {
      const stay = similar.find((item) => item.id === control.dataset.stay);
      $("#info-title").textContent = stay.title;
      $("#info-content").innerHTML = `<img src="${photos[stay.photo].src}" alt="Illustrative stock accommodation"><p>${stay.guests} guests · ${stay.beds} bed${stay.beds === 1 ? "" : "s"} · ${money(stay.price)} / night</p><p>${icon("Star")} ${stay.rating} · ${stay.reviews} sample reviews</p><p class="demo-callout">Sample listing preview only. This is not a real property offer and cannot be booked. Photography is illustrative.</p>`;
      showDialog($("#info-dialog"), control);
    } else if (control.id === "clear-saved") {
      state.saved.clear();
      try { localStorage.removeItem("staydirect-saved"); } catch { storageAvailable = false; }
      updateSaves(); toast("Saved homes cleared. Your selected currency is unchanged.");
    }
    if (!inGuestPicker) {
      $("#guest-panel").hidden = true; $("#guest-toggle").setAttribute("aria-expanded", "false");
    }
    if ($("#mobile-menu").contains(control)) {
      $("#mobile-menu").hidden = true; $("#menu-button").setAttribute("aria-expanded", "false"); $("#menu-button").setAttribute("aria-label", "Open menu");
    }
    if (control.matches('a[href^="#"]')) closeDialog(control.closest("dialog"));
  });
  $$("[data-currency]").forEach((select) => select.addEventListener("change", () => {
    state.currency = Object.hasOwn(rates, select.value) ? select.value : "USD";
    writeStorage("staydirect-currency", state.currency); updateCurrency();
  }));
  [$("#check-in"), $("#check-out")].forEach((input) => {
    input.min = iso(today); input.max = lastDate;
    input.addEventListener("change", () => {
      state.start = $("#check-in").value; state.end = $("#check-out").value;
      updateBooking(state.start && state.end ? dateError() : ""); renderCalendar();
    });
  });
  $("#amenity-search").addEventListener("input", renderAmenities);
  $("#review-search").addEventListener("input", renderReviews);
  $("#review-sort").addEventListener("change", renderReviews);
  let calendarTouch;
  $("#calendars").addEventListener("touchstart", (event) => { calendarTouch = event.changedTouches[0].clientX; }, { passive: true });
  $("#calendars").addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].clientX - calendarTouch;
    if (matchMedia("(max-width:1100px)").matches && Math.abs(delta) > 50) {
      if (event.cancelable) event.preventDefault();
      state.month = Math.max(0, Math.min(11, state.month + (delta < 0 ? 1 : -1))); renderCalendar();
    }
  }, { passive: false });
  matchMedia("(max-width:767px)").addEventListener("change", (event) => {
    if (!event.matches && $("#booking-dialog").open) closeDialog($("#booking-dialog"));
    renderCalendar(); renderDots();
  });
  matchMedia("(min-width:1101px)").addEventListener("change", () => renderCalendar());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !$$("dialog[open]").length) {
      $("#mobile-menu").hidden = true; $("#menu-button").setAttribute("aria-expanded", "false");
      $("#guest-panel").hidden = true; $("#guest-toggle").setAttribute("aria-expanded", "false");
    }
  });
  renderDots(); renderCalendar(); updateCurrency(); updateSaves();
})();
