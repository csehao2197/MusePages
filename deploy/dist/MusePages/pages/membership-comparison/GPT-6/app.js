"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const plans = {
    basic: { name: "Basic", monthly: 29, annual: 24, rank: 0 },
    standard: { name: "Standard", monthly: 49, annual: 39, rank: 1 },
    premium: { name: "Premium", monthly: 79, annual: 65, rank: 2 },
    elite: { name: "Elite", monthly: 149, annual: 125, rank: 3 },
  };
  const addons = {
    training: { name: "4 personal training sessions", cost: 150, recurring: false },
    nutrition: { name: "Nutrition consultation", cost: 75, recurring: false },
    guests: { name: "5 extra guest passes", cost: 25, recurring: false },
    locker: { name: "Locker rental", cost: 15, recurring: true },
    towels: { name: "Towel service", cost: 10, recurring: true },
  };
  const locations = {
    river: { name: "Riverfront", detail: "Riverside energy. A bright training floor and waterside reset spaces." },
    central: { name: "Central Yard", detail: "Right in the middle of it. Strength, studio and recovery under one roof." },
    park: { name: "Parkside", detail: "A greener kind of routine. Train, take a class, then take the long way home." },
  };
  const classes = [
    { day: "Monday", time: "07:00", name: "Strength Foundations", type: "Strength · 45 min", popular: true },
    { day: "Tuesday", time: "18:00", name: "Power Pilates", type: "Mind & body · 50 min", popular: true },
    { day: "Wednesday", time: "12:15", name: "Lunch Break HIIT", type: "Cardio · 30 min", popular: false },
    { day: "Thursday", time: "18:30", name: "Cycle Club", type: "Cardio · 45 min", popular: true },
    { day: "Friday", time: "07:30", name: "Mobility & Reset", type: "Recovery · 40 min", popular: false },
    { day: "Saturday", time: "09:00", name: "Total Body Strength", type: "Strength · 50 min", popular: false },
    { day: "Sunday", time: "10:00", name: "Slow Flow Yoga", type: "Mind & body · 60 min", popular: true },
  ];
  const features = [
    ["Gym hours", "6am–10pm", "24/7", "24/7", "24/7"],
    ["Cardio equipment", true, true, true, true],
    ["Weight machines", true, true, true, true],
    ["Free weights", false, true, true, true],
    ["Group classes", false, "5 / month", "Unlimited", "Unlimited"],
    ["Pool & sauna", false, false, true, true],
    ["Personal training", false, false, "2 / month", "Unlimited"],
    ["Towel service", false, false, true, true],
    ["Guest passes", false, false, "2 / month", "4 / month"],
    ["Spa access", false, false, false, true],
    ["Nutrition coach", false, false, false, true],
    ["Home club / all clubs", "Home club", "Home club", "All 3 clubs", "All 3 clubs"],
    ["Fitness assessment & app access*", false, true, true, true],
    ["Priority class booking", false, false, true, true],
    ["Recovery suite & member events", false, false, false, true],
  ];
  const state = { plan: "standard", billing: "monthly", location: "river", discount: "none", addons: new Set() };
  let latestDownload = "";
  const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value);
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const icon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS(svg.namespaceURI, "use");
    use.setAttribute("href", `assets/icons.svg#${name}`);
    svg.append(use);
    return svg;
  };
  $$("svg.icon, .brand-mark").forEach((svg) => svg.setAttribute("aria-hidden", "true"));
  function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
  $("#start-date").min = localDate();
  $("#start-date").value = localDate();
  for (const [label, ...values] of features) {
    const tr = node("tr");
    const heading = node("th", label);
    heading.scope = "row";
    tr.append(heading);
    for (const value of values) {
      const td = node("td");
      if (typeof value === "boolean") {
        const check = icon(value ? "Check" : "X");
        if (!value) check.classList.add("not-included");
        td.append(check, node("span", value ? "Included" : "Not included", "sr-only"));
      } else td.textContent = value;
      tr.append(td);
    }
    $("#comparison-body").append(tr);
  }
  // Only the column headers stay sticky; row labels remain part of the scrollable matrix.
  $$("#comparison-body th").forEach((th) => { th.style.position = "static"; th.style.background = "transparent"; th.style.fontWeight = "400"; th.style.fontSize = "12px"; });
  function classRow(item, full = false) {
    const row = node("div", undefined, "class-row");
    const info = node("div");
    const time = node("div", item.time, "class-time");
    time.append(node("small", full ? item.day : item.day.slice(0, 3).toUpperCase()));
    const name = node("div", item.name, "class-name");
    name.append(node("small", item.type));
    info.append(time, name);
    row.append(info);
    if (item.popular) row.append(node("span", "POPULAR", "class-badge"));
    return row;
  }
  function renderSchedule() {
    const day = $("#schedule-day").value;
    const rows = classes.filter((item) => day === "all" || item.day === day);
    $("#schedule-list").replaceChildren(...rows.map((item) => classRow(item, true)));
  }
  function quote() {
    const percentage = { none: 0, student: 0.2, senior: 0.15, service: 0.15 }[state.discount];
    const monthlyBase = Math.round(plans[state.plan][state.billing] * (1 - percentage) * 100) / 100;
    let recurring = 0;
    let once = 0;
    for (const key of state.addons) {
      if (addons[key].recurring) recurring += addons[key].cost;
      else once += addons[key].cost;
    }
    const term = Math.round(monthlyBase * (state.billing === "annual" ? 12 : 1) * 100) / 100;
    const due = Math.round((term - monthlyBase + recurring + once) * 100) / 100;
    return { monthlyBase, term, recurring, once, due };
  }
  function renderQuote() {
    const q = quote();
    const container = $("#quote-summary");
    container.replaceChildren();
    const line = (label, amount, className) => {
      const p = node("p", undefined, className);
      p.append(node("span", label), node("span", amount));
      container.append(p);
    };
    line(state.billing === "annual" ? "12-month base dues" : "First month base dues", money(q.term));
    line("First base month credit", `−${money(q.monthlyBase)}`);
    line("Monthly add-ons · first month", money(q.recurring));
    line("One-time add-ons", money(q.once));
    line("Estimated initial total", money(q.due), "total");
    container.append(node("small", state.billing === "annual"
      ? `Thereafter add-ons are ${money(q.recurring)}/month; base renews at ${money(q.term)}/year without the first-month credit. Annual base is prepaid, not billed monthly.`
      : `From month two: ${money(q.monthlyBase + q.recurring)}/month including recurring add-ons. One-time packs do not renew.`));
    const selected = [...state.addons].map((key) => addons[key].name).join(", ");
    container.append(node("small", `Add-ons: ${selected || "none"}. Tax is not calculated. Fictional prices; no payment is collected. Eligibility is not verified.`));
  }
  function render() {
    const selected = plans[state.plan];
    $$(".billing button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.billing === state.billing)));
    $("#billing-note").textContent = state.billing === "annual" ? "12 months prepaid. First base month credited." : "One month at a time. Find your rhythm.";
    Object.entries(plans).forEach(([key, plan]) => {
      $(`[data-price="${key}"]`).textContent = money(plan[state.billing]);
      $(`[data-bill="${key}"]`).textContent = state.billing === "annual" ? `${money(plan.annual * 12)}/year before first-month credit` : "Monthly billing";
      $(`[data-table-price="${key}"]`).textContent = `${money(plan[state.billing])}/mo${state.billing === "annual" ? " · prepaid" : ""}`;
    });
    const towels = $('.addons input[value="towels"]');
    towels.disabled = selected.rank >= 2;
    if (towels.disabled) state.addons.delete("towels");
    $$(".addons input").forEach((input) => { input.checked = state.addons.has(input.value); });
    $("#towel-note").textContent = selected.rank >= 2 ? "Already included in your plan · no extra charge" : "For Basic & Standard · monthly";
    for (const selector of ["#quote-plan", "#enroll-plan", "#facility-tier"]) $(selector).value = state.plan;
    $("#enroll-billing").value = state.billing;
    $("#enroll-location").value = state.location;
    $("#home-gym").value = state.location;
    $("#discount").value = state.discount;
    $$("[data-tier]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.tier === state.plan)));
    $("#class-inclusion").textContent = state.plan === "basic" ? "Your starting line. Classes aren’t included." : state.plan === "standard" ? "Five classes. A whole new rhythm." : "Every class. As often as you like.";
    $("#class-preview").replaceChildren(...classes.slice(0, 3).map((item) => classRow(item)));
    $$("[data-access]").forEach((card) => {
      const included = selected.rank >= plans[card.dataset.access].rank;
      const label = card.querySelector("[data-access-label]");
      label.textContent = included ? "Included" : `${plans[card.dataset.access].name}+`;
      label.classList.toggle("locked", !included);
    });
    $("#recovery-access").textContent = state.plan === "elite" ? "Included with Elite" : "Elite only";
    $("#location-description").textContent = locations[state.location].detail;
    $("#location-access").textContent = selected.rank >= 2 ? `${selected.name}: all 3 clubs included. Your home club is ${locations[state.location].name}.` : `${selected.name}: ${locations[state.location].name} access only. Choose Premium or Elite for all 3 clubs.`;
    $$("[data-map]").forEach((marker) => marker.classList.toggle("active", marker.dataset.map === state.location));
    const q = quote();
    $("#estimate-price").textContent = money(q.monthlyBase + q.recurring);
    $("#estimate-period").textContent = state.billing === "annual" ? "/ month equivalent + one-time extras" : "/ month after first-month credit";
    $("#estimate-note").textContent = `Estimated initial total: ${money(q.due)} before tax. ${q.once ? `${money(q.once)} one-time add-ons included. ` : ""}${state.billing === "annual" ? "Annual base prepaid; recurring add-ons billed monthly." : "First base month credited; add-ons are extra."}`;
    $("#mobile-plan").textContent = `${selected.name} · ${money(selected[state.billing])}/mo${state.billing === "annual" ? " annual" : ""}`;
    renderQuote();
  }
  function clearEnrollmentResult() {
    $("#enroll-form").hidden = false;
    $("#enroll-result").hidden = true;
    $("#enroll-error").textContent = "";
    latestDownload = "";
  }
  function openEnrollment(plan = state.plan) {
    state.plan = plan;
    clearEnrollmentResult();
    $("#start-date").min = localDate();
    render();
    $("#enroll-dialog").showModal();
  }
  $$(".close-dialog").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
  $$("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }));
  $$("[data-billing]").forEach((button) => button.addEventListener("click", () => { state.billing = button.dataset.billing; render(); }));
  $$("[data-choose]").forEach((button) => button.addEventListener("click", () => openEnrollment(button.dataset.choose)));
  $$("[data-tier]").forEach((button) => button.addEventListener("click", () => { state.plan = button.dataset.tier; render(); }));
  for (const id of ["quote-plan", "enroll-plan", "facility-tier"]) $(`#${id}`).addEventListener("change", (event) => { state.plan = event.target.value; render(); });
  for (const id of ["home-gym", "enroll-location"]) $(`#${id}`).addEventListener("change", (event) => { state.location = event.target.value; render(); });
  $("#enroll-billing").addEventListener("change", (event) => { state.billing = event.target.value; render(); });
  $("#discount").addEventListener("change", (event) => { state.discount = event.target.value; render(); });
  $$(".addons input").forEach((input) => input.addEventListener("change", () => { input.checked ? state.addons.add(input.value) : state.addons.delete(input.value); render(); }));
  $("#review-estimate").addEventListener("click", () => openEnrollment());
  $("#mobile-join").addEventListener("click", () => openEnrollment());
  $("#full-schedule").addEventListener("click", (event) => { event.preventDefault(); renderSchedule(); $("#schedule-dialog").showModal(); });
  $("#schedule-day").addEventListener("change", renderSchedule);
  $("#enroll-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const date = $("#start-date").value;
    const today = localDate();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today || !$("#orientation").value) {
      $("#enroll-error").textContent = "Choose today or a future start date and an orientation time.";
      return;
    }
    const q = quote();
    const summary = `${plans[state.plan].name} · ${state.billing} · ${locations[state.location].name} · starts ${date} · orientation ${$("#orientation").value}. Estimated initial total: ${money(q.due)} before tax.`;
    $("#enroll-result-text").textContent = summary;
    latestDownload = `FORM ATHLETIC CLUB — FICTIONAL LOCAL ESTIMATE\n${summary}\n${$("#quote-summary").innerText}\nOffer: ${$("#discount").selectedOptions[0].textContent}\nNot a payment receipt, membership or reservation. No eligibility verification. No data sent or stored.\n`;
    $("#enroll-form").hidden = true;
    $("#enroll-result").hidden = false;
    $("#download-quote").focus();
  });
  $("#edit-estimate").addEventListener("click", () => { clearEnrollmentResult(); $("#enroll-plan").focus(); });
  $("#download-quote").addEventListener("click", () => {
    if (!latestDownload) return;
    const url = URL.createObjectURL(new Blob([latestDownload], { type: "text/plain;charset=utf-8" }));
    const link = node("a");
    link.href = url;
    link.download = "form-membership-estimate.txt";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $$("[data-inquiry]").forEach((button) => button.addEventListener("click", () => {
    $("#inquiry-title").textContent = button.dataset.inquiry;
    $("#inquiry-form").reset();
    $("#inquiry-form").hidden = false;
    $("#inquiry-result").hidden = true;
    $("#inquiry-output").textContent = "";
    $("#inquiry-error").textContent = "";
    $("#inquiry-dialog").showModal();
  }));
  $("#inquiry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const message = $("#inquiry-message").value.trim();
    if (message.length < 10 || message.length > 240) {
      $("#inquiry-error").textContent = "Please enter 10–240 non-padding characters of sample text.";
      $("#inquiry-message").focus();
      return;
    }
    $("#inquiry-output").textContent = `${$("#inquiry-title").textContent}: ${message}`;
    $("#inquiry-form").hidden = true;
    $("#inquiry-result").hidden = false;
  });
  render();
})();
