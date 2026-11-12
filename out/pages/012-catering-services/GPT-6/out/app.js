(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const nav = $("#navigation");
  const navButton = $(".nav-toggle");
  const closeNav = () => {
    nav.classList.remove("open");
    navButton.setAttribute("aria-expanded", "false");
    navButton.setAttribute("aria-label", "Open navigation");
  };
  navButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navButton.setAttribute("aria-expanded", String(open));
    navButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", closeNav));
  document.addEventListener("click", (event) => {
    if (!$(".header").contains(event.target)) closeNav();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeNav();
      navButton.focus();
    }
  });
  matchMedia("(min-width: 851px)").addEventListener("change", closeNav);

  const packages = { classic: { title: "Classic", price: 35 }, premium: { title: "Premium", price: 55 }, luxury: { title: "Luxury", price: 85 } };
  const tabs = $$("[data-package]");
  const selectPackage = (key, focus = false) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.package === key;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      $(`#${tab.getAttribute("aria-controls")}`).hidden = !selected;
      if (selected && focus) tab.focus();
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectPackage(tab.dataset.package));
    tab.addEventListener("keydown", (event) => {
      const next = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectPackage(tabs[next].dataset.package, true);
    });
  });

  const figures = $$(".gallery-grid figure");
  $$("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-filter]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    figures.forEach((figure) => { figure.hidden = button.dataset.filter !== "all" && figure.dataset.category !== button.dataset.filter; });
  }));
  const lightbox = $("#lightbox");
  let photoIndex = 0;
  const visiblePhotos = () => figures.map((figure, index) => figure.hidden ? -1 : index).filter((index) => index >= 0);
  const showPhoto = (index) => {
    photoIndex = index;
    const image = $("img", figures[index]);
    $("#lightbox-image").src = image.src;
    $("#lightbox-image").alt = image.alt;
    $("#lightbox-caption").textContent = $("figcaption", figures[index]).textContent;
  };
  const movePhoto = (step) => {
    const visible = visiblePhotos();
    showPhoto(visible[(visible.indexOf(photoIndex) + step + visible.length) % visible.length]);
  };
  $$("[data-gallery]").forEach((button) => button.addEventListener("click", () => {
    showPhoto(Number(button.dataset.gallery));
    lightbox.showModal();
  }));
  $("#photo-previous").addEventListener("click", () => movePhoto(-1));
  $("#photo-next").addEventListener("click", () => movePhoto(1));
  lightbox.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    movePhoto(event.key === "ArrowRight" ? 1 : -1);
  });
  $$("dialog").forEach((dialog) => {
    $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
  });
  const socialDialog = $("#social-dialog");
  $$("[data-social]").forEach((button) => button.addEventListener("click", () => {
    $("#social-title").textContent = `${button.dataset.social}, imagined.`;
    $("#social-message").textContent = `This ${button.dataset.social} control is a local demonstration, not a link to a real business profile.`;
    socialDialog.showModal();
  }));
  $(".social-done").addEventListener("click", () => socialDialog.close());

  const reviews = $$("[data-review]");
  const reviewNames = ["Sarah and James", "Michael", "Priya"];
  let reviewIndex = 0;
  const showReview = (index) => {
    reviewIndex = (index + reviews.length) % reviews.length;
    reviews.forEach((review, position) => { review.hidden = position !== reviewIndex; });
    $$("[data-review-select]").forEach((button, position) => button.setAttribute("aria-current", String(position === reviewIndex)));
    $("#review-status").textContent = `${reviewNames[reviewIndex]} testimonial`;
  };
  $$("[data-review-step]").forEach((button) => button.addEventListener("click", () => showReview(reviewIndex + Number(button.dataset.reviewStep))));
  $$("[data-review-select]").forEach((button) => button.addEventListener("click", () => showReview(Number(button.dataset.reviewSelect))));
  const carousel = $(".review-carousel");
  carousel.addEventListener("keydown", (event) => {
    const next = { ArrowRight: reviewIndex + 1, ArrowLeft: reviewIndex - 1, Home: 0, End: reviews.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    showReview(next);
  });
  let swipe;
  carousel.addEventListener("pointerdown", (event) => {
    if (event.isPrimary && event.pointerType !== "mouse" && !event.target.closest("button")) swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  carousel.addEventListener("pointerup", (event) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy)) showReview(reviewIndex + (dx < 0 ? 1 : -1));
  });
  carousel.addEventListener("pointercancel", () => { swipe = null; });

  const form = $("#inquiry-form");
  const field = (name) => form.elements.namedItem(name);
  const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  const localDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };
  field("date").min = localDate();
  const updateEstimate = () => {
    const guests = Number(field("guests").value);
    const valid = Number.isInteger(guests) && guests >= 20 && guests <= 500;
    $("#estimate").textContent = valid ? `${money(guests * packages[field("package").value].price)} for ${guests} guests` : "Add 20 to 500 guests";
  };
  field("guests").addEventListener("input", updateEstimate);
  field("package").addEventListener("change", updateEstimate);
  $$("[data-event]").forEach((link) => link.addEventListener("click", () => {
    field("event").value = link.dataset.event;
    revealForm();
  }));
  $$("[data-choose]").forEach((link) => link.addEventListener("click", () => {
    field("package").value = link.dataset.choose;
    updateEstimate();
    revealForm();
  }));
  const validateText = (input) => input.setCustomValidity(input.value.trim().length < 2 ? "Please enter at least two non-space characters." : "");
  for (const name of ["name", "venue"]) field(name).addEventListener("input", () => validateText(field(name)));
  field("date").addEventListener("input", () => {
    field("date").min = localDate();
    field("date").setCustomValidity(field("date").value && field("date").value < localDate() ? "Choose today or a future event date." : "");
  });
  function revealForm() {
    form.hidden = false;
    $("#inquiry-result").hidden = true;
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    for (const name of ["name", "venue"]) validateText(field(name));
    field("date").min = localDate();
    if (!form.reportValidity()) return;
    const guests = Number(field("guests").value);
    const menu = packages[field("package").value];
    $("#result-message").textContent = `Thank you, ${field("name").value.trim()}. Here's a local preview of your ${field("event").value.toLowerCase()} inquiry.`;
    const summary = [["Occasion", field("event").value], ["Guests", String(guests)], ["Date", new Date(`${field("date").value}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
      ["Venue", field("venue").value.trim()], ["Menu", `${menu.title} · ${money(menu.price)} / person`], ["Food estimate", money(guests * menu.price)], ["Contact", field("email").value], ["Phone", field("phone").value]];
    if (field("notes").value.trim()) summary.push(["Notes", field("notes").value.trim()]);
    $("#result-details").replaceChildren(...summary.map(([label, value]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));
    form.hidden = true;
    $("#inquiry-result").hidden = false;
    $("#inquiry-result").focus();
  });
  $("#new-inquiry").addEventListener("click", () => {
    form.reset();
    for (const name of ["name", "venue", "date"]) field(name).setCustomValidity("");
    field("date").min = localDate();
    $("#result-details").replaceChildren();
    $("#result-message").textContent = "";
    updateEstimate();
    revealForm();
    field("name").focus();
  });
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame;
  function parallax() {
    frame = null;
    $(".hero-image").style.transform = motion.matches || innerWidth <= 600 ? "" : `translateY(${Math.min(scrollY * .12, 100)}px)`;
  }
  addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(parallax); }, { passive: true });
  addEventListener("resize", parallax);
  motion.addEventListener("change", parallax);
})();
