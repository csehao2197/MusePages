import {content as c} from "./content.js";
import {icons} from "./icons.js";

const icon = (name) => icons[name];
const anchor = (id) => `./index.html#${id}`;
const nav = () => c.navigation.map(([label, id]) => `<a href="${anchor(id)}">${label}</a>`).join("");
const heading = (section) => `<div class="section-heading reveal"><p class="eyebrow">${c.sections[section][0]}</p><h2>${c.sections[section][1]}</h2>${c.sections[section][2] ? `<p>${c.sections[section][2]}</p>` : ""}</div>`;
const money = (amount) => `$${amount}`;
const brand = () => `<span>${c.brand.slice(0, -c.brandEnd.length).toUpperCase()}<span class="brand-end">${c.brandEnd.toUpperCase()}</span></span>`;

document.querySelector("#app").innerHTML = `
    <a class="skip" href="#main">${c.labels.skip}</a>
    <header>
        <div class="header-inner container">
            <a class="wordmark" href="./index.html" aria-label="${c.brand}">${brand()}</a>
            <nav class="desktop-nav" aria-label="${c.labels.mainNav}">${nav()}</nav>
            <div class="header-actions"><a class="phone" href="${c.phoneHref}">${icon("Phone")}${c.phone}</a><a class="button compact" href="${anchor("book")}">${c.labels.book}</a></div>
            <button class="menu-toggle" aria-label="${c.labels.menu}" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
        </div>
    </header>
    <div id="mobile-menu" hidden><nav aria-label="${c.labels.mobileNav}">${nav()}</nav><a class="phone" href="${c.phoneHref}">${icon("Phone")}${c.phone}</a></div>
    <main id="main">
        <section class="hero">
            <img class="hero-photo" src="${c.hero.image}" alt="${c.hero.alt}" fetchpriority="high">
            <div class="hero-shade"></div><canvas id="dust" aria-hidden="true"></canvas>
            <div class="hero-content container">
                <p class="eyebrow">${c.hero.eyebrow}</p>
                <h1>${c.brand}</h1>
                <p class="hero-sub">${c.hero.subtitle}</p>
                <div class="hero-buttons"><a class="button" href="${anchor("book")}">${c.labels.book}${icon("ArrowRight")}</a><a class="button ghost" href="${anchor("rooms")}">${c.labels.see}</a></div>
                <p class="hero-note"><span></span>${c.hero.note}</p>
            </div>
            <div class="hero-bottom container"><div class="room-index">${c.rooms.map((r) => `<a href="${anchor("rooms")}">${r.name}</a>`).join("<b>/</b>")}</div><a class="scroll-note" href="${anchor("rooms")}">${c.labels.scroll}<span>↓</span></a></div>
        </section>
        <section id="rooms" class="container section">
            ${heading("rooms")}
            <div class="room-grid">${c.rooms.map((r, i) => `
                <article class="room-card reveal">
                    <div class="room-photo"><img src="${r.image}" alt="${r.alt}" loading="lazy"><span class="room-no">${c.labels.roomNumber} / 0${i + 1}</span><span class="duration">${icon("Clock")}${c.labels.minutes}</span></div>
                    <div class="room-info"><h3>${r.name}</h3>
                    <div class="room-specs"><span class="locks" aria-label="${c.labels.difficulty}: ${r.locks} ${c.labels.of} 5">${Array.from({length: 5}, (_, n) => `<span class="${n < r.locks ? "lit" : ""}">${icon("Lock")}</span>`).join("")}<small>${r.locks} ${c.labels.of} 5</small></span><span>${icon("Users")}${r.min}–${r.max} ${c.labels.players}</span></div>
                    <p>${r.teaser}</p><div class="room-bottom"><span class="price">${money(c.rate)} <small>${c.labels.perPlayer}</small></span><button class="text-button choose-room" data-room="${r.slug}">${c.labels.choose}${icon("ArrowRight")}</button></div></div>
                </article>`).join("")}</div>
        </section>
        <section id="book" class="booking-section section"><div class="container">
            ${heading("book")}
            <div class="booking-grid">
                <div class="schedule reveal"><p class="field-label">${c.labels.chooseDay}</p><div id="day-chips" class="day-chips" role="group" aria-label="${c.labels.chooseDay}"></div><p class="field-label slot-label">${c.labels.chooseSlot}</p><div id="slots" class="slot-grid" role="group" aria-label="${c.labels.chooseSlot}"></div><p class="schedule-note">${c.labels.sample}</p><div class="booking-aside"><span>01 — 04</span><p>${c.labels.local}</p></div></div>
                <div class="summary reveal" id="summary"></div>
            </div>
        </div></section>
        <section id="teams" class="container section">
            ${heading("teams")}
            <div class="teams-grid"><img class="lounge reveal" src="${c.teams.image}" alt="${c.teams.alt}" loading="lazy"><div class="package-list reveal"><p>${c.teams.intro}</p>${c.teams.packages.map(([name, rate, description]) => `<div class="package"><div><h3>${name}</h3><span>${money(rate)} <small>${c.labels.perPlayer}</small></span></div><p>${description}</p></div>`).join("")}<p class="package-note">${c.teams.note}</p><a class="text-button" href="${c.phoneHref}">${icon("Phone")}${c.phone}${icon("ArrowRight")}</a></div></div>
        </section>
        <section id="faq" class="container section faq-section">${heading("faq")}<div class="faq-list">${c.faqs.map(([q, a], i) => `<div class="faq-row"><h3><button aria-expanded="${i === 0}" aria-controls="answer-${i}" id="question-${i}">${q}${icon("ChevronDown")}</button></h3><div class="answer" id="answer-${i}" role="region" aria-labelledby="question-${i}" aria-hidden="${i !== 0}" ${i ? "inert" : ""}><div><p>${a}</p></div></div></div>`).join("")}</div></section>
    </main>
    <footer><div class="container"><div class="footer-grid"><div><a class="wordmark" href="./index.html">${brand()}</a><p class="footer-note">${c.labels.footerNote}</p></div><address><span>${icon("MapPin")}${c.labels.address}</span><span>${icon("Clock")}${c.labels.hours}</span><a href="${c.phoneHref}">${icon("Phone")}${c.phone}</a></address><nav aria-label="${c.labels.footerNav}">${nav()}</nav></div><div class="footer-bottom"><p>${c.labels.footerDisclaimer}</p><a href="${c.labels.creditHref}" target="_blank" rel="noopener noreferrer">${c.labels.credit}${icon("ArrowRight")}</a></div></div></footer>`;

const key = `${c.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:hold`;
let state = {room: c.rooms[0].slug, day: c.days[0], slot: c.slots[0], players: c.party.initial};
let held = false;
let storageError = false;
const validHold = (value) => value && c.rooms.some((r) => r.slug === value.room) && c.days.includes(value.day) && c.slots.includes(value.slot) && !(c.darkDays.includes(value.day) && value.slot === "23:00") && Number.isInteger(value.players) && value.players >= c.party.min && value.players <= c.party.max;
try
{
    const saved = JSON.parse(localStorage.getItem(key));
    if (validHold(saved))
    {
        state = saved;
        held = true;
    }
}
catch
{
    storageError = false;
}

function renderSchedule()
{
    document.querySelector("#day-chips").innerHTML = c.days.map((day) => `<button aria-pressed="${state.day === day}" data-day="${day}">${day}</button>`).join("");
    document.querySelector("#slots").innerHTML = c.slots.map((slot) =>
    {
        const dark = c.darkDays.includes(state.day) && slot === "23:00";
        return `<div><button data-slot="${slot}" aria-pressed="${state.slot === slot}" ${dark ? "disabled" : ""}>${slot}</button>${dark ? `<small>${c.labels.dark}</small>` : ""}</div>`;
    }).join("");
}

function renderSummary(focusId)
{
    const room = c.rooms.find((r) => r.slug === state.room);
    const summary = document.querySelector("#summary");
    const detail = `<dl><div><dt>${c.labels.room}</dt><dd>${room.name}</dd></div><div><dt>${c.labels.evening}</dt><dd>${state.day} / ${state.slot}</dd></div><div><dt>${c.labels.countSummary}</dt><dd>${state.players}</dd></div></dl>`;
    summary.innerHTML = held ? `<div class="confirmation" role="status"><span class="check">${icon("Check")}</span><p class="eyebrow">${c.brand}</p><h3>${c.labels.held}</h3>${detail}<p>${c.labels.confirmation}</p><button class="text-button" id="change-hold">${c.labels.change}${icon("ArrowRight")}</button></div>` : `
        <label class="field-label" for="room-select">${c.labels.room}</label><select id="room-select">${c.rooms.map((r) => `<option value="${r.slug}" ${r.slug === state.room ? "selected" : ""}>${r.name}</option>`).join("")}</select>
        <p class="recommendation">${c.labels.recommended} ${room.min}–${room.max} ${c.labels.players}</p>
        <div class="party-row"><span class="field-label">${c.labels.party}</span><div class="stepper"><button id="minus" aria-label="${c.labels.fewer}" ${state.players === c.party.min ? "disabled" : ""}>${icon("Minus")}</button><output aria-live="polite">${state.players}</output><button id="plus" aria-label="${c.labels.more}" ${state.players === c.party.max ? "disabled" : ""}>${icon("Plus")}</button></div></div>
        ${detail}<div class="total"><span>${c.labels.total}<small>${state.players} × ${money(c.rate)}</small></span><strong aria-live="polite">${money(state.players * c.rate)}</strong></div><button id="hold-slot" class="button">${c.labels.hold}${icon("ArrowRight")}</button><p class="local-note">${c.labels.local}</p>${storageError ? `<p role="alert" class="error">${c.labels.storageError}</p>` : ""}`;
    if (focusId)
    {
        const target = document.getElementById(focusId);
        if (target && !target.disabled)
        {
            target.focus({preventScroll: true});
        }
        else
        {
            document.querySelector(focusId === "plus" ? "#minus" : "#plus")?.focus({preventScroll: true});
        }
    }
}

renderSchedule();
renderSummary();
document.addEventListener("click", (event) =>
{
    const target = event.target.closest("button");
    if (!target)
    {
        return;
    }
    if (target.dataset.day || target.dataset.slot)
    {
        if (held)
        {
            held = false;
        }
        state.day = target.dataset.day || state.day;
        state.slot = target.dataset.slot || state.slot;
        if (c.darkDays.includes(state.day) && state.slot === "23:00")
        {
            state.slot = c.slots[0];
        }
        const selector = target.dataset.day ? `[data-day="${state.day}"]` : `[data-slot="${state.slot}"]`;
        renderSchedule();
        renderSummary();
        document.querySelector(selector).focus({preventScroll: true});
    }
    if (target.matches(".choose-room"))
    {
        state.room = target.dataset.room;
        held = false;
        renderSummary();
        document.querySelector("#book").scrollIntoView({behavior: reducedMotion.matches ? "instant" : "smooth"});
        document.querySelector("#room-select").focus({preventScroll: true});
        document.querySelector("#summary").classList.remove("flash");
        requestAnimationFrame(() => document.querySelector("#summary").classList.add("flash"));
    }
    if (target.id === "minus" || target.id === "plus")
    {
        state.players = Math.min(c.party.max, Math.max(c.party.min, state.players + (target.id === "plus" ? 1 : -1)));
        renderSummary(target.id);
    }
    if (target.id === "hold-slot")
    {
        try
        {
            localStorage.setItem(key, JSON.stringify(state));
            storageError = false;
            held = true;
        }
        catch
        {
            storageError = true;
        }
        renderSummary(held ? "change-hold" : "hold-slot");
    }
    if (target.id === "change-hold")
    {
        held = false;
        renderSummary("room-select");
    }
    if (target.closest(".faq-row"))
    {
        const open = target.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq-row button").forEach((button) =>
        {
            button.setAttribute("aria-expanded", "false");
            const answer = document.getElementById(button.getAttribute("aria-controls"));
            answer.setAttribute("aria-hidden", "true");
            answer.inert = true;
        });
        target.setAttribute("aria-expanded", String(!open));
        const answer = document.getElementById(target.getAttribute("aria-controls"));
        answer.setAttribute("aria-hidden", String(open));
        answer.inert = open;
    }
});
document.addEventListener("change", (event) =>
{
    if (event.target.id === "room-select")
    {
        state.room = event.target.value;
        renderSummary("room-select");
    }
});

const toggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
function setMenu(open)
{
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? c.labels.close : c.labels.menu);
    mobileMenu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (open)
    {
        mobileMenu.querySelector("a").focus();
    }
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) =>
{
    if (mobileMenu.hidden)
    {
        return;
    }
    if (event.key === "Escape")
    {
        setMenu(false);
        toggle.focus();
    }
    if (event.key === "Tab")
    {
        const links = [...mobileMenu.querySelectorAll("a")];
        const first = links[0];
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            toggle.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            toggle.focus();
        }
        else if (document.activeElement === toggle)
        {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
        }
    }
});
const mobileQuery = matchMedia("(max-width: 760px)");
mobileQuery.addEventListener("change", () =>
{
    if (!mobileQuery.matches)
    {
        setMenu(false);
    }
});
const header = document.querySelector("header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 24);
addEventListener("scroll", onScroll, {passive: true});
onScroll();

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {threshold: 0.06});
document.querySelectorAll(".reveal").forEach((element, index) =>
{
    element.style.setProperty("--delay", `${index % 2 * 80}ms`);
    observer.observe(element);
});
const canvas = document.querySelector("#dust");
const context = canvas.getContext("2d");
let frame;
let particles = [];
function resizeDust()
{
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    particles = Array.from({length: 60}, () => ({x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 1 + Math.random()}));
}
function drawDust()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(226,161,60,0.03)";
    particles.forEach((p) =>
    {
        context.beginPath();
        context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        context.fill();
        p.x = (p.x - 0.08 + canvas.width) % canvas.width;
        p.y = (p.y - 0.12 + canvas.height) % canvas.height;
    });
    if (!reducedMotion.matches)
    {
        frame = requestAnimationFrame(drawDust);
    }
}
resizeDust();
drawDust();
addEventListener("resize", resizeDust);
reducedMotion.addEventListener("change", () =>
{
    cancelAnimationFrame(frame);
    drawDust();
});
addEventListener("pagehide", () => cancelAnimationFrame(frame));
