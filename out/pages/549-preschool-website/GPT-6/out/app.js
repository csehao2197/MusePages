import { content as c } from "./content.js";
import { icons } from "./icons.js";

const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const icon = (name) => icons[name];
const eyebrow = (text) => `<p class="eyebrow">${escape(text)}</p>`;
const image = (data, className = "", eager = false) => `<img class="${className}" src="${data.path}" alt="${escape(data.alt)}" style="object-position:${data.position}" width="2000" height="1459" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
const button = (href, text, className = "tour-button") => `<a class="button ${className}" href="${href}">${escape(text)}</a>`;
const teacherImage = (teacher) => ({ path: teacher.image, alt: teacher.alt, position: teacher.position });

document.getElementById("site").innerHTML = `
    <a class="skip-link" href="#main">${escape(c.nav.skip)}</a>
    <header class="header">
        <div class="container header-inner">
            <a class="wordmark" href="${c.nav.home}">${escape(c.school)}<span>${escape(c.nav.ages)} · ${escape(c.city)}</span></a>
            <nav aria-label="${c.nav.label}">${c.nav.links.map(([label, href]) => `<a class="link-draw" href="${href}">${escape(label)}</a>`).join("")}</nav>
            ${button("#tour", c.nav.tour)}
        </div>
    </header>
    <main id="main">
        <section class="hero">
            <div class="container">
                <div class="hero-grid">
                    <div class="hero-copy">
                        <div class="hero-eyebrow">${icon("Sun")}${eyebrow(`${c.hero.eyebrow} · ${c.city}`)}</div>
                        <h1>${escape(c.hero.heading)}<br><span>${escape(c.hero.accent)}</span></h1>
                        <p class="lead">${escape(c.hero.lead)}</p>
                        <div class="hero-actions">${button("#tour", c.nav.tour)}${button("#day", c.hero.secondary, "secondary")}</div>
                        <a class="first-hello" href="#teachers">
                            ${image(teacherImage(c.teachers.items[0]), "", true)}
                            <span>${escape(c.hero.meet)}<small>${escape(c.hero.teacher)}</small></span>
                        </a>
                    </div>
                    <figure class="hero-photo">
                        <div class="photo-frame">${image(c.images.room, "", true)}</div>
                        <figcaption>${escape(c.hero.caption)}</figcaption>
                    </figure>
                </div>
                <div class="trust-strip">${c.hero.trusts.map((trust) => `
                    <div>${icon(trust.icon)}<p><strong>${escape(trust.title)}</strong><span>${escape(trust.text)}</span></p></div>
                `).join("")}</div>
            </div>
        </section>
        <section id="programs" class="section alternate">
            <div class="container">
                <div class="section-heading program-heading reveal">
                    <div>${eyebrow(c.programs.eyebrow)}<h2>${escape(c.programs.heading)}</h2></div>
                    <figure class="art-photo">${image(c.images.art)}<figcaption>${escape(c.programs.artCaption)}</figcaption></figure>
                </div>
                <div class="program-grid">
                    ${c.programs.items.map((program, index) => `
                        <article class="program-card reveal" style="--delay:${index * 75}ms">
                            <div class="program-top"><span class="icon-well">${icon(program.icon)}</span><span class="age-badge">${escape(program.age)}</span></div>
                            <h3>${escape(program.name)}</h3>
                            <p>${escape(program.description)}</p>
                            <div class="program-facts"><span><strong>${escape(program.ratio)}</strong> ${escape(c.programs.ratioLabel)}</span><span>${escape(program.days)}</span></div>
                        </article>
                    `).join("")}
                </div>
                <p class="section-note">${escape(c.programs.note)}</p>
            </div>
        </section>
        <section id="day" class="section">
            <div class="container">
                <div class="section-heading reveal">${eyebrow(c.day.eyebrow)}<h2>${escape(c.day.heading)}</h2><p class="lead">${escape(c.day.lead)}</p></div>
                <ol class="timeline reveal" aria-label="${c.day.timelineLabel}">
                    ${c.day.stops.map((stop, index) => `
                        <li class="${stop.highlight ? "lunch" : ""}" style="--stop-delay:${index * 120}ms">
                            <span class="timeline-dot" aria-hidden="true"></span>
                            <span class="time">${escape(stop.time)}</span>
                            <h3>${escape(stop.name)}</h3>
                            <p>${escape(stop.note)}</p>
                        </li>
                    `).join("")}
                </ol>
                <div class="outside-grid reveal">
                    <figure>${image(c.images.yard)}<figcaption>${escape(c.day.yardCaption)}</figcaption></figure>
                    <div>${eyebrow(c.day.outsideEyebrow)}<h3>${escape(c.day.outsideHeading)}</h3><p>${escape(c.day.outsideText)}</p><p class="outside-note">${icon("Check")}${escape(c.day.outsideNote)}</p></div>
                </div>
            </div>
        </section>
        <section id="teachers" class="section alternate">
            <div class="container">
                <div class="section-heading reveal">${eyebrow(c.teachers.eyebrow)}<h2>${escape(c.teachers.heading)}</h2><p class="lead">${escape(c.teachers.lead)}</p></div>
                <div class="teacher-grid">${c.teachers.items.map((teacher, index) => `
                    <article class="teacher-card reveal" style="--delay:${index * 75}ms">
                        <div class="teacher-photo">${image(teacherImage(teacher))}</div>
                        <div class="teacher-copy"><p class="fictional">${escape(c.teachers.fictional)}</p><h3>${escape(teacher.name)}</h3><p class="teacher-role">${escape(teacher.role)}</p><p class="teacher-line">${escape(teacher.line)}</p></div>
                    </article>
                `).join("")}</div>
                <p class="section-note">${escape(c.teachers.note)}<br>${escape(c.teachers.disclosure)}</p>
            </div>
        </section>
        <section id="tuition" class="section">
            <div class="container">
                <div class="tuition-block reveal">
                    ${eyebrow(c.tuition.eyebrow)}<h2>${escape(c.tuition.heading)}</h2><p class="lead">${escape(c.tuition.lead)}</p>
                    <table><thead><tr><th scope="col">${escape(c.tuition.schedule)}</th><th scope="col">${escape(c.tuition.monthly)}</th></tr></thead><tbody>
                        ${c.tuition.rows.map(([schedule, rate]) => `<tr><th scope="row">${escape(schedule)}</th><td>${escape(rate)}</td></tr>`).join("")}
                    </tbody></table>
                    <p class="tuition-caption">${icon("Check")}${escape(c.tuition.caption)}</p><p class="caption">${escape(c.tuition.disclaimer)}</p>
                </div>
                <div class="faq-block reveal">
                    ${eyebrow(c.faq.eyebrow)}<h2>${escape(c.faq.heading)}</h2>
                    ${c.faq.items.map(([question, answer]) => `<details><summary>${escape(question)}${icon("Plus")}</summary><p>${escape(answer)}</p></details>`).join("")}
                </div>
            </div>
        </section>
        <section id="tour" class="section alternate">
            <div class="container">
                <div class="tour-heading reveal">${eyebrow(c.tour.eyebrow)}<h2>${escape(c.tour.heading)}</h2><p class="lead">${escape(c.tour.lead)}</p></div>
                <div class="tour-panel reveal">
                    <p class="demo-label">${icon("Smile")}${escape(c.tour.privacy)}</p>
                    <p class="caption demo-note">${escape(c.tour.privacyNote)}</p>
                    <div id="form-content"></div>
                    <p id="storage-warning" class="storage-warning" role="status" hidden></p>
                </div>
            </div>
        </section>
    </main>
    <footer>
        <div class="container">
            <div class="footer-main">
                <div><a class="footer-wordmark" href="${c.nav.home}">${escape(c.school)}</a><p>${escape(c.footer.address)}</p><p>${escape(c.footer.licenseNote)}</p></div>
                <div><a class="link-draw" href="${c.footer.phoneLink}">${escape(c.footer.phone)}</a><a class="link-draw email" href="mailto:hello@${c.emailDomain}">hello@${c.emailDomain}</a></div>
                <div><strong>${escape(c.footer.hoursTitle)}</strong><p>${escape(c.footer.hours)}<br>${escape(c.footer.tours)}</p><p>${escape(c.footer.licensed)}</p></div>
            </div>
            <div class="footer-bottom"><span>© ${escape(c.school)}. ${escape(c.footer.copyright)}</span><a class="link-draw" href="${c.footer.creditUrl}">${escape(c.footer.credit)}</a></div>
        </div>
    </footer>`;

const defaults = { day: "", time: "", age: "", name: "", phone: "", sent: false };
const key = `${c.schoolSlug}:tour`;
let warning = "";
let state = { ...defaults };

function validFields(value)
{
    return c.tour.days.includes(value.day) && c.tour.times.includes(value.time) &&
        c.tour.ages.includes(value.age) && value.name.trim().length > 0 &&
        value.name.trim().length <= 60 && /^[+\d\s().-]+$/.test(value.phone) &&
        value.phone.replace(/\D/g, "").length >= 10 && value.phone.replace(/\D/g, "").length <= 15;
}

function restore()
{
    try
    {
        const saved = JSON.parse(localStorage.getItem(key) || "null");
        if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;
        for (const field of ["day", "time", "age", "name", "phone"])
        {
            if (typeof saved[field] === "string") state[field] = saved[field].slice(0, field === "name" ? 60 : 40);
        }
        if (!c.tour.days.includes(state.day)) state.day = "";
        if (!c.tour.times.includes(state.time)) state.time = "";
        if (!c.tour.ages.includes(state.age)) state.age = "";
        state.sent = saved.sent === true && validFields(state);
    }
    catch
    {
        warning = c.tour.restoreWarning;
    }
}

function showStorageWarning()
{
    const node = document.getElementById("storage-warning");
    node.textContent = warning;
    node.hidden = !warning;
}

function persist()
{
    try
    {
        localStorage.setItem(key, JSON.stringify(state));
        warning = "";
    }
    catch
    {
        warning = c.tour.storedWarning;
    }
    showStorageWarning();
}

function chips(field, label, values)
{
    return `<fieldset><legend>${escape(label)}</legend><div class="chips">${values.map((value) => `
        <label class="chip"><input type="radio" name="${field}" value="${escape(value)}" ${state[field] === value ? "checked" : ""} aria-describedby="${field}-error"><span>${escape(value)}</span></label>
    `).join("")}</div><p class="field-error" id="${field}-error" hidden></p></fieldset>`;
}

function renderForm(focus = false)
{
    const root = document.getElementById("form-content");
    if (state.sent)
    {
        root.innerHTML = `
            <div class="booked" role="status">
                <svg class="sticker" viewBox="0 0 210 74" aria-hidden="true"><path d="M12 5 35 9 54 3 74 8 96 3 119 9 143 4 164 9 189 5 204 19 198 37 206 55 190 69 164 64 140 71 117 66 95 72 74 66 50 71 30 65 12 70 5 52 10 34 3 19Z" fill="currentColor"/><text x="105" y="45" text-anchor="middle">${escape(c.tour.sticker)}</text></svg>
                <h3 tabindex="-1" id="booked-heading">${escape(c.tour.bookedBefore)}${escape(state.name)}${escape(c.tour.bookedAfter)}</h3>
                <p class="eyebrow">${escape(c.tour.echo)}</p>
                <p class="booked-echo">${escape(state.day)} · ${escape(state.time)} · ${escape(c.tour.ageEcho)} ${escape(state.age)}</p>
                <p>${escape(c.tour.bookedNote)}</p>
                <button class="button secondary" type="button" id="change-tour">${escape(c.tour.change)}</button>
            </div>`;
        document.getElementById("change-tour").addEventListener("click", () =>
        {
            state.sent = false;
            persist();
            renderForm(true);
        });
        if (focus) document.getElementById("booked-heading").focus();
        return;
    }

    root.innerHTML = `
        <form id="tour-form" novalidate>
            <p class="error-summary" id="error-summary" role="alert" hidden></p>
            ${chips("day", c.tour.dayLabel, c.tour.days)}
            ${chips("time", c.tour.timeLabel, c.tour.times)}
            <div class="field"><label for="age">${escape(c.tour.ageLabel)}</label><select id="age" name="age" aria-describedby="age-error">
                <option value="">${escape(c.tour.agePlaceholder)}</option>${c.tour.ages.map((age) => `<option value="${age}" ${state.age === age ? "selected" : ""}>${age} ${escape(c.tour.ageSuffix)}</option>`).join("")}
            </select><p class="field-error" id="age-error" hidden></p></div>
            <div class="field"><label for="name">${escape(c.tour.nameLabel)}</label><input id="name" name="name" autocomplete="off" maxlength="60" value="${escape(state.name)}" placeholder="${escape(c.tour.namePlaceholder)}" aria-describedby="name-error"><p class="field-error" id="name-error" hidden></p></div>
            <div class="field"><label for="phone">${escape(c.tour.phoneLabel)}</label><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" value="${escape(state.phone)}" placeholder="${escape(c.tour.phonePlaceholder)}" aria-describedby="phone-error"><p class="field-error" id="phone-error" hidden></p></div>
            <button class="button tour-button submit" type="submit">${escape(c.tour.request)}</button>
            <p class="form-caption">${escape(c.tour.caption)}</p>
        </form>`;
    const form = document.getElementById("tour-form");
    form.addEventListener("input", (event) =>
    {
        const field = event.target.name;
        if (!(field in defaults) || field === "sent") return;
        state[field] = event.target.value;
        const error = document.getElementById(`${field}-error`);
        error.hidden = true;
        form.querySelectorAll(`[name="${field}"]`).forEach((node) => node.removeAttribute("aria-invalid"));
        if (![...form.querySelectorAll(".field-error")].some((node) => !node.hidden))
        {
            document.getElementById("error-summary").hidden = true;
        }
        persist();
    });
    form.addEventListener("submit", (event) =>
    {
        event.preventDefault();
        const errors =
        {
            day: !c.tour.days.includes(state.day),
            time: !c.tour.times.includes(state.time),
            age: !c.tour.ages.includes(state.age),
            name: !state.name.trim() || state.name.trim().length > 60,
            phone: !/^[+\d\s().-]+$/.test(state.phone) || state.phone.replace(/\D/g, "").length < 10 || state.phone.replace(/\D/g, "").length > 15
        };
        let first;
        for (const [field, invalid] of Object.entries(errors))
        {
            const message = document.getElementById(`${field}-error`);
            message.textContent = invalid ? c.tour.errors[field] : "";
            message.hidden = !invalid;
            form.querySelectorAll(`[name="${field}"]`).forEach((node) =>
            {
                node.setAttribute("aria-invalid", String(invalid));
                if (invalid && !first) first = node;
            });
        }
        if (first)
        {
            const summary = document.getElementById("error-summary");
            summary.textContent = c.tour.errorSummary;
            summary.hidden = false;
            form.classList.remove("shake");
            void form.offsetWidth;
            form.classList.add("shake");
            first.focus();
            return;
        }
        state.name = state.name.trim();
        state.phone = state.phone.trim();
        state.sent = true;
        persist();
        renderForm(true);
    });
    if (focus) form.querySelector("input").focus();
}

restore();
renderForm();
showStorageWarning();

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!reduced.matches && "IntersectionObserver" in window)
{
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
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach((node) =>
    {
        node.classList.add("will-reveal");
        observer.observe(node);
    });
    reduced.addEventListener("change", (event) =>
    {
        if (event.matches)
        {
            observer.disconnect();
            document.querySelectorAll(".will-reveal").forEach((node) => node.classList.add("visible"));
        }
    });
}
