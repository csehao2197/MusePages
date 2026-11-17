import { content as c } from "./content.js";
import { icons } from "./icons.js";

const ui = c.ui;
const icon = (name) => icons[name];
const money = (value) => `$${value}`;
const nav = () => c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
const heading = (id) => `<div class="section-heading reveal"><span class="eyebrow">${c.sections[id][0]}</span><h2>${c.sections[id][1]}</h2><p>${c.sections[id][2]}</p></div>`;
const caustics = (id) => `<div class="caustics" aria-hidden="true"><svg class="caustic-blob" width="100%" height="100%"><filter id="water-${id}"><feTurbulence type="fractalNoise" baseFrequency=".008 .012" numOctaves="2" seed="12"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="5" offset="0"/><feFuncG type="gamma" amplitude="1" exponent="5" offset="0"/><feFuncB type="gamma" amplitude="1" exponent="5" offset="0"/></feComponentTransfer></filter><rect width="100%" height="100%" filter="url(#water-${id})"/></svg><div class="caustic-mesh"></div></div>`;
const days = (group, selected) => `<div class="day-chips" role="group" aria-label="${group === "schedule" ? ui.scheduleDays : ui.visitDays}">${c.days.map((day) => `<button type="button" class="day-chip" data-group="${group}" data-day="${day}" aria-pressed="${day === selected}">${day}</button>`).join("")}</div>`;
const zone = (id) => c.zones.find((item) => item.id === id);
document.title = c.brandFull;
const mapBlocks =
[
    [35, 40, 100, 96],
    [149, 40, 100, 96],
    [35, 151, 214, 100],
    [35, 266, 100, 97],
    [149, 266, 100, 97]
];

document.querySelector("#app").innerHTML = `
    <a class="skip-link" href="#main">${ui.skip}</a>
    <header class="site-header" id="top">
        <div class="container header-inner">
            <a class="wordmark" href="#top" aria-label="${c.brandFull}">${icon("Waves")}<span>${c.brand}<small>${c.brandDescriptor}</small></span></a>
            <nav class="desktop-nav" aria-label="${ui.primaryNav}">${nav()}</nav>
            <div class="header-actions"><a class="button button-outline small" href="#tickets">${icon("Ticket")}<span>${ui.tickets}</span></a><button type="button" class="menu-button" aria-label="${ui.openMenu}" aria-expanded="false" aria-controls="mobile-nav">${icon("Menu")}</button></div>
        </div>
        <nav class="mobile-nav" id="mobile-nav" aria-label="${ui.primaryNav}" hidden>${nav()}</nav>
    </header>
    <main id="main">
        <section class="hero">
            ${caustics("hero")}
            <div class="container hero-grid">
                <div class="hero-copy">
                    <p class="eyebrow">${c.hero.eyebrow}</p>
                    <h1>${c.hero.opening} <span>${c.hero.name}</span><br>${c.hero.ending}</h1>
                    <p class="hero-description">${c.hero.description}</p>
                    <div class="hero-buttons"><a class="button button-primary" href="#tickets">${ui.choose}${icon("ArrowUpRight")}</a><a class="button button-ghost" href="#schedule">${ui.feedings}${icon("ArrowRight")}</a></div>
                    <div class="hero-stats">${c.hero.stats.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}</div>
                </div>
                <figure class="hero-portrait">
                    <img src="${c.hero.image}" alt="${c.hero.alt}" width="768" height="1024" fetchpriority="high">
                    <div class="portrait-top"><span class="live-dot"></span><span>${c.hero.scientific}</span></div>
                    <figcaption><span class="caption-line">${c.hero.caption}</span><div><span>${c.hero.depthLabel}</span><strong>${c.hero.depth}</strong></div></figcaption>
                </figure>
            </div>
            <div class="container hero-bottom"><span>${c.hero.note}</span><a href="#exhibits">${ui.scrollLink}${icon("ArrowDown")}</a></div>
        </section>
        <section id="exhibits" class="section container">
            ${heading("exhibits")}
            <div class="zones-layout">
                <aside class="map-rail reveal">
                    <span class="mono map-title">${ui.mapLabel}</span>
                    <svg class="floor-map" viewBox="0 0 284 430" role="group" aria-label="${ui.floorMap}">
                        <path d="M122 397H28Q16 397 16 385V28Q16 16 28 16H256Q268 16 268 28V385Q268 397 256 397H162" fill="none" stroke="#16405E" stroke-width="2"/>
                        ${c.zones.map((item, index) =>
                        {
                            const [x, y, w, h] = mapBlocks[index];
                            return `<a href="#zone-${item.id}" data-map="${item.id}" style="--zone:${item.color}" aria-label="${ui.zoneNumber} ${item.id}: ${item.name}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/><text x="${x + w / 2}" y="${y + h / 2 + 7}" text-anchor="middle">${String(item.id).padStart(2, "0")}</text></a>`;
                        }).join("")}
                        <path d="M142 412V382m-5 6 5-6 5 6" fill="none" stroke="#5FE9D6" stroke-width="1.5"/>
                    </svg>
                    <p class="mono map-entrance">${ui.entrance}</p>
                    <p>${ui.mapInstruction}</p><small class="mono">${ui.mapFootnote}</small>
                </aside>
                <div class="zone-list">${c.zones.map((item) => `<article class="zone-card reveal" id="zone-${item.id}" style="--zone:${item.color}" tabindex="-1"><span class="zone-number">${String(item.id).padStart(2, "0")}</span><div><h3>${item.name}</h3><p>${item.description}</p></div><span class="depth-tag">${item.depth}</span></article>`).join("")}</div>
            </div>
        </section>
        <section id="animals" class="section residents-section">
            <div class="container">${heading("animals")}
                <div class="resident-grid">${c.residents.map((resident) => `<article class="resident-card reveal" style="--zone:${zone(resident.zone).color}"><div class="resident-image"><img src="${resident.image}" alt="${resident.alt}" width="768" height="768" loading="lazy"><span class="image-index mono">${String(resident.zone).padStart(2, "0")} / ${zone(resident.zone).name.toUpperCase()}</span></div><div class="resident-body"><div class="resident-heading"><h3>${resident.name}</h3>${icon("Fish")}</div><p class="species">${resident.species}</p><p class="resident-fact">${resident.fact}</p><a class="meet-pill" href="#schedule">${icon("Clock")}${resident.meet}</a></div></article>`).join("")}</div>
            </div>
        </section>
        <section id="schedule" class="section container">
            <div class="schedule-layout">${heading("schedule")}<div class="schedule-panel reveal">${days("schedule", "SAT")}<div id="events" aria-live="polite" aria-atomic="true"></div><p class="footnote">${c.scheduleNote}</p></div></div>
        </section>
        <section id="tickets" class="section ticket-section">
            <div class="container ticket-layout"><div>${heading("tickets")}<div class="steppers">${c.prices.map((price) => `<div class="guest-row"><div><label id="label-${price.id}">${price.label}<span>${money(price.price)}</span></label><small>${price.detail}</small></div><div class="stepper" role="group" aria-labelledby="label-${price.id}"><button type="button" data-guest="${price.id}" data-delta="-1" aria-label="${ui.decrease} ${price.label.toLowerCase()} count">${icon("Minus")}</button><output id="count-${price.id}" aria-label="${price.label} count"></output><button type="button" data-guest="${price.id}" data-delta="1" aria-label="${ui.increase} ${price.label.toLowerCase()} count">${icon("Plus")}</button></div></div>`).join("")}</div><p class="footnote">${c.guestNote}</p></div>
                <div class="picker-card reveal"><div class="picker-intro">${icon("Ticket")}<span>${c.pickerLabel}</span></div><fieldset><legend>${ui.day}</legend>${days("visit", "SAT")}</fieldset><fieldset><legend>${ui.slot}</legend><div class="slots" role="group" aria-label="${ui.slots}">${c.slots.map((slot) => `<button type="button" class="slot ${slot.status}" data-slot="${slot.time}" aria-pressed="false" ${slot.disabled ? "disabled" : ""}><span>${slot.time}</span><small>${ui[slot.status]}</small></button>`).join("")}</div></fieldset><div class="total-row" aria-live="polite"><span>${ui.total}<small id="visit-summary"></small></span><output id="total"></output></div><button type="button" id="save-visit" class="button button-primary">${ui.save}${icon("ArrowUpRight")}</button><div id="confirmation" class="confirmation" role="status" hidden><div>${icon("Check")}<strong>${ui.saved}</strong></div><p>${ui.savedDetail}</p><button type="button" id="edit-visit">${ui.edit}${icon("ArrowRight")}</button></div><p id="ticket-message" role="status" class="footnote" hidden></p><p class="picker-note mono">${icon("Waves")}${c.pickerNote}</p></div>
            </div>
        </section>
        <section id="membership" class="section container">
            ${heading("membership")}
            <div class="membership-grid">${c.memberships.map((tier) => `<article class="membership-card reveal ${tier.featured ? "featured" : ""}"><div class="membership-title"><h3>${tier.name}</h3>${tier.featured ? `<span class="mono">${ui.mostChosen}</span>` : ""}</div><p class="membership-price">${money(tier.price)} <small>${ui.perYear}</small></p><ul>${tier.benefits.map((benefit) => `<li>${icon("Check")}<span>${benefit}</span></li>`).join("")}</ul></article>`).join("")}</div><p class="footnote">${c.membershipNote}</p>
        </section>
        <section class="visit-section">
            <div class="visit-band"><img src="${c.visit.image}" alt="${c.visit.alt}" width="1600" height="900" loading="lazy">${caustics("visit")}<div class="container visit-caption"><span class="mono">${c.visit.label}</span><p>${c.visit.caption}</p></div></div>
            <div class="visit-details"><div class="container visit-columns"><div><h3>${icon("MapPin")}${c.visit.find}</h3><p>${c.visit.address}</p><p class="muted">${c.visit.directions}</p></div><div><h3>${icon("Clock")}${c.visit.hoursLabel}</h3><dl>${c.visit.hours.map(([day, hours]) => `<div><dt>${day}</dt><dd>${hours}</dd></div>`).join("")}</dl><p class="footnote">${c.visit.hoursNote}</p></div><div><h3>${icon("Waves")}${c.visit.cafe}</h3><p>${c.visit.cafeText}</p></div></div></div>
        </section>
    </main>
    <footer class="container site-footer"><div class="footer-top"><a class="wordmark" href="#top" aria-label="${ui.backTop}">${icon("Waves")}<span>${c.brand}<small>${c.brandDescriptor}</small></span></a><nav aria-label="${ui.footerNav}">${nav()}</nav></div><p>${c.footer.note}</p><div class="footer-bottom"><span>${c.footer.copyright}</span><span><a href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a><span class="footer-separator"> · </span><a href="${c.footer.licenseUrl}" target="_blank" rel="noopener noreferrer">${c.footer.license}</a></span></div></footer>`;

let scheduleDay = "SAT";
let visit = { day: "SAT", slot: "09:30", adult: 2, youth: 0, senior: 0 };
let saved = false;
let storageNotice = "";

function isValidVisit(value)
{
    return value && typeof value === "object" &&
        c.days.includes(value.day) &&
        c.slots.some((slot) => slot.time === value.slot && !slot.disabled) &&
        c.prices.every(({ id }) => Number.isInteger(value[id]) && value[id] >= 0 && value[id] <= 12) &&
        c.prices.reduce((sum, { id }) => sum + value[id], 0) > 0;
}

try
{
    const stored = localStorage.getItem(c.storageKey);
    if (stored)
    {
        const parsed = JSON.parse(stored);
        if (isValidVisit(parsed))
        {
            visit = { day: parsed.day, slot: parsed.slot, adult: parsed.adult, youth: parsed.youth, senior: parsed.senior };
            saved = true;
        }
        else
        {
            storageNotice = ui.invalidStorage;
        }
    }
}
catch
{
    storageNotice = ui.invalidStorage;
}

function renderSchedule()
{
    document.querySelectorAll('[data-group="schedule"]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.day === scheduleDay)));
    const events = c.events.filter((event) => !event.weekend || ["SAT", "SUN"].includes(scheduleDay));
    const list = document.querySelector("#events");
    list.innerHTML = `<span class="sr-only">${scheduleDay}</span><ol class="event-list">${events.map((event) => `<li><time>${event.time}</time><span>${event.title}</span><span class="event-zone" style="--zone:${zone(event.zone).color}"><i></i>${ui.zone} ${event.zone}</span></li>`).join("")}</ol>`;
    list.getAnimations().forEach((animation) => animation.cancel());
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
    {
        list.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    }
}

function ticketMessage(message)
{
    const element = document.querySelector("#ticket-message");
    element.textContent = message;
    element.hidden = !message;
}

function renderVisit()
{
    document.querySelectorAll('[data-group="visit"]').forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.day === visit.day)));
    document.querySelectorAll("[data-slot]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.slot === visit.slot)));
    c.prices.forEach(({ id }) =>
    {
        document.querySelector(`#count-${id}`).value = visit[id];
        document.querySelector(`[data-guest="${id}"][data-delta="-1"]`).disabled = visit[id] === 0;
        document.querySelector(`[data-guest="${id}"][data-delta="1"]`).disabled = visit[id] === 12;
    });
    const guests = c.prices.reduce((sum, { id }) => sum + visit[id], 0);
    const total = c.prices.reduce((sum, { id, price }) => sum + visit[id] * price, 0);
    document.querySelector("#total").value = money(total);
    document.querySelector("#visit-summary").textContent = `${visit.day} · ${visit.slot} · ${guests} ${guests === 1 ? ui.guest : ui.guests}`;
    document.querySelector("#save-visit").hidden = saved;
    document.querySelector("#confirmation").hidden = !saved;
    ticketMessage(storageNotice);
}

function changeVisit()
{
    saved = false;
    storageNotice = "";
    renderVisit();
}

document.querySelectorAll("[data-group]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        if (button.dataset.group === "schedule")
        {
            scheduleDay = button.dataset.day;
            renderSchedule();
        }
        else
        {
            visit.day = button.dataset.day;
            changeVisit();
        }
    });
    button.addEventListener("keydown", (event) =>
    {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const buttons = [...button.parentElement.querySelectorAll("button")];
        const index = buttons.indexOf(button);
        const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
        buttons[next].focus();
        buttons[next].click();
    });
});

document.querySelectorAll("[data-slot]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        if (button.disabled) return;
        visit.slot = button.dataset.slot;
        changeVisit();
    });
});

document.querySelectorAll("[data-guest]").forEach((button) =>
{
    button.addEventListener("click", () =>
    {
        const id = button.dataset.guest;
        visit[id] = Math.max(0, Math.min(12, visit[id] + Number(button.dataset.delta)));
        changeVisit();
    });
});

document.querySelector("#save-visit").addEventListener("click", () =>
{
    if (!isValidVisit(visit))
    {
        ticketMessage(ui.zeroGuests);
        return;
    }
    try
    {
        localStorage.setItem(c.storageKey, JSON.stringify(visit));
        saved = true;
        storageNotice = "";
        renderVisit();
        document.querySelector("#edit-visit").focus({ preventScroll: true });
    }
    catch
    {
        ticketMessage(ui.storageError);
    }
});

document.querySelector("#edit-visit").addEventListener("click", () =>
{
    changeVisit();
    document.querySelector("#save-visit").focus({ preventScroll: true });
});

const menuButton = document.querySelector(".menu-button");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu(restoreFocus = false)
{
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", ui.openMenu);
    menuButton.innerHTML = icon("Menu");
    if (restoreFocus) menuButton.focus();
}
menuButton.addEventListener("click", () =>
{
    const opening = mobileNav.hidden;
    mobileNav.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute("aria-label", opening ? ui.closeMenu : ui.openMenu);
    menuButton.innerHTML = icon(opening ? "X" : "Menu");
});
mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !mobileNav.hidden) closeMenu(true);
});
document.addEventListener("click", (event) =>
{
    if (!mobileNav.hidden && !event.composedPath().includes(document.querySelector(".site-header"))) closeMenu();
});
matchMedia("(min-width: 1001px)").addEventListener("change", (event) =>
{
    if (event.matches) closeMenu();
});
const updateHeader = () => document.querySelector(".site-header").classList.toggle("scrolled", window.scrollY > 80);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.06 });
document.querySelectorAll(".reveal").forEach((element, index) =>
{
    element.style.setProperty("--delay", `${index % 3 * 60}ms`);
    revealObserver.observe(element);
});

const visibleZones = new Set();
const zoneObserver = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting) visibleZones.add(entry.target);
        else visibleZones.delete(entry.target);
    });
    const distance = (element) =>
    {
        const bounds = element.getBoundingClientRect();
        return Math.abs(bounds.top + bounds.height / 2 - innerHeight * 0.45);
    };
    const current = [...visibleZones].sort((a, b) => distance(a) - distance(b))[0];
    if (!current) return;
    const id = current.id.replace("zone-", "");
    document.querySelectorAll("[data-map]").forEach((link) => link.classList.toggle("active", link.dataset.map === id));
}, { rootMargin: "-25% 0px -35% 0px", threshold: [0, 0.5, 1] });
document.querySelectorAll(".zone-card").forEach((card) => zoneObserver.observe(card));
document.querySelectorAll("[data-map]").forEach((link) =>
{
    link.addEventListener("click", (event) =>
    {
        event.preventDefault();
        const card = document.querySelector(link.getAttribute("href"));
        history.replaceState(null, "", link.getAttribute("href"));
        const top = card.getBoundingClientRect().top + scrollY + card.offsetHeight / 2 - innerHeight * 0.45;
        window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        card.focus({ preventScroll: true });
    });
});

renderSchedule();
renderVisit();
