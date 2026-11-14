const $ = (s) => document.querySelector(s);
const paths = {
  "graduation-cap": '<path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5M22 10v6"/>',
  search: '<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  "message-circle": '<path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l2-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  house: '<path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3Z"/>',
  "book-open": '<path d="M12 5c-3-3-8-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-2-1-7-2-10 1v15"/>',
  "clipboard-list": '<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 16h6"/>',
  "chart-no-axes-column": '<path d="M5 20v-6M12 20V4M19 20V9"/>',
  "calendar-days": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18M8 15h1M15 15h1M8 18h1"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-4"/><circle cx="9" cy="7" r="4"/><path d="M16 3a4 4 0 0 1 0 8"/>',
  folder: '<path d="M3 20h18V6H11L9 3H3Z"/>',
  "circle-help": '<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 1 1 4 3c-1 0-1 1-1 2M12 17h.01"/>',
  video: '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m16 10 6-4v12l-6-4"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M3 16v5h18v-5"/>',
  "trending-up": '<path d="m3 17 6-6 4 4 8-10M15 5h6v6"/>',
  flame: '<path d="M12 3c2 6 6 6 6 12a6 6 0 0 1-12 0c0-3 2-6 3-7 0 4 2 4 2 4s2-4 1-9Z"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M3 17v4h18v-4"/>',
  sparkles: '<path d="m12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3Z"/>',
  "pen-line": '<path d="m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4M12 22h10"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V3h8v4M2 12c6 4 14 4 20 0M12 12v5"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
  ellipsis: '<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>',
  x: '<path d="m6 6 12 12M6 18 18 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths["book-open"]}</svg>`; }
function icons() { document.querySelectorAll("[data-icon]").forEach((el) => { el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon)); el.removeAttribute("data-icon"); }); }
const courses = [
  { title: "Data Structures & Algorithms", instructor: "Prof. Sarah Chen", progress: 68, time: "Wed, 10:00 AM", next: "Lecture: Binary Trees", grade: "A−", score: 92, type: "code", label: "COMPUTER SCIENCE", lesson: "A binary tree gives every node at most two children. In-order traversal visits the left subtree, current node, then right subtree.", task: "What is the in-order traversal of a tree with root 4, left child 2 and right child 7?", answer: "2, 4, 7" },
  { title: "Introduction to Machine Learning", instructor: "Dr. James Park", progress: 45, time: "Thu, 2:00 PM", next: "Lab: Neural Networks", grade: "B+", score: 87, type: "machine", label: "ARTIFICIAL INTELLIGENCE", lesson: "A neuron combines weighted inputs and a bias before applying an activation function. Training adjusts weights to reduce prediction error.", task: "For inputs 2 and 3, weights 1 and 2, and bias 0, what is the weighted sum?", answer: "8" },
  { title: "Technical Writing", instructor: "Prof. Maria Garcia", progress: 72, time: "Fri, 11:00 AM", next: "Workshop: Peer Review", grade: "A", score: 95, type: "writing", label: "COMMUNICATION", lesson: "Clear technical writing puts the reader's goal first. Use a specific subject, an active verb and only the detail needed for the task.", task: "Which is clearer? A: A configuration of the system was performed. B: We configured the system.", answer: "B" },
  { title: "Database Systems", instructor: "Dr. Olivia Brooks", progress: 36, time: "Mon, 1:00 PM", next: "Entity Relationships", grade: "B+", score: 89, type: "database", label: "COMPUTER SCIENCE", lesson: "A primary key uniquely identifies each row. A foreign key links a row to a key in another table.", task: "Which key uniquely identifies each row?", answer: "primary key" },
  { title: "Discrete Mathematics", instructor: "Prof. Daniel Wilson", progress: 51, time: "Tue, 9:00 AM", next: "Sets & Logic", grade: "A−", score: 91, type: "math", label: "MATHEMATICS", lesson: "The union of two sets contains every distinct element from either set.", task: "How many elements are in the union of {1,2} and {2,3}?", answer: "3" }
];
const assignments = [
  { name: "ML Problem Set 4", course: "Machine Learning", due: "Tomorrow, 11:59 PM", urgency: "", action: "Submit" },
  { name: "Binary Tree Implementation", course: "Data Structures", due: "In 3 days", urgency: "amber", action: "Start" },
  { name: "Essay Draft: Technical Ethics", course: "Technical Writing", due: "In 6 days", urgency: "green", action: "Continue" },
  { name: "Database ER Diagram", course: "Database Systems", due: "In 8 days", urgency: "green", action: "Not started" }
];
function artwork(type) {
  const content = type === "code" ? '<g stroke="currentColor" stroke-width="2" fill="none"><path d="M100 29v23M100 52H57v20M100 52h43v20M57 81H32v19M57 81h25v19M143 81h-20v19M143 81h25v19"/><g fill="#eae8ff"><circle cx="100" cy="26" r="10"/><circle cx="57" cy="72" r="9"/><circle cx="143" cy="72" r="9"/><circle cx="32" cy="106" r="6"/><circle cx="82" cy="106" r="6"/><circle cx="123" cy="106" r="6"/><circle cx="168" cy="106" r="6"/></g></g>' : type === "machine" ? '<g stroke="currentColor" stroke-width="1" opacity=".7"><path d="M44 30 100 18 155 32 100 62 44 30 100 106 155 82 100 62 44 82 100 18 155 82M44 82 155 32M44 30 155 82M100 18v88"/></g><g fill="#e2f2ef" stroke="currentColor" stroke-width="2"><circle cx="44" cy="30" r="7"/><circle cx="44" cy="82" r="7"/><circle cx="100" cy="18" r="7"/><circle cx="100" cy="62" r="8"/><circle cx="100" cy="106" r="7"/><circle cx="155" cy="32" r="7"/><circle cx="155" cy="82" r="7"/></g>' : '<g transform="rotate(-9 100 65)"><rect x="62" y="18" width="78" height="100" rx="5" fill="#ffffff85" stroke="currentColor"/><path d="M78 40h45M78 52h45M78 64h45M78 76h28M78 97h34" fill="none" stroke="currentColor" stroke-width="3"/><path d="m128 106 24-37 7 6-25 37-8 3Z" fill="#e2b875" stroke="currentColor"/></g>';
  return `<svg viewBox="0 0 200 130" aria-hidden="true"><circle cx="100" cy="65" r="70" fill="white" opacity=".18"/><circle cx="100" cy="65" r="48" fill="none" stroke="currentColor" opacity=".07"/>${content}</svg>`;
}
let expanded = false;
let query = "";
function renderCourses() {
  const visible = courses.map((c, i) => ({ ...c, i })).filter((c) => (expanded || query || c.i < 3) && `${c.title} ${c.instructor}`.toLowerCase().includes(query));
  $("#course-grid").innerHTML = visible.map((c) => `<article class="course-card"><div class="course-art ${c.type}"><span class="course-chip">${c.label}</span>${artwork(c.type)}</div><div class="course-body"><h3>${c.title}</h3><p class="instructor">${c.instructor}</p><div class="progress-heading"><span>Course progress</span><b>${c.progress}%</b></div><div class="progress-track" role="progressbar" aria-label="${c.title} progress" aria-valuenow="${c.progress}" aria-valuemin="0" aria-valuemax="100"><span style="width:${c.progress}%"></span></div><p class="next-class">${icon("clock")}<span>${c.time}<br>${c.next}</span></p><div class="course-bottom"><small>YOUR GRADE SO FAR</small><strong>${c.grade} <small>(${c.score}%)</small></strong></div><button class="continue" data-course="${c.i}">Continue learning <span>→</span></button></div></article>`).join("");
  $("#no-results").hidden = visible.length > 0;
  $("#view-courses").textContent = expanded ? "Show fewer courses ↑" : "View all courses →";
}
function renderAssignments() {
  $("#assignment-list").innerHTML = assignments.map((a, i) => `<article class="assignment"><span class="urgency ${a.urgency}"></span><div class="assignment-content"><strong>${a.name}</strong><p>${a.course}</p><div class="assignment-bottom"><small>${a.submitted ? "Submitted locally" : a.due}</small><button data-assignment="${i}">${a.submitted ? "View receipt" : a.action}</button></div></div></article>`).join("");
}
const dialog = $("#dialog");
function show(title, content) { $("#dialog-title").textContent = title; $("#dialog-content").innerHTML = content; if (!dialog.open) dialog.showModal(); icons(); }
function toast(text) { $("#toast").textContent = text; $("#toast").hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => $("#toast").hidden = true, 4500); }
function submission(index = 0) {
  if (assignments[index].submitted) {
    show("Your local submission", `<p><strong>${assignments[index].name}</strong></p><p id="receipt"></p><p>Saved in memory for this demo only. No file was uploaded or delivered to an instructor.</p>`);
    $("#receipt").textContent = assignments[index].receipt;
    return;
  }
  show("A little closer to done.", `<p>Choose your assignment and attach your work. This is a local preview, not a real submission.</p><form id="submit-form"><label for="assignment-choice">Assignment</label><select id="assignment-choice">${assignments.map((a, i) => `<option value="${i}" ${i === index ? "selected" : ""}>${a.name}</option>`).join("")}</select><label for="work">Your work (PDF, ZIP, text or document · max 10 MB)</label><input id="work" type="file" accept=".pdf,.zip,.txt,.doc,.docx,.md" required><label for="submission-note">Note to instructor (optional)</label><textarea id="submission-note" rows="3" maxlength="1000"></textarea><p id="submit-error" role="alert"></p><button class="primary" type="submit">Preview submission</button></form>`);
  $("#submit-form").onsubmit = (e) => {
    e.preventDefault();
    const file = $("#work").files[0];
    if (file.size > 10 * 1024 * 1024) { $("#submit-error").textContent = "Choose a file smaller than 10 MB."; return; }
    if (!/\.(pdf|zip|txt|docx?|md)$/i.test(file.name)) { $("#submit-error").textContent = "Choose a supported file type."; return; }
    const a = assignments[Number($("#assignment-choice").value)];
    a.submitted = true; a.receipt = `${file.name} · ${(file.size / 1024).toFixed(1)} KB · ${new Date().toLocaleTimeString()}`;
    renderAssignments();
    show("Nice work, Alex.", '<p id="submission-result"></p><p>This is a demo receipt. Your file stayed on this device and will not persist after reload.</p>');
    $("#submission-result").textContent = `${a.name}: ${a.receipt}`;
  };
}
function courseDetail(index) {
  const c = courses[index];
  show(c.title, `<p>${c.instructor} · ${c.progress}% complete</p><h3>${c.next}</h3><p>${c.lesson}</p><form id="lesson-form"><label for="lesson-answer">${c.task}</label><input id="lesson-answer" required autocomplete="off"><button class="primary">Check answer</button><p id="lesson-feedback" role="status"></p></form><p class="fineprint">One original practice question, not a full recorded course. Progress is illustrative.</p>`);
  $("#lesson-form").onsubmit = (e) => { e.preventDefault(); const answer = $("#lesson-answer").value.trim().toLowerCase().replace(/\s/g, ""); $("#lesson-feedback").textContent = answer === c.answer.toLowerCase().replace(/\s/g, "") ? "That’s right. One step forward!" : `Not quite. Try again, or compare with: ${c.answer}.`; };
}
const schedule = [
  [["10:00 AM", "Data Structures", "10:00–11:30 AM · Room 204 / local Zoom preview"], ["5:00 PM", "Study Group", "5:00–6:00 PM · Library"]],
  [["9:00 AM", "Discrete Mathematics", "9:00–10:30 AM · Room 108"]],
  [["10:00 AM", "Data Structures", "10:00–11:30 AM · Room 204 / local Zoom preview"], ["5:00 PM", "Study Group", "5:00–6:00 PM · Library"]],
  [["2:00 PM", "ML Lab", "2:00–4:00 PM · CS Lab 3"]],
  [["11:00 AM", "Technical Writing", "11:00 AM–12:30 PM · Writing Center"]],
  [], []
];
let selectedDay = 2;
function renderWeek() {
  $(".week").innerHTML = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => `<button aria-pressed="${i === selectedDay}" data-day="${i}">${day}<strong>${i + 5}</strong></button>`).join("");
  $("#day-classes").innerHTML = schedule[selectedDay].length ? schedule[selectedDay].map((c, i) => `<div class="class-row"><span class="class-time">${c[0]}</span><div class="class-body"><strong>${c[1]}</strong><p>${c[2]}</p></div><button data-class="${i}">Details ↗</button></div>`).join("") : '<p class="fineprint">A little breathing room. No classes scheduled.</p>';
}
const panels = {
  notifications: ["You’re all caught up here.", "<ul><li>Prof. Chen: your midterm is now October 20.</li><li>Dr. Park: office hours are extended this week.</li><li>Study room booking has arrived in Resources.</li></ul><p>Sample announcements from an illustrative semester.</p>"],
  messages: ["A note from your instructor", "<p><strong>Prof. Sarah Chen · 9:20 AM</strong></p><p>Hi Alex! Your binary search implementation was thoughtfully structured. Bring your questions about tree traversal to our next class.</p><form id='message-form'><label for='reply'>Your reply</label><textarea id='reply' required rows='3' maxlength='1000'></textarea><button class='primary'>Preview reply</button></form><p>Local draft only. No message is sent.</p>"],
  profile: ["Hi, Alex Thompson.", "<p>Computer Science · Year 2<br>Spring 2026 · Student sample profile</p><p>Current GPA: 3.72 · Active courses: 5</p><p>This fictional profile is part of the demo, not a signed-in account.</p>"],
  settings: ["Make space for focus.", "<label><input id='reduce-motion' type='checkbox'> Reduce motion for this visit</label><p>This setting applies only to the current page. Your device’s reduced-motion preference is also respected.</p>"],
  help: ["We’re in your corner.", "<p>For this concept, explore courses, practice a lesson, preview an assignment submission or export the sample schedule.</p><form id='help-form'><label for='help-message'>What would you like help with?</label><textarea id='help-message' required rows='3' maxlength='1000'></textarea><button class='primary'>Preview support request</button></form><p>No real support ticket will be created.</p>"],
  signout: ["You’re in a local demo.", "<p>There is no account to sign out of. Reloading clears all local drafts, submission previews and read states.</p><button id='reset-demo'>Reset demo</button>"],
  groups: ["Better, together.", "<h3>CS Study Circle</h3><p>Wednesday · 5–6 PM · Library<br>4 sample members · Tree traversal practice</p><button id='join-group' class='primary'>Join local group preview</button><p>No membership or real study session is created.</p>"],
  class: ["Your next class", "<h3>Data Structures · Binary Trees</h3><p>Prof. Sarah Chen · Room 204 / virtual classroom</p><p>Bring your notes on recursion and a question you’d like to explore.</p><button data-course='0' class='primary'>Open practice lesson</button><p>Demo classroom. This button opens an original exercise, not a live meeting.</p>"],
  grades: ["Your semester, in perspective.", "<p>Current GPA: 3.72 (+0.08 from last semester)</p>" + courses.map((c) => `<p><strong>${c.title}</strong><br>${c.grade} · ${c.score}%</p>`).join("") + "<p>All grades are fictional and not official academic records.</p>"],
  privacy: ["Your information stays here.", "<p>This static demo has no account, analytics, backend or local storage. Assignment files are inspected locally by the browser and are never uploaded. Reloading clears your in-memory actions.</p>"],
  terms: ["A space to explore.", "<p>BrightPath is a fictional learning platform. This interactive concept does not provide enrollment, academic credit, live instruction or real submissions.</p>"],
  accessibility: ["Learning should be for everyone.", "<p>Keyboard navigation, labeled controls, visible focus, native dialogs, reduced-motion support and responsive layouts are provided. The sample activity grid has accessible descriptions for each day.</p>"],
  more: ["Your learning toolkit", "<p><button data-panel='messages'>Messages</button> <button data-panel='groups'>Study Groups</button> <button data-panel='profile'>My Profile</button> <button data-panel='settings'>Settings</button> <button data-panel='help'>Help Center</button></p><p><a class='button' href='#resources' id='mobile-resources'>Open Resources →</a></p>"]
};
document.addEventListener("click", (e) => {
  const target = e.target.closest("button,a");
  if (!target) return;
  if (target.dataset.course !== undefined) courseDetail(Number(target.dataset.course));
  if (target.dataset.assignment !== undefined) submission(Number(target.dataset.assignment));
  if (target.dataset.day !== undefined) { selectedDay = Number(target.dataset.day); renderWeek(); }
  if (target.dataset.class !== undefined) { const c = schedule[selectedDay][Number(target.dataset.class)]; show(c[1], `<p>${c[2]}</p><p>Part of the fictional October sample timetable. No meeting or room is actually booked.</p><button data-panel="class" class="primary">Open classroom preview</button>`); }
  if (target.dataset.feedback !== undefined) { const feedback = ["Good work on backpropagation. For next time, write each intermediate gradient explicitly so your reasoning is easier to follow.", "Excellent binary search implementation. Your boundary cases are clear and your iterative solution uses constant extra space.", "Strong thesis. Tighten your conclusion by connecting the final recommendation directly to your supporting evidence."]; show(["ML Quiz 3 · 88/100 · B+", "Data Structures HW 6 · 95/100 · A", "Writing Assignment 3 · 92/100 · A−"][Number(target.dataset.feedback)], `<p>${feedback[Number(target.dataset.feedback)]}</p><p>Fictional instructor feedback.</p>`); }
  if (target.dataset.resource) { const name = target.dataset.resource; const descriptions = { Library: "Search the catalog in your institution’s real library portal. This sample offers a short reading list: Introduction to Algorithms; The Elements of Style; Mathematics for Machine Learning.", "Writing Center": "Preview a peer review appointment: Friday, 11 AM. Bring your thesis statement and one paragraph for discussion.", "Career Services": "Resume checklist: lead with measurable work, show your projects, tailor skills to the role, and keep links readable.", "IT Help Desk": "Quick checks: reload your browser, verify connectivity, then write down the error and when it happened." }; show(name, `<p>${descriptions[name]}</p><p>Resource preview only; no external institutional service or appointment booking.</p>`); }
  if (target.dataset.panel) {
    const panel = target.dataset.panel;
    $("#profile-menu").hidden = true; $("#profile").setAttribute("aria-expanded", "false");
    if (panel === "submit") submission(); else if (panels[panel]) show(...panels[panel]);
    if (panel === "messages") $("#message-form").onsubmit = (event) => { event.preventDefault(); show("Your local reply preview", '<p id="reply-preview"></p><p>Draft only. No message was sent; reload clears this preview.</p>'); $("#reply-preview").textContent = event.target.querySelector("textarea").value; };
    if (panel === "help") $("#help-form").onsubmit = (event) => { event.preventDefault(); const value = $("#help-message").value; show("Support request preview", '<p id="support-preview"></p><p>Your note has not been submitted to a support team.</p>'); $("#support-preview").textContent = value; };
  }
  if (target.id === "join-group") { target.textContent = "Joined preview ✓"; target.disabled = true; }
  if (target.id === "reset-demo") location.reload();
  if (target.id === "mobile-resources") dialog.close();
});
$("#close-dialog").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
$("#profile").onclick = () => { const opened = $("#profile-menu").hidden; $("#profile-menu").hidden = !opened; $("#profile").setAttribute("aria-expanded", String(opened)); };
document.addEventListener("click", (e) => { if (!e.target.closest(".top-actions")) { $("#profile-menu").hidden = true; $("#profile").setAttribute("aria-expanded", "false"); } });
$("#search").oninput = (e) => { query = e.target.value.trim().toLowerCase(); renderCourses(); document.querySelectorAll(".assignment").forEach((el, i) => { el.hidden = !!query && !`${assignments[i].name} ${assignments[i].course}`.toLowerCase().includes(query); }); };
document.addEventListener("keydown", (e) => { if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !dialog.open) { e.preventDefault(); $("#search").focus(); } });
$("#view-courses").onclick = () => { expanded = !expanded; renderCourses(); };
$("#mark-read").onclick = () => { $("#mark-read").textContent = "All caught up ✓"; $("#unread-dot").hidden = true; $("#notification-count").hidden = true; $(".icon-button[data-panel='notifications']").setAttribute("aria-label", "Notifications, all read"); toast("Announcements marked as read for this visit."); };
document.addEventListener("change", (e) => { if (e.target.id === "reduce-motion") document.documentElement.style.scrollBehavior = e.target.checked ? "auto" : ""; });
$("#calendar-export").onclick = () => {
  const events = schedule.flatMap((day, i) => day.map((c, j) => { const date = `202610${String(i + 5).padStart(2, "0")}`; const hour = c[0] === "2:00 PM" ? "140000" : c[0] === "5:00 PM" ? "170000" : c[0] === "9:00 AM" ? "090000" : c[0] === "11:00 AM" ? "110000" : "100000"; const end = c[0] === "2:00 PM" ? "160000" : c[0] === "5:00 PM" ? "180000" : c[0] === "9:00 AM" ? "103000" : c[0] === "11:00 AM" ? "123000" : "113000"; return `BEGIN:VEVENT\r\nUID:brightpath-demo-${i}-${j}@example.invalid\r\nDTSTAMP:20261001T000000Z\r\nDTSTART:${date}T${hour}\r\nDTEND:${date}T${end}\r\nSUMMARY:DEMO - ${c[1]}\r\nDESCRIPTION:Fictional sample timetable. Floating local time.\r\nEND:VEVENT`; }));
  const blob = new Blob([`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//BrightPath Demo//Sample Schedule//EN\r\n${events.join("\r\n")}\r\nEND:VCALENDAR\r\n`], { type: "text/calendar" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "brightpath-sample-week.ics"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast("Sample week exported. Import the .ics file into your calendar.");
};
const heatmapStart = new Date(Date.UTC(2026, 6, 20));
$("#heatmap").innerHTML = Array.from({ length: 84 }, (_, i) => { const hours = [0, 1.2, 2.4, 3.2, 0, 1.8, 2.9][(i * 3 + Math.floor(i / 7)) % 7]; const date = new Date(heatmapStart.valueOf() + i * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }); const label = `${date}: ${hours} hours studied`; return `<button data-level="${hours === 0 ? 0 : Math.min(4, Math.ceil(hours))}" title="${label}" aria-label="${label}" data-activity="${label}"></button>`; }).join("");
document.addEventListener("click", (e) => { const cell = e.target.closest("[data-activity]"); if (cell) toast(cell.dataset.activity + " · sample record"); });
$("#greeting").textContent = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
const classTime = Date.now() + 45 * 60000;
setInterval(() => { const remaining = Math.max(0, Math.ceil((classTime - Date.now()) / 60000)); $("#countdown").textContent = remaining ? `in ${remaining} min` : "ready now"; }, 15000);
renderCourses(); renderAssignments(); renderWeek(); icons();
