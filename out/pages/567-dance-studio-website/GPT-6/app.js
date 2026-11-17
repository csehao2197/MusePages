import { studio, programs, instructors, sessions, days, ages, levels, images, passes, faqs, copy } from "./content.js";
import { escapeHtml as e, endTime, spotsLabel, isTrialEligible, parseFilters, filteredSessions, groupedByDay, countdown, eventTime, storage, reservationId, validate } from "./lib.js";
import { icons } from "./icons.js";

const isHome = document.body.dataset.page === "home";
const icon = (name) => icons[name] || "";
const image = (data, cls = "", lazy = true) => `<img src="${data.src}" alt="${e(data.alt)}" class="${cls}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'}>`;
const link = (text, href, secondary = false) => `<a class="button ${secondary ? "secondary" : ""}" href="${href}">${text}${icon("ArrowRight")}</a>`;
const heading = (section) => `<p class="eyebrow">${section.eyebrow}</p><h2 class="display">${section.title.replaceAll("\n", "<br>")}</h2>`;
const styleName = (slug) => programs.find((program) => program.slug === slug).name;
const teacher = (id) => instructors.find((person) => person.id === id);
const nav = () => copy.nav.map(([label, href]) => `<a href="${href}" ${label === "Timetable" && !isHome ? 'aria-current="page"' : ""}>${label}</a>`).join("");
let activeDialog = null;
let returnFocus = null;

function header()
{
    return `<header id="header" class="${isHome ? "" : "solid"}">
        <div class="wrap header-inner">
            <a class="wordmark" href="./index.html" aria-label="${studio.brand} home"><i class="beat-bars" aria-hidden="true"></i><span>OFFBEAT<br>DANCE ASSEMBLY</span></a>
            <nav class="desktop-nav" aria-label="Main">${nav()}</nav>
            <div class="header-actions">${link('<span class="desktop-trial">Free trial</span><span class="mobile-trial">Trial</span>', "./index.html#trial")}<button class="menu-button" aria-label="Open menu" aria-haspopup="dialog" aria-controls="mobile-menu">${icon("Menu")}</button></div>
        </div>
    </header>
    <dialog id="mobile-menu" class="mobile-menu" aria-labelledby="menu-title">
        <div class="menu-top"><span id="menu-title" class="mono">OFFBEAT / EXPLORE</span><button class="icon-button" data-close aria-label="Close menu">${icon("X")}</button></div>
        <nav aria-label="Mobile">${nav()}</nav>
        <p>${studio.address}<br>${studio.city}</p><a href="${studio.tel}">${studio.phone}</a>
        ${link("Free trial", "./index.html#trial")}
    </dialog>`;
}

function footer()
{
    return `<section class="visit" id="visit">
        <div class="wrap visit-grid">
            <div><p class="eyebrow">Find the room</p><h3>${studio.address}</h3><p>${studio.city}</p><p class="small">Second floor; stairs and a lift open onto the same landing.</p></div>
            <div><p class="mono">Studio hours</p>${studio.hours.map((line) => `<p class="small">${line}</p>`).join("")}</div>
            <div><p class="mono">Call or write</p><a href="${studio.tel}">${studio.phone}</a><a class="email" href="mailto:${studio.email}">${studio.email}</a><p class="small muted">Invented address and contact details for this demo.</p></div>
            <figure class="map"><svg viewBox="0 0 400 270" role="img" aria-labelledby="map-title"><title id="map-title">Illustrative neighborhood diagram, not a navigation map</title><path d="M25 60H375M25 200H375M285 20V250" stroke="#C7B9FF" fill="none" stroke-width="2"/><path class="map-route" d="M70 200H210V118H269" fill="none" stroke="#FF7452" stroke-width="3" stroke-dasharray="7 5"/><rect x="260" y="95" width="48" height="48" rx="4" fill="#FF7452"/><text x="284" y="125" text-anchor="middle" fill="#17111C" font-size="12" font-weight="800">ODA</text><g fill="#C7B9FF" font-family="monospace" font-size="10" letter-spacing="2"><text x="28" y="47">WILLOW WALK</text><text x="28" y="224">EIGHTH ST</text><text x="302" y="33" transform="rotate(90 302 33)">CADENCE ALLEY</text></g></svg><figcaption class="mono">A little off the main street. Right on beat.</figcaption></figure>
        </div>
    </section>
    <footer><div class="wrap">
        <a href="./index.html" class="footer-wordmark display">OFFBEAT<br><span>DANCE ASSEMBLY</span></a>
        <div class="footer-grid">
            <div><p class="mono">Programs</p>${programs.map((program) => `<a href="./classes.html?style=${program.slug}">${program.name}</a>`).join("")}</div>
            <div><p class="mono">Visit</p><span>${studio.address}</span><span>${studio.city}</span><a href="${studio.tel}">${studio.phone}</a></div>
            <div><p class="mono">Classes</p><a href="./classes.html">Timetable</a><a href="./index.html#trial">Free trial</a><a href="./index.html#passes">Passes</a></div>
            <div><p class="mono">First visit</p><a href="./index.html#faq">FAQ</a><a href="./index.html#recital">Recital</a><span class="small muted">${studio.disclaimer}</span></div>
        </div>
        <div class="footer-bottom"><span>© ${studio.brand} · Practice counts.</span><a href="${studio.credit}" target="_blank" rel="noopener">Template by VibeFather ${icon("ArrowRight")}</a></div>
    </div></footer>`;
}

function hero()
{
    return `<section class="hero" id="top">
        ${image(images.hero, "hero-photo", false)}
        <div class="hero-shade"></div>
        <div class="wrap hero-content">
            <div class="hero-topline"><p class="eyebrow">${copy.hero.eyebrow}</p><span class="mono hero-side-note">A LITTLE PRACTICE.<br>A LOT OF POSSIBILITY.</span></div>
            <h1 class="display hero-title">${copy.hero.lines.map((line, index) => `<span class="mask"><span class="${index === 1 ? "coral" : ""}" style="--line:${index}">${line}</span></span>`).join("")}</h1>
            <div class="hero-bottom">
                <div><p class="hero-lead">${copy.hero.lead}</p><div class="actions">${link("Book a free class", "#trial")}${link("Explore the timetable", "./classes.html", true)}</div></div>
                <a class="recital-note mono" href="#recital"><span class="status-dot"></span> Next recital<br><strong>In Full Motion</strong>${icon("ArrowRight")}</a>
            </div>
            <div class="ledger">${copy.ledger.map(([value, label]) => `<div><strong class="display">${value}</strong><span>${label}</span></div>`).join("")}</div>
        </div>
        <div class="photo-credit mono">FICTIONAL DANCERS / REAL ROOM TO GROW</div>
    </section>`;
}

function programSection()
{
    const rail = copy.rail.map((item) => `<span>${item}</span><i aria-hidden="true"></i>`).join("");
    return `<div class="rail" tabindex="0" role="region" aria-label="Our programs and welcome"><span class="sr-only">${copy.rail.join(". ")}</span><div class="rail-track" aria-hidden="true"><div>${rail}</div><div>${rail}</div></div></div>
    <section class="section programs" id="programs"><div class="wrap">
        <div class="section-head reveal"><div>${heading(copy.programs)}</div><p class="lead">${copy.programs.lead}</p></div>
        <div class="program-grid">${programs.map((program, index) => `<article class="program-card reveal">
            <div class="program-top"><span class="program-index display">0${index + 1}</span><span class="mono">${program.words.split(" / ").join("<br>")}</span></div>
            <h3 class="display">${program.name}</h3><p>${program.description}</p>
            ${index === 1 ? image(images.contemporary, "program-photo") : `<div class="rhythm" aria-hidden="true">${program.bars.map((width) => `<i style="width:${width}%"></i>`).join("")}</div>`}
            <div class="program-meta mono"><span>7–12 · 13–17 · 18+</span><span>First class through Advanced</span></div>
            <a class="text-link" href="./classes.html?style=${program.slug}">See ${program.name} classes ${icon("ArrowRight")}</a>
        </article>`).join("")}</div>
    </div></section>`;
}

function instructorSection()
{
    return `<section class="section light" id="instructors"><div class="wrap">
        <div class="section-head reveal"><div>${heading(copy.instructors)}</div><p class="lead">${copy.instructors.lead}</p></div>
        <div class="instructor-grid">${instructors.map((person) => `<article class="instructor reveal">
            <div class="portrait">${image(person)}</div><div class="instructor-copy"><span class="mono fictional">FICTIONAL INSTRUCTOR</span>
            <h3>${person.name}</h3><p class="mono specialty">${person.specialty}</p><p>${person.bio}</p>
            <blockquote>“${person.quote}”</blockquote><p class="small">Teaches ${styleName(person.style)} · Mon–Sat</p>
            <a class="text-link" href="./classes.html?style=${person.style}">View ${styleName(person.style)} classes ${icon("ArrowRight")}</a></div>
        </article>`).join("")}</div>
    </div></section>`;
}

function recitalSection()
{
    return `<section class="section plum" id="recital"><div class="wrap recital-grid">
        <figure class="recital-photo reveal">${image(images.recital)}<figcaption class="mono">NEXT RECITAL · MAIN STUDIO</figcaption><span class="photo-number display" aria-hidden="true">06/12</span></figure>
        <div class="reveal">${heading(copy.recital)}<p>${copy.recital.lead}</p><p class="event-date">${eventTime()}</p><p class="small muted">${copy.recital.details}</p>
            <div class="countdown" role="timer" aria-label="Time until the recital">${["Days","Hours","Minutes","Seconds"].map((unit) => `<div><strong data-unit="${unit.toLowerCase()}" class="display">00</strong><span class="mono">${unit}</span></div>`).join("")}</div>
            <div class="actions">${link("Try a class before curtain", "#trial")}${link("See class times", "./classes.html", true)}</div>
            <p class="small muted">${copy.recital.note}</p>
        </div>
    </div></section>`;
}

function pricingSection()
{
    return `<section class="section light" id="passes"><div class="wrap">
        <div class="section-head reveal"><div>${heading(copy.passes)}</div><p class="lead">${copy.passes.lead}</p></div>
        <div class="price-grid">${passes.map((pass) => `<article class="price-card reveal ${pass.id === "eight" ? "featured" : ""}">
            <p class="mono price-tag">${pass.tag}</p><h3>${pass.title}</h3><p class="price display"><sup>$</sup>${pass.price}</p><p>${pass.description}</p>
            <ul class="check-list">${pass.features.map((feature) => `<li>${icon("Check")}${feature}</li>`).join("")}</ul><p class="math mono">${pass.math}</p>
            ${link("Start with a free class", `./index.html?plan=${pass.id}#trial`, pass.id !== "eight")}
        </article>`).join("")}</div><p class="small pricing-note">${copy.passes.note}</p>
    </div></section>`;
}

function field(name, label, type, extra = "")
{
    return `<div class="field" data-field="${name}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" aria-describedby="${name}-error" ${extra}><span class="error" id="${name}-error" role="alert"></span></div>`;
}

function trialForm()
{
    const eligible = sessions.filter(isTrialEligible);
    return `<form id="trial-form" novalidate><h3 class="display form-title">Reserve a free class</h3>
        <p class="small form-disclosure">${copy.trial.disclosure}</p><p id="plan-note" class="plan-note" hidden></p>
        <div class="form-row">${field("name",copy.labels.name,"text",'required minlength="2" maxlength="40" autocomplete="given-name"')}${field("email",copy.labels.email,"email",'required autocomplete="email"')}</div>
        <div class="field" data-field="session"><label for="session">${copy.labels.session}</label><select id="session" name="session" required aria-describedby="session-error">${days.map((day,index) => `<optgroup label="${day}">${eligible.filter((session) => session.day === index).map((session) => `<option value="${session.id}">${day.slice(0,3)} ${session.start} · ${session.title} · ${spotsLabel(session)}</option>`).join("")}</optgroup>`).join("")}</select><span class="error" id="session-error" role="alert"></span></div>
        ${field("guardian",copy.labels.guardian,"text",'minlength="2" maxlength="80" autocomplete="name"')}
        <fieldset class="field" data-field="experience"><legend>Your experience</legend><div class="radio-options">${copy.experiences.map((item, index) => `<label><input type="radio" name="experience" id="experience-${index}" value="${item}" aria-describedby="experience-error" required><span>${item}</span></label>`).join("")}</div><span class="error" id="experience-error" role="alert"></span></fieldset>
        <div class="field" data-field="notes"><label for="notes">${copy.labels.notes}</label><textarea id="notes" name="notes" maxlength="240" rows="3" aria-describedby="notes-count notes-error"></textarea><span class="mono notes-count" id="notes-count">0 / 240</span><span class="error" id="notes-error" role="alert"></span></div>
        <div class="field consent" data-field="consent"><label><input type="checkbox" name="consent" id="consent" required aria-describedby="consent-error"><span>${copy.consent}</span></label><span class="error" id="consent-error" role="alert"></span></div>
        <button class="button submit" type="submit">${copy.labels.submit}${icon("ArrowRight")}</button><p class="mono form-foot">NO CARD. NO COMMITMENT. NOTHING TRANSMITTED.</p>
    </form>`;
}

function trialSection()
{
    return `<section class="section" id="trial"><div class="wrap split">
        <div class="sticky">${heading(copy.trial)}<p class="lead">${copy.trial.lead}</p><ul class="check-list">${copy.trial.checklist.map((line) => `<li>${icon("Check")}${line}</li>`).join("")}</ul><a class="text-link" href="./classes.html">Find the right level first ${icon("ArrowRight")}</a></div>
        <div id="booking-panel" class="booking-panel">${trialForm()}</div>
    </div></section>`;
}

function faqSection()
{
    return `<section class="section light" id="faq"><div class="wrap split">
        <div class="sticky">${heading(copy.faq)}</div><div class="faqs">${faqs.map(([question, answer], index) => `<article class="faq"><h3><button aria-expanded="${index === 0}" aria-controls="answer-${index}" id="question-${index}">${question}${icon("Plus")}</button></h3><div id="answer-${index}" role="region" aria-labelledby="question-${index}" ${index === 0 ? "" : "hidden"}><p>${answer}</p></div></article>`).join("")}</div>
    </div></section>`;
}

function classesPage()
{
    return `<section class="schedule-mast section"><div class="wrap"><div class="schedule-head"><div><p class="eyebrow">${copy.timetable.eyebrow}</p><h1 class="display">${copy.timetable.title.replace("\n","<br>")}</h1><p class="lead">${copy.timetable.lead}</p></div><aside><p class="mono coral">First time here?</p><p>Start with any First class or Beginner session. Your first one is free.</p>${link("Book a free trial","./index.html#trial")}</aside></div><figure class="schedule-photo">${image(images.contemporary,"",false)}<figcaption class="mono">Contemporary foundations · Main room</figcaption></figure></div></section>
        <section class="filters" aria-label="Filter classes"><div class="wrap">
            ${filterGroup("style","Style",[["","All styles"],...programs.map((program) => [program.slug,program.name])])}
            ${filterGroup("age","Age",[["","All ages"],...Object.entries(ages)])}
            ${filterGroup("level","Level",[["","Any level"],...Object.entries(levels)])}
            <div class="filter-summary"><p class="mono" id="result-count" aria-live="polite"></p><button class="clear-filters">Clear filters ${icon("X")}</button></div>
        </div></section><section class="week-section"><div class="wrap" id="week-list"></div></section>
        <section class="help plum"><div class="wrap help-grid">${copy.help.map(([symbol,title,text]) => `<div>${icon(symbol)}<h3>${title}</h3><p>${text}</p></div>`).join("")}</div></section>
        <dialog id="class-drawer" class="class-drawer" aria-labelledby="drawer-title"><div id="drawer-content"></div></dialog>`;
}

function filterGroup(name, label, values)
{
    return `<div class="filter-group" role="group" aria-label="${label}"><span class="mono">${label}</span><div class="chips">${values.map(([value,text]) => `<button class="chip" data-filter="${name}" data-value="${value}" aria-pressed="false">${text}</button>`).join("")}</div></div>`;
}

document.querySelector("#app").innerHTML = `${header()}<main id="main">${isHome ? hero() + programSection() + instructorSection() + recitalSection() + pricingSection() + trialSection() + faqSection() : classesPage()}</main>${footer()}`;

function openDialog(dialog, trigger)
{
    returnFocus = trigger || document.activeElement;
    activeDialog = dialog;
    document.body.classList.add("dialog-open");
    dialog.showModal();
    dialog.querySelector("[data-close]")?.focus({preventScroll:true});
}

function closeDialog(dialog)
{
    dialog.close();
}

document.querySelector(".menu-button").addEventListener("click", (event) => openDialog(document.querySelector("#mobile-menu"), event.currentTarget));
document.querySelectorAll("dialog").forEach((dialog) =>
{
    dialog.addEventListener("keydown", (event) =>
    {
        if (event.key !== "Tab") return;
        const controls = [...dialog.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')]
            .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last?.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first?.focus();
        }
    });
    dialog.addEventListener("click", (event) =>
    {
        if (event.target.closest("[data-close]") || (dialog.id === "mobile-menu" && event.target.closest("a"))) closeDialog(dialog);
        if (event.target === dialog)
        {
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
        }
    });
    dialog.addEventListener("close", () =>
    {
        document.body.classList.remove("dialog-open");
        activeDialog = null;
        if (dialog.id === "class-drawer") syncFilterUrl();
        returnFocus?.focus({preventScroll:true});
    });
});

function updateHeader()
{
    document.querySelector("#header").classList.toggle("solid", !isHome || scrollY > 32);
}
addEventListener("scroll",updateHeader,{passive:true});
updateHeader();

if (isHome)
{
    setupBooking();
    const units = ["days","hours","minutes","seconds"];
    function tick()
    {
        const remaining = countdown();
        remaining.forEach((value,index) =>
        {
            const cell = document.querySelector(`[data-unit="${units[index]}"]`);
            const text = String(value).padStart(2,"0");
            if (cell.textContent !== text)
            {
                cell.textContent = text;
                cell.classList.remove("changed");
                requestAnimationFrame(() => cell.classList.add("changed"));
            }
        });
        if (Date.now() >= Date.parse(studio.recital))
        {
            const cta = document.querySelector("#recital .button");
            cta.href = `mailto:${studio.email}`;
            cta.textContent = "Ask about the next recital";
        }
    }
    tick();
    setInterval(tick,1000);
    document.querySelectorAll(".faq button").forEach((button) => button.addEventListener("click",() =>
    {
        const expanded = button.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq button").forEach((other) =>
        {
            other.setAttribute("aria-expanded","false");
            document.getElementById(other.getAttribute("aria-controls")).hidden = true;
        });
        button.setAttribute("aria-expanded",String(!expanded));
        document.getElementById(button.getAttribute("aria-controls")).hidden = expanded;
    }));
}

function setupBooking()
{
    const saved = storage.get();
    if (saved)
    {
        showPass(saved, true);
        return;
    }
    const form = document.querySelector("#trial-form");
    const query = new URLSearchParams(location.search);
    const requested = sessions.find((session) => session.id === query.get("class"));
    if (isTrialEligible(requested)) form.elements.session.value = requested.id;
    const plan = passes.find((item) => item.id === query.get("plan"));
    if (plan)
    {
        const note = document.querySelector("#plan-note");
        note.hidden = false;
        note.textContent = `Pass you are considering: ${plan.title}. No charge.`;
    }
    function guardian()
    {
        const session = sessions.find((item) => item.id === form.elements.session.value);
        const required = session.ageBand !== "adult";
        const input = form.elements.guardian;
        input.closest(".field").hidden = !required;
        input.required = required;
        if (!required) markError("guardian",false);
    }
    form.elements.session.addEventListener("change", guardian);
    guardian();
    form.elements.notes.addEventListener("input",() => document.querySelector("#notes-count").textContent = `${form.elements.notes.value.length} / 240`);
    const touched = new Set();
    function markError(name, invalid)
    {
        const area = form.querySelector(`[data-field="${name}"]`);
        area.querySelectorAll("input,select,textarea").forEach((input) => input.setAttribute("aria-invalid",String(invalid)));
        area.querySelector(".error").innerHTML = invalid ? `${icon("AlertCircle")} ${copy.errors[name]}` : "";
    }
    function checkField(name)
    {
        if (!name) return;
        markError(name,validate(new FormData(form)).includes(name));
    }
    form.addEventListener("focusout",(event) =>
    {
        const name = event.target.name;
        if (Object.hasOwn(copy.errors,name))
        {
            touched.add(name);
            checkField(name);
        }
    });
    form.addEventListener("input",(event) =>
    {
        if (touched.has(event.target.name)) checkField(event.target.name);
    });
    form.addEventListener("change",(event) =>
    {
        if (touched.has(event.target.name)) checkField(event.target.name);
    });
    form.addEventListener("submit",async (event) =>
    {
        event.preventDefault();
        const data = new FormData(form);
        const errors = validate(data);
        Object.keys(copy.errors).forEach((name) =>
        {
            touched.add(name);
            markError(name,errors.includes(name));
        });
        if (errors.length)
        {
            form.querySelector(`[data-field="${errors[0]}"]`).querySelector("input,select,textarea").focus();
            return;
        }
        const button = form.querySelector(".submit");
        button.disabled = true;
        button.innerHTML = `${icon("LoaderCircle")}${copy.labels.pending}`;
        await new Promise((resolve) => setTimeout(resolve,500));
        const session = sessions.find((item) => item.id === data.get("session"));
        const pass = {id:reservationId(session,data.get("email")),sessionId:session.id,name:data.get("name").trim(),created:new Date().toISOString()};
        const persisted = storage.set(pass);
        showPass(pass,persisted);
        document.querySelector("#pass-title").focus();
    });
}

function showPass(pass,persisted)
{
    const session = sessions.find((item) => item.id === pass.sessionId);
    const instructor = teacher(session.instructor);
    document.querySelector("#booking-panel").innerHTML = `<article id="trial-pass" class="trial-pass" aria-labelledby="pass-title">
        <p class="pass-label mono">${copy.confirmation.label}</p><h3 id="pass-title" tabindex="-1" class="display">${copy.confirmation.title}<br><span>${e(pass.name)}.</span></h3>
        <p class="mono">YOUR FIRST EIGHT-COUNT STARTS HERE</p><div class="pass-details"><h4>${session.title}</h4>
        <p>${days[session.day]} · ${session.start}–${endTime(session)}</p><p>${instructor.name} · ${ages[session.ageBand]} · ${levels[session.level]}</p><p>${studio.address}<br>${studio.city}</p></div>
        <p class="reference mono">${pass.id}</p><p class="small" role="status">${persisted ? copy.confirmation.caption : copy.confirmation.failed}</p><p class="small">Device-only demo pass. No place is held with a real business.</p>
        <div class="actions"><button class="button" id="print-pass">${icon("Printer")}${copy.labels.print}</button><button class="reset-button" id="reset-pass">${copy.labels.reset}</button></div>
        <p class="small">To cancel or move a real reservation, call the desk up to six hours before class. Removing this pass only changes this device.</p></article>`;
    document.querySelector("#print-pass").addEventListener("click",() => window.print());
    document.querySelector("#reset-pass").addEventListener("click",() =>
    {
        if (!confirm(copy.confirmation.reset)) return;
        if (!storage.remove())
        {
            document.querySelector(".trial-pass [role=status]").textContent = "Browser storage could not be cleared. Enable storage access or clear this site’s data before choosing another class.";
            return;
        }
        document.querySelector("#booking-panel").innerHTML = trialForm();
        setupBooking();
        document.querySelector("#name").focus();
    });
}

let filters = parseFilters(location.search);
function syncFilterUrl(classId = "")
{
    if (isHome) return;
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key,value]) =>
    {
        if (value) query.set(key,value);
    });
    if (classId) query.set("class",classId);
    history.replaceState(null,"",`./classes.html${query.size ? `?${query}` : ""}`);
}

function renderWeek()
{
    const list = filteredSessions(filters);
    document.querySelector("#result-count").textContent = `Showing ${list.length} of 24 classes`;
    document.querySelector(".clear-filters").style.visibility = Object.values(filters).some(Boolean) ? "visible" : "hidden";
    document.querySelectorAll("[data-filter]").forEach((button) => button.setAttribute("aria-pressed",String(filters[button.dataset.filter] === button.dataset.value)));
    const today = (new Date().getDay() + 6) % 7;
    const groups = groupedByDay(list);
    document.querySelector("#week-list").innerHTML = list.length ? groups.map((group,index) =>
    {
        if (!group.length && !(index === 6 && !Object.values(filters).some(Boolean))) return "";
        return `<div class="day-group"><div class="day-heading"><h2 class="display">${days[index]}</h2>${today === index ? '<span class="pill today">Today</span>' : ""}<span class="mono">${group.length} ${group.length === 1 ? "class" : "classes"}</span></div>
            ${group.length ? group.map((session) => `<button class="class-row" data-session="${session.id}" aria-haspopup="dialog" aria-controls="class-drawer"><span class="class-time mono">${session.start}<br><span>–${endTime(session)}</span></span><span class="class-title"><strong>${session.title}</strong><small>${styleName(session.style)}<span class="inline-instructor"> · ${teacher(session.instructor).name}</span></small>${isTrialEligible(session) ? '<span class="pill trial-eligible">Trial eligible</span>' : ""}</span><span class="class-pills"><span class="pill">${ages[session.ageBand]}</span><span class="pill level">${levels[session.level]}</span></span><span class="row-instructor small">${teacher(session.instructor).name}</span><span class="availability"><span class="mono ${session.booked === session.capacity ? "muted" : "coral"}">${spotsLabel(session)}</span><span class="availability-track"><i style="width:${100 * session.booked / session.capacity}%"></i></span></span>${icon("ChevronRight")}</button>`).join("") : '<p class="rest">Rest and reset · Front desk open 12:00–17:00.</p>'}</div>`;
    }).join("") : `<div class="empty-state"><h2>No classes match all three filters.</h2><p>Try a different age, level or style. We can help you find a starting point.</p><div class="actions"><button class="button" id="empty-clear">Clear filters</button><a class="button secondary" href="${studio.tel}">Ask the desk ${icon("Phone")}</a></div></div>`;
    document.querySelectorAll("[data-session]").forEach((button) => button.addEventListener("click",() => openClass(button.dataset.session,button)));
    document.querySelector("#empty-clear")?.addEventListener("click",clearFilters);
}

function clearFilters()
{
    filters = {style:"",age:"",level:""};
    syncFilterUrl();
    renderWeek();
}

function openClass(id,trigger)
{
    const session = sessions.find((item) => item.id === id);
    if (!session) return;
    const instructor = teacher(session.instructor);
    const full = session.booked >= session.capacity;
    const eligible = isTrialEligible(session);
    document.querySelector("#drawer-content").innerHTML = `<div class="drawer-header"><div><p class="mono coral">${styleName(session.style)}</p><span class="small">${days[session.day]} · ${session.start}–${endTime(session)}</span></div><button class="icon-button" data-close aria-label="Close class details">${icon("X")}</button></div>
        <div class="drawer-body"><h2 id="drawer-title" class="display">${session.title}</h2><div class="drawer-pills"><span class="pill">${ages[session.ageBand]}</span><span class="pill level">${levels[session.level]}</span><span class="pill">${session.duration} min</span><span class="pill">${session.capacity} capacity</span></div>
        <p>${programs.find((item) => item.slug === session.style).description}</p><p>${copy.descriptions[session.level]}</p>
        <h3 class="mono">What to expect</h3><ul class="check-list">${copy.expect.map((line) => `<li>${icon("Check")}${line}</li>`).join("")}</ul><h3 class="mono">What to bring</h3><p>${copy.bring[session.style]}</p>
        <div class="drawer-instructor"><img src="${instructor.src}" alt="" width="64" height="64"><div><strong>${instructor.name}</strong><p class="small muted">${instructor.specialty}</p></div></div>
        <p class="mono">${session.booked} of ${session.capacity} booked · ${session.capacity - session.booked} spots left</p><div class="availability-track large"><i style="width:${100 * session.booked / session.capacity}%"></i></div><p class="small muted">Sample availability. This static timetable does not update from a real studio.</p></div>
        <div class="drawer-footer">${link(full ? "Join the waitlist by phone" : eligible ? "Reserve this as my free trial" : "Ask about this class", eligible ? `./index.html?class=${session.id}#trial` : studio.tel)}${!eligible ? '<p class="small muted">Free trials are available in First class and Beginner sessions.</p>' : ""}<button data-close class="drawer-close">Close</button></div>`;
    syncFilterUrl(id);
    openDialog(document.querySelector("#class-drawer"),trigger);
}

if (!isHome)
{
    renderWeek();
    const initialClass = new URLSearchParams(location.search).get("class");
    syncFilterUrl();
    document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click",() =>
    {
        filters[button.dataset.filter] = button.dataset.value;
        syncFilterUrl();
        renderWeek();
    }));
    document.querySelector(".clear-filters").addEventListener("click",clearFilters);
    if (sessions.some((session) => session.id === initialClass)) openClass(initialClass,document.querySelector(`[data-session="${initialClass}"]`) || document.querySelector("[data-filter]"));
}

if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("seen");
                observer.unobserve(entry.target);
            }
        });
    },{threshold:0.15});
    document.querySelectorAll(".reveal").forEach((element) =>
    {
        element.classList.add("will-reveal");
        observer.observe(element);
    });
}
if (location.hash)
{
    requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView());
}
