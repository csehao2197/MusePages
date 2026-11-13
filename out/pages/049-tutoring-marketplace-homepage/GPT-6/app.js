const $ = (s) => document.querySelector(s);
const tutors = [
  { name: "Dr. Sarah Chen", subject: "Math & Statistics", match: "math mathematics statistics algebra calculus science", affiliation: "Illustrative Stanford mathematics PhD", badge: "PHD IN MATHEMATICS", rate: 45, rating: "4.98", reviews: 412, lessons: "1,200+ lessons*", bio: "I turn intimidating equations into small, satisfying steps. Bring your questions and your curiosity." },
  { name: "Carlos Mendez", subject: "Spanish & Portuguese", match: "spanish portuguese languages", affiliation: "Illustrative native speaker from Madrid", badge: "NATIVE SPEAKER", rate: 28, rating: "4.96", reviews: 678, lessons: "2,100+ lessons*", bio: "Conversation first. We’ll learn with stories, real-life situations and room to make mistakes." },
  { name: "Emily Park", subject: "SAT / ACT Prep", match: "sat act test prep", affiliation: "Illustrative Princeton graduate · 1580 SAT", badge: "TEST PREP SPECIALIST", rate: 55, rating: "4.97", reviews: 356, lessons: "+200 points*", bio: "A thoughtful strategy beats endless cramming. We’ll make a practical plan that plays to your strengths." },
  { name: "Raj Patel", subject: "Python & Web Development", match: "python web programming javascript java c++", affiliation: "Illustrative senior engineer profile", badge: "INDUSTRY EXPERT", rate: 40, rating: "4.95", reviews: 534, lessons: "1,800+ lessons*", bio: "Learn by making something real. I’ll help you read errors, ask good questions and build with confidence." }
];
const subjects = [
  ["∑", "Mathematics", "Algebra, Calculus, Statistics, Geometry", "2,400", 25, "Math"],
  ["</>", "Programming", "Python, JavaScript, Java, C++", "1,800", 30, "Python"],
  ["文", "Languages", "Spanish, French, Mandarin, Japanese", "3,200", 20, "Spanish"],
  ["A+", "Test prep", "SAT, ACT, GRE, GMAT, IELTS", "1,500", 35, "SAT"],
  ["⌬", "Sciences", "Physics, Chemistry, Biology", "1,600", 28, "Science"],
  ["Aa", "Writing", "Essays, Creative Writing, Grammar", "900", 22, "Writing"],
  ["♫", "Music", "Piano, Guitar, Voice, Music Theory", "1,100", 30, "Piano"],
  ["↗", "Business", "Economics, Finance, Marketing", "700", 32, "Business"]
];
function portrait(index) {
  const palettes = [["#44303f", "#e7b6a0", "#8d789d", "#46343e"], ["#493932", "#c8916d", "#6f8e78", "#49372f"], ["#3c3036", "#edc2a6", "#c4a066", "#30282d"], ["#38322c", "#b98160", "#6a82a1", "#332b25"], ["#584339", "#c9916b", "#97a1b6", "#3e342e"]];
  const [hair, skin, shirt, detail] = palettes[index % 5];
  return `<svg viewBox="0 0 240 270" aria-hidden="true"><circle cx="120" cy="142" r="95" fill="#ffffff15"/><path d="M24 270c0-59 35-95 96-95s96 36 96 95" fill="${shirt}"/><path d="m90 178 30 33 30-33v-35H90" fill="${skin}"/><path d="M61 104c0-53 28-74 59-74 43 0 63 31 63 77v70H58Z" fill="${hair}"/><ellipse cx="120" cy="116" rx="48" ry="61" fill="${skin}"/><path d="${index === 0 || index === 2 ? "M70 108c0-58 31-73 53-73 38 0 62 32 57 71-9-33-29-48-41-55-15 28-39 41-69 45Z" : "M68 97c-6-39 22-65 55-65 39 0 60 28 54 68-18-32-53-16-64-37-15 19-33 20-45 34Z"}" fill="${hair}"/><path d="M95 114h13M133 114h13" stroke="${detail}" stroke-width="3" stroke-linecap="round"/><circle cx="103" cy="123" r="2" fill="${detail}"/><circle cx="139" cy="123" r="2" fill="${detail}"/><path d="m121 123-3 17h8M108 152q12 11 25-1" fill="none" stroke="${detail}" stroke-width="2" stroke-linecap="round"/><path d="m78 200 25 70M163 199l-23 71" stroke="#ffffff22" stroke-width="3"/>${index === 0 ? '<g fill="none" stroke="#735c74" stroke-width="2"><rect x="85" y="113" width="31" height="22" rx="8"/><rect x="125" y="113" width="31" height="22" rx="8"/><path d="M116 120h9"/></g>' : ""}</svg>`;
}
document.querySelectorAll("[data-person]").forEach((el) => el.innerHTML = portrait(Number(el.dataset.person)));
$("#subject-grid").innerHTML = subjects.map((s) => `<button class="subject-card" data-subject="${s[5]}"><span class="subject-symbol">${s[0]}</span><strong>${s[1]}</strong><p>${s[2]}</p><span class="subject-bottom"><span>${s[3]} tutors*</span><b>From $${s[4]}/hr ↗</b></span></button>`).join("");
let query = "";
function renderTutors() {
  const filter = $("#subject-filter").value.toLowerCase();
  const budget = Number($("#budget-filter").value);
  const visible = tutors.map((t, i) => ({ ...t, i })).filter((t) => `${t.subject} ${t.name} ${t.match}`.toLowerCase().includes(query) && `${t.subject} ${t.match}`.toLowerCase().includes(filter) && t.rate <= budget);
  $("#results").textContent = `${visible.length} sample tutor${visible.length === 1 ? "" : "s"}`;
  $("#tutor-grid").innerHTML = visible.length ? visible.map((t) => `<article class="tutor-card"><div class="tutor-portrait">${portrait(t.i)}<span class="tutor-badge">${t.badge}</span><span class="online-indicator"><span></span>Sample availability</span></div><div class="tutor-info"><h3>${t.name} <small title="Fictional verified-profile badge">✓</small></h3><p class="tutor-subject">${t.subject}</p><p class="tutor-bio">${t.affiliation}</p><div class="tutor-rating"><span>★</span><b>${t.rating}</b><small>(${t.reviews} sample reviews)</small></div><div class="tutor-rate"><strong>$${t.rate}<small>/hour</small></strong><small>${t.lessons}</small></div><button data-tutor="${t.i}">Meet ${t.name.split(" ")[t.i === 0 ? 1 : 0]} · free trial ↗</button></div></article>`).join("") : '<p class="no-results">No matching sample tutors. Try Math, Spanish, SAT or Python, or reset the filters. Other subject areas are concept categories only.</p>';
}
function search(subject) {
  query = subject.trim().toLowerCase();
  $("#search").value = subject;
  $("#subject-filter").value = "";
  renderTutors();
  $("#tutors").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
$("#search-form").onsubmit = (e) => { e.preventDefault(); search($("#search").value); };
$("#subject-filter").onchange = renderTutors;
$("#budget-filter").onchange = renderTutors;
function reset() { query = ""; $("#search").value = ""; $("#subject-filter").value = ""; $("#budget-filter").value = "100"; renderTutors(); }
$("#clear-filters").onclick = reset;
$("#browse-all").onclick = reset;
$("#all-subjects").onclick = () => { show("Where will your curiosity take you?", "<p>Eight concept categories cover 150+ proposed subjects. This demo includes four tutor profiles in Math, Spanish, SAT/ACT and Python.</p><p>Use the subject cards to search the sample catalog. Unrepresented subjects return an honest empty state.</p>"); };
const dialog = $("#dialog");
function show(title, content) { $("#dialog-title").textContent = title; $("#dialog-content").innerHTML = content; if (!dialog.open) dialog.showModal(); }
$("#close").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
function book(index) {
  const t = tutors[index];
  show(`Your next chapter with ${t.name.split(" ")[index === 0 ? 1 : 0]}`, `<p><strong>${t.subject}</strong> · $${t.rate}/hour</p><p>${t.bio}</p><p>Fictional profile. Sample qualifications and reviews have not been verified. No actual booking will be made.</p><form id="booking-form"><label for="package">Lesson plan</label><select id="package"><option value="trial">Free 30-minute introduction</option><option value="single">One 60-minute lesson</option><option value="six">5 paid + 1 free lesson</option><option value="ten">10 lessons · save 15%</option><option value="twenty">20 lessons · save 15%</option></select><label for="slot">Illustrative availability (your local time)</label><select id="slot"><option>Monday, 10:00 AM</option><option>Wednesday, 4:00 PM</option><option>Saturday, 11:00 AM</option></select><label for="learner">Your first name</label><input id="learner" required maxlength="60" autocomplete="given-name"><label for="goal">A goal you’d love to reach</label><input id="goal" required maxlength="200" placeholder="Feel confident in calculus"><p class="booking-total" id="booking-total"></p><button class="primary">Preview my lesson</button></form>`);
  function total() { const n = $("#package").value; return n === "trial" ? 0 : n === "single" ? t.rate : n === "six" ? t.rate * 5 : n === "ten" ? t.rate * 10 * .85 : t.rate * 20 * .85; }
  const update = () => $("#booking-total").innerHTML = `$${total().toFixed(2)} <small>sample total · no charge</small>`;
  $("#package").onchange = update; update();
  $("#booking-form").onsubmit = (e) => { e.preventDefault(); const name = $("#learner").value; const goal = $("#goal").value; const slot = $("#slot").value; const plan = $("#package").selectedOptions[0].textContent; const cost = total(); show("A little preview of what’s next.", '<div class="receipt" id="receipt"></div><p>No reservation, account, payment or instructor notification has been created. This preview resets on reload.</p>'); $("#receipt").textContent = `${name} + ${t.name} · ${plan} · ${slot} · $${cost.toFixed(2)} · Goal: ${goal}`; };
}
const panels = {
  start: ["Let’s find your person.", "<p>Choose a subject to explore four fictional tutors. Your first 30-minute introduction is a local booking preview with no payment or commitment.</p><button id='start-search' class='primary'>Explore sample tutors ↗</button>"],
  login: ["A little space to explore.", "<p>This concept doesn’t create or authenticate accounts. You can try tutor discovery and booking previews without signing in.</p><button id='start-search' class='primary'>Explore without an account ↗</button>"],
  teach: ["Share what lights you up.", "<p>Preview a tutor application. Nothing is stored or submitted.</p><form id='teach-form'><label for='teacher-name'>Your name</label><input id='teacher-name' required maxlength='60'><label for='teacher-subject'>What do you love to teach?</label><input id='teacher-subject' required maxlength='150'><label for='teacher-email'>Email</label><input id='teacher-email' type='email' required maxlength='160'><button class='primary'>Preview application</button></form>"],
  classroom: ["A classroom built around a conversation.", "<p>The proposed classroom includes video, shared notes, a whiteboard and code editing. The illustrations are interface concepts, not screenshots of a running video service.</p><p>No camera, microphone, recording or live collaboration is activated by this demo.</p>"],
  help: ["Every good question is welcome.", "<p>Try searching one of four subjects, comparing hourly rates, previewing a tutor booking and opening the FAQ answers. All actions run locally.</p><p>Real support contact details are not provided for this fictional brand.</p>"],
  resources: ["A great lesson starts with a good question.", "<p>Original tutor checklist: ask about the learner’s goal, agree on one small outcome, work through an example together, invite questions, and end with a next step.</p>"],
  about: ["A more human way to grow.", "<p>BrightMinds is a fictional education marketplace concept. All profiles, testimonials, platform metrics, affiliations and outcomes are illustrative.</p>"],
  careers: ["This is a product concept.", "<p>There are no live job openings, press endorsements or published company news. Publication logos have intentionally been replaced by an honest product demonstration.</p>"],
  social: ["A place for future conversations.", "<p>Social channels are proposed navigation only. No official BrightMinds accounts or external endorsements are claimed.</p>"],
  app: ["Your classroom, wherever you are.", "<p>App Store and Google Play listings are future concept destinations. No downloadable or installed app is supplied.</p>"],
  privacy: ["A private little exploration.", "<p>No analytics, cookies, account, local storage or backend are used. Form input stays in memory on this page and resets on reload. No email is sent.</p>"],
  terms: ["Concept, not a learning contract.", "<p>This static homepage provides no actual tutoring, verification, enrollment, transaction, free trial entitlement, guarantee or refund service. Rates and claims are fictional.</p>"],
  accessibility: ["Room for every kind of learner.", "<p>Keyboard access, visible focus, native dialogs, labeled forms, readable empty states and reduced-motion support are included. Mobile tutor cards support touch scrolling.</p>"]
};
document.addEventListener("click", (e) => {
  const el = e.target.closest("button,a");
  if (!el) return;
  if (el.dataset.subject) { $("#budget-filter").value = "100"; search(el.dataset.subject); }
  if (el.dataset.tutor !== undefined) book(Number(el.dataset.tutor));
  if (el.dataset.dialog && panels[el.dataset.dialog]) {
    show(...panels[el.dataset.dialog]);
    if (el.dataset.dialog === "teach") $("#teach-form").onsubmit = (event) => { event.preventDefault(); const name = $("#teacher-name").value; const subject = $("#teacher-subject").value; show("A promising first step.", "<p id='application-preview'></p><p>Local preview only. No application, email or verification process was started.</p>"); $("#application-preview").textContent = `${name} · ${subject}`; };
  }
  if (el.id === "start-search") { dialog.close(); $("#tutors").scrollIntoView(); }
  if (el.closest("header nav")) { $("header nav").classList.remove("open"); $("#menu-toggle").setAttribute("aria-expanded", "false"); }
});
$("#menu-toggle").onclick = () => { const opened = $("header nav").classList.toggle("open"); $("#menu-toggle").setAttribute("aria-expanded", String(opened)); $("#menu-toggle").setAttribute("aria-label", opened ? "Close navigation" : "Open navigation"); };
$("#email-form").onsubmit = (e) => { e.preventDefault(); $("#email-status").textContent = "Your interest is previewed locally. No account was created and no email was sent."; $("#email").value = ""; };
renderTutors();
