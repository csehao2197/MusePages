import { content as c } from "./content.js";

const icons =
{
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>'
};
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const eyebrow = (text) => `<p class="eyebrow">${text}</p>`;
const brand = () => `<span class="brand-name"><span class="brand-mark" aria-hidden="true"></span>${c.school}</span><span class="brand-label">${c.brandLabel}</span>`;
const heading = (section) => `${eyebrow(section.eyebrow)}<h2>${section.title}</h2>`;
const app = c.application;

document.querySelector("#site").innerHTML = `
    <a class="skip-link" href="#main">${c.skip}</a>
    <header class="header">
        <div class="container header-inner">
            <a class="brand" href="./index.html" aria-label="${c.school} home">${brand()}</a>
            <nav aria-label="Main navigation">
                ${c.nav.map((link, index) => `<a class="${index === 2 ? "button primary compact" : "nav-link link-draw"}" href="${link.href}">${link.label}${index === 2 ? icon("arrow") : ""}</a>`).join("")}
            </nav>
        </div>
    </header>
    <main id="main">
        <section class="hero container">
            <div class="hero-copy reveal">
                <p class="eyebrow hero-eyebrow"><span class="status-dot" aria-hidden="true"></span>${c.hero.eyebrow}</p>
                <h1>${c.hero.title}</h1>
                <p class="standfirst">${c.hero.intro}</p>
                <div class="hero-actions">
                    <a class="button primary" href="#apply">${c.hero.apply}${icon("arrow")}</a>
                    <a class="button secondary" href="#curriculum">${c.hero.curriculum}</a>
                </div>
                <p class="next-cohort">${icon("cap")}<span>${c.hero.nextLabel}: <strong>${c.hero.next}</strong></span></p>
            </div>
            <div class="hero-bottom">
                <ul class="trust">${c.hero.trust.map((text) => `<li>${icon("check")}${text}</li>`).join("")}</ul>
                <p>${c.hero.note}</p>
            </div>
        </section>
        <section class="section cream" id="curriculum">
            <div class="container reading">
                <div class="section-heading reveal">${heading(c.curriculum)}<p class="section-intro">${c.curriculum.intro}</p></div>
                <div class="timeline">
                    <div class="timeline-rail" aria-hidden="true"><span></span></div>
                    ${c.curriculum.phases.map((phase) => `
                        <article class="phase reveal">
                            <p class="weeks">${phase.weeks}</p>
                            <div>
                                <h3>${phase.title}</h3>
                                <ul class="topics">${phase.topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
                                <p class="milestone">${c.curriculum.milestoneLabel} — ${phase.milestone}</p>
                            </div>
                        </article>`).join("")}
                </div>
            </div>
        </section>
        <section class="section" id="cohorts">
            <div class="container reading">
                <div class="section-heading reveal">${heading(c.cohorts)}</div>
                <div class="table-wrap reveal">
                    <table>
                        <caption class="sr-only">${c.cohorts.title}</caption>
                        <thead><tr>${c.cohorts.headers.map((header) => `<th scope="col">${header}</th>`).join("")}</tr></thead>
                        <tbody>${c.cohorts.rows.map((row) => `<tr><th scope="row">${row.name}</th><td data-label="${c.cohorts.headers[1]}">${row.format}</td><td data-label="${c.cohorts.headers[2]}">${row.schedule}</td><td data-label="${c.cohorts.headers[3]}"><span class="${row.seats.includes("left") ? "seats" : ""}">${row.seats}</span></td></tr>`).join("")}</tbody>
                    </table>
                </div>
                <p class="caption">${c.cohorts.caption}</p>
            </div>
        </section>
        <section class="section outcomes" id="outcomes">
            <div class="container">
                <div class="section-heading reveal">${heading(c.outcomes)}</div>
                <div class="stats">
                    ${c.outcomes.stats.map((stat, index) => `<article class="stat reveal"><p class="stat-value" data-stat="${index}">${stat.prefix}${stat.value}${stat.suffix}</p><p>${stat.label}</p></article>`).join("")}
                </div>
                <p class="caveat"><span aria-hidden="true">*</span> ${c.outcomes.caveat}</p>
            </div>
        </section>
        <section class="section cream" id="tuition">
            <div class="container">
                <div class="section-heading reveal">${heading(c.tuition)}</div>
                <div class="plans">
                    ${c.tuition.plans.map((plan, index) => `<article class="plan reveal ${plan.highlighted ? "featured" : ""}">${plan.highlighted ? `<span class="plan-badge">${c.tuition.badge}</span>` : ""}<h3>${plan.name}</h3><p class="price">${plan.figure}</p><p class="plan-line">${plan.line}</p><p class="plan-note">${plan.note}</p><a class="button secondary plan-choice" data-plan="${index}" href="#apply" title="${c.tuition.demo}">${c.tuition.choose} ${plan.name}${icon("arrow")}</a></article>`).join("")}
                </div>
                <p class="tuition-note">${c.tuition.scholarship}</p>
                <p class="caption">${c.tuition.sample}</p>
                <p class="plan-status caption" role="status"></p>
            </div>
        </section>
        <section class="section" id="instructors">
            <div class="container">
                <div class="section-heading reveal">${heading(c.instructors)}</div>
                <div class="instructors">
                    ${c.instructors.rows.map((person) => `<article class="instructor reveal"><img src="${person.image}" alt="${person.alt}" width="600" height="800" loading="lazy"><h3>${person.name}</h3><p class="role">${person.role}</p><p class="person-line">${person.line}</p></article>`).join("")}
                </div>
                <p class="caption">${c.instructors.caption}</p>
                <p class="caption">${c.instructors.note}</p>
            </div>
        </section>
        <section class="section apply-section" id="apply">
            <div class="container">
                <div class="application-card reveal">
                    <div class="application-copy">
                        ${heading(app)}
                        <p class="application-intro">${app.intro}</p>
                        <p class="application-note">${app.note}</p>
                        <p class="privacy">${icon("pin")}${app.privacy}</p>
                    </div>
                    <div class="application-main">
                        <form id="application-form" novalidate>
                            ${["name", "email"].map((field) => `<div class="field"><label for="${field}">${app.labels[field]}</label><input id="${field}" name="${field}" type="${field === "email" ? "email" : "text"}" autocomplete="${field}" placeholder="${app.placeholders[field]}" required aria-describedby="${field}-error"><p class="error" id="${field}-error" aria-live="polite"></p></div>`).join("")}
                            <div class="field">
                                <label for="track">${app.labels.track}</label>
                                <select id="track" name="track" required aria-describedby="track-error">
                                    <option value="">${app.placeholders.track}</option>
                                    ${app.tracks.map((track) => `<option value="${track.value}">${track.label}</option>`).join("")}
                                </select>
                                <p class="error" id="track-error" aria-live="polite"></p>
                            </div>
                            <div class="field">
                                <label for="why">${app.labels.why}</label>
                                <textarea id="why" name="why" rows="4" minlength="40" required placeholder="${app.placeholders.why}" aria-describedby="why-error why-counter"></textarea>
                                <p class="counter" id="why-counter"><span id="character-count">0</span> ${app.counter}</p>
                                <p class="error" id="why-error" aria-live="polite"></p>
                            </div>
                            <button class="button primary submit" type="submit" disabled>${app.submit}${icon("arrow")}</button>
                            <div class="draft-actions"><p class="caption draft-status" role="status"></p><button class="text-button link-draw" id="clear-draft" type="button">${app.clear}</button></div>
                        </form>
                        <div class="success-panel" id="success-panel" hidden tabindex="-1">
                            <span class="success-icon">${icon("check")}</span>
                            <h3>${app.successTitle}</h3>
                            <p>${app.success}</p>
                            <p class="success-note">${app.successNote}</p>
                            <button type="button" class="button secondary" id="edit-application">${app.edit}</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="section faq-section" id="faq">
            <div class="container faq-reading">
                <div class="section-heading reveal">${heading(c.faq)}</div>
                <div class="faq-list">
                    ${c.faq.rows.map((row) => `<details class="faq-row reveal"><summary>${row.question}${icon("plus")}</summary><p>${row.answer}</p></details>`).join("")}
                </div>
            </div>
        </section>
    </main>
    <footer>
        <div class="container footer-inner">
            <div><a class="brand footer-brand" href="./index.html">${brand()}</a><p class="footer-email">${c.footer.email}</p><p class="caption">${c.footer.emailNote}</p></div>
            <div class="footer-right"><p>${c.footer.copyright}</p><a class="link-draw" href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a><span aria-hidden="true"> · </span><a class="link-draw" href="${c.footer.noticeUrl}">${c.footer.notice}</a></div>
        </div>
    </footer>`;

const schoolSlug = c.school.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const storageKey = `${schoolSlug}:app`;
const fields = ["name", "email", "track", "why"];
const emptyDraft = () => ({ name: "", email: "", track: "", format: "", why: "", sent: false });
let draft = emptyDraft();
let storageAvailable = true;
const touched = new Set();
const form = document.querySelector("#application-form");
const success = document.querySelector("#success-panel");
const draftStatus = document.querySelector(".draft-status");
const submit = form.querySelector('[type="submit"]');

try
{
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object")
    {
        for (const field of [...fields, "format"])
        {
            if (typeof saved[field] === "string")
            {
                draft[field] = saved[field];
            }
        }
        draft.sent = saved.sent === true;
    }
}
catch
{
    storageAvailable = false;
}

for (const field of fields)
{
    form.elements[field].value = draft[field];
}
draft.track = form.elements.track.value;
draft.format = app.tracks.find((track) => track.value === draft.track)?.format || "";

function valid(field)
{
    const value = draft[field].trim();
    if (field === "email")
    {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if (field === "track")
    {
        return app.tracks.some((track) => track.value === value);
    }
    return value.length >= (field === "why" ? 40 : 1);
}

function refresh()
{
    for (const field of fields)
    {
        const invalid = touched.has(field) && !valid(field);
        document.querySelector(`#${field}-error`).textContent = invalid ? app.errors[field] : "";
        form.elements[field].setAttribute("aria-invalid", String(invalid));
    }
    document.querySelector("#character-count").textContent = draft.why.trim().length;
    submit.disabled = !storageAvailable || !fields.every(valid);
    if (!storageAvailable)
    {
        draftStatus.textContent = app.unavailable;
    }
}

function persist()
{
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(draft));
        draftStatus.textContent = app.draft;
        return true;
    }
    catch
    {
        storageAvailable = false;
        draftStatus.textContent = app.unavailable;
        refresh();
        return false;
    }
}

function showSaved(focus = false)
{
    const saved = draft.sent && fields.every(valid);
    form.hidden = saved;
    success.hidden = !saved;
    if (saved && focus)
    {
        success.focus();
    }
}

for (const field of fields)
{
    const input = form.elements[field];
    input.addEventListener("input", () =>
    {
        draft[field] = input.value;
        draft.format = app.tracks.find((track) => track.value === draft.track)?.format || "";
        draft.sent = false;
        persist();
        refresh();
    });
    input.addEventListener("blur", () =>
    {
        touched.add(field);
        refresh();
    });
}

form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    fields.forEach((field) => touched.add(field));
    refresh();
    if (!storageAvailable || !fields.every(valid))
    {
        fields.find((field) => !valid(field)) && form.elements[fields.find((field) => !valid(field))].focus();
        return;
    }
    draft.sent = true;
    if (persist())
    {
        showSaved(true);
    }
    else
    {
        draft.sent = false;
    }
});

document.querySelector("#edit-application").addEventListener("click", () =>
{
    draft.sent = false;
    persist();
    showSaved();
    refresh();
    form.elements.name.focus();
});

document.querySelector("#clear-draft").addEventListener("click", () =>
{
    try
    {
        localStorage.removeItem(storageKey);
        storageAvailable = true;
        draft = emptyDraft();
        touched.clear();
        form.reset();
        draftStatus.textContent = app.cleared;
        refresh();
        form.elements.name.focus();
    }
    catch
    {
        storageAvailable = false;
        refresh();
    }
});

document.querySelectorAll(".plan-choice").forEach((choice) =>
{
    choice.addEventListener("click", () =>
    {
        document.querySelectorAll(".plan").forEach((plan) => plan.classList.remove("selected"));
        choice.closest(".plan").classList.add("selected");
        document.querySelector(".plan-status").textContent = `${c.tuition.selected} ${c.tuition.plans[Number(choice.dataset.plan)].name}. ${c.tuition.selectionNote}`;
    });
});

refresh();
showSaved();

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches && "IntersectionObserver" in window)
{
    const observer = new IntersectionObserver((entries) =>
    {
        for (const entry of entries)
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        }
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((block) =>
    {
        block.classList.add("will-reveal");
        observer.observe(block);
    });
    const counterObserver = new IntersectionObserver((entries) =>
    {
        for (const entry of entries)
        {
            if (!entry.isIntersecting)
            {
                continue;
            }
            const stat = c.outcomes.stats[Number(entry.target.dataset.stat)];
            const start = performance.now();
            const count = (now) =>
            {
                if (reduced.matches)
                {
                    entry.target.textContent = `${stat.prefix}${stat.value}${stat.suffix}`;
                    return;
                }
                const progress = Math.min((now - start) / 700, 1);
                entry.target.textContent = `${stat.prefix}${Math.round(stat.value * (1 - (1 - progress) ** 3))}${stat.suffix}`;
                if (progress < 1)
                {
                    requestAnimationFrame(count);
                }
            };
            requestAnimationFrame(count);
            counterObserver.unobserve(entry.target);
        }
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-stat]").forEach((stat) => counterObserver.observe(stat));
    const timeline = document.querySelector(".timeline");
    const rail = document.querySelector(".timeline-rail span");
    let ticking = false;
    const updateRail = () =>
    {
        const bounds = timeline.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight * 0.8 - bounds.top) / bounds.height));
        rail.style.transform = `scaleY(${reduced.matches ? 1 : progress})`;
        ticking = false;
    };
    addEventListener("scroll", () =>
    {
        if (!ticking)
        {
            requestAnimationFrame(updateRail);
            ticking = true;
        }
    }, { passive: true });
    updateRail();
}
