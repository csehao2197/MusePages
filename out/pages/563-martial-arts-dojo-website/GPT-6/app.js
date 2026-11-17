import { content as c } from "./content.js";
import { icons } from "./icons.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => icons[name] || "";
const brandSlug = c.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const phone = `tel:${c.phone.replace(/\D/g, "")}`;
const brandWords = c.brand.split(" ");
const brandMarkup = `<span>${escape(brandWords[0].toUpperCase())}<span class="brand-sub">${escape(brandWords.slice(1).join(" ").toUpperCase())}</span></span>`;
const keys = { filters: `${brandSlug}:schedule`, booking: `${brandSlug}:trial` };
const read = (key) =>
{
    try
    {
        return JSON.parse(localStorage.getItem(key));
    }
    catch
    {
        return null;
    }
};
const save = (key, value) =>
{
    try
    {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch
    {
        return false;
    }
};
const knot = `<svg class="knot" aria-hidden="true" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0D0E12"/><g fill="#C8102E"><path d="M10 24h44v8H10zM29 20h9v18h-9zM28 34l-8 20-8-4 12-18zM37 33l15 15-7 7-13-19z"/></g></svg>`;
const brush = `<svg class="brush" aria-hidden="true" viewBox="0 0 180 12"><path d="M1 7L166 2 179 6 8 10Z"/><path d="M6 4L157 0 173 4 2 8Z" opacity=".55"/></svg>`;
const heading = (section) =>
{
    const [eyebrow, title, description] = c.sections[section];
    return `<div class="section-head"><p class="eyebrow">${eyebrow}</p><h2 id="${section}-heading">${title.replace("\n", "<br>")}</h2>${brush}${description ? `<p class="intro">${description}</p>` : ""}</div>`;
};
const image = (name, className = "", eager = false) =>
{
    const [src, alt] = c.images[name];
    return `<img class="${className}" src="${src}" alt="${escape(alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
};
const belt = (color) => `<svg class="belt" aria-hidden="true" viewBox="0 0 80 54" style="--belt:${color}"><g fill="var(--belt)" stroke="#9BA0AB" stroke-width="1"><path d="M4 13h72v12H4z"/><path d="M30 22L17 49 6 43 26 20zM49 21l25 23-11 8-20-27z"/><path d="M32 9h16v24H32z"/></g><path d="M35 14h10M35 20h10M35 26h10" stroke="#14151A" opacity=".4"/></svg>`;
const nav = c.nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("");
const trialLink = (label, className = "button", track = "") => `<a class="${className}" href="#trial"${track ? ` data-track="${track}"` : ""}>${label}${icon("ArrowRight")}</a>`;
const field = (name, label, type, hint, extra = "") => `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" aria-describedby="${name}-hint ${name}-error" ${extra}><small id="${name}-hint">${hint || ""}</small><span class="error" id="${name}-error"></span></div>`;

$("#app").innerHTML = `
    <a class="skip" href="#main">${c.ui.skip}</a>
    <header class="header">
        <div class="header-inner">
            <a class="brand" href="#main" aria-label="${c.brand}">${knot}${brandMarkup}</a>
            <nav class="desktop-nav" aria-label="Main">${nav}</nav>
            <a class="phone" href="${phone}" aria-label="${c.ui.call} ${c.phone}">${icon("Phone")}<span>${c.phone}</span></a>
            ${trialLink(c.ui.book, "button header-cta")}
            <button id="menu-toggle" class="icon-button" aria-label="${c.ui.menu}" aria-expanded="false" aria-controls="mobile-nav">${icon("Menu")}</button>
        </div>
        <nav id="mobile-nav" aria-label="Mobile" hidden>${nav}</nav>
    </header>
    <main id="main">
        <section class="hero" aria-labelledby="hero-title">
            ${image("hero", "hero-photo", true)}
            <div class="hero-shade"></div>
            <div class="wrap hero-inner">
                <p class="hero-index">${c.hero.index}</p>
                <div class="hero-copy">
                    <p class="eyebrow">${c.hero.eyebrow}</p>
                    <div class="hero-title-wrap"><svg class="hero-brush" viewBox="0 0 800 200" aria-hidden="true"><path d="M4 155L720 6 795 42 46 192Z"/><path d="M25 121L686 0 760 49 9 177Z" opacity=".4"/></svg><h1 id="hero-title">${c.hero.title.map((line) => `<span>${line}</span>`).join("")}</h1></div>
                    <p class="hero-description">${c.hero.paragraph}</p>
                    <div class="hero-actions">${trialLink(c.hero.primary)}<a class="button outline" href="#schedule">${c.hero.secondary}${icon("CalendarCheck")}</a></div>
                    <ul class="hero-chips">${c.hero.chips.map((text) => `<li>${icon("CheckCircle2")}${text}</li>`).join("")}</ul>
                </div>
                <p class="hero-side">${c.hero.side}</p>
                <div class="hero-bottom"><span>${c.hero.bottom}</span><a href="#programs" aria-label="Explore programs">${icon("ArrowRight")}</a></div>
            </div>
        </section>
        <section class="section programs" id="programs" aria-labelledby="programs-heading"><div class="wrap">
            ${heading("programs")}
            <div class="program-grid">${c.programs.map((program, index) => `<article class="program-card">
                <div class="program-photo">${image(program.image)}<span class="age-tag">${program.name.toUpperCase()} · ${program.ages}</span><span class="program-number">0${index + 1}</span></div>
                <div class="program-copy"><h3>${program.title.replace("\n", "<br>")}</h3><p>${program.copy}</p><div class="program-bottom"><small>${c.ui.firstFree}</small>${trialLink(c.ui.next, "text-link", program.name)}</div></div>
            </article>`).join("")}</div>
        </div></section>
        <section class="section dark path-section" id="path" aria-labelledby="path-heading"><div class="wrap">
            <div class="path-intro">${heading("path")}<div class="belt-photo">${image("belts")}</div></div>
            <div class="rank-path">
                <svg class="path-svg" viewBox="0 0 1080 250" preserveAspectRatio="none" aria-hidden="true"><path class="track-line" d="M90 220 C230 220 170 180 270 180 S350 140 450 140 S530 100 630 100 S710 60 810 60 S890 20 990 20"/><path class="progress-line" pathLength="1" d="M90 220 C230 220 170 180 270 180 S350 140 450 140 S530 100 630 100 S710 60 810 60 S890 20 990 20"/></svg>
                <div class="rank-grid">${c.ranks.map(([name, time, requirement, color], index) => `<button class="rank" data-rank="${index}" style="--rank:${index}" aria-pressed="false">${belt(color)}<span class="rank-card"><span class="rank-name">${name}</span><span class="rank-time">${time}</span><span class="rank-requirement">${requirement}</span></span></button>`).join("")}</div>
            </div>
            <p class="rank-detail" aria-live="polite">${c.ui.rankDetail}</p><p class="fine">${c.rankNote}</p>
        </div></section>
        <section class="section schedule" id="schedule" aria-labelledby="schedule-heading"><div class="wrap">
            ${heading("schedule")}
            <div class="filters" role="group" aria-label="${c.ui.dayFilter}">${[c.ui.all, ...c.days].map((day) => `<button class="filter" data-day="${day}" aria-pressed="${day === c.ui.all}">${day}</button>`).join("")}</div>
            <div class="filters program-filters" role="group" aria-label="${c.ui.programFilter}">${[c.ui.all, ...c.programFilters].map((program) => `<button class="filter" data-program="${program}" aria-pressed="${program === c.ui.all}">${program}</button>`).join("")}</div>
            <p id="schedule-status" class="fine" aria-live="polite"></p>
            <div class="table-scroll" tabindex="0" role="region" aria-label="Weekly schedule, scroll horizontally to see every day">
                <table><caption class="sr-only">${c.ui.table}</caption><thead><tr><th scope="col">${c.ui.time}</th>${c.days.map((day) => `<th scope="col">${day}</th>`).join("")}</tr></thead>
                <tbody>${c.times.map((time) => `<tr><th scope="row">${time}</th>${c.days.map((day) =>
                {
                    const item = c.classes.find((entry) => entry[0] === day && entry[1] === time);
                    return item ? `<td><div class="class-cell" data-class-day="${day}" data-class-program="${item[2]}"><span class="class-time">${time}</span><strong>${item[2]}</strong><span class="level">${item[3]}</span><a class="class-book" href="#trial" data-track="${item[2]}" data-slot-day="${day}" data-slot-time="${time}" aria-label="Try ${item[2]} on ${day} at ${time}">${icon("ArrowRight")}</a></div></td>` : `<td class="empty"><span aria-label="${c.ui.noClass}">—</span></td>`;
                }).join("")}</tr>`).join("")}</tbody></table>
            </div><p class="fine schedule-note">${icon("Clock")}${c.scheduleNote}</p>
        </div></section>
        <section class="section instructors" id="instructors" aria-labelledby="instructors-heading"><div class="wrap">
            ${heading("instructors")}
            <div class="instructor-grid">${c.instructors.map((teacher) => `<article class="instructor-card">${image(teacher.image)}<div><p class="eyebrow">${teacher.role}</p><h3>${teacher.name}</h3><p class="teacher-experience">${teacher.experience}</p><p>${teacher.copy}</p><blockquote>“${teacher.quote}”</blockquote></div></article>`).join("")}</div>
        </div></section>
        <section class="section pricing" id="pricing" aria-labelledby="pricing-heading"><div class="wrap">
            ${heading("pricing")}
            <div class="price-grid">${c.pricing.map(([name, price, cadence, description, tag], index) => `<article class="price-card ${index === 1 ? "individual" : ""}"><div class="price-top"><h3>${name}</h3>${tag ? `<span class="price-tag">${tag}</span>` : ""}</div><p class="price">${price}<span>${cadence}</span></p><p>${description}</p>${trialLink(index === 0 ? c.ui.book : c.ui.freeTrial, index === 0 ? "button" : "button light-outline", index === 2 ? "Family" : "")}</article>`).join("")}</div>
            <p class="price-note">${icon("Users")}${c.priceNote}</p>
        </div></section>
        <section class="section dark parents" id="parents" aria-labelledby="parents-heading"><div class="wrap parent-layout">
            <div>${heading("parents")}<p class="parent-note">${c.parentNote}</p><div class="parent-emblem" aria-hidden="true">${knot}<span>RESTRAINT<br>IS STRENGTH.</span></div></div>
            <div class="parent-grid">${c.parents.map(([symbol, title, copy]) => `<article><span class="parent-icon">${icon(symbol)}</span><h3>${title}</h3><p>${copy}</p></article>`).join("")}</div>
        </div></section>
        <section class="section reviews" id="reviews" aria-labelledby="reviews-heading"><div class="wrap">
            ${heading("reviews")}
            <div class="review-grid">${c.reviews.map(([quote, name, role]) => `<figure class="review"><div class="stars" aria-label="5 out of 5 stars">${Array.from({ length: 5 }, () => icon("Star")).join("")}</div><blockquote>“${quote}”</blockquote><figcaption><strong>${name}</strong><span>${role}</span></figcaption></figure>`).join("")}</div><p class="fine">${c.reviewNote}</p>
        </div></section>
        <section class="section trial" id="trial" aria-labelledby="trial-heading"><div class="wrap trial-layout">
            <div>${heading("trial")}<p class="trial-description">${c.ui.demoNote}</p><div class="trial-meta">${icon("MapPin")}<span>${c.ui.footerAddress}<br>${c.city}</span></div><div class="trial-meta">${icon("Phone")}<a href="${phone}">${c.phone}</a></div><p class="eyebrow local-note">${c.ui.localNote}</p></div>
            <div class="form-panel">
                <form id="trial-form" novalidate>
                    <div class="field"><label for="track">${c.ui.track}</label><select name="track" id="track">${c.trialTracks.map((track) => `<option>${track}</option>`).join("")}</select></div>
                    <p id="selected-class" class="selected-class" aria-live="polite" hidden></p>
                    <div class="form-row">${field("student", c.ui.student, "text", c.ui.studentHint, 'autocomplete="given-name" maxlength="80" required')}${field("age", c.ui.age, "number", "", 'min="6" max="100" step="1" inputmode="numeric" required')}</div>
                    <div class="form-row">${field("guardian", c.ui.guardian, "text", c.ui.guardianHint, 'autocomplete="name" maxlength="80" required')}${field("contactPhone", c.ui.phone, "tel", c.ui.phoneHint, 'autocomplete="tel" maxlength="30" required')}</div>
                    <fieldset><legend>${c.ui.preferred}</legend><div class="start-options">${c.starts.map((start, index) => `<label><input type="radio" name="start" value="${start}" ${index === 0 ? "checked" : ""}><span>${start}</span></label>`).join("")}</div></fieldset>
                    <p id="form-status" role="alert"></p>
                    <button class="button submit" type="submit">${c.ui.submit}${icon("ArrowRight")}</button>
                    <p class="form-fine">${c.ui.localNote}</p>
                </form>
                <div id="success" hidden tabindex="-1" aria-live="polite"><div class="success-icon">${icon("CheckCircle2")}</div><p class="eyebrow">${c.ui.freeTrial}</p><h3>${c.ui.welcome} <span id="student-welcome"></span>.</h3><p>${c.ui.success}</p><p id="success-class" hidden></p><p id="storage-note"></p><button id="book-another" class="button outline">${c.ui.another}${icon("ArrowRight")}</button></div>
            </div>
        </div></section>
    </main>
    <footer><div class="wrap footer-grid"><div><a class="brand" href="#main">${knot}${brandMarkup}</a><p>${c.ui.footerAddress}, ${c.city}</p><a href="${phone}">${c.phone}</a><p>${c.ui.hours}</p></div><div><h3>${c.ui.school}</h3><nav aria-label="Footer">${nav}</nav></div><div><h3>${c.ui.smallPrint}</h3><p>${c.ui.disclaimer}</p><p>${c.ui.lineage}</p><a class="credit" href="${c.ui.creditUrl}">${c.ui.credit}${icon("ArrowRight")}</a><a class="license-link" href="${c.ui.licenseUrl}">${c.ui.license}</a></div></div><div class="wrap footer-bottom"><span>${c.ui.sample}</span><span>${c.city.toUpperCase()} / ALL ARE WELCOME</span></div></footer>
    <div class="mobile-bar"><a class="button" href="${phone}">${icon("Phone")}${c.ui.call}</a><a class="button outline" href="#trial">${c.ui.freeTrial}${icon("ArrowRight")}</a></div>
`;

const menuButton = $("#menu-toggle");
const setMenu = (open) =>
{
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? c.ui.close : c.ui.menu);
    menuButton.innerHTML = icon(open ? "X" : "Menu");
    $("#mobile-nav").hidden = !open;
};
menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true")
    {
        setMenu(false);
        menuButton.focus();
    }
});
$$("#mobile-nav a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
matchMedia("(min-width: 1081px)").addEventListener("change", (event) =>
{
    if (event.matches) setMenu(false);
});

const restoredFilter = read(keys.filters);
let filters = { day: "All", program: "All" };
if (restoredFilter && [c.ui.all, ...c.days].includes(restoredFilter.day) && [c.ui.all, ...c.programFilters].includes(restoredFilter.program))
{
    filters = { day: restoredFilter.day, program: restoredFilter.program };
}
const filterSchedule = () =>
{
    let matches = 0;
    $$(".class-cell").forEach((cell) =>
    {
        const match = (filters.day === "All" || filters.day === cell.dataset.classDay) && (filters.program === "All" || filters.program === cell.dataset.classProgram);
        cell.classList.toggle("dimmed", !match);
        cell.classList.toggle("matched", match);
        if (match) matches++;
    });
    $$("[data-day]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.day === filters.day)));
    $$("[data-program]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.program === filters.program)));
    $("#schedule-status").textContent = matches ? `${matches} ${c.ui.scheduleStatus}` : c.ui.noMatches;
};
$$("[data-day], [data-program]").forEach((button) => button.addEventListener("click", () =>
{
    if (button.dataset.day) filters.day = button.dataset.day;
    if (button.dataset.program) filters.program = button.dataset.program;
    filterSchedule();
    save(keys.filters, filters);
}));
filterSchedule();
let selectedClass = null;
const classSummary = (session) => `${c.ui.preferredClass} ${session[0]} · ${session[1]} · ${session[2]} · ${session[3]}. ${c.ui.classLimit}`;
const updateSelectedClass = () =>
{
    $("#selected-class").hidden = !selectedClass;
    $("#selected-class").textContent = selectedClass ? classSummary(selectedClass) : "";
};
$$("[data-track]").forEach((link) => link.addEventListener("click", () =>
{
    if (!$("#success").hidden) resetBooking();
    $("#track").value = c.trialTracks.find((track) => track.startsWith(link.dataset.track));
    selectedClass = c.classes.find((session) => session[0] === link.dataset.slotDay && session[1] === link.dataset.slotTime && session[2] === link.dataset.track) || null;
    updateSelectedClass();
}));
$("#track").addEventListener("change", () =>
{
    selectedClass = null;
    updateSelectedClass();
});
$$(".rank").forEach((button) => button.addEventListener("click", () =>
{
    $$(".rank").forEach((rank) => rank.setAttribute("aria-pressed", String(rank === button)));
    const [name, time, requirement] = c.ranks[Number(button.dataset.rank)];
    $(".rank-detail").textContent = `${name} · ${time} — ${requirement}. ${c.rankNote}`;
}));

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let pendingFrame = false;
const updatePath = () =>
{
    const rect = $(".rank-path").getBoundingClientRect();
    const progress = reduceMotion.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.9 - rect.top) / (rect.height + innerHeight * 0.2)));
    $(".progress-line").style.strokeDashoffset = String(1 - progress);
    $(".rank-path").style.setProperty("--progress", progress);
    $$(".rank").forEach((rank, index) => rank.classList.toggle("reached", reduceMotion.matches || progress >= index / 6));
    pendingFrame = false;
};
addEventListener("scroll", () =>
{
    if (!pendingFrame)
    {
        pendingFrame = true;
        requestAnimationFrame(updatePath);
    }
}, { passive: true });
addEventListener("resize", updatePath);
reduceMotion.addEventListener("change", updatePath);
updatePath();

const revealObserver = new IntersectionObserver((entries) =>
{
    for (const entry of entries)
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        }
    }
}, { threshold: 0.08 });
$$(".program-card, .instructor-card, .price-card, .parent-grid article, .review").forEach((card, index) =>
{
    card.classList.add("reveal");
    card.style.setProperty("--delay", `${index % 3 * 50}ms`);
    revealObserver.observe(card);
});

const validateBooking = (data) =>
{
    const errors = {};
    for (const name of ["student", "guardian"])
    {
        if (typeof data[name] !== "string" || data[name].trim().length < 2 || data[name].trim().length > 80) errors[name] = c.ui.required;
    }
    if (!Number.isInteger(data.age) || data.age < 6 || data.age > 100) errors.age = c.ui.ageError;
    if (!c.trialTracks.includes(data.track)) errors.age = c.ui.trackAgeError;
    if (!errors.age)
    {
        const index = c.trialTracks.indexOf(data.track);
        if ((index === 0 && data.age > 9) || (index === 1 && (data.age < 10 || data.age > 15)) || (index === 2 && data.age < 16)) errors.age = c.ui.trackAgeError;
    }
    if (typeof data.contactPhone !== "string" || !/^[+()\d\s.-]{7,30}$/.test(data.contactPhone) || !/^\d{7,15}$/.test(data.contactPhone.replace(/\D/g, ""))) errors.contactPhone = c.ui.phoneError;
    if (!c.starts.includes(data.start)) errors.start = c.ui.formError;
    if (data.session !== undefined && (!c.trialTracks.includes(data.track) || !Array.isArray(data.session) || !c.classes.some((session) => JSON.stringify(session) === JSON.stringify(data.session) && data.track.startsWith(session[2])))) errors.session = c.ui.formError;
    return errors;
};
const showSuccess = (booking, persistent = true, focus = true) =>
{
    $("#trial-form").hidden = true;
    $("#success").hidden = false;
    $("#student-welcome").textContent = booking.student;
    $("#storage-note").textContent = persistent ? "" : c.ui.volatile;
    $("#success-class").hidden = !booking.session;
    $("#success-class").textContent = booking.session ? classSummary(booking.session) : "";
    if (focus) $("#success").focus({ preventScroll: true });
};
function resetBooking()
{
    try
    {
        localStorage.removeItem(keys.booking);
    }
    catch
    {
        // A disabled storage area must not prevent starting a new local sample.
    }
    $("#trial-form").hidden = false;
    $("#success").hidden = true;
    $("#trial-form").reset();
    selectedClass = null;
    updateSelectedClass();
    $$(".error").forEach((error) => error.textContent = "");
    $$("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    $("#form-status").textContent = "";
}
$("#book-another").addEventListener("click", () =>
{
    resetBooking();
    $("#track").focus({ preventScroll: true });
});
for (const name of ["student", "age", "guardian", "contactPhone"])
{
    $(`#${name}`).addEventListener("input", () =>
    {
        $(`#${name}`).removeAttribute("aria-invalid");
        $(`#${name}-error`).textContent = "";
        $("#form-status").textContent = "";
    });
}
$("#trial-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const booking = Object.fromEntries(new FormData(event.currentTarget));
    for (const field of ["student", "guardian", "contactPhone"]) booking[field] = booking[field].trim();
    booking.age = booking.age.trim() ? Number(booking.age) : NaN;
    if (selectedClass) booking.session = selectedClass;
    const errors = validateBooking(booking);
    for (const name of ["student", "age", "guardian", "contactPhone"])
    {
        $(`#${name}-error`).textContent = errors[name] || "";
        $(`#${name}`).setAttribute("aria-invalid", String(Boolean(errors[name])));
    }
    $("#form-status").textContent = Object.keys(errors).length ? c.ui.formError : "";
    if (Object.keys(errors).length)
    {
        $("[aria-invalid=true]")?.focus({ preventScroll: true });
        return;
    }
    showSuccess(booking, save(keys.booking, booking));
});
const restoredBooking = read(keys.booking);
if (restoredBooking && typeof restoredBooking === "object" && !Array.isArray(restoredBooking) && Object.keys(validateBooking(restoredBooking)).length === 0)
{
    showSuccess(restoredBooking, true, false);
}
