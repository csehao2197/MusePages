import { content as c, brandSlug, telephone } from "./content.js";

const $ = (selector) => document.querySelector(selector);
document.title = c.brand;
const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
{
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
});
const key = (name) => `${brandSlug}-${name}`;

function read(name, validate, fallback)
{
    try
    {
        const value = JSON.parse(localStorage.getItem(key(name)));
        return validate(value) ? value : fallback;
    }
    catch
    {
        return fallback;
    }
}

function save(name, value)
{
    try
    {
        localStorage.setItem(key(name), JSON.stringify(value));
        return true;
    }
    catch
    {
        return false;
    }
}

// Instrument glyphs are original line artwork; utility paths follow Lucide's ISC icons.
const paths =
{
    piano: '<rect x="4" y="6" width="24" height="21" rx="2"/><path d="M10 6v21m6-21v21m6-21v21M7 6v10h6V6m6 0v10h6V6"/>',
    guitar: '<path d="m21 5 6 2-8 11c6 8-5 15-11 9-6-6 1-17 9-11Z"/><path d="m11 23 12-16m0-3 5 4"/><circle cx="13" cy="21" r="2"/>',
    violin: '<path d="m19 5 4 1-5 8c5 2 5 6 1 6 4 4 2 10-3 10-8 0-9-6-5-10-4 0-4-4 1-6Z"/><path d="m15 25 6-18m6-1-4 24m-10-8h7"/>',
    cello: '<path d="m17 3 4 1-4 10c6 2 6 5 2 7 6 5 3 9-4 9-8 0-10-5-4-9-5-2-4-5 1-7Z"/><path d="m15 30-1 2m1-6 4-19m7-2-4 27m-10-7h7"/>',
    drums: '<ellipse cx="16" cy="13" rx="12" ry="4"/><path d="M4 13v11c0 5 24 5 24 0V13M8 15v12m8-10v12m8-14v12M6 3l19 7m1-7L8 10"/>',
    voice: '<rect width="6" height="12" x="9" y="2" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9Z"/>',
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    timer: '<path d="M10 2h4m-2 12v-4m7-7 1-1"/><circle cx="12" cy="14" r="8"/>',
    calendar: '<path d="M8 2v4m8-4v4M3 10h18m-12 6 2 2 4-4"/><rect x="3" y="4" width="18" height="18" rx="2"/>',
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/><circle cx="9" cy="7" r="4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>',
    check: '<circle cx="12" cy="12" r="10"/><path d="m8 12 3 3 5-6"/>'
};
const icon = (name) => `<svg class="icon" aria-hidden="true" viewBox="0 0 ${["piano", "guitar", "violin", "cello", "drums"].includes(name) ? "32 32" : "24 24"}">${paths[name]}</svg>`;
const logo = () => `<a class="logo" href="#top"><img src="./favicon.svg" alt=""><span>${c.brand}</span></a>`;
const links = () => c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
const heading = (name, centered = false) => `<div class="section-head reveal ${centered ? "center-head" : ""}"><p class="eyebrow">${c.sections[name][0]}</p><h2>${c.sections[name][1]}</h2>${c.sections[name][2] ? `<p>${c.sections[name][2]}</p>` : ""}</div>`;

$("#app").innerHTML = `
    <a href="#main" class="skip">${c.footer.skip}</a>
    <header id="top">
        <div class="header-inner">
            ${logo()}
            <nav id="navigation" aria-label="${c.footer.school}">${links()}</nav>
            <div class="header-actions">
                <a class="phone" href="${telephone}" aria-label="${c.footer.call} ${c.phone}">${icon("phone")}<span>${c.phone}</span></a>
                <a class="btn" href="#trial">${c.footer.book}</a>
                <button class="menu" aria-controls="navigation" aria-expanded="false" aria-label="${c.footer.menu}">${icon("menu")}</button>
            </div>
        </div>
    </header>
    <main id="main">
        <section class="hero">
            <div class="wrap hero-grid">
                <div class="reveal">
                    <p class="eyebrow">${c.hero.eyebrow}</p>
                    <h1>${c.hero.title}</h1>
                    <p class="hero-description">${c.hero.description}</p>
                    <div class="hero-ctas"><a href="#finder" class="btn">${c.hero.primary}${icon("arrow")}</a><a href="#pricing" class="btn outline">${c.hero.secondary}</a></div>
                    <div class="hero-chips">${c.hero.chips.map((chip) => `<span>${chip}</span>`).join("")}</div>
                </div>
                <div class="hero-image">
                    <img src="${c.hero.photo}" alt="${c.hero.alt}" width="800" height="600" fetchpriority="high">
                    <div class="lesson-board">${icon("music")}<div><strong>${c.hero.board[0]}</strong><p>${c.hero.board[1]}</p><small>${c.hero.board[2]}</small></div></div>
                    <p class="photo-caption">${c.hero.caption}</p>
                </div>
            </div>
        </section>
        <section id="instruments" class="section white">
            <div class="wrap">
                ${heading("instruments")}
                <div class="instrument-grid">${c.instruments.map((instrument) => `
                    <article class="instrument-card reveal">
                        ${icon(instrument.glyph)}<div><h3>${instrument.name}</h3><p>${instrument.description}</p>
                        <button class="text-link" data-instrument="${instrument.match || instrument.name}">${c.finder.meet} →</button></div>
                    </article>`).join("")}</div>
            </div>
        </section>
        <section id="finder" class="section dark">
            <div class="wrap">
                ${heading("finder")}
                <div class="finder-grid">
                    <div class="finder-controls">
                        ${Object.entries(c.finder.options).map(([name, options]) => `
                            <fieldset><legend>${c.finder.labels[name]}</legend><div class="chips">
                                ${options.map((value) => `<button class="chip filter" data-filter="${name}" data-value="${value}" aria-pressed="false">${value}</button>`).join("")}
                            </div></fieldset>`).join("")}
                        <small>${c.finder.saved}</small>
                    </div>
                    <div><div class="results-label"><span id="match-count"></span><span>${c.finder.sample}</span></div><div id="matches" aria-live="polite" aria-atomic="true"></div></div>
                </div>
            </div>
        </section>
        <section id="pricing" class="section">
            <div class="wrap">
                ${heading("pricing")}
                <div class="price-grid">${c.pricing.tiers.map(([minutes, price, description], index) => `
                    <article class="price-card ${index === 1 ? "chosen" : ""}">${index === 1 ? `<span class="chosen-tag">${c.pricing.chosen}</span>` : ""}
                    <h3>${minutes} ${c.pricing.minutes}</h3><div class="price"><strong>$${price}</strong> <span>${c.pricing.unit}</span></div><p>${description}</p></article>`).join("")}</div>
                <p class="price-note">${c.pricing.note}</p>
            </div>
        </section>
        <section id="practice" class="section white">
            <div class="wrap">
                ${heading("practice", true)}
                <div class="tracker">
                    <div class="tracker-top"><p class="tracker-total" aria-live="polite"><strong id="total">0</strong> <span>${c.practice.total}</span></p>${icon("music")}</div>
                    <p class="tracker-instructions">${c.practice.instructions}</p>
                    <div class="week">${c.practice.days.map((day, index) => `<div><button class="day" data-day="${index}" data-value="0" aria-label="${day}: 0 ${c.practice.minutes}">—</button><p class="day-label">${day}</p></div>`).join("")}</div>
                    <div class="goal-label"><span>${c.practice.goal}</span><span id="goal-percent">0%</span></div>
                    <div class="goal" role="progressbar" aria-label="${c.practice.goal}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
                    <p class="streak">${icon("timer")}<span id="streak"></span></p>
                    <button class="text-link" id="reset-week">${c.practice.reset} →</button>
                    <p id="practice-message" class="form-note" role="status"></p>
                    <p class="tracker-local">${c.practice.local}</p>
                </div>
                <p class="encouragement">${c.practice.encouragement}</p>
            </div>
        </section>
        <section id="events" class="section dark">
            <div class="wrap">
                ${heading("events")}
                <div class="events-grid"><img src="${c.events.photo}" alt="${c.events.alt}" width="800" height="600" loading="lazy">
                    <div>${c.events.rows.map(([title, description, glyph]) => `<article class="event reveal">${icon(glyph)}<div><h3>${title}</h3><p>${description}</p></div></article>`).join("")}<p class="events-note">${c.events.note}</p></div>
                </div>
            </div>
        </section>
        <section id="teachers" class="section">
            <div class="wrap">
                ${heading("teachers")}
                <div class="teacher-grid">${c.teachers.map((teacher) => `<article class="teacher-card reveal"><img src="${teacher.photo}" alt="${teacher.alt}" width="600" height="800" loading="lazy"><h3>${teacher.name}</h3><p class="teacher-instruments">${teacher.instruments.join(" · ")}</p><p class="teacher-bio">${teacher.biography}</p><p class="teacher-quote">“${teacher.quote}”</p></article>`).join("")}</div>
            </div>
        </section>
        <section id="reviews" class="section white">
            <div class="wrap">
                ${heading("reviews")}
                <div class="review-grid">${c.reviews.rows.map(([quote, attribution]) => `<article class="review"><div class="stars" aria-label="${c.reviews.stars}">${icon("star").repeat(5)}</div><blockquote>“${quote}”</blockquote><p>${attribution}</p></article>`).join("")}</div>
                <p class="review-note">${c.reviews.note}</p>
            </div>
        </section>
        <section id="trial" class="section dark">
            <div class="wrap">
                ${heading("trial", true)}
                <div class="trial-panel" id="trial-panel"></div>
            </div>
        </section>
    </main>
    <footer><div class="wrap footer-grid">
        <div>${logo()}<p>${c.footer.address}</p><p><a href="${telephone}">${c.phone}</a></p><p>${c.footer.hours}</p></div>
        <div><h3>${c.footer.school}</h3><nav aria-label="${c.footer.school} footer">${links()}</nav></div>
        <div><h3>${c.footer.small}</h3><p>${c.footer.sample}</p><a class="credit" href="${c.footer.creditUrl}">${c.footer.credit}</a></div>
    </div></footer>
    <div class="sticky"><a class="btn" href="${telephone}">${icon("phone")}${c.footer.call}</a><a class="btn outline" href="#trial">${c.footer.trial}${icon("arrow")}</a></div>`;

const defaultFinder = { instrument: "Piano", age: "Child 6–10", level: "Beginner", format: "Either" };
const validFinder = (value) => value && Object.keys(defaultFinder).every((name) => c.finder.options[name].includes(value[name]));
let finder = read("finder", validFinder, { ...defaultFinder });
let selectedTeacher = null;
let selectedOpening = null;
let trialFormat = finder.format === "Online" ? "Online" : "In-person";
let draft = {};
const validWeek = (week) => Array.isArray(week) && week.length === 7 && week.every((value) => c.practice.values.includes(value));
let practice = read("practice", (value) => value && validWeek(value.days) && Array.isArray(value.history) && value.history.length <= 520 && value.history.every(validWeek), { days: Array(7).fill(0), history: [] });

function matchingTeachers()
{
    return c.teachers.filter((teacher) =>
    {
        return teacher.instruments.includes(finder.instrument) &&
            teacher.ages.includes(finder.age) &&
            teacher.levels.includes(finder.level) &&
            (finder.format === "Either" || teacher.formats.includes(finder.format));
    });
}

function renderFinder()
{
    document.querySelectorAll(".filter").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(finder[button.dataset.filter] === button.dataset.value));
    });
    const teachers = matchingTeachers();
    $("#match-count").textContent = `${c.finder.match} (${teachers.length})`;
    $("#matches").innerHTML = teachers.length ? teachers.map((teacher) => `
        <article class="match" data-teacher="${teacher.name}">
            <div class="match-head"><img src="${teacher.photo}" alt="${teacher.alt}" width="72" height="80"><div><h3>${teacher.name}</h3><p>${teacher.instruments.join(" · ")} / ${teacher.formats.join(" + ")}</p></div></div>
            <p class="match-style">${teacher.style}</p>
            <div class="chips" role="group" aria-label="${c.finder.opening} — ${teacher.name}">${teacher.openings.map((opening) => `<button class="chip opening" data-teacher="${teacher.name}" data-opening="${opening}" aria-pressed="${selectedTeacher === teacher.name && selectedOpening === opening}">${opening}</button>`).join("")}</div>
            <button class="btn teacher-trial" data-teacher="${teacher.name}">${c.finder.trial} ${teacher.name.split(" ")[0]}${icon("arrow")}</button>
        </article>`).join("") : `<div class="match no-match"><p>${c.finder.noMatch}</p><button class="chip" id="loosen">${c.finder.loosen}</button></div>`;
}

function rememberDraft()
{
    const form = $("#trial-form");
    if (form)
    {
        draft = Object.fromEntries(new FormData(form));
    }
}

function changeFinder(name, value)
{
    rememberDraft();
    finder[name] = value;
    selectedTeacher = null;
    selectedOpening = null;
    trialFormat = finder.format === "Online" ? "Online" : "In-person";
    if (name === "age") draft.age = "";
    save("finder", finder);
    renderFinder();
    renderTrial();
}

function chooseTeacher(name, opening)
{
    rememberDraft();
    const teacher = c.teachers.find((item) => item.name === name);
    selectedTeacher = name;
    selectedOpening = opening || null;
    trialFormat = finder.format === "Online" ? "Online" : teacher.formats[0];
    renderFinder();
    booking = null;
    save("booking", null);
    renderTrial();
    $("#trial").scrollIntoView();
    $("#student").focus({ preventScroll: true });
}

$(".finder-controls").addEventListener("click", (event) =>
{
    const button = event.target.closest(".filter");
    if (button) changeFinder(button.dataset.filter, button.dataset.value);
});
$("#matches").addEventListener("click", (event) =>
{
    const opening = event.target.closest(".opening");
    const teacher = event.target.closest(".teacher-trial");
    if (opening) chooseTeacher(opening.dataset.teacher, opening.dataset.opening);
    else if (teacher) chooseTeacher(teacher.dataset.teacher);
    else if (event.target.closest("#loosen"))
    {
        rememberDraft();
        finder = { instrument: finder.instrument, age: "Adult 18+", level: "Beginner", format: "Either" };
        save("finder", finder);
        renderFinder();
        renderTrial();
    }
});
document.querySelectorAll("[data-instrument]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        changeFinder("instrument", button.dataset.instrument);
        $("#finder").scrollIntoView();
    });
});

function renderPractice()
{
    const total = practice.days.reduce((sum, value) => sum + value, 0);
    document.querySelectorAll(".day").forEach((button, index) =>
    {
        const value = practice.days[index];
        button.dataset.value = value;
        button.textContent = c.practice.labels[c.practice.values.indexOf(value)];
        button.setAttribute("aria-label", `${c.practice.days[index]}: ${value === 45 ? "45+" : value} ${c.practice.minutes}`);
    });
    $("#total").textContent = total;
    const percent = Math.min(100, total);
    $("#goal-percent").textContent = `${percent}%`;
    $(".goal").setAttribute("aria-valuenow", percent);
    $(".goal > span").style.width = `${percent}%`;
    let streak = 0;
    for (const week of [...practice.history, practice.days].reverse())
    {
        if (!week.some((value) => value > 0)) break;
        streak++;
    }
    $("#streak").textContent = `${streak}-${c.practice.streak}`;
}

$(".week").addEventListener("click", (event) =>
{
    const button = event.target.closest(".day");
    if (!button) return;
    const index = Number(button.dataset.day);
    practice.days[index] = c.practice.values[(c.practice.values.indexOf(practice.days[index]) + 1) % c.practice.values.length];
    save("practice", practice);
    $("#practice-message").textContent = "";
    renderPractice();
});
$("#reset-week").addEventListener("click", () =>
{
    practice.history = [...practice.history, [...practice.days]].slice(-520);
    practice.days = Array(7).fill(0);
    save("practice", practice);
    renderPractice();
    $("#practice-message").textContent = c.practice.resetMessage;
});

function validBooking(value)
{
    return value && typeof value.student === "string" && value.student.trim().length > 0 && value.student.length <= 100 &&
        Number.isInteger(Number(value.age)) && Number(value.age) >= 6 && Number(value.age) <= 120 &&
        typeof value.guardian === "string" && value.guardian.trim().length > 0 && value.guardian.length <= 100 &&
        typeof value.phone === "string" && /^\d{7,15}$/.test(value.phone.replace(/\D/g, "")) &&
        c.finder.options.instrument.includes(value.instrument) && ["In-person", "Online"].includes(value.format) &&
        typeof value.notes === "string" && value.notes.length <= 2000 &&
        validFinder(value.finder) &&
        (value.teacher === null || c.teachers.some((teacher) => teacher.name === value.teacher &&
            teacher.instruments.includes(value.instrument) && teacher.ages.includes(value.finder.age) &&
            teacher.levels.includes(value.finder.level) && teacher.formats.includes(value.format) &&
            (value.opening === null || teacher.openings.includes(value.opening)))) &&
        (value.teacher !== null || value.opening === null);
}
let booking = read("booking", validBooking, null);

function field(name, type = "text", extra = "")
{
    return `<div class="field"><label for="${name}">${c.trial.labels[name]} *</label><input id="${name}" name="${name}" type="${type}" ${extra} value="${escape(draft[name] || "")}" aria-describedby="${name}-error" required><span class="error" id="${name}-error"></span></div>`;
}

function renderTrial()
{
    if (booking)
    {
        $("#trial-panel").innerHTML = `<div class="success" role="status">${icon("check")}<h3>${c.trial.success} ${escape(booking.student)}.</h3><p>${c.trial.confirmation}</p><p>${c.trial.selected}: ${escape(booking.instrument)} · ${escape(booking.format)}${booking.teacher ? ` · ${escape(booking.teacher)}` : ""}${booking.opening ? ` · ${escape(booking.opening)}` : ""}</p><button class="btn outline" id="another">${c.trial.another}</button></div>`;
        $("#another").addEventListener("click", () =>
        {
            booking = null;
            draft = {};
            selectedTeacher = null;
            selectedOpening = null;
            save("booking", null);
            renderTrial();
        });
        return;
    }
    const teacher = c.teachers.find((item) => item.name === selectedTeacher);
    const formats = teacher ? teacher.formats : ["In-person", "Online"];
    if (!formats.includes(trialFormat)) trialFormat = formats[0];
    if (!draft.age) draft.age = [8, 12, 15, 18][c.finder.options.age.indexOf(finder.age)];
    $("#trial-panel").innerHTML = `
        <form id="trial-form" novalidate>
            <div class="chips selected-lesson">
                ${selectedTeacher ? `<button type="button" class="chip remove-selection" data-remove="teacher" aria-label="${c.trial.remove} ${selectedTeacher}">${c.trial.with} ${selectedTeacher} ×</button>` : ""}
                ${selectedOpening ? `<button type="button" class="chip remove-selection" data-remove="opening" aria-label="${c.trial.remove} ${selectedOpening}">${c.trial.opening} ${selectedOpening} ×</button>` : ""}
            </div>
            <p class="form-note selected-context">${finder.age} · ${finder.level}</p>
            <div class="form-grid">
                <div class="field full"><label for="trial-instrument">${c.trial.labels.instrument}</label><select name="instrument" id="trial-instrument">${c.finder.options.instrument.map((value) => `<option ${finder.instrument === value ? "selected" : ""}>${value}</option>`).join("")}</select></div>
                ${field("student", "text", 'maxlength="100" autocomplete="given-name"')}
                ${field("age", "number", 'min="6" max="120" step="1" inputmode="numeric"')}
                ${field("guardian", "text", 'maxlength="100" autocomplete="name"')}
                ${field("phone", "tel", 'maxlength="30" autocomplete="tel"')}
            </div>
            <p class="form-note">${c.trial.ageNote}</p>
            <fieldset><legend>${c.trial.labels.format}</legend><div class="chips">${formats.map((value) => `<button type="button" class="chip trial-format" data-format="${value}" aria-pressed="${trialFormat === value}">${value}</button>`).join("")}</div></fieldset>
            <div class="field"><label for="notes">${c.trial.labels.notes}</label><textarea id="notes" name="notes" maxlength="2000" placeholder="${c.trial.notes}">${escape(draft.notes || "")}</textarea></div>
            <p class="error" id="form-errors" role="alert"></p>
            <button class="btn" type="submit">${c.trial.submit}${icon("arrow")}</button>
            <p class="form-note">${c.trial.disclosure}</p>
        </form>`;
    $("#trial-form").addEventListener("click", (event) =>
    {
        const remove = event.target.closest(".remove-selection");
        const format = event.target.closest(".trial-format");
        if (remove)
        {
            rememberDraft();
            if (remove.dataset.remove === "teacher") selectedTeacher = null;
            selectedOpening = null;
            renderFinder();
            renderTrial();
        }
        else if (format)
        {
            trialFormat = format.dataset.format;
            document.querySelectorAll(".trial-format").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.format === trialFormat)));
        }
    });
    $("#trial-instrument").addEventListener("change", (event) => changeFinder("instrument", event.target.value));
    $("#trial-form").addEventListener("submit", (event) =>
    {
        event.preventDefault();
        rememberDraft();
        let firstInvalid = null;
        for (const name of ["student", "age", "guardian", "phone"])
        {
            const value = String(draft[name] || "").trim();
            let error = value ? "" : c.trial.required;
            if (name === "age" && value && (!Number.isInteger(Number(value)) || Number(value) < 6 || Number(value) > 120)) error = c.trial.ageError;
            if (name === "age" && !error && teacher)
            {
                const number = Number(value);
                const group = c.finder.options.age[number <= 10 ? 0 : number <= 13 ? 1 : number <= 17 ? 2 : 3];
                if (!teacher.ages.includes(group)) error = c.trial.ageMatchError;
            }
            if (name === "phone" && value && !/^\d{7,15}$/.test(value.replace(/\D/g, ""))) error = c.trial.phoneError;
            $(`#${name}-error`).textContent = error;
            $(`#${name}`).setAttribute("aria-invalid", String(Boolean(error)));
            if (error && !firstInvalid) firstInvalid = name;
        }
        $("#form-errors").textContent = firstInvalid ? c.trial.incomplete : "";
        if (firstInvalid)
        {
            $(`#${firstInvalid}`).focus();
            return;
        }
        booking =
        {
            ...Object.fromEntries(Object.entries(draft).map(([name, value]) => [name, String(value).trim()])),
            instrument: finder.instrument,
            format: trialFormat,
            teacher: selectedTeacher,
            opening: selectedOpening,
            finder: { ...finder }
        };
        const stored = save("booking", booking);
        renderTrial();
        if (!stored) $(".success").insertAdjacentHTML("beforeend", `<p>${c.trial.storageError}</p>`);
        $("#trial-panel").scrollIntoView({ block: "center" });
    });
}

const menu = $(".menu");
function closeMenu()
{
    $("#navigation").classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", c.footer.menu);
    menu.innerHTML = icon("menu");
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    $("#navigation").classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? c.footer.closeMenu : c.footer.menu);
    menu.innerHTML = icon(open ? "close" : "menu");
});
$("#navigation").addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true")
    {
        closeMenu();
        menu.focus();
    }
});
renderFinder();
renderPractice();
renderTrial();

const observer = new IntersectionObserver((entries) =>
{
    for (const entry of entries)
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    }
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
