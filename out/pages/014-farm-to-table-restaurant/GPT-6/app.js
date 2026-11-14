(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
  const nav = $("#navigation");
  const toggle = $(".nav-toggle");
  function closeNavigation() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) { closeNavigation(); toggle.focus(); }
  });
  matchMedia("(min-width:851px)").addEventListener("change", (event) => { if (event.matches) closeNavigation(); });
  const menus = {
    starters: [
      ["Heirloom Tomato Gazpacho", "roasted garlic croutons, basil oil, microgreens", 14],
      ["Burrata & Stone Fruit", "grilled peaches, arugula, aged balsamic, toasted hazelnuts", 18],
      ["Farm Egg Tartine", "sourdough, whipped ricotta, pickled shallots, herb salad", 16],
      ["Spring Pea Soup", "mint crème fraîche, pea shoots, lemon zest", 13],
    ],
    mains: [
      ["Pan-Seared Trout", "asparagus, fingerling potatoes, brown butter, capers", 32],
      ["Grass-Fed Ribeye", "roasted root vegetables, bone marrow jus, chimichurri", 42],
      ["Wild Mushroom Risotto", "porcini, chanterelle, truffle oil, aged parmesan", 28],
      ["Heritage Pork Chop", "braised greens, apple mostarda, sweet potato purée", 36],
    ],
    desserts: [
      ["Lavender Crème Brûlée", "shortbread cookie, fresh berries", 14],
      ["Seasonal Fruit Galette", "vanilla bean ice cream, honey drizzle", 15],
      ["Dark Chocolate Torte", "raspberry coulis, whipped cream, edible flowers", 16],
    ],
  };
  const dish = ([name, description, price]) => `<article class="dish"><div><h3>${name}</h3><p>${description}</p></div><strong>$${price}</strong></article>`;
  $("#menu-panels").innerHTML = Object.entries(menus).map(([course, dishes]) => `<div id="panel-${course}" role="tabpanel" aria-labelledby="tab-${course}" tabindex="0"${course === "starters" ? "" : " hidden"}>${dishes.map(dish).join("")}</div>`).join("");
  function selectMenu(course, focus = false) {
    $$(".menu-tabs button").forEach((button) => {
      const active = button.id === `tab-${course}`;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    $$("#menu-panels [role=tabpanel]").forEach((panel) => { panel.hidden = panel.id !== `panel-${course}`; });
    $("#menu-course").value = course;
  }
  $$(".menu-tabs button").forEach((button, index) => {
    button.addEventListener("click", () => selectMenu(button.id.slice(4)));
    button.addEventListener("keydown", (event) => {
      const keys = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 };
      if (keys[event.key] !== undefined) { event.preventDefault(); selectMenu(Object.keys(menus)[keys[event.key]], true); }
    });
  });
  $("#menu-course").addEventListener("change", (event) => selectMenu(event.target.value));
  const photos = [
    ["flowers.jpg", "A seasonal plate finished with herbs and edible flowers", "Nature, on a plate"],
    ["dining.jpg", "A warmly lit dining room with wood tables and hanging lights", "A little room for good company"],
    ["plating.jpg", "A chef's hands presenting burrata, figs, tomatoes and edible flowers", "The finishing touch"],
    ["patio.jpg", "Garden tables beneath glowing string lights at dusk", "Under the evening sky"],
    ["produce.jpg", "Fresh market produce including squash, carrots, tomatoes and cabbage", "The season arrives"],
    ["wine.jpg", "Red wine being poured into a glass at a dinner setting", "An occasion to slow down"],
  ];
  $(".gallery").innerHTML = photos.map(([file, alt, caption], index) => `<figure><button type="button" data-photo="${index}" aria-label="Enlarge: ${caption}"><img src="assets/${file}" alt="${alt}" width="1200" height="1000" loading="lazy"></button><figcaption>${caption}</figcaption></figure>`).join("");
  $(".gallery-nav").innerHTML = photos.map((photo, index) => `<button type="button" data-gallery="${index}" aria-label="Show photo: ${photo[2]}" aria-current="${index === 0}"></button>`).join("");
  const gallery = $(".gallery");
  function scrollPhoto(index) {
    const cards = $$("figure", gallery);
    const target = (index + cards.length) % cards.length;
    gallery.scrollTo({ left: target * (gallery.clientWidth + 15), behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth" });
  }
  $$(".gallery-nav button").forEach((button) => button.addEventListener("click", () => scrollPhoto(Number(button.dataset.gallery))));
  gallery.addEventListener("scroll", () => {
    const current = Math.round(gallery.scrollLeft / (gallery.clientWidth + 15));
    $$(".gallery-nav button").forEach((button, index) => button.setAttribute("aria-current", String(index === current)));
  }, { passive: true });
  gallery.addEventListener("keydown", (event) => {
    if (!matchMedia("(max-width:600px)").matches || event.target !== gallery) return;
    const index = Math.round(gallery.scrollLeft / (gallery.clientWidth + 15));
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      scrollPhoto(event.key === "Home" ? 0 : event.key === "End" ? 5 : index + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  function attachDialog(dialog) {
    let trigger;
    dialog.addEventListener("close", () => { trigger?.focus({ preventScroll: true }); });
    $(".close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
    return () => { trigger = document.activeElement; dialog.showModal(); };
  }
  const lightbox = $("#lightbox");
  const openPhoto = attachDialog(lightbox);
  let photoIndex = 0;
  function changePhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    $("#photo-large").src = `assets/${photos[photoIndex][0]}`;
    $("#photo-large").alt = photos[photoIndex][1];
    $("#photo-caption").textContent = photos[photoIndex][2];
  }
  $$("[data-photo]").forEach((button) => button.addEventListener("click", () => { changePhoto(Number(button.dataset.photo)); openPhoto(); }));
  $(".photo-previous").addEventListener("click", () => changePhoto(photoIndex - 1));
  $(".photo-next").addEventListener("click", () => changePhoto(photoIndex + 1));
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); changePhoto(photoIndex + (event.key === "ArrowRight" ? 1 : -1)); }
  });
  const reviews = [
    ["The best meal I've had in years. You can taste the care in every bite.", "Sarah M.", "Google Reviews"],
    ["We drove two hours for the farm dinner and it was worth every mile. Extraordinary.", "James & Lina T.", "Yelp"],
    ["The mushroom risotto changed my life. I'm not exaggerating.", "Devon R.", "OpenTable"],
  ];
  $(".review-stage").innerHTML = reviews.map(([quote, person, source], index) => `<article${index ? " hidden" : ""}><blockquote>“${quote}”</blockquote><div class="review-stars" aria-label="5 out of 5 stars">${icon("star").repeat(5)}</div><p class="review-person">${person}<span>${source}</span></p></article>`).join("");
  $(".review-dots").innerHTML = reviews.map((review, index) => `<button type="button" data-review="${index}" aria-label="Show review by ${review[1]}" aria-current="${index === 0}"></button>`).join("");
  let reviewIndex = 0;
  let reviewVisible = false;
  let paused = matchMedia("(prefers-reduced-motion:reduce)").matches;
  function setPause(value) {
    paused = value;
    $(".review-pause").textContent = paused ? "Resume reviews" : "Pause reviews";
    $(".review-pause").setAttribute("aria-pressed", String(paused));
  }
  setPause(paused);
  function showReview(index) {
    reviewIndex = (index + reviews.length) % reviews.length;
    $$(".review-stage article").forEach((article, current) => { article.hidden = current !== reviewIndex; });
    $$(".review-dots button").forEach((button, current) => button.setAttribute("aria-current", String(current === reviewIndex)));
  }
  $(".review-pause").addEventListener("click", () => setPause(!paused));
  $$("[data-review]").forEach((button) => button.addEventListener("click", () => showReview(Number(button.dataset.review))));
  $('[aria-label="Previous review"]').addEventListener("click", () => showReview(reviewIndex - 1));
  $('[aria-label="Next review"]').addEventListener("click", () => showReview(reviewIndex + 1));
  $(".review-stage").addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault(); showReview(event.key === "Home" ? 0 : event.key === "End" ? 2 : reviewIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  let touchStart;
  $(".review-stage").addEventListener("pointerdown", (event) => { if (event.pointerType === "touch") touchStart = [event.clientX, event.clientY]; });
  $(".review-stage").addEventListener("pointerup", (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart[0];
    const dy = event.clientY - touchStart[1];
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showReview(reviewIndex + (dx < 0 ? 1 : -1));
  });
  $(".review-stage").addEventListener("pointercancel", () => { touchStart = null; });
  new IntersectionObserver(([entry]) => { reviewVisible = entry.isIntersecting; }, { threshold: .35 }).observe($(".review-stage"));
  setInterval(() => {
    if (!paused && reviewVisible && !document.hidden && !$("#reviews").matches(":hover,:focus-within")) showReview(reviewIndex + 1);
  }, 6000);
  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function weekday(value) { return value ? new Date(`${value}T12:00:00`).getDay() : null; }
  function checkDate(input) {
    input.min = today();
    input.setCustomValidity(weekday(input.value) === 1 ? "Our kitchen is closed on Mondays. Please choose Tuesday through Sunday." : "");
  }
  function requireWords(form) {
    $$("input[required]:not([type=date]):not([type=number]):not([type=email]):not([type=tel]),textarea[required]", form).forEach((field) => {
      const validate = () => field.setCustomValidity(field.value.trim() ? "" : "Please enter more than spaces.");
      field.addEventListener("input", validate);
    });
  }
  const booking = $("#reservation-form");
  const time = $('[name="time"]', booking);
  const date = $('[name="date"]', booking);
  $('[name="party"]', booking).innerHTML = Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? "guests" : "guest"}</option>`).join("");
  function reservationSchedule() {
    checkDate(date);
    const previous = time.value;
    const sunday = weekday(date.value) === 0;
    time.innerHTML = Array.from({ length: sunday ? 8 : 10 }, (_, index) => {
      const hour = (sunday ? 10 : 17) + Math.floor(index / 2);
      const minute = index % 2 ? "30" : "00";
      const value = `${String(hour).padStart(2, "0")}:${minute}`;
      return `<option value="${value}">${hour % 12 || 12}:${minute} ${hour < 12 ? "AM" : "PM"}</option>`;
    }).join("");
    if ($$("option", time).some((option) => option.value === previous)) time.value = previous;
  }
  reservationSchedule();
  date.addEventListener("input", reservationSchedule);
  date.addEventListener("focus", () => checkDate(date));
  requireWords(booking);
  booking.addEventListener("submit", (event) => {
    event.preventDefault();
    checkDate(date);
    $$('[name="name"]', booking).forEach((field) => field.setCustomValidity(field.value.trim() ? "" : "Please enter your name."));
    if (!booking.reportValidity()) return;
    const fields = new FormData(booking);
    const result = $("#reservation-result");
    result.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = "A little plan for your table.";
    const summary = document.createElement("p");
    summary.textContent = `${fields.get("name").trim()} · ${fields.get("party")} guest(s) · ${fields.get("date")} at ${time.selectedOptions[0].textContent}${fields.get("requests").trim() ? ` · Notes: ${fields.get("requests").trim()}` : ""}`;
    const note = document.createElement("p");
    note.textContent = "Local preview only. No table has been reserved, no contact details saved, and no message or confirmation email sent.";
    result.append(heading, summary, note);
    result.hidden = false;
    booking.reset();
    reservationSchedule();
    result.focus();
  });
  const eventPast = () => today() > "2026-04-18";
  $("#event-timing").textContent = eventPast() ? "Archived spring event · April 18, 2026 has passed. No current seats are offered." : "Fictional spring event · No live availability or ticket sales.";
  const infoDialog = $("#info-dialog");
  const openInfoDialog = attachDialog(infoDialog);
  const farms = [
    ["Sunnyside Organic Farm", "fields.jpg", "8 miles", "Heirloom tomatoes, leafy greens and herbs. Our imagined first stop for bright, just-picked flavors.", "Seasonal crop rows and early harvests inspire the starters, salads and herb finishes in this sample menu."],
    ["Blue Ridge Creamery", "cows.jpg", "22 miles", "Artisan cheeses, fresh butter and crème fraîche. A fictional small-batch partner for the richest little details.", "From burrata to mint crème fraîche and brown butter, this menu celebrates the craft of dairy producers."],
    ["Willow Creek Ranch", "pasture.jpg", "15 miles", "Grass-fed beef, heritage pork and free-range eggs. An imagined ranch with a respect for the land.", "The sample ribeye, pork chop and farm egg tartine are tributes to pasture-based producers."],
  ];
  const info = {
    menu: ["The Spring Table", `<p>Our complete Spring 2026 sample menu. Archived concept pricing, not live availability. Please discuss allergies and dietary needs before ordering at a real venue.</p>${Object.entries(menus).map(([course, dishes]) => `<section><h3>${course[0].toUpperCase() + course.slice(1)}</h3>${dishes.map(dish).join("")}</section>`).join("")}`],
    dinner: ["A Dinner in the Fields", `<img class="dialog-photo" src="assets/patio.jpg" alt="Outdoor tables beneath glowing garden string lights"><h3>Spring Harvest Dinner at Sunnyside Farm</h3><p>April 18, 2026 · A five-course meal with ingredients harvested that afternoon · $125 per person, wine pairing included.</p><p>${eventPast() ? "This date has passed. This archived event cannot be booked." : "This is a fictional event preview, with no live seats or ticket sales."}</p><p>No payment or reservation is possible here. Wine pairing is an illustrative 21+ option; ask a real host about an alcohol-free alternative. Explore the imagined farm partners or the Stay in Season demo below.</p>`],
    directions: ["A Place in the Imagination", "<p>412 Elm Street, Ashford Valley, OR 97520 is a fictional restaurant address. The embedded illustration is a schematic, not a navigation map.</p><p>Sample parking information: free lot behind the building, street parking available. Telephone and email links use the supplied concept contact details, not a verified business.</p>"],
    privacy: ["A Simple Privacy Note", "<p>This static demo has no analytics, accounts, tracking cookies or server submissions. Forms show local previews in this tab, clear contact fields on completion, and never write local or session storage.</p><p>All fonts and images load locally. Phone or email links open your chosen app only when selected. The fictional business has no live social profiles.</p>"],
    instagram: ["Scenes from the Season", "<p>This fictional restaurant has no connected Instagram account. Explore our local gallery for the atmosphere instead. No external profile or feed is loaded.</p>"],
    facebook: ["Around Our Table", "<p>This fictional restaurant has no connected Facebook page, community feed or event tickets. The Farm Dinners section is an archived local example.</p>"],
    yelp: ["Kind Words, Illustratively", "<p>The Yelp review is fictional copy from the original restaurant concept, not a verified review or rating. No live Yelp profile is connected.</p>"],
  };
  function privateInquiry() {
    $("#info-title").textContent = "Make It Your Own.";
    $("#info-content").innerHTML = `<p>Private dining for up to 24 guests, Tuesday–Sunday evenings, with custom sample menus. Preview an inquiry locally; no message will be sent.</p><form class="private-form"><label>Name<input name="name" maxlength="80" required></label><label>Email<input type="email" name="email" maxlength="150" required></label><label>Event date<input type="date" name="date" min="${today()}" required></label><label>Guests<input name="guests" type="number" min="1" max="24" step="1" value="12" required></label><label>Tell us a little about your occasion<textarea name="message" rows="3" maxlength="1000" required></textarea></label><button class="button" type="submit">Preview Inquiry ${icon("arrow")}</button><div class="private-result result" role="status" tabindex="-1" hidden></div></form>`;
    const form = $(".private-form");
    requireWords(form);
    const inputDate = $('[name="date"]', form);
    inputDate.addEventListener("input", () => checkDate(inputDate));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      checkDate(inputDate);
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const result = $(".private-result");
      result.textContent = `Inquiry preview: ${data.get("name").trim()} · ${data.get("guests")} guests · ${data.get("date")} · ${data.get("message").trim()}. No message was sent, no event reserved, and no contact details saved.`;
      result.hidden = false;
      form.reset();
      result.focus();
    });
  }
  document.addEventListener("click", (event) => {
    const farmButton = event.target.closest("[data-farm]");
    const infoButton = event.target.closest("[data-info]");
    if (farmButton) {
      const [name, photo, distance, products, story] = farms[Number(farmButton.dataset.farm)];
      $("#info-title").textContent = name;
      $("#info-content").innerHTML = `<img class="dialog-photo" src="assets/${photo}" alt="Illustrative farm photography"><p class="eyebrow sage">${distance} from our imagined kitchen</p><p>${products}</p><p>${story}</p><p class="disclaimer">Fictional partner, distance and sourcing claims. Stock photography is illustrative, not a verified farm visit or affiliation.</p>`;
      openInfoDialog();
    } else if (infoButton) {
      if (infoButton.dataset.info === "private") privateInquiry();
      else {
        const [title, content] = info[infoButton.dataset.info];
        $("#info-title").textContent = title;
        $("#info-content").innerHTML = content;
      }
      openInfoDialog();
    }
  });
  infoDialog.addEventListener("close", () => $("#info-content").replaceChildren());
  $("#newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    $("#newsletter-status").textContent = "A note, just for this moment. Local demo only: no subscription created, email sent or address stored.";
    event.currentTarget.reset();
  });
})();
