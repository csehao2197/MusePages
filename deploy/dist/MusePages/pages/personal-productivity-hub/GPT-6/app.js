import { STATUSES, clone, money, seed, progress, billStatus, invoiceStatus, setUnit, logStudy, saveJournal, payBill, prepareNext, receive, setTask, addAssignment, parseMoney, command, dayOffset } from "./assets/engine.js";
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const labels = { PENDING: "Pending", IN_PROGRESS: "In progress", DONE: "Done" };
const titles = { overview: "Make space for what matters", learning: "Keep your curiosity going", finances: "A clearer money picture", projects: "Good things take shape", calendar: "Give your day a little shape" };
const today = new Date().toISOString().slice(0, 10);
let data = seed(today), activePath = "react", view = "overview", financeTab = "bills", agendaDay = today, pendingConfirm, receiptId = null, undo = null, commandApplied = false, toastTimeout;
const drafts = new Map(), timer = { path: "react", elapsed: 0, started: 0, running: false };
const examples = [
  "log 2 minutes for React foundations and set React foundations unit 2 to 100% and pay Internet",
  "receive 125.25 for Website refresh and mark Wireframe review done",
  "set Visual storytelling unit 2 to 75%",
];
const formatDate = (date, options = { month: "short", day: "numeric" }) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(new Date(`${date}T00:00:00Z`));
const studySeconds = () => data.study.filter((entry) => entry.date === today).reduce((sum, entry) => sum + entry.seconds, 0);
const elapsed = () => Math.min(86400000, timer.elapsed + (timer.running ? Math.max(0, performance.now() - timer.started) : 0));
function toast(message) { $("toast").textContent = message; $("toast").classList.add("show"); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $("toast").classList.remove("show"), 4200); }
function mutate(action, message) {
  try { const next = clone(data); action(next); data = next; undo = null; render(); if (message) toast(message); return true; }
  catch (error) { toast(error.message); return false; }
}
function confirm(title, copy, action, label = "Confirm") {
  pendingConfirm = action; $("confirm-title").textContent = title; $("confirm-copy").textContent = copy; $("confirm-go").textContent = label; $("confirm-dialog").showModal();
}
function statusOptions(current) { return STATUSES.map((status) => `<option value="${status}" ${status === current ? "selected" : ""}>${labels[status]}</option>`).join(""); }
function journalFor(id) { return data.journals.find((entry) => entry.path === id && entry.date === today)?.text || ""; }
function renderPaths() {
  $("path-tabs").innerHTML = data.paths.map((path, index) => `<button role="tab" class="path-tab" id="path-${path.id}" data-path="${path.id}" aria-selected="${path.id === activePath}" aria-controls="path-detail" tabindex="${path.id === activePath ? 0 : -1}"><span class="${path.color}">${icon(["code-2", "palette", "feather"][index])}</span><small>${path.category}</small><strong>${esc(path.name)}</strong><div class="mini-progress"><i style="width:${progress(path)}%"></i></div><em>${Math.round(progress(path))}% complete</em></button>`).join("");
  const path = data.paths.find((item) => item.id === activePath);
  const tasks = data.tasks.filter((item) => item.path === activePath);
  const text = drafts.has(activePath) ? drafts.get(activePath) : journalFor(activePath);
  const seconds = data.study.filter((entry) => entry.path === activePath).reduce((sum, entry) => sum + entry.seconds, 0);
  $("path-detail").setAttribute("aria-labelledby", `path-${activePath}`);
  $("path-detail").innerHTML = `<div class="learning-card"><div class="learning-card-header"><div><strong>${esc(path.name)}</strong><small>${path.units.length} units · ${(seconds / 60).toFixed(1)} min logged in samples + session</small></div><div class="path-percent" aria-label="${progress(path).toFixed(2)} percent complete">${Math.round(progress(path))}<span>%</span></div></div><div class="unit-list">${path.units.map((unit, index) => `<div class="unit-row"><span class="unit-number">${unit.progress === 100 ? icon("check") : String(index + 1).padStart(2, "0")}</span><label for="unit-${index}">${esc(unit.name)}<span>UNIT ${index + 1}${unit.progress === 100 ? " · COMPLETE" : ""}</span></label><input id="unit-${index}" data-unit="${index}" aria-label="${esc(unit.name)} progress percent" type="number" min="0" max="100" step="1" value="${unit.progress}"><small>%</small></div>`).join("")}</div><div class="subheading"><h3>Your next small steps</h3><button class="text-button" id="add-assignment">Add assignment${icon("plus")}</button></div><div class="assignment-list">${tasks.map((task) => `<div class="assignment-row"><div><strong>${esc(task.name)}</strong><small>Due ${formatDate(task.due)}${task.due < today && task.status !== "DONE" ? " · OVERDUE" : ""}</small></div><select class="status-select ${task.status === "DONE" ? "done" : ""}" data-assignment="${task.id}" aria-label="${esc(task.name)} status">${statusOptions(task.status)}</select></div>`).join("") || '<p class="fine-print">No assignments yet. Start with one small step.</p>'}</div><label class="journal-label" for="journal-text">${icon("notebook-pen")}A thought worth keeping</label><textarea class="journal-text" id="journal-text" maxlength="1200" placeholder="What clicked today? What are you still wondering?">${esc(text)}</textarea><div class="journal-bottom"><small id="journal-hint">${drafts.has(activePath) && text !== journalFor(activePath) ? "Unsaved draft in this tab" : "One reflection per path, per UTC day"} · #idea #breakthrough</small><button class="text-button" id="save-journal">Save reflection${icon("arrow-right")}</button></div><div class="journal-tags">${[...new Set(journalFor(activePath).match(/#[a-z0-9_-]+/gi) || [])].map((tag) => `<span>${esc(tag)}</span>`).join("")}</div></div>`;
}
function renderFinances() {
  $("checking-balance").textContent = money(data.balance); $("savings-balance").textContent = money(data.savings);
  $("bill-count").textContent = data.bills.filter((bill) => !bill.paid).length;
  document.querySelectorAll("[data-finance]").forEach((button) => { const selected = button.dataset.finance === financeTab; button.setAttribute("aria-selected", selected); button.tabIndex = selected ? 0 : -1; });
  $("finance-content").setAttribute("aria-labelledby", `tab-${financeTab}`);
  if (financeTab === "bills") {
    $("finance-content").innerHTML = [...data.bills].sort((a, b) => Number(a.paid) - Number(b.paid) || a.due.localeCompare(b.due)).map((bill) => {
      const status = billStatus(bill, today), nextExists = data.bills.some((item) => item.series === bill.series && item.due > bill.due);
      return `<div class="finance-row" data-bill="${bill.id}"><span class="finance-icon">${icon(bill.frequency === "once" ? "graduation-cap" : bill.series === "internet" ? "wifi" : "pen-tool")}</span><div><strong>${esc(bill.name)}</strong><small>${formatDate(bill.due)} · ${bill.frequency === "once" ? "One-time" : bill.frequency === "monthly" ? "Monthly" : "Weekly"}</small></div><div class="finance-amount"><strong>${money(bill.cents)}</strong><span class="finance-status ${status.toLowerCase()}">${status}</span></div>${bill.paid ? bill.frequency !== "once" ? `<button class="light-button" data-next-bill="${bill.id}" ${nextExists ? "disabled" : ""}>${nextExists ? "Next ready" : "Prepare next"}</button>` : '<span class="fine-print">Recorded</span>' : `<button class="light-button" data-pay="${bill.id}">Record paid</button>`}</div>`;
    }).join("");
  } else {
    $("finance-content").innerHTML = data.invoices.map((invoice) => `<div class="finance-row" data-invoice="${invoice.id}"><span class="finance-icon mint">${icon("arrow-down-left")}</span><div><strong>${esc(invoice.name)}</strong><small>${esc(invoice.client)} · ${money(invoice.paid)} of ${money(invoice.cents)} received</small></div><div class="finance-amount"><strong>${money(invoice.cents - invoice.paid)}</strong><span class="finance-status ${invoiceStatus(invoice).toLowerCase()}">${invoiceStatus(invoice)}</span></div><button class="light-button" data-receive="${invoice.id}" ${invoice.paid === invoice.cents ? "disabled" : ""}>${invoice.paid === invoice.cents ? "Settled" : "Record receipt"}</button></div>`).join("");
  }
}
function renderAgenda() {
  $("agenda-date").textContent = formatDate(agendaDay, { weekday: "short", month: "short", day: "numeric" });
  const items = data.tasks.filter((task) => task.due === agendaDay).map((task) => ({ type: "task", name: task.name, note: `${labels[task.status]} · ${data.paths.find((path) => path.id === task.path).name}` }));
  items.push(...data.bills.filter((bill) => !bill.paid && bill.due === agendaDay).map((bill) => ({ type: "money", name: bill.name, note: `${money(bill.cents)} sample obligation · ${billStatus(bill, today)}` })));
  if (agendaDay === today) items.unshift({ type: "time", name: "A quiet learning block", note: "09:30–10:15 UTC · Sample time block" }, { type: "time", name: "A little breathing room", note: "16:00–16:30 UTC · Sample time block" });
  $("agenda-list").innerHTML = items.map((item) => `<div class="agenda-item ${item.type}"><i></i><div><strong>${esc(item.name)}</strong><small>${esc(item.note)}</small></div></div>`).join("") || '<div class="agenda-empty">A little open space.<br>No items for this day.</div>';
  $("day-today").disabled = agendaDay === today;
}
function renderProjects() {
  $("project-board").innerHTML = STATUSES.map((status) => `<div class="kanban-column" data-column="${status}"><h3><i></i>${labels[status]}<span>${data.projects.filter((task) => task.status === status).length}</span></h3>${data.projects.filter((task) => task.status === status).map((task) => `<article class="project-card"><strong>${esc(task.name)}</strong><p>${esc(task.note)}</p><select class="status-select ${status === "DONE" ? "done" : ""}" data-project="${task.id}" aria-label="${esc(task.name)} project status">${statusOptions(status)}</select></article>`).join("") || '<p class="kanban-empty">A little space for what’s next.</p>'}</div>`).join("");
}
function renderView() {
  $("main").className = view === "overview" ? "" : `solo ${view}`;
  $("crumb-view").textContent = view[0].toUpperCase() + view.slice(1);
  $("page-title").innerHTML = `${titles[view]}<span>.</span>`;
  $("page-subtitle").textContent = { overview: "A clear head. A few good intentions. Let’s begin.", learning: "Small steps, real curiosity. Your progress lives in this session.", finances: "Fictional balances. A clear local record. No real money moves.", projects: "A small kanban for the things you’re making.", calendar: "A daily UTC view of learning, bills and two sample time blocks." }[view];
  document.querySelectorAll(".overview-only").forEach((section) => { section.hidden = view !== "overview"; });
  const sections = { learning: "learning-section", focus: "focus-section", finances: "finances-section", calendar: "agenda-section", projects: "projects-section" };
  for (const [module, id] of Object.entries(sections)) $(id).hidden = view !== "overview" && !(view === "learning" && module === "focus") && view !== module;
  document.querySelectorAll("[data-view]").forEach((button) => { const active = button.dataset.view === view; button.classList.toggle("active", active); if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current"); });
}
function renderLedger() {
  $("ledger-entries").innerHTML = [...data.ledger].reverse().map((entry) => `<div class="ledger-entry"><div><strong>${esc(entry.memo)}</strong><small>${formatDate(entry.date)} · ${entry.kind === "bill" ? "Bill payment" : "Receipt"} · ${esc(entry.id)}</small></div><span class="${entry.cents > 0 ? "positive" : ""}">${entry.cents > 0 ? "+" : "−"}${money(Math.abs(entry.cents))}</span></div>`).join("") || '<p class="agenda-empty">Your session ledger is clear.</p>';
}
function render() {
  $("stat-study").innerHTML = `${Math.floor(studySeconds() / 60)} <span>/ 120 min</span>`;
  $("stat-tasks").innerHTML = `${data.tasks.filter((task) => task.status === "DONE").length} <span>/ ${data.tasks.length} this session</span>`;
  $("stat-income").textContent = money(data.invoices.reduce((sum, invoice) => sum + invoice.cents - invoice.paid, 0));
  renderView(); renderPaths(); renderFinances(); renderAgenda(); renderProjects(); renderLedger();
  $("undo-command").disabled = !undo; updateTimer();
}
function updateTimer() {
  const value = elapsed();
  if (timer.running && value >= 86400000) { timer.elapsed = value; timer.running = false; }
  const seconds = Math.floor(value / 1000), minutes = Math.floor(seconds / 60);
  $("timer-value").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  $("timer-state").textContent = timer.running ? "One thing at a time." : value ? "Paused. Your time is here." : "Make a little room.";
  if (!timer.running && !timer.elapsed) timer.path = activePath;
  $("timer-path").textContent = data.paths.find((path) => path.id === timer.path).name;
  $("timer-toggle").querySelector("span").textContent = timer.running ? "Pause focus" : value ? "Resume focus" : "Start focus";
  const timerIcon = $("timer-toggle").querySelector("use"), timerHref = `assets/icons.svg#${timer.running ? "pause" : "play"}`;
  if (timerIcon.getAttribute("href") !== timerHref) timerIcon.setAttribute("href", timerHref);
  $("timer-save").disabled = timer.running || seconds < 1;
  $("timer-reset").disabled = !value && !timer.running;
  $("timer-progress").style.strokeDashoffset = String(502.655 * (1 - Math.min(1, value / 1500000)));
}
function openCommand() { if (document.querySelector("dialog[open]")) return; $("command-dialog").showModal(); $("command-input").focus(); }
function openAssignment() {
  $("assignment-form").reset(); $("assignment-error").textContent = "";
  $("assignment-path").innerHTML = data.paths.map((path) => `<option value="${path.id}">${esc(path.name)}</option>`).join("");
  $("assignment-path").value = activePath; $("assignment-form").elements.due.value = today;
  $("assignment-dialog").showModal(); $("assignment-form").elements.name.focus();
}
function changePath(id, focus = false) { activePath = id; renderPaths(); updateTimer(); if (focus) $(`path-${id}`).focus(); }
$("today-label").textContent = formatDate(today, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
$("command-examples").innerHTML = examples.map((text, index) => `<button data-example="${index}">${esc(text)}${icon("arrow-up-right")}</button>`).join("");
document.addEventListener("click", (event) => {
  const button = event.target.closest("button"); if (!button || button.disabled) return;
  if (button.dataset.close) $(button.dataset.close).close();
  if (button.dataset.view) { view = button.dataset.view; history.pushState(null, "", view === "overview" ? location.pathname + location.search : `#${view}`); renderView(); }
  if (button.dataset.path) changePath(button.dataset.path);
  if (button.dataset.finance) { financeTab = button.dataset.finance; renderFinances(); }
  if (button.dataset.example !== undefined) { $("command-input").value = examples[Number(button.dataset.example)]; commandApplied = false; $("command-apply").disabled = false; $("command-error").textContent = ""; $("command-input").focus(); }
  if (button.dataset.pay) {
    const bill = data.bills.find((item) => item.id === button.dataset.pay);
    confirm("Record a demo payment?", `${money(bill.cents)} for ${bill.name} will be subtracted from demo checking and linked to one ledger entry. No money moves.`, () => mutate((state) => payBill(state, bill.id), "Sample bill recorded. One ledger entry added."), "Record paid");
  }
  if (button.dataset.nextBill) {
    const bill = data.bills.find((item) => item.id === button.dataset.nextBill);
    confirm("Prepare the next occurrence?", `Create one future ${bill.name} obligation. It stays unpaid; there is no automatic charge or background schedule.`, () => mutate((state) => prepareNext(state, bill.id), "Next sample obligation prepared."), "Prepare next");
  }
  if (button.dataset.receive) {
    receiptId = button.dataset.receive; const invoice = data.invoices.find((item) => item.id === receiptId);
    $("receipt-context").textContent = `${invoice.name} · ${money(invoice.cents - invoice.paid)} still outstanding.`;
    $("receipt-amount").value = ((invoice.cents - invoice.paid) / 100).toFixed(2); $("receipt-error").textContent = ""; $("receipt-dialog").showModal();
  }
  if (button.id === "add-assignment") openAssignment();
  if (["command-side", "command-hero"].includes(button.id)) openCommand();
  if (["scope-side", "scope-top", "scope-footer"].includes(button.id)) $("scope-dialog").showModal();
  if (button.id === "open-ledger") { renderLedger(); $("ledger-dialog").showModal(); }
  if (button.id === "day-previous" || button.id === "day-next") { agendaDay = dayOffset(agendaDay, button.id === "day-next" ? 1 : -1); renderAgenda(); }
  if (button.id === "day-today") { agendaDay = today; renderAgenda(); }
  if (button.id === "confirm-cancel") { pendingConfirm = null; $("confirm-dialog").close(); }
  if (button.id === "confirm-go") { const action = pendingConfirm; pendingConfirm = null; $("confirm-dialog").close(); action?.(); }
  if (button.id === "timer-toggle") {
    if (timer.running) { timer.elapsed = elapsed(); timer.running = false; }
    else { if (!timer.elapsed) timer.path = activePath; timer.started = performance.now(); timer.running = true; }
    updateTimer();
  }
  if (button.id === "timer-reset") confirm("Reset this unsaved time?", "The current stopwatch time will be cleared. Saved study entries stay untouched.", () => { timer.elapsed = 0; timer.running = false; updateTimer(); toast("Unsaved stopwatch reset."); }, "Reset timer");
  if (button.id === "timer-save") {
    const seconds = Math.floor(elapsed() / 1000), id = timer.path;
    if (mutate((state) => logStudy(state, id, seconds, "timer"), `${seconds} elapsed seconds saved to ${data.paths.find((path) => path.id === id).name}.`)) { timer.elapsed = 0; timer.running = false; updateTimer(); }
  }
  if (button.id === "save-journal") {
    const text = $("journal-text").value, path = activePath;
    if (mutate((state) => saveJournal(state, path, text))) { drafts.delete(path); renderPaths(); toast("Reflection saved in this tab."); }
  }
  if (button.id === "undo-command" && undo) { data = undo; undo = null; $("command-result").textContent = "Last command undone. Other data edits disable undo."; $("undo-command").disabled = true; render(); toast("Last command undone."); }
});
document.addEventListener("change", (event) => {
  const element = event.target;
  if (element.dataset.unit !== undefined) {
    const value = element.value.trim() ? Number(element.value) : NaN;
    if (!mutate((state) => setUnit(state, activePath, Number(element.dataset.unit), value), "Unit progress updated.")) renderPaths();
  }
  if (element.dataset.assignment) mutate((state) => setTask(state, element.dataset.assignment, element.value), "Assignment status updated.");
  if (element.dataset.project) mutate((state) => setTask(state, element.dataset.project, element.value, true), "Project task moved.");
});
document.addEventListener("input", (event) => {
  if (event.target.id === "journal-text") { drafts.set(activePath, event.target.value); $("journal-hint").textContent = event.target.value === journalFor(activePath) ? "Matches saved reflection" : "Unsaved draft in this tab"; }
  if (event.target.id === "command-input") { commandApplied = false; $("command-apply").disabled = false; $("command-error").textContent = ""; }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openCommand(); return; }
  const tab = event.target.closest('[role="tab"]');
  if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...tab.parentElement.querySelectorAll('[role="tab"]')], index = tabs.indexOf(tab);
  const next = tabs[event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
  if (next.dataset.path) changePath(next.dataset.path, true);
  else { financeTab = next.dataset.finance; renderFinances(); $(`tab-${financeTab}`).focus(); }
});
$("command-form").addEventListener("submit", (event) => {
  event.preventDefault(); if (!$("command-dialog").open || commandApplied) return;
  try {
    const result = command(data, $("command-input").value);
    undo = clone(data); data = result.state; commandApplied = true; $("command-apply").disabled = true;
    $("command-error").textContent = ""; $("command-result").innerHTML = `<strong>Applied to this local demo</strong>${result.summary.map((text) => `<p>${esc(text)}</p>`).join("")}`; render();
  } catch (error) { $("command-error").textContent = error.message; }
});
$("assignment-form").addEventListener("submit", (event) => {
  event.preventDefault(); if (!$("assignment-dialog").open) return;
  try {
    const form = Object.fromEntries(new FormData(event.currentTarget)), next = clone(data);
    addAssignment(next, form); data = next; undo = null; $("assignment-dialog").close(); activePath = form.path; render(); toast("Assignment added to your local path and agenda.");
  } catch (error) { $("assignment-error").textContent = error.message; }
});
$("receipt-form").addEventListener("submit", (event) => {
  event.preventDefault(); if (!$("receipt-dialog").open) return;
  try {
    const cents = parseMoney($("receipt-amount").value), next = clone(data);
    receive(next, receiptId, cents); data = next; undo = null; $("receipt-dialog").close(); receiptId = null; render(); toast("Sample receipt recorded. One ledger entry added.");
  } catch (error) { $("receipt-error").textContent = error.message; }
});
function route() { const selected = location.hash.slice(1); view = Object.hasOwn(titles, selected) ? selected : "overview"; renderView(); }
window.addEventListener("hashchange", route);
window.addEventListener("popstate", route);
window.addEventListener("beforeunload", (event) => {
  if (elapsed() > 0 || [...drafts].some(([id, text]) => text !== journalFor(id))) { event.preventDefault(); event.returnValue = ""; }
});
render(); route(); setInterval(updateTimer, 500);
