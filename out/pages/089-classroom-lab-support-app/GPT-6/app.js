import { KEY, LIMIT, scenarios, report, nextStep, recordCheck, undoCheck, saveActivity, resolveCase, parseCollection, serializeCollection } from "./assets/engine.js";

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const stamp = (value) => new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
const outcomes = { safe: "No concern observed", stop: "Stopped · contact qualified staff", still: "Still not working", resolved: "Reported working" };
let records = [], selected = null, filter = "open", mode = "blocked", storageMessage = "", lastRaw = null;
let reportBaseline = "", activityBaseline = "", activityCase = null, oldScenario = "projector", confirmCallback = null, toastTimer;
const current = () => records.find((record) => record.id === selected);
const formValue = (id) => Object.fromEntries(new FormData($(id)));
const snapshot = (id) => JSON.stringify(formValue(id));
const canChange = () => mode !== "blocked";
const now = () => new Date().toISOString();
function toast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message + (mode === "memory" ? " · temporary memory only" : "");
  $("toast").hidden = false;
  toastTimer = setTimeout(() => { $("toast").hidden = true; }, 5000);
}
function ask(title, copy, actionLabel, callback) {
  if ($("confirm-dialog").open) return;
  $("confirm-title").textContent = title;
  $("confirm-copy").textContent = copy;
  $("confirm-go").textContent = actionLabel;
  confirmCallback = callback;
  $("confirm-dialog").showModal();
  $("confirm-keep").focus();
}
function storageUI() {
  const blocked = mode === "blocked";
  document.querySelectorAll("[data-report]").forEach((button) => { button.disabled = blocked || records.length >= LIMIT; });
  $("report-save-hint").textContent = mode === "memory" ? "Temporary memory only; refresh removes changes." : "Saved only in this browser.";
  $("privacy-copy").innerHTML = mode === "memory" ? "<strong>Temporary memory mode.</strong> Changes are not written to storage and disappear on refresh. Existing stored data stays untouched." : "<strong>Your classroom. Your browser.</strong> Cases stay on this device. No automatic sync or backup; clearing browser data can remove them.";
  $("storage-notice").hidden = !["blocked", "error"].includes(mode);
  if (!$("storage-notice").hidden) $("storage-notice").innerHTML = `<div class="storage-banner"><p><strong>${blocked ? "Case storage is unavailable." : "This change was not saved or applied."}</strong> ${esc(storageMessage)}</p><button type="button" id="retry-storage">Read storage again</button><button type="button" data-memory>Use temporary memory instead</button><p>Temporary mode leaves existing stored data untouched. New changes last only until refresh.</p></div>`;
}
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const loaded = parseCollection(raw);
    records = loaded;
    lastRaw = raw;
    selected = null;
    mode = "ready";
    storageMessage = "";
  } catch {
    records = [];
    selected = null;
    mode = "blocked";
    storageMessage = "Existing records could not be read or validated and have been left untouched. Try again, or explicitly continue in temporary memory.";
  }
  render();
}
function commit(next, errorId) {
  if (!canChange()) return false;
  try {
    const raw = serializeCollection(next);
    if (mode !== "memory") {
      if (localStorage.getItem(KEY) !== lastRaw) throw Error("Storage changed in another tab. Read storage again or use temporary memory before making changes.");
      localStorage.setItem(KEY, raw);
      lastRaw = raw;
      mode = "ready";
    }
    records = next;
    storageMessage = "";
    render();
    return true;
  } catch (error) {
    mode = "error";
    storageMessage = error.message.includes("another tab") ? error.message : "The browser refused the storage write. Your previous case collection and this form are unchanged. Retry, or use temporary memory.";
    storageUI();
    if (errorId) $(errorId).innerHTML = `Not saved. ${esc(storageMessage)} <button type="button" class="subtle-button" data-memory>Use temporary memory</button>`;
    else toast("Not saved. See the storage notice above.");
    return false;
  }
}
function updateRecord(next, errorId) {
  return commit(records.map((record) => record.id === next.id ? next : record), errorId);
}
function renderList() {
  const query = $("case-search").value.trim().toLowerCase();
  const visible = records.filter((record) => record.status === filter && [record.device, record.symptom, record.impact, scenarios[record.scenario].name].join(" ").toLowerCase().includes(query)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  $("nav-count").textContent = records.filter((record) => record.status === "open").length;
  for (const status of ["open", "resolved"]) {
    const count = records.filter((record) => record.status === status).length;
    $(`${status}-count`).textContent = mode === "blocked" ? "—" : count;
    $(`tab-${status}`).textContent = mode === "blocked" ? "—" : count;
  }
  document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
  if (!visible.length) {
    const blocked = mode === "blocked";
    $("case-list").innerHTML = `<div class="empty-state">${icon(blocked ? "hard-drive" : query ? "search" : filter === "resolved" ? "circle-check" : "notebook-pen")}<h3>${blocked ? "Your case history is unavailable." : query ? "No cases match that search." : filter === "resolved" ? "A little space for happy endings." : "A little breathing room."}</h3><p>${blocked ? "Existing storage has been preserved. Choose a recovery option above." : query ? "Try a device, symptom or lesson keyword." : filter === "resolved" ? "Teacher-confirmed repairs will live here." : "No open cases. When a hiccup happens, we'll take it one step at a time."}</p>${!blocked && !query && filter === "open" ? '<button type="button" class="text-button" data-report="projector">Report your first problem ' + icon("arrow-right") + "</button>" : ""}</div>`;
    return;
  }
  $("case-list").innerHTML = visible.map((record) => `<button class="case-row" type="button" data-case="${esc(record.id)}" aria-pressed="${record.id === selected}"><span class="scenario-icon ${record.scenario === "projector" ? "peach" : record.scenario === "computer" ? "sage" : "lilac"}">${icon(scenarios[record.scenario].icon)}</span><span class="case-row-main"><strong>${esc(record.device)}</strong><small>${esc(record.symptom)}</small><small>${esc(stamp(record.createdAt))}${record.activity ? " · Backup activity ready" : ""}</small></span><span class="badge ${record.status === "resolved" ? "resolved" : record.urgency.toLowerCase()}">${record.status === "resolved" ? "Resolved" : `${record.urgency} priority`}</span>${icon("arrow-up-right")}</button>`).join("");
}
function renderWorkspace() {
  const record = current(), workspace = $("workspace");
  workspace.hidden = !record;
  if (!record) { $("print-view").innerHTML = ""; return; }
  const scenario = scenarios[record.scenario], step = nextStep(record), stopped = record.checks.some((entry) => entry.outcome === "stop"), working = record.checks.some((entry) => entry.outcome === "resolved");
  const checkPanel = record.status === "resolved" ? '<div class="resolved-panel"><strong>Confirmed by you. Kept for later.</strong>This case is in resolved history. Its check record and saved activity remain available.</div>' : step ? `<div class="check-panel"><p class="check-progress">FIXED CHECK ${record.checks.length + 1} OF ${scenario.steps.length} · NOT AI-GENERATED</p><h4 id="check-heading" tabindex="-1">${esc(step.title)}</h4><p>${esc(step.text)}</p><div class="check-buttons">${step.id === "safety" ? '<button type="button" class="button primary" data-outcome="safe">No concern observed</button>' : '<button type="button" class="button primary" data-outcome="still">Still not working</button><button type="button" class="button secondary" data-outcome="resolved">Working now</button>'}<button type="button" class="button secondary" data-outcome="stop">Stop &amp; contact staff</button></div></div>` : `<div class="check-panel"><p class="check-progress">${stopped ? "SAFETY FIRST" : working ? "WORKING REPORTED" : "FIRST-LINE CHECKS COMPLETE"}</p><h4 id="check-heading" tabindex="-1">${stopped ? "Pause here. Involve qualified staff." : working ? "A promising step. Confirm the repair." : "Leave the next step to your technician."}</h4><p>${stopped ? "No more checks are offered. Follow your school's safety procedure. Continue teaching only in a space your school considers safe." : working ? "The case stays open until you have confirmed the repair with your technician or school staff." : "This limited guide ends here. Print the observations for IT and choose a device-free lesson while qualified staff handle the equipment."}</p></div>`;
  const saved = record.activity;
  workspace.innerHTML = `<div class="workspace-top"><div><p class="eyebrow">${esc(scenario.name)} · ${record.status === "resolved" ? "RESOLVED HISTORY" : "YOUR CASE WORKSPACE"}</p><h3 id="workspace-title" tabindex="-1">${esc(record.device)}</h3><div class="case-meta">Created ${esc(stamp(record.createdAt))} · Updated ${esc(stamp(record.updatedAt))}</div></div><button type="button" class="icon-button" id="close-workspace" aria-label="Close case workspace">${icon("x")}</button></div><div class="workspace-body"><div><dl class="case-facts"><dt>Symptom</dt><dd>${esc(record.symptom)}</dd><dt>Lesson impact</dt><dd>${esc(record.impact)}</dd><dt>Priority</dt><dd>${esc(record.urgency)}</dd>${record.notes ? `<dt>Context</dt><dd>${esc(record.notes)}</dd>` : ""}</dl><div class="safety-note"><strong>Observation, not a repair guide.</strong>Follow your school's policy and qualified staff. Leave equipment, wiring and internal work to them. These fixed demo checks are not a diagnosis.</div>${checkPanel}${record.checks.length ? `<ol class="check-history">${record.checks.map((entry) => `<li><strong>${esc(scenario.steps.find((item) => item.id === entry.stepId).title)}</strong> · ${esc(outcomes[entry.outcome])}<time datetime="${entry.at}">${esc(stamp(entry.at))}</time></li>`).join("")}</ol>${record.status === "open" ? '<button type="button" class="subtle-button" id="undo-check">Undo last response</button>' : ""}` : ""}${record.status === "open" ? '<div class="resolve-panel"><h4>Had a word with your technician?</h4><label><input id="repair-confirm" type="checkbox">I have confirmed with my technician or school staff that the repair is complete and the equipment is safe to use.</label><button type="button" class="button secondary" id="resolve-case" disabled>Mark case resolved ' + icon("check") + "</button></div>" : ""}</div><div class="backup-panel">${icon("book-open")}<span class="badge">BUILT-IN · NO AI</span>${saved ? `<h4 class="activity-title" id="saved-activity-title">${esc(saved.title)}</h4><p>${saved.duration} minutes · ${esc(saved.learnerLevel)} · Works aloud</p><ol class="activity-steps">${saved.instructions.map((item) => `<li><strong>${esc(item.title)} · ${item.minutes} min</strong><p>${esc(item.text)}</p></li>`).join("")}</ol>${saved.availableMaterials ? `<p>Materials noted by you: ${esc(saved.availableMaterials)}. Optional, not required by the activity.</p>` : ""}<p>Choose an appropriate, safe teaching space under your school's procedure.</p><div class="activity-actions"><button type="button" class="button primary" id="print-activity">${icon("printer")}Print activity</button>${record.status === "open" ? '<button type="button" class="button secondary" id="open-activity">Edit lesson details</button>' : ""}</div>` : '<h4 class="activity-title">The lesson can still<br>have its moment.</h4><p>A 15-minute activity that needs no projector, computer or internet. Add a topic, or keep it simple.</p><button type="button" class="button primary" id="open-activity">Make a backup activity ' + icon("arrow-up-right") + "</button>"}<p class="small-note">${mode === "memory" ? "Temporary memory: changes disappear on refresh." : "Kept with this case, on this browser only."}</p></div></div><div class="workspace-tail"><span>${mode === "memory" ? "TEMPORARY MEMORY · NOT PERSISTED" : "LOCAL CASE · NOT SYNCED OR BACKED UP"}</span><button type="button" class="button secondary" id="print-handoff">${icon("printer")}Print technician handoff</button></div>`;
  if (record.status === "resolved" && !saved) {
    $("open-activity").disabled = true;
    $("open-activity").textContent = "No saved backup activity";
  }
  renderPrint("handoff");
}
function render() {
  renderList();
  renderWorkspace();
  storageUI();
}
function focusWorkspace() {
  $("workspace-title")?.focus({ preventScroll: true });
  $("workspace").scrollIntoView({ block: "start" });
}
function openCase(id) {
  selected = id;
  render();
  focusWorkspace();
}
function openReport(scenario) {
  if (!canChange() || records.length >= LIMIT) return;
  $("report-form").reset();
  $("scenario-select").value = scenario;
  oldScenario = scenario;
  $("device-field").value = scenarios[scenario].device;
  $("report-error").textContent = "";
  reportBaseline = snapshot("report-form");
  $("report-dialog").showModal();
  $("scenario-select").focus();
}
function openActivity() {
  const record = current();
  if (!record || record.status !== "open") return;
  activityCase = record.id;
  $("activity-form").reset();
  for (const [key, value] of Object.entries(record.activity || {})) if (["topic", "learnerLevel", "availableMaterials"].includes(key)) $("activity-form").elements.namedItem(key).value = value;
  $("activity-error").textContent = "";
  activityBaseline = snapshot("activity-form");
  $("activity-dialog").showModal();
  $("activity-form").elements.topic.focus();
}
function guardedClose(id) {
  const formId = id === "report-dialog" ? "report-form" : id === "activity-dialog" ? "activity-form" : null;
  const baseline = id === "report-dialog" ? reportBaseline : activityBaseline;
  if (formId && snapshot(formId) !== baseline) ask("Leave this draft?", "Your unsaved form changes will be discarded. The saved case collection stays unchanged.", "Discard draft", () => $(id).close());
  else $(id).close();
}
function renderPrint(kind) {
  const record = current();
  if (!record) return;
  const saved = record.activity;
  const footer = '<p class="print-foot">Local browser record · not sent to a technician. Teacher-managed static concept. Fixed checks are not a diagnosis; follow school policy and qualified staff. Keep personal and student information out of this record.</p>';
  if (kind === "activity" && saved) {
    $("print-view").innerHTML = `<div class="print-brand">LabRescue / Classroom backup activity</div><h1>${esc(saved.title)}</h1><p>${saved.duration} minutes · ${esc(saved.learnerLevel)} · Built-in template, not AI</p><p>Works aloud without projector, computer or internet. Paper is optional. Choose a safe teaching space under school policy.</p>${saved.availableMaterials ? `<p>Teacher's materials note (optional): ${esc(saved.availableMaterials)}</p>` : ""}<ol>${saved.instructions.map((item) => `<li><h3>${esc(item.title)} · ${item.minutes} minutes</h3><p>${esc(item.text)}</p></li>`).join("")}</ol>${footer}`;
  } else {
    $("print-view").innerHTML = `<div class="print-brand">LabRescue / Technician handoff</div><h1>${esc(record.device)}</h1><dl><dt>Issue</dt><dd>${esc(scenarios[record.scenario].name)}</dd><dt>Status</dt><dd>${esc(record.status)}</dd><dt>Priority</dt><dd>${esc(record.urgency)}</dd><dt>Symptom</dt><dd>${esc(record.symptom)}</dd><dt>Lesson impact</dt><dd>${esc(record.impact)}</dd><dt>Context</dt><dd>${esc(record.notes || "No additional context recorded.")}</dd><dt>Created</dt><dd>${esc(stamp(record.createdAt))}</dd><dt>Updated</dt><dd>${esc(stamp(record.updatedAt))}</dd></dl><h2>Teacher-recorded observations</h2>${record.checks.length ? `<ol>${record.checks.map((entry) => `<li><h3>${esc(scenarios[record.scenario].steps.find((step) => step.id === entry.stepId).title)}</h3><p>${esc(outcomes[entry.outcome])} · ${esc(stamp(entry.at))}</p></li>`).join("")}</ol>` : "<p>No checks have been recorded.</p>"}<h2>${record.status === "resolved" ? "Repair confirmation" : "Still to do"}</h2><p>${record.status === "resolved" ? "The teacher confirmed the repair with their technician or school staff and marked the case resolved." : "The case remains open. Qualified staff should review these observations. The teacher must confirm the repair before resolving it."}</p><p>Backup activity: ${saved ? esc(saved.title) : "Not created."}</p>${mode === "memory" ? "<p>TEMPORARY MEMORY: this record has not been persisted.</p>" : ""}${footer}`;
  }
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.dataset.report) openReport(button.dataset.report);
  else if (button.dataset.case) openCase(button.dataset.case);
  else if (button.dataset.filter) { filter = button.dataset.filter; selected = null; render(); }
  else if (button.dataset.close) guardedClose(button.dataset.close);
  else if (button.hasAttribute("data-memory")) ask("Continue in temporary memory?", "Existing stored data stays untouched. This browser session will hold new changes only until refresh; they will not be saved to local storage.", "Use temporary memory", () => { mode = "memory"; storageMessage = ""; storageUI(); renderList(); if ($("report-error")) $("report-error").textContent = ""; $("activity-error").textContent = ""; toast("Temporary mode enabled"); });
  else if (button.dataset.outcome) {
    const record = current(), step = record && nextStep(record);
    if (!step) return;
    if (updateRecord(recordCheck(record, step.id, button.dataset.outcome, now()))) { $("check-heading")?.focus({ preventScroll: true }); toast("Outcome recorded"); }
  } else if (button.id === "undo-check") {
    const record = current();
    if (updateRecord(undoCheck(record, now()))) { $("check-heading")?.focus({ preventScroll: true }); toast("Last response removed"); }
  } else if (button.id === "close-workspace") {
    const id = selected; selected = null; render();
    document.querySelector(`[data-case="${id}"]`)?.focus({ preventScroll: true });
  } else if (button.id === "open-activity") openActivity();
  else if (button.id === "resolve-case") {
    const record = current();
    if (!$("repair-confirm")?.checked) return;
    if (updateRecord(resolveCase(record, true, now()))) { filter = "resolved"; renderList(); $("workspace-title").focus({ preventScroll: true }); toast("Case marked resolved"); }
  } else if (["print-handoff", "print-activity"].includes(button.id)) {
    renderPrint(button.id === "print-activity" ? "activity" : "handoff");
    try { window.print(); } catch { toast("Printing is unavailable. The case and activity remain readable here."); }
  } else if (button.id === "retry-storage") {
    ask("Read storage again?", "This refreshes the dashboard from the stored collection. Previously rejected changes were not applied.", "Read storage", load);
  } else if (button.id === "flow-button") $("start").scrollIntoView({ block: "start", behavior: "smooth" });
  else if (["about-button", "scope-button"].includes(button.id)) $("about-dialog").showModal();
});
$("case-search").addEventListener("input", () => { renderList(); storageUI(); });
$("scenario-select").addEventListener("change", () => {
  if ($("device-field").value === scenarios[oldScenario].device) $("device-field").value = scenarios[$("scenario-select").value].device;
  oldScenario = $("scenario-select").value;
});
document.addEventListener("change", (event) => { if (event.target.id === "repair-confirm") $("resolve-case").disabled = !event.target.checked; });
$("report-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!$("report-dialog").open || !canChange()) return;
  try {
    if (records.length >= LIMIT) throw Error("This browser already holds 30 cases. Existing history is preserved.");
    const record = report(formValue("report-form"), crypto.randomUUID(), now());
    if (!commit([...records, record], "report-error")) return;
    $("report-dialog").close();
    filter = "open"; selected = record.id; render(); focusWorkspace();
    toast("Case created");
  } catch (error) { $("report-error").textContent = error.message; }
});
$("activity-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!$("activity-dialog").open || !canChange()) return;
  const record = records.find((item) => item.id === activityCase);
  try {
    if (!record || record.status !== "open") throw Error("This open case is no longer available.");
    const next = saveActivity(record, formValue("activity-form"), now());
    if (!updateRecord(next, "activity-error")) return;
    $("activity-dialog").close();
    $("saved-activity-title").tabIndex = -1;
    $("saved-activity-title").focus({ preventScroll: true });
    toast("Backup activity saved");
  } catch (error) { $("activity-error").textContent = error.message; }
});
for (const id of ["report-dialog", "activity-dialog"]) $(id).addEventListener("cancel", (event) => { event.preventDefault(); guardedClose(id); });
$("confirm-keep").addEventListener("click", () => { confirmCallback = null; $("confirm-dialog").close(); });
$("confirm-dialog").addEventListener("cancel", () => { confirmCallback = null; });
$("confirm-go").addEventListener("click", () => { const callback = confirmCallback; confirmCallback = null; $("confirm-dialog").close(); callback?.(); });
window.addEventListener("beforeunload", (event) => {
  if (($("report-dialog").open && snapshot("report-form") !== reportBaseline) || ($("activity-dialog").open && snapshot("activity-form") !== activityBaseline)) { event.preventDefault(); event.returnValue = ""; }
});
load();
