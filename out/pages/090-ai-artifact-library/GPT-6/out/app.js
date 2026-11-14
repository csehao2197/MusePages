import { TYPES, LIMIT, VERSION_LIMIT, autoTags, fixtures, makeArtifact, editArtifact, restoreVersion, filterArtifacts } from "./assets/engine.js";
import { escape as esc, highlight, previewDocument } from "./assets/preview.js";
const $ = (id) => document.getElementById(id);
const icon = (name) => `<svg aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const date = (value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const formatIcon = (type) => ({ html: "code-xml", react: "component", svg: "pen-tool", markdown: "file-text", json: "braces", css: "palette", mermaid: "workflow" }[type] || "file-code");
let records = fixtures(), state = { view: "all", query: "", type: "", tag: "", project: "", sort: "recent" };
const samplePreviews = new Map(fixtures().filter((record) => ["html", "svg", "css", "markdown"].includes(record.type)).map((record) => [record.id, record]));
let layout = "grid", selected = null, tab = "preview", viewedVersion = null, editId = null, baseline = "", callback = null, toastTimer;
const current = () => records.find((record) => record.id === selected);
const formValue = () => Object.fromEntries(new FormData($("editor-form")));
const snapshot = () => JSON.stringify(formValue());
const now = () => new Date().toISOString();
function toast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").hidden = false;
  toastTimer = setTimeout(() => { $("toast").hidden = true; }, 5000);
}
function ask(title, copy, label, action) {
  if ($("confirm-dialog").open) return;
  $("confirm-title").textContent = title;
  $("confirm-copy").textContent = copy;
  $("confirm-go").textContent = label;
  callback = action;
  $("confirm-dialog").showModal();
  $("confirm-keep").focus();
}
function clearFilters() {
  state.query = ""; state.type = ""; state.tag = ""; state.project = "";
  $("search-input").value = "";
  render();
}
function thumbnail(record) {
  const sample = samplePreviews.get(record.id);
  if (sample && sample.type === record.type && sample.content === record.content) return `<img class="rendered-thumbnail" src="assets/${record.id}.png" width="600" height="360" alt="">`;
  if (record.id === "command" && record.version === 1) return '<img class="react-art" src="assets/command.svg" width="600" height="360" alt=""><span class="source-badge">ILLUSTRATION · REACT SOURCE ONLY</span>';
  return `<div class="source-thumbnail"><span class="source-label">${esc(record.type.toUpperCase())} / ${["html", "svg", "css", "markdown"].includes(record.type) ? "OPEN FOR RESTRICTED PREVIEW" : "SOURCE ONLY"}</span>${highlight(record.content.slice(0, 750))}</div>`;
}
function render() {
  const active = records.filter((record) => !record.deleted);
  const projects = [...new Set(active.map((record) => record.project).filter(Boolean))].sort();
  const scope = records.filter((record) => state.view === "trash" ? record.deleted : !record.deleted && (state.view !== "favorites" || record.favorite));
  const tags = [...new Set(scope.flatMap((record) => record.tags))].sort();
  if (state.project && !records.some((record) => record.project === state.project)) state.project = "";
  $("count-all").textContent = active.length;
  $("count-favorites").textContent = active.filter((record) => record.favorite).length;
  $("count-trash").textContent = records.filter((record) => record.deleted).length;
  $("collection-count").textContent = projects.length;
  const label = { all: "All artifacts", favorites: "Favorites", trash: "Trash" }[state.view];
  $("breadcrumb-view").textContent = label;
  $("gallery-title").innerHTML = `${esc(state.project || label)} <span id="result-count"></span>`;
  document.querySelectorAll("[data-view]").forEach((button) => { button.classList.toggle("active", button.dataset.view === state.view); button.setAttribute("aria-label", `${{ all: "All artifacts", favorites: "Favorites", trash: "Trash" }[button.dataset.view]}`); button.setAttribute("aria-pressed", String(button.dataset.view === state.view)); });
  $("collection-nav").innerHTML = projects.map((project) => `<button type="button" class="collection-item ${state.project === project ? "active" : ""}" data-project="${esc(project)}" aria-pressed="${state.project === project}"><i></i>${esc(project)}</button>`).join("");
  $("tag-filter").innerHTML = `<option value="">Any tag</option>${[...new Set([...tags, ...(state.tag ? [state.tag] : [])])].map((tag) => `<option value="${esc(tag)}">${esc(tag)}</option>`).join("")}`;
  $("tag-filter").value = state.tag;
  $("project-filter").innerHTML = `<option value="">All collections</option>${[...new Set([...projects, ...(state.project ? [state.project] : [])])].map((project) => `<option value="${esc(project)}">${esc(project)}</option>`).join("")}`;
  $("project-filter").value = state.project;
  $("type-filter").value = state.type;
  document.querySelectorAll("[data-type]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.type === state.type)));
  const visible = filterArtifacts(records, state);
  $("result-count").textContent = visible.length;
  $("clear-filters").hidden = !state.query && !state.type && !state.tag && !state.project;
  $("artifact-grid").className = `artifact-grid${layout === "list" ? " list" : ""}`;
  $("artifact-grid").innerHTML = visible.map((record) => `<article class="artifact-card" data-artifact="${record.id}"><button type="button" class="card-open" data-open="${record.id}" aria-label="Open ${esc(record.name)}"><div class="thumbnail">${thumbnail(record)}</div><div class="card-info"><div class="card-title"><span class="format-icon ${record.type}">${icon(formatIcon(record.type))}</span><strong>${esc(record.name)}</strong></div><p>${esc(record.description || "A little source worth keeping.")}</p><div class="card-tags">${record.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div><div class="card-bottom">${icon("folder")}<span>${esc(record.project || "Uncollected")}</span><span>· ${esc(date(record.updatedAt))}</span><span class="version-badge">v${record.version}</span></div></div></button>${!record.deleted ? `<button type="button" class="favorite-button" data-favorite="${record.id}" aria-label="${record.favorite ? "Unfavorite" : "Favorite"} ${esc(record.name)}" aria-pressed="${record.favorite}">${icon("star")}</button>` : ""}</article>`).join("");
  $("empty").hidden = Boolean(visible.length);
  $("empty-copy").textContent = state.view === "trash" ? "Trashed artifacts stay here until refresh. Restore one from its detail view." : state.view === "favorites" ? "Favorite a useful artifact, or try a broader filter." : "Try a different search, clear the filters, or add a new idea.";
  $("library-capacity").textContent = `${records.length} / ${LIMIT} SESSION SLOTS${records.some((record) => record.deleted) ? " · INCLUDES TRASH" : ""}`;
  $("new-artifact").disabled = records.length >= LIMIT;
  for (const [id, value] of [["grid-layout", "grid"], ["list-layout", "list"]]) { $(id).classList.toggle("active", layout === value); $(id).setAttribute("aria-pressed", String(layout === value)); }
}
function setHash(id) {
  const url = new URL(location.href);
  url.hash = id ? `artifact=${encodeURIComponent(id)}` : "";
  history.pushState(null, "", url);
}
function openDetail(id, navigate = true) {
  const record = records.find((item) => item.id === id);
  if (!record) { toast("That artifact is not in this session."); return; }
  selected = id; tab = "preview"; viewedVersion = record.version;
  if (navigate && location.hash !== `#artifact=${encodeURIComponent(id)}`) setHash(id);
  renderDetail();
  if (!$("detail-dialog").open) $("detail-dialog").showModal();
  $("detail-title").focus();
}
function closeDetail() {
  const id = selected;
  $("detail-dialog").close();
  selected = null;
  const url = new URL(location.href); url.hash = ""; history.replaceState(null, "", url);
  document.querySelector(`[data-open="${id}"]`)?.focus({ preventScroll: true });
}
function renderDetail() {
  const record = current();
  if (!record) return;
  $("detail-content").innerHTML = `<div class="detail-header"><div class="detail-header-top"><h2 id="detail-title" tabindex="-1">${esc(record.name)}</h2><button type="button" class="icon-button" id="close-detail" aria-label="Close artifact detail">${icon("x")}</button></div><p>${esc(record.description || "A useful little starting point.")}</p><div class="detail-tags"><span class="type-badge">${esc(record.type)}</span>${record.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}<span class="project-badge">${icon("folder")} ${esc(record.project || "Uncollected")}</span></div><div class="detail-actions">${record.deleted ? '<button type="button" class="button primary" id="restore-artifact">' + icon("archive-restore") + "Restore to library</button>" : `<button type="button" class="button secondary" id="edit-artifact">${icon("pencil")}Edit artifact</button><button type="button" class="button secondary" data-favorite="${record.id}" aria-pressed="${record.favorite}">${icon("star")}${record.favorite ? "Favorited" : "Favorite"}</button>`}<button type="button" class="button secondary" id="download-source">${icon("download")}Download source</button>${!record.deleted ? '<button type="button" class="button danger-button" id="trash-artifact">' + icon("trash-2") + "Move to trash</button>" : ""}</div></div><div class="detail-tabs" role="tablist" aria-label="Artifact detail"><button type="button" role="tab" data-tab="preview" id="tab-preview" aria-controls="detail-pane" aria-selected="${tab === "preview"}" tabindex="${tab === "preview" ? "0" : "-1"}">Preview</button><button type="button" role="tab" data-tab="code" id="tab-code" aria-controls="detail-pane" aria-selected="${tab === "code"}" tabindex="${tab === "code" ? "0" : "-1"}">Source</button><button type="button" role="tab" data-tab="versions" id="tab-versions" aria-controls="detail-pane" aria-selected="${tab === "versions"}" tabindex="${tab === "versions" ? "0" : "-1"}">Versions <span>${record.versions.length}</span></button></div><div class="detail-pane" id="detail-pane" role="tabpanel" aria-labelledby="tab-${tab}"></div><div class="detail-footer"><span>${record.deleted ? "IN TRASH" : "SESSION MEMORY"} · ${esc(record.slug)} · v${record.version}</span><span>Updated ${esc(date(record.updatedAt))} · Refresh resets changes</span></div>`;
  const pane = $("detail-pane");
  if (tab === "preview") {
    const srcdoc = previewDocument(record);
    pane.innerHTML = srcdoc ? '<iframe class="preview-frame" id="live-preview" sandbox="" title="Restricted static artifact preview"></iframe><p class="preview-note">Static allowlist · scripts, links, forms and network disabled. CSS resource references are omitted. The original source is unchanged.</p>' : `<div class="source-only"><div>${icon(formatIcon(record.type))}<br><strong>${record.type === "react" ? "React is source-only here." : record.type === "mermaid" ? "A diagram, in its source form." : "Source to keep. Not to run."}</strong><p>${record.type === "react" ? "This edition has no JSX compiler or React CDN. Open Source to inspect the component." : record.type === "mermaid" ? "Mermaid rendering is not connected. The complete diagram text is available in Source." : "This format is not executed in the browser. Inspect, copy or download the exact source."}</p><button type="button" class="button secondary" data-tab="code">Read the source ${icon("arrow-right")}</button></div></div>`;
    if (srcdoc) $("live-preview").srcdoc = srcdoc;
  } else if (tab === "code") pane.innerHTML = `<div class="code-tools"><span>${esc(record.type.toUpperCase())} · ${record.content.length.toLocaleString("en-GB")} characters</span><button type="button" class="button secondary" id="copy-source">${icon("copy")}Copy source</button></div><pre class="source-block"><code>${highlight(record.content)}</code></pre><p class="preview-note">Downloads and copies contain the original source, not a sanitized preview. Inspect before opening or running.</p>`;
  else {
    const version = record.versions.find((item) => item.version === viewedVersion) || record.versions.at(-1);
    viewedVersion = version.version;
    pane.innerHTML = `<div class="versions-layout"><div class="versions-list" role="group" aria-label="Source versions">${record.versions.toReversed().map((item) => `<button type="button" class="${item.version === viewedVersion ? "active" : ""}" data-version="${item.version}" aria-pressed="${item.version === viewedVersion}">Version ${item.version}${item.version === record.version ? " · current" : ""}<small>${esc(date(item.at))}</small></button>`).join("")}</div><div class="versions-content"><div class="version-summary"><strong>Source snapshot · v${version.version}</strong><button type="button" class="button secondary" id="restore-version" ${record.deleted || record.content === version.content || record.version >= VERSION_LIMIT ? "disabled" : ""}>${icon("rotate-ccw")}Restore as new version</button></div><pre class="source-block"><code>${highlight(version.content)}</code></pre><p>Versions track source only. Restoring keeps the current name, format, collection and tags. Up to 10 source versions are kept.${record.version >= VERSION_LIMIT ? " Source history is now full; metadata can still be edited." : ""}</p></div></div>`;
  }
}
function replaceRecord(next) {
  records = records.map((record) => record.id === next.id ? next : record);
  render();
}
function openEditor(id = null) {
  const record = records.find((item) => item.id === id);
  if (record?.deleted || (!record && records.length >= LIMIT)) return;
  editId = record ? id : null;
  $("editor-form").reset();
  for (const key of ["name", "description", "type", "project", "content", "tags"]) $("editor-form").elements.namedItem(key).value = record ? key === "tags" ? record.tags.join(", ") : record[key] : key === "type" ? "html" : "";
  $("editor-title").textContent = record ? "A little refinement." : "Keep something useful.";
  $("editor-error").textContent = "";
  baseline = snapshot();
  $("editor-dialog").showModal();
  $("editor-form").elements.name.focus();
}
function closeEditor() {
  if (snapshot() !== baseline) ask("Leave this draft?", "Unsaved editor changes will be discarded. The artifact and its source history stay unchanged.", "Discard draft", () => $("editor-dialog").close());
  else $("editor-dialog").close();
}
function route() {
  if (!location.hash) { if ($("detail-dialog").open) { $("detail-dialog").close(); selected = null; } return; }
  const match = /^#artifact=([a-zA-Z0-9-]+)$/.exec(location.hash);
  if (match) openDetail(match[1], false);
  else toast("That artifact link is not available.");
}
for (const id of ["editor-type", "type-filter"]) {
  if (id === "editor-type") $(id).innerHTML = "";
  for (const type of TYPES) $(id).insertAdjacentHTML("beforeend", `<option value="${type}">${type.toUpperCase()}</option>`);
}
document.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.hasAttribute("data-view")) { state.view = button.dataset.view; state.project = ""; state.tag = ""; render(); }
  else if (button.hasAttribute("data-project")) { state.view = "all"; state.project = state.project === button.dataset.project ? "" : button.dataset.project; state.tag = ""; render(); }
  else if (button.hasAttribute("data-type")) { state.type = button.dataset.type; render(); }
  else if (button.dataset.open) openDetail(button.dataset.open);
  else if (button.dataset.favorite) {
    const record = records.find((item) => item.id === button.dataset.favorite);
    if (!record || record.deleted) return;
    replaceRecord({ ...record, favorite: !record.favorite, updatedAt: now() });
    if ($("detail-dialog").open) { renderDetail(); document.querySelector("#detail-content [data-favorite]")?.focus({ preventScroll: true }); }
    else document.querySelector(`[data-favorite="${record.id}"]`)?.focus({ preventScroll: true });
  } else if (button.dataset.tab) { tab = button.dataset.tab; renderDetail(); $(`tab-${tab}`).focus({ preventScroll: true }); }
  else if (button.dataset.version) { viewedVersion = Number(button.dataset.version); renderDetail(); document.querySelector(`[data-version="${viewedVersion}"]`)?.focus({ preventScroll: true }); }
  else if (button.hasAttribute("data-close-editor")) closeEditor();
  else if (button.hasAttribute("data-close-scope")) $("scope-dialog").close();
  else if (button.id === "new-artifact") openEditor();
  else if (button.id === "edit-artifact") openEditor(selected);
  else if (button.id === "close-detail") closeDetail();
  else if (["scope-top", "scope-sidebar", "scope-footer"].includes(button.id)) $("scope-dialog").showModal();
  else if (button.id === "clear-filters" || button.id === "empty-reset") clearFilters();
  else if (button.id === "grid-layout" || button.id === "list-layout") { layout = button.id === "grid-layout" ? "grid" : "list"; render(); }
  else if (button.id === "auto-tags") { $("editor-form").elements.tags.value = autoTags($("source-editor").value, $("editor-type").value).join(", "); toast("Pattern-based tags applied to the draft."); }
  else if (button.id === "trash-artifact") {
    const record = current();
    ask("Move this idea to trash?", "Its source and version history will remain in this session. You can restore it from Trash before refresh.", "Move to trash", () => { replaceRecord({ ...record, deleted: true, updatedAt: now() }); closeDetail(); toast("Moved to trash. Source history kept."); });
  } else if (button.id === "restore-artifact") { const record = current(); replaceRecord({ ...record, deleted: false, updatedAt: now() }); closeDetail(); toast("Restored to the library."); }
  else if (button.id === "restore-version") {
    const record = current(), version = viewedVersion;
    ask(`Restore source v${version}?`, "The selected source becomes a new version. Existing history is kept; current metadata and format stay unchanged.", "Restore source", () => { try { const next = restoreVersion(record, version, now()); replaceRecord(next); viewedVersion = next.version; renderDetail(); $("tab-versions").focus({ preventScroll: true }); toast(`Source restored as v${next.version}.`); } catch (error) { toast(error.message); } });
  } else if (button.id === "copy-source") {
    try { await navigator.clipboard.writeText(current().content); toast("Exact source copied."); } catch { toast("Clipboard unavailable. Select the readable source instead."); }
  } else if (button.id === "download-source") {
    const record = current(), extension = ({ html: "html", react: "jsx", svg: "svg", mermaid: "mmd", code: "txt", markdown: "md", json: "json", css: "css", text: "txt", python: "py", typescript: "ts", javascript: "js", shell: "sh" })[record.type];
    const url = URL.createObjectURL(new Blob([record.content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `${record.slug}.${extension}`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
});
$("search-input").addEventListener("input", () => { state.query = $("search-input").value; render(); });
for (const [id, key] of [["type-filter", "type"], ["tag-filter", "tag"], ["project-filter", "project"], ["sort-select", "sort"]]) $(id).addEventListener("change", () => { state[key] = $(id).value; render(); });
$("editor-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!$("editor-dialog").open) return;
  try {
    if (editId) { const next = editArtifact(records, editId, formValue(), now()); replaceRecord(next); viewedVersion = next.version; if ($("detail-dialog").open) renderDetail(); }
    else { const next = makeArtifact(records, formValue(), crypto.randomUUID(), now()); records = [...records, next]; state.view = "all"; clearFilters(); }
    $("editor-dialog").close();
    if (editId) $("detail-title")?.focus({ preventScroll: true });
    else $("gallery-title").scrollIntoView({ block: "start" });
    toast("Artifact kept in session memory.");
  } catch (error) { $("editor-error").textContent = error.message; }
});
$("editor-dialog").addEventListener("cancel", (event) => { event.preventDefault(); closeEditor(); });
$("detail-dialog").addEventListener("cancel", (event) => { event.preventDefault(); closeDetail(); });
$("confirm-keep").addEventListener("click", () => { callback = null; $("confirm-dialog").close(); });
$("confirm-dialog").addEventListener("cancel", () => { callback = null; });
$("confirm-go").addEventListener("click", () => { const action = callback; callback = null; $("confirm-dialog").close(); action?.(); });
$("detail-content").addEventListener("keydown", (event) => {
  const target = event.target.closest('[role="tab"]');
  if (!target || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const tabs = ["preview", "code", "versions"];
  tab = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[2] : tabs[(tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : 2)) % 3];
  renderDetail(); $(`tab-${tab}`).focus({ preventScroll: true });
});
window.addEventListener("beforeunload", (event) => { if ($("editor-dialog").open && snapshot() !== baseline) { event.preventDefault(); event.returnValue = ""; } });
window.addEventListener("hashchange", route);
render(); route();
