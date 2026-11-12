"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const workouts = [
  { name: "Full Body Fire", duration: 28, level: "Beginner-friendly", category: "beginner", exercises: ["Squats", "Push-ups", "Plank holds", "Lunges", "Mountain climbers"], cues: ["Use a comfortable range; sit back gently.", "Use a wall or knees as a simpler option.", "Keep breathing; rest whenever needed.", "Hold a stable support if helpful.", "Step slowly instead of jumping."] },
  { name: "Upper Body Blitz", duration: 32, level: "Intermediate", category: "intermediate", exercises: ["Pike push-ups", "Tricep dips", "Resistance band rows", "Shoulder taps", "Superman holds"], cues: ["Try a wall push-up alternative.", "Use only stable support; skip if uncomfortable.", "Check the band and anchor before use.", "Widen your stance for balance.", "Keep the movement small and comfortable."] },
  { name: "Cardio Surge", duration: 25, level: "All levels", category: "beginner", exercises: ["High knees", "Burpees", "Jump squats", "Speed skaters", "Boxing combos"], cues: ["March as a lower-impact option.", "Step back and omit the jump.", "Use a regular squat if preferred.", "Step side to side without jumping.", "Use slow, controlled movements."] },
  { name: "Core Crusher", duration: 22, level: "Intermediate", category: "intermediate", exercises: ["Dead bugs", "Bicycle crunches", "Plank variations", "V-ups", "Hollow body holds"], cues: ["Move slowly and breathe.", "Avoid pulling your neck.", "Try knees down for support.", "Reduce the range or skip if uncomfortable.", "Rest when your form feels difficult."] },
  { name: "Lower Body Power", duration: 30, level: "Intermediate", category: "intermediate", exercises: ["Bulgarian split squats", "Glute bridges", "Wall sits", "Calf raises", "Lateral lunges"], cues: ["Use a supported regular split squat instead.", "Use a comfortable range.", "Choose a comfortable depth.", "Hold stable support for balance.", "Step gently and avoid forcing depth."] },
  { name: "HIIT Storm", duration: 20, level: "Advanced", category: "advanced", exercises: ["Burpees", "Jump lunges", "Push-up jacks", "Tuck jumps"], cues: ["Step through and omit the jump if preferred.", "Use stationary lunges as an alternative.", "Use a wall push-up option.", "Try gentle marching instead."] },
  { name: "Active Recovery", duration: 30, level: "All levels", category: "beginner", exercises: ["Yoga flow", "Foam rolling guide", "Mobility stretches", "Breathwork session"], cues: ["Choose gentle familiar poses.", "Optional; avoid painful pressure.", "Stay within a comfortable range.", "Breathe naturally without forced holds."] },
];
let unlocked = false;
let currentDay = 0;
let tier = "Free";
let remaining = 20;
let interval = null;
const completed = new Set();
function renderWorkouts() {
  $("#workout-rail").innerHTML = workouts.map((workout, index) => {
    const locked = index > 2 && !unlocked;
    return `<article class="workout-card ${workout.category}"><div class="workout-top"><span class="day-label">DAY <b>${String(index + 1).padStart(2, "0")}</b></span><span class="duration">${icon("clock")} ${workout.duration} min</span></div><h3>${workout.name}</h3><span class="difficulty">${workout.level}</span><p class="exercise-preview">${workout.exercises.slice(0, 3).join(" · ")}${workout.exercises.length > 3 ? " + more" : ""}</p><button data-day="${index}">${icon(locked ? "lock-keyhole" : "arrow-up-right")}${locked ? "Preview a plan to unlock" : completed.has(index) ? "Revisit checked session" : "Preview workout"}</button></article>`;
  }).join("");
}
renderWorkouts();
const menu = $(".menu");
function closeMenu() {
  $("#navigation").classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open menu");
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  $("#navigation").classList.toggle("open", open);
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
$("#navigation").addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  if (event.key !== "Tab") return;
  const dialog = $("dialog[open]");
  if (!dialog) return;
  const controls = [...dialog.querySelectorAll("button:not(:disabled),input,select,a[href]")].filter((element) => element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
function openJoin(selectedTier) {
  tier = selectedTier;
  $("#plan-tier").textContent = tier;
  $("#plan-form").hidden = false;
  $("#plan-result").hidden = true;
  $("#plan-form").reset();
  $("#plan-error").textContent = "";
  closeMenu();
  $("#join-dialog").showModal();
}
$$("[data-join]").forEach((button) => button.addEventListener("click", () => openJoin(button.dataset.join)));
$$("[data-close]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$$("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});
$("#plan-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const intention = $("#intention").value.trim();
  if (!intention) {
    $("#plan-error").textContent = "Add an intention with at least one non-space character.";
    $("#intention").focus();
    return;
  }
  if (!$("#acknowledge").checked) return;
  unlocked = true;
  renderWorkouts();
  $("#plan-form").hidden = true;
  const result = $("#plan-result");
  result.replaceChildren();
  const heading = document.createElement("h3");
  heading.textContent = "Your sample plan is ready.";
  const message = document.createElement("p");
  message.textContent = `${tier} concept · ${$("#level").value} pace. Your intention: ${intention}`;
  const note = document.createElement("p");
  note.textContent = "All seven previews are unlocked in this tab. Nothing was submitted or saved. Reloading resets everything.";
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Explore week one ↗";
  button.addEventListener("click", () => {
    $("#join-dialog").close();
    $("#workouts").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    $("#workout-rail").focus({ preventScroll: true });
  });
  result.append(heading, message, note, button);
  result.hidden = false;
  button.focus();
});
$("#intention").addEventListener("input", () => { $("#plan-error").textContent = ""; });
function pauseTimer() {
  clearInterval(interval);
  interval = null;
  $("#start-timer").textContent = remaining === 0 ? "Start again" : "Start timer";
}
function updateTimer() { $("#timer").textContent = `00:${String(remaining).padStart(2, "0")}`; }
function resetTimer() { pauseTimer(); remaining = 20; updateTimer(); }
function openWorkout(index) {
  currentDay = index;
  const workout = workouts[index];
  $("#workout-day").textContent = `DAY ${index + 1} / ${workout.level.toUpperCase()}`;
  $("#workout-title").textContent = workout.name.toUpperCase();
  $("#workout-description").textContent = `${workout.duration}-minute concept session. ${index === 5 ? "Imagined format: 8 Tabata rounds, 20 seconds on / 10 off. " : ""}This is a written preview, not a guided video. Rest and adapt as needed.`;
  $("#exercise-list").innerHTML = workout.exercises.map((exercise, exerciseIndex) => `<label class="exercise-check"><input type="checkbox" name="exercise"><span>${exercise}<small>${workout.cues[exerciseIndex]}</small></span></label>`).join("");
  $("#complete-workout").disabled = true;
  $("#workout-status").textContent = "Check off the exercises as you explore. No health data is saved.";
  resetTimer();
  $("#workout-dialog").showModal();
}
$("#workout-rail").addEventListener("click", (event) => {
  const button = event.target.closest("[data-day]");
  if (!button) return;
  const index = Number(button.dataset.day);
  if (index > 2 && !unlocked) openJoin("Free");
  else openWorkout(index);
});
$("#exercise-list").addEventListener("change", () => {
  const boxes = $$("#exercise-list input");
  const count = boxes.filter((box) => box.checked).length;
  $("#complete-workout").disabled = count !== boxes.length;
  $("#workout-status").textContent = `${count} of ${boxes.length} exercises checked in this sample.`;
});
$("#complete-workout").addEventListener("click", () => {
  completed.add(currentDay);
  $("#local-progress").textContent = `${completed.size} SAMPLE SESSION${completed.size === 1 ? "" : "S"} CHECKED OFF`;
  $("#workout-status").textContent = "Sample session checked off. This is a local practice record, not proof of exercise or health progress.";
  $("#complete-workout").disabled = true;
  pauseTimer();
  renderWorkouts();
});
$("#start-timer").addEventListener("click", () => {
  if (interval) { pauseTimer(); $("#start-timer").textContent = "Resume timer"; return; }
  if (!remaining) remaining = 20;
  updateTimer();
  $("#start-timer").textContent = "Pause timer";
  interval = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    updateTimer();
    if (!remaining) {
      pauseTimer();
      $("#workout-status").textContent = "Practice interval complete. Rest as needed. This timer does not certify a workout.";
    }
  }, 1000);
});
$("#reset-timer").addEventListener("click", resetTimer);
$("#workout-dialog").addEventListener("close", resetTimer);
document.addEventListener("visibilitychange", () => { if (document.hidden) pauseTimer(); });
function scrollWorkouts(distance) {
  $("#workout-rail").scrollBy({ left: distance, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
$("#next-day").addEventListener("click", () => scrollWorkouts(490));
$("#previous-day").addEventListener("click", () => scrollWorkouts(-490));
$("#more-stories").addEventListener("click", () => {
  const open = $("#more-stories").getAttribute("aria-expanded") !== "true";
  $("#more-stories").setAttribute("aria-expanded", String(open));
  $("#extra-stories").hidden = !open;
  $("#more-stories").textContent = open ? "Show fewer stories −" : "See more imagined milestones ↗";
});
const info = {
  About: "PulseUp Fitness and IGNITE 30 are fictional brands created for this independent static design concept. No live fitness business is represented.",
  Coaches: "Coach Maya and the coaching groups are fictional. This page provides no professional coaching, diagnosis, medical advice or individual exercise prescription.",
  Blog: "A blog is part of the imagined brand. No articles or external blog service are available in this static edition.",
  Careers: "There are no real job openings or recruiting activity behind this fictional concept.",
  Contact: "No real support team or inbox is connected. This static page sends no messages and collects no contact details.",
  "Community guidelines": "The imagined community values encouragement, consent, privacy, and respect for different abilities. There is no live group or moderation service in this demo.",
  Privacy: "No analytics, cookies, external runtime requests, localStorage or sessionStorage. Your anonymous plan and sample check-offs exist only in this tab and disappear on reload. Avoid entering personal details.",
  Terms: "Fictional demonstration only. Prices, discounts, guarantees, rewards, member counts and results are illustrative. No enrollment, purchase, competition or health outcome is offered. Consult qualified professionals for individual fitness and dietary needs.",
};
$$("[data-info]").forEach((button) => button.addEventListener("click", () => {
  const title = button.dataset.info;
  $("#info-title").textContent = title.toUpperCase();
  $("#info-text").textContent = info[title] || `${title} is an illustrative social channel. No real PulseUp profile is linked and no external service is contacted.`;
  $("#info-dialog").showModal();
}));
