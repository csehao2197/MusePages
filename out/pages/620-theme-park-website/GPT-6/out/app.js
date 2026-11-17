import { content as c } from "./content.js";

const app = document.querySelector("#app");
document.title = c.title;
const icon = (name, extra = "") => `<svg class="icon ${extra}" aria-hidden="true"><use href="./icons.svg#${name}"></use></svg>`;
const nav = () => c.nav.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("");
const brand = () => `<span class="brand"><svg class="brand-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M18 28v7M8 32h20" stroke="#4A3560" stroke-width="2"/><circle cx="18" cy="15" r="13" fill="#FF7DA5" stroke="#4A3560" stroke-width="2"/><path d="M5 15h26M18 2v26M9 6l18 18M9 24 27 6" stroke="#4A3560" stroke-width="1.5"/><circle cx="18" cy="15" r="4" fill="#FFD23F"/></svg>${c.brand}</span>`;
const zone = (ride) => c.zones[ride.zone];
const chip = (ride) => `<span class="zone-chip" style="--zone:${zone(ride).color}">${zone(ride).name}</span>`;
const heightLabel = (ride) => ride.height === "any" ? c.detail.any : `${ride.height} ${c.detail.cm}`;
const meter = (ride) => `<span class="thrill" aria-label="${c.detail.thrill}: ${ride.thrill}">${"●".repeat({ mild: 1, wild: 2, max: 3 }[ride.thrill])}${"○".repeat(3 - { mild: 1, wild: 2, max: 3 }[ride.thrill])}</span>`;
const addButton = (id) => `<button class="button mint add" data-add="${id}">${c.actions.add} ${icon("plus")}</button>`;
const meta = (ride) => `<div class="meta">${chip(ride)}${meter(ride)}<span>${heightLabel(ride)}</span></div>`;
const allItems = [...c.rides, ...c.shows];
const validIds = new Set(allItems.map((item) => item.id));
let plan = [];
let done = [];
let storageAvailable = true;
let filters = { thrill: "all", height: "all" };
let activeRide = null;
let activeDot = null;
try
{
    const readStored = (key) =>
    {
        const value = localStorage.getItem(key);
        try
        {
            return JSON.parse(value || "[]");
        }
        catch
        {
            return [];
        }
    };
    const stored = readStored("dayPlan");
    const completed = readStored("dayPlanDone");
    plan = Array.isArray(stored) ? [...new Set(stored.filter((id) => validIds.has(id)))] : [];
    done = Array.isArray(completed) ? completed.filter((id) => plan.includes(id)) : [];
}
catch
{
    storageAvailable = false;
}

function filterMarkup(location)
{
    return `<div class="filter-row">${["thrill", "height"].map((kind) =>
    {
        const values = kind === "thrill" ? c.filters.thrills : c.filters.heights;
        return `<div class="filter-group" role="group" aria-label="${c.filters[kind]} — ${location}">
            <span class="filter-label">${c.filters[kind]}</span>${values.map(([value, text]) => `<button class="filter" data-filter="${kind}" data-value="${value}" aria-pressed="${value === filters[kind]}">${text}</button>`).join("")}
        </div>`;
    }).join("")}</div>`;
}

function rideGlyph(ride)
{
    const geometry =
    {
        coaster: '<path d="M2 25h24M4 23C4 8 21 5 21 16c0 11-15 9-11 0S27 8 27 24" fill="none"/>',
        spinner: '<path d="M14 5v21M3 26h22M4 13h20" fill="none"/><circle cx="14" cy="13" r="9"/><circle cx="14" cy="13" r="3" fill="white"/><path d="m8 7 12 12M8 19 20 7" fill="none"/>',
        tower: '<path d="M11 3h7v23h-7z"/><path d="M5 27h19M14 3V0" fill="none"/><rect x="7" y="12" width="15" height="6" rx="2" fill="white"/>',
        flume: '<path d="M2 5c8 0 7 17 16 17h8" fill="none"/><path d="m9 12 6-3 3 6-6 3z"/><path d="m18 27 3-3 4 3M22 18l3-4" fill="none"/>',
        carousel: '<path d="m2 12 12-10 12 10Z"/><path d="M5 13v12h18V13M14 12v13M2 26h24" fill="none"/><path d="M9 17h10v4H9z"/>',
        wheel: '<circle cx="14" cy="12" r="10"/><path d="M14 2v20M4 12h20M7 5l14 14M7 19 21 5M14 12 8 28M14 12l6 16" fill="none"/><circle cx="14" cy="12" r="3" fill="white"/>'
    };
    return `<svg class="ride-glyph" viewBox="0 0 30 30" aria-hidden="true"><g fill="${zone(ride).color}" stroke="#4A3560" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${geometry[ride.icon]}</g></svg>`;
}

function parkMap()
{
    const spokes = Array.from({ length: 8 }, (_, i) =>
    {
        const a = i * Math.PI / 4;
        return `<path d="M675 165  ${675 + Math.cos(a) * 55} ${165 + Math.sin(a) * 55}"/>`;
    }).join("");
    const cabins = Array.from({ length: 8 }, (_, i) =>
    {
        const a = i * Math.PI / 4;
        return `<rect x="${675 + Math.cos(a) * 55 - 8}" y="${165 + Math.sin(a) * 55 - 3}" width="16" height="13" rx="4" fill="${i % 2 ? "#FF7DA5" : "#FFD23F"}" stroke="#4A3560" stroke-width="2"/>`;
    }).join("");
    const trees = [[86, 126], [122, 102], [425, 135], [473, 90], [526, 93], [845, 233], [812, 315], [835, 421], [478, 437], [420, 374], [108, 433], [77, 359], [300, 461], [590, 489], [713, 313], [385, 291]];
    return `<div class="map-art">
        <svg class="map-svg" viewBox="0 0 900 560" role="img" aria-label="${c.hero.mapAlt}">
            <path d="M77 81Q49 87 49 136L59 228Q65 271 113 279L353 275Q399 279 413 237L430 140Q437 85 384 66L196 42Q106 38 77 81Z" fill="#FF7DA5"/>
            <path d="M487 71Q452 83 464 135L485 234Q491 279 540 271L811 273Q858 273 855 226L862 134Q856 80 810 65L643 41Q539 34 487 71Z" fill="#79C7F2"/>
            <path d="M83 300Q55 326 64 375L83 450Q93 488 143 487L351 496Q405 497 415 451L427 343Q430 300 383 299L153 287Q104 282 83 300Z" fill="#FFD23F"/>
            <path d="M497 310Q466 324 477 374L489 455Q493 497 545 503L772 496Q836 490 847 449L849 353Q848 309 798 304L560 288Q519 288 497 310Z" fill="#7BD9B0"/>
            <path d="M449 521V300Q449 283 426 281L39 281M449 300Q455 282 482 282H864" fill="none" stroke="#FFF8F0" stroke-width="23" stroke-linecap="round"/>
            <path d="M449 521V300Q449 283 426 281L39 281M449 300Q455 282 482 282H864" fill="none" stroke="#4A3560" stroke-width="1.5" stroke-dasharray="3 8" stroke-linecap="round"/>
            <path d="M520 132Q545 107 585 127Q617 150 596 183Q563 205 526 181Q505 160 520 132Z" fill="#FFF8F0"/>
            <path d="M532 144q14-8 26 0m-21 17q14-8 26 0m6-11q11-7 19 0" fill="none" stroke="#79C7F2" stroke-width="2" stroke-linecap="round"/>
            <text x="559" y="169" text-anchor="middle" style="font-size:10px">${c.hero.lake}</text>
            <g stroke="#4A3560" stroke-width="2" stroke-linecap="round" fill="none">
                <path d="m641 237 34-72 34 72M636 238h78"/>
                <circle cx="675" cy="165" r="55" fill="#FFF8F0"/>
                ${spokes}
                <circle cx="675" cy="165" r="6" fill="#FFD23F"/>
            </g>
            ${cabins}
            <g fill="none" stroke="#4A3560" stroke-linejoin="round" stroke-linecap="round">
                <path d="M145 235c12-26 20-30 27-29 34 2 24-89 66-89 48 0 44 95 8 95-35 0-46-93 2-93 47 0 39 92 77 110" stroke-width="13"/>
                <path d="M145 235c12-26 20-30 27-29 34 2 24-89 66-89 48 0 44 95 8 95-35 0-46-93 2-93 47 0 39 92 77 110" stroke="#FFF8F0" stroke-width="6"/>
                <path d="M184 222v19m23-18v19m37-15v18m32-20v17m24-10v11" stroke-width="2"/>
            </g>
            <rect x="255" y="145" width="23" height="12" rx="4" fill="#FFD23F" stroke="#4A3560" stroke-width="2" transform="rotate(58 266 151)"/>
            <g stroke="#4A3560" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <ellipse cx="656" cy="408" rx="50" ry="15" fill="#FFF8F0"/>
                <path d="M617 354v51m25-51v59m29-59v59m25-59v51" fill="none"/>
                <path d="m600 355 56-46 56 46Z" fill="#FF7DA5"/>
                <path d="m619 355 37-46 19 46" fill="#FFD23F"/>
                <ellipse cx="656" cy="355" rx="56" ry="8" fill="#FFF8F0"/>
                <path d="M656 309v-20l24 7-24 7" fill="#FF7DA5"/>
                <path d="M630 384h17v10h-17zm43 0h17v10h-17z" fill="#FFD23F"/>
            </g>
            <g stroke="#4A3560" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
                <path d="M207 424h112M225 419h81M241 414V348h18v66" fill="none"/>
                <path d="M238 344h24v72h-24Z" fill="#FFF8F0"/>
                <path d="M231 377h38v15h-38Z" fill="#FF7DA5"/>
                <path d="m250 328 13 13h-26Z" fill="#FFF8F0"/>
                <path d="m285 421 23-26 22 26" fill="none"/>
            </g>
            ${trees.map(([x, y], i) => `<path d="M${x} ${y}v17" stroke="#4A3560" stroke-width="2"/><circle cx="${x}" cy="${y}" r="12" fill="${i % 3 === 0 ? "#4A3560" : "#7BD9B0"}" stroke="#4A3560" stroke-width="1.5"/>`).join("")}
            <g fill="#4A3560" opacity=".65">${[[401, 262], [417, 270], [461, 326], [436, 355], [361, 286], [745, 283], [448, 469], [481, 287]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}</g>
            <text class="zone-name" x="228" y="98" text-anchor="middle">${c.zones[0].name}</text>
            <text class="zone-name" x="681" y="85" text-anchor="middle">${c.zones[1].name}</text>
            <text class="zone-name" x="250" y="322" text-anchor="middle">${c.zones[2].name}</text>
            <text class="zone-name" x="659" y="457" text-anchor="middle">${c.zones[3].name}</text>
            <rect x="326" y="514" width="246" height="37" rx="16" fill="#8E7AAE"/>
            <text x="449" y="537" text-anchor="middle" style="font-size:13px;fill:white;letter-spacing:1px">${c.hero.entrance}</text>
            <text x="449" y="507" text-anchor="middle" style="font-size:8px;letter-spacing:2px">${c.hero.entranceSub}</text>
            <path d="m876 28-7 19 7-5 7 5Z" fill="#4A3560"/>
            <text x="876" y="22" text-anchor="middle" style="font-size:9px">${c.hero.north}</text>
        </svg>
        ${c.rides.map((ride, i) => `<button class="map-dot" data-ride="${ride.id}" style="left:${ride.x / 9}%;top:${ride.y / 5.6}%;--zone:${zone(ride).color};--i:${i}" aria-label="${ride.name}, ${zone(ride).name}, ${ride.thrill}, ${heightLabel(ride)}" aria-expanded="false" aria-controls="ride-details"><span>${String(i + 1).padStart(2, "0")}</span></button>`).join("")}
    </div>`;
}

app.innerHTML = `
    <a class="skip" href="#map">${c.header.skip}</a>
    <header>
        <div class="wrap header-inner">
            <a href="#map" aria-label="${c.brand}">${brand()}</a>
            <nav class="nav" aria-label="${c.header.navigation}">${nav()}<a class="button pink" href="#tickets">${c.header.tickets}</a><button class="icon-button menu" aria-label="${c.header.menu}" aria-expanded="false" aria-controls="mobile-nav">${icon("menu")}</button></nav>
        </div>
        <nav class="mobile-nav" id="mobile-nav" hidden>${nav()}</nav>
    </header>
    <main>
        <section class="hero wrap" id="map">
            <div class="hero-text">
                <div>
                    <p class="eyebrow">${c.hero.eyebrow}</p>
                    <h1>${c.hero.title}</h1>
                    <p class="intro">${c.hero.intro}</p>
                    <div class="hero-actions"><a class="button pink" href="#plan">${c.hero.plan}${icon("arrow-down")}</a><a class="button" href="#tickets">${c.hero.tickets}</a></div>
                </div>
                <div class="stamp" aria-hidden="true"><small>${c.hero.stamp[0]}</small><b>${c.hero.stamp[1]}<br>${c.hero.stamp[2]}</b><small>${c.hero.stamp[3]}</small></div>
            </div>
            <div class="map-panel">
                <div class="map-top"><div><div class="micro">${c.hero.mapLabel}</div><h2>${c.hero.mapTitle}</h2></div><p>${c.hero.mapHint}</p></div>
                <p class="swipe-hint">${c.hero.scroll} ${icon("arrow-right")}</p>
                <div class="map-scroll" tabindex="0" aria-label="${c.hero.scroll}">${parkMap()}</div>
                <div class="filter-bar">${filterMarkup(c.nav[0][0])}</div>
                <div class="map-bottom">
                    <div class="zone-legend">${c.zones.map((z) => `<span style="--zone:${z.color}"><i></i>${z.name}</span>`).join("")}</div>
                    <span class="map-count" aria-live="polite"></span>
                </div>
                <div id="ride-details" class="popover" role="dialog" aria-modal="false" aria-labelledby="detail-title" hidden></div>
            </div>
            <div class="map-caption"><span>${c.hero.legend}</span><span>${c.hero.mapNumber}</span></div>
            <p class="sr-only">${c.filters.help}</p>
        </section>
        <section class="section wrap" id="rides">
            <div class="section-top"><div><p class="eyebrow">${c.rideSection.label}</p><h2>${c.rideSection.title}</h2><p class="section-intro">${c.rideSection.intro}</p></div><span class="section-number">${c.rideSection.number}</span></div>
            <div class="ride-filters">${filterMarkup(c.nav[1][0])}<p class="count" aria-live="polite"></p></div>
            <div class="grid ride-grid">${c.rides.slice(0, 9).map((ride, i) => `<article class="ride-card" data-card="${ride.id}">
                <div class="card-heading">${rideGlyph(ride)}<span class="ride-number">${String(i + 1).padStart(2, "0")} / ${zone(ride).key.toUpperCase()}</span></div>
                <h3>${ride.name}</h3><p>${ride.blurb}</p>${meta(ride)}${addButton(ride.id)}
            </article>`).join("")}</div>
            <p class="sample-note">${c.rideSection.note}</p>
        </section>
        <section class="section wrap" id="tickets">
            <div class="section-top"><div><p class="eyebrow">${c.ticketSection.label}</p><h2>${c.ticketSection.title}</h2><p class="section-intro">${c.ticketSection.intro}</p></div><span class="section-number">${c.ticketSection.number}</span></div>
            <div class="grid ticket-grid">${c.tickets.map((ticket, i) => `<article class="ticket-card ${i === 1 ? "featured" : ""}">
                ${i === 1 ? `<span class="ribbon">${c.ticketSection.ribbon}</span>` : ""}
                <h3>${ticket.name}</h3><div class="price">${ticket.price}</div><p class="ticket-unit">${ticket.unit}</p>
                <ul class="perks">${ticket.perks.map((perk) => `<li>${icon("check")}${perk}</li>`).join("")}</ul>
                <button class="button dark" data-ticket="${i}">${c.ticketSection.buy}${icon("arrow-right")}</button>
            </article>`).join("")}</div>
            <div class="demo-note" role="status" hidden></div><p class="sample-note">${c.ticketSection.sample}</p>
        </section>
        <section class="section wrap" id="shows">
            <div class="hours-strip"><div class="hours-main">${icon("sun", "sun")}<div><div class="micro">${c.hours.label}</div><strong>${c.hours.time}</strong></div></div><span class="micro">${c.hours.note}</span></div>
            <div class="section-top"><div><p class="eyebrow">${c.hours.labelShows}</p><h2>${c.hours.title}</h2><p class="section-intro">${c.hours.intro}</p></div></div>
            <div class="grid show-grid">${c.shows.map((show) => `<article class="show-card"><span class="show-time">${icon("clock")} ${show.time}</span><h3>${show.name}</h3><span class="zone-chip">${show.zoneName}</span><p>${show.blurb}</p>${addButton(show.id)}</article>`).join("")}</div>
        </section>
        <section class="section wrap plan-section" id="plan">
            <div class="plan-heading"><p class="eyebrow">${c.plan.label}</p><h2>${c.plan.title}</h2><p class="section-intro">${c.plan.intro}</p></div>
            <div class="plan-panel"><div id="plan-content"></div><div class="plan-bottom"><button class="button clear">${c.actions.clear}</button><p class="summary" aria-live="polite"></p></div></div>
            <p class="plan-note"></p>
        </section>
    </main>
    <footer><div class="wrap footer-inner"><div>${brand()}<p>${icon("map-pin")} ${c.footer.address}</p></div><div class="footer-links"><div class="signoff">${c.footer.signoff}</div><nav>${nav()}</nav><a class="credit" href="${c.footer.creditUrl}" target="_blank" rel="noopener noreferrer">${c.footer.credit}</a> <span class="credit">·</span> <a class="credit" href="${c.footer.licenseUrl}" target="_blank" rel="noopener noreferrer">${c.footer.license}</a></div></div></footer>
    <div class="sr-only" id="announcer" role="status" aria-live="polite"></div>
`;

function matches(ride)
{
    const thrill = filters.thrill === "all" || ride.thrill === filters.thrill;
    const height = filters.height === "all" || (filters.height === "any" ? ride.height === "any" : (ride.height === "any" || Number(ride.height) <= Number(filters.height)));
    return thrill && height;
}

function updateFilters()
{
    document.querySelectorAll("[data-filter]").forEach((button) =>
    {
        button.setAttribute("aria-pressed", String(filters[button.dataset.filter] === button.dataset.value));
    });
    c.rides.forEach((ride) =>
    {
        const matching = matches(ride);
        document.querySelectorAll(`[data-ride="${ride.id}"], [data-card="${ride.id}"]`).forEach((element) =>
        {
            element.classList.toggle("dimmed", !matching);
            if (matching && element.matches("[data-card]"))
            {
                element.classList.remove("bounce");
                void element.offsetWidth;
                element.classList.add("bounce");
            }
        });
    });
    document.querySelector(".map-count").textContent = `${c.rides.filter(matches).length} / ${c.rides.length} ${c.hero.count}`;
    document.querySelector(".count").textContent = `${c.rides.slice(0, 9).filter(matches).length} / ${c.rides.slice(0, 9).length} ${c.rideSection.count}`;
}

function persist()
{
    try
    {
        localStorage.setItem("dayPlan", JSON.stringify(plan));
        localStorage.setItem("dayPlanDone", JSON.stringify(done));
    }
    catch
    {
        storageAvailable = false;
    }
}

function updateAddButtons()
{
    document.querySelectorAll("[data-add]").forEach((button) =>
    {
        const added = plan.includes(button.dataset.add);
        button.innerHTML = `${added ? c.actions.added : c.actions.add} ${icon(added ? "check" : "plus")}`;
        button.setAttribute("aria-disabled", String(added));
    });
}

function renderPlan(focusId, action)
{
    const container = document.querySelector("#plan-content");
    container.innerHTML = plan.length ? `<ol class="plan-list" aria-label="${c.plan.labelList}">${plan.map((id, i) =>
    {
        const item = allItems.find((entry) => entry.id === id);
        return `<li class="plan-row ${done.includes(id) ? "done" : ""}" data-plan="${id}">
            <span class="plan-number">${i + 1}</span><label class="check-target"><input type="checkbox" class="plan-check" data-complete="${id}" ${done.includes(id) ? "checked" : ""} aria-label="${done.includes(id) ? c.actions.undo : c.actions.done}: ${item.name}"></label>
            <div class="plan-name"><strong>${item.name}</strong>${item.zone !== undefined ? chip(item) : `<span class="zone-chip">${item.zoneName} · ${item.time}</span>`}</div>
            <div class="row-actions">
                <button class="icon-button" data-move="${id}" data-direction="-1" aria-label="${c.actions.up}: ${item.name}" ${i === 0 ? "disabled" : ""}>${icon("arrow-up")}</button>
                <button class="icon-button" data-move="${id}" data-direction="1" aria-label="${c.actions.down}: ${item.name}" ${i === plan.length - 1 ? "disabled" : ""}>${icon("arrow-down")}</button>
                <button class="icon-button" data-remove="${id}" aria-label="${c.actions.remove}: ${item.name}">${icon("x")}</button>
            </div>
        </li>`;
    }).join("")}</ol>` : `<div class="empty"><p class="display">${c.plan.empty}</p><a href="#map">${c.plan.emptyLink} ${icon("arrow-up")}</a></div>`;
    const items = plan.map((id) => allItems.find((item) => item.id === id));
    document.querySelector(".summary").textContent = `${plan.length} ${c.plan.stops} · ${items.filter((item) => item.zone !== undefined).length} ${c.plan.rides} · ${items.filter((item) => item.kind === "show").length} ${c.plan.shows} · ${items.filter((item) => item.kind === "parade").length} ${c.plan.parades} · ${done.length} ${c.plan.completed}`;
    document.querySelector(".plan-note").textContent = storageAvailable ? c.plan.note : c.detail.unavailable;
    document.querySelector(".clear").disabled = plan.length === 0;
    updateAddButtons();
    if (focusId)
    {
        let target = action === "check" ? document.querySelector(`[data-complete="${focusId}"]`) : document.querySelector(`[data-plan="${focusId}"] [data-direction="${action}"]:not(:disabled)`);
        target ||= document.querySelector(`[data-plan="${focusId}"] [data-remove]`);
        target?.focus({ preventScroll: true });
    }
}

function confetti(button)
{
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = button.getBoundingClientRect();
    const burst = document.createElement("span");
    burst.className = "confetti";
    burst.setAttribute("aria-hidden", "true");
    burst.style.left = `${rect.left + rect.width / 2}px`;
    burst.style.top = `${rect.top + 8}px`;
    burst.innerHTML = Array.from({ length: 6 }, (_, i) => `<i style="--c:${c.zones[i % 4].color};--x:${(i - 2.5) * 17}px;animation-delay:${i * 12}ms"></i>`).join("");
    document.body.append(burst);
    setTimeout(() => burst.remove(), 750);
}

function closePopover(restore = false)
{
    const wasOpen = activeRide !== null;
    document.querySelector("#ride-details").hidden = true;
    if (activeDot)
    {
        activeDot.setAttribute("aria-expanded", "false");
        if (restore && wasOpen) activeDot.focus({ preventScroll: true });
    }
    activeRide = null;
}

function openPopover(dot)
{
    if (activeRide === dot.dataset.ride)
    {
        closePopover(true);
        return;
    }
    closePopover();
    activeRide = dot.dataset.ride;
    activeDot = dot;
    const ride = c.rides.find((entry) => entry.id === activeRide);
    const panel = document.querySelector("#ride-details");
    panel.innerHTML = `<button class="icon-button close" aria-label="${c.actions.close}">${icon("x")}</button><h3 id="detail-title">${ride.name}</h3>${meta(ride)}<p>${ride.blurb}</p>${addButton(ride.id)}`;
    panel.hidden = false;
    dot.setAttribute("aria-expanded", "true");
    updateAddButtons();
    panel.querySelector(".close").focus({ preventScroll: true });
}

function setMenu(open)
{
    const button = document.querySelector(".menu");
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? c.header.close : c.header.menu);
    button.innerHTML = icon(open ? "x" : "menu");
    document.querySelector(".mobile-nav").hidden = !open;
}

document.addEventListener("click", (event) =>
{
    const target = event.target;
    const insideHeader = Boolean(target.closest("header"));
    const menuButton = target.closest(".menu");
    const mobileLink = target.closest(".mobile-nav a");
    const dot = target.closest("[data-ride]");
    if (dot)
    {
        openPopover(dot);
        return;
    }
    if (target.closest(".close"))
    {
        closePopover(true);
        return;
    }
    if (activeRide && !target.closest(".popover")) closePopover();
    const filter = target.closest("[data-filter]");
    if (filter)
    {
        filters[filter.dataset.filter] = filter.dataset.value;
        updateFilters();
    }
    const add = target.closest("[data-add]");
    if (add && !plan.includes(add.dataset.add))
    {
        plan.push(add.dataset.add);
        persist();
        confetti(add);
        renderPlan();
        document.querySelector("#announcer").textContent = `${allItems.find((item) => item.id === add.dataset.add).name}. ${c.detail.added}`;
    }
    const remove = target.closest("[data-remove]");
    if (remove)
    {
        const at = plan.indexOf(remove.dataset.remove);
        plan = plan.filter((id) => id !== remove.dataset.remove);
        done = done.filter((id) => id !== remove.dataset.remove);
        persist();
        renderPlan(plan[Math.min(at, plan.length - 1)], "remove");
        if (!plan.length) document.querySelector(".empty a").focus({ preventScroll: true });
    }
    const move = target.closest("[data-move]");
    if (move)
    {
        const index = plan.indexOf(move.dataset.move);
        const destination = index + Number(move.dataset.direction);
        if (destination >= 0 && destination < plan.length)
        {
            const before = new Map([...document.querySelectorAll("[data-plan]")].map((row) => [row.dataset.plan, row.getBoundingClientRect().top]));
            [plan[index], plan[destination]] = [plan[destination], plan[index]];
            persist();
            renderPlan(move.dataset.move, move.dataset.direction);
            if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
            {
                document.querySelectorAll("[data-plan]").forEach((row) =>
                {
                    row.animate([{ transform: `translateY(${before.get(row.dataset.plan) - row.getBoundingClientRect().top}px)` }, { transform: "translateY(0)" }], { duration: 300, easing: "ease-out" });
                });
            }
        }
    }
    const ticket = target.closest("[data-ticket]");
    if (ticket)
    {
        const note = document.querySelector(".demo-note");
        note.hidden = false;
        note.textContent = `${c.ticketSection.selected} ${c.tickets[Number(ticket.dataset.ticket)].name}. ${c.ticketSection.note}`;
    }
    if (target.closest(".clear"))
    {
        plan = [];
        done = [];
        persist();
        renderPlan();
        document.querySelector(".empty a").focus({ preventScroll: true });
    }
    if (menuButton) setMenu(document.querySelector(".menu").getAttribute("aria-expanded") !== "true");
    if (mobileLink) setMenu(false);
    if (!insideHeader && !document.querySelector(".mobile-nav").hidden) setMenu(false);
});

document.addEventListener("change", (event) =>
{
    const input = event.target.closest("[data-complete]");
    if (!input) return;
    done = done.filter((id) => id !== input.dataset.complete);
    if (input.checked) done.push(input.dataset.complete);
    persist();
    renderPlan(input.dataset.complete, "check");
});

document.addEventListener("keydown", (event) =>
{
    if (event.key === "Escape")
    {
        closePopover(true);
        if (!document.querySelector(".mobile-nav").hidden)
        {
            setMenu(false);
            document.querySelector(".menu").focus();
        }
    }
});

const observer = new IntersectionObserver((entries) =>
{
    entries.forEach((entry) =>
    {
        if (entry.isIntersecting)
        {
            entry.target.classList.add("reveal");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: .12 });
document.querySelectorAll(".section-top, .ride-card, .ticket-card, .show-card, .hours-strip, .plan-panel").forEach((element, index) =>
{
    element.style.animationDelay = `${index % 3 * 70}ms`;
    observer.observe(element);
});
updateFilters();
renderPlan();
