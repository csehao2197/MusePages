import { content as c } from "./content.js";

const u = c.ui;
const icon = (name, className = "") => `<svg class="icon ${className}" aria-hidden="true"><use href="icons.svg#${name}"></use></svg>`;
const lantern = `<span class="lantern-mark" aria-hidden="true"><i></i></span>`;
const brand = `<span class="brand">${lantern}<span>${c.brandShort}<small>NIGHT MARKET</small></span></span>`;
const nav = () => c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
const image = ([src, alt], className = "", lazy = true) => `<img src="${src}" alt="${alt}" class="${className}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'}>`;
const heading = (eyebrow, title, intro = "") => `<div class="section-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2>${intro ? `<p class="intro">${intro}</p>` : ""}</div>`;
const filterButtons = [u.all, ...c.cuisines].map((name, i) => `<button class="chip${i === 0 ? " active" : ""}" type="button" aria-pressed="${i === 0}" data-cuisine="${name}">${name}</button>`).join("");
const slots = (stage) => stage.slots.map(([day, time, act]) => `<li><span class="schedule-time"><span>${day}</span> ${time}</span><span>${act}</span></li>`).join("");

document.querySelector("#app").innerHTML = `
    <a class="skip" href="#main">${u.skip}</a>
    <header class="header">
        <div class="shell header-inner">
            <a class="brand-link" href="#main" aria-label="${c.brand}">${brand}</a>
            <nav class="desktop-nav" aria-label="Main">${nav()}</nav>
            <a class="button small header-ticket" href="#tickets">${icon("Ticket")}${u.getTickets}</a>
            <button type="button" class="mobile-menu" aria-expanded="false" aria-controls="mobile-nav">${u.menu}${icon("ChevronDown")}</button>
        </div>
        <nav id="mobile-nav" aria-label="Mobile" hidden>${nav()}</nav>
    </header>
    <main id="main">
        <section class="hero" aria-labelledby="hero-title">
            ${image(c.images.hero, "hero-image", false)}
            <div class="hero-scrim"></div>
            <svg class="lantern-string" aria-hidden="true" viewBox="0 0 1200 70" preserveAspectRatio="none">
                <path d="M0 5 Q600 103 1200 5" fill="none" stroke="#ffb25e" stroke-opacity=".35"></path>
                ${[80, 220, 360, 500, 640, 780, 920, 1060].map((x, i) => `<g transform="translate(${x} ${12 + Math.sin(i / 7 * Math.PI) * 35})"><path d="M0 0v12" stroke="#ffb25e" stroke-opacity=".5"></path><rect x="-5" y="12" width="10" height="14" rx="4" fill="#ffb25e"></rect></g>`).join("")}
            </svg>
            <div class="shell hero-content">
                <p class="eyebrow hero-eyebrow">${icon("Sparkles")}${u.eyebrow}</p>
                <div class="hero-meta"><span>${icon("Clock")}${c.hours}</span><span>${icon("MapPin")}${c.venue}, ${c.city}</span></div>
                <h1 id="hero-title">${u.heroLead}<br><span>${u.heroAccent}</span></h1>
                <p class="hero-intro">${u.heroText}</p>
                <div class="hero-actions"><a class="button" href="#tickets">${u.heroCta}${icon("ArrowRight")}</a><a class="button outline" href="#map">${u.mapCta}</a></div>
                <div class="hero-stats">${u.stats.map(([value, label]) => `<span><strong>${value}</strong> ${label}</span>`).join("")}</div>
            </div>
            <span class="hero-side" aria-hidden="true">ASHPORT / AFTER DARK</span>
        </section>
        <div class="hero-bottom"><div class="shell"><span>${lantern}${u.heroFoot}</span><a href="#map">${u.explore}${icon("ArrowRight")}</a></div></div>
        <section class="section shell" id="map" aria-labelledby="map-title">
            <div class="map-heading">${heading(u.mapEyebrow, u.mapTitle, u.mapIntro)}<div class="map-count"><strong>18</strong><span>${u.results}</span></div></div>
            <div class="filters" role="group" aria-label="Filter vendors by cuisine">${filterButtons}</div>
            <p class="map-status" aria-live="polite"></p>
            <div class="map-layout">
                <div class="map-plate"><div id="market-map"></div><div class="map-footer"><span>${u.mapFoot}</span><div id="legend" tabindex="-1"><span class="sr-only">${u.legend}</span>${u.legendItems.map((item, i) => `<span><i class="legend-dot type-${i}"></i>${item}</span>`).join("")}</div></div></div>
                <aside class="vendor-card" aria-label="Vendor details" id="vendor-card"><div class="vendor-empty">${icon("UtensilsCrossed")}<h3>${u.vendorEmpty}</h3><p>${u.vendorEmptyText}</p><span class="mini-rule"></span><span class="eyebrow">18 REASONS TO STAY</span></div></aside>
            </div>
            <p class="map-help">${icon("MapPin")}${u.mapHelp}</p>
            <details class="vendor-directory"><summary>${u.listLabel}${icon("ChevronDown")}</summary><div id="vendor-list"></div></details>
        </section>
        <section class="section schedule-section" id="schedule">
            <div class="shell">${heading(u.stagesEyebrow, u.stagesTitle, u.stagesIntro)}
                <div class="stages">${c.stages.map((s, i) => `<article class="stage"><div class="stage-head"><span class="stage-icon">${icon("Music2")}</span><div><h3>${s.name}</h3><p>${s.note}</p></div><span class="stage-number">0${i + 1}</span></div><ul>${slots(s)}</ul></article>`).join("")}</div>
                <p class="note">${icon("Clock")}${u.pattern}</p>
            </div>
        </section>
        <section class="moments shell" aria-label="${u.moments}">${c.images.moments.map((img) => image(img)).join("")}</section>
        <section class="section shell" id="tickets">
            ${heading(u.ticketsEyebrow, u.ticketsTitle, u.ticketsIntro)}
            <div class="tiers">${c.tiers.map((tier, i) => `<article class="tier${i === 1 ? " featured" : ""}">${i === 1 ? `<span class="best">${icon("Sparkles")}${u.best}</span>` : ""}<span class="tier-number">0${i + 1} / ${icon("Ticket")}</span><h3>${tier.name}</h3><p class="price">$${tier.price}<span> / pass</span></p><p class="tier-detail">${tier.detail}</p><p class="tier-sub">${tier.sub}</p><button class="button pass-button" type="button" data-pass="${i}" aria-pressed="false">${u.passCta}${icon("ArrowRight")}</button><small>${u.passDemo}</small></article>`).join("")}</div>
            <div class="pass-plan" hidden aria-live="polite"><div><p class="eyebrow">${u.passStatus}</p><h3 id="pass-selection"></h3><p class="note">${u.noPayment}</p></div><div class="extra-tokens"><label for="extra">${u.extraTokens}</label><select id="extra">${[0, 2, 4, 6, 8, 10].map((n) => `<option value="${n}">${n}</option>`).join("")}</select><p>${u.estimate}: <strong id="plan-total"></strong></p><button class="text-button" type="button" id="clear-pass">${u.passReset}</button></div></div>
            <div class="token-explainer"><h3>${u.tokenTitle}</h3><div class="token-steps">${u.tokenRules.map((rule, i) => `<div>${icon("Coins")}<span><small>0${i + 1}</small>${rule}</span></div>`).join("")}</div></div>
        </section>
        <section class="section vendor-section" id="vendors">
            <div class="shell application-layout">
                <div class="vendor-story"><p class="eyebrow">${u.vendorsEyebrow}</p>${image(c.images.dessert)}<ul>${u.vendorBullets.map((bullet) => `<li>${icon("Check")}${bullet}</li>`).join("")}</ul></div>
                <div class="application-card"><h2>${u.vendorsTitle}</h2><p class="intro">${u.vendorsIntro}</p><p class="local-note">${icon("Check")}${u.formNote}</p>
                    <form id="vendor-form" novalidate>
                        <div class="form-grid">
                            <div class="field"><label for="name">${u.formFields.name} <span>*</span></label><input id="name" name="name" autocomplete="name" maxlength="100" placeholder="${u.namePlaceholder}" required aria-describedby="name-error"><p class="error" id="name-error"></p></div>
                            <div class="field"><label for="business">${u.formFields.business} <small>(${u.optional})</small></label><input id="business" name="business" autocomplete="organization" maxlength="120" placeholder="${u.businessPlaceholder}"></div>
                            <div class="field"><label for="cuisine">${u.formFields.cuisine}</label><select id="cuisine" name="cuisine">${[...c.cuisines, u.other].map((x) => `<option>${x}</option>`).join("")}</select></div>
                            <div class="field"><label for="dish">${u.formFields.dish} <span>*</span></label><input id="dish" name="dish" maxlength="140" placeholder="${u.dishPlaceholder}" required aria-describedby="dish-error"><p class="error" id="dish-error"></p></div>
                            <div class="field full"><label for="email">${u.formFields.email} <span>*</span></label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="${u.emailPlaceholder}" required aria-describedby="email-error"><p class="error" id="email-error"></p></div>
                        </div>
                        <fieldset><legend>${u.dayLabel}</legend><div class="day-chips">${u.days.map((d, i) => `<label class="day-chip"><input type="radio" name="day" value="${d}" ${i === 2 ? "checked" : ""}><span>${d}</span></label>`).join("")}</div></fieldset>
                        <div class="field"><label for="message">${u.formFields.message} <small>(${u.optional})</small></label><textarea id="message" name="message" maxlength="2000" rows="3" placeholder="${u.messagePlaceholder}"></textarea></div>
                        <p class="error" id="storage-error" role="status"></p><button class="button submit-button" type="submit">${u.submit}${icon("ArrowRight")}</button><p class="required-note">* ${u.required}</p>
                    </form>
                    <div class="application-success" hidden aria-live="polite" tabindex="-1">${icon("Check")}<h3>${u.successTitle}</h3><p>${u.success}</p><p class="error" id="reset-error" role="status"></p><button class="text-button" id="start-over" type="button">${u.startOver}${icon("ArrowRight")}</button></div>
                </div>
            </div>
        </section>
        <section class="section shell faq-section" id="faq">${heading(u.faqEyebrow, u.faqTitle)}<div class="faq-list">${c.faq.map(([q, a]) => `<details><summary>${q}${icon("ChevronDown")}</summary><p>${a}</p></details>`).join("")}</div></section>
    </main>
    <footer><div class="shell"><div class="footer-top"><a href="#main" class="brand-link">${brand}</a><nav aria-label="Footer">${nav()}</nav></div><p>${u.footerLine}</p><p class="fiction">${u.fiction}</p><div class="footer-bottom"><span>© ${c.brand}</span><a href="${u.creditUrl}" target="_blank" rel="noopener noreferrer">${u.credit}${icon("ArrowRight")}</a></div></div></footer>`;

document.querySelector("#map h2").id = "map-title";
const svgNS = "http://www.w3.org/2000/svg";
const pinPositions =
[
    [170, 214], [282, 214], [394, 214], [506, 214],
    [170, 112], [282, 112], [394, 112], [506, 112],
    [170, 316], [282, 316], [394, 316], [506, 316],
    [618, 112], [730, 112], [618, 214], [730, 214],
    [618, 316], [730, 316]
];
let selectedVendor = null;
let returnPin = null;
let cuisine = u.all;
let selectedPass = null;
const map = document.createElementNS(svgNS, "svg");
map.setAttribute("viewBox", "0 0 900 520");
map.setAttribute("aria-label", u.mapName);
map.classList.add("yard-map");
map.innerHTML = `
    <defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#2e2c5e"></circle></pattern></defs>
    <path d="M72 37Q65 22 96 24H802Q836 24 838 61L854 406Q857 448 817 450H508L460 484H358L324 450H87Q49 450 49 411Z" fill="#171638" stroke="#514b78" stroke-width="2"></path>
    <path d="M72 37Q65 22 96 24H802Q836 24 838 61L854 406Q857 448 817 450H508L460 484H358L324 450H87Q49 450 49 411Z" fill="url(#dots)"></path>
    <path d="M105 159H791M105 261H791M105 363H791M113 82V407M786 82V407" fill="none" stroke="#2e2c5e" stroke-width="2"></path>
    <g class="map-stages"><rect x="91" y="45" width="204" height="38" rx="10"></rect><text x="193" y="69">${c.stages[0].name}</text><rect x="584" y="388" width="219" height="43" rx="10"></rect><text x="693" y="415">${c.stages[1].name}</text></g>
    ${u.laneNames.map((text, i) => `<text class="lane-label" x="450" y="${182 + i * 102}">${text}</text>`).join("")}
    <text class="entrance" x="411" y="469">${u.entrance} ↑</text>
    <g class="map-utility"><rect x="98" y="386" width="146" height="43" rx="10"></rect><text x="171" y="413">${u.utility[0]}</text><rect x="264" y="386" width="140" height="43" rx="10"></rect><text x="334" y="413">+ ${u.utility[1]}</text></g>
    ${c.vendors.map((v, i) =>
    {
        const [x, y] = pinPositions[i];
        return `<g class="vendor-pin" data-vendor="${i}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="${v.name}, ${v.cuisine}, ${v.dish}, ${v.tokens} ${v.tokens === 1 ? u.token : u.tokens}, ${u.stall} ${v.stall}" aria-expanded="false"><rect class="stall-rect" x="-37" y="-25" width="74" height="54" rx="8"></rect><path d="M-37-15H37" stroke="#655374"></path><circle class="pin-ring" r="23"></circle><circle class="pin-center" r="18"></circle><text y="6">${v.number}</text><text class="stall-label" y="45">${v.stall}</text></g>`;
    }).join("")}`;
document.querySelector("#market-map").append(map);
const card = document.querySelector("#vendor-card");
const emptyCard = card.innerHTML;

function openVendor(index, trigger)
{
    const v = c.vendors[index];
    selectedVendor = index;
    returnPin = trigger;
    document.querySelectorAll(".vendor-pin").forEach((pin) =>
    {
        pin.setAttribute("aria-expanded", String(Number(pin.dataset.vendor) === index));
    });
    card.innerHTML = `<button type="button" class="close-card" aria-label="${u.closeVendor}">${icon("X")}</button><div class="card-top">${icon("UtensilsCrossed")}<span>${u.stall} ${v.stall}</span></div><p class="eyebrow">${v.cuisine}</p><h3>${v.name}</h3><div class="signature"><small>${u.signature}</small><p>${v.dish}</p></div><p class="vendor-price"><strong>${v.tokens}</strong> ${v.tokens === 1 ? u.token : u.tokens}<span>$${(v.tokens * 2.5).toFixed(2)}</span></p><a class="legend-link" href="#legend">${u.legendLink}${icon("ArrowRight")}</a>`;
    card.classList.add("is-open");
    card.querySelector(".close-card").addEventListener("click", closeVendor);
    card.querySelector(".legend-link").addEventListener("click", () =>
    {
        closeVendor(false);
        document.querySelector("#legend").focus();
    });
    if (matchMedia("(max-width: 760px)").matches)
    {
        card.setAttribute("role", "dialog");
        card.setAttribute("aria-modal", "true");
        setBackgroundInert(true);
    }
    card.querySelector(".close-card").focus({ preventScroll: true });
}

function setBackgroundInert(value)
{
    document.querySelectorAll("body > *, #app > *, main > *, .map-layout > *, #map > *").forEach((element) =>
    {
        if (element === card || element.contains(card))
        {
            return;
        }
        element.inert = value;
    });
}

function closeVendor(restoreFocus = true)
{
    card.classList.remove("is-open");
    card.removeAttribute("role");
    card.removeAttribute("aria-modal");
    setBackgroundInert(false);
    card.innerHTML = emptyCard;
    document.querySelectorAll(".vendor-pin").forEach((pin) => pin.setAttribute("aria-expanded", "false"));
    selectedVendor = null;
    if (restoreFocus && returnPin?.isConnected)
    {
        returnPin.focus({ preventScroll: true });
    }
}

function renderDirectory()
{
    const matches = c.vendors.filter((v) => cuisine === u.all || v.cuisine === cuisine);
    document.querySelector(".map-status").textContent = `${matches.length} / 18 ${u.results}${cuisine === u.all ? "" : ` · ${cuisine}`}`;
    document.querySelector("#vendor-list").innerHTML = matches.map((v) => `<button type="button" data-directory-vendor="${v.number - 1}"><span class="directory-number">${String(v.number).padStart(2, "0")}</span><span><strong>${v.name}</strong><small>${v.dish} · ${v.tokens} ${v.tokens === 1 ? u.token : u.tokens}</small></span><span>${v.stall}</span></button>`).join("");
    document.querySelectorAll("[data-directory-vendor]").forEach((button) => button.addEventListener("click", () => openVendor(Number(button.dataset.directoryVendor), button)));
}

document.querySelectorAll("[data-cuisine]").forEach((button) => button.addEventListener("click", () =>
{
    cuisine = button.dataset.cuisine;
    document.querySelectorAll("[data-cuisine]").forEach((chip) =>
    {
        const active = chip === button;
        chip.classList.toggle("active", active);
        chip.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".vendor-pin").forEach((pin) =>
    {
        const matches = cuisine === u.all || c.vendors[Number(pin.dataset.vendor)].cuisine === cuisine;
        pin.classList.toggle("dimmed", !matches);
        pin.classList.toggle("match", matches && cuisine !== u.all);
    });
    if (selectedVendor !== null)
    {
        closeVendor(false);
    }
    renderDirectory();
}));

document.querySelectorAll(".vendor-pin").forEach((pin) =>
{
    const open = () => openVendor(Number(pin.dataset.vendor), pin);
    pin.addEventListener("click", open);
    pin.addEventListener("keydown", (event) =>
    {
        if (event.key === "Enter" || event.key === " ")
        {
            event.preventDefault();
            open();
        }
    });
});
document.addEventListener("keydown", (event) =>
{
    if (selectedVendor !== null && event.key === "Escape")
    {
        closeVendor();
    }
    if (selectedVendor !== null && card.getAttribute("aria-modal") === "true" && event.key === "Tab")
    {
        const focusable = [...card.querySelectorAll("button, a")];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first)
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && document.activeElement === last)
        {
            event.preventDefault();
            first.focus();
        }
    }
});
matchMedia("(max-width: 760px)").addEventListener("change", () =>
{
    if (selectedVendor !== null)
    {
        closeVendor();
    }
});
renderDirectory();

const menuButton = document.querySelector(".mobile-menu");
const mobileNav = document.querySelector("#mobile-nav");
menuButton.addEventListener("click", () =>
{
    mobileNav.hidden = !mobileNav.hidden;
    menuButton.setAttribute("aria-expanded", String(!mobileNav.hidden));
});
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () =>
{
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
}));

function updatePlan()
{
    const tier = c.tiers[selectedPass];
    document.querySelector("#pass-selection").textContent = `${tier.name} · ${tier.tokens} ${u.tokens} included`;
    const total = tier.price + Number(document.querySelector("#extra").value) * 2.5;
    document.querySelector("#plan-total").textContent = `$${total.toFixed(2)}`;
}
document.querySelectorAll("[data-pass]").forEach((button) => button.addEventListener("click", () =>
{
    selectedPass = Number(button.dataset.pass);
    document.querySelectorAll("[data-pass]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    document.querySelector(".pass-plan").hidden = false;
    updatePlan();
}));
document.querySelector("#extra").addEventListener("change", updatePlan);
document.querySelector("#clear-pass").addEventListener("click", () =>
{
    const priorButton = document.querySelector(`[data-pass="${selectedPass}"]`);
    document.querySelector(".pass-plan").hidden = true;
    document.querySelector("#extra").value = "0";
    document.querySelectorAll("[data-pass]").forEach((button) => button.setAttribute("aria-pressed", "false"));
    selectedPass = null;
    priorButton?.focus({ preventScroll: true });
});

const form = document.querySelector("#vendor-form");
const success = document.querySelector(".application-success");
const storageKey = `${c.brandSlug}-vendor-application`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const limits = { name: 100, business: 120, cuisine: 40, dish: 140, email: 254, day: 12, message: 2000 };
function validSaved(data)
{
    return data && typeof data === "object" && !Array.isArray(data) &&
        Object.entries(limits).every(([key, max]) => typeof data[key] === "string" && data[key].length <= max) &&
        data.name.trim() && data.dish.trim() && emailPattern.test(data.email) &&
        [...c.cuisines, u.other].includes(data.cuisine) && u.days.includes(data.day);
}
function showSuccess(moveFocus = false)
{
    form.hidden = true;
    success.hidden = false;
    if (moveFocus)
    {
        success.focus({ preventScroll: true });
    }
}
try
{
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (validSaved(saved))
    {
        Object.keys(limits).forEach((key) =>
        {
            form.elements.namedItem(key).value = saved[key];
        });
        showSuccess();
    }
}
catch
{
    // A corrupt saved value or unavailable browser storage must not break the page.
}
form.addEventListener("submit", (event) =>
{
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    Object.keys(data).forEach((key) => data[key] = data[key].trim());
    const errors = { name: data.name ? "" : u.nameError, dish: data.dish ? "" : u.dishError, email: emailPattern.test(data.email) ? "" : u.emailError };
    for (const [key, message] of Object.entries(errors))
    {
        document.querySelector(`#${key}-error`).textContent = message;
        form.elements.namedItem(key).setAttribute("aria-invalid", String(Boolean(message)));
    }
    const firstError = Object.keys(errors).find((key) => errors[key]);
    if (firstError)
    {
        form.elements.namedItem(firstError).focus();
        return;
    }
    try
    {
        localStorage.setItem(storageKey, JSON.stringify(data));
        showSuccess(true);
    }
    catch
    {
        document.querySelector("#storage-error").textContent = u.storageError;
    }
});
document.querySelector("#start-over").addEventListener("click", () =>
{
    try
    {
        localStorage.removeItem(storageKey);
    }
    catch
    {
        document.querySelector("#reset-error").textContent = u.resetError;
        return;
    }
    document.querySelector("#reset-error").textContent = "";
    form.reset();
    success.hidden = true;
    form.hidden = false;
    form.querySelectorAll(".error").forEach((error) => error.textContent = "");
    form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
    form.elements.namedItem("name").focus({ preventScroll: true });
});

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
if (!reduceMotion.matches && "IntersectionObserver" in window)
{
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting)
            {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06 });
    document.querySelectorAll(".section-heading, .stage, .tier, .moments img").forEach((element, index) =>
    {
        element.classList.add("reveal");
        element.style.setProperty("--delay", `${index % 3 * 60}ms`);
        observer.observe(element);
    });
}
