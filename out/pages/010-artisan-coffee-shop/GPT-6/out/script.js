const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"></use></svg>`;
const money = (cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const products = new Map([
  ["ethiopia", { name: "Ethiopia Yirgacheffe", price: 1900 }],
  ["colombia", { name: "Colombia Huila", price: 1700 }],
  ["ember", { name: "House Blend - Ember", price: 1500 }],
]);
const drinks = new Map([
  ["lavender", { name: "Lavender Oat Latte", price: 650 }],
  ["flight", { name: "Cold Brew Flight", price: 900 }],
  ["matcha", { name: "Matcha Rose Latte", price: 700 }],
  ["drip", { name: "Classic Drip", price: 350 }],
]);
const storageKey = "ember-bloom-coffee-bag-v1";
let cart = {};
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (saved && typeof saved === "object" && !Array.isArray(saved)) {
    for (const [id, quantity] of Object.entries(saved)) {
      if (products.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 20) cart[id] = quantity;
    }
  }
} catch {
  cart = {};
}

let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 3000);
}

function openDialog(dialog) {
  $$("dialog[open]").forEach((open) => open.close());
  dialog.showModal();
}

$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$$("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
});
$("#mobile-toggle").addEventListener("click", () => {
  openDialog($("#mobile-nav"));
  $("#mobile-toggle").setAttribute("aria-expanded", "true");
});
$("#mobile-nav").addEventListener("close", () => $("#mobile-toggle").setAttribute("aria-expanded", "false"));
$$('#mobile-nav a').forEach((link) => link.addEventListener("click", () => $("#mobile-nav").close()));

const subtotal = () => Object.entries(cart).reduce((sum, [id, quantity]) => sum + products.get(id).price * quantity, 0);
function saveCart() {
  try { localStorage.setItem(storageKey, JSON.stringify(cart)); } catch { /* The bag still works when browser storage is unavailable. */ }
}
function renderCart() {
  const quantity = Object.values(cart).reduce((sum, count) => sum + count, 0);
  $$(".cart-count").forEach((badge) => { badge.textContent = quantity; });
  $$("[data-open-cart]").forEach((button) => button.setAttribute("aria-label", `Open shopping bag, ${quantity} ${quantity === 1 ? "item" : "items"}`));
  const items = $("#cart-items");
  items.replaceChildren();
  $("#cart-summary").hidden = quantity === 0;
  $("#cart-message").textContent = "";
  if (!quantity) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.innerHTML = `${icon("bag")}<h3>A little room for a new ritual.</h3><p>Your coffee bag is empty. Find your next favorite roast.</p><button class="button" type="button">Explore Our Coffee ${icon("arrow")}</button>`;
    empty.querySelector("button").addEventListener("click", () => {
      $("#cart-dialog").close();
      $("#shop").scrollIntoView();
    });
    items.append(empty);
  }
  for (const [id, count] of Object.entries(cart)) {
    const product = products.get(id);
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `<svg viewBox="0 0 400 420" role="img" aria-label="${product.name} illustrated coffee bag"><use href="assets/coffee-bags.svg#${id}"></use></svg><div><h3>${product.name}</h3><p>12oz whole bean &middot; ${money(product.price)} each</p><div class="quantity-controls"><button class="icon-button" type="button" data-quantity="-1" aria-label="Decrease ${product.name} quantity">${icon("minus")}</button><span aria-label="Quantity">${count}</span><button class="icon-button" type="button" data-quantity="1" aria-label="Increase ${product.name} quantity" ${count === 20 ? "disabled" : ""}>${icon("plus")}</button><button class="remove-button" type="button">Remove</button></div></div>`;
    row.querySelectorAll("[data-quantity]").forEach((button) => button.addEventListener("click", () => {
      const direction = Number(button.dataset.quantity);
      cart[id] = Math.min(20, cart[id] + direction);
      if (!cart[id]) delete cart[id];
      saveCart();
      renderCart();
      const replacement = $(`#cart-items [aria-label="${direction > 0 ? "Increase" : "Decrease"} ${product.name} quantity"]`);
      (replacement && !replacement.disabled ? replacement : $("#cart-dialog [data-close]")).focus();
    }));
    row.querySelector(".remove-button").addEventListener("click", () => {
      delete cart[id];
      saveCart();
      renderCart();
      ($("#cart-items button") || $("#cart-dialog [data-close]")).focus();
      toast(`${product.name} removed from your bag.`);
    });
    items.append(row);
  }
  $("#cart-total").textContent = money(subtotal());
}

$$("[data-add]").forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.add;
  if ((cart[id] || 0) >= 20) { toast("Your bag can hold up to 20 of each roast."); return; }
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  toast(`${products.get(id).name} added to your bag.`);
}));
$$("[data-open-cart]").forEach((button) => button.addEventListener("click", () => openDialog($("#cart-dialog"))));
$("#demo-checkout").addEventListener("click", () => {
  $("#cart-message").textContent = `Your ${money(subtotal())} coffee bag is ready to preview. This is a demo: no payment, shipping request or real order has been created.`;
});
renderCart();

function updatePickupTotal() {
  const quantity = Number($("#pickup-quantity").value);
  $("#pickup-total").textContent = money(drinks.get($("#pickup-drink").value).price * (Number.isInteger(quantity) && quantity >= 1 && quantity <= 10 ? quantity : 0));
}
$$("[data-pickup]").forEach((button) => button.addEventListener("click", () => {
  $("#pickup-form").reset();
  $("#pickup-form").hidden = false;
  $("#pickup-result").hidden = true;
  $("#pickup-drink").value = drinks.has(button.dataset.pickup) ? button.dataset.pickup : "lavender";
  updatePickupTotal();
  openDialog($("#pickup-dialog"));
}));
$("#pickup-form").addEventListener("input", updatePickupTotal);
$("#pickup-form").addEventListener("change", updatePickupTotal);
$("#pickup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!$("#pickup-name").value.trim()) { $("#pickup-name").setCustomValidity("Please enter your first name."); $("#pickup-name").reportValidity(); return; }
  const drink = drinks.get($("#pickup-drink").value);
  const count = Number($("#pickup-quantity").value);
  $("#pickup-confirmation").textContent = `${$("#pickup-name").value.trim()}, your demo is ${count} x ${drink.name} at ${$("#pickup-location").value}, totaling ${money(drink.price * count)}. Estimated pickup: 15-20 minutes in this fictional scenario. Nothing has been sent to a cafe or charged.`;
  $("#pickup-form").hidden = true;
  $("#pickup-result").hidden = false;
  $("#pickup-result button").focus();
});
$("#pickup-name").addEventListener("input", (event) => event.target.setCustomValidity(""));

$("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#newsletter-message").textContent = "Welcome to the demo list! Your sample code is FIRSTBREW10. No email was sent or saved.";
  $("#newsletter-form").reset();
});
$("#join-rewards").addEventListener("click", () => {
  $("#rewards-form").reset();
  $("#rewards-message").textContent = "";
  openDialog($("#rewards-dialog"));
});
$("#rewards-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $("#rewards-message").textContent = "Welcome to the demo club! 0 points to start, a free drink at 50. No account was created and your email was not saved.";
  $("#rewards-form").reset();
});

const information = {
  tours: ["A closer look at the roast.", "Visit our Pearl District flagship at 1028 NW Glisan St. The brief's roastery tours run Saturdays at 10am. This is a fictional cafe concept: tours cannot be booked from this static demo."],
  subscriptions: ["A fresh start, on repeat.", "The three whole-bean roasts in our shop are available to explore in the demo cart. Recurring subscriptions, billing and deliveries are not connected in this static concept."],
  wholesale: ["Better coffee, together.", "The concept roastery sources from 12 origin partners and roasts in 15-kilo lots. Wholesale enquiries and commercial accounts require a real business backend, which this static homepage does not include."],
  careers: ["Good people. Great coffee.", "Ember & Bloom is a fictional cafe concept. There are no real vacancies or applications to submit. Explore the story to learn about the brand imagined in the brief."],
  press: ["Kind words, good company.", "Portland Monthly, Eater Portland, Willamette Week and the Google review figures are supplied by the design brief. They are demonstration content, not verified endorsements."],
  social: ["Find us here, for now.", "This is a fictional cafe concept. No official Instagram, TikTok or Facebook accounts are connected, so this demo does not send you to an unrelated business."],
  contact: ["Hello, neighbor.", "Explore the four Portland addresses and opening hours in Find Your Corner. Ember & Bloom is fictional; this demo has no real email, phone number or contact submission service."],
  gifts: ["A little joy, by the cup.", "Gift cards are part of the cafe concept, but purchase, redemption and account balances are not connected. You can try the coffee cart without entering any payment information."],
  privacy: ["A little privacy, with your coffee.", "This static demo saves only product IDs and quantities in this browser's local storage. Email and pickup name fields are not sent, stored or used for marketing. Clear the coffee bag or browser site data to remove its saved items. Directions links open Google Maps, which has its own privacy policy."],
  terms: ["Made to explore.", "Ember & Bloom is a fictional homepage concept. Prices, offers, locations, dietary labels, hours and press quotes follow the supplied brief, not a verified operating business. No order, payment, account, subscription or delivery is created. Stock photos are illustrative; confirm allergens with a real cafe."],
};
$$("[data-info]").forEach((button) => button.addEventListener("click", () => {
  const [title, body] = information[button.dataset.info];
  $("#info-title").textContent = title;
  $("#info-body").textContent = body;
  $("#info-link").hidden = !["tours", "contact"].includes(button.dataset.info);
  openDialog($("#info-dialog"));
}));
$("#info-link").addEventListener("click", () => $("#info-dialog").close());

const track = $("#drink-track");
const dots = $$("[data-slide]");
function goToDrink(index) {
  const card = track.children[index];
  const offset = card.offsetLeft - track.children[0].offsetLeft;
  track.scrollTo({ left: offset, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
dots.forEach((dot) => dot.addEventListener("click", () => goToDrink(Number(dot.dataset.slide))));
track.addEventListener("keydown", (event) => {
  if (event.target !== track || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const width = track.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
  const index = Math.round(track.scrollLeft / width);
  goToDrink(event.key === "Home" ? 0 : event.key === "End" ? 3 : Math.max(0, Math.min(3, index + (event.key === "ArrowRight" ? 1 : -1))));
});
function syncDots() {
  const maximum = track.scrollWidth - track.clientWidth;
  const step = track.children[1].offsetLeft - track.children[0].offsetLeft;
  const index = maximum > 1 && track.scrollLeft >= maximum - 2 ? 3 : Math.round(track.scrollLeft / step);
  dots.forEach((dot, position) => {
    if (position === index) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  $("#drink-dots").hidden = maximum <= 1;
}
track.addEventListener("scroll", syncDots, { passive: true });
window.addEventListener("resize", syncDots);
syncDots();
