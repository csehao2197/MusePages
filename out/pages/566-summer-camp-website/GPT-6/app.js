import { content as c } from "./content.js";
import { icon, canoe, scene, disc, cabin, avatar } from "./art.js";

const anchor = (label, id, classes = "") => `<a class="${classes}" href="./index.html#${id}">${label}</a>`;
const nav = () => c.nav.map(([label, id]) => anchor(label, id)).join("");
const heading = (section) => `<p class="eyebrow">${section.eyebrow}</p><h2>${section.title.replaceAll("\n", "<br>")}</h2>${section.intro ? `<p class="intro">${section.intro}</p>` : ""}`;
const r = c.registration;

document.querySelector("#app").innerHTML = `
    <a class="skip" href="#main">${c.skip}</a>
    <header>
        <div class="container header-inner">
            <a class="wordmark" href="./index.html" aria-label="${c.header.home}">${canoe()}<span>${c.brand}</span></a>
            <nav class="desktop-nav" aria-label="Main">${nav()}</nav>
            <div class="header-actions">${anchor(c.header.register, "register", "button primary small")}<button class="menu-button" aria-expanded="false" aria-controls="mobile-nav">${c.header.menu}<span class="menu-lines" aria-hidden="true"></span></button></div>
        </div>
        <nav id="mobile-nav" aria-label="Mobile" hidden>${nav()}${anchor(c.header.register, "register")}</nav>
    </header>
    <main id="main">
        <section class="hero" aria-labelledby="hero-title">
            ${scene(c.hero.sceneAlt)}
            <div class="container hero-inner">
                <div class="hero-card">
                    <p class="eyebrow">${icon("sun", 19)} ${c.hero.eyebrow}</p>
                    <h1 id="hero-title">${c.hero.title}</h1>
                    <p class="hero-description">${c.hero.text}</p>
                    <div class="cta-row">${c.hero.ctas.map(([text, id], i) => anchor(text + (i === 0 ? icon("arrow", 18) : ""), id, `button ${i === 0 ? "primary" : "outline"}`)).join("")}</div>
                    <div class="hero-chips">${c.hero.chips.map((text) => `<span>${icon("check", 14)}${text}</span>`).join("")}</div>
                </div>
                <div class="camp-stamp" aria-hidden="true"><span>✦</span>${c.hero.stamp.join("<br>")}<span>✦</span></div>
            </div>
        </section>
        <section class="photos section container" aria-label="Camp postcards">
            <p class="eyebrow centered">${c.photos.eyebrow}</p>
            <div class="photo-grid">
                ${c.photos.items.map(([file, alt, caption], i) => `<figure class="print reveal" style="--turn:${[-2, 1, 2][i]}deg;--i:${i}"><img src="./images/${file}" alt="${alt}" width="640" height="480"><figcaption>${caption}</figcaption></figure>`).join("")}
            </div>
            <p class="photo-caption">${c.photos.caption}</p>
            <p class="fineprint centered">${c.photos.disclosure}</p>
        </section>
        <section id="programs" class="section programs">
            <div class="container">
                <div class="section-heading centered">${heading(c.programs)}</div>
                <p class="fineprint centered">${c.programs.hint}</p>
                <div class="program-grid">
                    ${c.programs.items.map((p, i) => `<article class="program-card reveal" style="--i:${i}">
                        <div class="program-top">${disc(p.icon)}<span class="age-badge">${c.programs.agePrefix} ${p.ages}</span></div>
                        <h3>${p.name}</h3><p class="program-note">${p.note}</p>
                        <div class="activity-chips">${p.activities.map(([name, type, detail]) => `<button class="activity ${type}" type="button" aria-pressed="false" data-detail="${detail}">${name}</button>`).join("")}</div>
                        <p class="ratio">${icon("check", 17)}${p.ratio}</p>
                    </article>`).join("")}
                </div>
                <p id="activity-detail" class="activity-detail" role="status">${c.programs.selected}</p>
                <p class="program-footnote">${icon("sun", 22)}${c.programs.footnote}</p>
            </div>
        </section>
        <section id="week" class="section week">
            <div class="container">
                <div class="heading-row"><div>${heading(c.week)}</div><div class="arrows"><button id="week-prev" class="round-button" aria-label="${c.week.previous}">${icon("arrow")}</button><button id="week-next" class="round-button" aria-label="${c.week.next}">${icon("arrow")}</button></div></div>
                <p class="fineprint">${c.week.hint}</p>
                <div class="week-strip" tabindex="0" role="region" aria-label="${c.week.label}">
                    ${c.week.days.map(([day, theme, activities], i) => `<article class="day-card"><span class="day-number">0${i + 1}</span><p class="day-name">${day}</p><h3>${theme}</h3><div class="day-activities">${activities.map((text) => `<span>${text}</span>`).join("")}</div></article>`).join("")}
                </div>
                <div class="rhythm reveal"><p>${c.week.rhythmTitle}</p><ol>${c.week.rhythm.map((text, i) => `<li style="--station:${i}"><span>0${i + 1}</span>${text}</li>`).join("")}</ol></div>
            </div>
        </section>
        <section id="cabins" class="section cabins">
            <div class="container cabin-grid">
                <div>${heading(c.cabins)}<p class="intro">${c.cabins.text}</p>
                    <div class="little-cabins">${c.cabins.names.map((name, i) => `<article class="little-cabin reveal" style="--i:${i}">${cabin()}<h3>${name}</h3><p>${c.cabins.occupancy.replace("\n", "<br>")}</p></article>`).join("")}</div>
                    <p class="cabin-joke">${c.cabins.joke}</p>
                </div>
                <article class="safety-card reveal"><h3>${icon("shield", 31)}${c.cabins.safetyTitle}</h3>
                    <ul>${c.cabins.safety.map(([title, detail]) => `<li>${icon("check", 23)}<div><strong>${title}</strong><p>${detail}</p></div></li>`).join("")}</ul>
                    <p class="fineprint">${c.cabins.disclaimer}</p>
                </article>
            </div>
        </section>
        <section class="section staff container">
            <div class="section-heading centered">${heading(c.staff)}</div>
            <div class="staff-grid">${c.staff.items.map(([name, role, note, tone, style], i) => `<article class="person reveal" style="--i:${i}">${avatar(tone, style)}<h3>${name}</h3><p class="role">${role}</p><p>${note}</p></article>`).join("")}</div>
        </section>
        <section id="fees" class="section fees">
            <div class="container">
                <div class="section-heading centered">${heading(c.fees)}</div>
                <div class="table-wrap"><table><thead><tr>${c.fees.headings.map((title) => `<th scope="col">${title}</th>`).join("")}</tr></thead>
                    <tbody>${c.fees.sessions.map((session, i) => `<tr class="reveal" style="--i:${i}"><th scope="row">${session.name}<span>${session.duration}</span></th><td data-label="${c.fees.headings[1]}">${session.ages}</td><td class="price" data-label="${c.fees.headings[2]}">${session.price}</td><td data-label="${c.fees.headings[3]}">${session.includes}</td></tr>`).join("")}</tbody>
                </table></div>
                <p class="fees-note">${c.fees.footnote}</p><p class="fineprint centered">${c.fees.limit}</p>
            </div>
        </section>
        <section id="register" class="section register container">
            <div class="register-intro">${heading(r)}<div class="registration-art">${disc("compass")}<span>${r.art.join("<br>")}</span></div><p class="local-notice">${r.notice}</p></div>
            <div class="form-panel">
                <form id="registration-form" aria-label="Local camp registration">
                    <div class="form-fields">
                        <label>${r.labels.camper}<input name="camper" required maxlength="60" autocomplete="off"></label>
                        <label>${r.labels.age}<select name="age" required><option value="">${r.chooseAge}</option>${Array.from({ length: 8 }, (_, i) => `<option value="${i + 7}">${i + 7}</option>`).join("")}</select></label>
                        <label class="wide">${r.labels.session}<select name="session" required><option value="">${r.chooseSession}</option>${c.fees.sessions.map((s) => `<option value="${s.id}">${s.name} — ${s.price} · ${s.ages}</option>`).join("")}</select></label>
                        <label class="wide">${r.labels.buddy} <span class="optional">(${r.optional})</span><input name="buddy" maxlength="80" autocomplete="off"></label>
                        <label>${r.labels.parent}<input name="parent" required maxlength="80" autocomplete="off"></label>
                        <label>${r.labels.email}<input type="email" name="email" required maxlength="120" autocomplete="off"></label>
                        <label class="wide">${r.labels.notes} <span class="optional">(${r.optional})</span><textarea name="notes" rows="3" maxlength="800" placeholder="${r.notesPlaceholder}"></textarea></label>
                    </div>
                    <button class="button primary save" type="submit">${r.save}${icon("arrow", 20)}</button>
                    <p class="form-small">${r.local}</p>
                </form>
                <div id="confirmation" tabindex="-1" hidden>
                    <div class="confirmation-check">${icon("check", 44)}</div><h3>${r.saved}</h3><p class="confirmation-notice">${r.savedNotice}</p>
                    <div class="saved-summary"><span>${r.summary}</span><strong id="saved-camper"></strong><p id="saved-session"></p></div>
                    <p>${r.savedLimit}</p><div class="confirmation-actions"><button type="button" class="button primary" id="edit">${r.edit}</button><button type="button" class="button outline" id="clear">${r.clear}</button></div>
                </div>
                <p id="form-message" role="status" aria-live="polite"></p>
            </div>
        </section>
        <section class="section faq">
            <div class="container"><div class="section-heading centered">${heading(c.faq)}</div>
                <div class="faq-list">${c.faq.items.map(([q, a], i) => `<div class="faq-item"><h3><button type="button" aria-expanded="false" aria-controls="answer-${i}" id="question-${i}">${q}${icon("plus")}</button></h3><div class="faq-answer" id="answer-${i}" role="region" aria-labelledby="question-${i}" hidden><p>${a}</p></div></div>`).join("")}</div>
            </div>
        </section>
    </main>
    <footer><div class="container">
        <a class="wordmark" href="./index.html">${canoe()}${c.brand}</a>
        <p>${c.footer.address}</p><nav aria-label="Footer">${nav()}</nav>
        <div class="footer-small"><span>${c.footer.note}</span><a href="${c.footer.href}" rel="noreferrer">${c.footer.credit}</a></div>
        <p class="fineprint">${c.footer.fiction}</p>
    </div></footer>`;

const menu = document.querySelector(".menu-button");
const mobileNav = document.querySelector("#mobile-nav");
const sceneViewport = window.matchMedia("(max-width: 600px)");
function cropScene()
{
    document.querySelector(".camp-scene").setAttribute("preserveAspectRatio", sceneViewport.matches ? "xMaxYMid slice" : "xMidYMid slice");
}
cropScene();
sceneViewport.addEventListener("change", cropScene);
function closeMenu()
{
    menu.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
    menu.firstChild.textContent = c.header.menu;
}
menu.addEventListener("click", () =>
{
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
    menu.firstChild.textContent = open ? c.header.close : c.header.menu;
});
mobileNav.addEventListener("click", (event) =>
{
    if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !mobileNav.hidden)
    {
        closeMenu();
        menu.focus();
    }
});
window.matchMedia("(min-width: 901px)").addEventListener("change", (event) =>
{
    if (event.matches) closeMenu();
});
const header = document.querySelector("header");
function updateHeader()
{
    header.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll(".activity").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const selected = button.getAttribute("aria-pressed") !== "true";
        document.querySelectorAll(".activity").forEach((chip) => chip.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", String(selected));
        document.querySelector("#activity-detail").textContent = selected ? `${button.textContent}: ${button.dataset.detail}` : c.programs.selected;
    });
});

const strip = document.querySelector(".week-strip");
const prev = document.querySelector("#week-prev");
const next = document.querySelector("#week-next");
function updateArrows()
{
    prev.disabled = strip.scrollLeft < 2;
    next.disabled = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
}
function moveWeek(direction)
{
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollBy({ left: direction * 264, behavior: reduced ? "instant" : "smooth" });
}
prev.addEventListener("click", () => moveWeek(-1));
next.addEventListener("click", () => moveWeek(1));
strip.addEventListener("scroll", updateArrows, { passive: true });
window.addEventListener("resize", updateArrows);
strip.addEventListener("keydown", (event) =>
{
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
    {
        event.preventDefault();
        if (event.key === "Home" || event.key === "End") strip.scrollLeft = event.key === "Home" ? 0 : strip.scrollWidth;
        else moveWeek(event.key === "ArrowRight" ? 1 : -1);
    }
});
updateArrows();

document.querySelectorAll(".faq-item button").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const open = button.getAttribute("aria-expanded") !== "true";
        document.querySelectorAll(".faq-item button").forEach((other) =>
        {
            const active = other === button && open;
            other.setAttribute("aria-expanded", String(active));
            document.getElementById(other.getAttribute("aria-controls")).hidden = !active;
        });
    });
});

const storageKey = "camp-registration.v1";
const form = document.querySelector("#registration-form");
const confirmation = document.querySelector("#confirmation");
const message = document.querySelector("#form-message");
const fieldNames = Object.keys(r.labels);
const fields = Object.fromEntries(fieldNames.map((name) => [name, form.elements.namedItem(name)]));

function validateSession()
{
    const selected = c.fees.sessions.find((s) => s.id === fields.session.value);
    const age = Number(fields.age.value);
    fields.session.setCustomValidity(selected && age && (age < selected.min || age > selected.max) ? r.sessionError : "");
}
fields.age.addEventListener("change", validateSession);
fields.session.addEventListener("change", validateSession);

function showConfirmation(data, focus = true)
{
    document.querySelector("#saved-camper").textContent = `${data.camper} · ${data.age}`;
    document.querySelector("#saved-session").textContent = c.fees.sessions.find((s) => s.id === data.session).name;
    form.hidden = true;
    confirmation.hidden = false;
    message.textContent = "";
    if (focus) confirmation.focus({ preventScroll: true });
}

form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    validateSession();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(fieldNames.map((name) => [name, fields[name].value.trim()]));
    if (!data.camper || !data.parent)
    {
        const field = !data.camper ? fields.camper : fields.parent;
        field.value = "";
        field.reportValidity();
        return;
    }
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(data));
        showConfirmation(data);
    }
    catch
    {
        message.textContent = r.unavailable;
    }
});

document.querySelector("#edit").addEventListener("click", () =>
{
    confirmation.hidden = true;
    form.hidden = false;
    fields.camper.focus({ preventScroll: true });
});
document.querySelector("#clear").addEventListener("click", () =>
{
    try
    {
        localStorage.removeItem(storageKey);
        confirmation.hidden = true;
        form.hidden = false;
        form.reset();
        fields.session.setCustomValidity("");
        message.textContent = r.cleared;
        fields.camper.focus({ preventScroll: true });
    }
    catch
    {
        message.textContent = r.unavailable;
    }
});

function restore()
{
    try
    {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return;
        const data = JSON.parse(saved);
        if (!data || !fieldNames.every((key) => typeof data[key] === "string")) throw Error("Invalid local draft");
        const session = c.fees.sessions.find((s) => s.id === data.session);
        if (!session || !Number.isInteger(Number(data.age)) || Number(data.age) < session.min || Number(data.age) > session.max) throw Error("Invalid session");
        fieldNames.forEach((key) => { fields[key].value = data[key]; });
        if (!form.checkValidity() || !data.camper.trim() || !data.parent.trim()) throw Error("Invalid local draft");
        showConfirmation(data, false);
    }
    catch
    {
        form.reset();
        message.textContent = r.unreadable;
    }
}
restore();
window.addEventListener("storage", (event) =>
{
    if (event.key === storageKey && event.newValue === null)
    {
        form.reset();
        fields.session.setCustomValidity("");
        form.hidden = false;
        confirmation.hidden = true;
        message.textContent = r.storageRemoved;
    }
});

if ("IntersectionObserver" in window)
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
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}
