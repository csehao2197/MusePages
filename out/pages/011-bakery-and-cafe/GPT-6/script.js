"use strict";

const icon = (name, title = "") => `<svg ${title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"'}><use href="assets/icons.svg#${name}"/></svg>`;
const products = [
  ["sourdough", "Breads", "Sourdough Boule", 850, "48-hour fermented. Crackling crust, soft center.", "bread", ["vegan"]],
  ["multigrain", "Breads", "Multigrain Farmhouse Loaf", 900, "Hearty whole grains, toasted seeds, a little patience.", "bread", ["vegan"]],
  ["ciabatta", "Breads", "Ciabatta", 650, "An airy Italian classic with a crisp, golden crust.", "bread", ["vegan"]],
  ["focaccia", "Breads", "Olive Rosemary Focaccia", 775, "Fluffy, olive-studded and finished with fresh rosemary.", "bread", ["vegan"]],
  ["rye", "Breads", "Rye Pumpernickel", 800, "Deeply toasted rye with a rich, earthy finish.", "bread", ["vegan"]],
  ["baguette", "Breads", "Baguette", 450, "Our everyday French loaf. Best shared, still warm.", "bread", ["vegan"]],
  ["almond-croissant", "Pastries", "Almond Croissant", 575, "Twice-baked with almond cream and toasted almonds.", "croissant", ["nuts"]],
  ["butter-croissant", "Pastries", "Butter Croissant", 450, "Local butter, delicate layers, beautifully golden.", "croissant", []],
  ["cinnamon-roll", "Pastries", "Brown Butter Cinnamon Roll", 525, "Soft spirals with cinnamon and brown butter glaze.", "pastries", []],
  ["lemon-scone", "Pastries", "Lemon Poppy Seed Scone", 425, "A tender crumb and a bright lemon glaze.", "pastries", []],
  ["pain-chocolat", "Pastries", "Pain au Chocolat", 500, "Flaky pastry wrapped around dark chocolate.", "croissant", []],
  ["seasonal-tart", "Pastries", "Seasonal Fruit Tart", 650, "Market fruit over vanilla cream and almond pastry.", "pastries", ["nuts"]],
  ["avocado-toast", "Breakfast", "Avocado Sourdough Toast", 1100, "Smashed avocado, lemon and chili on sourdough.", "breakfast", ["vegan"]],
  ["breakfast-sandwich", "Breakfast", "The Breakfast Sandwich", 1050, "Soft eggs, cheddar and herb butter on a warm bun.", "breakfast", []],
  ["granola", "Breakfast", "House Granola & Yogurt", 825, "Creamy yogurt, almond granola and seasonal fruit.", "breakfast", ["nuts", "gf"]],
  ["porridge", "Breakfast", "Apple & Cinnamon Oats", 750, "Warm oat milk porridge, apple compote and maple.", "breakfast", ["vegan", "gf"]],
  ["tomato-tartine", "Lunch", "Roasted Tomato Tartine", 1250, "Slow-roasted tomatoes, whipped ricotta, basil.", "breakfast", []],
  ["grilled-cheese", "Lunch", "Three-Cheese Sourdough", 1150, "Cheddar, gruyere and mozzarella, perfectly toasted.", "breakfast", []],
  ["seasonal-soup", "Lunch", "Seasonal Soup & Bread", 1000, "A comforting bowl, with a slice of today's sourdough.", "bread", ["vegan"]],
  ["green-salad", "Lunch", "Village Green Salad", 1100, "Market greens, apples, toasted nuts and cider dressing.", "breakfast", ["vegan", "nuts", "gf"]],
  ["lavender-latte", "Coffee & Drinks", "Lavender Honey Latte", 625, "House espresso, local honey and a hint of lavender.", "latte", []],
  ["flat-white", "Coffee & Drinks", "Flat White", 450, "A double shot and silky steamed milk.", "latte", []],
  ["americano", "Coffee & Drinks", "Americano", 350, "Our house espresso, lengthened with hot water.", "barista", ["vegan"]],
  ["cold-brew", "Coffee & Drinks", "Slow-Steeped Cold Brew", 500, "Smooth, chocolatey and steeped overnight.", "barista", ["vegan"]],
  ["matcha", "Coffee & Drinks", "Oat Matcha Latte", 575, "Ceremonial-style matcha, creamy oat milk.", "latte", ["vegan"]],
  ["tea", "Coffee & Drinks", "Loose-Leaf Tea", 375, "Choose Earl Grey, mint or chamomile at pickup.", "latte", ["vegan"]],
].map(([id, category, name, price, description, image, diets]) => ({ id, category, name, price, description, image, diets }));
const catalog = new Map(products.map((product) => [product.id, product]));
const categories = [...new Set(products.map((product) => product.category))];
const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const dietNames = { vegan: ["leaf", "Vegan"], gf: ["wheat-off", "Gluten-free option"], nuts: ["nut", "Contains nuts"] };
const storageKey = "golden-crumb-cart-v1";
let storageAvailable = true;
let cart = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (Array.isArray(saved)) {
    const quantities = new Map();
    for (const item of saved) {
      if (item && catalog.has(item.id) && Number.isInteger(item.quantity) && item.quantity > 0) {
        quantities.set(item.id, Math.min(20, (quantities.get(item.id) || 0) + item.quantity));
      }
    }
    cart = [...quantities].map(([id, quantity]) => ({ id, quantity }));
  }
} catch { storageAvailable = false; }

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
document.querySelectorAll('input[type="date"]').forEach((input) => { input.min = today(); });
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { storageAvailable = false; }
}
let toastTimer;
function toast(message) {
  const node = document.getElementById("toast");
  node.textContent = message;
  node.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("visible"), 3000);
}
function openDialog(id) {
  for (const dialog of document.querySelectorAll("dialog[open]")) dialog.close();
  const dialog = document.getElementById(id);
  dialog.showModal();
  document.body.classList.add("modal-open");
}
for (const dialog of document.querySelectorAll("dialog")) {
  dialog.addEventListener("close", () => document.body.classList.toggle("modal-open", !!document.querySelector("dialog[open]")));
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}
function menuItem(product) {
  const diets = product.diets.map((diet) => icon(...dietNames[diet])).join("");
  return `<article class="menu-item"><img src="assets/${product.image}.jpg" alt="" width="80" height="80" loading="lazy"><div class="menu-item-copy"><h3>${product.name}</h3><p>${product.description}</p><div class="menu-item-bottom"><span>${money(product.price)}</span><span class="dietary-icons">${diets}</span></div></div><button class="menu-add" data-add="${product.id}" aria-label="Add ${product.name}">${icon("plus")}</button></article>`;
}
function selectCategory(category, focus = false) {
  document.querySelectorAll("[data-category]").forEach((tab) => {
    const selected = tab.dataset.category === category;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) {
      document.getElementById("menu-items").setAttribute("aria-labelledby", tab.id);
      if (focus) { tab.focus(); tab.scrollIntoView({ block: "nearest", inline: "nearest" }); }
    }
  });
  document.getElementById("menu-items").innerHTML = products.filter((product) => product.category === category).map(menuItem).join("");
}
selectCategory("Breads");
document.getElementById("full-menu-content").innerHTML = categories.map((category) => `<section class="full-menu-category"><h3>${category}</h3>${products.filter((product) => product.category === category).map((product) => `<div class="full-menu-row"><span>${product.name}</span><strong>${money(product.price)}</strong><button class="menu-add" data-add="${product.id}" aria-label="Add ${product.name}">${icon("plus")}</button></div>`).join("")}</section>`).join("");
document.querySelector(".menu-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const current = categories.indexOf(event.target.dataset.category);
  const next = event.key === "Home" ? 0 : event.key === "End" ? categories.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + categories.length) % categories.length;
  selectCategory(categories[next], true);
});
const subtotal = () => cart.reduce((total, item) => total + catalog.get(item.id).price * item.quantity, 0);
function updatePickup() {
  const input = document.getElementById("pickup-date");
  const select = document.getElementById("pickup-time");
  const previous = select.value;
  input.min = today();
  input.setCustomValidity("");
  select.replaceChildren(new Option("Choose a pickup window", ""));
  select.disabled = !input.value;
  let note = "Closed Mondays. Sundays: pastries & coffee only.";
  if (input.value) {
    const date = new Date(`${input.value}T12:00:00`);
    const day = date.getDay();
    if (input.value < today()) {
      input.setCustomValidity("Choose today or a future pickup day.");
    } else if (day === 1) {
      input.setCustomValidity("Monday is baking day. Please choose Tuesday through Sunday.");
      select.disabled = true;
      note = "Closed on Mondays. Choose another pickup day.";
    } else {
      const start = day === 0 ? 8 * 60 : 7 * 60;
      const end = (day === 0 ? 14 : day === 6 ? 15 : 16) * 60;
      for (let minute = start; minute < end; minute += 30) {
        const value = `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
        const hour = Math.floor(minute / 60);
        const label = `${hour % 12 || 12}:${String(minute % 60).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
        select.add(new Option(`${label} · 30-minute window`, value));
      }
      if ([...select.options].some((option) => option.value === previous)) select.value = previous;
      if (day === 0 && cart.some((item) => !["Pastries", "Coffee & Drinks"].includes(catalog.get(item.id).category))) {
        input.setCustomValidity("Sundays offer pastries and coffee only. Choose another day for this bag.");
        note = "Your bag includes bread or meals. Choose Tuesday–Saturday; Sundays are pastries & coffee only.";
      } else {
        note = "Illustrative windows only. No live availability is checked or reserved.";
      }
    }
  }
  document.getElementById("pickup-note").textContent = note;
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => { node.textContent = count; });
  document.querySelector(".bag-button").setAttribute("aria-label", `Shopping bag, ${count} items`);
  const success = !document.getElementById("pickup-success").hidden;
  document.getElementById("cart-empty").hidden = count > 0 || success;
  document.getElementById("pickup-form").hidden = count === 0;
  document.getElementById("cart-total-row").hidden = count === 0;
  document.getElementById("cart-total").textContent = money(subtotal());
  document.getElementById("cart-lines").innerHTML = cart.map((item) => {
    const product = catalog.get(item.id);
    return `<article class="cart-line"><img src="assets/${product.image}.jpg" alt="" width="60" height="60"><div><h3>${product.name}</h3><div class="quantity-controls"><button class="icon-button" data-quantity="-1" data-id="${item.id}" aria-label="Decrease ${product.name} quantity">${icon("minus")}</button><span>${item.quantity}</span><button class="icon-button" data-quantity="1" data-id="${item.id}" aria-label="Increase ${product.name} quantity" ${item.quantity >= 20 ? "disabled" : ""}>${icon("plus")}</button><button class="remove-item" data-remove="${item.id}">Remove</button></div></div><strong>${money(product.price * item.quantity)}</strong></article>`;
  }).join("");
  document.getElementById("cart-storage-note").textContent = storageAvailable ? "Bag items may be saved on this browser. Contact details are never saved." : "Browser storage is unavailable. Your bag lasts for this visit only.";
  updatePickup();
}
function addProduct(id) {
  if (!catalog.has(id)) return;
  document.getElementById("pickup-success").hidden = true;
  const existing = cart.find((item) => item.id === id);
  if (existing?.quantity === 20) return toast("Up to 20 of each item can be added to the demo bag.");
  if (existing) existing.quantity++;
  else cart.push({ id, quantity: 1 });
  persist();
  renderCart();
  toast(`${catalog.get(id).name} added to your bag.`);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) return;
  if (button.hasAttribute("data-close")) button.closest("dialog").close();
  if (button.hasAttribute("data-close-link")) button.closest("dialog").close();
  if (button.dataset.open) openDialog(button.dataset.open);
  if (button.hasAttribute("data-open-cart")) {
    document.getElementById("pickup-success").hidden = true;
    renderCart();
    openDialog("cart-dialog");
  }
  if (button.dataset.add) addProduct(button.dataset.add);
  if (button.dataset.category) selectCategory(button.dataset.category);
  if (button.dataset.footerCategory) {
    selectCategory(button.dataset.footerCategory);
    document.getElementById("menu").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  if (button.hasAttribute("data-quantity")) {
    const item = cart.find((entry) => entry.id === button.dataset.id);
    if (!item) return;
    item.quantity = Math.min(20, item.quantity + Number(button.dataset.quantity));
    cart = cart.filter((entry) => entry.quantity > 0);
    persist();
    renderCart();
    (document.querySelector(`[data-id="${button.dataset.id}"][data-quantity="${button.dataset.quantity}"]`) || document.getElementById("cart-title")).focus();
  }
  if (button.dataset.remove) {
    cart = cart.filter((item) => item.id !== button.dataset.remove);
    persist();
    renderCart();
    document.getElementById("cart-title").focus();
  }
  if (button.dataset.info) {
    const story = button.dataset.info === "story";
    document.getElementById("info-title").textContent = story ? "A Starter, a Stand, a Neighborhood" : "A Little Social Preview";
    const content = document.getElementById("info-content");
    content.replaceChildren();
    const paragraphs = story ? [
      "In 2018, Elena and Marcus brought a folding table, a basket of sourdough and a shared dream to their first farmers market. They sold out before lunch. The next Saturday, they brought twice as much.",
      "Golden Crumb grew from those slow Saturday mornings. Our imagined neighborhood kitchen celebrates long fermentation, local ingredients and the simple pleasure of sharing something handmade.",
      "This is a fictional bakery story created for this homepage. The people and food in stock photographs are illustrative, not the named owners or actual products.",
    ] : [
      `Follow the spirit of Golden Crumb on ${button.dataset.info === "tiktok" ? "TikTok" : button.dataset.info === "facebook" ? "Facebook" : "Instagram"}: daily bakes, behind-the-scenes moments and a little flour on everything.`,
      "@goldencrumb is a fictional brand handle in this demo. No live social account is connected; we do not direct you to an unrelated account.",
    ];
    for (const text of paragraphs) { const paragraph = document.createElement("p"); paragraph.textContent = text; content.append(paragraph); }
    openDialog("info-dialog");
  }
});
document.querySelectorAll("#nav-dialog a").forEach((link) => link.addEventListener("click", () => document.getElementById("nav-dialog").close()));
document.getElementById("pickup-date").addEventListener("change", updatePickup);
document.getElementById("pickup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  updatePickup();
  const form = event.currentTarget;
  if (!cart.length || !form.reportValidity()) return;
  const window = document.getElementById("pickup-time").value;
  if (!window) return;
  const success = document.getElementById("pickup-success");
  success.textContent = `Your ${money(subtotal())} pickup preview is ready for ${document.getElementById("pickup-date").value} at ${window}. No order was sent, payment taken or pickup reserved. Thanks for trying Golden Crumb!`;
  success.hidden = false;
  cart = [];
  persist();
  form.reset();
  renderCart();
  success.tabIndex = -1;
  success.focus();
});
document.getElementById("newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.querySelector(".form-note").textContent = "Welcome to the demo Crumb Club! Preview code: CRUMB10. No email was sent or address saved.";
  event.currentTarget.reset();
});
for (const id of ["catering", "subscription"]) {
  document.getElementById(`${id}-form`).addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (id === "catering") {
      document.getElementById("catering-date").min = today();
      if (!form.reportValidity()) return;
      form.querySelector(".form-note").textContent = `Your ${new FormData(form).get("event").toLowerCase()} preview for ${new FormData(form).get("guests")} guests is ready. No quote request was sent or event reserved.`;
    } else {
      const gift = new FormData(form).get("plan") === "gift";
      form.querySelector(".form-note").textContent = `${gift ? "Four-week gift: $128 total" : "Weekly bread box: $32/week"}. Preview ready! No subscription was created, personal details saved or payment taken.`;
    }
    form.reset();
  });
}
let photo = 0;
const photos = [...document.querySelectorAll("[data-photo]")];
function showPhoto(index) {
  photo = (index + photos.length) % photos.length;
  const source = photos[photo].querySelector("img");
  const image = document.getElementById("lightbox-image");
  image.src = source.getAttribute("src");
  image.alt = source.alt;
  document.getElementById("lightbox-caption").textContent = photos[photo].querySelector("span").textContent.trim();
}
photos.forEach((button, index) => button.addEventListener("click", () => { showPhoto(index); openDialog("lightbox"); }));
document.getElementById("photo-previous").addEventListener("click", () => showPhoto(photo - 1));
document.getElementById("photo-next").addEventListener("click", () => showPhoto(photo + 1));
document.getElementById("lightbox").addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); showPhoto(photo + (event.key === "ArrowRight" ? 1 : -1)); }
});
const reviews = [...document.querySelectorAll("[data-review]")];
const dots = [...document.querySelectorAll("[data-review-dot]")];
const carousel = document.getElementById("review-carousel");
const pauseButton = document.getElementById("review-pause");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let review = 0;
let paused = reducedMotion.matches;
let reviewTimer;
function showReview(index) {
  review = (index + reviews.length) % reviews.length;
  reviews.forEach((node, i) => { node.hidden = i !== review; });
  dots.forEach((dot, i) => i === review ? dot.setAttribute("aria-current", "true") : dot.removeAttribute("aria-current"));
}
function restartReviews() {
  clearInterval(reviewTimer);
  reviewTimer = setInterval(() => {
    if (!paused && !document.hidden && !carousel.matches(":hover") && !carousel.contains(document.activeElement)) showReview(review + 1);
  }, 5000);
}
function updatePause() { pauseButton.textContent = paused ? "Play reviews" : "Pause reviews"; pauseButton.setAttribute("aria-pressed", String(paused)); }
pauseButton.addEventListener("click", () => { paused = !paused; updatePause(); restartReviews(); });
reducedMotion.addEventListener("change", () => { paused = reducedMotion.matches; updatePause(); restartReviews(); });
dots.forEach((dot, index) => dot.addEventListener("click", () => { showReview(index); restartReviews(); }));
carousel.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  showReview(event.key === "Home" ? 0 : event.key === "End" ? reviews.length - 1 : review + (event.key === "ArrowRight" ? 1 : -1));
  restartReviews();
});
let touch;
carousel.addEventListener("touchstart", (event) => { const point = event.changedTouches[0]; touch = { x: point.clientX, y: point.clientY }; }, { passive: true });
carousel.addEventListener("touchend", (event) => {
  if (!touch) return;
  const point = event.changedTouches[0];
  const dx = point.clientX - touch.x;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(point.clientY - touch.y)) { showReview(review + (dx < 0 ? 1 : -1)); restartReviews(); }
  touch = null;
}, { passive: true });
carousel.addEventListener("touchcancel", () => { touch = null; });
updatePause();
restartReviews();
let zoom = 1;
function zoomMap(change) {
  zoom = Math.max(1, Math.min(2, zoom + change));
  document.getElementById("neighborhood-map").style.transform = `scale(${zoom})`;
  document.getElementById("map-zoom-in").disabled = zoom === 2;
  document.getElementById("map-zoom-out").disabled = zoom === 1;
}
document.getElementById("map-zoom-in").addEventListener("click", () => zoomMap(.25));
document.getElementById("map-zoom-out").addEventListener("click", () => zoomMap(-.25));
const header = document.getElementById("site-header");
const updateHeader = () => header.classList.toggle("is-scrolled", scrollY > 50);
addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
renderCart();
