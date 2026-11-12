const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="assets/icons.svg#${name}"/></svg>`;
const number = (value) => value.toLocaleString("en-US");
const brokers = [
  { name: "Sarah Chen", title: "Managing Director", specialty: "Office", email: "sarah@vanguard.com", image: "sarah" },
  { name: "Marcus Rivera", title: "Senior VP", specialty: "Retail", email: "marcus@vanguard.com", image: "marcus" },
  { name: "Tom Bradley", title: "Director", specialty: "Industrial", email: "tom@vanguard.com", image: "tom" },
];
const properties = [
  { id: "office", name: "Frost Tower — Suite 2400", address: "401 Congress Ave, Austin, TX 78701", neighborhood: "Downtown", type: "Office", transaction: "lease", size: 12500, built: 2003, rate: 52, monthly: 54167, specs: ["12,500 SF", "24th Floor", "Built 2003", "Renovated 2022"], tags: ["Full-Floor", "City Views", "Spec Suite"], image: "office-tower", alt: "Illustrative modern glass skyscrapers viewed from below, not the actual Frost Tower", broker: 0, className: "A", amenities: ["Parking Included", "Fiber Internet", "Conference Rooms", "Rooftop Access", "EV Charging"], certifications: ["LEED", "WELL Building"], availability: 0, quick: ["Coworking Ready", "Move-in Ready", "Green Certified"], x: 510, y: 545 },
  { id: "retail", name: "Domain NORTHSIDE — Retail Pad 8", address: "11600 Domain Dr, Austin, TX 78758", neighborhood: "North Austin Domain", type: "Retail", transaction: "lease", size: 3200, built: 2019, rate: 42, monthly: 11200, specs: ["3,200 SF", "Ground Floor", "Built 2019", "Endcap"], tags: ["High Traffic", "Patio Available", "Restaurant Ready"], image: "retail", alt: "Illustrative outdoor shopping-center facade and escalators, not the actual Domain NORTHSIDE", broker: 1, className: "B", amenities: ["Parking Included", "On-Site Management"], certifications: ["ENERGY STAR"], availability: 30, quick: ["Move-in Ready", "Green Certified"], x: 290, y: 185 },
  { id: "industrial", name: "East Austin Distribution Center", address: "4800 E 7th St, Austin, TX 78702", neighborhood: "East Austin", type: "Industrial", transaction: "sale", size: 45000, built: 2015, price: 6750000, specs: ["45,000 SF", "24' Clear Height", "Built 2015", "4 Loading Docks"], tags: ["Fenced Yard", "Sprinklered", "Rail Adjacent"], image: "industrial", alt: "Illustrative aerial loading docks and trucks, not the actual East Austin Distribution Center", broker: 2, className: "B", amenities: ["Parking Included", "Loading Docks"], certifications: [], availability: 90, quick: [], x: 795, y: 600 },
];
const featured = { id: "featured", name: "The Austin Tech Center — Full Building", rate: 58, size: 185000 };
const state = { query: "Austin, TX", type: "", transaction: "", quick: new Set(), saved: new Set(), savedOnly: false, filters: {}, page: 1, size: 3, view: "grid", area: null };
const mobile = matchMedia("(max-width: 900px)");
const narrow = matchMedia("(max-width: 650px)");
const fieldGroups = [
  ["type", "PROPERTY TYPE", [["Office",142],["Retail",58],["Industrial",31],["Flex",12],["Land",5],["Mixed-Use","—"]]],
  ["price", "PRICE RANGE"], ["size", "SIZE (SF)"],
  ["className", "BUILDING CLASS", [["A",89],["B",112],["C",47]]],
  ["year", "YEAR BUILT", ["Before 2000","2000-2010","2010-2020","2020+"]],
  ["amenities", "AMENITIES", ["Parking Included","On-Site Management","Fiber Internet","Loading Docks","Conference Rooms","Rooftop Access","EV Charging"]],
  ["certifications", "CERTIFICATIONS", ["LEED","ENERGY STAR","WELL Building"]],
  ["availability", "AVAILABILITY", [["0","Available Now"],["30","Within 30 Days"],["90","Within 90 Days"]]],
];
function rangeFields(key, min, max, step) {
  return `<p class="range-unit" id="${key}-unit">${key === "price" ? "$ /SF/year · lease samples" : "500–100,000+ SF"}</p><div class="dual-range"><input type="range" min="${min}" max="${max}" step="${step}" value="${min}" data-range="${key}-min" aria-label="Minimum ${key} slider"><input type="range" min="${min}" max="${max}" step="${step}" value="${max}" data-range="${key}-max" aria-label="Maximum ${key} slider"></div><div class="range-inputs"><label>Min<input type="number" id="${key}-min" min="${min}" max="${max}" step="${step}" value="${min}" required aria-label="Minimum ${key}"></label><span>–</span><label>Max<input type="number" id="${key}-max" min="${min}" max="${max}" step="${step}" value="${max}" required aria-label="Maximum ${key}"></label></div>`;
}
$("#filter-groups").innerHTML = fieldGroups.map(([key, title, values]) => `<details class="filter-group" data-group="${key}"${["type","price","size"].includes(key) ? " open" : ""}><summary><span>${title}<i class="group-count" hidden></i></span></summary>${key === "price" ? rangeFields(key,15,85,1) : key === "size" ? rangeFields(key,500,100000,500) : `<div class="filter-options">${values.map((value) => {
  const [name, count] = Array.isArray(value) ? value : [value, null];
  return `<label><input type="checkbox" name="${key}" value="${name}">${key === "className" ? `Class ${name}` : key === "availability" ? count : name}${count !== null && key !== "availability" ? `<span>${count}</span>` : ""}</label>`;
}).join("")}</div>`}</details>`).join("") + '<p class="small-note" style="margin-top:14px">Counts are original brief totals, not this three-record dataset. Amenities, certifications and availability are illustrative filter fixtures.</p><p class="filter-error" id="filter-error" role="status"></p>';
let priceMode = "lease";
function syncPriceMode() {
  const next = state.transaction === "sale" ? "sale" : "lease";
  if (next === priceMode) return;
  priceMode = next;
  const [min, max, step] = next === "sale" ? [500000,50000000,10000] : [15,85,1];
  for (const edge of ["min","max"]) {
    for (const input of [$(`#price-${edge}`), $(`[data-range="price-${edge}"]`)]) {
      input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(edge === "min" ? min : max);
    }
  }
  $("#price-unit").textContent = next === "sale" ? "$500K–$50M · sale samples" : "$ /SF/year · lease samples";
}
function readFilters() {
  const filters = {};
  for (const [key, , values] of fieldGroups) if (values) filters[key] = $$(`input[name="${key}"]:checked`, $("#filter-form")).map((input) => input.value);
  for (const key of ["price","size"]) {
    const min = $(`#${key}-min`), max = $(`#${key}-max`);
    min.setCustomValidity(Number(min.value) > Number(max.value) ? "Minimum must not exceed maximum." : "");
    filters[`${key}Min`] = Number(min.value); filters[`${key}Max`] = Number(max.value);
  }
  filters.priceMode = priceMode;
  return filters;
}
function activeCount() {
  const filters = state.filters;
  return Object.values(filters).filter(Array.isArray).reduce((sum, values) => sum + values.length, 0) + state.quick.size + (state.type ? 1 : 0) + (state.transaction ? 1 : 0) + (filters.priceMin !== (priceMode === "sale" ? 500000 : 15) || filters.priceMax !== (priceMode === "sale" ? 50000000 : 85) ? 1 : 0) + (filters.sizeMin !== 500 || filters.sizeMax !== 100000 ? 1 : 0) + (state.area ? 1 : 0);
}
function applyFilters() {
  const next = readFilters();
  if (!$("#filter-form").checkValidity()) { $("#filter-error").textContent = "Check your ranges: minimum must be no greater than maximum, and values must stay within the labelled limits."; return false; }
  $("#filter-error").textContent = "";
  state.filters = next; state.page = 1; render();
  return true;
}
$$("[data-range]").forEach((input) => input.addEventListener("input", () => { $(`#${input.dataset.range}`).value = input.value; }));
$$(".range-inputs input").forEach((input) => input.addEventListener("input", () => {
  input.setCustomValidity("");
  $(`[data-range="${input.id}"]`).value = input.value;
}));
$("#filter-form").addEventListener("change", applyFilters);
$("#filter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (applyFilters() && $("#filter-dialog").open) $("#filter-dialog").close();
});
const filterPanel = $("#filter-panel");
function positionFilters() {
  (mobile.matches ? $("#filter-dialog .dialog-body") : $("#filter-slot")).append(filterPanel);
  if (!mobile.matches && $("#filter-dialog").open) $("#filter-dialog").close();
}
mobile.addEventListener("change", positionFilters);
positionFilters();
$("#filter-dialog .close").addEventListener("click", () => $("#filter-dialog").close());
function resetSearch() {
  $("#search-form").reset(); $("#filter-form").reset();
  Object.assign(state, { query: "Austin, TX", type: "", transaction: "", page: 1, area: null, savedOnly: false });
  state.quick.clear();
  syncPriceMode();
  $$("[data-quick]").forEach((button) => button.setAttribute("aria-pressed","false"));
  state.filters = readFilters(); $("#filter-error").textContent = ""; drawing = false;
  render();
}
$("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = $("#location").value.trim(); state.type = $("#search-type").value; state.transaction = $("#transaction").value;
  syncPriceMode(); applyFilters();
  $("#results").scrollIntoView();
});
$$("[data-quick]").forEach((button) => button.addEventListener("click", () => {
  const name = button.dataset.quick;
  state.quick.has(name) ? state.quick.delete(name) : state.quick.add(name);
  button.setAttribute("aria-pressed", String(state.quick.has(name)));
  state.page = 1; render();
}));
function inArea(property, area) { return !area || property.x >= area.x && property.x <= area.x + area.w && property.y >= area.y && property.y <= area.y + area.h; }
function filtered() {
  const f = state.filters;
  const query = state.query.toLowerCase().replace(/,\s*/g," ").replace(/\s+/g," ").trim();
  const yearMatch = (year, label) => label === "Before 2000" ? year < 2000 : label === "2020+" ? year >= 2020 : year >= Number(label.slice(0,4)) && year <= Number(label.slice(5));
  const result = properties.filter((p) => {
    const address = `${p.name} ${p.address.replace(/,\s*/g," ")} ${p.neighborhood}`.toLowerCase();
    return (!query || query.split(" ").every((word) => address.includes(word))) && (!state.type || p.type === state.type) && (!state.transaction || p.transaction === state.transaction) && (!state.savedOnly || state.saved.has(p.id)) &&
      [...state.quick].every((name) => p.quick.includes(name)) && (!f.type.length || f.type.includes(p.type)) && (!f.className.length || f.className.includes(p.className)) &&
      (!f.year.length || f.year.some((label) => yearMatch(p.built,label))) && f.amenities.every((item) => p.amenities.includes(item)) && f.certifications.every((item) => p.certifications.includes(item)) &&
      (!f.availability.length || f.availability.some((value) => p.availability <= Number(value))) && p.size >= f.sizeMin && (f.sizeMax === 100000 || p.size <= f.sizeMax) &&
      (p.transaction !== f.priceMode || (p.transaction === "sale" ? p.price : p.rate) >= f.priceMin && (p.transaction === "sale" ? p.price : p.rate) <= f.priceMax) && inArea(p,state.area);
  });
  const sort = $("#sort").value;
  if (sort.startsWith("size")) result.sort((a,b) => (a.size-b.size)*(sort.endsWith("low") ? 1 : -1));
  if (sort.startsWith("price")) result.sort((a,b) => a.transaction.localeCompare(b.transaction) || ((a.price ?? a.rate)-(b.price ?? b.rate))*(sort.endsWith("low") ? 1 : -1));
  return result;
}
function priceText(property) { return property.transaction === "sale" ? `$${number(property.price)}` : `$${property.rate.toFixed(2)} /SF/year${property.id === "retail" ? " NNN" : ""}`; }
function card(property) {
  const broker = brokers[property.broker];
  return `<article class="property-card" data-property-id="${property.id}"><div class="card-media"><div class="photo-strip" tabindex="0" role="group" aria-label="${property.name} illustrative photos, swipe or use arrow keys"><img src="assets/${property.image}.jpg" alt="${property.alt}" width="1400" height="875"><img src="assets/${property.image}.jpg" alt="Alternate crop of the same illustrative ${property.type.toLowerCase()} photograph" width="1400" height="875" loading="lazy"></div><div class="card-badges"><span class="badge ${property.transaction === "sale" ? "sale" : ""}">FOR ${property.transaction.toUpperCase()}</span><span class="badge ${property.type === "Office" ? "green" : "type"}">${property.type === "Office" ? "CLASS A" : property.type.toUpperCase()}</span></div><span class="card-photo-note">ILLUSTRATIVE PHOTO</span></div><div class="card-copy"><p class="card-category"><span>${property.type.toUpperCase()}</span><span>AUSTIN, TX</span></p><h3>${property.name}</h3><p class="address">${icon("pin")}${property.address}</p><div class="card-specs">${property.specs.map((spec,index) => `<span>${icon(["size","floors","calendar","building"][index])}${spec}</span>`).join("")}</div><div class="card-price"><strong>${property.transaction === "sale" ? `$${number(property.price)}` : `$${property.rate.toFixed(2)}`}</strong><span>${property.transaction === "sale" ? "" : ` /SF/year${property.id === "retail" ? " NNN" : ""}`}</span><small>${property.transaction === "sale" ? "$150/SF" : `$${number(property.monthly)}/month`}</small></div><div class="card-tags">${property.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><p class="listed-by">Listed by <strong>${broker.name}</strong>, Vanguard Commercial</p><div class="card-actions"><button type="button" data-save="${property.id}" aria-pressed="${state.saved.has(property.id)}" aria-label="${state.saved.has(property.id) ? "Unsave" : "Save"} ${property.name}">${icon("heart")}${state.saved.has(property.id) ? "Saved" : "Save"}</button><button type="button" data-tour="${property.id}" aria-label="Tour ${property.name}">${icon("calendar")}Tour</button><button type="button" data-details="${property.id}">Details ${icon("right")}</button></div></div></article>`;
}
function render() {
  const matches = filtered();
  const pages = Math.max(1,Math.ceil(matches.length/state.size));
  state.page = Math.min(state.page,pages);
  const offset = (state.page-1)*state.size;
  $("#property-grid").innerHTML = matches.slice(offset,offset+state.size).map(card).join("");
  $("#empty-state").hidden = matches.length > 0;
  $("#result-count").textContent = `${matches.length} sample ${matches.length === 1 ? "property" : "properties"}${state.query ? ` matching “${state.query}”` : " across Austin"}`;
  $("#page-summary").textContent = `Showing ${matches.length ? offset+1 : 0}–${Math.min(offset+state.size,matches.length)} of ${matches.length} samples`;
  $("#page-buttons").innerHTML = `<button type="button" data-page="${state.page-1}" aria-label="Previous results page"${state.page === 1 ? " disabled" : ""}>${icon("left")}</button>` + Array.from({length:pages},(_,index) => `<button type="button" data-page="${index+1}" aria-label="Results page ${index+1}"${state.page === index+1 ? ' aria-current="page"' : ""}>${index+1}</button>`).join("") + `<button type="button" data-page="${state.page+1}" aria-label="Next results page"${state.page === pages ? " disabled" : ""}>${icon("next")}</button>`;
  $("#saved-only span").textContent = `Saved (${state.saved.size})`;
  $("#saved-only").setAttribute("aria-pressed",String(state.savedOnly));
  $$(".filter-count").forEach((element) => { element.textContent = String(activeCount()); });
  $("#active-summary").textContent = activeCount() ? `${activeCount()} ACTIVE FILTERS` : "ALL PROPERTIES";
  $$("[data-group]").forEach((group) => {
    const count = $$('input[type="checkbox"]:checked',group).length;
    $(".group-count",group).hidden = count === 0;
    $(".group-count",group).textContent = String(count);
  });
  $("#applied-filters").replaceChildren();
  for (const name of [...state.quick]) {
    const button = document.createElement("button"); button.type = "button";
    button.textContent = `${name} ×`; button.setAttribute("aria-label",`Remove ${name} filter`);
    button.addEventListener("click",() => $(`[data-quick="${name}"]`).click());
    $("#applied-filters").append(button);
  }
  if (state.area) {
    const button = document.createElement("button"); button.type = "button"; button.textContent = "Custom map area ×";
    button.addEventListener("click",clearArea); $("#applied-filters").append(button);
  }
  renderMap();
}
$("#sort").addEventListener("change",() => { state.page = 1; render(); });
$("#page-size").addEventListener("change",() => { state.size = Number($("#page-size").value); state.page = 1; render(); });
$("#saved-only").addEventListener("click",() => { state.savedOnly = !state.savedOnly; state.page = 1; render(); });
const info = $("#info-dialog");
function openDialog(title, html) {
  $("#info-title").textContent = title; $("#info-content").innerHTML = html;
  info.showModal(); $(".close",info).focus(); info.scrollTop = 0;
}
$(".close",info).addEventListener("click",() => info.close());
info.addEventListener("close",() => { if (!info.open) $("#info-content").replaceChildren(); });
function preview(form, summary) {
  const panel = document.createElement("div"); panel.className = "preview-result"; panel.setAttribute("role","status");
  const heading = document.createElement("h3"); heading.textContent = "Your local preview";
  const text = document.createElement("p"); text.textContent = summary;
  const note = document.createElement("p"); note.textContent = "Nothing was submitted, stored, emailed, reserved or listed. Contact fields were cleared. Close to remove this temporary preview.";
  panel.append(heading,text,note); form.reset(); form.replaceWith(panel);
}
function details(id) {
  const property = properties.find((item) => item.id === id);
  if (!property) return;
  openDialog(property.name, `<p>${property.address} · ${property.type} · For ${property.transaction}</p><img class="detail-photo" src="assets/${property.image}.jpg" alt="${property.alt}"><table class="detail-table"><tbody><tr><th>Space</th><td>${number(property.size)} SF</td></tr><tr><th>Asking price</th><td>${priceText(property)}</td></tr><tr><th>${property.transaction === "lease" ? "Monthly base estimate" : "Price per SF"}</th><td>${property.transaction === "lease" ? `$${number(property.monthly)}, rounded` : "$150"}</td></tr><tr><th>Property specs</th><td>${property.specs.slice(1).join(" · ")}</td></tr><tr><th>Highlights</th><td>${property.tags.join(" · ")}</td></tr><tr><th>Listed by</th><td>${brokers[property.broker].name}, Vanguard Commercial</td></tr></tbody></table><p class="small-note">Supplied specifications and prices are unverified examples; no actual listing is represented. Lease monthly figures are base rent only, excluding NNN, taxes, fees and other costs. Stock photo is not the named property.</p><details class="filter-group"><summary>ILLUSTRATIVE FILTER ATTRIBUTES</summary><p class="small-note">Class ${property.className}${property.id === "office" ? " (supplied class)" : " (sample assignment)"} · ${property.amenities.join(", ")} · ${property.certifications.join(", ") || "No certification assigned"} · Sample availability: ${property.availability} days. These filter fixtures are not verified listing facts.</p></details><button type="button" class="button blue" data-tour="${id}" style="margin-top:20px">Preview a Tour Enquiry ${icon("calendar")}</button>`);
}
function localForm(kind,id) {
  const property = id === "featured" ? featured : properties.find((item) => item.id === id);
  const heading = kind === "tour" ? `Tour ${property.name}` : kind === "save" ? "Keep your search in view." : "Bring a property to market.";
  const fields = kind === "tour" ? '<div class="form-row"><label>Preferred date<input type="date" name="date" required></label><label>Preferred time<select name="time"><option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option><option>1:00 PM</option><option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option><option>5:00 PM</option></select></label></div>' : kind === "save" ? `<p class="small-note" id="saved-criteria"></p><label>Alert frequency<select name="frequency"><option>Daily</option><option>Weekly</option></select></label>` : '<label>Property address<input name="address" required maxlength="200"></label><div class="form-row"><label>Property type<select name="type"><option>Office</option><option>Retail</option><option>Industrial</option><option>Flex</option><option>Land</option><option>Mixed-Use</option></select></label><label>Transaction<select name="offer"><option>For Lease</option><option>For Sale</option><option>For Sublease</option></select></label></div><label>Size (SF)<input type="number" name="size" min="1" step="1" required></label>';
  openDialog(heading, `<p>${kind === "save" ? "Preview an email-alert request for the current search. This demonstration does not activate alerts, email you or save a search between visits." : kind === "tour" ? "Choose a preferred time to preview an enquiry. This is not a reservation or live calendar. Dates use your browser's local timezone." : "Explore a local property-listing enquiry. There is no posting, listing database or broker submission."}</p><form class="local-form" id="action-form"><div class="form-row"><label>Full name<input name="name" required maxlength="100" autocomplete="off"></label><label>Email<input name="email" type="email" required maxlength="150" autocomplete="off"></label></div>${fields}<label>Notes<textarea name="notes" rows="2" maxlength="1000"></textarea></label><label class="checkbox-label"><input name="consent" type="checkbox" required>I understand this is a local preview, not a submission.</label><button type="submit" class="button navy">Preview ${kind === "save" ? "Search Alert" : kind === "tour" ? "Tour Request" : "Listing Enquiry"} ${icon("right")}</button></form>`);
  const form = $("#action-form");
  const criteria = `${state.query || "Austin"} · ${state.type || "All property types"} · ${state.transaction || "Lease & sale"} · ${activeCount()} active filters · ${filtered().length} matching sample records`;
  if (kind === "save") $("#saved-criteria").textContent = criteria;
  if (kind === "tour") {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    form.elements.date.min = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,"0")}-${String(tomorrow.getDate()).padStart(2,"0")}`;
  }
  form.addEventListener("submit",(event) => {
    event.preventDefault(); if (!form.reportValidity()) return;
    const data = new FormData(form);
    preview(form, `${data.get("name")} · ${kind === "tour" ? `${property.name}; preferred ${data.get("date")} at ${data.get("time")}` : kind === "save" ? `${data.get("frequency")} search alert preview; ${criteria}` : `${data.get("address")}; ${data.get("type")}; ${data.get("offer")}; ${number(Number(data.get("size")))} SF`}. ${data.get("notes")}`);
  });
}
$("#broker-profiles").innerHTML = brokers.map((broker,index) => `<article class="broker"><div class="portrait"><img class="${broker.image}" src="assets/${broker.image}.jpg" alt="Illustrative stock portrait, not ${broker.name}" loading="lazy" width="320" height="320"></div><div><h4>${broker.name}</h4><p>${broker.title}</p><p class="specialty">${broker.specialty} SPECIALIST</p><button type="button" data-broker="${index}" aria-label="Preview contact with ${broker.name}">${icon("mail")}${broker.email}</button><button type="button" data-broker="${index}">${icon("phone")}Phone not supplied · Enquire locally</button></div></article>`).join("");
$("#requirement-form").addEventListener("submit",(event) => {
  event.preventDefault();
  const form = event.currentTarget; if (!form.reportValidity()) return;
  const data = new FormData(form);
  const panel = $("#requirement-result"); panel.replaceChildren();
  const heading = document.createElement("h3"); heading.textContent = "Your requirement, in view.";
  const summary = document.createElement("p"); summary.textContent = `${data.get("name")} · ${data.get("company")} · ${data.get("type")} · ${data.get("size")} · ${data.getAll("submarket").join(", ") || "Any submarket"}. ${data.get("notes")}`;
  const note = document.createElement("p"); note.textContent = "Local preview only: nothing was sent, stored or shared. Contact fields were cleared.";
  const reset = document.createElement("button"); reset.type = "button"; reset.className = "button navy"; reset.textContent = "New requirement";
  reset.addEventListener("click",() => { panel.replaceChildren(); panel.hidden = true; form.hidden = false; form.elements.name.focus(); });
  panel.append(heading,summary,note,reset); panel.hidden = false; form.reset(); form.hidden = true; panel.scrollIntoView({block:"center"});
});
const nav = $("#mobile-nav");
$(".nav-toggle").addEventListener("click",() => { nav.showModal(); $(".nav-toggle").setAttribute("aria-expanded","true"); });
$(".close",nav).addEventListener("click",() => nav.close());
nav.addEventListener("close",() => $(".nav-toggle").setAttribute("aria-expanded","false"));
$$("a",nav).forEach((link) => link.addEventListener("click",() => nav.close()));
mobile.addEventListener("change",() => { if (!mobile.matches && nav.open) nav.close(); });
const map = { zoom: 1, x: 0, y: 0 };
let drawing = false, drag = null;
function viewBox() { return {x:map.x,y:map.y,w:1000/map.zoom,h:800/map.zoom}; }
function mapLock() { document.body.style.overflow = narrow.matches && state.view === "map" || document.body.classList.contains("expanded-map") ? "hidden" : ""; }
narrow.addEventListener("change",mapLock);
function setView(view) {
  state.view = view; $(".workspace").dataset.layout = view; $("#map-panel").hidden = view !== "map";
  $$(".view-toggle [data-view]").forEach((button) => button.setAttribute("aria-pressed",String(button.dataset.view === view)));
  if (view !== "map") { drawing = false; document.body.classList.remove("expanded-map"); $("#map-fullscreen").setAttribute("aria-pressed","false"); $("#map-fullscreen").setAttribute("aria-label","Expand map"); $("#map-selection").hidden = true; }
  mapLock(); renderMap();
  if (view === "map") $("#map-canvas").focus({preventScroll:true});
}
function renderMap() {
  const box = viewBox();
  $("#map-art").setAttribute("preserveAspectRatio","none");
  $("#map-art").setAttribute("viewBox",`${box.x} ${box.y} ${box.w} ${box.h}`);
  const width = $("#map-canvas").clientWidth || 500, height = $("#map-canvas").clientHeight || 740;
  const groups = [];
  for (const property of filtered().filter((item) => inArea(item,box))) {
    const pixel = {x:(property.x-box.x)/box.w*width,y:(property.y-box.y)/box.h*height};
    const near = groups.find((group) => Math.hypot(group.pixel.x-pixel.x,group.pixel.y-pixel.y) < 90);
    if (near) near.items.push(property);
    else groups.push({pixel,items:[property]});
  }
  $("#map-pins").innerHTML = groups.map((group) => {
    const x = group.items.reduce((sum,p) => sum+p.x,0)/group.items.length, y = group.items.reduce((sum,p) => sum+p.y,0)/group.items.length;
    const style = `left:${(x-box.x)/box.w*100}%;top:${(y-box.y)/box.h*100}%`;
    return group.items.length > 1 ? `<button type="button" class="map-cluster" data-cluster="${x},${y}" style="${style}" aria-label="Zoom into ${group.items.length} properties">${group.items.length}</button>` : `<button type="button" class="map-pin" data-pin="${group.items[0].id}" data-type="${group.items[0].type}" style="${style}" aria-label="Map ${group.items[0].name}">${group.items[0].transaction === "sale" ? "$6.75M" : `$${group.items[0].rate}/SF`}</button>`;
  }).join("");
  $("#drawn-area").toggleAttribute("hidden",!state.area);
  if (state.area) for (const [attribute,value] of Object.entries({x:state.area.x,y:state.area.y,width:state.area.w,height:state.area.h})) $("#drawn-area").setAttribute(attribute,String(value));
  $("#clear-area").hidden = !state.area;
  $("#map-canvas").classList.toggle("drawing",drawing);
  $("#draw-button").setAttribute("aria-pressed",String(drawing));
  $("#draw-status").textContent = drawing ? "Drag a rectangle to filter. Enter selects the visible area; Escape cancels drawing." : "";
  $("#zoom-out").disabled = map.zoom <= .4;
  $("#zoom-in").disabled = map.zoom >= 4;
}
new ResizeObserver(() => { if (state.view === "map") renderMap(); }).observe($("#map-canvas"));
function changeZoom(factor,center) {
  const before = viewBox(); const x = center?.x ?? before.x+before.w/2, y = center?.y ?? before.y+before.h/2;
  map.zoom = Math.max(.4,Math.min(4,map.zoom*factor));
  map.x = x-500/map.zoom; map.y = y-400/map.zoom;
  $("#search-area").hidden = false; $("#map-selection").hidden = true; renderMap();
}
$("#zoom-in").addEventListener("click",() => changeZoom(1.5));
$("#zoom-out").addEventListener("click",() => changeZoom(1/1.5));
$("#map-reset").addEventListener("click",() => { Object.assign(map,{zoom:1,x:0,y:0}); $("#search-area").hidden = true; $("#map-selection").hidden = true; renderMap(); });
$("#map-layer").addEventListener("click",(event) => {
  const active = $("#map-panel").classList.toggle("satellite-style"); event.currentTarget.setAttribute("aria-pressed",String(active)); event.currentTarget.textContent = active ? "Map style" : "Satellite style";
});
$("#map-fullscreen").addEventListener("click",() => {
  const active = document.body.classList.toggle("expanded-map"); $("#map-fullscreen").setAttribute("aria-pressed",String(active)); $("#map-fullscreen").setAttribute("aria-label",active ? "Restore map size" : "Expand map"); mapLock(); renderMap();
});
$("#draw-button").addEventListener("click",() => {
  setView("map"); drawing = !drawing; $("#map-selection").hidden = true; renderMap(); $("#map-panel").scrollIntoView({block:"center"}); $("#map-canvas").focus({preventScroll:true});
});
function selectArea(area) { state.area = area; state.page = 1; drawing = false; $("#search-area").hidden = true; $("#map-selection").hidden = true; render(); }
function clearArea() { state.area = null; drawing = false; render(); }
$("#clear-area").addEventListener("click",clearArea);
$("#search-area").addEventListener("click",() => selectArea(viewBox()));
function worldPoint(event,box=viewBox()) {
  const rect = $("#map-canvas").getBoundingClientRect();
  return {x:box.x+(event.clientX-rect.left)/rect.width*box.w,y:box.y+(event.clientY-rect.top)/rect.height*box.h};
}
$("#map-canvas").addEventListener("pointerdown",(event) => {
  if (event.target.closest("button")) return;
  event.preventDefault();
  drag = {clientX:event.clientX,clientY:event.clientY,box:viewBox(),origin:worldPoint(event),draw:drawing};
  $("#map-canvas").setPointerCapture(event.pointerId); $("#map-selection").hidden = true; $("#pin-tooltip").hidden = true;
});
$("#map-canvas").addEventListener("pointermove",(event) => {
  if (!drag) return;
  const point = worldPoint(event,drag.box);
  if (drag.draw) {
    const rect = {x:Math.min(point.x,drag.origin.x),y:Math.min(point.y,drag.origin.y),width:Math.abs(point.x-drag.origin.x),height:Math.abs(point.y-drag.origin.y)};
    $("#drawn-area").removeAttribute("hidden");
    for (const [key,value] of Object.entries(rect)) $("#drawn-area").setAttribute(key,String(value));
  } else {
    map.x = drag.box.x+drag.origin.x-point.x; map.y = drag.box.y+drag.origin.y-point.y;
    $("#search-area").hidden = false; renderMap();
  }
});
$("#map-canvas").addEventListener("pointerup",(event) => {
  if (!drag) return;
  if (drag.draw) {
    const point = worldPoint(event,drag.box);
    if (Math.abs(point.x-drag.origin.x) > 15 && Math.abs(point.y-drag.origin.y) > 15) selectArea({x:Math.min(point.x,drag.origin.x),y:Math.min(point.y,drag.origin.y),w:Math.abs(point.x-drag.origin.x),h:Math.abs(point.y-drag.origin.y)});
    else renderMap();
  }
  drag = null;
});
$("#map-canvas").addEventListener("pointercancel",() => { drag = null; renderMap(); });
$("#map-canvas").addEventListener("keydown",(event) => {
  if (event.target.closest("button")) return;
  const move = {"ArrowLeft":[-60,0],"ArrowRight":[60,0],"ArrowUp":[0,-60],"ArrowDown":[0,60]}[event.key];
  if (move) { event.preventDefault(); map.x += move[0]/map.zoom; map.y += move[1]/map.zoom; $("#search-area").hidden = false; renderMap(); }
  if (event.key === "Enter" && drawing) { event.preventDefault(); selectArea(viewBox()); }
});
function pinTooltip(button) {
  const property = properties.find((item) => item.id === button.dataset.pin);
  if (!property) return;
  $("#pin-tooltip").textContent = `${property.name} · ${priceText(property)} · ${number(property.size)} SF`; $("#pin-tooltip").hidden = false;
}
$("#map-pins").addEventListener("pointerover",(event) => { const button = event.target.closest("[data-pin]"); if (button) pinTooltip(button); });
$("#map-pins").addEventListener("pointerout",() => { $("#pin-tooltip").hidden = true; });
$("#map-pins").addEventListener("focusin",(event) => { const button = event.target.closest("[data-pin]"); if (button) pinTooltip(button); });
$("#map-pins").addEventListener("focusout",() => { $("#pin-tooltip").hidden = true; });
document.addEventListener("keydown",(event) => {
  if (event.key !== "Escape" || document.querySelector("dialog[open]")) return;
  if (drawing) { drawing = false; renderMap(); }
  else if (document.body.classList.contains("expanded-map")) { document.body.classList.remove("expanded-map"); mapLock(); $("#map-fullscreen").setAttribute("aria-pressed","false"); $("#map-fullscreen").setAttribute("aria-label","Expand map"); $("#map-fullscreen").focus(); }
  else if (narrow.matches && state.view === "map") { setView("grid"); $(".mobile-bottom [data-view=map]").focus(); }
});
document.addEventListener("click",(event) => {
  const button = event.target.closest("[data-clear],[data-filters],[data-view],[data-page],[data-save],[data-details],[data-tour],[data-form],[data-info],[data-property],[data-market],[data-broker],[data-pin],[data-cluster]");
  if (!button) return;
  if (button.closest("#mobile-nav") && !button.matches("a")) nav.close();
  if (button.hasAttribute("data-clear")) { resetSearch(); if (button.closest("footer")) $("#results").scrollIntoView(); }
  else if (button.hasAttribute("data-filters")) { $("#filter-dialog").showModal(); }
  else if (button.dataset.view) { const wasMap = state.view === "map"; setView(button.dataset.view); if (wasMap && button.dataset.view !== "map") (narrow.matches ? $(".mobile-bottom [data-view=map]") : $('.view-toggle [data-view=grid]')).focus(); }
  else if (button.dataset.page) { state.page = Number(button.dataset.page); render(); }
  else if (button.dataset.save) {
    const id = button.dataset.save; state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id); render(); $(`[data-save="${id}"]`)?.focus({preventScroll:true});
  }
  else if (button.dataset.details) details(button.dataset.details);
  else if (button.dataset.tour) localForm("tour",button.dataset.tour);
  else if (button.dataset.form) localForm(button.dataset.form);
  else if (button.dataset.property) { resetSearch(); state.type = button.dataset.property; $("#search-type").value = state.type; render(); $("#results").scrollIntoView(); }
  else if (button.dataset.market) { resetSearch(); state.query = button.dataset.market; $("#location").value = state.query; render(); $("#results").scrollIntoView(); }
  else if (button.dataset.broker !== undefined) openDialog(`Connect with ${brokers[Number(button.dataset.broker)].name}`, "<p>This is a fictional broker profile with a stock portrait. The supplied email uses an unrelated real-world domain; this page sends no email or calls. Individual phone numbers were not provided.</p><p>Use the requirement form to create a browser-only preview of your property needs. No real broker will receive it.</p><a class='button navy' href='#contact' id='broker-requirements'>Explore Requirement Form</a>");
  else if (button.dataset.pin) {
    const property = properties.find((item) => item.id === button.dataset.pin);
    $("#pin-tooltip").hidden = true;
    $("#map-selection").innerHTML = `<button type="button" class="icon-button" id="close-selection" aria-label="Close selected property">${icon("close")}</button><h3>${property.name}</h3><p>${priceText(property)} · ${number(property.size)} SF</p><p>${property.address}</p><button type="button" class="text-link" data-details="${property.id}">View Details ${icon("right")}</button>`;
    $("#map-selection").hidden = false; $("#close-selection").addEventListener("click",() => { $("#map-selection").hidden = true; $(`[data-pin="${property.id}"]`)?.focus(); });
  }
  else if (button.dataset.cluster) { const [x,y] = button.dataset.cluster.split(",").map(Number); changeZoom(2,{x,y}); }
  else if (button.dataset.info) {
    const key = button.dataset.info;
    const messages = {
      "About": "Vanguard Commercial is a fictional commercial-property platform concept for brokers, tenants and investors. Only the original three Austin records and one separate featured opportunity are supplied; the 2,400+, 35-market and 248-result claims are original example copy, not a real database.",
      "Services": "Explore the concept's Tenant Representation, Landlord Leasing, Investment Sales, Property Management and Consulting. These are service descriptions, not an actual brokerage engagement. The local requirement form previews your needs without submission.",
      "Sign In": "This independent static demo has no account provider or authentication service. Saved-property hearts exist only in page memory, clear on reload and collect no passwords. No account is created or accessed.",
      "Phone": "The original vanity contact is 1-800-VANGUARD. It is an unverified example, not a verified callable number. Contact actions stay local; no call or message is placed.",
      "Careers": "No verified employer, vacancies or hiring contact were supplied. This fictional concept collects no applications or documents.",
      "Press": "There are no verified news articles, endorsements or media contacts. Photography and icon licenses are preserved with the source assets; stock people and buildings are illustrative.",
      "Privacy": "All search, saved items, map interactions and form previews stay in this page's memory. There are no cookies, analytics, local/session storage or submission endpoints. Contact fields clear after a preview. Closing a dialog removes its temporary content; a new requirement clears the main form preview. Normal local asset GET requests reach the host.",
      "Terms": "This fictional concept is not a listing agreement, property offer, investment recommendation or brokerage service. Independently confirm prices, rights, availability, certifications and legal terms. No tour, search alert or listing is created.",
      "Licensing": "Original supplied example: Texas Real Estate Commission — License #987654. It has not been verified and does not establish that this fictional brokerage or named people are licensed. Consult official records before relying on any brokerage.",
    };
    const serviceText = "This is an illustrative brokerage service, not an actual engagement, quote or advisory relationship. Explore the local requirement form to preview a brief without sending data. No verified provider or service terms were supplied.";
    openDialog(key,messages[key] ? `<p>${messages[key]}</p>` : `<p>${serviceText}</p>`);
  }
});
document.addEventListener("click",(event) => { if (event.target.closest("#broker-requirements")) info.close(); });
document.addEventListener("keydown",(event) => {
  const strip = event.target.closest(".photo-strip");
  if (strip && ["ArrowLeft","ArrowRight"].includes(event.key)) { event.preventDefault(); strip.scrollBy({left:strip.clientWidth*(event.key === "ArrowRight" ? 1 : -1),behavior:"instant"}); }
});
state.filters = readFilters();
render();
