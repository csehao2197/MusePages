import { content as c } from "./content.js";

const state =
{
    category: "All",
    day: "All weekdays",
    session: "",
    range: "Adult",
    size: "",
    rentals: false,
    mode: "Visit",
    package: "big",
    snack: "All"
};
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const image = (key, extra = "") => `<img src="${c.images[key][0]}" alt="${c.images[key][1]}" ${extra}>`;
const arrow = `<span aria-hidden="true">${c.common.arrow}</span>`;
const wave = `<svg class="wave" viewBox="0 0 1440 74" preserveAspectRatio="none" aria-hidden="true"><path fill="#546B24" d="M0 10Q180 80 360 28T720 28T1080 28T1440 10V74H0Z"/><path fill="#32170E" d="M0 40Q180 110 360 58T720 58T1080 58T1440 40V74H0Z"/></svg>`;
const sparkle = `<svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 0Q33 27 60 30Q33 33 30 60Q27 33 0 30Q27 27 30 0Z" fill="currentColor"/></svg>`;
const disco = `<svg class="disco" viewBox="0 0 120 160" aria-hidden="true"><defs><clipPath id="ball"><circle cx="60" cy="99" r="48"/></clipPath></defs><path d="M60 0V50" stroke="#32170E" stroke-width="3"/><circle cx="60" cy="99" r="48" fill="#FFFDF5" stroke="#32170E" stroke-width="3"/><g clip-path="url(#ball)" fill="none" stroke="#32170E" stroke-width="2"><ellipse cx="60" cy="99" rx="20" ry="48"/><ellipse cx="60" cy="99" rx="37" ry="48"/><path d="M12 82H108M12 100H108M12 118H108M20 66H100M20 134H100"/></g><path d="M76 78H92V94H76ZM40 102H57V118H40ZM60 121H74V134H60Z" fill="#F2B807"/></svg>`;
const pillButtons = (items, type) => items.map((item, index) => `<button type="button" class="filter" data-${type}="${item}" aria-pressed="${index === 0}">${item}</button>`).join("");
const field = (id, label, control, help = "") => `<div class="field"><label for="${id}">${label}</label>${control}${help ? `<small id="${id}-help">${help}</small>` : ""}<span class="error" id="${id}-error"></span></div>`;

$("#app").innerHTML = `
    <a class="skip" href="#main">${c.common.skip}</a>
    <header id="top" class="header">
        <div class="header-inner">
            <a class="brand" href="#top" aria-label="${c.brand}">${c.brand}<span class="brand-wheel" aria-hidden="true">✳</span></a>
            <nav aria-label="${c.ui.navigation}">${c.navigation.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</nav>
            <a class="button dark header-cta" href="#planner">${c.common.plan} ${arrow}</a>
        </div>
    </header>
    <main id="main">
        <section class="hero" aria-labelledby="welcome-title">
            <div class="hero-inner wrap">
                <div class="hero-copy">
                    <p class="eyebrow">${c.hero.eyebrow}</p>
                    <h1 id="welcome-title">${c.tagline.replace(". ", ".<br>")}</h1>
                    <p class="hero-intro">${c.hero.intro}</p>
                    <div class="hero-actions"><a class="button dark" href="#sessions">${c.hero.primary} ${arrow}</a><a class="text-link" href="#parties">${c.hero.secondary} ${arrow}</a></div>
                    <div class="info-pills"><span>${c.address}, ${c.city}</span><span>${c.hero.rentalPill}</span><span>${c.hero.welcomePill}</span></div>
                    <p class="hero-helper">${c.hero.helper}</p>
                </div>
                <div class="hero-visual">
                    <div class="hero-photo">${image("hero", 'fetchpriority="high" width="560" height="480"')}${disco}<div class="spark spark-one">${sparkle}</div><div class="spark spark-two">${sparkle}</div></div>
                    <div class="roll-sticker"><span>${c.hero.sticker[0]}<br>${c.hero.sticker[1]}</span>${arrow}</div>
                    <p class="caption">${c.hero.caption}</p>
                </div>
            </div>
            ${wave}
        </section>
        <div class="groove-strip"><div class="wrap">${c.hero.bottom.map((t) => `<span>${t}</span>`).join('<span class="strip-star" aria-hidden="true">✳</span>')}</div></div>
        <section class="schedule section" id="sessions" aria-labelledby="sessions-title">
            <div class="wrap">
                <p class="eyebrow">${c.schedule.eyebrow}</p>
                <div class="section-heading"><h2 id="sessions-title">${c.schedule.title}</h2><p>${c.schedule.intro}</p></div>
                <div class="filter-row"><div class="filters" role="group" aria-label="${c.ui.sessionType}">${pillButtons(c.schedule.categories, "category")}</div><label class="weekday-label" for="weekday">${c.schedule.weekdayLabel}<select id="weekday">${c.common.days.map((d) => `<option>${d}</option>`).join("")}</select></label></div>
                <div class="result-row"><p id="session-count" aria-live="polite"></p><button class="text-button" type="button" id="reset-filters">${c.schedule.reset}</button></div>
                <div class="tickets" id="session-list"></div>
                <div class="schedule-notes"><p>${c.schedule.note}</p><p>${c.schedule.ticketNote}</p></div>
            </div>
        </section>
        <section class="rental section" id="rentals" aria-labelledby="rental-title">
            <div class="wrap">
                <p class="eyebrow">${c.rental.eyebrow}</p><h2 id="rental-title">${c.rental.title}</h2>
                <p class="section-intro">${c.rental.intro}</p>
                <div class="rental-panel">
                    <div class="rental-photo">${image("rentals", 'loading="lazy" width="800" height="600"')}</div>
                    <div class="rental-controls"><h3>${c.rental.sizeTitle}</h3><div class="filters" role="group" aria-label="${c.ui.range}"><button type="button" class="filter" data-range="Adult" aria-pressed="true">${c.rental.ranges[0]}</button><button type="button" class="filter" data-range="Youth" aria-pressed="false">${c.rental.ranges[1]}</button></div><p class="small-label">${c.rental.pick}</p><div id="sizes" class="sizes" role="group" aria-label="${c.ui.sizes}"></div><p id="chosen-size" aria-live="polite"></p><p>${c.rental.helper}</p><label class="check"><input type="checkbox" class="rental-check">${c.common.rentals}</label><p class="included-help" hidden>${c.rental.included}</p><small>${c.rental.socks}</small></div>
                </div>
                <div class="beginner-story">${image("family", 'loading="lazy" width="440" height="300"')}<div><h3>${c.rental.storyTitle}</h3><p>${c.rental.story}</p></div><div class="story-spark">${sparkle}</div></div>
            </div>
        </section>
        <section class="parties section" id="parties" aria-labelledby="party-title">
            <div class="wrap"><p class="eyebrow">${c.party.eyebrow}</p><div class="section-heading"><h2 id="party-title">${c.party.title}</h2><p>${c.party.intro}</p></div>
                <div class="party-banner">${image("party", 'loading="lazy" width="1180" height="340"')}<span>${c.party.house}</span></div>
                <div class="packages">${c.party.packages.map((p, index) => `<article class="package ${index === 1 ? "featured" : ""}" data-package-card="${p.id}">${index === 1 ? `<p class="package-ribbon">${c.party.favorite}</p>` : ""}<h3>${p.name}</h3><p class="package-price">$${p.price}<span>${c.party.forGuests(p.guests)}</span></p><ul>${p.details.map((d) => `<li>${d}</li>`).join("")}</ul><button class="button outline" type="button" data-party="${p.id}" aria-pressed="false">${c.party.choose(p.name)} ${arrow}</button></article>`).join("")}</div>
                <p class="party-footnote">${c.party.extra}</p><p>${c.party.shared}</p>
            </div>
        </section>
        <section class="planner section" id="planner" aria-labelledby="planner-title">
            <div class="wrap"><p class="eyebrow">${c.planner.eyebrow}</p><h2 id="planner-title">${c.planner.title}</h2><p class="section-intro">${c.planner.intro}</p><p class="local-note">${c.planner.local}</p>
                <div class="planner-grid"><form id="plan-form" novalidate>
                    <div class="filters mode-tabs" role="group" aria-label="${c.ui.planType}">${pillButtons(c.planner.modes, "mode")}</div>
                    <div class="form-pair">${field("name", c.planner.name, '<input id="name" name="name" autocomplete="name" required maxlength="80" aria-describedby="name-error">')}${field("email", c.planner.email, '<input id="email" name="email" type="email" autocomplete="email" required maxlength="150" aria-describedby="email-help email-error">', c.planner.emailNote)}</div>
                    ${field("session", c.planner.session, `<select id="session" name="session" required aria-describedby="session-error"><option value="">${c.planner.sessionPlaceholder}</option>${c.schedule.sessions.map((s) => `<option value="${s.id}">${s.day} · ${s.name} · ${s.time}</option>`).join("")}</select>`)}
                    <div id="package-field" hidden>${field("package", c.planner.package, `<select id="package">${c.party.packages.map((p) => `<option value="${p.id}" ${p.id === state.package ? "selected" : ""}>${p.name} · $${p.price}</option>`).join("")}</select>`)}</div>
                    ${field("guests", c.planner.guests, '<input id="guests" name="guests" type="number" value="1" min="1" max="24" step="1" required aria-describedby="guests-help guests-error">', c.planner.guestsHelp)}
                    <label class="check planner-rental"><input type="checkbox" class="rental-check">${c.common.rentals}</label><small class="included-help" hidden>${c.rental.included}</small>
                    ${field("rentalSize", c.planner.rentalSize, `<select id="rentalSize" aria-describedby="rentalSize-help rentalSize-error"><option value="">${c.planner.sizePlaceholder}</option>${Array.from({ length: 13 }, (_, i) => `<option value="Adult ${i + 1}">${c.rental.adult} ${i + 1}</option>`).join("")}${Array.from({ length: 6 }, (_, i) => `<option value="Youth Y${i + 8}">${c.rental.youth} Y${i + 8}</option>`).join("")}</select>`, c.rental.group)}
                    ${field("notes", c.planner.notes, '<textarea id="notes" name="notes" maxlength="240" rows="3" aria-describedby="notes-help notes-error"></textarea>', c.planner.notesHelp)}
                    <label class="check age-check"><input id="age" type="checkbox" required aria-describedby="age-error">${c.planner.consent}</label><span class="error" id="age-error"></span>
                    <button class="button dark submit" type="submit">${c.planner.submit} ${arrow}</button>
                </form><aside class="tally"><div class="tally-top"><span class="small-label">${c.brand}</span><span aria-hidden="true">✳</span></div><h3>${c.planner.summary}</h3><div id="summary" aria-live="polite" aria-atomic="true"></div><p class="tally-note">${c.planner.summaryNote}</p><div class="age-rule"><strong>${c.planner.age}</strong><p id="age-rule"></p></div><p class="demo-disclaimer">${c.planner.disclaimer}</p></aside></div>
            </div>
        </section>
        <section class="snacks section" id="snacks" aria-labelledby="snack-title">
            <div class="wrap"><p class="eyebrow">${c.snack.eyebrow}</p><h2 id="snack-title">${c.snack.title}</h2><p class="section-intro">${c.snack.intro}</p>
                <div class="snack-grid"><div class="snack-photo">${image("snacks", 'loading="lazy" width="800" height="680"')}</div><div class="menu"><div class="filters" role="group" aria-label="${c.ui.snackCategory}">${pillButtons(c.snack.categories, "snack")}</div><p class="sr-only" aria-live="polite" id="snack-count"></p><div id="menu-list"></div><small>${c.snack.note}</small></div></div>
            </div>
        </section>
        <section class="house section" aria-labelledby="house-title"><div class="wrap house-grid"><div><p class="eyebrow">${c.house.eyebrow}</p><h2 id="house-title">${c.house.title}</h2>${c.house.questions.map(([q, a]) => `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join("")}</div><div class="visit-info"><h3>${c.house.visit}</h3><p class="address">${c.address}<br>${c.city}</p><h4>${c.house.hoursTitle}</h4><dl>${c.house.hours.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("")}</dl><small>${c.house.fictional}</small></div></div></section>
    </main>
    <footer><div class="wrap footer-top"><a class="brand" href="#top">${c.brand}<span class="brand-wheel" aria-hidden="true">✳</span></a><p>${c.footer.note}</p><a href="#top">${c.common.back} ↑</a></div><div class="wrap footer-bottom"><a href="${c.footer.url}" rel="noreferrer">${c.footer.credit}</a><button type="button" id="motion-toggle" aria-pressed="false">${c.common.pause}</button></div></footer>
    <dialog id="receipt" aria-labelledby="receipt-title"><button type="button" class="dialog-close" aria-label="${c.common.close}">×</button><p class="eyebrow">${c.brand} / ${c.planner.modes[0]} + ${c.planner.modes[1]}</p><h2 id="receipt-title">${c.planner.receipt}</h2><p>${c.planner.receiptIntro}</p><dl id="receipt-details"></dl><p class="receipt-disclaimer">${c.planner.disclaimer}</p><div class="dialog-actions"><button type="button" class="button dark" id="edit-plan">${c.planner.edit}</button><button type="button" class="button outline" id="clear-plan">${c.planner.clear}</button></div></dialog>
`;

function session()
{
    return c.schedule.sessions.find((s) => s.id === state.session);
}

function packageChoice()
{
    return c.party.packages.find((p) => p.id === state.package);
}

function included()
{
    return state.mode === "Party" || Boolean(session()?.included);
}

function renderSessions()
{
    const matches = c.schedule.sessions.filter((s) => (state.category === "All" || s.category === state.category) && (state.day === "All weekdays" || s.day === state.day));
    $("#session-count").textContent = c.schedule.result(matches.length);
    $("#session-list").innerHTML = matches.length ? matches.map((s) => `<article class="ticket ${state.session === s.id ? "is-selected" : ""}"><div class="ticket-top"><span class="small-label">${s.day}</span><span class="badge ${s.category === "Adults" ? "adult-badge" : ""}">${s.category}</span></div><h3>${s.name}</h3><p class="ticket-time">${s.time}</p><p class="ticket-age">${s.age}</p><div class="ticket-bottom"><p><strong>$${s.price}</strong><small>${s.included ? c.schedule.rentalIncluded : c.schedule.rentalExtra}</small></p><button type="button" class="session-button" data-session="${s.id}" aria-label="${c.common.choose}: ${s.name}" aria-pressed="${state.session === s.id}">${state.session === s.id ? c.common.chosen : c.common.choose} ${arrow}</button></div></article>`).join("") : `<p class="empty-state">${c.schedule.empty}</p>`;
}

function renderSizes()
{
    const values = state.range === "Adult" ? Array.from({ length: 13 }, (_, i) => `${i + 1}`) : Array.from({ length: 6 }, (_, i) => `Y${i + 8}`);
    $("#sizes").innerHTML = values.map((value) => `<button type="button" data-size="${state.range} ${value}" aria-pressed="${state.size === `${state.range} ${value}`}">${value}</button>`).join("");
    $("#chosen-size").textContent = state.size ? c.rental.sizeSelected(state.size) : c.rental.noSize;
    $$("[data-range]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.range === state.range)));
}

function total()
{
    const n = Number($("#guests").value);
    const valid = Number.isInteger(n) && n >= Number($("#guests").min) && n <= 24;
    if (!valid)
    {
        return { total: null, lines: [c.planner.errors.guests(Number($("#guests").min))] };
    }
    if (state.mode === "Party")
    {
        const p = packageChoice();
        return { total: p.price + Math.max(0, n - p.guests) * 18, lines: [c.planner.arithmetic.party(p.name, p.price, p.guests), c.planner.arithmetic.extra(Math.max(0, n - p.guests)), c.planner.included] };
    }
    const s = session();
    if (!s)
    {
        return { total: null, lines: [c.planner.noSession] };
    }
    return { total: n * (s.price + (state.rentals && !s.included ? 5 : 0)), lines: [c.planner.arithmetic.admission(n, s.price), s.included ? c.planner.included : state.rentals ? c.planner.arithmetic.rentals(n) : c.planner.noRentals] };
}

function syncPlanner()
{
    $("#session").value = state.session;
    $("#rentalSize").value = state.size;
    $("#package").value = state.package;
    $("#package-field").hidden = state.mode !== "Party";
    $("#guests").min = state.mode === "Party" ? packageChoice().guests : 1;
    $$(".rental-check").forEach((box) =>
    {
        box.disabled = included();
        box.checked = included() || state.rentals;
    });
    $$(".included-help").forEach((el) => el.hidden = !included());
    $("#rentalSize").required = included() || state.rentals;
    $$("[data-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode)));
    $$("[data-party]").forEach((button) =>
    {
        const selected = state.mode === "Party" && button.dataset.party === state.package;
        button.setAttribute("aria-pressed", String(selected));
        button.closest(".package").classList.toggle("is-selected", selected);
    });
    const price = total();
    $("#summary").innerHTML = `${session() ? `<p class="tally-session"><strong>${session().name}</strong><br>${session().day} · ${session().time}</p>` : ""}<div class="calculation">${price.lines.map((l) => `<p>${l}</p>`).join("")}</div><div class="total"><span>${c.planner.total}</span><strong>${price.total === null ? "—" : `$${price.total}`}</strong></div><p>${c.planner.size}: ${state.size || c.planner.noSize}</p>`;
    $("#age-rule").textContent = session()?.age || c.planner.noAge;
}

function renderMenu()
{
    const items = c.snack.items.filter((item) => state.snack === "All" || item.category === state.snack);
    $("#menu-list").innerHTML = items.map((i) => `<div class="menu-item"><div><strong>${i.name}</strong>${i.diet ? `<small>${i.diet}</small>` : ""}</div><span>$${i.price}</span></div>`).join("");
    $("#snack-count").textContent = c.snack.count(items.length);
}

function chooseMode(mode)
{
    state.mode = mode;
    if (mode === "Party")
    {
        $("#guests").value = Math.max(packageChoice().guests, Number($("#guests").value) || 0);
    }
    syncPlanner();
}

document.addEventListener("click", (event) =>
{
    const button = event.target.closest("button");
    if (!button)
    {
        return;
    }
    if (button.dataset.category)
    {
        state.category = button.dataset.category;
        $$("[data-category]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        renderSessions();
    }
    if (button.dataset.session)
    {
        state.session = button.dataset.session;
        $("#age").checked = false;
        renderSessions();
        syncPlanner();
        $("#planner").scrollIntoView({ behavior: "instant" });
        $("#session").focus({ preventScroll: true });
    }
    if (button.dataset.range)
    {
        if (state.range !== button.dataset.range)
        {
            state.range = button.dataset.range;
            state.size = "";
        }
        renderSizes();
        syncPlanner();
    }
    if (button.dataset.size)
    {
        state.size = button.dataset.size;
        $$("[data-size]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        $("#chosen-size").textContent = c.rental.sizeSelected(state.size);
        syncPlanner();
    }
    if (button.dataset.party)
    {
        state.package = button.dataset.party;
        chooseMode("Party");
        $("#planner").scrollIntoView({ behavior: "instant" });
        $("#package").focus({ preventScroll: true });
    }
    if (button.dataset.mode)
    {
        chooseMode(button.dataset.mode);
    }
    if (button.dataset.snack)
    {
        state.snack = button.dataset.snack;
        $$("[data-snack]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        renderMenu();
    }
});

$("#weekday").addEventListener("change", (event) =>
{
    state.day = event.target.value;
    renderSessions();
});
$("#reset-filters").addEventListener("click", () =>
{
    state.day = c.common.days[0];
    state.category = "All";
    $("#weekday").value = state.day;
    $$("[data-category]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.category === "All")));
    renderSessions();
});
$$(".rental-check").forEach((box) => box.addEventListener("change", () =>
{
    state.rentals = box.checked;
    syncPlanner();
}));
$("#session").addEventListener("change", (event) =>
{
    state.session = event.target.value;
    $("#age").checked = false;
    syncPlanner();
    renderSessions();
});
$("#package").addEventListener("change", (event) =>
{
    state.package = event.target.value;
    chooseMode("Party");
});
$("#rentalSize").addEventListener("change", (event) =>
{
    state.size = event.target.value;
    if (state.size)
    {
        state.range = state.size.startsWith("Adult") ? "Adult" : "Youth";
    }
    renderSizes();
    syncPlanner();
});
$("#guests").addEventListener("input", syncPlanner);

function setError(id, message)
{
    $(`#${id}-error`).textContent = message;
    $(`#${id}`).setAttribute("aria-invalid", String(Boolean(message)));
}

const dialog = $("#receipt");
let previousFocus;
dialog.addEventListener("keydown", (event) =>
{
    if (event.key !== "Tab")
    {
        return;
    }
    const controls = [...dialog.querySelectorAll("button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex='0']")];
    const first = controls[0];
    const last = controls.at(-1);
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
});
function closeReceipt()
{
    dialog.close();
}
dialog.addEventListener("close", () =>
{
    document.body.classList.remove("modal-open");
    previousFocus?.focus();
});
dialog.addEventListener("click", (event) =>
{
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom))
    {
        closeReceipt();
    }
});
$(".dialog-close").addEventListener("click", closeReceipt);
$("#edit-plan").addEventListener("click", closeReceipt);
$("#clear-plan").addEventListener("click", () =>
{
    $("#plan-form").reset();
    Object.assign(state, { session: "", size: "", range: "Adult", rentals: false, mode: "Visit", package: "big" });
    ["name", "email", "session", "guests", "rentalSize", "age", "notes"].forEach((id) => setError(id, ""));
    renderSessions();
    renderSizes();
    syncPlanner();
    previousFocus = $("#name");
    closeReceipt();
});
$("#plan-form").addEventListener("submit", (event) =>
{
    event.preventDefault();
    const minimum = Number($("#guests").min);
    const guests = Number($("#guests").value);
    const errors =
    {
        name: !$("#name").value.trim() ? c.planner.errors.name : "",
        email: !$("#email").value.trim() || !$("#email").validity.valid ? c.planner.errors.email : "",
        session: !state.session ? c.planner.errors.session : "",
        guests: !Number.isInteger(guests) || guests < minimum || guests > 24 ? c.planner.errors.guests(minimum) : "",
        rentalSize: (included() || state.rentals) && !state.size ? c.planner.errors.rentalSize : "",
        notes: $("#notes").value.length > 240 ? c.planner.errors.notes : "",
        age: !$("#age").checked ? c.planner.errors.age : ""
    };
    Object.entries(errors).forEach(([id, message]) => setError(id, message));
    const first = Object.keys(errors).find((key) => errors[key]);
    if (first)
    {
        $(`#${first}`).focus();
        return;
    }
    const s = session();
    const pairs =
    [
        [c.planner.name, $("#name").value.trim()],
        [c.planner.email, $("#email").value.trim()],
        [c.planner.session, `${s.name} · ${s.day} · ${s.time}`],
        [c.planner.age, s.age],
        [c.planner.guests, guests],
        [c.planner.package, state.mode === "Party" ? packageChoice().name : c.planner.noPackage],
        [c.planner.rentalSize, state.size || c.planner.noSize],
        ...total().lines.map((l) => [l, ""]),
        [c.planner.total, `$${total().total}`],
        [c.planner.notesReceipt, $("#notes").value]
    ];
    $("#receipt-details").replaceChildren(...pairs.map(([label, value]) =>
    {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = String(value);
        row.append(dt, dd);
        return row;
    }));
    previousFocus = document.activeElement;
    document.body.classList.add("modal-open");
    dialog.showModal();
    $(".dialog-close").focus();
});

let paused = false;
try
{
    paused = localStorage.getItem("rollerloop-decoration-paused") === "true";
}
catch
{
    // The preference remains usable when browser storage is unavailable.
}
function motionPreference()
{
    document.body.classList.toggle("decoration-paused", paused);
    $("#motion-toggle").textContent = paused ? c.common.resume : c.common.pause;
    $("#motion-toggle").setAttribute("aria-pressed", String(paused));
}
$("#motion-toggle").addEventListener("click", () =>
{
    paused = !paused;
    motionPreference();
    try
    {
        localStorage.setItem("rollerloop-decoration-paused", String(paused));
    }
    catch
    {
        // Storage is optional; reservation details are never persisted.
    }
});
motionPreference();
renderSessions();
renderSizes();
renderMenu();
syncPlanner();
