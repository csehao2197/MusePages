import { content, slug } from "./content.js";

const $ = (selector) => document.querySelector(selector);
const ui = content.ui;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const paths =
{
    Bookmark: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    RotateCcw: '<path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8"/><path d="M3 3v5h5"/>',
    ArrowRight: '<path d="M5 12h14m-7-7 7 7-7 7"/>'
};
function icon(name)
{
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
function animate(element, frames, duration = 200, delay = 0)
{
    if (reduced.matches)
    {
        element.animate([{ opacity: .6 }, { opacity: 1 }], { duration: 100 });
        return;
    }
    element.animate(frames, { duration, delay, easing: "ease-out", fill: "backwards" });
}
function read(key, validate, fallback)
{
    try
    {
        const value = JSON.parse(localStorage.getItem(slug + "-" + key));
        return validate(value) ? value : fallback;
    }
    catch
    {
        return fallback;
    }
}
function save(key, value)
{
    try
    {
        localStorage.setItem(slug + "-" + key, JSON.stringify(value));
        $("#storage-warning").textContent = "";
        return true;
    }
    catch
    {
        $("#storage-warning").textContent = ui.storageWarning;
        return false;
    }
}
const programIds = content.programs.map((item) => item[0].toLowerCase().replace(/[^a-z0-9]+/g, "-"));
const shortlist = new Set(read("shortlist", (value) => Array.isArray(value) && value.every((id) => typeof id === "string" && programIds.includes(id)), []));
const active = { Level: "All", Area: "All", Format: "All" };
let shortlistOnly = false;
let selection = { day: "Monday", time: "9:30", type: "Campus tour" };
const validRequest = (value) => value && typeof value === "object" && content.visit.days.includes(value.day) &&
    content.visit.times.includes(value.time) && content.visit.types.includes(value.type) &&
    typeof value.name === "string" && value.name.trim().length > 0 && value.name.length <= 120 &&
    typeof value.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
    typeof value.virtual === "boolean";
let request = read("visit-request", validRequest, null);

document.title = content.brand;
const words = content.brand.toUpperCase().split(" ");
document.querySelectorAll(".wordmark").forEach((mark) =>
{
    mark.querySelector("span").textContent = words.slice(0, -1).join(" ");
    mark.querySelector("small").textContent = words.at(-1);
    mark.setAttribute("aria-label", content.brand + ui.home);
});
$("#hero-eyebrow").textContent = ui.admissions + " · " + content.location;
$("#hero-title").textContent = content.hero.title;
$("#hero-description").textContent = content.hero.description;
$("#stats").innerHTML = content.hero.stats.map(([number, label]) => `<div class="stat"><strong>${number}</strong><span>${label}</span></div>`).join("");
$("#address").textContent = content.address;
$("#footer-note").textContent = content.footerNote;
document.querySelectorAll("[data-icon]").forEach((node) => node.innerHTML = icon(node.dataset.icon));

Object.entries(content.filters).forEach(([label, values]) =>
{
    const fieldset = document.createElement("fieldset");
    fieldset.innerHTML = `<legend>${label}</legend><div class="chips">${values.map((value) => `<button class="chip" type="button" aria-pressed="${value === "All"}" data-filter="${label}" data-value="${value}">${value}</button>`).join("")}</div>`;
    $("#filters").append(fieldset);
});
$("#filters").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    active[button.dataset.filter] = button.dataset.value;
    renderPrograms();
});
function resetFilters()
{
    Object.keys(active).forEach((key) => active[key] = "All");
    shortlistOnly = false;
    renderPrograms();
}
$("#reset").addEventListener("click", resetFilters);
$("#shortlist-view").addEventListener("click", () =>
{
    shortlistOnly = !shortlistOnly;
    renderPrograms();
});
function renderPrograms()
{
    document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed", String(active[button.dataset.filter] === button.dataset.value)));
    $("#reset").hidden = !shortlistOnly && Object.values(active).every((value) => value === "All");
    $("#shortlist-view").setAttribute("aria-pressed", String(shortlistOnly));
    $("#shortlist-count").textContent = `${ui.shortlist} (${shortlist.size})`;
    const matches = content.programs.map((program, index) => ({ program, id: programIds[index] })).filter(({ program, id }) =>
        (active.Level === "All" || program[1] === active.Level) &&
        (active.Area === "All" || program[2] === active.Area) &&
        (active.Format === "All" || program[3] === active.Format) && (!shortlistOnly || shortlist.has(id)));
    $("#results-count").textContent = ui.results(matches.length);
    animate($("#results-count"), [{ opacity: .3 }, { opacity: 1 }], 160);
    const grid = $("#program-grid");
    grid.replaceChildren();
    if (!matches.length)
    {
        grid.innerHTML = `<div class="empty"><h3>${ui.emptyTitle}</h3><p>${ui.emptyMessage}</p><button class="button blue" id="empty-reset">${ui.reset}</button></div>`;
        $("#empty-reset").addEventListener("click", resetFilters);
        return;
    }
    matches.forEach(({ program: [name, level, area, format, line], id }, index) =>
    {
        const card = document.createElement("article");
        card.className = "program-card";
        card.innerHTML = `<span class="level">${level}</span><h3>${name}</h3><p>${line}</p><div class="program-meta">${area} · ${format}</div><button class="bookmark" data-id="${id}" aria-pressed="${shortlist.has(id)}" aria-label="${ui.shortlist} ${name}">${icon("Bookmark")}<span>${shortlist.has(id) ? ui.shortlisted : ui.shortlist}</span></button>`;
        grid.append(card);
        animate(card, [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], 200, Math.min(index * 20, 120));
    });
}
$("#program-grid").addEventListener("click", (event) =>
{
    const button = event.target.closest(".bookmark");
    if (!button) return;
    const id = button.dataset.id;
    if (shortlist.has(id)) shortlist.delete(id);
    else shortlist.add(id);
    save("shortlist", [...shortlist]);
    if (shortlistOnly)
    {
        renderPrograms();
        return;
    }
    button.setAttribute("aria-pressed", String(shortlist.has(id)));
    button.querySelector("span").textContent = shortlist.has(id) ? ui.shortlisted : ui.shortlist;
    $("#shortlist-count").textContent = `${ui.shortlist} (${shortlist.size})`;
    animate(button.querySelector("svg"), [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], 180);
});
renderPrograms();
$("#campus-grid").innerHTML = content.campus.map(([file, alt, caption]) => `<figure class="campus-frame reveal"><img src="./images/${file}.webp" alt="${alt}" loading="lazy"><figcaption>${caption}</figcaption></figure>`).join("");
$("#campus-note").textContent = ui.campusNote(content.location);
$("#timeline").innerHTML = content.timeline.map(([title, copy], index) => `<div class="timeline-step reveal"><span class="step-number">0${index + 1}</span><div><h3>${title}</h3><p>${copy}</p></div></div>`).join("");
$("#round-copy").innerHTML = content.rounds.map(([label, text]) => `<div class="round-item"><span class="round-label">${label}</span><p>${text}</p></div>`).join("");
$("#living-labels").innerHTML = content.estimator.living.map((name) => `<span>${name}</span>`).join("");
let numberAnimation = 0;
let currentNet = 27300;
function updateCost(initial = false)
{
    const contribution = Number($("#contribution").value);
    const living = Number($("#living").value);
    const { tuition, books, housing, grant } = content.estimator;
    const sampleGrant = grant(contribution);
    const total = tuition + books + housing[living];
    const net = total - sampleGrant;
    $("#contribution-value").textContent = money(contribution);
    $("#contribution").setAttribute("aria-valuetext", money(contribution) + ui.perYear);
    $("#living-value").textContent = content.estimator.living[living];
    $("#living").setAttribute("aria-valuetext", ui.living + content.estimator.living[living].toLowerCase());
    $("#cost-lines").innerHTML = [[ui.costLabels[0], tuition], [ui.costLabels[1], housing[living]], [ui.costLabels[2], books], [content.brand + ui.grant, -sampleGrant]].map(([name, value], index) => `<div class="cost-line ${index === 3 ? "aid" : ""}"><dt>${name}</dt><dd>${money(value)}</dd></div>`).join("");
    [".tuition", ".housing", ".books", ".grant"].forEach((selector, index) => $(selector).style.width = [tuition, housing[living], books, sampleGrant][index] / total * 100 + "%");
    cancelAnimationFrame(numberAnimation);
    $("#net-value").dataset.value = String(net);
    if (initial || reduced.matches)
    {
        currentNet = net;
        $("#net-value").textContent = money(net);
        return;
    }
    const start = performance.now();
    const from = currentNet;
    function frame(now)
    {
        const progress = Math.min(1, (now - start) / 320);
        currentNet = Math.round(from + (net - from) * (1 - (1 - progress) ** 3));
        $("#net-value").textContent = money(currentNet);
        if (progress < 1) numberAnimation = requestAnimationFrame(frame);
    }
    numberAnimation = requestAnimationFrame(frame);
}
$("#contribution").addEventListener("input", () => updateCost());
$("#living").addEventListener("input", () => updateCost());
updateCost(true);

function renderSelections()
{
    [["days", "day", content.visit.days], ["times", "time", content.visit.times], ["types", "type", content.visit.types]].forEach(([id, key, options]) =>
    {
        const container = $("#" + id);
        if (!container.children.length)
        {
            container.innerHTML = options.map((value) => `<button type="button" class="${id === "types" ? "" : "chip"}" data-key="${key}" data-value="${value}" aria-pressed="${selection[key] === value}">${value}</button>`).join("");
            container.addEventListener("click", (event) =>
            {
                const button = event.target.closest("button");
                if (!button) return;
                selection[key] = button.dataset.value;
                renderSelections();
                animate(button, [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], 180);
            });
        }
        container.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.value === selection[key])));
    });
}
function showConfirmation()
{
    $("#visit-form").hidden = true;
    $("#confirmation").hidden = false;
    $("#confirmation h3").textContent = ui.requestSavedTitle;
    $("#confirmation-details").textContent = ui.requestSaved(request);
    $("#virtual").checked = request.virtual;
    animate($("#confirmation"), [{ opacity: 0 }, { opacity: 1 }], 240);
}
$("#visit-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const nameError = !name ? ui.nameRequired : name.length > 120 ? ui.nameLong : "";
    const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : ui.emailInvalid;
    $("#name-error").textContent = nameError;
    $("#email-error").textContent = emailError;
    $("#name").setAttribute("aria-invalid", String(Boolean(nameError)));
    $("#email").setAttribute("aria-invalid", String(Boolean(emailError)));
    if (nameError || emailError)
    {
        $(nameError ? "#name" : "#email").focus();
        return;
    }
    request = { ...selection, name, email, virtual: false };
    const persisted = save("visit-request", request);
    showConfirmation();
    if (!persisted)
    {
        $("#confirmation-details").textContent = ui.requestSelected(request);
        $("#confirmation h3").textContent = ui.requestSelectedTitle;
    }
    $("#confirmation").tabIndex = -1;
    $("#confirmation").focus({ preventScroll: true });
});
$("#change-request").addEventListener("click", () =>
{
    selection = { day: request.day, time: request.time, type: request.type };
    $("#name").value = request.name;
    $("#email").value = request.email;
    $("#confirmation").hidden = true;
    $("#visit-form").hidden = false;
    renderSelections();
    $("#name").focus({ preventScroll: true });
});
$("#virtual").addEventListener("change", () =>
{
    request.virtual = $("#virtual").checked;
    save("visit-request", request);
});
renderSelections();
if (request) showConfirmation();

const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (!entry.isIntersecting) return;
        animate(entry.target, [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }], 480);
        observer.unobserve(entry.target);
    });
}, { threshold: .08 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
animate($("#hero-image"), [{ transform: "scale(1.06)" }, { transform: "scale(1)" }], 900);
document.querySelectorAll(".hero-copy > *, .stats").forEach((element, index) => animate(element, [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], 480, index * 90));
