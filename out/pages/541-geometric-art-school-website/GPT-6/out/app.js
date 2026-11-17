import { school, labels, courses, projects, faculty, sessions, page, artwork } from "./content.js";

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escape = (value) => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
$("#site").innerHTML = page;
const dialog = $("#detail");
const visitForm = $("#visit-form");
const applicationForm = $("#application-form");
let returnFocus;
let workFilter = "All";
let activeProject = 0;
let summaryText = "";
let favorites = new Set();
try
{
    const stored = JSON.parse(localStorage.getItem("formhouse-work") || "[]");
    if (Array.isArray(stored))
    {
        favorites = new Set(stored.filter(value => Number.isInteger(value) && projects[value]));
    }
}
catch
{
    favorites = new Set();
}

function dialogTop(title)
{
    return `<div class="dialog-top"><h2 id="dialog-title">${escape(title)}</h2><button class="button" data-close>${labels.close} ×</button></div>`;
}

function openDialog(markup)
{
    if (!dialog.open)
    {
        returnFocus = document.activeElement;
    }
    $("#dialog-content").innerHTML = markup;
    if (!dialog.open)
    {
        dialog.showModal();
        document.body.classList.add("dialog-open");
    }
    dialog.scrollTop = 0;
    $("[data-close]", dialog).focus();
}

function closeDialog()
{
    dialog.close();
}

dialog.addEventListener("close", () =>
{
    document.body.classList.remove("dialog-open");
    if (returnFocus?.isConnected)
    {
        returnFocus.focus({ preventScroll: true });
    }
    else
    {
        $("#work-count").tabIndex = -1;
        $("#work-count").focus({ preventScroll: true });
    }
});
dialog.addEventListener("click", event =>
{
    if (event.target === dialog)
    {
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)
        {
            closeDialog();
        }
    }
    if (event.target.closest("[data-close]"))
    {
        closeDialog();
    }
    const choose = event.target.closest("[data-choose]");
    if (choose)
    {
        applicationForm.elements.course.value = choose.dataset.choose;
        closeDialog();
        $("#application").scrollIntoView();
        applicationForm.elements.course.focus({ preventScroll: true });
    }
    const cycle = event.target.closest("[data-cycle]");
    if (cycle)
    {
        cycleProject(Number(cycle.dataset.cycle));
    }
    const save = event.target.closest("[data-save]");
    if (save)
    {
        toggleFavorite(Number(save.dataset.save));
        renderProject(activeProject);
    }
    if (event.target.closest("[data-download]"))
    {
        const url = URL.createObjectURL(new Blob([summaryText], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = labels.downloadName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    if (event.target.closest("[data-clear-application]"))
    {
        closeDialog();
        applicationForm.reset();
        applicationForm.elements.name.focus();
    }
});
dialog.addEventListener("keydown", event =>
{
    if (event.key === "Tab")
    {
        const items = $$("button, a[href], input, select, textarea", dialog).filter(item => !item.disabled && item.getClientRects().length);
        if (event.shiftKey && document.activeElement === items[0])
        {
            event.preventDefault();
            items.at(-1).focus();
        }
        else if (!event.shiftKey && document.activeElement === items.at(-1))
        {
            event.preventDefault();
            items[0].focus();
        }
    }
    if ($("[data-cycle]", dialog) && ["ArrowLeft", "ArrowRight"].includes(event.key))
    {
        event.preventDefault();
        cycleProject(event.key === "ArrowRight" ? 1 : -1);
    }
});

function renderCourses()
{
    const discipline = $("#discipline").value;
    const format = $("#format").value;
    const matching = courses.filter(course => (discipline === "All" || course.discipline === discipline) && (format === "All" || course.format === format));
    $("#course-count").textContent = labels.count(matching.length, labels.courseUnit);
    $("#course-grid").innerHTML = matching.length ? matching.map(course => `
        <article class="course-card"><div class="course-banner ${course.discipline}"><span>${course.discipline} / ${course.format}</span><span class="category-shape" aria-hidden="true"></span></div><div class="course-body"><h3>${course.title}</h3><p>${course.output}</p><p>${course.schedule}</p><div class="course-meta"><span>${course.duration} · ${course.level}</span><b>${course.price}</b></div><button class="button" data-outline="${course.id}">${labels.outline} <span aria-hidden="true">↗</span></button></div></article>`).join("") : `<p class="empty">${labels.noCourses}</p>`;
}

function showOutline(id)
{
    const course = courses.find(item => item.id === id);
    openDialog(`${dialogTop(course.title)}<p class="eyebrow">${course.discipline} / ${course.format} / ${course.level}</p><p>${course.duration} · ${course.schedule} · ${course.price}</p><h3>${course.output}</h3><h3>${labels.modules}</h3><ol>${course.modules.map(module => `<li>${module}</li>`).join("")}</ol><h3>${labels.materials}</h3><p>${course.materials}</p><h3>${labels.process}</h3><p>${labels.assessment}</p><div class="dialog-actions"><button class="button blue" data-choose="${course.id}">${labels.choose} ↗</button></div>`);
}

$("#discipline").addEventListener("change", renderCourses);
$("#format").addEventListener("change", renderCourses);
$("#course-reset").addEventListener("click", () =>
{
    $("#discipline").value = "All";
    $("#format").value = "All";
    renderCourses();
});
$("#course-grid").addEventListener("click", event =>
{
    const button = event.target.closest("[data-outline]");
    if (button)
    {
        showOutline(button.dataset.outline);
    }
});

function filteredProjects()
{
    return projects.map((project, index) => index).filter(index => (workFilter === "All" || projects[index].medium === workFilter) && (!$("#saved-only").checked || favorites.has(index)));
}

function renderWork()
{
    const matching = filteredProjects();
    $("#work-count").textContent = labels.count(matching.length, labels.workUnit);
    $("#work-grid").innerHTML = matching.length ? matching.map(index =>
    {
        const project = projects[index];
        return `<article class="work-tile"><button class="work-open" data-project="${index}" aria-label="${escape(project.title)} — ${project.maker}">${artwork(index)}<span class="work-caption"><b>${project.title}</b><small>${project.maker} / ${project.medium}</small><small>${project.material}</small></span><span class="process-label">${labels.process} ↗</span></button><button class="favorite text-button" data-save="${index}" aria-pressed="${favorites.has(index)}">${favorites.has(index) ? labels.unsave : labels.save}</button></article>`;
    }).join("") : `<p class="empty">${labels.noWork}</p>`;
}

function toggleFavorite(index)
{
    favorites.has(index) ? favorites.delete(index) : favorites.add(index);
    try
    {
        localStorage.setItem("formhouse-work", JSON.stringify([...favorites]));
    }
    catch
    {
        $("#work-count").textContent = labels.storageUnavailable;
    }
    renderWork();
}

function renderProject(index)
{
    activeProject = index;
    const project = projects[index];
    openDialog(`${dialogTop(project.title)}<div class="project-detail">${artwork(index)}<div><p class="eyebrow">${project.maker} / ${project.medium}</p><p>${project.material}</p><h3>${labels.process}</h3><p>${project.note}</p><ul>${project.decisions.map(decision => `<li>${decision}</li>`).join("")}</ul></div></div><div class="dialog-actions"><button class="button" data-cycle="-1">← ${labels.previous}</button><button class="button" data-cycle="1">${labels.next} →</button><button class="button blue" data-save="${index}" aria-pressed="${favorites.has(index)}">${favorites.has(index) ? labels.unsave : labels.save}</button></div>`);
}

function cycleProject(direction)
{
    const matching = filteredProjects();
    if (!matching.length)
    {
        closeDialog();
        return;
    }
    const position = matching.indexOf(activeProject);
    renderProject(matching[(Math.max(0, position) + direction + matching.length) % matching.length]);
}

$(".work-tabs").addEventListener("click", event =>
{
    const button = event.target.closest("[data-work-filter]");
    if (button)
    {
        workFilter = button.dataset.workFilter;
        $$("[data-work-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
        renderWork();
    }
});
$("#saved-only").addEventListener("change", renderWork);
$("#clear-favorites").addEventListener("click", () =>
{
    favorites.clear();
    try
    {
        localStorage.removeItem("formhouse-work");
    }
    catch
    {
        $("#work-count").textContent = labels.storageUnavailable;
    }
    renderWork();
});
$("#work-grid").addEventListener("click", event =>
{
    const project = event.target.closest("[data-project]");
    const save = event.target.closest("[data-save]");
    if (project)
    {
        renderProject(Number(project.dataset.project));
    }
    if (save)
    {
        const index = Number(save.dataset.save);
        toggleFavorite(index);
        $(`[data-save="${index}"]`, $("#work-grid"))?.focus({ preventScroll: true });
    }
});
$("#faculty").addEventListener("click", event =>
{
    const button = event.target.closest("[data-faculty]");
    if (button)
    {
        const person = faculty[Number(button.dataset.faculty)];
        const course = courses.find(item => item.id === person.course);
        openDialog(`${dialogTop(person.name)}<p class="eyebrow">${person.role}</p><p>${person.bio}</p><h3>${labels.practice}</h3><p>${person.practice}</p><h3>${labels.teaching}</h3><p>${person.exercise}</p><div class="dialog-actions"><button class="button blue" data-choose="${course.id}">${labels.choose}: ${course.title} ↗</button></div>`);
    }
});

const menu = $(".menu-button");
function closeMenu(restore = false)
{
    $("#nav").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    if (restore)
    {
        menu.focus();
    }
}
menu.addEventListener("click", () =>
{
    const opened = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(opened));
    $("#nav").classList.toggle("open", opened);
});
$("#nav").addEventListener("click", event =>
{
    if (event.target.closest("a"))
    {
        const target = $(event.target.closest("a").hash);
        closeMenu();
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
    }
});
document.addEventListener("keydown", event =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        closeMenu(true);
    }
});

function selectedSessions()
{
    return $$('input[name="session"]:checked', visitForm).map(input => sessions[Number(input.value)]);
}
function updateItinerary()
{
    const selected = selectedSessions();
    $("#itinerary").textContent = selected.length ? labels.selected(selected.map(session => `${session.time} ${session.title}`)) : labels.itineraryEmpty;
    $("#session-error").textContent = "";
}
visitForm.addEventListener("change", updateItinerary);
visitForm.addEventListener("reset", () =>
{
    setTimeout(() =>
    {
        updateItinerary();
        $(".form-error", visitForm).textContent = "";
        $$("[aria-invalid]", visitForm).forEach(input => input.removeAttribute("aria-invalid"));
    }, 0);
});

function fail(form, input, message)
{
    $(".form-error", form).textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return false;
}

function validateIdentity(form)
{
    $$("[aria-invalid]", form).forEach(input => input.removeAttribute("aria-invalid"));
    $(".form-error", form).textContent = "";
    if (!form.elements.name.value.trim())
    {
        return fail(form, form.elements.name, labels.nameError);
    }
    if (!form.elements.email.value.trim() || !form.elements.email.validity.valid)
    {
        return fail(form, form.elements.email, labels.emailError);
    }
    return true;
}

function summaryRows(rows)
{
    return `<dl class="summary-list">${rows.map(([key, value]) => `<dt>${escape(key)}</dt><dd>${escape(value)}</dd>`).join("")}</dl>`;
}
visitForm.addEventListener("submit", event =>
{
    event.preventDefault();
    if (!validateIdentity(visitForm))
    {
        return;
    }
    const chosen = selectedSessions();
    if (!chosen.length)
    {
        $("#session-error").textContent = labels.sessionError;
        fail(visitForm, $('input[name="session"]', visitForm), labels.sessionError);
        return;
    }
    const rows = [[labels.name, visitForm.elements.name.value.trim()], [labels.email, visitForm.elements.email.value.trim()], [labels.group, visitForm.elements.group.value], [labels.access, visitForm.elements.access.value || labels.none]];
    openDialog(`${dialogTop(labels.visitTitle)}<p class="helper">${labels.visitNote}</p><p>${school.brand} / ${school.address}, ${school.city}</p><ul>${chosen.map(session => `<li>Saturday · ${session.time} · ${session.title}</li>`).join("")}</ul>${summaryRows(rows)}<button class="button blue" data-close>${labels.edit}</button>`);
});

function updateCharacterCount()
{
    $("#character-count").textContent = labels.characters(applicationForm.elements.motivation.value.length);
}
applicationForm.elements.motivation.addEventListener("input", updateCharacterCount);
applicationForm.addEventListener("input", event =>
{
    event.target.removeAttribute("aria-invalid");
    $(".form-error", applicationForm).textContent = "";
});
applicationForm.addEventListener("submit", event =>
{
    event.preventDefault();
    if (!validateIdentity(applicationForm))
    {
        return;
    }
    const elements = applicationForm.elements;
    const motivation = elements.motivation.value.trim();
    if (motivation.length < 60 || motivation.length > 600)
    {
        fail(applicationForm, elements.motivation, labels.motivationError);
        return;
    }
    if (elements.portfolio.value.trim())
    {
        try
        {
            const url = new URL(elements.portfolio.value.trim());
            if (!["http:", "https:"].includes(url.protocol))
            {
                throw Error(labels.urlError);
            }
        }
        catch
        {
            fail(applicationForm, elements.portfolio, labels.urlError);
            return;
        }
    }
    if (!elements.consent.checked)
    {
        fail(applicationForm, elements.consent, labels.consentError);
        return;
    }
    const course = courses.find(item => item.id === elements.course.value);
    const rows = [[labels.name, elements.name.value.trim()], [labels.email, elements.email.value.trim()], [labels.course, `${course.title} · ${course.price} · ${course.duration}`], [labels.experience, elements.experience.value], [labels.motivation, motivation], [labels.portfolio, elements.portfolio.value.trim() || labels.none]];
    summaryText = `${school.brand}\n${labels.applicationTitle}\n\n${rows.map(([key, value]) => `${key}: ${value}`).join("\n\n")}\n\n${labels.applicationNote}\n`;
    openDialog(`${dialogTop(labels.applicationTitle)}<p class="helper">${labels.applicationNote}</p>${summaryRows(rows)}<div class="dialog-actions"><button class="button" data-close>${labels.edit}</button><button class="button" data-clear-application>${labels.clear}</button><button class="button blue" data-download>${labels.download}</button></div>`);
});
applicationForm.addEventListener("reset", () =>
{
    setTimeout(() =>
    {
        updateCharacterCount();
        $$("[aria-invalid]", applicationForm).forEach(input => input.removeAttribute("aria-invalid"));
        $(".form-error", applicationForm).textContent = "";
        $("#draft-status").textContent = labels.applicationCleared;
    }, 0);
});
$("#save-draft").addEventListener("click", () =>
{
    const draft = {};
    ["name", "email", "course", "experience", "motivation", "portfolio"].forEach(key => draft[key] = applicationForm.elements[key].value);
    draft.consent = applicationForm.elements.consent.checked;
    try
    {
        localStorage.setItem("formhouse-draft", JSON.stringify(draft));
        $("#draft-status").textContent = labels.draftSaved;
    }
    catch
    {
        $("#draft-status").textContent = labels.storageUnavailable;
    }
});
$("#clear-draft").addEventListener("click", () =>
{
    try
    {
        localStorage.removeItem("formhouse-draft");
        $("#draft-status").textContent = labels.draftCleared;
    }
    catch
    {
        $("#draft-status").textContent = labels.storageUnavailable;
    }
});
try
{
    const draft = JSON.parse(localStorage.getItem("formhouse-draft") || "null");
    if (draft && typeof draft === "object")
    {
        ["name", "email", "motivation", "portfolio"].forEach(key =>
        {
            if (typeof draft[key] === "string")
            {
                applicationForm.elements[key].value = draft[key].slice(0, key === "motivation" ? 600 : 2000);
            }
        });
        if (courses.some(course => course.id === draft.course))
        {
            applicationForm.elements.course.value = draft.course;
        }
        if (["Beginner", "Developing", "Returning"].includes(draft.experience))
        {
            applicationForm.elements.experience.value = draft.experience;
        }
        applicationForm.elements.consent.checked = draft.consent === true;
        $("#draft-status").textContent = labels.draftLoaded;
    }
}
catch
{
    $("#draft-status").textContent = labels.storageUnavailable;
}
renderCourses();
renderWork();
updateCharacterCount();
