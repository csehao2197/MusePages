"use strict";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const teachers = [
  { name: "Maya Chen", specialty: "Hip-Hop & Breaking", photo: "photo-1535525153412-5a42439a210d.jpg", bio: "15 years of performing, a lifetime of loving the groove. Believes everyone has rhythm — you just need permission to find it.", background: "Fictional brief biography: a touring performer with a scripted Missy Elliott credit. This is invented, not an employment or endorsement claim.", approach: "Start with pulse and isolations, then build a short combination. Ask for the low-impact variation whenever you need it." },
  { name: "Carlos Rivera", specialty: "Salsa & Latin", photo: "dance-270789.jpg", bio: "A love of Latin rhythms, a welcoming floor. Makes partner work feel natural from day one, with or without a partner.", background: "Fictional brief biography: a former competitive Latin ballroom champion trained in Havana. These are scripted credentials, not verified achievements.", approach: "Learn the basic step, weight transfer and comfortable partner connection. Solo practice is always welcome." },
  { name: "Ava Williams", specialty: "Contemporary & Ballet", photo: "ballet.jpg", bio: "Find the feeling behind the movement. An expressive, thoughtful guide to building technique without losing your own voice.", background: "Fictional brief biography: Juilliard-trained and a former Alvin Ailey company member. No real affiliation, credential or endorsement is claimed.", approach: "Explore grounded movement, musical phrasing and clear ballet foundations. Take the floor-work alternative when needed." },
  { name: "Kai Nakamura", specialty: "Breaking & Hip-Hop", photo: "dance-1701194.jpg", bio: "Big energy. Small, thoughtful steps. Teaches power moves with a focus on safety, progression and celebrating your own style.", background: "Fictional brief biography: a world-class b-boy and Red Bull BC One competitor. These are invented story details, not verified competition history.", approach: "Begin with top rock and footwork before coached freeze progressions. Complex power moves require in-person supervision." }
];
const styles = ["Hip-Hop", "Contemporary", "Salsa & Latin", "Breaking", "Ballet"];
const baseClasses = [
  { title: "Hip-Hop Foundations", style: styles[0], teacher: 0, level: "Beginner", color: "green", room: "A", time: "6:00 PM" },
  { title: "Contemporary Flow", style: styles[1], teacher: 2, level: "Intermediate", color: "amber", room: "B", time: "7:15 PM" },
  { title: "Salsa Social", style: styles[2], teacher: 1, level: "All Levels", color: "blue", room: "A", time: "8:30 PM" },
  { title: "Breaking Lab", style: styles[3], teacher: 3, level: "Open Level", color: "purple", room: "C", time: "9:00 PM" },
  { title: "Ballet Basics", style: styles[4], teacher: 2, level: "Beginner", color: "green", room: "B", time: "5:00 PM" }
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })).getDay();
let activeDay = (today + 6) % 7;
let selectedClass = "";
let selectedPlan = "";
const classesFor = (day) => {
  const weekend = day >= 5;
  const minutes = (time) => { const [clock, period] = time.split(" "), [hour, minute] = clock.split(":").map(Number); return (hour % 12 + (period === "PM" ? 12 : 0)) * 60 + minute; };
  return baseClasses.map((item, index) => ({ ...item, time: weekend ? ["10:00 AM", "11:15 AM", "12:30 PM", "2:00 PM", "3:00 PM"][index] : item.time, spots: ((day + index * 3) % 8) + 2 })).sort((a, b) => minutes(a.time) - minutes(b.time));
};
const list = $("#class-list");
const dialog = $("#detail-dialog");
const dialogContent = $("#dialog-content");
let opener;
function openDialog(title, content) {
  opener = document.activeElement;
  $("#dialog-title").textContent = title;
  dialogContent.replaceChildren(content);
  dialog.showModal();
  $(".dialog-close").focus();
}
function paragraph(text) { const p = document.createElement("p"); p.textContent = text; return p; }
function infoDialog(title, lines) { const content = document.createElement("div"); lines.forEach((text) => content.append(paragraph(text))); openDialog(title, content); }
$(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const targets = $$('button:not(:disabled),a[href],input,select,video[controls],[tabindex="0"]', dialog).filter((element) => element.getClientRects().length);
  const first = targets[0], last = targets.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener("close", () => { const video = $("video", dialog); if (video) video.pause(); dialogContent.replaceChildren(); opener?.focus({ preventScroll: true }); });
function renderSchedule(focusTab = false) {
  $$(".days button").forEach((tab, index) => { tab.setAttribute("aria-selected", String(index === activeDay)); tab.tabIndex = index === activeDay ? 0 : -1; });
  list.setAttribute("aria-labelledby", `day-${activeDay}`);
  const filter = $("#schedule-filter").value;
  const classes = classesFor(activeDay).filter((item) => filter === "All styles" || item.style === filter);
  list.innerHTML = classes.map((item) => {
    const teacher = teachers[item.teacher];
    return `<article class="class-row"><p class="class-time">${item.time}</p><div><h3>${item.title}</h3><small>60 min · Studio ${item.room}</small></div><div class="teacher"><img src="assets/${teacher.photo}" alt="" width="32" height="32"><span>${teacher.name}</span></div><span class="badge ${item.color}">${item.level}</span><span class="spots ${item.spots < 5 ? "low" : ""}">${item.spots} spots left</span><button class="book-class" data-class="${item.style}" aria-label="Book ${item.title} on ${days[activeDay]}">Book</button></article>`;
  }).join("");
  if (focusTab) $(`#day-${activeDay}`).focus({ preventScroll: true });
}
days.forEach((day, index) => {
  const button = document.createElement("button");
  button.textContent = day; button.id = `day-${index}`; button.type = "button";
  button.setAttribute("role", "tab"); button.setAttribute("aria-controls", "class-list");
  button.addEventListener("click", () => { activeDay = index; renderSchedule(); });
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    activeDay = event.key === "Home" ? 0 : event.key === "End" ? 6 : (activeDay + (event.key === "ArrowRight" ? 1 : 6)) % 7;
    renderSchedule(true);
  });
  $(".days").append(button);
});
$("#schedule-filter").addEventListener("change", () => renderSchedule());
$("#previous-day").addEventListener("click", () => { activeDay = (activeDay + 6) % 7; renderSchedule(); });
$("#next-day").addEventListener("click", () => { activeDay = (activeDay + 1) % 7; renderSchedule(); });
let touchStart;
list.addEventListener("touchstart", (event) => { const t = event.changedTouches[0]; touchStart = { x: t.clientX, y: t.clientY }; }, { passive: true });
list.addEventListener("touchend", (event) => {
  if (!touchStart) return;
  const t = event.changedTouches[0], dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { activeDay = (activeDay + (dx < 0 ? 1 : 6)) % 7; renderSchedule(); }
  touchStart = null;
}, { passive: true });
$$("[data-style]").forEach((link) => link.addEventListener("click", () => { $("#schedule-filter").value = link.dataset.style; renderSchedule(); }));
$("#full-schedule").addEventListener("click", () => {
  const content = document.createElement("div"); content.append(paragraph("Sample weekly schedule · Austin time · All classes are 60 minutes. Availability is illustrative, not live."));
  days.forEach((day, index) => {
    const section = document.createElement("section"); section.className = "week-day";
    const heading = document.createElement("h3"); heading.textContent = day; section.append(heading);
    classesFor(index).forEach((item) => section.append(paragraph(`${item.time} — ${item.title} · Studio ${item.room} · ${teachers[item.teacher].name}`)));
    content.append(section);
  }); openDialog("Your week, in motion.", content);
});
function selectBooking(style, title) {
  selectedClass = title; selectedPlan = "";
  $("#trial-form").hidden = false; $("#confirmation").hidden = true; $("#booking-selection").textContent = `Local class selection: ${title}`;
  $("#trial-form").elements.style.value = style;
  $("#trial").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  $("#trial-form").elements.name.focus({ preventScroll: true });
}
list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-class]");
  if (!button) return;
  const item = classesFor(activeDay).find((row) => row.style === button.dataset.class);
  selectBooking(item.style, `${days[activeDay]} · ${item.title} · ${item.time}`);
});
$("#instructor-grid").innerHTML = teachers.map((teacher, index) => `<article class="instructor-card"><img src="assets/${teacher.photo}" alt="Stock dancer illustration, not ${teacher.name}" loading="lazy" width="120" height="120"><div><h3>${teacher.name}</h3><p class="specialty">${teacher.specialty}</p><p class="bio">${teacher.bio}</p><button class="text-button" data-profile="${index}">View Profile ${icon("ArrowUpRight")}</button></div></article>`).join("");
$$("[data-profile]").forEach((button) => button.addEventListener("click", () => {
  const teacher = teachers[Number(button.dataset.profile)];
  const content = document.createElement("div");
  content.append(paragraph(`${teacher.specialty} · Fictional instructor`), paragraph(teacher.bio), paragraph(teacher.background), paragraph(`Teaching approach: ${teacher.approach}`), paragraph("Image: stock dancer, not a portrait of this fictional instructor."));
  const action = document.createElement("button"); action.className = "button"; action.textContent = "Explore their classes";
  action.addEventListener("click", () => { dialog.close(); $("#schedule-filter").value = teacher.specialty.includes("Salsa") ? "Salsa & Latin" : teacher.specialty.includes("Contemporary") ? "Contemporary" : teacher.specialty.startsWith("Breaking") ? "Breaking" : "Hip-Hop"; renderSchedule(); $("#schedule").scrollIntoView(); });
  content.append(action); openDialog(teacher.name, content);
}));
const gallery = [
  ["dance-175658.jpg", "Sunset showcase", false, "Stock performers on an outdoor stage"],
  ["hiphop.jpg", "A floor full of connection", false, "An overhead view of a social dance floor"],
  ["dance-1701194.jpg", "Balance in motion", false, "A dancer balancing on one foot"],
  ["dance-270789.jpg", "Two people. One rhythm.", false, "Partner dancers in a warm-toned studio"],
  ["ballet.jpg", "A moment to stretch", false, "Contemporary dancer with arms outstretched"],
  ["contemporary.jpg", "Feel the music", true, "Ballet-inspired dancer in a flowing dress"],
  ["photo-1535525153412-5a42439a210d.jpg", "Rehearsal energy", false, "Urban dancer in midair"],
  ["dance-175658.jpg", "The progress story · sample reel", true, "Dancers moving together on stage"]
];
$("#gallery").innerHTML = gallery.map(([photo, title, video, alt], index) => `<button class="gallery-tile" data-gallery="${index}" aria-label="${video ? "Play sample reel: " : "Enlarge photo: "}${title}"><img src="assets/${photo}" alt="${alt}" loading="lazy">${video ? `<i class="play-mark">${icon("Play")}</i>` : ""}<span>${video ? "PLAY · " : ""}${title}</span></button>`).join("");
function showReel() {
  const content = document.createElement("div");
  content.append(paragraph("A locally produced, silent dance mood reel made from licensed stock stills. This is not footage of this fictional studio or evidence of student progress."));
  const video = document.createElement("video"); video.controls = true; video.playsInline = true; video.preload = "metadata"; video.src = "assets/dance-mood.webm"; video.poster = "assets/dance-175658.jpg"; video.setAttribute("aria-label", "Silent stock-photo dance mood reel"); content.append(video);
  content.append(paragraph("Visual description: expressive solo movement, a partner dance and an outdoor ensemble. Use the player controls to start, pause or seek. No flashing or audio."));
  openDialog("A little rhythm. A little flow.", content);
}
$$("[data-reel]").forEach((button) => button.addEventListener("click", showReel));
$$("[data-gallery]").forEach((button) => button.addEventListener("click", () => {
  const [photo, title, video, alt] = gallery[Number(button.dataset.gallery)];
  if (video) return showReel();
  const content = document.createElement("div"), image = document.createElement("img"); image.src = `assets/${photo}`; image.alt = alt;
  content.append(image, paragraph("Licensed editorial stock photo. Not a photograph of the fictional studio or its students.")); openDialog(title, content);
}));
$$(".stars").forEach((container) => { container.innerHTML = icon("Star").repeat(5); });
$$("[data-plan]").forEach((button) => button.addEventListener("click", () => {
  const content = document.createElement("div"); content.append(paragraph(`Sample plan: ${button.dataset.plan}`), paragraph("This is an illustrative pricing preview. There is no checkout, recurring subscription, payment processing or real membership."));
  const action = document.createElement("button"); action.className = "button"; action.textContent = "Preview a free first class";
  action.addEventListener("click", () => { dialog.close(); selectBooking("Not Sure Yet", ""); selectedClass = ""; selectedPlan = button.dataset.plan; $("#booking-selection").textContent = `Sample plan interest: ${selectedPlan} · No purchase`; });
  content.append(action); openDialog("Room to move, your way.", content);
}));
const form = $("#trial-form");
form.addEventListener("input", (event) => { if (event.target.setCustomValidity) event.target.setCustomValidity(""); $("#form-error").textContent = ""; });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.elements.name, email = form.elements.email;
  name.value = name.value.trim(); email.value = email.value.trim();
  name.setCustomValidity(name.value ? "" : "Please enter a name, not only spaces.");
  email.setCustomValidity(email.value ? "" : "Please enter a sample email.");
  if (!form.checkValidity()) { $("#form-error").textContent = "Please enter a name, a valid email and your experience level."; form.reportValidity(); return; }
  $("#confirmation-text").textContent = `${name.value}, your sample choice is ${form.elements.style.value} · ${form.elements.experience.value}.${selectedClass ? ` Class: ${selectedClass}.` : ""}${selectedPlan ? ` Plan interest: ${selectedPlan}.` : ""} Bring comfortable clothes and water; arrive 10 minutes early in this fictional scenario.`;
  form.reset(); form.hidden = true; $("#confirmation").hidden = false;
  $("#reset-form").focus({ preventScroll: true });
});
$("#reset-form").addEventListener("click", () => { selectedClass = ""; selectedPlan = ""; $("#confirmation").hidden = true; $("#confirmation-text").textContent = ""; $("#booking-selection").textContent = ""; $("#form-error").textContent = ""; form.hidden = false; form.elements.name.focus({ preventScroll: true }); });
const info = {
  about: ["A space to find your flow.", "Rhythm & Flow is an original, fictional Austin dance-studio concept for adults 18–45, from absolute beginners to experienced dancers. The focus is expression, community and a welcoming first step."],
  careers: ["Bring your good energy.", "Careers are illustrative. There are no current vacancies or application services behind this static concept."],
  press: ["The story behind the studio.", "This fictional concept has no press coverage, awards or real-world endorsements. All studio statistics and ratings are illustrative."],
  events: ["Your people are here.", "Sample first-Friday social: open floor, 7–9 PM, all styles and all levels. Sample seasonal showcase: share a short combination with the community. These events are fictional; no tickets or reservations are issued."],
  blog: ["Notes from the floor.", "First class? Wear comfortable clothes, bring water and take breaks. For partner work, respect consent and personal space. These general notes are demo editorial content, not personalized training or medical advice."],
  partnerships: ["Make something move.", "Community collaborations are a concept only. No partnerships, sponsorships or organization affiliations are claimed."],
  location: ["A fictional home in Austin.", "Sample address: 412 East 6th Street, Suite 200, Austin, TX 78701. This is not a verified studio location. Sample hours: Mon–Fri 10AM–10PM; Sat 9AM–6PM; Sun 10AM–4PM."],
  parking: ["Plan your arrival.", "The location is fictional. Parking, accessible entrances and transit routes have not been verified. Confirm these directly with any real venue before traveling."],
  faq: ["Your first-class questions.", "No experience? Start with Hip-Hop Foundations or Ballet Basics. Salsa Social is all levels; no partner is needed in this sample program. Wear comfortable clothing and bring water. Discuss injuries or limitations with a qualified professional before participating. This demo cannot reserve a class."],
  contact: ["Let's keep it local.", "This fictional studio has no monitored email, phone line or contact service. The trial form generates a local preview only. Nothing is sent, saved or booked."],
  social: ["A fictional handle. A real love of dance.", "@rhythmandflow is sample branding. Social buttons stay in this local demo; no account ownership or endorsement is implied, and no external service is contacted."],
  privacy: ["Your details stay here.", "The form uses details only to render a preview in this browser tab. It resets after submission. There are no analytics, cookies, network submissions, localStorage or sessionStorage. Reloading clears the preview. Please use sample details."],
  terms: ["A concept, not a real booking.", "This static site demonstrates a fictional studio. Prices, offers, availability, ratings, biographies, testimonials and events are sample content. No contract, purchase, membership, medical benefit or reservation is created."],
  accessibility: ["Movement for everyone.", "This concept supports keyboard navigation, visible focus, labeled forms, day-tab arrow keys, native dialogs, reduced motion and responsive layouts. Its silent reel includes a text description. This is not a WCAG certification; assistive technology and real-device coverage remain limited."],
  credits: ["A little credit, where it's due.", "Dance photos: Unsplash and Pexels, downloaded for local use under their respective licenses. Stock models are not our fictional instructors or students. Fonts: Inter and Montserrat, SIL Open Font License. Icons: Lucide, ISC license. The mood reel is an original silent edit of licensed stills. Full source URLs and license notices are in assets/credits.txt."]
};
$$("[data-info]").forEach((button) => button.addEventListener("click", () => { const [title, ...lines] = info[button.dataset.info]; infoDialog(title, lines); }));
const menu = $(".menu"), navigation = $("#navigation"), header = $("#header");
function closeMenu() { navigation.classList.remove("open"); header.classList.remove("menu-open"); menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", "Open menu"); }
menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(open)); menu.setAttribute("aria-label", open ? "Close menu" : "Open menu"); navigation.classList.toggle("open", open); header.classList.toggle("menu-open", open); });
$$("a", navigation).forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { closeMenu(); menu.focus(); } });
window.addEventListener("resize", () => { if (innerWidth > 740) closeMenu(); });
window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 30), { passive: true });
header.classList.toggle("scrolled", scrollY > 30);
renderSchedule();
