const $ = (s) => document.querySelector(s);
const paths = {
  graduation: '<path d="m2 9 10-5 10 5-10 5-10-5Zm4 3v6c4 3 8 3 12 0v-6M22 9v8"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18M7 15h2M15 15h2"/>',
  heart: '<path d="M20 5c-3-3-7-2-8 1-1-3-5-4-8-1-5 6 8 15 8 15s13-9 8-15Z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m16 16 5 5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  flask: '<path d="M9 3h6M10 3v7L4 20h16l-6-10V3M7 15h10"/>',
  book: '<path d="M12 5c-3-3-8-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-2-1-7-2-10 1v15"/>',
  trophy: '<path d="M8 3h8v8c0 6-8 6-8 0V3ZM8 5H3v4c0 3 5 4 5 4m8-8h5v4c0 3-5 4-5 4M12 15v6M7 21h10"/>',
  city: '<path d="M3 21V9h7V3h9v18M1 21h22M6 12v2M6 17v2M13 6h3M13 10h3M13 14h3M13 18h3"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V3h8v4M2 12c5 4 15 4 20 0M12 12v5"/>',
  ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4V6ZM15 6v12"/>',
  shield: '<path d="M12 3 3 7v6c0 6 9 9 9 9s9-3 9-9V7l-9-4Zm-4 9 3 3 6-6"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13l6-6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 6 10 7L22 6"/>',
  file: '<path d="M4 3h11l5 5v13H4V3Zm11 0v6h5M8 13h8M8 17h8"/>'
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.book}</svg>`; }
document.querySelectorAll("[data-icon]").forEach((el) => { el.outerHTML = icon(el.dataset.icon); });
const events = [
  { title: "Class of 2016 · 10-year reunion", date: "2026-05-16", month: "MAY", day: "16", place: "Grand Hall · On campus", tag: "REUNION", description: "An illustrative return to campus: a welcome reception, campus walk and conversation with old classmates.", end: "20260517" },
  { title: "NYC Chapter · Networking mixer", date: "2026-04-03", month: "APR", day: "03", place: "The Loft · Manhattan", tag: "NETWORKING", description: "A concept evening of introductions and career conversations with the New York alumni chapter.", end: "20260404" },
  { title: "Career pivots after 30", date: "2026-04-09", month: "APR", day: "09", place: "Virtual · Webinar concept", tag: "VIRTUAL", description: "A proposed conversation about identifying transferable skills and taking a thoughtful next career step.", end: "20260410" },
  { title: "Homecoming Weekend 2026", date: "2026-10-10", month: "OCT", day: "10–12", place: "On campus · Three-day archive", tag: "HOMECOMING", description: "A fictional weekend of reunions, campus traditions and alumni connections, October 10–12.", end: "20261013" }
];
$("#event-list").innerHTML = events.map((e, i) => `<article class="event-row"><div class="date-block">${e.month}<strong>${e.day}</strong></div><div class="event-details"><span class="event-type">${e.tag} · ARCHIVED</span><h3>${e.title}</h3><p>${new Date(e.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}<br>${e.place}</p></div><button data-event="${i}">View archive ↗</button></article>`).join("");
const alumni = [
  { name: "Jordan Blake", initials: "JB", year: "2012", role: "Marketing Director", company: "Ogilvy", industry: "Marketing", location: "San Francisco", full: "San Francisco, CA", chapter: "San Francisco" },
  { name: "Aisha Okonkwo", initials: "AO", year: "2018", role: "Software Engineer", company: "Stripe", industry: "Technology", location: "London", full: "London, UK", chapter: "London" },
  { name: "Tom Nakamura", initials: "TN", year: "2005", role: "Partner", company: "Baker McKenzie", industry: "Law", location: "Tokyo", full: "Tokyo, Japan", chapter: "Tokyo" },
  { name: "Elena Petrova", initials: "EP", year: "2021", role: "Graduate Student", company: "MIT", industry: "Education", location: "Cambridge", full: "Cambridge, MA", chapter: "Boston" }
];
function renderDirectory() {
  const search = $("#search").value.toLowerCase().trim();
  const results = alumni.map((a, i) => ({ ...a, i })).filter((a) => `${a.name} ${a.year} ${a.company} ${a.location} ${a.role}`.toLowerCase().includes(search) && ["year", "industry", "location", "chapter"].every((key) => !$(`#${key}`).value || $(`#${key}`).value === a[key]));
  $("#results").textContent = `${results.length} sample alumni`;
  $("#directory-grid").innerHTML = results.length ? results.map((a) => `<article class="alumni-card"><span class="initial-avatar">${a.initials}</span><h3>${a.name} <small>’${a.year.slice(2)}</small></h3><p>${a.role}<br>${a.company}</p><span class="alumni-location">${icon("pin")}${a.full}</span><button data-connect="${a.i}">Say hello ↗</button></article>`).join("") : '<p class="no-results">No matching sample profiles. Reset the filters to see all four alumni.</p>';
}
$("#directory-form").onsubmit = (e) => { e.preventDefault(); renderDirectory(); };
$("#search").oninput = renderDirectory;
["year", "industry", "location", "chapter"].forEach((key) => $(`#${key}`).onchange = renderDirectory);
$("#reset").onclick = () => { $("#search").value = ""; ["year", "industry", "location", "chapter"].forEach((key) => $(`#${key}`).value = ""); renderDirectory(); };
$("#filter-toggle").onclick = () => { const opened = $("#filters").classList.toggle("open"); $("#filter-toggle").setAttribute("aria-expanded", String(opened)); };
const chapters = [["New York City", "3,800"], ["San Francisco", "2,400"], ["London", "1,100"], ["Chicago", "1,600"], ["Washington D.C.", "2,100"], ["Singapore", "680"]];
$("#chapter-grid").innerHTML = chapters.map((c, i) => `<article class="chapter-card"><span class="city-icon">${icon("city")}</span><h3>${c[0]}</h3><p>${c[1]} sample members</p><button class="text-btn" data-chapter="${i}">Join chapter ↗</button></article>`).join("");
const benefits = [
  ["briefcase", "Career services", "Resume reviews, coaching and a career worth exploring.", "The concept includes a job board, resume reviews and career coaching for alumni. No real appointment is available."],
  ["book", "Library access", "A lifetime of curiosity deserves a good library.", "Proposed digital databases and research access would depend on actual library eligibility and licensing."],
  ["ticket", "Campus discounts", "A little more of campus, for a little less.", "Concept bookstore, athletics and facility discounts. No actual partner redemption or discount code is provided."],
  ["shield", "Insurance plans", "Support for the things that matter most.", "Illustrative group-rate benefit only; no insurance quote, advice, enrollment or coverage."],
  ["plane", "Travel discounts", "Take your Crestfield connection with you.", "Proposed travel partner offers. This demo makes no hotel or airline reservation and claims no actual discount."],
  ["graduation", "Continuing education", "Your graduation was just the beginning.", "A concept benefit to audit select courses. No actual course enrollment, academic credit or certificate."],
  ["mail", "Email for life", "Keep a familiar address, wherever life takes you.", "A proposed @crestfield.edu alumni address. This fictional site creates no email account or domain entitlement."],
  ["file", "Transcript requests", "Your next step, with a little less paperwork.", "Official transcripts must come from an actual university registrar. This concept cannot issue documents."]
];
$("#benefit-grid").innerHTML = benefits.map((b, i) => `<details><summary>${icon(b[0])}<strong>${b[1]}</strong><p>${b[2]}</p></summary><p>${b[3]}</p><button class="text-btn" data-benefit="${i}">Explore benefit ↗</button></details>`).join("");
const dialog = $("#dialog");
function show(title, content) { $("#dialog-title").textContent = title; $("#dialog-content").innerHTML = content; if (!dialog.open) dialog.showModal(); }
$("#close").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
function simpleForm(kind, title, intro) {
  show(title, `<p>${intro}</p><form id="local-form"><label for="name">Your name</label><input id="name" required maxlength="80"><label for="form-email">Email address</label><input id="form-email" type="email" required maxlength="160"><label for="note">A note or area of interest</label><textarea id="note" rows="3" maxlength="500" required></textarea><button class="navy">Preview ${kind}</button></form><p>Local demo only. No information is stored or submitted.</p>`);
  $("#local-form").onsubmit = (e) => { e.preventDefault(); const text = `${$("#name").value} · ${$("#note").value}`; show("A little preview of what’s next.", '<div class="receipt" id="receipt"></div><p>No account, message, membership, mentorship or request has been created. Reload clears this local preview.</p>'); $("#receipt").textContent = text; };
}
function donation(campaign) {
  show("A little generosity. A little more possibility.", `<p><strong>${campaign}</strong></p><p>Preview a gift amount. This demo never asks for payment details.</p><form id="gift-form"><label for="amount">Illustrative gift (USD)</label><input id="amount" type="number" min="1" max="1000000" step="0.01" value="100" required><label for="frequency">Frequency</label><select id="frequency"><option>One-time gift</option><option>Monthly gift</option></select><button class="navy">Preview gift</button></form>`);
  $("#gift-form").onsubmit = (e) => { e.preventDefault(); const amount = Number($("#amount").value); if (!Number.isFinite(amount) || amount < 1 || amount > 1000000) return; const frequency = $("#frequency").value; show("A gift preview, with gratitude.", '<div class="receipt" id="gift-receipt"></div><p>No payment was made, recurring authorization created, donor total changed, receipt issued or tax benefit granted.</p>'); $("#gift-receipt").textContent = `${campaign} · ${frequency} · ${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}`; };
}
function eventDetail(i) {
  const e = events[i];
  show(e.title, `<p><strong>ARCHIVED · ${e.date}${i === 3 ? " through 2026-10-12" : ""}</strong><br>${e.place}</p><p>${e.description}</p><p>All original 2026 dates have passed. Registration and live joining are closed.</p><button class="navy" id="download-event">Download archive .ics</button><p>Calendar entries are all-day historical samples, not reservations or invitations.</p>`);
  $("#download-event").onclick = () => { const content = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Crestfield Concept//Alumni Archive//EN\r\nBEGIN:VEVENT\r\nUID:crestfield-demo-${i}@example.invalid\r\nDTSTAMP:20261113T000000Z\r\nDTSTART;VALUE=DATE:${e.date.replaceAll("-", "")}\r\nDTEND;VALUE=DATE:${e.end}\r\nSUMMARY:ARCHIVE DEMO - ${e.title}\r\nDESCRIPTION:Fictional past event. Registration closed.\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`; const url = URL.createObjectURL(new Blob([content], { type: "text/calendar" })); const a = document.createElement("a"); a.href = url; a.download = "crestfield-archived-event.ics"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
}
const stories = [
  ["Nadia · Leading with empathy", "This original fictional vignette imagines a physician whose approach to leadership began with listening: a seminar, a lab partner, and a professor who asked her to slow down and consider the person behind the problem. Today, she tries to make that same space for her team."],
  ["Marcus · Building what comes next", "An original fictional story of a student project becoming a circular-economy idea. Marcus’s most valuable first resource was not a pitch deck, but the classmates who stayed after a seminar to keep asking better questions."],
  ["Priya · Curiosity, with a little courage", "An original fictional vignette about a data scientist who learned that mentorship means more than providing an answer. One generous conversation made it possible to ask a question she had been keeping to herself."]
];
const panels = {
  login: ["A familiar connection, in concept.", "<p>This static demo has no real alumni authentication. The four public sample profiles are fictional; no private directory is exposed and no connection request is sent.</p>"],
  stories: ["Three stories. A shared beginning.", "<p>Explore the three original fictional alumni vignettes.</p><ul>" + stories.map((s, i) => `<li><button class="text-btn" data-story="${i}">${s[0]} ↗</button></li>`).join("") + "</ul>"],
  calendar: ["The 2026 alumni archive", '<p>All original event dates are preserved and clearly archived. Weekdays are calculated from the actual dates rather than copying inconsistent weekday labels in the brief.</p><ul class="calendar-list">' + events.map((e, i) => `<li><button data-event="${i}">${e.date} · ${e.title} ↗</button></li>`).join("") + "</ul>"],
  news: ["From the alumni office", "<p>Three fictional updates illustrate ranking news, career services and alumni entrepreneurship. No real ranking, Forbes recognition or employer endorsement is claimed.</p>"],
  benefits: ["Your connection goes further.", "<p>Explore eight concept benefits below. Actual eligibility would require an authorized alumni account and the university’s service terms.</p><p>This fictional site grants no insurance coverage, discount, university email or official transcript.</p>"],
  giving: ["A future worth sharing.", "<p>Planned giving and matching gifts are concept pathways. For now, explore a local gift preview in the campaign section. No financial or tax advice is provided.</p>"],
  about: ["Forever a part of something.", "<p>Crestfield University and its alumni association are fictional. This page explores a welcoming network for graduates, mentorship, events and giving.</p>"],
  contact: ["A university in concept.", "<p>The campus address, alumni office and people are illustrative. No live staff directory, real contact address or support delivery is available.</p>"],
  privacy: ["A private local preview.", "<p>No cookies, analytics, backend or local storage. Your search and form data stay in this page’s memory and disappear on reload. All photos are served locally.</p>"],
  social: ["A future place to connect.", "<p>LinkedIn, Facebook, Instagram, X and YouTube are proposed alumni channels, not actual accounts or links for this fictional institution.</p>"],
  accessibility: ["A welcoming connection.", "<p>Keyboard access, visible focus, native dialogs, labeled search/filter controls, responsive layouts and reduced-motion support are included. Stock portraits have explicit sample descriptions.</p>"]
};
document.addEventListener("click", (e) => {
  const el = e.target.closest("button,a");
  if (!el) return;
  if (el.dataset.event !== undefined) eventDetail(Number(el.dataset.event));
  if (el.dataset.story !== undefined) { const s = stories[Number(el.dataset.story)]; show(s[0], `<p>${s[1]}</p><p>Fictional story. Stock model is not the named person and does not endorse this concept.</p>`); }
  if (el.dataset.news !== undefined) { const i = Number(el.dataset.news); show(["A place among the nation’s best.", "Career support, for every chapter.", "A bright idea. A bigger impact."][i], "<p>This is an original fictional news preview, not a reported event. Rankings, publications and named organizations have not endorsed the university concept.</p>"); }
  if (el.dataset.connect !== undefined) { const a = alumni[Number(el.dataset.connect)]; simpleForm("introduction", `Say hello to ${a.name.split(" ")[0]}.`, `Class of ${a.year} · ${a.role}, ${a.company}. This profile and affiliation are fictional. Your introduction is only a local preview.`); }
  if (el.dataset.campaign) donation(el.dataset.campaign);
  if (el.dataset.chapter !== undefined) { const c = chapters[Number(el.dataset.chapter)]; simpleForm("chapter request", `Crestfield in ${c[0]}.`, `${c[1]} illustrative members. Preview your interest in this fictional regional chapter.`); }
  if (el.dataset.benefit !== undefined) { const b = benefits[Number(el.dataset.benefit)]; show(b[1], `<p>${b[2]}</p><p>${b[3]}</p>`); }
  if (el.dataset.panel) {
    const type = el.dataset.panel;
    if (type === "join") simpleForm("network request", "You never stopped belonging.", "Preview a Crestfield alumni interest request. No account or verified alumni membership is created.");
    else if (type === "mentor") simpleForm("mentorship interest", "Be someone’s next perspective.", "Share your proposed area of mentorship. This is a local interest preview, not a match or commitment.");
    else if (panels[type]) show(...panels[type]);
  }
  if (el.closest("header nav")) { $("header nav").classList.remove("open"); $("#menu").setAttribute("aria-expanded", "false"); }
});
$("#menu").onclick = () => { const opened = $("header nav").classList.toggle("open"); $("#menu").setAttribute("aria-expanded", String(opened)); $("#menu").setAttribute("aria-label", opened ? "Close menu" : "Open menu"); };
$("#signup-form").onsubmit = (e) => { e.preventDefault(); $("#signup-status").textContent = "Interest previewed locally. No account was created and no email was sent."; $("#email").value = ""; };
renderDirectory();
