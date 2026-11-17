import { content as c } from "./content.js";
import { icons } from "./icons.js";

const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
})[character]);

function icon(name)
{
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
}

function sectionHeading(number, title, intro = "")
{
    return `<div class="section-heading reveal"><p class="eyebrow">${escape(number)}</p><h2>${escape(title)}</h2>${intro ? `<p class="intro">${escape(intro)}</p>` : ""}</div>`;
}

function photo(item, className = "")
{
    return `<figure class="${className}"><div class="photo"><img src="${escape(item.image)}" alt="${escape(item.alt)}" loading="lazy" decoding="async" width="1459" height="2000"></div><figcaption>${escape(item.caption)}</figcaption></figure>`;
}

function waveArc(height)
{
    const crest = 37 - height * 7;
    return `<svg class="wave-arc" viewBox="0 0 100 50" aria-hidden="true"><path d="M3 39 C22 39 24 ${crest} 47 ${crest} C67 ${crest} 68 39 97 39" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function windArrow(direction)
{
    return `<svg class="wind-arrow" viewBox="0 0 24 24" style="--direction:${direction}deg" aria-hidden="true"><path d="M12 20V4m-5 5 5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function tideCurve(phase)
{
    const x = 5 + phase * 90;
    const y = 16 - Math.sin(phase * Math.PI * 2) * 9;
    return `<svg class="tide-curve" viewBox="0 0 100 32" aria-hidden="true"><path d="M5 16 C20 4 35 4 50 16 S80 28 95 16" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.5" fill="#DFA95C"/></svg>`;
}

function coastline()
{
    return `<svg class="beach-map" viewBox="0 0 1440 320" role="img" aria-label="${escape(c.find.mapLabel)}" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="640" fill="#8FB4C2"/>
        <path d="M0 208Q160 171 337 225T675 202Q845 133 978 151T1255 119L1440 66V640H0Z" fill="#E7DCCC"/>
        <path d="M0 276Q188 221 360 284T750 247Q990 177 1100 223T1440 147V640H0Z" fill="#F4EDE3" opacity=".5"/>
        <g fill="none" stroke="#3E6474" stroke-width="1.5" opacity=".35">
            <path d="M90 94q90-25 180 0t180 0"/><path d="M460 47q90-25 180 0t180 0"/>
        </g>
        <path d="M0 254Q140 207 347 257T704 235Q872 174 1000 184T1440 105" fill="none" stroke="#B9A88F" stroke-width="3" stroke-dasharray="9 8"/>
        <path d="M986 178l-35-83m-8 5 16-6m-19-1 16-6m-19-1 16-6" fill="none" stroke="#3E6474" stroke-width="5"/>
        <text x="288" y="142" class="map-sea">${escape(c.find.seaLabel)}</text>
        <text x="638" y="274" class="map-road">${escape(c.find.roadLabel)}</text>
        <text x="879" y="66" class="map-road">${escape(c.find.jettyLabel)}</text>
        <g class="map-pin" style="transform-origin:1040px 153px">
            <path d="M1040 153c-5-9-19-22-19-36a19 19 0 0 1 38 0c0 14-14 27-19 36Z" fill="#DFA95C" stroke="#3E6474" stroke-width="2"/>
            <circle cx="1040" cy="117" r="5" fill="#F4EDE3" stroke="#3E6474" stroke-width="1.5"/>
        </g>
        <rect x="1071" y="96" width="260" height="35" rx="8" fill="#F4EDE3"/>
        <text x="1085" y="118" class="map-caption">${escape(c.find.pinLabel)}</text>
    </svg>`;
}

const navLinks = c.navigation.map((item) => `<a href="#${item.target}">${escape(item.label)}</a>`).join("");
document.title = c.title;
document.getElementById("app").innerHTML = `
    <a class="skip-link" href="#main">${escape(c.ui.skip)}</a>
    <header class="site-header" id="header">
        <div class="container header-inner">
            <a class="wordmark" href="#top" aria-label="${escape(c.title)}">${escape(c.brand)}</a>
            <nav class="desktop-nav" aria-label="${escape(c.ui.menu)}">${navLinks}</nav>
            <a class="button header-book" href="#book">${escape(c.ui.book)}</a>
            <button class="menu-toggle" type="button" aria-label="${escape(c.ui.openMenu)}" aria-expanded="false" aria-controls="mobile-nav">${icon("menu")}</button>
        </div>
        <nav class="mobile-nav" id="mobile-nav" aria-label="${escape(c.ui.menu)}" hidden>${navLinks}</nav>
    </header>
    <main id="main">
        <section class="hero" id="top" aria-labelledby="hero-heading">
            <div class="hero-image"><img src="${escape(c.hero.image)}" alt="${escape(c.hero.alt)}" fetchpriority="high" width="2000" height="1143"></div>
            <div class="hero-shade"></div>
            <div class="container hero-content">
                <p class="eyebrow hero-enter">${escape(c.hero.label)}</p>
                <h1 id="hero-heading" class="hero-enter">${escape(c.hero.heading)}</h1>
                <p class="hero-intro hero-enter">${escape(c.hero.description)}</p>
                <div class="hero-actions hero-enter"><a class="button" href="#book">${escape(c.ui.book)}${icon("arrow-right")}</a><a class="text-link hero-secondary" href="#lessons">${escape(c.hero.secondary)}${icon("arrow-right")}</a></div>
            </div>
            <div class="hero-melt"></div>
            <div class="container hero-bottom"><span>${escape(c.hero.bottomLeft)}</span><span>${escape(c.hero.bottomRight)}</span></div>
        </section>
        <section class="forecast" aria-labelledby="forecast-heading">
            <div class="container">
                <div class="forecast-heading"><div><h2 id="forecast-heading">${escape(c.forecast.heading)}</h2><p>${escape(c.forecast.intro)}</p></div><span class="sample-chip">${escape(c.forecast.label)}</span></div>
                <div class="forecast-grid">${c.forecast.rows.map((row, index) => `
                    <article class="forecast-cell reveal" style="--delay:${index * 80}ms;--loop-delay:${index * 200}ms">
                        <h3>${escape(row.day)}</h3>
                        <div class="swell">${waveArc(row.height)}<strong>${row.height} <span>${escape(c.forecast.waveUnit)}</span></strong></div>
                        <div class="wind">${windArrow(row.direction)}<span>${escape(row.wind)} ${row.speed} ${escape(c.forecast.windUnit)}</span></div>
                        <div class="tide">${tideCurve(row.phase)}<span>${escape(row.tide)}</span></div>
                    </article>`).join("")}</div>
                <p class="forecast-footnote">${escape(c.forecast.footnote)}</p>
            </div>
        </section>
        <section class="section container" id="lessons">
            ${sectionHeading(c.ui.lessonsNumber, c.lessons.heading, c.lessons.intro)}
            <div class="lessons-grid">${c.lessons.items.map((level, index) => `
                <article class="level-card reveal" style="--delay:${index * 100}ms">
                    <p class="level-tag">${escape(level.tagline)}</p>
                    <h3>${escape(level.name)}</h3>
                    <p class="learn-label">${escape(c.ui.learn)}</p>
                    <ul>${level.skills.map((skill) => `<li>${escape(skill)}</li>`).join("")}</ul>
                    <div class="level-meta"><span>${escape(level.duration)} · ${escape(level.included)}</span><strong>${escape(level.price)}</strong></div>
                    <a class="text-link" href="#book" data-level="${index}">${escape(c.ui.bookLevel)}${icon("arrow-right")}</a>
                </article>`).join("")}</div>
            <p class="section-note">${escape(c.ui.gearNote)}</p>
        </section>
        <section class="section camps-section" id="camps">
            <div class="container">
                ${sectionHeading(c.ui.campsNumber, c.camps.heading)}
                <div class="camps-layout"><div class="camp-rows">${c.camps.items.map((camp, index) => `
                    <article class="camp-row reveal" style="--delay:${index * 100}ms">
                        <div><h3>${escape(camp.name)}</h3><p>${escape(camp.description)}</p></div>
                        <div class="camp-detail"><p>${escape(camp.includes)}</p><strong class="camp-price">${escape(camp.price)}</strong><a class="text-link" href="#book" data-package="${index}">${escape(c.ui.bookCamp)}${icon("arrow-right")}</a></div>
                    </article>`).join("")}</div>${photo(c.camps, "camp-photo reveal")}</div>
            </div>
        </section>
        <section class="section container" id="coaches">
            ${sectionHeading(c.ui.coachesNumber, c.coaches.heading, c.coaches.intro)}
            <div class="coach-grid">${c.coaches.items.map((coach, index) => `
                <article class="coach-card reveal" style="--delay:${index * 120}ms">
                    ${photo(coach)}
                    <div class="coach-name"><h3>${escape(coach.name)}</h3><span>${escape(coach.role)}</span></div>
                    <p>${escape(coach.description)}</p>
                    <span class="specialty">${escape(coach.specialty)}</span>
                </article>`).join("")}</div>
        </section>
        <section class="section booking-section" id="book">
            <div class="container">
                ${sectionHeading(c.ui.bookingNumber, c.booking.heading, c.booking.intro)}
                <div class="booking-layout">
                    <aside class="contact reveal"><h3>${escape(c.booking.contactHeading)}</h3>
                        <ul><li>${icon("map-pin")}<span>${escape(c.booking.address)}</span></li><li>${icon("clock")}<span>${escape(c.booking.hours)}</span></li><li>${icon("phone")}<a href="${escape(c.booking.phoneLink)}">${escape(c.booking.phone)}</a></li><li>${icon("mail")}<a href="${escape(c.booking.emailLink)}">${escape(c.booking.email)}</a></li></ul>
                        <p>${escape(c.booking.contactNote)}</p>
                    </aside>
                    <form id="booking-form" class="booking-form reveal">
                        <div class="input-row"><label for="name">${escape(c.booking.nameLabel)}<input id="name" name="name" autocomplete="name" required maxlength="100" placeholder="${escape(c.booking.namePlaceholder)}"></label><label for="email">${escape(c.booking.emailLabel)}<input id="email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="${escape(c.booking.emailPlaceholder)}"></label></div>
                        <fieldset><legend>${escape(c.booking.levelLabel)}</legend><div class="chip-group">${c.lessons.items.map((level, index) => `<label class="choice"><input type="radio" name="level" value="${index}" ${index === 0 ? "checked" : ""}><span>${escape(level.name)}</span></label>`).join("")}</div></fieldset>
                        <fieldset><legend>${escape(c.booking.whenLabel)}</legend><div class="chip-group">${c.booking.times.map((time, index) => `<label class="choice"><input type="radio" name="when" value="${index}" ${index === 0 ? "checked" : ""}><span>${escape(time)}</span></label>`).join("")}</div></fieldset>
                        <div class="party-row"><div><label for="surfers">${escape(c.booking.partyLabel)}</label><p>${escape(c.booking.partyNote)}</p></div><div class="stepper"><button type="button" id="fewer" aria-label="${escape(c.booking.fewer)}" disabled>${icon("minus")}</button><output id="surfers" aria-live="polite">1</output><button type="button" id="more" aria-label="${escape(c.booking.more)}">${icon("plus")}</button></div></div>
                        <div class="selected-package" hidden><span>${escape(c.booking.packageLabel)}: <strong id="package-name"></strong></span><button type="button" id="clear-package" aria-label="${escape(c.booking.clearPackage)}">${icon("x")}</button></div>
                        <button class="button save-button" type="submit">${escape(c.booking.save)}${icon("arrow-right")}</button>
                        <p class="form-note">${escape(c.booking.beforeSave)}</p>
                        <p class="save-status" role="status" aria-live="polite" hidden></p>
                    </form>
                </div>
            </div>
        </section>
        <section class="section find-section" id="find-us">
            <div class="container">${sectionHeading(c.ui.findNumber, c.find.heading)}</div>
            <div class="map-wrap reveal">${coastline()}</div>
            <div class="container find-layout">${photo(c.find, "boards-photo reveal")}<div class="directions reveal"><p class="eyebrow">${escape(c.beach)}</p><h3>${escape(c.find.headingBelow)}</h3><p>${escape(c.find.directions)}</p><p class="directions-note">${escape(c.find.note)}</p></div></div>
        </section>
    </main>
    <footer><div class="container footer-layout"><div><a class="wordmark" href="#top">${escape(c.brand)}</a><p>${escape(c.ui.footerLine)}</p></div><div><nav aria-label="${escape(c.ui.menu)}">${c.navigation.slice(0, 3).map((item) => `<a href="#${item.target}">${escape(item.label)}</a>`).join("")}<a href="#book">${escape(c.ui.footerBook)}</a></nav><p class="footer-contact"><a href="${escape(c.booking.emailLink)}">${escape(c.booking.email)}</a><span> · </span><a href="${escape(c.booking.phoneLink)}">${escape(c.booking.phone)}</a></p><a class="credit" href="${escape(c.ui.creditUrl)}" target="_blank" rel="noopener noreferrer">${escape(c.ui.credit)}</a></div></div></footer>
    <div class="grain-overlay" aria-hidden="true"></div>`;

const header = document.getElementById("header");
const toggle = document.querySelector(".menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileWidth = window.matchMedia("(max-width: 760px)");

function setMenu(open)
{
    mobileNav.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? c.ui.closeMenu : c.ui.openMenu);
    toggle.innerHTML = icon(open ? "x" : "menu");
    header.classList.toggle("menu-open", open);
}

toggle.addEventListener("click", () => setMenu(mobileNav.hidden));
mobileNav.addEventListener("click", (event) =>
{
    if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape" && !mobileNav.hidden)
    {
        setMenu(false);
        toggle.focus();
    }
});
document.addEventListener("click", (event) =>
{
    if (!mobileNav.hidden && !event.composedPath().includes(header)) setMenu(false);
});
mobileWidth.addEventListener("change", () =>
{
    if (!mobileWidth.matches) setMenu(false);
    updateMap();
});

function updateMap()
{
    document.querySelector(".beach-map").setAttribute("viewBox", mobileWidth.matches ? "800 0 640 525" : "0 0 1440 320");
}
updateMap();

let scrollQueued = false;
const heroImage = document.querySelector(".hero-image");
const campImage = document.querySelector(".camp-photo .photo img");

function updateScroll()
{
    header.classList.toggle("scrolled", window.scrollY > 80);
    heroImage.style.translate = reducedMotion.matches ? "none" : `0 ${Math.min(window.scrollY, 1000) * 0.1}px`;
    if (!reducedMotion.matches)
    {
        const distance = document.querySelector(".camp-photo").getBoundingClientRect().top - window.innerHeight / 2;
        campImage.style.translate = `0 ${Math.max(-18, Math.min(18, distance * 0.06))}px`;
    }
    else
    {
        campImage.style.translate = "none";
    }
    scrollQueued = false;
}

window.addEventListener("scroll", () =>
{
    if (!scrollQueued)
    {
        scrollQueued = true;
        requestAnimationFrame(updateScroll);
    }
}, { passive: true });
reducedMotion.addEventListener("change", updateScroll);
updateScroll();

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
}, { threshold: 0.08 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const form = document.getElementById("booking-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const count = document.getElementById("surfers");
const fewer = document.getElementById("fewer");
const more = document.getElementById("more");
const status = document.querySelector(".save-status");
const packagePanel = document.querySelector(".selected-package");
let surfers = 1;
let selectedPackage = "";
let hasSaved = false;

function announce(message)
{
    status.hidden = false;
    status.textContent = message;
}

function markChanged()
{
    if (hasSaved) announce(c.booking.changed);
}

function updateParty()
{
    count.value = String(surfers);
    fewer.disabled = surfers <= 1;
    more.disabled = surfers >= c.classSize;
    if (!reducedMotion.matches)
    {
        count.animate([{ transform: "translateY(2px)" }, { transform: "translateY(0)" }], { duration: 200 });
    }
}

fewer.addEventListener("click", () =>
{
    surfers = Math.max(1, surfers - 1);
    updateParty();
    markChanged();
});
more.addEventListener("click", () =>
{
    surfers = Math.min(c.classSize, surfers + 1);
    updateParty();
    markChanged();
});
form.addEventListener("input", markChanged);

function choosePackage(name)
{
    selectedPackage = name;
    document.getElementById("package-name").textContent = name;
    packagePanel.hidden = !name;
}

document.querySelectorAll("[data-level]").forEach((link) =>
{
    link.addEventListener("click", () =>
    {
        form.querySelector(`input[name="level"][value="${link.dataset.level}"]`).checked = true;
        choosePackage("");
        markChanged();
    });
});
document.querySelectorAll("[data-package]").forEach((link) =>
{
    link.addEventListener("click", () =>
    {
        choosePackage(c.camps.items[Number(link.dataset.package)].name);
        markChanged();
    });
});
document.getElementById("clear-package").addEventListener("click", () =>
{
    choosePackage("");
    markChanged();
});

form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!nameInput.value.trim())
    {
        nameInput.value = "";
        nameInput.reportValidity();
        return;
    }
    const request =
    {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        level: c.lessons.items[Number(form.elements.level.value)].name,
        when: c.booking.times[Number(form.elements.when.value)],
        surfers,
        package: selectedPackage
    };
    try
    {
        localStorage.setItem(c.booking.storageKey, JSON.stringify(request));
        hasSaved = true;
        announce(c.booking.saved);
    }
    catch
    {
        announce(c.booking.storageError);
    }
});

try
{
    const saved = JSON.parse(localStorage.getItem(c.booking.storageKey));
    if (saved && typeof saved === "object" && typeof saved.name === "string" && typeof saved.email === "string")
    {
        const level = c.lessons.items.findIndex((item) => item.name === saved.level);
        const when = c.booking.times.indexOf(saved.when);
        if (level >= 0 && when >= 0 && Number.isInteger(saved.surfers) && saved.surfers >= 1 && saved.surfers <= c.classSize)
        {
            nameInput.value = saved.name.slice(0, 100);
            emailInput.value = saved.email.slice(0, 254);
            form.querySelector(`input[name="level"][value="${level}"]`).checked = true;
            form.querySelector(`input[name="when"][value="${when}"]`).checked = true;
            surfers = saved.surfers;
            updateParty();
            if (c.camps.items.some((item) => item.name === saved.package)) choosePackage(saved.package);
            hasSaved = true;
            announce(c.booking.restored);
        }
    }
}
catch
{
    // Unavailable storage or old malformed data must not prevent browsing.
}
