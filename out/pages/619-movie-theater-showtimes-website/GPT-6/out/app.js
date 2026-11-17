import { content as c } from "./content.js";
import { icons } from "./icons.js";

const l = c.labels;
const filmPage = location.pathname.endsWith("film.html");
const $ = (selector) => document.querySelector(selector);
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name].map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).filter(([key]) => key !== "key").map(([key, value]) => `${key}="${value}"`).join(" ")}></${tag}>`).join("")}</svg>`;
const nav = () => c.nav.map(([label, id]) => `<a href="./index.html#${id}">${label}</a>`).join("");
const credit = () => `<a href="${l.creditUrl}" target="_blank" rel="noopener noreferrer">${l.credit} ↗</a>`;
const meta = (film) => `${film.genre} · ${film.runtime} min · ${film.rating}`;
const filmUrl = (film, day, time) => `./film.html?film=${film.slug}${day ? `&day=${day}` : ""}${time ? `&time=${time}` : ""}`;
const timesFor = (film, day) =>
{
    const weekend = day === "Sat" || day === "Sun";
    if (film.weekendsOnly && !weekend) return [];
    return [...film.times, ...(weekend && film.weekendExtra ? [film.weekendExtra] : [])];
};

function poster(film)
{
    return `<svg class="poster" viewBox="0 0 300 450" role="img" aria-label="${l.posterLabel} ${film.title}">${film.poster.art}</svg>`;
}

function header()
{
    return `<header class="site-header"><div class="header-inner container"><a class="wordmark" href="./index.html">${icon("ticket")}<span>${c.brand}</span></a><nav class="desktop-nav" aria-label="Main navigation">${nav()}</nav><a class="button small header-cta" href="./index.html#showtimes">${l.tonight}<span aria-hidden="true"> ↗</span></a><button class="menu-button" aria-label="${l.menu}" aria-expanded="false" aria-controls="mobile-nav">${icon("menu")}</button></div><nav id="mobile-nav" aria-label="Mobile navigation" hidden>${nav()}</nav></header>`;
}

function footer(detail = false)
{
    return `<footer class="container footer"><div class="footer-top">${detail ? `<a class="back" href="./index.html">${icon("arrow-left")}${l.back}</a>` : `<span class="wordmark">${c.brand}</span>`}${detail ? `<span class="wordmark">${c.brand}</span>` : `<nav aria-label="Footer navigation">${nav()}</nav>`}</div><div class="fineprint"><span>${detail ? l.localNote : l.footer}</span>${credit()}</div></footer>`;
}

function dayChips(active)
{
    return `<div class="day-chips" role="group" aria-label="${l.daysLabel}">${c.days.map((day) => `<button class="day-chip${day === active ? " active" : ""}" data-day="${day}" aria-pressed="${day === active}">${day}</button>`).join("")}</div>`;
}

function homepage()
{
    const bulbs = () => `<div class="bulbs" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}</div>`;
    const ticker = c.films.map((film) => `<span>${film.title}</span><b aria-hidden="true">◆</b>`).join("");
    $("#app").innerHTML = `${header()}<main id="main">
        <section class="hero" aria-labelledby="marquee-title"><div class="curtain" aria-hidden="true"></div><div class="spotlights" aria-hidden="true"></div><p class="eyebrow hero-eyebrow">${c.hero.eyebrow}</p><div class="marquee">${bulbs()}<div class="sign"><p class="marquee-kicker">${c.hero.edition}</p><h1 id="marquee-title"><span>${c.hero.first}</span><span>${c.hero.second}</span></h1><p class="hero-subtitle">${c.hero.subtitle}</p><div class="hero-actions"><a class="button" href="#showtimes">${icon("ticket")}${c.hero.primary}</a><a class="button outline" href="#membership">${c.hero.secondary}</a></div></div>${bulbs()}</div><p class="doors">${icon("clock")}${c.hero.doors}</p><p class="hero-foot">${c.hero.foot}</p><a class="down" href="#now-showing" aria-label="${l.showing}">↓</a></section>
        <div class="ticker-shell"><div class="ticker"><div class="ticker-track"><div>${ticker}</div><div aria-hidden="true">${ticker}</div></div></div><button id="ticker-toggle" aria-label="${l.pause}">Ⅱ</button></div>
        <section class="section container" id="now-showing"><div class="section-heading reveal"><div><p class="eyebrow">${l.program}</p><h2>${l.showing}<span class="heading-dot" aria-hidden="true"></span></h2></div><p class="section-aside">${l.programNote}</p></div><div class="film-grid">${c.films.map((film, i) => `<article class="film-card reveal" style="--delay:${i % 3 * 60}ms"><a class="poster-link" href="${filmUrl(film)}" aria-label="${film.title} — ${l.filmLink}">${poster(film)}<span class="poster-arrow" aria-hidden="true">↗</span></a><p class="film-meta">${meta(film)}</p><h3><a href="${filmUrl(film)}">${film.title}</a></h3><p class="blurb">${film.blurb}</p><a class="text-link" href="${filmUrl(film)}">${l.filmLink}<span aria-hidden="true"> →</span></a></article>`).join("")}</div></section>
        <section class="schedule-band" id="showtimes"><div class="section container reveal"><div class="section-heading"><div><p class="eyebrow">${l.scheduleLabel}</p><h2>${l.showtimes}</h2></div>${icon("ticket")}</div><p class="cheap">${l.cheap}</p>${dayChips("Fri")}<div id="showtime-rows" aria-live="polite"></div><p class="sample">${l.sample}</p></div></section>
        <section class="section container" id="membership"><div class="section-heading reveal"><div><p class="eyebrow">${l.membersLabel}</p><h2>${l.membership}</h2></div><p class="section-aside">${l.membersIntro}</p></div><div class="tiers">${c.tiers.map((tier, i) => `<article class="tier reveal${tier.popular ? " popular" : ""}" style="--delay:${i * 60}ms">${tier.popular ? `<span class="popular-label">${l.chosen}</span>` : ""}<span class="tier-number" aria-hidden="true">0${i + 1}</span><h3>${tier.name}</h3><p class="price">${tier.price}<span>${tier.period}</span></p><ul>${tier.perks.map((perk) => `<li>${icon("check")}${perk}</li>`).join("")}</ul></article>`).join("")}</div><p class="muted note">${l.membershipNote}</p></section>
        <section class="visit-band" id="visit"><div class="section container visit reveal"><div><p class="eyebrow">${l.visitLabel}</p><h2>${l.visit}</h2><p class="address">${l.address}</p><p class="muted">${l.directions}</p></div><div><h3 class="eyebrow">${l.hours}</h3><dl class="hours">${c.hours.map(([day, time]) => `<div><dt>${day}</dt><dd>${time}</dd></div>`).join("")}</dl><p class="muted">${l.doors}</p></div><div><h3 class="eyebrow">${l.houseNotes}</h3><p class="muted house-copy">${l.rooms}</p><div class="house-emblem" aria-hidden="true">${icon("armchair")}<span>96 / 48 / 48</span></div></div></div></section>
        </main>${footer()}<div class="grain" aria-hidden="true"></div>`;
    renderSchedule("Fri");
    $("#showtimes .day-chips").addEventListener("click", (event) =>
    {
        const chip = event.target.closest("[data-day]");
        if (!chip) return;
        updateChips(chip.dataset.day);
        renderSchedule(chip.dataset.day);
    });
    $("#ticker-toggle").addEventListener("click", () =>
    {
        const paused = $(".ticker-track").classList.toggle("paused");
        $("#ticker-toggle").textContent = paused ? "▷" : "Ⅱ";
        $("#ticker-toggle").setAttribute("aria-label", paused ? l.resume : l.pause);
    });
}

function updateChips(day)
{
    document.querySelectorAll("[data-day]").forEach((chip) =>
    {
        const selected = chip.dataset.day === day;
        chip.classList.toggle("active", selected);
        chip.setAttribute("aria-pressed", String(selected));
    });
}

function renderSchedule(day)
{
    $("#showtime-rows").innerHTML = c.films.map((film) =>
    {
        const times = timesFor(film, day);
        return `<div class="showtime-row"><div><a href="${filmUrl(film)}">${film.title}</a><span>${film.genre}</span></div><div class="time-pills">${times.length ? times.map((time) => `<a class="time-pill" href="${filmUrl(film, day, time)}" aria-label="${film.title}, ${day} ${time}">${time}</a>`).join("") : `<span class="muted weekend-note">${l.weekend}</span>`}</div></div>`;
    }).join("");
}

function detailPage()
{
    const query = new URLSearchParams(location.search);
    const known = c.films.find((film) => film.slug === query.get("film"));
    const film = known || c.films[0];
    let day = known && c.days.includes(query.get("day")) ? query.get("day") : "Fri";
    let times = timesFor(film, day);
    let time = known && times.includes(query.get("time")) ? query.get("time") : times.includes("19:00") ? "19:00" : times[0] || null;
    let selected = new Set();
    let saved = null;
    let storageAvailable = true;
    const storageKey = `${c.slug}-hold`;
    try
    {
        const value = JSON.parse(localStorage.getItem(storageKey));
        if (value && value.film === film.slug && value.day === day && value.time === time && Array.isArray(value.seats))
        {
            const valid = value.seats.every((seat) => /^[A-H](?:[1-9]|1[0-2])$/.test(seat) && !c.taken.includes(seat));
            if (valid && time)
            {
                selected = new Set(value.seats);
                saved = value;
            }
        }
    }
    catch
    {
        storageAvailable = false;
    }
    document.title = `${film.title} — ${c.brand}`;
    $("#app").innerHTML = `${header()}<main id="main" class="container detail-main"><a class="back" href="./index.html#now-showing">${icon("arrow-left")}${l.back}</a><section class="film-detail"><div class="detail-poster reveal">${poster(film)}</div><div class="detail-copy reveal"><p class="eyebrow">${l.filmLabel}</p><h1>${film.title}</h1><p class="film-meta">${meta(film)}</p><div class="program-notes">${film.notes.map((note) => `<p>${note}</p>`).join("")}</div><a class="text-link" href="#seat-picker">${icon("armchair")}${l.seatsLabel}<span aria-hidden="true"> ↓</span></a></div></section>
        <section id="seat-picker" class="seat-section"><p class="eyebrow">${l.seatsLabel}</p><h2>${l.seatsTitle}</h2><p class="sample">${l.sample}</p><div class="screening-picker"><h3>${l.screening}</h3>${dayChips(day)}<div id="detail-times" class="time-pills" role="group" aria-label="${l.timesLabel}"></div></div><div class="booking-top"><p id="screening-heading" class="eyebrow"></p><div class="tally"><output id="seat-total" aria-live="polite"></output><button class="button" id="hold-seats">${icon("ticket")}${l.hold}</button></div></div><p class="price-note">${l.priceNote}</p><p id="discount-note" class="muted note" hidden>${l.discountNote}</p><div class="auditorium"><div class="screen-arc"></div><p class="screen-label">${l.screen}</p><div class="seat-map" role="group" aria-label="${l.seatMapLabel}">${c.seatRows.map((row) => `<div class="seat-row"><span aria-hidden="true">${row}</span>${Array.from({ length: c.seatCount }, (_, i) =>
        {
            const seat = `${row}${i + 1}`;
            const taken = c.taken.includes(seat);
            return `<button class="seat${taken ? " taken" : ""}${i === 6 ? " aisle" : ""}" data-seat="${seat}" aria-label="${l.seat} ${seat}${taken ? `, ${l.taken}` : ""}" aria-pressed="false" ${taken ? "disabled" : ""}>${i + 1}</button>`;
        }).join("")}<span aria-hidden="true">${row}</span></div>`).join("")}</div><div class="legend"><span><i></i>${l.available}</span><span><i class="taken"></i>${l.taken}</span><span><i class="selected"></i>${l.selected}</span></div><p class="step-free">${l.stepFree}</p></div><div id="hold-panel" class="hold-panel" role="status" hidden></div><p class="selection-note" id="selection-note"></p><p class="local-limit">${l.localNote}</p></section></main>${footer(true)}<div class="grain" aria-hidden="true"></div>`;

    function renderTimes()
    {
        $("#detail-times").innerHTML = times.length ? times.map((item) => `<button class="time-pill${item === time ? " active" : ""}" data-time="${item}" aria-pressed="${item === time}">${item}</button>`).join("") : `<p class="muted">${l.none}</p>`;
        $("#screening-heading").textContent = `${l.screenOne} · ${day.toUpperCase()}${time ? ` · ${time}` : ""}`;
        $("#discount-note").hidden = !(day === "Tue" && time && time < "17:00");
        document.querySelectorAll(".seat:not(.taken)").forEach((button) => { button.disabled = !time; });
        updateSelection();
    }

    function updateSelection()
    {
        document.querySelectorAll("[data-seat]").forEach((button) =>
        {
            const on = selected.has(button.dataset.seat);
            button.classList.toggle("selected", on);
            button.setAttribute("aria-pressed", String(on));
        });
        $("#seat-total").textContent = `${selected.size} ${l.seats} · ${c.currency}${selected.size * c.price}`;
        $("#hold-seats").disabled = !time || selected.size === 0;
        $("#selection-note").textContent = selected.size ? [...selected].join(" · ") : l.empty;
    }

    function resetScreening()
    {
        selected.clear();
        $("#hold-panel").hidden = true;
        const parameters = new URLSearchParams({ film: film.slug, day });
        if (time) parameters.set("time", time);
        history.replaceState(null, "", `./film.html?${parameters}`);
        renderTimes();
    }

    function showHold(message, clearable = false)
    {
        $("#hold-panel").innerHTML = `<div>${icon("check")}<p>${message}</p></div>${clearable ? `<button class="text-link" id="clear-hold">${l.clear}</button>` : ""}`;
        $("#hold-panel").hidden = false;
        if (clearable)
        {
            $("#clear-hold").addEventListener("click", () =>
            {
                try
                {
                    localStorage.removeItem(storageKey);
                    selected.clear();
                    updateSelection();
                    showHold(l.holdCleared);
                }
                catch
                {
                    showHold(l.storageError);
                }
            });
        }
    }

    $(".screening-picker .day-chips").addEventListener("click", (event) =>
    {
        const chip = event.target.closest("[data-day]");
        if (!chip || chip.dataset.day === day) return;
        day = chip.dataset.day;
        times = timesFor(film, day);
        time = times.includes(time) ? time : times[0] || null;
        updateChips(day);
        resetScreening();
    });
    $("#detail-times").addEventListener("click", (event) =>
    {
        const pill = event.target.closest("[data-time]");
        if (!pill || pill.dataset.time === time) return;
        time = pill.dataset.time;
        resetScreening();
    });
    $(".seat-map").addEventListener("click", (event) =>
    {
        const button = event.target.closest("[data-seat]");
        if (!button || button.disabled) return;
        const seat = button.dataset.seat;
        if (selected.has(seat)) selected.delete(seat);
        else selected.add(seat);
        $("#hold-panel").hidden = true;
        updateSelection();
    });
    $(".seat-map").addEventListener("keydown", (event) =>
    {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        const button = event.target.closest("[data-seat]");
        if (!button) return;
        event.preventDefault();
        const buttons = [...document.querySelectorAll("[data-seat]")];
        const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -12, ArrowDown: 12 }[event.key];
        let next = buttons.indexOf(button) + step;
        while (buttons[next]?.disabled) next += step;
        buttons[next]?.focus();
    });
    $("#hold-seats").addEventListener("click", () =>
    {
        if (!time || selected.size === 0) return;
        try
        {
            if (!storageAvailable) throw Error("Storage unavailable");
            localStorage.setItem(storageKey, JSON.stringify({ film: film.slug, day, time, seats: [...selected] }));
            showHold(l.held, true);
        }
        catch
        {
            showHold(l.storageError);
        }
    });
    renderTimes();
    if (saved && selected.size) showHold(l.restored, true);
}

if (filmPage) detailPage();
else homepage();

const menuButton = $(".menu-button");
const mobileNav = $("#mobile-nav");
function closeMenu()
{
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", l.menu);
    menuButton.innerHTML = icon("menu");
}
menuButton.addEventListener("click", () =>
{
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? l.close : l.menu);
    menuButton.innerHTML = icon(open ? "x" : "menu");
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
        menuButton.focus();
    }
});
window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 60), { passive: true });
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
}, { threshold: 0.06 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
