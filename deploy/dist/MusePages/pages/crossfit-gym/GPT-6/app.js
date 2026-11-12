"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const menu = $(".menu");
  const nav = $("#navigation");
  const closeMenu = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open menu");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menu.focus();
    }
  });
  matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
  $(".ticker-pause").addEventListener("click", (event) => {
    const paused = $(".ticker").classList.toggle("paused");
    event.currentTarget.setAttribute("aria-pressed", String(paused));
    event.currentTarget.setAttribute("aria-label", `${paused ? "Resume" : "Pause"} class times animation`);
    event.currentTarget.textContent = paused ? "Resume" : "Pause";
  });
  $("#scale-toggle").addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") !== "true";
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
    $("#scale-options").hidden = !expanded;
    event.currentTarget.querySelector("use").setAttribute("href", `assets/icons.svg#${expanded ? "Minus" : "Plus"}`);
  });
  const weekday = [
    ["5:30 AM", "CrossFit", "Mike", 6],
    ["6:30 AM", "CrossFit", "Priya", 0],
    ["9:00 AM", "CrossFit", "Sarah", 12],
    ["10:00 AM", "Iron Foundations", "Mike", 4],
    ["12:00 PM", "CrossFit", "Alex", 8],
    ["4:30 PM", "Open Gym", "Self-directed", null],
    ["5:30 PM", "CrossFit", "Priya", 3],
    ["6:30 PM", "CrossFit", "Sarah", 0],
  ];
  const schedules = {
    Mon: weekday.map((row, i) => [...row.slice(0, 3), [8, 4, 10, 3, 5, null, 0, 2][i]]),
    Tue: weekday.map((row, i) => [...row.slice(0, 3), [5, 0, 8, 6, 9, null, 4, 1][i]]),
    Wed: weekday.map((row, i) => [...row.slice(0, 3), [2, 6, 11, 0, 7, null, 5, 0][i]]),
    Thu: weekday,
    Fri: weekday.map((row, i) => [...row.slice(0, 3), [7, 3, 9, 2, 8, null, 0, 4][i]]),
    Sat: [["8:00 AM", "Community WOD", "Mike", 8], ["9:00 AM", "CrossFit", "Priya", 0], ["10:00 AM", "Open Gym", "Self-directed", null], ["11:00 AM", "Lifting Skills", "Alex", 4]],
    Sun: [["9:00 AM", "Open Gym", "Self-directed", null], ["10:00 AM", "Mobility & Recovery", "Sarah", 10]],
  };
  let selectedDay = "Thu";
  const node = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  function renderSchedule(day) {
    selectedDay = day;
    const rows = schedules[day].map(([time, session, coach, spots]) => {
      const row = node("article", "schedule-row");
      row.setAttribute("aria-label", `${day} ${time}, ${session}`);
      const timeElement = node("div", "schedule-time", time.split(" ")[0]);
      timeElement.append(node("small", "", time.split(" ")[1]));
      row.append(timeElement, node("div", "session-name", session), node("div", "coach-name", coach === "Self-directed" ? coach : `Coach ${coach}`));
      const availability = node("div", "availability");
      availability.append(node("span", `dot ${spots === 0 ? "full" : spots !== null && spots < 5 ? "low" : ""}`), node("span", "", spots === null ? "Open" : spots === 0 ? "Full · waitlist" : `${spots} spots left`));
      row.append(availability);
      const button = node("button", "button outline", spots === 0 ? "Preview Waitlist" : "Reserve Your Spot");
      button.dataset.intro = `${spots === 0 ? "Waitlist preview" : "Reservation preview"} · ${day} ${time} · ${session} · ${coach}`;
      row.append(button);
      return row;
    });
    $("#schedule-rows").replaceChildren(...rows);
    $$(".day-tabs [role=tab]").forEach((tab) => {
      const selected = tab.dataset.day === day;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $("#day-panel").setAttribute("aria-labelledby", `day-${day.toLowerCase()}`);
  }
  $$(".day-tabs [role=tab]").forEach((tab, index, tabs) => {
    tab.addEventListener("click", () => renderSchedule(tab.dataset.day));
    tab.addEventListener("keydown", (event) => {
      const offset = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (!offset && !["Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + offset + tabs.length) % tabs.length;
      tabs[next].focus();
      renderSchedule(tabs[next].dataset.day);
    });
  });
  renderSchedule(selectedDay);
  $("#annual-toggle").addEventListener("click", (event) => {
    const annual = event.currentTarget.getAttribute("aria-checked") !== "true";
    event.currentTarget.setAttribute("aria-checked", String(annual));
    $$("[data-monthly]").forEach((element) => {
      const monthly = Number(element.dataset.monthly);
      element.textContent = `$${annual ? (monthly * 0.85).toFixed(2) : monthly}`;
    });
    $$("[data-billing]").forEach((element) => {
      const monthly = Number(element.dataset.billing);
      element.textContent = annual ? `$${(monthly * 12 * 0.85).toLocaleString("en-US")} billed annually · monthly equivalent above` : `$${monthly} billed monthly · sample plan`;
    });
  });
  const intro = $("#intro-dialog");
  const info = $("#info-dialog");
  let introSelection = "";
  let returnFocus = null;
  function resetForm() {
    $("#form-error").textContent = "";
    $("#intro-result").hidden = true;
    $("#intro-result").textContent = "";
    $$("#intro-form [aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
  }
  function openIntro(selection, trigger) {
    if (info.open) info.close();
    closeMenu();
    returnFocus = trigger;
    introSelection = selection;
    $("#intro-selection").textContent = `You’re exploring: ${selection}.`;
    $("#intro-form").reset();
    resetForm();
    intro.showModal();
  }
  const programContent = {
    crossfit: ["CrossFit — your daily hour", "The concept: 60 minutes, from a shared warm-up to skill practice, a coach-briefed workout, and a cool-down. Loads, movements, and volume can be adapted with appropriate coaching.", "Explore the archived WOD and sample schedule. No physical classes are offered through this fictional site."],
    foundations: ["Iron Foundations", "A fictional 4-week beginner pathway: week 1, stance and movement basics; week 2, hinge and squat patterns; week 3, introductions to lifting and bodyweight skills; week 4, preparing for a group class.", "Progression would be individual and guided in person. No qualification, safety guarantee, or outcome is claimed. Use the planner for a local preview only."],
    competitors: ["Room for the extra work", "The concept combines self-directed open gym with competitor programming and specialty sessions in Olympic lifting and gymnastics. Experience and appropriate coaching would be important.", "The sample Competitor plan adds a monthly coaching session, movement video review, and a priority-booking concept. No competition affiliation, coaching service, or bookings exist."],
  };
  const information = {
    social: ["A community, imagined", "@irontidecrossfit is a fictional handle in this design concept. No real account, feed, or external social service has been verified or connected. The local images are stock moodboard photographs, not members or event coverage."],
    directions: ["A neighborhood, not a destination", "The diagram illustrates Pacific Beach and Garnet Avenue only. 1847 Garnet Avenue is the brief’s fictional business address, not a verified gym location. No route or parking availability is verified. Do not travel based on this demo."],
    private: ["Personal attention, as a concept", "Private Training is a possible future program, not an available service. No trainers, credentials, sessions, or purchases are represented. Explore the fictional Foundations program for the beginner concept."],
    portal: ["No account needed here", "There is no member portal, authentication, tracking connection, or stored member data. Wodify is only a proposed integration in the design brief. All page actions are local previews."],
    events: ["Good reasons to gather", "Concept ideas: a Saturday beach workout, a community fundraiser, and a post-session hangout. These are imagined activities, not scheduled events. No registration or donations are collected."],
    careers: ["An imagined team", "Iron Tide is a fictional business. There are no job openings or application submissions. Coach profiles are invented and stock photos do not depict the named characters."],
    affiliate: ["Independent fictional design", "Iron Tide is not presented as a CrossFit affiliate. No affiliation, endorsement, competition history, or coaching certification has been verified or claimed. CrossFit and Wodify are third-party trademarks; their official logos are not used."],
    privacy: ["A page that stays local", "This demo uses no analytics, cookies, browser storage, or remote form submissions. Planner inputs exist only in the open page and are cleared when the planner closes or resets. Use invented details. All fonts, icons, and photos are served locally. Hosting infrastructure may maintain its own access logs."],
    terms: ["Concept, not a service", "All gym services, offers, availability, people, membership terms, and prices are fictional illustrations. Nothing on this site establishes a membership, booking, payment, contract, endorsement, or professional advice. No health outcomes are promised."],
    waiver: ["Not a waiver", "This page does not collect agreement or provide a legally effective liability waiver. Real participation would require appropriate in-person guidance and any actual operator’s procedures. The sample workout is general illustrative content, not individualized fitness or medical advice."],
  };
  function showInfo(content, trigger) {
    returnFocus = trigger;
    $("#info-title").textContent = content[0];
    $("#info-body").replaceChildren(...content.slice(1).map((text) => node("p", "", text)));
    info.showModal();
  }
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-intro],[data-program],[data-info]");
    if (!trigger) return;
    if (trigger.dataset.intro) openIntro(trigger.dataset.intro, trigger);
    else showInfo(trigger.dataset.program ? programContent[trigger.dataset.program] : information[trigger.dataset.info], trigger);
  });
  $("#info-intro").addEventListener("click", () => openIntro("Free intro class", returnFocus));
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const focusable = [...dialog.querySelectorAll("button,input,select,a[href]")].filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
      if (dialog === intro) {
        $("#intro-form").reset();
        resetForm();
      }
      if (!intro.open && !info.open && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
  });
  $("#intro-form").addEventListener("reset", resetForm);
  $("#intro-form").addEventListener("input", () => {
    $("#intro-result").hidden = true;
    $("#intro-result").textContent = "";
  });
  $("#intro-form").addEventListener("submit", (event) => {
    event.preventDefault();
    resetForm();
    const name = $("#first-name").value.trim();
    const experience = $("#experience").value;
    const invalid = [];
    if (!name || name.length > 50) invalid.push($("#first-name"));
    if (!experience) invalid.push($("#experience"));
    if (invalid.length) {
      invalid.forEach((field) => field.setAttribute("aria-invalid", "true"));
      $("#form-error").textContent = !name ? "Enter an invented first name, not only spaces." : "Choose your experience to preview an intro.";
      invalid[0].focus();
      return;
    }
    $("#intro-result").textContent = `${name}, here’s your local intro preview.\n${introSelection}\nStarting point: ${experience}\nPreferred time: ${$("#preference").value}\nNothing has been sent, saved, reserved, waitlisted, purchased, or charged. This is not a confirmation.`;
    $("#intro-result").hidden = false;
  });
})();
