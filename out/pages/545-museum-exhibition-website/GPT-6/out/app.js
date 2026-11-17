import { content as c } from "./content.js";
import { icons } from "./icons.js";

const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name].node.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([key]) => key !== "key").map(([key, value]) => `${key}="${escape(value)}"`).join(" ")}></${tag}>`).join("")}</svg>`;
const label = (text) => `<div class="section-label">${escape(text)}</div>`;
const linkList = () => c.navigation.links.map(([text, url]) => `<a href="${url}">${escape(text)}</a>`).join("");
const art =
{
    book: `<svg viewBox="0 0 240 240" aria-hidden="true"><path fill="#17181C" d="M63 36h118v168H63z"/><path fill="#2545C8" d="M63 36h15v168H63z"/><path fill="none" stroke="#FAF8F3" stroke-width="1.6" d="M142 124c0-25-37-27-37-2 0 19 28 21 28 3 0-12-18-13-18-1 0 6 9 7 9 1"/><path stroke="#DEDBD4" d="M82 194h92M82 198h92"/></svg>`,
    cord: `<svg viewBox="0 0 240 240" aria-hidden="true"><g fill="none" stroke="#9B8D73" stroke-width="4"><circle cx="120" cy="120" r="66"/><circle cx="120" cy="120" r="54"/><circle cx="120" cy="120" r="42"/><circle cx="120" cy="120" r="30"/><circle cx="120" cy="120" r="18"/><path d="M185 118v62l-12 16"/></g><g fill="#7A6D56"><circle cx="120" cy="54" r="5"/><circle cx="174" cy="120" r="5"/><circle cx="120" cy="162" r="5"/><circle cx="90" cy="120" r="5"/><circle cx="120" cy="102" r="5"/><circle cx="185" cy="179" r="5"/></g></svg>`,
    glass: `<svg viewBox="0 0 240 240" aria-hidden="true"><path d="M91 36h58c23 30 13 62-19 84 32 22 42 54 19 84H91c-23-30-13-62 19-84-32-22-42-54-19-84z" fill="#F7F7F4" stroke="#17181C" stroke-width="1.5"/><path d="M87 170h66c-1 13-5 22-10 29H97c-5-7-9-16-10-29z" fill="#17181C"/><path stroke="#17181C" stroke-width="1.5" d="M87 36h66M87 204h66"/><path stroke="#999A96" d="M98 53c-13 21-4 37 16 54"/></svg>`
};

document.querySelector("#site").innerHTML = `
    <a class="skip" href="#exhibition">${c.navigation.skip}</a>
    <header class="site-header">
        <div class="container header-inner">
            <a class="wordmark" href="#exhibition">${c.brand}</a>
            <nav class="desktop-nav" aria-label="${c.navigation.mainLabel}">${linkList()}</nav>
            <a class="ticket-link" href="#tickets">${c.navigation.tickets}${icon("ArrowUpRight")}</a>
            <button class="menu-toggle" aria-label="${c.navigation.menu}" aria-controls="mobile-navigation" aria-expanded="false">${icon("Menu")}</button>
        </div>
        <nav class="mobile-nav" id="mobile-navigation" aria-label="${c.navigation.mobileLabel}" hidden>${linkList()}<a href="#tickets">${c.navigation.tickets}</a></nav>
    </header>
    <main id="exhibition">
        <section class="hero container" aria-labelledby="show-title">
            <div class="hero-grid">
                <div class="hero-copy">
                    <div class="eyebrow">${c.hero.eyebrow}</div>
                    <h1 id="show-title">${c.hero.title.map((word) => `<span>${word}</span>`).join("")}</h1>
                    <p class="hero-description">${c.hero.description}</p>
                    <a class="text-link" href="#visit">${c.hero.link}${icon("ArrowDown")}</a>
                </div>
                <figure class="hero-figure">
                    <img class="hero-image" src="${c.objects.items[0].image}" alt="${c.objects.items[0].alt}" width="2000" height="1500" fetchpriority="high">
                    <figcaption class="hero-caption mono">${c.hero.caption}<span>${c.hero.collection}</span></figcaption>
                </figure>
            </div>
            <div class="hero-end"><span class="mono">${c.hero.index}</span><span class="mono">${c.hero.marker}</span></div>
        </section>
        <section class="intro">
            <div class="container intro-grid reveal">
                <p>${c.introduction.copy}</p>
                <div class="stats">${c.introduction.stats.map(([value, text]) => `<div class="stat"><strong>${value}</strong><span class="mono">${text}</span></div>`).join("")}</div>
            </div>
        </section>
        <section id="objects" class="section">
            <div class="container">
                ${label(c.objects.label)}
                <div class="section-heading reveal"><h2>${c.objects.title}</h2><p>${c.objects.description}</p></div>
                <div class="object-list">
                    ${c.objects.items.map((object, index) => `
                        <article class="object-row reveal">
                            <figure>
                                <div class="object-frame" data-object="${index}" role="group" aria-label="${escape(object.name)} ${c.objects.frameSuffix}" style="aspect-ratio:${object.ratio}">
                                    <img src="${object.image}" alt="${escape(object.alt)}" loading="lazy" draggable="false">
                                    <button class="inspect-trigger" aria-label="${c.objects.inspectPrefix} ${escape(object.name)}"><span class="inspect-chip mono">${icon("ZoomIn")}${c.objects.inspect}</span></button>
                                    <div class="controls" hidden>
                                        <span class="scale-label mono" aria-live="polite">1×</span>
                                        <button data-zoom="out" aria-label="${c.objects.zoomOut}">${icon("Minus")}</button>
                                        <button data-zoom="in" aria-label="${c.objects.zoomIn}">${icon("Plus")}</button>
                                        <button data-zoom="reset" aria-label="${c.objects.reset}">${icon("RotateCcw")}</button>
                                    </div>
                                </div>
                                <figcaption class="inspection-hint mono" hidden>${c.objects.hint}</figcaption>
                            </figure>
                            <div class="object-copy">
                                <div class="object-number mono">${String(index + 1).padStart(2, "0")} / 06</div>
                                <h3>${object.name}</h3><p class="material mono">${object.material}</p>
                                <p class="object-note">${object.note}</p><p class="gallery-label mono">${object.gallery}</p>
                            </div>
                        </article>
                    `).join("")}
                </div>
            </div>
        </section>
        <section id="visit" class="section visit">
            <div class="container">
                ${label(c.visit.label)}<h2 class="reveal">${c.visit.title}</h2>
                <div class="visit-grid">
                    <div class="visit-column reveal"><h3>${c.visit.hoursLabel}</h3><table aria-label="${c.visit.hoursLabel}"><tbody>${c.visit.hours.map(([day, time]) => `<tr><td>${day}</td><td>${time}</td></tr>`).join("")}</tbody></table><p>${c.visit.note}</p></div>
                    <div class="visit-column reveal"><h3>${c.visit.addressLabel}</h3><p class="address">${c.visit.address}</p><p>${c.visit.directions}</p></div>
                    <div class="visit-column reveal"><h3>${c.visit.admissionLabel}</h3><p class="address">${c.visit.admission}</p></div>
                </div>
            </div>
        </section>
        <section id="tickets" class="section">
            <div class="container">
                ${label(c.tickets.label)}<h2 class="reveal">${c.tickets.title}</h2>
                <div class="tickets-grid">
                    <div><p class="ticket-copy">${c.tickets.copy}</p><div class="steppers">${c.tickets.people.map((person) => `
                        <div class="stepper"><div><span class="stepper-name">${person.name}</span><span class="stepper-price mono">${person.label}</span></div>
                            <div class="step-controls"><button data-person="${person.key}" data-delta="-1" aria-label="${c.tickets.decrease} ${person.name}">${icon("Minus")}</button><output id="count-${person.key}" aria-label="${person.name} count"></output><button data-person="${person.key}" data-delta="1" aria-label="${c.tickets.increase} ${person.name}">${icon("Plus")}</button></div>
                        </div>`).join("")}</div>
                        <p class="visit-summary mono" id="visit-summary"></p>
                    </div>
                    <form class="picker" id="ticket-form">
                        <fieldset><legend class="mono">${c.tickets.dayLabel}</legend><div class="days">${c.tickets.days.map((day) => `<button type="button" class="day mono" data-day="${day}" ${day === "MON" ? `disabled aria-label="MON ${c.tickets.closed}"` : ""} aria-pressed="false">${day}</button>`).join("")}</div></fieldset>
                        <fieldset><legend class="mono">${c.tickets.timeLabel}</legend><div class="times">${c.tickets.times.map((slot) => `<button type="button" class="time" data-time="${slot.time}" aria-pressed="false"><span class="mono">${slot.time}</span><small>${slot.label}</small></button>`).join("")}</div></fieldset>
                        <div class="total-row"><span class="mono">${c.tickets.total}</span><output class="mono" id="ticket-total" aria-live="polite"></output></div>
                        <button class="reserve" type="submit">${c.tickets.reserve}${icon("ArrowUpRight")}</button>
                        <div class="saved-panel" hidden><div class="saved-heading">${icon("Check")}<span>${c.tickets.save}</span></div><p class="saved-summary"></p><p>${c.tickets.disclaimer}</p><button class="edit-pick" type="button">${c.tickets.edit}</button></div>
                        <p class="ticket-status" role="status" aria-label="${c.tickets.status}"></p>
                    </form>
                </div>
            </div>
        </section>
        <section id="events" class="section">
            <div class="container">
                ${label(c.events.label)}<h2 class="reveal">${c.events.title}</h2>
                <div class="events-list">${c.events.items.map((event, index) => `
                    <article class="event reveal"><div class="event-time mono">${event.day}<span>${event.time}</span></div><div><h3>${event.title}</h3><p>${event.type} · ${event.place}</p><small>${event.note}</small></div><button class="event-plan" data-event="${index}" aria-pressed="false">${icon("Plus")}<span>${c.events.add}</span></button></article>
                `).join("")}<p class="events-footnote mono">${c.events.footnote}</p><p class="ticket-status" id="event-status" role="status"></p></div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                ${label(c.shop.label)}<h2 class="reveal">${c.shop.title}</h2>
                <div class="shop-grid">${c.shop.items.map((item) => `<figure class="reveal"><div class="shop-art">${art[item.art]}</div><figcaption class="shop-caption"><span class="mono">${item.name}</span><span class="price">${item.price}</span></figcaption></figure>`).join("")}</div>
                <p class="shop-note">${c.shop.note}</p>
            </div>
        </section>
    </main>
    <footer class="site-footer container">
        <div class="footer-top"><div><a class="wordmark" href="#exhibition">${c.brand}</a><p class="footer-address">${c.visit.address}</p></div><a class="text-link" href="#exhibition" aria-label="${c.footer.back}">${c.footer.back}${icon("ArrowUpRight")}</a></div>
        <div class="footer-bottom"><p>${c.footer.sample}</p><a href="${c.footer.creditUrl}" rel="noopener">${c.footer.credit}</a></div>
    </footer>`;

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 80), { passive: true });
const toggle = document.querySelector(".menu-toggle");
const drawer = document.querySelector(".mobile-nav");
function setMenu(open)
{
    drawer.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? c.navigation.close : c.navigation.menu);
    toggle.innerHTML = icon(open ? "X" : "Menu");
}
toggle.addEventListener("click", () => setMenu(drawer.hidden));
drawer.addEventListener("click", (event) =>
{
    if (event.target.closest("a")) setMenu(false);
});
window.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !drawer.hidden)
    {
        setMenu(false);
        toggle.focus();
    }
});
window.matchMedia("(min-width: 721px)").addEventListener("change", (event) =>
{
    if (event.matches) setMenu(false);
});
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
}, { threshold: .08 });
document.querySelectorAll(".reveal").forEach((element, index) =>
{
    element.style.transitionDelay = `${index % 3 * 60}ms`;
    observer.observe(element);
});

for (const frame of document.querySelectorAll(".object-frame"))
{
    let scale = 1;
    let x = 0;
    let y = 0;
    let active = false;
    let drag = null;
    const image = frame.querySelector("img");
    const trigger = frame.querySelector(".inspect-trigger");
    const controls = frame.querySelector(".controls");
    const hint = frame.nextElementSibling;
    function transform()
    {
        const maxX = frame.clientWidth * (scale - 1) / 2;
        const maxY = frame.clientHeight * (scale - 1) / 2;
        x = Math.max(-maxX, Math.min(maxX, x));
        y = Math.max(-maxY, Math.min(maxY, y));
        image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        frame.dataset.scale = String(scale);
        controls.querySelector(".scale-label").textContent = `${scale.toFixed(1)}×`;
        controls.querySelector('[data-zoom="in"]').disabled = scale >= 3;
        controls.querySelector('[data-zoom="out"]').disabled = scale <= 1;
    }
    function reset()
    {
        scale = 1;
        x = y = 0;
        active = false;
        drag = null;
        frame.classList.remove("active", "dragging");
        trigger.hidden = false;
        controls.hidden = hint.hidden = true;
        frame.removeAttribute("tabindex");
        transform();
    }
    function zoom(delta)
    {
        scale = Math.max(1, Math.min(3, Math.round((scale + delta) * 10) / 10));
        transform();
    }
    trigger.addEventListener("click", () =>
    {
        active = true;
        scale = 2.4;
        trigger.hidden = true;
        controls.hidden = hint.hidden = false;
        frame.classList.add("active");
        frame.tabIndex = 0;
        frame.focus({ preventScroll: true });
        transform();
    });
    controls.addEventListener("click", (event) =>
    {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.zoom === "reset")
        {
            reset();
            trigger.focus({ preventScroll: true });
        }
        else zoom(button.dataset.zoom === "in" ? .2 : -.2);
    });
    frame.addEventListener("wheel", (event) =>
    {
        if (!active || controls.contains(event.target)) return;
        event.preventDefault();
        zoom(event.deltaY < 0 ? .1 : -.1);
    }, { passive: false });
    frame.addEventListener("pointerdown", (event) =>
    {
        if (!active || event.button !== 0 || controls.contains(event.target)) return;
        drag = { pointer: event.pointerId, clientX: event.clientX, clientY: event.clientY, x, y };
        frame.setPointerCapture(event.pointerId);
        frame.classList.add("dragging");
    });
    frame.addEventListener("pointermove", (event) =>
    {
        if (!drag || drag.pointer !== event.pointerId) return;
        x = drag.x + event.clientX - drag.clientX;
        y = drag.y + event.clientY - drag.clientY;
        transform();
    });
    const stopDrag = () =>
    {
        drag = null;
        frame.classList.remove("dragging");
    };
    frame.addEventListener("pointerup", stopDrag);
    frame.addEventListener("pointercancel", stopDrag);
    frame.addEventListener("lostpointercapture", stopDrag);
    frame.addEventListener("keydown", (event) =>
    {
        if (!active) return;
        if (event.key === "Escape")
        {
            reset();
            trigger.focus({ preventScroll: true });
        }
        else if (event.target === frame)
        {
            if (["+", "=", "-", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "0"].includes(event.key)) event.preventDefault();
            if (["+", "="].includes(event.key)) zoom(.2);
            if (event.key === "-") zoom(-.2);
            if (event.key === "ArrowLeft") x -= 25;
            if (event.key === "ArrowRight") x += 25;
            if (event.key === "ArrowUp") y -= 25;
            if (event.key === "ArrowDown") y += 25;
            if (event.key === "0")
            {
                reset();
                trigger.focus({ preventScroll: true });
            }
            transform();
        }
    });
    window.addEventListener("resize", transform);
    transform();
}

const key = `${c.slug}-slot`;
const eventKey = `${c.slug}-events`;
const defaults = { day: "SAT", time: "10:00", adults: 2, children: 0, reduced: 0 };
const available = (day, time) => day !== "MON" && time !== "13:00" && !(day === "SUN" && time === "10:00");
function validPick(value)
{
    return value && c.tickets.days.includes(value.day) && c.tickets.times.some((slot) => slot.time === value.time) &&
        available(value.day, value.time) && c.tickets.people.every((person) => Number.isInteger(value[person.key]) && value[person.key] >= 0 && value[person.key] <= 12) &&
        c.tickets.people.reduce((sum, person) => sum + value[person.key], 0) > 0;
}
let pick = { ...defaults };
let saved = false;
let eventPlan = [];
try
{
    const stored = JSON.parse(localStorage.getItem(key));
    if (validPick(stored))
    {
        pick = Object.fromEntries(Object.keys(defaults).map((field) => [field, stored[field]]));
        saved = true;
    }
}
catch
{
    // An unavailable store or malformed previous pick must not break the exhibition.
}
try
{
    const stored = JSON.parse(localStorage.getItem(eventKey));
    if (Array.isArray(stored)) eventPlan = [...new Set(stored.filter((index) => Number.isInteger(index) && index >= 0 && index < c.events.items.length))];
}
catch
{
    eventPlan = [];
}
const form = document.querySelector("#ticket-form");
const status = form.querySelector(".ticket-status");
function summary()
{
    return `${pick.day} · ${pick.time} · ${c.tickets.people.reduce((total, person) => total + pick[person.key], 0)} ${c.tickets.visitor}`;
}
function renderPick()
{
    for (const person of c.tickets.people)
    {
        document.querySelector(`#count-${person.key}`).value = pick[person.key];
        for (const button of document.querySelectorAll(`[data-person="${person.key}"]`))
        {
            button.disabled = Number(button.dataset.delta) < 0 ? pick[person.key] <= 0 : pick[person.key] >= 12;
        }
    }
    for (const button of form.querySelectorAll("[data-day]")) button.setAttribute("aria-pressed", String(button.dataset.day === pick.day));
    for (const button of form.querySelectorAll("[data-time]"))
    {
        const time = button.dataset.time;
        button.disabled = !available(pick.day, time);
        button.setAttribute("aria-pressed", String(time === pick.time));
        button.querySelector("small").textContent = time === "13:00" ? c.tickets.soldOut : pick.day === "SUN" && time === "10:00" ? c.tickets.closed : c.tickets.times.find((slot) => slot.time === time).label;
    }
    const total = form.querySelector("#ticket-total");
    total.value = pick.time === "16:00" ? c.tickets.donation : `$${c.tickets.people.reduce((amount, person) => amount + person.price * pick[person.key], 0)}`;
    total.classList.toggle("donation", pick.time === "16:00");
    form.querySelector(".reserve").hidden = saved;
    form.querySelector(".saved-panel").hidden = !saved;
    form.querySelector(".saved-summary").textContent = summary();
    document.querySelector("#visit-summary").textContent = `${c.tickets.summary} · ${summary()}`;
}
function change()
{
    saved = false;
    status.textContent = pick.time === "16:00" ? c.tickets.donationNote : "";
    renderPick();
}
document.querySelector(".steppers").addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    pick[button.dataset.person] = Math.max(0, Math.min(12, pick[button.dataset.person] + Number(button.dataset.delta)));
    change();
});
form.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.day)
    {
        pick.day = button.dataset.day;
        if (!available(pick.day, pick.time)) pick.time = c.tickets.times.find((slot) => available(pick.day, slot.time)).time;
        change();
    }
    if (button.dataset.time)
    {
        pick.time = button.dataset.time;
        change();
    }
    if (button.classList.contains("edit-pick"))
    {
        saved = false;
        renderPick();
        form.querySelector(`[data-day="${pick.day}"]`).focus();
    }
});
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!validPick(pick))
    {
        status.textContent = c.tickets.people.every((person) => pick[person.key] === 0) ? c.tickets.empty : c.tickets.unavailable;
        return;
    }
    try
    {
        localStorage.setItem(key, JSON.stringify(pick));
        saved = true;
        renderPick();
        status.textContent = `${c.tickets.save} ${c.tickets.disclaimer}`;
    }
    catch
    {
        status.textContent = c.tickets.storageError;
    }
});
function renderEvents()
{
    for (const button of document.querySelectorAll(".event-plan"))
    {
        const included = eventPlan.includes(Number(button.dataset.event));
        button.setAttribute("aria-pressed", String(included));
        button.innerHTML = `${icon(included ? "Check" : "Plus")}<span>${included ? c.events.remove : c.events.add}</span>`;
    }
}
document.querySelector(".events-list").addEventListener("click", (event) =>
{
    const button = event.target.closest("[data-event]");
    if (!button) return;
    const index = Number(button.dataset.event);
    const included = eventPlan.includes(index);
    const next = included ? eventPlan.filter((item) => item !== index) : [...eventPlan, index];
    try
    {
        localStorage.setItem(eventKey, JSON.stringify(next));
        eventPlan = next;
        renderEvents();
        document.querySelector("#event-status").textContent = included ? c.events.removed : c.events.saved;
    }
    catch
    {
        document.querySelector("#event-status").textContent = c.events.storageError;
    }
});
renderPick();
renderEvents();
