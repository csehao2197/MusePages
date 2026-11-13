import sheet from "./assets/catalog.js";
import { validate, filterSections, copyText, entryForHash, subscriptionDraft } from "./assets/engine.js";
const $ = (id) => document.getElementById(id);
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (id) => `<svg aria-hidden="true"><use href="assets/icons.svg#${id}"/></svg>`;
const state = { query: "", section: "", savedOnly: false, saved: new Set(), opened: new Set() };
const entries = new Map(sheet.sections.flatMap((section) => section.items.map((item) => [item.id, item])));
let current = [], toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").classList.add("show");
  toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2600);
}
async function copy(value) {
  try { await navigator.clipboard.writeText(value); toast("Copied. Ready for your next good idea."); }
  catch { toast("Clipboard unavailable. Expand the row to select and copy its text."); }
}
function updateExpand() {
  const allOpen = current.length > 0 && current.every((item) => state.opened.has(item.id));
  $("expand-all").querySelector("span").textContent = allOpen ? "Collapse all" : "Expand all";
  $("expand-all").disabled = !current.length;
}
function render() {
  const groups = filterSections(sheet, state);
  current = groups.flatMap((section) => section.items);
  $("result-count").textContent = `${current.length} essential${current.length === 1 ? "" : "s"} across ${groups.length} section${groups.length === 1 ? "" : "s"}`;
  $("saved-count").textContent = state.saved.size;
  $("saved-toggle").setAttribute("aria-pressed", String(state.savedOnly));
  $("clear-search").hidden = !state.query;
  $("all-sections").classList.toggle("active", !state.section);
  $("all-sections").setAttribute("aria-pressed", String(!state.section));
  document.querySelectorAll("[data-section]").forEach((button) => {
    const active = button.dataset.section === state.section;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("sections-grid").innerHTML = groups.map((section) => `<section class="reference-section ${section.color}" aria-labelledby="heading-${section.id}"><div class="section-header"><span class="section-icon">${icon(section.icon)}</span><div><h2 id="heading-${section.id}">${escape(section.title)}</h2><p>${escape(section.subtitle)}</p></div><span>${section.items.length}</span></div>${section.items.map((item) => `<article class="command-row" id="${item.id}"><details data-entry="${item.id}" ${state.opened.has(item.id) ? "open" : ""}><summary aria-label="${escape(item.key)} — ${escape(item.description)}">${icon("chevron-right")}<div><code>${escape(item.key)}</code><span>${escape(item.description)}</span></div></summary><div class="entry-body"><p>${escape(item.explanation)}</p>${item.example ? `<pre><code>${escape(item.example)}</code></pre>` : `<p>Keyboard shortcut. The copy button copies its notation, not a shell command.</p>`}<div class="entry-links"><a href="${escape(item.source)}" target="_blank" rel="noopener noreferrer">Official source${icon("arrow-up-right")}</a><button data-link="${item.id}">Copy entry link</button></div></div></details><div class="row-actions"><button class="icon-button" data-save="${item.id}" aria-label="${state.saved.has(item.id) ? "Unsave" : "Save"} ${escape(item.key)}" aria-pressed="${state.saved.has(item.id)}">${icon("bookmark")}</button><button class="icon-button" data-copy="${item.id}" aria-label="Copy ${escape(item.key)}">${icon("copy")}</button></div></article>`).join("")}</section>`).join("");
  $("empty").hidden = !!current.length;
  $("sections-grid").hidden = !current.length;
  updateExpand();
}
function reset() {
  Object.assign(state, { query: "", section: "", savedOnly: false });
  $("search").value = "";
  render();
}
function openDialog(id) { $(id).showModal(); }
function deepLink() {
  const target = entryForHash(sheet, location.hash);
  if (!target) return;
  reset();
  state.opened.add(target.item.id);
  render();
  requestAnimationFrame(() => { $(target.item.id)?.scrollIntoView({ block: "start" }); });
}
try {
  validate(sheet);
  $("section-buttons").innerHTML = sheet.sections.map((section) => `<button class="nav-item ${section.color}" data-section="${section.id}" aria-pressed="false">${icon(section.icon)}<span>${escape(section.title)}</span><small>${section.items.length}</small></button>`).join("");
  const sources = [...new Set(sheet.sections.flatMap((section) => section.items.map((item) => item.source)))];
  $("source-list").innerHTML = sources.map((url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${escape(url.split("/").pop().replaceAll("-", " "))}${icon("arrow-up-right")}</a>`).join("");
  render();
  deepLink();
} catch {
  $("load-error").hidden = false;
  $("sections-grid").hidden = true;
}
$("search").addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});
$("clear-search").addEventListener("click", () => { state.query = ""; $("search").value = ""; render(); $("search").focus(); });
$("all-sections").addEventListener("click", () => { state.section = ""; render(); });
$("section-buttons").addEventListener("click", (event) => {
  const button = event.target.closest("[data-section]");
  if (!button) return;
  state.section = button.dataset.section;
  render();
});
$("saved-toggle").addEventListener("click", () => { state.savedOnly = !state.savedOnly; render(); });
$("reset-filters").addEventListener("click", () => { reset(); $("search").focus(); });
$("expand-all").addEventListener("click", () => {
  const open = !current.every((item) => state.opened.has(item.id));
  for (const item of current) open ? state.opened.add(item.id) : state.opened.delete(item.id);
  render();
});
$("sections-grid").addEventListener("toggle", (event) => {
  const details = event.target;
  if (!details.matches("details[data-entry]") || !details.isConnected) return;
  details.open ? state.opened.add(details.dataset.entry) : state.opened.delete(details.dataset.entry);
  updateExpand();
}, true);
$("sections-grid").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.copy) copy(copyText(entries.get(button.dataset.copy)));
  if (button.dataset.save) {
    const id = button.dataset.save;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    render();
    const focus = state.savedOnly ? $("saved-toggle") : document.querySelector(`[data-save="${id}"]`);
    focus?.focus({ preventScroll: true });
  }
  if (button.dataset.link) {
    const url = new URL(location.href);
    url.hash = button.dataset.link;
    copy(url.href);
  }
});
$("copy-hero").addEventListener("click", () => copy("claude --continue"));
$("theme-toggle").addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  $("theme-toggle").setAttribute("aria-pressed", String(light));
  $("theme-toggle").setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
  $("theme-toggle").innerHTML = icon(light ? "moon" : "sun");
  document.querySelector("meta[name=theme-color]").content = light ? "#f8f8f6" : "#0d1117";
});
for (const [button, dialog] of [["open-changelog", "changelog-dialog"], ["open-sources", "sources-dialog"], ["open-newsletter", "newsletter-dialog"]]) {
  $(button).addEventListener("click", () => openDialog(dialog));
}
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => $(button.dataset.close).close()));
$("newsletter-dialog").addEventListener("close", () => { $("newsletter-form").reset(); $("newsletter-error").textContent = ""; $("newsletter-result").textContent = ""; });
$("newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    const content = subscriptionDraft($("newsletter-email").value, $("newsletter-consent").checked);
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "unsent-update-request.txt"; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $("newsletter-form").reset();
    $("newsletter-error").textContent = "";
    $("newsletter-result").textContent = "Local draft downloaded. Not sent; you are not subscribed.";
  } catch (error) {
    $("newsletter-error").textContent = error.message;
    $("newsletter-result").textContent = "";
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!document.querySelector("dialog[open]")) { $("search").focus(); $("search").select(); }
  }
});
addEventListener("hashchange", deepLink);
