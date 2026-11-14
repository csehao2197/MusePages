(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const prices = { starter: 99, pro: 179, elite: 299 };
  const labels = { starter: "Starter", pro: "Pro", elite: "Elite" };
  const coaches = {
    amanda: { name: "Dr. Amanda Chen", specialty: "Sports nutrition", image: "amanda.jpg" },
    marcus: { name: "Marcus Johnson", specialty: "Sustainable habits", image: "marcus.jpg" },
    sofia: { name: "Sofia Reyes", specialty: "Plant-based nutrition", image: "sofia.jpg" },
    david: { name: "David Kim", specialty: "Muscle building", image: "david.jpg" },
  };
  const formatMoney = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value);
  let billing = "monthly";
  let recommendedCoach = "marcus";
  let opener = null;
  const dialogs = $$("dialog");
  function showDialog(dialog) {
    const active = document.activeElement;
    for (const other of dialogs) if (other.open) other.close();
    opener = active instanceof HTMLElement && !active.closest("dialog") ? active : opener;
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  function setBilling(value) {
    billing = value;
    $$("[data-billing]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.billing === billing)));
    for (const [plan, base] of Object.entries(prices)) {
      const monthly = billing === "annual" ? base * 0.8 : base;
      $(`[data-price="${plan}"]`).textContent = formatMoney(monthly);
      $(`[data-charge="${plan}"]`).textContent = billing === "annual"
        ? `${formatMoney(monthly * 12)} billed annually`
        : `${formatMoney(base)} billed monthly`;
    }
    $("#billing-note").textContent = billing === "annual"
      ? "Save exactly 20%. Full year paid upfront."
      : "Billed monthly. Annual plans available.";
  }
  $$("[data-billing]").forEach((button) => button.addEventListener("click", () => setBilling(button.dataset.billing)));
  function openAssessment(plan) {
    $("#assessment-form").reset();
    $("#assessment-form").hidden = false;
    $("#assessment-result").hidden = true;
    $("#result-preferences").textContent = "";
    $("#assessment-email").value = $("#lead-email").value;
    $("#lead-email").value = "";
    if (plan) $("#support").value = plan;
    showDialog($("#assessment-dialog"));
  }
  $$("[data-assessment]").forEach((button) => button.addEventListener("click", () => openAssessment()));
  $$("[data-plan]").forEach((button) => button.addEventListener("click", () => openAssessment(button.dataset.plan)));
  $("#lead-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if ($("#lead-form").reportValidity()) openAssessment();
  });
  $("#assessment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!$("#assessment-form").reportValidity()) return;
    const plan = $("#support").value;
    const goal = $("#goal").value;
    recommendedCoach = { habits: "marcus", sport: "amanda", muscle: "david", plant: "sofia" }[goal];
    if ($("#preference").value === "Vegan" && goal === "habits") recommendedCoach = "sofia";
    const coach = coaches[recommendedCoach];
    const monthly = billing === "annual" ? prices[plan] * 0.8 : prices[plan];
    $("#result-title").textContent = `${labels[plan]} could be your starting point.`;
    $("#result-description").textContent = `${formatMoney(monthly)}/month${billing === "annual" ? ` equivalent, ${formatMoney(monthly * 12)} paid annually` : ", billed monthly"}. This is a support-level suggestion based on your selected preference, not a health assessment or a purchase.`;
    $("#result-coach").textContent = coach.name;
    $("#result-specialty").textContent = coach.specialty;
    $("#result-coach-photo").src = `assets/${coach.image}`;
    $("#result-coach-photo").alt = `Stock portrait for fictional coach ${coach.name}`;
    const restrictions = $("#restrictions").value.trim();
    $("#result-preferences").textContent = `Your preferences: ${$("#preference").value} · ${$("#lifestyle").value}.${restrictions ? `\nNotes for a future professional conversation: ${restrictions}` : ""}`;
    $("#assessment-form").hidden = true;
    $("#assessment-result").hidden = false;
    $("#assessment-dialog").scrollTop = 0;
    $("#result-title").tabIndex = -1;
    $("#result-title").focus();
  });
  $("#edit-assessment").addEventListener("click", () => {
    $("#assessment-result").hidden = true;
    $("#assessment-form").hidden = false;
    $("#goal").focus();
  });
  function openBooking(coach) {
    $("#booking-form").reset();
    $("#booking-coach").value = coach;
    $("#booking-date").min = localDate();
    $("#booking-result").hidden = true;
    $("#booking-result").textContent = "";
    showDialog($("#booking-dialog"));
  }
  $$("[data-coach]").forEach((button) => button.addEventListener("click", () => openBooking(button.dataset.coach)));
  $("#result-book").addEventListener("click", () => openBooking(recommendedCoach));
  $("#booking-name").addEventListener("input", () => $("#booking-name").setCustomValidity(""));
  const clearSlotValidity = () => {
    $("#booking-date").setCustomValidity("");
    $("#booking-time").setCustomValidity("");
  };
  $("#booking-date").addEventListener("input", clearSlotValidity);
  $("#booking-time").addEventListener("change", clearSlotValidity);
  $("#booking-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#booking-name").value.trim();
    $("#booking-name").setCustomValidity(name ? "" : "Please enter your first name.");
    $("#booking-date").min = localDate();
    const date = $("#booking-date").value;
    const time = $("#booking-time").value;
    const appointment = new Date(`${date}T${time}`);
    $("#booking-time").setCustomValidity(Number.isFinite(appointment.getTime()) && appointment <= new Date() ? "Please choose a future time." : "");
    if (!$("#booking-form").reportValidity()) return;
    const coach = coaches[$("#booking-coach").value];
    const readableDate = appointment.toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
    $("#booking-result").textContent = `${name}, here is your local preview:\n${coach.name} · ${readableDate} (${Intl.DateTimeFormat().resolvedOptions().timeZone})\nThis is not a booking. No availability was checked, no slot was held and nothing was sent.`;
    $("#booking-result").hidden = false;
    $("#booking-result").scrollIntoView({ block: "nearest" });
  });
  $$("[data-open]").forEach((button) => button.addEventListener("click", () => showDialog($(`#${button.dataset.open}-dialog`))));
  $$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  for (const dialog of dialogs) {
    dialog.addEventListener("close", () => {
      dialog.querySelector("form")?.reset();
      dialog.querySelectorAll("input,select,textarea").forEach((field) => field.setCustomValidity(""));
      if (dialog.id === "assessment-dialog") {
        $("#result-preferences").textContent = "";
        $("#assessment-result").hidden = true;
        $("#assessment-form").hidden = false;
      }
      if (dialog.id === "booking-dialog") {
        $("#booking-result").textContent = "";
        $("#booking-result").hidden = true;
      }
      if (!dialogs.some((item) => item.open) && opener?.isConnected) opener.focus({ preventScroll: true });
    });
  }
  const menu = $(".menu-toggle");
  function closeMenu() {
    $("#navigation").classList.remove("is-open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
  }
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    menu.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
    $("#navigation").classList.toggle("is-open", expanded);
  });
  $$("#navigation a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    const dialog = dialogs.find((item) => item.open);
    if (event.key === "Tab" && dialog) {
      const focusable = [...dialog.querySelectorAll("button,a[href],input,select,textarea,[tabindex]")].filter((element) => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (first && ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first))) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header")) closeMenu();
  });
  $("#download-sample").addEventListener("click", () => {
    const text = [
      "FuelRight Nutrition — illustrative sample day", "",
      "7:00 AM Breakfast: overnight oats, berries, chia seeds, almond butter — 420 cal, 35g protein",
      "10:00 AM Snack: Greek yogurt, walnuts, honey — 250 cal, 18g protein",
      "12:30 PM Lunch: chicken quinoa bowl, roasted vegetables, tahini — 550 cal, 42g protein",
      "3:30 PM Snack: apple, peanut butter, dark chocolate chips — 280 cal, 8g protein",
      "7:00 PM Dinner: salmon, sweet potato, broccoli — 520 cal, 38g protein", "",
      "Brief-supplied totals: 2,020 cal | 141g protein | 198g carbs | 78g fat.",
      "Approximate figures: listed macros imply 2,058 kcal; food images are illustrative.",
      "Contains common allergens. This is general educational sample content, not a personalized meal plan or medical advice.",
      "No real coaching service, subscription or purchase is provided.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "fuelright-sample-day.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("#download-status").textContent = "Sample file prepared locally. No personal information is included.";
  });
})();
