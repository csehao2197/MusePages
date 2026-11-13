import { ICONS } from "./assets/icons.js";
import { CERTIFICATIONS, catalog, recommendation, CREDENTIALS, lookup, LESSONS, EXAM, grade, seatCount, sessionCalendar } from "./assets/engine.js";
const $ = (id) => document.getElementById(id);
const icon = (id) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[id] ?? ""}</svg>`;
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const levels = ["", "Beginner", "Intermediate", "Expert"];
let category = "all", query = "", expanded = false, opener, answers = [], assessmentStep = 0;
const completed = new Set();
const dialog = $("dialog"), content = $("dialog-content");
function modal(title, body, eyebrow = "LOCAL, FICTIONAL PREVIEW") {
  if (!dialog.open) opener = document.activeElement;
  content.innerHTML = `<p class="eyebrow">${eyebrow}</p><h2 id="dialog-title" tabindex="-1">${title}</h2>${body}`;
  if (!dialog.open) dialog.showModal();
  $("dialog-title").focus();
}
dialog.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => { content.replaceChildren(); opener?.focus({ preventScroll: true }); });
function download(value, name, type) {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function renderCatalog() {
  const result = catalog(category, query, expanded);
  $("cert-grid").innerHTML = result.items.map((item) => `<article class="cert-card"><div class="card-top"><span class="cert-badge" data-category="${item.category}" data-shape="${item.shape}">${icon(item.icon)}</span><span class="level">${levels[item.level]}</span></div><h3>${item.name}</h3><p>${item.description}</p><div class="card-hours">${icon("clock")}${item.hours} hrs study + ${item.exam} hr exam</div><div class="card-value"><strong>$${item.price}</strong><span class="difficulty" data-level="${item.level}" role="img" aria-label="Difficulty ${item.level} of 3"><i></i><i></i><i></i></span></div><div class="card-footer"><span>${icon("users")}${item.count.toLocaleString("en-US")} sample certified</span><button class="text-button" data-detail="${item.id}" aria-label="View details for ${item.name}">View Details ${icon("arrow-right")}</button></div></article>`).join("") || '<div class="catalog-empty"><h3>No matching path yet.</h3><p>Try a different search or clear the selected category.</p></div>';
  $("catalog-status").textContent = `Showing ${result.items.length} of ${result.total} matching illustrative certifications`;
  $("view-all").hidden = expanded || category !== "all" || Boolean(query.trim());
  $("reset-catalog").hidden = category === "all" && !query.trim() && !expanded;
  document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === category)));
}
document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => { category = button.dataset.filter; renderCatalog(); }));
$("catalog-search").addEventListener("input", (event) => { query = event.target.value; renderCatalog(); });
$("view-all").addEventListener("click", () => { expanded = true; renderCatalog(); $("catalog-status").focus(); });
$("reset-catalog").addEventListener("click", () => { category = "all"; query = ""; expanded = false; $("catalog-search").value = ""; renderCatalog(); $("catalog-search").focus(); });
function detail(id) {
  const item = CERTIFICATIONS.find((entry) => entry.id === id);
  if (!item) return;
  modal(item.name, `<p>${item.description}.</p><div class="dialog-item"><strong>${levels[item.level]} · $${item.price} sample price</strong><span>${item.hours} study hours + ${item.exam} exam hours. At five study hours per week, allow about ${Math.ceil(item.hours / 5)} weeks. Preparation and outcomes vary.</span></div><h3>Proposed curriculum</h3><ul><li>${{ cloud: "Architecture, networking and service resilience", data: "Data modeling, ingestion and trustworthy pipelines", security: "Threat modeling, access controls and incident response", ai: "Data quality, model evaluation and responsible deployment" }[item.category]}</li><li>Applied scenarios, review checkpoints and exam preparation</li></ul><p>${item.level === 1 ? "Foundational path: no prior professional experience assumed." : "Suggested prerequisite: practical experience in this discipline and familiarity with its fundamentals."} These are proposed requirements, not enrollment criteria for a live course.</p><div class="dialog-actions"><button class="button primary" data-plan="single" data-cert="${item.id}">Preview this plan ${icon("arrow-right")}</button><button class="button outline" data-open-lesson="0">Try a mini lesson</button></div><p class="dialog-footnote">All counts, prices, curriculum and credentials are fictional. No checkout or qualification.</p>`);
}
const assessmentQuestions = [
  ["Which direction interests you?", [["cloud", "Cloud & infrastructure"], ["data", "Data & analytics"], ["security", "Cybersecurity"], ["ai", "AI & machine learning"]]],
  ["How much experience do you have in that area?", [["new", "I am new to it"], ["some", "I have used the fundamentals"], ["experienced", "I work with it professionally"]]],
  ["How much study time can you protect each week?", [["3", "About 3 hours"], ["5", "About 5 hours"], ["8", "8 hours or more"]]],
  ["What is your next goal?", [["explore", "Explore a new discipline"], ["build", "Build practical confidence"], ["lead", "Lead more complex work"]]],
  ["What pace feels right?", [["gentle", "Start with a foundation"], ["stretch", "Stretch my existing skills"]]],
];
function assessment(reset = false) {
  if (reset) { answers = []; assessmentStep = 0; }
  const [question, choices] = assessmentQuestions[assessmentStep];
  modal("Find a useful starting point.", `<div class="assessment-progress" aria-label="Step ${assessmentStep + 1} of 5">${assessmentQuestions.map((_, index) => `<span class="${index <= assessmentStep ? "done" : ""}"></span>`).join("")}</div><form id="assessment-form"><fieldset><legend class="assessment-question">${question}</legend>${choices.map(([value, label]) => `<label class="choice"><input type="radio" name="answer" value="${value}" required ${answers[assessmentStep] === value ? "checked" : ""}>${label}</label>`).join("")}</fieldset><div class="dialog-actions">${assessmentStep ? '<button class="button outline" type="button" data-assessment-back>Back</button>' : ""}<button class="button primary" type="submit">${assessmentStep === 4 ? "See recommendation" : "Next question"}</button></div></form><p class="dialog-footnote">Five fixed questions, not a validated career assessment. Answers stay in this tab.</p>`);
}
function renderLessons() {
  $("study-lessons").innerHTML = LESSONS.map((lesson, index) => `<button class="${completed.has(index) ? "local-complete" : index < 4 ? "illustrative" : ""}" data-open-lesson="${index}"><span>${completed.has(index) || index < 4 ? icon("check") : index + 1}</span>${lesson.title}<small>${completed.has(index) ? "LOCAL CHECK PASSED" : index < 4 ? "SAMPLE COMPLETE" : "PREVIEW"}</small></button>`).join("");
  $("local-preview-count").textContent = `${completed.size} / 6 local previews`;
  if (completed.size) {
    $("study-progress-label").textContent = "Local mini-lesson checks";
    $("study-progress-value").textContent = `${Math.round(completed.size / 6 * 100)}%`;
    $("study-progress-bar").style.width = `${completed.size / 6 * 100}%`;
  }
}
function lesson(index) {
  const item = LESSONS[index];
  if (!item) return;
  modal(item.title, `<p>${item.text}</p><pre class="lesson-code">${escape(item.code)}</pre><form id="lesson-form" data-index="${index}"><fieldset><legend>${item.question}</legend>${item.options.map((option, value) => `<label class="choice"><input type="radio" name="answer" value="${value}" required>${option}</label>`).join("")}</fieldset><button type="submit" class="button primary">Check understanding</button><p id="lesson-status" role="status"></p></form><p class="dialog-footnote">Original short explanation. Code is illustrative and never executed.</p>`);
}
function exam() {
  modal("A small test of understanding.", `<p>Three original, untimed questions. This is not a proctored exam or certification.</p><form id="exam-form">${EXAM.map((question, index) => `<div class="exam-question"><fieldset><legend>${index + 1}. ${question.question}</legend>${question.options.map((option, value) => `<label class="choice"><input type="radio" name="q${index}" value="${value}" required>${option}</label>`).join("")}</fieldset></div>`).join("")}<button class="button primary" type="submit">Review my answers</button></form>`);
}
function helper() {
  modal("A little clarity, on demand.", `<p>This is a fixed, scripted helper, not an AI model. Choose one of six topics to see an original explanation; it cannot answer arbitrary questions.</p><form id="helper-form"><label>Study topic<select name="topic">${LESSONS.map((item, index) => `<option value="${index}">${item.title}</option>`).join("")}</select></label><button class="button primary" type="submit">Show explanation</button></form><div id="helper-answer" class="helper-answer" role="status"></div>`);
}
function plan(type, id) {
  const item = CERTIFICATIONS.find((entry) => entry.id === id);
  modal(type === "annual" ? "A year of possibilities." : "One focused next step.", `<p>${type === "annual" ? "All-Access Annual: $999 per year. All 12 proposed certifications, unlimited retakes, priority support and early access." : `${item ? `${item.name}: $${item.price}` : "Single certification: $199–$599"}. One proposed exam attempt, study path, labs and sample badge. One conditional free retake after 100% study completion.`}</p><div class="dialog-item"><strong>Plan preview, not a purchase</strong><p>No payment details are requested. There is no enrollment, live course, account, renewal charge or refund contract.</p></div><button class="button primary" data-compare>Compare proposed plans</button>`);
}
function sales() {
  modal("Build your team's next chapter.", `<p>Preview an enterprise inquiry. Nothing is transmitted or stored; the proposed service is not available.</p><form id="sales-form"><label>Your name<input name="name" required maxlength="80" autocomplete="off"></label><label>Work email<input name="email" type="email" required maxlength="160" autocomplete="off"></label><label>Company<input name="company" required maxlength="120" autocomplete="off"></label><label>Team size (10–100,000)<input name="seats" type="number" min="10" max="100000" step="1" value="10" required></label><button class="button primary" type="submit">Preview inquiry</button></form>`);
}
function compare() {
  modal("Choose scope, not guesswork.", `<p>All features are proposed. This comparison creates no purchase or entitlement.</p><div class="compare-scroll"><table><caption>Illustrative plans. No real services or refund contract.</caption><thead><tr><th scope="col">Feature</th><th scope="col">Single</th><th scope="col">Annual</th><th scope="col">Enterprise</th></tr></thead><tbody>${[["Price", "$199–$599", "$999 / year", "Custom · 10+ seats"], ["Certifications", "One", "All 12", "Custom paths"], ["Retakes", "One, if study path completed", "Unlimited", "Agreed in contract"], ["Study paths & labs", "Included", "Included", "Custom"], ["Badge & PDF", "Proposed", "Proposed", "Proposed"], ["Support", "Standard", "Priority", "Success manager"], ["Team reporting & SSO", "Not included", "Not included", "Proposed"], ["API access", "Not included", "Not included", "Proposed"]].map((row) => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
}
function session() {
  modal("Make a little room to learn.", `<p>Choose a future, 45-minute session in your device's local time zone (${escape(Intl.DateTimeFormat().resolvedOptions().timeZone)}). Download a real calendar file to import yourself. No reminder is scheduled here.</p><form id="session-form"><label>Local start time<input type="datetime-local" name="when" required></label><button class="button primary" type="submit">Download calendar event</button><p id="session-status" role="status"></p></form>`);
}
function info(topic) {
  const texts = {
    Privacy: "The page makes no account, lookup or form submissions and uses no cookies, localStorage or analytics. Answers and mini-lesson progress exist only in this tab's memory and reset on reload. Closing a form clears its typed contents. Calendar and badge downloads are saved only if you choose them.",
    Terms: "CredPath is a fictional local demonstration. Prices, employer recognition, survey attribution, reviews, credentials and outcomes are illustrative and unverified. No accreditation, course access, job placement, exam, payment, contract or guarantee is provided.",
    Accessibility: "The interface supports keyboard navigation, visible focus, native dialogs, reduced motion and responsive layouts. Catalog filters use pressed states; status messages announce updates. Formal screen-reader and WCAG conformance audits have not been performed.",
    Help: "Browse the twelve sample certifications, take five fixed questions, try six mini lessons and three practice questions, or look up one of three fictional credentials. Sample records are not proof of identity or qualifications. Reload to reset the local learning state.",
  };
  modal(escape(topic), `<p>${texts[topic] ?? "This fictional profile has no real social account or verified employer relationship."}</p>`);
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-detail")) detail(button.dataset.detail);
  else if (button.hasAttribute("data-assessment")) assessment(true);
  else if (button.hasAttribute("data-assessment-back")) {
    const form = $("assessment-form");
    const selected = new FormData(form).get("answer");
    if (selected) answers[assessmentStep] = selected;
    assessmentStep--; assessment();
  }
  else if (button.hasAttribute("data-open-lesson")) lesson(Number(button.dataset.openLesson));
  else if (button.hasAttribute("data-exam")) exam();
  else if (button.hasAttribute("data-helper")) helper();
  else if (button.hasAttribute("data-plan")) plan(button.dataset.plan, button.dataset.cert);
  else if (button.hasAttribute("data-sales")) sales();
  else if (button.hasAttribute("data-compare")) compare();
  else if (button.hasAttribute("data-session")) session();
  else if (button.hasAttribute("data-info")) info(button.dataset.info);
  else if (button.hasAttribute("data-account")) modal("Your local learning preview.", `<p>No login service or real account exists. This tab has ${completed.size} of 6 original mini-lesson checks completed. Reloading resets it.</p><div class="dialog-actions"><button class="button primary" data-open-lesson="0">Try the first mini lesson</button><button class="button outline" data-assessment>Find a path</button></div>`);
  else if (button.hasAttribute("data-sample")) {
    const record = CREDENTIALS[{ cloud: 0, data: 1, security: 2 }[button.dataset.sample]];
    $("credential-input").value = record.id; $("verify-form").requestSubmit();
  }
});
document.addEventListener("submit", (event) => {
  const form = event.target, data = new FormData(form);
  event.preventDefault();
  if (form.id === "assessment-form") {
    answers[assessmentStep] = data.get("answer");
    if (assessmentStep < 4) { assessmentStep++; assessment(); }
    else {
      const item = recommendation(answers);
      modal("A direction to explore.", `<p>A transparent fixed-rule suggestion, not career advice: <strong>${item.name}</strong>.</p><div class="dialog-item"><strong>Why this path?</strong><p>Your discipline selects the category. A new start, exploration goal or gentle pace selects a foundation. Expert requires professional experience, a leadership goal, eight weekly hours and a stretch pace. Otherwise an intermediate path is suggested; AI falls back to its foundation when no intermediate exists.</p></div><button class="button primary" data-detail="${item.id}">Explore ${item.name}</button><button class="text-button" data-assessment>Start again</button>`);
    }
  } else if (form.id === "lesson-form") {
    const index = Number(form.dataset.index), correct = grade([LESSONS[index]], [Number(data.get("answer"))]) === 1;
    if (correct) completed.add(index);
    renderLessons();
    $("lesson-status").className = correct ? "local-success" : "";
    $("lesson-status").textContent = correct ? "Correct. This local mini-lesson check is complete; no certification credit is awarded." : "Not quite. Read the explanation above and try another answer.";
  } else if (form.id === "exam-form") {
    const selected = EXAM.map((_, index) => Number(data.get(`q${index}`)));
    const score = grade(EXAM, selected);
    modal(`${score} of 3 correct.`, `<p>${score === 3 ? "A useful start. Keep practicing." : "Understanding grows with another look."} No pass, credential or exam result is issued.</p>${EXAM.map((item, index) => `<div class="dialog-item"><strong>${index + 1}. ${selected[index] === item.answer ? "Correct" : "Review"}: ${item.options[item.answer]}</strong><p>${item.text}</p></div>`).join("")}<button class="button primary" data-exam>Try again</button>`);
  } else if (form.id === "helper-form") {
    const item = LESSONS[Number(data.get("topic"))];
    $("helper-answer").replaceChildren();
    const heading = document.createElement("h3"), paragraph = document.createElement("p");
    heading.textContent = item.title; paragraph.textContent = item.text;
    $("helper-answer").append(heading, paragraph);
  } else if (form.id === "verify-form") {
    const record = lookup(data.get("credential"));
    const result = $("verification-result");
    result.hidden = false;
    result.className = `verification-result ${record?.status === "expired" ? "expired" : !record ? "not-found" : ""}`;
    result.innerHTML = record ? `<h4>Fictional record · ${record.status.toUpperCase()}</h4><p><strong>${record.name}</strong> · ${record.certification}</p><p>${record.id}<br>Issued ${record.issued} · Expires ${record.expires} at 00:00 UTC</p><p>Fixed sample, not a verified qualification, identity check or endorsement.</p>` : "<h4>No matching sample record</h4><p>Only three fixed fictional examples are available. This result says nothing about a real person's credentials.</p>";
  } else if (form.id === "sales-form") {
    let seats;
    try { seats = seatCount(data.get("seats")); } catch (error) { form.elements.seats.setCustomValidity(error.message); form.elements.seats.reportValidity(); return; }
    const company = data.get("company").trim();
    const emptyField = !data.get("name").trim() ? form.elements.name : !company ? form.elements.company : null;
    if (emptyField) { emptyField.setCustomValidity("Enter text rather than only spaces."); emptyField.reportValidity(); return; }
    modal("Your inquiry, previewed.", `<p>${escape(company)} · ${seats.toLocaleString("en-US")} seats.</p><div class="dialog-item"><strong>Not sent. No quote created.</strong><p>The form contents have been removed from the page. No sales team, invoice, account or follow-up email is connected.</p></div>`);
  } else if (form.id === "session-form") {
    try { download(sessionCalendar(data.get("when")), "credpath-local-study.ics", "text/calendar;charset=utf-8"); $("session-status").textContent = "Calendar file created. Import it into your calendar yourself; no reminder was scheduled here."; }
    catch (error) { $("session-status").textContent = error.message; }
  } else if (form.id === "start-form") {
    form.reset(); $("start-status").textContent = "Local preview only: no account created, email sent or address stored. Try the assessment or a mini lesson.";
    modal("A small beginning.", `<p>No account was created and your email was not sent or stored. Explore the assessment and first original mini lesson without signing in.</p><div class="dialog-actions"><button class="button primary" data-assessment>Find a starting point</button><button class="button outline" data-open-lesson="0">Try a mini lesson</button></div>`);
  }
});
document.addEventListener("input", (event) => event.target.setCustomValidity?.(""));
const motion = $("motion-toggle"), track = document.querySelector(".employer-track");
motion.addEventListener("click", () => {
  const paused = track.classList.toggle("paused");
  motion.setAttribute("aria-pressed", String(paused)); motion.setAttribute("aria-label", `${paused ? "Resume" : "Pause"} employer name animation`); motion.innerHTML = icon(paused ? "play" : "pause");
});
const nav = $("navigation"), menu = document.querySelector(".menu"), backdrop = document.querySelector(".nav-backdrop");
let inertElements = [];
function toggleMenu(open) {
  nav.classList.toggle("open", open); menu.setAttribute("aria-expanded", String(open)); backdrop.hidden = !open;
  if (open) {
    nav.setAttribute("role", "dialog"); nav.setAttribute("aria-modal", "true");
    inertElements = [...document.querySelectorAll("main, footer, .mobile-browse, .concept-bar, .header-inner > :not(nav), .skip")].filter((element) => !element.inert);
    inertElements.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden"; nav.querySelector("button").focus();
  } else {
    nav.removeAttribute("role"); nav.removeAttribute("aria-modal"); inertElements.forEach((element) => { element.inert = false; }); inertElements = [];
    document.body.style.overflow = ""; menu.focus({ preventScroll: true });
  }
}
menu.addEventListener("click", () => toggleMenu(true));
nav.querySelector(".drawer-close").addEventListener("click", () => toggleMenu(false));
backdrop.addEventListener("click", () => toggleMenu(false));
nav.querySelectorAll("a").forEach((anchor) => anchor.addEventListener("click", () => { if (nav.classList.contains("open")) toggleMenu(false); }));
nav.addEventListener("keydown", (event) => {
  if (!nav.classList.contains("open")) return;
  if (event.key === "Escape") { event.preventDefault(); toggleMenu(false); }
  if (event.key === "Tab") {
    const controls = [...nav.querySelectorAll("button,a")], first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
matchMedia("(min-width: 761px)").addEventListener("change", (event) => { if (event.matches && nav.classList.contains("open")) toggleMenu(false); });
$("testimonials-grid").innerHTML = [
  ["david", "David Chen", "Cloud Architecture Professional", "AWS Solutions Architect at Stripe", "I studied 45 minutes a day for 8 weeks and passed on my first attempt. The structured path made it feel achievable, not overwhelming."],
  ["amara", "Amara Osei", "Data Engineering Associate", "Data Engineer at Spotify", "The practice labs were the game-changer. I wasn't just memorizing — I was actually building things. That confidence carried into the exam and my job."],
  ["ryan", "Ryan Murphy", "Cybersecurity Analyst", "Security Analyst at JPMorgan", "My CredPath badge on LinkedIn got me 3 recruiter messages within a week. Employers actually recognize and trust this credential."],
].map(([id, name, certification, role, quote]) => `<article class="testimonial"><div class="testimonial-stars" aria-label="Illustrative five-star review">${icon("star").repeat(5)}</div><blockquote>“${quote}”</blockquote><div class="testimonial-person"><img src="assets/${id}.svg" alt="Original fictional portrait illustration" width="36" height="36"><div><strong>${name}</strong><p>${certification}<br>${role}</p></div><button data-info="Fictional profile" aria-label="About ${name}'s fictional profile">${icon("linkedin")}</button></div><p class="testimonial-note">FICTIONAL TESTIMONIAL · NO VERIFIED ROLE OR ENDORSEMENT</p></article>`).join("");
renderCatalog(); renderLessons();
